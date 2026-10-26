import type {
  ChemicalId,
  EquipmentId,
  PpeId,
  SectionId,
  SupplyId,
  WorkId,
} from "@/types/form";

export interface CatalogItem<Id extends string> {
  id: Id;
  label: string;
}

export interface UnitCatalogItem<Id extends string> extends CatalogItem<Id> {
  unit: string;
}

export const EQUIPMENT_LEFT: readonly CatalogItem<EquipmentId>[] = [
  { id: "airScrubberL", label: "Air Scrubber (L) 2000 cfm" },
  { id: "airScrubberSM", label: "Air Scrubber (S) 500 / (M) 700 cfm" },
  { id: "extensionCords", label: "Extension Cords" },
  { id: "generator", label: "Generator" },
] as const;

export const EQUIPMENT_RIGHT: readonly CatalogItem<EquipmentId>[] = [
  { id: "dehumidifiers1200", label: "Dehumidifiers 1200" },
  { id: "dehumidifiersLgrEvo", label: "Dehumidifiers LGR Evo" },
  { id: "blowers", label: "Blowers" },
] as const;

export const ALL_EQUIPMENT: readonly CatalogItem<EquipmentId>[] = [
  ...EQUIPMENT_LEFT,
  ...EQUIPMENT_RIGHT,
];

export const SUPPLIES: readonly UnitCatalogItem<SupplyId>[] = [
  { id: "plastic6Mil", label: "Plastic 6 MIL Poly", unit: "Roll" },
  { id: "plastic7Mil", label: "Plastic 7 MIL Poly", unit: "Each" },
  { id: "zipPoles", label: "Zip Poles", unit: "Each" },
  { id: "zipper", label: "Zipper", unit: "Each" },
  { id: "blueVinylTape", label: "Blue Vinyl Tape", unit: "Roll" },
  { id: "frogTapeGreen", label: "Frog Tape Green", unit: "Roll" },
  { id: "sprayGlueCans", label: "Spray Glue Cans", unit: "Each" },
  { id: "blackBags", label: "Black Bags (Box of 50)", unit: "Box" },
  { id: "vacBrushesRound", label: "Vac Brushes Round", unit: "Each" },
  { id: "hepaVacuumBags", label: "HEPA Vacuum Bags", unit: "Each" },
  { id: "ragsCleaningCloths", label: "Rags/Cleaning Cloths", unit: "Box" },
  { id: "mopHeads", label: "Mop Heads", unit: "Each" },
  { id: "whitePanels2x2", label: "2X2 White Panels", unit: "Each" },
  { id: "bladesSawSaw", label: "Blades Saw-Saw", unit: "Box" },
  { id: "staplesBox", label: "Staples Box", unit: "Box" },
  { id: "foamInsulationCans", label: "Foam Insulation Cans", unit: "Each" },
  { id: "sandingPaperHeavy", label: "Sanding Paper Heavy (pack 4)", unit: "Piece" },
  { id: "sandingPaper50", label: "Sanding Paper (pack 50)", unit: "Piece" },
  { id: "floorBrownPaper", label: "Floor Brown Paper", unit: "Roll" },
  { id: "carpetShield", label: "Carpet Shield", unit: "Roll" },
  { id: "leadKits", label: "Lead Kits", unit: "Each" },
  { id: "bladesForKnife", label: "Blades for knife", unit: "Each" },
  { id: "layFlat", label: "Lay Flat", unit: "Roll" },
  { id: "paintBrushes", label: "Paint Brushes", unit: "Each" },
  { id: "batteries", label: "Batteries", unit: "Each" },
  { id: "plywood", label: "Plywood", unit: "Each" },
] as const;

export const PPE_ITEMS: readonly UnitCatalogItem<PpeId>[] = [
  { id: "tyvekSuits", label: "Tyvek Suits", unit: "Each" },
  { id: "masksN95", label: "Masks (N95)", unit: "Each" },
  { id: "vinylGloves", label: "Vinyl Gloves (100)", unit: "Each" },
  { id: "maskCartridgeSingle", label: "Mask Cartridge Single", unit: "Each" },
  { id: "maskCartridgeDouble", label: "Mask Cartridge Double", unit: "Each" },
  { id: "shoeCoverings", label: "Shoe Coverings", unit: "pair" },
  { id: "blueDippedGloves", label: "Blue Dipped Work Gloves", unit: "pair" },
] as const;

export const CHEMICALS: readonly UnitCatalogItem<ChemicalId>[] = [
  { id: "shockwave", label: "Shockwave", unit: "Gallons" },
  { id: "microbanMediclean", label: "Microban / Mediclean", unit: "Gallons" },
  { id: "microbanOrange", label: "Microban (Orange)", unit: "Gallons" },
  { id: "antiMoldPaint", label: "Anti-Mold Paint - 24/7", unit: "Gallons" },
  { id: "mmrOnAndGone", label: "MMR / On And Gone", unit: "Gallons" },
  { id: "bioesque", label: "Bioesque", unit: "Gallons" },
  { id: "formula50Rtu", label: "Formula 50 RTU", unit: "Bottles" },
  { id: "bleach", label: "Bleach", unit: "Gallons" },
  { id: "encapsulant", label: "Encapsulant (Foster/Fiberlock)", unit: "Gallons" },
  { id: "negWhiteFilter1", label: "NEG White Filter 1st", unit: "Each" },
  { id: "negBlueFilter2", label: "NEG Blue Filter 2nd", unit: "Each" },
  { id: "negFilter3", label: "NEG Filter 3rd", unit: "Each" },
  { id: "hepaFilter1", label: "HEPA Filter 1st", unit: "Each" },
  { id: "hepaFilter2", label: "HEPA Filter 2nd", unit: "Each" },
  { id: "padFilter", label: "Pad Filter", unit: "Each" },
  { id: "ringPanelFilter", label: "Ring Panel Filter", unit: "Each" },
  { id: "hepaVacuumFilter", label: "HEPA Vacuum Filter", unit: "Each" },
  { id: "intermediateVacuumFilter", label: "Intermediate Vacuum Filter (Sock)", unit: "Each" },
] as const;

export const WORK_LEFT: readonly CatalogItem<WorkId>[] = [
  { id: "setupContainment", label: "Setup Containment" },
  { id: "equipmentChanges", label: "Equipment Changes" },
  { id: "moveContents", label: "Move Contents" },
] as const;

export const WORK_RIGHT: readonly CatalogItem<WorkId>[] = [
  { id: "removeDrywall", label: "Remove Drywall" },
  { id: "removeFlooring", label: "Remove Flooring" },
  { id: "debrisRemoval", label: "Debris Removal" },
] as const;

export const ALL_WORK: readonly CatalogItem<WorkId>[] = [
  ...WORK_LEFT,
  ...WORK_RIGHT,
];

export interface WizardSection {
  id: SectionId;
  title: string;
  shortTitle: string;
  description: string;
}

export const WIZARD_SECTIONS: readonly WizardSection[] = [
  {
    id: "job",
    title: "Job information",
    shortTitle: "Job",
    description: "Site, crew, date, and hours from the original header.",
  },
  {
    id: "equipment",
    title: "Equipment placed",
    shortTitle: "Equipment",
    description: "Quantity and date placed for each machine on the worksheet.",
  },
  {
    id: "supplies",
    title: "Supplies used",
    shortTitle: "Supplies",
    description: "Quantities for containment, tools, and consumable supplies.",
  },
  {
    id: "ppe",
    title: "PPE",
    shortTitle: "PPE",
    description: "Protective equipment quantities from the original PPE table.",
  },
  {
    id: "chemicals",
    title: "Chemicals and filters",
    shortTitle: "Chemicals",
    description: "Antimicrobials, coatings, and filter quantities.",
  },
  {
    id: "work",
    title: "Work performed",
    shortTitle: "Work",
    description: "Yes or No for each task listed on the worksheet.",
  },
  {
    id: "notes",
    title: "Notes",
    shortTitle: "Notes",
    description: "Free-text observations. The printed form has four writing lines.",
  },
  {
    id: "review",
    title: "Review and download",
    shortTitle: "Review",
    description: "Confirm the entries, then generate a PDF that matches the original form.",
  },
] as const;

export const REQUIRED_JOB_FIELDS = [
  "namePlace",
  "address",
  "typeOfWork",
  "technicians",
  "date",
] as const;

export type RequiredJobField = (typeof REQUIRED_JOB_FIELDS)[number];
