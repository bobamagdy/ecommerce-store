using HubShop.Application.Common.Pagination;

namespace HubShop.Application.Products.Queries.GetProducts;

public interface IProductReadService
{
  Task<PagedResult<ProductListItemDto>> GetAsync(
      GetProductsQuery query,
      CancellationToken cancellationToken
  );
}
