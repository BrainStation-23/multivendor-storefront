import { apiClient } from "./client";
import type { PaginatedResponse } from "../types/api-response";
import type { VendorProfile } from "../types/vendor";

export async function getVendorProfiles(
  page = 1,
  limit = 20,
): Promise<PaginatedResponse<VendorProfile>> {
  const params = new URLSearchParams();
  params.set("depth", "1");
  params.set("limit", String(limit));
  params.set("page", String(page));
  params.set("sort", "-totalSales");

  return apiClient<PaginatedResponse<VendorProfile>>(
    `/vendor-profiles?${params.toString()}`,
    { next: { revalidate: 60 } } as RequestInit,
  );
}

export async function getVendorBySlug(slug: string): Promise<VendorProfile | null> {
  const params = new URLSearchParams();
  params.set("where[tenant.slug][equals]", slug);
  params.set("depth", "2");
  params.set("limit", "1");

  const response = await apiClient<PaginatedResponse<VendorProfile>>(
    `/vendor-profiles?${params.toString()}`,
    { next: { revalidate: 60 } } as RequestInit,
  );

  return response.docs[0] ?? null;
}

export async function submitVendorApplication(data: {
  businessName: string;
  businessType: "individual" | "company" | "partnership";
  taxId?: string;
  description?: string;
  documents?: string[];
}): Promise<unknown> {
  return apiClient("/vendor-applications", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
