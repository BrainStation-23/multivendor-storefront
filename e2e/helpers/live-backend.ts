/** Shared checks for specs that need a running Payload API. */

export const apiOrigin = process.env.PLAYWRIGHT_API_ORIGIN || "http://localhost:3010";

export async function isBackendReachable(): Promise<boolean> {
  try {
    const res = await fetch(`${apiOrigin}/api/categories?limit=1`, {
      signal: AbortSignal.timeout(5000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Guest-readable: vendor profile tied to tenant slug (demo seed uses stable slugs). */
async function vendorProfileExistsForTenantSlug(slug: string): Promise<boolean> {
  try {
    const params = new URLSearchParams();
    params.set("where[tenant.slug][equals]", slug);
    params.set("limit", "1");
    const res = await fetch(`${apiOrigin}/api/vendor-profiles?${params.toString()}`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return false;
    const j = (await res.json()) as { docs?: unknown[] };
    return Array.isArray(j?.docs) && j.docs.length > 0;
  } catch {
    return false;
  }
}

/** Enough data for vendor-store-live tests that target Demo Vendor Co. */
export async function isDemoVendorSeeded(): Promise<boolean> {
  return vendorProfileExistsForTenantSlug("demo-vendor-co");
}

/** Full multi-tenant demo (Artisan + office category products, etc.). */
export async function isFullVendorDemoSeeded(): Promise<boolean> {
  return vendorProfileExistsForTenantSlug("artisan-home-goods");
}
