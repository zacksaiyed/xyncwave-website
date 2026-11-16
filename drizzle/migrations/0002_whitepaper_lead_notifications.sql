CREATE TABLE public.whitepaper_lead_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES public.whitepaper_requests(id) ON DELETE CASCADE,
  recipient text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  attempts integer NOT NULL DEFAULT 0,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz,
  UNIQUE (request_id, recipient)
);
GRANT ALL ON public.whitepaper_lead_notifications TO service_role;
ALTER TABLE public.whitepaper_lead_notifications ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.whitepaper_lead_notifications IS 'Internal lead notification delivery state; server-only (no anon/authenticated access).';