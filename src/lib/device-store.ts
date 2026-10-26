import { createEmptyForm } from "@/data/initial-values";
import {
  STORAGE_KEY,
  isBrowser,
  loadFormFromDevice,
  readStorageOptIn,
  saveFormToDevice,
  writeStorageOptIn,
} from "@/lib/storage";
import type { WorksheetFormData } from "@/types/form";

export interface DeviceDraft {
  saveOnDevice: boolean;
  form: WorksheetFormData | null;
}

const SERVER_DRAFT: DeviceDraft = { saveOnDevice: false, form: null };
const listeners = new Set<() => void>();
let cachedDraft: DeviceDraft = SERVER_DRAFT;
let cachedRaw: string | null = null;
let cachedOptIn = false;

function emit(): void {
  for (const listener of listeners) {
    listener();
  }
}

export function subscribeDeviceDraft(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getDeviceDraftSnapshot(): DeviceDraft {
  const saveOnDevice = readStorageOptIn();
  const raw = isBrowser() && saveOnDevice ? window.localStorage.getItem(STORAGE_KEY) : null;
  if (cachedDraft !== SERVER_DRAFT && cachedOptIn === saveOnDevice && cachedRaw === raw) {
    return cachedDraft;
  }
  cachedOptIn = saveOnDevice;
  cachedRaw = raw;
  cachedDraft = {
    saveOnDevice,
    form: saveOnDevice ? loadFormFromDevice() : null,
  };
  return cachedDraft;
}

export function getServerDraftSnapshot(): DeviceDraft {
  return SERVER_DRAFT;
}

export function persistDeviceOptIn(enabled: boolean, form: WorksheetFormData): void {
  writeStorageOptIn(enabled);
  if (enabled) {
    saveFormToDevice(form);
  }
  emit();
}

export function persistDeviceForm(form: WorksheetFormData): void {
  saveFormToDevice(form);
  emit();
}

export function emptyForm(): WorksheetFormData {
  return createEmptyForm();
}
