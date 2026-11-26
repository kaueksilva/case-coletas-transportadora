namespace Coletas.Infrastructure.Security;

/// <summary>Configurações de geração/validação de tokens JWT (seção "Jwt").</summary>
public class JwtOptions
{
    public const string SecaoConfig = "Jwt";

    public string Issuer { get; set; } = string.Empty;
    public string Audience { get; set; } = string.Empty;
    public string Key { get; set; } = string.Empty;
    public int ExpiraEmMinutos { get; set; } = 480;
}
