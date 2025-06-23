using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using CapaDatos;
using CapaDatos.Models;
using System.Web.Routing;

namespace AxProductividad.Controllers
{
    public class ChatController : Controller
    {     
        public ActionResult Index()
        {

            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }


            return View();
        }

     

    }
}