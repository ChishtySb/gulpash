-- ==========================================================
-- GULPASH.PK — SUPABASE CATALOG MIGRATION SQL SCRIPT
-- Authorized Source: https://anabyagarments.com/ -> https://gulpash.pk/
-- Products: 38 | Variants: 162 | Images: 220 | Categories: 5 | Collections: 6
-- Controlled Catalog Replacement: Tawakal Catalog Removed -> Anabya Catalog Imported
-- Brand Identity: GulPash | Domain: gulpash.pk
-- ==========================================================

-- Clean up existing Tawakal products and relations if running a fresh import
-- (Preserves users, profiles, auth, settings, orders, reviews, CMS)
TRUNCATE TABLE public.product_collections, public.product_categories, public.product_images, public.product_variants, public.products CASCADE;

-- 1. Insert Categories
INSERT INTO public.categories (id, name, slug, description, image_url, display_order, is_visible)
VALUES ('93053437-9ec9-4242-a7b9-a99514548627', '3-Piece Ensembles', '3-piece-ensembles', 'Exquisite 3-piece designer ensembles complete with shirt, trouser, and dupatta.', '/products/anabya/aazure-3piece/01_49544837890281.jpg', 1, true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, image_url = EXCLUDED.image_url;
INSERT INTO public.categories (id, name, slug, description, image_url, display_order, is_visible)
VALUES ('7138fe69-1731-41d8-ab8f-cad303d82089', '2-Piece Ensembles', '2-piece-ensembles', 'Versatile 2-piece shirts and trousers with contemporary tailoring and embroidery.', '/products/anabya/zaarif-cotton-2-pc-emb/01_49440049594601.jpg', 2, true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, image_url = EXCLUDED.image_url;
INSERT INTO public.categories (id, name, slug, description, image_url, display_order, is_visible)
VALUES ('d265519d-8ed1-4fdd-ad7c-a775c0a9f636', 'Stitched', 'stitched', 'GulPash luxury Stitched ready-to-wear ensembles. Master-crafted Pakistani tailoring and premium textiles.', '/products/anabya/alize-3pcs/01_49440049594601.jpg', 3, true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, image_url = EXCLUDED.image_url;
INSERT INTO public.categories (id, name, slug, description, image_url, display_order, is_visible)
VALUES ('3dbf3569-cf4c-40a5-a6a1-ac8f5a49a0a9', 'Luxury Pret', 'luxury-pret', 'Handcrafted festive pret with intricate embroidery and timeless silhouettes.', '/products/anabya/zar-e-sabz-3piece/01_49544837890281.jpg', 4, true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, image_url = EXCLUDED.image_url;
INSERT INTO public.categories (id, name, slug, description, image_url, display_order, is_visible)
VALUES ('f4d58d48-6c5c-4add-a10b-df56f77b0663', 'Unstitched / Stitched', 'unstitched-stitched', 'GulPash signature collections crafted in premium lawn, chiffon, dhank, and linen.', '/products/anabya/amber-3piece/01_49544837890281.jpg', 5, true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, image_url = EXCLUDED.image_url;

-- 2. Insert Collections
INSERT INTO public.collections (id, name, slug, description, image_url, banner_url, display_order, is_visible)
VALUES ('66142d53-e454-45bb-aa46-f0ef5a46af98', 'ALL ENSEMBLES', 'all', 'Complete GulPash pret & couture catalog. Discover our master-crafted ready-to-wear silhouettes.', '/products/anabya/aazure-3piece/01_49544837890281.jpg', '/products/anabya/aazure-3piece/01_49544837890281.jpg', 1, true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, image_url = EXCLUDED.image_url, banner_url = EXCLUDED.banner_url;
INSERT INTO public.collections (id, name, slug, description, image_url, banner_url, display_order, is_visible)
VALUES ('46f715c2-0f7d-4ccc-ad6b-2a1110582e70', 'TRENDING', 'best-selling', 'Our most coveted, highest-demand artisanal Pakistani ready-to-wear ensembles.', '/products/anabya/zar-e-sabz-3piece/01_49544837890281.jpg', '/products/anabya/zar-e-sabz-3piece/01_49544837890281.jpg', 2, true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, image_url = EXCLUDED.image_url, banner_url = EXCLUDED.banner_url;
INSERT INTO public.collections (id, name, slug, description, image_url, banner_url, display_order, is_visible)
VALUES ('a3237583-8df2-41df-a438-dd89a83e9b3f', 'NEW ARRIVALS', 'new-arrivals', 'The freshest silhouettes, hand-embellished luxury fabrics, and contemporary Pakistani couture cuts.', '/products/anabya/zaarif-cotton-2-pc-emb/01_49440049594601.jpg', '/products/anabya/zaarif-cotton-2-pc-emb/01_49440049594601.jpg', 3, true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, image_url = EXCLUDED.image_url, banner_url = EXCLUDED.banner_url;
INSERT INTO public.collections (id, name, slug, description, image_url, banner_url, display_order, is_visible)
VALUES ('3ea29e8b-052b-42d5-aefc-b8f2ecce1efe', 'CO-ORDS', 'co-ords', 'Chic matching separates and tailored 2-piece coords designed for effortless sophistication.', '/products/anabya/zaarif-cotton-2-pc-emb/01_49440049594601.jpg', '/products/anabya/zaarif-cotton-2-pc-emb/01_49440049594601.jpg', 4, true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, image_url = EXCLUDED.image_url, banner_url = EXCLUDED.banner_url;
INSERT INTO public.collections (id, name, slug, description, image_url, banner_url, display_order, is_visible)
VALUES ('6c19f56a-a756-4050-a710-e9296236afc4', 'WINTER COLLECTION', 'winter-collection', 'Rich winter textiles including premium Dhank, warm linen, and seasonal embroidery.', '/products/anabya/alize-3pcs/01_49440049594601.jpg', '/products/anabya/alize-3pcs/01_49440049594601.jpg', 5, true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, image_url = EXCLUDED.image_url, banner_url = EXCLUDED.banner_url;
INSERT INTO public.collections (id, name, slug, description, image_url, banner_url, display_order, is_visible)
VALUES ('219461da-e2c2-42a8-a78e-be4b2c944eca', 'SHORT LENGTH', 'short-length-article', 'Contemporary short tunic lengths paired with straight trousers or culottes.', '/products/anabya/elara/01_49440049594601.jpg', '/products/anabya/elara/01_49440049594601.jpg', 6, true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, image_url = EXCLUDED.image_url, banner_url = EXCLUDED.banner_url;

-- 3. Insert Products
INSERT INTO public.products (id, title, slug, description, short_description, sku, category_id, collection_id, category_name, collection_name, price, compare_at_price, stock, sizes, fabric, is_visible, is_featured, is_best_seller, is_new_arrival, rating, review_count, seo_title, seo_description)
VALUES ('4f1c277b-917f-47e6-a855-d5b2c493757d', 'Aazure 3Piece', 'aazure-3piece', '<h3><strong>Aazure 3-Piece</strong></h3>
<p>A beautifully stitched cotton lawn outfit featuring an embroidered shirt, plain trouser, and a graceful chiffon dupatta—perfect for an elegant and comfortable look.</p>
<p><strong>Fabric Details</strong></p>
<ul>
<li>
<p><strong>Fabric:</strong> Cotton Lawn</p>
</li>
<li>
<p><strong>Shirt:</strong> Embroidered Shirt</p>
</li>
<li>
<p><strong>Trouser:</strong> Plain Trouser</p>
</li>
<li>
<p><strong>Dupatta:</strong> Chiffon Dupatta</p>
</li>
<li>
<p><strong>Type:</strong> Stitched<br><br><img src="https://cdn.shopify.com/s/files/1/0814/7419/1593/files/44_to_45.png?v=1785787631" alt="" width="290" height="193"><br></p>
</li>
</ul>', 'Aazure 3Piece — Authentic GulPash ready-to-wear ensemble with handcrafted embroidery and signature tailoring.', 'GP-9362127978729', '93053437-9ec9-4242-a7b9-a99514548627', '66142d53-e454-45bb-aa46-f0ef5a46af98', '3-Piece Ensembles', 'TRENDING', 5999, 8250, 25, '{"Extra Large (XL)","Small (S)","Medium (M)","Large (L)"}', 'Cotton', true, true, true, false, 5, 0, 'Aazure 3Piece | GulPash Luxury Pret', 'Order Aazure 3Piece online from GulPash. Handcrafted Pakistani pret, premium Cotton, fast delivery across Pakistan.')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, stock = EXCLUDED.stock, is_visible = EXCLUDED.is_visible;
INSERT INTO public.products (id, title, slug, description, short_description, sku, category_id, collection_id, category_name, collection_name, price, compare_at_price, stock, sizes, fabric, is_visible, is_featured, is_best_seller, is_new_arrival, rating, review_count, seo_title, seo_description)
VALUES ('7d78784f-55b3-4997-ad84-b8f5a05f622c', 'Aleeeza Black 3pcs', 'alize-black-3pcs-embroidery', '<p><span style="color: rgb(0, 0, 0);"><!-- TRUST BADGES (LARGE + PREMIUM) --></span></p>
<div style="display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin-bottom: 14px; font-size: 14px;"></div>
<p style="font-size: 13px; color: #888; margin-bottom: 8px;"><strong><span style="color: rgb(0, 0, 0);">Premium Linen Shirt &amp; Trouser • Chiffon Dupatta</span></strong></p>
<p style="font-size: 14px; line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">A timeless black 3-piece ensemble designed with graceful embroidery and a refined silhouette. Crafted from premium linen and paired with a soft chiffon dupatta, Alize Black offers a perfect blend of modest elegance and modern sophistication.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Product Highlights</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Premium linen embroidered shirt</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Long-length design for a graceful fall</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Classic and modest silhouette</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Matching trouser for a complete look</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Soft chiffon dupatta with elegant flow</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Fabric &amp; Feel</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Made with breathable premium linen for comfort and structure, complemented by a lightweight chiffon dupatta that adds softness and movement.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Occasion</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Perfect for fall wear, evening gatherings, and semi-formal occasions — designed to deliver a polished and elegant look.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Product Details</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fabric: Premium Linen (Shirt &amp; Trouser)</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Dupatta: Soft Chiffon</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Style: Long-length shirt</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Silhouette: Classic &amp; modest</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Season: Fall Wear</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Sizes: Small, Medium, Large, XL</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Delivery &amp; Payment</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Cash on Delivery available nationwide</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fast shipping across Pakistan</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Carefully packed for quality assurance</span></li>
</ul>
<p style="font-size: 13px; color: #555; margin-top: 5px;"><span style="color: rgb(0, 0, 0);">Limited pieces available — restocks are not guaranteed.</span></p>', 'Aleeeza Black 3pcs — Authentic GulPash ready-to-wear ensemble with handcrafted embroidery and signature tailoring.', 'GP-9312217104617', '93053437-9ec9-4242-a7b9-a99514548627', '66142d53-e454-45bb-aa46-f0ef5a46af98', '3-Piece Ensembles', 'NEW ARRIVALS', 5999, 8250, 100, '{"s","m","l","xl"}', 'Premium Linen (Shirt & Trouser)', true, false, false, true, 5, 0, 'Aleeeza Black 3pcs | GulPash Luxury Pret', 'Order Aleeeza Black 3pcs online from GulPash. Handcrafted Pakistani pret, premium Premium Linen (Shirt & Trouser), fast delivery across Pakistan.')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, stock = EXCLUDED.stock, is_visible = EXCLUDED.is_visible;
INSERT INTO public.products (id, title, slug, description, short_description, sku, category_id, collection_id, category_name, collection_name, price, compare_at_price, stock, sizes, fabric, is_visible, is_featured, is_best_seller, is_new_arrival, rating, review_count, seo_title, seo_description)
VALUES ('7aa3b55d-255c-4d23-a44b-4edea63e374a', 'Alize 3Pcs', 'alize-3pcs', '<p><br><br></p>
<p><span>Fabric: Dhank<br></span></p>
<ul>
<li data-end="784" data-start="736">
<p data-end="784" data-start="738"><strong data-end="782" data-start="738">3 Piece Suit (Shirt + Trouser + Dupatta )<br></strong></p>
</li>
<li data-end="1001" data-start="960">
<p data-end="1001" data-start="962"><strong data-end="972" data-start="962">Style:</strong><span> </span>Long-length graceful shirt</p>
</li>
<li data-end="1001" data-start="960">
<strong data-end="972" data-start="962"><strong data-end="1015" data-start="1004">Season:</strong><span> Winter<br><img src="https://cdn.shopify.com/s/files/1/0977/8429/9803/files/co_ord_48.png?v=1761008602"></span></strong><br>
</li>
</ul>', 'Alize 3Pcs — Authentic GulPash ready-to-wear ensemble with handcrafted embroidery and signature tailoring.', 'GP-9312217170153', '93053437-9ec9-4242-a7b9-a99514548627', '66142d53-e454-45bb-aa46-f0ef5a46af98', '3-Piece Ensembles', 'NEW ARRIVALS', 5999, 8250, 100, '{"small","medium","large","xl"}', 'Dhank', true, false, false, true, 5, 0, 'Alize 3Pcs | GulPash Luxury Pret', 'Order Alize 3Pcs online from GulPash. Handcrafted Pakistani pret, premium Dhank, fast delivery across Pakistan.')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, stock = EXCLUDED.stock, is_visible = EXCLUDED.is_visible;
INSERT INTO public.products (id, title, slug, description, short_description, sku, category_id, collection_id, category_name, collection_name, price, compare_at_price, stock, sizes, fabric, is_visible, is_featured, is_best_seller, is_new_arrival, rating, review_count, seo_title, seo_description)
VALUES ('1137ec03-4d5c-4fc3-a86a-6171252552f0', 'Amber 3Piece', 'amber-3piece', '<p><strong>Amber 3-Piece</strong></p>
<p>A beautifully stitched cotton lawn outfit featuring an embroidered shirt, plain trouser, and a graceful chiffon dupatta—perfect for a timeless and elegant look.</p>
<p><strong>Fabric Details</strong></p>
<ul>
<li>
<p><strong>Fabric:</strong> Cotton Lawn</p>
</li>
<li>
<p><strong>Shirt:</strong> Embroidered Shirt</p>
</li>
<li>
<p><strong>Trouser:</strong> Embroidered Trouser</p>
</li>
<li>
<p><strong>Dupatta:</strong> <span>Chiffon </span>Dupatta</p>
</li>
<li>
<p><strong>Type:</strong> Stitched</p>
</li>
</ul>
<p><br><br><img src="https://cdn.shopify.com/s/files/1/0814/7419/1593/files/44_to_45.png?v=1785787631" alt="" width="290" height="193"><br></p>', 'Amber 3Piece — Authentic GulPash ready-to-wear ensemble with handcrafted embroidery and signature tailoring.', 'GP-9362138333417', '93053437-9ec9-4242-a7b9-a99514548627', '66142d53-e454-45bb-aa46-f0ef5a46af98', '3-Piece Ensembles', 'TRENDING', 5999, 8250, 100, '{"Small (S)","Medium (M)","Large (L)","Extra Large (XL)"}', 'Cotton', true, true, true, false, 5, 0, 'Amber 3Piece | GulPash Luxury Pret', 'Order Amber 3Piece online from GulPash. Handcrafted Pakistani pret, premium Cotton, fast delivery across Pakistan.')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, stock = EXCLUDED.stock, is_visible = EXCLUDED.is_visible;
INSERT INTO public.products (id, title, slug, description, short_description, sku, category_id, collection_id, category_name, collection_name, price, compare_at_price, stock, sizes, fabric, is_visible, is_featured, is_best_seller, is_new_arrival, rating, review_count, seo_title, seo_description)
VALUES ('a020657f-4e8f-47c5-a90d-e129669dc324', 'Armeen 3pcs', 'armeen-3pcs', '<p><span style="color: rgb(0, 0, 0);"><!-- TRUST BADGES (LARGE + PREMIUM) --></span></p>
<div style="display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin-bottom: 14px; font-size: 14px;"></div>
<h2 style="font-weight: 600; margin-bottom: 6px;"><span style="color: rgb(0, 0, 0);">Armeen — Elegant Festive 3Pcs</span></h2>
<p style="font-size: 13px; color: #888; margin-bottom: 8px;"><strong><span style="color: rgb(0, 0, 0);">Cotton Embroidered Shirt • Chiffon Dupatta • Complete 3Pcs Set</span></strong></p>
<p style="font-size: 14px; line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">A beautifully designed 3-piece ensemble that blends traditional charm with modern elegance. Armeen is crafted with a premium cotton embroidered shirt, detailed neckline, and a soft chiffon dupatta — creating a graceful look perfect for festive occasions.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Product Highlights</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Premium cotton embroidered shirt</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Elegant neckline with fine detailing</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Border detailing for a refined finish</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Soft &amp; flowy chiffon dupatta</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">3-piece complete ready-to-wear outfit</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Fabric &amp; Feel</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Lightweight cotton fabric ensures breathable comfort, while the chiffon dupatta adds a soft, graceful flow — perfect for all-day wear.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Occasion</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Ideal for Eid, festive gatherings, and special occasions — designed to give you an effortlessly elegant and polished look.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Delivery &amp; Payment</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Cash on Delivery available nationwide</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fast shipping across Pakistan</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Carefully packed for quality assurance</span></li>
</ul>
<p style="font-size: 13px; color: #555; margin-top: 5px;"><span style="color: rgb(0, 0, 0);">Limited pieces available — restocks are not guaranteed.</span></p>', 'Armeen 3pcs — Authentic GulPash ready-to-wear ensemble with handcrafted embroidery and signature tailoring.', 'GP-9312216908009', '93053437-9ec9-4242-a7b9-a99514548627', '66142d53-e454-45bb-aa46-f0ef5a46af98', '3-Piece Ensembles', 'NEW ARRIVALS', 5999, 8250, 75, '{"small / black","medium / black","large / black","xl / black"}', 'Cotton', true, false, false, true, 5, 0, 'Armeen 3pcs | GulPash Luxury Pret', 'Order Armeen 3pcs online from GulPash. Handcrafted Pakistani pret, premium Cotton, fast delivery across Pakistan.')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, stock = EXCLUDED.stock, is_visible = EXCLUDED.is_visible;
INSERT INTO public.products (id, title, slug, description, short_description, sku, category_id, collection_id, category_name, collection_name, price, compare_at_price, stock, sizes, fabric, is_visible, is_featured, is_best_seller, is_new_arrival, rating, review_count, seo_title, seo_description)
VALUES ('71f2b516-7326-4ed0-a553-5877dfdc668b', 'Azmeen 3 Piece', 'azmeen-3-piece', '<p><strong>Azmeen 3-Piece</strong></p>
<p>A beautifully stitched cotton lawn outfit featuring an embroidered shirt, elegant embroidered plazo, and a graceful embroidered chiffon dupatta—perfect for a timeless and sophisticated look.</p>
<p><strong>Fabric Details</strong></p>
<ul>
<li style="list-style-type: none;">
<ul>
<li>
<p><strong>Fabric:</strong> Cotton Lawn</p>
</li>
<li>
<p><strong>Shirt:</strong> Embroidered Shirt</p>
</li>
<li>
<p><strong>Trouser:</strong> Embroidered Plazo</p>
</li>
<li>
<p><strong>Dupatta:</strong> Embroidered Chiffon Dupatta</p>
</li>
<li>
<p><strong>Type:</strong> Stitched</p>
</li>
</ul>
</li>
</ul>
<h4><img alt="" src="https://cdn.shopify.com/s/files/1/0814/7419/1593/files/37_Length.png?v=1784748312" width="293" height="196" style="font-size: 0.875rem;"></h4>', 'Azmeen 3 Piece — Authentic GulPash ready-to-wear ensemble with handcrafted embroidery and signature tailoring.', 'GP-9353919135977', '93053437-9ec9-4242-a7b9-a99514548627', '66142d53-e454-45bb-aa46-f0ef5a46af98', '3-Piece Ensembles', 'TRENDING', 5499, 7698.6, 100, '{"Small (S)","Medium (M)","Large (L)","Extra Large (XL)"}', 'Cotton', true, true, true, false, 5, 0, 'Azmeen 3 Piece | GulPash Luxury Pret', 'Order Azmeen 3 Piece online from GulPash. Handcrafted Pakistani pret, premium Cotton, fast delivery across Pakistan.')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, stock = EXCLUDED.stock, is_visible = EXCLUDED.is_visible;
INSERT INTO public.products (id, title, slug, description, short_description, sku, category_id, collection_id, category_name, collection_name, price, compare_at_price, stock, sizes, fabric, is_visible, is_featured, is_best_seller, is_new_arrival, rating, review_count, seo_title, seo_description)
VALUES ('d6c3d9b0-c2d5-4b2b-aa90-8ee2b1f4bed2', 'Blackish EMB 3PCS', 'blackish-emb-3pcs-1', '<p><span style="color: rgb(0, 0, 0);"><!-- TRUST BADGES (LARGE + PREMIUM) --></span></p>
<div style="display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin-bottom: 14px; font-size: 14px;"></div>
<h2 style="font-weight: 600; margin-bottom: 6px;"><span style="color: rgb(0, 0, 0);">Blackish — Embroidered Linen 3Pcs</span></h2>
<p style="font-size: 13px; color: #c59d5f; margin-bottom: 8px;"><strong><span style="color: rgb(255, 42, 0);">🔥 Bestseller • Premium Black Collection</span></strong></p>
<p style="font-size: 13px; color: #888; margin-bottom: 8px;"><span style="color: rgb(244, 6, 6);"><strong>Linen Shirt &amp; Trouser • Chiffon Dupatta • Complete 3PC Set</strong></span></p>
<p style="font-size: 14px; line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Step into timeless elegance with this stunning black embroidered 3-piece suit, crafted from premium linen for a refined and comfortable feel. Designed with intricate white threadwork, this outfit delivers a perfect balance of sophistication and modern style.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Product Highlights</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Premium linen embroidered shirt</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Elegant white threadwork on sleeves, back &amp; borders</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Long-length design for a graceful fall</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Classic and modest silhouette</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Matching linen trouser for a complete look</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Soft chiffon dupatta with flowy drape</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">3-piece ready-to-wear ensemble</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Fabric &amp; Feel</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Crafted from breathable premium linen, offering comfort with structure, paired with a lightweight chiffon dupatta that adds elegance and softness to the overall look.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Occasion</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Perfect for semi-formal wear, evening gatherings, and festive occasions — designed to give you a polished and standout appearance.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Product Details</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fabric: Premium Linen (Shirt &amp; Trouser)</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Dupatta: Chiffon</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Pieces: 3 (Shirt + Trouser + Dupatta)</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Color: Black</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Work: White Thread Embroidery</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Style: Long-length graceful shirt</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Season: Mid-Season Wear</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Delivery &amp; Payment</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Cash on Delivery available nationwide</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fast shipping across Pakistan</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Carefully packed for quality assurance</span></li>
</ul>
<p style="font-size: 13px; color: #555; margin-top: 5px;"><span style="color: rgb(0, 0, 0);">Limited pieces available — restocks are not guaranteed.</span></p>', 'Blackish EMB 3PCS — Authentic GulPash ready-to-wear ensemble with handcrafted embroidery and signature tailoring.', 'GP-9312217628905', '93053437-9ec9-4242-a7b9-a99514548627', '66142d53-e454-45bb-aa46-f0ef5a46af98', '3-Piece Ensembles', 'NEW ARRIVALS', 5999, 8250, 100, '{"small","medium","large","extra-large"}', 'Premium Linen (Shirt & Trouser)', true, false, false, true, 5, 0, 'Blackish EMB 3PCS | GulPash Luxury Pret', 'Order Blackish EMB 3PCS online from GulPash. Handcrafted Pakistani pret, premium Premium Linen (Shirt & Trouser), fast delivery across Pakistan.')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, stock = EXCLUDED.stock, is_visible = EXCLUDED.is_visible;
INSERT INTO public.products (id, title, slug, description, short_description, sku, category_id, collection_id, category_name, collection_name, price, compare_at_price, stock, sizes, fabric, is_visible, is_featured, is_best_seller, is_new_arrival, rating, review_count, seo_title, seo_description)
VALUES ('22b380a2-b6e0-4a74-a457-c6828458bc57', 'Elara', 'elara', '<p> <img src="https://cdn.shopify.com/s/files/1/0814/7419/1593/files/612c9a1b-2ff8-45b2-a2bd-c5247a6c5670_cf12ef96-207e-46d9-8c42-fd3fe6070b57.png?v=1785478470" alt="" width="297" height="40"></p>
<p>✅<span> </span><strong>Parcel can be opened and checked before payment.</strong></p>
<p><strong>Elara 3-Piece</strong></p>
<p>Elevate your style with this elegant 2-piece &amp; 3-piece outfit featuring a beautifully embroidered shirt and a luxurious <strong>Farshi Shalwar</strong> adorned with intricate sequin and zari work, paired with a graceful printed chiffon dupatta.</p>
<p><strong>Fabric Details</strong></p>
<ul>
<li>
<p><strong>Shirt:</strong> Embroidered <span>Shirt</span></p>
</li>
<li>
<p><strong>Trouser:</strong> Plain Trousers</p>
</li>
<li>
<p><strong>Dupatta <span>Option</span>:</strong> Chiffon Dupatta</p>
</li>
<li>
<p><strong>Type:</strong> Stitched<br><br></p>
</li>
</ul>
<p><br><img alt="" src="https://cdn.shopify.com/s/files/1/0814/7419/1593/files/de779f4a-befd-44a6-8994-413d47719dbe.png?v=1784675504" width="303" height="202"><br></p>', 'Elara — Authentic GulPash ready-to-wear ensemble with handcrafted embroidery and signature tailoring.', 'GP-9312216318185', '7138fe69-1731-41d8-ab8f-cad303d82089', '66142d53-e454-45bb-aa46-f0ef5a46af98', '2-Piece Ensembles', 'TRENDING', 3999, 7500, 200, '{"2-Piece / Small (S)","2-Piece / Medium (M)","2-Piece / Large (L)","2-Piece / Extra Large (XL)","3-Piece / Small (S)","3-Piece / Medium (M)","3-Piece / Large (L)","3-Piece / Extra Large (XL)"}', 'Chiffon', true, true, true, false, 5, 0, 'Elara | GulPash Luxury Pret', 'Order Elara online from GulPash. Handcrafted Pakistani pret, premium Chiffon, fast delivery across Pakistan.')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, stock = EXCLUDED.stock, is_visible = EXCLUDED.is_visible;
INSERT INTO public.products (id, title, slug, description, short_description, sku, category_id, collection_id, category_name, collection_name, price, compare_at_price, stock, sizes, fabric, is_visible, is_featured, is_best_seller, is_new_arrival, rating, review_count, seo_title, seo_description)
VALUES ('bf19a309-ad4e-4746-a043-4bbe1261d43d', 'Elsa Embroidery 3pcs', 'elsa-embroidery-3pcs', '<p data-start="81" data-end="125"><strong data-start="81" data-end="125">Elsa 3pcs Suit – Zinc ✨ | GulPash</strong></p>
<p data-start="127" data-end="442">✨ <strong data-start="129" data-end="140">Fabric:</strong> Premium SUMMER LINNEN<br data-start="154" data-end="157">✨ <strong data-start="159" data-end="188">Intricate Embroidery Work</strong><br data-start="188" data-end="191">✨ <strong data-start="193" data-end="240">Long, graceful shirt with elegant detailing</strong><br data-start="240" data-end="243">✨ <strong data-start="245" data-end="298">Standard-fit trousers for a sleek and modest look</strong><br data-start="298" data-end="301">✨ <strong data-start="303" data-end="327" data-is-only-node="">Soft Chiffon Dupatta</strong> completing the outfit with a refined touch<br data-start="370" data-end="373">✨ <strong data-start="375" data-end="442">Perfect blend of comfort, elegance, and timeless sophistication</strong></p>
<p data-start="444" data-end="635">🌟 A stunning <em data-start="458" data-end="472">Zinc-colored</em> embroidered 3-piece suit crafted in premium Dhank fabric, paired with a beautifully draped chiffon dupatta — designed to make you stand out with effortless charm.</p>
<p data-start="637" data-end="725">📩 <strong data-start="640" data-end="659">DM to Order Now</strong><br data-start="659" data-end="662">🛍️ <strong data-start="666" data-end="686">Order on Website</strong><br data-start="686" data-end="689">🚚 <strong data-start="692" data-end="725">Nationwide Delivery Available</strong></p>
<p data-start="727" data-end="819">⚠️ <em data-start="730" data-end="743">Disclaimer:</em> Actual product color may vary slightly due to lighting and screen settings.</p>
<p data-start="821" data-end="909">#GulPash #DhankFabric #3PcsSuit #ChiffonDupatta #ElegantWear #NewArrival #ZincSuit</p>', 'Elsa Embroidery 3pcs — Authentic GulPash ready-to-wear ensemble with handcrafted embroidery and signature tailoring.', 'GP-9312219660521', '93053437-9ec9-4242-a7b9-a99514548627', '66142d53-e454-45bb-aa46-f0ef5a46af98', '3-Piece Ensembles', 'NEW ARRIVALS', 5999, 8250, 100, '{"S – Chest 19"" / 47–48"" / Standard Size","M – Chest 21"" / 47–48"" / Standard Size","L – Chest 23"" / 47–48"" / Standard Size","XL – Chest 24"" / 47–48"" / Standard Size"}', 'Dhank', true, false, false, true, 5, 0, 'Elsa Embroidery 3pcs | GulPash Luxury Pret', 'Order Elsa Embroidery 3pcs online from GulPash. Handcrafted Pakistani pret, premium Dhank, fast delivery across Pakistan.')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, stock = EXCLUDED.stock, is_visible = EXCLUDED.is_visible;
INSERT INTO public.products (id, title, slug, description, short_description, sku, category_id, collection_id, category_name, collection_name, price, compare_at_price, stock, sizes, fabric, is_visible, is_featured, is_best_seller, is_new_arrival, rating, review_count, seo_title, seo_description)
VALUES ('f58f8a61-cb17-41f2-ae42-b53a905d0f75', 'Golden Grace', 'golden-grace', '<p data-start="119" data-end="165"><strong data-start="119" data-end="163">Mustard Long Length Embroidered Dress 💛</strong></p>
<p data-start="167" data-end="353">✨ <strong data-start="169" data-end="180">Fabric:</strong> Dhank<br data-start="186" data-end="189">✨ <strong data-start="191" data-end="218">3 Piece Suit with Shawl</strong><br data-start="218" data-end="221">✨ <strong data-start="223" data-end="252">Beautiful Embroidery Work</strong><br data-start="252" data-end="255">✨ <strong data-start="257" data-end="280" data-is-only-node="">Long Graceful Shirt</strong> with Standard-Fit Trousers<br data-start="307" data-end="310">✨ <strong data-start="312" data-end="351">Perfect Blend of Comfort &amp; Elegance</strong></p>
<p data-start="355" data-end="448">🌟 A timeless mustard outfit with elegant embroidery — made to make you stand out in style!</p>
<p data-start="450" data-end="514">📩 <strong data-start="453" data-end="473">DM to Order Now!</strong><br data-start="473" data-end="476">🚚 <strong data-start="479" data-end="512">Nationwide Delivery Available</strong></p>', 'Golden Grace — Authentic GulPash ready-to-wear ensemble with handcrafted embroidery and signature tailoring.', 'GP-9312219136233', '93053437-9ec9-4242-a7b9-a99514548627', '66142d53-e454-45bb-aa46-f0ef5a46af98', '3-Piece Ensembles', 'NEW ARRIVALS', 5999, 8250, 50, '{"S – Chest 19"" / 47–48""","M – Chest 21"" / 47–48"""}', 'Dhank', true, false, false, true, 5, 0, 'Golden Grace | GulPash Luxury Pret', 'Order Golden Grace online from GulPash. Handcrafted Pakistani pret, premium Dhank, fast delivery across Pakistan.')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, stock = EXCLUDED.stock, is_visible = EXCLUDED.is_visible;
INSERT INTO public.products (id, title, slug, description, short_description, sku, category_id, collection_id, category_name, collection_name, price, compare_at_price, stock, sizes, fabric, is_visible, is_featured, is_best_seller, is_new_arrival, rating, review_count, seo_title, seo_description)
VALUES ('35a01cae-b1ea-4c90-a30c-e23b4ecee033', 'Kaavya Emb 3pcs', 'kaavya-emb-3pcs', '<p><span style="color: rgb(0, 0, 0);"><!-- TRUST BADGES (LARGE + PREMIUM) --></span></p>
<div style="display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin-bottom: 14px; font-size: 14px;"></div>
<h2 style="font-weight: 600; margin-bottom: 6px;"><span style="color: rgb(0, 0, 0);">Kaavya — Zinc Linen 3Pcs</span></h2>
<p style="font-size: 13px; color: #c59d5f; margin-bottom: 8px;"><span style="color: rgb(251, 14, 14);"><strong>✨ Modern Classic • Premium Collection</strong></span></p>
<p style="font-size: 13px; color: #888; margin-bottom: 8px;"><strong><span style="color: rgb(0, 0, 0);">Premium Linen Embroidered Shirt &amp; Trouser • Dupatta Included</span></strong></p>
<p style="font-size: 14px; line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">A sophisticated zinc-toned 3-piece ensemble designed for modern elegance. Kaavya features intricate embroidery on premium linen, paired with a long graceful shirt and standard-fit trousers, creating a refined and effortlessly stylish look.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Product Highlights</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Premium linen embroidered shirt</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Unique zinc tone for a modern, classy look</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Long graceful shirt with elegant fall</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Standard-fit trouser for balanced styling</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Matching dupatta for a complete outfit</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">3-piece ready-to-wear ensemble</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Fabric &amp; Feel</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Crafted from breathable premium linen, offering comfort with structure — ideal for all-day wear while maintaining a polished appearance.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Occasion</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Perfect for office wear, casual gatherings, and semi-formal events — designed to give you a refined and elegant presence.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Product Details</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fabric: Premium Linen</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Work: Embroidered</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Pieces: 3 (Shirt + Trouser + Dupatta)</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Color: Zinc</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Style: Long-length graceful shirt</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Delivery &amp; Payment</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Cash on Delivery available nationwide</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fast shipping across Pakistan</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Carefully packed for quality assurance</span></li>
</ul>
<p style="font-size: 13px; color: #555; margin-top: 5px;"><span style="color: rgb(0, 0, 0);">Limited pieces available — restocks are not guaranteed.</span></p>', 'Kaavya Emb 3pcs — Authentic GulPash ready-to-wear ensemble with handcrafted embroidery and signature tailoring.', 'GP-9312219562217', '93053437-9ec9-4242-a7b9-a99514548627', '66142d53-e454-45bb-aa46-f0ef5a46af98', '3-Piece Ensembles', 'NEW ARRIVALS', 5999, 8250, 100, '{"linen / small","linen / medium","linen / large","linen / extra-large"}', 'Premium Linen', true, false, false, true, 5, 0, 'Kaavya Emb 3pcs | GulPash Luxury Pret', 'Order Kaavya Emb 3pcs online from GulPash. Handcrafted Pakistani pret, premium Premium Linen, fast delivery across Pakistan.')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, stock = EXCLUDED.stock, is_visible = EXCLUDED.is_visible;
INSERT INTO public.products (id, title, slug, description, short_description, sku, category_id, collection_id, category_name, collection_name, price, compare_at_price, stock, sizes, fabric, is_visible, is_featured, is_best_seller, is_new_arrival, rating, review_count, seo_title, seo_description)
VALUES ('84c1092f-efa7-4e69-afe2-12ca7666fe26', 'Lemon Blossom 3-Piece', 'lemon-blossom-3-piece', '<h4><strong>Lemon Blossom 3-Piece</strong></h4>
<p>A stylish stitched 3-piece outfit featuring an embroidered cotton shirt, printed Farshi Shalwar, and a chiffon dupatta—perfect for a graceful summer look.</p>
<p><strong>Fabric Details</strong></p>
<ul>
<li>
<p><strong>Fabric:</strong> Cotton</p>
</li>
<li>
<p><strong>Shirt:</strong> Embroidered Shirt</p>
</li>
<li>
<p><strong>Trouser:</strong> Printed Farshi Shalwar</p>
</li>
<li>
<p><strong>Dupatta:</strong> Chiffon Dupatta</p>
</li>
<li>
<p><strong>Type:</strong> Stitched</p>
</li>
</ul>
<h4><img alt="" src="https://cdn.shopify.com/s/files/1/0814/7419/1593/files/37_Length.png?v=1784748312" width="293" height="196"></h4>', 'Lemon Blossom 3-Piece — Authentic GulPash ready-to-wear ensemble with handcrafted embroidery and signature tailoring.', 'GP-9352267956457', '93053437-9ec9-4242-a7b9-a99514548627', '66142d53-e454-45bb-aa46-f0ef5a46af98', '3-Piece Ensembles', 'TRENDING', 5499, 7698.6, 100, '{"Small (S)","Medium (M)","Large (L)","Extra Large (XL)"}', 'Cotton', true, true, true, false, 5, 0, 'Lemon Blossom 3-Piece | GulPash Luxury Pret', 'Order Lemon Blossom 3-Piece online from GulPash. Handcrafted Pakistani pret, premium Cotton, fast delivery across Pakistan.')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, stock = EXCLUDED.stock, is_visible = EXCLUDED.is_visible;
INSERT INTO public.products (id, title, slug, description, short_description, sku, category_id, collection_id, category_name, collection_name, price, compare_at_price, stock, sizes, fabric, is_visible, is_featured, is_best_seller, is_new_arrival, rating, review_count, seo_title, seo_description)
VALUES ('f8aa8eca-5946-4225-a9a8-bac867ad0f3b', 'Meadow Grace  3 Piece', 'meadow-grace-3-piece', '<p><span style="color: rgb(0, 0, 0);"><!-- TRUST BADGES (LARGE + PREMIUM) --></span></p>
<h1>Meadow Grace – 3 Piece</h1>
<p><strong>Fabric Details</strong></p>
<ul>
<li>
<p><strong>Fabric:</strong> Cotton &amp; Linen</p>
</li>
<li>
<p><strong>Shirt:</strong> Embroidered Shirt</p>
</li>
<li>
<p><strong>Trouser:</strong> Plain Trouser</p>
</li>
<li>
<p><strong>Dupatta:</strong> Chiffon Dupatta</p>
</li>
<li>
<p><strong>Type:</strong> Stitched</p>
</li>
</ul>
<p><img src="https://cdn.shopify.com/s/files/1/0814/7419/1593/files/44_to_45.png?v=1785787631" alt="" width="314" height="209"></p>', 'Meadow Grace  3 Piece — Authentic GulPash ready-to-wear ensemble with handcrafted embroidery and signature tailoring.', 'GP-9312216875241', '93053437-9ec9-4242-a7b9-a99514548627', '66142d53-e454-45bb-aa46-f0ef5a46af98', '3-Piece Ensembles', 'TRENDING', 5999, 8250, 200, '{"Cotton / Small (S)","Cotton / Medium (M)","Cotton / Large (L)","Cotton / Extra Large (XL)","Linen / Small (S)","Linen / Medium (M)","Linen / Large (L)","Linen / Extra Large (XL)"}', 'Linen', true, true, true, false, 5, 0, 'Meadow Grace  3 Piece | GulPash Luxury Pret', 'Order Meadow Grace  3 Piece online from GulPash. Handcrafted Pakistani pret, premium Linen, fast delivery across Pakistan.')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, stock = EXCLUDED.stock, is_visible = EXCLUDED.is_visible;
INSERT INTO public.products (id, title, slug, description, short_description, sku, category_id, collection_id, category_name, collection_name, price, compare_at_price, stock, sizes, fabric, is_visible, is_featured, is_best_seller, is_new_arrival, rating, review_count, seo_title, seo_description)
VALUES ('c3d827b9-1a31-4228-a190-7a3da5a698af', 'Mehndi Emb 3Pc Stitched', 'mehndi-emb-3pc-stitched', '<p><img src="https://cdn.shopify.com/s/files/1/0638/4127/1923/files/IMG_20250427_222427.jpg?v=1745774765"><br></p>
<p><span>Fabric: Dhank<br></span></p>
<ul>
<li data-end="784" data-start="736">
<p data-end="784" data-start="738"><strong data-end="782" data-start="738">3 Piece Suit (Shirt + Trouser + Dupatta )<br></strong></p>
</li>
<li data-end="1001" data-start="960">
<p data-end="1001" data-start="962"><strong data-end="972" data-start="962">Style:</strong><span> </span>Long-length graceful shirt</p>
</li>
<li data-end="1001" data-start="960">
<strong data-end="972" data-start="962"><strong data-end="1015" data-start="1004">Season:</strong><span> Summer<br><img src="https://cdn.shopify.com/s/files/1/0977/8429/9803/files/co_ord_48.png?v=1761008602"></span></strong><br>
</li>
</ul>', 'Mehndi Emb 3Pc Stitched — Authentic GulPash ready-to-wear ensemble with handcrafted embroidery and signature tailoring.', 'GP-9312217399529', '93053437-9ec9-4242-a7b9-a99514548627', '66142d53-e454-45bb-aa46-f0ef5a46af98', '3-Piece Ensembles', 'NEW ARRIVALS', 5999, 8250, 100, '{"small","medium","large","xl"}', 'Dhank', true, false, false, true, 5, 0, 'Mehndi Emb 3Pc Stitched | GulPash Luxury Pret', 'Order Mehndi Emb 3Pc Stitched online from GulPash. Handcrafted Pakistani pret, premium Dhank, fast delivery across Pakistan.')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, stock = EXCLUDED.stock, is_visible = EXCLUDED.is_visible;
INSERT INTO public.products (id, title, slug, description, short_description, sku, category_id, collection_id, category_name, collection_name, price, compare_at_price, stock, sizes, fabric, is_visible, is_featured, is_best_seller, is_new_arrival, rating, review_count, seo_title, seo_description)
VALUES ('bce0772a-1255-47c8-afcd-5f578734316e', 'Mulberry Bloom 3 Piece', 'mulberry-bloom-3-piece', '<h3><strong><img src="https://cdn.shopify.com/s/files/1/0999/0035/8977/files/612c9a1b-2ff8-45b2-a2bd-c5247a6c5670_cf12ef96-207e-46d9-8c42-fd3fe6070b57.png?v=1786134739" alt=""></strong></h3>
<p>✅<span> </span><strong>Parcel can be opened and checked before payment.</strong></p>
<h4>
<strong></strong><strong><span>Mulberry Bloom 3-Piece</span></strong>
</h4>
<p class="isSelectedEnd"><span>A beautifully stitched cotton outfit featuring an embroidered shirt, elegant embroidered Farshi Trouser, and a graceful chiffon dupatta—perfect for a timeless and sophisticated look.</span></p>
<p class="isSelectedEnd"><strong><span>Fabric Details</span></strong></p>
<ul>
<li>
<strong><span>Shirt:</span></strong><span> Embroidered Shirt</span>
</li>
<li>
<strong><span>Trouser:</span></strong><span> Embroidered Farshi Trouser</span>
</li>
<li>
<strong><span>Dupatta:</span></strong><span> Chiffon Dupatta</span>
</li>
<li>
<strong><span>Type:</span></strong><span> Stitched</span>
</li>
<li>
<strong><span>Fabric:</span></strong><span> Cotton</span>
</li>
</ul>
<p><img src="https://cdn.shopify.com/s/files/1/0814/7419/1593/files/de779f4a-befd-44a6-8994-413d47719dbe.png?v=1784675504" alt=""></p>', 'Mulberry Bloom 3 Piece — Authentic GulPash ready-to-wear ensemble with handcrafted embroidery and signature tailoring.', 'GP-9352245313769', '93053437-9ec9-4242-a7b9-a99514548627', '66142d53-e454-45bb-aa46-f0ef5a46af98', '3-Piece Ensembles', 'TRENDING', 5299, 7419, 100, '{"Small (S)","Medium (M)","Large (L)","Extra Large (XL)"}', 'Cotton', true, true, true, false, 5, 0, 'Mulberry Bloom 3 Piece | GulPash Luxury Pret', 'Order Mulberry Bloom 3 Piece online from GulPash. Handcrafted Pakistani pret, premium Cotton, fast delivery across Pakistan.')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, stock = EXCLUDED.stock, is_visible = EXCLUDED.is_visible;
INSERT INTO public.products (id, title, slug, description, short_description, sku, category_id, collection_id, category_name, collection_name, price, compare_at_price, stock, sizes, fabric, is_visible, is_featured, is_best_seller, is_new_arrival, rating, review_count, seo_title, seo_description)
VALUES ('9719080d-6d7f-4ad7-ac0d-75142e67ab13', 'Multi Color 3Pcs Embroidery', 'multi-color-3pcs-embroidery', '<p><span style="color: rgb(0, 0, 0);"><!-- TRUST BADGES (LARGE + PREMIUM) --></span></p>
<div style="display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin-bottom: 14px; font-size: 14px;"></div>
<h2 style="font-weight: 600; margin-bottom: 6px;"><span style="color: rgb(0, 0, 0);">Multi Color — Embroidered 3Pcs Ensemble</span></h2>
<p style="font-size: 13px; color: #888; margin-bottom: 8px;"><span style="color: rgb(255, 42, 0);"><strong>Premium Linen Shirt &amp; Trouser • Chiffon Dupatta</strong></span></p>
<p style="font-size: 14px; line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">A beautifully balanced 3-piece ensemble featuring soft multi-tone embroidery on a refined base. Crafted from premium linen and paired with a lightweight chiffon dupatta, this outfit offers a perfect blend of elegance, comfort, and versatility for every season.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><strong><span style="color: rgb(0, 0, 0);">Product Highlights</span></strong></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Premium linen embroidered shirt</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Elegant multi-color detailing for a refined look</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Matching trouser for a complete coordinated outfit</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Soft chiffon dupatta with graceful fall</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">3-piece ready-to-wear ensemble</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><strong><span style="color: rgb(0, 0, 0);">Fabric &amp; Feel</span></strong></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Made with breathable premium linen suitable for all seasons, complemented by a soft and flowy chiffon dupatta that enhances the overall elegance.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><strong><span style="color: rgb(0, 0, 0);">Occasion</span></strong></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Ideal for Eid, festive gatherings, and semi-formal wear — a versatile outfit designed to keep you stylish across all occasions.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><strong><span style="color: rgb(0, 0, 0);">Product Details</span></strong></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fabric: Premium Linen</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Dupatta: Chiffon</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Pieces: 3 (Shirt, Trouser &amp; Dupatta)</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Work: Embroidered</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Color: Multi Beige</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Season: 4-Season Wear</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Occasion: Eid, Festive &amp; Semi-Formal</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><strong><span style="color: rgb(0, 0, 0);">Delivery &amp; Payment</span></strong></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Cash on Delivery available nationwide</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fast shipping across Pakistan</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Carefully packed for quality assurance</span></li>
</ul>
<p style="font-size: 13px; color: #555; margin-top: 5px;"><span style="color: rgb(0, 0, 0);">Limited pieces available — restocks are not guaranteed.</span></p>', 'Multi Color 3Pcs Embroidery — Authentic GulPash ready-to-wear ensemble with handcrafted embroidery and signature tailoring.', 'GP-9312217333993', '93053437-9ec9-4242-a7b9-a99514548627', '66142d53-e454-45bb-aa46-f0ef5a46af98', '3-Piece Ensembles', 'NEW ARRIVALS', 5999, 8250, 100, '{"small / beige","medium / beige","large / beige","extra-large / beige"}', 'Premium Linen', true, false, false, true, 5, 0, 'Multi Color 3Pcs Embroidery | GulPash Luxury Pret', 'Order Multi Color 3Pcs Embroidery online from GulPash. Handcrafted Pakistani pret, premium Premium Linen, fast delivery across Pakistan.')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, stock = EXCLUDED.stock, is_visible = EXCLUDED.is_visible;
INSERT INTO public.products (id, title, slug, description, short_description, sku, category_id, collection_id, category_name, collection_name, price, compare_at_price, stock, sizes, fabric, is_visible, is_featured, is_best_seller, is_new_arrival, rating, review_count, seo_title, seo_description)
VALUES ('47b17f35-a153-4561-a877-86519f825767', 'Multi Color Black 3Pcs', 'multi-color-black-3pcs', '<p><span style="color: rgb(0, 0, 0);"><!-- TRUST BADGES (LARGE + PREMIUM) --></span></p>
<div style="display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin-bottom: 14px; font-size: 14px;"></div>
<h2 style="font-weight: 600; margin-bottom: 6px;"><span style="color: rgb(0, 0, 0);">Multi Color Black — Premium 3Pcs Ensemble</span></h2>
<p style="font-size: 13px; color: #888; margin-bottom: 8px;"><strong><span style="color: rgb(0, 0, 0);">Premium Linen Shirt &amp; Trouser • Chiffon Dupatta</span></strong></p>
<p style="font-size: 14px; line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">A statement 3-piece outfit designed in a rich multi-tone palette over a black base, combining elegance with modern charm. Crafted from premium linen and paired with a soft chiffon dupatta, this ensemble delivers both comfort and refined style for every season.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Product Highlights</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Premium linen embroidered shirt</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Elegant multi-color detailing on black base</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Matching trouser for a complete coordinated look</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Lightweight chiffon dupatta with soft fall</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">3-piece ready-to-wear outfit</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Fabric &amp; Feel</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Made from breathable premium linen suitable for all seasons, complemented by a flowy chiffon dupatta that adds a graceful and polished finish.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Occasion</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Ideal for Eid, festive gatherings, and semi-formal wear — a versatile outfit that balances comfort with standout style.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Product Details</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fabric: Premium Linen</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Dupatta: Chiffon</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Pieces: 3 (Shirt, Trouser &amp; Dupatta)</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Work: Embroidered</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Color: Multi Beige on Black Base</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Season: 4-Season Wear</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Delivery &amp; Payment</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Cash on Delivery available nationwide</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fast shipping across Pakistan</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Carefully packed for quality assurance</span></li>
</ul>
<p style="font-size: 13px; color: #555; margin-top: 5px;"><span style="color: rgb(0, 0, 0);">Limited pieces available — restocks are not guaranteed.</span></p>', 'Multi Color Black 3Pcs — Authentic GulPash ready-to-wear ensemble with handcrafted embroidery and signature tailoring.', 'GP-9312217071849', '93053437-9ec9-4242-a7b9-a99514548627', '66142d53-e454-45bb-aa46-f0ef5a46af98', '3-Piece Ensembles', 'NEW ARRIVALS', 5999, 8250, 100, '{"small / black","medium / black","large / black","extra-large / black"}', 'Premium Linen', true, false, false, true, 5, 0, 'Multi Color Black 3Pcs | GulPash Luxury Pret', 'Order Multi Color Black 3Pcs online from GulPash. Handcrafted Pakistani pret, premium Premium Linen, fast delivery across Pakistan.')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, stock = EXCLUDED.stock, is_visible = EXCLUDED.is_visible;
INSERT INTO public.products (id, title, slug, description, short_description, sku, category_id, collection_id, category_name, collection_name, price, compare_at_price, stock, sizes, fabric, is_visible, is_featured, is_best_seller, is_new_arrival, rating, review_count, seo_title, seo_description)
VALUES ('d4bd170b-03e7-476e-a108-8cfa2e96fbae', 'Multi Flower 3 Piece', 'multi-flower-3-piece', '<h3><strong>Multi Flower 3-Piece</strong></h3>
<p>A premium embroidered floral suit crafted from soft, breathable cotton for a stylish and comfortable summer look.</p>
<h3>Product Details</h3>
<ul>
<li>
<strong>Fabric:</strong><span> </span>Premium Cotton</li>
<li>
<strong>Work:</strong><span> </span>Embroidery</li>
<li>
<strong>Pieces:</strong><span> </span>3 (Shirt, Trouser &amp; Dupatta)</li>
<li>
<strong>Style:</strong><span> </span>Long-Length Shirt</li>
<li>
<strong>Season:</strong><span> </span>Summer Wear</li>
</ul>
<p><img src="https://cdn.shopify.com/s/files/1/0814/7419/1593/files/long_length.png?v=1784682318" alt="" width="295" height="196"></p>', 'Multi Flower 3 Piece — Authentic GulPash ready-to-wear ensemble with handcrafted embroidery and signature tailoring.', 'GP-9351793475817', '93053437-9ec9-4242-a7b9-a99514548627', '66142d53-e454-45bb-aa46-f0ef5a46af98', '3-Piece Ensembles', 'TRENDING', 5999, 8250, 200, '{"Small (S) / Beige","Small (S) / black","Medium (M) / Beige","Medium (M) / black","Large (L) / Beige","Large (L) / black","Extra Large (XL) / Beige","Extra Large (XL) / black"}', 'Cotton', true, true, true, false, 5, 0, 'Multi Flower 3 Piece | GulPash Luxury Pret', 'Order Multi Flower 3 Piece online from GulPash. Handcrafted Pakistani pret, premium Cotton, fast delivery across Pakistan.')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, stock = EXCLUDED.stock, is_visible = EXCLUDED.is_visible;
INSERT INTO public.products (id, title, slug, description, short_description, sku, category_id, collection_id, category_name, collection_name, price, compare_at_price, stock, sizes, fabric, is_visible, is_featured, is_best_seller, is_new_arrival, rating, review_count, seo_title, seo_description)
VALUES ('3bc17692-61c5-4dcd-a738-d23fd7409f94', 'NEW AYRA 3PCS', 'aria-stitched-3pc', '<p><span style="color: rgb(0, 0, 0);"><!-- TRUST BADGES (LARGE + PREMIUM) --></span></p>
<div style="display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin-bottom: 14px; font-size: 14px;"><br></div>
<h2 style="font-weight: 600; margin-bottom: 6px;"><span style="color: rgb(0, 0, 0);">NEW AYRA 3PCS — Sheesha Silk 3Pc EMB</span></h2>
<p style="font-size: 13px; color: #c59d5f; margin-bottom: 8px;"><span style="color: rgb(255, 42, 0);"><strong>✨ Premium Collection • Limited Stock</strong></span></p>
<p style="font-size: 13px; color: #888; margin-bottom: 8px;"><span style="color: rgb(254, 16, 16);"><strong>Sheesha Silk Shirt &amp; Trouser • Complete 3PC Set</strong></span></p>
<p style="font-size: 14px; line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">A luxurious 3-piece ensemble crafted in elegant sheesha silk, designed to deliver a rich and graceful look. NEW AYRA 3PCS features a long-length silhouette that drapes beautifully, making it an ideal choice for refined and statement styling.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Product Highlights</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Premium sheesha silk fabric with a rich finish</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Long-length Embroidered shirt for a graceful fall</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Classic and modest silhouette</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Matching trouser for a complete outfit</span></li>
<li style="color: rgb(0, 0, 0);">
<span style="color: rgb(0, 0, 0);">3-piece ready-to-wear ensemble</span><span style="color: rgb(0, 0, 0);"></span>
</li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Fabric &amp; Feel</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Crafted from smooth and slightly glossy sheesha silk, offering a soft touch with an elegant drape — perfect for creating a premium and polished look.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Occasion</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Ideal for festive wear, evening events, and special occasions — designed to give you a sophisticated and standout appearance.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Product Details</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fabric: Sheesha Silk</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Pieces: 3 (Shirt + Trouser + Dupatta)</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Style: Long-length graceful shirt</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Delivery &amp; Payment</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Cash on Delivery available nationwide</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fast shipping across Pakistan</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Carefully packed for quality assurance</span></li>
</ul>
<p style="font-size: 13px; color: #555; margin-top: 5px;"><span style="color: rgb(0, 0, 0);">Limited pieces available — restocks are not guaranteed.</span></p>', 'NEW AYRA 3PCS — Authentic GulPash ready-to-wear ensemble with handcrafted embroidery and signature tailoring.', 'GP-9312217563369', '93053437-9ec9-4242-a7b9-a99514548627', '66142d53-e454-45bb-aa46-f0ef5a46af98', '3-Piece Ensembles', 'NEW ARRIVALS', 5999, 8250, 100, '{"small","medium","large","xl"}', 'Sheesha Silk', true, false, false, true, 5, 0, 'NEW AYRA 3PCS | GulPash Luxury Pret', 'Order NEW AYRA 3PCS online from GulPash. Handcrafted Pakistani pret, premium Sheesha Silk, fast delivery across Pakistan.')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, stock = EXCLUDED.stock, is_visible = EXCLUDED.is_visible;
INSERT INTO public.products (id, title, slug, description, short_description, sku, category_id, collection_id, category_name, collection_name, price, compare_at_price, stock, sizes, fabric, is_visible, is_featured, is_best_seller, is_new_arrival, rating, review_count, seo_title, seo_description)
VALUES ('8a3aeb94-1fa8-43ff-a032-acc5cbd5c630', 'NEW BROWNIE', 'brownish-3pc', '<p><span style="color: rgb(0, 0, 0);"><!-- TRUST BADGES (LARGE + PREMIUM) --></span></p>
<div style="display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin-bottom: 14px; font-size: 14px;"><br></div>
<h2 style="font-weight: 600; margin-bottom: 6px;"><span style="color: rgb(0, 0, 0);">NEW BROWNIE — Embroidered Linen 3Pc</span></h2>
<p style="font-size: 13px; color: #c59d5f; margin-bottom: 8px;"><span style="color: rgb(255, 42, 0);"><strong>🔥 Summer Favorite • Limited Stock</strong></span></p>
<p style="font-size: 13px; color: #888; margin-bottom: 8px;"><span style="color: rgb(245, 10, 10);"><strong>Summer Linen Shirt &amp; Trouser • Pure Chiffon Dupatta</strong></span></p>
<p style="font-size: 14px; line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">A sophisticated brown-toned 3-piece ensemble designed for effortless summer elegance. Featuring an embroidered linen shirt paired with a plain trouser and a pure chiffon dupatta, this outfit offers a refined and breathable look for warm weather styling.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Product Highlights</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Premium summer linen embroidered shirt</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Elegant earthy brown tone for a classy look</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Plain trouser for a clean and balanced outfit</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Pure chiffon dupatta with soft, flowy drape</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">3-piece complete ready-to-wear ensemble</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Fabric &amp; Feel</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Crafted from breathable summer linen for maximum comfort, paired with a lightweight pure chiffon dupatta that adds softness and elegance to the overall look.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Occasion</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Perfect for summer outings, casual gatherings, and semi-formal wear — designed to keep you cool while maintaining a polished appearance.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Product Details</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fabric: Summer Linen (Shirt &amp; Trouser)</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Dupatta: Pure Chiffon</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Pieces: 3 (Shirt + Trouser + Dupatta)</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Work: Embroidered Shirt</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Bottom: Plain Trouser</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Delivery &amp; Payment</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Cash on Delivery available nationwide</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fast shipping across Pakistan</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Carefully packed for quality assurance</span></li>
</ul>
<p style="font-size: 13px; color: #555; margin-top: 5px;"><span style="color: rgb(0, 0, 0);">Limited pieces available — restocks are not guaranteed.</span></p>', 'NEW BROWNIE — Authentic GulPash ready-to-wear ensemble with handcrafted embroidery and signature tailoring.', 'GP-9312217497833', '93053437-9ec9-4242-a7b9-a99514548627', '66142d53-e454-45bb-aa46-f0ef5a46af98', '3-Piece Ensembles', 'NEW ARRIVALS', 5999, 8250, 100, '{"Small","Medium","Large","Xl"}', 'Summer Linen (Shirt & Trouser)', true, false, false, true, 5, 0, 'NEW BROWNIE | GulPash Luxury Pret', 'Order NEW BROWNIE online from GulPash. Handcrafted Pakistani pret, premium Summer Linen (Shirt & Trouser), fast delivery across Pakistan.')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, stock = EXCLUDED.stock, is_visible = EXCLUDED.is_visible;
INSERT INTO public.products (id, title, slug, description, short_description, sku, category_id, collection_id, category_name, collection_name, price, compare_at_price, stock, sizes, fabric, is_visible, is_featured, is_best_seller, is_new_arrival, rating, review_count, seo_title, seo_description)
VALUES ('a5686492-80b5-4882-ab9f-8555bdfea101', 'Noor e Naz Luxury 3 Piece', 'noor-e-naz-luxury-3-piece', '<h3><strong><img src="https://cdn.shopify.com/s/files/1/0999/0035/8977/files/612c9a1b-2ff8-45b2-a2bd-c5247a6c5670_cf12ef96-207e-46d9-8c42-fd3fe6070b57.png?v=1786134739" alt=""></strong></h3>
<p>✅<span> </span><strong>Parcel can be opened and checked before payment.</strong></p>
<p><strong>Noor-e-Naz Luxury 3-Piece</strong></p>
<p>A premium stitched outfit featuring an embroidered cotton lawn shirt, plain trouser, and an elegant embroidered organza dupatta—crafted for a graceful and luxurious look.</p>
<p><strong>Fabric Details</strong></p>
<ul>
<li>
<p><strong>Fabric:</strong> Cotton Lawn</p>
</li>
<li>
<p><strong>Shirt:</strong> Embroidered Shirt</p>
</li>
<li>
<p><strong>Trouser:</strong> Plain Trouser</p>
</li>
<li>
<p><strong>Dupatta:</strong> Embroidered Organza Dupatta</p>
</li>
<li>
<p><strong>Type:</strong> Stitched</p>
</li>
</ul>
<h3><img src="https://cdn.shopify.com/s/files/1/0814/7419/1593/files/long_length.png?v=1784682318" alt="" width="295" height="196" style="font-size: 0.875rem;"></h3>', 'Noor e Naz Luxury 3 Piece — Authentic GulPash ready-to-wear ensemble with handcrafted embroidery and signature tailoring.', 'GP-9353060024553', '93053437-9ec9-4242-a7b9-a99514548627', '66142d53-e454-45bb-aa46-f0ef5a46af98', '3-Piece Ensembles', 'TRENDING', 5999, 8250, 100, '{"Small (S)","Medium (M)","Large (L)","Extra Large (XL)"}', 'Cotton', true, true, true, false, 5, 0, 'Noor e Naz Luxury 3 Piece | GulPash Luxury Pret', 'Order Noor e Naz Luxury 3 Piece online from GulPash. Handcrafted Pakistani pret, premium Cotton, fast delivery across Pakistan.')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, stock = EXCLUDED.stock, is_visible = EXCLUDED.is_visible;
INSERT INTO public.products (id, title, slug, description, short_description, sku, category_id, collection_id, category_name, collection_name, price, compare_at_price, stock, sizes, fabric, is_visible, is_featured, is_best_seller, is_new_arrival, rating, review_count, seo_title, seo_description)
VALUES ('b1821be2-41c0-4224-a274-9d52826fe528', 'Noor e Zard 3 Piece', 'noor-e-zard-3-piece', '<h3><strong>Noor-e-Zard 3-Piece</strong></h3>
<p>A beautifully stitched outfit featuring an embroidered shirt, embroidered Farshi shalwar, and an elegant organza dupatta—perfect for a graceful and timeless look.</p>
<p><strong>Fabric Details</strong></p>
<ul>
<li>
<strong><span>Fabric:</span></strong><span> Cotton Lawn</span>
</li>
<li>
<strong><span>Shirt:</span></strong><span> Embroidered Shirt</span>
</li>
<li>
<strong><span>Trouser:</span></strong><span> Embroidered Farshi Shalwar</span>
</li>
<li>
<strong><span>Dupatta:</span></strong><span> Organza Dupatta</span>
</li>
<li>
<strong><span>Type:</span></strong><span> Stitched</span><br>
</li>
</ul>
<h4><img alt="" src="https://cdn.shopify.com/s/files/1/0814/7419/1593/files/37_Length.png?v=1784748312" width="293" height="196" style="font-size: 0.875rem;"></h4>', 'Noor e Zard 3 Piece — Authentic GulPash ready-to-wear ensemble with handcrafted embroidery and signature tailoring.', 'GP-9352270840041', '93053437-9ec9-4242-a7b9-a99514548627', '66142d53-e454-45bb-aa46-f0ef5a46af98', '3-Piece Ensembles', 'TRENDING', 5499, 7698.6, 100, '{"Small (S)","Medium (M)","Large (L)","Extra Large (XL)"}', 'Cotton', true, true, true, false, 5, 0, 'Noor e Zard 3 Piece | GulPash Luxury Pret', 'Order Noor e Zard 3 Piece online from GulPash. Handcrafted Pakistani pret, premium Cotton, fast delivery across Pakistan.')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, stock = EXCLUDED.stock, is_visible = EXCLUDED.is_visible;
INSERT INTO public.products (id, title, slug, description, short_description, sku, category_id, collection_id, category_name, collection_name, price, compare_at_price, stock, sizes, fabric, is_visible, is_featured, is_best_seller, is_new_arrival, rating, review_count, seo_title, seo_description)
VALUES ('2983d9d1-edad-45f6-a4df-dcf2f37cfd92', 'Parisa 3Pcs', 'parisa-3pcs', '<h3 data-end="959" data-start="933" data-section-id="1d57n9x"><span style="color: rgb(66, 5, 250);" role="text"><strong data-end="957" data-start="937">Product Details:</strong></span></h3>
<ul data-end="1241" data-start="960">
<li style="color: rgb(0, 0, 0);" data-end="1004" data-start="960" data-section-id="igh7bl"><span style="color: rgb(0, 0, 0);"><strong data-end="979" data-start="962">Article Name:</strong> Parisa 3Pcs</span></li>
<li style="color: rgb(0, 0, 0);" data-end="1040" data-start="1005" data-section-id="1pw9v0g"><span style="color: rgb(0, 0, 0);"><strong data-end="1024" data-start="1007">Shirt Fabric:</strong> Premium Linen</span></li>
<li style="color: rgb(0, 0, 0);" data-end="1078" data-start="1041" data-section-id="17i9z58"><span style="color: rgb(0, 0, 0);"><strong data-end="1062" data-start="1043">Trouser Fabric:</strong> Linen (Plain)</span></li>
<li style="color: rgb(0, 0, 0);" data-end="1110" data-start="1079" data-section-id="ek2tp"><span style="color: rgb(0, 0, 0);"><strong data-end="1100" data-start="1081">Dupatta Fabric:</strong> Chiffon</span></li>
<li style="color: rgb(0, 0, 0);" data-end="1164" data-start="1111" data-section-id="1dycag0"><span style="color: rgb(0, 0, 0);"><strong data-end="1122" data-start="1113">Work:</strong> Embroidered Shirt &amp; plain Dupatta</span></li>
<li style="color: rgb(0, 0, 0);" data-end="1207" data-start="1165" data-section-id="16qrsoq"><span style="color: rgb(0, 0, 0);"><strong data-end="1180" data-start="1167">Includes:</strong> Shirt, Trouser &amp; Dupatta</span></li>
<li style="color: rgb(0, 0, 0);" data-end="1241" data-start="1208" data-section-id="kd0huu"><span style="color: rgb(0, 0, 0);"><strong data-end="1220" data-start="1210">Style:</strong> Luxury Ethnic Wear</span></li>
</ul>
<h3 data-end="1287" data-start="1243" data-section-id="o1351e"><span style="color: rgb(249, 11, 11);" role="text"><strong data-end="1285" data-start="1247">Why Choose Parisa 3Pcs 3Pcs?</strong></span></h3>
<p data-end="1543" data-start="1288"><span style="color: rgb(0, 0, 0);">✔ <strong data-end="1326" data-start="1290">Premium Linen Fabric for Comfort</strong></span><br data-end="1329" data-start="1326"><span style="color: rgb(0, 0, 0);">✔ <strong data-end="1367" data-start="1331">Elegant Embroidered Shirt Design</strong></span><br data-end="1370" data-start="1367"><span style="color: rgb(0, 0, 0);">✔ <strong data-end="1412" data-start="1372">Graceful Chiffon Embroidered Dupatta</strong></span><br data-end="1415" data-start="1412"><span style="color: rgb(0, 0, 0);">✔ <strong data-end="1451" data-start="1417">Simple Trouser for Classy Look</strong></span><br data-is-only-node="" data-end="1454" data-start="1451"><span style="color: rgb(0, 0, 0);">✔ <strong data-end="1493" data-start="1456">Perfect for Festive &amp; Casual Wear</strong></span><br data-end="1496" data-start="1493"><span style="color: rgb(0, 0, 0);">✔ <strong data-end="1541" data-start="1498">High-Quality Stitching &amp; Premium Finish</strong></span></p>
<p data-is-only-node="" data-is-last-node="" data-end="1654" data-start="1545"><span style="color: rgb(0, 0, 0);">Add a touch of sophistication to your wardrobe with <strong data-end="1623" data-start="1597">Parisa 3Pcs </strong>— where luxury meets elegance.</span></p>', 'Parisa 3Pcs — Authentic GulPash ready-to-wear ensemble with handcrafted embroidery and signature tailoring.', 'GP-9312216580329', '93053437-9ec9-4242-a7b9-a99514548627', '66142d53-e454-45bb-aa46-f0ef5a46af98', '3-Piece Ensembles', 'NEW ARRIVALS', 5999, 8250, 100, '{"small","medium","large","xl"}', 'Linen', true, false, false, true, 5, 0, 'Parisa 3Pcs | GulPash Luxury Pret', 'Order Parisa 3Pcs online from GulPash. Handcrafted Pakistani pret, premium Linen, fast delivery across Pakistan.')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, stock = EXCLUDED.stock, is_visible = EXCLUDED.is_visible;
INSERT INTO public.products (id, title, slug, description, short_description, sku, category_id, collection_id, category_name, collection_name, price, compare_at_price, stock, sizes, fabric, is_visible, is_featured, is_best_seller, is_new_arrival, rating, review_count, seo_title, seo_description)
VALUES ('acf9bbd7-3cb3-4632-ad2b-59e3ee7489dd', 'Pink Hearts 3 Piece', 'pink-hearts-3-piece', '<h3><strong>Pink Hearts 3-Piece</strong></h3>
<p>A charming stitched 3-piece outfit featuring an embroidered shirt, an elegant embroidered Farshi Shalwar with sequin and zari work, and a printed chiffon dupatta—perfect for a graceful and stylish look.</p>
<p><strong>Fabric Details</strong></p>
<ul>
<li>
<p><strong>Shirt:</strong> Embroidered with Sequin &amp; Zari Work</p>
</li>
<li>
<p><strong>Trouser:</strong> Embroidered Farshi Shalwar with Sequin &amp; Zari Work</p>
</li>
<li>
<p><strong>Dupatta:</strong> Printed Chiffon Dupatta</p>
</li>
<li>
<p><strong>Type:</strong> Stitched</p>
</li>
<li>
<strong>Fabric:</strong> Cotton Lawn</li>
</ul>
<p><img alt="" src="https://cdn.shopify.com/s/files/1/0814/7419/1593/files/de779f4a-befd-44a6-8994-413d47719dbe.png?v=1784675504" width="303" height="202"><br></p>', 'Pink Hearts 3 Piece — Authentic GulPash ready-to-wear ensemble with handcrafted embroidery and signature tailoring.', 'GP-9351789215977', '93053437-9ec9-4242-a7b9-a99514548627', '66142d53-e454-45bb-aa46-f0ef5a46af98', '3-Piece Ensembles', 'TRENDING', 4499, 6298.6, 100, '{"Small (S)","Medium (M)","Large (L)","Extra Large (XL)"}', 'Cotton', true, true, true, false, 5, 0, 'Pink Hearts 3 Piece | GulPash Luxury Pret', 'Order Pink Hearts 3 Piece online from GulPash. Handcrafted Pakistani pret, premium Cotton, fast delivery across Pakistan.')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, stock = EXCLUDED.stock, is_visible = EXCLUDED.is_visible;
INSERT INTO public.products (id, title, slug, description, short_description, sku, category_id, collection_id, category_name, collection_name, price, compare_at_price, stock, sizes, fabric, is_visible, is_featured, is_best_seller, is_new_arrival, rating, review_count, seo_title, seo_description)
VALUES ('e8e3b097-8c56-46d9-a63f-fd7eb93b1ae7', 'pistiana 3pcs', 'pistachio-3pcs', '<p><span style="color: rgb(0, 0, 0);"><!-- TRUST BADGES (LARGE + PREMIUM) --></span></p>
<div style="display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin-bottom: 14px; font-size: 14px;"><br></div>
<h2 style="font-weight: 600; margin-bottom: 6px;">pistiana 3pcs <span style="color: rgb(0, 0, 0);">— Elegant Summer 3Pcs</span>
</h2>
<p style="font-size: 13px; color: #888; margin-bottom: 8px;"><strong><span style="color: rgb(0, 0, 0);">Premium Linen Shirt &amp; Trouser • Chiffon Dupatta</span></strong></p>
<p style="font-size: 14px; line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">A refreshing pistiana 3pcs-toned 3-piece ensemble designed for graceful summer styling. Crafted from premium linen and paired with a soft chiffon dupatta, this outfit offers breathable comfort with a refined and modest silhouette.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Product Highlights</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Premium linen shirt with elegant finish</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Long-length design for a graceful fall</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Classic and modest silhouette</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Matching trouser for a complete look</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Soft chiffon dupatta with flowy drape</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Fabric &amp; Feel</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Breathable premium linen ensures all-day comfort in warm weather, complemented by a lightweight chiffon dupatta that adds softness and elegance.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Occasion</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Ideal for summer wear, daytime outings, and semi-formal occasions — designed to keep you cool while maintaining a polished look.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Product Details</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fabric: Premium Linen (Shirt &amp; Trouser)</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Dupatta: Soft Chiffon</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Style: Long-length shirt</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Silhouette: Classic &amp; modest</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Season: Summer Wear</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Sizes: Small, Medium, Large, XL</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Delivery &amp; Payment</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Cash on Delivery available nationwide</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fast shipping across Pakistan</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Carefully packed for quality assurance</span></li>
</ul>
<p style="font-size: 13px; color: #555; margin-top: 5px;"><span style="color: rgb(0, 0, 0);">Limited pieces available — restocks are not guaranteed.</span></p>', 'pistiana 3pcs — Authentic GulPash ready-to-wear ensemble with handcrafted embroidery and signature tailoring.', 'GP-9312217432297', '93053437-9ec9-4242-a7b9-a99514548627', '66142d53-e454-45bb-aa46-f0ef5a46af98', '3-Piece Ensembles', 'NEW ARRIVALS', 5999, 8250, 100, '{"s","m","l","xl"}', 'Premium Linen (Shirt & Trouser)', true, false, false, true, 5, 0, 'pistiana 3pcs | GulPash Luxury Pret', 'Order pistiana 3pcs online from GulPash. Handcrafted Pakistani pret, premium Premium Linen (Shirt & Trouser), fast delivery across Pakistan.')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, stock = EXCLUDED.stock, is_visible = EXCLUDED.is_visible;
INSERT INTO public.products (id, title, slug, description, short_description, sku, category_id, collection_id, category_name, collection_name, price, compare_at_price, stock, sizes, fabric, is_visible, is_featured, is_best_seller, is_new_arrival, rating, review_count, seo_title, seo_description)
VALUES ('a106adfd-c20f-479b-abb3-eb18d5c3aeb4', 'Plum 3Piece', 'plum-3-piece', '<h3><strong>Plum 3-Piece</strong></h3>
<p>A beautifully stitched cotton lawn outfit featuring an embroidered shirt, elegant embroidered Farshi trouser, and a printed chiffon dupatta—perfect for a graceful and stylish look.</p>
<p><strong>Fabric Details</strong></p>
<ul>
<li>
<p><strong>Fabric:</strong> Cotton Lawn</p>
</li>
<li>
<p><strong>Shirt:</strong> Embroidered Shirt</p>
</li>
<li>
<p><strong>Trouser:</strong> Embroidered Farshi Trouser</p>
</li>
<li>
<p><strong>Dupatta:</strong> Printed Chiffon Dupatta</p>
</li>
<li>
<p><strong>Type:</strong> Stitched</p>
</li>
</ul>
<p><img src="https://cdn.shopify.com/s/files/1/0814/7419/1593/files/de779f4a-befd-44a6-8994-413d47719dbe.png?v=1784675504" alt=""></p>', 'Plum 3Piece — Authentic GulPash ready-to-wear ensemble with handcrafted embroidery and signature tailoring.', 'GP-9356929859817', '93053437-9ec9-4242-a7b9-a99514548627', '66142d53-e454-45bb-aa46-f0ef5a46af98', '3-Piece Ensembles', 'ALL ENSEMBLES', 5299, 7419, 100, '{"Small (S)","Medium (M)","Large (L)","Extra Large (XL)"}', 'Cotton', true, false, false, false, 5, 0, 'Plum 3Piece | GulPash Luxury Pret', 'Order Plum 3Piece online from GulPash. Handcrafted Pakistani pret, premium Cotton, fast delivery across Pakistan.')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, stock = EXCLUDED.stock, is_visible = EXCLUDED.is_visible;
INSERT INTO public.products (id, title, slug, description, short_description, sku, category_id, collection_id, category_name, collection_name, price, compare_at_price, stock, sizes, fabric, is_visible, is_featured, is_best_seller, is_new_arrival, rating, review_count, seo_title, seo_description)
VALUES ('d495c75e-871c-41a0-a90b-b42c127fafe2', 'Raniya 3 Piece', 'raniya-3-piece', '<h3><strong>Raniya 3-Piece</strong></h3>
<p>A beautifully stitched 3-piece outfit featuring an embroidered shirt, elegant embroidered Farshi Shalwar, and a graceful printed chiffon dupatta—perfect for a refined and stylish look.</p>
<p><strong>Fabric Details</strong></p>
<ul>
<li>
<p><strong>Shirt:</strong> Embroidered Shirt</p>
</li>
<li>
<p><strong>Trouser:</strong> Embroidered Farshi Shalwar</p>
</li>
<li>
<p><strong>Dupatta:</strong> Printed Chiffon Dupatta</p>
</li>
<li>
<p><strong>Type:</strong> Stitched</p>
</li>
<li>
<strong>Fabric:</strong> Cotton Lawn</li>
</ul>
<p><img alt="" src="https://cdn.shopify.com/s/files/1/0814/7419/1593/files/de779f4a-befd-44a6-8994-413d47719dbe.png?v=1784675504" width="303" height="202"><br></p>', 'Raniya 3 Piece — Authentic GulPash ready-to-wear ensemble with handcrafted embroidery and signature tailoring.', 'GP-9351792525545', '93053437-9ec9-4242-a7b9-a99514548627', '66142d53-e454-45bb-aa46-f0ef5a46af98', '3-Piece Ensembles', 'TRENDING', 5299, 7419, 100, '{"Small (S)","Medium (M)","Large (L)","Extra Large (XL)"}', 'Cotton', true, true, true, false, 5, 0, 'Raniya 3 Piece | GulPash Luxury Pret', 'Order Raniya 3 Piece online from GulPash. Handcrafted Pakistani pret, premium Cotton, fast delivery across Pakistan.')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, stock = EXCLUDED.stock, is_visible = EXCLUDED.is_visible;
INSERT INTO public.products (id, title, slug, description, short_description, sku, category_id, collection_id, category_name, collection_name, price, compare_at_price, stock, sizes, fabric, is_visible, is_featured, is_best_seller, is_new_arrival, rating, review_count, seo_title, seo_description)
VALUES ('f2519c85-f4a5-4cf4-a11c-794648156d7b', 'Rina', 'camel-brown-linen-3-piece', '<p><span style="color: rgb(0, 0, 0);"><!-- TRUST BADGES (LARGE + PREMIUM) --></span></p>
<div style="display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin-bottom: 14px; font-size: 14px;"><br></div>
<h2 style="font-weight: 600; margin-bottom: 6px;"><span style="color: rgb(0, 0, 0);">Rina — Linen 3Pcs</span></h2>
<p style="font-size: 13px; color: #c59d5f; margin-bottom: 8px;"><strong><span style="color: rgb(0, 0, 0);">🤎 <span style="color: rgb(255, 42, 0);">Minimal Classic • Summer Essential</span></span></strong></p>
<h4 style="font-size: 13px; color: #888; margin-bottom: 8px;"><strong><span style="color: rgb(0, 0, 0);">Summer Linen Shirt &amp; Trouser • Dupatta Included</span></strong></h4>
<p style="font-size: 14px; line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">A refined Rina 3-piece ensemble designed for minimal and effortless elegance. Crafted in breathable summer linen, this outfit offers a clean, sophisticated look that works perfectly for everyday wear and modern styling.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><strong><span style="color: rgb(0, 0, 0);">Product Highlights</span></strong></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Premium summer linen fabric</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Elegant camel brown tone for a classy look</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Long graceful shirt with a clean fall</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Matching trouser for a complete outfit</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Dupatta included for a polished finish</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">3-piece ready-to-wear ensemble</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><strong><span style="color: rgb(0, 0, 0);">Fabric &amp; Feel</span></strong></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Made from lightweight and breathable summer linen, offering comfort and structure — ideal for staying cool while maintaining a refined appearance.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><strong><span style="color: rgb(0, 0, 0);">Occasion</span></strong></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Perfect for daily wear, office styling, and casual outings — designed to give you a minimal yet elegant look.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><strong><span style="color: rgb(0, 0, 0);">Product Details</span></strong></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fabric: Summer Linen</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Pieces: 3 (Shirt + Trouser + Dupatta)</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Color: Camel Brown</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Style: Long-length graceful shirt</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Season: Summer Wear</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><strong><span style="color: rgb(0, 0, 0);">Delivery &amp; Payment</span></strong></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Cash on Delivery available nationwide</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fast shipping across Pakistan</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Carefully packed for quality assurance</span></li>
</ul>
<p style="font-size: 13px; color: #555; margin-top: 5px;"><span style="color: rgb(0, 0, 0);">Limited pieces available — restocks are not guaranteed.</span></p>', 'Rina — Authentic GulPash ready-to-wear ensemble with handcrafted embroidery and signature tailoring.', 'GP-9312216809705', '93053437-9ec9-4242-a7b9-a99514548627', '66142d53-e454-45bb-aa46-f0ef5a46af98', '3-Piece Ensembles', 'NEW ARRIVALS', 5999, 8250, 75, '{"small","medium","large","xl"}', 'Summer Linen', true, false, false, true, 5, 0, 'Rina | GulPash Luxury Pret', 'Order Rina online from GulPash. Handcrafted Pakistani pret, premium Summer Linen, fast delivery across Pakistan.')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, stock = EXCLUDED.stock, is_visible = EXCLUDED.is_visible;
INSERT INTO public.products (id, title, slug, description, short_description, sku, category_id, collection_id, category_name, collection_name, price, compare_at_price, stock, sizes, fabric, is_visible, is_featured, is_best_seller, is_new_arrival, rating, review_count, seo_title, seo_description)
VALUES ('61788cda-7961-4418-ab58-e7f555198e38', 'Ruby Grace 3 Piece', 'ruby-grace-3-piece', '<h3><strong><img src="https://cdn.shopify.com/s/files/1/0999/0035/8977/files/612c9a1b-2ff8-45b2-a2bd-c5247a6c5670_cf12ef96-207e-46d9-8c42-fd3fe6070b57.png?v=1786134739" alt=""></strong></h3>
<p>✅<span> </span><strong>Parcel can be opened and checked before payment.</strong></p>
<p><strong>Ruby Grace 3-Piece</strong></p>
<p>A beautifully stitched <em>Lawn Cotton</em> suit featuring an embroidered shirt, trouser, and elegant chiffon dupatta—perfect for a graceful look.</p>
<p><strong>Fabric Details</strong></p>
<ul>
<li>
<strong>Fabric:</strong> Lawn Cotton</li>
<li>
<strong>Shirt:</strong> Embroidered Shirt</li>
<li>
<strong>Trouser:</strong> Embroidered Trouser</li>
<li>
<strong>Dupatta:</strong> Embroidered Chiffon Dupatta</li>
<li>
<strong>Type:</strong> Stitched</li>
</ul>
<p><img src="https://cdn.shopify.com/s/files/1/0814/7419/1593/files/de779f4a-befd-44a6-8994-413d47719dbe.png?v=1784675504" alt="" style="font-size: 1rem;"></p>', 'Ruby Grace 3 Piece — Authentic GulPash ready-to-wear ensemble with handcrafted embroidery and signature tailoring.', 'GP-9351783219433', '93053437-9ec9-4242-a7b9-a99514548627', '66142d53-e454-45bb-aa46-f0ef5a46af98', '3-Piece Ensembles', 'TRENDING', 5499, 7698.6, 100, '{"Small (S)","Medium (M)","Large (L)","Extra Large (XL)"}', 'Cotton', true, true, true, false, 5, 0, 'Ruby Grace 3 Piece | GulPash Luxury Pret', 'Order Ruby Grace 3 Piece online from GulPash. Handcrafted Pakistani pret, premium Cotton, fast delivery across Pakistan.')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, stock = EXCLUDED.stock, is_visible = EXCLUDED.is_visible;
INSERT INTO public.products (id, title, slug, description, short_description, sku, category_id, collection_id, category_name, collection_name, price, compare_at_price, stock, sizes, fabric, is_visible, is_featured, is_best_seller, is_new_arrival, rating, review_count, seo_title, seo_description)
VALUES ('1c889dbe-c013-435f-ac8f-d389b30da10c', 'Rumi 3 Piece', 'rumi-3-piece', '<h3><strong>Rumi 3-Piece</strong></h3>
<p>A timeless stitched 3-piece outfit featuring an embroidered shirt, elegant embroidered Farshi Shalwar, and a beautifully embroidered chiffon dupatta for a sophisticated look.</p>
<p><strong>Fabric Details</strong></p>
<ul>
<li>
<p><strong>Shirt:</strong> Embroidered Shirt</p>
</li>
<li>
<p><strong>Trouser:</strong> Embroidered Farshi Shalwar</p>
</li>
<li>
<p><strong>Dupatta:</strong> Embroidered Chiffon Dupatta</p>
</li>
<li>
<p><strong>Type:</strong> Stitched</p>
</li>
<li>
<strong>Fabric:</strong> Cotton Lawn</li>
</ul>
<p><img alt="" src="https://cdn.shopify.com/s/files/1/0814/7419/1593/files/de779f4a-befd-44a6-8994-413d47719dbe.png?v=1784675504" width="303" height="202"><br></p>', 'Rumi 3 Piece — Authentic GulPash ready-to-wear ensemble with handcrafted embroidery and signature tailoring.', 'GP-9351790526697', '93053437-9ec9-4242-a7b9-a99514548627', '66142d53-e454-45bb-aa46-f0ef5a46af98', '3-Piece Ensembles', 'TRENDING', 4999, 6998.6, 100, '{"Small (S)","Medium (M)","Large (L)","Extra Large (XL)"}', 'Cotton', true, true, true, false, 5, 0, 'Rumi 3 Piece | GulPash Luxury Pret', 'Order Rumi 3 Piece online from GulPash. Handcrafted Pakistani pret, premium Cotton, fast delivery across Pakistan.')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, stock = EXCLUDED.stock, is_visible = EXCLUDED.is_visible;
INSERT INTO public.products (id, title, slug, description, short_description, sku, category_id, collection_id, category_name, collection_name, price, compare_at_price, stock, sizes, fabric, is_visible, is_featured, is_best_seller, is_new_arrival, rating, review_count, seo_title, seo_description)
VALUES ('90efbae5-0c2e-4c30-aa93-81673709675e', 'Sapphire Bloom 3 Piece', 'sapphire-bloom-3-piece', '<h3><strong><img src="https://cdn.shopify.com/s/files/1/0999/0035/8977/files/612c9a1b-2ff8-45b2-a2bd-c5247a6c5670_cf12ef96-207e-46d9-8c42-fd3fe6070b57.png?v=1786134739" alt=""></strong></h3>
<p>✅<span> </span><strong>Parcel can be opened and checked before payment.</strong></p>
<p><strong>Sapphire Bloom 3-Piece</strong></p>
<p>A beautifully stitched <em>Cotton Lawn</em> suit featuring an embroidered shirt, printed farshi Shalwar, and matching printed dupatta—perfect for a stylish everyday look.</p>
<p><strong>Fabric Details</strong></p>
<ul>
<li>
<strong>Fabric:</strong> Cotton Lawn</li>
<li>
<strong>Shirt:</strong> Embroidered Shirt</li>
<li>
<strong>Trouser:</strong> Printed Farshi Shalwar </li>
<li>
<strong>Dupatta:</strong> Printed Chiffon Dupatta</li>
<li>
<strong>Type:</strong> Stitched</li>
</ul>
<p><img src="https://cdn.shopify.com/s/files/1/0814/7419/1593/files/35_Length_20.png?v=1788560795" alt=""></p>', 'Sapphire Bloom 3 Piece — Authentic GulPash ready-to-wear ensemble with handcrafted embroidery and signature tailoring.', 'GP-9351770898665', '93053437-9ec9-4242-a7b9-a99514548627', '66142d53-e454-45bb-aa46-f0ef5a46af98', '3-Piece Ensembles', 'TRENDING', 5499, 7698.6, 100, '{"Small (S)","Medium (M)","Large (L)","Extra Large (XL)"}', 'Cotton', true, true, true, false, 5, 0, 'Sapphire Bloom 3 Piece | GulPash Luxury Pret', 'Order Sapphire Bloom 3 Piece online from GulPash. Handcrafted Pakistani pret, premium Cotton, fast delivery across Pakistan.')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, stock = EXCLUDED.stock, is_visible = EXCLUDED.is_visible;
INSERT INTO public.products (id, title, slug, description, short_description, sku, category_id, collection_id, category_name, collection_name, price, compare_at_price, stock, sizes, fabric, is_visible, is_featured, is_best_seller, is_new_arrival, rating, review_count, seo_title, seo_description)
VALUES ('178198e7-3604-4651-a64c-cec8aa722608', 'Sophie 3Pcs', 'sophie-3pcs', '<p><span style="color: rgb(0, 0, 0);"><!-- TRUST BADGES (LARGE + PREMIUM) --></span></p>
<div style="display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin-bottom: 14px; font-size: 14px;"></div>
<h2 style="font-weight: 600; margin-bottom: 6px;"><span style="color: rgb(0, 0, 0);">Sophie — Elegant Festive 3Pcs</span></h2>
<p style="font-size: 13px; color: #888; margin-bottom: 8px;"><span style="color: rgb(0, 0, 0);"><strong>Premium Linen Shirt &amp; Trouser • Chiffon Dupatta</strong></span></p>
<p style="font-size: 14px; line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">A beautifully designed 3-piece ensemble that blends traditional charm with modern elegance. Sophie is crafted from premium linen and paired with a soft chiffon dupatta, offering a refined look perfect for festive occasions.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Product Highlights</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Premium linen embroidered shirt</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Elegant neckline with detailed border finish</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Matching trouser for a complete look</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Soft &amp; flowy chiffon dupatta</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">3-piece ready-to-wear outfit</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Fabric &amp; Feel</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Breathable linen fabric ensures all-day comfort, while the lightweight chiffon dupatta adds a graceful flow, enhancing the overall elegance.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Occasion</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Perfect for Eid, festive gatherings, and special occasions — designed to give you an effortlessly polished and graceful look.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Delivery &amp; Payment</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Cash on Delivery available nationwide</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fast shipping across Pakistan</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Carefully packed for quality assurance</span></li>
</ul>
<p style="font-size: 13px; color: #555; margin-top: 5px;"><span style="color: rgb(0, 0, 0);">Limited pieces available.</span></p>', 'Sophie 3Pcs — Authentic GulPash ready-to-wear ensemble with handcrafted embroidery and signature tailoring.', 'GP-9312216973545', '93053437-9ec9-4242-a7b9-a99514548627', '66142d53-e454-45bb-aa46-f0ef5a46af98', '3-Piece Ensembles', 'NEW ARRIVALS', 5500, 7950, 100, '{"small","medium","large","extra-large"}', 'Linen', true, false, false, true, 5, 0, 'Sophie 3Pcs | GulPash Luxury Pret', 'Order Sophie 3Pcs online from GulPash. Handcrafted Pakistani pret, premium Linen, fast delivery across Pakistan.')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, stock = EXCLUDED.stock, is_visible = EXCLUDED.is_visible;
INSERT INTO public.products (id, title, slug, description, short_description, sku, category_id, collection_id, category_name, collection_name, price, compare_at_price, stock, sizes, fabric, is_visible, is_featured, is_best_seller, is_new_arrival, rating, review_count, seo_title, seo_description)
VALUES ('04e321ea-b08c-4f98-a96b-837c37aa8271', 'SUMMER SALE | Sweet 3Piece', 'summer-sale-sweet-3piece', '<p><strong>Sweet 3-Piece</strong></p>
<p>Elevate your style with this elegant 3-piece outfit featuring a beautifully embroidered shirt and a luxurious <strong>Farshi Shalwar</strong> adorned with intricate sequin and zari work, paired with a graceful printed chiffon dupatta.</p>
<p><strong>Fabric Details</strong></p>
<ul>
<li>
<p><strong>Shirt:</strong> Embroidered with Sequin &amp; Zari Work</p>
</li>
<li>
<p><strong>Trouser:</strong> Embroidered Farshi Shalwar with Sequin &amp; Zari Work</p>
</li>
<li>
<p><strong>Dupatta:</strong> Printed Chiffon Dupatta</p>
</li>
<li>
<p><strong>Type:</strong> Stitched<br><br><strong>Fabric:</strong> Cotton Lawn</p>
</li>
</ul>
<p><br><img alt="" src="https://cdn.shopify.com/s/files/1/0814/7419/1593/files/de779f4a-befd-44a6-8994-413d47719dbe.png?v=1784675504" width="303" height="202"><br></p>', 'SUMMER SALE | Sweet 3Piece — Authentic GulPash ready-to-wear ensemble with handcrafted embroidery and signature tailoring.', 'GP-9351784792297', '93053437-9ec9-4242-a7b9-a99514548627', '66142d53-e454-45bb-aa46-f0ef5a46af98', '3-Piece Ensembles', 'TRENDING', 4499, 6298.6, 100, '{"Small (S)","Medium (M)","Large (L)","Extra Large (XL)"}', 'Cotton', true, true, true, false, 5, 0, 'SUMMER SALE | Sweet 3Piece | GulPash Luxury Pret', 'Order SUMMER SALE | Sweet 3Piece online from GulPash. Handcrafted Pakistani pret, premium Cotton, fast delivery across Pakistan.')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, stock = EXCLUDED.stock, is_visible = EXCLUDED.is_visible;
INSERT INTO public.products (id, title, slug, description, short_description, sku, category_id, collection_id, category_name, collection_name, price, compare_at_price, stock, sizes, fabric, is_visible, is_featured, is_best_seller, is_new_arrival, rating, review_count, seo_title, seo_description)
VALUES ('ed6de3eb-39f5-477a-aecf-f1f0bec901fe', 'Sunehri 3 Piece', 'sunehri-3-piece', '<h3><strong><img src="https://cdn.shopify.com/s/files/1/0999/0035/8977/files/612c9a1b-2ff8-45b2-a2bd-c5247a6c5670_cf12ef96-207e-46d9-8c42-fd3fe6070b57.png?v=1786134739" alt=""></strong></h3>
<p>✅<span> </span><strong>Parcel can be opened and checked before payment.</strong></p>
<h3>
<strong style="font-size: 0.875rem;">Sunehri 3-Piece</strong><strong></strong>
</h3>
<p>A beautifully stitched cotton lawn outfit featuring an embroidered shirt, elegant embroidered Farshi trouser, and a printed chiffon dupatta—perfect for a graceful and stylish look.</p>
<p><strong>Fabric Details</strong></p>
<ul>
<li>
<p><strong>Fabric:</strong> Cotton Lawn</p>
</li>
<li>
<p><strong>Shirt:</strong> Embroidered Shirt</p>
</li>
<li>
<p><strong>Trouser:</strong> Embroidered Farshi Trouser</p>
</li>
<li>
<p><strong>Dupatta:</strong> Printed Chiffon Dupatta</p>
</li>
<li>
<p><strong>Type:</strong> Stitched</p>
</li>
</ul>
<p><img src="https://cdn.shopify.com/s/files/1/0814/7419/1593/files/de779f4a-befd-44a6-8994-413d47719dbe.png?v=1784675504" alt=""></p>', 'Sunehri 3 Piece — Authentic GulPash ready-to-wear ensemble with handcrafted embroidery and signature tailoring.', 'GP-9353008480489', '93053437-9ec9-4242-a7b9-a99514548627', '66142d53-e454-45bb-aa46-f0ef5a46af98', '3-Piece Ensembles', 'TRENDING', 5499, 7698.6, 100, '{"Small (S)","Medium (M)","Large (L)","Extra Large (XL)"}', 'Cotton', true, true, true, false, 5, 0, 'Sunehri 3 Piece | GulPash Luxury Pret', 'Order Sunehri 3 Piece online from GulPash. Handcrafted Pakistani pret, premium Cotton, fast delivery across Pakistan.')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, stock = EXCLUDED.stock, is_visible = EXCLUDED.is_visible;
INSERT INTO public.products (id, title, slug, description, short_description, sku, category_id, collection_id, category_name, collection_name, price, compare_at_price, stock, sizes, fabric, is_visible, is_featured, is_best_seller, is_new_arrival, rating, review_count, seo_title, seo_description)
VALUES ('309b83cc-3af3-491e-a218-b07e73681f26', 'ZAARIF - COTTON 2 PC EMB', 'zaarif-cotton-3-pc-emb', '<p><span style="color: rgb(0, 0, 0);"><!-- TRUST BADGES (LARGE + PREMIUM) --></span></p>
<div style="display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin-bottom: 14px; font-size: 14px;"></div>
<p><span style="color: rgb(0, 0, 0);"><!-- PRODUCT DESCRIPTION --></span></p>
<h2 style="font-weight: 600; margin-bottom: 6px;"><span style="color: rgb(0, 0, 0);"><strong>Zaarif — Cotton Embroidered 2 Pcs</strong></span></h2>
<p style="font-size: 13px; color: #c59d5f; margin-bottom: 8px;"><span style="color: rgb(246, 4, 4);"><strong>🌿 Everyday Luxury • Bestseller</strong></span></p>
<p style="font-size: 13px; color: #888; margin-bottom: 8px;"><span style="color: rgb(0, 0, 0);"><strong>Premium Cotton Embroidered Shirt &amp; Trouser </strong></span></p>
<p style="font-size: 14px; line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">A refined 2-piece cotton ensemble designed for everyday elegance with a premium touch. Zaarif features intricate embroidery on breathable cotton, paired with a long graceful shirt and matching trousers — delivering comfort with a polished look.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><strong><span style="color: rgb(0, 0, 0);">Product Highlights</span></strong></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Premium cotton embroidered shirt</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Elegant embroidery for a refined finish</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);"><strong>Farshi trouser</strong> for balanced styling</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Matching dupatta for a complete outfit</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);"><strong>2-piece ready-to-wear</strong> ensemble</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><strong><span style="color: rgb(0, 0, 0);">Fabric &amp; Feel</span></strong></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Crafted from breathable premium cotton, offering softness and comfort for all-day wear while maintaining a clean and structured appearance.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><strong><span style="color: rgb(0, 0, 0);">Occasion</span></strong></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Perfect for daily wear, office styling, and semi-formal gatherings — designed to give you an effortlessly elegant look.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><strong><span style="color: rgb(0, 0, 0);">Product Details</span></strong></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fabric: Premium Cotton</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Work: Embroidered</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Pieces: 2 (Shirt + Trouser)</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Style: Long-length graceful shirt</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Season: Summer &amp; Mid-Season Wear</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><strong><span style="color: rgb(0, 0, 0);">Delivery &amp; Payment</span></strong></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Cash on Delivery available nationwide</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fast shipping across Pakistan</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Carefully packed for quality assurance</span></li>
</ul>
<p style="font-size: 13px; color: #555; margin-top: 5px;"><span style="color: rgb(0, 0, 0);">Limited pieces available — restocks are not guaranteed.</span></p>', 'ZAARIF - COTTON 2 PC EMB — Authentic GulPash ready-to-wear ensemble with handcrafted embroidery and signature tailoring.', 'GP-9312216744169', '7138fe69-1731-41d8-ab8f-cad303d82089', '66142d53-e454-45bb-aa46-f0ef5a46af98', '2-Piece Ensembles', 'NEW ARRIVALS', 3999, NULL, 100, '{"cotton / small","cotton / medium","cotton / large","cotton / extra-large"}', 'Premium Cotton', true, false, false, true, 5, 0, 'ZAARIF - COTTON 2 PC EMB | GulPash Luxury Pret', 'Order ZAARIF - COTTON 2 PC EMB online from GulPash. Handcrafted Pakistani pret, premium Premium Cotton, fast delivery across Pakistan.')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, stock = EXCLUDED.stock, is_visible = EXCLUDED.is_visible;
INSERT INTO public.products (id, title, slug, description, short_description, sku, category_id, collection_id, category_name, collection_name, price, compare_at_price, stock, sizes, fabric, is_visible, is_featured, is_best_seller, is_new_arrival, rating, review_count, seo_title, seo_description)
VALUES ('0f028a27-c9ef-4d7a-a46f-7a87b2388d88', 'Zar-E-Sabz 3Piece', 'zar-e-sabz-3piece', '<h3><strong><img src="https://cdn.shopify.com/s/files/1/0999/0035/8977/files/612c9a1b-2ff8-45b2-a2bd-c5247a6c5670_cf12ef96-207e-46d9-8c42-fd3fe6070b57.png?v=1786134739" alt=""></strong></h3>
<p>✅<span> </span><strong>Parcel can be opened and checked before payment.</strong></p>
<p class="PDq2pG_selectionAnchorContainer"><strong>Zar-E-Sabz 3Piece</strong><span class="PDq2pG_selectionAnchor"></span></p>
<p><strong>Fabric Details</strong></p>
<div class="text-base my-auto mx-auto [--thread-content-margin:var(--thread-content-margin-xs,calc(var(--spacing)*4))] @w-sm/main:[--thread-content-margin:var(--thread-content-margin-sm,calc(var(--spacing)*6))] @w-lg/main:[--thread-content-margin:var(--thread-content-margin-lg,calc(var(--spacing)*16))] px-(--thread-content-margin)">
<div class="[--thread-content-max-width:40rem] @w-lg/main:[--thread-content-max-width:48rem] mx-auto max-w-(--thread-content-max-width) flex-1 group/turn-messages focus-visible:outline-hidden relative flex w-full min-w-0 flex-col agent-turn">
<div class="flex max-w-full flex-col gap-4 grow">
<div dir="auto" class="min-h-8 text-message relative flex w-full flex-col items-end gap-2 text-start break-words whitespace-normal outline-none keyboard-focused:focus-ring [.text-message+&amp;]:mt-1">
<div class="flex w-full flex-col gap-1 empty:hidden">
<div class="fbskMG_root yWcLfW_streamingContainer markdown prose dark:prose-invert wrap-break-word w-full light markdown-new-styling">
<ul>
<li>
<strong>Fabric:</strong> Mid-Season Fabric<span class="PDq2pG_selectionAnchor"></span>
</li>
<li>
<strong>Shirt:</strong> Embroidered Shirt</li>
<li>
<strong>Trouser:</strong> Plain Trouser</li>
<li>
<strong>Dupatta:</strong> Dupatta</li>
<li>
<strong>Style:</strong> Stitched – Ready to Wear</li>
<li>
<strong>Season:</strong> All Season Wear</li>
</ul>
<p><img src="https://cdn.shopify.com/s/files/1/0814/7419/1593/files/44_to_45.png?v=1785787631" alt=""></p>
</div>
</div>
</div>
</div>
</div>
</div>', 'Zar-E-Sabz 3Piece — Authentic GulPash ready-to-wear ensemble with handcrafted embroidery and signature tailoring.', 'GP-9405081977065', '93053437-9ec9-4242-a7b9-a99514548627', '66142d53-e454-45bb-aa46-f0ef5a46af98', '3-Piece Ensembles', 'TRENDING', 6499, 8250, 100, '{"Small (S)","Medium (M)","Large (L)","Extra Large (XL)"}', 'Premium Lawn', true, true, true, false, 5, 0, 'Zar-E-Sabz 3Piece | GulPash Luxury Pret', 'Order Zar-E-Sabz 3Piece online from GulPash. Handcrafted Pakistani pret, premium Premium Lawn, fast delivery across Pakistan.')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, stock = EXCLUDED.stock, is_visible = EXCLUDED.is_visible;
INSERT INTO public.products (id, title, slug, description, short_description, sku, category_id, collection_id, category_name, collection_name, price, compare_at_price, stock, sizes, fabric, is_visible, is_featured, is_best_seller, is_new_arrival, rating, review_count, seo_title, seo_description)
VALUES ('79430272-a7fb-481b-a2c4-943682ddd582', 'Zeenat EMB – 3PCs', 'zeenat-emb-3pcs', '<p><span style="color: rgb(0, 0, 0);"><!-- TRUST BADGES (LARGE + PREMIUM) --></span></p>
<div style="display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin-bottom: 14px; font-size: 14px;"></div>
<h2 style="font-weight: 600; margin-bottom: 6px;"><span style="color: rgb(0, 0, 0);">Zeenat EMB — Navy Blue Linen 3Pcs</span></h2>
<p style="font-size: 13px; color: #c59d5f; margin-bottom: 8px;"><span style="color: rgb(255, 42, 0);"><strong>🔥 Summer Collection • Bestseller</strong></span></p>
<p style="font-size: 13px; color: #888; margin-bottom: 8px;"><span style="color: rgb(251, 4, 4); background-color: rgb(255, 255, 255);"><strong>Linen Embroidered Shirt &amp; Trouser • Complete 3PC Set</strong></span></p>
<p style="font-size: 14px; line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">A beautifully crafted navy blue 3-piece ensemble designed for elegant summer styling. Zeenat EMB features intricate embroidery on premium linen, offering a refined and graceful look that stands out effortlessly.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Product Highlights</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Premium linen embroidered shirt</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Elegant navy blue color for a rich look</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Long-length design for a graceful fall</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Classic and modest silhouette</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Matching trouser for a complete outfit</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">3-piece ready-to-wear ensemble with dupatta</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Fabric &amp; Feel</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Crafted from breathable linen fabric, perfect for summer wear — offering comfort with a structured and polished finish.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Occasion</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Ideal for summer outings, festive gatherings, and semi-formal occasions — designed to give you a stylish and elegant appearance.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Product Details</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fabric: Linen</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Pieces: 3 (Shirt + Trouser + Dupatta)</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Work: Embroidered</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Color: Navy Blue</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Style: Long-length dress</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Season: Summer Wear</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Delivery &amp; Payment</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Cash on Delivery available nationwide</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fast shipping across Pakistan</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Carefully packed for quality assurance</span></li>
</ul>
<p style="font-size: 13px; color: #555; margin-top: 5px;"><span style="color: rgb(0, 0, 0);">Limited pieces available — restocks are not guaranteed.</span></p>', 'Zeenat EMB – 3PCs — Authentic GulPash ready-to-wear ensemble with handcrafted embroidery and signature tailoring.', 'GP-9312217694441', '93053437-9ec9-4242-a7b9-a99514548627', '66142d53-e454-45bb-aa46-f0ef5a46af98', '3-Piece Ensembles', 'NEW ARRIVALS', 5999, 8250, 100, '{"small","medium","large","extra-large"}', 'Linen', true, false, false, true, 5, 0, 'Zeenat EMB – 3PCs | GulPash Luxury Pret', 'Order Zeenat EMB – 3PCs online from GulPash. Handcrafted Pakistani pret, premium Linen, fast delivery across Pakistan.')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, stock = EXCLUDED.stock, is_visible = EXCLUDED.is_visible;
INSERT INTO public.products (id, title, slug, description, short_description, sku, category_id, collection_id, category_name, collection_name, price, compare_at_price, stock, sizes, fabric, is_visible, is_featured, is_best_seller, is_new_arrival, rating, review_count, seo_title, seo_description)
VALUES ('62cca4a5-a562-45be-a5d0-99130e0a2519', 'Zohra 3 Piece', 'zohra-3-piece', '<h3><strong>Zohra 3-Piece</strong></h3>
<p>A beautifully stitched 3-piece outfit featuring an embroidered shirt, elegant Farshi trouser, and a graceful chiffon dupatta—perfect for a timeless and sophisticated look.</p>
<p><strong>Fabric Details</strong></p>
<ul>
<li>
<p><strong>Fabric:</strong> Cotton Lawn</p>
</li>
<li>
<p><strong>Shirt:</strong> Embroidered Shirt</p>
</li>
<li>
<p><strong>Trouser:</strong> Embroidered Farshi Trouser</p>
</li>
<li>
<p><strong>Dupatta:</strong> Printed Chiffon Dupatta</p>
</li>
<li>
<p><strong>Type:</strong> Stitched</p>
</li>
</ul>
<h4><strong><img style="font-size: 0.875rem;" alt="" src="https://cdn.shopify.com/s/files/1/0814/7419/1593/files/de779f4a-befd-44a6-8994-413d47719dbe.png?v=1784675504" width="264" height="176"></strong></h4>', 'Zohra 3 Piece — Authentic GulPash ready-to-wear ensemble with handcrafted embroidery and signature tailoring.', 'GP-9353039610089', '93053437-9ec9-4242-a7b9-a99514548627', '66142d53-e454-45bb-aa46-f0ef5a46af98', '3-Piece Ensembles', 'TRENDING', 5299, 7419, 100, '{"Small (S)","Medium (M)","Large (L)","Extra Large (XL)"}', 'Cotton', true, true, true, false, 5, 0, 'Zohra 3 Piece | GulPash Luxury Pret', 'Order Zohra 3 Piece online from GulPash. Handcrafted Pakistani pret, premium Cotton, fast delivery across Pakistan.')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, stock = EXCLUDED.stock, is_visible = EXCLUDED.is_visible;

-- 4. Insert Product Variants
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('7fc8b297-f8f9-4150-a6e4-80348bf0685c', '4f1c277b-917f-47e6-a855-d5b2c493757d', 'Extra Large (XL)', 'Extra Large (XL)', 'GP-ANB-9362127978729-51616475447529', 5999, 8250, true, 25, 1)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('bd6805b0-5674-4f5f-a28d-783559f2f560', '4f1c277b-917f-47e6-a855-d5b2c493757d', 'Small (S)', 'Small (S)', 'GP-ANB-9362127978729-51616475349225', 5999, 8250, false, 0, 2)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('7bf96afd-b6d6-4ab7-ad1d-1e56200ab440', '4f1c277b-917f-47e6-a855-d5b2c493757d', 'Medium (M)', 'Medium (M)', 'GP-ANB-9362127978729-51616475381993', 5999, 8250, false, 0, 3)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('161648c5-1348-412d-ae9e-b72626bc04a8', '4f1c277b-917f-47e6-a855-d5b2c493757d', 'Large (L)', 'Large (L)', 'GP-ANB-9362127978729-51616475414761', 5999, 8250, false, 0, 4)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('303c304e-bc1d-4103-a62e-d413ae372749', '7d78784f-55b3-4997-ad84-b8f5a05f622c', 's', 's', 'TAW-AB3-S-0', 5999, 8250, true, 25, 1)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('90c899ff-ce97-4233-a745-a0bb90eb67c3', '7d78784f-55b3-4997-ad84-b8f5a05f622c', 'm', 'm', 'TAW-AB3-M-0', 5999, 8250, true, 25, 2)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('34ac5f9b-65d9-4395-a8ca-4384c5f6a3d4', '7d78784f-55b3-4997-ad84-b8f5a05f622c', 'l', 'l', 'TAW-AB3-L-0', 5999, 8250, true, 25, 3)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('b15abfed-cb2e-431a-a51f-81782698112f', '7d78784f-55b3-4997-ad84-b8f5a05f622c', 'xl', 'xl', 'TAW-AB3-XL-0', 5999, 8250, true, 25, 4)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('bca8c2af-bcb5-4f72-ae76-2cb5b01ec4ca', '7aa3b55d-255c-4d23-a44b-4edea63e374a', 'small', 'small', 'TAW-NZ3-S-0', 5999, 8250, true, 25, 1)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('9b987ad9-5522-40ec-a7a1-e398d0dbeb78', '7aa3b55d-255c-4d23-a44b-4edea63e374a', 'medium', 'medium', 'TAW-NZ3-M-0', 5999, 8250, true, 25, 2)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('cb98331b-d582-4ce9-a17d-02cacfac118e', '7aa3b55d-255c-4d23-a44b-4edea63e374a', 'large', 'large', 'TAW-NZ3-L-0', 5999, 8250, true, 25, 3)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('2439338d-b775-483f-a487-3106f2cb899a', '7aa3b55d-255c-4d23-a44b-4edea63e374a', 'xl', 'xl', 'TAW-NZ3-XL-0', 5999, 8250, true, 25, 4)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('68629d70-0aed-424e-a8cd-3929210dc92c', '1137ec03-4d5c-4fc3-a86a-6171252552f0', 'Small (S)', 'Small (S)', 'GP-ANB-9362138333417-51616648593641', 5999, 8250, true, 25, 1)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('a81ec9b7-f28e-4ef0-aa99-91bdc37c9f2f', '1137ec03-4d5c-4fc3-a86a-6171252552f0', 'Medium (M)', 'Medium (M)', 'GP-ANB-9362138333417-51616648626409', 5999, 8250, true, 25, 2)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('915d120a-7789-4b40-a3d5-e7faff2233e6', '1137ec03-4d5c-4fc3-a86a-6171252552f0', 'Large (L)', 'Large (L)', 'GP-ANB-9362138333417-51616648659177', 5999, 8250, true, 25, 3)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('286c3009-90a7-4b63-adc1-2b7a3603b03d', '1137ec03-4d5c-4fc3-a86a-6171252552f0', 'Extra Large (XL)', 'Extra Large (XL)', 'GP-ANB-9362138333417-51616648691945', 5999, 8250, true, 25, 4)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('fa74f25b-3c96-42ed-a44e-7c8548b7dc46', 'a020657f-4e8f-47c5-a90d-e129669dc324', 'small / black', 'small', 'TAW-A3-S-6', 5999, 8250, false, 0, 1)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('5b120c11-5be7-4e06-ab22-fa1e86f41033', 'a020657f-4e8f-47c5-a90d-e129669dc324', 'medium / black', 'medium', 'TAW-A3-M-6', 5999, 8250, true, 25, 2)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('441f1f1b-acc8-4933-af79-2d9a524f51f2', 'a020657f-4e8f-47c5-a90d-e129669dc324', 'large / black', 'large', 'TAW-A3-L-6', 5999, 8250, true, 25, 3)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('14746925-6745-477f-a916-a6f5c5aa827b', 'a020657f-4e8f-47c5-a90d-e129669dc324', 'xl / black', 'xl', 'TAW-A3-XL-6', 5999, 8250, true, 25, 4)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('b7b55ff2-b09d-464a-a08d-ee9237f3f947', '71f2b516-7326-4ed0-a553-5877dfdc668b', 'Small (S)', 'Small (S)', 'GP-ANB-9353919135977-51578625884393', 5499, 7698.6, true, 25, 1)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('726f2b38-fb27-4bce-af9e-6c5121381099', '71f2b516-7326-4ed0-a553-5877dfdc668b', 'Medium (M)', 'Medium (M)', 'GP-ANB-9353919135977-51578625917161', 5499, 7698.6, true, 25, 2)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('fde2f066-0467-40bb-ab04-9ef5cbc8d8f2', '71f2b516-7326-4ed0-a553-5877dfdc668b', 'Large (L)', 'Large (L)', 'GP-ANB-9353919135977-51578625949929', 5499, 7698.6, true, 25, 3)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('480af6ae-1758-44ed-aec1-b6232c887663', '71f2b516-7326-4ed0-a553-5877dfdc668b', 'Extra Large (XL)', 'Extra Large (XL)', 'GP-ANB-9353919135977-51578625982697', 5499, 7698.6, true, 25, 4)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('a987cf66-03ea-4b82-af56-ee540ce665e4', 'd6c3d9b0-c2d5-4b2b-aa90-8ee2b1f4bed2', 'small', 'small', 'TAW-TC-S-1', 5999, 8250, true, 25, 1)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('4c97ac2e-22a4-43a9-ab34-05ef15696041', 'd6c3d9b0-c2d5-4b2b-aa90-8ee2b1f4bed2', 'medium', 'medium', 'TAW-TC-M-1', 5999, 8250, true, 25, 2)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('38b285d1-aed9-4e98-a911-044640c93b44', 'd6c3d9b0-c2d5-4b2b-aa90-8ee2b1f4bed2', 'large', 'large', 'TAW-TC-L-1', 5999, 8250, true, 25, 3)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('a84bc8b5-4f33-480e-aa9f-dbd0a718ae9b', 'd6c3d9b0-c2d5-4b2b-aa90-8ee2b1f4bed2', 'extra-large', 'extra-large', 'TAW-TC-XL-1', 5999, 8250, true, 25, 4)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('9f0565a8-4fdc-4a4a-a358-2f6d5354ee4a', '22b380a2-b6e0-4a74-a457-c6828458bc57', '2-Piece / Small (S)', '2-Piece', 'GP-ANB-9312216318185-51269528682729', 3999, 7500, true, 25, 1)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('80388dd1-30a7-49d6-adc0-6e50e2c5915d', '22b380a2-b6e0-4a74-a457-c6828458bc57', '2-Piece / Medium (M)', '2-Piece', 'GP-ANB-9312216318185-51269528715497', 3999, 7500, true, 25, 2)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('7c10bb6b-b47c-4ba8-a12f-7760a3fcf21d', '22b380a2-b6e0-4a74-a457-c6828458bc57', '2-Piece / Large (L)', '2-Piece', 'GP-ANB-9312216318185-51269528748265', 3999, 7500, true, 25, 3)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('2753718b-3935-4b1a-adf2-ecbdcfe8934e', '22b380a2-b6e0-4a74-a457-c6828458bc57', '2-Piece / Extra Large (XL)', '2-Piece', 'GP-ANB-9312216318185-51269528781033', 3999, 7500, true, 25, 4)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('88a90daf-1fae-49a3-a536-07b6de850b0c', '22b380a2-b6e0-4a74-a457-c6828458bc57', '3-Piece / Small (S)', '3-Piece', 'GP-ANB-9312216318185-51624809562345', 4499, 7500, true, 25, 5)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('ed4ff198-3368-4eb4-a7a7-c5e4c9b208a1', '22b380a2-b6e0-4a74-a457-c6828458bc57', '3-Piece / Medium (M)', '3-Piece', 'GP-ANB-9312216318185-51624809595113', 4499, 7500, true, 25, 6)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('ea4f393d-3b3c-47b2-ae28-1a9e29f62045', '22b380a2-b6e0-4a74-a457-c6828458bc57', '3-Piece / Large (L)', '3-Piece', 'GP-ANB-9312216318185-51624809627881', 4499, 7500, true, 25, 7)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('f82871e8-c961-4113-a0cb-67318a68b10b', '22b380a2-b6e0-4a74-a457-c6828458bc57', '3-Piece / Extra Large (XL)', '3-Piece', 'GP-ANB-9312216318185-51624809660649', 4499, 7500, true, 25, 8)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('c9208c74-684d-4cdd-aa5c-d665093363f6', 'bf19a309-ad4e-4746-a043-4bbe1261d43d', 'S – Chest 19" / 47–48" / Standard Size', 'S – Chest 19"', 'TAW-EE3-S', 5999, 8250, true, 25, 1)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('1315938a-ae5b-4465-a1a5-8e94bb83948c', 'bf19a309-ad4e-4746-a043-4bbe1261d43d', 'M – Chest 21" / 47–48" / Standard Size', 'M – Chest 21"', 'TAW-EE3-M', 5999, 8250, true, 25, 2)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('c368f06b-1d06-48e4-ac30-ad8e9af574a9', 'bf19a309-ad4e-4746-a043-4bbe1261d43d', 'L – Chest 23" / 47–48" / Standard Size', 'L – Chest 23"', 'TAW-EE3-L', 5999, 8250, true, 25, 3)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('c48f2de6-1131-4034-a9a2-bb87392fd341', 'bf19a309-ad4e-4746-a043-4bbe1261d43d', 'XL – Chest 24" / 47–48" / Standard Size', 'XL – Chest 24"', 'TAW-EE3-XL', 5999, 8250, true, 25, 4)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('24468d5d-6dd6-4a3e-a961-36245c005f55', 'f58f8a61-cb17-41f2-ae42-b53a905d0f75', 'S – Chest 19" / 47–48"', 'S – Chest 19"', 'TAW-GE3-S', 5999, 8250, true, 25, 1)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('2d107c5f-7207-4279-a78b-c51ea308765a', 'f58f8a61-cb17-41f2-ae42-b53a905d0f75', 'M – Chest 21" / 47–48"', 'M – Chest 21"', 'TAW-GE3-M', 5999, 8250, true, 25, 2)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('32bf69dd-43da-4e89-a3e7-ccfa27fc491c', '35a01cae-b1ea-4c90-a30c-e23b4ecee033', 'linen / small', 'linen', 'TAW-KE3-S', 5999, 8250, true, 25, 1)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('de87b32d-8cbb-4c9f-a851-cc38a2729641', '35a01cae-b1ea-4c90-a30c-e23b4ecee033', 'linen / medium', 'linen', 'TAW-KE3-M', 5999, 8250, true, 25, 2)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('b3422857-d7c8-4800-ab81-3da80b73a5f6', '35a01cae-b1ea-4c90-a30c-e23b4ecee033', 'linen / large', 'linen', 'TAW-KE3-L', 5999, 8250, true, 25, 3)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('b909925c-cf8e-4f57-ab77-423962011d13', '35a01cae-b1ea-4c90-a30c-e23b4ecee033', 'linen / extra-large', 'linen', 'TAW-KE3-XL', 5999, 8250, true, 25, 4)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('d84abd61-8b37-4d2f-a88f-2f23c9dbe105', '84c1092f-efa7-4e69-afe2-12ca7666fe26', 'Small (S)', 'Small (S)', 'GP-ANB-9352267956457-51567337079017', 5499, 7698.6, true, 25, 1)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('5df2c1bf-d029-4172-a854-5b98a79ca87c', '84c1092f-efa7-4e69-afe2-12ca7666fe26', 'Medium (M)', 'Medium (M)', 'GP-ANB-9352267956457-51567337111785', 5499, 7698.6, true, 25, 2)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('6151a7fd-56a0-4bff-ad69-0197112984b1', '84c1092f-efa7-4e69-afe2-12ca7666fe26', 'Large (L)', 'Large (L)', 'GP-ANB-9352267956457-51567337144553', 5499, 7698.6, true, 25, 3)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('355f7516-39c9-41c3-ad6f-b7fd618b8aca', '84c1092f-efa7-4e69-afe2-12ca7666fe26', 'Extra Large (XL)', 'Extra Large (XL)', 'GP-ANB-9352267956457-51567337177321', 5499, 7698.6, true, 25, 4)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('a60cca81-e2fe-4e39-aa5f-c93a2b84c768', 'f8aa8eca-5946-4225-a9a8-bac867ad0f3b', 'Cotton / Small (S)', 'Cotton', 'GP-ANB-9312216875241-51269530910953', 5999, 8250, true, 25, 1)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('794708a1-47b2-421e-a20a-0a3d72744bea', 'f8aa8eca-5946-4225-a9a8-bac867ad0f3b', 'Cotton / Medium (M)', 'Cotton', 'GP-ANB-9312216875241-51269530976489', 5999, 8250, true, 25, 2)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('e56404d2-8f31-4fd6-a31d-13809e38f419', 'f8aa8eca-5946-4225-a9a8-bac867ad0f3b', 'Cotton / Large (L)', 'Cotton', 'GP-ANB-9312216875241-51269531042025', 5999, 8250, true, 25, 3)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('a994ebb0-dcfa-47e7-ac98-bccacb158813', 'f8aa8eca-5946-4225-a9a8-bac867ad0f3b', 'Cotton / Extra Large (XL)', 'Cotton', 'GP-ANB-9312216875241-51269531107561', 5999, 8250, true, 25, 4)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('801aff4f-1583-4bee-a1ae-2eb0842385de', 'f8aa8eca-5946-4225-a9a8-bac867ad0f3b', 'Linen / Small (S)', 'Linen', 'GP-ANB-9312216875241-51653663031529', 5999, 8250, true, 25, 5)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('3073dc4e-ea35-49ca-ad1e-5ee68374adc8', 'f8aa8eca-5946-4225-a9a8-bac867ad0f3b', 'Linen / Medium (M)', 'Linen', 'GP-ANB-9312216875241-51653663064297', 5999, 8250, true, 25, 6)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('1450b7fb-c3d8-45a4-ad80-ce17175bf146', 'f8aa8eca-5946-4225-a9a8-bac867ad0f3b', 'Linen / Large (L)', 'Linen', 'GP-ANB-9312216875241-51653663097065', 5999, 8250, true, 25, 7)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('da056221-b469-409a-aa2c-36b84ce2404c', 'f8aa8eca-5946-4225-a9a8-bac867ad0f3b', 'Linen / Extra Large (XL)', 'Linen', 'GP-ANB-9312216875241-51653663129833', 5999, 8250, true, 25, 8)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('69825012-4290-4012-ab7b-ef0c278c560a', 'c3d827b9-1a31-4228-a190-7a3da5a698af', 'small', 'small', 'GP-ANB-9312217399529-51269533040873', 5999, 8250, true, 25, 1)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('22be3a28-9ea6-4ee2-ac36-c4272023217d', 'c3d827b9-1a31-4228-a190-7a3da5a698af', 'medium', 'medium', 'GP-ANB-9312217399529-51269533073641', 5999, 8250, true, 25, 2)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('ee6dcff3-f397-414a-a16d-939564a88639', 'c3d827b9-1a31-4228-a190-7a3da5a698af', 'large', 'large', 'GP-ANB-9312217399529-51269533106409', 5999, 8250, true, 25, 3)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('81a2017b-a539-4934-a016-06ca2af334e9', 'c3d827b9-1a31-4228-a190-7a3da5a698af', 'xl', 'xl', 'GP-ANB-9312217399529-51269533139177', 5999, 8250, true, 25, 4)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('9eddc79b-adcf-4839-ad93-e0bd8f807f3d', 'bce0772a-1255-47c8-afcd-5f578734316e', 'Small (S)', 'Small (S)', 'GP-ANB-9352245313769-51567252701417', 5299, 7419, true, 25, 1)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('1626de7a-e557-461d-a59a-9b21e5d5cb46', 'bce0772a-1255-47c8-afcd-5f578734316e', 'Medium (M)', 'Medium (M)', 'GP-ANB-9352245313769-51567252734185', 5299, 7419, true, 25, 2)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('ab81df32-391d-407b-aa46-4d561609c447', 'bce0772a-1255-47c8-afcd-5f578734316e', 'Large (L)', 'Large (L)', 'GP-ANB-9352245313769-51567252766953', 5299, 7419, true, 25, 3)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('3df150fe-2d58-4d0c-ae14-57cc3a7e48b0', 'bce0772a-1255-47c8-afcd-5f578734316e', 'Extra Large (XL)', 'Extra Large (XL)', 'GP-ANB-9352245313769-51567252799721', 5299, 7419, true, 25, 4)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('2fc8ce03-602b-43ba-ac58-38e2173990cb', '9719080d-6d7f-4ad7-ac0d-75142e67ab13', 'small / beige', 'small', 'TAW-NB3-S-0', 5999, 8250, true, 25, 1)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('8742b04f-22fa-419b-a8bf-51fa519be268', '9719080d-6d7f-4ad7-ac0d-75142e67ab13', 'medium / beige', 'medium', 'TAW-NB3-M-0', 5999, 8250, true, 25, 2)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('e2218487-749e-4d4c-a986-a013f54f0588', '9719080d-6d7f-4ad7-ac0d-75142e67ab13', 'large / beige', 'large', 'TAW-NB3-L-0', 5999, 8250, true, 25, 3)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('bdbd296c-21c5-4bfc-ac8f-30c6dacb1cf4', '9719080d-6d7f-4ad7-ac0d-75142e67ab13', 'extra-large / beige', 'extra-large', 'TAW-NB3-XL-0', 5999, 8250, true, 25, 4)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('3ad15530-841a-4ec3-a826-2dcded913da9', '47b17f35-a153-4561-a877-86519f825767', 'small / black', 'small', 'TAW-MCB-S-1', 5999, 8250, true, 25, 1)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('ee2d2820-9a3a-4e19-a1ac-055e63f8313b', '47b17f35-a153-4561-a877-86519f825767', 'medium / black', 'medium', 'TAW-MCB-M-1', 5999, 8250, true, 25, 2)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('0b4a1c50-cc1b-429e-acff-7bebe8d7483d', '47b17f35-a153-4561-a877-86519f825767', 'large / black', 'large', 'TAW-MCB-L-1', 5999, 8250, true, 25, 3)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('d8aaba93-3164-4235-a96e-7fe8f08eabbf', '47b17f35-a153-4561-a877-86519f825767', 'extra-large / black', 'extra-large', 'TAW-MCB-XL-1', 5999, 8250, true, 25, 4)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('b22c6eee-8150-465c-af0b-8f7f7af2214d', 'd4bd170b-03e7-476e-a108-8cfa2e96fbae', 'Small (S) / Beige', 'Small (S)', 'GP-ANB-9351793475817-51554677293289', 5999, 8250, true, 25, 1)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('1a9ed2f4-7712-4ccf-a42d-eaecd64c7b66', 'd4bd170b-03e7-476e-a108-8cfa2e96fbae', 'Small (S) / black', 'Small (S)', 'GP-ANB-9351793475817-51554694070505', 5999, 8250, true, 25, 2)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('79e64912-0eb2-48ed-a3e8-e6bd3deb9ce3', 'd4bd170b-03e7-476e-a108-8cfa2e96fbae', 'Medium (M) / Beige', 'Medium (M)', 'GP-ANB-9351793475817-51554677326057', 5999, 8250, true, 25, 3)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('b0f5198c-491e-49e8-a274-f8a373fca65f', 'd4bd170b-03e7-476e-a108-8cfa2e96fbae', 'Medium (M) / black', 'Medium (M)', 'GP-ANB-9351793475817-51554694103273', 5999, 8250, true, 25, 4)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('8b1f3d43-15de-4466-a5e8-24b487748bb7', 'd4bd170b-03e7-476e-a108-8cfa2e96fbae', 'Large (L) / Beige', 'Large (L)', 'GP-ANB-9351793475817-51554677358825', 5999, 8250, true, 25, 5)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('ee005636-fc78-4803-a5ba-b59b04be182a', 'd4bd170b-03e7-476e-a108-8cfa2e96fbae', 'Large (L) / black', 'Large (L)', 'GP-ANB-9351793475817-51554694136041', 5999, 8250, true, 25, 6)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('3f8b9a2a-b6d6-4795-a066-2f1c7d6c6c2c', 'd4bd170b-03e7-476e-a108-8cfa2e96fbae', 'Extra Large (XL) / Beige', 'Extra Large (XL)', 'GP-ANB-9351793475817-51554677391593', 5999, 8250, true, 25, 7)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('48b0fa0a-1d62-4e12-a74f-3d22125b51f6', 'd4bd170b-03e7-476e-a108-8cfa2e96fbae', 'Extra Large (XL) / black', 'Extra Large (XL)', 'GP-ANB-9351793475817-51554694168809', 5999, 8250, true, 25, 8)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('05637bc5-cdee-4ba9-ac5f-77379badd72a', '3bc17692-61c5-4dcd-a738-d23fd7409f94', 'small', 'small', 'TAW-NA3-S-0', 5999, 8250, true, 25, 1)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('c974833e-b8fd-4292-a611-e03556ae4d82', '3bc17692-61c5-4dcd-a738-d23fd7409f94', 'medium', 'medium', 'TAW-NA3-M-0', 5999, 8250, true, 25, 2)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('d5bc2883-4758-4f07-ac1c-d5136672e4f9', '3bc17692-61c5-4dcd-a738-d23fd7409f94', 'large', 'large', 'TAW-NA3-L-0', 5999, 8250, true, 25, 3)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('cbf4c059-a72c-4f82-a6fc-0dd02e39907a', '3bc17692-61c5-4dcd-a738-d23fd7409f94', 'xl', 'xl', 'TAW-NA3-XL-0', 5999, 8250, true, 25, 4)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('ba44f90f-31b3-4ec2-ab82-e0e853a87a38', '8a3aeb94-1fa8-43ff-a032-acc5cbd5c630', 'Small', 'Small', 'TAW-BE3-S-1', 5999, 8250, true, 25, 1)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('6266b200-49ee-4e66-ac26-295b797bad6a', '8a3aeb94-1fa8-43ff-a032-acc5cbd5c630', 'Medium', 'Medium', 'TAW-BE3-M-1', 5999, 8250, true, 25, 2)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('969c1cd9-0f6b-422d-a97f-1b6eb4d01646', '8a3aeb94-1fa8-43ff-a032-acc5cbd5c630', 'Large', 'Large', 'TAW-BE3-L-1', 5999, 8250, true, 25, 3)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('28cbeaba-4cf5-4aa0-aee2-d5493ec2d184', '8a3aeb94-1fa8-43ff-a032-acc5cbd5c630', 'Xl', 'Xl', 'TAW-BE3-XL-1', 5999, 8250, true, 25, 4)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('53834334-07f5-4e09-abf1-962b65bfa135', 'a5686492-80b5-4882-ab9f-8555bdfea101', 'Small (S)', 'Small (S)', 'GP-ANB-9353060024553-51573205270761', 5999, 8250, true, 25, 1)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('8d46511f-8452-41de-afc2-37f57b127833', 'a5686492-80b5-4882-ab9f-8555bdfea101', 'Medium (M)', 'Medium (M)', 'GP-ANB-9353060024553-51573205336297', 5999, 8250, true, 25, 2)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('2f5c8661-3baa-494e-a699-c25ac0d1f50e', 'a5686492-80b5-4882-ab9f-8555bdfea101', 'Large (L)', 'Large (L)', 'GP-ANB-9353060024553-51573205401833', 5999, 8250, true, 25, 3)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('a9e02d03-0b46-4f8c-a3f3-0a17bfc8619a', 'a5686492-80b5-4882-ab9f-8555bdfea101', 'Extra Large (XL)', 'Extra Large (XL)', 'GP-ANB-9353060024553-51573205467369', 5999, 8250, true, 25, 4)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('c1e9bd61-91c7-4d1a-adfa-a4ad7399438b', 'b1821be2-41c0-4224-a274-9d52826fe528', 'Small (S)', 'Small (S)', 'GP-ANB-9352270840041-51567347433705', 5499, 7698.6, true, 25, 1)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('f8b1e5c1-8cea-4d6e-a5d1-a970037ab388', 'b1821be2-41c0-4224-a274-9d52826fe528', 'Medium (M)', 'Medium (M)', 'GP-ANB-9352270840041-51567347466473', 5499, 7698.6, true, 25, 2)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('fe5f4739-d826-4554-a4f0-1614a842a442', 'b1821be2-41c0-4224-a274-9d52826fe528', 'Large (L)', 'Large (L)', 'GP-ANB-9352270840041-51567347499241', 5499, 7698.6, true, 25, 3)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('dab1219c-84fb-44a3-a189-d1ed0857950b', 'b1821be2-41c0-4224-a274-9d52826fe528', 'Extra Large (XL)', 'Extra Large (XL)', 'GP-ANB-9352270840041-51567347532009', 5499, 7698.6, true, 25, 4)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('c08f5666-2a48-4c8c-a82f-8e34821f258f', '2983d9d1-edad-45f6-a4df-dcf2f37cfd92', 'small', 'small', 'TAW-PARIS-S-0', 5999, 8250, true, 25, 1)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('bb5e8afb-47ca-4421-a88f-ba34f919a5a2', '2983d9d1-edad-45f6-a4df-dcf2f37cfd92', 'medium', 'medium', 'TAW-PARIS-M-0', 5999, 8250, true, 25, 2)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('647815f6-d4c1-4b47-a038-74d698193b50', '2983d9d1-edad-45f6-a4df-dcf2f37cfd92', 'large', 'large', 'TAW-PARIS-L-0', 5999, 8250, true, 25, 3)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('7ef7d76b-d400-4b66-acf4-15debd21050b', '2983d9d1-edad-45f6-a4df-dcf2f37cfd92', 'xl', 'xl', 'TAW-PARIS-XL-0', 5999, 8250, true, 25, 4)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('e4080317-cde0-415b-a4c4-3204776f07fd', 'acf9bbd7-3cb3-4632-ad2b-59e3ee7489dd', 'Small (S)', 'Small (S)', 'GP-ANB-9351789215977-51554638495977', 4499, 6298.6, true, 25, 1)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('7c1ffc61-7bfe-4b04-a760-71de296a9b87', 'acf9bbd7-3cb3-4632-ad2b-59e3ee7489dd', 'Medium (M)', 'Medium (M)', 'GP-ANB-9351789215977-51554638528745', 4499, 6298.6, true, 25, 2)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('d61a8343-2a9c-4958-a517-bf7eebed1adb', 'acf9bbd7-3cb3-4632-ad2b-59e3ee7489dd', 'Large (L)', 'Large (L)', 'GP-ANB-9351789215977-51554638561513', 4499, 6298.6, true, 25, 3)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('92bdebac-30d8-4a1b-ac19-095d5468bd56', 'acf9bbd7-3cb3-4632-ad2b-59e3ee7489dd', 'Extra Large (XL)', 'Extra Large (XL)', 'GP-ANB-9351789215977-51554638594281', 4499, 6298.6, true, 25, 4)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('c5074460-016a-4dbf-a6a7-502822251d2f', 'e8e3b097-8c56-46d9-a63f-fd7eb93b1ae7', 's', 's', 'TAW-P3-S-176053769252143', 5999, 8250, true, 25, 1)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('9404d55b-55a2-4645-a0af-43ddf0b8cdaf', 'e8e3b097-8c56-46d9-a63f-fd7eb93b1ae7', 'm', 'm', 'TAW-P3-M-176053769252140', 5999, 8250, true, 25, 2)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('6ba97def-b0f3-4d09-a02a-48939f91f01a', 'e8e3b097-8c56-46d9-a63f-fd7eb93b1ae7', 'l', 'l', 'TAW-P3-L-176053769252141', 5999, 8250, true, 25, 3)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('d16d2b9c-4b2d-4897-a777-0ff588707245', 'e8e3b097-8c56-46d9-a63f-fd7eb93b1ae7', 'xl', 'xl', 'TAW-P3-XL-176053769252137', 5999, 8250, true, 25, 4)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('e0d003e1-6222-4d2d-ae92-a70dbeece817', 'a106adfd-c20f-479b-abb3-eb18d5c3aeb4', 'Small (S)', 'Small (S)', 'GP-ANB-9356929859817-51593660072169', 5299, 7419, true, 25, 1)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('02af474e-e102-4f94-af84-2222655e742e', 'a106adfd-c20f-479b-abb3-eb18d5c3aeb4', 'Medium (M)', 'Medium (M)', 'GP-ANB-9356929859817-51593660104937', 5299, 7419, true, 25, 2)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('417795ec-8b06-44b7-af34-23bbd1570d09', 'a106adfd-c20f-479b-abb3-eb18d5c3aeb4', 'Large (L)', 'Large (L)', 'GP-ANB-9356929859817-51593660137705', 5299, 7419, true, 25, 3)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('eb4eb02f-725b-453c-a27d-0ea8c5610a6e', 'a106adfd-c20f-479b-abb3-eb18d5c3aeb4', 'Extra Large (XL)', 'Extra Large (XL)', 'GP-ANB-9356929859817-51593660170473', 5299, 7419, true, 25, 4)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('7b4b9359-66c6-45eb-a81c-e6489ca021de', 'd495c75e-871c-41a0-a90b-b42c127fafe2', 'Small (S)', 'Small (S)', 'GP-ANB-9351792525545-51554670870761', 5299, 7419, true, 25, 1)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('8948c344-ec1d-4600-a38a-37b8c70138e6', 'd495c75e-871c-41a0-a90b-b42c127fafe2', 'Medium (M)', 'Medium (M)', 'GP-ANB-9351792525545-51554670903529', 5299, 7419, true, 25, 2)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('ff470c87-f4d5-4552-ade4-2e9f0e0a1fa6', 'd495c75e-871c-41a0-a90b-b42c127fafe2', 'Large (L)', 'Large (L)', 'GP-ANB-9351792525545-51554670936297', 5299, 7419, true, 25, 3)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('bd6cc8c4-d0ee-41ca-a866-de176324548e', 'd495c75e-871c-41a0-a90b-b42c127fafe2', 'Extra Large (XL)', 'Extra Large (XL)', 'GP-ANB-9351792525545-51554670969065', 5299, 7419, true, 25, 4)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('74aa0650-49c9-4982-a3b8-9b19d38a8023', 'f2519c85-f4a5-4cf4-a11c-794648156d7b', 'small', 'small', 'TAW-RINA-S-0', 5999, 8250, true, 25, 1)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('4f1064a5-dd6a-409d-a99e-6184663eac2e', 'f2519c85-f4a5-4cf4-a11c-794648156d7b', 'medium', 'medium', 'TAW-RINA-M-0', 5999, 8250, true, 25, 2)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('16b8e04c-779e-4100-a51b-0cc1fae4ec3e', 'f2519c85-f4a5-4cf4-a11c-794648156d7b', 'large', 'large', 'TAW-RINA-L-0', 5999, 8250, false, 0, 3)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('97491b07-b7e0-4d89-acb5-f76ddf44a59f', 'f2519c85-f4a5-4cf4-a11c-794648156d7b', 'xl', 'xl', 'TAW-RINA-XL-0', 5999, 8250, true, 25, 4)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('3304f469-8d20-482f-ab4c-504c3ef5b233', '61788cda-7961-4418-ab58-e7f555198e38', 'Small (S)', 'Small (S)', 'GP-ANB-9351783219433-51554580627689', 5499, 7698.6, true, 25, 1)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('cf73a02d-41cd-42c1-af26-0e78a530dd35', '61788cda-7961-4418-ab58-e7f555198e38', 'Medium (M)', 'Medium (M)', 'GP-ANB-9351783219433-51554580660457', 5499, 7698.6, true, 25, 2)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('b36b4c97-1d96-48b3-a101-b531f2a4f09c', '61788cda-7961-4418-ab58-e7f555198e38', 'Large (L)', 'Large (L)', 'GP-ANB-9351783219433-51554580693225', 5499, 7698.6, true, 25, 3)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('759d9e64-8225-4f1e-a8a9-0410ced46b8e', '61788cda-7961-4418-ab58-e7f555198e38', 'Extra Large (XL)', 'Extra Large (XL)', 'GP-ANB-9351783219433-51554580725993', 5499, 7698.6, true, 25, 4)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('4b895af0-0ab4-4274-a673-ad4cb8db6016', '1c889dbe-c013-435f-ac8f-d389b30da10c', 'Small (S)', 'Small (S)', 'GP-ANB-9351790526697-51554658484457', 4999, 6998.6, true, 25, 1)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('ef6e552a-50ad-4d20-a32f-96ccc6d56649', '1c889dbe-c013-435f-ac8f-d389b30da10c', 'Medium (M)', 'Medium (M)', 'GP-ANB-9351790526697-51554658517225', 4999, 6998.6, true, 25, 2)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('e4adda05-c0f6-45ae-abc3-50085851533e', '1c889dbe-c013-435f-ac8f-d389b30da10c', 'Large (L)', 'Large (L)', 'GP-ANB-9351790526697-51554658549993', 4999, 6998.6, true, 25, 3)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('58393d6b-435d-41e8-a2f9-6c93182f34cd', '1c889dbe-c013-435f-ac8f-d389b30da10c', 'Extra Large (XL)', 'Extra Large (XL)', 'GP-ANB-9351790526697-51554658582761', 4999, 6998.6, true, 25, 4)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('682c2b4c-c85d-43c5-a70a-453d0edb77d9', '90efbae5-0c2e-4c30-aa93-81673709675e', 'Small (S)', 'Small (S)', 'GP-ANB-9351770898665-51554539569385', 5499, 7698.6, true, 25, 1)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('fe8c956e-456a-4aed-aca8-4248889fa31a', '90efbae5-0c2e-4c30-aa93-81673709675e', 'Medium (M)', 'Medium (M)', 'GP-ANB-9351770898665-51554539602153', 5499, 7698.6, true, 25, 2)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('e502ad4b-745a-4cf4-aa61-3f179971a52a', '90efbae5-0c2e-4c30-aa93-81673709675e', 'Large (L)', 'Large (L)', 'GP-ANB-9351770898665-51554539634921', 5499, 7698.6, true, 25, 3)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('9cb78f81-e90e-44a8-a477-f9de1c97d3e5', '90efbae5-0c2e-4c30-aa93-81673709675e', 'Extra Large (XL)', 'Extra Large (XL)', 'GP-ANB-9351770898665-51554539667689', 5499, 7698.6, true, 25, 4)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('1f3034f4-fd8d-4a76-a290-4e67ac433bbb', '178198e7-3604-4651-a64c-cec8aa722608', 'small', 'small', 'TAW-BE-S-0', 5500, 7950, true, 25, 1)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('015ff7de-a3e4-4dd5-ad0e-d10de62952c5', '178198e7-3604-4651-a64c-cec8aa722608', 'medium', 'medium', 'TAW-BE-M-0', 5500, 7950, true, 25, 2)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('2d3377b4-ad7e-42f1-ac7f-add5d16c502c', '178198e7-3604-4651-a64c-cec8aa722608', 'large', 'large', 'TAW-BE-L-0', 5500, 7950, true, 25, 3)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('43034fe5-26db-4eca-a117-5d94cc2e5c10', '178198e7-3604-4651-a64c-cec8aa722608', 'extra-large', 'extra-large', 'TAW-BE-XL-0', 5500, 7950, true, 25, 4)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('7275265e-7c28-4381-ad93-df545274381f', '04e321ea-b08c-4f98-a96b-837c37aa8271', 'Small (S)', 'Small (S)', 'GP-ANB-9351784792297-51554600911081', 4499, 6298.6, true, 25, 1)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('14ee2c20-3252-4a23-a503-7852c073187e', '04e321ea-b08c-4f98-a96b-837c37aa8271', 'Medium (M)', 'Medium (M)', 'GP-ANB-9351784792297-51554600943849', 4499, 6298.6, true, 25, 2)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('74e3112a-6131-4f74-a9c9-1eabc8743b47', '04e321ea-b08c-4f98-a96b-837c37aa8271', 'Large (L)', 'Large (L)', 'GP-ANB-9351784792297-51554600976617', 4499, 6298.6, true, 25, 3)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('c27f38b8-8d29-4a69-a12f-0138d8b74ae7', '04e321ea-b08c-4f98-a96b-837c37aa8271', 'Extra Large (XL)', 'Extra Large (XL)', 'GP-ANB-9351784792297-51554601009385', 4499, 6298.6, true, 25, 4)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('41caf940-94d5-4f73-a62d-f9e8fb3f7024', 'ed6de3eb-39f5-477a-aecf-f1f0bec901fe', 'Small (S)', 'Small (S)', 'GP-ANB-9353008480489-51572917240041', 5499, 7698.6, true, 25, 1)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('824575f2-8a71-4b69-ad48-be2ef04ed5b8', 'ed6de3eb-39f5-477a-aecf-f1f0bec901fe', 'Medium (M)', 'Medium (M)', 'GP-ANB-9353008480489-51572917272809', 5499, 7698.6, true, 25, 2)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('b975b6dd-3e2f-4184-ab49-982bac94d49d', 'ed6de3eb-39f5-477a-aecf-f1f0bec901fe', 'Large (L)', 'Large (L)', 'GP-ANB-9353008480489-51572917305577', 5499, 7698.6, true, 25, 3)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('84a10c8e-2f6e-4450-a58d-a21ed1128c2f', 'ed6de3eb-39f5-477a-aecf-f1f0bec901fe', 'Extra Large (XL)', 'Extra Large (XL)', 'GP-ANB-9353008480489-51572917338345', 5499, 7698.6, true, 25, 4)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('a985335e-7ae9-4411-ae79-703f756f2a2f', '309b83cc-3af3-491e-a218-b07e73681f26', 'cotton / small', 'cotton', 'TAW-Z-C2P-S-0', 3999, NULL, true, 25, 1)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('b2e4f959-fe76-48be-af9e-88b5b52543d2', '309b83cc-3af3-491e-a218-b07e73681f26', 'cotton / medium', 'cotton', 'TAW-Z-C2P-M-0', 3999, NULL, true, 25, 2)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('4ac2e3e4-c668-42f0-aa9b-569274993633', '309b83cc-3af3-491e-a218-b07e73681f26', 'cotton / large', 'cotton', 'TAW-Z-C2P-L-0', 3999, NULL, true, 25, 3)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('3e70423a-dc6e-4876-afd4-eeedaca6b202', '309b83cc-3af3-491e-a218-b07e73681f26', 'cotton / extra-large', 'cotton', 'TAW-Z-C2P-XL-0', 3999, NULL, true, 25, 4)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('ab48e308-1c82-4172-aeb6-6a3ddb5a9830', '0f028a27-c9ef-4d7a-a46f-7a87b2388d88', 'Small (S)', 'Small (S)', 'GP-ANB-9405081977065-51781471174889', 6499, 8250, true, 25, 1)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('3b533612-63e5-44e1-a910-26da6c8729e1', '0f028a27-c9ef-4d7a-a46f-7a87b2388d88', 'Medium (M)', 'Medium (M)', 'GP-ANB-9405081977065-51781471207657', 6499, 8250, true, 25, 2)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('5ebaaa05-8a44-4f5c-ac29-0802e44766b7', '0f028a27-c9ef-4d7a-a46f-7a87b2388d88', 'Large (L)', 'Large (L)', 'GP-ANB-9405081977065-51781471240425', 6499, 8250, true, 25, 3)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('0012fb7f-b563-4380-a79d-111d1f49ef10', '0f028a27-c9ef-4d7a-a46f-7a87b2388d88', 'Extra Large (XL)', 'Extra Large (XL)', 'GP-ANB-9405081977065-51781471273193', 6499, 8250, true, 25, 4)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('87123db8-43ae-4b13-a969-4533a6e8899b', '79430272-a7fb-481b-a2c4-943682ddd582', 'small', 'small', 'TAW-NE-S', 5999, 8250, true, 25, 1)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('9aa9fa72-64fd-4f36-a89b-c0524350d922', '79430272-a7fb-481b-a2c4-943682ddd582', 'medium', 'medium', 'TAW-NE-M', 5999, 8250, true, 25, 2)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('db12ff1e-8194-4a54-a39c-4bf06c3b520b', '79430272-a7fb-481b-a2c4-943682ddd582', 'large', 'large', 'TAW-NE-L', 5999, 8250, true, 25, 3)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('83a4fe6c-3498-4834-abdd-c1ed436ab5eb', '79430272-a7fb-481b-a2c4-943682ddd582', 'extra-large', 'extra-large', 'TAW-NE-XL', 5999, 8250, true, 25, 4)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('fd2194dc-8c71-4474-aaa5-db3691af5c7e', '62cca4a5-a562-45be-a5d0-99130e0a2519', 'Small (S)', 'Small (S)', 'GP-ANB-9353039610089-51573123809513', 5299, 7419, true, 25, 1)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('8b0f8caa-86fb-415b-a193-3835af1f0334', '62cca4a5-a562-45be-a5d0-99130e0a2519', 'Medium (M)', 'Medium (M)', 'GP-ANB-9353039610089-51573123842281', 5299, 7419, true, 25, 2)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('4076e3d9-74bf-4a14-aaee-7b7e05e9874d', '62cca4a5-a562-45be-a5d0-99130e0a2519', 'Large (L)', 'Large (L)', 'GP-ANB-9353039610089-51573123875049', 5299, 7419, true, 25, 3)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;
INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('180436d4-544d-4ab8-a5bc-18f4d6a4382d', '62cca4a5-a562-45be-a5d0-99130e0a2519', 'Extra Large (XL)', 'Extra Large (XL)', 'GP-ANB-9353039610089-51573123907817', 5299, 7419, true, 25, 4)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;

-- 5. Insert Product Images
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('d3609f84-f520-4505-a9f3-39eda4211f64', '4f1c277b-917f-47e6-a855-d5b2c493757d', '/products/anabya/aazure-3piece/01_49909420425449.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_de417feb-8ef0-4a5e-b27c-1e4ab8a422e1.jpg?v=1785785797', 'Aazure 3Piece - GulPash View 1', 1, true, 1383, 2074)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('f964f7e4-a8c7-4bbd-aa6f-46fbd76adb40', '4f1c277b-917f-47e6-a855-d5b2c493757d', '/products/anabya/aazure-3piece/02_49909420523753.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_e7be21ef-ca49-48e4-98c5-3fb1228d483c.jpg?v=1785785797', 'Aazure 3Piece - GulPash View 2', 2, false, 2305, 3457)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('f18b2dc2-a9ff-4f30-a4af-6abfe6627c3c', '4f1c277b-917f-47e6-a855-d5b2c493757d', '/products/anabya/aazure-3piece/03_49909420556521.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_c2ff0dc7-ebb9-414e-b464-b227814b8c2f.jpg?v=1785785798', 'Aazure 3Piece - GulPash View 3', 3, false, 2305, 3457)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('c1f5dfb9-d027-4a33-a377-23c482882ced', '4f1c277b-917f-47e6-a855-d5b2c493757d', '/products/anabya/aazure-3piece/04_49909420490985.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_121ce3ec-6c9d-4dfc-8fbf-fef8636c67ee.jpg?v=1785785797', 'Aazure 3Piece - GulPash View 4', 4, false, 2305, 3457)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('0d7e0232-8660-4422-acb4-5dc4606dc8c0', '4f1c277b-917f-47e6-a855-d5b2c493757d', '/products/anabya/aazure-3piece/05_49909420458217.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_3af83398-3c52-48f8-aab1-cafe1b9c55c3.jpg?v=1785785798', 'Aazure 3Piece - GulPash View 5', 5, false, 2305, 3457)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('a33d8b28-7dda-4e88-a1d4-9a83993ac64b', '4f1c277b-917f-47e6-a855-d5b2c493757d', '/products/anabya/aazure-3piece/06_49910324330729.png', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/44_to_45.png?v=1785787631', 'Aazure 3Piece - GulPash View 6', 6, false, 1536, 1024)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('8f333f84-d575-4058-a29a-005ee11d25b1', '7d78784f-55b3-4997-ad84-b8f5a05f622c', '/products/anabya/alize-black-3pcs-embroidery/01_49440049103081.png', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/5.png?v=1781367167', 'Aleeeza Black 3pcs - GulPash View 1', 1, true, 864, 1184)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('0ccc0156-f458-416d-a155-250b083d0946', '7d78784f-55b3-4997-ad84-b8f5a05f622c', '/products/anabya/alize-black-3pcs-embroidery/02_49440049135849.png', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/2_b5ff6c94-0db8-4815-a404-b3b90c9f149f.png?v=1781367167', 'Aleeeza Black 3pcs - GulPash View 2', 2, false, 864, 1184)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('773cd3c7-9593-411f-abbb-439a2332e44c', '7d78784f-55b3-4997-ad84-b8f5a05f622c', '/products/anabya/alize-black-3pcs-embroidery/03_49440049168617.png', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/1.png?v=1781367167', 'Aleeeza Black 3pcs - GulPash View 3', 3, false, 864, 1184)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('440a7452-632d-497c-a8d2-921f917a6d9e', '7d78784f-55b3-4997-ad84-b8f5a05f622c', '/products/anabya/alize-black-3pcs-embroidery/04_49440049201385.png', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/3_cdc1440a-75c7-4ee9-9d18-c25eb3eeb327.png?v=1781367167', 'Aleeeza Black 3pcs - GulPash View 4', 4, false, 864, 1184)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('5d2b2911-f422-4d4f-a8a2-531d08c9ce42', '7d78784f-55b3-4997-ad84-b8f5a05f622c', '/products/anabya/alize-black-3pcs-embroidery/05_49440049234153.png', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/4_cb2ef79a-febe-426e-9414-beb77113d677.png?v=1781367167', 'Aleeeza Black 3pcs - GulPash View 5', 5, false, 864, 1184)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('aaf69de2-800e-481c-a006-13d5590e8872', '7aa3b55d-255c-4d23-a44b-4edea63e374a', '/products/anabya/alize-3pcs/01_49440049594601.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Readytoservelooksthisfestiveseason_Shopnow._Mirana_newcollection_TimelessElegence_8.jpg?v=1781367169', 'Alize 3Pcs - GulPash View 1', 1, true, 1080, 1440)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('7012a988-f498-4ca2-adf2-49915e72ca82', '7aa3b55d-255c-4d23-a44b-4edea63e374a', '/products/anabya/alize-3pcs/02_49440049627369.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Readytoservelooksthisfestiveseason_Shopnow._Mirana_newcollection_TimelessElegence_7.jpg?v=1781367169', 'Alize 3Pcs - GulPash View 2', 2, false, 1080, 1440)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('bcd33c5a-1270-44d7-ab1b-453f65c8ecb9', '7aa3b55d-255c-4d23-a44b-4edea63e374a', '/products/anabya/alize-3pcs/03_49440049660137.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Readytoservelooksthisfestiveseason_Shopnow._Mirana_newcollection_TimelessElegence_6.jpg?v=1781367169', 'Alize 3Pcs - GulPash View 3', 3, false, 1080, 1440)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('42927ef1-3984-4c30-a3b7-5d4a431f6570', '7aa3b55d-255c-4d23-a44b-4edea63e374a', '/products/anabya/alize-3pcs/04_49440049692905.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Readytoservelooksthisfestiveseason_Shopnow._Mirana_newcollection_TimelessElegence_5.jpg?v=1781367169', 'Alize 3Pcs - GulPash View 4', 4, false, 1080, 1440)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('cf31006a-70c4-4473-a194-42f3345a06f1', '7aa3b55d-255c-4d23-a44b-4edea63e374a', '/products/anabya/alize-3pcs/05_49440049725673.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Readytoservelooksthisfestiveseason_Shopnow._Mirana_newcollection_TimelessElegence_4.jpg?v=1781367169', 'Alize 3Pcs - GulPash View 5', 5, false, 1080, 1440)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('7e69899b-19b4-4f9c-a3ca-475f20675352', '7aa3b55d-255c-4d23-a44b-4edea63e374a', '/products/anabya/alize-3pcs/06_49440049758441.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Readytoservelooksthisfestiveseason_Shopnow._Mirana_newcollection_TimelessElegence_3.jpg?v=1781367169', 'Alize 3Pcs - GulPash View 6', 6, false, 1080, 1440)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('06b20006-4955-4bea-abed-6cdca22596ef', '7aa3b55d-255c-4d23-a44b-4edea63e374a', '/products/anabya/alize-3pcs/07_49440049791209.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Readytoservelooksthisfestiveseason_Shopnow._Mirana_newcollection_TimelessElegence_2.jpg?v=1781367169', 'Alize 3Pcs - GulPash View 7', 7, false, 1080, 1440)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('b247361b-039c-4390-a5cd-c0fa81b3e5b4', '7aa3b55d-255c-4d23-a44b-4edea63e374a', '/products/anabya/alize-3pcs/08_49440049823977.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Readytoservelooksthisfestiveseason_Shopnow._Mirana_newcollection_TimelessElegence_1.jpg?v=1781367169', 'Alize 3Pcs - GulPash View 8', 8, false, 1080, 1440)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('26fc3f7b-1053-4b7e-a754-45c5a12ee769', '7aa3b55d-255c-4d23-a44b-4edea63e374a', '/products/anabya/alize-3pcs/09_49440049856745.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Readytoservelooksthisfestiveseason_Shopnow._Mirana_newcollection_TimelessElegence.jpg?v=1781367169', 'Alize 3Pcs - GulPash View 9', 9, false, 1080, 1440)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('0e2eb029-6fe3-46bc-a2e5-151509f3c106', '1137ec03-4d5c-4fc3-a86a-6171252552f0', '/products/anabya/amber-3piece/01_49909420589289.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_5c587067-6e1d-49c9-bd37-432b5bcf3d41.jpg?v=1785785797', 'Amber 3Piece - GulPash View 1', 1, true, 1383, 2074)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('f1fc57d0-3a54-459b-a020-19efe5b19891', '1137ec03-4d5c-4fc3-a86a-6171252552f0', '/products/anabya/amber-3piece/02_49909420720361.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_4a6f66a7-151f-45bb-842f-ed4711772ed8.jpg?v=1785785798', 'Amber 3Piece - GulPash View 2', 2, false, 2305, 3457)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('cc0d64a8-fb95-4fcf-adf5-cb707b5368a6', '1137ec03-4d5c-4fc3-a86a-6171252552f0', '/products/anabya/amber-3piece/03_49909420687593.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_fb6ee4a7-8c1e-47c5-924b-93bb35f970c8.jpg?v=1785785797', 'Amber 3Piece - GulPash View 3', 3, false, 2305, 3457)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('e6517749-a255-49df-af53-d8d42b26ef2d', '1137ec03-4d5c-4fc3-a86a-6171252552f0', '/products/anabya/amber-3piece/04_49909420654825.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_04f2a2dc-42a5-4792-a7ae-3b35c5197d3f.jpg?v=1785785797', 'Amber 3Piece - GulPash View 4', 4, false, 2305, 3457)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('62c66205-7829-41d3-aab6-6197904f50ec', '1137ec03-4d5c-4fc3-a86a-6171252552f0', '/products/anabya/amber-3piece/05_49909420622057.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_73032069-1557-4182-b9c9-46c54900fc22.jpg?v=1785785797', 'Amber 3Piece - GulPash View 5', 5, false, 2305, 3457)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('30f77dd5-b0bf-4982-a166-7f6ddc25ae74', '1137ec03-4d5c-4fc3-a86a-6171252552f0', '/products/anabya/amber-3piece/06_49910324330729.png', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/44_to_45.png?v=1785787631', 'Amber 3Piece - GulPash View 6', 6, false, 1536, 1024)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('2859265c-4141-403b-a812-8ad53859c1a6', 'a020657f-4e8f-47c5-a90d-e129669dc324', '/products/anabya/armeen-3pcs/01_49440047464681.png', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/1_e908f076-38a6-4c33-a784-da13a142a343.png?v=1781367161', 'Armeen 3pcs - GulPash View 1', 1, true, 1842, 2304)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('22389504-3f87-4490-a786-88547313a86b', 'a020657f-4e8f-47c5-a90d-e129669dc324', '/products/anabya/armeen-3pcs/02_49440047497449.png', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/2_70236901-d0af-42e4-aa54-bcefc62cfb8b.png?v=1781367161', 'Armeen 3pcs - GulPash View 2', 2, false, 1842, 2304)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('d18ac83a-1d52-45b6-a2bc-4b4e75dbf36d', 'a020657f-4e8f-47c5-a90d-e129669dc324', '/products/anabya/armeen-3pcs/03_49440047530217.png', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/3_a1b8bcd5-7621-4135-a7d4-26c42395ad92.png?v=1781367161', 'Armeen 3pcs - GulPash View 3', 3, false, 1842, 2304)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('3ae07da3-178b-444d-aab7-a3bbe586aab7', 'a020657f-4e8f-47c5-a90d-e129669dc324', '/products/anabya/armeen-3pcs/04_49440047562985.png', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/5_101459c1-cb31-4805-91f4-aeccd5c002b3.png?v=1781367161', 'Armeen 3pcs - GulPash View 4', 4, false, 1842, 2304)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('01900b95-9707-4440-a4bd-4c558677b80e', 'a020657f-4e8f-47c5-a90d-e129669dc324', '/products/anabya/armeen-3pcs/05_49440047595753.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/IMG_1012_JPG.jpg?v=1781367160', 'Armeen 3pcs - GulPash View 5', 5, false, 1170, 2080)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('21f1b925-8df9-44a1-aec4-bbabd4c4e972', 'a020657f-4e8f-47c5-a90d-e129669dc324', '/products/anabya/armeen-3pcs/06_49440047628521.png', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/4_05def333-9aa3-4b44-937e-6133591897bc.png?v=1781367167', 'Armeen 3pcs - GulPash View 6', 6, false, 1842, 2304)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('9aa64ae7-1e3f-422b-a91c-c4ce562d228a', '71f2b516-7326-4ed0-a553-5877dfdc668b', '/products/anabya/azmeen-3-piece/01_49815933812969.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_1bddec72-efea-4baf-b82a-420e7df572ae.jpg?v=1784921635', 'Azmeen 3 Piece - GulPash View 1', 1, true, 600, 800)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('bb00c43d-976f-4779-a0c4-9b2ffaa6ba8e', '71f2b516-7326-4ed0-a553-5877dfdc668b', '/products/anabya/azmeen-3-piece/02_49815933714665.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_ad02dec1-398e-422d-83dd-795d0f8b888d.jpg?v=1784921635', 'Azmeen 3 Piece - GulPash View 2', 2, false, 600, 800)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('b30a2e8d-4a08-4cbe-a8c8-3e56fb6a68ec', '71f2b516-7326-4ed0-a553-5877dfdc668b', '/products/anabya/azmeen-3-piece/03_49815933747433.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_ceddb332-e5c8-4346-8510-ba1a68d578ea.jpg?v=1784921636', 'Azmeen 3 Piece - GulPash View 3', 3, false, 600, 800)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('7b7246bf-e99a-4a32-a52e-17012349e4ce', '71f2b516-7326-4ed0-a553-5877dfdc668b', '/products/anabya/azmeen-3-piece/04_49815933780201.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_34fe978c-00b0-4e39-8ca4-c037a1f7e64e.jpg?v=1784921635', 'Azmeen 3 Piece - GulPash View 4', 4, false, 600, 800)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('b309b316-948f-49da-aecb-988e05734444', '71f2b516-7326-4ed0-a553-5877dfdc668b', '/products/anabya/azmeen-3-piece/05_49815933616361.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_b51eb010-c8a7-4c32-ac58-19714d535f5a.jpg?v=1784921636', 'Azmeen 3 Piece - GulPash View 5', 5, false, 600, 800)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('d6d3a180-37d5-4ef0-a472-0e66a29e8e13', '71f2b516-7326-4ed0-a553-5877dfdc668b', '/products/anabya/azmeen-3-piece/06_49815933681897.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_723c4cae-20c6-4796-93b2-1ffa61527812.jpg?v=1784921635', 'Azmeen 3 Piece - GulPash View 6', 6, false, 600, 800)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('c2a65006-c55f-4b4c-a59b-8872137ac3da', '71f2b516-7326-4ed0-a553-5877dfdc668b', '/products/anabya/azmeen-3-piece/07_49815933649129.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_958d7dad-c3d3-4134-89da-f0cd83695f58.jpg?v=1784921636', 'Azmeen 3 Piece - GulPash View 7', 7, false, 600, 800)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('ee975b43-7d93-4674-a769-2b4586be00dd', 'd6c3d9b0-c2d5-4b2b-aa90-8ee2b1f4bed2', '/products/anabya/blackish-emb-3pcs-1/01_49440054116585.png', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/SnapInsta_imgupscaler.ai_v1_Fast__4K_4.png?v=1781367187', 'Blackish EMB 3PCS - GulPash View 1', 1, true, 2880, 3840)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('6641cd40-3793-46b5-abfd-15f5f1e3c035', 'd6c3d9b0-c2d5-4b2b-aa90-8ee2b1f4bed2', '/products/anabya/blackish-emb-3pcs-1/02_49440054149353.png', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/SnapInsta_imgupscaler.ai_v1_Fast__4K_3.png?v=1781367189', 'Blackish EMB 3PCS - GulPash View 2', 2, false, 2880, 3840)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('bc607771-dcb5-49d3-a775-03f769378b5b', 'd6c3d9b0-c2d5-4b2b-aa90-8ee2b1f4bed2', '/products/anabya/blackish-emb-3pcs-1/03_49440054182121.png', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/SnapInsta_imgupscaler.ai_v1_Fast__4K_2.png?v=1781367189', 'Blackish EMB 3PCS - GulPash View 3', 3, false, 2880, 3840)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('55c75bdc-8f58-4aff-a96a-e1543bfaf438', 'd6c3d9b0-c2d5-4b2b-aa90-8ee2b1f4bed2', '/products/anabya/blackish-emb-3pcs-1/04_49440054214889.png', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/SnapInsta_imgupscaler.ai_v1_Fast__4K_1_1.png?v=1781367189', 'Blackish EMB 3PCS - GulPash View 4', 4, false, 2880, 3840)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('fdbf70b1-3daf-4dcd-a4e6-4ce2b7ba8773', 'd6c3d9b0-c2d5-4b2b-aa90-8ee2b1f4bed2', '/products/anabya/blackish-emb-3pcs-1/05_49440054247657.png', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/SnapInsta_imgupscaler.ai_v1_Fast__4K_5.png?v=1781367189', 'Blackish EMB 3PCS - GulPash View 5', 5, false, 2880, 3840)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('27d3db99-1b32-41a9-a2e2-7028fa22a277', '22b380a2-b6e0-4a74-a457-c6828458bc57', '/products/anabya/elara/01_49440043499753.webp', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/DSC01957.webp?v=1781367142', 'Elara - GulPash View 1', 1, true, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('b4bb17b4-a9fe-45ab-aca6-110cead0728b', '22b380a2-b6e0-4a74-a457-c6828458bc57', '/products/anabya/elara/02_49440043532521.webp', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/DSC01984.webp?v=1781367142', 'Elara - GulPash View 2', 2, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('ee3418f6-3606-4c52-a736-3c30296a8a2f', '22b380a2-b6e0-4a74-a457-c6828458bc57', '/products/anabya/elara/03_49440043565289.webp', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/DSC01982.webp?v=1781367142', 'Elara - GulPash View 3', 3, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('cf2e7b50-8023-4c51-a665-9d66fb660956', '22b380a2-b6e0-4a74-a457-c6828458bc57', '/products/anabya/elara/04_49440043598057.webp', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/DSC01954.webp?v=1781367142', 'Elara - GulPash View 4', 4, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('b60b40a5-ca00-4b8e-a369-b3da0cd6b435', '22b380a2-b6e0-4a74-a457-c6828458bc57', '/products/anabya/elara/05_49440043630825.webp', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/DSC02052.webp?v=1781367142', 'Elara - GulPash View 5', 5, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('8126c4c5-9fda-4423-a762-d4ecf4e61c4a', '22b380a2-b6e0-4a74-a457-c6828458bc57', '/products/anabya/elara/06_49440043663593.webp', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/DSC02010.webp?v=1781367142', 'Elara - GulPash View 6', 6, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('3415a5ac-6d81-4d5c-a268-ead8cd59e8ed', '22b380a2-b6e0-4a74-a457-c6828458bc57', '/products/anabya/elara/07_49440043696361.webp', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/DSC01967.webp?v=1781367142', 'Elara - GulPash View 7', 7, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('0f16a0a0-9079-4e9c-acfa-809226fac6da', 'bf19a309-ad4e-4746-a043-4bbe1261d43d', '/products/anabya/elsa-embroidery-3pcs/01_49440070336745.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Mirana18JULY-1255_720x_cec48211-056f-4a61-b34a-4874d065cae3_webp_jpg.jpg?v=1781367240', 'Elsa Embroidery 3pcs - GulPash View 1', 1, true, 720, 1080)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('ee8d4b4a-849d-40bd-a43a-86007420fc1c', 'bf19a309-ad4e-4746-a043-4bbe1261d43d', '/products/anabya/elsa-embroidery-3pcs/02_49440070369513.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Mirana18JULY-1258_720x_a80bb7be-8363-483d-ae6b-ae0130b95958_webp.jpg_1.jpg?v=1781367239', 'Elsa Embroidery 3pcs - GulPash View 2', 2, false, 720, 1080)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('1494f25a-41ed-40f0-aef9-7403d5e8de0c', 'bf19a309-ad4e-4746-a043-4bbe1261d43d', '/products/anabya/elsa-embroidery-3pcs/03_49440070402281.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Mirana18JULY-1321_720x_3ad5346e-e3e6-4f25-859b-d21c3b016a59_webp_jpg.jpg?v=1781367240', 'Elsa Embroidery 3pcs - GulPash View 3', 3, false, 720, 1080)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('29504f28-26b8-4ceb-ab2e-e062d705b8b6', 'bf19a309-ad4e-4746-a043-4bbe1261d43d', '/products/anabya/elsa-embroidery-3pcs/04_49440070435049.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Mirana18JULY-1273_720x_124dc8e0-c8ec-49d1-9405-ca049b23676d_webp_jpg.jpg?v=1781367239', 'Elsa Embroidery 3pcs - GulPash View 4', 4, false, 720, 1080)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('eb0ef4a6-f479-4e74-ad5d-88ac1474fa45', 'bf19a309-ad4e-4746-a043-4bbe1261d43d', '/products/anabya/elsa-embroidery-3pcs/05_49440070467817.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Mirana18JULY-1286_720x_882d3517-6c1d-45db-ac8f-2b167cddecd8_webp_jpg.jpg?v=1781367239', 'Elsa Embroidery 3pcs - GulPash View 5', 5, false, 720, 1080)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('f49c90b1-8f0a-4fea-aac0-6e7b224c0d9d', 'bf19a309-ad4e-4746-a043-4bbe1261d43d', '/products/anabya/elsa-embroidery-3pcs/06_49440070500585.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Mirana18JULY-1478_720x_23210ce7-8f60-4eb4-9b7f-265c9988f17d_webp_jpg.jpg?v=1781367239', 'Elsa Embroidery 3pcs - GulPash View 6', 6, false, 720, 1080)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('f7466ebd-8d1b-46e0-a733-581c737458dd', 'bf19a309-ad4e-4746-a043-4bbe1261d43d', '/products/anabya/elsa-embroidery-3pcs/07_49440070533353.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Mirana18JULY-1414_720x_c6c21177-8ffe-404d-84a4-569e03e07ba2_webp_jpg.jpg?v=1781367240', 'Elsa Embroidery 3pcs - GulPash View 7', 7, false, 720, 1080)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('2d11ad54-9015-4f7a-a5fb-5e00bc503de5', 'f58f8a61-cb17-41f2-ae42-b53a905d0f75', '/products/anabya/golden-grace/01_49440065880297.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/LNF-41-GOLDEN.1_700x_fd684c0a-a5a2-4a8c-a72a-85f0c7815dec.jpg?v=1781367223', 'Golden Grace - GulPash View 1', 1, true, 700, 1147)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('1a7d9ba9-8253-421b-a97c-552179536673', 'f58f8a61-cb17-41f2-ae42-b53a905d0f75', '/products/anabya/golden-grace/02_49440065913065.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/LNF-41-GOLDEN.2_700x_3f0277e0-6551-4543-89dc-9054d4f9ad25.jpg?v=1781367223', 'Golden Grace - GulPash View 2', 2, false, 700, 1119)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('70fdb80a-8fbd-4e98-ab7e-997833a2661f', 'f58f8a61-cb17-41f2-ae42-b53a905d0f75', '/products/anabya/golden-grace/03_49440065945833.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/LNF-41-GOLDEN.8_700x_808dbfb8-1d41-42e4-837a-d19ff5baed1f.jpg?v=1781367223', 'Golden Grace - GulPash View 3', 3, false, 700, 984)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('3bc4ad43-bae9-480a-aa18-ce5c794e0290', 'f58f8a61-cb17-41f2-ae42-b53a905d0f75', '/products/anabya/golden-grace/04_49440065978601.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/LNF-41-GOLDEN.6_700x_16133b92-93f8-4aca-9c11-8234ab7bf906.jpg?v=1781367223', 'Golden Grace - GulPash View 4', 4, false, 700, 1052)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('cba6246e-1394-49d5-ac7c-ae2393fba405', 'f58f8a61-cb17-41f2-ae42-b53a905d0f75', '/products/anabya/golden-grace/05_49440066011369.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/LNF-41-GOLDEN.9_700x_cc69eb30-2310-452a-8e69-b5e61aac271f.jpg?v=1781367223', 'Golden Grace - GulPash View 5', 5, false, 700, 1054)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('34a490d6-27ea-452c-ac11-f1bb37f96197', 'f58f8a61-cb17-41f2-ae42-b53a905d0f75', '/products/anabya/golden-grace/06_49440066044137.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/LNF-41-GOLDEN.5_700x_81b5c97b-ddd0-4083-9b19-7ae28d46fcc5.jpg?v=1781367223', 'Golden Grace - GulPash View 6', 6, false, 700, 849)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('4900895a-8f82-4cc0-a430-cba08f3daeed', 'f58f8a61-cb17-41f2-ae42-b53a905d0f75', '/products/anabya/golden-grace/07_49440066076905.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/LNF-41-GOLDEN.3_700x-Copy.jpg?v=1781367223', 'Golden Grace - GulPash View 7', 7, false, 700, 1001)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('cf7129d0-fd17-48b2-a273-5be7b3bf53c0', '35a01cae-b1ea-4c90-a30c-e23b4ecee033', '/products/anabya/kaavya-emb-3pcs/01_49440069353705.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Vintage21stJuly-369_jpg_jpg.jpg?v=1781367236', 'Kaavya Emb 3pcs - GulPash View 1', 1, true, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('e8fa5d90-9cb1-488c-ade1-2a632d7f7a14', '35a01cae-b1ea-4c90-a30c-e23b4ecee033', '/products/anabya/kaavya-emb-3pcs/02_49440069386473.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Vintage21stJuly-396_jpg_jpg.jpg?v=1781367236', 'Kaavya Emb 3pcs - GulPash View 2', 2, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('7a6f1a18-d4eb-460b-a2f7-b5a44076347f', '35a01cae-b1ea-4c90-a30c-e23b4ecee033', '/products/anabya/kaavya-emb-3pcs/03_49440069419241.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Vintage21stJuly-447_jpg_jpg.jpg?v=1781367236', 'Kaavya Emb 3pcs - GulPash View 3', 3, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('01736fea-d67e-4291-afb8-89f39957e86a', '35a01cae-b1ea-4c90-a30c-e23b4ecee033', '/products/anabya/kaavya-emb-3pcs/04_49440069452009.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Vintage21stJuly-389_jpg_jpg.jpg?v=1781367236', 'Kaavya Emb 3pcs - GulPash View 4', 4, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('9050ba7d-8e1c-4412-a2b0-6f0f799dda97', '35a01cae-b1ea-4c90-a30c-e23b4ecee033', '/products/anabya/kaavya-emb-3pcs/05_49440069484777.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Vintage21stJuly-392_jpg_jpg.jpg?v=1781367236', 'Kaavya Emb 3pcs - GulPash View 5', 5, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('ec2b9b64-cf21-4037-a854-2eaa5703f5a8', '35a01cae-b1ea-4c90-a30c-e23b4ecee033', '/products/anabya/kaavya-emb-3pcs/06_49440069517545.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Vintage21stJuly-388_jpg_jpg.jpg?v=1781367237', 'Kaavya Emb 3pcs - GulPash View 6', 6, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('d080bb5e-19af-4140-ab6c-69e69e249a77', '35a01cae-b1ea-4c90-a30c-e23b4ecee033', '/products/anabya/kaavya-emb-3pcs/07_49440069550313.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Vintage21stJuly-444_jpg_jpg.jpg?v=1781367236', 'Kaavya Emb 3pcs - GulPash View 7', 7, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('98a187fe-ee7f-49cb-a4db-63a13c6ae016', '84c1092f-efa7-4e69-afe2-12ca7666fe26', '/products/anabya/lemon-blossom-3-piece/01_49440056377577.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_d4bcc5c1-d0c6-4e11-afab-3d022473a9f4.jpg?v=1781367195', 'Lemon Blossom 3-Piece - GulPash View 1', 1, true, 1080, 1350)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('4d6fef50-da76-457e-a590-38d180b11ff4', '84c1092f-efa7-4e69-afe2-12ca7666fe26', '/products/anabya/lemon-blossom-3-piece/02_49440056574185.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_c330ab06-3359-4995-8da6-e378aed1ade5.jpg?v=1781367195', 'Lemon Blossom 3-Piece - GulPash View 2', 2, false, 1080, 1350)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('ad829463-487c-4ba4-a4ea-420a2867ec5b', '84c1092f-efa7-4e69-afe2-12ca7666fe26', '/products/anabya/lemon-blossom-3-piece/03_49440056475881.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_dd945ef4-eb34-4e1d-9a2d-262168061d08.jpg?v=1781367195', 'Lemon Blossom 3-Piece - GulPash View 3', 3, false, 1080, 1350)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('897dec82-4a9a-4763-a6a0-ae8848d9fe58', '84c1092f-efa7-4e69-afe2-12ca7666fe26', '/products/anabya/lemon-blossom-3-piece/04_49440056410345.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_4e87552b-9c90-4cfe-969b-d0221300b0b6.jpg?v=1781367195', 'Lemon Blossom 3-Piece - GulPash View 4', 4, false, 1080, 1350)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('4eecf5a5-6629-4641-a04c-2cdb130208d1', '84c1092f-efa7-4e69-afe2-12ca7666fe26', '/products/anabya/lemon-blossom-3-piece/05_49440056508649.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_717f31cc-dcfa-409e-a1b3-ee1c4e30ae24.jpg?v=1781367195', 'Lemon Blossom 3-Piece - GulPash View 5', 5, false, 1080, 1350)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('ade6712c-3943-4c0d-ac9e-dae245615fa3', 'f8aa8eca-5946-4225-a9a8-bac867ad0f3b', '/products/anabya/meadow-grace-3-piece/01_49440047071465.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Vintage23rdDec-302_1.jpg?v=1781367159', 'Meadow Grace  3 Piece - GulPash View 1', 1, true, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('9eb41d98-413b-4ffb-a100-f2f31b149af7', 'f8aa8eca-5946-4225-a9a8-bac867ad0f3b', '/products/anabya/meadow-grace-3-piece/02_49440047202537.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Vintage23rdDec-397.jpg?v=1781367160', 'Meadow Grace  3 Piece - GulPash View 2', 2, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('51e9fe62-db23-4a66-a00e-ec0751b17c46', 'f8aa8eca-5946-4225-a9a8-bac867ad0f3b', '/products/anabya/meadow-grace-3-piece/03_49440047137001.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Vintage23rdDec-312.jpg?v=1781367159', 'Meadow Grace  3 Piece - GulPash View 3', 3, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('b5e6e915-7453-414b-aaa2-a53619b8e210', 'f8aa8eca-5946-4225-a9a8-bac867ad0f3b', '/products/anabya/meadow-grace-3-piece/04_49440047268073.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Vintage23rdDec-319.jpg?v=1781367159', 'Meadow Grace  3 Piece - GulPash View 4', 4, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('c06b244f-762f-49fa-a38b-02bca946c8bb', 'f8aa8eca-5946-4225-a9a8-bac867ad0f3b', '/products/anabya/meadow-grace-3-piece/05_49440047399145.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Vintage23rdDec-309.jpg?v=1781367161', 'Meadow Grace  3 Piece - GulPash View 5', 5, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('4aae97aa-3e42-4e34-af48-fef95432fff4', 'f8aa8eca-5946-4225-a9a8-bac867ad0f3b', '/products/anabya/meadow-grace-3-piece/06_49910324330729.png', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/44_to_45.png?v=1785787631', 'Meadow Grace  3 Piece - GulPash View 6', 6, false, 1536, 1024)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('2aaf4065-c34d-4d2a-a7ae-6aed7aac5a9f', 'c3d827b9-1a31-4228-a190-7a3da5a698af', '/products/anabya/mehndi-emb-3pc-stitched/01_49440051560681.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Mirana11thoct-1502_1000x_jpg.jpg?v=1781367177', 'Mehndi Emb 3Pc Stitched - GulPash View 1', 1, true, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('a31be780-6811-40e4-a291-79540ae80d72', 'c3d827b9-1a31-4228-a190-7a3da5a698af', '/products/anabya/mehndi-emb-3pc-stitched/02_49440051593449.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Mirana11thoct-1595_1000x_jpg.jpg?v=1781367177', 'Mehndi Emb 3Pc Stitched - GulPash View 2', 2, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('2879403f-4e5e-4668-a394-83462ea084c4', 'c3d827b9-1a31-4228-a190-7a3da5a698af', '/products/anabya/mehndi-emb-3pc-stitched/03_49440051626217.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Mirana11thoct-1518_1000x_jpg.jpg?v=1781367177', 'Mehndi Emb 3Pc Stitched - GulPash View 3', 3, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('fdfc9d47-6d2a-4ae3-a726-beafd49e246a', 'c3d827b9-1a31-4228-a190-7a3da5a698af', '/products/anabya/mehndi-emb-3pc-stitched/04_49440051658985.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Mirana11thoct-1774_1000x_jpg.jpg?v=1781367177', 'Mehndi Emb 3Pc Stitched - GulPash View 4', 4, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('4a0377a2-ca75-48e7-a8af-0f63318ffdea', 'c3d827b9-1a31-4228-a190-7a3da5a698af', '/products/anabya/mehndi-emb-3pc-stitched/05_49440051691753.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Mirana11thoct-1662_1000x_jpg.jpg?v=1781367177', 'Mehndi Emb 3Pc Stitched - GulPash View 5', 5, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('af8e1055-cad5-4ac2-a0e9-0c317411f625', 'c3d827b9-1a31-4228-a190-7a3da5a698af', '/products/anabya/mehndi-emb-3pc-stitched/06_49440051724521.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Mirana11thoct-1744_1000x_jpg.jpg?v=1781367177', 'Mehndi Emb 3Pc Stitched - GulPash View 6', 6, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('e6852f9b-4eb3-438c-affa-892fffb0dacd', 'c3d827b9-1a31-4228-a190-7a3da5a698af', '/products/anabya/mehndi-emb-3pc-stitched/07_49440051757289.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Mirana11thoct-1669_1000x_jpg.jpg?v=1781367177', 'Mehndi Emb 3Pc Stitched - GulPash View 7', 7, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('a0d89ed7-305f-49be-a306-49603e7aaa76', 'c3d827b9-1a31-4228-a190-7a3da5a698af', '/products/anabya/mehndi-emb-3pc-stitched/08_49440051790057.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Mirana11thoct-1720_1000x_jpg.jpg?v=1781367177', 'Mehndi Emb 3Pc Stitched - GulPash View 8', 8, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('04e0e25b-fcc2-4fb6-ac4e-0ae95a7daffd', 'c3d827b9-1a31-4228-a190-7a3da5a698af', '/products/anabya/mehndi-emb-3pc-stitched/09_49440051822825.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Mirana11thoct-1492_1000x_jpg.jpg?v=1781367177', 'Mehndi Emb 3Pc Stitched - GulPash View 9', 9, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('c109e742-21de-417f-af30-782d626fcc17', 'bce0772a-1255-47c8-afcd-5f578734316e', '/products/anabya/mulberry-bloom-3-piece/01_49800021836009.png', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_d87f91eb-8425-4b0d-9750-e92802088c63.png?v=1784743202', 'Mulberry Bloom 3 Piece - GulPash View 1', 1, true, 1166, 1349)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('29411139-d4f3-4876-a124-80e9c89348dc', 'bce0772a-1255-47c8-afcd-5f578734316e', '/products/anabya/mulberry-bloom-3-piece/02_49800021803241.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_75315d57-6fbd-43c3-ae3d-55f719c9f87b.jpg?v=1784743202', 'Mulberry Bloom 3 Piece - GulPash View 2', 2, false, 1920, 2400)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('07f72ac8-bebd-4043-a119-4589f758bc45', 'bce0772a-1255-47c8-afcd-5f578734316e', '/products/anabya/mulberry-bloom-3-piece/03_49800021868777.png', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_f0389816-6cb6-47f8-8664-fa47f6bd9aaf.png?v=1784743202', 'Mulberry Bloom 3 Piece - GulPash View 3', 3, false, 1166, 1349)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('38bd739d-0bb8-4520-a4f0-a99bd38e7a25', '9719080d-6d7f-4ad7-ac0d-75142e67ab13', '/products/anabya/multi-color-3pcs-embroidery/01_49440051233001.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/VDCPF25-Nisha-5.jpg?v=1781367175', 'Multi Color 3Pcs Embroidery - GulPash View 1', 1, true, 1080, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('75ea1997-528a-4b7a-ad73-7e56c3079a77', '9719080d-6d7f-4ad7-ac0d-75142e67ab13', '/products/anabya/multi-color-3pcs-embroidery/02_49440051265769.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/VDCPF25-Nisha-3.jpg?v=1781367175', 'Multi Color 3Pcs Embroidery - GulPash View 2', 2, false, 1080, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('065ea8d3-d99f-489d-ad05-04ff9857ce05', '9719080d-6d7f-4ad7-ac0d-75142e67ab13', '/products/anabya/multi-color-3pcs-embroidery/03_49440051298537.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/VDCPF25-Nisha-7.jpg?v=1781367176', 'Multi Color 3Pcs Embroidery - GulPash View 3', 3, false, 1080, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('7173e677-fa03-487b-a314-bd89f04a9d61', '9719080d-6d7f-4ad7-ac0d-75142e67ab13', '/products/anabya/multi-color-3pcs-embroidery/04_49440051331305.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/VDCPF25-Nisha-4_1.jpg?v=1781367175', 'Multi Color 3Pcs Embroidery - GulPash View 4', 4, false, 1080, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('c9033ae8-312c-424c-af91-819b50e9d073', '9719080d-6d7f-4ad7-ac0d-75142e67ab13', '/products/anabya/multi-color-3pcs-embroidery/05_49440051364073.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/VDCPF25-Nisha-1.jpg?v=1781367175', 'Multi Color 3Pcs Embroidery - GulPash View 5', 5, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('e2ee8f2f-06a0-4393-a860-92a6495bcb33', '47b17f35-a153-4561-a877-86519f825767', '/products/anabya/multi-color-black-3pcs/01_49440048906473.png', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Gemini_Generated_Image_8cxrw78cxrw78cxr.png?v=1781367166', 'Multi Color Black 3Pcs - GulPash View 1', 1, true, 864, 1184)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('045d9614-cc71-4a2f-a2a3-f52292dc5ac8', '47b17f35-a153-4561-a877-86519f825767', '/products/anabya/multi-color-black-3pcs/02_49440048939241.png', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Gemini_Generated_Image_mszo06mszo06mszo.png?v=1781367166', 'Multi Color Black 3Pcs - GulPash View 2', 2, false, 864, 1184)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('5e5e0703-dbe4-4c9c-afc4-2005b07c683c', '47b17f35-a153-4561-a877-86519f825767', '/products/anabya/multi-color-black-3pcs/03_49440048972009.png', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Gemini_Generated_Image_56vjvg56vjvg56vj.png?v=1781367166', 'Multi Color Black 3Pcs - GulPash View 3', 3, false, 864, 1184)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('90f12ad0-e0b8-463a-a158-2f1225207bc5', '47b17f35-a153-4561-a877-86519f825767', '/products/anabya/multi-color-black-3pcs/04_49440049004777.png', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Gemini_Generated_Image_8kacpl8kacpl8kac.png?v=1781367166', 'Multi Color Black 3Pcs - GulPash View 4', 4, false, 864, 1184)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('80187921-4d07-4757-a193-08985ef38cff', 'd4bd170b-03e7-476e-a108-8cfa2e96fbae', '/products/anabya/multi-flower-3-piece/01_49789236216041.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_012d5ecf-3430-4ac6-900c-61325c464d72.jpg?v=1784683175', 'Multi Flower 3 Piece - GulPash View 1', 1, true, 990, 1484)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('ab0eff19-4967-48dd-a6b9-8e876ca54c48', 'd4bd170b-03e7-476e-a108-8cfa2e96fbae', '/products/anabya/multi-flower-3-piece/02_49789201023209.png', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_7910bbc4-2015-40fe-b404-df042667d602.png?v=1784682635', 'Multi Flower 3 Piece - GulPash View 2', 2, false, 600, 840)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('e34e1685-a41c-493f-a3af-a989eedb2d56', 'd4bd170b-03e7-476e-a108-8cfa2e96fbae', '/products/anabya/multi-flower-3-piece/03_49440046940393.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/050A7016.jpg?v=1781367160', 'Multi Flower 3 Piece - GulPash View 3', 3, false, 3335, 5000)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('ad0aa746-cf3f-43ce-a12e-c92d6371efea', 'd4bd170b-03e7-476e-a108-8cfa2e96fbae', '/products/anabya/multi-flower-3-piece/04_49789200990441.png', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_36ab2c20-ed0f-413b-95fe-2102e75f1c9b.png?v=1784682635', 'Multi Flower 3 Piece - GulPash View 4', 4, false, 600, 840)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('14c0c349-21ba-4125-a0c8-7aadd7403dc2', 'd4bd170b-03e7-476e-a108-8cfa2e96fbae', '/products/anabya/multi-flower-3-piece/05_49440046973161.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/050A7018.jpg?v=1781367159', 'Multi Flower 3 Piece - GulPash View 5', 5, false, 3335, 5000)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('ffad05e0-51ef-4661-a137-b387e1115e6a', 'd4bd170b-03e7-476e-a108-8cfa2e96fbae', '/products/anabya/multi-flower-3-piece/06_49789236183273.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_5256378a-b000-4668-91cb-fd26002db97b.jpg?v=1784683175', 'Multi Flower 3 Piece - GulPash View 6', 6, false, 990, 1484)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('777279f4-a79d-4988-af06-1af713d01cc3', 'd4bd170b-03e7-476e-a108-8cfa2e96fbae', '/products/anabya/multi-flower-3-piece/07_49440047005929.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/050A7050.jpg?v=1781367159', 'Multi Flower 3 Piece - GulPash View 7', 7, false, 3335, 5000)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('fcf07db2-9caa-425b-ae02-98725e9fdb81', 'd4bd170b-03e7-476e-a108-8cfa2e96fbae', '/products/anabya/multi-flower-3-piece/08_49789201055977.png', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_d27fa215-e8a3-4590-b1f0-dd6a5261f19f.png?v=1784682635', 'Multi Flower 3 Piece - GulPash View 8', 8, false, 600, 840)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('b047c182-4911-4e46-ad20-440c21281dda', '3bc17692-61c5-4dcd-a738-d23fd7409f94', '/products/anabya/aria-stitched-3pc/01_49440053526761.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/IMG_3341.jpg?v=1781367184', 'NEW AYRA 3PCS - GulPash View 1', 1, true, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('c2e7dd7a-b7dc-4f24-a253-a4a4a745a43b', '3bc17692-61c5-4dcd-a738-d23fd7409f94', '/products/anabya/aria-stitched-3pc/02_49440053559529.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/IMG_3338.jpg?v=1781367184', 'NEW AYRA 3PCS - GulPash View 2', 2, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('d1025020-cb5e-404c-aed5-f1a87a425f15', '3bc17692-61c5-4dcd-a738-d23fd7409f94', '/products/anabya/aria-stitched-3pc/03_49440053592297.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/IMG_3329.jpg?v=1781367184', 'NEW AYRA 3PCS - GulPash View 3', 3, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('01415db0-ed17-48a0-ab36-f04c4951a50c', '3bc17692-61c5-4dcd-a738-d23fd7409f94', '/products/anabya/aria-stitched-3pc/04_49440053625065.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/IMG_3339.jpg?v=1781367184', 'NEW AYRA 3PCS - GulPash View 4', 4, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('f7ae48c5-e735-49b3-a840-a68c4884a43f', '3bc17692-61c5-4dcd-a738-d23fd7409f94', '/products/anabya/aria-stitched-3pc/05_49440053657833.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/IMG_3333.jpg?v=1781367184', 'NEW AYRA 3PCS - GulPash View 5', 5, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('a5c4866f-5894-4f4f-a063-d0e1893f08ee', '3bc17692-61c5-4dcd-a738-d23fd7409f94', '/products/anabya/aria-stitched-3pc/06_49440053690601.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/IMG_3340.jpg?v=1781367184', 'NEW AYRA 3PCS - GulPash View 6', 6, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('0e0c2f19-4fa5-4351-a54f-0906daf4b5c6', '3bc17692-61c5-4dcd-a738-d23fd7409f94', '/products/anabya/aria-stitched-3pc/07_49440053723369.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/IMG_3342.jpg?v=1781367184', 'NEW AYRA 3PCS - GulPash View 7', 7, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('575fbfab-1b85-457f-aff0-491775ccfa80', '3bc17692-61c5-4dcd-a738-d23fd7409f94', '/products/anabya/aria-stitched-3pc/08_49440053756137.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/IMG_3335.jpg?v=1781367184', 'NEW AYRA 3PCS - GulPash View 8', 8, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('54b8c143-7310-4a97-a7c3-3085fb3452fc', '3bc17692-61c5-4dcd-a738-d23fd7409f94', '/products/anabya/aria-stitched-3pc/09_49440053788905.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/IMG_3336.jpg?v=1781367184', 'NEW AYRA 3PCS - GulPash View 9', 9, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('2ef3741f-f99d-4961-a6c0-a1afe0372455', '3bc17692-61c5-4dcd-a738-d23fd7409f94', '/products/anabya/aria-stitched-3pc/10_49440053821673.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/IMG_3334.jpg?v=1781367184', 'NEW AYRA 3PCS - GulPash View 10', 10, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('bebd5a0f-06d7-4de0-a174-c863d031fe33', '3bc17692-61c5-4dcd-a738-d23fd7409f94', '/products/anabya/aria-stitched-3pc/11_49440053854441.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/IMG_3331.jpg?v=1781367184', 'NEW AYRA 3PCS - GulPash View 11', 11, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('67e70fa6-bcd5-4132-a0b3-237172885cec', '8a3aeb94-1fa8-43ff-a032-acc5cbd5c630', '/products/anabya/brownish-3pc/01_49440052642025.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/IMG-7792.jpg?v=1781367182', 'NEW BROWNIE - GulPash View 1', 1, true, 1080, 1440)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('2db107c9-7c46-43d1-a1f4-1ccdf91da944', '8a3aeb94-1fa8-43ff-a032-acc5cbd5c630', '/products/anabya/brownish-3pc/02_49440052674793.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/IMG-7790.jpg?v=1781367183', 'NEW BROWNIE - GulPash View 2', 2, false, 1080, 1440)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('9a39e042-5dde-42f2-a361-6ccdc1d52a72', '8a3aeb94-1fa8-43ff-a032-acc5cbd5c630', '/products/anabya/brownish-3pc/03_49440052707561.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/IMG-7789.jpg?v=1781367182', 'NEW BROWNIE - GulPash View 3', 3, false, 1080, 1440)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('4ec7b2af-e5ff-45bf-aeaa-4cc80b97741c', '8a3aeb94-1fa8-43ff-a032-acc5cbd5c630', '/products/anabya/brownish-3pc/04_49440052740329.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/IMG-7791.jpg?v=1781367182', 'NEW BROWNIE - GulPash View 4', 4, false, 1080, 1440)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('1fc365f4-de0c-49c9-a6ae-be485fb4e8ef', '8a3aeb94-1fa8-43ff-a032-acc5cbd5c630', '/products/anabya/brownish-3pc/05_49440052773097.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/IMG-7793.jpg?v=1781367182', 'NEW BROWNIE - GulPash View 5', 5, false, 1080, 1440)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('2689890e-9a96-4da9-a256-549a3b9f07f9', '8a3aeb94-1fa8-43ff-a032-acc5cbd5c630', '/products/anabya/brownish-3pc/06_49440052805865.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/IMG-7794.jpg?v=1781367182', 'NEW BROWNIE - GulPash View 6', 6, false, 1080, 1440)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('6e9a8842-c1ca-49c2-a23e-08e29f653cb2', 'a5686492-80b5-4882-ab9f-8555bdfea101', '/products/anabya/noor-e-naz-luxury-3-piece/01_49440045859049.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Untitled-1_0093_DSC03008.jpg?v=1781367152', 'Noor e Naz Luxury 3 Piece - GulPash View 1', 1, true, 1200, 1800)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('30ec8ca2-4cec-4dc3-a87a-85ee63119624', 'a5686492-80b5-4882-ab9f-8555bdfea101', '/products/anabya/noor-e-naz-luxury-3-piece/02_49440045760745.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Untitled-1_0097_DSC02955.jpg?v=1781367152', 'Noor e Naz Luxury 3 Piece - GulPash View 2', 2, false, 1200, 1800)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('621b6718-469b-4159-ac08-d5739b4c0e8a', 'a5686492-80b5-4882-ab9f-8555bdfea101', '/products/anabya/noor-e-naz-luxury-3-piece/03_49440045793513.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Untitled-1_0094_DSC02995.jpg?v=1781367153', 'Noor e Naz Luxury 3 Piece - GulPash View 3', 3, false, 1200, 1800)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('49fc906c-aa7a-491d-a657-dd9e6b884440', 'a5686492-80b5-4882-ab9f-8555bdfea101', '/products/anabya/noor-e-naz-luxury-3-piece/04_49440045826281.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Untitled-1_0096_DSC02958.jpg?v=1781367153', 'Noor e Naz Luxury 3 Piece - GulPash View 4', 4, false, 1200, 1800)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('0be8161b-2ceb-4ee7-a7bb-a86d62092189', 'b1821be2-41c0-4224-a274-9d52826fe528', '/products/anabya/noor-e-zard-3-piece/01_49800021770473.png', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_c8d89edc-9df3-4010-9ea3-7a3f57e1d46a.png?v=1784743202', 'Noor e Zard 3 Piece - GulPash View 1', 1, true, 990, 1386)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('91c64516-2fbe-446e-aa3e-1e26b0033e4c', 'b1821be2-41c0-4224-a274-9d52826fe528', '/products/anabya/noor-e-zard-3-piece/02_49800021737705.png', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_413fb9d5-3339-4f5c-a9e0-0dd655fb8772.png?v=1784743203', 'Noor e Zard 3 Piece - GulPash View 2', 2, false, 990, 1401)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('40b58cfb-8f42-4159-ace2-8d1af879be14', 'b1821be2-41c0-4224-a274-9d52826fe528', '/products/anabya/noor-e-zard-3-piece/03_49800021704937.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_8f44e8d4-d993-4b59-a577-e9a6e67fe45a.jpg?v=1784743201', 'Noor e Zard 3 Piece - GulPash View 3', 3, false, 720, 1005)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('518a14b2-19ee-4f75-aaee-8f9695c04837', '2983d9d1-edad-45f6-a4df-dcf2f37cfd92', '/products/anabya/parisa-3pcs/01_49440045334761.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Ava_5__jpg.jpg?v=1781367151', 'Parisa 3Pcs - GulPash View 1', 1, true, 2048, 2560)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('178bb7e1-9748-4283-a531-abf6a81bacc2', '2983d9d1-edad-45f6-a4df-dcf2f37cfd92', '/products/anabya/parisa-3pcs/02_49440045367529.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Ava_6__jpg.jpg?v=1781367151', 'Parisa 3Pcs - GulPash View 2', 2, false, 2048, 2560)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('2065dddb-08d2-4c81-ae52-dcec5e8f314f', '2983d9d1-edad-45f6-a4df-dcf2f37cfd92', '/products/anabya/parisa-3pcs/03_49440045400297.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Ava_3__jpg.jpg?v=1781367151', 'Parisa 3Pcs - GulPash View 3', 3, false, 2048, 2560)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('d685f211-197d-4ccf-a0ea-ae1fd5cd4afb', '2983d9d1-edad-45f6-a4df-dcf2f37cfd92', '/products/anabya/parisa-3pcs/04_49440045433065.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Ava_1__jpg_1.jpg?v=1781367151', 'Parisa 3Pcs - GulPash View 4', 4, false, 1646, 2058)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('ea59456f-4c89-4f02-a494-5d41c1e7c4b2', '2983d9d1-edad-45f6-a4df-dcf2f37cfd92', '/products/anabya/parisa-3pcs/05_49440045465833.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Ava_4__jpg_1.jpg?v=1781367151', 'Parisa 3Pcs - GulPash View 5', 5, false, 1646, 2058)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('52e1de5f-cfe8-48ac-af65-41cc55b0c80c', '2983d9d1-edad-45f6-a4df-dcf2f37cfd92', '/products/anabya/parisa-3pcs/06_49440045498601.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Ava_4__jpg.jpg?v=1781367151', 'Parisa 3Pcs - GulPash View 6', 6, false, 2048, 2560)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('92871d1b-abdf-45c1-a94b-64d9e30afd9b', '2983d9d1-edad-45f6-a4df-dcf2f37cfd92', '/products/anabya/parisa-3pcs/07_49440045531369.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Ava_2__jpg.jpg?v=1781367151', 'Parisa 3Pcs - GulPash View 7', 7, false, 2048, 2560)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('4a9c579f-4201-48a1-ad51-c248165beb1f', 'acf9bbd7-3cb3-4632-ad2b-59e3ee7489dd', '/products/anabya/pink-hearts-3-piece/01_49788894970089.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_48c32053-f75a-4c9b-b059-e4eeca078cd5.jpg?v=1784679426', 'Pink Hearts 3 Piece - GulPash View 1', 1, true, 3328, 4160)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('7fcd3676-4a91-460f-a29b-248c940f6f4c', 'acf9bbd7-3cb3-4632-ad2b-59e3ee7489dd', '/products/anabya/pink-hearts-3-piece/02_49788894937321.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_d0c294d2-0c16-416e-8c47-412cda57deee.jpg?v=1784679426', 'Pink Hearts 3 Piece - GulPash View 2', 2, false, 3328, 4160)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('0bd41ddd-e6e0-43c5-a7b9-5e4fb496e76e', 'acf9bbd7-3cb3-4632-ad2b-59e3ee7489dd', '/products/anabya/pink-hearts-3-piece/03_49788894871785.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_2f119bfe-f337-43dc-99d7-99456037fb15.jpg?v=1784679426', 'Pink Hearts 3 Piece - GulPash View 3', 3, false, 2778, 4160)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('b9fe5f3d-60a9-4c02-a095-eb5af7bba0da', 'acf9bbd7-3cb3-4632-ad2b-59e3ee7489dd', '/products/anabya/pink-hearts-3-piece/04_49788894904553.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_1b649b81-9acc-43ea-9c65-2db4b79d4e46.jpg?v=1784679426', 'Pink Hearts 3 Piece - GulPash View 4', 4, false, 3328, 4160)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('7a3e96e8-1b2d-45ae-a714-4b98517e648b', 'e8e3b097-8c56-46d9-a63f-fd7eb93b1ae7', '/products/anabya/pistachio-3pcs/01_49440051986665.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Mirana18JULY-84.jpg?v=1781367179', 'pistiana 3pcs - GulPash View 1', 1, true, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('2512e6dc-6d30-447a-a6ea-8cdd7b7cca43', 'e8e3b097-8c56-46d9-a63f-fd7eb93b1ae7', '/products/anabya/pistachio-3pcs/02_49440052019433.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Mirana18JULY-15_1000x_4ce3d155-51c7-45e2-afc4-6ea05987bd5d.jpg?v=1781367179', 'pistiana 3pcs - GulPash View 2', 2, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('0c7b542b-1f86-4b1b-ae0a-a5dbdc3c236d', 'e8e3b097-8c56-46d9-a63f-fd7eb93b1ae7', '/products/anabya/pistachio-3pcs/03_49440052052201.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Mirana18JULY-178_1000x_8cc25409-700b-4f3e-9f2d-d869d4162e80.jpg?v=1781367179', 'pistiana 3pcs - GulPash View 3', 3, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('85d89769-16e4-4f17-a16d-8ded58f3e44e', 'e8e3b097-8c56-46d9-a63f-fd7eb93b1ae7', '/products/anabya/pistachio-3pcs/04_49440052084969.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Mirana18JULY-58_1000x_ded126c7-d829-41fc-af06-c2aa190fb26c.jpg?v=1781367179', 'pistiana 3pcs - GulPash View 4', 4, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('6fe8cd78-597e-487e-a0e6-fbf5638d1a5e', 'e8e3b097-8c56-46d9-a63f-fd7eb93b1ae7', '/products/anabya/pistachio-3pcs/05_49440052117737.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Mirana18JULY-56_1000x_8accbfac-8c59-4c2a-9993-80582afb3ce2.jpg?v=1781367179', 'pistiana 3pcs - GulPash View 5', 5, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('6064a409-b42d-43e0-a2c5-fbcdbb644726', 'e8e3b097-8c56-46d9-a63f-fd7eb93b1ae7', '/products/anabya/pistachio-3pcs/06_49440052150505.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Mirana18JULY-28_1000x_d32003ec-8a9e-4d1d-91ee-0cb2e0f2502d.jpg?v=1781367179', 'pistiana 3pcs - GulPash View 6', 6, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('93f3532f-dd4a-4f70-aa07-f63071d76145', 'e8e3b097-8c56-46d9-a63f-fd7eb93b1ae7', '/products/anabya/pistachio-3pcs/07_49440052183273.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Mirana18JULY-68_1000x_eec262c1-0822-4846-bd09-981dbcff8b53.jpg?v=1781367179', 'pistiana 3pcs - GulPash View 7', 7, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('20ca5856-5b6b-49e1-ab81-ab38c1cb40db', 'e8e3b097-8c56-46d9-a63f-fd7eb93b1ae7', '/products/anabya/pistachio-3pcs/08_49440052216041.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Mirana18JULY-129_1000x_6975ee35-d3bd-45dd-a269-267697706ac5.jpg?v=1781367179', 'pistiana 3pcs - GulPash View 8', 8, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('986a602b-ee9b-4e11-a804-9b041fe2c77e', 'e8e3b097-8c56-46d9-a63f-fd7eb93b1ae7', '/products/anabya/pistachio-3pcs/09_49440052248809.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Mirana18JULY-119_1000x_c267e010-a354-41ae-9710-f0ca3e902b6f.jpg?v=1781367179', 'pistiana 3pcs - GulPash View 9', 9, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('dbc0e3c4-04fb-4281-a27f-843c0eeb39dd', 'e8e3b097-8c56-46d9-a63f-fd7eb93b1ae7', '/products/anabya/pistachio-3pcs/10_49440052281577.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Mirana18JULY-158_1000x_443e10db-ab88-488f-aaeb-23562cb1fa71.jpg?v=1781367179', 'pistiana 3pcs - GulPash View 10', 10, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('edf6051b-f33a-48cc-aae3-443d28e67ca9', 'a106adfd-c20f-479b-abb3-eb18d5c3aeb4', '/products/anabya/plum-3-piece/01_49847788830953.png', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_cec1640b-2251-44f5-abff-5ef613124c18.png?v=1785272666', 'Plum 3Piece - GulPash View 1', 1, true, 1024, 1536)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('e28f9ca3-5301-4de6-a5c2-cca17728ea61', 'a106adfd-c20f-479b-abb3-eb18d5c3aeb4', '/products/anabya/plum-3-piece/02_49847788929257.png', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_014580d3-bd91-44e3-8253-c708cc7ae9ea.png?v=1785272666', 'Plum 3Piece - GulPash View 2', 2, false, 1024, 1536)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('c449607e-d476-471c-abbe-658d98a06683', 'a106adfd-c20f-479b-abb3-eb18d5c3aeb4', '/products/anabya/plum-3-piece/03_49847788863721.png', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_70fef877-b5df-42c1-ac9b-2348d9852739.png?v=1785272666', 'Plum 3Piece - GulPash View 3', 3, false, 1024, 1536)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('ca343005-694d-40e6-a232-40cbffd34a1e', 'a106adfd-c20f-479b-abb3-eb18d5c3aeb4', '/products/anabya/plum-3-piece/04_49847788896489.png', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_d3126a48-8492-45d9-93c6-7c7d04e4ece1.png?v=1785272666', 'Plum 3Piece - GulPash View 4', 4, false, 1024, 1536)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('97790477-e113-4277-a461-498c8468f66d', 'a106adfd-c20f-479b-abb3-eb18d5c3aeb4', '/products/anabya/plum-3-piece/05_49847788962025.png', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_350734c3-c789-472f-a101-663878a8ea8f.png?v=1785272666', 'Plum 3Piece - GulPash View 5', 5, false, 1024, 1536)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('1cdca326-54af-4ccb-a5bc-e303686b4e1b', 'a106adfd-c20f-479b-abb3-eb18d5c3aeb4', '/products/anabya/plum-3-piece/06_49871019507945.png', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/612c9a1b-2ff8-45b2-a2bd-c5247a6c5670_cf12ef96-207e-46d9-8c42-fd3fe6070b57.png?v=1785478470', 'Plum 3Piece - GulPash View 6', 6, false, 2091, 281)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('7a611266-b290-46d2-ad09-47a7c4345c69', 'd495c75e-871c-41a0-a90b-b42c127fafe2', '/products/anabya/raniya-3-piece/01_49788894839017.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_5d4c42f9-505f-45d3-957e-0e5ade3063b9.jpg?v=1784679425', 'Raniya 3 Piece - GulPash View 1', 1, true, 960, 1439)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('b87f3000-6b6f-418f-af9f-8526593dabb1', 'd495c75e-871c-41a0-a90b-b42c127fafe2', '/products/anabya/raniya-3-piece/02_49788894806249.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_56ab00cd-8f8e-4acd-8f28-18a17a5471fb.jpg?v=1784679426', 'Raniya 3 Piece - GulPash View 2', 2, false, 990, 1485)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('8033dae7-d5b6-4ac7-a559-3e4fbec43f99', 'd495c75e-871c-41a0-a90b-b42c127fafe2', '/products/anabya/raniya-3-piece/03_49788894773481.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_0f36c5c9-1fb7-4e5c-9f65-700ee42fa1dc.jpg?v=1784679425', 'Raniya 3 Piece - GulPash View 3', 3, false, 990, 1485)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('473d0c2b-45de-44ed-a59f-3f9718563607', 'f2519c85-f4a5-4cf4-a11c-794648156d7b', '/products/anabya/camel-brown-linen-3-piece/01_49440046678249.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Thefirstofmany_simpleyetmodern-amusthaveforyouriftaarevents_Staytunedforthela_3.jpg?v=1781367158', 'Rina - GulPash View 1', 1, true, 1080, 1440)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('9a26386d-d62c-4760-a001-f3110b058030', 'f2519c85-f4a5-4cf4-a11c-794648156d7b', '/products/anabya/camel-brown-linen-3-piece/02_49440046711017.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Thefirstofmany_simpleyetmodern-amusthaveforyouriftaarevents_Staytunedforthela_2.jpg?v=1781367158', 'Rina - GulPash View 2', 2, false, 1080, 1440)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('509d1a79-1e96-46e4-a27c-89baf87d0703', 'f2519c85-f4a5-4cf4-a11c-794648156d7b', '/products/anabya/camel-brown-linen-3-piece/03_49440046743785.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Thefirstofmany_simpleyetmodern-amusthaveforyouriftaarevents_Staytunedforthela_1.jpg?v=1781367158', 'Rina - GulPash View 3', 3, false, 1080, 1440)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('7c775108-e0e1-4c3e-a226-95901de11a1a', 'f2519c85-f4a5-4cf4-a11c-794648156d7b', '/products/anabya/camel-brown-linen-3-piece/04_49440046776553.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/Thefirstofmany_simpleyetmodern-amusthaveforyouriftaarevents_Staytunedforthela.jpg?v=1781367158', 'Rina - GulPash View 4', 4, false, 1080, 1440)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('895b2b1d-65fd-4aff-a165-dbf44e61ba4c', '61788cda-7961-4418-ab58-e7f555198e38', '/products/anabya/ruby-grace-3-piece/01_49788861677801.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_f2efe5b2-0a94-47d4-ae89-eaa7339ffcda.jpg?v=1784679047', 'Ruby Grace 3 Piece - GulPash View 1', 1, true, 990, 1320)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('8e87eb0b-2137-4837-a1ed-ba59aa09b857', '61788cda-7961-4418-ab58-e7f555198e38', '/products/anabya/ruby-grace-3-piece/02_49788861645033.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_94da90bc-4367-4f24-ab4f-9fb2b7ce327d.jpg?v=1784679046', 'Ruby Grace 3 Piece - GulPash View 2', 2, false, 990, 1320)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('a85dba75-589f-4f32-a1eb-c97942efff36', '61788cda-7961-4418-ab58-e7f555198e38', '/products/anabya/ruby-grace-3-piece/03_49788861612265.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_ef6c45f1-0f0d-48a4-b90b-761f674723d2.jpg?v=1784679047', 'Ruby Grace 3 Piece - GulPash View 3', 3, false, 990, 1320)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('46500b70-c6e2-49b4-aff9-616de62ff7ad', '61788cda-7961-4418-ab58-e7f555198e38', '/products/anabya/ruby-grace-3-piece/04_49788861579497.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_762ffccd-c5d8-478f-9ed0-11922c6678bc.jpg?v=1784679047', 'Ruby Grace 3 Piece - GulPash View 4', 4, false, 990, 1320)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('0ef78a6a-d943-41aa-a1ac-fffe666dea3d', '1c889dbe-c013-435f-ac8f-d389b30da10c', '/products/anabya/rumi-3-piece/01_49789074440425.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_da659997-94ea-435e-ac31-871487b5315d.jpg?v=1784681142', 'Rumi 3 Piece - GulPash View 1', 1, true, 990, 1276)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('6f6a1ce6-0d76-4a0d-a4d0-8528c4b31d25', '1c889dbe-c013-435f-ac8f-d389b30da10c', '/products/anabya/rumi-3-piece/02_49789074407657.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_b8150ad6-b5fc-4f39-906a-981b7a1acc7e.jpg?v=1784681142', 'Rumi 3 Piece - GulPash View 2', 2, false, 990, 1483)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('9d1a3920-ef55-4c1d-a21b-a0c254a5ccdc', '90efbae5-0c2e-4c30-aa93-81673709675e', '/products/anabya/sapphire-bloom-3-piece/01_49872616259817.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/An8HLjVLcbaUY8H19T7lzdxxv3tofQleHopRma8kJkQc2HwzSdXWFW3Avj4dke78OtLEpiTumDsnYJcWz-GyhHM0YI3LV32S4xGSecnXAYJxWW862iY8_N2FclpQFyz0clrjL1kAHfd7YqiVUm2tiffQpVLAyzBb-0Ji93INRIRGQoO7YKMyRzp.jpg?v=1785488377', 'Sapphire Bloom 3 Piece - GulPash View 1', 1, true, 1024, 1024)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('2c4d32be-2fa5-4a31-aacb-97f450413ed2', '90efbae5-0c2e-4c30-aa93-81673709675e', '/products/anabya/sapphire-bloom-3-piece/02_49788531736809.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_d7041a42-cb1a-489c-b83b-d8e381ebc768.jpg?v=1784674844', 'Sapphire Bloom 3 Piece - GulPash View 2', 2, false, 990, 1485)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('2f97d2a1-2de3-452b-a13b-d5d427af6bab', '90efbae5-0c2e-4c30-aa93-81673709675e', '/products/anabya/sapphire-bloom-3-piece/03_49788531769577.png', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_6c5637ae-713c-4083-b773-7402ac7895f0.png?v=1784674844', 'Sapphire Bloom 3 Piece - GulPash View 3', 3, false, 990, 1485)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('169ee70d-78ab-4bdf-ac18-798126b33235', '90efbae5-0c2e-4c30-aa93-81673709675e', '/products/anabya/sapphire-bloom-3-piece/04_49788531704041.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_ab576546-e569-4472-8ec7-209f857a7463.jpg?v=1784674844', 'Sapphire Bloom 3 Piece - GulPash View 4', 4, false, 990, 1485)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('0e69eaf6-42b1-4230-a407-5d3c05a8e3b2', '90efbae5-0c2e-4c30-aa93-81673709675e', '/products/anabya/sapphire-bloom-3-piece/05_49788531671273.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_8e31065d-8099-4005-817a-025114398b42.jpg?v=1784674844', 'Sapphire Bloom 3 Piece - GulPash View 5', 5, false, 990, 1485)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('5c219861-d358-4596-a1a8-d9fbc27fd51d', '90efbae5-0c2e-4c30-aa93-81673709675e', '/products/anabya/sapphire-bloom-3-piece/06_49872616194281.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/An-tPixgm9L8c2pNeTlN2VJO24bBHYsA-JrEDSpp-0hABsZHSdLfCByDKmRF9y9zzU6bGG_b9lXTOT4TX2FSPcOxNz1y_zpWa0_j0xyROpTXT4etrZ3-tWyQU7_WHo2reS6E6xUjqT4EKI7-T3e41S1ThvSrrCGnKrgGLQu-HV2rYiKKEwet3k2.jpg?v=1785488376', 'Sapphire Bloom 3 Piece - GulPash View 6', 6, false, 1024, 1024)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('e6733f2a-6851-4181-a6ce-581698dff9d2', '178198e7-3604-4651-a64c-cec8aa722608', '/products/anabya/sophie-3pcs/01_49440047988969.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/eidshoot_s_z_a_-3027_jpg.jpg?v=1781367163', 'Sophie 3Pcs - GulPash View 1', 1, true, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('0902d135-b42e-44eb-a1b5-155618c12833', '178198e7-3604-4651-a64c-cec8aa722608', '/products/anabya/sophie-3pcs/02_49440048021737.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/eidshoot_s_z_a_-3029_04080fe4-d479-4d05-8c1e-fa82aaaefe11_jpg.jpg?v=1781367162', 'Sophie 3Pcs - GulPash View 2', 2, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('6c6f4be9-bf7f-4835-a0ca-7f23353fcd48', '178198e7-3604-4651-a64c-cec8aa722608', '/products/anabya/sophie-3pcs/03_49440048054505.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/eidshoot_s_z_a_-3017_jpg.jpg?v=1781367163', 'Sophie 3Pcs - GulPash View 3', 3, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('53322519-53a9-4431-a36e-e33e97a98047', '178198e7-3604-4651-a64c-cec8aa722608', '/products/anabya/sophie-3pcs/04_49440048087273.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/eidshoot_s_z_a_-3035_jpg.jpg?v=1781367162', 'Sophie 3Pcs - GulPash View 4', 4, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('d6817626-1b7b-4369-a4b5-1636d8cc4abd', '178198e7-3604-4651-a64c-cec8aa722608', '/products/anabya/sophie-3pcs/05_49440048120041.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/eidshoot_s_z_a_-3035.jpg_1.jpg?v=1781367162', 'Sophie 3Pcs - GulPash View 5', 5, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('38b38fda-2cc0-4731-a9b1-a3e6c47bbcbf', '178198e7-3604-4651-a64c-cec8aa722608', '/products/anabya/sophie-3pcs/06_49440048152809.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/eidshoot_s_z_a_-3046_jpg.jpg?v=1781367162', 'Sophie 3Pcs - GulPash View 6', 6, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('0bb3f165-1f70-4baf-a777-68e5a7f6c23e', '178198e7-3604-4651-a64c-cec8aa722608', '/products/anabya/sophie-3pcs/07_49440048185577.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/eidshoot_s_z_a_-3058_jpg.jpg?v=1781367163', 'Sophie 3Pcs - GulPash View 7', 7, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('f88edfb9-1376-4d02-abfd-174d40d96b01', '04e321ea-b08c-4f98-a96b-837c37aa8271', '/products/anabya/summer-sale-sweet-3piece/01_49856827687145.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_45a44956-1b08-4450-9be5-67c052e84efc.jpg?v=1785342917', 'SUMMER SALE | Sweet 3Piece - GulPash View 1', 1, true, 990, 1211)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('34a60f50-aefe-48eb-a7c6-1ee9104a8e7c', '04e321ea-b08c-4f98-a96b-837c37aa8271', '/products/anabya/summer-sale-sweet-3piece/02_49856827719913.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_313b233f-0a39-42d1-a211-1f002d29f933.jpg?v=1785342917', 'SUMMER SALE | Sweet 3Piece - GulPash View 2', 2, false, 990, 1483)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('3eab550a-0538-42fd-ae2a-fe9279ef6d53', '04e321ea-b08c-4f98-a96b-837c37aa8271', '/products/anabya/summer-sale-sweet-3piece/03_49856827752681.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_38a256c0-924d-46da-8095-390959117391.jpg?v=1785342917', 'SUMMER SALE | Sweet 3Piece - GulPash View 3', 3, false, 990, 1483)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('a94884a2-eb66-4d60-a9b0-cc68df4fa1b6', '04e321ea-b08c-4f98-a96b-837c37aa8271', '/products/anabya/summer-sale-sweet-3piece/04_49856827785449.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_bffc5a03-48aa-4604-9d3d-19b5fd838bb3.jpg?v=1785342917', 'SUMMER SALE | Sweet 3Piece - GulPash View 4', 4, false, 990, 1483)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('e451bdca-1494-48d4-adec-18947443cdc7', 'ed6de3eb-39f5-477a-aecf-f1f0bec901fe', '/products/anabya/sunehri-3-piece/01_49807210905833.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_2464a6e2-8a9a-422c-9cda-21adbf389488.jpg?v=1784829995', 'Sunehri 3 Piece - GulPash View 1', 1, true, 990, 1320)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('f17ea166-8801-44ab-a0b0-788091bb222c', 'ed6de3eb-39f5-477a-aecf-f1f0bec901fe', '/products/anabya/sunehri-3-piece/02_49807210807529.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_ef0d5c18-23fc-4bdf-89ac-62277088459f.jpg?v=1784829995', 'Sunehri 3 Piece - GulPash View 2', 2, false, 990, 1320)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('a4a709d7-d920-4ee4-a4ad-3274ed71ca31', 'ed6de3eb-39f5-477a-aecf-f1f0bec901fe', '/products/anabya/sunehri-3-piece/03_49807210840297.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_1d265abd-f481-4f89-8467-1a2079104638.jpg?v=1784829995', 'Sunehri 3 Piece - GulPash View 3', 3, false, 990, 1320)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('cf339786-fe2e-436a-aa4a-0df6a58de453', 'ed6de3eb-39f5-477a-aecf-f1f0bec901fe', '/products/anabya/sunehri-3-piece/04_49807210873065.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_37171690-287b-4081-99da-8bbf8c6fe359.jpg?v=1784829995', 'Sunehri 3 Piece - GulPash View 4', 4, false, 990, 1320)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('86be7568-8456-4638-aa11-e37f967e8645', '309b83cc-3af3-491e-a218-b07e73681f26', '/products/anabya/zaarif-cotton-3-pc-emb/01_49440046285033.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/DSC07527_jpg.jpg?v=1781367155', 'ZAARIF - COTTON 2 PC EMB - GulPash View 1', 1, true, 1920, 2880)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('87767bbf-77c6-4ff4-ab50-62714b612a3a', '309b83cc-3af3-491e-a218-b07e73681f26', '/products/anabya/zaarif-cotton-3-pc-emb/02_49440046317801.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/DSC07646.jpg?v=1781367155', 'ZAARIF - COTTON 2 PC EMB - GulPash View 2', 2, false, 1920, 2880)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('f25b437e-1278-42f1-a8ec-03f216bc6385', '309b83cc-3af3-491e-a218-b07e73681f26', '/products/anabya/zaarif-cotton-3-pc-emb/03_49440046350569.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/DSC07607.jpg?v=1781367155', 'ZAARIF - COTTON 2 PC EMB - GulPash View 3', 3, false, 1920, 2880)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('31556e36-56d4-4374-a7fc-e612ff1c560c', '309b83cc-3af3-491e-a218-b07e73681f26', '/products/anabya/zaarif-cotton-3-pc-emb/04_49440046383337.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/DSC07586.jpg?v=1781367155', 'ZAARIF - COTTON 2 PC EMB - GulPash View 4', 4, false, 1920, 2880)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('5103aa6e-f5ef-4842-af69-9a70d206f47e', '309b83cc-3af3-491e-a218-b07e73681f26', '/products/anabya/zaarif-cotton-3-pc-emb/05_49440046416105.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/DSC07610.jpg?v=1781367155', 'ZAARIF - COTTON 2 PC EMB - GulPash View 5', 5, false, 1920, 2880)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('d5991cc1-8f4e-4e6b-a35a-9b6faca743a0', '309b83cc-3af3-491e-a218-b07e73681f26', '/products/anabya/zaarif-cotton-3-pc-emb/06_49440046448873.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/DSC07649.jpg?v=1781367155', 'ZAARIF - COTTON 2 PC EMB - GulPash View 6', 6, false, 1920, 2880)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('eac53e9d-2976-454c-a684-40861b2b6b2e', '309b83cc-3af3-491e-a218-b07e73681f26', '/products/anabya/zaarif-cotton-3-pc-emb/07_49440046481641.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/DSC07591.jpg?v=1781367156', 'ZAARIF - COTTON 2 PC EMB - GulPash View 7', 7, false, 1920, 2880)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('7525aa87-bb79-4666-a5d3-1bc5ef3b2c91', '0f028a27-c9ef-4d7a-a46f-7a87b2388d88', '/products/anabya/zar-e-sabz-3piece/01_50358171500777.png', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_93ed5725-17c7-4a9f-b4f8-852d27e9f48c.png?v=1788850631', 'Zar-E-Sabz 3Piece - GulPash View 1', 1, true, 1024, 1536)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('6914614e-409f-4c86-ac5f-16dc87540fad', '0f028a27-c9ef-4d7a-a46f-7a87b2388d88', '/products/anabya/zar-e-sabz-3piece/02_50358171468009.png', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_4b7eea5e-02a1-4148-8dd6-cdc3db827ed7.png?v=1788850631', 'Zar-E-Sabz 3Piece - GulPash View 2', 2, false, 1024, 1536)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('88180a0b-6788-4b81-a861-bea1f162b761', '0f028a27-c9ef-4d7a-a46f-7a87b2388d88', '/products/anabya/zar-e-sabz-3piece/03_50358171435241.png', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_92dac33e-c018-48d8-b50f-b89e9b1bf15f.png?v=1788850631', 'Zar-E-Sabz 3Piece - GulPash View 3', 3, false, 1121, 1403)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('1f587b26-7596-4a25-a8c3-a3a5533998c5', '79430272-a7fb-481b-a2c4-943682ddd582', '/products/anabya/zeenat-emb-3pcs/01_49440054640873.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/eidshoot_s_z_a_-1902_jpg.jpg?v=1781367188', 'Zeenat EMB – 3PCs - GulPash View 1', 1, true, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('4b9679ed-0074-4c56-a827-6e37064d4178', '79430272-a7fb-481b-a2c4-943682ddd582', '/products/anabya/zeenat-emb-3pcs/02_49440054673641.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/eidshoot_s_z_a_-1843_jpg.jpg?v=1781367188', 'Zeenat EMB – 3PCs - GulPash View 2', 2, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('93f9541d-e485-43aa-a4df-b0a0bbc6637b', '79430272-a7fb-481b-a2c4-943682ddd582', '/products/anabya/zeenat-emb-3pcs/03_49440054706409.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/eidshoot_s_z_a_-1867_jpg.jpg?v=1781367189', 'Zeenat EMB – 3PCs - GulPash View 3', 3, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('effa44b7-57d3-4e4c-ad32-29d8441f7dd9', '79430272-a7fb-481b-a2c4-943682ddd582', '/products/anabya/zeenat-emb-3pcs/04_49440054739177.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/eidshoot_s_z_a_-1885_jpg.jpg?v=1781367188', 'Zeenat EMB – 3PCs - GulPash View 4', 4, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('f7f8443f-82cb-46a8-ad06-ed5bf8ec85f6', '79430272-a7fb-481b-a2c4-943682ddd582', '/products/anabya/zeenat-emb-3pcs/05_49440054771945.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/eidshoot_s_z_a_-1902.jpg_1.jpg?v=1781367188', 'Zeenat EMB – 3PCs - GulPash View 5', 5, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('f48aeeda-65b8-42cc-ae30-4966629780d9', '79430272-a7fb-481b-a2c4-943682ddd582', '/products/anabya/zeenat-emb-3pcs/06_49440054804713.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/eidshoot_s_z_a_-1934_jpg.jpg?v=1781367188', 'Zeenat EMB – 3PCs - GulPash View 6', 6, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('4eae62a7-6510-441f-ad60-8ed5715377b1', '79430272-a7fb-481b-a2c4-943682ddd582', '/products/anabya/zeenat-emb-3pcs/07_49440054837481.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/eidshoot_s_z_a_-1945_jpg.jpg?v=1781367188', 'Zeenat EMB – 3PCs - GulPash View 7', 7, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('8ae45eeb-98cc-48ba-a2ed-57a083869bb7', '79430272-a7fb-481b-a2c4-943682ddd582', '/products/anabya/zeenat-emb-3pcs/08_49440054870249.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/eidshoot_s_z_a_-1987_jpg.jpg?v=1781367189', 'Zeenat EMB – 3PCs - GulPash View 8', 8, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('0fc1c16c-0552-4fd9-a014-6b78c80273f1', '79430272-a7fb-481b-a2c4-943682ddd582', '/products/anabya/zeenat-emb-3pcs/09_49440054903017.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/eidshoot_s_z_a_-1993_dc28bebb-b36d-4f2f-b07b-4b22bfc341f1_jpg.jpg?v=1781367188', 'Zeenat EMB – 3PCs - GulPash View 9', 9, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('77d49561-827b-46e6-a21f-2c659bf079f2', '79430272-a7fb-481b-a2c4-943682ddd582', '/products/anabya/zeenat-emb-3pcs/10_49440054935785.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/eidshoot_s_z_a_-2005_jpg.jpg?v=1781367189', 'Zeenat EMB – 3PCs - GulPash View 10', 10, false, 1000, 1500)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('86b2f353-710b-445f-a004-d28ac95d0620', '62cca4a5-a562-45be-a5d0-99130e0a2519', '/products/anabya/zohra-3-piece/01_49807210774761.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_ca6f3162-00f4-4139-b593-777b47cde57e.jpg?v=1784833908', 'Zohra 3 Piece - GulPash View 1', 1, true, 628, 887)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('fa8c55bb-3ab9-4160-a22d-003bc3e6f21a', '62cca4a5-a562-45be-a5d0-99130e0a2519', '/products/anabya/zohra-3-piece/02_49807210741993.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_e49b7ffe-a920-44fb-941c-5aa4946fa6ec.jpg?v=1784829995', 'Zohra 3 Piece - GulPash View 2', 2, false, 990, 1320)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;
INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('00d1c6af-3b72-4a5e-a09c-b6d364799fff', '62cca4a5-a562-45be-a5d0-99130e0a2519', '/products/anabya/zohra-3-piece/03_49807210709225.jpg', 'https://cdn.shopify.com/s/files/1/0814/7419/1593/files/rn-image_picker_lib_temp_8c93ac15-26f3-44bd-9e6d-63cac4de31b7.jpg?v=1784829995', 'Zohra 3 Piece - GulPash View 3', 3, false, 990, 1320)
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;

-- 6. Insert Product Collections (Junction)
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('4f1c277b-917f-47e6-a855-d5b2c493757d', '66142d53-e454-45bb-aa46-f0ef5a46af98')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('4f1c277b-917f-47e6-a855-d5b2c493757d', '46f715c2-0f7d-4ccc-ad6b-2a1110582e70')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('7d78784f-55b3-4997-ad84-b8f5a05f622c', '66142d53-e454-45bb-aa46-f0ef5a46af98')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('7d78784f-55b3-4997-ad84-b8f5a05f622c', 'a3237583-8df2-41df-a438-dd89a83e9b3f')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('7d78784f-55b3-4997-ad84-b8f5a05f622c', '6c19f56a-a756-4050-a710-e9296236afc4')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('7aa3b55d-255c-4d23-a44b-4edea63e374a', '66142d53-e454-45bb-aa46-f0ef5a46af98')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('7aa3b55d-255c-4d23-a44b-4edea63e374a', 'a3237583-8df2-41df-a438-dd89a83e9b3f')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('7aa3b55d-255c-4d23-a44b-4edea63e374a', '6c19f56a-a756-4050-a710-e9296236afc4')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('1137ec03-4d5c-4fc3-a86a-6171252552f0', '66142d53-e454-45bb-aa46-f0ef5a46af98')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('1137ec03-4d5c-4fc3-a86a-6171252552f0', '46f715c2-0f7d-4ccc-ad6b-2a1110582e70')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('a020657f-4e8f-47c5-a90d-e129669dc324', '66142d53-e454-45bb-aa46-f0ef5a46af98')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('a020657f-4e8f-47c5-a90d-e129669dc324', 'a3237583-8df2-41df-a438-dd89a83e9b3f')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('71f2b516-7326-4ed0-a553-5877dfdc668b', '66142d53-e454-45bb-aa46-f0ef5a46af98')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('71f2b516-7326-4ed0-a553-5877dfdc668b', '46f715c2-0f7d-4ccc-ad6b-2a1110582e70')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('d6c3d9b0-c2d5-4b2b-aa90-8ee2b1f4bed2', '66142d53-e454-45bb-aa46-f0ef5a46af98')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('d6c3d9b0-c2d5-4b2b-aa90-8ee2b1f4bed2', 'a3237583-8df2-41df-a438-dd89a83e9b3f')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('d6c3d9b0-c2d5-4b2b-aa90-8ee2b1f4bed2', '6c19f56a-a756-4050-a710-e9296236afc4')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('22b380a2-b6e0-4a74-a457-c6828458bc57', '66142d53-e454-45bb-aa46-f0ef5a46af98')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('22b380a2-b6e0-4a74-a457-c6828458bc57', '46f715c2-0f7d-4ccc-ad6b-2a1110582e70')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('bf19a309-ad4e-4746-a043-4bbe1261d43d', '66142d53-e454-45bb-aa46-f0ef5a46af98')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('bf19a309-ad4e-4746-a043-4bbe1261d43d', 'a3237583-8df2-41df-a438-dd89a83e9b3f')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('f58f8a61-cb17-41f2-ae42-b53a905d0f75', '66142d53-e454-45bb-aa46-f0ef5a46af98')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('f58f8a61-cb17-41f2-ae42-b53a905d0f75', 'a3237583-8df2-41df-a438-dd89a83e9b3f')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('35a01cae-b1ea-4c90-a30c-e23b4ecee033', '66142d53-e454-45bb-aa46-f0ef5a46af98')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('35a01cae-b1ea-4c90-a30c-e23b4ecee033', 'a3237583-8df2-41df-a438-dd89a83e9b3f')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('35a01cae-b1ea-4c90-a30c-e23b4ecee033', '6c19f56a-a756-4050-a710-e9296236afc4')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('84c1092f-efa7-4e69-afe2-12ca7666fe26', '66142d53-e454-45bb-aa46-f0ef5a46af98')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('84c1092f-efa7-4e69-afe2-12ca7666fe26', '46f715c2-0f7d-4ccc-ad6b-2a1110582e70')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('f8aa8eca-5946-4225-a9a8-bac867ad0f3b', '66142d53-e454-45bb-aa46-f0ef5a46af98')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('f8aa8eca-5946-4225-a9a8-bac867ad0f3b', '46f715c2-0f7d-4ccc-ad6b-2a1110582e70')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('f8aa8eca-5946-4225-a9a8-bac867ad0f3b', '6c19f56a-a756-4050-a710-e9296236afc4')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('c3d827b9-1a31-4228-a190-7a3da5a698af', '66142d53-e454-45bb-aa46-f0ef5a46af98')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('c3d827b9-1a31-4228-a190-7a3da5a698af', 'a3237583-8df2-41df-a438-dd89a83e9b3f')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('bce0772a-1255-47c8-afcd-5f578734316e', '66142d53-e454-45bb-aa46-f0ef5a46af98')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('bce0772a-1255-47c8-afcd-5f578734316e', '46f715c2-0f7d-4ccc-ad6b-2a1110582e70')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('9719080d-6d7f-4ad7-ac0d-75142e67ab13', '66142d53-e454-45bb-aa46-f0ef5a46af98')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('9719080d-6d7f-4ad7-ac0d-75142e67ab13', 'a3237583-8df2-41df-a438-dd89a83e9b3f')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('47b17f35-a153-4561-a877-86519f825767', '66142d53-e454-45bb-aa46-f0ef5a46af98')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('47b17f35-a153-4561-a877-86519f825767', 'a3237583-8df2-41df-a438-dd89a83e9b3f')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('d4bd170b-03e7-476e-a108-8cfa2e96fbae', '66142d53-e454-45bb-aa46-f0ef5a46af98')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('d4bd170b-03e7-476e-a108-8cfa2e96fbae', '46f715c2-0f7d-4ccc-ad6b-2a1110582e70')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('3bc17692-61c5-4dcd-a738-d23fd7409f94', '66142d53-e454-45bb-aa46-f0ef5a46af98')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('3bc17692-61c5-4dcd-a738-d23fd7409f94', 'a3237583-8df2-41df-a438-dd89a83e9b3f')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('8a3aeb94-1fa8-43ff-a032-acc5cbd5c630', '66142d53-e454-45bb-aa46-f0ef5a46af98')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('8a3aeb94-1fa8-43ff-a032-acc5cbd5c630', 'a3237583-8df2-41df-a438-dd89a83e9b3f')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('a5686492-80b5-4882-ab9f-8555bdfea101', '66142d53-e454-45bb-aa46-f0ef5a46af98')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('a5686492-80b5-4882-ab9f-8555bdfea101', '46f715c2-0f7d-4ccc-ad6b-2a1110582e70')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('b1821be2-41c0-4224-a274-9d52826fe528', '66142d53-e454-45bb-aa46-f0ef5a46af98')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('b1821be2-41c0-4224-a274-9d52826fe528', '46f715c2-0f7d-4ccc-ad6b-2a1110582e70')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('2983d9d1-edad-45f6-a4df-dcf2f37cfd92', '66142d53-e454-45bb-aa46-f0ef5a46af98')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('2983d9d1-edad-45f6-a4df-dcf2f37cfd92', 'a3237583-8df2-41df-a438-dd89a83e9b3f')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('acf9bbd7-3cb3-4632-ad2b-59e3ee7489dd', '66142d53-e454-45bb-aa46-f0ef5a46af98')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('acf9bbd7-3cb3-4632-ad2b-59e3ee7489dd', '46f715c2-0f7d-4ccc-ad6b-2a1110582e70')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('e8e3b097-8c56-46d9-a63f-fd7eb93b1ae7', '66142d53-e454-45bb-aa46-f0ef5a46af98')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('e8e3b097-8c56-46d9-a63f-fd7eb93b1ae7', 'a3237583-8df2-41df-a438-dd89a83e9b3f')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('a106adfd-c20f-479b-abb3-eb18d5c3aeb4', '66142d53-e454-45bb-aa46-f0ef5a46af98')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('d495c75e-871c-41a0-a90b-b42c127fafe2', '66142d53-e454-45bb-aa46-f0ef5a46af98')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('d495c75e-871c-41a0-a90b-b42c127fafe2', '46f715c2-0f7d-4ccc-ad6b-2a1110582e70')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('f2519c85-f4a5-4cf4-a11c-794648156d7b', '66142d53-e454-45bb-aa46-f0ef5a46af98')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('f2519c85-f4a5-4cf4-a11c-794648156d7b', 'a3237583-8df2-41df-a438-dd89a83e9b3f')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('f2519c85-f4a5-4cf4-a11c-794648156d7b', '6c19f56a-a756-4050-a710-e9296236afc4')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('61788cda-7961-4418-ab58-e7f555198e38', '66142d53-e454-45bb-aa46-f0ef5a46af98')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('61788cda-7961-4418-ab58-e7f555198e38', '46f715c2-0f7d-4ccc-ad6b-2a1110582e70')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('1c889dbe-c013-435f-ac8f-d389b30da10c', '66142d53-e454-45bb-aa46-f0ef5a46af98')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('1c889dbe-c013-435f-ac8f-d389b30da10c', '46f715c2-0f7d-4ccc-ad6b-2a1110582e70')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('90efbae5-0c2e-4c30-aa93-81673709675e', '66142d53-e454-45bb-aa46-f0ef5a46af98')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('90efbae5-0c2e-4c30-aa93-81673709675e', '46f715c2-0f7d-4ccc-ad6b-2a1110582e70')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('178198e7-3604-4651-a64c-cec8aa722608', '66142d53-e454-45bb-aa46-f0ef5a46af98')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('178198e7-3604-4651-a64c-cec8aa722608', 'a3237583-8df2-41df-a438-dd89a83e9b3f')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('04e321ea-b08c-4f98-a96b-837c37aa8271', '66142d53-e454-45bb-aa46-f0ef5a46af98')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('04e321ea-b08c-4f98-a96b-837c37aa8271', '46f715c2-0f7d-4ccc-ad6b-2a1110582e70')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('ed6de3eb-39f5-477a-aecf-f1f0bec901fe', '66142d53-e454-45bb-aa46-f0ef5a46af98')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('ed6de3eb-39f5-477a-aecf-f1f0bec901fe', '46f715c2-0f7d-4ccc-ad6b-2a1110582e70')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('309b83cc-3af3-491e-a218-b07e73681f26', '66142d53-e454-45bb-aa46-f0ef5a46af98')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('309b83cc-3af3-491e-a218-b07e73681f26', 'a3237583-8df2-41df-a438-dd89a83e9b3f')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('309b83cc-3af3-491e-a218-b07e73681f26', '3ea29e8b-052b-42d5-aefc-b8f2ecce1efe')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('0f028a27-c9ef-4d7a-a46f-7a87b2388d88', '66142d53-e454-45bb-aa46-f0ef5a46af98')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('0f028a27-c9ef-4d7a-a46f-7a87b2388d88', '46f715c2-0f7d-4ccc-ad6b-2a1110582e70')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('79430272-a7fb-481b-a2c4-943682ddd582', '66142d53-e454-45bb-aa46-f0ef5a46af98')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('79430272-a7fb-481b-a2c4-943682ddd582', 'a3237583-8df2-41df-a438-dd89a83e9b3f')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('62cca4a5-a562-45be-a5d0-99130e0a2519', '66142d53-e454-45bb-aa46-f0ef5a46af98')
ON CONFLICT (product_id, collection_id) DO NOTHING;
INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('62cca4a5-a562-45be-a5d0-99130e0a2519', '46f715c2-0f7d-4ccc-ad6b-2a1110582e70')
ON CONFLICT (product_id, collection_id) DO NOTHING;
