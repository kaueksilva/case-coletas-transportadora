namespace Coletas.Domain.Entities;

/// <summary>
/// Usuário do sistema, utilizado para autenticação JWT e para registrar a
/// autoria das ocorrências.
/// </summary>
public class Usuario
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string SenhaHash { get; set; } = string.Empty;

    /// <summary>Perfil de acesso (ex.: "Operador", "Admin").</summary>
    public string Perfil { get; set; } = "Operador";

    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
}
