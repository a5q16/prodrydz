"use client";

import { useState, useEffect } from "react";

export default function StickyCta() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const checkoutSection = document.getElementById("checkout");
    if (!checkoutSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Hide when checkout form is visible
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(checkoutSection);
    return () => observer.disconnect();
  }, []);

  const scrollToCheckout = () => {
    const el = document.getElementById("checkout");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      id="sticky-cta"
      className={`sticky-cta-bar sm:hidden transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <button
        onClick={scrollToCheckout}
        className="cta-pulse w-full rounded-xl bg-cta py-3.5 text-base font-bold text-cta-foreground transition-all active:scale-[0.98]"
      >
        اطلب الآن والدفع عند الاستلام 🚗
      </button>
    </div>
  );
}
