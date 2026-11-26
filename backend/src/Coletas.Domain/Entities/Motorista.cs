namespace Coletas.Domain.Entities;

/// <summary>
/// Motorista que pode ser atribuído a uma coleta para execução.
/// </summary>
public class Motorista
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;

    /// <summary>Número da CNH do motorista.</summary>
    public string Cnh { get; set; } = string.Empty;

    public string? Telefone { get; set; }
    public bool Ativo { get; set; } = true;

    public ICollection<Coleta> Coletas { get; set; } = new List<Coleta>();
}
