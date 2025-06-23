using System;
using System.Collections.Generic;
using System.Web.Mvc;
using System.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Linq;
using CapaDatos;
using AxProductividad.ClasesAuxiliares;
using CapaDatos.Models;
using System.Configuration;
using System.IO;
using OfficeOpenXml;
using CapaDatos.Models.Constants;


namespace AxProductividad.Controllers
{
    public class SprintsController : Controller
    {
        // GET: Sprints
        public ActionResult Index()
        {

            ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
            Session["Controlador" + Session.SessionID] = "Sprints";

            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }

            if (!FuncionesGenerales.ValidaPermisos(0))
            {
                return RedirectToAction("Unauthorized", "ERROR");

            }

            var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
            string Conexion = Encripta.DesencriptaDatos(Usuario.ConexionEF);
            CD_CatalogoGeneral cd_CatGenral = new CD_CatalogoGeneral();

            List<CatalogoGeneralModel> LstProyectos = cd_CatGenral.ObtenerProyectosPorUsuario(Usuario, Conexion);

            ViewBag.LstProyectos = LstProyectos;

            return View();
        }
    }
}