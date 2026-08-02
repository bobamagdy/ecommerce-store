namespace HubShop.Domain.Entities;

public sealed class Brand
{
  public Guid Id { get; set; } = Guid.CreateVersion7();

  public required string Name { get; set; }

  public required string Slug { get; set; }

  public bool IsActive { get; set; } = true;

  public ICollection<Product> Products { get; set; } =
      new List<Product>();
}
