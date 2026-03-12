import { html } from "../template";
import EllementComponent from "../core/EllementComponent";

export default class CounterElement extends EllementComponent {
  count = this.state(0);

  render() {
    return html`
      <button id="dec">-</button>
      <span>${this.count.value}</span>
      <button id="inc">+</button>
    `;
  }

  events() {
    this.root.querySelector("#inc")?.addEventListener("click", () => {
      this.count.setState((v) => v + 1);
    });

    this.root.querySelector("#dec")?.addEventListener("click", () => {
      this.count.setState((v) => v - 1);
    });
  }
}

customElements.define("counter-element", CounterElement);
