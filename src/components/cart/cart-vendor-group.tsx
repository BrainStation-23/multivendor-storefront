"use client";

import Link from "next/link";
import type { CartItem as CartItemType } from "@/lib/types/cart";
import { formatPrice } from "@/lib/utils/format-price";
import { CartItem } from "@/components/cart/cart-item";

type CartVendorGroupProps = {
  locale: string;
  items: CartItemType[];
  isLoading?: boolean;
  onIncrease: (item: CartItemType) => void;
  onDecrease: (item: CartItemType) => void;
  onRemove: (item: CartItemType) => void;
};

export function CartVendorGroup({
  locale,
  items,
  isLoading = false,
  onIncrease,
  onDecrease,
  onRemove,
}: CartVendorGroupProps) {
  const groupedItems = items.reduce<Map<string, CartItemType[]>>((acc, item) => {
    const vendorId = item.vendor?.id ?? "platform";
    const existing = acc.get(vendorId) ?? [];
    existing.push(item);
    acc.set(vendorId, existing);
    return acc;
  }, new Map<string, CartItemType[]>());

  return (
    <div className="space-y-3">
      {Array.from(groupedItems.entries()).map(([vendorId, vendorItems]) => {
        const vendor = vendorItems[0]?.vendor;
        const vendorName = vendor?.name || "Platform";
        const groupSubtotal = vendorItems.reduce(
          (sum, item) => sum + item.unitPrice * item.quantity,
          0,
        );

        return (
          <section
            key={vendorId}
            className="space-y-3 rounded-xl border border-slate-200 p-3 dark:border-slate-800 sm:p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              {vendor?.slug ? (
                <Link
                  href={`/${locale}/store/${vendor.slug}`}
                  className="text-sm font-semibold uppercase tracking-wide text-slate-700 underline-offset-4 hover:underline dark:text-slate-200"
                >
                  {vendorName}
                </Link>
              ) : (
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                  {vendorName}
                </h3>
              )}
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Subtotal: {formatPrice(groupSubtotal)}
              </p>
            </div>
            <div className="space-y-3">
              {vendorItems.map((item) => (
                <CartItem
                  key={`${item.product.id}-${item.variant?.id ?? "no-variant"}`}
                  locale={locale}
                  item={item}
                  isLoading={isLoading}
                  onIncrease={() => onIncrease(item)}
                  onDecrease={() => onDecrease(item)}
                  onRemove={() => onRemove(item)}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
