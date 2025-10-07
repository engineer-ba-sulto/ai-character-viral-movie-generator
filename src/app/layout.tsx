import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "AI Character Animation",
  description:
    "AI技術を活用したキャラクターアニメーション作成ツール。独自のキャラクターを生成し、動的なアニメーションを作成できます。",
  keywords: ["AI", "アニメーション", "キャラクター", "生成", "動画作成"],
  authors: [{ name: "AI Character Animation Team" }],
  openGraph: {
    title: "AI Character Animation",
    description: "AI技術を活用したキャラクターアニメーション作成ツール",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Character Animation",
    description: "AI技術を活用したキャラクターアニメーション作成ツール",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${notoSansJP.variable} antialiased scroll-smooth`}>
        {children}
      </body>
    </html>
  );
}
