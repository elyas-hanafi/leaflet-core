import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import React from "react";
import RootLayoutClient from "./RootLayoutClient";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ROUTER PWA",
  description:
    "MovieMaster PWA helps you find the latest movies with an easy search by genre, year, and more. It works smoothly on any device, even offline, giving you a great movie browsing experience.",
  manifest: "/web.manifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
