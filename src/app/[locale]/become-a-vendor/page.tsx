import { notFound } from "next/navigation";
import { features } from "@/lib/config/features";
import { VendorApplicationForm } from "@/components/vendor/vendor-application-form";

type BecomeVendorPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function BecomeVendorPage({ params }: BecomeVendorPageProps) {
  if (!features.multivendor) {
    notFound();
  }

  const { locale } = await params;

  return (
    <main className="mx-auto w-full max-w-3xl space-y-5 px-4 py-8 sm:px-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold sm:text-3xl">Become a Vendor</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 sm:text-base">
          Join our marketplace and start selling your products to more customers.
        </p>
      </header>
      <VendorApplicationForm locale={locale} />
    </main>
  );
}
