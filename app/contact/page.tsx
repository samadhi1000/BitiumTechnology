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
    <div className="w-full min-h-screen bg-background text-foreground py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Canonical Link */}
      <link rel="canonical" href="https://www.bitiumtechnology.com/contact" />

      {/* ContactPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact Bitium Technology",
            "description": "Get in touch with Bitium Technology for custom DTF printing, stencils, and screen printing services in Colombo, Sri Lanka.",
            "url": "https://www.bitiumtechnology.com/contact",
            "mainEntity": {
              "@type": "LocalBusiness",
              "name": "Bitium Technology",
              "telephone": "+94779731097",
              "email": "hello@bitiumtechnology.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "102 Galle Road",
                "addressLocality": "Colombo 03",
                "addressCountry": "LK"
              }
            }
          })
        }}
      />
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#2CFF05]/10 rounded-full filter blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2CFF05]/10 rounded-full filter blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto relative z-10 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#2CFF05]">
            Get in Touch
          </h1>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Have questions about stencils, screen printing, custom DTF sheets, or bulk apparel? Write to us and we'll reply shortly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Details Card */}
          <div className="p-8 rounded-3xl border border-border bg-card/40 backdrop-blur space-y-8 flex flex-col justify-between">
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <MessageSquare className="text-[#2CFF05]" size={20} />
                Contact Information
              </h2>
              
              <div className="space-y-4 text-sm text-foreground">
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-[#2CFF05] mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Phone & WhatsApp</p>
                    <p className="text-xs text-muted-foreground mt-0.5">+94 77 973 1097</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-[#2CFF05] mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Email Address</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      <a href="mailto:hello@bitiumtechnology.com" className="hover:text-[#2CFF05] transition-colors">
                        hello@bitiumtechnology.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-[#2CFF05] mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Main Office & Factory</p>
                    <p className="text-xs text-muted-foreground mt-0.5">102 Galle Road, Colombo 03, Sri Lanka</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-[#2CFF05] mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Opening Hours</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Mon - Sat: 8:30 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-6 text-center md:text-left">
              <p className="text-xs text-muted-foreground font-medium">
                Bitium Technology - Leading High-Performance Custom Printing Solutions
              </p>
            </div>
          </div>

          {/* Form Card */}
          <div className="p-8 rounded-3xl border border-border bg-card/40 backdrop-blur">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-8">
                <div className="w-12 h-12 rounded-full bg-[#2CFF05]/20 border border-[#2CFF05] flex items-center justify-center text-[#2CFF05] text-lg font-bold">
                  ✓
                </div>
                <h3 className="font-bold text-lg text-foreground">Message Sent!</h3>
                <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                  Thank you for contacting us. Our support agent will reach out to you within 2-4 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 rounded-lg bg-muted hover:bg-muted text-xs font-semibold text-foreground transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-[#2CFF05] text-sm text-foreground placeholder-zinc-600 outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-[#2CFF05] text-sm text-foreground placeholder-zinc-600 outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-[#2CFF05] text-sm text-foreground placeholder-zinc-600 outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-[#2CFF05] hover:bg-[#45ff24] font-bold text-xs flex items-center justify-center gap-2 transition-all glow-primary shadow-lg shadow-[#2CFF05]/20 text-[#0a0a0a] disabled:opacity-50"
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
