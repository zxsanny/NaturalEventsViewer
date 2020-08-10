using NaturalEvents.Common;
using NaturalEvents.Common.Interfaces;
using NaturalEvents.Common.Models;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace EONETAPIImplementation
{
    public class EONETApi : IEONETApi
    {
        readonly HttpClient HttpClient;

        public EONETApi(HttpClient httpClient)
        {
            HttpClient = httpClient;
        }

        public async Task<IReadOnlyList<NaturalEvent>> Get(List<string> sources = null, 
            bool? isOpen = null, 
            int? limit = null, 
            int? daysLimit = null)
        {
            var res = await HttpClient.Get<EONETEventsResult>("events", new Dictionary<string, string>
            {
                { "source", sources != null ? string.Join(",", sources) : null},
                { "status", isOpen.HasValue ? (isOpen.Value ? "open" : "closed") : null},
                { "limit", limit?.ToString()},
                { "days", daysLimit?.ToString()}
            });
            return res.Events;
        }
    }
}
