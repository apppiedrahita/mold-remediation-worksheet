import type { AirScrubberSize, EquipmentId } from "@/types/form";

export function formatEquipmentLabel(
  id: EquipmentId,
  fallback: string,
  size: AirScrubberSize,
): string {
  if (id !== "airScrubberSM") {
    return fallback;
  }
  if (size === "S") {
    return "Air Scrubber (S) 500 cfm";
  }
  if (size === "M") {
    return "Air Scrubber (M) 700 cfm";
  }
  return fallback;
}

export function formatFormDate(isoDate: string): string {
  if (!isoDate) {
    return "";
  }
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) {
    return isoDate;
  }
  return `${Number(month)}/${Number(day)}/${year.slice(-2)}`;
}

export function formatFormTime(time: string): string {
  if (!time) {
    return "";
  }
  const [hoursRaw, minutesRaw] = time.split(":");
  const hours = Number(hoursRaw);
  const minutes = minutesRaw ?? "00";
  if (!Number.isFinite(hours)) {
    return time;
  }
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${minutes}`;
}

export function todayIsoDate(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}
