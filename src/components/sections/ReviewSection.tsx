"use client";

import type { ReactNode } from "react";
import {
  ALL_EQUIPMENT,
  ALL_WORK,
  CHEMICALS,
  PPE_ITEMS,
  SUPPLIES,
} from "@/data/catalog";
import { formatFormDate, formatFormTime } from "@/lib/format";
import { isFilled } from "@/lib/validation";
import type { WorksheetFormData } from "@/types/form";

interface ReviewSectionProps {
  data: WorksheetFormData;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-stone-100 py-2 text-sm last:border-0">
      <span className="text-stone-500">{label}</span>
      <span className="max-w-[60%] text-right font-medium text-stone-900">
        {value === "" ? "—" : value}
      </span>
    </div>
  );
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-teal-900">{title}</h3>
      {children}
    </section>
  );
}

export function ReviewSection({ data }: ReviewSectionProps) {
  const filledEquipment = ALL_EQUIPMENT.filter((item) => isFilled(data.equipment[item.id].qty));
  const filledSupplies = SUPPLIES.filter((item) => isFilled(data.supplies[item.id]));
  const filledPpe = PPE_ITEMS.filter((item) => isFilled(data.ppe[item.id]));
  const filledChemicals = CHEMICALS.filter((item) => isFilled(data.chemicals[item.id]));
  const answeredWork = ALL_WORK.filter((item) => data.work[item.id] !== "");

  return (
    <div className="space-y-3">
      <Card title="Job information">
        <Row label="Name/Place" value={data.namePlace} />
        <Row label="Address" value={data.address} />
        <Row label="Type of Work" value={data.typeOfWork} />
        <Row label="Supervisor(s)" value={data.supervisors} />
        <Row label="Technician(s)" value={data.technicians} />
        <Row label="DATE" value={formatFormDate(data.date)} />
        <Row label="Start Time" value={formatFormTime(data.startTime)} />
        <Row label="End Time" value={formatFormTime(data.endTime)} />
      </Card>

      <Card title="Equipment placed">
        {filledEquipment.length === 0 ? (
          <p className="text-sm text-stone-500">No equipment quantities entered.</p>
        ) : (
          filledEquipment.map((item) => {
            const entry = data.equipment[item.id];
            const date = formatFormDate(entry.date);
            return (
              <Row
                key={item.id}
                label={item.label}
                value={date ? `${entry.qty} · ${date}` : entry.qty}
              />
            );
          })
        )}
      </Card>

      <Card title="Supplies used">
        {filledSupplies.length === 0 ? (
          <p className="text-sm text-stone-500">No supply quantities entered.</p>
        ) : (
          filledSupplies.map((item) => (
            <Row key={item.id} label={`${item.label} (${item.unit})`} value={data.supplies[item.id]} />
          ))
        )}
      </Card>

      <Card title="PPE">
        {filledPpe.length === 0 ? (
          <p className="text-sm text-stone-500">No PPE quantities entered.</p>
        ) : (
          filledPpe.map((item) => (
            <Row key={item.id} label={`${item.label} (${item.unit})`} value={data.ppe[item.id]} />
          ))
        )}
      </Card>

      <Card title="Chemicals and filters">
        {filledChemicals.length === 0 ? (
          <p className="text-sm text-stone-500">No chemical or filter quantities entered.</p>
        ) : (
          filledChemicals.map((item) => (
            <Row key={item.id} label={`${item.label} (${item.unit})`} value={data.chemicals[item.id]} />
          ))
        )}
      </Card>

      <Card title="Work performed">
        {answeredWork.length === 0 ? (
          <p className="text-sm text-stone-500">No yes/no answers selected.</p>
        ) : (
          answeredWork.map((item) => (
            <Row
              key={item.id}
              label={item.label}
              value={data.work[item.id] === "yes" ? "Yes" : "No"}
            />
          ))
        )}
      </Card>

      <Card title="Notes">
        <p className="whitespace-pre-wrap text-sm text-stone-800">
          {isFilled(data.notes) ? data.notes : "—"}
        </p>
      </Card>
    </div>
  );
}
