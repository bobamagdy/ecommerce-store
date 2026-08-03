using HubShop.Infrastructure.Persistence;
using HubShop.Infrastructure.Persistence.Seeding;

using Microsoft.EntityFrameworkCore;
using HubShop.Application.Products.Queries.GetProducts;
using HubShop.Infrastructure.Products.Queries.GetProducts;

using HubShop.Application.Catalog.Queries.GetCatalogLookups;
using HubShop.Application.Products.Queries.GetProductById;
using HubShop.Infrastructure.Catalog.Queries.GetCatalogLookups;
using HubShop.Infrastructure.Products.Queries.GetProductById;

const string AngularClientPolicy =
    "AngularClient";
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddAuthorization();

builder.Services.AddOpenApi();

builder.Services.AddCors(
    options =>
    {
      options.AddPolicy(
          AngularClientPolicy,
          policy =>
          {
            policy
                  .WithOrigins(
                      "http://localhost:4200"
                  )
                  .AllowAnyHeader()
                  .AllowAnyMethod();
          }
      );
    }
);

var connectionString =
    builder.Configuration.GetConnectionString(
        "DefaultConnection"
    )
    ?? throw new InvalidOperationException(
        "Connection string 'DefaultConnection' "
        + "was not found."
    );

var seedDataEnabled =
    builder.Configuration.GetValue<bool>(
        "SeedData:Enabled"
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

      if (seedDataEnabled)
      {
        options.UseSeeding(
            (context, _) =>
            {
              CatalogSeeder.Seed(
                      (HubShopDbContext)context
                  );
            }
        );

        options.UseAsyncSeeding(
            (
                context,
                _,
                cancellationToken
            ) =>
            {
              return CatalogSeeder.SeedAsync(
                      (HubShopDbContext)context,
                      cancellationToken
                  );
            }
        );
      }
    }
);
builder.Services.AddScoped<
    IProductReadService,
    ProductReadService
>();

builder.Services.AddScoped<
    IProductDetailsReadService,
    ProductDetailsReadService
>();

builder.Services.AddScoped<
    ICatalogLookupReadService,
    CatalogLookupReadService
>();

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

app.UseCors(AngularClientPolicy);

app.UseAuthorization();

app.MapControllers();

app.Run();

public partial class Program
{
}
