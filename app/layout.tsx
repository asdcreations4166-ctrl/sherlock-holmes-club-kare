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
  title: "Sherlock Holmes Club | Kalasalingam Academy of Research and Education",
  description:
    "Official website of the Sherlock Holmes Club at Kalasalingam Academy of Research and Education (KARE). Promoting logical analysis, mystery-solving, and critical thinking.",
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
  openGraph: {
    title: "Sherlock Holmes Club | KARE",
    description:
      "Official website of the Sherlock Holmes Club at Kalasalingam Academy of Research and Education (KARE). Promoting logical analysis, mystery-solving, and critical thinking.",
    url: "https://sherlockholmesclub.kare.edu.in",
    siteName: "Sherlock Holmes Club × KARE",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sherlock Holmes Club | KARE",
    description:
      "Official website of the Sherlock Holmes Club at Kalasalingam Academy of Research and Education (KARE). Promoting logical analysis, mystery-solving, and critical thinking.",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
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
