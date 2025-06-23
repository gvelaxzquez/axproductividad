using AxProductividad.ClasesAuxiliares;
using CapaDatos;
using CapaDatos.Models;
using OfficeOpenXml.FormulaParsing.Excel.Functions.Logical;
using System;
using System.Collections.Generic;
using System.Diagnostics.Eventing.Reader;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;

namespace AxProductividad.Controllers
{
    public class ListaControlController : Controller
    {
        private CD_ListaControl cd_ListaControl;
        private CD_CatalogoGeneral cd_CatGeneral;
        private string conexionEF;
        private long idUsuario;

        protected override void Initialize(System.Web.Routing.RequestContext requestContext)
        {
            base.Initialize(requestContext);

            var usuario = ((Models.Sesion)Session["Usuario" + Session.SessionID]).Usuario;

            cd_ListaControl = new CD_ListaControl();
            cd_CatGeneral = new CD_CatalogoGeneral();
            conexionEF = Encripta.DesencriptaDatos(usuario.ConexionEF);
            idUsuario = usuario.IdUsuario;
        }

        public ActionResult Index()
        {
            Session["Controlador" + Session.SessionID] = "ListaControl";
            if (!FuncionesGenerales.SesionActiva() || !FuncionesGenerales.ValidaPermisos(Permiso.Ver))
                return RedirectToAction("Index", "Home");

            if (!FuncionesGenerales.ValidaPermisos(0))
            {
                return RedirectToAction("Unauthorized", "ERROR");

            }

            return View();
        }

        public ActionResult LeerComboProceso()
        {
            try
            {
                var combo = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(cd_CatGeneral.ObtenerCatalogoGeneral(2, conexionEF));

                return Json(new { Exito = true, CmbProceso = combo });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult LeerComboSubproceso(long idProceso)
        {
            try
            {
                var combo = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(cd_CatGeneral.ObtenerClasificacionActividad(idProceso, conexionEF));

                return Json(new { Exito = true, CmbSubproceso = combo });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult LeerListaControl()
        {
            try
            {
                var listaControles = cd_ListaControl.LeerListaControl(conexionEF);

                return Json(new { Exito = true, ListaControles = listaControles });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult LeerListaControlPorId(int idListaControl)
        {
            try
            {
                var listaControles = cd_ListaControl.LeerListaControlPorId(conexionEF, idListaControl);

                return Json(new { Exito = true, ListaControl = listaControles });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult CrearListaControl(ListaControlModel listaControl)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Crear))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoGuardar() });

                var (estatus, mensaje) = cd_ListaControl.CrearListaControl(conexionEF, listaControl, idUsuario);

                return Json(new { Exito = estatus, Mensaje = mensaje });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult EditarListaControl(ListaControlModel listaControl)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Editar))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoEditar() });

                var (estatus, mensaje) = cd_ListaControl.EditarListaControl(conexionEF, listaControl, idUsuario);

                return Json(new { Exito = estatus, Mensaje = mensaje });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult ActivarListaControl(ListaControlModel listaControl)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Editar))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoEditar() });

                var (estatus, mensaje) = cd_ListaControl.ActivarListaControl(conexionEF, listaControl, idUsuario);

                return Json(new { Exito = estatus, Mensaje = mensaje });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult EditarListaControlDetalle(ListaControlDetalleModel listaControlDetalle)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Editar))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoEditar() });

                var (estatus, mensaje, _listaControlDetalle) = cd_ListaControl.EditarListaControlDetalle(conexionEF, listaControlDetalle, idUsuario);

                return Json(new { Exito = estatus, Mensaje = mensaje, ListaControlDetalle = _listaControlDetalle });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult EliminarListaControlDetalle(ListaControlDetalleModel listaControlDetalle)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Eliminar))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoEliminar() });

                var (estatus, mensaje, _listaControlDetalle) = cd_ListaControl.EliminarListaControlDetalle(conexionEF, listaControlDetalle, idUsuario);

                return Json(new { Exito = estatus, Mensaje = mensaje, ListaControlDetalle = _listaControlDetalle });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult LeerProyectoListaControl()
        {
            try
            {
                long idProyecto = Convert.ToInt64(Session["IdProyecto" + Session.SessionID]?.ToString());

                var listaControles = cd_ListaControl.LeerProyectoListaControl(idUsuario, idProyecto, conexionEF);

                return Json(new { Exito = true, ListaControles = listaControles });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult LeerProyectoListaControlPorId(int idProyectoListaControl)
        {
            try
            {
                var listaControles = cd_ListaControl.LeerProyectoListaControlPorId(idUsuario, idProyectoListaControl, conexionEF);

                return Json(new { Exito = true, ListaControl = listaControles });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult EditarProyectoListaControl(ProyectoListaControlModel proyectoListaControl)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Editar))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoEditar() });

                long idProyecto = Convert.ToInt64(Session["IdProyecto" + Session.SessionID]?.ToString());

                var (estatus, mensaje) = cd_ListaControl.EditarProyectoListaControl(conexionEF, idProyecto, proyectoListaControl, idUsuario);

                return Json(new { Exito = estatus, Mensaje = mensaje });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult ActivarProyectoListaControl(ProyectoListaControlModel proyectoListaControl)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Editar))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoEditar() });

                var (estatus, mensaje) = cd_ListaControl.ActivarProyectoListaControl(conexionEF, proyectoListaControl, idUsuario);

                return Json(new { Exito = estatus, Mensaje = mensaje });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult EditarProyectoListaControlDetalle(ProyectoListaControlDetalleModel proyectoListaControlDetalle)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Editar))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoEditar() });

                var (estatus, mensaje, _proyectoListaControlDetalle) = cd_ListaControl.EditarProyectoListaControlDetalle(conexionEF, proyectoListaControlDetalle, idUsuario);

                return Json(new { Exito = estatus, Mensaje = mensaje, ProyectoListaControlDetalle = _proyectoListaControlDetalle });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult EliminarProyectoListaControlDetalle(ProyectoListaControlDetalleModel proyectoListaControlDetalle)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Eliminar))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoEliminar() });

                var (estatus, mensaje, _proyectoListaControlDetalle) = cd_ListaControl.EliminarProyectoListaControlDetalle(conexionEF, proyectoListaControlDetalle, idUsuario);

                return Json(new { Exito = estatus, Mensaje = mensaje, ProyectoListaControlDetalle = _proyectoListaControlDetalle });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult ImportarListaControl(HttpPostedFileBase archivo, byte tipoCarga)
        {
            try
            {
                if (archivo == null) return Json(new { Exito = false, Mensaje = "El archivo es requerido" });
                if (archivo.ContentType != MimeType.XLSX) return Json(new { Exito = false, Mensaje = "La extensión del archivo debe ser .XSLX" });

                var (listaControles, EstatusLectura, MensajeLectura) = Importar.ImportarListaControl(archivo, conexionEF);
                if (EstatusLectura)
                {
                    var (Estatus, Mensaje) = cd_ListaControl.EditarListaControlImportacion(tipoCarga == 1, tipoCarga == 2, listaControles, conexionEF, idUsuario);
                    return Json(new { Exito = Estatus, Mensaje });
                }
                else
                {
                    return Json(new { Exito = EstatusLectura, Mensaje = MensajeLectura });
                }
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }
    }
}