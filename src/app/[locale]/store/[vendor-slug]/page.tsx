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
import { i18nConfig, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { resolveListingStoreId } from "@/lib/utils/listing-store-id";
import { buildLocaleAlternates } from "@/lib/seo/locale-metadata";
import { InStockLocationCatalogToggle } from "@/components/product/in-stock-location-catalog-toggle";

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
  const { locale, "vendor-slug": slug } = await params;
  if (!i18nConfig.locales.includes(locale as Locale)) {
    return {};
  }

  const vendor = await getVendorBySlug(slug);
  if (!vendor) {
    return {};
  }

  const imageUrl = vendor.logo?.url ? getMediaUrl(vendor.logo.url) : null;
  const path = `/store/${slug}`;
  const alternates = buildLocaleAlternates(locale as Locale, path);
  const canonical =
    typeof alternates.canonical === "string" ? alternates.canonical : undefined;

  return {
    title: vendor.meta?.title || `${vendor.displayName} - Store`,
    description:
      vendor.meta?.description || `Shop products from ${vendor.displayName}`,
    alternates,
    openGraph: {
      url: canonical,
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

  const cookieStoreId = await getSelectedStoreId();
  const inStockAtStoreParam = firstParam(query.inStockAtStore);
  const listingStoreId = resolveListingStoreId({
    serviceAreaStoreSelection: features.serviceAreaStoreSelection,
    selectedStockLocationId: cookieStoreId,
    inStockAtStoreParam,
  });

  const products = await getProducts({
    tenant: vendor.tenant.id,
    locale,
    page,
    sort: "-createdAt",
    storeId: listingStoreId,
  });

  const dict = await getDictionary(locale as Locale);
  const showStockToggle =
    features.serviceAreaStoreSelection && Boolean(cookieStoreId);
  const listingUsedStoreFilter = Boolean(listingStoreId);
  const availabilityBadgeLabel =
    features.productCardStockBadgesOnCards && listingUsedStoreFilter
      ? dict.catalog.availableAtLocationBadge
      : null;

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <VendorBanner vendor={vendor} />

      <section className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <VendorInfo vendor={vendor} locale={locale} />
        <div className="space-y-4">
          <h2 className="text-lg font-semibold sm:text-xl">{dict.catalog.productsTitle}</h2>
          {showStockToggle ? (
            <InStockLocationCatalogToggle
              enabled
              label={dict.catalog.inStockAtLocationLabel}
              hint={dict.catalog.inStockAtLocationHint}
            />
          ) : null}
          <ProductGrid
            products={products.docs}
            locale={locale}
            emptyMessage={dict.catalog.noProductsFiltered}
            availabilityBadgeLabel={availabilityBadgeLabel}
            quickViewCopy={dict.catalog.quickView}
            quickViewGalleryLabels={dict.product.gallery}
            quickViewProductDetailsTitle={dict.product.productDetails}
            quickViewProductDetailsSeeLess={dict.product.descriptionSeeLess}
          />
          <Pagination
            currentPage={products.page}
            totalPages={products.totalPages}
            pathname={`/${locale}/store/${vendorSlug}`}
            query={{
              inStockAtStore: inStockAtStoreParam === "0" ? "0" : undefined,
            }}
          />
        </div>
      </section>
    </main>
  );
}
