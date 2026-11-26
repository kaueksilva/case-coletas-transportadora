using System.ComponentModel.DataAnnotations;

namespace Coletas.Application.DTOs;

/// <summary>Dados para registrar uma ocorrência em uma coleta.</summary>
public record CriarOcorrenciaRequest(
    [Required] string Descricao);
