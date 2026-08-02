using HubShop.Domain.Entities;

using Microsoft.EntityFrameworkCore;

namespace HubShop.Infrastructure.Persistence;

public sealed class HubShopDbContext(
    DbContextOptions<HubShopDbContext> options
) : DbContext(options)
{
  public DbSet<Category> Categories =>
      Set<Category>();

  public DbSet<Brand> Brands =>
      Set<Brand>();

  public DbSet<Product> Products =>
      Set<Product>();

  public DbSet<ProductImage> ProductImages =>
      Set<ProductImage>();

  protected override void OnModelCreating(
      ModelBuilder modelBuilder
  )
  {
    base.OnModelCreating(modelBuilder);

    modelBuilder.ApplyConfigurationsFromAssembly(
        typeof(HubShopDbContext).Assembly
    );
  }
}
