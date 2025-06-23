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
using System.Text.RegularExpressions;
using Microsoft.AspNet.Identity;
using CapaDatos.Models.Constants;
using Antlr.Runtime.Misc;
using Rotativa;
using DocumentFormat.OpenXml.Bibliography;

namespace AxProductividad.Controllers
{
    public class ActividadesController : BaseController
    {
        private CD_Actividad cd_Actividad;

        protected override void Initialize(RequestContext requestContext)
        {
            base.Initialize(requestContext);

            cd_Actividad = new CD_Actividad();
        }

        // GET: Actividades
        public ActionResult Index()
        {
            ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
            Session["Controlador" + Session.SessionID] = "Actividades";

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

        public ActionResult WorkItem(long Id)
        {

            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }
            CD_Actividad cd_act = new CD_Actividad();
            var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
            ActividadesModel actividad = new ActividadesModel();
            actividad = cd_act.ConsultaActividad(Id, Usuario.IdUsuario, Encripta.DesencriptaDatos(Usuario.ConexionSP));
            var workitem = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).WorkItems.Where(w => w.ActividadTipoId == actividad.TipoId).FirstOrDefault();

            actividad.TipoActividadStr = workitem.Nombre;

            var pdf = new ViewAsPdf("WorkItem", actividad)
            {
                FileName =  actividad.TipoActividadStr +   "_" + actividad.IdActividadStr+ ".pdf",
                PageOrientation = Rotativa.Options.Orientation.Portrait,
                PageSize = Rotativa.Options.Size.A4,
                //PageMargins = new Rotativa.Options.Margins(10, 10, 10, 10)
            };

            return pdf;
        }

        public JsonResult GetTasks()
        {
            var tasks = new[]
            {
            new { id = "1", titulo = "Task 1", descripcion = "Descripción 1", fecha = "2024-11-01", tiempo = "1 hora", columna = "abiertas" },
            new { id = "2", titulo = "Task 2", descripcion = "Descripción 2", fecha = "2024-11-02", tiempo = "2 horas", columna = "progreso" },
            new { id = "3", titulo = "Task 3", descripcion = "Descripción 3", fecha = "2024-11-03", tiempo = "3 horas", columna = "validacion" }
        };

            return Json(tasks, JsonRequestBehavior.AllowGet);
        }


        //[Route("WorkItem2/{Id}/{Id2}")]
        public ActionResult WorkItem2(long Id, long Id2)
        {

            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }
            CD_Actividad cd_act = new CD_Actividad();
            var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
           List<ActividadesModel> actividades = new List<ActividadesModel> ();
            actividades = cd_act.ConsultaBackLogImprimir(Id, Id2, Encripta.DesencriptaDatos(Usuario.ConexionSP));
            var workitem = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).WorkItems.Where(w => w.ActividadTipoId == Id2).FirstOrDefault();

            var a = actividades.FirstOrDefault();



            var pdf = new ViewAsPdf("WorkItem2", actividades)
            {
                FileName =  a.ProyectoStr + "_" + workitem.Nombre + "'s.pdf",
                PageOrientation = Rotativa.Options.Orientation.Portrait,
                PageSize = Rotativa.Options.Size.A4,
                //PageMargins = new Rotativa.Options.Margins(10, 10, 10, 10)
            };

            return pdf;
        }

        public ActionResult ConsultaActividad(long Actividad)
        {
            var resultado = new JObject();
            try
            {

                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }

                CD_Actividad cd_act = new CD_Actividad();
                CD_Proyecto cd_proy = new CD_Proyecto();
                ActividadesModel actividad = new ActividadesModel();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                string Conexion = Encripta.DesencriptaDatos(Usuario.ConexionEF);
                string ConexionSp = Encripta.DesencriptaDatos(Usuario.ConexionSP);
                actividad = cd_act.ConsultaActividad(Actividad, Usuario.IdUsuario, ConexionSp);
                var workitem = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).WorkItems.Where(w => w.ActividadTipoId == actividad.TipoId).FirstOrDefault();
                string Comentarios = FuncionesGenerales.ConvierteListaComentarios(actividad.Comentarios.OrderByDescending(o => o.Fecha).ToList());
                string Log = FuncionesGenerales.ConvierteListaComentarios(actividad.ActividadLog);
                List<CatalogoGeneralModel> LstUsuarios = cd_proy.ConsultaUsuariosProyectoCombo(actividad.IdProyecto, Conexion);
                List<CatalogoGeneralModel> LstSprints = cd_proy.ComboSprintsProyecto(actividad.IdProyecto, Conexion);

                List<CatalogoGeneralModel> LstIssues = cd_proy.ConsultaIssuesCombo(actividad.IdProyecto, actividad.IdActividad, Conexion);

                var url = ConfigurationManager.AppSettings["UrlSistema"] + "Archivos/Documentos/" + actividad.IdActividad.ToString() + "/";

                if (Usuario.IdTipoUsuario == 19)
                {

                    ActividadLog actlog = new ActividadLog();
                    actlog.IdActividad = actividad.IdActividad;
                    actlog.Descripcion = "Visualizó actividad";
                    actlog.IdUCreo = Usuario.IdUsuario;
                    actlog.FechaHora = DateTime.Now;

                    cd_act.GuardaActividadLog(actlog, Conexion);

                }


                resultado["Exito"] = true;
                resultado["WorkItem"] = JsonConvert.SerializeObject(workitem);
                resultado["Actividad"] = JsonConvert.SerializeObject(actividad);
                resultado["Org"] = Usuario.IdOrganizacion;
                resultado["LstUsuarios"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlImagen(LstUsuarios, "");
                resultado["LstComentarios"] = Comentarios;
                resultado["LstRepositorios"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(actividad.ProyectoRepositorio);
                resultado["LstSprints"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(LstSprints);
                resultado["LstIssues"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(LstIssues);
                resultado["LstLog"] = Log;
                resultado["Url"] = url;

                return Content(resultado.ToString());
            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

                return Content(resultado.ToString());
            }
        }

        public ActionResult BuscarActividades(string Texto)
        {

            var Resultado = new JObject();
            try
            {
                CD_Actividad cd_act = new CD_Actividad();

                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                List<ActividadesModel> LstAct = new List<ActividadesModel>();
                string ConexionSP = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);

                LstAct = cd_act.SearchActividad(Texto, ConexionSP);

                Resultado["Exito"] = true;
                Resultado["LstActividades"] = JsonConvert.SerializeObject(LstAct);

                return Content(Resultado.ToString());
            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }

        }

        public ActionResult BuscarWorkitems(FiltrosModel Filtros)
        {

            var Resultado = new JObject();
            try
            {
                CD_Actividad cd_act = new CD_Actividad();

                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                List<ActividadesModel> LstAct = new List<ActividadesModel>();
                string ConexionSP = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);

                LstAct = cd_act.BuscarWorkitems(Filtros, ConexionSP);

                Resultado["Exito"] = true;
                Resultado["LstActividades"] = JsonConvert.SerializeObject(LstAct);

                return Content(Resultado.ToString());
            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }

        }

        public ActionResult BuscarWorkItems_Combos(long IdProyecto)
        {
            var resultado = new JObject();
            try
            {

                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                //var workitem = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).WorkItems.Where(w => w.ActividadTipoId != 2).FirstOrDefault();
                string Conexion = Encripta.DesencriptaDatos(Usuario.ConexionEF);
                CD_CatalogoGeneral cd_CatGenral = new CD_CatalogoGeneral();
                CD_Proyecto cd_proy = new CD_Proyecto();


                List<CatalogoGeneralModel> LstTipoAct = cd_CatGenral.ObtenerCatalogoGeneral(2, Conexion);
                List<CatalogoGeneralModel> LstUsuarios = cd_proy.ConsultaUsuariosProyectoCombo(IdProyecto, Conexion);
                List<CatalogoGeneralModel> LstSprints = cd_proy.ComboSprintsProyecto(IdProyecto, Conexion);
                List<CatalogoGeneralModel> LstPrioridad = cd_CatGenral.ObtenerCatalogoGeneral(20, Conexion);
                List<CatalogoGeneralModel> LstTipo = cd_CatGenral.ObtenerTipoActividad(Conexion);


                resultado["Exito"] = true;
                resultado["LstTipo"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlImagen2(LstTipo.Where(w => w.IdCatalogo != 2).ToList());
                resultado["LstTipoAct"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(LstTipoAct);
                resultado["LstPrioridades"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlComboxPrioridad(LstPrioridad);
                resultado["LstSprints"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(LstSprints);
                resultado["LstUsuarios"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlImagen(LstUsuarios, "");


                return Content(resultado.ToString());



            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
                return Content(resultado.ToString());
            }

        }

        public ActionResult BuscarActividadesOpcion2(string Texto, long IdProyecto, long IdActividad)
        {

            var Resultado = new JObject();
            try
            {
                CD_Actividad cd_act = new CD_Actividad();

                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                List<ActividadesModel> LstAct = new List<ActividadesModel>();
                string ConexionSP = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);

                LstAct = cd_act.SearchActividad_Opcion2(Texto, IdProyecto, IdActividad, ConexionSP);

                Resultado["Exito"] = true;
                Resultado["LstActividades"] = JsonConvert.SerializeObject(LstAct);

                return Content(Resultado.ToString());
            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }

        }

        public ActionResult BuscarWorkitems_PorTipo(FiltrosModel Filtros)
        {

            var Resultado = new JObject();
            try
            {
                CD_Actividad cd_act = new CD_Actividad();


                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                List<ActividadesModel> LstAct = new List<ActividadesModel>();
                string ConexionSP = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);

                LstAct = cd_act.ConsultaBackLog_PorTipo(Filtros, ConexionSP);

                Resultado["Exito"] = true;
                Resultado["LstActividades"] = JsonConvert.SerializeObject(LstAct);

                return Content(Resultado.ToString());
            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }

        }

        public ActionResult BuscarWorkitems_Relacionados(FiltrosModel Filtros)
        {

            var Resultado = new JObject();
            try
            {
                CD_Actividad cd_act = new CD_Actividad();

                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                List<ActividadesModel> LstAct = new List<ActividadesModel>();
                string ConexionSP = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);

                LstAct = cd_act.ConsultaBackLog_Relacionados(Filtros, ConexionSP);

                Resultado["Exito"] = true;
                Resultado["LstActividades"] = JsonConvert.SerializeObject(LstAct);

                return Content(Resultado.ToString());
            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }

        }

        public ActionResult BuscarWorkitems_RelacionadosQA(FiltrosModel Filtros)
        {

            var Resultado = new JObject();
            try
            {
                CD_Actividad cd_act = new CD_Actividad();

                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                List<ActividadesModel> LstAct = new List<ActividadesModel>();
                string ConexionSP = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);

                LstAct = cd_act.ConsultaBackLog_RelacionadosQA(Filtros, ConexionSP);

                Resultado["Exito"] = true;
                Resultado["LstActividades"] = JsonConvert.SerializeObject(LstAct);

                return Content(Resultado.ToString());
            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }

        }


        #region Cargas
        public ActionResult CargaCombosAct(int Tipo)
        {

            var resultado = new JObject();
            try
            {
                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                var workitem = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).WorkItems.Where(w => w.ActividadTipoId == Tipo).FirstOrDefault();
                string Conexion = Encripta.DesencriptaDatos(Usuario.ConexionEF);
                CD_CatalogoGeneral cd_CatGenral = new CD_CatalogoGeneral();

                List<CatalogoGeneralModel> LstProyectos = cd_CatGenral.ObtenerProyectosPorUsuario(Usuario, Conexion);
                List<CatalogoGeneralModel> LstTipoAct = cd_CatGenral.ObtenerCatalogoGeneral(2, Conexion);
                long idULider = cd_CatGenral.ObtenerLider(Usuario.IdUsuario, Conexion);
                List<CatalogoGeneralModel> LstUsuarios = cd_CatGenral.ObtenerUsuarios(idULider, Conexion);
                List<CatalogoGeneralModel> LstLideres = cd_CatGenral.ObtenerLideres(Usuario, Conexion);
                var ids = LstLideres.Select(x => x.IdCatalogo).ToList();
                LstLideres.AddRange(LstUsuarios.Where(x => !ids.Contains(x.IdCatalogo)));
                List<CatalogoGeneralModel> LstClasificacion = cd_CatGenral.ObtenerCatalogoGeneral(5, Conexion);
                List<CatalogoGeneralModel> LstPrioridad = cd_CatGenral.ObtenerCatalogoGeneral(20, Conexion);
                List<CatalogoGeneralModel> LstTipo = cd_CatGenral.ObtenerTipoActividad(Conexion);


                resultado["Exito"] = true;
                resultado["TipoUsuario"] = Usuario.IdTipoUsuario;
                resultado["WorkItem"] = JsonConvert.SerializeObject(workitem);
                resultado["Usuario"] = Usuario.IdUsuario;
                resultado["LstProyectos"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(LstProyectos);
                resultado["LstPrioridades"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(LstPrioridad);
                resultado["LstTipoAct"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(LstTipoAct);
                resultado["LstUsuarios"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlImagen(LstUsuarios, "");
                resultado["LstLideres"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlImagen(LstLideres, "");
                resultado["LstClasificacion"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(LstClasificacion);
                resultado["LstTipo"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlImagen2(LstTipo);

                return Content(resultado.ToString());



            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
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
                resultado["LstClasificacion"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(LstClasificacion);

                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
                return Content(resultado.ToString());
            }
        }

        public ActionResult CargarClasificacionActividadCombo(long IdTipoActividad)
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

                List<CatalogoGeneralModel> LstClasificacion = cd_CatGenral.ObtenerClasificacionActividadCombo(IdTipoActividad, Conexion);

                resultado["Exito"] = true;
                resultado["LstClasificacion"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(LstClasificacion);

                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
                return Content(resultado.ToString());
            }
        }

        public async Task<ActionResult> CargarRecursosProyecto(long IdProyecto)
        {

            var resultado = new JObject();
            try
            {

                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }

                CD_Proyecto cd_proy = new CD_Proyecto();


                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                List<CatalogoGeneralModel> LstUsuarios = cd_proy.ConsultaUsuariosProyectoCombo(IdProyecto, Conexion);
                List<CatalogoGeneralModel> LstSprints = cd_proy.ComboSprintsProyecto(IdProyecto, Conexion);
                var idUsuarioLider = (await LeerQueryGeneral<Proyecto, long>(conexionEF, x => x.IdProyecto == IdProyecto, x => x.IdULider ?? 0)).FirstOrDefault();

                resultado["Exito"] = true;
                resultado["LstUsuarios"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlImagen(LstUsuarios, "");
                resultado["LstSprints"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(LstSprints);
                resultado["IdUsuarioLider"] = idUsuarioLider;
                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
                return Content(resultado.ToString());
            }
        }

        public async Task<ActionResult> CargarRecursosAsignar(long IdProyecto)
        {

            var resultado = new JObject();
            try
            {

                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }
                CD_Proyecto cd_proy = new CD_Proyecto();


                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                List<CatalogoGeneralModel> LstUsuarios = cd_proy.ConsultaUsuariosProyectoCombo(IdProyecto, Conexion);

                resultado["Exito"] = true;
                resultado["LstUsuarios"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlImagen(LstUsuarios, "");

                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
                return Content(resultado.ToString());
            }
        }

        public ActionResult CargaCombosFiltros()
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

                List<CatalogoGeneralModel> LstProyectos = cd_CatGenral.ObtenerProyectosPorUsuario(Usuario, Conexion);
                List<CatalogoGeneralModel> LstTipoAct = cd_CatGenral.ObtenerCatalogoGeneral(2, Conexion);
                List<CatalogoGeneralModel> LstUsuarios = cd_CatGenral.ObtenerUsuarios(Usuario.IdUsuario, Conexion);
                List<CatalogoGeneralModel> LstLideres = cd_CatGenral.ObtenerLideres(Usuario, Conexion);
                LstLideres.AddRange(LstUsuarios);
                List<CatalogoGeneralModel> LstClasificacion = cd_CatGenral.ObtenerCatalogoGeneral(5, Conexion);


                resultado["Exito"] = true;
                resultado["TipoUsuario"] = Usuario.IdTipoUsuario;
                resultado["Usuario"] = Usuario.IdUsuario;
                resultado["LstProyectos"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlComboxMultiple(LstProyectos);
                resultado["LstTipoAct"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlComboxMultiple(LstTipoAct);
                resultado["LstUsuarios"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlComboxMultiple(LstUsuarios);
                resultado["LstLideres"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlComboxMultiple(LstLideres);
                resultado["LstClasificacion"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlComboxMultiple(LstClasificacion);

                return Content(resultado.ToString());
            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
                return Content(resultado.ToString());
            }
        }

        //public ActionResult CargaListaRecursos()
        //{

        //    var resultado = new JObject();
        //    try
        //    {

        //        if (!FuncionesGenerales.SesionActiva())
        //        {
        //            return RedirectToAction("Index", "Login");
        //        }

        //        var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
        //        CD_CatalogoGeneral cd_CatGenral = new CD_CatalogoGeneral();

        //        string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);


        //        List<CatalogoGeneralModel> LstUsuarios = cd_CatGenral.ObtenerUsuarios(Usuario.IdUsuario, Conexion);
        //        List<CatalogoGeneralModel> LstLideres = cd_CatGenral.ObtenerLideres(Usuario, Conexion);
        //        LstLideres.AddRange(LstUsuarios);
        //        List<CatalogoGeneralModel> LstClasificacion = cd_CatGenral.ObtenerCatalogoGeneral(5, Conexion);


        //        resultado["Exito"] = true;
        //        resultado["LstUsuarios"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlComboxMultiple(LstUsuarios);


        //        return Content(resultado.ToString());
        //    }
        //    catch (Exception ex)
        //    {
        //        resultado["Exito"] = false;
        //        resultado["Mensaje"] = ex.Message;
        //        return Content(resultado.ToString());
        //    }
        //}


        public ActionResult CargaCombosFiltrosBugs()
        {

            var resultado = new JObject();
            try
            {

                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                CD_CatalogoGeneral cd_CatGenral = new CD_CatalogoGeneral();

                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                List<CatalogoGeneralModel> LstProyectos = cd_CatGenral.ObtenerProyectosPorUsuario(Usuario, Conexion);
                //List<CatalogoGeneralModel> LstTipoAct = cd_CatGenral.ObtenerCatalogoGeneral(2, Conexion);
                List<CatalogoGeneralModel> LstUsuarios = cd_CatGenral.ObtenerUsuarios(Usuario.IdUsuario, Conexion);
                //List<CatalogoGeneralModel> LstLideres = cd_CatGenral.ObtenerLideres(1, Conexion);
                //LstLideres.AddRange(LstUsuarios);
                List<CatalogoGeneralModel> LstTiposBug = cd_CatGenral.ObtenerTiposBug(Conexion);


                resultado["Exito"] = true;
                resultado["TipoUsuario"] = Usuario.IdTipoUsuario;
                resultado["Usuario"] = Usuario.IdUsuario;
                resultado["LstProyectos"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlComboxMultiple(LstProyectos);
                //resultado["LstTipoAct"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlComboxMultiple(LstTipoAct);
                resultado["LstUsuarios"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlComboxMultiple(LstUsuarios);
                //resultado["LstLideres"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlComboxMultiple(LstLideres);
                resultado["LstTiposBug"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlComboxMultiple(LstTiposBug);

                return Content(resultado.ToString());
            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
                return Content(resultado.ToString());
            }
        }

        public ActionResult CargaCombosFiltrosQuerys()
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

                List<CatalogoGeneralModel> LstProyectos = cd_CatGenral.ObtenerProyectosPorUsuario(Usuario, Conexion);
                List<CatalogoGeneralModel> LstTipoAct = cd_CatGenral.ObtenerCatalogoGeneral(2, Conexion);
                List<CatalogoGeneralModel> LstUsuarios = cd_CatGenral.ObtenerUsuarios(Usuario.IdUsuario, Conexion);
                List<CatalogoGeneralModel> LstLideres = cd_CatGenral.ObtenerLideres(Usuario, Conexion);
                LstLideres.AddRange(LstUsuarios);
                List<CatalogoGeneralModel> LstClasificacion = cd_CatGenral.ObtenerCatalogoGeneral(5, Conexion);


                resultado["Exito"] = true;
                resultado["TipoUsuario"] = Usuario.IdTipoUsuario;
                resultado["Usuario"] = Usuario.IdUsuario;
                resultado["LstProyectos"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlComboxMultiple(LstProyectos);
                resultado["LstTipoAct"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlComboxMultiple(LstTipoAct);
                resultado["LstUsuarios"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlComboxMultiple(LstUsuarios);
                resultado["LstLideres"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlComboxMultiple(LstLideres);
                resultado["LstClasificacion"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlComboxMultiple(LstClasificacion);

                return Content(resultado.ToString());
            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
                return Content(resultado.ToString());
            }
        }

        public async Task<ActionResult> LeerProyectoMejora()
        {
            try
            {
                var idProyecto = (await LeerQueryGeneral<Configuracion, string>
                    (conexionEF, x => x.IdConf == CapaDatos.Constants.Configuracion.ProyectoMejora, x => x.Valor)).FirstOrDefault();

                if (idProyecto == null)
                    return Json(new { Exito = false, Mensaje = "Configure el proyecto de mejora en Parametros del Sistema" });

                return Json(new { Exito = true, IdProyecto = idProyecto });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult CargaListaTipoActividad() {
            var resultado = new JObject();
            try
            {
                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }
                var WorkItems = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).WorkItems.ToList();

                resultado["Exito"] = true;

                resultado["LstWorkItems"] = JsonConvert.SerializeObject(WorkItems);

                return Content(resultado.ToString());



            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
                return Content(resultado.ToString());
            }


        }

        #endregion

        #region Actividad

        public ActionResult GuardarActividad(ActividadesModel Actividad)
        {

            var resultado = new JObject();
            try
            {
                //var l = Actividad.Descripcion.Length;
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                var controlleractual = Session["Controlador" + Session.SessionID];
                Session["Controlador" + Session.SessionID] = "Actividades";
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                #region validapermisos
                if (Actividad.IdActividad == 0)
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
                #endregion

                if (!Usuario.Captura)
                {

                    resultado["Exito"] = false;
                    resultado["Mensaje"] = "No tiene privilegios para dar de alta actividades.";
                    return Content(resultado.ToString());
                }
                Session["Controlador" + Session.SessionID] = controlleractual;

                //if (Actividad.DocumentoRef != null)
                //{
                //    string[] archivo = Actividad.DocumentoRef.Split('.');
                //    Actividad.DocumentoRef = Guid.NewGuid().ToString().Replace("-", "") + "." + archivo[1];
                //}

                CD_Actividad cd_act = new CD_Actividad();
                long idActividad = cd_act.GuardarActividad(Actividad, Usuario.IdUsuario, Conexion);

                resultado["Exito"] = true;
                resultado["IdActividad"] = idActividad;
                resultado["Documento"] = Actividad.DocumentoRef;
                resultado["Mensaje"] = Mensajes.MensajeGuardadoExito();

                return Content(resultado.ToString());
            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

                return Content(resultado.ToString());
            }

        }

        public ActionResult GuardarActividadAR(ActividadesModel Actividad, List<long> LstAsignados)
        {

            var resultado = new JObject();
            try
            {
                //var l = Actividad.Descripcion.Length;
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                var controlleractual = Session["Controlador" + Session.SessionID];
                Session["Controlador" + Session.SessionID] = "Actividades";
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                #region validapermisos
                if (Actividad.IdActividad == 0)
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
                #endregion

                if (!Usuario.Captura)
                {

                    resultado["Exito"] = false;
                    resultado["Mensaje"] = "No tiene privilegios para dar de alta actividades.";
                    return Content(resultado.ToString());
                }
                Session["Controlador" + Session.SessionID] = controlleractual;

  
                CD_Actividad cd_act = new CD_Actividad();
                bool Exito = cd_act.GuardarActividadARMultiple(Actividad, LstAsignados,  Usuario.IdUsuario, Conexion);

                resultado["Exito"] = Exito;
                resultado["Mensaje"] = Mensajes.MensajeGuardadoExito();

                return Content(resultado.ToString());
            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

                return Content(resultado.ToString());
            }

        }



        public ActionResult GuardarCommit(ActividadRepositorioModel actividad)
        {
            try
            {
                actividad.IdUCreo = idUsuario;
                var (estatus, mensaje) = cd_Actividad.GuardarActividadRepositorio(actividad, conexionEF);

                return Json(new { Exito = estatus, Mensaje = mensaje });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult EliminarCommit(ActividadRepositorioModel actividad)
        {
            try
            {


                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                if (Usuario.IdTipoUsuario == 19)
                {

             
                    return Json(new { Exito = false, Mensaje = "No tiene permisos para eliminar la relación" });

                }

                var (estatus, mensaje) = cd_Actividad.EliminarActividadRepositorio(actividad, conexionEF);

                return Json(new { Exito = estatus, Mensaje = mensaje });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult LeerCommits(long idActividad)
        {
            try
            {
                var links = cd_Actividad.LeerActividadesRepositorio(idActividad, conexionEF);

                return Json(new { Exito = true, Links = links });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult ConsultaActividadRelaciones(long idActividad)
        {
            try
            {
                var activitys = cd_Actividad.ConsultaActividadRelaciones(idActividad, conexionSP);

                return Json(new { Exito = true, Activitys = activitys });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult ConsultaActividadRelacionesFPD(long IdFlujoPagoDet)
        {
            try
            {
                var activitys = cd_Actividad.ConsultaActividadRelacionesFPD(IdFlujoPagoDet, conexionEF);

                return Json(new { Exito = true, Activitys = activitys });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult ConsultaBugsRelacionados (long idActividad)
        {
            try
            {
                var activitys = cd_Actividad.ConsultaActividadRelaciones(idActividad, conexionSP).Where(w => w.TipoNombre.ToUpper() == "BUG").ToList();

                return Json(new { Exito = true, Activitys = activitys });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }


        public ActionResult ConsultaActividadArchivos(long idActividad)
        {
            try
            {
                var files = cd_Actividad.ConsultaActividadArchivos(idActividad, conexionEF);

                return Json(new { Exito = true, files = files });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }



        public ActionResult ConsultaActividadRelacionar(long idActividad)
        {
            try
            {
                var activitys = cd_Actividad.ConsultaActividadRelacionar(idActividad, conexionEF);

                return Json(new { Exito = true, Activitys = activitys });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult ConsultaActividadIssues(long idActividad)
        {
            try
            {
                var issues = cd_Actividad.ConsultaActividadIssues(idActividad, conexionEF);

                return Json(new { Exito = true, Issues = issues });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult GuardaArchivo(HttpPostedFileBase Documento, string NomDocumento)
        {
            var resultado = "";
            try
            {

                var path = Server.MapPath("~/Archivos/Documentos");
                if (Documento != null)
                {

                    string[] nombre = NomDocumento.Split('\\');
                    var longitud = nombre.Count();
                    var archivo = nombre[longitud - 1];
                    var urlcot1 = Path.Combine(path, archivo);
                    Documento.SaveAs(urlcot1);
                }

                resultado = "1";

                return Content(resultado.ToString());
            }
            catch (Exception)
            {
                resultado = "0";
                return Content(resultado.ToString());
            }
        }

        public ActionResult ObtieneActividades(FiltrosModel Filtros)
        {

            var Resultado = new JObject();
            try
            {
                if (!FuncionesGenerales.ValidaRango(Filtros.Actividades))
                {

                    Resultado["Exito"] = false;
                    Resultado["Mensaje"] = "El criterio de filtro ingresado en el campo No. Actividad no es válido";

                    return Content(Resultado.ToString());
                }

                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                Filtros.IdUsuario = Usuario.IdUsuario;

                CD_Actividad cd_act = new CD_Actividad();
                List<ActividadesModel> LstActividades = new List<ActividadesModel>();
                List<ActividadesLogModel> LstActividadesLog = new List<ActividadesLogModel>();
                List<ActividadesModel> LstActividadesV = new List<ActividadesModel>();
                List<ActividadesModel> LstActividadesL = new List<ActividadesModel>();
                List<long> LstSprints = new List<long>();
                Filtros.LstSprints = LstSprints;

                List<ActividadesModel> LstActividadesEnc = new List<ActividadesModel>();

                //string conexion = ConfigurationManager.ConnectionStrings["BDProductividad"].ToString();
                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);

                cd_act.ObtieneActividades(Filtros, ref LstActividades, ref LstActividadesLog, ref LstActividadesEnc, conexion);

                LstActividadesV = LstActividades.Where(w => w.Estatus == "R").ToList();
                LstActividadesL = LstActividades.Where(w => w.Estatus == "V").ToList();



                string ActividadesA = FuncionesGenerales.ConvierteListaTareasV2(LstActividades, "A");
                string ActividadesP = FuncionesGenerales.ConvierteListaTareasV2(LstActividades, "P");
                string ActividadesR = FuncionesGenerales.ConvierteListaTareasV2(LstActividades, "V");
                ActividadesR += FuncionesGenerales.ConvierteListaTareasV2(LstActividades, "R");
                string ActividadesX = FuncionesGenerales.ConvierteListaTareasV2(LstActividades, "X");
                string ActividadesL = FuncionesGenerales.ConvierteListaTareasV2(LstActividades, "L");



                Resultado["Exito"] = true;
                Resultado["Actividades"] = JsonConvert.SerializeObject(LstActividades);
                Resultado["ActividadesV"] = JsonConvert.SerializeObject(LstActividadesV);
                Resultado["ActividadesL"] = JsonConvert.SerializeObject(LstActividadesL);
                Resultado["ActividadesLog"] = JsonConvert.SerializeObject(LstActividadesLog);
                Resultado["TotalHoras"] = LstActividades.Sum(s => s.HorasAsignadas).ToString();
                Resultado["Total"] = LstActividades.Count;
                Resultado["TotalV"] = LstActividadesV.Count;
                Resultado["TotalL"] = LstActividadesL.Count;
                Resultado["Valida"] = Usuario.LstAurotizaciones.Where(v => v.IdAutorizacion == 1).FirstOrDefault() == null ? false : true;
                Resultado["Libera"] = Usuario.LstAurotizaciones.Where(v => v.IdAutorizacion == 2).FirstOrDefault() == null ? false : true;


                Resultado["TotalAbiertas"] = LstActividades.Where(w => w.Estatus == "A").Count();
                Resultado["TotalProgreso"] = LstActividades.Where(w => w.Estatus == "P").Count();
                Resultado["TotalValidacion"] = LstActividades.Where(w => w.Estatus == "V" || w.Estatus == "R").Count();
                Resultado["TotalRechazadas"] = LstActividades.Where(w => w.Estatus == "X").Count();
                Resultado["TotalLiberadas"] = LstActividades.Where(w => w.Estatus == "L").Count();
                Resultado["ActividadesA"] = ActividadesA;
                Resultado["ActividadesP"] = ActividadesP;
                Resultado["ActividadesR"] = ActividadesR;
                Resultado["ActividadesX"] = ActividadesX;
                Resultado["ActividadesLi"] = ActividadesL;



                return Content(Resultado.ToString());
            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }
        }

        public ActionResult ObtieneActividadesV2(FiltrosModel Filtros)
        {

            var Resultado = new JObject();
            try
            {
                if (!FuncionesGenerales.ValidaRango(Filtros.Actividades))
                {

                    Resultado["Exito"] = false;
                    Resultado["Mensaje"] = "El criterio de filtro ingresado en el campo No. Actividad no es válido";

                    return Content(Resultado.ToString());
                }

                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                Filtros.IdUsuario = Usuario.IdUsuario;
                Filtros.IdTipoUsuario = Usuario.IdTipoUsuario;
               

                CD_Actividad cd_act = new CD_Actividad();
                List<ActividadesModel> LstActividades = new List<ActividadesModel>();
                List<ActividadesLogModel> LstActividadesLog = new List<ActividadesLogModel>();
                List<ActividadesModel> LstActividadesV = new List<ActividadesModel>();
                List<ActividadesModel> LstActividadesL = new List<ActividadesModel>();
                //List<long> LstSprints = new List<long>();
                //Filtros.LstSprints = LstSprints;

                List<ActividadesModel> LstActividadesEnc = new List<ActividadesModel>();

                //string conexion = ConfigurationManager.ConnectionStrings["BDProductividad"].ToString();
                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);

                cd_act.ObtieneActividadesPanelV3(Filtros, ref LstActividades, conexion);


                var LstEventos = FuncionesGenerales.ConvierteEventosCalendario(LstActividades);

                LstActividadesV = LstActividades.Where(w => w.Estatus == "R").ToList();
                LstActividadesL = LstActividades.Where(w => w.Estatus == "V").ToList();



                string ActividadesA = FuncionesGenerales.ConvierteListaTareasV2(LstActividades, "A");
                string ActividadesP = FuncionesGenerales.ConvierteListaTareasV2(LstActividades, "P");
                string ActividadesR = FuncionesGenerales.ConvierteListaTareasV2(LstActividades, "V");
                ActividadesR += FuncionesGenerales.ConvierteListaTareasV2(LstActividades, "R");
                string ActividadesX = FuncionesGenerales.ConvierteListaTareasV2(LstActividades, "X");
                string ActividadesL = FuncionesGenerales.ConvierteListaTareasV2(LstActividades, "L");



                Resultado["Exito"] = true;
                Resultado["Actividades"] = JsonConvert.SerializeObject(LstActividades);
                Resultado["ActividadesV"] = JsonConvert.SerializeObject(LstActividadesV);
                Resultado["ActividadesL"] = JsonConvert.SerializeObject(LstActividadesL);
                Resultado["ActividadesLog"] = JsonConvert.SerializeObject(LstActividadesLog);
                Resultado["TotalHoras"] = LstActividades.Sum(s => s.HorasAsignadas).ToString();
                Resultado["Total"] = LstActividades.Count;
                Resultado["TotalV"] = LstActividadesV.Count;
                Resultado["TotalL"] = LstActividadesL.Count;
                Resultado["Valida"] = Usuario.LstAurotizaciones.Where(v => v.IdAutorizacion == 1).FirstOrDefault() == null ? false : true;
                Resultado["Libera"] = Usuario.LstAurotizaciones.Where(v => v.IdAutorizacion == 2).FirstOrDefault() == null ? false : true;


                Resultado["TotalAbiertas"] = LstActividades.Where(w => w.Estatus == "A").Count();
                Resultado["TotalProgreso"] = LstActividades.Where(w => w.Estatus == "P").Count();
                Resultado["TotalValidacion"] = LstActividades.Where(w => w.Estatus == "V" || w.Estatus == "R").Count();
                Resultado["TotalRechazadas"] = LstActividades.Where(w => w.Estatus == "X").Count();
                Resultado["TotalLiberadas"] = LstActividades.Where(w => w.Estatus == "L").Count();
                Resultado["ActividadesA"] = ActividadesA;
                Resultado["ActividadesP"] = ActividadesP;
                Resultado["ActividadesR"] = ActividadesR;
                Resultado["ActividadesX"] = ActividadesX;
                Resultado["ActividadesLi"] = ActividadesL;

                Resultado["Eventos"] = JsonConvert.SerializeObject(LstEventos);



                return Content(Resultado.ToString());
            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }
        }

        public ActionResult ObtieneActividadesSponsor()
        {

            var Resultado = new JObject();
            try
            {
             

                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                //FiltrosModel Filtros = new FiltrosModel();

                //Filtros.FechaSolIni = DateTime.Now.AddDays(-365);
                //Filtros.FechaSolFin = DateTime.Now.AddDays(90);
                //Filtros.Tipo = -1; // Regresara todo lo que sea responsable el cliente
                

                //Filtros.IdUsuario = Usuario.IdUsuario;
                //Filtros.IdTipoUsuario = Usuario.IdTipoUsuario;
                //Filtros.LstEstatus.Add("R");
                //Filtros.LstEstatus.Add("V");
                //Filtros.LstEstatus.Add("L");

                CD_Actividad cd_act = new CD_Actividad();
                List<ActividadesModel> LstActividades = new List<ActividadesModel>();

                List<ActividadesModel> LstActividadesV = new List<ActividadesModel>();
                List<ActividadesModel> LstActividadesL = new List<ActividadesModel>();
              
             
                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);

                LstActividades = cd_act.ObtieneActividadesSponsor(Usuario.IdUsuario, conexion);

                LstActividadesV = LstActividades.Where(w => w.Estatus == "R" || w.Estatus =="V").ToList();
                LstActividadesL = LstActividades.Where(w => w.Estatus == "L").ToList();




                Resultado["Exito"] = true;
           
                Resultado["ActividadesV"] = JsonConvert.SerializeObject(LstActividadesV);
                Resultado["ActividadesL"] = JsonConvert.SerializeObject(LstActividadesL);
        

                //Resultado["TotalV"] = LstActividadesV.Count;
                //Resultado["TotalL"] = LstActividadesL.Count;
       

                //Resultado["TotalAbiertas"] = LstActividades.Where(w => w.Estatus == "A").Count();
                //Resultado["TotalProgreso"] = LstActividades.Where(w => w.Estatus == "P").Count();
                //Resultado["TotalValidacion"] = LstActividades.Where(w => w.Estatus == "V" || w.Estatus == "R").Count();
                //Resultado["TotalRechazadas"] = LstActividades.Where(w => w.Estatus == "X").Count();
                //Resultado["TotalLiberadas"] = LstActividades.Where(w => w.Estatus == "L").Count();
                //Resultado["ActividadesA"] = ActividadesA;
                //Resultado["ActividadesP"] = ActividadesP;
                //Resultado["ActividadesR"] = ActividadesR;
                //Resultado["ActividadesX"] = ActividadesX;
                //Resultado["ActividadesLi"] = ActividadesL;

                //Resultado["Eventos"] = JsonConvert.SerializeObject(LstEventos);



                return Content(Resultado.ToString());
            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }
        }

        public ActionResult DescargarExcelActividades( DateTime FechaSolIni, DateTime FechaSolFin, List<long> LstProyecto, List<string> LstEstatus,  List<long> LstTipoActividad, List<long> LstAsignado, List<long> LstTipo)
        {

            var Resultado = new JObject();
            try
            {

                FiltrosModel Filtros = new FiltrosModel();
                Filtros.FechaSolIni = FechaSolIni;
                Filtros.FechaSolFin = FechaSolFin;
                Filtros.LstProyecto = LstProyecto;
                Filtros.LstEstatus = LstEstatus;
                Filtros.LstTipoActividad = LstTipoActividad;
                Filtros.LstAsignado = LstAsignado;
                Filtros.LstTipo = LstTipo;

                //Filtros.Tipo = int.Parse(Tipo);
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                Filtros.IdUsuario = Usuario.IdUsuario;
                Filtros.IdTipoUsuario = Usuario.IdTipoUsuario;


                CD_Actividad cd_act = new CD_Actividad();
                List<ActividadesModel> LstActividades = new List<ActividadesModel>();
                List<ActividadesLogModel> LstActividadesLog = new List<ActividadesLogModel>();
                List<ActividadesModel> LstActividadesV = new List<ActividadesModel>();
                List<ActividadesModel> LstActividadesL = new List<ActividadesModel>();
                List<long> LstSprints = new List<long>();
                Filtros.LstSprints = LstSprints;
             

                List<ActividadesModel> LstActividadesEnc = new List<ActividadesModel>();

                //string conexion = ConfigurationManager.ConnectionStrings["BDProductividad"].ToString();
                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);

                cd_act.ObtieneActividadesPanelV3(Filtros, ref LstActividades, conexion);


                var act = ObtenerObjetoDescargaActividades(LstActividades);
                var tabla = FuncionesGenerales.CrearTabla(act, "Actividades");
                var excel = Reportes.CrearExcel(tabla);

                return File(excel, MimeType.XLSX, "Actividades.xlsx");


            //    return Content(Resultado.ToString());
            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }
        }

        private object ObtenerObjetoDescargaActividades(List<ActividadesModel> Act)
        {
            return
                Act.Select(x => new
                {
                    Id =  x.IdActividad,
                    Tipo = x.TipoNombre,
                    Título = x.BR,
                    Sprint = x.Sprint,
                    Asignado = x.ClaveUsuario,

                    Fase = x.ClaveTipoActividad,
                    Clasificación = x.ClaveClasificacionActividad,
                    //Actividad  = x.Descripcion,
                  
                    HorasEstimadas = x.HorasFacturables,
                    HorasPlaneadas= x.HorasAsignadas,
                    HorasReales = x.HorasFinales,
                    InicioPlan =  x.FechaInicio,
                    FinPlan = x.FechaSolicitado

                }).OrderByDescending(x => x.Id).ToList();
        }
   
        public ActionResult SolicitaRevision(long IdActividad)
        {
            var resultado = new JObject();
            try
            {
                var Mensaje = string.Empty;
                CD_Actividad cd_act = new CD_Actividad();
                var IdUsuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.IdUsuario;
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                string ConexionSp = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);


                var Actividad = cd_act.ConsultaActividad(IdActividad, IdUsuario, ConexionSp);

                if (Actividad.Estatus != "X" && Actividad.Estatus != "A" && Actividad.Estatus != "P")
                {

                    resultado["Exito"] = false;
                    resultado["Mensaje"] = "Solo se pueden enviar a revisión las actividades con estatus 'Asignada', 'Pendiente' ó 'Rechazada'.";
                    return Content(resultado.ToString());

                }
                if (Actividad.TipoId == 1 ) 
                { //Si la actividad es milestone no valida si tiene tiempo cargado     
                    if (Actividad.HorasFinales == 0)
                            {

                    resultado["Exito"] = false;
                    resultado["Mensaje"] = "Para solicitar la revisión debe ingresar las horas utilizadas.";
                    return Content(resultado.ToString());

                            }
                 }

                //    if (Actividad.FechaTermino == null)
                //{

                //    resultado["Exito"] = false;
                //    resultado["Mensaje"] = "Para solicitar la revisión debe ingresar la fecha fin de la actividad.";
                //    return Content(resultado.ToString());

                //}

                string Con = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                bool Exito = cd_act.CambiaEstatusActividad("R", "Solictó revisión", IdActividad, IdUsuario, Con);

                bool Envio = FuncionesGenerales.EnviarCorreoSolicitaRevision(Actividad, IdUsuario, Con);

                Mensaje = "Se envío la solicitud de revisión correctamente.";


                resultado["Exito"] = Exito;
                resultado["Mensaje"] = Mensaje;
                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

                return Content(resultado.ToString());

            }

        }
         
        public ActionResult SolicitaRevisionTablero(long IdActividad, DateTime FechaFin)
        {
            var resultado = new JObject();
            try
            {
                var Mensaje = string.Empty;
                CD_Actividad cd_act = new CD_Actividad();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                string Conexion = Encripta.DesencriptaDatos(Usuario.ConexionEF);
                string ConexionSp = Encripta.DesencriptaDatos(Usuario.ConexionSP);

                var Actividad = cd_act.ConsultaActividad(IdActividad, Usuario.IdUsuario, ConexionSp);


                if(Actividad.TipoId == 1 || Actividad.TipoId == 7) { //Si la actividad es milestone no valida si tiene tiempo cargado        
                    if (Actividad.HorasFinales == 0)
                    {
                        resultado["Exito"] = false;
                        resultado["Mensaje"] = "La actividad no tiene tiempo registrado.";
                        return Content(resultado.ToString());
                            }
                }
                var Actualizado = cd_act.ActualizaFechaFinActividad(IdActividad, FechaFin, Usuario.IdUsuario, Conexion);



                if (Actividad.Estatus != "X" && Actividad.Estatus != "A" && Actividad.Estatus != "P")
                {

                    resultado["Exito"] = false;
                    resultado["Mensaje"] = "Solo se pueden enviar a revisión las actividades con estatus 'Asignada', 'Pendiente' ó 'Rechazada'.";
                    return Content(resultado.ToString());

                }




                bool Exito = cd_act.CambiaEstatusActividad("R", "Solictó revisión", IdActividad, Usuario.IdUsuario, Conexion);

                bool Envio = FuncionesGenerales.EnviarCorreoSolicitaRevision(Actividad, Usuario.IdUsuario, Conexion);

                Mensaje = "Se envío la solicitud de revisión correctamente.";


                resultado["Exito"] = Exito;
                resultado["Mensaje"] = Mensaje;
                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

                return Content(resultado.ToString());

            }

        }

        public ActionResult CancelaActividad(long IdActividad)
        {

            var resultado = new JObject();
            try
            {

                CD_Actividad cd_act = new CD_Actividad();
                var IdUsuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.IdUsuario;
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                string ConexionSP = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);

                var Actividad = cd_act.ConsultaActividad(IdActividad, IdUsuario, ConexionSP);

                if (Actividad.Estatus == "C")
                {

                    resultado["Exito"] = false;
                    resultado["Mensaje"] = "La actividad ya se encuentra cancelada.";

                    return Content(resultado.ToString());
                }

                if (Actividad.HorasFinales == 0)
                {

                }

                bool Exito = cd_act.CambiaEstatusActividad("C", "Canceló la actividad", IdActividad, IdUsuario, Conexion);


                resultado["Exito"] = true;
                resultado["Mensaje"] = "La actividad fue cancelada exitosamente.";

                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

                return Content(resultado.ToString());

            }


        }

        public ActionResult ImportaActividades(HttpPostedFileBase Archivo)
        {

            var resultado = "";
            try
            {
                var idUsuarioLogin = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.IdUsuario;
                string Mensaje = string.Empty;
                //string conexion = ConfigurationManager.ConnectionStrings["BDProductividad"].ToString();
                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
                if (FuncionesGenerales.ValidaPermisos(1))
                {


                    // return Content(resultado.ToString());
                    List<ActividadesModel> LstActividades = new List<ActividadesModel>();

                    Mensaje = LeeArchivo(Archivo, ref LstActividades);

                    if (Mensaje == string.Empty)
                    {
                        CD_Actividad cd_act = new CD_Actividad();

                        Mensaje = cd_act.GuardaImportacionActividades(LstActividades, idUsuarioLogin, conexion);
                    }
                }
                else
                {

                    Mensaje = Mensajes.MensajePermisoGuardar();
                }

                resultado = Mensaje;
                return Content(resultado.ToString());

            }
            catch (Exception)
            {

                resultado = "A|Error al leer el documento, por favor verifique que el documento es el correcto.";
                return Content(resultado.ToString());
            }

        }

        private string LeeArchivo(HttpPostedFileBase ProcesaArchivo, ref List<ActividadesModel> LstActividades)
        {
            try
            {


                using (var package = new ExcelPackage(ProcesaArchivo.InputStream))
                {

                    ExcelWorksheet worksheet = package.Workbook.Worksheets[1];


                    ExcelCellAddress startCell = worksheet.Dimension.Start;
                    ExcelCellAddress endCell = worksheet.Dimension.End;


                    ActividadesModel act;
                    for (int row = startCell.Row + 1; row <= endCell.Row; row++)
                    {
                        act = new ActividadesModel();

                        object val = worksheet.Cells[row, 1].Value;
                        if (val != null)
                        {

                            if (worksheet.Cells[row, 2].Value.ToString().Trim().ToUpper() != "M")
                            {

                                act.ProyectoStr = worksheet.Cells[row, 1].Value.ToString().Trim().Replace(" ", "");
                                act.ResponsableStr = worksheet.Cells[row, 2].Value.ToString().Trim().ToUpper();
                                act.TipoActividadStr = worksheet.Cells[row, 3].Value.ToString().Trim().ToUpper();
                                act.ClasificacionStr = worksheet.Cells[row, 4].Value.ToString().Trim().ToUpper();
                                act.Descripcion = worksheet.Cells[row, 5].Value.ToString().Trim();

                                decimal horas = 0;

                                bool validahora = decimal.TryParse(worksheet.Cells[row, 6].Value.ToString(), out horas);

                                if (!validahora)
                                {

                                    return "A|El valor " + worksheet.Cells[row, 6].Value.ToString() + " de la columna horas planeadas no es un dato númerico válido (línea " + row.ToString() + ").";
                                }

                                act.HorasAsignadas = horas;

                                DateTime FechaInicio;
                                var valor = worksheet.Cells[row, 7].Value;

                                try
                                {
                                    FechaInicio = DateTime.FromOADate(double.Parse(valor.ToString()));

                                }
                                catch (Exception)
                                {

                                    return "A|El valor " + worksheet.Cells[row, 7].Value.ToString() + " de la columna fecha inicio no es una fecha válida (línea " + row.ToString() + ").";
                                }


                                act.FechaInicio = FechaInicio;

                                DateTime FechaSolicitado;
                                var valors = worksheet.Cells[row, 8].Value;

                                try
                                {
                                    FechaSolicitado = DateTime.FromOADate(double.Parse(valors.ToString()));

                                }
                                catch (Exception)
                                {

                                    return "A|El valor " + worksheet.Cells[row, 8].Value.ToString() + " de la columna fecha fin no es una fecha válida (línea " + row.ToString() + ").";
                                }

                                act.FechaSolicitado = FechaSolicitado;



                                LstActividades.Add(act);

                            }

                        }
                    }

                }


                return string.Empty;

            }
            catch (Exception)
            {
                return "A|Error al leer el documento, por favor verifique que el documento es el correcto.";


            }
        }


        public ActionResult ImportaActividadesV2(HttpPostedFileBase Archivo, int Tipo)
        {

            var resultado = "";
            try
            {
                var idUsuarioLogin = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.IdUsuario;
                string Mensaje = string.Empty;

                if (FuncionesGenerales.ValidaPermisos(1))
                {


                    // return Content(resultado.ToString());
                    List<ActividadesModel> LstActividades = new List<ActividadesModel>();

                    Mensaje = Tipo == 1 ? LeeArchivoV2(Archivo, ref LstActividades) : LeeArchivoActualizacion(Archivo, ref LstActividades);

                    if (Mensaje == string.Empty)
                    {
                        CD_Actividad cd_act = new CD_Actividad();
                        //string conexion = ConfigurationManager.ConnectionStrings["BDProductividad"].ToString();

                        string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
                        string conexionEF = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                        Mensaje = Tipo == 1 ? cd_act.GuardaImportacionActividadesV2(LstActividades, idUsuarioLogin, conexion, conexionEF) : cd_act.GuardaImportacionActividadesActualizacion(LstActividades, idUsuarioLogin, conexion, conexionEF);
                    }
                }
                else
                {

                    Mensaje = Mensajes.MensajePermisoGuardar();
                }

                resultado = Mensaje;
                return Content(resultado.ToString());

            }
            catch (Exception)
            {

                resultado = "A|Error al leer el documento, por favor verifique que el documento es el correcto.";
                return Content(resultado.ToString());
            }

        }


        private string LeeArchivoV2(HttpPostedFileBase ProcesaArchivo, ref List<ActividadesModel> LstActividades)
        {
            try
            {


                using (var package = new ExcelPackage(ProcesaArchivo.InputStream))
                {

                    ExcelWorksheet worksheet = package.Workbook.Worksheets[1];


                    ExcelCellAddress startCell = worksheet.Dimension.Start;
                    ExcelCellAddress endCell = worksheet.Dimension.End;


                    ActividadesModel act;
                    for (int row = startCell.Row + 1; row <= endCell.Row; row++)
                    {
                        act = new ActividadesModel();

                        object val = worksheet.Cells[row, 1].Value;
                        if (val != null)
                        {

                            if (worksheet.Cells[row, 3].Value.ToString().Trim().ToUpper() != "M")
                            {

                                act.ProyectoStr = worksheet.Cells[row, 1].Value.ToString().Trim().Replace(" ", "");
                                act.TipoNombre = worksheet.Cells[row, 2].Value.ToString().Trim();
                                act.BR = worksheet.Cells[row, 3].Value.ToString().Trim().ToUpper();
                                act.Descripcion = worksheet.Cells[row, 4].Value.ToString().Trim();
                                act.Sprint = worksheet.Cells[row, 5].Value == null ? "" : worksheet.Cells[row, 5].Value.ToString().ToUpper();
                                act.ResponsableStr = worksheet.Cells[row, 6].Value == null ? "" : worksheet.Cells[row, 6].Value.ToString().Trim().ToUpper();
                                act.TipoActividadStr = worksheet.Cells[row, 7].Value == null ? "" :  worksheet.Cells[row, 7].Value.ToString().Trim().ToUpper();
                                act.ClasificacionStr = worksheet.Cells[row, 8].Value == null ? "" : worksheet.Cells[row, 8].Value.ToString().Trim().ToUpper();
                              
                                decimal horasf = 0;

                                bool validahoraf = decimal.TryParse(worksheet.Cells[row, 9].Value.ToString(), out horasf);

                                if (!validahoraf)
                                {

                                    return "A|El valor " + worksheet.Cells[row, 9].Value.ToString() + " de la columna horas facturadas no es un dato númerico válido (línea " + row.ToString() + ").";
                                }

                                act.HorasFacturables = horasf;


                                decimal horas = 0;

                                bool validahora = decimal.TryParse(worksheet.Cells[row, 10].Value.ToString(), out horas);

                                if (!validahora)
                                {

                                    return "A|El valor " + worksheet.Cells[row, 10].Value.ToString() + " de la columna horas planeadas no es un dato númerico válido (línea " + row.ToString() + ").";
                                }

                                act.HorasAsignadas = horas;

                                DateTime? FechaInicio = null ;
                                var valor = worksheet.Cells[row, 11].Value;

                                if( valor != null)
                                {

                                    try
                                    {
                                        FechaInicio = DateTime.Parse((valor.ToString()));

                                    }
                                    catch (Exception)
                                    {

                                        return "A|El valor " + worksheet.Cells[row, 11].Value.ToString() + " de la columna fecha inicio no es una fecha válida (línea " + row.ToString() + ").";
                                    }

                                }


                                act.FechaInicio = FechaInicio;

                                DateTime? FechaSolicitado = null;
                                var valors = worksheet.Cells[row, 12].Value;

                                if(worksheet.Cells[row, 12].Value != null)
                                {
                                    try
                                    {
                                        FechaSolicitado = DateTime.Parse((valors.ToString()));

                                    }
                                    catch (Exception)
                                    {

                                        return "A|El valor " + worksheet.Cells[row, 12].Value.ToString() + " de la columna fecha fin no es una fecha válida (línea " + row.ToString() + ").";
                                    }

                                }
                               
                            

                                act.FechaSolicitado = FechaSolicitado;



                                LstActividades.Add(act);

                            }

                        }
                    }

                }


                return string.Empty;

            }
            catch (Exception)
            {
                return "A|Error al leer el documento, por favor verifique que el documento es el correcto.";


            }
        }

        public ActionResult ImportaPeerReviews(HttpPostedFileBase Archivo)
        {

            var resultado = "";
            try
            {
                var idUsuarioLogin = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.IdUsuario;
                string Mensaje = string.Empty;



                    // return Content(resultado.ToString());
                    List<ActividadesModel> LstActividades = new List<ActividadesModel>();

                    Mensaje =  LeeArchivoPeerReviews(Archivo, ref LstActividades);

                    if (Mensaje == string.Empty)
                    {
                        CD_Actividad cd_act = new CD_Actividad();
                        //string conexion = ConfigurationManager.ConnectionStrings["BDProductividad"].ToString();

                        string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
                        string conexionEF = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                        Mensaje = cd_act.GuardaImportacionPeerReviews(LstActividades, idUsuarioLogin, conexion, conexionEF) ;
                    }
                
                else
                {

                    Mensaje = Mensajes.MensajePermisoGuardar();
                }

                resultado = Mensaje;
                return Content(resultado.ToString());

            }
            catch (Exception)
            {

                resultado = "A|Error al leer el documento, por favor verifique que el documento es el correcto.";
                return Content(resultado.ToString());
            }

        }

        private string LeeArchivoPeerReviews(HttpPostedFileBase ProcesaArchivo, ref List<ActividadesModel> LstActividades)
        {
            try
            {


                using (var package = new ExcelPackage(ProcesaArchivo.InputStream))
                {

                    ExcelWorksheet worksheet = package.Workbook.Worksheets[1];


                    ExcelCellAddress startCell = worksheet.Dimension.Start;
                    ExcelCellAddress endCell = worksheet.Dimension.End;


                    ActividadesModel act;
                    for (int row = startCell.Row + 1; row <= endCell.Row; row++)
                    {
                        act = new ActividadesModel();

                        object val = worksheet.Cells[row, 1].Value;
                        if (val != null)
                        {

                            if (worksheet.Cells[row, 3].Value.ToString().Trim().ToUpper() != "M")
                            {

                                act.ProyectoStr = worksheet.Cells[row, 1].Value.ToString().Trim().Replace(" ", "");
                                act.IdActividad = int.Parse(worksheet.Cells[row, 2].Value.ToString().Trim().Replace(" ", ""));
                                act.BR = worksheet.Cells[row, 3].Value.ToString().Trim().ToUpper();
                                act.ResponsableStr = worksheet.Cells[row, 4].Value.ToString().Trim().ToUpper();

                            

                                decimal horasf = 0;

                                bool validahoraf = decimal.TryParse(worksheet.Cells[row, 5].Value.ToString(), out horasf);

                                if (!validahoraf)
                                {
                                    return "A|El valor " + worksheet.Cells[row, 5].Value.ToString() + " de la columna horas planeadas no es un dato númerico válido (línea " + row.ToString() + ").";
                                }

                                act.HorasAsignadas = horasf;




                          
                                DateTime? FechaInicio = null;
                                var valor = worksheet.Cells[row, 6].Value;

                                if (valor != null)
                                {

                                    try
                                    {
                                        FechaInicio = DateTime.Parse((valor.ToString()));

                                    }
                                    catch (Exception)
                                    {

                                        return "A|El valor " + worksheet.Cells[row, 6].Value.ToString() + " de la columna fecha inicio no es una fecha válida (línea " + row.ToString() + ").";
                                    }

                                }


                                act.FechaInicio = FechaInicio;

                                DateTime? FechaSolicitado = null;
                                var valors = worksheet.Cells[row, 7].Value;

                                if (worksheet.Cells[row, 7].Value != null)
                                {
                                    try
                                    {
                                        FechaSolicitado = DateTime.Parse((valors.ToString()));

                                    }
                                    catch (Exception)
                                    {

                                        return "A|El valor " + worksheet.Cells[row, 7].Value.ToString() + " de la columna fecha fin no es una fecha válida (línea " + row.ToString() + ").";
                                    }

                                }



                                act.FechaSolicitado = FechaSolicitado;



                                LstActividades.Add(act);

                            }

                        }
                    }

                }


                return string.Empty;

            }
            catch (Exception)
            {
                return "A|Error al leer el documento, por favor verifique que el documento es el correcto.";


            }
        }



        public ActionResult ImportarCasosPrueba(HttpPostedFileBase Archivo,long IdProyecto, int Tipo)
        {

            var resultado = "";
            try
            {
                var idUsuarioLogin = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.IdUsuario;
                string Mensaje = string.Empty;

                if (FuncionesGenerales.ValidaPermisos(1))
                {


                    // return Content(resultado.ToString());
                    List<ActividadesModel> LstActividades = new List<ActividadesModel>();

                    Mensaje = Tipo == 1 ? LeeArchivoCasosPrueba(Archivo, ref LstActividades) : LeeArchivoActualizacion(Archivo, ref LstActividades);

                    if (Mensaje == string.Empty)
                    {
                        CD_Actividad cd_act = new CD_Actividad();
                        //string conexion = ConfigurationManager.ConnectionStrings["BDProductividad"].ToString();

                        string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
                        string conexionEF = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                        Mensaje = cd_act.GuardaImportacionCasosPrueba(LstActividades, IdProyecto, idUsuarioLogin, conexion, conexionEF);
                    }
                }
                else
                {

                    Mensaje = Mensajes.MensajePermisoGuardar();
                }

                resultado = Mensaje;
                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {

                resultado = "A|Error al leer el documento, por favor verifique que el documento es el correcto.<br/> " +  ex.Message;
                return Content(resultado.ToString());
            }

        }

        private string LeeArchivoCasosPrueba(HttpPostedFileBase ProcesaArchivo, ref List<ActividadesModel> LstActividades)
        {
            try
            {


                using (var package = new ExcelPackage(ProcesaArchivo.InputStream))
                {

                    ExcelWorksheet worksheet = package.Workbook.Worksheets[1];


                    ExcelCellAddress startCell = worksheet.Dimension.Start;
                    ExcelCellAddress endCell = worksheet.Dimension.End;


                    ActividadesModel act;
                    for (int row = startCell.Row + 1; row <= endCell.Row; row++)
                    {
                        act = new ActividadesModel();

                        object val = worksheet.Cells[row, 1].Value;
                        if (val != null)
                        {

                            if (worksheet.Cells[row, 3].Value.ToString().Trim().ToUpper() != "M")
                            {

                                act.ProyectoStr = worksheet.Cells[row, 1].Value.ToString().Trim().Replace(" ", "");
                              
                                act.Sprint = worksheet.Cells[row, 3].Value == null ? "" : worksheet.Cells[row, 3].Value.ToString().ToUpper();
                                act.BR = worksheet.Cells[row, 4].Value.ToString().Trim().ToUpper();
                                act.Descripcion = worksheet.Cells[row, 5].Value.ToString().Trim();
                                act.AsignadoStr = worksheet.Cells[row, 6].Value.ToString().Trim().ToUpper();
                                act.ResponsableStr = worksheet.Cells[row, 7].Value.ToString().Trim().ToUpper();
                                act.ClasificacionStr = worksheet.Cells[row, 8].Value.ToString().Trim().ToUpper();


                                long IdActR = 0;

                                bool ValidaIdActR = long.TryParse(worksheet.Cells[row, 2].Value.ToString(), out IdActR);

                                if (!ValidaIdActR)
                                {

                                    return "A|El valor " + worksheet.Cells[row, 2].Value.ToString() + " de la columna HU relacionada no es un dato númerico válido (línea " + row.ToString() + ").";
                                }

                                act.IdActividadR1 = IdActR;


                                decimal TEjecucion = 0;

                                bool validatiempoe = decimal.TryParse(worksheet.Cells[row, 9].Value.ToString(), out TEjecucion);

                                if (!validatiempoe)
                                {

                                    return "A|El valor " + worksheet.Cells[row, 9].Value.ToString() + " de la columna T Ejecución no es un dato númerico válido (línea " + row.ToString() + ").";
                                }

                                act.TiempoEjecucion = TEjecucion;




                                decimal horasf = 0;

                                bool validahoraf = decimal.TryParse(worksheet.Cells[row, 10].Value.ToString(), out horasf);

                                if (!validahoraf)
                                {

                                    return "A|El valor " + worksheet.Cells[row, 10].Value.ToString() + " de la columna horas estimadas no es un dato númerico válido (línea " + row.ToString() + ").";
                                }

                                act.HorasFacturables = horasf;


                                decimal horas = 0;

                                bool validahora = decimal.TryParse(worksheet.Cells[row, 11].Value.ToString(), out horas);

                                if (!validahora)
                                {

                                    return "A|El valor " + worksheet.Cells[row, 11].Value.ToString() + " de la columna horas planeadas no es un dato númerico válido (línea " + row.ToString() + ").";
                                }

                                act.HorasAsignadas = horas;

                                DateTime FechaInicio;
                                var valor = worksheet.Cells[row, 12].Value;

                                try
                                {
                                    FechaInicio = DateTime.Parse((valor.ToString()));

                                }
                                catch (Exception)
                                {

                                    return "A|El valor " + worksheet.Cells[row, 12].Value.ToString() + " de la columna fecha inicio no es una fecha válida (línea " + row.ToString() + ").";
                                }


                                act.FechaInicio = FechaInicio;

                                DateTime FechaSolicitado;
                                var valors = worksheet.Cells[row, 13].Value;

                                try
                                {
                                    FechaSolicitado = DateTime.Parse((valors.ToString()));

                                }
                                catch (Exception)
                                {

                                    return "A|El valor " + worksheet.Cells[row, 13].Value.ToString() + " de la columna fecha fin no es una fecha válida (línea " + row.ToString() + ").";
                                }

                                act.FechaSolicitado = FechaSolicitado;



                                LstActividades.Add(act);

                            }

                        }
                    }

                }


                return string.Empty;

            }
            catch (Exception)
            {
                return "A|Error al leer el documento, por favor verifique que el documento es el correcto.";


            }
        }


        private string LeeArchivoActualizacion(HttpPostedFileBase ProcesaArchivo, ref List<ActividadesModel> LstActividades)
        {
            try
            {


                using (var package = new ExcelPackage(ProcesaArchivo.InputStream))
                {

                    ExcelWorksheet worksheet = package.Workbook.Worksheets[1];


                    ExcelCellAddress startCell = worksheet.Dimension.Start;
                    ExcelCellAddress endCell = worksheet.Dimension.End;


                    ActividadesModel act;
                    for (int row = startCell.Row + 1; row <= endCell.Row; row++)
                    {
                        act = new ActividadesModel();

                        object val = worksheet.Cells[row, 1].Value;
                        if (val != null)
                        {

                            if (worksheet.Cells[row, 3].Value.ToString().Trim().ToUpper() != "M")
                            {

                                act.IdActividad = int.Parse(worksheet.Cells[row, 1].Value.ToString().Trim().Replace(" ", ""));
                                act.TipoNombre = worksheet.Cells[row, 2].Value.ToString().Trim();
                                act.BR = worksheet.Cells[row, 3].Value.ToString().Trim().ToUpper();
                                act.Sprint = worksheet.Cells[row, 4].Value == null ? "" : worksheet.Cells[row, 4].Value.ToString().ToUpper();
                                act.ResponsableStr = worksheet.Cells[row, 5].Value == null ? "" : worksheet.Cells[row, 5].Value.ToString().Trim().ToUpper();
                                act.TipoActividadStr = worksheet.Cells[row, 6].Value == null ? "" : worksheet.Cells[row, 6].Value.ToString().Trim().ToUpper();
                                act.ClasificacionStr = worksheet.Cells[row, 7].Value == null ? "" : worksheet.Cells[row, 7].Value.ToString().Trim().ToUpper();


                                decimal horasf = 0;

                                bool validahoraf = decimal.TryParse(worksheet.Cells[row, 8].Value.ToString(), out horasf);

                                if (!validahoraf)
                                {

                                    return "A|El valor " + worksheet.Cells[row, 8].Value.ToString() + " de la columna horas facturadas no es un dato númerico válido (línea " + row.ToString() + ").";
                                }

                                act.HorasFacturables = horasf;


                                decimal horas = 0;

                                bool validahora = decimal.TryParse(worksheet.Cells[row, 9].Value.ToString(), out horas);

                                if (!validahora)
                                {

                                    return "A|El valor " + worksheet.Cells[row, 9].Value.ToString() + " de la columna horas planeadas no es un dato númerico válido (línea " + row.ToString() + ").";
                                }

                                act.HorasAsignadas = horas;

                                //DateTime FechaInicio;
                                //var valor = worksheet.Cells[row, 11].Value;

                                //try
                                //{
                                //    FechaInicio = DateTime.Parse((valor.ToString()));

                                //}
                                //catch (Exception)
                                //{

                                //    return "A|El valor " + worksheet.Cells[row, 11].Value.ToString() + " de la columna fecha inicio no es una fecha válida (línea " + row.ToString() + ").";
                                //}


                                //act.FechaInicio = FechaInicio;

                                //DateTime FechaSolicitado;
                                //var valors = worksheet.Cells[row, 12].Value;

                                //try
                                //{
                                //    FechaSolicitado = DateTime.Parse((valors.ToString()));

                                //}
                                //catch (Exception)
                                //{

                                //    return "A|El valor " + worksheet.Cells[row, 12].Value.ToString() + " de la columna fecha fin no es una fecha válida (línea " + row.ToString() + ").";
                                //}

                                //act.FechaSolicitado = FechaSolicitado;



                                DateTime? FechaInicio = null;
                                var valor = worksheet.Cells[row, 10].Value;

                                if (valor != null)
                                {

                                    try
                                    {
                                        FechaInicio = DateTime.Parse((valor.ToString()));

                                    }
                                    catch (Exception)
                                    {

                                        return "A|El valor " + worksheet.Cells[row, 10].Value.ToString() + " de la columna fecha inicio no es una fecha válida (línea " + row.ToString() + ").";
                                    }

                                }


                                act.FechaInicio = FechaInicio;

                                DateTime? FechaSolicitado = null;
                                var valors = worksheet.Cells[row, 11].Value;

                                if (worksheet.Cells[row, 11].Value != null)
                                {
                                    try
                                    {
                                        FechaSolicitado = DateTime.Parse((valors.ToString()));

                                    }
                                    catch (Exception)
                                    {

                                        return "A|El valor " + worksheet.Cells[row, 11].Value.ToString() + " de la columna fecha fin no es una fecha válida (línea " + row.ToString() + ").";
                                    }

                                }



                                act.FechaSolicitado = FechaSolicitado;



                                LstActividades.Add(act);

                            }

                        }
                    }

                }


                return string.Empty;

            }
            catch (Exception)
            {
                return "A|Error al leer el documento, por favor verifique que el documento es el correcto.";


            }
        }


        public ActionResult ObtieneValidaciones(long IdActividad)
        {
            var resultado = new JObject();
            try
            {
                CD_Actividad cd_act = new CD_Actividad();
                var IdUsuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.IdUsuario;
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                List<ActividadesValidacionModel> LstActValidacion = cd_act.ConsultaValidaciones(IdActividad, IdUsuario, Conexion);

                resultado["Exito"] = true;
                resultado["Validaciones"] = JsonConvert.SerializeObject(LstActValidacion);

                return Content(resultado.ToString());


            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

                return Content(resultado.ToString());
            }
        }

        public ActionResult ValidaRechazaActividad(ActividadesValidacionModel Actividad)
        {
            var resultado = new JObject();
            try
            {
                string[] Mensaje = null;
                CD_Actividad cd_actividad = new CD_Actividad();
                var IdUsuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.IdUsuario;
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                string Conexion = Encripta.DesencriptaDatos(Usuario.ConexionEF);

                Mensaje = cd_actividad.ValidaRechazaActividad(Actividad, IdUsuario, Conexion);

                if (Mensaje[2] == "X")
                {
                    string ConexionSp = Encripta.DesencriptaDatos(Usuario.ConexionSP);
                    var Act = cd_actividad.ConsultaActividad(Actividad.IdActividad, Usuario.IdUsuario, ConexionSp);
                    var exito = FuncionesGenerales.EnviarCorreoRechazarActividad(Actividad.IdActividad, Act, Conexion);
                }

                resultado["Exito"] = Mensaje[0] == "0" ? false : true;
                resultado["Mensaje"] = Mensaje[1];



                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

                return Content(resultado.ToString());
            }
        }

        public ActionResult InicializaRechazo()
        {

            var resultado = new JObject();
            try
            {
                CD_CatalogoGeneral cd_CatGenral = new CD_CatalogoGeneral();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                List<CatalogoGeneralModel> LstTipoRechazo = cd_CatGenral.ObtenerCatalogoGeneral(1, Conexion);


                resultado["Exito"] = true;
                resultado["TipoRechazo"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(LstTipoRechazo);

                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

                return Content(resultado.ToString());
            }
        }

        public ActionResult ValidacionMasiva(string Actividades)
        {

            var resultado = new JObject();
            try
            {
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;


                if (Usuario.LstAurotizaciones.Where(w => w.IdAutorizacion == 1).FirstOrDefault() == null)
                {
                    resultado["Exito"] = false;
                    resultado["Mensaje"] = "No tiene autorización para válidar actividades.";
                }

                //string conexion = ConfigurationManager.ConnectionStrings["BDProductividad"].ToString();
                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);




                CD_Actividad cd_act = new CD_Actividad();

                bool Exito = cd_act.ValidacionMasiva(Actividades, Usuario.IdUsuario, conexion);

                resultado["Exito"] = true;
                resultado["Mensaje"] = "Se realizó la validación de las actividades correctamente.";

                return Content(resultado.ToString());


            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

                return Content(resultado.ToString());
            }
        }
        public ActionResult LiberacionMasiva(string Actividades)
        {

            var resultado = new JObject();
            try
            {
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                if (Usuario.LstAurotizaciones.Where(w => w.IdAutorizacion == 2).FirstOrDefault() == null)
                {
                    resultado["Exito"] = false;
                    resultado["Mensaje"] = "No tiene autorización para liberar actividades.";
                }


                //string conexion = ConfigurationManager.ConnectionStrings["BDProductividad"].ToString();
                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);

                CD_Actividad cd_act = new CD_Actividad();

                bool Exito = cd_act.LiberacionMasiva(Actividades, Usuario.IdUsuario, conexion);

                resultado["Exito"] = true;
                resultado["Mensaje"] = "Se realizó la liberación de las actividades correctamente.";

                return Content(resultado.ToString());


            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

                return Content(resultado.ToString());
            }
        }
        public ActionResult CancelacionMasiva(string Actividades)
        {

            var resultado = new JObject();
            try
            {
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                if (!FuncionesGenerales.ValidaPermisos(4))
                {
                    resultado["Exito"] = false;
                    resultado["Mensaje"] = "No tiene permiso para cancelar actividades.";
                    return Content(resultado.ToString());
                }


                //string conexion = ConfigurationManager.ConnectionStrings["BDProductividad"].ToString();
                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);

                CD_Actividad cd_act = new CD_Actividad();

                bool Exito = cd_act.CancelacionMasiva(Actividades, Usuario.IdUsuario, conexion);

                resultado["Exito"] = true;
                resultado["Mensaje"] = "Se realizó la cancelación de las actividades correctamente.";

                return Content(resultado.ToString());


            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

                return Content(resultado.ToString());
            }
        }

        public ActionResult AsignacionSprintMasiva(string Actividades, long IdIteracion)
        {

            var resultado = new JObject();
            try
            {
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;



                //string conexion = ConfigurationManager.ConnectionStrings["BDProductividad"].ToString();
                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);

                CD_Actividad cd_act = new CD_Actividad();

                bool Exito = cd_act.AsignacionSprintMasiva(Actividades,IdIteracion, Usuario.IdUsuario, conexion);

                resultado["Exito"] = true;
                resultado["Mensaje"] = "Se realizó la asignación al sprint.";

                return Content(resultado.ToString());


            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

                return Content(resultado.ToString());
            }
        }


        public ActionResult CambiaEstatus(long IdActividad, string Estatus)
        {
            var resultado = new JObject();
            try
            {

                CD_Actividad cdact = new CD_Actividad();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                string Conexion = Encripta.DesencriptaDatos(Usuario.ConexionEF);

                string Accion = string.Empty;
                switch (Estatus)
                {

                    case "A":
                        Accion = "Actualizó el estatus a Abierto";
                        break;
                    case "P":
                        Accion = "Actualizó el estatus a Progreso";
                        break;
                    case "V":
                        Accion = "Actualizó el estatus a Validación";
                        break;
                    case "R":
                        Accion = "Actualizó el estatus a Revisión";
                        break;
                    case "X":
                        Accion = "Actualizó el estatus a Rechazado";
                        break;
                    case "L":
                        Accion = "Actualizó el estatus a Liberado";
                        break;


                }
                string ConexionSp = Encripta.DesencriptaDatos(Usuario.ConexionSP);

                var Actividad = cdact.ConsultaActividad(IdActividad, Usuario.IdUsuario, ConexionSp);


                if ((Actividad.TipoId == 1 || Actividad.TipoId == 7) && (Estatus == "R" && Estatus == "V"  && Estatus== "L" )  ) {

                    if (Actividad.HorasFinales == 0)
                    {

                        resultado["Exito"] = false;
                        resultado["Mensaje"] = "Para liberar la actividad debe ingresar las horas utilizadas.";
                        return Content(resultado.ToString());

                    }
                }

                bool Exito = cdact.CambiaEstatusActividad(Estatus, Accion, IdActividad, Usuario.IdUsuario, Conexion);


                if(Estatus == "L" &&  Usuario.IdTipoUsuario ==19)
                {
                    
             

                    bool Envio = FuncionesGenerales.EnviarCorreoLiberaActividad(Actividad, Usuario, Conexion);

                }

                resultado["Exito"] = Exito;
                resultado["Mensaje"] = Exito == false ? "Ocurrio un error al actualizar la actividad" : "";

            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
                throw ex;
            }
            return Content(resultado.ToString());
        }

        //public ActionResult GuardaActividadRelacionada(ActividadesModel Act)
        //{
        //    var resultado = new JObject();
        //    try
        //    {

        //        CD_Actividad cdact = new CD_Actividad();
        //        var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
        //        List<ActividadesModel> LstRelacionadas = new List<ActividadesModel>();
        //        bool Exito = cdact.InsertarActividadDependencia(Act, ref LstRelacionadas, Encripta.DesencriptaDatos(Usuario.ConexionEF));


        //        resultado["Exito"] = Exito;
        //        resultado["LstRelacionadas"] = JsonConvert.SerializeObject(LstRelacionadas);
        //        resultado["Mensaje"] = Exito == false ? "Ocurrio un error al actualizar la actividad" : "";

        //    }
        //    catch (Exception ex)
        //    {
        //        resultado["Exito"] = false;
        //        resultado["Mensaje"] = ex.Message;
        //        throw ex;
        //    }
        //    return Content(resultado.ToString());

        //}

        //public ActionResult EliminaActividadRelacionada(long IdActividadDependencia)
        //{
        //    var resultado = new JObject();
        //    try
        //    {

        //        CD_Actividad cdact = new CD_Actividad();
        //        var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
        //        List<ActividadesModel> LstRelacionadas = new List<ActividadesModel>();
        //        bool Exito = cdact.EliminarActividadDependencia(IdActividadDependencia, ref LstRelacionadas, Encripta.DesencriptaDatos(Usuario.ConexionEF));


        //        resultado["Exito"] = Exito;
        //        resultado["LstRelacionadas"] = JsonConvert.SerializeObject(LstRelacionadas);
        //        resultado["Mensaje"] = Exito == false ? "Ocurrio un error al actualizar la actividad o la actividad es de Revisión" : "";

        //    }
        //    catch (Exception ex)
        //    {
        //        resultado["Exito"] = false;
        //        resultado["Mensaje"] = ex.Message;
        //        throw ex;
        //    }
        //    return Content(resultado.ToString());

        //}

        public ActionResult ConsultaActividadesTerminadasDia(FiltrosModel Filtro) {
            var resultado = new JObject();
            try
            {

                CD_Actividad cdact = new CD_Actividad();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                List<ActividadesModel> LstActividades = new List<ActividadesModel>();

                LstActividades = cdact.ConsultaActividadesTerminadasDia(Filtro, Encripta.DesencriptaDatos(Usuario.ConexionSP));

                resultado["Exito"] = true;
                resultado["LstActividades"] = JsonConvert.SerializeObject(LstActividades);

                resultado["Total"] = LstActividades.Count();
                resultado["Horas"] = LstActividades.Sum(s => s.HorasAsignadas);

            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = "Error al consultar la información. " + ex.Message ;
                return Content(resultado.ToString());
            }

            return Content(resultado.ToString());
        }
        public ActionResult ConsultaActividadesDia(DateTime Fecha, long IdUsuario)
        {
            var resultado = new JObject();
            try
            {

                CD_Actividad cdact = new CD_Actividad();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                List<ActividadesModel> LstActividades = new List<ActividadesModel>();

     

                LstActividades = cdact.ConsultaActividadesDia(Fecha, IdUsuario, Encripta.DesencriptaDatos(Usuario.ConexionSP));

                resultado["Exito"] = true;
                resultado["LstActividades"] = JsonConvert.SerializeObject(LstActividades);

            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = "Error al consultar la información. " + ex.Message;
                return Content(resultado.ToString());
            }

            return Content(resultado.ToString());
        }

        public ActionResult ConsultaTiemposCapturadosDia(FiltrosModel Filtro)
        {
            var resultado = new JObject();
            try
            {

                CD_Actividad cdact = new CD_Actividad();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                List<ActividadesModel> LstActividades = new List<ActividadesModel>();

                LstActividades = cdact.ConsultaTiemposCapturadosDia(Filtro, Encripta.DesencriptaDatos(Usuario.ConexionSP));

                resultado["Exito"] = true;
                resultado["LstActividades"] = JsonConvert.SerializeObject(LstActividades);
                resultado["Total"] = LstActividades.Count() ;
                resultado["Horas"] = LstActividades.Sum(s=> s.HorasAsignadas);

            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = "Error al consultar la información. " + ex.Message;
                return Content(resultado.ToString());
            }

            return Content(resultado.ToString());
        }

        public ActionResult ConsultaTiemposTrabajadoDia(FiltrosModel Filtro)
        {
            var resultado = new JObject();
            try
            {

                CD_Actividad cdact = new CD_Actividad();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                List<ActividadesModel> LstActividades = new List<ActividadesModel>();

                LstActividades = cdact.ConsultaTiemposTrabajadoDia(Filtro, Encripta.DesencriptaDatos(Usuario.ConexionSP));

                resultado["Exito"] = true;
                resultado["LstActividades"] = JsonConvert.SerializeObject(LstActividades);
                resultado["Total"] = LstActividades.Count();
                resultado["Horas"] = LstActividades.Sum(s => s.HorasAsignadas);


            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = "Error al consultar la información. " + ex.Message;
                return Content(resultado.ToString());
            }

            return Content(resultado.ToString());
        }


        public ActionResult ConsultaTiemposCapturadosDiaUsuario(DateTime Fecha, long IdUsuario)
        {
            var resultado = new JObject();
            try
            {

                CD_Actividad cdact = new CD_Actividad();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                List<ActividadesModel> LstActividades = new List<ActividadesModel>();

                FiltrosModel Filtro = new FiltrosModel();
                Filtro.Anio = Fecha.Year;
                Filtro.Mes = Fecha.Month;
                Filtro.Dia = Fecha.Day;
                Filtro.IdUsuarioReporte = IdUsuario;

                LstActividades = cdact.ConsultaTiemposCapturadosDia(Filtro, Encripta.DesencriptaDatos(Usuario.ConexionSP));

                resultado["Exito"] = true;
                resultado["LstActividades"] = JsonConvert.SerializeObject(LstActividades);

            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = "Error al consultar la información. " + ex.Message;
                return Content(resultado.ToString());
            }

            return Content(resultado.ToString());
        }


        #endregion

        #region ActividadTrabajo

        public ActionResult ConsultaTrabajos(long IdActividad)
        {
            var resultado = new JObject();
            try
            {
                List<ActividadTrabajoModel> LstTrabajos = new List<ActividadTrabajoModel>();
                CD_Actividad cd_act = new CD_Actividad();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                LstTrabajos = cd_act.ConsultarTrabajos(IdActividad, Conexion);

                resultado["Exito"] = true;
                resultado["LstTrabajos"] = JsonConvert.SerializeObject(LstTrabajos);

            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

            }
            return Content(resultado.ToString());
        }
        public ActionResult GuardaTrabajo(ActividadTrabajoModel Trabajo)
        {
            var resultado = new JObject();
            try
            {

                CD_Actividad cd_act = new CD_Actividad();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                if (Trabajo.Tiempo < 0)
                {
                    resultado["Exito"] = false;
                    resultado["Mensaje"] = "No se pueden registrar tiempos negativos";
                    return Content(resultado.ToString());
                }




                Trabajo.IdUsuarioRegistro = Usuario.IdUsuario;

                int Respuesta = cd_act.RegistrarTrabajo(Trabajo, Conexion);

                if (Respuesta == 2)
                {

                    resultado["Exito"] = false;
                    resultado["Mensaje"] = "Solo se pueden registrar trabajos a actividades con estatus 'Pendiente'.";

                }
                else
                {
                    resultado["Exito"] = true;
                }


            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

            }
            return Content(resultado.ToString());
        }

        public ActionResult EliminaTrabajo(long IdActividadTrabajo)
        {
            var resultado = new JObject();
            try
            {

                CD_Actividad cd_act = new CD_Actividad();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                int Respuesta = cd_act.EliminarTrabajo(IdActividadTrabajo, Conexion);

                if (Respuesta == 2)
                {

                    resultado["Exito"] = false;
                    resultado["Mensaje"] = "Solo se pueden eliminar trabajos a actividades con estatus 'Asignada' ó 'Pendiente'.";

                }
                else
                {
                    resultado["Exito"] = true;
                }



            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

            }
            return Content(resultado.ToString());
        }

        #endregion

        #region ActividadTracking
   
        public ActionResult Tracking(long Id)
        {
            ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
            Session["Controlador" + Session.SessionID] = "Actividades";
            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }



            ViewBag.IdActividad = Id;
            List<ActividadTrackingModel> LstTracking = new List<ActividadTrackingModel>();
            CD_Actividad cd_act = new CD_Actividad();
            ActividadesModel actividad = new ActividadesModel();
            var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

            string conexion = Encripta.DesencriptaDatos(Usuario.ConexionSP);
            //string conexion = ConfigurationManager.ConnectionStrings["BDProductividad"].ToString();
            string Con = Encripta.DesencriptaDatos(Usuario.ConexionEF);
            LstTracking = cd_act.ConsultaTrackingActividad(Id, conexion);
            actividad = cd_act.ConsultaActividad(Id, Usuario.IdUsuario, conexion);

            ViewBag.Actividad = actividad;
            return View(LstTracking);

        }

        public ActionResult GuardarTracking(ActividadTrackingModel Tracking)
        {
            var resultado = new JObject();
            try
            {
                CD_Actividad cd_act = new CD_Actividad();
                //string conexion = ConfigurationManager.ConnectionStrings["BDProductividad"].ToString();
                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
                Tracking.IdUsuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.IdUsuario;
                Tracking.Trabajado = TimeSpan.Parse(Tracking.strTrabajado);
                int respuesta = cd_act.ActualizaTiempoTrabajo(Tracking, conexion);

                resultado["Exito"] = true;
                resultado["Mensaje"] = Mensajes.MensajeGuardadoExito();

            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

            }
            return Content(resultado.ToString());
        }

        #endregion

        #region ActividadTamaños

        public ActionResult CargaInicialTamanos(long IdActividad)
        {
            var resultado = new JObject();
            try
            {
                CD_CatalogoGeneral cd_CatGenral = new CD_CatalogoGeneral();
                CD_Actividad cd_act = new CD_Actividad();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                List<CatalogoGeneralModel> LstTipoParte = cd_CatGenral.ObtenerCatalogoGeneral(10, Conexion);
                string Descripcion = cd_act.ConsultaDescripcionActividad(IdActividad, Conexion);

                resultado["Exito"] = true;
                resultado["Descripcion"] = Descripcion;
                resultado["LstTipoParte"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(LstTipoParte);

                return Content(resultado.ToString());
            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
                return Content(resultado.ToString());
            }


        }

        public ActionResult ConsultaListaTamanos(long IdActividad)
        {

            var resultado = new JObject();
            try
            {


                CD_Actividad cd_Act = new CD_Actividad();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                List<ActividadTamanoModel> LstActividaTamano = cd_Act.ConsultarTamanosActividad(IdActividad, Conexion);

                resultado["Exito"] = true;
                resultado["LstActividaTamano"] = JsonConvert.SerializeObject(LstActividaTamano);


                return Content(resultado.ToString());



            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
                return Content(resultado.ToString());
            }

        }

        public ActionResult GuardarTamano(ActividadTamanoModel actividadtamano)
        {
            var resultado = new JObject();
            try
            {

                var IdUsuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.IdUsuario;
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                actividadtamano.IdUMod = IdUsuario;

                CD_Actividad cd_act = new CD_Actividad();

                int Exito = cd_act.GuardaTamanoActividad(actividadtamano, Conexion);

                resultado["Exito"] = true;
                resultado["Mensaje"] = "Los datos se guardaron correctamente.";

                return Content(resultado.ToString());
            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
                return Content(resultado.ToString());
            }

        }

        public ActionResult EliminarTamano(long IdActividadTamano)
        {
            var resultado = new JObject();
            try
            {


                CD_Actividad cd_act = new CD_Actividad();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                int Exito = cd_act.EliminaTamanoActividad(IdActividadTamano, Conexion);

                resultado["Exito"] = true;
                resultado["Mensaje"] = "Se eliminó el registro correctamente.";

                return Content(resultado.ToString());
            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
                return Content(resultado.ToString());
            }

        }


        #endregion

        #region ActividadComentarios

        public ActionResult GuardarComentario(ActividadComentarioModel Comentario)
        {
            var resultado = new JObject();
            try
            {
                CD_Actividad cd_act = new CD_Actividad();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                List<ActividadComentarioModel> LstComentarios = new List<ActividadComentarioModel>();
                Comentario.IdUsuario = Usuario.IdUsuario;

                LstComentarios = cd_act.GuardaComentario(Comentario, Conexion);
                string Comentarios = FuncionesGenerales.ConvierteListaComentarios(LstComentarios);

                if(Usuario.IdTipoUsuario == 19)
                {

                    string ConexionSp = Encripta.DesencriptaDatos(Usuario.ConexionSP);
                    var Actividad = cd_act.ConsultaActividad(Comentario.IdActividad, Usuario.IdUsuario, ConexionSp);

                    bool Envio = FuncionesGenerales.EnviarCorreoComentario(Actividad, Usuario,Comentario.Comentario, Conexion);


                }


                resultado["Exito"] = true;
                resultado["Mensaje"] = "Los datos se guardaron correctamente.";
                resultado["LstComentarios"] = Comentarios;
            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
            }
            return Content(resultado.ToString());
        }
        #endregion

        #region ActividadArchivo

        public ActionResult GuardarArchivo(long IdActividad)
        {
            bool isSavedSuccessfully = true;
            string urlcompleta = "";

            try
            {
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                CD_Actividad cd_act = new CD_Actividad();

                foreach (string fileName in Request.Files)
                {
                    HttpPostedFileBase file = Request.Files[fileName];

                    if (file != null && file.ContentLength > 0)
                {
                    var originalDirectory = new DirectoryInfo(string.Format("{0}Archivos\\Documentos", Server.MapPath(@"~/")));

                    string pathString = System.IO.Path.Combine(originalDirectory.ToString(), IdActividad.ToString());
                    var extencionArchivo = Path.GetFileName(file.FileName).Split('.').LastOrDefault();

                    bool isExists = System.IO.Directory.Exists(pathString);

                    if (!isExists)
                        System.IO.Directory.CreateDirectory(pathString);

                    var path = string.Format("{0}\\{1}", pathString, Path.GetFileName(file.FileName).Substring(0, file.FileName.LastIndexOf(".")) + "." + extencionArchivo);
                    urlcompleta = ConfigurationManager.AppSettings["UrlSistema"] + "Archivos/Documentos/" + IdActividad.ToString() + "/" + file.FileName;
                    file.SaveAs(path);


                    ActividadArchivoModel archivo = new ActividadArchivoModel();
                    archivo.IdActividad = IdActividad;
                    archivo.IdUCreo = Usuario.IdUsuario;
                    archivo.Nombre = file.FileName;
                    archivo.Extension = extencionArchivo;
                    archivo.Url = urlcompleta;

                    string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                    int exito = cd_act.GuardaArchivo(archivo, Conexion);
                }





                }

            }
            catch (Exception)
            {
                isSavedSuccessfully = false;
            }

            var resultado = "";
            if (isSavedSuccessfully)
            {

                resultado = "1";

                return Content(resultado.ToString());
            }
            else
            {
                resultado = "1";

                return Content(resultado.ToString());
            }

        }
        public ActionResult GuardarArchivoV2(long IdActividad , HttpPostedFileBase file)
        {
            bool isSavedSuccessfully = true;
            string urlcompleta = "";
            var resultado = "";
            try
            {
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                CD_Actividad cd_act = new CD_Actividad();


                //HttpPostedFileBase file = Request.Files[fileName];

                if (file != null && file.ContentLength > 0)
                {
                    var originalDirectory = new DirectoryInfo(string.Format("{0}Archivos\\Documentos", Server.MapPath(@"~/")));

                    string pathString = System.IO.Path.Combine(originalDirectory.ToString(), IdActividad.ToString());
                    var extencionArchivo = Path.GetFileName(file.FileName).Split('.').LastOrDefault();

                    if (extencionArchivo.ToLower() == "exe" || extencionArchivo.ToLower() == "bat" || extencionArchivo.ToLower() == "" || extencionArchivo.ToLower() == null || extencionArchivo.ToLower() == "shs") {

                        resultado = "99";

                        return Content(resultado.ToString());
                    }
                

                    bool isExists = System.IO.Directory.Exists(pathString);

                    if (!isExists)
                        System.IO.Directory.CreateDirectory(pathString);

                    var path = string.Format("{0}\\{1}", pathString, Path.GetFileName(file.FileName).Substring(0, file.FileName.LastIndexOf(".")) + "." + extencionArchivo);
                    urlcompleta = ConfigurationManager.AppSettings["UrlSistema"] + "Archivos/Documentos/" + IdActividad.ToString() + "/" + file.FileName;
                    file.SaveAs(path);


                    ActividadArchivoModel archivo = new ActividadArchivoModel();
                    archivo.IdActividad = IdActividad;
                    archivo.IdUCreo = Usuario.IdUsuario;
                    archivo.Nombre = file.FileName;
                    archivo.Extension = extencionArchivo;
                    archivo.Url = urlcompleta;

                    string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                    int exito = cd_act.GuardaArchivo(archivo, Conexion);
                }


                //foreach (string fileName in Request.Files)
                //{
                

                //}

            }
            catch (Exception)
            {
                isSavedSuccessfully = false;
            }

        
            if (isSavedSuccessfully)
            {

                resultado = "1";

                return Content(resultado.ToString());
            }
            else
            {
                resultado = "1";

                return Content(resultado.ToString());
            }

        }

        public ActionResult EliminarArchivo(ActividadArchivoModel Archivo)
        {
            var resultado = new JObject();
            try
            {
                CD_Actividad cd_act = new CD_Actividad();
                var originalDirectory = new DirectoryInfo(string.Format("{0}Archivos\\Documentos", Server.MapPath(@"~/")));

                string pathString = System.IO.Path.Combine(originalDirectory.ToString(), Archivo.IdActividad.ToString());
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                int Exito = cd_act.EliminaArchivo(Archivo, Conexion);

                var path2 = string.Format("{0}\\{1}", pathString, Archivo.Nombre);

                if (System.IO.File.Exists(path2))
                {
                    System.IO.File.Delete(path2);
                }

                resultado["Exito"] = true;

            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
            }
            return Content(resultado.ToString());
        }


        public ActionResult EliminarAttachmentActividad(long Id)
        {
            var resultado = new JObject();
            try
            {
                CD_Actividad cd_act = new CD_Actividad();
                //var Usuario = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                if (Usuario.IdTipoUsuario == 19)
                {

                    resultado["Exito"] = false;
                    resultado["Mensaje"] = "No tiene permisos para eliminar el adjunto";
                    return Content(resultado.ToString());

                }


                var Archivo = cd_act.EliminaArchivoV2(Id, Encripta.DesencriptaDatos( Usuario.ConexionEF));


                var originalDirectory = new DirectoryInfo(string.Format("{0}Archivos\\Documentos", Server.MapPath(@"~/")));

                string pathString = System.IO.Path.Combine(originalDirectory.ToString(), Archivo.IdActividad.ToString());
           

                var path2 = string.Format("{0}\\{1}", pathString, Archivo.Nombre);

                if (System.IO.File.Exists(path2))
                {
                    System.IO.File.Delete(path2);
                }

                resultado["Exito"] = true;

            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
            }
            return Content(resultado.ToString());
        }


        #endregion

        #region ActividadDefecto 

        public ActionResult GuardarDefecto(ActividadDefectoModel Defecto)
        {
            var resultado = new JObject();
            try
            {
                CD_Actividad cd_act = new CD_Actividad();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                Defecto.Tiempo = TimeSpan.Parse(Defecto.TiempoStr);

                Defecto.IdUCreo = Usuario.IdUsuario;

                int Exito = cd_act.GuardarActividadDefecto(Defecto, Conexion);

                resultado["Exito"] = true;
                resultado["Mensaje"] = "Los datos se guardaron correctamente.";

            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
            }
            return Content(resultado.ToString());
        }

        public ActionResult CargaInicialDefecto(long IdActividad)
        {
            var resultado = new JObject();
            try
            {
                CD_CatalogoGeneral cd_CatGenral = new CD_CatalogoGeneral();
                CD_Actividad cd_act = new CD_Actividad();

                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                List<CatalogoGeneralModel> LstTipoDef = cd_CatGenral.ObtenerCatalogoGeneral(11, Conexion);
                List<CatalogoGeneralModel> LstFases = cd_act.ConsultaFasesActividad(IdActividad, Conexion);

                resultado["Exito"] = true;
                resultado["Mensaje"] = "Los datos se guardaron correctamente.";
                resultado["LstTipoDef"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(LstTipoDef);
                resultado["LstFases"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(LstFases);

            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
            }
            return Content(resultado.ToString());
        }

        #endregion

        #region Bugs
        public ActionResult Bugs()
        {
            Session["Controlador" + Session.SessionID] = "Actividades";
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

        public ActionResult LeerActividadesQA(long idProyecto)
        {
            try
            {
                var actividades = cd_CatGeneral.ObtenerActividadesQA(idProyecto, conexionEF);

                return Json(new { Exito = true, CmbActividades = FuncionesGenerales.ConvierteCatalogoGeneralHtmlComboxAgrupado(actividades) });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult LeerRequerimientoActividad(long idActividad)
        {
            try
            {
                var br = cd_CatGeneral.LeerRequerimientoActividad(idActividad, conexionEF);

                return Json(new { Exito = true, BR = br });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult LeerBugs(FiltrosModel filtros)
        {
            try
            {
                if (!FuncionesGenerales.ValidaRango(filtros.Actividades))
                    return Json(new { Exito = false, Mensaje = "El criterio de filtro ingresado en el campo No. Actividad no es válido" });

              var user=  ((Models.Sesion)Session["Usuario" + Session.SessionID])?.Usuario;

                filtros.IdUsuario = user.IdUsuario;
                var actividades= cd_Actividad.LeerBugs(filtros, usuario, conexionSP);

                var actividadesParaValidar = actividades.Where(w => w.Estatus == "R").ToList();
                var actividadesParaLiberar = actividades.Where(w => w.Estatus == "V").ToList();


                string ActividadesA = FuncionesGenerales.ConvierteListaTareasV2(actividades, "A");
                string ActividadesP = FuncionesGenerales.ConvierteListaTareasV2(actividades, "P");
                string ActividadesR = FuncionesGenerales.ConvierteListaTareasV2(actividades, "V");
                ActividadesR += FuncionesGenerales.ConvierteListaTareasV2(actividades, "R");
                string ActividadesX = FuncionesGenerales.ConvierteListaTareasV2(actividades, "X");
                string ActividadesL = FuncionesGenerales.ConvierteListaTareasV2(actividades, "L");


                return new JsonResult
                {
                    Data = new
                    {
                        Exito = true,
                        Actividades = actividades,
                        ActividadesV = actividadesParaValidar,
                        ActividadesL = actividadesParaLiberar,
                        ActividadesLog = new List<ActividadesModel>(),
                        TotalHoras = actividades.Sum(x => x.HorasAsignadas).ToString(),
                        Total = actividades.Count,
                        TotalV = actividadesParaValidar.Count,
                        TotalL = actividadesParaLiberar.Count,
                        Valida = usuario.LstAurotizaciones.Where(x => x.IdAutorizacion == 1).FirstOrDefault() != null,
                        Libera = usuario.LstAurotizaciones.Where(x => x.IdAutorizacion == 1).FirstOrDefault() != null,
                        TotalAbiertas = actividades.Where(w => w.Estatus == "A").Count(),
                        TotalProgreso = actividades.Where(w => w.Estatus == "P").Count(),
                        TotalValidacion = actividades.Where(w => w.Estatus == "V" || w.Estatus == "R").Count(),
                        TotalRechazadas = actividades.Where(w => w.Estatus == "X").Count(),
                        TotalLiberadas = actividades.Where(w => w.Estatus == "L").Count(),
                        ActividadesA = ActividadesA,
                        ActividadesP = ActividadesP,
                        ActividadesR = ActividadesR,
                        ActividadesX = ActividadesX,
                        ActividadesLi = ActividadesL
            },
                    MaxJsonLength = int.MaxValue
                };
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }


        }


        public ActionResult LeerBugsv2(FiltrosModel filtros)
        {
            try
            {


                CD_Calidad cd_c = new CD_Calidad();
                List<ActividadesModel> actividades = new List<ActividadesModel>();
                List<GraficaConsultaModel> LstGraficas = new List<GraficaConsultaModel>();

                var user = ((Models.Sesion)Session["Usuario" + Session.SessionID])?.Usuario;
                cd_c.LeerBugsV2(ref actividades, ref LstGraficas, filtros, usuario, conexionSP);

                //filtros.IdUsuario = user.IdUsuario;
                //var actividades = cd_Actividad.LeerBugs(filtros, usuario, conexionSP);

                var actividadesParaValidar = actividades.Where(w => w.Estatus == "R").ToList();
                var actividadesParaLiberar = actividades.Where(w => w.Estatus == "V").ToList();


                string ActividadesA = FuncionesGenerales.ConvierteListaTareasV2(actividades, "A");
                string ActividadesP = FuncionesGenerales.ConvierteListaTareasV2(actividades, "P");
                string ActividadesR = FuncionesGenerales.ConvierteListaTareasV2(actividades, "V");
                ActividadesR += FuncionesGenerales.ConvierteListaTareasV2(actividades, "R");
                string ActividadesX = FuncionesGenerales.ConvierteListaTareasV2(actividades, "X");
                string ActividadesL = FuncionesGenerales.ConvierteListaTareasV2(actividades, "L");


                return new JsonResult
                {
                    Data = new
                    {
                        Exito = true,
                        Actividades = actividades,
                        ActividadesV = actividadesParaValidar,
                        ActividadesL = actividadesParaLiberar,
                        ActividadesLog = new List<ActividadesModel>(),
                        TotalHoras = actividades.Sum(x => x.HorasAsignadas).ToString(),
                        Total = actividades.Count,
                        TotalV = actividadesParaValidar.Count,
                        TotalL = actividadesParaLiberar.Count,
                        Valida = usuario.LstAurotizaciones.Where(x => x.IdAutorizacion == 1).FirstOrDefault() != null,
                        Libera = usuario.LstAurotizaciones.Where(x => x.IdAutorizacion == 1).FirstOrDefault() != null,
                        TotalAbiertas = actividades.Where(w => w.Estatus == "A").Count(),
                        TotalProgreso = actividades.Where(w => w.Estatus == "P").Count(),
                        TotalValidacion = actividades.Where(w => w.Estatus == "V" || w.Estatus == "R").Count(),
                        TotalRechazadas = actividades.Where(w => w.Estatus == "X").Count(),
                        TotalLiberadas = actividades.Where(w => w.Estatus == "L").Count(),
                        ActividadesA = ActividadesA,
                        ActividadesP = ActividadesP,
                        ActividadesR = ActividadesR,
                        ActividadesX = ActividadesX,
                        ActividadesLi = ActividadesL
                    },
                    MaxJsonLength = int.MaxValue
                };
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }


        }



        public ActionResult ImportarBugs(HttpPostedFileBase archivo, char tipoCarga)
        {
            try
            {
                if (archivo == null) return Json(new { Exito = false, Mensaje = "El archivo es requerido" });
                if (archivo.ContentType != MimeType.XLSX) return Json(new { Exito = false, Mensaje = "La extensión del archivo debe ser .XSLX" });
                if (tipoCarga != 'a' && tipoCarga != 'c') return Json(new { Exito = false, Mensaje = "Seleccione un tipo de carga correcto" });

                var (bugs, estatusLectura, mensajeLectura) = Importar.ImportarBug(tipoCarga, archivo, proyectos, idUsuario, conexionEF);
                if (estatusLectura)
                {
                    var (estatus, mensaje) = cd_Actividad.ImportarBugs(bugs, tipoCarga, conexionEF, conexionSP);
                    return Json(new { Exito = estatus, Mensaje = mensaje });
                }
                else
                {
                    return Json(new { Exito = estatusLectura, Mensaje = mensajeLectura });
                }
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult DescargarExcelBug(DateTime FechaSolIni, DateTime FechaSolFin, List<long> LstClasificacion, List<long> LstResponsable, List<long> LstAsignado, List<string> LstEstatus,  List<long> LstProyecto)
        {
            try
            {


               

                //if (listaActividades.Count == 0)
                //{
                //    Response.StatusCode = 400;
                //    Response.StatusDescription = "No hay registros para exportar";
                //    return Content("No hay registros para exportar");
                //}

                //var idProyecto = Task.Run(() => LeerQueryGeneral<Actividad, long>(conexionEF, x => listaActividades.Contains(x.IdActividad), x => x.IdProyecto)).Result.Distinct().ToList();
                //if (!idProyecto.All(p => proyectos.Contains(p))) return Json(new { Exito = false, Mensaje = CapaDatos.Models.Constants.Mensaje.MensajeErrorDatos });


                FiltrosModel Filtros = new FiltrosModel();
                Filtros.FechaSolIni = FechaSolIni;
                Filtros.FechaSolFin = FechaSolFin;
                Filtros.LstClasificacion = LstClasificacion;
                Filtros.LstProyecto = LstProyecto;
                Filtros.LstEstatus = LstEstatus;
                Filtros.LstResponsable = LstResponsable;
                Filtros.LstAsignado = LstAsignado;
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                Filtros.IdUsuario = Usuario.IdUsuario;


                //var filtros = new FiltrosModel();
                //filtros.IdUsuario = idUsuario;
                //var actividades = cd_Actividad.LeerBugs(filtros, usuario, conexionSP);


                CD_Calidad cd_c = new CD_Calidad();
                List<ActividadesModel> actividades = new List<ActividadesModel>();
                List<GraficaConsultaModel> LstGraficas = new List<GraficaConsultaModel>();

                var user = ((Models.Sesion)Session["Usuario" + Session.SessionID])?.Usuario;
                cd_c.LeerBugsV2(ref actividades, ref LstGraficas, Filtros, usuario, conexionSP);

                //actividades = actividades.Where(x => listaActividades.Contains(x.IdActividad)).ToList();

                var datos = ObtenerObjetoDescargaBug(actividades);

                var tabla = FuncionesGenerales.CrearTabla(datos, "Bugs");
                var excel = Reportes.CrearExcel(tabla);

                return File(excel, MimeType.XLSX, "Bugs.xlsx");
            }
            catch (Exception e)
            {
                Response.StatusCode = 400;
                Response.StatusDescription = e.Message;
                return Content(e.Message);
            }
        }

        private object ObtenerObjetoDescargaBug(List<ActividadesModel> actividades)
        {
            return
                actividades.Select(x => new
                {
                    NoBug = x.IdActividadStr,
                    //ActividadRef = x.IdActividadRef,
                    Estatus = x.EstatusStr,
                    Título = x.BR,
                    //Descripcion = FuncionesGenerales.SplitWords(x.Descripcion),
                    Proyecto = FuncionesGenerales.SplitWords(x.ProyectoStr),
                    TipoActividad = FuncionesGenerales.SplitWords(x.TipoActividadStr, 6),
                    Clasificacion = FuncionesGenerales.SplitWords(x.ClasificacionStr, 6),
                    Asignado = x.AsignadoStr,
                    Responsable = x.ResponsableStr,
                    HorasAsignadas = x.HorasAsignadas ?? 0,
                    FechaObjetivo = x.FechaSolicitado == null ? "" : Convert.ToDateTime(x.FechaSolicitado).ToString("dd-MM-yyy"),
                    HorasReal = x.HorasFinales,
                    FechaReal = x.FechaTermino == null ? "" : Convert.ToDateTime(x.FechaTermino).ToString("dd-MM-yyy")
                }).OrderBy(x => x.NoBug).ToList();
        }


        #endregion

        #region Commits
        //public ActionResult GuardarCommit(long idProyecto, long idActividad, byte tipo, string id)
        //{
        //    if (!proyectos.Contains(idProyecto))
        //        return Json(new { Exito = false, Mensaje = Mensaje.MensajeErrorDatos });


        //}
        #endregion

        #region Issues
        public ActionResult GuardaActividadIssue(ActividadIssueModel Act)
        {
            var resultado = new JObject();
            try
            {

                CD_Actividad cdact = new CD_Actividad();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                List<ProyectoIssueModel> LstRelacionadas = new List<ProyectoIssueModel>();
                bool Exito = cdact.InsertarActividadIssue(Act, ref LstRelacionadas, Encripta.DesencriptaDatos(Usuario.ConexionEF));


                resultado["Exito"] = Exito;
                resultado["LstRelacionadas"] = JsonConvert.SerializeObject(LstRelacionadas);
                resultado["Mensaje"] = Exito == false ? "Ocurrio un error al actualizar la actividad" : "";

            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
                throw ex;
            }
            return Content(resultado.ToString());

        }

        public ActionResult EliminaActividadIssue(long IdActividadIssue)
        {
            var resultado = new JObject();
            try
            {

                CD_Actividad cdact = new CD_Actividad();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;


                if (Usuario.IdTipoUsuario == 19)
                {

                    resultado["Exito"] = false;
                    resultado["Mensaje"] = "No tiene permisos para eliminar la relación";
                    return Content(resultado.ToString());

                }

                List<ProyectoIssueModel> LstRelacionadas = new List<ProyectoIssueModel>();
                bool Exito = cdact.EliminarActividadIssue(IdActividadIssue, ref LstRelacionadas, Encripta.DesencriptaDatos(Usuario.ConexionEF));


                resultado["Exito"] = Exito;
                resultado["LstRelacionadas"] = JsonConvert.SerializeObject(LstRelacionadas);
                resultado["Mensaje"] = Exito == false ? "Ocurrio un error al actualizar la actividad o la actividad es de Revisión" : "";

            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
                throw ex;
            }
            return Content(resultado.ToString());

        }

        #endregion


        #region ActividadesRelacionadas

        public ActionResult GuardarRelacionActividad(long IdActividad, long IdActividadR)
        {
            var resultado = new JObject();
            try
            {

                CD_Actividad cdact = new CD_Actividad();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                List<ProyectoIssueModel> LstRelacionadas = new List<ProyectoIssueModel>();
                bool Exito = cdact.RelacionarActividad(IdActividad, IdActividadR, Encripta.DesencriptaDatos(Usuario.ConexionEF));


                resultado["Exito"] = Exito;
                //resultado["LstRelacionadas"] = JsonConvert.SerializeObject(LstRelacionadas);
                resultado["Mensaje"] = Exito == false ? "La Actividad se relaciono con éxito" : "";

            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
                throw ex;
            }
            return Content(resultado.ToString());
        }

        public ActionResult EliminaRelacionActividad( long IdActividadR)
        {
            var resultado = new JObject();
            try
            {

                CD_Actividad cdact = new CD_Actividad();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;


                if (Usuario.IdTipoUsuario == 19) {

                    resultado["Exito"] = false;
                    resultado["Mensaje"] ="No tiene permisos para eliminar la relación";
                    return Content(resultado.ToString());

                }
                List<ProyectoIssueModel> LstRelacionadas = new List<ProyectoIssueModel>();
                bool Exito = cdact.EliminarRelacionActividad( IdActividadR, Encripta.DesencriptaDatos(Usuario.ConexionEF));


                resultado["Exito"] = Exito;
                //resultado["LstRelacionadas"] = JsonConvert.SerializeObject(LstRelacionadas);
                resultado["Mensaje"] = Exito == false ? "Error al eliminar la relación" : "";

            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
                throw ex;
            }
            return Content(resultado.ToString());
        }


        public ActionResult GuardarRelacionActividadFPD(long IdActividad, long IdFlujoPagoDet)
        {
            var resultado = new JObject();
            try
            {

                CD_Actividad cdact = new CD_Actividad();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                List<ProyectoIssueModel> LstRelacionadas = new List<ProyectoIssueModel>();
                bool Exito = cdact.RelacionarActividadFPD(IdActividad, IdFlujoPagoDet, Encripta.DesencriptaDatos(Usuario.ConexionEF));


                resultado["Exito"] = Exito;
                //resultado["LstRelacionadas"] = JsonConvert.SerializeObject(LstRelacionadas);
                resultado["Mensaje"] = Exito == false ? "La Actividad se relaciono con éxito" : "";

            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
                throw ex;
            }
            return Content(resultado.ToString());
        }

        public ActionResult EliminaRelacionActividadFPD(long IdFlujoPagoDetAct)
        {
            var resultado = new JObject();
            try
            {

                CD_Actividad cdact = new CD_Actividad();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                List<ProyectoIssueModel> LstRelacionadas = new List<ProyectoIssueModel>();
                bool Exito = cdact.EliminarRelacionActividadFPD(IdFlujoPagoDetAct, Encripta.DesencriptaDatos(Usuario.ConexionEF));


                resultado["Exito"] = Exito;
        
                resultado["Mensaje"] = Exito == false ? "Error al eliminar la relación" : "";

            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
                throw ex;
            }
            return Content(resultado.ToString());
        }


        #endregion

        #region Enviar

        public ActionResult Enviar (int Tipo, long IdActividad, string Correos, string Comentario)
        {
            var resultado = new JObject();
            try
            {
                CD_Actividad cd_act = new CD_Actividad();
                CD_Proyecto cd_proy = new CD_Proyecto();
                ActividadesModel actividad = new ActividadesModel();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                string Conexion = Encripta.DesencriptaDatos(Usuario.ConexionEF);
                string ConexionSp = Encripta.DesencriptaDatos(Usuario.ConexionSP);
                actividad = cd_act.ConsultaActividad(IdActividad, Usuario.IdUsuario, ConexionSp);
                bool Exito = true;


                if (Tipo == 1)
                {
                    Exito = FuncionesGenerales.EnviarCorreoActividad(actividad, Usuario, Correos, Comentario, Conexion);
                }
                else {
                    Exito = FuncionesGenerales.EnviarCorreoActividadEnlace(actividad, Usuario, Correos, Comentario, Conexion);
                }

                if (Exito) {


                    ActividadComentarioModel c = new ActividadComentarioModel();
                    c.IdActividad = actividad.IdActividad;
                    c.IdUsuario = Usuario.IdUsuario;
                    c.Comentario = "Envío la actividad a los siguientes correos: " + Correos + " <br/> Comentario: <br/>" + Comentario ;

                    Exito = cd_act.GuardaComentarioSinLista(c, Conexion);
                }

               

                resultado["Exito"] = Exito;
                resultado["Mensaje"] = Exito == false ? "Error al enviar correo" : "";
            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
                throw ex;
            }
            return Content(resultado.ToString());
        }
        #endregion

    }
}