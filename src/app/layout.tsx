import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Open IpaaS | Universal B2B Integrations",
  description: "The open-source framework to unify global B2B platforms under a single, strongly-typed English-first API.",
  openGraph: {
    title: "Open IpaaS | Universal B2B Integrations",
    description: "The open-source framework to unify global B2B platforms under a single, strongly-typed English-first API.",
    url: "https://openipaas.com",
    siteName: "Open IpaaS",
    images: [
      {
        url: "/og-image.png", // Path to your OG image
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Open IpaaS | Universal B2B Integrations",
    description: "The open-source framework to unify global B2B platforms under a single, strongly-typed English-first API.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
