import { useRef, useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { SmartLink } from "./app-link";
import { erpnextEnquirySchema, erpnextProjectTypes, erpnextStage } from "../lib/erpnext-enquiry";
import { submitLead } from "../lib/leads";
import { track } from "../lib/analytics";
import type { ERPLang } from "../lib/erpnext-docs/types";

const copy = {
  en: { name: "Full name", email: "Business email", company: "Company / organization", type: "Type of project", select: "Select a project need", types: [...erpnextProjectTypes] as string[], country: "Country (optional)", role: "Role (optional)", timeline: "Timeline (optional)", timelineHint: "When are you considering starting?", systems: "Current systems (optional)", systemsHint: "ERPNext, Tally, Odoo, spreadsheets…", message: "Project context (optional)", messageHint: "Which workflow, system or implementation decision needs attention? Please do not share confidential ERP records.", submit: "Discuss Your ERPNext Project", sending: "Sending…", wait: "Please wait a moment before trying again.", fail: "We couldn't send your enquiry. Please try again.", check: "Please check your details.", doneTitle: "Your ERPNext enquiry has been received.", doneBody: "Thank you for sharing the context. Your project details are saved for a relevant next conversation.", doneLink: "Explore the connected field-service platform", privacy: ["We use these details to respond to your enquiry. Please avoid confidential business data. Read our", "privacy policy"] },
  de: { name: "Vollständiger Name", email: "Geschäftliche E-Mail", company: "Unternehmen / Organisation", type: "Art des Projekts", select: "Projektbedarf auswählen", types: ["Neue ERPNext-Einführung", "ERPNext aktualisieren oder verbessern", "Frappe-Customizing", "Systeme integrieren", "ERP-Ablösung bewerten", "Sonstiges"], country: "Land (optional)", role: "Funktion (optional)", timeline: "Zeitrahmen (optional)", timelineHint: "Wann möchten Sie starten?", systems: "Aktuelle Systeme (optional)", systemsHint: "ERPNext, Sage, DATEV, Excel …", message: "Projektkontext (optional)", messageHint: "Welcher Prozess, welches System oder welche Entscheidung steht an? Bitte keine vertraulichen ERP-Daten teilen.", submit: "ERPNext-Projekt besprechen", sending: "Wird gesendet …", wait: "Bitte warten Sie einen Moment und versuchen Sie es erneut.", fail: "Ihre Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut.", check: "Bitte prüfen Sie Ihre Angaben.", doneTitle: "Ihre ERPNext-Anfrage ist eingegangen.", doneBody: "Vielen Dank für den Kontext. Ihre Projektangaben sind für ein passendes Folgegespräch gespeichert.", doneLink: "Verwandte ERPNext/Frappe-Plattform ansehen (Englisch)", privacy: ["Wir verwenden diese Angaben, um Ihre Anfrage zu beantworten. Bitte keine vertraulichen Geschäftsdaten übermitteln. Lesen Sie unsere", "Datenschutzhinweise (Englisch)"] },
  ar: { name: "الاسم الكامل", email: "البريد الإلكتروني للعمل", company: "الشركة / الجهة", type: "نوع المشروع", select: "اختر احتياج المشروع", types: ["تطبيق ERPNext جديد", "ترقية أو تحسين ERPNext", "تخصيص Frappe", "ربط الأنظمة", "تقييم استبدال نظام ERP", "أخرى"], country: "الدولة (اختياري)", role: "المسمى الوظيفي (اختياري)", timeline: "الإطار الزمني (اختياري)", timelineHint: "متى تفكرون في البدء؟", systems: "الأنظمة الحالية (اختياري)", systemsHint: "ERPNext أو Tally أو Odoo أو جداول Excel…", message: "سياق المشروع (اختياري)", messageHint: "ما سير العمل أو النظام أو القرار الذي يحتاج إلى معالجة؟ يُرجى عدم مشاركة بيانات ERP سرية.", submit: "ناقش مشروع ERPNext", sending: "جارٍ الإرسال…", wait: "يُرجى الانتظار لحظة ثم المحاولة مرة أخرى.", fail: "تعذّر إرسال طلبك. يُرجى المحاولة مرة أخرى.", check: "يُرجى مراجعة البيانات المدخلة.", doneTitle: "تم استلام طلبك بخصوص ERPNext.", doneBody: "شكرًا لمشاركة سياق مشروعك. تم حفظ التفاصيل لمحادثة متابعة مناسبة.", doneLink: "اطّلع على منصة مرتبطة بـ ERPNext/Frappe (بالإنجليزية)", privacy: ["نستخدم هذه البيانات للرد على طلبك فقط. يُرجى تجنب مشاركة بيانات سرية. اطّلع على", "سياسة الخصوصية (بالإنجليزية)"] },
} as const;

const errorMap: Record<string, Partial<Record<ERPLang, string>>> = {
  name: { de: "Bitte geben Sie Ihren Namen ein.", ar: "يُرجى إدخال اسمك." },
  workEmail: { de: "Bitte geben Sie eine gültige geschäftliche E-Mail ein.", ar: "يُرجى إدخال بريد إلكتروني صالح للعمل." },
  company: { de: "Bitte geben Sie Ihr Unternehmen an.", ar: "يُرجى إدخال اسم الشركة." },
  projectType: { en: "Please select a project need.", de: "Bitte wählen Sie einen Projektbedarf.", ar: "يُرجى اختيار نوع المشروع." },
};

export function ERPNextEnquiry({ page = "/solutions/erpnext-implementation", lang = "en", submitLabel, region: fixedRegion }: { page?: string; lang?: ERPLang; submitLabel?: string; region?: string }) {
  const t = copy[lang];
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const started = useRef(false);
  const lastAttempt = useRef(0);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setError("");
    const data = new FormData(event.currentTarget);
    const parsed = erpnextEnquirySchema.safeParse(Object.fromEntries(data.entries()));
    if (!parsed.success) { const issue = parsed.error.issues[0]; const key = String(issue?.path[0] ?? ""); setError(errorMap[key]?.[lang] ?? (lang === "en" ? issue?.message : t.check) ?? t.check); return; }
    if (Date.now() - lastAttempt.current < 5000) { setError(t.wait); return; }
    lastAttempt.current = Date.now();
    setPending(true);
    const value = parsed.data;
    const region = fixedRegion ?? (value.country || "global");
    try {
      await submitLead({ name: value.name, workEmail: value.workEmail, company: value.company, role: value.role,
        leadType: "digitalization", problem: "erpnext", message: value.message,
        details: { interest: "erpnext", solution: "erpnext", project_type: value.projectType, stage: erpnextStage(value.projectType), country: value.country, timeline: value.timeline, current_systems: value.currentSystems, language: lang, region },
        attributionContext: { source_page: page, language: lang, region, solution: "erpnext" },
      });
      setSuccess(true);
      track("form_submit", { interest: "erpnext", page, language: lang, stage: erpnextStage(value.projectType) });
      track("lead_generated", { interest: "erpnext", page });
    } catch {
      setError(t.fail);
      track("form_error", { interest: "erpnext", page });
    } finally { setPending(false); }
  }

  if (success) return <div role="status" className="border-y border-border py-12"><CheckCircle2 className="mb-5 size-8 text-primary" /><h3 className="text-2xl font-medium">{t.doneTitle}</h3><p className="mt-4 leading-7 text-muted-foreground">{t.doneBody}</p><SmartLink to="/case-studies/track-trace" className="mt-6 inline-flex items-center gap-2 text-primary">{t.doneLink}<ArrowRight className="size-4 rtl:rotate-180" /></SmartLink></div>;

  return <form onSubmit={submit} noValidate className="space-y-6" onFocus={() => { if (!started.current) { started.current = true; track("form_start", { interest: "erpnext", page, placement: "erpnext_inline" }); } }}>
    <div className="grid gap-5 sm:grid-cols-2">
      <Field name="name" label={t.name} required autoComplete="name" maxLength={100} />
      <Field name="workEmail" label={t.email} type="email" dir="ltr" required autoComplete="email" maxLength={255} />
      <Field name="company" label={t.company} required autoComplete="organization" maxLength={160} />
      <div><Label htmlFor="erpnext-projectType">{t.type}</Label><select id="erpnext-projectType" name="projectType" required defaultValue="" className="mt-2 h-12 w-full min-w-0 border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ring"><option value="" disabled>{t.select}</option>{erpnextProjectTypes.map((type, i) => <option key={type} value={type}>{t.types[i] ?? type}</option>)}</select></div>
      <Field name="country" label={t.country} autoComplete="country-name" maxLength={120} />
      <Field name="role" label={t.role} autoComplete="organization-title" maxLength={120} />
      <Field name="timeline" label={t.timeline} placeholder={t.timelineHint} maxLength={120} />
      <Field name="currentSystems" label={t.systems} placeholder={t.systemsHint} maxLength={500} />
    </div>
    <div><Label htmlFor="erpnext-message">{t.message}</Label><Textarea id="erpnext-message" name="message" maxLength={3000} placeholder={t.messageHint} className="mt-2 min-h-32" /></div>
    <div className="hidden" aria-hidden="true"><label htmlFor="erpnext-website">Website</label><input id="erpnext-website" name="website" tabIndex={-1} autoComplete="off" /></div>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    <Button type="submit" size="lg" disabled={pending} className="h-auto max-w-full whitespace-normal py-4">{pending ? t.sending : (submitLabel ?? t.submit)}<ArrowRight className="shrink-0 rtl:rotate-180" /></Button>
    <p className="text-xs leading-6 text-muted-foreground">{t.privacy[0]} <SmartLink className="underline" to="/privacy">{t.privacy[1]}</SmartLink>.</p>
  </form>;
}

function Field({ label, name, ...props }: React.ComponentProps<typeof Input> & { label: string; name: string }) {
  return <div><Label htmlFor={`erpnext-${name}`}>{label}</Label><Input id={`erpnext-${name}`} name={name} {...props} className="mt-2 h-12" /></div>;
}
