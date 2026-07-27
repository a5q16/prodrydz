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
        <Hero />

        <BundleSelector
          selectedBundle={selectedBundle}
          onBundleChange={setSelectedBundle}
        />

        <CheckoutForm selectedBundle={selectedBundle} />

        {/* Divider */}
        <div className="mx-auto max-w-xs border-t border-border/30" />

        <Benefits />
      </main>

      <Footer />

      <StickyCta />
    </>
  );
}
