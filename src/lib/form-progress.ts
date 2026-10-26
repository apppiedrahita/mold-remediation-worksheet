import { WIZARD_SECTIONS } from "@/data/catalog";
import { CONTENT_SECTION_COUNT, countCompletedSections } from "@/lib/validation";
import type { SectionId } from "@/types/form";

export function sectionIndex(id: SectionId): number {
  return WIZARD_SECTIONS.findIndex((section) => section.id === id);
}

export function progressPercent(completed: number): number {
  return Math.round((completed / CONTENT_SECTION_COUNT) * 100);
}

export function progressLabel(completed: number): string {
  return `${completed} of ${CONTENT_SECTION_COUNT} sections have entries`;
}

export { CONTENT_SECTION_COUNT, countCompletedSections };
