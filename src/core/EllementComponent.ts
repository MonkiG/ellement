import { htmlParser, isRenderObject } from "../template";
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

    const setState = (next: T | ((prev: T) => T)) => {
      const newValue =
        typeof next === "function"
          ? (next as (prev: T) => T)(value)
          : next;

      if (Object.is(value, newValue)) return;

      value = newValue;
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
    const result = this.render();

    let html: TemplateResult;
    let styles: TemplateResult | undefined;

    if (isRenderObject(result)) {
      html = result.html;
      styles = result.styles;
    } else {
      html = result;
    }

    this.root.innerHTML = htmlParser(html, styles);
    
    this.events();
  }

  protected events(): void {}

  abstract render(): TemplateResult | {
    styles?: TemplateResult;
    html: TemplateResult
  };
}
