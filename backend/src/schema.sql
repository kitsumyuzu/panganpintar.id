CREATE DATABASE IF NOT EXISTS panganpintar;

USE panganpintar;

-- Roles Table

CREATE TABLE IF NOT EXISTS roles (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO roles (_id, role_name) VALUES 
(1, 'super admin'), 
(2, 'admin'), 
(3, 'customer');

-- Users Table

CREATE TABLE IF NOT EXISTS users (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(100),
    roles_id INT(11) NOT NULL DEFAULT 3,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_token VARCHAR(255),
    reset_token_expire DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (roles_id) REFERENCES roles(_id) ON DELETE RESTRICT
);

-- Customer Table

CREATE TABLE IF NOT EXISTS customers (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    affiliate_store_id INT,
    nama_lengkap VARCHAR(255) NOT NULL,
    tanggal_lahir DATE,
    province VARCHAR(100),
    phone_number VARCHAR(20),
    avatar VARCHAR(255),
    bio TEXT,
    address TEXT,
    kota VARCHAR(100),
    kode_pos VARCHAR(10),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(_id) ON DELETE CASCADE
);

-- User Authentications

CREATE TABLE IF NOT EXISTS user_authentications (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    ip_address VARCHAR(45),
    user_agent VARCHAR(255),
    device VARCHAR(100),
    browser VARCHAR(100),
    os VARCHAR(100),
    location VARCHAR(255),
    login_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(_id) ON DELETE CASCADE
);

-- Affiliate Store

CREATE TABLE IF NOT EXISTS store_types (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(100),
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO store_types (_id, name, slug, icon) VALUES 
(1, 'Minimart', 'minimart', '🏪'),
(2, 'Grocer', 'grocer', '🛒'),
(3, 'Food Seller', 'food-seller', '🍔'),
(4, 'Petani', 'petani', '👨‍🌾'),
(5, 'Supplier', 'supplier', '📦'),
(6, 'Distributor', 'distributor', '🚚'),
(7, 'Online Shop', 'online-shop', '🛍️');

CREATE TABLE IF NOT EXISTS item_categories (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(100),
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO item_categories (_id, name, slug, icon) VALUES 
(1, 'Beras', 'beras', '🍚'),
(2, 'Cabai', 'cabai', '🌶️'),
(3, 'Bawang', 'bawang', '🧅'),
(4, 'Daging', 'daging', '🍖'),
(5, 'Ayam', 'ayam', '🐔'),
(6, 'Telur', 'telur', '🥚'),
(7, 'Sayuran', 'sayuran', '🥬'),
(8, 'Ikan', 'ikan', '🐟'),
(9, 'Minyak', 'minyak', '🫗'),
(10, 'Gula', 'gula', '🍬'),
(11, 'Rempah', 'rempah', '🌿'),
(12, 'Kopi', 'kopi', '☕'),
(13, 'Kedelai', 'kedelai', '🫘'),
(14, 'Tahu & Tempe', 'tahu-tempe', '🧈'),
(15, 'Susu', 'susu', '🥛'),
(16, 'Buah', 'buah', '🍎'),
(17, 'Bumbu', 'bumbu', '🧂'),
(18, 'Makanan Olahan', 'makanan-olahan', '🥫'),
(19, 'Lainnya', 'lainnya', '📦');

CREATE TABLE IF NOT EXISTS affiliate_stores (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    store_type_id INT NOT NULL,
    province VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    address TEXT,
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INT DEFAULT 0,
    image VARCHAR(255),
    cover_image VARCHAR(255),
    phone VARCHAR(20),
    whatsapp VARCHAR(20),
    email VARCHAR(100),
    instagram VARCHAR(100),
    facebook VARCHAR(100),
    tiktok VARCHAR(100),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(_id) ON DELETE CASCADE,
    FOREIGN KEY (store_type_id) REFERENCES store_types(_id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS store_items (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    store_id INT NOT NULL,
    item_category_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    price DECIMAL(15,2) NOT NULL,
    price_discounter DECIMAL(15,2),
    unit VARCHAR(50) NOT NULL DEFAULT '/kg',
    min_order INT DEFAULT 1,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES affiliate_stores(_id) ON DELETE CASCADE,
    FOREIGN KEY (item_category_id) REFERENCES item_categories(_id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS item_stocks (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL UNIQUE,
    quantity DECIMAL(15,2) DEFAULT 0,
    unit VARCHAR(50) DEFAULT 'kg',
    min_stock_alert DECIMAL(15,2) DEFAULT 10,
    last_restock_at DATETIME,
    expires_at DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES store_items(_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS store_reviews (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    store_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    FOREIGN KEY (store_id) REFERENCES affiliate_stores(_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS affiliate_commissions (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    affiliate_store_id INT NOT NULL,
    user_id INT NOT NULL,
    commission_rate DECIMAL(5,2) DEFAULT 10.00,
    sales_count INT DEFAULT 0,
    total_earnings DECIMAL(15,2) DEFAULT 0,
    pending_earnings DECIMAL(15,2) DEFAULT 0,
    withdrawn_earnings DECIMAL(15,2) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (affiliate_store_id) REFERENCES affiliate_stores(_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(_id) ON DELETE CASCADE
);

-- Table Index --

ALTER TABLE users ADD INDEX IF NOT EXISTS idx_email (email);
ALTER TABLE users ADD INDEX IF NOT EXISTS idx_roles (roles_id);

ALTER TABLE customers ADD INDEX IF NOT EXISTS idx_user_id (user_id);
ALTER TABLE customers ADD INDEX IF NOT EXISTS idx_province (province);
ALTER TABLE customers ADD INDEX IF NOT EXISTS idx_affiliate_store (affiliate_store_id);

ALTER TABLE user_authentications ADD INDEX IF NOT EXISTS idx_user_login (user_id, login_at);

ALTER TABLE affiliate_stores ADD INDEX IF NOT EXISTS idx_owner (owner_id);
ALTER TABLE affiliate_stores ADD INDEX IF NOT EXISTS idx_slug (slug);
ALTER TABLE affiliate_stores ADD INDEX IF NOT EXISTS idx_province (province);
ALTER TABLE affiliate_stores ADD INDEX IF NOT EXISTS idx_is_active (is_active);

ALTER TABLE store_items ADD INDEX IF NOT EXISTS idx_store (store_id);
ALTER TABLE store_items ADD INDEX IF NOT EXISTS idx_category (item_category_id);
ALTER TABLE store_items ADD INDEX IF NOT EXISTS idx_is_featured (is_featured);
ALTER TABLE store_items ADD INDEX IF NOT EXISTS idx_is_active (is_active);

ALTER TABLE item_stocks ADD INDEX IF NOT EXISTS idx_quantity (quantity);

ALTER TABLE store_reviews ADD INDEX IF NOT EXISTS idx_store (store_id);
ALTER TABLE store_reviews ADD INDEX IF NOT EXISTS idx_user (user_id);

ALTER TABLE affiliate_commissions ADD INDEX IF NOT EXISTS idx_affiliate (affiliate_store_id);
ALTER TABLE affiliate_commissions ADD INDEX IF NOT EXISTS idx_user (user_id);