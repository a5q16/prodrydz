import { Wilaya } from "./types";
import type { DeliveryType } from "./types";

/**
 * All 58 Algerian Wilayas with delivery fees per type.
 * Fees apply ONLY to Bundle 1 (single piece).
 * Bundles 2 & 3 always get free shipping (0 DA).
 *
 * Pricing tiers:
 * - Alger (16): Domicile 450 DA / Stopdesk 300 DA
 * - Neighboring (Blida 9, Tipaza 42, Boumerdes 35): Domicile 650 DA / Stopdesk 400 DA
 * - All others: Domicile 800 DA / Stopdesk 450 DA
 */

const NEIGHBORING_WILAYAS = [9, 35, 42]; // Blida, Boumerdes, Tipaza

function getFees(id: number): { domicileFee: number; stopdeskFee: number } {
  if (id === 16) return { domicileFee: 450, stopdeskFee: 300 };
  if (NEIGHBORING_WILAYAS.includes(id)) return { domicileFee: 650, stopdeskFee: 400 };
  return { domicileFee: 800, stopdeskFee: 450 };
}

export const wilayas: Wilaya[] = [
  { id: 1, name_ar: "أدرار", name_fr: "Adrar", ...getFees(1) },
  { id: 2, name_ar: "الشلف", name_fr: "Chlef", ...getFees(2) },
  { id: 3, name_ar: "الأغواط", name_fr: "Laghouat", ...getFees(3) },
  { id: 4, name_ar: "أم البواقي", name_fr: "Oum El Bouaghi", ...getFees(4) },
  { id: 5, name_ar: "باتنة", name_fr: "Batna", ...getFees(5) },
  { id: 6, name_ar: "بجاية", name_fr: "Béjaïa", ...getFees(6) },
  { id: 7, name_ar: "بسكرة", name_fr: "Biskra", ...getFees(7) },
  { id: 8, name_ar: "بشار", name_fr: "Béchar", ...getFees(8) },
  { id: 9, name_ar: "البليدة", name_fr: "Blida", ...getFees(9) },
  { id: 10, name_ar: "البويرة", name_fr: "Bouira", ...getFees(10) },
  { id: 11, name_ar: "تمنراست", name_fr: "Tamanrasset", ...getFees(11) },
  { id: 12, name_ar: "تبسة", name_fr: "Tébessa", ...getFees(12) },
  { id: 13, name_ar: "تلمسان", name_fr: "Tlemcen", ...getFees(13) },
  { id: 14, name_ar: "تيارت", name_fr: "Tiaret", ...getFees(14) },
  { id: 15, name_ar: "تيزي وزو", name_fr: "Tizi Ouzou", ...getFees(15) },
  { id: 16, name_ar: "الجزائر", name_fr: "Alger", ...getFees(16) },
  { id: 17, name_ar: "الجلفة", name_fr: "Djelfa", ...getFees(17) },
  { id: 18, name_ar: "جيجل", name_fr: "Jijel", ...getFees(18) },
  { id: 19, name_ar: "سطيف", name_fr: "Sétif", ...getFees(19) },
  { id: 20, name_ar: "سعيدة", name_fr: "Saïda", ...getFees(20) },
  { id: 21, name_ar: "سكيكدة", name_fr: "Skikda", ...getFees(21) },
  { id: 22, name_ar: "سيدي بلعباس", name_fr: "Sidi Bel Abbès", ...getFees(22) },
  { id: 23, name_ar: "عنابة", name_fr: "Annaba", ...getFees(23) },
  { id: 24, name_ar: "قالمة", name_fr: "Guelma", ...getFees(24) },
  { id: 25, name_ar: "قسنطينة", name_fr: "Constantine", ...getFees(25) },
  { id: 26, name_ar: "المدية", name_fr: "Médéa", ...getFees(26) },
  { id: 27, name_ar: "مستغانم", name_fr: "Mostaganem", ...getFees(27) },
  { id: 28, name_ar: "المسيلة", name_fr: "M'Sila", ...getFees(28) },
  { id: 29, name_ar: "معسكر", name_fr: "Mascara", ...getFees(29) },
  { id: 30, name_ar: "ورقلة", name_fr: "Ouargla", ...getFees(30) },
  { id: 31, name_ar: "وهران", name_fr: "Oran", ...getFees(31) },
  { id: 32, name_ar: "البيض", name_fr: "El Bayadh", ...getFees(32) },
  { id: 33, name_ar: "إليزي", name_fr: "Illizi", ...getFees(33) },
  { id: 34, name_ar: "برج بوعريريج", name_fr: "Bordj Bou Arreridj", ...getFees(34) },
  { id: 35, name_ar: "بومرداس", name_fr: "Boumerdès", ...getFees(35) },
  { id: 36, name_ar: "الطارف", name_fr: "El Tarf", ...getFees(36) },
  { id: 37, name_ar: "تندوف", name_fr: "Tindouf", ...getFees(37) },
  { id: 38, name_ar: "تيسمسيلت", name_fr: "Tissemsilt", ...getFees(38) },
  { id: 39, name_ar: "الوادي", name_fr: "El Oued", ...getFees(39) },
  { id: 40, name_ar: "خنشلة", name_fr: "Khenchela", ...getFees(40) },
  { id: 41, name_ar: "سوق أهراس", name_fr: "Souk Ahras", ...getFees(41) },
  { id: 42, name_ar: "تيبازة", name_fr: "Tipaza", ...getFees(42) },
  { id: 43, name_ar: "ميلة", name_fr: "Mila", ...getFees(43) },
  { id: 44, name_ar: "عين الدفلى", name_fr: "Aïn Defla", ...getFees(44) },
  { id: 45, name_ar: "النعامة", name_fr: "Naâma", ...getFees(45) },
  { id: 46, name_ar: "عين تموشنت", name_fr: "Aïn Témouchent", ...getFees(46) },
  { id: 47, name_ar: "غرداية", name_fr: "Ghardaïa", ...getFees(47) },
  { id: 48, name_ar: "غليزان", name_fr: "Relizane", ...getFees(48) },
  { id: 49, name_ar: "تيميمون", name_fr: "Timimoun", ...getFees(49) },
  { id: 50, name_ar: "برج باجي مختار", name_fr: "Bordj Badji Mokhtar", ...getFees(50) },
  { id: 51, name_ar: "أولاد جلال", name_fr: "Ouled Djellal", ...getFees(51) },
  { id: 52, name_ar: "بني عباس", name_fr: "Béni Abbès", ...getFees(52) },
  { id: 53, name_ar: "عين صالح", name_fr: "In Salah", ...getFees(53) },
  { id: 54, name_ar: "عين قزام", name_fr: "In Guezzam", ...getFees(54) },
  { id: 55, name_ar: "تقرت", name_fr: "Touggourt", ...getFees(55) },
  { id: 56, name_ar: "جانت", name_fr: "Djanet", ...getFees(56) },
  { id: 57, name_ar: "المغير", name_fr: "El M'Ghair", ...getFees(57) },
  { id: 58, name_ar: "المنيعة", name_fr: "El Meniaa", ...getFees(58) },
];

export function getWilayaById(id: number): Wilaya | undefined {
  return wilayas.find((w) => w.id === id);
}

export function getDeliveryFee(wilayaId: number, deliveryType: DeliveryType): number {
  const wilaya = getWilayaById(wilayaId);
  if (!wilaya) return deliveryType === "domicile" ? 800 : 450;
  return deliveryType === "domicile" ? wilaya.domicileFee : wilaya.stopdeskFee;
}
