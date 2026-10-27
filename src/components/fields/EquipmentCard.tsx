"use client";

import type { AirScrubberSize, EquipmentEntry, EquipmentPatch } from "@/types/form";

const SIZE_OPTIONS: ReadonlyArray<{ value: Exclude<AirScrubberSize, "">; cfm: string }> = [
  { value: "S", cfm: "500 cfm" },
  { value: "M", cfm: "700 cfm" },
];

interface EquipmentCardProps {
  id: string;
  label: string;
  value: EquipmentEntry;
  qtyError?: string;
  dateError?: string;
  sizeError?: string;
  onChange: (patch: EquipmentPatch) => void;
}

export function EquipmentCard({
  id,
  label,
  value,
  qtyError,
  dateError,
  sizeError,
  onChange,
}: EquipmentCardProps) {
  const showSize = id === "airScrubberSM";
  const title = showSize ? "Air Scrubber" : label;

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-3.5 shadow-sm">
      <p className="text-sm font-medium leading-5 text-stone-800">{title}</p>
      {showSize ? (
        <fieldset className="mt-3">
          <legend className="mb-1 text-xs font-medium uppercase tracking-wide text-stone-500">
            Size
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {SIZE_OPTIONS.map((option) => {
              const selected = value.size === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onChange({ size: selected ? "" : option.value })}
                  aria-pressed={selected}
                  className={`flex min-h-12 items-center justify-center gap-2 rounded-xl border px-2 text-sm font-semibold transition ${
                    selected
                      ? "border-teal-800 bg-teal-50 text-teal-950"
                      : "border-stone-300 bg-stone-50 text-stone-700"
                  }`}
                >
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 text-sm font-bold ${
                      selected
                        ? "border-teal-800 bg-teal-800 text-white"
                        : "border-stone-400 bg-white text-stone-700"
                    }`}
                  >
                    {option.value}
                  </span>
                  <span>{option.cfm}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <label htmlFor={`${id}-qty`} className="block min-w-0">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500">
            Qty
          </span>
          <input
            id={`${id}-qty`}
            type="text"
            inputMode="decimal"
            value={value.qty}
            placeholder="0"
            onChange={(event) => onChange({ qty: event.target.value })}
            aria-invalid={Boolean(qtyError)}
            className={`field-input rounded-xl border bg-stone-50 px-3 outline-none focus:bg-white focus:ring-2 focus:ring-teal-700/30 ${
              qtyError ? "border-rose-400" : "border-stone-300 focus:border-teal-700"
            }`}
          />
        </label>
        <label htmlFor={`${id}-date`} className="block min-w-0">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500">
            Date
          </span>
          <input
            id={`${id}-date`}
            type="date"
            value={value.date}
            onChange={(event) => onChange({ date: event.target.value })}
            aria-invalid={Boolean(dateError)}
            className={`field-input rounded-xl border bg-stone-50 px-3 outline-none focus:bg-white focus:ring-2 focus:ring-teal-700/30 ${
              dateError ? "border-rose-400" : "border-stone-300 focus:border-teal-700"
            }`}
          />
        </label>
      </div>
      {sizeError ? <p className="mt-1.5 text-sm text-rose-700">{sizeError}</p> : null}
      {qtyError ? <p className="mt-1.5 text-sm text-rose-700">{qtyError}</p> : null}
      {dateError ? <p className="mt-1.5 text-sm text-rose-700">{dateError}</p> : null}
    </div>
  );
}
