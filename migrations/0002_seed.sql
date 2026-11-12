-- Seed: the five client categories (existing assignments preserved) and default settings. The administrator is provisioned by the Worker from a secret, never from this file.
INSERT INTO categories (id, slug, name, description, image, sort, status) VALUES ('weight-wellness','weight-wellness','Weight & Wellness','','/images/collection-weight-wellness.webp',1,'published');
INSERT INTO categories (id, slug, name, description, image, sort, status) VALUES ('next-generation-wellness','next-generation-wellness','Next-Generation Wellness','','/images/collection-next-generation-wellness.webp',2,'published');
INSERT INTO categories (id, slug, name, description, image, sort, status) VALUES ('skin-beauty','skin-beauty','Skin & Beauty','','/images/collection-skin-beauty.webp',3,'published');
INSERT INTO categories (id, slug, name, description, image, sort, status) VALUES ('vitality-cellular-health','vitality-cellular-health','Vitality & Cellular Health','','/images/collection-vitality-cellular-health.webp',4,'published');
INSERT INTO categories (id, slug, name, description, image, sort, status) VALUES ('energy-cellular-wellness','energy-cellular-wellness','Energy & Cellular Wellness','','/images/collection-energy-cellular-wellness.webp',5,'published');
INSERT INTO site_settings (key, value) VALUES ('search_visibility','hidden'),('catalog_live','0'),('delivery_fee','');
