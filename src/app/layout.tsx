import type { Metadata } from "next";
import { StrictMode } from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import "./styles/App.css";
import "./styles/global.css";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { Toaster } from "sonner";
import "overlayscrollbars/overlayscrollbars.css";
import OverlayScrollbar from "@/app/components/ui/OverlayScrollbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Typing Flow",
  description: "A typing practice platform with Supabase integration",
  appleWebApp: {
    title: "TypingFlow",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon0.svg", type: "image/svg+xml" },
      { url: "/icon1.png", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StrictMode>
      <html lang="zh-TW">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning
        >
          <div id="root">
            <OverlayScrollbar>
              <div className="App">
                <AuthProvider>
                  <Nav />
                  <div className="main-content">
                    {children}
                  </div>
                  <Footer />
                </AuthProvider>
              </div>
            </OverlayScrollbar>
          </div>
          <Toaster
            position="top-center"
            richColors
            closeButton
            duration={3000}
          />
        </body>
      </html>
    </StrictMode>
  );
}
