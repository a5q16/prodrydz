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

    const data = await res.json();

    if (data.success || data.tracking || data.data?.tracking_code) {
      return {
        success: true,
        tracking_code: data.tracking || data.data?.tracking_code || null,
        raw: data,
      };
    }

    return {
      success: false,
      error: data.message || data.error || "Unknown EcoTrack error",
      raw: data,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Network error connecting to EcoTrack",
    };
  }
}
