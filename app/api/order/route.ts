import { NextResponse } from "next/server";
import { orderFormSchema } from "@/lib/types";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendOrderNotification } from "@/lib/telegram";
import type { Order } from "@/lib/types";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const result = orderFormSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          message: "بيانات غير صالحة",
          errors: z.flattenError(result.error).fieldErrors,
        },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Insert order into Supabase
    const { data: order, error: dbError } = await supabase
      .from("orders")
      .insert({
        full_name: body.full_name,
        phone: body.phone,
        wilaya_id: body.wilaya_id,
        wilaya_name: body.wilaya_name || "",
        commune: body.commune,
        address: body.address,
        bundle_type: body.bundle_type,
        delivery_type: body.delivery_type || "domicile",
        payment_method: body.payment_method || "cod",
        total_price: body.total_price,
        shipping_fee: body.shipping_fee,
        status: "pending",
      })
      .select("*")
      .single();

    if (dbError || !order) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json(
        { message: "حدث خطأ أثناء حفظ الطلب" },
        { status: 500 }
      );
    }

    // Explicitly await Telegram notification to prevent Vercel serverless lambda execution freeze
    try {
      const messageId = await sendOrderNotification(order as Order);
      if (messageId) {
        await supabase
          .from("orders")
          .update({ telegram_message_id: messageId })
          .eq("id", order.id);
      }
    } catch (err) {
      console.error("Telegram notification failed:", err);
    }

    return NextResponse.json({
      success: true,
      message: "تم تسجيل طلبك بنجاح",
      order_number: order.order_number,
    });
  } catch (err) {
    console.error("Order API error:", err);
    return NextResponse.json(
      { message: "حدث خطأ في الخادم" },
      { status: 500 }
    );
  }
}
