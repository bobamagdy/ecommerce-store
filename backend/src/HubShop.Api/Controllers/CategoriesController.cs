using HubShop.Application.Catalog.Queries.GetCatalogLookups;

using Microsoft.AspNetCore.Mvc;

namespace HubShop.Api.Controllers;

[ApiController]
[Route("api/categories")]
public sealed class CategoriesController(
    ICatalogLookupReadService catalogLookupReadService
) : ControllerBase
{
  [HttpGet]
  [ProducesResponseType(
      typeof(IReadOnlyList<CatalogLookupItemDto>),
      StatusCodes.Status200OK
  )]
  public async Task<
      ActionResult<
          IReadOnlyList<CatalogLookupItemDto>
      >
  > GetCategories(
      CancellationToken cancellationToken
  )
  {
    var categories =
        await catalogLookupReadService
            .GetCategoriesAsync(
                cancellationToken
            );

    return Ok(categories);
  }
}
