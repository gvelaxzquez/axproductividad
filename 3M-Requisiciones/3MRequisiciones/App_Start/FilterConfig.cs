using System.Web;
using System.Web.Mvc;

namespace _3MRequisiciones
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            //filters.Add(new Autorizacion());
            //filters.Add(new OutputCacheAttribute() { NoStore = true, Duration = 0 });
            filters.Add(new HandleErrorAttribute());
        }
    }
}
