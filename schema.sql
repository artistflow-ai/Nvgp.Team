-- NVGP STUDIO — esegui nel SQL Editor di Supabase
create table public.profiles(id uuid primary key references auth.users on delete cascade,
 stage_name text,genre text,bio_short text,bio text,photo_url text,instagram text,spotify text,youtube text,contact text,
 status text default 'In scrittura',publish_requested bool default false,is_public bool default false,updated_at timestamptz default now());
create table public.releases(id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users on delete cascade,
 title text not null,type text,release_date date,status text,is_public bool default true,created_at timestamptz default now());
create table public.admins(user_id uuid primary key references auth.users on delete cascade);
alter table profiles enable row level security;alter table releases enable row level security;alter table admins enable row level security;
create function public.is_admin() returns bool language sql security definer set search_path=public as $$select exists(select 1 from admins where user_id=auth.uid())$$;
create policy p_sel on profiles for select using(auth.uid()=id or is_admin());
create policy p_ins on profiles for insert with check(auth.uid()=id);
create policy p_upd on profiles for update using(auth.uid()=id or is_admin());
create policy r_all on releases for all using(auth.uid()=user_id or is_admin()) with check(auth.uid()=user_id or is_admin());
create policy a_self on admins for select using(user_id=auth.uid());
-- Solo un admin può cambiare is_public
create function public.guard_public() returns trigger language plpgsql security definer set search_path=public as $$
begin if not is_admin() then if tg_op='INSERT' then new.is_public:=false; else new.is_public:=old.is_public; end if; end if; return new; end$$;
create trigger t_guard before insert or update on profiles for each row execute function guard_public();
-- Dati pubblici: solo campi non sensibili
create view public.public_artists as select id,stage_name,genre,bio_short,photo_url,instagram,spotify,youtube from profiles where is_public;
create view public.public_releases as select r.id,p.stage_name,r.title,r.type,r.release_date,r.status from releases r join profiles p on p.id=r.user_id where p.is_public and r.is_public;
grant select on public_artists,public_releases to anon,authenticated;
-- Dopo la registrazione, per diventare admin: insert into admins values('<UUID del tuo utente>');
