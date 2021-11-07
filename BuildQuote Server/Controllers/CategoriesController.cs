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
    public class CategoriesController : ControllerBase
    {
        private readonly DataContext _context;

        public CategoriesController(DataContext context) => _context = context;

        // GET: /categoies
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> Get([FromQuery] bool products = false)
        {
            using var context = _context;

            var result = products
                ? await context.Categories
                    .AsNoTracking()
                    .Include(c => c.Products)
                    .ToListAsync()
                : await context.Categories
                    .AsNoTracking()
                    .ToListAsync();

            if (result != null) return Ok(result);
            else return NoContent();
        }

        // GET: /categoies/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> Get(string id, [FromQuery] bool products = false)
        {
            using var context = _context;

            var result = products
                ? await context.Categories
                    .AsNoTracking()
                    .Include(c => c.Products)
                    .FirstOrDefaultAsync(c => c.CategoryId == id)
                : await context.Categories
                    .AsNoTracking()
                    .FirstOrDefaultAsync(c => c.CategoryId == id);

            return (result != null) ? Ok(result) : NoContent();
        }

        // POST /categoies/new
        [HttpPost("new")]
        public async Task<ActionResult<Uri>> Post([FromBody] Category category)
        {
            if (category == null) return BadRequest(category);

            try
            {
                using var context = _context;

                category.CategoryId = Guid.NewGuid().ToString();
                context.Categories.Add(category);

                var success = await context.SaveChangesAsync() > 0;

                return success
                    ? Created(new Uri(Request.GetEncodedUrl()) + $"/{category.CategoryId}", category)
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

        // PUT /categoies/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<Uri>> Put(string? id, [FromBody] Category category)
        {
            if (id == null) return NotFound(id);
            else if (category == null) return BadRequest(category);

            try
            {
                using var context = _context;

                var entity = await context.Categories.FirstOrDefaultAsync(e => e.CategoryId == id);
                if (entity == null) return NotFound(id);

                entity.Name = category.Name;

                var success = await context.SaveChangesAsync() > 0;

                if (success) category = await context.Categories
                    .AsNoTracking()
                    .FirstOrDefaultAsync(c => c.CategoryId == id);

                return success
                    ? Created(new Uri(Request.GetEncodedUrl()) + $"/{category.CategoryId}", category)
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

        // DELETE /categoies/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> Delete(string? id)
        {
            if (id == null) return NotFound(id);

            try
            {
                using var context = _context;

                var entity = await _context.Categories
                    .Include(e => e.Products)
                    .FirstOrDefaultAsync(e => e.CategoryId == id);
                if (entity == null) return NotFound(id);

                if (entity.Products != null && entity.Products.Count > 0)
                    await context.Products
                        .Where(p => p.CategoryId == id)
                        .ForEachAsync(p => p.CategoryId = null);

                context.Categories.Remove(entity);

                var success = await context.SaveChangesAsync() > 0;

                return success
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
