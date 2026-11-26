using Coletas.Application.DTOs;

namespace Coletas.Application.Services;

public interface IMotoristaService
{
    Task<IReadOnlyList<MotoristaResponse>> ListarAsync(CancellationToken ct = default);
    Task<MotoristaResponse> CriarAsync(CriarMotoristaRequest request, CancellationToken ct = default);
}

public interface IVeiculoService
{
    Task<IReadOnlyList<VeiculoResponse>> ListarAsync(CancellationToken ct = default);
    Task<VeiculoResponse> CriarAsync(CriarVeiculoRequest request, CancellationToken ct = default);
}
