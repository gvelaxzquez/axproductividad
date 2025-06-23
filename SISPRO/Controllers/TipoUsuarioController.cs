using System;
using System.Collections.Generic;
using System.Web.Mvc;
using System.Configuration;
using AxProductividad.ClasesAuxiliares;
using Newtonsoft.Json.Linq;
using CapaDatos.Models;
using CapaDatos;
using Newtonsoft.Json;
 
namespace AxProductividad.Controllers
{
    public class TipoUsuarioController : Controller
    {
        // GET: TipoUsuario
        public ActionResult Index()
        {
            ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }
            Session["Controlador" + Session.SessionID] = "TipoUsuario";

            if (!FuncionesGenerales.ValidaPermisos(0))
            {
                return RedirectToAction("Unauthorized", "ERROR");

            }



            return View();
        }

        [HttpPost]
        public ActionResult CargaInicial()
        {
            var resultado = new JObject();
            try
            {
                CD_TipoUsuario cd_TiposUsuario = new CD_TipoUsuario();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                List<TipoUsuarioModel> lstTiposUsuario = cd_TiposUsuario.ObtenerTiposUsuario(Conexion);
                resultado["Exito"] = true;
                resultado["LstTiposUsuario"] = JsonConvert.SerializeObject(lstTiposUsuario);
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
        public ActionResult GuardarDatos(TipoUsuarioModel datosUsuario)
        {
            var resultado = new JObject();
            try
            {
                if (datosUsuario.IdTipoUsuario == 0)
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


                CD_TipoUsuario cd_TipoU = new CD_TipoUsuario();
                datosUsuario.IdULogin = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.IdUsuario;
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                int respuesta = cd_TipoU.GuardarDatos(datosUsuario, Conexion);

                if (respuesta == 1)
                {
                    resultado["Exito"] = false;
                    resultado["Advertencia"] = true;
                    resultado["Mensaje"] = "El nombre del tipo de usuario se encuentra repetido.";
                }
                else
                {
                    resultado["Exito"] = true;
                    resultado["Mensaje"] = Mensajes.MensajeGuardadoExito();
                }

                return Content(resultado.ToString());


            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Advertencia"] = false;
                resultado["Mensaje"] = ex.Message;
                return Content(resultado.ToString());
            }
        }
        [HttpPost]
        public ActionResult ConsultarDatosTipoUsuario(int idTipoUsuario)
        {
            var resultado = new JObject();
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(2))
                {
                    resultado["Exito"] = false;
                    resultado["Advertencia"] = true;
                    resultado["Mensaje"] = Mensajes.MensajePermisoEditar();
                    return Content(resultado.ToString());
                }

                CD_TipoUsuario cd_TipoU = new CD_TipoUsuario();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                TipoUsuarioModel datosTipoUsuario = cd_TipoU.ConsultarTipoUsuario(idTipoUsuario, Conexion);


                int idTipoUSesion = ((Models.Sesion)Session["Usuario" + Session.SessionID]).Usuario.IdTipoUsuario;

                //Protegido
                if (datosTipoUsuario.Protegido == true && idTipoUSesion!= 1)
                {
                    resultado["Exito"] = false;
                    resultado["Advertencia"] = true;
                    resultado["Mensaje"] = Mensajes.MensajeRegistroProtegido();
                    return Content(resultado.ToString());
                }

                resultado["Exito"] = true;
                resultado["Advertencia"] = false;
                resultado["DatosTipoUsuario"] = JsonConvert.SerializeObject(datosTipoUsuario);

                return Content(resultado.ToString());


            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Aveertencia"] = false;
                resultado["Mensaje"] = ex.Message;
                return Content(resultado.ToString());
            }
        }

        [HttpPost]
        public ActionResult ConsultarPermisos(int idTipoUsuario)
        {
            var resultado = new JObject();
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(2))
                {
                    resultado["Exito"] = false;
                    resultado["Advertencia"] = true;
                    resultado["Mensaje"] = Mensajes.MensajePermisoEditar();
                    return Content(resultado.ToString());
                }

                CD_TipoUsuario cd_TipoU = new CD_TipoUsuario();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                List<TipoUsuarioPermisosModel> lstPermisosTU = cd_TipoU.ConsultarPermisos(idTipoUsuario, Conexion);
                resultado["Exito"] = true;
                resultado["LstPermisos"] = JsonConvert.SerializeObject(lstPermisosTU);

                return Content(resultado.ToString());


            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Aveertencia"] = false;
                resultado["Mensaje"] = ex.Message;
                return Content(resultado.ToString());
            }
        }

        [HttpPost]
        public ActionResult GuardarPermisos(List<TipoUsuarioPermisosModel> lstPermisos)
        {
            var resultado = new JObject();
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(2))
                {
                    resultado["Exito"] = false;
                    resultado["Advertencia"] = true;
                    resultado["Mensaje"] = Mensajes.MensajePermisoEditar();
                    return Content(resultado.ToString());
                }

                CD_TipoUsuario cd_TipoU = new CD_TipoUsuario();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
                string ConexionEF = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                //string Conexion = ConfigurationManager.ConnectionStrings["BDProductividad"].ToString();

                bool lstPermisosTU = cd_TipoU.GuardarPermisos(lstPermisos, Conexion, ConexionEF);

                resultado["Exito"] = true;
                resultado["Mensaje"] = Mensajes.MensajeGuardadoExito();

                return Content(resultado.ToString());


            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Aveertencia"] = false;
                resultado["Mensaje"] = ex.Message;
                return Content(resultado.ToString());
            }
        }

    }
}