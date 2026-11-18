-- Enquiry storage for the website's own Supabase project.
-- Visitors may only INSERT; nobody can read or change rows with the public key.
-- Read enquiries in the Supabase dashboard (Table Editor) or with the service role.

create table if not exists public.lead_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 100),
  work_email text not null check (char_length(work_email) between 3 and 255),
  company text not null check (char_length(company) between 1 and 160),
  role text check (role is null or char_length(role) <= 120),
  lead_type text not null check (char_length(lead_type) <= 40),
  problem text not null check (char_length(problem) between 1 and 200),
  message text check (message is null or char_length(message) <= 3000),
  details jsonb not null default '{}'::jsonb,
  attribution jsonb not null default '{}'::jsonb,
  qualification text not null default 'medium_intent',
  status text not null default 'new'
);

alter table public.lead_submissions enable row level security;

drop policy if exists "Anyone can submit an enquiry" on public.lead_submissions;
create policy "Anyone can submit an enquiry"
  on public.lead_submissions for insert
  to anon, authenticated
  with check (true);

grant insert on public.lead_submissions to anon, authenticated;
grant all on public.lead_submissions to service_role;

create index if not exists lead_submissions_created_at_idx on public.lead_submissions (created_at desc);

-- Keep-alive: a scheduled request reads this row so the free-plan project never pauses from inactivity.
create table if not exists public.keepalive (
  id int primary key,
  note text not null default 'ping'
);
insert into public.keepalive (id) values (1) on conflict do nothing;
alter table public.keepalive enable row level security;
drop policy if exists "Keepalive is readable" on public.keepalive;
create policy "Keepalive is readable" on public.keepalive for select to anon using (true);
grant select on public.keepalive to anon;
grant all on public.keepalive to service_role;
