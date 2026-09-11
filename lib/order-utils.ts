/**
 * Order and Invoice numbering utilities for Bitium Technology.
 * Generates sequential IDs:
 * - Orders: BTO-00001, BTO-00002, BTO-00003...
 * - Invoices: BTI-00001, BTI-00002, BTI-00003...
 */

export interface BaseOrderItem {
  id: string;
  customerName?: string;
  whatsappNo?: string;
  address?: string;
  [key: string]: any;
}

const DUMMY_NAMES = [
  'kavindu perera',
  'dilani wickramasinghe',
  'nimal jayasuriya',
  'sanduni fernando',
];

const DUMMY_ID_PREFIXES = [
  'ord-9821',
  'ord-9822',
  'ord-9823',
  'ord-9824',
  'ord-empty',
];

/**
 * Checks whether an order item is a sample/dummy order from earlier versions.
 */
export function isDummyOrder(order: BaseOrderItem | null | undefined): boolean {
  if (!order || !order.id) return true;
  const idLower = (order.id || '').toLowerCase().trim();
  const nameLower = (order.customerName || '').toLowerCase().trim();

  if (DUMMY_ID_PREFIXES.some(prefix => idLower.startsWith(prefix))) {
    return true;
  }
  if (DUMMY_NAMES.includes(nameLower)) {
    return true;
  }
  return false;
}

/**
 * Filters an array of orders to exclude dummy/sample records.
 */
export function filterRealOrders<T extends BaseOrderItem>(orders: T[]): T[] {
  if (!Array.isArray(orders)) return [];
  return orders.filter(o => !isDummyOrder(o));
}

/**
 * Returns the next sequential Order Number (e.g. BTO-00001, BTO-00002...)
 * and persists the updated counter to localStorage.
 */
export function getNextOrderNumber(): string {
  if (typeof window === 'undefined') {
    return 'BTO-00001';
  }

  try {
    let maxNum = 0;
    const existing = JSON.parse(localStorage.getItem('bitium_orders') || '[]');
    if (Array.isArray(existing)) {
      existing.forEach((o: any) => {
        if (isDummyOrder(o)) return;
        const match = (o.id || '').match(/BTO-(\d+)/i);
        if (match) {
          const num = parseInt(match[1], 10);
          if (!isNaN(num) && num > maxNum) maxNum = num;
        }
      });
    }

    const storedCounter = localStorage.getItem('bitium_order_counter');
    if (storedCounter) {
      const cNum = parseInt(storedCounter, 10);
      if (!isNaN(cNum) && cNum > maxNum) maxNum = cNum;
    }

    const nextNum = maxNum + 1;
    localStorage.setItem('bitium_order_counter', nextNum.toString());
    return `BTO-${nextNum.toString().padStart(5, '0')}`;
  } catch (e) {
    return 'BTO-00001';
  }
}

/**
 * Peeks the next sequential Order Number without mutating the persistent counter.
 */
export function peekNextOrderNumber(): string {
  if (typeof window === 'undefined') {
    return 'BTO-00001';
  }

  try {
    let maxNum = 0;
    const existing = JSON.parse(localStorage.getItem('bitium_orders') || '[]');
    if (Array.isArray(existing)) {
      existing.forEach((o: any) => {
        if (isDummyOrder(o)) return;
        const match = (o.id || '').match(/BTO-(\d+)/i);
        if (match) {
          const num = parseInt(match[1], 10);
          if (!isNaN(num) && num > maxNum) maxNum = num;
        }
      });
    }

    const storedCounter = localStorage.getItem('bitium_order_counter');
    if (storedCounter) {
      const cNum = parseInt(storedCounter, 10);
      if (!isNaN(cNum) && cNum > maxNum) maxNum = cNum;
    }

    const nextNum = maxNum + 1;
    return `BTO-${nextNum.toString().padStart(5, '0')}`;
  } catch (e) {
    return 'BTO-00001';
  }
}

/**
 * Returns the next sequential Invoice Number (e.g. BTI-00001, BTI-00002...)
 */
export function getNextInvoiceNumber(existingInvoices?: any[]): string {
  if (typeof window === 'undefined') {
    return 'BTI-00001';
  }

  try {
    let maxNum = 0;
    const list = existingInvoices || JSON.parse(localStorage.getItem('bitium_pos_invoices') || '[]');
    if (Array.isArray(list)) {
      list.forEach((inv: any) => {
        const match = (inv.invoiceNo || inv.id || '').match(/BTI-(\d+)/i);
        if (match) {
          const num = parseInt(match[1], 10);
          if (!isNaN(num) && num > maxNum) maxNum = num;
        }
      });
    }

    const storedCounter = localStorage.getItem('bitium_invoice_counter');
    if (storedCounter) {
      const cNum = parseInt(storedCounter, 10);
      if (!isNaN(cNum) && cNum > maxNum) maxNum = cNum;
    }

    const nextNum = maxNum + 1;
    return `BTI-${nextNum.toString().padStart(5, '0')}`;
  } catch (e) {
    return 'BTI-00001';
  }
}

/**
 * Increments and saves the Invoice Counter.
 */
export function commitInvoiceCounter(invNo: string): void {
  if (typeof window === 'undefined') return;
  const match = invNo.match(/BTI-(\d+)/i);
  if (match) {
    const num = parseInt(match[1], 10);
    if (!isNaN(num)) {
      const stored = localStorage.getItem('bitium_invoice_counter');
      const current = stored ? parseInt(stored, 10) : 0;
      if (num > current) {
        localStorage.setItem('bitium_invoice_counter', num.toString());
      }
    }
  }
}
