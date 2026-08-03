using HubShop.Domain.Entities;
using HubShop.Domain.Enums;

using Microsoft.EntityFrameworkCore;

namespace HubShop.Infrastructure.Persistence.Seeding;

public static class CatalogSeeder
{
  public static void Seed(
      HubShopDbContext context
  )
  {
    ArgumentNullException.ThrowIfNull(context);

    SeedAsync(
        context,
        CancellationToken.None
    )
    .GetAwaiter()
    .GetResult();
  }

  public static async Task SeedAsync(
      HubShopDbContext context,
      CancellationToken cancellationToken
  )
  {
    ArgumentNullException.ThrowIfNull(context);

    var categories = await context.Categories
        .ToListAsync(cancellationToken)
        .ConfigureAwait(false);

    var categoryBySlug = categories.ToDictionary(
        category => category.Slug,
        StringComparer.OrdinalIgnoreCase
    );

    foreach (
        var categorySeed in
        CatalogSeedData.Categories
    )
    {
      if (
          categoryBySlug.ContainsKey(
              categorySeed.Slug
          )
      )
      {
        continue;
      }

      var category = new Category
      {
        Name = categorySeed.Name,
        Slug = categorySeed.Slug,
        IsActive = true
      };

      context.Categories.Add(category);

      categoryBySlug.Add(
          category.Slug,
          category
      );
    }

    var brands = await context.Brands
        .ToListAsync(cancellationToken)
        .ConfigureAwait(false);

    var brandByName = brands.ToDictionary(
        brand => brand.Name,
        StringComparer.OrdinalIgnoreCase
    );

    foreach (
        var brandName in
        CatalogSeedData.Brands
    )
    {
      if (brandByName.ContainsKey(brandName))
      {
        continue;
      }

      var brand = new Brand
      {
        Name = brandName,
        Slug = ToSlug(brandName),
        IsActive = true
      };

      context.Brands.Add(brand);

      brandByName.Add(
          brand.Name,
          brand
      );
    }

    if (context.ChangeTracker.HasChanges())
    {
      await context.SaveChangesAsync(
          cancellationToken
      )
      .ConfigureAwait(false);
    }

    var existingSkuList = await context.Products
        .AsNoTracking()
        .Select(product => product.Sku)
        .ToListAsync(cancellationToken)
        .ConfigureAwait(false);

    var existingSkus = existingSkuList.ToHashSet(
        StringComparer.OrdinalIgnoreCase
    );

    var generatedProducts = GenerateProducts(
        categoryBySlug,
        brandByName
    );

    var missingProducts = generatedProducts
        .Where(
            product =>
                !existingSkus.Contains(product.Sku)
        )
        .ToList();

    if (missingProducts.Count == 0)
    {
      return;
    }

    await context.Products.AddRangeAsync(
        missingProducts,
        cancellationToken
    )
    .ConfigureAwait(false);

    await context.SaveChangesAsync(
        cancellationToken
    )
    .ConfigureAwait(false);
  }

  private static List<Product> GenerateProducts(
  Dictionary<string, Category> categoryBySlug,
  Dictionary<string, Brand> brandByName
)
  {
    var random = new Random(
        CatalogSeedData.RandomSeed
    );

    var products = new List<Product>(
        CatalogSeedData.Categories.Count
        * CatalogSeedData.ProductsPerCategory
    );

    var globalProductIndex = 0;

    foreach (
        var categorySeed in
        CatalogSeedData.Categories
    )
    {
      var category =
          categoryBySlug[categorySeed.Slug];

      for (
          var categoryProductIndex = 1;
          categoryProductIndex
              <= CatalogSeedData.ProductsPerCategory;
          categoryProductIndex++
      )
      {
        globalProductIndex++;

        var baseName =
            categorySeed.ProductNames[
                (categoryProductIndex - 1)
                % categorySeed.ProductNames.Count
            ];

        var descriptor =
            CatalogSeedData.Descriptors[
                (globalProductIndex - 1)
                % CatalogSeedData.Descriptors.Count
            ];

        var productName =
            $"{descriptor} {baseName}";

        var brandName =
            categorySeed.BrandNames[
                (categoryProductIndex - 1)
                % categorySeed.BrandNames.Count
            ];

        var brand = brandByName[brandName];

        var sku =
            $"{categorySeed.SkuPrefix}-"
            + $"{categoryProductIndex:000}";

        var price = NextDecimal(
            random,
            categorySeed.MinPrice,
            categorySeed.MaxPrice
        );

        var isSale =
            globalProductIndex % 5 == 0;

        ProductBadge? badge = isSale
? ProductBadge.Sale
: globalProductIndex % 7 == 0
? ProductBadge.New
: null;

        decimal? oldPrice = null;

        if (isSale)
        {
          var discountRate = NextDecimal(
              random,
              0.10m,
              0.35m
          );

          oldPrice = Math.Round(
              price / (1 - discountRate),
              2,
              MidpointRounding.AwayFromZero
          );
        }

        var createdAtUtc =
            CatalogSeedData.SeedStartUtc
                .AddDays(
                    globalProductIndex - 1
                );

        var product = new Product
        {
          Name = productName,

          Description =
                $"{productName} by {brand.Name}. "
                + "Designed for reliable everyday "
                + $"use in the {category.Name} "
                + "category, with practical "
                + "features and durable materials.",

          Sku = sku,

          Price = price,

          OldPrice = oldPrice,

          AverageRating = NextDecimal(
                random,
                3.40m,
                5.00m
            ),

          ReviewCount = random.Next(
                4,
                1_501
            ),

          Stock =
                globalProductIndex % 17 == 0
                    ? 0
                    : random.Next(5, 151),

          Badge = badge,

          IsActive =
                globalProductIndex % 48 != 0,

          CreatedAtUtc = createdAtUtc,

          UpdatedAtUtc =
                globalProductIndex % 9 == 0
                    ? createdAtUtc.AddHours(12)
                    : null,

          CategoryId = category.Id,

          Category = category,

          BrandId = brand.Id,

          Brand = brand
        };

        AddImages(product);

        products.Add(product);
      }
    }

    return products;
  }

  private static void AddImages(
      Product product
  )
  {
    for (
        var imageNumber = 1;
        imageNumber
            <= CatalogSeedData.ImagesPerProduct;
        imageNumber++
    )
    {
      var image = new ProductImage
      {
        Url =
              "https://picsum.photos/seed/"
              + $"{product.Sku.ToLowerInvariant()}"
              + $"-{imageNumber}/1200/900",

        AltText =
              $"{product.Name} image {imageNumber}",

        IsPrimary = imageNumber == 1,

        SortOrder = imageNumber,

        ProductId = product.Id,

        Product = product
      };

      product.Images.Add(image);
    }
  }

  private static decimal NextDecimal(
      Random random,
      decimal minimum,
      decimal maximum
  )
  {
    var value =
        minimum
        + ((decimal)random.NextDouble()
            * (maximum - minimum));

    return Math.Round(
        value,
        2,
        MidpointRounding.AwayFromZero
    );
  }

  private static string ToSlug(
      string value
  )
  {
    return value
        .Trim()
        .ToLowerInvariant()
        .Replace(
            " ",
            "-",
            StringComparison.Ordinal
        );
  }
}
