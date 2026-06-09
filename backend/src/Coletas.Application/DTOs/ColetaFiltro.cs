using Coletas.Domain.Enums;

namespace Coletas.Application.DTOs;

/// <summary>
/// Filtros e parâmetros de paginação para a listagem de coletas (tela de
/// acompanhamento operacional).
/// </summary>
public class ColetaFiltro
{
    public StatusColeta? Status { get; set; }
    public string? Cliente { get; set; }
    public Prioridade? Prioridade { get; set; }

    /// <summary>Data inicial do período (filtra por DataColeta).</summary>
    public DateTime? DataInicial { get; set; }

    /// <summary>Data final do período (filtra por DataColeta).</summary>
    public DateTime? DataFinal { get; set; }

    public int Pagina { get; set; } = 1;
    public int TamanhoPagina { get; set; } = 10;
}
