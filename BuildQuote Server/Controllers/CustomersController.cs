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
    public class CustomersController : ControllerBase
    {
        private readonly DataContext _context;

        public CustomersController(DataContext context) => _context = context;

        // GET: /customers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Customer>>> Get([FromQuery] bool quotes = false)
        {
            using var context = _context;

            var result = quotes
                ? await context.Customers
                    .AsNoTracking()
                    .Include(c => c.Quotes)
                    .ToListAsync()
                : await context.Customers
                    .AsNoTracking()
                    .ToListAsync();

            if (result != null) return Ok(result);
            else return NoContent();
        }

        // GET: /customers/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Customer>> Get(string id, [FromQuery] bool quotes = false)
        {
            using var context = _context;

            var result = quotes
                ? await context.Customers
                    .AsNoTracking()
                    .Include(c => c.Quotes)
                    .FirstOrDefaultAsync(c => c.CustomerId == id)
                : await context.Customers
                    .AsNoTracking()
                    .FirstOrDefaultAsync(c => c.CustomerId == id);

            if (result != null) return Ok(result);
            else return NotFound(id);
        }

        // POST /customers/new
        [HttpPost("new")]
        public async Task<ActionResult<Uri>> Post([FromBody] Customer customer)
        {
            if (customer == null) return BadRequest(customer);

            try
            {
                using var context = _context;

                customer.CustomerId = Guid.NewGuid().ToString();
                context.Customers.Add(customer);

                var success = await context.SaveChangesAsync() > 0;

                return (success)
                    ? Created(new Uri(Request.GetEncodedUrl()) + $"/{customer.CustomerId}", customer)
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

        // PUT /customers/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<Uri>> Put(string? id, [FromBody] Customer customer)
        {
            if (id == null) return NotFound(id);
            else if (customer == null) return BadRequest(customer);

            try
            {
                using var context = _context;

                var entity = await context.Customers.FirstOrDefaultAsync(c => c.CustomerId == id);
                if (entity == null) return NotFound(id);

                entity.FirstName = customer.FirstName;
                entity.LastName = customer.LastName;
                entity.AddressLine1 = customer.AddressLine1;
                entity.AddressLine2 = customer.AddressLine2;
                entity.City = customer.City;
                entity.PostCode = customer.PostCode;
                entity.Email = customer.Email;
                entity.Phone = customer.Phone;

                var success = await context.SaveChangesAsync() > 0;

                if (success) customer = await context.Customers
                    .AsNoTracking()
                    .FirstOrDefaultAsync(c => c.CustomerId == id);

                return (success)
                    ? Created(new Uri(Request.GetEncodedUrl()) + $"/{customer.CustomerId}", customer)
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

        // DELETE /customers/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> Delete(string? id)
        {
            if (id == null) return NotFound(id);

            try
            {
                using var context = _context;

                var entity = await _context.Customers
                    .Include(c => c.Quotes)
                    .FirstOrDefaultAsync(c => c.CustomerId == id);
                if (entity == null) return NotFound(id);

                if (entity.Quotes != null && entity.Quotes.Any())
                    await context.Quotes
                        .Where(q => q.CustomerId == id)
                        .ForEachAsync(q => q.CustomerId = null);

                context.Customers.Remove(entity);

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
