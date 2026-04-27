export interface Vendor {
  id: string;
  name: string;
  slug: string;
}

export interface VendorProfile {
  id: string;
  tenant: Vendor;
  displayName: string;
  description: unknown | null;
  logo: { id: string; url: string; alt: string } | null;
  banner: { id: string; url: string; alt: string } | null;
  contactEmail: string | null;
  website: string | null;
  socialLinks: Array<{ platform: string; url: string }>;
  rating: number | null;
  totalSales: number;
  joinedAt: string;
  meta: { title: string | null; description: string | null } | null;
}

export interface VendorApplication {
  id: string;
  applicant: string;
  businessName: string;
  businessType: "individual" | "company" | "partnership";
  status: "pending" | "under-review" | "approved" | "rejected";
  submittedAt: string;
}
