using Coletas.Application.DTOs;
using Coletas.Domain.Entities;
using Coletas.Domain.Enums;

namespace Coletas.Application.Mapeamentos;

/// <summary>Conversões entre entidades de domínio e DTOs de resposta.</summary>
public static class MapeamentoExtensions
{
    public static string Descricao(this StatusColeta status) => status switch
    {
        StatusColeta.Aberta => "Aberta",
        StatusColeta.EmColeta => "Em Coleta",
        StatusColeta.Coletada => "Coletada",
        StatusColeta.Cancelada => "Cancelada",
        _ => status.ToString()
    };

    public static string Descricao(this Prioridade prioridade) => prioridade switch
    {
        Prioridade.Baixa => "Baixa",
        Prioridade.Media => "Média",
        Prioridade.Alta => "Alta",
        _ => prioridade.ToString()
    };

    public static OcorrenciaResponse ParaResponse(this Ocorrencia o) =>
        new(o.Id, o.Descricao, o.DataHora, o.RegistradoPor);

    public static ColetaResponse ParaResponse(this Coleta c) =>
        new(
            c.Id,
            c.Numero,
            c.Cliente,
            c.RemetenteNome,
            c.RemetenteEndereco,
            c.DestinatarioNome,
            c.DestinatarioEndereco,
            c.DataColeta,
            c.Prioridade,
            c.Prioridade.Descricao(),
            c.Observacoes,
            c.Status,
            c.Status.Descricao(),
            c.MotoristaId,
            c.Motorista?.Nome,
            c.VeiculoId,
            c.Veiculo?.Placa,
            c.Prioridade == Prioridade.Alta,
            c.CriadoEm,
            c.AtualizadoEm,
            c.Ocorrencias.OrderByDescending(o => o.DataHora).Select(o => o.ParaResponse()).ToList());

    public static MotoristaResponse ParaResponse(this Motorista m) =>
        new(m.Id, m.Nome, m.Cnh, m.Telefone, m.Ativo);

    public static VeiculoResponse ParaResponse(this Veiculo v) =>
        new(v.Id, v.Placa, v.Modelo, v.CapacidadeKg, v.Ativo);
}
