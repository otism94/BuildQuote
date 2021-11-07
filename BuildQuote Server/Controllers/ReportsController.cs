#nullable enable
using BuildQuote.Data;
using BuildQuote.Models;
using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BuildQuote.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly DataContext _context;

        public ReportsController(DataContext context) => _context = context;

        // GET: /reports
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Report>>> Get()
        {
            using var context = _context;

            var result = await context.Reports
                .AsNoTracking()
                .ToListAsync();

            if (result != null) return Ok(result);
            else return NoContent();
        }

        // GET: /reports/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Report>> Get(string id)
        {
            var context = _context;

            var result = await context.Reports
                .AsNoTracking()
                .Include(r => r.Quotes)
                .FirstOrDefaultAsync(r => r.ReportId == id);

            if (result != null) return Ok(result);
            else return NotFound(id);
        }

        // POST: /reports/sendtocustomer
        [HttpPost("sendtocustomer")]
        public async Task<ActionResult<Quote>> Post([FromBody] Dictionary<string, string> quoteId)
        {
            try
            {
                using var context = _context;

                var quote = await context.Quotes
                    .Include(q => q.Customer)
                    .Include(q => q.Provider)
                    .Include(q => q.QuoteProducts)
                    .FirstOrDefaultAsync(q => q.QuoteId == quoteId.GetValueOrDefault("quoteId"));

                if (quote != null && quote.Customer != null && quote.Provider != null && quote.QuoteProducts != null)
                {
                    var email = new MimeMessage();
                    email.From.Add(MailboxAddress.Parse("noreply@buildquote.co.uk"));
                    email.To.Add(MailboxAddress.Parse(quote.Customer.Email));
                    email.Subject = $"Your quote (#{quote.QuoteNumber})";

                    string productRows = "";
                    foreach (var product in quote.QuoteProducts)
                    {
                        productRows += $@"
<tr style=""line-height: 24px; font-size: 16px; border-top-width: 1px; border-top-color: #e2e8f0; border-top-style: solid; margin: 0; padding: 12px;"" align=""left"" valign=""top"">
    <td>{product.Name}</td>
    <td>&pound;{string.Format("{0:.00}", product.OverallPrice)}</td>
    <td>{product.Quantity}</td>
    <td>&pound;{string.Format("{0:.00}", product.LinePrice)}</td>
    <td>&pound;{string.Format("{0:.00}", product.LineVat)}</td>
    <td>&pound;{string.Format("{0:.00}", product.LineTotal)}</td>
</tr>";
                    }

                    string emailBody = $@"<!DOCTYPE html PUBLIC ""-//W3C//DTD HTML 4.0 Transitional//EN"" ""http://www.w3.org/TR/REC-html40/loose.dtd"">
<html>
  <head>
    <!-- Compiled with Bootstrap Email version: 1.1.0 -->
    <meta http-equiv=""x-ua-compatible"" content=""ie=edge"" />
    <meta name=""x-apple-disable-message-reformatting"" />
    <meta name=""viewport"" content=""width=device-width, initial-scale=1"" />
    <meta
      name=""format-detection""
      content=""telephone=no, date=no, address=no, email=no""
    />
    <meta http-equiv=""Content-Type"" content=""text/html; charset=utf-8"" />
    <style type=""text/css"">
      body,
      table,
      td {{
        font-family: Helvetica, Arial, sans-serif !important;
      }}
      .ExternalClass {{
        width: 100%;
      }}
      .ExternalClass,
      .ExternalClass p,
      .ExternalClass span,
      .ExternalClass font,
      .ExternalClass td,
      .ExternalClass div {{
        line - height: 150%;
      }}
      a {{
        text - decoration: none;
      }}
      * {{
        color: inherit;
      }}
      a[x-apple-data-detectors],
      u + #body a,
      #MessageViewBody a {{
        color: inherit;
        text-decoration: none;
        font-size: inherit;
        font-family: inherit;
        font-weight: inherit;
        line-height: inherit;
      }}
      img {{
        -ms - interpolation - mode: bicubic;
      }}
      table:not([class^=""s-""]) {{
        font - family: Helvetica, Arial, sans-serif;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
        border-spacing: 0px;
        border-collapse: collapse;
      }}
      table:not([class^=""s-""]) td {{
        border - spacing: 0px;
        border-collapse: collapse;
      }}
      @media screen and (max-width: 600px) {{
        .w - full,
        .w - full > tbody > tr > td {{
          width: 100% !important;
        }}
        *[class*=""s-lg-""] > tbody > tr > td {{
          font-size: 0 !important;
          line-height: 0 !important;
          height: 0 !important;
        }}
        .s-3 > tbody > tr > td {{
          font-size: 12px !important;
          line-height: 12px !important;
          height: 12px !important;
        }}
        .s-5 > tbody > tr > td {{
          font-size: 20px !important;
          line-height: 20px !important;
          height: 20px !important;
        }}
      }}
    </style>
  </head>
  <body
    class=""bg-light""
    style=""
      outline: 0;
      width: 100%;
      min-width: 100%;
      height: 100%;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
        'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
        'Helvetica Neue', sans-serif;
      line-height: 24px;
      font-weight: normal;
      font-size: 16px;
      -moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      color: #000000;
      margin: 0;
      padding: 0;
      border: 0;
    ""
    bgcolor=""#f7fafc""
  >
    <table
      class=""bg-light body""
      valign=""top""
      role=""presentation""
      border=""0""
      cellpadding=""0""
      cellspacing=""0""
      style=""
        outline: 0;
        width: 100%;
        min-width: 100%;
        height: 100%;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        font-family: Helvetica, Arial, sans-serif;
        line-height: 24px;
        font-weight: normal;
        font-size: 16px;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: #000000;
        margin: 0;
        padding: 0;
        border: 0;
      ""
      bgcolor=""#f7fafc""
    >
      <tbody>
        <tr>
          <td
            valign=""top""
            style=""line-height: 24px; font-size: 16px; margin: 0""
            align=""left""
            bgcolor=""#f7fafc""
          >
            <table
              class=""container""
              role=""presentation""
              border=""0""
              cellpadding=""0""
              cellspacing=""0""
              style=""width: 100%""
            >
              <tbody>
                <tr>
                  <td
                    align=""center""
                    style=""
                      line-height: 24px;
                      font-size: 16px;
                      margin: 0;
                      padding: 0 16px;
                    ""
                  >
                    <!--[if (gte mso 9)|(IE)]>
                      <table align=""center"" role=""presentation"">
                        <tbody>
                          <tr>
                            <td width=""600"">
                    <![endif]-->
                    <table
                      align=""center""
                      role=""presentation""
                      border=""0""
                      cellpadding=""0""
                      cellspacing=""0""
                      style=""width: 100%; max-width: 600px; margin: 0 auto""
                    >
                      <tbody>
                        <tr>
                          <td
                            style=""
                              line-height: 24px;
                              font-size: 16px;
                              margin: 0;
                            ""
                            align=""left""
                          >
                            <h1
                              class=""""
                              style=""
                                padding-top: 0;
                                padding-bottom: 0;
                                font-weight: 500;
                                vertical-align: baseline;
                                font-size: 36px;
                                line-height: 43.2px;
                                margin: 0;
                              ""
                              align=""left""
                            >
                              Your quote (#{quote.QuoteNumber})
                            </h1>
                            <table
                              class=""s-5 w-full""
                              role=""presentation""
                              border=""0""
                              cellpadding=""0""
                              cellspacing=""0""
                              style=""width: 100%""
                              width=""100%""
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style=""
                                      line-height: 20px;
                                      font-size: 20px;
                                      width: 100%;
                                      height: 20px;
                                      margin: 0;
                                    ""
                                    align=""left""
                                    width=""100%""
                                    height=""20""
                                  >
                                    &#160;
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table
                              class=""s-3 w-full""
                              role=""presentation""
                              border=""0""
                              cellpadding=""0""
                              cellspacing=""0""
                              style=""width: 100%""
                              width=""100%""
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style=""
                                      line-height: 12px;
                                      font-size: 12px;
                                      width: 100%;
                                      height: 12px;
                                      margin: 0;
                                    ""
                                    align=""left""
                                    width=""100%""
                                    height=""12""
                                  >
                                    &#160;
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table
                              class=""table-responsive""
                              border=""0""
                              cellpadding=""0""
                              cellspacing=""0""
                            >
                              <tr>
                                <th
                                  style=""
                                    line-height: 24px;
                                    font-size: 16px;
                                    margin: 0;
                                  ""
                                  align=""left""
                                >
                                  Your name:
                                </th>
                                <td
                                  style=""
                                    line-height: 24px;
                                    font-size: 16px;
                                    margin: 0;
                                  ""
                                  align=""left""
                                >
                                  {quote.Customer.FirstName}
                                  {quote.Customer.LastName}
                                </td>
                              </tr>
                              <tr>
                                <th
                                  style=""
                                    line-height: 24px;
                                    font-size: 16px;
                                    margin: 0;
                                  ""
                                  align=""left""
                                >
                                  Provider:
                                </th>
                                <td
                                  style=""
                                    line-height: 24px;
                                    font-size: 16px;
                                    margin: 0;
                                  ""
                                  align=""left""
                                >
                                  <a
                                    href=""mailto:{quote.Provider.Email}""
                                    style=""color: #0d6efd""
                                    >{quote.Provider.FirstName}
                                    {quote.Provider.LastName}</a
                                  >
                                </td>
                              </tr>
                              <tr>
                                <th
                                  style=""
                                    line-height: 24px;
                                    font-size: 16px;
                                    margin: 0;
                                  ""
                                  align=""left""
                                >
                                  Date:
                                </th>
                                <td
                                  style=""
                                    line-height: 24px;
                                    font-size: 16px;
                                    margin: 0;
                                  ""
                                  align=""left""
                                >
                                  {quote.TimeLastUpdated}
                                </td>
                              </tr>
                            </table>
                            <table
                              class=""s-3 w-full""
                              role=""presentation""
                              border=""0""
                              cellpadding=""0""
                              cellspacing=""0""
                              style=""width: 100%""
                              width=""100%""
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style=""
                                      line-height: 12px;
                                      font-size: 12px;
                                      width: 100%;
                                      height: 12px;
                                      margin: 0;
                                    ""
                                    align=""left""
                                    width=""100%""
                                    height=""12""
                                  >
                                    &#160;
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table
                              class=""s-3 w-full""
                              role=""presentation""
                              border=""0""
                              cellpadding=""0""
                              cellspacing=""0""
                              style=""width: 100%""
                              width=""100%""
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style=""
                                      line-height: 12px;
                                      font-size: 12px;
                                      width: 100%;
                                      height: 12px;
                                      margin: 0;
                                    ""
                                    align=""left""
                                    width=""100%""
                                    height=""12""
                                  >
                                    &#160;
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table
                              class=""table table-striped""
                              border=""0""
                              cellpadding=""0""
                              cellspacing=""0""
                              style=""width: 100%; max-width: 100%""
                            >
                              <thead>
                                <tr>
                                  <th
                                    style=""
                                      line-height: 24px;
                                      font-size: 16px;
                                      border-bottom-width: 2px;
                                      border-bottom-color: #e2e8f0;
                                      border-bottom-style: solid;
                                      border-top-width: 1px;
                                      border-top-color: #e2e8f0;
                                      border-top-style: solid;
                                      margin: 0;
                                      padding: 12px;
                                    ""
                                    align=""left""
                                    valign=""top""
                                  >
                                    Product
                                  </th>
                                  <th
                                    style=""
                                      line-height: 24px;
                                      font-size: 16px;
                                      border-bottom-width: 2px;
                                      border-bottom-color: #e2e8f0;
                                      border-bottom-style: solid;
                                      border-top-width: 1px;
                                      border-top-color: #e2e8f0;
                                      border-top-style: solid;
                                      margin: 0;
                                      padding: 12px;
                                    ""
                                    align=""left""
                                    valign=""top""
                                  >
                                    Price
                                  </th>
                                  <th
                                    style=""
                                      line-height: 24px;
                                      font-size: 16px;
                                      border-bottom-width: 2px;
                                      border-bottom-color: #e2e8f0;
                                      border-bottom-style: solid;
                                      border-top-width: 1px;
                                      border-top-color: #e2e8f0;
                                      border-top-style: solid;
                                      margin: 0;
                                      padding: 12px;
                                    ""
                                    align=""left""
                                    valign=""top""
                                  >
                                    Quantity
                                  </th>
                                  <th
                                    style=""
                                      line-height: 24px;
                                      font-size: 16px;
                                      border-bottom-width: 2px;
                                      border-bottom-color: #e2e8f0;
                                      border-bottom-style: solid;
                                      border-top-width: 1px;
                                      border-top-color: #e2e8f0;
                                      border-top-style: solid;
                                      margin: 0;
                                      padding: 12px;
                                    ""
                                    align=""left""
                                    valign=""top""
                                  >
                                    Line Price
                                  </th>
                                  <th
                                    style=""
                                      line-height: 24px;
                                      font-size: 16px;
                                      border-bottom-width: 2px;
                                      border-bottom-color: #e2e8f0;
                                      border-bottom-style: solid;
                                      border-top-width: 1px;
                                      border-top-color: #e2e8f0;
                                      border-top-style: solid;
                                      margin: 0;
                                      padding: 12px;
                                    ""
                                    align=""left""
                                    valign=""top""
                                  >
                                    Line VAT
                                  </th>
                                  <th
                                    style=""
                                      line-height: 24px;
                                      font-size: 16px;
                                      border-bottom-width: 2px;
                                      border-bottom-color: #e2e8f0;
                                      border-bottom-style: solid;
                                      border-top-width: 1px;
                                      border-top-color: #e2e8f0;
                                      border-top-style: solid;
                                      margin: 0;
                                      padding: 12px;
                                    ""
                                    align=""left""
                                    valign=""top""
                                  >
                                    Line Total
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {productRows}
                              </tbody>
                            </table>
                            <table
                              class=""s-3 w-full""
                              role=""presentation""
                              border=""0""
                              cellpadding=""0""
                              cellspacing=""0""
                              style=""width: 100%""
                              width=""100%""
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style=""
                                      line-height: 12px;
                                      font-size: 12px;
                                      width: 100%;
                                      height: 12px;
                                      margin: 0;
                                    ""
                                    align=""left""
                                    width=""100%""
                                    height=""12""
                                  >
                                    &#160;
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table
                              class=""s-3 w-full""
                              role=""presentation""
                              border=""0""
                              cellpadding=""0""
                              cellspacing=""0""
                              style=""width: 100%""
                              width=""100%""
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style=""
                                      line-height: 12px;
                                      font-size: 12px;
                                      width: 100%;
                                      height: 12px;
                                      margin: 0;
                                    ""
                                    align=""left""
                                    width=""100%""
                                    height=""12""
                                  >
                                    &#160;
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table
                              class=""table-responsive""
                              border=""0""
                              cellpadding=""0""
                              cellspacing=""0""
                            >
                              <tr>
                                <th
                                  style=""
                                    line-height: 24px;
                                    font-size: 16px;
                                    margin: 0;
                                  ""
                                  align=""left""
                                >
                                  Net Price
                                </th>
                                <td
                                  style=""
                                    line-height: 24px;
                                    font-size: 16px;
                                    margin: 0;
                                  ""
                                  align=""left""
                                >
                                  &#163;{string.Format("{0:.00}",
                                      quote.NetPrice)}
                                </td>
                              </tr>
                              <tr>
                                <th
                                  style=""
                                    line-height: 24px;
                                    font-size: 16px;
                                    margin: 0;
                                  ""
                                  align=""left""
                                >
                                  Net VAT
                                </th>
                                <td
                                  style=""
                                    line-height: 24px;
                                    font-size: 16px;
                                    margin: 0;
                                  ""
                                  align=""left""
                                >
                                  &#163;{string.Format("{0:.00}",
                                      quote.TotalVat)}
                                </td>
                              </tr>
                              <tr
                                class=""border-top-2""
                                style=""
                                  border-top-width: 2px !important;
                                  border-top-color: #e2e8f0 !important;
                                  border-top-style: solid !important;
                                ""
                              >
                                <th
                                  style=""
                                    line-height: 24px;
                                    font-size: 16px;
                                    margin: 0;
                                  ""
                                  align=""left""
                                >
                                  Grand Total
                                </th>
                                <td
                                  class=""text-xl""
                                  style=""
                                    line-height: 24px;
                                    font-size: 20px;
                                    margin: 0;
                                  ""
                                  align=""left""
                                >
                                  <strong
                                    >&#163;{string.Format("{0:.00}",
                                        quote.GrandTotal)}</strong
                                  >
                                </td>
                              </tr>
                            </table>
                            <table
                              class=""s-3 w-full""
                              role=""presentation""
                              border=""0""
                              cellpadding=""0""
                              cellspacing=""0""
                              style=""width: 100%""
                              width=""100%""
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style=""
                                      line-height: 12px;
                                      font-size: 12px;
                                      width: 100%;
                                      height: 12px;
                                      margin: 0;
                                    ""
                                    align=""left""
                                    width=""100%""
                                    height=""12""
                                  >
                                    &#160;
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <!--[if (gte mso 9)|(IE)]>
                    </td>
                  </tr>
                </tbody>
              </table>
                    <![endif]-->
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
";

                    email.Body = new TextPart(MimeKit.Text.TextFormat.Html)
                    {
                        Text = emailBody
                    };

                    using var smtp = new SmtpClient();
                    smtp.Connect("smtp.mailtrap.io", 2525);
                    smtp.Authenticate("225df7390061fd", "dad74cad2c79b2");
                    smtp.Send(email);
                    smtp.Disconnect(true);

                    quote.TimeEmailed = DateTime.UtcNow;

                    var success = await context.SaveChangesAsync() > 0;

                    return (success)
                        ? Ok(quote)
                        : throw new DbUpdateException("Error updating the database.");
                }
                else
                {
                    return BadRequest(quote);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        // POST: /reports/senddaily
        [HttpPost("senddaily")]
        public async Task<ActionResult<bool>> Post()
        {
            try
            {
                using var context = _context;

                var quotesToInclude = await context.Quotes
                    .Where(q =>
                        (q.TimeEmailed != null && q.TimeEmailed.Value.Date == DateTime.Today))
                    .Include(q => q.Provider)
                    .Include(q => q.Customer)
                    .ToListAsync();

                if (!quotesToInclude.Any()) return StatusCode(204);

                string reportId = Guid.NewGuid().ToString();
                float reportsNetTotal = 0f;
                float reportsTotalVat = 0f;
                float reportsGrandTotal = 0f;

                List<ReportQuote> quotes = new List<ReportQuote>();

                if (quotesToInclude.Any())
                {
                    foreach (var quote in quotesToInclude)
                    {
                        quotes.Add(
                            new ReportQuote()
                            {
                                ReportQuoteId = Guid.NewGuid().ToString(),
                                QuoteNumber = quote.QuoteNumber,
                                NetPrice = quote.NetPrice,
                                TotalVat = quote.TotalVat,
                                GrandTotal = quote.GrandTotal,
                                ProviderName = quote.Provider != null ? quote.Provider.FullName : string.Empty,
                                CustomerName = quote.Customer != null ? quote.Customer.FullName : string.Empty,
                                ProviderId = quote.ProviderId,
                                QuoteId = quote.QuoteId,
                                ReportId = reportId
                            }
                        );
                        reportsNetTotal += quote.NetPrice;
                        reportsTotalVat += quote.TotalVat;
                        reportsGrandTotal += quote.GrandTotal;
                    }
                }

                Report newReport = new Report()
                {
                    ReportId = reportId,
                    ReportDate = DateTime.UtcNow,
                    NetTotal = reportsNetTotal,
                    TotalVat = reportsTotalVat,
                    GrandTotal = reportsGrandTotal,
                    QuotesCount = quotesToInclude.Count,
                    Quotes = quotes
                };

                context.Reports.Add(newReport);

                var success = await context.SaveChangesAsync() > 0;
                if (!success) throw new DbUpdateException("Error updating the database");
                else
                {
                    var report = await context.Reports
                        .Where(r => r.ReportId == reportId)
                        .Include(r => r.Quotes)
                        .FirstOrDefaultAsync();

                    var email = new MimeMessage();
                    email.From.Add(MailboxAddress.Parse("noreply@buildquote.co.uk"));

                    InternetAddressList recipientsList = new InternetAddressList();
                    var recipients = await context.Providers
                        .Where(p => p.ReceiveReports)
                        .ToListAsync();

                    if (!recipients.Any()) return Ok(false);
                    foreach (var recipient in recipients)
                        recipientsList.Add(MailboxAddress.Parse(recipient.Email));

                    email.To.AddRange(recipientsList);

                    email.Subject = "Daily quotes report";

                    if (report == null) return Ok(false);

                    if (report.Quotes == null || !report.Quotes.Any())
                    {
                        email.Body = new TextPart(MimeKit.Text.TextFormat.Html)
                        {
                            Text = "No quotes were emailed to customers today."
                        };
                    }
                    else
                    {
                        string quoteRows = "";
                        foreach (var quote in report.Quotes) quoteRows += $@"
<tr style=""line-height: 24px; font-size: 16px; border-top-width: 1px; border-top-color: #e2e8f0; border-top-style: solid; margin: 0; padding: 12px;"" align=""left"" valign=""top"">
    <td>#{quote.QuoteNumber}</td>
    <td>{quote.ProviderName}</td>
    <td>{quote.CustomerName}</td>
    <td>&pound;{string.Format("{0:.00}", quote.NetPrice)}</td>
    <td>&pound;{string.Format("{0:.00}", quote.TotalVat)}</td>
    <td>&pound;{string.Format("{0:.00}", quote.GrandTotal)}</td>
</tr>";

                        string emailBody = $@"<!DOCTYPE html PUBLIC ""-//W3C//DTD HTML 4.0 Transitional//EN"" ""http://www.w3.org/TR/REC-html40/loose.dtd"">
<html>
  <head>
    <!-- Compiled with Bootstrap Email version: 1.1.0 -->
    <meta http-equiv=""x-ua-compatible"" content=""ie=edge"" />
    <meta name=""x-apple-disable-message-reformatting"" />
    <meta name=""viewport"" content=""width=device-width, initial-scale=1"" />
    <meta
      name=""format-detection""
      content=""telephone=no, date=no, address=no, email=no""
    />
    <meta http-equiv=""Content-Type"" content=""text/html; charset=utf-8"" />
    <style type=""text/css"">
      body,
      table,
      td {{
        font-family: Helvetica, Arial, sans-serif !important;
      }}
      .ExternalClass {{
        width: 100%;
      }}
      .ExternalClass,
      .ExternalClass p,
      .ExternalClass span,
      .ExternalClass font,
      .ExternalClass td,
      .ExternalClass div {{
        line - height: 150%;
      }}
      a {{
        text - decoration: none;
      }}
      * {{
        color: inherit;
      }}
      a[x-apple-data-detectors],
      u + #body a,
      #MessageViewBody a {{
        color: inherit;
        text-decoration: none;
        font-size: inherit;
        font-family: inherit;
        font-weight: inherit;
        line-height: inherit;
      }}
      img {{
        -ms - interpolation - mode: bicubic;
      }}
      table:not([class^=""s-""]) {{
        font - family: Helvetica, Arial, sans-serif;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
        border-spacing: 0px;
        border-collapse: collapse;
      }}
      table:not([class^=""s-""]) td {{
        border - spacing: 0px;
        border-collapse: collapse;
      }}
      @media screen and (max-width: 600px) {{
        .w - full,
        .w - full > tbody > tr > td {{
          width: 100% !important;
        }}
        *[class*=""s-lg-""] > tbody > tr > td {{
          font-size: 0 !important;
          line-height: 0 !important;
          height: 0 !important;
        }}
        .s-3 > tbody > tr > td {{
          font-size: 12px !important;
          line-height: 12px !important;
          height: 12px !important;
        }}
        .s-5 > tbody > tr > td {{
          font-size: 20px !important;
          line-height: 20px !important;
          height: 20px !important;
        }}
      }}
    </style>
  </head>
  <body
    class=""bg-light""
    style=""
      outline: 0;
      width: 100%;
      min-width: 100%;
      height: 100%;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
        'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
        'Helvetica Neue', sans-serif;
      line-height: 24px;
      font-weight: normal;
      font-size: 16px;
      -moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      color: #000000;
      margin: 0;
      padding: 0;
      border: 0;
    ""
    bgcolor=""#f7fafc""
  >
    <table
      class=""bg-light body""
      valign=""top""
      role=""presentation""
      border=""0""
      cellpadding=""0""
      cellspacing=""0""
      style=""
        outline: 0;
        width: 100%;
        min-width: 100%;
        height: 100%;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        font-family: Helvetica, Arial, sans-serif;
        line-height: 24px;
        font-weight: normal;
        font-size: 16px;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: #000000;
        margin: 0;
        padding: 0;
        border: 0;
      ""
      bgcolor=""#f7fafc""
    >
      <tbody>
        <tr>
          <td
            valign=""top""
            style=""line-height: 24px; font-size: 16px; margin: 0""
            align=""left""
            bgcolor=""#f7fafc""
          >
            <table
              class=""container""
              role=""presentation""
              border=""0""
              cellpadding=""0""
              cellspacing=""0""
              style=""width: 100%""
            >
              <tbody>
                <tr>
                  <td
                    align=""center""
                    style=""
                      line-height: 24px;
                      font-size: 16px;
                      margin: 0;
                      padding: 0 16px;
                    ""
                  >
                    <!--[if (gte mso 9)|(IE)]>
                      <table align=""center"" role=""presentation"">
                        <tbody>
                          <tr>
                            <td width=""600"">
                    <![endif]-->
                    <table
                      align=""center""
                      role=""presentation""
                      border=""0""
                      cellpadding=""0""
                      cellspacing=""0""
                      style=""width: 100%; max-width: 600px; margin: 0 auto""
                    >
                      <tbody>
                        <tr>
                          <td
                            style=""
                              line-height: 24px;
                              font-size: 16px;
                              margin: 0;
                            ""
                            align=""left""
                          >
                            <h1
                              class=""""
                              style=""
                                padding-top: 0;
                                padding-bottom: 0;
                                font-weight: 500;
                                vertical-align: baseline;
                                font-size: 36px;
                                line-height: 43.2px;
                                margin: 0;
                              ""
                              align=""left""
                            >
                              Report for {DateTime.UtcNow:dd/MM/yyyy}
                            </h1>
                            <table
                              class=""s-5 w-full""
                              role=""presentation""
                              border=""0""
                              cellpadding=""0""
                              cellspacing=""0""
                              style=""width: 100%""
                              width=""100%""
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style=""
                                      line-height: 20px;
                                      font-size: 20px;
                                      width: 100%;
                                      height: 20px;
                                      margin: 0;
                                    ""
                                    align=""left""
                                    width=""100%""
                                    height=""20""
                                  >
                                    &#160;
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table
                              class=""s-3 w-full""
                              role=""presentation""
                              border=""0""
                              cellpadding=""0""
                              cellspacing=""0""
                              style=""width: 100%""
                              width=""100%""
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style=""
                                      line-height: 12px;
                                      font-size: 12px;
                                      width: 100%;
                                      height: 12px;
                                      margin: 0;
                                    ""
                                    align=""left""
                                    width=""100%""
                                    height=""12""
                                  >
                                    &#160;
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table
                              class=""table-responsive""
                              border=""0""
                              cellpadding=""0""
                              cellspacing=""0""
                            >
                              <tr>
                                <th
                                  style=""
                                    line-height: 24px;
                                    font-size: 16px;
                                    margin: 0;
                                  ""
                                  align=""left""
                                >
                                  Today's emailed quote count:
                                </th>
                                <td
                                  style=""
                                    line-height: 24px;
                                    font-size: 16px;
                                    margin: 0;
                                  ""
                                  align=""left""
                                >
                                  {report.QuotesCount}.
                                </td>
                              </tr>
                            </table>
                            <table
                              class=""s-3 w-full""
                              role=""presentation""
                              border=""0""
                              cellpadding=""0""
                              cellspacing=""0""
                              style=""width: 100%""
                              width=""100%""
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style=""
                                      line-height: 12px;
                                      font-size: 12px;
                                      width: 100%;
                                      height: 12px;
                                      margin: 0;
                                    ""
                                    align=""left""
                                    width=""100%""
                                    height=""12""
                                  >
                                    &#160;
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table
                              class=""s-3 w-full""
                              role=""presentation""
                              border=""0""
                              cellpadding=""0""
                              cellspacing=""0""
                              style=""width: 100%""
                              width=""100%""
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style=""
                                      line-height: 12px;
                                      font-size: 12px;
                                      width: 100%;
                                      height: 12px;
                                      margin: 0;
                                    ""
                                    align=""left""
                                    width=""100%""
                                    height=""12""
                                  >
                                    &#160;
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table
                              class=""table table-striped""
                              border=""0""
                              cellpadding=""0""
                              cellspacing=""0""
                              style=""width: 100%; max-width: 100%""
                            >
                              <thead>
                                <tr>
                                  <th
                                    style=""
                                      line-height: 24px;
                                      font-size: 16px;
                                      border-bottom-width: 2px;
                                      border-bottom-color: #e2e8f0;
                                      border-bottom-style: solid;
                                      border-top-width: 1px;
                                      border-top-color: #e2e8f0;
                                      border-top-style: solid;
                                      margin: 0;
                                      padding: 12px;
                                    ""
                                    align=""left""
                                    valign=""top""
                                  >
                                    Quote
                                  </th>
                                  <th
                                    style=""
                                      line-height: 24px;
                                      font-size: 16px;
                                      border-bottom-width: 2px;
                                      border-bottom-color: #e2e8f0;
                                      border-bottom-style: solid;
                                      border-top-width: 1px;
                                      border-top-color: #e2e8f0;
                                      border-top-style: solid;
                                      margin: 0;
                                      padding: 12px;
                                    ""
                                    align=""left""
                                    valign=""top""
                                  >
                                    Provider
                                  </th>
                                  <th
                                    style=""
                                      line-height: 24px;
                                      font-size: 16px;
                                      border-bottom-width: 2px;
                                      border-bottom-color: #e2e8f0;
                                      border-bottom-style: solid;
                                      border-top-width: 1px;
                                      border-top-color: #e2e8f0;
                                      border-top-style: solid;
                                      margin: 0;
                                      padding: 12px;
                                    ""
                                    align=""left""
                                    valign=""top""
                                  >
                                    Customer
                                  </th>
                                  <th
                                    style=""
                                      line-height: 24px;
                                      font-size: 16px;
                                      border-bottom-width: 2px;
                                      border-bottom-color: #e2e8f0;
                                      border-bottom-style: solid;
                                      border-top-width: 1px;
                                      border-top-color: #e2e8f0;
                                      border-top-style: solid;
                                      margin: 0;
                                      padding: 12px;
                                    ""
                                    align=""left""
                                    valign=""top""
                                  >
                                    Net Price
                                  </th>
                                  <th
                                    style=""
                                      line-height: 24px;
                                      font-size: 16px;
                                      border-bottom-width: 2px;
                                      border-bottom-color: #e2e8f0;
                                      border-bottom-style: solid;
                                      border-top-width: 1px;
                                      border-top-color: #e2e8f0;
                                      border-top-style: solid;
                                      margin: 0;
                                      padding: 12px;
                                    ""
                                    align=""left""
                                    valign=""top""
                                  >
                                    Net VAT
                                  </th>
                                  <th
                                    style=""
                                      line-height: 24px;
                                      font-size: 16px;
                                      border-bottom-width: 2px;
                                      border-bottom-color: #e2e8f0;
                                      border-bottom-style: solid;
                                      border-top-width: 1px;
                                      border-top-color: #e2e8f0;
                                      border-top-style: solid;
                                      margin: 0;
                                      padding: 12px;
                                    ""
                                    align=""left""
                                    valign=""top""
                                  >
                                    Net Total
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {quoteRows}
                              </tbody>
                            </table>
                            <table
                              class=""s-3 w-full""
                              role=""presentation""
                              border=""0""
                              cellpadding=""0""
                              cellspacing=""0""
                              style=""width: 100%""
                              width=""100%""
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style=""
                                      line-height: 12px;
                                      font-size: 12px;
                                      width: 100%;
                                      height: 12px;
                                      margin: 0;
                                    ""
                                    align=""left""
                                    width=""100%""
                                    height=""12""
                                  >
                                    &#160;
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table
                              class=""s-3 w-full""
                              role=""presentation""
                              border=""0""
                              cellpadding=""0""
                              cellspacing=""0""
                              style=""width: 100%""
                              width=""100%""
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style=""
                                      line-height: 12px;
                                      font-size: 12px;
                                      width: 100%;
                                      height: 12px;
                                      margin: 0;
                                    ""
                                    align=""left""
                                    width=""100%""
                                    height=""12""
                                  >
                                    &#160;
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table
                              class=""table-responsive""
                              border=""0""
                              cellpadding=""0""
                              cellspacing=""0""
                            >
                              <tr>
                                <th
                                  style=""
                                    line-height: 24px;
                                    font-size: 16px;
                                    margin: 0;
                                  ""
                                  align=""left""
                                >
                                  Overall Sub-Total
                                </th>
                                <td
                                  style=""
                                    line-height: 24px;
                                    font-size: 16px;
                                    margin: 0;
                                  ""
                                  align=""left""
                                >
                                  &#163;{string.Format("{0:.00}",
                                          report.NetTotal)}
                                </td>
                              </tr>
                              <tr>
                                <th
                                  style=""
                                    line-height: 24px;
                                    font-size: 16px;
                                    margin: 0;
                                  ""
                                  align=""left""
                                >
                                  Overall VAT
                                </th>
                                <td
                                  style=""
                                    line-height: 24px;
                                    font-size: 16px;
                                    margin: 0;
                                  ""
                                  align=""left""
                                >
                                  &#163;{string.Format("{0:.00}",
                                          report.TotalVat)}
                                </td>
                              </tr>
                              <tr
                                class=""border-top-2""
                                style=""
                                  border-top-width: 2px !important;
                                  border-top-color: #e2e8f0 !important;
                                  border-top-style: solid !important;
                                ""
                              >
                                <th
                                  style=""
                                    line-height: 24px;
                                    font-size: 16px;
                                    margin: 0;
                                  ""
                                  align=""left""
                                >
                                  Overall Total
                                </th>
                                <td
                                  class=""text-xl""
                                  style=""
                                    line-height: 24px;
                                    font-size: 20px;
                                    margin: 0;
                                  ""
                                  align=""left""
                                >
                                  <strong
                                    >&#163;{string.Format("{0:.00}",
                                            report.GrandTotal)}</strong
                                  >
                                </td>
                              </tr>
                            </table>
                            <table
                              class=""s-3 w-full""
                              role=""presentation""
                              border=""0""
                              cellpadding=""0""
                              cellspacing=""0""
                              style=""width: 100%""
                              width=""100%""
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style=""
                                      line-height: 12px;
                                      font-size: 12px;
                                      width: 100%;
                                      height: 12px;
                                      margin: 0;
                                    ""
                                    align=""left""
                                    width=""100%""
                                    height=""12""
                                  >
                                    &#160;
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <!--[if (gte mso 9)|(IE)]>
                    </td>
                  </tr>
                </tbody>
              </table>
                    <![endif]-->
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
";

                        email.Body = new TextPart(MimeKit.Text.TextFormat.Html)
                        {
                            Text = emailBody
                        };
                    }

                    using var smtp = new SmtpClient();
                    smtp.Connect("smtp.mailtrap.io", 2525);
                    smtp.Authenticate("225df7390061fd", "dad74cad2c79b2");
                    smtp.Send(email);
                    smtp.Disconnect(true);

                    return Ok(true);
                }
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

        // DELETE /reports/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> Delete(string? id)
        {
            if (id == null) return NotFound(id);

            try
            {
                using var context = _context;

                var entity = await context.Reports.FirstOrDefaultAsync(r => r.ReportId == id);
                if (entity == null) return NotFound(id);

                var quotes = await context.ReportQuotes
                    .Where(q => q.ReportId == id)
                    .ToListAsync();
                foreach (var quote in quotes) context.ReportQuotes.Remove(quote);

                context.Reports.Remove(entity);

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
