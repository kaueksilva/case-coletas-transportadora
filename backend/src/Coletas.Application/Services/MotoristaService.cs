using Coletas.Application.Common;
using Coletas.Application.DTOs;
using Coletas.Application.Mapeamentos;
using Coletas.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Coletas.Application.Services;

public class MotoristaService : IMotoristaService
{
    private readonly IAppDbContext _db;

    public MotoristaService(IAppDbContext db) => _db = db;

    public async Task<IReadOnlyList<MotoristaResponse>> ListarAsync(CancellationToken ct = default)
    {
        var motoristas = await _db.Motoristas
            .AsNoTracking()
            .OrderBy(m => m.Nome)
            .ToListAsync(ct);
        return motoristas.Select(m => m.ParaResponse()).ToList();
    }

    public async Task<MotoristaResponse> CriarAsync(CriarMotoristaRequest request, CancellationToken ct = default)
    {
        var motorista = new Motorista
        {
            Nome = request.Nome.Trim(),
            Cnh = request.Cnh.Trim(),
            Telefone = request.Telefone?.Trim()
        };

        _db.Motoristas.Add(motorista);
        await _db.SaveChangesAsync(ct);
        return motorista.ParaResponse();
    }
}
