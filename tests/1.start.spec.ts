import { test, expect } from "@playwright/test";

test.describe("Setup", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Page Title and Header", async ({ page }) => {
    await expect(page).toHaveTitle(/IT3049C Chat/i);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/IT3049C Chat/i);
  });

  test("Page should have all the expected styles", async ({ page }) => {
    const expectedStyles = [
      "/resources/vendor/bootstrap.min.css",
      "/resources/vendor/fontawesome-free/css/all.min.css",
      "/resources/css/styles.css"
    ];
    const styles = await page.$$eval("link[rel='stylesheet']", els => els.map(el => new URL((el as HTMLLinkElement).href).pathname));
    await expect(styles).toEqual(expect.arrayContaining(expectedStyles));
  });

  test("Page should have all the expected scripts", async ({ page }) => {
    const expectedScripts = [
      "/resources/vendor/bootstrap.min.js",
      "/resources/vendor/jquery-3.5.1.slim.min.js",
      "/resources/js/index.js"
    ];
    const scripts = await page.$$eval("script", els => els.map(el => new URL(el.src).pathname).filter(Boolean));
    await expect(scripts).toEqual(expect.arrayContaining(expectedScripts));
  });

  test("Chat input and send button exist", async ({ page }) => {
    // Wait for page to be fully loaded and elements to be ready
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator("#my-name-input")).toBeVisible();
    await expect(page.locator("#my-message-input")).toBeVisible();
    await expect(page.locator("#send-button")).toBeVisible();
  });

  test("Chat messages are displayed", async ({ page }) => {
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    const chatBox = page.locator("#chat");
    await expect(chatBox).not.toBeEmpty();
  });

  test("Sending a message updates the chat", async ({ page }) => {
    await page.fill("#my-name-input", "TestUser");
    await page.fill("#my-message-input", "Hello Playwright!");
    await page.click("#send-button");

    // Wait for the message to appear in the chat
    const lastMessage = page.locator("#chat .mine .message").last();
    await expect(lastMessage).toBeVisible();
    await expect(lastMessage).toContainText("Hello Playwright!");
  });
});
