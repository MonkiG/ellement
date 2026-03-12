import { css, html } from "../template";
import EllementComponent from "../core/EllementComponent";

export default class CounterElement extends EllementComponent {
  counterState = this.state({
    count: 0,
    color: 'black'
  });

  render() {
    return { 
      styles: css`
        :host {
          display: inline-block;
          padding: 16px;
          border-radius: 8px;
          font-family: sans-serif;
          border: 1px solid #ccc;
          background: ${this.counterState.value.color === 'black' ? 'black' : 'white'};
          color: ${this.counterState.value.color === 'black' ? 'white' : 'black'};
          transition: background 0.2s, color 0.2s;
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
      `,
      html: html`
        <button id="color">Change color to ${this.counterState.value.color === 'black' ? 'white' : 'black'}</button>
        <button id="dec">-</button>
        <span>${this.counterState.value.count}</span>
        <button id="inc">+</button>
      `
    }
  }

  events() {
    this.root.querySelector("#color")?.addEventListener("click", () => {
      this.counterState.setState((v) => ({ ...v, color: v.color === 'black' ? 'white' : 'black' }));
    });

    this.root.querySelector("#inc")?.addEventListener("click", () => {
      this.counterState.setState((v) => ({ ...v, count: v.count + 1 }));
    });

    this.root.querySelector("#dec")?.addEventListener("click", () => {
      this.counterState.setState((v) => ({ ...v, count: v.count - 1 }));
    });
  }
}

customElements.define("counter-element", CounterElement);
