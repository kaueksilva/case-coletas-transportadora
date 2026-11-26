using Coletas.Domain.Entities;
using Coletas.Domain.Enums;
using Coletas.Domain.Exceptions;
using FluentAssertions;
using Xunit;

namespace Coletas.Tests;

/// <summary>Testes do registro de ocorrências (rastreabilidade).</summary>
public class OcorrenciaTests
{
    private static Coleta NovaColeta() => new()
    {
        Id = 10,
        Numero = "COL-2026-0010",
        Cliente = "Cliente Teste",
        RemetenteNome = "Remetente",
        RemetenteEndereco = "Endereço A",
        DestinatarioNome = "Destinatário",
        DestinatarioEndereco = "Endereço B",
        DataColeta = DateTime.UtcNow.AddDays(1)
    };

    [Fact]
    public void RegistrarOcorrencia_DeveGuardarDataHoraEResponsavel()
    {
        var coleta = NovaColeta();

        var ocorrencia = coleta.RegistrarOcorrencia("Remetente ausente", "operador@coletas.com");

        ocorrencia.Descricao.Should().Be("Remetente ausente");
        ocorrencia.RegistradoPor.Should().Be("operador@coletas.com");
        ocorrencia.DataHora.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
        ocorrencia.ColetaId.Should().Be(coleta.Id);
        coleta.Ocorrencias.Should().ContainSingle();
    }

    [Fact]
    public void RegistrarOcorrencia_SemDescricao_DeveFalhar()
    {
        var coleta = NovaColeta();

        var acao = () => coleta.RegistrarOcorrencia("  ", "operador");

        acao.Should().Throw<RegraDeNegocioException>()
            .WithMessage("*descrição*");
    }

    [Fact]
    public void RegistrarOcorrencia_SemResponsavel_DeveFalhar()
    {
        var coleta = NovaColeta();

        var acao = () => coleta.RegistrarOcorrencia("Endereço incorreto", "");

        acao.Should().Throw<RegraDeNegocioException>()
            .WithMessage("*responsável*");
    }
}
