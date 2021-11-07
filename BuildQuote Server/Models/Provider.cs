#nullable enable
using System;
using System.Collections.Generic;

namespace BuildQuote.Models
{
    public class Provider
    {
        public string ProviderId { get; set; } = Guid.NewGuid().ToString();

        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public string FullName => $"{LastName}, {FirstName}";

        public string Email { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        public bool ReceiveReports { get; set; } = false;

        public ICollection<Quote>? Quotes { get; set; }
    }
}
