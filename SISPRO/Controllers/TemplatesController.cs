using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using CapaDatos;
using AxProductividad.ClasesAuxiliares;
using CapaDatos.Models;
using System.IO;
using System.Configuration;
using OfficeOpenXml;
using System.Web.Routing;
using System.Threading.Tasks;
using CapaDatos.DataBaseModel;

namespace AxProductividad.Controllers
{
    public class TemplatesController : Controller
    {
        public ActionResult Index()
        {

            Session["Controlador" + Session.SessionID] = "Templates";

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

        public ActionResult ConsultaPlantillas()
        {
            var resultado = new JObject();
            try
            {
                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }
                List<PlantillaModel> LstPlantillas = new List<PlantillaModel>();
                CD_Plantilla cd_p = new CD_Plantilla();

                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                LstPlantillas = cd_p.ConsultaPlantillas(Encripta.DesencriptaDatos(Usuario.ConexionSP));

                resultado["Exito"] = true;

                resultado["LstPlantillas"] = JsonConvert.SerializeObject(LstPlantillas);
  
                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

                return Content(resultado.ToString());
            }
        }

        public ActionResult ConsultaPlantillasActivo()
        {
            var resultado = new JObject();
            try
            {
                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }
                List<PlantillaModel> LstPlantillas = new List<PlantillaModel>();
                CD_Plantilla cd_p = new CD_Plantilla();

                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                LstPlantillas = cd_p.ConsultaPlantillasActivo(Encripta.DesencriptaDatos(Usuario.ConexionSP));

                resultado["Exito"] = true;

                resultado["LstPlantillas"] = JsonConvert.SerializeObject(LstPlantillas);

                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

                return Content(resultado.ToString());
            }
        }

        public ActionResult ConsultaPlantilla( long IdPlantilla)
        {
            var resultado = new JObject();
            try
            {
                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }
                 PlantillaModel Plantilla = new PlantillaModel();
                CD_Plantilla cd_p = new CD_Plantilla();

                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                 Plantilla = cd_p.ConsultaPlantilla( IdPlantilla, Encripta.DesencriptaDatos(Usuario.ConexionEF));

                resultado["Exito"] = true;

                resultado["Plantilla"] = JsonConvert.SerializeObject(Plantilla);

                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

                return Content(resultado.ToString());
            }
        }

        public ActionResult GuardarPlantilla(PlantillaModel Plantilla)
        {
            var resultado = new JObject();
            try
            {
                if (!FuncionesGenerales.SesionActiva())
                {

                    return RedirectToAction("Index", "Login");
                }
             
                CD_Plantilla cd_p = new CD_Plantilla();

                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                Plantilla.IdUCreo = Usuario.IdUsuario;

                bool Exito = cd_p.GuardarPlantilla(Plantilla, Encripta.DesencriptaDatos(Usuario.ConexionEF));

                resultado["Exito"] = true;
                resultado["Mensaje"] = "Los datos se guardaron correctamente";

                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

                return Content(resultado.ToString());
            }
        }



    }
}