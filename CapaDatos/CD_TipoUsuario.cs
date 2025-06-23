using CapaDatos.DataBaseModel;
using CapaDatos.Models;
using EntityFramework.BulkInsert.Extensions;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos
{
    public class CD_TipoUsuario
    {
        public List<TipoUsuarioModel> ObtenerTiposUsuario(string Conexion)
        {
            try
            {
                List<TipoUsuarioModel> lstTiposUsuarios = new List<TipoUsuarioModel>();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;

                    lstTiposUsuarios = contexto.TipoUsuario.Select(tu => new TipoUsuarioModel
                    {
                        Activo = tu.Activo,
                        IdTipoUsuario = tu.IdTipoUsuario,
                        Nombre = tu.Nombre,
                        Protegido = tu.Protegido

                    }).ToList();

                }

                return lstTiposUsuarios;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public int GuardarDatos(TipoUsuarioModel datosTipoUsuario, string Conexion)
        {
            try
            {
                List<TipoUsuarioModel> lstTiposUsuarios = new List<TipoUsuarioModel>();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;

                    if (datosTipoUsuario.IdTipoUsuario == 0)
                    {
                        // Agregar nnuevo tipo de usuario
                        var existeTipoUsuario = contexto.TipoUsuario.Where(tu => tu.Nombre == datosTipoUsuario.Nombre).FirstOrDefault();

                        if (existeTipoUsuario != null)
                            return 1;
                        var nuevoTipoUsuario = new TipoUsuario
                        {
                            Nombre = datosTipoUsuario.Nombre,
                            Activo = datosTipoUsuario.Activo,
                            Protegido = datosTipoUsuario.Protegido,
                            FechaCreo = DateTime.Now,
                            IdUCreo = datosTipoUsuario.IdULogin
                        };
                        contexto.TipoUsuario.Add(nuevoTipoUsuario);

                    }
                    else
                    {
                        // Editar
                        var existeTipoUsuario = contexto.TipoUsuario.Where(tu => tu.Nombre == datosTipoUsuario.Nombre && tu.IdTipoUsuario != datosTipoUsuario.IdTipoUsuario).FirstOrDefault();

                        if (existeTipoUsuario != null)
                            return 1;

                        var modificarUsuario = contexto.TipoUsuario.Where(tu => tu.IdTipoUsuario == datosTipoUsuario.IdTipoUsuario).FirstOrDefault();

                        modificarUsuario.Nombre = datosTipoUsuario.Nombre;
                        modificarUsuario.Activo = datosTipoUsuario.Activo;
                        modificarUsuario.Protegido = datosTipoUsuario.Protegido;
                        modificarUsuario.FechaModifico = DateTime.Now;
                        modificarUsuario.IdUModifico = datosTipoUsuario.IdULogin;
                    }
                    contexto.SaveChanges();

                }

                return 2;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public TipoUsuarioModel ConsultarTipoUsuario(int idTipoUsuario, string Conexion)
        {
            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;
                    var datosUsuario = contexto.TipoUsuario.Where(tu => tu.IdTipoUsuario == idTipoUsuario)
                                            .Select(tu => new TipoUsuarioModel
                                            {
                                                Activo = tu.Activo,
                                                IdTipoUsuario = tu.IdTipoUsuario,
                                                Nombre = tu.Nombre,
                                                Protegido = tu.Protegido
                                            }).FirstOrDefault();

                    return datosUsuario;

                }

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public List<TipoUsuarioPermisosModel> ConsultarPermisos(int idTipoUsuario, string Conexion)
        {
            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    contexto.Configuration.LazyLoadingEnabled = false;
                    var lstPermisosTipoUsuario = (from tblMenu in contexto.Menu
                                                  join tblPermisos in contexto.TipoUsuarioPermisos.Where(permisos => permisos.IdTipoUsuario == idTipoUsuario)
                                                  on tblMenu.IdMenu equals tblPermisos.IdMenu
                                                  into gj
                                                  from JMenuPermiso in gj.DefaultIfEmpty()
                                                  select new TipoUsuarioPermisosModel
                                                  {
                                                      IdPermisoTU = JMenuPermiso == null ? 0 : JMenuPermiso.IdPermisoTU,
                                                      IdMenu = tblMenu.IdMenu,
                                                      IdTipoUsuario = idTipoUsuario,
                                                      NombreMenu = tblMenu.Descripcion,
                                                      Guardar = JMenuPermiso == null ? false : JMenuPermiso.Guardar,
                                                      Imprimir = JMenuPermiso == null ? false : JMenuPermiso.Imprimir,
                                                      Eliminar = JMenuPermiso == null ? false : JMenuPermiso.Eliminar,
                                                      Modificar = JMenuPermiso == null ? false : JMenuPermiso.Modificar,
                                                      Ver = JMenuPermiso == null ? false : JMenuPermiso.Ver,
                                                      Padre = tblMenu.IdMenuPadre == null ? true : false,
                                                      Orden = tblMenu.Orden
                                                  }).OrderBy(o => o.Orden).ToList();
            



                    return lstPermisosTipoUsuario;

                }

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public bool GuardarPermisos(List<TipoUsuarioPermisosModel> lstPermisos, string Conexion, string ConexionEF)
        {
            try
            {
                using (var contexto = new BDProductividad_DEVEntities(ConexionEF))
                {

                    contexto.Configuration.LazyLoadingEnabled = false;

                    var lstPermisosNuevos = lstPermisos.Where(p => p.IdPermisoTU == 0)
                                                      .Select(p => new TipoUsuarioPermisos
                                                      {
                                                          IdMenu = p.IdMenu,
                                                          Eliminar = p.Eliminar,
                                                          Guardar = p.Guardar,
                                                          Imprimir = p.Imprimir,
                                                          Modificar = p.Modificar,
                                                          Ver = p.Ver,
                                                          IdTipoUsuario = p.IdTipoUsuario
                                                      }).ToList();

                    contexto.BulkInsert(lstPermisosNuevos);

                    var lstPermisosEditar = lstPermisos.Where(p => p.IdPermisoTU != 0)
                                                    .Select(p => new
                                                    {
                                                        IdPermisoTU = p.IdPermisoTU,
                                                        IdMenu = p.IdMenu,
                                                        IdTipoUsuario = p.IdTipoUsuario,
                                                        Ver = p.Ver,
                                                        Guardar = p.Guardar,
                                                        Modificar = p.Modificar,
                                                        Imprimir = p.Imprimir,
                                                        Eliminar = p.Eliminar,
                                                    }).ToList();

                    if (lstPermisosEditar.Count > 0)
                    {


                       

                        var con = new SqlConnection(Conexion);
                        con.Open();
                        var transaction = con.BeginTransaction();


                        var dtPermisosModificar = lstPermisosEditar.CopyToDataTable();
                       

                        using (SqlCommand cmd = new SqlCommand("ActualizacionMasivaPermisosTipoUsuario_Sp", con, transaction))
                        {
                            cmd.CommandType = System.Data.CommandType.StoredProcedure;
                            cmd.Connection = con;
                            cmd.Parameters.AddWithValue("@Tabla", dtPermisosModificar);
                            cmd.ExecuteNonQuery();
                        }
                        transaction.Commit();
                        con.Close();
                    }
                    contexto.SaveChanges();


                    return true;
                }

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        
    }
}
