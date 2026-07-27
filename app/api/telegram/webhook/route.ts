import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { answerCallbackQuery, editTelegramMessage } from "@/lib/telegram";
import { createParcel } from "@/lib/ecotrack";
import type { Order } from "@/lib/types";

// Helper to check if string is valid UUID
function isValidUUID(uuid: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[0-89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
}

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
    const rawId = idParts.join("_");

    if (!rawId) {
      await answerCallbackQuery(callbackId, "معرف الطلب مفقود");
      return NextResponse.json({ ok: true });
    }

    // Acknowledge Callback Query immediately to stop button loading spinner
    await answerCallbackQuery(callbackId, "جاري المعالجة...");

    const supabase = getSupabaseAdmin();

    // Safe DB Lookup (supports both UUID and SERIAL order_number without Postgres casting error)
    let query = supabase.from("orders").select("*");
    if (isValidUUID(rawId)) {
      query = query.eq("id", rawId);
    } else if (!isNaN(Number(rawId))) {
      query = query.eq("order_number", parseInt(rawId, 10));
    } else {
      query = query.eq("id", rawId);
    }

    const { data: order, error: fetchError } = await query.maybeSingle();

    if (fetchError || !order) {
      await editTelegramMessage(
        messageId,
        `❌ *عفوًا، لم يتم العثور على الطلب في قاعدة البيانات (${rawId})*`
      );
      return NextResponse.json({ ok: true });
    }

    const typedOrder = order as Order;

    switch (action) {
      case "confirm": {
        try {
          const ecoResult = await createParcel(typedOrder);

          if (ecoResult.success) {
            await supabase
              .from("orders")
              .update({
                status: "shipped",
                tracking_code: ecoResult.tracking_code || null,
                ecotrack_response: ecoResult.raw || null,
              })
              .eq("id", typedOrder.id);

            const deliveryLabel = typedOrder.delivery_type === "domicile" ? "🏠 باب الدار" : "🏢 مكتب";
            await editTelegramMessage(
              messageId,
              [
                `✅ *تم تأكيد الطلب وإصدار البوليصة!*`,
                ``,
                `📦 *طلب رقم # ${typedOrder.order_number}*`,
                `👤 الاسم: ${typedOrder.full_name}`,
                `📞 الهاتف: ${typedOrder.phone}`,
                `📍 العنوان: ${typedOrder.wilaya_name} - ${typedOrder.commune}`,
                `🚚 التوصيل: ${deliveryLabel}`,
                `💰 الإجمالي: ${typedOrder.total_price} دج`,
                ``,
                `🔑 *رقم التتبع:* \`${ecoResult.tracking_code || "تم الإنشاء بدون رقم تتبع"}\``,
              ].join("\n")
            );
          } else {
            await editTelegramMessage(
              messageId,
              [
                `⚠️ *فشل إرسال الطلب لـ Packers!*`,
                ``,
                `📦 *طلب رقم # ${typedOrder.order_number}*`,
                `👤 الاسم: ${typedOrder.full_name}`,
                `📞 الهاتف: ${typedOrder.phone}`,
                ``,
                `❌ *السبب:* \`${ecoResult.error || "خطأ غير معروف في الربط"}\``,
                ``,
                `يرجى المراجعة والتحقق من البيانات.`,
              ].join("\n")
            );
          }
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : "خطأ غير متوقع";
          await editTelegramMessage(
            messageId,
            `⚠️ *فشل إرسال الطلب لـ Packers! السبب:* \`${errorMsg}\``
          );
        }
        break;
      }

      case "cancel": {
        await supabase
          .from("orders")
          .update({ status: "cancelled" })
          .eq("id", typedOrder.id);

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
        break;
      }

      case "postpone": {
        await editTelegramMessage(
          messageId,
          [
            `⏳ *تم تأجيل الطلب # ${typedOrder.order_number}*`,
            ``,
            `👤 ${typedOrder.full_name}`,
            `📞 ${typedOrder.phone}`,
            `📍 ${typedOrder.wilaya_name}`,
            `💰 ${typedOrder.total_price} دج`,
          ].join("\n")
        );
        break;
      }

      default: {
        break;
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Telegram webhook error:", err);
    return NextResponse.json({ ok: true });
  }
}
