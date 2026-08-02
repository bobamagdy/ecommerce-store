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
        .IsUnique();

    builder.HasIndex(product => new
    {
      product.CategoryId,
      product.IsActive
    });

    builder.HasIndex(product => new
    {
      product.BrandId,
      product.IsActive
    });

    builder.HasIndex(product => new
    {
      product.IsActive,
      product.CreatedAtUtc
    });

    builder.HasMany(product => product.Images)
        .WithOne(image => image.Product)
        .HasForeignKey(image => image.ProductId)
        .OnDelete(DeleteBehavior.Cascade);
  }
}
