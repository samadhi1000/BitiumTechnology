import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';

const invoicesFilePath = path.join(process.cwd(), 'lib', 'pos-invoices.json');

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

function readLocalFallbackInvoices(): SavedPOSInvoice[] {
  try {
    if (fs.existsSync(invoicesFilePath)) {
      const fileData = fs.readFileSync(invoicesFilePath, 'utf-8');
      const parsed = JSON.parse(fileData);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading local invoices fallback file:', err);
  }
  return [];
}

function writeLocalFallbackInvoices(invoices: SavedPOSInvoice[]): void {
  try {
    fs.writeFileSync(invoicesFilePath, JSON.stringify(invoices, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local invoices fallback file:', err);
  }
}

function formatRowToInvoice(row: any): SavedPOSInvoice {
  return {
    id: row.id,
    invoiceNo: row.invoice_no,
    invoiceDate: row.invoice_date ? String(row.invoice_date).split('T')[0] : new Date().toISOString().split('T')[0],
    createdAt: row.created_at || new Date().toISOString(),
    customerName: row.customer_name || 'Walk-in Client',
    customerPhone: row.customer_phone || '',
    customerAddress: row.customer_address || '',
    issuedBy: row.issued_by || 'Indrajith Admin',
    paymentMethod: row.payment_method || 'Cash',
    paymentStatus: row.payment_status || 'PAID',
    deliveryMethod: row.delivery_method || 'Store Pickup',
    discountValue: Number(row.discount_value) || 0,
    discountType: row.discount_type || 'flat',
    discountAmount: Number(row.discount_amount) || 0,
    extraCharges: Number(row.extra_charges) || 0,
    extraChargesNotes: row.extra_charges_notes || '',
    subtotal: Number(row.subtotal) || 0,
    totalAmount: Number(row.total_amount) || 0,
    lineItems: Array.isArray(row.line_items) ? row.line_items : [],
    printLayout: row.print_layout || 'A4',
    status: row.status || 'PAID',
  };
}

function formatInvoiceToRow(inv: SavedPOSInvoice): any {
  return {
    id: inv.id,
    invoice_no: inv.invoiceNo,
    invoice_date: inv.invoiceDate || new Date().toISOString().split('T')[0],
    customer_name: inv.customerName || 'Walk-in Client',
    customer_phone: inv.customerPhone || '',
    customer_address: inv.customerAddress || '',
    issued_by: inv.issuedBy || 'Indrajith Admin',
    payment_method: inv.paymentMethod || 'Cash',
    payment_status: inv.paymentStatus || 'PAID',
    delivery_method: inv.deliveryMethod || 'Store Pickup',
    discount_value: Number(inv.discountValue) || 0,
    discount_type: inv.discountType || 'flat',
    discount_amount: Number(inv.discountAmount) || 0,
    extra_charges: Number(inv.extraCharges) || 0,
    extra_charges_notes: inv.extraChargesNotes || '',
    subtotal: Number(inv.subtotal) || 0,
    total_amount: Number(inv.totalAmount) || 0,
    line_items: Array.isArray(inv.lineItems) ? inv.lineItems : [],
    print_layout: inv.printLayout || 'A4',
    status: inv.status || 'PAID',
    updated_at: new Date().toISOString(),
  };
}

// GET: Fetch all saved invoices across all admins
export async function GET() {
  try {
    let dbInvoices: SavedPOSInvoice[] = [];
    let isDbAvailable = false;
    let supabaseError: any = null;

    try {
      const { data, error } = await supabase
        .from('pos_invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        supabaseError = error;
        console.warn('Supabase query pos_invoices warning:', error.message);
      } else if (data) {
        isDbAvailable = true;
        dbInvoices = data.map(formatRowToInvoice);
      }
    } catch (e: any) {
      supabaseError = e;
      console.warn('Supabase fetch error for pos_invoices:', e.message);
    }

    let finalInvoices: SavedPOSInvoice[];

    if (isDbAvailable) {
      // Database is the authoritative source of truth!
      finalInvoices = dbInvoices;
      // Sync local fallback file with exact DB state
      writeLocalFallbackInvoices(finalInvoices);
    } else {
      // Fallback if DB is unreachable
      finalInvoices = readLocalFallbackInvoices();
    }

    return NextResponse.json({
      success: true,
      invoices: finalInvoices,
      fromDatabase: isDbAvailable,
      supabaseError: supabaseError ? supabaseError.message : null,
    });
  } catch (error: any) {
    console.error('API /api/invoices GET error:', error);
    const fallback = readLocalFallbackInvoices();
    return NextResponse.json({
      success: true,
      invoices: fallback,
      fromDatabase: false,
      error: error.message,
    });
  }
}

// POST: Save or update an invoice
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || !body.invoiceNo) {
      return NextResponse.json({ success: false, error: 'Missing invoice data' }, { status: 400 });
    }

    const invoice: SavedPOSInvoice = {
      id: body.id || `inv-${Date.now()}`,
      invoiceNo: body.invoiceNo,
      invoiceDate: body.invoiceDate || new Date().toISOString().split('T')[0],
      createdAt: body.createdAt || new Date().toISOString(),
      customerName: body.customerName || 'Walk-in Client',
      customerPhone: body.customerPhone || '',
      customerAddress: body.customerAddress || '',
      issuedBy: body.issuedBy || 'Indrajith Admin',
      paymentMethod: body.paymentMethod || 'Cash',
      paymentStatus: body.paymentStatus || 'PAID',
      deliveryMethod: body.deliveryMethod || 'Store Pickup',
      discountValue: Number(body.discountValue) || 0,
      discountType: body.discountType || 'flat',
      discountAmount: Number(body.discountAmount) || 0,
      extraCharges: Number(body.extraCharges) || 0,
      extraChargesNotes: body.extraChargesNotes || '',
      subtotal: Number(body.subtotal) || 0,
      totalAmount: Number(body.totalAmount) || 0,
      lineItems: Array.isArray(body.lineItems) ? body.lineItems : [],
      printLayout: body.printLayout || 'A4',
      status: body.status || 'PAID',
    };

    // 1. Upsert into Supabase
    let supabaseSuccess = false;
    try {
      const row = formatInvoiceToRow(invoice);
      const { error } = await supabase
        .from('pos_invoices')
        .upsert(row, { onConflict: 'invoice_no' });

      if (error) {
        console.warn('Supabase upsert pos_invoices warning:', error.message);
      } else {
        supabaseSuccess = true;
      }
    } catch (e: any) {
      console.warn('Supabase pos_invoices upsert exception:', e.message);
    }

    // 2. Persist into local fallback file
    const localInvoices = readLocalFallbackInvoices();
    const existingIndex = localInvoices.findIndex(
      (i) => i.invoiceNo === invoice.invoiceNo || i.id === invoice.id
    );
    let updatedLocal: SavedPOSInvoice[];
    if (existingIndex >= 0) {
      updatedLocal = [...localInvoices];
      updatedLocal[existingIndex] = invoice;
    } else {
      updatedLocal = [invoice, ...localInvoices];
    }
    writeLocalFallbackInvoices(updatedLocal);

    return NextResponse.json({
      success: true,
      invoice,
      syncedToDatabase: supabaseSuccess,
    });
  } catch (error: any) {
    console.error('API /api/invoices POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Remove an invoice completely from database and fallback store
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get('id');
    let invoiceNo = searchParams.get('invoiceNo');

    // Also check JSON body if available
    try {
      const body = await req.json();
      if (body) {
        if (!id && body.id) id = body.id;
        if (!invoiceNo && body.invoiceNo) invoiceNo = body.invoiceNo;
      }
    } catch {}

    if (!id && !invoiceNo) {
      return NextResponse.json({ success: false, error: 'Missing invoice id or invoiceNo' }, { status: 400 });
    }

    // 1. Delete from Supabase
    try {
      if (invoiceNo) {
        const { error: err1 } = await supabase
          .from('pos_invoices')
          .delete()
          .eq('invoice_no', invoiceNo);
        if (err1) console.warn('Supabase delete by invoice_no warning:', err1.message);
      }
      if (id) {
        const { error: err2 } = await supabase
          .from('pos_invoices')
          .delete()
          .eq('id', id);
        if (err2) console.warn('Supabase delete by id warning:', err2.message);
      }
    } catch (e) {
      console.warn('Supabase pos_invoices delete exception:', e);
    }

    // 2. Delete from local fallback file
    const localInvoices = readLocalFallbackInvoices();
    const filtered = localInvoices.filter((i) => {
      if (invoiceNo && i.invoiceNo === invoiceNo) return false;
      if (id && i.id === id) return false;
      return true;
    });
    writeLocalFallbackInvoices(filtered);

    return NextResponse.json({ success: true, deleted: { id, invoiceNo } });
  } catch (error: any) {
    console.error('API /api/invoices DELETE error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
