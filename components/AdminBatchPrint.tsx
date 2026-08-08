'use client';

import React, { useState, useEffect } from 'react';
import {
  Printer,
  Users,
  RefreshCw,
  Trash2,
  CheckCircle2,
  PackageCheck,
  FileSpreadsheet
} from 'lucide-react';

export interface OrderItem {
  id: string;
  customerName: string;
  whatsappNo: string;
  address: string;
  note: string;
  date: string;
  totalAmount: string;
  deliveryMethod: string;
  stencils: { code: string; checked: boolean }[][];
  fabricPainting: { code: string; checked: boolean }[][];
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
  address: '',
  note: '',
  date: new Date().toISOString().split('T')[0],
  totalAmount: '',
  deliveryMethod: 'Cash On Delivery',
  stencils: Array.from({ length: 7 }, () =>
    Array.from({ length: 5 }, () => ({ code: '', checked: false }))
  ),
  fabricPainting: Array.from({ length: 4 }, () =>
    Array.from({ length: 5 }, () => ({ code: '', checked: false }))
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

export const sampleOrders: OrderItem[] = [
  {
    id: 'ORD-101',
    customerName: 'Kavindu Perera',
    whatsappNo: '077 123 4567',
    address: 'No. 45, Temple Road, Kandy',
    note: 'Call before delivery',
    date: new Date().toISOString().split('T')[0],
    totalAmount: '4,850',
    deliveryMethod: 'Cash On Delivery',
    stencils: [
      [{ code: 'A3-01', checked: true }, { code: 'A3-14', checked: true }, { code: '', checked: false }, { code: 'A2-05', checked: true }, { code: 'A4-12', checked: true }],
      [{ code: 'A3-08', checked: true }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: 'A4-88', checked: true }],
      [{ code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }],
      [{ code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }],
      [{ code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }],
      [{ code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }],
      [{ code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }],
    ],
    fabricPainting: [
      [{ code: 'FB-01', checked: true }, { code: 'FB-04', checked: true }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }],
      [{ code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }],
      [{ code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }],
      [{ code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }],
    ],
    accessories: {
      rollerBrush: true,
      paintBrush: true,
      fabricPaint: true,
      tracing: false,
      fabric: false,
    },
  },
  {
    id: 'ORD-102',
    customerName: 'Sanduni Jayasinghe',
    whatsappNo: '071 987 6543',
    address: '24/B, Galle Road, Matara',
    note: 'Fragile packing please',
    date: new Date().toISOString().split('T')[0],
    totalAmount: '6,200',
    deliveryMethod: 'Paid Courier',
    stencils: [
      [{ code: 'A3-22', checked: true }, { code: 'A3-45', checked: true }, { code: 'A3-99', checked: true }, { code: 'A2-01', checked: true }, { code: '', checked: false }],
      [{ code: 'A3-11', checked: true }, { code: '', checked: false }, { code: '', checked: false }, { code: 'A2-09', checked: true }, { code: 'A4-03', checked: true }],
      [{ code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }],
      [{ code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }],
      [{ code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }],
      [{ code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }],
      [{ code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }],
    ],
    fabricPainting: [
      [{ code: 'FB-12', checked: true }, { code: '', checked: false }, { code: 'FB-19', checked: true }, { code: '', checked: false }, { code: '', checked: false }],
      [{ code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }],
      [{ code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }],
      [{ code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }],
    ],
    accessories: {
      rollerBrush: false,
      paintBrush: true,
      fabricPaint: true,
      tracing: true,
      fabric: true,
    },
  },
  {
    id: 'ORD-103',
    customerName: 'Nimal Fernando',
    whatsappNo: '075 555 4321',
    address: 'Negombo Town',
    note: 'Come to shop',
    date: new Date().toISOString().split('T')[0],
    totalAmount: '2,300',
    deliveryMethod: 'Store Pickup',
    stencils: [
      [{ code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: 'A4-01', checked: true }],
      [{ code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: 'A4-05', checked: true }],
      [{ code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: 'A4-10', checked: true }],
      [{ code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }],
      [{ code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }],
      [{ code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }],
      [{ code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }],
    ],
    fabricPainting: [
      [{ code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }],
      [{ code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }],
      [{ code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }],
      [{ code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }],
    ],
    accessories: {
      rollerBrush: true,
      paintBrush: false,
      fabricPaint: true,
      tracing: false,
      fabric: false,
    },
  },
  {
    id: 'ORD-104',
    customerName: 'Thilini Disanayake',
    whatsappNo: '078 333 7890',
    address: 'Kurunegala Road, Kuliyapitiya',
    note: 'Urgent order',
    date: new Date().toISOString().split('T')[0],
    totalAmount: '7,900',
    deliveryMethod: 'Courier (On weight)',
    stencils: [
      [{ code: 'A3-50', checked: true }, { code: 'A3-51', checked: true }, { code: '', checked: false }, { code: 'A2-30', checked: true }, { code: 'A4-70', checked: true }],
      [{ code: 'A3-52', checked: true }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }],
      [{ code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }],
      [{ code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }],
      [{ code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }],
      [{ code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }],
      [{ code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }],
    ],
    fabricPainting: [
      [{ code: 'FB-30', checked: true }, { code: 'FB-31', checked: true }, { code: 'FB-32', checked: true }, { code: '', checked: false }, { code: '', checked: false }],
      [{ code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }],
      [{ code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }],
      [{ code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }, { code: '', checked: false }],
    ],
    accessories: {
      rollerBrush: true,
      paintBrush: true,
      fabricPaint: true,
      tracing: true,
      fabric: true,
    },
  },
];

export function QuarterOrderCard({ order }: { order: OrderItem }) {
  return (
    <div className="w-full h-full bg-white text-black font-sans border border-black flex flex-col justify-between select-none box-border p-1.5 text-[8px] leading-tight overflow-hidden">
      <div>
        {/* Top Header Section */}
        <div className="border border-black flex">
          {/* Top Left: WhatsApp & Details */}
          <div className="w-[56%] border-r border-black p-1 flex flex-col justify-between">
            <div className="flex items-center gap-1 font-bold text-[8.5px]">
              <span className="shrink-0">WATSAPP No.</span>
              <span className="font-semibold text-[8.5px] truncate border-b border-dotted border-black flex-1">
                {order.whatsappNo || ''}
              </span>
            </div>
            <div className="mt-0.5 space-y-1">
              <div className="border-b border-dotted border-gray-600 h-3 flex items-center overflow-hidden">
                <span className="text-[7.5px] font-medium truncate">
                  {order.customerName ? `Name: ${order.customerName}` : ''}
                </span>
              </div>
              <div className="border-b border-dotted border-gray-600 h-3 flex items-center overflow-hidden">
                <span className="text-[7px] truncate text-gray-800">
                  {order.address ? `Addr: ${order.address}` : ''}
                </span>
              </div>
              <div className="border-b border-dotted border-gray-600 h-3 flex items-center overflow-hidden">
                <span className="text-[7px] text-gray-600 truncate">
                  {order.id ? `Ref: ${order.id}` : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Top Right: Delivery Options */}
          <div className="w-[44%] p-1 text-[6.5px] font-medium flex flex-col justify-between gap-0.5 bg-gray-50/50 leading-tight">
            {defaultDeliveryOptions.map((item) => {
              const isSelected = order.deliveryMethod === item.id;
              return (
                <div key={item.id} className="flex items-center justify-between">
                  <span className={`truncate pr-0.5 ${isSelected ? 'font-bold text-black' : 'text-gray-700'}`}>
                    {item.label}
                  </span>
                  <span className="w-2.5 h-2.5 border border-black shrink-0 inline-flex items-center justify-center font-bold text-[7px] leading-none">
                    {isSelected ? '✓' : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Date & Total Amount */}
        <div className="border-x border-b border-black flex items-center justify-between px-1.5 py-0.5 text-[8px] font-semibold bg-gray-50/70">
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
        <div className="border-x border-b border-black px-1.5 py-0.5 text-[7.5px] flex items-center gap-1 overflow-hidden">
          <span className="font-semibold whitespace-nowrap shrink-0">* Note :</span>
          <span className="font-normal text-gray-700 truncate border-b border-dotted border-gray-500 flex-1">
            {order.note || ''}
          </span>
        </div>

        {/* Stencils Table Header */}
        <div className="border-x border-b border-black grid grid-cols-5 text-center font-bold text-[7.5px] bg-gray-100">
          <div className="col-span-3 border-r border-black py-0.5">
            A3 - STENCILS
          </div>
          <div className="col-span-1 border-r border-black py-0.5">
            A2 - STENCILS
          </div>
          <div className="col-span-1 py-0.5">
            A4 - STENCILS
          </div>
        </div>

        {/* Stencils 7 Rows */}
        <div className="border-x border-b border-black divide-y divide-gray-300">
          {order.stencils.map((row, rIdx) => (
            <div key={`st-${rIdx}`} className="grid grid-cols-5 h-[13.5px]">
              {row.map((cell, cIdx) => (
                <div
                  key={`st-${rIdx}-${cIdx}`}
                  className={`flex items-center justify-between px-0.5 ${
                    cIdx < 4 ? 'border-r border-black' : ''
                  }`}
                >
                  <span className="text-[7px] font-mono font-medium truncate pr-0.5">
                    {cell.code}
                  </span>
                  <span className="w-2.5 h-2.5 border border-black shrink-0 inline-flex items-center justify-center font-bold text-[7px] leading-none">
                    {cell.checked ? '✓' : ''}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Fabric Painting Header */}
        <div className="border-x border-b border-black text-center font-bold text-[8px] py-0.5 bg-gray-100">
          Fabric Painting
        </div>

        {/* Fabric Painting 4 Rows */}
        <div className="border-x border-b border-black divide-y divide-gray-300">
          {order.fabricPainting.map((row, rIdx) => (
            <div key={`fab-${rIdx}`} className="grid grid-cols-5 h-[13.5px]">
              {row.map((cell, cIdx) => (
                <div
                  key={`fab-${rIdx}-${cIdx}`}
                  className={`flex items-center justify-between px-0.5 ${
                    cIdx < 4 ? 'border-r border-black' : ''
                  }`}
                >
                  <span className="text-[7px] font-mono font-medium truncate pr-0.5">
                    {cell.code}
                  </span>
                  <span className="w-2.5 h-2.5 border border-black shrink-0 inline-flex items-center justify-center font-bold text-[7px] leading-none">
                    {cell.checked ? '✓' : ''}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Accessories Bottom Row */}
        <div className="border-x border-b border-black grid grid-cols-5 text-[6.8px] font-semibold bg-gray-50/50">
          <div className="border-r border-black p-0.5 flex items-center justify-between">
            <span className="leading-tight truncate pr-0.5">Roller Brush</span>
            <span className="w-2.5 h-2.5 border border-black inline-flex items-center justify-center shrink-0 font-bold text-[7px]">
              {order.accessories.rollerBrush ? '✓' : ''}
            </span>
          </div>
          <div className="border-r border-black p-0.5 flex items-center justify-between">
            <span className="leading-tight truncate pr-0.5">Paint Brush</span>
            <span className="w-2.5 h-2.5 border border-black inline-flex items-center justify-center shrink-0 font-bold text-[7px]">
              {order.accessories.paintBrush ? '✓' : ''}
            </span>
          </div>
          <div className="border-r border-black p-0.5 flex items-center justify-between">
            <span className="leading-tight truncate pr-0.5">Fabric Paint</span>
            <span className="w-2.5 h-2.5 border border-black inline-flex items-center justify-center shrink-0 font-bold text-[7px]">
              {order.accessories.fabricPaint ? '✓' : ''}
            </span>
          </div>
          <div className="border-r border-black p-0.5 flex items-center justify-between">
            <span className="leading-tight truncate pr-0.5">Tracing</span>
            <span className="w-2.5 h-2.5 border border-black inline-flex items-center justify-center shrink-0 font-bold text-[7px]">
              {order.accessories.tracing ? '✓' : ''}
            </span>
          </div>
          <div className="p-0.5 flex items-center justify-between">
            <span className="leading-tight truncate pr-0.5">Fabric</span>
            <span className="w-2.5 h-2.5 border border-black inline-flex items-center justify-center shrink-0 font-bold text-[7px]">
              {order.accessories.fabric ? '✓' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Footer / Office Use */}
      <div className="pt-1 text-[7.5px] font-bold flex items-center justify-between">
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

export default function AdminBatchPrint() {
  const [savedOrders, setSavedOrders] = useState<OrderItem[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<OrderItem[]>([
    createEmptyOrder('ORD-1'),
    createEmptyOrder('ORD-2'),
    createEmptyOrder('ORD-3'),
    createEmptyOrder('ORD-4'),
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('bitium_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSavedOrders(parsed);
        if (parsed.length >= 4) {
          setSelectedSlots(parsed.slice(0, 4));
        } else if (parsed.length > 0) {
          const filled = [...parsed];
          while (filled.length < 4) {
            filled.push(createEmptyOrder(`ORD-EMPTY-${filled.length + 1}`));
          }
          setSelectedSlots(filled);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      setSavedOrders(sampleOrders);
      setSelectedSlots(sampleOrders.slice(0, 4));
      localStorage.setItem('bitium_orders', JSON.stringify(sampleOrders));
    }
  }, []);

  const loadDemoData = () => {
    setSavedOrders(sampleOrders);
    setSelectedSlots(sampleOrders);
    localStorage.setItem('bitium_orders', JSON.stringify(sampleOrders));
  };

  const handlePrintA4 = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Control Strip (Hidden in Print) */}
      <div className="bg-card/40 border border-border rounded-2xl p-5 shadow-sm no-print space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2 text-foreground">
              <PackageCheck className="w-5 h-5 text-[#8DFF00]" />
              Bitium A4 Batch Print Controller (4 Customer Orders per Sheet)
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              පහත Slots 4 සඳහා Customersලා 4 දෙනාගේ Orders තෝරන්න. Print ක්ලික් කළ විට එකම A4 කොළයකට මේ Orders 4 එකවර print වේ.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={loadDemoData}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-card border border-border text-foreground hover:bg-muted cursor-pointer transition-all"
            >
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              Load Demo Orders
            </button>

            <button
              type="button"
              onClick={handlePrintA4}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-[#8DFF00] hover:bg-[#9eff1a] text-black shadow-lg shadow-[#8DFF00]/10 cursor-pointer transition-all"
            >
              <Printer className="w-4 h-4" />
              Print 4-in-1 A4 Sheet
            </button>
          </div>
        </div>

        {/* Slot Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-border/60">
          {[0, 1, 2, 3].map((slotIdx) => (
            <div key={slotIdx} className="bg-background/60 p-3 rounded-xl border border-border">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Quadrant #{slotIdx + 1} ({slotIdx === 0 ? 'Top-Left' : slotIdx === 1 ? 'Top-Right' : slotIdx === 2 ? 'Bottom-Left' : 'Bottom-Right'}):
              </span>
              <select
                value={selectedSlots[slotIdx]?.id || ''}
                onChange={(e) => {
                  const found = savedOrders.find((o) => o.id === e.target.value);
                  if (found) {
                    const copy = [...selectedSlots];
                    copy[slotIdx] = found;
                    setSelectedSlots(copy);
                  }
                }}
                className="w-full text-xs font-semibold bg-card border border-border rounded-lg px-2.5 py-1.5 text-foreground outline-none focus:border-primary"
              >
                {savedOrders.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.id}: {o.whatsappNo || 'No Phone'} ({o.customerName || 'Customer'})
                  </option>
                ))}
                <option value={`empty-${slotIdx}`}>[Blank Template]</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* THE EXACT A4 PRINT CONTAINER (2x2 Grid) */}
      <div className="a4-print-sheet w-full max-w-[210mm] min-h-[297mm] mx-auto bg-white p-3 sm:p-4 rounded-xl shadow-2xl border border-slate-300 grid grid-cols-2 grid-rows-2 gap-3 relative box-border">
        
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
        <div className="w-full h-full p-1">
          <QuarterOrderCard order={selectedSlots[0] || createEmptyOrder('ORD-1')} />
        </div>
        <div className="w-full h-full p-1">
          <QuarterOrderCard order={selectedSlots[1] || createEmptyOrder('ORD-2')} />
        </div>
        <div className="w-full h-full p-1">
          <QuarterOrderCard order={selectedSlots[2] || createEmptyOrder('ORD-3')} />
        </div>
        <div className="w-full h-full p-1">
          <QuarterOrderCard order={selectedSlots[3] || createEmptyOrder('ORD-4')} />
        </div>

      </div>

    </div>
  );
}
