import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import  { Toaster } from 'react-hot-toast';

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Proyecto Meeti Next.js con DrizzleORM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"
      >
        {children}
      
        <Toaster 
          position="top-right"
        />

      </body>
    </html>
  );
}
