using NaturalEvents.Common.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NaturalEvents.Repostitory
{
    public interface IEONETRepository
    {
        Task<IReadOnlyList<NaturalEvent>> Get(NaturalEventFilter filter, int? limit = null, int? daysLimit = null);
        void SaveEvents(IReadOnlyList<NaturalEvent> events);
    }
}