"use client";

import { useState } from "react";
import Header from "@/components/header";
import Hero from "@/components/hero";
import Benefits from "@/components/benefits";
import BundleSelector from "@/components/bundle-selector";
import CheckoutForm from "@/components/checkout-form";
import StickyCta from "@/components/sticky-cta";
import Footer from "@/components/footer";
import type { BundleType } from "@/lib/types";

export default function Home() {
  const [selectedBundle, setSelectedBundle] = useState<BundleType>("2_pieces");

  return (
    <>
      <Header />

      <main className="flex-1">
        {/* 1. Hero Section (Hook & 9:16 Vertical Video) */}
        <Hero />

        {/* 2. Visual Proof & Benefits */}
        <Benefits />

        {/* Divider */}
        <div className="mx-auto max-w-xs border-t border-border/30" />

        {/* 3. Bundle Selector & Checkout Form (#checkout anchor) */}
        <div id="checkout">
          <BundleSelector
            selectedBundle={selectedBundle}
            onBundleChange={setSelectedBundle}
          />

          <CheckoutForm selectedBundle={selectedBundle} />
        </div>
      </main>

      <Footer />

      <StickyCta />
    </>
  );
}
