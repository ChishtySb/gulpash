# GulPash Luxury Apparel (gulpash.pk)

Official Production eCommerce Platform for **GulPash** — Premium Pakistani Luxury Fashion, Pret, Festive Couture, and Unstitched Collections.

---

## 1. Technology Stack & Framework Architecture

- **Frontend**: React 19 + TypeScript (Strict Type Safety)
- **Bundler & Dev Server**: Vite 6 (Single-Port Container Optimized)
- **Styling**: Tailwind CSS v4 + Custom Typography (Cormorant Garamond + Plus Jakarta Sans)
- **Animations**: Motion (`motion/react`)
- **Icons**: Lucide React
- **Database / Backend**: Supabase (PostgreSQL 15+ Relational Architecture)
- **Database Schema**: Full RLS-hardened relational tables in `supabase/schema.sql`
- **Database Seed**: 100% authoritative catalog migration seed in `supabase/migration_seed.sql`
- **Hosting / Deployment Target**: Vercel (Configured via `vercel.json`) & Cloud Run / AI Studio

---

## 2. Catalog & Migration Reconciliation

| Entity | Source Catalog | Migrated / Verified | Match Status |
| :--- | :--- | :--- | :--- |
| **Products** | 68 | 68 | **PASS** (100%) |
| **Variants** | 269 | 269 | **PASS** (100%) |
| **Product Images** | 397 | 397 | **PASS** (100% Resolving HTTP 200) |
| **Product Videos** | 0 | 0 | **PASS** (Admin upload supported) |
| **Categories** | 5 | 5 | **PASS** (100%) |
| **Collections** | 6 | 6 | **PASS** (100%) |

### Source Collections & Counts:
1. **BEST SELLING**: 47 products
2. **Home**: 57 products
3. **NEW ARRIVALS**: 45 products
4. **WINTER COLLECTION**: 17 products
5. **Trending Designs**: 14 products
6. **Co-Ords**: 10 products

---

## 3. Supabase Setup Instructions

1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Execute `supabase/schema.sql` to establish tables (`products`, `product_variants`, `product_images`, `categories`, `collections`, `orders`, `profiles`) and Row Level Security (RLS) policies.
4. Execute `supabase/migration_seed.sql` to populate all 68 products, 269 variants, 397 images, categories, and collections with deterministic relational UUIDs.
5. In Supabase Storage, create a public bucket named `product-images` (with public read access).

---

## 4. Environment Variables Configuration

Copy `.env.local.example` to `.env.local` (or configure in Vercel project settings):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

NEXT_PUBLIC_SITE_URL=https://gulpash.pk
```

> **Security Note**: Never expose `SUPABASE_SERVICE_ROLE_KEY` to client-side bundles. All customer interactions are guarded by Supabase RLS.

---

## 5. Local Development & Production Build

```bash
# Install dependencies
npm install

# Type-check / Linting
npm run lint

# Production build
npm run build

# Preview build locally
npm run preview
```

---

## 6. Vercel Deployment

1. Connect your repository to Vercel.
2. Select **Vite** preset (configured via `vercel.json`).
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`).
6. Deploy!

---

## 7. Admin Dashboard & Credentials

- Admin URL: Accessible via the Lock icon in the Header or navigating directly to Admin in the menu.
- Default Admin Password: `gulpashadmin2025`
- Dynamic Brand Settings: Edit Brand Name, Domain, Logo URL, Favicon, Social Links, and WhatsApp Concierge Number directly from the Settings tab.
