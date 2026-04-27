import Image from "next/image";
import type { VendorProfile } from "@/lib/types/vendor";
import { getMediaUrl } from "@/lib/utils/url";

type VendorBannerProps = {
  vendor: VendorProfile;
};

export function VendorBanner({ vendor }: VendorBannerProps) {
  const bannerUrl = getMediaUrl(vendor.banner?.url);
  const logoUrl = getMediaUrl(vendor.logo?.url);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
      <div className="relative h-44 bg-slate-100 dark:bg-slate-900 sm:h-56">
        {bannerUrl ? (
          <Image
            src={bannerUrl}
            alt={vendor.banner?.alt || vendor.displayName}
            fill
            className="object-cover"
            sizes="100vw"
          />
        ) : null}
      </div>
      <div className="relative -mt-10 flex items-end gap-3 px-4 pb-4 sm:px-6">
        <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={vendor.logo?.alt || vendor.displayName}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-slate-500 dark:text-slate-300">
              {vendor.displayName.charAt(0)}
            </div>
          )}
        </div>
        <h1 className="pb-2 text-xl font-semibold sm:text-2xl">{vendor.displayName}</h1>
      </div>
    </section>
  );
}
