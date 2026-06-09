using System.Security.Claims;
using Coletas.Application.Common;

namespace Coletas.Api.Seguranca;

/// <summary>Obtém os dados do usuário autenticado a partir do HttpContext.</summary>
public class UsuarioAtual : IUsuarioAtual
{
    private readonly IHttpContextAccessor _accessor;

    public UsuarioAtual(IHttpContextAccessor accessor) => _accessor = accessor;

    private ClaimsPrincipal? Usuario => _accessor.HttpContext?.User;

    public string? Nome => Usuario?.FindFirstValue(ClaimTypes.Name);

    public string? Email => Usuario?.FindFirstValue(ClaimTypes.Email)
        ?? Usuario?.FindFirstValue("email");

    public bool Autenticado => Usuario?.Identity?.IsAuthenticated ?? false;
}
