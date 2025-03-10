import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { Suspense, useEffect, useState } from "react";
import Loading from "@/components/Loader";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AutoConnect } from "@/components/connect/AutoConnect";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Attensys",
  description:
    "AttenSys is a platform designed to revolutionize the management of educational certifications for participating in bootcamps, attendance tracking for events & online classes, and online courses certifications.",
  // icons: {
  //   icon: "/favicon.ico",
  //   shortcut: "/favicon.ico",
  //   apple: "/favicon.ico",
  // },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Suspense fallback={<Loading />}>
        <body className={inter.className}>
          {/* {universalLoad &&  <Loading /> } */}
          <Providers>
            {/* <RouterHandler> */}
            <Header />
            <AutoConnect />
            {children}
            <Footer />
            {/* </RouterHandler> */}
          </Providers>
        </body>
      </Suspense>
    </html>
  );
}
