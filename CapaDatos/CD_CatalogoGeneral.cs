using CapaDatos.DataBaseModel;
using CapaDatos.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos
{
    public class CD_CatalogoGeneral
    {

        public List<CatalogoGeneralModel> ObtenerCatalogoGeneral(int idTabla, string Conexion, bool? activo = true)
        {
            try
            {
                List<CatalogoGeneralModel> lstCatalogoGeneral = new List<CatalogoGeneralModel>();
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;

                    lstCatalogoGeneral = contexto.CatalogoGeneral.Where(cat => cat.IdTabla == idTabla && cat.Activo == (activo == null ? cat.Activo : activo) && cat.Cabecera == false)
                                                    .OrderBy(cat => cat.DescCorta)
                                                    .Select(cat => new CatalogoGeneralModel
                                                    {
                                                        IdCatalogo = cat.IdCatalogo,
                                                        DescLarga = cat.DescLarga,
                                                        Activo = cat.Activo,
                                                        Cabecera = cat.Cabecera,
                                                        Protegido = cat.Protegido,
                                                        DescCorta = cat.DescCorta,
                                                        DatoEspecial = cat.DatoEspecial,
                                                        IdTabla = cat.IdTabla
                                                    }).ToList();
                }

                return lstCatalogoGeneral;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }



        public List<CatalogoGeneralModel> ObtenerTiposBug( string Conexion, bool? activo = true)
        {
            try
            {
                List<CatalogoGeneralModel> lstCatalogoGeneral = new List<CatalogoGeneralModel>();
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;

                    lstCatalogoGeneral = contexto.CatalogoGeneral.Where(cat => cat.IdTabla == 5 && cat.Activo == (activo == null ? cat.Activo : activo) && cat.Cabecera == false && cat.DatoEspecial=="195")
                                                    .OrderBy(cat => cat.DescCorta)
                                                    .Select(cat => new CatalogoGeneralModel
                                                    {
                                                        IdCatalogo = cat.IdCatalogo,
                                                        DescLarga = cat.DescLarga,
                                                        Activo = cat.Activo,
                                                        Cabecera = cat.Cabecera,
                                                        Protegido = cat.Protegido,
                                                        DescCorta = cat.DescCorta,
                                                        DatoEspecial = cat.DatoEspecial,
                                                        IdTabla = cat.IdTabla
                                                    }).ToList();
                }

                return lstCatalogoGeneral;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }


        public List<CatalogoGeneralModel> ObtenerTipoActividad(string Conexion)
        {
            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;

                    var lista = contexto.ActividadTipo
                        .OrderBy(cat => cat.Nombre)
                        .Select(x => new CatalogoGeneralModel
                        {
                            IdCatalogo = x.ActividadTipoId,
                            DescCorta = x.Nombre,
                            DescLarga = x.Url
                        }).ToList();

                    return lista;
                }

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public List<CatalogoGeneralModel> ObtenerAnios(string Conexion)
        {
            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;

                    var lista = contexto.CatalogoGeneral.Where(w=> w.IdTabla == 19 &&  w.Activo==true && w.Cabecera == false)
                        .Select(x => new CatalogoGeneralModel
                        {
                            IdCatalogo = x.IdCatalogo,
                            DescCorta = x.DescCorta,
                            DescLarga = x.DescLarga
                        }).ToList();

                    return lista;
                }

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }


        public async Task<List<CatalogoGeneralModel>> ObtenerCatalogoGeneralAsync(int idTabla, string Conexion, bool? activo = true)
        {
            try
            {
                List<CatalogoGeneralModel> lstCatalogoGeneral;
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;

                    lstCatalogoGeneral = await contexto.CatalogoGeneral
                        .Where(cat => cat.IdTabla == idTabla && cat.Activo == (activo == null ? cat.Activo : activo) && cat.Cabecera == false)
                        .OrderBy(cat => cat.DescCorta)
                        .Select(cat => new CatalogoGeneralModel
                        {
                            IdCatalogo = cat.IdCatalogo,
                            DescLarga = cat.DescLarga,
                            Activo = cat.Activo,
                            DescCorta = cat.DescCorta,
                            DatoEspecial = cat.DatoEspecial
                        }).ToListAsync();
                }

                return lstCatalogoGeneral;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public List<CatalogoGeneralModel> ObtenerLideres(UsuarioModel user, string Conexion)
        {
            try
            {
                List<CatalogoGeneralModel> lstCatalogoGerentes = new List<CatalogoGeneralModel>();
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;

                    if (user.IdTipoUsuario == 15)
                    {

                        lstCatalogoGerentes = contexto.Usuario.Where(usuarios => usuarios.Activo == true && (usuarios.IdTipoUsuario == 15 || usuarios.IdTipoUsuario == 17 || usuarios.IdTipoUsuario == 20) && usuarios.DepartamentoId == user.DepartamentoId /* && usuarios.IdUGerente == user.IdUsuario*/)
                                                      .OrderBy(usuarios => usuarios.Nombre)
                                                      .Select(cat => new CatalogoGeneralModel
                                                      {
                                                          IdCatalogo = cat.IdUsuario,
                                                          DescCorta = cat.NumEmpleado,
                                                          DescLarga = cat.Nombre + " " + cat.ApPaterno + " " + cat.ApMaterno
                                                      }).ToList();

                    }
                    else if(user.IdTipoUsuario == 20) {
                        lstCatalogoGerentes = contexto.Usuario.Where(usuarios => usuarios.Activo == true && (usuarios.IdTipoUsuario == 15 || usuarios.IdTipoUsuario == 17 || usuarios.IdTipoUsuario == 20) && usuarios.DepartamentoId == user.DepartamentoId && usuarios.IdUsuario == user.IdUsuario)
                                                     .OrderBy(usuarios => usuarios.Nombre)
                                                     .Select(cat => new CatalogoGeneralModel
                                                     {
                                                         IdCatalogo = cat.IdUsuario,
                                                         DescCorta = cat.NumEmpleado,
                                                         DescLarga = cat.Nombre + " " + cat.ApPaterno + " " + cat.ApMaterno
                                                     }).ToList();

                    }
                    else
                    {

                        lstCatalogoGerentes = contexto.Usuario.Where(usuarios => usuarios.Activo == true && (usuarios.IdTipoUsuario == 15 || usuarios.IdTipoUsuario == 17 || usuarios.IdTipoUsuario == 20) && usuarios.DepartamentoId == user.DepartamentoId)
                                                        .OrderBy(usuarios => usuarios.Nombre)
                                                        .Select(cat => new CatalogoGeneralModel
                                                        {
                                                            IdCatalogo = cat.IdUsuario,
                                                            DescCorta = cat.NumEmpleado,
                                                            DescLarga = cat.Nombre + " " + cat.ApPaterno + " " + cat.ApMaterno
                                                        }).ToList();

                    }
                }

                return lstCatalogoGerentes;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public List<CatalogoGeneralModel> ObtenerTiposUsuario(string Conexion)
        {
            try
            {
                List<CatalogoGeneralModel> lstTiposUsuario = new List<CatalogoGeneralModel>();
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;

                    lstTiposUsuario = contexto.TipoUsuario.Where(tu => tu.Activo == true)
                                                    .OrderBy(tu => tu.Nombre)
                                                    .Select(tu => new CatalogoGeneralModel
                                                    {
                                                        IdCatalogo = tu.IdTipoUsuario,
                                                        DescLarga = tu.Nombre
                                                    }).ToList();
                }

                return lstTiposUsuario;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public List<CatalogoGeneralModel> ObtenerAutorizacionesRequisiciones(int idTipo, string Conexion)
        {
            try
            {
                List<CatalogoGeneralModel> lstAutorizacionesRequisiciones = new List<CatalogoGeneralModel>();
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;

                    lstAutorizacionesRequisiciones = contexto.Autorizacion.Where(au => au.Activo == true && au.Tipo == idTipo)
                                                    .OrderBy(au => au.Nombre)
                                                    .Select(au => new CatalogoGeneralModel
                                                    {
                                                        IdCatalogo = au.IdAutorizacion,
                                                        DescLarga = au.Nombre
                                                    }).ToList();
                }

                return lstAutorizacionesRequisiciones;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public List<CatalogoGeneralModel> ObtenerActividadesQA(long idProyecto, string conexion)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexion))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var actividades =
                    (from A in contexto.Actividad
                     join P in contexto.Proyecto on A.IdProyecto equals P.IdProyecto
                     join CG in contexto.CatalogoGeneral on A.TipoActividadId equals CG.IdCatalogo
                     where P.Activo == true && new[] { "R", "L" }.Contains(A.Estatus) && P.IdProyecto == idProyecto && A.IdListaRevision == null
                     select new CatalogoGeneralModel
                     {
                         IdCatalogo = A.IdActividad,
                         DescLarga = A.IdActividad.ToString() + " - " + (A.BR.Length > 100 ? A.BR.Substring(0, 100) + "..." : A.BR),
                         DescCorta = CG.DescLarga
                     }).ToList();

                return actividades;
            }
        }

        public string LeerRequerimientoActividad(long idActividad, string conexion)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexion))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var br = contexto.Actividad.Where(x => x.IdActividad == idActividad).FirstOrDefault()?.BR;

                return br ?? "";
            }
        }
        public List<CatalogoGeneralModel> ObtenerCabeceras(string Conexion)
        {
            try
            {
                List<CatalogoGeneralModel> lstCatalogosCabeceras = new List<CatalogoGeneralModel>();
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;

                    lstCatalogosCabeceras = contexto.CatalogoGeneral.Where(cat => cat.Cabecera == true && cat.Activo == true)
                                                    .OrderBy(cat => cat.DescCorta)
                                                    .Select(cat => new CatalogoGeneralModel
                                                    {
                                                        IdCatalogo = cat.IdTabla,
                                                        DescLarga = cat.DescCorta

                                                    }).ToList();
                }

                return lstCatalogosCabeceras;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public int GuardarCatalogo(CatalogoGeneralModel catalogo, long idUsuarioLogin, string Conexion)
        {
            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;
                    if (catalogo.IdCatalogo == 0)
                    {
                        //nuevo catalogo
                        var existeDescripcionCorta = contexto.CatalogoGeneral.Where(cat => cat.DescCorta == catalogo.DescCorta && cat.IdTabla == catalogo.IdTabla).FirstOrDefault();
                        if (existeDescripcionCorta != null)
                            return 1;
                        var existeDescripcionLarga = contexto.CatalogoGeneral.Where(cat => cat.DescLarga == catalogo.DescLarga && cat.IdTabla == catalogo.IdTabla).FirstOrDefault();
                        if (existeDescripcionLarga != null)
                            return 2;

                        var nuevoCatalogo = new CatalogoGeneral
                        {
                            Activo = catalogo.Activo,
                            DescLarga = catalogo.DescLarga,
                            Cabecera = false,
                            DescCorta = catalogo.DescCorta,
                            DatoEspecial = catalogo.DatoEspecial == "-1" ? null : catalogo.DatoEspecial,
                            IdTabla = catalogo.IdTabla,
                            Protegido = catalogo.Protegido,
                            FechaCreo = DateTime.Now,
                            IdUCreo = idUsuarioLogin
                        };

                        contexto.CatalogoGeneral.Add(nuevoCatalogo);
                    }
                    else
                    {
                        //editar catalogo

                        var existeDescripcionCorta = contexto.CatalogoGeneral.Where(cat => cat.DescCorta == catalogo.DescCorta && cat.IdTabla == catalogo.IdTabla && cat.IdCatalogo != catalogo.IdCatalogo).FirstOrDefault();
                        if (existeDescripcionCorta != null)
                            return 1;
                        var existeDescripcionLarga = contexto.CatalogoGeneral.Where(cat => cat.DescLarga == catalogo.DescLarga && cat.IdTabla == catalogo.IdTabla && cat.IdCatalogo != catalogo.IdCatalogo).FirstOrDefault();
                        if (existeDescripcionCorta != null)
                            return 2;

                        var editaCatalogo = contexto.CatalogoGeneral.Where(cat => cat.IdCatalogo == catalogo.IdCatalogo).FirstOrDefault();
                        editaCatalogo.Activo = catalogo.Activo;
                        editaCatalogo.DescLarga = catalogo.DescLarga;
                        editaCatalogo.DescCorta = catalogo.DescCorta;
                        editaCatalogo.DatoEspecial = catalogo.DatoEspecial == "-1" ? null : catalogo.DatoEspecial;
                        editaCatalogo.IdTabla = catalogo.IdTabla;
                        editaCatalogo.Protegido = catalogo.Protegido;
                        editaCatalogo.FechaModifico = DateTime.Now;
                        editaCatalogo.IdUMod = idUsuarioLogin;
                    }
                    contexto.SaveChanges();
                    return 3;
                }
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public CatalogoGeneralModel ConsultarCatalogo(long idCatalogo, string Conexion)
        {
            try
            {
                CatalogoGeneralModel datosCatalogo = new CatalogoGeneralModel();
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;

                    datosCatalogo = contexto.CatalogoGeneral.Where(cat => cat.IdCatalogo == idCatalogo)
                                                    .OrderBy(cat => cat.DescCorta)
                                                    .Select(cat => new CatalogoGeneralModel
                                                    {
                                                        IdCatalogo = cat.IdCatalogo,
                                                        DescLarga = cat.DescLarga,
                                                        Activo = cat.Activo,
                                                        DatoEspecial = cat.DatoEspecial,
                                                        DescCorta = cat.DescCorta,
                                                        IdTabla = cat.IdTabla,
                                                        Protegido = cat.Protegido,
                                                        Cabecera = cat.Cabecera
                                                    }).FirstOrDefault();
                }

                return datosCatalogo;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public List<CatalogoGeneralModel> ObtenerTiposReporte(string Conexion)
        {
            try
            {
                List<CatalogoGeneralModel> lstCatalogoGeneral = new List<CatalogoGeneralModel>();
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;

                    lstCatalogoGeneral = contexto.Graficas.Where(cat => cat.Activo == true)
                                                    .OrderBy(cat => cat.Nombre)
                                                    .Select(cat => new CatalogoGeneralModel
                                                    {
                                                        IdCatalogo = cat.IdGrafica,
                                                        DescCorta = cat.Nombre,

                                                    }).ToList();
                }

                return lstCatalogoGeneral;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }



        public List<CatalogoGeneralModel> ObtenerNiveles(string Conexion)
        {
            try
            {
                List<CatalogoGeneralModel> LstNiveles = new List<CatalogoGeneralModel>();


                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;

                    LstNiveles = contexto.Niveles.Where(w => w.Activo == true)

                                            .Select(cat => new CatalogoGeneralModel
                                            {
                                                IdCatalogo = cat.IdNivel,
                                                DescLarga = cat.Nivel

                                            }).ToList();


                }

                return LstNiveles;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public List<CatalogoGeneralModel> ObtenerProyectos(string Conexion)
        {

            try
            {
                List<CatalogoGeneralModel> LstProyectos = new List<CatalogoGeneralModel>();



                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    contexto.Configuration.LazyLoadingEnabled = false;

                    LstProyectos = contexto.Proyecto.Where(p => p.Activo == true)
                                            .Select(cat => new CatalogoGeneralModel
                                            {
                                                IdCatalogo = cat.IdProyecto,
                                                DescLarga = cat.Nombre

                                            }).ToList();

                }

                return LstProyectos;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public List<CatalogoGeneralModel> ObtenerProyectosPorUsuario(UsuarioModel User, string Conexion)
        {

            try
            {
                List<CatalogoGeneralModel> LstProyectos = new List<CatalogoGeneralModel>();



                List<string> LstEstatus = new List<string>();

                LstEstatus.Add("P");
                LstEstatus.Add("E");
                LstEstatus.Add("C");

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {


                    contexto.Configuration.LazyLoadingEnabled = false;


                    if (User.IdTipoUsuario == 15)
                    {
                        LstProyectos = contexto.Proyecto.Where(p =>   LstEstatus.Contains(p.CatalogoGeneral2.DescCorta)  && p.IdULider == User.IdUsuario)
                                                .Select(cat => new CatalogoGeneralModel
                                                {
                                                    IdCatalogo = cat.IdProyecto,
                                                    DescLarga =  cat.Clave + " - "  + cat.Nombre

                                                }).ToList();


                        var LstProyH = (from p in contexto.Proyecto
                                        join pu in contexto.ProyectoUsuario on p.IdProyecto equals pu.IdProyecto
                                        where pu.IdUsuario == User.IdUsuario && LstEstatus.Contains(p.CatalogoGeneral2.DescCorta)
                                        select new CatalogoGeneralModel
                                        {
                                            IdCatalogo = p.IdProyecto,
                                            DescLarga = p.Clave + " - " + p.Nombre
                                        }).ToList();
                        LstProyectos.AddRange(LstProyH);

                        LstProyectos = LstProyectos.GroupBy(g => g.IdCatalogo).Select(s => s.First()).ToList();


                    }
                    if (User.IdTipoUsuario == 14)
                    {
                        LstProyectos = (from p in contexto.Proyecto
                                        join pu in contexto.ProyectoUsuario on p.IdProyecto equals pu.IdProyecto
                                        where pu.IdUsuario == User.IdUsuario && LstEstatus.Contains(p.CatalogoGeneral2.DescCorta)
                                        select new CatalogoGeneralModel
                                        {
                                            IdCatalogo = p.IdProyecto,
                                            DescLarga = p.Clave + " - " + p.Nombre
                                        }).ToList();




                    }
                    else if (User.IdTipoUsuario == 20)
                    {
                        LstProyectos = (from p in contexto.Proyecto
                                        join u in contexto.ProyectoUsuario on p.IdProyecto equals u.IdProyecto
                                        where u.IdUsuario == User.IdUsuario && u.Activo == true && LstEstatus.Contains(p.CatalogoGeneral2.DescCorta)
                                        select new CatalogoGeneralModel
                                        {
                                            IdCatalogo = p.IdProyecto,
                                            DescLarga = p.Clave + " - " + p.Nombre
                                        }).ToList();

                    }
                    else if (User.IdTipoUsuario != 14 && User.IdTipoUsuario != 15 && User.IdTipoUsuario != 19)
                    {


                        LstProyectos = (from p in contexto.Proyecto
                                        join u in contexto.Usuario on p.IdULider equals u.IdUsuario
                                        where LstEstatus.Contains(p.CatalogoGeneral2.DescCorta) && u.DepartamentoId == User.DepartamentoId
                                        select new CatalogoGeneralModel
                                        {
                                            IdCatalogo = p.IdProyecto,
                                            DescLarga = p.Clave + " - " + p.Nombre
                                        }).ToList();

                        //LstProyectos = contexto.Proyecto.Where(p => p.Activo == true)
                        //                     .Select(cat => new CatalogoGeneralModel
                        //                     {
                        //                         IdCatalogo = cat.IdProyecto,
                        //                         DescLarga = cat.Nombre

                        //                     }).ToList();
                    }

                    else if (User.IdTipoUsuario == 19)
                    {
                        LstProyectos = (from p in contexto.Proyecto
                                        join u in contexto.ProyectoUsuario on p.IdProyecto equals u.IdProyecto
                                        where u.IdUsuario == User.IdUsuario && u.Activo == true && LstEstatus.Contains(p.CatalogoGeneral2.DescCorta)
                                        select new CatalogoGeneralModel
                                        {
                                            IdCatalogo = p.IdProyecto,
                                            DescLarga = p.Clave + " - " + p.Nombre
                                        }).ToList();

                    }
                }

                return LstProyectos.OrderBy(o=> o.DescLarga).ToList();

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }



        public List<CatalogoGeneralModel> ObtenerProyectosPorUsuarioTODOS(UsuarioModel User, string Conexion)
        {

            try
            {
                List<CatalogoGeneralModel> LstProyectos = new List<CatalogoGeneralModel>();



                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {


                    contexto.Configuration.LazyLoadingEnabled = false;


                    if (User.IdTipoUsuario == 15)
                    {
                        LstProyectos = contexto.Proyecto.Where(p =>  p.IdULider == User.IdUsuario)
                                                .Select(cat => new CatalogoGeneralModel
                                                {
                                                    IdCatalogo = cat.IdProyecto,
                                                    DescLarga = cat.Clave + " - " + cat.Nombre

                                                }).ToList();


                        var LstProyH = (from p in contexto.Proyecto
                                        join pu in contexto.ProyectoUsuario on p.IdProyecto equals pu.IdProyecto
                                        where pu.IdUsuario == User.IdUsuario 
                                        select new CatalogoGeneralModel
                                        {
                                            IdCatalogo = p.IdProyecto,
                                            DescLarga = p.Clave + " - " + p.Nombre
                                        }).ToList();
                        LstProyectos.AddRange(LstProyH);

                        LstProyectos = LstProyectos.GroupBy(g => g.IdCatalogo).Select(s => s.First()).ToList();


                    }
                    if (User.IdTipoUsuario == 14)
                    {
                        LstProyectos = (from p in contexto.Proyecto
                                        join pu in contexto.ProyectoUsuario on p.IdProyecto equals pu.IdProyecto
                                        where pu.IdUsuario == User.IdUsuario 
                                        select new CatalogoGeneralModel
                                        {
                                            IdCatalogo = p.IdProyecto,
                                            DescLarga = p.Clave + " - " + p.Nombre
                                        }).ToList();



                    }
                    else if (User.IdTipoUsuario != 14 && User.IdTipoUsuario != 15)
                    {


                        LstProyectos = (from p in contexto.Proyecto
                                        join u in contexto.Usuario on p.IdULider equals u.IdUsuario
                                        where   u.DepartamentoId == User.DepartamentoId
                                        select new CatalogoGeneralModel
                                        {
                                            IdCatalogo = p.IdProyecto,
                                            DescLarga = p.Clave + " - " + p.Nombre
                                        }).ToList();

                        //LstProyectos = contexto.Proyecto.Where(p => p.Activo == true)
                        //                     .Select(cat => new CatalogoGeneralModel
                        //                     {
                        //                         IdCatalogo = cat.IdProyecto,
                        //                         DescLarga = cat.Nombre

                        //                     }).ToList();
                    }
                }

                return LstProyectos.OrderBy(o => o.DescLarga).ToList();

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public List<CatalogoGeneralModel> ObtenerUsuarios(long IdUsuario, string Conexion)
        {
            try
            {
                List<CatalogoGeneralModel> LstUsuarios = new List<CatalogoGeneralModel>();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {





                    var Usuariolog = contexto.Usuario.Where(i => i.IdUsuario == IdUsuario).FirstOrDefault();

                    var AdministraProy= contexto.ProyectoUsuario.Where(w => w.IdUsuario == IdUsuario && w.AdministraProy == true && w.Proyecto.EstatusId == 253).ToList().Count > 0 ? true : false;
                    contexto.Configuration.LazyLoadingEnabled = false;

                    //Tipo usuario Lider proyecto
                    if (Usuariolog.IdTipoUsuario == 15)
                    {


                        //LstUsuarios = contexto.Usuario.Where(p => p.Activo == true && p.IdUGerente == IdUsuario && p.IdTipoUsuario == 14)
                        //                   .Select(cat => new CatalogoGeneralModel
                        //                   {
                        //                       IdCatalogo = cat.IdUsuario,
                        //                       DescLarga = cat.Nombre + " " + cat.ApPaterno

                        //                   }).ToList();
                        // Se consideran ahora los usuarios involucrado en algun proyecto del lider
                        LstUsuarios = (from p in contexto.Proyecto
                                       join pu in contexto.ProyectoUsuario on p.IdProyecto equals pu.IdProyecto
                                       join u in contexto.Usuario on pu.IdUsuario equals u.IdUsuario
                                       where /*p.IdULider == IdUsuario && */pu.Activo == true && p.Activo == true && u.Activo == true && u.IdTipoUsuario != 19
                                       select new CatalogoGeneralModel
                                       {
                                           IdCatalogo = u.IdUsuario,
                                           DescCorta = u.NumEmpleado,
                                           DescLarga = u.NumEmpleado + " - " + u.Nombre + " " + u.ApPaterno
                                       }).Distinct().ToList();



                        LstUsuarios.Add(new CatalogoGeneralModel { IdCatalogo = Usuariolog.IdUsuario, DescLarga = Usuariolog.Nombre + " " + Usuariolog.ApPaterno });


                    }
                    else if (Usuariolog.IdTipoUsuario == 14 || Usuariolog.IdTipoUsuario ==20 )
                    {

                        if (AdministraProy)
                        {

                            // Se consideran ahora los usuarios donde la persona es administrador
                            LstUsuarios = (from p in contexto.Proyecto
                                           join pu in contexto.ProyectoUsuario on p.IdProyecto equals pu.IdProyecto
                                           join pu2 in contexto.ProyectoUsuario on p.IdProyecto equals pu2.IdProyecto
                                           join u in contexto.Usuario on pu.IdUsuario equals u.IdUsuario
                                           where pu2.IdUsuario == IdUsuario && pu2.AdministraProy == true && pu.Activo== true &&  p.Activo == true && u.Activo == true && u.IdTipoUsuario != 19
                                           select new CatalogoGeneralModel
                                           {
                                               IdCatalogo = u.IdUsuario,
                                               DescCorta = u.NumEmpleado,
                                               DescLarga = u.NumEmpleado + " - " + u.Nombre + " " + u.ApPaterno
                                           }).Distinct().ToList();

                        }
                        else {
                            LstUsuarios = contexto.Usuario.Where(p => p.IdUsuario == IdUsuario && p.IdTipoUsuario != 19)
                            .Select(cat => new CatalogoGeneralModel
                                 {
                                    IdCatalogo = cat.IdUsuario,
                                    DescCorta = cat.NumEmpleado,
                                    DescLarga = cat.NumEmpleado + " - " + cat.Nombre + " " + cat.ApPaterno

                                }).ToList();
                        }




                    }
                    else if (Usuariolog.IdTipoUsuario == 17)
                    {

                        LstUsuarios = contexto.Usuario.Where(p => p.Activo == true && p.DepartamentoId == Usuariolog.DepartamentoId && p.IdTipoUsuario != 19)
                                   .Select(cat => new CatalogoGeneralModel
                                   {
                                       IdCatalogo = cat.IdUsuario,
                                       DescCorta = cat.NumEmpleado,
                                       DescLarga = cat.NumEmpleado + " - " + cat.Nombre + " " + cat.ApPaterno ,
                                       IdCatalogoN = cat.IdTipoUsuario

                                   }).ToList();

                        return LstUsuarios.OrderBy(o2 => o2.DescLarga).OrderByDescending(o => o.IdCatalogoN).ToList();
                        //return LstUsuarios.OrderByDescending(o => o.IdCatalogoN).ToList();

                    }
                    else
                    {
                        LstUsuarios = contexto.Usuario.Where(p => p.Activo == true && p.IdTipoUsuario == 14 && p.IdTipoUsuario != 19) 
                                                .Select(cat => new CatalogoGeneralModel
                                                {
                                                    IdCatalogo = cat.IdUsuario,
                                                    DescCorta = cat.NumEmpleado,
                                                    DescLarga = cat.NumEmpleado + " - " + cat.Nombre + " " + cat.ApPaterno

                                                }).ToList();
                    }

                }

                return LstUsuarios.OrderBy(o => o.DescLarga).ToList();
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public List<CatalogoGeneralModel> ObtenerUsuariosActivos(string Conexion)
        {
            try
            {
                List<CatalogoGeneralModel> LstUsuarios = new List<CatalogoGeneralModel>();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {



                    LstUsuarios = contexto.Usuario.Where(p => p.Activo == true)
                                .Select(cat => new CatalogoGeneralModel
                                {
                                    IdCatalogo = cat.IdUsuario,
                                    DescCorta = cat.NumEmpleado,
                                    DescLarga = cat.NumEmpleado + " - " + cat.Nombre + " " + cat.ApPaterno,
                                    IdCatalogoN = cat.IdTipoUsuario

                                }).ToList();



                }

                return LstUsuarios.OrderBy(o => o.DescLarga).ToList();
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }



        public List<CatalogoGeneralModel> ObtenerSprints(List<long> LstProyectos, string Conexion)
        {

            try
            {
                List<CatalogoGeneralModel> Lst = new List<CatalogoGeneralModel>();
                using (var contexto = new BDProductividad_DEVEntities(Conexion)) {


                    Lst = contexto.ProyectoIteracion.Where(w => LstProyectos.Contains(w.IdProyecto))
                          .Select(s=> new CatalogoGeneralModel
                          {
                              IdCatalogo = s.IdIteracion,
                              DescCorta = s.Nombre,
                              DescLarga = s.Nombre

                          }).ToList();
                
                }

                return Lst;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public List<CatalogoGeneralModel> ObtenerSprintsProyecto(long IdProyecto, string Conexion)
        {

            try
            {
                List<CatalogoGeneralModel> Lst = new List<CatalogoGeneralModel>();
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {


                    Lst = contexto.ProyectoIteracion.Where(w => w.IdProyecto == IdProyecto)
                          .Select(s => new CatalogoGeneralModel
                          {
                              IdCatalogo = s.IdIteracion,
                              DescCorta = s.Nombre,
                              DescLarga = s.Nombre

                          }).ToList();

                }

                return Lst;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public List<CatalogoGeneralModel> ObtenerActividadPorTipo(long IdProyecto, long IdTipo, string Conexion)
        {

            try
            {
                List<CatalogoGeneralModel> Lst = new List<CatalogoGeneralModel>();
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {


                    Lst = contexto.Actividad.Where(w => w.IdProyecto == IdProyecto && w.TipoId == IdTipo && w.Estatus != "C")
                          .Select(s => new CatalogoGeneralModel
                          {
                              IdCatalogo = s.IdActividad,
                              DescCorta = s.BR,
                              DescLarga = s.BR

                          }).ToList();

                }

                return Lst;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }


        public long ObtenerLider(long IdUsuario, string Conexion)
        {
            try
            {
                List<CatalogoGeneralModel> LstUsuarios = new List<CatalogoGeneralModel>();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    var Usuariolog = contexto.Usuario.Where(i => i.IdUsuario == IdUsuario).FirstOrDefault();

                    contexto.Configuration.LazyLoadingEnabled = false;

                    var usuario = contexto.Usuario.FirstOrDefault(x => x.IdUsuario == IdUsuario);

                    if (usuario.IdTipoUsuario != 15 && usuario.IdTipoUsuario != 17)
                    {
                        IdUsuario = usuario.IdUGerente ?? IdUsuario;
                    }
                }

                return IdUsuario;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public List<CatalogoGeneralModel> ObtenerClientes(string Conexion)
        {

            try
            {
                List<CatalogoGeneralModel> LstClientes = new List<CatalogoGeneralModel>();



                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    contexto.Configuration.LazyLoadingEnabled = false;

                    LstClientes = contexto.Cliente.Where(p => p.Activo == true)
                                            .Select(cat => new CatalogoGeneralModel
                                            {
                                                IdCatalogo = cat.IdCliente,
                                                DescLarga = cat.Nombre

                                            }).ToList();

                }

                return LstClientes;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public List<CatalogoGeneralModel> ObtenerWorkFlows(string Conexion)
        {

            try
            {
                List<CatalogoGeneralModel> Lst = new List<CatalogoGeneralModel>();



                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    contexto.Configuration.LazyLoadingEnabled = false;

                    Lst = contexto.WorkFlowConfig.Where(p => p.Activo == true)
                                            .Select(cat => new CatalogoGeneralModel
                                            {
                                                IdCatalogo = cat.IdWorkFlowC,
                                                DescLarga = cat.Nombre

                                            }).ToList();

                }

                return Lst;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public List<CatalogoGeneralModel> ObtenerClasificacionActividad(long IdTipoActividad, string Conexion)
        {

            try
            {

                List<CatalogoGeneralModel> lstCatalogoGeneral = new List<CatalogoGeneralModel>();



                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    var dependencias = contexto.CatalogoGeneral.Where(w => w.DatoEspecial == IdTipoActividad.ToString()).ToList();

                    if (dependencias.Count > 0)
                    {

                        lstCatalogoGeneral = contexto.CatalogoGeneral.Where(cat => cat.IdTabla == 5 && cat.DatoEspecial == IdTipoActividad.ToString() && cat.Activo == true && cat.Cabecera == false)
                                                .OrderBy(cat => cat.DescCorta)
                                                .Select(cat => new CatalogoGeneralModel
                                                {
                                                    IdCatalogo = cat.IdCatalogo,
                                                    DescLarga = cat.DescLarga,
                                                    Activo = cat.Activo,
                                                    Cabecera = cat.Cabecera,
                                                    Protegido = cat.Protegido,
                                                    DescCorta = cat.DescCorta,
                                                    DatoEspecial = cat.DatoEspecial,
                                                    IdTabla = cat.IdTabla
                                                }).ToList();

                    }
                    else
                    {

                        lstCatalogoGeneral = contexto.CatalogoGeneral.Where(cat => cat.IdTabla == 5 && cat.Activo == true && cat.Cabecera == false)
                                 .OrderBy(cat => cat.DescCorta)
                                 .Select(cat => new CatalogoGeneralModel
                                 {
                                     IdCatalogo = cat.IdCatalogo,
                                     DescLarga = cat.DescLarga,
                                     Activo = cat.Activo,
                                     Cabecera = cat.Cabecera,
                                     Protegido = cat.Protegido,
                                     DescCorta = cat.DescCorta,
                                     DatoEspecial = cat.DatoEspecial,
                                     IdTabla = cat.IdTabla
                                 }).ToList();
                    }

                }
                return lstCatalogoGeneral;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public List<CatalogoGeneralModel> ObtenerClasificacionActividadCombo(long IdTipoActividad, string Conexion)
        {

            try
            {

                List<CatalogoGeneralModel> lstCatalogoGeneral = new List<CatalogoGeneralModel>();



                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    var dependencias = contexto.CatalogoGeneral.Where(w => w.DatoEspecial == IdTipoActividad.ToString()).ToList();

                    if (dependencias.Count > 0)
                    {

                        lstCatalogoGeneral = contexto.CatalogoGeneral.Where(cat => cat.IdTabla == 5 && cat.DatoEspecial == IdTipoActividad.ToString() && cat.Activo == true && cat.Cabecera == false)
                                                .OrderBy(cat => cat.DescCorta)
                                                .Select(cat => new CatalogoGeneralModel
                                                {
                                                    IdCatalogo = cat.IdCatalogo,
                                                    DescLarga = cat.DescLarga,
                                                    Activo = cat.Activo,
                                                    Cabecera = cat.Cabecera,
                                                    Protegido = cat.Protegido,
                                                    DescCorta = cat.DescCorta,
                                                    DatoEspecial = cat.DatoEspecial,
                                                    IdTabla = cat.IdTabla
                                                }).ToList();

                        var lst2 = contexto.CatalogoGeneral.Where(cat => cat.IdTabla == 5 && cat.DatoEspecial == null && cat.Activo == true && cat.Cabecera == false)
                                                .OrderBy(cat => cat.DescCorta)
                                                .Select(cat => new CatalogoGeneralModel
                                                {
                                                    IdCatalogo = cat.IdCatalogo,
                                                    DescLarga = cat.DescLarga,
                                                    Activo = cat.Activo,
                                                    Cabecera = cat.Cabecera,
                                                    Protegido = cat.Protegido,
                                                    DescCorta = cat.DescCorta,
                                                    DatoEspecial = cat.DatoEspecial,
                                                    IdTabla = cat.IdTabla
                                                }).ToList();

                        lstCatalogoGeneral.AddRange(lst2);

                    }
                    else
                    {

                        lstCatalogoGeneral = contexto.CatalogoGeneral.Where(cat => cat.IdTabla == 5 && cat.Activo == true && cat.Cabecera == false)
                                 .OrderBy(cat => cat.DescCorta)
                                 .Select(cat => new CatalogoGeneralModel
                                 {
                                     IdCatalogo = cat.IdCatalogo,
                                     DescLarga = cat.DescLarga,
                                     Activo = cat.Activo,
                                     Cabecera = cat.Cabecera,
                                     Protegido = cat.Protegido,
                                     DescCorta = cat.DescCorta,
                                     DatoEspecial = cat.DatoEspecial,
                                     IdTabla = cat.IdTabla
                                 }).ToList();
                    }

                }
                return lstCatalogoGeneral;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public List<PreguntaModel> ObtienePreguntas (string Conexion){
            try
            {
                List<PreguntaModel> Lst = new List<PreguntaModel>();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    Lst = contexto.Pregunta.Select(s => new PreguntaModel { 
                    
                        IdPregunta = s.IdPregunta,
                        Pregunta = s.Pregunta1,
                        FechaIni = s.FechaIni,
                        FechaCierre = s.FechaCierre

                    }).ToList();


                }

                return Lst;

            }
            catch (Exception ex)
            {

                throw ex;
            }


        }

        public List<PreguntaModel> ObtienePreguntasRespuestas(long IdPregunta, string Conexion)
        {
            try
            {
                List<PreguntaModel> Lst = new List<PreguntaModel>();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    Lst = contexto.PreguntaRespuesta.Where(w=> w.IdPregunta == IdPregunta).Select(s => new PreguntaModel
                    {

                        IdPregunta = s.IdPregunta,
                        Pregunta = s.Pregunta.Pregunta1,
                        Respuesta = s.Respuesta,
                        FechaRespuesta = s.FechaRespuesta,
                        IdUsuario = s.IdUsuario,
                        NumEmpleado = s.Usuario.NumEmpleado,
                        NombreUsuario = s.Usuario.Nombre + " " +  s.Usuario.ApPaterno + " " + s.Usuario.ApMaterno,


                    }).ToList();


                }

                return Lst;

            }
            catch (Exception ex)
            {

                throw ex;
            }


        }

        public bool GuardarPregunta(PreguntaModel preg, string Conexion)
        {
            try
            {

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    if (preg.IdPregunta == 0)
                    {

                        Pregunta p = new Pregunta();
                        p.Pregunta1 = preg.Pregunta;
                        p.FechaIni = preg.FechaIni;
                        p.FechaCierre = preg.FechaCierre;
                        p.IdUCreo = preg.IdUCreo;
                        p.FechaCreo = DateTime.Now;

                        contexto.Pregunta.Add(p);

                    }
                    else
                    {

                        var p = contexto.Pregunta.Where(w => w.IdPregunta == preg.IdPregunta).FirstOrDefault();

                        p.Pregunta1 = preg.Pregunta;
                        p.FechaIni = preg.FechaIni;
                        p.FechaCierre = preg.FechaCierre;
                        p.IdUMod = preg.IdUCreo;
                        p.FechaMod = DateTime.Now;

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




        public List<CatalogoGeneralModel> ConsultaUsuariosProyectoIteracion(long IdIteracion, string Conexion)
        {
            try
            {
                List<CatalogoGeneralModel> LstUsuario = new List<CatalogoGeneralModel>();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    long IdProyecto = contexto.ProyectoIteracion.Where(w => w.IdIteracion == IdIteracion).FirstOrDefault().IdProyecto;

                    LstUsuario = contexto.ProyectoUsuario.Where(w => w.IdProyecto == IdProyecto && w.Activo == true).Select(s =>

                       new CatalogoGeneralModel
                       {
                           IdCatalogo = s.Usuario.IdUsuario,
                           DescCorta = s.Usuario.NumEmpleado,
                           DescLarga = s.Usuario.Nombre + " " + s.Usuario.ApPaterno + " " + s.Usuario.ApMaterno


                       }
                        ).ToList();
                }

                return LstUsuario;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

    }
}
