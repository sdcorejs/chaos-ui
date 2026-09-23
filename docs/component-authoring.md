# Author a component

Start with one concrete interaction and its memorable ending. Keep the core class in its component module and export a separate `registerX()` function from that component's registration entrypoint. Do not use `@customElement` or root-level eager registration. Importing one component must never load/register the entire collection.

1. Define controlled properties, user events and state transitions. Document types, defaults, validation and event payloads with `@example` JSDoc. Read [AGENTS.md](../AGENTS.md) before implementation.
2. For OTP, use positional `(string | null)[]` slots and validate each filled slot as one decimal digit. Preserve repeated digits and leading zeroes. Submit only a complete string, alongside clearly defined event detail. Never pass a secret/correct code into the component. The host owns verifying/success/error results.
3. Build the game in Lit with semantic controls. Provide mouse/touch/keyboard and click/select equivalents of dragging. Manage focus and announce completion without excessive live-region noise.
4. Make reduced motion a first-class path. Keep sound off; enabling it requires deliberate user input. Cancel resources and active pointer capture on disconnect, cancellation or state transitions. Ensure reconnect works and instances never share mutable game state.
5. Keep styles local and document CSS variables and `part` names. Bundle assets or include them in the npm package; never reference `/playground/...`. Use SVG/CSS before introducing an animation/physics dependency.
6. Add thin React and standalone Angular wrappers. Host property updates must not dispatch user-change. Register lazily and explicitly per component, with no DOM access during Node import.
7. Add per-component exports, declarations and authoring examples in both frameworks. If an import gains top-level effects, update `sideEffects` with precise module/CSS paths and test tree-shaking.
8. Test transitions, repeated digits, incomplete slot serialization, host updates, event counts, keyboard/touch, instance isolation and teardown. Run packed consumers and desktop/mobile browser checks; record evidence and unverified cases.

## Internal probe reference

The probe is controlled: a native button dispatches `CustomEvent<{ value: number }>('chaos-change')`, bubbling and composed, only on user activation. The app applies `value`; application updates do not emit. It has no global listeners, timers, audio or pointer capture to clean up. Lit owns its template listener, React owns event mapping, and Angular owns template output cleanup. Tests unmount/reconnect it and inspect event counts.

Private styling reference: `--chaos-probe-accent` (default `#dcfa69`) and `part="button"`. These are fixture APIs only, not public component styling promises.
