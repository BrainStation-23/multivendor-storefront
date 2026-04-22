/** Inline icons for mobile drawer rows (stroke matches currentColor). */

export function IconHome(props: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={props.className ?? "h-5 w-5 shrink-0"} fill="none" aria-hidden="true">
      <path
        d="M3 8.5 10 3l7 5.5V17a1 1 0 0 1-1 1h-4v-5H8v5H4a1 1 0 0 1-1-1V8.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconShopping(props: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={props.className ?? "h-5 w-5 shrink-0"} fill="none" aria-hidden="true">
      <path
        d="M5 7h12l-1 8H6L5 7Zm2-3a3 3 0 0 1 6 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconGrid(props: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={props.className ?? "h-5 w-5 shrink-0"} fill="none" aria-hidden="true">
      <path
        d="M3.5 3.5h5v5h-5v-5Zm8 0h5v5h-5v-5Zm-8 8h5v5h-5v-5Zm8 0h5v5h-5v-5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconPackage(props: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={props.className ?? "h-5 w-5 shrink-0"} fill="none" aria-hidden="true">
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
}

export function IconCart(props: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={props.className ?? "h-5 w-5 shrink-0"} fill="none" aria-hidden="true">
      <path
        d="M3 4h1.2c.4 0 .75.28.84.67L5.4 6H16l-1.2 5.2a1 1 0 0 1-.98.8H7.2a1 1 0 0 1-.98-.8L4.5 4.7M8 16.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm7 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconUser(props: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={props.className ?? "h-5 w-5 shrink-0"} fill="none" aria-hidden="true">
      <path
        d="M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5 6a5 5 0 0 1 10 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconLogout(props: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={props.className ?? "h-5 w-5 shrink-0"} fill="none" aria-hidden="true">
      <path
        d="M7.5 14.5 3 10l4.5-4.5M3 10h10.5M11 3.5H16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconClipboard(props: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={props.className ?? "h-5 w-5 shrink-0"} fill="none" aria-hidden="true">
      <path
        d="M6.5 4h1a1.5 1.5 0 0 0 3 0h1A1.5 1.5 0 0 1 13 5.5V6H7v-.5A1.5 1.5 0 0 1 8.5 4Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M6 6h8v9a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Pick a reasonable icon from nav href (locale-prefixed paths). */
export function iconForNavHref(href: string) {
  const parts = href.split("/").filter(Boolean);
  const path = parts.slice(1).join("/");
  if (!path) return IconHome;
  if (path.startsWith("products")) return IconShopping;
  if (path.startsWith("categories")) return IconGrid;
  if (path.startsWith("vendors")) return IconShopping;
  return IconGrid;
}
