namespace Coletas.Domain.Entities;

/// <summary>
/// Veículo que pode ser atribuído a uma coleta para execução.
/// </summary>
public class Veiculo
{
    public int Id { get; set; }
    public string Placa { get; set; } = string.Empty;
    public string Modelo { get; set; } = string.Empty;

    /// <summary>Capacidade de carga em quilogramas.</summary>
    public decimal CapacidadeKg { get; set; }

    public bool Ativo { get; set; } = true;

    public ICollection<Coleta> Coletas { get; set; } = new List<Coleta>();
}
