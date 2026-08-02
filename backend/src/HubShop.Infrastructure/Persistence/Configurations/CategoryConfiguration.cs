using HubShop.Domain.Entities;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HubShop.Infrastructure.Persistence.Configurations;

internal sealed class CategoryConfiguration
    : IEntityTypeConfiguration<Category>
{
  public void Configure(
      EntityTypeBuilder<Category> builder
  )
  {
    builder.ToTable("Categories");

    builder.HasKey(category => category.Id);

    builder.Property(category => category.Id)
        .ValueGeneratedNever();

    builder.Property(category => category.Name)
        .HasMaxLength(100)
        .IsRequired();

    builder.Property(category => category.Slug)
        .HasMaxLength(120)
        .IsRequired();

    builder.Property(category => category.IsActive)
        .HasDefaultValue(true);

    builder.HasIndex(category => category.Name)
        .IsUnique();

    builder.HasIndex(category => category.Slug)
        .IsUnique();

    builder.HasMany(category => category.Products)
        .WithOne(product => product.Category)
        .HasForeignKey(product => product.CategoryId)
        .OnDelete(DeleteBehavior.Restrict);
  }
}
