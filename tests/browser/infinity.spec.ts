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
      if ((event as AnimationEvent).animationName === "thumb-snap")
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
  await expect(one.locator(".dust i")).toHaveCount(204);
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
  await expect(one.locator(".f-thumb")).toHaveCSS("animation-name", "none");
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
      .locator(".f-thumb")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  await two.evaluate((el: ChaosInfinityOtpElement) => el.remove());
  await expect(page.locator("#outside-marker")).toHaveText("Still here");
});

test("Infinity snap articulates contact and release while stones stay mounted", async ({
  page,
  isMobile,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("http://127.0.0.1:5174");
  await page.evaluate(() => {
    const el = document.createElement("chaos-infinity-otp-element") as ChaosInfinityOtpElement;
    el.id = "snap-frames";
    document.body.prepend(el);
    el.slots = ["0", "0", "1", "1", "2", "2"];
  });
  const game = page.locator("#snap-frames");
  await expect(game.locator(".gauntlet .finger")).toHaveCount(5);
  await expect(game.locator(".gauntlet .bezel")).toHaveCount(6);
  await game.getByRole("button", { name: "Búng tay", exact: true }).click();
  await expect(game.locator(".board")).toHaveClass(/snapping/);
  const poseAt = async (time: number) => game.evaluate((host, ms) => {
    const root = host.shadowRoot!;
    for (const animation of root.getAnimations()) {
      animation.pause();
      animation.currentTime = ms;
    }
    const pose = (selector: string) => {
      const m = new DOMMatrix(getComputedStyle(root.querySelector(selector)!).transform);
      return { rotate: (Math.atan2(m.b, m.a) * 180) / Math.PI, length: Math.hypot(m.c, m.d) };
    };
    const center = (node: Element) => {
      const r = node.getBoundingClientRect();
      return [r.x + r.width / 2, r.y + r.height / 2] as const;
    };
    const bezels = [...root.querySelectorAll(".bezel .edge")].map(center);
    // Each stone stays centered on its bezel while the whole hand moves.
    const drift = [...root.querySelectorAll(".socket")].map((socket, index) => {
      const [x, y] = center(socket);
      const [bx, by] = bezels[index]!;
      return Math.hypot(x - bx, y - by);
    });
    const opacity = [...root.querySelectorAll(".socket-wrap")].map((node) =>
      Number(getComputedStyle(node).opacity),
    );
    return { thumb: pose(".f-thumb"), middle: pose(".f-middle"), drift, opacity };
  }, time);
  const contact = await poseAt(800);
  expect(contact.thumb.rotate).toBeGreaterThan(45);
  expect(contact.middle.length).toBeLessThan(0.7);
  expect(contact.opacity).toEqual([1, 1, 1, 1, 1, 1]);
  expect(Math.max(...contact.drift)).toBeLessThan(4);
  await game.locator(".stage").screenshot({
    path: `output/playwright/infinity-snap-contact-${isMobile ? "mobile" : "desktop"}.png`,
  });
  const release = await poseAt(1150);
  expect(release.thumb.rotate).toBeLessThan(-3);
  expect(release.middle.length).toBeLessThan(0.3);
  expect(release.opacity).toEqual([1, 1, 1, 1, 1, 1]);
  expect(Math.max(...release.drift)).toBeLessThan(4);
  await game.locator(".stage").screenshot({
    path: `output/playwright/infinity-snap-release-${isMobile ? "mobile" : "desktop"}.png`,
  });
  await game.evaluate((host: ChaosInfinityOtpElement) => {
    host.reset();
    host.status = "idle";
  });
  await expect(game.locator(".f-thumb")).toHaveCSS("animation-name", "none");
});

test("Infinity reduced motion fades to a still snap pose, then shows the result", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("http://127.0.0.1:5174");
  await page.evaluate(() => {
    const el = document.createElement("chaos-infinity-otp-element") as ChaosInfinityOtpElement;
    el.id = "still-snap";
    el.addEventListener("submit", () => {
      el.status = "verifying";
      setTimeout(() => {
        el.status = "error";
      }, 50);
    });
    document.body.prepend(el);
    el.slots = ["0", "0", "1", "1", "2", "2"];
  });
  const game = page.locator("#still-snap");
  await expect(game.locator(".board")).toHaveClass(/no-motion/);
  await game.getByRole("button", { name: "Búng tay", exact: true }).click();
  await expect(game.locator(".board")).toHaveClass(/snapping/);
  const still = await game.evaluate((host) => {
    const root = host.shadowRoot!;
    const thumb = root.querySelector(".f-thumb")!;
    const m = new DOMMatrix(getComputedStyle(thumb).transform);
    return {
      thumbAnimation: getComputedStyle(thumb).animationName,
      rigAnimation: getComputedStyle(root.querySelector(".rig")!).animationName,
      rotate: (Math.atan2(m.b, m.a) * 180) / Math.PI,
      impact: Number(getComputedStyle(root.querySelector(".snap-impact")!).opacity),
    };
  });
  expect(still.thumbAnimation).toBe("none");
  expect(still.rigAnimation).toBe("pose-in");
  expect(still.rotate).toBeGreaterThan(45);
  expect(still.impact).toBe(0);
  await expect(game.locator('[part="snap-caption"]')).toBeVisible();
  await expect(game.locator('[part="failed-emoji"]')).toHaveCount(0);
  await expect(game.locator(".board")).toHaveClass(/error/, { timeout: 2000 });
  await expect(game.locator('[part="failed-emoji"]')).toBeVisible();
  await expect(game.locator(".f-thumb")).toHaveCSS("transform", "none");
});

test("Infinity reduced-motion success turns the glove to still ash and back", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("http://127.0.0.1:5174");
  await page.evaluate(() => {
    const el = document.createElement("chaos-infinity-otp-element") as ChaosInfinityOtpElement;
    el.id = "still-ash";
    document.body.prepend(el);
    el.slots = ["0", "0", "1", "1", "2", "2"];
    el.status = "success";
  });
  const game = page.locator("#still-ash");
  await expect(game.locator(".board")).toHaveClass(/success/, { timeout: 2000 });
  await expect(game.locator(".dust i")).toHaveCount(204);
  const ash = await game.evaluate((host) => {
    const root = host.shadowRoot!;
    const flake = root.querySelector(".dust i")!;
    return {
      rig: getComputedStyle(root.querySelector(".rig")!).animationName,
      flake: getComputedStyle(flake).animationName,
      flakeTransform: getComputedStyle(flake).transform,
      wave: getComputedStyle(root.querySelector(".dust")!, "::before").animationName,
    };
  });
  expect(ash.rig).toBe("ash-still");
  expect(ash.flake).toBe("ash-still-flake");
  // Flakes hold a fixed offset; only opacity changes.
  expect(ash.flakeTransform).not.toBe("none");
  expect(ash.wave).toBe("none");
  // The ashen state is temporary: the glove returns in full color.
  await expect.poll(() => game.evaluate((host) => {
    const rig = host.shadowRoot!.querySelector(".rig")!;
    return rig.getAnimations().every((animation) => animation.playState === "finished")
      ? getComputedStyle(rig).opacity
      : "playing";
  }), { timeout: 4000 }).toBe("1");
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
    // The dissolve mask has swept part of the glove away and flakes are airborne.
    const ash = await game.evaluate((host) => {
      const root = host.shadowRoot!;
      const flakes = [...root.querySelectorAll(".dust i")];
      return {
        sweep: parseFloat(getComputedStyle(root.querySelector(".rig")!).maskPosition),
        flying: flakes.filter((flake) => Number(getComputedStyle(flake).opacity) > 0.2).length,
      };
    });
    expect(ash.sweep).toBeLessThan(80);
    expect(ash.flying).toBeGreaterThan(20);
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
