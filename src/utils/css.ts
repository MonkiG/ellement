import type { TemplateResult } from "./types";

export function css(
  strings: TemplateStringsArray,
  ...values: unknown[]
): TemplateResult {
  return {
    strings,
    values,
    type: "css",
  };
}
