"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * Light / dark / system — drives `html.dark` via next-themes (see globals.css + theme files).
 */
function SunIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 1.5v2M10 16.5v2M3.5 10h-2M18.5 10h-2M4.6 4.6l-1.4-1.4M16.8 16.8l-1.4-1.4M4.6 15.4l-1.4 1.4M16.8 3.2l-1.4 1.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ThemeSwitcher({
  idPrefix = "theme",
  fullWidth = false,
}: {
  idPrefix?: string;
  fullWidth?: boolean;
}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`flex h-9 items-center gap-2 ${fullWidth ? "w-full" : "min-w-30"}`}
        aria-hidden
      >
        {fullWidth ? <span className="h-4 w-5 shrink-0 rounded bg-muted" /> : null}
        <div className={`h-9 flex-1 animate-pulse rounded-md bg-muted ${fullWidth ? "min-w-0" : ""}`} />
      </div>
    );
  }

  return (
    <label
      className={`items-center gap-2 text-xs text-muted-foreground ${fullWidth ? "flex w-full min-w-0" : "inline-flex"}`}
    >
      <span className="sr-only">Color theme</span>
      {fullWidth ? (
        <span
          className="flex h-9 w-5 shrink-0 items-center justify-center text-muted-foreground"
          aria-hidden
        >
          <SunIcon />
        </span>
      ) : null}
      <select
        id={`${idPrefix}-select`}
        value={theme ?? "system"}
        onChange={(e) => setTheme(e.target.value)}
        className={`h-9 rounded-md border border-border bg-card py-1 pl-2 pr-8 text-xs font-medium text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring ${fullWidth ? "min-w-0 flex-1" : "max-w-36"}`}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </label>
  );
}
