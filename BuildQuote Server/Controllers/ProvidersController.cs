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
    public class ProvidersController : ControllerBase
    {
        private readonly DataContext _context;

        public ProvidersController(DataContext context) => _context = context;

        // GET: /providers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Provider>>> Get([FromQuery] bool quotes = false)
        {
            using var context = _context;

            var result = quotes
                ? await context.Providers
                    .AsNoTracking()
                    .Include(p => p.Quotes)
                    .ToListAsync()
                : await context.Providers
                    .AsNoTracking()
                    .ToListAsync();

            if (result != null) return Ok(result);
            else return NoContent();
        }

        // GET: /providers/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Provider>> Get(string id, [FromQuery] bool quotes = false)
        {
            using var context = _context;

            var result = quotes
                ? await context.Providers
                    .AsNoTracking()
                    .Include(p => p.Quotes)
                    .FirstOrDefaultAsync(p => p.ProviderId == id)
                : await context.Providers
                    .AsNoTracking()
                    .FirstOrDefaultAsync(p => p.ProviderId == id);

            if (result != null) return Ok(result);
            else return NotFound(id);
        }

        // POST /providers/new
        [HttpPost("new")]
        public async Task<ActionResult<Uri>> Post([FromBody] Provider provider)
        {
            if (provider == null) return BadRequest(provider);

            try
            {
                using var context = _context;

                provider.ProviderId = Guid.NewGuid().ToString();
                context.Providers.Add(provider);

                var success = await context.SaveChangesAsync() > 0;

                return (success)
                    ? Created(new Uri(Request.GetEncodedUrl()) + $"/{provider.ProviderId}", provider)
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

        // PUT /providers/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<Uri>> Put(string? id, [FromBody] Provider provider)
        {
            if (id == null) return NotFound(id);
            else if (provider == null) return BadRequest(provider);

            try
            {
                using var context = _context;

                var entity = await context.Providers.FirstOrDefaultAsync(p => p.ProviderId == id);
                if (entity == null) return NotFound(id);

                entity.FirstName = provider.FirstName;
                entity.LastName = provider.LastName;
                entity.Email = provider.Email;
                entity.Phone = provider.Phone;
                entity.ReceiveReports = provider.ReceiveReports;

                var success = await context.SaveChangesAsync() > 0;

                if (success) provider = await context.Providers
                    .AsNoTracking()
                    .Include(p => p.Quotes)
                    .FirstOrDefaultAsync(p => p.ProviderId == id);

                return (success)
                    ? Created(new Uri(Request.GetEncodedUrl()) + $"/{provider.ProviderId}", provider)
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

        // DELETE /providers/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> Delete(string? id)
        {
            if (id == null) return NotFound(id);

            try
            {
                using var context = _context;

                var entity = await _context.Providers
                    .Include(p => p.Quotes)
                    .FirstOrDefaultAsync(p => p.ProviderId == id);
                if (entity == null) return NotFound(id);

                if (entity.Quotes != null && entity.Quotes.Count > 0)
                    await context.Quotes
                        .Where(q => q.ProviderId == id)
                        .ForEachAsync(q => q.ProviderId = null);

                context.Providers.Remove(entity);

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
