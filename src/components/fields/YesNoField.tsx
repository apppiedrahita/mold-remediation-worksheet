"use client";

import type { YesNoValue } from "@/types/form";

interface YesNoFieldProps {
  legend: string;
  value: YesNoValue;
  onChange: (value: YesNoValue) => void;
}

export function YesNoField({ legend, value, onChange }: YesNoFieldProps) {
  return (
    <fieldset className="rounded-2xl border border-stone-200 bg-white p-3.5 shadow-sm">
      <legend className="px-1 text-sm font-medium text-stone-800">{legend}</legend>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onChange("yes")}
          className={`min-h-12 rounded-xl border text-sm font-semibold transition ${
            value === "yes"
              ? "border-teal-800 bg-teal-800 text-white"
              : "border-stone-300 bg-stone-50 text-stone-700"
          }`}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => onChange("no")}
          className={`min-h-12 rounded-xl border text-sm font-semibold transition ${
            value === "no"
              ? "border-stone-800 bg-stone-800 text-white"
              : "border-stone-300 bg-stone-50 text-stone-700"
          }`}
        >
          No
        </button>
      </div>
    </fieldset>
  );
}
