#nullable enable
using System;
using System.Collections.Generic;

namespace BuildQuote.Models
{
    public class Report
    {
        public string ReportId { get; set; } = Guid.NewGuid().ToString();

        public DateTime? ReportDate { get; set; }

        public float NetTotal { get; set; }

        public float TotalVat { get; set; }

        public float GrandTotal { get; set; }

        public int QuotesCount { get; set; }

        public ICollection<ReportQuote>? Quotes { get; set; }
    }
}
