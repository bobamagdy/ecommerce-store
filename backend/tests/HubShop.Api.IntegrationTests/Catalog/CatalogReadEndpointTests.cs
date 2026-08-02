using System.Net;
using System.Net.Http.Json;

using HubShop.Api.IntegrationTests.Infrastructure;
using HubShop.Application.Catalog.Queries.GetCatalogLookups;
using HubShop.Application.Common.Pagination;
using HubShop.Application.Products.Queries.GetProductById;
using HubShop.Application.Products.Queries.GetProducts;

using Microsoft.AspNetCore.Mvc.Testing;

namespace HubShop.Api.IntegrationTests.Catalog;

[Collection(IntegrationTestCollectionDefinition.Name)]
public sealed class CatalogReadEndpointTests
    : IDisposable
{
  private readonly HubShopApiFactory factory;

  private readonly HttpClient client;

  public CatalogReadEndpointTests(
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
  public async Task GetProductByIdReturnsDetails()
  {
    await factory.InitializeDatabaseAsync();

    using var productsResponse =
        await client.GetAsync(
            "/api/products?page=1&pageSize=1"
        );

    productsResponse.EnsureSuccessStatusCode();

    var productsResult =
        await productsResponse.Content
            .ReadFromJsonAsync<
                PagedResult<ProductListItemDto>
            >();

    var productsPage = Assert.IsType<
        PagedResult<ProductListItemDto>
    >(productsResult);

    var productSummary =
        Assert.Single(productsPage.Items);

    using var detailsResponse =
        await client.GetAsync(
            $"/api/products/{productSummary.Id}"
        );

    detailsResponse.EnsureSuccessStatusCode();

    var detailsResult =
        await detailsResponse.Content
            .ReadFromJsonAsync<ProductDetailsDto>();

    var productDetails =
        Assert.IsType<ProductDetailsDto>(
            detailsResult
        );

    Assert.Equal(
        productSummary.Id,
        productDetails.Id
    );

    Assert.Equal(
        productSummary.Name,
        productDetails.Name
    );

    Assert.Equal(
        productSummary.Category,
        productDetails.Category
    );

    Assert.Equal(
        productSummary.Brand,
        productDetails.Brand
    );

    Assert.Equal(
        productSummary.Price,
        productDetails.Price
    );

    Assert.Equal(
        productSummary.Stock,
        productDetails.Stock
    );

    Assert.Equal(
        productDetails.Stock > 0,
        productDetails.IsInStock
    );

    Assert.False(
        string.IsNullOrWhiteSpace(
            productDetails.Description
        )
    );

    Assert.False(
        string.IsNullOrWhiteSpace(
            productDetails.Sku
        )
    );

    Assert.Equal(
        3,
        productDetails.Images.Count
    );

    Assert.Equal(
        productDetails.Images[0],
        productDetails.Image
    );
  }

  [Fact]
  public async Task GetProductByIdReturnsNotFound()
  {
    await factory.InitializeDatabaseAsync();

    using var response =
        await client.GetAsync(
            "/api/products/"
            + "00000000-0000-0000-0000-"
            + "000000000001"
        );

    Assert.Equal(
        HttpStatusCode.NotFound,
        response.StatusCode
    );
  }

  [Fact]
  public async Task GetCategoriesReturnsSeededData()
  {
    var categories =
        await GetLookupsAsync(
            "/api/categories"
        );

    Assert.Equal(
        12,
        categories.Count
    );

    Assert.All(
        categories,
        category =>
        {
          Assert.NotEqual(
                  Guid.Empty,
                  category.Id
              );

          Assert.False(
                  string.IsNullOrWhiteSpace(
                      category.Name
                  )
              );

          Assert.False(
                  string.IsNullOrWhiteSpace(
                      category.Slug
                  )
              );

          Assert.True(
                  category.ProductCount > 0
              );
        }
    );

    Assert.Equal(
        235,
        categories.Sum(
            category =>
                category.ProductCount
        )
    );

    var actualNames =
        categories
            .Select(category => category.Name)
            .ToArray();

    var expectedNames =
        actualNames
            .OrderBy(
                name => name,
                StringComparer.Ordinal
            )
            .ToArray();

    Assert.Equal(
        expectedNames,
        actualNames
    );
  }

  [Fact]
  public async Task GetBrandsReturnsSeededData()
  {
    var brands =
        await GetLookupsAsync(
            "/api/brands"
        );

    Assert.Equal(
        20,
        brands.Count
    );

    Assert.All(
        brands,
        brand =>
        {
          Assert.NotEqual(
                  Guid.Empty,
                  brand.Id
              );

          Assert.False(
                  string.IsNullOrWhiteSpace(
                      brand.Name
                  )
              );

          Assert.False(
                  string.IsNullOrWhiteSpace(
                      brand.Slug
                  )
              );

          Assert.True(
                  brand.ProductCount > 0
              );
        }
    );

    Assert.Equal(
        235,
        brands.Sum(
            brand =>
                brand.ProductCount
        )
    );

    var actualNames =
        brands
            .Select(brand => brand.Name)
            .ToArray();

    var expectedNames =
        actualNames
            .OrderBy(
                name => name,
                StringComparer.Ordinal
            )
            .ToArray();

    Assert.Equal(
        expectedNames,
        actualNames
    );
  }

  private async Task<
      List<CatalogLookupItemDto>
  > GetLookupsAsync(
      string requestUri
  )
  {
    await factory.InitializeDatabaseAsync();

    using var response =
        await client.GetAsync(requestUri);

    response.EnsureSuccessStatusCode();

    var result =
        await response.Content
            .ReadFromJsonAsync<
                List<CatalogLookupItemDto>
            >();

    return Assert.IsType<
        List<CatalogLookupItemDto>
    >(result);
  }

  public void Dispose()
  {
    client.Dispose();
  }
}
