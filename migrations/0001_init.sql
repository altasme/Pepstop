-- The Pep Stop admin panel schema (admin spec section 14). Version-controlled migration.
CREATE TABLE admins (
  id TEXT PRIMARY KEY, username TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL,
  must_change INTEGER NOT NULL DEFAULT 1, role TEXT NOT NULL DEFAULT 'super_admin',
  failed_count INTEGER NOT NULL DEFAULT 0, locked_until TEXT, last_login_at TEXT, created_at TEXT NOT NULL
);
CREATE TABLE admin_sessions (
  id TEXT PRIMARY KEY, admin_id TEXT NOT NULL REFERENCES admins(id), created_at TEXT NOT NULL,
  last_seen TEXT NOT NULL, expires_at TEXT NOT NULL
);
CREATE TABLE admin_activity_logs (
  id TEXT PRIMARY KEY, at TEXT NOT NULL, admin_id TEXT, username TEXT, action TEXT NOT NULL,
  entity TEXT, entity_id TEXT, detail TEXT, ip TEXT
);
CREATE INDEX idx_logs_at ON admin_activity_logs(at);
CREATE TABLE rate_limits (bucket TEXT PRIMARY KEY, count INTEGER NOT NULL, window_start TEXT NOT NULL);

CREATE TABLE categories (
  id TEXT PRIMARY KEY, slug TEXT UNIQUE NOT NULL, name TEXT NOT NULL, description TEXT NOT NULL DEFAULT '',
  image TEXT, sort INTEGER NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'published'
);
CREATE TABLE products (
  id TEXT PRIMARY KEY, slug TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
  short_description TEXT NOT NULL DEFAULT '', full_description TEXT NOT NULL DEFAULT '',
  category_id TEXT REFERENCES categories(id), main_image TEXT, sort INTEGER NOT NULL DEFAULT 0,
  overview TEXT NOT NULL DEFAULT '', specifications TEXT NOT NULL DEFAULT '', composition TEXT NOT NULL DEFAULT '',
  packaging TEXT NOT NULL DEFAULT '', storage TEXT NOT NULL DEFAULT '', notes TEXT NOT NULL DEFAULT '',
  reg_type TEXT, reg_number TEXT, reg_holder TEXT,
  base_price INTEGER, availability TEXT NOT NULL DEFAULT 'ask', show_price INTEGER NOT NULL DEFAULT 0,
  inquire_price INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE INDEX idx_products_status ON products(status);
CREATE TABLE product_variants (
  id TEXT PRIMARY KEY, product_id TEXT NOT NULL REFERENCES products(id), name TEXT NOT NULL,
  strength TEXT NOT NULL DEFAULT '', price INTEGER, availability TEXT NOT NULL DEFAULT 'available',
  image TEXT, sort INTEGER NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'published'
);
CREATE TABLE product_images (
  id TEXT PRIMARY KEY, product_id TEXT NOT NULL REFERENCES products(id), image TEXT NOT NULL, sort INTEGER NOT NULL DEFAULT 0
);
-- Covers product_information and product_guidelines (section = 'guidelines', with a review status).
CREATE TABLE product_information (
  id TEXT PRIMARY KEY, product_id TEXT NOT NULL REFERENCES products(id), section TEXT NOT NULL,
  body_html TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  review_status TEXT NOT NULL DEFAULT 'not_reviewed', updated_at TEXT NOT NULL
);
CREATE TABLE coa_documents (
  id TEXT PRIMARY KEY, product_id TEXT NOT NULL REFERENCES products(id), batch TEXT NOT NULL, title TEXT NOT NULL,
  file_key TEXT NOT NULL, file_name TEXT NOT NULL DEFAULT '', size INTEGER NOT NULL DEFAULT 0, doc_date TEXT, notes TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  uploaded_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE TABLE orders (
  id TEXT PRIMARY KEY, ref TEXT UNIQUE NOT NULL, full_name TEXT NOT NULL, mobile TEXT NOT NULL, email TEXT,
  street TEXT, barangay TEXT, city TEXT, province TEXT, postal TEXT, customer_notes TEXT NOT NULL DEFAULT '',
  payment_method TEXT NOT NULL, payment_status TEXT NOT NULL DEFAULT 'pending',
  order_status TEXT NOT NULL DEFAULT 'new_order',
  subtotal INTEGER NOT NULL DEFAULT 0, delivery_fee INTEGER, total INTEGER NOT NULL DEFAULT 0, has_unpriced INTEGER NOT NULL DEFAULT 0,
  internal_notes TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE TABLE order_items (
  id TEXT PRIMARY KEY, order_id TEXT NOT NULL REFERENCES orders(id), product_id TEXT, variant_id TEXT,
  product_name TEXT NOT NULL, variant_name TEXT NOT NULL, qty INTEGER NOT NULL, unit_price INTEGER, line_total INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE payments (
  id TEXT PRIMARY KEY, order_id TEXT NOT NULL REFERENCES orders(id), reference TEXT NOT NULL DEFAULT '', proof_key TEXT,
  status TEXT NOT NULL DEFAULT 'submitted', notes TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL, verified_at TEXT
);
CREATE TABLE order_history (
  id TEXT PRIMARY KEY, order_id TEXT NOT NULL REFERENCES orders(id), at TEXT NOT NULL, status TEXT NOT NULL, note TEXT NOT NULL DEFAULT '', by_user TEXT
);
CREATE TABLE customer_inquiries (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, phone TEXT, email TEXT, subject TEXT NOT NULL DEFAULT '', message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new', notes TEXT NOT NULL DEFAULT '', archived INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL
);
-- website_pages and website_sections are unified as keyed JSON documents with draft and published copies.
CREATE TABLE site_content (key TEXT PRIMARY KEY, draft TEXT, published TEXT, updated_at TEXT NOT NULL);
CREATE TABLE articles (
  id TEXT PRIMARY KEY, slug TEXT UNIQUE NOT NULL, title TEXT NOT NULL, summary TEXT NOT NULL DEFAULT '', thumbnail TEXT,
  content_html TEXT NOT NULL DEFAULT '', published_at TEXT, status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  updated_at TEXT NOT NULL
);
CREATE TABLE site_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
