using HubShop.Infrastructure.Persistence;

using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddOpenApi();

var connectionString =
    builder.Configuration.GetConnectionString(
        "DefaultConnection"
    )
    ?? throw new InvalidOperationException(
        "Connection string 'DefaultConnection' was not found."
    );

builder.Services.AddDbContext<HubShopDbContext>(
    options =>
    {
      options.UseSqlServer(
          connectionString,
          sqlServerOptions =>
          {
            sqlServerOptions.MigrationsAssembly(
                  typeof(HubShopDbContext)
                      .Assembly
                      .FullName
              );

            sqlServerOptions.EnableRetryOnFailure();
          }
      );
    }
);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
  app.MapOpenApi();

  app.UseSwaggerUI(options =>
  {
    options.SwaggerEndpoint(
          "/openapi/v1.json",
          "HubShop API v1"
      );
  });
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
