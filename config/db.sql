CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    isAdmin BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Varsayılan admin kullanıcısı oluştur
INSERT INTO users (username, password, isAdmin) 
VALUES ('admin', 'admin123', true)
ON DUPLICATE KEY UPDATE username=username;

-- RemoteConfigs tablosu
CREATE TABLE IF NOT EXISTS RemoteConfigs (
    Id INT PRIMARY KEY,
    Value TINYINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Varsayılan RemoteConfig değeri
INSERT INTO RemoteConfigs (Id, Value) 
VALUES (1, 0)
ON DUPLICATE KEY UPDATE Id=Id; 