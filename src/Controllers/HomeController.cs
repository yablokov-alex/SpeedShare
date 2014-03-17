using SpeedShare.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;

namespace SpeedShare.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult GooglePlus(string url)
        {
            url = string.Format("https://plusone.google.com/u/0/_/+1/fastbutton?url={0}&count=true", url);

            var client = new WebClient();
            client.Headers.Set("content-type", "application/json");

            string response = null;
            try
            {
                response = client.DownloadString(url);
            }
            catch (Exception ex)
            { }

            return new JsonpResult
            {
                Data = new { count = GetGooglePageCount(response) }
            };
        }

        private int GetGooglePageCount(string response)
        {
            if (!string.IsNullOrEmpty(response))
            {
                var match = Regex.Match(response, "c: (?<count>[0-9]{1,})");
                string count = match.Groups["count"].Value;

                if (!string.IsNullOrEmpty(count))
                    return Convert.ToInt32(count);
            }

            return 0;
        }
    }
}