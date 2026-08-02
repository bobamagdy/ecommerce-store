using HubShop.Infrastructure.Persistence;

using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace HubShop.Api.IntegrationTests.Infrastructure;

public sealed class HubShopApiFactory
    : WebApplicationFactory<Program>
{
  private const string TestConnectionString =
      "Server=localhost;"
      + "Database=EcommerceDb_IntegrationTests;"
      + "Trusted_Connection=True;"
      + "Encrypt=True;"
      + "TrustServerCertificate=True";

  private readonly SemaphoreSlim initializationLock =
      new(1, 1);

  private bool initialized;

  protected override void ConfigureWebHost(
      IWebHostBuilder builder
  )
  {
    builder.UseEnvironment("Development");

    builder.ConfigureAppConfiguration(
        (_, configurationBuilder) =>
        {
          Dictionary<string, string?> settings =
                  new()
                  {
                    [
                          "ConnectionStrings:"
                          + "DefaultConnection"
                      ] = TestConnectionString,

                    ["SeedData:Enabled"] = "true"
                  };

          configurationBuilder.AddInMemoryCollection(
                  settings
              );
        }
    );
  }

  public async Task InitializeDatabaseAsync(
      CancellationToken cancellationToken = default
  )
  {
    await initializationLock.WaitAsync(
        cancellationToken
    );

    try
    {
      if (initialized)
      {
        return;
      }

      using var scope =
          Services.CreateScope();

      var dbContext =
          scope.ServiceProvider
              .GetRequiredService<
                  HubShopDbContext
              >();

      await dbContext.Database
          .EnsureDeletedAsync(
              cancellationToken
          );

      await dbContext.Database
          .MigrateAsync(
              cancellationToken
          );

      initialized = true;
    }
    finally
    {
      initializationLock.Release();
    }
  }

  protected override void Dispose(
      bool disposing
  )
  {
    if (disposing)
    {
      initializationLock.Dispose();
    }

    base.Dispose(disposing);
  }
}
