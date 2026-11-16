import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowDown, ArrowRight, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { SmartLink } from "./app-link";
import { requestWhitepaper } from "../lib/whitepaper.functions";
import { track } from "../lib/analytics";
import type { ResearchPaper } from "../lib/research-papers";

function attribution(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const query = new URLSearchParams(window.location.search);
  const values: Record<string, string> = { page: window.location.pathname };
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
    const value = query.get(key);
    if (value) values[key] = value;
  }
  return values;
}

export function ResearchGate({ paper, open, onOpenChange }: { paper: ResearchPaper; open: boolean; onOpenChange: (open: boolean) => void }) {
  const submit = useServerFn(requestWhitepaper);
  const [fullName, setFullName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [started, setStarted] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  const markStart = () => {
    if (!started) {
      setStarted(true);
      track("whitepaper_form_start", { asset_id: paper.assetId });
    }
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (state === "sending") return;
    setState("sending");
    setError("");
    try {
      const result = await submit({
        data: {
          assetId: paper.assetId,
          fullName,
          businessEmail,
          phone: phone || undefined,
          marketingConsent,
          website,
          attribution: attribution(),
        },
      });
      if (result.ok) {
        setDownloadUrl(result.downloadUrl ?? "");
        setState("success");
        track("whitepaper_request_success", { asset_id: paper.assetId });
      } else {
        setState("error");
        setError(result.error);
        track("whitepaper_request_failure", { asset_id: paper.assetId, reason: "validation_or_send" });
      }
    } catch {
      setState("error");
      setError("We couldn't send your report right now. Please try again.");
      track("whitepaper_request_failure", { asset_id: paper.assetId, reason: "exception" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none sm:max-w-md">
        {state === "success" ? (
          <div className="py-4">
            <CheckCircle2 className="size-10 text-primary" />
            <DialogHeader className="mt-5">
              <DialogTitle className="text-2xl">{downloadUrl ? "Your report is ready." : "Your report has been sent."}</DialogTitle>
              <DialogDescription className="pt-2 text-base leading-7">
                {downloadUrl ? "Thank you. Download the full research PDF below — the link stays active for 72 hours." : "We've sent the research to the business email you provided. Please check your inbox and spam folder."}
              </DialogDescription>
            </DialogHeader>
            {downloadUrl && <Button className="mt-7 w-full" asChild><a href={downloadUrl} onClick={() => track("lead_magnet_download", { asset_id: paper.assetId })}>Download the PDF<ArrowDown /></a></Button>}
            <Button className="mt-3 w-full" variant={downloadUrl ? "outline" : "default"} asChild>
              <SmartLink to="/contact">{paper.afterCta}<ArrowRight /></SmartLink>
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Get the Full Research by Email</DialogTitle>
              <DialogDescription className="pt-2 text-base leading-7">
                Enter your name and business email to receive the complete report as a PDF. Phone is optional.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={onSubmit} className="mt-4 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="wp-name">Full Name *</Label>
                <Input id="wp-name" className="rounded-none" value={fullName} onChange={(e) => { setFullName(e.target.value); markStart(); }} required maxLength={100} autoComplete="name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wp-email">Business Email *</Label>
                <Input id="wp-email" className="rounded-none" type="email" value={businessEmail} onChange={(e) => { setBusinessEmail(e.target.value); markStart(); }} required maxLength={255} autoComplete="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wp-phone">Phone Number (Optional)</Label>
                <Input id="wp-phone" className="rounded-none" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={40} autoComplete="tel" />
              </div>
              <div className="absolute -left-[9999px] top-0" aria-hidden="true">
                <Label htmlFor="wp-website">Website</Label>
                <Input id="wp-website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>
              <label className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                <Checkbox checked={marketingConsent} onCheckedChange={(v) => setMarketingConsent(v === true)} className="mt-1 rounded-none" />
                <span>I'd like to receive occasional Xyncwave research and insights by email. Optional — the report is sent either way.</span>
              </label>
              {state === "error" && <p className="text-sm font-medium text-destructive" role="alert">{error}</p>}
              <Button type="submit" className="w-full" size="lg" disabled={state === "sending"}>
                {state === "sending" ? "Sending your report…" : "Email Me the Full White Paper"}
                {state !== "sending" && <ArrowRight />}
              </Button>
              <p className="text-xs leading-5 text-muted-foreground">
                You will receive <span className="font-medium text-foreground">{paper.title}</span>. Your details are used to deliver the report and handle your enquiry, as described in our{" "}
                <SmartLink to="/privacy" className="underline underline-offset-2">privacy policy</SmartLink>.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
