import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { BottomNav } from "@/components/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VibeTrack | Suivez vos émotions à travers la musique",
  description:
    "VibeTrack vous aide à suivre vos émotions grâce à la musique, analyser votre humeur et mieux comprendre vos ressentis au quotidien.",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen pb-20">{children}</main>
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
