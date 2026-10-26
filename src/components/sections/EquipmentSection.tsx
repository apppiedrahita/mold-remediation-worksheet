"use client";

import { EquipmentCard } from "@/components/fields/EquipmentCard";
import { ALL_EQUIPMENT } from "@/data/catalog";
import type { EquipmentId, FieldErrorMap, WorksheetFormData } from "@/types/form";

interface EquipmentSectionProps {
  data: WorksheetFormData;
  errors: FieldErrorMap;
  onChange: (id: EquipmentId, patch: { qty?: string; date?: string }) => void;
}

export function EquipmentSection({ data, errors, onChange }: EquipmentSectionProps) {
  return (
    <div className="space-y-3">
      {ALL_EQUIPMENT.map((item) => (
        <EquipmentCard
          key={item.id}
          id={item.id}
          label={item.label}
          value={data.equipment[item.id]}
          qtyError={errors[`equipment.${item.id}.qty`]}
          dateError={errors[`equipment.${item.id}.date`]}
          onChange={(patch) => onChange(item.id, patch)}
        />
      ))}
    </div>
  );
}
