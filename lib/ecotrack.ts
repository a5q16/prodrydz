import type { Order } from "./types";

const API_BASE = "https://packers.ecotrack.dz/api/v1";
const API_TOKEN = process.env.ECOTRACK_API_TOKEN!;
const USER_GUID = process.env.ECOTRACK_USER_GUID || "";

interface EcoTrackResponse {
  success: boolean;
  tracking_code?: string;
  error?: string;
  raw?: Record<string, unknown>;
}

/**
 * Create a parcel on EcoTrack (Packers Delivery).
 * Maps order data to the EcoTrack API standard schema.
 */
export async function createParcel(order: Order): Promise<EcoTrackResponse> {
  const payload: Record<string, unknown> = {
    api_token: API_TOKEN,
    nom_client: order.full_name,
    telephone: order.phone,
    telephone_2: "",
    adresse: `${order.commune}, ${order.wilaya_name}`,
    commune: order.commune,
    wilaya: order.wilaya_id,
    wilaya_id: order.wilaya_id,
    montant: order.total_price,
    remarque: `Commande ${order.bundle_type} - Paiement: ${order.payment_method}${order.payment_method === "baridimob" ? " (الدفع عبر بريدي موب — لا تحصيل)" : ""}`,
    type_livraison: order.delivery_type === "stopdesk" ? 2 : 1,
    stop_desk: order.delivery_type === "stopdesk" ? 1 : 0,
    produit: "ProDry 1400GSM Drying Towel",
    poids: 1,
    can_open: 1,
    stock: 0,
    reference: `PRODRY-${order.order_number}`,
  };

  if (USER_GUID) {
    payload.user_guid = USER_GUID;
  }

  try {
    const res = await fetch(`${API_BASE}/create/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    const resText = await res.text();
    let data: Record<string, unknown> = {};
    try {
      data = JSON.parse(resText);
    } catch {
      return {
        success: false,
        error: `HTTP ${res.status} non-JSON response: ${resText}`,
      };
    }

    if (data.success || data.tracking || (data.data as Record<string, unknown>)?.tracking_code || data.code === 200) {
      const trackingCode =
        (data.tracking as string) ||
        ((data.data as Record<string, unknown>)?.tracking_code as string) ||
        null;

      return {
        success: true,
        tracking_code: trackingCode || undefined,
        raw: data,
      };
    }

    // Return the ENTIRE raw JSON error object un-truncated
    const fullJsonError = JSON.stringify(data, null, 2);

    return {
      success: false,
      error: fullJsonError,
      raw: data,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "فشل الاتصال بشبكة EcoTrack",
    };
  }
}
