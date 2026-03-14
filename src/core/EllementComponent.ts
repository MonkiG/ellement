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
  static styles?: TemplateResult;
  private ellementCtor: typeof EllementComponent;
  private _eventsInitialized = false;

  static props?: Record<string, EllementProp>;

  constructor() {
    super();
    this.ellementCtor = this.constructor as typeof EllementComponent;
    this.root = this.ellementCtor.useShadow
      ? this.attachShadow({ mode: "open" })
      : this;
  }

  connectedCallback() {
    this._render();
  }

  requestRender() {
    if (this._renderScheduled) return;
    this._renderScheduled = true;

    queueMicrotask(() => {
      this._renderScheduled = false;
      this._render();
    });
  }

  state<T>(initial: T) {
    let value = initial;

    const setState = (next: T | ((prev: T) => T)) => {
      const newValue =
        typeof next === "function" ? (next as (prev: T) => T)(value) : next;

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

  protected on<K extends keyof HTMLElementEventMap>(
    event: K,
    selector: string,
    handler: (
      e: HTMLElementEventMap[K],
      el: HTMLElement | EllementComponent,
    ) => void,
  ) {
    this.root.addEventListener(event, (e) => {
      const path = e.composedPath() as HTMLElement[];

      for (const node of path) {
        if (!(node instanceof HTMLElement)) continue;

        if (node.matches(selector)) {
          handler(e as HTMLElementEventMap[K], node);
          return;
        }

        if (node === this.root) break;
      }
    });
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

    this.root.innerHTML = htmlParser(html, this.ellementCtor.styles, styles);

    if (!this._eventsInitialized) {
      this._eventsInitialized = true;
      this.events();
    }
  }

  protected events(): void {}

  abstract render():
    | TemplateResult
    | {
        styles?: TemplateResult;
        html: TemplateResult;
      };
}
