namespace Coletas.Domain.Enums;

/// <summary>
/// Etapas do ciclo de vida de uma solicitação de coleta.
/// </summary>
public enum StatusColeta
{
    /// <summary>Solicitação registrada e aguardando roteirização.</summary>
    Aberta = 1,

    /// <summary>Motorista e veículo atribuídos; coleta em execução.</summary>
    EmColeta = 2,

    /// <summary>Carga efetivamente coletada (estado final).</summary>
    Coletada = 3,

    /// <summary>Solicitação cancelada (estado final, sem retorno ao fluxo).</summary>
    Cancelada = 4
}
