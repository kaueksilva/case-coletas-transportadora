using Coletas.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Coletas.Infrastructure.Persistence.Configurations;

public class ColetaConfiguration : IEntityTypeConfiguration<Coleta>
{
    public void Configure(EntityTypeBuilder<Coleta> builder)
    {
        builder.ToTable("coletas");
        builder.HasKey(c => c.Id);

        builder.Property(c => c.Numero).IsRequired().HasMaxLength(30);
        builder.HasIndex(c => c.Numero).IsUnique();

        builder.Property(c => c.Cliente).IsRequired().HasMaxLength(150);
        builder.Property(c => c.RemetenteNome).IsRequired().HasMaxLength(150);
        builder.Property(c => c.RemetenteEndereco).IsRequired().HasMaxLength(300);
        builder.Property(c => c.DestinatarioNome).IsRequired().HasMaxLength(150);
        builder.Property(c => c.DestinatarioEndereco).IsRequired().HasMaxLength(300);
        builder.Property(c => c.Observacoes).HasMaxLength(1000);

        builder.Property(c => c.Status).HasConversion<int>().IsRequired();
        builder.Property(c => c.Prioridade).HasConversion<int>().IsRequired();

        builder.HasIndex(c => c.Status);
        builder.HasIndex(c => c.Cliente);
        builder.HasIndex(c => c.DataColeta);

        builder.HasOne(c => c.Motorista)
            .WithMany(m => m.Coletas)
            .HasForeignKey(c => c.MotoristaId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(c => c.Veiculo)
            .WithMany(v => v.Coletas)
            .HasForeignKey(c => c.VeiculoId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(c => c.Ocorrencias)
            .WithOne(o => o.Coleta!)
            .HasForeignKey(o => o.ColetaId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
