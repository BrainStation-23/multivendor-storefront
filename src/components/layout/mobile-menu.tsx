"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { Fragment } from "react";
import {
  IconCart,
  IconClipboard,
  IconLogout,
  IconPackage,
  IconUser,
  iconForNavHref,
} from "@/components/layout/drawer-nav-icons";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { useAuth } from "@/lib/hooks/use-auth";

export type MobileNavItem = {
  label: string;
  href: string;
};

type MobileMenuProps = {
  locale: string;
  isOpen: boolean;
  onClose: () => void;
  navItems: MobileNavItem[];
  cartCount: number;
};

function DrawerRow({
  href,
  onClick,
  children,
  icon,
}: {
  href: string;
  onClick: () => void;
  children: ReactNode;
  icon: ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-md px-2 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
    >
      <span className="text-muted-foreground">{icon}</span>
      <span className="min-w-0 flex-1 break-words">{children}</span>
    </Link>
  );
}

export function MobileMenu({
  locale,
  isOpen,
  onClose,
  navItems,
  cartCount,
}: MobileMenuProps) {
  const { isAuthenticated, logout } = useAuth();

  async function handleLogout() {
    await logout();
    onClose();
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50 xl:hidden" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </TransitionChild>

        <div className="fixed inset-0 flex justify-end">
          <TransitionChild
            as={Fragment}
            enter="transform transition ease-out duration-200"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in duration-150"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <DialogPanel className="flex h-full max-h-dvh w-full max-w-xs flex-col bg-card shadow-xl outline-none">
              <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
                <p className="font-semibold text-foreground">Menu</p>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md border border-border px-2 py-1 text-sm"
                >
                  Close
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3">
                <nav aria-label="Mobile menu" className="flex flex-col gap-0.5">
                  {navItems.map((item) => {
                    const Icon = iconForNavHref(item.href);
                    return (
                      <DrawerRow
                        key={`${item.href}-${item.label}`}
                        href={item.href}
                        onClick={onClose}
                        icon={<Icon />}
                      >
                        {item.label}
                      </DrawerRow>
                    );
                  })}
                </nav>

                <div className="mt-6 border-t border-border pt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Shop
                  </p>
                  <div className="flex flex-col gap-0.5">
                    <DrawerRow
                      href={`/${locale}/cart`}
                      onClick={onClose}
                      icon={<IconCart />}
                    >
                      Cart ({cartCount})
                    </DrawerRow>
                    <DrawerRow
                      href={`/${locale}/track-order`}
                      onClick={onClose}
                      icon={<IconPackage />}
                    >
                      Track order
                    </DrawerRow>
                  </div>
                </div>

                <div className="mt-6 border-t border-border pt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Account
                  </p>
                  <div className="flex flex-col gap-0.5">
                    {isAuthenticated ? (
                      <>
                        <DrawerRow
                          href={`/${locale}/account`}
                          onClick={onClose}
                          icon={<IconUser />}
                        >
                          My account
                        </DrawerRow>
                        <DrawerRow
                          href={`/${locale}/account/orders`}
                          onClick={onClose}
                          icon={<IconClipboard />}
                        >
                          My orders
                        </DrawerRow>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-md px-2 py-2.5 text-left text-sm font-medium text-foreground transition hover:bg-muted"
                        >
                          <span className="text-muted-foreground">
                            <IconLogout />
                          </span>
                          Log out
                        </button>
                      </>
                    ) : (
                      <>
                        <DrawerRow
                          href={`/${locale}/auth/login`}
                          onClick={onClose}
                          icon={<IconUser />}
                        >
                          Log in
                        </DrawerRow>
                        <Link
                          href={`/${locale}/auth/register`}
                          onClick={onClose}
                          className="mt-1 flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground"
                        >
                          Create account
                        </Link>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-6 border-t border-border pt-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Preferences
                  </p>
                  <div className="space-y-4">
                    <div>
                      <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                        Appearance
                      </p>
                      <ThemeSwitcher idPrefix="menu" fullWidth />
                    </div>
                    <div>
                      <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                        Language
                      </p>
                      <LocaleSwitcher
                        locale={locale}
                        dataTestId="locale-switcher-menu"
                        showLabel={false}
                        fullWidth
                      />
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
