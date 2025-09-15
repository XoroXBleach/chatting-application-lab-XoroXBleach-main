import { test, expect } from "@playwright/test";

test.describe("Layout", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should have a jumbotron div with an h1", async ({ page }) => {
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    const jumbotron = page.locator(".jumbotron h1");
    await expect(jumbotron).toBeVisible();
    await expect(jumbotron).toContainText(/IT3049C Chat/);
    await expect(jumbotron).toHaveClass(/display-4/);
  });

  test("jumbotron includes an input field for the name", async ({ page }) => {
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    const input = page.locator(".jumbotron input#my-name-input");
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute("type", "text");
    await expect(input).toHaveClass(/form-control/);
  });

  test("page has a field for the message", async ({ page }) => {
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    const messageField = page.locator("#my-message-input");
    await expect(messageField).toBeVisible();
    await expect(messageField).toHaveAttribute("type", "text");
    await expect(messageField).toHaveClass(/form-control/);
  });
});
