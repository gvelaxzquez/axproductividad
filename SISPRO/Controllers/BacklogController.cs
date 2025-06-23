using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using CapaDatos;
using AxProductividad.ClasesAuxiliares;
using CapaDatos.Models;
using System.IO;
using System.Configuration;
using OfficeOpenXml;
using System.Web.Routing;
using System.Threading.Tasks;
using CapaDatos.DataBaseModel;
using DocumentFormat.OpenXml.Spreadsheet;

namespace AxProductividad.Controllers
{
    public class BacklogController : Controller
    {
        public ActionResult Index()
        {

            Session["Controlador" + Session.SessionID] = "Backlog";

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

        public ActionResult ConsultaBacklog(FiltrosModel Filtros)
        {
            var resultado = new JObject();
            try
            {
                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }
                List<ActividadesModel> LstBacklog2 = new List<ActividadesModel>();
                CD_Actividad cd_act = new CD_Actividad();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                var wi = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).WorkItems.Where(w => w.ActividadTipoId == Filtros.Tipo).FirstOrDefault();

                LstBacklog2 = cd_act.ConsultaBackLogv2(Filtros, Encripta.DesencriptaDatos(Usuario.ConexionSP));
                List<GanttModel> Gantt = FuncionesGenerales.ConvierteGantt_Backlog(LstBacklog2);
                int? last = LstBacklog2.Where(w=> w.TipoId == Filtros.Tipo).ToList().Count > 0 ? LstBacklog2.Where(w => w.TipoId == Filtros.Tipo).OrderByDescending(o => o.Prioridad).FirstOrDefault().Prioridad : 0;

                 
                resultado["Exito"] = true;
                resultado["Jerarquia"] = wi.Jerarquia;
                resultado["Last"] = last == null ?  0 : last;
                resultado["LstBacklog2"] = JsonConvert.SerializeObject(LstBacklog2);
                resultado["Gantt"] = JsonConvert.SerializeObject(Gantt);
                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

                return Content(resultado.ToString());
            }
        }
        public ActionResult ConsultaBackLogRelacionados(FiltrosModel Filtros)
        {
            var resultado = new JObject();
            try
            {
                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }

                List<ActividadesModel> LstBacklog = new List<ActividadesModel>();
                CD_Actividad cd_act = new CD_Actividad();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                LstBacklog = cd_act.ConsultaBackLog_Relacionados(Filtros, Encripta.DesencriptaDatos(Usuario.ConexionSP));

                resultado["Exito"] = true;
                resultado["LstBacklog"] = JsonConvert.SerializeObject(LstBacklog);

                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

                return Content(resultado.ToString());
            }


        }


        public ActionResult ConsultaBacklogWS(long IdWorkSpaceTab, FiltrosModel Filtros)
        {
            var resultado = new JObject();
            try
            {
                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }
                List<ActividadesModel> LstBacklog = new List<ActividadesModel>();
                CD_Actividad cd_act = new CD_Actividad();
                CD_Workspace cd_ws = new CD_Workspace();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                var wi = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).WorkItems.Where(w => w.ActividadTipoId == Filtros.Tipo).FirstOrDefault();

                LstBacklog = cd_act.ConsultaBackLogv2(Filtros, Encripta.DesencriptaDatos(Usuario.ConexionSP));

                string filters = JsonConvert.SerializeObject(Filtros);
                bool Exito = cd_ws.GuardaFiltrosTab(IdWorkSpaceTab, filters, Encripta.DesencriptaDatos(Usuario.ConexionEF));


                resultado["Exito"] = true;
                resultado["Backlog"] = JsonConvert.SerializeObject(LstBacklog);
                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

                return Content(resultado.ToString());
            }
        }


        public ActionResult ConsultaGraficasBacklog(long IdProyecto )
        {
            var resultado = new JObject();
            try
            {
                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }
                List<GraficaConsultaModel> LstGraficas = new List<GraficaConsultaModel>();
                CD_Actividad cd_act = new CD_Actividad();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
        
                LstGraficas = cd_act.ConsultarGraficasBacklog(IdProyecto, Encripta.DesencriptaDatos(Usuario.ConexionSP));
          
                resultado["Exito"] = true;
                resultado["LstGraficas"] = JsonConvert.SerializeObject(LstGraficas);
                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

                return Content(resultado.ToString());
            }
        }

        public ActionResult MoverOrdenBL (long IdActividad, string IdProyecto, int TipoId , int TipoMov)
        {
            var resultado = new JObject();
            try
            {
                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }
                CD_Actividad cd_act = new CD_Actividad();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                bool i = cd_act.MoverOrdenBL(IdActividad,long.Parse(IdProyecto), TipoId, TipoMov, Encripta.DesencriptaDatos(Usuario.ConexionEF));

                resultado["Exito"] = true;
                return Content(resultado.ToString());


            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

                return Content(resultado.ToString());
            }


        }


        public ActionResult ConsultaMatrizRastreo(long IdProyecto)
        {
            var resultado = new JObject();
            try
            {
                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }
                List<ActividadesModel> LstHus = new List<ActividadesModel>();
                List<ActividadesModel> LstDetalles = new List<ActividadesModel>();
                CD_Actividad cd_act = new CD_Actividad();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                cd_act.ConsultaMatrizRastreo(ref LstHus, ref LstDetalles, IdProyecto, Encripta.DesencriptaDatos(Usuario.ConexionSP));

                resultado["Exito"] = true;
                resultado["LstHUS"] = JsonConvert.SerializeObject(LstHus);
                resultado["LstDetalles"] = JsonConvert.SerializeObject(LstDetalles);
                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

                return Content(resultado.ToString());
            }
        }

        public ActionResult ConsultaMatrizRastreo2(MatrizModel Filtros)
        {
            var resultado = new JObject();
            try
            {
                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }
             
                CD_Actividad cd_act = new CD_Actividad();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                List<MatrizModel> Lst = new   List<MatrizModel>();
                int count = 0;
                Lst =  cd_act.ConsultaMatrizRastreo2(ref count, Filtros, Encripta.DesencriptaDatos(Usuario.ConexionSP));

                resultado["Exito"] = true;
                resultado["LstMatriz"] = JsonConvert.SerializeObject(Lst);
                resultado["Count"] = count;
                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

                return Content(resultado.ToString());
            }
        }

        public ActionResult CargaFiltrosMatriz(long IdProyecto)
        {

            var resultado = new JObject();
            try
            {

                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }

                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                CD_CatalogoGeneral cd_CatGenral = new CD_CatalogoGeneral();

                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                List<CatalogoGeneralModel> LstEpicas = cd_CatGenral.ObtenerActividadPorTipo(IdProyecto, 2,  Conexion);
                List<CatalogoGeneralModel> LstHUS = cd_CatGenral.ObtenerActividadPorTipo(IdProyecto, 4, Conexion);
                List<CatalogoGeneralModel> LstSprints = cd_CatGenral.ObtenerSprintsProyecto(IdProyecto, Conexion);


                resultado["Exito"] = true;
                resultado["TipoUsuario"] = Usuario.IdTipoUsuario;
                resultado["Usuario"] = Usuario.IdUsuario;
                resultado["LstEpicas"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlComboxMultiple(LstEpicas);
                resultado["LstHUS"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlComboxMultiple(LstHUS);
                resultado["LstSprints"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlComboxMultiple(LstSprints);
       


                return Content(resultado.ToString());
            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
                return Content(resultado.ToString());
            }
        }

        public ActionResult ActualizaOrdenBacklog(List<ActividadesModel> LstUpdates) {
            var resultado = new JObject();
            try
            {
                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }

                CD_Actividad cd_a = new CD_Actividad();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                bool Exito = cd_a.ActualizaOrdenBacklog(LstUpdates, Encripta.DesencriptaDatos(Usuario.ConexionEF));


                resultado["Exito"] = true;
                return Content(resultado.ToString());
            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
                return Content(resultado.ToString());
            }
        
        }

        public ActionResult ActualizaRelacionesBacklog(long? IdRelOrigen, long? IdRelDestino, long IdActividad)
        {
            var resultado = new JObject();
            try
            {
                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }

                CD_Actividad cd_a = new CD_Actividad();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                bool Exito = cd_a.ActualizaRelacionesBL(IdRelOrigen,  IdRelDestino, IdActividad, Encripta.DesencriptaDatos(Usuario.ConexionEF));


                resultado["Exito"] = true;
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