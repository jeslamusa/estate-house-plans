-- Create users table (for admin and regular users)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create house_plans table
CREATE TABLE IF NOT EXISTS house_plans (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) DEFAULT 0.00,
    bedrooms INTEGER,
    bathrooms INTEGER,
    square_feet INTEGER,
    image_url VARCHAR(500),
    file_url VARCHAR(500),
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create downloads table for tracking
CREATE TABLE IF NOT EXISTS downloads (
    id SERIAL PRIMARY KEY,
    plan_id INTEGER NOT NULL,
    user_id INTEGER,
    downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plan_id) REFERENCES house_plans(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create messages table for contact form
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_house_plans_created_at ON house_plans(created_at);
CREATE INDEX idx_house_plans_price ON house_plans(price);
CREATE INDEX idx_downloads_plan_id ON downloads(plan_id);
CREATE INDEX idx_downloads_downloaded_at ON downloads(downloaded_at);
CREATE INDEX idx_users_email_lower ON users(LOWER(email));
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_house_plans_updated_at
    BEFORE UPDATE ON house_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
