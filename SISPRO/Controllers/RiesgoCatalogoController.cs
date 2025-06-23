using AxProductividad.ClasesAuxiliares;
using CapaDatos;
using CapaDatos.DataBaseModel;
using CapaDatos.Models;
using CapaDatos.Models.Constants;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web.Mvc;
using System.Web.Routing;

namespace AxProductividad.Controllers
{
    public class RiesgoCatalogoController : BaseController
    {
        protected CD_Riesgo cd_Riesgo;

        protected override void Initialize(RequestContext requestContext)
        {
            base.Initialize(requestContext);

            cd_Riesgo = new CD_Riesgo();
        }

        public virtual ActionResult Index()
        {
            Session["Controlador" + Session.SessionID] = "RiesgoCatalogo";
            if (!FuncionesGenerales.SesionActiva())
                return RedirectToAction("Index", "Home");

            if (!FuncionesGenerales.ValidaPermisos(0))
            {
                return RedirectToAction("Unauthorized", "ERROR");

            }

            return View();
        }

        public async Task<ActionResult> LeerCombos()
        {
            try
            {
                var categoria = LeerComboCatalogoGeneral(Catalogo.RiesgoCategoria, descCorta: true);
                var fuente = LeerComboCatalogoGeneral(Catalogo.RiesgoFuente);
                var estrategia = LeerComboCatalogoGeneral(Catalogo.RiesgoEstrategia, descCorta: true);
                var impacto = LeerComboGeneral<RiesgoImpacto>(conexionEF, x => new CatalogoGeneralModel { IdCatalogo = x.IdRiesgoImpacto, DescLarga = x.Cualitativo, DatoEspecial = x.Valor.ToString() });
                var probabilidad = LeerComboGeneral<RiesgoProbabilidad>(conexionEF, x => new CatalogoGeneralModel { IdCatalogo = x.IdRiesoProbabilidad, DescLarga = x.Cualitativo, DatoEspecial = x.Valor.ToString() });
                var severidadTask = LeerQueryGeneral<RiesgoEvaluacion, RiesgoEvaluacionModel>(conexionEF, x => new RiesgoEvaluacionModel { Color = x.Color, Minimo = x.Minimo, Maximo = x.Maximo, Severidad = x.Severidad });

                var combosTask = Task.WhenAll(categoria, fuente, estrategia, impacto, probabilidad);
                var combos = await combosTask;
                var severidad = await severidadTask;

                return Json(new
                {
                    Exito = true,
                    Severidad = severidad,
                    CmbCategoria = combos[0],
                    CmbFuente = combos[1],
                    CmbEstrategia = combos[2],
                    CmbImpacto = combos[3],
                    CmbProbabilidad = combos[4]
                });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult LeerRiesgo()
        {
            try
            {
                var riesgos = cd_Riesgo.LeerRiesgo(conexionEF);

                return Json(new { Exito = true, Riesgos = riesgos });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult LeerRiesgoPorId(int idRiesgo)
        {
            try
            {
                var riesgo = cd_Riesgo.LeerRiesgo(idRiesgo, conexionEF);

                return Json(new { Exito = true, Riesgo = riesgo });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult CrearRiesgo(RiesgoModel riesgo)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Crear))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoGuardar() });

                if (!TryValidateModel(riesgo)) return Json(new { Exito = false, Mensaje = Mensajes.MensajeCamposIncorrectos() });

                var (estatus, mensaje) = cd_Riesgo.CrearRiesgo(riesgo, idUsuario, conexionEF);

                return Json(new { Exito = estatus, Mensaje = mensaje });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult EditarRiesgo(RiesgoModel riesgo)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Editar))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoGuardar() });

                if (!TryValidateModel(riesgo)) return Json(new { Exito = false, Mensaje = Mensajes.MensajeCamposIncorrectos() });

                var (estatus, mensaje) = cd_Riesgo.EditarRiesgo(riesgo, conexionEF);

                return Json(new { Exito = estatus, Mensaje = mensaje });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult ActivarRiesgo(int idRiesgo, bool activo)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Editar))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoGuardar() });

                var (estatus, mensaje) = cd_Riesgo.ActivarRiesgo(idRiesgo, activo, conexionEF);

                return Json(new { Exito = estatus, Mensaje = mensaje });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public virtual ActionResult DescargarExcelRiesgo(List<int> listaRiesgos)
        {
            try
            {
                if (listaRiesgos.Count == 0)
                {
                    Response.StatusCode = 400;
                    Response.StatusDescription = "No hay registros para exportar";
                    return Content("No hay registros para exportar");
                }

                var riesgos = cd_Riesgo.LeerRiesgo(conexionEF).Where(x => listaRiesgos.Contains(x.IdRiesgo)).ToList();

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

        private object ObtenerObjetoDescarga(List<RiesgoModel> riesgos)
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
                    }).FirstOrDefault().Severidad
                }).OrderBy(x => x.NoRiesgo).ToList();
        }
    }
}