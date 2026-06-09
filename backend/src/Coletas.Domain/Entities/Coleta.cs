using Coletas.Domain.Enums;
using Coletas.Domain.Exceptions;

namespace Coletas.Domain.Entities;

/// <summary>
/// Solicitação de coleta. Concentra as regras de negócio de transição de status,
/// garantindo que estados finais (Coletada/Cancelada) não retornem ao fluxo ativo
/// e que uma coleta só seja concluída com motorista e veículo vinculados.
/// </summary>
public class Coleta
{
    public int Id { get; set; }

    /// <summary>Número de identificação único e legível (ex.: COL-2026-0001).</summary>
    public string Numero { get; set; } = string.Empty;

    /// <summary>Cliente ao qual a solicitação pertence.</summary>
    public string Cliente { get; set; } = string.Empty;

    public string RemetenteNome { get; set; } = string.Empty;
    public string RemetenteEndereco { get; set; } = string.Empty;
    public string DestinatarioNome { get; set; } = string.Empty;
    public string DestinatarioEndereco { get; set; } = string.Empty;

    /// <summary>Data/hora prevista para a retirada da carga.</summary>
    public DateTime DataColeta { get; set; }

    public Prioridade Prioridade { get; set; } = Prioridade.Media;
    public string? Observacoes { get; set; }

    public StatusColeta Status { get; private set; } = StatusColeta.Aberta;

    public int? MotoristaId { get; private set; }
    public Motorista? Motorista { get; private set; }

    public int? VeiculoId { get; private set; }
    public Veiculo? Veiculo { get; private set; }

    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
    public DateTime AtualizadoEm { get; set; } = DateTime.UtcNow;

    public ICollection<Ocorrencia> Ocorrencias { get; set; } = new List<Ocorrencia>();

    /// <summary>
    /// Atribui motorista e veículo à coleta. A partir da atribuição a coleta
    /// avança para o status <see cref="StatusColeta.EmColeta"/>.
    /// </summary>
    public void AtribuirMotoristaEVeiculo(int motoristaId, int veiculoId)
    {
        if (Status is StatusColeta.Cancelada)
            throw new RegraDeNegocioException("Não é possível atribuir motorista/veículo a uma coleta cancelada.");

        if (Status is StatusColeta.Coletada)
            throw new RegraDeNegocioException("Não é possível alterar uma coleta já coletada.");

        MotoristaId = motoristaId;
        VeiculoId = veiculoId;
        Status = StatusColeta.EmColeta;
        AtualizadoEm = DateTime.UtcNow;
    }

    /// <summary>
    /// Marca a coleta como coletada. Exige motorista e veículo vinculados e que a
    /// coleta esteja em execução (EmColeta).
    /// </summary>
    public void MarcarComoColetada()
    {
        if (Status is StatusColeta.Cancelada)
            throw new RegraDeNegocioException("Uma coleta cancelada não pode ser marcada como coletada.");

        if (Status is StatusColeta.Coletada)
            throw new RegraDeNegocioException("A coleta já está marcada como coletada.");

        if (MotoristaId is null || VeiculoId is null)
            throw new RegraDeNegocioException("Não é permitido marcar como coletada sem motorista e veículo vinculados.");

        if (Status is not StatusColeta.EmColeta)
            throw new RegraDeNegocioException("Somente coletas em execução (Em Coleta) podem ser marcadas como coletadas.");

        Status = StatusColeta.Coletada;
        AtualizadoEm = DateTime.UtcNow;
    }

    /// <summary>
    /// Cancela a coleta. Estados finais (Coletada/Cancelada) não podem ser cancelados.
    /// </summary>
    public void Cancelar()
    {
        if (Status is StatusColeta.Coletada)
            throw new RegraDeNegocioException("Uma coleta já coletada não pode ser cancelada.");

        if (Status is StatusColeta.Cancelada)
            throw new RegraDeNegocioException("A coleta já está cancelada.");

        Status = StatusColeta.Cancelada;
        AtualizadoEm = DateTime.UtcNow;
    }

    /// <summary>Registra uma ocorrência vinculada a esta coleta.</summary>
    public Ocorrencia RegistrarOcorrencia(string descricao, string registradoPor)
    {
        if (string.IsNullOrWhiteSpace(descricao))
            throw new RegraDeNegocioException("A descrição da ocorrência é obrigatória.");

        if (string.IsNullOrWhiteSpace(registradoPor))
            throw new RegraDeNegocioException("O responsável pelo registro da ocorrência é obrigatório.");

        var ocorrencia = new Ocorrencia
        {
            ColetaId = Id,
            Descricao = descricao,
            RegistradoPor = registradoPor,
            DataHora = DateTime.UtcNow
        };
        Ocorrencias.Add(ocorrencia);
        AtualizadoEm = DateTime.UtcNow;
        return ocorrencia;
    }

    /// <summary>
    /// Define o status diretamente. Uso restrito à camada de persistência
    /// (reconstrução de entidades). Não aplica regras de negócio.
    /// </summary>
    public void DefinirStatusInterno(StatusColeta status) => Status = status;
}
