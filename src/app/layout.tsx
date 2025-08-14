import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import HomeButton from "@/components/HomeButton";
import ViewportHeightSetter from "@/components/ViewportHeightSetter";

export const metadata: Metadata = {
  title: {
    default: "MM-Info",
    template: "%s | MM-Info",
  },
  description: "콘서트 세트리스트 공유 플랫폼",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    images: [
      {
        url: "/favicon.png",
      },
    ],
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
        <ViewportHeightSetter />
        <div className="container">
          <div className="top-bar">
            <HomeButton />
            <NavBar />
          </div>
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
