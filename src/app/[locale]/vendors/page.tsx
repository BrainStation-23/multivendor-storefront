import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { features } from "@/lib/config/features";
import { getVendorProfiles } from "@/lib/api/vendors";
import { Pagination } from "@/components/shared/pagination";
import { VendorCard } from "@/components/vendor/vendor-card";

type VendorsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export const metadata: Metadata = {
  title: "Vendors - BS Commerce Marketplace",
  description: "Discover trusted vendors in BS Commerce marketplace.",
};

export default async function VendorsPage({ params, searchParams }: VendorsPageProps) {
  if (!features.multivendor) {
    notFound();
  }

  const { locale } = await params;
  const query = await searchParams;
  const page = Math.max(1, Number(firstParam(query.page) || "1"));
  const response = await getVendorProfiles(page, 12);

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold sm:text-3xl">Vendors</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Explore marketplace vendors and browse their stores.
        </p>
      </header>

      {response.docs.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
          No vendors available.
        </p>
      ) : (
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {response.docs.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} locale={locale} />
          ))}
        </section>
      )}

      <Pagination
        currentPage={response.page}
        totalPages={response.totalPages}
        pathname={`/${locale}/vendors`}
        query={{}}
      />
    </main>
  );
}
