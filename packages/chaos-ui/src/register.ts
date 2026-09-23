/** Register one element in a browser; no-op without a registry or for the same constructor.
 * Throws on a conflicting constructor so duplicate versions cannot silently misbehave.
 * @param name Hyphenated custom element tag.
 * @param element Element definition; importing its module must not register it.
 * @param registry Target registry; defaults to the current browser registry, if present.
 * @returns Whether a new definition was registered.
 * @example registerElement('my-chaos-input', MyChaosInput);
 */
export function registerElement(
  name: string,
  element: CustomElementConstructor,
  registry: CustomElementRegistry | undefined = globalThis.customElements,
): boolean {
  if (!registry) return false;
  const existing = registry.get(name);
  if (existing === element) return false;
  if (existing)
    throw new Error(
      `Custom element ${name} already has a different definition`,
    );
  registry.define(name, element);
  return true;
}
