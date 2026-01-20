import type { Metadata } from "next";
import { Nanum_Gothic } from "next/font/google";
import { AuthProvider } from "@/presentation/contexts/AuthContext";
import { MainLayout } from "@/presentation/components/layout/MainLayout";
import "./globals.css";

const nanumGothic = Nanum_Gothic({
  weight: ["400", "700"],
  variable: "--font-nanum-gothic",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  title: "사단법인 토브협회 - 비영리 재정 투명성",
  description: "당신의 'Mission'과 'Fund'를 연결하는 Tov 입니다",
  keywords:
    "토브협회, 사단법인 토브협회, 토브, 비영리, 비영리단체, 재정투명성, 교회재정, 종교인소득",
  openGraph: {
    title: "사단법인 토브협회 - 비영리 재정 투명성",
    description: "비영리단체를 위한 재정 투명성 정보 제공",
    url: "https://tov.or.kr",
    siteName: "사단법인 토브협회",
    locale: "ko_KR",
    type: "website",
  },
  alternates: {
    canonical: "https://tov.or.kr",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["Organization", "NGO"],
              name: "사단법인 토브협회",
              alternateName: [
                "토브협회",
                "사단법인 토브협회",
                "사단법인토브협회",
                "토브",
                "TOV",
                "Tov",
                "TOV협회",
                "Tov Association",
                "교회재정건강성운동",
                "CFAN",
                "(사)토브협회",
              ],
              previousOrganizationName: "교회재정건강성운동",
              url: "https://tov.or.kr",
              logo: "https://tov.or.kr/logo.png",
              description:
                "비영리단체의 재정 투명성과 건강한 재정운영을 지원하는 사단법인",
              address: {
                "@type": "PostalAddress",
                addressCountry: "KR",
                addressRegion: "서울",
                addressLocality: "종로구",
                streetAddress: "삼일대로 428, 500-42호",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+82-2-6951-1391",
                contactType: "고객지원",
              },
            }),
          }}
        />
      </head>
      <body className={`${nanumGothic.variable} antialiased`}>
        <AuthProvider>
          <MainLayout>{children}</MainLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
