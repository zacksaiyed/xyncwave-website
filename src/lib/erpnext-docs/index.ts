import { deLanding } from "./de-landing";
import { gccLanding } from "./gcc-landing";
import { arLanding } from "./ar-landing";
import { deERechnung, deDatev } from "./de-articles";
import { zatcaArticle, tallyArticle, customizationArticle, costArticle } from "./en-articles";
import { depthEnA } from "./depth-en-a";
import { depthEnB } from "./depth-en-b";
import { depthAr } from "./depth-ar";
import { depthDe } from "./depth-de";
import type { ERPDoc } from "./types";

const depth = { ...depthEnA, ...depthEnB, ...depthAr, ...depthDe };
/** Appends additional decision-depth sections to a doc without editing its base copy. */
const deepen = (d: ERPDoc): ERPDoc => ({ ...d, sections: [...d.sections, ...(depth[d.path] ?? [])] });

export const erpnextDocs = [deLanding, gccLanding, arLanding, deERechnung, deDatev, zatcaArticle, tallyArticle, customizationArticle, costArticle].map(deepen);
export const erpnextDocPaths = erpnextDocs.map(d => d.path);
