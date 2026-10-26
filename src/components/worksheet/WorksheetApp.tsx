"use client";

import { ChemicalsSection } from "@/components/sections/ChemicalsSection";
import { EquipmentSection } from "@/components/sections/EquipmentSection";
import { JobSection } from "@/components/sections/JobSection";
import { NotesSection } from "@/components/sections/NotesSection";
import { PpeSection } from "@/components/sections/PpeSection";
import { ReviewSection } from "@/components/sections/ReviewSection";
import { SuppliesSection } from "@/components/sections/SuppliesSection";
import { WorkSection } from "@/components/sections/WorkSection";
import { ConfirmDialog } from "@/components/worksheet/ConfirmDialog";
import { StatusBanner } from "@/components/worksheet/StatusBanner";
import { WIZARD_SECTIONS } from "@/data/catalog";
import { DEMO_NOTICE } from "@/data/demo-values";
import { useWorksheetForm } from "@/hooks/useWorksheetForm";
import { CONTENT_SECTION_COUNT, progressPercent } from "@/lib/form-progress";

export function WorksheetApp() {
  const form = useWorksheetForm();
  const current = WIZARD_SECTIONS[form.currentIndex] ?? WIZARD_SECTIONS[0];
  const percent = progressPercent(form.completed);
  const isReview = form.section === "review";
  const isFirst = form.currentIndex === 0;
  const isGenerating = form.status.tone === "generating";

  return (
    <div className="mx-auto flex min-h-full w-full max-w-3xl flex-1 flex-col px-4 pb-40 pt-5 sm:px-6">
      <header className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-800">
          Field demo
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-stone-950">
          Mold Remediation Worksheet
        </h1>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Complete the paper worksheet from a phone. The downloaded PDF keeps the original
          layout. Nothing is sent to a server.
        </p>
      </header>

      <div className="mb-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="font-medium text-stone-800">Progress</span>
          <span className="text-stone-500">
            {form.completed}/{CONTENT_SECTION_COUNT} sections
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-100">
          <div
            className="h-full rounded-full bg-teal-800 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-stone-500">{current.description}</p>
      </div>

      <nav className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {WIZARD_SECTIONS.map((section, index) => {
          const active = section.id === form.section;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => form.goTo(section.id)}
              className={`shrink-0 rounded-full px-3 py-2 text-xs font-semibold ${
                active ? "bg-teal-800 text-white" : "bg-white text-stone-700 ring-1 ring-stone-200"
              }`}
            >
              {index + 1}. {section.shortTitle}
            </button>
          );
        })}
      </nav>

      <StatusBanner status={form.status} />

      <section className="mt-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-stone-950">{current.title}</h2>
        </div>

        {form.section === "job" ? (
          <JobSection data={form.data} errors={form.errors} onChange={form.updateField} />
        ) : null}
        {form.section === "equipment" ? (
          <EquipmentSection data={form.data} errors={form.errors} onChange={form.updateEquipment} />
        ) : null}
        {form.section === "supplies" ? (
          <SuppliesSection data={form.data} errors={form.errors} onChange={form.updateSupply} />
        ) : null}
        {form.section === "ppe" ? (
          <PpeSection data={form.data} errors={form.errors} onChange={form.updatePpe} />
        ) : null}
        {form.section === "chemicals" ? (
          <ChemicalsSection data={form.data} errors={form.errors} onChange={form.updateChemical} />
        ) : null}
        {form.section === "work" ? (
          <WorkSection data={form.data} onChange={form.updateWork} />
        ) : null}
        {form.section === "notes" ? (
          <NotesSection value={form.data.notes} onChange={(value) => form.updateField("notes", value)} />
        ) : null}
        {form.section === "review" ? <ReviewSection data={form.data} /> : null}
      </section>

      <aside className="mt-8 mb-6 scroll-mb-28 space-y-3 rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
          Demo tools — not part of the worksheet
        </p>
        <label className="flex items-start gap-3 text-sm text-stone-700">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 accent-teal-800"
            checked={form.saveOnDevice}
            onChange={(event) => form.toggleSaveOnDevice(event.target.checked)}
          />
          <span>
            Save a draft on this device only. This is optional browser storage and is not a
            cloud backup.
          </span>
        </label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={form.loadDemo}
            className="min-h-11 rounded-xl border border-stone-300 bg-white text-sm font-semibold text-stone-800"
          >
            Load fictional demo data
          </button>
          <button
            type="button"
            onClick={() => form.setConfirmClear(true)}
            className="min-h-11 rounded-xl border border-rose-200 bg-white text-sm font-semibold text-rose-800"
          >
            Clear form
          </button>
        </div>
        <p className="text-xs leading-5 text-stone-500">{DEMO_NOTICE}</p>
      </aside>

      <footer className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl gap-3">
          <button
            type="button"
            onClick={form.goBack}
            disabled={isFirst}
            className="min-h-12 flex-1 rounded-xl border border-stone-300 text-sm font-semibold text-stone-800 disabled:opacity-40"
          >
            Back
          </button>
          {isReview ? (
            <button
              type="button"
              onClick={() => void form.generatePdf()}
              disabled={isGenerating}
              className="min-h-12 flex-[2] rounded-xl bg-teal-800 text-sm font-semibold text-white disabled:opacity-60"
            >
              {isGenerating ? "Generating PDF…" : "Generate and download PDF"}
            </button>
          ) : (
            <button
              type="button"
              onClick={form.goNext}
              className="min-h-12 flex-[2] rounded-xl bg-teal-800 text-sm font-semibold text-white"
            >
              Next
            </button>
          )}
        </div>
      </footer>

      <ConfirmDialog
        open={form.confirmClear}
        title="Clear the worksheet?"
        message="This removes every entry from the form. If device saving is on, the local draft is also deleted. This cannot be undone."
        confirmLabel="Clear form"
        onConfirm={form.clearForm}
        onCancel={() => form.setConfirmClear(false)}
      />
    </div>
  );
}
