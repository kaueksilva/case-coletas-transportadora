# ---- Build ----
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia os arquivos de projeto e restaura as dependências (melhor cache)
COPY Coletas.sln ./
COPY src/Coletas.Domain/Coletas.Domain.csproj src/Coletas.Domain/
COPY src/Coletas.Application/Coletas.Application.csproj src/Coletas.Application/
COPY src/Coletas.Infrastructure/Coletas.Infrastructure.csproj src/Coletas.Infrastructure/
COPY src/Coletas.Api/Coletas.Api.csproj src/Coletas.Api/
COPY tests/Coletas.Tests/Coletas.Tests.csproj tests/Coletas.Tests/
RUN dotnet restore src/Coletas.Api/Coletas.Api.csproj

# Copia o restante do código e publica
COPY . .
RUN dotnet publish src/Coletas.Api/Coletas.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

# ---- Runtime ----
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "Coletas.Api.dll"]
