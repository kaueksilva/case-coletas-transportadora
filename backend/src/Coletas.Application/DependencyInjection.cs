using Coletas.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace Coletas.Application;

public static class DependencyInjection
{
    /// <summary>Registra os serviços de aplicação no contêiner de DI.</summary>
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IColetaService, ColetaService>();
        services.AddScoped<IMotoristaService, MotoristaService>();
        services.AddScoped<IVeiculoService, VeiculoService>();
        return services;
    }
}
