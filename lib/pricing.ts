import { Bundle, BundleType } from "./types";

export const bundles: Bundle[] = [
  {
    type: "1_piece",
    label_ar: "قطعة واحدة",
    quantity: 1,
    price: 2900,
    freeShipping: false,
  },
  {
    type: "2_pieces",
    label_ar: "قطعتين (2)",
    quantity: 2,
    price: 5300,
    freeShipping: true,
    badge_ar: "🔥 توصيل مجاني لباب الدار",
    highlight: true,
  },
  {
    type: "3_pieces",
    label_ar: "3 قطع",
    quantity: 3,
    price: 7900,
    freeShipping: true,
    badge_ar: "🎁 توصيل مجاني + أفضل سعر",
  },
];

export function getBundleByType(type: BundleType): Bundle | undefined {
  return bundles.find((b) => b.type === type);
}

export interface PriceBreakdown {
  bundlePrice: number;
  shippingFee: number;
  totalPrice: number;
  bundleLabel: string;
}

export function calculatePrice(
  bundleType: BundleType,
  wilayaId: number,
  deliveryType: "domicile" | "stopdesk"
): PriceBreakdown {
  const bundle = getBundleByType(bundleType);
  if (!bundle) {
    throw new Error(`Invalid bundle type: ${bundleType}`);
  }

  // Import dynamically or get fee
  let shippingFee = 0;
  if (!bundle.freeShipping) {
    if (wilayaId === 16) {
      shippingFee = deliveryType === "domicile" ? 400 : 250;
    } else {
      shippingFee = deliveryType === "domicile" ? 700 : 400;
    }
  }

  return {
    bundlePrice: bundle.price,
    shippingFee,
    totalPrice: bundle.price + shippingFee,
    bundleLabel: bundle.label_ar,
  };
}

export function formatPrice(amount: number): string {
  return `${amount.toLocaleString("ar-DZ")} دج`;
}
