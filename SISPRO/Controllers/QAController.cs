using CapaDatos.Models;
using CapaDatos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Configuration;
using CapaDatos.DataBaseModel;
using System.Security.RightsManagement;
using DocumentFormat.OpenXml.Spreadsheet;
using System.Net.NetworkInformation;
using Rotativa;

namespace AxProductividad.Controllers
{
    public class QAController : Controller
    {

        public ActionResult Index()
        {
            Session["Controlador" + Session.SessionID] = "QA";

            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }

      
            if (!FuncionesGenerales.ValidaPermisos(0))
            {
                return RedirectToAction("Unauthorized", "ERROR");

            }

            var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

            CD_CatalogoGeneral cd_CatGenral = new CD_CatalogoGeneral();

            List<CatalogoGeneralModel> LstProyectos = cd_CatGenral.ObtenerProyectosPorUsuario(Usuario, Encripta.DesencriptaDatos(Usuario.ConexionEF));


            ViewBag.LstProyectos = LstProyectos;

            return View();
        }

        public ActionResult Runs()
        {

            ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
            Session["Accion" + Session.SessionID] = "Runs";

            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }

            if (!FuncionesGenerales.ValidaPermisosAccion(0))
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

        public ActionResult ConsultaBacklogQA(FiltrosModel Filtros)
        {
            var resultado = new JObject();
            try
            {
                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }
                List<ActividadesModel> LstBacklog = new List<ActividadesModel>();
                List<GraficaConsultaModel> LstGraf = new List<GraficaConsultaModel>();
                CD_Actividad cd_act = new CD_Actividad();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                cd_act.ConsultaBackLogQA( ref LstBacklog, ref LstGraf,  Filtros, Encripta.DesencriptaDatos(Usuario.ConexionSP));


                resultado["Exito"] = true;
                resultado["LstTC"] = JsonConvert.SerializeObject(LstBacklog);
                resultado["GraficaBL"] = JsonConvert.SerializeObject(LstGraf);
                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

                return Content(resultado.ToString());
            }
        }

        public ActionResult GuardarCicloPrueba(CicloPruebaModel CP)
        {
            var Resultado = new JObject();
            try
            {
                CD_Calidad cd_c = new CD_Calidad();
                //List<ProyectoIteracionModel> LstSprint = new List<ProyectoIteracionModel>();
                var IdUsuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.IdUsuario;
                CP.IdUCreo = IdUsuario;
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                int respuesta = cd_c.GuardarCicloPrueba(CP, Conexion);

                Resultado["Exito"] = respuesta == 1 ? true : false;
                Resultado["Mensaje"] = respuesta == 1 ? "Se guardo el ciclo de prueba de manera exitosa" : "Ya existe un ciclo de prueba con el mismo nombre dentro del proyecto";
                //Resultado["Sprints"] = Sprints;
                return Content(Resultado.ToString());


            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }


        }

        public ActionResult ConsultarCiclosPrueba(long IdProyecto, List<string> Estatus)
        {
            var Resultado = new JObject();
            try
            {

                CD_Calidad cd_c = new CD_Calidad();
                List<CicloPruebaModel> LstCP = new List<CicloPruebaModel>();


                List<ActividadesModel> LstBacklog = new List<ActividadesModel>();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);



                LstCP = cd_c.ConsultaCiclosPrueba(IdProyecto, Conexion).Where(w => Estatus.Contains(w.Estatus2)).ToList();




                Resultado["Exito"] = true;
                Resultado["Ciclos"] = JsonConvert.SerializeObject(LstCP);

                return Content(Resultado.ToString());

            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }
        }

        public ActionResult Run(int Id)
        {

            ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
            Session["Accion" + Session.SessionID] = "Run";

            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }


            if (!FuncionesGenerales.ValidaPermisosAccion(0))
            {
                return RedirectToAction("Unauthorized", "ERROR");
            }

            ViewBag.IdCicloP = Id;

            return View();

        }

        public ActionResult ConsultaCicloReport(int IdCicloP, List<string> Estatus)
        {
            var Resultado = new JObject();
            try
            {

                List<GraficaConsultaModel> LstGraf = new List<GraficaConsultaModel>();
                CD_Calidad cd_c = new CD_Calidad();
                CicloPruebaModel CP = new CicloPruebaModel();

                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);

                var estatus = string.Join<string>(",", Estatus.ConvertAll(s => s.ToString()));

                CP = cd_c.CicloPruebaReport(IdCicloP, estatus,  conexion);

                LstGraf.Add(CP.grEstatus);
                LstGraf.Add(CP.grEstatusBugs);

                Resultado["CicloPrueba"] = JsonConvert.SerializeObject(CP);
                Resultado["GraficaCP"] = JsonConvert.SerializeObject(LstGraf);

                ViewBag.Title = CP.Nombre;
                return Content(Resultado.ToString());
            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }


        }

        public ActionResult AsignacionCasosPruebaMasiva(string Actividades, long IdCicloP)
        {

            var resultado = new JObject();
            try
            {
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;


                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);

                CD_Calidad cd_c = new CD_Calidad();
                bool Exito = cd_c.AsignacionCasosPruebaMasiva(Actividades, IdCicloP, Usuario.IdUsuario, conexion);


                resultado["Exito"] = true;
                resultado["Mensaje"] = "Se realizó la asignación exitosamente.";

                return Content(resultado.ToString());


            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

                return Content(resultado.ToString());
            }
        }

        public ActionResult AsignaCasoPrueba(CasoPruebaModel CP)
        {

            var resultado = new JObject();
            try
            {
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;


                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                CD_Calidad cd_c = new CD_Calidad();
                bool Exito = cd_c.AsignaCasoPrueba(CP, Usuario.IdUsuario, conexion);


                resultado["Exito"] = true;
                resultado["Mensaje"] = "Se realizó la asignación exitosamente.";

                return Content(resultado.ToString());


            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

                return Content(resultado.ToString());
            }


        }
        public ActionResult AsignaCasoPruebaUsuarioMasiva(CasoPruebaModel CP, List<long> Lst)
        {

            var resultado = new JObject();
            try
            {
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;


                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                CD_Calidad cd_c = new CD_Calidad();
                bool Exito = cd_c.AsignaCasoPruebaMasivaUsuario(CP,Lst, Usuario.IdUsuario, conexion);


                resultado["Exito"] = true;
                resultado["Mensaje"] = "Se realizó la asignación exitosamente.";

                return Content(resultado.ToString());


            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

                return Content(resultado.ToString());
            }


        }

        public ActionResult ConsultaEjecucionCaso(long IdCicloCaso)
        {

            var resultado = new JObject();
            try
            {
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;


                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                CasoPruebaModel CP = new CasoPruebaModel();
                CD_Proyecto cd_proy = new CD_Proyecto();

                CD_Calidad cd_c = new CD_Calidad();
                CP = cd_c.ConsultaEjecucionCaso(IdCicloCaso, conexion);

                List<CatalogoGeneralModel> LstUsuarios = cd_proy.ConsultaUsuariosProyectoCombo(CP.IdProyecto, conexion);

                resultado["Exito"] = true;
                resultado["LstUsuarios"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlImagen(LstUsuarios, "");
                resultado["DatosE"] = JsonConvert.SerializeObject(CP);

                return Content(resultado.ToString());


            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

                return Content(resultado.ToString());
            }


        }

        public ActionResult GuardarResultadoCasoCiclo(CasoPruebaModel CP)
        {
            var Resultado = new JObject();
            try
            {
                CD_Calidad cd_c = new CD_Calidad();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                bool respuesta = cd_c.GuardarResultadoCasoCiclo(CP, Conexion);

                Resultado["Exito"] = respuesta ? true : false;
                Resultado["Mensaje"] = respuesta ? "" : "Error al guardar el resultado de la prueba";

                return Content(Resultado.ToString());
            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }


        }

        public ActionResult CambiaEstatusCP(int IdCicloP, string Estatus)
        {
            var Resultado = new JObject();
            try
            {




                CD_Calidad cd_c = new CD_Calidad();


                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);


                bool Exito = cd_c.CambiaEstatusCP(IdCicloP, Estatus, conexion);

                Resultado["Exito"] = Exito;
                Resultado["Mensaje"] = "";


                return Content(Resultado.ToString());


            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }


        }

        public ActionResult EliminarACP(long IdCicloCaso)
        {

            var Resultado = new JObject();
            try
            {
                //Session["Accion" + Session.SessionID] = "FlujoPagos";
                //if (!FuncionesGenerales.SesionActiva())
                //{
                //    return RedirectToAction("Index", "Login");
                //}


                //if (!FuncionesGenerales.ValidaPermisosAccion(4))
                //{
                //    Resultado["Exito"] = false;
                //    Resultado["Mensaje"] = "Los tiene permisos para eliminar.";
                //    return Content(Resultado.ToString());

                //}


             
                CD_Calidad cd_c = new CD_Calidad();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                int r = cd_c.EliminarCicloCaso(IdCicloCaso, Encripta.DesencriptaDatos(Usuario.ConexionEF));

                Resultado["Exito"] = r== 1 ? true : false;
                Resultado["Mensaje"] = r== 1 ? "Se eliminó el caso de prueba de este ciclo.": "Solo se puede eliminar casos de prueba sin ejecutar.";



                return Content(Resultado.ToString());

            }
            catch (Exception ex)
            {
                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }


        }


        public ActionResult LeerBugsCP(long IdProyecto)
        {
            try
            {

                CD_Calidad cd_d = new CD_Calidad();
                List<ActividadesModel> LstBugs = new List<ActividadesModel>();
                List<GraficaConsultaModel> LstGraficas = new List<GraficaConsultaModel>();

                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                cd_d.LeerBugsCP(ref LstBugs, ref LstGraficas, IdProyecto, Encripta.DesencriptaDatos(Usuario.ConexionSP));
                 
                return new JsonResult
                {
                    Data = new
                    {
                        Exito = true,
                        LstBugs = LstBugs,
                        GraficaBugs = LstGraficas
                    },
                    MaxJsonLength = int.MaxValue
                };
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }


        }


        public ActionResult LeerBugsCicloReport(int IdCicloP, List<string> Estatus)
        {
            try
            {

                CD_Calidad cd_d = new CD_Calidad();
                List<ActividadesModel> LstBugs = new List<ActividadesModel>();
                List<GraficaConsultaModel> LstGraficas = new List<GraficaConsultaModel>();

                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                var estatus = string.Join<string>(",", Estatus.ConvertAll(s => s.ToString()));
                LstBugs =  cd_d.LeerBugsCicloReport(IdCicloP, estatus, Encripta.DesencriptaDatos(Usuario.ConexionSP));

                return new JsonResult
                {
                    Data = new
                    {
                        Exito = true,
                        LstBugs = LstBugs,
                    },
                    MaxJsonLength = int.MaxValue
                };
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }


        }

        public ActionResult RunReport(int Id)
        {

            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }

            var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
            CD_Calidad cd_c = new CD_Calidad();
            CicloPruebaModel cp = new CicloPruebaModel();
            cp = cd_c.CicloPruebaReport_Imprimir(Id, Encripta.DesencriptaDatos(Usuario.ConexionSP));


            var pdf = new ViewAsPdf("RunReport", cp)
            {
                FileName = cp.ClaveProy + "_ReportePruebas-" + cp.Nombre + ".pdf",
                PageOrientation = Rotativa.Options.Orientation.Portrait,
                PageSize = Rotativa.Options.Size.A4,
                //PageMargins = new Rotativa.Options.Margins(10, 10, 10, 10)
            };

            return pdf;

            //return View(cp);
        }

        public ActionResult ConsultaEjecucionesCP(long IdCasoP)
        {
            var Resultado = new JObject();
            try
            {

                List<CasoPruebaModel> Lst = new List<CasoPruebaModel>();
                CD_Calidad cd_c = new CD_Calidad();
                CicloPruebaModel CP = new CicloPruebaModel();

                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);

                Lst = cd_c.ConsultaEjecucionesCP(IdCasoP, conexion);

                Resultado["Exito"] = true;
                Resultado["Lst"] = JsonConvert.SerializeObject(Lst);

       
                return Content(Resultado.ToString());
            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }


        }

    }

}
