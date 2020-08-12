using LazyCache;
using NaturalEvents.Common.Interfaces;
using NaturalEvents.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NaturalEvents.Repostitory
{
    public class EONETRepository : IEONETRepository
    {
        readonly IAppCache AppCache;
        readonly IEONETApi EONETApi;

        readonly Dictionary<NaturalEventsOrder, Func<NaturalEvent, object>> OrderDict = new Dictionary<NaturalEventsOrder, Func<NaturalEvent, object>>()
                {
                    { NaturalEventsOrder.Date, x => x.Closed ?? x.Geometries.FirstOrDefault()?.Date },
                    { NaturalEventsOrder.Category, x => x.Categories.FirstOrDefault()?.Title },
                    { NaturalEventsOrder.Status, x => x.IsOpen },
                };

        public EONETRepository(IEONETApi eonetApi, IAppCache appCache)
        {
            AppCache = appCache;
            EONETApi = eonetApi;
        }

        public async Task<IReadOnlyList<NaturalEvent>> Get(NaturalEventsOrder? orderBy, DateTime? date, bool? isOpen, string category, List<string> sources, int? limit, int? daysLimit)
        {
            var events = await AppCache.GetOrAddAsync($"{orderBy}|{date}|{isOpen}|{limit}|{daysLimit}",
                async () => await EONETApi.Get(sources, isOpen, limit, daysLimit), TimeSpan.FromSeconds(30));
            
            if (date.HasValue)
            {
                events = events.Where(e => e.Closed.HasValue && e.Closed.Value == date || e.Geometries.Any(g => g.Date == date));
            }
            if (!string.IsNullOrEmpty(category))
            {
                events = events.Where(e => e.Categories.Any(c => c.Title == category));
            }
            if (orderBy.HasValue)
            {
                events.OrderBy(x => OrderDict[orderBy.Value]);
            }
            return events.ToList();
        }
    }
}