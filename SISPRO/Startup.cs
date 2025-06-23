using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(AxProductividad.Startup))]
namespace AxProductividad
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
            app.MapSignalR();
        }
    }
}
