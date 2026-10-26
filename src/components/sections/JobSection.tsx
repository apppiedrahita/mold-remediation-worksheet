"use client";

import { DateField } from "@/components/fields/DateField";
import { TextField } from "@/components/fields/TextField";
import { TimeField } from "@/components/fields/TimeField";
import type { FieldErrorMap, WorksheetFormData } from "@/types/form";

interface JobSectionProps {
  data: WorksheetFormData;
  errors: FieldErrorMap;
  onChange: <K extends keyof WorksheetFormData>(key: K, value: WorksheetFormData[K]) => void;
}

export function JobSection({ data, errors, onChange }: JobSectionProps) {
  return (
    <div className="space-y-4">
      <TextField
        id="namePlace"
        label="Name/Place"
        value={data.namePlace}
        onChange={(value) => onChange("namePlace", value)}
        error={errors.namePlace}
        required
        placeholder="Job or site name"
      />
      <TextField
        id="address"
        label="Address (include room/unit #)"
        value={data.address}
        onChange={(value) => onChange("address", value)}
        error={errors.address}
        required
        placeholder="Street, room, or unit"
      />
      <TextField
        id="typeOfWork"
        label="Type of Work"
        value={data.typeOfWork}
        onChange={(value) => onChange("typeOfWork", value)}
        error={errors.typeOfWork}
        required
        placeholder="Mold Remediation"
      />
      <TextField
        id="supervisors"
        label="Supervisor(s)"
        value={data.supervisors}
        onChange={(value) => onChange("supervisors", value)}
        error={errors.supervisors}
        placeholder="Optional"
      />
      <TextField
        id="technicians"
        label="Technician(s)"
        value={data.technicians}
        onChange={(value) => onChange("technicians", value)}
        error={errors.technicians}
        required
        placeholder="Crew names"
      />
      <DateField
        id="date"
        label="DATE"
        value={data.date}
        onChange={(value) => onChange("date", value)}
        error={errors.date}
        required
      />
      <div className="grid grid-cols-2 gap-3 min-w-0">
        <TimeField
          id="startTime"
          label="Start Time"
          value={data.startTime}
          onChange={(value) => onChange("startTime", value)}
          error={errors.startTime}
        />
        <TimeField
          id="endTime"
          label="End Time"
          value={data.endTime}
          onChange={(value) => onChange("endTime", value)}
          error={errors.endTime}
        />
      </div>
    </div>
  );
}
