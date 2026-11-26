using Coletas.Application.DTOs;
using Coletas.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Coletas.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[AllowAnonymous]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService) => _authService = authService;

    /// <summary>Registra um novo usuário e retorna um token JWT.</summary>
    [HttpPost("registrar")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AuthResponse>> Registrar(RegistrarUsuarioRequest request, CancellationToken ct)
    {
        var resposta = await _authService.RegistrarAsync(request, ct);
        return Ok(resposta);
    }

    /// <summary>Autentica um usuário existente e retorna um token JWT.</summary>
    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request, CancellationToken ct)
    {
        var resposta = await _authService.LoginAsync(request, ct);
        return Ok(resposta);
    }
}
