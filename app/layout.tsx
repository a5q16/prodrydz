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
      <head>
        <meta name="facebook-domain-verification" content="gwcqzdqjy5f90gxktv5y9ljeqx7wzy" />
        <script
  dangerouslySetInnerHTML={{
    __html: `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '1709205463738570');
      fbq('track', 'PageView');
    `,
  }}
/>
      </head>
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
