"use client";

interface NotesSectionProps {
  value: string;
  onChange: (value: string) => void;
}

export function NotesSection({ value, onChange }: NotesSectionProps) {
  return (
    <label htmlFor="notes" className="block">
      <span className="mb-1.5 block text-sm font-medium text-stone-800">NOTES</span>
      <textarea
        id="notes"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={6}
        placeholder="The printed form has four writing lines. Extra text is wrapped and clipped to that space."
        className="min-h-40 w-full rounded-2xl border border-stone-300 bg-white px-3.5 py-3 text-base text-stone-900 shadow-sm outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/30"
      />
    </label>
  );
}
