using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HubShop.Infrastructure.Persistence.Migrations
{
  /// <inheritdoc />
  public partial class InitialCatalog : Migration
  {
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.CreateTable(
          name: "Brands",
          columns: table => new
          {
            Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
            Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
            Slug = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
            IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
          },
          constraints: table =>
          {
            table.PrimaryKey("PK_Brands", x => x.Id);
          });

      migrationBuilder.CreateTable(
          name: "Categories",
          columns: table => new
          {
            Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
            Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
            Slug = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
            IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
          },
          constraints: table =>
          {
            table.PrimaryKey("PK_Categories", x => x.Id);
          });

      migrationBuilder.CreateTable(
          name: "Products",
          columns: table => new
          {
            Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
            Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
            Description = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: false),
            Sku = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
            Price = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
            OldPrice = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
            AverageRating = table.Column<decimal>(type: "decimal(3,2)", precision: 3, scale: 2, nullable: false, defaultValue: 0m),
            ReviewCount = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
            Stock = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
            Badge = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
            IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
            CreatedAtUtc = table.Column<DateTime>(type: "datetime2(0)", precision: 0, nullable: false),
            UpdatedAtUtc = table.Column<DateTime>(type: "datetime2(0)", precision: 0, nullable: true),
            CategoryId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
            BrandId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
          },
          constraints: table =>
          {
            table.PrimaryKey("PK_Products", x => x.Id);
            table.ForeignKey(
                      name: "FK_Products_Brands_BrandId",
                      column: x => x.BrandId,
                      principalTable: "Brands",
                      principalColumn: "Id",
                      onDelete: ReferentialAction.Restrict);
            table.ForeignKey(
                      name: "FK_Products_Categories_CategoryId",
                      column: x => x.CategoryId,
                      principalTable: "Categories",
                      principalColumn: "Id",
                      onDelete: ReferentialAction.Restrict);
          });

      migrationBuilder.CreateTable(
          name: "ProductImages",
          columns: table => new
          {
            Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
            Url = table.Column<string>(type: "nvarchar(2048)", maxLength: 2048, nullable: false),
            AltText = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
            IsPrimary = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
            SortOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
            ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
          },
          constraints: table =>
          {
            table.PrimaryKey("PK_ProductImages", x => x.Id);
            table.ForeignKey(
                      name: "FK_ProductImages_Products_ProductId",
                      column: x => x.ProductId,
                      principalTable: "Products",
                      principalColumn: "Id",
                      onDelete: ReferentialAction.Cascade);
          });

      migrationBuilder.CreateIndex(
          name: "IX_Brands_Name",
          table: "Brands",
          column: "Name",
          unique: true);

      migrationBuilder.CreateIndex(
          name: "IX_Brands_Slug",
          table: "Brands",
          column: "Slug",
          unique: true);

      migrationBuilder.CreateIndex(
          name: "IX_Categories_Name",
          table: "Categories",
          column: "Name",
          unique: true);

      migrationBuilder.CreateIndex(
          name: "IX_Categories_Slug",
          table: "Categories",
          column: "Slug",
          unique: true);

      migrationBuilder.CreateIndex(
          name: "IX_ProductImages_ProductId",
          table: "ProductImages",
          column: "ProductId",
          unique: true,
          filter: "[IsPrimary] = 1");

      migrationBuilder.CreateIndex(
          name: "IX_ProductImages_ProductId_SortOrder",
          table: "ProductImages",
          columns: new[] { "ProductId", "SortOrder" },
          unique: true);

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

      migrationBuilder.CreateIndex(
          name: "IX_Products_Sku",
          table: "Products",
          column: "Sku",
          unique: true);
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.DropTable(
          name: "ProductImages");

      migrationBuilder.DropTable(
          name: "Products");

      migrationBuilder.DropTable(
          name: "Brands");

      migrationBuilder.DropTable(
          name: "Categories");
    }
  }
}
