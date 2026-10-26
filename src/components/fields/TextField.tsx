"use client";

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
}

export function TextField({
  id,
  label,
  value,
  onChange,
  error,
  required,
  placeholder,
  autoComplete,
}: TextFieldProps) {
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-1.5 flex items-baseline gap-1 text-sm font-medium text-stone-800">
        {label}
        {required ? <span className="text-rose-700">*</span> : null}
      </span>
      <input
        id={id}
        type="text"
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`field-input rounded-xl border bg-white px-3.5 text-base text-stone-900 shadow-sm outline-none transition focus:ring-2 focus:ring-teal-700/30 ${
          error ? "border-rose-400 focus:border-rose-500" : "border-stone-300 focus:border-teal-700"
        }`}
      />
      {error ? (
        <span id={`${id}-error`} className="mt-1.5 block text-sm text-rose-700">
          {error}
        </span>
      ) : null}
    </label>
  );
}
