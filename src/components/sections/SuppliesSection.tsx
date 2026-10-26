"use client";

import { QuantityField } from "@/components/fields/QuantityField";
import { SUPPLIES } from "@/data/catalog";
import type { FieldErrorMap, SupplyId, WorksheetFormData } from "@/types/form";

interface SuppliesSectionProps {
  data: WorksheetFormData;
  errors: FieldErrorMap;
  onChange: (id: SupplyId, qty: string) => void;
}

export function SuppliesSection({ data, errors, onChange }: SuppliesSectionProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {SUPPLIES.map((item) => (
        <QuantityField
          key={item.id}
          id={`supply-${item.id}`}
          label={item.label}
          unit={item.unit}
          value={data.supplies[item.id]}
          error={errors[`supplies.${item.id}`]}
          onChange={(qty) => onChange(item.id, qty)}
        />
      ))}
    </div>
  );
}
