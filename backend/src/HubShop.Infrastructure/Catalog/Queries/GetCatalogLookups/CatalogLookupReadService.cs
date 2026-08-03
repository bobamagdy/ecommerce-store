using HubShop.Application.Catalog.Queries.GetCatalogLookups;
using HubShop.Infrastructure.Persistence;

using Microsoft.EntityFrameworkCore;

namespace HubShop.Infrastructure.Catalog.Queries.GetCatalogLookups;

public sealed class CatalogLookupReadService(
    HubShopDbContext dbContext
) : ICatalogLookupReadService
{
  public async Task<
      IReadOnlyList<CatalogLookupItemDto>
  > GetCategoriesAsync(
      CancellationToken cancellationToken
  )
  {
    return await dbContext.Categories
        .AsNoTracking()
        .Where(category => category.IsActive)
        .OrderBy(category => category.Name)
        .Select(
            category =>
                new CatalogLookupItemDto(
                    category.Id,
                    category.Name,
                    category.Slug,
                    category.Products.Count(
                        product =>
                            product.IsActive
                    )
                )
        )
        .ToListAsync(cancellationToken)
        .ConfigureAwait(false);
  }

  public async Task<
      IReadOnlyList<CatalogLookupItemDto>
  > GetBrandsAsync(
      CancellationToken cancellationToken
  )
  {
    return await dbContext.Brands
        .AsNoTracking()
        .Where(brand => brand.IsActive)
        .OrderBy(brand => brand.Name)
        .Select(
            brand =>
                new CatalogLookupItemDto(
                    brand.Id,
                    brand.Name,
                    brand.Slug,
                    brand.Products.Count(
                        product =>
                            product.IsActive
                    )
                )
        )
        .ToListAsync(cancellationToken)
        .ConfigureAwait(false);
  }
}
