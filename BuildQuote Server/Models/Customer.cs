#nullable enable
using System;
using System.Collections.Generic;

namespace BuildQuote.Models
{
    public class Customer
    {
        public string CustomerId { get; set; } = Guid.NewGuid().ToString();

        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public string FullName => $"{LastName}, {FirstName}";

        public string AddressLine1 { get; set; } = string.Empty;

        public string? AddressLine2 { get; set; }

        public string City { get; set; } = string.Empty;

        public string PostCode { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        public ICollection<Quote>? Quotes { get; set; }
    }
}
