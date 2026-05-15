import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { brand } from '@/lib/content';

export const metadata: Metadata = {
  title: `${brand.name} | Speed-to-lead quote kit for home-service businesses`,
  description: brand.description,
  metadataBase: new URL('https://quotesprint.vercel.app'),
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
      </body>
    </html>
  );
}
