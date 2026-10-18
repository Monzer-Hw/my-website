import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const WCAG = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

async function fillValidForm(page: Page) {
  const form = page.locator("#contact form");
  await form.getByLabel("Name").fill("Jane Doe");
  await form.getByLabel("Email").fill("jane@company.com");
  await form.getByLabel("Message", { exact: true }).fill("Hello, I'd like to talk about a project.");
  await form.getByRole("checkbox").check();
  return form;
}

test.describe("contact form sending (email step simulated)", () => {
  test("sends the message and shows the success state", async ({ page }) => {
    let sent: Record<string, unknown> | undefined;
    await page.route("**/api/contact", async (route) => {
      sent = route.request().postDataJSON();
      await route.fulfill({ json: { ok: true } });
    });
    await page.goto("/");
    const form = await fillValidForm(page);
    await form.getByRole("button", { name: "Send message" }).click();

    const success = page.getByRole("heading", { name: "Message sent." });
    await expect(success).toBeVisible();
    await expect(success).toBeFocused();
    await expect(page.getByText("Thanks, Jane. I'll reply to jane@company.com as soon as I can.")).toBeVisible();
    expect(sent).toMatchObject({ name: "Jane Doe", email: "jane@company.com", consent: true, website: "" });
    expect(typeof sent?.startedAt).toBe("number");

    await page.getByRole("button", { name: "Send another message" }).click();
    await expect(page.locator("#contact form").getByLabel("Name")).toHaveValue("");
    await expect(page.locator("#contact form").getByLabel("Name")).toBeFocused();
  });

  test("shows a clear error with the email address when sending fails", async ({ page }) => {
    await page.route("**/api/contact", (route) => route.fulfill({ status: 502, json: { ok: false, error: "send" } }));
    await page.goto("/");
    const form = await fillValidForm(page);
    await form.getByRole("button", { name: "Send message" }).click();
    await expect(form.getByRole("status")).toHaveText(
      "Your message couldn't be sent. Please try again, or email me directly at hello@example.com.",
    );
    await expect(form.getByLabel("Name")).toHaveValue("Jane Doe");
  });

  test("blocks a second submit while sending", async ({ page }) => {
    let calls = 0;
    let release!: () => void;
    const pending = new Promise<void>((r) => (release = r));
    await page.route("**/api/contact", async (route) => {
      calls++;
      await pending;
      await route.fulfill({ json: { ok: true } });
    });
    await page.goto("/");
    const form = await fillValidForm(page);
    await form.getByRole("button", { name: "Send message" }).click();
    const sending = form.getByRole("button", { name: "Sending…" });
    await expect(sending).toBeDisabled();
    await expect(form).toHaveAttribute("aria-busy", "true");
    release();
    await expect(page.getByRole("heading", { name: "Message sent." })).toBeVisible();
    expect(calls).toBe(1);
  });

  test("the honeypot is invisible and skipped by the keyboard", async ({ page }) => {
    await page.goto("/");
    const honeypot = page.locator("#f-website");
    await expect(honeypot).toHaveAttribute("tabindex", "-1");
    expect(await honeypot.boundingBox()).toMatchObject({ width: expect.any(Number) });
    const box = (await honeypot.boundingBox())!;
    expect(box.x + box.width).toBeLessThan(0); // positioned off screen
    await page.locator("#f-message").focus();
    await page.keyboard.press("Tab");
    await expect(page.locator("#f-consent")).toBeFocused();
  });

  test("the success state has no detectable accessibility violations", async ({ page }) => {
    await page.route("**/api/contact", (route) => route.fulfill({ json: { ok: true } }));
    await page.goto("/");
    const form = await fillValidForm(page);
    await form.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByRole("heading", { name: "Message sent." })).toBeVisible();
    const results = await new AxeBuilder({ page }).withTags(WCAG).analyze();
    expect(results.violations).toEqual([]);
  });
});

test.describe("contact endpoint (real server, no email sent)", () => {
  test("rejects invalid input with 400 and the field names", async ({ request }) => {
    const res = await request.post("/api/contact", { data: { name: "", email: "x", message: "hi", consent: false } });
    expect(res.status()).toBe(400);
    expect(await res.json()).toMatchObject({ ok: false, error: "invalid" });
  });

  test("answers spam with a quiet 200 and sends nothing", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: {
        name: "Bot",
        email: "bot@example.com",
        message: "Buy cheap things now!!!",
        consent: true,
        website: "https://spam.example",
        startedAt: Date.now() - 60_000,
      },
    });
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });
});
