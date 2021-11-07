#nullable enable
using System;
using System.Collections.Generic;

namespace BuildQuote.Models
{
    public class Category
    {
        public string CategoryId { get; set; } = Guid.NewGuid().ToString();

        public string Name { get; set; } = string.Empty;

        public ICollection<Product>? Products { get; set; }
    }
}
