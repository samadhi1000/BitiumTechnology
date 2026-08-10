'use client';

import React from 'react';
import { Scale } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="w-full min-h-screen bg-background text-foreground py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Canonical Link */}
      <link rel="canonical" href="https://www.bitiumtechnology.com/terms" />

      {/* Terms of Service Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Terms of Service | Bitium Technology",
            "description": "Read the terms governing the use of bitiumtechnology.com and custom printing orders.",
            "url": "https://www.bitiumtechnology.com/terms"
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
            <Scale size={12} className="text-[#2CFF05]" />
            <span className="font-heading font-semibold text-[11px] text-[#2CFF05] tracking-wider uppercase">LEGAL FRAMEWORK</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
            Terms of <span className="text-[#2CFF05]">Service</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">
            Last updated: 2026/8/8
          </p>
        </div>

        {/* Content Box */}
        <div className="p-8 sm:p-12 rounded-3xl border border-border bg-card/40 backdrop-blur space-y-8 text-sm text-muted-foreground leading-relaxed">
          <p>
            Welcome to <a href="https://www.bitiumtechnology.com" className="text-[#2CFF05] hover:underline">bitiumtechnology.com</a>. These terms govern your use of our website and any orders you place with Bitium Technology (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;) for DTF and screen printing services. By using the site or placing an order, you agree to these terms.
          </p>

          <hr className="border-border" />

          {/* Section 1 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#2CFF05] font-heading">Our Services</h2>
            <p>
              We offer custom DTF (Direct-to-Film) and screen printing on garments and other items, based on the designs, quantities, and specifications you provide when ordering.
            </p>
          </div>

          <hr className="border-border" />

          {/* Section 2 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#2CFF05] font-heading">Orders</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                All orders are subject to acceptance by us. We may decline or cancel an order at our discretion - for example, if a design infringes someone else&apos;s rights, or if we&apos;re unable to fulfil it for any reason.
              </li>
              <li>
                You&apos;re responsible for making sure the design files, sizes, and quantities you submit are correct. Once production has started, changes may not be possible.
              </li>
              <li>Estimated turnaround times are just that - estimates. We&apos;ll let you know if there&apos;s a delay.</li>
            </ul>
          </div>

          <hr className="border-border" />

          {/* Section 3 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#2CFF05] font-heading">Pricing and Payment</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                All prices are listed in LKR and are subject to change without notice, though confirmed orders will keep the price agreed at the time of order.
              </li>
              <li>Payment is processed securely through PayHere. By paying, you agree to that gateway&apos;s own terms as well.</li>
              <li>
                Orders are only confirmed and scheduled for production once payment has been received, unless otherwise agreed in writing.
              </li>
            </ul>
          </div>

          <hr className="border-border" />

          {/* Section 4 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#2CFF05] font-heading">Your Content and Designs</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>You retain ownership of any designs, logos, or artwork you submit to us.</li>
              <li>
                By submitting a design, you confirm that you own it or have the right to use it, and that it doesn&apos;t infringe on anyone else&apos;s copyright, trademark, or other rights.
              </li>
              <li>You agree to indemnify us against any claims arising from content you submit for printing.</li>
              <li>
                We may decline to print any content that is illegal, infringing, offensive, or otherwise inappropriate, at our discretion.
              </li>
            </ul>
          </div>

          <hr className="border-border" />

          {/* Section 5 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#2CFF05] font-heading">Delivery</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Delivery timeframes and areas depend on the courier or delivery method selected at checkout.</li>
              <li>Risk in the goods passes to you once they&apos;ve been handed over to the courier or collected by you.</li>
              <li>If an item arrives damaged or incorrect, contact us within 7 days of delivery so we can sort it out.</li>
            </ul>
          </div>

          <hr className="border-border" />

          {/* Section 6 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#2CFF05] font-heading">Returns, Refunds, and Reprints</h2>
            <p>
              Because our products are custom-made to your specifications, we generally don&apos;t accept returns for change of mind. However:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                If there&apos;s a genuine fault or error on our part (wrong design, poor print quality, damaged goods), we&apos;ll offer a reprint or refund.
              </li>
              <li>
                Refund requests should be raised within 7 days of receiving your order, with photos of the issue where relevant.
              </li>
            </ul>
          </div>

          <hr className="border-border" />

          {/* Section 7 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#2CFF05] font-heading">Intellectual Property</h2>
            <p>
              All content on this website - text, images, logos, and branding - belongs to Bitium Technology unless stated otherwise, and may not be copied or reused without our permission.
            </p>
          </div>

          <hr className="border-border" />

          {/* Section 8 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#2CFF05] font-heading">Limitation of Liability</h2>
            <p>
              To the extent permitted by law, Bitium Technology is not liable for indirect, incidental, or consequential losses arising from the use of our website or services. Our total liability for any claim is limited to the amount you paid for the order in question.
            </p>
          </div>

          <hr className="border-border" />

          {/* Section 9 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#2CFF05] font-heading">Governing Law</h2>
            <p>
              These terms are governed by the laws of Sri Lanka. Any disputes will be subject to the exclusive jurisdiction of the courts of Sri Lanka.
            </p>
          </div>

          <hr className="border-border" />

          {/* Section 10 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#2CFF05] font-heading">Changes to These Terms</h2>
            <p>
              We may update these terms from time to time. Continued use of the site after changes are posted means you accept the updated terms.
            </p>
          </div>

          <hr className="border-border" />

          {/* Contact details */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#2CFF05] font-heading">Contact Us</h2>
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
