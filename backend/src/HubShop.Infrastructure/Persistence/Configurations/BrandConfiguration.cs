using HubShop.Domain.Entities;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HubShop.Infrastructure.Persistence.Configurations;

internal sealed class BrandConfiguration
    : IEntityTypeConfiguration<Brand>
{
  public void Configure(
      EntityTypeBuilder<Brand> builder
  )
  {
    builder.ToTable("Brands");

    builder.HasKey(brand => brand.Id);

    builder.Property(brand => brand.Id)
        .ValueGeneratedNever();

    builder.Property(brand => brand.Name)
        .HasMaxLength(100)
        .IsRequired();

    builder.Property(brand => brand.Slug)
        .HasMaxLength(120)
        .IsRequired();

    builder.Property(brand => brand.IsActive)
        .HasDefaultValue(true);

    builder.HasIndex(brand => brand.Name)
        .IsUnique();

    builder.HasIndex(brand => brand.Slug)
        .IsUnique();

    builder.HasMany(brand => brand.Products)
        .WithOne(product => product.Brand)
        .HasForeignKey(product => product.BrandId)
        .OnDelete(DeleteBehavior.Restrict);
  }
}
