-- Protocol image on products (replaces the specifications text) and a cash on delivery payment method, off until the owner turns it on.
ALTER TABLE products ADD COLUMN protocol_image TEXT;
INSERT OR IGNORE INTO payment_methods (id,label,kind,account_name,account_number,instructions,qr_image,enabled,sort,created_at,updated_at) VALUES
  ('cod','Cash on Delivery','cod','','','Pay in cash when your order arrives. We confirm your order and delivery details with you first.',NULL,0,99,'2026-11-14T00:00:00.000Z','2026-11-14T00:00:00.000Z');
