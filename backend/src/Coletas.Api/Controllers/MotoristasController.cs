using Coletas.Application.DTOs;
using Coletas.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Coletas.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MotoristasController : ControllerBase
{
    private readonly IMotoristaService _motoristaService;

    public MotoristasController(IMotoristaService motoristaService) => _motoristaService = motoristaService;

    /// <summary>Lista os motoristas cadastrados.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<MotoristaResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<MotoristaResponse>>> Listar(CancellationToken ct)
    {
        var motoristas = await _motoristaService.ListarAsync(ct);
        return Ok(motoristas);
    }

    /// <summary>Cadastra um novo motorista.</summary>
    [HttpPost]
    [ProducesResponseType(typeof(MotoristaResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<MotoristaResponse>> Criar(CriarMotoristaRequest request, CancellationToken ct)
    {
        var motorista = await _motoristaService.CriarAsync(request, ct);
        return CreatedAtAction(nameof(Listar), new { id = motorista.Id }, motorista);
    }
}
