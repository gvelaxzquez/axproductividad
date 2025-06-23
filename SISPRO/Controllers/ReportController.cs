using System;
using System.Collections.Generic;
using System.Configuration;
using System.Web.Mvc;
using System.Web.Security;
using System.IO;
using System.Web;
using System.Linq;
using CapaDatos;
using CapaDatos.Models;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Web.Routing;
using CapaDatos.Models.Constants;
using System.Text.RegularExpressions;
using Rotativa;
using System.Globalization;
using CapaDatos.DataBaseModel;
using DocumentFormat.OpenXml.Spreadsheet;

namespace AxProductividad.Controllers
{
    public class ReportController : BaseController
    {
        protected CD_Reportes cd_Reporte;
        protected override void Initialize(RequestContext requestContext)
        {
            base.Initialize(requestContext);

            cd_Reporte = new CD_Reportes();
        }

        // GET: Report
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult ResumenHorasProyecto()
        {

            ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }
            Session["Controlador" + Session.SessionID] = "Reportes";
            return View();


        }
        public ActionResult ConsultaReporteHoras(FiltrosModel Filtros)
        {

            var resultado = new JObject();
            try
            {
                List<ProyectosModel> LstDetalle = new List<ProyectosModel>();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
                CD_Reportes cd_rep = new CD_Reportes();

                Filtros.IdUsuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.IdUsuario;

                LstDetalle = cd_rep.ConsultaReporteHoras(Filtros, Conexion);

                resultado["Exito"] = LstDetalle.Count == 0 ? false : true;
                resultado["LstDetalle"] = JsonConvert.SerializeObject(LstDetalle);

                return Content(resultado.ToString());
            }
            catch (Exception)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = "Error al consultar la información.";


                return Content(resultado.ToString());
            }

        }

        public ActionResult GeneralProyectos()
        {
            ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }
            Session["Controlador" + Session.SessionID] = "Reportes";
            return View();
        }

        public ActionResult ConsultaRepGeneralProyectos(DateTime FechaCorte)
        {
            var resultado = new JObject();
            try
            {
                List<ProyectosModel> LstDetalle = new List<ProyectosModel>();
                //string Conexion = ConfigurationManager.ConnectionStrings["BDProductividad"].ToString();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
                CD_Reportes cd_rep = new CD_Reportes();

                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                LstDetalle = cd_rep.ReporteGeneralProyectos(FechaCorte, Usuario, Conexion);

                resultado["Exito"] = LstDetalle.Count == 0 ? false : true;
                resultado["LstDetalle"] = JsonConvert.SerializeObject(LstDetalle);

                return Content(resultado.ToString());
            }
            catch (Exception)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = "Error al consultar la información.";
                return Content(resultado.ToString());
            }

        }

        #region ReporteTiempos
        public ActionResult ReporteTiempos()
        {
            try
            {
                ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }
                Session["Controlador" + Session.SessionID] = "Reportes";
                return View();
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public ActionResult CargaReporteTiempos()
        {
            var resultado = new JObject();
            try
            {
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                CD_CatalogoGeneral cd_CatGenral = new CD_CatalogoGeneral();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                List<CatalogoGeneralModel> LstProyectos = cd_CatGenral.ObtenerProyectosPorUsuario(Usuario, Conexion);
                List<CatalogoGeneralModel> LstTipoAct = cd_CatGenral.ObtenerCatalogoGeneral(2, Conexion);

                resultado["Exito"] = true;
                resultado["LstProyectos"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(LstProyectos);
                resultado["LstTipoAct"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(LstTipoAct);

                return Content(resultado.ToString());

            }
            catch (Exception)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = "Error al consultar la información.";

                return Content(resultado.ToString());
            }
        }

        public ActionResult ObtieneReporteTiempos(long IdProyecto, long IdFase)
        {
            var resultado = new JObject();
            try
            {
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
                CD_Reportes cd_rep = new CD_Reportes();

                List<ActividadTrackingModel> LstTiempo = new List<ActividadTrackingModel>();

                LstTiempo = cd_rep.ReporteTracking(IdProyecto, IdFase, Conexion);

                resultado["Exito"] = true;
                resultado["LstReporte"] = JsonConvert.SerializeObject(LstTiempo);

                return Content(resultado.ToString());
            }
            catch (Exception)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = "Error al consultar la información.";

                return Content(resultado.ToString());
            }
        }

        #endregion

        #region ReporteTamanos
        public ActionResult ReporteTamanos()
        {
            try
            {
                ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }
                Session["Controlador" + Session.SessionID] = "Reportes";
                return View();

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public ActionResult CargaReporteTamanos()
        {
            var resultado = new JObject();
            try
            {
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                CD_CatalogoGeneral cd_CatGenral = new CD_CatalogoGeneral();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                List<CatalogoGeneralModel> LstProyectos = cd_CatGenral.ObtenerProyectosPorUsuario(Usuario, Conexion);

                resultado["Exito"] = true;
                resultado["LstProyectos"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(LstProyectos);

                return Content(resultado.ToString());
            }
            catch (Exception)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = "Error al consultar la información.";

                return Content(resultado.ToString());
            }
        }

        public ActionResult ObtieneReporteTamanos(long IdProyecto)
        {

            var resultado = new JObject();
            try
            {


                //string Conexion = ConfigurationManager.ConnectionStrings["BDProductividad"].ToString();

                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
                CD_Reportes cd_rep = new CD_Reportes();

                List<ActividadTamanoModel> LstTamanos = new List<ActividadTamanoModel>();

                LstTamanos = cd_rep.ReporteTamanoActividad(IdProyecto, Conexion);


                resultado["Exito"] = true;
                resultado["LstReporte"] = JsonConvert.SerializeObject(LstTamanos);

                return Content(resultado.ToString());

            }
            catch (Exception)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = "Error al consultar la información.";


                return Content(resultado.ToString());
            }
        }

        #endregion

        #region ReporteHoras
        public ActionResult InformeHoras()
        {
            ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }
            Session["Controlador" + Session.SessionID] = "Report";
            if (!FuncionesGenerales.ValidaPermisos(0))
            {
                return RedirectToAction("Unauthorized", "ERROR");

            }

            return View();
        }


        public ActionResult ConsultaInformeHoras(FiltrosModel Filtros)
        {
            var resultado = new JObject();
            try
            {


                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
                CD_Reportes cd_rep = new CD_Reportes();

                IndicadoresModel ind = new IndicadoresModel();

                ind = cd_rep.ConsultaInformeHoras(Filtros, Conexion);


                resultado["Exito"] = true;
                resultado["Reporte"] = JsonConvert.SerializeObject(ind);

                return Content(resultado.ToString());

            }
            catch (Exception)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = "Error al consultar la información.";


                return Content(resultado.ToString());
            }


        }
        #endregion



        #region ReporteCargaTrabajo
        public ActionResult InformeCargaTrabajo()
        {
            ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }
            Session["Controlador" + Session.SessionID] = "Report";
            if (!FuncionesGenerales.ValidaPermisos(0))
            {
                return RedirectToAction("Unauthorized", "ERROR");

            }

            return View();
        }


        public ActionResult ConsultaCargaTrabajo(FiltrosModel Filtros)
        {
            var resultado = new JObject();
            try
            {


                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
                CD_Reportes cd_rep = new CD_Reportes();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                Filtros.IdUsuarioConsulta = Usuario.IdUsuario;
                List<UsuarioModel> LstCargaT = new List<UsuarioModel>();

                LstCargaT = cd_rep.ConsultaCargaTrabajo(Filtros, Conexion);


                resultado["Exito"] = true;
                resultado["Reporte"] = JsonConvert.SerializeObject(LstCargaT);

                return Content(resultado.ToString());

            }
            catch (Exception)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = "Error al consultar la información.";


                return Content(resultado.ToString());
            }


        }
        #endregion


        #region Reporte Tamaño
        public ActionResult ReporteTrabajoTiempo()
        {
            Session["Controlador" + Session.SessionID] = "Report";
            if (!FuncionesGenerales.SesionActiva() )
                return RedirectToAction("Index", "Home");


            if (!FuncionesGenerales.ValidaPermisos(0))
            {
                return RedirectToAction("Unauthorized", "ERROR");

            }

            return View();
        }

        public ActionResult LeerComboProyecto(bool multiple = true)
        {
            try
            {
                var proyectos = cd_CatGeneral.ObtenerProyectosPorUsuario(usuario, conexionEF);

                return Json(new { Exito = true, CmbProyecto = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(proyectos, multiple) });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult LeerReporteTrabajoTiempo(ReporteFiltroModel filtros)
        {
            try
            {
                if (!filtros.Proyectos.All(proyecto => proyectos.Contains(proyecto))) return Json(new { Exito = false, Mensaje = Mensaje.MensajeErrorDatos });

                var reporte = cd_Reporte.LeerReporteTrabajoTiempo(filtros, new List<long>(), proyectos, conexionEF);

                return new JsonResult { Data = new { Exito = true, Reporte = reporte }, MaxJsonLength = int.MaxValue };
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult DescargarExcelReporteTrabajo(List<long> listaActividades)
        {
            try
            {
                if (listaActividades == null) listaActividades = new List<long>();
                if (listaActividades.Count == 0)
                {
                    Response.StatusCode = 400;
                    Response.StatusDescription = "No hay registros para exportar";
                    return Content("No hay registros para exportar");
                }

                var reporte = cd_Reporte.LeerReporteTrabajoTiempo(new ReporteFiltroModel(), listaActividades, proyectos, conexionEF);

                var datos = ObtenerObjetoDescargaReporteTrabajo(reporte);

                var tabla = FuncionesGenerales.CrearTabla(datos, "Reporte");
                var excel = Reportes.CrearExcel(tabla);

                return File(excel, MimeType.XLSX, "Reporte.xlsx");
            }
            catch (Exception e)
            {
                Response.StatusCode = 400;
                Response.StatusDescription = e.Message;
                return Content(e.Message);
            }
        }

        private object ObtenerObjetoDescargaReporteTrabajo(List<ActividadTrabajoModel> reporte)
        {
            return
                reporte.Select(x => new
                {
                    Actividad = x.Actividad.IdActividad,
                    Recurso = x.Usuario.NombreCompleto,
                    Proyecto = x.Proyecto.Nombre,
                    ClaveP = x.Proyecto.Clave,
                    Fase = x.Fase.DescLarga,
                    Clasificacion = x.Clasificacion.DescLarga,
                    Requerimiento = x.Actividad.BR,
                    Descripcion = FuncionesGenerales.SplitWords(x.Actividad.Descripcion),
                    x.Fecha,
                    x.Tiempo,
                    x.Comentario
                }).OrderBy(x => x.Actividad).ToList();
        }
        #endregion

        public ActionResult ReporteHoras()
        {
            Session["Controlador" + Session.SessionID] = "Report";
            if (!FuncionesGenerales.SesionActiva() )
                return RedirectToAction("Index", "Home");


            if (!FuncionesGenerales.ValidaPermisos(0))
            {
                return RedirectToAction("Unauthorized", "ERROR");

            }

            return View();
        }

        public ActionResult LeerReporteHoras(ReporteFiltroModel filtros)
        {
            try
            {
                if (!filtros.Proyectos.All(proyecto => proyectos.Contains(proyecto))) return Json(new { Exito = false, Mensaje = Mensaje.MensajeErrorDatos });

                var reporte = cd_Reporte.LeerReporteHoras(filtros, new List<long>(), conexionEF);

                return new JsonResult { Data = new { Exito = true, Reporte = reporte }, MaxJsonLength = int.MaxValue };
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult DescargarExcelReporteHoras(ReporteFiltroModel filtros, List<long> listaUsuarios)
        {
            try
            {
                if (listaUsuarios == null) listaUsuarios = new List<long>();
                if (listaUsuarios.Count == 0)
                {
                    Response.StatusCode = 400;
                    Response.StatusDescription = "No hay registros para exportar";
                    return Content("No hay registros para exportar");
                }

                var reporte = cd_Reporte.LeerReporteHoras(filtros, listaUsuarios, conexionEF);

                var datos = ObtenerObjetoDescargaReporteHoras(reporte);

                var tabla = FuncionesGenerales.CrearTabla(datos, "Reporte");
                var excel = Reportes.CrearExcel(tabla);

                return File(excel, MimeType.XLSX, "Reporte.xlsx");
            }
            catch (Exception e)
            {
                Response.StatusCode = 400;
                Response.StatusDescription = e.Message;
                return Content(e.Message);
            }
        }

        private object ObtenerObjetoDescargaReporteHoras(List<IndicadoresModel> reporte)
        {
            return
                reporte.Select(x => new
                {
                    x.Recurso,
                    x.Proyecto,
                    HorasAsignadas = x.Asignadas,
                    HorasTracking = x.HorasReportadas,
                    HorasFinales = x.Real,
                    x.PorcentajeReportadas,
                    x.PorcentajeFinal
                }).OrderBy(x => x.Recurso).ToList();
        }

        public ActionResult ReporteCostos()
        {
            Session["Controlador" + Session.SessionID] = "Reportw";
            if (!FuncionesGenerales.SesionActiva() )
                return RedirectToAction("Index", "Home");

            if (!FuncionesGenerales.ValidaPermisos(0))
            {
                return RedirectToAction("Unauthorized", "ERROR");

            }

            return View();
        }

        public ActionResult ObtenerReporteCostos(List<long> proyectos, DateTime inicio, DateTime fin)
        {
            try
            {
                var informe = cd_Reporte.ObtenerReporteCostos(proyectos, inicio, fin, conexionEF);

                return Json(new { Exito = true, Reporte = informe });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult DescargarExcelInformeCostoDetalle(List<long> proyectos, DateTime inicio, DateTime fin)
        {
            try
            {
                var datos = cd_Reporte.ObtenerReporteCostos(proyectos, inicio, fin, conexionEF);
                var obj = ObtenerObjetoDescargaReporteCostos(datos);
                var tabla = FuncionesGenerales.CrearTabla(obj, "Costos");
                var excel = Reportes.CrearExcel(tabla);

                return File(excel, MimeType.XLSX, "Costos.xlsx");
            }
            catch (Exception e)
            {
                Response.StatusCode = 400;
                Response.StatusDescription = e.Message;
                return Content(e.Message);
            }
        }

        private object ObtenerObjetoDescargaReporteCostos(List<ProyectoInformeCostoModel> reporte)
        {
            return
                reporte.Select(x => new
                {
                    x.Proyecto,
                    x.Lider,
                    x.Presupuesto,
                    x.Directo,
                    x.Indirecto,
                    x.Total,
                    Utilizado = x.Consumido.ToString("N2") + " %"
                }).OrderBy(x => x.Proyecto).ToList();
        }


        #region ReporteAsistencia

        public ActionResult InformeAsistencia()
        {

            if (!FuncionesGenerales.SesionActiva() || !FuncionesGenerales.ValidaPermisos(Permiso.Ver))
                return RedirectToAction("Index", "Home");

            Session["Controlador" + Session.SessionID] = "Report";
            if (!FuncionesGenerales.ValidaPermisos(0))
            {
                return RedirectToAction("Unauthorized", "ERROR");

            }

            return View();
        }

        public ActionResult ObtenerReporteAsistenciaDiario(ControlAsistenciaModel Filtros) {

            var resultado = new JObject();
            try
            {
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
                CD_Reportes cd_rep = new CD_Reportes();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;


                ControlAsistenciaModel ca = cd_rep.ObtenerReporteAsistenciaDiario(Filtros, Conexion);


                resultado["Exito"] = true;
                resultado["Reporte"] = JsonConvert.SerializeObject(ca);

                return Content(resultado.ToString());
            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = "Error al consultar la información.";



            }

            return Content(resultado.ToString());
        }

        public ActionResult ObtenerReporteAsistenciaMensual(ControlAsistenciaModel Filtros)
        {

            var resultado = new JObject();
            try
            {
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
                CD_Reportes cd_rep = new CD_Reportes();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;


                ControlAsistenciaModel ca = cd_rep.ObtenerReporteAsistenciaMensual(Filtros, Conexion);


                resultado["Exito"] = true;
                resultado["Reporte"] = JsonConvert.SerializeObject(ca);

                return Content(resultado.ToString());
            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = "Error al consultar la información.";



            }

            return Content(resultado.ToString());
        }

        [Route("InformeAsistenciaPDF/{Id}/{Id2}/{Id3}")]
        public ActionResult InformeAsistenciaPDF(int Id, int Id2, int Id3)
        {

            if (!FuncionesGenerales.SesionActiva() || !FuncionesGenerales.ValidaPermisos(Permiso.Ver))
                return RedirectToAction("Index", "Home");

            ControlAsistenciaModel Filtros = new ControlAsistenciaModel();
            Filtros.IdAnio = Id;
            Filtros.IdMes = Id2;
            Filtros.IdUsuario = Id3;

            string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
            string ConexionEF = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
            CD_Reportes cd_rep = new CD_Reportes();
            CD_Configuracion cd_c = new CD_Configuracion();
            var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

            var Gerente = cd_c.ObtenerConfiguracionID(29, ConexionEF);
            var ResponsableContrato = cd_c.ObtenerConfiguracionID(30, ConexionEF);

            //Models.ReporteIFT reporte = new Models.ReporteIFT();




            ControlAsistenciaModel r = cd_rep.ObtenerReporteAsistenciaMensual(Filtros, Conexion);

            //reporte.LstActividades = r.LstActividades;
            //reporte.LstUsuarios = r.LstUsuarios;


            DateTimeFormatInfo formatoFecha = CultureInfo.CurrentCulture.DateTimeFormat;

            DateTimeFormatInfo dtinfo = new CultureInfo("es-MX", false).DateTimeFormat;

            r.Anio = Id.ToString();
            r.Mes = dtinfo.GetMonthName(Id2);
            r.Recurso = r.LstAsistencia.FirstOrDefault().Recurso;
            r.Clave = r.LstAsistencia.FirstOrDefault().Clave;
            r.Gerente = Gerente;
            r.Responsable= r.LstAsistencia.FirstOrDefault().Responsable;
            r.ResponsableContrato = ResponsableContrato;


            var pdf = new ViewAsPdf("InformeAsistenciaPDF", r)
            {
                FileName = "InformeAsistencia_" + r.Clave + "_" + r.Mes + "_" + r.Anio + ".pdf",
                PageOrientation = Rotativa.Options.Orientation.Landscape,
                PageSize = Rotativa.Options.Size.A4,
                PageMargins = new Rotativa.Options.Margins(10, 10, 10, 10)
            };

            return pdf;

            //return View();

        }

        #endregion


        #region InformeActividades
        public ActionResult InformeActividades()
        {

            if (!FuncionesGenerales.SesionActiva() || !FuncionesGenerales.ValidaPermisos(Permiso.Ver))
                return RedirectToAction("Index", "Home");


            Session["Controlador" + Session.SessionID] = "Report";
            if (!FuncionesGenerales.ValidaPermisos(0))
            {
                return RedirectToAction("Unauthorized", "ERROR");

            }

            return View();

        }

        [Route("InformeActividadesPDF/{Id}/{Id2}/{Id3}")]
        public ActionResult InformeActividadesPDF(int Id, int Id2, int Id3)
        {

            if (!FuncionesGenerales.SesionActiva() || !FuncionesGenerales.ValidaPermisos(Permiso.Ver))
                return RedirectToAction("Index", "Home");

            ReporteFiltroModel Filtros = new ReporteFiltroModel();
            Filtros.IdAnio = Id;
            Filtros.IdMes = Id2;
            Filtros.IdUsuario = Id3;

            string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
            string ConexionEF = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
            CD_Reportes cd_rep = new CD_Reportes();
            CD_Configuracion cd_c = new CD_Configuracion();
            var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

            var Gerente = cd_c.ObtenerConfiguracionID(29, ConexionEF);
            var ResponsableContrato = cd_c.ObtenerConfiguracionID(30, ConexionEF);

            //Models.ReporteIFT reporte = new Models.ReporteIFT();



            ReporteIFTModel r = cd_rep.ObtenerInformeActividades(Filtros, Conexion);

            //reporte.LstActividades = r.LstActividades;
            //reporte.LstUsuarios = r.LstUsuarios;


            DateTimeFormatInfo formatoFecha = CultureInfo.CurrentCulture.DateTimeFormat;

            DateTimeFormatInfo dtinfo = new CultureInfo("es-MX", false).DateTimeFormat;

            r.Anio = Id.ToString();
            r.Mes = dtinfo.GetMonthName(Id2);
            r.Recurso = r.LstUsuarios.Where(w => w.IdTipoUsuario == 1).FirstOrDefault().Nombre;
            r.Clave = r.LstUsuarios.Where(w => w.IdTipoUsuario == 1).FirstOrDefault().NumEmpleado;
            r.Total = r.LstActividades.Sum(s => s.HorasAsignadas);
            r.Gerente = Gerente;
            r.ResponsableContrato = ResponsableContrato;


            var pdf = new ViewAsPdf("InformeActividadesPDF", r) {
                FileName = "InformeActividades_" + r.Clave + "_" + r.Mes + "_" + r.Anio + ".pdf",
                PageOrientation = Rotativa.Options.Orientation.Landscape,
                 PageSize = Rotativa.Options.Size.A4,
                PageMargins = new Rotativa.Options.Margins(10, 10, 10, 10)
            };

            return pdf;

            //return View();

        }

        public ActionResult CargaInformeActividades()
        {

            var resultado = new JObject();
            try
            {

                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                CD_CatalogoGeneral cd_CatGenral = new CD_CatalogoGeneral();

                List<CatalogoGeneralModel> LstUsuarios = cd_CatGenral.ObtenerUsuarios(Usuario.IdUsuario, Encripta.DesencriptaDatos(Usuario.ConexionEF));
                List<CatalogoGeneralModel> LstAnios = cd_CatGeneral.ObtenerAnios(Encripta.DesencriptaDatos(Usuario.ConexionEF));


                resultado["Exito"] = true;
                resultado["LstUsuarios"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox2(LstUsuarios);
                resultado["LstAnios"] = FuncionesGenerales.ConvierteAniosHtmlCombox(LstAnios);
                resultado["Anio"] = DateTime.Now.Year;
                resultado["Mes"] = DateTime.Now.Month;
            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = "Error al consultar la información.";

            }
            return Content(resultado.ToString());
        }
       public ActionResult ObtenerInformeActividades(ReporteFiltroModel Filtros)
        {

            var resultado = new JObject();
            try
            {
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
                CD_Reportes cd_rep = new CD_Reportes();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;


                ReporteIFTModel r = cd_rep.ObtenerInformeActividades(Filtros, Conexion);


                var total = r.LstActividades.Sum(s => s.HorasAsignadas);


                resultado["Exito"] = true;
                resultado["Reporte"] = JsonConvert.SerializeObject(r);
                resultado["Total"] = total;

                return Content(resultado.ToString());
            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = "Error al consultar la información.";



            }

            return Content(resultado.ToString());
        }

        #endregion

        #region InformeProyectos


        public ActionResult InformeProyectos()
        {

            var resultado = new JObject();
            try
            {

                ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
                Session["Accion" + Session.SessionID] = "InformeProyectos";

                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }


                if (!FuncionesGenerales.ValidaPermisosAccion(0))
                {
                    return RedirectToAction("Unauthorized", "ERROR");

                }


                //CD_CatalogoGeneral cd_gen = new CD_CatalogoGeneral();
                //var Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);


                //List<CatalogoGeneralModel> LstAnios = cd_gen.ObtenerAnios(conexionEF);



                //ViewBag.LstAnios = LstAnios;
                //ViewBag.Anio = DateTime.Now.Year;

                return View();


            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = "Error al consultar la información.";
            }

            return Content(resultado.ToString());

        }



        public ActionResult ConsultaInformeProyectos(ReporteFiltroModel Filtros) {

            var resultado = new JObject();
            try
            {

                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
                CD_Reportes cd_rep = new CD_Reportes();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                Filtros.IdUsuario =  int.Parse(Usuario.IdUsuario.ToString());
                Filtros.IdTipoUsuario = Usuario.IdTipoUsuario;


                List<ProyectosModel> LstProyectos = new List<ProyectosModel>();


                LstProyectos = cd_rep.ObtenerInformeProyectos(Filtros, Conexion);


                resultado["Exito"] = true;
                resultado["Reporte"] = JsonConvert.SerializeObject(LstProyectos);


            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = "Error al consultar la información.";
            }

            return Content(resultado.ToString());

        }


        public ActionResult DescargarExcelInformeProyectos(DateTime FechaCorte, bool Abiertos)
        {
            try
            {


                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
       

                CD_Reportes cd_rep = new CD_Reportes();
                ReporteFiltroModel Filtros = new ReporteFiltroModel();


              
                Filtros.FechaCorte = FechaCorte;
                Filtros.Abiertos = Abiertos;
                Filtros.IdUsuario = int.Parse(Usuario.IdUsuario.ToString());
                Filtros.IdTipoUsuario = Usuario.IdTipoUsuario;

                List<ProyectosModel> LstProyectos = new List<ProyectosModel>();


                LstProyectos = cd_rep.ObtenerInformeProyectos(Filtros, Encripta.DesencriptaDatos(Usuario.ConexionSP));



              
                var reporte = ObtenerObjetoInformeProyectos(LstProyectos);
                var tabla = FuncionesGenerales.CrearTabla(reporte, "Informe de proyectos");
                var excel = Reportes.CrearExcel(tabla);

                return File(excel, MimeType.XLSX, "Informe de proyectos" + Filtros.FechaCorte.ToShortDateString() + ".xlsx");
            }
            catch (Exception e)
            {
                Response.StatusCode = 400;
                Response.StatusDescription = e.Message;
                return Content(e.Message);
            }
        }

        private object ObtenerObjetoInformeProyectos(List<ProyectosModel> LstProyectos)
        {
            return
                LstProyectos.Select(x => new
                {
                    Proyecto = x.Nombre,
                    Líder = x.Lider,
                    AvancePlan = x.AvanceCompPorc,
                    AvanceActual = x.AvanceRealPorc,
                    CostoHora = x.CostoHora,
                    CostoPlaneado = x.CostoPlaneado,
                    CostoActual = x.CostoActual,
                    CostoProyectado = x.CostoProyectado,
                    IngresoPlaneado = x.TotalIngreso,
                    Facturado = x.Facturado,
                    Cobrado = x.Cobrado,
                    RentabilidadPlaneada= x.RentabilidadPlan,
                    RentabilidadActual = x.RentabilidadFacturado,
                    RentabilidadProyectada= x.RentabilidadProyectada
                }).OrderByDescending(x => x.Proyecto).ToList();
        }


        #endregion


        #region ProductividadMensual

        public ActionResult ProductividadMensual()
        {
            ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
            Session["Accion" + Session.SessionID] = "ProductividadMensual";
            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }

            if (!FuncionesGenerales.ValidaPermisosAccion(0))
            {
                return RedirectToAction("Unauthorized", "ERROR");

            }

           
            ViewBag.IdTipoUsuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.IdTipoUsuario;
            return View();
        }
        public ActionResult ProductividadMensualC()
        {
            ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
            Session["Accion" + Session.SessionID] = "ProductividadMensualC";
            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }

            if (!FuncionesGenerales.ValidaPermisosAccion(0))
            {
                return RedirectToAction("Unauthorized", "ERROR");

            }


            ViewBag.IdTipoUsuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.IdTipoUsuario;
            return View();
        }



        public ActionResult InicializarProductividadMensual()
        {
            var resultado = new JObject();
            try
            {
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                CD_CatalogoGeneral cd_CatGenral = new CD_CatalogoGeneral();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                List<CatalogoGeneralModel> LstUsuarios = cd_CatGenral.ObtenerUsuarios(Usuario.IdUsuario, Conexion);
                List<CatalogoGeneralModel> LstAnios = cd_CatGeneral.ObtenerAnios(Encripta.DesencriptaDatos(Usuario.ConexionEF));

                resultado["Exito"] = true;
                resultado["LstUsuarios"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlComboxMultiple(LstUsuarios);
                resultado["LstAnios"] = FuncionesGenerales.ConvierteAniosHtmlCombox(LstAnios);
                resultado["Anio"] = DateTime.Now.Year;
                resultado["Mes"] = DateTime.Now.Month;


                return Content(resultado.ToString());
            }
            catch (Exception)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = "Error al inicializar la pantalla.";


                return Content(resultado.ToString());

            }


        }
        public ActionResult ConsultaCompensaciones(FiltrosModel Filtros)
        {

            var resultado = new JObject();
            try
            {
                Filtros.IdUsuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.IdUsuario;


                List<CompensacionModel> LstEncabezado = new List<CompensacionModel>();
                List<ActividadesModel> LstDetalle = new List<ActividadesModel>();
                List<CompensacionModel> LstEncabezadoLider = new List<CompensacionModel>();
                List<CompensacionModel> LstDetalleLider = new List<CompensacionModel>();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
                /*    string Conexion = ConfigurationManager.ConnectionStrings["BDProductividad"].ToString()*/
                ;
                CD_Reportes cd_rep = new CD_Reportes();


                cd_rep.ConsultaCompensaciones(Filtros, ref LstEncabezado, ref LstDetalle, ref LstEncabezadoLider, ref LstDetalleLider, Conexion);

                resultado["Exito"] = LstEncabezado.Count == 0 ? false : true;
                resultado["Mensaje"] = LstEncabezado.Count == 0 ? "No se encontro información" : "";
                resultado["LstEncabezado"] = JsonConvert.SerializeObject(LstEncabezado);
                resultado["LstDetalle"] = JsonConvert.SerializeObject(LstDetalle);

                resultado["LstEncabezadoLider"] = JsonConvert.SerializeObject(LstEncabezadoLider);
                resultado["LstDetalleLider"] = JsonConvert.SerializeObject(LstDetalleLider);

                return Content(resultado.ToString());

            }
            catch (Exception)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = "Error al consultar la información de compensaciones.";


                return Content(resultado.ToString());
            }

        }

        public ActionResult DescargarExcelConsultaCompensaciones(int Anio, int Mes)
        {

            var resultado = new JObject();
            try
            {
                FiltrosModel Filtros = new FiltrosModel();

                Filtros.Anio = Anio;
                Filtros.Mes = Mes;
                
                Filtros.IdUsuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.IdUsuario;


                List<CompensacionModel> LstEncabezado = new List<CompensacionModel>();
                List<ActividadesModel> LstDetalle = new List<ActividadesModel>();
                List<CompensacionModel> LstEncabezadoLider = new List<CompensacionModel>();
                List<CompensacionModel> LstDetalleLider = new List<CompensacionModel>();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
                /*    string Conexion = ConfigurationManager.ConnectionStrings["BDProductividad"].ToString()*/
                ;
                CD_Reportes cd_rep = new CD_Reportes();


                cd_rep.ConsultaCompensaciones(Filtros, ref LstEncabezado, ref LstDetalle, ref LstEncabezadoLider, ref LstDetalleLider, Conexion);

                var reporte = ObtenerObjetoCompensacionesEquipo(LstEncabezado);
                var tabla = FuncionesGenerales.CrearTabla(reporte, "Reporte de productividad equipo");
                var excel = Reportes.CrearExcel(tabla);


                return File(excel, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "bitacora_trabajo.xlsx");


                //return File(excel, MimeType.XLSX, "Reporte de productividad equipo" + Filtros.FechaCorte.ToShortDateString() + ".xlsx");
            }
            catch (Exception e)
            {

                Response.StatusCode = 400;
                Response.StatusDescription = e.Message;
                return Content(e.Message);
            }

        }


        private object ObtenerObjetoCompensacionesEquipo(List<CompensacionModel> LstEncabezado)
        {
            return
                LstEncabezado.Select(x => new
                {
                    Colaborador  = x.Recurso,
                    Nivel = x.Nivel,
                    Estandar_Mes = x.EstandarMes,
                    Horas_Solicitadas = x.HorasSolicitadas,
                    Horas_Liberadas = x.HorasLiberadas,
                    Bono_Cumplimiento = x.BonoCumplimiento,
                    Horas_Adicionales = x.HorasAdicionales,
                    Bono_Horas = x.BonoHoras,
                    Total = x.Total,
                    Productividad = x.ProductividadMes
                }).OrderByDescending(x => x.Colaborador).ToList();
        }


        public ActionResult DescargarExcelConsultaCompensacionesLider(int Anio, int Mes)
        {

            var resultado = new JObject();
            try
            {
                FiltrosModel Filtros = new FiltrosModel();

                Filtros.Anio = Anio;
                Filtros.Mes = Mes;

                Filtros.IdUsuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.IdUsuario;

                List<CompensacionModel> LstEncabezado = new List<CompensacionModel>();
                List<ActividadesModel> LstDetalle = new List<ActividadesModel>();
                List<CompensacionModel> LstEncabezadoLider = new List<CompensacionModel>();
                List<CompensacionModel> LstDetalleLider = new List<CompensacionModel>();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
                /*    string Conexion = ConfigurationManager.ConnectionStrings["BDProductividad"].ToString()*/
                ;
                CD_Reportes cd_rep = new CD_Reportes();
                cd_rep.ConsultaCompensaciones(Filtros, ref LstEncabezado, ref LstDetalle, ref LstEncabezadoLider, ref LstDetalleLider, Conexion);

                var reporte = ObtenerObjetoCompensacionesLider(LstEncabezadoLider);
                var tabla = FuncionesGenerales.CrearTabla(reporte, "Reporte Prod admin");
                var excel = Reportes.CrearExcel(tabla);


                return File(excel, MimeType.XLSX, "Reporte productividad admin" + Filtros.FechaCorte.ToShortDateString() + ".xlsx");

            }
            catch (Exception e)
            {

                Response.StatusCode = 400;
                Response.StatusDescription = e.Message;
                return Content(e.Message);
            }

        }


        private object ObtenerObjetoCompensacionesLider(List<CompensacionModel> LstEncabezado)
        {
            return
                LstEncabezado.Select(x => new
                {
                    Colaborador = x.Recurso,
                    Proyectos = x.Proyectos,
                    Bono_Potencial =x.BonoPotencial,
                    Total = x.Total,
                }).OrderByDescending(x => x.Colaborador).ToList();
        }






        //public ActionResult DescargarExcelProductividadMensual(DateTime FechaCorte, bool Abiertos)
        //{
        //    try
        //    {


        //        var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;


        //        CD_Reportes cd_rep = new CD_Reportes();
        //        ReporteFiltroModel Filtros = new ReporteFiltroModel();



        //        Filtros.FechaCorte = FechaCorte;
        //        Filtros.Abiertos = Abiertos;
        //        Filtros.IdUsuario = int.Parse(Usuario.IdUsuario.ToString());
        //        Filtros.IdTipoUsuario = Usuario.IdTipoUsuario;

        //        List<ProyectosModel> LstProyectos = new List<ProyectosModel>();


        //        LstProyectos = cd_rep.ObtenerInformeProyectos(Filtros, Encripta.DesencriptaDatos(Usuario.ConexionSP));




        //        var reporte = ObtenerObjetoInformeProyectos(LstProyectos);
        //        var tabla = FuncionesGenerales.CrearTabla(reporte, "Informe de proyectos");
        //        var excel = Reportes.CrearExcel(tabla);

        //        return File(excel, MimeType.XLSX, "Informe de proyectos" + Filtros.FechaCorte.ToShortDateString() + ".xlsx");
        //    }
        //    catch (Exception e)
        //    {
        //        Response.StatusCode = 400;
        //        Response.StatusDescription = e.Message;
        //        return Content(e.Message);
        //    }
        //}

        //private object ObtenerObjetoInformeProyectos(List<ProyectosModel> LstProyectos)
        //{
        //    return
        //        LstProyectos.Select(x => new
        //        {
        //            Proyecto = x.Nombre,
        //            Líder = x.Lider,
        //            AvancePlan = x.AvanceCompPorc,
        //            AvanceActual = x.AvanceRealPorc,
        //            CostoHora = x.CostoHora,
        //            CostoPlaneado = x.CostoPlaneado,
        //            CostoActual = x.CostoActual,
        //            CostoProyectado = x.CostoProyectado,
        //            IngresoPlaneado = x.TotalIngreso,
        //            Facturado = x.Facturado,
        //            Cobrado = x.Cobrado,
        //            RentabilidadPlaneada = x.RentabilidadPlan,
        //            RentabilidadActual = x.RentabilidadFacturado,
        //            RentabilidadProyectada = x.RentabilidadProyectada
        //        }).OrderByDescending(x => x.Proyecto).ToList();
        //}




        #endregion

        #region InformeDiario
        public ActionResult InformeDiario()
        {
            ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
            Session["Accion" + Session.SessionID] = "InformeDiario";
            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }

            if (!FuncionesGenerales.ValidaPermisosAccion(0))
            {
                return RedirectToAction("Unauthorized", "ERROR");

            }

            var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
            CD_CatalogoGeneral cd_CatGenral = new CD_CatalogoGeneral();
            string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
         
            List<CatalogoGeneralModel> LstAnios = cd_CatGeneral.ObtenerAnios(Encripta.DesencriptaDatos(Usuario.ConexionEF));


            ViewBag.LstAnios = LstAnios;
            return View();
        }


        public ActionResult ConsultaInformeDiario(ReporteFiltroModel Filtros)
        {

            var resultado = new JObject();
            try
            {
                Filtros.IdUsuario =  int.Parse(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.IdUsuario.ToString());
                Filtros.IdTipoUsuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.IdTipoUsuario;
                Filtros.IdProyecto = 0;

                List<InformeDiarioModel> LstReporte = new List<InformeDiarioModel>();

                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
                /*    string Conexion = ConfigurationManager.ConnectionStrings["BDProductividad"].ToString()*/
                ;
                CD_Reportes cd_rep = new CD_Reportes();


                 LstReporte =  cd_rep.ObtenerInformeDiario(Filtros,  Conexion);

                resultado["Exito"] = LstReporte.Count == 0 ? false : true;
                resultado["Mensaje"] = LstReporte.Count == 0 ? "No se encontro información" : "";
                resultado["LstReporte"] = JsonConvert.SerializeObject(LstReporte);
                return Content(resultado.ToString());

            }
            catch (Exception)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = "Error al consultar la información.";


                return Content(resultado.ToString());
            }

        }


        #endregion


        #region ReporteEsp
        public ActionResult ProyectosEspeciales()
        {
            ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];


            Session["Accion" + Session.SessionID] = "ProyectosEspeciales";
            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }

            if (!FuncionesGenerales.ValidaPermisosAccion(0))
            {
                return RedirectToAction("Unauthorized", "ERROR");

            }

            var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
            CD_CatalogoGeneral cd_CatGenral = new CD_CatalogoGeneral();
            string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

            List<CatalogoGeneralModel> LstClientes = cd_CatGenral.ObtenerClientes(Conexion);

            ViewBag.LstClientes = LstClientes;
            return View();
        }

        public ActionResult ConsultaReporteEspecial(long IdCliente)
        {

            var resultado = new JObject();
            try
            {
                List<FlujoPagoModel> LstReporte = new List<FlujoPagoModel>();

                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
                CD_Reportes cd_rep = new CD_Reportes();



                LstReporte = cd_rep.ReporteEspecialProyectos(IdCliente, Conexion);

                resultado["Exito"] = LstReporte.Count == 0 ? false : true;
                resultado["Mensaje"] = LstReporte.Count == 0 ? "No se encontro información" : "";
                resultado["LstReporte"] = JsonConvert.SerializeObject(LstReporte);
                return Content(resultado.ToString());

            }
            catch (Exception)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = "Error al consultar la información.";


                return Content(resultado.ToString());
            }

        }


        #endregion


        #region

        public ActionResult CierreMensual()
        {
            ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
            Session["Accion" + Session.SessionID] = "CierreMensual";
            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }

            if (!FuncionesGenerales.ValidaPermisosAccion(0))
            {
                return RedirectToAction("Unauthorized", "ERROR");

            }
            return View();
        }



        #endregion


        #region ReporteHoras
        public ActionResult BitacoraTrabajo()
        {
            ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }
            Session["Accion" + Session.SessionID] = "BitacoraTrabajo";
            if (!FuncionesGenerales.ValidaPermisosAccion(0))
            {
                return RedirectToAction("Unauthorized", "ERROR");

            }

            return View();
        }


        public ActionResult ConsultaBitacoraTrabajo(FiltrosModel Filtros)
        {

            var resultado = new JObject();
            try
            {
                List<BitacoraTrabajoModel> LstReporte = new List<BitacoraTrabajoModel>();

             
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                Filtros.IdUsuario = Usuario.IdUsuario;
                Filtros.IdTipoUsuario = Usuario.IdTipoUsuario;

                string Conexion = Encripta.DesencriptaDatos(Usuario.ConexionSP);

                CD_Reportes cd_rep = new CD_Reportes();



                LstReporte = cd_rep.ConsultaBitacoraTrabajo(Filtros, Conexion);

                resultado["Exito"] = LstReporte.Count == 0 ? false : true;
                resultado["Mensaje"] = LstReporte.Count == 0 ? "No se encontro información" : "";
                resultado["LstReporte"] = JsonConvert.SerializeObject(LstReporte);
                return Content(resultado.ToString());

            }
            catch (Exception)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = "Error al consultar la información.";


                return Content(resultado.ToString());
            }

        }


        public ActionResult ConsultaBitacoraTrabajoExportarExcel(FiltrosModel Filtros)
        {

            var resultado = new JObject();
            try
            {
                List<BitacoraTrabajoModel> LstReporte = new List<BitacoraTrabajoModel>();


                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                Filtros.IdUsuario = Usuario.IdUsuario;
                Filtros.IdTipoUsuario = Usuario.IdTipoUsuario;

                string Conexion = Encripta.DesencriptaDatos(Usuario.ConexionSP);

                CD_Reportes cd_rep = new CD_Reportes();



                LstReporte = cd_rep.ConsultaBitacoraTrabajo(Filtros, Conexion);

                var reporte = ObtenerObjetoBitacoraTrabajo(LstReporte);
                var tabla = FuncionesGenerales.CrearTabla(reporte, "Bitácora del equipo");
                var excel = Reportes.CrearExcel(tabla);


                return File(excel, MimeType.XLSX, "Reporte de productividad equipo" + Filtros.FechaCorte.ToShortDateString() + ".xlsx");

            }
            catch (Exception)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = "Error al consultar la información.";


                return Content(resultado.ToString());
            }

        }


        private object ObtenerObjetoBitacoraTrabajo(List<BitacoraTrabajoModel> LstEncabezado)
        {
            return
                LstEncabezado.Select(x => new
                {
                    Recurso = x.Nombre,
                    Fecha = x.Fecha,
                    Horas =x.Horas,
                    Tareas = x.Total,

          
                }).OrderByDescending(x => x.Recurso).ToList();
        }





        #endregion



        public ActionResult CargaFiltrosLista()
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
                List<CatalogoGeneralModel> LstUsuarios = cd_CatGenral.ObtenerUsuarios(Usuario.IdUsuario, Conexion);


                resultado["Exito"] = true;
                resultado["LstProyectos"] = JsonConvert.SerializeObject(LstProyectos);
                resultado["LstUsuarios"] = JsonConvert.SerializeObject(LstUsuarios);


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