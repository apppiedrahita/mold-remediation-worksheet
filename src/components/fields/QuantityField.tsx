"use client";

interface QuantityFieldProps {
  id: string;
  label: string;
  unit?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function QuantityField({ id, label, unit, value, onChange, error }: QuantityFieldProps) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-3.5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium leading-5 text-stone-800">
          {label}
        </label>
        {unit ? (
          <span className="shrink-0 rounded-full bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-900">
            {unit}
          </span>
        ) : null}
      </div>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        value={value}
        placeholder="Qty"
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`field-input mt-2 rounded-xl border bg-stone-50 px-3 text-base text-stone-900 outline-none transition focus:bg-white focus:ring-2 focus:ring-teal-700/30 ${
          error ? "border-rose-400" : "border-stone-300 focus:border-teal-700"
        }`}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-rose-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
