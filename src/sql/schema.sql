-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('student', 'parent', 'employee', 'citizen', 'officer', 'admin')) NOT NULL,
  department VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP WITH TIME ZONE
);

-- Create complaints table
CREATE TABLE IF NOT EXISTS complaints (
  id VARCHAR(20) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(20) CHECK (status IN ('pending', 'in-progress', 'resolved', 'cancelled', 'escalated')) DEFAULT 'pending',
  priority VARCHAR(10) CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  
  -- User who submitted the complaint
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Officer assignment
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMP WITH TIME ZONE,
  assigned_by UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Resolution details
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  resolution TEXT,
  
  -- Other status timestamps
  cancelled_at TIMESTAMP WITH TIME ZONE,
  escalated_at TIMESTAMP WITH TIME ZONE,
  escalation_reason TEXT,
  
  -- Additional fields
  department VARCHAR(100),
  due_date TIMESTAMP WITH TIME ZONE,
  attachments TEXT[], -- Array of file URLs/paths
  
  -- Feedback from user after resolution
  feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
  feedback_comment TEXT,
  feedback_given_at TIMESTAMP WITH TIME ZONE,
  
  -- Progress tracking
  progress_notes JSONB DEFAULT '[]'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_complaints_user_id ON complaints(user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_assigned_to ON complaints(assigned_to);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_department ON complaints(department);
CREATE INDEX IF NOT EXISTS idx_complaints_submitted_at ON complaints(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_department ON users(department);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_complaints_updated_at 
    BEFORE UPDATE ON complaints 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update all users" ON users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Anyone can insert users" ON users
    FOR INSERT WITH CHECK (true);

-- Create policies for complaints table
CREATE POLICY "Users can view their own complaints" ON complaints
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Officers can view assigned complaints" ON complaints
    FOR SELECT USING (
        assigned_to = auth.uid() OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role IN ('officer', 'admin')
        )
    );

CREATE POLICY "Admins can view all complaints" ON complaints
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can insert their own complaints" ON complaints
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Officers can update assigned complaints" ON complaints
    FOR UPDATE USING (
        assigned_to = auth.uid() OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role IN ('officer', 'admin')
        )
    );

CREATE POLICY "Users can update their own complaints" ON complaints
    FOR UPDATE USING (user_id = auth.uid());

-- Insert default users (with generated UUIDs for demo purposes)
INSERT INTO users (id, name, email, phone, role, department, is_active) VALUES
    ('11111111-1111-1111-1111-111111111111', 'John Smith', 'officer@university.edu', '+1-555-0101', 'officer', 'Academic Affairs', true),
    ('22222222-2222-2222-2222-222222222222', 'Sarah Wilson', 'officer2@university.edu', '+1-555-0102', 'officer', 'Facilities', true),
    ('33333333-3333-3333-3333-333333333333', 'Mike Johnson', 'officer3@university.edu', '+1-555-0103', 'officer', 'Student Services', true),
    ('44444444-4444-4444-4444-444444444444', 'Lisa Brown', 'officer4@university.edu', '+1-555-0104', 'officer', 'IT Services', true),
    ('55555555-5555-5555-5555-555555555555', 'Admin User', 'admin@university.edu', '+1-555-0100', 'admin', 'Administration', true)
ON CONFLICT (email) DO NOTHING;