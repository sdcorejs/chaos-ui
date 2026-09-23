import { LitElement, css, html } from "lit";

/** Repository-only interaction fixture; excluded from published files and exports. */
export class ChaosProbe extends LitElement {
  static override properties = { value: { type: Number } };
  static override styles = css`
    :host {
      display: inline-block;
      font-family: inherit;
    }
    button {
      font: inherit;
      font-weight: 800;
      border: 2px solid #20231f;
      border-radius: 100px;
      background: var(--chaos-probe-accent, #dcfa69);
      color: #20231f;
      padding: 1.1rem 1.5rem;
      box-shadow: 0 5px 0 #20231f;
      cursor: pointer;
      touch-action: manipulation;
      transition: transform 0.15s;
    }
    button:active {
      transform: translateY(4px);
      box-shadow: 0 1px 0 #20231f;
    }
    button:focus-visible {
      outline: 3px solid #7154d8;
      outline-offset: 5px;
    }
    @media (prefers-reduced-motion: reduce) {
      button {
        transition: none;
      }
    }
  `;
  declare value: number;
  constructor() {
    super();
    this.value = 0;
  }
  private activate() {
    this.dispatchEvent(
      new CustomEvent<{ value: number }>("chaos-change", {
        detail: { value: this.value + 1 },
        bubbles: true,
        composed: true,
      }),
    );
  }
  override render() {
    return html`<button part="button" @click=${this.activate}>
      ${this.value >= 3 ? "✦ Gloriously unnecessary!" : "Give chaos a nudge"}
      <span>${this.value}</span>
    </button>`;
  }
}
