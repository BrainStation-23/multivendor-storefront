import Image from "next/image";
import Link from "next/link";
import type { VendorProfile } from "@/lib/types/vendor";
import { getMediaUrl } from "@/lib/utils/url";
import { formatDate } from "@/lib/utils/format-date";
import { RatingStars } from "@/components/shared/rating-stars";

type VendorCardProps = {
  vendor: VendorProfile;
  locale: string;
};

export function VendorCard({ vendor, locale }: VendorCardProps) {
  const logoUrl = getMediaUrl(vendor.logo?.url);
  const vendorHref = `/${locale}/store/${vendor.tenant.slug}`;

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <Link href={vendorHref} className="flex items-start gap-3 p-4">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-900">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={vendor.logo?.alt || vendor.displayName}
              fill
              className="object-cover"
              sizes="56px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-base font-semibold text-slate-500 dark:text-slate-300">
              {vendor.displayName.charAt(0)}
            </div>
          )}
        </div>
        <div className="min-w-0 space-y-1">
          <h3 className="truncate text-sm font-semibold sm:text-base">{vendor.displayName}</h3>
          {typeof vendor.rating === "number" ? (
            <div className="flex items-center gap-1">
              <RatingStars rating={vendor.rating} />
              <span className="text-xs text-slate-600 dark:text-slate-300">
                {vendor.rating.toFixed(1)}
              </span>
            </div>
          ) : null}
          <p className="text-xs text-slate-600 dark:text-slate-300">
            {vendor.totalSales} sales
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Member since {formatDate(vendor.joinedAt, locale)}
          </p>
        </div>
      </Link>
    </article>
  );
}
