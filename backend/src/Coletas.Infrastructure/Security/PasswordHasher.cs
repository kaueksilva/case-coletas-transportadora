using Coletas.Application.Common;

namespace Coletas.Infrastructure.Security;

/// <summary>Implementação de hashing de senha usando BCrypt.</summary>
public class PasswordHasher : IPasswordHasher
{
    public string Hash(string senha) => BCrypt.Net.BCrypt.HashPassword(senha);

    public bool Verificar(string senha, string hash) => BCrypt.Net.BCrypt.Verify(senha, hash);
}
