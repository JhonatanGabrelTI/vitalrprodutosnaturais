/**
 * Vercel does not expose Cloudflare bindings. The storefront already falls
 * back to its demonstration catalog when DB is absent, so an empty binding
 * object keeps the same source compatible with a regular Next.js deployment.
 */
export const env = {} as { DB?: D1Database };
