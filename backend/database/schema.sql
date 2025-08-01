-- Create database
CREATE DATABASE IF NOT EXISTS estate_house_plans;
USE estate_house_plans;

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create house_plans table
CREATE TABLE IF NOT EXISTS house_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    length DECIMAL(10,2),
    width DECIMAL(10,2),
    area DECIMAL(10,2),
    bedrooms INT,
    bathrooms INT,
    floors INT,
    price DECIMAL(10,2) DEFAULT 0.00,
    is_free BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(500),
    file_url VARCHAR(500),
    download_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create downloads table for tracking
CREATE TABLE IF NOT EXISTS downloads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plan_id INT NOT NULL,
    downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plan_id) REFERENCES house_plans(id) ON DELETE CASCADE
);

-- Clear existing admin data and insert default admin user (password: admin123)
DELETE FROM admins WHERE email = 'admin@estateplans.com';
INSERT INTO admins (email, password_hash) VALUES 
('admin@estateplans.com', '$2a$10$rQZ8N3YqGzK9L2M1N0P.Qe4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Create indexes for better performance
CREATE INDEX idx_house_plans_created_at ON house_plans(created_at);
CREATE INDEX idx_house_plans_is_free ON house_plans(is_free);
CREATE INDEX idx_downloads_plan_id ON downloads(plan_id);
CREATE INDEX idx_downloads_downloaded_at ON downloads(downloaded_at); 