import { test, expect, type Locator } from "@playwright/test";
import type { ChaosInfinityOtpElement } from "../../packages/chaos-ui/dist/infinity-otp.js";
import type { OtpChangeDetail } from "../../packages/chaos-ui/src/otp.js";

const element = "chaos-infinity-otp-element";
const slots = (game: Locator) => game.locator("[data-slot]");

for (const [framework, port] of [
  ["React", 5174],
  ["Angular", 4200],
] as const) {
  test(`${framework} Infinity: repeated zeroes, ordered sockets, submit and host updates`, async ({
    page,
    isMobile,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`http://127.0.0.1:${port}`);
    const game = page.locator(element).first();
    await expect(game).toBeVisible();
    await expect(slots(game)).toHaveCount(6);
    for (let index = 0; index < 6; index++) {
      const source = game.getByRole("button", {
        name: "Lấy đá số 0",
        exact: true,
      });
      if (isMobile) {
        await source.tap();
        await slots(game).nth(index).tap();
      } else {
        await source.click();
        await slots(game).nth(index).click();
      }
    }
    await expect(page.getByTestId("infinity-value")).toHaveText(
      JSON.stringify(["0", "0", "0", "0", "0", "0"]),
    );
    await expect(page.getByTestId("infinity-completes")).toHaveText("1");
    await expect(page.getByTestId("infinity-submits")).toHaveText("0");
    for (let index = 0; index < 6; index++)
      await expect(slots(game).nth(index)).toHaveAccessibleName(
        `Hốc ${index + 1}: 0`,
      );
    await game.getByRole("button", { name: "Búng tay", exact: true }).click();
    await expect(page.getByTestId("infinity-submits")).toHaveText("1");
    await expect(
      game.getByText("Chưa đúng. Đổi đá rồi thử lại.", { exact: true }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Load Infinity 112233", exact: true })
      .click();
    await expect(page.getByTestId("infinity-value")).toHaveText(
      JSON.stringify(["1", "1", "2", "2", "3", "3"]),
    );
    await expect(page.getByTestId("infinity-changes")).toHaveText("6");
    await slots(game).first().focus();
    await page.keyboard.type("001122");
    await expect(page.getByTestId("infinity-value")).toHaveText(
      JSON.stringify(["0", "0", "1", "1", "2", "2"]),
    );
    await game.getByRole("button", { name: "Búng tay", exact: true }).click();
    await expect(game.getByText("BÚNG!", { exact: true })).toBeVisible();
    const other = page.locator(element).nth(1);
    await expect(slots(other)).toHaveCount(6);
    await expect(slots(other).first()).toHaveAccessibleName("Socket 1: 0");
    await other
      .getByRole("button", { name: "Pick stone 9", exact: true })
      .click();
    await slots(other).nth(1).click();
    await expect(slots(other).nth(1)).toHaveAccessibleName("Socket 2: 9");
    await expect(page.getByTestId("infinity-value")).toHaveText(
      JSON.stringify(["0", "0", "1", "1", "2", "2"]),
    );
    if (framework === "Angular")
      await expect(page.getByTestId("infinity-other-model")).toHaveText("09");
  });
}

test("Infinity core: swap/remove, immutable events, ordinary entry, reset and instance isolation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("http://127.0.0.1:5174");
  await page.evaluate(() => {
    const glove = document.createElement(
      "chaos-infinity-otp-element",
    ) as ChaosInfinityOtpElement & { events: OtpChangeDetail[] };
    glove.id = "infinity-core";
    glove.events = [];
    glove.addEventListener("change", (event) =>
      glove.events.push((event as CustomEvent<OtpChangeDetail>).detail),
    );
    glove.slots = ["0", "0", "1", "1", "2", "2", "9"];
    document.body.prepend(glove);
  });
  const game = page.locator("#infinity-core");
  await expect(slots(game)).toHaveCount(6);
  await expect(slots(game).last()).toHaveAccessibleName("Hốc 6: 2");
  expect(
    await game.evaluate(
      (el) =>
        (el as ChaosInfinityOtpElement & { events: OtpChangeDetail[] }).events,
    ),
  ).toEqual([]);
  await slots(game).nth(0).click();
  await slots(game).nth(2).click();
  expect(
    await game.evaluate((el: ChaosInfinityOtpElement) => el.slots),
  ).toEqual(["1", "0", "0", "1", "2", "2"]);
  await slots(game).nth(1).click();
  await game.getByRole("button", { name: "Lấy đá ra", exact: true }).click();
  expect(
    await game.evaluate((el: ChaosInfinityOtpElement) => el.slots),
  ).toEqual(["1", null, "0", "1", "2", "2"]);
  await expect(game.locator('[part="submit"]')).toBeDisabled();
  const last = await game.evaluate((el) =>
    (el as ChaosInfinityOtpElement & { events: OtpChangeDetail[] }).events.at(
      -1,
    ),
  );
  expect(last).toEqual({
    slots: ["1", null, "0", "1", "2", "2"],
    value: null,
    complete: false,
  });
  expect(
    await game.evaluate((el) =>
      Object.isFrozen(
        (
          el as ChaosInfinityOtpElement & { events: OtpChangeDetail[] }
        ).events.at(-1)?.slots,
      ),
    ),
  ).toBe(true);
  await game
    .getByRole("button", { name: "Nhập thông thường", exact: true })
    .click();
  await game.locator("input").first().fill("001122");
  await expect(game.locator("input").last()).toHaveValue("2");
  await game.evaluate((el: ChaosInfinityOtpElement) => {
    el.status = "success";
  });
  await expect(game.getByText("BÚNG!", { exact: true })).toBeVisible();
  await game.evaluate((el: ChaosInfinityOtpElement) => {
    el.reset();
    el.status = "idle";
  });
  await expect(game.getByText("BÚNG!", { exact: true })).toHaveCount(0);
  await expect(game.locator("input").first()).toHaveValue("");
  await game.evaluate((el: ChaosInfinityOtpElement) => {
    el.remove();
    document.body.prepend(el);
  });
  await expect(slots(game)).toHaveCount(6);
  await expect(slots(page.locator(element).first())).toHaveCount(6);
});

test("Infinity pointer drag can swap, remove outside, cancel and resize", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("http://127.0.0.1:5174");
  await page.evaluate(() => {
    const el = document.createElement("chaos-infinity-otp-element");
    el.id = "infinity-drag";
    document.body.prepend(el);
  });
  const game = page.locator("#infinity-drag");
  const move = async (from: Locator, to: Locator) => {
    await from.scrollIntoViewIfNeeded();
    const a = (await from.boundingBox())!,
      b = (await to.boundingBox())!;
    await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
    await page.mouse.down();
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 8 });
    await page.mouse.up();
  };
  await move(
    game.getByRole("button", { name: "Lấy đá số 0", exact: true }),
    slots(game).first(),
  );
  await move(
    game.getByRole("button", { name: "Lấy đá số 7", exact: true }),
    slots(game).nth(1),
  );
  await expect(slots(game).first()).toHaveAccessibleName("Hốc 1: 0");
  await move(slots(game).first(), slots(game).nth(1));
  await expect(slots(game).first()).toHaveAccessibleName("Hốc 1: 7");
  await expect(slots(game).nth(1)).toHaveAccessibleName("Hốc 2: 0");
  await move(slots(game).nth(1), game.locator(".header"));
  await expect(slots(game).nth(1)).toHaveAccessibleName("Hốc 2: trống");
  const a = (await slots(game).first().boundingBox())!;
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
  await page.mouse.down();
  await page.mouse.move(a.x + 80, a.y + 80, { steps: 6 });
  await expect(game.locator(".drag-stone")).toBeVisible();
  await slots(game).first().dispatchEvent("pointercancel", { pointerId: 1 });
  await page.mouse.up();
  await expect(game.locator(".drag-stone")).toHaveCount(0);
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
  await page.mouse.down();
  await page.mouse.move(a.x + 80, a.y + 80, { steps: 6 });
  await page.evaluate(() => window.dispatchEvent(new Event("resize")));
  await page.mouse.up();
  await expect(game.locator(".drag-stone")).toHaveCount(0);
});

test("Infinity Angular Forms and model binding stay separate", async ({
  page,
}) => {
  await page.goto("http://127.0.0.1:4200");
  const game = page.locator(element).first();
  await slots(game).first().focus();
  await page.keyboard.type("0");
  await expect(page.getByTestId("infinity-form-state")).toContainText(
    "Touched: false",
  );
  await expect(page.getByTestId("infinity-form-state")).toContainText(
    "Dirty: true",
  );
  await slots(game).nth(2).focus();
  await expect(page.getByTestId("infinity-form-state")).toContainText(
    "Touched: false",
  );
  await page
    .getByRole("button", { name: "Load Infinity 112233", exact: true })
    .focus();
  await expect(page.getByTestId("infinity-form-state")).toContainText(
    "Touched: true",
  );
  const other = page.locator(element).nth(1);
  await slots(other).first().focus();
  await page.keyboard.type("090909");
  await expect(page.getByTestId("infinity-other-model")).toHaveText("090909");
  await expect(page.getByTestId("infinity-changes")).toHaveText("1");
  await page
    .getByRole("button", { name: "Reset Infinity from app", exact: true })
    .click();
  await expect(page.getByTestId("infinity-form-state")).toContainText(
    "Dirty: false",
  );
  await expect(page.getByTestId("infinity-changes")).toHaveText("1");
});

test("Infinity effects stay local, run once per success transition, and stop on reset or reduced motion", async ({
  page,
}) => {
  await page.goto("http://127.0.0.1:5174");
  await page.evaluate(() => {
    const marker = document.createElement("p");
    marker.id = "outside-marker";
    marker.textContent = "Still here";
    const one = document.createElement("chaos-infinity-otp-element");
    one.id = "effect-one";
    const two = document.createElement("chaos-infinity-otp-element");
    two.id = "effect-two";
    document.body.prepend(marker, two, one);
  });
  const one = page.locator("#effect-one"),
    two = page.locator("#effect-two");
  await one.evaluate((el: ChaosInfinityOtpElement) => {
    el.dataset.snapStarts = "0";
    el.dataset.businessEvents = "0";
    el.shadowRoot?.addEventListener("animationstart", (event) => {
      if ((event as AnimationEvent).animationName === "contact-frame")
        el.dataset.snapStarts = String(Number(el.dataset.snapStarts) + 1);
    });
    for (const name of ["change", "complete", "submit"])
      el.addEventListener(name, () => {
        el.dataset.businessEvents = String(Number(el.dataset.businessEvents) + 1);
      });
    el.slots = ["0", "0", "1", "1", "2", "2"];
    el.status = "success";
  });
  await expect(one.locator(".board")).toHaveClass(/snapping/);
  await expect(one.locator('[part="failed-emoji"]')).toHaveCount(0);
  await expect(two.getByText("BÚNG!", { exact: true })).toHaveCount(0);
  await expect(page.locator("#outside-marker")).toHaveText("Still here");
  await expect(one.locator(".dust i")).toHaveCount(0);
  await expect(one).toHaveAttribute("data-snap-starts", "1");
  await one.evaluate((el: ChaosInfinityOtpElement) => {
    el.slots = [...el.slots];
    el.message = "Checking the same digits";
  });
  await expect(one.locator(".board")).toHaveClass(/snapping/);
  await expect(one).toHaveAttribute("data-snap-starts", "1");
  await expect(one.getByText("Đang búng tay…", { exact: true })).toBeVisible();
  await expect(one.getByText("Checking the same digits")).toHaveCount(0);
  await expect(one.locator(".board")).toHaveClass(/success/, { timeout: 3500 });
  await expect(one.getByText("Checking the same digits")).toBeVisible();
  await expect(one.locator(".dust i")).toHaveCount(24);
  await expect(one.getByText("BÚNG!", { exact: true })).toBeVisible();
  await one.evaluate((el: ChaosInfinityOtpElement) => {
    el.message = "Still successful";
  });
  await expect(one.getByText("Still successful")).toBeVisible();
  await expect(one).toHaveAttribute("data-snap-starts", "1");
  await one.getByRole("button", { name: "Xem lại cú búng" }).click();
  await expect(one.locator(".board")).toHaveClass(/snapping/);
  await expect(one).toHaveAttribute("data-snap-starts", "2");
  await expect(one).toHaveAttribute("data-business-events", "0");
  await one.evaluate((el: ChaosInfinityOtpElement) => {
    el.remove();
    document.body.prepend(el);
  });
  await expect(one.locator(".board")).not.toHaveClass(/snapping/);
  await one.evaluate((el: ChaosInfinityOtpElement) => {
    el.reset();
    el.status = "idle";
  });
  await expect(one.locator(".dust i")).toHaveCount(0);
  await expect(one.getByText("BÚNG!", { exact: true })).toHaveCount(0);
  await expect(one.locator(".glove-contact")).toHaveCSS("animation-name", "none");
  await one.evaluate((el: ChaosInfinityOtpElement) => {
    el.slots = ["9", "9", "9", "9", "9", "9"];
    el.status = "error";
  });
  await expect(one.locator(".board")).toHaveClass(/snapping/);
  await expect(one.locator('[part="failed-emoji"]')).toHaveCount(0);
  await expect(one.locator(".board")).toHaveClass(/error/, { timeout: 3500 });
  await expect(one.locator('[part="failed-snap"]')).toHaveText("Ơ KÌA?!");
  await expect(one.locator('[part="failed-emoji"]')).toBeVisible();
  await expect(one.locator(".titan")).toHaveCount(0);
  await expect(two.locator('[part="failed-emoji"]')).toHaveCount(0);
  await expect(page.locator("#outside-marker")).toHaveText("Still here");
  await one.evaluate((el: ChaosInfinityOtpElement) => {
    el.reset();
    el.status = "idle";
  });
  await expect(one.locator('[part="failed-snap"]')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await two.evaluate((el: ChaosInfinityOtpElement) => {
    el.status = "success";
  });
  await expect(two.getByText("BÚNG!", { exact: true })).toBeVisible();
  expect(
    await two
      .locator(".glove-contact")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  await two.evaluate((el: ChaosInfinityOtpElement) => el.remove());
  await expect(page.locator("#outside-marker")).toHaveText("Still here");
});

test("Infinity snap shows distinct contact and finger-release frames", async ({
  page,
  isMobile,
}) => {
  await page.goto("http://127.0.0.1:5174");
  await page.evaluate(() => {
    const el = document.createElement("chaos-infinity-otp-element") as ChaosInfinityOtpElement;
    el.id = "snap-frames";
    document.body.prepend(el);
    el.slots = ["0", "0", "1", "1", "2", "2"];
  });
  const game = page.locator("#snap-frames");
  await expect(game.locator(".glove-frame")).toHaveCount(3);
  await expect.poll(() => game.locator(".glove-frame").evaluateAll((images) =>
    images.every((image) => (image as HTMLImageElement).naturalWidth > 0),
  )).toBe(true);
  await game.getByRole("button", { name: "Búng tay", exact: true }).click();
  await expect(game.locator(".board")).toHaveClass(/snapping/);
  const frameAt = async (time: number) => game.evaluate((host, ms) => {
    const frames = [".glove-contact", ".glove-release", ".glove-open"].map((selector) =>
      host.shadowRoot!.querySelector<HTMLElement>(selector)!,
    );
    for (const node of host.shadowRoot!.querySelectorAll<HTMLElement>(
      ".gauntlet, .socket-wrap, .glove-frame, .snap-impact, .snap-caption",
    )) {
      for (const animation of node.getAnimations()) {
        animation.pause();
        animation.currentTime = ms;
      }
    }
    return frames.map((frame) => Number(getComputedStyle(frame).opacity));
  }, time);
  expect(await frameAt(600)).toEqual([1, 0, 0]);
  await expect(game.locator(".socket-wrap").first()).toHaveCSS("opacity", "0");
  await game.locator(".stage").screenshot({
    path: `output/playwright/infinity-snap-contact-${isMobile ? "mobile" : "desktop"}.png`,
  });
  expect(await frameAt(1450)).toEqual([0, 1, 0]);
  await game.locator(".stage").screenshot({
    path: `output/playwright/infinity-snap-release-${isMobile ? "mobile" : "desktop"}.png`,
  });
  await game.evaluate((host: ChaosInfinityOtpElement) => {
    host.reset();
    host.status = "idle";
  });
  await expect(game.locator(".glove-contact")).toHaveCSS("animation-name", "none");
});

test("Infinity playground: delayed result, retry, localized snap and responsive drop targets", async ({
  page,
  isMobile,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("http://127.0.0.1:5173");
  await page
    .getByRole("button", { name: /Infinity OTP/ })
    .first()
    .click();
  const game = page.locator(element).first();
  const code = (await page.getByTestId("infinity-sample").textContent())!;
  const widths = await slots(game).evaluateAll((nodes) =>
    nodes.map((node) => node.getBoundingClientRect().width),
  );
  expect(Math.min(...widths)).toBeGreaterThanOrEqual(42);
  await slots(game).first().focus();
  await page.keyboard.type("999999");
  await game.getByRole("button", { name: "Búng tay", exact: true }).click();
  await expect(game.locator('[part="submit"]')).toBeDisabled();
  await expect(
    game.getByText("Chưa đúng mã. Hãy thay viên đá cần sửa.", { exact: true }),
  ).toBeVisible();
  await expect(game.locator('[part="failed-snap"]')).toBeVisible();
  await expect(game.locator('[part="failed-emoji"]')).toBeVisible();
  await page.locator("#demo").screenshot({
    path: `output/playwright/infinity-error-${isMobile ? "mobile" : "desktop"}.png`,
  });
  await slots(game).first().focus();
  await page.keyboard.type(code);
  await page.keyboard.press("Enter");
  await expect(game.locator(".board")).toHaveClass(/snapping/);
  await expect(game.locator(".board")).toHaveClass(/success/, { timeout: 3500 });
  await expect(game.getByText("BÚNG!", { exact: true })).toBeVisible();
  if (!isMobile) {
    await page.waitForTimeout(1100);
    const ashOpacity = await game.locator(".gauntlet").evaluate((node) =>
      Number(getComputedStyle(node).opacity),
    );
    expect(ashOpacity).toBeLessThan(0.9);
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.locator("#demo").screenshot({
    path: `output/playwright/infinity-${isMobile ? "mobile" : "desktop"}.png`,
  });
  await page
    .getByRole("button", { name: "Reset Infinity ↺", exact: true })
    .click();
  await expect(game.getByText("BÚNG!", { exact: true })).toHaveCount(0);
  await expect(slots(game).first()).toHaveAccessibleName("Hốc 1: trống");
  expect(errors).toEqual([]);
});
