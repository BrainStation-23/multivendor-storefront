import { cache } from "react";
import { apiClient } from "./client";

type NextFetchOptions = {
  revalidate?: number;
  tags?: string[];
};

type GlobalRequestOptions = {
  next?: NextFetchOptions;
};

function buildGlobalPath(globalName: "header" | "footer", locale: string) {
  const params = new URLSearchParams({
    locale,
    depth: "1",
  });

  return `/globals/${globalName}?${params.toString()}`;
}

async function fetchHeader(
  locale: string,
  options: GlobalRequestOptions = {},
) {
  return apiClient<Record<string, unknown>>(buildGlobalPath("header", locale), {
    next: { revalidate: 60, ...options.next },
  } as RequestInit);
}

/** Deduplicate identical fetches in one RSC pass (e.g. layout + home both read globals). */
export const getHeader = cache(fetchHeader);

async function fetchFooter(
  locale: string,
  options: GlobalRequestOptions = {},
) {
  return apiClient<Record<string, unknown>>(buildGlobalPath("footer", locale), {
    next: { revalidate: 60, ...options.next },
  } as RequestInit);
}

export const getFooter = cache(fetchFooter);
