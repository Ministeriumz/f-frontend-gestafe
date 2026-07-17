
//* Libraries imports

//* Libraries imports
import { Geist, Geist_Mono } from "next/font/google";

//* Components imports
import AppToaster from "@/components/theme/AppToaster";

//* Utilities imports
import { getSiteUrl } from "@/lib/site-url";

//* Types imports
import type { Metadata } from "next";

//* Styles imports
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  applicationName: "GestaFé",
  title: { default: "GestaFé | Gestão completa para igrejas", template: "%s | GestaFé" },
  description: "Plataforma de gestão para igrejas com controle de membros, ministérios, eventos, escalas e finanças em um só lugar.",
  keywords: ["gestão de igrejas", "sistema para igrejas", "administração de igreja", "gestão de membros", "escalas ministeriais", "calendário de eventos", "gestão financeira para igrejas"],
  authors: [{ name: "GestaFé" }],
  creator: "GestaFé",
  publisher: "GestaFé",
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "GestaFé",
    title: "GestaFé | Gestão completa para igrejas",
    description: "Organize membros, ministérios, eventos, escalas e finanças da sua igreja em um só lugar.",
    images: [{ url: "/imagem-dia.png", width: 1792, height: 1024, alt: "GestaFé — plataforma de gestão para igrejas" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GestaFé | Gestão completa para igrejas",
    description: "Organize membros, ministérios, eventos, escalas e finanças da sua igreja em um só lugar.",
    images: ["/imagem-dia.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  icons: { icon: "/favicon.ico", shortcut: "/favicon.ico" },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "GestaFé",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description: "Plataforma de gestão para igrejas com membros, ministérios, eventos, escalas e finanças.",
  url: getSiteUrl(),
  inLanguage: "pt-BR",
};

const themeBootScript = `
(() => {
  try {
    const mode = localStorage.getItem('gestafe-theme-mode') || 'system';
    const root = document.documentElement;

    if (mode === 'light' || mode === 'dark') {
      root.setAttribute('data-theme', mode);
      root.classList.toggle('dark', mode === 'dark');
      return;
    }

    const resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    root.setAttribute('data-theme', resolved);
    root.classList.toggle('dark', resolved === 'dark');
  } catch {}
})();
`;


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Faculty+Glyphic&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c") }}
        />
        <ThemeProvider>
          {children}
          <AppToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
