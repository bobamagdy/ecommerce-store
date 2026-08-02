using HubShop.Domain.Enums;

namespace HubShop.Domain.Entities;

public sealed class Product
{
  public Guid Id { get; set; } = Guid.CreateVersion7();

  public required string Name { get; set; }

  public required string Description { get; set; }

  public required string Sku { get; set; }

  public decimal Price { get; set; }

  public decimal? OldPrice { get; set; }

  public decimal AverageRating { get; set; }

  public int ReviewCount { get; set; }

  public int Stock { get; set; }

  public ProductBadge? Badge { get; set; }

  public bool IsActive { get; set; } = true;

  public DateTime CreatedAtUtc { get; set; } =
      DateTime.UtcNow;

  public DateTime? UpdatedAtUtc { get; set; }

  public Guid CategoryId { get; set; }

  public Category Category { get; set; } = null!;

  public Guid BrandId { get; set; }

  public Brand Brand { get; set; } = null!;

  public ICollection<ProductImage> Images { get; set; } =
      new List<ProductImage>();
}
