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

export function htmlParser(
  html: TemplateResult,
  staticCss?: TemplateResult,
  reactiveCss?: TemplateResult,
): string {
  let htmlString = "";
  let cssString = "";

  html.strings.forEach((str, i) => {
    htmlString += str;
    if (i < html.values.length) {
      htmlString += normalizeValue(html.values[i]);
    }
  });

  if (staticCss) {
    staticCss.strings.forEach((str, i) => {
      cssString += str;
      if (i < staticCss.values.length) {
        cssString += normalizeValue(staticCss.values[i]);
      }
    });
  }

  if (reactiveCss) {
    reactiveCss.strings.forEach((str, i) => {
      cssString += str;
      if (i < reactiveCss.values.length) {
        cssString += normalizeValue(reactiveCss.values[i]);
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