using HubShop.Application.Common.Pagination;
using HubShop.Application.Products.Queries.GetProductById;
using HubShop.Application.Products.Queries.GetProducts;

using Microsoft.AspNetCore.Mvc;

namespace HubShop.Api.Controllers;

[ApiController]
[Route("api/products")]
public sealed class ProductsController(
    IProductReadService productReadService,
    IProductDetailsReadService productDetailsReadService
) : ControllerBase
{
  [HttpGet]
  [ProducesResponseType(
      typeof(PagedResult<ProductListItemDto>),
      StatusCodes.Status200OK
  )]
  [ProducesResponseType(
      typeof(ValidationProblemDetails),
      StatusCodes.Status400BadRequest
  )]
  public async Task<
      ActionResult<PagedResult<ProductListItemDto>>
  > GetProducts(
      [FromQuery] GetProductsQuery query,
      CancellationToken cancellationToken
  )
  {
    ValidateQuery(query);

    if (!ModelState.IsValid)
    {
      return ValidationProblem(ModelState);
    }

    var result =
        await productReadService.GetAsync(
            query,
            cancellationToken
        );

    return Ok(result);
  }

  [HttpGet("{id:guid}")]
  [ProducesResponseType(
      typeof(ProductDetailsDto),
      StatusCodes.Status200OK
  )]
  [ProducesResponseType(
      StatusCodes.Status404NotFound
  )]
  public async Task<
      ActionResult<ProductDetailsDto>
  > GetProductById(
      Guid id,
      CancellationToken cancellationToken
  )
  {
    var product =
        await productDetailsReadService
            .GetByIdAsync(
                id,
                cancellationToken
            );

    if (product is null)
    {
      return NotFound();
    }

    return Ok(product);
  }

  private void ValidateQuery(
      GetProductsQuery query
  )
  {
    if (query.MinPrice is < 0)
    {
      ModelState.AddModelError(
          nameof(query.MinPrice),
          "Minimum price cannot be negative."
      );
    }

    if (query.MaxPrice is < 0)
    {
      ModelState.AddModelError(
          nameof(query.MaxPrice),
          "Maximum price cannot be negative."
      );
    }

    if (
        query.MinPrice.HasValue
        && query.MaxPrice.HasValue
        && query.MinPrice.Value
            > query.MaxPrice.Value
    )
    {
      ModelState.AddModelError(
          nameof(query.MinPrice),
          "Minimum price cannot be greater "
          + "than maximum price."
      );
    }

    if (
        !IsSupportedSort(
            query.NormalizedSortBy
        )
    )
    {
      ModelState.AddModelError(
          nameof(query.SortBy),
          "Sort must be one of: newest, "
          + "price-low, price-high or rating."
      );
    }
  }

  private static bool IsSupportedSort(
      string sortBy
  )
  {
    return sortBy is
        "newest"
        or "price-low"
        or "price-high"
        or "rating";
  }
}
