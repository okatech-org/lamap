import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Inter,
  JetBrains_Mono,
  Crimson_Pro,
} from "next/font/google";
import "./globals.css";

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const publicSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://okatech-org.github.io/lamap";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display-loaded",
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body-loaded",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-loaded",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const crimson = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-card-loaded",
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LaMap — Le jeu de cartes du Cameroun",
  description:
    "La Map en ligne. Entre à table, trouve un adversaire et joue le jeu de cartes du Cameroun.",
  metadataBase: new URL(publicSiteUrl),
  openGraph: {
    title: "LaMap",
    description: "Le jeu de cartes du Cameroun, en ligne.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#16070B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${bricolage.variable} ${inter.variable} ${jetbrains.variable} ${crimson.variable}`}
    >
      <body
        style={
          {
            "--paper-image": `url("${publicBasePath}/images/paper-cotton.jpg")`,
          } as React.CSSProperties
        }
      >
        {children}
      </body>
    </html>
  );
}
