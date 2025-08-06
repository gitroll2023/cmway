-- Create consultation_requests table
CREATE TABLE IF NOT EXISTS consultation_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(255),
    company VARCHAR(255),
    consultation_type VARCHAR(50) NOT NULL,
    product_interests TEXT[],
    preferred_date DATE,
    preferred_time VARCHAR(20),
    message TEXT CHECK (char_length(message) <= 1000),
    privacy_agreed BOOLEAN NOT NULL DEFAULT false,
    marketing_agreed BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'scheduled', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create activity_logs table
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    entity_name VARCHAR(255),
    action VARCHAR(50) NOT NULL,
    changes JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_consultation_requests_status ON consultation_requests(status);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_created_at ON consultation_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_phone ON consultation_requests(phone);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_email ON consultation_requests(email);

CREATE INDEX IF NOT EXISTS idx_activity_logs_entity_type ON activity_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity_id ON activity_logs(entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- Add RLS (Row Level Security) policies
ALTER TABLE consultation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Policy for consultation_requests - allow all operations for now (adjust based on your auth requirements)
CREATE POLICY "Enable all operations for consultation_requests" ON consultation_requests
    FOR ALL USING (true);

-- Policy for activity_logs - allow all operations for now (adjust based on your auth requirements)
CREATE POLICY "Enable all operations for activity_logs" ON activity_logs
    FOR ALL USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for consultation_requests
DROP TRIGGER IF EXISTS update_consultation_requests_updated_at ON consultation_requests;
CREATE TRIGGER update_consultation_requests_updated_at
    BEFORE UPDATE ON consultation_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
