'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    
    setLoading(true);
    // Simulate submission
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      setForm({ name: '', email: '', message: '' });
    }, 800);
  };

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full filter blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-fuchsia-600/10 rounded-full filter blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto relative z-10 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Have questions about stencils, screen printing, custom DTF sheets, or bulk apparel? Write to us and we'll reply shortly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Details Card */}
          <div className="p-8 rounded-3xl border border-zinc-800 bg-zinc-900/40 backdrop-blur space-y-8 flex flex-col justify-between">
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                <MessageSquare className="text-violet-400" size={20} />
                Contact Information
              </h2>
              
              <div className="space-y-4 text-sm text-zinc-300">
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-violet-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-zinc-200">Phone & WhatsApp</p>
                    <p className="text-xs text-zinc-400 mt-0.5">+94 77 281 3232</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-violet-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-zinc-200">Email Address</p>
                    <p className="text-xs text-zinc-400 mt-0.5">info@bitium.lk</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-violet-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-zinc-200">Main Office & Factory</p>
                    <p className="text-xs text-zinc-400 mt-0.5">102 Galle Road, Colombo 03, Sri Lanka</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-violet-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-zinc-200">Opening Hours</p>
                    <p className="text-xs text-zinc-400 mt-0.5">Mon - Sat: 8:30 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-850 pt-6 text-center md:text-left">
              <p className="text-xs text-zinc-500 font-medium">
                Bitium Technology - Leading High-Performance Custom Printing Solutions
              </p>
            </div>
          </div>

          {/* Form Card */}
          <div className="p-8 rounded-3xl border border-zinc-800 bg-zinc-900/40 backdrop-blur">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-8">
                <div className="w-12 h-12 rounded-full bg-violet-600/20 border border-violet-500 flex items-center justify-center text-violet-400 text-lg font-bold">
                  ✓
                </div>
                <h3 className="font-bold text-lg text-zinc-100">Message Sent!</h3>
                <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
                  Thank you for contacting us. Our support agent will reach out to you within 2-4 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-850 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-bold text-zinc-400 uppercase tracking-wide">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-850 focus:border-violet-500 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-bold text-zinc-400 uppercase tracking-wide">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-850 focus:border-violet-500 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-xs font-bold text-zinc-400 uppercase tracking-wide">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-850 focus:border-violet-500 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 font-bold text-xs flex items-center justify-center gap-2 transition-all glow-primary shadow-lg shadow-violet-600/20 text-white disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <>
                      <Send size={14} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
