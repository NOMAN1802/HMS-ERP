import type { NextConfig } from 'next';

// Next.js renders the staff UI only. Business writes go through the NestJS API (ADR-002).
const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
};

export default nextConfig;
