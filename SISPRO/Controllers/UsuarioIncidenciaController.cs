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
    public class UsuarioIncidenciaController : Controller
    {
        // GET: UsuarioIncidencia
        public ActionResult Index()
        {
            ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
            Session["Controlador" + Session.SessionID] = "UsuarioIncidencia";
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

        public ActionResult ConsultaIncidencias() {

            var resultado = new JObject();
            try
            {

                CD_Usuario cd_user = new CD_Usuario();
                CD_CatalogoGeneral cd_CatGenral = new CD_CatalogoGeneral();
                List <UsuarioIncidenciasModel> LstIncidencias = new List<UsuarioIncidenciasModel>();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                LstIncidencias = cd_user.ConsultaIncidencias(Conexion);
                List<CatalogoGeneralModel> LstUsuarios = cd_CatGenral.ObtenerUsuarios(Usuario.IdUsuario, Conexion);
                List<CatalogoGeneralModel> LstTipoIncidencias = cd_CatGenral.ObtenerCatalogoGeneral(6, Conexion);



                resultado["Exito"] = true;
                resultado["Incidencias"] = JsonConvert.SerializeObject(LstIncidencias);
                resultado["LstRecursos"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(LstUsuarios);
                resultado["LstTipoIncidencias"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(LstTipoIncidencias);


                return Content(resultado.ToString());

            }
            catch (Exception)
            {


                resultado["Exito"] = false;
                resultado["Mensaje"] = "Error al consultar las incidencias.";

                return Content(resultado.ToString());

            }

        }

        public ActionResult GuardarIncidencia(UsuarioIncidenciasModel Incidencia) {

            var resultado = new JObject();
            try
            {

                if (Incidencia.IdIncidencia == 0)
                {
                    if (!FuncionesGenerales.ValidaPermisos(1))
                    {
                        resultado["Exito"] = false;
                        resultado["Mensaje"] = Mensajes.MensajePermisoGuardar();
                        return Content(resultado.ToString());
                    }
                }
                else
                {
                    if (!FuncionesGenerales.ValidaPermisos(2))
                    {
                        resultado["Exito"] = false;
                        resultado["Mensaje"] = Mensajes.MensajePermisoEditar();
                        return Content(resultado.ToString());
                    }
                }


                CD_Usuario cd_user = new CD_Usuario();
                var idULogin = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.IdUsuario;
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                bool Exito = cd_user.GuardarIncidencia(Incidencia, idULogin, Conexion);

                resultado["Exito"] = true;
                resultado["Mensaje"] = Mensajes.MensajeGuardadoExito();

                return Content(resultado.ToString());
            }
            catch (Exception)
            {


                resultado["Exito"] = false;
                resultado["Mensaje"] = "Error al guardar la incidencia.";

                return Content(resultado.ToString());
            }

        }

        public ActionResult EliminarIncidencia(long IdIncidencia) {
            var resultado = new JObject();
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(4))
                {
                    resultado["Exito"] = false;
                    resultado["Mensaje"] = Mensajes.MensajePermisoEliminar();
                    return Content(resultado.ToString());
                }


                CD_Usuario cd_user = new CD_Usuario();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                bool Exito = cd_user.EliminarIncidencia(IdIncidencia, Conexion);


                resultado["Exito"] = true;
                resultado["Mensaje"] = Mensajes.MensajeEliminadoExito();

                return Content(resultado.ToString());


            }
            catch (Exception)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = "Error al eliminar la incidencia.";

                return Content(resultado.ToString());
            }

        }

    }
}