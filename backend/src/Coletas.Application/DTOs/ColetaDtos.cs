using System.ComponentModel.DataAnnotations;
using Coletas.Domain.Enums;

namespace Coletas.Application.DTOs;

/// <summary>Dados para registrar uma nova solicitação de coleta.</summary>
public record CriarColetaRequest(
    [Required] string Cliente,
    [Required] string RemetenteNome,
    [Required] string RemetenteEndereco,
    [Required] string DestinatarioNome,
    [Required] string DestinatarioEndereco,
    [Required] DateTime DataColeta,
    Prioridade Prioridade,
    string? Observacoes);

/// <summary>Dados editáveis de uma coleta (campos cadastrais, não o status).</summary>
public record AtualizarColetaRequest(
    [Required] string Cliente,
    [Required] string RemetenteNome,
    [Required] string RemetenteEndereco,
    [Required] string DestinatarioNome,
    [Required] string DestinatarioEndereco,
    [Required] DateTime DataColeta,
    Prioridade Prioridade,
    string? Observacoes);

/// <summary>Atribuição de motorista e veículo a uma coleta.</summary>
public record AtribuirRecursosRequest(
    [Required] int MotoristaId,
    [Required] int VeiculoId);

public record OcorrenciaResponse(
    int Id,
    string Descricao,
    DateTime DataHora,
    string RegistradoPor);

public record ColetaResponse(
    int Id,
    string Numero,
    string Cliente,
    string RemetenteNome,
    string RemetenteEndereco,
    string DestinatarioNome,
    string DestinatarioEndereco,
    DateTime DataColeta,
    Prioridade Prioridade,
    string PrioridadeDescricao,
    string? Observacoes,
    StatusColeta Status,
    string StatusDescricao,
    int? MotoristaId,
    string? MotoristaNome,
    int? VeiculoId,
    string? VeiculoPlaca,
    bool PrioridadeAlta,
    DateTime CriadoEm,
    DateTime AtualizadoEm,
    IReadOnlyList<OcorrenciaResponse> Ocorrencias);
