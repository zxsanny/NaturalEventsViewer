using Microsoft.AspNetCore.Mvc;
using NaturalEvents.Common.Models;
using NaturalEvents.Repostitory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NaturalEventsViewer.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EONETController : Controller
    {
        readonly IEONETRepository EONETRepository;

        public EONETController(IEONETRepository eonetRepository)
        {
            EONETRepository = eonetRepository;
        }

        [HttpGet("events")]
        public async Task<IReadOnlyList<NaturalEvent>> Get([FromQuery]NaturalEventFilter filter)
        {
            var res = await EONETRepository.Get(filter);
            EONETRepository.SaveEvents(res);
            return res;
        }

    }
}
