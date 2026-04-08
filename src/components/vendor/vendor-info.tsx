import Link from "next/link";
import type { VendorProfile } from "@/lib/types/vendor";
import { formatDate } from "@/lib/utils/format-date";
import { VendorRating } from "@/components/vendor/vendor-rating";

type VendorInfoProps = {
  vendor: VendorProfile;
  locale: string;
};

export function VendorInfo({ vendor, locale }: VendorInfoProps) {
  return (
    <section className="space-y-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
      <h2 className="text-lg font-semibold">About Vendor</h2>
      <VendorRating rating={vendor.rating} />
      {vendor.description ? (
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {String(vendor.description)}
        </p>
      ) : null}
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Joined {formatDate(vendor.joinedAt, locale)}
      </p>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Total sales: {vendor.totalSales}
      </p>
      {vendor.website ? (
        <Link
          href={vendor.website}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-sky-700 underline-offset-4 hover:underline dark:text-sky-300"
        >
          Visit website
        </Link>
      ) : null}
      {vendor.contactEmail ? (
        <p className="text-sm text-slate-600 dark:text-slate-300">{vendor.contactEmail}</p>
      ) : null}
    </section>
  );
}
