-- =============================================
-- ProDry DZ — Orders Table Migration
-- Run this in Supabase SQL Editor
-- =============================================

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number SERIAL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  wilaya_id INT NOT NULL,
  wilaya_name TEXT NOT NULL,
  commune TEXT NOT NULL,
  address TEXT NOT NULL,
  bundle_type TEXT NOT NULL,          -- '1_piece', '2_pieces', '3_pieces'
  delivery_type TEXT NOT NULL DEFAULT 'domicile', -- 'domicile', 'stopdesk'
  payment_method TEXT NOT NULL DEFAULT 'cod',     -- 'cod', 'baridimob'
  total_price INT NOT NULL,
  shipping_fee INT NOT NULL,
  status TEXT DEFAULT 'pending',      -- 'pending', 'confirmed', 'cancelled', 'shipped'
  tracking_code TEXT NULL,
  telegram_message_id BIGINT NULL,
  ecotrack_response JSONB NULL
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(phone);
