import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import ChatPanel from "@/components/ChatPanel";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ElectronicsEcom | Premium AI-Powered Electronics",
  description: "Find your perfect gadgets with our AI-powered shopping assistant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex h-screen overflow-hidden`}
      >
        {/* Left Side: Main Application Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto relative h-screen">
          <Header />
          <main className="flex-grow flex flex-col">
            {children}
          </main>
          <Footer />
        </div>

        {/* Right Side: Fixed Chat Panel */}
        <aside className="w-[450px] shrink-0 h-screen hidden lg:block overflow-hidden relative z-50">
          <ChatPanel />
        </aside>

        {/* Floating Chat Widget on smaller screens (could be added back later if desired) - currently hidden for simplicity, or we can use the same panel in a drawer. Let's keep it simple for now. */}
      </body>
    </html>
  );
}
