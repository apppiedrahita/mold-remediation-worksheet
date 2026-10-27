import { createEmptyForm } from "@/data/initial-values";
import type { WorksheetFormData } from "@/types/form";

export const STORAGE_KEY = "cei-mold-worksheet-demo-v1";
export const STORAGE_OPT_IN_KEY = "cei-mold-worksheet-demo-opt-in";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function mergeStoredForm(stored: unknown): WorksheetFormData {
  const base = createEmptyForm();
  if (!isRecord(stored)) {
    return base;
  }

  base.namePlace = asString(stored.namePlace);
  base.address = asString(stored.address);
  base.typeOfWork = asString(stored.typeOfWork);
  base.supervisors = asString(stored.supervisors);
  base.technicians = asString(stored.technicians);
  base.date = asString(stored.date);
  base.startTime = asString(stored.startTime);
  base.endTime = asString(stored.endTime);
  base.notes = asString(stored.notes);

  if (isRecord(stored.equipment)) {
    for (const id of Object.keys(base.equipment) as Array<keyof typeof base.equipment>) {
      const entry = stored.equipment[id];
      if (isRecord(entry)) {
        const size = entry.size;
        base.equipment[id] = {
          qty: asString(entry.qty),
          date: asString(entry.date),
          size: size === "S" || size === "M" ? size : "",
        };
      }
    }
  }

  const mergeQty = <T extends Record<string, string>>(target: T, source: unknown): T => {
    if (!isRecord(source)) {
      return target;
    }
    const next = { ...target };
    for (const key of Object.keys(target)) {
      if (key in source) {
        next[key as keyof T] = asString(source[key]) as T[keyof T];
      }
    }
    return next;
  };

  base.supplies = mergeQty(base.supplies, stored.supplies);
  base.ppe = mergeQty(base.ppe, stored.ppe);
  base.chemicals = mergeQty(base.chemicals, stored.chemicals);

  if (isRecord(stored.work)) {
    for (const id of Object.keys(base.work) as Array<keyof typeof base.work>) {
      const value = stored.work[id];
      if (value === "yes" || value === "no" || value === "") {
        base.work[id] = value;
      }
    }
  }

  return base;
}

export function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function readStorageOptIn(): boolean {
  if (!isBrowser()) {
    return false;
  }
  return window.localStorage.getItem(STORAGE_OPT_IN_KEY) === "on";
}

export function writeStorageOptIn(enabled: boolean): void {
  if (!isBrowser()) {
    return;
  }
  if (enabled) {
    window.localStorage.setItem(STORAGE_OPT_IN_KEY, "on");
  } else {
    window.localStorage.removeItem(STORAGE_OPT_IN_KEY);
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export function loadFormFromDevice(): WorksheetFormData | null {
  if (!isBrowser() || !readStorageOptIn()) {
    return null;
  }
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return mergeStoredForm(JSON.parse(raw) as unknown);
  } catch {
    return null;
  }
}

export function saveFormToDevice(data: WorksheetFormData): void {
  if (!isBrowser() || !readStorageOptIn()) {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearFormOnDevice(): void {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.removeItem(STORAGE_KEY);
}
