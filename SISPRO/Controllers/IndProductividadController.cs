using AxProductividad.ClasesAuxiliares;
using CapaDatos;
using CapaDatos.Models;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Web.Mvc;
using Newtonsoft.Json;



namespace AxProductividad.Controllers
{
    public class IndProductividadController : Controller
    {
        // GET: Graficas


        public ActionResult Index()
        {
            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }
            Session["Controlador" + Session.SessionID] = "IndProductividad";

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


                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                CD_CatalogoGeneral cd_CatGenral = new CD_CatalogoGeneral();
                CD_Graficas cd_gr = new CD_Graficas();

                List<CatalogoGeneralModel> LstUsuarios = cd_CatGenral.ObtenerUsuarios(Usuario.IdUsuario, Conexion);
                List<CatalogoGeneralModel> LstGraficas = cd_gr.ListadoGraficas(Conexion);

                resultado["Exito"] = true;
                resultado["TipoUsuario"] = Usuario.IdTipoUsuario;
                resultado["Usuario"] = Usuario.IdUsuario;
                resultado["LstUsuarios"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlComboxMultiple(LstUsuarios);
                resultado["LstGraficas"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlComboxMultiple(LstGraficas);
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
        public ActionResult FiltrarGraficas(FiltrosModel filtroGraficas)
        {
            var resultado = new JObject();
            try
            {
                //if (!FuncionesGenerales.ValidaPermisos(4))
                //{
                //    resultado["Exito"] = false;
                //    resultado["Advertencia"] = true;
                //    resultado["Mensaje"] = Mensajes.MensajePermisoImprimir();
                //    return Content(resultado.ToString());
                //}

                var idULogin = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.IdUsuario;
                //string conexion = ConfigurationManager.ConnectionStrings["BDProductividad"].ToString();
                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
                var cd_Graf = new CD_Graficas();
                List<GraficaConsultaModel> LstGraficas = new List<GraficaConsultaModel>();
                var resultadoConsultar = cd_Graf.ConsultarGraficas(filtroGraficas, conexion, ref LstGraficas);


                if (resultadoConsultar == 1)
                {
                    resultado["Exito"] = false;
                    resultado["Advertencia"] = true;
                    resultado["Mensaje"] = "Error, ingrese números o rango válido de número de orden de compra.";
                    return Content(resultado.ToString());
                }
                if (resultadoConsultar == 2)
                {
                    resultado["Exito"] = false;
                    resultado["Advertencia"] = true;
                    resultado["Mensaje"] = "Error, ingrese números o rango válido de número de requisición.";
                    return Content(resultado.ToString());
                }
                if (resultadoConsultar == 3)
                {
                    resultado["Exito"] = false;
                    resultado["Advertencia"] = true;
                    resultado["Mensaje"] = "Error, ingrese números o rango válido de costo total.";
                    return Content(resultado.ToString());
                }
                if (resultadoConsultar == 4)
                {
                    resultado["Exito"] = false;
                    resultado["Advertencia"] = true;
                    resultado["Mensaje"] = "Error, ingrese números o rango válido de AFE.";
                    return Content(resultado.ToString());
                }

                resultado["Exito"] = true;
                resultado["Mensaje"] = "Consulta exitosa";
                resultado["Graficas"] = JsonConvert.SerializeObject(LstGraficas);
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