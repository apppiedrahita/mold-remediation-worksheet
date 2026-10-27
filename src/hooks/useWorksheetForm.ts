"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import { createDemoForm } from "@/data/demo-values";
import { createEmptyForm } from "@/data/initial-values";
import { WIZARD_SECTIONS } from "@/data/catalog";
import {
  getDeviceDraftSnapshot,
  getServerDraftSnapshot,
  persistDeviceForm,
  persistDeviceOptIn,
  subscribeDeviceDraft,
} from "@/lib/device-store";
import { downloadWorksheetPdf } from "@/lib/pdf/download";
import {
  hasErrors,
  validateJobSection,
  validateQuantities,
  validateWorksheet,
} from "@/lib/validation";
import { countCompletedSections } from "@/lib/form-progress";
import type {
  ChemicalId,
  EquipmentId,
  EquipmentPatch,
  FieldErrorMap,
  FormStatus,
  PpeId,
  SectionId,
  SupplyId,
  WorkId,
  WorksheetFormData,
  YesNoValue,
} from "@/types/form";

export function useWorksheetForm() {
  const draft = useSyncExternalStore(
    subscribeDeviceDraft,
    getDeviceDraftSnapshot,
    getServerDraftSnapshot,
  );
  const [localData, setLocalData] = useState<WorksheetFormData>(createEmptyForm);
  const [usingLocal, setUsingLocal] = useState(false);
  const [section, setSection] = useState<SectionId>("job");
  const [errors, setErrors] = useState<FieldErrorMap>({});
  const [status, setStatus] = useState<FormStatus>({ tone: "idle", message: "" });
  const [confirmClear, setConfirmClear] = useState(false);

  const saveOnDevice = draft.saveOnDevice;
  const data = usingLocal ? localData : (draft.form ?? localData);

  const commit = useCallback((next: WorksheetFormData) => {
    setLocalData(next);
    setUsingLocal(true);
    if (saveOnDevice) {
      persistDeviceForm(next);
    }
  }, [saveOnDevice]);

  const completed = useMemo(() => countCompletedSections(data), [data]);
  const sectionIds = WIZARD_SECTIONS.map((item) => item.id);
  const currentIndex = sectionIds.indexOf(section);

  const updateField = useCallback(<K extends keyof WorksheetFormData>(key: K, value: WorksheetFormData[K]) => {
    commit({ ...data, [key]: value });
    setErrors((current) => ({ ...current, [key]: undefined }));
    setStatus({ tone: "idle", message: "" });
  }, [commit, data]);

  const updateEquipment = useCallback((id: EquipmentId, patch: EquipmentPatch) => {
    commit({
      ...data,
      equipment: {
        ...data.equipment,
        [id]: { ...data.equipment[id], ...patch },
      },
    });
    setErrors((current) => ({
      ...current,
      [`equipment.${id}.qty`]: undefined,
      [`equipment.${id}.date`]: undefined,
      [`equipment.${id}.size`]: undefined,
    }));
  }, [commit, data]);

  const updateSupply = useCallback((id: SupplyId, qty: string) => {
    commit({ ...data, supplies: { ...data.supplies, [id]: qty } });
    setErrors((current) => ({ ...current, [`supplies.${id}`]: undefined }));
  }, [commit, data]);

  const updatePpe = useCallback((id: PpeId, qty: string) => {
    commit({ ...data, ppe: { ...data.ppe, [id]: qty } });
    setErrors((current) => ({ ...current, [`ppe.${id}`]: undefined }));
  }, [commit, data]);

  const updateChemical = useCallback((id: ChemicalId, qty: string) => {
    commit({ ...data, chemicals: { ...data.chemicals, [id]: qty } });
    setErrors((current) => ({ ...current, [`chemicals.${id}`]: undefined }));
  }, [commit, data]);

  const updateWork = useCallback((id: WorkId, value: YesNoValue) => {
    commit({
      ...data,
      work: {
        ...data.work,
        [id]: data.work[id] === value ? "" : value,
      },
    });
  }, [commit, data]);

  const goTo = useCallback((next: SectionId) => {
    if (section === "job") {
      const jobErrors = validateJobSection(data);
      if (next !== "job" && hasErrors(jobErrors)) {
        setErrors((current) => ({ ...current, ...jobErrors }));
        setStatus({
          tone: "error",
          message: "Complete the required job fields before leaving this section.",
        });
        return;
      }
    }
    setSection(next);
    setStatus({ tone: "idle", message: "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [data, section]);

  const goNext = useCallback(() => {
    const next = sectionIds[currentIndex + 1];
    if (next) {
      goTo(next);
    }
  }, [currentIndex, goTo, sectionIds]);

  const goBack = useCallback(() => {
    const previous = sectionIds[currentIndex - 1];
    if (previous) {
      setSection(previous);
      setStatus({ tone: "idle", message: "" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentIndex, sectionIds]);

  const loadDemo = useCallback(() => {
    commit(createDemoForm());
    setErrors({});
    setStatus({
      tone: "success",
      message: "Loaded fictional demonstration data. Nothing was sent to a server.",
    });
  }, [commit]);

  const clearForm = useCallback(() => {
    const empty = createEmptyForm();
    commit(empty);
    setErrors({});
    setConfirmClear(false);
    setSection("job");
    setStatus({
      tone: "success",
      message: "The form was cleared on this device.",
    });
  }, [commit]);

  const toggleSaveOnDevice = useCallback((enabled: boolean) => {
    persistDeviceOptIn(enabled, data);
    setStatus({
      tone: enabled ? "success" : "idle",
      message: enabled
        ? "Drafts will stay on this device only. They are not uploaded."
        : "Device draft saving is off. Nothing remains in local storage.",
    });
  }, [data]);

  const generatePdf = useCallback(async () => {
    const nextErrors = validateWorksheet(data);
    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      setStatus({
        tone: "error",
        message: "Fix the highlighted fields before generating the PDF.",
      });
      if (hasErrors(validateJobSection(data))) {
        setSection("job");
      }
      return;
    }

    const quantityErrors = validateQuantities(data);
    if (hasErrors(quantityErrors)) {
      setErrors(quantityErrors);
      setStatus({
        tone: "error",
        message: "Some quantities are not valid numbers or fractions.",
      });
      return;
    }

    setStatus({ tone: "generating", message: "Building the worksheet PDF on this device…" });
    try {
      const filename = await downloadWorksheetPdf(data);
      setStatus({
        tone: "success",
        message: `Downloaded ${filename}. The file was created in your browser.`,
      });
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Unknown error";
      setStatus({
        tone: "error",
        message: `The PDF could not be generated. ${detail}`,
      });
    }
  }, [data]);

  const displayStatus: FormStatus =
    status.tone === "idle" && status.message === "" && Boolean(draft.form) && !usingLocal
      ? { tone: "idle", message: "Restored a draft saved on this device only." }
      : status;

  return {
    data,
    section,
    errors,
    status: displayStatus,
    saveOnDevice,
    confirmClear,
    completed,
    currentIndex,
    setConfirmClear,
    updateField,
    updateEquipment,
    updateSupply,
    updatePpe,
    updateChemical,
    updateWork,
    goTo,
    goNext,
    goBack,
    loadDemo,
    clearForm,
    toggleSaveOnDevice,
    generatePdf,
  };
}
