using System;
using System.Collections.Generic;
using System.Web.Mvc;
using CapaDatos;
using CapaDatos.Models;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Configuration;

namespace AxProductividad.Controllers
{
    public class ConsultaCompensacionesController : Controller
    {
        // GET: ConsultaCompensaciones
        public ActionResult Index()
        {
            ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
            Session["Controlador" + Session.SessionID] = "ConsultaCompensaciones";
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

        public ActionResult Inicializar() {
            var resultado = new JObject();
            try
            {
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                CD_CatalogoGeneral cd_CatGenral = new CD_CatalogoGeneral();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                List<CatalogoGeneralModel> LstUsuarios = cd_CatGenral.ObtenerUsuarios(Usuario.IdUsuario, Conexion);


                resultado["Exito"] = true;
                resultado["LstUsuarios"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlComboxMultiple(LstUsuarios);


                return Content(resultado.ToString());
            }
            catch (Exception)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = "Error al inicializar la pantalla.";


                return Content(resultado.ToString());

            }


        }
        public ActionResult ConsultaCompensaciones(FiltrosModel Filtros)
        {

            var resultado = new JObject();
            try
            {
                Filtros.IdUsuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.IdUsuario;


                List<CompensacionModel> LstEncabezado = new List<CompensacionModel>();
                List<ActividadesModel> LstDetalle = new List<ActividadesModel>();
                List<CompensacionModel> LstEncabezadoLider = new List<CompensacionModel>();
                List<CompensacionModel> LstDetalleLider = new List<CompensacionModel>();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
            /*    string Conexion = ConfigurationManager.ConnectionStrings["BDProductividad"].ToString()*/;
                CD_Reportes cd_rep = new CD_Reportes();


                cd_rep.ConsultaCompensaciones(Filtros, ref LstEncabezado, ref LstDetalle,ref LstEncabezadoLider, ref LstDetalleLider, Conexion);

                resultado["Exito"] = LstEncabezado.Count == 0 ? false : true;
                resultado["Mensaje"] = LstEncabezado.Count == 0 ? "No se encontro información" : "";
                resultado["LstEncabezado"] = JsonConvert.SerializeObject(LstEncabezado);
                resultado["LstDetalle"] = JsonConvert.SerializeObject(LstDetalle);

                return Content(resultado.ToString());

            }
            catch (Exception)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = "Error al consultar la información de compensaciones.";


                return Content(resultado.ToString());
            }

        }
    }
}