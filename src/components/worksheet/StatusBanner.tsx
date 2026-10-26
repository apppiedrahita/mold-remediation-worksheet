"use client";

import type { FormStatus } from "@/types/form";

export function StatusBanner({ status }: { status: FormStatus }) {
  if (status.message === "") {
    return null;
  }

  const tones: Record<FormStatus["tone"], string> = {
    idle: "border-stone-300 bg-stone-100 text-stone-800",
    saving: "border-stone-300 bg-stone-100 text-stone-800",
    generating: "border-amber-200 bg-amber-50 text-amber-950",
    success: "border-teal-200 bg-teal-50 text-teal-950",
    error: "border-rose-200 bg-rose-50 text-rose-900",
  };

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${tones[status.tone]}`} role="status">
      {status.tone === "generating" ? (
        <span className="mr-2 inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent align-[-2px]" />
      ) : null}
      {status.message}
    </div>
  );
}
