using NaturalEvents.Common.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NaturalEvents.Common.Interfaces
{
    public interface IEONETApi
    {
        Task<IReadOnlyList<NaturalEvent>> Get(List<string> sources = null, bool? isOpen = null, int? limit = null, int? daysLimit = null);
    }
}
