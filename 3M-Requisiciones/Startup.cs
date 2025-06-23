using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(_3MRequisiciones.Startup))]
namespace _3MRequisiciones
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
