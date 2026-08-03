namespace HubShop.Application.Products.Queries.GetProducts;

public sealed record GetProductsQuery(
    int Page = 1,
    int PageSize = 12,
    string? Search = null,
    Guid? CategoryId = null,
    Guid? BrandId = null,
    decimal? MinPrice = null,
    decimal? MaxPrice = null,
    string SortBy = "newest"
)
{
  public const int MaximumPageSize = 48;

  public int NormalizedPage =>
      Math.Max(Page, 1);

  public int NormalizedPageSize =>
      Math.Clamp(
          PageSize,
          1,
          MaximumPageSize
      );

  public string? NormalizedSearch =>
      string.IsNullOrWhiteSpace(Search)
          ? null
          : Search.Trim();

  public string NormalizedSortBy =>
      string.IsNullOrWhiteSpace(SortBy)
          ? "newest"
          : SortBy
              .Trim()
              .ToLowerInvariant();
}
