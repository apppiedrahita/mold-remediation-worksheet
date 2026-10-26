"use client";

import { QuantityField } from "@/components/fields/QuantityField";
import { PPE_ITEMS } from "@/data/catalog";
import type { FieldErrorMap, PpeId, WorksheetFormData } from "@/types/form";

interface PpeSectionProps {
  data: WorksheetFormData;
  errors: FieldErrorMap;
  onChange: (id: PpeId, qty: string) => void;
}

export function PpeSection({ data, errors, onChange }: PpeSectionProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {PPE_ITEMS.map((item) => (
        <QuantityField
          key={item.id}
          id={`ppe-${item.id}`}
          label={item.label}
          unit={item.unit}
          value={data.ppe[item.id]}
          error={errors[`ppe.${item.id}`]}
          onChange={(qty) => onChange(item.id, qty)}
        />
      ))}
    </div>
  );
}
