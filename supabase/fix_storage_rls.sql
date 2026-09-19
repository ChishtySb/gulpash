-- ==============================================================================
-- GULPASH SUPABASE STORAGE RLS POLICIES MIGRATION
-- Run this in your Supabase SQL Editor if needed to configure all Storage RLS
-- ==============================================================================

-- 1. Ensure all public media buckets exist and are flagged public = true
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT (id) DO UPDATE SET public = true;
INSERT INTO storage.buckets (id, name, public) VALUES ('hero-images', 'hero-images', true) ON CONFLICT (id) DO UPDATE SET public = true;
INSERT INTO storage.buckets (id, name, public) VALUES ('hero-videos', 'hero-videos', true) ON CONFLICT (id) DO UPDATE SET public = true;
INSERT INTO storage.buckets (id, name, public) VALUES ('category-images', 'category-images', true) ON CONFLICT (id) DO UPDATE SET public = true;
INSERT INTO storage.buckets (id, name, public) VALUES ('site-assets', 'site-assets', true) ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Ensure private payment-proofs bucket exists with public = false
INSERT INTO storage.buckets (id, name, public) VALUES ('payment-proofs', 'payment-proofs', false) ON CONFLICT (id) DO UPDATE SET public = false;

-- 3. Storage Objects: PUBLIC STOREFRONT READ (SELECT)
-- Visitors can view images/videos in public buckets. Unauthenticated write is STRICTLY prohibited.
DROP POLICY IF EXISTS "Public can view storage objects" ON storage.objects;
DROP POLICY IF EXISTS "Public Storefront Media Read" ON storage.objects;
CREATE POLICY "Public Storefront Media Read" ON storage.objects FOR SELECT USING (
  bucket_id IN ('product-images', 'hero-images', 'hero-videos', 'category-images', 'site-assets')
);

-- 4. Storage Objects: AUTHENTICATED ADMIN INSERT (UPLOAD)
-- Authenticated admins can upload to media buckets.
DROP POLICY IF EXISTS "Admins can upload storage objects" ON storage.objects;
DROP POLICY IF EXISTS "Admin Media Storage Insert" ON storage.objects;
CREATE POLICY "Admin Media Storage Insert" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id IN ('product-images', 'hero-images', 'hero-videos', 'category-images', 'site-assets')
  AND (
    (auth.jwt() ->> 'email' LIKE '%@gulpash.pk') OR
    (auth.jwt() ->> 'email' LIKE '%@gulpash.online') OR
    ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') OR
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  )
);

-- 5. Storage Objects: AUTHENTICATED ADMIN UPDATE (REPLACE)
DROP POLICY IF EXISTS "Admins can update storage objects" ON storage.objects;
DROP POLICY IF EXISTS "Admin Media Storage Update" ON storage.objects;
CREATE POLICY "Admin Media Storage Update" ON storage.objects FOR UPDATE USING (
  bucket_id IN ('product-images', 'hero-images', 'hero-videos', 'category-images', 'site-assets')
  AND (
    (auth.jwt() ->> 'email' LIKE '%@gulpash.pk') OR
    (auth.jwt() ->> 'email' LIKE '%@gulpash.online') OR
    ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') OR
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  )
);

-- 6. Storage Objects: AUTHENTICATED ADMIN DELETE
DROP POLICY IF EXISTS "Admins can delete storage objects" ON storage.objects;
DROP POLICY IF EXISTS "Admin Media Storage Delete" ON storage.objects;
CREATE POLICY "Admin Media Storage Delete" ON storage.objects FOR DELETE USING (
  bucket_id IN ('product-images', 'hero-images', 'hero-videos', 'category-images', 'site-assets')
  AND (
    (auth.jwt() ->> 'email' LIKE '%@gulpash.pk') OR
    (auth.jwt() ->> 'email' LIKE '%@gulpash.online') OR
    ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') OR
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  )
);

-- 7. Payment Proofs Private Storage Policies (Customer upload on checkout, admin read/manage)
DROP POLICY IF EXISTS "Public can upload payment proofs" ON storage.objects;
CREATE POLICY "Public can upload payment proofs" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'payment-proofs'
);

DROP POLICY IF EXISTS "Admins can view payment proofs" ON storage.objects;
CREATE POLICY "Admins can view payment proofs" ON storage.objects FOR SELECT USING (
  bucket_id = 'payment-proofs'
  AND (
    (auth.jwt() ->> 'email' LIKE '%@gulpash.pk') OR
    (auth.jwt() ->> 'email' LIKE '%@gulpash.online') OR
    ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') OR
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  )
);

DROP POLICY IF EXISTS "Admins can manage payment proofs" ON storage.objects;
CREATE POLICY "Admins can manage payment proofs" ON storage.objects FOR ALL USING (
  bucket_id = 'payment-proofs'
  AND (
    (auth.jwt() ->> 'email' LIKE '%@gulpash.pk') OR
    (auth.jwt() ->> 'email' LIKE '%@gulpash.online') OR
    ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') OR
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  )
);
