import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as HotToaster } from "react-hot-toast";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "씨엠웨이 - 건강한 삶의 동반자",
  description: "프리미엄 건강식품 전문 기업 씨엠웨이입니다. 클로로필a 기반 건강기능식품을 통해 고객의 건강한 삶을 지원합니다.",
  keywords: "씨엠웨이, CMWay, 건강식품, 클로로필a, 항암, 항산화, 면역력, 세포보호, 건강기능식품",
  authors: [{ name: "CMWay" }],
  openGraph: {
    title: "씨엠웨이 - 건강한 삶의 동반자",
    description: "프리미엄 건강식품 전문 기업",
    url: "https://cmway.co.kr",
    siteName: "씨엠웨이",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
        <HotToaster 
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#10b981',
              color: '#fff',
              padding: '16px',
              borderRadius: '8px',
            },
            success: {
              style: {
                background: '#10b981',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
