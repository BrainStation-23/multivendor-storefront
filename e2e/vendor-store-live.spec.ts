/**
 * P1 marketplace E2E: vendor directory and store pages (MV API + demo seed).
 * Requires seeded multivendor data including vendor profiles and multiple tenants.
 */
import { test, expect } from "@playwright/test";
import {
  apiOrigin,
  isBackendReachable,
  isDemoVendorSeeded,
  isFullVendorDemoSeeded,
} from "./helpers/live-backend";

let live = false;
let demoVendorOk = false;
let fullDemoOk = false;

test.describe("vendor marketplace (live API, MV)", () => {
  test.beforeAll(async () => {
    live = await isBackendReachable();
    if (live) {
      demoVendorOk = await isDemoVendorSeeded();
      fullDemoOk = await isFullVendorDemoSeeded();
    }
  });

  test.beforeEach(() => {
    test.skip(!live, `Backend not reachable at ${apiOrigin} — start MV backend or set PLAYWRIGHT_API_ORIGIN`);
  });

  test("vendors directory lists seeded demo vendor", async ({ page }) => {
    test.skip(
      !demoVendorOk,
      `No vendor profile for tenant slug demo-vendor-co — run node scripts/seed-frontend-demo.mjs with admin credentials (see script header).`,
    );
    await page.goto("/en/vendors");
    await expect(page.getByRole("heading", { name: "Vendors", level: 1 })).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByRole("link", { name: /Demo Vendor Co/i })).toBeVisible({
      timeout: 30_000,
    });
  });

  test("vendor store page shows profile and catalog", async ({ page }) => {
    test.skip(!demoVendorOk, "Requires demo vendor seed (demo-vendor-co vendor profile).");
    await page.goto("/en/store/demo-vendor-co");
    await expect(page.getByRole("heading", { name: "Demo Vendor Co.", level: 1 })).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByRole("heading", { name: "About Vendor", level: 2 })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByRole("heading", { name: "Products", level: 2 })).toBeVisible();
    await expect(page.getByRole("link", { name: "Demo Wireless Earbuds" }).first()).toBeVisible({
      timeout: 30_000,
    });
  });

  test("second vendor store shows home category products", async ({ page }) => {
    test.skip(!fullDemoOk, "Requires full demo seed (artisan-home-goods tenant + products).");
    await page.goto("/en/store/artisan-home-goods");
    await expect(page.getByRole("heading", { name: "Artisan Home Goods", level: 1 })).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByRole("link", { name: /Handmade Ceramic Vase Set/i }).first()).toBeVisible({
      timeout: 30_000,
    });
  });

  test("office category page lists seeded peripherals", async ({ page }) => {
    test.skip(!fullDemoOk, "Requires full demo seed (demo-office-gear category + products).");
    await page.goto("/en/categories/demo-office-gear");
    await expect(page.getByRole("heading", { name: "Demo Office Gear", level: 1 })).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByRole("link", { name: /Mechanical Keyboard/i }).first()).toBeVisible({
      timeout: 30_000,
    });
  });
});
