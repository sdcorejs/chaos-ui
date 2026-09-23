import { expect, test } from "@playwright/test";
import type {
  ChaosVolumeGymElement,
  VolumeChangeDetail,
  VolumeCommitDetail,
} from "../../packages/chaos-ui/dist/volume-gym.js";

test("React Volume Gym keeps slider, display and controlled value in sync", async ({
  page,
}) => {
  await page.goto("http://127.0.0.1:5174");
  const gym = page.locator("chaos-volume-gym-element").first();
  const slider = gym.getByRole("slider", { name: "Âm lượng" });
  await expect(slider).toHaveAttribute("aria-valuenow", "40");
  await gym.getByRole("button", { name: "Tăng âm lượng" }).click();
  await expect(slider).toHaveAttribute("aria-valuenow", "41");
  await expect(page.getByTestId("volume-value")).toHaveText("41");
  await expect(page.getByTestId("volume-changes")).toHaveText("1");
  await expect(page.getByTestId("volume-commits")).toHaveText("1");
  await page.getByRole("button", { name: "Set volume from app" }).click();
  await expect(slider).toHaveAttribute("aria-valuenow", "73");
  await expect(page.getByTestId("volume-changes")).toHaveText("1");
  await slider.focus();
  await page.keyboard.press("Home");
  await expect(slider).toHaveAttribute("aria-valuenow", "0");
  await page.keyboard.press("End");
  await expect(slider).toHaveAttribute("aria-valuenow", "100");
  await page.keyboard.press("ArrowDown");
  await expect(slider).toHaveAttribute("aria-valuenow", "99");
  const uncontrolled = page.locator("chaos-volume-gym-element").nth(1);
  await expect(uncontrolled.getByRole("slider", { name: "Âm lượng" })).toHaveAttribute("aria-valuenow", "25");
  await uncontrolled.getByRole("button", { name: "Tăng âm lượng" }).click();
  await expect(uncontrolled.getByRole("slider", { name: "Âm lượng" })).toHaveAttribute("aria-valuenow", "30");
  await expect(slider).toHaveAttribute("aria-valuenow", "99");
});

test("Angular Volume Gym CVA and independent model use numeric state", async ({
  page,
}) => {
  await page.goto("http://127.0.0.1:4200");
  const gym = page.locator("chaos-volume-gym-element").first();
  const slider = gym.getByRole("slider", { name: "Âm lượng" });
  await expect(slider).toHaveAttribute("aria-valuenow", "40");
  await gym.getByRole("button", { name: "Tăng âm lượng" }).click();
  await expect(page.getByTestId("volume-value")).toHaveText("41");
  await expect(page.getByTestId("volume-changes")).toHaveText("1");
  await page.getByRole("button", { name: "Set volume from app" }).click();
  await expect(slider).toHaveAttribute("aria-valuenow", "73");
  await expect(page.getByTestId("volume-changes")).toHaveText("1");
  await page.getByRole("button", { name: "Toggle volume disabled" }).click();
  await expect(slider).toHaveAttribute("aria-disabled", "true");
  await expect(gym.getByRole("button", { name: "Tăng âm lượng" })).toBeDisabled();
  await page.getByRole("button", { name: "Toggle volume disabled" }).click();
  const other = page.locator("chaos-volume-gym-element").nth(1);
  await other.getByRole("button", { name: "Tăng âm lượng" }).click();
  await expect(page.getByTestId("volume-other-model")).toHaveText("30");
  await expect(slider).toHaveAttribute("aria-valuenow", "73");
  await slider.focus();
  await page.getByRole("button", { name: "Toggle volume readonly" }).click();
  await expect(slider).toHaveAttribute("aria-readonly", "true");
  await expect(gym.getByRole("button", { name: "Tăng âm lượng" })).toBeDisabled();
  await expect(page.getByTestId("volume-form-state")).toContainText("Touched: true");
});

test("core quantizes decimal steps, reports source and silences host writes", async ({
  page,
}) => {
  await page.goto("http://127.0.0.1:5174");
  await page.evaluate(() => {
    const gym = document.createElement("chaos-volume-gym-element") as ChaosVolumeGymElement & {
      changes: VolumeChangeDetail[];
      commits: VolumeCommitDetail[];
    };
    gym.id = "volume-core";
    gym.min = 0.05;
    gym.max = 0.95;
    gym.step = 0.1;
    gym.value = 0.36;
    gym.changes = [];
    gym.commits = [];
    gym.addEventListener("change", (event) =>
      gym.changes.push((event as CustomEvent<VolumeChangeDetail>).detail),
    );
    gym.addEventListener("commit", (event) =>
      gym.commits.push((event as CustomEvent<VolumeCommitDetail>).detail),
    );
    document.body.prepend(gym);
  });
  const gym = page.locator("chaos-volume-gym-element#volume-core");
  const slider = gym.getByRole("slider", { name: "Âm lượng" });
  await expect(slider).toHaveAttribute("aria-valuenow", "0.35");
  await expect(slider).toHaveAttribute("aria-valuetext", "0.35");
  await expect(gym.locator(".number")).toHaveText("0.35");
  await gym.getByRole("button", { name: "Tăng âm lượng" }).click();
  await expect(slider).toHaveAttribute("aria-valuenow", "0.45");
  expect(await gym.evaluate((el) => (el as typeof el & { changes: VolumeChangeDetail[] }).changes)).toEqual([
    { value: 0.45, source: "button" },
  ]);
  expect(await gym.evaluate((el) => (el as typeof el & { commits: VolumeCommitDetail[] }).commits)).toEqual([
    { value: 0.45, source: "button" },
  ]);
  await gym.evaluate((el: ChaosVolumeGymElement) => { el.value = 10; });
  await expect(slider).toHaveAttribute("aria-valuenow", "0.95");
  await gym.evaluate((el: ChaosVolumeGymElement) => { el.value = -10; });
  await expect(slider).toHaveAttribute("aria-valuenow", "0.05");
  expect(await gym.evaluate((el) => (el as typeof el & { changes: VolumeChangeDetail[] }).changes)).toHaveLength(1);
});

test("controlled gravity sends value changes and stops on host override", async ({
  page,
}) => {
  await page.goto("http://127.0.0.1:5174");
  const gym = page.locator("chaos-volume-gym-element").first();
  const slider = gym.getByRole("slider", { name: "Âm lượng" });
  await page.getByRole("button", { name: "Toggle volume gravity" }).click();
  await slider.focus();
  await page.keyboard.press("End");
  await expect(page.getByTestId("volume-commits")).toHaveText("1");
  await expect.poll(async () => Number(await slider.getAttribute("aria-valuenow"))).toBeLessThan(98);
  await expect(page.getByTestId("volume-source")).toHaveText("gravity");
  await expect.poll(() => page.evaluate(() => {
    const host = document.querySelector("chaos-volume-gym-element")!;
    const slider = host.shadowRoot!.querySelector('[role="slider"]')!;
    return Number(document.querySelector('[data-testid="volume-value"]')!.textContent) - Number(slider.getAttribute("aria-valuenow"));
  })).toBe(0);
  await page.getByRole("button", { name: "Set volume from app" }).click();
  await expect(slider).toHaveAttribute("aria-valuenow", "73");
  await page.waitForTimeout(180);
  await expect(slider).toHaveAttribute("aria-valuenow", "73");
});

test("Angular gravity uses the same Reactive Forms value path", async ({ page }) => {
  await page.goto("http://127.0.0.1:4200");
  const gym = page.locator("chaos-volume-gym-element").first();
  const slider = gym.getByRole("slider", { name: "Âm lượng" });
  await page.getByRole("button", { name: "Toggle volume gravity" }).click();
  await slider.focus();
  await page.keyboard.press("End");
  await expect.poll(async () => Number(await page.getByTestId("volume-value").textContent())).toBeLessThan(98);
  await expect(page.getByTestId("volume-source")).toHaveText("gravity");
  await page.getByRole("button", { name: "Set volume from app" }).click();
  await expect(slider).toHaveAttribute("aria-valuenow", "73");
  await expect(page.getByTestId("volume-value")).toHaveText("73");
  const changes = await page.getByTestId("volume-changes").textContent();
  await page.waitForTimeout(180);
  await expect(page.getByTestId("volume-changes")).toHaveText(changes!);
});

test("pointer/touch lane reaches endpoints and commits once", async ({
  page,
  isMobile,
}) => {
  await page.goto("http://127.0.0.1:5174");
  const gym = page.locator("chaos-volume-gym-element").first();
  const slider = gym.getByRole("slider", { name: "Âm lượng" });
  await slider.scrollIntoViewIfNeeded();
  const box = (await slider.boundingBox())!;
  if (isMobile) {
    await slider.tap({ position: { x: box.width / 2, y: 0 } });
  } else {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height - 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2, box.y, { steps: 9 });
    await page.mouse.up();
  }
  await expect(slider).toHaveAttribute("aria-valuenow", "100");
  await expect(page.getByTestId("volume-commits")).toHaveText("1");
  await expect(page.getByTestId("volume-source")).toHaveText("pointer");
});

test("gravity pauses on visibilitychange and stops when disabled", async ({ page }) => {
  await page.goto("http://127.0.0.1:5174");
  const gym = page.locator("chaos-volume-gym-element").first();
  const slider = gym.getByRole("slider", { name: "Âm lượng" });
  await page.getByRole("button", { name: "Toggle volume gravity" }).click();
  await slider.focus();
  await page.keyboard.press("End");
  await expect.poll(async () => Number(await slider.getAttribute("aria-valuenow"))).toBeLessThan(98);

  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  const hiddenValue = await slider.getAttribute("aria-valuenow");
  await page.waitForTimeout(250);
  await expect(slider).toHaveAttribute("aria-valuenow", hiddenValue!);

  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: false });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  const resumedValue = Number(await slider.getAttribute("aria-valuenow"));
  expect(resumedValue).toBeGreaterThanOrEqual(Number(hiddenValue) - 2);
  await expect.poll(async () => Number(await slider.getAttribute("aria-valuenow"))).toBeLessThan(resumedValue);

  await page.getByRole("button", { name: "Toggle volume disabled" }).click();
  await expect(slider).toHaveAttribute("aria-disabled", "true");
  const disabledValue = await slider.getAttribute("aria-valuenow");
  await page.waitForTimeout(200);
  await expect(slider).toHaveAttribute("aria-valuenow", disabledValue!);
});

test("disconnect cancels gravity and leaves other instances independent", async ({ page }) => {
  await page.goto("http://127.0.0.1:5174");
  await page.evaluate(() => {
    const target = window as Window & { volumeFixture?: HTMLElement & { value: number }; volumeChanges?: string[] };
    const fixture = document.createElement("chaos-volume-gym-element") as HTMLElement & {
      value: number;
      gravity: boolean;
      decayRate: number;
    };
    fixture.id = "teardown-gym";
    fixture.value = 80;
    fixture.gravity = true;
    fixture.decayRate = 90;
    target.volumeChanges = [];
    fixture.addEventListener("change", (event) => target.volumeChanges!.push((event as CustomEvent<VolumeChangeDetail>).detail.source));
    target.volumeFixture = fixture;
    document.body.prepend(fixture);
  });
  const fixture = page.locator("#teardown-gym");
  await fixture.getByRole("button", { name: "Tăng âm lượng" }).click();
  await expect.poll(() => page.evaluate(() => (window as Window & { volumeChanges?: string[] }).volumeChanges?.filter((source) => source === "gravity").length)).toBeGreaterThan(0);
  const state = await page.evaluate(() => {
    const target = window as Window & { volumeFixture?: HTMLElement & { value: number }; volumeChanges?: string[] };
    target.volumeFixture!.remove();
    return { value: target.volumeFixture!.value, changes: target.volumeChanges!.length };
  });
  await page.waitForTimeout(160);
  expect(await page.evaluate(() => {
    const target = window as Window & { volumeFixture?: HTMLElement & { value: number }; volumeChanges?: string[] };
    return { value: target.volumeFixture!.value, changes: target.volumeChanges!.length };
  })).toEqual(state);
  await expect(page.locator("chaos-volume-gym-element").first().getByRole("slider", { name: "Âm lượng" })).toHaveAttribute("aria-valuenow", "40");
});

test("playground audio is opt-in and controls stay inside the demo", async ({
  page,
  isMobile,
}) => {
  await page.addInitScript(() => {
    const Original = window.AudioContext;
    const target = window as Window & { __audioCreates?: number };
    target.__audioCreates = 0;
    window.AudioContext = class extends Original {
      constructor() {
        super();
        target.__audioCreates = (target.__audioCreates ?? 0) + 1;
      }
    };
  });
  await page.goto("http://127.0.0.1:5173");
  await page.getByRole("button", { name: /03 \/ SOUND WORKOUT/ }).click();
  const gym = page.locator("chaos-volume-gym-element");
  await expect(gym.getByRole("slider", { name: "Âm lượng" })).toHaveAttribute("aria-valuenow", "35");
  expect(await page.evaluate(() => (window as Window & { __audioCreates?: number }).__audioCreates)).toBe(0);
  await page.getByRole("button", { name: "Play ▶" }).click();
  expect(await page.evaluate(() => (window as Window & { __audioCreates?: number }).__audioCreates)).toBe(1);
  await page.getByRole("button", { name: "Mute ×" }).click();
  await expect(page.getByRole("button", { name: /Unmute/ })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Stop ■" }).click();
  await expect(page.getByRole("button", { name: "Play ▶" })).toBeEnabled();
  await expect(page.getByRole("status")).toContainText("đã dừng");
  await page.locator("#demo").screenshot({
    path: `output/playwright/volume-${isMobile ? "mobile" : "desktop"}.png`,
  });
});
