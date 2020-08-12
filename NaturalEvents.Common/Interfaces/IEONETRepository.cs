using NaturalEvents.Common.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NaturalEvents.Repostitory
{
    public interface IEONETRepository
    {
        Task<IReadOnlyList<NaturalEvent>> Get(NaturalEventsOrder? orderBy, OrderDirection? orderDirection, DateTime? date, bool? isOpen, string category, List<string> sources, int? limit, int? daysLimit);
        void SaveEvents(IReadOnlyList<NaturalEvent> events);
    }
}