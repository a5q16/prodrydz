import type { Order } from "./types";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID!;
const API = `https://api.telegram.org/bot${BOT_TOKEN}`;

/**
 * Send order notification to Telegram admin with inline action buttons.
 * Returns the message_id for later editing.
 */
export async function sendOrderNotification(order: Order): Promise<number | null> {
  const deliveryLabel = order.delivery_type === "domicile" ? "🏠 باب الدار" : "🏢 مكتب التوصيل";
  const paymentLabel = order.payment_method === "cod" ? "💵 الدفع عند الاستلام" : "💳 بريدي موب";

  const bundleLabels: Record<string, string> = {
    "1_piece": "قطعة واحدة",
    "2_pieces": "قطعتين (2)",
    "3_pieces": "3 قطع",
  };

  const text = [
    `📦 *طلب جديد # ${order.order_number}*`,
    ``,
    `👤 الاسم: ${order.full_name}`,
    `📞 الهاتف: ${order.phone}`,
    `📍 العنوان: ${order.wilaya_name} - ${order.commune}`,
    `🚚 التوصيل: ${deliveryLabel}`,
    `🛒 العرض: ${bundleLabels[order.bundle_type] || order.bundle_type}`,
    `💰 الإجمالي: ${order.total_price} دج (الشحن: ${order.shipping_fee} دج)`,
    `💳 الدفع: ${paymentLabel}`,
  ].join("\n");

  const inline_keyboard = [
    [
      { text: "✅ تأكيد وإرسال للتوصيل", callback_data: `confirm_${order.id}` },
    ],
    [
      { text: "❌ إلغاء الطلب", callback_data: `cancel_${order.id}` },
      { text: "⏳ تأجيل", callback_data: `postpone_${order.id}` },
    ],
  ];

  try {
    const res = await fetch(`${API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: "Markdown",
        disable_notification: false,
        reply_markup: { inline_keyboard },
      }),
    });

    const data = await res.json();
    if (data.ok) {
      return data.result.message_id;
    }
    console.error("Telegram send error:", data);
    return null;
  } catch (err) {
    console.error("Telegram send failed:", err);
    return null;
  }
}

/**
 * Edit an existing Telegram message (after admin action).
 */
export async function editTelegramMessage(messageId: number, text: string) {
  try {
    await fetch(`${API}/editMessageText`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        message_id: messageId,
        text,
        parse_mode: "Markdown",
      }),
    });
  } catch (err) {
    console.error("Telegram edit failed:", err);
  }
}

/**
 * Answer a callback query (dismiss loading spinner on inline button).
 */
export async function answerCallbackQuery(callbackQueryId: string, text?: string) {
  try {
    await fetch(`${API}/answerCallbackQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text: text || "",
      }),
    });
  } catch (err) {
    console.error("Telegram answerCallback failed:", err);
  }
}
