-- ==========================================================
-- GULPASH.PK — SUPABASE CATALOG MIGRATION SQL SCRIPT
-- Source: https://tawakalcloset.com/ -> https://gulpash.pk/
-- Products: 68 | Variants: 269 | Images: 397 | Categories: 5 | Collections: 6
-- ==========================================================

-- 1. Insert Categories
INSERT INTO public.categories (id, name, slug, description, image_url, display_order, is_visible)
VALUES ('90151ef9-20ad-496b-8daf-eef1fb0a8aa9', 'Unstitched / Stitched', 'unstitched-stitched', 'GulPash luxury Unstitched / Stitched collection. Master-crafted Pakistani tailoring and premium textiles.', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/17_22ba13c3-6eda-4dde-a515-e01030c718f6.png?v=1787217341', 1, true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, image_url = EXCLUDED.image_url;
INSERT INTO public.categories (id, name, slug, description, image_url, display_order, is_visible)
VALUES ('b6f45e57-efe5-4094-8c75-91ca5cde1f1e', 'Stitched', 'stitched', 'GulPash luxury Stitched collection. Master-crafted Pakistani tailoring and premium textiles.', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Mirana11thoct-1502_1000x_jpg.jpg?v=1767786202', 2, true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, image_url = EXCLUDED.image_url;
INSERT INTO public.categories (id, name, slug, description, image_url, display_order, is_visible)
VALUES ('eb8a2f48-1c92-495b-8a7f-2b18de2a8c6e', 'woman', 'woman', 'GulPash luxury woman collection. Master-crafted Pakistani tailoring and premium textiles.', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/MaaheZrmny-2623_jpg_1.png?v=1777640850', 3, true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, image_url = EXCLUDED.image_url;
INSERT INTO public.categories (id, name, slug, description, image_url, display_order, is_visible)
VALUES ('238b9607-7157-468b-82ad-49fd47f535f7', 'Clothing', 'clothing', 'GulPash luxury Clothing collection. Master-crafted Pakistani tailoring and premium textiles.', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/imgi_96_MSS-5751_3_fe45d47b-39a0-4cfb-8c50-73b86c82f29a_jpg.jpg?v=1777546756', 4, true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, image_url = EXCLUDED.image_url;
INSERT INTO public.categories (id, name, slug, description, image_url, display_order, is_visible)
VALUES ('182c6be1-75c0-406c-826f-770ab3725133', '3 Pieces', '3-pieces', 'GulPash luxury 3 Pieces collection. Master-crafted Pakistani tailoring and premium textiles.', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/IMG_20251101_002112_7ab25f69-918d-43f5-9ada-78b2ca914dfc_1.jpg?v=1769455005', 5, true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, image_url = EXCLUDED.image_url;

-- 2. Insert Collections
INSERT INTO public.collections (id, name, slug, description, image_url, display_order, is_visible)
VALUES ('4ca893b6-3d59-4256-86b9-81b25057c513', 'BEST SELLING', 'best-selling', 'Discover GulPash BEST SELLING. Handcrafted luxury silhouettes and signature designs.', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/17_22ba13c3-6eda-4dde-a515-e01030c718f6.png?v=1787217341', 1, true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, image_url = EXCLUDED.image_url;
INSERT INTO public.collections (id, name, slug, description, image_url, display_order, is_visible)
VALUES ('d12a9e3b-e23b-4a89-80d5-6c2478bbfe89', 'Co-Ords', 'co-ords', 'Discover GulPash Co-Ords. Handcrafted luxury silhouettes and signature designs.', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/EidcollectionisavailablenowZimalbyModernmilaapGoandshoponlinefromwebsite_1.jpg?v=1771952830', 2, true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, image_url = EXCLUDED.image_url;
INSERT INTO public.collections (id, name, slug, description, image_url, display_order, is_visible)
VALUES ('f743b288-d90c-42ad-882a-94a1df7a90b8', 'Home', 'home', 'Discover GulPash Home. Handcrafted luxury silhouettes and signature designs.', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/17_22ba13c3-6eda-4dde-a515-e01030c718f6.png?v=1787217341', 3, true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, image_url = EXCLUDED.image_url;
INSERT INTO public.collections (id, name, slug, description, image_url, display_order, is_visible)
VALUES ('4ab60e51-dddb-433c-880c-d30909bcbcb3', 'NEW ARRIVALS', 'new-arrivals', 'Discover GulPash NEW ARRIVALS. Handcrafted luxury silhouettes and signature designs.', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/17_22ba13c3-6eda-4dde-a515-e01030c718f6.png?v=1787217341', 4, true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, image_url = EXCLUDED.image_url;
INSERT INTO public.collections (id, name, slug, description, image_url, display_order, is_visible)
VALUES ('ac6105c8-44f9-4e59-85ab-8896de893627', 'Trending Designs', 'short-length-article', 'Discover GulPash Trending Designs. Handcrafted luxury silhouettes and signature designs.', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/17_22ba13c3-6eda-4dde-a515-e01030c718f6.png?v=1787217341', 5, true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, image_url = EXCLUDED.image_url;
INSERT INTO public.collections (id, name, slug, description, image_url, display_order, is_visible)
VALUES ('e627afcf-c6cf-4c7e-809d-d2582a64ab48', 'WINTER COLLECTION', 'winter-collection', 'Discover GulPash WINTER COLLECTION. Handcrafted luxury silhouettes and signature designs.', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Mirana11thoct-1502_1000x_jpg.jpg?v=1767786202', 6, true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, image_url = EXCLUDED.image_url;

-- 3. Insert Products & Images
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('3421d51c-3c3a-4908-8bfe-1d8dbd6e8e62', 'Plum 3Piece', 'plum-3piece', '<p class="PDq2pG_selectionAnchorContainer"><strong>Fabric Details</strong><span class="PDq2pG_selectionAnchor"></span></p>
<ul>
<li>
<strong>Shirt:</strong> Embroidered shirt </li>
<li>
<strong>Trouser:</strong> Emb Trouser</li>
<li>
<strong>Dupatta:</strong> Dupata Chiffon Emb</li>
</ul>
<p><span style="color: rgb(0, 0, 0);"><strong>Type: Stitched<br>stuff <br>Cotton </strong></span></p>', 'TAW-RG3-S-0', '90151ef9-20ad-496b-8daf-eef1fb0a8aa9', 'Unstitched / Stitched', 5499, 6899, 'Embroidered shirt with Dupata Chiffon Emb', '{}', '{"S","M","L","XL"}', true, true, true, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('ce2fbb2c-886d-4382-8cf5-a0dedf1dec35', '3421d51c-3c3a-4908-8bfe-1d8dbd6e8e62', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/17_22ba13c3-6eda-4dde-a515-e01030c718f6.png?v=1787217341', 'Plum 3Piece - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('50e41066-d647-428d-8abb-763796a410e5', '3421d51c-3c3a-4908-8bfe-1d8dbd6e8e62', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/21_4dda4a81-f24f-4c12-b218-113c02376f26.png?v=1787217341', 'Plum 3Piece - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('fe1fdc71-8f38-4738-85fb-0efbf8aff8f6', '3421d51c-3c3a-4908-8bfe-1d8dbd6e8e62', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/18_d774e323-27de-40aa-8358-0eef46a0944f.png?v=1787217341', 'Plum 3Piece - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('91b22937-bf27-4b3b-871d-0b92f0eebd89', '3421d51c-3c3a-4908-8bfe-1d8dbd6e8e62', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/20_c83e5b8e-6084-4e2c-99bf-8f6793ddff5f.png?v=1787217341', 'Plum 3Piece - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('7b611dad-d16f-408c-8de2-ff468d56a80a', '3421d51c-3c3a-4908-8bfe-1d8dbd6e8e62', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/19_cdf6be42-9d0f-4322-b9aa-f4326cdde32f.png?v=1787217341', 'Plum 3Piece - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('ae8fd4b2-58b5-49e2-8d7d-5f4359c3ad66', 'Azmeen 3 Piece', 'azmeen-3-piece', '<h4>✅<span> </span><strong>Parcel can be opened and checked before payment.<br></strong>
</h4>
<ul>
<li>
<p><strong>Azmeen 3-Piece</strong></p>
<p>A beautifully stitched cotton lawn outfit featuring an embroidered shirt, elegant embroidered plazo, and a graceful embroidered chiffon dupatta—perfect for a timeless and sophisticated look.</p>
<p><strong>Fabric Details</strong></p>
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
<h4><br></h4>', 'GP-10505411232059-51514460537147', '90151ef9-20ad-496b-8daf-eef1fb0a8aa9', 'Unstitched / Stitched', 5499, NULL, 'Embroidered Shirt with Embroidered Chiffon Dupatta', '{}', '{"Small (S)","Medium (M)","Large (L)","Extra Large (XL)"}', true, true, false, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('81687408-b425-4041-811a-955689e81a3d', 'ae8fd4b2-58b5-49e2-8d7d-5f4359c3ad66', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/rn-image_picker_lib_temp_ad02dec1-398e-422d-83dd-795d0f8b888d.jpg?v=1785345921', 'Azmeen 3 Piece - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('320bbfa8-b235-40b9-88c9-51b3ff5046e4', 'ae8fd4b2-58b5-49e2-8d7d-5f4359c3ad66', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/rn-image_picker_lib_temp_1bddec72-efea-4baf-b82a-420e7df572ae.jpg?v=1785345450', 'Azmeen 3 Piece - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('b1776565-de65-4513-8b2e-983723a2869b', 'ae8fd4b2-58b5-49e2-8d7d-5f4359c3ad66', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/rn-image_picker_lib_temp_ceddb332-e5c8-4346-8510-ba1a68d578ea.jpg?v=1785345450', 'Azmeen 3 Piece - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('1ca36d88-809a-47a1-8e47-d057b7a718f6', 'ae8fd4b2-58b5-49e2-8d7d-5f4359c3ad66', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/rn-image_picker_lib_temp_34fe978c-00b0-4e39-8ca4-c037a1f7e64e.jpg?v=1785345450', 'Azmeen 3 Piece - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('02cdd6b6-397f-474b-816c-dd1166b8fa38', 'ae8fd4b2-58b5-49e2-8d7d-5f4359c3ad66', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/rn-image_picker_lib_temp_b51eb010-c8a7-4c32-ac58-19714d535f5a.jpg?v=1785345450', 'Azmeen 3 Piece - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('5b8680d7-39c5-444f-8e74-34ffecefe87b', 'ae8fd4b2-58b5-49e2-8d7d-5f4359c3ad66', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/rn-image_picker_lib_temp_723c4cae-20c6-4796-93b2-1ffa61527812.jpg?v=1785345450', 'Azmeen 3 Piece - View 6', false, 6)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('d7664530-163b-490c-8723-92a54263dfb2', 'ae8fd4b2-58b5-49e2-8d7d-5f4359c3ad66', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/rn-image_picker_lib_temp_958d7dad-c3d3-4134-89da-f0cd83695f58.jpg?v=1785345450', 'Azmeen 3 Piece - View 7', false, 7)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('67b3518e-d0ff-4acd-8b3e-b87304e54d66', 'Sunehri 3 Piece', 'sunehri-3-piece', '<ul>
<li>
<h4>✅<span> </span><strong>Parcel can be opened and checked before payment.<br></strong>
</h4>
<h3><strong>Sunehri 3-Piece</strong></h3>
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
<h4><br></h4>
</li>
</ul>', 'TAW-SE3-S-5', '90151ef9-20ad-496b-8daf-eef1fb0a8aa9', 'Unstitched / Stitched', 5499, NULL, 'Embroidered Shirt with Printed Chiffon Dupatta', '{}', '{"Small (S)","Medium (M)","Large (L)","Extra Large (XL)"}', true, true, false, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('33213ed4-c804-4df4-8ebf-b7ef25d87a58', '67b3518e-d0ff-4acd-8b3e-b87304e54d66', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/rn-image_picker_lib_temp_2464a6e2-8a9a-422c-9cda-21adbf389488.jpg?v=1785345449', 'Sunehri 3 Piece - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('0ff969e6-81e5-42be-8cf9-d7d80cb1eb2e', '67b3518e-d0ff-4acd-8b3e-b87304e54d66', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/rn-image_picker_lib_temp_ef0d5c18-23fc-4bdf-89ac-62277088459f.jpg?v=1785345448', 'Sunehri 3 Piece - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('482cec4b-e8f1-4dca-8f84-58c530cba26e', '67b3518e-d0ff-4acd-8b3e-b87304e54d66', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/rn-image_picker_lib_temp_1d265abd-f481-4f89-8467-1a2079104638.jpg?v=1785345449', 'Sunehri 3 Piece - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('bbf5f71d-3361-4beb-8952-2b512a3ba4d1', '67b3518e-d0ff-4acd-8b3e-b87304e54d66', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/rn-image_picker_lib_temp_37171690-287b-4081-99da-8bbf8c6fe359.jpg?v=1785345449', 'Sunehri 3 Piece - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('46699592-2e2c-420e-8247-fee7434fa613', 'Raniya 3 Piece', 'raniya-3-piece', '<p>✅<span> </span><strong>Parcel can be opened and checked before payment.</strong></p>
<h3><strong>Raniya 3-Piece</strong></h3>
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
</ul>
<p><br></p>', 'GP-10505411133755-51514459586875', '90151ef9-20ad-496b-8daf-eef1fb0a8aa9', 'Unstitched / Stitched', 4999, NULL, 'Embroidered Shirt with Printed Chiffon Dupatta', '{}', '{"Small (S)","Medium (M)","Large (L)","Extra Large (XL)"}', true, true, false, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('5db1a88c-a3c8-48ac-88ad-6a92d61d055e', '46699592-2e2c-420e-8247-fee7434fa613', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/rn-image_picker_lib_temp_5d4c42f9-505f-45d3-957e-0e5ade3063b9.jpg?v=1785345447', 'Raniya 3 Piece - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('74b824f1-2029-4768-81f6-cc58e25e437f', '46699592-2e2c-420e-8247-fee7434fa613', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/rn-image_picker_lib_temp_56ab00cd-8f8e-4acd-8f28-18a17a5471fb.jpg?v=1785345447', 'Raniya 3 Piece - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('db17f5aa-bb5d-4fd9-89b6-510059914c49', '46699592-2e2c-420e-8247-fee7434fa613', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/rn-image_picker_lib_temp_0f36c5c9-1fb7-4e5c-9f65-700ee42fa1dc.jpg?v=1785345447', 'Raniya 3 Piece - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('684c1b5a-5fa9-4218-8a7d-51b4d13c3b2a', 'Ruby Grace 3Pcs', 'ruby-grace-3pcs', '<p class="PDq2pG_selectionAnchorContainer" data-end="372" data-start="354"><strong data-end="372" data-start="354">Fabric Details</strong><span class="PDq2pG_selectionAnchor" aria-hidden="true"></span></p>
<ul data-is-only-node="" data-is-last-node="" data-end="482" data-start="373">
<li data-end="410" data-start="373" data-section-id="1iq762j">
<strong data-end="385" data-start="375">Shirt:</strong> Embroidered shirt </li>
<li data-end="446" data-start="411" data-section-id="o18a6j">
<strong data-end="425" data-start="413">Trouser:</strong> Emb Trouser</li>
<li data-is-last-node="" data-end="482" data-start="447" data-section-id="1uv5dw2">
<strong data-end="461" data-start="449">Dupatta:</strong> Dupata Chiffon Emb</li>
</ul>
<p><span style="color: rgb(0, 0, 0);"><strong>Type: Stitched<br>stuff <br>Cotton </strong></span></p>', 'TAW-RG3-S-0', '90151ef9-20ad-496b-8daf-eef1fb0a8aa9', 'Unstitched / Stitched', 5499, 6899, 'Embroidered shirt with Dupata Chiffon Emb', '{}', '{"S","M","L","XL"}', true, true, true, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('cc8b4b81-e3c5-46cd-8ed6-ecbf796a4cf1', '684c1b5a-5fa9-4218-8a7d-51b4d13c3b2a', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/657949007_18519088627073967_8926792540500625221_n_jpg.jpg?v=1782742886', 'Ruby Grace 3Pcs - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('460de203-360c-4ff1-8d47-202f0b8f4c12', '684c1b5a-5fa9-4218-8a7d-51b4d13c3b2a', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/657361510_18519088606073967_4629356302322606606_n_jpg.jpg?v=1782742886', 'Ruby Grace 3Pcs - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('07aec0bd-4b6c-4b0a-8795-d43a46669beb', '684c1b5a-5fa9-4218-8a7d-51b4d13c3b2a', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/657784431_18519088621073967_8689387525307542215_n_jpg.jpg?v=1782742886', 'Ruby Grace 3Pcs - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('62ba47e1-2148-4b20-8fe1-ec2cda04beb7', '684c1b5a-5fa9-4218-8a7d-51b4d13c3b2a', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/656781951_18519088168073967_7712435057224166312_n_jpg.jpg?v=1782742886', 'Ruby Grace 3Pcs - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('dc0e01c6-65ba-4671-8564-5ca742f73bd6', '684c1b5a-5fa9-4218-8a7d-51b4d13c3b2a', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/657359588_18519088588073967_2513072750134603644_n_jpg.jpg?v=1782742886', 'Ruby Grace 3Pcs - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('67095467-a083-423e-8b8a-b8961289cfee', 'Black Pearl 3Pcs', 'black-pearl-3pcs', '<p data-start="354" data-end="372" class="PDq2pG_selectionAnchorContainer"><strong data-start="354" data-end="372">Fabric Details</strong><span aria-hidden="true" class="PDq2pG_selectionAnchor"></span></p>
<ul data-start="373" data-end="482" data-is-last-node="" data-is-only-node="">
<li data-section-id="1iq762j" data-start="373" data-end="410">
<strong data-start="375" data-end="385">Shirt:</strong> Embroidered shirt </li>
<li data-section-id="o18a6j" data-start="411" data-end="446">
<strong data-start="413" data-end="425">Trouser:</strong> Printed Trouser</li>
<li data-section-id="1uv5dw2" data-start="447" data-end="482" data-is-last-node="">
<strong data-start="449" data-end="461">Dupatta:</strong> Printed Dupata </li>
</ul>
<p><span style="color: rgb(0, 0, 0);"><strong>Type: Stitched<br>stuff <br>Cotton </strong></span></p>', 'TAW-BP3-S-0', '90151ef9-20ad-496b-8daf-eef1fb0a8aa9', 'Unstitched / Stitched', 4999, 6899, 'Embroidered shirt with Printed Dupata', '{}', '{"S","M","L","XL"}', true, true, true, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('3a8e31db-68ce-4461-857f-1177b16f18f6', '67095467-a083-423e-8b8a-b8961289cfee', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/1782741729121_publer_com_jpg.jpg?v=1782742613', 'Black Pearl 3Pcs - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('f851a889-b379-468f-8dca-a5446a70746b', '67095467-a083-423e-8b8a-b8961289cfee', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/1782741729243_publer_com_jpg.jpg?v=1782742613', 'Black Pearl 3Pcs - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('2acf42ff-b82e-4221-8a8a-287230fd4917', '67095467-a083-423e-8b8a-b8961289cfee', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/1782741729378_publer_com_jpg.jpg?v=1782742612', 'Black Pearl 3Pcs - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('8c9b25c4-ccce-4a1c-84b9-fe80bcc726dc', '67095467-a083-423e-8b8a-b8961289cfee', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/1782741729223_publer_com_jpg.jpg?v=1782742613', 'Black Pearl 3Pcs - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('f3300835-5386-4128-8a1f-42ee85618377', '67095467-a083-423e-8b8a-b8961289cfee', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/1782741729125_publer_com_jpg.jpg?v=1782742613', 'Black Pearl 3Pcs - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('65de1f33-06b1-4c12-80cb-5fe8df1057b0', 'Sapphire Bloom 3Pcs', 'sapphire-bloom-3pcs', '<p data-start="354" data-end="372" class="PDq2pG_selectionAnchorContainer"><strong data-start="354" data-end="372">Fabric Details</strong><span aria-hidden="true" class="PDq2pG_selectionAnchor"></span></p>
<ul data-start="373" data-end="482" data-is-last-node="" data-is-only-node="">
<li data-section-id="1iq762j" data-start="373" data-end="410">
<strong data-start="375" data-end="385">Shirt:</strong> Embroidered shirt </li>
<li data-section-id="o18a6j" data-start="411" data-end="446">
<strong data-start="413" data-end="425">Trouser:</strong> Printed farshi Trouser</li>
<li data-section-id="1uv5dw2" data-start="447" data-end="482" data-is-last-node="">
<strong data-start="449" data-end="461">Dupatta:</strong> Printed Dupata </li>
</ul>
<p><span style="color: rgb(0, 0, 0);"><strong>Type: Stitched<br>stuff <br>Cotton </strong></span></p>', 'TAW-SB3-S-1', '90151ef9-20ad-496b-8daf-eef1fb0a8aa9', 'Unstitched / Stitched', 5499, 6899, 'Embroidered shirt with Printed Dupata', '{}', '{"S","M","L","XL"}', true, true, true, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('fe115062-9e69-4c7e-8054-60805b03396c', '65de1f33-06b1-4c12-80cb-5fe8df1057b0', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/1_534918c3-fb63-4a81-b54c-260716f7d770_1.png?v=1782742247', 'Sapphire Bloom 3Pcs - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('1e0b7c25-6014-4e6e-8001-8a7da03e66f8', '65de1f33-06b1-4c12-80cb-5fe8df1057b0', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/58_a0512df6-7c11-4ddc-993c-f6e7e5e50c99_jpg.jpg?v=1782742246', 'Sapphire Bloom 3Pcs - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('b71c9e5e-0dc4-4253-8818-c8c176494ba3', '65de1f33-06b1-4c12-80cb-5fe8df1057b0', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/59_90cd519d-e529-4224-a4aa-76ed6863dfc8_jpg.jpg?v=1782742246', 'Sapphire Bloom 3Pcs - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('89175772-a5a9-402d-8827-736972243bf3', '65de1f33-06b1-4c12-80cb-5fe8df1057b0', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/60_3f90278b-c669-4f2f-be45-b073e8edb4fb_jpg.jpg?v=1782742247', 'Sapphire Bloom 3Pcs - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('c536233d-493f-4fc4-857e-52acef9f642c', '65de1f33-06b1-4c12-80cb-5fe8df1057b0', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/61_c6d5677c-7872-4d3e-a7e9-8b9ff8ab12bc_jpg.jpg?v=1782742247', 'Sapphire Bloom 3Pcs - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('7ceb5e6e-3b16-456c-8b29-0bc0c774c5a7', 'Mehndi Emb 3Pc Stitched', 'mehndi-emb-3pc-stitched', '<p><img src="https://cdn.shopify.com/s/files/1/0638/4127/1923/files/IMG_20250427_222427.jpg?v=1745774765"><br></p>
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
</ul>', 'GP-10261128741179-50895259500859', 'b6f45e57-efe5-4094-8c75-91ca5cde1f1e', 'Stitched', 6499, 19000, 'Premium Cotton Lawn / Raw Silk', '{}', '{"S","M","L","XL"}', true, true, true, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('44f072a3-c3df-4a39-8f1a-85df5fbd65e0', '7ceb5e6e-3b16-456c-8b29-0bc0c774c5a7', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Mirana11thoct-1502_1000x_jpg.jpg?v=1767786202', 'Mehndi Emb 3Pc Stitched - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('99fa1c4f-4884-4c02-85a7-144755c94d37', '7ceb5e6e-3b16-456c-8b29-0bc0c774c5a7', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Mirana11thoct-1595_1000x_jpg.jpg?v=1767786202', 'Mehndi Emb 3Pc Stitched - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('4dffda99-e76d-4626-8739-6d2244c8b4b2', '7ceb5e6e-3b16-456c-8b29-0bc0c774c5a7', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Mirana11thoct-1518_1000x_jpg.jpg?v=1767786202', 'Mehndi Emb 3Pc Stitched - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('65191a95-00f5-45fa-8cd0-26e0387145a2', '7ceb5e6e-3b16-456c-8b29-0bc0c774c5a7', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Mirana11thoct-1774_1000x_jpg.jpg?v=1767786202', 'Mehndi Emb 3Pc Stitched - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('c9d0dbf5-2798-4198-8992-545afcca9382', '7ceb5e6e-3b16-456c-8b29-0bc0c774c5a7', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Mirana11thoct-1662_1000x_jpg.jpg?v=1767786202', 'Mehndi Emb 3Pc Stitched - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('fde84d20-d1f3-4ee4-8ecf-971008b5b2b5', '7ceb5e6e-3b16-456c-8b29-0bc0c774c5a7', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Mirana11thoct-1744_1000x_jpg.jpg?v=1767786202', 'Mehndi Emb 3Pc Stitched - View 6', false, 6)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('464fd168-a6e4-4493-8db5-75f04eae2329', '7ceb5e6e-3b16-456c-8b29-0bc0c774c5a7', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Mirana11thoct-1669_1000x_jpg.jpg?v=1767786202', 'Mehndi Emb 3Pc Stitched - View 7', false, 7)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('7d54ed2b-f134-4bf1-87e3-c3dcfcb3a97d', '7ceb5e6e-3b16-456c-8b29-0bc0c774c5a7', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Mirana11thoct-1720_1000x_jpg.jpg?v=1767786202', 'Mehndi Emb 3Pc Stitched - View 8', false, 8)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('44a6b69b-b6b1-4698-8985-726f2d99191e', '7ceb5e6e-3b16-456c-8b29-0bc0c774c5a7', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Mirana11thoct-1492_1000x_jpg.jpg?v=1767786202', 'Mehndi Emb 3Pc Stitched - View 9', false, 9)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('79ebaf1d-ffdc-4092-89b3-4840149e235a', 'Pink Hearts Set', 'pink-hearts-set', '<p><span style="color: rgb(0, 0, 0);"><strong>LOVE Set includes:</strong></span></p>
<ul>
<li style="font-weight: bold; color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);"><strong>Embroidered shirt</strong></span></li>
<li style="font-weight: bold; color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);"><strong>Farshi shalwar </strong></span></li>
<li style="font-weight: bold; color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);"><strong>Printed chiffon dupatta</strong></span></li>
</ul>
<p><span style="color: rgb(0, 0, 0);"><strong>Model is wearing size M</strong></span></p>
<p><span style="color: rgb(0, 0, 0);"><strong>Fabric: Cotton</strong></span></p>
<p><span style="color: rgb(0, 0, 0);"><strong>Type: Stitched</strong></span></p>', 'TAW-PHS-S-0', '90151ef9-20ad-496b-8daf-eef1fb0a8aa9', 'Unstitched / Stitched', 4999, 6899, 'Premium Cotton Lawn / Raw Silk', '{}', '{"S","M","L","XL"}', true, true, true, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('3bfb7c4c-a19f-4781-834d-4d2ce4f4cfe9', '79ebaf1d-ffdc-4092-89b3-4840149e235a', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/D87B454F-1D7A-4DEB-810F-30353E10D055_jpg.jpg?v=1780940232', 'Pink Hearts Set - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('7f3ba57f-e359-4821-886f-de3a9ceec0e5', '79ebaf1d-ffdc-4092-89b3-4840149e235a', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/68E24E92-3139-4C56-8A4A-A3A12EA25CE1_jpg.jpg?v=1780940232', 'Pink Hearts Set - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('d8e105f2-5194-4939-85a9-6889c55e9022', '79ebaf1d-ffdc-4092-89b3-4840149e235a', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/121BE211-E054-4EAC-A8AF-21FE9BB8FFE7_jpg.jpg?v=1780940232', 'Pink Hearts Set - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('bed3a379-7753-4206-8718-e092c514a257', '79ebaf1d-ffdc-4092-89b3-4840149e235a', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/F4770BF7-9817-4132-AE36-0C5B13048236_jpg.jpg?v=1780940232', 'Pink Hearts Set - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('18d9605c-92fc-4e49-8891-9c5e85d4cf91', 'Mehar 2 PCs EMBROIDERY', 'mehar-2-pcs-embroidery', '<div class="productView-moreItem"><br></div>
<div class="productView-moreItem">
<div class="productView-desc halo-text-format">
<p>Experience detailed embroidery on smooth blended Cotton fabric that feels soft and easy to wear. Made for all-season comfort, it combines simplicity with timeless style</p>
<h4><strong>Details</strong></h4>
<ul>
<ul>
<li>
<p><strong>Cotton Fabric</strong></p>
</li>
<li style="font-weight: bold;">
<p><strong>Two Piece Stitched Embroidered Shirt with Farshi Shalwar</strong></p>
</li>
<li style="font-weight: bold;">
<p><strong>Cutwork on Shirt Hem, Neckline and Sleeves</strong></p>
</li>
</ul>
</ul>
<p>Size- The Model is wearing an S size</p>
</div>
</div>', 'GP-10407801487675-51317837168955', '90151ef9-20ad-496b-8daf-eef1fb0a8aa9', 'Unstitched / Stitched', 4699, 5999, 'Premium Cotton Lawn / Raw Silk', '{}', '{"S","M","L","XL"}', true, true, true, true, 0)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('b557e160-5021-4cc4-8fd7-580e5bc1160e', '18d9605c-92fc-4e49-8891-9c5e85d4cf91', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/35A9176_1.webp?v=1780752552', 'Mehar 2 PCs EMBROIDERY - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('194f361f-ecaa-442b-82c4-ad8600f4cbba', '18d9605c-92fc-4e49-8891-9c5e85d4cf91', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/35A9179_1.webp?v=1780752551', 'Mehar 2 PCs EMBROIDERY - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('c360d710-eea8-4a5f-8b58-71e5f2f8accc', '18d9605c-92fc-4e49-8891-9c5e85d4cf91', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/3I7A3441.webp?v=1780752552', 'Mehar 2 PCs EMBROIDERY - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('508ca208-9910-4e21-8257-92eaa782922d', '18d9605c-92fc-4e49-8891-9c5e85d4cf91', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/3I7A3466.webp?v=1780752551', 'Mehar 2 PCs EMBROIDERY - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('dc7cc319-2f0c-4ce7-8086-ca5e027fe48e', '18d9605c-92fc-4e49-8891-9c5e85d4cf91', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/3I7A3458.webp?v=1780752551', 'Mehar 2 PCs EMBROIDERY - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('32bc9366-05de-4557-8796-322408e21e92', '18d9605c-92fc-4e49-8891-9c5e85d4cf91', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/3I7A3459.webp?v=1780752551', 'Mehar 2 PCs EMBROIDERY - View 6', false, 6)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('25313fa7-f49b-405c-8e3d-e32ac685faae', '18d9605c-92fc-4e49-8891-9c5e85d4cf91', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/3I7A3476.webp?v=1780752551', 'Mehar 2 PCs EMBROIDERY - View 7', false, 7)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('4e0a1873-7bc2-4795-82ef-3e74fb679576', '18d9605c-92fc-4e49-8891-9c5e85d4cf91', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/3I7A3445.webp?v=1780752551', 'Mehar 2 PCs EMBROIDERY - View 8', false, 8)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('5632555b-9cb5-4c9a-8cb1-d5183d52965d', 'Mulberry Bloom 3 PCs EMBROIDERY', 'mulberry-bloom-3-pcs-embroidery', '<p><span style="color: #000000;">This Stitched 3 PCs Include:</span></p>
<ol>
<li style="color: #000000;"><span style="color: #000000;">Shirt</span></li>
<li style="color: #000000;"><span style="color: #000000;">Farshi Trouser</span></li>
<li style="color: #000000;"><span style="color: #000000;">Crinkel White Dupatta with Beautiful Pico </span></li>
</ol>
<p><span style="color: #000000;"><strong>Shirt &amp; Trouser Fabric:</strong> Premium Cotton (Summer Fabric)</span></p>
<p><span style="color: #000000;"><strong>Technique:</strong> Fully Embroidered</span></p>
<p><span style="color: #000000;">Radiate elegance in ‘Mulberry Bloom,’ a striking magenta-toned ensemble featuring a sophisticated blend of intricate thread-work, delicate <strong>schiffli embroidery on the shirt</strong>, and premium appliqué accents. The outfit is paired with a statement off-white farshi-style Trouser, boasting a voluminous ''gher'' and matching embroidered borders at the hem for a truly regal flair. Perfectly blending a modern vibrant palette with a timeless traditional cut, this look is the quintessential choice for a standout Eid celebration.</span></p>', 'TAW-MB3PE-S-0', '90151ef9-20ad-496b-8daf-eef1fb0a8aa9', 'Unstitched / Stitched', 4999, 6500, ', and premium appliqué accents. The outfit is paired with a statement off-white farshi-style Trouser, boasting a voluminous ''gher'' and matching embroidered borders at the hem for a truly regal flair. Perfectly blending a modern vibrant palette with a timeless traditional cut, this look is the quintessential choice for a standout Eid celebration. with matching fabric', '{}', '{"S","M","L","XL"}', true, true, true, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('ce7ddd0b-dc79-440f-86d5-742ae5de26e3', '5632555b-9cb5-4c9a-8cb1-d5183d52965d', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Jul9_2026_07_53_28PM.png?v=1783609114', 'Mulberry Bloom 3 PCs EMBROIDERY - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('ddb175ae-fcbe-4071-8274-b53a000201f5', '5632555b-9cb5-4c9a-8cb1-d5183d52965d', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/ChatGPTImageJul9_2026_07_54_45PM.png?v=1783609114', 'Mulberry Bloom 3 PCs EMBROIDERY - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('6c09dfd4-4af1-4b1d-8125-12edd59577f9', '5632555b-9cb5-4c9a-8cb1-d5183d52965d', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Jul9_2026_07_53_25PM.png?v=1783609114', 'Mulberry Bloom 3 PCs EMBROIDERY - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('a81a7b32-fde4-413d-81cf-25a211c57288', '5632555b-9cb5-4c9a-8cb1-d5183d52965d', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/ChatGPTImageJul9_2026_07_56_28PM.png?v=1783609114', 'Mulberry Bloom 3 PCs EMBROIDERY - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('cc06c4e2-3dae-4ae5-856d-a7a6e587e5c2', 'Elara 2 PCs EMB', 'elara-3-pcs-emb', '<p><span style="color: rgb(0, 0, 0);"><b>Color:</b> Powder Blue and white</span><br><span style="color: rgb(0, 0, 0);"><b>Design detail</b>: Elara is a refreshing powder blue outfit designed with soft elegance. It features a beautifully crafted floral embroidered shirt that adds a delicate and graceful touch. Paired with a classic white shalwar, this ensemble creates a timeless and effortless look. Perfect for warm days, casual gatherings, and everyday charm.</span><span style="color: rgb(0, 0, 0);"></span></p>
<section dir="auto" class="text-token-text-primary w-full focus:outline-none [--shadow-height:45px] has-data-writing-block:pointer-events-none has-data-writing-block:-mt-(--shadow-height) has-data-writing-block:pt-(--shadow-height) [&amp;:has([data-writing-block])&gt;*]:pointer-events-auto [content-visibility:auto] supports-[content-visibility:auto]:[contain-intrinsic-size:auto_100lvh] R6Vx5W_threadScrollVars scroll-mb-[calc(var(--scroll-root-safe-area-inset-bottom,0px)+var(--thread-response-height))] scroll-mt-[calc(var(--header-height)+min(200px,max(70px,20svh)))]">
<div class="text-base my-auto mx-auto pb-10 [--thread-content-margin:var(--thread-content-margin-xs,calc(var(--spacing)*4))] @w-sm/main:[--thread-content-margin:var(--thread-content-margin-sm,calc(var(--spacing)*6))] @w-lg/main:[--thread-content-margin:var(--thread-content-margin-lg,calc(var(--spacing)*16))] px-(--thread-content-margin)">
<div class="[--thread-content-max-width:40rem] @w-lg/main:[--thread-content-max-width:48rem] mx-auto max-w-(--thread-content-max-width) flex-1 group/turn-messages focus-visible:outline-hidden relative flex w-full min-w-0 flex-col agent-turn">
<div class="mt-3 w-full empty:hidden"><span style="color: rgb(0, 0, 0);"><strong>SET INCLUDES : SHIRT + TROUSER</strong></span></div>
</div>
</div>
</section>
<p><span style="color: rgb(0, 0, 0);"><b>Stretch</b>: Low</span><br><span style="color: rgb(0, 0, 0);"><b>Transparency</b>: None</span><br><span style="color: rgb(0, 0, 0);"><b>Hand feel</b>: Soft</span><br><span style="color: rgb(0, 0, 0);"><b>Lining</b>: None</span><br><span style="color: rgb(0, 0, 0);"><b>Material</b>: 100% Premium Cotton</span><br><span style="color: rgb(0, 0, 0);"><b>Size</b>: The model is 5''5" and wears a size SMALL</span><br><span style="color: rgb(0, 0, 0);"><b>Occasion</b>: Daily Wear</span></p>
<p><span style="color: rgb(0, 0, 0);"><b>Note</b>: The actual color of the product may vary slightly from the image.</span></p>
<p><span style="color: rgb(0, 0, 0);">Our Standard Delivery Time is 5 - 8 Days</span></p>', 'TAW-E3PE-S-0', '90151ef9-20ad-496b-8daf-eef1fb0a8aa9', 'Unstitched / Stitched', 3199, 7500, 'Premium Cotton Lawn / Raw Silk', '{}', '{"S","M","L","XL"}', true, true, true, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('7b65882d-f36f-4189-8088-a55fffb988aa', 'cc06c4e2-3dae-4ae5-856d-a7a6e587e5c2', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/DSC01957.webp?v=1780416886', 'Elara 2 PCs EMB - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('16db0260-077d-4068-80e3-e2dc10070644', 'cc06c4e2-3dae-4ae5-856d-a7a6e587e5c2', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/DSC01984.webp?v=1780416886', 'Elara 2 PCs EMB - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('b7b871e0-4fd4-47fc-8aee-cda1d2580faf', 'cc06c4e2-3dae-4ae5-856d-a7a6e587e5c2', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/DSC01982.webp?v=1780416886', 'Elara 2 PCs EMB - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('b695ee3a-5d42-4e54-81bb-72304c2e3a32', 'cc06c4e2-3dae-4ae5-856d-a7a6e587e5c2', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/DSC01954.webp?v=1780416886', 'Elara 2 PCs EMB - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('2531fa38-3ceb-4d7d-8e73-e751153dd8ad', 'cc06c4e2-3dae-4ae5-856d-a7a6e587e5c2', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/DSC02052.webp?v=1780416886', 'Elara 2 PCs EMB - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('2b8346d3-3849-4565-876c-81fd58ae219c', 'cc06c4e2-3dae-4ae5-856d-a7a6e587e5c2', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/DSC02010.webp?v=1780416886', 'Elara 2 PCs EMB - View 6', false, 6)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('2f6ff0e2-61cb-4c50-8983-f4e58e136565', 'cc06c4e2-3dae-4ae5-856d-a7a6e587e5c2', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/DSC01967.webp?v=1780416887', 'Elara 2 PCs EMB - View 7', false, 7)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('429029be-2e20-4c49-880e-ec39fd65cf01', 'RUMI 3 PC EMBROIDERY', 'rumi-3-pc-embroidery', '<p><span style="color: rgb(0, 0, 0);"><strong>Rumi Set includes:</strong></span></p>
<ul>
<li style="font-weight: bold; color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);"><strong>Embroidered shirt</strong></span></li>
<li style="font-weight: bold; color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);"><strong>Farshi shalwar </strong></span></li>
<li style="font-weight: bold; color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);"><strong>Embroidered chiffon dupatta (optional)</strong></span></li>
</ul>
<p><span style="color: rgb(0, 0, 0);"><strong>Model is wearing M size</strong></span></p>
<p><span style="color: rgb(0, 0, 0);"><strong>Fabric: Soft summer cotton </strong></span></p>
<p><span style="color: rgb(0, 0, 0);"><strong>Type: Stitched </strong></span></p>', 'GP-10382350680379-51247277441339', '90151ef9-20ad-496b-8daf-eef1fb0a8aa9', 'Unstitched / Stitched', 4999, 6299, 'Premium Cotton Lawn / Raw Silk', '{}', '{"S","M","L","XL"}', true, true, true, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('ba978219-a3de-462b-83e2-a81d74dfc0f3', '429029be-2e20-4c49-880e-ec39fd65cf01', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/83EA3D67-ED6D-4C10-A329-0E32A3C3ABBC.webp?v=1778593068', 'RUMI 3 PC EMBROIDERY - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('2e47a66f-5a29-408e-8fee-218d7e9782ea', '429029be-2e20-4c49-880e-ec39fd65cf01', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/FFCDB17F-925E-42CE-AE4C-87118DE116EB.webp?v=1778593068', 'RUMI 3 PC EMBROIDERY - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('9127b9a0-cdbf-4b55-86fa-68878b5122dc', '429029be-2e20-4c49-880e-ec39fd65cf01', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/113632A6-961D-46FA-BA7C-61484F8E2948.webp?v=1778593068', 'RUMI 3 PC EMBROIDERY - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('c37c6aba-7eb0-4f2e-8c48-ff4773f850c7', '429029be-2e20-4c49-880e-ec39fd65cf01', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/8FE363E1-AFDB-4242-B4F9-02A8A14FE3CC.webp?v=1778593068', 'RUMI 3 PC EMBROIDERY - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('d2d0021f-d086-4ec9-8c57-b2fc95b01a97', 'NEW MAJESTIC OLIVE', 'new-majestic-olive', '<div class="overflow-hidden rounded-xs border border-gray-200 border-b-0">
<table class="w-full">
<tbody>
<tr>
<td class="font-medium text-gray-700 text-sm py-sm px-xl w-[1/2] bg-gray-50 border-gray-200 border-[1px] border-l-0 border-t-0">Bottom Style</td>
<td class="font-normal text-gray-700 text-sm py-sm px-xl w-[3/4] border-gray-200 border-[1px] border-r-0 border-t-0">Straight trouser</td>
</tr>
<tr>
<td class="font-medium text-gray-700 text-sm py-sm px-xl w-[1/2] bg-gray-50 border-gray-200 border-[1px] border-l-0 border-t-0">Color Type</td>
<td class="font-normal text-gray-700 text-sm py-sm px-xl w-[3/4] border-gray-200 border-[1px] border-r-0 border-t-0">Olive green</td>
</tr>
<tr>
<td class="font-medium text-gray-700 text-sm py-sm px-xl w-[1/2] bg-gray-50 border-gray-200 border-[1px] border-l-0 border-t-0">Dupatta Fabric</td>
<td class="font-normal text-gray-700 text-sm py-sm px-xl w-[3/4] border-gray-200 border-[1px] border-r-0 border-t-0">Chiffon</td>
</tr>
<tr>
<td class="font-medium text-gray-700 text-sm py-sm px-xl w-[1/2] bg-gray-50 border-gray-200 border-[1px] border-l-0 border-t-0">Product ID</td>
<td class="font-normal text-gray-700 text-sm py-sm px-xl w-[3/4] border-gray-200 border-[1px] border-r-0 border-t-0">NHW3547</td>
</tr>
<tr>
<td class="font-medium text-gray-700 text-sm py-sm px-xl w-[1/2] bg-gray-50 border-gray-200 border-[1px] border-l-0 border-t-0">Lining Attached</td>
<td class="font-normal text-gray-700 text-sm py-sm px-xl w-[3/4] border-gray-200 border-[1px] border-r-0 border-t-0">As shown in picture</td>
</tr>
<tr>
<td class="font-medium text-gray-700 text-sm py-sm px-xl w-[1/2] bg-gray-50 border-gray-200 border-[1px] border-l-0 border-t-0">Number Of Pieces</td>
<td class="font-normal text-gray-700 text-sm py-sm px-xl w-[3/4] border-gray-200 border-[1px] border-r-0 border-t-0">3 piece - top + bottom + dupatta</td>
</tr>
<tr>
<td class="font-medium text-gray-700 text-sm py-sm px-xl w-[1/2] bg-gray-50 border-gray-200 border-[1px] border-l-0 border-t-0">Product Type</td>
<td class="font-normal text-gray-700 text-sm py-sm px-xl w-[3/4] border-gray-200 border-[1px] border-r-0 border-t-0">Daily/basic wear</td>
</tr>
<tr>
<td class="font-medium text-gray-700 text-sm py-sm px-xl w-[1/2] bg-gray-50 border-gray-200 border-[1px] border-l-0 border-t-0">Season</td>
<td class="font-normal text-gray-700 text-sm py-sm px-xl w-[3/4] border-gray-200 border-[1px] border-r-0 border-t-0">Summer wear</td>
</tr>
<tr>
<td class="font-medium text-gray-700 text-sm py-sm px-xl w-[1/2] bg-gray-50 border-gray-200 border-[1px] border-l-0 border-t-0">Shirt Fabric</td>
<td class="font-normal text-gray-700 text-sm py-sm px-xl w-[3/4] border-gray-200 border-[1px] border-r-0 border-t-0">Cotton</td>
</tr>
<tr>
<td class="font-medium text-gray-700 text-sm py-sm px-xl w-[1/2] bg-gray-50 border-gray-200 border-[1px] border-l-0 border-t-0">Top Fit</td>
<td class="font-normal text-gray-700 text-sm py-sm px-xl w-[3/4] border-gray-200 border-[1px] border-r-0 border-t-0">Regular fit</td>
</tr>
<tr>
<td class="font-medium text-gray-700 text-sm py-sm px-xl w-[1/2] bg-gray-50 border-gray-200 border-[1px] border-l-0 border-t-0">Top Style</td>
<td class="font-normal text-gray-700 text-sm py-sm px-xl w-[3/4] border-gray-200 border-[1px] border-r-0 border-t-0">Straight kurta</td>
</tr>
<tr>
<td class="font-medium text-gray-700 text-sm py-sm px-xl w-[1/2] bg-gray-50 border-gray-200 border-[1px] border-l-0 border-t-0">Trouser Fabrics</td>
<td class="font-normal text-gray-700 text-sm py-sm px-xl w-[3/4] border-gray-200 border-[1px] border-r-0 border-t-0">Cotton</td>
</tr>
<tr>
<td class="font-medium text-gray-700 text-sm py-sm px-xl w-[1/2] bg-gray-50 border-gray-200 border-[1px] border-l-0 border-t-0">Work Technique</td>
<td class="font-normal text-gray-700 text-sm py-sm px-xl w-[3/4] border-gray-200 border-[1px] border-r-0 border-t-0">Embroidered</td>
</tr>
</tbody>
</table>
</div>
<div class="text-sm text-gray-700 description-text font-regular"><br></div>
<p><span class="text-md text-gray-700 description-text font-medium">Disclaimer:</span></p>
<div class="text-sm text-gray-700 description-text font-regular">Actual product color may vary slightly from the image.</div>', 'GP-10379191517499-51236268474683', '90151ef9-20ad-496b-8daf-eef1fb0a8aa9', 'Unstitched / Stitched', 4500, 10000, 'Premium Cotton Lawn / Raw Silk', '{"3PCS","fashion clothing","ladies two piefce","newarrival","ready to wear"}', '{"S","M","L","XL"}', true, false, true, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('d0e6a31d-bc6d-42b7-8655-16098ad52ee2', 'd2d0021f-d086-4ec9-8c57-b2fc95b01a97', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/20260211171210-2e07735c8a854412-media_image-5903f828fedc451aa9c3c56dea342cef.webp?v=1778330126', 'NEW MAJESTIC OLIVE - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('8c72f221-03a3-49ab-8690-70d3293c5926', 'd2d0021f-d086-4ec9-8c57-b2fc95b01a97', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/20260211171210-3891a53050ea40e4-media_image-44d380b9fe8e473da38c37e21c6a4715.webp?v=1778330126', 'NEW MAJESTIC OLIVE - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('f79af03e-267e-41ba-8435-b7b266cf4ff9', 'd2d0021f-d086-4ec9-8c57-b2fc95b01a97', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/20260211171210-2dd1bb252c884531-media_image-33e1ed5040534610ba76d21728735d37.webp?v=1778330127', 'NEW MAJESTIC OLIVE - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('8a3b914c-17c1-4e16-87c0-b1396793d34c', 'd2d0021f-d086-4ec9-8c57-b2fc95b01a97', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/20260211171210-0a2450dc18944a2b-media_image-12fe392fb5864c048922d236592b833f.webp?v=1778330126', 'NEW MAJESTIC OLIVE - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('83a52645-309b-4a4e-8e74-07ab1256b510', 'Black Elegance', 'black-elegance-1', '<div class="overflow-hidden rounded-xs border border-gray-200 border-b-0">
<table class="w-full">
<tbody>
<tr>
<td class="font-medium text-gray-700 text-sm py-sm px-xl w-[1/2] bg-gray-50 border-gray-200 border-[1px] border-l-0 border-t-0">Bottom Style</td>
<td class="font-normal text-gray-700 text-sm py-sm px-xl w-[3/4] border-gray-200 border-[1px] border-r-0 border-t-0">Straight trouser</td>
</tr>
<tr>
<td class="font-medium text-gray-700 text-sm py-sm px-xl w-[1/2] bg-gray-50 border-gray-200 border-[1px] border-l-0 border-t-0">Color Type</td>
<td class="font-normal text-gray-700 text-sm py-sm px-xl w-[3/4] border-gray-200 border-[1px] border-r-0 border-t-0">Black</td>
</tr>
<tr>
<td class="font-medium text-gray-700 text-sm py-sm px-xl w-[1/2] bg-gray-50 border-gray-200 border-[1px] border-l-0 border-t-0">Product ID</td>
<td class="font-normal text-gray-700 text-sm py-sm px-xl w-[3/4] border-gray-200 border-[1px] border-r-0 border-t-0">JJW1264</td>
</tr>
<tr>
<td class="font-medium text-gray-700 text-sm py-sm px-xl w-[1/2] bg-gray-50 border-gray-200 border-[1px] border-l-0 border-t-0">Lining Attached</td>
<td class="font-normal text-gray-700 text-sm py-sm px-xl w-[3/4] border-gray-200 border-[1px] border-r-0 border-t-0">As shown in picture</td>
</tr>
<tr>
<td class="font-medium text-gray-700 text-sm py-sm px-xl w-[1/2] bg-gray-50 border-gray-200 border-[1px] border-l-0 border-t-0">Number Of Pieces</td>
<td class="font-normal text-gray-700 text-sm py-sm px-xl w-[3/4] border-gray-200 border-[1px] border-r-0 border-t-0">2 piece - top &amp; bottom</td>
</tr>
<tr>
<td class="font-medium text-gray-700 text-sm py-sm px-xl w-[1/2] bg-gray-50 border-gray-200 border-[1px] border-l-0 border-t-0">Product Type</td>
<td class="font-normal text-gray-700 text-sm py-sm px-xl w-[3/4] border-gray-200 border-[1px] border-r-0 border-t-0">Daily/basic wear</td>
</tr>
<tr>
<td class="font-medium text-gray-700 text-sm py-sm px-xl w-[1/2] bg-gray-50 border-gray-200 border-[1px] border-l-0 border-t-0">Season</td>
<td class="font-normal text-gray-700 text-sm py-sm px-xl w-[3/4] border-gray-200 border-[1px] border-r-0 border-t-0">Winter wear</td>
</tr>
<tr>
<td class="font-medium text-gray-700 text-sm py-sm px-xl w-[1/2] bg-gray-50 border-gray-200 border-[1px] border-l-0 border-t-0">Shirt Fabric</td>
<td class="font-normal text-gray-700 text-sm py-sm px-xl w-[3/4] border-gray-200 border-[1px] border-r-0 border-t-0">Dhanak</td>
</tr>
<tr>
<td class="font-medium text-gray-700 text-sm py-sm px-xl w-[1/2] bg-gray-50 border-gray-200 border-[1px] border-l-0 border-t-0">Top Fit</td>
<td class="font-normal text-gray-700 text-sm py-sm px-xl w-[3/4] border-gray-200 border-[1px] border-r-0 border-t-0">Regular fit</td>
</tr>
<tr>
<td class="font-medium text-gray-700 text-sm py-sm px-xl w-[1/2] bg-gray-50 border-gray-200 border-[1px] border-l-0 border-t-0">Top Style</td>
<td class="font-normal text-gray-700 text-sm py-sm px-xl w-[3/4] border-gray-200 border-[1px] border-r-0 border-t-0">Straight cut kurta</td>
</tr>
<tr>
<td class="font-medium text-gray-700 text-sm py-sm px-xl w-[1/2] bg-gray-50 border-gray-200 border-[1px] border-l-0 border-t-0">Trouser Fabrics</td>
<td class="font-normal text-gray-700 text-sm py-sm px-xl w-[3/4] border-gray-200 border-[1px] border-r-0 border-t-0">Dhanak</td>
</tr>
<tr>
<td class="font-medium text-gray-700 text-sm py-sm px-xl w-[1/2] bg-gray-50 border-gray-200 border-[1px] border-l-0 border-t-0">Work Technique</td>
<td class="font-normal text-gray-700 text-sm py-sm px-xl w-[3/4] border-gray-200 border-[1px] border-r-0 border-t-0">Embroidered</td>
</tr>
</tbody>
</table>
</div>
<div class="text-sm text-gray-700 description-text font-regular"><br></div>
<p><span class="text-md text-gray-700 description-text font-medium">Disclaimer:</span></p>
<div class="text-sm text-gray-700 description-text font-regular">Actual product color may vary slightly from the image.</div>', 'GP-10379189813563-51236264542523', '90151ef9-20ad-496b-8daf-eef1fb0a8aa9', 'Unstitched / Stitched', 2989, 6100, 'Premium Cotton Lawn / Raw Silk', '{"2pcs","fashion clothing","ladies two piefce","newarrival","ready to wear"}', '{"S","M","L","XL"}', true, false, true, true, 0)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('60a71b5e-454d-4561-8bf8-5936d64abf3f', '83a52645-309b-4a4e-8e74-07ab1256b510', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/cropped_image-173745718973721_b50029fa-91b9-4a18-9da2-baceeec436b9.webp?v=1778329842', 'Black Elegance - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('88b943a5-8f43-40f9-8af0-b0a7b157e8d0', '83a52645-309b-4a4e-8e74-07ab1256b510', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/cropped_image-173745718972029_a456339d-a269-4796-9301-ccf51b60954e.webp?v=1778329842', 'Black Elegance - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('9995420d-4304-45c9-8f6f-3d61f8372bbb', '83a52645-309b-4a4e-8e74-07ab1256b510', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/cropped_image-173745718940631_d7b2f332-a177-4142-9d72-870efbca77eb.webp?v=1778329842', 'Black Elegance - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('25b7a340-19d2-4d15-84fb-d7de0f7ad2aa', '83a52645-309b-4a4e-8e74-07ab1256b510', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/cropped_image-173745718990805_7d06a236-e547-49db-99cc-773865f67ed8.webp?v=1778329842', 'Black Elegance - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('a3773a02-7eb9-4fc4-87e2-04bcb3ad06d5', '83a52645-309b-4a4e-8e74-07ab1256b510', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/cropped_image-173745718979070_c6b87c9f-052f-49ef-8a28-9e12acf00aa5.webp?v=1778329842', 'Black Elegance - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('dc6c508b-58bb-42b2-8209-22458d4acdf5', '83a52645-309b-4a4e-8e74-07ab1256b510', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/cropped_image-173745718960005_d18b4c96-67ff-4db5-a2bf-176c7fe37837.webp?v=1778329842', 'Black Elegance - View 6', false, 6)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('7672b263-f881-4f47-8bda-42f2e7f58a5f', 'Noir Luxe', 'noir-luxe', '<table class="w-full">
<tbody>
<tr>
<td class="font-medium text-gray-700 text-sm py-sm px-xl w-[1/2] bg-gray-50 border-gray-200 border-[1px] border-l-0 border-t-0">Bottom Style</td>
<td class="font-normal text-gray-700 text-sm py-sm px-xl w-[3/4] border-gray-200 border-[1px] border-r-0 border-t-0">Culottes</td>
</tr>
<tr>
<td class="font-medium text-gray-700 text-sm py-sm px-xl w-[1/2] bg-gray-50 border-gray-200 border-[1px] border-l-0 border-t-0">Color Type</td>
<td class="font-normal text-gray-700 text-sm py-sm px-xl w-[3/4] border-gray-200 border-[1px] border-r-0 border-t-0">Black</td>
</tr>
<tr>
<td class="font-medium text-gray-700 text-sm py-sm px-xl w-[1/2] bg-gray-50 border-gray-200 border-[1px] border-l-0 border-t-0">Dupatta Fabric</td>
<td class="font-normal text-gray-700 text-sm py-sm px-xl w-[3/4] border-gray-200 border-[1px] border-r-0 border-t-0">Chiffon</td>
</tr>
<tr>
<td class="font-medium text-gray-700 text-sm py-sm px-xl w-[1/2] bg-gray-50 border-gray-200 border-[1px] border-l-0 border-t-0">Product ID</td>
<td class="font-normal text-gray-700 text-sm py-sm px-xl w-[3/4] border-gray-200 border-[1px] border-r-0 border-t-0">EGD0509</td>
</tr>
<tr>
<td class="font-medium text-gray-700 text-sm py-sm px-xl w-[1/2] bg-gray-50 border-gray-200 border-[1px] border-l-0 border-t-0">Lining Attached</td>
<td class="font-normal text-gray-700 text-sm py-sm px-xl w-[3/4] border-gray-200 border-[1px] border-r-0 border-t-0">As shown in picture</td>
</tr>
<tr>
<td class="font-medium text-gray-700 text-sm py-sm px-xl w-[1/2] bg-gray-50 border-gray-200 border-[1px] border-l-0 border-t-0">Number Of Pieces</td>
<td class="font-normal text-gray-700 text-sm py-sm px-xl w-[3/4] border-gray-200 border-[1px] border-r-0 border-t-0">3 piece - top + bottom + dupatta</td>
</tr>
<tr>
<td class="font-medium text-gray-700 text-sm py-sm px-xl w-[1/2] bg-gray-50 border-gray-200 border-[1px] border-l-0 border-t-0">Product Type</td>
<td class="font-normal text-gray-700 text-sm py-sm px-xl w-[3/4] border-gray-200 border-[1px] border-r-0 border-t-0">Festive/party wear</td>
</tr>
<tr>
<td class="font-medium text-gray-700 text-sm py-sm px-xl w-[1/2] bg-gray-50 border-gray-200 border-[1px] border-l-0 border-t-0">Season</td>
<td class="font-normal text-gray-700 text-sm py-sm px-xl w-[3/4] border-gray-200 border-[1px] border-r-0 border-t-0">All season</td>
</tr>
<tr>
<td class="font-medium text-gray-700 text-sm py-sm px-xl w-[1/2] bg-gray-50 border-gray-200 border-[1px] border-l-0 border-t-0">Shirt Fabric</td>
<td class="font-normal text-gray-700 text-sm py-sm px-xl w-[3/4] border-gray-200 border-[1px] border-r-0 border-t-0">Chiffon</td>
</tr>
<tr>
<td class="font-medium text-gray-700 text-sm py-sm px-xl w-[1/2] bg-gray-50 border-gray-200 border-[1px] border-l-0 border-t-0">Top Fit</td>
<td class="font-normal text-gray-700 text-sm py-sm px-xl w-[3/4] border-gray-200 border-[1px] border-r-0 border-t-0">Regular fit</td>
</tr>
<tr>
<td class="font-medium text-gray-700 text-sm py-sm px-xl w-[1/2] bg-gray-50 border-gray-200 border-[1px] border-l-0 border-t-0">Top Style</td>
<td class="font-normal text-gray-700 text-sm py-sm px-xl w-[3/4] border-gray-200 border-[1px] border-r-0 border-t-0">Long kurta</td>
</tr>
<tr>
<td class="font-medium text-gray-700 text-sm py-sm px-xl w-[1/2] bg-gray-50 border-gray-200 border-[1px] border-l-0 border-t-0">Trouser Fabrics</td>
<td class="font-normal text-gray-700 text-sm py-sm px-xl w-[3/4] border-gray-200 border-[1px] border-r-0 border-t-0">Poly grip silk</td>
</tr>
<tr>
<td class="font-medium text-gray-700 text-sm py-sm px-xl w-[1/2] bg-gray-50 border-gray-200 border-[1px] border-l-0 border-t-0">Work Technique</td>
<td class="font-normal text-gray-700 text-sm py-sm px-xl w-[3/4] border-gray-200 border-[1px] border-r-0 border-t-0">Embroidered</td>
</tr>
</tbody>
</table>', 'GP-10379183522107-51236247765307', '90151ef9-20ad-496b-8daf-eef1fb0a8aa9', 'Unstitched / Stitched', 5145, NULL, 'Premium Cotton Lawn / Raw Silk', '{"3PCS","fashion clothing","newarrival","ready to wear"}', '{"S","M","L","XL"}', true, false, true, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('1a6058b1-6fc5-4b49-87f5-eaabc517a57a', '7672b263-f881-4f47-8bda-42f2e7f58a5f', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/pixelcut-export_1_-174428980325467_ad8c94af-0090-4f9f-89dd-1c4a93c04274.webp?v=1778328922', 'Noir Luxe - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('9a78f753-c2ef-47c0-832a-6e85ef927796', '7672b263-f881-4f47-8bda-42f2e7f58a5f', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/1740838821394_1744289489475-174428980327825_58a2078d-02f0-44e5-86c5-06e9817c4d81.webp?v=1778328922', 'Noir Luxe - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('30b29ebc-966a-4c47-86e1-a90984b1f2ca', '7672b263-f881-4f47-8bda-42f2e7f58a5f', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/pixelcut-export-174428980328507_699907af-bb6a-41ed-be74-6ee2dfbb82e0.webp?v=1778328922', 'Noir Luxe - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('24fcf3b0-026f-4c86-84ea-f38b335abfcc', 'IZNA 3PC', 'izna-3pc', '<p data-end="125" data-start="81"><strong data-end="125" data-start="81">Izna 3pcs ✨ | GulPash</strong></p>
<p data-end="442" data-start="127">✨ <strong data-end="140" data-start="129">Fabric:</strong> Premium Linen <br data-end="157" data-start="154">✨ <strong data-end="188" data-start="159">Intricate Embroidery Work</strong><br data-end="191" data-start="188">✨ <strong data-end="240" data-start="193">Long, graceful shirt with elegant detailing</strong><br data-end="243" data-start="240">✨ <strong data-end="298" data-start="245">Standard-fit trousers for a sleek and modest look</strong><br data-end="301" data-start="298">✨ <strong data-is-only-node="" data-end="327" data-start="303">Soft Chiffon Dupatta</strong> completing the outfit with a refined touch<br data-end="373" data-start="370">✨ <strong data-end="442" data-start="375">Perfect blend of comfort, elegance, and timeless sophistication</strong></p>
<p data-end="635" data-start="444">🌟 A stunning Cream<em data-end="472" data-start="458">-colored</em> embroidered 3-piece suit crafted in premium Dhank fabric, paired with a beautifull y draped chiffon dupatta — designed to make you stand out with effortless charm.</p>
<p data-end="725" data-start="637">📩 <strong data-end="659" data-start="640">DM to Order Now</strong><br data-end="662" data-start="659">🛍️ <strong data-end="686" data-start="666">Order on Website</strong><br data-end="689" data-start="686">🚚 <strong data-end="725" data-start="692">Nationwide Delivery Available</strong></p>', 'GP-10277820858683-50950131941691', '90151ef9-20ad-496b-8daf-eef1fb0a8aa9', 'Unstitched / Stitched', 5999, 7950, 'Premium Cotton Lawn / Raw Silk', '{}', '{"Standard Size"}', true, true, true, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('3b69d006-246e-4dd5-8e72-cee13940e980', '24fcf3b0-026f-4c86-84ea-f38b335abfcc', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/IMG_2687_JPG_4dc21aa4-35f1-47d2-9fe7-123e330d107a.png?v=1769775422', 'IZNA 3PC - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('6d0101fd-9fac-487e-8bfd-78e9607b5dff', '24fcf3b0-026f-4c86-84ea-f38b335abfcc', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/IMG_2691_484dc484-1ec3-49f3-999b-a9950422fd3e.png?v=1769775422', 'IZNA 3PC - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('d999bef4-0eec-4449-89d3-a8970a4bec21', '24fcf3b0-026f-4c86-84ea-f38b335abfcc', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/IMG_2690_JPG_64565a71-7c07-4a7e-8d5a-1390bc10be11.png?v=1769775422', 'IZNA 3PC - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('d5120857-9311-4d60-8b7a-8cad504770fb', '24fcf3b0-026f-4c86-84ea-f38b335abfcc', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/IMG_2695_JPG_349d94bf-2712-452f-b12b-daeac90c74ec.png?v=1769775422', 'IZNA 3PC - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('d20ee07c-b0eb-4a12-8bab-42c43f3a62db', 'Roshaneh 3Pcs', 'roshaneh-3pcs', '<h3 data-section-id="1d57n9x" data-start="933" data-end="959"><span role="text" style="color: rgb(66, 5, 250);"><strong data-start="937" data-end="957">Product Details:</strong></span></h3>
<ul data-start="960" data-end="1241">
<li data-section-id="igh7bl" data-start="960" data-end="1004" style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);"><strong data-start="962" data-end="979">Article Name:</strong> Roshaneh 3Pcs</span></li>
<li data-section-id="1pw9v0g" data-start="1005" data-end="1040" style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);"><strong data-start="1007" data-end="1024">Shirt Fabric:</strong> Premium Linen</span></li>
<li data-section-id="17i9z58" data-start="1041" data-end="1078" style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);"><strong data-start="1043" data-end="1062">Trouser Fabric:</strong> Linen (Plain)</span></li>
<li data-section-id="ek2tp" data-start="1079" data-end="1110" style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);"><strong data-start="1081" data-end="1100">Dupatta Fabric:</strong> Chiffon</span></li>
<li data-section-id="1dycag0" data-start="1111" data-end="1164" style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);"><strong data-start="1113" data-end="1122">Work:</strong> Embroidered Shirt &amp; plain Dupatta</span></li>
<li data-section-id="16qrsoq" data-start="1165" data-end="1207" style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);"><strong data-start="1167" data-end="1180">Includes:</strong> Shirt, Trouser &amp; Dupatta</span></li>
<li data-section-id="kd0huu" data-start="1208" data-end="1241" style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);"><strong data-start="1210" data-end="1220">Style:</strong> Luxury Ethnic Wear</span></li>
</ul>
<h3 data-section-id="o1351e" data-start="1243" data-end="1287"><span role="text" style="color: rgb(249, 11, 11);"><strong data-start="1247" data-end="1285">Why Choose Roshaneh 3Pcs<span style="color: rgb(0, 0, 0);"> </span>?</strong></span></h3>
<p data-start="1288" data-end="1543"><span style="color: rgb(0, 0, 0);">✔ <strong data-start="1290" data-end="1326">Premium Linen Fabric for Comfort</strong></span><br data-start="1326" data-end="1329"><span style="color: rgb(0, 0, 0);">✔ <strong data-start="1331" data-end="1367">Elegant Embroidered Shirt Design</strong></span><br data-start="1367" data-end="1370"><span style="color: rgb(0, 0, 0);">✔ <strong data-start="1372" data-end="1412">Graceful Chiffon Embroidered Dupatta</strong></span><br data-start="1412" data-end="1415"><span style="color: rgb(0, 0, 0);">✔ <strong data-start="1417" data-end="1451">Simple Trouser for Classy Look</strong></span><br data-start="1451" data-end="1454" data-is-only-node=""><span style="color: rgb(0, 0, 0);">✔ <strong data-start="1456" data-end="1493">Perfect for Festive &amp; Casual Wear</strong></span><br data-start="1493" data-end="1496"><span style="color: rgb(0, 0, 0);">✔ <strong data-start="1498" data-end="1541">High-Quality Stitching &amp; Premium Finish</strong></span></p>
<p data-start="1545" data-end="1654" data-is-last-node="" data-is-only-node=""><span style="color: rgb(0, 0, 0);">Add a touch of sophistication to your wardrobe with Roshaneh 3Pcs<strong data-start="1597" data-end="1623"> </strong>— where luxury meets elegance.</span></p>', 'GP-10364056404283-51209885024571', 'eb8a2f48-1c92-495b-8a7f-2b18de2a8c6e', 'woman', 6499, 8860, 'Premium Cotton Lawn / Raw Silk', '{"FloralsPremiumLawn3Pcs","meadowgrace"}', '{"S","M","L","XL"}', true, true, true, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('b9df6e3d-3a64-45fe-8036-56f0f2307f22', 'd20ee07c-b0eb-4a12-8bab-42c43f3a62db', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/MaaheZrmny-2623_jpg_1.png?v=1777640850', 'Roshaneh 3Pcs - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('fd9a3868-64da-463d-818a-2a77965c018c', 'd20ee07c-b0eb-4a12-8bab-42c43f3a62db', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/MaaheZrmny-2637_jpg_2.png?v=1777640850', 'Roshaneh 3Pcs - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('aa0643d5-8653-4922-8d06-f24841ac1d27', 'd20ee07c-b0eb-4a12-8bab-42c43f3a62db', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/MaaheZrmny-2637_jpg_1.png?v=1777640850', 'Roshaneh 3Pcs - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('919bd3e1-4446-47cf-84f9-ea1103c095b8', 'd20ee07c-b0eb-4a12-8bab-42c43f3a62db', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/MaaheZrmny-2676_jpg.png?v=1777640850', 'Roshaneh 3Pcs - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('0b6e241c-2e12-4cc8-81b6-8a3706880389', 'd20ee07c-b0eb-4a12-8bab-42c43f3a62db', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/MaaheZrmny-2700_jpg.png?v=1777640850', 'Roshaneh 3Pcs - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('2743c904-464d-4f86-85f6-70dc092c5b20', 'd20ee07c-b0eb-4a12-8bab-42c43f3a62db', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/MaaheZrmny-2666_jpg.png?v=1777640850', 'Roshaneh 3Pcs - View 6', false, 6)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('3f4fe0e4-5a61-4c4b-829b-326b17c8d59b', 'd20ee07c-b0eb-4a12-8bab-42c43f3a62db', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/MaaheZrmny-2637_jpg.png?v=1777640850', 'Roshaneh 3Pcs - View 7', false, 7)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('35f0f2d3-5250-4cd5-8404-a25c052b32f8', 'd20ee07c-b0eb-4a12-8bab-42c43f3a62db', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/MaaheZrmny-2623_jpg.png?v=1777640850', 'Roshaneh 3Pcs - View 8', false, 8)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('d2e352fa-f3ac-4907-86a3-dc849766e49f', 'Parisa 3Pcs', 'parisa-3pcs', '<h3 data-end="959" data-start="933" data-section-id="1d57n9x"><span style="color: rgb(66, 5, 250);" role="text"><strong data-end="957" data-start="937">Product Details:</strong></span></h3>
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
<p data-is-only-node="" data-is-last-node="" data-end="1654" data-start="1545"><span style="color: rgb(0, 0, 0);">Add a touch of sophistication to your wardrobe with <strong data-end="1623" data-start="1597">Parisa 3Pcs </strong>— where luxury meets elegance.</span></p>', 'GP-10364053193019-51209879912763', 'eb8a2f48-1c92-495b-8a7f-2b18de2a8c6e', 'woman', 6499, 8860, 'Premium Cotton Lawn / Raw Silk', '{"FloralsPremiumLawn3Pcs","meadowgrace"}', '{"S","M","L","XL"}', true, true, true, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('972e5fe1-5182-4e87-820a-371ea073e138', 'd2e352fa-f3ac-4907-86a3-dc849766e49f', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Ava_5__jpg.jpg?v=1777640217', 'Parisa 3Pcs - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('922a0b34-5e41-4062-88eb-7a75b4078ece', 'd2e352fa-f3ac-4907-86a3-dc849766e49f', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Ava_6__jpg.jpg?v=1777640217', 'Parisa 3Pcs - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('f859297c-07a8-4d9c-84ab-51d67a530fda', 'd2e352fa-f3ac-4907-86a3-dc849766e49f', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Ava_3__jpg.jpg?v=1777640217', 'Parisa 3Pcs - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('6be32834-7fa2-4675-8444-1148084cb3a5', 'd2e352fa-f3ac-4907-86a3-dc849766e49f', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Ava_1__jpg_1.jpg?v=1777640217', 'Parisa 3Pcs - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('21f1a118-280a-45fa-89ef-ae6c513cdb2f', 'd2e352fa-f3ac-4907-86a3-dc849766e49f', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Ava_4__jpg_1.jpg?v=1777640217', 'Parisa 3Pcs - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('b0070277-4580-4209-8109-0fa801b62839', 'd2e352fa-f3ac-4907-86a3-dc849766e49f', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Ava_4__jpg.jpg?v=1777640217', 'Parisa 3Pcs - View 6', false, 6)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('1f1e63f0-7023-4150-8b2d-83803f3b55eb', 'd2e352fa-f3ac-4907-86a3-dc849766e49f', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Ava_2__jpg.jpg?v=1777640217', 'Parisa 3Pcs - View 7', false, 7)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('2deba161-c048-41b9-8b6a-0ea73d93caf5', 'Zohra 3Pcs', 'zohra-3pcs', '<p><span style="color: rgb(0, 0, 0);"><!-- TRUST BADGES (LARGE + PREMIUM) --></span></p>
<div style="display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin-bottom: 14px; font-size: 14px;"><br></div>
<h2 style="font-weight: 600; margin-bottom: 6px;"><span style="color: rgb(0, 0, 0);">Zohra — Blush Pink Elegance 3Pcs</span></h2>
<p data-start="171" data-end="227"><strong data-start="171" data-end="227">Cotton Lawn Shirt • Cotton Trouser • Chiffon Dupatta</strong></p>
<p data-start="229" data-end="520">A graceful summer ensemble designed in a soft blush pink tone, combining elegance with effortless style. Featuring an intricately embroidered cotton lawn kurta paired with a matching trouser and a lightweight chiffon dupatta, <em data-start="455" data-end="462">Zohra</em> reflects a beautiful blend of tradition and modern charm.</p>
<hr data-start="522" data-end="525">
<p data-start="527" data-end="748"><strong data-start="527" data-end="549">Product Highlights</strong><br data-start="549" data-end="552">Embroidered cotton lawn kurta<br data-start="581" data-end="584">Elegant and breathable summer fabric<br data-start="620" data-end="623">Stylish straight trouser with subtle detailing<br data-start="669" data-end="672">Lightweight chiffon dupatta with soft drape<br data-start="715" data-end="718">3-piece ready-to-wear outfit</p>
<hr data-start="750" data-end="753">
<p data-start="755" data-end="914"><strong data-start="755" data-end="772">Fabric &amp; Feel</strong><br data-start="772" data-end="775">Crafted with breathable cotton lawn for all-day comfort in summer, paired with a soft chiffon dupatta that adds a graceful and airy finish.</p>
<hr data-start="916" data-end="919">
<p data-start="921" data-end="1064"><strong data-start="921" data-end="933">Occasion</strong><br data-start="933" data-end="936">Perfect for casual wear, daytime outings, and festive gatherings — designed to keep you cool while looking effortlessly elegant.</p>
<hr data-start="1066" data-end="1069">
<p data-start="1071" data-end="1337"><strong data-start="1071" data-end="1090">Product Details</strong><br data-start="1090" data-end="1093">Number of Pieces: 3 (Shirt + Trouser + Dupatta)<br data-start="1140" data-end="1143">Shirt Fabric: Cotton Lawn<br data-start="1168" data-end="1171">Trouser Fabric: Cotton<br data-start="1193" data-end="1196">Dupatta Fabric: Chiffon<br data-start="1219" data-end="1222">Top Style: Embroidered Kurta<br data-start="1250" data-end="1253">Trouser Type: Straight Trouser<br data-start="1283" data-end="1286">Work Technique: Embroidered<br data-start="1313" data-end="1316">Season: Summer Wear</p>
<hr data-start="1339" data-end="1342">
<p data-start="1344" data-end="1481"><strong data-start="1344" data-end="1366">Delivery &amp; Payment</strong><br data-start="1366" data-end="1369">Cash on Delivery available nationwide<br data-start="1406" data-end="1409">Fast shipping across Pakistan<br data-start="1438" data-end="1441">Carefully packed for quality assurance</p>
<hr data-start="1483" data-end="1486">
<p data-start="1488" data-end="1547"><strong data-start="1488" data-end="1547">Limited pieces available — restocks are not guaranteed</strong></p>', 'GP-10363343470907-51207656046907', '238b9607-7157-468b-82ad-49fd47f535f7', 'Clothing', 4999, 8199, 'Premium Cotton Lawn / Raw Silk', '{"3PCS","Bloom pret","farshi shalwar","fashion clothing","lawndress","newarrival","ready to wear"}', '{"S","M","L","XL"}', true, true, true, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('5d637304-9b04-4a29-80e4-d4b457d17773', '2deba161-c048-41b9-8b6a-0ea73d93caf5', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/imgi_96_MSS-5751_3_fe45d47b-39a0-4cfb-8c50-73b86c82f29a_jpg.jpg?v=1777546756', 'Zohra 3Pcs - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('491f98c1-0b71-465e-8ebf-bd98d4a852c4', '2deba161-c048-41b9-8b6a-0ea73d93caf5', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/imgi_87_MSS-5751_1_7bc2a31b-20cc-4ee9-ad7b-43690aa61f90_jpg.jpg?v=1777546755', 'Zohra 3Pcs - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('56b06940-254c-4060-89e0-87c037408549', '2deba161-c048-41b9-8b6a-0ea73d93caf5', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/imgi_106_MSS-5751_4_7c02e11c-1db1-4fb1-824e-008db0805243_jpg.jpg?v=1777546756', 'Zohra 3Pcs - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('14c02431-f4e2-4753-8316-7438e9889a0d', '2deba161-c048-41b9-8b6a-0ea73d93caf5', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/imgi_114_MSS-5751_5_1f926732-5194-4bc3-8c73-0fce28a36219_jpg.jpg?v=1777546756', 'Zohra 3Pcs - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('a6ea17b7-590f-4f76-8c41-374034ec75aa', 'Noor-e-Naz Luxury 3Pcs', 'noor-e-naz-luxury-3pcs', '<h3 data-section-id="1d57n9x" data-start="933" data-end="959"><span role="text" style="color: rgb(66, 5, 250);"><strong data-start="937" data-end="957">Product Details:</strong></span></h3>
<ul data-start="960" data-end="1241">
<li data-section-id="igh7bl" data-start="960" data-end="1004" style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);"><strong data-start="962" data-end="979">Article Name:</strong> Noor-e-Naz Luxury 3Pcs</span></li>
<li data-section-id="1pw9v0g" data-start="1005" data-end="1040" style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);"><strong data-start="1007" data-end="1024">Shirt Fabric:</strong> Premium Cotton </span></li>
<li data-section-id="17i9z58" data-start="1041" data-end="1078" style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);"><strong data-start="1043" data-end="1062">Trouser Fabric:</strong> Linen (Plain)</span></li>
<li data-section-id="ek2tp" data-start="1079" data-end="1110" style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);"><strong data-start="1081" data-end="1100">Dupatta Fabric:</strong> Organza</span></li>
<li data-section-id="1dycag0" data-start="1111" data-end="1164" style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);"><strong data-start="1113" data-end="1122">Work:</strong> Embroidered Shirt &amp; Embroidered Dupatta</span></li>
<li data-section-id="16qrsoq" data-start="1165" data-end="1207" style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);"><strong data-start="1167" data-end="1180">Includes:</strong> Shirt, Trouser &amp; Dupatta</span></li>
<li data-section-id="kd0huu" data-start="1208" data-end="1241" style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);"><strong data-start="1210" data-end="1220">Style:</strong> Luxury Ethnic Wear</span></li>
</ul>
<h3 data-section-id="o1351e" data-start="1243" data-end="1287"><span role="text" style="color: rgb(249, 11, 11);"><strong data-start="1247" data-end="1285">Why Choose Noor-e-Naz Luxury 3Pcs?</strong></span></h3>
<p data-start="1288" data-end="1543"><span style="color: rgb(0, 0, 0);">✔ <strong data-start="1290" data-end="1326">Premium Linen Fabric for Comfort</strong></span><br data-start="1326" data-end="1329"><span style="color: rgb(0, 0, 0);">✔ <strong data-start="1331" data-end="1367">Elegant Embroidered Shirt Design</strong></span><br data-start="1367" data-end="1370"><span style="color: rgb(0, 0, 0);">✔ <strong data-start="1372" data-end="1412">Graceful Organza Embroidered Dupatta</strong></span><br data-start="1412" data-end="1415"><span style="color: rgb(0, 0, 0);">✔ <strong data-start="1417" data-end="1451">Simple Trouser for Classy Look</strong></span><br data-start="1451" data-end="1454" data-is-only-node=""><span style="color: rgb(0, 0, 0);">✔ <strong data-start="1456" data-end="1493">Perfect for Festive &amp; Casual Wear</strong></span><br data-start="1493" data-end="1496"><span style="color: rgb(0, 0, 0);">✔ <strong data-start="1498" data-end="1541">High-Quality Stitching &amp; Premium Finish</strong></span></p>
<p data-start="1545" data-end="1654" data-is-last-node="" data-is-only-node=""><span style="color: rgb(0, 0, 0);">Add a touch of sophistication to your wardrobe with <strong data-start="1597" data-end="1623">Noor-e-Naz Luxury 3Pcs</strong> — where luxury meets elegance.</span></p>', 'TAW-NL3-S-0', 'eb8a2f48-1c92-495b-8a7f-2b18de2a8c6e', 'woman', 6499, 8860, 'Premium Cotton Lawn / Raw Silk', '{"FloralsPremiumLawn3Pcs","meadowgrace"}', '{"S","M","L","XL"}', true, true, true, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('e88e9057-3071-43fd-8247-bb3c67e1c7cd', 'a6ea17b7-590f-4f76-8c41-374034ec75aa', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Untitled-1_0097_DSC02955.jpg?v=1777378910', 'Noor-e-Naz Luxury 3Pcs - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('75228caa-813f-4bdf-8923-afd1b5d1ab74', 'a6ea17b7-590f-4f76-8c41-374034ec75aa', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Untitled-1_0094_DSC02995.jpg?v=1777378910', 'Noor-e-Naz Luxury 3Pcs - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('d7270065-f3e9-4f99-8e54-ddc5cb0ff6fd', 'a6ea17b7-590f-4f76-8c41-374034ec75aa', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Untitled-1_0096_DSC02958.jpg?v=1777378910', 'Noor-e-Naz Luxury 3Pcs - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('881c2ecb-70ca-42b4-860a-c18e24188e56', 'a6ea17b7-590f-4f76-8c41-374034ec75aa', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Untitled-1_0093_DSC03008.jpg?v=1777378910', 'Noor-e-Naz Luxury 3Pcs - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('2bb9d3f7-8c4d-41b0-8845-0bc41fd66e90', 'SWEETIE 3 PC EMBROIDERY', 'sweetie-3-pc-embroidery', '<p><span style="color: rgb(0, 0, 0);"><strong>SWEET 3 PC EMBROIDERY INCLUDES</strong></span></p>
<ul>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Embroidered shirt with sequin and zari work </span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Embroidered shalwar with sequin and zari work</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Printed chiffon dupatta <br><br></span></li>
</ul>
<p><span style="color: rgb(0, 0, 0);">Model is wearing Medium size</span></p>
<p><span style="color: rgb(0, 0, 0);"><strong>Fabric: Soft cotton</strong></span></p>
<p><span style="color: rgb(0, 0, 0);"><strong>Stitched</strong></span></p>', 'TAW-SE3-S-2', '90151ef9-20ad-496b-8daf-eef1fb0a8aa9', 'Unstitched / Stitched', 3999, 6199, 'Premium Cotton Lawn / Raw Silk', '{}', '{"S","M","L","XL"}', true, true, true, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('847667c4-fd9c-4e4b-821b-49c7fce87453', '2bb9d3f7-8c4d-41b0-8845-0bc41fd66e90', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/E3F1B20A-11C9-489B-9A39-FCB111246529.webp?v=1776789610', 'SWEETIE 3 PC EMBROIDERY - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('f3754b35-5bdc-40e2-8b5f-949c953717fb', '2bb9d3f7-8c4d-41b0-8845-0bc41fd66e90', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/DA5CAD5C-F799-4A5F-928D-797373C8254E.webp?v=1776789610', 'SWEETIE 3 PC EMBROIDERY - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('7c497958-f4d7-4bb2-8c5b-17355cd17b6d', '2bb9d3f7-8c4d-41b0-8845-0bc41fd66e90', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/CB38AA11-7E49-4CA6-BC3C-86EC7C13588B.webp?v=1776789610', 'SWEETIE 3 PC EMBROIDERY - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('4cd211ab-47de-4a13-8ea7-2319695f59b2', '2bb9d3f7-8c4d-41b0-8845-0bc41fd66e90', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/B1E5A594-4A93-46EE-9532-50DFA838AF6E.webp?v=1776789625', 'SWEETIE 3 PC EMBROIDERY - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('1e4eb81e-41d6-484f-8507-7c42f4e98e87', '2bb9d3f7-8c4d-41b0-8845-0bc41fd66e90', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/25854EE7-1BDA-401D-8FBF-5D1240F0893A.webp?v=1776789610', 'SWEETIE 3 PC EMBROIDERY - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('c085a81b-1df4-4308-899b-8cc4c7a5450e', 'ZAARIF - COTTON 2 PC EMB', 'zaarif-cotton-3-pc-emb', '<p><span style="color: rgb(0, 0, 0);"><!-- TRUST BADGES (LARGE + PREMIUM) --></span></p>
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
<p style="font-size: 13px; color: #555; margin-top: 5px;"><span style="color: rgb(0, 0, 0);">Limited pieces available — restocks are not guaranteed.</span></p>', 'GP-10352489496891-51179307761979', '90151ef9-20ad-496b-8daf-eef1fb0a8aa9', 'Unstitched / Stitched', 4499, 8000, 'Premium Cotton Lawn / Raw Silk', '{}', '{"S","M","L","XL"}', true, true, true, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('e0ad05fe-b43e-421c-8147-be4a4156ea17', 'c085a81b-1df4-4308-899b-8cc4c7a5450e', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/DSC07527_jpg.jpg?v=1776437150', 'ZAARIF - COTTON 2 PC EMB - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('7bdddad9-e70b-4eb1-8fde-c50be3b1d326', 'c085a81b-1df4-4308-899b-8cc4c7a5450e', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/DSC07646.jpg?v=1776437150', 'ZAARIF - COTTON 2 PC EMB - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('654f7ad1-6e9f-46ba-857f-1ecfbbcfa01b', 'c085a81b-1df4-4308-899b-8cc4c7a5450e', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/DSC07607.jpg?v=1776437150', 'ZAARIF - COTTON 2 PC EMB - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('80c8d3d8-073d-44c7-8723-d7a97a01e045', 'c085a81b-1df4-4308-899b-8cc4c7a5450e', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/DSC07586.jpg?v=1776437150', 'ZAARIF - COTTON 2 PC EMB - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('976a7b5c-405a-4982-82ce-2141535e9fd4', 'c085a81b-1df4-4308-899b-8cc4c7a5450e', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/DSC07610.jpg?v=1776437150', 'ZAARIF - COTTON 2 PC EMB - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('8ceae4cb-e42b-4610-8517-b0bf26d9e995', 'c085a81b-1df4-4308-899b-8cc4c7a5450e', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/DSC07649.jpg?v=1776437150', 'ZAARIF - COTTON 2 PC EMB - View 6', false, 6)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('c736aa3f-222d-4dbc-8dd9-81ea863194a3', 'c085a81b-1df4-4308-899b-8cc4c7a5450e', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/DSC07591.jpg?v=1776437150', 'ZAARIF - COTTON 2 PC EMB - View 7', false, 7)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('8497ab44-9624-4c9c-83d2-19d1a1cb8505', 'Rina', 'camel-brown-linen-3-piece', '<p><span style="color: rgb(0, 0, 0);"><!-- TRUST BADGES (LARGE + PREMIUM) --></span></p>
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
<p style="font-size: 13px; color: #555; margin-top: 5px;"><span style="color: rgb(0, 0, 0);">Limited pieces available — restocks are not guaranteed.</span></p>', 'GP-10341072699707-51135296536891', 'eb8a2f48-1c92-495b-8a7f-2b18de2a8c6e', 'woman', 6499, 8550, 'Premium Cotton Lawn / Raw Silk', '{"FloralsPremiumLawn3Pcs","meadowgrace"}', '{"S","M","L","XL"}', true, true, true, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('f01b3671-b38f-452e-8473-e8e07cd7bbce', '8497ab44-9624-4c9c-83d2-19d1a1cb8505', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Thefirstofmany_simpleyetmodern-amusthaveforyouriftaarevents_Staytunedforthela_3.jpg?v=1775923770', 'Rina - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('53822dec-0642-477d-82e0-62aebef572b8', '8497ab44-9624-4c9c-83d2-19d1a1cb8505', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Thefirstofmany_simpleyetmodern-amusthaveforyouriftaarevents_Staytunedforthela_2.jpg?v=1775923770', 'Rina - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('70fa852f-bc91-4749-8d4f-1fbcc4f1168e', '8497ab44-9624-4c9c-83d2-19d1a1cb8505', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Thefirstofmany_simpleyetmodern-amusthaveforyouriftaarevents_Staytunedforthela_1.jpg?v=1775923770', 'Rina - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('23040b45-c8c5-4dd1-8544-190254692a12', '8497ab44-9624-4c9c-83d2-19d1a1cb8505', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Thefirstofmany_simpleyetmodern-amusthaveforyouriftaarevents_Staytunedforthela.jpg?v=1775923770', 'Rina - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('0c50bfb0-2e11-4dcf-845b-ca6d96a959c9', 'MULTI FOWER 3PCS', 'florals-premium-cotton-3pcs', '<p><span style="color: rgb(0, 0, 0);"><!-- TRUST BADGES (LARGE + PREMIUM) --></span></p>
<div style="display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin-bottom: 14px; font-size: 14px;"><br></div>
<div class="flex flex-col"><span class="text-sm font-normal text-gray-500">MULTI FOWER 3PCS</span></div>
<h2 style="font-weight: 600; margin-bottom: 6px;"><span style="color: rgb(0, 0, 0);"> — Embroidered Cotton 3Pcs</span></h2>
<p style="font-size: 13px; color: #c59d5f; margin-bottom: 8px;"><span style="color: rgb(245, 10, 10);"><strong>🌸 Summer Favorite • Premium Embroidered</strong></span></p>
<h4 style="font-size: 13px; color: #888; margin-bottom: 8px;"><strong><span style="color: rgb(0, 0, 0);">Premium Cotton Embroidered &amp; Floral Shirt • Trouser • Dupatta Included</span></strong></h4>
<p style="font-size: 14px; line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">A soft and refreshing 3-piece floral ensemble enhanced with delicate embroidery, designed for effortless summer elegance. Florals combines printed beauty with intricate embroidery on premium cotton, creating a feminine and premium look that stands out.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><strong><span style="color: rgb(0, 0, 0);">Product Highlights</span></strong></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Premium cotton embroidered &amp; floral shirt</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Delicate embroidery with soft floral design</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Long graceful shirt with elegant fall</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Standard-fit trouser for balanced styling</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Matching dupatta for a complete outfit</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">3-piece ready-to-wear ensemble</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><strong><span style="color: rgb(0, 0, 0);">Fabric &amp; Feel</span></strong></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Crafted from breathable premium cotton, offering a lightweight and soft feel — enhanced with embroidery for a refined and elegant finish.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><strong><span style="color: rgb(0, 0, 0);">Occasion</span></strong></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Ideal for daily wear, casual outings, and daytime gatherings — designed to give you a fresh, feminine, and elegant appearance.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><strong><span style="color: rgb(0, 0, 0);">Product Details</span></strong></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fabric: Premium Cotton</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Work: Embroidered + Floral Print</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Pieces: 3 (Shirt + Trouser + Dupatta)</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Style: Long-length graceful shirt</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Season: Summer Wear</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><strong><span style="color: rgb(0, 0, 0);">Delivery &amp; Payment</span></strong></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Cash on Delivery available nationwide</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fast shipping across Pakistan</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Carefully packed for quality assurance</span></li>
</ul>
<p style="font-size: 13px; color: #555; margin-top: 5px;"><span style="color: rgb(0, 0, 0);">Limited pieces available — restocks are not guaranteed.</span></p>', 'GP-10333013541179-51107043836219', 'eb8a2f48-1c92-495b-8a7f-2b18de2a8c6e', 'woman', 7499, 8860, 'Premium Cotton Lawn / Raw Silk', '{"FloralsPremiumLawn3Pcs","meadowgrace"}', '{"S","M","L","XL"}', true, true, true, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('9d36d3cc-e292-40f2-8659-f92febceabfb', '0c50bfb0-2e11-4dcf-845b-ca6d96a959c9', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/050A7010_1.jpg?v=1775662680', 'MULTI FOWER 3PCS - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('ec6083ac-d795-41f8-8e4d-dde315864f6b', '0c50bfb0-2e11-4dcf-845b-ca6d96a959c9', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/050A7003_3.jpg?v=1775662679', 'MULTI FOWER 3PCS - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('d25d7e3e-0896-43e1-803a-00e5bcbb654d', '0c50bfb0-2e11-4dcf-845b-ca6d96a959c9', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/050A7003_2.jpg?v=1775662682', 'MULTI FOWER 3PCS - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('0638d3cc-118f-4658-8db3-db7425def07d', '0c50bfb0-2e11-4dcf-845b-ca6d96a959c9', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/050A7016.jpg?v=1775662679', 'MULTI FOWER 3PCS - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('0fc4b0e1-d319-41ba-887a-9b9371876b82', '0c50bfb0-2e11-4dcf-845b-ca6d96a959c9', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/050A7018.jpg?v=1775662679', 'MULTI FOWER 3PCS - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('76b076f5-d338-4444-8c16-d400cbcf8537', '0c50bfb0-2e11-4dcf-845b-ca6d96a959c9', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/050A7050.jpg?v=1775662679', 'MULTI FOWER 3PCS - View 6', false, 6)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('2316c2ab-13fc-431b-8813-0d273fe2a9ea', '0c50bfb0-2e11-4dcf-845b-ca6d96a959c9', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/050A7003.jpg?v=1775662679', 'MULTI FOWER 3PCS - View 7', false, 7)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('e55417e5-e933-4996-8b9a-9408cbe83481', 'Meadow Grace 3Pc EMB', 'meadow-grace-3pc-emb', '<p><span style="color: rgb(0, 0, 0);"><!-- TRUST BADGES (LARGE + PREMIUM) --></span></p>
<div style="display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin-bottom: 14px; font-size: 14px;"></div>
<h2 style="font-weight: 600; margin-bottom: 6px;"><span style="color: rgb(0, 0, 0);">Meadow Grace — Refined Linen Elegance</span></h2>
<p style="font-size: 13px; color: #888; margin-bottom: 8px;"><strong><span style="color: rgb(0, 0, 0);">Premium Linen Shirt &amp; Trouser • Chiffon Dupatta</span></strong></p>
<p style="font-size: 14px; line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">A thoughtfully crafted 3-piece ensemble made from premium linen and paired with a delicate chiffon dupatta. Designed for effortless sophistication, it offers breathable comfort with a graceful, polished look.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Product Details</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Embroidered linen shirt with fine detailing</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Coordinated trouser for a structured finish</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Soft chiffon dupatta adding lightness and flow</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Fabric &amp; Feel</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Breathable linen fabric for all-day comfort, paired with an airy chiffon dupatta that adds a soft, elegant movement.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Occasion</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Perfect for daytime wear, office settings, and intimate gatherings.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Delivery &amp; Payment</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Cash on Delivery available nationwide</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fast shipping across Pakistan</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Carefully packed for quality assurance</span></li>
</ul>
<p style="font-size: 13px; color: #555; margin-top: 5px;"><span style="color: rgb(0, 0, 0);">Limited pieces available — restocks are not guaranteed.</span></p>', 'GP-10323012387131-51082348069179', 'eb8a2f48-1c92-495b-8a7f-2b18de2a8c6e', 'woman', 6499, 8299, 'Premium Cotton Lawn / Raw Silk', '{"meadowgrace"}', '{"S","Black","M","L","XL"}', true, true, true, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('e9bf950d-f0c5-4d5c-8e94-b6a74c433f0b', 'e55417e5-e933-4996-8b9a-9408cbe83481', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Vintage23rdDec-302_1.jpg?v=1774870997', 'Meadow Grace 3Pc EMB - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('970c9a06-a04f-4e1d-8720-c534e7bbdb46', 'e55417e5-e933-4996-8b9a-9408cbe83481', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/WhatsApp_Image_2026-01-29_at_4_X-Design.png?v=1778081061', 'Meadow Grace 3Pc EMB - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('6e88e078-ddbf-4b08-8798-e4756008a731', 'e55417e5-e933-4996-8b9a-9408cbe83481', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Vintage23rdDec-312.jpg?v=1775056469', 'Meadow Grace 3Pc EMB - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('aa4e9f01-4a01-4a7a-8cff-502351bbc582', 'e55417e5-e933-4996-8b9a-9408cbe83481', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/WhatsApp_Image_2026-01-29_at_4_X-Design_1.png?v=1778081058', 'Meadow Grace 3Pc EMB - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('446b28ed-529b-42c5-80e6-a548a6cc324a', 'e55417e5-e933-4996-8b9a-9408cbe83481', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Vintage23rdDec-397.jpg?v=1775056469', 'Meadow Grace 3Pc EMB - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('09ee4143-1c05-416e-8c22-937460fa3a7d', 'e55417e5-e933-4996-8b9a-9408cbe83481', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/WhatsApp_Image_2026-01-29_at_4_X-Design_3.png?v=1778081053', 'Meadow Grace 3Pc EMB - View 6', false, 6)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('9ebb189d-0460-4c43-8081-0bf07cfc19d4', 'e55417e5-e933-4996-8b9a-9408cbe83481', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Vintage23rdDec-319.jpg?v=1775056469', 'Meadow Grace 3Pc EMB - View 7', false, 7)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('35f50d70-3853-49f2-870b-9671008c18cb', 'e55417e5-e933-4996-8b9a-9408cbe83481', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/WhatsApp_Image_2026-01-29_at_4_X-Design_2.png?v=1778081053', 'Meadow Grace 3Pc EMB - View 8', false, 8)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('5c5a56cd-876f-4589-8b77-f6c20c599f85', 'e55417e5-e933-4996-8b9a-9408cbe83481', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/ChatGPT_Image_Apr_1_2026_07_32_02_PM.png?v=1775056469', 'Meadow Grace 3Pc EMB - View 9', false, 9)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('75e2fac8-df7f-4a51-8369-ece07856463c', 'e55417e5-e933-4996-8b9a-9408cbe83481', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/WhatsApp_Image_2026-01-29_at_4_X-Design_4.png?v=1778081054', 'Meadow Grace 3Pc EMB - View 10', false, 10)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('ffcaa58a-18b6-4a0c-8603-30ef7972a2ae', 'e55417e5-e933-4996-8b9a-9408cbe83481', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Vintage23rdDec-309.jpg?v=1775056469', 'Meadow Grace 3Pc EMB - View 11', false, 11)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('334907a5-b18e-4895-8563-d126ef81414e', 'Armeen 3pcs', 'armeen-3pcs', '<p><span style="color: rgb(0, 0, 0);"><!-- TRUST BADGES (LARGE + PREMIUM) --></span></p>
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
<p style="font-size: 13px; color: #555; margin-top: 5px;"><span style="color: rgb(0, 0, 0);">Limited pieces available — restocks are not guaranteed.</span></p>', 'GP-10301757948219-51019441144123', 'eb8a2f48-1c92-495b-8a7f-2b18de2a8c6e', 'woman', 6499, 8250, 'Premium Cotton Lawn / Raw Silk', '{"armeen"}', '{"Black"}', true, true, true, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('4fb4232f-15eb-47b6-8e83-a68db48d7fa3', '334907a5-b18e-4895-8563-d126ef81414e', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/1_e908f076-38a6-4c33-a784-da13a142a343.png?v=1774535145', 'Armeen 3pcs - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('8b69af55-5cc4-4a46-8f77-6c443421c57e', '334907a5-b18e-4895-8563-d126ef81414e', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/2_70236901-d0af-42e4-aa54-bcefc62cfb8b.png?v=1774535145', 'Armeen 3pcs - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('d30f9aa6-0d53-4210-8522-60fb415dd1a7', '334907a5-b18e-4895-8563-d126ef81414e', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/3_a1b8bcd5-7621-4135-a7d4-26c42395ad92.png?v=1774535145', 'Armeen 3pcs - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('ad349731-67de-4629-8ee2-717182420181', '334907a5-b18e-4895-8563-d126ef81414e', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/5_101459c1-cb31-4805-91f4-aeccd5c002b3.png?v=1774535145', 'Armeen 3pcs - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('bb8adb1a-ceb3-4147-88f5-14de590c84a1', '334907a5-b18e-4895-8563-d126ef81414e', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/IMG_1012_JPG.jpg?v=1774535145', 'Armeen 3pcs - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('6aa4f717-83bf-4804-86de-564ad077b6cb', '334907a5-b18e-4895-8563-d126ef81414e', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/4_05def333-9aa3-4b44-937e-6133591897bc.png?v=1774535145', 'Armeen 3pcs - View 6', false, 6)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('39cc2be0-b2e8-4c1e-8275-3b529e6dc727', 'Shamsa 2 PCs Embroidered', 'yellow-kurta-set-copy', '<p><span style="color: rgb(0, 0, 0);"><!-- TRUST BADGES (LARGE + PREMIUM) --></span></p>
<div style="display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin-bottom: 14px; font-size: 14px;"></div>
<h2 style="font-weight: 600; margin-bottom: 6px;"><span style="color: rgb(0, 0, 0);">Shamsa — Summer Ready 2Pcs</span></h2>
<p style="font-size: 13px; color: #888; margin-bottom: 8px;"><strong><span style="color: rgb(0, 0, 0);">Cotton Shirt &amp; Trouser • Digital Printed Dupatta</span></strong></p>
<p style="font-size: 14px; line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">A bright and refreshing yellow 2-piece ensemble designed for effortless summer styling. Shamsa features an embroidered cotton kurta paired with a straight trouser, offering a breathable and comfortable outfit with a clean, elegant look.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Product Highlights</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Premium cotton embroidered shirt</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Long kurta with regular fit</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Elegant neckline and subtle detailing</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Straight trouser for a clean silhouette</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Lightweight and breathable summer outfit</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Fabric &amp; Feel</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Crafted from soft cotton fabric for maximum comfort in warm weather, designed to keep you cool while maintaining a polished appearance.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Occasion</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Perfect for casual wear, daytime outings, and summer gatherings — a versatile piece for everyday elegance.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Product Details</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Outfit Type: Eastern Ready-to-Wear</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fabric: Cotton Shirt &amp; Trouser</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Work: Embroidered</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Top Style: Long Kurta (Regular Fit)</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Bottom Style: Straight Trouser</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Pieces: 2 (Shirt + Trouser)</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Color: Yellow</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Season: Summer Wear</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Delivery &amp; Payment</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Cash on Delivery available nationwide</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fast shipping across Pakistan</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Carefully packed for quality assurance</span></li>
</ul>
<p style="font-size: 13px; color: #555; margin-top: 5px;"><span style="color: rgb(0, 0, 0);">Limited pieces available — restocks are not guaranteed.</span></p>', 'GP-10289553834299-50992498966843', '238b9607-7157-468b-82ad-49fd47f535f7', 'Clothing', 3999, 5500, 'Premium Cotton Lawn / Raw Silk', '{"Bloom pret","fashion clothing","ladies two piefce","lawndress","newarrival","ready to wear"}', '{"S","M","L","XL"}', true, true, false, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('aa43b980-a425-4663-8f1a-9aa856b1695e', '39cc2be0-b2e8-4c1e-8275-3b529e6dc727', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/EidcollectionisavailablenowZimalbyModernmilaapGoandshoponlinefromwebsite_1.jpg?v=1771952830', 'Shamsa 2 PCs Embroidered - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('980c932c-45ee-4bea-8fe4-a438569a44fc', '39cc2be0-b2e8-4c1e-8275-3b529e6dc727', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/484535196_18269254039258890_4206173560777511483_n_jpg.jpg?v=1771952830', 'Shamsa 2 PCs Embroidered - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('e4376c18-3d47-4647-8d3f-40d622633fef', '39cc2be0-b2e8-4c1e-8275-3b529e6dc727', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/484562414_18269254015258890_8349905261619744829_n_jpg.jpg?v=1771952830', 'Shamsa 2 PCs Embroidered - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('b6a1b404-b9ca-4bce-85c2-421628598203', '39cc2be0-b2e8-4c1e-8275-3b529e6dc727', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/EidcollectionisavailablenowZimalbyModernmilaapGoandshoponlinefromwebsite.jpg?v=1771952721', 'Shamsa 2 PCs Embroidered - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('594e08a3-9f06-4d55-8af0-8c1d1ee67d94', '39cc2be0-b2e8-4c1e-8275-3b529e6dc727', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/EidCollectionZimalbyModernMilaapAvailableonwebsitegoandshoponline.jpg?v=1771952721', 'Shamsa 2 PCs Embroidered - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('4abb99fa-b4b7-4916-871d-aa08e5c09297', 'Sophie 3Pcs', 'sophie-3pcs', '<p><span style="color: rgb(0, 0, 0);"><!-- TRUST BADGES (LARGE + PREMIUM) --></span></p>
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
<p style="font-size: 13px; color: #555; margin-top: 5px;"><span style="color: rgb(0, 0, 0);">Limited pieces available.</span></p>', 'GP-10289034494267-50987429593403', 'eb8a2f48-1c92-495b-8a7f-2b18de2a8c6e', 'woman', 5999, 7950, 'Premium Cotton Lawn / Raw Silk', '{}', '{"S","M","L","XL"}', true, true, true, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('f99db419-a55f-494c-858d-8db2229dda53', '4abb99fa-b4b7-4916-871d-aa08e5c09297', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/eidshoot_s_z_a_-3027_jpg.jpg?v=1771846601', 'Sophie 3Pcs - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('e7f7356e-4dd1-4e1a-8956-19e5994bf799', '4abb99fa-b4b7-4916-871d-aa08e5c09297', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/eidshoot_s_z_a_-3029_04080fe4-d479-4d05-8c1e-fa82aaaefe11_jpg.jpg?v=1771846601', 'Sophie 3Pcs - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('d50b3910-b481-406e-813e-651cbafd1fc9', '4abb99fa-b4b7-4916-871d-aa08e5c09297', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/eidshoot_s_z_a_-3017_jpg.jpg?v=1771846601', 'Sophie 3Pcs - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('dda1d982-2d94-4516-8052-ba1bb9f62533', '4abb99fa-b4b7-4916-871d-aa08e5c09297', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/eidshoot_s_z_a_-3035_jpg.jpg?v=1771846303', 'Sophie 3Pcs - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('57b7dfec-2020-4bef-89ca-29f411d1f116', '4abb99fa-b4b7-4916-871d-aa08e5c09297', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/eidshoot_s_z_a_-3035.jpg_1.jpg?v=1771846302', 'Sophie 3Pcs - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('0f9ca4e2-ece3-4e49-86b8-ca7dcaa588c2', '4abb99fa-b4b7-4916-871d-aa08e5c09297', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/eidshoot_s_z_a_-3046_jpg.jpg?v=1771846302', 'Sophie 3Pcs - View 6', false, 6)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('62631117-c92e-4c02-80c7-72fae88fa710', '4abb99fa-b4b7-4916-871d-aa08e5c09297', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/eidshoot_s_z_a_-3058_jpg.jpg?v=1771846302', 'Sophie 3Pcs - View 7', false, 7)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('95e7f24f-4cea-452d-8a64-903e7e0171e1', 'Matka Mirror Work', 'matka-mirror-work', '<p><span style="color: rgb(0, 0, 0);"><!-- TRUST BADGES (LARGE + PREMIUM) --></span></p>
<div style="display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin-bottom: 14px; font-size: 14px;"></div>
<h2 style="font-weight: 600; margin-bottom: 6px;"><span style="color: rgb(0, 0, 0);">Matka Mirror Work — Everyday 2Pcs Set</span></h2>
<p style="font-size: 13px; color: #888; margin-bottom: 8px;"><strong><span style="color: rgb(0, 0, 0);">Basic Lawn Shirt &amp; Trouser • Lightweight Summer Wear</span></strong></p>
<p style="font-size: 14px; line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">A comfortable and stylish 2-piece kurta set designed for everyday wear. Matka Mirror Work features a soft beige tone with digital printed detailing, crafted in breathable lawn fabric to keep you cool and relaxed throughout the day.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Product Highlights</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Soft and breathable basic lawn fabric</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Digital printed design for a modern look</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Regular fit kurta for everyday comfort</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Matching trouser for a clean silhouette</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">2-piece ready-to-wear outfit</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Fabric &amp; Feel</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Made from lightweight lawn fabric, ideal for summer wear — offering a soft feel and breathable comfort for daily use.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Occasion</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Perfect for daily wear, casual outings, and comfortable home styling — a practical yet stylish addition to your wardrobe.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Product Details</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Gender: Women</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Category: Eastern Ready-to-Wear</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Outfit Type: Kurta Set</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Pieces: 2 (Top &amp; Bottom)</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fabric: Basic Lawn (Shirt &amp; Trouser)</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Work: Digital Printed</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Top Fit: Regular Fit</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Color: Beige</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Season: Summer Wear</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Lining: No Lining</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Delivery &amp; Payment</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Cash on Delivery available nationwide</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fast shipping across Pakistan</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Carefully packed for quality assurance</span></li>
</ul>
<p style="font-size: 13px; color: #555; margin-top: 5px;"><span style="color: rgb(0, 0, 0);">Limited pieces available — restocks are not guaranteed.</span></p>', 'GP-10288336666939-50984737997115', '238b9607-7157-468b-82ad-49fd47f535f7', 'Clothing', 2850, 4500, 'Premium Cotton Lawn / Raw Silk', '{"fashion clothing","ladies two piefce","newarrival","ready to wear"}', '{"S","M","L","XL"}', true, false, false, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('8f99927d-bb44-4ba9-8fdf-0b185e7dea3d', '95e7f24f-4cea-452d-8a64-903e7e0171e1', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/WhatsApp_Image_2025-11-20_at_8.39.38_PM.jpg?v=1772031408', 'Matka Mirror Work - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('3bd77ec5-253f-4d56-8902-98686b72177f', '95e7f24f-4cea-452d-8a64-903e7e0171e1', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/WhatsApp_Image_2025-11-20_at_8.39.37_PM.jpg?v=1772031408', 'Matka Mirror Work - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('daec1b57-5e95-4141-8a4e-8cafed097c63', '95e7f24f-4cea-452d-8a64-903e7e0171e1', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/WhatsApp_Image_2025-11-20_at_8.39.38_PM_1.jpg?v=1772031408', 'Matka Mirror Work - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('dd051848-bf5b-4e2b-8603-6b93d6e1b46f', '95e7f24f-4cea-452d-8a64-903e7e0171e1', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/WhatsApp_Image_2025-11-20_at_8.39.39_PM.jpg?v=1772031408', 'Matka Mirror Work - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('0264f4d3-7ce6-4a6e-8e89-7d5aae3c74e2', '95e7f24f-4cea-452d-8a64-903e7e0171e1', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/WhatsApp_Image_2025-11-20_at_8.39.37_PM_1.jpg?v=1772030788', 'Matka Mirror Work - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('ed78e020-ca45-4711-8cbf-b297452ae95a', 'Sunset 2pcs', 'sunset-2pcs', '<p><span style="color: rgb(0, 0, 0);"><!-- TRUST BADGES (LARGE + PREMIUM) --></span></p>
<div style="display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin-bottom: 14px; font-size: 14px;"></div>
<h2 style="font-weight: 600; margin-bottom: 6px;"><span style="color: rgb(0, 0, 0);">Sunset — Everyday 2Pcs Set</span></h2>
<p style="font-size: 13px; color: #c59d5f; margin-bottom: 8px;"><strong><span style="color: rgb(255, 42, 0);">✔ Daily Wear • Comfortable &amp; Affordable</span></strong></p>
<p style="font-size: 13px; color: #888; margin-bottom: 8px;"><strong><span style="color: rgb(0, 0, 0);">Basic Lawn Shirt &amp; Trouser • Lightweight Summer Wear</span></strong></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Product Highlights</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Soft and breathable basic lawn fabric</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Digital printed design for a modern everyday look</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Regular fit kurta for relaxed comfort</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Matching trouser for a clean silhouette</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">2-piece ready-to-wear outfit</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Fabric &amp; Feel</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Made with lightweight lawn fabric, perfect for summer wear — offering a soft touch and breathable feel for daily use.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Occasion</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Ideal for daily wear, casual outings, and comfortable home styling — a practical and easy-to-wear outfit.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Product Details</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Gender: Women</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Category: Clothing</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Outfit Type: Eastern Ready-to-Wear</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Sub-Category: Kurta Set</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Pieces: 2 (Top &amp; Bottom)</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fabric: Basic Lawn (Shirt &amp; Trouser)</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Work: Digital Printed</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Top Fit: Regular Fit</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Bottom Style: Trouser</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Color: Beige</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Season: Summer Wear</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Lining: No Lining</span></li>
</ul>
<p style="font-size: 13px; color: #777; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">⚠️ Actual product color may vary slightly due to lighting and screen settings.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Delivery &amp; Payment</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Cash on Delivery available nationwide</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fast shipping across Pakistan</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Carefully packed for quality assurance</span></li>
</ul>
<p style="font-size: 13px; color: #555; margin-top: 5px;"><span style="color: rgb(0, 0, 0);">Limited pieces available — restocks are not guaranteed.</span></p>', 'GP-10288335782203-50984736227643', '238b9607-7157-468b-82ad-49fd47f535f7', 'Clothing', 2850, 4500, 'Premium Cotton Lawn / Raw Silk', '{"fashion clothing","ladies two piefce","newarrival","ready to wear"}', '{"S","M","L","XL"}', true, false, false, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('9a3be5ba-262c-45d0-8497-ec501ed075ec', 'ed78e020-ca45-4711-8cbf-b297452ae95a', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/493667759_122138684192408152_3231786512462453256_n.jpg?v=1771670075', 'Sunset 2pcs - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('701a0f7d-950c-4c01-8e5f-e2a64fd5df90', 'ed78e020-ca45-4711-8cbf-b297452ae95a', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/494312762_122138684162408152_8513036836121206414_n.jpg?v=1771670074', 'Sunset 2pcs - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('7b6ab463-b18b-4278-84e5-b83e0793e073', 'ed78e020-ca45-4711-8cbf-b297452ae95a', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/494671171_122138684054408152_1305336890316191223_n.jpg?v=1771670075', 'Sunset 2pcs - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('a21bed5d-22b6-40e6-88ef-b8d8ab2e03c5', 'ed78e020-ca45-4711-8cbf-b297452ae95a', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/494683249_122138684186408152_1133440808513358832_n.jpg?v=1771670074', 'Sunset 2pcs - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('a4566f84-2190-4053-86ce-e3d37853e3cd', 'ed78e020-ca45-4711-8cbf-b297452ae95a', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/495126424_122138683994408152_7928706316659457835_n.jpg?v=1771670074', 'Sunset 2pcs - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('795eb11f-d487-4cc0-894e-c4374af06804', 'Multi Color Black 3Pcs', 'multi-color-black-3pcs', '<p><span style="color: rgb(0, 0, 0);"><!-- TRUST BADGES (LARGE + PREMIUM) --></span></p>
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
<p style="font-size: 13px; color: #555; margin-top: 5px;"><span style="color: rgb(0, 0, 0);">Limited pieces available — restocks are not guaranteed.</span></p>', 'GP-10285157318971-50973113221435', 'eb8a2f48-1c92-495b-8a7f-2b18de2a8c6e', 'woman', 6499, 8750, 'Premium Cotton Lawn / Raw Silk', '{}', '{"Black"}', true, true, true, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('46a01a44-9280-44a2-8d77-f083daea3662', '795eb11f-d487-4cc0-894e-c4374af06804', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Gemini_Generated_Image_8cxrw78cxrw78cxr.png?v=1771001914', 'Multi Color Black 3Pcs - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('7854267e-22b0-4ce0-8478-5d0cdabdca75', '795eb11f-d487-4cc0-894e-c4374af06804', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Gemini_Generated_Image_mszo06mszo06mszo.png?v=1771001914', 'Multi Color Black 3Pcs - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('06541840-5b41-4409-8342-79b958c0a15f', '795eb11f-d487-4cc0-894e-c4374af06804', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Gemini_Generated_Image_56vjvg56vjvg56vj.png?v=1771001914', 'Multi Color Black 3Pcs - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('dfd27aea-10fb-4465-8bd3-b0e56d145dbf', '795eb11f-d487-4cc0-894e-c4374af06804', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Gemini_Generated_Image_8kacpl8kacpl8kac.png?v=1771001914', 'Multi Color Black 3Pcs - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('50505619-aad0-46d7-8f7e-30d60142a79d', 'Aleeeza Black 3pcs', 'alize-black-3pcs-embroidery', '<p><span style="color: rgb(0, 0, 0);"><!-- TRUST BADGES (LARGE + PREMIUM) --></span></p>
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
<p style="font-size: 13px; color: #555; margin-top: 5px;"><span style="color: rgb(0, 0, 0);">Limited pieces available — restocks are not guaranteed.</span></p>', 'GP-10285064028475-50972766372155', 'b6f45e57-efe5-4094-8c75-91ca5cde1f1e', 'Stitched', 6499, 8750, 'Premium Cotton Lawn / Raw Silk', '{"3PCS","fashion clothing","ladies two piefce","newarrival","ready to wear"}', '{"S","M","L","XL"}', true, true, true, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('cb4923f7-a3d8-4d4c-86e4-c72e0b189036', '50505619-aad0-46d7-8f7e-30d60142a79d', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/5.png?v=1772298010', 'Aleeeza Black 3pcs - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('1c56e5e2-eea4-4c51-8ab1-ae48a75bb096', '50505619-aad0-46d7-8f7e-30d60142a79d', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/2_b5ff6c94-0db8-4815-a404-b3b90c9f149f.png?v=1772298010', 'Aleeeza Black 3pcs - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('ad6cf5ef-26aa-4604-8027-171b18d48e51', '50505619-aad0-46d7-8f7e-30d60142a79d', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/1.png?v=1772298010', 'Aleeeza Black 3pcs - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('025cfdcb-17e8-4653-8dd1-aadcfc12d396', '50505619-aad0-46d7-8f7e-30d60142a79d', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/3_cdc1440a-75c7-4ee9-9d18-c25eb3eeb327.png?v=1772298010', 'Aleeeza Black 3pcs - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('44c49c57-cb64-48a9-8b6d-9846d3b95487', '50505619-aad0-46d7-8f7e-30d60142a79d', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/4_cb2ef79a-febe-426e-9414-beb77113d677.png?v=1772298010', 'Aleeeza Black 3pcs - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('1e98264d-e4ca-4b33-849b-51daed1fcb17', 'Regal Dream 3Pcs', 'regal-dream-3pcs', '<p><span style="color: rgb(0, 0, 0);"><!-- TRUST BADGES (LARGE + PREMIUM) --></span></p>
<div style="display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin-bottom: 14px; font-size: 14px;"><br></div>
<h2 style="font-weight: 600; margin-bottom: 6px;"><span style="color: rgb(0, 0, 0);">Regal Dream — Premium cotton 3Pcs</span></h2>
<p style="font-size: 13px; color: #c59d5f; margin-bottom: 8px;"><span style="color: rgb(255, 42, 0);"><strong>☀ Summer &amp; Mid-Season Wear • Premium Fabric</strong></span></p>
<p style="font-size: 13px; color: #888; margin-bottom: 8px;"><strong><span style="color: rgb(0, 0, 0);">Cotton Shirt &amp; Trouser • Cotton Dupatta • Complete 3PC Set</span></strong></p>
<p style="font-size: 14px; line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">A refined 3-piece ensemble crafted entirely in premium cotton, designed for effortless elegance and all-day comfort. Regal Dream features a long-length graceful silhouette paired with a structured cottondupatta, creating a polished and versatile look for multiple seasons.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Product Highlights</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Premium cotton fabric for shirt and trouser</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Long-length design for a graceful fall</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Classic and modest silhouette</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Structured cotton dupatta for an elevated look</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">3-piece complete ready-to-wear outfit</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Fabric &amp; Feel</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Crafted from breathable premium cotton, offering a perfect balance of comfort and structure — ideal for summer days and mid-season wear.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Occasion</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Perfect for casual outings, office wear, and semi-formal gatherings — designed to keep you comfortable while maintaining a refined look.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Product Details</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fabric: Premium cotton (Shirt &amp; Trouser)</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Dupatta: cotton lawn Emb</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Pieces: 3 (Shirt + Trouser + Dupatta)</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Style: Long-length graceful shirt</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Season: Summer &amp; Mid-Season Wear</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Delivery &amp; Payment</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Cash on Delivery available nationwide</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fast shipping across Pakistan</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Carefully packed for quality assurance</span></li>
</ul>
<p style="font-size: 13px; color: #555; margin-top: 5px;"><span style="color: rgb(0, 0, 0);">Limited pieces available — restocks are not guaranteed.</span></p>', 'GP-10275293954363-50942228267323', 'b6f45e57-efe5-4094-8c75-91ca5cde1f1e', 'Stitched', 6199, 7990, 'Premium Cotton Lawn / Raw Silk', '{"3PCS","fashion clothing","ladies two piefce","newarrival","ready to wear"}', '{"S","M","L","XL"}', true, true, true, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('2443d963-6b23-4aba-8fcf-9046733df372', '1e98264d-e4ca-4b33-849b-51daed1fcb17', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/5_0f2902da-8b93-4f00-98b3-69de90fec358_jpg.jpg?v=1769455006', 'Regal Dream 3Pcs - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('2ce187b5-948d-47b5-8c34-5b95aa3c0c81', '1e98264d-e4ca-4b33-849b-51daed1fcb17', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/9_c9b2c612-2d50-44dd-a7e7-538a24fe581c_jpg.jpg?v=1769455007', 'Regal Dream 3Pcs - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('8b240abf-4a98-480c-8d55-36e1c04e7913', '1e98264d-e4ca-4b33-849b-51daed1fcb17', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/2_a4a5a365-cf41-490e-b56f-a4239cc32835_jpg.jpg?v=1769455006', 'Regal Dream 3Pcs - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('785ebeeb-c7e3-4671-8672-79d4f0dfeea9', '1e98264d-e4ca-4b33-849b-51daed1fcb17', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/8_b5546c09-0317-44e2-9bd3-5fcf5813c11b_jpg.jpg?v=1769455006', 'Regal Dream 3Pcs - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('bc7203e3-275c-4415-80e9-d3f9cd2a7f9b', '1e98264d-e4ca-4b33-849b-51daed1fcb17', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/1_258a3ee2-32aa-493b-aa4d-9b5864b73c1e_jpg.jpg?v=1769455006', 'Regal Dream 3Pcs - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('b7401728-a250-45c6-8127-c30147a0bb76', 'Chiku Embroidery 3Pcs', 'chiku-embroidery-3pcs', '<p><img src="https://cdn.shopify.com/s/files/1/0638/4127/1923/files/IMG_20250427_222427.jpg?v=1745774765"><br></p>
<p><br>Shirt Embroidery</p>
<p>Embroidery Trouser</p>
<p>Embroidery Shawl</p>
<p>Size Chart<strong>         <br><img src="https://cdn.shopify.com/s/files/1/0977/8429/9803/files/co_ord_48.png?v=1761008602"></strong><br></p>', 'GP-10275293888827-50942227743035', '182c6be1-75c0-406c-826f-770ab3725133', '3 Pieces', 5999, 7830, 'Premium Cotton Lawn / Raw Silk', '{"2pcs","3PCS","fashion clothing","LINEN","ready to wear","Trending Now","women suite","womens clothing"}', '{"S","Meidum","L","XL"}', true, false, false, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('15eea5f1-fd09-4497-872e-92f53a3bccff', 'b7401728-a250-45c6-8127-c30147a0bb76', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/IMG_20251101_002112_7ab25f69-918d-43f5-9ada-78b2ca914dfc_1.jpg?v=1769455005', 'Chiku Embroidery 3Pcs - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('8e803264-2f13-49fe-8705-d59e573ddb0a', 'b7401728-a250-45c6-8127-c30147a0bb76', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/IMG_20251101_002000_a6ff5c50-0f3c-4b90-82bb-2965418ca9f7.jpg?v=1769455005', 'Chiku Embroidery 3Pcs - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('d1b8f6f1-2a0a-410f-878f-4c644961eeed', 'b7401728-a250-45c6-8127-c30147a0bb76', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/IMG_20251101_002022_d9067655-1607-40fe-ae33-344f9329a5dc.jpg?v=1769455005', 'Chiku Embroidery 3Pcs - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('b64f12f9-e7c1-49df-883c-bfcd300864c5', 'b7401728-a250-45c6-8127-c30147a0bb76', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/IMG_20251101_001935_309f9804-8eaa-4d2a-a21c-4bf5d3464211_1.jpg?v=1769455005', 'Chiku Embroidery 3Pcs - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('89c1d18b-8208-4939-81c6-12b2e9c7ad96', 'b7401728-a250-45c6-8127-c30147a0bb76', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/IMG_20251101_002131_64383b1a-f1b0-4a1d-98ca-cbbcc2a37bf6_1.jpg?v=1769455005', 'Chiku Embroidery 3Pcs - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('a9c529e1-e76d-430c-804c-bdda76d34e12', 'Cream Alishba Emb', 'cream-alishba-emb', '<p><span style="color: rgb(0, 0, 0);"><!-- TRUST BADGES (LARGE + PREMIUM) --></span></p>
<div style="display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin-bottom: 14px; font-size: 14px;"></div>
<h2 style="font-weight: 600; margin-bottom: 6px;"><span style="color: rgb(0, 0, 0);">Cream Alishba — Embroidered 3Pcs Elegance</span></h2>
<p style="font-size: 13px; color: #888; margin-bottom: 8px;"><strong><span style="color: rgb(0, 0, 0);">Premium Linen Shirt &amp; Trouser • Chiffon Dupatta</span></strong></p>
<p style="font-size: 14px; line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">A beautifully crafted cream-toned 3-piece ensemble designed for effortless elegance. Featuring intricate embroidery on premium linen and paired with a soft, flowy chiffon dupatta, Cream Alishba offers a refined and graceful look perfect for summer wear.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Product Highlights</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Premium linen embroidered shirt</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Elegant cream color for a soft, classy look</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Matching trouser for a complete outfit</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Lightweight chiffon dupatta with graceful drape</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">3-piece ready-to-wear ensemble</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Fabric &amp; Feel</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Crafted from breathable premium linen ideal for summer, paired with an airy chiffon dupatta that adds softness and elegance to the overall look.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Occasion</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Perfect for daytime wear, festive gatherings, and semi-formal occasions — designed to keep you comfortable while looking effortlessly polished.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Product Details</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fabric: Premium Linen (Summer Wear)</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Dupatta: Chiffon</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Pieces: 3 (Shirt, Trouser &amp; Dupatta)</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Work: Embroidered</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Color: Cream</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Delivery &amp; Payment</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Cash on Delivery available nationwide</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fast shipping across Pakistan</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Carefully packed for quality assurance</span></li>
</ul>
<p style="font-size: 13px; color: #555; margin-top: 5px;"><span style="color: rgb(0, 0, 0);">Limited pieces available — restocks are not guaranteed.</span></p>', 'GP-10275291103547-51097599574331', '90151ef9-20ad-496b-8daf-eef1fb0a8aa9', 'Unstitched / Stitched', 6499, 8150, 'Premium Cotton Lawn / Raw Silk', '{}', '{"S","M","L","XL"}', true, true, true, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('9cdf7180-3681-4b32-8322-6758579fd359', 'a9c529e1-e76d-430c-804c-bdda76d34e12', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/POV-off-whiteisyourfavouritecolor_TobookstudioappointmentspleasereachouttousonWha_4.jpg?v=1769454490', 'Cream Alishba Emb - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('a1707223-130d-4418-8fe5-35b7bee00556', 'a9c529e1-e76d-430c-804c-bdda76d34e12', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/POV-off-whiteisyourfavouritecolor_TobookstudioappointmentspleasereachouttousonWha_3.jpg?v=1769454490', 'Cream Alishba Emb - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('8599b322-d74b-471c-8d1e-7230643c8853', 'a9c529e1-e76d-430c-804c-bdda76d34e12', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/POV-off-whiteisyourfavouritecolor_TobookstudioappointmentspleasereachouttousonWha_2.jpg?v=1769454490', 'Cream Alishba Emb - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('10e760af-8bc1-4b32-896c-e47ec396f9ce', 'a9c529e1-e76d-430c-804c-bdda76d34e12', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/POV-off-whiteisyourfavouritecolor_TobookstudioappointmentspleasereachouttousonWha_1.jpg?v=1769454490', 'Cream Alishba Emb - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('0ff0fbf8-60e4-45e4-8f92-1fae3ae9dcdd', 'a9c529e1-e76d-430c-804c-bdda76d34e12', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/POV-off-whiteisyourfavouritecolor_TobookstudioappointmentspleasereachouttousonWha_5.jpg?v=1769454464', 'Cream Alishba Emb - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('50a36b87-0bb7-4cb1-891d-4cf1d8ad2670', 'a9c529e1-e76d-430c-804c-bdda76d34e12', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/POV-off-whiteisyourfavouritecolor_TobookstudioappointmentspleasereachouttousonWha.jpg?v=1769454464', 'Cream Alishba Emb - View 6', false, 6)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('b8afb0c8-a81f-4669-8115-d707b8164a48', 'Multi Color 3Pcs Embroidery', 'multi-color-3pcs-embroidery', '<p><span style="color: rgb(0, 0, 0);"><!-- TRUST BADGES (LARGE + PREMIUM) --></span></p>
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
<p style="font-size: 13px; color: #555; margin-top: 5px;"><span style="color: rgb(0, 0, 0);">Limited pieces available — restocks are not guaranteed.</span></p>', 'GP-10272034128187-51169367916859', 'eb8a2f48-1c92-495b-8a7f-2b18de2a8c6e', 'woman', 6499, 8750, 'Premium Cotton Lawn / Raw Silk', '{}', '{"S","M","L","XL"}', true, true, true, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('1c984cbf-75c8-41fd-8c47-543c2b8a9374', 'b8afb0c8-a81f-4669-8115-d707b8164a48', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/VDCPF25-Nisha-5.jpg?v=1768915843', 'Multi Color 3Pcs Embroidery - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('bcb553e3-c3b4-499d-80dd-736327d5793e', 'b8afb0c8-a81f-4669-8115-d707b8164a48', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/VDCPF25-Nisha-3.jpg?v=1770212242', 'Multi Color 3Pcs Embroidery - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('c6250aee-3982-4ce6-82e4-280336f9bedc', 'b8afb0c8-a81f-4669-8115-d707b8164a48', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/VDCPF25-Nisha-7.jpg?v=1770212242', 'Multi Color 3Pcs Embroidery - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('97db496a-4c6e-4b3f-8845-6a5ebebfd576', 'b8afb0c8-a81f-4669-8115-d707b8164a48', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/VDCPF25-Nisha-4_1.jpg?v=1770212242', 'Multi Color 3Pcs Embroidery - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('e3681c31-cb3d-4502-8dc7-15aad2c983de', 'b8afb0c8-a81f-4669-8115-d707b8164a48', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/VDCPF25-Nisha-1.jpg?v=1770212242', 'Multi Color 3Pcs Embroidery - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('f274da04-3f35-4ba4-8b4c-3b5d97ff94cb', 'pistiana 3pcs', 'pistachio-3pcs', '<p><span style="color: rgb(0, 0, 0);"><!-- TRUST BADGES (LARGE + PREMIUM) --></span></p>
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
<p style="font-size: 13px; color: #555; margin-top: 5px;"><span style="color: rgb(0, 0, 0);">Limited pieces available — restocks are not guaranteed.</span></p>', 'GP-10254738850107-50956405932347', 'b6f45e57-efe5-4094-8c75-91ca5cde1f1e', 'Stitched', 6491, 8250, 'Premium Cotton Lawn / Raw Silk', '{"3PCS","fashion clothing","ladies two piefce","newarrival","ready to wear"}', '{"S","M","L","XL"}', true, true, true, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('21b20555-9e62-4473-898c-2f28ba74b4fe', 'f274da04-3f35-4ba4-8b4c-3b5d97ff94cb', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Mirana18JULY-84.jpg?v=1766162560', 'pistiana 3pcs - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('9514231b-154e-4ef0-8a07-25fb0a7cfba8', 'f274da04-3f35-4ba4-8b4c-3b5d97ff94cb', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Mirana18JULY-15_1000x_4ce3d155-51c7-45e2-afc4-6ea05987bd5d.jpg?v=1766162560', 'pistiana 3pcs - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('f04142bd-eddc-4ebe-8d40-c71693c0312c', 'f274da04-3f35-4ba4-8b4c-3b5d97ff94cb', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Mirana18JULY-178_1000x_8cc25409-700b-4f3e-9f2d-d869d4162e80.jpg?v=1766162560', 'pistiana 3pcs - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('399d019e-a8a0-4820-8500-614a4af174d2', 'f274da04-3f35-4ba4-8b4c-3b5d97ff94cb', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Mirana18JULY-58_1000x_ded126c7-d829-41fc-af06-c2aa190fb26c.jpg?v=1766162560', 'pistiana 3pcs - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('a7640bf7-3187-43ab-8c72-7b8b6ff153b8', 'f274da04-3f35-4ba4-8b4c-3b5d97ff94cb', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Mirana18JULY-56_1000x_8accbfac-8c59-4c2a-9993-80582afb3ce2.jpg?v=1766162560', 'pistiana 3pcs - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('c626570b-62ab-4efc-8f0e-434971187e08', 'f274da04-3f35-4ba4-8b4c-3b5d97ff94cb', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Mirana18JULY-28_1000x_d32003ec-8a9e-4d1d-91ee-0cb2e0f2502d.jpg?v=1766162560', 'pistiana 3pcs - View 6', false, 6)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('3b2a230e-08e7-4cb2-8922-626f4ccdb7e0', 'f274da04-3f35-4ba4-8b4c-3b5d97ff94cb', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Mirana18JULY-68_1000x_eec262c1-0822-4846-bd09-981dbcff8b53.jpg?v=1766162560', 'pistiana 3pcs - View 7', false, 7)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('ed84c637-0244-4fd0-8bbd-0c1ee963950e', 'f274da04-3f35-4ba4-8b4c-3b5d97ff94cb', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Mirana18JULY-129_1000x_6975ee35-d3bd-45dd-a269-267697706ac5.jpg?v=1766162560', 'pistiana 3pcs - View 8', false, 8)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('c97271f2-d5c4-4c68-85c7-cf5c40681f55', 'f274da04-3f35-4ba4-8b4c-3b5d97ff94cb', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Mirana18JULY-119_1000x_c267e010-a354-41ae-9710-f0ca3e902b6f.jpg?v=1766162560', 'pistiana 3pcs - View 9', false, 9)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('9a2ab2b1-6670-4093-8428-fb4ee3108fe7', 'f274da04-3f35-4ba4-8b4c-3b5d97ff94cb', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Mirana18JULY-158_1000x_443e10db-ab88-488f-aaeb-23562cb1fa71.jpg?v=1766162560', 'pistiana 3pcs - View 10', false, 10)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('e19fa59a-b017-4a7d-8d5c-b9daa6f1da28', 'NEW BROWNIE', 'brownish-3pc', '<p><span style="color: rgb(0, 0, 0);"><!-- TRUST BADGES (LARGE + PREMIUM) --></span></p>
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
<p style="font-size: 13px; color: #555; margin-top: 5px;"><span style="color: rgb(0, 0, 0);">Limited pieces available — restocks are not guaranteed.</span></p>', 'GP-10248330477883-50840689443131', 'b6f45e57-efe5-4094-8c75-91ca5cde1f1e', 'Stitched', 6499, 7650, 'Premium Cotton Lawn / Raw Silk', '{"3PCS","fashion clothing","newarrival","ready to wear"}', '{"S","M","L","XL"}', true, true, true, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('4a151d76-b8a1-48ec-83a9-1c77c9072c2b', 'e19fa59a-b017-4a7d-8d5c-b9daa6f1da28', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/IMG-7792.jpg?v=1765614695', 'NEW BROWNIE - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('49b1ba38-b359-42b1-8c17-4475dfe2d853', 'e19fa59a-b017-4a7d-8d5c-b9daa6f1da28', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/IMG-7790.jpg?v=1765614695', 'NEW BROWNIE - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('23715d22-0d35-4d37-8082-ee9202de00a1', 'e19fa59a-b017-4a7d-8d5c-b9daa6f1da28', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/IMG-7789.jpg?v=1765614695', 'NEW BROWNIE - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('097ea38e-2961-4f0d-822e-c7210164fe99', 'e19fa59a-b017-4a7d-8d5c-b9daa6f1da28', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/IMG-7791.jpg?v=1765614695', 'NEW BROWNIE - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('32c16733-d39a-400f-86c2-ab741fac56f9', 'e19fa59a-b017-4a7d-8d5c-b9daa6f1da28', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/IMG-7793.jpg?v=1765614696', 'NEW BROWNIE - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('765d0e55-aa6c-4b0f-854d-10c20dfeaf26', 'e19fa59a-b017-4a7d-8d5c-b9daa6f1da28', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/IMG-7794.jpg?v=1765614695', 'NEW BROWNIE - View 6', false, 6)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('a6512b44-8268-47e2-84c4-daf6a1e3c792', 'NEW AYRA 3PCS', 'aria-stitched-3pc', '<p><span style="color: rgb(0, 0, 0);"><!-- TRUST BADGES (LARGE + PREMIUM) --></span></p>
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
<p style="font-size: 13px; color: #555; margin-top: 5px;"><span style="color: rgb(0, 0, 0);">Limited pieces available — restocks are not guaranteed.</span></p>', 'GP-10246164316475-50832862314811', 'b6f45e57-efe5-4094-8c75-91ca5cde1f1e', 'Stitched', 6499, 8450, 'Premium Cotton Lawn / Raw Silk', '{}', '{"S","M","L","XL"}', true, true, true, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('21a2647f-b276-4d6d-8b01-d7ad94cb9378', 'a6512b44-8268-47e2-84c4-daf6a1e3c792', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/IMG_3341.jpg?v=1765233649', 'NEW AYRA 3PCS - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('af06f3a9-a3f3-4ab2-8c2d-408ee288d3b9', 'a6512b44-8268-47e2-84c4-daf6a1e3c792', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/IMG_3338.jpg?v=1765233649', 'NEW AYRA 3PCS - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('945cadd8-6b20-47ba-8249-3263a9807799', 'a6512b44-8268-47e2-84c4-daf6a1e3c792', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/IMG_3329.jpg?v=1765233649', 'NEW AYRA 3PCS - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('114300b3-7ffd-4383-8ff7-0328f20ddcca', 'a6512b44-8268-47e2-84c4-daf6a1e3c792', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/IMG_3339.jpg?v=1765233649', 'NEW AYRA 3PCS - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('e1f7fd9e-4185-42e8-82ed-fbcf40814d04', 'a6512b44-8268-47e2-84c4-daf6a1e3c792', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/IMG_3333.jpg?v=1765233649', 'NEW AYRA 3PCS - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('f22d81d6-4171-4a13-87a0-89f0a99da24d', 'a6512b44-8268-47e2-84c4-daf6a1e3c792', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/IMG_3340.jpg?v=1765233649', 'NEW AYRA 3PCS - View 6', false, 6)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('0d600669-48aa-4db6-8930-7a0ee8518d8d', 'a6512b44-8268-47e2-84c4-daf6a1e3c792', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/IMG_3342.jpg?v=1765233649', 'NEW AYRA 3PCS - View 7', false, 7)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('d37c78ea-39fa-449d-8345-4666fca4b669', 'a6512b44-8268-47e2-84c4-daf6a1e3c792', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/IMG_3335.jpg?v=1765233649', 'NEW AYRA 3PCS - View 8', false, 8)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('af795e1f-21a5-47af-8749-37d510fb9ca7', 'a6512b44-8268-47e2-84c4-daf6a1e3c792', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/IMG_3336.jpg?v=1765233649', 'NEW AYRA 3PCS - View 9', false, 9)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('9121c6db-408f-411f-8555-418b395c4f99', 'a6512b44-8268-47e2-84c4-daf6a1e3c792', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/IMG_3334.jpg?v=1765233649', 'NEW AYRA 3PCS - View 10', false, 10)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('9ff35c8c-aa8a-4ba0-8dba-d78350f0bc41', 'a6512b44-8268-47e2-84c4-daf6a1e3c792', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/IMG_3331.jpg?v=1765233649', 'NEW AYRA 3PCS - View 11', false, 11)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('ede8c9da-99a4-4a48-8410-6407a56fcc5c', 'Blackish EMB 3PCS', 'blackish-emb-3pcs-1', '<p><span style="color: rgb(0, 0, 0);"><!-- TRUST BADGES (LARGE + PREMIUM) --></span></p>
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
<p style="font-size: 13px; color: #555; margin-top: 5px;"><span style="color: rgb(0, 0, 0);">Limited pieces available — restocks are not guaranteed.</span></p>', 'TAW-TC-S-1', '90151ef9-20ad-496b-8daf-eef1fb0a8aa9', 'Unstitched / Stitched', 6499, 8150, 'Premium Cotton Lawn / Raw Silk', '{"3PCS","aura","ladies two piefce","ready to wear","wintercollection"}', '{"S","M","L","XL"}', true, true, true, true, 0)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('c0265ac4-f839-41db-8d2f-8afe0ce3a1cc', 'ede8c9da-99a4-4a48-8410-6407a56fcc5c', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/SnapInsta_imgupscaler.ai_v1_Fast__4K_4.png?v=1764692220', 'Blackish EMB 3PCS - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('80844837-2053-4905-8e4b-216443ff315b', 'ede8c9da-99a4-4a48-8410-6407a56fcc5c', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/SnapInsta_imgupscaler.ai_v1_Fast__4K_3.png?v=1764692223', 'Blackish EMB 3PCS - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('6b518d61-d740-45f9-8f95-1e9f7e1f24cf', 'ede8c9da-99a4-4a48-8410-6407a56fcc5c', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/SnapInsta_imgupscaler.ai_v1_Fast__4K_2.png?v=1764692220', 'Blackish EMB 3PCS - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('56a5fbad-0f5f-4c26-87e1-52073a112576', 'ede8c9da-99a4-4a48-8410-6407a56fcc5c', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/SnapInsta_imgupscaler.ai_v1_Fast__4K_1_1.png?v=1764692220', 'Blackish EMB 3PCS - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('631ab24a-cccd-4aa6-81b6-d140cbdfc44e', 'ede8c9da-99a4-4a48-8410-6407a56fcc5c', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/SnapInsta_imgupscaler.ai_v1_Fast__4K_5.png?v=1764692371', 'Blackish EMB 3PCS - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('2b3ed078-321b-43ac-8ff2-9ed0fcb9dff1', 'Zeenat EMB – 3PCs', 'zeenat-emb-3pcs', '<p><span style="color: rgb(0, 0, 0);"><!-- TRUST BADGES (LARGE + PREMIUM) --></span></p>
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
<p style="font-size: 13px; color: #555; margin-top: 5px;"><span style="color: rgb(0, 0, 0);">Limited pieces available — restocks are not guaranteed.</span></p>', 'TAW-NE-S', '90151ef9-20ad-496b-8daf-eef1fb0a8aa9', 'Unstitched / Stitched', 6499, 8460, 'Premium Cotton Lawn / Raw Silk', '{}', '{"S","M","L","XL"}', true, true, true, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('efcb2e27-be5e-44dc-8eea-9dc3f9b755b3', '2b3ed078-321b-43ac-8ff2-9ed0fcb9dff1', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/eidshoot_s_z_a_-1902_jpg.jpg?v=1762781175', 'Zeenat EMB – 3PCs - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('3e3cf0e6-6ecf-42c0-899a-ec61d29c4ccb', '2b3ed078-321b-43ac-8ff2-9ed0fcb9dff1', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/eidshoot_s_z_a_-1843_jpg.jpg?v=1762781175', 'Zeenat EMB – 3PCs - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('668e57e2-3f1f-4dcd-8b31-da598e69cf0e', '2b3ed078-321b-43ac-8ff2-9ed0fcb9dff1', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/eidshoot_s_z_a_-1867_jpg.jpg?v=1762781175', 'Zeenat EMB – 3PCs - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('33525cb4-5597-4408-88dc-1eaf45362b7c', '2b3ed078-321b-43ac-8ff2-9ed0fcb9dff1', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/eidshoot_s_z_a_-1885_jpg.jpg?v=1762781175', 'Zeenat EMB – 3PCs - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('04bc9d55-a848-412c-873a-6d6af2e7fb20', '2b3ed078-321b-43ac-8ff2-9ed0fcb9dff1', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/eidshoot_s_z_a_-1902.jpg_1.jpg?v=1762781175', 'Zeenat EMB – 3PCs - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('c7923481-a7a1-462f-8dff-9ddadb4a5ae1', '2b3ed078-321b-43ac-8ff2-9ed0fcb9dff1', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/eidshoot_s_z_a_-1934_jpg.jpg?v=1762781175', 'Zeenat EMB – 3PCs - View 6', false, 6)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('7a7660eb-e30e-471b-80d6-8be45c9a6531', '2b3ed078-321b-43ac-8ff2-9ed0fcb9dff1', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/eidshoot_s_z_a_-1945_jpg.jpg?v=1762781175', 'Zeenat EMB – 3PCs - View 7', false, 7)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('ca40fced-d51e-4aaa-8fe8-b4df0f0776b7', '2b3ed078-321b-43ac-8ff2-9ed0fcb9dff1', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/eidshoot_s_z_a_-1987_jpg.jpg?v=1762781175', 'Zeenat EMB – 3PCs - View 8', false, 8)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('3109701f-047d-45a6-8a3c-788b520642e9', '2b3ed078-321b-43ac-8ff2-9ed0fcb9dff1', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/eidshoot_s_z_a_-1993_dc28bebb-b36d-4f2f-b07b-4b22bfc341f1_jpg.jpg?v=1762781175', 'Zeenat EMB – 3PCs - View 9', false, 9)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('2e2d740d-1240-466c-8fd2-ae70f68b6972', '2b3ed078-321b-43ac-8ff2-9ed0fcb9dff1', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/eidshoot_s_z_a_-2005_jpg.jpg?v=1762781175', 'Zeenat EMB – 3PCs - View 10', false, 10)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('9e23c099-e2ef-454c-8500-52c782931f0f', 'SAYA EMB 3PCS', 'aish-3pcs', '<p><span style="color: rgb(0, 0, 0);"><!-- TRUST BADGES (LARGE + PREMIUM) --></span></p>
<div class="space-x-md flex items-center">
<div class="flex flex-col"></div>
</div>
<h2 style="font-weight: 600; margin-bottom: 6px;"><span style="color: rgb(0, 0, 0);">SAYA — Pink Purple Linen 3Pcs</span></h2>
<p style="font-size: 13px; color: #c59d5f; margin-bottom: 8px;"><span style="color: rgb(255, 42, 0);"><strong>🌸 Feminine Favorite • Premium Collection</strong></span></p>
<p style="font-size: 13px; color: #888; margin-bottom: 8px;"><span style="color: rgb(248, 13, 13);"><strong>Premium Linen Embroidered Shirt &amp; Trouser • Dupatta Included</strong></span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Product Highlights</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Premium linen embroidered shirt</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Elegant pink-purple tone for a feminine look</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Long graceful shirt with a flattering fall</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Standard-fit trouser for balanced styling</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Matching dupatta for a complete outfit</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">3-piece ready-to-wear ensemble</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Fabric &amp; Feel</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Crafted from breathable premium linen, offering comfort with structure, paired with a lightweight dupatta that adds softness and elegance.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Occasion</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Perfect for festive wear, daytime events, and semi-formal gatherings — designed to give you a graceful and polished appearance.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Product Details</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fabric: Premium Linen</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Work: Embroidered</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Pieces: 3 (Shirt + Trouser + Dupatta)</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Color: Pink Purple</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Style: Long-length graceful shirt</span></li>
</ul>
<p style="font-size: 13px; color: #777; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">⚠️ Actual product color may vary slightly due to lighting and screen settings.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Delivery &amp; Payment</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Cash on Delivery available nationwide</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fast shipping across Pakistan</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Carefully packed for quality assurance</span></li>
</ul>
<p style="font-size: 13px; color: #555; margin-top: 5px;"><span style="color: rgb(0, 0, 0);">Limited pieces available — restocks are not guaranteed.</span></p>', 'TAW-SE3-S', '90151ef9-20ad-496b-8daf-eef1fb0a8aa9', 'Unstitched / Stitched', 5580, 8500, 'Premium Cotton Lawn / Raw Silk', '{}', '{"S","M","L","XL"}', true, true, true, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('75967362-e0a5-4801-817f-df6ced38f433', '9e23c099-e2ef-454c-8500-52c782931f0f', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/WhatsAppImage2025-10-18at21.35.30_2.jpg?v=1760981349', 'SAYA EMB 3PCS - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('80f1422b-8a6b-43b5-8a06-13cfb0b8f326', '9e23c099-e2ef-454c-8500-52c782931f0f', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/WhatsAppImage2025-10-18at21.35.31_2.jpg?v=1760981355', 'SAYA EMB 3PCS - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('cc092291-d3ae-4c20-8590-a89e1b056d09', '9e23c099-e2ef-454c-8500-52c782931f0f', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/WhatsAppImage2025-10-18at21.35.29_1.jpg?v=1760981355', 'SAYA EMB 3PCS - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('178bd4d4-f6d4-4629-83ed-86b4570c1375', '9e23c099-e2ef-454c-8500-52c782931f0f', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/WhatsAppImage2025-10-18at21.35.29.jpg?v=1760981355', 'SAYA EMB 3PCS - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('880ae817-2bf4-4f1b-81b8-600fdde5b420', '9e23c099-e2ef-454c-8500-52c782931f0f', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/WhatsAppImage2025-10-18at21.35.30_1.jpg?v=1760981355', 'SAYA EMB 3PCS - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('3b2e8de4-430c-446a-811c-c009fdca601f', '9e23c099-e2ef-454c-8500-52c782931f0f', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/WhatsAppImage2025-10-18at21.35.30.jpg?v=1760981355', 'SAYA EMB 3PCS - View 6', false, 6)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('bb4b0a99-3ec9-40e8-8d4c-55cfe58b021e', '9e23c099-e2ef-454c-8500-52c782931f0f', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/WhatsAppImage2025-10-18at21.35.31_1.jpg?v=1760981338', 'SAYA EMB 3PCS - View 7', false, 7)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('da1dae20-aed8-4ffd-84b0-7c7d4dda8a28', '9e23c099-e2ef-454c-8500-52c782931f0f', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/WhatsAppImage2025-10-18at21.35.31.jpg?v=1760981338', 'SAYA EMB 3PCS - View 8', false, 8)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('de978772-42a9-4557-836a-5db4e762f36e', 'Kehksha  2PC Dhank Suit', 'pista-3pcs-copy', '<p data-start="745" data-end="956"><strong data-start="745" data-end="776">💚</strong><br data-start="776" data-end="779">Stay effortlessly chic in our <em data-start="809" data-end="832">Pastel Green Elegance</em>. This 2-piece embroidered Dhank suit brings a blend of comfort and class — perfect for summer days and everyday elegance.</p>
<p data-start="958" data-end="1052">👗 <strong data-start="961" data-end="986">2 Piece Set Includes:</strong><br data-start="986" data-end="989">✔ Embroidered Dhank cotton kurta<br data-start="1021" data-end="1024">✔ Straight cotton trousers</p>
<p data-start="1054" data-end="1222">🌿 <strong data-start="1057" data-end="1068">Fabric:</strong> Premium Dhank – breathable &amp; soft<br data-start="1109" data-end="1112">💚 <strong data-start="1115" data-end="1125">Shade:</strong> Pastel Green – calm, refreshing look<br data-start="1162" data-end="1165">🌸 <strong data-start="1168" data-end="1178">Style:</strong> Elegant embroidery with minimal aesthetic</p>
<p data-start="1224" data-end="1375">✨ <strong data-start="1226" data-end="1242">Perfect for:</strong> Daily wear, office, and casual outings.<br data-start="1282" data-end="1285"><br></p>
<p data-start="779" data-end="854"><img src="https://cdn.shopify.com/s/files/1/0950/1478/1245/files/42_size.jpg?v=1757954418" alt=""><br></p>', 'TAW-KEHKS-S', '238b9607-7157-468b-82ad-49fd47f535f7', 'Clothing', 3999, 7500, 'Premium Cotton Lawn / Raw Silk', '{"fashion clothing","ladies two piefce","newarrival","ready to wear"}', '{"S","M","L"}', true, false, true, true, 0)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('a09e8c29-0311-4f7d-872d-ed3a6e691a01', 'de978772-42a9-4557-836a-5db4e762f36e', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/undefined_change_pose_3_1.png?v=1759926490', 'Kehksha  2PC Dhank Suit - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('a885b665-9def-44ad-87df-8d456eb353c5', 'de978772-42a9-4557-836a-5db4e762f36e', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/undefined_change_pose_2_1.png?v=1759926564', 'Kehksha  2PC Dhank Suit - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('0c850a0b-0664-452e-8c7c-7f85992ec2ad', 'de978772-42a9-4557-836a-5db4e762f36e', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/aaa.png?v=1759926669', 'Kehksha  2PC Dhank Suit - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('2da215ed-d9d7-4b2a-89af-7b76661c5fd9', 'de978772-42a9-4557-836a-5db4e762f36e', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/undefined_change_pose_6.png?v=1759926419', 'Kehksha  2PC Dhank Suit - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('4fbf5d47-0b38-4025-8534-321f3c711e3b', 'Red Reverie 3pcs', 'red-reverie-3pcs', '<p><span style="color: rgb(0, 0, 0);"><!-- TRUST BADGES (LARGE + PREMIUM) --></span></p>
<div style="display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin-bottom: 14px; font-size: 14px;"></div>
<h2 style="font-weight: 600; margin-bottom: 6px;"><span style="color: rgb(0, 0, 0);">Red Reverie — Embroidered Cotton 3Pcs</span></h2>
<p style="font-size: 13px; color: #c59d5f; margin-bottom: 8px;"><span style="color: rgb(237, 18, 18);"><strong>❤️ Festive Favorite • Limited Stock</strong></span></p>
<p style="font-size: 13px; color: #888; margin-bottom: 8px;"><strong><span style="color: rgb(0, 0, 0);">Premium Cotton Embroidered Shirt &amp; Trouser • Dupatta Included</span></strong><span style="color: rgb(0, 0, 0);"></span></p>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Premium cotton embroidered shirt</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Rich red tone for a bold, festive look</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Long graceful shirt with elegant fall</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Standard-fit trouser for balanced styling</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Matching dupatta for a complete outfit</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">3-piece ready-to-wear ensemble</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Fabric &amp; Feel</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Crafted from breathable premium cotton, offering lightweight comfort and softness — perfect for all-day wear with a polished finish.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Occasion</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Ideal for festive wear, events, and special gatherings — designed to give you a confident and standout appearance.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Product Details</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fabric: Premium Cotton</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Work: Embroidered</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Pieces: 3 (Shirt + Trouser + Dupatta)</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Color: Red</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Style: Long-length graceful shirt</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Delivery &amp; Payment</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Cash on Delivery available nationwide</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fast shipping across Pakistan</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Carefully packed for quality assurance</span></li>
</ul>
<p style="font-size: 13px; color: #555; margin-top: 5px;"><span style="color: rgb(0, 0, 0);">Limited pieces available — restocks are not guaranteed.</span></p>', 'TAW-RN3-S', '90151ef9-20ad-496b-8daf-eef1fb0a8aa9', 'Unstitched / Stitched', 6499, 8250, 'Premium Cotton Lawn / Raw Silk', '{}', '{"S","M","L","XL"}', true, true, false, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('1a6a820b-c238-45e6-8418-d373626dcf36', '4fbf5d47-0b38-4025-8534-321f3c711e3b', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/RedReverie6.webp?v=1759595664', 'Red Reverie 3pcs - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('d14c62b5-8fd9-4259-8a68-7f0211f75c2b', '4fbf5d47-0b38-4025-8534-321f3c711e3b', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/RedReverie1.webp?v=1759595664', 'Red Reverie 3pcs - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('c69a19ff-48b7-481c-8f1a-78d5f31cfcd6', '4fbf5d47-0b38-4025-8534-321f3c711e3b', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/RedReverie2.webp?v=1759595665', 'Red Reverie 3pcs - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('8c816b14-3fda-4088-89f3-97fb0432940c', '4fbf5d47-0b38-4025-8534-321f3c711e3b', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/RedReverie3.webp?v=1759595664', 'Red Reverie 3pcs - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('3b3867ba-059d-4b0c-87cc-253760171b72', '4fbf5d47-0b38-4025-8534-321f3c711e3b', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/RedReverie4.webp?v=1759595665', 'Red Reverie 3pcs - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('b6e8e5e4-f2cc-4057-86fd-e1d3b2ce1fe0', '4fbf5d47-0b38-4025-8534-321f3c711e3b', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/RedReverie5.webp?v=1759595664', 'Red Reverie 3pcs - View 6', false, 6)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('7080a331-d37e-4394-8d5b-ade861c2a99a', '4fbf5d47-0b38-4025-8534-321f3c711e3b', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/RedReverie7.webp?v=1759595664', 'Red Reverie 3pcs - View 7', false, 7)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('71e4bf49-c90f-4ebe-8015-e07beebf5cdc', '4fbf5d47-0b38-4025-8534-321f3c711e3b', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/RedReverie8.webp?v=1759595665', 'Red Reverie 3pcs - View 8', false, 8)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('d0dec34a-83bb-4da2-844d-743e9f382462', 'ALEESHA EMBROIDERY 3PC', 'aleesha-embroidery-3pc', '<p><span style="color: rgb(0, 0, 0);"><!-- TRUST BADGES (LARGE + PREMIUM) --></span></p>
<div style="display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin-bottom: 14px; font-size: 14px;"></div>
<h2 style="font-weight: 600; margin-bottom: 6px;"><span style="color: rgb(0, 0, 0);">Aleesha — Embroidered Linen 3Pcs</span></h2>
<p style="font-size: 13px; color: #c59d5f; margin-bottom: 8px;"><span style="color: rgb(250, 10, 10);"><strong>✨ All-Season Wear • Premium Collection</strong></span></p>
<p style="font-size: 13px; color: #888; margin-bottom: 8px;"><strong><span style="color: rgb(0, 0, 0);">Premium Linen Embroidered Shirt &amp; Trouser • Complete 3PC Set</span></strong></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Product Highlights</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Premium 4-season linen embroidered shirt</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Elegant embroidery for a refined finish</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Long-length design for a graceful fall</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Classic and modest silhouette</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Matching trouser for a complete outfit</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">3-piece ready-to-wear ensemble</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Fabric &amp; Feel</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Crafted from high-quality linen suitable for all seasons, offering breathable comfort in summer and a structured feel for mid-season wear.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Occasion</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Perfect for everyday elegance, office wear, and semi-formal gatherings — designed to deliver a polished and sophisticated look.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Product Details</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fabric: Premium Linen (4-Season Wear)</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Work: Embroidered</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Pieces: 3 (Shirt + Trouser + Dupatta)</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Style: Embroidered 3-piece suit</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Delivery &amp; Payment</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Cash on Delivery available nationwide</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fast shipping across Pakistan</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Carefully packed for quality assurance</span></li>
</ul>
<p style="font-size: 13px; color: #555; margin-top: 5px;"><span style="color: rgb(0, 0, 0);">Limited pieces available — restocks are not guaranteed.</span></p>', 'TAW-ND3-S-0', '90151ef9-20ad-496b-8daf-eef1fb0a8aa9', 'Unstitched / Stitched', 6499, 8350, 'Premium Cotton Lawn / Raw Silk', '{}', '{"S","M","L","Extra-Large"}', true, true, false, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('135c8999-b147-4af1-8ab2-6c19af0ac6be', 'd0dec34a-83bb-4da2-844d-743e9f382462', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/alishaweb2.jpg?v=1759595663', 'ALEESHA EMBROIDERY 3PC - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('bf67ced1-253b-4b83-852b-0490992780ed', 'd0dec34a-83bb-4da2-844d-743e9f382462', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/alishaweb3.jpg?v=1759595663', 'ALEESHA EMBROIDERY 3PC - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('04c8b99e-c011-4394-85a0-64bd49908eda', 'd0dec34a-83bb-4da2-844d-743e9f382462', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/alishaweb1.jpg?v=1759595664', 'ALEESHA EMBROIDERY 3PC - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('21d409ad-a4ed-4640-8f2c-240ae8084725', 'd0dec34a-83bb-4da2-844d-743e9f382462', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/alishaweb4.jpg?v=1759595664', 'ALEESHA EMBROIDERY 3PC - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('2921bc89-7bfc-42b0-81a9-2932ea5b6fdc', 'LEMON BLOSSOM 3Pcs', 'lemon-blossom-3pcs', '<p><span style="color: rgb(0, 0, 0);"><!-- TRUST BADGES (LARGE + PREMIUM) --></span></p>
<div style="display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin-bottom: 14px; font-size: 14px;"></div>
<h2 style="font-weight: 600; margin-bottom: 6px;"><span style="color: rgb(0, 0, 0);">Lemon Blossom — Fresh Summer 3Pcs</span></h2>
<p style="font-size: 13px; color: #888; margin-bottom: 8px;"><strong><span style="color: rgb(0, 0, 0);">Cotton Lawn Shirt • Cotton Trouser • Chiffon Dupatta</span></strong></p>
<p style="font-size: 14px; line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">A refreshing summer ensemble designed in a soft lemon tone, combining comfort with effortless style. Featuring an embroidered cotton lawn kurta paired with a printed farshi shalwar and a lightweight chiffon dupatta, Lemon Blossom brings a perfect balance of tradition and modern elegance.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Product Highlights</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Embroidered cotton lawn kurta</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Elegant and breathable summer fabric</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Farshi printed shalwar for a trendy traditional look</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Lightweight chiffon dupatta with soft drape</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">3-piece ready-to-wear outfit</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Fabric &amp; Feel</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Crafted with breathable cotton lawn for maximum comfort in summer, paired with a soft chiffon dupatta that adds a light and graceful finish.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Occasion</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Perfect for casual wear, daytime outings, and festive summer gatherings — designed to keep you cool while looking effortlessly stylish.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Product Details</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Number of Pieces: 3 (Shirt + Trouser + Dupatta)</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Shirt Fabric: Cotton Lawn</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Trouser Fabric: Cotton</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Dupatta Fabric: Chiffon</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Top Style: Embroidered Kurta</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Shalwar Type: Farshi Printed Shalwar</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Work Technique: Embroidered</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Season: Summer Wear</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Delivery &amp; Payment</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Cash on Delivery available nationwide</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fast shipping across Pakistan</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Carefully packed for quality assurance</span></li>
</ul>
<p style="font-size: 13px; color: #555; margin-top: 5px;"><span style="color: rgb(0, 0, 0);">Limited pieces available — restocks are not guaranteed.</span></p>', 'TAW-LEMON-S-0', '238b9607-7157-468b-82ad-49fd47f535f7', 'Clothing', 4999, 8199, 'Premium Cotton Lawn / Raw Silk', '{"3PCS","Bloom pret","farshi shalwar","fashion clothing","lawndress","newarrival","ready to wear"}', '{"S","M","L","X Large"}', true, true, true, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('527a29b6-02ba-40c0-8c8c-1950d3a0c485', '2921bc89-7bfc-42b0-81a9-2932ea5b6fdc', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/rn-image_picker_lib_temp_d4bcc5c1-d0c6-4e11-afab-3d022473a9f4.jpg?v=1759167756', 'LEMON BLOSSOM 3Pcs - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('01216a78-f1e0-4a79-8d0f-028aaa885ead', '2921bc89-7bfc-42b0-81a9-2932ea5b6fdc', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/rn-image_picker_lib_temp_4e87552b-9c90-4cfe-969b-d0221300b0b6.jpg?v=1759167756', 'LEMON BLOSSOM 3Pcs - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('0c38a255-bdde-4b75-8941-c78ab260a15d', '2921bc89-7bfc-42b0-81a9-2932ea5b6fdc', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/rn-image_picker_lib_temp_4a71abeb-98b2-49ed-bfa9-92980e776e7e.jpg?v=1759167756', 'LEMON BLOSSOM 3Pcs - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('7b1b0e46-0e1b-4693-85a3-8ad4a8b498df', '2921bc89-7bfc-42b0-81a9-2932ea5b6fdc', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/rn-image_picker_lib_temp_dd945ef4-eb34-4e1d-9a2d-262168061d08.jpg?v=1759167756', 'LEMON BLOSSOM 3Pcs - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('10333478-99cd-41e3-8034-0c4246c4dbad', '2921bc89-7bfc-42b0-81a9-2932ea5b6fdc', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/rn-image_picker_lib_temp_717f31cc-dcfa-409e-a1b3-ee1c4e30ae24.jpg?v=1759167756', 'LEMON BLOSSOM 3Pcs - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('314f3b61-b92f-458d-8b55-5d404bea2f2a', '2921bc89-7bfc-42b0-81a9-2932ea5b6fdc', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/rn-image_picker_lib_temp_032d9ed2-f4e8-4b21-b61d-e3d3665f62ef.jpg?v=1759167756', 'LEMON BLOSSOM 3Pcs - View 6', false, 6)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('95b718f5-08d9-462c-80f4-6718a2bac365', '2921bc89-7bfc-42b0-81a9-2932ea5b6fdc', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/rn-image_picker_lib_temp_c330ab06-3359-4995-8da6-e378aed1ade5.jpg?v=1759167756', 'LEMON BLOSSOM 3Pcs - View 7', false, 7)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('f861af9f-db50-4881-8c47-0050e0bdcada', 'Mustard Hill', 'mustard-hill', '<p data-start="142" data-end="331">Elevate your everyday style with this <strong data-start="180" data-end="210">premium cotton 2-piece set</strong>, blending comfort with chic embroidery details. Perfect for summer wear – light, breezy, and effortlessly stylish. 🌿✨</p>
<p data-start="333" data-end="462">👗 <strong data-start="336" data-end="358">Product Highlights</strong><br data-start="358" data-end="361">✔ Premium cotton fabric<br data-start="384" data-end="387">✔ Long shirt (41��42") for an elegant fit<br data-start="427" data-end="430">✔ Embroidered trouser (37–38")</p>
<p data-start="464" data-end="488">📏 <strong data-start="467" data-end="486">Available Sizes</strong></p>
<ul data-start="489" data-end="574">
<li data-start="489" data-end="511">
<p data-start="491" data-end="511">Small: Chest 19.5"</p>
</li>
<li data-start="512" data-end="535">
<p data-start="514" data-end="535">Medium: Chest 21.5"</p>
</li>
<li data-start="536" data-end="556">
<p data-start="538" data-end="556">Large: Chest 23"</p>
</li>
<li data-start="557" data-end="574">
<p data-start="559" data-end="574">XL: Chest 24"</p>
</li>
</ul>
<p data-start="576" data-end="623">💛 Mustard tones for a bold yet graceful look</p>
<p data-start="625" data-end="695">#MustardHill #EasternWear #SummerStyle #CottonChic #EmbroideredLooks</p>
<p data-start="697" data-end="793">⚠️ <strong data-start="700" data-end="715">Disclaimer:</strong> Product color may slightly vary due to lighting or screen display settings.<img src="https://cdn.shopify.com/s/files/1/0950/1478/1245/files/42_size.jpg?v=1757954418" alt=""></p>', 'TAW-ME2-S-1', '238b9607-7157-468b-82ad-49fd47f535f7', 'Clothing', 3999, 5400, 'Premium Cotton Lawn / Raw Silk', '{"Bloom pret","fashion clothing","ladies two piefce","lawndress","newarrival","ready to wear"}', '{"Mustard"}', true, false, false, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('f6adc88a-ab17-4af4-8a21-eeec4edc16c4', 'f861af9f-db50-4881-8c47-0050e0bdcada', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/rn-image_picker_lib_temp_3f6c3247-be8f-43f1-b342-b8194a86c6e6.jpg?v=1759167755', 'Mustard Hill - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('bfbb5e5c-fb5c-4117-86e2-0811557e5e7b', 'f861af9f-db50-4881-8c47-0050e0bdcada', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/rn-image_picker_lib_temp_aa4be883-5ba4-4442-853a-b59b173059b5.jpg?v=1759167754', 'Mustard Hill - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('03517a14-ac3f-483c-8133-1c1b7784e58e', 'f861af9f-db50-4881-8c47-0050e0bdcada', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/rn-image_picker_lib_temp_7ee672b6-1ef5-4866-b5cf-444da80a7d41.jpg?v=1759167755', 'Mustard Hill - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('7aa6b5be-d74b-4b39-8823-77e30b536a9f', 'f861af9f-db50-4881-8c47-0050e0bdcada', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/rn-image_picker_lib_temp_b9630af4-9ddd-4d32-8dc4-2fa0f6d9d760.jpg?v=1759167754', 'Mustard Hill - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('f679c233-4b38-4bdc-8492-f3b127840808', 'f861af9f-db50-4881-8c47-0050e0bdcada', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/rn-image_picker_lib_temp_391f6095-a85f-431a-9b6e-345713dfce1a.jpg?v=1759167755', 'Mustard Hill - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('0735f7f4-4f41-40f5-8d2f-1ee39954259c', 'f861af9f-db50-4881-8c47-0050e0bdcada', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/rn-image_picker_lib_temp_7eb729a0-43dc-4f85-b20f-1477ef2ddf66.jpg?v=1759167755', 'Mustard Hill - View 6', false, 6)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('d1039b8d-4e55-4c37-8899-d8a28d40d890', 'Zirwah 3pcs', 'pink-aura-2pcs-copy', '<p data-start="80" data-end="345">Elevate your everyday look with our <strong data-start="118" data-end="158">Maroon Embroidered 3-Piece Kurta Set</strong> 🌸<br data-start="161" data-end="164">Made with breathable cotton, this straight-cut kurta paired with matching trouser &amp; dupatta brings effortless charm and comfort to your summer wear. Perfect for daily elegance! 💕</p>
<p data-start="347" data-end="468">🔹 Fabric: Cotton<br data-start="364" data-end="367">🔹 3 Piece Set – Kurta + Trouser + Dupatta<br data-start="409" data-end="412">🔹 Embroidered Details | Regular Fit | Summer Friendly</p>
<p data-start="470" data-end="513">🌿 Style made simple, elegance made easy.</p>
<p data-start="515" data-end="627">⚠️ <strong data-start="518" data-end="533">Disclaimer:</strong> Actual product color may vary slightly from the images due to lighting and screen settings.<br><br><img src="https://cdn.shopify.com/s/files/1/0935/5368/8891/files/ChatGPT_Image_Oct_20_2025_10_41_54_PM.png?v=1760982220" alt=""><br></p>', 'TAW-MM3-S', '238b9607-7157-468b-82ad-49fd47f535f7', 'Clothing', 4599, 6200, 'Premium Cotton Lawn / Raw Silk', '{"fashion clothing","ladies two piefce","newarrival","ready to wear"}', '{"S","M","L","XL"}', true, false, false, true, 0)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('4f9fcc4a-a9b4-4549-8ae4-5c079680df1c', 'd1039b8d-4e55-4c37-8899-d8a28d40d890', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/1_1.png?v=1759167751', 'Zirwah 3pcs - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('223a9743-779b-476f-8ca9-d38175ed58d7', 'd1039b8d-4e55-4c37-8899-d8a28d40d890', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/2.png?v=1759167750', 'Zirwah 3pcs - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('8b729611-3c23-4766-8aa6-814c527f8ca4', 'd1039b8d-4e55-4c37-8899-d8a28d40d890', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/3.png?v=1759167751', 'Zirwah 3pcs - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('d755a039-4371-41ab-8cb5-ac19db7698bb', 'd1039b8d-4e55-4c37-8899-d8a28d40d890', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/4.png?v=1759167751', 'Zirwah 3pcs - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('1bddab07-6191-4d3a-8e3c-16b73a06db25', 'Pink Aura 2PCS', 'pink-aura-2pcs', '<p>Bring grace and freshness to your wardrobe with the Pink Aura 3-Piece Kurta Set by GulPash. 🌷✨<br>Crafted from breathable cotton fabric, this long embroidered kurta in a soft pink hue exudes charm and sophistication. It is paired with a matching straight trouser for everyday comfort, while the elegant poly silk dupatta adds a touch of refined beauty. Perfect for daily summer wear, Pink Aura combines elegance with effortless style.</p>
<p>👗 Outfit Type: Eastern Ready-to-Wear<br>🧵 Fabric: Cotton Shirt &amp; Trouser, Poly Silk Dupatta<br>🎨 Color: Pink<br>✨ Work: Embroidered<br>👚 Top Style: Long Kurta, Regular Fit<br>👖 Bottom Style: Straight Trouser<br>🧕 Dupatta: Poly Silk Dupatta<br>🔹 Pieces: 3 (Shirt + Trouser + Dupatta)<br>🌸 Season: Summer Wear⚠️ Disclaimer: Actual product color may vary slightly from the image.</p>
<p>🌷 Pink Aura – soft, elegant, and perfect for effortless everyday charm.<br><img src="https://cdn.shopify.com/s/files/1/0950/1478/1245/files/42_size.jpg?v=1757954418" alt=""><br></p>', 'TAW-HP2-S-0', '238b9607-7157-468b-82ad-49fd47f535f7', 'Clothing', 3050, 5200, 'Premium Cotton Lawn / Raw Silk', '{"fashion clothing","ladies two piefce","newarrival","ready to wear"}', '{"S","M","L","XL"}', true, false, false, true, 0)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('8811d3ce-2767-4aa5-8caf-8439c33b58f9', '1bddab07-6191-4d3a-8e3c-16b73a06db25', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/pink4.jpg?v=1759167749', 'Pink Aura 2PCS - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('d3949269-bc50-442d-87ff-6128a8ee3a61', '1bddab07-6191-4d3a-8e3c-16b73a06db25', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/pink2.jpg?v=1759167749', 'Pink Aura 2PCS - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('bee6aced-7529-4620-80ef-111b634ceaa1', '1bddab07-6191-4d3a-8e3c-16b73a06db25', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/pink3.jpg?v=1759167749', 'Pink Aura 2PCS - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('4376dbf0-1a91-4719-867c-176c09eb44ae', '1bddab07-6191-4d3a-8e3c-16b73a06db25', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/pink1.jpg?v=1759167749', 'Pink Aura 2PCS - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('6a9aed35-6700-4af8-80d4-290e0cf98572', '1bddab07-6191-4d3a-8e3c-16b73a06db25', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/pink5.jpg?v=1759167749', 'Pink Aura 2PCS - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('12089c26-f9ce-4cdf-880d-69788b3292ab', '1bddab07-6191-4d3a-8e3c-16b73a06db25', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/1_4.jpg?v=1759167750', 'Pink Aura 2PCS - View 6', false, 6)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('bd422046-dfd8-4dee-8cb1-f2ff3167669b', 'Noir Dream', 'mah-jabeen-embroidered-2pc', '<p data-start="92" data-end="139"><strong data-start="95" data-end="134">Black Embroidered 2PC Stitched Suit</strong> 🖤</p>
<p data-start="141" data-end="349">A wardrobe essential you can’t go wrong with! This <strong data-start="192" data-end="226">straight-cut embroidered kurta</strong> paired with a matching trouser brings effortless elegance to your summer wear. Light, breathable, and timelessly chic. ✨</p>
<p data-start="351" data-end="485">👗 <strong data-start="354" data-end="372">Outfit Details</strong><br data-start="372" data-end="375">✔ Straight-cut basic lawn kurta<br data-start="406" data-end="409">✔ Matching straight trouser (basic lawn)<br data-start="449" data-end="452">✔ Elegant embroidered detailing</p>
<p data-start="487" data-end="506">📏 <strong data-start="490" data-end="504">Size &amp; Fit</strong></p>
<ul data-start="507" data-end="632">
<li data-start="507" data-end="527">
<p data-start="509" data-end="527">Small: Chest 19"</p>
</li>
<li data-start="528" data-end="549">
<p data-start="530" data-end="549">Medium: Chest 21"</p>
</li>
<li data-start="550" data-end="570">
<p data-start="552" data-end="570">Large: Chest 22"</p>
</li>
<li data-start="571" data-end="588">
<p data-start="573" data-end="588">XL: Chest 23"</p>
</li>
<li data-start="589" data-end="632">
<p data-start="591" data-end="632">Shirt Length: 38" | Trouser Length: 38"</p>
</li>
</ul>
<p data-start="634" data-end="736">🌿 Perfect for summer wear – breathable &amp; comfortable<br data-start="687" data-end="690">🖤 Classic black shade – versatile &amp; stylish</p>
<p data-start="738" data-end="810">#BlackElegance #EasternWear #SummerStyle #CottonChic #EmbroideredLooks</p>
<p data-start="812" data-end="908">⚠️ <strong data-start="815" data-end="830">Disclaimer:</strong> Product color may slightly vary due to lighting or screen display settings.<br><img src="https://cdn.shopify.com/s/files/1/0950/1478/1245/files/42_size.jpg?v=1757954418" alt=""><br></p>', 'TAW-ND-S', '238b9607-7157-468b-82ad-49fd47f535f7', 'Clothing', 4999, 5800, 'Premium Cotton Lawn / Raw Silk', '{"fashion clothing","ladies two piefce","newarrival","ready to wear"}', '{"S","M","L","XL"}', true, false, false, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('5bb55ce5-9a64-41d0-81f8-4acfbbaa2f90', 'bd422046-dfd8-4dee-8cb1-f2ff3167669b', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/WhatsAppImage2025-06-18at21.27.46_11d7006e.jpg?v=1759167748', 'Noir Dream - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('3c69034d-feb0-47ad-835b-21a6a140ed50', 'bd422046-dfd8-4dee-8cb1-f2ff3167669b', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/IMG-20250618-WA0031.jpg?v=1759167748', 'Noir Dream - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('096c382e-fc4d-4759-8ffd-48724dd74577', 'bd422046-dfd8-4dee-8cb1-f2ff3167669b', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/WhatsAppImage2025-06-18at21.27.40_5b28b987.jpg?v=1759167748', 'Noir Dream - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('46ce25c5-a1e6-487a-8dcf-f7de9a487cc5', 'bd422046-dfd8-4dee-8cb1-f2ff3167669b', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/WhatsAppImage2025-06-18at21.27.37_3348783e.jpg?v=1759167748', 'Noir Dream - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('f42aa116-5b6c-46f0-878b-6cddef78ac99', 'bd422046-dfd8-4dee-8cb1-f2ff3167669b', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/IMG-20250618-WA0030.jpg?v=1759167748', 'Noir Dream - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('01f1816f-4d1c-4bd3-840f-20b6fd285758', 'bd422046-dfd8-4dee-8cb1-f2ff3167669b', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/IMG-20250618-WA0029.jpg?v=1759167748', 'Noir Dream - View 6', false, 6)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('73958cd5-1a3f-4abd-8ed4-346a792bc36b', 'bd422046-dfd8-4dee-8cb1-f2ff3167669b', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/IMG-20250618-WA0028.jpg?v=1759167748', 'Noir Dream - View 7', false, 7)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('a3f6935b-ddc5-42f1-826f-2d5cc496ff8b', 'bd422046-dfd8-4dee-8cb1-f2ff3167669b', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/IMG-20250618-WA0027.jpg?v=1759167748', 'Noir Dream - View 8', false, 8)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('1685fec3-6037-4328-8384-955e120fac09', 'Hira Digital', 'hira-digital', '<p><strong>Gender: </strong>Women</p>
<p><strong>Category: </strong>Clothing</p>
<p><strong>Outfit Type: </strong>Eastern Ready to wear</p>
<p><strong>Sub-Category: </strong>Kurta Set</p>
<p><strong>Bottom Style: </strong>Trouser</p>
<p><strong>Color Type: </strong>Beige</p>
<p><strong>Lining Attached: </strong>No Lining</p>
<p><strong>Number of Pieces: </strong>2 Piece - Top &amp; Bottom</p>
<p><strong>Product Type: </strong>Daily/Basic Wear</p>
<p><strong>Season: </strong>Summer Wear</p>
<p><strong>Shirt Fabrics: </strong>Basic Lawn</p>
<p><strong>Top Fit: </strong>Regular Fit</p>
<p><strong>Trouser Fabrics: </strong>Basic Lawn</p>
<p><strong>Work Technique: </strong>Digital Printed</p>
<p><strong>Disclaimer: </strong>Actual product color may vary slightly from the image.</p>', 'TAW-HD-S-175335437044423', '238b9607-7157-468b-82ad-49fd47f535f7', 'Clothing', 2850, 4500, 'Premium Cotton Lawn / Raw Silk', '{"fashion clothing","ladies two piefce","newarrival","ready to wear"}', '{"S","m-1","L"}', true, false, false, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('301c09af-82c5-49c0-8817-2cda78688f8d', '1685fec3-6037-4328-8384-955e120fac09', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/insta-save.net_InstagramPost_amna_tahir_3512798734632368079.jpg?v=1759167747', 'Hira Digital - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('d70d8ed2-e447-49ab-88fb-81f23922fe8a', '1685fec3-6037-4328-8384-955e120fac09', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/insta-save.net_InstagramPost_amna_tahir_3512798734540303431.jpg?v=1759167747', 'Hira Digital - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('d9cd1394-b69b-4fd4-8fc6-6abb525b44c1', '1685fec3-6037-4328-8384-955e120fac09', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/insta-save.net_InstagramPost_amna_tahir_3512798734565409745.jpg?v=1759167747', 'Hira Digital - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('581cdc43-b224-40ad-8a6f-0db7c220a465', '1685fec3-6037-4328-8384-955e120fac09', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/insta-save.net_InstagramPost_amna_tahir_3512798734573686467.jpg?v=1759167747', 'Hira Digital - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('9a1a3ea2-e7d0-4ffb-838a-c3db35681bc7', 'NAVY CUT 3PCS', 'nailfoir-3pcs', '<p>Elevate your summer wardrobe with this elegant Blue 3-Piece Kurta Set by GulPash. ✨<br>Crafted from breathable cotton fabric, the set features a beautifully embroidered long kurta paired with a comfortable straight trouser and a soft chiffon dupatta. With an attached lining for a neat finish, this outfit is the perfect mix of comfort and style – ideal for daily summer wear.</p>
<p>👗 Outfit Type: Eastern Ready-to-Wear<br>🧵 Fabric: Cotton Shirt &amp; Trouser, Chiffon Dupatta<br>🎨 Color: Blue<br>✨ Work: Embroidered<br>👚 Top Style: Long Kurta, Regular Fit<br>👖 Bottom Style: Straight Trouser<br>🧕 Dupatta: Chiffon<br>🔹 Pieces: 3 (Shirt + Trouser + Dupatta)<br>🌸 Season: Summer Wear<br>📌 Product ID: LFP2366<br>⚠️ Disclaimer: Actual product color may vary slightly from the image.</p>
<p>💙 An exquisite embroidered 3-piece set – light, elegant, and perfect for your summer chic style.<br><img src="https://cdn.shopify.com/s/files/1/0950/1478/1245/files/42_size.jpg?v=1757954418" alt=""><br></p>', 'TAW-NAILO-M', '238b9607-7157-468b-82ad-49fd47f535f7', 'Clothing', 4399, 7400, 'Premium Cotton Lawn / Raw Silk', '{"3PCS","fashion clothing","ladies two piefce","newarrival","ready to wear"}', '{"M","L"}', true, false, false, true, 0)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('f66499e0-6b65-4678-830a-30be82b9c654', '9a1a3ea2-e7d0-4ffb-838a-c3db35681bc7', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/navyblue1.webp?v=1759167736', 'NAVY CUT 3PCS - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('b4dc7d4d-a620-4ce1-8ed3-d64999654113', '9a1a3ea2-e7d0-4ffb-838a-c3db35681bc7', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/navyblue2.webp?v=1759167736', 'NAVY CUT 3PCS - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('841baf95-a302-4765-85d7-4644b230b74e', '9a1a3ea2-e7d0-4ffb-838a-c3db35681bc7', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/navyblue3.webp?v=1759167737', 'NAVY CUT 3PCS - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('b420541b-ff07-41d6-875c-fdf94d0fb692', '9a1a3ea2-e7d0-4ffb-838a-c3db35681bc7', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/navyblue4.webp?v=1759167736', 'NAVY CUT 3PCS - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('47e4b23d-095e-4390-8fbe-b780b1e70e32', '9a1a3ea2-e7d0-4ffb-838a-c3db35681bc7', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/navyblue5.webp?v=1759167736', 'NAVY CUT 3PCS - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('e1a5e099-ca82-4bec-8165-2dffbe53d426', '9a1a3ea2-e7d0-4ffb-838a-c3db35681bc7', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/DSC03217.jpg?v=1759167736', 'NAVY CUT 3PCS - View 6', false, 6)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('3b072d2d-f780-4a08-8372-b53b544ffba9', 'Black Chic', 'noir-elegance-black-3-piece-cotton-suit', '<p data-start="144" data-end="334">Embrace timeless style with this <strong data-start="177" data-end="205">deep black cotton outfit</strong>, blending premium comfort with refined sophistication. Perfect for every occasion – from office hours to evening gatherings. ✨</p>
<p data-start="336" data-end="441">👗 <strong data-start="339" data-end="364">3 Piece Set Includes:</strong><br data-start="364" data-end="367">✔ Straight-cut cotton shirt<br data-start="394" data-end="397">✔ Matching trouser<br></p>
<p data-start="443" data-end="547">🌿 Premium breathable cotton<br data-start="471" data-end="474">🖤 Elegant deep black tone<br data-start="500" data-end="503">🌟 Versatile look for formal &amp; casual chic</p>
<p data-start="549" data-end="599">Step into elegance that never goes out of style.</p>
<p data-start="549" data-end="599"> #EasternWear #BlackOutfit #CottonChic #TimelessStyle #ElegantLooks</p>
<p data-start="685" data-end="781">⚠️ <strong data-start="688" data-end="703">Disclaimer:</strong> Product color may slightly vary due to lighting or screen display settings.<img src="https://cdn.shopify.com/s/files/1/0950/1478/1245/files/42_size.jpg?v=1757954418" alt=""></p>', 'TAW-BC-S', '90151ef9-20ad-496b-8daf-eef1fb0a8aa9', 'Unstitched / Stitched', 3120, 6500, 'Premium Cotton Lawn / Raw Silk', '{}', '{"S","M","L","XL"}', true, false, false, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('2273388a-802c-42c1-8c0a-d4c2764ae834', '3b072d2d-f780-4a08-8372-b53b544ffba9', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/JSP00478_1_1.jpg?v=1759167732', 'Black Chic - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('8f6e335f-19b4-4ce9-8392-13163090bde0', '3b072d2d-f780-4a08-8372-b53b544ffba9', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/JSP00478_3_1.jpg?v=1759167732', 'Black Chic - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('3b3913df-4220-4140-8c76-4b8925579b84', '3b072d2d-f780-4a08-8372-b53b544ffba9', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/JSP00478_4_1.jpg?v=1759167732', 'Black Chic - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('82ba1f2e-8dc0-4731-83dd-588179d69afa', '3b072d2d-f780-4a08-8372-b53b544ffba9', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/JSP00478_5_1.jpg?v=1759167732', 'Black Chic - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('b171be9a-ddeb-4078-8b42-0a587a928a94', '3b072d2d-f780-4a08-8372-b53b544ffba9', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/JSP00478_6_1.jpg?v=1759167732', 'Black Chic - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('5625451c-6f4f-4708-8643-c842a5a37703', '3b072d2d-f780-4a08-8372-b53b544ffba9', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/JSP00478_2_1.jpg?v=1759167732', 'Black Chic - View 6', false, 6)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('fda2b621-f13a-47ed-8046-a8cb491b8f0e', 'Red RoYal 3 Pc EMB', 'red-royal-1', '<p><span style="color: rgb(0, 0, 0);"><!-- TRUST BADGES (LARGE + PREMIUM) --></span></p>
<div style="display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin-bottom: 14px; font-size: 14px;"></div>
<h2 style="font-weight: 600; margin-bottom: 6px;"><span style="color: rgb(0, 0, 0);">Red Royal — Embroidered Cotton 3Pcs</span></h2>
<p style="font-size: 13px; color: #c59d5f; margin-bottom: 8px;"><span style="color: rgb(251, 14, 14);"><strong>👑 Royal Collection • Festive Favorite</strong></span></p>
<p style="font-size: 13px; color: #888; margin-bottom: 8px;"><strong><span style="color: rgb(0, 0, 0);">Premium Cotton Embroidered Shirt &amp; Trouser • Dupatta Included</span></strong></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Product Highlights</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Premium cotton embroidered shirt</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Rich maroon tone for a royal, elegant look</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Straight-cut design for a clean silhouette</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Matching trouser for a complete outfit</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Elegant dupatta for a polished finish</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">3-piece ready-to-wear ensemble</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Fabric &amp; Feel</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Crafted from high-quality cotton, offering breathable comfort with a smooth and refined finish — ideal for long wear during events.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Occasion</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Perfect for weddings, festive events, and evening gatherings — designed to give you a confident and standout appearance.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Product Details</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fabric: Premium Cotton</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Work: Embroidered</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Dupatta: Chifon</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Pieces: 3 (Shirt + Trouser + Dupatta)</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Color: Maroon</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Style: Straight-cut stitched shirt</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Sizes: Small, Medium, Large</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Delivery &amp; Payment</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Cash on Delivery available nationwide</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fast shipping across Pakistan</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Carefully packed for quality assurance</span></li>
</ul>
<p style="font-size: 13px; color: #555; margin-top: 5px;"><span style="color: rgb(0, 0, 0);">Limited pieces available — restocks are not guaranteed.</span></p>', 'TAW-RR-S-176053764426708', '90151ef9-20ad-496b-8daf-eef1fb0a8aa9', 'Unstitched / Stitched', 5800, 7250, 'Premium Cotton Lawn / Raw Silk', '{}', '{"S","M","L","XL"}', true, true, false, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('bffb72bb-5191-4e11-8dcc-afb1f89dd3ec', 'fda2b621-f13a-47ed-8046-a8cb491b8f0e', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/MaroonMirana_1_1.jpg?v=1759594902', 'Red RoYal 3 Pc EMB - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('864a44bb-f84d-4bdd-8ca2-983a4f955ec2', 'fda2b621-f13a-47ed-8046-a8cb491b8f0e', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/MaroonMirana_2_1.jpg?v=1759594902', 'Red RoYal 3 Pc EMB - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('43a8deab-eb06-475f-8be2-9153674dfcfe', 'fda2b621-f13a-47ed-8046-a8cb491b8f0e', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/MaroonMirana_3_1.jpg?v=1759167729', 'Red RoYal 3 Pc EMB - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('542e185f-06a1-4d47-83d6-58a32db00995', 'TW009', 'green-2pcs', '<p data-start="142" data-end="370">Refresh your style with the <strong data-start="189" data-end="206">Emerald Charm</strong> stitched 2-piece cotton suit. Featuring a vibrant green shirt, matching trouser, it offers a lively, graceful look with premium comfort.</p>
<p data-start="372" data-end="391"><strong data-start="372" data-end="389">Key Features:</strong></p>
<ul data-start="392" data-end="762">
<li data-start="392" data-end="459">
<p data-start="394" data-end="459"><strong data-start="394" data-end="405">Fabric:</strong> Premium quality cotton for breathable, all-day wear</p>
</li>
<li data-start="460" data-end="535">
<p data-start="462" data-end="535"><strong data-start="462" data-end="473">Design:</strong> Straight-cut stitched shirt with matching trouser &amp; dupatta</p>
</li>
<li data-start="536" data-end="598">
<p data-start="538" data-end="598"><strong data-start="538" data-end="549">Colour:</strong> Elegant green for a fresh, timeless appearance</p>
</li>
<li data-start="599" data-end="680">
<p data-start="601" data-end="680"><strong data-start="601" data-end="611">Sizes:</strong> Available in Small, Medium, and Large (with accurate measurements)</p>
</li>
<li data-start="681" data-end="762">
<p data-start="683" data-end="762"><strong data-start="683" data-end="696">Occasion:</strong> Ideal for festive events, casual gatherings, and summer outings</p>
</li>
</ul>', 'TAW-TW009-S', '90151ef9-20ad-496b-8daf-eef1fb0a8aa9', 'Unstitched / Stitched', 3000, 5500, 'Premium Cotton Lawn / Raw Silk', '{}', '{"S","M","L","XL"}', true, false, false, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('a82b1e33-74ba-4186-886f-3ca433c77af5', '542e185f-06a1-4d47-83d6-58a32db00995', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/greenshort2pcs_2_1.jpg?v=1759167728', 'TW009 - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('dce180d6-5b64-4fc6-89da-549543ff58d4', '542e185f-06a1-4d47-83d6-58a32db00995', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/greenshort2pcs_3_1.jpg?v=1759167728', 'TW009 - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('1127a6c2-f761-43ee-8cfc-9f9a87c6ad7c', '542e185f-06a1-4d47-83d6-58a32db00995', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/greenshort2pcs_1_1.jpg?v=1759167728', 'TW009 - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('92f2567b-ae46-4bd7-8f64-22f0ba073f7d', '542e185f-06a1-4d47-83d6-58a32db00995', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/greenshort2pcs_4_1.jpg?v=1759167728', 'TW009 - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('fa2966de-d499-4342-8e79-1dce97d7969b', 'RUBY', 'olive-ruby', '<p>Elevate your summer wardrobe with the Olive Ruby 2-Piece Kurta Set by GulPash. 🌿<br>This elegant ensemble features a beautifully embroidered long kurta in a graceful mustard shade, paired with a comfortable straight trouser. To complete the look, a stunning digital printed dupatta adds charm and style, making it a perfect pick for both casual outings and daily wear.</p>
<p>👗 Outfit Type: Eastern Ready-to-Wear<br>🧵 Fabric: Cotton Shirt &amp; Trouser<br>🎨 Color: Mustard (Olive Ruby)<br>✨ Work: Embroidered<br>👚 Top Style: Long Kurta, Regular Fit<br>👖 Bottom Style: Straight Trouser<br>🔹 Pieces: 2 (Shirt + Trouser)<br>🌸 Season: Summer Wear<br>⚠️ Disclaimer: Actual product color may vary slightly from the image.</p>
<p>💛 Olive Ruby – timeless embroidery meets modern digital prints for effortless summer elegance.<br><img src="https://cdn.shopify.com/s/files/1/0950/1478/1245/files/42_size.jpg?v=1757954418" alt=""><br></p>', 'TAW-RUBY-S', '90151ef9-20ad-496b-8daf-eef1fb0a8aa9', 'Unstitched / Stitched', 3360, 6500, 'Premium Cotton Lawn / Raw Silk', '{}', '{"S","M","L","XL"}', true, false, false, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('fba6157a-d178-4d47-84e7-beb4ae63f452', 'fa2966de-d499-4342-8e79-1dce97d7969b', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/DSC00367-174540333032158_82a9eeff-92ed-4317-9935-d4ac05cea3a3.jpg?v=1778070815', 'RUBY - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('6da68b39-7a8c-4872-8c7b-85240387698c', 'fa2966de-d499-4342-8e79-1dce97d7969b', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/DSC00360-174540333031326_511d1b92-f9b6-4378-af73-16d73a5e55d3.jpg?v=1778070815', 'RUBY - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('08102645-f8aa-443e-8da8-a5ed51aecbf3', 'fa2966de-d499-4342-8e79-1dce97d7969b', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/DSC00365-174540333035446_3eaaa000-20e4-4b69-973c-65ea2229649d.jpg?v=1778070815', 'RUBY - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('6ab4e86d-f471-498f-88d7-c50968a00f10', 'fa2966de-d499-4342-8e79-1dce97d7969b', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/DSC00372-174540333049714_9d3d6ecf-6585-43db-af08-8a1e56953a35.jpg?v=1778070816', 'RUBY - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('d1791c46-820a-48f9-8659-0b2d8716d249', 'Black Iris', 'black-iris', '<p>Embrace sophistication this winter with the Black Iris 3-Piece Kurta Set by GulPash. ✨<br>Tailored from warm dhanak fabric, this embroidered straight-cut kurta comes with a comfortable straight trouser and a matching embroidered dupatta, creating the perfect blend of comfort and elegance. The attached lining ensures a polished finish, making it an ideal choice for daily winter wear with a graceful touch.</p>
<p>👗 Outfit Type: Eastern Ready-to-Wear<br>🧵 Fabric: Dhanak Shirt &amp; Trouser, Matching Embroidered Dupatta<br>🎨 Color: Black<br>✨ Work: Embroidered<br>👚 Top Style: Straight Cut Kurta, Regular Fit<br>👖 Bottom Style: Straight Trouser<br>🧕 Dupatta: Matching Embroidered Dupatta<br>🔹 Pieces: 3 (Shirt + Trouser + Dupatta)<br>❄️ Season: Winter Wear<br>⚠️ Disclaimer: Actual product color may vary slightly from the image.</p>
<p>🖤 Black Iris – a versatile 3-piece set that brings warmth, elegance, and timeless charm to your winter wardrobe.<br><br><img src="https://cdn.shopify.com/s/files/1/0950/1478/1245/files/42_size.jpg?v=1757954418" alt=""><br></p>', 'TAW-ZOEE-S-0', '90151ef9-20ad-496b-8daf-eef1fb0a8aa9', 'Unstitched / Stitched', 3150, 6000, 'Premium Cotton Lawn / Raw Silk', '{}', '{"S","M","L","XL"}', true, false, false, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('016ed484-5002-445c-8078-c6ee8ef0c66c', 'd1791c46-820a-48f9-8659-0b2d8716d249', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/BlackIris1.jpg?v=1759167722', 'Black Iris - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('328d8db8-e8f1-481d-8ebc-bab9d2146f85', 'd1791c46-820a-48f9-8659-0b2d8716d249', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/BlackIris3.jpg?v=1759167722', 'Black Iris - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('60fa3301-8e0f-4090-822e-4c1e4c12a3c6', 'd1791c46-820a-48f9-8659-0b2d8716d249', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/BlackIris4.jpg?v=1759167721', 'Black Iris - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('fd71fb67-d408-4d63-8d13-e3d195fa81a5', 'd1791c46-820a-48f9-8659-0b2d8716d249', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/BlackIris5.jpg?v=1759167722', 'Black Iris - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('4f52867e-d1fc-4be2-82f4-dc57eecbfdbb', 'd1791c46-820a-48f9-8659-0b2d8716d249', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/BlackIris2.jpg?v=1759167722', 'Black Iris - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('549e0e8e-6a35-42ae-8193-b476bcbe8091', 'd1791c46-820a-48f9-8659-0b2d8716d249', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/BlackIris6.jpg?v=1759167721', 'Black Iris - View 6', false, 6)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('62879eed-fa93-4778-8f33-382d34ff294a', 'd1791c46-820a-48f9-8659-0b2d8716d249', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/BlackIris7.jpg?v=1759167722', 'Black Iris - View 7', false, 7)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('d9708490-a31f-4983-8a8c-9a38c22178c5', 'Gajri', 'gajri', '<p>Step into elegance with the Gajr Pink Kurta Set by GulPash. 🌺<br>Made from soft cotton fabric, this straight kurta paired with straight trousers is delicately embroidered to bring charm and comfort together. The attached lining ensures a polished look, making it the perfect choice for daily summer wear.</p>
<p>👗 Outfit Type: Eastern Ready-to-Wear<br>🧵 Fabric: Cotton Shirt &amp; Trouser<br>🎨 Color: Pink<br>✨ Work: Embroidered<br>👚 Top Style: Straight Kurta, Regular Fit<br>👖 Bottom Style: Straight Trouser<br>🔹 Pieces Available:<br>🌸 Season: Summer Wear<br>⚠️ Disclaimer: Actual product color may vary slightly from the image.</p>
<p>💖 Garji brings you versatile elegance – available in both 2-piece and 3-<br> options to suit your style.<br><img alt="" src="https://cdn.shopify.com/s/files/1/0950/1478/1245/files/42_size.jpg?v=1757954418"><br></p>', 'TAW-GAJRI-S', '90151ef9-20ad-496b-8daf-eef1fb0a8aa9', 'Unstitched / Stitched', 2999, 6000, 'Premium Cotton Lawn / Raw Silk', '{}', '{"S","M","L","XL"}', true, false, false, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('edfdf4e9-a020-4db7-86fc-78960e865878', 'd9708490-a31f-4983-8a8c-9a38c22178c5', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Gajri1.jpg?v=1759167720', 'Gajri - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('467de75b-8f86-4200-8c84-8a3c8470f887', 'd9708490-a31f-4983-8a8c-9a38c22178c5', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Gajri2.jpg?v=1759167720', 'Gajri - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('db9fac23-8d9c-403d-8003-9297e5768684', 'd9708490-a31f-4983-8a8c-9a38c22178c5', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Gajri3.jpg?v=1759167720', 'Gajri - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('2643de65-03b5-4e29-8d42-5fea0c68d4f6', 'd9708490-a31f-4983-8a8c-9a38c22178c5', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Gajri4.jpg?v=1759167720', 'Gajri - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('463f5555-19f5-444e-811a-e31cf57296d0', 'd9708490-a31f-4983-8a8c-9a38c22178c5', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Gajri5.jpg?v=1759167720', 'Gajri - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('53565a87-b862-4bc6-8031-0f407e1466d7', 'd9708490-a31f-4983-8a8c-9a38c22178c5', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Gajri6.jpg?v=1759167721', 'Gajri - View 6', false, 6)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('a218628d-d292-435c-8974-2d5696808607', 'd9708490-a31f-4983-8a8c-9a38c22178c5', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Gajri7.jpg?v=1759167720', 'Gajri - View 7', false, 7)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('5965c526-f4a3-46dc-80cd-978b61108d91', 'd9708490-a31f-4983-8a8c-9a38c22178c5', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Gajri8.jpg?v=1759167720', 'Gajri - View 8', false, 8)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('ed894cc9-3129-4df2-817c-a1305094834a', 'Golden Grace', 'golden-grace', '<p data-start="119" data-end="165"><strong data-start="119" data-end="163">Mustard Long Length Embroidered Dress 💛</strong></p>
<p data-start="167" data-end="353">✨ <strong data-start="169" data-end="180">Fabric:</strong> Dhank<br data-start="186" data-end="189">✨ <strong data-start="191" data-end="218">3 Piece Suit with Shawl</strong><br data-start="218" data-end="221">✨ <strong data-start="223" data-end="252">Beautiful Embroidery Work</strong><br data-start="252" data-end="255">✨ <strong data-start="257" data-end="280" data-is-only-node="">Long Graceful Shirt</strong> with Standard-Fit Trousers<br data-start="307" data-end="310">✨ <strong data-start="312" data-end="351">Perfect Blend of Comfort &amp; Elegance</strong></p>
<p data-start="355" data-end="448">🌟 A timeless mustard outfit with elegant embroidery — made to make you stand out in style!</p>
<p data-start="450" data-end="514">📩 <strong data-start="453" data-end="473">DM to Order Now!</strong><br data-start="473" data-end="476">🚚 <strong data-start="479" data-end="512">Nationwide Delivery Available</strong></p>', 'TAW-GE3-S', '90151ef9-20ad-496b-8daf-eef1fb0a8aa9', 'Unstitched / Stitched', 5499, 7000, 'with Standard-Fit Trousers with matching fabric', '{}', '{"Standard Size"}', true, false, true, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('85cb67b7-8102-46b7-8742-44c9b61be23a', 'ed894cc9-3129-4df2-817c-a1305094834a', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/LNF-41-GOLDEN.1_700x_fd684c0a-a5a2-4a8c-a72a-85f0c7815dec.jpg?v=1759167718', 'Golden Grace - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('f69d9e9f-6427-42b8-830d-c767fbbaae82', 'ed894cc9-3129-4df2-817c-a1305094834a', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/LNF-41-GOLDEN.2_700x_3f0277e0-6551-4543-89dc-9054d4f9ad25.jpg?v=1759167718', 'Golden Grace - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('78538be0-67be-4038-8c4d-1f9f7e413aa9', 'ed894cc9-3129-4df2-817c-a1305094834a', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/LNF-41-GOLDEN.8_700x_808dbfb8-1d41-42e4-837a-d19ff5baed1f.jpg?v=1759167718', 'Golden Grace - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('34c1d3e4-9d2a-40a3-86d3-d421ae861144', 'ed894cc9-3129-4df2-817c-a1305094834a', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/LNF-41-GOLDEN.6_700x_16133b92-93f8-4aca-9c11-8234ab7bf906.jpg?v=1759167718', 'Golden Grace - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('d46ae71c-c87b-4988-857a-2424eef19cf3', 'ed894cc9-3129-4df2-817c-a1305094834a', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/LNF-41-GOLDEN.9_700x_cc69eb30-2310-452a-8e69-b5e61aac271f.jpg?v=1759167718', 'Golden Grace - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('c111fad9-cee1-4d3e-89a7-98f5bf0a0dbd', 'ed894cc9-3129-4df2-817c-a1305094834a', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/LNF-41-GOLDEN.5_700x_81b5c97b-ddd0-4083-9b19-7ae28d46fcc5.jpg?v=1759167718', 'Golden Grace - View 6', false, 6)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('c85777b2-0ab0-4416-8e9b-3b894d4578be', 'ed894cc9-3129-4df2-817c-a1305094834a', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/LNF-41-GOLDEN.3_700x-Copy.jpg?v=1759167718', 'Golden Grace - View 7', false, 7)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('653cf7a4-5b79-444e-8dfe-69d1280438b2', 'Zaitoon 3pcs', 'zaitoon-3pcs', '<p data-start="178" data-end="253">💛 <strong data-start="181" data-end="248">Zaitoon 3pcs – Mustard Long Length Embroidered Dress with Shawl</strong> 💛</p>
<p data-start="255" data-end="444">✨ Fabric: Premium Linen<br data-start="278" data-end="281">✨ Intricate Embroidery Work<br data-start="308" data-end="311">✨ Long graceful shirt with standard-fit trousers<br data-start="359" data-end="362">✨ Elegant Shawl included for a complete look<br data-start="406" data-end="409">✨ Comfort meets timeless elegance</p>
<p data-start="446" data-end="561">🌟 A chic mustard outfit with embroidery &amp; matching shawl – designed to make you stand out with effortless grace!</p>
<p data-start="563" data-end="618">📩 DM to order now<br data-start="581" data-end="584">🚚 Nationwide Delivery Available</p>
<p data-start="620" data-end="732">⚠️ <strong data-start="623" data-end="638">Disclaimer:</strong> Actual product color may vary slightly from the images due to lighting and screen settings.<br><img src="https://cdn.shopify.com/s/files/1/0950/1478/1245/files/size.jpg?v=1757952369" alt=""><br></p>', 'TAW-ZE3-S-1', '90151ef9-20ad-496b-8daf-eef1fb0a8aa9', 'Unstitched / Stitched', 5499, 7000, 'Premium Cotton Lawn / Raw Silk', '{}', '{"Standard Size"}', true, false, true, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('235b5df9-c6de-4da0-82e1-005c9ee00f4f', '653cf7a4-5b79-444e-8dfe-69d1280438b2', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/LNF-22-MEHNDI_1_700x_jpg.jpg?v=1759167710', 'Zaitoon 3pcs - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('8b31649b-1f19-4a67-8902-eb84545411e3', '653cf7a4-5b79-444e-8dfe-69d1280438b2', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/LNF-22-MEHNDI_2_600x_jpg.jpg?v=1759167710', 'Zaitoon 3pcs - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('149a2fda-4458-4491-8cc5-50e915cb5f1e', '653cf7a4-5b79-444e-8dfe-69d1280438b2', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/LNF-22-MEHNDI_3_700x_jpg.jpg?v=1759167710', 'Zaitoon 3pcs - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('8aac8900-ee59-4fd3-8f51-107868c444af', '653cf7a4-5b79-444e-8dfe-69d1280438b2', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/LNF-22-MEHNDI_4_600x_jpg.jpg?v=1759167710', 'Zaitoon 3pcs - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('91077801-0f66-40f0-837f-b60f1b26ee20', '653cf7a4-5b79-444e-8dfe-69d1280438b2', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/LNF-22-MEHNDI_5_700x_jpg.jpg?v=1759167710', 'Zaitoon 3pcs - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('59d309b6-4c77-4e24-815b-1810c3d846ef', '653cf7a4-5b79-444e-8dfe-69d1280438b2', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/LNF-22-MEHNDI_6_700x_jpg.jpg?v=1759167710', 'Zaitoon 3pcs - View 6', false, 6)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('fa9da4c1-f9d5-47b4-8bc8-4a6dc1aaf865', '653cf7a4-5b79-444e-8dfe-69d1280438b2', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/LNF-22-MEHNDI_7_700x_jpg.jpg?v=1759167711', 'Zaitoon 3pcs - View 7', false, 7)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('dc16935d-3ea7-4d32-8bfd-583991aa764c', '653cf7a4-5b79-444e-8dfe-69d1280438b2', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/LNF-22-MEHNDI_8_700x_jpg.jpg?v=1759167710', 'Zaitoon 3pcs - View 8', false, 8)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('9bde093d-a2c3-4a5f-8f1e-a57fb379761a', 'Multi Sabz 3Pcs EMB', 'multi-sabz-3pcs', '<p><span style="color: rgb(0, 0, 0);"><!-- TRUST BADGES (LARGE + PREMIUM) --></span></p>
<div style="display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin-bottom: 14px; font-size: 14px;">
<div style="border: 1px solid #eee; padding: 10px; text-align: center; font-weight: 600; border-radius: 6px; background: #fafafa;">
<span style="color: rgb(0, 0, 0);">🚚 Free Delivery</span><br><span style="font-weight: 400; font-size: 12px; color: rgb(0, 0, 0);">All Over Pakistan</span>
</div>
<div style="border: 1px solid #eee; padding: 10px; text-align: center; font-weight: 600; border-radius: 6px; background: #fafafa;">
<span style="color: rgb(0, 0, 0);">💰 Cash on Delivery</span><br><span style="font-weight: 400; font-size: 12px; color: rgb(0, 0, 0);">Pay After Delivery</span>
</div>
<div style="border: 1px solid #eee; padding: 10px; text-align: center; font-weight: 600; border-radius: 6px; background: #fafafa;">
<span style="color: rgb(0, 0, 0);">🔁 Easy Exchange</span><br><span style="font-weight: 400; font-size: 12px; color: rgb(0, 0, 0);">7 Days Policy</span>
</div>
<div style="border: 1px solid #eee; padding: 10px; text-align: center; font-weight: 600; border-radius: 6px; background: #fafafa;">
<span style="color: rgb(0, 0, 0);">🔐 Secure Checkout</span><br><span style="font-weight: 400; font-size: 12px; color: rgb(0, 0, 0);">Safe Payment</span>
</div>
</div>
<p><span style="color: rgb(0, 0, 0);"><!-- PRODUCT DESCRIPTION --></span></p>
<h2 style="font-weight: 600; margin-bottom: 6px;"><span style="color: rgb(0, 0, 0);">Multi Sabz — Mongia Green Linen 3Pcs</span></h2>
<p style="font-size: 13px; color: #c59d5f; margin-bottom: 8px;"><strong><span style="color: rgb(237, 18, 18);">🌿 Fresh Summer Pick • Premium Collection</span></strong></p>
<p style="font-size: 13px; color: #888; margin-bottom: 8px;"><strong><span style="color: rgb(0, 0, 0);">Premium Linen Embroidered Shirt &amp; Trouser • Shawl Included</span></strong></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Product Highlights</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Premium linen embroidered shirt</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fresh Mongia green tone for a vibrant look</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Long graceful shirt with elegant fall</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Standard-fit trouser for balanced styling</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Elegant shawl for a complete outfit</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">3-piece ready-to-wear ensemble</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Fabric &amp; Feel</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Crafted from breathable premium linen, offering comfort with structure — perfect for warm weather while maintaining a polished finish.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Occasion</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Ideal for summer outings, casual gatherings, and semi-formal wear — designed to give you a fresh and elegant appearance.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Product Details</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fabric: Premium Linen</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Work: Embroidered</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Pieces: 3 (Shirt + Trouser + Shawl)</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Color: Mongia Green</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Style: Long-length graceful shirt</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Delivery &amp; Payment</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Cash on Delivery available nationwide</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fast shipping across Pakistan</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Carefully packed for quality assurance</span></li>
</ul>
<p style="font-size: 13px; color: #555; margin-top: 5px;"><span style="color: rgb(0, 0, 0);">Limited pieces available.</span></p>', 'TAW-3G-S-0', '90151ef9-20ad-496b-8daf-eef1fb0a8aa9', 'Unstitched / Stitched', 5999, 8650, 'Premium Cotton Lawn / Raw Silk', '{}', '{"S","M","L","XL"}', true, true, true, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('43710845-46bb-454d-8202-2b47fa1bf781', '9bde093d-a2c3-4a5f-8f1e-a57fb379761a', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/get.jpg?v=1759167706', 'Multi Sabz 3Pcs EMB - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('5fb66332-cf35-4203-866e-8c1f3985f080', '9bde093d-a2c3-4a5f-8f1e-a57fb379761a', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/get_1.jpg?v=1759167706', 'Multi Sabz 3Pcs EMB - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('dafa6e2c-036a-486a-8f26-9c8ddf3cb74f', '9bde093d-a2c3-4a5f-8f1e-a57fb379761a', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/get_2.jpg?v=1759167706', 'Multi Sabz 3Pcs EMB - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('ca2f6f21-39f2-4d33-86d9-2faccc1bf493', '9bde093d-a2c3-4a5f-8f1e-a57fb379761a', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/get_3.jpg?v=1759167706', 'Multi Sabz 3Pcs EMB - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('9788fcb0-862f-4956-8316-6c16854e2ec7', 'Multi Black 2pcs EMB', 'multi-black-2pcs', '<p><span style="color: rgb(0, 0, 0);"><!-- TRUST BADGES (LARGE + PREMIUM) --></span></p>
<div style="display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin-bottom: 14px; font-size: 14px;"></div>
<h2 style="font-weight: 600; margin-bottom: 6px;"><span style="color: rgb(0, 0, 0);">Multi Black — Embroidered Cotton 2Pcs</span></h2>
<p style="font-size: 13px; color: #c59d5f; margin-bottom: 8px;"><strong><span style="color: rgb(239, 21, 21);">🖤 Everyday Elegant • Bestseller</span></strong></p>
<p style="font-size: 13px; color: #888; margin-bottom: 8px;"><strong><span style="color: rgb(0, 0, 0);">Premium Cotton Embroidered Shirt &amp; Trouser</span></strong></p>
<p style="font-size: 14px; line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">A chic black 2-piece ensemble designed for effortless everyday elegance. Multi Black features intricate embroidery on premium cotton, paired with a long graceful shirt and standard-fit trousers for a clean and polished look.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Product Highlights</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Premium cotton embroidered shirt</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Classic black tone for a sleek, timeless look</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Long graceful shirt with elegant fall</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Standard-fit trouser for balanced styling</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">2-piece ready-to-wear outfit</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Fabric &amp; Feel</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Crafted from breathable premium cotton, offering lightweight comfort and a smooth feel — ideal for daily wear with a refined finish.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Occasion</span></h3>
<p style="line-height: 1.5; margin-bottom: 10px;"><span style="color: rgb(0, 0, 0);">Perfect for daily wear, office use, and casual outings — designed to give you a neat and elegant appearance.</span></p>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Product Details</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fabric: Premium Cotton</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Work: Embroidered</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Pieces: 2 (Shirt + Trouser)</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Color: Black</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Style: Long-length graceful shirt</span></li>
</ul>
<h3 style="font-weight: 600; margin-bottom: 5px;"><span style="color: rgb(0, 0, 0);">Delivery &amp; Payment</span></h3>
<ul style="line-height: 1.6; margin-bottom: 10px; padding-left: 18px;">
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Cash on Delivery available nationwide</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Fast shipping across Pakistan</span></li>
<li style="color: rgb(0, 0, 0);"><span style="color: rgb(0, 0, 0);">Carefully packed for quality assurance</span></li>
</ul>
<p style="font-size: 13px; color: #555; margin-top: 5px;"><span style="color: rgb(0, 0, 0);">Limited pieces available .</span></p>', 'TAW-MB2-S-177089380415670', '90151ef9-20ad-496b-8daf-eef1fb0a8aa9', 'Unstitched / Stitched', 4999, 6350, 'Premium Cotton Lawn / Raw Silk', '{"Black 2pcs Outfit","black dress set","black embroidered shirt and trousers","casual outfit","cotton outfit","Cotton Shirt and Trouser","cotton shirt and trousers","Elegant Daily Wear","embroidered cotton 2pcs","Embroidered Cotton Set","everyday elegant clothing","Multi Black Embroidered Cotton","Multi Black Embroidered Cotton 2 piece","Premium Cotton Clothing","premium cotton outfit","stylish black 2-piece set"}', '{"S","M","L","XL"}', true, true, false, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('6ab121e9-9442-4e94-8827-899d4186fa1f', '9788fcb0-862f-4956-8316-6c16854e2ec7', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/6.jpg?v=1784994988', 'Multi Black 2pcs EMB - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('b8cd2c67-e7ca-4df0-8624-dd8a1069e889', '9788fcb0-862f-4956-8316-6c16854e2ec7', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/2.jpg?v=1784994988', 'Multi Black 2pcs EMB - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('274b82e1-d64d-42ea-80b1-5b05774da74f', '9788fcb0-862f-4956-8316-6c16854e2ec7', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/1.jpg?v=1784994988', 'Multi Black 2pcs EMB - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('67ae6d46-c6cd-4235-8638-2b21ad31d9ca', '9788fcb0-862f-4956-8316-6c16854e2ec7', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/3.jpg?v=1784994988', 'Multi Black 2pcs EMB - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('656aa58a-02b5-4a10-8f29-c6eb2f314cd1', '9788fcb0-862f-4956-8316-6c16854e2ec7', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/4.jpg?v=1784994988', 'Multi Black 2pcs EMB - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('8072ed4d-755d-445e-8609-bcd2939617a1', '9788fcb0-862f-4956-8316-6c16854e2ec7', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/5.jpg?v=1784994989', 'Multi Black 2pcs EMB - View 6', false, 6)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('312d0201-336a-4a49-8aac-d987d7488809', '9788fcb0-862f-4956-8316-6c16854e2ec7', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/1597106db32a3cc20d26d9909c86819f.jpg?v=1784994988', 'Multi Black 2pcs EMB - View 7', false, 7)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('a7477c39-fbd8-4502-801e-8d8f654c179e', 'Kaavya Emb 3pcs', 'kaavya-emb-3pcs', '<p><span style="color: rgb(0, 0, 0);"><!-- TRUST BADGES (LARGE + PREMIUM) --></span></p>
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
<p style="font-size: 13px; color: #555; margin-top: 5px;"><span style="color: rgb(0, 0, 0);">Limited pieces available — restocks are not guaranteed.</span></p>', 'TAW-KE3-S', '90151ef9-20ad-496b-8daf-eef1fb0a8aa9', 'Unstitched / Stitched', 5999, 7399, 'Premium Cotton Lawn / Raw Silk', '{}', '{"S","M","L","XL"}', true, true, true, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('23777810-cb52-4733-804c-4f1b4a471804', 'a7477c39-fbd8-4502-801e-8d8f654c179e', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Vintage21stJuly-369_jpg_jpg.jpg?v=1759167700', 'Kaavya Emb 3pcs - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('39816977-83c2-48b5-8b02-6259d73e9f8e', 'a7477c39-fbd8-4502-801e-8d8f654c179e', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Vintage21stJuly-396_jpg_jpg.jpg?v=1759167700', 'Kaavya Emb 3pcs - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('99b7a3b2-9936-430c-86d2-69acb13834b8', 'a7477c39-fbd8-4502-801e-8d8f654c179e', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Vintage21stJuly-447_jpg_jpg.jpg?v=1759167700', 'Kaavya Emb 3pcs - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('f66b3052-9d33-407e-8a1a-12b3547791df', 'a7477c39-fbd8-4502-801e-8d8f654c179e', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Vintage21stJuly-389_jpg_jpg.jpg?v=1759167700', 'Kaavya Emb 3pcs - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('105473aa-b807-451d-8eae-d3229446f45a', 'a7477c39-fbd8-4502-801e-8d8f654c179e', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Vintage21stJuly-392_jpg_jpg.jpg?v=1759167700', 'Kaavya Emb 3pcs - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('cccfc659-1e4d-44a8-8b30-1aa6a6be3b67', 'a7477c39-fbd8-4502-801e-8d8f654c179e', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Vintage21stJuly-388_jpg_jpg.jpg?v=1759167700', 'Kaavya Emb 3pcs - View 6', false, 6)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('9df0ed62-9554-47fe-88c1-37b0ca673071', 'a7477c39-fbd8-4502-801e-8d8f654c179e', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Vintage21stJuly-444_jpg_jpg.jpg?v=1759167700', 'Kaavya Emb 3pcs - View 7', false, 7)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('220c2c68-0fb5-4273-814d-17bf1d635f97', 'Musturd Embroidery 2pcs', 'musturd-embroidery-3pcs', '<p data-start="92" data-end="157"><strong data-start="92" data-end="155">Musturd Embroidery 2pcs Suit – Mustard 💛 | Anabya Garments</strong></p>
<p data-start="159" data-end="347">✨ Fabric: Premium Linen<br data-start="182" data-end="185">✨ Intricate Embroidery Work<br data-start="212" data-end="215">✨ Long graceful shirt<br data-start="236" data-end="239">✨ Standard-fit trousers<br data-start="262" data-end="265">✨ Elegant Shawl included for a complete look<br data-start="309" data-end="312">✨ Comfort meets timeless elegance</p>
<p data-start="349" data-end="468">🌟 A chic <strong data-start="359" data-end="370">Mustard</strong> outfit with embroidery &amp; matching shawl – designed to make you stand out with effortless grace!</p>
<p data-start="470" data-end="548">📩 DM to order now<br data-start="488" data-end="491">🛍️ Order on Website<br data-start="511" data-end="514">🚚 Nationwide Delivery Available</p>
<p data-start="550" data-end="658">⚠️ Disclaimer: Actual product color may vary slightly from the images due to lighting and screen settings.</p>
<hr data-start="660" data-end="665">
<p data-start="666" data-end="849"><strong data-start="666" data-end="847">#AnabyaGarments #MusturdEmbroidery #3PieceSuit #LinenOutfit #Mustard #EmbroideredCollection #LuxuryPret #PakistaniFashion #ShawlSuit #ElegantStyle #NewArrivals #TimelessElegance</strong></p>
<p data-start="94" data-end="149"><img src="https://cdn.shopify.com/s/files/1/0950/1478/1245/files/size.jpg?v=1757952369" alt="" style="font-size: 0.875rem;"></p>', 'TAW-MA2-S', '90151ef9-20ad-496b-8daf-eef1fb0a8aa9', 'Unstitched / Stitched', 4320, 6450, 'Premium Cotton Lawn / Raw Silk', '{}', '{"Standard Size"}', true, true, true, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('69b4da19-40c5-4bf0-8f75-e0947e517e0e', '220c2c68-0fb5-4273-814d-17bf1d635f97', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Mirana18JULY-636_720x_9a40962a-ef57-4ecd-aa9c-99dc08de713c_webp_jpg.jpg?v=1759167698', 'Musturd Embroidery 2pcs - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('7166dcf0-87d4-4892-828e-4ccdf604780f', '220c2c68-0fb5-4273-814d-17bf1d635f97', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Mirana18JULY-651_720x_812af903-e01e-455b-b446-5ad106e28321_webp_jpg.jpg?v=1759167698', 'Musturd Embroidery 2pcs - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('4cc725ab-9991-4d1f-8a98-927994482c1a', '220c2c68-0fb5-4273-814d-17bf1d635f97', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Mirana18JULY-662_720x_c1702adb-e327-4a08-9c0a-5078cc23401b_webp_jpg.jpg?v=1759167698', 'Musturd Embroidery 2pcs - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('fc5400d7-2a00-43be-8371-7f9ac0c0b5f6', '220c2c68-0fb5-4273-814d-17bf1d635f97', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Mirana18JULY-675_720x_c7ebfe90-175e-46c6-be35-02f7ded9a046_webp_jpg.jpg?v=1759167698', 'Musturd Embroidery 2pcs - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('f30075a9-5339-4571-80c5-8795038312f2', '220c2c68-0fb5-4273-814d-17bf1d635f97', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Mirana18JULY-688_720x_6ab84c18-87b0-4d6c-9759-479e6cefa5b2_webp_jpg.jpg?v=1759167698', 'Musturd Embroidery 2pcs - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('6506d0c3-46ad-450e-85b4-f0c74df68c44', '220c2c68-0fb5-4273-814d-17bf1d635f97', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Mirana18JULY-704_720x_b2a2267e-3cf3-40d2-885a-89dfcf05eda9_webp_jpg.jpg?v=1759167698', 'Musturd Embroidery 2pcs - View 6', false, 6)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('91775970-c0bf-4740-820b-06fd07779c2f', '220c2c68-0fb5-4273-814d-17bf1d635f97', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Mirana18JULY-710_720x_30f488d7-1daa-4636-a476-b97e5d1979db_webp_jpg.jpg?v=1759167698', 'Musturd Embroidery 2pcs - View 7', false, 7)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('0e59b27d-19b9-4137-809e-93b9ca78a343', '220c2c68-0fb5-4273-814d-17bf1d635f97', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Mirana18JULY-766_720x_4034f01c-7a19-4361-9f92-3d97a395eb6b_webp_jpg.jpg?v=1759167698', 'Musturd Embroidery 2pcs - View 8', false, 8)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('fa17e1b8-89a6-4e2c-84f7-932253a1a588', 'Elsa Embroidery 3pcs', 'elsa-embroidery-3pcs', '<p data-start="81" data-end="125"><strong data-start="81" data-end="125">Elsa 3pcs Suit – Zinc ✨ | GulPash</strong></p>
<p data-start="127" data-end="442">✨ <strong data-start="129" data-end="140">Fabric:</strong> Premium SUMMER LINNEN<br data-start="154" data-end="157">✨ <strong data-start="159" data-end="188">Intricate Embroidery Work</strong><br data-start="188" data-end="191">✨ <strong data-start="193" data-end="240">Long, graceful shirt with elegant detailing</strong><br data-start="240" data-end="243">✨ <strong data-start="245" data-end="298">Standard-fit trousers for a sleek and modest look</strong><br data-start="298" data-end="301">✨ <strong data-start="303" data-end="327" data-is-only-node="">Soft Chiffon Dupatta</strong> completing the outfit with a refined touch<br data-start="370" data-end="373">✨ <strong data-start="375" data-end="442">Perfect blend of comfort, elegance, and timeless sophistication</strong></p>
<p data-start="444" data-end="635">🌟 A stunning <em data-start="458" data-end="472">Zinc-colored</em> embroidered 3-piece suit crafted in premium Dhank fabric, paired with a beautifully draped chiffon dupatta — designed to make you stand out with effortless charm.</p>
<p data-start="637" data-end="725">📩 <strong data-start="640" data-end="659">DM to Order Now</strong><br data-start="659" data-end="662">🛍️ <strong data-start="666" data-end="686">Order on Website</strong><br data-start="686" data-end="689">🚚 <strong data-start="692" data-end="725">Nationwide Delivery Available</strong></p>
<p data-start="727" data-end="819">⚠️ <em data-start="730" data-end="743">Disclaimer:</em> Actual product color may vary slightly due to lighting and screen settings.</p>
<p data-start="821" data-end="909">#GulPash #DhankFabric #3PcsSuit #ChiffonDupatta #ElegantWear #NewArrival #ZincSuit</p>', 'TAW-EE3-S', '90151ef9-20ad-496b-8daf-eef1fb0a8aa9', 'Unstitched / Stitched', 5999, 7399, 'Premium Cotton Lawn / Raw Silk', '{}', '{"Standard Size"}', true, true, true, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('ae5b3767-be6a-457b-8df9-6beb4ba2dd8b', 'fa17e1b8-89a6-4e2c-84f7-932253a1a588', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Mirana18JULY-1255_720x_cec48211-056f-4a61-b34a-4874d065cae3_webp_jpg.jpg?v=1759167697', 'Elsa Embroidery 3pcs - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('2bc0b3cc-1354-40fe-8f1b-1d3dbce4fbf6', 'fa17e1b8-89a6-4e2c-84f7-932253a1a588', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Mirana18JULY-1258_720x_a80bb7be-8363-483d-ae6b-ae0130b95958_webp.jpg_1.jpg?v=1759167696', 'Elsa Embroidery 3pcs - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('f9978032-1da6-45e6-83ac-65d11116d04a', 'fa17e1b8-89a6-4e2c-84f7-932253a1a588', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Mirana18JULY-1321_720x_3ad5346e-e3e6-4f25-859b-d21c3b016a59_webp_jpg.jpg?v=1759167697', 'Elsa Embroidery 3pcs - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('8fded02f-9acd-4ee2-816f-fda2fd7429ea', 'fa17e1b8-89a6-4e2c-84f7-932253a1a588', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Mirana18JULY-1273_720x_124dc8e0-c8ec-49d1-9405-ca049b23676d_webp_jpg.jpg?v=1759167697', 'Elsa Embroidery 3pcs - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('5e41807c-9bd7-4776-86bd-211eb4ff8ed4', 'fa17e1b8-89a6-4e2c-84f7-932253a1a588', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Mirana18JULY-1286_720x_882d3517-6c1d-45db-ac8f-2b167cddecd8_webp_jpg.jpg?v=1759167697', 'Elsa Embroidery 3pcs - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('c5340104-09dc-49b3-84fb-66a7aa33a824', 'fa17e1b8-89a6-4e2c-84f7-932253a1a588', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Mirana18JULY-1478_720x_23210ce7-8f60-4eb4-9b7f-265c9988f17d_webp_jpg.jpg?v=1759167697', 'Elsa Embroidery 3pcs - View 6', false, 6)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('3c63c8f8-08c8-4089-86b5-eaa4285074c7', 'fa17e1b8-89a6-4e2c-84f7-932253a1a588', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/Mirana18JULY-1414_720x_c6c21177-8ffe-404d-84a4-569e03e07ba2_webp_jpg.jpg?v=1759167697', 'Elsa Embroidery 3pcs - View 7', false, 7)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('1d94525e-6e71-43bf-842a-e7d28946c08e', 'Laal Ishq', 'laal-ishq', '<h3 data-start="123" data-end="173"><strong data-start="127" data-end="171">– Premium Silk Lawn Co-ord Set</strong></h3>
<p data-start="175" data-end="457">Discover the timeless charm of <strong data-start="206" data-end="219">Laal Ishq</strong>, a radiant <strong data-start="231" data-end="262">2-piece stitched co-ord set</strong> crafted from <strong data-start="276" data-end="304">premium silk lawn fabric</strong>. Designed as a <strong data-start="320" data-end="342">four-season outfit</strong>, this versatile attire keeps you cozy during mild winters while remaining breathable and comfortable year-round.</p>
<h4 data-start="459" data-end="484"><strong data-start="464" data-end="482">Fabric Details</strong></h4>
<p data-start="485" data-end="662">🌸 <strong data-start="488" data-end="501">Material:</strong> Silk Lawn (silk-blended for softness &amp; durability)<br data-start="552" data-end="555">🌸 <strong data-start="558" data-end="569">Season:</strong> Ideal for winter, spring, and beyond<br data-start="606" data-end="609">🌸 <strong data-start="612" data-end="621">Feel:</strong> Lightweight, breathable &amp; long-lasting</p>
<h4 data-start="664" data-end="706"><strong data-start="669" data-end="704">This 2PC Stitched Set Includes:</strong></h4>
<p data-start="707" data-end="768">✔ Sublimation Printed Shirt<br data-start="734" data-end="737">✔ Sublimation Printed Trouser</p>
<h4 data-start="770" data-end="799"><strong data-start="775" data-end="797">Why You’ll Love It</strong></h4>
<ul data-start="800" data-end="1067">
<li data-start="800" data-end="853">
<p data-start="802" data-end="853">Elegant digital sublimation print with rich tones</p>
</li>
<li data-start="854" data-end="918">
<p data-start="856" data-end="918"><strong data-start="856" data-end="897">Pakistani winter collection essential</strong> – cozy yet stylish</p>
</li>
<li data-start="919" data-end="985">
<p data-start="921" data-end="985">Perfect for <strong data-start="933" data-end="983">casual wear, gatherings, and everyday elegance</strong></p>
</li>
<li data-start="986" data-end="1067">
<p data-start="988" data-end="1067">Premium <strong data-start="996" data-end="1024">ready-to-wear co-ord set</strong> that blends tradition with modern design</p>
</li>
</ul>
<p data-start="1069" data-end="1224">✨ Make a bold yet graceful statement this season with <em data-start="1123" data-end="1134">Laal Ishq</em>. A true wardrobe essential from our <strong data-start="1171" data-end="1221">Best Sellers, Winter Collection &amp; New Arrivals</strong>.</p>
<p data-start="1226" data-end="1312">📌 <strong data-start="1229" data-end="1238">Note:</strong> Actual product color may vary slightly due to lighting and photography.</p>
<p data-start="94" data-end="149"><img src="https://cdn.shopify.com/s/files/1/0950/1478/1245/files/size.jpg?v=1757952369" alt="" style="font-size: 0.875rem;"></p>', 'TAW-LI-M-0', '90151ef9-20ad-496b-8daf-eef1fb0a8aa9', 'Unstitched / Stitched', 2850, 7000, 'Premium Cotton Lawn / Raw Silk', '{}', '{"Standard Size"}', true, false, false, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('01eaa378-f908-441a-8ab1-fd0935a4ce21', '1d94525e-6e71-43bf-842a-e7d28946c08e', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/W.SS25.516.T-1.jpg?v=1759167695', 'Laal Ishq - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('efd50ba2-7f48-48af-8661-b52ff7afd8c8', '1d94525e-6e71-43bf-842a-e7d28946c08e', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/W.SS25.516.T-4_1445x_29f8c5e2-5b55-403a-b566-9a300c13a609.jpg?v=1759167695', 'Laal Ishq - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('b38beb77-5b04-43e7-8369-bae02b07477c', '1d94525e-6e71-43bf-842a-e7d28946c08e', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/W.SS25.516.T-2_1946x_6075add6-b977-4a3d-a2de-c0daaa0f87ca.jpg?v=1759167695', 'Laal Ishq - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (id, title, slug, description, sku, category_id, category_name, price, compare_at_price, fabric, tags, sizes, is_visible, is_best_seller, is_new_arrival, is_sold_out, stock)
VALUES ('223fbb5e-f1b0-47a5-848d-db9fe9a45e4d', 'Stitched Peach Wool Emb 3pc', 'stitched-peach-wool-emb-3pc', '<p data-start="71" data-end="250"><strong data-start="75" data-end="110">Winter Elegance in Every Stitch</strong><span> </span>✨❄️<br data-start="114" data-end="117">Stay cozy yet stylish with our<span> </span><strong data-start="148" data-end="183">Stitched Winter Embroidered 3pc</strong><span> </span>set – crafted to keep you warm without compromising on grace. 💕</p>
<p data-start="252" data-end="394">👗<span> </span><strong data-start="255" data-end="266">Fabric:</strong><span> </span>Premium Winter Stuff<br data-start="287" data-end="290">🪡<span> </span><strong data-start="293" data-end="304">Design:</strong><span> </span>Embroidered Shirt | Trouser | Shawl<br data-start="340" data-end="343">📏<span> </span><strong data-start="346" data-end="356">Sizes:</strong><span> </span>Small – XL<br data-start="367" data-end="370">💸<span> </span><strong data-start="373" data-end="383" data-is-only-node="">Price:</strong><span> </span>Rs. 5600</p>
<p data-start="396" data-end="438">🔥 A must-have for your winter wardrobe!</p>
<p data-start="440" data-end="506">📩 DM now to place your order<br data-start="469" data-end="472">🚚 Nationwide Delivery Available</p>
<p data-start="508" data-end="601">⚠️<span> </span><em data-start="511" data-end="599">Disclaimer: Actual product color may slightly vary due to lighting &amp; screen resolution</em></p>', 'TAW-A3-S-4', '90151ef9-20ad-496b-8daf-eef1fb0a8aa9', 'Unstitched / Stitched', 5999, 7450, 'Premium Cotton Lawn / Raw Silk', '{}', '{"S","M","L","X-Large"}', true, true, true, false, 100)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('3dda4f58-c5d2-4f92-8073-b8b264387bf1', '223fbb5e-f1b0-47a5-848d-db9fe9a45e4d', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/neww2.webp?v=1759167695', 'Stitched Peach Wool Emb 3pc - View 1', true, 1)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('11ba9801-4b0b-44fc-8852-27361a9ccb08', '223fbb5e-f1b0-47a5-848d-db9fe9a45e4d', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/neww5.webp?v=1759167695', 'Stitched Peach Wool Emb 3pc - View 2', false, 2)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('5114b1df-7a2a-4c77-8685-44d24af6cf92', '223fbb5e-f1b0-47a5-848d-db9fe9a45e4d', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/neww4.webp?v=1759167695', 'Stitched Peach Wool Emb 3pc - View 3', false, 3)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('14272858-b317-447a-8699-6e4fd6fd6b29', '223fbb5e-f1b0-47a5-848d-db9fe9a45e4d', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/neww1.webp?v=1759167695', 'Stitched Peach Wool Emb 3pc - View 4', false, 4)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('6ae28dd8-9e4a-4f17-8604-e6e4595d5d2c', '223fbb5e-f1b0-47a5-848d-db9fe9a45e4d', 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/neww3.webp?v=1759167695', 'Stitched Peach Wool Emb 3pc - View 5', false, 5)
ON CONFLICT (id) DO NOTHING;
