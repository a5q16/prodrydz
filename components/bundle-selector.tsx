"use client";

import { bundles } from "@/lib/pricing";
import type { BundleType } from "@/lib/types";

interface BundleSelectorProps {
  selectedBundle: BundleType;
  onBundleChange: (bundle: BundleType) => void;
}

export default function BundleSelector({
  selectedBundle,
  onBundleChange,
}: BundleSelectorProps) {
  return (
    <section id="bundles" className="py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Scarcity Alert Bar */}
        <div className="w-full bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mb-8 text-center">
          <p className="text-amber-400 text-sm sm:text-base font-medium flex items-center justify-center gap-2">
            <span>⚠️</span>
            <span>تنبيه: الكمية المتبقية بالسعر المخفض من دفعة هذا الأسبوع محدودة جداً</span>
          </p>
        </div>

        {/* Section header */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            اختر العرض المناسب لك
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            كلما طلبت أكثر، وفّرت أكثر — التوصيل مجاني من قطعتين
          </p>
        </div>

        {/* Bundle Cards */}
        <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
          {bundles.map((bundle) => {
            const isSelected = selectedBundle === bundle.type;
            const isPopular = bundle.highlight;

            return (
              <button
                key={bundle.type}
                id={`bundle-${bundle.type}`}
                type="button"
                onClick={() => onBundleChange(bundle.type)}
                className={`relative flex flex-col rounded-2xl border-2 p-5 text-right transition-all duration-200 ${
                  isSelected
                    ? "border-accent bg-accent/5 shadow-lg shadow-accent/10"
                    : "border-border/50 bg-card hover:border-accent/30"
                } ${isPopular ? "sm:scale-[1.03]" : ""}`}
              >
                {/* Popular badge */}
                {isPopular && (
                  <div className="absolute -top-3 right-4 rounded-full bg-accent px-3 py-0.5 text-xs font-bold text-white shadow-md">
                    الأكثر طلبًا ⭐
                  </div>
                )}

                {/* Selection indicator & label */}
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                        isSelected
                          ? "border-accent bg-accent"
                          : "border-muted-foreground/30"
                      }`}
                    >
                      {isSelected && (
                        <svg
                          className="h-3 w-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={3}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-base font-bold text-foreground">
                      {bundle.label_ar}
                    </span>
                  </div>

                  {/* Savings Tag */}
                  <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                    {bundle.discountBadge}
                  </span>
                </div>

                {/* Price Display with Strikethrough */}
                <div className="mb-2 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-orange-500">
                    {bundle.price.toLocaleString("ar-DZ")} <span className="text-sm font-medium">دج</span>
                  </span>
                  <span className="line-through text-slate-400 text-sm sm:text-base">
                    {bundle.originalPrice.toLocaleString("ar-DZ")} دج
                  </span>
                </div>

                {/* Per-piece price calculation */}
                {bundle.quantity > 1 && (
                  <p className="mb-2 text-xs text-muted-foreground">
                    أي{" "}
                    <span className="font-semibold text-foreground">
                      {Math.round(bundle.price / bundle.quantity).toLocaleString("ar-DZ")} دج
                    </span>{" "}
                    للقطعة الواحدة
                  </p>
                )}

                {/* Free shipping perk badge */}
                {bundle.badge_ar && (
                  <div
                    className={`mt-auto rounded-lg px-3 py-1.5 text-xs font-semibold ${
                      isSelected
                        ? "bg-cta/15 text-cta"
                        : "bg-cta/10 text-cta"
                    }`}
                  >
                    {bundle.badge_ar}
                  </div>
                )}

                {/* Shipping cost note for single */}
                {!bundle.freeShipping && (
                  <p className="mt-auto text-xs text-muted-foreground">
                    + مصاريف التوصيل حسب الولاية
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
