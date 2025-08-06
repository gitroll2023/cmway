-- Create notices table (공지사항)
CREATE TABLE IF NOT EXISTS notices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title JSONB NOT NULL DEFAULT '{"ko": "", "en": ""}',
  content JSONB NOT NULL DEFAULT '{"ko": "", "en": ""}',
  category TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('general', 'service', 'event', 'maintenance')),
  is_pinned BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  author TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create news table (뉴스/이벤트)
CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title JSONB NOT NULL DEFAULT '{"ko": "", "en": ""}',
  content JSONB NOT NULL DEFAULT '{"ko": "", "en": ""}',
  excerpt JSONB NOT NULL DEFAULT '{"ko": "", "en": ""}',
  category TEXT NOT NULL DEFAULT 'news' CHECK (category IN ('news', 'event', 'promotion', 'update')),
  featured_image TEXT,
  author TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  event_date TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create faqs table (자주 묻는 질문)
CREATE TABLE IF NOT EXISTS faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question JSONB NOT NULL DEFAULT '{"ko": "", "en": ""}',
  answer JSONB NOT NULL DEFAULT '{"ko": "", "en": ""}',
  category TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('general', 'product', 'order', 'delivery', 'return', 'payment', 'membership')),
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  helpful_yes INTEGER DEFAULT 0,
  helpful_no INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_notices_published ON notices(is_published, published_at DESC);
CREATE INDEX idx_notices_category ON notices(category);
CREATE INDEX idx_notices_pinned ON notices(is_pinned, published_at DESC);

CREATE INDEX idx_news_published ON news(is_published, published_at DESC);
CREATE INDEX idx_news_category ON news(category);
CREATE INDEX idx_news_featured ON news(is_featured, published_at DESC);

CREATE INDEX idx_faqs_published ON faqs(is_published, display_order);
CREATE INDEX idx_faqs_category ON faqs(category);
CREATE INDEX idx_faqs_featured ON faqs(is_featured, display_order);

-- Enable Row Level Security
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can view published notices" ON notices
  FOR SELECT USING (is_published = true);

CREATE POLICY "Public can view published news" ON news
  FOR SELECT USING (is_published = true);

CREATE POLICY "Public can view published faqs" ON faqs
  FOR SELECT USING (is_published = true);

-- Create policies for admin full access (assuming admin role)
CREATE POLICY "Admins can manage notices" ON notices
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage news" ON news
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage faqs" ON faqs
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Insert sample data for notices
INSERT INTO notices (title, content, category, is_pinned, is_published, author, views, published_at) VALUES
('{"ko": "서비스 이용약관 개정 안내", "en": "Service Terms Update Notice"}',
 '{"ko": "안녕하세요. 씨엠웨이입니다. 서비스 이용약관이 2025년 1월 15일부터 개정됩니다. 주요 변경사항은 다음과 같습니다...", "en": "Hello, this is CMWay. Our service terms will be updated on January 15, 2025. Major changes include..."}',
 'service', true, true, '관리자', 245, NOW()),
('{"ko": "설 연휴 배송 안내", "en": "Lunar New Year Shipping Notice"}',
 '{"ko": "설 연휴 기간 동안 배송 일정이 변경됩니다. 1월 28일부터 2월 2일까지 배송이 중단되오니 참고 부탁드립니다.", "en": "Shipping schedule will be changed during Lunar New Year holidays. Shipping will be suspended from January 28 to February 2."}',
 'general', false, true, '관리자', 182, NOW()),
('{"ko": "시스템 정기 점검 안내", "en": "System Maintenance Notice"}',
 '{"ko": "1월 20일 오전 2시부터 4시까지 시스템 점검이 진행됩니다.", "en": "System maintenance will be conducted from 2 AM to 4 AM on January 20."}',
 'maintenance', false, true, '시스템관리자', 98, NOW());

-- Insert sample data for news
INSERT INTO news (title, content, excerpt, category, author, is_featured, is_published, views, likes, comments, tags, published_at) VALUES
('{"ko": "씨엠웨이, 2025년 신제품 출시 예정", "en": "CMWay to Launch New Products in 2025"}',
 '{"ko": "씨엠웨이가 2025년 상반기에 혁신적인 건강기능식품 라인업을 출시할 예정입니다. 이번 신제품은 최신 연구 결과를 바탕으로 개발되었으며...", "en": "CMWay is set to launch an innovative line of health supplements in the first half of 2025. These new products were developed based on the latest research..."}',
 '{"ko": "2025년 상반기 혁신적인 건강기능식품 라인업 출시 예정", "en": "Innovative health supplement lineup to launch in H1 2025"}',
 'news', '홍보팀', true, true, 524, 45, 12, ARRAY['신제품', '건강기능식품', '2025'], NOW()),
('{"ko": "겨울맞이 특별 프로모션 진행", "en": "Winter Special Promotion"}',
 '{"ko": "씨엠웨이가 겨울을 맞아 특별 프로모션을 진행합니다. 1월 15일부터 2월 28일까지 전 제품 20% 할인 및 2+1 이벤트가 진행됩니다...", "en": "CMWay is running a special winter promotion. From January 15 to February 28, enjoy 20% off all products and 2+1 events..."}',
 '{"ko": "1월 15일부터 2월 28일까지 전 제품 20% 할인", "en": "20% off all products from January 15 to February 28"}',
 'promotion', '마케팅팀', false, true, 387, 28, 5, ARRAY['프로모션', '할인', '이벤트'], NOW()),
('{"ko": "2025 건강 세미나 개최 안내", "en": "2025 Health Seminar Announcement"}',
 '{"ko": "씨엠웨이가 주최하는 2025 건강 세미나가 2월 20일 광주 김대중컨벤션센터에서 개최됩니다. 이번 세미나에서는...", "en": "The 2025 Health Seminar hosted by CMWay will be held on February 20 at Gwangju Kim Dae-jung Convention Center..."}',
 '{"ko": "2월 20일 광주 김대중컨벤션센터에서 개최", "en": "February 20 at Gwangju Kim Dae-jung Convention Center"}',
 'event', '교육팀', true, true, 298, 35, 8, ARRAY['세미나', '교육', '건강'], NOW(), '2025-02-20');

-- Insert sample data for FAQs
INSERT INTO faqs (question, answer, category, tags, is_published, is_featured, display_order, views, helpful_yes, helpful_no) VALUES
('{"ko": "회원가입은 어떻게 하나요?", "en": "How do I sign up?"}',
 '{"ko": "홈페이지 상단의 \"회원가입\" 버튼을 클릭하신 후, 필요한 정보를 입력하시면 됩니다. 이메일 인증 후 회원가입이 완료됩니다.", "en": "Click the \"Sign Up\" button at the top of the homepage and enter the required information. Registration will be complete after email verification."}',
 'membership', ARRAY['회원가입', '가입', '등록'], true, true, 1, 342, 89, 12),
('{"ko": "배송은 얼마나 걸리나요?", "en": "How long does delivery take?"}',
 '{"ko": "일반적으로 주문 후 2-3일 이내에 배송됩니다. 도서산간 지역의 경우 1-2일 추가로 소요될 수 있습니다. 공휴일이나 연휴 기간에는 배송이 지연될 수 있습니다.", "en": "Generally, delivery takes 2-3 days after ordering. Remote areas may take an additional 1-2 days. Delivery may be delayed during holidays."}',
 'delivery', ARRAY['배송', '배송기간', '택배'], true, true, 2, 567, 145, 23),
('{"ko": "반품/교환은 어떻게 하나요?", "en": "How do I return or exchange products?"}',
 '{"ko": "상품 수령 후 7일 이내에 마이페이지에서 반품/교환 신청을 하실 수 있습니다. 단순 변심의 경우 왕복 배송비를 부담하셔야 하며, 제품 하자의 경우 무료로 처리됩니다.", "en": "You can apply for returns/exchanges within 7 days of receiving the product through My Page. For simple change of mind, you must pay round-trip shipping fees. Product defects are handled free of charge."}',
 'return', ARRAY['반품', '교환', '환불'], true, false, 3, 234, 67, 8),
('{"ko": "결제 수단은 어떤 것들이 있나요?", "en": "What payment methods are available?"}',
 '{"ko": "신용카드, 체크카드, 무통장입금, 카카오페이, 네이버페이, 토스 등 다양한 결제 수단을 지원합니다. 할부 결제는 5만원 이상 구매 시 가능합니다.", "en": "We support various payment methods including credit cards, debit cards, bank transfers, KakaoPay, NaverPay, and Toss. Installment payments are available for purchases over 50,000 won."}',
 'payment', ARRAY['결제', '카드', '무통장입금'], true, false, 4, 189, 45, 5),
('{"ko": "제품 사용법을 알고 싶어요", "en": "I want to know how to use the products"}',
 '{"ko": "각 제품 상세 페이지에서 사용법을 확인하실 수 있습니다. 또한 제품과 함께 제공되는 설명서를 참고하시거나, 고객센터로 문의주시면 자세히 안내해드립니다.", "en": "You can check the usage instructions on each product detail page. Please also refer to the manual provided with the product, or contact our customer center for detailed guidance."}',
 'product', ARRAY['사용법', '제품', '설명서'], true, false, 5, 156, 38, 3);

-- Create update triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_notices_updated_at BEFORE UPDATE ON notices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();