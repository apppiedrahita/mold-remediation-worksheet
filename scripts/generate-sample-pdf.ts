import { writeFile } from "node:fs/promises";
import { createDemoForm } from "../src/data/demo-values";
import { generateWorksheetPdf } from "../src/lib/pdf/generate";

async function main(): Promise<void> {
  const bytes = await generateWorksheetPdf(createDemoForm());
  const output = new URL("../_sample-generated.pdf", import.meta.url);
  await writeFile(output, bytes);
  console.log(`Wrote ${output.pathname}`);
}

void main();
