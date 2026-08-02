using HubShop.Domain.Entities;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HubShop.Infrastructure.Persistence.Configurations;

internal sealed class ProductImageConfiguration
    : IEntityTypeConfiguration<ProductImage>
{
  public void Configure(
      EntityTypeBuilder<ProductImage> builder
  )
  {
    builder.ToTable("ProductImages");

    builder.HasKey(image => image.Id);

    builder.Property(image => image.Id)
        .ValueGeneratedNever();

    builder.Property(image => image.Url)
        .HasMaxLength(2048)
        .IsRequired();

    builder.Property(image => image.AltText)
        .HasMaxLength(250);

    builder.Property(image => image.IsPrimary)
        .HasDefaultValue(false);

    builder.Property(image => image.SortOrder)
        .HasDefaultValue(0);

    builder.HasIndex(image => new
    {
      image.ProductId,
      image.SortOrder
    })
    .IsUnique();

    builder.HasIndex(image => image.ProductId)
        .IsUnique()
        .HasFilter("[IsPrimary] = 1");
  }
}
