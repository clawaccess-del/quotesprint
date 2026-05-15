import Link from 'next/link';

export function Footer() {
  return (
    <footer className="footer">
      <div>
        <strong>QuoteSprint</strong>
        <p>Speed-to-lead quote workflows for home-service businesses.</p>
      </div>
      <div className="footer-links">
        <Link href="/product">Product</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/resources">Resources</Link>
        <Link href="/app">Customer access</Link>
      </div>
    </footer>
  );
}
