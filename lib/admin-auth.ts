import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const ADMIN_COOKIE = 'vitale_admin_session';
export const DEMO_ADMIN_EMAIL = 'vitale.produtos.ibaiti@gmail.com';
export const DEMO_ADMIN_PASSWORD = 'Vitale@2026!';

const SESSION_DURATION_SECONDS = 60 * 60 * 8;

const configuredEmail = () =>
  (process.env.ADMIN_EMAIL || DEMO_ADMIN_EMAIL).trim().toLocaleLowerCase();
const configuredPassword = () =>
  process.env.ADMIN_PASSWORD || DEMO_ADMIN_PASSWORD;
const sessionSecret = () =>
  process.env.ADMIN_SESSION_SECRET ||
  'vitale-catalog-demo-session-change-in-production';

function toBase64Url(bytes: Uint8Array) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

async function sign(value: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(sessionSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(value),
  );
  return toBase64Url(new Uint8Array(signature));
}

export function adminCredentialsAreValid(email: string, password: string) {
  return (
    email.trim().toLocaleLowerCase() === configuredEmail() &&
    password === configuredPassword()
  );
}

export async function createAdminToken() {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS;
  const payload = `${configuredEmail()}|${expiresAt}`;
  return `${payload}|${await sign(payload)}`;
}

export async function getAdminEmail() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  const parts = token.split('|');
  if (parts.length !== 3) return null;
  const [email, expires, signature] = parts;
  if (Number(expires) <= Math.floor(Date.now() / 1000)) return null;
  const payload = `${email}|${expires}`;
  if ((await sign(payload)) !== signature) return null;
  return email === configuredEmail() ? email : null;
}

export async function isAdminRequest() {
  return Boolean(await getAdminEmail());
}

export async function requireAdminSession() {
  const email = await getAdminEmail();
  if (email) return email;
  redirect('/admin/login');
}

export const adminSessionDuration = SESSION_DURATION_SECONDS;
