import { test } from "node:test";
import assert from "node:assert/strict";
import { isProductionHost } from "./indexing";
test("xyncwave.com and www stay indexable", () => { assert.equal(isProductionHost("xyncwave.com"), true); assert.equal(isProductionHost("WWW.Xyncwave.com"), true); });
test("Lovable and other hosts are never indexable", () => {
  for (const h of ["xyncwave.lovable.app", "xyncwave-growth-engine.lovable.app", "id-preview--x.lovable.app", "localhost", "xyncwave.com.evil.net", "evilxyncwave.com"]) assert.equal(isProductionHost(h), false, h);
});
