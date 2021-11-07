using BuildQuote.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace BuildQuote.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options) { }

        public DbSet<Quote> Quotes { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Provider> Providers { get; set; }
        public DbSet<QuoteProduct> QuoteProducts { get; set; }
        public DbSet<Report> Reports { get; set; }
        public DbSet<ReportQuote> ReportQuotes { get; set; }

        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    optionsBuilder.EnableSensitiveDataLogging();
        //}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Quote>().ToTable("Quotes");
            modelBuilder.Entity<Product>().ToTable("Products");
            modelBuilder.Entity<Category>().ToTable("Categories");
            modelBuilder.Entity<Customer>().ToTable("Customers");
            modelBuilder.Entity<Provider>().ToTable("Providers");
            modelBuilder.Entity<QuoteProduct>().ToTable("QuoteProducts");
            modelBuilder.Entity<Report>().ToTable("Reports");
            modelBuilder.Entity<ReportQuote>().ToTable("ReportQuotes");

            modelBuilder.HasSequence<int>("QuoteNumber", schema: "Quotes")
                .StartsAt(1000)
                .IncrementsBy(1);

            string customerId = Guid.NewGuid().ToString();

            modelBuilder.Entity<Customer>().HasData(
                new Customer()
                {
                    CustomerId = customerId,
                    FirstName = "Kaz",
                    LastName = "Tomer",
                    AddressLine1 = "123 Real Street",
                    City = "Genuineville",
                    PostCode = "GN1 2AB",
                    Email = "kaz.tomer@email.com",
                    Phone = "07987654321"
                }
            );

            string providerId = Guid.NewGuid().ToString();

            modelBuilder.Entity<Provider>().HasData(
                new Provider()
                {
                    ProviderId = providerId,
                    FirstName = "Bill",
                    LastName = "Durr",
                    Email = "bill.durr@builders.co.uk",
                    Phone = "07123456789",
                    ReceiveReports = false,
                }
            );

            string serviceCategoryId = Guid.NewGuid().ToString();
            string kitchenCategoryId = Guid.NewGuid().ToString();
            string bathroomCategoryId = Guid.NewGuid().ToString();
            string gardenCategoryId = Guid.NewGuid().ToString();
            string materialsCategoryId = Guid.NewGuid().ToString();
            string doorsCategoryId = Guid.NewGuid().ToString();
            string windowsCategoryId = Guid.NewGuid().ToString();
            string flooringCategoryId = Guid.NewGuid().ToString();
            string tilesCategoryId = Guid.NewGuid().ToString();
            string paintCategoryId = Guid.NewGuid().ToString();
            string electricalsCatergoryId = Guid.NewGuid().ToString();
            string nailsScrewsAdhesivesCategoryId = Guid.NewGuid().ToString();
            string timberCategory = Guid.NewGuid().ToString();
            string heatingPlumbingCategoryId = Guid.NewGuid().ToString();

            modelBuilder.Entity<Category>().HasData(
                new Category()
                {
                    CategoryId = serviceCategoryId,
                    Name = "Service"
                },
                new Category()
                {
                    CategoryId = kitchenCategoryId,
                    Name = "Kitchen"
                },
                new Category()
                {
                    CategoryId = bathroomCategoryId,
                    Name = "Bathroom"
                },
                new Category()
                {
                    CategoryId = gardenCategoryId,
                    Name = "Garden"
                },
                new Category()
                {
                    CategoryId = materialsCategoryId,
                    Name = "Materials"
                },
                new Category()
                {
                    CategoryId = doorsCategoryId,
                    Name = "Doors"
                },
                new Category()
                {
                    CategoryId = windowsCategoryId,
                    Name = "Windows"
                },
                new Category()
                {
                    CategoryId = flooringCategoryId,
                    Name = "Floorings"
                },
                new Category()
                {
                    CategoryId = tilesCategoryId,
                    Name = "Tiles"
                },
                new Category()
                {
                    CategoryId = paintCategoryId,
                    Name = "Paint"
                },
                new Category()
                {
                    CategoryId = electricalsCatergoryId,
                    Name = "Electricals"
                },
                new Category()
                {
                    CategoryId = nailsScrewsAdhesivesCategoryId,
                    Name = "Nails, Screws & Adhesives"
                },
                new Category()
                {
                    CategoryId = timberCategory,
                    Name = "Timber"
                },
                new Category()
                {
                    CategoryId = heatingPlumbingCategoryId,
                    Name = "Heating & Plumbing"
                }
            );

            string redPaintId = Guid.NewGuid().ToString();
            string bluePaintId = Guid.NewGuid().ToString();
            string greenPaintId = Guid.NewGuid().ToString();
            DateTime now = DateTime.UtcNow;

            modelBuilder.Entity<Product>().HasData(
                new Product()
                {
                    ProductId = redPaintId,
                    Name = "Red Paint (2.5L)",
                    UnitPrice = 12.00f,
                    VatRate = 20f,
                    TimeCreated = now,
                    TimeLastUpdated = now,
                    CategoryId = paintCategoryId
                },
                new Product()
                {
                    ProductId = bluePaintId,
                    Name = "Blue Paint (2.5L)",
                    UnitPrice = 12.00f,
                    VatRate = 20f,
                    TimeCreated = now,
                    TimeLastUpdated = now,
                    CategoryId = paintCategoryId
                },
                new Product()
                {
                    ProductId = greenPaintId,
                    Name = "Green Paint (2.5L)",
                    UnitPrice = 12.00f,
                    VatRate = 20f,
                    TimeCreated = now,
                    TimeLastUpdated = now,
                    CategoryId = paintCategoryId
                }
            );

            string quoteId = Guid.NewGuid().ToString();

            modelBuilder.Entity<Quote>()
                .Property(p => p.QuoteNumber)
                .HasDefaultValueSql("NEXT VALUE FOR Quotes.QuoteNumber");

            modelBuilder.Entity<Quote>().HasData(
                new Quote()
                {
                    QuoteId = quoteId,
                    NetPrice = 72.00f,
                    TotalVat = 14.40f,
                    GrandTotal = 86.40f,
                    TimeCreated = now,
                    TimeLastUpdated = now,
                    CustomerId = customerId,
                    ProviderId = providerId
                }
            ); ;

            string quoteProduct1Id = Guid.NewGuid().ToString();
            string quoteProduct2Id = Guid.NewGuid().ToString();
            string quoteProduct3Id = Guid.NewGuid().ToString();

            modelBuilder.Entity<QuoteProduct>().HasData(
                new QuoteProduct()
                {
                    QuoteProductId = quoteProduct1Id,
                    Name = "Red Paint (2.5L)",
                    UnitPrice = 12.00f,
                    VatRate = 20f,
                    Quantity = 2,
                    TimeUpdated = now,
                    CategoryId = paintCategoryId,
                    ProductId = redPaintId,
                    QuoteId = quoteId
                },
                new QuoteProduct()
                {
                    QuoteProductId = quoteProduct2Id,
                    Name = "Green Paint (2.5L)",
                    UnitPrice = 12.00f,
                    VatRate = 20f,
                    Quantity = 1,
                    TimeUpdated = now,
                    CategoryId = paintCategoryId,
                    ProductId = greenPaintId,
                    QuoteId = quoteId
                },
                new QuoteProduct()
                {
                    QuoteProductId = quoteProduct3Id,
                    Name = "Blue Paint (2.5L)",
                    UnitPrice = 12.00f,
                    VatRate = 20f,
                    Quantity = 3,
                    TimeUpdated = now,
                    CategoryId = paintCategoryId,
                    ProductId = bluePaintId,
                    QuoteId = quoteId
                }
            );
        }
    }
}
