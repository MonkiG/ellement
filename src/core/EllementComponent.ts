import { htmlParser, isRenderObject } from "../template";
import type { TemplateResult } from "../template/types";
import EllementRuntime from "./runtime";

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
  _hooks: unknown[] = [];

  static props?: Record<string, EllementProp>;

  constructor() {
    super();
    this.ellementCtor = this.constructor as typeof EllementComponent;
    this.root = this.ellementCtor.useShadow
      ? this.attachShadow({ mode: "open" })
      : this;
  }

  connectedCallback() {
    this.#_render();
  }

  requestRender() {
    if (this._renderScheduled) return;
    this._renderScheduled = true;

    queueMicrotask(() => {
      this._renderScheduled = false;
      this.#_render();
    });
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

  #_render(): void {
    EllementRuntime.begin(this);
    console.log("EllementRuntime Setted");
    try {
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
    } finally {
      EllementRuntime.end();
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
