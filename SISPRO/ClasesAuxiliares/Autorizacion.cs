using System;
using System.Web.Mvc;
using System.Configuration;

namespace AxProductividad
{
    public class Autorizacion : AuthorizeAttribute
    {
        /// <summary>
        /// Maneja la autorizacion en cada llamada
        /// a al controlador
        /// </summary>
        /// <param name="filterContext">Contexto</param>
        public override void OnAuthorization(AuthorizationContext filterContext)
        {
            try
            {
                bool anonimo = filterContext.ActionDescriptor.IsDefined(typeof(AllowAnonymousAttribute), true) || filterContext.ActionDescriptor.ControllerDescriptor.IsDefined(typeof(AllowAnonymousAttribute), true);
                bool valido = FuncionesGenerales.SesionActiva();
                filterContext.Controller.ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];


                if (!valido && !anonimo)
                {
                    HandleUnauthorizedRequest(filterContext);
                }
            }
            catch (Exception)
            {
                HandleUnauthorizedRequest(filterContext);
            }
        }

        /// <summary>
        /// Accion para llamadas no autorizadas
        /// </summary>
        /// <param name="filterContext">Contecto</param>
        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            try
            {
                base.HandleUnauthorizedRequest(filterContext);
                filterContext.Result = new RedirectResult("~/Login");
               
            }
            catch (Exception)
            {
                filterContext.Result = new RedirectResult("~/Login");
            }
        }
    }
}