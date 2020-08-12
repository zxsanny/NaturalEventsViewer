using NaturalEvents.Common.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NaturalEvents.Common.Interfaces
{
    public interface IEONETApi
    {
        Task<IEnumerable<NaturalEvent>> Get(List<string> sources, bool? isOpen, int? limit, int? daysLimit);
    }
}
