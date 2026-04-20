"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { features } from "@/lib/config/features";
import { useStore } from "@/lib/hooks/use-store";
import { useCart } from "@/lib/hooks/use-cart";
import { StoreDeliveryPicker } from "@/components/store/store-delivery-picker";

type PendingDeliveryChange =
  | { kind: "store"; storeId: string }
  | { kind: "country"; countryId: string }
  | { kind: "subdivision"; subdivisionId: string }
  | { kind: "locality"; localityId: string | null };

export function StoreSelector() {
  const { stores, selectedStore, selectStore, isLoading, serviceArea } = useStore();
  const { items, clearCart } = useCart();
  const [pendingChange, setPendingChange] = useState<PendingDeliveryChange | null>(null);
  const mdUp = useMediaQuery("(min-width: 768px)");
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const summaryLine = useMemo(() => {
    const parts: string[] = [];
    if (serviceArea) {
      const c = serviceArea.countries.find(
        (x) => x.id === serviceArea.selectedCountryId,
      )?.name;
      const s = serviceArea.subdivisions.find(
        (x) => x.id === serviceArea.selectedSubdivisionId,
      )?.name;
      const loc = serviceArea.localities.find(
        (x) => x.id === serviceArea.selectedLocalityId,
      )?.name;
      if (c) parts.push(c);
      if (s) parts.push(s);
      if (loc) parts.push(loc);
    }
    if (selectedStore?.name) parts.push(selectedStore.name);
    return parts.length > 0 ? parts.join(" · ") : "Choose delivery area & store";
  }, [serviceArea, selectedStore]);

  useEffect(() => {
    if (mdUp) {
      setMobileExpanded(false);
    }
  }, [mdUp]);

  const confirmChange = useCallback(async () => {
    if (!pendingChange) return;
    const action = pendingChange;
    if (items.length > 0) {
      await clearCart();
    }
    switch (action.kind) {
      case "store":
        selectStore(action.storeId);
        break;
      case "country":
        void serviceArea?.setCountry(action.countryId);
        break;
      case "subdivision":
        void serviceArea?.setSubdivision(action.subdivisionId);
        break;
      case "locality":
        void serviceArea?.setLocality(action.localityId);
        break;
    }
    setPendingChange(null);
  }, [clearCart, pendingChange, items.length, selectStore, serviceArea]);

  const cancelChange = useCallback(() => {
    setPendingChange(null);
  }, []);

  const onPickerCountryChange = useCallback(
    (countryId: string) => {
      if (items.length > 0) setPendingChange({ kind: "country", countryId });
      else void serviceArea?.setCountry(countryId);
    },
    [items.length, serviceArea],
  );

  const onPickerSubdivisionChange = useCallback(
    (subdivisionId: string) => {
      if (items.length > 0) setPendingChange({ kind: "subdivision", subdivisionId });
      else void serviceArea?.setSubdivision(subdivisionId);
    },
    [items.length, serviceArea],
  );

  const onPickerLocalityChange = useCallback(
    (localityId: string | null) => {
      if (items.length > 0) setPendingChange({ kind: "locality", localityId });
      else void serviceArea?.setLocality(localityId);
    },
    [items.length, serviceArea],
  );

  const onPickerStorePick = useCallback(
    (storeId: string) => {
      if (storeId === selectedStore?.id) return;
      if (items.length > 0) setPendingChange({ kind: "store", storeId });
      else selectStore(storeId);
    },
    [items.length, selectedStore?.id, selectStore],
  );

  if (!features.multiStore) return null;
  if (isLoading) {
    return (
      <div className="inline-flex h-8 w-44 max-w-full animate-pulse items-center rounded-md bg-muted" />
    );
  }

  if (!serviceArea && stores.length === 0) {
    return (
      <div
        className="rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-xs leading-snug text-muted-foreground"
        role="status"
      >
        <p className="font-medium text-foreground">Location selection unavailable</p>
        <p className="mt-0.5">
          We couldn't load delivery areas or stores. Refresh the page, or try again shortly.
        </p>
      </div>
    );
  }

  return (
    <>
      {!mdUp ? (
        <button
          type="button"
          onClick={() => setMobileExpanded((v) => !v)}
          className="flex w-full items-center justify-between gap-2 rounded-md border border-border bg-muted/40 px-3 py-2 text-left text-sm text-foreground shadow-sm transition hover:bg-muted/60"
          aria-expanded={mobileExpanded}
        >
          <span className="flex min-w-0 items-center gap-2">
            <svg
              viewBox="0 0 20 20"
              className="h-4 w-4 shrink-0 text-muted-foreground"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M10 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M3.5 8.2c1.5-3 4.5-4.7 6.5-4.7s5 1.7 6.5 4.7c1.6 3.1 1.6 7.5 0 10.6-1.5 3-4.5 4.7-6.5 4.7s-5-1.7-6.5-4.7c-1.6-3.1-1.6-7.5 0-10.6Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            <span className="truncate font-medium">{summaryLine}</span>
          </span>
          <svg
            viewBox="0 0 20 20"
            className={`h-4 w-4 shrink-0 text-muted-foreground transition ${mobileExpanded ? "rotate-180" : ""}`}
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6 8l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ) : null}

      <div
        className={`flex max-w-full flex-col gap-2 sm:flex-row sm:items-start sm:gap-3 sm:justify-between ${!mdUp && !mobileExpanded ? "hidden" : ""} ${!mdUp && mobileExpanded ? "mt-2 border-t border-border pt-2" : ""}`}
      >
        <StoreDeliveryPicker
          idPrefix="bs-geo"
          layout="spacious"
          onCountryChange={onPickerCountryChange}
          onSubdivisionChange={onPickerSubdivisionChange}
          onLocalityChange={onPickerLocalityChange}
          onStorePick={onPickerStorePick}
        />
      </div>

      <Dialog open={pendingChange !== null} onClose={cancelChange} className="relative z-110">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-xl">
            <DialogTitle className="text-base font-semibold text-foreground">
              {pendingChange?.kind === "store" ? "Change Store?" : "Change delivery area?"}
            </DialogTitle>
            <p className="mt-2 text-sm text-muted-foreground">
              {pendingChange?.kind === "store"
                ? "Switching to a different store will clear your current cart"
                : "Changing your delivery area will clear your current cart"}{" "}
              ({items.length} {items.length === 1 ? "item" : "items"}). This cannot be undone.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={cancelChange}
                className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium transition hover:bg-muted"
              >
                Keep Current
              </button>
              <button
                type="button"
                onClick={() => void confirmChange()}
                className="flex-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
              >
                {pendingChange?.kind === "store" ? "Change Store" : "Change area"}
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
