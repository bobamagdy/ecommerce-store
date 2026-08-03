using HubShop.Application.Products.Queries.GetProductById;
using HubShop.Domain.Enums;
using HubShop.Infrastructure.Persistence;

using Microsoft.EntityFrameworkCore;

namespace HubShop.Infrastructure.Products.Queries.GetProductById;

public sealed class ProductDetailsReadService(
    HubShopDbContext dbContext
) : IProductDetailsReadService
{
  public async Task<ProductDetailsDto?> GetByIdAsync(
      Guid id,
      CancellationToken cancellationToken
  )
  {
    var product = await dbContext.Products
        .AsNoTracking()
        .Where(
            product =>
                product.Id == id
                && product.IsActive
        )
        .Select(
            product => new
            {
              product.Id,
              product.Name,
              product.Description,
              product.Sku,
              product.CategoryId,
              Category = product.Category.Name,
              product.BrandId,
              Brand = product.Brand.Name,
              product.Price,
              product.OldPrice,
              Rating = product.AverageRating,
              Reviews = product.ReviewCount,
              product.Stock,

              Badge =
                    product.Badge
                        == ProductBadge.Sale
                        ? "Sale"
                        : product.Badge
                            == ProductBadge.New
                            ? "New"
                            : null
            }
        )
        .SingleOrDefaultAsync(
            cancellationToken
        )
        .ConfigureAwait(false);

    if (product is null)
    {
      return null;
    }

    var images = await dbContext.ProductImages
        .AsNoTracking()
        .Where(
            image =>
                image.ProductId == product.Id
        )
        .OrderByDescending(
            image => image.IsPrimary
        )
        .ThenBy(
            image => image.SortOrder
        )
        .Select(
            image => image.Url
        )
        .ToListAsync(cancellationToken)
        .ConfigureAwait(false);

    return new ProductDetailsDto(
        product.Id,
        product.Name,
        product.Description,
        product.Sku,
        product.CategoryId,
        product.Category,
        product.BrandId,
        product.Brand,
        product.Price,
        product.OldPrice,
        product.Rating,
        product.Reviews,
        product.Stock,
        product.Stock > 0,
        product.Badge,
        images.FirstOrDefault()
            ?? string.Empty,
        images
    );
  }
}
