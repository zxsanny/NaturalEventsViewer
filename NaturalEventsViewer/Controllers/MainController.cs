using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using NaturalEventsViewer.Infrastructure;

namespace NaturalEventsViewer.Controllers
{
    public class MainController : Controller
    {
        public IActionResult Index()
        {
            return View(new WebSessionContext());
        }

        public IActionResult Error()
        {
            ViewData["RequestId"] = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
            return View();
        }
    }
}