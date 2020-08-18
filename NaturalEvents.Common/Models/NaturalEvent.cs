using System;
using System.Collections.Generic;

namespace NaturalEvents.Common.Models
{
    public class NaturalEvent
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public Uri Link { get; set; }
        public DateTime? Closed { get; set; }
        public List<NaturalEventCategory> Categories { get; set; }
        public List<NaturalEventSource> Sources { get; set; }
        public List<NaturalEventGeometry> Geometries { get; set; }

        public bool IsOpen => !Closed.HasValue;
    }

    public class EONETEventsResult
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public Uri Link { get; set; }
        public List<NaturalEvent> Events { get; set; }
    }

    public enum OrderDirection
    {
        ASC = 1,
        DESC = 2
    }

    public enum NaturalEventOrder
    {
        Date = 1,
        Title = 2,
        Status = 3,
        Category = 4,
        Source = 5
    }

    public class NaturalEventFilter
    {
        public DateTime? Date { get; set; }
        public string Title { get; set; }
        public string Source { get; set; }
        public string Category { get; set; }
        public bool? IsOpen { get; set; }
        public NaturalEventOrder? OrderBy { get; set; }
        public OrderDirection? OrderDirection { get; set; }

        public override string ToString() =>
            $"{Date}|{Title}|{Source}|{Category}|{IsOpen}|{OrderBy}|{OrderDirection}";
    }
}
