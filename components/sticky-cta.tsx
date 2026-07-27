"use client";

import { useState, useEffect } from "react";

export default function StickyCta() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const bundlesSection = document.getElementById("bundles");
    if (!bundlesSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Hide when bundle selector / form is visible
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(bundlesSection);
    return () => observer.disconnect();
  }, []);

  const scrollToBundles = () => {
    const el = document.getElementById("bundles");
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
        onClick={scrollToBundles}
        className="cta-pulse w-full rounded-xl bg-cta py-3.5 text-base font-bold text-cta-foreground transition-all active:scale-[0.98]"
      >
        اطلب الآن والدفع عند الاستلام 🚗
      </button>
    </div>
  );
}
