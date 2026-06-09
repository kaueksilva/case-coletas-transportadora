using System.Net;
using System.Text.Json;
using Coletas.Domain.Exceptions;

namespace Coletas.Api.Middleware;

/// <summary>
/// Middleware central de tratamento de erros. Converte exceções de domínio em
/// respostas HTTP apropriadas (400/404) e registra os erros inesperados (500).
/// </summary>
public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (RegraDeNegocioException ex)
        {
            _logger.LogWarning("Regra de negócio violada: {Mensagem}", ex.Message);
            await EscreverRespostaAsync(context, HttpStatusCode.BadRequest, ex.Message);
        }
        catch (RecursoNaoEncontradoException ex)
        {
            _logger.LogWarning("Recurso não encontrado: {Mensagem}", ex.Message);
            await EscreverRespostaAsync(context, HttpStatusCode.NotFound, ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro inesperado ao processar a requisição.");
            await EscreverRespostaAsync(context, HttpStatusCode.InternalServerError,
                "Ocorreu um erro inesperado ao processar a requisição.");
        }
    }

    private static async Task EscreverRespostaAsync(HttpContext context, HttpStatusCode status, string mensagem)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)status;

        var payload = JsonSerializer.Serialize(new
        {
            status = (int)status,
            erro = mensagem
        });

        await context.Response.WriteAsync(payload);
    }
}
