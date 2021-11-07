#nullable enable
using BuildQuote.Data;
using BuildQuote.Models;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BuildQuote.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuotesController : ControllerBase
    {
        private readonly DataContext _context;

        public QuotesController(DataContext context) => _context = context;

        // GET: /quotes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Quote>>> Get([FromQuery] bool products = false)
        {
            using var context = _context;


            var result = products
                ? await context.Quotes
                    .AsNoTracking()
                    .Include(q => q.Customer)
                    .Include(q => q.Provider)
                    .Include(q => q.QuoteProducts)
                    .ToListAsync()
                : await context.Quotes
                    .AsNoTracking()
                    .Include(q => q.Customer)
                    .Include(q => q.Provider)
                    .ToListAsync();

            if (result != null) return Ok(result);
            else return NoContent();
        }

        // GET: /quotes/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Quote>> Get(string id)
        {
            using var context = _context;

            var result = await context.Quotes
                .AsNoTracking()
                .Include(q => q.Customer)
                .Include(q => q.Provider)
                .Include(q => q.QuoteProducts)
                .FirstOrDefaultAsync(q => q.QuoteId == id);

            if (result != null) return Ok(result);
            else return NotFound(id);
        }

        // POST /quotes/new
        [HttpPost("new")]
        public async Task<ActionResult<Uri>> Post([FromBody] Quote quote)
        {
            if (quote == null) return BadRequest(quote);

            try
            {
                using var context = _context;

                quote.QuoteId = Guid.NewGuid().ToString();

                if (quote.QuoteProducts != null)
                {
                    float runningNetPrice = 0;
                    float runningVatPrice = 0;

                    foreach (QuoteProduct? item in quote.QuoteProducts)
                    {
                        item.QuoteProductId = Guid.NewGuid().ToString();
                        item.QuoteId = quote.QuoteId;
                        item.TimeUpdated = DateTime.UtcNow;
                        runningNetPrice += item.LinePrice;
                        runningVatPrice += item.LineVat;
                    }

                    quote.NetPrice = runningNetPrice;
                    quote.TotalVat = runningVatPrice;
                    quote.GrandTotal = quote.NetPrice + quote.TotalVat;
                }
                else
                {
                    quote.NetPrice = 0;
                    quote.TotalVat = 0;
                    quote.GrandTotal = 0;
                }

                quote.TimeCreated = DateTime.UtcNow;
                quote.TimeLastUpdated = DateTime.UtcNow;

                context.Quotes.Add(quote);

                var success = await context.SaveChangesAsync() > 0;

                return (success)
                    ? Created(new Uri(Request.GetEncodedUrl()) + $"/{quote.QuoteId}", quote)
                    : throw new DbUpdateException("Error updating the database.");
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, ex);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        // PUT /quotes/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<Uri>> Put(string? id, [FromBody] Quote quote)
        {
            if (id == null) return NotFound(id);
            else if (quote == null) return BadRequest(quote);

            try
            {
                using var context = _context;

                var quoteEntity = await context.Quotes.FirstOrDefaultAsync(q => q.QuoteId == id);
                if (quoteEntity == null) return NotFound(id);

                quoteEntity.TimeLastUpdated = DateTime.UtcNow;
                quoteEntity.TimeEmailed = null;
                quoteEntity.CustomerId = quote.CustomerId;
                quoteEntity.ProviderId = quote.ProviderId;
                quoteEntity.QuoteProducts = new List<QuoteProduct>();

                if (quote.QuoteProducts != null && quote.QuoteProducts.Count > 0)
                {
                    float runningNetPrice = 0;
                    float runningVatPrice = 0;

                    foreach (QuoteProduct? item in quote.QuoteProducts)
                    {
                        item.QuoteProductId = Guid.NewGuid().ToString();
                        item.QuoteId = quoteEntity.QuoteId;
                        item.TimeUpdated = DateTime.UtcNow;
                        runningNetPrice += item.LinePrice;
                        runningVatPrice += item.LineVat;
                        quoteEntity.QuoteProducts.Add(item);
                    }

                    quoteEntity.NetPrice = runningNetPrice;
                    quoteEntity.TotalVat = runningVatPrice;
                    quoteEntity.GrandTotal = quoteEntity.NetPrice + quoteEntity.TotalVat;
                }
                else
                {
                    quoteEntity.NetPrice = 0;
                    quoteEntity.TotalVat = 0;
                    quoteEntity.GrandTotal = 0;
                }

                var oldQuoteProducts = await context.QuoteProducts
                    .Where(qp => qp.QuoteId == quoteEntity.QuoteId && !quoteEntity.QuoteProducts.Contains(qp))
                    .ToListAsync();
                foreach (var quoteProduct in oldQuoteProducts) context.QuoteProducts.Remove(quoteProduct);

                var success = await context.SaveChangesAsync() > 0;

                if (success) quote = await context.Quotes
                    .AsNoTracking()
                    .Include(q => q.Customer)
                    .Include(q => q.Provider)
                    .Include(q => q.QuoteProducts)
                    .FirstOrDefaultAsync(q => q.QuoteId == id);

                return (success)
                    ? Created(new Uri(Request.GetEncodedUrl()) + $"/{quote.QuoteId}", quote)
                    : throw new DbUpdateException("Error updating the database.");
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, ex);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }

        }

        // DELETE /quotes/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> Delete(string? id)
        {
            if (id == null) return NotFound(id);

            try
            {
                using var context = _context;

                var entity = await context.Quotes.FirstOrDefaultAsync(q => q.QuoteId == id);
                if (entity == null) return NotFound(id);

                var quoteProducts = await context.QuoteProducts
                    .Where(b => b.QuoteId == id)
                    .ToListAsync();
                foreach (var quoteProduct in quoteProducts) context.QuoteProducts.Remove(quoteProduct);

                context.Quotes.Remove(entity);

                var success = await context.SaveChangesAsync() > 0;

                return (success)
                    ? Ok(true)
                    : throw new DbUpdateException("Error updating the database.");
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, ex);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
    }
}
