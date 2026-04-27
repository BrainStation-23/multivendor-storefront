import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { features } from "@/lib/config/features";
import { getVendorBySlug } from "@/lib/api/vendors";
import { getProducts } from "@/lib/api/products";
import { getMediaUrl } from "@/lib/utils/url";
import { getSelectedStoreId } from "@/lib/utils/get-store-id";
import { ProductGrid } from "@/components/product/product-grid";
import { Pagination } from "@/components/shared/pagination";
import { VendorBanner } from "@/components/vendor/vendor-banner";
import { VendorInfo } from "@/components/vendor/vendor-info";

type VendorStorePageProps = {
  params: Promise<{ locale: string; "vendor-slug": string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({
  params,
}: VendorStorePageProps): Promise<Metadata> {
  const { "vendor-slug": slug } = await params;
  const vendor = await getVendorBySlug(slug);
  if (!vendor) {
    return {};
  }

  const imageUrl = vendor.logo?.url ? getMediaUrl(vendor.logo.url) : null;
  return {
    title: vendor.meta?.title || `${vendor.displayName} - Store`,
    description:
      vendor.meta?.description || `Shop products from ${vendor.displayName}`,
    openGraph: {
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
  };
}

export default async function VendorStorePage({
  params,
  searchParams,
}: VendorStorePageProps) {
  if (!features.multivendor) {
    notFound();
  }

  const { locale, "vendor-slug": vendorSlug } = await params;
  const query = await searchParams;
  const page = Math.max(1, Number(firstParam(query.page) || "1"));

  const vendor = await getVendorBySlug(vendorSlug);
  if (!vendor) {
    notFound();
  }

  const storeId = await getSelectedStoreId();
  const products = await getProducts({
    tenant: vendor.tenant.id,
    locale,
    page,
    sort: "-createdAt",
    storeId,
  });

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <VendorBanner vendor={vendor} />

      <section className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <VendorInfo vendor={vendor} locale={locale} />
        <div className="space-y-4">
          <h2 className="text-lg font-semibold sm:text-xl">Products</h2>
          <ProductGrid products={products.docs} locale={locale} />
          <Pagination
            currentPage={products.page}
            totalPages={products.totalPages}
            pathname={`/${locale}/store/${vendorSlug}`}
            query={{}}
          />
        </div>
      </section>
    </main>
  );
}
