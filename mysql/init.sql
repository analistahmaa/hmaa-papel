CREATE DATABASE IF NOT EXISTS hmaa_controle_papel;
USE hmaa_controle_papel;

-- Tabela de setores
CREATE TABLE IF NOT EXISTS setores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) UNIQUE NOT NULL
);

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    senha VARCHAR(255),
    tipo ENUM('admin', 'operador') DEFAULT 'operador'
);

-- Tabela de registros
CREATE TABLE IF NOT EXISTS registros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setor_id INT,
    responsavel VARCHAR(100) NOT NULL,
    quantidade_resmas INT NOT NULL,
    data DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (setor_id) REFERENCES setores(id)
)DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insere os setores fixos
INSERT INTO setores (nome) VALUES
('RECEPÇÃO TRIAGEM'), ('RECEPÇÃO AMBULATÓRIO'), ('ENFERMARIA'), ('UTI'), 
('CENTRO CIRÚRGICO'), ('CLASSIFICAÇÃO DE RISCO'), ('AMBULATÓRIO DE QUEIMADOS'), 
('NÚCLEO EPIDEMIOLÓGICO'), ('NIR'), ('RECURSOS HUMANOS'), ('FATURAMENTO'), 
('SALA AMARELA'), ('FARMÁCIA'), ('QUALIDADE'), ('ULTRASSOM'), ('ENDOSCOPIA'), 
('SALA VERMELHA'), ('CONSULTÓRIO TRIAGEM')
ON DUPLICATE KEY UPDATE nome=nome; -- Evita erro se o setor já existir

-- Insere um usuário admin padrão
INSERT INTO usuarios (nome, email, senha, tipo) VALUES
('Administrador', 'admin@hmaa.com', 'senha_hash_aqui', 'admin')
ON DUPLICATE KEY UPDATE nome='Administrador'; -- Evita erro se o usuário já existir