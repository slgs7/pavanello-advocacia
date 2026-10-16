import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  response.headers.set('Cache-Control', 'private, no-store');
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
    key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    if (request.nextUrl.pathname !== '/admin/login')
      return NextResponse.redirect(new URL('/admin/login', request.url));
    return response;
  }
  const db = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(values) {
        values.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        values.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
        response.headers.set('Cache-Control', 'private, no-store');
      },
    },
  });
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user && request.nextUrl.pathname !== '/admin/login') {
    const redirect = NextResponse.redirect(
      new URL('/admin/login', request.url),
    );
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    redirect.headers.set('Cache-Control', 'private, no-store');
    return redirect;
  }
  return response;
}
export const config = { matcher: ['/admin/:path*'] };
