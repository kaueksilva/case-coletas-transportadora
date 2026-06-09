namespace Coletas.Domain.Exceptions;

/// <summary>
/// Exceção lançada quando um recurso solicitado não é encontrado.
/// É traduzida para HTTP 404 (Not Found) na camada de API.
/// </summary>
public class RecursoNaoEncontradoException : Exception
{
    public RecursoNaoEncontradoException(string mensagem) : base(mensagem)
    {
    }
}
