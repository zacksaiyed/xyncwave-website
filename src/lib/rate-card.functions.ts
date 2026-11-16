import { createServerFn } from "@tanstack/react-start";
import { rateCardSchema } from "./rate-card";

// The approved PDF and verified sender are absent. Fail closed before storing
// personal data or granting entitlements. Replace this prerequisite gate with
// the delivery orchestration only after both dependencies are verified.
export const requestRateCard = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => rateCardSchema.parse(input))
  .handler(async (): Promise<{ ok: false; error: string }> => ({
    ok: false,
    error: "The rate card is not available by email yet. Please try again later or contact Xyncwave to discuss your engineering requirements.",
  }));