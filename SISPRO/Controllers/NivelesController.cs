using AxProductividad.ClasesAuxiliares;
using CapaDatos;
using CapaDatos.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Web.Mvc;


namespace AxProductividad.Controllers
{
    public class NivelesController : Controller
    {
        // GET: Niveles
        public ActionResult Index()
        {
            ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }
            Session["Controlador" + Session.SessionID] = "Niveles";


            if (!FuncionesGenerales.ValidaPermisos(0))
            {
                return RedirectToAction("Unauthorized", "ERROR");

            }
            return View();
        }

        public ActionResult ListaNiveles() {

            var resultado = new JObject();
            try
            {

                CD_Niveles cd_n = new CD_Niveles();
                List<NivelesModel> LstNiveles = new List<NivelesModel>();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                LstNiveles = cd_n.ConsultaLista(Conexion);

                resultado["Exito"] = true;
                resultado["LstNiveles"] = JsonConvert.SerializeObject(LstNiveles);
            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
            }

            return Content(resultado.ToString());

        }

        public ActionResult GuardarNivel(NivelesModel Nivel) {

            var resultado = new JObject();
            try
            {

                if (Nivel.IdNivel == 0)
                {
                    if (!FuncionesGenerales.ValidaPermisos(1))
                    {
                        resultado["Exito"] = false;
                        resultado["Advertencia"] = true;
                        resultado["Mensaje"] = Mensajes.MensajePermisoGuardar();
                        return Content(resultado.ToString());
                    }
                }
                else
                {
                    if (!FuncionesGenerales.ValidaPermisos(2))
                    {
                        resultado["Exito"] = false;
                        resultado["Advertencia"] = true;
                        resultado["Mensaje"] = Mensajes.MensajePermisoEditar();
                        return Content(resultado.ToString());
                    }
                }

                CD_Niveles cd_n = new CD_Niveles();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                int Exito = cd_n.AltaEdicionNivel(Nivel, Conexion);

                resultado["Exito"] = Exito == 1 ? true : false; ;
                resultado["Mensaje"] = Exito == 1 ? Mensajes.MensajeGuardadoExito() : "Ya existe un nivel con el mismo nombre";

            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
            }
            return Content(resultado.ToString());

        }

        public ActionResult ConsultaHorasMes(NivelesHorasModel Nivel)
        {
            var resultado = new JObject();
            try
            {
                CD_Niveles cd_n = new CD_Niveles();
                NivelesHorasModel nivel = new NivelesHorasModel();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                nivel = cd_n.ConsultaHorasMes(Nivel, Conexion);

                resultado["Exito"] = true;
                resultado["NivelHoras"] = JsonConvert.SerializeObject(nivel);
            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
            }

            return Content(resultado.ToString());
        }

        public ActionResult GuardarNivelHoras(NivelesHorasModel Nivel)
        {

            var resultado = new JObject();
            try
            {

                if (Nivel.IdNivelHoras == 0)
                {
                    if (!FuncionesGenerales.ValidaPermisos(1))
                    {
                        resultado["Exito"] = false;
                        resultado["Advertencia"] = true;
                        resultado["Mensaje"] = Mensajes.MensajePermisoGuardar();
                        return Content(resultado.ToString());
                    }
                }
                else
                {
                    if (!FuncionesGenerales.ValidaPermisos(2))
                    {
                        resultado["Exito"] = false;
                        resultado["Advertencia"] = true;
                        resultado["Mensaje"] = Mensajes.MensajePermisoEditar();
                        return Content(resultado.ToString());
                    }
                }

                CD_Niveles cd_n = new CD_Niveles();

                var s = (Models.Sesion)Session["Usuario" + Session.SessionID];

                string Conexion = Encripta.DesencriptaDatos(s.Usuario.ConexionEF);
                Nivel.IdUCreo = s.Usuario.IdUsuario;
                bool Exito = cd_n.GuardaHorasMes(Nivel, Conexion);


            

                resultado["Exito"] = Exito;
                resultado["Mensaje"] = Exito ? Mensajes.MensajeGuardadoExito() : "Ocurrio un error al guardar la información.";

            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
            }
            return Content(resultado.ToString());

        }



    }
}