import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { brand } from '@/lib/content';
import { Analytics } from '@vercel/analytics/next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: `${brand.name} | Lead management for home-service businesses`,
  description: brand.description,
  metadataBase: new URL('https://quotesprint.vercel.app'),
  manifest: '/manifest.webmanifest',
  applicationName: 'LeadSprint',
  appleWebApp: {
    capable: true,
    title: 'LeadSprint',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: '/brand/quotesprint-circle-logo.png',
    apple: '/brand/quotesprint-circle-logo.png',
  },
  openGraph: {
    title: `${brand.name} | Quote faster and win more service jobs`,
    description: brand.description,
    type: 'website',
    images: ['/brand/quotesprint-circle-logo.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <Script defer data-domain="quotesprint.vercel.app" src="https://plausible.io/js/script.js" strategy="afterInteractive" />
        <Analytics />
      </body>
    </html>
  );
}
