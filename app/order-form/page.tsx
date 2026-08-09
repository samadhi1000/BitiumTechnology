"use client";

import React from "react";
import OrderFormComponent, { OrderItem } from "@/components/OrderFormComponent";

export type { OrderItem };

export default function OrderFormPage() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-8 px-3 sm:px-6 text-slate-900 dark:text-slate-100">
      <OrderFormComponent hideNavbar={false} />
    </div>
  );
}
