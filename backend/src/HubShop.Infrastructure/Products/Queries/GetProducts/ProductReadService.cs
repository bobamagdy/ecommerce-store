using HubShop.Application.Common.Pagination;
using HubShop.Application.Products.Queries.GetProducts;
using HubShop.Domain.Entities;
using HubShop.Domain.Enums;
using HubShop.Infrastructure.Persistence;

using Microsoft.EntityFrameworkCore;

namespace HubShop.Infrastructure.Products.Queries.GetProducts;

public sealed class ProductReadService(
    HubShopDbContext dbContext
) : IProductReadService
{
  public async Task<PagedResult<ProductListItemDto>> GetAsync(
      GetProductsQuery query,
      CancellationToken cancellationToken
  )
  {
    ArgumentNullException.ThrowIfNull(query);

    var page = query.NormalizedPage;

    var pageSize = query.NormalizedPageSize;

    var search = query.NormalizedSearch;

    IQueryable<Product> productsQuery =
        dbContext.Products
            .AsNoTracking()
            .Where(product => product.IsActive);

    if (search is not null)
    {
      productsQuery = productsQuery.Where(
          product =>
              product.Name.Contains(search)
              || product.Sku.Contains(search)
              || product.Category.Name.Contains(search)
              || product.Brand.Name.Contains(search)
      );
    }

    if (query.CategoryId.HasValue)
    {
      productsQuery = productsQuery.Where(
          product =>
              product.CategoryId
              == query.CategoryId.Value
      );
    }

    if (query.BrandId.HasValue)
    {
      productsQuery = productsQuery.Where(
          product =>
              product.BrandId
              == query.BrandId.Value
      );
    }

    if (query.MinPrice.HasValue)
    {
      productsQuery = productsQuery.Where(
          product =>
              product.Price
              >= query.MinPrice.Value
      );
    }

    if (query.MaxPrice.HasValue)
    {
      productsQuery = productsQuery.Where(
          product =>
              product.Price
              <= query.MaxPrice.Value
      );
    }

    var totalCount =
        await productsQuery.CountAsync(
            cancellationToken
        )
        .ConfigureAwait(false);

    var orderedQuery = ApplySorting(
        productsQuery,
        query.NormalizedSortBy
    );

    var offset =
        (long)(page - 1) * pageSize;

    if (offset >= totalCount)
    {
      return new PagedResult<ProductListItemDto>(
          [],
          page,
          pageSize,
          totalCount
      );
    }

    var items = await orderedQuery
        .Skip((int)offset)
        .Take(pageSize)
        .Select(
            product =>
                new ProductListItemDto(
                    product.Id,
                    product.Name,
                    product.Category.Name,
                    product.Brand.Name,
                    product.Price,
                    product.OldPrice,
                    product.AverageRating,
                    product.ReviewCount,
                    product.Stock,
                    product.Badge
                        == ProductBadge.Sale
                            ? "Sale"
                            : product.Badge
                                == ProductBadge.New
                                    ? "New"
                                    : null,
                    product.Images
                        .OrderByDescending(
                            image =>
                                image.IsPrimary
                        )
                        .ThenBy(
                            image =>
                                image.SortOrder
                        )
                        .Select(
                            image =>
                                image.Url
                        )
                        .FirstOrDefault()
                        ?? string.Empty
                )
        )
        .ToListAsync(cancellationToken)
        .ConfigureAwait(false);

    return new PagedResult<ProductListItemDto>(
        items,
        page,
        pageSize,
        totalCount
    );
  }

  private static IOrderedQueryable<Product>
      ApplySorting(
          IQueryable<Product> query,
          string sortBy
      )
  {
    return sortBy switch
    {
      "price-low" =>
          query
              .OrderBy(
                  product =>
                      product.Price
              )
              .ThenBy(
                  product =>
                      product.Id
              ),

      "price-high" =>
          query
              .OrderByDescending(
                  product =>
                      product.Price
              )
              .ThenByDescending(
                  product =>
                      product.Id
              ),

      "rating" =>
          query
              .OrderByDescending(
                  product =>
                      product.AverageRating
              )
              .ThenByDescending(
                  product =>
                      product.Id
              ),

      _ =>
          query
              .OrderByDescending(
                  product =>
                      product.CreatedAtUtc
              )
              .ThenByDescending(
                  product =>
                      product.Id
              )
    };
  }
}
