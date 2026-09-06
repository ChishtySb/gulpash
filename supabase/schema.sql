-- ==========================================================
-- GULPASH.PK — PRODUCTION SUPABASE RELATIONAL SCHEMA & POLICIES
-- Brand: GulPash | Domain: gulpash.pk
-- Compatible with PostgreSQL 15+ / Supabase
-- ==========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & PROFILES (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'manager')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  display_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. COLLECTIONS
CREATE TABLE IF NOT EXISTS public.collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  banner_url TEXT,
  display_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  short_description TEXT,
  sku TEXT UNIQUE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  collection_id UUID REFERENCES public.collections(id) ON DELETE SET NULL,
  category_name TEXT NOT NULL,
  collection_name TEXT,
  price NUMERIC(10,2) NOT NULL, -- in PKR
  compare_at_price NUMERIC(10,2),
  cost_price NUMERIC(10,2),
  stock INT NOT NULL DEFAULT 0,
  fabric TEXT NOT NULL,
  colors TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{"Unstitched", "S", "M", "L", "XL"}',
  tags TEXT[] DEFAULT '{}',
  is_visible BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_best_seller BOOLEAN DEFAULT FALSE,
  is_new_arrival BOOLEAN DEFAULT FALSE,
  is_sold_out BOOLEAN DEFAULT FALSE,
  rating NUMERIC(3,2) DEFAULT 5.00,
  review_count INT DEFAULT 0,
  details JSONB DEFAULT '{}'::jsonb,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PRODUCT IMAGES
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PRODUCT VIDEOS
CREATE TABLE IF NOT EXISTS public.product_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  video_url TEXT NOT NULL,
  poster_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL, -- e.g. GP-94821
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_whatsapp TEXT,
  address TEXT NOT NULL,
  apartment TEXT,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  postal_code TEXT,
  order_notes TEXT,
  subtotal NUMERIC(10,2) NOT NULL,
  shipping_fee NUMERIC(10,2) DEFAULT 0,
  discount NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('Cash on Delivery (COD)', 'Direct Bank Transfer', 'Card Payment')),
  payment_status TEXT DEFAULT 'Unpaid' CHECK (payment_status IN ('Unpaid', 'Paid')),
  order_status TEXT DEFAULT 'Pending' CHECK (order_status IN ('Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned')),
  tracking_number TEXT,
  courier_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  size TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  image_url TEXT,
  sku TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  city TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  is_verified_purchase BOOLEAN DEFAULT TRUE,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. HOMEPAGE CMS & HERO CONFIG
CREATE TABLE IF NOT EXISTS public.homepage_cms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key TEXT UNIQUE NOT NULL,
  data JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  link TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. SITE SETTINGS
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_cms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public can read visible catalog items
CREATE POLICY "Public can view active categories" ON public.categories FOR SELECT USING (is_visible = true);
CREATE POLICY "Public can view active collections" ON public.collections FOR SELECT USING (is_visible = true);
CREATE POLICY "Public can view visible products" ON public.products FOR SELECT USING (is_visible = true);
CREATE POLICY "Public can view product media" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Public can view product videos" ON public.product_videos FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view approved reviews" ON public.reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Public can view active announcements" ON public.announcements FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view CMS data" ON public.homepage_cms FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view public site settings" ON public.site_settings FOR SELECT USING (true);

-- Anyone can insert orders (for checkout)
CREATE POLICY "Public can create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can create order items" ON public.order_items FOR INSERT WITH CHECK (true);

-- Admin has full read/write access to all tables
CREATE POLICY "Admins full access to categories" ON public.categories FOR ALL USING (auth.jwt() ->> 'email' LIKE '%@gulpash.pk');
CREATE POLICY "Admins full access to collections" ON public.collections FOR ALL USING (auth.jwt() ->> 'email' LIKE '%@gulpash.pk');
CREATE POLICY "Admins full access to products" ON public.products FOR ALL USING (auth.jwt() ->> 'email' LIKE '%@gulpash.pk');
CREATE POLICY "Admins full access to orders" ON public.orders FOR ALL USING (auth.jwt() ->> 'email' LIKE '%@gulpash.pk');
CREATE POLICY "Admins full access to CMS" ON public.homepage_cms FOR ALL USING (auth.jwt() ->> 'email' LIKE '%@gulpash.pk');
CREATE POLICY "Admins full access to settings" ON public.site_settings FOR ALL USING (auth.jwt() ->> 'email' LIKE '%@gulpash.pk');

-- ==========================================================
-- STORAGE BUCKETS SETUP (Execute in Supabase Storage SQL)
-- ==========================================================
-- insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true);
-- insert into storage.buckets (id, name, public) values ('product-videos', 'product-videos', true);
-- insert into storage.buckets (id, name, public) values ('hero-images', 'hero-images', true);
-- insert into storage.buckets (id, name, public) values ('hero-videos', 'hero-videos', true);
-- insert into storage.buckets (id, name, public) values ('category-images', 'category-images', true);
-- insert into storage.buckets (id, name, public) values ('site-assets', 'site-assets', true);
