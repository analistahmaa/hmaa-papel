-- Cria o banco se ainda não existir
CREATE DATABASE IF NOT EXISTS hmaa_controle_papel;

-- Usa o banco
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
    senha VARCHAR(100),
    tipo ENUM('admin', 'operador') DEFAULT 'operador'
);

-- Tabela de registros
CREATE TABLE IF NOT EXISTS registros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setor_id INT,
    quantidade INT NOT NULL,
    responsavel VARCHAR(100),
    data DATE,
    FOREIGN KEY (setor_id) REFERENCES setores(id)
);

-- Insere os setores fixos (se ainda não existirem)
INSERT IGNORE INTO setores (nome) VALUES
('RECEPÇÃO TRIAGEM'),
('RECEPÇÃO AMBULATÓRIO'),
('ENFERMARIA'),
('UTI'),
('CENTRO CIRÚRGICO'),
('CLASSIFICAÇÃO DE RISCO'),
('AMBULATÓRIO DE QUEIMADOS'),
('NÚCLEO EPIDEMIOLÓGICO'),
('NIR'),
('RECURSOS HUMANOS'),
('FATURAMENTO'),
('SALA AMARELA'),
('FARMÁCIA'),
('QUALIDADE'),
('ULTRASSOM'),
('ENDOSCOPIA'),
('SALA VERMELHA'),
('CONSULTÓRIO TRIAGEM');

-- Insere um usuário admin padrão (senha: admin123)
INSERT IGNORE INTO usuarios (nome, email, senha, tipo) VALUES
('Administrador', 'admin@hmaa.com', '21232f297a57a5a743894a0e4a801fc3', 'admin');