import { test, expect } from "@playwright/test";
for (const [framework, port] of [
  ["React", 5174],
  ["Angular", 4200],
] as const) {
  test(`${framework}: controlled binding, input methods, isolation and reconnect`, async ({
    page,
    isMobile,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`http://127.0.0.1:${port}`);
    const first = page
      .locator("chaos-internal-probe")
      .first()
      .getByRole("button");
    const second = page
      .locator("chaos-internal-probe")
      .nth(1)
      .getByRole("button");
    await expect(first).toContainText("0");
    if (isMobile) await first.tap();
    else await first.click();
    await expect(page.getByTestId("value")).toHaveText("Value: 1");
    await expect(page.getByTestId("events")).toHaveText("Events: 1");
    await expect(second).toContainText("0");
    await first.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("events")).toHaveText("Events: 2");
    await page
      .getByRole("button", { name: "Set from app", exact: true })
      .click();
    await expect(first).toContainText("10");
    await expect(page.getByTestId("events")).toHaveText("Events: 2");
    await page.getByRole("button", { name: "Toggle fixture" }).click();
    await expect(page.locator("chaos-internal-probe")).toHaveCount(1);
    await page.getByRole("button", { name: "Toggle fixture" }).click();
    await expect(page.locator("chaos-internal-probe")).toHaveCount(2);
    await expect(first).toContainText("10");
    await first.click();
    await expect(page.getByTestId("value")).toHaveText("Value: 11");
    await expect(page.getByTestId("events")).toHaveText("Events: 3");
    await second.click();
    await expect(second).toContainText("1");
    expect(errors).toEqual([]);
    await page.screenshot({
      path: `output/playwright/${framework}-${isMobile ? "mobile" : "desktop"}.png`,
      fullPage: true,
    });
  });
}
test("gallery, demo completion, snippets and reduced motion", async ({
  page,
  isMobile,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("http://127.0.0.1:5173");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Ridiculous",
  );
  await page.getByRole("button", { name: /03 \/ SOUND WORKOUT/ }).click();
  await expect(page.getByText("Selected: Volume Gym")).toBeVisible();
  const gym = page.locator("chaos-volume-gym-element");
  const slider = gym.getByRole("slider", { name: "Âm lượng" });
  await expect(slider).toHaveAttribute("aria-valuenow", "35");
  for (let n = 0; n < 3; n++)
    await gym.getByRole("button", { name: "Tăng âm lượng" }).click();
  await expect(slider).toHaveAttribute("aria-valuenow", "38");
  await page.getByRole("button", { name: "Angular", exact: true }).click();
  await expect(page.locator(".code pre")).toContainText("formControl");
  await page.getByRole("button", { name: /Về mức 35/ }).click();
  await expect(slider).toHaveAttribute("aria-valuenow", "35");
  expect(
    await gym.locator(".weight").evaluate((el) => getComputedStyle(el).transitionDuration),
  ).toBe("0s");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
  await page.screenshot({
    path: `output/playwright/playground-${isMobile ? "mobile" : "desktop"}.png`,
    fullPage: true,
  });
});
