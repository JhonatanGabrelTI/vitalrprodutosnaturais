import type { NextConfig } from 'next';
import path from 'node:path';

const cloudflareWorkersShim = path.resolve(
  process.cwd(),
  'lib/cloudflare-workers-vercel.ts',
);
const isVercelBuild = Boolean(process.env.VERCEL);

const nextConfig: NextConfig = isVercelBuild
  ? {
      turbopack: {
        resolveAlias: {
          'cloudflare:workers': './lib/cloudflare-workers-vercel.ts',
        },
      },
      webpack(config) {
        config.resolve.alias['cloudflare:workers'] = cloudflareWorkersShim;
        return config;
      },
    }
  : {};

export default nextConfig;
