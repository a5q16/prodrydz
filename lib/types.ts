import { z } from "zod";

export type BundleType = "1_piece" | "2_pieces" | "3_pieces";
export type DeliveryType = "domicile" | "stopdesk";
export type PaymentMethod = "cod" | "baridimob";
export type OrderStatus = "pending" | "confirmed" | "cancelled" | "shipped";

export interface Bundle {
  type: BundleType;
  label_ar: string;
  quantity: number;
  price: number;
  freeShipping: boolean;
  badge_ar?: string;
  highlight?: boolean;
}

export interface Wilaya {
  id: number;
  name_ar: string;
  name_fr: string;
  domicileFee: number;
  stopdeskFee: number;
}

export interface Order {
  id: string;
  order_number: number;
  created_at: string;
  full_name: string;
  phone: string;
  wilaya_id: number;
  wilaya_name: string;
  commune: string;
  address: string;
  bundle_type: BundleType;
  delivery_type: DeliveryType;
  payment_method: PaymentMethod;
  total_price: number;
  shipping_fee: number;
  status: OrderStatus;
  tracking_code: string | null;
  ecotrack_response: Record<string, unknown> | null;
}

export const orderFormSchema = z.object({
  full_name: z
    .string()
    .min(3, "الاسم يجب أن يكون 3 أحرف على الأقل")
    .max(100, "الاسم طويل جدًا"),
  phone: z
    .string()
    .regex(
      /^0[567]\d{8}$/,
      "رقم الهاتف غير صالح — يجب أن يبدأ بـ 05 أو 06 أو 07"
    ),
  wilaya_id: z.coerce
    .number()
    .min(1, "يرجى اختيار الولاية")
    .max(58, "ولاية غير صالحة"),
  commune: z
    .string()
    .min(2, "يرجى إدخال البلدية")
    .max(100, "اسم البلدية طويل جدًا"),
  address: z
    .string()
    .min(5, "يرجى إدخال العنوان الكامل")
    .max(300, "العنوان طويل جدًا"),
  bundle_type: z.enum(["1_piece", "2_pieces", "3_pieces"], {
    message: "يرجى اختيار العرض",
  }),
  delivery_type: z.enum(["domicile", "stopdesk"], {
    message: "يرجى اختيار نوع التوصيل",
  }),
  payment_method: z.enum(["cod", "baridimob"], {
    message: "يرجى اختيار طريقة الدفع",
  }),
});

export type OrderFormData = z.infer<typeof orderFormSchema>;
