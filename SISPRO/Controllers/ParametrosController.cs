using System;
using System.Web;
using System.Web.Mvc;
using System.Web.Configuration;
using AxProductividad.ClasesAuxiliares;
using System.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using CapaDatos;
using CapaDatos.Models;
using System.IO;
 
namespace AxProductividad.Controllers
{
    public class ParametrosController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }
            Session["Controlador" + Session.SessionID] = "Parametros";

            if (!FuncionesGenerales.ValidaPermisos(0))
            {
                return RedirectToAction("Unauthorized", "ERROR");

            }

            return View();
        }

        [HttpPost]
        public ActionResult ObtenerParametros()
        {
            var resultado = new JObject();
            try
            {
                ConfiguracionModel Conf = new ConfiguracionModel();
                CD_Configuracion cd_conf = new CD_Configuracion();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                Conf = cd_conf.ObtenerConfiguracion(Conexion);
                Conf.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
                resultado["Exito"] = true;
                resultado["Datos"] = JsonConvert.SerializeObject(Conf);
                return Content(resultado.ToString());


            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
                return Content(resultado.ToString());
            }
        }

        [HttpPost]
        public ActionResult GuardarDatosCorreo(ConfiguracionModel Configuracion)
        {
            var resultado = new JObject();
            try
            {
                if (!FuncionesGenerales.PruebaServidor(Configuracion))
                {
                    resultado["Exito"] = false;
                    resultado["Mensaje"] = "Los parámetros ingresados son incorrectos, por favor revise la información.";
                    return Content(resultado.ToString());
                }

                if (!FuncionesGenerales.ValidaPermisos(1))
                {
                    resultado["Exito"] = false;
                    resultado["Mensaje"] = Mensajes.MensajePermisoGuardar();
                    return Content(resultado.ToString());
                }



                CD_Configuracion cd_Conf = new CD_Configuracion();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                bool Exito = cd_Conf.GuardaDatosCorreo(Configuracion, Conexion);

                resultado["Exito"] = Exito;
                resultado["Mensaje"] = Mensajes.MensajeGuardadoExito();
                return Content(resultado.ToString());


            }

            catch (Exception ex)
            {

                resultado["Exito"] = false;
                //resultado["Mensaje"] = "Los parámetros ingresados son incorrectos, por favor revise la información.";
                resultado["Mensaje"] = ex.Message;
                return Content(resultado.ToString());
            }
        }
        public ActionResult GuardarDatosContrasenia(ConfiguracionModel Configuracion)
        {
            var resultado = new JObject();
            try
            {
         

                if (!FuncionesGenerales.ValidaPermisos(1))
                {
                    resultado["Exito"] = false;
                    resultado["Mensaje"] = Mensajes.MensajePermisoGuardar();
                    return Content(resultado.ToString());
                }



                CD_Configuracion cd_Conf = new CD_Configuracion();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                bool Exito = cd_Conf.GuardaDatosContrasenia(Configuracion, Conexion);

                resultado["Exito"] = Exito;
                resultado["Mensaje"] = Mensajes.MensajeGuardadoExito();
                return Content(resultado.ToString());


            }

            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
                return Content(resultado.ToString());
            }
        }
        public ActionResult GuardarDatosCompensacion(ConfiguracionModel Configuracion)
        {
            var resultado = new JObject();
            try
            {


                if (!FuncionesGenerales.ValidaPermisos(1))
                {
                    resultado["Exito"] = false;
                    resultado["Mensaje"] = Mensajes.MensajePermisoGuardar();
                    return Content(resultado.ToString());
                }



                CD_Configuracion cd_Conf = new CD_Configuracion();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                bool Exito = cd_Conf.GuardaDatosCompensacion(Configuracion,Conexion);

                resultado["Exito"] = Exito;
                resultado["Mensaje"] = Mensajes.MensajeGuardadoExito();
                return Content(resultado.ToString());


            }

            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
                return Content(resultado.ToString());
            }
        }
        public ActionResult GuardarDatosSistema(string NombreSistema, HttpPostedFileBase  LogoPrincipal, HttpPostedFileBase LogoSecundario)
        {
            var resultado = "";
            try
            {


                if (!FuncionesGenerales.ValidaPermisos(1))
                {
                    resultado = "2";
                    return Content(resultado.ToString());
                }

                if (LogoPrincipal != null)
                {
                    var path = Server.MapPath("~/Content/Project/Imagenes");
                    var nombre = "LogoPrincipal.png";
                    var url = Path.Combine(path,nombre);

                    LogoPrincipal.SaveAs(url);
                }

                if (LogoSecundario != null)
                {
                    var path = Server.MapPath("~/Content/Project/Imagenes");
                    var nombre = "LogoSecundario.png";
                    var url = Path.Combine(path, nombre);

                    LogoSecundario.SaveAs(url);
                }

      

                var nombreactual = ConfigurationManager.AppSettings["NombreSistema"];

                if (nombreactual.ToUpper().Trim() != NombreSistema.ToUpper().Trim())
                {
                    Configuration webConfigApp = WebConfigurationManager.OpenWebConfiguration("~");
                    webConfigApp.AppSettings.Settings["NombreSistema"].Value = NombreSistema;
                    webConfigApp.Save();
                }


                resultado = "1";
                return Content(resultado.ToString());


            }

            catch (Exception ex)
            {

                resultado = ex.Message;
                return Content(resultado.ToString());
            }
        }

        public ActionResult GuardarDatosAsistencia(ConfiguracionModel Configuracion)
        {
            var resultado = new JObject();
            try
            {

                if (!FuncionesGenerales.ValidaPermisos(1))
                {
                    resultado["Exito"] = false;
                    resultado["Mensaje"] = Mensajes.MensajePermisoGuardar();
                    return Content(resultado.ToString());
                }



                CD_Configuracion cd_Conf = new CD_Configuracion();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                bool Exito = cd_Conf.GuardaDatosAsistencia(Configuracion, Conexion);

                resultado["Exito"] = Exito;
                resultado["Mensaje"] = Mensajes.MensajeGuardadoExito();
                return Content(resultado.ToString());


            }

            catch (Exception)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = "Los parámetros ingresados son incorrectos, por favor revise la información.";
                return Content(resultado.ToString());
            }
        }

        public ActionResult GuardarDatosProyecto(long idProyecto)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Editar))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoGuardar() });

                CD_Configuracion cd_Conf = new CD_Configuracion();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                var (estatus, mensaje) = cd_Conf.GuardarDatosProyecto(idProyecto, Conexion);

                return Json(new { Exito = estatus, Mensaje = mensaje });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }
    }
}