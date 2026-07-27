"use client";

import { useState, useTransition, useEffect } from "react";
import { wilayasData, getWilayaById } from "@/lib/wilayas";
import { getCommunesByWilaya } from "@/lib/ecotrack-data";
import { calculatePrice, formatPrice } from "@/lib/pricing";
import { orderFormSchema, type BundleType, type DeliveryType, type PaymentMethod } from "@/lib/types";
import { toast } from "sonner";

interface CheckoutFormProps {
  selectedBundle: BundleType;
}

interface FormErrors {
  [key: string]: string | undefined;
}

export default function CheckoutForm({ selectedBundle }: CheckoutFormProps) {
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("domicile");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [stopdeskHint, setStopdeskHint] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    wilaya_id: 0,
    commune: "",
  });

  const selectedWilayaObj = getWilayaById(formData.wilaya_id);
  const selectedWilayaId = formData.wilaya_id || 16;
  const priceBreakdown = calculatePrice(selectedBundle, selectedWilayaId, deliveryType);
  const communesList = formData.wilaya_id > 0 ? getCommunesByWilaya(formData.wilaya_id, deliveryType === "stopdesk") : [];

  // Check if current wilaya supports Stopdesk
  const hasStopdeskSupport = selectedWilayaObj ? selectedWilayaObj.stopdeskFee !== null : true;

  // Auto fallback to domicile if selected wilaya does NOT support stopdesk
  useEffect(() => {
    if (selectedWilayaObj && selectedWilayaObj.stopdeskFee === null && deliveryType === "stopdesk") {
      setDeliveryType("domicile");
      toast.info(`التوصيل للمكتب غير متوفر لولاية ${selectedWilayaObj.name_ar}، تم اختيار التوصيل لباب الدار تلقائياً.`);
    }
  }, [selectedWilayaObj, deliveryType]);

  // Re-check commune when deliveryType changes to stopdesk
  useEffect(() => {
    if (formData.wilaya_id > 0 && formData.commune && deliveryType === "stopdesk") {
      const validCommunes = getCommunesByWilaya(formData.wilaya_id, true);
      const exists = validCommunes.some((c) => c.nom === formData.commune);
      if (!exists) {
        setFormData((prev) => ({ ...prev, commune: "" }));
        setStopdeskHint(true);
      } else {
        setStopdeskHint(false);
      }
    } else {
      setStopdeskHint(false);
    }
  }, [deliveryType, formData.wilaya_id, formData.commune]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "wilaya_id") {
      const newWilayaId = parseInt(value) || 0;
      const targetWilaya = getWilayaById(newWilayaId);
      
      // Auto-fallback if switching to a wilaya without stopdesk
      if (targetWilaya && targetWilaya.stopdeskFee === null && deliveryType === "stopdesk") {
        setDeliveryType("domicile");
      }

      setFormData((prev) => ({
        ...prev,
        wilaya_id: newWilayaId,
        commune: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const wilayaName = selectedWilayaObj?.name_ar || "";
    const constructedAddress = `${formData.commune}, Wilaya ${formData.wilaya_id}`;

    const data = {
      ...formData,
      address: constructedAddress,
      bundle_type: selectedBundle,
      delivery_type: deliveryType,
      payment_method: paymentMethod,
    };

    const result = orderFormSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      const firstErrorField = document.querySelector('[data-error="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...result.data,
            address: constructedAddress,
            wilaya_name: wilayaName,
            total_price: priceBreakdown.totalPrice,
            shipping_fee: priceBreakdown.shippingFee,
          }),
        });

        const responseData = await response.json().catch(() => ({}));

        if (response.ok && responseData.success) {
          setSubmitted(true);

          if (paymentMethod === "baridimob" && responseData.order_number) {
            toast.success("تم تسجيل طلبك! جاري تحويلك للدفع عبر بريدي موب...", {
              duration: 3000,
            });
            setTimeout(() => {
              const msg = encodeURIComponent(
                `مرحباً ProDry، قمت بتسجيل طلب جديد رقم #${responseData.order_number} باسم (${formData.full_name}) وأريد الدفع عبر بريدي موب. أرجو إرسال معلومات الحساب (RIP).`
              );
              window.open(`https://wa.me/213672614917?text=${msg}`, "_blank");
            }, 1500);
          } else {
            toast.success("تم تسجيل طلبك بنجاح! سنتواصل معك قريبًا ✅", {
              duration: 5000,
            });
          }
        } else {
          toast.error(
            responseData.message || "حدث خطأ أثناء تسجيل الطلب. يرجى المحاولة مرة أخرى.",
            { duration: 5000 }
          );
        }
      } catch {
        toast.error("حدث خطأ في الاتصال. تأكد من اتصالك بالإنترنت.", {
          duration: 5000,
        });
      }
    });
  };

  if (submitted) {
    return (
      <section id="checkout" className="py-12 sm:py-16">
        <div className="mx-auto max-w-xl px-4 sm:px-6">
          <div className="rounded-2xl border border-cta/30 bg-cta/5 p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cta/20">
              <svg className="h-8 w-8 text-cta" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-foreground">
              تم تسجيل طلبك بنجاح! 🎉
            </h3>
            <p className="text-sm text-muted-foreground">
              {paymentMethod === "baridimob"
                ? "سيتم تحويلك لواتساب لإتمام الدفع عبر بريدي موب."
                : "سنتصل بك قريبًا لتأكيد الطلب. شكرًا لثقتك في ProDry DZ!"}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="checkout" className="py-12 sm:py-16">
      <div className="mx-auto max-w-xl px-4 sm:px-6">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            أكمل طلبك الآن
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            الدفع عند الاستلام — بدون أي مخاطرة
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-border/50 bg-card p-5 shadow-xl sm:p-7"
        >
          {/* Full Name */}
          <div>
            <label htmlFor="full_name" className="mb-1.5 block text-sm font-semibold text-foreground">
              الاسم الكامل <span className="text-destructive">*</span>
            </label>
            <input
              id="full_name" name="full_name" type="text"
              value={formData.full_name} onChange={handleChange}
              data-error={!!errors.full_name}
              placeholder="مثال: محمد أمين بوزيد"
              className={`form-input-focus w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all ${errors.full_name ? "border-destructive" : "border-border"}`}
            />
            {errors.full_name && <p className="mt-1 text-xs text-destructive">{errors.full_name}</p>}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-foreground">
              رقم الهاتف <span className="text-destructive">*</span>
            </label>
            <input
              id="phone" name="phone" type="tel" inputMode="numeric"
              value={formData.phone} onChange={handleChange}
              data-error={!!errors.phone}
              placeholder="مثال: 0550123456" dir="ltr"
              className={`form-input-focus w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground text-left placeholder:text-right placeholder:text-muted-foreground/60 transition-all ${errors.phone ? "border-destructive" : "border-border"}`}
            />
            {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
          </div>

          {/* ──────── Delivery Type Toggle ──────── */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">
              نوع التوصيل <span className="text-destructive">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryType("domicile")}
                className={`flex items-center justify-center gap-2 rounded-xl border-2 px-3 py-3 text-sm font-semibold transition-all ${
                  deliveryType === "domicile"
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border bg-background text-muted-foreground hover:border-accent/30"
                }`}
              >
                🏠 باب الدار
              </button>
              <button
                type="button"
                disabled={!hasStopdeskSupport}
                onClick={() => setDeliveryType("stopdesk")}
                className={`flex items-center justify-center gap-2 rounded-xl border-2 px-3 py-3 text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  deliveryType === "stopdesk"
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border bg-background text-muted-foreground hover:border-accent/30"
                }`}
              >
                🏢 مكتب التوصيل
              </button>
            </div>
          </div>

          {/* Wilaya */}
          <div>
            <label htmlFor="wilaya_id" className="mb-1.5 block text-sm font-semibold text-foreground">
              الولاية <span className="text-destructive">*</span>
            </label>
            <select
              id="wilaya_id" name="wilaya_id"
              value={formData.wilaya_id} onChange={handleChange}
              data-error={!!errors.wilaya_id}
              className={`form-input-focus w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground transition-all appearance-none ${errors.wilaya_id ? "border-destructive" : "border-border"} ${formData.wilaya_id === 0 ? "text-muted-foreground/60" : ""}`}
            >
              <option value={0} disabled>اختر الولاية...</option>
              {wilayasData.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.id} - {w.name_ar} ({w.name_fr})
                </option>
              ))}
            </select>
            {errors.wilaya_id && <p className="mt-1 text-xs text-destructive">{errors.wilaya_id}</p>}
          </div>

          {/* ──────── StopDesk Informational Card ──────── */}
          {deliveryType === "stopdesk" && selectedWilayaObj?.stopdesk && (
            <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 space-y-2 text-right transition-all">
              <div className="flex items-center justify-between border-b border-accent/20 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-accent">
                  معلومات مكتب التوصيل ({selectedWilayaObj.name_ar})
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  ⏱️ {selectedWilayaObj.duration}
                </span>
              </div>
              <div className="space-y-1 text-xs text-foreground">
                <p>
                  <strong className="text-muted-foreground">الوكالة:</strong>{" "}
                  <span className="font-semibold uppercase">{selectedWilayaObj.stopdesk.agency}</span>
                </p>
                <p>
                  <strong className="text-muted-foreground">العنوان:</strong>{" "}
                  {selectedWilayaObj.stopdesk.address}
                </p>
                <p dir="ltr" className="text-right">
                  <strong className="text-muted-foreground">الهاتف:</strong>{" "}
                  <span className="font-mono">{selectedWilayaObj.stopdesk.phone}</span>
                </p>
              </div>
              {selectedWilayaObj.stopdesk.maps_link !== "" && (
                <div className="pt-2">
                  <a
                    href={selectedWilayaObj.stopdesk.maps_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-accent/15 px-3 py-2 text-xs font-bold text-accent transition-colors hover:bg-accent hover:text-white"
                  >
                    📍 عرض موقع المكتب على خريطة جوجل
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Commune (Dynamic Dropdown + Smart Filtering) */}
          <div>
            <label htmlFor="commune" className="mb-1.5 block text-sm font-semibold text-foreground">
              البلدية <span className="text-destructive">*</span>
            </label>
            <select
              id="commune" name="commune"
              value={formData.commune} onChange={handleChange}
              disabled={formData.wilaya_id === 0}
              data-error={!!errors.commune}
              className={`form-input-focus w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground transition-all appearance-none disabled:opacity-50 disabled:cursor-not-allowed ${errors.commune ? "border-destructive" : "border-border"} ${!formData.commune ? "text-muted-foreground/60" : ""}`}
            >
              <option value="" disabled>
                {formData.wilaya_id === 0 ? "يرجى اختيار الولاية أولاً..." : "اختر البلدية..."}
              </option>
              {communesList.map((item, i) => (
                <option key={i} value={item.nom}>
                  {item.nom}
                </option>
              ))}
            </select>
            {stopdeskHint && (
              <p className="mt-1 text-xs text-amber-500 font-medium">
                ⚠️ تم إخفاء البلديات التي لا تحتوي على مكتب توصيل
              </p>
            )}
            {errors.commune && <p className="mt-1 text-xs text-destructive">{errors.commune}</p>}
          </div>

          {/* ──────── Payment Method Toggle ──────── */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">
              طريقة الدفع
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("cod")}
                className={`flex items-center justify-center gap-2 rounded-xl border-2 px-3 py-3 text-sm font-semibold transition-all ${
                  paymentMethod === "cod"
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border bg-background text-muted-foreground hover:border-accent/30"
                }`}
              >
                💵 الدفع عند الاستلام
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("baridimob")}
                className={`relative flex items-center justify-center gap-2 rounded-xl border-2 px-3 py-3 text-sm font-semibold transition-all ${
                  paymentMethod === "baridimob"
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border bg-background text-muted-foreground hover:border-accent/30"
                }`}
              >
                💳 بريدي موب
                <span className="absolute -top-2 left-2 rounded-full bg-cta px-2 py-0.5 text-[10px] font-bold text-white">
                  تسريع التوصيل
                </span>
              </button>
            </div>
          </div>

          {/* ──────── Price Summary ──────── */}
          <div className="mt-6 rounded-xl border border-border/50 bg-muted/50 p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                سعر المنتج ({priceBreakdown.bundleLabel})
              </span>
              <span className="font-semibold text-foreground">
                {formatPrice(priceBreakdown.bundlePrice)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                مصاريف التوصيل ({deliveryType === "domicile" ? "باب الدار" : "مكتب"})
                {selectedWilayaObj && (
                  <span className="mr-1 text-xs text-muted-foreground">
                    ({selectedWilayaObj.duration})
                  </span>
                )}
              </span>
              <span className={`font-semibold ${priceBreakdown.shippingFee === 0 ? "text-cta" : "text-foreground"}`}>
                {priceBreakdown.shippingFee === 0
                  ? "مجاني 🎁"
                  : formData.wilaya_id === 0
                    ? "حسب الولاية"
                    : formatPrice(priceBreakdown.shippingFee)}
              </span>
            </div>
            <div className="border-t border-border/50 pt-2 flex items-center justify-between">
              <span className="text-base font-bold text-foreground">الإجمالي</span>
              <span className="text-xl font-extrabold text-accent">
                {formData.wilaya_id === 0 && priceBreakdown.shippingFee > 0
                  ? formatPrice(priceBreakdown.bundlePrice) + " + التوصيل"
                  : formatPrice(priceBreakdown.totalPrice)}
              </span>
            </div>
          </div>

          {/* Submit */}
          <button
            id="submit-order" type="submit" disabled={isPending}
            className="cta-pulse mt-4 w-full rounded-xl bg-cta py-4 text-base font-bold text-cta-foreground transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:animate-none"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                جاري تسجيل طلبك...
              </span>
            ) : paymentMethod === "baridimob" ? (
              "تأكيد الطلب — الدفع عبر بريدي موب 💳"
            ) : (
              "تأكيد الطلب — الدفع عند الاستلام 🚚"
            )}
          </button>

          <p className="text-center text-xs text-muted-foreground">
            🔒 معلوماتك آمنة — لا نشاركها مع أي طرف ثالث
          </p>
        </form>
      </div>
    </section>
  );
}
