"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";

type HeaderPreferencesMenuProps = {
  locale: string;
  dataTestId?: string;
};

function GearIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M15.2 10a5.2 5.2 0 0 0 .06-.8l1.8-1.4a.5.5 0 0 0 .12-.64l-1.7-2.95a.5.5 0 0 0-.6-.22l-2.12.85a5.3 5.3 0 0 0-1.38-.8l-.32-2.25A.5.5 0 0 0 10.3 1h-3.4a.5.5 0 0 0-.49.42l-.32 2.25c-.48.2-.93.47-1.38.8l-2.12-.85a.5.5 0 0 0-.6.22L.4 6.21a.5.5 0 0 0 .12.64l1.8 1.4c0 .27-.04.53-.06.8l-1.8 1.4a.5.5 0 0 0-.12.64l1.7 2.95a.5.5 0 0 0 .6.22l2.12-.85c.45.33.9.6 1.38.8l.32 2.25a.5.5 0 0 0 .49.42h3.4a.5.5 0 0 0 .49-.42l.32-2.25c.48-.2.93-.47 1.38-.8l2.12.85a.5.5 0 0 0 .6-.22l1.7-2.95a.5.5 0 0 0-.12-.64l-1.8-1.4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Language + appearance in one place (replaces inline locale/theme in the header row).
 */
export function HeaderPreferencesMenu({
  locale,
  dataTestId = "header-preferences",
}: HeaderPreferencesMenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          data-testid={dataTestId}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Settings and preferences"
          title="Language and theme"
        >
          <GearIcon />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 min-w-[min(280px,calc(100vw-2rem))] rounded-md border border-border bg-card p-3 shadow-lg outline-none"
          sideOffset={6}
          align="end"
          collisionPadding={12}
        >
          <p className="mb-3 border-b border-border pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Preferences
          </p>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Appearance
              </p>
              <ThemeSwitcher idPrefix="header-pref" fullWidth />
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Language
              </p>
              <LocaleSwitcher
                locale={locale}
                dataTestId="locale-switcher-header-pref"
                showLabel={false}
                fullWidth
              />
            </div>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
