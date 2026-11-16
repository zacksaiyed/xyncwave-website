CREATE TABLE public.whitepaper_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id TEXT NOT NULL,
  full_name TEXT NOT NULL,
  business_email TEXT NOT NULL,
  phone TEXT,
  marketing_consent BOOLEAN NOT NULL DEFAULT false,
  attribution JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'requested',
  download_token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(24), 'hex'),
  token_expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '72 hours'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.whitepaper_requests TO service_role;

ALTER TABLE public.whitepaper_requests ENABLE ROW LEVEL SECURITY;

-- No public policies: only server-side service-role code reads or writes this table.

CREATE INDEX whitepaper_requests_email_asset_idx ON public.whitepaper_requests (business_email, asset_id, created_at);
CREATE INDEX whitepaper_requests_token_idx ON public.whitepaper_requests (download_token);