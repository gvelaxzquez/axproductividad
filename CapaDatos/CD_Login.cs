using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CapaDatos.DataBaseModel;
using CapaDatos.Models;
using System.Data;
using System.Data.SqlClient;
using DocumentFormat.OpenXml.Bibliography;

namespace CapaDatos
{
    public class CD_Login
    {

        public UsuarioModel Login(string Usuario, string Conexion)
        {
            try
            {
                UsuarioModel User = new UsuarioModel();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

             
                    contexto.Configuration.LazyLoadingEnabled = false;
                    User = contexto.Usuario.Where(u => u.Correo.Trim().ToUpper() == Usuario.Trim().ToUpper())
                        .Select(usu => new UsuarioModel()
                        {
                            IdUsuario = usu.IdUsuario,
                            NumEmpleado = usu.NumEmpleado,
                            Nombre = usu.Nombre,
                            ApPaterno = usu.ApPaterno,
                            ApMaterno = usu.ApMaterno,
                            Correo = usu.Correo,
                            IdTipoUsuario = usu.IdTipoUsuario,
                            IdUGerente = usu.IdUGerente,
                            DepartamentoId = usu.DepartamentoId,
                            IntentosBloqueo = usu.IntentosBloqueo,
                            Activo = usu.Activo,
                            Bloqueado = usu.Bloqueado,
                            Contrasena = usu.Contrasena,
                            FechaContrasena = usu.FechaContrasena,
                            NombreCompleto = usu.Nombre + " " + usu.ApPaterno + " " + usu.ApMaterno,
                            Captura= usu.Captura,
                            DescripcionDepartamento = usu.CatalogoGeneral.DescLarga
                        }).FirstOrDefault();


                    if (User != null)
                    {
                        var autorizaciones = (from c in contexto.Autorizacion
                                              join u in contexto.UsuarioAutorizacion on c.IdAutorizacion equals u.IdAutorizacion
                                              where u.IdUsuario == User.IdUsuario && c.Tipo == 1
                                              select u).ToList();

                        User.LstAurotizaciones = (from u in autorizaciones
                                                  select new UsuarioAutorizacionModel
                                                  {
                                                      IdAutorizacion = u.IdAutorizacion

                                                  }).ToList();
                            

                        User.VerPresupuesto = autorizaciones.Count == 0 ? false : true;
                    }


                }




                return User;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public int LoginV2(string Correo, string Contrasena, ref UsuarioModel Usuario)
        {
            try
            {
                long idUsuarioAcceso = 0;
                long idOrgA = 0;
                int CantOrg = 0;
                int Respuesta = 0;
                string Conexion = System.Configuration.ConfigurationManager.ConnectionStrings["BDAcceso"].ConnectionString;
                string ConexionEF = string.Empty;
                string ConexionSP = string.Empty;

                #region ValidaBDACCESO

                SqlDataReader SqlDr = null;

                SqlConnection sqlcon = new SqlConnection(Conexion);
                sqlcon.Open();
                SqlCommand sqlcmd = new SqlCommand("spLogin", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@Usuario", Correo);
                sqlcmd.Parameters.AddWithValue("@Contrasena",Encripta.EncriptaDatos( Contrasena)); 
                SqlDr = sqlcmd.ExecuteReader(CommandBehavior.CloseConnection);


                if (SqlDr.HasRows == true)
                {
                    SqlDr.Read();
                    Respuesta = SqlDr.GetInt32(0);
                    if (Respuesta == -1)
                    {
                        idUsuarioAcceso = Convert.ToInt64(SqlDr["IdCuenta"].ToString());
                        idOrgA = Convert.ToInt64(SqlDr["IdOrganizacion"].ToString());
                        CantOrg = Convert.ToInt32(SqlDr["CantOrg"].ToString());
                        ConexionEF = string.Format(DatosEstaticos.ConexionEF, Encripta.DesencriptaDatos(SqlDr["Servidor"].ToString()), SqlDr["BD"].ToString(), Encripta.DesencriptaDatos(SqlDr["Usuario"].ToString()), Encripta.DesencriptaDatos(SqlDr["Contrasena"].ToString()));
                        ConexionSP = string.Format(DatosEstaticos.ConexionSP, Encripta.DesencriptaDatos(SqlDr["Servidor"].ToString()), SqlDr["BD"].ToString(), Encripta.DesencriptaDatos(SqlDr["Usuario"].ToString()), Encripta.DesencriptaDatos(SqlDr["Contrasena"].ToString()));
                    }
                    else if (Respuesta == -4)
                    {
                        ConexionEF = string.Format(DatosEstaticos.ConexionEF, Encripta.DesencriptaDatos(SqlDr["Servidor"].ToString()), SqlDr["BD"].ToString(), Encripta.DesencriptaDatos(SqlDr["Usuario"].ToString()), Encripta.DesencriptaDatos(SqlDr["Contrasena"].ToString()));
                         AumentaIntentosV2(Correo, ConexionEF);

                        return Respuesta;
                    }
                    else if (Respuesta == -7) //autenticacion con AD
                    {
                        ConexionEF = string.Format(DatosEstaticos.ConexionEF, Encripta.DesencriptaDatos(SqlDr["Servidor"].ToString()), SqlDr["BD"].ToString(), Encripta.DesencriptaDatos(SqlDr["Usuario"].ToString()), Encripta.DesencriptaDatos(SqlDr["Contrasena"].ToString()));

                        string AD = string.Empty;
                        using (var cntexto = new BDProductividad_DEVEntities(ConexionEF))
                        {
                             AD = cntexto.Configuracion.Where(s => s.IdConf == 32).Select(s => s.Valor).FirstOrDefault();
                        }

                        try
                        {
                            var respuesta = LdapAuthentication.IsAuthenticated(AD, Correo, Contrasena);
                        }
                        catch (Exception)
                        {

                            return -7;
                        }
                      

                    

                        //AumentaIntentosV2(Correo, ConexionEF);

                        //return Respuesta;
                    }

                    else if (Respuesta == -6)
                    {
                        Usuario.IdUsuario = long.Parse(SqlDr["IdCuenta"].ToString());
                        return Respuesta;
                    }
                    else
                    {

                        return Respuesta;
                    }

                }

                sqlcon.Close();
                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();
                #endregion

                UsuarioModel User = new UsuarioModel();

                using (var contexto = new BDProductividad_DEVEntities(ConexionEF))
                {


                    contexto.Configuration.LazyLoadingEnabled = false;
                    User = contexto.Usuario.Where(u => u.Correo.Trim().ToUpper() == Correo.Trim().ToUpper())
                        .Select(usu => new UsuarioModel()
                        {
                            IdUsuario = usu.IdUsuario,
                            NumEmpleado = usu.NumEmpleado,
                            Nombre = usu.Nombre,
                            ApPaterno = usu.ApPaterno,
                            ApMaterno = usu.ApMaterno,
                            Correo = usu.Correo,
                            IdTipoUsuario = usu.IdTipoUsuario,
                            IdUGerente = usu.IdUGerente,
                            DepartamentoId = usu.DepartamentoId,
                            IntentosBloqueo = usu.IntentosBloqueo,
                            Activo = usu.Activo,
                            Bloqueado = usu.Bloqueado,
                            Contrasena = usu.Contrasena,
                            FechaContrasena = usu.FechaContrasena,
                            NombreCompleto = usu.Nombre + " " + usu.ApPaterno + " " + usu.ApMaterno,
                            Captura = usu.Captura,
                            DescripcionDepartamento = usu.CatalogoGeneral.DescLarga
                        }).FirstOrDefault();


                    if (User != null)
                    {
                        var autorizaciones = (from c in contexto.Autorizacion
                                              join u in contexto.UsuarioAutorizacion on c.IdAutorizacion equals u.IdAutorizacion
                                              where u.IdUsuario == User.IdUsuario && c.Tipo == 1
                                              select u).ToList();

                        User.LstAurotizaciones = (from u in autorizaciones
                                                  select new UsuarioAutorizacionModel
                                                  {
                                                      IdAutorizacion = u.IdAutorizacion

                                                  }).ToList();


                        User.VerPresupuesto = autorizaciones.Count == 0 ? false : true;

                        User.AdministraProy = contexto.ProyectoUsuario.Where(w => w.IdUsuario == User.IdUsuario && w.AdministraProy == true && w.Proyecto.EstatusId == 253).ToList().Count > 0 ? true : false;
                    }



                    User.CapturaF = contexto.UsuarioFeels.
                                    Where(w => w.IdUsuario == User.IdUsuario && w.Fecha.Year == DateTime.Now.Year && w.Fecha.Month == DateTime.Now.Month && w.Fecha.Day == DateTime.Now.Day).FirstOrDefault() == null ? 1 : 0;


                    User.CapturaF = bool.Parse(contexto.Configuracion.Where(w => w.IdConf == 34).FirstOrDefault().Valor) == true ? User.CapturaF : 0;
                   
                  
                    var Pregunta = contexto.Pregunta.Where(w => w.FechaIni <= DateTime.Now && w.FechaCierre >= DateTime.Now).FirstOrDefault();

                    User.Contesta = 0;
                    if(Pregunta!= null)
                    {
                        User.Contesta = contexto.PreguntaRespuesta.Where(w => w.IdUsuario == User.IdUsuario && w.IdPregunta == Pregunta.IdPregunta).FirstOrDefault() == null ? 1 : 0;
                        User.IdPregunta = Pregunta.IdPregunta;
                        User.Pregunta = Pregunta.Pregunta1;

                    }
                   
                   


                    LogEventos l = new LogEventos();
                    l.IdUsuario = User.IdUsuario;
                    l.Fecha = DateTime.Now;
                    l.TipoEventoId = 401;


                    contexto.LogEventos.Add(l);
                    contexto.SaveChanges();

                }

                User.IdOrganizacion = idOrgA;
                User.IdCuenta = idUsuarioAcceso;
                User.CantOrg = CantOrg;
                User.ConexionEF = Encripta.EncriptaDatos(ConexionEF);
                User.ConexionSP = Encripta.EncriptaDatos(ConexionSP);

                Usuario = User;

                return Respuesta;
           

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public int CambioOrganizacion(long IdOrganizacion,string Correo, ref UsuarioModel Usuario) {
            try
            {

         
                long idOrgA = 0;
           
                string ConexionEF = string.Empty;
                string ConexionSP = string.Empty;

                using (var acceso = new BDYITPRO_ACCESOSEntities()) {


                    var org= acceso.Organizacion.Where(w => w.IdOrganizacion == IdOrganizacion).FirstOrDefault();
                    idOrgA = org.IdOrganizacion;
                    ConexionEF = string.Format(DatosEstaticos.ConexionEF, Encripta.DesencriptaDatos(org.Servidor), org.BD, Encripta.DesencriptaDatos(org.Usuario), Encripta.DesencriptaDatos(org.Contrasena));
                    ConexionSP = string.Format(DatosEstaticos.ConexionSP, Encripta.DesencriptaDatos(org.Servidor), org.BD, Encripta.DesencriptaDatos(org.Usuario), Encripta.DesencriptaDatos(org.Contrasena));


                }


                UsuarioModel User = new UsuarioModel();

                using (var contexto = new BDProductividad_DEVEntities(ConexionEF))
                {


                    contexto.Configuration.LazyLoadingEnabled = false;
                    User = contexto.Usuario.Where(u => u.Correo.Trim().ToUpper() == Correo.Trim().ToUpper())
                        .Select(usu => new UsuarioModel()
                        {
                            IdUsuario = usu.IdUsuario,
                            NumEmpleado = usu.NumEmpleado,
                            Nombre = usu.Nombre,
                            ApPaterno = usu.ApPaterno,
                            ApMaterno = usu.ApMaterno,
                            Correo = usu.Correo,
                            IdTipoUsuario = usu.IdTipoUsuario,
                            IdUGerente = usu.IdUGerente,
                            DepartamentoId = usu.DepartamentoId,
                            IntentosBloqueo = usu.IntentosBloqueo,
                            Activo = usu.Activo,
                            Bloqueado = usu.Bloqueado,
                            Contrasena = usu.Contrasena,
                            FechaContrasena = usu.FechaContrasena,
                            NombreCompleto = usu.Nombre + " " + usu.ApPaterno + " " + usu.ApMaterno,
                            Captura = usu.Captura,
                            DescripcionDepartamento = usu.CatalogoGeneral.DescLarga
                        }).FirstOrDefault();


                    if (User != null)
                    {
                        var autorizaciones = (from c in contexto.Autorizacion
                                              join u in contexto.UsuarioAutorizacion on c.IdAutorizacion equals u.IdAutorizacion
                                              where u.IdUsuario == User.IdUsuario && c.Tipo == 1
                                              select u).ToList();

                        User.LstAurotizaciones = (from u in autorizaciones
                                                  select new UsuarioAutorizacionModel
                                                  {
                                                      IdAutorizacion = u.IdAutorizacion

                                                  }).ToList();


                        User.VerPresupuesto = autorizaciones.Count == 0 ? false : true;

                        User.AdministraProy = contexto.ProyectoUsuario.Where(w => w.IdUsuario == User.IdUsuario && w.AdministraProy == true && w.Proyecto.EstatusId == 253).ToList().Count > 0 ? true : false;
                    }



                    User.CapturaF = contexto.UsuarioFeels.
                                    Where(w => w.IdUsuario == User.IdUsuario && w.Fecha.Year == DateTime.Now.Year && w.Fecha.Month == DateTime.Now.Month && w.Fecha.Day == DateTime.Now.Day).FirstOrDefault() == null ? 1 : 0;


                    User.CapturaF = bool.Parse(contexto.Configuracion.Where(w => w.IdConf == 34).FirstOrDefault().Valor) == true ? User.CapturaF : 0;


                    var Pregunta = contexto.Pregunta.Where(w => w.FechaIni <= DateTime.Now && w.FechaCierre >= DateTime.Now).FirstOrDefault();

                    User.Contesta = 0;
                    if (Pregunta != null)
                    {
                        User.Contesta = contexto.PreguntaRespuesta.Where(w => w.IdUsuario == User.IdUsuario && w.IdPregunta == Pregunta.IdPregunta).FirstOrDefault() == null ? 1 : 0;
                        User.IdPregunta = Pregunta.IdPregunta;
                        User.Pregunta = Pregunta.Pregunta1;

                    }




                    LogEventos l = new LogEventos();
                    l.IdUsuario = User.IdUsuario;
                    l.Fecha = DateTime.Now;
                    l.TipoEventoId = 401;


                    contexto.LogEventos.Add(l);
                    contexto.SaveChanges();

                }

                User.IdOrganizacion = idOrgA;
                //User.IdCuenta = IdCuenta;
                //User.CantOrg = CantOrg;
                User.ConexionEF = Encripta.EncriptaDatos(ConexionEF);
                User.ConexionSP = Encripta.EncriptaDatos(ConexionSP);

                Usuario = User;


                return 1;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        
        }
       

        //public void AumentaIntentos(string Correo, string ConexionEF)
        //{
        //    try
        //    {
        //        using (var contexto = new BDProductividad_DEVEntities(ConexionEF))
        //        {
        //            contexto.Configuration.LazyLoadingEnabled = false;
        //            var Usuario = contexto.Usuario.Where(u => u.Correo == Correo).FirstOrDefault();

        //            if (Usuario != null)
        //            {
        //                Usuario.IntentosBloqueo = ;
        //                Usuario.Bloqueado = Bloqueado;

        //                contexto.SaveChanges();
        //            }
        //        }

        //    }
        //    catch (Exception ex)
        //    {

        //        throw ex;
        //    }
        //}

        public void AumentaIntentosV2(string Usuario, string Conexion)
        {
            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;
                    var User = contexto.Usuario.Where(u => u.Correo.Trim().ToUpper() == Usuario.Trim().ToUpper()).FirstOrDefault();
                    var confintentos = contexto.Configuracion.Where(w => w.IdConf == 7).Select(s => s.Valor).FirstOrDefault();
                    if (Usuario != null)
                    {
                        int? intentos = User.IntentosBloqueo + 1;
                        User.IntentosBloqueo = intentos;
                        User.Bloqueado = intentos >= int.Parse(confintentos) ? true : false; ;

                        contexto.SaveChanges();
                    }
                }

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public void ReseteoIntentoBloqueo(long IdUsuario, string Conexion)
        {
            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;
                    var Usuario = contexto.Usuario.Where(u => u.IdUsuario == IdUsuario).FirstOrDefault();
                    if (Usuario != null)
                    {
                        Usuario.IntentosBloqueo = 0;
                        contexto.SaveChanges();
                    }
                }

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
     
        public bool RecuperaContrasena(long IdUsuario, string Contrasena,  string Conexion)
        {
            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {


                    var user = contexto.Usuario.Where(i => i.IdUsuario == IdUsuario).FirstOrDefault();

                    user.Contrasena = Contrasena;
                    user.Bloqueado = false;
                    user.IntentosBloqueo = 0;
                    user.FechaContrasena = DateTime.Now.AddMonths(-6);


                    //Actualizo la principal
                    using (var accesos = new BDYITPRO_ACCESOSEntities())
                    {
                        Cuenta cta = accesos.Cuenta.Where(w => w.Correo == user.Correo).FirstOrDefault();
                        cta.Contrasena = Contrasena;
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

        public int ObtenerConexionUsuario(string Correo, ref string Conexion) {
            try
            {
           
 

                SqlDataReader SqlDr = null;
                int Respuesta = 0;
                string Con = System.Configuration.ConfigurationManager.ConnectionStrings["BDAcceso"].ConnectionString;
                SqlConnection sqlcon = new SqlConnection(Con);
                sqlcon.Open();
                SqlCommand sqlcmd = new SqlCommand("spConexionUsuario", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@Usuario", Correo);

                SqlDr = sqlcmd.ExecuteReader(CommandBehavior.CloseConnection);


                if (SqlDr.HasRows == true)
                {
                    SqlDr.Read();
                    Respuesta = SqlDr.GetInt32(0);
                    if (Respuesta == -1)
                    {
                        
                        Conexion = string.Format(DatosEstaticos.ConexionEF, Encripta.DesencriptaDatos(SqlDr["Servidor"].ToString()), SqlDr["BD"].ToString(), Encripta.DesencriptaDatos(SqlDr["Usuario"].ToString()), Encripta.DesencriptaDatos(SqlDr["Contrasena"].ToString()));

                    }

                }


                sqlcon.Close();
                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();

                return Respuesta;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public string ObtenerConexionOrganizaion(long IdOrganizacion)
        {
            try
            {

                string Conexion = string.Empty;
                SqlDataReader SqlDr = null;
                int Respuesta = 0;
                string Con = System.Configuration.ConfigurationManager.ConnectionStrings["BDAcceso"].ConnectionString;
                SqlConnection sqlcon = new SqlConnection(Con);
                sqlcon.Open();
                SqlCommand sqlcmd = new SqlCommand("spConexionOrganizacion", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdOrganizacion", IdOrganizacion);

                SqlDr = sqlcmd.ExecuteReader(CommandBehavior.CloseConnection);


                if (SqlDr.HasRows == true)
                {
                    SqlDr.Read();
                    Respuesta = SqlDr.GetInt32(0);
                    if (Respuesta == -1)
                    {

                        Conexion = string.Format(DatosEstaticos.ConexionEF, Encripta.DesencriptaDatos(SqlDr["Servidor"].ToString()), SqlDr["BD"].ToString(), Encripta.DesencriptaDatos(SqlDr["Usuario"].ToString()), Encripta.DesencriptaDatos(SqlDr["Contrasena"].ToString()));

                    }

                }


                sqlcon.Close();
                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();

                return Conexion;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }
        public string ObtenerConexionOrganizaionSP(long IdOrganizacion)
        {
            try
            {

                string Conexion = string.Empty;
                SqlDataReader SqlDr = null;
                int Respuesta = 0;
                string Con = System.Configuration.ConfigurationManager.ConnectionStrings["BDAcceso"].ConnectionString;
                SqlConnection sqlcon = new SqlConnection(Con);
                sqlcon.Open();
                SqlCommand sqlcmd = new SqlCommand("spConexionOrganizacion", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdOrganizacion", IdOrganizacion);

                SqlDr = sqlcmd.ExecuteReader(CommandBehavior.CloseConnection);


                if (SqlDr.HasRows == true)
                {
                    SqlDr.Read();
                    Respuesta = SqlDr.GetInt32(0);
                    if (Respuesta == -1)
                    {


                        Conexion = string.Format(DatosEstaticos.ConexionSP, Encripta.DesencriptaDatos(SqlDr["Servidor"].ToString()), SqlDr["BD"].ToString(), Encripta.DesencriptaDatos(SqlDr["Usuario"].ToString()), Encripta.DesencriptaDatos(SqlDr["Contrasena"].ToString()));
                    }

                }


                sqlcon.Close();
                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();

                return Conexion;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }


        public List<UsuarioModel> ConsultaOrganizaciones(long IdCuenta ) {

            try
            {

                List<UsuarioModel> Lst = new List<UsuarioModel>();

                using (var contexto = new BDYITPRO_ACCESOSEntities()) {

                    Lst = contexto.CuentaOrganizacion.Where(w => w.IdCuenta == IdCuenta).Select(s => new UsuarioModel()
                    {

                        IdOrganizacion = s.IdOrganizacion,
                        DescripcionDepartamento = s.Organizacion.Nombre

                    }).ToList();



                    var org = contexto.Cuenta.Where(w => w.IdCuenta == IdCuenta).Select(s => new UsuarioModel() 
                    { 
                        IdOrganizacion = s.IdOrganizacion,
                        DescripcionDepartamento= s.Organizacion.Nombre
                    
                    }).FirstOrDefault();


                    Lst.Add(org);


                }


                return Lst;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        
        }

    }
}
