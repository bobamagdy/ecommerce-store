namespace HubShop.Api.IntegrationTests.Infrastructure;

[CollectionDefinition(
    "HubShop API integration tests",
    DisableParallelization = true
)]
public sealed class IntegrationTestCollectionDefinition
    : ICollectionFixture<HubShopApiFactory>
{
  public const string Name =
      "HubShop API integration tests";
}
