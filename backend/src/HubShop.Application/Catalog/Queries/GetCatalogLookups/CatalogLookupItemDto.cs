namespace HubShop.Application.Catalog.Queries.GetCatalogLookups;

public sealed record CatalogLookupItemDto(
    Guid Id,
    string Name,
    string Slug,
    int ProductCount
);
