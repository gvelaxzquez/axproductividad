using AxProductividad.ClasesAuxiliares;
using CapaDatos.DataBaseModel;
using CapaDatos.Models;
using CapaDatos.Models.Constants;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace AxProductividad.Controllers
{
    public class RiesgoController : RiesgoCatalogoController
    {
        public override ActionResult Index()
        {
            Session["Controlador" + Session.SessionID] = "Riesgo";
            if (!FuncionesGenerales.SesionActiva())
                return RedirectToAction("Index", "Home");


            if (!FuncionesGenerales.ValidaPermisos(0))
            {
                return RedirectToAction("Unauthorized", "ERROR");

            }

            return View();
        }

        public ActionResult LeerComboProyecto()
        {
            try
            {
                var proyectos = cd_CatGeneral.ObtenerProyectosPorUsuario(usuario, conexionEF);

                return Json(new { Exito = true, CmbProyecto = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(proyectos) });
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
                var idLider = usuarios.FirstOrDefault(x => x.IdTipoUsuario == 15 || x.IdTipoUsuario == 17).IdUsuario;
                var catalogos =
                    usuarios.Select(x => new CatalogoGeneralModel
                    {
                        IdCatalogo = x.IdUsuario,
                        DescCorta = x.NombreCompleto,
                        DescLarga = x.NombreCompleto
                    }).ToList();

                return Json(new { Exito = true, CmbResponsable = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(catalogos, idSeleccionado: idLider) });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult LeerProyectoRiesgo(int idProyecto)
        {
            try
            {
                if (!proyectos.Contains(idProyecto)) return Json(new { Exito = false, Mensaje = Mensaje.MensajeErrorDatos });

                cd_Riesgo.SincronizarRiesgos(idProyecto, idUsuario, conexionEF);
                var riesgos = cd_Riesgo.LeerProyectoRiesgo(idProyecto, conexionEF);

                return Json(new { Exito = true, Riesgos = riesgos });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult LeerProyectoRiesgoPorId(int idProyectoRiesgo)
        {
            try
            {
                var riesgo = cd_Riesgo.LeerProyectoRiesgoPorId(idProyectoRiesgo, conexionEF);
                if (!proyectos.Contains(riesgo.IdProyecto)) return Json(new { Exito = false, Mensaje = Mensaje.MensajeErrorDatos });

                return Json(new { Exito = true, Riesgo = riesgo });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult CrearProyectoRiesgo(ProyectoRiesgoModel riesgo)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Crear))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoGuardar() });

                if (!TryValidateModel(riesgo)) return Json(new { Exito = false, Mensaje = Mensajes.MensajeCamposIncorrectos() });

                if (!proyectos.Contains(riesgo.IdProyecto)) return Json(new { Exito = false, Mensaje = Mensaje.MensajeErrorDatos });

                var (idRiesgo, estatus, mensaje) = cd_Riesgo.CrearRiesgo(riesgo, idUsuario, conexionEF);

                return Json(new { Exito = estatus, Mensaje = mensaje, IdRiesgo = idRiesgo });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult LeerEstrategia(int idPRoyectoRiesgo)
        {
            try
            {
                var estrategias = cd_Riesgo.LeerEstrategia(idPRoyectoRiesgo, conexionEF);

                return Json(new { Exito = true, Estrategias = estrategias });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult LeerEstrategiaPorId(int idPRoyectoRiesgoEstrategia)
        {
            try
            {
                var estrategia = cd_Riesgo.LeerEstrategiaPorId(idPRoyectoRiesgoEstrategia, conexionEF);

                return Json(new { Exito = true, Estrategia = estrategia });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult CrearEstrategia(ProyectoRiesgoEstrategiaModel estrategia)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Crear))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoGuardar() });

                if (!TryValidateModel(estrategia)) return Json(new { Exito = false, Mensaje = Mensajes.MensajeCamposIncorrectos() });

                var (estatus, mensaje) = cd_Riesgo.CrearEstrategia(estrategia, idUsuario, conexionEF);

                return Json(new { Exito = estatus, Mensaje = mensaje });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult EditarEstrategia(ProyectoRiesgoEstrategiaModel estrategia)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Editar))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoGuardar() });

                if (!TryValidateModel(estrategia)) return Json(new { Exito = false, Mensaje = Mensajes.MensajeCamposIncorrectos() });

                var (estatus, mensaje) = cd_Riesgo.EditarEstrategia(estrategia, conexionEF);

                return Json(new { Exito = estatus, Mensaje = mensaje });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult EditarProyectoRiesgo(ProyectoRiesgoModel riesgo)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Editar))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoGuardar() });

                if (!TryValidateModel(riesgo)) return Json(new { Exito = false, Mensaje = Mensajes.MensajeCamposIncorrectos() });

                if (!proyectos.Contains(riesgo.IdProyecto)) return Json(new { Exito = false, Mensaje = Mensaje.MensajeErrorDatos });

                var (estatus, mensaje) = cd_Riesgo.EditarProyectoRiesgo(riesgo, idUsuario, conexionEF);

                return Json(new { Exito = estatus, Mensaje = mensaje });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public async Task<ActionResult> EliminarProyectoRiesgo(int idProyectoRiesgo)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Eliminar))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoEliminar() });

                var proyecto = (await LeerQueryGeneral<ProyectoRiesgo, long>(conexionEF, x => x.IdProyectoRiesgo == idProyectoRiesgo, x => x.IdProyecto)).FirstOrDefault();
                if (!proyectos.Contains(proyecto)) return Json(new { Exito = false, Mensaje = Mensaje.MensajeErrorDatos });

                var (estatus, mensaje) = cd_Riesgo.EliminarProyectoRiesgo(idProyectoRiesgo, conexionEF);

                return Json(new { Exito = estatus, Mensaje = mensaje });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public async Task<ActionResult> LeerRiesgoComentario(int idRiesgo)
        {
            try
            {
                var proyecto = (await LeerQueryGeneral<ProyectoRiesgo, long>(conexionEF, x => x.IdProyectoRiesgo == idRiesgo, x => x.IdProyecto)).FirstOrDefault();
                if (!proyectos.Contains(proyecto)) return Json(new { Exito = false, Mensaje = Mensaje.MensajeErrorDatos });

                var comentarios = cd_Riesgo.LeerRiesgoComentario(idRiesgo, conexionEF);
                var noRiesgo = cd_Riesgo.LeerProyectoRiesgoPorId(idRiesgo, conexionEF).NoRiesgo;

                return Json(new { Exito = true, Comentarios = comentarios, NoRiesgo = noRiesgo });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public async Task<ActionResult> CrearRiesgoComentario(ProyectoRiesgoComentarioModel comentario)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Crear))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoGuardar() });

                var proyecto = (await LeerQueryGeneral<ProyectoRiesgo, long>(conexionEF, x => x.IdProyectoRiesgo == comentario.IdProyectoRiesgo, x => x.IdProyecto)).FirstOrDefault();
                if (!proyectos.Contains(proyecto)) return Json(new { Exito = false, Mensaje = Mensaje.MensajeErrorDatos });

                var (estatus, mensaje) = cd_Riesgo.CrearRiesgoComentario(comentario, conexionEF, usuario);

                return Json(new { Exito = estatus, Mensaje = mensaje });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public async Task<ActionResult> EliminarRiesgoComentario(int idRiesgoComentario)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Eliminar))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoEliminar() });

                var idRiesgo = (await LeerQueryGeneral<ProyectoRiesgoComentario, int>(conexionEF, x => x.IdProyectoRiesgoComentario == idRiesgoComentario, x => x.IdProyectoRiesgo)).FirstOrDefault();
                var proyecto = (await LeerQueryGeneral<ProyectoRiesgo, long>(conexionEF, x => x.IdProyectoRiesgo == idRiesgo, x => x.IdProyecto)).FirstOrDefault();
                if (!proyectos.Contains(proyecto)) return Json(new { Exito = false, Mensaje = Mensaje.MensajeErrorDatos });

                var (estatus, mensaje) = cd_Riesgo.EliminarRiesgoComentario(idRiesgoComentario, conexionEF, usuario);

                return Json(new { Exito = estatus, Mensaje = mensaje });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public override ActionResult DescargarExcelRiesgo(List<int> listaRiesgos)
        {
            try
            {
                if (listaRiesgos.Count == 0)
                {
                    Response.StatusCode = 400;
                    Response.StatusDescription = "No hay registros para exportar";
                    return Content("No hay registros para exportar");
                }

                var proyecto = Task.Run(() => LeerQueryGeneral<ProyectoRiesgo, long>(conexionEF, x => listaRiesgos.Contains(x.IdProyectoRiesgo), x => x.IdProyecto)).Result.FirstOrDefault();
                if (!proyectos.Contains(proyecto)) return Json(new { Exito = false, Mensaje = Mensaje.MensajeErrorDatos });

                var riesgos = cd_Riesgo.LeerProyectoRiesgo(proyecto, conexionEF).Where(x => listaRiesgos.Contains(x.IdProyectoRiesgo)).ToList();

                var datos = ObtenerObjetoDescarga(riesgos);

                var tabla = FuncionesGenerales.CrearTabla(datos, "Riesgos");
                var excel = Reportes.CrearExcel(tabla);

                return File(excel, MimeType.XLSX, "Riesgos.xlsx");
            }
            catch (Exception e)
            {
                Response.StatusCode = 400;
                Response.StatusDescription = e.Message;
                return Content(e.Message);
            }
        }

        private object ObtenerObjetoDescarga(List<ProyectoRiesgoModel> riesgos)
        {
            return
                riesgos.Select(x => new
                {
                    x.NoRiesgo,
                    FechaIdentificacion = x.FechaIdentificacion.ToString("dd-MM-yyyy"),
                    Categoria = x.Categoria.DescCorta,
                    Fuente = x.Fuente.DescCorta,
                    DescripcionRiesgo = FuncionesGenerales.SplitWords(x.DescripcionRiesgo),
                    DescripcionEfecto = FuncionesGenerales.SplitWords(x.DescripcionEfecto),
                    Causas = FuncionesGenerales.SplitWords(x.Causas, 7),
                    EventoMaterializacion = FuncionesGenerales.SplitWords(x.EventoMaterializacion, 7),
                    Impacto = x.Impacto.Cualitativo,
                    Probabilidad = x.Probabilidad.Cualitativo,
                    Calificacion = x.Impacto.Valor * x.Probabilidad.Valor,
                    x.Evaluacion.Where(y =>
                    {
                        var calificacion = x.Impacto.Valor * x.Probabilidad.Valor;
                        if (calificacion >= y.Minimo && calificacion <= y.Maximo) return true;
                        return false;
                    }).FirstOrDefault().Severidad,
                    //Estrategia = x.Estrategia.DescCorta,
                    //PlanMitigacion = FuncionesGenerales.SplitWords(x.PlanMitigacion),
                    //Responsable = x.Usuario.NombreCompleto,
                    //DisparadorPlan = FuncionesGenerales.SplitWords(x.DisparadorPlan, 7),
                    //Descripcion = FuncionesGenerales.SplitWords(x.Descripcion),
                }).OrderBy(x => x.NoRiesgo).ToList();
        }
    }
}