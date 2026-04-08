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

type VendorProfileDoc = {
  displayName?: string | Record<string, string>;
};

function displayNameMatches(doc: VendorProfileDoc, expected: string): boolean {
  const n = doc.displayName;
  if (typeof n === "string") return n === expected;
  if (n && typeof n === "object" && typeof n.en === "string") return n.en === expected;
  return false;
}

/** Guest-readable vendor-profiles (tenant relation is not populated for anonymous depth queries). */
async function vendorProfileWithDisplayNameExists(displayName: string): Promise<boolean> {
  try {
    const params = new URLSearchParams();
    params.set("limit", "50");
    const res = await fetch(`${apiOrigin}/api/vendor-profiles?${params.toString()}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return false;
    const j = (await res.json()) as { docs?: VendorProfileDoc[] };
    const docs = j.docs;
    if (!Array.isArray(docs)) return false;
    return docs.some((d) => displayNameMatches(d, displayName));
  } catch {
    return false;
  }
}

/** Enough data for vendor-store-live tests that target Demo Vendor Co. */
export async function isDemoVendorSeeded(): Promise<boolean> {
  return vendorProfileWithDisplayNameExists("Demo Vendor Co.");
}

/** Full multi-tenant demo (Artisan + office category products, etc.). */
export async function isFullVendorDemoSeeded(): Promise<boolean> {
  return vendorProfileWithDisplayNameExists("Artisan Home Goods");
}
