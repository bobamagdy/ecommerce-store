using System.Net;
using System.Net.Http.Json;

using HubShop.Api.IntegrationTests.Infrastructure;
using HubShop.Application.Common.Pagination;
using HubShop.Application.Products.Queries.GetProducts;

using Microsoft.AspNetCore.Mvc.Testing;

namespace HubShop.Api.IntegrationTests.Products;

[Collection(IntegrationTestCollectionDefinition.Name)]
public sealed class ProductsEndpointTests
    : IDisposable
{
  private readonly HubShopApiFactory factory;

  private readonly HttpClient client;

  public ProductsEndpointTests(
      HubShopApiFactory factory
  )
  {
    this.factory = factory;

    client = factory.CreateClient(
        new WebApplicationFactoryClientOptions
        {
          BaseAddress =
                new Uri("https://localhost")
        }
    );
  }

  [Fact]
  public async Task GetProductsReturnsFirstPage()
  {
    var result = await GetProductsAsync(
        "?page=1&pageSize=12&sortBy=newest"
    );

    Assert.Equal(1, result.Page);

    Assert.Equal(12, result.PageSize);

    Assert.Equal(235, result.TotalCount);

    Assert.Equal(20, result.TotalPages);

    Assert.False(result.HasPreviousPage);

    Assert.True(result.HasNextPage);

    Assert.Equal(12, result.Items.Count);
  }

  [Fact]
  public async Task GetProductsReturnsLastPage()
  {
    var result = await GetProductsAsync(
        "?page=20&pageSize=12"
    );

    Assert.Equal(20, result.Page);

    Assert.Equal(7, result.Items.Count);

    Assert.True(result.HasPreviousPage);

    Assert.False(result.HasNextPage);
  }

  [Fact]
  public async Task GetProductsClampsLargePageSize()
  {
    var result = await GetProductsAsync(
        "?page=1&pageSize=500"
    );

    Assert.Equal(48, result.PageSize);

    Assert.Equal(48, result.Items.Count);

    Assert.Equal(5, result.TotalPages);
  }

  [Fact]
  public async Task GetProductsSortsByLowestPrice()
  {
    var result = await GetProductsAsync(
        "?page=1&pageSize=48"
        + "&sortBy=price-low"
    );

    var actualPrices =
        result.Items
            .Select(product => product.Price)
            .ToArray();

    var expectedPrices =
        actualPrices
            .OrderBy(price => price)
            .ToArray();

    Assert.Equal(
        expectedPrices,
        actualPrices
    );
  }

  [Fact]
  public async Task GetProductsSearchesByName()
  {
    var result = await GetProductsAsync(
        "?search=watch&pageSize=48"
    );

    Assert.NotEmpty(result.Items);

    Assert.All(
        result.Items,
        product =>
        {
          Assert.True(
                  product.Name.Contains(
                      "watch",
                      StringComparison.OrdinalIgnoreCase
                  )
              );
        }
    );
  }

  [Fact]
  public async Task GetProductsReturnsBadRequestWhenPriceRangeIsInvalid()
  {
    await factory.InitializeDatabaseAsync();

    using var response =
        await client.GetAsync(
            "/api/products"
            + "?minPrice=500"
            + "&maxPrice=100"
        );

    Assert.Equal(
        HttpStatusCode.BadRequest,
        response.StatusCode
    );
  }

  private async Task<
      PagedResult<ProductListItemDto>
  > GetProductsAsync(
      string queryString
  )
  {
    await factory.InitializeDatabaseAsync();

    using var response =
        await client.GetAsync(
            $"/api/products{queryString}"
        );

    response.EnsureSuccessStatusCode();

    var result =
        await response.Content
            .ReadFromJsonAsync<
                PagedResult<ProductListItemDto>
            >();

    return Assert.IsType<
        PagedResult<ProductListItemDto>
    >(result);
  }

  public void Dispose()
  {
    client.Dispose();
  }
}
