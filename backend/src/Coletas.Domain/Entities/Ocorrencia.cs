namespace Coletas.Domain.Entities;

/// <summary>
/// Registro de uma ocorrência durante a execução de uma coleta (ex.: remetente
/// ausente, endereço incorreto). Guarda data, hora e o responsável pelo registro
/// para garantir rastreabilidade.
/// </summary>
public class Ocorrencia
{
    public int Id { get; set; }

    public int ColetaId { get; set; }
    public Coleta? Coleta { get; set; }

    public string Descricao { get; set; } = string.Empty;

    /// <summary>Data e hora em que a ocorrência foi registrada (UTC).</summary>
    public DateTime DataHora { get; set; } = DateTime.UtcNow;

    /// <summary>Identificação do usuário responsável pelo registro.</summary>
    public string RegistradoPor { get; set; } = string.Empty;
}
