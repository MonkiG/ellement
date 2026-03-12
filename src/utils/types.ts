export type TemplateType = "html" | "css";

export interface TemplateResult {
  strings: TemplateStringsArray;
  values: unknown[];
  type: TemplateType;
}
