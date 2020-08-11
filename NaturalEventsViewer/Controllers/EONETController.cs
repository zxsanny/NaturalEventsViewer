using Microsoft.AspNetCore.Mvc;
using NaturalEvents.Common.Interfaces;
using NaturalEvents.Common.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NaturalEventsViewer.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EONETController : Controller
    {
        readonly IEONETApi EONETApi;

        public EONETController(IEONETApi eonetApi)
        {
            EONETApi = eonetApi;
        }

        [HttpGet("events")]
        public async Task<IReadOnlyList<NaturalEvent>> Get() =>
            await EONETApi.Get();
    }
}
