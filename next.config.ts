import type { NextConfig } from "next";

import { DEFAULT_MV_BACKEND_ORIGIN } from "./src/lib/config/backend-defaults";

const mvBackendPort =
  new URL(DEFAULT_MV_BACKEND_ORIGIN).port || "4000";

function toOrigin(value: string, fallback: string) {
  try {
    return new URL(value).origin;
  } catch {
    return fallback;
  }
}

const nextConfig: NextConfig = {
  output: "standalone",
  async headers() {
    const backendUrl = process.env.BACKEND_URL || DEFAULT_MV_BACKEND_ORIGIN;
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      `${DEFAULT_MV_BACKEND_ORIGIN}/api`;
    const backendOrigin = toOrigin(backendUrl, DEFAULT_MV_BACKEND_ORIGIN);
    const apiOrigin = toOrigin(
      apiUrl,
      `${DEFAULT_MV_BACKEND_ORIGIN}/api`,
    );
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      `img-src 'self' data: blob: ${backendOrigin}`,
      `connect-src 'self' ${apiOrigin} ${backendOrigin} ws: wss:`,
      "font-src 'self'",
      "frame-ancestors 'none'",
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/api/media/file/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: mvBackendPort,
        pathname: "/api/media/file/**",
      },
    ],
  },
  env: {
    BACKEND_URL: process.env.BACKEND_URL || DEFAULT_MV_BACKEND_ORIGIN,
  },
};

export default nextConfig;
