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
    public class CatalogoGeneralController : Controller
    {
        // GET: CatalogoGeneral
        public ActionResult Index()
        {
            ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }
            Session["Controlador" + Session.SessionID] = "CatalogoGeneral";



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
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                CD_CatalogoGeneral cd_Cat = new CD_CatalogoGeneral();

                List<CatalogoGeneralModel> lstCabeceras = cd_Cat.ObtenerCabeceras(Conexion);
                resultado["Exito"] = true;
                resultado["CmbCabeceras"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(lstCabeceras);
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
        public ActionResult ConsultarCatalogos(int idTabla)
        {
            var resultado = new JObject();
            try
            {
                CD_CatalogoGeneral cd_Cat = new CD_CatalogoGeneral();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                List<CatalogoGeneralModel> lstCabeceras = cd_Cat.ObtenerCatalogoGeneral(idTabla, Conexion, null);
                resultado["Exito"] = true;
                resultado["LstCatalogos"] = JsonConvert.SerializeObject(lstCabeceras); 
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
        public ActionResult ConsultaCatalogo(int idTabla)
        {
            var resultado = new JObject();
            try
            {
                CD_CatalogoGeneral cd_Cat = new CD_CatalogoGeneral();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                List<CatalogoGeneralModel> LstCatalogo = cd_Cat.ObtenerCatalogoGeneral(idTabla, Conexion);

                resultado["Exito"] = true;
                resultado["LstCatalogo"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(LstCatalogo);
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
        public ActionResult GuardarDatosCatalogo(CatalogoGeneralModel datosCatalogo)
        {
            var resultado = new JObject();
            try
            {
                //if (datosCatalogo.IdCatalogo == 0)
                //{
                //    if (!FuncionesGenerales.ValidaPermisos(1))
                //    {
                //        resultado["Exito"] = false;
                //        resultado["Advertencia"] = true;
                //        resultado["Mensaje"] = Mensajes.MensajePermisoGuardar();
                //        return Content(resultado.ToString());
                //    }
                //}
                //else
                //{
                //    if (!FuncionesGenerales.ValidaPermisos(2))
                //    {
                //        resultado["Exito"] = false;
                //        resultado["Advertencia"] = true;
                //        resultado["Mensaje"] = Mensajes.MensajePermisoEditar();
                //        return Content(resultado.ToString());
                //    }
                //}


                CD_CatalogoGeneral cd_Cat = new CD_CatalogoGeneral();

                var idULogin = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.IdUsuario;
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                int respuesta = cd_Cat.GuardarCatalogo(datosCatalogo, idULogin,Conexion);

                if (respuesta == 1)
                {
                    resultado["Exito"] = false;
                    resultado["Advertencia"] = true;
                    resultado["Mensaje"] = "Ya se encuentra un registro con la misma descripción corta.";
                }
               else if (respuesta == 2)
                {
                    resultado["Exito"] = false;
                    resultado["Advertencia"] = true;
                    resultado["Mensaje"] = "Ya se encuentra un registro con la misma descripción larga.";
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
        public ActionResult ConsultarDatosCatalogo(long idCatalogo)
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
                CD_CatalogoGeneral cd_Cat = new CD_CatalogoGeneral();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                CatalogoGeneralModel respuesta = cd_Cat.ConsultarCatalogo(idCatalogo,Conexion);
                resultado["Exito"] = true;
                resultado["DatosCatalogo"] = JsonConvert.SerializeObject(respuesta);

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

        public ActionResult Categorias()
        {
            ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }
            Session["Controlador" + Session.SessionID] = "Categorias";



            if (!FuncionesGenerales.ValidaPermisosAccion(0))
            {
                return RedirectToAction("Unauthorized", "ERROR");

            }

            return View();
        }


        public ActionResult CargaInicialCat()
        {
            var resultado = new JObject();
            try
            {
                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }

                CD_CatalogoGeneral cd_Cat = new CD_CatalogoGeneral();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                List<CatalogoGeneralModel> lstCabeceras = cd_Cat.ObtenerCatalogoGeneral(2, Conexion, null);

                resultado["Exito"] = true;
                resultado["LstCatalogos"] = JsonConvert.SerializeObject(lstCabeceras);
                resultado["CmbCabeceras"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(lstCabeceras);

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

        public ActionResult CargarClasificacionActividad(long IdTipoActividad)
        {

            var resultado = new JObject();
            try
            {
                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }

                CD_CatalogoGeneral cd_CatGenral = new CD_CatalogoGeneral();

                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                List<CatalogoGeneralModel> LstClasificacion = cd_CatGenral.ObtenerClasificacionActividad(IdTipoActividad, Conexion);

                resultado["Exito"] = true;
                resultado["LstClasificacion"] = JsonConvert.SerializeObject(LstClasificacion);

                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
                return Content(resultado.ToString());
            }
        }

        public ActionResult Retroalimentacion()
        {
            ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }
            Session["Accion" + Session.SessionID] = "Retroalimentacion";



            if (!FuncionesGenerales.ValidaPermisosAccion(0))
            {
                return RedirectToAction("Unauthorized", "ERROR");

            }

            return View();
        }

        public ActionResult ConsultaPreguntas()
        {
            var resultado = new JObject();
            try
            {
                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }
                CD_CatalogoGeneral cd_Cat = new CD_CatalogoGeneral();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                List<PreguntaModel> lstCabeceras = cd_Cat.ObtienePreguntas(Conexion);

                resultado["Exito"] = true;
                resultado["LstCatalogos"] = JsonConvert.SerializeObject(lstCabeceras);
   

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

        public ActionResult ConsultaPreguntasRespuestas(long IdPregunta)
        {
            var resultado = new JObject();
            try
            {
                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }

                CD_CatalogoGeneral cd_Cat = new CD_CatalogoGeneral();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                List<PreguntaModel> lstCabeceras = cd_Cat.ObtienePreguntasRespuestas(IdPregunta,Conexion);

                resultado["Exito"] = true;
                resultado["LstCatalogos"] = JsonConvert.SerializeObject(lstCabeceras);


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

        public ActionResult GuardarPregunta(PreguntaModel Pregunta)
        {
            var resultado = new JObject();
            try
            {
                if (Pregunta.IdPregunta == 0)
                {
                    if (!FuncionesGenerales.ValidaPermisosAccion(1))
                    {
                        resultado["Exito"] = false;
                        resultado["Advertencia"] = true;
                        resultado["Mensaje"] = Mensajes.MensajePermisoGuardar();
                        return Content(resultado.ToString());
                    }
                }
                else
                {
                    if (!FuncionesGenerales.ValidaPermisosAccion(2))
                    {
                        resultado["Exito"] = false;
                        resultado["Advertencia"] = true;
                        resultado["Mensaje"] = Mensajes.MensajePermisoEditar();
                        return Content(resultado.ToString());
                    }
                }


                CD_CatalogoGeneral cd_Cat = new CD_CatalogoGeneral();

                Pregunta.IdUCreo = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.IdUsuario;
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                bool respuesta = cd_Cat.GuardarPregunta(Pregunta, Conexion);


                    resultado["Exito"] = true;
                    resultado["Mensaje"] = Mensajes.MensajeGuardadoExito();

        

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

    }
}