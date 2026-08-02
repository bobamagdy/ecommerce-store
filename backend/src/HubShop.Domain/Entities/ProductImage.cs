namespace HubShop.Domain.Entities;

public sealed class ProductImage
{
  public Guid Id { get; set; } = Guid.CreateVersion7();

  public required string Url { get; set; }

  public string? AltText { get; set; }

  public bool IsPrimary { get; set; }

  public int SortOrder { get; set; }

  public Guid ProductId { get; set; }

  public Product Product { get; set; } = null!;
}
