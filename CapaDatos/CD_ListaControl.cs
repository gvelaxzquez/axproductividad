using CapaDatos.DataBaseModel;
using CapaDatos.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using EntityFramework.BulkInsert.Extensions;
using CapaDatos.Models.Constants;

namespace CapaDatos
{
    public class CD_ListaControl
    {
        public List<CatalogoGeneralModel> LeerComboListaControl(long idProyecto, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var listaControles =
                    (from LC in contexto.ListaControl
                     join PLC in contexto.ProyectoListaControl on LC.IdListaControl equals PLC.IdListaControl
                     where LC.Activo == true && PLC.Activo == true && PLC.IdProyecto == idProyecto
                     select new ProyectoListaControlModel
                     {
                         IdProyectoListaControl = PLC.IdProyectoListaControl,
                         ListaControl = new ListaControlModel
                         {
                             Nombre = LC.Nombre
                         }
                     }).ToList();

                var combo = listaControles.Select(x => new CatalogoGeneralModel
                {
                    IdCatalogo = x.IdProyectoListaControl,
                    DescLarga = x.ListaControl.Nombre
                }).ToList();

                return combo;
            }
        }

        public int LeerIdProyectoListaControl(long idProyecto, int idListaControl, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var idProyectoListaControl =
                    contexto.ProyectoListaControl.FirstOrDefault(x => x.IdProyecto == idProyecto && x.IdListaControl == idListaControl).IdProyectoListaControl;

                return idProyectoListaControl;
            }
        }

        public (string Proceso, string Subproceso) LeerProcesoSubproceso(int idProyectoListaControl, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                var idListaControl = contexto.ProyectoListaControl.FirstOrDefault(x => x.IdProyectoListaControl == idProyectoListaControl).IdListaControl;

                var listaControl =
                    (from LC in contexto.ListaControl
                     join P in contexto.CatalogoGeneral on LC.CatalogoFaseId equals P.IdCatalogo
                     join SP in contexto.CatalogoGeneral on LC.CatalogoClasificacionId equals SP.IdCatalogo
                     where LC.IdListaControl == idListaControl
                     select new ListaControlModel
                     {
                         Proceso = new CatalogoGeneralModel { DescLarga = P.DescLarga },
                         Subproceso = new CatalogoGeneralModel { DescLarga = SP.DescLarga },
                     }).FirstOrDefault();

                return (listaControl.Proceso.DescLarga, listaControl.Subproceso.DescLarga);
            }
        }

        public List<ListaControlModel> LeerListaControl(string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var listaControles =
                    (from LC in contexto.ListaControl
                     join P in contexto.CatalogoGeneral on LC.CatalogoFaseId equals P.IdCatalogo
                     join SP in contexto.CatalogoGeneral on LC.CatalogoClasificacionId equals SP.IdCatalogo
                     select new ListaControlModel
                     {
                         IdListaControl = LC.IdListaControl,
                         Nombre = LC.Nombre,
                         Proceso = new CatalogoGeneralModel { DescLarga = P.DescLarga },
                         Subproceso = new CatalogoGeneralModel { DescLarga = SP.DescLarga },
                         Activo = LC.Activo
                     }).ToList();

                return listaControles;
            }
        }

        public ListaControlModel LeerListaControlPorId(string conexionEF, int idListaControl)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var listaControl =
                    (from LC in contexto.ListaControl
                     where LC.IdListaControl == idListaControl
                     select new ListaControlModel
                     {
                         IdListaControl = LC.IdListaControl,
                         Nombre = LC.Nombre,
                         CatalogoFaseId = LC.CatalogoFaseId,
                         CatalogoClasificacionId = LC.CatalogoClasificacionId,
                         Activo = LC.Activo,
                         ListaControlDetalle = LC.ListaControlDetalle.Where(x => x.Activo == true).Select(x => new ListaControlDetalleModel
                         {
                             IdListaControlDetalle = x.IdListaControlDetalle,
                             IdListaControl = x.IdListaControl,
                             Control = x.Control,
                             Activo = x.Activo
                         }).ToList()
                     }).FirstOrDefault();

                return listaControl;
            }
        }

        public (bool Estatus, string Mensaje) CrearListaControl(string conexionEF, ListaControlModel _listaControl, long idUsuario)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                if (_listaControl.IdListaControl != 0) return (false, Mensaje.MensajeErrorDatos);

                var duplicado = contexto.ListaControl.Where(x => x.Nombre == _listaControl.Nombre).Count() > 0;
                if (duplicado) return (false, Mensaje.MensajeErrorDuplicado);

                var controlDuplicado = _listaControl.ListaControlDetalle
                    .GroupBy(x => x.Control, StringComparer.OrdinalIgnoreCase)
                    .Where(x => x.Count() > 1)
                    .Any();
                if (controlDuplicado) return (false, Mensaje.MensajeErrorDuplicado);

                var listaControl = new ListaControl
                {
                    IdListaControl = _listaControl.IdListaControl,
                    Nombre = _listaControl.Nombre,
                    Activo = _listaControl.Activo,
                    CatalogoFaseId = _listaControl.CatalogoFaseId,
                    CatalogoClasificacionId = _listaControl.CatalogoClasificacionId,
                    IdUCreo = idUsuario,
                    FechaCreo = DateTime.Now,
                    ListaControlDetalle = _listaControl.ListaControlDetalle.Select(x => new ListaControlDetalle
                    {
                        Control = x.Control,
                        Activo = x.Activo,
                        IdUCreo = idUsuario,
                        FechaCreo = DateTime.Now
                    }).ToList()
                };

                contexto.ListaControl.Add(listaControl);
                contexto.SaveChanges();

                return (true, Mensaje.MensajeGuardadoExito);
            }
        }

        public (bool Estatus, string Mensaje) EditarListaControl(string conexionEF, ListaControlModel _listaControl, long idUsuario)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                if (_listaControl.IdListaControl == 0) return (false, Mensaje.MensajeErrorDatos);

                var listaControl = contexto.ListaControl.FirstOrDefault(x => x.IdListaControl == _listaControl.IdListaControl);
                if (listaControl == null) return (false, Mensaje.MensajeErrorDatos);

                var duplicado = contexto.ListaControl.Where(x => x.Nombre == _listaControl.Nombre && x.IdListaControl != _listaControl.IdListaControl).Count() > 0;
                if (duplicado) return (false, Mensaje.MensajeErrorDuplicado);

                listaControl.Nombre = _listaControl.Nombre;
                listaControl.CatalogoFaseId = _listaControl.CatalogoFaseId;
                listaControl.CatalogoClasificacionId = _listaControl.CatalogoClasificacionId;
                listaControl.Activo = _listaControl.Activo;
                listaControl.IdUModifico = idUsuario;
                listaControl.FechaModifico = DateTime.Now;

                contexto.SaveChanges();

                return (true, Mensaje.MensajeGuardadoExito);
            }
        }

        public (bool Estatus, string Mensaje) EditarListaControlImportacion(bool crear, bool actualizar, List<(string Nombre, long IdFase, long IdClasificacion, List<string> Controles)> _listaControles, string conexionEF, long idUsuario)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                if (crear)
                {
                    var listaControles = new List<ListaControl>();

                    var controlesParaCrear = _listaControles.Where(x => !contexto.ListaControl.Select(y => y.Nombre.Trim()).Contains(x.Nombre.Trim())).ToList();

                    foreach (var (Nombre, IdFase, IdClasificacion, Controles) in controlesParaCrear)
                    {
                        var duplicado = contexto.ListaControl.Where(x => x.Nombre.Trim() == Nombre.Trim()).Count() > 0;
                        if (duplicado) return (false, Mensaje.MensajeErrorDuplicado);

                        listaControles.Add(new ListaControl
                        {
                            IdListaControl = 0,
                            Nombre = Nombre,
                            Activo = true,
                            CatalogoFaseId = IdFase,
                            CatalogoClasificacionId = IdClasificacion,
                            IdUCreo = idUsuario,
                            FechaCreo = DateTime.Now,
                            ListaControlDetalle = Controles.Select(x => new ListaControlDetalle
                            {
                                Control = x,
                                Activo = true,
                                IdUCreo = idUsuario,
                                FechaCreo = DateTime.Now
                            }).ToList()
                        });
                    }

                    contexto.ListaControl.AddRange(listaControles);
                }
                else if (actualizar)
                {
                    var controlesParaEditar = _listaControles.Where(x => contexto.ListaControl.Select(y => y.Nombre.Trim()).Contains(x.Nombre.Trim())).ToList();

                    foreach (var (Nombre, IdFase, IdClasificacion, Controles) in _listaControles)
                    {
                        var listaControl = contexto.ListaControl.FirstOrDefault(x => x.Nombre.Trim() == Nombre.Trim());
                        if (listaControl == null) return (false, Mensaje.MensajeErrorDatos);

                        listaControl.Nombre = Nombre;
                        listaControl.CatalogoFaseId = IdFase;
                        listaControl.CatalogoClasificacionId = IdClasificacion;
                        listaControl.IdUModifico = idUsuario;
                        listaControl.FechaModifico = DateTime.Now;

                        var controlDetalles = contexto.ListaControlDetalle.Where(x => x.IdListaControl == listaControl.IdListaControl);
                        var faltantes = Controles.Where(control => !controlDetalles.Select(x => x.Control.Trim()).Contains(control.Trim())).ToList();
                        var sobrantes = controlDetalles.Where(control => !Controles.Contains(control.Control.Trim())).ToList();

                        if (faltantes.Count > 0)
                        {
                            var listaDetalle = new List<ListaControlDetalle>();

                            foreach (var nombre in faltantes)
                            {
                                listaDetalle.Add(new ListaControlDetalle
                                {
                                    IdListaControl = listaControl.IdListaControl,
                                    Control = nombre,
                                    Activo = true,
                                    IdUCreo = idUsuario,
                                    FechaCreo = DateTime.Now
                                });
                            }

                            contexto.ListaControlDetalle.AddRange(listaDetalle);
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

        public (bool Estatus, string Mensaje, List<ListaControlDetalleModel> ListaControlDetalle) EditarListaControlDetalle(string conexionEF, ListaControlDetalleModel _listaControlDetalle, long idUsuario)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var listaControl = contexto.ListaControl.FirstOrDefault(x => x.IdListaControl == _listaControlDetalle.IdListaControl);
                if (listaControl == null) return (false, Mensaje.MensajeErrorDatos, null);

                var duplicado = contexto.ListaControlDetalle.Where(x => x.Control == _listaControlDetalle.Control && x.IdListaControl == listaControl.IdListaControl && x.IdListaControlDetalle != _listaControlDetalle.IdListaControlDetalle && x.Activo == true).Count() > 0;
                if (duplicado) return (false, Mensaje.MensajeErrorDuplicado, null);

                var listaControlDetalle = contexto.ListaControlDetalle.FirstOrDefault(x => x.IdListaControl == _listaControlDetalle.IdListaControl && x.IdListaControlDetalle == _listaControlDetalle.IdListaControlDetalle);
                if (listaControlDetalle != null)
                {
                    listaControlDetalle.Control = _listaControlDetalle.Control;
                    listaControlDetalle.IdUModifico = idUsuario;
                    listaControlDetalle.FechaModifico = DateTime.Now;
                }
                else
                {
                    contexto.ListaControlDetalle.Add(new ListaControlDetalle
                    {
                        IdListaControl = _listaControlDetalle.IdListaControl,
                        Control = _listaControlDetalle.Control,
                        Activo = true,
                        IdUCreo = idUsuario,
                        FechaCreo = DateTime.Now
                    });
                }

                listaControl.IdUModifico = idUsuario;
                listaControl.FechaModifico = DateTime.Now;

                contexto.SaveChanges();

                var controles = contexto.ListaControlDetalle.Where(x => x.Activo == true && x.IdListaControl == _listaControlDetalle.IdListaControl).Select(x => new ListaControlDetalleModel
                {
                    IdListaControl = x.IdListaControl,
                    IdListaControlDetalle = x.IdListaControlDetalle,
                    Control = x.Control,
                    Activo = x.Activo
                }).ToList();

                return (true, Mensaje.MensajeGuardadoExito, controles);
            }
        }

        public (bool Estatus, string Mensaje, List<ListaControlDetalleModel> ListaControlDetalle) EliminarListaControlDetalle(string conexionEF, ListaControlDetalleModel _listaControlDetalle, long idUsuario)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var listaControl = contexto.ListaControlDetalle.FirstOrDefault(x => x.IdListaControl == _listaControlDetalle.IdListaControl && x.IdListaControlDetalle == _listaControlDetalle.IdListaControlDetalle);
                if (listaControl == null) return (false, Mensaje.MensajeErrorDatos, null);

                listaControl.Activo = false;
                listaControl.IdUModifico = idUsuario;
                listaControl.FechaModifico = DateTime.Now;

                contexto.SaveChanges();

                var controles = contexto.ListaControlDetalle.Where(x => x.Activo == true && x.IdListaControl == _listaControlDetalle.IdListaControl).Select(x => new ListaControlDetalleModel
                {
                    IdListaControl = x.IdListaControl,
                    IdListaControlDetalle = x.IdListaControlDetalle,
                    Control = x.Control,
                    Activo = x.Activo
                }).ToList();

                return (true, Mensaje.MensajeEliminadoExito, controles);
            }
        }

        public (bool Estatus, string Mensaje) ActivarListaControl(string conexionEF, ListaControlModel _listaControl, long idUsuario)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var listaControl = contexto.ListaControl.FirstOrDefault(x => x.IdListaControl == _listaControl.IdListaControl);
                if (listaControl == null) return (false, Mensaje.MensajeErrorDatos);

                listaControl.Activo = _listaControl.Activo;
                listaControl.IdUModifico = idUsuario;
                listaControl.FechaModifico = DateTime.Now;

                contexto.SaveChanges();

                return (true, Mensaje.MensajeGuardadoExito);
            }
        }

        public List<ProyectoListaControlModel> LeerProyectoListaControl(long idUsuario, long idProyecto, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                SincronizarProyectoListaControl(idUsuario, idProyecto, conexionEF);

                var listaControles =
                    (from PLC in contexto.ProyectoListaControl
                     join LC in contexto.ListaControl on PLC.IdListaControl equals LC.IdListaControl
                     join P in contexto.CatalogoGeneral on LC.CatalogoFaseId equals P.IdCatalogo
                     join SP in contexto.CatalogoGeneral on LC.CatalogoClasificacionId equals SP.IdCatalogo
                     where /*LC.Activo == true &&*/ PLC.IdProyecto == idProyecto
                     select new ProyectoListaControlModel
                     {
                         IdProyectoListaControl = PLC.IdProyectoListaControl,
                         ListaControl = new ListaControlModel
                         {
                             Nombre = LC.Nombre,
                             Proceso = new CatalogoGeneralModel { DescLarga = P.DescLarga },
                             Subproceso = new CatalogoGeneralModel { DescLarga = SP.DescLarga },
                         },
                         Activo = PLC.Activo
                     }).ToList();

                return listaControles;
            }
        }

        public ProyectoListaControlModel LeerProyectoListaControlPorId(long idUsuario, int idProyectoListaControl, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                SincronizarProyectoListaControlDetalle(idUsuario, idProyectoListaControl, conexionEF);

                var proyectoListaControl =
                    (from PLC in contexto.ProyectoListaControl
                     join LC in contexto.ListaControl on PLC.IdListaControl equals LC.IdListaControl
                     join P in contexto.CatalogoGeneral on LC.CatalogoFaseId equals P.IdCatalogo
                     join SP in contexto.CatalogoGeneral on LC.CatalogoClasificacionId equals SP.IdCatalogo
                     where PLC.IdProyectoListaControl == idProyectoListaControl
                     select new ProyectoListaControlModel
                     {
                         IdListaControl = LC.IdListaControl,
                         ListaControl = new ListaControlModel
                         {
                             Nombre = LC.Nombre,
                             Proceso = new CatalogoGeneralModel { DescLarga = P.DescLarga },
                             Subproceso = new CatalogoGeneralModel { DescLarga = SP.DescLarga },
                         },
                         Activo = PLC.Activo,
                         ProyectoListaControlDetalle =
                            (from PLCD in contexto.ProyectoListaControlDetalle
                             join LCD in contexto.ListaControlDetalle.Where(x => x.Activo == true) on PLCD.IdListaControlDetalle equals LCD.IdListaControlDetalle into T
                             from LCD in T.DefaultIfEmpty()
                             where PLCD.Activo == true && PLCD.IdProyectoListaControl == idProyectoListaControl
                             select new ProyectoListaControlDetalleModel
                             {
                                 IdProyectoListaControl = PLCD.IdProyectoListaControl,
                                 IdProyectoListaControlDetalle = PLCD.IdProyectoListaControlDetalle,
                                 Control = PLCD.Control,
                                 Activo = PLCD.Activo
                             }).ToList()
                     }).FirstOrDefault();

                return proyectoListaControl;
            }
        }

        public (bool Estatus, string Mensaje) EditarProyectoListaControl(string conexionEF, long idProyecto, ProyectoListaControlModel _proyectoListaControl, long idUsuario)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                if (_proyectoListaControl.IdProyectoListaControl == 0) return (false, Mensaje.MensajeErrorDatos);

                var listaControl = contexto.ProyectoListaControl.FirstOrDefault(x => x.IdProyectoListaControl == _proyectoListaControl.IdProyectoListaControl && x.IdProyecto == idProyecto);
                if (listaControl == null) return (false, Mensaje.MensajeErrorDatos);

                var activo = contexto.ListaControl.FirstOrDefault(x => x.IdListaControl == listaControl.IdListaControl).Activo;
                if (!activo && _proyectoListaControl.Activo) return (false, "La lista de control dentro del catálogo no está activa");

                listaControl.Activo = _proyectoListaControl.Activo;
                listaControl.IdUModifico = idUsuario;
                listaControl.FechaModifico = DateTime.Now;

                contexto.SaveChanges();

                return (true, Mensaje.MensajeGuardadoExito);
            }
        }

        public (bool Estatus, string Mensaje) ActivarProyectoListaControl(string conexionEF, ProyectoListaControlModel _proyectoListaControl, long idUsuario)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var proyectoListaControl = contexto.ProyectoListaControl.FirstOrDefault(x => x.IdProyectoListaControl == _proyectoListaControl.IdProyectoListaControl);
                if (proyectoListaControl == null) return (false, Mensaje.MensajeErrorDatos);

                var activo = contexto.ListaControl.FirstOrDefault(x => x.IdListaControl == proyectoListaControl.IdListaControl).Activo;
                if (!activo) return (false, "La lista de control dentro del catálogo no está activa");

                proyectoListaControl.Activo = _proyectoListaControl.Activo;
                proyectoListaControl.IdUModifico = idUsuario;
                proyectoListaControl.FechaModifico = DateTime.Now;

                contexto.SaveChanges();

                return (true, Mensaje.MensajeGuardadoExito);
            }
        }

        public (bool Estatus, string Mensaje, List<ProyectoListaControlDetalleModel> ListaControlDetalle) EditarProyectoListaControlDetalle(string conexionEF, ProyectoListaControlDetalleModel _proyectoListaControlDetalle, long idUsuario)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var listaControl = contexto.ProyectoListaControl.FirstOrDefault(x => x.IdProyectoListaControl == _proyectoListaControlDetalle.IdProyectoListaControl);
                if (listaControl == null) return (false, Mensaje.MensajeErrorDatos, null);

                var duplicado = contexto.ProyectoListaControlDetalle.Where(x => x.Control == _proyectoListaControlDetalle.Control && x.IdProyectoListaControl == _proyectoListaControlDetalle.IdProyectoListaControl && x.IdProyectoListaControlDetalle != _proyectoListaControlDetalle.IdProyectoListaControlDetalle && x.Activo == true).Count() > 0;
                if (duplicado) return (false, Mensaje.MensajeErrorDuplicado, null);

                var listaControlDetalle = contexto.ProyectoListaControlDetalle.FirstOrDefault(x => x.IdProyectoListaControl == _proyectoListaControlDetalle.IdProyectoListaControl && x.IdProyectoListaControlDetalle == _proyectoListaControlDetalle.IdProyectoListaControlDetalle);
                if (listaControlDetalle != null)
                {
                    listaControlDetalle.Control = _proyectoListaControlDetalle.Control;
                    listaControlDetalle.IdUModifico = idUsuario;
                    listaControlDetalle.FechaModifico = DateTime.Now;
                }
                else
                {
                    contexto.ProyectoListaControlDetalle.Add(new ProyectoListaControlDetalle
                    {
                        IdProyectoListaControl = _proyectoListaControlDetalle.IdProyectoListaControl,
                        Control = _proyectoListaControlDetalle.Control,
                        Activo = true,
                        IdUCreo = idUsuario,
                        FechaCreo = DateTime.Now
                    });
                }

                listaControl.IdUModifico = idUsuario;
                listaControl.FechaModifico = DateTime.Now;

                contexto.SaveChanges();

                var controles = contexto.ProyectoListaControlDetalle.Where(x => x.Activo == true && x.IdProyectoListaControl == _proyectoListaControlDetalle.IdProyectoListaControl).Select(x => new ProyectoListaControlDetalleModel
                {
                    IdProyectoListaControl = x.IdProyectoListaControl,
                    IdProyectoListaControlDetalle = x.IdProyectoListaControlDetalle,
                    Control = x.Control,
                    Activo = x.Activo
                }).ToList();

                return (true, Mensaje.MensajeGuardadoExito, controles);
            }
        }

        public (bool Estatus, string Mensaje, List<ProyectoListaControlDetalleModel> ProyectoListaControlDetalle) EliminarProyectoListaControlDetalle(string conexionEF, ProyectoListaControlDetalleModel _proyectoListaControlDetalle, long idUsuario)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var listaControl = contexto.ProyectoListaControlDetalle.FirstOrDefault(x => x.IdProyectoListaControl == _proyectoListaControlDetalle.IdProyectoListaControl && x.IdProyectoListaControlDetalle == _proyectoListaControlDetalle.IdProyectoListaControlDetalle);
                if (listaControl == null) return (false, Mensaje.MensajeErrorDatos, null);

                listaControl.Activo = false;
                listaControl.IdUModifico = idUsuario;
                listaControl.FechaModifico = DateTime.Now;

                contexto.SaveChanges();

                var controles = contexto.ProyectoListaControlDetalle.Where(x => x.Activo == true && x.IdProyectoListaControl == _proyectoListaControlDetalle.IdProyectoListaControl).Select(x => new ProyectoListaControlDetalleModel
                {
                    IdProyectoListaControl = x.IdProyectoListaControl,
                    IdProyectoListaControlDetalle = x.IdProyectoListaControlDetalle,
                    Control = x.Control,
                    Activo = x.Activo
                }).ToList();

                return (true, Mensaje.MensajeEliminadoExito, controles);
            }
        }

        public void SincronizarProyectoListaControl(long idUsuario, long idProyecto, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var listaControles = contexto.ListaControl.ToList();
                var listaControlesInactivos = contexto.ListaControl.Where(x => x.Activo == false).ToList();
                var proyectoListaControles = contexto.ProyectoListaControl.Where(x => x.IdProyecto == idProyecto).ToList();

                proyectoListaControles.Where(x => listaControlesInactivos.Select(y => y.IdListaControl).ToList().Contains(x.IdListaControl)).ToList().ForEach(x => x.Activo = false);
                contexto.SaveChanges();

                if (proyectoListaControles.Count == listaControles.Count)
                    return;

                var idList = proyectoListaControles.Select(x => x.IdListaControl).ToList();
                var faltantes = listaControles.Where(x => !idList.Contains(x.IdListaControl)).Select(x => new ProyectoListaControl
                {
                    IdListaControl = x.IdListaControl,
                    IdProyecto = idProyecto,
                    Activo = x.Activo,
                    IdUCreo = idUsuario,
                    FechaCreo = DateTime.Now
                }).ToList();

                if (faltantes.Count > 0) contexto.ProyectoListaControl.AddRange(faltantes);
                contexto.SaveChanges();

                return;
            }
        }

        public void SincronizarProyectoListaControlDetalle(long idUsuario, int idProyectoListaControl, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var idListaControl = contexto.ProyectoListaControl.FirstOrDefault(x => x.IdProyectoListaControl == idProyectoListaControl).IdListaControl;
                var listaControlDetalle = contexto.ListaControlDetalle.Where(x => x.IdListaControl == idListaControl).ToList();
                var proyectoListaControlDetalle = contexto.ProyectoListaControlDetalle
                    .Where(x => x.IdProyectoListaControl == idProyectoListaControl && x.IdListaControlDetalle != null).ToList();

                var idList = proyectoListaControlDetalle.Select(x => x.IdListaControlDetalle).ToList();
                var faltantes = listaControlDetalle.Where(x => !idList.Contains(x.IdListaControlDetalle)).Select(x => new ProyectoListaControlDetalle
                {
                    IdListaControlDetalle = x.IdListaControlDetalle,
                    IdProyectoListaControl = idProyectoListaControl,
                    Activo = x.Activo,
                    Control = x.Control,
                    IdUCreo = idUsuario,
                    FechaCreo = DateTime.Now
                }).ToList();

                //proyectoListaControlDetalle.ForEach(x =>
                //{
                //    x.Control = listaControlDetalle.FirstOrDefault(y => y.IdListaControlDetalle == x.IdListaControlDetalle)?.Control ?? x.Control;
                //    x.Activo = listaControlDetalle.FirstOrDefault(y => y.IdListaControlDetalle == x.IdListaControlDetalle)?.Activo ?? x.Activo;
                //});

                if (faltantes.Count > 0) contexto.ProyectoListaControlDetalle.AddRange(faltantes);
                contexto.SaveChanges();

                return;
            }
        }
    }
}
