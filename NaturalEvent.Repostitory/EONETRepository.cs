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
                    { NaturalEventsOrder.Date, x => x.Closed ?? x.Geometries.Min(g => g.Date)},
                    { NaturalEventsOrder.Category, x => x.Categories.FirstOrDefault()?.Title },
                    { NaturalEventsOrder.Status, x => x.IsOpen },
                };

        public EONETRepository(IEONETApi eonetApi, IAppCache appCache)
        {
            AppCache = appCache;
            EONETApi = eonetApi;
        }

        public async Task<IReadOnlyList<NaturalEvent>> Get(NaturalEventsOrder? orderBy, OrderDirection? orderDirection, DateTime? date, bool? isOpen, string category, List<string> sources, int? limit, int? daysLimit)
        {
            var events = await AppCache.GetOrAddAsync($"{orderBy}|{date}|{isOpen}|{limit}|{daysLimit}",
                async () => await EONETApi.Get(sources, isOpen, limit, daysLimit), TimeSpan.FromSeconds(30));
            
            if (date.HasValue)
            {
                events = events.Where(e => e.Closed.HasValue && e.Closed.Value.Date == date || e.Geometries.Any(g => g.Date.Date == date));
            }
            if (!string.IsNullOrEmpty(category))
            {
                events = events.Where(e => e.Categories.Any(c => c.Title.ToLower().Contains(category.ToLower().Trim())));
            }
            if (orderBy.HasValue)
            {
                events = orderDirection.HasValue && orderDirection.Value == OrderDirection.DESC
                    ? events.OrderByDescending(x => OrderDict[orderBy.Value])
                    : events.OrderBy(x => OrderDict[orderBy.Value]);                
            }
            return events.ToList();
        }

        public async Task<NaturalEvent> Get(string id)
        {
            var naturalEvent = AppCache.Get<NaturalEvent>(id);
            if (naturalEvent == null)
            {
                //since https://eonet.sci.gsfc.nasa.gov/docs/v2.1#eventsAPI doesn't provide a method to retrieve event by id, and there is no such event in a cache, then retrieve all events again
                SaveEvents( await Get(null, null, null, null, null, null, null, null));
                naturalEvent = AppCache.Get<NaturalEvent>(id);
            }
            
            if (naturalEvent == null)
            {
                throw new ArgumentException("There is no such event in EONET Repository!");
            }
            return naturalEvent;
        }

        public void SaveEvents(IReadOnlyList<NaturalEvent> events)
        {
            //Adding to the cache in order to retrieve on demand by Id. The other option is to put to own DB, but for that task I think it's ok-ish solution.
            //Lazy cache is using underhood by default .net MemoryCache, which is quite performant.
            foreach (var e in events)
            {
                AppCache.Add(e.Id, e, TimeSpan.FromMinutes(10));
            }
        }
    }
}