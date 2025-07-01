-- init.sql
CREATE DATABASE IF NOT EXISTS hmaa_controle_papel;
USE hmaa_controle_papel;

-- Tabela de setores (sem alteração)
CREATE TABLE IF NOT EXISTS setores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) UNIQUE NOT NULL
);

-- Tabela de usuários (sem alteração)
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    senha VARCHAR(100),
    tipo ENUM('admin', 'operador') DEFAULT 'operador'
);

-- ========================================================
-- Tabela de registros (AQUI ESTÃO AS MUDANÇAS)
-- ========================================================
CREATE TABLE IF NOT EXISTS registros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setor_id INT,
    responsavel VARCHAR(100) NOT NULL,    -- <-- CAMPO ADICIONADO
    quantidade_resmas INT NOT NULL,       -- <-- NOME ALTERADO DE 'quantidade'
    data DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (setor_id) REFERENCES setores(id)
);

-- Insere os setores fixos (sem alteração)
INSERT IGNORE INTO setores (nome) VALUES
('RECEPÇÃO TRIAGEM'), ('RECEPÇÃO AMBULATÓRIO'), ('ENFERMARIA'), ('UTI'), 
('CENTRO CIRÚRGICO'), ('CLASSIFICAÇÃO DE RISCO'), ('AMBULATÓRIO DE QUEIMADOS'), 
('NÚCLEO EPIDEMIOLÓGICO'), ('NIR'), ('RECURSOS HUMANOS'), ('FATURAMENTO'), 
('SALA AMARELA'), ('FARMÁCIA'), ('QUALIDADE'), ('ULTRASSOM'), ('ENDOSCOPIA'), 
('SALA VERMELHA'), ('CONSULTÓRIO TRIAGEM');

-- Insere um usuário admin padrão (senha: admin) - recomendo usar hash depois
INSERT IGNORE INTO usuarios (nome, email, senha, tipo) VALUES
('Administrador', 'admin@hmaa.com', '$2b$10$EXAMPLEHASH.YOURREALHASHHERE', 'admin');