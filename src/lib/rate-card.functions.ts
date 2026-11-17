import { createServerFn } from "@tanstack/react-start";
import { rateCardSchema } from "./rate-card";

// The approved PDF and verified sender are absent. Fail closed before storing
// personal data or granting entitlements. Replace this prerequisite gate with
// the delivery orchestration only after both dependencies are verified.
//
// The team is still notified by email (Resend) so the request is never lost; nothing is stored
// and no entitlement is granted, and the visitor response below is unchanged.
export const requestRateCard = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => rateCardSchema.parse(input))
  .handler(async ({ data }): Promise<{ ok: false; error: string }> => {
    // Honeypot: bots get the same response without notifying anyone.
    if (!data.website) {
      try {
        const { sendTeamNotification, detailsTable, wrapHtml } = await import("./team-notify.server");
        await sendTeamNotification({
          subject: `New rate card request: ${data.businessEmail}`,
          replyTo: data.businessEmail,
          html: wrapHtml(
            "New engineering rate card request",
            detailsTable("Request", {
              "Business email": data.businessEmail,
              Phone: data.phone,
              Placement: data.placement,
              "Source page": data.sourcePage,
            }) + detailsTable("Attribution", data.attribution),
          ),
        });
      } catch (error) {
        console.error("rate card team notification error", error instanceof Error ? error.message : error);
      }
    }
    return {
      ok: false,
      error: "The rate card is not available by email yet. Please try again later or contact Xyncwave to discuss your engineering requirements.",
    };
  });
