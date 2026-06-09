namespace Coletas.Application.Common;

/// <summary>Resultado paginado genérico retornado pelas consultas de listagem.</summary>
public class PagedResult<T>
{
    public IReadOnlyList<T> Itens { get; init; } = Array.Empty<T>();
    public int Pagina { get; init; }
    public int TamanhoPagina { get; init; }
    public int TotalItens { get; init; }
    public int TotalPaginas => TamanhoPagina > 0
        ? (int)Math.Ceiling(TotalItens / (double)TamanhoPagina)
        : 0;

    public PagedResult() { }

    public PagedResult(IReadOnlyList<T> itens, int totalItens, int pagina, int tamanhoPagina)
    {
        Itens = itens;
        TotalItens = totalItens;
        Pagina = pagina;
        TamanhoPagina = tamanhoPagina;
    }
}
