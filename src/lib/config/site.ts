import {
  DEFAULT_MV_API_URL,
  DEFAULT_MV_BACKEND_ORIGIN,
} from "./backend-defaults";

export const siteConfig = {
  name: "BS Commerce",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || DEFAULT_MV_API_URL,
  backendUrl: process.env.BACKEND_URL || DEFAULT_MV_BACKEND_ORIGIN,
  storefrontUrl:
    process.env.NEXT_PUBLIC_STOREFRONT_URL || "http://localhost:3002",
} as const;
