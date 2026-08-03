namespace HubShop.Application.Products.Queries.GetProductById;

public sealed record ProductDetailsDto(
    Guid Id,
    string Name,
    string Description,
    string Sku,
    Guid CategoryId,
    string Category,
    Guid BrandId,
    string Brand,
    decimal Price,
    decimal? OldPrice,
    decimal Rating,
    int Reviews,
    int Stock,
    bool IsInStock,
    string? Badge,
    string Image,
    IReadOnlyList<string> Images
);
