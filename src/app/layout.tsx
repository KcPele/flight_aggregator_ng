import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import CustomQueryClientProvider from "@/providers/QueryClientProvider";

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
  title: "CheapSearch",
  description: "find the best and most affordable flights in Nigeria",
  keywords: [
    "CheapSearch",
    "cheap flights Nigeria",
    "affordable flights Nigeria",
    "flight deals Nigeria",
    "discount flights",
    "Nigeria air travel",
    "flight comparison Nigeria",
    "best flight prices",
    "low-cost airlines Nigeria",
    "flight booking Nigeria",
    "budget travel",
    "domestic flights Nigeria",
    "international flights Nigeria",
    "cheap air tickets",
    "flight offers",
    "cheap airfare",
    "travel Nigeria",
    "online flight booking",
    "last-minute deals Nigeria",
    "Nigeria flight search",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <CustomQueryClientProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </CustomQueryClientProvider>
    </html>
  );
}
