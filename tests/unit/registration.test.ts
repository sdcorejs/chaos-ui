import { describe, expect, it } from "vitest";
import { registerElement } from "../../packages/chaos-ui/src/register";
describe("explicit registration", () => {
  it("does not require a DOM", () => {
    expect(
      registerElement("chaos-test", class {} as CustomElementConstructor),
    ).toBe(false);
  });
  it("defines only the requested tag once and rejects version collisions", () => {
    const entries = new Map<string, CustomElementConstructor>();
    let count = 0;
    const registry = {
      get: (name: string) => entries.get(name),
      define: (name: string, value: CustomElementConstructor) => {
        entries.set(name, value);
        count++;
      },
    } as CustomElementRegistry;
    const element = class {} as CustomElementConstructor;
    expect(registerElement("chaos-one", element, registry)).toBe(true);
    expect(registerElement("chaos-one", element, registry)).toBe(false);
    expect(count).toBe(1);
    expect([...entries.keys()]).toEqual(["chaos-one"]);
    expect(() =>
      registerElement(
        "chaos-one",
        class {} as CustomElementConstructor,
        registry,
      ),
    ).toThrow("different definition");
  });
});
