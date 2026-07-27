import { Bundle, BundleType, DeliveryType } from "./types";
import { getWilayaById } from "./wilayas";

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
    badge_ar: "🎁 توصيل مجاني لباب الدار",
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

export function getShippingFee(
  wilayaId: number,
  deliveryType: DeliveryType,
  bundleType: string
): number {
  if (bundleType === "2_pieces" || bundleType === "3_pieces") {
    return 0; // Free shipping for bundles 2 & 3
  }

  const wilaya = getWilayaById(wilayaId);
  if (!wilaya) {
    return deliveryType === "domicile" ? 700 : 400;
  }

  if (deliveryType === "domicile") {
    return wilaya.domicileFee ?? 700;
  } else {
    return wilaya.stopdeskFee ?? 400;
  }
}

export function calculatePrice(
  bundleType: BundleType,
  wilayaId: number,
  deliveryType: DeliveryType
): PriceBreakdown {
  const bundle = getBundleByType(bundleType);
  if (!bundle) {
    throw new Error(`Invalid bundle type: ${bundleType}`);
  }

  const shippingFee = getShippingFee(wilayaId, deliveryType, bundleType);

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
