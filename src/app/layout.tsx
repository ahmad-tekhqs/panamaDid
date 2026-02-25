import { Roboto } from "next/font/google";
import { Metadata } from "next";
import "./globals.css";
import ThemeProvider from '@/components/ThemeProvider'

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ['100', '300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: "Digital Port Pass — Panamá",
  description: "Create and manage your Digital Port Pass (DPP) for maritime credentials",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
