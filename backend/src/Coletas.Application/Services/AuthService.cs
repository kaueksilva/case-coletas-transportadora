using Coletas.Application.Common;
using Coletas.Application.DTOs;
using Coletas.Domain.Entities;
using Coletas.Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace Coletas.Application.Services;

public class AuthService : IAuthService
{
    private readonly IAppDbContext _db;
    private readonly IPasswordHasher _hasher;
    private readonly ITokenService _tokenService;

    public AuthService(IAppDbContext db, IPasswordHasher hasher, ITokenService tokenService)
    {
        _db = db;
        _hasher = hasher;
        _tokenService = tokenService;
    }

    public async Task<AuthResponse> RegistrarAsync(RegistrarUsuarioRequest request, CancellationToken ct = default)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        var jaExiste = await _db.Usuarios.AnyAsync(u => u.Email == email, ct);
        if (jaExiste)
            throw new RegraDeNegocioException("Já existe um usuário cadastrado com este e-mail.");

        var usuario = new Usuario
        {
            Nome = request.Nome.Trim(),
            Email = email,
            SenhaHash = _hasher.Hash(request.Senha),
            Perfil = string.IsNullOrWhiteSpace(request.Perfil) ? "Operador" : request.Perfil.Trim()
        };

        _db.Usuarios.Add(usuario);
        await _db.SaveChangesAsync(ct);

        return GerarResposta(usuario);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken ct = default)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var usuario = await _db.Usuarios.FirstOrDefaultAsync(u => u.Email == email, ct);

        if (usuario is null || !_hasher.Verificar(request.Senha, usuario.SenhaHash))
            throw new RegraDeNegocioException("E-mail ou senha inválidos.");

        return GerarResposta(usuario);
    }

    private AuthResponse GerarResposta(Usuario usuario)
    {
        var (token, expiraEm) = _tokenService.GerarToken(usuario);
        return new AuthResponse(token, expiraEm, usuario.Nome, usuario.Email, usuario.Perfil);
    }
}
