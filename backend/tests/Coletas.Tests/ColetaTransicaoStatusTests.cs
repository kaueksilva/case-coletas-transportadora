using Coletas.Domain.Entities;
using Coletas.Domain.Enums;
using Coletas.Domain.Exceptions;
using FluentAssertions;
using Xunit;

namespace Coletas.Tests;

/// <summary>
/// Testes das regras de transição de status da coleta (núcleo das regras de negócio).
/// </summary>
public class ColetaTransicaoStatusTests
{
    private static Coleta NovaColeta() => new()
    {
        Numero = "COL-2026-0001",
        Cliente = "Cliente Teste",
        RemetenteNome = "Remetente",
        RemetenteEndereco = "Endereço A",
        DestinatarioNome = "Destinatário",
        DestinatarioEndereco = "Endereço B",
        DataColeta = DateTime.UtcNow.AddDays(1),
        Prioridade = Prioridade.Media
    };

    [Fact]
    public void NovaColeta_DeveIniciarComoAberta()
    {
        var coleta = NovaColeta();
        coleta.Status.Should().Be(StatusColeta.Aberta);
    }

    [Fact]
    public void AtribuirMotoristaEVeiculo_DeveAvancarParaEmColeta()
    {
        var coleta = NovaColeta();

        coleta.AtribuirMotoristaEVeiculo(motoristaId: 1, veiculoId: 1);

        coleta.Status.Should().Be(StatusColeta.EmColeta);
        coleta.MotoristaId.Should().Be(1);
        coleta.VeiculoId.Should().Be(1);
    }

    [Fact]
    public void MarcarComoColetada_SemMotoristaOuVeiculo_DeveFalhar()
    {
        var coleta = NovaColeta();

        var acao = () => coleta.MarcarComoColetada();

        acao.Should().Throw<RegraDeNegocioException>()
            .WithMessage("*sem motorista e veículo*");
        coleta.Status.Should().Be(StatusColeta.Aberta);
    }

    [Fact]
    public void MarcarComoColetada_ComMotoristaEVeiculo_DeveConcluir()
    {
        var coleta = NovaColeta();
        coleta.AtribuirMotoristaEVeiculo(1, 1);

        coleta.MarcarComoColetada();

        coleta.Status.Should().Be(StatusColeta.Coletada);
    }

    [Fact]
    public void Cancelar_ColetaAberta_DeveCancelar()
    {
        var coleta = NovaColeta();

        coleta.Cancelar();

        coleta.Status.Should().Be(StatusColeta.Cancelada);
    }

    [Fact]
    public void ColetaCancelada_NaoPodeAvancarParaEmColeta()
    {
        var coleta = NovaColeta();
        coleta.Cancelar();

        var acao = () => coleta.AtribuirMotoristaEVeiculo(1, 1);

        acao.Should().Throw<RegraDeNegocioException>()
            .WithMessage("*cancelada*");
        coleta.Status.Should().Be(StatusColeta.Cancelada);
    }

    [Fact]
    public void ColetaCancelada_NaoPodeSerColetada()
    {
        var coleta = NovaColeta();
        coleta.Cancelar();

        var acao = () => coleta.MarcarComoColetada();

        acao.Should().Throw<RegraDeNegocioException>();
        coleta.Status.Should().Be(StatusColeta.Cancelada);
    }

    [Fact]
    public void ColetaColetada_NaoPodeSerCancelada()
    {
        var coleta = NovaColeta();
        coleta.AtribuirMotoristaEVeiculo(1, 1);
        coleta.MarcarComoColetada();

        var acao = () => coleta.Cancelar();

        acao.Should().Throw<RegraDeNegocioException>()
            .WithMessage("*já coletada*");
        coleta.Status.Should().Be(StatusColeta.Coletada);
    }

    [Fact]
    public void ColetaColetada_NaoPodeReceberNovaAtribuicao()
    {
        var coleta = NovaColeta();
        coleta.AtribuirMotoristaEVeiculo(1, 1);
        coleta.MarcarComoColetada();

        var acao = () => coleta.AtribuirMotoristaEVeiculo(2, 2);

        acao.Should().Throw<RegraDeNegocioException>();
        coleta.Status.Should().Be(StatusColeta.Coletada);
    }

    [Fact]
    public void Cancelar_ColetaJaCancelada_DeveFalhar()
    {
        var coleta = NovaColeta();
        coleta.Cancelar();

        var acao = () => coleta.Cancelar();

        acao.Should().Throw<RegraDeNegocioException>()
            .WithMessage("*já está cancelada*");
    }

    [Fact]
    public void MarcarComoColetada_DuasVezes_DeveFalhar()
    {
        var coleta = NovaColeta();
        coleta.AtribuirMotoristaEVeiculo(1, 1);
        coleta.MarcarComoColetada();

        var acao = () => coleta.MarcarComoColetada();

        acao.Should().Throw<RegraDeNegocioException>()
            .WithMessage("*já está marcada como coletada*");
    }
}
