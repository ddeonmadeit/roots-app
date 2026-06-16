import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import AppFrame from "@/components/ui/AppFrame";

const braunLinear = localFont({
  src: [
    { path: "../../public/fonts/BraunLinear-Thin.woff2",    weight: "100", style: "normal" },
    { path: "../../public/fonts/BraunLinear-Light.woff2",   weight: "300", style: "normal" },
    { path: "../../public/fonts/BraunLinear-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/BraunLinear-Medium.woff2",  weight: "500", style: "normal" },
    { path: "../../public/fonts/BraunLinear-Bold.woff2",    weight: "700", style: "normal" },
  ],
  variable: "--font-braun",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Roots — Learn Kinyarwanda",
  description:
    "Heritage language learning for diaspora families. Kinyarwanda-first.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Let content extend into the notch / home-bar area; we pad with
  // env(safe-area-inset-*) so nothing is obscured.
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${braunLinear.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="h-full antialiased">
        {/* Apply saved theme before paint to avoid a flash */}
        <Script id="theme-init" strategy="beforeInteractive">
          {`try{if(localStorage.getItem('roots-theme')==='dark'){document.documentElement.classList.add('dark')}}catch(e){}`}
        </Script>
        <AppFrame>{children}</AppFrame>
      </body>
    </html>
  );
}
