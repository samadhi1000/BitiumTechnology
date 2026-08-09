"use client";

import React, { useState } from "react";
import {
  Send,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Copy,
  Check,
  FileText
} from "lucide-react";
import Link from "next/link";

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
    col0: string; // default "A1"
    col1: string; // default "A2"
    col23: string; // default "A3"
    col4: string; // default "A4"
  };
  note: string;
  date: string;
  totalAmount: string;
  deliveryMethod: string;
  // Chart items: 7 rows x 5 columns (col 0 = A1, col 1 = A2, cols 2 & 3 = A3, col 4 = A4)
  stencils: { code: string; qty?: string; checked: boolean }[][];
  // Fabric Painting: 4 rows x 5 columns
  fabricPainting: { code: string; qty?: string; checked: boolean }[][];
  // Accessories
  accessories: {
    rollerBrush: boolean;
    paintBrush: boolean;
    fabricPaint: boolean;
    tracing: boolean;
    fabric: boolean;
  };
}

const defaultDeliveryOptions = [
  { id: "Paid Post", label: "Paid Post" },
  { id: "Cash On Delivery", label: "Cash On Delivery" },
  { id: "Cash On Delivery (On weight)", label: "Cash On Delivery (On weight)" },
  { id: "Paid Courier", label: "Paid Courier" },
  { id: "Courier (On weight)", label: "Courier (On weight)" },
  { id: "Store Pickup", label: "Store Pickup" },
];

const createEmptyOrder = (): OrderItem => ({
  id: `ORD-${Date.now().toString().slice(-4)}`,
  customerName: "",
  whatsappNo: "",
  shortCode: "",
  address: "",
  mobile1: "",
  mobile2: "",
  category: "Stencils",
  columnHeaders: {
    col0: "A1",
    col1: "A2",
    col23: "A3",
    col4: "A4",
  },
  note: "",
  date: new Date().toISOString().split("T")[0],
  totalAmount: "",
  deliveryMethod: "Cash On Delivery",
  stencils: Array.from({ length: 7 }, () =>
    Array.from({ length: 5 }, () => ({ code: "", qty: "", checked: false }))
  ),
  fabricPainting: Array.from({ length: 4 }, () =>
    Array.from({ length: 5 }, () => ({ code: "", qty: "", checked: false }))
  ),
  accessories: {
    rollerBrush: false,
    paintBrush: false,
    fabricPaint: false,
    tracing: false,
    fabric: false,
  },
});

export default function OrderFormPage() {
  const [clientOrder, setClientOrder] = useState<OrderItem>(createEmptyOrder());
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientOrder.whatsappNo.trim()) {
      alert("Please enter your WhatsApp number.");
      return;
    }

    const newOrder = {
      ...clientOrder,
      id: `ORD-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split("T")[0],
    };

    try {
      const existing = JSON.parse(localStorage.getItem("bitium_orders") || "[]");
      const updated = [newOrder, ...existing];
      localStorage.setItem("bitium_orders", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setClientOrder(createEmptyOrder());
    }, 4000);
  };

  const copyWhatsAppText = () => {
    let text = `📋 *BITIUM TECHNOLOGY - ONLINE ORDER FORM*\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `📅 *Date:* ${clientOrder.date}\n`;
    text += `📱 *WhatsApp No:* ${clientOrder.whatsappNo || "N/A"}\n`;
    if (clientOrder.shortCode) text += `🔢 *Short Code:* ${clientOrder.shortCode}\n`;
    if (clientOrder.customerName) text += `👤 *Customer Name:* ${clientOrder.customerName}\n`;
    if (clientOrder.address) text += `📍 *Delivery Address:* ${clientOrder.address}\n`;
    const mobiles = [clientOrder.mobile1, clientOrder.mobile2].filter(Boolean).join(" / ");
    if (mobiles) text += `📞 *Mobile Numbers (02 Nos):* ${mobiles}\n`;
    text += `🚚 *Delivery Method:* ${clientOrder.deliveryMethod}\n`;
    if (clientOrder.totalAmount) text += `💰 *Total Amount:* Rs. ${clientOrder.totalAmount}\n`;
    if (clientOrder.note) text += `📝 *Note:* ${clientOrder.note}\n`;

    const catTitle = (clientOrder.category || "Stencils").toUpperCase();
    text += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n🎨 *${catTitle} ORDER:*\n`;

    const h0 = clientOrder.columnHeaders?.col0 || "A1";
    const h1 = clientOrder.columnHeaders?.col1 || "A2";
    const h23 = clientOrder.columnHeaders?.col23 || "A3";
    const h4 = clientOrder.columnHeaders?.col4 || "A4";

    clientOrder.stencils.forEach((row, rIdx) => {
      row.forEach((cell, cIdx) => {
        if (cell.code.trim() || cell.qty?.trim() || cell.checked) {
          const type = cIdx === 0 ? h0 : cIdx === 1 ? h1 : (cIdx === 2 || cIdx === 3) ? h23 : h4;
          const qtyText = cell.qty?.trim() ? ` [Qty: ${cell.qty.trim()}]` : "";
          text += `  • [${type}] ${cell.code || `Item ${rIdx + 1}`}${qtyText}\n`;
        }
      });
    });

    text += `\n🖌️ *FABRIC PAINTING:*\n`;
    clientOrder.fabricPainting.forEach((row, rIdx) => {
      row.forEach((cell, cIdx) => {
        if (cell.code.trim() || cell.qty?.trim() || cell.checked) {
          const qtyText = cell.qty?.trim() ? ` [Qty: ${cell.qty.trim()}]` : "";
          text += `  • Design: ${cell.code || `Item ${rIdx + 1}-${cIdx + 1}`}${qtyText}\n`;
        }
      });
    });

    text += `\n🛠️ *ACCESSORIES:*\n`;
    if (clientOrder.accessories.rollerBrush) text += `  ✓ Roller Brush\n`;
    if (clientOrder.accessories.paintBrush) text += `  ✓ Paint Brush\n`;
    if (clientOrder.accessories.fabricPaint) text += `  ✓ Fabric Paint\n`;
    if (clientOrder.accessories.tracing) text += `  ✓ Tracing Paper\n`;
    if (clientOrder.accessories.fabric) text += `  ✓ Fabric / Cloth\n`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateClientStencil = (rowIdx: number, colIdx: number, field: "code" | "qty" | "checked", val: any) => {
    const updated = [...clientOrder.stencils];
    const current = updated[rowIdx][colIdx];
    const newCell = {
      ...current,
      [field]: val,
    };
    if (field === "code" || field === "qty") {
      const hasContent = (field === "code" ? val : newCell.code).trim().length > 0 || 
                         (field === "qty" ? val : (newCell.qty || "")).trim().length > 0;
      if (hasContent) {
        newCell.checked = true;
      }
    }
    updated[rowIdx][colIdx] = newCell;
    setClientOrder({ ...clientOrder, stencils: updated });
  };

  const updateClientFabric = (rowIdx: number, colIdx: number, field: "code" | "qty" | "checked", val: any) => {
    const updated = [...clientOrder.fabricPainting];
    const current = updated[rowIdx][colIdx];
    const newCell = {
      ...current,
      [field]: val,
    };
    if (field === "code" || field === "qty") {
      const hasContent = (field === "code" ? val : newCell.code).trim().length > 0 || 
                         (field === "qty" ? val : (newCell.qty || "")).trim().length > 0;
      if (hasContent) {
        newCell.checked = true;
      }
    }
    updated[rowIdx][colIdx] = newCell;
    setClientOrder({ ...clientOrder, fabricPainting: updated });
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-8 px-3 sm:px-6 text-slate-900 dark:text-slate-100">
      
      {/* Top Navbar */}
      <div className="max-w-2xl mx-auto mb-6 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copyWhatsAppText}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied Format!" : "Copy for WhatsApp"}
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        
        {/* Standard English Banner */}
        <div className="mb-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3 text-xs text-emerald-800 dark:text-emerald-300">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-foreground">
              Order Form to be filled by the Customer
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Please complete your contact details, select your delivery option, and specify your required items below.
            </p>
          </div>
        </div>

        {submittedSuccess && (
          <div className="mb-4 bg-emerald-600 text-white p-4 rounded-2xl shadow-lg flex items-center gap-3 text-sm font-bold animate-bounce">
            <CheckCircle2 className="w-5 h-5" />
            <div>
              <p>Your order has been submitted successfully!</p>
              <p className="text-xs font-normal opacity-90">Bitium Technology will contact you via WhatsApp to confirm dispatch.</p>
            </div>
          </div>
        )}

        {/* Customer Interactive Form Card */}
        <form
          onSubmit={handleClientSubmit}
          className="bg-white text-black rounded-2xl shadow-xl border-2 border-black overflow-hidden font-sans"
        >
          {/* Header Banner */}
          <div className="bg-black text-white px-4 py-3.5 flex items-center justify-between">
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
            <div className="sm:col-span-7 p-3.5 border-b sm:border-b-0 sm:border-r-2 border-black space-y-2.5">
              
              {/* Divided WhatsApp Number & Short Code filling area */}
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-8">
                  <label className="block text-[11px] font-extrabold uppercase mb-1">
                    WhatsApp No. <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="07X XXX XXXX"
                    value={clientOrder.whatsappNo}
                    onChange={(e) => {
                      const val = e.target.value;
                      const digits = val.replace(/\D/g, "");
                      const last4 = digits.length >= 4 ? digits.slice(-4) : digits;
                      setClientOrder({
                        ...clientOrder,
                        whatsappNo: val,
                        shortCode: last4,
                      });
                    }}
                    className="w-full text-xs font-semibold px-2.5 py-1.5 border border-black rounded focus:ring-1 focus:ring-black outline-none"
                  />
                </div>
                <div className="col-span-4">
                  <label className="block text-[11px] font-extrabold uppercase mb-1 text-gray-800">
                    Short Code
                  </label>
                  <input
                    type="text"
                    placeholder="Last 4"
                    value={clientOrder.shortCode ?? (clientOrder.whatsappNo.replace(/\D/g, "").slice(-4))}
                    onChange={(e) => setClientOrder({ ...clientOrder, shortCode: e.target.value })}
                    className="w-full text-xs font-bold font-mono px-2 py-1.5 border border-black rounded bg-gray-50 focus:ring-1 focus:ring-black outline-none text-center"
                  />
                </div>
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

              {/* Mobile Numbers (02 Nos) */}
              <div>
                <label className="block text-[10px] font-bold text-gray-700 mb-0.5">
                  Mobile Numbers (02 Nos):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="tel"
                    placeholder="Mobile 1 (07X XXX XXXX)"
                    value={clientOrder.mobile1 || ""}
                    onChange={(e) => setClientOrder({ ...clientOrder, mobile1: e.target.value })}
                    className="w-full text-xs px-2 py-1 border border-gray-400 rounded outline-none"
                  />
                  <input
                    type="tel"
                    placeholder="Mobile 2 (07X XXX XXXX)"
                    value={clientOrder.mobile2 || ""}
                    onChange={(e) => setClientOrder({ ...clientOrder, mobile2: e.target.value })}
                    className="w-full text-xs px-2 py-1 border border-gray-400 rounded outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Delivery Method */}
            <div className="sm:col-span-5 p-3.5 bg-gray-50 flex flex-col justify-center space-y-1.5">
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
                placeholder="Special notes / instructions..."
                value={clientOrder.note}
                onChange={(e) => setClientOrder({ ...clientOrder, note: e.target.value })}
                className="flex-1 px-1.5 py-0.5 border border-gray-400 rounded bg-white text-xs"
              />
            </div>
          </div>

          {/* CATEGORY SELECTOR DROPDOWN BAR */}
          <div className="border-b-2 border-black p-2.5 bg-gray-100 flex items-center justify-between gap-3 text-xs">
            <label className="font-bold flex items-center gap-1.5 whitespace-nowrap">
              <span>Category / Product Type:</span>
            </label>
            <select
              value={clientOrder.category || "Stencils"}
              onChange={(e) => setClientOrder({ ...clientOrder, category: e.target.value })}
              className="flex-1 max-w-[280px] font-bold text-xs px-2.5 py-1.5 border-2 border-black rounded bg-white text-black focus:outline-none cursor-pointer"
            >
              <option value="Stencils">Stencils</option>
              <option value="Screen Printing">Screen Printing</option>
              <option value="Batik Stamp">Batik Stamp</option>
            </select>
          </div>

          {/* CHART SECTION (A1, A2, A3 span 2, A4 - Editable Headers) */}
          <div className="border-b-2 border-black">
            <div className="grid grid-cols-5 text-center font-bold text-xs bg-gray-200 border-b border-black">
              {/* 1st column: A1 (span 1) */}
              <div className="col-span-1 border-r border-black p-1 flex items-center justify-center">
                <input
                  type="text"
                  value={clientOrder.columnHeaders?.col0 ?? "A1"}
                  onChange={(e) =>
                    setClientOrder({
                      ...clientOrder,
                      columnHeaders: {
                        col0: e.target.value,
                        col1: clientOrder.columnHeaders?.col1 ?? "A2",
                        col23: clientOrder.columnHeaders?.col23 ?? "A3",
                        col4: clientOrder.columnHeaders?.col4 ?? "A4",
                      },
                    })
                  }
                  placeholder="A1"
                  className="w-full text-center font-black text-xs uppercase bg-white/70 hover:bg-white focus:bg-white border border-gray-400 focus:border-black rounded px-1 py-0.5 outline-none transition-all cursor-text shadow-inner"
                  title="Click to edit column title"
                />
              </div>

              {/* 2nd column: A2 (span 1) */}
              <div className="col-span-1 border-r border-black p-1 flex items-center justify-center">
                <input
                  type="text"
                  value={clientOrder.columnHeaders?.col1 ?? "A2"}
                  onChange={(e) =>
                    setClientOrder({
                      ...clientOrder,
                      columnHeaders: {
                        col0: clientOrder.columnHeaders?.col0 ?? "A1",
                        col1: e.target.value,
                        col23: clientOrder.columnHeaders?.col23 ?? "A3",
                        col4: clientOrder.columnHeaders?.col4 ?? "A4",
                      },
                    })
                  }
                  placeholder="A2"
                  className="w-full text-center font-black text-xs uppercase bg-white/70 hover:bg-white focus:bg-white border border-gray-400 focus:border-black rounded px-1 py-0.5 outline-none transition-all cursor-text shadow-inner"
                  title="Click to edit column title"
                />
              </div>

              {/* 3rd & 4th columns together: A3 (span 2) */}
              <div className="col-span-2 border-r border-black p-1 flex items-center justify-center">
                <input
                  type="text"
                  value={clientOrder.columnHeaders?.col23 ?? "A3"}
                  onChange={(e) =>
                    setClientOrder({
                      ...clientOrder,
                      columnHeaders: {
                        col0: clientOrder.columnHeaders?.col0 ?? "A1",
                        col1: clientOrder.columnHeaders?.col1 ?? "A2",
                        col23: e.target.value,
                        col4: clientOrder.columnHeaders?.col4 ?? "A4",
                      },
                    })
                  }
                  placeholder="A3"
                  className="w-full text-center font-black text-xs uppercase bg-white/70 hover:bg-white focus:bg-white border border-gray-400 focus:border-black rounded px-1 py-0.5 outline-none transition-all cursor-text shadow-inner"
                  title="Click to edit column title"
                />
              </div>

              {/* 5th column: A4 (span 1) */}
              <div className="col-span-1 p-1 flex items-center justify-center">
                <input
                  type="text"
                  value={clientOrder.columnHeaders?.col4 ?? "A4"}
                  onChange={(e) =>
                    setClientOrder({
                      ...clientOrder,
                      columnHeaders: {
                        col0: clientOrder.columnHeaders?.col0 ?? "A1",
                        col1: clientOrder.columnHeaders?.col1 ?? "A2",
                        col23: clientOrder.columnHeaders?.col23 ?? "A3",
                        col4: e.target.value,
                      },
                    })
                  }
                  placeholder="A4"
                  className="w-full text-center font-black text-xs uppercase bg-white/70 hover:bg-white focus:bg-white border border-gray-400 focus:border-black rounded px-1 py-0.5 outline-none transition-all cursor-text shadow-inner"
                  title="Click to edit column title"
                />
              </div>
            </div>

            <div className="divide-y divide-gray-300">
              {clientOrder.stencils.map((row, rIdx) => (
                <div key={`st-in-${rIdx}`} className="grid grid-cols-5 min-h-[34px]">
                  {row.map((cell, cIdx) => (
                    <div
                      key={`st-in-${rIdx}-${cIdx}`}
                      className={`flex items-center justify-between p-1 gap-1 ${
                        cIdx < 4 ? "border-r border-black" : ""
                      }`}
                    >
                      <input
                        type="text"
                        placeholder="Qty"
                        value={cell.qty || ""}
                        onChange={(e) => updateClientStencil(rIdx, cIdx, "qty", e.target.value)}
                        className="w-8 sm:w-9 text-xs font-mono px-1 py-0.5 border border-gray-300 rounded text-center focus:outline-none focus:border-black shrink-0 bg-gray-50/50"
                      />
                      <input
                        type="text"
                        placeholder="Code"
                        value={cell.code}
                        onChange={(e) => updateClientStencil(rIdx, cIdx, "code", e.target.value)}
                        className="w-full min-w-0 text-xs font-mono px-1 focus:outline-none"
                      />
                      <input
                        type="checkbox"
                        checked={cell.checked}
                        onChange={(e) => updateClientStencil(rIdx, cIdx, "checked", e.target.checked)}
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-2 border-black accent-black cursor-pointer shrink-0"
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
                      className={`flex items-center justify-between p-1 gap-1 ${
                        cIdx < 4 ? "border-r border-black" : ""
                      }`}
                    >
                      <input
                        type="text"
                        placeholder="Qty"
                        value={cell.qty || ""}
                        onChange={(e) => updateClientFabric(rIdx, cIdx, "qty", e.target.value)}
                        className="w-8 sm:w-9 text-xs font-mono px-1 py-0.5 border border-gray-300 rounded text-center focus:outline-none focus:border-black shrink-0 bg-gray-50/50"
                      />
                      <input
                        type="text"
                        placeholder="Code"
                        value={cell.code}
                        onChange={(e) => updateClientFabric(rIdx, cIdx, "code", e.target.value)}
                        className="w-full min-w-0 text-xs font-mono px-1 focus:outline-none"
                      />
                      <input
                        type="checkbox"
                        checked={cell.checked}
                        onChange={(e) => updateClientFabric(rIdx, cIdx, "checked", e.target.checked)}
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-2 border-black accent-black cursor-pointer shrink-0"
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

    </div>
  );
}
