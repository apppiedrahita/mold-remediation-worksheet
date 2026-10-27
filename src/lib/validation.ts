import { REQUIRED_JOB_FIELDS } from "@/data/catalog";
import type { FieldErrorMap, WorksheetFormData } from "@/types/form";

const QUANTITY_PATTERN = /^(?:\d+(?:\.\d+)?|\d+\/\d+)$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^\d{2}:\d{2}$/;

export function isFilled(value: string): boolean {
  return value.trim().length > 0;
}

export function isValidQuantity(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed === "") {
    return true;
  }
  if (!QUANTITY_PATTERN.test(trimmed)) {
    return false;
  }
  if (trimmed.includes("/")) {
    const [numerator, denominator] = trimmed.split("/");
    const den = Number(denominator);
    return den !== 0 && Number.isFinite(Number(numerator)) && Number.isFinite(den);
  }
  return Number.isFinite(Number(trimmed));
}

export function isValidIsoDate(value: string): boolean {
  if (!ISO_DATE_PATTERN.test(value)) {
    return false;
  }
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return false;
  }
  const [year, month, day] = value.split("-").map(Number);
  return (
    parsed.getFullYear() === year &&
    parsed.getMonth() + 1 === month &&
    parsed.getDate() === day
  );
}

export function isValidTime(value: string): boolean {
  if (value.trim() === "") {
    return true;
  }
  if (!TIME_PATTERN.test(value)) {
    return false;
  }
  const [hours, minutes] = value.split(":").map(Number);
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
}

export function validateQuantity(value: string, label: string): string | undefined {
  if (!isValidQuantity(value)) {
    return `${label} must be a number or fraction such as 1/4.`;
  }
  return undefined;
}

export function validateJobSection(data: WorksheetFormData): FieldErrorMap {
  const errors: FieldErrorMap = {};

  const labels: Record<(typeof REQUIRED_JOB_FIELDS)[number], string> = {
    namePlace: "Name/Place",
    address: "Address",
    typeOfWork: "Type of Work",
    technicians: "Technician(s)",
    date: "Date",
  };

  for (const field of REQUIRED_JOB_FIELDS) {
    if (!isFilled(data[field])) {
      errors[field] = `${labels[field]} is required.`;
    }
  }

  if (isFilled(data.date) && !isValidIsoDate(data.date)) {
    errors.date = "Enter a valid date.";
  }

  if (!isValidTime(data.startTime)) {
    errors.startTime = "Enter a valid start time.";
  }

  if (!isValidTime(data.endTime)) {
    errors.endTime = "Enter a valid end time.";
  }

  return errors;
}

export function validateQuantities(data: WorksheetFormData): FieldErrorMap {
  const errors: FieldErrorMap = {};

  for (const [id, entry] of Object.entries(data.equipment)) {
    const qtyError = validateQuantity(entry.qty, "Quantity");
    if (qtyError) {
      errors[`equipment.${id}.qty`] = qtyError;
    }
    if (isFilled(entry.date) && !isValidIsoDate(entry.date)) {
      errors[`equipment.${id}.date`] = "Enter a valid date.";
    }
    if (id === "airScrubberSM" && isFilled(entry.qty) && entry.size !== "S" && entry.size !== "M") {
      errors[`equipment.${id}.size`] = "Circle (S) 500 or (M) 700.";
    }
  }

  for (const [id, qty] of Object.entries(data.supplies)) {
    const qtyError = validateQuantity(qty, "Quantity");
    if (qtyError) {
      errors[`supplies.${id}`] = qtyError;
    }
  }

  for (const [id, qty] of Object.entries(data.ppe)) {
    const qtyError = validateQuantity(qty, "Quantity");
    if (qtyError) {
      errors[`ppe.${id}`] = qtyError;
    }
  }

  for (const [id, qty] of Object.entries(data.chemicals)) {
    const qtyError = validateQuantity(qty, "Quantity");
    if (qtyError) {
      errors[`chemicals.${id}`] = qtyError;
    }
  }

  return errors;
}

export function validateWorksheet(data: WorksheetFormData): FieldErrorMap {
  return {
    ...validateJobSection(data),
    ...validateQuantities(data),
  };
}

export function hasErrors(errors: FieldErrorMap): boolean {
  return Object.values(errors).some((message) => Boolean(message));
}

export function countCompletedSections(data: WorksheetFormData): number {
  let completed = 0;

  if (REQUIRED_JOB_FIELDS.every((field) => isFilled(data[field]))) {
    completed += 1;
  }

  if (Object.values(data.equipment).some((entry) => isFilled(entry.qty))) {
    completed += 1;
  }

  if (Object.values(data.supplies).some((qty) => isFilled(qty))) {
    completed += 1;
  }

  if (Object.values(data.ppe).some((qty) => isFilled(qty))) {
    completed += 1;
  }

  if (Object.values(data.chemicals).some((qty) => isFilled(qty))) {
    completed += 1;
  }

  if (Object.values(data.work).some((value) => value !== "")) {
    completed += 1;
  }

  if (isFilled(data.notes)) {
    completed += 1;
  }

  return completed;
}

export const CONTENT_SECTION_COUNT = 7;
