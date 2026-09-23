import { test, expect } from "@playwright/test";
import type { ChaosLotoOtpElement } from "../../packages/chaos-ui/dist/loto-otp.js";
import type { OtpChangeDetail } from "../../packages/chaos-ui/src/otp.js";

test("React rerenders preserve selection when slots have not changed", async ({
  page,
}) => {
  await page.goto("http://127.0.0.1:5173");
  const game = page.locator("chaos-loto-otp-element");
  const source = game.getByRole("button", { name: "Lấy số 0", exact: true });
  await source.focus();
  await page.keyboard.press("Enter");
  await expect(source).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("checkbox", { name: "Âm thanh", exact: true }).check();
  await expect(source).toHaveAttribute("aria-pressed", "true");
  await game.locator("[data-slot]").first().click();
  await expect(game.locator("[data-slot]").first()).toHaveAccessibleName(
    "Ô 1: 0",
  );
});

for (const [framework, port] of [
  ["React", 5174],
  ["Angular", 4200],
] as const) {
  test(`${framework} Loto: user events, leading zeroes and explicit verification`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`http://127.0.0.1:${port}`);
    const game = page.locator("chaos-loto-otp-element").first();
    await expect(game).toBeVisible();
    await game.getByRole("button", { name: "Ô 1: trống", exact: true }).focus();
    await page.keyboard.type("000000");
    await expect(page.getByTestId("loto-value")).toHaveText(
      JSON.stringify(["0", "0", "0", "0", "0", "0"]),
    );
    await expect(page.getByTestId("loto-completes")).toHaveText("1");
    await expect(page.getByTestId("loto-submits")).toHaveText("0");
    await game.getByRole("button", { name: "Xác nhận", exact: true }).click();
    await expect(page.getByTestId("loto-submits")).toHaveText("1");
    await expect(game.getByText("KINH!", { exact: true })).toBeVisible();
    await page
      .getByRole("button", { name: "Load 112233", exact: true })
      .click();
    await expect(page.getByTestId("loto-value")).toHaveText(
      JSON.stringify(["1", "1", "2", "2", "3", "3"]),
    );
    await expect(page.getByTestId("loto-changes")).toHaveText("6");
    await expect(page.getByTestId("loto-completes")).toHaveText("1");
  });
}

for (const [framework, port] of [
  ["React", 5174],
  ["Angular", 4200],
] as const) {
  test(`${framework}: repeatable pool, swap/remove, holes, retry and readonly`, async ({
    page,
    isMobile,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`http://127.0.0.1:${port}`);
    const game = page.locator("chaos-loto-otp-element").first();
    for (let i = 0; i < 6; i++) {
      const digit = game.getByRole("button", { name: "Lấy số 0", exact: true });
      const slot = game.locator("[data-slot]").nth(i);
      if (isMobile) {
        await digit.tap();
        await slot.tap();
      } else {
        await digit.click();
        await slot.click();
      }
    }
    await expect(page.getByTestId("loto-value")).toHaveText(
      JSON.stringify(["0", "0", "0", "0", "0", "0"]),
    );
    await expect(page.getByTestId("loto-changes")).toHaveText("6");
    await page
      .getByRole("button", { name: "Load 112233", exact: true })
      .click();
    await game.locator("[data-slot]").nth(0).click();
    await game.locator("[data-slot]").nth(2).click();
    await expect(page.getByTestId("loto-value")).toHaveText(
      JSON.stringify(["2", "1", "1", "2", "3", "3"]),
    );
    await game.locator("[data-slot]").nth(1).click();
    await game.getByRole("button", { name: "Bỏ bóng", exact: true }).click();
    await expect(page.getByTestId("loto-value")).toHaveText(
      JSON.stringify(["2", null, "1", "2", "3", "3"]),
    );
    await expect(
      game.getByRole("button", { name: "Xác nhận", exact: true }),
    ).toBeDisabled();
    await game.locator("[data-slot]").nth(1).focus();
    await page.keyboard.type("5");
    await game.getByRole("button", { name: "Xác nhận", exact: true }).click();
    await expect(
      game.getByText("Chưa đúng. Thử lại nhé!", { exact: true }),
    ).toBeVisible();
    await game.getByRole("button", { name: "Làm lại", exact: true }).click();
    await game.locator("[data-slot]").first().focus();
    await page.keyboard.type("000000");
    await page.keyboard.press("Enter");
    await expect(game.getByText("KINH!", { exact: true })).toBeVisible();
    await page
      .getByRole("button", { name: "Toggle readonly", exact: true })
      .click();
    const before = await page.getByTestId("loto-changes").textContent();
    await game.locator("[data-slot]").first().focus();
    await page.keyboard.type("9");
    await expect(page.getByTestId("loto-changes")).toHaveText(before!);
    await expect(
      game.getByRole("button", { name: "Xác nhận", exact: true }),
    ).toBeDisabled();
    await page
      .getByRole("button", { name: "Toggle disabled", exact: true })
      .click();
    await expect(game.locator("[data-slot]").first()).toBeDisabled();
    if (framework === "Angular")
      await expect(page.getByTestId("form-state")).toContainText(
        "Touched: true",
      );
    expect(errors).toEqual([]);
  });
}

test("core: length normalization, no prop events, standard input/paste and immutable snapshots", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("http://127.0.0.1:5174");
  await page.evaluate(() => {
    const element = document.createElement("chaos-loto-otp-element") as ChaosLotoOtpElement & {
      events: OtpChangeDetail[];
    };
    element.id = "core-test";
    element.events = [];
    element.addEventListener("change", (e) =>
      element.events.push((e as CustomEvent<OtpChangeDetail>).detail),
    );
    document.body.prepend(element);
    element.slots = ["0", "0", "1", "1", "2", "2"];
  });
  const game = page.locator("#core-test");
  await game.evaluate((el: ChaosLotoOtpElement) => {
    el.length = 4;
  });
  await expect(game.locator("[data-slot]")).toHaveCount(4);
  await game.evaluate((el: ChaosLotoOtpElement) => {
    el.length = 8;
  });
  await expect(game.locator("[data-slot]")).toHaveCount(8);
  expect(await game.evaluate((el: ChaosLotoOtpElement) => el.slots)).toEqual([
    "0",
    "0",
    "1",
    "1",
    null,
    null,
    null,
    null,
  ]);
  expect(
    await game.evaluate(
      (el) => (el as ChaosLotoOtpElement & { events: OtpChangeDetail[] }).events,
    ),
  ).toEqual([]);
  await game
    .getByRole("button", { name: "Nhập thông thường", exact: true })
    .click();
  await game.locator("input").first().fill("00112233");
  await expect(game.locator("input").nth(7)).toHaveValue("3");
  await game.locator("input").nth(3).focus();
  await page.keyboard.press("Delete");
  expect(
    await game.evaluate((el) =>
      (el as ChaosLotoOtpElement & { events: OtpChangeDetail[] }).events.at(-1),
    ),
  ).toEqual({
    slots: ["0", "0", "1", null, "2", "2", "3", "3"],
    value: null,
    complete: false,
  });
  await game
    .locator("input")
    .first()
    .evaluate((input) => {
      const data = new DataTransfer();
      data.setData("text", "11223300");
      input.dispatchEvent(
        new ClipboardEvent("paste", {
          clipboardData: data,
          bubbles: true,
          composed: true,
        }),
      );
    });
  await expect(game.locator("input").nth(7)).toHaveValue("0");
  expect(
    await game.evaluate((el) =>
      Object.isFrozen(
        (el as ChaosLotoOtpElement & { events: OtpChangeDetail[] }).events[0]?.slots,
      ),
    ),
  ).toBe(true);
  expect(
    await game.evaluate(
      (el) =>
        (el as ChaosLotoOtpElement & { events: OtpChangeDetail[] }).events[0]?.value,
    ),
  ).toBe("00112233");
});

test("core: real pointer drag, swap, outside removal, cancel, resize, reset and reconnect", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("http://127.0.0.1:5174");
  await page.evaluate(() => {
    const el = document.createElement("chaos-loto-otp-element");
    el.id = "drag-test";
    el.style.margin = "24px";
    document.body.prepend(el);
  });
  const game = page.locator("#drag-test");
  const slot = (i: number) => game.locator("[data-slot]").nth(i);
  const move = async (
    from: import("@playwright/test").Locator,
    to: import("@playwright/test").Locator,
  ) => {
    await from.scrollIntoViewIfNeeded();
    const a = (await from.boundingBox())!;
    const b = (await to.boundingBox())!;
    await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
    await page.mouse.down();
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 8 });
    await page.mouse.up();
  };
  await move(
    game.getByRole("button", { name: "Lấy số 0", exact: true }),
    slot(0),
  );
  await expect(slot(0)).toHaveAccessibleName("Ô 1: 0");
  await move(
    game.getByRole("button", { name: "Lấy số 7", exact: true }),
    slot(1),
  );
  await move(slot(0), slot(1));
  await expect(slot(0)).toHaveAccessibleName("Ô 1: 7");
  await expect(slot(1)).toHaveAccessibleName("Ô 2: 0");
  await move(slot(1), game.locator(".top"));
  await expect(slot(1)).toHaveAccessibleName("Ô 2: trống");
  const start = (await slot(0).boundingBox())!;
  await page.mouse.move(start.x + start.width / 2, start.y + start.height / 2);
  await page.mouse.down();
  await page.mouse.move(start.x + 80, start.y + 90, { steps: 4 });
  await expect(game.locator(".ghost")).toBeVisible();
  const ghost = (await game.locator(".ghost").boundingBox())!;
  expect(Math.abs(ghost.x + ghost.width / 2 - (start.x + 80))).toBeLessThan(12);
  expect(Math.abs(ghost.y + ghost.height * 0.65 - (start.y + 90))).toBeLessThan(
    15,
  );
  await slot(0).dispatchEvent("pointercancel", { pointerId: 1 });
  await page.mouse.up();
  await expect(game.locator(".ghost")).toHaveCount(0);
  await expect(slot(0)).toHaveAccessibleName("Ô 1: 7");
  await page.mouse.move(start.x + start.width / 2, start.y + start.height / 2);
  await page.mouse.down();
  await page.mouse.move(start.x + 80, start.y + 90, { steps: 4 });
  await page.evaluate(() => window.dispatchEvent(new Event("resize")));
  await page.mouse.up();
  await expect(game.locator(".ghost")).toHaveCount(0);
  await expect(slot(0)).toHaveAccessibleName("Ô 1: 7");
  await game.evaluate((el: ChaosLotoOtpElement) => {
    el.status = "success";
  });
  await expect(game.getByText("KINH!", { exact: true })).toBeVisible();
  await game.evaluate((el: ChaosLotoOtpElement) => {
    el.reset();
    el.status = "idle";
    el.remove();
    document.body.prepend(el);
  });
  await expect(slot(0)).toHaveAccessibleName("Ô 1: trống");
  await expect(game.getByText("KINH!", { exact: true })).toHaveCount(0);
  await slot(0).focus();
  await page.keyboard.type("112233");
  expect(await game.evaluate((el: ChaosLotoOtpElement) => el.slots)).toEqual([
    "1",
    "1",
    "2",
    "2",
    "3",
    "3",
  ]);
});

test("Angular Forms marks touched only on exit; model binding remains independent", async ({
  page,
}) => {
  await page.goto("http://127.0.0.1:4200");
  const game = page.locator("chaos-loto-otp-element").first();
  await game.locator("[data-slot]").first().focus();
  await page.keyboard.type("0");
  await expect(page.getByTestId("form-state")).toContainText("Touched: false");
  await expect(page.getByTestId("form-state")).toContainText("Dirty: true");
  await game.locator("[data-slot]").nth(2).focus();
  await expect(page.getByTestId("form-state")).toContainText("Touched: false");
  await page.getByRole("button", { name: "Load 112233", exact: true }).focus();
  await expect(page.getByTestId("form-state")).toContainText("Touched: true");
  const other = page.locator("chaos-loto-otp-element").nth(1);
  await other.locator("[data-slot]").first().focus();
  await page.keyboard.type("0909");
  await expect(page.getByTestId("other-model")).toHaveText("0909");
  await expect(page.getByTestId("loto-changes")).toHaveText("1");
  await page
    .getByRole("button", { name: "Reset from app", exact: true })
    .click();
  await expect(page.getByTestId("form-state")).toContainText("Dirty: false");
  await expect(page.getByTestId("loto-changes")).toHaveText("1");
});

test("idle motion pauses during selection; audio opt-in and teardown release the context", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const Original = window.AudioContext;
    window.AudioContext = class extends Original {
      constructor() {
        super();
        document.documentElement.dataset["audioCreated"] = String(
          Number(document.documentElement.dataset["audioCreated"] ?? 0) + 1,
        );
      }
      override close() {
        document.documentElement.dataset["audioClosed"] = String(
          Number(document.documentElement.dataset["audioClosed"] ?? 0) + 1,
        );
        return super.close();
      }
    };
  });
  await page.goto("http://127.0.0.1:5174");
  await page.evaluate(() => {
    const el = document.createElement("chaos-loto-otp-element");
    el.id = "audio-test";
    document.body.prepend(el);
  });
  const game = page.locator("#audio-test");
  const source = game.getByRole("button", { name: "Lấy số 0", exact: true });
  await expect(source).toBeVisible();
  expect(
    await source.evaluate((el) => getComputedStyle(el).animationPlayState),
  ).toBe("running");
  await source.focus();
  await page.keyboard.press("Enter");
  expect(
    await source.evaluate((el) => getComputedStyle(el).animationPlayState),
  ).toBe("paused");
  expect(
    await page.locator("html").getAttribute("data-audio-created"),
  ).toBeNull();
  await game.evaluate((el: ChaosLotoOtpElement) => {
    el.sound = true;
    el.status = "success";
  });
  expect(
    await page.locator("html").getAttribute("data-audio-created"),
  ).toBeNull();
  await game.locator("[data-slot]").first().focus();
  await page.keyboard.type("1");
  await expect(page.locator("html")).toHaveAttribute("data-audio-created", "1");
  await game.evaluate((el: ChaosLotoOtpElement) => {
    el.remove();
  });
  await expect(page.locator("html")).toHaveAttribute("data-audio-closed", "1");
});

test("playground: delayed verification, reset invalidates pending results and responsive appearance", async ({
  page,
  isMobile,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:5173");
  await page.emulateMedia({ reducedMotion: "reduce" });
  const game = page.locator("chaos-loto-otp-element").first();
  const code = (await page.getByTestId("sample-code").textContent())!;
  await game.locator("[data-slot]").first().focus();
  await page.keyboard.type(code);
  await game.getByRole("button", { name: "Xác nhận", exact: true }).click();
  await expect(game.locator('[part="submit"]')).toBeDisabled();
  await page.getByRole("button", { name: "Reset demo ↺", exact: true }).click();
  await expect(game.locator("[data-slot]").first()).toHaveAccessibleName(
    "Ô 1: trống",
  );
  await expect(game.getByText("KINH!", { exact: true })).toHaveCount(0);
  await game.locator("[data-slot]").first().focus();
  await page.keyboard.type(code);
  await page.keyboard.press("Enter");
  await expect(game.getByText("KINH!", { exact: true })).toBeVisible();
  expect(
    await game
      .locator('[part~="source"]')
      .first()
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.locator("#demo").screenshot({
    path: `output/playwright/loto-${isMobile ? "mobile" : "desktop"}.png`,
  });
  expect(errors).toEqual([]);
});
