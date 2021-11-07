using Microsoft.Extensions.Logging;
using Quartz;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace BuildQuote.Jobs
{
    [DisallowConcurrentExecution]
    public class DailyReportJob : IJob
    {
        private readonly ILogger<DailyReportJob> _logger;
        public DailyReportJob(ILogger<DailyReportJob> logger) => _logger = logger;

        public Task Execute(IJobExecutionContext context)
        {
            string api = "/api/reports/senddaily";
            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri("https://localhost:5001");

            // Add an Accept header for JSON format.
            client.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json"));

            // List data response.
            HttpResponseMessage response = client.PostAsync(api, null).Result;  // Blocking call! Program will wait here until a response is received or a timeout occurs.
            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("Daily report handled.");
                client.Dispose();
                return Task.FromResult(response);
            }
            else
            {
                _logger.LogInformation("Error encountered while generating/sending daily report.");
                client.Dispose();
                return Task.FromResult(response);
            }
        }
    }
}
