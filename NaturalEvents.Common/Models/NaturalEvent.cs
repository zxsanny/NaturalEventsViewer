﻿using System;
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

    
    public enum NaturalEventsOrder
    {
        Date = 0,
        Status = 1,
        Category = 2
    }
}
