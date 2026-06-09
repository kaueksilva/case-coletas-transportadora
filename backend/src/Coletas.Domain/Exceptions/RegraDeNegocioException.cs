namespace Coletas.Domain.Exceptions;

/// <summary>
/// Exceção lançada quando uma regra de negócio do domínio é violada.
/// É traduzida para HTTP 400 (Bad Request) na camada de API.
/// </summary>
public class RegraDeNegocioException : Exception
{
    public RegraDeNegocioException(string mensagem) : base(mensagem)
    {
    }
}
