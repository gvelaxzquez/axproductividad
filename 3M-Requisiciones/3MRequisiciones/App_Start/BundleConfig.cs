using System.Web;
using System.Web.Optimization;

namespace _3MRequisiciones
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));


            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/summernote/summernote.css",
                      //"~/Content/bootstrap.css",
                       //"~/Content/bootstrap-select.min.css",
                      "~/Content/Project/Mensajes.css",
                      //"~/Content/site.css",
                      "~/Content/please-wait.css"
                      ));
            bundles.Add(new ScriptBundle("~/Scripts/Jquery").Include(
               "~/Scripts/jquery.min.js",
               "~/Scripts/jquery-ui.min.js"
           ));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                    "~/Scripts/bootstrap.js",
                    "~/Scripts/bootstrap-file-input.js",
                    "~/Scripts/respond.js"
          ));
            bundles.Add(new ScriptBundle("~/Scripts/Layout").Include(
                  "~/Scripts/icheck.min.js",
                  "~/Scripts/moment-with-locales.min.js",
                   "~/Scripts/bootstrap-datetimepicker.min.js",
                   "~/Scripts/jquery.number.min.js",
                   "~/Scripts/jquery.mCustomScrollbar.min.js",
                   "~/Scripts/scrolltopcontrol.js",
                   "~/Scripts/raphael-min.js",
                   "~/Scripts/morris.min.js",
                   "~/Scripts/d3.v3.js",
                  "~/Scripts/rickshaw.min.js",
                  "~/Scripts/bootstrap-datepicker.js",
                  "~/Scripts/owl.carousel.min.js",
                  "~/Scripts/moment.min.js",
                  "~/Scripts/daterangepicker.js",
                  "~/Scripts/bootstrap-select.min.js",
                  "~/Scripts/i18n/defaults-es_CL.min.js",
                  "~/Scripts/plugins.js",
                  "~/Scripts/actions.js",
                  "~/Scripts/Project/Mensajes.js",
                   "~/Scripts/Project/FuncionesGenerales.js",
                  "~/Scripts/please-wait.min.js",
                  "~/Scripts/DataTables/jquery.dataTables.min.js",
                  "~/Scripts/DataTables/dataTables.bootstrap.min.js",
                  "~/Scripts/summernote/summernote.js",
                  "~/Scripts/sweetalert.min.js",
                  //"~/Scripts/smartwizard/jquery.smartWizard-2.0.min.js",
                  "~/Scripts/smartwizard/smartwizard3.js",
                  "~/Scripts/echarts.min.js",
                  "~/Scripts/codemirror.js"
                  ////"~/Scripts/Project/ValidaSesion.js"
                 ));

        }
    }
}
