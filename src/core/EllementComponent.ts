import type { TemplateResult } from "../template/types";

type PropType = StringConstructor | NumberConstructor | BooleanConstructor;

type EllementProp = {
  type: PropType;
  reflect?: boolean;
};

export default abstract class EllementComponent extends HTMLElement {
  protected root: HTMLElement | ShadowRoot;
  private _renderScheduled = false;
  protected static useShadow = true;
  static styles?: TemplateResult; //Todo! handle static styles with reactive styles

  static props?: Record<string, EllementProp>;
  static styles?: TemplateResult;

  constructor() {
    super();
    const ctor = this.constructor as typeof EllementComponent;
    this.root = ctor.useShadow ? this.attachShadow({ mode: "open" }) : this;
  }

  connectedCallback() {
    this._render();
  }

  requestRender(){
    if(this._renderScheduled) return;
    
    this._renderScheduled = true;

    queueMicrotask(() => {
      this._renderScheduled = false;
      this._render();
    })
  }

  state<T>(initial: T) {
    let value = initial;

    const setState = (updater: (prev: T) => T) => {
      value = updater(value);
      this.requestRender();
    };

    return {
      get value() {
        return value;
      },
      setState,
    };
  }

  private _render(): void {
    const tpl = this.render();

    let html = "";

    tpl.strings.forEach((str, i) => {
      html += str;
      if (i < tpl.values.length) {
        html += tpl.values[i];
      }
    });

    this.root.innerHTML = html;

    this.events(); // registrar eventos
  }

  protected events(): void {}

  abstract render(): TemplateResult;
}
