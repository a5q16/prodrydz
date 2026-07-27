import communesRaw from "./data/communes.json";
import tariffsRaw from "./data/tariffs.json";

export interface CommuneItem {
  wilaya_id: number;
  nom: string;
  has_stop_desk?: number | boolean;
}

export interface TariffItem {
  wilaya_id: number;
  tarif: number | string;
  tarif_stopdesk: number | string;
}

const communesData = communesRaw as CommuneItem[];
const tariffsData = tariffsRaw as TariffItem[];

/**
 * Returns communes for a specific Wilaya ID, with optional stopdesk filtering.
 */
export function getCommunesByWilaya(wilayaId: number, onlyStopDesk: boolean = false): CommuneItem[] {
  if (!wilayaId) return [];

  return communesData.filter((item) => {
    if (item.wilaya_id !== wilayaId) return false;
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

  const tariff = tariffsData.find((t) => Number(t.wilaya_id) === Number(wilayaId));
  if (!tariff) {
    return deliveryType === "domicile" ? 800 : 450; // Fallback
  }

  const fee = deliveryType === "domicile" ? tariff.tarif : tariff.tarif_stopdesk;
  return parseInt(String(fee), 10) || (deliveryType === "domicile" ? 800 : 450);
}
