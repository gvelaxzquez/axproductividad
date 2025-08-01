using System;
using System.Collections.Generic;
using System.Linq;
using CapaDatos.DataBaseModel;
using CapaDatos.Models;
using EntityFramework.BulkInsert.Extensions;
using System.Data.SqlClient;
using EntityFramework.Extensions;
using CapaDatos.Models.Constants;
using System.Data;

namespace CapaDatos
{
    public class CD_Usuario
    {
        public List<MenuModel> ObtenerMenuUsuario(long IdUsuario, string Conexion)
        {
            try
            {
                List<MenuModel> LstMenu = new List<MenuModel>();
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;

                    contexto.Configuration.LazyLoadingEnabled = false;
                    LstMenu = (from m in contexto.Menu
                               join pu in contexto.UsuarioPermisos
                                                    .Where(pu => pu.IdUsuario == IdUsuario && pu.Ver == true)
                               on m.IdMenu equals pu.IdMenu
                               where m.Activo == true
                               select new MenuModel
                               {
                                   IdMenu = m.IdMenu,
                                   IdMenuPadre = m.IdMenuPadre,
                                   Activo = m.Activo,
                                   Controlador = m.Controlador,
                                   Accion = m.Accion,
                                   Descripcion = m.Descripcion,
                                   Nivel = m.Nivel,
                                   Orden = m.Orden,
                                   Icono = m.Icono
                               }).ToList();

                }

                return LstMenu;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public UsuarioPermisos ObtenerPermisosControlador(long IdUsuario, string Controlador, string Conexion)
        {
            try
            {
                UsuarioPermisos UsuPermisos = new UsuarioPermisos();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;

                    contexto.Configuration.LazyLoadingEnabled = false;
                    UsuPermisos = (from m in contexto.Menu
                                   join pu in contexto.UsuarioPermisos
                                                        .Where(pu => pu.IdUsuario == IdUsuario)
                                   on m.IdMenu equals pu.IdMenu
                                   where m.Activo == true && m.Controlador == Controlador
                                   select pu
                                   ).FirstOrDefault();

                }

                return UsuPermisos;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public UsuarioPermisos ObtenerPermisosAccion(long IdUsuario, string Accion, string Conexion)
        {
            try
            {
                UsuarioPermisos UsuPermisos = new UsuarioPermisos();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;

                    contexto.Configuration.LazyLoadingEnabled = false;
                    UsuPermisos = (from m in contexto.Menu
                                   join pu in contexto.UsuarioPermisos
                                                        .Where(pu => pu.IdUsuario == IdUsuario)
                                   on m.IdMenu equals pu.IdMenu
                                   where /*m.Activo == true &&*/
                                   m.Accion == Accion
                                   select pu
                                   ).FirstOrDefault();

                }

                return UsuPermisos;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public List<UsuarioModel> ObtenerListaUsuarios(string Conexion)
        {
            try
            {
                List<UsuarioModel> lstUsuarios = new List<UsuarioModel>();
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;

                    lstUsuarios = (from tblUsuarios in contexto.Usuario.Include("TipoUsuario")
                                   join tblDepartamentos in contexto.CatalogoGeneral
                                   on tblUsuarios.DepartamentoId equals tblDepartamentos.IdCatalogo
                                   select new UsuarioModel
                                   {
                                       IdUsuario = tblUsuarios.IdUsuario,
                                       NumEmpleado = tblUsuarios.NumEmpleado,
                                       NombreCompleto = tblUsuarios.Nombre + " " + tblUsuarios.ApPaterno + " " + tblUsuarios.ApMaterno,
                                       Correo = tblUsuarios.Correo,
                                       DescripcionTipoUsuario = tblUsuarios.TipoUsuario.Nombre,
                                       DescripcionDepartamento = tblDepartamentos.DescLarga,
                                       Activo = tblUsuarios.Activo,
                                   }).ToList();
                }

                return lstUsuarios;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }


        public void ObtenerLicencias(ref int Licencias, ref int Usuarios, long IdOrganizacion, string Conexion)
        {
            try
            {

                using (var acceso = new BDYITPRO_ACCESOSEntities())

                {

                    Licencias = acceso.Organizacion.Where(w => w.IdOrganizacion == IdOrganizacion).FirstOrDefault().Licencias;


                }

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {


                    Usuarios = contexto.Usuario.Where(u => u.Activo == true).Count();

                }




            }
            catch (Exception ex)
            {

                throw ex;
            }

        }
        public int GuardarDatosUsuario(UsuarioModel datosUsuario, long idUsuarioLogin, string Conexion)
        {
            try
            {
                List<TipoUsuarioModel> lstTiposUsuarios = new List<TipoUsuarioModel>();
                int Existe = 0;
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;

                    if (datosUsuario.IdUsuario == 0)
                    {
                        // Agregar nnuevo usuario
                        var existeNumEmpleado = contexto.Usuario.Where(usu => usu.NumEmpleado == datosUsuario.NumEmpleado).FirstOrDefault();
                        if (existeNumEmpleado != null)
                            return 1;

                        var existeCorreoEmpleado = contexto.Usuario.Where(usu => usu.Correo == datosUsuario.Correo).FirstOrDefault();
                        if (existeCorreoEmpleado != null)
                            return 2;
                        List<UsuarioAutorizacion> contactorUsuarios = new List<UsuarioAutorizacion>();
                        if (datosUsuario.LstAurotizaciones != null)
                        {
                            contactorUsuarios = datosUsuario.LstAurotizaciones.Select(au => new UsuarioAutorizacion
                            {
                                IdAutorizacion = au.IdAutorizacion
                            }).ToList();
                        }
                        else
                        {
                            contactorUsuarios = null;
                        }

                        var usuarioNuevo = new Usuario
                        {
                            NumEmpleado = datosUsuario.NumEmpleado,
                            Nombre = datosUsuario.Nombre,
                            ApPaterno = datosUsuario.ApPaterno,
                            Correo = datosUsuario.Correo,
                            IdTipoUsuario = datosUsuario.IdTipoUsuario,
                            IdUGerente = (datosUsuario.IdUGerente == -1 ? null : datosUsuario.IdUGerente),
                            DepartamentoId = datosUsuario.DepartamentoId,

                            UsuarioAutorizacion = contactorUsuarios,
                            IdNivel = datosUsuario.IdNivel,
                            FechaIngreso = datosUsuario.FechaIngreso,
                            FechaCambioNivel = datosUsuario.FechaIngreso,
                            FechaCreo = DateTime.Now,
                            IdUCreo = idUsuarioLogin,
                            Activo = datosUsuario.Activo,
                            ApMaterno = datosUsuario.ApMaterno,
                            Bloqueado = datosUsuario.Bloqueado,
                            Contrasena = datosUsuario.Contrasena,
                            FechaContrasena = DateTime.Now.AddYears(-10),
                            IntentosBloqueo = 0,
                            Captura = datosUsuario.Captura

                        };

                        // Para saber si tiene licencias
                        int usuariosactivos = contexto.Usuario.Where(w => w.Activo == true).Count();




                        //Lo agrego ala principal
                        using (var accesos = new BDYITPRO_ACCESOSEntities())
                        {




                            int UsuariosOrg = accesos.Organizacion.Where(w => w.IdOrganizacion == datosUsuario.IdOrganizacion).FirstOrDefault().Licencias;



                            if (usuariosactivos < UsuariosOrg)
                            {

                                // voy a validar si el usuario ya existe en la bd principal, si es asi voy  a darlo de alta en la nueva organizacion

                                var existe = accesos.Cuenta.Where(w => w.Correo.ToUpper() == datosUsuario.Correo.ToUpper()).FirstOrDefault();

                                if (existe == null)
                                {
                                    Cuenta cta = new Cuenta();
                                    cta.IdOrganizacion = datosUsuario.IdOrganizacion;
                                    cta.Correo = datosUsuario.Correo;
                                    cta.Nombre = datosUsuario.Nombre;
                                    cta.ApPaterno = datosUsuario.ApPaterno;
                                    cta.ApMaterno = datosUsuario.ApMaterno;
                                    cta.FechaRegistro = DateTime.Now;
                                    cta.Contrasena = datosUsuario.Contrasena;
                                    cta.Activo = true;

                                    accesos.Cuenta.Add(cta);
                                    accesos.SaveChanges();
                                }
                                else
                                {

                                    CuentaOrganizacion c = new CuentaOrganizacion();

                                    c.IdOrganizacion = datosUsuario.IdOrganizacion;
                                    c.IdCuenta = existe.IdCuenta;

                                    accesos.CuentaOrganizacion.Add(c);
                                    accesos.SaveChanges();


                                    usuarioNuevo.FechaContrasena = DateTime.Now;

                                    Existe = 1;
                                }



                            }
                            else
                            {
                                return 3; // ya no tiene licencias 
                            }


                        }

                        contexto.Usuario.Add(usuarioNuevo);
                        contexto.SaveChanges();
                        var permisosTU = contexto.TipoUsuarioPermisos.Where(ptu => ptu.IdTipoUsuario == datosUsuario.IdTipoUsuario).ToList();
                        var permisosUsuario = permisosTU.Select(ptu => new UsuarioPermisos
                        {
                            Eliminar = ptu.Eliminar,
                            Guardar = ptu.Guardar,
                            IdMenu = ptu.IdMenu,
                            Imprimir = ptu.Imprimir,
                            IdUsuario = usuarioNuevo.IdUsuario,
                            Modificar = ptu.Modificar,
                            Ver = ptu.Ver
                        }).ToList();

                        contexto.BulkInsert(permisosUsuario);

                        contexto.SaveChanges();
                    }
                    else
                    {
                        // Editar
                        var existeNumEmpleado = contexto.Usuario.Where(usu => usu.NumEmpleado == datosUsuario.NumEmpleado && usu.IdUsuario != datosUsuario.IdUsuario).FirstOrDefault();
                        if (existeNumEmpleado != null)
                            return 1;

                        var existeCorreoEmpleado = contexto.Usuario.Where(usu => usu.Correo == datosUsuario.Correo && usu.IdUsuario != datosUsuario.IdUsuario).FirstOrDefault();
                        if (existeCorreoEmpleado != null)
                            return 2;

                        var eliminarAuortizaciones = contexto.UsuarioAutorizacion.Where(aut => aut.IdUsuario == datosUsuario.IdUsuario).ToList();

                        contexto.UsuarioAutorizacion.RemoveRange(eliminarAuortizaciones);
                        contexto.SaveChanges();

                        var editarUsuario = contexto.Usuario.Where(usu => usu.IdUsuario == datosUsuario.IdUsuario).FirstOrDefault();

                        bool ActualizaPermisos = editarUsuario.IdTipoUsuario == datosUsuario.IdTipoUsuario ? false : true;

                        editarUsuario.NumEmpleado = datosUsuario.NumEmpleado;
                        editarUsuario.Nombre = datosUsuario.Nombre;
                        editarUsuario.ApPaterno = datosUsuario.ApPaterno;
                        editarUsuario.Correo = datosUsuario.Correo;
                        editarUsuario.IdTipoUsuario = datosUsuario.IdTipoUsuario;
                        editarUsuario.IdUGerente = (datosUsuario.IdUGerente == -1 ? null : datosUsuario.IdUGerente);
                        editarUsuario.DepartamentoId = datosUsuario.DepartamentoId;

                        if (datosUsuario.LstAurotizaciones != null)
                        {
                            editarUsuario.UsuarioAutorizacion = datosUsuario.LstAurotizaciones.Select(au => new UsuarioAutorizacion
                            {
                                IdAutorizacion = au.IdAutorizacion,
                            }).ToList();
                        }
                        else
                            editarUsuario.UsuarioAutorizacion = null;




                        // Para saber si tiene licencias
                        int usuariosactivos = contexto.Usuario.Where(w => w.Activo == true).Count();

                        //Lo agrego ala principal
                        using (var accesos = new BDYITPRO_ACCESOSEntities())
                        {
                            int UsuariosOrg = 10000;
                            if (editarUsuario.Activo == false && datosUsuario.Activo == true)
                            {


                                UsuariosOrg = accesos.Organizacion.Where(w => w.IdOrganizacion == datosUsuario.IdOrganizacion).FirstOrDefault().Licencias;

                            }



                            if (usuariosactivos < UsuariosOrg)
                            {
                                Cuenta cta = accesos.Cuenta.Where(w => w.Correo == datosUsuario.Correo && w.IdOrganizacion == datosUsuario.IdOrganizacion).FirstOrDefault();

                                if (cta != null)
                                {
                                    cta.Correo = datosUsuario.Correo;
                                    cta.Nombre = datosUsuario.Nombre;
                                    cta.ApPaterno = datosUsuario.ApPaterno;
                                    cta.ApMaterno = datosUsuario.ApMaterno;

                                    cta.Activo = datosUsuario.Activo;

                                    accesos.SaveChanges();
                                }

                            }
                            else
                            {
                                return 3; // ya no tiene licencias 
                            }


                        }



                        editarUsuario.FechaModifico = DateTime.Now;
                        editarUsuario.IdUMod = idUsuarioLogin;
                        editarUsuario.Activo = datosUsuario.Activo;
                        editarUsuario.ApMaterno = datosUsuario.ApMaterno;
                        editarUsuario.Bloqueado = datosUsuario.Bloqueado;
                        editarUsuario.IdNivel = datosUsuario.IdNivel;
                        editarUsuario.FechaIngreso = datosUsuario.FechaIngreso;
                        editarUsuario.FechaCambioNivel = datosUsuario.FechaIngreso;
                        editarUsuario.Captura = datosUsuario.Captura;


                        contexto.SaveChanges();


                        if (ActualizaPermisos)
                        {

                            //Primero elimino los anteriores
                            contexto.UsuarioPermisos.Where(i => i.IdUsuario == datosUsuario.IdUsuario).Delete();
                            contexto.SaveChanges();

                            //Después inserto los nuevos
                            var permisosTU = contexto.TipoUsuarioPermisos.Where(ptu => ptu.IdTipoUsuario == datosUsuario.IdTipoUsuario).ToList();
                            var permisosUsuario = permisosTU.Select(ptu => new UsuarioPermisos
                            {
                                Eliminar = ptu.Eliminar,
                                Guardar = ptu.Guardar,
                                IdMenu = ptu.IdMenu,
                                Imprimir = ptu.Imprimir,
                                IdUsuario = datosUsuario.IdUsuario,
                                Modificar = ptu.Modificar,
                                Ver = ptu.Ver
                            }).ToList();

                            contexto.BulkInsert(permisosUsuario);
                            contexto.SaveChanges();

                        }


                    }

                }
                return Existe == 0 ? 4 : 99;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public string CambiarContraseña(UsuarioModel datosUsuario, long idUsuarioLogin, string Conexion)
        {
            try
            {

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;

                    var tamanoMinimoContrasena = Convert.ToInt32(contexto.Configuracion.Where(conf => conf.IdConf == 9).Select(conf => conf.Valor).FirstOrDefault());

                    if (tamanoMinimoContrasena > datosUsuario.Contrasena.Length)
                    {
                        return "La contraseña debe contener al menos " + tamanoMinimoContrasena + " caracteres.";
                    }

                    var usuarioDatos = contexto.Usuario.Where(usu => usu.IdUsuario == datosUsuario.IdUsuario)
                                                            .FirstOrDefault();

                    usuarioDatos.Contrasena = datosUsuario.ContrasenaNueva;
                    usuarioDatos.FechaContrasena = DateTime.Now.AddYears(-10);
                    usuarioDatos.Bloqueado = false;





                    contexto.SaveChanges();
                    //Actualizo la principal
                    using (var accesos = new BDYITPRO_ACCESOSEntities())
                    {
                        Cuenta cta = accesos.Cuenta.Where(w => w.Correo == usuarioDatos.Correo).FirstOrDefault();
                        cta.Contrasena = datosUsuario.ContrasenaNueva;
                        accesos.SaveChanges();
                    }

                    return string.Empty;

                }

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public List<UsuarioPermisosModel> ConsultarPermisos(long idUsuario, string Conexion)
        {
            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    contexto.Configuration.LazyLoadingEnabled = false;
                    var lstPermisosUsuario = (from tblMenu in contexto.Menu
                                              join tblPermisos in contexto.UsuarioPermisos.Where(permisos => permisos.IdUsuario == idUsuario)
                                              on tblMenu.IdMenu equals tblPermisos.IdMenu
                                              into gj
                                              from JMenuPermiso in gj.DefaultIfEmpty()
                                              select new UsuarioPermisosModel
                                              {
                                                  IdPermisoU = JMenuPermiso == null ? 0 : JMenuPermiso.IdPermisoU,
                                                  IdMenu = tblMenu.IdMenu,
                                                  IdUsuario = idUsuario,
                                                  NombreMenu = tblMenu.Descripcion,
                                                  Guardar = JMenuPermiso == null ? false : JMenuPermiso.Guardar,
                                                  Imprimir = JMenuPermiso == null ? false : JMenuPermiso.Imprimir,
                                                  Eliminar = JMenuPermiso == null ? false : JMenuPermiso.Eliminar,
                                                  Modificar = JMenuPermiso == null ? false : JMenuPermiso.Modificar,
                                                  Ver = JMenuPermiso == null ? false : JMenuPermiso.Ver,
                                                  Padre = tblMenu.IdMenuPadre == null ? true : false,
                                                  Orden = tblMenu.Orden
                                              }).OrderBy(o => o.Orden).ToList();

                    return lstPermisosUsuario;

                }

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public bool GuardarPermisos(List<UsuarioPermisosModel> lstPermisos, string Conexion)
        {
            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    using (var transaction = contexto.Database.BeginTransaction())
                    {
                        try
                        {
                            contexto.Configuration.LazyLoadingEnabled = false;

                            var lstPermisosNuevos = lstPermisos.Where(p => p.IdPermisoU == 0)
                                                              .Select(p => new UsuarioPermisos
                                                              {
                                                                  IdMenu = p.IdMenu,
                                                                  Eliminar = p.Eliminar,
                                                                  Guardar = p.Guardar,
                                                                  Imprimir = p.Imprimir,
                                                                  Modificar = p.Modificar,
                                                                  Ver = p.Ver,
                                                                  IdUsuario = p.IdUsuario
                                                              }).ToList();

                            contexto.BulkInsert(lstPermisosNuevos);

                            var lstPermisosEditar = lstPermisos.Where(p => p.IdPermisoU != 0)
                                                            .Select(p => new
                                                            {
                                                                IdPermisoU = p.IdPermisoU,
                                                                IdMenu = p.IdMenu,
                                                                IdUsuario = p.IdUsuario,
                                                                Ver = p.Ver,
                                                                Guardar = p.Guardar,
                                                                Modificar = p.Modificar,
                                                                Imprimir = p.Imprimir,
                                                                Eliminar = p.Eliminar,
                                                            }).ToList();

                            if (lstPermisosEditar.Count > 0)
                            {
                                var parametro = new SqlParameter("@Tabla", lstPermisosEditar.CopyToDataTable());
                                parametro.TypeName = "UsuarioPermisosTipoTabla";
                                contexto.Database.ExecuteSqlCommand("EXEC ActualizacionMasivaPermisosUsuario_Sp @Tabla;", parametro);
                            }

                            contexto.SaveChanges();
                            transaction.Commit();

                        }
                        catch (Exception ex)
                        {
                            transaction.Rollback();
                            throw ex;
                        }
                    }
                }

                return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public UsuarioModel ConsultarUsuario(long idUsuario, string Conexion)
        {
            try
            {

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;

                    var usuarioDatos = (from tblUsuario in contexto.Usuario.Include("UsuarioAutorizacion")
                                        where tblUsuario.IdUsuario == idUsuario
                                        select new UsuarioModel
                                        {
                                            IdUsuario = tblUsuario.IdUsuario,
                                            Nombre = tblUsuario.Nombre,
                                            ApMaterno = tblUsuario.ApMaterno,
                                            Activo = tblUsuario.Activo,
                                            NombreCompleto = tblUsuario.Nombre + " " + tblUsuario.ApPaterno + " " + tblUsuario.ApMaterno,
                                            ApPaterno = tblUsuario.ApPaterno,
                                            Bloqueado = tblUsuario.Bloqueado,
                                            Correo = tblUsuario.Correo,
                                            DepartamentoId = tblUsuario.DepartamentoId,
                                            IdTipoUsuario = tblUsuario.IdTipoUsuario,
                                            Perfil = tblUsuario.TipoUsuario.Nombre,
                                            IdUGerente = (tblUsuario.IdUGerente == null ? -1 : tblUsuario.IdUGerente),
                                            IdNivel = (tblUsuario.IdNivel == null ? -1 : tblUsuario.IdNivel),
                                            FechaIngreso = tblUsuario.FechaIngreso,
                                            FechaCambioNivel = tblUsuario.FechaCambioNivel,
                                            NumEmpleado = tblUsuario.NumEmpleado,
                                            Contrasena = tblUsuario.Contrasena,
                                            Captura = tblUsuario.Captura,
                                            DescripcionDepartamento = tblUsuario.CatalogoGeneral.DescLarga,
                                            Lider = contexto.Usuario.Where(w => w.IdUsuario == tblUsuario.IdUGerente).Select(s => s.Nombre + " " + s.ApPaterno).FirstOrDefault(),
                                            Nivel = tblUsuario.Niveles.Nivel,
                                            LstAurotizaciones = tblUsuario.UsuarioAutorizacion.Select(au => new UsuarioAutorizacionModel
                                            {
                                                IdAutorizacion = au.IdAutorizacion,
                                                IdUA = au.IdUA,
                                                IdUsuario = au.IdUsuario,
                                                Tipo = au.Autorizacion.Tipo

                                            }).ToList(),
                                        }).FirstOrDefault();



                    return usuarioDatos;

                }
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public UsuarioModel ConsultarUsuarioClave(string NumEmpleado, string Conexion)
        {
            try
            {

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;

                    var usuarioDatos = (from tblUsuario in contexto.Usuario
                                        where tblUsuario.NumEmpleado == NumEmpleado
                                        select new UsuarioModel
                                        {
                                            IdUsuario = tblUsuario.IdUsuario,
                                            Activo = tblUsuario.Activo,
                                            NombreCompleto = tblUsuario.Nombre + " " + tblUsuario.ApPaterno + " " + tblUsuario.ApMaterno,
                                            Correo = tblUsuario.Correo


                                        }).FirstOrDefault();



                    return usuarioDatos;

                }
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public UsuarioModel LeerCostos(long idUsuario, string conexion)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexion))
            {
                return contexto.Usuario.Select(x => new UsuarioModel
                {
                    IdUsuario = x.IdUsuario,
                    //CostoMensual = x.CostoMensual ?? 0,
                    //CostoHora = x.CostoHora ?? 0
                }).FirstOrDefault(x => x.IdUsuario == idUsuario);
            }
        }

        public (bool Exito, string Mensaje) GuardarCostos(UsuarioModel costos, string conexion)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexion))
            {
                //var usuario = contexto.Usuario.FirstOrDefault(x => x.IdUsuario == costos.IdUsuario);
                //if (usuario == null)
                //    return (false, "No se encontró el registro");

                //usuario.CostoMensual = costos.CostoMensual;
                //usuario.CostoHora = costos.CostoHora;
                //usuario.IdUMod = costos.IdUCreo;
                //usuario.FechaModifico = DateTime.Now;

                //contexto.SaveChanges();

                return (true, Mensaje.MensajeGuardadoExito);
            }
        }

        public bool ActualizaContrasena(string ContrasenaNueva, long IdUsuario, string Conexion)
        {
            try
            {

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    var usuario = contexto.Usuario.Where(u => u.IdUsuario == IdUsuario).FirstOrDefault();

                    usuario.Contrasena = ContrasenaNueva;
                    usuario.FechaContrasena = DateTime.Now;

                    //Actualizo la principal
                    using (var accesos = new BDYITPRO_ACCESOSEntities())
                    {
                        Cuenta cta = accesos.Cuenta.Where(w => w.Correo == usuario.Correo).FirstOrDefault();
                        cta.Contrasena = ContrasenaNueva;
                        accesos.SaveChanges();
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


        public List<UsuarioModel> ConsultarUsuariosSegunGerente(long idGerente, string Conexion)
        {
            try
            {

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;

                    var usuarioDatos = (from tblUsuario in contexto.Usuario.Include("UsuarioAutorizacion")
                                        where tblUsuario.IdUGerente == idGerente
                                        select new UsuarioModel
                                        {
                                            IdUsuario = tblUsuario.IdUsuario,
                                            Nombre = tblUsuario.Nombre,
                                            ApMaterno = tblUsuario.ApMaterno,
                                            Activo = tblUsuario.Activo,
                                            ApPaterno = tblUsuario.ApPaterno,
                                            Bloqueado = tblUsuario.Bloqueado,
                                            Correo = tblUsuario.Correo,
                                            DepartamentoId = tblUsuario.DepartamentoId,
                                            IdTipoUsuario = tblUsuario.IdTipoUsuario,
                                            IdUGerente = (tblUsuario.IdUGerente == null ? -1 : tblUsuario.IdUGerente),
                                            NumEmpleado = tblUsuario.NumEmpleado,
                                            Contrasena = tblUsuario.Contrasena,
                                            Captura = tblUsuario.Captura,
                                            LstAurotizaciones = tblUsuario.UsuarioAutorizacion.Select(au => new UsuarioAutorizacionModel
                                            {
                                                IdAutorizacion = au.IdAutorizacion,
                                                IdUA = au.IdUA,
                                                IdUsuario = au.IdUsuario,
                                                Tipo = au.Autorizacion.Tipo

                                            }).ToList(),
                                        }).ToList();



                    return usuarioDatos;

                }
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public List<UsuarioModel> ConsultarUsuariosSegunPermisosDeRequisicion(long idAutorizacion, string Conexion)
        {
            try
            {

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;

                    var usuarioDatos = (from tblAutorizacion in contexto.UsuarioAutorizacion.Include("Usuario")
                                        where tblAutorizacion.IdAutorizacion == idAutorizacion
                                        select new UsuarioModel
                                        {
                                            IdUsuario = tblAutorizacion.Usuario.IdUsuario,
                                            Nombre = tblAutorizacion.Usuario.Nombre,
                                            ApMaterno = tblAutorizacion.Usuario.ApMaterno,
                                            Activo = tblAutorizacion.Usuario.Activo,
                                            ApPaterno = tblAutorizacion.Usuario.ApPaterno,
                                            Bloqueado = tblAutorizacion.Usuario.Bloqueado,
                                            Correo = tblAutorizacion.Usuario.Correo,
                                            DepartamentoId = tblAutorizacion.Usuario.DepartamentoId,
                                            IdTipoUsuario = tblAutorizacion.Usuario.IdTipoUsuario,
                                            IdUGerente = (tblAutorizacion.Usuario.IdUGerente == null ? -1 : tblAutorizacion.Usuario.IdUGerente),
                                            NumEmpleado = tblAutorizacion.Usuario.NumEmpleado,
                                            Contrasena = tblAutorizacion.Usuario.Contrasena,
                                            Captura = tblAutorizacion.Usuario.Captura,
                                            //LstAurotizaciones = tblUsuario.UsuarioAutorizacion.Select(au => new UsuarioAutorizacionModel
                                            //{
                                            //    IdAutorizacion = au.IdAutorizacion,
                                            //    IdUA = au.IdUA,
                                            //    IdUsuario = au.IdUsuario,
                                            //    Tipo = au.Autorizacion.Tipo

                                            //}).ToList(),
                                        }).ToList();



                    return usuarioDatos;

                }
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }


        public List<UsuarioIncidenciasModel> ConsultaIncidencias(string Conexion)
        {
            try
            {
                List<UsuarioIncidenciasModel> LstIncidencias = new List<UsuarioIncidenciasModel>();


                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;


                    LstIncidencias = (from m in contexto.UsuarioIncidencias
                                      join u in contexto.Usuario on m.IdUsuario equals u.IdUsuario
                                      join c in contexto.CatalogoGeneral on m.TipoIncidenciaId equals c.IdCatalogo
                                      select new UsuarioIncidenciasModel
                                      {
                                          IdIncidencia = m.IdIncidencia,
                                          IdUsuario = m.IdUsuario,
                                          TipoIncidenciaId = m.TipoIncidenciaId,
                                          FechaInicio = m.FechaInicio,
                                          FechaFin = m.FechaFin,
                                          DiasConsiderar = m.DiasConsiderar,
                                          Comentarios = m.Comentarios,
                                          TipoIncidenciaStr = c.DescLarga,
                                          UsuarioStr = u.Nombre + " " + u.ApPaterno + " " + u.ApMaterno
                                      }
                                   ).ToList();

                }


                return LstIncidencias;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public bool GuardarIncidencia(UsuarioIncidenciasModel Incidencia, long IdUsuario, string Conexion)
        {
            try
            {

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    contexto.Configuration.LazyLoadingEnabled = false;

                    // Nuevo
                    if (Incidencia.IdIncidencia == 0)
                    {
                        UsuarioIncidencias userinc = new UsuarioIncidencias();

                        userinc.IdUsuario = Incidencia.IdUsuario;
                        userinc.TipoIncidenciaId = Incidencia.TipoIncidenciaId;
                        userinc.FechaInicio = Incidencia.FechaInicio;
                        userinc.FechaFin = Incidencia.FechaFin;
                        userinc.DiasConsiderar = Incidencia.DiasConsiderar;
                        userinc.Comentarios = Incidencia.Comentarios;
                        userinc.IdUCreo = IdUsuario;
                        userinc.FechaCreo = DateTime.Now;


                        contexto.UsuarioIncidencias.Add(userinc);
                        contexto.SaveChanges();



                    }
                    //Modificar
                    else
                    {


                        var userinc = contexto.UsuarioIncidencias.Where(i => i.IdIncidencia == Incidencia.IdIncidencia).FirstOrDefault();
                        userinc.IdUsuario = Incidencia.IdUsuario;
                        userinc.TipoIncidenciaId = Incidencia.TipoIncidenciaId;
                        userinc.FechaInicio = Incidencia.FechaInicio;
                        userinc.FechaFin = Incidencia.FechaFin;
                        userinc.DiasConsiderar = Incidencia.DiasConsiderar;
                        userinc.Comentarios = Incidencia.Comentarios;
                        userinc.IdUCreo = IdUsuario;
                        userinc.FechaCreo = DateTime.Now;


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

        public bool EliminarIncidencia(long IdIncidencia, string Conexion)
        {

            try
            {

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {


                    contexto.Configuration.LazyLoadingEnabled = false;


                    var incidencia = contexto.UsuarioIncidencias.Where(i => i.IdIncidencia == IdIncidencia).FirstOrDefault();

                    contexto.UsuarioIncidencias.Remove(incidencia);

                    contexto.SaveChanges();

                }

                return true;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public List<UsuarioModel> LeerUsuarioCostoFaltante(long? idUsuario, string conexion)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexion))
            {
                var usuariosCosto = contexto.UsuarioCosto
                    .Where(x => x.IdUsuario != idUsuario)
                    .Select(x => x.IdUsuario ?? 0)
                    .ToList();

                var usuarios = contexto.Usuario
                    .Where(x => (x.Activo || x.IdUsuario == idUsuario) && !usuariosCosto.Contains(x.IdUsuario))
                    .Select(x => new UsuarioModel { IdUsuario = x.IdUsuario, Nombre = x.Nombre + " " + x.ApPaterno + " " + x.ApMaterno })
                    .ToList();

                return usuarios;
            }
        }

        public List<UsuarioCostoModel> LeerUsuarioCosto(string conexion)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexion))
            {
                var usuarioCostos =
                    (from uc in contexto.UsuarioCosto
                     join u in contexto.Usuario on uc.IdUsuario equals u.IdUsuario
                     select new UsuarioCostoModel
                     {
                         IdUsuarioCosto = uc.IdUsuarioCosto,
                         CostoMensual = uc.CostoMensual ?? 0,
                         CostoHora = uc.CostoHora ?? 0,
                         Nombre = u.Nombre + " " + u.ApPaterno + " " + u.ApMaterno,
                         Clave = u.NumEmpleado,
                         IdUsuario = u.IdUsuario
                     }).ToList();

                return usuarioCostos;
            }
        }

        public (bool Estatus, string Mensaje) CrearUsuarioCosto(UsuarioCostoModel usuario, long idUsuario, string conexion)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexion))
            {
                var existe = contexto.Usuario.Any(x => x.IdUsuario == usuario.IdUsuario);
                if (!existe)
                    return (false, Mensaje.MensajeErrorDatos);

                var duplicado = contexto.UsuarioCosto.Any(x => x.IdUsuario == usuario.IdUsuario);
                if (duplicado)
                    return (false, "Ya existe un registro con el usuario seleccionado, favor de seleccionarlo para su edición");

                var usuarioCosto = new UsuarioCosto
                {
                    IdUsuario = usuario.IdUsuario,
                    CostoMensual = usuario.CostoMensual,
                    CostoHora = usuario.CostoHora,
                    IdUCreo = idUsuario,
                    FechaCreo = DateTime.Now
                };

                contexto.UsuarioCosto.Add(usuarioCosto);
                contexto.SaveChanges();

                return (true, Mensaje.MensajeGuardadoExito);
            }
        }

        public (bool Estatus, string Mensaje) EditarUsuarioCosto(UsuarioCostoModel usuario, long idUsuario, string conexion)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexion))
            {
                var existe = contexto.Usuario.Any(x => x.IdUsuario == usuario.IdUsuario);
                if (!existe)
                    return (false, Mensaje.MensajeErrorDatos);

                var duplicado = contexto.UsuarioCosto.Any(x => x.IdUsuario == usuario.IdUsuario && x.IdUsuarioCosto != usuario.IdUsuarioCosto);
                if (duplicado)
                    return (false, "Ya existe un registro con el usuario seleccionado, favor de seleccionarlo para su edición");

                var _usuarioCosto = contexto.UsuarioCosto.FirstOrDefault(x => x.IdUsuario == usuario.IdUsuario);
                if (_usuarioCosto == null)
                    return (false, Mensaje.MensajeNoEncontrado);

                _usuarioCosto.IdUsuario = usuario.IdUsuario ?? _usuarioCosto.IdUsuario;
                _usuarioCosto.CostoMensual = usuario.CostoMensual ?? _usuarioCosto.CostoMensual;
                _usuarioCosto.CostoHora = usuario.CostoHora ?? _usuarioCosto.CostoHora;
                _usuarioCosto.IdUModifico = idUsuario;
                _usuarioCosto.FechaModifico = DateTime.Now;

                contexto.SaveChanges();

                return (true, Mensaje.MensajeGuardadoExito);
            }
        }

        public (bool Estatus, string Mensaje) ImportarUsuarioCosto(List<UsuarioCostoModel> _costos, char tipo, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                if (tipo == 'c')
                {
                    var costos = new List<UsuarioCosto>();
                    var nuevas = _costos.Where(x => !contexto.UsuarioCosto.Select(y => y.IdUsuario).Contains(x.IdUsuario)).ToList();

                    foreach (var item in nuevas)
                    {
                        costos.Add(new UsuarioCosto
                        {
                            IdUsuario = item.IdUsuario,
                            CostoHora = item.CostoHora,
                            CostoMensual = item.CostoMensual,
                            IdUCreo = item.IdUCreo,
                            FechaCreo = item.FechaCreo
                        });
                    }

                    contexto.UsuarioCosto.AddRange(costos);
                }
                else if (tipo == 'a')
                {
                    var edicion = _costos.Where(x => contexto.UsuarioCosto.Select(y => y.IdUsuario).Contains(x.IdUsuario)).ToList();

                    foreach (var item in edicion)
                    {
                        var costo = contexto.UsuarioCosto.FirstOrDefault(x => x.IdUsuarioCosto == item.IdUsuarioCosto);

                        costo.CostoMensual = item.CostoMensual;
                        costo.CostoHora = item.CostoHora;
                        costo.IdUModifico = item.IdUCreo;
                        costo.FechaModifico = item.FechaCreo;
                    }
                }

                contexto.SaveChanges();

                return (true, Mensaje.MensajeGuardadoExito);
            }
        }

        public int RegistraAsistencia(long IdUsuario, int Tipo, string Conexion)
        {

            try
            {


                DateTime fecha = DateTime.Now;


                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {



                    var UA = contexto.UsuarioAsistencia.Where(w => w.Fecha.Year == fecha.Year && w.Fecha.Month == fecha.Month && w.Fecha.Day == fecha.Day && w.IdUsuario == IdUsuario).FirstOrDefault();


                    // Si no hay registro y quiere registrar algo que no sea entada
                    if (UA == null)

                    {

                        if (Tipo == 1)
                        {

                            UsuarioAsistencia ua = new UsuarioAsistencia();

                            ua.IdUsuario = IdUsuario;
                            ua.Fecha = DateTime.Now;
                            ua.HoraEntrada = DateTime.Now;

                            contexto.UsuarioAsistencia.Add(ua);
                            contexto.SaveChanges();
                            return 1;
                        }
                        else
                        {


                            return -1;
                        }


                    }
                    else
                    {

                        if (Tipo == 2 && UA.HoraEntrada != null)
                        {


                            UA.HoraSalidaComer = DateTime.Now;
                            contexto.SaveChanges();
                            return 2;

                        }
                        else
                        {
                            if (Tipo == 3 && UA.HoraSalidaComer != null)
                            {


                                UA.HoraEntradaComer = DateTime.Now;
                                contexto.SaveChanges();
                                return 3;

                            }
                            else
                            {
                                if (Tipo == 4 && UA.HoraEntradaComer != null)
                                {


                                    UA.HoraSalida = DateTime.Now;
                                    contexto.SaveChanges();
                                    return 4;

                                }
                                else
                                {


                                    return -4;
                                }

                                return -3;
                            }

                            return -2;
                        }







                    }




                }


            }
            catch (Exception ex)
            {

                throw ex;
            }



        }

        public UsuarioAsistenciaModel ConsultaAsistencia(long IdUsuario, DateTime Fecha, string Conexion)
        {

            try
            {
                UsuarioAsistenciaModel ua = new UsuarioAsistenciaModel();


                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {


                    ua = contexto.UsuarioAsistencia.Where(w => w.Fecha.Year == Fecha.Year &&
                                                           w.Fecha.Month == Fecha.Month &&
                                                           w.Fecha.Day == Fecha.Day &&
                                                           w.IdUsuario == IdUsuario).
                                                           Select(s => new UsuarioAsistenciaModel()
                                                           {

                                                               IdUsuario = s.IdUsuario,
                                                               IdUsuarioAsistencia = s.IdUsuarioAsistencia,
                                                               HoraEntrada = s.HoraEntrada,
                                                               HoraSalidaComer = s.HoraSalidaComer,
                                                               HoraEntradaComer = s.HoraEntradaComer,
                                                               HoraSalida = s.HoraSalida,
                                                               Fecha = s.Fecha

                                                           }).FirstOrDefault();

                }


                return ua;


            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public List<UsuarioIncidenciasModel> ConsultaIncidenciasFecha(DateTime Fecha, long? IdUsuario, string Conexion)
        {
            try
            {
                List<UsuarioIncidenciasModel> LstIncidencias = new List<UsuarioIncidenciasModel>();


                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;


                    LstIncidencias = (from m in contexto.UsuarioIncidencias
                                      join u in contexto.Usuario on m.IdUsuario equals u.IdUsuario
                                      join c in contexto.CatalogoGeneral on m.TipoIncidenciaId equals c.IdCatalogo
                                      where m.IdUsuario == (IdUsuario == null ? m.IdUsuario : IdUsuario) &&
                                            Fecha >= m.FechaInicio &&
                                            Fecha <= m.FechaFin
                                      select new UsuarioIncidenciasModel
                                      {
                                          IdIncidencia = m.IdIncidencia,
                                          IdUsuario = m.IdUsuario,
                                          TipoIncidenciaId = m.TipoIncidenciaId,
                                          FechaInicio = m.FechaInicio,
                                          FechaFin = m.FechaFin,
                                          DiasConsiderar = m.DiasConsiderar,
                                          Comentarios = m.Comentarios,
                                          TipoIncidenciaStr = c.DescLarga,
                                          Clave = u.NumEmpleado,
                                          UsuarioStr = u.Nombre + " " + u.ApPaterno + " " + u.ApMaterno
                                      }
                                   ).ToList();

                }


                return LstIncidencias;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public List<UsuarioIncidenciasModel> ConsultaIncidenciasRango(ControlAsistenciaModel Filtros, string Conexion)
        {
            try
            {
                List<UsuarioIncidenciasModel> LstIncidencias = new List<UsuarioIncidenciasModel>();


                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;



                    LstIncidencias = (from m in contexto.UsuarioIncidencias
                                      join u in contexto.Usuario on m.IdUsuario equals u.IdUsuario
                                      join c in contexto.CatalogoGeneral on m.TipoIncidenciaId equals c.IdCatalogo
                                      where m.IdUsuario == (Filtros.IdUsuario == null ? m.IdUsuario : Filtros.IdUsuario) &&
                                            ((m.FechaInicio >= Filtros.FechaInicio &&
                                            m.FechaInicio <= Filtros.FechaFin) || (m.FechaFin >= Filtros.FechaInicio &&
                                            m.FechaFin <= Filtros.FechaFin))
                                      select new UsuarioIncidenciasModel
                                      {
                                          IdIncidencia = m.IdIncidencia,
                                          IdUsuario = m.IdUsuario,
                                          TipoIncidenciaId = m.TipoIncidenciaId,
                                          FechaInicio = m.FechaInicio,
                                          FechaFin = m.FechaFin,
                                          DiasConsiderar = m.DiasConsiderar,
                                          Comentarios = m.Comentarios,
                                          TipoIncidenciaStr = c.DescLarga,
                                          Clave = u.NumEmpleado,
                                          UsuarioStr = u.Nombre + " " + u.ApPaterno + " " + u.ApMaterno
                                      }
                                   ).ToList();

                }


                return LstIncidencias;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }
        public List<UsuarioIncidenciasModel> ConsultaIncidenciasMes(ControlAsistenciaModel Filtros, string Conexion)
        {
            try
            {
                List<UsuarioIncidenciasModel> LstIncidencias = new List<UsuarioIncidenciasModel>();


                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;



                    LstIncidencias = (from m in contexto.UsuarioIncidencias
                                      join u in contexto.Usuario on m.IdUsuario equals u.IdUsuario
                                      join c in contexto.CatalogoGeneral on m.TipoIncidenciaId equals c.IdCatalogo
                                      where m.IdUsuario == (Filtros.IdUsuario == null ? m.IdUsuario : Filtros.IdUsuario) &&
                                            ((m.FechaInicio.Month == Filtros.IdMes &&
                                            m.FechaInicio.Year == Filtros.IdAnio) || (m.FechaFin.Month == Filtros.IdMes &&
                                            m.FechaFin.Year == Filtros.IdMes))
                                      select new UsuarioIncidenciasModel
                                      {
                                          IdIncidencia = m.IdIncidencia,
                                          IdUsuario = m.IdUsuario,
                                          TipoIncidenciaId = m.TipoIncidenciaId,
                                          FechaInicio = m.FechaInicio,
                                          FechaFin = m.FechaFin,
                                          DiasConsiderar = m.DiasConsiderar,
                                          Comentarios = m.Comentarios,
                                          TipoIncidenciaStr = c.DescLarga,
                                          Clave = u.NumEmpleado,
                                          UsuarioStr = u.Nombre + " " + u.ApPaterno + " " + u.ApMaterno
                                      }
                                   ).ToList();

                }


                return LstIncidencias;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        #region #Costos


        public List<UsuarioCostoMensualModel> ObtieneCostosMensuales(int Anio, int Mes, long IdUsuario, long IdTipoUsuario, string conexion)
        {

            try
            {
                using (var contexto = new BDProductividad_DEVEntities(conexion))
                {
                    var usuarioCostos =
                        (from uc in contexto.UsuarioCostoMensual
                         join u in contexto.Usuario on uc.IdUsuario equals u.IdUsuario
                         where uc.Anio == Anio && uc.Mes == Mes && u.IdTipoUsuario != 19
                         select new UsuarioCostoMensualModel
                         {
                             IdUsuarioCostoMensual = uc.IdUsuarioCostoMensual,
                             CostoMensual = uc.CostoMensual,
                             Anio = uc.Anio,
                             Mes = uc.Mes,
                             //NombreMes = NombreMes(uc.Mes),
                             Nombre = u.Nombre + " " + u.ApPaterno + " " + u.ApMaterno,
                             Clave = u.NumEmpleado,
                             IdUsuario = u.IdUsuario,
                             IdULider = u.IdUGerente,
                             LstDistrbucion = contexto.UsuarioCostoDistribucion.Where(w => w.Anio == uc.Anio && w.Mes == uc.Mes && w.IdUsuario == uc.IdUsuario).
                                                 Select(s => new UsuarioCostoDistribucionModel
                                                 {
                                                     IdProyecto = s.IdProyecto,
                                                     Proyecto = s.Proyecto.Nombre,
                                                     Porcentaje = s.Porcentaje
                                                 }).ToList()
                         }).ToList();



                    if (IdTipoUsuario == 15)
                    {



                        usuarioCostos = usuarioCostos.Where(w => w.IdULider == IdUsuario || w.IdUsuario == IdUsuario).ToList();
                    }

                    if (IdTipoUsuario == 14)
                    {

                        usuarioCostos = usuarioCostos.Where(w => w.IdUsuario == IdUsuario).ToList();
                    }


                    foreach (var i in usuarioCostos)
                    {

                        i.NombreMes = NombreMes(i.Mes);


                    }
                    return usuarioCostos;
                }
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public List<CostoAnualModel> ObtieneCostosAnuales(int anio, long IdUsuario, long IdTipoUsuario, string conexion)
        {
            try
            {
                using (var contexto = new BDProductividad_DEVEntities(conexion))
                {
                    // 1) Recupera todos los registros del año, excluyendo TipoUsuario 19
                    var baseQuery =
                        from uc in contexto.UsuarioCostoMensual
                        join u in contexto.Usuario on uc.IdUsuario equals u.IdUsuario
                        where uc.Anio == anio
                              && u.IdTipoUsuario != 19
                        select new
                        {
                            uc.Mes,
                            uc.CostoMensual,
                            u.IdUsuario,
                            u.IdUGerente
                        };

                    // 2) Aplica filtros según el tipo de usuario
                    if (IdTipoUsuario == 15)
                    {
                        baseQuery = baseQuery
                            .Where(x => x.IdUGerente == IdUsuario || x.IdUsuario == IdUsuario);
                    }
                    else if (IdTipoUsuario == 14)
                    {
                        baseQuery = baseQuery
                            .Where(x => x.IdUsuario == IdUsuario);
                    }

                    // 3) Agrupa por mes
                    var grupos = baseQuery
                        .GroupBy(x => x.Mes)
                        .ToDictionary(g => g.Key, g => new
                        {
                            TotalCosto = g.Sum(y => y.CostoMensual),
                            TotalRecursos = g.Count()
                        });

                    // 4) Genera un modelo para cada mes (1–12), rellenando ceros donde no haya datos
                    var resultado = Enumerable
                        .Range(1, 12)
                        .Select(m => new CostoAnualModel
                        {
                            Mes = m,
                            NombreMes = NombreMes(m),
                            TotalCosto = grupos.ContainsKey(m)
                                ? grupos[m].TotalCosto ?? 0m
                                : 0m,
                            TotalRecursos = grupos.ContainsKey(m)
                                ? grupos[m].TotalRecursos
                                : 0
                        })
                        .ToList();

                    return resultado;
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public (bool Estatus, string Mensaje) ImportarUsuarioCostoMensual(List<UsuarioCostoMensualModel> _costos, int Anio, int Mes, string conexionEF)
        {

            try
            {
                using (var contexto = new BDProductividad_DEVEntities(conexionEF))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;

                    //var LstGuardados = contexto.UsuarioCostoMensual.Where(w => w.Anio == Anio && w.Mes == Mes).ToList();

                    //contexto.UsuarioCostoMensual.RemoveRange(LstGuardados);

                    //contexto.SaveChanges();


                    var costos = new List<UsuarioCostoMensual>();

                    foreach (var item in _costos)
                    {
                        var c = contexto.UsuarioCostoMensual.Where(w => w.Anio == Anio && w.Mes == Mes && w.IdUsuario == item.IdUsuario).FirstOrDefault();

                        if (c != null)
                        {

                            c.CostoMensual = item.CostoMensual;

                        }
                        else
                        {

                            costos.Add(new UsuarioCostoMensual
                            {
                                IdUsuario = item.IdUsuario,
                                Anio = item.Anio,
                                Mes = item.Mes,
                                CostoMensual = item.CostoMensual,
                                IdUCreo = item.IdUCreo,
                                FechaCreo = item.FechaCreo
                            });
                        }


                    }

                    contexto.UsuarioCostoMensual.AddRange(costos);

                    contexto.SaveChanges();


                }

                return (true, Mensaje.MensajeGuardadoExito);
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }
        public List<UsuarioCostoMensualModel> ConsultaUsuariosCostoMensual(string Conexion)
        {
            try
            {
                List<UsuarioCostoMensualModel> LstUsuarios = new List<UsuarioCostoMensualModel>();
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    List<long> LstTIpoUsuario = new List<long>();
                    LstTIpoUsuario.Add(14);
                    LstTIpoUsuario.Add(15);
                    LstTIpoUsuario.Add(17);
                    LstTIpoUsuario.Add(20);

                    LstUsuarios = contexto.Usuario.Where(w => w.Activo == true && LstTIpoUsuario.Contains(w.IdTipoUsuario)).
                                   Select(s => new UsuarioCostoMensualModel
                                   {

                                       Clave = s.NumEmpleado,
                                       Nombre = s.Nombre + " " + s.ApPaterno + " " + s.ApMaterno,
                                       CostoMensual = 0
                                   }).ToList();
                }
                return LstUsuarios;
            }
            catch (Exception ex)
            {
                throw ex;
            }


        }

        public List<UsuarioCostoDistribucionModel> ObtieneDistribucionCosto(long IdUsuario, int Anio, int Mes, string Conexion)
        {
            try
            {
                List<UsuarioCostoDistribucionModel> LstCosto = new List<UsuarioCostoDistribucionModel>();


                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("ObtieneCostoDistribuido", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@Mes", Mes);
                sqlcmd.Parameters.AddWithValue("@Anio", Anio);
                sqlcmd.Parameters.AddWithValue("@IdUsuario", IdUsuario);


                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();
                var _lst = ds.Tables[0];



                LstCosto = (from row in _lst.AsEnumerable()
                            select (
                            new UsuarioCostoDistribucionModel
                            {

                                IdProyecto = long.Parse(row["IdProyecto"].ToString()),
                                Proyecto = row["Proyecto"].ToString(),
                                Porcentaje = decimal.Parse(row["Porcentaje"].ToString())
                            })).ToList();


                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();

                sqlcon.Close();


                return LstCosto;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public (bool Estatus, string Mensaje) EliminaDistribucionCosto(long IdUsuario, int Anio, int Mes, string Conexion)
        {
            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;

                    var c = contexto.UsuarioCostoMensual.Where(w => w.Anio == Anio && w.Mes == Mes && w.IdUsuario == IdUsuario).FirstOrDefault();

                    if (c != null)
                    {
                        contexto.UsuarioCostoMensual.Remove(c);
                        contexto.SaveChanges();
                    }
                }

                return (true, Mensaje.MensajeGuardadoExito);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public bool GuardarDistribucionCosto(List<UsuarioCostoDistribucionModel> LstCosto, int Anio, int Mes, long IdUsuario, long IdUsuarioCreo, string Conexion)
        {
            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {


                    var _lstActuales = contexto.UsuarioCostoDistribucion.Where(w => w.Anio == Anio && w.Mes == Mes && w.IdUsuario == IdUsuario).ToList();


                    contexto.UsuarioCostoDistribucion.RemoveRange(_lstActuales);


                    List<UsuarioCostoDistribucion> Lst = LstCosto.
                                                        Select(s => new UsuarioCostoDistribucion
                                                        {
                                                            Anio = Anio,
                                                            Mes = Mes,
                                                            IdUsuario = IdUsuario,
                                                            Porcentaje = s.Porcentaje,
                                                            IdProyecto = s.IdProyecto,
                                                            IdUCreo = IdUsuarioCreo,
                                                            FechaCreo = DateTime.Now
                                                        }).ToList();

                    contexto.UsuarioCostoDistribucion.AddRange(Lst);


                    contexto.SaveChanges();


                }



                return true;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        private static string NombreMes(int? Mes)
        {

            switch (Mes)
            {

                case 1: return "Enero";
                case 2: return "Febrero";
                case 3: return "Marzo";
                case 4: return "Abril";
                case 5: return "Mayo";
                case 6: return "Junio";
                case 7: return "Julio";
                case 8: return "Agosto";
                case 9: return "Septiembre";
                case 10: return "Octubre";
                case 11: return "Noviembre";
                case 12: return "Diciembte";
                default: return "";


            }

        }

        public bool GuardarFeels(UsuarioFeelsModel User, string Conexion)
        {
            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    UsuarioFeels u = new UsuarioFeels();
                    u.IdUsuario = User.IdUsuario;
                    u.Fecha = DateTime.Now;
                    //u.Comentarios = User.Comentarios;
                    u.Resultado = User.Resultado;

                    if (User.IdPregunta != 0)
                    {
                        PreguntaRespuesta p = new PreguntaRespuesta();


                        p.IdPregunta = User.IdPregunta;
                        p.IdUsuario = User.IdUsuario;
                        p.Respuesta = User.Comentarios;
                        p.FechaRespuesta = DateTime.Now;

                        contexto.PreguntaRespuesta.Add(p);

                    }


                    contexto.UsuarioFeels.Add(u);

                    contexto.SaveChanges();


                }


                return true;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public List<UsuarioFeelsModel> ConsultaFeels(long IdUsuario, string Conexion)
        {
            try
            {
                List<UsuarioFeelsModel> Lst = new List<UsuarioFeelsModel>();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    var fecha = DateTime.Now.AddDays(-8);
                    Lst = contexto.UsuarioFeels.
                        Where(w => w.IdUsuario == IdUsuario && w.Fecha >= fecha)
                        .Select(s => new UsuarioFeelsModel
                        {
                            Fecha = s.Fecha,
                            Resultado = s.Resultado

                        }).ToList();


                }


                return Lst;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public List<UsuarioFeelsModel> ConsultaFeedback(long IdUsuario, string Conexion)
        {
            try
            {
                List<UsuarioFeelsModel> Lst = new List<UsuarioFeelsModel>();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    var fecha = DateTime.Now.AddMonths(-6);
                    Lst = contexto.PreguntaRespuesta.
                        Where(w => w.IdUsuario == IdUsuario && w.FechaRespuesta >= fecha)
                        .Select(s => new UsuarioFeelsModel
                        {
                            IdPregunta = s.IdPregunta,
                            Pregunta = s.Pregunta.Pregunta1,
                            Comentarios = s.Respuesta,
                            Fecha = s.FechaRespuesta

                        }).ToList();


                }


                return Lst;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        #endregion



    }
}
