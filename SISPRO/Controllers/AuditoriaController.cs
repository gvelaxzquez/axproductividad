using AxProductividad.ClasesAuxiliares;
using CapaDatos;
using CapaDatos.DataBaseModel;
using CapaDatos.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace AxProductividad.Controllers
{
    public class AuditoriaController : BaseController
    {
        private CD_Auditoria cd_Auditoria;
        private CD_ListaControl cd_ListaControl;

        protected override void Initialize(System.Web.Routing.RequestContext requestContext)
        {
            base.Initialize(requestContext);

            usuario = ((Models.Sesion)Session["Usuario" + Session.SessionID])?.Usuario;

            cd_Auditoria = new CD_Auditoria();
            cd_CatGeneral = new CD_CatalogoGeneral();
            cd_ListaControl = new CD_ListaControl();
            if (usuario != null)
            {
                conexionEF = Encripta.DesencriptaDatos(usuario.ConexionEF);
                idUsuario = usuario.IdUsuario;
            }
        }

        public ActionResult Index()
        {
            Session["Controlador" + Session.SessionID] = "Auditoria";
            if (!FuncionesGenerales.SesionActiva())
                return RedirectToAction("Index", "Home");


            if (!FuncionesGenerales.ValidaPermisos(0))
            {
                return RedirectToAction("Unauthorized", "ERROR");

            }

            return View();
        }

        public ActionResult LeerComboProyecto(bool multiple = false)
        {
            try
            {
                var combo = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(cd_CatGeneral.ObtenerProyectos(conexionEF), multiple);

                return Json(new { Exito = true, CmbProyecto = combo });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult LeerComboListaControl(long idProyecto)
        {
            try
            {
                cd_ListaControl.SincronizarProyectoListaControl(idUsuario, idProyecto, conexionEF);
                var combo = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(cd_ListaControl.LeerComboListaControl(idProyecto, conexionEF));

                return Json(new { Exito = true, CmbListaControl = combo });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult LeerComboAuditor()
        {
            try
            {
                var usuarios = cd_Auditoria.LeerComboAuditor(conexionEF);
                var combo = FuncionesGenerales.ConvierteCatalogoGeneralHtmlImagen(usuarios, "", true);

                return Json(new { Exito = true, CmbAuditores = combo });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult LeerProcesoSubproceso(int idProyectoListaControl)
        {
            try
            {
                var (proceso, subproceso) = cd_ListaControl.LeerProcesoSubproceso(idProyectoListaControl, conexionEF);

                return Json(new { Exito = true, Proceso = proceso, Subproceso = subproceso });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult LeerAuditoria()
        {
            try
            {
                var auditorias = cd_Auditoria.LeerAuditoria(conexionEF);

                return new JsonResult { Data = new { Exito = true, Auditorias = auditorias }, MaxJsonLength = int.MaxValue };
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult LeerAuditoriaPorFiltro(AuditoriaFiltroModel filtros)
        {
            try
            {
                var auditorias = cd_Auditoria.LeerAuditoria(filtros, conexionEF);

                return Json(new { Exito = true, Auditorias = auditorias });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult LeerAuditoriaPorId(int idAuditoria)
        {
            try
            {
                var auditoria = cd_Auditoria.LeerAuditoria(idAuditoria, conexionEF);

                return Json(new { Exito = true, Auditoria = auditoria });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult CrearAuditoria()
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Crear))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoGuardar() });

                var (estatus, mensaje, auditoria) = cd_Auditoria.CrearAuditoria(conexionEF, idUsuario);

                return Json(new { Exito = estatus, Mensaje = mensaje, Auditoria = auditoria });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult EditarAuditoria(AuditoriaModel auditoria)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Editar))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoGuardar() });

                var (estatus, mensaje) = cd_Auditoria.EditarAuditoria(auditoria, conexionEF, idUsuario);

                return Json(new { Exito = estatus, Mensaje = mensaje });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult LeerAuditoriaActividadMejora(int idAuditoria)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Editar))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoGuardar() });

                var actividades = cd_Auditoria.LeerAuditoriaActividadMejora(idAuditoria, conexionEF);

                return Json(new { Exito = true, Actividades = actividades });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult CrearAuditoriaActividadMejora(long idActividad, int idAuditoria)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Editar))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoGuardar() });

                var (estatus, mensaje) = cd_Auditoria.CrearAuditoriaActividadMejora(idActividad, idAuditoria, conexionEF);

                return Json(new { Exito = estatus, Mensaje = mensaje });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult FinalizarAuditoria(int idAuditoria)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Editar))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoGuardar() });

                var (estatus, mensaje, auditorias) = cd_Auditoria.FinzalizarAuditoria(idAuditoria, conexionEF, idUsuario);

                if (estatus)
                {
                    var auditoria = cd_Auditoria.LeerAuditoriaDetalleDescarga(idAuditoria, conexionEF);
                    var excel = Reportes.ReporteAuditoriaFinalizada(auditoria);

                    var (estatusCorreo, mensajeCorreo) = Correos.CorreoFinalizarAuditoria(conexionEF, excel, idAuditoria, usuario);

                    if (!estatusCorreo)
                    {
                        return Json(new { Exito = estatusCorreo, Mensaje = mensaje + "<br />" + mensajeCorreo, Auditorias = auditorias });
                    }
                }

                return Json(new { Exito = estatus, Mensaje = mensaje, Auditorias = auditorias });
            }
            catch (Exception e)
            {
                Response.StatusCode = 400;
                Response.StatusDescription = e.Message;
                return Content(e.Message);
            }
        }

        public async Task<ActionResult> LeerCorreos(int idAuditoria)
        {
            try
            {
                var idProyectoListaControl = (await LeerQueryGeneral<Auditoria, int?>(conexionEF, x => x.IdAuditoria == idAuditoria, x => x.IdProyectoListaControl)).FirstOrDefault();
                var idListaControl = (await LeerQueryGeneral<ProyectoListaControl, int>(conexionEF, x => x.IdProyectoListaControl == idProyectoListaControl, x => x.IdListaControl)).FirstOrDefault();

                var correos = (await LeerQueryGeneral<ListaControlCorreo, string>(conexionEF, x => x.IdListaControl == idListaControl, x => x.correo)).ToList();

                return Json(new { Exito = true, Correos = correos });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public async Task<ActionResult> EnviarAuditoriaFinalizada(List<string> correos, int idAuditoria)
        {
            try
            {
                if (correos == null) correos = new List<string>();
                correos = correos.Distinct().ToList();

                if(correos.Count == 0)
                    return Json(new { Exito = false, Mensaje = "No se especifico ningun correo"});

                var auditoria = cd_Auditoria.LeerAuditoriaDetalleDescarga(idAuditoria, conexionEF);
                var excel = Reportes.ReporteAuditoriaFinalizada(auditoria);

                var idProyectoListaControl = (await LeerQueryGeneral<Auditoria, int?>(conexionEF, x => x.IdAuditoria == idAuditoria, x => x.IdProyectoListaControl)).FirstOrDefault();
                var idListaControl = (await LeerQueryGeneral<ProyectoListaControl, int>(conexionEF, x => x.IdProyectoListaControl == idProyectoListaControl, x => x.IdListaControl)).FirstOrDefault();

                var (estatus, mensaje) = Correos.CorreoFinalizarAuditoria(conexionEF, excel, idAuditoria, usuario, correos);

                if (estatus)
                {
                    cd_Auditoria.CrearListaControlCorreo(correos, idListaControl, conexionEF);
                }

                return Json(new { Exito = estatus, Mensaje = mensaje });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult LeerAuditoriaControl(int idAuditoria, long idProyecto, int idProyectoListaControl)
        {
            try
            {
                cd_ListaControl.SincronizarProyectoListaControl(idUsuario, idProyecto, conexionEF);
                cd_ListaControl.SincronizarProyectoListaControlDetalle(idUsuario, idProyectoListaControl, conexionEF);

                var auditoriaControles = cd_Auditoria.LeerAuditoriaControl(idAuditoria, idProyectoListaControl, idUsuario, conexionEF);

                return Json(new { Exito = true, AuditoriaControles = auditoriaControles });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult ActualizarControlCumple(AuditoriaControlModel auditoria)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Editar))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoGuardar() });

                var (estatus, mensaje, auditoriaControles) = cd_Auditoria.ActualizarControlCumple(auditoria, idUsuario, conexionEF);

                return Json(new { Exito = estatus, Mensaje = mensaje, AuditoriaControles = auditoriaControles });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult LeerAuditoriaControlHallazgo(AuditoriaControlModel control)
        {
            try
            {
                var hallazgos = cd_Auditoria.LeerAuditoriaControlHallazgo(control.IdAuditoria, control.IdAuditoriaControl, conexionEF);

                return Json(new { Exito = true, Hallazgos = hallazgos });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult CrearHallazgo(AuditoriaControlHallazgoModel hallazgo)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Crear))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoGuardar() });

                var (estatus, mensaje, hallazgos) = cd_Auditoria.CrearHallazgo(hallazgo, idUsuario, conexionEF);

                return Json(new { Exito = estatus, Mensaje = mensaje, Hallazgos = hallazgos });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult EditarHallazgo(AuditoriaControlHallazgoModel hallazgo)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Editar))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoGuardar() });

                var (estatus, mensaje, hallazgos) = cd_Auditoria.EditarHallazgo(hallazgo, idUsuario, conexionEF);

                return Json(new { Exito = estatus, Mensaje = mensaje, Hallazgos = hallazgos });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult EliminarHallazgo(AuditoriaControlHallazgoModel hallazgo)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Eliminar))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoEliminar() });

                var (estatus, mensaje, hallazgos) = cd_Auditoria.EliminarHallazgo(hallazgo, idUsuario, conexionEF);

                return Json(new { Exito = estatus, Mensaje = mensaje, Hallazgos = hallazgos });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult DescargarExcelAuditoria(List<int> listaAuditorias)
        {
            try
            {
                if (listaAuditorias.Count == 0)
                {
                    Response.StatusCode = 400;
                    Response.StatusDescription = "No hay registros para exportar";
                    return Content("No hay registros para exportar");
                }

                var auditorias = cd_Auditoria.LeerAuditoriaDescarga(listaAuditorias, conexionEF);

                var datos = ObtenerObjetoDescarga(auditorias);

                var tabla = FuncionesGenerales.CrearTabla(datos, "Auditorias");
                var excel = Reportes.CrearExcel(tabla);

                return File(excel, MimeType.XLSX, "Auditorias.xlsx");
            }
            catch (Exception e)
            {
                Response.StatusCode = 400;
                Response.StatusDescription = e.Message;
                return Content(e.Message);
            }
        }

        public ActionResult DescargarExcelAuditoriaDetalle(int idAuditoria)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Editar))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoGuardar() });

                var auditoria = cd_Auditoria.LeerAuditoriaDetalleDescarga(idAuditoria, conexionEF);
                var excel = Reportes.ReporteAuditoriaFinalizada(auditoria);

                return File(excel, MimeType.XLSX, "Auditorias.xlsx");
            }
            catch (Exception e)
            {
                Response.StatusCode = 400;
                Response.StatusDescription = e.Message;
                return Content(e.Message);
            }
        }

        private object ObtenerObjetoDescarga(List<AuditoriaModel> auditorias)
        {
            return
                auditorias.Select(x => new
                {
                    x.NoAuditoria,
                    Fechas = x.FechaInicio.ToString("dd-MM-yyyy") + (x.FechaFin == null ? "" : " / " + Convert.ToDateTime(x.FechaFin).ToString("dd-MM-yyyy")),
                    x.Estatus,
                    Proyecto = x.ProyectoListaControl.Proyecto.Nombre,
                    ListaControl = x.ProyectoListaControl.ListaControl.Nombre,
                    Auditor = string.Join("\r\n", x.UsuarioAuditor.Select(y => "● " + y.NombreCompleto).ToList()),
                    Controles = string.Join("\r\n", $"-Total: {x.CuentaControlTotal}", $"-Revisados: { x.CuentaControlRevisados}", $"-Cumple: { x.CuentaControlCumple}", $"-No cumple: {x.CuentaControlNoCumple}"),
                    Hallazgos = string.Join("\r\n", $"-Bajo: {x.CuentaInconformidadBajo}", $"-Medio: { x.CuentaInconformidadMedio}", $"-Grave: { x.CuentaInconformidadGrave}")
                }).OrderBy(x => x.NoAuditoria).ToList();
        }
    }
}