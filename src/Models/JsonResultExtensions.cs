using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SpeedShare.Models
{
    public static class JsonResultExtensions
    {
        public static JsonpResult ToJsonp(this JsonResult json)
        {
            return new JsonpResult { ContentEncoding = json.ContentEncoding, ContentType = json.ContentType, Data = json.Data, JsonRequestBehavior = json.JsonRequestBehavior };
        }
    }
}