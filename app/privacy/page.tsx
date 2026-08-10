'use client';

import React from 'react';
import { Shield } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="w-full min-h-screen bg-background text-foreground py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Canonical Link */}
      <link rel="canonical" href="https://www.bitiumtechnology.com/privacy" />

      {/* Privacy Policy Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Privacy Policy | Bitium Technology",
            "description": "Learn about the Privacy Policy of Bitium Technology - DTF and screen printing services in Sri Lanka.",
            "url": "https://www.bitiumtechnology.com/privacy"
          })
        }}
      />

      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#2CFF05]/10 rounded-full filter blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2CFF05]/10 rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10 space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#2CFF05]/10 border border-[#2CFF05]/25 rounded-full px-3.5 py-1.5 mb-2">
            <Shield size={12} className="text-[#2CFF05]" />
            <span className="font-heading font-semibold text-[11px] text-[#2CFF05] tracking-wider uppercase">SECURITY & TRUST</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
            Privacy <span className="text-[#2CFF05]">Policy</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">
            Last updated: 2026/8/8
          </p>
        </div>

        {/* Content Box */}
        <div className="p-8 sm:p-12 rounded-3xl border border-border bg-card/40 backdrop-blur space-y-8 text-sm text-muted-foreground leading-relaxed">
          <p>
            Bitium Technology (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the website <a href="https://www.bitiumtechnology.com" className="text-[#2CFF05] hover:underline">bitiumtechnology.com</a>, offering DTF (Direct-to-Film) and screen printing services in Sri Lanka. This policy explains what information we collect from you, how we use it, and the choices you have.
          </p>
          <p>
            By using our website or placing an order with us, you agree to the practices described here.
          </p>

          <hr className="border-border" />

          {/* Section 1 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#2CFF05] font-heading">Information We Collect</h2>
            
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Information you give us directly:</h3>
              <p>When you place an order, request a quote, or contact us, we may collect:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Your name, email address, and phone number</li>
                <li>Your delivery address</li>
                <li>Details about the order itself (design files, quantities, garment specs)</li>
                <li>Payment information, processed securely through our payment gateway (see &ldquo;Payments&rdquo; below)</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Information collected automatically:</h3>
              <p>
                When you browse the site, we use Google Analytics to understand how visitors use it - pages viewed, time on site, general location, and device/browser type. This data is aggregated and doesn&apos;t identify you personally. You can opt out of Google Analytics tracking using the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-[#2CFF05] hover:underline">Google Analytics Opt-out Browser Add-on</a>.
              </p>
              <p>
                We may also use cookies to keep the site running smoothly (for example, remembering items in a cart). You can disable cookies in your browser settings, though some parts of the site may not work as well as a result.
              </p>
            </div>
          </div>

          <hr className="border-border" />

          {/* Section 2 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#2CFF05] font-heading">How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Process and fulfil your orders</li>
              <li>Communicate with you about your order, quotes, or enquiries</li>
              <li>Improve our website and services</li>
              <li>Send you updates or offers, only if you&apos;ve opted in to receive them</li>
              <li>Meet our legal and accounting obligations</li>
            </ul>
            <p className="font-semibold text-foreground">We don&apos;t sell your personal information to anyone, ever.</p>
          </div>

          <hr className="border-border" />

          {/* Section 3 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#2CFF05] font-heading">Payments</h2>
            <p>
              Online payments are processed through PayHere, a licensed third-party payment processor. We do not store your full card details on our servers - that information is handled directly by the payment gateway under its own security standards and privacy policy.
            </p>
          </div>

          <hr className="border-border" />

          {/* Section 4 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#2CFF05] font-heading">Sharing Your Information</h2>
            <p>We only share your information where it&apos;s genuinely necessary:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>With our payment processor, to complete transactions</li>
              <li>With delivery/courier partners, to get your order to you</li>
              <li>If required by law, or to protect our legal rights</li>
            </ul>
            <p>We do not share your data with third parties for their own marketing purposes.</p>
          </div>

          <hr className="border-border" />

          {/* Section 5 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#2CFF05] font-heading">Data Retention</h2>
            <p>
              We keep your information for as long as needed to fulfil your order, meet accounting/tax requirements, and handle any related disputes. After that, we delete or anonymise it.
            </p>
          </div>

          <hr className="border-border" />

          {/* Section 6 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#2CFF05] font-heading">Your Rights</h2>
            <p>Under Sri Lanka&apos;s Personal Data Protection Act, No. 9 of 2022, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Know what personal data we hold about you</li>
              <li>Ask us to correct inaccurate data</li>
              <li>Ask us to delete your data, where there&apos;s no legal reason for us to keep it</li>
              <li>Withdraw consent for marketing communications at any time</li>
            </ul>
            <p>
              To exercise any of these rights, contact us at <a href="mailto:hello@bitiumtechnology.com" className="text-[#2CFF05] hover:underline">hello@bitiumtechnology.com</a>.
            </p>
          </div>

          <hr className="border-border" />

          {/* Section 7 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#2CFF05] font-heading">Data Security</h2>
            <p>
              We take reasonable technical and organisational steps to keep your information safe from unauthorised access, loss, or misuse. That said, no method of transmission over the internet is 100% secure, and we can&apos;t guarantee absolute security.
            </p>
          </div>

          <hr className="border-border" />

          {/* Section 8 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#2CFF05] font-heading">Children&apos;s Privacy</h2>
            <p>Our services are intended for individuals 18 years and older. We don&apos;t knowingly collect information from children.</p>
          </div>

          <hr className="border-border" />

          {/* Section 9 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#2CFF05] font-heading">Changes to This Policy</h2>
            <p>
              We may update this policy occasionally to reflect changes in our practices or legal requirements. The &ldquo;Last updated&rdquo; date at the top will always reflect the most recent version.
            </p>
          </div>

          <hr className="border-border" />

          {/* Section 10 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#2CFF05] font-heading">Contact Us</h2>
            <p>If you have questions about this policy or how we handle your data, reach out to:</p>
            <div className="p-4 rounded-2xl bg-background/50 border border-border/60 space-y-1 text-xs">
              <p className="font-extrabold text-foreground text-sm mb-1">Bitium Technology</p>
              <p>Email: <a href="mailto:hello@bitiumtechnology.com" className="text-[#2CFF05] hover:underline">hello@bitiumtechnology.com</a></p>
              <p>Phone: +94 71 552 0897 (Mobile)</p>
              <p>WhatsApp: +94 77 973 1097</p>
              <p>Address: 1391/1 New Town Digana, Rajawella, Digana, Sri Lanka, 20180</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
