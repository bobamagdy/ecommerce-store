using HubShop.Application.Catalog.Queries.GetCatalogLookups;

using Microsoft.AspNetCore.Mvc;

namespace HubShop.Api.Controllers;

[ApiController]
[Route("api/brands")]
public sealed class BrandsController(
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
  > GetBrands(
      CancellationToken cancellationToken
  )
  {
    var brands =
        await catalogLookupReadService
            .GetBrandsAsync(
                cancellationToken
            );

    return Ok(brands);
  }
}
