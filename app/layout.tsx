import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Yrsa } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AIAssistant from "./components/AIAssistant";
import PageTransition from "./components/PageTransition";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const yrsa = Yrsa({
  subsets: ["latin"],
  variable: "--font-yrsa",
  weight: ["300", "400", "500", "600", "700"],
  style: ['normal', 'italic'],
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
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${yrsa.variable}`}>
      <body
        className="font-sans antialiased bg-white text-[var(--foreground)]"
      >

        <Navbar />
        <PageTransition>{children}</PageTransition>
        <Footer />
        <AIAssistant />
      </body>
    </html>
  );
}
