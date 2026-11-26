using Coletas.Application.Common;
using Coletas.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace Coletas.Infrastructure.Persistence;

public class AppDbContext : DbContext, IAppDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Coleta> Coletas => Set<Coleta>();
    public DbSet<Motorista> Motoristas => Set<Motorista>();
    public DbSet<Veiculo> Veiculos => Set<Veiculo>();
    public DbSet<Ocorrencia> Ocorrencias => Set<Ocorrencia>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}
