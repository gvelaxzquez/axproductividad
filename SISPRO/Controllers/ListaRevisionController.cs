using AxProductividad.ClasesAuxiliares;
using CapaDatos;
using CapaDatos.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AxProductividad.Controllers
{
    public class ListaRevisionController : BaseController
    {
        private CD_ListaRevision cd_ListaRevision;

        protected override void Initialize(System.Web.Routing.RequestContext requestContext)
        {
            base.Initialize(requestContext);

            cd_ListaRevision = new CD_ListaRevision();
        }

        public ActionResult Index()
        {
            Session["Controlador" + Session.SessionID] = "ListaRevision";
            if (!FuncionesGenerales.SesionActiva() )
                return RedirectToAction("Index", "Login");

            if (!FuncionesGenerales.ValidaPermisos(0))
            {
                return RedirectToAction("Unauthorized", "ERROR");

            }

            return View();
        }

        public ActionResult LeerListaRevision(long idProyecto)
        {
            try
            {
                var listasRevision = cd_ListaRevision.LeerListaRevision(idProyecto, conexionEF);

                return Json(new { Exito = true, ListasRevision = listasRevision });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult LeerListaRevisionPorId(int idListaRevision)
        {
            try
            {
                var listaRevision = cd_ListaRevision.LeerListaRevisionPorId(conexionEF, idListaRevision);

                return Json(new { Exito = true, ListaRevision = listaRevision });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult LeerListaRevisionDetalle(int idListaRevision)
        {
            try
            {
                var detalle = cd_ListaRevision.LeerListaRevisionDetalle(conexionEF, idListaRevision);

                return Json(new { Exito = true, Detalle = detalle });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult CrearListaRevision(long idProyecto)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Crear))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoGuardar() });

                var (estatus, mensaje, idListaRevision) = cd_ListaRevision.CrearListaRevision(idProyecto, conexionEF, idUsuario);

                return Json(new { Exito = estatus, Mensaje = mensaje, IdListaRevision = idListaRevision });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult EditarListaRevision(ListaRevisionModel listaRevision)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Editar))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoEditar() });

                var (estatus, mensaje) = cd_ListaRevision.EditarListaRevision(listaRevision, conexionEF, idUsuario);

                return Json(new { Exito = estatus, Mensaje = mensaje });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult ActivarListaRevision(ListaRevisionModel listaRevision)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Editar))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoEditar() });

                var (estatus, mensaje) = cd_ListaRevision.ActivarListaRevision(conexionEF, listaRevision, idUsuario);

                return Json(new { Exito = estatus, Mensaje = mensaje });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult CopiarListaRevisionDetalle(long idProyecto, List<int> listasRevision)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Editar))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoEditar() });

                if (listasRevision == null || listasRevision.Count == 0)
                    return Json(new { Exito = false, Mensaje = "No se seleccionó ningun registro" });

                var (estatus, mensaje) = cd_ListaRevision.CopiarListaRevisionDetalle(idProyecto, listasRevision, conexionEF, idUsuario);

                return Json(new { Exito = estatus, Mensaje = mensaje });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult ImportarListaRevision(long idProyecto, HttpPostedFileBase archivo, byte tipoCarga)
        {
            try
            {
                if (archivo == null) return Json(new { Exito = false, Mensaje = "El archivo es requerido" });
                if (archivo.ContentType != MimeType.XLSX) return Json(new { Exito = false, Mensaje = "La extensión del archivo debe ser .XSLX" });

                var (listasRevision, estatusLectura, mensajeLectura) = Importar.ImportarListaControl(archivo, conexionEF);
                if (estatusLectura)
                {
                    var (estatus, mensaje) = cd_ListaRevision.EditarListaRevisionImportacion(idProyecto, tipoCarga == 1, tipoCarga == 2, listasRevision, conexionEF, idUsuario);
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

        public ActionResult GuardarListaRevisionDetalle(ListaRevisionDetalleModel listaRevisionDetalle)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Editar))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoEditar() });

                var (estatus, mensaje) = cd_ListaRevision.GuardarListaRevisionDetalle(listaRevisionDetalle, conexionEF, idUsuario);

                return Json(new { Exito = estatus, Mensaje = mensaje });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult EliminarListaControlDetalle(ListaRevisionDetalleModel listaRevisionDetalle)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Eliminar))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoEliminar() });

                var (estatus, mensaje) = cd_ListaRevision.EliminarListaRevisionDetalle(listaRevisionDetalle, conexionEF, idUsuario);

                return Json(new { Exito = estatus, Mensaje = mensaje });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult LeerListaRevisionPorCategoria(ListaRevisionModel lista)
        {
            try
            {
                var listas = cd_ListaRevision.LeerListaRevisionPorCategoria(lista, conexionEF);
                var cmbListas = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(listas.Select(x => new CatalogoGeneralModel
                {
                    IdCatalogo = x.IdListaRevision,
                    DescLarga = x.Nombre,
                    DescCorta = x.Nombre
                }).ToList());

                return Json(new { Exito = true, CmbListas = cmbListas });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult LeerListaRevisionPorProyecto(ListaRevisionModel lista)
        {
            try
            {
                var listas = cd_ListaRevision.LeerListaRevisionPorProyecto(lista.IdProyecto, conexionEF);
                var cmbListas = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(listas.Select(x => new CatalogoGeneralModel
                {
                    IdCatalogo = x.IdListaRevision,
                    DescLarga = x.Nombre,
                    DescCorta = x.Nombre
                }).ToList());

                return Json(new { Exito = true, CmbListas = cmbListas });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }


        public ActionResult LeerActividadesPorCategoria(ListaRevisionModel lista)
        {
            try
            {
                var actividades = cd_ListaRevision.LeerActividadesPorCategoria(lista, conexionEF);
                var cmbListas = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(actividades);

                return Json(new { Exito = true, CmbListas = cmbListas });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult LeerActividadesPorProyecto(ListaRevisionModel lista)
        {
            try
            {
                var actividades = cd_ListaRevision.LeerActividadesPorProyecto(lista.IdProyecto, conexionEF);
                var cmbListas = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(actividades);

                return Json(new { Exito = true, CmbListas = cmbListas });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult LeerListaRevisionActividad(int idActividad, int idListaRevision)
        {
            try
            {
                var controles = cd_ListaRevision.LeerListaRevisionActividad(idActividad, idListaRevision, idUsuario, conexionEF);

                return Json(new { Exito = true, Controles = controles });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }


        public ActionResult ActualizarListaRevisionActividad( int idListaRevision)
        {
            try
            {
                var controles = cd_ListaRevision.ActualizaEstatus(idListaRevision, idUsuario, conexionEF);


                return Json(new { Exito = true});
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }





        public ActionResult EditarActividadRevision(ActividadListaRevisionModel control)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Editar))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoEliminar() });

                var (estatus, mensaje) = cd_ListaRevision.EditarActividadRevision(control, idUsuario, conexionEF);

                return Json(new { Exito = estatus, Mensaje = mensaje });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult LeerActividadRevisionHallazgo(ActividadListaRevisionModel revision)
        {
            try
            {
                var hallazgos = cd_ListaRevision.LeerActividadRevisionHallazgo(revision, conexionEF);

                return Json(new { Exito = true, Hallazgos = hallazgos });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult GuardarActividadRevisionHallazgo(ActividadListaRevisionHallazgoModel hallazgo)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(hallazgo.IdActividadListaRevisionHallazgo == 0 ? Permiso.Crear : Permiso.Editar))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoEditar() });

                var (estatus, mensaje) = hallazgo.IdActividadListaRevisionHallazgo == 0 ?
                    cd_ListaRevision.CrearHallazgo(hallazgo, idUsuario, conexionEF) :
                    cd_ListaRevision.EditarHallazgo(hallazgo, idUsuario, conexionEF);

                return Json(new { Exito = estatus, Mensaje = mensaje });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }       
        
        public ActionResult EliminarActividadRevisionHallazgo(ActividadListaRevisionHallazgoModel hallazgo)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Eliminar))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoEliminar() });

                var (estatus, mensaje) = cd_ListaRevision.EliminarHallazgo(hallazgo, idUsuario, conexionEF);

                return Json(new { Exito = estatus, Mensaje = mensaje });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        //public ActionResult DescargarExcelListaRevisionDetalle(long idActividad)
        //{
        //    try
        //    {
        //        if (!FuncionesGenerales.ValidaPermisos(Permiso.Editar))
        //            return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoGuardar() });

        //        var auditoria = cd_Auditoria.LeerAuditoriaDetalleDescarga(idAuditoria, conexionEF);
        //        var excel = Reportes.ReporteAuditoriaFinalizada(auditoria);

        //        return File(excel, MimeType.XLSX, "Auditorias.xlsx");

        //    }
        //    catch (Exception e)
        //    {
        //        Response.StatusCode = 400;
        //        Response.StatusDescription = e.Message;
        //        return Content(e.Message);
        //    }
        //}
    }
}