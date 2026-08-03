'use client';

import React, { useState } from 'react';
import { ShoppingBag, Loader2 } from 'lucide-react';

interface CheckoutButtonProps {
  cartItems: { id: string; quantity: number }[];
  customerEmail: string;
  customerName: string;
}

export default function CheckoutButton({ cartItems, customerEmail, customerName }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!customerEmail) {
      alert('Please provide a valid email address to receive your files.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/checkout/payhere', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          customerEmail,
          customerName,
        }),
      });

      const data = await res.json();
      if (res.ok && data.hash) {
        // Redirect URL depending on environment
        const payhereUrl = data.sandbox
          ? 'https://sandbox.payhere.lk/pay/checkout'
          : 'https://www.payhere.lk/pay/checkout';

        // Dynamically compile hidden HTML form and submit to PayHere
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = payhereUrl;

        Object.entries(data).forEach(([key, value]) => {
          if (key !== 'sandbox') {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = String(value);
            form.appendChild(input);
          }
        });

        document.body.appendChild(form);
        form.submit();
      } else {
        alert(data.error || 'Failed to initialize checkout payment');
      }
    } catch (err) {
      console.error(err);
      alert('Checkout failed due to connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading || cartItems.length === 0}
      className="w-full flex items-center justify-center gap-2.5 px-6 py-4 text-sm font-extrabold uppercase tracking-wider text-white bg-violet-600 rounded-2xl hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl shadow-violet-600/35 active:scale-[0.98] cursor-pointer"
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Processing Checkout...</span>
        </>
      ) : (
        <>
          <ShoppingBag className="w-5 h-5" />
          <span>Pay and Secure Assets</span>
        </>
      )}
    </button>
  );
}
