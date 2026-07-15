import { expect, test } from "@playwright/test";

async function reachReflection(page: import("@playwright/test").Page) {
  await page.goto("/journey");
  await page.getByRole("button", { name: "Find a peer advisor" }).click();
  await expect(page.getByText("Match found")).toBeVisible();
  await page.getByRole("button", { name: /Accept private match/ }).click();
  await expect(page.getByRole("region", { name: "Private conversation" })).toBeVisible();
  await page.getByRole("button", { name: "End session" }).click();
  await page.getByRole("button", { name: "End and reflect" }).click();
  await expect(page.getByRole("heading", { name: "Did this conversation help you?" })).toBeVisible();
}

async function completePositiveReflection(page: import("@playwright/test").Page, considerSharing = true) {
  await page.getByRole("button", { name: /Yes I’m leaving/ }).click();
  await page.getByRole("radio", { name: /4 Very useful/ }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: /Possibly The takeaway/ }).click();
  await page.getByRole("button", { name: considerSharing ? /Show me the details/ : /Keep it private/ }).click();
  await page.getByRole("button", { name: "Seal my reflection" }).click();
  await expect(page.getByRole("heading", { name: "Both people have responded." })).toBeVisible();
}

test("seeker can reach private reflection", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Real conversations first/ })).toBeVisible();
  await page.getByRole("link", { name: "Find common ground" }).click();
  await expect(page.getByRole("heading", { name: /Come as you are/ })).toBeVisible();
  await page.getByRole("button", { name: "Find a peer advisor" }).click();
  await expect(page.getByText("Match found")).toBeVisible();
  await page.getByRole("button", { name: /Accept private match/ }).click();
  await expect(page.getByRole("region", { name: "Private conversation" })).toBeVisible();
  await page.getByLabel("Message Ember 42").fill("I can test one small project before making a permanent choice.");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByText("I can test one small project before making a permanent choice.")).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("chat.png"), fullPage: true });
  await page.getByRole("button", { name: "End session" }).click();
  await page.getByRole("button", { name: "End and reflect" }).click();
  await expect(page.getByRole("heading", { name: "Did this conversation help you?" })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("reflection.png"), fullPage: true });
});

test("landing remains usable on mobile", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Mobile project only");
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Real conversations first/ })).toBeVisible();
  await page.getByRole("link", { name: "Find common ground" }).scrollIntoViewIfNeeded();
  await expect(page.getByRole("link", { name: "Find common ground" })).toBeVisible();
});

test("mutual consent creates a versioned candidate and withdrawal blocks it", async ({ page }) => {
  await reachReflection(page);
  await completePositiveReflection(page);
  await page.getByRole("button", { name: /Review the separate consent details/ }).click();

  await page.getByRole("button", { name: /Set my boundaries/ }).click();
  await page.getByRole("button", { name: /Selected helpful moments/ }).click();
  await page.getByRole("button", { name: /Human\/rules only/ }).click();
  await page.getByRole("button", { name: /Check my understanding/ }).click();
  await page.getByRole("checkbox", { name: /I understand this does not publish anything/ }).check();
  await page.getByRole("button", { name: /Grant transformation consent/ }).click();

  await expect(page.getByRole("heading", { name: /Private detail out/ })).toBeVisible();
  await page.getByRole("button", { name: /Approve version 1/ }).click();
  await page.getByRole("tab", { name: /Safe preview/ }).click();
  await page.getByRole("button", { name: /Request this redaction/ }).click();
  await expect(page.getByText("A new version was created. Any earlier approval was invalidated.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Both people must approve version 2" })).toBeVisible();

  await page.getByRole("button", { name: /Approve version 2/ }).click();
  await expect(page.getByRole("button", { name: /Create content candidate/ })).toBeVisible();
  await page.getByRole("button", { name: /Create content candidate/ }).click();
  await expect(page.getByText("Sanitized v2", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: /Withdraw consent/ }).click();
  await page.getByRole("button", { name: "Withdraw now" }).click();
  await expect(page.getByText("Publication and production are on hold.")).toBeVisible();
  await expect(page.getByRole("button", { name: /Play storyboard/ })).toBeDisabled();
});

test("declining transformation ends privately", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Supplemental state test runs once");
  await reachReflection(page);
  await completePositiveReflection(page);
  await page.getByRole("button", { name: /Review the separate consent details/ }).click();
  await page.getByRole("button", { name: /No, keep it private/ }).click();
  await expect(page.getByRole("heading", { name: "The conversation stays private." })).toBeVisible();
});

test("a one-sided value outcome cannot advance to consent", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Supplemental gate test runs once");
  await reachReflection(page);
  await page.getByRole("button", { name: /No It did not help/ }).click();
  await page.getByRole("radio", { name: /2 A little/ }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: /Possibly The takeaway/ }).click();
  await page.getByRole("button", { name: /Show me the details/ }).click();
  await page.getByRole("button", { name: "Seal my reflection" }).click();
  await expect(page.getByText("The reuse gate is closed and the conversation will stay private.")).toBeVisible();
  await page.getByRole("button", { name: /Finish privately/ }).click();
  await expect(page.getByRole("heading", { name: "The conversation stays private." })).toBeVisible();
});

test("advisor onboarding reaches an anonymous seeker match", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Supplemental role test runs once");
  await page.goto("/journey?role=advisor");
  await page.getByRole("button", { name: "Enter advisor matching" }).click();
  await expect(page.getByText("Anonymous seeker")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Moss 28" })).toBeVisible();
});

test("match reporting and conversation blocking are private", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Supplemental safety test runs once");
  await page.goto("/journey");
  await page.getByRole("button", { name: "Find a peer advisor" }).click();
  await expect(page.getByText("Match found")).toBeVisible();
  await page.getByRole("button", { name: /Report this match/ }).click();
  await expect(page.getByRole("heading", { name: "We removed that match." })).toBeVisible();
  await page.getByRole("button", { name: "Find another match" }).click();
  await expect(page.getByText("Match found")).toBeVisible();
  await page.getByRole("button", { name: /Accept private match/ }).click();
  await page.getByRole("button", { name: "Conversation safety options" }).click();
  await page.getByRole("button", { name: /Block Ember 42/ }).click();
  await expect(page.getByText("Ember 42 is blocked. This room can no longer reconnect.")).toBeVisible();
});

test("research operator can record candidate status, time, and cost", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Supplemental operations test runs once");
  await page.goto("/research");
  await page.getByLabel("Status for Turn a high-stakes decision into a small experiment").selectOption("published");
  await page.getByLabel("Manual editing minutes for Turn a high-stakes decision into a small experiment").fill("95");
  await page.getByLabel("Production cost for Turn a high-stakes decision into a small experiment").fill("12.50");
  await expect(page.getByText("Prototype operation recorded locally.")).toBeVisible();
});
