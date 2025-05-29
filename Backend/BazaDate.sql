CREATE USER 'admin'@'localhost' IDENTIFIED BY 'root';


-- Acordare privilegii complete asupra bazei TaskManagerDB
GRANT ALL PRIVILEGES ON TaskManagerDB.* TO 'admin'@'localhost';


-- Aplicare privilegii
FLUSH PRIVILEGES;

SELECT User, Host FROM mysql.user;

CREATE TABLE Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE Tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES Users(id)
);


INSERT INTO Users (username, email, password_hash)
VALUES
('ana', 'ana@example.com', 'hash_parola_ana'),
('ion', 'ion@example.com', 'hash_parola_ion');

INSERT INTO Tasks (user_id, title, description, status)
VALUES
(1, 'Primul task', 'Descriere task pentru Ana', 'pending'),
(2, 'Al doilea task', 'Descriere task pentru Ion', 'done');
