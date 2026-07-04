CREATE DATABASE IF NOT EXISTS review_analyzer;
USE review_analyzer;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS review_analysis (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    review_text TEXT NOT NULL,
    word_count INT NOT NULL,
    char_count INT NOT NULL,
    summary TEXT,
    positive_points JSON,
    negative_points JSON,
    complaints JSON,
    features JSON,
    keywords JSON,
    suggestions JSON,
    sentiment_positive INT NOT NULL DEFAULT 0,
    sentiment_neutral INT NOT NULL DEFAULT 0,
    sentiment_negative INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_analysis_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS favorites (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    analysis_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_user_analysis UNIQUE (user_id, analysis_id),
    CONSTRAINT fk_favorite_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_favorite_analysis FOREIGN KEY (analysis_id) REFERENCES review_analysis(id) ON DELETE CASCADE
);

CREATE INDEX idx_analysis_user ON review_analysis(user_id);
CREATE INDEX idx_analysis_created ON review_analysis(created_at);
CREATE INDEX idx_favorite_user ON favorites(user_id);
