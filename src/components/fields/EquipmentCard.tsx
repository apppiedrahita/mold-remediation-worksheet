"use client";

import type { EquipmentEntry } from "@/types/form";

interface EquipmentCardProps {
  id: string;
  label: string;
  value: EquipmentEntry;
  qtyError?: string;
  dateError?: string;
  onChange: (patch: { qty?: string; date?: string }) => void;
}

export function EquipmentCard({
  id,
  label,
  value,
  qtyError,
  dateError,
  onChange,
}: EquipmentCardProps) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-3.5 shadow-sm">
      <p className="text-sm font-medium leading-5 text-stone-800">{label}</p>
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
      {qtyError ? <p className="mt-1.5 text-sm text-rose-700">{qtyError}</p> : null}
      {dateError ? <p className="mt-1.5 text-sm text-rose-700">{dateError}</p> : null}
    </div>
  );
}
