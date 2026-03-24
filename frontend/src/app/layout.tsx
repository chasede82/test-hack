import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  title: "MeetSync - AI 회의 협업 도구",
  description:
    "AI 기반 회의록 생성, 실시간 채팅, 할 일 관리를 하나로. MeetSync와 함께 더 효율적인 회의를 경험하세요.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={notoSansKR.variable}>
      <body className={`${notoSansKR.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
