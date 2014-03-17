using System.Web;
using System.Web.Optimization;

namespace SpeedShare
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/speedshare").Include(
                        "~/Scripts/speedshare-{version}.js"));
        }
    }
}