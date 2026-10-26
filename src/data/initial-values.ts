import {
  ALL_EQUIPMENT,
  ALL_WORK,
  CHEMICALS,
  PPE_ITEMS,
  SUPPLIES,
} from "@/data/catalog";
import type {
  ChemicalId,
  EquipmentEntry,
  EquipmentId,
  PpeId,
  SupplyId,
  WorkId,
  WorksheetFormData,
  YesNoValue,
} from "@/types/form";

function emptyEquipment(): Record<EquipmentId, EquipmentEntry> {
  const entries = {} as Record<EquipmentId, EquipmentEntry>;
  for (const item of ALL_EQUIPMENT) {
    entries[item.id] = { qty: "", date: "" };
  }
  return entries;
}

function emptyQuantities<Id extends string>(
  items: readonly { id: Id }[],
): Record<Id, string> {
  const entries = {} as Record<Id, string>;
  for (const item of items) {
    entries[item.id] = "";
  }
  return entries;
}

function emptyWork(): Record<WorkId, YesNoValue> {
  const entries = {} as Record<WorkId, YesNoValue>;
  for (const item of ALL_WORK) {
    entries[item.id] = "";
  }
  return entries;
}

export function createEmptyForm(): WorksheetFormData {
  return {
    namePlace: "",
    address: "",
    typeOfWork: "",
    supervisors: "",
    technicians: "",
    date: "",
    startTime: "",
    endTime: "",
    equipment: emptyEquipment(),
    supplies: emptyQuantities<SupplyId>(SUPPLIES),
    ppe: emptyQuantities<PpeId>(PPE_ITEMS),
    chemicals: emptyQuantities<ChemicalId>(CHEMICALS),
    work: emptyWork(),
    notes: "",
  };
}
