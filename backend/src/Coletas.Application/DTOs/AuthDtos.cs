using System.ComponentModel.DataAnnotations;

namespace Coletas.Application.DTOs;

public record RegistrarUsuarioRequest(
    [Required] string Nome,
    [Required, EmailAddress] string Email,
    [Required, MinLength(6)] string Senha,
    string? Perfil);

public record LoginRequest(
    [Required, EmailAddress] string Email,
    [Required] string Senha);

public record AuthResponse(
    string Token,
    DateTime ExpiraEm,
    string Nome,
    string Email,
    string Perfil);
