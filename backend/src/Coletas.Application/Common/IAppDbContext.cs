using Coletas.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Coletas.Application.Common;

/// <summary>
/// Abstração do contexto de dados, permitindo que a camada de aplicação use o
/// EF Core sem depender diretamente da implementação concreta (Infrastructure).
/// </summary>
public interface IAppDbContext
{
    DbSet<Usuario> Usuarios { get; }
    DbSet<Coleta> Coletas { get; }
    DbSet<Motorista> Motoristas { get; }
    DbSet<Veiculo> Veiculos { get; }
    DbSet<Ocorrencia> Ocorrencias { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
