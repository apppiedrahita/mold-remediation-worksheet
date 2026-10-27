import type { PDFFont, PDFPage } from "pdf-lib";
import { rgb } from "pdf-lib";

export const ink = rgb(0.07, 0.07, 0.07);
export const rule = rgb(0.12, 0.12, 0.12);
export const headerFill = rgb(0.93, 0.93, 0.93);
export const white = rgb(1, 1, 1);

export type Align = "left" | "center" | "right";

export interface TextOptions {
  font: PDFFont;
  size: number;
  color?: ReturnType<typeof rgb>;
  align?: Align;
  padX?: number;
}

export function drawLine(
  page: PDFPage,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  thickness = 0.6,
): void {
  page.drawLine({
    start: { x: x1, y: y1 },
    end: { x: x2, y: y2 },
    thickness,
    color: rule,
  });
}

export function drawRect(
  page: PDFPage,
  x: number,
  y: number,
  width: number,
  height: number,
  thickness = 0.6,
  fill?: ReturnType<typeof rgb>,
): void {
  if (fill) {
    page.drawRectangle({
      x,
      y,
      width,
      height,
      color: fill,
      borderColor: rule,
      borderWidth: thickness,
    });
    return;
  }
  page.drawRectangle({
    x,
    y,
    width,
    height,
    borderColor: rule,
    borderWidth: thickness,
  });
}

export function fitText(font: PDFFont, text: string, size: number, maxWidth: number): {
  text: string;
  size: number;
} {
  if (text === "") {
    return { text, size };
  }

  let currentSize = size;
  while (currentSize > 5.2) {
    if (font.widthOfTextAtSize(text, currentSize) <= maxWidth) {
      return { text, size: currentSize };
    }
    currentSize -= 0.25;
  }

  let clipped = text;
  while (clipped.length > 0) {
    const candidate = `${clipped}…`;
    if (font.widthOfTextAtSize(candidate, currentSize) <= maxWidth) {
      return { text: candidate, size: currentSize };
    }
    clipped = clipped.slice(0, -1);
  }

  return { text: "", size: currentSize };
}

export function drawFittedText(
  page: PDFPage,
  raw: string,
  x: number,
  y: number,
  width: number,
  height: number,
  options: TextOptions,
): void {
  const value = raw.trim();
  if (value === "") {
    return;
  }

  const padX = options.padX ?? 3;
  const maxWidth = Math.max(4, width - padX * 2);
  const fitted = fitText(options.font, value, options.size, maxWidth);
  const textWidth = options.font.widthOfTextAtSize(fitted.text, fitted.size);
  const align = options.align ?? "left";

  let textX = x + padX;
  if (align === "center") {
    textX = x + (width - textWidth) / 2;
  } else if (align === "right") {
    textX = x + width - padX - textWidth;
  }

  const textY = y + (height - fitted.size) / 2 + 0.4;

  page.drawText(fitted.text, {
    x: textX,
    y: textY,
    size: fitted.size,
    font: options.font,
    color: options.color ?? ink,
  });
}

export function wrapToWidth(
  font: PDFFont,
  text: string,
  size: number,
  maxWidth: number,
): string[] {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (normalized === "") {
    return [];
  }

  const lines: string[] = [];
  for (const paragraph of normalized.split("\n")) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    let current = "";
    for (const word of words) {
      const next = current === "" ? word : `${current} ${word}`;
      if (font.widthOfTextAtSize(next, size) <= maxWidth) {
        current = next;
      } else {
        if (current !== "") {
          lines.push(current);
        }
        if (font.widthOfTextAtSize(word, size) <= maxWidth) {
          current = word;
        } else {
          const fitted = fitText(font, word, size, maxWidth);
          lines.push(fitted.text);
          current = "";
        }
      }
    }
    if (current !== "") {
      lines.push(current);
    }
  }
  return lines;
}

export function drawCircledToken(
  page: PDFPage,
  raw: string,
  token: string,
  x: number,
  y: number,
  width: number,
  height: number,
  options: TextOptions,
): void {
  const value = raw.trim();
  if (value === "" || !value.includes(token)) {
    return;
  }

  const padX = options.padX ?? 3;
  const maxWidth = Math.max(4, width - padX * 2);
  const fitted = fitText(options.font, value, options.size, maxWidth);
  if (!fitted.text.includes(token)) {
    return;
  }

  const prefix = fitted.text.slice(0, fitted.text.indexOf(token));
  const prefixWidth = options.font.widthOfTextAtSize(prefix, fitted.size);
  const tokenWidth = options.font.widthOfTextAtSize(token, fitted.size);
  const textWidth = options.font.widthOfTextAtSize(fitted.text, fitted.size);
  const align = options.align ?? "left";

  let textX = x + padX;
  if (align === "center") {
    textX = x + (width - textWidth) / 2;
  } else if (align === "right") {
    textX = x + width - padX - textWidth;
  }

  const textY = y + (height - fitted.size) / 2 + 0.4;
  page.drawEllipse({
    x: textX + prefixWidth + tokenWidth / 2,
    y: textY + fitted.size * 0.35,
    xScale: tokenWidth / 2 + 1.7,
    yScale: fitted.size / 2 + 1.5,
    borderWidth: 0.95,
    borderColor: options.color ?? ink,
  });
}

export function drawCheck(
  page: PDFPage,
  x: number,
  y: number,
  width: number,
  height: number,
  font: PDFFont,
): void {
  drawFittedText(page, "X", x, y, width, height, {
    font,
    size: Math.min(9, height - 2),
    align: "center",
  });
}
