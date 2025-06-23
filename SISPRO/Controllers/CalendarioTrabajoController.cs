using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Configuration;
using CapaDatos;
using AxProductividad.ClasesAuxiliares;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using CapaDatos.Models;

namespace AxProductividad.Controllers
{
    public class CalendarioTrabajoController : Controller
    {
        // GET: DiasLaborales
        public ActionResult Index()
        {
            ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
            Session["Controlador" + Session.SessionID] = "CalendarioTrabajo";
            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }

            if (!FuncionesGenerales.ValidaPermisos(0))
            {
                return RedirectToAction("Unauthorized", "ERROR");

            }
            return View();
        }


        public ActionResult ConsultaCalendario(int Anio, int Mes) {
            var resultado = new JObject();
            try
            {

                CD_CalendarioTrabajo cd_dl = new CD_CalendarioTrabajo();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                CalendarioTrabajoModel calendario  = cd_dl.ObtieneCalendario(Anio, Mes, Conexion);



                resultado["Exito"] = true;
                resultado["Guardado"] = calendario.DiasLaborales != 0 ? true : false;
                resultado["Calendario"] = JsonConvert.SerializeObject(calendario);

                return Content(resultado.ToString());


            }
            catch (Exception)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = "Error al consultar el calendario.";

                return Content(resultado.ToString());
            }

        }

        public ActionResult GuardarCalendario(CalendarioTrabajoModel calendario) {
            var resultado = new JObject();
            try
            {
                CD_CalendarioTrabajo cd_dl = new CD_CalendarioTrabajo();

                if (!FuncionesGenerales.ValidaPermisos(1))
                {
                    resultado["Exito"] = false;
                    resultado["Mensaje"] = Mensajes.MensajePermisoGuardar();
                    return Content(resultado.ToString());
                }
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                var exito = cd_dl.GuardaCalendario(calendario, Conexion);

                resultado["Exito"] = true;
                resultado["Mensaje"] = Mensajes.MensajeGuardadoExito(); ;

                return Content(resultado.ToString());

            }
            catch (Exception)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = "Error al guardar el calendario.";

                return Content(resultado.ToString());
            }

        }

        public ActionResult ConsultaDiasFestivos() {
            var resultado = new JObject();
            try
            {

                CD_CalendarioTrabajo cd_dl = new CD_CalendarioTrabajo();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                List<DiasFestivosModel> LstDias = cd_dl.ConsultarDiasFestivos(Conexion);
               

                resultado["Exito"] = true;
                resultado["LstDias"] = JsonConvert.SerializeObject(LstDias);


                return Content(resultado.ToString());


            }
            catch (Exception)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = "Error al eliminar el registro.";

                return Content(resultado.ToString());
            }
        }

        public ActionResult GuardarDiaFestivo(DateTime Fecha) {
            var resultado = new JObject();
            try
            {

                CD_CalendarioTrabajo cd_dl = new CD_CalendarioTrabajo();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                int Exito = cd_dl.GuardarDiaFestivo(Fecha, Conexion);


                resultado["Exito"] = true;
                resultado["Mensaje"] = "Se guardaron los datos correctamente.";
           

                return Content(resultado.ToString());


            }
            catch (Exception)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = "Error al guardar el registro.";

                return Content(resultado.ToString());
            }

        }

        public ActionResult EliminarDiaFestivo(long IdDiaF)
        {
            var resultado = new JObject();
            try
            {

                CD_CalendarioTrabajo cd_dl = new CD_CalendarioTrabajo();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                int Exito = cd_dl.EliminarDiaFestivo(IdDiaF,Conexion);


                resultado["Exito"] = true;
                resultado["Mensaje"] = "Se eliminaron los datos correctamente.";


                return Content(resultado.ToString());


            }
            catch (Exception)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = "Error al eliminar el registro.";

                return Content(resultado.ToString());
            }

        }
    }
}