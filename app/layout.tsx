import type { Metadata } from "next";
import { StrictMode } from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import "./styles/App.css";
import './styles/index.css';
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import { AuthProvider } from "../lib/contexts/AuthContext";

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
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div className="App">
            <AuthProvider>
              <Nav />
              <div className="main-content">{children}</div>
              <Footer />
            </AuthProvider>
          </div>
        </body>
      </html>
    </StrictMode>
  );
}
