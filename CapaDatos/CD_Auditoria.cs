using CapaDatos.DataBaseModel;
using CapaDatos.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos
{
    public class CD_Auditoria
    {
        public List<CatalogoGeneralModel> LeerComboAuditor(string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var usuarios =
                    (from AC in contexto.AuditoriaControl
                     join U in contexto.Usuario on AC.IdUAuditor equals U.IdUsuario
                     select new CatalogoGeneralModel
                     {
                         IdCatalogo = (int)AC.IdUAuditor,
                         DescCorta = U.NumEmpleado,
                         DescLarga = U.Nombre + " " + U.ApPaterno + " " + U.ApMaterno
                     }).Distinct().ToList();

                return usuarios;
            }
        }

        public List<AuditoriaModel> LeerAuditoria(string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var listaAuditorias =
                    (from A in contexto.Auditoria
                     join PLC in contexto.ProyectoListaControl on A.IdProyectoListaControl equals PLC.IdProyectoListaControl
                     join P in contexto.Proyecto on PLC.IdProyecto equals P.IdProyecto
                     join LC in contexto.ListaControl on PLC.IdListaControl equals LC.IdListaControl
                     join PR in contexto.CatalogoGeneral on LC.CatalogoFaseId equals PR.IdCatalogo
                     join SP in contexto.CatalogoGeneral on LC.CatalogoClasificacionId equals SP.IdCatalogo
                     select new AuditoriaModel
                     {
                         IdAuditoria = A.IdAuditoria,
                         NoAuditoria = A.NoAuditoria,
                         IdEstatus = A.IdEstatus,
                         FechaInicio = A.FechaInicio,
                         FechaFin = A.FechaFin,
                         ProyectoListaControl = new ProyectoListaControlModel
                         {
                             ListaControl = new ListaControlModel
                             {
                                 Nombre = LC.Nombre,
                                 Proceso = new CatalogoGeneralModel { DescLarga = PR.DescLarga },
                                 Subproceso = new CatalogoGeneralModel { DescLarga = SP.DescLarga }
                             },
                             Proyecto = new ProyectosModel
                             {
                                 Nombre = P.Nombre
                             }
                         },
                         UsuarioAuditor =
                            (from AC in contexto.AuditoriaControl
                             join U in contexto.Usuario on AC.IdUAuditor equals U.IdUsuario
                             where AC.IdAuditoria == A.IdAuditoria &&
                                 contexto.ProyectoListaControlDetalle
                                 .Where(x => x.IdProyectoListaControl == PLC.IdProyectoListaControl)
                                 .Select(x => x.IdProyectoListaControlDetalle).ToList().Contains(AC.IdProyectoListaControlDetalle)
                             select new UsuarioModel
                             {
                                 NombreCompleto = U.Nombre + " " + U.ApPaterno + " " + U.ApMaterno,
                                 NumEmpleado = U.NumEmpleado
                             }).Distinct().ToList(),
                         AuditoriaControl =
                         (from AC in contexto.AuditoriaControl
                          join PLCD in contexto.ProyectoListaControlDetalle on AC.IdProyectoListaControlDetalle equals PLCD.IdProyectoListaControlDetalle
                          where AC.IdAuditoria == A.IdAuditoria && PLCD.IdProyectoListaControl == PLC.IdProyectoListaControl && PLCD.Activo == true
                          select new AuditoriaControlModel
                          {
                              IdAuditoria = AC.IdAuditoria,
                              IdAuditoriaControl = AC.IdAuditoriaControl,
                              Cumple = AC.Cumple
                          }).ToList(),
                         AuditoriaControlHallazgo =
                            (from ACB in contexto.AuditoriaControl
                             join PLCD in contexto.ProyectoListaControlDetalle on ACB.IdProyectoListaControlDetalle equals PLCD.IdProyectoListaControlDetalle
                             join ACH in contexto.AuditoriaControlHallazgo on ACB.IdAuditoriaControl equals ACH.IdAuditoriaControl
                             where A.IdAuditoria == ACB.IdAuditoria && PLCD.Activo == true
                             select new AuditoriaControlHallazgoModel
                             {
                                 IdAuditoriaControlHallazgo = ACH.IdAuditoriaControlHallazgo,
                                 IdAuditoriaControl = ACB.IdAuditoriaControl,
                                 Gravedad = ACH.Gravedad,
                                 Activo = ACH.Activo
                             }).ToList()
                     }).ToList();

                return listaAuditorias;
            }
        }

        public List<AuditoriaModel> LeerAuditoria(AuditoriaFiltroModel filtros, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var listaAuditorias =
                    (from A in contexto.Auditoria
                     join PLC in contexto.ProyectoListaControl on A.IdProyectoListaControl equals PLC.IdProyectoListaControl
                     join P in contexto.Proyecto on PLC.IdProyecto equals P.IdProyecto
                     join LC in contexto.ListaControl on PLC.IdListaControl equals LC.IdListaControl
                     join PR in contexto.CatalogoGeneral on LC.CatalogoFaseId equals PR.IdCatalogo
                     join SP in contexto.CatalogoGeneral on LC.CatalogoClasificacionId equals SP.IdCatalogo
                     where
                     ((A.FechaInicio >= filtros.FechaInicio_1 && A.FechaInicio <= filtros.FechaInicio_2) || (filtros.FechaInicio_1 == null && filtros.FechaInicio_2 == null)) &&
                     ((A.FechaFin >= filtros.FechaFin_1 && A.FechaFin <= filtros.FechaFin_2) || (filtros.FechaFin_1 == null && filtros.FechaFin_2 == null)) &&
                     (contexto.AuditoriaControl.Where(x => x.IdUAuditor != null && filtros.UsuariosAuditories.Contains((long)x.IdUAuditor)).Select(x => x.IdAuditoria).ToList().Contains(A.IdAuditoria) || filtros.UsuariosAuditories.Count == 0) &&
                     (filtros.Proyectos.Contains(P.IdProyecto) || filtros.Proyectos.Count == 0) &&
                     (filtros.Estatus.Contains(A.IdEstatus) || filtros.Estatus.Count == 0)
                     select new AuditoriaModel
                     {
                         IdAuditoria = A.IdAuditoria,
                         NoAuditoria = A.NoAuditoria,
                         IdEstatus = A.IdEstatus,
                         FechaInicio = A.FechaInicio,
                         FechaFin = A.FechaFin,
                         ProyectoListaControl = new ProyectoListaControlModel
                         {
                             ListaControl = new ListaControlModel
                             {
                                 Nombre = LC.Nombre,
                                 Proceso = new CatalogoGeneralModel { DescLarga = PR.DescLarga },
                                 Subproceso = new CatalogoGeneralModel { DescLarga = SP.DescLarga }
                             },
                             Proyecto = new ProyectosModel
                             {
                                 Nombre = P.Nombre
                             }
                         },
                         UsuarioAuditor =
                            (from AC in contexto.AuditoriaControl
                             join U in contexto.Usuario on AC.IdUAuditor equals U.IdUsuario
                             where AC.IdAuditoria == A.IdAuditoria &&
                                 contexto.ProyectoListaControlDetalle
                                 .Where(x => x.IdProyectoListaControl == PLC.IdProyectoListaControl)
                                 .Select(x => x.IdProyectoListaControlDetalle).ToList().Contains(AC.IdProyectoListaControlDetalle)
                             select new UsuarioModel
                             {
                                 NombreCompleto = U.Nombre + " " + U.ApPaterno + " " + U.ApMaterno,
                                 NumEmpleado = U.NumEmpleado
                             }).Distinct().ToList(),
                         AuditoriaControl =
                         (from AC in contexto.AuditoriaControl
                          join PLCD in contexto.ProyectoListaControlDetalle on AC.IdProyectoListaControlDetalle equals PLCD.IdProyectoListaControlDetalle
                          where AC.IdAuditoria == A.IdAuditoria && PLCD.IdProyectoListaControl == PLC.IdProyectoListaControl && PLCD.Activo == true
                          select new AuditoriaControlModel
                          {
                              IdAuditoria = AC.IdAuditoria,
                              IdAuditoriaControl = AC.IdAuditoriaControl,
                              Cumple = AC.Cumple
                          }).ToList(),
                         AuditoriaControlHallazgo =
                            (from ACB in contexto.AuditoriaControl
                             join PLCD in contexto.ProyectoListaControlDetalle on ACB.IdProyectoListaControlDetalle equals PLCD.IdProyectoListaControlDetalle
                             join ACH in contexto.AuditoriaControlHallazgo on ACB.IdAuditoriaControl equals ACH.IdAuditoriaControl
                             where A.IdAuditoria == ACB.IdAuditoria && PLCD.Activo == true
                             select new AuditoriaControlHallazgoModel
                             {
                                 IdAuditoriaControlHallazgo = ACH.IdAuditoriaControlHallazgo,
                                 IdAuditoriaControl = ACB.IdAuditoriaControl,
                                 Gravedad = ACH.Gravedad,
                                 Activo = ACH.Activo
                             }).ToList()
                     }).ToList();

                return listaAuditorias;
            }
        }

        public AuditoriaModel LeerAuditoria(int idAuditoria, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var listaAuditorias =
                    (from A in contexto.Auditoria
                     join PLC in contexto.ProyectoListaControl on A.IdProyectoListaControl equals PLC.IdProyectoListaControl
                     join P in contexto.Proyecto on PLC.IdProyecto equals P.IdProyecto
                     join LC in contexto.ListaControl on PLC.IdListaControl equals LC.IdListaControl
                     join PR in contexto.CatalogoGeneral on LC.CatalogoFaseId equals PR.IdCatalogo
                     join SP in contexto.CatalogoGeneral on LC.CatalogoClasificacionId equals SP.IdCatalogo
                     where A.IdAuditoria == idAuditoria
                     select new AuditoriaModel
                     {
                         IdAuditoria = A.IdAuditoria,
                         IdProyectoListaControl = A.IdProyectoListaControl,
                         NoAuditoria = A.NoAuditoria,
                         IdEstatus = A.IdEstatus,
                         FechaInicio = A.FechaInicio,
                         FechaFin = A.FechaFin,
                         Comentarios = A.Comentarios,
                         ProyectoListaControl = new ProyectoListaControlModel
                         {
                             IdProyectoListaControl = PLC.IdProyectoListaControl,
                             IdProyecto = PLC.IdProyecto,
                             ListaControl = new ListaControlModel
                             {
                                 Nombre = LC.Nombre,
                                 Proceso = new CatalogoGeneralModel { DescLarga = PR.DescLarga },
                                 Subproceso = new CatalogoGeneralModel { DescLarga = SP.DescLarga }
                             },
                             Proyecto = new ProyectosModel
                             {
                                 IdProyecto = P.IdProyecto,
                                 IdULider = P.IdULider,
                                 Nombre = P.Nombre
                             }
                         },
                     }).FirstOrDefault();

                return listaAuditorias;
            }
        }

        public List<AuditoriaControlModel> LeerAuditoriaControl(int idAuditoria, int idProyectoListaControl, long idUsuario, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var estatus = contexto.Auditoria.FirstOrDefault(x => x.IdAuditoria == idAuditoria).IdEstatus;
                if (estatus != "X" && estatus != "F")
                    SincronizarAuditoriaControl(idAuditoria, idProyectoListaControl, idUsuario, conexionEF);

                var auditoriaControles =
                    (from A in contexto.Auditoria
                     join AC in contexto.AuditoriaControl on A.IdAuditoria equals AC.IdAuditoria
                     join PLCD in contexto.ProyectoListaControlDetalle on AC.IdProyectoListaControlDetalle equals PLCD.IdProyectoListaControlDetalle
                     join PLC in contexto.ProyectoListaControl on PLCD.IdProyectoListaControl equals PLC.IdProyectoListaControl
                     where A.IdAuditoria == idAuditoria && PLC.IdProyectoListaControl == idProyectoListaControl && PLCD.Activo == true
                     select new AuditoriaControlModel
                     {
                         IdAuditoriaControl = AC.IdAuditoriaControl,
                         IdAuditoria = A.IdAuditoria,
                         ProyectoListaControlDetalle = new ProyectoListaControlDetalleModel
                         {
                             Control = PLCD.Control
                         },
                         Cumple = AC.Cumple,
                         TotalHallazgos = contexto.AuditoriaControlHallazgo.Count(x => x.IdAuditoriaControl == AC.IdAuditoriaControl && x.Activo == true),
                         AuditoriaControlHallazgo = contexto.AuditoriaControlHallazgo.Where(x => x.IdAuditoriaControl == AC.IdAuditoriaControl && x.Activo == true).Select(x => new AuditoriaControlHallazgoModel
                         {
                             IdAuditoriaControlHallazgo = x.IdAuditoriaControlHallazgo,
                             Corregido = x.Corregido
                         }).ToList(),
                         Usuario = contexto.Usuario.Where(x => x.IdUsuario == AC.IdUAuditor).Select(x => new UsuarioModel
                         {
                             NombreCompleto = x.Nombre + " " + x.ApPaterno + " " + x.ApMaterno,
                             NumEmpleado = x.NumEmpleado
                         }).FirstOrDefault()
                     }).ToList();

                return auditoriaControles;
            }
        }

        public List<AuditoriaControlHallazgoModel> LeerAuditoriaControlHallazgo(int idAuditoria, long idAuditoriaControl, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var hallazgos =
                    (from A in contexto.AuditoriaControlHallazgo
                     join AC in contexto.AuditoriaControl on A.IdAuditoriaControl equals AC.IdAuditoriaControl
                     where AC.IdAuditoria == idAuditoria && A.IdAuditoriaControl == idAuditoriaControl && A.Activo == true
                     select new AuditoriaControlHallazgoModel
                     {
                         IdAuditoriaControlHallazgo = A.IdAuditoriaControlHallazgo,
                         IdAuditoriaControl = A.IdAuditoriaControl,
                         Descripcion = A.Descripcion,
                         Gravedad = A.Gravedad,
                         Corregido = A.Corregido
                     }).ToList();

                return hallazgos;
            }
        }

        public void CrearListaControlCorreo(List<string> correos, int idListaControl, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                foreach (var correo in correos)
                {
                    var _correo = contexto.ListaControlCorreo.Where(x => x.correo == correo && x.IdListaControl == idListaControl).FirstOrDefault();
                    if (_correo == null)
                    {
                        contexto.ListaControlCorreo.Add(new ListaControlCorreo
                        {
                            IdListaControl = idListaControl,
                            correo = correo
                        });
                        contexto.SaveChanges();
                    }
                }
            }
        }

        public (bool Estatus, string Mensaje, AuditoriaModel Auditoria) CrearAuditoria(string conexionEF, long idUsuario)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var nulos = contexto.Auditoria.Where(x => x.IdProyectoListaControl == null);
                var nulosControl = contexto.AuditoriaControl.Where(x => nulos.Select(y => y.IdAuditoria).ToList().Contains(x.IdAuditoria));
                var nulosActividad = contexto.AuditoriaActividadMejora.Where(x => nulos.Select(y => y.IdAuditoria).ToList().Contains(x.IdAuditoria));
                var nulosHallazgo = contexto.AuditoriaControlHallazgo.Where(x => nulosControl.Select(y => y.IdAuditoriaControl).ToList().Contains(x.IdAuditoriaControl));

                contexto.AuditoriaControlHallazgo.RemoveRange(nulosHallazgo);
                contexto.AuditoriaControl.RemoveRange(nulosControl);
                contexto.AuditoriaActividadMejora.RemoveRange(nulosActividad);
                contexto.Auditoria.RemoveRange(nulos);
                contexto.SaveChanges();

                var noAuditoria = NuevoNoAuditoria(conexionEF);

                var auditoria = new Auditoria
                {
                    NoAuditoria = noAuditoria.Trim(),
                    IdEstatus = "P",
                    FechaInicio = DateTime.Now,
                    Comentarios = "",
                    IdUCreo = idUsuario,
                    FechaCreo = DateTime.Now
                };

                contexto.Auditoria.Add(auditoria);
                contexto.SaveChanges();

                return (true, "Los datos se guardaron correctamente.", new AuditoriaModel { IdAuditoria = auditoria.IdAuditoria, NoAuditoria = auditoria.NoAuditoria });
            }
        }

        public (bool Estatus, string Mensaje) EditarAuditoria(AuditoriaModel auditoria, string conexionEF, long idUsuario)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var _auditoria = contexto.Auditoria.FirstOrDefault(x => x.IdAuditoria == auditoria.IdAuditoria);
                if (_auditoria == null) return (false, "Error al crear el registro.");

                if (_auditoria.IdEstatus == "F") return (false, "La auditoria ya ha finalizado");
                if((_auditoria.IdEstatus=="X" 
                    || _auditoria.IdEstatus=="F")
                    && auditoria.IdProyectoListaControl != _auditoria.IdProyectoListaControl)
                    return (false, "No es posible cambiar la lista de control si la auditoria ya se ha Revisado.");

                _auditoria.IdProyectoListaControl = auditoria.IdProyectoListaControl;
                _auditoria.FechaInicio = auditoria.FechaInicio;
                _auditoria.Comentarios = auditoria.Comentarios ?? "";
                _auditoria.IdUModifico = idUsuario;
                _auditoria.FechaModifico = DateTime.Now;

                contexto.SaveChanges();

                return (true, "Los datos se guardaron correctamente.");
            }
        }

        public List<ActividadesModel> LeerAuditoriaActividadMejora(int idAuditoria, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var actividades =
                    (from AA in contexto.AuditoriaActividadMejora
                     join A in contexto.Actividad on AA.IdActividad equals A.IdActividad
                     join P in contexto.Proyecto on A.IdProyecto equals P.IdProyecto
                     join U in contexto.Usuario on A.IdUsuarioResponsable equals U.IdUsuario
                     where AA.IdAuditoria == idAuditoria
                     select new ActividadesModel
                     {
                         IdActividad = A.IdActividad,
                         ProyectoStr = P.Clave,
                         Descripcion = A.Descripcion,
                         Estatus = A.Estatus,
                         FechaSolicitado = A.FechaSolicitado,
                         ResponsableStr = U.NumEmpleado
                     }).ToList();

                return actividades;
            }
        }

        public (bool Estatus, string Mensaje) CrearAuditoriaActividadMejora(long idActividad, int idAuditoria, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var _actividad = contexto.AuditoriaActividadMejora.FirstOrDefault(x => x.IdActividad == idActividad && x.IdAuditoria == idAuditoria);

                if (_actividad == null)
                {
                    var actividad = new AuditoriaActividadMejora
                    {
                        IdActividad = idActividad,
                        IdAuditoria = idAuditoria
                    };

                    contexto.AuditoriaActividadMejora.Add(actividad);
                    contexto.SaveChanges();
                }

                return (true, "Los datos se guardaron correctamente.");
            }
        }

        public (bool Estatus, string Mensaje, List<AuditoriaModel> Auditoria) FinzalizarAuditoria(int idAuditoria, string conexionEF, long idUsuario)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                var auditoria = contexto.Auditoria.FirstOrDefault(x => x.IdAuditoria == idAuditoria);
                if (auditoria == null) return (false, "Error al finalizar la auditoria", null);

                if (auditoria.FechaInicio > DateTime.Now) return (false, "Para finalizar la auditoria modifique la Fecha de inicio", null);

                if (auditoria.IdEstatus == "F") return (false, "La auditoria ya ha finalizado", null);

                var detalle = LeerAuditoriaControl(auditoria.IdAuditoria, (int)auditoria.IdProyectoListaControl, idUsuario, conexionEF);
                if (detalle.Any(x => x.Cumple == null)) return (false, "Debe revisar todos los controles antes de finalizar la auditoria", null);

                auditoria.FechaFin = DateTime.Now;
                auditoria.IdUModifico = idUsuario;
                auditoria.FechaModifico = DateTime.Now;

                if (detalle.Any(x => x.Cumple == false))
                    auditoria.IdEstatus = "X";
                else
                    auditoria.IdEstatus = "F";

                contexto.SaveChanges();
                var auditorias = LeerAuditoria(conexionEF);

                return (true, "Los datos se guardaron correctamente.", auditorias);
            }
        }

        public (bool Estatus, string Mensaje, List<AuditoriaControlModel> AuditoriaControles) ActualizarControlCumple(AuditoriaControlModel auditoria, long idUsuario, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var auditoriaControl = contexto.AuditoriaControl.Where(x => x.IdAuditoria == auditoria.IdAuditoria && x.IdAuditoriaControl == auditoria.IdAuditoriaControl).FirstOrDefault();
                if (auditoriaControl == null) return (false, "Numero de control incorrecto", null);

                var estatus = contexto.Auditoria.FirstOrDefault(x => x.IdAuditoria == auditoria.IdAuditoria).IdEstatus;
                if (estatus == "F") return (false, "La auditoria ya ha finalizado", null);

                if (auditoria.Cumple == true)
                {
                    auditoria.TotalHallazgos = contexto.AuditoriaControlHallazgo.Count(x => x.IdAuditoriaControl == auditoria.IdAuditoriaControl && x.Activo == true && x.Corregido == false);
                    if (auditoria.TotalHallazgos > 0) return (false, "Debe corregir todos los hallazgos para marcar el control como Cumple.", null);
                }

                auditoriaControl.Cumple = auditoria.Cumple;
                auditoriaControl.IdUAuditor = idUsuario;
                auditoriaControl.IdUModifico = idUsuario;
                auditoriaControl.FechaModifico = DateTime.Now;

                contexto.SaveChanges();

                var auditoriaControles = LeerAuditoriaControl(auditoria.IdAuditoria, auditoria.IdProyectoListaControl, idUsuario, conexionEF);

                return (true, "Los datos se guardaron correctamente.", auditoriaControles);
            }
        }

        public (bool Estatus, string Mensaje, List<AuditoriaControlHallazgoModel> Hallazgos) CrearHallazgo(AuditoriaControlHallazgoModel hallazgo, long idUsuario, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                if (hallazgo.IdAuditoriaControlHallazgo != 0) return (false, "Error al crear el registro.", null);

                var estatus = contexto.Auditoria.FirstOrDefault(x => x.IdAuditoria == contexto.AuditoriaControl.FirstOrDefault(y => y.IdAuditoriaControl == hallazgo.IdAuditoriaControl).IdAuditoria).IdEstatus;
                if (estatus == "F") return (false, "La auditoria ya ha finalizado", null);

                var duplicado = contexto.AuditoriaControlHallazgo.Where(x => x.Descripcion == hallazgo.Descripcion && x.IdAuditoriaControl == hallazgo.IdAuditoriaControl && x.Activo == true).Count() > 0;
                if (duplicado) return (false, "Se encuentra repetida la descripción del hallazgo.", null);

                if (!hallazgo.Corregido)
                {
                    var auditoriaControl = contexto.AuditoriaControl.FirstOrDefault(x => x.IdAuditoriaControl == hallazgo.IdAuditoriaControl);
                    auditoriaControl.Cumple = false;
                }

                var _hallazgo = new AuditoriaControlHallazgo
                {
                    IdAuditoriaControl = hallazgo.IdAuditoriaControl,
                    Gravedad = hallazgo.Gravedad,
                    Descripcion = hallazgo.Descripcion,
                    Corregido = hallazgo.Corregido,
                    Activo = true,
                    IdUCreo = idUsuario,
                    FechaCreo = DateTime.Now
                };

                contexto.AuditoriaControlHallazgo.Add(_hallazgo);
                contexto.SaveChanges();

                var hallazgos = LeerAuditoriaControlHallazgo(hallazgo.IdAuditoria, hallazgo.IdAuditoriaControl, conexionEF);

                return (true, "Los datos se guardaron correctamente.", hallazgos);
            }
        }

        public (bool Estatus, string Mensaje, List<AuditoriaControlHallazgoModel> Hallazgos) EditarHallazgo(AuditoriaControlHallazgoModel hallazgo, long idUsuario, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                if (hallazgo.IdAuditoriaControlHallazgo == 0) return (false, "Error al crear el registro.", null);

                var estatus = contexto.Auditoria.FirstOrDefault(x => x.IdAuditoria == contexto.AuditoriaControl.FirstOrDefault(y => y.IdAuditoriaControl == hallazgo.IdAuditoriaControl).IdAuditoria).IdEstatus;
                if (estatus == "F") return (false, "La auditoria ya ha finalizado", null);

                var duplicado = contexto.AuditoriaControlHallazgo.Where(x => x.Descripcion == hallazgo.Descripcion && x.IdAuditoriaControl == hallazgo.IdAuditoriaControl && x.IdAuditoriaControlHallazgo != hallazgo.IdAuditoriaControlHallazgo && x.Activo == true).Count() > 0;
                if (duplicado) return (false, "Se encuentra repetida la descripción del hallazgo.", null);

                if (!hallazgo.Corregido)
                {
                    var auditoriaControl = contexto.AuditoriaControl.FirstOrDefault(x => x.IdAuditoriaControl == hallazgo.IdAuditoriaControl);
                    auditoriaControl.Cumple = false;
                }

                var _hallazgo = contexto.AuditoriaControlHallazgo.Where(x => x.IdAuditoriaControl == hallazgo.IdAuditoriaControl && x.IdAuditoriaControlHallazgo == hallazgo.IdAuditoriaControlHallazgo).FirstOrDefault();

                if (_hallazgo == null) return (false, "Error al crear el registro.", null);
                _hallazgo.Gravedad = hallazgo.Gravedad;
                _hallazgo.Descripcion = hallazgo.Descripcion;
                _hallazgo.Corregido = hallazgo.Corregido;
                _hallazgo.IdUModifico = idUsuario;
                _hallazgo.FechaModifico = DateTime.Now;

                contexto.SaveChanges();

                var hallazgos = LeerAuditoriaControlHallazgo(hallazgo.IdAuditoria, hallazgo.IdAuditoriaControl, conexionEF);

                return (true, "Los datos se guardaron correctamente.", hallazgos);
            }
        }

        public (bool Estatus, string Mensaje, List<AuditoriaControlHallazgoModel> Hallazgos) EliminarHallazgo(AuditoriaControlHallazgoModel hallazgo, long idUsuario, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var _hallazgo = contexto.AuditoriaControlHallazgo.Where(x => x.IdAuditoriaControlHallazgo == hallazgo.IdAuditoriaControlHallazgo && x.IdAuditoriaControl == hallazgo.IdAuditoriaControl).FirstOrDefault();
                if (_hallazgo == null) return (false, "Error al elimniar el registro.", null);

                _hallazgo.Activo = false;
                _hallazgo.IdUModifico = idUsuario;
                _hallazgo.FechaModifico = DateTime.Now;

                contexto.SaveChanges();

                var hallazgos = LeerAuditoriaControlHallazgo(hallazgo.IdAuditoria, hallazgo.IdAuditoriaControl, conexionEF);

                return (true, "El registro se elimino correctamente.", hallazgos);
            }
        }

        public List<AuditoriaModel> LeerAuditoriaDescarga(List<int> _listaAuditorias, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var listaAuditorias =
                    (from A in contexto.Auditoria
                     join PLC in contexto.ProyectoListaControl on A.IdProyectoListaControl equals PLC.IdProyectoListaControl
                     join P in contexto.Proyecto on PLC.IdProyecto equals P.IdProyecto
                     join LC in contexto.ListaControl on PLC.IdListaControl equals LC.IdListaControl
                     join PR in contexto.CatalogoGeneral on LC.CatalogoFaseId equals PR.IdCatalogo
                     join SP in contexto.CatalogoGeneral on LC.CatalogoClasificacionId equals SP.IdCatalogo
                     where _listaAuditorias.Contains(A.IdAuditoria)
                     select new AuditoriaModel
                     {
                         IdAuditoria = A.IdAuditoria,
                         NoAuditoria = A.NoAuditoria,
                         IdEstatus = A.IdEstatus,
                         FechaInicio = A.FechaInicio,
                         FechaFin = A.FechaFin,
                         ProyectoListaControl = new ProyectoListaControlModel
                         {
                             ListaControl = new ListaControlModel
                             {
                                 Nombre = LC.Nombre,
                                 Proceso = new CatalogoGeneralModel { DescLarga = PR.DescLarga },
                                 Subproceso = new CatalogoGeneralModel { DescLarga = SP.DescLarga }
                             },
                             Proyecto = new ProyectosModel
                             {
                                 Nombre = P.Nombre
                             }
                         },
                         UsuarioAuditor =
                            (from AC in contexto.AuditoriaControl
                             join U in contexto.Usuario on AC.IdUAuditor equals U.IdUsuario
                             where AC.IdAuditoria == A.IdAuditoria &&
                                 contexto.ProyectoListaControlDetalle
                                 .Where(x => x.IdProyectoListaControl == PLC.IdProyectoListaControl)
                                 .Select(x => x.IdProyectoListaControlDetalle).ToList().Contains(AC.IdProyectoListaControlDetalle)
                             select new UsuarioModel
                             {
                                 NombreCompleto = U.Nombre + " " + U.ApPaterno + " " + U.ApMaterno,
                                 NumEmpleado = U.NumEmpleado
                             }).Distinct().ToList(),
                         AuditoriaControl =
                             contexto.AuditoriaControl
                             .Where(x => x.IdAuditoria == A.IdAuditoria &&
                                contexto.ProyectoListaControlDetalle
                                .Where(y => y.IdProyectoListaControl == PLC.IdProyectoListaControl).Select(y => y.IdProyectoListaControlDetalle).ToList().Contains(x.IdProyectoListaControlDetalle))
                             .Select(x => new AuditoriaControlModel
                             {
                                 IdAuditoria = x.IdAuditoria,
                                 IdAuditoriaControl = x.IdAuditoriaControl,
                                 Cumple = x.Cumple
                             }).ToList(),
                         AuditoriaControlHallazgo =
                            (from ACB in contexto.AuditoriaControl
                             join ACH in contexto.AuditoriaControlHallazgo on ACB.IdAuditoriaControl equals ACH.IdAuditoriaControl
                             where A.IdAuditoria == ACB.IdAuditoria &&
                                 contexto.ProyectoListaControlDetalle
                                 .Where(x => x.IdProyectoListaControl == PLC.IdProyectoListaControl)
                                 .Select(x => x.IdProyectoListaControlDetalle).ToList().Contains(ACB.IdProyectoListaControlDetalle)
                             select new AuditoriaControlHallazgoModel
                             {
                                 IdAuditoriaControlHallazgo = ACH.IdAuditoriaControlHallazgo,
                                 IdAuditoriaControl = ACB.IdAuditoriaControl,
                                 Gravedad = ACH.Gravedad,
                                 Activo = ACH.Activo
                             }).ToList()
                     }).ToList();

                return listaAuditorias;
            }
        }

        public object LeerAuditoriaDetalleDescarga(int idAuditoria, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                var auditoria =
                    (from A in contexto.Auditoria
                     join PLC in contexto.ProyectoListaControl on A.IdProyectoListaControl equals PLC.IdProyectoListaControl
                     join P in contexto.Proyecto on PLC.IdProyecto equals P.IdProyecto
                     join LC in contexto.ListaControl on PLC.IdListaControl equals LC.IdListaControl
                     where A.IdAuditoria == idAuditoria
                     select new
                     {
                         A.IdAuditoria,
                         A.NoAuditoria,
                         Estatus = A.IdEstatus == "P" ? "En progreso" : "Finalizado",
                         A.FechaInicio,
                         A.FechaFin,
                         Proyecto = P.Nombre,
                         ListaControl = LC.Nombre,
                         AuditoriaControl =
                         (from _PLCD in contexto.ProyectoListaControlDetalle
                          join _AC in contexto.AuditoriaControl on _PLCD.IdProyectoListaControlDetalle equals _AC.IdProyectoListaControlDetalle
                          where _PLCD.IdProyectoListaControl == PLC.IdProyectoListaControl && _PLCD.Activo && _AC.IdAuditoria == A.IdAuditoria
                          select new
                          {
                              _AC.IdAuditoriaControl,
                              _PLCD.Control,
                              Cumple = _AC.Cumple ?? false ? "✔" : "✖",
                              Usuario = contexto.Usuario.Where(u => u.IdUsuario == _AC.IdUAuditor).Select(u => new
                              {
                                  NombreCompleto = u.Nombre + " " + u.ApPaterno + " " + u.ApMaterno
                              }).FirstOrDefault().NombreCompleto ?? "",
                              AuditoriaControlHallazgo =
                                    (from __ACH in contexto.AuditoriaControlHallazgo
                                     where _AC.IdAuditoriaControl == __ACH.IdAuditoriaControl && __ACH.Activo
                                     select new
                                     {
                                         __ACH.IdAuditoriaControlHallazgo,
                                         Gravedad = __ACH.Gravedad == 1 ? "Bajo" : __ACH.Gravedad == 2 ? "Medio" : "Grave",
                                         __ACH.Descripcion,
                                         Corregido = __ACH.Corregido ? "✔" : "✖",
                                     }).OrderBy(x => x.Descripcion).ToList(),
                              TotalHallazgos = contexto.AuditoriaControlHallazgo.Count(x => x.IdAuditoriaControl == _AC.IdAuditoriaControl && x.Activo == true)
                          }).ToList()
                     }).FirstOrDefault();

                auditoria.AuditoriaControl.ForEach(x =>
                {
                    if (x.AuditoriaControlHallazgo != null && x.AuditoriaControlHallazgo.Count > 0)
                    {
                        x.AuditoriaControlHallazgo.Insert(0,
                            new
                            {
                                IdAuditoriaControlHallazgo = Convert.ToInt64(0),
                                Gravedad = "Gravedad",
                                Descripcion = "Descripción",
                                Corregido = "Corregido"
                            });
                    }
                });

                return auditoria;
            }
        }

        private string NuevoNoAuditoria(string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                string noAuditoria = DateTime.Now.Year.ToString() + "-";

                var maximo = contexto.Auditoria.Where(x => x.NoAuditoria.Substring(0, 4) == DateTime.Now.Year.ToString()).Max(x => x.NoAuditoria);
                var nuevo = maximo == null ? 1 : Convert.ToInt32(maximo.Substring(maximo.IndexOf('-') + 1, 4)) + 1;

                noAuditoria += nuevo.ToString("D4");

                return noAuditoria;
            }
        }

        public void SincronizarAuditoriaControl(int idAuditoria, int idProyectoListaControl, long idUsuario, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var auditoriaControles = contexto.AuditoriaControl.Where(x => x.IdAuditoria == idAuditoria).ToList();
                var proyectoListaControlDetalle = contexto.ProyectoListaControlDetalle.Where(x => x.IdProyectoListaControl == idProyectoListaControl && x.Activo == true).ToList();
                var proyectoListaControlDetalleEliminar = contexto.ProyectoListaControlDetalle.Where(x => x.IdProyectoListaControl == idProyectoListaControl && x.Activo == false).ToList();

                var idList = auditoriaControles.Select(x => x.IdProyectoListaControlDetalle).ToList();
                var faltantes = proyectoListaControlDetalle.Where(x => !idList.Contains(x.IdProyectoListaControlDetalle)).Select(x => new AuditoriaControl
                {
                    IdAuditoria = idAuditoria,
                    IdProyectoListaControlDetalle = x.IdProyectoListaControlDetalle,
                    IdUCreo = idUsuario,
                    FechaCreo = DateTime.Now
                }).ToList();
                var idListElim = proyectoListaControlDetalleEliminar.Select(x => x.IdProyectoListaControlDetalle).ToList();
                var eliminar = auditoriaControles.Where(x => idListElim.Contains(x.IdProyectoListaControlDetalle)).ToList();

                if (faltantes.Count > 0) contexto.AuditoriaControl.AddRange(faltantes);
                if (eliminar.Count > 0)
                {
                    var ids = eliminar.Select(y => y.IdAuditoriaControl).ToList();
                    var hallazgos = contexto.AuditoriaControlHallazgo.Where(x => ids.Contains(x.IdAuditoriaControl)).ToList();
                    if (hallazgos.Count > 0) contexto.AuditoriaControlHallazgo.RemoveRange(hallazgos);
                    contexto.AuditoriaControl.RemoveRange(eliminar);
                }
                contexto.SaveChanges();

                return;
            }
        }
    }
}
