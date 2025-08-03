-- Create database
CREATE DATABASE IF NOT EXISTS estate_house_plans;
USE estate_house_plans;

-- Create users table (for admin and regular users)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create house_plans table
CREATE TABLE IF NOT EXISTS house_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) DEFAULT 0.00,
    bedrooms INT,
    bathrooms INT,
    square_feet INT,
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
    user_id INT,
    downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plan_id) REFERENCES house_plans(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create messages table for contact form
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
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
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_messages_created_at ON messages(created_at); 