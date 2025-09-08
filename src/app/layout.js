import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { CategoriesProvider } from "@/context/CategoriesContext";
import { InventoryProvider } from "@/context/InventoryContext";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DELIA Admin",
  description: "Fashion Manager",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster position="top-center" reverseOrder={false} />
          <CategoriesProvider>
            <InventoryProvider>{children}</InventoryProvider>
          </CategoriesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
