using CapaDatos.DataBaseModel;
using CapaDatos.Models;
using CapaDatos.Models.Constants;
using System;
using System.Collections.Generic;
using System.Data.SqlTypes;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos
{
    public class CD_ListaRevision
    {
        public List<ListaRevisionModel> LeerListaRevision(long idProyecto, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var listaRevision =
                    (from LR in contexto.ListaRevision
                     join F in contexto.CatalogoGeneral on LR.CatalogoFaseId equals F.IdCatalogo
                     join C in contexto.CatalogoGeneral on LR.CatalogoClasificacionId equals C.IdCatalogo
                     where LR.IdProyecto == idProyecto
                     select new ListaRevisionModel
                     {
                         IdListaRevision = LR.IdListaRevision,
                         Nombre = LR.Nombre,
                         Fase = new CatalogoGeneralModel { DescLarga = F.DescLarga },
                         Clasificacion = new CatalogoGeneralModel { DescLarga = C.DescLarga },
                         Activo = LR.Activo
                     }).ToList();

                return listaRevision;
            }
        }

        public ListaRevisionModel LeerListaRevisionPorId(string conexionEF, int idListaRevision)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var listaRevision =
                    (from LR in contexto.ListaRevision
                     where LR.IdListaRevision == idListaRevision
                     select new ListaRevisionModel
                     {
                         IdListaRevision = LR.IdListaRevision,
                         Nombre = LR.Nombre,
                         CatalogoFaseId = LR.CatalogoFaseId ?? 0,
                         CatalogoClasificacionId = LR.CatalogoClasificacionId ?? 0,
                         Activo = LR.Activo
                     }).FirstOrDefault();

                return listaRevision;
            }
        }

        public List<ListaRevisionDetalleModel> LeerListaRevisionDetalle(string conexionEF, int idListaRevision)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var detalle =
                    (from LR in contexto.ListaRevisionDetalle
                     where LR.IdListaRevision == idListaRevision && LR.Activo == true
                     select new ListaRevisionDetalleModel
                     {
                         IdListaRevisionDetalle = LR.IdListaRevisionDetalle,
                         IdListaRevision = LR.IdListaRevision,
                         Control = LR.Control,
                         Activo = LR.Activo
                     }).ToList();

                return detalle;
            }
        }

        public (bool Estatus, string Mensaje, int idListaRevision) CrearListaRevision(long idProyecto, string conexionEF, long idUsuario)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var listaRevision = new ListaRevision
                {
                    IdProyecto = idProyecto,
                    Nombre = "",
                    Activo = false,
                    IdUCreo = idUsuario,
                    FechaCreo = DateTime.Now
                };

                contexto.ListaRevision.Add(listaRevision);
                contexto.SaveChanges();

                return (true, Mensaje.MensajeGuardadoExito, listaRevision.IdListaRevision);
            }
        }

        public (bool Estatus, string Mensaje) EditarListaRevision(ListaRevisionModel _listaRevision, string conexionEF, long idUsuario)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                if (_listaRevision.IdListaRevision == 0) return (false, Mensaje.MensajeErrorDatos);

                var listaRevision = contexto.ListaRevision.FirstOrDefault(x => x.IdListaRevision == _listaRevision.IdListaRevision);
                if (listaRevision == null) return (false, Mensaje.MensajeErrorDatos);

                var duplicado = contexto.ListaRevision.Any(x => x.Nombre == _listaRevision.Nombre && x.IdListaRevision != _listaRevision.IdListaRevision && x.IdProyecto == listaRevision.IdProyecto);
                if (duplicado) return (false, Mensaje.MensajeErrorDuplicado);

                listaRevision.Nombre = _listaRevision.Nombre;
                listaRevision.CatalogoFaseId = _listaRevision.CatalogoFaseId;
                listaRevision.CatalogoClasificacionId = _listaRevision.CatalogoClasificacionId;
                listaRevision.Activo = _listaRevision.Activo;
                listaRevision.IdUModifico = idUsuario;
                listaRevision.FechaModifico = DateTime.Now;

                contexto.SaveChanges();

                return (true, Mensaje.MensajeGuardadoExito);
            }
        }

        public (bool Estatus, string Mensaje) ActivarListaRevision(string conexionEF, ListaRevisionModel _listaRevision, long idUsuario)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var listaRevision = contexto.ListaRevision.FirstOrDefault(x => x.IdListaRevision == _listaRevision.IdListaRevision);
                if (listaRevision == null) return (false, Mensaje.MensajeErrorDatos);

                listaRevision.Activo = _listaRevision.Activo;
                listaRevision.IdUModifico = idUsuario;
                listaRevision.FechaModifico = DateTime.Now;

                contexto.SaveChanges();

                return (true, Mensaje.MensajeGuardadoExito);
            }
        }

        public (bool Estatus, string Mensaje) CopiarListaRevisionDetalle(long idProyecto, List<int> listasRevision, string conexionEF, long idUsuario)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                var listaDetalle =
                    contexto.ListaRevision
                    .Where(x => listasRevision.Contains(x.IdListaRevision))
                    .ToList()
                    .Select(x => new ListaRevision
                    {
                        IdProyecto = idProyecto,
                        Nombre = x.Nombre,
                        CatalogoFaseId = x.CatalogoFaseId ?? 0,
                        CatalogoClasificacionId = x.CatalogoClasificacionId ?? 0,
                        Activo = true,
                        IdUCreo = idUsuario,
                        FechaCreo = DateTime.Now,
                        ListaRevisionDetalle = x.ListaRevisionDetalle.Where(y => y.Activo == true).Select(y => new ListaRevisionDetalle
                        {
                            IdListaRevision = x.IdListaRevision,
                            Control = y.Control,
                            Activo = true,
                            FechaCreo = DateTime.Now,
                            IdUCreo = idUsuario
                        }).ToList()
                    });

                var listasNuevas = listaDetalle.Select(x => x.Nombre).ToList();
                var listasActuales = contexto.ListaRevision.Where(x => x.IdProyecto == idProyecto && x.Activo == true && x.Nombre != "").Select(x => x.Nombre).ToList();
                var duplicados = listasActuales.Any(listasNuevas.Contains);

                if (duplicados) return (false, Mensaje.MensajeErrorDuplicado);

                contexto.ListaRevision.AddRange(listaDetalle);

                contexto.SaveChanges();

                return (true, Mensaje.MensajeGuardadoExito);
            }
        }

        public (bool Estatus, string Mensaje) EditarListaRevisionImportacion(long idProyecto, bool crear, bool actualizar, List<(string Nombre, long IdFase, long IdClasificacion, List<string> Controles)> listaRevision, string conexionEF, long idUsuario)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                if (crear)
                {
                    var listaRevisiones = new List<ListaRevision>();

                    var listasParaCrear = listaRevision.Where(x => !contexto.ListaRevision.Where(y => y.IdProyecto == idProyecto).Select(y => y.Nombre.Trim()).Contains(x.Nombre.Trim())).ToList();

                    foreach (var (Nombre, IdFase, IdClasificacion, Controles) in listasParaCrear)
                    {
                        listaRevisiones.Add(new ListaRevision
                        {
                            IdProyecto = idProyecto,
                            Nombre = Nombre,
                            Activo = true,
                            CatalogoFaseId = IdFase,
                            CatalogoClasificacionId = IdClasificacion,
                            IdUCreo = idUsuario,
                            FechaCreo = DateTime.Now,
                            ListaRevisionDetalle = Controles.Select(x => new ListaRevisionDetalle
                            {
                                Control = x,
                                Activo = true,
                                IdUCreo = idUsuario,
                                FechaCreo = DateTime.Now
                            }).ToList()
                        });
                    }

                    contexto.ListaRevision.AddRange(listaRevisiones);
                }
                else if (actualizar)
                {
                    var listasParaEditar = listaRevision.Where(x => contexto.ListaRevision.Where(y => y.IdProyecto == idProyecto).Select(y => y.Nombre.Trim()).Contains(x.Nombre.Trim())).ToList();

                    foreach (var (Nombre, IdFase, IdClasificacion, Controles) in listasParaEditar)
                    {
                        var lista = contexto.ListaRevision.FirstOrDefault(x => x.IdProyecto == idProyecto && x.Nombre.Trim() == Nombre.Trim());

                        lista.Nombre = Nombre;
                        lista.CatalogoFaseId = IdFase;
                        lista.CatalogoClasificacionId = IdClasificacion;
                        lista.IdUModifico = idUsuario;
                        lista.FechaModifico = DateTime.Now;

                        var controlDetalles = contexto.ListaRevisionDetalle.Where(x => x.IdListaRevision == lista.IdListaRevision && x.Activo == true);
                        var faltantes = Controles.Where(x => !controlDetalles.Select(y => y.Control.Trim()).Contains(x.Trim())).ToList();
                        var sobrantes = controlDetalles.Where(x => !Controles.Contains(x.Control.Trim())).ToList();

                        if (faltantes.Count > 0)
                        {
                            var listaDetalle = new List<ListaRevisionDetalle>();

                            foreach (var nombre in faltantes)
                            {
                                listaDetalle.Add(new ListaRevisionDetalle
                                {
                                    IdListaRevision = lista.IdListaRevision,
                                    Control = nombre,
                                    Activo = true,
                                    IdUCreo = idUsuario,
                                    FechaCreo = DateTime.Now
                                });
                            }

                            contexto.ListaRevisionDetalle.AddRange(listaDetalle);
                        }
                        if (sobrantes.Count > 0)
                        {
                            sobrantes.ForEach(x => { x.Activo = false; x.IdUModifico = idUsuario; x.FechaModifico = DateTime.Now; });
                            //contexto.ListaControlDetalle.RemoveRange(sobrantes);
                        }
                    }
                }

                contexto.SaveChanges();

                return (true, Mensaje.MensajeGuardadoExito);
            }
        }

        public (bool Estatus, string Mensaje) GuardarListaRevisionDetalle(ListaRevisionDetalleModel _listaRevisionDetalle, string conexionEF, long idUsuario)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var listaRevision = contexto.ListaRevision.FirstOrDefault(x => x.IdListaRevision == _listaRevisionDetalle.IdListaRevision);
                if (listaRevision == null) return (false, Mensaje.MensajeErrorDatos);

                var duplicado = contexto.ListaRevisionDetalle
                    .Any(x => x.Control == _listaRevisionDetalle.Control && x.IdListaRevision == listaRevision.IdListaRevision && x.IdListaRevisionDetalle != _listaRevisionDetalle.IdListaRevisionDetalle && x.Activo == true);
                if (duplicado) return (false, Mensaje.MensajeErrorDuplicado);

                var listaRevisionDetalle = contexto.ListaRevisionDetalle
                    .FirstOrDefault(x => x.IdListaRevision == _listaRevisionDetalle.IdListaRevision && x.IdListaRevisionDetalle == _listaRevisionDetalle.IdListaRevisionDetalle);
                if (listaRevisionDetalle != null)
                {
                    listaRevisionDetalle.Control = _listaRevisionDetalle.Control;
                    listaRevisionDetalle.IdUModifico = idUsuario;
                    listaRevisionDetalle.FechaModifico = DateTime.Now;
                }
                else
                {
                    contexto.ListaRevisionDetalle.Add(new ListaRevisionDetalle
                    {
                        IdListaRevision = _listaRevisionDetalle.IdListaRevision,
                        Control = _listaRevisionDetalle.Control,
                        Activo = true,
                        IdUCreo = idUsuario,
                        FechaCreo = DateTime.Now
                    });
                }

                listaRevision.IdUModifico = idUsuario;
                listaRevision.FechaModifico = DateTime.Now;

                contexto.SaveChanges();

                return (true, Mensaje.MensajeGuardadoExito);
            }
        }

        public (bool Estatus, string Mensaje) EliminarListaRevisionDetalle(ListaRevisionDetalleModel _listaRevisionDetalle, string conexionEF, long idUsuario)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var detalle = contexto.ListaRevisionDetalle.FirstOrDefault(x => x.IdListaRevision == _listaRevisionDetalle.IdListaRevision && x.IdListaRevisionDetalle == _listaRevisionDetalle.IdListaRevisionDetalle);
                if (detalle == null) return (false, Mensaje.MensajeErrorDatos);

                detalle.Activo = false;
                detalle.IdUModifico = idUsuario;
                detalle.FechaModifico = DateTime.Now;

                contexto.SaveChanges();

                return (true, Mensaje.MensajeEliminadoExito);
            }
        }

        public List<ListaRevisionModel> LeerListaRevisionPorCategoria(ListaRevisionModel lista, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var controles =
                    (from LR in contexto.ListaRevision
                     where LR.IdProyecto == lista.IdProyecto && LR.CatalogoFaseId == lista.CatalogoFaseId
                           && LR.CatalogoClasificacionId == lista.CatalogoClasificacionId && LR.Activo == true
                     select new ListaRevisionModel
                     {
                         IdListaRevision = LR.IdListaRevision,
                         Nombre = LR.Nombre,
                     }).ToList();

                return controles;
            }
        }

        public List<ListaRevisionModel> LeerListaRevisionPorProyecto(long IdProyecto, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var controles =
                    (from LR in contexto.ListaRevision
                     where LR.IdProyecto == IdProyecto  && LR.Activo == true
                     select new ListaRevisionModel
                     {
                         IdListaRevision = LR.IdListaRevision,
                         Nombre = LR.Nombre,
                     }).ToList();

                return controles;
            }
        }

        public List<CatalogoGeneralModel> LeerActividadesPorCategoria(ListaRevisionModel lista, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var actividades =
                    (from A in contexto.Actividad
                     join CG in contexto.CatalogoGeneral on A.TipoActividadId equals CG.IdCatalogo
                     where new[] { "R", "L" }.Contains(A.Estatus) && A.IdProyecto == lista.IdProyecto && A.TipoActividadId == lista.CatalogoFaseId
                     && A.ClasificacionId == lista.CatalogoClasificacionId && A.IdListaRevision == null
                     select new CatalogoGeneralModel
                     {
                         IdCatalogo = A.IdActividad,
                         DescLarga = A.IdActividad.ToString() + " - " + (A.BR.Length > 100 ? A.BR.Substring(0, 100) + "..." : A.BR),
                         DescCorta = CG.DescLarga
                     }).ToList();

                return actividades;
            }
        }


        public List<CatalogoGeneralModel> LeerActividadesPorProyecto(long IdProyecto, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var actividades =
                    (from A in contexto.Actividad
                     join CG in contexto.CatalogoGeneral on A.TipoActividadId equals CG.IdCatalogo
                     where new[] { "R", "L" }.Contains(A.Estatus) && A.IdProyecto ==IdProyecto  && A.IdListaRevision == null
                     select new CatalogoGeneralModel
                     {
                         IdCatalogo = A.IdActividad,
                         DescLarga = A.IdActividad.ToString() + " - " + (A.BR.Length > 100 ? A.BR.Substring(0, 100) + "..." : A.BR),
                         DescCorta = CG.DescLarga
                     }).ToList();

                return actividades;
            }
        }

        public List<ActividadListaRevisionModel> LeerListaRevisionActividad(long idActividad, int idListaRevision, long idUsuario, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var actividad = contexto.Actividad.FirstOrDefault(x => x.IdActividad == idActividad);

                var controlesActual = contexto.ListaRevisionDetalle.Where(x => x.IdListaRevision == idListaRevision && x.Activo == true).Select(x => x.IdListaRevisionDetalle).ToList();
                var faltantes = controlesActual.Where(x => !contexto.ActividadListaRevision.Where(y => y.IdActividad == idActividad).Select(y => y.IdListaRevisionDetalle).AsEnumerable().Contains(x)).ToList();

                var _controles =
                    faltantes
                    .Select(x => new ActividadListaRevision
                    {
                        IdActividad = idActividad,
                        FechaCreo = DateTime.Now,
                        IdListaRevisionDetalle = x,
                        IdUCreo = idUsuario
                    }).ToList();

                contexto.ActividadListaRevision.AddRange(_controles);
                contexto.SaveChanges();

                var controles =
                    (from ALR in contexto.ActividadListaRevision
                     join LRD in contexto.ListaRevisionDetalle on ALR.IdListaRevisionDetalle equals LRD.IdListaRevisionDetalle
                     where ALR.IdActividad == idActividad && LRD.IdListaRevision == idListaRevision
                     select new ActividadListaRevisionModel
                     {
                         IdActividadListaRevision = ALR.IdActividadListaRevision,
                         IdActividad = ALR.IdActividad,
                         Control = LRD.Control,
                         Cumple = ALR.Cumple,
                         Hallazgos =
                         contexto.ActividadListaRevisionHallazgo
                         .Where(x => x.IdActividadListaRevision == ALR.IdActividadListaRevision && x.Activo == true)
                         .Select(x => new ActividadListaRevisionHallazgoModel
                         {
                             IdActividadListaRevisionHallazgo = x.IdActividadListaRevisionHallazgo,
                             Corregido = x.Corregido
                         }).ToList()
                     }).ToList();

                return controles;
            }
        }

        public (bool Estatus, string Mensaje) EditarActividadRevision(ActividadListaRevisionModel control, long idUsuario, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var estatus = contexto.Actividad.FirstOrDefault(x => x.IdActividad == control.IdActividad).Estatus;
                if (estatus == "L" || estatus == "C") return (false, "No es posible actualizar, la actividad ya ha sido liberadao esta cancelada");

                var actividadControl = contexto.ActividadListaRevision
                    .Where(x => x.IdActividadListaRevision == control.IdActividadListaRevision && x.IdActividad == control.IdActividad).FirstOrDefault();
                if (actividadControl == null) return (false, "Numero de control incorrecto");

                if (control.Cumple == true)
                {
                    var hallazgosNoCorregidos = contexto.ActividadListaRevisionHallazgo
                        .Any(x => x.IdActividadListaRevision == control.IdActividadListaRevision && x.Activo == true && x.Corregido == false);
                    if (hallazgosNoCorregidos) return (false, "Debe corregir todos los hallazgos para marcar el control como Cumple.");
                }

                actividadControl.Cumple = control.Cumple;
                actividadControl.IdUModifico = idUsuario;
                actividadControl.FechaModifico = DateTime.Now;

                contexto.SaveChanges();

                return (true, "Los datos se guardaron correctamente.");
            }
        }

        public List<ActividadListaRevisionHallazgoModel> LeerActividadRevisionHallazgo(ActividadListaRevisionModel revision, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var hallazgos =
                    (from A in contexto.ActividadListaRevisionHallazgo
                     join AL in contexto.ActividadListaRevision on A.IdActividadListaRevision equals AL.IdActividadListaRevision
                     where A.Activo == true && A.IdActividadListaRevision == revision.IdActividadListaRevision && AL.IdActividad == revision.IdActividad
                     select new ActividadListaRevisionHallazgoModel
                     {
                         IdActividadListaRevisionHallazgo = A.IdActividadListaRevisionHallazgo,
                         IdActividadListaRevision = A.IdActividadListaRevision,
                         Descripcion = A.Descripcion,
                         Gravedad = A.Gravedad,
                         Corregido = A.Corregido
                     }).ToList();

                return hallazgos;
            }
        }

        public (bool Estatus, string Mensaje) CrearHallazgo(ActividadListaRevisionHallazgoModel hallazgo, long idUsuario, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var estatus = contexto.Actividad.FirstOrDefault(x => x.IdActividad == hallazgo.IdActividad).Estatus;
                if (estatus == "L" || estatus == "C") return (false, "No es posible actualizar, la actividad ya ha sido liberadao esta cancelada");

                var duplicado = contexto.ActividadListaRevisionHallazgo
                    .Any(x => x.Descripcion == hallazgo.Descripcion && x.IdActividadListaRevision == hallazgo.IdActividadListaRevision && x.Activo == true);
                if (duplicado) return (false, Mensaje.MensajeErrorDuplicado);

                if (!hallazgo.Corregido)
                {
                    var revision = contexto.ActividadListaRevision.FirstOrDefault(x => x.IdActividadListaRevision == hallazgo.IdActividadListaRevision);
                    revision.Cumple = false;
                }

                var _hallazgo = new ActividadListaRevisionHallazgo
                {
                    IdActividadListaRevision = hallazgo.IdActividadListaRevision,
                    Gravedad = hallazgo.Gravedad,
                    Descripcion = hallazgo.Descripcion,
                    Corregido = hallazgo.Corregido,
                    Activo = true,
                    IdUCreo = idUsuario,
                    FechaCreo = DateTime.Now
                };

                contexto.ActividadListaRevisionHallazgo.Add(_hallazgo);
                contexto.SaveChanges();

                return (true, Mensaje.MensajeGuardadoExito);
            }
        }

        public (bool Estatus, string Mensaje) EditarHallazgo(ActividadListaRevisionHallazgoModel hallazgo, long idUsuario, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var estatus = contexto.Actividad.FirstOrDefault(x => x.IdActividad == hallazgo.IdActividad).Estatus;
                if (estatus == "L" || estatus == "C") return (false, "No es posible actualizar, la actividad ya ha sido liberadao esta cancelada");

                var duplicado = contexto.ActividadListaRevisionHallazgo
                    .Any(x => x.Descripcion == hallazgo.Descripcion && x.IdActividadListaRevision == hallazgo.IdActividadListaRevision
                    && x.IdActividadListaRevisionHallazgo != hallazgo.IdActividadListaRevisionHallazgo && x.Activo == true);
                if (duplicado) return (false, Mensaje.MensajeErrorDuplicado);

                if (!hallazgo.Corregido)
                {
                    var revision = contexto.ActividadListaRevision.FirstOrDefault(x => x.IdActividadListaRevision == hallazgo.IdActividadListaRevision);
                    revision.Cumple = false;
                }

                var _hallazgo = contexto.ActividadListaRevisionHallazgo
                    .FirstOrDefault(x => x.IdActividadListaRevision == hallazgo.IdActividadListaRevision && x.IdActividadListaRevisionHallazgo == hallazgo.IdActividadListaRevisionHallazgo);

                if (_hallazgo == null) return (false, Mensaje.MensajeErrorDatos);
                _hallazgo.Gravedad = hallazgo.Gravedad;
                _hallazgo.Descripcion = hallazgo.Descripcion;
                _hallazgo.Corregido = hallazgo.Corregido;
                _hallazgo.IdUModifico = idUsuario;
                _hallazgo.FechaModifico = DateTime.Now;

                contexto.SaveChanges();

                return (true, Mensaje.MensajeGuardadoExito);
            }
        }

        public (bool Estatus, string Mensaje) EliminarHallazgo(ActividadListaRevisionHallazgoModel hallazgo, long idUsuario, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var estatus = contexto.Actividad.FirstOrDefault(x => x.IdActividad == hallazgo.IdActividad).Estatus;
                if (estatus == "L" || estatus == "C") return (false, "No es posible actualizar, la actividad ya ha sido liberadao esta cancelada");

                var _hallazgo = contexto.ActividadListaRevisionHallazgo
                    .FirstOrDefault(x => x.IdActividadListaRevision == hallazgo.IdActividadListaRevision && x.IdActividadListaRevisionHallazgo == hallazgo.IdActividadListaRevisionHallazgo);
                if (_hallazgo == null) return (false, Mensaje.MensajeErrorDatos);

                _hallazgo.Activo = false;
                _hallazgo.IdUModifico = idUsuario;
                _hallazgo.FechaModifico = DateTime.Now;

                contexto.SaveChanges();

                return (true, Mensaje.MensajeEliminadoExito);
            }
        }

        public bool ActualizaEstatus(long IdListaRevisionActividad,long IdUsuario,  string Conexion) {
            try
            {

                using(var contexto = new BDProductividad_DEVEntities(Conexion)) { 
                
                var a = contexto.ActividadListaRevision.Where(w=> w.IdActividadListaRevision == IdListaRevisionActividad).FirstOrDefault();


                    a.Cumple = true;
                    a.IdUModifico = IdUsuario;
                    a.FechaModifico = DateTime.Now;

                    contexto.SaveChanges();

                }

                return true;

            }
            catch (Exception)
            {

                throw;
            }
        
        }
    }
}
