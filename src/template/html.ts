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

export function htmlParser(html: TemplateResult, css?: TemplateResult): string {
  let htmlString = "";
  let cssString = "";

  html.strings.forEach((str, i) => {
    htmlString += str;
    if (i < html.values.length) {
      htmlString += normalizeValue(html.values[i]);
    }
  });

  if (css) {
    css.strings.forEach((str, i) => {
      cssString += str;
      if (i < css.values.length) {
        cssString += normalizeValue(css.values[i]);
      }
    });
  }

  return (cssString ? `<style>${cssString}</style>` : "") + htmlString;
}


export function isRenderObject(
  result: TemplateResult | {
    styles?: TemplateResult;
    html: TemplateResult;
  }
): result is { styles?: TemplateResult; html: TemplateResult } {
  return typeof result === "object" && "html" in result;
}

function normalizeValue(value: unknown): string {
  if(value == null || value === false) return ""
  if(Array.isArray(value)) return value.map(normalizeValue).join("");
  return String(value)
}