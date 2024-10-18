import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "School Management Dashboard",
  description: "Next.js School Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* what ever we will write in layout page will reflet to all the pages inside that folder */}
      {/* so used to add common component to all pages  */}
      <body className={inter.className}>{children}</body>
    </html>
  );
}
