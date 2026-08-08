"use client";

import React, { useState, useEffect } from "react";
import {
  Printer,
  Send,
  Plus,
  Trash2,
  CheckCircle2,
  Users,
  FileSpreadsheet,
  ArrowLeft,
  Sparkles,
  Smartphone,
  Eye,
  Check,
  PackageCheck
} from "lucide-react";
import Link from "next/link";

export interface OrderItem {
  id: string;
  customerName: string;
  whatsappNo: string;
  address: string;
  note: string;
  date: string;
  totalAmount: string;
  deliveryMethod: string;
  // Stencils: 7 rows x 5 columns
  // cols 0,1,2 = A3, col 3 = A2, col 4 = A4
  stencils: { code: string; checked: boolean }[][];
  // Fabric Painting: 4 rows x 5 columns
  fabricPainting: { code: string; checked: boolean }[][];
  // Accessories
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
  { id: "Paid Post", label: "Paid Post" },
  { id: "Cash On Delivery", label: "Cash On Delivery" },
  { id: "Cash On Delivery (On weight)", label: "Cash On Delivery (On weight)" },
  { id: "Paid Courier", label: "Paid Courier" },
  { id: "Courier (On weight)", label: "Courier (On weight)" },
  { id: "Store Pickup", label: "Store Pickup" },
];

const createEmptyOrder = (id?: string): OrderItem => ({
  id: id || `ORD-${Date.now().toString().slice(-4)}`,
  customerName: "",
  whatsappNo: "",
  address: "",
  note: "",
  date: new Date().toISOString().split("T")[0],
  totalAmount: "",
  deliveryMethod: "Paid Courier",
  stencils: Array.from({ length: 7 }, () =>
    Array.from({ length: 5 }, () => ({ code: "", checked: false }))
  ),
  fabricPainting: Array.from({ length: 4 }, () =>
    Array.from({ length: 5 }, () => ({ code: "", checked: false }))
  ),
  accessories: {
    rollerBrush: false,
    paintBrush: false,
    fabricPaint: false,
    tracing: false,
    fabric: false,
  },
  checkedBy: "",
  packedBy: "",
  officeDate: "",
});

// Demo sample orders for quick testing of 4 customer orders on A4
const sampleOrders: OrderItem[] = [
  {
    id: "ORD-101",
    customerName: "Kavindu Perera",
    whatsappNo: "077 123 4567",
    address: "No. 45, Temple Road, Kandy",
    note: "Call before delivery",
    date: new Date().toISOString().split("T")[0],
    totalAmount: "4,850",
    deliveryMethod: "Cash On Delivery",
    stencils: [
      [{ code: "A3-01", checked: true }, { code: "A3-14", checked: true }, { code: "", checked: false }, { code: "A2-05", checked: true }, { code: "A4-12", checked: true }],
      [{ code: "A3-08", checked: true }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "A4-88", checked: true }],
      [{ code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }],
      [{ code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }],
      [{ code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }],
      [{ code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }],
      [{ code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }],
    ],
    fabricPainting: [
      [{ code: "FB-01", checked: true }, { code: "FB-04", checked: true }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }],
      [{ code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }],
      [{ code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }],
      [{ code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }],
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
    id: "ORD-102",
    customerName: "Sanduni Jayasinghe",
    whatsappNo: "071 987 6543",
    address: "24/B, Galle Road, Matara",
    note: "Fragile packing please",
    date: new Date().toISOString().split("T")[0],
    totalAmount: "6,200",
    deliveryMethod: "Paid Courier",
    stencils: [
      [{ code: "A3-22", checked: true }, { code: "A3-45", checked: true }, { code: "A3-99", checked: true }, { code: "A2-01", checked: true }, { code: "", checked: false }],
      [{ code: "A3-11", checked: true }, { code: "", checked: false }, { code: "", checked: false }, { code: "A2-09", checked: true }, { code: "A4-03", checked: true }],
      [{ code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }],
      [{ code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }],
      [{ code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }],
      [{ code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }],
      [{ code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }],
    ],
    fabricPainting: [
      [{ code: "FB-12", checked: true }, { code: "", checked: false }, { code: "FB-19", checked: true }, { code: "", checked: false }, { code: "", checked: false }],
      [{ code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }],
      [{ code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }],
      [{ code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }],
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
    id: "ORD-103",
    customerName: "Nimal Fernando",
    whatsappNo: "075 555 4321",
    address: "Negombo Town",
    note: "Come to shop",
    date: new Date().toISOString().split("T")[0],
    totalAmount: "2,300",
    deliveryMethod: "Store Pickup",
    stencils: [
      [{ code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "A4-01", checked: true }],
      [{ code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "A4-05", checked: true }],
      [{ code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "A4-10", checked: true }],
      [{ code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }],
      [{ code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }],
      [{ code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }],
      [{ code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }],
    ],
    fabricPainting: [
      [{ code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }],
      [{ code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }],
      [{ code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }],
      [{ code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }],
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
    id: "ORD-104",
    customerName: "Thilini Disanayake",
    whatsappNo: "078 333 7890",
    address: "Kurunegala Road, Kuliyapitiya",
    note: "Urgent order",
    date: new Date().toISOString().split("T")[0],
    totalAmount: "7,900",
    deliveryMethod: "Courier (On weight)",
    stencils: [
      [{ code: "A3-50", checked: true }, { code: "A3-51", checked: true }, { code: "", checked: false }, { code: "A2-30", checked: true }, { code: "A4-70", checked: true }],
      [{ code: "A3-52", checked: true }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }],
      [{ code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }],
      [{ code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }],
      [{ code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }],
      [{ code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }],
      [{ code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }],
    ],
    fabricPainting: [
      [{ code: "FB-30", checked: true }, { code: "FB-31", checked: true }, { code: "FB-32", checked: true }, { code: "", checked: false }, { code: "", checked: false }],
      [{ code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }],
      [{ code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }],
      [{ code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }, { code: "", checked: false }],
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

// Single Quadrant Printable 1/4 Card (A6 size)
function QuarterOrderCard({ order }: { order: OrderItem }) {
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
                {order.whatsappNo || ""}
              </span>
            </div>
            <div className="mt-0.5 space-y-1">
              <div className="border-b border-dotted border-gray-600 h-3 flex items-center overflow-hidden">
                <span className="text-[7.5px] font-medium truncate">
                  {order.customerName ? `Name: ${order.customerName}` : ""}
                </span>
              </div>
              <div className="border-b border-dotted border-gray-600 h-3 flex items-center overflow-hidden">
                <span className="text-[7px] truncate text-gray-800">
                  {order.address ? `Addr: ${order.address}` : ""}
                </span>
              </div>
              <div className="border-b border-dotted border-gray-600 h-3 flex items-center overflow-hidden">
                <span className="text-[7px] text-gray-600 truncate">
                  {order.id ? `Ref: ${order.id}` : ""}
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
                  <span className={`truncate pr-0.5 ${isSelected ? "font-bold text-black" : "text-gray-700"}`}>
                    {item.label}
                  </span>
                  <span className="w-2.5 h-2.5 border border-black shrink-0 inline-flex items-center justify-center font-bold text-[7px] leading-none">
                    {isSelected ? "✓" : ""}
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
              {order.totalAmount ? `Rs. ${order.totalAmount}` : ""}
            </span>
          </div>
        </div>

        {/* Note */}
        <div className="border-x border-b border-black px-1.5 py-0.5 text-[7.5px] flex items-center gap-1 overflow-hidden">
          <span className="font-semibold whitespace-nowrap shrink-0">* Note :</span>
          <span className="font-normal text-gray-700 truncate border-b border-dotted border-gray-500 flex-1">
            {order.note || ""}
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
                    cIdx < 4 ? "border-r border-black" : ""
                  }`}
                >
                  <span className="text-[7px] font-mono font-medium truncate pr-0.5">
                    {cell.code}
                  </span>
                  <span className="w-2.5 h-2.5 border border-black shrink-0 inline-flex items-center justify-center font-bold text-[7px] leading-none">
                    {cell.checked ? "✓" : ""}
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
                    cIdx < 4 ? "border-r border-black" : ""
                  }`}
                >
                  <span className="text-[7px] font-mono font-medium truncate pr-0.5">
                    {cell.code}
                  </span>
                  <span className="w-2.5 h-2.5 border border-black shrink-0 inline-flex items-center justify-center font-bold text-[7px] leading-none">
                    {cell.checked ? "✓" : ""}
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
              {order.accessories.rollerBrush ? "✓" : ""}
            </span>
          </div>
          <div className="border-r border-black p-0.5 flex items-center justify-between">
            <span className="leading-tight truncate pr-0.5">Paint Brush</span>
            <span className="w-2.5 h-2.5 border border-black inline-flex items-center justify-center shrink-0 font-bold text-[7px]">
              {order.accessories.paintBrush ? "✓" : ""}
            </span>
          </div>
          <div className="border-r border-black p-0.5 flex items-center justify-between">
            <span className="leading-tight truncate pr-0.5">Fabric Paint</span>
            <span className="w-2.5 h-2.5 border border-black inline-flex items-center justify-center shrink-0 font-bold text-[7px]">
              {order.accessories.fabricPaint ? "✓" : ""}
            </span>
          </div>
          <div className="border-r border-black p-0.5 flex items-center justify-between">
            <span className="leading-tight truncate pr-0.5">Tracing</span>
            <span className="w-2.5 h-2.5 border border-black inline-flex items-center justify-center shrink-0 font-bold text-[7px]">
              {order.accessories.tracing ? "✓" : ""}
            </span>
          </div>
          <div className="p-0.5 flex items-center justify-between">
            <span className="leading-tight truncate pr-0.5">Fabric</span>
            <span className="w-2.5 h-2.5 border border-black inline-flex items-center justify-center shrink-0 font-bold text-[7px]">
              {order.accessories.fabric ? "✓" : ""}
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

export default function OrderFormPage() {
  // Main view tab: 'customer' (Client fills single A6 form) vs 'admin-batch' (Bitium prints 4 customer orders on 1 A4)
  const [activeTab, setActiveTab] = useState<"customer" | "admin-batch">("customer");

  // Orders stored in system
  const [savedOrders, setSavedOrders] = useState<OrderItem[]>([]);
  
  // The 4 selected order slots to print on the A4 page
  const [selectedSlots, setSelectedSlots] = useState<OrderItem[]>([
    createEmptyOrder("ORD-1"),
    createEmptyOrder("ORD-2"),
    createEmptyOrder("ORD-3"),
    createEmptyOrder("ORD-4"),
  ]);

  // Current order being filled in customer mode
  const [clientOrder, setClientOrder] = useState<OrderItem>(createEmptyOrder());
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Initialize sample orders on load if empty
  useEffect(() => {
    const saved = localStorage.getItem("bitium_orders");
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
      localStorage.setItem("bitium_orders", JSON.stringify(sampleOrders));
    }
  }, []);

  const handleClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientOrder.whatsappNo) {
      alert("කරුණාකර WhatsApp අංකය ඇතුළත් කරන්න!");
      return;
    }

    const newOrder = {
      ...clientOrder,
      id: `ORD-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split("T")[0],
    };

    const updated = [newOrder, ...savedOrders];
    setSavedOrders(updated);
    localStorage.setItem("bitium_orders", JSON.stringify(updated));

    // Update slots if slot 1 is empty or prepends
    setSelectedSlots([newOrder, selectedSlots[0], selectedSlots[1], selectedSlots[2]]);

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setClientOrder(createEmptyOrder());
    }, 3000);
  };

  const loadDemoData = () => {
    setSavedOrders(sampleOrders);
    setSelectedSlots(sampleOrders);
    localStorage.setItem("bitium_orders", JSON.stringify(sampleOrders));
  };

  const handlePrintA4 = () => {
    window.print();
  };

  const updateClientStencil = (rowIdx: number, colIdx: number, field: "code" | "checked", val: any) => {
    const updated = [...clientOrder.stencils];
    updated[rowIdx][colIdx] = {
      ...updated[rowIdx][colIdx],
      [field]: val,
      // Auto check if code typed
      ...(field === "code" && val.trim().length > 0 ? { checked: true } : {}),
    };
    setClientOrder({ ...clientOrder, stencils: updated });
  };

  const updateClientFabric = (rowIdx: number, colIdx: number, field: "code" | "checked", val: any) => {
    const updated = [...clientOrder.fabricPainting];
    updated[rowIdx][colIdx] = {
      ...updated[rowIdx][colIdx],
      [field]: val,
      ...(field === "code" && val.trim().length > 0 ? { checked: true } : {}),
    };
    setClientOrder({ ...clientOrder, fabricPainting: updated });
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-6 px-3 sm:px-6 print:p-0 print:bg-white text-slate-900 dark:text-slate-100">
      
      {/* Print-specific style sheet for exact A4 (2x2 Quadrant Grid) */}
      <style dangerouslySetInnerHTML={{ __html: `
        @page {
          size: A4 portrait;
          margin: 4mm;
        }
        @media print {
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
          .a4-print-sheet {
            display: grid !important;
            width: 202mm !important;
            height: 289mm !important;
            max-width: 202mm !important;
            max-height: 289mm !important;
            padding: 0 !important;
            margin: 0 auto !important;
            box-shadow: none !important;
            border: none !important;
            page-break-inside: avoid;
            page-break-after: avoid;
          }
        }
      `}} />

      {/* Top Navbar / Mode Switcher (Hidden in Print) */}
      <div className="max-w-5xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              Bitium Order System
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/20 text-lime-500 border border-primary/30">
                A6 Form & A4 4-in-1 Batch Print
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          {/* Tab Switcher */}
          <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab("customer")}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "customer"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
              1. Customer Order Form (A6 Size)
            </button>
            <button
              onClick={() => setActiveTab("admin-batch")}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "admin-batch"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <Printer className="w-3.5 h-3.5 text-indigo-500" />
              2. Bitium Batch Print (4 Orders on 1 A4)
            </button>
          </div>

          {activeTab === "admin-batch" && (
            <button
              onClick={handlePrintA4}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print 4 Orders on A4
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CUSTOMER VIEW (A6 Size Form to Fill on Mobile or Desktop)          */}
      {/* ========================================================================= */}
      {activeTab === "customer" && (
        <div className="max-w-2xl mx-auto no-print">
          
          <div className="mb-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-300">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-4 h-4" />
              Customer කෙනෙක්ට Fill කරන්න දෙන Single Form එක (A6 Compact Layout)
            </span>
            <button
              type="button"
              onClick={() => setActiveTab("admin-batch")}
              className="font-bold underline hover:text-emerald-400 cursor-pointer"
            >
              Print 4 Orders on A4 View &rarr;
            </button>
          </div>

          {submittedSuccess && (
            <div className="mb-4 bg-emerald-600 text-white p-3.5 rounded-xl shadow-md flex items-center gap-2 text-sm font-semibold animate-bounce">
              <CheckCircle2 className="w-5 h-5" />
              Order එක සාර්ථකව Submit විය! Bitium Batch Print එකට ඇතුළත් කර ඇත.
            </div>
          )}

          {/* Customer Interactive Form Card */}
          <form
            onSubmit={handleClientSubmit}
            className="bg-white text-black rounded-2xl shadow-xl border-2 border-black overflow-hidden font-sans"
          >
            {/* Header Banner */}
            <div className="bg-black text-white px-4 py-3 flex items-center justify-between">
              <div>
                <h2 className="font-black text-sm tracking-wider uppercase">
                  BITIUM ONLINE ORDER FORM
                </h2>
                <p className="text-[10px] text-gray-300">Fill your order details and items below</p>
              </div>
              <span className="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded">
                Ref: {clientOrder.id}
              </span>
            </div>

            {/* Top Grid: WhatsApp & Delivery */}
            <div className="grid grid-cols-1 sm:grid-cols-12 border-b-2 border-black">
              {/* Left Column: Customer details */}
              <div className="sm:col-span-7 p-3 border-b sm:border-b-0 sm:border-r-2 border-black space-y-2.5">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase mb-1">
                    WATSAPP No. <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="07X XXX XXXX"
                    value={clientOrder.whatsappNo}
                    onChange={(e) => setClientOrder({ ...clientOrder, whatsappNo: e.target.value })}
                    className="w-full text-xs font-semibold px-2.5 py-1.5 border border-black rounded focus:ring-1 focus:ring-black outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-700 mb-0.5">
                    Customer Name:
                  </label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={clientOrder.customerName}
                    onChange={(e) => setClientOrder({ ...clientOrder, customerName: e.target.value })}
                    className="w-full text-xs px-2 py-1 border border-gray-400 rounded outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-700 mb-0.5">
                    Delivery Address:
                  </label>
                  <input
                    type="text"
                    placeholder="City / Address"
                    value={clientOrder.address}
                    onChange={(e) => setClientOrder({ ...clientOrder, address: e.target.value })}
                    className="w-full text-xs px-2 py-1 border border-gray-400 rounded outline-none"
                  />
                </div>
              </div>

              {/* Right Column: Delivery Method */}
              <div className="sm:col-span-5 p-3 bg-gray-50 flex flex-col justify-center space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-gray-600 block mb-1">
                  Select Delivery Method:
                </span>
                {defaultDeliveryOptions.map((opt) => (
                  <label
                    key={opt.id}
                    className="flex items-center justify-between text-xs cursor-pointer p-1 rounded hover:bg-gray-200"
                  >
                    <span className="text-[11px] font-medium">{opt.label}</span>
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value={opt.id}
                      checked={clientOrder.deliveryMethod === opt.id}
                      onChange={(e) => setClientOrder({ ...clientOrder, deliveryMethod: e.target.value })}
                      className="w-4 h-4 text-black accent-black cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Total Amount & Note Bar */}
            <div className="grid grid-cols-2 border-b-2 border-black p-2.5 bg-gray-100 gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="font-bold">Total Amount :</span>
                <input
                  type="text"
                  placeholder="Rs."
                  value={clientOrder.totalAmount}
                  onChange={(e) => setClientOrder({ ...clientOrder, totalAmount: e.target.value })}
                  className="flex-1 font-bold px-1.5 py-0.5 border border-gray-400 rounded bg-white text-xs"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold">* Note :</span>
                <input
                  type="text"
                  placeholder="Special notes..."
                  value={clientOrder.note}
                  onChange={(e) => setClientOrder({ ...clientOrder, note: e.target.value })}
                  className="flex-1 px-1.5 py-0.5 border border-gray-400 rounded bg-white text-xs"
                />
              </div>
            </div>

            {/* STENCILS SECTION */}
            <div className="border-b-2 border-black">
              <div className="grid grid-cols-5 text-center font-bold text-xs bg-gray-200 border-b border-black">
                <div className="col-span-3 border-r border-black py-1.5 uppercase">A3 - STENCILS</div>
                <div className="col-span-1 border-r border-black py-1.5 uppercase text-[10px] sm:text-xs">A2</div>
                <div className="col-span-1 py-1.5 uppercase text-[10px] sm:text-xs">A4</div>
              </div>

              <div className="divide-y divide-gray-300">
                {clientOrder.stencils.map((row, rIdx) => (
                  <div key={`st-in-${rIdx}`} className="grid grid-cols-5 min-h-[34px]">
                    {row.map((cell, cIdx) => (
                      <div
                        key={`st-in-${rIdx}-${cIdx}`}
                        className={`flex items-center justify-between p-1 ${
                          cIdx < 4 ? "border-r border-black" : ""
                        }`}
                      >
                        <input
                          type="text"
                          placeholder={`Code`}
                          value={cell.code}
                          onChange={(e) => updateClientStencil(rIdx, cIdx, "code", e.target.value)}
                          className="w-full text-xs font-mono px-1 focus:outline-none"
                        />
                        <input
                          type="checkbox"
                          checked={cell.checked}
                          onChange={(e) => updateClientStencil(rIdx, cIdx, "checked", e.target.checked)}
                          className="w-4 h-4 rounded border-2 border-black accent-black cursor-pointer shrink-0"
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* FABRIC PAINTING SECTION */}
            <div className="border-b-2 border-black">
              <div className="text-center font-bold text-xs py-1.5 bg-gray-200 border-b border-black tracking-wider">
                Fabric Painting
              </div>
              <div className="divide-y divide-gray-300">
                {clientOrder.fabricPainting.map((row, rIdx) => (
                  <div key={`fab-in-${rIdx}`} className="grid grid-cols-5 min-h-[34px]">
                    {row.map((cell, cIdx) => (
                      <div
                        key={`fab-in-${rIdx}-${cIdx}`}
                        className={`flex items-center justify-between p-1 ${
                          cIdx < 4 ? "border-r border-black" : ""
                        }`}
                      >
                        <input
                          type="text"
                          placeholder={`Code`}
                          value={cell.code}
                          onChange={(e) => updateClientFabric(rIdx, cIdx, "code", e.target.value)}
                          className="w-full text-xs font-mono px-1 focus:outline-none"
                        />
                        <input
                          type="checkbox"
                          checked={cell.checked}
                          onChange={(e) => updateClientFabric(rIdx, cIdx, "checked", e.target.checked)}
                          className="w-4 h-4 rounded border-2 border-black accent-black cursor-pointer shrink-0"
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* ACCESSORIES ROW */}
            <div className="grid grid-cols-5 text-[10px] font-semibold bg-gray-50 border-b-2 border-black">
              {[
                { key: "rollerBrush", label: "Roller Brush" },
                { key: "paintBrush", label: "Paint Brush" },
                { key: "fabricPaint", label: "Fabric Paint" },
                { key: "tracing", label: "Tracing" },
                { key: "fabric", label: "Fabric" },
              ].map((acc, idx) => (
                <label
                  key={acc.key}
                  className={`p-2 flex flex-col sm:flex-row items-center justify-between gap-1 cursor-pointer hover:bg-gray-100 ${
                    idx < 4 ? "border-r border-black" : ""
                  }`}
                >
                  <span className="leading-tight text-center sm:text-left">{acc.label}</span>
                  <input
                    type="checkbox"
                    checked={(clientOrder.accessories as any)[acc.key]}
                    onChange={(e) =>
                      setClientOrder({
                        ...clientOrder,
                        accessories: {
                          ...clientOrder.accessories,
                          [acc.key]: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 rounded border-2 border-black accent-black cursor-pointer"
                  />
                </label>
              ))}
            </div>

            {/* Submit Button Bar */}
            <div className="p-4 bg-gray-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setClientOrder(createEmptyOrder())}
                className="px-3 py-2 text-xs font-medium text-gray-600 hover:text-black cursor-pointer"
              >
                Clear Form
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl bg-black text-white hover:bg-gray-800 shadow-lg transition-all cursor-pointer"
              >
                <Send className="w-4 h-4 text-emerald-400" />
                Submit Order to Bitium
              </button>
            </div>

          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: BITIUM BATCH PRINT DASHBOARD (4 CUSTOMER ORDERS ON 1 A4 PAGE)      */}
      {/* ========================================================================= */}
      {activeTab === "admin-batch" && (
        <div className="max-w-5xl mx-auto">
          
          {/* Control Strip (Hidden in Print) */}
          <div className="mb-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm no-print">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold flex items-center gap-2">
                  <PackageCheck className="w-4 h-4 text-indigo-500" />
                  Bitium A4 Batch Print Controller (4 Customers per Sheet)
                </h2>
                <p className="text-xs text-slate-500">
                  පහත Slots 4 සඳහා Customersla 4 දෙනාගේ Orders තෝරන්න. Print ක්ලික් කළ විට මේ 4ම එක A4 පත්තරයකට print වේ.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={loadDemoData}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" />
                  Load 4 Demo Customer Orders
                </button>

                <button
                  type="button"
                  onClick={handlePrintA4}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  Print A4 (4 Orders)
                </button>
              </div>
            </div>

            {/* Slot Selectors */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
              {[0, 1, 2, 3].map((slotIdx) => (
                <div key={slotIdx} className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-slate-500 block mb-1">
                    Quadrant #{slotIdx + 1} ({slotIdx === 0 ? "Top-Left" : slotIdx === 1 ? "Top-Right" : slotIdx === 2 ? "Bottom-Left" : "Bottom-Right"}):
                  </span>
                  <select
                    value={selectedSlots[slotIdx]?.id || ""}
                    onChange={(e) => {
                      const found = savedOrders.find((o) => o.id === e.target.value);
                      if (found) {
                        const copy = [...selectedSlots];
                        copy[slotIdx] = found;
                        setSelectedSlots(copy);
                      }
                    }}
                    className="w-full text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-1.5 py-1 text-slate-900 dark:text-white"
                  >
                    {savedOrders.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.id}: {o.whatsappNo || "No Phone"} ({o.customerName || "Customer"})
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
              <QuarterOrderCard order={selectedSlots[0] || createEmptyOrder("ORD-1")} />
            </div>
            <div className="w-full h-full p-1">
              <QuarterOrderCard order={selectedSlots[1] || createEmptyOrder("ORD-2")} />
            </div>
            <div className="w-full h-full p-1">
              <QuarterOrderCard order={selectedSlots[2] || createEmptyOrder("ORD-3")} />
            </div>
            <div className="w-full h-full p-1">
              <QuarterOrderCard order={selectedSlots[3] || createEmptyOrder("ORD-4")} />
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
