-- Web8 UltraThinking Database Schema
-- PostgreSQL initialization script

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create search_history table
CREATE TABLE IF NOT EXISTS search_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    query TEXT NOT NULL,
    provider VARCHAR(50) NOT NULL,
    results_count INTEGER DEFAULT 0,
    execution_time_ms INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create documents table (for ingestion)
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT UNIQUE NOT NULL,
    title TEXT,
    content TEXT,
    lang_guess VARCHAR(10),
    word_count INTEGER DEFAULT 0,
    keywords JSONB,
    summary TEXT[],
    sentiment JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mesh_nodes table
CREATE TABLE IF NOT EXISTS mesh_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100),
    type VARCHAR(20) DEFAULT 'lora',
    status VARCHAR(20) DEFAULT 'offline',
    lat DECIMAL(10,8),
    lon DECIMAL(11,8),
    last_seen TIMESTAMP WITH TIME ZONE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create system_metrics table
CREATE TABLE IF NOT EXISTS system_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_type VARCHAR(50) NOT NULL,
    metric_value DECIMAL(15,4),
    metadata JSONB,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_search_history_user ON search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_created ON search_history(created_at);
CREATE INDEX IF NOT EXISTS idx_documents_url ON documents(url);
CREATE INDEX IF NOT EXISTS idx_documents_created ON documents(created_at);
CREATE INDEX IF NOT EXISTS idx_mesh_nodes_status ON mesh_nodes(status);
CREATE INDEX IF NOT EXISTS idx_system_metrics_type ON system_metrics(metric_type, recorded_at);

-- Insert default admin user (password: web8admin)
INSERT INTO users (username, email, password_hash, role) 
VALUES ('admin', 'admin@web8.com', '$2b$10$rGKQQY5qO8UwxNcBKy/mke8c4zY1HWR4qKJcYHhPz8Y8QYf5K6GGi', 'admin')
ON CONFLICT (username) DO NOTHING;
