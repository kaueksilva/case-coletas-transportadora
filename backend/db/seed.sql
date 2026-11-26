-- Massa de dados inicial (seed) para o sistema de Gestão de Coletas.
-- Observação: a aplicação também executa este seed automaticamente na primeira
-- inicialização (ver DbInitializer). Use este script para popular o banco
-- manualmente, caso execute apenas o MySQL sem subir a API.
--
-- Senhas dos usuários (hash BCrypt):
--   admin@coletas.com    -> Admin@123
--   operador@coletas.com -> Operador@123

USE `coletas`;

-- ----- Usuários -----
INSERT INTO `usuarios` (`Nome`, `Email`, `SenhaHash`, `Perfil`, `CriadoEm`) VALUES
  ('Administrador',      'admin@coletas.com',    '$2a$11$L36hECd6WaMmBaqtZsrvDeIVMJAVtIvTs.iB5xA2L5CsmLtTJvzPi', 'Admin',    UTC_TIMESTAMP()),
  ('Operador Logística', 'operador@coletas.com', '$2a$11$PPnVzV3o3Dt2lih8/FqZQ.W5SmKLfamLijftUUpb2F569mU4C.bB2', 'Operador', UTC_TIMESTAMP());

-- ----- Motoristas -----
INSERT INTO `motoristas` (`Nome`, `Cnh`, `Telefone`, `Ativo`) VALUES
  ('Carlos Pereira', '12345678901', '(11) 99999-0001', 1),
  ('Ana Souza',      '23456789012', '(11) 99999-0002', 1),
  ('João Lima',      '34567890123', '(11) 99999-0003', 1);

-- ----- Veículos -----
INSERT INTO `veiculos` (`Placa`, `Modelo`, `CapacidadeKg`, `Ativo`) VALUES
  ('ABC1D23', 'Mercedes Sprinter', 1500.00, 1),
  ('EFG4H56', 'Iveco Daily',       3500.00, 1),
  ('IJK7L89', 'Fiat Fiorino',       650.00, 1);

-- ----- Coletas -----
-- Status: 1=Aberta, 2=EmColeta, 3=Coletada, 4=Cancelada
-- Prioridade: 1=Baixa, 2=Média, 3=Alta
INSERT INTO `coletas`
  (`Numero`, `Cliente`, `RemetenteNome`, `RemetenteEndereco`, `DestinatarioNome`, `DestinatarioEndereco`,
   `DataColeta`, `Prioridade`, `Observacoes`, `Status`, `MotoristaId`, `VeiculoId`, `CriadoEm`, `AtualizadoEm`)
VALUES
  ('COL-2026-0001', 'Indústria Alfa Ltda', 'Depósito Central Alfa', 'Rua das Indústrias, 100 - São Paulo/SP',
   'Centro de Distribuição Norte', 'Av. Brasil, 2000 - Guarulhos/SP',
   DATE_ADD(UTC_TIMESTAMP(), INTERVAL 1 DAY), 3, 'Carga frágil. Necessário cuidado no manuseio.', 1, NULL, NULL, UTC_TIMESTAMP(), UTC_TIMESTAMP()),

  ('COL-2026-0002', 'Comercial Beta S.A.', 'Loja Beta Centro', 'Rua XV de Novembro, 50 - Campinas/SP',
   'Filial Beta Litoral', 'Av. Beira Mar, 300 - Santos/SP',
   DATE_ADD(UTC_TIMESTAMP(), INTERVAL 2 DAY), 2, NULL, 1, NULL, NULL, UTC_TIMESTAMP(), UTC_TIMESTAMP()),

  ('COL-2026-0003', 'Indústria Alfa Ltda', 'Unidade Fabril Alfa II', 'Rod. Anhanguera, km 30 - Jundiaí/SP',
   'Cliente Final - Mercado Sul', 'Rua do Comércio, 800 - Sorocaba/SP',
   DATE_ADD(UTC_TIMESTAMP(), INTERVAL 10 HOUR), 3, 'Coleta agendada com a portaria.', 2, 1, 1, UTC_TIMESTAMP(), UTC_TIMESTAMP()),

  ('COL-2026-0004', 'Distribuidora Gama', 'CD Gama', 'Av. das Nações, 1200 - Osasco/SP',
   'Varejo Gama Express', 'Rua Sete, 45 - Barueri/SP',
   DATE_SUB(UTC_TIMESTAMP(), INTERVAL 1 DAY), 2, NULL, 3, 2, 2, UTC_TIMESTAMP(), UTC_TIMESTAMP()),

  ('COL-2026-0005', 'Comercial Beta S.A.', 'Loja Beta Norte', 'Av. Norte, 999 - São Paulo/SP',
   'Filial Beta Oeste', 'Rua Oeste, 12 - Osasco/SP',
   DATE_SUB(UTC_TIMESTAMP(), INTERVAL 2 DAY), 1, 'Cancelada a pedido do cliente.', 4, NULL, NULL, UTC_TIMESTAMP(), UTC_TIMESTAMP());

-- ----- Ocorrências (rastreabilidade: data, hora e responsável) -----
INSERT INTO `ocorrencias` (`ColetaId`, `Descricao`, `DataHora`, `RegistradoPor`) VALUES
  (3, 'Remetente não localizado no primeiro contato.', UTC_TIMESTAMP(), 'Operador Logística'),
  (4, 'Endereço confirmado com sucesso na chegada.',   UTC_TIMESTAMP(), 'Operador Logística');
