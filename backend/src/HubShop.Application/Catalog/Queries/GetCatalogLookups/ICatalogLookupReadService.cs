namespace HubShop.Application.Catalog.Queries.GetCatalogLookups;

public interface ICatalogLookupReadService
{
  Task<IReadOnlyList<CatalogLookupItemDto>>
      GetCategoriesAsync(
          CancellationToken cancellationToken
      );

  Task<IReadOnlyList<CatalogLookupItemDto>>
      GetBrandsAsync(
          CancellationToken cancellationToken
      );
}
