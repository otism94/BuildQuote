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
    public class ProductsController : ControllerBase
    {
        private readonly DataContext _context;

        public ProductsController(DataContext context) => _context = context;

        // GET: /products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> Get([FromQuery] bool categories = false)
        {
            using var context = _context;

            var result = categories
                ? await context.Products
                    .AsNoTracking()
                    .Include(p => p.Category)
                    .ToListAsync()
                : await context.Products
                    .AsNoTracking()
                    .ToListAsync();

            if (result != null) return Ok(result);
            else return NoContent();
        }

        // GET: /products/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> Get(string id, [FromQuery] bool categories = false)
        {
            using var context = _context;

            var result = categories
                ? await context.Products
                    .AsNoTracking()
                    .Include(p => p.Category)
                    .FirstOrDefaultAsync(p => p.ProductId == id)
                : await context.Products
                    .AsNoTracking()
                    .FirstOrDefaultAsync(p => p.ProductId == id);

            if (result != null) return Ok(result);
            else return NotFound(id);
        }

        // POST /products/new
        [HttpPost("new")]
        public async Task<ActionResult<Uri>> Post([FromBody] Product product)
        {
            if (product == null) return BadRequest(product);

            try
            {
                using var context = _context;

                product.ProductId = Guid.NewGuid().ToString();
                product.TimeCreated = DateTime.UtcNow;
                product.TimeLastUpdated = DateTime.UtcNow;
                context.Products.Add(product);

                var success = await context.SaveChangesAsync() > 0;

                return (success)
                    ? Created(new Uri(Request.GetEncodedUrl()) + $"/{product.ProductId}", product)
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

        // PUT /products/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<Uri>> Put(string? id, [FromBody] Product product)
        {
            if (id == null) return NotFound(id);
            else if (product == null) return BadRequest(product);

            try
            {
                using var context = _context;

                var entity = await context.Products.FirstOrDefaultAsync(e => e.ProductId == id);
                if (entity == null) return NotFound(id);

                entity.Name = product.Name;
                entity.UnitPrice = product.UnitPrice;
                entity.VatRate = product.VatRate;
                entity.TimeLastUpdated = DateTime.UtcNow;
                entity.CategoryId = product.CategoryId;

                var success = await context.SaveChangesAsync() > 0;

                if (success) product = await context.Products
                    .AsNoTracking()
                    .Include(p => p.Category)
                    .FirstOrDefaultAsync(p => p.ProductId == id);

                return (success)
                    ? Created(new Uri(Request.GetEncodedUrl()) + $"/{product.ProductId}", product)
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

        // DELETE /products/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> Delete(string? id)
        {
            if (id == null) return NotFound(id);

            try
            {
                using var context = _context;

                var entity = await _context.Products.FirstOrDefaultAsync(e => e.ProductId == id);
                if (entity == null) return NotFound(id);

                await context.QuoteProducts
                    .Where(qp => qp.ProductId == id)
                    .ForEachAsync(qp => qp.ProductId = null);

                context.Products.Remove(entity);

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
