"use client";

import { YesNoField } from "@/components/fields/YesNoField";
import { ALL_WORK } from "@/data/catalog";
import type { WorkId, WorksheetFormData, YesNoValue } from "@/types/form";

interface WorkSectionProps {
  data: WorksheetFormData;
  onChange: (id: WorkId, value: YesNoValue) => void;
}

export function WorkSection({ data, onChange }: WorkSectionProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {ALL_WORK.map((item) => (
        <YesNoField
          key={item.id}
          legend={item.label}
          value={data.work[item.id]}
          onChange={(value) => onChange(item.id, value)}
        />
      ))}
    </div>
  );
}
