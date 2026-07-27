import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ProDry DZ — منشفة التجفيف الاحترافية 1400 GSM",
  description:
    "منشفة تجفيف السيارات الاحترافية 1400 GSM بتقنية Twisted Loop. جفاف تام من مسحة واحدة بدون خيوط أو خدوش. توصيل لـ 58 ولاية — الدفع عند الاستلام.",
  keywords: [
    "منشفة تجفيف",
    "ProDry DZ",
    "تجفيف السيارات",
    "1400 GSM",
    "Twisted Loop",
    "فوطة مايكروفايبر",
    "الجزائر",
    "الدفع عند الاستلام",
  ],
  openGraph: {
    title: "ProDry DZ — منشفة التجفيف الاحترافية 1400 GSM",
    description:
      "جفاف تام من مسحة واحدة بدون خيوط أو خدوش. توصيل لـ 58 ولاية — الدفع عند الاستلام.",
    url: "https://myonlinemail.cfd",
    siteName: "ProDry DZ",
    locale: "ar_DZ",
    type: "website",
  },
  metadataBase: new URL("https://myonlinemail.cfd"),
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} antialiased`}>
      <body className="min-h-dvh bg-background text-foreground font-sans">
        {children}
        <Toaster
          position="top-center"
          richColors
          closeButton
          toastOptions={{
            style: {
              direction: "rtl",
              fontFamily: "var(--font-tajawal)",
            },
          }}
        />
      </body>
    </html>
  );
}
