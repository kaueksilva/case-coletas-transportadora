using Coletas.Application.DTOs;

namespace Coletas.Application.Services;

public interface IAuthService
{
    Task<AuthResponse> RegistrarAsync(RegistrarUsuarioRequest request, CancellationToken ct = default);
    Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken ct = default);
}
