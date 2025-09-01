import type { Metadata } from "next";
import { Nanum_Gothic } from "next/font/google";
import { AuthProvider } from "@/presentation/contexts/AuthContext";
import { MainLayout } from "@/presentation/components/layout/MainLayout";
import "./globals.css";

const nanumGothic = Nanum_Gothic({
  weight: ["400", "700", "800"],
  variable: "--font-nanum-gothic",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "토브(TOV) - 비영리 재정 투명성",
  description: "사단법인 토브협회 - 종교인 및 비영리단체를 위한 재정 투명성 정보 제공",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${nanumGothic.variable} antialiased`}
      >
        <AuthProvider>
          <MainLayout>
            {children}
          </MainLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
