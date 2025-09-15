import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

test.describe("Controller", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("sending a message adds it to the chat div", async ({ page }) => {
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    const testerName = faker.person.firstName();
    const randomMessage = faker.lorem.sentence();

    console.log("Generated Name:", testerName);
    console.log("Generated Message:", randomMessage);

    await page.route("**/messages", async (route) => {
      const request = route.request();

      try {
        if (request.method() === "POST") {
          const postData = JSON.parse(request.postData() || "{}");
          console.log("POST Request Data:", postData);
          
          expect(postData).toMatchObject({
            sender: testerName,
            text: randomMessage,
            timestamp: expect.any(String)
          });

          await route.fulfill({ status: 201, body: "{}" });
        } 
        
        if (request.method() === "GET") {
          console.log("Intercepted GET request");
          
          await route.fulfill({
            status: 200,
            contentType: "application/json; charset=utf-8",
            body: JSON.stringify([
              {
                id: 1,
                sender: "Yahya Gilany",
                text: "You made it, my friend!",
                timestamp: new Date().toISOString(),
              },
              {
                sender: testerName,
                text: randomMessage,
                timestamp: new Date().toISOString(),
                id: 2,
              },
            ]),
          });
        }
      } catch (error) {
        console.error("Route handling error:", error);
        await route.fulfill({ status: 500, body: "Internal Server Error" });
      }
    });

    const nameField = page.locator("#my-name-input");
    const messageField = page.locator("#my-message-input");
    const sendButton = page.locator("#send-button");

    await nameField.fill(testerName);
    await messageField.fill(randomMessage);
    
    // Wait for the response before clicking send
    const responsePromise = page.waitForResponse((res) => 
      res.url().includes("/messages") && res.status() === 200
    );
    
    await sendButton.click();
    console.log("Clicked send button");

    // Wait for the response to complete
    const response = await responsePromise;
    console.log("Received Response:", await response.json());

    // Wait for the message to appear in the chat UI with retry logic
    const messagesDiv = page.locator("#chat");
    
    // Wait for the message to be visible and contain the expected text
    await expect(messagesDiv).toContainText(randomMessage, { timeout: 10000 });
    
    // Additional verification that the message is properly formatted
    const messageElement = page.locator("#chat .mine .message").last();
    await expect(messageElement).toBeVisible();
    await expect(messageElement).toContainText(randomMessage);
  });
});