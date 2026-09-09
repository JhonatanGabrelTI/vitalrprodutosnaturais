import { NextResponse } from 'next/server';
import {
  ADMIN_COOKIE,
  adminCredentialsAreValid,
  adminSessionDuration,
  createAdminToken,
} from '@/lib/admin-auth';

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  if (!adminCredentialsAreValid(body.email || '', body.password || '')) {
    return NextResponse.json(
      { error: 'E-mail ou senha incorretos.' },
      { status: 401 },
    );
  }
  const response = NextResponse.json({ authenticated: true });
  response.cookies.set(ADMIN_COOKIE, await createAdminToken(), {
    httpOnly: true,
    secure: new URL(request.url).protocol === 'https:',
    sameSite: 'lax',
    path: '/',
    maxAge: adminSessionDuration,
  });
  return response;
}
