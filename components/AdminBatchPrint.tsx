'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Printer,
  RefreshCw,
  Trash2,
  CheckCircle2,
  PackageCheck,
  FileSpreadsheet,
  Search,
  ChevronDown,
  Check,
  X
} from 'lucide-react';

export interface OrderItem {
  id: string;
  customerName: string;
  whatsappNo: string;
  shortCode?: string;
  address: string;
  mobile1?: string;
  mobile2?: string;
  category?: string;
  columnHeaders?: {
    col0: string;
    col1: string;
    col23: string;
    col4: string;
  };
  note: string;
  date: string;
  totalAmount: string;
  deliveryMethod: string;
  stencils: { code: string; qty?: string; checked: boolean }[][];
  fabricPainting: { code: string; qty?: string; checked: boolean }[][];
  accessories: {
    rollerBrush: boolean;
    paintBrush: boolean;
    fabricPaint: boolean;
    tracing: boolean;
    fabric: boolean;
  };
  checkedBy?: string;
  packedBy?: string;
  officeDate?: string;
}

const defaultDeliveryOptions = [
  { id: 'Paid Post', label: 'Paid Post' },
  { id: 'Cash On Delivery', label: 'Cash On Delivery' },
  { id: 'Cash On Delivery (On weight)', label: 'Cash On Delivery (On weight)' },
  { id: 'Paid Courier', label: 'Paid Courier' },
  { id: 'Courier (On weight)', label: 'Courier (On weight)' },
  { id: 'Store Pickup', label: 'Store Pickup' },
];

export const createEmptyOrder = (id?: string): OrderItem => ({
  id: id || `ORD-${Date.now().toString().slice(-4)}`,
  customerName: '',
  whatsappNo: '',
  shortCode: '',
  address: '',
  mobile1: '',
  mobile2: '',
  category: 'Stencils',
  columnHeaders: {
    col0: 'A1',
    col1: 'A2',
    col23: 'A3',
    col4: 'A4',
  },
  note: '',
  date: new Date().toISOString().split('T')[0],
  totalAmount: '',
  deliveryMethod: 'Cash On Delivery',
  stencils: Array.from({ length: 7 }, () =>
    Array.from({ length: 5 }, () => ({ code: '', qty: '', checked: false }))
  ),
  fabricPainting: Array.from({ length: 4 }, () =>
    Array.from({ length: 5 }, () => ({ code: '', qty: '', checked: false }))
  ),
  accessories: {
    rollerBrush: false,
    paintBrush: false,
    fabricPaint: false,
    tracing: false,
    fabric: false,
  },
  checkedBy: '',
  packedBy: '',
  officeDate: '',
});

export function QuarterOrderCard({ order }: { order: OrderItem }) {
  const shortCodeVal = order.shortCode || (order.whatsappNo ? order.whatsappNo.replace(/\D/g, '').slice(-4) : '');

  return (
    <div className="w-full h-full bg-white text-black font-sans border border-black flex flex-col justify-between select-none box-border p-1 text-[7.5px] leading-tight overflow-hidden">
      <div>
        {/* Top Header Section */}
        <div className="border border-black flex">
          {/* Top Left: WhatsApp & Details (Divided into WhatsApp No. + Short Code) */}
          <div className="w-[58%] border-r border-black p-1 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-1 font-bold text-[8px]">
              <div className="flex items-center gap-1 flex-1 min-w-0">
                <span className="shrink-0 text-[7px] uppercase font-black">WhatsApp No.</span>
                <span className="font-semibold text-[7.5px] truncate border-b border-dotted border-black flex-1">
                  {order.whatsappNo || ''}
                </span>
              </div>
              <div className="flex items-center gap-0.5 border border-black px-1 py-0.2 rounded bg-gray-100 shrink-0">
                <span className="text-[5.5px] font-extrabold uppercase text-gray-700">Code:</span>
                <span className="font-mono font-black text-[7.5px] text-black">
                  {shortCodeVal}
                </span>
              </div>
            </div>
            <div className="mt-0.5 space-y-0.5">
              <div className="border-b border-dotted border-gray-600 h-3 flex items-center overflow-hidden">
                <span className="text-[7px] font-medium truncate">
                  {order.customerName ? `Name: ${order.customerName}` : ''}
                </span>
              </div>
              <div className="border-b border-dotted border-gray-600 h-3 flex items-center overflow-hidden">
                <span className="text-[6.5px] truncate text-gray-800">
                  {order.address ? `Addr: ${order.address}` : ''}
                </span>
              </div>
              {(order.mobile1 || order.mobile2) && (
                <div className="border-b border-dotted border-gray-600 h-2.5 flex items-center overflow-hidden">
                  <span className="text-[6px] truncate text-gray-800">
                    Mob: {[order.mobile1, order.mobile2].filter(Boolean).join(', ')}
                  </span>
                </div>
              )}
              <div className="border-b border-dotted border-gray-600 h-2.5 flex items-center overflow-hidden">
                <span className="text-[6.5px] text-gray-600 truncate">
                  {order.id ? `Ref: ${order.id}` : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Top Right: Delivery Options */}
          <div className="w-[42%] p-1 text-[6.2px] font-medium flex flex-col justify-between gap-0.5 bg-gray-50/50 leading-tight">
            {defaultDeliveryOptions.map((item) => {
              const isSelected = order.deliveryMethod === item.id;
              return (
                <div key={item.id} className="flex items-center justify-between">
                  <span className={`truncate pr-0.5 ${isSelected ? 'font-bold text-black' : 'text-gray-700'}`}>
                    {item.label}
                  </span>
                  <span className="w-2.5 h-2.5 border border-black shrink-0 inline-flex items-center justify-center font-bold text-[6.5px] leading-none">
                    {isSelected ? '✓' : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Date & Total Amount */}
        <div className="border-x border-b border-black flex items-center justify-between px-1 py-0.5 text-[7.5px] font-semibold bg-gray-50/70">
          <div className="flex items-center gap-1 w-1/2 overflow-hidden">
            <span className="shrink-0">Date :</span>
            <span className="font-normal truncate border-b border-dotted border-black flex-1">
              {order.date}
            </span>
          </div>
          <div className="flex items-center gap-1 w-1/2 pl-1 overflow-hidden">
            <span className="whitespace-nowrap shrink-0">Total Amount :</span>
            <span className="font-bold truncate border-b border-dotted border-black flex-1">
              {order.totalAmount ? `Rs. ${order.totalAmount}` : ''}
            </span>
          </div>
        </div>

        {/* Note */}
        <div className="border-x border-b border-black px-1 py-0.5 text-[7px] flex items-center gap-1 overflow-hidden">
          <span className="font-semibold whitespace-nowrap shrink-0">* Note :</span>
          <span className="font-normal text-gray-700 truncate border-b border-dotted border-gray-500 flex-1">
            {order.note || ''}
          </span>
        </div>

        {/* Chart Table Header (A1, A2, A3 span 2, A4) */}
        <div className="border-x border-b border-black grid grid-cols-5 text-center font-bold text-[7px] bg-gray-100">
          <div className="col-span-1 border-r border-black py-0.5 truncate px-0.5">
            {order.columnHeaders?.col0 || 'A1'}
          </div>
          <div className="col-span-1 border-r border-black py-0.5 truncate px-0.5">
            {order.columnHeaders?.col1 || 'A2'}
          </div>
          <div className="col-span-2 border-r border-black py-0.5 truncate px-0.5">
            {order.columnHeaders?.col23 || 'A3'}
          </div>
          <div className="col-span-1 py-0.5 truncate px-0.5">
            {order.columnHeaders?.col4 || 'A4'}
          </div>
        </div>

        {/* Stencils 7 Rows */}
        <div className="border-x border-b border-black divide-y divide-gray-300">
          {order.stencils.map((row, rIdx) => (
            <div key={`st-${rIdx}`} className="grid grid-cols-5 h-[12px]">
              {row.map((cell, cIdx) => (
                <div
                  key={`st-${rIdx}-${cIdx}`}
                  className={`flex items-center justify-between px-0.5 gap-0.5 ${
                    cIdx < 4 ? 'border-r border-black' : ''
                  }`}
                >
                  <div className="flex items-center gap-0.5 truncate flex-1 min-w-0 pr-0.5">
                    {cell.qty ? (
                      <span className="text-[5.5px] font-bold bg-gray-200 px-0.5 rounded shrink-0">
                        {cell.qty}
                      </span>
                    ) : null}
                    <span className="text-[6.5px] font-mono font-medium truncate">
                      {cell.code}
                    </span>
                  </div>
                  <span className="w-2.5 h-2.5 border border-black shrink-0 inline-flex items-center justify-center font-bold text-[6.5px] leading-none">
                    {cell.checked ? '✓' : ''}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Fabric Painting Header */}
        <div className="border-x border-b border-black text-center font-bold text-[7.5px] py-0.5 bg-gray-100">
          Fabric Painting
        </div>

        {/* Fabric Painting 4 Rows */}
        <div className="border-x border-b border-black divide-y divide-gray-300">
          {order.fabricPainting.map((row, rIdx) => (
            <div key={`fab-${rIdx}`} className="grid grid-cols-5 h-[12px]">
              {row.map((cell, cIdx) => (
                <div
                  key={`fab-${rIdx}-${cIdx}`}
                  className={`flex items-center justify-between px-0.5 gap-0.5 ${
                    cIdx < 4 ? 'border-r border-black' : ''
                  }`}
                >
                  <div className="flex items-center gap-0.5 truncate flex-1 min-w-0 pr-0.5">
                    {cell.qty ? (
                      <span className="text-[5.5px] font-bold bg-gray-200 px-0.5 rounded shrink-0">
                        {cell.qty}
                      </span>
                    ) : null}
                    <span className="text-[6.5px] font-mono font-medium truncate">
                      {cell.code}
                    </span>
                  </div>
                  <span className="w-2.5 h-2.5 border border-black shrink-0 inline-flex items-center justify-center font-bold text-[6.5px] leading-none">
                    {cell.checked ? '✓' : ''}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Accessories Bottom Row */}
        <div className="border-x border-b border-black grid grid-cols-5 text-[6.5px] font-semibold bg-gray-50/50">
          <div className="border-r border-black p-0.5 flex items-center justify-between">
            <span className="leading-tight truncate pr-0.5">Roller Brush</span>
            <span className="w-2.5 h-2.5 border border-black inline-flex items-center justify-center shrink-0 font-bold text-[6.5px]">
              {order.accessories.rollerBrush ? '✓' : ''}
            </span>
          </div>
          <div className="border-r border-black p-0.5 flex items-center justify-between">
            <span className="leading-tight truncate pr-0.5">Paint Brush</span>
            <span className="w-2.5 h-2.5 border border-black inline-flex items-center justify-center shrink-0 font-bold text-[6.5px]">
              {order.accessories.paintBrush ? '✓' : ''}
            </span>
          </div>
          <div className="border-r border-black p-0.5 flex items-center justify-between">
            <span className="leading-tight truncate pr-0.5">Fabric Paint</span>
            <span className="w-2.5 h-2.5 border border-black inline-flex items-center justify-center shrink-0 font-bold text-[6.5px]">
              {order.accessories.fabricPaint ? '✓' : ''}
            </span>
          </div>
          <div className="border-r border-black p-0.5 flex items-center justify-between">
            <span className="leading-tight truncate pr-0.5">Tracing</span>
            <span className="w-2.5 h-2.5 border border-black inline-flex items-center justify-center shrink-0 font-bold text-[6.5px]">
              {order.accessories.tracing ? '✓' : ''}
            </span>
          </div>
          <div className="p-0.5 flex items-center justify-between">
            <span className="leading-tight truncate pr-0.5">Fabric</span>
            <span className="w-2.5 h-2.5 border border-black inline-flex items-center justify-center shrink-0 font-bold text-[6.5px]">
              {order.accessories.fabric ? '✓' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Footer / Office Use */}
      <div className="pt-0.5 text-[7px] font-bold flex items-center justify-between">
        <div className="flex items-center gap-0.5 w-[32%]">
          <span className="shrink-0">Check</span>
          <span className="flex-1 border-b border-dotted border-black h-2"></span>
        </div>
        <div className="flex items-center gap-0.5 w-[32%]">
          <span className="shrink-0">Pack</span>
          <span className="flex-1 border-b border-dotted border-black h-2"></span>
        </div>
        <div className="flex items-center gap-0.5 w-[32%]">
          <span className="shrink-0">Date</span>
          <span className="flex-1 border-b border-dotted border-black h-2"></span>
        </div>
      </div>
    </div>
  );
}

function QuadrantOrderSelect({
  slotIdx,
  selectedOrder,
  savedOrders,
  onSelectOrder,
}: {
  slotIdx: number;
  selectedOrder: OrderItem;
  savedOrders: OrderItem[];
  onSelectOrder: (order: OrderItem) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOrders = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return savedOrders;
    return savedOrders.filter((o) => {
      const matchName = o.customerName?.toLowerCase().includes(q);
      const matchPhone = o.whatsappNo?.replace(/\s+/g, '').includes(q.replace(/\s+/g, '')) ||
                         o.mobile1?.replace(/\s+/g, '').includes(q.replace(/\s+/g, '')) ||
                         o.mobile2?.replace(/\s+/g, '').includes(q.replace(/\s+/g, ''));
      const matchId = o.id?.toLowerCase().includes(q);
      const matchAddress = o.address?.toLowerCase().includes(q);
      return matchName || matchPhone || matchId || matchAddress;
    });
  }, [savedOrders, searchQuery]);

  const isBlank = selectedOrder.id.startsWith('ORD-EMPTY') || !selectedOrder.customerName;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left bg-card border border-border hover:border-[#2CFF05]/50 focus:border-[#2CFF05] rounded-xl p-2.5 flex items-center justify-between gap-2 transition-all group cursor-pointer"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-muted text-muted-foreground border border-border">
              {isBlank ? 'EMPTY' : selectedOrder.id}
            </span>
            {selectedOrder.whatsappNo && (
              <span className="text-[11px] font-bold text-[#2CFF05] truncate">
                {selectedOrder.whatsappNo}
              </span>
            )}
          </div>
          <span className="text-xs font-semibold text-foreground block truncate">
            {isBlank ? '[Blank Template]' : selectedOrder.customerName || 'Customer'}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform shrink-0 ${isOpen ? 'rotate-180 text-[#2CFF05]' : 'group-hover:text-foreground'}`} />
      </button>

      {/* Search Popover Dropdown */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1.5 bg-popover/95 backdrop-blur-md border border-border shadow-2xl rounded-2xl p-2 space-y-2 max-h-80 flex flex-col animate-in fade-in zoom-in-95 duration-150 min-w-[260px]">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Phone, Name, ID..."
              className="w-full bg-card border border-border rounded-xl pl-8 pr-7 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#2CFF05]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Orders List */}
          <div className="overflow-y-auto space-y-1 max-h-52 pr-1 custom-scrollbar">
            {/* Blank Option (Pinned at top) */}
            <div className="pb-1 border-b border-border/50 mb-1">
              <button
                type="button"
                onClick={() => {
                  onSelectOrder(createEmptyOrder(`ORD-EMPTY-${slotIdx + 1}`));
                  setIsOpen(false);
                  setSearchQuery('');
                }}
                className="w-full text-left p-2 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/80 flex items-center justify-between gap-2 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">[Blank Template]</span>
                  <span className="text-[10px] text-muted-foreground">(Clear this quadrant)</span>
                </div>
                {isBlank && <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
              </button>
            </div>

            {filteredOrders.length > 0 ? (
              filteredOrders.map((o) => {
                const isSelected = selectedOrder.id === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => {
                      onSelectOrder(o);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full text-left p-2 rounded-xl text-xs transition-all flex items-center justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-[#2CFF05]/15 border border-[#2CFF05]/30 text-foreground font-semibold'
                        : 'hover:bg-secondary/80 text-foreground'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="font-mono text-[9px] font-bold text-muted-foreground px-1 bg-background/80 rounded border border-border/50">
                          {o.id}
                        </span>
                        <span className="font-bold text-xs text-[#2CFF05] truncate">
                          {o.whatsappNo || 'No phone'}
                        </span>
                      </div>
                      <div className="font-semibold text-xs truncate text-foreground">
                        {o.customerName || 'Customer'}
                      </div>
                      {o.address && (
                        <div className="text-[10px] text-muted-foreground truncate">
                          {o.address}
                        </div>
                      )}
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-[#2CFF05] shrink-0" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="text-center py-4 text-xs text-muted-foreground">
                No orders match &quot;{searchQuery}&quot;
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import { filterRealOrders } from '@/lib/order-utils';

export default function AdminBatchPrint() {
  const [savedOrders, setSavedOrders] = useState<OrderItem[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<OrderItem[]>([
    createEmptyOrder('ORD-EMPTY-1'),
    createEmptyOrder('ORD-EMPTY-2'),
    createEmptyOrder('ORD-EMPTY-3'),
    createEmptyOrder('ORD-EMPTY-4'),
  ]);

  const loadAndFilterOrders = () => {
    const saved = localStorage.getItem('bitium_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const cleanOrders = filterRealOrders<OrderItem>(parsed);
        setSavedOrders(cleanOrders);
        localStorage.setItem('bitium_orders', JSON.stringify(cleanOrders));
        
        const filled: OrderItem[] = [];
        for (let i = 0; i < 4; i++) {
          if (cleanOrders[i]) {
            filled.push(cleanOrders[i]);
          } else {
            filled.push(createEmptyOrder(`ORD-EMPTY-${i + 1}`));
          }
        }
        setSelectedSlots(filled);
      } catch (e) {
        console.error('Error loading bitium_orders:', e);
      }
    } else {
      setSelectedSlots([
        createEmptyOrder('ORD-EMPTY-1'),
        createEmptyOrder('ORD-EMPTY-2'),
        createEmptyOrder('ORD-EMPTY-3'),
        createEmptyOrder('ORD-EMPTY-4'),
      ]);
    }
  };

  useEffect(() => {
    loadAndFilterOrders();
  }, []);

  const handleClearAllOrders = () => {
    if (confirm('Are you sure you want to clear all saved orders from the batch queue?')) {
      setSavedOrders([]);
      localStorage.removeItem('bitium_orders');
      setSelectedSlots([
        createEmptyOrder('ORD-EMPTY-1'),
        createEmptyOrder('ORD-EMPTY-2'),
        createEmptyOrder('ORD-EMPTY-3'),
        createEmptyOrder('ORD-EMPTY-4'),
      ]);
    }
  };

  const handlePrintA4 = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Embedded High-Precision Print CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            @page {
              size: A4 portrait;
              margin: 0mm !important;
            }
            
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
              color: #000000 !important;
              height: 297mm !important;
              max-height: 297mm !important;
              overflow: hidden !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            /* Hide everything outside the batch print sheet */
            body * {
              visibility: hidden !important;
            }

            /* Make ONLY the exact A4 print sheet visible */
            .a4-print-sheet, .a4-print-sheet * {
              visibility: visible !important;
            }

            .a4-print-sheet {
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              width: 210mm !important;
              height: 297mm !important;
              max-width: 210mm !important;
              max-height: 297mm !important;
              margin: 0 !important;
              padding: 2.5mm !important;
              box-sizing: border-box !important;
              background: #ffffff !important;
              border: none !important;
              box-shadow: none !important;
              border-radius: 0 !important;
              z-index: 9999999 !important;
              page-break-after: avoid !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }

            /* Explicitly hide non-printable elements */
            nav, header, footer, aside, .no-print, [id*="chat"], [class*="Chat"], [class*="chatbot"], [class*="floating"] {
              display: none !important;
            }
          }
        `
      }} />

      {/* Control Strip (Hidden in Print) */}
      <div className="bg-card/40 border border-border rounded-2xl p-5 shadow-sm no-print space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2 text-foreground">
              <PackageCheck className="w-5 h-5 text-[#2CFF05]" />
              Bitium A4 Batch Print Controller (4 Customer Orders per Sheet)
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              පහත Slots 4 සඳහා Customersලා 4 දෙනාගේ Orders තෝරන්න. Print ක්ලික් කළ විට එකම A4 කොළයකට මේ Orders 4 එකවර print වේ.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {savedOrders.length > 0 && (
              <button
                type="button"
                onClick={handleClearAllOrders}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-card border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 cursor-pointer transition-all"
                title="Clear all saved orders in batch list"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Queue
              </button>
            )}

            <button
              type="button"
              onClick={handlePrintA4}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-[#2CFF05] hover:bg-[#45ff24] text-black shadow-lg shadow-[#2CFF05]/10 cursor-pointer transition-all"
            >
              <Printer className="w-4 h-4" />
              Print 4-in-1 A4 Sheet
            </button>
          </div>
        </div>

        {/* Slot Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-border/60">
          {[0, 1, 2, 3].map((slotIdx) => (
            <div key={slotIdx} className="bg-background/60 p-3 rounded-xl border border-border space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Quadrant #{slotIdx + 1} ({slotIdx === 0 ? 'Top-Left' : slotIdx === 1 ? 'Top-Right' : slotIdx === 2 ? 'Bottom-Left' : 'Bottom-Right'}):
              </span>
              <QuadrantOrderSelect
                slotIdx={slotIdx}
                selectedOrder={selectedSlots[slotIdx] || createEmptyOrder(`ORD-EMPTY-${slotIdx + 1}`)}
                savedOrders={savedOrders}
                onSelectOrder={(order) => {
                  const copy = [...selectedSlots];
                  copy[slotIdx] = order;
                  setSelectedSlots(copy);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* THE EXACT A4 PRINT CONTAINER (2x2 Grid) */}
      <div className="a4-print-sheet w-full max-w-[210mm] min-h-[294mm] mx-auto bg-white p-2.5 sm:p-3 rounded-xl shadow-2xl border border-slate-300 grid grid-cols-2 grid-rows-2 gap-2 relative box-border">
        
        {/* Dashed Horizontal Cutting Line */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t border-dashed border-gray-400 pointer-events-none z-10 flex items-center justify-between px-2">
          <span className="text-[6px] text-gray-400 bg-white px-1 font-mono">✂ CUT HERE</span>
          <span className="text-[6px] text-gray-400 bg-white px-1 font-mono">✂ CUT HERE</span>
        </div>

        {/* Dashed Vertical Cutting Line */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 border-l border-dashed border-gray-400 pointer-events-none z-10 flex flex-col items-center justify-between py-2">
          <span className="text-[6px] text-gray-400 bg-white py-0.5 [writing-mode:vertical-lr] font-mono">✂ CUT HERE</span>
          <span className="text-[6px] text-gray-400 bg-white py-0.5 [writing-mode:vertical-lr] font-mono">✂ CUT HERE</span>
        </div>

        {/* 4 Quadrants with 4 Customer Orders */}
        <div className="w-full h-full p-0.5">
          <QuarterOrderCard order={selectedSlots[0] || createEmptyOrder('ORD-1')} />
        </div>
        <div className="w-full h-full p-0.5">
          <QuarterOrderCard order={selectedSlots[1] || createEmptyOrder('ORD-2')} />
        </div>
        <div className="w-full h-full p-0.5">
          <QuarterOrderCard order={selectedSlots[2] || createEmptyOrder('ORD-3')} />
        </div>
        <div className="w-full h-full p-0.5">
          <QuarterOrderCard order={selectedSlots[3] || createEmptyOrder('ORD-4')} />
        </div>

      </div>

    </div>
  );
}
