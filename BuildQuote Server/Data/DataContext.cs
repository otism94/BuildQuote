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

            modelBuilder.Entity<Quote>()
                .Property(p => p.QuoteNumber)
                .HasDefaultValueSql("NEXT VALUE FOR Quotes.QuoteNumber");
        }
    }
}
