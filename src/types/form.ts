export type YesNoValue = "" | "yes" | "no";

export interface EquipmentEntry {
  qty: string;
  date: string;
}

export type EquipmentId =
  | "airScrubberL"
  | "airScrubberSM"
  | "extensionCords"
  | "generator"
  | "dehumidifiers1200"
  | "dehumidifiersLgrEvo"
  | "blowers";

export type SupplyId =
  | "plastic6Mil"
  | "plastic7Mil"
  | "zipPoles"
  | "zipper"
  | "blueVinylTape"
  | "frogTapeGreen"
  | "sprayGlueCans"
  | "blackBags"
  | "vacBrushesRound"
  | "hepaVacuumBags"
  | "ragsCleaningCloths"
  | "mopHeads"
  | "whitePanels2x2"
  | "bladesSawSaw"
  | "staplesBox"
  | "foamInsulationCans"
  | "sandingPaperHeavy"
  | "sandingPaper50"
  | "floorBrownPaper"
  | "carpetShield"
  | "leadKits"
  | "bladesForKnife"
  | "layFlat"
  | "paintBrushes"
  | "batteries"
  | "plywood";

export type PpeId =
  | "tyvekSuits"
  | "masksN95"
  | "vinylGloves"
  | "maskCartridgeSingle"
  | "maskCartridgeDouble"
  | "shoeCoverings"
  | "blueDippedGloves";

export type ChemicalId =
  | "shockwave"
  | "microbanMediclean"
  | "microbanOrange"
  | "antiMoldPaint"
  | "mmrOnAndGone"
  | "bioesque"
  | "formula50Rtu"
  | "bleach"
  | "encapsulant"
  | "negWhiteFilter1"
  | "negBlueFilter2"
  | "negFilter3"
  | "hepaFilter1"
  | "hepaFilter2"
  | "padFilter"
  | "ringPanelFilter"
  | "hepaVacuumFilter"
  | "intermediateVacuumFilter";

export type WorkId =
  | "setupContainment"
  | "equipmentChanges"
  | "moveContents"
  | "removeDrywall"
  | "removeFlooring"
  | "debrisRemoval";

export interface WorksheetFormData {
  namePlace: string;
  address: string;
  typeOfWork: string;
  supervisors: string;
  technicians: string;
  date: string;
  startTime: string;
  endTime: string;
  equipment: Record<EquipmentId, EquipmentEntry>;
  supplies: Record<SupplyId, string>;
  ppe: Record<PpeId, string>;
  chemicals: Record<ChemicalId, string>;
  work: Record<WorkId, YesNoValue>;
  notes: string;
}

export type SectionId =
  | "job"
  | "equipment"
  | "supplies"
  | "ppe"
  | "chemicals"
  | "work"
  | "notes"
  | "review";

export interface FieldErrorMap {
  [key: string]: string | undefined;
}

export type FormStatusTone = "idle" | "saving" | "generating" | "success" | "error";

export interface FormStatus {
  tone: FormStatusTone;
  message: string;
}
