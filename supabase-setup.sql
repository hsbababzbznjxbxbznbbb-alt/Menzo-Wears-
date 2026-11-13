-- Run this entire file in Supabase Dashboard > SQL Editor > New query.
create table if not exists public.products (
 id uuid primary key default gen_random_uuid(),
 name text not null,
 price numeric(10,2) not null check (price > 0),
 description text default '',
 image_url text,
 created_at timestamptz not null default now()
);
create table if not exists public.admin_users (
 user_id uuid primary key references auth.users(id) on delete cascade,
 created_at timestamptz not null default now()
);
alter table public.products enable row level security;
alter table public.admin_users enable row level security;
drop policy if exists "Public can read products" on public.products;
create policy "Public can read products" on public.products for select to anon, authenticated using (true);
drop policy if exists "Admins insert products" on public.products;
create policy "Admins insert products" on public.products for insert to authenticated with check (exists(select 1 from public.admin_users a where a.user_id=(select auth.uid())));
drop policy if exists "Admins update products" on public.products;
create policy "Admins update products" on public.products for update to authenticated using (exists(select 1 from public.admin_users a where a.user_id=(select auth.uid()))) with check (exists(select 1 from public.admin_users a where a.user_id=(select auth.uid())));
drop policy if exists "Admins delete products" on public.products;
create policy "Admins delete products" on public.products for delete to authenticated using (exists(select 1 from public.admin_users a where a.user_id=(select auth.uid())));
drop policy if exists "Admins read own row" on public.admin_users;
create policy "Admins read own row" on public.admin_users for select to authenticated using (user_id=(select auth.uid()));
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('product-images','product-images',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=true,file_size_limit=5242880,allowed_mime_types=array['image/jpeg','image/png','image/webp'];
drop policy if exists "Public view product images" on storage.objects;
create policy "Public view product images" on storage.objects for select to anon,authenticated using(bucket_id='product-images');
drop policy if exists "Admins upload product images" on storage.objects;
create policy "Admins upload product images" on storage.objects for insert to authenticated with check(bucket_id='product-images' and exists(select 1 from public.admin_users a where a.user_id=(select auth.uid())));
drop policy if exists "Admins update product images" on storage.objects;
create policy "Admins update product images" on storage.objects for update to authenticated using(bucket_id='product-images' and exists(select 1 from public.admin_users a where a.user_id=(select auth.uid()))) with check(bucket_id='product-images' and exists(select 1 from public.admin_users a where a.user_id=(select auth.uid())));
drop policy if exists "Admins delete product images" on storage.objects;
create policy "Admins delete product images" on storage.objects for delete to authenticated using(bucket_id='product-images' and exists(select 1 from public.admin_users a where a.user_id=(select auth.uid())));
-- After creating your admin account in Authentication > Users, copy its UUID
-- and run: insert into public.admin_users(user_id) values ('YOUR_ADMIN_USER_UUID');
