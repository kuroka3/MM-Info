import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "세트리스트",
  description: "콘서트 세트리스트 공유 플랫폼",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <div className="container">
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
