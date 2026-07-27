"use client";

import { useState } from "react";
import Header from "@/components/header";
import Hero from "@/components/hero";
import Benefits from "@/components/benefits";
import Gallery from "@/components/gallery";
import BundleSelector from "@/components/bundle-selector";
import CheckoutForm from "@/components/checkout-form";
import StickyCta from "@/components/sticky-cta";
import Footer from "@/components/footer";
import type { BundleType } from "@/lib/types";

export default function Home() {
  const [selectedBundle, setSelectedBundle] = useState<BundleType>("1_piece");

  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Section 1: Hero (Hook & 9:16 Vertical Video) */}
        <Hero />

        {/* Section 2: Benefits / Why ProDry? */}
        <Benefits />

        {/* Section 3: Visual Proof Gallery */}
        <Gallery />

        {/* Divider */}
        <div className="mx-auto max-w-xs border-t border-border/30" />

        {/* Section 4: Bundle Selector & Checkout Form */}
        <div id="bundles">
          <BundleSelector
            selectedBundle={selectedBundle}
            onBundleChange={setSelectedBundle}
          />
        </div>

        <div id="checkout">
          <CheckoutForm selectedBundle={selectedBundle} />
        </div>
      </main>

      <Footer />

      <StickyCta />
    </>
  );
}
