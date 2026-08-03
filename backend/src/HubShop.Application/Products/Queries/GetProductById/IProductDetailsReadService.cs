namespace HubShop.Application.Products.Queries.GetProductById;

public interface IProductDetailsReadService
{
  Task<ProductDetailsDto?> GetByIdAsync(
      Guid id,
      CancellationToken cancellationToken
  );
}
