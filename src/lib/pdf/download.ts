import { buildPdfFilename, generateWorksheetPdf } from "@/lib/pdf/generate";
import type { WorksheetFormData } from "@/types/form";

export async function downloadWorksheetPdf(data: WorksheetFormData): Promise<string> {
  const bytes = await generateWorksheetPdf(data);
  const filename = buildPdfFilename(data);
  const blob = new Blob([Uint8Array.from(bytes)], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);

  return filename;
}
