using Coletas.Application.Common;
using Coletas.Application.DTOs;

namespace Coletas.Application.Services;

public interface IColetaService
{
    Task<PagedResult<ColetaResponse>> ListarAsync(ColetaFiltro filtro, CancellationToken ct = default);
    Task<ColetaResponse> ObterPorIdAsync(int id, CancellationToken ct = default);
    Task<ColetaResponse> CriarAsync(CriarColetaRequest request, CancellationToken ct = default);
    Task<ColetaResponse> AtualizarAsync(int id, AtualizarColetaRequest request, CancellationToken ct = default);

    Task<ColetaResponse> AtribuirRecursosAsync(int id, AtribuirRecursosRequest request, CancellationToken ct = default);
    Task<ColetaResponse> MarcarComoColetadaAsync(int id, CancellationToken ct = default);
    Task<ColetaResponse> CancelarAsync(int id, CancellationToken ct = default);

    Task<OcorrenciaResponse> RegistrarOcorrenciaAsync(int id, CriarOcorrenciaRequest request, CancellationToken ct = default);
}
