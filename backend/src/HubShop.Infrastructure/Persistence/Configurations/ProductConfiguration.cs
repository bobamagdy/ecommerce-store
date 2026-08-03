using HubShop.Domain.Entities;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HubShop.Infrastructure.Persistence.Configurations;

internal sealed class ProductConfiguration
    : IEntityTypeConfiguration<Product>
{
  public void Configure(
      EntityTypeBuilder<Product> builder
  )
  {
    builder.ToTable("Products");

    builder.HasKey(product => product.Id);

    builder.Property(product => product.Id)
        .ValueGeneratedNever();

    builder.Property(product => product.Name)
        .HasMaxLength(200)
        .IsRequired();

    builder.Property(product => product.Description)
        .HasMaxLength(4000)
        .IsRequired();

    builder.Property(product => product.Sku)
        .HasMaxLength(64)
        .IsRequired();

    builder.Property(product => product.Price)
        .HasPrecision(18, 2);

    builder.Property(product => product.OldPrice)
        .HasPrecision(18, 2);

    builder.Property(product => product.AverageRating)
        .HasPrecision(3, 2)
        .HasDefaultValue(0);

    builder.Property(product => product.ReviewCount)
        .HasDefaultValue(0);

    builder.Property(product => product.Stock)
        .HasDefaultValue(0);

    builder.Property(product => product.Badge)
        .HasConversion<string>()
        .HasMaxLength(20);

    builder.Property(product => product.IsActive)
        .HasDefaultValue(true);

    builder.Property(product => product.CreatedAtUtc)
        .HasPrecision(0);

    builder.Property(product => product.UpdatedAtUtc)
        .HasPrecision(0);

    builder.HasIndex(product => product.Sku)
        .IsUnique()
        .HasDatabaseName("UX_Products_Sku");

    /*
     * Supports the default catalog order:
     *
     * WHERE IsActive = 1
     * ORDER BY CreatedAtUtc DESC, Id DESC
     */
    builder.HasIndex(product => new
    {
      product.IsActive,
      product.CreatedAtUtc,
      product.Id
    })
        .IsDescending(
            false,
            true,
            true
        )
        .HasDatabaseName(
            "IX_Products_IsActive_CreatedAtUtc_Id"
        );

    /*
     * Supports price sorting:
     *
     * WHERE IsActive = 1
     * ORDER BY Price, Id
     */
    builder.HasIndex(product => new
    {
      product.IsActive,
      product.Price,
      product.Id
    })
        .HasDatabaseName(
            "IX_Products_IsActive_Price_Id"
        );

    /*
     * Supports category filtering with newest sorting:
     *
     * WHERE CategoryId = ...
     * AND IsActive = 1
     * ORDER BY CreatedAtUtc DESC, Id DESC
     */
    builder.HasIndex(product => new
    {
      product.CategoryId,
      product.IsActive,
      product.CreatedAtUtc,
      product.Id
    })
        .IsDescending(
            false,
            false,
            true,
            true
        )
        .HasDatabaseName(
            "IX_Products_CategoryId_IsActive_CreatedAtUtc_Id"
        );

    /*
     * Supports brand filtering with newest sorting:
     *
     * WHERE BrandId = ...
     * AND IsActive = 1
     * ORDER BY CreatedAtUtc DESC, Id DESC
     */
    builder.HasIndex(product => new
    {
      product.BrandId,
      product.IsActive,
      product.CreatedAtUtc,
      product.Id
    })
        .IsDescending(
            false,
            false,
            true,
            true
        )
        .HasDatabaseName(
            "IX_Products_BrandId_IsActive_CreatedAtUtc_Id"
        );

    builder.HasMany(product => product.Images)
        .WithOne(image => image.Product)
        .HasForeignKey(image => image.ProductId)
        .OnDelete(DeleteBehavior.Cascade);
  }
}
