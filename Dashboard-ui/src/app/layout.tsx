import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


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
    <ClerkProvider>
        <html lang="en">
          {/* what ever we will write in layout page will reflet to all the pages inside that folder */}
          {/* so used to add common component to all pages  */}
          <body className={inter.className}>{children} <ToastContainer position="bottom-right"
          theme="dark"/></body>
        </html>
    </ClerkProvider>

  );
}
