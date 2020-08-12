using System;
using System.Collections.Generic;

namespace NaturalEvents.Common.Models
{
    public enum GeometryType
    {
        Point = 0,
        Polygon = 1
    }

    public class NaturalEventGeometry
    {
        public DateTime Date { get; set; }
        public GeometryType Type { get; set; }
        public object Coordinates { get; set; }
    }
}