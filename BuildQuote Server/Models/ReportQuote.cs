#nullable enable
using System;
using System.Collections.Generic;

namespace BuildQuote.Models
{
    public class ReportQuote
    {
        public string ReportQuoteId { get; set; } = Guid.NewGuid().ToString();

        public int? QuoteNumber { get; set; }

        public float NetPrice { get; set; }

        public float TotalVat { get; set; }

        public float GrandTotal { get; set; }

        public string ProviderName { get; set; } = string.Empty;

        public string CustomerName { get; set; } = string.Empty;

        public string? ProviderId { get; set; }
        public Provider? Provider { get; set; }

        public string QuoteId { get; set; } = string.Empty;
        public Quote? Quote { get; set; }

        public string ReportId { get; set; } = string.Empty;
        public Report? Report { get; set; }
    }
}
