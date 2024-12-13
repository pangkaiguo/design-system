import type { Metadata } from "next";
import { ReactNode, Suspense } from "react";
import { ClientWrapper } from "@/components/ClientWrapper";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Design System",
  description: "Design System",
};

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({
  children,
}: Readonly<LayoutProps>) {
  return (
    <html lang="en">
      <body className="antialiased bg-black text-white">
        <Suspense fallback={<div>Loading...</div>}>
          <ClientWrapper>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="p-4">
                {children}
              </main>
              <Footer />
            </div>
          </ClientWrapper>
        </Suspense>
      </body>
    </html>
  );
}