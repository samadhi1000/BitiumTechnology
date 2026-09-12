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
const TOMBSTONES_KEY = 'bitium_deleted_invoices_tombstones';

/**
 * Gets the set of deleted invoice keys/numbers to avoid resurrection.
 */
export function getDeletedTombstones(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(TOMBSTONES_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return new Set(arr);
    }
  } catch {}
  return new Set();
}

/**
 * Marks an invoice as deleted in local tombstones.
 */
export function markInvoiceDeleted(id?: string, invoiceNo?: string): void {
  if (typeof window === 'undefined') return;
  try {
    const set = getDeletedTombstones();
    if (id) set.add(id);
    if (invoiceNo) set.add(invoiceNo);
    localStorage.setItem(TOMBSTONES_KEY, JSON.stringify(Array.from(set)));
  } catch {}
}

/**
 * Unmarks an invoice from tombstones (e.g. if newly created or edited).
 */
export function unmarkInvoiceDeleted(id?: string, invoiceNo?: string): void {
  if (typeof window === 'undefined') return;
  try {
    const set = getDeletedTombstones();
    if (id) set.delete(id);
    if (invoiceNo) set.delete(invoiceNo);
    localStorage.setItem(TOMBSTONES_KEY, JSON.stringify(Array.from(set)));
  } catch {}
}

/**
 * Reads local cached invoices from localStorage.
 */
export function getLocalCachedInvoices(): SavedPOSInvoice[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const tombstones = getDeletedTombstones();
        return parsed.filter((inv) => !tombstones.has(inv.id) && !tombstones.has(inv.invoiceNo));
      }
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
    const tombstones = getDeletedTombstones();
    const clean = invoices.filter((inv) => !tombstones.has(inv.id) && !tombstones.has(inv.invoiceNo));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(clean));
    window.dispatchEvent(new CustomEvent('bitium_pos_invoices_updated', { detail: clean }));
  } catch (e) {
    console.error('Failed to set local cached invoices:', e);
  }
}

/**
 * Fetches all saved invoices from the central server/database,
 * seamlessly updates local cache, and syncs across all admins.
 */
export async function fetchInvoices(): Promise<SavedPOSInvoice[]> {
  const localList = getLocalCachedInvoices();
  const tombstones = getDeletedTombstones();

  try {
    const res = await fetch('/api/invoices', {
      method: 'GET',
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.invoices)) {
        // Filter out any tombstoned/deleted records
        const serverInvoices: SavedPOSInvoice[] = data.invoices.filter(
          (inv: SavedPOSInvoice) => !tombstones.has(inv.id) && !tombstones.has(inv.invoiceNo)
        );

        // Server is the authoritative source of truth.
        setLocalCachedInvoices(serverInvoices);

        // Commit latest invoice counter
        serverInvoices.forEach((inv) => {
          if (inv.invoiceNo) commitInvoiceCounter(inv.invoiceNo);
        });

        return serverInvoices;
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
  // Clear any past deletion tombstone for this invoice
  unmarkInvoiceDeleted(invoice.id, invoice.invoiceNo);

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
 * Deletes an invoice permanently from central database, API and local cache.
 */
export async function deleteInvoice(id: string, invoiceNo: string): Promise<boolean> {
  // 1. Mark as tombstoned locally
  markInvoiceDeleted(id, invoiceNo);

  // 2. Immediate optimistic local removal
  const localList = getLocalCachedInvoices();
  const filtered = localList.filter((i) => {
    if (invoiceNo && i.invoiceNo === invoiceNo) return false;
    if (id && i.id === id) return false;
    return true;
  });
  setLocalCachedInvoices(filtered);

  // 3. Delete on central server & Supabase
  try {
    const params = new URLSearchParams();
    if (id) params.set('id', id);
    if (invoiceNo) params.set('invoiceNo', invoiceNo);

    const res = await fetch(`/api/invoices?${params.toString()}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, invoiceNo }),
    });

    return res.ok;
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
