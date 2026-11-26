using Coletas.Application.Common;
using Coletas.Domain.Entities;
using Coletas.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Coletas.Infrastructure.Persistence;

/// <summary>
/// Aplica as migrations e popula o banco com massa de dados inicial (seed),
/// caso ainda esteja vazio.
/// </summary>
public static class DbInitializer
{
    public static async Task InicializarAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var sp = scope.ServiceProvider;
        var db = sp.GetRequiredService<AppDbContext>();
        var hasher = sp.GetRequiredService<IPasswordHasher>();
        var logger = sp.GetRequiredService<ILogger<AppDbContext>>();

        logger.LogInformation("Aplicando migrations do banco de dados...");
        await db.Database.MigrateAsync();

        if (await db.Usuarios.AnyAsync())
        {
            logger.LogInformation("Banco já possui dados. Seed ignorado.");
            return;
        }

        logger.LogInformation("Populando banco com massa de dados inicial (seed)...");

        var admin = new Usuario
        {
            Nome = "Administrador",
            Email = "admin@coletas.com",
            SenhaHash = hasher.Hash("Admin@123"),
            Perfil = "Admin"
        };
        var operador = new Usuario
        {
            Nome = "Operador Logística",
            Email = "operador@coletas.com",
            SenhaHash = hasher.Hash("Operador@123"),
            Perfil = "Operador"
        };
        db.Usuarios.AddRange(admin, operador);

        var motoristas = new List<Motorista>
        {
            new() { Nome = "Carlos Pereira", Cnh = "12345678901", Telefone = "(11) 99999-0001" },
            new() { Nome = "Ana Souza", Cnh = "23456789012", Telefone = "(11) 99999-0002" },
            new() { Nome = "João Lima", Cnh = "34567890123", Telefone = "(11) 99999-0003" }
        };
        var veiculos = new List<Veiculo>
        {
            new() { Placa = "ABC1D23", Modelo = "Mercedes Sprinter", CapacidadeKg = 1500 },
            new() { Placa = "EFG4H56", Modelo = "Iveco Daily", CapacidadeKg = 3500 },
            new() { Placa = "IJK7L89", Modelo = "Fiat Fiorino", CapacidadeKg = 650 }
        };
        db.Motoristas.AddRange(motoristas);
        db.Veiculos.AddRange(veiculos);
        await db.SaveChangesAsync();

        var hoje = DateTime.UtcNow.Date;
        var ano = DateTime.UtcNow.Year;
        var seq = 1;
        string ProximoNumero() => $"COL-{ano}-{seq++:D4}";

        // 1) Coleta aberta, prioridade alta
        var c1 = new Coleta
        {
            Numero = ProximoNumero(),
            Cliente = "Indústria Alfa Ltda",
            RemetenteNome = "Depósito Central Alfa",
            RemetenteEndereco = "Rua das Indústrias, 100 - São Paulo/SP",
            DestinatarioNome = "Centro de Distribuição Norte",
            DestinatarioEndereco = "Av. Brasil, 2000 - Guarulhos/SP",
            DataColeta = hoje.AddDays(1).AddHours(9),
            Prioridade = Prioridade.Alta,
            Observacoes = "Carga frágil. Necessário cuidado no manuseio."
        };

        // 2) Coleta aberta, prioridade média
        var c2 = new Coleta
        {
            Numero = ProximoNumero(),
            Cliente = "Comercial Beta S.A.",
            RemetenteNome = "Loja Beta Centro",
            RemetenteEndereco = "Rua XV de Novembro, 50 - Campinas/SP",
            DestinatarioNome = "Filial Beta Litoral",
            DestinatarioEndereco = "Av. Beira Mar, 300 - Santos/SP",
            DataColeta = hoje.AddDays(2).AddHours(14),
            Prioridade = Prioridade.Media
        };

        // 3) Coleta em coleta (com motorista e veículo)
        var c3 = new Coleta
        {
            Numero = ProximoNumero(),
            Cliente = "Indústria Alfa Ltda",
            RemetenteNome = "Unidade Fabril Alfa II",
            RemetenteEndereco = "Rod. Anhanguera, km 30 - Jundiaí/SP",
            DestinatarioNome = "Cliente Final - Mercado Sul",
            DestinatarioEndereco = "Rua do Comércio, 800 - Sorocaba/SP",
            DataColeta = hoje.AddHours(10),
            Prioridade = Prioridade.Alta,
            Observacoes = "Coleta agendada com a portaria."
        };
        c3.AtribuirMotoristaEVeiculo(motoristas[0].Id, veiculos[0].Id);

        // 4) Coleta concluída (coletada)
        var c4 = new Coleta
        {
            Numero = ProximoNumero(),
            Cliente = "Distribuidora Gama",
            RemetenteNome = "CD Gama",
            RemetenteEndereco = "Av. das Nações, 1200 - Osasco/SP",
            DestinatarioNome = "Varejo Gama Express",
            DestinatarioEndereco = "Rua Sete, 45 - Barueri/SP",
            DataColeta = hoje.AddDays(-1).AddHours(8),
            Prioridade = Prioridade.Media
        };
        c4.AtribuirMotoristaEVeiculo(motoristas[1].Id, veiculos[1].Id);
        c4.MarcarComoColetada();

        // 5) Coleta cancelada
        var c5 = new Coleta
        {
            Numero = ProximoNumero(),
            Cliente = "Comercial Beta S.A.",
            RemetenteNome = "Loja Beta Norte",
            RemetenteEndereco = "Av. Norte, 999 - São Paulo/SP",
            DestinatarioNome = "Filial Beta Oeste",
            DestinatarioEndereco = "Rua Oeste, 12 - Osasco/SP",
            DataColeta = hoje.AddDays(-2).AddHours(11),
            Prioridade = Prioridade.Baixa,
            Observacoes = "Cancelada a pedido do cliente."
        };
        c5.Cancelar();

        db.Coletas.AddRange(c1, c2, c3, c4, c5);
        await db.SaveChangesAsync();

        // Ocorrências de exemplo (rastreabilidade)
        c3.RegistrarOcorrencia("Remetente não localizado no primeiro contato.", operador.Nome);
        c4.RegistrarOcorrencia("Endereço confirmado com sucesso na chegada.", operador.Nome);
        await db.SaveChangesAsync();

        logger.LogInformation("Seed concluído com sucesso.");
    }
}
