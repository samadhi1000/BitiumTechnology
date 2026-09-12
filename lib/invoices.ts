import { supabase } from './supabase';
import { getNextInvoiceNumber, commitInvoiceCounter } from './order-utils';

export interface InvoiceLineItem {
  id: string;
  productId?: string;
  variantId?: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
}

export interface SavedPOSInvoice {
  id: string;
  invoiceNo: string;
  invoiceDate: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  issuedBy?: string;
  paymentMethod: 'Cash' | 'Card' | 'Bank Transfer' | 'PayHere';
  paymentStatus?: 'PAID' | 'COD' | 'UNPAID' | 'ADVANCE';
  deliveryMethod?: string;
  discountValue: number;
  discountType: 'percentage' | 'flat';
  discountAmount: number;
  extraCharges: number;
  extraChargesNotes: string;
  subtotal: number;
  totalAmount: number;
  lineItems: InvoiceLineItem[];
  printLayout: 'A4' | 'POS-80mm';
  status: 'PAID' | 'REFUNDED' | 'CANCELLED';
}

const LOCAL_STORAGE_KEY = 'bitium_pos_invoices';

/**
 * Reads local cached invoices from localStorage.
 */
export function getLocalCachedInvoices(): SavedPOSInvoice[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to parse local cached invoices:', e);
  }
  return [];
}

/**
 * Saves invoices array to localStorage and dispatches a local update event.
 */
export function setLocalCachedInvoices(invoices: SavedPOSInvoice[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(invoices));
    window.dispatchEvent(new CustomEvent('bitium_pos_invoices_updated', { detail: invoices }));
  } catch (e) {
    console.error('Failed to set local cached invoices:', e);
  }
}

/**
 * Fetches all saved invoices from the central server/database,
 * seamlessly merges with local cache, uploads any unsynced local invoices,
 * and updates localStorage so all admins stay in perfect sync.
 */
export async function fetchInvoices(): Promise<SavedPOSInvoice[]> {
  const localList = getLocalCachedInvoices();

  try {
    const res = await fetch('/api/invoices', {
      method: 'GET',
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.invoices)) {
        const serverInvoices: SavedPOSInvoice[] = data.invoices;

        // Map for merging
        const map = new Map<string, SavedPOSInvoice>();

        // 1. Put local items first
        localList.forEach((inv) => {
          const key = inv.invoiceNo || inv.id;
          if (key) map.set(key, inv);
        });

        // 2. Put server items (server items take authoritative precedence)
        serverInvoices.forEach((inv) => {
          const key = inv.invoiceNo || inv.id;
          if (key) map.set(key, inv);
        });

        const merged = Array.from(map.values()).sort((a, b) => {
          const dateA = new Date(a.createdAt || a.invoiceDate).getTime();
          const dateB = new Date(b.createdAt || b.invoiceDate).getTime();
          return dateB - dateA;
        });

        // If there were local invoices that the server didn't have, sync them to server in background
        const serverKeys = new Set(serverInvoices.map((i) => i.invoiceNo || i.id));
        localList.forEach((localInv) => {
          const key = localInv.invoiceNo || localInv.id;
          if (key && !serverKeys.has(key)) {
            // Background push to server
            fetch('/api/invoices', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(localInv),
            }).catch(() => {});
          }
        });

        // Update local cache
        setLocalCachedInvoices(merged);

        // Commit latest invoice counter
        merged.forEach((inv) => {
          if (inv.invoiceNo) commitInvoiceCounter(inv.invoiceNo);
        });

        return merged;
      }
    }
  } catch (error) {
    console.warn('Network error while fetching invoices from server, using local cache:', error);
  }

  return localList;
}

/**
 * Saves or updates an invoice to the central database and local cache.
 */
export async function saveInvoice(invoice: SavedPOSInvoice): Promise<{ success: boolean; invoice: SavedPOSInvoice }> {
  // 1. Immediate optimistic local storage update
  const localList = getLocalCachedInvoices();
  const existingIdx = localList.findIndex(
    (i) => i.invoiceNo === invoice.invoiceNo || i.id === invoice.id
  );

  let updatedList: SavedPOSInvoice[];
  if (existingIdx >= 0) {
    updatedList = [...localList];
    updatedList[existingIdx] = invoice;
  } else {
    updatedList = [invoice, ...localList];
  }

  setLocalCachedInvoices(updatedList);
  commitInvoiceCounter(invoice.invoiceNo);

  // 2. Persist to API & Supabase
  try {
    const res = await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoice),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.invoice) {
        return { success: true, invoice: data.invoice };
      }
    }
  } catch (err) {
    console.error('Error syncing invoice to server:', err);
  }

  return { success: true, invoice };
}

/**
 * Deletes an invoice from central database and local cache.
 */
export async function deleteInvoice(id: string, invoiceNo: string): Promise<boolean> {
  // 1. Immediate optimistic local removal
  const localList = getLocalCachedInvoices();
  const filtered = localList.filter((i) => i.id !== id && i.invoiceNo !== invoiceNo);
  setLocalCachedInvoices(filtered);

  // 2. Delete on central server
  try {
    const params = new URLSearchParams();
    if (id) params.set('id', id);
    if (invoiceNo) params.set('invoiceNo', invoiceNo);

    await fetch(`/api/invoices?${params.toString()}`, {
      method: 'DELETE',
    });
    return true;
  } catch (err) {
    console.error('Error deleting invoice on server:', err);
    return false;
  }
}

/**
 * Sets up a realtime subscriber to listen for invoice additions/changes across all admins.
 */
export function subscribeToInvoices(onUpdate: (invoices: SavedPOSInvoice[]) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  // 1. Listen for custom window event
  const handleCustomEvent = () => {
    onUpdate(getLocalCachedInvoices());
  };
  window.addEventListener('bitium_pos_invoices_updated', handleCustomEvent);

  // 2. Listen for Supabase Realtime changes on pos_invoices table
  let channel: any = null;
  try {
    channel = supabase
      .channel('pos_invoices_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pos_invoices' },
        async () => {
          const fresh = await fetchInvoices();
          onUpdate(fresh);
        }
      )
      .subscribe();
  } catch (e) {
    console.warn('Realtime subscription not supported or failed to initialize:', e);
  }

  // 3. Fallback Periodic Polling (every 30 seconds) to ensure multiple admin tabs stay in sync
  const intervalId = setInterval(async () => {
    try {
      const fresh = await fetchInvoices();
      onUpdate(fresh);
    } catch {}
  }, 30000);

  return () => {
    window.removeEventListener('bitium_pos_invoices_updated', handleCustomEvent);
    clearInterval(intervalId);
    if (channel) {
      try {
        supabase.removeChannel(channel);
      } catch {}
    }
  };
}
