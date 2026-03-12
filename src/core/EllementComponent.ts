import type { TemplateResult } from "../template/types";

type PropType = StringConstructor | NumberConstructor | BooleanConstructor;

type EllementProp = {
  type: PropType;
  reflect?: boolean;
};

export default abstract class EllementComponent extends HTMLElement {
  protected root: HTMLElement | ShadowRoot;
  private _renderScheduled = false;

  static props?: Record<string, EllementProp>;
  static styles?: TemplateResult;

  constructor() {
    super();
    this.root = this;
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
