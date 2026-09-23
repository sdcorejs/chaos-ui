import { html } from "lit";

// These transparent frames ship in the npm package. Resolving a URL is safe
// during a Node import; images load only when the element is rendered.
const open = new URL("../../assets/infinity-glove-open.png", import.meta.url).href;
const contact = new URL("../../assets/infinity-glove-snap-contact.png", import.meta.url).href;
const release = new URL("../../assets/infinity-glove-snap-release.png", import.meta.url).href;

/** Front-facing idle art cuts to a side view of finger contact and release. */
export const gloveArtwork = html`<div part="gauntlet" class="gauntlet" aria-hidden="true">
  <img class="glove-frame glove-open" src=${open} alt="" draggable="false" />
  <img class="glove-frame glove-contact" src=${contact} alt="" draggable="false" />
  <img class="glove-frame glove-release" src=${release} alt="" draggable="false" />
  <span class="snap-flash" aria-hidden="true"></span>
</div>`;
