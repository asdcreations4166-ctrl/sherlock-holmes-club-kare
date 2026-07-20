import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedBackground from "@/components/layout/AnimatedBackground";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/providers/AuthProvider";
import ThemeProvider from "@/providers/ThemeProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sherlockholmesclub.kare.edu.in"),
  title: "Sherlock Holmes Club | Kalasalingam Academy of Research and Education",
  description:
    "Official website of the Sherlock Holmes Club at Kalasalingam Academy of Research and Education (KARE). Developed by ASD Creations.",
  keywords: [
    "Sherlock Holmes Club",
    "Kalasalingam Academy",
    "KARE",
    "University Clubs",
    "Logical Reasoning",
    "Mystery Solving",
    "Cryptography",
  ],
  authors: [{ name: "Sherlock Holmes Club KARE" }],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "96x96" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-icon.png", type: "image/png", sizes: "180x180" },
    ],
  },
  openGraph: {
    title: "Sherlock Holmes Club | KARE",
    description:
      "Official website of the Sherlock Holmes Club at Kalasalingam Academy of Research and Education (KARE). Developed by ASD Creations.",
    url: "https://sherlockholmesclub.kare.edu.in",
    siteName: "Sherlock Holmes Club × KARE",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Sherlock Holmes Club KARE Social Share Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sherlock Holmes Club | KARE",
    description:
      "Official website of the Sherlock Holmes Club at Kalasalingam Academy of Research and Education (KARE). Developed by ASD Creations.",
    images: ["/opengraph-image.png"],
  },
  verification: {
    google: "_G57zdnkUO6xIcp09cxzGsY7YA1n26FnMmjTqpGQ25A",
  },
};

export const viewport: Viewport = {
  themeColor: "#0F4C81",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${poppins.variable} antialiased min-h-full flex flex-col`}
      >
        <ThemeProvider>
          <AuthProvider>
            <AnimatedBackground />
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
            <Toaster position="bottom-right" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
