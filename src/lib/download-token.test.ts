import { test } from "node:test";
import assert from "node:assert/strict";
import { signDownloadToken, verifyDownloadToken, downloadFilename } from "./download-token.server";

process.env["DOWNLOAD_SIGNING_SECRET"] = "test-secret";

test("a signed token round-trips", async () => {
  const token = await signDownloadToken("paper", "southern-africa-logistics-2027");
  assert.ok(token);
  assert.deepEqual(await verifyDownloadToken(token), { ok: true, kind: "paper", id: "southern-africa-logistics-2027" });
});

test("tampered tokens and wrong secrets are rejected", async () => {
  const token = (await signDownloadToken("ratecard", "rate-card"))!;
  const [payload, sig] = token.split(".");
  assert.equal((await verifyDownloadToken(`${payload}.${sig}x`)).ok, false);
  assert.equal((await verifyDownloadToken(`${payload}A.${sig}`)).ok, false);
  process.env["DOWNLOAD_SIGNING_SECRET"] = "other";
  assert.equal((await verifyDownloadToken(token)).ok, false);
  process.env["DOWNLOAD_SIGNING_SECRET"] = "test-secret";
});

test("expired tokens are reported as expired", async () => {
  const token = (await signDownloadToken("paper", "us-fintech-readiness-2027", -1000))!;
  assert.deepEqual(await verifyDownloadToken(token), { ok: false, reason: "expired" });
});

test("ids map to PDF filenames", () => {
  assert.match(downloadFilename("paper", "us-fintech-readiness-2027")!, /\.pdf$/);
  assert.match(downloadFilename("ratecard", "rate-card")!, /Rate_Card.*\.pdf$/);
  assert.equal(downloadFilename("paper", "nope"), null);
});
