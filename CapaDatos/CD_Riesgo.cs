using CapaDatos.DataBaseModel;
using CapaDatos.Models;
using CapaDatos.Models.Constants;
using DocumentFormat.OpenXml.Vml.Spreadsheet;
using EntityFramework.Extensions;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Runtime.CompilerServices;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos
{
    public class CD_Riesgo
    {
        public List<RiesgoModel> LeerRiesgo(string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var riesgos =
                    (from R in contexto.Riesgo
                     join RI in contexto.RiesgoImpacto on R.IdRiesgoImpacto equals RI.IdRiesgoImpacto
                     join RP in contexto.RiesgoProbabilidad on R.IdRiesgoProbabilidad equals RP.IdRiesoProbabilidad
                     join RF in contexto.CatalogoGeneral on R.CatalogoFuenteId equals RF.IdCatalogo
                     join RC in contexto.CatalogoGeneral on R.CatalogoCategoriaId equals RC.IdCatalogo
                     select new RiesgoModel
                     {
                         IdRiesgo = R.IdRiesgo,
                         FechaIdentificacion = R.FechaIdentificacion,
                         Categoria = new CatalogoGeneralModel
                         {
                             DescCorta = RC.DescCorta,
                             DescLarga = RC.DescLarga
                         },
                         Fuente = new CatalogoGeneralModel
                         {
                             DescCorta = RF.DescCorta,
                             DescLarga = RF.DescLarga
                         },
                         DescripcionRiesgo = R.DescripcionRiesgo,
                         DescripcionEfecto = R.DescripcionEfecto,
                         Causas = R.Causas,
                         EventoMaterializacion = R.EventoMaterializacion,
                         Impacto = new RiesgoImpactoModel
                         {
                             Cualitativo = RI.Cualitativo,
                             Valor = RI.Valor
                         },
                         Probabilidad = new RiesgoProbabilidadModel
                         {
                             Cualitativo = RP.Cualitativo,
                             Valor = RP.Valor
                         },
                         Evaluacion = contexto.RiesgoEvaluacion.Select(x => new RiesgoEvaluacionModel
                         {
                             Minimo = x.Minimo,
                             Maximo = x.Maximo,
                             Color = x.Color,
                             Severidad = x.Severidad
                         }).ToList(),
                         Activo = R.Activo
                     }).ToList();

                return riesgos;
            }
        }

        public RiesgoModel LeerRiesgo(int idRiesgo, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var riesgo =
                    (from R in contexto.Riesgo
                     where R.IdRiesgo == idRiesgo
                     select new RiesgoModel
                     {
                         IdRiesgo = R.IdRiesgo,
                         FechaIdentificacion = R.FechaIdentificacion,
                         CatalogoCategoriaId = R.CatalogoCategoriaId,
                         CatalogoFuenteId = R.CatalogoFuenteId,
                         DescripcionRiesgo = R.DescripcionRiesgo,
                         DescripcionEfecto = R.DescripcionEfecto,
                         Causas = R.Causas,
                         EventoMaterializacion = R.EventoMaterializacion,
                         IdRiesgoImpacto = R.IdRiesgoImpacto,
                         IdRiesgoProbabilidad = R.IdRiesgoProbabilidad,
                         Activo = R.Activo
                     }).FirstOrDefault();

                return riesgo;
            }
        }

        public (bool Estatus, string Mensaje) CrearRiesgo(RiesgoModel _riesgo, long idUsuario, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                if (_riesgo.IdRiesgo != 0) return (false, Mensaje.MensajeErrorDatos);

                var riesgo = new Riesgo
                {
                    FechaIdentificacion = _riesgo.FechaIdentificacion,
                    CatalogoCategoriaId = _riesgo.CatalogoCategoriaId,
                    CatalogoFuenteId = _riesgo.CatalogoFuenteId,
                    DescripcionRiesgo = _riesgo.DescripcionRiesgo,
                    DescripcionEfecto = _riesgo.DescripcionEfecto,
                    Causas = _riesgo.Causas,
                    EventoMaterializacion = _riesgo.EventoMaterializacion,
                    IdRiesgoImpacto = _riesgo.IdRiesgoImpacto,
                    IdRiesgoProbabilidad = _riesgo.IdRiesgoProbabilidad,
                    Activo = _riesgo.Activo,
                    IdUCreo = idUsuario,
                    FechaCreo = DateTime.Now
                };

                contexto.Riesgo.Add(riesgo);
                contexto.SaveChanges();

                return (true, Mensaje.MensajeGuardadoExito);
            }
        }

        public List<ProyectoRiesgoEstrategiaModel> LeerEstrategia(int idProyectoRiesgo, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var estrategias =
                    (from PRE in contexto.ProyectoRiesgoEstrategia
                     join E in contexto.CatalogoGeneral on PRE.CatalogoEstrategiaId equals E.IdCatalogo
                     join U in contexto.Usuario on PRE.IdUResponsable equals U.IdUsuario
                     where PRE.IdProyectoRiesgo == idProyectoRiesgo
                     select new ProyectoRiesgoEstrategiaModel
                     {
                         IdProyectoRiesgoEstrategia = PRE.IdProyectoRiesgoEstrategia,
                         Estrategia = E.DescCorta,
                         PlanMitigacion = PRE.PlanMitigacion,
                         Responsable = U.Nombre + " " + U.ApPaterno + " " + U.ApMaterno,
                         DisparadorPlan = PRE.DisparadorPlan,
                         FechaIdentificacion = PRE.FechaIdentificacion ?? new DateTime(),
                         Realizada = PRE.Realizada
                     }).ToList();

                return estrategias;
            }
        }

        public ProyectoRiesgoEstrategiaModel LeerEstrategiaPorId(int idProyectoRiesgoEstrategia, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var estrategia =
                    (from PRE in contexto.ProyectoRiesgoEstrategia
                     where PRE.IdProyectoRiesgoEstrategia == idProyectoRiesgoEstrategia
                     select new ProyectoRiesgoEstrategiaModel
                     {
                         IdProyectoRiesgoEstrategia = PRE.IdProyectoRiesgoEstrategia,
                         CatalogoEstrategiaId = PRE.CatalogoEstrategiaId,
                         PlanMitigacion = PRE.PlanMitigacion,
                         IdUResponsable = PRE.IdUResponsable,
                         DisparadorPlan = PRE.DisparadorPlan,
                         FechaIdentificacion = PRE.FechaIdentificacion ?? new DateTime(),
                         Realizada = PRE.Realizada
                     }).SingleOrDefault();

                return estrategia;
            }
        }

        public (bool Estatus, string Mensaje) CrearEstrategia(ProyectoRiesgoEstrategiaModel _estrategia, long idUsuario, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                if (_estrategia.IdProyectoRiesgoEstrategia != 0 || _estrategia.IdProyectoRiesgo <= 0)
                    return (false, Mensaje.MensajeErrorDatos);

                var estrategia = new ProyectoRiesgoEstrategia
                {
                    IdProyectoRiesgo = _estrategia.IdProyectoRiesgo,
                    CatalogoEstrategiaId = _estrategia.CatalogoEstrategiaId,
                    PlanMitigacion = _estrategia.PlanMitigacion,
                    IdUResponsable = _estrategia.IdUResponsable,
                    DisparadorPlan = _estrategia.DisparadorPlan,
                    Realizada = _estrategia.Realizada,
                    FechaIdentificacion = _estrategia.FechaIdentificacion,
                    IdUCreo = idUsuario,
                    FechaCreo = DateTime.Now
                };

                contexto.ProyectoRiesgoEstrategia.Add(estrategia);
                contexto.SaveChanges();

                return (true, Mensaje.MensajeGuardadoExito);
            }
        }

        public (bool Estatus, string Mensaje) EditarEstrategia(ProyectoRiesgoEstrategiaModel _estrategia, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                if (_estrategia.IdProyectoRiesgoEstrategia <= 0 || _estrategia.IdProyectoRiesgo <= 0)
                    return (false, Mensaje.MensajeErrorDatos);

                var estrategia = contexto.ProyectoRiesgoEstrategia.FirstOrDefault(x => x.IdProyectoRiesgoEstrategia == _estrategia.IdProyectoRiesgoEstrategia);

                estrategia.CatalogoEstrategiaId = _estrategia.CatalogoEstrategiaId;
                estrategia.PlanMitigacion = _estrategia.PlanMitigacion;
                estrategia.IdUResponsable = _estrategia.IdUResponsable;
                estrategia.DisparadorPlan = _estrategia.DisparadorPlan;
                estrategia.Realizada = _estrategia.Realizada;
                estrategia.FechaIdentificacion = _estrategia.FechaIdentificacion;

                contexto.SaveChanges();

                return (true, Mensaje.MensajeGuardadoExito);
            }
        }

        public (bool Estatus, string Mensaje) EditarRiesgo(RiesgoModel _riesgo, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var riesgo = contexto.Riesgo.Find(_riesgo.IdRiesgo);
                if (riesgo == null) return (false, Mensaje.MensajeErrorDatos);

                riesgo.FechaIdentificacion = _riesgo.FechaIdentificacion;
                riesgo.CatalogoCategoriaId = _riesgo.CatalogoCategoriaId;
                riesgo.CatalogoFuenteId = _riesgo.CatalogoFuenteId;
                riesgo.DescripcionRiesgo = _riesgo.DescripcionRiesgo;
                riesgo.DescripcionEfecto = _riesgo.DescripcionEfecto;
                riesgo.Causas = _riesgo.Causas;
                riesgo.EventoMaterializacion = _riesgo.EventoMaterializacion;
                riesgo.IdRiesgoImpacto = _riesgo.IdRiesgoImpacto;
                riesgo.IdRiesgoProbabilidad = _riesgo.IdRiesgoProbabilidad;
                riesgo.Activo = _riesgo.Activo;

                contexto.SaveChanges();

                return (true, Mensaje.MensajeGuardadoExito);
            }
        }

        public (bool Estatus, string Mensaje) ActivarRiesgo(int idRiesgo, bool activo, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var riesgo = contexto.Riesgo.Find(idRiesgo);
                if (riesgo == null) return (false, Mensaje.MensajeErrorDatos);

                riesgo.Activo = activo;
                contexto.SaveChanges();

                return (true, Mensaje.MensajeGuardadoExito);
            }
        }

        public List<ProyectoRiesgoModel> LeerProyectoRiesgo(long idProyecto, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var riesgos =
                    (from R in contexto.ProyectoRiesgo
                     join P in contexto.Proyecto on R.IdProyecto equals P.IdProyecto
                     join RI in contexto.RiesgoImpacto on R.IdRiesgoImpacto equals RI.IdRiesgoImpacto
                     join RP in contexto.RiesgoProbabilidad on R.IdRiesgoProbabilidad equals RP.IdRiesoProbabilidad
                     join RF in contexto.CatalogoGeneral on R.CatalogoFuenteId equals RF.IdCatalogo
                     join RC in contexto.CatalogoGeneral on R.CatalogoCategoriaId equals RC.IdCatalogo
                     //join TempU in contexto.Usuario on R.IdUResponsable equals TempU.IdUsuario into TU
                     //from U in TU.DefaultIfEmpty()
                     //join TempRE in contexto.CatalogoGeneral on R.CatalogoEstrategiaId equals TempRE.IdCatalogo into TRE
                     //from RE in TRE.DefaultIfEmpty()
                     where R.IdProyecto == idProyecto && R.Activo
                     select new ProyectoRiesgoModel
                     {
                         IdProyectoRiesgo = R.IdProyectoRiesgo,
                         FechaIdentificacion = R.FechaIdentificacion,
                         ConsecutivoProyecto = R.ConsecutivoProyecto,
                         //Usuario = new UsuarioModel
                         //{
                         //    NombreCompleto = U == null ? "" : U.Nombre + " " + U.ApPaterno + " " + U.ApMaterno,
                         //    NumEmpleado = U.NumEmpleado
                         //},
                         Categoria = new CatalogoGeneralModel
                         {
                             DescCorta = RC.DescCorta,
                             DescLarga = RC.DescLarga
                         },
                         Fuente = new CatalogoGeneralModel
                         {
                             DescCorta = RF.DescCorta,
                             DescLarga = RF.DescLarga
                         },
                         //Estrategia = new CatalogoGeneralModel
                         //{
                         //    DescCorta = RE == null ? "" : RE.DescCorta,
                         //    DescLarga = RE == null ? "" : RE.DescLarga
                         //},
                         DescripcionRiesgo = R.DescripcionRiesgo,
                         DescripcionEfecto = R.DescripcionEfecto,
                         Causas = R.Causas,
                         EventoMaterializacion = R.EventoMaterializacion,
                         //PlanMitigacion = R.PlanMitigacion ?? "",
                         //DisparadorPlan = R.DisparadorPlan ?? "",
                         //Descripcion = R.Descripcion ?? "",
                         Impacto = new RiesgoImpactoModel
                         {
                             Cualitativo = RI.Cualitativo,
                             Valor = RI.Valor
                         },
                         Probabilidad = new RiesgoProbabilidadModel
                         {
                             Cualitativo = RP.Cualitativo,
                             Valor = RP.Valor
                         },
                         Evaluacion = contexto.RiesgoEvaluacion.Select(x => new RiesgoEvaluacionModel
                         {
                             Minimo = x.Minimo,
                             Maximo = x.Maximo,
                             Color = x.Color,
                             Severidad = x.Severidad
                         }).ToList(),
                         Proyecto = new ProyectosModel
                         {
                             Clave = P.Clave
                         },
                         Comentarios =
                            (from RC in contexto.ProyectoRiesgoComentario
                             join U in contexto.Usuario on RC.IdUCreo equals U.IdUsuario
                             where RC.IdProyectoRiesgo == R.IdProyectoRiesgo && RC.Activo
                             select new ProyectoRiesgoComentarioModel
                             {
                                 IdProyectoRiesgoComentario = RC.IdProyectoRiesgoComentario,
                                 Comentario = RC.Comentario,
                                 Autogenerado = RC.Autogenerado,
                                 FechaCreo = RC.FechaCreo,
                                 Usuario = new UsuarioModel
                                 {
                                     NombreCompleto = U.Nombre + " " + U.ApPaterno + " " + U.ApMaterno,
                                     NumEmpleado = U.NumEmpleado
                                 }
                             }).OrderBy(x => x.FechaCreo).ToList()
                     }).ToList();

                return riesgos;
            }
        }

        public ProyectoRiesgoModel LeerProyectoRiesgoPorId(int idProyectoRiesgo, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var riesgo =
                    (from R in contexto.ProyectoRiesgo
                     join P in contexto.Proyecto on R.IdProyecto equals P.IdProyecto
                     where R.IdProyectoRiesgo == idProyectoRiesgo && R.Activo
                     select new ProyectoRiesgoModel
                     {
                         IdProyectoRiesgo = R.IdProyectoRiesgo,
                         ConsecutivoProyecto = R.ConsecutivoProyecto,
                         IdProyecto = R.IdProyecto,
                         FechaIdentificacion = R.FechaIdentificacion,
                         CatalogoCategoriaId = R.CatalogoCategoriaId,
                         CatalogoFuenteId = R.CatalogoFuenteId,
                         DescripcionRiesgo = R.DescripcionRiesgo,
                         DescripcionEfecto = R.DescripcionEfecto,
                         Causas = R.Causas,
                         EventoMaterializacion = R.EventoMaterializacion,
                         IdRiesgoImpacto = R.IdRiesgoImpacto,
                         //IdUResponsable = R.IdUResponsable ?? -1,
                         IdRiesgoProbabilidad = R.IdRiesgoProbabilidad,
                         //CatalogoEstrategiaId = R.CatalogoEstrategiaId ?? -1,
                         //PlanMitigacion = R.PlanMitigacion,
                         //DisparadorPlan = R.DisparadorPlan,
                         //Descripcion = R.Descripcion,
                         Activo = R.Activo,
                         Proyecto = new ProyectosModel
                         {
                             Clave = P.Clave
                         }
                     }).FirstOrDefault();

                return riesgo;
            }
        }

        public (int IdRiesgo, bool Estatus, string Mensaje) CrearRiesgo(ProyectoRiesgoModel _riesgo, long idUsuario, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                if (_riesgo.IdProyectoRiesgo != 0) return (0, false, Mensaje.MensajeErrorDatos);

                //var usuarios = new CD_Proyecto().ConsultarEquipoProyecto(Convert.ToInt64(_riesgo.IdProyecto), conexionEF);
                //if (!usuarios.Select(x => x.IdUsuario).ToList().Contains(Convert.ToInt64(_riesgo.IdUResponsable))) return (false, Mensaje.MensajeErrorDatos);

                var riesgo = new ProyectoRiesgo
                {
                    IdProyecto = _riesgo.IdProyecto,
                    FechaIdentificacion = _riesgo.FechaIdentificacion,
                    CatalogoCategoriaId = _riesgo.CatalogoCategoriaId,
                    CatalogoFuenteId = _riesgo.CatalogoFuenteId,
                    DescripcionRiesgo = _riesgo.DescripcionRiesgo,
                    DescripcionEfecto = _riesgo.DescripcionEfecto,
                    Causas = _riesgo.Causas,
                    EventoMaterializacion = _riesgo.EventoMaterializacion,
                    IdRiesgoImpacto = _riesgo.IdRiesgoImpacto,
                    IdRiesgoProbabilidad = _riesgo.IdRiesgoProbabilidad,
                    //CatalogoEstrategiaId = _riesgo.CatalogoEstrategiaId,
                    //PlanMitigacion = _riesgo.PlanMitigacion,
                    //DisparadorPlan = _riesgo.DisparadorPlan,
                    //Descripcion = _riesgo.Descripcion,
                    //IdUResponsable = _riesgo.IdUResponsable,
                    Activo = _riesgo.Activo,
                    IdUCreo = idUsuario,
                    FechaCreo = DateTime.Now
                };
                riesgo.ConsecutivoProyecto = (short)((contexto.ProyectoRiesgo.Where(x => x.IdProyecto == riesgo.IdProyecto).Max(x => (short?)x.ConsecutivoProyecto) ?? 0) + 1);

                var impacto = contexto.RiesgoImpacto.ToList();
                var probabilidad = contexto.RiesgoProbabilidad.ToList();
                var evaluacion = contexto.RiesgoEvaluacion.ToList();
                var usuario = contexto.Usuario.FirstOrDefault(x => x.IdUsuario == idUsuario);

                var _impacto = impacto.FirstOrDefault(x => x.IdRiesgoImpacto == riesgo.IdRiesgoImpacto);
                var _probabilidad = probabilidad.FirstOrDefault(x => x.IdRiesoProbabilidad == riesgo.IdRiesgoProbabilidad);
                var _calificacion = _impacto.Valor * _probabilidad.Valor;
                var _severidad = evaluacion.FirstOrDefault(x => x.Minimo <= _calificacion && x.Maximo >= _calificacion);

                var comentario =
                    $"{usuario.Nombre + " " + usuario.ApPaterno} creó el riesgo:<br />" +
                    $"-Impacto: {_impacto.Cualitativo}<br />" +
                    $"-Probabilidad: {_probabilidad.Cualitativo}<br />" +
                    $"-Calificación: {_calificacion}<br />" +
                    $"-Severidad: {_severidad.Severidad}";

                var riesgoComentario = new ProyectoRiesgoComentario
                {
                    IdProyectoRiesgo = riesgo.IdProyectoRiesgo,
                    Comentario = comentario,
                    Autogenerado = true,
                    Activo = true,
                    IdUCreo = idUsuario,
                    FechaCreo = DateTime.Now
                };

                contexto.ProyectoRiesgo.Add(riesgo);
                contexto.ProyectoRiesgoComentario.Add(riesgoComentario);
                contexto.SaveChanges();

                return ((int)riesgo.IdProyectoRiesgo, true, Mensaje.MensajeGuardadoExito);
            }
        }

        public (bool Estatus, string Mensaje) EditarProyectoRiesgo(ProyectoRiesgoModel _riesgo, long idUsuario, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var riesgo = contexto.ProyectoRiesgo.Find(_riesgo.IdProyectoRiesgo);
                if (riesgo == null) return (false, Mensaje.MensajeErrorDatos);

                if (riesgo.IdRiesgoImpacto != _riesgo.IdRiesgoImpacto || riesgo.IdRiesgoProbabilidad != _riesgo.IdRiesgoProbabilidad)
                {
                    var impacto = contexto.RiesgoImpacto.ToList();
                    var probabilidad = contexto.RiesgoProbabilidad.ToList();
                    var evaluacion = contexto.RiesgoEvaluacion.ToList();
                    var usuario = contexto.Usuario.FirstOrDefault(x => x.IdUsuario == idUsuario);

                    var _impacto = impacto.FirstOrDefault(x => x.IdRiesgoImpacto == _riesgo.IdRiesgoImpacto);
                    var _probabilidad = probabilidad.FirstOrDefault(x => x.IdRiesoProbabilidad == _riesgo.IdRiesgoProbabilidad);
                    var _calificacion = _impacto.Valor * _probabilidad.Valor;
                    var _severidad = evaluacion.FirstOrDefault(x => x.Minimo <= _calificacion && x.Maximo >= _calificacion);

                    var comentario =
                        $"{usuario.Nombre + " " + usuario.ApPaterno} cambió:<br />" +
                        $"-Impacto: {_impacto.Cualitativo}<br />" +
                        $"-Probabilidad: {_probabilidad.Cualitativo}<br />" +
                        $"<br />" +
                        $"Impactando:<br />" +
                        $"-Calificación: {_calificacion}<br />" +
                        $"-Severidad: {_severidad.Severidad}";

                    var riesgoComentario = new ProyectoRiesgoComentario
                    {
                        IdProyectoRiesgo = riesgo.IdProyectoRiesgo,
                        Comentario = comentario,
                        Autogenerado = true,
                        Activo = true,
                        IdUCreo = idUsuario,
                        FechaCreo = DateTime.Now
                    };

                    contexto.ProyectoRiesgoComentario.Add(riesgoComentario);
                }

                riesgo.FechaIdentificacion = _riesgo.FechaIdentificacion;
                riesgo.CatalogoCategoriaId = _riesgo.CatalogoCategoriaId;
                riesgo.CatalogoFuenteId = _riesgo.CatalogoFuenteId;
                riesgo.DescripcionRiesgo = _riesgo.DescripcionRiesgo;
                riesgo.DescripcionEfecto = _riesgo.DescripcionEfecto;
                riesgo.Causas = _riesgo.Causas;
                riesgo.EventoMaterializacion = _riesgo.EventoMaterializacion;
                riesgo.IdRiesgoImpacto = _riesgo.IdRiesgoImpacto;
                riesgo.IdRiesgoProbabilidad = _riesgo.IdRiesgoProbabilidad;
                //riesgo.CatalogoEstrategiaId = _riesgo.CatalogoEstrategiaId;
                //riesgo.PlanMitigacion = _riesgo.PlanMitigacion;
                //riesgo.DisparadorPlan = _riesgo.DisparadorPlan;
                //riesgo.Descripcion = _riesgo.Descripcion;
                //riesgo.IdUResponsable = _riesgo.IdUResponsable;
                riesgo.Activo = _riesgo.Activo;

                contexto.SaveChanges();

                return (true, Mensaje.MensajeGuardadoExito);
            }
        }

        public (bool Estatus, string Mensaje) EliminarProyectoRiesgo(int idProyectoRiesgo, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var riesgo = contexto.ProyectoRiesgo.Find(idProyectoRiesgo);
                if (riesgo == null) return (false, Mensaje.MensajeErrorDatos);

                riesgo.Activo = false;
                contexto.SaveChanges();

                return (true, Mensaje.MensajeGuardadoExito);
            }
        }

        public List<ProyectoRiesgoComentarioModel> LeerRiesgoComentario(long idProyectoRiesgo, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var comentarios =
                    (from PRC in contexto.ProyectoRiesgoComentario
                     join U in contexto.Usuario on PRC.IdUCreo equals U.IdUsuario
                     where PRC.IdProyectoRiesgo == idProyectoRiesgo && PRC.Activo
                     select new ProyectoRiesgoComentarioModel
                     {
                         IdProyectoRiesgoComentario = PRC.IdProyectoRiesgoComentario,
                         IdProyectoRiesgo = PRC.IdProyectoRiesgo,
                         Comentario = PRC.Comentario,
                         Autogenerado = PRC.Autogenerado,
                         FechaCreo = PRC.FechaCreo,
                         Usuario = new UsuarioModel
                         {
                             NombreCompleto = U.Nombre + " " + U.ApPaterno + " " + U.ApMaterno,
                             NumEmpleado = U.NumEmpleado
                         }
                     }).OrderBy(x => x.FechaCreo).ToList();

                return comentarios;
            }
        }

        public (bool Estatus, string Mensaje) CrearRiesgoComentario(ProyectoRiesgoComentarioModel _comentario, string conexionEF, UsuarioModel usuario)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var riesgo = contexto.ProyectoRiesgo.Find(_comentario.IdProyectoRiesgo);
                if (riesgo == null) return (false, Mensaje.MensajeErrorDatos);

                var comentario = new ProyectoRiesgoComentario
                {
                    IdProyectoRiesgo = riesgo.IdProyectoRiesgo,
                    Comentario = _comentario.Comentario?.Trim(),
                    Activo = true,
                    Autogenerado = false,
                    IdUCreo = usuario.IdUsuario,
                    FechaCreo = DateTime.Now
                };

                contexto.ProyectoRiesgoComentario.Add(comentario);
                contexto.SaveChanges();

                return (true, Mensaje.MensajeGuardadoExito);
            }
        }

        public (bool Estatus, string Mensaje) EliminarRiesgoComentario(long idRiesgoComentario, string conexionEF, UsuarioModel usuario)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var riesgoComentario = contexto.ProyectoRiesgoComentario.Find(idRiesgoComentario);
                if (riesgoComentario == null) return (false, Mensaje.MensajeErrorDatos);

                if (riesgoComentario.Autogenerado) return (false, Mensaje.MensajeErrorDatos);

                riesgoComentario.Activo = false;
                riesgoComentario.IdUElimino = usuario.IdUsuario;
                riesgoComentario.FechaElimino = DateTime.Now;
                contexto.SaveChanges();

                return (true, Mensaje.MensajeEliminadoExito);
            }
        }

        public void SincronizarRiesgos(long idProyecto, long idUsuario, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var riesgos = contexto.Riesgo.Include(x => x.Usuario).Where(x => x.Activo).ToList();
                var proyectoRiesgos = contexto.ProyectoRiesgo.Where(x => x.IdProyecto == idProyecto).Select(x => x.IdRiesgo).ToList();

                var faltantes = riesgos.Where(x => !proyectoRiesgos.Contains(x.IdRiesgo)).Select(x => new ProyectoRiesgo
                {
                    IdRiesgo = x.IdRiesgo,
                    IdProyecto = idProyecto,
                    FechaIdentificacion = x.FechaIdentificacion,
                    CatalogoCategoriaId = x.CatalogoCategoriaId,
                    CatalogoFuenteId = x.CatalogoFuenteId,
                    DescripcionRiesgo = x.DescripcionRiesgo,
                    DescripcionEfecto = x.DescripcionEfecto,
                    Causas = x.Causas,
                    EventoMaterializacion = x.EventoMaterializacion,
                    IdRiesgoImpacto = x.IdRiesgoImpacto,
                    IdRiesgoProbabilidad = x.IdRiesgoProbabilidad,
                    Activo = true,
                    IdUCreo = x.IdUCreo,
                    FechaCreo = x.FechaCreo,
                    Usuario = x.Usuario
                }).ToList();

                var impacto = contexto.RiesgoImpacto.ToList();
                var probabilidad = contexto.RiesgoProbabilidad.ToList();
                var evaluacion = contexto.RiesgoEvaluacion.ToList();

                if (faltantes.Any())
                {
                    foreach (var riesgo in faltantes)
                    {
                        riesgo.ConsecutivoProyecto = (short)((contexto.ProyectoRiesgo.Where(x => x.IdProyecto == riesgo.IdProyecto).Max(x => (short?)x.ConsecutivoProyecto) ?? 0) + 1);
                        contexto.ProyectoRiesgo.Add(riesgo);

                        var _impacto = impacto.FirstOrDefault(x => x.IdRiesgoImpacto == riesgo.IdRiesgoImpacto);
                        var _probabilidad = probabilidad.FirstOrDefault(x => x.IdRiesoProbabilidad == riesgo.IdRiesgoProbabilidad);
                        var _calificacion = _impacto.Valor * _probabilidad.Valor;
                        var _severidad = evaluacion.FirstOrDefault(x => x.Minimo <= _calificacion && x.Maximo >= _calificacion);

                        var comentario =
                            $"{riesgo.Usuario.Nombre + " " + riesgo.Usuario.ApPaterno} creó el riesgo:<br />" +
                            $"-Impacto: {_impacto.Cualitativo}<br />" +
                            $"-Probabilidad: {_probabilidad.Cualitativo}<br />" +
                            $"-Calificación: {_calificacion}<br />" +
                            $"-Severidad: {_severidad.Severidad}";

                        var riesgoComentario = new ProyectoRiesgoComentario
                        {
                            IdProyectoRiesgo = riesgo.IdProyectoRiesgo,
                            Comentario = comentario,
                            Autogenerado = true,
                            Activo = true,
                            IdUCreo = riesgo.IdUCreo,
                            FechaCreo = riesgo.FechaCreo
                        };

                        contexto.ProyectoRiesgoComentario.Add(riesgoComentario);

                        contexto.SaveChanges();
                    }
                }
            }
        }
    }
}
