using Coletas.Application.DTOs;
using Coletas.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Coletas.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class VeiculosController : ControllerBase
{
    private readonly IVeiculoService _veiculoService;

    public VeiculosController(IVeiculoService veiculoService) => _veiculoService = veiculoService;

    /// <summary>Lista os veículos cadastrados.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<VeiculoResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<VeiculoResponse>>> Listar(CancellationToken ct)
    {
        var veiculos = await _veiculoService.ListarAsync(ct);
        return Ok(veiculos);
    }

    /// <summary>Cadastra um novo veículo.</summary>
    [HttpPost]
    [ProducesResponseType(typeof(VeiculoResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<VeiculoResponse>> Criar(CriarVeiculoRequest request, CancellationToken ct)
    {
        var veiculo = await _veiculoService.CriarAsync(request, ct);
        return CreatedAtAction(nameof(Listar), new { id = veiculo.Id }, veiculo);
    }
}
