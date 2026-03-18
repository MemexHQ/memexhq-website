CREATE TABLE signups (
  id bigint primary key generated always as identity,
  email text not null unique,
  company text not null,
  created_at timestamp with time zone default now()
);

ALTER TABLE signups enable row level security;

CREATE POLICY "Allow anonymous inserts"
ON signups
for insert to anon
with check (true);
