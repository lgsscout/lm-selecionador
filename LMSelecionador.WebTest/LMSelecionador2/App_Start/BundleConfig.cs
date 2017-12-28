using System.Web;
using System.Web.Optimization;

namespace LMSelecionador2
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bower/jquery").Include(
                        "~/bower_components/jquery/dist/jquery.js"));

            bundles.Add(new ScriptBundle("~/bower/jsrender").Include(
                        "~/bower_components/jsrender/jsrender.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use a versão em desenvolvimento do Modernizr para desenvolver e aprender. Em seguida, quando estiver
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bower/bootstrap").Include(
                      "~/bower_components/dist/js/bootstrap.min.js"));

            bundles.Add(new StyleBundle("~/bower/bootstrap/css").Include(
                      "~/bower_components/dist/css/bootstrap.min.css",
                      "~/bower_components/dist/css/bootstrap-theme.min.css"));
        }
    }
}
