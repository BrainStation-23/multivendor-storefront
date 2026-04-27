"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";

type LocaleSwitcherProps = {
  locale: string;
  /** Distinct ids when multiple switchers exist (header, footer, mobile). */
  dataTestId?: string;
  /** When false, show a globe icon instead of the "Locale" label (e.g. preferences menu). */
  showLabel?: boolean;
  /** Stretch the select to the container width. */
  fullWidth?: boolean;
};

const SUPPORTED_LOCALES = ["en", "bn"] as const;

function GlobeIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3 10h14M10 3c2.8 3.5 2.8 10.5 0 14M10 3c-2.8 3.5-2.8 10.5 0 14"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function LocaleSwitcher({
  locale,
  dataTestId = "locale-switcher",
  showLabel = true,
  fullWidth = false,
}: LocaleSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const currentLocale = useMemo(
    () => (SUPPORTED_LOCALES.includes(locale as "en" | "bn") ? locale : "en"),
    [locale],
  );

  function onLocaleChange(nextLocale: string) {
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length === 0) {
      router.push(`/${nextLocale}`);
      return;
    }

    if (SUPPORTED_LOCALES.includes(segments[0] as "en" | "bn")) {
      segments[0] = nextLocale;
    } else {
      segments.unshift(nextLocale);
    }

    router.push(`/${segments.join("/")}`);
  }

  return (
    <label
      className={`items-center gap-2 text-xs text-muted-foreground sm:text-sm ${fullWidth ? "flex w-full min-w-0" : "inline-flex"}`}
    >
      {showLabel ? (
        <span>Locale</span>
      ) : fullWidth ? (
        <>
          <span className="sr-only">Language</span>
          <span
            className="flex h-9 w-5 shrink-0 items-center justify-center text-muted-foreground"
            aria-hidden
          >
            <GlobeIcon />
          </span>
        </>
      ) : (
        <>
          <span className="sr-only">Language</span>
          <span className="text-foreground" aria-hidden>
            <GlobeIcon />
          </span>
        </>
      )}
      <select
        data-testid={dataTestId}
        value={currentLocale}
        onChange={(event) => onLocaleChange(event.target.value)}
        className={`h-9 rounded-md border border-border bg-card py-1 pl-2 pr-8 text-xs font-medium uppercase text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring sm:text-sm ${fullWidth ? "min-w-0 flex-1" : "max-w-36"}`}
        aria-label="Switch locale"
      >
        <option value="en">EN</option>
        <option value="bn">BN</option>
      </select>
    </label>
  );
}
