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

        readonly Dictionary<NaturalEventOrder, Func<NaturalEvent, object>> OrderDict = new Dictionary<NaturalEventOrder, Func<NaturalEvent, object>>()
        {
            { NaturalEventOrder.Date, x => x.Closed ?? x.Geometries.Min(g => g.Date)},
            { NaturalEventOrder.Title, x => x.Title},
            { NaturalEventOrder.Status, x => x.IsOpen },
            { NaturalEventOrder.Category, x => x.Categories.FirstOrDefault()?.Title },
            { NaturalEventOrder.Source, x => x.Sources.FirstOrDefault()?.Id }
        };

        public EONETRepository(IEONETApi eonetApi, IAppCache appCache)
        {
            AppCache = appCache;
            EONETApi = eonetApi;
        }

        public async Task<IReadOnlyList<NaturalEvent>>Get(NaturalEventFilter filter, int? limit = null, int? daysLimit = null)
        {
            var events = await AppCache.GetOrAddAsync($"{filter}|{daysLimit}",
                async () => await EONETApi.Get(new[] { filter.Source }, filter.IsOpen, limit, daysLimit), TimeSpan.FromSeconds(30));
            
            if (filter.Date.HasValue)
            {
                events = events.Where(e => e.Closed.HasValue && e.Closed.Value.Date == filter.Date || e.Geometries.Any(g => g.Date.Date == filter.Date));
            }
            if (!string.IsNullOrEmpty(filter.Title))
            {
                events = events.Where(e => e.Title.ToLower().Contains(filter.Title.ToLower().Trim()));
            }
            if (!string.IsNullOrEmpty(filter.Category))
            {
                events = events.Where(e => e.Categories.Any(c => c.Title.ToLower().Contains(filter.Category.ToLower().Trim())));
            }
            if (filter.OrderBy.HasValue)
            {
                events = filter.OrderDirection.HasValue && filter.OrderDirection.Value == OrderDirection.DESC
                    ? events.OrderByDescending(OrderDict[filter.OrderBy.Value])
                    : events.OrderBy(OrderDict[filter.OrderBy.Value]);                
            }
            return events.ToList();
        }

        public async Task<NaturalEvent> Get(string id)
        {
            var naturalEvent = AppCache.Get<NaturalEvent>(id);
            if (naturalEvent == null)
            {
                //since https://eonet.sci.gsfc.nasa.gov/docs/v2.1#eventsAPI doesn't provide a method to retrieve event by id, and there is no such event in a cache, then retrieve all events again
                SaveEvents( await Get((NaturalEventFilter)null));
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