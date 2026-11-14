-- Payment methods and delivery options, both managed by the administrator.
CREATE TABLE IF NOT EXISTS payment_methods (
  id TEXT PRIMARY KEY, label TEXT NOT NULL, kind TEXT NOT NULL DEFAULT 'other',
  account_name TEXT NOT NULL DEFAULT '', account_number TEXT NOT NULL DEFAULT '', instructions TEXT NOT NULL DEFAULT '',
  qr_image TEXT, enabled INTEGER NOT NULL DEFAULT 1, sort INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS delivery_options (
  id TEXT PRIMARY KEY, label TEXT NOT NULL, fee INTEGER NOT NULL DEFAULT 0, note TEXT NOT NULL DEFAULT '',
  enabled INTEGER NOT NULL DEFAULT 1, sort INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
ALTER TABLE orders ADD COLUMN delivery_option TEXT;
INSERT OR IGNORE INTO site_settings (key,value) VALUES ('free_delivery_min','');
INSERT OR IGNORE INTO payment_methods (id,label,kind,account_name,account_number,instructions,qr_image,enabled,sort,created_at,updated_at) VALUES
  ('gcash','GCash','ewallet','','','Open GCash or any InstaPay-enabled app, scan the QR code and pay the total shown on your order. Transfer fees may apply.',NULL,1,1,'2026-11-14T00:00:00.000Z','2026-11-14T00:00:00.000Z'),
  ('bpi','BPI','bank','Pep Stop','','Open the BPI app or any InstaPay-enabled app, scan the QR code and pay the total shown on your order. Transfer fees may apply.',NULL,1,2,'2026-11-14T00:00:00.000Z','2026-11-14T00:00:00.000Z');
