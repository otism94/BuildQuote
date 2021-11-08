using BuildQuote.Models;
using System;
using System.Linq;

namespace BuildQuote.Data
{
    public static class DbInit
    {
        public static void Initialise(DataContext context)
        {
            context.Database.EnsureCreated();

            if (context.Providers.Any()) return;

            // Seed customer data.
            string customerId = Guid.NewGuid().ToString();
            context.Customers.Add(new Customer()
            {
                CustomerId = customerId,
                FirstName = "Kaz",
                LastName = "Tomer",
                AddressLine1 = "123 Real Street",
                City = "Genuineville",
                PostCode = "GN1 2AB",
                Email = "kaz.tomer@email.com",
                Phone = "07987654321"
            });

            context.SaveChanges();

            // Seed provider data.
            string providerId = Guid.NewGuid().ToString();
            context.Providers.Add(new Provider()
            {
                ProviderId = providerId,
                FirstName = "Bill",
                LastName = "Durr",
                Email = "bill.durr@builders.co.uk",
                Phone = "07123456789",
                ReceiveReports = false,
            });

            context.SaveChanges();

            // Seed categories data.
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

            var categories = new Category[]
            {
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
            };

            foreach (Category category in categories)
                context.Categories.Add(category);

            context.SaveChanges();

            // Seed products data.
            string redPaintId = Guid.NewGuid().ToString();
            string bluePaintId = Guid.NewGuid().ToString();
            string greenPaintId = Guid.NewGuid().ToString();
            DateTime now = DateTime.UtcNow;

            var products = new Product[]
            {
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
            };

            foreach (Product product in products)
                context.Products.Add(product);

            context.SaveChanges();

            // Seed quote data.
            string quoteId = Guid.NewGuid().ToString();

            context.Quotes.Add(new Quote()
            {
                QuoteId = quoteId,
                NetPrice = 72.00f,
                TotalVat = 14.40f,
                GrandTotal = 86.40f,
                TimeCreated = now,
                TimeLastUpdated = now,
                CustomerId = customerId,
                ProviderId = providerId
            });

            context.SaveChanges();

            // Seed quote products data.
            string quoteProduct1Id = Guid.NewGuid().ToString();
            string quoteProduct2Id = Guid.NewGuid().ToString();
            string quoteProduct3Id = Guid.NewGuid().ToString();

            var quoteProducts = new QuoteProduct[] 
            {
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
            };

            foreach (var quoteProduct in quoteProducts)
                context.QuoteProducts.Add(quoteProduct);

            context.SaveChanges();
        }
    }
}
