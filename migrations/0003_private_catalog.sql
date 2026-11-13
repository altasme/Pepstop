-- Private customer catalog: customer accounts with manual approval, regulatory review gate, SKUs, new settings.

CREATE TABLE customers (
  id TEXT PRIMARY KEY, full_name TEXT NOT NULL, phone TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','suspended')),
  status_note TEXT NOT NULL DEFAULT '', admin_notes TEXT NOT NULL DEFAULT '',
  failed_count INTEGER NOT NULL DEFAULT 0, locked_until TEXT,
  created_at TEXT NOT NULL, decided_at TEXT, last_login_at TEXT
);
CREATE INDEX idx_customers_status ON customers(status);
CREATE TABLE customer_sessions (
  id TEXT PRIMARY KEY, customer_id TEXT NOT NULL REFERENCES customers(id), created_at TEXT NOT NULL,
  last_seen TEXT NOT NULL, expires_at TEXT NOT NULL
);
CREATE TABLE customer_status_history (
  id TEXT PRIMARY KEY, customer_id TEXT NOT NULL REFERENCES customers(id), at TEXT NOT NULL,
  from_status TEXT, to_status TEXT NOT NULL, by_user TEXT NOT NULL, note TEXT NOT NULL DEFAULT ''
);

ALTER TABLE orders ADD COLUMN customer_id TEXT;
ALTER TABLE product_variants ADD COLUMN sku TEXT NOT NULL DEFAULT '';

-- products: regulatory review gate and the "unpublished" publication status. SQLite cannot alter the CHECK on
-- products.status and D1 enforces foreign keys on a table rebuild, so "unpublished" is stored as status 'draft'
-- with unpublished = 1 and exposed by the API as its own status. Nothing is rebuilt or dropped.
ALTER TABLE products ADD COLUMN regulatory_status TEXT NOT NULL DEFAULT 'pending_review' CHECK (regulatory_status IN ('pending_review','verified','not_cleared'));
ALTER TABLE products ADD COLUMN unpublished INTEGER NOT NULL DEFAULT 0;
-- Nothing may stay published without a verified regulatory status.
UPDATE products SET status = 'draft', unpublished = 1 WHERE status = 'published';

INSERT OR IGNORE INTO site_settings (key,value) VALUES
  ('registration_message', 'Your account has been created!

Thank you for registering with The Pep Stop.

Your account is currently awaiting approval. Please contact The Pep Stop and let our team know that you have created an account and are waiting for approval.

Once your account has been reviewed and approved by our administrator, you will be able to log in and view the product catalog.'),
  ('disclose_rejection_reason', '0'),
  ('contact_messenger', ''),
  ('contact_whatsapp', ''),
  ('contact_phone', '09910189669'),
  ('payment_instructions', '');
