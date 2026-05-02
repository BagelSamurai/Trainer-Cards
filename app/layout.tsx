import type { Metadata } from "next";
import {
  Inter,
  Bricolage_Grotesque,
  JetBrains_Mono,
  Space_Grotesk,
  DM_Serif_Display,
  VT323,
} from "next/font/google";
import "./globals.css";
import { TeamProvider } from "./lib/teamContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  weight: "400",
  subsets: ["latin"],
});

const vt323 = VT323({
  variable: "--font-vt323",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trainer Cards · Pokémon",
  description: "Build and share your Pokémon team trainer card.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontVars = [
    inter.variable,
    bricolage.variable,
    jetbrains.variable,
    spaceGrotesk.variable,
    dmSerif.variable,
    vt323.variable,
  ].join(" ");

  return (
    <html lang="en" className={`${fontVars} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <TeamProvider>{children}</TeamProvider>
      </body>
    </html>
  );
}
