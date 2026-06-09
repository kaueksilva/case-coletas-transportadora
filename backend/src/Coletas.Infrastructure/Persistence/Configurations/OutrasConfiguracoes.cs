using Coletas.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Coletas.Infrastructure.Persistence.Configurations;

public class UsuarioConfiguration : IEntityTypeConfiguration<Usuario>
{
    public void Configure(EntityTypeBuilder<Usuario> builder)
    {
        builder.ToTable("usuarios");
        builder.HasKey(u => u.Id);
        builder.Property(u => u.Nome).IsRequired().HasMaxLength(150);
        builder.Property(u => u.Email).IsRequired().HasMaxLength(150);
        builder.HasIndex(u => u.Email).IsUnique();
        builder.Property(u => u.SenhaHash).IsRequired().HasMaxLength(300);
        builder.Property(u => u.Perfil).IsRequired().HasMaxLength(50);
    }
}

public class MotoristaConfiguration : IEntityTypeConfiguration<Motorista>
{
    public void Configure(EntityTypeBuilder<Motorista> builder)
    {
        builder.ToTable("motoristas");
        builder.HasKey(m => m.Id);
        builder.Property(m => m.Nome).IsRequired().HasMaxLength(150);
        builder.Property(m => m.Cnh).IsRequired().HasMaxLength(20);
        builder.Property(m => m.Telefone).HasMaxLength(20);
    }
}

public class VeiculoConfiguration : IEntityTypeConfiguration<Veiculo>
{
    public void Configure(EntityTypeBuilder<Veiculo> builder)
    {
        builder.ToTable("veiculos");
        builder.HasKey(v => v.Id);
        builder.Property(v => v.Placa).IsRequired().HasMaxLength(10);
        builder.HasIndex(v => v.Placa).IsUnique();
        builder.Property(v => v.Modelo).IsRequired().HasMaxLength(100);
        builder.Property(v => v.CapacidadeKg).HasPrecision(10, 2);
    }
}

public class OcorrenciaConfiguration : IEntityTypeConfiguration<Ocorrencia>
{
    public void Configure(EntityTypeBuilder<Ocorrencia> builder)
    {
        builder.ToTable("ocorrencias");
        builder.HasKey(o => o.Id);
        builder.Property(o => o.Descricao).IsRequired().HasMaxLength(1000);
        builder.Property(o => o.RegistradoPor).IsRequired().HasMaxLength(150);
        builder.Property(o => o.DataHora).IsRequired();
    }
}
