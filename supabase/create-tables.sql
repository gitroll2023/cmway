-- Create categories table if not exists
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name JSONB NOT NULL,
  description JSONB,
  parent_id TEXT REFERENCES categories(id),
  is_active BOOLEAN DEFAULT true,
  position INTEGER DEFAULT 0,
  display_settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create products table if not exists
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name JSONB NOT NULL,
  description JSONB,
  short_description JSONB,
  primary_category_id TEXT REFERENCES categories(id),
  price INTEGER,
  discount_price INTEGER,
  sku TEXT UNIQUE,
  stock INTEGER DEFAULT 0,
  images TEXT[],
  featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  specifications JSONB,
  benefits TEXT[],
  usage_instructions JSONB,
  seo_title TEXT,
  seo_description TEXT,
  stats JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(primary_category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can view active categories" ON categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active products" ON products
  FOR SELECT USING (is_active = true);