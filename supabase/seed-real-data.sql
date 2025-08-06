-- Clear existing test data
DELETE FROM products WHERE slug LIKE 'test-%';
DELETE FROM categories WHERE slug IN ('chlorophyll-raw', 'chlorophyll-health', 'anticancer', 'immunity');

-- Insert real categories based on actual products
INSERT INTO categories (id, slug, name, description, is_active, position, display_settings)
VALUES 
  (
    'cat-001',
    'chlorophyll-liquid',
    '{"ko": "클로로필a 원액", "en": "Chlorophyll-a Liquid"}',
    '{"ko": "99.9% 고순도 클로로필a 원액 제품군", "en": "99.9% Pure Chlorophyll-a Liquid Products"}',
    true,
    1,
    '{"show_in_menu": true, "featured": true, "icon": "droplet"}'::jsonb
  ),
  (
    'cat-002',
    'chlorophyll-capsule',
    '{"ko": "클로로필a 캡슐", "en": "Chlorophyll-a Capsules"}',
    '{"ko": "간편하게 섭취하는 클로로필a 캡슐 제품군", "en": "Easy-to-take Chlorophyll-a Capsule Products"}',
    true,
    2,
    '{"show_in_menu": true, "featured": true, "icon": "pill"}'::jsonb
  ),
  (
    'cat-003',
    'health-functional',
    '{"ko": "건강기능식품", "en": "Health Functional Food"}',
    '{"ko": "과학적으로 입증된 건강기능식품", "en": "Scientifically Proven Health Functional Foods"}',
    true,
    3,
    '{"show_in_menu": true, "featured": false, "icon": "heart"}'::jsonb
  ),
  (
    'cat-004',
    'research-products',
    '{"ko": "연구개발 제품", "en": "R&D Products"}',
    '{"ko": "지속적인 연구를 통한 혁신 제품", "en": "Innovative Products through Continuous Research"}',
    true,
    4,
    '{"show_in_menu": true, "featured": false, "icon": "flask"}'::jsonb
  )
ON CONFLICT (id) DO UPDATE
SET 
  slug = EXCLUDED.slug,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_active = EXCLUDED.is_active,
  position = EXCLUDED.position,
  display_settings = EXCLUDED.display_settings;

-- Insert real products based on the leaflet information
INSERT INTO products (
  id, slug, name, description, short_description, 
  primary_category_id, price, discount_price, sku, stock,
  images, featured, is_active, specifications, benefits, usage_instructions,
  seo_title, seo_description, created_at
)
VALUES 
  (
    'prod-001',
    'cm-chlorophyll-a-liquid',
    '{"ko": "CM 클로로필a 원액", "en": "CM Chlorophyll-a Liquid"}',
    '{"ko": "남조류 및 식물세포의 엽록체에 존재하며 태양으로부터 빛 에너지를 흡수하고 이산화탄소, 물과 합쳐져 생명을 유지할 수 있는 양분을 만드는 항암성 작용을 합니다. 그렇기 때문에 생명 에너지의 근원으로 불리며 역어사슬의 기초를 제공합니다.", "en": "Exists in the chloroplasts of blue-green algae and plant cells, absorbs light energy from the sun, and combines with carbon dioxide and water to create nutrients that sustain life with anti-cancer properties."}',
    '{"ko": "99.9% 고순도 클로로필a 추출물", "en": "99.9% Pure Chlorophyll-a Extract"}',
    'cat-001',
    89000,
    79000,
    'CMA-LIQ-001',
    100,
    '["/images/chlorophyll-default.jpg", "/mock/slide1.jpg"]',
    true,
    true,
    '{"volume": "500ml", "concentration": "99.9%", "extraction_method": "특허받은 추출공법", "storage": "냉장보관"}'::jsonb,
    '["초혈 작용", "해독 작용", "세포부활 작용", "콜레스테롤 수치감소", "암세포 발생 억제"]'::jsonb,
    '{"ko": "하루 2회, 1회 10ml를 물과 함께 섭취하십시오.", "en": "Take 10ml twice a day with water."}'::jsonb,
    'CM 클로로필a 원액 - 99.9% 고순도 엽록소 | CMWay',
    '광주과학기술원과 대전한 동물 모델을 이용해 항암효능 관련 연구 공동 진행. 99.9% 고순도 클로로필a 원액.',
    NOW()
  ),
  (
    'prod-002',
    'cm-chlorophyll-a-capsule',
    '{"ko": "CM 클로로필a 캡슐", "en": "CM Chlorophyll-a Capsules"}',
    '{"ko": "고순도 클로로필a를 캡슐 형태로 제조하여 간편하게 섭취할 수 있도록 만든 건강기능식품입니다. 체내 흡수율을 높이고 휴대가 간편하여 언제 어디서나 섭취가 가능합니다.", "en": "Health functional food made by manufacturing high-purity chlorophyll-a in capsule form for easy consumption. Enhanced absorption rate and portable for consumption anytime, anywhere."}',
    '{"ko": "간편하게 섭취하는 클로로필a 캡슐", "en": "Easy-to-take Chlorophyll-a Capsules"}',
    'cat-002',
    69000,
    59000,
    'CMA-CAP-001',
    150,
    '["/mock/slide2.jpg", "/images/chlorophyll-default.jpg"]',
    true,
    true,
    '{"quantity": "60 캡슐", "dosage": "500mg/캡슐", "main_ingredient": "클로로필a", "certification": "건강기능식품 인증"}'::jsonb,
    '["면역력 증진", "항산화 작용", "피로 개선", "혈액 순환 개선", "세포 재생 촉진"]'::jsonb,
    '{"ko": "1일 2회, 1회 2캡슐을 충분한 물과 함께 섭취하십시오.", "en": "Take 2 capsules twice daily with plenty of water."}'::jsonb,
    'CM 클로로필a 캡슐 - 건강기능식품 | CMWay',
    '간편하게 섭취하는 고순도 클로로필a 캡슐. 면역력 증진과 항산화 작용.',
    NOW()
  ),
  (
    'prod-003',
    'cm-chlorophyll-gift-set',
    '{"ko": "CM 클로로필a 선물세트", "en": "CM Chlorophyll-a Gift Set"}',
    '{"ko": "CM 클로로필a 원액과 캡슐이 함께 구성된 프리미엄 선물세트입니다. 고급스러운 패키지로 소중한 분들께 건강을 선물하기에 최적화된 구성입니다.", "en": "Premium gift set consisting of CM Chlorophyll-a liquid and capsules. Optimized composition for gifting health to loved ones with luxurious packaging."}',
    '{"ko": "프리미엄 클로로필a 선물세트", "en": "Premium Chlorophyll-a Gift Set"}',
    'cat-003',
    159000,
    139000,
    'CMA-GIFT-001',
    50,
    '["/mock/slide3.jpg", "/images/chlorophyll-default.jpg"]',
    true,
    true,
    '{"contents": "원액 500ml x 1, 캡슐 60정 x 2", "package": "고급 선물박스", "certification": "건강기능식품 인증"}'::jsonb,
    '["종합 건강 관리", "면역력 강화", "항암 효과", "혈액 정화", "세포 활성화"]'::jsonb,
    '{"ko": "제품별 사용법에 따라 섭취하십시오.", "en": "Take according to individual product instructions."}'::jsonb,
    'CM 클로로필a 프리미엄 선물세트 | CMWay',
    'CM 클로로필a 원액과 캡슐이 함께 구성된 프리미엄 건강 선물세트.',
    NOW()
  )
ON CONFLICT (id) DO UPDATE
SET 
  slug = EXCLUDED.slug,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  category_id = EXCLUDED.category_id,
  price = EXCLUDED.price,
  discount_price = EXCLUDED.discount_price,
  sku = EXCLUDED.sku,
  stock = EXCLUDED.stock,
  images = EXCLUDED.images,
  featured = EXCLUDED.featured,
  is_active = EXCLUDED.is_active,
  specifications = EXCLUDED.specifications,
  benefits = EXCLUDED.benefits,
  usage_instructions = EXCLUDED.usage_instructions,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description;