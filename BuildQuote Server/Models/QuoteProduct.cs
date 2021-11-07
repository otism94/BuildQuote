#nullable enable
using System;
using System.Collections.Generic;

namespace BuildQuote.Models
{
    public class QuoteProduct
    {

        public string QuoteProductId { get; set; } = Guid.NewGuid().ToString();

        public string Name { get; set; } = string.Empty;

        public float UnitPrice { get; set; }

        public float VatRate { get; set; }

        public int Quantity { get; set; } = 0;

        public DateTime? TimeUpdated { get; set; }

        public float VatPrice => (float)Math.Round(UnitPrice * (VatRate / 100), 2);

        public float OverallPrice => (float)Math.Round(UnitPrice + (UnitPrice * (VatRate / 100)), 2);

        public float LinePrice => (float)Math.Round(UnitPrice * Quantity, 2);

        public float LineVat => (float)Math.Round(VatPrice * Quantity, 2);

        public float LineTotal => (float)Math.Round(OverallPrice * Quantity, 2);

        public string? CategoryId { get; set; }
        public Category? Category { get; set; }

        public string QuoteId { get; set; } = string.Empty;
        public Quote? Quote { get; set; }

        public string? ProductId { get; set; }
        public Product? Product { get; set; }


    }
}
