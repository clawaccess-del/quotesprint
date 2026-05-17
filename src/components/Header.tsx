import Image from 'next/image';
import Link from 'next/link';
import { getAdminSession } from '@/lib/admin';
import { brand } from '@/lib/content';

export async function Header() {
  const adminSession = await getAdminSession();

  return (
    <header className="site-header">
      <Link href="/" className="logo" aria-label="LeadSprint home">
        <Image className="logo-image" src="/brand/quotesprint-circle-logo.png" alt="" width={44} height={44} priority />
        <span>{brand.name}</span>
      </Link>
      <nav>
        <Link href="/product">Product</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/founding-teams">6-month trial</Link>
        <Link href="/resources">Resources</Link>
        <Link href="/login">Log in</Link>
        <Link href="/app" className="nav-cta">Customer access</Link>
        {adminSession ? <Link href="/" className="owner-nav-link">View front end</Link> : null}
        {adminSession ? <Link href="/admin" className="owner-nav-link strong">Backend</Link> : null}
      </nav>
    </header>
  );
}
