"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  IconClipboard,
  IconLogout,
  IconPackage,
  IconUser,
} from "@/components/layout/drawer-nav-icons";
import { HeaderPreferencesMenu } from "@/components/layout/header-preferences-menu";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { SearchBar } from "@/components/layout/search-bar";
import { StoreSelector } from "@/components/layout/store-selector";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { features } from "@/lib/config/features";
import { useAuth } from "@/lib/hooks/use-auth";
import { useCart } from "@/lib/hooks/use-cart";

export type NavItem = {
  label: string;
  href: string;
};

type NavbarProps = {
  locale: string;
  navItems: NavItem[];
};

export function Navbar({ locale, navItems }: NavbarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();

  const safeItems = useMemo(() => navItems.slice(0, 8), [navItems]);
  const cartCountLabel = itemCount > 99 ? "99+" : String(itemCount);

  const cartIcon = (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M3 4h1.2c.4 0 .75.28.84.67L5.4 6H16l-1.2 5.2a1 1 0 0 1-.98.8H7.2a1 1 0 0 1-.98-.8L4.5 4.7M8 16.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm7 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const trackIcon = (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M3.5 7.5h11l1.5 3.5v4H4v-7.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M3.5 7.5 5 4.5h11M8 4.5v3M14 4.5v3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );

  return (
    <>
      <div className="relative">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-3 sm:gap-3 sm:px-6 lg:px-8">
        <div className="flex w-full min-w-0 flex-wrap items-center justify-between gap-3">
          <Link
            href={`/${locale}`}
            className="shrink-0 text-base font-semibold tracking-tight"
          >
            BS Commerce
          </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden min-w-0 items-center gap-3 text-sm md:flex"
        >
          {safeItems.map((item) => (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className="rounded-md px-2 py-1 transition hover:bg-muted"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden min-w-0 flex-1 flex-wrap items-center justify-end gap-x-2 gap-y-2 xl:flex">
          <div className="min-w-0 max-w-sm flex-1 basis-56">
            <SearchBar locale={locale} />
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <Link
              href={`/${locale}/track-order`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground"
              aria-label="Track order"
              title="Track order"
            >
              {trackIcon}
            </Link>
            <Link
              href={`/${locale}/cart`}
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground"
              aria-label={`Shopping cart, ${itemCount} items`}
              title={`Cart (${itemCount})`}
            >
              {cartIcon}
              <span className="absolute -right-1 -top-1 inline-flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium leading-4 text-primary-foreground">
                {cartCountLabel}
              </span>
            </Link>
            <HeaderPreferencesMenu locale={locale} />
            {isAuthenticated ? (
              <>
                <Link
                  href={`/${locale}/account`}
                  className="rounded-md border border-border px-3 py-2 text-sm font-medium leading-none"
                >
                  Account
                </Link>
                <button
                  type="button"
                  onClick={() => void logout()}
                  className="rounded-md border border-border px-3 py-2 text-sm font-medium leading-none"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href={`/${locale}/auth/login`}
                  className="rounded-md border border-border px-3 py-2 text-sm font-medium leading-none"
                >
                  Login
                </Link>
                <Link
                  href={`/${locale}/auth/register`}
                  className="rounded-md bg-primary px-3 py-2 text-sm font-medium leading-none text-primary-foreground"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="hidden items-center gap-2 md:flex xl:hidden">
          <button
            type="button"
            onClick={() => setIsSearchExpanded((prev) => !prev)}
            className="inline-flex h-9 min-w-28 items-center gap-2 rounded-md border border-border px-2.5 text-sm text-muted-foreground"
            aria-expanded={isSearchExpanded}
            aria-label="Toggle search panel"
            title="Search"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
              <path
                d="M13.5 13.5L17 17M9 14a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span>Search</span>
          </button>

          <Link
            href={`/${locale}/cart`}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label={`Cart with ${itemCount} items`}
            title="Cart"
          >
            {cartIcon}
            <span className="absolute -right-1 -top-1 inline-flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium leading-4 text-primary-foreground">
              {cartCountLabel}
            </span>
          </Link>

          <Menu as="div" className="relative">
            <MenuButton
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border"
              aria-label="Profile options"
              title={isAuthenticated ? "Account options" : "Sign in options"}
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
                <path
                  d="M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5 6a5 5 0 0 1 10 0"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </MenuButton>
            <MenuItems className="absolute right-0 z-40 mt-2 w-56 rounded-md border border-border bg-card p-1 text-sm shadow-lg outline-none">
              {isAuthenticated ? (
                <>
                  <MenuItem>
                    <Link
                      href={`/${locale}/account`}
                      className="flex items-center gap-2 rounded px-2 py-1.5 hover:bg-muted"
                    >
                      <span className="text-muted-foreground" aria-hidden>
                        <IconUser className="h-4 w-4" />
                      </span>
                      Account
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      href={`/${locale}/account/orders`}
                      className="flex items-center gap-2 rounded px-2 py-1.5 hover:bg-muted"
                    >
                      <span className="text-muted-foreground" aria-hidden>
                        <IconClipboard className="h-4 w-4" />
                      </span>
                      My orders
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <button
                      type="button"
                      onClick={() => void logout()}
                      className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left hover:bg-muted"
                    >
                      <span className="text-muted-foreground" aria-hidden>
                        <IconLogout className="h-4 w-4" />
                      </span>
                      Log out
                    </button>
                  </MenuItem>
                </>
              ) : (
                <>
                  <MenuItem>
                    <Link
                      href={`/${locale}/auth/login`}
                      className="flex items-center gap-2 rounded px-2 py-1.5 hover:bg-muted"
                    >
                      <span className="text-muted-foreground" aria-hidden>
                        <IconUser className="h-4 w-4" />
                      </span>
                      Log in
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      href={`/${locale}/auth/register`}
                      className="flex items-center gap-2 rounded px-2 py-1.5 hover:bg-muted"
                    >
                      <span className="text-muted-foreground" aria-hidden>
                        <IconUser className="h-4 w-4" />
                      </span>
                      Register
                    </Link>
                  </MenuItem>
                </>
              )}
              <div className="my-1 border-t border-border" />
              <MenuItem>
                <Link
                  href={`/${locale}/track-order`}
                  className="flex items-center gap-2 rounded px-2 py-1.5 hover:bg-muted"
                >
                  <span className="text-muted-foreground" aria-hidden>
                    <IconPackage className="h-4 w-4" />
                  </span>
                  Track order
                </Link>
              </MenuItem>
              <div className="my-1 border-t border-border" />
              <div className="px-2 py-2">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  Preferences
                </p>
                <div className="flex flex-col gap-2">
                  <ThemeSwitcher idPrefix="header-tablet" fullWidth />
                  <LocaleSwitcher
                    locale={locale}
                    dataTestId="locale-switcher-header-tablet"
                    showLabel={false}
                    fullWidth
                  />
                </div>
              </div>
            </MenuItems>
          </Menu>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setIsSearchExpanded((prev) => !prev)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border"
            aria-expanded={isSearchExpanded}
            aria-label="Toggle search panel"
            title="Search"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
              <path
                d="M13.5 13.5L17 17M9 14a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <Link
            href={`/${locale}/cart`}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label={`Cart with ${itemCount} items`}
            title="Cart"
          >
            {cartIcon}
            <span className="absolute -right-1 -top-1 inline-flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium leading-4 text-primary-foreground">
              {cartCountLabel}
            </span>
          </Link>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border"
            onClick={() => setIsMobileOpen(true)}
            aria-label="Open navigation menu"
            title="Menu"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
              <path
                d="M3 5.5h14M3 10h14M3 14.5h14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <button
          type="button"
          className="hidden rounded-md border border-border px-3 py-1.5 text-sm md:hidden"
          onClick={() => setIsMobileOpen(true)}
          aria-label="Open navigation menu"
        >
          Menu
        </button>
        </div>
        {features.multiStore ? (
          <div className="min-w-0 border-t border-border/60 pt-2 sm:pt-3">
            <StoreSelector />
          </div>
        ) : null}
        </div>

        {isSearchExpanded ? (
          <div className="absolute inset-x-0 top-full z-40 md:hidden">
            <div className="mx-auto w-full max-w-7xl px-4 pt-2 sm:px-6 lg:px-8">
              <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <SearchBar
                    locale={locale}
                    focusOnMount
                    onSearchComplete={() => setIsSearchExpanded(false)}
                  />
                  <button
                    type="button"
                    onClick={() => setIsSearchExpanded(false)}
                    className="rounded-md border border-border px-2 py-2 text-xs"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {isSearchExpanded ? (
          <div className="absolute inset-x-0 top-full z-40 hidden md:block xl:hidden">
            <div className="mx-auto w-full max-w-7xl px-4 pt-2 sm:px-6 lg:px-8">
              <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <SearchBar
                    locale={locale}
                    focusOnMount
                    onSearchComplete={() => setIsSearchExpanded(false)}
                  />
                  <button
                    type="button"
                    onClick={() => setIsSearchExpanded(false)}
                    className="rounded-md border border-border px-2 py-2 text-xs"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <MobileMenu
        locale={locale}
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        navItems={safeItems}
        cartCount={itemCount}
      />
    </>
  );
}
