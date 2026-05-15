import Link from 'next/link';
import { brand } from '@/lib/content';

export function Header() {
  return (
    <header className="site-header">
      <Link href="/" className="logo" aria-label="QuoteSprint home">
        <span className="logo-mark">QS</span>
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
