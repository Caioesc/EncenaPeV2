-- Seed data for EncenaPe
-- Version: 2.0
-- Description: Initial data for development and testing

-- Insert admin user (password: admin123)
INSERT INTO usuarios (nome, email, senha, roles, ativo) VALUES 
('Administrador', 'admin@encenape.com', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'ROLE_ADMIN', TRUE);

-- Insert test users (password: user123)
INSERT INTO usuarios (nome, email, senha, telefone, roles, ativo) VALUES 
('João Silva', 'joao@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', '(11) 99999-9999', 'ROLE_USER', TRUE),
('Maria Santos', 'maria@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', '(11) 88888-8888', 'ROLE_USER', TRUE),
('Pedro Costa', 'pedro@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', '(11) 77777-7777', 'ROLE_USER', TRUE);

-- Insert espaços
INSERT INTO espacos (nome, descricao, endereco, cidade, capacidade, disponivel) VALUES 
('Teatro Municipal', 'Teatro histórico no centro da cidade', 'Praça da República, 1 - Centro', 'São Paulo', 500, TRUE),
('Casa de Cultura', 'Espaço cultural moderno', 'Rua das Artes, 100 - Vila Madalena', 'São Paulo', 200, TRUE),
('Teatro do Sesc', 'Teatro do Sesc Pompeia', 'Rua Clélia, 93 - Pompeia', 'São Paulo', 300, TRUE),
('Teatro Rio Branco', 'Teatro no centro do Rio', 'Av. Rio Branco, 200 - Centro', 'Rio de Janeiro', 400, TRUE),
('Casa de Espetáculos', 'Casa de shows intimista', 'Rua da Música, 50 - Copacabana', 'Rio de Janeiro', 150, TRUE);

-- Insert eventos
INSERT INTO eventos (titulo, descricao, categoria, cidade, local, endereco, data_hora, duracao_min, preco, total_tickets, tickets_available, imagem_url, espaco_id, ativo) VALUES 
('Hamlet - A Tragédia do Príncipe', 'Adaptação moderna da obra clássica de Shakespeare', 'Teatro', 'São Paulo', 'Teatro Municipal', 'Praça da República, 1 - Centro', '2024-02-15 20:00:00', 180, 80.00, 500, 500, 'https://example.com/hamlet.jpg', 1, TRUE),
('O Mágico de Oz', 'Musical infantil baseado no clássico', 'Musical', 'São Paulo', 'Casa de Cultura', 'Rua das Artes, 100 - Vila Madalena', '2024-02-20 15:00:00', 120, 50.00, 200, 200, 'https://example.com/oz.jpg', 2, TRUE),
('Romeu e Julieta', 'Romance trágico de Shakespeare', 'Teatro', 'São Paulo', 'Teatro do Sesc', 'Rua Clélia, 93 - Pompeia', '2024-02-25 19:30:00', 150, 70.00, 300, 300, 'https://example.com/romeu.jpg', 3, TRUE),
('A Bela e a Fera', 'Musical da Disney', 'Musical', 'Rio de Janeiro', 'Teatro Rio Branco', 'Av. Rio Branco, 200 - Centro', '2024-03-01 20:00:00', 160, 90.00, 400, 400, 'https://example.com/bela.jpg', 4, TRUE),
('Stand-up Comedy Night', 'Noite de comédia com diversos artistas', 'Comédia', 'Rio de Janeiro', 'Casa de Espetáculos', 'Rua da Música, 50 - Copacabana', '2024-03-05 21:00:00', 90, 40.00, 150, 150, 'https://example.com/comedy.jpg', 5, TRUE),
('O Fantasma da Ópera', 'Musical clássico', 'Musical', 'São Paulo', 'Teatro Municipal', 'Praça da República, 1 - Centro', '2024-03-10 20:00:00', 200, 120.00, 500, 500, 'https://example.com/fantasma.jpg', 1, TRUE),
('Dança Contemporânea', 'Apresentação de dança moderna', 'Dança', 'São Paulo', 'Casa de Cultura', 'Rua das Artes, 100 - Vila Madalena', '2024-03-15 19:00:00', 90, 60.00, 200, 200, 'https://example.com/danca.jpg', 2, TRUE),
('Concerto de Orquestra', 'Concerto sinfônico', 'Música', 'Rio de Janeiro', 'Teatro Rio Branco', 'Av. Rio Branco, 200 - Centro', '2024-03-20 20:30:00', 120, 100.00, 400, 400, 'https://example.com/orquestra.jpg', 4, TRUE);

-- Insert FAQs
INSERT INTO faq (pergunta, resposta, tags, categoria, ordem, ativo) VALUES 
('Como comprar ingressos?', 'Para comprar ingressos, você precisa criar uma conta, fazer login e selecionar o evento desejado. Clique em "Comprar" e siga as instruções.', 'compra, ingressos, como', 'Compra', 1, TRUE),
('Posso cancelar minha compra?', 'Sim, você pode cancelar sua compra até 24 horas antes do evento. O reembolso será processado em até 5 dias úteis.', 'cancelamento, reembolso, política', 'Cancelamento', 2, TRUE),
('Como recebo meus ingressos?', 'Após a compra, você receberá um email com seus ingressos e um código QR. Também pode acessar seus ingressos na área "Minhas Compras".', 'ingressos, email, QR', 'Ingressos', 3, TRUE),
('Posso transferir meus ingressos?', 'Não é possível transferir ingressos para outras pessoas. Cada ingresso é pessoal e intransferível.', 'transferência, pessoal', 'Ingressos', 4, TRUE),
('O que acontece se o evento for cancelado?', 'Se o evento for cancelado, todos os ingressos serão reembolsados automaticamente em até 10 dias úteis.', 'cancelamento, evento, reembolso', 'Eventos', 5, TRUE),
('Como altero meus dados pessoais?', 'Acesse sua área "Perfil" e clique em "Editar". Você pode alterar nome, telefone e outros dados pessoais.', 'perfil, dados, alterar', 'Conta', 6, TRUE),
('Esqueci minha senha, como recuperar?', 'Na tela de login, clique em "Esqueci minha senha" e informe seu email. Você receberá um link para criar uma nova senha.', 'senha, recuperar, esqueci', 'Conta', 7, TRUE),
('Quais formas de pagamento são aceitas?', 'Aceitamos cartões de crédito (Visa, Mastercard, Elo) e PIX. Em breve também aceitaremos boleto bancário.', 'pagamento, cartão, PIX', 'Pagamento', 8, TRUE),
('Posso comprar ingressos para outras pessoas?', 'Sim, você pode comprar múltiplos ingressos na mesma compra. Cada pessoa precisará apresentar um documento de identificação.', 'múltiplos, pessoas, documento', 'Compra', 9, TRUE),
('Como funciona o sistema de filas?', 'Para eventos com alta demanda, utilizamos um sistema de fila virtual. Você será notificado quando for sua vez de comprar.', 'fila, demanda, notificação', 'Sistema', 10, TRUE);
