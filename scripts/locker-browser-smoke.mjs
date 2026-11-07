// Browser regression test for the STEEZ8 Locker, not merely a 200 response.
// Use the same public/static build that GitHub Pages deploys.
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";

const pkg = pathToFileURL("/tmp/steez8-playwright/node_modules/playwright/index.mjs").href;
const { chromium } = await import(pkg);
const browser = await chromium.launch({
  headless: true,
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-webgl", "--disable-dev-shm-usage"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const exceptions = [];
const badHttp = [];
page.on("pageerror", error => exceptions.push(error.stack || error.message));
page.on("console", message => {
  if (message.type() === "error") console.error("BROWSER CONSOLE:", message.text().slice(0, 1200));
});
page.on("response", response => {
  if (response.status() >= 400 && response.url().includes("/_next/static/chunks/"))
    badHttp.push(response.status() + " " + response.url());
});

try {
  console.log("Opening STEEZ8 with ?open=locker in headless Chromium");
  await page.goto(process.env.LOCKER_TEST_URL || "http://127.0.0.1:4173/?open=locker", {
    waitUntil: "domcontentloaded", timeout: 45000,
  });
  for (let step = 0; step < 35; step++) {
    if (await page.locator(".bc-locker-controls").count()) break;
    if (await page.getByRole("button", { name: /^locker$/i }).count()) {
      await page.getByRole("button", { name: /^locker$/i }).first().click().catch(() => {});
    }
    if (await page.getByText(/this page couldn.t load|application error|something went wrong|unexpected error/i).count()) break;
    await page.waitForTimeout(1000);
  }
  await page.waitForTimeout(1300);
  const body = await page.locator("body").innerText().catch(() => "");
  console.log("Body heading preview:", body.slice(0, 250).replace(/\s+/g, " "));
  console.log("Locker controls count:", await page.locator(".bc-locker-controls").count());
  console.log("Browser page errors:", exceptions.slice(0, 10));
  console.log("Failed chunk responses:", badHttp.slice(0, 10));
  await page.screenshot({ path: "/tmp/steez8-locker-smoke.png" }).catch(() => {});
  assert(!/this page couldn.t load|application error|something went wrong/i.test(body),
    "STE E Z 8 Locker rendered an application error boundary");
  assert.equal(badHttp.length, 0, "One or more game JavaScript chunks failed to load");
  assert.equal(exceptions.length, 0, "An uncaught browser JavaScript exception occurred");
  assert(await page.locator(".bc-locker-controls").count() > 0, "Locker controls did not render");
  console.log("PASS: Locker UI rendered without uncaught JavaScript exceptions.");
} finally {
  await browser.close();
}
