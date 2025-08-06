-- Seed categories for products
INSERT INTO categories (id, slug, name, description, is_active, position, display_settings)
VALUES 
  (
    gen_random_uuid(),
    'chlorophyll-raw',
    '{"ko": "클로로필a 원액", "en": "Chlorophyll-a Extract"}',
    '{"ko": "99.9% 고순도 클로로필a 추출물", "en": "99.9% Pure Chlorophyll-a Extract"}',
    true,
    1,
    '{"show_in_menu": true, "featured": true}'::jsonb
  ),
  (
    gen_random_uuid(),
    'chlorophyll-health',
    '{"ko": "클로로필a 캡슐", "en": "Chlorophyll-a Capsules"}',
    '{"ko": "간편하게 섭취하는 건강기능식품", "en": "Easy-to-take Health Supplements"}',
    true,
    2,
    '{"show_in_menu": true, "featured": true}'::jsonb
  ),
  (
    gen_random_uuid(),
    'anticancer',
    '{"ko": "항암 부스터", "en": "Anti-cancer Booster"}',
    '{"ko": "항암 효능이 강화된 특별 포뮬러", "en": "Special Formula with Enhanced Anti-cancer Effects"}',
    true,
    3,
    '{"show_in_menu": true, "featured": true}'::jsonb
  ),
  (
    gen_random_uuid(),
    'immunity',
    '{"ko": "면역력 플러스", "en": "Immunity Plus"}',
    '{"ko": "면역력 증진에 특화된 제품", "en": "Specialized Products for Immunity Enhancement"}',
    true,
    4,
    '{"show_in_menu": true, "featured": true}'::jsonb
  )
ON CONFLICT (slug) DO UPDATE
SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_active = EXCLUDED.is_active,
  position = EXCLUDED.position,
  display_settings = EXCLUDED.display_settings;