using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace BuildQuote.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "Quotes");

            migrationBuilder.CreateSequence<int>(
                name: "QuoteNumber",
                schema: "Quotes",
                startValue: 1000L);

            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    CategoryId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.CategoryId);
                });

            migrationBuilder.CreateTable(
                name: "Customers",
                columns: table => new
                {
                    CustomerId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AddressLine1 = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AddressLine2 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    City = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PostCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customers", x => x.CustomerId);
                });

            migrationBuilder.CreateTable(
                name: "Providers",
                columns: table => new
                {
                    ProviderId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ReceiveReports = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Providers", x => x.ProviderId);
                });

            migrationBuilder.CreateTable(
                name: "Reports",
                columns: table => new
                {
                    ReportId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ReportDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    NetTotal = table.Column<float>(type: "real", nullable: false),
                    TotalVat = table.Column<float>(type: "real", nullable: false),
                    GrandTotal = table.Column<float>(type: "real", nullable: false),
                    QuotesCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reports", x => x.ReportId);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    ProductId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UnitPrice = table.Column<float>(type: "real", nullable: false),
                    VatRate = table.Column<float>(type: "real", nullable: false),
                    TimeCreated = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TimeLastUpdated = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CategoryId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.ProductId);
                    table.ForeignKey(
                        name: "FK_Products_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "CategoryId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Quotes",
                columns: table => new
                {
                    QuoteId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    QuoteNumber = table.Column<int>(type: "int", nullable: true, defaultValueSql: "NEXT VALUE FOR Quotes.QuoteNumber"),
                    NetPrice = table.Column<float>(type: "real", nullable: false),
                    TotalVat = table.Column<float>(type: "real", nullable: false),
                    GrandTotal = table.Column<float>(type: "real", nullable: false),
                    TimeCreated = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TimeLastUpdated = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TimeEmailed = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CustomerId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    ProviderId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Quotes", x => x.QuoteId);
                    table.ForeignKey(
                        name: "FK_Quotes_Customers_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customers",
                        principalColumn: "CustomerId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Quotes_Providers_ProviderId",
                        column: x => x.ProviderId,
                        principalTable: "Providers",
                        principalColumn: "ProviderId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "QuoteProducts",
                columns: table => new
                {
                    QuoteProductId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UnitPrice = table.Column<float>(type: "real", nullable: false),
                    VatRate = table.Column<float>(type: "real", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    TimeUpdated = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CategoryId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    QuoteId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProductId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuoteProducts", x => x.QuoteProductId);
                    table.ForeignKey(
                        name: "FK_QuoteProducts_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "CategoryId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuoteProducts_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "ProductId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuoteProducts_Quotes_QuoteId",
                        column: x => x.QuoteId,
                        principalTable: "Quotes",
                        principalColumn: "QuoteId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ReportQuotes",
                columns: table => new
                {
                    ReportQuoteId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    QuoteNumber = table.Column<int>(type: "int", nullable: true),
                    NetPrice = table.Column<float>(type: "real", nullable: false),
                    TotalVat = table.Column<float>(type: "real", nullable: false),
                    GrandTotal = table.Column<float>(type: "real", nullable: false),
                    ProviderName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CustomerName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProviderId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    QuoteId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ReportId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReportQuotes", x => x.ReportQuoteId);
                    table.ForeignKey(
                        name: "FK_ReportQuotes_Providers_ProviderId",
                        column: x => x.ProviderId,
                        principalTable: "Providers",
                        principalColumn: "ProviderId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ReportQuotes_Quotes_QuoteId",
                        column: x => x.QuoteId,
                        principalTable: "Quotes",
                        principalColumn: "QuoteId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ReportQuotes_Reports_ReportId",
                        column: x => x.ReportId,
                        principalTable: "Reports",
                        principalColumn: "ReportId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "CategoryId", "Name" },
                values: new object[,]
                {
                    { "cf0082a9-59e9-4dfd-8608-53bc9e89caca", "Service" },
                    { "88501ef1-03a9-49dd-b980-c974ae55c5c7", "Kitchen" },
                    { "bc76167f-4be2-42e1-b49e-d2a085d6567f", "Bathroom" },
                    { "318a96db-aefb-4a7a-a1cc-01165cd1fc72", "Garden" },
                    { "66dc555b-af11-42a0-88f2-946ccd0fae62", "Materials" },
                    { "4fd6f1cd-1d78-46e9-b4f0-d216c97d5a2d", "Doors" },
                    { "af873980-3606-4106-9945-196bc1c62d65", "Windows" },
                    { "4d6b4168-4e6c-458c-9e74-9ee75572a886", "Floorings" },
                    { "463b697b-e3ca-4d5d-b653-d144219addd4", "Tiles" },
                    { "ffce44ee-6f09-492a-9c37-2d1372505f4f", "Paint" },
                    { "c0642503-84ea-426e-b526-3fa2998b10d9", "Electricals" },
                    { "1d5b0802-da1b-43e1-b71d-76fc850ef0b4", "Nails, Screws & Adhesives" },
                    { "97299015-e0f9-4524-82b9-44a05a41f8c8", "Timber" },
                    { "390e9c67-d500-49a9-8abe-c522ac9cbf60", "Heating & Plumbing" }
                });

            migrationBuilder.InsertData(
                table: "Customers",
                columns: new[] { "CustomerId", "AddressLine1", "AddressLine2", "City", "Email", "FirstName", "LastName", "Phone", "PostCode" },
                values: new object[] { "c200c661-5ccb-4944-8cc1-f6158700349b", "123 Real Street", null, "Genuineville", "kaz.tomer@email.com", "Kaz", "Tomer", "07987654321", "GN1 2AB" });

            migrationBuilder.InsertData(
                table: "Providers",
                columns: new[] { "ProviderId", "Email", "FirstName", "LastName", "Phone", "ReceiveReports" },
                values: new object[] { "a56583c3-0391-4bba-bf91-b1f0f0ace6ca", "bill.durr@builders.co.uk", "Bill", "Durr", "07123456789", false });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "ProductId", "CategoryId", "Name", "TimeCreated", "TimeLastUpdated", "UnitPrice", "VatRate" },
                values: new object[,]
                {
                    { "0eb965dd-a7d0-48fc-b4d8-ad8ee2e81e43", "ffce44ee-6f09-492a-9c37-2d1372505f4f", "Red Paint (2.5L)", new DateTime(2021, 11, 7, 10, 55, 42, 159, DateTimeKind.Utc).AddTicks(2791), new DateTime(2021, 11, 7, 10, 55, 42, 159, DateTimeKind.Utc).AddTicks(2791), 12f, 20f },
                    { "e3d4aa3f-16b2-46bb-9865-d5c20a31029c", "ffce44ee-6f09-492a-9c37-2d1372505f4f", "Blue Paint (2.5L)", new DateTime(2021, 11, 7, 10, 55, 42, 159, DateTimeKind.Utc).AddTicks(2791), new DateTime(2021, 11, 7, 10, 55, 42, 159, DateTimeKind.Utc).AddTicks(2791), 12f, 20f },
                    { "a13e03bf-b2eb-4fed-b09c-bddfb1438fe1", "ffce44ee-6f09-492a-9c37-2d1372505f4f", "Green Paint (2.5L)", new DateTime(2021, 11, 7, 10, 55, 42, 159, DateTimeKind.Utc).AddTicks(2791), new DateTime(2021, 11, 7, 10, 55, 42, 159, DateTimeKind.Utc).AddTicks(2791), 12f, 20f }
                });

            migrationBuilder.InsertData(
                table: "Quotes",
                columns: new[] { "QuoteId", "CustomerId", "GrandTotal", "NetPrice", "ProviderId", "TimeCreated", "TimeEmailed", "TimeLastUpdated", "TotalVat" },
                values: new object[] { "65628bed-e53d-48ed-866c-562dcb97d7dd", "c200c661-5ccb-4944-8cc1-f6158700349b", 86.4f, 72f, "a56583c3-0391-4bba-bf91-b1f0f0ace6ca", new DateTime(2021, 11, 7, 10, 55, 42, 159, DateTimeKind.Utc).AddTicks(2791), null, new DateTime(2021, 11, 7, 10, 55, 42, 159, DateTimeKind.Utc).AddTicks(2791), 14.4f });

            migrationBuilder.InsertData(
                table: "QuoteProducts",
                columns: new[] { "QuoteProductId", "CategoryId", "Name", "ProductId", "Quantity", "QuoteId", "TimeUpdated", "UnitPrice", "VatRate" },
                values: new object[] { "9eaa1705-2513-441c-a5ac-beef42c4d5df", "ffce44ee-6f09-492a-9c37-2d1372505f4f", "Red Paint (2.5L)", "0eb965dd-a7d0-48fc-b4d8-ad8ee2e81e43", 2, "65628bed-e53d-48ed-866c-562dcb97d7dd", new DateTime(2021, 11, 7, 10, 55, 42, 159, DateTimeKind.Utc).AddTicks(2791), 12f, 20f });

            migrationBuilder.InsertData(
                table: "QuoteProducts",
                columns: new[] { "QuoteProductId", "CategoryId", "Name", "ProductId", "Quantity", "QuoteId", "TimeUpdated", "UnitPrice", "VatRate" },
                values: new object[] { "f4974c5c-70de-41ac-b964-54caafadbf4c", "ffce44ee-6f09-492a-9c37-2d1372505f4f", "Green Paint (2.5L)", "a13e03bf-b2eb-4fed-b09c-bddfb1438fe1", 1, "65628bed-e53d-48ed-866c-562dcb97d7dd", new DateTime(2021, 11, 7, 10, 55, 42, 159, DateTimeKind.Utc).AddTicks(2791), 12f, 20f });

            migrationBuilder.InsertData(
                table: "QuoteProducts",
                columns: new[] { "QuoteProductId", "CategoryId", "Name", "ProductId", "Quantity", "QuoteId", "TimeUpdated", "UnitPrice", "VatRate" },
                values: new object[] { "6921933f-abfc-4d15-a166-fff9b18b5121", "ffce44ee-6f09-492a-9c37-2d1372505f4f", "Blue Paint (2.5L)", "e3d4aa3f-16b2-46bb-9865-d5c20a31029c", 3, "65628bed-e53d-48ed-866c-562dcb97d7dd", new DateTime(2021, 11, 7, 10, 55, 42, 159, DateTimeKind.Utc).AddTicks(2791), 12f, 20f });

            migrationBuilder.CreateIndex(
                name: "IX_Products_CategoryId",
                table: "Products",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_QuoteProducts_CategoryId",
                table: "QuoteProducts",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_QuoteProducts_ProductId",
                table: "QuoteProducts",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_QuoteProducts_QuoteId",
                table: "QuoteProducts",
                column: "QuoteId");

            migrationBuilder.CreateIndex(
                name: "IX_Quotes_CustomerId",
                table: "Quotes",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_Quotes_ProviderId",
                table: "Quotes",
                column: "ProviderId");

            migrationBuilder.CreateIndex(
                name: "IX_ReportQuotes_ProviderId",
                table: "ReportQuotes",
                column: "ProviderId");

            migrationBuilder.CreateIndex(
                name: "IX_ReportQuotes_QuoteId",
                table: "ReportQuotes",
                column: "QuoteId");

            migrationBuilder.CreateIndex(
                name: "IX_ReportQuotes_ReportId",
                table: "ReportQuotes",
                column: "ReportId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "QuoteProducts");

            migrationBuilder.DropTable(
                name: "ReportQuotes");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "Quotes");

            migrationBuilder.DropTable(
                name: "Reports");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropTable(
                name: "Customers");

            migrationBuilder.DropTable(
                name: "Providers");

            migrationBuilder.DropSequence(
                name: "QuoteNumber",
                schema: "Quotes");
        }
    }
}
