import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Bodoni_Moda } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AIAssistant from "./components/AIAssistant";
import PageTransition from "./components/PageTransition";
import CustomCursor from "./components/CustomCursor";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const didone = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-didone",
});

export const metadata: Metadata = {
  title: "Apex Freight | AI-Powered Logistics Solutions",
  description:
    "Precision-engineered brokerage connecting shippers and carriers through proprietary AI and real-time data.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${didone.variable} font-sans antialiased bg-white text-[var(--foreground)] cursor-none`}
      >
        <CustomCursor />
        <Navbar />
        <PageTransition>{children}</PageTransition>
        <Footer />
        <AIAssistant />
      </body>
    </html>
  );
}
