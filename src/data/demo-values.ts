import { createEmptyForm } from "@/data/initial-values";
import type { WorksheetFormData } from "@/types/form";

export const DEMO_NOTICE =
  "Fictional demonstration data only. It is not a real job and is not saved to any server.";

export function createDemoForm(): WorksheetFormData {
  const data = createEmptyForm();

  data.namePlace = "Sample Residence — Oak Demo";
  data.address = "100 Example Ave, Unit 2B, Springfield";
  data.typeOfWork = "Mold Remediation";
  data.supervisors = "Alex Rivera";
  data.technicians = "Jordan Lee, Casey Nguyen";
  data.date = "2026-03-12";
  data.startTime = "09:00";
  data.endTime = "15:00";

  data.equipment.airScrubberL = { qty: "1", date: "2026-03-12", size: "" };
  data.equipment.airScrubberSM = { qty: "2", date: "2026-03-12", size: "S" };
  data.equipment.dehumidifiersLgrEvo = { qty: "1", date: "2026-03-12", size: "" };
  data.equipment.extensionCords = { qty: "4", date: "2026-03-12", size: "" };

  data.supplies.blackBags = "1/4";
  data.supplies.vacBrushesRound = "1";
  data.supplies.ragsCleaningCloths = "1/4";
  data.supplies.foamInsulationCans = "1";

  data.ppe.tyvekSuits = "5";
  data.ppe.vinylGloves = "1/4";
  data.ppe.maskCartridgeSingle = "2";
  data.ppe.maskCartridgeDouble = "1";

  data.chemicals.antiMoldPaint = "4";
  data.chemicals.padFilter = "4";
  data.chemicals.ringPanelFilter = "2";

  data.work.setupContainment = "yes";
  data.work.equipmentChanges = "no";
  data.work.moveContents = "yes";
  data.work.removeDrywall = "yes";
  data.work.removeFlooring = "no";
  data.work.debrisRemoval = "yes";

  data.notes =
    "Containment set in basement bathroom. Anti-mold paint applied after HEPA vacuum. Demo quantities only.";

  return data;
}
