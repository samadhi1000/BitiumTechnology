'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', whatsapp: '', address: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.whatsapp || !form.address || !form.message) return;
    
    setLoading(true);
    // Simulate submission
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      setForm({ name: '', whatsapp: '', address: '', message: '' });
    }, 800);
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* ContactPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact Bitium Technology",
            "description": "Get in touch with Bitium Technology for custom DTF printing, stencils, and screen printing services in Digana, Sri Lanka.",
            "url": "https://www.bitiumtechnology.com/contact",
            "mainEntity": {
              "@type": "LocalBusiness",
              "name": "Bitium Technology",
              "telephone": "+94779731097",
              "email": "hello@bitiumtechnology.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "391/1 New Town Digana Rajawella",
                "addressLocality": "Digana",
                "postalCode": "20180",
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
                    <p className="text-xs text-muted-foreground mt-0.5">391/1 New Town Digana Rajawella, Digana, Sri Lanka, 20180</p>
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

              {/* Social Channels */}
              <div className="pt-2">
                <p className="text-xs font-semibold text-foreground mb-2.5 uppercase tracking-wider">Follow & Connect</p>
                <div className="flex items-center gap-3">
                  <a
                    href="https://web.facebook.com/bitiumtechnology"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-card border border-border hover:border-blue-500/50 hover:bg-blue-500/10 text-xs font-medium text-muted-foreground hover:text-blue-400 transition-all flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                    </svg>
                    Facebook
                  </a>
                  <a
                    href="http://www.youtube.com/@bitiumtechnology2103"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-card border border-border hover:border-red-500/50 hover:bg-red-500/10 text-xs font-medium text-muted-foreground hover:text-red-400 transition-all flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                    YouTube
                  </a>
                  <a
                    href="https://www.tiktok.com/@bitiumtechnology"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-card border border-border hover:border-[#2CFF05]/50 hover:bg-[#2CFF05]/10 text-xs font-medium text-muted-foreground hover:text-[#2CFF05] transition-all flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.94-1.74-.22-.2-.41-.43-.61-.65-.02 4.11.01 8.22-.02 12.33-.18 2.44-1.46 4.88-3.76 5.75-2.28.87-4.96.48-6.84-1.01-2.02-1.61-2.88-4.38-2.12-6.89.6-1.93 2.13-3.61 4.14-4.14 1.25-.33 2.59-.14 3.73.43V4.07c-1.95-.59-3.75-1.9-4.73-3.66C7.5.39 7.4.37 7.3.35v11.23c-1.3-.9-3.05-1.12-4.52-.53-1.61.64-2.8 2.21-3.05 3.93-.3 2.05.61 4.22 2.29 5.27 1.68 1.05 3.96.93 5.48-.3 1.25-1.02 1.83-2.65 1.78-4.24.03-5.23-.01-10.46.02-15.69z" />
                    </svg>
                    TikTok
                  </a>
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
                  <label htmlFor="whatsapp" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    id="whatsapp"
                    required
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    placeholder="+94 77 123 4567"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-[#2CFF05] text-sm text-foreground placeholder-zinc-600 outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="address" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    required
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Enter your street address, city"
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
