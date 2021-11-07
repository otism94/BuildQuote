#nullable enable
using System;
using System.Collections.Generic;

namespace BuildQuote.Models
{
    public class Product
    {
        public string ProductId { get; set; } = Guid.NewGuid().ToString();

        public string Name { get; set; } = string.Empty;

        public float UnitPrice { get; set; }

        public float VatRate { get; set; }

        public DateTime? TimeCreated { get; set; }

        public DateTime? TimeLastUpdated { get; set; }

        public float VatPrice => (float)Math.Round(UnitPrice * (VatRate / 100), 2);

        public float OverallPrice => (float)Math.Round(UnitPrice + (UnitPrice * (VatRate / 100)), 2);

        public string? CategoryId { get; set; }
        public Category? Category { get; set; }
    }
}
