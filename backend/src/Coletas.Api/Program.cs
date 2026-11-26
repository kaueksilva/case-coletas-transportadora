using System.Text;
using Coletas.Api.Middleware;
using Coletas.Api.Seguranca;
using Coletas.Application;
using Coletas.Application.Common;
using Coletas.Infrastructure;
using Coletas.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// ---- Serilog: logging estruturado em console e arquivo ----
builder.Host.UseSerilog((context, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration));

// ---- Camadas da aplicação ----
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApplication();

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IUsuarioAtual, UsuarioAtual>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// ---- Autenticação JWT ----
var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("Jwt:Key não configurada.");
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();

// ---- CORS para o front-end Next.js ----
var origensPermitidas = builder.Configuration.GetSection("Cors:Origens").Get<string[]>()
    ?? new[] { "http://localhost:3000" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontEnd", policy =>
        policy.WithOrigins(origensPermitidas)
            .AllowAnyHeader()
            .AllowAnyMethod());
});

// ---- Swagger com suporte a JWT ----
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "API de Gestão de Coletas",
        Version = "v1",
        Description = "API para gestão de solicitações de coleta de uma transportadora."
    });

    var esquemaJwt = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Informe o token JWT. Exemplo: \"Bearer {token}\"",
        Reference = new OpenApiReference
        {
            Type = ReferenceType.SecurityScheme,
            Id = "Bearer"
        }
    };

    options.AddSecurityDefinition("Bearer", esquemaJwt);
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { esquemaJwt, Array.Empty<string>() }
    });

    var xmlDoc = Path.Combine(AppContext.BaseDirectory, "Coletas.Api.xml");
    if (File.Exists(xmlDoc))
        options.IncludeXmlComments(xmlDoc);
});

var app = builder.Build();

// ---- Pipeline HTTP ----
app.UseMiddleware<ExceptionMiddleware>();

app.UseSerilogRequestLogging();

app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "API de Gestão de Coletas v1");
    options.RoutePrefix = "swagger";
});

app.UseCors("FrontEnd");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// ---- Aplica migrations e seed na inicialização ----
await DbInitializer.InicializarAsync(app.Services);

app.Run();

// Necessário para testes de integração / referência do assembly.
public partial class Program { }
