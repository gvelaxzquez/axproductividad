using System;
using System.Collections.Generic;
using System.Web.Mvc;
using System.Configuration;
using AxProductividad.ClasesAuxiliares;
using CapaDatos;
using CapaDatos.Models;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

namespace AxProductividad.Controllers
{
    public class CompensacionesController : Controller
    {
        // GET: Compensaciones
        public ActionResult Index()
        {
            ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
            Session["Controlador" + Session.SessionID] = "Compensaciones";
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

        public ActionResult GeneraCompensaciones(FiltrosModel Filtros)
        {

            var resultado = new JObject();
            try
            {
                Filtros.IdUsuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.IdUsuario;


                List<CompensacionModel> LstEncabezado = new List<CompensacionModel>();
                List<ActividadesModel> LstDetalle = new List<ActividadesModel>();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
                //string Conexion = ConfigurationManager.ConnectionStrings["BDProductividad"].ToString();
                CD_Reportes cd_rep = new CD_Reportes();


                cd_rep.CalculoCompensaciones(Filtros, ref LstEncabezado, ref LstDetalle, Conexion);

                resultado["Exito"] = true;
                resultado["LstEncabezado"] = JsonConvert.SerializeObject(LstEncabezado);
                resultado["LstDetalle"] = JsonConvert.SerializeObject(LstDetalle);

                return Content(resultado.ToString());
            }
            catch (Exception)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = "El período seleccionado no cuenta con el calendario de trabajo configurado.";


                return Content(resultado.ToString());
            }

        }
        public ActionResult AnalisisSemanal(FiltrosModel Filtros)
        {

            var resultado = new JObject();
            try
            {
                Filtros.IdUsuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.IdUsuario;


                Dictionary<int, List<CompensacionModel>> LstEncabezado = new Dictionary<int, List<CompensacionModel>>();
                Dictionary<int, List<ActividadesModel>> LstDetalle = new Dictionary<int, List<ActividadesModel>>();
                Dictionary<int, List<ActividadesModel>> LstBugs = new Dictionary<int, List<ActividadesModel>>();
                Dictionary<int, List<UsuarioIncidencia>> LstIncidencias = new Dictionary<int, List<UsuarioIncidencia>>();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
                //string Conexion = ConfigurationManager.ConnectionStrings["BDProductividad"].ToString();
                CD_Reportes cd_rep = new CD_Reportes();


                cd_rep.CalculoProductividadPeriodo_SP(Filtros, ref LstEncabezado, ref LstDetalle, ref LstBugs, ref LstIncidencias, Conexion);

                resultado["Exito"] = true;
                resultado["LstEncabezado"] = JsonConvert.SerializeObject(LstEncabezado);
                resultado["LstDetalle"] = JsonConvert.SerializeObject(LstDetalle);
                resultado["LstBugs"] = JsonConvert.SerializeObject(LstBugs);
                resultado["LstIncidencias"] = JsonConvert.SerializeObject(LstIncidencias);

                return Content(resultado.ToString());
            }
            catch (Exception)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = "El período seleccionado no cuenta con el calendario de trabajo configurado.";


                return Content(resultado.ToString());
            }

        }


    }
}