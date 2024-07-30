import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import "./globals.css";
import "./normalize.css";
import "./text-editor.css";
import { cn } from "@/lib/utils";
import { ClerkProvider } from '@clerk/nextjs'
import { Providers } from "@/components/Providers";

const inter = FontSans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Live Editor",
  description: "Realtime document editor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            inter.variable
          )}
        >
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
