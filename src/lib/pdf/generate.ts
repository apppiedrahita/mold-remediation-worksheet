import { PDFDocument, StandardFonts } from "pdf-lib";
import {
  CHEMICALS,
  EQUIPMENT_LEFT,
  EQUIPMENT_RIGHT,
  PPE_ITEMS,
  SUPPLIES,
  WORK_LEFT,
  WORK_RIGHT,
} from "@/data/catalog";
import { formatFormDate, formatFormTime } from "@/lib/format";
import {
  drawCheck,
  drawCircledToken,
  drawFittedText,
  drawLine,
  drawRect,
  headerFill,
  wrapToWidth,
  type Align,
} from "@/lib/pdf/draw";
import type { PDFFont, PDFPage } from "pdf-lib";
import type { WorksheetFormData, YesNoValue } from "@/types/form";

const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN_X = 30;
const MARGIN_TOP = 24;
const CONTENT_W = PAGE_W - MARGIN_X * 2;
const COL_GAP = 6;
const HALF = (CONTENT_W - COL_GAP) / 2;

interface Fonts {
  regular: PDFFont;
  bold: PDFFont;
}

interface CellSpec {
  text: string;
  width: number;
  font: PDFFont;
  size: number;
  align?: Align;
  fill?: boolean;
  check?: boolean;
}

function drawRow(
  page: PDFPage,
  x: number,
  top: number,
  height: number,
  cells: CellSpec[],
): void {
  let cursor = x;
  for (const cell of cells) {
    drawRect(
      page,
      cursor,
      top - height,
      cell.width,
      height,
      0.55,
      cell.fill ? headerFill : undefined,
    );
    if (cell.check) {
      drawCheck(page, cursor, top - height, cell.width, height, cell.font);
    } else {
      drawFittedText(page, cell.text, cursor, top - height, cell.width, height, {
        font: cell.font,
        size: cell.size,
        align: cell.align ?? "left",
        padX: cell.align === "center" ? 2 : 3.2,
      });
    }
    cursor += cell.width;
  }
}

function splitTriple(width: number, leftShare = 0.62, midShare = 0.18): [number, number, number] {
  const left = width * leftShare;
  const mid = width * midShare;
  return [left, mid, width - left - mid];
}

function yesNoCells(
  fonts: Fonts,
  width: number,
  label: string,
  value: YesNoValue,
  header = false,
): CellSpec[] {
  const [labelW, yesW, noW] = splitTriple(width, 0.6, 0.2);
  if (header) {
    return [
      { text: label, width: labelW, font: fonts.bold, size: 7, align: "center", fill: true },
      { text: "Yes", width: yesW, font: fonts.bold, size: 7, align: "center", fill: true },
      { text: "No", width: noW, font: fonts.bold, size: 7, align: "center", fill: true },
    ];
  }
  return [
    { text: label, width: labelW, font: fonts.regular, size: 7.1 },
    {
      text: "",
      width: yesW,
      font: fonts.bold,
      size: 8,
      align: "center",
      check: value === "yes",
    },
    {
      text: "",
      width: noW,
      font: fonts.bold,
      size: 8,
      align: "center",
      check: value === "no",
    },
  ];
}

export async function generateWorksheetPdf(data: WorksheetFormData): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([PAGE_W, PAGE_H]);
  const fonts: Fonts = {
    regular: await doc.embedFont(StandardFonts.Helvetica),
    bold: await doc.embedFont(StandardFonts.HelveticaBold),
  };

  let top = PAGE_H - MARGIN_TOP;
  const left = MARGIN_X;

  const titleH = 18;
  drawRect(page, left, top - titleH, CONTENT_W, titleH, 0.7);
  drawFittedText(page, "Mold Remediation Worksheet", left, top - titleH, CONTENT_W, titleH, {
    font: fonts.bold,
    size: 12,
    align: "center",
  });
  top -= titleH;

  const jobH = 15.4;
  const jobLabelW = CONTENT_W * 0.32;
  const jobValueW = CONTENT_W - jobLabelW;
  const jobRows: Array<[string, string]> = [
    ["Name/Place", data.namePlace],
    ["Address (include room/unit #)", data.address],
    ["Type of Work", data.typeOfWork],
    ["Supervisor(s)", data.supervisors],
    ["Technician(s)", data.technicians],
  ];

  for (const [label, value] of jobRows) {
    drawRow(page, left, top, jobH, [
      { text: label, width: jobLabelW, font: fonts.regular, size: 8 },
      { text: value, width: jobValueW, font: fonts.regular, size: 9 },
    ]);
    top -= jobH;
  }

  const dateHeaderH = 12.5;
  const dateValueH = 16;
  const dateW = CONTENT_W * 0.5;
  const timeW = CONTENT_W * 0.25;
  drawRow(page, left, top, dateHeaderH, [
    { text: "DATE", width: dateW, font: fonts.bold, size: 8, align: "center", fill: true },
    { text: "Start Time", width: timeW, font: fonts.bold, size: 8, align: "center", fill: true },
    { text: "End Time", width: timeW, font: fonts.bold, size: 8, align: "center", fill: true },
  ]);
  top -= dateHeaderH;
  drawRow(page, left, top, dateValueH, [
    {
      text: formatFormDate(data.date),
      width: dateW,
      font: fonts.regular,
      size: 10,
      align: "center",
    },
    {
      text: formatFormTime(data.startTime),
      width: timeW,
      font: fonts.regular,
      size: 10,
      align: "center",
    },
    {
      text: formatFormTime(data.endTime),
      width: timeW,
      font: fonts.regular,
      size: 10,
      align: "center",
    },
  ]);
  top -= dateValueH + 5;

  const equipH = 13.4;
  const [eqLabelW, eqQtyW, eqDateW] = splitTriple(HALF, 0.62, 0.16);

  const drawEquipmentTable = (
    x: number,
    items: typeof EQUIPMENT_LEFT | typeof EQUIPMENT_RIGHT,
    extraBlank = false,
  ): void => {
    let rowTop = top;
    drawRow(page, x, rowTop, equipH, [
      { text: "EQUIPMENT PLACED", width: eqLabelW, font: fonts.bold, size: 7, align: "center", fill: true },
      { text: "Qty", width: eqQtyW, font: fonts.bold, size: 7, align: "center", fill: true },
      { text: "Date", width: eqDateW, font: fonts.bold, size: 7, align: "center", fill: true },
    ]);
    rowTop -= equipH;
    for (const item of items) {
      const entry = data.equipment[item.id];
      drawRow(page, x, rowTop, equipH, [
        { text: item.label, width: eqLabelW, font: fonts.regular, size: 6.8 },
        { text: entry.qty, width: eqQtyW, font: fonts.regular, size: 8, align: "center" },
        {
          text: formatFormDate(entry.date),
          width: eqDateW,
          font: fonts.regular,
          size: 7.2,
          align: "center",
        },
      ]);
      if (item.id === "airScrubberSM" && (entry.size === "S" || entry.size === "M")) {
        drawCircledToken(
          page,
          item.label,
          `(${entry.size})`,
          x,
          rowTop - equipH,
          eqLabelW,
          equipH,
          {
            font: fonts.regular,
            size: 6.8,
            padX: 3.2,
          },
        );
      }
      rowTop -= equipH;
    }
    if (extraBlank) {
      drawRow(page, x, rowTop, equipH, [
        { text: "", width: eqLabelW, font: fonts.regular, size: 7 },
        { text: "", width: eqQtyW, font: fonts.regular, size: 7 },
        { text: "", width: eqDateW, font: fonts.regular, size: 7 },
      ]);
    }
  };

  drawEquipmentTable(left, EQUIPMENT_LEFT);
  drawEquipmentTable(left + HALF + COL_GAP, EQUIPMENT_RIGHT, true);
  top -= equipH * 5 + 5;

  const supplyH = 11.15;
  const [supLabelW, supUnitW, supQtyW] = splitTriple(HALF, 0.58, 0.22);

  const headerCells = (title: string): CellSpec[] => [
    { text: title, width: supLabelW, font: fonts.bold, size: 7, align: "center", fill: true },
    { text: "UNIT", width: supUnitW, font: fonts.bold, size: 7, align: "center", fill: true },
    { text: "QUANTITY", width: supQtyW, font: fonts.bold, size: 7, align: "center", fill: true },
  ];

  const itemCells = (label: string, unit: string, qty: string): CellSpec[] => [
    { text: label, width: supLabelW, font: fonts.regular, size: 6.6 },
    { text: unit, width: supUnitW, font: fonts.regular, size: 6.6, align: "center" },
    { text: qty, width: supQtyW, font: fonts.regular, size: 7.4, align: "center" },
  ];

  const blankCells = (): CellSpec[] => [
    { text: "", width: supLabelW, font: fonts.regular, size: 7 },
    { text: "", width: supUnitW, font: fonts.regular, size: 7 },
    { text: "", width: supQtyW, font: fonts.regular, size: 7 },
  ];

  const leftX = left;
  const rightX = left + HALF + COL_GAP;
  let rowTop = top;

  drawRow(page, leftX, rowTop, supplyH, headerCells("SUPPLIES USED"));
  drawRow(page, rightX, rowTop, supplyH, headerCells("PPE"));
  rowTop -= supplyH;

  for (let index = 0; index < 7; index += 1) {
    const supply = SUPPLIES[index];
    const ppe = PPE_ITEMS[index];
    if (!supply || !ppe) {
      continue;
    }
    drawRow(page, leftX, rowTop, supplyH, itemCells(supply.label, supply.unit, data.supplies[supply.id]));
    drawRow(page, rightX, rowTop, supplyH, itemCells(ppe.label, ppe.unit, data.ppe[ppe.id]));
    rowTop -= supplyH;
  }

  const blackBags = SUPPLIES[7];
  if (blackBags) {
    drawRow(
      page,
      leftX,
      rowTop,
      supplyH,
      itemCells(blackBags.label, blackBags.unit, data.supplies[blackBags.id]),
    );
    drawRow(page, rightX, rowTop, supplyH, blankCells());
    rowTop -= supplyH;
  }

  const vacBrushes = SUPPLIES[8];
  if (vacBrushes) {
    drawRow(
      page,
      leftX,
      rowTop,
      supplyH,
      itemCells(vacBrushes.label, vacBrushes.unit, data.supplies[vacBrushes.id]),
    );
    drawRow(page, rightX, rowTop, supplyH, headerCells("SUPPLIES USED"));
    rowTop -= supplyH;
  }

  const remainingSupplies = SUPPLIES.slice(9);
  for (let index = 0; index < CHEMICALS.length; index += 1) {
    const chemical = CHEMICALS[index];
    if (!chemical) {
      continue;
    }
    const supply = remainingSupplies[index];
    if (supply) {
      drawRow(
        page,
        leftX,
        rowTop,
        supplyH,
        itemCells(supply.label, supply.unit, data.supplies[supply.id]),
      );
    } else {
      drawRow(page, leftX, rowTop, supplyH, blankCells());
    }
    drawRow(
      page,
      rightX,
      rowTop,
      supplyH,
      itemCells(chemical.label, chemical.unit, data.chemicals[chemical.id]),
    );
    rowTop -= supplyH;
  }

  top = rowTop - 5;

  const workH = 12.6;
  drawRow(page, leftX, top, workH, yesNoCells(fonts, HALF, "", "", true));
  drawRow(page, rightX, top, workH, yesNoCells(fonts, HALF, "", "", true));
  top -= workH;

  for (let index = 0; index < 3; index += 1) {
    const leftWork = WORK_LEFT[index];
    const rightWork = WORK_RIGHT[index];
    if (!leftWork || !rightWork) {
      continue;
    }
    drawRow(page, leftX, top, workH, yesNoCells(fonts, HALF, leftWork.label, data.work[leftWork.id]));
    drawRow(page, rightX, top, workH, yesNoCells(fonts, HALF, rightWork.label, data.work[rightWork.id]));
    top -= workH;
  }

  drawRow(page, leftX, top, workH, yesNoCells(fonts, HALF, "", ""));
  drawRow(page, rightX, top, workH, yesNoCells(fonts, HALF, "", ""));
  top -= workH + 10;

  const notesBoxW = 58;
  const notesBoxH = 11;
  drawRect(page, left, top - notesBoxH, notesBoxW, notesBoxH, 0.7);
  drawFittedText(page, "NOTES", left, top - notesBoxH, notesBoxW, notesBoxH, {
    font: fonts.bold,
    size: 8,
    align: "center",
  });
  top -= notesBoxH + 3;

  const noteLines = 4;
  const noteSize = 8.5;
  const bottomLimit = 28;
  const available = Math.max(noteLines * 15, top - bottomLimit);
  const noteLineH = available / noteLines;
  const wrapped = wrapToWidth(fonts.regular, data.notes, noteSize, CONTENT_W - 4).slice(0, noteLines);

  for (let index = 0; index < noteLines; index += 1) {
    const lineY = top - (index + 1) * noteLineH;
    drawLine(page, left, lineY, left + CONTENT_W, lineY, 0.6);
    const lineText = wrapped[index] ?? "";
    if (lineText) {
      page.drawText(lineText, {
        x: left + 2,
        y: lineY + 4.2,
        size: noteSize,
        font: fonts.regular,
      });
    }
  }

  doc.setTitle("Mold Remediation Worksheet");
  doc.setSubject("Demonstration worksheet generated in the browser");
  doc.setCreator("Mold Remediation Worksheet Demo");

  return doc.save();
}

export function buildPdfFilename(data: WorksheetFormData): string {
  const site = data.namePlace
    .trim()
    .replace(/[^\w]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  const datePart = data.date ? data.date.replace(/-/g, "") : "draft";
  const suffix = site === "" ? "worksheet" : site;
  return `Mold-Remediation-Worksheet-${datePart}-${suffix}.pdf`;
}
