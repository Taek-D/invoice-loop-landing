create extension if not exists pgcrypto;

create table if not exists public.beta_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  role_segment text not null check (role_segment in ('designer', 'video_editor', 'studio', 'other')),
  monthly_invoice_count text not null check (monthly_invoice_count in ('under_5', 'five_to_ten', 'eleven_to_twenty', 'over_twenty')),
  current_workflow text not null,
  biggest_pain text not null,
  willing_to_pay text not null check (willing_to_pay in ('yes_9900', 'yes_19900', 'not_sure', 'no')),
  wants_interview boolean not null default false,
  contact_channel text check (contact_channel in ('open_chat', 'instagram')),
  contact_value text,
  consent boolean not null default false,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  referrer text,
  stage text not null default 'new' check (stage in ('new', 'qualified', 'interview_booked', 'interviewed', 'paid_intent', 'closed')),
  contacted_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists beta_leads_stage_idx on public.beta_leads (stage);
create index if not exists beta_leads_created_at_idx on public.beta_leads (created_at desc);

alter table public.beta_leads enable row level security;
