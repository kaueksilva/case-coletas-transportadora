using Coletas.Application.Common;
using Coletas.Application.DTOs;
using Coletas.Application.Mapeamentos;
using Coletas.Domain.Entities;
using Coletas.Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace Coletas.Application.Services;

public class ColetaService : IColetaService
{
    private readonly IAppDbContext _db;
    private readonly IUsuarioAtual _usuarioAtual;

    public ColetaService(IAppDbContext db, IUsuarioAtual usuarioAtual)
    {
        _db = db;
        _usuarioAtual = usuarioAtual;
    }

    public async Task<PagedResult<ColetaResponse>> ListarAsync(ColetaFiltro filtro, CancellationToken ct = default)
    {
        var pagina = filtro.Pagina < 1 ? 1 : filtro.Pagina;
        var tamanho = filtro.TamanhoPagina is < 1 or > 100 ? 10 : filtro.TamanhoPagina;

        var query = _db.Coletas
            .AsNoTracking()
            .Include(c => c.Motorista)
            .Include(c => c.Veiculo)
            .Include(c => c.Ocorrencias)
            .AsQueryable();

        if (filtro.Status is not null)
            query = query.Where(c => c.Status == filtro.Status);

        if (!string.IsNullOrWhiteSpace(filtro.Cliente))
        {
            var cliente = filtro.Cliente.Trim();
            query = query.Where(c => c.Cliente.Contains(cliente));
        }

        if (filtro.Prioridade is not null)
            query = query.Where(c => c.Prioridade == filtro.Prioridade);

        if (filtro.DataInicial is not null)
            query = query.Where(c => c.DataColeta >= filtro.DataInicial);

        if (filtro.DataFinal is not null)
            query = query.Where(c => c.DataColeta <= filtro.DataFinal);

        var total = await query.CountAsync(ct);

        var itens = await query
            // Prioridade alta primeiro, depois coletas mais recentes.
            .OrderByDescending(c => c.Prioridade)
            .ThenByDescending(c => c.DataColeta)
            .Skip((pagina - 1) * tamanho)
            .Take(tamanho)
            .ToListAsync(ct);

        var responses = itens.Select(c => c.ParaResponse()).ToList();
        return new PagedResult<ColetaResponse>(responses, total, pagina, tamanho);
    }

    public async Task<ColetaResponse> ObterPorIdAsync(int id, CancellationToken ct = default)
    {
        var coleta = await CarregarColetaAsync(id, ct);
        return coleta.ParaResponse();
    }

    public async Task<ColetaResponse> CriarAsync(CriarColetaRequest request, CancellationToken ct = default)
    {
        var coleta = new Coleta
        {
            Cliente = request.Cliente.Trim(),
            RemetenteNome = request.RemetenteNome.Trim(),
            RemetenteEndereco = request.RemetenteEndereco.Trim(),
            DestinatarioNome = request.DestinatarioNome.Trim(),
            DestinatarioEndereco = request.DestinatarioEndereco.Trim(),
            DataColeta = request.DataColeta,
            Prioridade = request.Prioridade,
            Observacoes = request.Observacoes?.Trim(),
            Numero = await GerarNumeroAsync(ct)
        };

        _db.Coletas.Add(coleta);
        await _db.SaveChangesAsync(ct);

        return coleta.ParaResponse();
    }

    public async Task<ColetaResponse> AtualizarAsync(int id, AtualizarColetaRequest request, CancellationToken ct = default)
    {
        var coleta = await CarregarColetaAsync(id, ct);

        coleta.Cliente = request.Cliente.Trim();
        coleta.RemetenteNome = request.RemetenteNome.Trim();
        coleta.RemetenteEndereco = request.RemetenteEndereco.Trim();
        coleta.DestinatarioNome = request.DestinatarioNome.Trim();
        coleta.DestinatarioEndereco = request.DestinatarioEndereco.Trim();
        coleta.DataColeta = request.DataColeta;
        coleta.Prioridade = request.Prioridade;
        coleta.Observacoes = request.Observacoes?.Trim();
        coleta.AtualizadoEm = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);
        return coleta.ParaResponse();
    }

    public async Task<ColetaResponse> AtribuirRecursosAsync(int id, AtribuirRecursosRequest request, CancellationToken ct = default)
    {
        var coleta = await CarregarColetaAsync(id, ct);

        var motorista = await _db.Motoristas.FirstOrDefaultAsync(m => m.Id == request.MotoristaId, ct)
            ?? throw new RecursoNaoEncontradoException($"Motorista {request.MotoristaId} não encontrado.");
        var veiculo = await _db.Veiculos.FirstOrDefaultAsync(v => v.Id == request.VeiculoId, ct)
            ?? throw new RecursoNaoEncontradoException($"Veículo {request.VeiculoId} não encontrado.");

        coleta.AtribuirMotoristaEVeiculo(motorista.Id, veiculo.Id);
        await _db.SaveChangesAsync(ct);

        return (await CarregarColetaAsync(id, ct)).ParaResponse();
    }

    public async Task<ColetaResponse> MarcarComoColetadaAsync(int id, CancellationToken ct = default)
    {
        var coleta = await CarregarColetaAsync(id, ct);
        coleta.MarcarComoColetada();
        await _db.SaveChangesAsync(ct);
        return coleta.ParaResponse();
    }

    public async Task<ColetaResponse> CancelarAsync(int id, CancellationToken ct = default)
    {
        var coleta = await CarregarColetaAsync(id, ct);
        coleta.Cancelar();
        await _db.SaveChangesAsync(ct);
        return coleta.ParaResponse();
    }

    public async Task<OcorrenciaResponse> RegistrarOcorrenciaAsync(int id, CriarOcorrenciaRequest request, CancellationToken ct = default)
    {
        var coleta = await CarregarColetaAsync(id, ct);

        var responsavel = _usuarioAtual.Nome ?? _usuarioAtual.Email ?? "desconhecido";
        var ocorrencia = coleta.RegistrarOcorrencia(request.Descricao.Trim(), responsavel);

        await _db.SaveChangesAsync(ct);
        return ocorrencia.ParaResponse();
    }

    private async Task<Coleta> CarregarColetaAsync(int id, CancellationToken ct)
    {
        return await _db.Coletas
            .Include(c => c.Motorista)
            .Include(c => c.Veiculo)
            .Include(c => c.Ocorrencias)
            .FirstOrDefaultAsync(c => c.Id == id, ct)
            ?? throw new RecursoNaoEncontradoException($"Coleta {id} não encontrada.");
    }

    /// <summary>Gera um número sequencial legível no formato COL-{ano}-{sequencial}.</summary>
    private async Task<string> GerarNumeroAsync(CancellationToken ct)
    {
        var ano = DateTime.UtcNow.Year;
        var prefixo = $"COL-{ano}-";

        var ultimo = await _db.Coletas
            .Where(c => c.Numero.StartsWith(prefixo))
            .OrderByDescending(c => c.Numero)
            .Select(c => c.Numero)
            .FirstOrDefaultAsync(ct);

        var proximo = 1;
        if (ultimo is not null)
        {
            var parteNumerica = ultimo.Substring(prefixo.Length);
            if (int.TryParse(parteNumerica, out var atual))
                proximo = atual + 1;
        }

        return $"{prefixo}{proximo:D4}";
    }
}
