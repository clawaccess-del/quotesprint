import { NextResponse, type NextRequest } from 'next/server';

const canonicalHost = 'leadsprinthelp.com';
const localHosts = new Set(['localhost', '127.0.0.1', '0.0.0.0']);

export function proxy(request: NextRequest) {
  const host = request.headers.get('host')?.split(':')[0].toLowerCase() || '';

  if (host === canonicalHost || localHosts.has(host)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.protocol = 'https:';
  url.hostname = canonicalHost;
  url.port = '';

  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
