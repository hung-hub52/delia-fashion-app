//src/app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "next-themes";

import ConditionalLayout from "@/components/common/ConditionalLayout";
import { CartProvider } from "@/context/CartContext"; // 👈 import CartProvider

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DELIA ELLY",
  description: "Fashion E-commerce",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <CartProvider>
            <Toaster position="top-center" reverseOrder={false} />
            <ConditionalLayout>{children}</ConditionalLayout>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
