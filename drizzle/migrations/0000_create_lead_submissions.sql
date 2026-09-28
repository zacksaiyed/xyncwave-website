CREATE TABLE public.lead_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  work_email TEXT NOT NULL CHECK (char_length(work_email) <= 255),
  company TEXT NOT NULL CHECK (char_length(company) BETWEEN 1 AND 160),
  role TEXT CHECK (role IS NULL OR char_length(role) <= 120),
  lead_type TEXT NOT NULL CHECK (lead_type IN ('general','digitalization','engineering','ai','partnership')),
  problem TEXT NOT NULL CHECK (char_length(problem) BETWEEN 1 AND 200),
  message TEXT CHECK (message IS NULL OR char_length(message) <= 3000),
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  attribution JSONB NOT NULL DEFAULT '{}'::jsonb,
  qualification TEXT NOT NULL DEFAULT 'early_intent' CHECK (qualification IN ('high_intent','medium_intent','early_intent','not_qualified')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','reviewing','contacted','closed'))
);

GRANT INSERT ON public.lead_submissions TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lead_submissions TO service_role;

ALTER TABLE public.lead_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can submit qualified lead requests"
ON public.lead_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(name) BETWEEN 1 AND 100
  AND char_length(work_email) <= 255
  AND char_length(company) BETWEEN 1 AND 160
  AND lead_type IN ('general','digitalization','engineering','ai','partnership')
  AND char_length(problem) BETWEEN 1 AND 200
  AND qualification IN ('high_intent','medium_intent','early_intent','not_qualified')
  AND status = 'new'
);

CREATE INDEX lead_submissions_created_at_idx ON public.lead_submissions (created_at DESC);
CREATE INDEX lead_submissions_type_idx ON public.lead_submissions (lead_type, qualification);