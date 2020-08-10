using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace NaturalEvents.Common
{
    public static class HttpExtensions
    {
        public static string BuildUri(string path, Dictionary<string, string> values)
        {
            var query = string.Join("&", values.Where(kv => kv.Value != null)
                  .Select(kv => $"{HttpUtility.UrlEncode(kv.Key)}={HttpUtility.UrlEncode(kv.Value)}"));

            query = !string.IsNullOrEmpty(query) ? $"?{query}" : query;
            
            return $"{path}{query}";
        }

        public static async Task<T> Get<T>(this HttpClient client, string path, Dictionary<string, string> values)
        {
            var res = await client.GetAsync(BuildUri(path, values));
            var json = await res.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<T>(json);
        }
    }
}
