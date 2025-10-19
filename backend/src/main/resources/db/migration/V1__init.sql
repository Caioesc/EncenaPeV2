-- EncenaPe Database Schema
-- Version: 1.0
-- Description: Initial database schema for EncenaPe platform

-- Usuários
CREATE TABLE usuarios (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  telefone VARCHAR(50),
  avatar_url VARCHAR(1024),
  bio TEXT,
  roles VARCHAR(100) DEFAULT 'ROLE_USER',
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Espaços
CREATE TABLE espacos (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  endereco VARCHAR(500),
  cidade VARCHAR(150),
  capacidade INT,
  disponivel BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Eventos
CREATE TABLE eventos (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(500) NOT NULL,
  descricao TEXT,
  categoria VARCHAR(100),
  cidade VARCHAR(150),
  local VARCHAR(255),
  endereco VARCHAR(500),
  data_hora DATETIME NOT NULL,
  duracao_min INT DEFAULT 120,
  preco DECIMAL(10,2) NOT NULL,
  total_tickets INT DEFAULT 0,
  tickets_available INT DEFAULT 0,
  imagem_url VARCHAR(1024),
  espaco_id BIGINT,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (espaco_id) REFERENCES espacos(id) ON DELETE SET NULL
);

-- Ingressos
CREATE TABLE ingressos (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  usuario_id BIGINT NOT NULL,
  evento_id BIGINT NOT NULL,
  quantidade INT NOT NULL DEFAULT 1,
  codigo VARCHAR(200) NOT NULL UNIQUE,
  qr_code_url VARCHAR(1024),
  status VARCHAR(20) DEFAULT 'ACTIVE',
  valor_total DECIMAL(10,2) NOT NULL,
  metodo_pagamento VARCHAR(50),
  cancel_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  canceled_at TIMESTAMP NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE
);

-- Mensagens / Tickets de Suporte
CREATE TABLE mensagens (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  remetente VARCHAR(255),
  texto TEXT NOT NULL,
  email_contato VARCHAR(255),
  status VARCHAR(20) DEFAULT 'OPEN',
  resposta TEXT,
  admin_respondeu_id BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  respondido_at TIMESTAMP NULL,
  FOREIGN KEY (admin_respondeu_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- FAQs
CREATE TABLE faq (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  pergunta TEXT NOT NULL,
  resposta TEXT NOT NULL,
  tags VARCHAR(255),
  categoria VARCHAR(100),
  ordem INT DEFAULT 0,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Password reset tokens
CREATE TABLE password_reset_tokens (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  usuario_id BIGINT NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Indexes para performance
CREATE INDEX idx_eventos_data ON eventos(data_hora);
CREATE INDEX idx_eventos_categoria ON eventos(categoria);
CREATE INDEX idx_eventos_cidade ON eventos(cidade);
CREATE INDEX idx_eventos_ativo ON eventos(ativo);
CREATE INDEX idx_ingressos_usuario ON ingressos(usuario_id);
CREATE INDEX idx_ingressos_evento ON ingressos(evento_id);
CREATE INDEX idx_ingressos_status ON ingressos(status);
CREATE INDEX idx_ingressos_codigo ON ingressos(codigo);
CREATE INDEX idx_mensagens_status ON mensagens(status);
CREATE INDEX idx_faq_categoria ON faq(categoria);
CREATE INDEX idx_faq_ativo ON faq(ativo);
CREATE INDEX idx_password_tokens_hash ON password_reset_tokens(token_hash);
CREATE INDEX idx_password_tokens_expires ON password_reset_tokens(expires_at);
