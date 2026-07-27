import { NextResponse } from "next/server";

/**
 * One-time endpoint to register the Telegram webhook.
 * Visit: /api/telegram/setup
 *
 * Sets up the webhook URL with Telegram Bot API,
 * configured to receive callback_query updates.
 */
export async function GET() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!token || !siteUrl) {
    return NextResponse.json(
      { error: "Missing TELEGRAM_BOT_TOKEN or NEXT_PUBLIC_SITE_URL" },
      { status: 500 }
    );
  }

  const webhookUrl = `${siteUrl}/api/telegram/webhook`;

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/setWebhook`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: webhookUrl,
          allowed_updates: ["callback_query"],
          drop_pending_updates: true,
        }),
      }
    );

    const data = await res.json();

    return NextResponse.json({
      success: data.ok,
      webhook_url: webhookUrl,
      telegram_response: data,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
