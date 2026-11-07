// Browser regression test for the STEEZ8 Locker, not merely a 200 response.
// Use the same public/static build that GitHub Pages deploys.
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";

const pkg = pathToFileURL("/tmp/steez8-playwright/node_modules/playwright/index.mjs").href;
const playwright = await import(pkg);
const browserName = process.env.LOCKER_TEST_BROWSER || "chromium";
const browserType = playwright[browserName];
assert(browserType, "Unsupported browser: " + browserName);
const browser = await browserType.launch({
  headless: true,
  ...(browserName === "chromium"
    ? { args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-webgl", "--disable-dev-shm-usage"] }
    : {}),
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await page.addInitScript(() => {
  window.__steez8GrabDebugEnabled = true;
  window.addEventListener("steez8:preview-grab", event => {
    window.__steez8LastPreviewEvent = event.detail;
  });
});
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
  if (process.env.LOCKER_TEST_SIGNED_IN === "1") {
    const backend = "http://127.0.0.1:4174";
    const email = browserName + "-locker-browser-smoke@example.test";
    const signup = await fetch(backend + "/auth/v1/signup", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password: "TemporaryLockerBrowserPass123", data: { handle: browserName === "webkit" ? "LockerWebKit" : "LockerChromium" } }),
    });
    if (signup.status !== 200) throw Error("Test account signup failed: " + signup.status + " " + await signup.text().catch(() => ""));
    const session = await signup.json();
    console.log("Test account created; starting authenticated Locker check.");
    await page.goto("http://127.0.0.1:4173/", { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForFunction(() => window.CORK7_SERVICES?.apiOrigin === "http://127.0.0.1:4174", { timeout: 15000 });
    const login = await page.evaluate(async tokens => {
      const mod = await import("/_next/static/chunks/supabase-BEhtaJUq.js");
      const result = await mod.t().auth.setSession({
        access_token: tokens.access_token, refresh_token: tokens.refresh_token,
      });
      return { error: result.error?.message, signedIn: !!result.data?.session };
    }, session);
    console.log("Signed-in browser state:", login);
    assert.equal(login.signedIn, true, "Login state was not established in browser: " + login.error);
  }
  console.log("Opening STEEZ8 with ?open=locker in headless " + browserName + "");
  await page.goto(process.env.LOCKER_TEST_URL || "http://127.0.0.1:4173/?open=locker&grabDebug=1", {
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
  // Enabling Grab Lab must never crash the Locker or hide its original controls.
  const lab = page.getByRole("button", { name: /custom grabs/i }).first();
  assert(await lab.count() > 0, "The Grab Lab button never mounted");
  console.log("Onboarding modal before grab test:", (await page.locator(".modal-backdrop").allInnerTexts()).map(t=>t.slice(0,180)));
  // Bypass a first-run onboarding modal in this interaction test; never alter
  // product code or pretend the modal is a Grab Lab failure.
  await lab.evaluate(element => element.click());
  await page.waitForTimeout(1600);
  assert.equal(await page.locator("body > .gl-root").count(), 1,
    "Grab Lab must use an isolated portal outside the React app");
  assert.equal(await page.locator(".bc-locker-controls .gl-bar").count(), 0,
    "Grab Lab must never change React-owned Locker controls");
  assert(await page.locator(".gl-panel").count() > 0, "Grab Lab panel failed to open");
  // These four styles were previously shallow overlays of Tail/Japan. Make
  // the real rider rig play each one, not merely render a selection card.
  const silhouettes = new Set();
  for (const [style, label] of [
    [4, "Blunt"], [5, "Rocket Air"], [6, "True Nose"], [7, "Back Scratcher"]
  ]) {
    const card = page.getByRole("button", { name: new RegExp(label, "i") }).first();
    assert(await card.count() > 0, label + " missing from Grab Lab");
    await card.evaluate(element => element.click());
    try {
      await page.waitForFunction(id => window.__steez8SignaturePose?.id === id, style, { timeout: 12000 });
    } catch (error) {
      console.log("SIGNATURE DEBUG", await page.evaluate(() => ({
        url: location.href,
        render: window.__steez8SignaturePose,
        animator: window.__steez8AnimatorTrace,
        status: document.querySelector(".bc-preview-status")?.textContent,
        canvases: [...document.querySelectorAll("canvas")].map(el => ({
          width: el.width, height: el.height, visible: !!el.getClientRects().length
        })),
        lastPreview: window.__steez8LastPreviewEvent,
        activeSlots: window.__steez8GrabActiveSlots,
        body: document.body?.innerText?.slice(0, 600),
      })));
      throw error;
    }
    await page.waitForTimeout(400);
    const actual = await page.evaluate(() => window.__steez8SignaturePose);
    assert(actual?.activeGrips >= 1, label + " did not reach the ski with its rig");
    assert(actual?.joints?.Leg_L && actual?.joints?.Knee_R,
      label + " did not pose the real skeletal legs");
    const signature = JSON.stringify([
      actual.joints.Leg_L, actual.joints.Leg_R,
      actual.joints.Knee_L, actual.joints.Knee_R,
      actual.joints.Foot_L, actual.joints.Foot_R
    ]);
    assert(!silhouettes.has(signature), label + " reuses another grab silhouette");
    silhouettes.add(signature);
    console.log("SIGNATURE RIG", label, "hands:", actual.activeGrips,
      "legs and skis:", signature.slice(0, 220));
  }
  assert.equal(silhouettes.size, 4, "Four distinct authored grab silhouettes required");
  console.log("Grab Lab selected and rendered:", await page.locator(".gl-panel").count());
  assert.equal(await page.locator("body > .gl-root").count(), 1, "Grab portal disappeared after selection");
  
  const body = await page.locator("body").innerText().catch(() => "");
  console.log("Body heading preview:", body.slice(0, 250).replace(/\s+/g, " "));
  console.log("Locker controls count:", await page.locator(".bc-locker-controls").count());
  console.log("Browser page errors:", exceptions.slice(0, 10));
  console.log("Failed chunk responses:", badHttp.slice(0, 10));
  await page.screenshot({ path: "/tmp/steez8-locker-smoke.png" }).catch(() => {});
  assert(!/this page couldn.t load|application error|something went wrong/i.test(body),
    "STE E Z 8 Locker rendered an application error boundary");
  assert.equal(badHttp.length, 0, "One or more game JavaScript chunks failed to load");
  assert.equal(exceptions.length, 0, "An uncaught browser JavaScript exception occurred: "+exceptions.join("\n"));
  assert(await page.locator(".bc-locker-controls").count() > 0, "Locker controls did not render");
  console.log("PASS: Locker UI rendered without uncaught JavaScript exceptions.");
} finally {
  await browser.close();
}
