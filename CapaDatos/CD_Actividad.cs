using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CapaDatos.DataBaseModel;
using CapaDatos.Models;
using System.Data;
using System.Data.SqlClient;
using EntityFramework.BulkInsert.Extensions;
using EntityFramework.Extensions;
using CapaDatos.Constants;
using CapaDatos.Models.Constants;
using Newtonsoft.Json;
using DocumentFormat.OpenXml.Wordprocessing;
using DocumentFormat.OpenXml.Spreadsheet;
using System.Runtime.Remoting.Lifetime;
using DocumentFormat.OpenXml.ExtendedProperties;
using DocumentFormat.OpenXml.Presentation;
using System.Data.Entity;
using System.Data.SqlTypes;

namespace CapaDatos
{
    public class CD_Actividad
    {

        public long GuardarActividad(ActividadesModel ActividadModel, long IdUsuarioLogin, string Conexion)
        {
            try
            {
                //Nuevo
                if (ActividadModel.IdActividad == 0)
                {

                    using (var contexto = new BDProductividad_DEVEntities(Conexion))
                    {

                        //contexto.Configuration.LazyLoadingEnabled = false;
                        Actividad act = new Actividad();




                        act.IdUsuarioAsignado = ActividadModel.IdUsuarioAsignado;
                        act.Descripcion = ActividadModel.Descripcion;
                        act.DocumentoRef = ActividadModel.DocumentoRef;
                        act.Estatus = "A";
                        act.BR = ActividadModel.BR;
                        act.TiempoEjecucion = ActividadModel.TiempoEjecucion;
                        act.HorasFacturables = ActividadModel.HorasFacturables;
                        act.HorasAsignadas = ActividadModel.HorasAsignadas;
                        act.IdProyecto = ActividadModel.IdProyecto;
                        act.TipoActividadId = ActividadModel.TipoActividadId;
                        act.ClasificacionId = ActividadModel.ClasificacionId;
                        act.IdUsuarioResponsable = ActividadModel.IdUsuarioResponsable;
                        act.FechaInicio = ActividadModel.FechaInicio;
                        act.FechaSolicitado = ActividadModel.FechaSolicitado;
                        act.Planificada = ActividadModel.Planificada;
                        act.Prioridad = ActividadModel.Prioridad;
                        act.IdIteracion = ActividadModel.IdIteracion == -1 ? null : ActividadModel.IdIteracion;
                        //act.IdActividadRef = ActividadModel.IdActividadRef;
                        act.EstatusCte = "P";
                        act.IdUCreo = IdUsuarioLogin;
                        act.FechaCreo = DateTime.Now;
                        act.Retrabajo = ActividadModel.Retrabajo;
                        act.Critico = ActividadModel.Critico;
                        act.TipoId = ActividadModel.TipoId;
                        act.CriterioAceptacion = ActividadModel.CriterioAceptacion;
                        act.PrioridadId = ActividadModel.PrioridadId;
                        act.Puntos = ActividadModel.Puntos;

                        if (ActividadModel.TipoActividadId == FasePSP.Bug && ActividadModel.IdActividadRef > 0 )
                        {
                            var actividades = new CD_CatalogoGeneral().ObtenerActividadesQA(ActividadModel.IdProyecto, Conexion).Select(x => x.IdCatalogo).ToList();
                            if (actividades.Contains(Convert.ToInt64(ActividadModel.IdActividadRef)))

                                act.IdActividadRef = ActividadModel.IdActividadRef;
                            //throw new Exception("La actividad de referencia no corresponde al proyecto seleccionado");

                            act.IdActividadRef = ActividadModel.IdActividadRef;
                        }

                        act.IdListaRevision = ActividadModel.IdListaRevision;
                        act.IdWorkflow = contexto.WorkFlow.Where(w => w.IdProyecto == ActividadModel.IdProyecto && w.IdActividadTipo == ActividadModel.TipoId && w.EstatusR == "A").FirstOrDefault().IdWorkFlow; 

                        if (ActividadModel.IdListaRevision > 0)
                        {
                            //var confirmar = contexto.ListaRevision
                            //    .Where(x => x.IdProyecto == ActividadModel.IdProyecto
                            //    && x.CatalogoFaseId == ActividadModel.TipoActividadId
                            //    && x.CatalogoClasificacionId == ActividadModel.ClasificacionId)
                            //    .Select(x => x.IdListaRevision)
                            //    .ToList();

                            //if (!confirmar.Contains(ActividadModel.IdListaRevision ?? 0))
                            //    throw new Exception("El número de lista de revisión no es correcto");

                            var controles = contexto.ListaRevisionDetalle
                                .Where(x => x.IdListaRevision == ActividadModel.IdListaRevision && x.Activo == true)
                                .ToList()
                                .Select(x => new ActividadListaRevision
                                {
                                    IdActividad = act.IdActividad,
                                    FechaCreo = DateTime.Now,
                                    IdListaRevisionDetalle = x.IdListaRevisionDetalle,
                                    IdUCreo = IdUsuarioLogin
                                }).ToList();

                            act.IdActividadRef = ActividadModel.IdActividadRef;

                            contexto.ActividadListaRevision.AddRange(controles);
                        }

                        List<ActividadesValidacionModel> Validaciones = contexto.Autorizacion.Where(i => i.Tipo == 1 && i.Activo == true)
                                           .Select(s => new ActividadesValidacionModel
                                           {
                                               IdActividad = act.IdActividad,
                                               IdAutorizacion = s.IdAutorizacion,
                                               NombreAut = s.Nombre,
                                               Estatus = "P",
                                               Secuencia = s.Secuencia
                                           }).ToList();



                        ActividadValidaciones a;
                        List<ActividadValidaciones> lstact = new List<ActividadValidaciones>();
                        foreach (var actval in Validaciones)
                        {

                            a = new ActividadValidaciones();
                            a.IdAutorizacion = actval.IdAutorizacion;
                            a.NombreAut = actval.NombreAut;
                            a.Estatus = actval.Estatus;
                            a.Secuencia = actval.Secuencia;

                            lstact.Add(a);

                        }


                        //Inserto las fases 
                        TimeSpan trabajado = TimeSpan.Parse("00:00:00.000");
                        List<ActividadTrackingModel> LstTrck = contexto.TipoActividadFase.Where(w => w.TipoActividadId == act.TipoActividadId).
                                                  Select(s => new ActividadTrackingModel
                                                  {
                                                      IdFase = s.IdFase,
                                                      Nombre = s.Nombre,
                                                      Porcentaje = s.Porcentaje,
                                                      Trabajado = trabajado,
                                                      Orden = s.Orden,
                                                      Finalizado = false

                                                  }).ToList();

                        ActividadTracking t;
                        List<ActividadTracking> lstt = new List<ActividadTracking>();
                        foreach (var acttra in LstTrck)
                        {

                            t = new ActividadTracking();

                            t.IdFase = acttra.IdFase;
                            t.Nombre = acttra.Nombre;
                            t.Porcentaje = acttra.Porcentaje;
                            t.Trabajado = TimeSpan.Parse("00:00:00.000");
                            t.Orden = acttra.Orden;
                            t.Finalizado = false;
                            lstt.Add(t);

                        }


                        act.ActividadValidaciones = lstact;
                        act.ActividadTracking = lstt;

                        contexto.Actividad.Add(act);
                        contexto.SaveChanges();

                        if (ActividadModel.IdListaRevision != null && ActividadModel.IdListaRevision > 0)
                        {
                            var actividades =
                                (from A in contexto.Actividad
                                 join CG in contexto.CatalogoGeneral on A.TipoActividadId equals CG.IdCatalogo
                                 where new[] { "R", "L" }.Contains(A.Estatus) && A.IdProyecto == act.IdProyecto && A.TipoActividadId == act.TipoActividadId
                                 && A.ClasificacionId == act.ClasificacionId && A.IdListaRevision == null
                                 select A.IdActividad).ToList();

                            //if (act.IdActividadRef <= 0)
                            //    throw new Exception("La actividad de referencia es obligatoria");


                            //if (act.IdActividadRef >= 0)
                            //{
                            //    //if (!actividades.Contains(ActividadModel.IdActividadRef))
                            //    //    throw new Exception("La actividad de referencia no es valida");


                            //    if (!contexto.ActividadDependencia.Any(x => x.IdActividadD == act.IdActividad && x.IdActividad == ActividadModel.IdActividadRef))
                            //        contexto.ActividadDependencia.Add(new ActividadDependencia
                            //        {
                            //            IdActividad = ActividadModel.IdActividadRef,
                            //            IdActividadD = act.IdActividad
                            //        });

                            //}

                            contexto.SaveChanges();
                        }

                        //if (ActividadModel.TipoActividadId == FasePSP.Bug && ActividadModel.IdActividadRef > 0)
                        //{
                        //    ActividadDependencia dependencia = new ActividadDependencia();

                        //    dependencia.IdActividad = ActividadModel.IdActividadRef;
                        //    dependencia.IdActividadD = act.IdActividad;

                        //    contexto.ActividadDependencia.Add(dependencia);
                        //    contexto.SaveChanges();
                        //}

                        //contexto.ActividadValidaciones.AddRange(Validaciones);
                        //contexto.SaveChanges();



                        //Inserto la relacion si viene el dato

                        if(ActividadModel.IdActividadR1 != 0)
                        {

                            ActividadRelacion arel = new ActividadRelacion();

                            arel.IdActividad = act.IdActividad;
                            arel.IdActividadRelacionada = ActividadModel.IdActividadR1;

                            contexto.ActividadRelacion.Add(arel);
                            contexto.SaveChanges();
                        }

                        ActividadLog actlog = new ActividadLog();
                        actlog.IdActividad = act.IdActividad;
                        actlog.Descripcion = "Generó WorkItem";
                        actlog.IdUCreo = IdUsuarioLogin;
                        actlog.FechaHora = DateTime.Now;

                        GuardaActividadLog(actlog, Conexion);

                        return act.IdActividad;
                    }
                }
                //Modificar
                else
                {

                    using (var contexto = new BDProductividad_DEVEntities(Conexion))
                    {
                        contexto.Configuration.LazyLoadingEnabled = false;

                        var act = contexto.Actividad.Where(i => i.IdActividad == ActividadModel.IdActividad).FirstOrDefault();



                        bool ModificoFecha = act.FechaSolicitado != ActividadModel.FechaSolicitado ? true : false;
                        act.IdUsuarioAsignado = ActividadModel.IdUsuarioAsignado;
                        act.Descripcion = ActividadModel.Descripcion;
                        act.DocumentoRef = ActividadModel.DocumentoRef != null ? ActividadModel.DocumentoRef : act.DocumentoRef;
                        //act.Estatus = ActividadModel.Estatus;

                        act.BR = ActividadModel.BR;
                        act.TiempoEjecucion = ActividadModel.TiempoEjecucion;
                        act.HorasFacturables = ActividadModel.HorasFacturables;
                        act.HorasAsignadas = ActividadModel.HorasAsignadas;
                        act.IdProyecto = ActividadModel.IdProyecto;
                        act.TipoActividadId = ActividadModel.TipoActividadId;
                        act.ClasificacionId = ActividadModel.ClasificacionId;
                        act.IdUsuarioResponsable = ActividadModel.IdUsuarioResponsable;
                        act.FechaInicio = ActividadModel.FechaInicio;
                        act.FechaSolicitado = ActividadModel.FechaSolicitado;
                        act.IdIteracion = ActividadModel.IdIteracion == -1 ? null : ActividadModel.IdIteracion;
                        //act.IdActividadRef = ActividadModel.IdActividadRef;
                        act.HorasFinales = ActividadModel.HorasFinales;
                        act.FechaTermino = ActividadModel.FechaTermino;
                        //act.Prioridad = ActividadModel.Prioridad;
                        act.Planificada = ActividadModel.Planificada;
                        act.Retrabajo = ActividadModel.Retrabajo;
                        act.IdUMod = IdUsuarioLogin;
                        act.Critico = ActividadModel.Critico;
                        act.FechaMod = DateTime.Now;
                        act.TipoId = ActividadModel.TipoId;
                        act.CriterioAceptacion = ActividadModel.CriterioAceptacion;
                        act.PrioridadId = ActividadModel.PrioridadId;
                        act.Puntos = ActividadModel.Puntos;

                        act.IdWorkflow =  act.IdWorkflow == null ?  contexto.WorkFlow.Where(w => w.IdProyecto == ActividadModel.IdProyecto && w.IdActividadTipo == ActividadModel.TipoId && w.EstatusR == "A").FirstOrDefault().IdWorkFlow : act.IdWorkflow;

                        if (ActividadModel.TipoActividadId == FasePSP.Bug && ActividadModel.IdActividadRef > 0)
                        {
                            var actividades = new CD_CatalogoGeneral().ObtenerActividadesQA(ActividadModel.IdProyecto, Conexion).Select(x => x.IdCatalogo).ToList();
                            if (!actividades.Contains(Convert.ToInt64(ActividadModel.IdActividadRef)))
                                act.IdActividadRef = ActividadModel.IdActividadRef;
                            //throw new Exception("La actividad de referencia no corresponde al proyecto seleccionado");

                            act.IdActividadRef = ActividadModel.IdActividadRef;
                        }

                        act.IdListaRevision = ActividadModel.IdListaRevision;
                        if (ActividadModel.IdListaRevision == null || ActividadModel.IdListaRevision <= 0)
                        {
                            var controles =
                                contexto.ActividadListaRevision.Where(x => x.IdActividad == ActividadModel.IdActividad);
                            var hallazgos =
                                (from h in contexto.ActividadListaRevisionHallazgo
                                 join r in contexto.ActividadListaRevision on h.IdActividadListaRevision equals r.IdActividadListaRevision
                                 where r.IdActividad == ActividadModel.IdActividad
                                 select h);

                            if (hallazgos.Any()) contexto.ActividadListaRevisionHallazgo.RemoveRange(hallazgos);
                            if (controles.Any()) contexto.ActividadListaRevision.RemoveRange(controles);
                        }
                        else
                        {
                            //var confirmar = contexto.ListaRevision
                            //    .Where(x => x.IdProyecto == ActividadModel.IdProyecto
                            //    && x.CatalogoFaseId == ActividadModel.TipoActividadId
                            //    && x.CatalogoClasificacionId == ActividadModel.ClasificacionId)
                            //    .Select(x => x.IdListaRevision)
                            //    .ToList();

                            //if (!confirmar.Contains(ActividadModel.IdListaRevision ?? 0))
                            //    throw new Exception("El número de lista de revisión no es correcto");

                            var controles =
                                (from ALR in contexto.ActividadListaRevision
                                 join LRD in contexto.ListaRevisionDetalle on ALR.IdListaRevisionDetalle equals LRD.IdListaRevisionDetalle
                                 where LRD.IdListaRevision != ActividadModel.IdListaRevision && ALR.IdActividad == ActividadModel.IdActividad
                                 select ALR);

                            var hallazgos =
                                (from h in contexto.ActividadListaRevisionHallazgo
                                 join r in contexto.ActividadListaRevision on h.IdActividadListaRevision equals r.IdActividadListaRevision
                                 where r.IdActividad == ActividadModel.IdActividad && h.IdActividadListaRevision != ActividadModel.IdListaRevision
                                 select h);

                            var actividades =
                                (from A in contexto.Actividad
                                 join CG in contexto.CatalogoGeneral on A.TipoActividadId equals CG.IdCatalogo
                                 where new[] { "R", "L" }.Contains(A.Estatus) && A.IdProyecto == ActividadModel.IdProyecto && A.TipoActividadId == ActividadModel.TipoActividadId
                                 && A.ClasificacionId == ActividadModel.ClasificacionId && A.IdListaRevision == null
                                 select A.IdActividad).ToList();

                            //if (ActividadModel.IdActividadRef <= 0)
                            //    throw new Exception("La actividad de referencia es obligatoria");

                            //if (!actividades.Contains(ActividadModel.IdActividadRef))
                            //    throw new Exception("La actividad de referencia no es valida");

                            ////if (!contexto.ActividadDependencia.Any(x => x.IdActividadD == ActividadModel.IdActividad && x.IdActividad == ActividadModel.IdActividadRef))
                            ////    contexto.ActividadDependencia.Add(new ActividadDependencia
                            ////    {
                            ////        IdActividad = ActividadModel.IdActividadRef,
                            ////        IdActividadD = ActividadModel.IdActividad
                            ////    });

                            act.IdActividadRef = ActividadModel.IdActividadRef;

                            if (hallazgos.Any()) contexto.ActividadListaRevisionHallazgo.RemoveRange(hallazgos);
                            if (controles.Any()) contexto.ActividadListaRevision.RemoveRange(controles);
                        }

                        contexto.SaveChanges();

                        ActividadLog actlog = new ActividadLog();
                        actlog.IdActividad = act.IdActividad;
                        actlog.Descripcion = "Actualizó/Modificó WorkItem";
                        actlog.IdUCreo = IdUsuarioLogin;
                        actlog.FechaHora = DateTime.Now;

                        GuardaActividadLog(actlog, Conexion);

                        if (ModificoFecha) {

                            ActividadLog actlog2 = new ActividadLog();
                            actlog.IdActividad = act.IdActividad;
                            actlog.Descripcion = "Cambio la fecha compromiso a "  + ( act.FechaSolicitado == null  ? "Sin fecha"  : DateTime.Parse(act.FechaSolicitado.ToString()).ToShortDateString()) ;
                            actlog.IdUCreo = IdUsuarioLogin;
                            actlog.FechaHora = DateTime.Now;

                            GuardaActividadLog(actlog, Conexion);
                        }


                        return act.IdActividad;
                    }

                }

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public long GuardarActividadAR(ActividadesModel ActividadModel,   long IdUsuarioLogin, string Conexion)
        {
            try
            {

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    //contexto.Configuration.LazyLoadingEnabled = false;
                    Actividad act = new Actividad();

                        var actref = contexto.Actividad.Where(w => w.IdActividad == ActividadModel.IdActividadR1).FirstOrDefault();


                        act.IdUsuarioAsignado = actref.IdUsuarioAsignado;
                        act.Descripcion = ActividadModel.Descripcion;
                        act.Estatus = "A";
                        act.BR = ActividadModel.BR;
                        act.TiempoEjecucion = 0;
                        act.HorasFacturables = 0;
                         act.HorasAsignadas = 0;
                        act.IdProyecto = actref.IdProyecto;
                        act.TipoActividadId = ActividadModel.TipoActividadId;
                        act.ClasificacionId = ActividadModel.ClasificacionId;
                        act.IdUsuarioResponsable = IdUsuarioLogin;
                        act.FechaInicio = DateTime.Now.AddDays(1);
                        act.FechaSolicitado = DateTime.Now.AddDays(1);
                        act.Planificada = ActividadModel.Planificada;
                        act.Prioridad = 1;
                        act.IdIteracion = actref.IdIteracion;
                        //act.IdActividadRef = ActividadModel.IdActividadRef;
                        act.EstatusCte = "P";
                        act.IdUCreo = IdUsuarioLogin;
                        act.FechaCreo = DateTime.Now;
                        act.Retrabajo = true;
                        act.Critico = true;
                        act.TipoId = ActividadModel.TipoId;
                        //act.CriterioAceptacion = ActividadModel.CriterioAceptacion;
                      

      

                        List<ActividadesValidacionModel> Validaciones = contexto.Autorizacion.Where(i => i.Tipo == 1 && i.Activo == true)
                                           .Select(s => new ActividadesValidacionModel
                                           {
                                               IdActividad = act.IdActividad,
                                               IdAutorizacion = s.IdAutorizacion,
                                               NombreAut = s.Nombre,
                                               Estatus = "P",
                                               Secuencia = s.Secuencia
                                           }).ToList();



                        ActividadValidaciones a;
                        List<ActividadValidaciones> lstact = new List<ActividadValidaciones>();
                        foreach (var actval in Validaciones)
                        {

                            a = new ActividadValidaciones();
                            a.IdAutorizacion = actval.IdAutorizacion;
                            a.NombreAut = actval.NombreAut;
                            a.Estatus = actval.Estatus;
                            a.Secuencia = actval.Secuencia;

                            lstact.Add(a);

                        }


                        //Inserto las fases 
                        TimeSpan trabajado = TimeSpan.Parse("00:00:00.000");
                        List<ActividadTrackingModel> LstTrck = contexto.TipoActividadFase.Where(w => w.TipoActividadId == act.TipoActividadId).
                                                  Select(s => new ActividadTrackingModel
                                                  {
                                                      IdFase = s.IdFase,
                                                      Nombre = s.Nombre,
                                                      Porcentaje = s.Porcentaje,
                                                      Trabajado = trabajado,
                                                      Orden = s.Orden,
                                                      Finalizado = false

                                                  }).ToList();

                        ActividadTracking t;
                        List<ActividadTracking> lstt = new List<ActividadTracking>();
                        foreach (var acttra in LstTrck)
                        {

                            t = new ActividadTracking();

                            t.IdFase = acttra.IdFase;
                            t.Nombre = acttra.Nombre;
                            t.Porcentaje = acttra.Porcentaje;
                            t.Trabajado = TimeSpan.Parse("00:00:00.000");
                            t.Orden = acttra.Orden;
                            t.Finalizado = false;
                            lstt.Add(t);

                        }


                        act.ActividadValidaciones = lstact;
                        act.ActividadTracking = lstt;

                        contexto.Actividad.Add(act);
                        contexto.SaveChanges();

   

                        //if (ActividadModel.TipoActividadId == FasePSP.Bug && ActividadModel.IdActividadRef > 0)
                        //{
                        //    ActividadDependencia dependencia = new ActividadDependencia();

                        //    dependencia.IdActividad = ActividadModel.IdActividadRef;
                        //    dependencia.IdActividadD = act.IdActividad;

                        //    contexto.ActividadDependencia.Add(dependencia);
                        //    contexto.SaveChanges();
                        //}

                        //contexto.ActividadValidaciones.AddRange(Validaciones);
                        //contexto.SaveChanges();



                        //Inserto la relacion si viene el dato

                        if (ActividadModel.IdActividadR1 != 0)
                        {

                            ActividadRelacion arel = new ActividadRelacion();

                            arel.IdActividad = act.IdActividad;
                            arel.IdActividadRelacionada = ActividadModel.IdActividadR1;

                            contexto.ActividadRelacion.Add(arel);
                            contexto.SaveChanges();
                        }


                    //Si la actividad relacionada viene de un PR la inserto la relacion en la actividad principal
                        if (actref.IdListaRevision != null) {

                        var actp = contexto.ActividadRelacion.Where(w => w.IdActividad == actref.IdActividad).FirstOrDefault();

                        if (actp != null) {
                            ActividadRelacion arel = new ActividadRelacion();

                            arel.IdActividad = act.IdActividad;
                            arel.IdActividadRelacionada = actp.IdActividadRelacionada;

                            contexto.ActividadRelacion.Add(arel);
                            contexto.SaveChanges();

                        }


                    }
                        ActividadLog actlog = new ActividadLog();
                        actlog.IdActividad = act.IdActividad;
                        actlog.Descripcion = "Generó Workitem";
                        actlog.IdUCreo = IdUsuarioLogin;
                        actlog.FechaHora = DateTime.Now;

                        GuardaActividadLog(actlog, Conexion);

                        return act.IdActividad;
                    }
                


            }
            catch (Exception ex)
            {

                throw ex;
            }

        }
        public bool GuardarActividadARMultiple(ActividadesModel ActividadModel, List<long> LstAsignados,  long IdUsuarioLogin, string Conexion)
        {
            try
            {

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    foreach (var item in LstAsignados)
                    {


                        //contexto.Configuration.LazyLoadingEnabled = false;
                        Actividad act = new Actividad();

                        var actref = contexto.Actividad.Where(w => w.IdActividad == ActividadModel.IdActividadR1).FirstOrDefault();


                        act.IdUsuarioAsignado = item;
                        act.Descripcion = ActividadModel.Descripcion;
                        act.Estatus = "A";
                        act.BR = ActividadModel.BR;
                        act.TiempoEjecucion = 0;
                        act.HorasFacturables = ActividadModel.HorasFacturables;
                        act.HorasAsignadas = ActividadModel.HorasAsignadas;
                        act.IdProyecto = actref.IdProyecto;
                        act.TipoActividadId = ActividadModel.TipoActividadId;
                        act.ClasificacionId = ActividadModel.ClasificacionId;
                        act.IdUsuarioResponsable = ActividadModel.IdUsuarioResponsable;
                        act.FechaInicio = ActividadModel.FechaInicio;
                        act.FechaSolicitado = ActividadModel.FechaSolicitado;
                        act.Planificada = ActividadModel.Planificada;
                        act.Prioridad = 1;
                        act.PrioridadId = ActividadModel.PrioridadId;
                        act.IdIteracion = ActividadModel.IdIteracion == -1? null : ActividadModel.IdIteracion;
                        //act.IdActividadRef = ActividadModel.IdActividadRef;
                        act.EstatusCte = "P";
                        act.IdUCreo = IdUsuarioLogin;
                        act.FechaCreo = DateTime.Now;
                        act.Retrabajo = true;
                        act.Critico = true;
                        act.TipoId = ActividadModel.TipoId;
                        //act.CriterioAceptacion = ActividadModel.CriterioAceptacion;




                        List<ActividadesValidacionModel> Validaciones = contexto.Autorizacion.Where(i => i.Tipo == 1 && i.Activo == true)
                                           .Select(s => new ActividadesValidacionModel
                                           {
                                               IdActividad = act.IdActividad,
                                               IdAutorizacion = s.IdAutorizacion,
                                               NombreAut = s.Nombre,
                                               Estatus = "P",
                                               Secuencia = s.Secuencia
                                           }).ToList();



                        ActividadValidaciones a;
                        List<ActividadValidaciones> lstact = new List<ActividadValidaciones>();
                        foreach (var actval in Validaciones)
                        {

                            a = new ActividadValidaciones();
                            a.IdAutorizacion = actval.IdAutorizacion;
                            a.NombreAut = actval.NombreAut;
                            a.Estatus = actval.Estatus;
                            a.Secuencia = actval.Secuencia;

                            lstact.Add(a);

                        }


                        //Inserto las fases 
                        TimeSpan trabajado = TimeSpan.Parse("00:00:00.000");
                        List<ActividadTrackingModel> LstTrck = contexto.TipoActividadFase.Where(w => w.TipoActividadId == act.TipoActividadId).
                                                  Select(s => new ActividadTrackingModel
                                                  {
                                                      IdFase = s.IdFase,
                                                      Nombre = s.Nombre,
                                                      Porcentaje = s.Porcentaje,
                                                      Trabajado = trabajado,
                                                      Orden = s.Orden,
                                                      Finalizado = false

                                                  }).ToList();

                        ActividadTracking t;
                        List<ActividadTracking> lstt = new List<ActividadTracking>();
                        foreach (var acttra in LstTrck)
                        {

                            t = new ActividadTracking();

                            t.IdFase = acttra.IdFase;
                            t.Nombre = acttra.Nombre;
                            t.Porcentaje = acttra.Porcentaje;
                            t.Trabajado = TimeSpan.Parse("00:00:00.000");
                            t.Orden = acttra.Orden;
                            t.Finalizado = false;
                            lstt.Add(t);

                        }


                        act.ActividadValidaciones = lstact;
                        act.ActividadTracking = lstt;

                        contexto.Actividad.Add(act);
                        contexto.SaveChanges();



                        //if (ActividadModel.TipoActividadId == FasePSP.Bug && ActividadModel.IdActividadRef > 0)
                        //{
                        //    ActividadDependencia dependencia = new ActividadDependencia();

                        //    dependencia.IdActividad = ActividadModel.IdActividadRef;
                        //    dependencia.IdActividadD = act.IdActividad;

                        //    contexto.ActividadDependencia.Add(dependencia);
                        //    contexto.SaveChanges();
                        //}

                        //contexto.ActividadValidaciones.AddRange(Validaciones);
                        //contexto.SaveChanges();



                        //Inserto la relacion si viene el dato

                        if (ActividadModel.IdActividadR1 != 0)
                        {

                            ActividadRelacion arel = new ActividadRelacion();

                            arel.IdActividad = act.IdActividad;
                            arel.IdActividadRelacionada = ActividadModel.IdActividadR1;

                            contexto.ActividadRelacion.Add(arel);
                            contexto.SaveChanges();
                        }


                        //Si la actividad relacionada viene de un PR la inserto la relacion en la actividad principal
                        if (actref.IdListaRevision != null)
                        {

                            var actp = contexto.ActividadRelacion.Where(w => w.IdActividad == actref.IdActividad).FirstOrDefault();

                            if (actp != null)
                            {
                                ActividadRelacion arel = new ActividadRelacion();

                                arel.IdActividad = act.IdActividad;
                                arel.IdActividadRelacionada = actp.IdActividadRelacionada;

                                contexto.ActividadRelacion.Add(arel);
                                contexto.SaveChanges();

                            }


                        }
                        ActividadLog actlog = new ActividadLog();
                        actlog.IdActividad = act.IdActividad;
                        actlog.Descripcion = "Generó Workitem";
                        actlog.IdUCreo = IdUsuarioLogin;
                        actlog.FechaHora = DateTime.Now;

                        GuardaActividadLog(actlog, Conexion);
                    }

                    
                }

                return true;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public (bool Estatus, string Mensaje) GuardarActividadRepositorio(ActividadRepositorioModel _actividad, string conexion)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexion))
            {
                var actividad = contexto.Actividad.AsNoTracking().FirstOrDefault(x => x.IdActividad == _actividad.IdActividad);
                if (actividad == null)
                    return (false, "Actividad invalida");

                var repo = new ActividadRepositorio
                {
                    IdActividad = _actividad.IdActividad,
                    IdProyectoRepositorio = _actividad.IdProyectoRepositorio,
                    IdTipoLink = _actividad.IdTipoLink,
                    IdLink = _actividad.IdLink,
                    Descripcion = _actividad.Descripcion,
                    IdUCreo = _actividad.IdUCreo,
                    FechaCreo = DateTime.Now
                };

                contexto.ActividadRepositorio.Add(repo);
                contexto.SaveChanges();

                return (true, Mensaje.MensajeGuardadoExito);
            }
        }

        public (bool Estatus, string Mensaje) EliminarActividadRepositorio(ActividadRepositorioModel _actividad, string conexion)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexion))
            {
                var actividad = contexto.ActividadRepositorio
                    .FirstOrDefault(x => x.IdActividad == _actividad.IdActividad && x.IdActividadRepositorio == _actividad.IdActividadRepositorio);
                if (actividad == null)
                    return (false, "Actividad invalida");

                contexto.ActividadRepositorio.Remove(actividad);
                contexto.SaveChanges();

                return (true, Mensaje.MensajeEliminadoExito);
            }
        }

        public List<ActividadRepositorioModel> LeerActividadesRepositorio(long idActividad, string conexion)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexion))
            {
                var actividad = contexto.Actividad.AsNoTracking().FirstOrDefault(x => x.IdActividad == idActividad);
                if (actividad == null)
                    throw new Exception("Actividad invalida");

                if (actividad.ActividadRepositorio.Count == 0)
                    return new List<ActividadRepositorioModel>();

                if (actividad.Proyecto.ProyectoRepositorio.Count == 0)
                    throw new Exception("Debe configurar la informacion del repositorio del proyecto");

                var tipos = actividad.Proyecto.ProyectoRepositorio.Select(y => y.IdTipoRepositorio).ToList();
                var repositorio = contexto.TipoRepositorio.Where(x => tipos.Contains(x.IdTipoRepositorio)).ToList();
                var links =
                    actividad.ActividadRepositorio.Select(x => new ActividadRepositorioModel
                    {
                        IdActividadRepositorio = x.IdActividadRepositorio,
                        IdActividad = x.IdActividad,
                        IdTipoLink = x.IdTipoLink,
                        IdLink = x.IdLink,
                        Url = repositorio.Where(y => x.IdTipoLink == y.IdTipoLink && x.ProyectoRepositorio.IdTipoRepositorio == y.IdTipoRepositorio).Select(y =>
                            y.Ruta
                            .Replace("$organizacion", actividad.Proyecto.ProyectoRepositorio.FirstOrDefault(z => z.IdProyectoRepositorio == x.IdProyectoRepositorio).Organizacion)
                            .Replace("$proyecto", actividad.Proyecto.ProyectoRepositorio.FirstOrDefault(z => z.IdProyectoRepositorio == x.IdProyectoRepositorio).Proyecto)
                            .Replace("$id", x.IdLink)
                        ).FirstOrDefault(),
                        Usuario = contexto.Usuario.FirstOrDefault(y => y.IdUsuario == x.IdUCreo).Nombre,
                        NumEmpleado = contexto.Usuario.FirstOrDefault(y => y.IdUsuario == x.IdUCreo).NumEmpleado,
                        FechaCreo = x.FechaCreo,
                        Descripcion = x.Descripcion
                    }).ToList();

                return links;
            }
        }

        public void GuardaActividadLog(ActividadLog ActividadLog, string Conexion)
        {

            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {


                    contexto.ActividadLog.Add(ActividadLog);
                    contexto.SaveChanges();

                }


            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public void ObtieneActividades(FiltrosModel Filtros, ref List<ActividadesModel> LstActividades, ref List<ActividadesLogModel> LstActividadLog, ref List<ActividadesModel> LstActividadesEnc, string Conexion)
        {
            try
            {
                var tipoactividad = string.Join<string>(",", Filtros.LstTipoActividad.ConvertAll(s => s.ToString()));
                var clasificacion = string.Join<string>(",", Filtros.LstClasificacion.ConvertAll(s => s.ToString()));
                var asignado = string.Join<string>(",", Filtros.LstAsignado.ConvertAll(s => s.ToString()));
                var responsable = string.Join<string>(",", Filtros.LstResponsable.ConvertAll(s => s.ToString()));
                var proyecto = string.Join<string>(",", Filtros.LstProyecto.ConvertAll(s => s.ToString()));
                var prioridad = string.Join<string>(",", Filtros.LstPrioridad.ConvertAll(s => s.ToString()));
                var estatus = string.Join<string>(",", Filtros.LstEstatus.ConvertAll(s => s.ToString()));
                var sprint = string.Join<string>(",", Filtros.LstSprints.ConvertAll(s => s.ToString()));

                //var con = new SqlConnection(Conexion);
                //con.Open();

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("PanelActividades_sp", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@FechaCreoIni", Filtros.FechaCreoIni);
                sqlcmd.Parameters.AddWithValue("@FechaCreoFin", Filtros.FechaCreoFin);
                sqlcmd.Parameters.AddWithValue("@FechaSolIni", Filtros.FechaSolIni);
                sqlcmd.Parameters.AddWithValue("@FechaSolFin", Filtros.FechaSolFin);
                sqlcmd.Parameters.AddWithValue("@FechaCierreIni", Filtros.FechaCierreIni);
                sqlcmd.Parameters.AddWithValue("@FechaCierreFin", Filtros.FechaCierreFin);
                sqlcmd.Parameters.AddWithValue("@TipoActividad", tipoactividad);
                sqlcmd.Parameters.AddWithValue("@Clasificacion", clasificacion);
                sqlcmd.Parameters.AddWithValue("@UsuarioAsignado", asignado);
                sqlcmd.Parameters.AddWithValue("@UsuarioResponsable", responsable);
                sqlcmd.Parameters.AddWithValue("@Proyecto", proyecto);
                sqlcmd.Parameters.AddWithValue("@Estatus", estatus);
                sqlcmd.Parameters.AddWithValue("@Prioridad", prioridad);
                sqlcmd.Parameters.AddWithValue("@Actividad", Filtros.Actividades == null ? "" : Filtros.Actividades);
                sqlcmd.Parameters.AddWithValue("@IdUsuario", Filtros.IdUsuario);
                sqlcmd.Parameters.AddWithValue("@Sprint", sprint);

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
                da.Fill(ds);
                da.Dispose();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();


                var LstAct = ds.Tables[0];
                //var Log = ds.Tables[1];

                LstActividades = (from row in LstAct.AsEnumerable()
                                  select (
                                  new ActividadesModel
                                  {
                                      IdActividad = long.Parse(row["IdActividad"].ToString()),
                                      IdActividadStr = row["ClaveProyecto"].ToString() + "-" + row["IdActividad"].ToString(),
                                      IdProyecto = long.Parse(row["IdProyecto"].ToString()),
                                      Estatus = row["Estatus"].ToString(),
                                      EstatusStr = row["EstatusStr"].ToString(),
                                      Descripcion = row["Descripcion"].ToString(),
                                      TipoActividadStr = row["TipoActividad"].ToString(),
                                      ClasificacionStr = row["Clasificacion"].ToString(),
                                      PrioridadStr = row["PrioridadStr"].ToString(),
                                      AsignadoStr = row["Asignado"].ToString(),
                                      ResponsableStr = row["Responsable"].ToString(),
                                      AsignadoPath = "/Archivos/Fotos/" + row["AsignadoNumEmpleado"].ToString() + ".jpg",
                                      ResponsablePath = "/Archivos/Fotos/" + row["ResponsableNumEmpleado"].ToString() + ".jpg",
                                      ProyectoStr = row["Proyecto"].ToString(),
                                      FechaCreo = DateTime.Parse(row["FechaCreo"].ToString()),
                                      FechaSolicitado = DateTime.Parse(row["FechaSolicitado"].ToString()),
                                      HorasFacturables = row["HorasFacturables"].ToString() == "" ? (decimal?)null : Convert.ToDecimal(row["HorasFacturables"].ToString()),
                                      HorasAsignadas = row["HorasAsignadas"].ToString() == "" ? (decimal?)null : Convert.ToDecimal(row["HorasAsignadas"].ToString()),
                                      HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),
                                      FechaTermino = row["FechaTermino"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaTermino"].ToString()),
                                      MotivoRechazoId = row["MotivoRechazoId"].ToString() == "" ? (long?)null : long.Parse(row["MotivoRechazoId"].ToString()),
                                      DescripcionRechazo = row["DescripcionRechazo"].ToString(),
                                      ClaveTipoActividad = row["ClaveTipoActividad"].ToString(),
                                      ClaveUsuario = row["ClaveUsuario"].ToString(),
                                      Sprint = row["Sprint"].ToString(),
                                      FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
                                      EstatusCte = row["EstatusCte"].ToString(),
                                      EstatusCteStr = row["EstatusCteStr"].ToString(),
                                      ClaveClasificacionActividad = row["ClaveClasificacionActividad"].ToString(),
                                      ComentariosTotal = int.Parse(row["Comentarios"].ToString()),
                                      ArchivosTotal = int.Parse(row["Archivos"].ToString()),
                                      TipoActividadId = long.Parse(row["TipoActividadId"].ToString()),
                                      PSP = int.Parse(row["PSP"].ToString()),
                                      BR = row["BR"].ToString(),
                                      //DependenciasA = int.Parse(row["Dependencias"].ToString()),
                                      //DependenciasT = int.Parse(row["DependenciasT"].ToString()),
                                      TipoNombre = row["TipoNombre"].ToString(),
                                      TipoUrl = row["TipoUrl"].ToString(),
                                  })).OrderBy(o => o.IdActividad).ToList();


                var LstActEnc = ds.Tables[1];


                LstActividadesEnc = (from row in LstActEnc.AsEnumerable()
                                     select (
                                     new ActividadesModel
                                     {
                                         TipoActividadId = long.Parse(row["TipoActividadId"].ToString()),
                                         ClaveTipoActividad = row["ClaveTipoActividad"].ToString(),
                                         TipoActividadStr = row["TipoActividad"].ToString(),
                                         HorasFacturables = decimal.Parse(row["HorasFacturables"].ToString() == "" ? "0.00" : row["HorasFacturables"].ToString()),
                                         HorasAsignadas = decimal.Parse(row["HorasAsignadas"].ToString() == "" ? "0.00" : row["HorasAsignadas"].ToString()),
                                         HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),
                                         FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
                                         FechaFin = DateTime.Parse(row["FechaFin"].ToString())
                                     })).OrderBy(o => o.IdActividad).ToList();

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public void ObtieneActividadesPanel(FiltrosModel Filtros, ref List<ActividadesModel> LstActividades , string Conexion)
        {
            try
            { 
                var tipoactividad = string.Join<string>(",", Filtros.LstTipoActividad.ConvertAll(s => s.ToString()));
                var clasificacion = string.Join<string>(",", Filtros.LstClasificacion.ConvertAll(s => s.ToString()));
                var asignado = string.Join<string>(",", Filtros.LstAsignado.ConvertAll(s => s.ToString()));
                var responsable = string.Join<string>(",", Filtros.LstResponsable.ConvertAll(s => s.ToString()));
                var proyecto = string.Join<string>(",", Filtros.LstProyecto.ConvertAll(s => s.ToString()));
                var prioridad = string.Join<string>(",", Filtros.LstPrioridad.ConvertAll(s => s.ToString()));
                var estatus = string.Join<string>(",", Filtros.LstEstatus.ConvertAll(s => s.ToString()));
                var sprint = string.Join<string>(",", Filtros.LstSprints.ConvertAll(s => s.ToString()));

                //var con = new SqlConnection(Conexion);
                //con.Open();

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("PanelActividadesV2_sp", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@FechaCreoIni", Filtros.FechaCreoIni);
                sqlcmd.Parameters.AddWithValue("@FechaCreoFin", Filtros.FechaCreoFin);
                sqlcmd.Parameters.AddWithValue("@FechaSolIni", Filtros.FechaSolIni);
                sqlcmd.Parameters.AddWithValue("@FechaSolFin", Filtros.FechaSolFin);
                sqlcmd.Parameters.AddWithValue("@FechaCierreIni", Filtros.FechaCierreIni);
                sqlcmd.Parameters.AddWithValue("@FechaCierreFin", Filtros.FechaCierreFin);
                sqlcmd.Parameters.AddWithValue("@TipoActividad", tipoactividad);
                sqlcmd.Parameters.AddWithValue("@Clasificacion", clasificacion);
                sqlcmd.Parameters.AddWithValue("@UsuarioAsignado", asignado);
                sqlcmd.Parameters.AddWithValue("@UsuarioResponsable", responsable);
                sqlcmd.Parameters.AddWithValue("@Proyecto", proyecto);
                sqlcmd.Parameters.AddWithValue("@Estatus", estatus);
                sqlcmd.Parameters.AddWithValue("@Prioridad", prioridad);
                sqlcmd.Parameters.AddWithValue("@Actividad", Filtros.Actividades == null ? "" : Filtros.Actividades);
                sqlcmd.Parameters.AddWithValue("@IdUsuario", Filtros.IdUsuario);
                sqlcmd.Parameters.AddWithValue("@Sprint", sprint);

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
                da.Fill(ds);
                da.Dispose();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();


                var LstAct = ds.Tables[0];
                //var Log = ds.Tables[1];

                LstActividades = (from row in LstAct.AsEnumerable()
                                  select (
                                  new ActividadesModel
                                  {
                                      IdActividad = long.Parse(row["IdActividad"].ToString()),
                                      IdActividadStr = row["ClaveProyecto"].ToString() + "-" + row["IdActividad"].ToString(),
                                      IdProyecto = long.Parse(row["IdProyecto"].ToString()),
                                      Estatus = row["Estatus"].ToString(),
                                      EstatusStr = row["EstatusStr"].ToString(),
                                      Descripcion = row["Descripcion"].ToString(),
                                      TipoActividadStr = row["TipoActividad"].ToString(),
                                      ClasificacionStr = row["Clasificacion"].ToString(),
                                      PrioridadStr = row["PrioridadStr"].ToString(),
                                      AsignadoStr = row["Asignado"].ToString(),
                                      ResponsableStr = row["Responsable"].ToString(),
                                      AsignadoPath = "/Archivos/Fotos/" + row["AsignadoNumEmpleado"].ToString() + ".jpg",
                                      ResponsablePath = "/Archivos/Fotos/" + row["ResponsableNumEmpleado"].ToString() + ".jpg",
                                      ProyectoStr = row["Proyecto"].ToString(),
                                      FechaCreo = DateTime.Parse(row["FechaCreo"].ToString()),
                                      FechaSolicitado = DateTime.Parse(row["FechaSolicitado"].ToString()),
                                      HorasFacturables = row["HorasFacturables"].ToString() == "" ? (decimal?)null : Convert.ToDecimal(row["HorasFacturables"].ToString()),
                                      HorasAsignadas = row["HorasAsignadas"].ToString() == "" ? (decimal?)null : Convert.ToDecimal(row["HorasAsignadas"].ToString()),
                                      HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),
                                      FechaTermino = row["FechaTermino"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaTermino"].ToString()),
                                      MotivoRechazoId = row["MotivoRechazoId"].ToString() == "" ? (long?)null : long.Parse(row["MotivoRechazoId"].ToString()),
                                      DescripcionRechazo = row["DescripcionRechazo"].ToString(),
                                      ClaveTipoActividad = row["ClaveTipoActividad"].ToString(),
                                      ClaveUsuario = row["ClaveUsuario"].ToString(),
                                      Sprint = row["Sprint"].ToString(),
                                      FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
                                      EstatusCte = row["EstatusCte"].ToString(),
                                      EstatusCteStr = row["EstatusCteStr"].ToString(),
                                      ClaveClasificacionActividad = row["ClaveClasificacionActividad"].ToString(),
                                      ComentariosTotal = int.Parse(row["Comentarios"].ToString()),
                                      ArchivosTotal = int.Parse(row["Archivos"].ToString()),
                                      TipoActividadId = long.Parse(row["TipoActividadId"].ToString()),
                                      PSP = int.Parse(row["PSP"].ToString()),
                                      BR = row["BR"].ToString(),
                                      DependenciasA = int.Parse(row["Dependencias"].ToString()),
                                      DependenciasT = int.Parse(row["DependenciasT"].ToString()),
                                      TipoNombre = row["TipoNombre"].ToString(),
                                      TipoUrl = row["TipoUrl"].ToString(),
                                  })).OrderBy(o => o.IdActividad).ToList();


                //var LstActEnc = ds.Tables[1];


                //LstActividadesEnc = (from row in LstActEnc.AsEnumerable()
                //                     select (
                //                     new ActividadesModel
                //                     {
                //                         TipoActividadId = long.Parse(row["TipoActividadId"].ToString()),
                //                         ClaveTipoActividad = row["ClaveTipoActividad"].ToString(),
                //                         TipoActividadStr = row["TipoActividad"].ToString(),
                //                         HorasFacturables = decimal.Parse(row["HorasFacturables"].ToString() == "" ? "0.00" : row["HorasFacturables"].ToString()),
                //                         HorasAsignadas = decimal.Parse(row["HorasAsignadas"].ToString() == "" ? "0.00" : row["HorasAsignadas"].ToString()),
                //                         HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),
                //                         FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
                //                         FechaFin = DateTime.Parse(row["FechaFin"].ToString())
                //                     })).OrderBy(o => o.IdActividad).ToList();

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public void ObtieneActividadesPanelV3(FiltrosModel Filtros, ref List<ActividadesModel> LstActividades, string Conexion)
        {
            try
            {
                var tipoactividad = string.Join<string>(",", Filtros.LstTipoActividad.ConvertAll(s => s.ToString()));
                //var clasificacion = string.Join<string>(",", Filtros.LstClasificacion.ConvertAll(s => s.ToString()));
                var asignado = string.Join<string>(",", Filtros.LstAsignado.ConvertAll(s => s.ToString()));
                var responsable = string.Join<string>(",", Filtros.LstResponsable.ConvertAll(s => s.ToString()));
                var proyecto = string.Join<string>(",", Filtros.LstProyecto.ConvertAll(s => s.ToString()));
                //var prioridad = string.Join<string>(",", Filtros.LstPrioridad.ConvertAll(s => s.ToString()));
                var estatus = string.Join<string>(",", Filtros.LstEstatus.ConvertAll(s => s.ToString()));

                var tipo = string.Join<string>(",", Filtros.LstTipo.ConvertAll(s => s.ToString()));
                 var sprint = string.Join<string>(",", Filtros.LstSprints.ConvertAll(s => s.ToString()));

                //var con = new SqlConnection(Conexion);
                //con.Open();

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("PanelActividades_spV3", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@Proyecto", proyecto);
                sqlcmd.Parameters.AddWithValue("@Sprint", sprint);
                sqlcmd.Parameters.AddWithValue("@FechaIni", Filtros.FechaSolIni);
                sqlcmd.Parameters.AddWithValue("@FechaFin", Filtros.FechaSolFin);
                sqlcmd.Parameters.AddWithValue("@UsuarioAsignado", asignado);
                sqlcmd.Parameters.AddWithValue("@UsuarioResponsable", responsable);
                sqlcmd.Parameters.AddWithValue("@Estatus", estatus);
                sqlcmd.Parameters.AddWithValue("@Fase", tipoactividad);
                //sqlcmd.Parameters.AddWithValue("@IdTipo", Filtros.Tipo == -1 ? null : (int?)Filtros.Tipo);

                sqlcmd.Parameters.AddWithValue("@Tipo", tipo);
                sqlcmd.Parameters.AddWithValue("@IdUsuario", Filtros.IdUsuario);
                sqlcmd.Parameters.AddWithValue("@TipoUsuario", Filtros.IdTipoUsuario );


                //sqlcmd.Parameters.AddWithValue("@FechaCierreIni", Filtros.FechaCierreIni);
                //sqlcmd.Parameters.AddWithValue("@FechaCierreFin", Filtros.FechaCierreFin);
                //sqlcmd.Parameters.AddWithValue("@TipoActividad", tipoactividad);
                //sqlcmd.Parameters.AddWithValue("@Clasificacion", clasificacion);
                //sqlcmd.Parameters.AddWithValue("@UsuarioAsignado", asignado);
                //sqlcmd.Parameters.AddWithValue("@UsuarioResponsable", responsable);
                //sqlcmd.Parameters.AddWithValue("@Proyecto", proyecto);
                //sqlcmd.Parameters.AddWithValue("@Estatus", estatus);
                //sqlcmd.Parameters.AddWithValue("@Prioridad", prioridad);
                //sqlcmd.Parameters.AddWithValue("@Actividad", Filtros.Actividades == null ? "" : Filtros.Actividades);
                //sqlcmd.Parameters.AddWithValue("@IdUsuario", Filtros.IdUsuario);
                //sqlcmd.Parameters.AddWithValue("@Sprint", sprint);

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
                da.Fill(ds);
                da.Dispose();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();


                var LstAct = ds.Tables[0];
                //var Log = ds.Tables[1];

                LstActividades = (from row in LstAct.AsEnumerable()
                                  select (
                                  new ActividadesModel
                                  {
                                      IdActividad = long.Parse(row["IdActividad"].ToString()),
                                      IdActividadStr = row["IdActividadStr"].ToString(),
                                      IdProyecto = long.Parse(row["IdProyecto"].ToString()),
                                      Estatus = row["Estatus"].ToString(),
                                      EstatusStr = row["EstatusStr"].ToString(),
                                      Descripcion = row["Descripcion"].ToString(),
                                      TipoActividadStr = row["TipoActividad"].ToString(),
                                      ClasificacionStr = row["Clasificacion"].ToString(),
                                      PrioridadStr = row["PrioridadStr"].ToString(),
                                      AsignadoStr = row["Asignado"].ToString(),
                                      ResponsableStr = row["Responsable"].ToString(),
                                      AsignadoPath = "/Archivos/Fotos/" + row["CveAsignado"].ToString() + ".jpg",
                                      ResponsablePath = "/Archivos/Fotos/" + row["CveResponsable"].ToString() + ".jpg",
                                      ProyectoStr = row["Proyecto"].ToString(),
                                      FechaCreo = DateTime.Parse(row["FechaCreo"].ToString()),
                                      FechaSolicitado = row["FechaSolicitado"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaSolicitado"].ToString()),
                                      FechaCierre = row["FechaCierre"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaCierre"].ToString()),
                                      FechaRevision = row["FechaRevision"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaRevision"].ToString()),
                                      FechaLiberacion = row["FechaLiberacion"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaLiberacion"].ToString()),

                                      HorasFacturables = row["HorasFacturables"].ToString() == "" ? (decimal?)null : Convert.ToDecimal(row["HorasFacturables"].ToString()),
                                      HorasAsignadas = row["HorasAsignadas"].ToString() == "" ? (decimal?)null : Convert.ToDecimal(row["HorasAsignadas"].ToString()),
                                      HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),

                                      FechaTermino = row["FechaTermino"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaTermino"].ToString()),
                                      MotivoRechazoId = row["MotivoRechazoId"].ToString() == "" ? (long?)null : long.Parse(row["MotivoRechazoId"].ToString()),
                                      DescripcionRechazo = row["DescripcionRechazo"].ToString(),
                                      ClaveTipoActividad = row["ClaveTipoActividad"].ToString(),
                                      ClaveUsuario = row["CveAsignado"].ToString(),
                                      Sprint = row["Sprint"].ToString(),
                                      FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
                                      //EstatusCte = row["EstatusCte"].ToString(),
                                      //EstatusCteStr = row["EstatusCteStr"].ToString(),
                                      ClaveClasificacionActividad = row["ClaveClasificacionActividad"].ToString(),
                                      //ComentariosTotal = int.Parse(row["Comentarios"].ToString()),
                                      //ArchivosTotal = int.Parse(row["Archivos"].ToString()),
                                      TipoActividadId = long.Parse(row["TipoActividadId"].ToString()),
                                      PSP = int.Parse(row["PSP"].ToString()),
                                      BR = row["BR"].ToString(),
                                      //DependenciasA = int.Parse(row["Dependencias"].ToString()),
                                      //DependenciasT = int.Parse(row["DependenciasT"].ToString()),
                                      TipoNombre = row["TipoNombre"].ToString(),
                                      TipoUrl = row["TipoUrl"].ToString(),
                                  })).OrderBy(o => o.IdActividad).ToList();


                //var LstActEnc = ds.Tables[1];


                //LstActividadesEnc = (from row in LstActEnc.AsEnumerable()
                //                     select (
                //                     new ActividadesModel
                //                     {
                //                         TipoActividadId = long.Parse(row["TipoActividadId"].ToString()),
                //                         ClaveTipoActividad = row["ClaveTipoActividad"].ToString(),
                //                         TipoActividadStr = row["TipoActividad"].ToString(),
                //                         HorasFacturables = decimal.Parse(row["HorasFacturables"].ToString() == "" ? "0.00" : row["HorasFacturables"].ToString()),
                //                         HorasAsignadas = decimal.Parse(row["HorasAsignadas"].ToString() == "" ? "0.00" : row["HorasAsignadas"].ToString()),
                //                         HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),
                //                         FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
                //                         FechaFin = DateTime.Parse(row["FechaFin"].ToString())
                //                     })).OrderBy(o => o.IdActividad).ToList();

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public List<ActividadesModel> ConsultaQueryActividades(FiltrosModel Filtros, string Conexion)
        {
            try
            {

                List<ActividadesModel> Lst = new List<ActividadesModel>();
                var tipoactividad = string.Join<string>(",", Filtros.LstTipoActividad.ConvertAll(s => s.ToString()));
                var asignado = string.Join<string>(",", Filtros.LstAsignado.ConvertAll(s => s.ToString()));
                var responsable = string.Join<string>(",", Filtros.LstResponsable.ConvertAll(s => s.ToString()));
                var proyecto = string.Join<string>(",", Filtros.LstProyecto.ConvertAll(s => s.ToString()));
                var prioridad = string.Join<string>(",", Filtros.LstPrioridad.ConvertAll(s => s.ToString()));
                var estatus = string.Join<string>(",", Filtros.LstEstatus.ConvertAll(s => s.ToString()));
                var tipo = string.Join<string>(",", Filtros.LstTipo.ConvertAll(s => s.ToString()));
                var sprint = string.Join<string>(",", Filtros.LstSprints.ConvertAll(s => s.ToString()));
                var clasficacion = string.Join<string>(",", Filtros.LstClasificacion.ConvertAll(s => s.ToString()));

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("PanelQuerys", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@Proyecto", proyecto);
                sqlcmd.Parameters.AddWithValue("@FechaIni", Filtros.FechaSolIni);
                sqlcmd.Parameters.AddWithValue("@FechaFin", Filtros.FechaSolFin);
                sqlcmd.Parameters.AddWithValue("@FechaCreoIni", Filtros.FechaCreoIni);
                sqlcmd.Parameters.AddWithValue("@FechaCreoFin", Filtros.FechaCreoFin);

                sqlcmd.Parameters.AddWithValue("@FechaTerminoIni", Filtros.FechaCierreIni);
                sqlcmd.Parameters.AddWithValue("@FechaTerminoFin", Filtros.FechaCierreFin);

                sqlcmd.Parameters.AddWithValue("@UsuarioAsignado", asignado);
                sqlcmd.Parameters.AddWithValue("@UsuarioResponsable", responsable);
                sqlcmd.Parameters.AddWithValue("@Estatus", estatus);
                sqlcmd.Parameters.AddWithValue("@Fase", tipoactividad);
                sqlcmd.Parameters.AddWithValue("@Clasificacion", clasficacion);
                sqlcmd.Parameters.AddWithValue("@Tipo", tipo);
                sqlcmd.Parameters.AddWithValue("@Sprints", sprint);
                sqlcmd.Parameters.AddWithValue("@Prioridad", prioridad);
                sqlcmd.Parameters.AddWithValue("@Contiene", Filtros.Contiene);
                sqlcmd.Parameters.AddWithValue("@IdUsuario", Filtros.IdUsuario);
                sqlcmd.Parameters.AddWithValue("@TipoUsuario", Filtros.IdTipoUsuario);



                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
                da.Fill(ds);
                da.Dispose();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();

                Lst = (from row in ds.Tables[0].AsEnumerable()
                                  select (
                                  new ActividadesModel
                                  {
                                      IdActividad = long.Parse(row["IdActividad"].ToString()),
                                      IdActividadStr = row["IdActividadStr"].ToString(),
                                      IdProyecto = long.Parse(row["IdProyecto"].ToString()),
                                      Estatus = row["Estatus"].ToString(),
                                      EstatusStr = row["EstatusStr"].ToString(),
                                      //Descripcion = row["Descripcion"].ToString(),
                                      TipoActividadStr = row["TipoActividad"].ToString(),
                                      ClasificacionStr = row["Clasificacion"].ToString(),
                                      PrioridadStr = row["PrioridadStr"].ToString(),
                                      AsignadoStr = row["Asignado"].ToString(),
                                      ResponsableStr = row["Responsable"].ToString(),
                                      AsignadoPath = "/Archivos/Fotos/" + row["CveAsignado"].ToString() + ".jpg",
                                      ResponsablePath = "/Archivos/Fotos/" + row["CveResponsable"].ToString() + ".jpg",
                                      ProyectoStr = row["Proyecto"].ToString(),
                                      FechaCreo = DateTime.Parse(row["FechaCreo"].ToString()),
                                      FechaSolicitado = row["FechaSolicitado"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaSolicitado"].ToString()),
                                      FechaCierre = row["FechaCierre"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaCierre"].ToString()),
                                      FechaRevision = row["FechaRevision"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaRevision"].ToString()),
                                      FechaLiberacion = row["FechaLiberacion"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaLiberacion"].ToString()),

                                      HorasFacturables = row["HorasFacturables"].ToString() == "" ? (decimal?)null : Convert.ToDecimal(row["HorasFacturables"].ToString()),
                                      HorasAsignadas = row["HorasAsignadas"].ToString() == "" ? (decimal?)null : Convert.ToDecimal(row["HorasAsignadas"].ToString()),
                                      HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),

                                      FechaTermino = row["FechaTermino"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaTermino"].ToString()),
                                      MotivoRechazoId = row["MotivoRechazoId"].ToString() == "" ? (long?)null : long.Parse(row["MotivoRechazoId"].ToString()),
                                      DescripcionRechazo = row["DescripcionRechazo"].ToString(),
                                      ClaveTipoActividad = row["ClaveTipoActividad"].ToString(),
                                      ClaveUsuario = row["CveAsignado"].ToString(),
                                      Prioridad = int.Parse(row["Orden"].ToString()),
                                      Sprint =  row["Sprint"].ToString(),
                                      FechaInicio = row["FechaInicio"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaInicio"].ToString()),
                                      ClaveClasificacionActividad = row["ClaveClasificacionActividad"].ToString(),
                                      TipoActividadId = long.Parse(row["TipoActividadId"].ToString()),
                                      PSP = int.Parse(row["PSP"].ToString()),
                                      BR = row["BR"].ToString(),
                                      TipoNombre = row["TipoNombre"].ToString(),
                                      TipoUrl = row["TipoUrl"].ToString(),
                                  })).OrderBy(o => o.IdActividad).ToList();


                return Lst;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public string GuardarQuery (QueryModel Q, FiltrosModel Filtros, string Conexion)
        {
            try
            {

                var tipoactividad = string.Join<string>(",", Filtros.LstTipoActividad.ConvertAll(s => s.ToString()));
                var asignado = string.Join<string>(",", Filtros.LstAsignado.ConvertAll(s => s.ToString()));
                var responsable = string.Join<string>(",", Filtros.LstResponsable.ConvertAll(s => s.ToString()));
                var proyecto = string.Join<string>(",", Filtros.LstProyecto.ConvertAll(s => s.ToString()));
                var prioridad = string.Join<string>(",", Filtros.LstPrioridad.ConvertAll(s => s.ToString()));
                var estatus = string.Join<string>(",", Filtros.LstEstatus.ConvertAll(s => s.ToString()));
                var tipo = string.Join<string>(",", Filtros.LstTipo.ConvertAll(s => s.ToString()));
                var sprint = string.Join<string>(",", Filtros.LstSprints.ConvertAll(s => s.ToString()));
                var clasificacion = string.Join<string>(",", Filtros.LstClasificacion.ConvertAll(s => s.ToString()));


                var t = "EXEC PanelQuerys ";

                t += "@Proyecto = " + (proyecto.ToString() == "" ? "''" : ("'" + proyecto.ToString()) + "'") + ",";
                t += "@UsuarioAsignado = " + (asignado.ToString() == "" ? "''" : ("'" + asignado.ToString()) + "'") + ",";
                t += "@UsuarioResponsable = " + (responsable.ToString() == "" ? "''" : ("'" + responsable.ToString()) + "'") + ",";
                t += "@Estatus = " + (estatus.ToString() == "" ? "''" : ("'" + estatus.ToString()) + "'") + ",";
                t += "@Fase = " + (tipoactividad.ToString() == "" ? "''" : ("'" + tipoactividad.ToString()) + "'") + ",";
                t += "@Clasificacion = " + (clasificacion.ToString() == "" ? "''" : ("'" + clasificacion.ToString()) + "'") + ",";
                t += "@Sprints = " + (sprint.ToString() == "" ? "''" : ("'" + sprint.ToString()) + "'") + ",";
                t += "@Tipo = " + (tipo.ToString() == "" ? "''" : ("'" + tipo.ToString()) + "'") + ",";
                t += "@Prioridad = " + (prioridad.ToString() == "" ? "''" : ("'" + prioridad.ToString()) + "'") + ",";
                t += "@Contiene = " + (Filtros.Contiene == null ? "''" : ("'" + Filtros.Contiene.ToString()) + "'") + ",";

                t += "@FechaIni = " + (Filtros.FechaSolIni == null ? "''" : ("'" + DateTime.Parse(Filtros.FechaSolIni.ToString()).ToString("yyyy/MM/dd")) + "'") + ",";
                t += "@FechaFin = " + (Filtros.FechaSolFin == null ? "''" : ("'" + DateTime.Parse(Filtros.FechaSolFin.ToString()).ToString("yyyy/MM/dd")) + "'") + ",";
                t += "@FechaCreoIni = " + (Filtros.FechaCreoIni == null ? "''" : ("'" + DateTime.Parse(Filtros.FechaCreoIni.ToString()).ToString("yyyy/MM/dd")) + "'") + ",";
                t += "@FechaCreoFin = " + (Filtros.FechaCreoFin == null ? "''" : ("'" + DateTime.Parse(Filtros.FechaCreoFin.ToString()).ToString("yyyy/MM/dd")) + "'") + ",";

                t += "@FechaTerminoIni = " + (Filtros.FechaCierreIni == null ? "''" : ("'" + DateTime.Parse(Filtros.FechaCierreIni.ToString()).ToString("yyyy/MM/dd")) + "'") + ",";
                t += "@FechaTerminoFin = " + (Filtros.FechaCierreFin == null ? "''" : ("'" + DateTime.Parse(Filtros.FechaCierreFin.ToString()).ToString("yyyy/MM/dd")) + "'") + ",";

                t += "@IdUsuario = " + Filtros.IdUsuario.ToString() + ",";
                t += "@TipoUsuario = " + Filtros.IdTipoUsuario.ToString() + "";



                string g = string.Empty;
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    if(Q.IdQuery == 0)
                    {

                        CapaDatos.DataBaseModel.Query query = new CapaDatos.DataBaseModel.Query();

                        var gd = Guid.NewGuid();
                        query.Nombre = Q.Nombre;
                        query.IdUnique = gd.ToString();
                        query.Parametros = t;
                        query.IdUCreo = Q.IdUCreo;
                        query.FechaCreo = DateTime.Now;
                        query.Filtros = Q.Filtros;
                        query.Activo = true;
                        query.IdUMod = Q.IdUCreo;
                        query.FechaMod = DateTime.Now;

                        g = query.IdUnique.ToString();

                        contexto.Query.Add(query);
                        contexto.SaveChanges();


                        g = query.IdUnique.ToString();

                      

                    }
                    else
                    {
                       

                        var query = contexto.Query.Where(w => w.IdQuery == Q.IdQuery).FirstOrDefault();

                        if (query.IdUCreo != Q.IdUCreo) {
                            // si no es el que lo creo no lo puede editar
                            return "N";
                        }



                            //query.Nombre = Q.Nombre;
                        query.Parametros = t;
                        query.Filtros = Q.Filtros;
                        query.IdUMod = Q.IdUCreo;
                        query.FechaMod = DateTime.Now;
                        contexto.SaveChanges();

                        g = query.IdUnique.ToString();
                    }

                }

              return g;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }
        
        public QueryModel ConsultaQuery(string IdUnique , string Conexion)
        {

            try
            {
                QueryModel Q = new QueryModel();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {


                    Q = contexto.Query.Where(w => w.IdUnique == IdUnique).
                                       Select(s => new QueryModel() {
                                       
                                       IdQuery = s.IdQuery,
                                       Nombre = s.Nombre,
                                       Parametros = s.Parametros,
                                       Filtros = s.Filtros,
                                        Activo = s.Activo
                                       
                                       } ).FirstOrDefault();

                }

                return Q;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public List<ActividadesModel> EjecutaQueryActividades(long IdQuery,ref List<ActividadComentarioModel>  LstComentarios, string Conexion)
        {
            try
            {

                List<ActividadesModel> Lst = new List<ActividadesModel>();
 

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spEjecutaQuery", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdQuery", IdQuery);

                var p = sqlcmd.Parameters.GetEnumerator();


                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
                da.Fill(ds);
                da.Dispose();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();

                Lst = (from row in ds.Tables[0].AsEnumerable()
                       select (
                       new ActividadesModel
                       {
                           IdActividad = long.Parse(row["IdActividad"].ToString()),
                           IdActividadStr = row["IdActividadStr"].ToString(),
                           IdProyecto = long.Parse(row["IdProyecto"].ToString()),
                           Estatus = row["Estatus"].ToString(),
                           EstatusStr = row["EstatusStr"].ToString(),
                           TipoActividadStr = row["TipoActividad"].ToString(),
                           ClasificacionStr = row["Clasificacion"].ToString(),
                           PrioridadStr = row["PrioridadStr"].ToString(),
                           AsignadoStr = row["Asignado"].ToString(),
                           ResponsableStr = row["Responsable"].ToString(),
                           AsignadoPath = "/Archivos/Fotos/" + row["CveAsignado"].ToString() + ".jpg",
                           ResponsablePath = "/Archivos/Fotos/" + row["CveResponsable"].ToString() + ".jpg",
                           ProyectoStr = row["Proyecto"].ToString(),
                           FechaCreo = DateTime.Parse(row["FechaCreo"].ToString()),
                           FechaSolicitado = row["FechaSolicitado"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaSolicitado"].ToString()),
                           FechaCierre = row["FechaCierre"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaCierre"].ToString()),
                           FechaRevision = row["FechaRevision"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaRevision"].ToString()),
                           FechaLiberacion = row["FechaLiberacion"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaLiberacion"].ToString()),
                           HorasFacturables = row["HorasFacturables"].ToString() == "" ? (decimal?)null : Convert.ToDecimal(row["HorasFacturables"].ToString()),
                           HorasAsignadas = row["HorasAsignadas"].ToString() == "" ? (decimal?)null : Convert.ToDecimal(row["HorasAsignadas"].ToString()),
                           HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),
                           FechaTermino = row["FechaTermino"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaTermino"].ToString()),
                           MotivoRechazoId = row["MotivoRechazoId"].ToString() == "" ? (long?)null : long.Parse(row["MotivoRechazoId"].ToString()),
                           DescripcionRechazo = row["DescripcionRechazo"].ToString(),
                           ClaveTipoActividad = row["ClaveTipoActividad"].ToString(),
                           ClaveUsuario = row["CveAsignado"].ToString(),
                           Prioridad = int.Parse(row["Orden"].ToString()),
                           Sprint = row["Sprint"].ToString(),
                           FechaInicio = row["FechaSolicitado"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaInicio"].ToString()),
                           ClaveClasificacionActividad = row["ClaveClasificacionActividad"].ToString(),
                           TipoActividadId = long.Parse(row["TipoActividadId"].ToString()),
                           PSP = int.Parse(row["PSP"].ToString()),
                           BR = row["BR"].ToString(),
                           TipoNombre = row["TipoNombre"].ToString(),
                           TipoUrl = row["TipoUrl"].ToString(),
                       })).OrderBy(o => o.IdActividad).ToList();


                LstComentarios = (from row in ds.Tables[1].AsEnumerable()
                                  select (
                                  new ActividadComentarioModel
                                  {
                                      IdActividad = long.Parse(row["IdActividad"].ToString()),
                                      IdActividadStr = row["IdActividad"].ToString(),
                                      Comentario = row["Comentario"].ToString(),
                                      CveUsuario = row["NumEmpleado"].ToString(),
                                      IdUsuario = long.Parse(row["IdUsuario"].ToString()),
                                      IdUsuarioStr = row["Nombre"].ToString(),
                                      Fecha = DateTime.Parse(row["Fecha"].ToString())

                                  })).ToList();



                return Lst;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public bool EliminarQuery(long IdQuery,long IdUsuario,  string Conexion)
        {

            try
            {
           

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {


                    var Q = contexto.Query.Where(w => w.IdQuery == IdQuery).FirstOrDefault();

                    if (Q.IdUCreo != IdUsuario)
                    {
                        // si no es el que lo creo no lo puede editar
                        return false;
                    }

                    Q.Activo = false;
                    Q.IdUMod = IdUsuario;
                    Q.FechaMod = DateTime.Now;

                    contexto.SaveChanges();
                                  

                }

                return true;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public void ConsultaQuerys(ref List<QueryModel> LstPropios, ref List<QueryModel> LstCompartidos, long IdUsuario, string Conexion)
        {

            try
            {
                List<QueryModel> Lst = new List<QueryModel>();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    LstPropios = contexto.Query.Where(w => w.IdUCreo == IdUsuario && w.Activo == true).
                          Select(s => new QueryModel() { 
                           
                              IdQuery = s.IdQuery,
                              Nombre = s.Nombre,
                              IdUnique = s.IdUnique
                          
                          }).ToList();

                    LstCompartidos = contexto.QueryShare.Where(w => w.IdUsuario == IdUsuario  && w.Query.Activo == true).
                        Select(s => new QueryModel()
                        {

                            IdQuery = s.IdQuery,
                            Nombre = s.Query.Nombre,
                            IdUnique = s.Query.IdUnique

                        }).ToList();


                }


            }
            catch (Exception ex)
            {

                throw ex;
            }

        }
        public List<QueryModel> ConsultaQuerysAll( long IdUsuario, string Conexion)
        {

            try
            {
                List<QueryModel> Lst = new List<QueryModel>();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    Lst.AddRange(contexto.Query.Where(w => w.IdUCreo == IdUsuario && w.Activo == true).
                          Select(s => new QueryModel()
                          {

                              IdQuery = s.IdQuery,
                              Nombre = s.Nombre,
                              IdUnique = s.IdUnique

                          }).ToList());

                    Lst.AddRange(contexto.QueryShare.Where(w => w.IdUsuario == IdUsuario && w.Query.Activo == true).
                        Select(s => new QueryModel()
                        {

                            IdQuery = s.IdQuery,
                            Nombre = s.Query.Nombre,
                            IdUnique = s.Query.IdUnique

                        }).ToList());


                }


                return Lst;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public bool GuardarQueryCompartir (long IdUsuario , long IdQuery,  List<long> LstUsuarios, string Conexion)
        {
            try
            {
                using(var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    List<QueryShare> Lst = new List<QueryShare>();
                    //List<long> LstFinal = new List<long>();


                    var l = contexto.QueryShare.Where(w => w.IdQuery == IdQuery).ToList();

                    contexto.QueryShare.RemoveRange(l);

                    //foreach( var u in LstUsuarios)
                    //{
                    //    var s = contexto.QueryShare.Where(w => w.IdQuery == IdQuery && w.IdUsuario == u).FirstOrDefault();

                    //    if(s == null)
                    //    {
                    //        LstFinal.Add(u);
                    //    }

                    //}

                    Lst = LstUsuarios.Select(s => new QueryShare() {

                        IdQuery = IdQuery,
                        IdUsuario = s,
                        IdUCreo = IdUsuario,
                        FechaCreo = DateTime.Now

                    }).ToList();

                    contexto.QueryShare.AddRange(Lst);
                    contexto.SaveChanges();
                }
                return false;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public List<long> ConsultaCompartirQuery(long IdQuery, string Conexion)
        {
            try
            {
                List<long> Lst = new List<long>();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    Lst = contexto.QueryShare.Where(w => w.IdQuery == IdQuery).
                          Select(s =>  s.IdUsuario ).ToList();

                }

               return Lst;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public List<ActividadesModel> ObtieneActividadesSponsor( long IdUsuario, string Conexion)
        {
            try
            {
          

                List<ActividadesModel> LstActividades = new List<ActividadesModel>();
                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spObtieneItemsSponsor", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdUsuario", IdUsuario);



                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
                da.Fill(ds);
                da.Dispose();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();


                var LstAct = ds.Tables[0];
                //var Log = ds.Tables[1];

                LstActividades = (from row in LstAct.AsEnumerable()
                                  select (
                                  new ActividadesModel
                                  {
                                      IdActividad = long.Parse(row["IdActividad"].ToString()),
                                      IdActividadStr = row["IdActividadStr"].ToString(),
                                      ProyectoStr = row["Proyecto"].ToString(),
                                      Estatus = row["Estatus"].ToString(),
                                      EstatusStr = row["EstatusStr"].ToString(),
                                      FechaRevision = row["FechaRevision"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaRevision"].ToString()),
                                      FechaLiberacion = row["FechaLiberacion"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaLiberacion"].ToString()),
                                      BR = row["BR"].ToString(),
                                      TipoNombre = row["TipoNombre"].ToString(),
                                      TipoUrl = row["TipoUrl"].ToString()
                                      //Descripcion = row["Descripcion"].ToString(),
                                      //TipoActividadStr = row["TipoActividad"].ToString(),
                                      //ClasificacionStr = row["Clasificacion"].ToString(),
                                      //PrioridadStr = row["PrioridadStr"].ToString(),
                                      //AsignadoStr = row["Asignado"].ToString(),
                                      //ResponsableStr = row["Responsable"].ToString(),
                                      //AsignadoPath = "/Archivos/Fotos/" + row["CveAsignado"].ToString() + ".jpg",
                                      //ResponsablePath = "/Archivos/Fotos/" + row["CveResponsable"].ToString() + ".jpg",
                                      //ProyectoStr = row["Proyecto"].ToString(),
                                      //FechaCreo = DateTime.Parse(row["FechaCreo"].ToString()),
                                      //FechaSolicitado = row["FechaSolicitado"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaSolicitado"].ToString()),
                                      //FechaCierre = row["FechaCierre"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaCierre"].ToString()),
                                      //FechaRevision = row["FechaRevision"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaRevision"].ToString()),
                                      //FechaLiberacion = row["FechaLiberacion"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaLiberacion"].ToString()),

                                      //HorasFacturables = row["HorasFacturables"].ToString() == "" ? (decimal?)null : Convert.ToDecimal(row["HorasFacturables"].ToString()),
                                      //HorasAsignadas = row["HorasAsignadas"].ToString() == "" ? (decimal?)null : Convert.ToDecimal(row["HorasAsignadas"].ToString()),
                                      //HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),

                                      //FechaTermino = row["FechaTermino"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaTermino"].ToString()),
                                      //MotivoRechazoId = row["MotivoRechazoId"].ToString() == "" ? (long?)null : long.Parse(row["MotivoRechazoId"].ToString()),
                                      //DescripcionRechazo = row["DescripcionRechazo"].ToString(),
                                      //ClaveTipoActividad = row["ClaveTipoActividad"].ToString(),
                                      //ClaveUsuario = row["CveAsignado"].ToString(),
                                      ////Sprint = row["Sprint"].ToString(),
                                      //FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
                                      ////EstatusCte = row["EstatusCte"].ToString(),
                                      ////EstatusCteStr = row["EstatusCteStr"].ToString(),
                                      //ClaveClasificacionActividad = row["ClaveClasificacionActividad"].ToString(),
                                      ////ComentariosTotal = int.Parse(row["Comentarios"].ToString()),
                                      ////ArchivosTotal = int.Parse(row["Archivos"].ToString()),
                                      //TipoActividadId = long.Parse(row["TipoActividadId"].ToString()),
                                      //PSP = int.Parse(row["PSP"].ToString()),
                                      //BR = row["BR"].ToString(),
                                      ////DependenciasA = int.Parse(row["Dependencias"].ToString()),
                                      ////DependenciasT = int.Parse(row["DependenciasT"].ToString()),
                                      //TipoNombre = row["TipoNombre"].ToString(),
                                      //TipoUrl = row["TipoUrl"].ToString(),
                                  })).OrderBy(o => o.IdActividad).ToList();


                //var LstActEnc = ds.Tables[1];


                //LstActividadesEnc = (from row in LstActEnc.AsEnumerable()
                //                     select (
                //                     new ActividadesModel
                //                     {
                //                         TipoActividadId = long.Parse(row["TipoActividadId"].ToString()),
                //                         ClaveTipoActividad = row["ClaveTipoActividad"].ToString(),
                //                         TipoActividadStr = row["TipoActividad"].ToString(),
                //                         HorasFacturables = decimal.Parse(row["HorasFacturables"].ToString() == "" ? "0.00" : row["HorasFacturables"].ToString()),
                //                         HorasAsignadas = decimal.Parse(row["HorasAsignadas"].ToString() == "" ? "0.00" : row["HorasAsignadas"].ToString()),
                //                         HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),
                //                         FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
                //                         FechaFin = DateTime.Parse(row["FechaFin"].ToString())
                //                     })).OrderBy(o => o.IdActividad).ToList();


                return LstActividades;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public List<ActividadesModel> SearchActividad(string Texto,string Conexion) {
            try
            {

                List<ActividadesModel> LstActividades = new List<ActividadesModel>();

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spSearchActividad", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@Texto", Texto);



                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
                da.Fill(ds);
                da.Dispose();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();

                ProyectosModel Indicadores = new ProyectosModel();

                //System.Globalization.CultureInfo culture = new System.Globalization.CultureInfo("es-MX");

                var LstAct = ds.Tables[0];

                LstActividades = (from row in LstAct.AsEnumerable()
                           select (
                           new ActividadesModel
                           {

                               IdActividad = long.Parse(row["IdActividad"].ToString()),
                               IdActividadStr = row["IdActividadStr"].ToString(),
                               BR = row["BR"].ToString(),
                               Estatus = row["Estatus"].ToString(),
                               EstatusStr = row["EstatusStr"].ToString(),
                               Descripcion = row["BR"].ToString(),
                               TipoActividadStr = row["Tipo"].ToString(),
                               //AsignadoStr = row["Asignado"].ToString(),
                               AsignadoPath = "/Content/Project/Imagenes/" + row["Url"].ToString(),
                               //ClaveUsuario = row["NumEmpleado"].ToString()

                           })).ToList();


                return LstActividades;



            }
            catch (Exception ex)
            {

                throw ex;
            }
        
        }

        public List<ActividadesModel> SearchActividad_Opcion2(string Texto,long IdProyecto, long IdActividad, string Conexion)
        {
            try
            {

                List<ActividadesModel> LstActividades = new List<ActividadesModel>();

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spSearchActividad_Opcion2", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@Texto", Texto);
                sqlcmd.Parameters.AddWithValue("@IdProyecto", IdProyecto);
                sqlcmd.Parameters.AddWithValue("@IdActividad", IdActividad);


                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
                da.Fill(ds);
                da.Dispose();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();

                ProyectosModel Indicadores = new ProyectosModel();


                var LstAct = ds.Tables[0];

                LstActividades = (from row in LstAct.AsEnumerable()
                                  select (
                                  new ActividadesModel
                                  {

                                      IdActividad = long.Parse(row["IdActividad"].ToString()),
                                      IdActividadStr = row["IdActividadStr"].ToString(),
                                      BR = row["BR"].ToString(),
                                      Estatus = row["Estatus"].ToString(),
                                      EstatusStr = row["EstatusStr"].ToString(),
                                      Descripcion = row["BR"].ToString(),
                                      TipoActividadStr = row["Tipo"].ToString(),
                               AsignadoPath = "/Content/Project/Imagenes/" + row["Url"].ToString(),


                           })).ToList();


                return LstActividades;



            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public List<ActividadesModel> ObtieneEncActividades(long IdProyecto, string Conexion)
        {
            try
            {




                List<ActividadesModel> LstActividades = new List<ActividadesModel>();
                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spObtieneFasesProyecto", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdProyecto", IdProyecto);

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
                da.Fill(ds);
                da.Dispose();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();


                var LstAct = ds.Tables[0];


                LstActividades = (from row in LstAct.AsEnumerable()
                                  select (
                                  new ActividadesModel
                                  {
                                      TipoActividadId = long.Parse(row["TipoActividadId"].ToString()),
                                      ClaveTipoActividad = row["ClaveTipoActividad"].ToString(),
                                      TipoActividadStr = row["TipoActividad"].ToString(),
                                      HorasFacturables = decimal.Parse(row["HorasFacturables"].ToString()),
                                      HorasAsignadas = decimal.Parse(row["HorasAsignadas"].ToString()),
                                      HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),
                                      FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
                                      FechaFin = DateTime.Parse(row["FechaFin"].ToString())
                                  })).OrderBy(o => o.IdActividad).ToList();

                return LstActividades;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public ActividadesModel ConsultaActividad(long IdActividad, long IdUsuario, string Conexion)
        {

            try
            {

                ActividadesModel Actividad = new ActividadesModel();



                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spConsultaActividad", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdActividad", IdActividad);
                sqlcmd.Parameters.AddWithValue("@IdUsuario", IdUsuario);

                sqlcmd.CommandType = CommandType.StoredProcedure;

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();

    


                var dt = new DataTable();
                dt = ds.Tables[0];

                Actividad = (from row in dt.AsEnumerable()
                             select (new ActividadesModel
                             {

                                 IdActividad = long.Parse(row["IdActividad"].ToString()),
                                 IdActividadStr = row["IdActividadStr"].ToString(),
                                 IdUsuarioAsignado = row["IdUsuarioAsignado"].ToString() == "" ?   (long?)null :  long.Parse(row["IdUsuarioAsignado"].ToString()),
                                 Descripcion = row["Descripcion"].ToString(),
                                 DocumentoRef = row["DocumentoRef"].ToString(),
                                 Estatus = row["Estatus"].ToString(),
                                 Prioridad = int.Parse(row["Prioridad"].ToString()),
                                 Orden = int.Parse(row["Prioridad"].ToString()),
                                 PrioridadId = int.Parse(row["PrioridadId"].ToString()),
                                 Planificada = int.Parse(row["Planificada"].ToString()),
                                 //ComentariosFinales = s.ComentariosFinales,
                                 BR = row["BR"].ToString(),
                                 TiempoEjecucion = row["TiempoEjecucion"].ToString() == "" ? 0 : decimal.Parse(row["TiempoEjecucion"].ToString()),
                                 HorasFacturables = row["HorasFacturables"].ToString() == "" ? 0  : decimal.Parse(row["HorasFacturables"].ToString()),
                                 HorasAsignadas = row["HorasAsignadas"].ToString() == "" ? 0 : decimal.Parse(row["HorasAsignadas"].ToString()),
                                 HorasFinales = row["HorasFinales"].ToString() == "" ? 0 : decimal.Parse(row["HorasFinales"].ToString()),
                                 IdProyecto = long.Parse(row["IdProyecto"].ToString()),
                                 IdIteracion = row["IdIteracion"].ToString() == "" ? 0 : long.Parse(row["IdIteracion"].ToString()),
                                 TipoActividadId = row["TipoActividadId"].ToString() == "" ? 0 :  long.Parse(row["TipoActividadId"].ToString()),
                                 ClasificacionId = row["ClasificacionId"].ToString() == "" ? 0 : long.Parse(row["ClasificacionId"].ToString()),
                                 FechaSolicitado = row["FechaSolicitado"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaSolicitado"].ToString()),
                                 FechaInicio = row["FechaInicio"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaInicio"].ToString()),
                                 FechaTermino = row["FechaTermino"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaTermino"].ToString()),
                                 FechaRevision = row["FechaRevision"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaRevision"].ToString()),
                                 FechaCierre = row["FechaCierre"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaCierre"].ToString()),
                                 Retrabajo = bool.Parse(row["Retrabajo"].ToString()),
                                 IdUsuarioResponsable = long.Parse(row["IdUsuarioResponsable"].ToString()),
                                 DescripcionRechazo = row["DescripcionRechazo"].ToString(),
                                 EvidenciaRechazo = row["EvidenciaRechazo"].ToString(),
                                 IdUCreo = long.Parse(row["IdUCreo"].ToString()),
                                 FechaCreo = DateTime.Parse(row["FechaCreo"].ToString()),
                                 IdUMod = row["IdUMod"].ToString() == "" ? (int?)null : int.Parse(row["IdUMod"].ToString()),
                                 FechaMod = row["FechaMod"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaMod"].ToString()),
                                 Critico = bool.Parse(row["Critico"].ToString()),
                                 IdActividadRef = long.Parse(row["IdActividadRef"].ToString()),
                                 IdListaRevision = row["IdListaRevision"].ToString() == "" ? (int?)null : int.Parse(row["IdListaRevision"].ToString()),
                                 TipoId = byte.Parse(row["TipoId"].ToString()),
                                 CorreoResponsable = row["CorreoResponsable"].ToString(),
                                 AsignadoStr = row["AsignadoStr"].ToString(),
                                 ProyectoStr = row["ProyectoStr"].ToString(),
                                 ClaveProyecto = row["ClaveProyecto"].ToString(),
                                 TipoActividadStr = row["TipoActividadStr"].ToString(),
                                 ClasificacionStr = row["ClasificacionStr"].ToString(),
                                 CorreoLider = row["CorreoLider"].ToString(),
                                 CorreoAsignado = row["CorreoAsignado"].ToString(),
                                 PSP = int.Parse(row["PSP"].ToString()),
                                 CriterioAceptacion = row["CriterioAceptacion"].ToString(),
                                 IdUModStr = row["IdUModStr"].ToString(),
                                 IdCicloCaso = long.Parse(row["IdCicloCaso"].ToString()),
                                 Puntos = row["Puntos"].ToString() == "" ? (int?)null : int.Parse(row["Puntos"].ToString()),
                                 IdWorkFlow  =  long.Parse(row["IdWorkFlow"].ToString()),
                                 WorkFlow   = row["WorkFlow"].ToString(),
                                 ColorW = row["Color"].ToString(),
                                 HU = row["HU"].ToString(),
                                 ColorTexto = row["ColorTexto"].ToString(),
                                 TipoNombre = row["TipoNombre"].ToString(),


                             })).FirstOrDefault();


                 Actividad.Comentarios = (from row in ds.Tables[1].AsEnumerable()
                                         select (new ActividadComentarioModel
                                         {

                                             Comentario = row["Comentario"].ToString(),
                                             Fecha = DateTime.Parse(row["Fecha"].ToString()),
                                             CveUsuario = row["CveUsuario"].ToString(),
                                             IdUsuarioStr = row["IdUsuarioStr"].ToString()
                                         })).ToList();

                Actividad.Archivos = (from row in ds.Tables[2].AsEnumerable()
                                         select (new ActividadArchivoModel
                                         {
                                             Nombre = row["Nombre"].ToString(),
                                             Extension = row["Extension"].ToString(),
                                             Url = row["Url"].ToString()
                                         })).ToList();
                Actividad.Trabajos = (from row in ds.Tables[3].AsEnumerable()
                                      select (new ActividadTrabajoModel
                                      {
                                          Fecha = DateTime.Parse(row["Fecha"].ToString()),
                                          Tiempo = decimal.Parse(row["Tiempo"].ToString()),
                                          Comentario = row["Comentario"].ToString()
                                      })).ToList();
                Actividad.ActividadLog = (from row in ds.Tables[4].AsEnumerable()
                                      select (new ActividadComentarioModel
                                      {
                                          Fecha = DateTime.Parse(row["FechaHora"].ToString()),
                                          CveUsuario = row["CveUsuario"].ToString(),
                                          IdUsuarioStr = row["IdUsuarioStr"].ToString(),
                                          Comentario = row["Descripcion"].ToString()
                                      })).ToList();

                Actividad.ProyectoRepositorio = (from row in ds.Tables[5].AsEnumerable()
                                          select (new CatalogoGeneralModel
                                          {
                                              IdCatalogo = long.Parse(row["IdProyectoRepositorio"].ToString()),
                                              DescLarga = row["Nombre"].ToString()
                                          })).ToList();

                Actividad.TotalComentarios = Actividad.Comentarios.Count;
                Actividad.TotalArchivos = Actividad.Archivos.Count;
                Actividad.TotalTiempos = Actividad.Trabajos.Count;
                Actividad.TotalLog = Actividad.ActividadLog.Count;
                           //TotalValidaciones = s.ActividadValidaciones.Count,



                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();
                sqlcon.Close();






                return Actividad;


            }
            catch (Exception ex)
            {

                throw ex;
            }


        }
        public ActividadesModel ConsultaActividad_EXT(long IdActividad,  string Conexion)
        {

            try
            {

                ActividadesModel Actividad = new ActividadesModel();



                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spConsultaActividad_Ext", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdActividad", IdActividad);
         

                sqlcmd.CommandType = CommandType.StoredProcedure;

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();


                var dt = new DataTable();
                dt = ds.Tables[0];

                Actividad = (from row in dt.AsEnumerable()
                             select (new ActividadesModel
                             {

                                 IdActividad = long.Parse(row["IdActividad"].ToString()),
                                 IdActividadStr = row["IdActividadStr"].ToString(),
                                 BR = row["BR"].ToString(),
                                 Descripcion = row["Descripcion"].ToString(),
                                 CriterioAceptacion = row["CriterioAceptacion"].ToString(),
                                 Estatus = row["Estatus"].ToString(),
                                 ProyectoStr = row["ProyectoStr"].ToString(),
                                 ClaveProyecto = row["ClaveProyecto"].ToString(),
                                 TipoActividadStr = row["TipoActividadStr"].ToString(),
                                 ClasificacionStr = row["ClasificacionStr"].ToString(),
                                 PrioridadStr = row["PrioridadStr"].ToString(),
                                 Sprint = row["Sprint"].ToString(),
                                 AsignadoStr = row["AsignadoStr"].ToString(),
                                 ResponsableStr = row["ResponsableStr"].ToString(),
                                 TipoNombre = row["TipoNombre"].ToString(),
                                 TipoUrl = row["TipoUrl"].ToString(),
                                 TipoId = byte.Parse(row["TipoId"].ToString()),
                             })).FirstOrDefault();


                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();
                sqlcon.Close();






                return Actividad;


            }
            catch (Exception ex)
            {

                throw ex;
            }


        }

        public List<ActividadesModel> ConsultaActividadRelaciones(long IdActividad, string Conexion)
        {

            try
            {
                List <ActividadesModel> Lst = new List<ActividadesModel>();

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spConsultaActvidadesRelacionadas", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdActividad", IdActividad);
                sqlcmd.CommandType = CommandType.StoredProcedure;

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();

                var dt = new DataTable();
                dt = ds.Tables[0];

                Lst = (from row in dt.AsEnumerable()
                             select (new ActividadesModel
                             {
                                 IdActividadRef = long.Parse(row["IdActividadR"].ToString()),
                                 IdActividad = long.Parse(row["IdActividad"].ToString()),
                                 IdActividadStr = row["IdActividadStr"].ToString(),
                                 BR = row["BR"].ToString(),
                                 TipoNombre = row["Nombre"].ToString(),
                                 TipoUrl = row["Url"].ToString(),
                                 EstatusStr = row["EstatusStr"].ToString(),
                                 Estatus = row["Estatus"].ToString()
                             })).ToList();


                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();
                sqlcon.Close();


                return Lst;


            }
            catch (Exception ex)
            {

                throw ex;
            }


        }

        public List<ActividadesModel> ConsultaActividadRelacionesFPD(long IdFlujoPagoDet, string Conexion)
        {

            try
            {
                List<ActividadesModel> Lst = new List<ActividadesModel>();

                using(var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    Lst = contexto.FlujoPagoDet_Actividad.Where(w => w.IdFlujoPagoDet == IdFlujoPagoDet).
                        Select(s => new ActividadesModel { 
                             IdActividadR1 = s.IdFlujoPagoDetAct, 
                             IdActividad = s.IdActividad,
                             IdActividadStr = s.Actividad.Proyecto.Clave + "-" +s.IdActividad.ToString(),
                             BR = s.Actividad.BR,
                             TipoNombre = s.Actividad.ActividadTipo.Nombre,
                             TipoUrl = s.Actividad.ActividadTipo.Url

                        }).ToList();

                }
                

                //DataSet ds = new DataSet();

                //SqlConnection sqlcon = new SqlConnection(Conexion);
                //SqlCommand sqlcmd = new SqlCommand("spConsultaActvidadesRelacionadas", sqlcon);
                //sqlcmd.CommandType = CommandType.StoredProcedure;
                //sqlcmd.Parameters.AddWithValue("@IdActividad", IdActividad);
                //sqlcmd.CommandType = CommandType.StoredProcedure;

                //SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                //da.Fill(ds);
                //da.Dispose();

                //var dt = new DataTable();
                //dt = ds.Tables[0];

                //Lst = (from row in dt.AsEnumerable()
                //       select (new ActividadesModel
                //       {
                //           IdActividadRef = long.Parse(row["IdActividadR"].ToString()),
                //           IdActividad = long.Parse(row["IdActividad"].ToString()),
                //           IdActividadStr = row["IdActividadStr"].ToString(),
                //           BR = row["BR"].ToString(),
                //           TipoNombre = row["Nombre"].ToString(),
                //           TipoUrl = row["Url"].ToString()
                //       })).ToList();


                //sqlcmd.Connection.Close();
                //sqlcmd.Connection.Dispose();
                //sqlcmd.Dispose();
                //sqlcon.Close();


                return Lst;


            }
            catch (Exception ex)
            {

                throw ex;
            }


        }

        public List<ActividadesModel> ConsultaActividadRelacionar(long IdActividad, string Conexion)
        {

            try
            {
                List<ActividadesModel> Lst = new List<ActividadesModel>();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    Lst = (contexto.Actividad.Where(w=> w.IdActividad == IdActividad)
                           .Select (s=> new ActividadesModel
                           {
                               IdActividadRef = s.IdActividad,
                               IdActividad = s.IdActividad,
                               IdActividadStr = s.Proyecto.Clave +  "-"  +  s.IdActividad.ToString(),
                               BR =s.BR,
                               TipoNombre = s.ActividadTipo.Nombre,
                               TipoUrl = s.ActividadTipo.Url
                           })).ToList();

                }




                return Lst;


            }
            catch (Exception ex)
            {

                throw ex;
            }


        }

        public List<ActividadArchivoModel> ConsultaActividadArchivos(long IdActividad, string Conexion)
        {

            try
            {
                List<ActividadArchivoModel> Lst = new List<ActividadArchivoModel>();
                var TipoFile = new List<Tuple<string, string>>();
                TipoFile.Add(System.Tuple.Create("mp4", "/Content/Project/Imagenes/Video.png"));
                TipoFile.Add(System.Tuple.Create("webm", "/Content/Project/Imagenes/Video.png"));
                TipoFile.Add(System.Tuple.Create("wmv", "/Content/Project/Imagenes/Video.png"));

   

                TipoFile.Add(System.Tuple.Create("doc", "/Content/Project/Imagenes/Word.png"));
                TipoFile.Add(System.Tuple.Create("docx", "/Content/Project/Imagenes/Word.png"));

                TipoFile.Add(System.Tuple.Create("xls", "/Content/Project/Imagenes/Excel.png"));
                TipoFile.Add(System.Tuple.Create("xlsx", "/Content/Project/Imagenes/Excel.png"));

                TipoFile.Add(System.Tuple.Create("pdf", "/Content/Project/Imagenes/PDF.png"));
                TipoFile.Add(System.Tuple.Create("pptx", "/Content/Project/Imagenes/PP.png"));
                TipoFile.Add(System.Tuple.Create("rar", "/Content/Project/Imagenes/rar.png"));
                TipoFile.Add(System.Tuple.Create("zip", "/Content/Project/Imagenes/rar.png"));

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {


                    //Dictionary<string, string> TipoFile = new Dictionary<string, string>();

           

                    //TipoFile.Add("mp4", "Video.png");
                    //TipoFile.Add("webm", "Video.png");
                    //TipoFile.Add("wmv", "Video.png");

                    //TipoFile.Add("png", "Imagen.png");
                    //TipoFile.Add("jpg", "Imagen.png");
                    //TipoFile.Add("jpeg", "Imagen.png");
                    //TipoFile.Add("jfif", "Imagen.png");

                    //TipoFile.Add("doc", "Word.png");
                    //TipoFile.Add("docx", "Word.png");

                    //TipoFile.Add("pdf", "PDF.png");
                    //TipoFile.Add("pptx", "PowerP.png");
                    //TipoFile.Add("rar", "Rar.png");
                    //TipoFile.Add("zip", "Rar.png");

                    Lst = (contexto.ActividadArchivo.Where(w => w.IdActividad == IdActividad)
                           .Select(s => new ActividadArchivoModel
                           {
                               IdActividadArchivo = s.IdActividadArchivo,
                               IdActividad = s.IdActividad,
                               Nombre = s.Nombre,
                               Extension = s.Extension,
                             //  Tipo = TipoFile.Where(x=> x.Item1.ToLower() == s.Extension.ToLower()).FirstOrDefault() == null ? "file.png" : TipoFile.Where(x => x.Item1.ToLower() == s.Extension.ToLower()).FirstOrDefault().Item2,
                               Url = s.Url
                           })).ToList();

                 

                }



                foreach (var i in Lst)
                {
                    if (i.Extension.ToLower() == "png" || i.Extension.ToLower() == "jpg" || i.Extension.ToLower() == "jpeg" || i.Extension.ToLower() == "gif" || i.Extension.ToLower() == "jiff")
                    {
                        i.Tipo = i.Url;
                    }
                    else {

                        i.Tipo = TipoFile.Where(x => x.Item1.ToLower() == i.Extension.ToLower()).FirstOrDefault() == null ? "/Content/Project/Imagenes/file.png" : TipoFile.Where(x => x.Item1.ToLower() == i.Extension.ToLower()).FirstOrDefault().Item2;

                    }

                  
                 }


                return Lst;


            }
            catch (Exception ex)
            {

                throw ex;
            }


        }

    
        public string ConsultaDescripcionActividad(long IdActividad, string Conexion)
        {

            try
            {

                string Descripcion = string.Empty;


                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {


                    contexto.Configuration.LazyLoadingEnabled = false;

                    Descripcion = contexto.Actividad.Include("Proyecto").Where(i => i.IdActividad == IdActividad).Select(s => s.IdActividad.ToString() + " - " + s.Descripcion).FirstOrDefault();
                }



                return Descripcion;


            }
            catch (Exception ex)
            {

                throw ex;
            }


        }

        public bool CambiaEstatusActividad(string Estatus, string Accion, long IdActividad, long IdUsuario, string Conexion)
        {
            try
            {

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    var actividad = contexto.Actividad.Where(a => a.IdActividad == IdActividad).FirstOrDefault();

                    long IdWorkFlow = contexto.WorkFlow.Where(w => w.IdProyecto == actividad.IdProyecto && w.IdActividadTipo == actividad.TipoId && w.EstatusR == actividad.Estatus).FirstOrDefault().IdWorkFlow;
                    string estatusant = actividad.Estatus;

                    actividad.Estatus = Estatus;
                    actividad.FechaTermino = Estatus == "R" ? DateTime.Now : actividad.FechaTermino;
                    actividad.FechaRevision = Estatus == "R" ? DateTime.Now : actividad.FechaRevision;
                    actividad.FechaLiberacion = Estatus == "L" ? DateTime.Now : actividad.FechaLiberacion;
                    actividad.IdWorkflow = IdWorkFlow; // lo asigno al primer flujo relacionado con el estatus

                    contexto.SaveChanges();
                    
               


                        //Si solicita una revisión después de un rechazo se reinician las validaciones
                   if (Estatus == "R" && (estatusant == "X" || estatusant == "P" || estatusant == "A"))
                    {

                        List<ActividadValidaciones> LstValidaciones = contexto.ActividadValidaciones.Where(w => w.IdActividad == IdActividad).ToList();
                       
                        foreach (var val in LstValidaciones)
                        {

                            val.Estatus = "P";
                            val.IdUAtendio = null;
                            val.FechaAtendio = null;
                            val.MotivoRechazoId = null;
                            val.DescripcionRechazo = null;

                        }

                        contexto.ActividadValidaciones.RemoveRange(LstValidaciones);
                        contexto.SaveChanges();

                        List<ActividadesValidacionModel> Validaciones = contexto.Autorizacion.Where(i => i.Tipo == 1 && i.Activo == true)
                                                            .Select(s => new ActividadesValidacionModel
                                                            {
                                                                IdActividad = actividad.IdActividad,
                                                                IdAutorizacion = s.IdAutorizacion,
                                                                NombreAut = s.Nombre,
                                                                Estatus = "P",
                                                                Secuencia = s.Secuencia
                                                            }).ToList();

                        ActividadValidaciones a;
                        List<ActividadValidaciones> lstact = new List<ActividadValidaciones>();

                        foreach (var actval in Validaciones)
                        {

                            a = new ActividadValidaciones();
                            a.IdActividad = actval.IdActividad;
                            a.IdAutorizacion = actval.IdAutorizacion;
                            a.NombreAut = actval.NombreAut;
                            a.Estatus = actval.Estatus;
                            a.Secuencia = actval.Secuencia;

                            lstact.Add(a);

                        }

                        contexto.ActividadValidaciones.AddRange(lstact);
                        contexto.SaveChanges();
                    }

                    //Si el estatus anterior era liberado
                    if (estatusant == "L")
                    {
                        
                        List<ActividadValidaciones> LstValidaciones = contexto.ActividadValidaciones.Where(w => w.IdActividad == IdActividad).ToList();

                        foreach (var val in LstValidaciones)
                        {

                            val.Estatus = "P";
                            val.IdUAtendio = null;
                            val.FechaAtendio = null;
                            val.MotivoRechazoId = null;
                            val.DescripcionRechazo = null;

                        }

                        contexto.ActividadValidaciones.RemoveRange(LstValidaciones);
                        contexto.SaveChanges();

                        List<ActividadesValidacionModel> Validaciones = contexto.Autorizacion.Where(i => i.Tipo == 1 && i.Activo == true)
                                                            .Select(s => new ActividadesValidacionModel
                                                            {
                                                                IdActividad = actividad.IdActividad,
                                                                IdAutorizacion = s.IdAutorizacion,
                                                                NombreAut = s.Nombre,
                                                                Estatus = "P",
                                                                Secuencia = s.Secuencia
                                                            }).ToList();

                        ActividadValidaciones a;
                        List<ActividadValidaciones> lstact = new List<ActividadValidaciones>();

                        foreach (var actval in Validaciones)
                        {

                            a = new ActividadValidaciones();
                            a.IdAutorizacion = actval.IdAutorizacion;
                            a.IdActividad = actividad.IdActividad;
                            a.NombreAut = actval.NombreAut;
                            a.Estatus = actval.Estatus;
                            a.Secuencia = actval.Secuencia;

                            lstact.Add(a);

                        }

                        contexto.ActividadValidaciones.AddRange(lstact);
                        contexto.SaveChanges();
                    }

                    if(Estatus == "R" || Estatus == "L")
                    {

                        ActividadComentario ac = new ActividadComentario();

                        ac.IdActividad = actividad.IdActividad;
                        ac.Fecha = DateTime.Now;
                        ac.IdUsuario = IdUsuario;
                        ac.Comentario = Estatus == "R" ? "Solicitó la aprobación del item de trabajo" : "Realizó la aprobación del item de trabajo";

                        contexto.ActividadComentario.Add(ac);
                        contexto.SaveChanges();
                    }

                   

                    ActividadLog actlog = new ActividadLog();
                    actlog.IdActividad = actividad.IdActividad;
                    actlog.Descripcion = Accion;
                    actlog.IdUCreo = IdUsuario;
                    actlog.FechaHora = DateTime.Now;

                    GuardaActividadLog(actlog, Conexion);



                }

                return true;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public string GuardaImportacionActividades(List<ActividadesModel> LstActividad, long IdUsuario, string Conexion)
        {
            try
            {
                string Mensaje = string.Empty;
                List<string> ProyectosImp = LstActividad.Select(s => s.ProyectoStr).Distinct().ToList();
                List<string> ResponsableImp = LstActividad.Select(s => s.ResponsableStr).Distinct().ToList();
                List<string> TipoActividadImp = LstActividad.Select(s => s.TipoActividadStr).Distinct().ToList();
                List<string> ClasificacionImp = LstActividad.Select(s => s.ClasificacionStr).Distinct().ToList();

                List<ProyectosModel> Proyectos = new List<ProyectosModel>();
                List<CatalogoGeneralModel> UResponsable = new List<CatalogoGeneralModel>();
                List<CatalogoGeneralModel> TipoActividad = new List<CatalogoGeneralModel>();
                List<CatalogoGeneralModel> Clasificacion = new List<CatalogoGeneralModel>();
                List<String> StrProyectos = new List<String>();
                List<String> StrResponsable = new List<String>();
                List<String> StrTipoActividad = new List<String>();
                List<String> StrClasificacion = new List<String>();
                List<Autorizacion> LstAutorizacion = new List<Autorizacion>();



                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    contexto.Configuration.LazyLoadingEnabled = false;
                    Proyectos = contexto.Proyecto.Where(c => c.Activo == true).Select(s => new ProyectosModel { IdProyecto = s.IdProyecto, Clave = s.Clave, ClaveVal = s.Clave.Replace(" ", ""), IdULider = s.IdULider }).ToList();
                    UResponsable = contexto.Usuario.Where(c => c.Activo == true).Select(s => new CatalogoGeneralModel { IdCatalogo = s.IdUsuario, DescCorta = s.NumEmpleado }).ToList();
                    TipoActividad = contexto.CatalogoGeneral.Where(c => c.Activo == true && c.IdTabla == 2 && c.Cabecera == false).Select(s => new CatalogoGeneralModel { IdCatalogo = s.IdCatalogo, DescCorta = s.DescCorta }).ToList();
                    Clasificacion = contexto.CatalogoGeneral.Where(c => c.Activo == true && c.IdTabla == 5 && c.Cabecera == false).Select(s => new CatalogoGeneralModel { IdCatalogo = s.IdCatalogo, DescCorta = s.DescCorta }).ToList();
                    LstAutorizacion = contexto.Autorizacion.ToList();
                }


                StrProyectos = Proyectos.Select(s => s.ClaveVal).ToList();
                StrResponsable = UResponsable.Select(s => s.DescCorta).ToList();
                StrTipoActividad = TipoActividad.Select(s => s.DescCorta).ToList();
                StrClasificacion = Clasificacion.Select(s => s.DescCorta).ToList();

                var ValProyecto = (from p in ProyectosImp
                                   where !StrProyectos.Contains(p)
                                   select p).ToList();

                if (ValProyecto.Count > 0)
                {
                    return "A|El proyecto con clave " + ValProyecto.FirstOrDefault() + " no existe o se encuentra inactivo.";
                }

                var ValUResponsable = (from p in ResponsableImp
                                       where !StrResponsable.Contains(p)
                                       select p).ToList();

                if (ValUResponsable.Count > 0)
                {
                    return "A|El usuario con clave " + ValUResponsable.FirstOrDefault() + " no existe o se encuentra inactivo.";
                }

                var ValTipoActividad = (from p in TipoActividadImp
                                        where !StrTipoActividad.Contains(p)
                                        select p).ToList();


                if (ValTipoActividad.Count > 0)
                {
                    return "A|La fase " + ValTipoActividad.FirstOrDefault() + " no existe o se encuentra inactiva.";
                }

                var ValClasificacion = (from p in ClasificacionImp
                                        where !StrClasificacion.Contains(p)
                                        select p).ToList();

                if (ValClasificacion.Count > 0)
                {
                    return "A|La clasificación " + ValClasificacion.FirstOrDefault() + " no existe o se encuentra inactiva.";
                }



                var ListaFinal = LstActividad
                                .Select(s => new Actividad
                                {
                                    IdUsuarioAsignado = UResponsable.Where(w => w.DescCorta == s.ResponsableStr).Select(k => k.IdCatalogo).FirstOrDefault(),
                                    Descripcion = s.Descripcion,
                                    Estatus = "A",
                                    Prioridad = 0,
                                    HorasAsignadas = s.HorasAsignadas,
                                    IdProyecto = Proyectos.Where(w => w.ClaveVal == s.ProyectoStr).Select(k => k.IdProyecto).FirstOrDefault(),
                                    TipoActividadId = TipoActividad.Where(w => w.DescCorta == s.TipoActividadStr).Select(k => k.IdCatalogo).FirstOrDefault(),
                                    ClasificacionId = Clasificacion.Where(w => w.DescCorta == s.ClasificacionStr).Select(k => k.IdCatalogo).FirstOrDefault(),
                                    IdUsuarioResponsable = long.Parse(Proyectos.Where(w => w.ClaveVal == s.ProyectoStr).Select(k => k.IdULider).FirstOrDefault().ToString()),
                                    FechaInicio = s.FechaInicio,
                                    FechaSolicitado = s.FechaSolicitado,
                                    IdUCreo = IdUsuario,
                                    FechaCreo = DateTime.Now,
                                    Critico = false,
                                    Retrabajo = false,
                                    //ActividadValidaciones = (from a in LstAutorizacion
                                    //                         select new ActividadValidaciones
                                    //                         {
                                    //                             IdAutorizacion = a.IdAutorizacion,
                                    //                             NombreAut = a.Nombre,
                                    //                             Estatus = "P",
                                    //                             Secuencia = a.Secuencia
                                    //                         }).ToList()

                                }).ToList();



                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    contexto.BulkInsert(ListaFinal);
                    contexto.SaveChanges();


                    //Agrego las validaciones

                    //var con = new SqlConnection(Conexion);
                    //con.Open();

                    SqlConnection sqlcon = new SqlConnection(Conexion);
                    sqlcon.Open();
                    SqlCommand sqlcmd = new SqlCommand("InsertaValidacionesSP", sqlcon);
                    sqlcmd.CommandType = CommandType.StoredProcedure;

                    sqlcmd.ExecuteNonQuery();

                    sqlcmd.Connection.Close();
                    sqlcmd.Connection.Dispose();
                    sqlcmd.Dispose();
                    sqlcon.Close();



                    List<long?> LstLogs = contexto.ActividadLog.Select(s => s.IdActividad).Distinct().ToList();

                    var LstActividadesC = (from a in contexto.Actividad
                                           where !LstLogs.Contains(a.IdActividad)
                                           select a.IdActividad
                                     ).ToList();


                    var ListaLog = LstActividadesC
                                   .Select(s => new ActividadLog
                                   {
                                       IdActividad = s,
                                       Descripcion = "Generó actividad mediante la importación.",
                                       IdUCreo = IdUsuario,
                                       FechaHora = DateTime.Now
                                   }).ToList();

                    contexto.BulkInsert(ListaLog);
                    contexto.SaveChanges();

                    Mensaje = "E|Los datos se guardaron correctamente";


                }


                return Mensaje;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public string GuardaImportacionActividadesV2(List<ActividadesModel> LstActividad, long IdUsuario, string Conexion, string ConexionEF)
        {
            try
            {
                string Mensaje = string.Empty;
                List<string> ProyectosImp = LstActividad.Select(s => s.ProyectoStr).Distinct().ToList();
                List<string> SprintImp = LstActividad.Where(w => w.Sprint != "").Select(s => s.Sprint).Distinct().ToList();
                List<string> ResponsableImp = LstActividad.Select(s => s.ResponsableStr).Distinct().ToList();
                List<string> TipoActividadImp = LstActividad.Select(s => s.TipoActividadStr).Distinct().ToList();
                List<string> ClasificacionImp = LstActividad.Select(s => s.ClasificacionStr).Distinct().ToList();
                List<string> TipoImp = LstActividad.Select(s => s.TipoNombre).Distinct().ToList();

                List<ProyectosModel> Proyectos = new List<ProyectosModel>();
                List<ProyectoIteracionModel> Sprints = new List<ProyectoIteracionModel>();
                List<CatalogoGeneralModel> UResponsable = new List<CatalogoGeneralModel>();
                List<CatalogoGeneralModel> TipoActividad = new List<CatalogoGeneralModel>();
                List<CatalogoGeneralModel> Clasificacion = new List<CatalogoGeneralModel>();
                List<ActividadTipoModel> Tipos = new List<ActividadTipoModel>();
                List<String> StrProyectos = new List<String>();
                List<String> StrSprint = new List<String>();
                List<String> StrResponsable = new List<String>();
                List<String> StrTipoActividad = new List<String>();
                List<String> StrClasificacion = new List<String>();
                List<String> StrTipos = new List<String>();
                List<Autorizacion> LstAutorizacion = new List<Autorizacion>();
                List<WorkFlowModel> WorkFlow = new List<WorkFlowModel>();



                using (var contexto = new BDProductividad_DEVEntities(ConexionEF))
                {

                    contexto.Configuration.LazyLoadingEnabled = false;
                    Proyectos = contexto.Proyecto.Where(c => c.Activo == true).Select(s => new ProyectosModel { IdProyecto = s.IdProyecto, Clave = s.Clave, ClaveVal = s.Clave.Replace(" ", ""), IdULider = s.IdULider }).ToList();
                    Sprints = contexto.ProyectoIteracion.Select(s => new ProyectoIteracionModel { IdIteracion = s.IdIteracion, IdProyecto = s.IdProyecto, Nombre = s.Nombre.ToUpper(), Proyecto = s.Proyecto.Clave }).ToList();
                    UResponsable = contexto.Usuario.Where(c => c.Activo == true).Select(s => new CatalogoGeneralModel { IdCatalogo = s.IdUsuario, DescCorta = s.NumEmpleado }).ToList();
                    TipoActividad = contexto.CatalogoGeneral.Where(c => c.Activo == true && c.IdTabla == 2 && c.Cabecera == false).Select(s => new CatalogoGeneralModel { IdCatalogo = s.IdCatalogo, DescCorta = s.DescCorta }).ToList();
                    Clasificacion = contexto.CatalogoGeneral.Where(c => c.Activo == true && c.IdTabla == 5 && c.Cabecera == false).Select(s => new CatalogoGeneralModel { IdCatalogo = s.IdCatalogo, DescCorta = s.DescCorta }).ToList();
                    LstAutorizacion = contexto.Autorizacion.ToList();
                    Tipos = contexto.ActividadTipo.Select(x => new ActividadTipoModel { ActividadTipoId = x.ActividadTipoId, Nombre = x.Nombre, Url = x.Url }).ToList();
                    WorkFlow = contexto.WorkFlow.Where(w => w.EstatusR == "A" ).Select(s=> new WorkFlowModel { IdWorkFlow = s.IdWorkFlow,IdProyecto= s.IdProyecto, IdActividadTipo = s.IdActividadTipo , ClaveProyecto= s.Proyecto.Clave, TipoNombre = s.ActividadTipo.Nombre }).ToList();
                }


                StrProyectos = Proyectos.Select(s => s.ClaveVal).ToList();
                StrSprint = Sprints.Select(s => s.Nombre).ToList();
                StrResponsable = UResponsable.Select(s => s.DescCorta).ToList();
                StrTipoActividad = TipoActividad.Select(s => s.DescCorta).ToList();
                StrClasificacion = Clasificacion.Select(s => s.DescCorta).ToList();
                StrTipos = Tipos.Select(s => s.Nombre).ToList();

                var ValProyecto = (from p in ProyectosImp
                                   where !StrProyectos.Contains(p)
                                   select p).ToList();

                if (ValProyecto.Count > 0)
                {
                    return "A|El proyecto con clave " + ValProyecto.FirstOrDefault() + " no existe o se encuentra inactivo.";
                }


                var ValSprint = (from p in SprintImp
                                   where !StrSprint.Contains(p)
                                   select p).ToList();

                if (ValSprint.Count > 0)
                {
                    return "A|El sprint con clave " + ValSprint.FirstOrDefault() + " no existe o se encuentra inactivo.";
                }


                var ValUResponsable = (from p in ResponsableImp
                                       where !StrResponsable.Contains(p)
                                       select p).ToList();

                var asignstr = ResponsableImp.Select(s => s).FirstOrDefault();
                long IdAsignado = 0;
                if (ValUResponsable.Count > 0)
                {
                    if (asignstr != "")
                    {
                        return "A|El usuario con clave " + ValUResponsable.FirstOrDefault() + " no existe o se encuentra inactivo.";
                    }
                    else
                    {
                        IdAsignado = -1;
                    }

                   
                }

                var ValTipoActividad = (from p in TipoActividadImp
                                        where !StrTipoActividad.Contains(p)
                                        select p).ToList();



                var tipostr = TipoActividadImp.Select(s => s).FirstOrDefault();
                long IdFase = 0;

                if (ValTipoActividad.Count > 0)
                {

                    if (tipostr != "") {
                        return "A|La fase " + ValTipoActividad.FirstOrDefault() + " no existe o se encuentra inactiva.";
                    }
                    else
                    {
                        IdFase = -1;
                    }
              
               
                }

                var ValClasificacion = (from p in ClasificacionImp
                                        where !StrClasificacion.Contains(p)
                                        select p).ToList();

                var clasifstr = TipoActividadImp.Select(s => s).FirstOrDefault();
                long IdCategoria = 0;
                if (ValClasificacion.Count > 0)
                {

                    if (clasifstr != "")
                    {
                        return "A|La clasificación " + ValClasificacion.FirstOrDefault() + " no existe o se encuentra inactiva.";
                    }
                    else
                    {

                        IdCategoria = -1;
                    }


                }

                var ValTipos = (from p in TipoImp
                                where !StrTipos.Contains(p)
                                select p).ToList();

               
                if (ValTipos.Count > 0)
                {
                    return "A|El tipo " + ValTipos.FirstOrDefault() + " no existe.";

                }

                var ListaFinal = LstActividad
                                .Select(s => new Actividad
                                {
                                    IdUsuarioAsignado = IdAsignado == 0 ? UResponsable.Where(w => w.DescCorta == s.ResponsableStr).Select(k => k.IdCatalogo).FirstOrDefault() : IdAsignado,
                                    Descripcion = s.Descripcion,
                                    BR = s.BR,
                                    Estatus = "A",
                                    EstatusCte = "P",
                                    Prioridad = 1,
                                    Planificada = 1,
                                    HorasFacturables = s.HorasFacturables,
                                    HorasAsignadas = s.HorasAsignadas,
                                    IdProyecto = Proyectos.Where(w => w.ClaveVal == s.ProyectoStr).Select(k => k.IdProyecto).FirstOrDefault(),
                                    TipoActividadId = IdFase == 0 ? TipoActividad.Where(w => w.DescCorta == s.TipoActividadStr).Select(k => k.IdCatalogo).FirstOrDefault() : IdFase,
                                    ClasificacionId = IdCategoria == 0 ? Clasificacion.Where(w => w.DescCorta == s.ClasificacionStr).Select(k => k.IdCatalogo).FirstOrDefault() : IdCategoria,
                                    IdUsuarioResponsable = long.Parse(Proyectos.Where(w => w.ClaveVal == s.ProyectoStr).Select(k => k.IdULider).FirstOrDefault().ToString()),
                                    FechaInicio = s.FechaInicio,
                                    FechaSolicitado = s.FechaSolicitado,
                                    IdUCreo = IdUsuario,
                                    FechaCreo = DateTime.Now,
                                    Critico = false,
                                    Retrabajo = false,
                                    TipoId = Tipos.Where(x => x.Nombre == s.TipoNombre).FirstOrDefault().ActividadTipoId,
                                    IdIteracion = s.Sprint == "" ? (long?)null : Sprints.Where(w => w.Nombre == s.Sprint && w.Proyecto == s.ProyectoStr).FirstOrDefault().IdIteracion,
                                    IdWorkflow = WorkFlow.Where(w => w.ClaveProyecto == s.ProyectoStr && w.TipoNombre == s.TipoNombre).FirstOrDefault().IdWorkFlow

                                    //ActividadValidaciones = (from a in LstAutorizacion
                                    //                         select new ActividadValidaciones
                                    //                         {
                                    //                             IdAutorizacion = a.IdAutorizacion,
                                    //                             NombreAut = a.Nombre,
                                    //                             Estatus = "P",
                                    //                             Secuencia = a.Secuencia
                                    //                         }).ToList()

                                }).ToList();



                using (var contexto = new BDProductividad_DEVEntities(ConexionEF))
                {

                    contexto.Actividad.AddRange(ListaFinal);
                    contexto.SaveChanges();


                    //Agrego las validaciones y fases

                    //var con = new SqlConnection(Conexion);
                    //con.Open();

                    SqlConnection sqlcon = new SqlConnection(Conexion);
                    sqlcon.Open();
                    SqlCommand sqlcmd = new SqlCommand("InsertaValidacionesSP", sqlcon);
                    sqlcmd.CommandType = CommandType.StoredProcedure;

                    sqlcmd.ExecuteNonQuery();

                    sqlcmd.Connection.Close();
                    sqlcmd.Connection.Dispose();
                    sqlcmd.Dispose();
                    sqlcon.Close();



                    //List<long?> LstLogs = contexto.ActividadLog.Select(s => s.IdActividad).Distinct().ToList();

                    //var LstActividadesC = (from a in contexto.Actividad
                    //                       where !LstLogs.Contains(a.IdActividad)
                    //                       select a.IdActividad
                    //                 ).ToList();


                    //var ListaLog = LstActividadesC
                    //               .Select(s => new ActividadLog
                    //               {
                    //                   IdActividad = s,
                    //                   Descripcion = "Generó actividad mediante la importación.",
                    //                   IdUCreo = IdUsuario,
                    //                   FechaHora = DateTime.Now
                    //               }).ToList();

                    //contexto.BulkInsert(ListaLog);
                    contexto.SaveChanges();

                    Mensaje = "E|Los datos se guardaron correctamente";


                }


                return Mensaje;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }
        public string GuardaImportacionActividadesActualizacion(List<ActividadesModel> LstActividad, long IdUsuario, string Conexion, string ConexionEF)
        {
            try
            {
                string Mensaje = string.Empty;
                //List<string> ProyectosImp = LstActividad.Select(s => s.ProyectoStr).Distinct().ToList();
                List<string> SprintImp = LstActividad.Where(w=> w.Sprint != "").Select(s => s.Sprint).Distinct().ToList();
                List<string> ResponsableImp = LstActividad.Select(s => s.ResponsableStr).Distinct().ToList();
                List<string> TipoActividadImp = LstActividad.Select(s => s.TipoActividadStr).Distinct().ToList();
                List<string> ClasificacionImp = LstActividad.Select(s => s.ClasificacionStr).Distinct().ToList();
                List<string> TipoImp = LstActividad.Select(s => s.TipoNombre).Distinct().ToList();

                //List<ProyectosModel> Proyectos = new List<ProyectosModel>();
                List<ProyectoIteracionModel> Sprints = new List<ProyectoIteracionModel>();
                List<CatalogoGeneralModel> UResponsable = new List<CatalogoGeneralModel>();
                List<CatalogoGeneralModel> TipoActividad = new List<CatalogoGeneralModel>();
                List<CatalogoGeneralModel> Clasificacion = new List<CatalogoGeneralModel>();
                List<ActividadTipoModel> Tipos = new List<ActividadTipoModel>();
                List<String> StrProyectos = new List<String>();
                List<String> StrSprint = new List<String>();
                List<String> StrResponsable = new List<String>();
                List<String> StrTipoActividad = new List<String>();
                List<String> StrClasificacion = new List<String>();
                List<String> StrTipos = new List<String>();
                List<Autorizacion> LstAutorizacion = new List<Autorizacion>();



                using (var contexto = new BDProductividad_DEVEntities(ConexionEF))
                {

                    contexto.Configuration.LazyLoadingEnabled = false;
                    Sprints = contexto.ProyectoIteracion.Select(s => new ProyectoIteracionModel { IdIteracion = s.IdIteracion, IdProyecto = s.IdProyecto, Nombre = s.Nombre.ToUpper(), Proyecto = s.Proyecto.Clave }).ToList();
                    UResponsable = contexto.Usuario.Where(c => c.Activo == true).Select(s => new CatalogoGeneralModel { IdCatalogo = s.IdUsuario, DescCorta = s.NumEmpleado }).ToList();
                    TipoActividad = contexto.CatalogoGeneral.Where(c => c.Activo == true && c.IdTabla == 2 && c.Cabecera == false).Select(s => new CatalogoGeneralModel { IdCatalogo = s.IdCatalogo, DescCorta = s.DescCorta }).ToList();
                    Clasificacion = contexto.CatalogoGeneral.Where(c => c.Activo == true && c.IdTabla == 5 && c.Cabecera == false).Select(s => new CatalogoGeneralModel { IdCatalogo = s.IdCatalogo, DescCorta = s.DescCorta }).ToList();
                    LstAutorizacion = contexto.Autorizacion.ToList();
                    Tipos = contexto.ActividadTipo.Select(x => new ActividadTipoModel { ActividadTipoId = x.ActividadTipoId, Nombre = x.Nombre, Url = x.Url }).ToList();
                }



                StrResponsable = UResponsable.Select(s => s.DescCorta).ToList();
                StrSprint = Sprints.Select(s => s.Nombre).ToList();
                StrTipoActividad = TipoActividad.Select(s => s.DescCorta).ToList();
                StrClasificacion = Clasificacion.Select(s => s.DescCorta).ToList();
                StrTipos = Tipos.Select(s => s.Nombre).ToList();


                var ValSprint = (from p in SprintImp
                                 where !StrSprint.Contains(p)
                                 select p).ToList();

                if (ValSprint.Count > 0)
                {
                    return "A|El sprint con clave " + ValSprint.FirstOrDefault() + " no existe o se encuentra inactivo.";
                }



                var ValUResponsable = (from p in ResponsableImp
                                       where !StrResponsable.Contains(p)
                                       select p).ToList();


                var asignstr = ResponsableImp.Select(s => s).FirstOrDefault();
                long IdAsignado = 0;
                if (ValUResponsable.Count > 0)
                {
                    if (asignstr != "")
                    {
                        return "A|El usuario con clave " + ValUResponsable.FirstOrDefault() + " no existe o se encuentra inactivo.";
                    }
                    else
                    {
                        IdAsignado = -1;
                    }


                }

                var ValTipoActividad = (from p in TipoActividadImp
                                        where !StrTipoActividad.Contains(p)
                                        select p).ToList();



                var tipostr = TipoActividadImp.Select(s => s).FirstOrDefault();
                long IdFase = 0;

                if (ValTipoActividad.Count > 0)
                {

                    if (tipostr != "")
                    {
                        return "A|La fase " + ValTipoActividad.FirstOrDefault() + " no existe o se encuentra inactiva.";
                    }
                    else
                    {
                        IdFase = -1;
                    }


                }

                var ValClasificacion = (from p in ClasificacionImp
                                        where !StrClasificacion.Contains(p)
                                        select p).ToList();

                var clasifstr = TipoActividadImp.Select(s => s).FirstOrDefault();
                long IdCategoria = 0;
                if (ValClasificacion.Count > 0)
                {

                    if (clasifstr != "")
                    {
                        return "A|La clasificación " + ValClasificacion.FirstOrDefault() + " no existe o se encuentra inactiva.";
                    }
                    else
                    {

                        IdCategoria = -1;
                    }


                }

                //    if (ValUResponsable.Count > 0)
                //{
                //    return "A|El usuario con clave " + ValUResponsable.FirstOrDefault() + " no existe o se encuentra inactivo.";
                //}

                //var ValTipoActividad = (from p in TipoActividadImp
                //                        where !StrTipoActividad.Contains(p)
                //                        select p).ToList();


                //if (ValTipoActividad.Count > 0)
                //{
                //    return "A|La fase " + ValTipoActividad.FirstOrDefault() + " no existe o se encuentra inactiva.";
                //}

                //var ValClasificacion = (from p in ClasificacionImp
                //                        where !StrClasificacion.Contains(p)
                //                        select p).ToList();

                //if (ValClasificacion.Count > 0)
                //{
                //    return "A|La clasificación " + ValClasificacion.FirstOrDefault() + " no existe o se encuentra inactiva.";
                //}



                //long IdFase = 0;
                //if (ValTipoActividad.Count > 0)
                //{
                //    //return "A|La fase " + ValTipoActividad.FirstOrDefault() + " no existe o se encuentra inactiva.";
                //    IdFase = -1;
                //}

                //var ValClasificacion = (from p in ClasificacionImp
                //                        where !StrClasificacion.Contains(p)
                //                        select p).ToList();
                //long IdCategoria = 0;
                //if (ValClasificacion.Count > 0)
                //{
                //    IdCategoria = -1;

                //}


                var ValTipos = (from p in TipoImp
                                where !StrTipos.Contains(p)
                                select p).ToList();

                if (ValTipos.Count > 0)
                {
                    return "A|El tipo " + ValTipos.FirstOrDefault() + " no existe.";
                }

                var ListaFinal = LstActividad
                                .Select(s => new Actividad
                                {
                                    IdActividad = s.IdActividad,
                                    IdUsuarioAsignado = IdAsignado == 0 ? UResponsable.Where(w => w.DescCorta == s.ResponsableStr).Select(k => k.IdCatalogo).FirstOrDefault() : IdAsignado,
                                    //Descripcion = s.Descripcion,
                                    BR = s.BR,
                                    Estatus = "A",
                                    Prioridad = 0,
                                    Planificada = 1,
                                    HorasFacturables = s.HorasFacturables,
                                    HorasAsignadas = s.HorasAsignadas,
                                    TipoActividadId = IdFase == 0 ? TipoActividad.Where(w => w.DescCorta == s.TipoActividadStr).Select(k => k.IdCatalogo).FirstOrDefault() : IdFase,
                                    ClasificacionId = IdCategoria == 0 ? Clasificacion.Where(w => w.DescCorta == s.ClasificacionStr).Select(k => k.IdCatalogo).FirstOrDefault() : IdCategoria,
                                    FechaInicio = s.FechaInicio,
                                    FechaSolicitado = s.FechaSolicitado,
                                    IdUCreo = IdUsuario,
                                    FechaCreo = DateTime.Now,
                                    TipoId = Tipos.Where(x => x.Nombre == s.TipoNombre).FirstOrDefault().ActividadTipoId,
                                    IdIteracion = s.Sprint == "" ? (long?)null : Sprints.Where(w => w.Nombre == s.Sprint && w.Proyecto == s.ProyectoStr).FirstOrDefault().IdIteracion
                                }).ToList();



                using (var contexto = new BDProductividad_DEVEntities(ConexionEF))
                {


                    foreach (var a in ListaFinal)
                    {

                        var act = contexto.Actividad.Where(w => w.IdActividad == a.IdActividad).FirstOrDefault();

                        act.BR = a.BR == "null" ? string.Empty : (a.BR == "NULL" ? string.Empty : a.BR);
                        act.IdUsuarioAsignado = a.IdUsuarioAsignado;
                        //act.Descripcion = a.Descripcion;
                        act.HorasFacturables = a.HorasFacturables;
                        act.HorasAsignadas = a.HorasAsignadas;
                        act.TipoActividadId = a.TipoActividadId;
                        act.ClasificacionId = a.ClasificacionId;
                        act.IdIteracion = a.IdIteracion;
                        //act.IdUsuarioResponsable = a.IdUsuarioResponsable;
                        act.FechaInicio = a.FechaInicio;
                        act.FechaSolicitado = a.FechaSolicitado;
                        act.IdUMod = IdUsuario;
                        act.FechaMod = DateTime.Now;
                        act.TipoId = a.TipoId;

                        contexto.SaveChanges();
                    }




                    //Agrego las validaciones y fases

                    //var con = new SqlConnection(Conexion);
                    //con.Open();

                    //SqlConnection sqlcon = new SqlConnection(Conexion);
                    //sqlcon.Open();
                    //SqlCommand sqlcmd = new SqlCommand("InsertaValidacionesSP", sqlcon);
                    //sqlcmd.CommandType = CommandType.StoredProcedure;

                    //sqlcmd.ExecuteNonQuery();

                    //sqlcmd.Connection.Close();
                    //sqlcmd.Connection.Dispose();
                    //sqlcmd.Dispose();
                    //sqlcon.Close();



                    //List<long?> LstLogs = contexto.ActividadLog.Select(s => s.IdActividad).Distinct().ToList();

                    //var LstActividadesC = (from a in contexto.Actividad
                    //                       where !LstLogs.Contains(a.IdActividad)
                    //                       select a.IdActividad
                    //                 ).ToList();


                    var ListaLog = ListaFinal
                                   .Select(s => new ActividadLog
                                   {
                                       IdActividad = s.IdActividad,
                                       Descripcion = "Actualizó la actividad mediante la importación.",
                                       IdUCreo = IdUsuario,
                                       FechaHora = DateTime.Now
                                   }).ToList();

                    contexto.BulkInsert(ListaLog);
                    contexto.SaveChanges();

                    Mensaje = "E|Los datos se actualizaron correctamente";


                }


                return Mensaje;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public string GuardaImportacionCasosPrueba(List<ActividadesModel> LstActividad,long IdProyecto, long IdUsuario, string Conexion, string ConexionEF)
        {
            try
            {
                string Mensaje = string.Empty;
                List<string> ProyectosImp = LstActividad.Select(s => s.ProyectoStr).Distinct().ToList();
                List<string> ActividadesImp = LstActividad.Select(s => s.IdActividadR1.ToString()).Distinct().ToList();
                List<string> SprintImp = LstActividad.Where(w => w.Sprint != "").Select(s => s.Sprint).Distinct().ToList();
                List<string> AsignadoImp = LstActividad.Select(s => s.AsignadoStr).Distinct().ToList();
                List<string> ResponsableImp = LstActividad.Select(s => s.ResponsableStr).Distinct().ToList();
                List<string> TipoActividadImp = LstActividad.Select(s => s.TipoActividadStr).Distinct().ToList();
                List<string> ClasificacionImp = LstActividad.Select(s => s.ClasificacionStr).Distinct().ToList();
                List<string> TipoImp = LstActividad.Select(s => s.TipoNombre).Distinct().ToList();

                List<ProyectosModel> Proyectos = new List<ProyectosModel>();
                List<ProyectoIteracionModel> Sprints = new List<ProyectoIteracionModel>();
                List<CatalogoGeneralModel> UResponsable = new List<CatalogoGeneralModel>();
                List<CatalogoGeneralModel> UAsignado = new List<CatalogoGeneralModel>();
                List<CatalogoGeneralModel> TipoActividad = new List<CatalogoGeneralModel>();
                List<CatalogoGeneralModel> Clasificacion = new List<CatalogoGeneralModel>();
                List<ActividadTipoModel> Tipos = new List<ActividadTipoModel>();
                List<String> StrProyectos = new List<String>();
                List<String> StrSprint = new List<String>();
                List<String> StrAsignado = new List<String>();
                List<String> StrResponsable = new List<String>();
                List<String> StrTipoActividad = new List<String>();
                List<String> StrClasificacion = new List<String>();
                List<String> StrTipos = new List<String>();
                List<String> StrActividad = new List<String>();
                List<Autorizacion> LstAutorizacion = new List<Autorizacion>();
                List<WorkFlowModel> WorkFlow = new List<WorkFlowModel>();


                using (var contexto = new BDProductividad_DEVEntities(ConexionEF))
                {

                    contexto.Configuration.LazyLoadingEnabled = false;
                    Proyectos = contexto.Proyecto.Where(c => c.Activo == true).Select(s => new ProyectosModel { IdProyecto = s.IdProyecto, Clave = s.Clave, ClaveVal = s.Clave.Replace(" ", ""), IdULider = s.IdULider }).ToList();
                    Sprints = contexto.ProyectoIteracion.Select(s => new ProyectoIteracionModel { IdIteracion = s.IdIteracion, IdProyecto = s.IdProyecto, Nombre = s.Nombre.ToUpper() , Proyecto = s.Proyecto.Clave   }).ToList();
                    UResponsable = contexto.Usuario.Where(c => c.Activo == true).Select(s => new CatalogoGeneralModel { IdCatalogo = s.IdUsuario, DescCorta = s.NumEmpleado }).ToList();
                    TipoActividad = contexto.CatalogoGeneral.Where(c => c.Activo == true && c.IdTabla == 2 && c.Cabecera == false).Select(s => new CatalogoGeneralModel { IdCatalogo = s.IdCatalogo, DescCorta = s.DescCorta }).ToList();
                    Clasificacion = contexto.CatalogoGeneral.Where(c => c.Activo == true && c.IdTabla == 5 && c.Cabecera == false).Select(s => new CatalogoGeneralModel { IdCatalogo = s.IdCatalogo, DescCorta = s.DescCorta }).ToList();
                    LstAutorizacion = contexto.Autorizacion.ToList();
                    StrActividad = contexto.Actividad.Where(w=> w.IdProyecto == IdProyecto  && w.TipoId == 4  && w.Estatus != "C").Select(s=> s.IdActividad.ToString()).ToList();
                    Tipos = contexto.ActividadTipo.Select(x => new ActividadTipoModel { ActividadTipoId = x.ActividadTipoId, Nombre = x.Nombre, Url = x.Url }).ToList();
                    WorkFlow = contexto.WorkFlow.Where(w => w.EstatusR == "A").Select(s => new WorkFlowModel { IdWorkFlow = s.IdWorkFlow, IdProyecto = s.IdProyecto, IdActividadTipo = s.IdActividadTipo, ClaveProyecto = s.Proyecto.Clave, TipoNombre = s.ActividadTipo.Nombre }).ToList();
                }


                StrProyectos = Proyectos.Select(s => s.ClaveVal).ToList();
                StrSprint = Sprints.Select(s => s.Nombre).ToList();
                StrAsignado = UResponsable.Select(s => s.DescCorta).ToList();
                StrResponsable = UResponsable.Select(s => s.DescCorta).ToList();
                StrTipoActividad = TipoActividad.Select(s => s.DescCorta).ToList();
                StrClasificacion = Clasificacion.Select(s => s.DescCorta).ToList();
                StrTipos = Tipos.Select(s => s.Nombre).ToList();

                var ValProyecto = (from p in ProyectosImp
                                   where !StrProyectos.Contains(p)
                                   select p).ToList();

                if (ValProyecto.Count > 0)
                {
                    return "A|El proyecto con clave " + ValProyecto.FirstOrDefault() + " no existe o se encuentra inactivo.";
                }


                var ValActs = (from p in ActividadesImp
                               where !StrActividad.Contains(p)
                                   select p).ToList();

                if (ValActs.Count > 0)
                {
                    return "A|La actividad con clave " + ValActs.FirstOrDefault() + " no es una HU del proyecto o esta cancelada.";
                }


                var ValSprint = (from p in SprintImp
                                 where !StrSprint.Contains(p)
                                 select p).ToList();

                if (ValSprint.Count > 0)
                {
                    return "A|El sprint con clave " + ValSprint.FirstOrDefault() + " no existe o se encuentra inactivo.";
                }


                var ValUResponsable = (from p in ResponsableImp
                                       where !StrResponsable.Contains(p)
                                       select p).ToList();

                if (ValUResponsable.Count > 0)
                {
                    return "A|El usuario con clave " + ValUResponsable.FirstOrDefault() + " no existe o se encuentra inactivo.";
                }


                var ValUAsignado = (from p in AsignadoImp
                                       where !StrResponsable.Contains(p)
                                       select p).ToList();

                if (ValUAsignado.Count > 0)
                {
                    return "A|El usuario con clave " + ValUResponsable.FirstOrDefault() + " no existe o se encuentra inactivo.";
                }


                //var ValTipoActividad = (from p in TipoActividadImp
                //                        where !StrTipoActividad.Contains(p)
                //                        select p).ToList();


                //if (ValTipoActividad.Count > 0)
                //{
                //    return "A|La fase " + ValTipoActividad.FirstOrDefault() + " no existe o se encuentra inactiva.";
                //}

                var ValClasificacion = (from p in ClasificacionImp
                                        where !StrClasificacion.Contains(p)
                                        select p).ToList();

                if (ValClasificacion.Count > 0)
                {
                    return "A|La clasificación " + ValClasificacion.FirstOrDefault() + " no existe o se encuentra inactiva.";
                }

                var ValTipos = (from p in TipoImp
                                where !StrTipos.Contains(p)
                                select p).ToList();

                //if (ValTipos.Count > 0)
                //{
                //    return "A|El tipo " + ValTipos.FirstOrDefault() + " no existe.";
                //}

                var ListaFinal = LstActividad
                                .Select(s => new Actividad
                                {

                                    Descripcion = s.Descripcion,
                                    BR = s.BR,
                                    Estatus = "R",
                                    EstatusCte = "P",
                                    Prioridad = 0,
                                    Planificada = 1,
                                    TiempoEjecucion = s.TiempoEjecucion,
                                    HorasFacturables = s.HorasFacturables,
                                    HorasAsignadas = s.HorasAsignadas,
                                    HorasFinales = decimal.Parse(s.HorasAsignadas.ToString()),
                                    IdProyecto = Proyectos.Where(w => w.ClaveVal == s.ProyectoStr).Select(k => k.IdProyecto).FirstOrDefault(),
                                    TipoActividadId = TipoActividad.Where(w => w.DescCorta == "QA").Select(k => k.IdCatalogo).FirstOrDefault(),
                                    ClasificacionId = Clasificacion.Where(w => w.DescCorta == s.ClasificacionStr).Select(k => k.IdCatalogo).FirstOrDefault(),
                                    IdUsuarioAsignado = UResponsable.Where(w => w.DescCorta == s.AsignadoStr).Select(k => k.IdCatalogo).FirstOrDefault(),
                                    IdUsuarioResponsable = UResponsable.Where(w => w.DescCorta == s.ResponsableStr).Select(k => k.IdCatalogo).FirstOrDefault(),
                                    FechaInicio = s.FechaInicio,
                                    FechaSolicitado = s.FechaSolicitado,
                                    FechaTermino = DateTime.Now,
                                    FechaRevision = DateTime.Now,
                                    IdUCreo = IdUsuario,
                                    FechaCreo = DateTime.Now,
                                    Critico = false,
                                    Retrabajo = false,
                                    TipoId = 8,
                                    IdIteracion = s.Sprint == "" ? (long?)null : Sprints.Where(w => w.Nombre == s.Sprint  && w.Proyecto == s.ProyectoStr).FirstOrDefault().IdIteracion,
                                    IdActividadRef = s.IdActividadR1,
                                    IdWorkflow = WorkFlow.Where(w => w.ClaveProyecto == s.ProyectoStr && w.TipoNombre == "Test case").FirstOrDefault().IdWorkFlow

                                }).ToList();


                  

                

                using (var contexto = new BDProductividad_DEVEntities(ConexionEF))
                {

                    contexto.Actividad.AddRange(ListaFinal);
                    contexto.SaveChanges();


                    var LsRelaciones = ListaFinal
                                        .Select(s => new ActividadRelacion { 
                                            IdActividad = s.IdActividad,
                                            IdActividadRelacionada =  long.Parse(s.IdActividadRef.ToString())
                    
                    
                                         }).ToList();


                    contexto.ActividadRelacion.AddRange(LsRelaciones);
                    
                    
                    
                    
                    var LstTrabajos = ListaFinal.Select(s =>  new ActividadTrabajo { 
                    
                         IdActividad = s.IdActividad,
                         Fecha = DateTime.Now,
                         Tiempo = decimal.Parse( s.HorasAsignadas.ToString()),
                         IdUsuarioRegistro = long.Parse(s.IdUsuarioAsignado.ToString()),
                         FechaRegistro = DateTime.Now,
                         Comentario = "Carga de test case mediante layout"
                    
                    }).ToList();

                    contexto.ActividadTrabajo.AddRange(LstTrabajos);
                    
                    contexto.SaveChanges();



                    //Agrego las validaciones y fases

                    //var con = new SqlConnection(Conexion);
                    //con.Open();

                    SqlConnection sqlcon = new SqlConnection(Conexion);
                    sqlcon.Open();
                    SqlCommand sqlcmd = new SqlCommand("InsertaValidacionesSP", sqlcon);
                    sqlcmd.CommandType = CommandType.StoredProcedure;

                    sqlcmd.ExecuteNonQuery();

                    sqlcmd.Connection.Close();
                    sqlcmd.Connection.Dispose();
                    sqlcmd.Dispose();
                    sqlcon.Close();



                    //List<long?> LstLogs = contexto.ActividadLog.Select(s => s.IdActividad).Distinct().ToList();

                    //var LstActividadesC = (from a in contexto.Actividad
                    //                       where !LstLogs.Contains(a.IdActividad)
                    //                       select a.IdActividad
                    //                 ).ToList();


                    //var ListaLog = LstActividadesC
                    //               .Select(s => new ActividadLog
                    //               {
                    //                   IdActividad = s,
                    //                   Descripcion = "Generó actividad mediante la importación.",
                    //                   IdUCreo = IdUsuario,
                    //                   FechaHora = DateTime.Now
                    //               }).ToList();

                    //contexto.BulkInsert(ListaLog);
                    contexto.SaveChanges();

                    Mensaje = "E|Los datos se guardaron correctamente";


                }


                return Mensaje;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public List<ActividadesValidacionModel> ConsultaValidaciones(long IdActividad, long IdUsuario, string Conexion)
        {
            try
            {
                List<ActividadesValidacionModel> LstValidacion = new List<ActividadesValidacionModel>();


                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    List<UsuarioAutorizacionModel> Autorizaciones = contexto.UsuarioAutorizacion.Where(u => u.IdUsuario == IdUsuario)
                                                                   .Select(s => new UsuarioAutorizacionModel
                                                                   {
                                                                       IdUsuario = s.IdUsuario,
                                                                       IdAutorizacion = s.IdAutorizacion
                                                                   }).ToList();

                    List<ActividadValidaciones> LstActividades = contexto.ActividadValidaciones.Where(w => w.IdActividad == IdActividad).ToList();


                    LstValidacion = (from s in LstActividades
                                     orderby s.Secuencia
                                     select new ActividadesValidacionModel
                                     {
                                         IdActividad = s.IdActividad,
                                         IdAutorizacion = s.IdAutorizacion,
                                         IdActividadVal = s.IdActividadVal,
                                         Estatus = s.Estatus,
                                         NombreAut = s.NombreAut,
                                         Valida = Autorizaciones.Where(w => w.IdAutorizacion == s.IdAutorizacion).FirstOrDefault() != null ? true : false,
                                         NombreValido = s.Estatus != "P" ? contexto.Usuario.Where(w => w.IdUsuario == s.IdUAtendio).Select(x => x.Nombre + " " + x.ApPaterno + " " + x.ApMaterno).FirstOrDefault() : string.Empty,
                                         FechaAtendio = s.FechaAtendio != null ? s.FechaAtendio : (DateTime?)null,
                                         MotivoRechazoId = s.MotivoRechazoId,
                                         DescripcionRechazo = s.DescripcionRechazo

                                     }).ToList();


                }


                return LstValidacion;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public string[] ValidaRechazaActividad(ActividadesValidacionModel Validacion, long IdUsuario, string Conexion)
        {
            try
            {

                string[] Mensaje = { "0", "0", "0" };
                string LogMsj = "";
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                
                    //var auth = contexto.UsuarioAutorizacion.Where(w => w.IdUsuario == IdUsuario).Count();

                    //if(auth <1)
                    //{
                    //    Mensaje[0] = "0";
                    //    Mensaje[1] = "No tiene permisos para rechazar o liberar actividades.";
                    //    return Mensaje;

                    //}
               
                    var actividad = contexto.Actividad.Where(w => w.IdActividad == Validacion.IdActividad).FirstOrDefault();




                    if (Validacion.IdActividadVal != 0)
                    {
                        //

                        var estatusasigna = Validacion.Valida == true ? contexto.Autorizacion.Where(w => w.IdAutorizacion == Validacion.IdAutorizacion).Select(s => s.EstatusAsigna).FirstOrDefault() : "X";
                        var actividadval = contexto.ActividadValidaciones.Where(w => w.IdActividadVal == Validacion.IdActividadVal).FirstOrDefault();
                         var actividadant = contexto.ActividadValidaciones.Where(w => w.IdActividad == Validacion.IdActividad && w.Secuencia < actividadval.Secuencia).FirstOrDefault();

                    if (actividadval.Secuencia == 1)
                    {
                        if (actividad.Estatus != "R" && estatusasigna != "L")
                        {
                            Mensaje[0] = "0";
                            Mensaje[1] = "Sólo se pueden válidar actividades en estatus 'Revisión'.";
                            return Mensaje;
                        }
                    }

                    

                    //Valido que la validación anterior este liberada
                    if (actividadant != null)
                    {

                        if (actividadant.Estatus != "L")
                        {

                            Mensaje[0] = "0";
                            Mensaje[1] = "No se puede ejecutar esta acción, ya que la validación anterior aún no se encuentra liberada.";
                            return Mensaje;
                        }
                    }


                    actividad.Estatus = estatusasigna;
                    if (estatusasigna == "V")
                    {

                        actividad.FechaRevision = DateTime.Now;
                        actividadval.Estatus = "L";
                        Mensaje[0] = "1";
                        Mensaje[1] = "La actividad se válido correctamente.";
                        Mensaje[2] = estatusasigna;
                        LogMsj = "Válido la actividad";

                    }
                    else if (estatusasigna == "L")
                    {

                        actividad.FechaCierre = DateTime.Now;
                        actividadval.Estatus = "L";
                        Mensaje[0] = "1";
                        Mensaje[1] = "La actividad se libero correctamente.";
                        Mensaje[2] = estatusasigna;
                        LogMsj = "Liberó la actividad";
                    }
                    else if (estatusasigna == "X")
                    {
                        actividadval.Estatus = "X";
                        actividadval.MotivoRechazoId = Validacion.MotivoRechazoId;
                        actividadval.DescripcionRechazo = Validacion.DescripcionRechazo;

                            //JMM Se agrega a los comentarios
                            ActividadComentario c = new ActividadComentario();
                            c.IdActividad = actividad.IdActividad;
                            c.Comentario = "Ha rechazado la actividad; Motivos: " + Validacion.DescripcionRechazo;
                            c.IdUsuario = IdUsuario;
                            c.Fecha = DateTime.Now;
                            contexto.ActividadComentario.Add(c);


                        Mensaje[0] = "1";
                        Mensaje[1] = "La actividad se rechazo correctamente.";
                        Mensaje[2] = estatusasigna;
                        LogMsj = "Rechazo la actividad";

                    }

                    actividadval.IdUAtendio = IdUsuario;
                    actividadval.FechaAtendio = DateTime.Now;

                    long IdWorkFlow = contexto.WorkFlow.Where(w => w.IdProyecto == actividad.IdProyecto && w.IdActividadTipo == actividad.TipoId && w.EstatusR == estatusasigna).FirstOrDefault().IdWorkFlow;
                    actividad.IdWorkflow = IdWorkFlow;


                    }
                    else //JMM: Cuando se manda la validacion desde el kanban (MAS FACIL) 
                    {

                        var estatusasigna = Validacion.Valida == true ? "L" : "X";

                        if(estatusasigna == "L")
                        {
                            if(actividad.Estatus != "R")
                            {

                                Mensaje[0] = "0";
                                Mensaje[1] = "Solo se pueden liberar actividades con estatus Revisión."; 
                                return Mensaje;
                            }


                        }

                        actividad.Estatus = estatusasigna;
                        long IdWorkFlow = contexto.WorkFlow.Where(w => w.IdProyecto == actividad.IdProyecto && w.IdActividadTipo == actividad.TipoId && w.EstatusR == estatusasigna).FirstOrDefault().IdWorkFlow;
                        actividad.IdWorkflow = IdWorkFlow;


                        if (estatusasigna == "L")
                        {

                            actividad.FechaCierre = DateTime.Now;
                            //actividadval.Estatus = "L";
                            Mensaje[0] = "1";
                            Mensaje[1] = "La actividad se libero correctamente.";
                            Mensaje[2] = estatusasigna;
                            LogMsj = "Liberó la actividad";
                        }
                        else if (estatusasigna == "X")
                        {
                            //actividadval.Estatus = "X";
                            //actividadval.MotivoRechazoId = Validacion.MotivoRechazoId;
                            //actividadval.DescripcionRechazo = Validacion.DescripcionRechazo;


                            //JMM Se agrega a los comentarios
                            ActividadComentario c = new ActividadComentario();
                            c.IdActividad = actividad.IdActividad;
                            c.Comentario = "MOTIVOS DE RECHAZO: " + Validacion.DescripcionRechazo;
                            c.IdUsuario = IdUsuario;
                            c.Fecha = DateTime.Now;
                            contexto.ActividadComentario.Add(c);


                            Mensaje[0] = "1";
                            Mensaje[1] = "La actividad se rechazo correctamente.";
                            Mensaje[2] = estatusasigna;
                            LogMsj = "Rechazo la actividad";

                        }

                        foreach(var v in contexto.ActividadValidaciones.Where(w=> w.IdActividad == Validacion.IdActividad))
                        {


                            
                            v.Estatus = estatusasigna;
                            v.MotivoRechazoId = Validacion.MotivoRechazoId;
                            v.DescripcionRechazo = Validacion.DescripcionRechazo;
                            v.IdUAtendio = IdUsuario;
                            v.FechaAtendio = DateTime.Now;


                        }




                    }


                    contexto.SaveChanges();


                    ActividadLog actlog = new ActividadLog();
                    actlog.IdActividad = Validacion.IdActividad;
                    actlog.Descripcion = LogMsj;
                    actlog.IdUCreo = IdUsuario;
                    actlog.FechaHora = DateTime.Now;

                    GuardaActividadLog(actlog, Conexion);

                }

                return Mensaje;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public ActividadesModel ConsultaRechazo(long IdActividad, string Conexion)
        {

            try
            {
                ActividadesModel act = new ActividadesModel();
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    var rechazo = contexto.ActividadValidaciones.Where(i => i.IdActividad == IdActividad && i.Estatus == "X").FirstOrDefault();
                    var idUsuarioAsignado = contexto.Actividad.Where(i => i.IdActividad == IdActividad).Select(s => s.IdUsuarioAsignado).FirstOrDefault();

                    act.DescripcionRechazo = rechazo.DescripcionRechazo;
                    act.MotivoRechazoStr = contexto.CatalogoGeneral.Where(i => i.IdCatalogo == rechazo.MotivoRechazoId).Select(s => s.DescLarga).FirstOrDefault();
                    act.UsuarioRechazoStr = contexto.Usuario.Where(i => i.IdUsuario == rechazo.IdUAtendio).Select(s => s.Nombre + " " + s.ApPaterno + " " + s.ApMaterno).FirstOrDefault();
                    act.FechaRechazo = rechazo.FechaAtendio;
                    act.CorreoResponsable = contexto.Usuario.Where(i => i.IdUsuario == idUsuarioAsignado).Select(s => s.Correo).FirstOrDefault();

                }


                return act;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public bool ValidacionMasiva(string Actividades, long IdUsuario, string Conexion)
        {
            SqlConnection sqlcon = new SqlConnection(Conexion);
            try
            {
                //var actividades = string.Join<string>(",", LstActividades.ConvertAll(s => s.ToString()));


                sqlcon.Open();
                SqlCommand sqlcmd = new SqlCommand("spValidacionMasiva", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@Actividades", Actividades);
                sqlcmd.Parameters.AddWithValue("@IdUsuario", IdUsuario);


                sqlcmd.ExecuteNonQuery();
                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();
                sqlcon.Close();

                return true;

            }
            catch (Exception ex)
            {
                sqlcon.Close();
                throw ex;
            }


        }

        public bool AsignacionSprintMasiva(string Actividades, long IdIteracion, long IdUsuario, string Conexion)
        {
            SqlConnection sqlcon = new SqlConnection(Conexion);
            try
            {
                //var actividades = string.Join<string>(",", LstActividades.ConvertAll(s => s.ToString()));


                sqlcon.Open();
                SqlCommand sqlcmd = new SqlCommand("spAsignacionMasivaSprint", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@Actividades", Actividades);
                sqlcmd.Parameters.AddWithValue("@IdIteracion", IdIteracion);
                sqlcmd.Parameters.AddWithValue("@IdUsuario", IdUsuario);


                sqlcmd.ExecuteNonQuery();
                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();
                sqlcon.Close();

                return true;

            }
            catch (Exception ex)
            {
                sqlcon.Close();
                throw ex;
            }


        }

        public bool LiberacionMasiva(string Actividades, long IdUsuario, string Conexion)
        {
            SqlConnection sqlcon = new SqlConnection(Conexion);
            try
            {

                sqlcon.Open();
                SqlCommand sqlcmd = new SqlCommand("spLiberacionMasiva", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@Actividades", Actividades);
                sqlcmd.Parameters.AddWithValue("@IdUsuario", IdUsuario);


                sqlcmd.ExecuteNonQuery();
                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();
                sqlcon.Close();

                return true;

            }
            catch (Exception ex)
            {
                sqlcon.Close();
                throw ex;
            }


        }
        public bool CancelacionMasiva(string Actividades, long IdUsuario, string Conexion)
        {
            SqlConnection sqlcon = new SqlConnection(Conexion);
            try
            {

                sqlcon.Open();
                SqlCommand sqlcmd = new SqlCommand("spCancelacionMasiva", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@Actividades", Actividades);
                sqlcmd.Parameters.AddWithValue("@IdUsuario", IdUsuario);


                sqlcmd.ExecuteNonQuery();
                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();
                sqlcon.Close();

                return true;

            }
            catch (Exception ex)
            {
                sqlcon.Close();
                throw ex;
            }


        }

        public bool ActualizaFechaFinActividad(long IdActividad, DateTime FechaFin, long IdUsuario, string Conexion)
        {

            try
            {

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;

                    var Act = contexto.Actividad.Where(w => w.IdActividad == IdActividad).FirstOrDefault();

                    Act.FechaTermino = FechaFin;
                    //Act.IdUMod = IdUsuario;

                    contexto.SaveChanges();

                }

                return true;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public bool ActualizaEstatusCliente(ActividadesModel Actividad, string Conexion)
        {

            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    var act = contexto.Actividad.Where(w => w.IdActividad == Actividad.IdActividad).FirstOrDefault();

                    if (Actividad.EstatusCte == "E")
                    {
                        act.EstatusCte = "E";
                        act.FechaEntrega = DateTime.Now;

                    }
                    else if (Actividad.EstatusCte == "L")
                    {
                        act.EstatusCte = "L";
                        act.FechaLiberacion = DateTime.Now;
                    }
                    else if (Actividad.EstatusCte == "XE") //Si cancela la entrega
                    {
                        act.EstatusCte = "P";
                        act.FechaEntrega = null;
                        act.FechaLiberacion = null;
                    }
                    else if (Actividad.EstatusCte == "XL") //Si cancela la liberacion
                    {
                        act.EstatusCte = "E";

                        act.FechaLiberacion = null;
                    }

                    contexto.SaveChanges();

                }

                return true;

            }
            catch (Exception)
            {

                throw;
            }

        }

        public List<ActividadTrackingModel> ConsultaTrackingActividad(long IdActivdad, string Conexion)
        {

            try
            {
                List<ActividadTrackingModel> LstTrack = new List<ActividadTrackingModel>();

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spObtieneFasesActividad", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdActividad", IdActivdad);

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
                da.Fill(ds);
                da.Dispose();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();

                LstTrack = (from row in ds.Tables[0].AsEnumerable()
                            select (
                            new ActividadTrackingModel()
                            {
                                IdFase = long.Parse(row["IdFase"].ToString()),
                                IdActividadTracking = long.Parse(row["IdActividadTracking"].ToString()),
                                Nombre = row["Nombre"].ToString(),
                                TiempoAsignadoMin = Math.Round(decimal.Parse(row["TiempoAsignadoMin"].ToString()), 2).ToString(),
                                TiempoAsignadoHrs = decimal.Parse(row["TiempoAsignadoHrs"].ToString()),
                                Trabajado = TimeSpan.Parse(row["Trabajado"].ToString()),
                                Finalizado = bool.Parse(row["Finalizado"].ToString())
                            })).ToList();


                return LstTrack;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public int FinalizaFaseActividad(long IdActividadTracking, string Conexion)
        {
            try
            {
                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spFinalizaFaseActividad", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdActividadTracking", IdActividadTracking);

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
                da.Fill(ds);
                da.Dispose();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();


                return int.Parse(ds.Tables[0].Rows[0][0].ToString());
            }
            catch (Exception ex)
            {

                throw ex;
            }


        }

        public int ActualizaTiempoTrabajo(ActividadTrackingModel Tracking, string Conexion)
        {

            try
            {
                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spActualizaTiempoTrabajado", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdActividadTracking", Tracking.IdActividadTracking);
                sqlcmd.Parameters.AddWithValue("@IdActividad", Tracking.IdActividad);
                sqlcmd.Parameters.AddWithValue("@Trabajado", Tracking.Trabajado);
                sqlcmd.Parameters.AddWithValue("@IdUsuario", Tracking.IdUsuario);

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
                da.Fill(ds);
                da.Dispose();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();


                return int.Parse(ds.Tables[0].Rows[0][0].ToString());

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public int RegistrarTrabajo(ActividadTrabajoModel Trabajo, string Conexion)
        {
            try
            {

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;

                    var Act = contexto.Actividad.Where(w => w.IdActividad == Trabajo.IdActividad).FirstOrDefault();

                    //if (Act.Estatus != "P")
                    //{
                    //    return 2;
                    //}

                    ActividadTrabajo tra = new ActividadTrabajo();

                    tra.IdActividad = Trabajo.IdActividad;
                    tra.Tiempo = Trabajo.Tiempo;
                    tra.IdUsuarioRegistro = Trabajo.IdUsuarioRegistro;
                    tra.Fecha = Trabajo.Fecha;
                    tra.FechaRegistro = DateTime.Now;
                    tra.Comentario = Trabajo.Comentario;

                    contexto.ActividadTrabajo.Add(tra);

                    Act.FechaMod = DateTime.Now;
                    Act.HorasFinales += tra.Tiempo;

                    contexto.SaveChanges();

                }

                ActividadLog actlog = new ActividadLog();
                actlog.IdActividad = Trabajo.IdActividad;
                actlog.Descripcion = "Registró tiempo de trabajo > Comentario: " + Trabajo.Comentario;
                actlog.IdUCreo = Trabajo.IdUsuarioRegistro;
                actlog.FechaHora = DateTime.Now;

                GuardaActividadLog(actlog, Conexion);

                return 1;

            }
            catch (Exception ex)
            {

                throw ex;
            }


        }
        public bool RegistrarMultiplesTrabajos(List<ActividadTrabajoModel> LstTrabajos, string Conexion)
        {
            try
            {

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;

                    foreach (var Trabajo in LstTrabajos)
                    {
                        var Act = contexto.Actividad.Where(w => w.IdActividad == Trabajo.IdActividad).FirstOrDefault();
                        ActividadTrabajo tra = new ActividadTrabajo();

                        tra.IdActividad = Trabajo.IdActividad;
                        tra.Tiempo = Trabajo.Tiempo;
                        tra.IdUsuarioRegistro = Trabajo.IdUsuarioRegistro;
                        tra.Fecha = Trabajo.Fecha;
                        tra.FechaRegistro = DateTime.Now;

                        contexto.ActividadTrabajo.Add(tra);

                        Act.HorasFinales += tra.Tiempo;

                        contexto.SaveChanges();
                    }

                }

                return true;

            }
            catch (Exception ex)
            {

                throw ex;
            }


        }
        public int EliminarTrabajo(long IdActividadTrabajo, string Conexion)
        {
            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;

                    var t = contexto.ActividadTrabajo.Where(w => w.IdActividadTrabajo == IdActividadTrabajo).FirstOrDefault();
                    var Act = contexto.Actividad.Where(w => w.IdActividad == t.IdActividad).FirstOrDefault();
                    if (Act.Estatus != "A" && Act.Estatus != "P")
                    {
                        return 2;
                    }


                    contexto.ActividadTrabajo.Remove(t);

                    Act.HorasFinales -= t.Tiempo;

                    contexto.SaveChanges();
                }



                return 1;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public List<ActividadTrabajoModel> ConsultarTrabajos(long IdActividad, string Conexion)
        {
            try
            {

                List<ActividadTrabajoModel> LstTrabajos = new List<ActividadTrabajoModel>();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;

                    LstTrabajos = contexto.ActividadTrabajo.Where(w => w.IdActividad == IdActividad)
                           .Select(s => new ActividadTrabajoModel
                           {

                               IdActividadTrabajo = s.IdActividadTrabajo,
                               Fecha = s.Fecha,
                               Tiempo = s.Tiempo,
                               Comentario= s.Comentario
                           }
                        ).ToList();

                    contexto.SaveChanges();
                }

                return LstTrabajos;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public List<ActividadTamanoModel> ConsultarTamanosActividad(long IdActividad, string Conexion)
        {
            try
            {

                List<ActividadTamanoModel> LstTamano = new List<ActividadTamanoModel>();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    LstTamano = contexto.ActividadTamano.Where(w => w.IdActividad == IdActividad)
                                .Select(s => new ActividadTamanoModel()
                                {
                                    IdActividadTamano = s.IdActividadTamano,
                                    Descripcion = s.Descripcion,
                                    EBase = s.EBase,
                                    EModificadas = s.EModificadas,
                                    EAgregadas = s.EAgregadas,
                                    EEliminadas = s.EEliminadas,
                                    ABase = s.ABase,
                                    AModificadas = s.AModificadas,
                                    AAgregadas = s.AAgregadas,
                                    AEliminadas = s.AEliminadas,
                                    TipoParteId = s.TipoParteId,
                                    TipoParteIdStr = s.CatalogoGeneral.DescCorta
                                }).ToList();


                }


                return LstTamano;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public int GuardaTamanoActividad(ActividadTamanoModel actividadtamano, string Conexion)
        {
            try
            {

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    if (actividadtamano.IdActividadTamano == 0) //NUEVO
                    {
                        ActividadTamano at = new ActividadTamano();

                        at.IdActividad = actividadtamano.IdActividad;
                        at.Descripcion = actividadtamano.Descripcion;
                        at.TipoParteId = actividadtamano.TipoParteId;
                        at.EBase = actividadtamano.EBase;
                        at.EModificadas = actividadtamano.AModificadas;
                        at.EAgregadas = actividadtamano.EAgregadas;
                        at.EEliminadas = actividadtamano.EEliminadas;
                        at.ABase = actividadtamano.ABase;
                        at.AModificadas = actividadtamano.AModificadas;
                        at.AAgregadas = actividadtamano.AAgregadas;
                        at.AEliminadas = actividadtamano.AEliminadas;
                        at.IdUMod = actividadtamano.IdUMod;
                        at.FechaMod = DateTime.Now;


                        contexto.ActividadTamano.Add(at);

                    }
                    else                                       //Modificar
                    {
                        var at = contexto.ActividadTamano.Where(w => w.IdActividadTamano == actividadtamano.IdActividadTamano).FirstOrDefault();

                        at.IdActividad = actividadtamano.IdActividad;
                        at.Descripcion = actividadtamano.Descripcion;
                        at.TipoParteId = actividadtamano.TipoParteId;
                        at.EBase = actividadtamano.EBase;
                        at.EModificadas = actividadtamano.AModificadas;
                        at.EAgregadas = actividadtamano.EAgregadas;
                        at.EEliminadas = actividadtamano.EEliminadas;
                        at.ABase = actividadtamano.ABase;
                        at.AModificadas = actividadtamano.AModificadas;
                        at.AAgregadas = actividadtamano.AAgregadas;
                        at.AEliminadas = actividadtamano.AEliminadas;
                        at.IdUMod = actividadtamano.IdUMod;
                        at.FechaMod = DateTime.Now;


                    }

                    contexto.SaveChanges();

                }


                return 1;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public int EliminaTamanoActividad(long IdActividadTamano, string Conexion)
        {
            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    var at = contexto.ActividadTamano.Where(w => w.IdActividadTamano == IdActividadTamano).FirstOrDefault();

                    contexto.ActividadTamano.Remove(at);

                    contexto.SaveChanges();
                }

                return 1;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public List<ActividadComentarioModel> GuardaComentario(ActividadComentarioModel comentario, string Conexion)
        {
            try
            {

                List<ActividadComentarioModel> LstComentario = new List<ActividadComentarioModel>();
                ActividadComentario c = new ActividadComentario();
                c.IdActividad = comentario.IdActividad;
                c.Comentario = comentario.Comentario;
                c.IdUsuario = comentario.IdUsuario;
                c.Fecha = DateTime.Now;

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.ActividadComentario.Add(c);
                    contexto.SaveChanges();

                    LstComentario = contexto.ActividadComentario
                                   .Where(w => w.IdActividad == comentario.IdActividad)
                                   .Select(s => new ActividadComentarioModel()
                                   {
                                       Comentario = s.Comentario,
                                       Fecha = s.Fecha,
                                       CveUsuario = s.Usuario.NumEmpleado,
                                       IdUsuarioStr = s.Usuario.Nombre + " " + s.Usuario.ApPaterno,

                                   }).ToList();

                }

                return LstComentario;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public bool GuardaComentarioSinLista(ActividadComentarioModel comentario, string Conexion)
        {
            try
            {

                ActividadComentario c = new ActividadComentario();
                c.IdActividad = comentario.IdActividad;
                c.Comentario = comentario.Comentario;
                c.IdUsuario = comentario.IdUsuario;
                c.Fecha = DateTime.Now;

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.ActividadComentario.Add(c);
                    contexto.SaveChanges();

            
                }

                return true;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public int ConsultaActividadesInicio(ref List<ActividadesModel> LstActividades, ref List<ActividadesModel> LstBugs, ref List<ActividadComentarioModel> LstComentarios,   UsuarioModel user, long? IdUsuarioReporte, string Conexion)
        {

            try
            {

                //var con = new SqlConnection(Conexion);
                //con.Open();
                //List<ActividadesModel> LstActividades = new List<ActividadesModel>();

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spObtieneActividadesInicioV2", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdUsuario", user.IdUsuario);
                sqlcmd.Parameters.AddWithValue("@IdTipoUsuario", user.IdTipoUsuario);
                sqlcmd.Parameters.AddWithValue("@IdUsuarioReporte", IdUsuarioReporte);


                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
                da.Fill(ds);
                da.Dispose();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();


                var LstAct = ds.Tables[0];
                var LstB = ds.Tables[1];
                var LstC = ds.Tables[2];

                LstActividades = (from row in LstAct.AsEnumerable()
                                  select (
                                  new ActividadesModel
                                  {
                                      IdActividad = long.Parse(row["IdActividad"].ToString()),
                                      IdActividadStr = row["IdActividadStr"].ToString(),
                                      Estatus = row["Estatus"].ToString(),
                                      EstatusStr = row["EstatusStr"].ToString(),
                                      BR = row["Descripcion"].ToString(),
                                      FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
                                      FechaSolicitado = DateTime.Parse(row["FechaSolicitado"].ToString()),
                                      ClaveUsuario = row["NumEmpleado"].ToString(),
                                      Tipo = int.Parse(row["Atrasado"].ToString()),
                                      ClaveTipoActividad = row["TipoActividad"].ToString(),
                                      HorasAsignadas = decimal.Parse(row["HorasAsignadas"].ToString()),
                                      DependenciasA = int.Parse(row["Dependencias"].ToString()),
                                      DependenciasT = int.Parse(row["DependenciasT"].ToString()),
                                  })).ToList();

                LstBugs = (from row in LstB.AsEnumerable()
                                  select (
                                  new ActividadesModel
                                  {
                                      IdActividad = long.Parse(row["IdActividad"].ToString()),
                                      IdActividadStr = row["IdActividadStr"].ToString(),
                                      Estatus = row["Estatus"].ToString(),
                                      EstatusStr = row["EstatusStr"].ToString(),
                                      BR = row["Descripcion"].ToString(),
                                      FechaSolicitado = DateTime.Parse(row["FechaSolicitado"].ToString()),
                                      ClaveUsuario = row["NumEmpleado"].ToString(),
                                      Tipo = int.Parse(row["Atrasado"].ToString()),
                                      ClaveTipoActividad = row["TipoActividad"].ToString(),
                                      HorasAsignadas = decimal.Parse(row["HorasAsignadas"].ToString()),
                                      DependenciasA = int.Parse(row["Dependencias"].ToString()),
                                      DependenciasT = int.Parse(row["DependenciasT"].ToString()),
                                  })).ToList();

                LstComentarios = (from row in LstC.AsEnumerable()
                                  select (
                                  new ActividadComentarioModel
                                  {
                                      IdActividad = long.Parse(row["IdActividad"].ToString()),
                                      IdActividadStr = row["IdActividadStr"].ToString(),
                                      Comentario = row["Comentario"].ToString(),
                                      CveUsuario = row["NumEmpleado"].ToString(),
                                      IdUsuarioStr = row["NombreCompleto"].ToString(),
                                      Fecha = DateTime.Parse(row["Fecha"].ToString())

                                  })).ToList();


                return 1;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public List<ActividadesModel> ConsultaActividadesTerminadasDia(FiltrosModel Filtros,  string Conexion)
        {

            try
            {

                var con = new SqlConnection(Conexion);
                con.Open();
                List<ActividadesModel> LstActividades = new List<ActividadesModel>();

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spObtieneActividadesTerminadasDia", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdUsuario",Filtros.IdUsuarioReporte);
                sqlcmd.Parameters.AddWithValue("@IdMes", Filtros.Mes);
                sqlcmd.Parameters.AddWithValue("@IdAnio", Filtros.Anio);
                sqlcmd.Parameters.AddWithValue("@Dia", Filtros.Dia);

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
                da.Fill(ds);
                da.Dispose();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();


                var LstAct = ds.Tables[0];


                LstActividades = (from row in LstAct.AsEnumerable()
                                  select (
                                  new ActividadesModel
                                  {
                                      IdActividad = long.Parse(row["IdActividad"].ToString()),
                                      IdActividadStr = row["IdActividadStr"].ToString(),
                                      Estatus = row["Estatus"].ToString(),
                                      EstatusStr = row["EstatusStr"].ToString(),
                                      Descripcion = row["Descripcion"].ToString(),
                                      FechaTermino = row["FechaTermino"].ToString() == "" ? (DateTime?) null :  DateTime.Parse(row["FechaTermino"].ToString()),
                                      HorasAsignadas = decimal.Parse(row["HorasAsignadas"].ToString())
                                  })).OrderBy(o => o.IdActividad).ToList();

                return LstActividades;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public List<ActividadesModel> ConsultaTiemposCapturadosDia(FiltrosModel Filtros,   string Conexion)
        {

            try
            {

                var con = new SqlConnection(Conexion);
                con.Open();
                List<ActividadesModel> LstActividades = new List<ActividadesModel>();

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spObtieneTrabajoCapturadoDia", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdUsuario", Filtros.IdUsuarioReporte);
                sqlcmd.Parameters.AddWithValue("@IdMes", Filtros.Mes);
                sqlcmd.Parameters.AddWithValue("@IdAnio", Filtros.Anio);
                sqlcmd.Parameters.AddWithValue("@Dia", Filtros.Dia);

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
                da.Fill(ds);
                da.Dispose();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();


                var LstAct = ds.Tables[0];


                LstActividades = (from row in LstAct.AsEnumerable()
                                  select (
                                  new ActividadesModel
                                  {
                                      IdActividad = long.Parse(row["IdActividad"].ToString()),
                                      IdActividadStr = row["IdActividadStr"].ToString(),
                                      Estatus = row["Estatus"].ToString(),
                                      EstatusStr = row["EstatusStr"].ToString(),
                                      Descripcion = row["Descripcion"].ToString(),
                                      FechaCreo = DateTime.Parse(row["Fecha"].ToString()),
                                      FechaMod = DateTime.Parse(row["FechaRegistro"].ToString()),
                                      HorasAsignadas = decimal.Parse(row["Tiempo"].ToString()),
                                      ComentariosFinales  = row["Comentario"].ToString()
                                  })).OrderBy(o => o.IdActividad).ToList();

               

                return LstActividades;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public List<ActividadesModel> ConsultaTiemposTrabajadoDia(FiltrosModel Filtros, string Conexion)
        {

            try
            {

                var con = new SqlConnection(Conexion);
                con.Open();
                List<ActividadesModel> LstActividades = new List<ActividadesModel>();

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spObtieneTrabajoDia", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdUsuario", Filtros.IdUsuarioReporte);
                sqlcmd.Parameters.AddWithValue("@IdMes", Filtros.Mes);
                sqlcmd.Parameters.AddWithValue("@IdAnio", Filtros.Anio);
                sqlcmd.Parameters.AddWithValue("@Dia", Filtros.Dia);

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
                da.Fill(ds);
                da.Dispose();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();


                var LstAct = ds.Tables[0];


                LstActividades = (from row in LstAct.AsEnumerable()
                                  select (
                                  new ActividadesModel
                                  {
                                      IdActividad = long.Parse(row["IdActividad"].ToString()),
                                      IdActividadStr = row["IdActividadStr"].ToString(),
                                      Estatus = row["Estatus"].ToString(),
                                      EstatusStr = row["EstatusStr"].ToString(),
                                      Descripcion = row["Descripcion"].ToString(),
                                      FechaCreo = DateTime.Parse(row["Fecha"].ToString()),
                                      FechaMod = DateTime.Parse(row["FechaRegistro"].ToString()),
                                      HorasAsignadas = decimal.Parse(row["Tiempo"].ToString()),
                                      ComentariosFinales = row["Comentario"].ToString()
                                  })).OrderBy(o => o.IdActividad).ToList();

                return LstActividades;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public List<ActividadesModel> ConsultaActividadesDia(DateTime Fecha,long IdUsuario, string Conexion)
        {

            try
            {

                var con = new SqlConnection(Conexion);
                con.Open();
                List<ActividadesModel> LstActividades = new List<ActividadesModel>();

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spObtenerActividadesRecurso_Dia", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdUsuario", IdUsuario);
                sqlcmd.Parameters.AddWithValue("@Fecha", Fecha);
   

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
                da.Fill(ds);
                da.Dispose();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();


                var LstAct = ds.Tables[0];


                LstActividades = (from row in LstAct.AsEnumerable()
                                  select (
                                  new ActividadesModel
                                  {
                                      IdActividad = long.Parse(row["IdActividad"].ToString()),
                                      IdActividadStr = row["IdActividadStr"].ToString(),
                                      Estatus = row["Estatus"].ToString(),
                                      EstatusStr = row["EstatusStr"].ToString(),
                                      Descripcion = row["BR"].ToString(),
                                      ClasificacionId = long.Parse(row["ClasificacionId"].ToString()),
                                      HorasAsignadas = row["HorasAsignadas"].ToString() == "" ?  0 : decimal.Parse(row["HorasAsignadas"].ToString()),
                                      HorasFinales = row["HorasFinales"].ToString() == "" ? 0 : decimal.Parse(row["HorasFinales"].ToString()),
                                      IdActividadRef = long.Parse(row["IdCicloCaso"].ToString()),
                                  })).OrderBy(o => o.IdActividad).ToList();

                return LstActividades;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public int GuardaArchivo(ActividadArchivoModel archivo, string Conexion)
        {
            try
            {
                ActividadArchivo a = new ActividadArchivo();
                a.IdActividad = archivo.IdActividad;
                a.Nombre = archivo.Nombre;
                a.Extension = archivo.Extension;
                a.Url = archivo.Url;
                a.IdUCreo = archivo.IdUCreo;
                a.FechaCreo = DateTime.Now;

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    var existe = contexto.ActividadArchivo.Where(w => w.IdActividad == a.IdActividad && w.Nombre == a.Nombre).FirstOrDefault();

                    if (existe == null)
                    {
                        contexto.ActividadArchivo.Add(a);
                        contexto.SaveChanges();
                    }
                }

                ActividadLog actlog = new ActividadLog();
                actlog.IdActividad = archivo.IdActividad;
                actlog.Descripcion = "Agregó archivo " + archivo.Nombre;
                actlog.IdUCreo = archivo.IdUCreo;
                actlog.FechaHora = DateTime.Now;

                GuardaActividadLog(actlog, Conexion);


                return 1;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public int EliminaArchivo(ActividadArchivoModel archivo, string Conexion)
        {
            try
            {

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    var a = contexto.ActividadArchivo.Where(w => w.IdActividad == archivo.IdActividad && w.Nombre == archivo.Nombre).FirstOrDefault();
                    contexto.ActividadArchivo.Remove(a);
                    contexto.SaveChanges();
                }

                return 1;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public ActividadArchivo EliminaArchivoV2(long IdActividadArchivo, string Conexion)
        {
            try
            {

                ActividadArchivo ac = new ActividadArchivo();
                string FileName = string.Empty;
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    var a = contexto.ActividadArchivo.Where(w => w.IdActividadArchivo == IdActividadArchivo).FirstOrDefault();

                    ac.IdActividad = a.IdActividad;
                    ac.Nombre = a.Nombre;
                    contexto.ActividadArchivo.Remove(a);
                    contexto.SaveChanges();
                }

                return ac;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        //public bool InsertarActividadDependencia(ActividadesModel Act, ref List<ActividadesModel> LsRelacionadas, string Conexion)
        //{
        //    try
        //    {

        //        using (var contexto = new BDProductividad_DEVEntities(Conexion))
        //        {

        //            ActividadDependencia a = new ActividadDependencia();

        //            a.IdActividad = Act.IdActividad;
        //            a.IdActividadD = Act.IdActividadD;

        //            contexto.ActividadDependencia.Add(a);
        //            contexto.SaveChanges();

        //            LsRelacionadas = (from ac in contexto.Actividad
        //                              join ad in contexto.ActividadDependencia on ac.IdActividad equals ad.IdActividadD
        //                              where ad.IdActividad == Act.IdActividad
        //                              select new ActividadesModel
        //                              {
        //                                  IdActividadDependencia = ad.IdActividadDependencia,
        //                                  IdActividadStr = ac.Proyecto.Clave + "-" + a.IdActividad.ToString(),
        //                                  Descripcion = ac.Descripcion,
        //                                  Estatus = ac.Estatus,
        //                                  FechaSolicitado = ac.FechaSolicitado,
        //                                  ResponsableStr = ac.Usuario.NumEmpleado
        //                              }).ToList();

        //        }

        //        return true;
        //    }
        //    catch (Exception ex)
        //    {

        //        throw ex;
        //    }
        //}

        //public bool EliminarActividadDependencia(long IdActividadDependencia, ref List<ActividadesModel> LsRelacionadas, string Conexion)
        //{

        //    try
        //    {

        //        using (var contexto = new BDProductividad_DEVEntities(Conexion))
        //        {

        //            var a = contexto.ActividadDependencia.Where(w => w.IdActividadDependencia == IdActividadDependencia).FirstOrDefault();

        //            var esPeer = contexto.Actividad.FirstOrDefault(x => x.IdActividad == a.IdActividadD).IdActividadRef != null;

        //            if (esPeer)
        //                return false;

        //            contexto.ActividadDependencia.Remove(a);
        //            contexto.SaveChanges();

        //            LsRelacionadas = (from ac in contexto.Actividad
        //                              join ad in contexto.ActividadDependencia on ac.IdActividad equals ad.IdActividadD
        //                              where ad.IdActividad == a.IdActividad
        //                              select new ActividadesModel
        //                              {
        //                                  IdActividadDependencia = ad.IdActividadDependencia,
        //                                  IdActividadStr = ac.Proyecto.Clave + "-" + a.IdActividadD.ToString(),
        //                                  Descripcion = ac.Descripcion,
        //                                  Estatus = ac.Estatus,
        //                                  FechaSolicitado = ac.FechaSolicitado,
        //                                  ResponsableStr =    ac.Usuario.NumEmpleado
        //                              }).ToList();

        //        }

        //        return true;
        //    }
        //    catch (Exception ex)
        //    {

        //        throw ex;
        //    }
        //}

        public bool InsertarActividadIssue(ActividadIssueModel Act, ref List<ProyectoIssueModel> LsRelacionadas, string Conexion)
        {
            try
            {

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    ActividadIssue a = new ActividadIssue();

                    a.IdActividad = Act.IdActividad;
                    a.IdIssue = Act.IdIssue;

                    contexto.ActividadIssue.Add(a);
                    contexto.SaveChanges();

                    LsRelacionadas = (from ad in contexto.ActividadIssue
                                      join ac in contexto.Actividad on ad.IdActividad equals ac.IdActividad
                                      join pi in contexto.ProyectoIssue on ad.IdIssue equals pi.IdIssue
                                      where ad.IdActividad == Act.IdActividad
                                      select new ProyectoIssueModel
                                      {
                                          IdIssue = pi.IdIssue,
                                          IdIssueProyecto = pi.IdIssueProyecto,
                                          Proyecto = new ProyectosModel
                                          {
                                              Nombre = pi.Proyecto.Nombre,
                                              Clave = pi.Proyecto.Clave
                                          },
                                          IdActividadIssue = ad.IdActividadIssue,
                                          Descripcion = pi.Descripcion,
                                          FechaDeteccion = pi.FechaDeteccion,

                                          EstatusIssue = contexto.CatalogoGeneral.Where(w => w.IdCatalogo == pi.CatalogoEstatusId).Select(sc => sc.DescLarga).FirstOrDefault(),
                                          EstatusIssueColor = contexto.CatalogoGeneral.Where(w => w.IdCatalogo == pi.CatalogoEstatusId).Select(sc => sc.DatoEspecial).FirstOrDefault(),
                                      }).ToList();

                }

                return true;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public List<ProyectoIssueModel> ConsultaActividadIssues(long IdActividad, string Conexion)
        {
            try
            {
                List<ProyectoIssueModel> LsRelacionadas = new List<ProyectoIssueModel>();
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {


                    //var lst = contexto.ActividadDefecto.ToList();

                    LsRelacionadas = contexto.ActividadIssue.Where(w => w.IdActividad == IdActividad).Select(s => new ProyectoIssueModel
                    {

                        IdIssue = s.IdIssue,
                        IdIssueProyecto = s.ProyectoIssue.IdIssueProyecto,
                        Proyecto = new ProyectosModel
                        {
                            Nombre = s.ProyectoIssue.Proyecto.Nombre,
                            Clave = s.ProyectoIssue.Proyecto.Clave
                        },
                        Descripcion = s.ProyectoIssue.Descripcion,
                        IdActividadIssue = s.IdActividadIssue
                    }).ToList();


                    //LsRelacionadas = (from ad in contexto.ActividadIssue
                    //                  join ac in contexto.Actividad on ad.IdActividad equals ac.IdActividad
                    //                  join pi in contexto.ProyectoIssue on ad.IdIssue equals pi.IdIssue
                    //                  where ad.IdActividad == IdActividad
                    //                  select new ProyectoIssueModel
                    //                  {
                    //                      IdIssue = pi.IdIssue,
                    //                      IdIssueProyecto = pi.IdIssueProyecto,
                    //                      Proyecto = new ProyectosModel
                    //                      {
                    //                          Nombre = pi.Proyecto.Nombre,
                    //                          Clave = pi.Proyecto.Clave
                    //                      },
                    //                      IdActividadIssue = ad.IdActividadIssue,
                    //                      Descripcion = pi.Descripcion,
                    //                      FechaDeteccion = pi.FechaDeteccion,

                    //                      EstatusIssue = contexto.CatalogoGeneral.Where(w => w.IdCatalogo == pi.CatalogoEstatusId).Select(sc => sc.DescLarga).FirstOrDefault(),
                    //                      EstatusIssueColor = contexto.CatalogoGeneral.Where(w => w.IdCatalogo == pi.CatalogoEstatusId).Select(sc => sc.DatoEspecial).FirstOrDefault(),
                    //                  }).ToList();


                }

                return LsRelacionadas;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public bool EliminarActividadIssue(long IdActividadIssue, ref List<ProyectoIssueModel> LsRelacionadas, string Conexion)
        {

            try
            {

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    long IdActividad = contexto.ActividadIssue.Where(w => w.IdActividadIssue == IdActividadIssue).Select(s=> s.IdActividad).FirstOrDefault();

                    var a = contexto.ActividadIssue.Where(w => w.IdActividadIssue == IdActividadIssue).FirstOrDefault();


                    contexto.ActividadIssue.Remove(a);
                    contexto.SaveChanges();

                    LsRelacionadas = (from ad in contexto.ActividadIssue
                                      join ac in contexto.Actividad on ad.IdActividad equals ac.IdActividad
                                      join pi in contexto.ProyectoIssue on ad.IdIssue equals pi.IdIssue
                                      where ad.IdActividad == IdActividad
                                      select new ProyectoIssueModel
                                      {
                                          IdIssue = pi.IdIssue,
                                          IdIssueProyecto = pi.IdIssueProyecto,
                                          Proyecto = new ProyectosModel
                                          {
                                              Nombre = pi.Proyecto.Nombre,
                                              Clave = pi.Proyecto.Clave
                                          },
                                          IdActividadIssue = ad.IdActividadIssue,
                                          Descripcion = pi.Descripcion,
                                          FechaDeteccion = pi.FechaDeteccion,

                                          EstatusIssue = contexto.CatalogoGeneral.Where(w => w.IdCatalogo == pi.CatalogoEstatusId).Select(sc => sc.DescLarga).FirstOrDefault(),
                                          EstatusIssueColor = contexto.CatalogoGeneral.Where(w => w.IdCatalogo == pi.CatalogoEstatusId).Select(sc => sc.DatoEspecial).FirstOrDefault(),
                                      }).ToList();

                }

                return true;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }


        public List<ActividadesModel> ConsultaMilestones(List<long> LstProyectos, string Conexion) {
            try
            {

                List<ActividadesModel> Lst = new List<ActividadesModel>();

                using ( var contexto = new BDProductividad_DEVEntities(Conexion)) {

                    Lst = contexto.Actividad.Where(w => w.TipoId == 13 && LstProyectos.Contains(w.IdProyecto) && w.Estatus != "C").
                            Select(s => new ActividadesModel {
                                 IdActividad = s.IdActividad,
                                 IdProyecto=s.IdProyecto,
                                 BR = s.BR,
                                 Estatus = s.Estatus,
                                 FechaInicio = s.FechaInicio,
                                 FechaSolicitado = s.FechaSolicitado
                            
                            }).ToList();

                }

                return Lst;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        
        }

        //public List<CatalogoGeneralModel> ListaActividades(long IdProyecto, long IdActividad, string Conexion)
        //{
        //    try
        //    {

        //        List<CatalogoGeneralModel> Lst = new List<CatalogoGeneralModel>();
        //        using (var contexto = new BDProductividad_DEVEntities(Conexion))
        //        {

        //            List<long> LstActRel = contexto.ActividadDependencia.Where(w => w.IdActividad == IdActividad).Select(s => s.IdActividadD).ToList();
        //            LstActRel.Add(IdActividad);

        //            Lst = (from a in contexto.Actividad
        //                   where a.IdProyecto == IdProyecto && a.Estatus != "C" && !LstActRel.Contains(a.IdActividad)
        //                   select new CatalogoGeneralModel
        //                   {
        //                       IdCatalogo = a.IdActividad,
        //                       DescCorta = a.CatalogoGeneral.DescLarga,
        //                       DescLarga = a.IdActividad.ToString() + " " + a.Descripcion
        //                   }
        //                  ).ToList();

        //        }

        //        return Lst;
        //    }
        //    catch (Exception ex)
        //    {

        //        throw ex;
        //    }
        //}

        #region ActividadDefecto

        public int GuardarActividadDefecto(ActividadDefectoModel defecto, string Conexion)
        {

            try
            {
                ActividadDefecto ad = new ActividadDefecto();
                ad.IdActividad = defecto.IdActividad;
                ad.TipoDefectoId = defecto.TipoDefectoId;
                ad.IdFaseInyeccion = defecto.IdFaseInyeccion;
                ad.IdFaseRemocion = defecto.IdFaseRemocion;
                ad.FechaDefecto = defecto.FechaDefecto;
                ad.Tiempo = defecto.Tiempo;
                ad.Descripcion = defecto.Descripcion;
                ad.FechaCreo = DateTime.Now;
                ad.IdUCreo = defecto.IdUCreo;

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    contexto.ActividadDefecto.Add(ad);
                    contexto.SaveChanges();

                }

                return 1;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public List<CatalogoGeneralModel> ConsultaFasesActividad(long IdActividad, string Conexion)
        {

            try
            {
                List<CatalogoGeneralModel> LstFases = new List<CatalogoGeneralModel>();
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    contexto.Configuration.LazyLoadingEnabled = false;

                    long TipoActividadId = contexto.Actividad.Where(w => w.IdActividad == IdActividad).FirstOrDefault().TipoActividadId;

                    LstFases = contexto.TipoActividadFase.Where(w => w.TipoActividadId == TipoActividadId)
                                .Select(s => new CatalogoGeneralModel
                                {
                                    IdCatalogo = s.IdFase,
                                    DescLarga = s.Orden.ToString() + "-" + s.Nombre,
                                    IdCatalogoN = s.Orden

                                }).OrderBy(o => o.IdCatalogoN).ToList();

                }


                return LstFases;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }


        #endregion

        #region Bugs
        public List<ActividadesModel>  LeerBugs(FiltrosModel filtros, UsuarioModel usuario, string conexionSP)
        {
            DataSet dataSet = new DataSet();

            SqlConnection sqlcon = new SqlConnection(conexionSP);
            SqlCommand sqlcmd;
            if (usuario.IdTipoUsuario == 17 || usuario.IdTipoUsuario == 15)
            {
                sqlcmd = new SqlCommand("PanelActividadesV2_sp", sqlcon)
                {
                    CommandType = CommandType.StoredProcedure
                };
            }
            else
            {
                sqlcmd = new SqlCommand("PanelBugs_sp", sqlcon)
                {
                    CommandType = CommandType.StoredProcedure
                };
            }
            sqlcmd.Parameters.AddWithValue("@FechaCreoIni", filtros.FechaCreoIni);
            sqlcmd.Parameters.AddWithValue("@FechaCreoFin", filtros.FechaCreoFin);
            sqlcmd.Parameters.AddWithValue("@FechaSolIni", filtros.FechaSolIni);
            sqlcmd.Parameters.AddWithValue("@FechaSolFin", filtros.FechaSolFin);
            sqlcmd.Parameters.AddWithValue("@FechaCierreIni", filtros.FechaCierreIni);
            sqlcmd.Parameters.AddWithValue("@FechaCierreFin", filtros.FechaCierreFin);
            sqlcmd.Parameters.AddWithValue("@TipoActividad", FasePSP.Bug.ToString());
            sqlcmd.Parameters.AddWithValue("@Clasificacion", filtros.Clasificacion);
            sqlcmd.Parameters.AddWithValue("@UsuarioAsignado", filtros.Asignado);
            sqlcmd.Parameters.AddWithValue("@UsuarioResponsable", filtros.Responsable);
            sqlcmd.Parameters.AddWithValue("@Proyecto", filtros.Proyecto);
            sqlcmd.Parameters.AddWithValue("@Estatus", filtros.Estatus);
            sqlcmd.Parameters.AddWithValue("@Prioridad", filtros.Prioridad);
            sqlcmd.Parameters.AddWithValue("@Actividad", filtros.Actividades ?? "");
            sqlcmd.Parameters.AddWithValue("@IdUsuario", filtros.IdUsuario);
            sqlcmd.Parameters.AddWithValue("@Sprint", filtros.Sprints);

            SqlDataAdapter adapter = new SqlDataAdapter(sqlcmd);
            adapter.Fill(dataSet);
            adapter.Dispose();

            sqlcmd.Connection.Close();
            sqlcmd.Connection.Dispose();
            sqlcmd.Dispose();

            var dtActividades = dataSet.Tables[0];

            var actividades =
                (from row in dtActividades.AsEnumerable()
                 select (
                 new ActividadesModel
                 {
                     IdActividad = long.Parse(row["IdActividad"].ToString()),
                     IdActividadStr = row["ClaveProyecto"].ToString() + "-" + row["IdActividad"].ToString(),
                     IdProyecto = long.Parse(row["IdProyecto"].ToString()),
                     Estatus = row["Estatus"].ToString(),
                     EstatusStr = row["EstatusStr"].ToString(),
                     Descripcion = row["Descripcion"].ToString(),
                     TipoActividadStr = row["TipoActividad"].ToString(),
                     ClasificacionStr = row["Clasificacion"].ToString(),
                     PrioridadStr = row["PrioridadStr"].ToString(),
                     AsignadoStr = row["Asignado"].ToString(),
                     AsignadoPath = "/Archivos/Fotos/" + row["ClaveUsuario"].ToString() + ".jpg",
                     ResponsableStr = row["Responsable"].ToString(),
                     ProyectoStr = row["Proyecto"].ToString(),
                     FechaCreo = DateTime.Parse(row["FechaCreo"].ToString()),
                     FechaSolicitado = DateTime.Parse(row["FechaSolicitado"].ToString()),
                     HorasFacturables = row["HorasFacturables"].ToString() == "" ? (decimal?)null : Convert.ToDecimal(row["HorasFacturables"].ToString()),
                     HorasAsignadas = row["HorasAsignadas"].ToString() == "" ? (decimal?)null : Convert.ToDecimal(row["HorasAsignadas"].ToString()),
                     HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),
                     FechaTermino = row["FechaTermino"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaTermino"].ToString()),
                     MotivoRechazoId = row["MotivoRechazoId"].ToString() == "" ? (long?)null : long.Parse(row["MotivoRechazoId"].ToString()),
                     DescripcionRechazo = row["DescripcionRechazo"].ToString(),
                     ClaveTipoActividad = row["ClaveTipoActividad"].ToString(),
                     ClaveUsuario = row["ClaveUsuario"].ToString(),
                     Sprint = row["Sprint"].ToString(),
                     FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
                     EstatusCte = row["EstatusCte"].ToString(),
                     EstatusCteStr = row["EstatusCteStr"].ToString(),
                     ClaveClasificacionActividad = row["ClaveClasificacionActividad"].ToString(),
                     ComentariosTotal = int.Parse(row["Comentarios"].ToString()),
                     ArchivosTotal = int.Parse(row["Archivos"].ToString()),
                     PSP = int.Parse(row["PSP"].ToString()),
                     TipoActividadId = long.Parse(row["TipoActividadId"].ToString()),
                     BR = row["BR"].ToString(),
                     DependenciasA = int.Parse(row["Dependencias"].ToString()),
                     DependenciasT = int.Parse(row["DependenciasT"].ToString()),
                     IdActividadRef = int.Parse(row["IdActividadRef"].ToString()),
                     IdActividadRefStr = row["ClaveProyecto"].ToString() + "-"  +row["IdActividadRef"].ToString(),
                 })).OrderBy(o => o.IdActividad).ToList();


            //var dtresumen = dataSet.Tables[1];

            //var resumen =
            //    (from row in dtresumen.AsEnumerable()
            //     select (
            //     new ActividadesModel
            //     {
            //         TipoActividadId = long.Parse(row["TipoActividadId"].ToString()),
            //         ClaveTipoActividad = row["ClaveTipoActividad"].ToString(),
            //         TipoActividadStr = row["TipoActividad"].ToString(),
            //         HorasFacturables = decimal.Parse(row["HorasFacturables"].ToString() == "" ? "0.00" : row["HorasFacturables"].ToString()),
            //         HorasAsignadas = decimal.Parse(row["HorasAsignadas"].ToString() == "" ? "0.00" : row["HorasAsignadas"].ToString()),
            //         HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),
            //         FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
            //         FechaFin = DateTime.Parse(row["FechaFin"].ToString())
            //     })).OrderBy(o => o.IdActividad).ToList();

            return actividades;
        }

        public (bool Estatus, string Mensaje) ImportarBugs(List<ActividadesModel> _bugs, char tipo, string conexionEF, string conexionSP)
        {
            if (tipo == 'c')
            {
                using (var contexto = new BDProductividad_DEVEntities(conexionEF))
                {
                    var bugs = _bugs.Select(x => new Actividad
                    {
                        Estatus = x.Estatus,
                        Prioridad = x.Prioridad,
                        FechaCreo = x.FechaCreo,
                        IdUCreo = x.IdUCreo,
                        BR =  contexto.Actividad.Where(w=> w.IdActividad == x.IdActividadRef).Select(s=> s.BR).FirstOrDefault(),
                        TipoActividadId = x.TipoActividadId,
                        Descripcion = x.Descripcion,
                        HorasAsignadas = x.HorasAsignadas,
                        HorasFacturables = x.HorasFacturables,
                        FechaInicio = x.FechaInicio,
                        FechaSolicitado = x.FechaSolicitado,
                        ClasificacionId = x.ClasificacionId,
                        IdProyecto = x.IdProyecto,
                        IdActividadRef = x.IdActividadRef,
                        IdUsuarioAsignado = x.IdUsuarioAsignado,
                        IdUsuarioResponsable = x.IdUsuarioResponsable,
                    }).ToList();

                    contexto.Actividad.AddRange(bugs);
                    contexto.SaveChanges();

                    var dependencias = bugs.Select(x => new ActividadDependencia
                    {
                        IdActividad = Convert.ToInt64(x.IdActividadRef),
                        IdActividadD = x.IdActividad
                    }).ToList();

                    contexto.ActividadDependencia.AddRange(dependencias);
                    contexto.SaveChanges();
                }

                InsertarValidaciones(conexionSP);
            }
            else if (tipo == 'a')
            {
                using (var contexto = new BDProductividad_DEVEntities(conexionEF))
                {
                    foreach (var _bug in _bugs)
                    {
                        var bug = contexto.Actividad.Find(_bug.IdActividad);
                        if (bug == null)
                            return (false, "Falla en la iteracion");

                        bug.IdProyecto = _bug.IdProyecto;
                        bug.IdActividad = _bug.IdActividad;
                        bug.IdActividadRef = _bug.IdActividadRef;
                        bug.BR = _bug.BR;
                        bug.IdUsuarioAsignado = _bug.IdUsuarioAsignado;
                        bug.TipoActividadId = _bug.TipoActividadId;
                        bug.ClasificacionId = _bug.ClasificacionId;
                        bug.Descripcion = _bug.Descripcion;
                        bug.HorasFacturables = _bug.HorasFacturables;
                        bug.HorasAsignadas = _bug.HorasAsignadas;
                        bug.FechaInicio = _bug.FechaInicio;
                        bug.FechaSolicitado = _bug.FechaSolicitado;

                        contexto.SaveChanges();
                    }

                    var log = _bugs
                        .Select(s => new ActividadLog
                        {
                            IdActividad = s.IdActividad,
                            Descripcion = "Actualizó la actividad mediante la importación.",
                            IdUCreo = (long)_bugs.FirstOrDefault().IdUsuarioResponsable,
                            FechaHora = DateTime.Now
                        }).ToList();

                    contexto.ActividadLog.AddRange(log);
                    contexto.SaveChanges();
                }
            }

            return (true, Mensaje.MensajeGuardadoExito);
        }

        private void InsertarValidaciones(string conexionSP)
        {
            SqlConnection connection = new SqlConnection(conexionSP);
            connection.Open();
            SqlCommand command = new SqlCommand("InsertaValidacionesSP", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.ExecuteNonQuery();
            command.Connection.Close();
            command.Connection.Dispose();
            command.Dispose();
            connection.Close();
        }

        #endregion

       public List<ActividadTipoModel> ConsultaTiposActividad(string Conexion)
        {
            try
            {
                List<ActividadTipoModel> LstTipoActividad = new List<ActividadTipoModel>();
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;

                    LstTipoActividad = contexto.ActividadTipo.Where(w => w.Activo == true).OrderBy(o=> o.Jerarquia)
                                .Select(s => new ActividadTipoModel
                                {
                                    ActividadTipoId = s.ActividadTipoId,
                                    Nombre = s.Nombre,
                                    Url = s.Url,
                                    LstRequeridos = s.ActividadTipoCampos.Where(w => w.Requerido == true).Select(s2 => "#" + s2.NombreCampoHTML).ToList(),
                                    LstNoRequeridos = s.ActividadTipoCampos.Where(w => w.Requerido == false).Select(s2 => "#" + s2.NombreCampoHTML).ToList(),
                                    LstOcultar = s.ActividadTipoCampos.Where(w => w.Ver == false).Select(s2 => "#div" + s2.NombreCampoHTML).ToList(),
                                    LstVer = s.ActividadTipoCampos.Where(w => w.Ver == true).Select(s2 => "#div" + s2.NombreCampoHTML).ToList(),
                                    Jerarquia  = s.Jerarquia,
                                    Plantilla = s.Plantilla

                                }).ToList();
                }


                foreach(var i in LstTipoActividad)
                {

                    i.Requeridos = string.Join<string>(",", i.LstRequeridos.ConvertAll(s3 => s3.ToString()));
                    i.NoRequeridos = string.Join<string>(",", i.LstNoRequeridos.ConvertAll(s3 => s3.ToString()));
                    i.Ocultar = string.Join<string>(",", i.LstOcultar.ConvertAll(s3 => s3.ToString()));
                    i.Ver = string.Join<string>(",", i.LstVer.ConvertAll(s3 => s3.ToString()));

                }

                //var Lst = LstTipoActividad.Select(s =>  new string { s.ActividadCampos.Requerido }).ToList();


                return LstTipoActividad;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public List<ActividadTipoModel> ConsultaTiposActividadLista(string Conexion)
        {
            try
            {
                List<ActividadTipoModel> LstTipoActividad = new List<ActividadTipoModel>();
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;

                    LstTipoActividad = contexto.ActividadTipo.Where(w => w.Activo == true).OrderBy(o => o.Jerarquia)
                                .Select(s => new ActividadTipoModel
                                {
                                    ActividadTipoId = s.ActividadTipoId,
                                    Nombre = s.Nombre,
                                    Url = s.Url,
                                    Jerarquia = s.Jerarquia,

                                }).ToList();
                }


                return LstTipoActividad;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }


        public bool RelacionarActividad(long IdActividad, long IdActividadR, string Conexion)
        {
            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    var actr = contexto.Actividad.Where(w => w.IdActividad == IdActividadR).FirstOrDefault().ActividadTipo.Jerarquia;

                    var act = contexto.Actividad.Where(w => w.IdActividad == IdActividad).FirstOrDefault().ActividadTipo.Jerarquia;
                    ActividadRelacion ar = new ActividadRelacion();
                    if (act > actr)
                    {
                        
                        ar.IdActividad = IdActividad;
                        ar.IdActividadRelacionada = IdActividadR;

                    }
                    else
                    {
                        ar.IdActividad = IdActividadR;
                        ar.IdActividadRelacionada = IdActividad;
                    }

                    //ar.IdActividad = IdActividad;
                    //ar.IdActividadRelacionada = IdActividadR;

                    contexto.ActividadRelacion.Add(ar);
                    contexto.SaveChanges();
                }
                return true;
            }
            catch (Exception ex)
            {

                throw ex;
            }


        }

        public bool EliminarRelacionActividad(long IdActividadR, string Conexion)
        {
            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    ActividadRelacion ar = contexto.ActividadRelacion.Where(w => w.IdActividadR == IdActividadR).FirstOrDefault();

                    contexto.ActividadRelacion.Remove(ar);
                    contexto.SaveChanges();
                }
                return true;
            }
            catch (Exception ex)
            {

                throw ex;
            }


        }


        public bool RelacionarActividadFPD(long IdActividad, long IdFlujoPagoDet, string Conexion)
        {
            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    FlujoPagoDet_Actividad fpda = new FlujoPagoDet_Actividad();

                    fpda.IdActividad = IdActividad;
                    fpda.IdFlujoPagoDet = IdFlujoPagoDet;

                    contexto.FlujoPagoDet_Actividad.Add(fpda);
                    contexto.SaveChanges();
                }
                return true;
            }
            catch (Exception ex)
            {

                throw ex;
            }


        }

        public bool EliminarRelacionActividadFPD(long IdFlujoPagoDetAct, string Conexion)
        {
            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    FlujoPagoDet_Actividad ar = contexto.FlujoPagoDet_Actividad.Where(w => w.IdFlujoPagoDetAct == IdFlujoPagoDetAct).FirstOrDefault();

                    contexto.FlujoPagoDet_Actividad.Remove(ar);
                    contexto.SaveChanges();
                }
                return true;
            }
            catch (Exception ex)
            {

                throw ex;
            }


        }


        #region Backlog-WI

        public List<ActividadesModel> ConsultaBackLog (FiltrosModel  Filtros, string Conexion)
        {

            try
            {
                List<ActividadesModel> Lst = new List<ActividadesModel>();

                //var tipoactividad = string.Join<string>(",", Filtros.LstTipoActividad.ConvertAll(s => s.ToString()));
                //var clasificacion = string.Join<string>(",", Filtros.LstClasificacion.ConvertAll(s => s.ToString()));
                //var asignado = string.Join<string>(",", Filtros.LstAsignado.ConvertAll(s => s.ToString()));
                //var responsable = string.Join<string>(",", Filtros.LstResponsable.ConvertAll(s => s.ToString()));
                //var proyecto = string.Join<string>(",", Filtros.LstProyecto.ConvertAll(s => s.ToString()));
                //var prioridad = string.Join<string>(",", Filtros.LstPrioridad.ConvertAll(s => s.ToString()));
                //var estatus = string.Join<string>(",", Filtros.LstEstatus.ConvertAll(s => s.ToString()));
                //var sprint = string.Join<string>(",", Filtros.LstSprints.ConvertAll(s => s.ToString()));

                //var con = new SqlConnection(Conexion);
                //con.Open();

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spConsultaWorkItems", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@TipoId", Filtros.Tipo);
                sqlcmd.Parameters.AddWithValue("@IdProyecto", Filtros.IdProyecto);
                //sqlcmd.Parameters.AddWithValue("@FechaCreoFin", Filtros.FechaCreoFin);
                //sqlcmd.Parameters.AddWithValue("@FechaSolIni", Filtros.FechaSolIni);
                //sqlcmd.Parameters.AddWithValue("@FechaSolFin", Filtros.FechaSolFin);
                //sqlcmd.Parameters.AddWithValue("@FechaCierreIni", Filtros.FechaCierreIni);
                //sqlcmd.Parameters.AddWithValue("@FechaCierreFin", Filtros.FechaCierreFin);
                //sqlcmd.Parameters.AddWithValue("@TipoActividad", tipoactividad);
                //sqlcmd.Parameters.AddWithValue("@Clasificacion", clasificacion);
                //sqlcmd.Parameters.AddWithValue("@UsuarioAsignado", asignado);
                //sqlcmd.Parameters.AddWithValue("@UsuarioResponsable", responsable);
                //sqlcmd.Parameters.AddWithValue("@Proyecto", proyecto);
                //sqlcmd.Parameters.AddWithValue("@Estatus", estatus);
                //sqlcmd.Parameters.AddWithValue("@Prioridad", prioridad);
                //sqlcmd.Parameters.AddWithValue("@Actividad", Filtros.Actividades == null ? "" : Filtros.Actividades);
                //sqlcmd.Parameters.AddWithValue("@IdUsuario", Filtros.IdUsuario);
                //sqlcmd.Parameters.AddWithValue("@Sprint", sprint);

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
                da.Fill(ds);
                da.Dispose();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();


                //var LstAct = ds.Tables[0];
                //var Log = ds.Tables[1];

                Lst = (from row in ds.Tables[0].AsEnumerable()
                                  select (
                                  new ActividadesModel
                                  {
                                      IdActividad = long.Parse(row["IdActividad"].ToString()),
                                      IdActividadStr = row["ClaveProyecto"].ToString() + "-" + row["IdActividad"].ToString(),
                                      IdProyecto = long.Parse(row["IdProyecto"].ToString()),
                                      Estatus = row["Estatus"].ToString(),
                                      EstatusStr = row["EstatusStr"].ToString(),
                                      BR = row["BR"].ToString(),
                                      TipoId = byte.Parse(row["TipoId"].ToString()),
                                      TipoNombre = row["Nombre"].ToString(),
                                      TipoUrl = row["Url"].ToString(),
                                      Jerarquia = int.Parse(row["Jerarquia"].ToString()),
                                      Prioridad = int.Parse(row["Prioridad"].ToString()),
                                      ClaveUsuario = row["CveAsignado"].ToString(),
                                      AsignadoStr = row["Asignado"].ToString(),
                                      Sprint = row["NombreSprint"].ToString(),
                                      TipoActividadStr = row["Fase"].ToString(),
                                      HorasFacturables = row["HorasFacturables"].ToString() == "" ? (decimal?)null : Convert.ToDecimal(row["HorasFacturables"].ToString()),
                                      HorasAsignadas = row["HorasAsignadas"].ToString() == "" ? (decimal?)null : Convert.ToDecimal(row["HorasAsignadas"].ToString()),
                                      HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),
                                      FechaSolicitado = row["FechaSolicitado"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaSolicitado"].ToString()),
                                      FechaTermino = row["FechaTermino"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaTermino"].ToString())
                                      //Descripcion = row["Descripcion"].ToString(),
                                      //TipoActividadStr = row["TipoActividad"].ToString(),
                                      //ClasificacionStr = row["Clasificacion"].ToString(),
                                      //PrioridadStr = row["PrioridadStr"].ToString(),
                                      //AsignadoStr = row["Asignado"].ToString(),
                                      //ResponsableStr = row["Responsable"].ToString(),
                                      //AsignadoPath = "/Archivos/Fotos/" + row["AsignadoNumEmpleado"].ToString() + ".jpg",
                                      //ResponsablePath = "/Archivos/Fotos/" + row["ResponsableNumEmpleado"].ToString() + ".jpg",
                                      //ProyectoStr = row["Proyecto"].ToString(),
                                      //FechaCreo = DateTime.Parse(row["FechaCreo"].ToString()),
                                      //FechaSolicitado = DateTime.Parse(row["FechaSolicitado"].ToString()),
                                      //HorasFacturables = row["HorasFacturables"].ToString() == "" ? (decimal?)null : Convert.ToDecimal(row["HorasFacturables"].ToString()),
                                      //HorasAsignadas = row["HorasAsignadas"].ToString() == "" ? (decimal?)null : Convert.ToDecimal(row["HorasAsignadas"].ToString()),
                                      //HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),
                                      //FechaTermino = row["FechaTermino"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaTermino"].ToString()),
                                      //MotivoRechazoId = row["MotivoRechazoId"].ToString() == "" ? (long?)null : long.Parse(row["MotivoRechazoId"].ToString()),
                                      //DescripcionRechazo = row["DescripcionRechazo"].ToString(),
                                      //ClaveTipoActividad = row["ClaveTipoActividad"].ToString(),
                                      //ClaveUsuario = row["ClaveUsuario"].ToString(),
                                      //Sprint = row["Sprint"].ToString(),
                                      //FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
                                      //EstatusCte = row["EstatusCte"].ToString(),
                                      //EstatusCteStr = row["EstatusCteStr"].ToString(),
                                      //ClaveClasificacionActividad = row["ClaveClasificacionActividad"].ToString(),
                                      //ComentariosTotal = int.Parse(row["Comentarios"].ToString()),
                                      //ArchivosTotal = int.Parse(row["Archivos"].ToString()),
                                      //TipoActividadId = long.Parse(row["TipoActividadId"].ToString()),
                                      //PSP = int.Parse(row["PSP"].ToString()),

                                      //DependenciasA = int.Parse(row["Dependencias"].ToString()),
                                      //DependenciasT = int.Parse(row["DependenciasT"].ToString()),
                                      //TipoNombre = row["TipoNombre"].ToString(),
                                      //TipoUrl = row["TipoUrl"].ToString(),
                                  })).ToList();


                //var LstActEnc = ds.Tables[1];


                //LstActividadesEnc = (from row in LstActEnc.AsEnumerable()
                //                     select (
                //                     new ActividadesModel
                //                     {
                //                         TipoActividadId = long.Parse(row["TipoActividadId"].ToString()),
                //                         ClaveTipoActividad = row["ClaveTipoActividad"].ToString(),
                //                         TipoActividadStr = row["TipoActividad"].ToString(),
                //                         HorasFacturables = decimal.Parse(row["HorasFacturables"].ToString() == "" ? "0.00" : row["HorasFacturables"].ToString()),
                //                         HorasAsignadas = decimal.Parse(row["HorasAsignadas"].ToString() == "" ? "0.00" : row["HorasAsignadas"].ToString()),
                //                         HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),
                //                         FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
                //                         FechaFin = DateTime.Parse(row["FechaFin"].ToString())
                //                     })).OrderBy(o => o.IdActividad).ToList();


                return Lst;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public List<ActividadesModel> ConsultaBackLogv2(FiltrosModel Filtros, string Conexion)
        {
            try
            {
                List<ActividadesModel> Lst = new List<ActividadesModel>();
                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spConsultaWorkItems_v2", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@TipoId", Filtros.Tipo);
                sqlcmd.Parameters.AddWithValue("@IdProyecto", Filtros.IdProyecto);

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
                da.Fill(ds);
                da.Dispose();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();

                Lst = (from row in ds.Tables[0].AsEnumerable()
                       select (
                       new ActividadesModel 
                       {
                           IdActividad = long.Parse(row["IdActividad"].ToString()),
                           IdActividadRelacionada = row["IdActividadRelacionada"].ToString() == "" ? (long?)null : long.Parse(row["IdActividadRelacionada"].ToString()),
                           IdActividadR1 = row["IdActividadRelacionada"].ToString() == "" ? 0 : long.Parse(row["IdActividadRelacionada"].ToString()),
                           IdActividadStr = row["ClaveProyecto"].ToString() + "-" + row["IdActividad"].ToString(),
                           IdProyecto = long.Parse(row["IdProyecto"].ToString()),
                           Estatus = row["Estatus"].ToString(),
                           EstatusStr = row["EstatusStr"].ToString(),
                           BR = row["BR"].ToString(),
                           TipoId = byte.Parse(row["TipoId"].ToString()),
                           TipoNombre = row["Nombre"].ToString(),
                           TipoUrl = row["Url"].ToString(),
                           Jerarquia = int.Parse(row["Jerarquia"].ToString()),
                           Prioridad = int.Parse(row["Prioridad"].ToString()),
                           Orden = int.Parse(row["Prioridad"].ToString()),
                           PrioridadStr = row["PrioridadStr"].ToString(),
                           ClaveUsuario = row["CveAsignado"].ToString(),
                           AsignadoStr = row["Asignado"].ToString(),
                           Sprint = row["NombreSprint"].ToString(),
                           TipoActividadStr = row["Fase"].ToString(),
                           HorasFacturables = row["HorasFacturables"].ToString() == "" ? (decimal?)null : Convert.ToDecimal(row["HorasFacturables"].ToString()),
                           HorasAsignadas = row["HorasAsignadas"].ToString() == "" ? (decimal?)null : Convert.ToDecimal(row["HorasAsignadas"].ToString()),
                           HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),
                           FechaInicio = row["FechaInicio"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaInicio"].ToString()),
                           FechaSolicitado = row["FechaSolicitado"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaSolicitado"].ToString()),
                           FechaTermino = row["FechaTermino"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaTermino"].ToString()),
                           Puntos = row["Puntos"].ToString() == "" ? (int?)null : int.Parse(row["Puntos"].ToString()),
                           WorkFlow = row["Workflow"].ToString(),
                           ColorW = row["ColorW"].ToString(),
                           AvanceDependencia = decimal.Parse(row["Avance"].ToString())


                       })).ToList();


                return Lst;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public List<ActividadesModel> ConsultaBackLogImprimir(long IdProyecto, long Tipo, string Conexion)
        {
            try
            {
                List<ActividadesModel> Lst = new List<ActividadesModel>();
                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spConsultaWorkItems_Imprimir", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@TipoId",Tipo);
                sqlcmd.Parameters.AddWithValue("@IdProyecto", IdProyecto);

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
                da.Fill(ds);
                da.Dispose();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();

                var dsComentarios = ds.Tables[1];

                Lst = (from row in ds.Tables[0].AsEnumerable()
                       select (
                       new ActividadesModel
                       {
                           IdActividad = long.Parse(row["IdActividad"].ToString()),
                           ProyectoStr = row["ProyectoStr"].ToString(),
                           IdActividadStr = row["ClaveProyecto"].ToString() + "-" + row["IdActividad"].ToString(),
                           TipoActividadStr = row["Tipo"].ToString(),
                           EstatusStr = row["EstatusStr"].ToString(),
                           BR = row["BR"].ToString(),
                           Descripcion = row["Descripcion"].ToString(),
                           CriterioAceptacion = row["CriterioAceptacion"].ToString(),
                           TipoId= byte.Parse(row["TipoId"].ToString()),
                           Comentarios = (from r in dsComentarios.AsEnumerable()
                                          where long.Parse(r["IdActividad"].ToString()) == long.Parse(row["IdActividad"].ToString())
                                          select (new ActividadComentarioModel
                                          {
                                              Fecha = DateTime.Parse(r["Fecha"].ToString()),
                                              Comentario = r["Comentario"].ToString(),
                                              IdUsuarioStr = r["Usuario"].ToString()
                                          })).ToList()

                       })).ToList();


                return Lst;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public void ConsultaBackLogQA( ref List<ActividadesModel> LstActividades, ref List<GraficaConsultaModel> LstGraficas,  FiltrosModel Filtros, string Conexion)
        {
            try
            {
        
                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spConsultaWorkItems_QA", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@TipoId", 4);
                sqlcmd.Parameters.AddWithValue("@IdProyecto", Filtros.IdProyecto);
                sqlcmd.Parameters.AddWithValue("@Relacionado", Filtros.Tipo);

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
                da.Fill(ds);
                da.Dispose();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();

                LstActividades = (from row in ds.Tables[0].AsEnumerable()
                       select (
                       new ActividadesModel
                       {
                           IdActividad = long.Parse(row["IdActividad"].ToString()),
                           IdActividadR1 = row["IdActividadRelacionada"].ToString() == "" ? 0 : long.Parse(row["IdActividadRelacionada"].ToString()),
                           IdActividadStr =  row["IdActividadStr"].ToString(),
                           IdProyecto = long.Parse(row["IdProyecto"].ToString()),
                           Estatus = row["EstatusP"].ToString(),
                           EstatusStr = row["EstatusStr"].ToString(),
                           BR = row["BR"].ToString(),
                           TipoId = byte.Parse(row["TipoId"].ToString()),
                           TipoNombre = row["Nombre"].ToString(),
                           TipoUrl = row["Url"].ToString(),
                           Jerarquia = int.Parse(row["Jerarquia"].ToString()),
                           Prioridad = int.Parse(row["Prioridad"].ToString()),
                           ClaveUsuario = row["CveAsignado"].ToString(),
                           AsignadoStr = row["Asignado"].ToString(),
                           ClasificacionStr = row["Clasificacion"].ToString(),
                       })).ToList();



                var dt = new DataTable();


                var gr = new GraficaConsultaModel();

                dt = ds.Tables[1];

                gr.id = Guid.NewGuid();
                gr.Nombre = "Estatus";
                gr.Tipo = "Pie";

                var Lst = (from row in dt.AsEnumerable() select (new GraficaModel { name = row["Indicador"].ToString() + " " + row["Resultado"].ToString(), value = double.Parse(row["Resultado"].ToString()) })).ToList();
                gr.LstValores = JsonConvert.SerializeObject(Lst);
                gr.Series = JsonConvert.SerializeObject(Lst.Select(s => s.name).ToList());

                LstGraficas.Add(gr);

                //return Lst;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public List<ActividadesModel> BuscarWorkitems(FiltrosModel Filtros, string Conexion)
        {

            try
            {
                List<ActividadesModel> Lst = new List<ActividadesModel>();

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spBuscarWorkItems", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdProyecto", Filtros.IdProyecto);
                sqlcmd.Parameters.AddWithValue("@SprintA", Filtros.IdIteracion == -1 ? (int?)null : Filtros.IdIteracion);
                sqlcmd.Parameters.AddWithValue("@Tipo", Filtros.Tipo == -1 ? (int?)null : Filtros.Tipo);
                sqlcmd.Parameters.AddWithValue("@Fase", Filtros.IdFase == -1 ? (int?)null : Filtros.IdFase);
                sqlcmd.Parameters.AddWithValue("@Estatus", Filtros.EstatusF == "-1" ? null : Filtros.EstatusF);
                sqlcmd.Parameters.AddWithValue("@Prioridad", Filtros.PrioridadF == "-1" ? null : Filtros.PrioridadF);
                sqlcmd.Parameters.AddWithValue("@SprintB", Filtros.IdIteracionB == -1 ? (int?)null : Filtros.IdIteracionB);
                sqlcmd.Parameters.AddWithValue("@Asignado", Filtros.IdUsuario == -1 ? (long?)null : Filtros.IdUsuario);
                sqlcmd.Parameters.AddWithValue("@SinSprint", Filtros.SinSprint == true ? 1: 0);

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
                da.Fill(ds);
                da.Dispose();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();


                //var LstAct = ds.Tables[0];
                //var Log = ds.Tables[1];

                Lst = (from row in ds.Tables[0].AsEnumerable()
                       select (
                       new ActividadesModel
                       {
                           IdActividad = long.Parse(row["IdActividad"].ToString()),
                           IdActividadStr =  row["IdActividadStr"].ToString(),
                           BR = row["BR"].ToString(),
                           Estatus = row["Estatus"].ToString(),
                           EstatusStr = row["EstatusStr"].ToString(),
                           TipoNombre = row["Nombre"].ToString(),
                           TipoUrl = row["Url"].ToString(),
                           Prioridad = int.Parse(row["Prioridad"].ToString()),

                       })).ToList();



                return Lst;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public List<ActividadesModel> ConsultaBackLog_PorTipo(FiltrosModel Filtros, string Conexion)
        {

            try
            {
                List<ActividadesModel> Lst = new List<ActividadesModel>();


                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spConsultaWorkItems_PorTipo", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@TipoId", Filtros.Tipo);
                sqlcmd.Parameters.AddWithValue("@IdProyecto", Filtros.IdProyecto);


                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
                da.Fill(ds);
                da.Dispose();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();


                Lst = (from row in ds.Tables[0].AsEnumerable()
                       select (
                       new ActividadesModel
                       {
                           IdActividad = long.Parse(row["IdActividad"].ToString()),
                           IdActividadStr = row["ClaveProyecto"].ToString() + "-" + row["IdActividad"].ToString(),
                           IdProyecto = long.Parse(row["IdProyecto"].ToString()),
                           Estatus = row["Estatus"].ToString(),
                           EstatusStr = row["EstatusStr"].ToString(),
                           BR = row["BR"].ToString(),
                           TipoId = byte.Parse(row["TipoId"].ToString()),
                           TipoNombre = row["Nombre"].ToString(),
                           TipoUrl = row["Url"].ToString(),
                           Jerarquia = int.Parse(row["Jerarquia"].ToString()),
                           Prioridad = int.Parse(row["Prioridad"].ToString()),
                           ClaveUsuario = row["CveAsignado"].ToString(),
                           AsignadoStr = row["Asignado"].ToString(),
                           Sprint = row["NombreSprint"].ToString(),
                           TipoActividadStr = row["Fase"].ToString(),
                           HorasFacturables = row["HorasFacturables"].ToString() == "" ? (decimal?)null : Convert.ToDecimal(row["HorasFacturables"].ToString()),
                           HorasAsignadas = row["HorasAsignadas"].ToString() == "" ? (decimal?)null : Convert.ToDecimal(row["HorasAsignadas"].ToString()),
                           HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),
                           FechaSolicitado = row["FechaSolicitado"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaSolicitado"].ToString()),
                           FechaTermino = row["FechaTermino"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaTermino"].ToString())

                       })).ToList();




                return Lst;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public List<ActividadesModel> ConsultaBackLog_Relacionados(FiltrosModel Filtros, string Conexion)
        {

            try
            {
                List<ActividadesModel> Lst = new List<ActividadesModel>();


                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spConsultaWorkItems_Relacionados", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@TipoId", Filtros.Tipo);
                sqlcmd.Parameters.AddWithValue("@IdRelacionado", Filtros.IdActividad == -1 ? (long?) null : Filtros.IdActividad);
                sqlcmd.Parameters.AddWithValue("@IdProyecto", Filtros.IdProyecto);

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
                da.Fill(ds);
                da.Dispose();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();

                Lst = (from row in ds.Tables[0].AsEnumerable()
                       select (
                       new ActividadesModel
                       {
                           IdActividad = long.Parse(row["IdActividad"].ToString()),
                           IdActividadStr = row["ClaveProyecto"].ToString() + "-" + row["IdActividad"].ToString(),
                           IdProyecto = long.Parse(row["IdProyecto"].ToString()),
                           Estatus = row["Estatus"].ToString(),
                           EstatusStr = row["EstatusStr"].ToString(),
                           BR = row["BR"].ToString(),
                           TipoId = byte.Parse(row["TipoId"].ToString()),
                           TipoNombre = row["Nombre"].ToString(),
                           TipoUrl = row["Url"].ToString(),
                           Jerarquia = int.Parse(row["Jerarquia"].ToString()),
                           Prioridad = int.Parse(row["Prioridad"].ToString()),
                           ClaveUsuario = row["CveAsignado"].ToString(),
                           AsignadoStr = row["Asignado"].ToString(),
                           Sprint = row["NombreSprint"].ToString(),
                           IdActividadR1 = long.Parse(row["IdActividadR1"].ToString()),
                           //IdActividadR2 = long.Parse(row["IdActividadR2"].ToString()),
                           TipoActividadStr = row["Fase"].ToString(),
                           HorasFacturables = row["HorasFacturables"].ToString() == "" ? (decimal?)null : Convert.ToDecimal(row["HorasFacturables"].ToString()),
                           HorasAsignadas = row["HorasAsignadas"].ToString() == "" ? (decimal?)null : Convert.ToDecimal(row["HorasAsignadas"].ToString()),
                           HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),
                           FechaSolicitado = row["FechaSolicitado"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaSolicitado"].ToString()),
                           FechaTermino = row["FechaTermino"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaTermino"].ToString())

                       })).ToList();




                return Lst;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }
        public List<ActividadesModel> ConsultaBackLog_RelacionadosQA(FiltrosModel Filtros, string Conexion)
        {

            try
            {
                List<ActividadesModel> Lst = new List<ActividadesModel>();


                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spConsultaWorkItems_RelacionadosQA", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@TipoId", Filtros.Tipo);
                sqlcmd.Parameters.AddWithValue("@IdRelacionado", Filtros.IdActividad == -1 ? (long?)null : Filtros.IdActividad);
                sqlcmd.Parameters.AddWithValue("@IdProyecto", Filtros.IdProyecto);
                sqlcmd.Parameters.AddWithValue("@IdCicloP", Filtros.IdIteracion);

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
                da.Fill(ds);
                da.Dispose();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();

                Lst = (from row in ds.Tables[0].AsEnumerable()
                       select (
                       new ActividadesModel
                       {
                           IdActividad = long.Parse(row["IdActividad"].ToString()),
                           IdActividadStr = row["ClaveProyecto"].ToString() + "-" + row["IdActividad"].ToString(),
                           IdProyecto = long.Parse(row["IdProyecto"].ToString()),
                           Estatus = row["Estatus"].ToString(),
                           EstatusStr = row["EstatusStr"].ToString(),
                           BR = row["BR"].ToString(),
                           TipoId = byte.Parse(row["TipoId"].ToString()),
                           TipoNombre = row["Nombre"].ToString(),
                           TipoUrl = row["Url"].ToString(),
                           Jerarquia = int.Parse(row["Jerarquia"].ToString()),
                           Prioridad = int.Parse(row["Prioridad"].ToString()),
                           ClaveUsuario = row["CveAsignado"].ToString(),
                           AsignadoStr = row["Asignado"].ToString(),
                           Sprint = row["NombreSprint"].ToString(),
                           IdActividadR1 = long.Parse(row["IdActividadR1"].ToString()),
                           //IdActividadR2 = long.Parse(row["IdActividadR2"].ToString()),
                           TipoActividadStr = row["Fase"].ToString(),
                           HorasFacturables = row["HorasFacturables"].ToString() == "" ? (decimal?)null : Convert.ToDecimal(row["HorasFacturables"].ToString()),
                           HorasAsignadas = row["HorasAsignadas"].ToString() == "" ? (decimal?)null : Convert.ToDecimal(row["HorasAsignadas"].ToString()),
                           HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),
                           FechaSolicitado = row["FechaSolicitado"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaSolicitado"].ToString()),
                           FechaTermino = row["FechaTermino"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaTermino"].ToString())

                       })).ToList();




                return Lst;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public List<GraficaConsultaModel> ConsultarGraficasBacklog(long IdProyecto, string Conexion)
        {
            try
            {
                //var Anios = string.Join<string>(",", filtros.LstAnios.ConvertAll(s => s.ToString()));
                //var Meses = string.Join<string>(",", filtros.LstMeses.ConvertAll(s => s.ToString()));
                //var Recursos = string.Join<string>(",", filtros.LstRecursos.ConvertAll(s => s.ToString()));
                //var Graficas = string.Join<string>(",", filtros.LstGraficas.ConvertAll(s => s.ToString()));

                //var con = new SqlConnection(Conexion);
                //con.Open();


                List<GraficaConsultaModel> LstGraficas = new List<GraficaConsultaModel>();

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("SpActividades_Estatus", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdProyecto", IdProyecto);
                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);


                da.Fill(ds);
                da.Dispose();

                GraficaConsultaModel gr;
                var dt = new DataTable();
                foreach (DataTable d in ds.Tables)
                {
                    gr = new GraficaConsultaModel();

                    dt = d;

                    gr.id = Guid.NewGuid();
                    gr.Nombre = dt.Rows[0][0].ToString();
                    gr.Tipo = dt.Rows[0][1].ToString();

                    //if (gr.Tipo == "Pie")
                    //{

                        var Lst = (from row in dt.AsEnumerable() select (new GraficaModel { name = row["Indicador"].ToString() + " " + row["Resultado"].ToString(), value = double.Parse(row["Resultado"].ToString()) })).ToList();
                        gr.LstValores = JsonConvert.SerializeObject(Lst);
                        gr.Series = JsonConvert.SerializeObject(Lst.Select(s => s.name).ToList());
                    //}
                    //else if (gr.Tipo == "bar" || gr.Tipo == "line")
                    //{

                    //    gr.Nombre = dt.Rows[0][0].ToString();
                    //    gr.Tipo = dt.Rows[0][1].ToString();


                    //    //Valores de las series
                    //    var lst = (from row in dt.AsEnumerable() select row[2].ToString()).ToList();

                    //    //Valores de las columnas
                    //    List<string> columns = new List<string>();
                    //    for (int i = 3; i < dt.Columns.Count; i++)
                    //    {
                    //        columns.Add(dt.Columns[i].ColumnName.ToString());
                    //    }

                    //    //Valores de data
                    //    List<GraficaBarraModel> lstval = new List<GraficaBarraModel>();
                    //    GraficaBarraModel gbm;
                    //    List<string> datos;
                    //    for (int i = 0; i < dt.Rows.Count; i++)
                    //    {
                    //        gbm = new GraficaBarraModel();
                    //        datos = new List<string>();
                    //        gbm.name = dt.Rows[i][2].ToString();
                    //        gbm.type = dt.Rows[i][1].ToString();

                    //        for (int j = 3; j < dt.Columns.Count; j++)
                    //        {
                    //            datos.Add(dt.Rows[i][j].ToString());
                    //        }

                    //        gbm.data = datos;

                    //        lstval.Add(gbm);
                    //    }

                    //    gr.LstValores = JsonConvert.SerializeObject(lstval);
                    //    gr.LstColumnas = JsonConvert.SerializeObject(columns);
                    //    gr.Series = JsonConvert.SerializeObject(lst);

                    //}

                    //gr.Tabla = ConvertirDatos.GenerarTablaHtml(dt);

                    LstGraficas.Add(gr);

                }



                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();
                sqlcon.Close();
                //con.Close();

                return LstGraficas;

            }
            catch (Exception ex)
            {

                throw ex;
            }


        }


        public List<GraficaConsultaModel> ConsultarGraficasSprint(long IdIteracion, string Conexion)
        {
            try
            {
                //var Anios = string.Join<string>(",", filtros.LstAnios.ConvertAll(s => s.ToString()));
                //var Meses = string.Join<string>(",", filtros.LstMeses.ConvertAll(s => s.ToString()));
                //var Recursos = string.Join<string>(",", filtros.LstRecursos.ConvertAll(s => s.ToString()));
                //var Graficas = string.Join<string>(",", filtros.LstGraficas.ConvertAll(s => s.ToString()));

                //var con = new SqlConnection(Conexion);
                //con.Open();


                List<GraficaConsultaModel> LstGraficas = new List<GraficaConsultaModel>();

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("SpActividades_EstatusSprint", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdIteracion", IdIteracion);
                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);


                da.Fill(ds);
                da.Dispose();

                GraficaConsultaModel gr;
                var dt = new DataTable();
                foreach (DataTable d in ds.Tables)
                {
                    gr = new GraficaConsultaModel();

                    dt = d;

                    gr.id = Guid.NewGuid();
                    gr.Nombre = dt.Rows[0][0].ToString();
                    gr.Tipo = dt.Rows[0][1].ToString();

                    //if (gr.Tipo == "Pie")
                    //{

                    var Lst = (from row in dt.AsEnumerable() select (new GraficaModel { name = row["Indicador"].ToString() + " " + row["Resultado"].ToString(), value = double.Parse(row["Resultado"].ToString()) })).ToList();
                    gr.LstValores = JsonConvert.SerializeObject(Lst);
                    gr.Series = JsonConvert.SerializeObject(Lst.Select(s => s.name).ToList());
                    //}
                    //else if (gr.Tipo == "bar" || gr.Tipo == "line")
                    //{

                    //    gr.Nombre = dt.Rows[0][0].ToString();
                    //    gr.Tipo = dt.Rows[0][1].ToString();


                    //    //Valores de las series
                    //    var lst = (from row in dt.AsEnumerable() select row[2].ToString()).ToList();

                    //    //Valores de las columnas
                    //    List<string> columns = new List<string>();
                    //    for (int i = 3; i < dt.Columns.Count; i++)
                    //    {
                    //        columns.Add(dt.Columns[i].ColumnName.ToString());
                    //    }

                    //    //Valores de data
                    //    List<GraficaBarraModel> lstval = new List<GraficaBarraModel>();
                    //    GraficaBarraModel gbm;
                    //    List<string> datos;
                    //    for (int i = 0; i < dt.Rows.Count; i++)
                    //    {
                    //        gbm = new GraficaBarraModel();
                    //        datos = new List<string>();
                    //        gbm.name = dt.Rows[i][2].ToString();
                    //        gbm.type = dt.Rows[i][1].ToString();

                    //        for (int j = 3; j < dt.Columns.Count; j++)
                    //        {
                    //            datos.Add(dt.Rows[i][j].ToString());
                    //        }

                    //        gbm.data = datos;

                    //        lstval.Add(gbm);
                    //    }

                    //    gr.LstValores = JsonConvert.SerializeObject(lstval);
                    //    gr.LstColumnas = JsonConvert.SerializeObject(columns);
                    //    gr.Series = JsonConvert.SerializeObject(lst);

                    //}

                    //gr.Tabla = ConvertirDatos.GenerarTablaHtml(dt);

                    LstGraficas.Add(gr);

                }



                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();
                sqlcon.Close();
                //con.Close();

                return LstGraficas;

            }
            catch (Exception ex)
            {

                throw ex;
            }


        }


        public bool MoverOrdenBL (long IdActividad,long IdProyecto, long TipoId, int TipoMov, string Conexion)
        {
            try
            {

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    var a = contexto.Actividad.Where(w => w.IdActividad == IdActividad).FirstOrDefault();

                  

                    //0 subir
                    if(TipoMov == 0)
                    {
                        if (a.Prioridad == 1)
                        {
                            return true;

                        }

                        int N = a.Prioridad - 1;

                        var ap = contexto.Actividad.Where(w => w.IdProyecto == IdProyecto && w.TipoId == TipoId && w.Prioridad == N).FirstOrDefault();

                        if(ap != null)
                        {
                            ap.Prioridad = ap.Prioridad + 1;
                        }
                        a.Prioridad =N;

                    }
                    else //Bajar
                    {



                        int N = a.Prioridad + 1;

                        var ap = contexto.Actividad.Where(w => w.IdProyecto == IdProyecto && w.TipoId == TipoId && w.Prioridad == N).FirstOrDefault();

                        if (ap != null)
                        {
                            ap.Prioridad = ap.Prioridad -1 ;
                        }
                        a.Prioridad =N;
                    }


                    contexto.SaveChanges();
                }

                return true;

            }
            catch (Exception ex)
            {

                throw ex;
            }


        }


        public bool ActualizaOrdenBacklog(List<ActividadesModel>  LstUpdates, string Conexion)
        {
            try
            {

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    foreach (var update in LstUpdates)
                    {
                        var activity = contexto.Actividad.Where(w => w.IdActividad == update.IdActividad).FirstOrDefault();

                        if (activity != null)
                        {
                            activity.Prioridad = update.Orden;
   
                        }
                    }

                    contexto.SaveChanges();
                }

                return true;

            }
            catch (Exception ex)
            {

                throw ex;
            }


        }


        public void ConsultaMatrizRastreo(ref List<ActividadesModel> LstHus, ref List<ActividadesModel> LstDetalle,  long IdProyecto, string Conexion)
        {
            try
            {
                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spMatrizRastreo", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdProyecto", IdProyecto);

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
                da.Fill(ds);
                da.Dispose();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();

                LstHus = (from row in ds.Tables[0].AsEnumerable()
                       select (
                       new ActividadesModel
                       {
                           IdActividad = long.Parse(row["IdActividad"].ToString()),
                           IdActividadR1 = row["IdActividadR"].ToString() == "" ? 0 : long.Parse(row["IdActividadR"].ToString()),
                           BR = row["BR"].ToString(),
                           Estatus = row["Estatus"].ToString()
                           //AvanceUX = row["AvanceDis"].ToString(),
                           //AvanceDev = row["AvanceDev"].ToString(),
                           //AvanceBugs = row["AvanceBugs"].ToString(),
                           //AvanceCalidad = row["AvanceCalidad"].ToString(),
                           //AvanceImp = row["AvanceImp"].ToString(),
                       })).ToList();


                LstDetalle = (from row in ds.Tables[1].AsEnumerable()
                          select (
                          new ActividadesModel
                          {
                              IdActividad = long.Parse(row["IdActividad"].ToString()),
                              IdActividadStr = row["IdActividadStr"].ToString(),
                              BR = row["BR"].ToString(),
                              Estatus = row["Estatus"].ToString(),
                              EstatusStr = row["DescCorta"].ToString()== "QA" ? row["EstatusStr2"].ToString() :  row["EstatusStr"].ToString(),
                              AsignadoStr = row["NumEmpleado"].ToString(),
                              IdActividadR1 = long.Parse(row["IdHU"].ToString()),
                              TipoActividadStr = row["DescCorta"].ToString()
                          })).ToList();
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public List<MatrizModel> ConsultaMatrizRastreo2( ref int count, MatrizModel Filtros, string Conexion)
        {
            try
            {


                var epicas = string.Join<string>(",", Filtros.LstEpicas.ConvertAll(s => s.ToString()));
                var hus = string.Join<string>(",", Filtros.LstHUS.ConvertAll(s => s.ToString()));
                var sprints = string.Join<string>(",", Filtros.LstSprints.ConvertAll(s => s.ToString()));
                var estatus = string.Join<string>(",", Filtros.LstEstatus.ConvertAll(s => s.ToString()));


                List<MatrizModel> Lst = new List<MatrizModel>();
                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spMatrizRastreo_V2", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdProyecto", Filtros.IdProyecto);
                sqlcmd.Parameters.AddWithValue("@Epicas", epicas);
                sqlcmd.Parameters.AddWithValue("@HUS", hus);
                sqlcmd.Parameters.AddWithValue("@Sprints", sprints);
                sqlcmd.Parameters.AddWithValue("@Estatus",estatus);

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
                da.Fill(ds);
                da.Dispose();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();

                Lst = (from row in ds.Tables[0].AsEnumerable()
                          select (
                          new MatrizModel
                          {
                              Requerimieto = row["Requerimiento"].ToString(),
                              Epica = row["EPICA"].ToString(),
                              IdActividad = long.Parse(row["IdActividad"].ToString()),
                              HU = row["HU"].ToString(),
                              Sprint = row["Sprint"].ToString(),
                              Estatus = row["Estatus"].ToString(),
                              EstatusStr = row["EstatusStr"].ToString(),
                              Fase = row["Fase"].ToString(),
                              CveAsignado = row["CveAsignado"].ToString(),
                              Asignado = row["Asignado"].ToString(),
                          })).ToList();


                count =  int.Parse (ds.Tables[1].Rows[0][0].ToString());


                return Lst;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        #endregion

        #region PeerReviews
        public string GuardaImportacionPeerReviews(List<ActividadesModel> LstActividad, long IdUsuario, string Conexion, string ConexionEF)
        {
            try
            {
                string Mensaje = string.Empty;
                List<string> ProyectosImp = LstActividad.Select(s => s.ProyectoStr).Distinct().ToList();
                List<long> ActividadesImp = LstActividad.Select(s => s.IdActividad).Distinct().ToList();
                List<string> RevisionImp = LstActividad.Select(s => s.BR).Distinct().ToList();
                List<string> ResponsableImp = LstActividad.Select(s => s.ResponsableStr).Distinct().ToList();


                List<ProyectosModel> Proyectos = new List<ProyectosModel>();
                List<ListaRevisionModel> Revisiones = new List<ListaRevisionModel>();
                List<CatalogoGeneralModel> UResponsable = new List<CatalogoGeneralModel>();
                List<long> Actividades = new List<long>();


                List<String> StrProyectos = new List<String>();
                List<String> StrRevisiones = new List<String>();
                List<String> StrResponsable = new List<String>();





                using (var contexto = new BDProductividad_DEVEntities(ConexionEF))
                {

                    contexto.Configuration.LazyLoadingEnabled = false;
                    Proyectos = contexto.Proyecto.Where(c => c.Activo == true).Select(s => new ProyectosModel { IdProyecto = s.IdProyecto, Clave = s.Clave, ClaveVal = s.Clave.Replace(" ", ""), IdULider = s.IdULider }).ToList();
                    Revisiones = contexto.ListaRevision.Where(w => w.Activo == true).Select(s => new ListaRevisionModel { IdListaRevision = s.IdListaRevision, Nombre = s.Nombre }).ToList();
                    UResponsable = contexto.Usuario.Where(c => c.Activo == true).Select(s => new CatalogoGeneralModel { IdCatalogo = s.IdUsuario, DescCorta = s.NumEmpleado }).ToList();
                    Actividades = contexto.Actividad.Where(w => ActividadesImp.Contains(w.IdActividad)).Select(s=>s.IdActividad ).ToList();
                }


                StrProyectos = Proyectos.Select(s => s.ClaveVal).ToList();
                StrRevisiones = Revisiones.Select(s => s.Nombre).ToList();
                StrResponsable = UResponsable.Select(s => s.DescCorta).ToList();


                var ValProyecto = (from p in ProyectosImp
                                   where !StrProyectos.Contains(p)
                                   select p).ToList();

                if (ValProyecto.Count > 0)
                {
                    return "A|El proyecto con clave " + ValProyecto.FirstOrDefault() + " no existe o se encuentra inactivo.";
                }



                var ValUResponsable = (from p in ResponsableImp
                                       where !StrResponsable.Contains(p)
                                       select p).ToList();

                var asignstr = ResponsableImp.Select(s => s).FirstOrDefault();
                long IdAsignado = 0;
                if (ValUResponsable.Count > 0)
                {
                    if (asignstr != "")
                    {
                        return "A|El usuario con clave " + ValUResponsable.FirstOrDefault() + " no existe o se encuentra inactivo.";
                    }
                    else
                    {
                        IdAsignado = -1;
                    }


                }



                var Revs = (from p in RevisionImp
                                  where !StrRevisiones.Contains(p)
                                   select p).ToList();

                if (Revs.Count > 0)
                {
                    return "A|La revisión con nombre  " + Revs.FirstOrDefault() + " no existe o se encuentra inactiva.";
                }




                var ValActs = (from p in ActividadesImp
                                        where !Actividades.Contains(p)
                                        select p).ToList();


                if (ValActs.Count > 0)
                {
                    return "A|La actividad  " + ValActs.FirstOrDefault() + " no existe o se encuentra inactiva.";
                }



                using (var contexto = new BDProductividad_DEVEntities(ConexionEF))
                {


                    var ListaFinal = LstActividad
                           .Select(s => new Actividad
                           {
                               IdUsuarioAsignado = IdAsignado == 0 ? UResponsable.Where(w => w.DescCorta == s.ResponsableStr).Select(k => k.IdCatalogo).FirstOrDefault() : IdAsignado,
                               Descripcion = "",
                               BR = "PEER REVIEW ACTIVIDAD #" + s.IdActividad.ToString(),
                               Estatus = "A",
                               EstatusCte = "P",
                               Prioridad = 0,
                               Planificada = 1,
                               HorasFacturables = 0,
                               HorasAsignadas = s.HorasAsignadas,
                               IdProyecto = Proyectos.Where(w => w.ClaveVal == s.ProyectoStr).Select(k => k.IdProyecto).FirstOrDefault(),
                               TipoActividadId = contexto.Actividad.Where(w => w.IdActividad == s.IdActividad).FirstOrDefault().TipoActividadId,
                               ClasificacionId = contexto.Actividad.Where(w => w.IdActividad == s.IdActividad).FirstOrDefault().ClasificacionId,
                               IdUsuarioResponsable = long.Parse(Proyectos.Where(w => w.ClaveVal == s.ProyectoStr).Select(k => k.IdULider).FirstOrDefault().ToString()),
                               FechaInicio = s.FechaInicio,
                               FechaSolicitado = s.FechaSolicitado,
                               IdUCreo = IdUsuario,
                               FechaCreo = DateTime.Now,
                               Critico = false,
                               Retrabajo = false,
                               TipoId = 1, // Siempre es tarea
                               IdListaRevision =  contexto.ListaRevision.Where(w=> w.Nombre.ToUpper().Trim() ==  s.BR.ToUpper().Trim()).FirstOrDefault().IdListaRevision,
                               IdIteracion = contexto.Actividad.Where(w => w.IdActividad == s.IdActividad).FirstOrDefault().IdIteracion,
                               ActividadRelacion = (new List<ActividadRelacion>() { new ActividadRelacion() { IdActividadRelacionada = s.IdActividad } }).ToList(),
                               ActividadListaRevision = contexto.ListaRevision.Where(w => w.Nombre.ToUpper().Trim() == s.BR.ToUpper().Trim()).FirstOrDefault().ListaRevisionDetalle
                                                        .Select(x => new ActividadListaRevision 
                                                            { 
                                                            IdListaRevisionDetalle = x.IdListaRevisionDetalle,
                                                            Cumple = false,
                                                            IdUCreo = UResponsable.Where(w => w.DescCorta == s.ResponsableStr).Select(k => k.IdCatalogo).FirstOrDefault(),
                                                            FechaCreo = DateTime.Now

                                                        }).ToList()
                           }).ToList();




                    contexto.Actividad.AddRange(ListaFinal);
                    contexto.SaveChanges();


                    //Agrego las validaciones y fases


                    SqlConnection sqlcon = new SqlConnection(Conexion);
                    sqlcon.Open();
                    SqlCommand sqlcmd = new SqlCommand("InsertaValidacionesSP", sqlcon);
                    sqlcmd.CommandType = CommandType.StoredProcedure;

                    sqlcmd.ExecuteNonQuery();

                    sqlcmd.Connection.Close();
                    sqlcmd.Connection.Dispose();
                    sqlcmd.Dispose();
                    sqlcon.Close();

                    contexto.SaveChanges();

                    Mensaje = "E|Los datos se guardaron correctamente";


                }


                return Mensaje;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        #endregion


        #region WorkFlow

        public List<ActividadesModel> ObtieneActividadesTablero(FiltrosModel Filtros , string Conexion)
        {
            try
            {


                List<ActividadesModel> LstActividades = new List<ActividadesModel>();

                var tipoactividad = string.Join<string>(",", Filtros.LstTipoActividad.ConvertAll(s => s.ToString()));
                var clasificacion = string.Join<string>(",", Filtros.LstClasificacion.ConvertAll(s => s.ToString()));
                var asignado = string.Join<string>(",", Filtros.LstAsignado.ConvertAll(s => s.ToString()));
                var responsable = string.Join<string>(",", Filtros.LstResponsable.ConvertAll(s => s.ToString()));
                var prioridad = string.Join<string>(",", Filtros.LstPrioridad.ConvertAll(s => s.ToString()));
                var sprint = string.Join<string>(",", Filtros.LstSprints.ConvertAll(s => s.ToString()));
                var estatus = string.Join<string>(",", Filtros.LstEstatusW.ConvertAll(s => s.ToString()));



                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("SpWorkItems_WorkFlow", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;

                sqlcmd.Parameters.AddWithValue("@IdProyecto", Filtros.IdProyecto);
                sqlcmd.Parameters.AddWithValue("@TipoId", Filtros.Tipo);
                sqlcmd.Parameters.AddWithValue("@FechaIni", Filtros.FechaSolIni);
                sqlcmd.Parameters.AddWithValue("@FechaFin", Filtros.FechaSolFin);
                sqlcmd.Parameters.AddWithValue("@Sprints", sprint);
                sqlcmd.Parameters.AddWithValue("@UsuarioAsignado", asignado);
                sqlcmd.Parameters.AddWithValue("@UsuarioResponsable", responsable);
                sqlcmd.Parameters.AddWithValue("@Fase", tipoactividad);
                sqlcmd.Parameters.AddWithValue("@Clasificacion", clasificacion);
                sqlcmd.Parameters.AddWithValue("@Prioridad", prioridad);
                sqlcmd.Parameters.AddWithValue("@WorkFlow", estatus);


                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
                da.Fill(ds);
                da.Dispose();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();

                LstActividades = (from row in ds.Tables[0].AsEnumerable()
                                  select (
                                  new ActividadesModel
                                  {
                                      IdActividad = long.Parse(row["IdActividad"].ToString()),
                                      IdActividadStr = row["IdActividadStr"].ToString(),
                                      IdProyecto = long.Parse(row["IdProyecto"].ToString()),
                                      Estatus = row["Estatus"].ToString(),
                                      EstatusStr = row["EstatusStr"].ToString(),
                                      Descripcion = row["Descripcion"].ToString(),
                                      TipoActividadStr = row["TipoActividad"].ToString(),
                                      ClasificacionStr = row["Clasificacion"].ToString(),
                                      PrioridadId  = row["PrioridadId"].ToString() == "" ? (long?) null :  long.Parse(row["PrioridadId"].ToString()),
                                      PrioridadStr = row["PrioridadStr"].ToString(),
                                      AsignadoStr = row["Asignado"].ToString(),
                                      ResponsableStr = row["Responsable"].ToString(),
                                      AsignadoPath = "/Archivos/Fotos/" +row["CveAsignado"].ToString() + ".jpg",
                                      ResponsablePath = "/Archivos/Fotos/" + row["CveResponsable"].ToString() + ".jpg",
                                      ProyectoStr = row["Proyecto"].ToString(),
                                      FechaCreo = DateTime.Parse(row["FechaCreo"].ToString()),
                                      FechaInicio = row["FechaInicio"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaInicio"].ToString()),
                                      FechaSolicitado = row["FechaSolicitado"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaSolicitado"].ToString()),
                                      FechaCierre = row["FechaCierre"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaCierre"].ToString()),
                                      FechaRevision = row["FechaRevision"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaRevision"].ToString()),
                                      FechaLiberacion = row["FechaLiberacion"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaLiberacion"].ToString()),
                                      HorasFacturables = row["HorasFacturables"].ToString() == "" ? (decimal?)null : Convert.ToDecimal(row["HorasFacturables"].ToString()),
                                      HorasAsignadas = row["HorasAsignadas"].ToString() == "" ? (decimal?)null : Convert.ToDecimal(row["HorasAsignadas"].ToString()),
                                      HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),
                                      FechaTermino = row["FechaTermino"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaTermino"].ToString()),
                                      MotivoRechazoId = row["MotivoRechazoId"].ToString() == "" ? (long?)null : long.Parse(row["MotivoRechazoId"].ToString()),
                                      DescripcionRechazo = row["DescripcionRechazo"].ToString(),
                                      ClaveTipoActividad = row["ClaveTipoActividad"].ToString(),
                                      ClaveUsuario = row["CveAsignado"].ToString(),
                                      ClaveResponsable = row["CveResponsable"].ToString(),
                                      Sprint = row["Sprint"].ToString(),
                                      ClaveClasificacionActividad = row["ClaveClasificacionActividad"].ToString(),
                                      TipoId = byte.Parse(row["TipoId"].ToString()),
                                      TipoActividadId = long.Parse(row["TipoActividadId"].ToString()),
                                      ClasificacionId = row["ClasificacionId"].ToString() == "" ? (long?)null : long.Parse(row["ClasificacionId"].ToString()),
                                      PSP = int.Parse(row["PSP"].ToString()),
                                      BR = row["BR"].ToString(),
                                      TipoNombre = row["TipoNombre"].ToString(),
                                      TipoUrl = row["TipoUrl"].ToString(),
                                      IdWorkFlow = long.Parse(row["IdWorkFlow"].ToString()),
                                      IdUsuarioAsignado = row["IdUsuarioAsignado"].ToString() == "" ? (long?)null : long.Parse(row["IdUsuarioAsignado"].ToString()),
                                      IdUsuarioResponsable = row["IdUsuarioResponsable"].ToString() == "" ? (long?)null : long.Parse(row["IdUsuarioResponsable"].ToString()),
                                      Puntos = row["Puntos"].ToString() == "" ? 0 : int.Parse(row["Puntos"].ToString()),
                                      IdIteracion = row["IdIteracion"].ToString() == "" ? (long?)null : long.Parse(row["IdIteracion"].ToString()),
                                      WorkFlow = row["WorkFlow"].ToString(),
                                      ColorW = row["ColorW"].ToString(),
                                      Prioridad = 0,
                                      HU= row["HU"].ToString(),
                                      ColorTexto = row["ColorTexto"].ToString()


                                  })).OrderBy(o => o.FechaSolicitado).ToList();


                return LstActividades;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public int ActualizaEstatusWF(ActividadesModel A, string Conexion, long IdUsuario, ref ActividadesModel Act) {
            try
            {


                using (var contexto = new BDProductividad_DEVEntities(Conexion)) {

             
                    var act = contexto.Actividad.Where(w=> w.IdActividad == A.IdActividad).FirstOrDefault();
                    var wfAnt = contexto.WorkFlow.Where(w => w.IdWorkFlow == act.IdWorkflow).FirstOrDefault().Nombre;
                    var wf = contexto.WorkFlow.Where(w=> w.IdWorkFlow == A.IdWorkFlow).FirstOrDefault();
                   
                   


                    act.IdWorkflow = A.IdWorkFlow;
                    act.Estatus = wf.EstatusR;

                    contexto.SaveChanges();

                    ActividadLog actlog = new ActividadLog();
                    actlog.IdActividad = A.IdActividad;
                    actlog.Descripcion = "Actualizo el item de " + wfAnt  +  " a " + wf.Nombre + " desde el tablero." ;
                    actlog.IdUCreo = IdUsuario;
                    actlog.FechaHora = DateTime.Now;

                    GuardaActividadLog(actlog, Conexion);



                    if (wf.TipoNotificacion != 0)
                    {
                        Act.IdActividad = A.IdActividad;
                        Act.ClaveProyecto = act.Proyecto.Clave;
                        Act.TipoNombre=   act.ActividadTipo.Nombre;
                        Act.BR = act.BR;
                        Act.CorreoAsignado = contexto.Usuario.Where(w => w.IdUsuario == act.IdUsuarioAsignado).FirstOrDefault() == null ? contexto.Usuario.Where(w => w.IdUsuario == act.Proyecto.IdULider).FirstOrDefault().Correo : contexto.Usuario.Where(w => w.IdUsuario == act.IdUsuarioAsignado).FirstOrDefault().Correo;
                        Act.CorreoResponsable = contexto.Usuario.Where(w => w.IdUsuario == act.IdUsuarioAsignado).FirstOrDefault() == null ? contexto.Usuario.Where(w => w.IdUsuario == act.Proyecto.IdULider).FirstOrDefault().Correo : contexto.Usuario.Where(w => w.IdUsuario == act.IdUsuarioAsignado).FirstOrDefault().Correo;
                        Act.CorreoLider = contexto.Usuario.Where(w => w.IdUsuario == act.Proyecto.IdULider).FirstOrDefault().Correo;
                        Act.TipoId = (byte?) wf.TipoNotificacion;
                        Act.AsignadoStr = wf.Nombre;
                        Act.ResponsableStr = wfAnt;
                       

                    }

                }

                return 1;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        
        }

        public bool ActualizaUsuarioAsignad(ActividadesModel A,long IdUsuario, string Conexion) {
            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion)) { 
                
                 var act = contexto.Actividad.Where(w=>w.IdActividad == A.IdActividad).FirstOrDefault();
                    var ua = contexto.Usuario.Where(w => w.IdUsuario == A.IdUsuarioAsignado).FirstOrDefault();

                    act.IdUsuarioAsignado = A.IdUsuarioAsignado;

                    contexto.SaveChanges();


                    ActividadLog actlog = new ActividadLog();
                    actlog.IdActividad = A.IdActividad;
                    actlog.Descripcion = "Asignó el item a " + ua.Nombre +  " "  + ua.ApPaterno +" desde el tablero.";
                    actlog.IdUCreo = IdUsuario;
                    actlog.FechaHora = DateTime.Now;

                    GuardaActividadLog(actlog, Conexion);


                }

                return true;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        
        }
        public bool ActualizaFechas(ActividadesModel A, long IdUsuario, string Conexion)
        {
            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    var act = contexto.Actividad.Where(w => w.IdActividad == A.IdActividad).FirstOrDefault();

                    act.FechaInicio = A.FechaInicio;
                    act.FechaSolicitado = A.FechaSolicitado;

                    contexto.SaveChanges();


                    ActividadLog actlog = new ActividadLog();
                    actlog.IdActividad = A.IdActividad;
                    actlog.Descripcion = "Cambio las fechas de inicio y fin a " + A.FechaInicio.ToString() + " al " + A.FechaSolicitado.ToString() + " desde el tablero.";
                    actlog.IdUCreo = IdUsuario;
                    actlog.FechaHora = DateTime.Now;

                    GuardaActividadLog(actlog, Conexion);


                }

                return true;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }


        public bool ActualizarCampoActividad(long IdActividad, string campo, object nuevoValor,long IdUsuario,  string Conexion)
        {
            try
            {
                // Busca la entidad Actividad por su ID
                string campoguardado = string.Empty;

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    var actividad = contexto.Actividad.Where(w=> w.IdActividad == IdActividad).FirstOrDefault();
                
                    if (actividad == null)
                        return false;


                    if (campo == "BR")
                    {

                        actividad.BR = nuevoValor.ToString();
                        campoguardado = "Descripción";


                    }
                    else if (campo == "IdUsuarioAsignado")
                    {

                        actividad.IdUsuarioAsignado = long.Parse(nuevoValor.ToString());
                        campoguardado = "Usuario asignado";

                    }
                    else if (campo == "IdIteracion")
                    {

                        actividad.IdIteracion = long.Parse(nuevoValor.ToString());
                        campoguardado = "Sprint";

                    }
                    else if (campo == "HorasFacturables")
                    {

                        actividad.HorasFacturables = decimal.Parse(nuevoValor.ToString());
                        campoguardado = "Horas estimadas";

                    }
                    else if (campo == "HorasAsignadas")
                    {

                        actividad.HorasAsignadas = decimal.Parse(nuevoValor.ToString());
                        campoguardado = "Horas asignadas";

                    }
                    else if (campo == "Prioridad")
                    {

                        actividad.PrioridadId = long.Parse(nuevoValor.ToString());
                        campoguardado = "Prioridad";

                    }
                    else if (campo == "Puntos") {

                        actividad.Puntos = int.Parse(nuevoValor.ToString());
                        campoguardado = "Puntos";
                    }
                    else if (campo == "Estatus")
                    {

                        actividad.IdWorkflow = long.Parse(nuevoValor.ToString());
                        campoguardado = "Estatus";
                    }
                    else if (campo == "Responsable")
                    {

                        actividad.IdUsuarioResponsable = long.Parse(nuevoValor.ToString());
                        campoguardado = "Responsable";
                    }
                    else if (campo == "Fase")
                    {

                        actividad.TipoActividadId = long.Parse(nuevoValor.ToString());
                        campoguardado = "Fase";
                    }
                    else if (campo == "Clasificacion")
                    {

                        actividad.ClasificacionId = long.Parse(nuevoValor.ToString());
                        campoguardado = "Clasificacion";
                    }
                    else if (campo == "Tipo")
                    {

                        actividad.TipoId = byte.Parse(nuevoValor.ToString());
                        campoguardado = "Tipo";
                    }








                    contexto.SaveChanges();

                }

                ActividadLog actlog = new ActividadLog();
                actlog.IdActividad = IdActividad;
                actlog.Descripcion = "Actualizo el dato de " + campoguardado;
                actlog.IdUCreo = IdUsuario;
                actlog.FechaHora = DateTime.Now;

                GuardaActividadLog(actlog, Conexion);

                return true;
            }
            catch (Exception ex)
            {
                // Manejo de errores (log o acciones necesarias)
                Console.WriteLine($"Error al actualizar el campo: {ex.Message}");
                return false;
            }
        }

        public bool ActualizacionMasivaActividades(List<int> Actividades,int Tipo,  long IdNuevo, long IdUsuario, string Conexion) {
            try
            {

                var actividades = string.Join<string>(",", Actividades.ConvertAll(s => s.ToString()));

                SqlConnection connection = new SqlConnection(Conexion);
                connection.Open();
                SqlCommand command = new SqlCommand("spActualizacionMasivaAct", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };


                command.Parameters.AddWithValue("@Tipo", Tipo);
                command.Parameters.AddWithValue("Actividades", actividades);
                command.Parameters.AddWithValue("@IdNuevo", IdNuevo);
                command.Parameters.AddWithValue("@IdUsuario", IdUsuario);


                command.ExecuteNonQuery();
                command.Connection.Close();
                command.Connection.Dispose();
                command.Dispose();
                connection.Close();


                return true;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        
        
        }

        public bool ActualizacionMasivaFechas(List<int> Actividades, DateTime? FechaInicio, DateTime? FechaSolicitado, long IdUsuario, string Conexion)
        {
            try
            {

                var actividades = string.Join<string>(",", Actividades.ConvertAll(s => s.ToString()));

                SqlConnection connection = new SqlConnection(Conexion);
                connection.Open();
                SqlCommand command = new SqlCommand("spActualizacionMasivaFechas", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };


                command.Parameters.AddWithValue("Actividades", actividades);
                command.Parameters.AddWithValue("@FechaInicio", FechaInicio);
                command.Parameters.AddWithValue("@FechaSolicitado", FechaSolicitado);
                command.Parameters.AddWithValue("@IdUsuario", IdUsuario);


                command.ExecuteNonQuery();
                command.Connection.Close();
                command.Connection.Dispose();
                command.Dispose();
                connection.Close();


                return true;

            }
            catch (Exception ex)
            {

                throw ex;
            }


        }

        public long GuardarActividadLista(ActividadesModel ActividadModel, long IdUsuario,  string Conexion) {

            try
            {

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    //contexto.Configuration.LazyLoadingEnabled = false;
                    Actividad act = new Actividad();




                    act.IdUsuarioAsignado = ActividadModel.IdUsuarioAsignado;
                    act.Descripcion = ActividadModel.Descripcion;
                    act.DocumentoRef = ActividadModel.DocumentoRef;
                    act.Estatus = "A";
                    act.BR = ActividadModel.BR;
                    act.TiempoEjecucion = ActividadModel.TiempoEjecucion;
                    act.HorasFacturables = ActividadModel.HorasFacturables;
                    act.HorasAsignadas = ActividadModel.HorasAsignadas;
                    act.IdProyecto = ActividadModel.IdProyecto;
                    act.TipoActividadId = ActividadModel.TipoActividadId == 0 ? -1 : ActividadModel.TipoActividadId ;
                    act.ClasificacionId = ActividadModel.ClasificacionId;
                    act.IdUsuarioResponsable = ActividadModel.IdUsuarioResponsable;
                    act.FechaInicio = ActividadModel.FechaInicio;
                    act.FechaSolicitado = ActividadModel.FechaSolicitado;
                    act.Planificada = ActividadModel.Planificada;
                    act.Prioridad = ActividadModel.Prioridad;
                    act.IdIteracion = ActividadModel.IdIteracion == -1 ? null : ActividadModel.IdIteracion;
                    //act.IdActividadRef = ActividadModel.IdActividadRef;
                    act.EstatusCte = "P";
                    act.IdUCreo = IdUsuario;
                    act.FechaCreo = DateTime.Now;
                    act.Retrabajo = ActividadModel.Retrabajo;
                    act.Critico = ActividadModel.Critico;
                    act.TipoId = ActividadModel.TipoId;
                    act.CriterioAceptacion = ActividadModel.CriterioAceptacion;
                    act.PrioridadId = ActividadModel.PrioridadId;
                    act.Puntos = ActividadModel.Puntos;
                    //act.IdWorkflow = ActividadModel.IdWorkFlow;

                    act.IdWorkflow = ActividadModel.IdWorkFlow == 0 ? contexto.WorkFlow.Where(w => w.IdProyecto == ActividadModel.IdProyecto && w.IdActividadTipo == ActividadModel.TipoId && w.EstatusR == "A").FirstOrDefault().IdWorkFlow : ActividadModel.IdWorkFlow;

                    if (ActividadModel.TipoActividadId == FasePSP.Bug && ActividadModel.IdActividadRef > 0)
                    {
                        var actividades = new CD_CatalogoGeneral().ObtenerActividadesQA(ActividadModel.IdProyecto, Conexion).Select(x => x.IdCatalogo).ToList();
                        if (actividades.Contains(Convert.ToInt64(ActividadModel.IdActividadRef)))

                            act.IdActividadRef = ActividadModel.IdActividadRef;
                        //throw new Exception("La actividad de referencia no corresponde al proyecto seleccionado");

                        act.IdActividadRef = ActividadModel.IdActividadRef;
                    }

                    act.IdListaRevision = ActividadModel.IdListaRevision;
                  //  act.IdWorkflow = contexto.WorkFlow.Where(w => w.IdProyecto == ActividadModel.IdProyecto && w.IdActividadTipo == ActividadModel.TipoId && w.EstatusR == "A").FirstOrDefault().IdWorkFlow;

                    if (ActividadModel.IdListaRevision > 0)
                    {
                        //var confirmar = contexto.ListaRevision
                        //    .Where(x => x.IdProyecto == ActividadModel.IdProyecto
                        //    && x.CatalogoFaseId == ActividadModel.TipoActividadId
                        //    && x.CatalogoClasificacionId == ActividadModel.ClasificacionId)
                        //    .Select(x => x.IdListaRevision)
                        //    .ToList();

                        //if (!confirmar.Contains(ActividadModel.IdListaRevision ?? 0))
                        //    throw new Exception("El número de lista de revisión no es correcto");

                        var controles = contexto.ListaRevisionDetalle
                            .Where(x => x.IdListaRevision == ActividadModel.IdListaRevision && x.Activo == true)
                            .ToList()
                            .Select(x => new ActividadListaRevision
                            {
                                IdActividad = act.IdActividad,
                                FechaCreo = DateTime.Now,
                                IdListaRevisionDetalle = x.IdListaRevisionDetalle,
                                IdUCreo = IdUsuario
                            }).ToList();

                        act.IdActividadRef = ActividadModel.IdActividadRef;

                        contexto.ActividadListaRevision.AddRange(controles);
                    }

                    List<ActividadesValidacionModel> Validaciones = contexto.Autorizacion.Where(i => i.Tipo == 1 && i.Activo == true)
                                       .Select(s => new ActividadesValidacionModel
                                       {
                                           IdActividad = act.IdActividad,
                                           IdAutorizacion = s.IdAutorizacion,
                                           NombreAut = s.Nombre,
                                           Estatus = "P",
                                           Secuencia = s.Secuencia
                                       }).ToList();



                    ActividadValidaciones a;
                    List<ActividadValidaciones> lstact = new List<ActividadValidaciones>();
                    foreach (var actval in Validaciones)
                    {

                        a = new ActividadValidaciones();
                        a.IdAutorizacion = actval.IdAutorizacion;
                        a.NombreAut = actval.NombreAut;
                        a.Estatus = actval.Estatus;
                        a.Secuencia = actval.Secuencia;

                        lstact.Add(a);

                    }


                    //Inserto las fases 
                    TimeSpan trabajado = TimeSpan.Parse("00:00:00.000");
                    List<ActividadTrackingModel> LstTrck = contexto.TipoActividadFase.Where(w => w.TipoActividadId == act.TipoActividadId).
                                              Select(s => new ActividadTrackingModel
                                              {
                                                  IdFase = s.IdFase,
                                                  Nombre = s.Nombre,
                                                  Porcentaje = s.Porcentaje,
                                                  Trabajado = trabajado,
                                                  Orden = s.Orden,
                                                  Finalizado = false

                                              }).ToList();

                    ActividadTracking t;
                    List<ActividadTracking> lstt = new List<ActividadTracking>();
                    foreach (var acttra in LstTrck)
                    {

                        t = new ActividadTracking();

                        t.IdFase = acttra.IdFase;
                        t.Nombre = acttra.Nombre;
                        t.Porcentaje = acttra.Porcentaje;
                        t.Trabajado = TimeSpan.Parse("00:00:00.000");
                        t.Orden = acttra.Orden;
                        t.Finalizado = false;
                        lstt.Add(t);

                    }


                    act.ActividadValidaciones = lstact;
                    act.ActividadTracking = lstt;

                    contexto.Actividad.Add(act);
                    contexto.SaveChanges();

                    if (ActividadModel.IdListaRevision != null && ActividadModel.IdListaRevision > 0)
                    {
                        var actividades =
                            (from A in contexto.Actividad
                             join CG in contexto.CatalogoGeneral on A.TipoActividadId equals CG.IdCatalogo
                             where new[] { "R", "L" }.Contains(A.Estatus) && A.IdProyecto == act.IdProyecto && A.TipoActividadId == act.TipoActividadId
                             && A.ClasificacionId == act.ClasificacionId && A.IdListaRevision == null
                             select A.IdActividad).ToList();

                        //if (act.IdActividadRef <= 0)
                        //    throw new Exception("La actividad de referencia es obligatoria");


                        //if (act.IdActividadRef >= 0)
                        //{
                        //    //if (!actividades.Contains(ActividadModel.IdActividadRef))
                        //    //    throw new Exception("La actividad de referencia no es valida");


                        //    if (!contexto.ActividadDependencia.Any(x => x.IdActividadD == act.IdActividad && x.IdActividad == ActividadModel.IdActividadRef))
                        //        contexto.ActividadDependencia.Add(new ActividadDependencia
                        //        {
                        //            IdActividad = ActividadModel.IdActividadRef,
                        //            IdActividadD = act.IdActividad
                        //        });

                        //}

                        contexto.SaveChanges();
                    }




                    //Inserto la relacion si viene el dato

                    if (ActividadModel.IdActividadR1 != 0)
                    {

                        ActividadRelacion arel = new ActividadRelacion();

                        arel.IdActividad = act.IdActividad;
                        arel.IdActividadRelacionada = ActividadModel.IdActividadR1;

                        contexto.ActividadRelacion.Add(arel);
                        contexto.SaveChanges();
                    }

                    ActividadLog actlog = new ActividadLog();
                    actlog.IdActividad = act.IdActividad;
                    actlog.Descripcion = "Generó WorkItem";
                    actlog.IdUCreo = IdUsuario;
                    actlog.FechaHora = DateTime.Now;

                    GuardaActividadLog(actlog, Conexion);

                    return act.IdActividad;
                }


            }
            catch (Exception ex)
            {

                throw ex;
            }
        
        }


        public bool ActualizaRelacionesBL(long? IdRelOrigen, long? IdRelDestino, long IdActividad, string Conexion) {

            try
            {
                if (IdRelOrigen == IdRelDestino)  // No Cambiaron las relaciones se mantuvo igual
                {
                    return true;
                
                }


                using (var contexto = new BDProductividad_DEVEntities(Conexion)) {


                    if (IdRelOrigen != null) {
                        var relacionquitar = contexto.ActividadRelacion.Where(w => w.IdActividad == IdActividad && w.IdActividadRelacionada == IdRelOrigen).FirstOrDefault();

                        if (relacionquitar != null) {
                            contexto.ActividadRelacion.Remove(relacionquitar);
                        }
                       
                    }

                    if (IdRelDestino != null) {

                        ActividadRelacion ar = new ActividadRelacion();
                        ar.IdActividad = IdActividad;
                        ar.IdActividadRelacionada = long.Parse(IdRelDestino.ToString());


                        contexto.ActividadRelacion.Add(ar);
                    
                    }

                    contexto.SaveChanges();

                }

                return true;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        
        }
        #endregion

    }
}
