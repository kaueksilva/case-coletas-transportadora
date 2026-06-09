using Coletas.Application.Common;
using Coletas.Application.DTOs;
using Coletas.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Coletas.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ColetasController : ControllerBase
{
    private readonly IColetaService _coletaService;

    public ColetasController(IColetaService coletaService) => _coletaService = coletaService;

    /// <summary>
    /// Lista as coletas com filtros (status, cliente, prioridade e período) e paginação.
    /// Coletas com prioridade alta são retornadas primeiro.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<ColetaResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedResult<ColetaResponse>>> Listar(
        [FromQuery] ColetaFiltro filtro, CancellationToken ct)
    {
        var resultado = await _coletaService.ListarAsync(filtro, ct);
        return Ok(resultado);
    }

    /// <summary>Obtém os detalhes de uma coleta, incluindo suas ocorrências.</summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ColetaResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ColetaResponse>> ObterPorId(int id, CancellationToken ct)
    {
        var coleta = await _coletaService.ObterPorIdAsync(id, ct);
        return Ok(coleta);
    }

    /// <summary>Registra uma nova solicitação de coleta.</summary>
    [HttpPost]
    [ProducesResponseType(typeof(ColetaResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ColetaResponse>> Criar(CriarColetaRequest request, CancellationToken ct)
    {
        var coleta = await _coletaService.CriarAsync(request, ct);
        return CreatedAtAction(nameof(ObterPorId), new { id = coleta.Id }, coleta);
    }

    /// <summary>Atualiza os dados cadastrais de uma coleta.</summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(ColetaResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ColetaResponse>> Atualizar(int id, AtualizarColetaRequest request, CancellationToken ct)
    {
        var coleta = await _coletaService.AtualizarAsync(id, request, ct);
        return Ok(coleta);
    }

    /// <summary>Atribui motorista e veículo, avançando a coleta para "Em Coleta".</summary>
    [HttpPost("{id:int}/atribuir")]
    [ProducesResponseType(typeof(ColetaResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ColetaResponse>> Atribuir(int id, AtribuirRecursosRequest request, CancellationToken ct)
    {
        var coleta = await _coletaService.AtribuirRecursosAsync(id, request, ct);
        return Ok(coleta);
    }

    /// <summary>Marca a coleta como coletada (exige motorista e veículo vinculados).</summary>
    [HttpPost("{id:int}/coletar")]
    [ProducesResponseType(typeof(ColetaResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ColetaResponse>> Coletar(int id, CancellationToken ct)
    {
        var coleta = await _coletaService.MarcarComoColetadaAsync(id, ct);
        return Ok(coleta);
    }

    /// <summary>Cancela a coleta (estado final, sem retorno ao fluxo ativo).</summary>
    [HttpPost("{id:int}/cancelar")]
    [ProducesResponseType(typeof(ColetaResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ColetaResponse>> Cancelar(int id, CancellationToken ct)
    {
        var coleta = await _coletaService.CancelarAsync(id, ct);
        return Ok(coleta);
    }

    /// <summary>Registra uma ocorrência na coleta (data, hora e usuário responsável).</summary>
    [HttpPost("{id:int}/ocorrencias")]
    [ProducesResponseType(typeof(OcorrenciaResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<OcorrenciaResponse>> RegistrarOcorrencia(
        int id, CriarOcorrenciaRequest request, CancellationToken ct)
    {
        var ocorrencia = await _coletaService.RegistrarOcorrenciaAsync(id, request, ct);
        return CreatedAtAction(nameof(ObterPorId), new { id }, ocorrencia);
    }
}
