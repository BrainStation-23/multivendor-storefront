import Link from "next/link";
import type { Order, OrderStatus, SubOrder } from "@/lib/types/order";
import { formatDate } from "@/lib/utils/format-date";
import { formatPrice } from "@/lib/utils/format-price";
import { Badge } from "@/components/shared/badge";

type OrderDetailProps = {
  order: Order;
  locale: string;
  isMultivendor: boolean;
};

function statusVariant(status: OrderStatus) {
  if (["completed", "delivered"].includes(status)) {
    return "success" as const;
  }
  if (["cancelled", "refunded"].includes(status)) {
    return "danger" as const;
  }
  if (["processing", "partially-shipped", "shipped"].includes(status)) {
    return "info" as const;
  }
  return "warning" as const;
}

function getTenantLabel(tenant: SubOrder["tenant"]) {
  if (typeof tenant === "string") {
    return "Vendor";
  }
  return tenant.name;
}

function getSubOrderTimeline(
  subOrder: SubOrder,
  locale: string,
): Array<{ label: string; value: string; done: boolean }> {
  return [
    { label: "Placed", value: "Order created", done: true },
    {
      label: "Shipped",
      value: subOrder.shippedAt ? formatDate(subOrder.shippedAt, locale) : "Pending",
      done: Boolean(subOrder.shippedAt),
    },
    {
      label: "Delivered",
      value: subOrder.deliveredAt ? formatDate(subOrder.deliveredAt, locale) : "Pending",
      done: Boolean(subOrder.deliveredAt),
    },
  ];
}

export function OrderDetail({ order, locale, isMultivendor }: OrderDetailProps) {
  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold sm:text-3xl">Order #{order.orderNumber}</h1>
          <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Placed on {formatDate(order.placedAt, locale)} - Payment: {order.paymentStatus}
        </p>
      </header>

      <section className="space-y-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
        <h2 className="text-lg font-semibold">Items</h2>
        {order.items.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-3 text-sm">
            <div>
              <p className="font-medium">{item.productName}</p>
              <p className="text-slate-600 dark:text-slate-300">
                Qty {item.quantity}
                {item.variantName ? ` - ${item.variantName}` : ""}
              </p>
            </div>
            <p className="font-medium">{formatPrice(item.totalPrice, order.currency)}</p>
          </div>
        ))}
      </section>

      {isMultivendor && order.subOrders?.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Vendor Sub-orders</h2>
          {order.subOrders.map((subOrder) => (
            <details
              key={subOrder.id}
              className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"
            >
              <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {getTenantLabel(subOrder.tenant)}
                  </p>
                  <p className="font-medium">Sub-order #{subOrder.subOrderNumber}</p>
                </div>
                <Badge variant={statusVariant(subOrder.status as OrderStatus)}>
                  {subOrder.status}
                </Badge>
              </summary>
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  {subOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-3 text-sm"
                    >
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-slate-600 dark:text-slate-300">
                          Qty {item.quantity}
                          {item.variantName ? ` - ${item.variantName}` : ""}
                        </p>
                      </div>
                      <p className="font-medium">
                        {formatPrice(item.totalPrice, order.currency)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
                  <p>Shipping method: {subOrder.shippingMethod || "Not assigned yet"}</p>
                  {subOrder.trackingUrl ? (
                    <Link
                      href={subOrder.trackingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky-700 underline-offset-4 hover:underline dark:text-sky-300"
                    >
                      Track shipment ({subOrder.trackingNumber || "Open tracking"})
                    </Link>
                  ) : subOrder.trackingNumber ? (
                    <p>Tracking: {subOrder.trackingNumber}</p>
                  ) : (
                    <p>Tracking: Not available yet</p>
                  )}
                </div>

                <div className="grid gap-2 text-sm sm:grid-cols-3">
                  {getSubOrderTimeline(subOrder, locale).map((step) => (
                    <div
                      key={step.label}
                      className={`rounded-lg border p-2 ${
                        step.done
                          ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/40"
                          : "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
                      }`}
                    >
                      <p className="font-medium">{step.label}</p>
                      <p className="text-slate-600 dark:text-slate-300">{step.value}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-1 border-t border-slate-200 pt-3 text-sm dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span>Items subtotal</span>
                    <span>{formatPrice(subOrder.subtotal, order.currency)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Shipping</span>
                    <span>{formatPrice(subOrder.shippingTotal, order.currency)}</span>
                  </div>
                  <div className="flex items-center justify-between font-medium">
                    <span>Sub-order total</span>
                    <span>
                      {formatPrice(
                        subOrder.subtotal + subOrder.shippingTotal,
                        order.currency,
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </details>
          ))}
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 rounded-xl border border-slate-200 p-4 text-sm dark:border-slate-800">
          <h3 className="font-semibold">Shipping address</h3>
          <p>
            {order.shippingAddress.firstName} {order.shippingAddress.lastName}
          </p>
          <p>
            {order.shippingAddress.street1}
            {order.shippingAddress.street2 ? `, ${order.shippingAddress.street2}` : ""}
          </p>
          <p>
            {order.shippingAddress.city}, {order.shippingAddress.postalCode}
          </p>
          <p>{order.shippingAddress.country}</p>
        </div>
        <div className="space-y-2 rounded-xl border border-slate-200 p-4 text-sm dark:border-slate-800">
          <h3 className="font-semibold">Billing address</h3>
          <p>
            {order.billingAddress.firstName} {order.billingAddress.lastName}
          </p>
          <p>
            {order.billingAddress.street1}
            {order.billingAddress.street2 ? `, ${order.billingAddress.street2}` : ""}
          </p>
          <p>
            {order.billingAddress.city}, {order.billingAddress.postalCode}
          </p>
          <p>{order.billingAddress.country}</p>
        </div>
      </section>

      <section className="space-y-2 rounded-xl border border-slate-200 p-4 text-sm dark:border-slate-800">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(order.subtotal, order.currency)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Shipping</span>
          <span>{formatPrice(order.shippingTotal, order.currency)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Tax</span>
          <span>{formatPrice(order.taxTotal, order.currency)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Discount</span>
          <span>-{formatPrice(order.discountTotal, order.currency)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-base font-semibold dark:border-slate-800">
          <span>Grand Total</span>
          <span>{formatPrice(order.grandTotal, order.currency)}</span>
        </div>
      </section>
    </main>
  );
}
