using AxProductividad.ClasesAuxiliares;
using CapaDatos;
using CapaDatos.Models;
using CapaDatos.Models.Constants;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace AxProductividad.Controllers
{
    public class IssueController : BaseController
    {
        private CD_Issue cd_Issue;

        protected override void Initialize(RequestContext requestContext)
        {
            base.Initialize(requestContext);

            cd_Issue = new CD_Issue();
        }

        public ActionResult Index()
        {
            Session["Controlador" + Session.SessionID] = "Issue";
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

        public ActionResult LeerComboProyecto(bool multiple = false)
        {
            try
            {
                var proyectos = cd_Proyecto.ConsultaProyectos(usuario, conexionEF);
                var catalogos =
                    proyectos.Select(x => new CatalogoGeneralModel
                    {
                        IdCatalogo = x.IdProyecto,
                        DescCorta = x.Nombre,
                        DescLarga = x.Nombre
                    }).ToList();

                return Json(new { Exito = true, CmbProyecto = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(catalogos, multiple) });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult LeerComboIssueEstatus(bool multiple = false)
        {
            try
            {
                var catalogos = cd_CatGeneral.ObtenerCatalogoGeneral(Catalogo.IssueEstatus, conexionEF);

                return Json(new { Exito = true, CmbEstatus = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(catalogos, multiple) });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult LeerComboIssuePrioridad()
        {
            try
            {
                var catalogos = cd_CatGeneral.ObtenerCatalogoGeneral(Catalogo.IssuePrioridad, conexionEF);

                return Json(new { Exito = true, CmbPrioridad = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(catalogos) });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult LeerComboUsuarios(long idProyecto)
        {
            try
            {
                var usuarios = cd_Proyecto.ConsultarEquipoProyecto(idProyecto, conexionEF);
                var catalogos =
                    usuarios.Select(x => new CatalogoGeneralModel
                    {
                        IdCatalogo = x.IdUsuario,
                        DescCorta = x.NombreCompleto,
                        DescLarga = x.NombreCompleto
                    }).ToList();

                return Json(new { Exito = true, CmbResponsable = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(catalogos) });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult LeerIssue(ProyectoIssueFiltroModel filtros)
        {
            try
            {
                var issues = cd_Issue.LeerIssue(filtros, conexionEF, usuario);

                return new JsonResult { Data = new { Exito = true, Issues = issues }, MaxJsonLength = int.MaxValue };
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult LeerIssuePorId(long idIssue)
        {
            try
            {
                var issue = cd_Issue.LeerIssuePorId(idIssue, conexionEF, usuario);

                return Json(new { Exito = true, Issue = issue });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult CrearIssue()
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Crear))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoGuardar() });

                var (estatus, mensaje, idIssue) = cd_Issue.CrearIssue(conexionEF, idUsuario);

                return Json(new { Exito = estatus, Mensaje = mensaje, IdIssue = idIssue });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult EditarIssue(ProyectoIssueModel issue)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Editar))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoGuardar() });

                var (estatus, mensaje) = cd_Issue.EditarIssue(issue, conexionEF, usuario);

                return Json(new { Exito = estatus, Mensaje = mensaje });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult LeerIssueComentario(long idIssue)
        {
            try
            {
                var comentarios = cd_Issue.LeerIssueComentario(idIssue, conexionEF);
                var noIssue = cd_Issue.LeerIssuePorId(idIssue, conexionEF, usuario).NoIssue;

                return Json(new { Exito = true, Comentarios = comentarios, NoIssue = noIssue });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult CrearIssueComentario(ProyectoIssueComentarioModel comentario)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Crear))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoGuardar() });

                var (estatus, mensaje) = cd_Issue.CrearIssueComentario(comentario, conexionEF, usuario);

                return Json(new { Exito = estatus, Mensaje = mensaje });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult EliminarIssueComentario(long IdIssueComentario)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Eliminar))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoEliminar() });

                var (estatus, mensaje) = cd_Issue.EliminarIssueComentario(IdIssueComentario, conexionEF, usuario);

                return Json(new { Exito = estatus, Mensaje = mensaje });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult DescargarExcelIssue(List<long> listaIssues)
        {
            try
            {
                if (listaIssues.Count == 0)
                {
                    Response.StatusCode = 400;
                    Response.StatusDescription = "No hay registros para exportar";
                    return Content("No hay registros para exportar");
                }

                var issues = cd_Issue.LeerIssueDescarga(listaIssues, conexionEF);

                var datos = ObtenerObjetoDescarga(issues);

                var tabla = FuncionesGenerales.CrearTabla(datos, "Issues");
                var excel = Reportes.CrearExcel(tabla);

                return File(excel, MimeType.XLSX, "Issues.xlsx");
            }
            catch (Exception e)
            {
                Response.StatusCode = 400;
                Response.StatusDescription = e.Message;
                return Content(e.Message);
            }
        }

        private object ObtenerObjetoDescarga(List<ProyectoIssueModel> issues)
        {
            return
                issues.Select(x => new
                {
                    x.NoIssue,
                    Proyecto = x.Proyecto.Nombre,
                    Responsable = x.Usuario?.NombreCompleto ?? x.ResponsableExterno,
                    x.FechaDeteccion,
                    x.FechaCompromiso,
                    //Descripcion = Regex.Replace(x.Descripcion, ".{60}", "$0\r\n"),
                    Descripcion = FuncionesGenerales.SplitWords(x.Descripcion),
                    Prioridad = x.Prioridad.DescLarga,
                    Estatus = x.Estatus.DescLarga,
                    Comentarios = string.Join("\r\n",
                    x.ProyectoIssueComentario.Select(y => "● " + y.FechaCreo.ToString("dd-MM-yyyy") + "\r\n" + FuncionesGenerales.SplitWords(y.Comentario)).ToList()),
                    x.FechaCierre
                }).OrderBy(x => x.NoIssue).ToList();
        }
    }
}