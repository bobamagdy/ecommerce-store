using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HubShop.Infrastructure.Persistence.Migrations
{
  /// <inheritdoc />
  public partial class OptimizeProductPaginationIndexes : Migration
  {
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.DropIndex(
          name: "IX_Products_BrandId_IsActive",
          table: "Products");

      migrationBuilder.DropIndex(
          name: "IX_Products_CategoryId_IsActive",
          table: "Products");

      migrationBuilder.DropIndex(
          name: "IX_Products_IsActive_CreatedAtUtc",
          table: "Products");

      migrationBuilder.RenameIndex(
          name: "IX_Products_Sku",
          table: "Products",
          newName: "UX_Products_Sku");

      migrationBuilder.CreateIndex(
          name: "IX_Products_BrandId_IsActive_CreatedAtUtc_Id",
          table: "Products",
          columns: new[] { "BrandId", "IsActive", "CreatedAtUtc", "Id" },
          descending: new[] { false, false, true, true });

      migrationBuilder.CreateIndex(
          name: "IX_Products_CategoryId_IsActive_CreatedAtUtc_Id",
          table: "Products",
          columns: new[] { "CategoryId", "IsActive", "CreatedAtUtc", "Id" },
          descending: new[] { false, false, true, true });

      migrationBuilder.CreateIndex(
          name: "IX_Products_IsActive_CreatedAtUtc_Id",
          table: "Products",
          columns: new[] { "IsActive", "CreatedAtUtc", "Id" },
          descending: new[] { false, true, true });

      migrationBuilder.CreateIndex(
          name: "IX_Products_IsActive_Price_Id",
          table: "Products",
          columns: new[] { "IsActive", "Price", "Id" });
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.DropIndex(
          name: "IX_Products_BrandId_IsActive_CreatedAtUtc_Id",
          table: "Products");

      migrationBuilder.DropIndex(
          name: "IX_Products_CategoryId_IsActive_CreatedAtUtc_Id",
          table: "Products");

      migrationBuilder.DropIndex(
          name: "IX_Products_IsActive_CreatedAtUtc_Id",
          table: "Products");

      migrationBuilder.DropIndex(
          name: "IX_Products_IsActive_Price_Id",
          table: "Products");

      migrationBuilder.RenameIndex(
          name: "UX_Products_Sku",
          table: "Products",
          newName: "IX_Products_Sku");

      migrationBuilder.CreateIndex(
          name: "IX_Products_BrandId_IsActive",
          table: "Products",
          columns: new[] { "BrandId", "IsActive" });

      migrationBuilder.CreateIndex(
          name: "IX_Products_CategoryId_IsActive",
          table: "Products",
          columns: new[] { "CategoryId", "IsActive" });

      migrationBuilder.CreateIndex(
          name: "IX_Products_IsActive_CreatedAtUtc",
          table: "Products",
          columns: new[] { "IsActive", "CreatedAtUtc" });
    }
  }
}
