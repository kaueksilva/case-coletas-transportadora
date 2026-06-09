using Coletas.Application.Common;
using Coletas.Application.DTOs;
using Coletas.Application.Mapeamentos;
using Coletas.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Coletas.Application.Services;

public class VeiculoService : IVeiculoService
{
    private readonly IAppDbContext _db;

    public VeiculoService(IAppDbContext db) => _db = db;

    public async Task<IReadOnlyList<VeiculoResponse>> ListarAsync(CancellationToken ct = default)
    {
        var veiculos = await _db.Veiculos
            .AsNoTracking()
            .OrderBy(v => v.Placa)
            .ToListAsync(ct);
        return veiculos.Select(v => v.ParaResponse()).ToList();
    }

    public async Task<VeiculoResponse> CriarAsync(CriarVeiculoRequest request, CancellationToken ct = default)
    {
        var veiculo = new Veiculo
        {
            Placa = request.Placa.Trim().ToUpperInvariant(),
            Modelo = request.Modelo.Trim(),
            CapacidadeKg = request.CapacidadeKg
        };

        _db.Veiculos.Add(veiculo);
        await _db.SaveChangesAsync(ct);
        return veiculo.ParaResponse();
    }
}
