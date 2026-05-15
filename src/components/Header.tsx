import Image from 'next/image';
import Link from 'next/link';
import { brand } from '@/lib/content';

export function Header() {
  return (
    <header className="site-header">
      <Link href="/" className="logo" aria-label="QuoteSprint home">
        <Image className="logo-image" src="/brand/quotesprint-circle-logo.png" alt="" width={44} height={44} priority />
        <span>{brand.name}</span>
      </Link>
      <nav>
        <Link href="/product">Product</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/resources">Resources</Link>
        <Link href="/login">Log in</Link>
        <Link href="/app" className="nav-cta">Customer access</Link>
      </nav>
    </header>
  );
}
