using Microsoft.AspNetCore.Mvc;
using NaturalEvents.Common.Models;
using NaturalEvents.Repostitory;
using System;
using System.Collections.Generic;
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
        public async Task<IReadOnlyList<NaturalEvent>> Get(NaturalEventsOrder? orderBy, OrderDirection? orderDirection, DateTime? date, bool? isOpen, string category)
        {
            var res = await EONETRepository.Get(orderBy, orderDirection, date, isOpen, category, null, null, null);
            EONETRepository.SaveEvents(res);
            return res;
        }
            
    }
}
