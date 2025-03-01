import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
/*
import type { Metadata } from "next";
import {
  StarknetConfig,
  argent,
  braavos,
  publicProvider,
  useInjectedConnectors,
  voyager,
} from "@starknet-react/core";
 */
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AutoConnect } from "@/components/connect/AutoConnect";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AttenSys",
  description: "certify and verify",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Header />
          <AutoConnect />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
