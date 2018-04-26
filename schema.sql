DROP DATABASE join_us;
CREATE DATABASE join_us;
USE join_us;

CREATE TABLE users(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL
);

CREATE TABLE donations(
    tranaction_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    donation_amount DOUBLE UNSIGNED NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
);