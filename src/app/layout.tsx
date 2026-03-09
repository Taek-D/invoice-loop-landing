import type { Metadata } from "next";
import { IBM_Plex_Mono, Noto_Sans_KR } from "next/font/google";
import { Suspense } from "react";

import { PageViewTracker } from "@/components/analytics/page-view-tracker";
import { AppPostHogProvider } from "@/components/analytics/posthog-provider";
import "./globals.css";

const bodyFont = Noto_Sans_KR({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const monoFont = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "청구루프 | 외주 크리에이티브 프리랜서를 위한 정산 검증 베타",
  description:
    "디자이너와 영상편집자를 위한 견적, 청구, 입금 관리 도구 청구루프의 검증 MVP 랜딩 페이지입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${bodyFont.variable} ${monoFont.variable} antialiased`}>
        <AppPostHogProvider>
          <Suspense fallback={null}>
            <PageViewTracker />
          </Suspense>
          {children}
        </AppPostHogProvider>
      </body>
    </html>
  );
}
