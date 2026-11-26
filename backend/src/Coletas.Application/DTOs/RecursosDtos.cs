using System.ComponentModel.DataAnnotations;

namespace Coletas.Application.DTOs;

public record CriarMotoristaRequest(
    [Required] string Nome,
    [Required] string Cnh,
    string? Telefone);

public record MotoristaResponse(
    int Id,
    string Nome,
    string Cnh,
    string? Telefone,
    bool Ativo);

public record CriarVeiculoRequest(
    [Required] string Placa,
    [Required] string Modelo,
    decimal CapacidadeKg);

public record VeiculoResponse(
    int Id,
    string Placa,
    string Modelo,
    decimal CapacidadeKg,
    bool Ativo);
