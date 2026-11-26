using Coletas.Domain.Entities;

namespace Coletas.Application.Common;

/// <summary>Geração de hash e verificação de senhas.</summary>
public interface IPasswordHasher
{
    string Hash(string senha);
    bool Verificar(string senha, string hash);
}

/// <summary>Geração de tokens JWT para usuários autenticados.</summary>
public interface ITokenService
{
    /// <summary>Gera um token JWT e retorna também o instante de expiração (UTC).</summary>
    (string token, DateTime expiraEm) GerarToken(Usuario usuario);
}

/// <summary>Acesso aos dados do usuário autenticado na requisição atual.</summary>
public interface IUsuarioAtual
{
    string? Nome { get; }
    string? Email { get; }
    bool Autenticado { get; }
}
