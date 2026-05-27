import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Шаманские зеркала Толе ручной работы | Авторские символические артефакты",
  description:
    "Премиальные авторские зеркала Толе: символические артефакты, украшения и декоративные предметы ручной работы.",
  openGraph: {
    title: "Шаманские зеркала Толе ручной работы | Авторские символические артефакты",
    description:
      "Премиальные авторские зеркала Толе: символические артефакты, украшения и декоративные предметы ручной работы.",
    type: "website",
    locale: "ru_RU",
    siteName: "Толе",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
