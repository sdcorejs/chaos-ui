import { expect, test, type Locator, type Page } from "@playwright/test";
import type { ChaosInfinityOtpElement } from "../../packages/chaos-ui/dist/infinity-otp.js";

// These tests record uninterrupted playback. Never seek animations or screenshot
// a locator: locator screenshots scroll the glove into view and hide the bug.
test.use({ video: "on" });

// The thumb pivots at its base: ~56° while pressed on the middle finger,
// negative while it flicks outward after the release.
const thumbAngle = (game: Locator) =>
  game.locator(".f-thumb").evaluate((el) => {
    const m = new DOMMatrix(getComputedStyle(el).transform);
    return (Math.atan2(m.b, m.a) * 180) / Math.PI;
  });

async function openInfinity(page: Page) {
  await page.goto("http://127.0.0.1:5173/");
  await page.getByRole("button", { name: /Infinity OTP/ }).first().click();
  const game = page.locator("chaos-infinity-otp-element");
  await game.locator("[data-slot]").first().focus();
  await page.keyboard.type("001122");
  await game.evaluate((el) => {
    el.dataset.submits = "0";
    el.dataset.changes = "0";
    el.dataset.nativeDrags = "0";
    el.addEventListener("submit", () => el.dataset.submits = String(Number(el.dataset.submits) + 1));
    el.addEventListener("change", () => el.dataset.changes = String(Number(el.dataset.changes) + 1));
    el.addEventListener("dragstart", (event) => {
      if (!event.defaultPrevented) el.dataset.nativeDrags = String(Number(el.dataset.nativeDrags) + 1);
    });
  });
  return game;
}

test("Infinity real submit and replay keep the moving fingertips inside the viewport", async ({ page, isMobile }, testInfo) => {
  await page.setViewportSize({ width: isMobile ? 412 : 900, height: 780 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const game = await openInfinity(page);
  const stage = game.locator(".stage");
  const submit = game.getByRole("button", { name: "Búng tay", exact: true });
  await submit.evaluate((el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
  expect((await stage.boundingBox())!.y).toBeLessThan(0);
  await submit.click();
  await expect(stage).toBeInViewport({ ratio: 0.99, timeout: 800 });
  await expect.poll(() => thumbAngle(game), { timeout: 1400, intervals: [30] }).toBeGreaterThan(45);
  await page.screenshot({ path: testInfo.outputPath("visible-contact.png") });
  await expect.poll(() => thumbAngle(game), { timeout: 1600, intervals: [20] }).toBeLessThan(-3);
  await expect(stage).toBeInViewport({ ratio: 0.99 });
  await page.screenshot({ path: testInfo.outputPath("visible-release.png") });
  await expect(game.locator(".board")).toHaveClass(/success/);
  const replay = game.getByRole("button", { name: "Xem lại cú búng" });
  await replay.evaluate((el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
  await replay.click();
  await expect(stage).toBeInViewport({ ratio: 0.99, timeout: 800 });
  await expect.poll(() => thumbAngle(game), { timeout: 1400, intervals: [30] }).toBeGreaterThan(45);
  await expect(game).toHaveAttribute("data-submits", "1");
  await expect(game).toHaveAttribute("data-changes", "0");
});

test("Infinity dragging an order label moves one stone without selecting a row of text", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const game = await openInfinity(page);
  await game.locator(".stage").scrollIntoViewIfNeeded();
  const start = (await game.locator(".order").first().boundingBox())!;
  const end = (await game.locator("[data-slot]").nth(3).boundingBox())!;
  await page.mouse.move(start.x + start.width / 2, start.y + start.height / 2);
  await page.mouse.down();
  await page.mouse.move(end.x + end.width / 2, end.y + end.height / 2, { steps: 16 });
  const preview = game.locator(".drag-stone");
  await expect(preview).toHaveText("0", { timeout: 600 });
  const box = (await preview.boundingBox())!;
  expect(box.width).toBeLessThanOrEqual(60);
  expect(box.height).toBeLessThanOrEqual(60);
  expect(await page.evaluate(() => getSelection()?.toString())).toBe("");
  await expect(game).toHaveAttribute("data-native-drags", "0");
  await page.screenshot({ path: testInfo.outputPath("single-stone-preview.png") });
  await page.mouse.up();
  await expect(preview).toHaveCount(0);
  expect(await game.evaluate((el: ChaosInfinityOtpElement) => el.slots)).toEqual(["1", "0", "1", "0", "2", "2"]);
  await expect(game).toHaveAttribute("data-changes", "1");
});

test("Infinity explicit motion opt-in overrides a reduced-motion system setting", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const game = await openInfinity(page);
  await expect(game.locator(".board")).toHaveClass(/no-motion/);
  await expect(page.getByText(/Thiết bị đang giảm chuyển động/)).toBeVisible();
  await page.getByRole("combobox", { name: "Chuyển động" }).selectOption("never");
  await expect(game.locator(".board")).not.toHaveClass(/no-motion/);
  await game.getByRole("button", { name: "Búng tay", exact: true }).click();
  await expect(game.locator(".board")).toHaveClass(/snapping/);
  await expect.poll(() => thumbAngle(game), { timeout: 1400, intervals: [30] }).toBeGreaterThan(45);
  await expect(game.locator(".stage")).toBeInViewport({ ratio: 0.99 });
  await page.getByRole("combobox", { name: "Chuyển động" }).selectOption("always");
  await expect(game.locator(".board")).toHaveClass(/no-motion/);
  await expect(game.locator(".board")).not.toHaveClass(/snapping/);
  await expect(game).toHaveAttribute("data-submits", "1");
  await expect(game).toHaveAttribute("data-changes", "0");
});

test("Infinity real touch drag cancels cleanly and then drops a single repeated digit", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Real touch input uses the mobile context");
  const game = await openInfinity(page);
  const source = game.getByRole("button", { name: "Lấy đá số 0", exact: true });
  await source.scrollIntoViewIfNeeded();
  const a = (await source.boundingBox())!;
  const b = (await game.locator("[data-slot]").last().boundingBox())!;
  const cdp = await page.context().newCDPSession(page);
  const point = (x: number, y: number) => ({ x, y, id: 7, radiusX: 4, radiusY: 4, force: 1 });
  const start = point(a.x + a.width / 2, a.y + a.height / 2);
  const end = point(b.x + b.width / 2, b.y + b.height / 2);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [start] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [end] });
  await expect(game.locator(".drag-stone")).toHaveText("0");
  await cdp.send("Input.dispatchTouchEvent", { type: "touchCancel", touchPoints: [] });
  await expect(game.locator(".drag-stone")).toHaveCount(0);
  await expect(game).toHaveAttribute("data-changes", "0");
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [start] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [end] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect(game.locator(".drag-stone")).toHaveCount(0);
  expect(await game.evaluate((el: ChaosInfinityOtpElement) => el.slots)).toEqual(["0", "0", "1", "1", "2", "0"]);
  await expect(game).toHaveAttribute("data-changes", "1");
  await cdp.detach();
});
