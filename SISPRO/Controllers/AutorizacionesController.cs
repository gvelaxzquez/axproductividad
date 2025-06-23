using AxProductividad.ClasesAuxiliares;
using CapaDatos;
using CapaDatos.DataBaseModel;
using CapaDatos.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace AxProductividad.Controllers
{
    public class AutorizacionesController : Controller
    {
        // GET: Autorizaciones
        public ActionResult Index()
        {
            Session["Controlador" + Session.SessionID] = "Autorizaciones";
            if (!FuncionesGenerales.SesionActiva())
                return RedirectToAction("Index", "Login");

            if (!FuncionesGenerales.ValidaPermisos(0))
            {
                return RedirectToAction("Unauthorized", "ERROR");

            }

            return View();
        }
    }
}