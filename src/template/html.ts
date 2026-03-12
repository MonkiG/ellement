import type { TemplateResult } from "./types";

export function html(
  strings: TemplateStringsArray,
  ...values: unknown[]
): TemplateResult {
  return {
    strings,
    values,
    type: "html",
  };
}
