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
 * Maps order data to the EcoTrack API format.
 */
export async function createParcel(order: Order): Promise<EcoTrackResponse> {
  const payload: Record<string, unknown> = {
    api_token: API_TOKEN,
    nom_client: order.full_name,
    telephone: order.phone,
    adresse: order.address,
    wilaya: order.wilaya_name,
    wilaya_id: order.wilaya_id,
    commune: order.commune,
    montant: order.total_price,
    produit: "ProDry 1400GSM Drying Towel",
    poids: 1,
    stop_desk: order.delivery_type === "stopdesk" ? 1 : 0,
    can_open: 1,
    stock: 0,
    reference: `PRODRY-${order.order_number}`,
    remarque: order.payment_method === "baridimob" ? "الدفع عبر بريدي موب — لا تحصيل" : "",
  };

  // Add user_guid only if provided
  if (USER_GUID) {
    payload.user_guid = USER_GUID;
  }

  try {
    const res = await fetch(`${API_BASE}/create/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
        error: `استجابة غير صالحة من EcoTrack (HTTP ${res.status}): ${resText.slice(0, 150)}`,
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

    const errorMsg =
      (data.message as string) ||
      (data.error as string) ||
      (typeof data.data === "string" ? data.data : null) ||
      `رمز الاستجابة: ${data.code || res.status}`;

    return {
      success: false,
      error: errorMsg,
      raw: data,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "فشل الاتصال بشبكة EcoTrack",
    };
  }
}
