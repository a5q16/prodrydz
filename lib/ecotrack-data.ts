import communesRaw from "./data/communes.json";
import tariffsRaw from "./data/tariffs.json";

export interface CommuneItem {
  wilaya_id: number | string;
  nom: string;
  code_postal?: string | number;
  has_stop_desk?: number | boolean;
}

export interface TariffItem {
  wilaya_id: number | string;
  tarif: number | string;
  tarif_stopdesk: number | string;
}

// Convert communesRaw safely whether it's an array or an object/dictionary
const communesList: CommuneItem[] = Array.isArray(communesRaw)
  ? (communesRaw as unknown as CommuneItem[])
  : (Object.values(communesRaw) as unknown as CommuneItem[]);

// Convert tariffsRaw safely whether it's an array or an object/dictionary
const tariffsList: TariffItem[] = Array.isArray(tariffsRaw)
  ? (tariffsRaw as unknown as TariffItem[])
  : (Object.values(tariffsRaw) as unknown as TariffItem[]);

/**
 * Returns communes for a specific Wilaya ID, with optional stopdesk filtering.
 */
export function getCommunesByWilaya(wilayaId: number, onlyStopDesk: boolean = false): CommuneItem[] {
  if (!wilayaId) return [];

  return communesList.filter((item) => {
    if (Number(item.wilaya_id) !== Number(wilayaId)) return false;
    if (!onlyStopDesk) return true;
    return item.has_stop_desk === 1 || item.has_stop_desk === true;
  });
}

/**
 * Calculate dynamic shipping fee from EcoTrack tariffs dataset.
 */
export function getShippingFee(
  wilayaId: number,
  deliveryType: "domicile" | "stopdesk",
  bundleType: string
): number {
  if (bundleType === "2_pieces" || bundleType === "3_pieces") {
    return 0; // Free shipping for bundles 2 & 3
  }

  const tariff = tariffsList.find((t) => Number(t.wilaya_id) === Number(wilayaId));
  if (!tariff) {
    return deliveryType === "domicile" ? 800 : 450; // Fallback
  }

  const fee = deliveryType === "domicile" ? tariff.tarif : tariff.tarif_stopdesk;
  return parseInt(String(fee), 10) || (deliveryType === "domicile" ? 800 : 450);
}
