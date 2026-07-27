import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { answerCallbackQuery, editTelegramMessage } from "@/lib/telegram";
import { createParcel } from "@/lib/ecotrack";
import type { Order } from "@/lib/types";

/**
 * Telegram Webhook Handler
 * Processes inline keyboard callback queries from admin Telegram chat.
 *
 * Callback data format:
 * - confirm_{order_id}  → Confirm order & send to EcoTrack
 * - cancel_{order_id}   → Cancel order
 * - postpone_{order_id} → Acknowledge postponement
 */
export async function POST(request: Request) {
  try {
    const update = await request.json();

    // Only handle callback queries
    const callbackQuery = update.callback_query;
    if (!callbackQuery) {
      return NextResponse.json({ ok: true });
    }

    const callbackId = callbackQuery.id;
    const data = callbackQuery.data as string;
    const messageId = callbackQuery.message?.message_id;

    if (!data || !messageId) {
      await answerCallbackQuery(callbackId, "بيانات غير صالحة");
      return NextResponse.json({ ok: true });
    }

    const [action, ...idParts] = data.split("_");
    const orderId = idParts.join("_");

    if (!orderId) {
      await answerCallbackQuery(callbackId, "معرف الطلب مفقود");
      return NextResponse.json({ ok: true });
    }

    const supabase = getSupabaseAdmin();

    // Fetch the order
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (fetchError || !order) {
      await answerCallbackQuery(callbackId, "❌ الطلب غير موجود");
      return NextResponse.json({ ok: true });
    }

    const typedOrder = order as Order;

    switch (action) {
      case "confirm": {
        await answerCallbackQuery(callbackId, "⏳ جاري الإرسال لشركة التوصيل...");

        // Call EcoTrack API
        const ecoResult = await createParcel(typedOrder);

        if (ecoResult.success) {
          // Update order in Supabase
          await supabase
            .from("orders")
            .update({
              status: "shipped",
              tracking_code: ecoResult.tracking_code,
              ecotrack_response: ecoResult.raw || null,
            })
            .eq("id", orderId);

          // Edit Telegram message
          const deliveryLabel = typedOrder.delivery_type === "domicile" ? "🏠 باب الدار" : "🏢 مكتب";
          await editTelegramMessage(
            messageId,
            [
              `✅ *تم تأكيد الطلب # ${typedOrder.order_number}*`,
              ``,
              `👤 ${typedOrder.full_name}`,
              `📞 ${typedOrder.phone}`,
              `📍 ${typedOrder.wilaya_name} - ${typedOrder.commune}`,
              `🚚 ${deliveryLabel}`,
              `💰 ${typedOrder.total_price} دج`,
              ``,
              `📦 رقم التتبع: \`${ecoResult.tracking_code || "N/A"}\``,
              `✅ تم الإرسال لشركة التوصيل بنجاح`,
            ].join("\n")
          );
        } else {
          // EcoTrack failed
          await editTelegramMessage(
            messageId,
            [
              `⚠️ *خطأ في الطلب # ${typedOrder.order_number}*`,
              ``,
              `👤 ${typedOrder.full_name} | 📞 ${typedOrder.phone}`,
              `📍 ${typedOrder.wilaya_name} - ${typedOrder.commune}`,
              `💰 ${typedOrder.total_price} دج`,
              ``,
              `❌ حدث خطأ أثناء الاتصال بشركة التوصيل:`,
              `\`${ecoResult.error}\``,
              ``,
              `يرجى إعادة المحاولة يدوياً.`,
            ].join("\n")
          );
        }
        break;
      }

      case "cancel": {
        await supabase
          .from("orders")
          .update({ status: "cancelled" })
          .eq("id", orderId);

        await editTelegramMessage(
          messageId,
          [
            `❌ *تم إلغاء الطلب # ${typedOrder.order_number}*`,
            ``,
            `👤 ${typedOrder.full_name}`,
            `📞 ${typedOrder.phone}`,
            `📍 ${typedOrder.wilaya_name}`,
            `💰 ${typedOrder.total_price} دج`,
          ].join("\n")
        );

        await answerCallbackQuery(callbackId, "تم إلغاء الطلب ❌");
        break;
      }

      case "postpone": {
        await answerCallbackQuery(callbackId, "⏳ تم التأجيل — لم يتغير حالة الطلب");
        break;
      }

      default: {
        await answerCallbackQuery(callbackId, "إجراء غير معروف");
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Telegram webhook error:", err);
    return NextResponse.json({ ok: true });
  }
}
