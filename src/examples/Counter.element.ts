import { css, html } from "../template";
import EllementComponent from "../core/EllementComponent";
import { state } from "../hooks/state";

type CounterState = {
  count: number;
  color: "black" | "white";
};

export default class CounterElement extends EllementComponent {
  private counterState!: ReturnType<typeof state<CounterState>>

  static styles = css`
    :host {
      display: inline-block;
      padding: 16px;
      border-radius: 8px;
      font-family: sans-serif;
      border: 1px solid #ccc;
      transition:
        background 0.2s,
        color 0.2s;
    }

    button {
      margin: 4px;
      padding: 6px 10px;
      border: 1px solid #888;
      border-radius: 4px;
      cursor: pointer;
      background: #f5f5f5;
    }

    span {
      margin: 0 8px;
      font-weight: bold;
      font-size: 18px;
    }
  `;

  render() {
    this.counterState = state<CounterState>({
      count: 0,
      color: "black",
    });

    return {
      styles: css`
        :host {
          background: ${this.counterState.value.color === "black" ? "black" : "white"};
          color: ${this.counterState.value.color === "black" ? "white" : "black"};
        }
      `,
      html: html`
        <button id="color">
          Change color to ${this.counterState.value.color === "black" ? "white" : "black"}
        </button>
        <button id="dec">-</button>
        <span>${this.counterState.value.count}</span>
        <button id="inc">+</button>
      `,
    };
  }

  events() {
    this.on("click", "#color", () => {
      this.counterState.set((v) => ({
        ...v,
        color: v.color === "black" ? "white" : "black",
      }));
    });

    this.on("click", "#inc", () => {
      this.counterState.set((v) => ({ ...v, count: v.count + 1 }));
    });

    this.on("click", "#dec", () => {
      this.counterState.set((v) => ({ ...v, count: v.count - 1 }));
    });
  }
}

customElements.define("counter-element", CounterElement);
