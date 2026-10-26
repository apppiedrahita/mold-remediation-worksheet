"use client";

import { QuantityField } from "@/components/fields/QuantityField";
import { CHEMICALS } from "@/data/catalog";
import type { ChemicalId, FieldErrorMap, WorksheetFormData } from "@/types/form";

interface ChemicalsSectionProps {
  data: WorksheetFormData;
  errors: FieldErrorMap;
  onChange: (id: ChemicalId, qty: string) => void;
}

export function ChemicalsSection({ data, errors, onChange }: ChemicalsSectionProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {CHEMICALS.map((item) => (
        <QuantityField
          key={item.id}
          id={`chemical-${item.id}`}
          label={item.label}
          unit={item.unit}
          value={data.chemicals[item.id]}
          error={errors[`chemicals.${item.id}`]}
          onChange={(qty) => onChange(item.id, qty)}
        />
      ))}
    </div>
  );
}
