namespace HubShop.Application.Products.Queries.GetProducts;

public sealed record ProductListItemDto(
    Guid Id,
    string Name,
    string Category,
    string Brand,
    decimal Price,
    decimal? OldPrice,
    decimal Rating,
    int Reviews,
    int Stock,
    string? Badge,
    string Image
);
