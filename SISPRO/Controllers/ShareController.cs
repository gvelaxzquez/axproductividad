using CapaDatos.Models;
using CapaDatos;
using DocumentFormat.OpenXml.Office2010.Excel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AxProductividad.Controllers
{
    public class ShareController : Controller
    {
        // GET: Share
        public ActionResult Index()
        {

            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }

           

            var IdSharedAct = (string)(Session["IdShareAct" + Session.SessionID]) == null ? "0" : (string)(Session["IdShareAct" + Session.SessionID]);

            Session["IdShareAct" + Session.SessionID] = "0";

            ViewBag.IdSharedAct = IdSharedAct;
            return View();
        }

        [Route("s/{Id}")]
        public ActionResult s(string Id)
        {
            if (!FuncionesGenerales.SesionActiva())
            {
                Session["URL" + Session.SessionID] = HttpContext.Request.Url.ToString().ToLower();

                return RedirectToAction("Index", "Login");
            }




            Session["IdShareAct" + Session.SessionID] = Id;
            ViewBag.IdSharedAct = Id;
            ViewBag.URLHome = (string)(Session["Home" + Session.SessionID]);

            return View();
        }


        [Route("s/{Id}/{Id}")]
        public ActionResult a(long id, long id2)
        {

            CD_Actividad cd_a = new CD_Actividad();
            CD_Login cd_l = new CD_Login();

            string Conexion = cd_l.ObtenerConexionOrganizaionSP(id);

            ActividadesModel a = cd_a.ConsultaActividad_EXT(id2, Conexion);

            if (a == null) {

                return RedirectToAction("Unauthorized", "ERROR");
            }

            if (a.Estatus  == "C")
            {
                return RedirectToAction("Unauthorized", "ERROR");


            }
   

            return View(a);
        }
    }
}