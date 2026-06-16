# Security & Multi-Tenancy - TipSpliter

TipSpliter uses a **Multi-Tenant (SaaS)** architecture where each user account represents a separate restaurant/business. Data isolation is strictly enforced at the database level using Supabase Row Level Security (RLS).

## 1. Database Migration (SaaS Setup)

To enable multi-tenancy and secure your data, execute the following SQL in your Supabase SQL Editor:

```sql
-- 1. Add owner_id to track which business owns each record
alter table public.staff add column owner_id uuid references auth.users(id) default auth.uid();
alter table public.daily_logs add column owner_id uuid references auth.users(id) default auth.uid();

-- 2. Enable Row Level Security (RLS)
alter table public.staff enable row level security;
alter table public.daily_logs enable row level security;
alter table public.tip_allocations enable row level security;

-- 3. Create Isolation Policies

-- STAFF: Only the owner can see and edit their staff
drop policy if exists "Authenticated users can manage staff" on public.staff;
create policy "Users can manage their own staff"
on public.staff
to authenticated
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));

-- DAILY LOGS: Only the owner can see and edit their logs
drop policy if exists "Authenticated users can manage daily logs" on public.daily_logs;
create policy "Users can manage their own daily logs"
on public.daily_logs
to authenticated
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));

-- TIP ALLOCATIONS: Access is granted if the user owns the associated daily log
drop policy if exists "Authenticated users can manage tip allocations" on public.tip_allocations;
create policy "Users can manage their own tip allocations"
on public.tip_allocations
to authenticated
using (
  exists (
    select 1 from public.daily_logs
    where daily_logs.id = tip_allocations.log_id
    and daily_logs.owner_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.daily_logs
    where daily_logs.id = tip_allocations.log_id
    and daily_logs.owner_id = (select auth.uid())
  )
);
```

## 2. Security Features implemented

- **Data Isolation:** Even if two users query `SELECT * FROM staff`, Supabase will only return the rows where `owner_id` matches their own User ID.
- **Auto-Ownership:** The `default auth.uid()` on the `owner_id` column ensures that every new record is automatically linked to the user who created it, without needing to pass the ID from the frontend.
- **Secure Authentication:** 
  - Login, Registration (Sign Up), and Password Recovery are implemented.
  - Session state is automatically cleared on Sign Out.
  - App redirects to Login screen if no valid session is found.

## 3. Deployment Checklist

- [ ] Run the SQL migration above in Supabase.
- [ ] Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel.
- [ ] In Supabase Dashboard > Authentication > URL Configuration, set your Vercel URL as a "Redirect URL".
- [ ] Disable "Allow Manual Signups" in Supabase if you want to manually invite businesses (optional).
