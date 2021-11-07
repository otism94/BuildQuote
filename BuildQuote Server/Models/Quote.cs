#nullable enable
using System;
using System.Collections.Generic;

namespace BuildQuote.Models
{
    public class Quote
    {
        public string QuoteId { get; set; } = Guid.NewGuid().ToString();

        public int? QuoteNumber { get; set; }

        public float NetPrice { get; set; }

        public float TotalVat { get; set; }

        public float GrandTotal { get; set; }

        public DateTime? TimeCreated { get; set; }

        public DateTime? TimeLastUpdated { get; set; }

        public DateTime? TimeEmailed { get; set; }

        public string? CustomerId { get; set; }
        public Customer? Customer { get; set; }

        public string? ProviderId { get; set; }
        public Provider? Provider { get; set; }

        public ICollection<QuoteProduct>? QuoteProducts { get; set; }
    }
}
