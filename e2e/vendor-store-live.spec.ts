/**
 * P1 marketplace E2E: vendor directory and store pages (MV API + demo seed).
 * Requires seeded multivendor data including vendor profiles and multiple tenants.
 */
import { test, expect } from "@playwright/test";
import { apiOrigin, isBackendReachable } from "./helpers/live-backend";

let live = false;

test.describe("vendor marketplace (live API, MV)", () => {
  test.beforeAll(async () => {
    live = await isBackendReachable();
  });

  test.beforeEach(() => {
    test.skip(!live, `Backend not reachable at ${apiOrigin} — start MV backend or set PLAYWRIGHT_API_ORIGIN`);
  });

  test("vendors directory lists seeded demo vendor", async ({ page }) => {
    await page.goto("/en/vendors");
    await expect(page.getByRole("heading", { name: "Vendors", level: 1 })).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByRole("link", { name: /Demo Vendor Co/i })).toBeVisible({
      timeout: 30_000,
    });
  });

  test("vendor store page shows profile and catalog", async ({ page }) => {
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
    await page.goto("/en/store/artisan-home-goods");
    await expect(page.getByRole("heading", { name: "Artisan Home Goods", level: 1 })).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByRole("link", { name: /Handmade Ceramic Vase Set/i }).first()).toBeVisible({
      timeout: 30_000,
    });
  });

  test("office category page lists seeded peripherals", async ({ page }) => {
    await page.goto("/en/categories/demo-office-gear");
    await expect(page.getByRole("heading", { name: "Demo Office Gear", level: 1 })).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByRole("link", { name: /Mechanical Keyboard/i }).first()).toBeVisible({
      timeout: 30_000,
    });
  });
});
