using AxProductividad.ClasesAuxiliares;
using AxProductividad.Models;
using CapaDatos;
//using ClosedXML.Excel;
using CapaDatos.Constants;
using CapaDatos.DataBaseModel;
using CapaDatos.Models;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Web;

namespace AxProductividad
{
    public static class FuncionesGenerales
    {
        public static Sesion Sesion
        {
            get
            {
                return (Sesion)HttpContext.Current.Session["usuario" + HttpContext.Current.Session.SessionID];
            }
            set
            {
                HttpContext.Current.Session["usuario" + HttpContext.Current.Session.SessionID] = value;
            }
        }

        public static bool SesionActiva()
        {
            var mySession = HttpContext.Current.Session;
            return mySession["Usuario" + mySession.SessionID] != null;
        }

        public static bool PruebaServidor(ConfiguracionModel Configuracion)
        {

            System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

            var mail = new MailMessage();
            mail.To.Add(new MailAddress(Configuracion.MailUsuario, Configuracion.MailRemitente));
            mail.From = new MailAddress(Configuracion.MailUsuario, Configuracion.MailRemitente);
            mail.Subject = "Prueba del servidor";
            mail.Body = " ";
            mail.IsBodyHtml = false;

            var client = new SmtpClient(Configuracion.MailServidor, Convert.ToInt32(Configuracion.MailPuerto));

            using (client)
            {
                client.Credentials = new NetworkCredential(Configuracion.MailUsuario, Configuracion.MailContrasena);
                client.EnableSsl = Configuracion.MailSSL;
                client.Send(mail);
            }
            return true;
        }

        public static bool EnviarCorreoRegistro(UsuarioModel datosUsuario, string Conexion)
        {
            try
            {
                string mensaje;



                using (var rdr = File.OpenText(HttpContext.Current.Server.MapPath("~/HTMLCorreos/CorreoRegistro.html")))
                {
                    mensaje = rdr.ReadToEnd();
                    mensaje = mensaje.Replace("XNombre", datosUsuario.Nombre);
                    mensaje = mensaje.Replace("XCorreo", datosUsuario.Correo);
                    mensaje = mensaje.Replace("XContrasena", EncriptaPass.DesencriptaContrasena(datosUsuario.Contrasena));
                }

                CD_Configuracion cd_Conf = new CD_Configuracion();


                var configuracion = cd_Conf.ObtenerConfiguracion(Conexion);

                System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

                var mail = new MailMessage();
                mail.To.Add(new MailAddress(datosUsuario.Correo, datosUsuario.Nombre));
                var nombresistema = ConfigurationManager.AppSettings["NombreSistema"];

                mail.From = new MailAddress(configuracion.MailUsuario, configuracion.MailRemitente);
                mail.Subject = nombresistema + " - Contraseña para ingresar al sistema";
                mail.Body = mensaje;
                mail.IsBodyHtml = true;
                var altView = AlternateView.CreateAlternateViewFromString(mensaje, null, "text/html");
                mail.AlternateViews.Add(altView);
                var client = new SmtpClient(configuracion.MailServidor, Convert.ToInt32(configuracion.MailPuerto));

                using (client)
                {
                    client.Credentials = new NetworkCredential(configuracion.MailUsuario, configuracion.MailContrasena);
                    client.EnableSsl = configuracion.MailSSL;
                    client.Send(mail);
                }
                return true;
            }
            catch (Exception)
            {

                return false;
            }
        }

        public static bool EnviarCorreoContrasenaNuea(UsuarioModel datosUsuario, string Conexion)
        {
            try
            {
                string mensaje;
                using (var rdr = File.OpenText(HttpContext.Current.Server.MapPath("~/HTMLCorreos/CorreoCambioContrasena.html")))
                {
                    mensaje = rdr.ReadToEnd();
                    mensaje = mensaje.Replace("XNombre", datosUsuario.Nombre);
                    mensaje = mensaje.Replace("XContrasena", EncriptaPass.DesencriptaContrasena(datosUsuario.Contrasena));
                }

                CD_Configuracion cd_Conf = new CD_Configuracion();
                var configuracion = cd_Conf.ObtenerConfiguracion(Conexion);
                var nombresistema = ConfigurationManager.AppSettings["NombreSistema"];


                System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

                var mail = new MailMessage();
                mail.To.Add(new MailAddress(datosUsuario.Correo, datosUsuario.Nombre));

                mail.From = new MailAddress(configuracion.MailUsuario, configuracion.MailRemitente);
                mail.Subject = nombresistema + " - Contraseña para ingresar al sistema.";
                mail.Body = mensaje;
                mail.IsBodyHtml = true;
                var altView = AlternateView.CreateAlternateViewFromString(mensaje, null, "text/html");
                mail.AlternateViews.Add(altView);

                var client = new SmtpClient(configuracion.MailServidor, Convert.ToInt32(configuracion.MailPuerto));


                using (client)
                {
                    client.Credentials = new NetworkCredential(configuracion.MailUsuario, configuracion.MailContrasena);
                    client.EnableSsl = configuracion.MailSSL;
                    client.Send(mail);
                }
                return true;
            }
            catch (Exception ex)
            {
                var t = ex;
                return false;
            }
        }


        public static bool EnviarCorreoRechazarActividad(long IdActividad, ActividadesModel Actividad, string Conexion)
        {
            try
            {

                CD_Actividad cd_act = new CD_Actividad();



                string NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
                var datoscorreo = cd_act.ConsultaRechazo(IdActividad, Conexion);
                string link = ConfigurationManager.AppSettings["UrlSistema"] + "share/s/" + Actividad.IdActividad.ToString();
                string mensaje;
                using (var rdr = File.OpenText(HttpContext.Current.Server.MapPath("~/HTMLCorreos/CorreoActividadRechazadav2.html")))
                {
                    mensaje = rdr.ReadToEnd();
                    mensaje = mensaje.Replace("XClave", Actividad.ProyectoStr);
                    mensaje = mensaje.Replace("XIdActividad", Actividad.IdActividadStr);

                    mensaje = mensaje.Replace("XMOTIVORECHAZO", datoscorreo.MotivoRechazoStr);
                    mensaje = mensaje.Replace("XDESCRIPCIONRECHAZO", datoscorreo.DescripcionRechazo);
                    mensaje = mensaje.Replace("XUAsignado", datoscorreo.UsuarioRechazoStr);
                    mensaje = mensaje.Replace("XFECHARECHAZO", DateTime.Parse(datoscorreo.FechaRechazo.ToString()).ToShortDateString());

                    mensaje = mensaje.Replace("XLink", link);
                }

                CD_Configuracion cd_Conf = new CD_Configuracion();
                var configuracion = cd_Conf.ObtenerConfiguracion(Conexion);

                System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

                var mail = new MailMessage();

                //mail.To.Add(datoscorreo.CorreoAsignado);
                //mail.CC.Add(Actividad.CorreoLider);
                mail.To.Add("jmmezquitic@gmail.com");

                mail.From = new MailAddress(configuracion.MailUsuario, configuracion.MailRemitente);
                mail.Subject = NombreSistema + " - Rechazo de actividad " + Actividad.IdActividadStr;
                mail.Body = mensaje;
                mail.IsBodyHtml = true;
                var altView = AlternateView.CreateAlternateViewFromString(mensaje, null, "text/html");
                mail.AlternateViews.Add(altView);

                var client = new SmtpClient(configuracion.MailServidor, Convert.ToInt32(configuracion.MailPuerto));

                using (client)
                {
                    client.Credentials = new NetworkCredential(configuracion.MailUsuario, configuracion.MailContrasena);
                    client.EnableSsl = configuracion.MailSSL;
                    client.Send(mail);
                }
                return true;
            }
            catch (Exception)
            {

                return false;
            }
        }
        public static bool EnviarCorreoSolicitaRevision(ActividadesModel Actividad, long IdUsuario, string Conexion)
        {
            try
            {

                string link = ConfigurationManager.AppSettings["UrlSistema"] + "share/s/" + Actividad.IdActividad.ToString();
                string NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
                string mensaje;
                using (var rdr = File.OpenText(HttpContext.Current.Server.MapPath("~/HTMLCorreos/CorreoRevisionActividadv2.html")))
                {
                    mensaje = rdr.ReadToEnd();
                    mensaje = mensaje.Replace("XClave", Actividad.ProyectoStr);
                    mensaje = mensaje.Replace("XIdActividad", Actividad.IdActividadStr);
                    mensaje = mensaje.Replace("XDescripcion", Actividad.BR);
                    mensaje = mensaje.Replace("XUAsignado", Actividad.AsignadoStr);
                    mensaje = mensaje.Replace("XFECHAHORA", DateTime.Now.ToString());
                    mensaje = mensaje.Replace("XLink", link);



                }

                CD_Configuracion cd_Conf = new CD_Configuracion();
                var configuracion = cd_Conf.ObtenerConfiguracion(Conexion);

                System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

                var mail = new MailMessage();

                mail.To.Add(Actividad.CorreoResponsable);
                //mail.To.Add(Actividad.CorreoLider);
                //mail.Bcc.Add("soporte@yitpro.com");

                mail.From = new MailAddress(configuracion.MailUsuario, configuracion.MailRemitente);
                mail.Subject = NombreSistema + " - Solicitud de aprobación";
                mail.Body = mensaje;
                mail.IsBodyHtml = true;
                var altView = AlternateView.CreateAlternateViewFromString(mensaje, null, "text/html");
                mail.AlternateViews.Add(altView);

                var client = new SmtpClient(configuracion.MailServidor, Convert.ToInt32(configuracion.MailPuerto));

                using (client)
                {
                    client.Credentials = new NetworkCredential(configuracion.MailUsuario, configuracion.MailContrasena);
                    client.EnableSsl = configuracion.MailSSL;
                    client.Send(mail);
                }
                return true;
            }
            catch (Exception)
            {

                return false;
            }
        }



        public static bool EnviarCorreoLiberaActividad(ActividadesModel Actividad, UsuarioModel User, string Conexion)
        {
            try
            {

                string link = ConfigurationManager.AppSettings["UrlSistema"] + "share/s/" + Actividad.IdActividad.ToString();
                string NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
                string mensaje;
                using (var rdr = File.OpenText(HttpContext.Current.Server.MapPath("~/HTMLCorreos/CorreoActividadLiberada.html")))
                {
                    mensaje = rdr.ReadToEnd();
                    mensaje = mensaje.Replace("XClave", Actividad.ProyectoStr);
                    mensaje = mensaje.Replace("XIdActividad", Actividad.IdActividadStr);
                    mensaje = mensaje.Replace("XDescripcion", Actividad.BR);
                    mensaje = mensaje.Replace("XUAsignado", User.NombreCompleto);
                    mensaje = mensaje.Replace("XFECHAHORA", DateTime.Now.ToString());
                    mensaje = mensaje.Replace("XLink", link);



                }

                CD_Configuracion cd_Conf = new CD_Configuracion();
                var configuracion = cd_Conf.ObtenerConfiguracion(Conexion);

                System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

                var mail = new MailMessage();

                mail.To.Add(Actividad.CorreoAsignado);
                mail.CC.Add(Actividad.CorreoLider);
                mail.CC.Add(User.Correo);


                mail.From = new MailAddress(configuracion.MailUsuario, configuracion.MailRemitente);
                mail.Subject = NombreSistema + " - Aprobación";
                mail.Body = mensaje;
                mail.IsBodyHtml = true;
                var altView = AlternateView.CreateAlternateViewFromString(mensaje, null, "text/html");
                mail.AlternateViews.Add(altView);

                var client = new SmtpClient(configuracion.MailServidor, Convert.ToInt32(configuracion.MailPuerto));

                using (client)
                {
                    client.Credentials = new NetworkCredential(configuracion.MailUsuario, configuracion.MailContrasena);
                    client.EnableSsl = configuracion.MailSSL;
                    client.Send(mail);
                }
                return true;
            }
            catch (Exception)
            {

                return false;
            }
        }

        public static bool EnviarCorreoCambioEnFlujo(ActividadesModel Actividad, long IdUsuario,string NombreUsuario, string Conexion)
        {
            try
            {

                string link = ConfigurationManager.AppSettings["UrlSistema"] + "share/s/" + Actividad.IdActividad.ToString();
                string NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
                string mensaje;
                using (var rdr = File.OpenText(HttpContext.Current.Server.MapPath("~/HTMLCorreos/CorreoActividad.html")))
                {
                    mensaje = rdr.ReadToEnd();
                    mensaje = mensaje.Replace("XIdActividad",  Actividad.ClaveProyecto + "-" +  Actividad.IdActividad.ToString());
                    mensaje = mensaje.Replace("XTipo", Actividad.TipoNombre);
                    mensaje = mensaje.Replace("XDescripcion", Actividad.BR);
                    //mensaje = mensaje.Replace("XAnterior ", Actividad.ResponsableStr);
                    mensaje = mensaje.Replace("XNuevo", Actividad.AsignadoStr);
                    mensaje = mensaje.Replace("XUsuario", NombreUsuario);
                    mensaje = mensaje.Replace("XFECHAHORA", DateTime.Now.ToString());
                    mensaje = mensaje.Replace("XLink", link);



                }

                CD_Configuracion cd_Conf = new CD_Configuracion();
                var configuracion = cd_Conf.ObtenerConfiguracion(Conexion);

                System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

                var mail = new MailMessage();
                if (Actividad.TipoId == 1)
                {
                    mail.To.Add(Actividad.CorreoResponsable);

                }
                else if (Actividad.TipoId == 2)
                {
                    mail.To.Add(Actividad.CorreoAsignado);

                }
                else if (Actividad.TipoId == 3)
                {

                    mail.To.Add(Actividad.CorreoLider);
                }
                else if (Actividad.TipoId == 4) {
                    mail.To.Add(Actividad.CorreoResponsable);
                    mail.To.Add(Actividad.CorreoAsignado);
                    mail.To.Add(Actividad.CorreoAsignado);

                }
                //mail.To.Add(Actividad.CorreoResponsable);
                //mail.To.Add(Actividad.CorreoLider);
                //mail.Bcc.Add("soporte@yitpro.com");

                mail.From = new MailAddress(configuracion.MailUsuario, configuracion.MailRemitente);
                mail.Subject = NombreSistema + " - Se envío el elemento " + Actividad.ClaveProyecto + "-" + Actividad.IdActividad.ToString() + " a " + Actividad.AsignadoStr   ;
                mail.Body = mensaje;
                mail.IsBodyHtml = true;
                var altView = AlternateView.CreateAlternateViewFromString(mensaje, null, "text/html");
                mail.AlternateViews.Add(altView);

                var client = new SmtpClient(configuracion.MailServidor, Convert.ToInt32(configuracion.MailPuerto));

                using (client)
                {
                    client.Credentials = new NetworkCredential(configuracion.MailUsuario, configuracion.MailContrasena);
                    client.EnableSsl = configuracion.MailSSL;
                    client.Send(mail);
                }
                return true;
            }
            catch (Exception)
            {

                return false;
            }
        }

        public static bool EnviarCorreoComentario(ActividadesModel Actividad, UsuarioModel User, string Comentario, string Conexion)
        {
            try
            {

                string link = ConfigurationManager.AppSettings["UrlSistema"] + "share/s/" + Actividad.IdActividad.ToString();
                string NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
                string mensaje;
                using (var rdr = File.OpenText(HttpContext.Current.Server.MapPath("~/HTMLCorreos/CorreoComentarioActividad.html")))
                {
                    mensaje = rdr.ReadToEnd();
                    mensaje = mensaje.Replace("XClave", Actividad.ProyectoStr);
                    mensaje = mensaje.Replace("XIdActividad", Actividad.IdActividadStr);
                    mensaje = mensaje.Replace("XDescripcion", Actividad.BR);
                    mensaje = mensaje.Replace("XUAsignado", User.NombreCompleto);
                    mensaje = mensaje.Replace("XComentario", Comentario);
                    mensaje = mensaje.Replace("XFECHAHORA", DateTime.Now.ToString());
                    mensaje = mensaje.Replace("XLink", link);



                }

                CD_Configuracion cd_Conf = new CD_Configuracion();
                var configuracion = cd_Conf.ObtenerConfiguracion(Conexion);

                System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

                var mail = new MailMessage();

                mail.To.Add(Actividad.CorreoAsignado);
                mail.CC.Add(Actividad.CorreoLider);
                //mail.CC.Add(User.Correo);


                mail.From = new MailAddress(configuracion.MailUsuario, configuracion.MailRemitente);
                mail.Subject = "YITPRO | Comentarios actividad " + Actividad.IdActividadStr;
                mail.Body = mensaje;
                mail.IsBodyHtml = true;
                var altView = AlternateView.CreateAlternateViewFromString(mensaje, null, "text/html");
                mail.AlternateViews.Add(altView);

                var client = new SmtpClient(configuracion.MailServidor, Convert.ToInt32(configuracion.MailPuerto));

                using (client)
                {
                    client.Credentials = new NetworkCredential(configuracion.MailUsuario, configuracion.MailContrasena);
                    client.EnableSsl = configuracion.MailSSL;
                    client.Send(mail);
                }
                return true;
            }
            catch (Exception)
            {

                return false;
            }
        }

        public static bool EnviarCorreoActividad(ActividadesModel Actividad, UsuarioModel User, string Correos, string Comentario, string Conexion)
        {
            try
            {

                string link = ConfigurationManager.AppSettings["UrlSistema"] + "share/s/" + Actividad.IdActividad.ToString();
                string NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
                string mensaje;
                using (var rdr = File.OpenText(HttpContext.Current.Server.MapPath("~/HTMLCorreos/CorreoEnviarActividad.html")))
                {
                    mensaje = rdr.ReadToEnd();
                    mensaje = mensaje.Replace("XCOMENTARIO", Comentario);
                    mensaje = mensaje.Replace("XCONTENIDO", Actividad.Descripcion);
                    mensaje = mensaje.Replace("XLink", link);



                }

                CD_Configuracion cd_Conf = new CD_Configuracion();
                var configuracion = cd_Conf.ObtenerConfiguracion(Conexion);

                System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

                var mail = new MailMessage();



                //foreach (var a in Actividad.Archivos) {

                //    Attachment data = new Attachment(a.Url, MediaTypeNames.Application.Octet);
                //}

              

                foreach (var c in Correos.Split(',')) {

                    mail.To.Add(c);
                }
                //mail.To.Add("jmmezquitic@gmail.com");
                //mail.To.Add("jmartinez@axsistec.com");

                mail.From = new MailAddress(configuracion.MailUsuario, User.NombreCompleto);
                mail.Subject = "YITPRO | " + Actividad.BR;
                mail.Body = mensaje;
                mail.IsBodyHtml = true;
                var altView = AlternateView.CreateAlternateViewFromString(mensaje, null, "text/html");
                mail.AlternateViews.Add(altView);

                var client = new SmtpClient(configuracion.MailServidor, Convert.ToInt32(configuracion.MailPuerto));

                using (client)
                {
                    client.Credentials = new NetworkCredential(configuracion.MailUsuario, configuracion.MailContrasena);
                    client.EnableSsl = configuracion.MailSSL;
                    client.Send(mail);
                }
                return true;
            }
            catch (Exception)
            {

                return false;
            }
        }

        public static bool EnviarCorreoActividadEnlace(ActividadesModel Actividad, UsuarioModel User, string Correos, string Comentario, string Conexion)
        {
            try
            {

                string link = ConfigurationManager.AppSettings["UrlSistema"] + "share/s/" + Actividad.IdActividad.ToString();
                string NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
                string mensaje;
                using (var rdr = File.OpenText(HttpContext.Current.Server.MapPath("~/HTMLCorreos/CorreoEnviarActividadEnlace.html")))
                {
                    mensaje = rdr.ReadToEnd();
                    mensaje = mensaje.Replace("XCOMENTARIO", Comentario);
                    mensaje = mensaje.Replace("XIdActividad", Actividad.IdActividad.ToString());
                    mensaje = mensaje.Replace("XDescripcion", Actividad.BR);
                    mensaje = mensaje.Replace("XLink", link);



                }

                CD_Configuracion cd_Conf = new CD_Configuracion();
                var configuracion = cd_Conf.ObtenerConfiguracion(Conexion);

                System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

                var mail = new MailMessage();


                foreach (var c in Correos.Split(','))
                {

                    mail.To.Add(c);
                }


                mail.From = new MailAddress(configuracion.MailUsuario, User.NombreCompleto);
                mail.Subject = "YITPRO | " +  Actividad.BR;
                mail.Body = mensaje;
                mail.IsBodyHtml = true;
                var altView = AlternateView.CreateAlternateViewFromString(mensaje, null, "text/html");
                mail.AlternateViews.Add(altView);

                var client = new SmtpClient(configuracion.MailServidor, Convert.ToInt32(configuracion.MailPuerto));

                using (client)
                {
                    client.Credentials = new NetworkCredential(configuracion.MailUsuario, configuracion.MailContrasena);
                    client.EnableSsl = configuracion.MailSSL;
                    client.Send(mail);
                }
                return true;
            }
            catch (Exception)
            {

                return false;
            }
        }

        public static bool EnviarCorreoInitacionWorkSpace( UsuarioModel User, WorkSpaceModel W, string Conexion)
        {
            try
            {

                string link = ConfigurationManager.AppSettings["UrlSistema"] + "Workspace/w/" + W.IdUnique;
                string NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
                string mensaje;
                using (var rdr = File.OpenText(HttpContext.Current.Server.MapPath("~/HTMLCorreos/WorkspaceInvitation.html")))
                {
                    mensaje = rdr.ReadToEnd();
                    mensaje = mensaje.Replace("XWorkspace", W.Nombre);
                    mensaje = mensaje.Replace("XLink", link);



                }

                CD_Configuracion cd_Conf = new CD_Configuracion();
                var configuracion = cd_Conf.ObtenerConfiguracion(Conexion);

                System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

                var mail = new MailMessage();

                mail.CC.Add(User.Correo);


                mail.From = new MailAddress(configuracion.MailUsuario, configuracion.MailRemitente);
                mail.Subject = "YITPRO | Invitación para unirte a " + W.Nombre;
                mail.Body = mensaje;
                mail.IsBodyHtml = true;
                var altView = AlternateView.CreateAlternateViewFromString(mensaje, null, "text/html");
                mail.AlternateViews.Add(altView);

                var client = new SmtpClient(configuracion.MailServidor, Convert.ToInt32(configuracion.MailPuerto));

                using (client)
                {
                    client.Credentials = new NetworkCredential(configuracion.MailUsuario, configuracion.MailContrasena);
                    client.EnableSsl = configuracion.MailSSL;
                    client.Send(mail);
                }
                return true;
            }
            catch (Exception)
            {

                return false;
            }
        }




        public static bool ValidaPermisos(int Permiso)
        {
            try
            {
                bool Autorizado;


                CD_Usuario cdUser = new CD_Usuario();
                UsuarioPermisos permisos = new UsuarioPermisos();


                var mySession = HttpContext.Current.Session;
                long IdUsuario = ((Sesion)mySession["Usuario" + mySession.SessionID]).Usuario.IdUsuario;
                String Conexion = EncriptaPass.DesencriptaContrasena(((Sesion)mySession["Usuario" + mySession.SessionID]).Usuario.ConexionEF);
                string Controlador = ((String)mySession["Controlador" + mySession.SessionID]);

                permisos = cdUser.ObtenerPermisosControlador(IdUsuario, Controlador, Conexion);


                //0.- Ver
                //1.- Guardar
                //2.- Editar
                //3.- Imprimir
                //4.- Eliminar

                if (permisos != null)
                {
                    switch (Permiso)
                    {

                        case 0:
                            Autorizado = permisos.Ver;
                            break;
                        case 1:
                            Autorizado = permisos.Guardar;
                            break;
                        case 2:
                            Autorizado = permisos.Modificar;
                            break;
                        case 3:
                            Autorizado = permisos.Imprimir;
                            break;
                        case 4:
                            Autorizado = permisos.Eliminar;
                            break;
                        default:
                            Autorizado = false;
                            break;

                    }
                }
                else
                {

                    Autorizado = false;
                }



                return Autorizado;


            }
            catch (Exception ex)
            {

                throw ex;
            }

        }
        public static bool ValidaPermisosAccion(int Permiso)
        {
            try
            {
                bool Autorizado;


                CD_Usuario cdUser = new CD_Usuario();
                UsuarioPermisos permisos = new UsuarioPermisos();


                var mySession = HttpContext.Current.Session;
                long IdUsuario = ((Sesion)mySession["Usuario" + mySession.SessionID]).Usuario.IdUsuario;
                String Conexion = EncriptaPass.DesencriptaContrasena(((Sesion)mySession["Usuario" + mySession.SessionID]).Usuario.ConexionEF);
                string Accion = ((String)mySession["Accion" + mySession.SessionID]);

                permisos = cdUser.ObtenerPermisosAccion(IdUsuario, Accion, Conexion);


                //0.- Ver
                //1.- Guardar
                //2.- Editar
                //3.- Imprimir
                //4.- Eliminar

                if (permisos != null)
                {
                    switch (Permiso)
                    {

                        case 0:
                            Autorizado = permisos.Ver;
                            break;
                        case 1:
                            Autorizado = permisos.Guardar;
                            break;
                        case 2:
                            Autorizado = permisos.Modificar;
                            break;
                        case 3:
                            Autorizado = permisos.Imprimir;
                            break;
                        case 4:
                            Autorizado = permisos.Eliminar;
                            break;
                        default:
                            Autorizado = false;
                            break;

                    }
                }
                else
                {

                    Autorizado = false;
                }



                return Autorizado;


            }
            catch (Exception ex)
            {

                throw ex;
            }

        }
        public static string ConvierteCatalogoGeneralHtmlCombox(List<CatalogoGeneralModel> lstCatalogos, bool multiple = false, bool descCorta = false, long idSeleccionado = 0)
        {
            var htmlCmb = "";
            if (!multiple)
                htmlCmb = "<option value='-1'>--Seleccionar--</option>";
            // Ordenamos la lista por si viene en desorden.
            foreach (var item in lstCatalogos.OrderBy(cat => descCorta ? cat.DescCorta : cat.DescLarga).ToList())
            {
                var selected = idSeleccionado == item.IdCatalogo ? "selected" : "";
                htmlCmb += $"<option data-especial='{item.DatoEspecial ?? string.Empty}'  " + selected + " value='" + item.IdCatalogo + "'>" + (descCorta ? item.DescCorta : item.DescLarga) + "</option>";
            }
            return htmlCmb;
        }

        public static string ConvierteCatalogoGeneralHtmlComboxPrioridad(List<CatalogoGeneralModel> lstCatalogos, bool multiple = false, bool descCorta = false, long idSeleccionado = 0)
        {
            var htmlCmb = "";
            if (!multiple)
                htmlCmb = "<option value='-1'>--Seleccionar--</option>";
            // Ordenamos la lista por si viene en desorden.
            foreach (var item in lstCatalogos.OrderBy(cat => descCorta ? cat.DescCorta : cat.DescLarga).ToList())
            {
                var selected = idSeleccionado == item.IdCatalogo ? "selected" : "";
                htmlCmb += $"<option data-especial='{item.DatoEspecial ?? string.Empty}'  " + selected + " value='" + item.DescCorta + "'>" + (descCorta ? item.DescCorta : item.DescLarga) + "</option>";
            }
            return htmlCmb;
        }


        public static string ConvierteCatalogoGeneralHtmlComboxAgrupado(List<CatalogoGeneralModel> lstCatalogos)
        {
            var htmlCmb = "<option value='-1'>--Seleccionar--</option>";
            List<string> LstGrupo = lstCatalogos.Select(s => s.DescCorta).ToList().Distinct().ToList();

            foreach (var a in LstGrupo)
            {

                htmlCmb += " <optgroup label='" + a + "'>";

                lstCatalogos.OrderBy(cat => cat.DescLarga).ToList();
                foreach (var item in lstCatalogos.Where(w => w.DescCorta == a).OrderBy(cat => cat.DescLarga).ToList())
                {
                    htmlCmb += "<option value='" + item.IdCatalogo + "'>" + item.DescLarga + "</option>";
                }

                htmlCmb += "</optgroup>";
            }

            // Ordenamos la lista por si viene en desorden.

            return htmlCmb;
        }

        public static string ConvierteCatalogoGeneralHtmlCombox2(List<CatalogoGeneralModel> lstCatalogos)
        {
            var htmlCmb = "<option value='-1'>--Seleccionar--</option>";
            // Ordenamos la lista por si viene en desorden.
            //lstCatalogos.OrderBy(cat => cat.DescLarga).ToList();
            foreach (var item in lstCatalogos)
            {
                htmlCmb += "<option value='" + item.IdCatalogo + "'>" + item.DescLarga + "</option>";
            }
            return htmlCmb;
        }
        public static string ConvierteAniosHtmlCombox(List<CatalogoGeneralModel> lstCatalogos)
        {
            var htmlCmb = "<option value='-1'>--Seleccionar--</option>";
            // Ordenamos la lista por si viene en desorden.
            //lstCatalogos.OrderBy(cat => cat.DescLarga).ToList();
            foreach (var item in lstCatalogos)
            {
                htmlCmb += "<option value='" + item.DescCorta + "'>" + item.DescCorta + "</option>";
            }
            return htmlCmb;
        }

        public static string ConvierteCatalogoGeneralHtmlComboxMultiple(List<CatalogoGeneralModel> lstCatalogos)
        {
            var htmlCmb = "";
            // Ordenamos la lista por si viene en desorden.
            lstCatalogos.OrderBy(cat => cat.DescLarga).ToList();
            foreach (var item in lstCatalogos.OrderBy(cat => cat.DescLarga).ToList())
            {
                htmlCmb += "<option value='" + item.IdCatalogo + "'>" + item.DescLarga + "</option>";
            }
            return htmlCmb;
        }
        public static string ConvierteCatalogoGeneralHtmlImagen(List<CatalogoGeneralModel> lstCatalogos, string URL = "", bool multiple = false)
        {
            var htmlCmb = "";
            if (!multiple)
                htmlCmb = "<option value='-1'>--Seleccionar--</option>";
            URL = URL == "" ? "/Archivos/Fotos/" : URL;
            // string image = "<span><img class='img-dt' src='http://app.yitpro.com/Archivos/Fotos/MST.jpg'' alt='MST' style='width:30px; height:30px;'>  Enero</span>";
            // Ordenamos la lista por si viene en desorden.
            lstCatalogos.OrderBy(cat => cat.DescLarga).ToList();
            foreach (var item in lstCatalogos.OrderBy(cat => cat.DescLarga).ToList())


            {
                string image = "<span><img class='img-dt' src='" + URL + "" + item.DescCorta + ".jpg' alt='"+ item.DescCorta  + "' style='width:30px; height:30px;'> " + item.DescLarga + "</span>";
                string datacontent = "data-content=" + '"' + image + '"' + "";
                htmlCmb += "<option value='" + item.IdCatalogo + "' " + datacontent + "  >" + item.DescLarga + "</option>";
            }
            return htmlCmb;
        }


        //public static string ConvierteCatalogoGeneralHtmlImagen(List<CatalogoGeneralModel> lstCatalogos, string URL = "", bool multiple = false)
        //{
        //    var sb = new StringBuilder();
        //    if (!multiple)
        //    {
        //        sb.Append("<option value='-1'>--Seleccionar--</option>");
        //    }
        //    URL = "/Archivos/Fotos/";
        //    foreach (var item in lstCatalogos.OrderBy(cat => cat.DescLarga))
        //    {
        //        string image = $"<span><img class='img-dt' src='{URL}{item.DescCorta}.jpg' alt='MST' style='width:30px; height:30px;'> {item.DescLarga}</span>";
        //        sb.Append($"<option value='{item.IdCatalogo}' data-content='{image}'>{item.DescLarga}</option>");
        //    }
        //    return sb.ToString();
        //}



        public static string ConvierteCatalogoGeneralHtmlImagen2(List<CatalogoGeneralModel> lstCatalogos)
        {
            var htmlCmb = "";
            htmlCmb = "<option value='-1'>--Seleccionar--</option>";

            foreach (var item in lstCatalogos.OrderBy(cat => cat.DescCorta).ToList())
            {
                string image = "<span><img class='img-dt' src='/Content/Project/Imagenes/" + item.DescLarga + "' alt='MST' style='width:30px; height:30px;'> " + item.DescCorta + "</span>";
                string datacontent = "data-content=" + '"' + image + '"' + "";
                htmlCmb += "<option value='" + item.IdCatalogo + "' " + datacontent + "  >" + item.DescCorta + "</option>";
            }
            return htmlCmb;
        }

        public static string ConvierteHtmlComboxHUS(List<ActividadesModel> lstCatalogos, bool multiple = false, bool descCorta = false, long idSeleccionado = 0)
        {
            var htmlCmb = "";
            //if (!multiple)
            htmlCmb = "<option value='-1'>--Seleccionar--</option>";
            // Ordenamos la lista por si viene en desorden.
            foreach (var item in lstCatalogos.OrderBy(cat => descCorta ? cat.TipoActividadStr : cat.TipoActividadStr).ToList())
            {
                var selected = "";
                htmlCmb += $"<option data-especial='{item.IdActividad.ToString() ?? string.Empty}'  " + selected + " value='" + item.IdActividad + "'>" + (descCorta ? item.TipoActividadStr : item.TipoActividadStr) + "</option>";
            }
            return htmlCmb;
        }

        public static bool ValidaRango(string Valor)
        {
            try
            {
                string Cadena = "";
                if (Valor != "" && Valor != null)
                {
                    try
                    {
                        if (Valor.Contains("-"))
                        {
                            var datos = Valor.Split('-');
                            foreach (var item in datos)
                            {
                                Cadena += Convert.ToInt64(item.Trim()) + "-";
                            }
                            Cadena = Cadena.Substring(0, Cadena.Length - 1);
                        }
                        else if (Valor.Contains(","))
                        {
                            var datos = Valor.Split(',');
                            foreach (var item in datos)
                            {
                                Cadena += Convert.ToInt64(item.Trim()) + ",";
                            }
                            Cadena = Cadena.Substring(0, Cadena.Length - 1);
                        }
                        else
                        {
                            Cadena = Convert.ToInt64(Valor.Trim()).ToString();
                        }

                        return true;
                    }
                    catch (Exception)
                    {

                        return false;
                    }
                }
                else
                {
                    return true;
                }
            }
            catch (Exception)
            {
                return false;
            }
        }

        public static string ConvierteListaTareas(List<ActividadesModel> LstActividades, string Estatus)
        {
            try
            {
                string Actividades = string.Empty;
                string BAct = string.Empty;
                string BTime = string.Empty;
                List<long> LstActPSP = new List<long>
                {
                    FasePSP.Construccion,
                    FasePSP.Diseño,
                    FasePSP.Bug
                };

                var list = LstActividades.Where(W => W.Estatus == Estatus).OrderBy(o => o.Prioridad).ToList();

                string URL = "http://app.yitpro.com/Archivos/Fotos/";
                string URL2 = "/Content/Project/Imagenes/";
                if (Estatus == "A")
                {
                    foreach (var item in list)
                    {

                        if (item.HorasFinales > item.HorasAsignadas)
                        {
                            BTime = "badge-danger";

                        }
                        else
                        {

                            BTime = "badge-success";
                        }


                        if (item.ClaveTipoActividad == "BUG" || item.ClaveTipoActividad == "RE")
                        {

                            BAct = "badge-danger";
                        }
                        else
                        {
                            BAct = "badge-default";
                        }
                        //decimal? progreso = item.HorasAsignadas == 0 ? 0 : (item.HorasFinales == 0 ? 100 : (1 - (item.HorasFinales / item.HorasAsignadas)) * 100);
                        //string progresostr = FuncionesGenerales.BarraProgreso(decimal.Parse(progreso.ToString()));

                        Actividades += "<div class='task-item ' id='" + item.IdActividad + "' >" +
                                            "<div class='task-text' onclick='clickalerta(" + item.IdActividad + ")'>" +
                                            "<span><img class='img-dt' title='" + item.AsignadoStr + "' src='" + URL + "" + item.ClaveUsuario + ".jpg' alt='" + item.ClaveUsuario + "' style='width:30px; height:30px;'></span>" +
                                            "<img class='img-dt' title='" + item.TipoNombre + "' src='" + URL2 + "" + item.TipoUrl + "' alt='" + item.TipoNombre + "' style='width:18px; height:18px;'>" +
                                             //"<span class='badge " + BAct + "'>" + item.ClaveTipoActividad + "</span>
                                             "<b> " + item.IdActividadStr + "</b> " +
                                            "<br /><br />" +
                                            "<p>" + item.BR + "</p>" +

                                             "<br /><br />" +
                                             "<span class='badge badge-default'> <i class='fa fa-clock-o'></i>  </span> <b>" + item.HorasAsignadas.ToString() + " horas</b> &nbsp;&nbsp;" +
                                            "<span class='badge badge-default'> <i class='fa fa-calendar'></i>  </span> <b>" + item.FechaSolicitado.Value.ToShortDateString() + "</b> " +

                                            "<br /></div>" +

                                            "<div class='task-footer'>" +
                                              "<div class='row'><div class='col-md-12'>" +

                                               "</div>" +
                                            "</diV></div>" +
                                            "</div> </div>";
                    }
                }
                else if (Estatus == "L")
                {
                    foreach (var item in list)
                    {
                        int PSP = !LstActPSP.Contains(item.TipoActividadId) ? 0 : item.PSP;

                        if (item.TipoActividadId == 153 && item.ClasificacionId != 172)
                        {

                            PSP = 0;
                        }

                        if (item.ClaveTipoActividad == "BUG" || item.ClaveTipoActividad == "RE")
                        {

                            BAct = "badge-danger";
                        }
                        else
                        {
                            BAct = "badge-default";
                        }

                        if (item.HorasFinales > item.HorasAsignadas)
                        {
                            BTime = "badge-danger";

                        }
                        else
                        {

                            BTime = "badge-success";
                        }

                        //decimal? progreso = item.HorasAsignadas == 0 ? 0 : (item.HorasFinales == 0 ? 100 : (1 - (item.HorasFinales / item.HorasAsignadas)) * 100);
                        //string progresostr = FuncionesGenerales.BarraProgreso(decimal.Parse(progreso.ToString()));



                        Actividades += "<div class='task-item ' id='" + item.IdActividad + "' >" +
                                           "<div class='task-text' >" +
                                           "<div onclick='clickalerta(" + item.IdActividad + ")'>" +
                                             "<span><img class='img-dt' title='" + item.AsignadoStr + "' src='" + URL + "" + item.ClaveUsuario + ".jpg' alt='" + item.ClaveUsuario + "' style='width:30px; height:30px;'></span>" +
                                           "<img class='img-dt' title='" + item.TipoNombre + "' src='" + URL2 + "" + item.TipoUrl + "' alt='" + item.TipoNombre + "' style='width:18px; height:18px;'>" +
                                             //"<span class='badge " + BAct + "'>" + item.ClaveTipoActividad + "</span>
                                             "<b> " + item.IdActividadStr + "</b> " +
                                           "<br /><br />" +
                                             "<p>" + item.BR + "</p>" +

                                            "<br /><br />" +
                                            "<span class='badge badge-default'> <i class='fa fa-clock-o'></i>  </span> <b>" + item.HorasAsignadas.ToString() + " horas</b> &nbsp;&nbsp;" +
                                           "<span class='badge badge-default'> <i class='fa fa-calendar'></i>  </span> <b>" + item.FechaSolicitado.Value.ToShortDateString() + "</b> " +

                                           "<br />" +
                                          "</div>" +
                                           "<div class='task-footer'>" +
                                             "<div class='row'><div class='col-md-12'>" +

                                             "<div class='col-md-12'><b class='pull-left'>" + item.HorasFinales.ToString() + " horas</b>" + "&nbsp; <span style='width=90%' class='badge " + BTime + " pull-right ' title = 'Registrar tiempo' class='pull-right'  onclick='CapturaTrabajo(" + item.IdActividad + "," + PSP + "," + '"' + item.BR + '"' + ")'> <i class='fa fa-clock-o''></i>  </span>" +
                                               "</div>" +
                                              "</div>" +
                                           "</diV></div>" +
                                           "</div> </div>";
                    }
                }
                else if (Estatus == "P")
                {
                    foreach (var item in list)
                    {

                        int PSP = !LstActPSP.Contains(item.TipoActividadId) ? 0 : item.PSP;



                        if (item.TipoActividadId == 153 && item.ClasificacionId != 172)
                        {

                            PSP = 0;
                        }

                        if (item.ClaveTipoActividad == "BUG" || item.ClaveTipoActividad == "RE")
                        {

                            BAct = "badge-danger";
                        }
                        else
                        {
                            BAct = "badge-default";
                        }

                        if (item.HorasFinales > item.HorasAsignadas)
                        {
                            BTime = "badge-danger";

                        }
                        else
                        {

                            BTime = "badge-success";
                        }
                        //decimal? progreso = item.HorasAsignadas == 0 ? 0 : (item.HorasFinales == 0 ? 100 : (1 - (item.HorasFinales / item.HorasAsignadas)) * 100);
                        //string progresostr = FuncionesGenerales.BarraProgreso(decimal.Parse(progreso.ToString()));

                        Actividades += "<div class='task-item ' id='" + item.IdActividad + "' >" +
                                         "<div class='task-text'>" +

                                        "<div onclick='clickalerta(" + item.IdActividad + ")'>" +
                                         "<span><img class='img-dt' src='" + URL + "" + item.ClaveUsuario + ".jpg' alt='" + item.ClaveUsuario + "' style='width:30px; height:30px;'></span>" +

                                           "<img class='img-dt' title='" + item.TipoNombre + "' src='" + URL2 + "" + item.TipoUrl + "' alt='" + item.TipoNombre + "' style='width:18px; height:18px;'>" +
                                             //"<span class='badge " + BAct + "'>" + item.ClaveTipoActividad + "</span>
                                             "<b> " + item.IdActividadStr + "</b> " +
                                         "<br /><br />" +
                                           "<p>" + item.BR + "</p>" +

                                          "<br /><br />" +
                                          "<span class='badge badge-default'> <i class='fa fa-clock-o'></i>  </span> <b>" + item.HorasAsignadas.ToString() + " horas</b> &nbsp;&nbsp;" +
                                         "<span class='badge badge-default'> <i class='fa fa-calendar'></i>  </span> <b>" + item.FechaSolicitado.Value.ToShortDateString() + "</b> " +

                                         "<br /><br />" +
                                           "</div>" +
                                         "<div class='task-footer'>" +
                                           "<div class='row'><div class='col-md-12'>" +

                                           "<div class='col-md-12'><b class=''>" + item.HorasFinales.ToString() + " horas</b>" + "&nbsp; <span style='width=90%' class='badge " + BTime + " pull-right ' title = 'Registrar tiempo' class=''  onclick='CapturaTrabajo(" + item.IdActividad + "," + PSP + "," + '"' + item.BR + '"' + ")'> <i class='fa fa-play-circle'></i>  </span>" +
                                             "</div>" +
                                            "</div>" +
                                         "</diV></div>" +
                                         "</div> </div>";
                    }

                }
                else if (Estatus == "R" || Estatus == "V")
                {
                    foreach (var item in list)
                    {
                        int PSP = !LstActPSP.Contains(item.TipoActividadId) ? 0 : item.PSP;
                        if (item.ClaveTipoActividad == "BUG" || item.ClaveTipoActividad == "RE")
                        {

                            BAct = "badge-danger";
                        }
                        else
                        {
                            BAct = "badge-default";
                        }
                        if (item.HorasFinales > item.HorasAsignadas)
                        {
                            BTime = "badge-danger";

                        }
                        else
                        {

                            BTime = "badge-success";
                        }
                        //decimal? progreso = item.HorasAsignadas == 0 ? 0 : (item.HorasFinales == 0 ? 100 : (1 - (item.HorasFinales / item.HorasAsignadas)) * 100);
                        //string progresostr = FuncionesGenerales.BarraProgreso(decimal.Parse(progreso.ToString()));



                        Actividades += "<div class='task-item' id='" + item.IdActividad + "' >" +
                                            "<div class='task-text'>" +
                                            "<div onclick='clickalerta(" + item.IdActividad + ")'>" +
                                            "<span><img class='img-dt' src='" + URL + "" + item.ClaveUsuario + ".jpg' alt='" + item.ClaveUsuario + "' style='width:30px; height:30px;'></span>" +
                                                "<img class='img-dt' title='" + item.TipoNombre + "' src='" + URL2 + "" + item.TipoUrl + "' alt='" + item.TipoNombre + "' style='width:18px; height:18px;'>" +
                                             //"<span class='badge " + BAct + "'>" + item.ClaveTipoActividad + "</span>
                                             "<b> " + item.IdActividadStr + "</b> " +
                                            "<br /><br />" +
                                            "<p>" + item.BR + "</p>" +

                                             "<br /><br />" +
                                             "<span class='badge badge-default'> <i class='fa fa-clock-o'></i>  </span> <b>" + item.HorasAsignadas.ToString() + " horas</b> &nbsp;&nbsp;" +
                                            "<span class='badge badge-default'> <i class='fa fa-calendar'></i>  </span> <b>" + item.FechaSolicitado.Value.ToShortDateString() + "</b> " +

                                            "<br />" +
                                              "</div>" +
                                            "<div class='task-footer'>" +
                                              "<div class='row'><div class='col-md-12'>" +

                                              "<div class='col-md-12'><b class='pull-left'>" + item.HorasFinales.ToString() + " horas</b>" + "&nbsp; <span style='width=90%' class='badge " + BTime + " pull-right ' title = 'Registrar tiempo' class='pull-right'  onclick='CapturaTrabajo(" + item.IdActividad + "," + PSP + "," + '"' + item.BR + '"' + ")'> <i class='fa fa-clock-o''></i>  </span>" +
                                                "</div>" +
                                               "</div>" +
                                            "</diV></div>" +
                                            "</div> </div>";
                    }

                }
                else if (Estatus == "X")
                {
                    foreach (var item in list)
                    {
                        int PSP = !LstActPSP.Contains(item.TipoActividadId) ? 0 : item.PSP;
                        if (item.ClaveTipoActividad == "BUG" || item.ClaveTipoActividad == "RE")
                        {

                            BAct = "badge-danger";
                        }
                        else
                        {
                            BAct = "badge-default";
                        }
                        if (item.HorasFinales > item.HorasAsignadas)
                        {
                            BTime = "badge-danger";

                        }
                        else
                        {

                            BTime = "badge-success";
                        }
                        //decimal? progreso = item.HorasAsignadas == 0 ? 0 : (item.HorasFinales == 0 ? 100 : (1 - (item.HorasFinales / item.HorasAsignadas)) * 100);
                        //string progresostr = FuncionesGenerales.BarraProgreso(decimal.Parse(progreso.ToString()));


                        Actividades += "<div class='task-item ' id='" + item.IdActividad + "' >" +
                                           "<div class='task-text' >" +
                                            "<div onclick='clickalerta(" + item.IdActividad + ")'>" +
                                           "<span><img class='img-dt' src='" + URL + "" + item.ClaveUsuario + ".jpg' alt='" + item.ClaveUsuario + "' style='width:30px; height:30px;'></span>" +

                                               "<img class='img-dt' title='" + item.TipoNombre + "' src='" + URL2 + "" + item.TipoUrl + "' alt='" + item.TipoNombre + "' style='width:18px; height:18px;'>" +
                                             //"<span class='badge " + BAct + "'>" + item.ClaveTipoActividad + "</span>
                                             "<b> " + item.IdActividadStr + "</b> " +
                                           "<br /><br />" +
                                           "<p>" + item.BR + "</p>" +
                                            "<br/><b>Motivo rechazo: </b> <p>" + item.DescripcionRechazo + "</p>" +

                                            "<br /><br />" +
                                            "<span class='badge badge-default'> <i class='fa fa-clock-o'></i>  </span> <b>" + item.HorasAsignadas.ToString() + " horas</b> &nbsp;&nbsp;" +
                                           "<span class='badge badge-default'> <i class='fa fa-calendar'></i>  </span> <b>" + item.FechaSolicitado.Value.ToShortDateString() + "</b> " +

                                           "<br /></div>" +

                                           "<div class='task-footer'>" +
                                             "<div class='row'><div class='col-md-12'>" +

                                             "<div class='col-md-12'><b class='pull-left'>" + item.HorasFinales.ToString() + " horas</b>" + "&nbsp; <span style='width=90%' class='badge " + BTime + " pull-right ' title = 'Registrar tiempo' class='pull-right'  onclick='CapturaTrabajo(" + item.IdActividad + "," + PSP + "," + '"' + item.BR + '"' + ")'> <i class='fa fa-clock-o''></i>  </span>" +
                                               "</div>" +
                                              "</div>" +
                                           "</diV></div>" +
                                           "</div> </div>";
                    }

                }


                Actividades += Estatus == "V" ? "" : "<div class='task-drop'><span class='fa fa-task'></span>Coloca aquí tus actividades por iniciar</div>";



                return Actividades;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public static string ConvierteListaTareasV2(List<ActividadesModel> LstActividades, string Estatus)
        {
            try
            {
                string Actividades = string.Empty;

                List<long> LstActPSP = new List<long>
        {
            FasePSP.Construccion,
            FasePSP.Diseño,
            FasePSP.Bug
        };

                string URL = "http://app.yitpro.com/Archivos/Fotos/";
                string URL2 = "/Content/Project/Imagenes/";

                foreach (var item in LstActividades.Where(W => W.Estatus == Estatus).OrderBy(o => o.FechaSolicitado))
                {
                    string BAct = item.ClaveTipoActividad == "BUG" || item.ClaveTipoActividad == "RE" ? "badge-danger" : "badge-default";
                    string BTime = item.HorasFinales > item.HorasAsignadas ? "badge-danger" : "badge-success";

                    int PSP = !LstActPSP.Contains(item.TipoActividadId) ? 0 : item.PSP;
                    //if (item.TipoActividadId == 153 && item.ClasificacionId != 172)
                    //{
                    //    PSP = 0;
                    //}

                    string statusHtml = Estatus == "X" ? "<br/><b>Motivo rechazo: </b> <p>" + item.DescripcionRechazo + "</p>" : string.Empty;

                    string actividadHtml = string.Format(
                        "<div class='task-item ' id='{0}'>" +
                        "<div class='task-text'>" +
                        "<div onclick='clickalerta({0})'>" +
                        "<span><img class='img-dt' src='{1}{2}.jpg' alt='{2}' style='width:30px; height:30px;'></span>" +
                        "<img class='img-dt' title='{3}' src='{4}{5}' alt='{3}' style='width:18px; height:18px;'>" +
                        "<b> {6}</b>" +
                        "<br /><br />" +
                        "<p>{7}</p>" +
                        "<br /><br />" +
                        "<span class='badge badge-default'> <i class='fa fa-clock-o'></i>  </span> <b>{8} horas</b> &nbsp;&nbsp;" +
                        "<span class='badge badge-default'> <i class='fa fa-calendar'></i>  </span> <b>{9}</b>" +
                        "<br />{10}" +
                        "</div>" +
                        "<div class='task-footer'>" +
                        "<div class='row'><div class='col-md-12'>" +
                        "<div class='col-md-12'><b class='pull-left'>{11} horas</b>&nbsp;<span style='width=90%' class='badge {12} pull-right' title='Registrar tiempo' onclick='CapturaTrabajo({0},{13},{14})'><i class='fa fa-clock-o'></i></span></div>" +
                        "</div>" +
                        "</div>" +
                        "</div></div></div>",
                        item.IdActividad, URL, item.ClaveUsuario, item.TipoNombre, URL2, item.TipoUrl, item.IdActividadStr, item.BR,
                        item.HorasAsignadas,( item.FechaSolicitado == null ?  "" :  item.FechaSolicitado.Value.ToShortDateString()), (statusHtml == null ? "" : statusHtml), item.HorasFinales, BTime, PSP, $"\"{item.BR}\"");

                    Actividades += actividadHtml;
                }

                Actividades += Estatus == "V" ? string.Empty : "<div class='task-drop'><span class='fa fa-task'></span>Coloca aquí tus actividades por iniciar</div>";

                return Actividades;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static string ConvierteSprints(List<ProyectoIteracionModel> LstSprints)
        {
            try
            {

                string sprints = string.Empty;
                string BAct = string.Empty;
                string BSprint = string.Empty;

                string URL = "http://app.yitpro.com/Archivos/Fotos/";
                foreach (var s in LstSprints)
                {

                    string Actividades = string.Empty;

                    foreach (var item in s.Actividades)
                    {


                        if (item.ClaveTipoActividad == "BUG" || item.ClaveTipoActividad == "RE")
                        {

                            BAct = "badge-danger";
                        }
                        else
                        {
                            BAct = "badge-primary";
                        }


                        Actividades += "<div class='task-item task-progreess '  id='" + item.IdActividad + "'>    " +
                                      "<div class='task-text'  onclick='clickalerta(" + item.IdActividad + ")'>" +
                                        "<span><img class='img-dt' src='" + URL + "" + item.ClaveUsuario + ".jpg' alt='" + item.ClaveUsuario + "' style='width:40px; height:40px;'></span>" +
                                      "<span class='badge  " + BAct + "'>" + item.ClaveTipoActividad + "</span> <b> # " + item.IdActividadStr.ToString() + "</b>" +
                                      //"<br /><br />" +
                                      "<p>" + item.BR + "</p>" +
                                      //"<span class='badge badge-info'> <i class='fa fa-clock-o'></i>  </span> <b>" + item.HorasAsignadas.ToString() + "horas</b>" +
                                      //"<span class='badge badge-info'> <i class='fa fa-calendar'></i>  </span> <b>" + item.FechaSolicitado.Value.ToShortDateString() + "</b> " +
                                      //"<span class='badge pull-right badge-primary'>" + item.ClaveUsuario + "</span>" +
                                      "</div> </div>";
                    }

                    string BRetro = "";
                    if (s.Estatus == "A")
                    {
                        BSprint = "text-info";
                        s.EstatusStr = "Abierto";
                    }
                    else if (s.Estatus == "P")
                    {
                        BSprint = "text-progress";
                        s.EstatusStr = "Progreso";
                    }
                    else if (s.Estatus == "L")
                    {
                        BSprint = "text-success";
                        s.EstatusStr = "Terminado";
                        BRetro = "<a class='btn btn-default pull-right' id='BtnSprintRetro' onclick='AbrirModalSprintRetrospectiva(1," + s.IdIteracion + ")' ><i title='Ver retrospectiva' class='fa fa-comments-o'></i></a>";
                    }
                    else if (s.Estatus == "C")
                    {
                        //BSprint = "Cancelled";
                        BSprint = "text-muted";
                        s.EstatusStr = "Cancelado";
                    }




                    sprints += " <div class='panel-group accordion accordion-dc'> " +
                                 "  <div class='panel '> " +
                                 "    <div class='panel-heading panel-title'>" +
                                                                "<a href = '#sprint" + s.IdIteracion.ToString() + "' >" +
                                                                 "  <div class='row'>" +
                                                                  "<b>" + s.Nombre + "</b>" +
                                                                 //"</b>  <span id='spEstatuSprint' class='btn btn-small " + BSprint + "' style='text - align:left;'>" + s.EstatusStr + "</span>" +
                                                                 "<span  class='btn btn-small btn-grid' style='text-align:left;color:#000;'><span>" + s.EstatusStr + "<span><span class='fa fa-fw fa-circle " + BSprint + "'></span> </span>" +


                                                                   "<a class='btn btn-default pull-right' id='BtnSprintReport' onclick='VerTablero(" + s.IdIteracion + ")' ><i  title='Sprint report' class='fa fa-bar-chart-o'></i></a>" +
                                                                    BRetro +
                                                                    //" <button class='btn btn-info pull-right btnTablero'><i class='fa fa-share' title='Ir a tablero'></i> </button>" +
                                                                    "</div>" +
                                                                    "<span>" + s.Objetivo + "</span> | <span> <i class='fa fa-calendar-o'></i> " + s.FechaInicio.ToShortDateString() + "</span> al <span>" + s.FechaFin.ToShortDateString() + "</span>" +
                                                                "</a>" +

                                                            "</div>" +
                                                            "<div class='panel-body' id='sprint" + s.IdIteracion.ToString() + "' style='display: none;'>" +
                                                               //"<div class='row'> <a class='btn btn-info pull-right'   sprint='" + s.Nombre + "'  onclick='VerTablero(this," + s.IdIteracion + "," + s.IdProyecto + ")'  ><i class='fa fa-share'></i> Sprint report</a></div>" +
                                                               " <div class='row'>" +
                                                               "<div class='tasks ui-sortable sprint' id='tasks_" + s.IdIteracion.ToString() + "' style='overflow: auto;'>" +
                                                                  Actividades +
                                                               "<div class='task-drop'><span class='fa fa-task'></span>Coloca aquí las actividades del sprint " + s.Nombre + "</div>" +
                                                               "</div>" +
                                                                "</div>" +
                                                            "</div>" +
                                                        "</div>" +
                                                    "</div>";


                }

                return sprints;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public static string ConvierteListaTareas2(List<ActividadesModel> LstActividades, string URL)
        {
            try
            {
                string Actividades = string.Empty;
                foreach (var item in LstActividades)
                {

                    string BAct = string.Empty;
                    string FAct = string.Empty;

                    if (item.ClaveTipoActividad == "BUG" || item.ClaveTipoActividad == "RE")
                    {

                        BAct = "badge-danger";
                    }
                    else
                    {
                        BAct = "badge-primary";
                    }


                    if (item.Estatus == "A")
                    {
                        FAct = "task-info";

                    }
                    else if (item.Estatus == "L")
                    {
                        FAct = "task-success";
                    }
                    else if (item.Estatus == "P")
                    {
                        FAct = "task-progreess";

                    }
                    else if (item.Estatus == "R" || item.Estatus == "V")
                    {
                        FAct = "task-validate";

                    }
                    else if (item.Estatus == "C" || item.Estatus == "X")
                    {
                        FAct = "task-danger";

                    }

                    Actividades += "<div class='task-item " + FAct + "' id='" + item.IdActividad + "' >" +
                                       "<div class='task-text' onclick='clickalerta(" + item.IdActividad + ")'>" +
                                       "<span><img class='img-dt' src='" + URL + "Archivos/Fotos/" + item.ClaveUsuario + ".jpg' alt='" + item.ClaveUsuario + "' style='width:30px; height:30px;'></span>" +

                                        "<span class='badge " + BAct + "'>" + item.ClaveTipoActividad + "</span> <b> " + item.IdActividadStr + "</b> " +
                                       "<br /><br />" +
                                       "<p>" + item.BR + "</p>" +
                                        //"<br /><br />" +
                                        "<span class='pull-left'> Dependencias:  <b>" + item.DependenciasA.ToString() + "/" + item.DependenciasT.ToString() + "</b></span>" +
                                        "<br /><br />" +
                                        "<span class='badge badge-info'> <i class='fa fa-clock-o'></i>  </span> <b>" + item.HorasAsignadas.ToString() + "horas</b> &nbsp;&nbsp;<br/>" +
                                       "<span class='badge badge-info'> <i class='fa fa-calendar'></i>  </span> <b>" + item.FechaSolicitado.Value.ToShortDateString() + "</b> " +
                                       //"&nbsp;<b class='pull-right'>" + item.HorasFinales.ToString() + "horas</b>" + "&nbsp;<span  class='badge " + BTime + " pull-right ' title = 'Registrar tiempo' class='pull-right'  onclick='CapturaTrabajo(" + item.IdActividad + "," +  PSP   +  ","+  '"' + item.Descripcion.Replace("\r\n", "").Replace("\n", "").Replace("\r", "") + '"' + ")'> <i class='fa fa-play-circle'></i>  </span> &nbsp;" +
                                       //"<br /><br />" +
                                       //"<br />" +
                                       //"<span class='fa-stack fa-1x 'badge badge-info'> <i class='fa fa-comment fa-stack-2x'></i><strong class='fa-stack-1x fa-stack-text fa-inverse'>" + item.ComentariosTotal.ToString() + "</strong></span> " +
                                       //"<span class='fa-stack fa-1x 'badge badge-info'><i class='fa fa-folder-o fa-stack-2x'></i><strong class='fa-stack-1x fa-stack-text file-text'>" + item.ArchivosTotal.ToString() + "</strong></span>" +

                                       //"<br /><br />" +
                                       //"<div class='progress'>" + progresostr + "</div></div>" +
                                       //"<div class='task-footer'>" +
                                       //  "<div class='row'><div class='col-md-12'>" +
                                       //  //"<div class='col-md-12'>" +
                                       //  //    "<span class='fa-stack fa-1x'> <i class='fa fa-comment fa-stack-2x'></i><strong class='fa-stack-1x fa-stack-text fa-inverse'>" + item.ComentariosTotal.ToString() + "</strong></span> " +
                                       //  //    "<span class='fa-stack fa-1x'><i class='fa fa-folder-o fa-stack-2x'></i><strong class='fa-stack-1x fa-stack-text file-text'>" + item.ArchivosTotal.ToString() + "</strong></span>" +
                                       //  //"</diV>" +
                                       //  "<div class='col-md-12'><b class='pull-left'>" + item.HorasFinales.ToString() + "horas</b>" + "&nbsp; <span style='width=90%' class='badge " + BTime + " pull-right ' title = 'Registrar tiempo' class='pull-right'  onclick='CapturaTrabajo(" + item.IdActividad + "," + PSP + "," + '"' + item.Descripcion.Replace("\r\n", "").Replace("\n", "").Replace("\r", "").Replace('\"', '-') + '"' + ")'> <i class='fa fa-clock-o''></i>  </span>" +
                                       //    "</div>" +
                                       //   "</div>" +
                                       //"</diV></div>" +
                                       "</div></div> </div>";




                }


                return Actividades;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public static string ConvierteBacklog(List<ActividadesModel> LstActividades)
        {
            try
            {

                string URL = "http://app.yitpro.com/Archivos/Fotos/";
                string Actividades = string.Empty;
                string BAct = string.Empty;


                foreach (var item in LstActividades)
                {

                    if (item.ClaveTipoActividad == "BUG" || item.ClaveTipoActividad == "RE")
                    {

                        BAct = "badge-danger";
                    }
                    else
                    {
                        BAct = "badge-primary";
                    }


                    Actividades += "<div class='task-item task-info '  id='" + item.IdActividad + "'  onclick='clickalerta(" + item.IdActividad + ")'>   " +
                                  "<div class='task-text'>" +
                                    "<span><img class='img-dt' src='" + URL + "" + item.ClaveUsuario + ".jpg' alt='" + item.ClaveUsuario + "' style='width:40px; height:40px;'></span>" +
                                  "<span class='badge " + BAct + "'>" + item.ClaveTipoActividad + "</span> <b> # " + item.IdActividad.ToString() + " | " + item.ProyectoStr + "</b>" +
                                  //"<br /><br />" +
                                  "<p>" + item.BR + "</p>" +
                                  //"<span class='badge badge-info'> <i class='fa fa-clock-o'></i>  </span> <b>" + item.HorasAsignadas.ToString() + "horas</b>" +
                                  //"<span class='badge badge-info'> <i class='fa fa-calendar'></i>  </span> <b>" + item.FechaSolicitado.Value.ToShortDateString() + "</b> " +
                                  //"<span class='badge pull-right badge-primary'>" + item.ClaveUsuario + "</span>" +
                                  "</div> </div>";
                }


                return Actividades;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public static string BarraProgreso(decimal Progreso)
        {
            try
            {
                string ProgresoStr = string.Empty;

                if (Progreso <= 0)
                {
                    //ProgresoStr = "<div class='progress-bar Done' role='progressbar' style='width:" + 1 + "% ' aria-valuenow='" + 1 + "' aria-valuemin='0' aria-valuemax='100'></div>";
                    ProgresoStr = "<div class='progress-bar Rejected' role='progressbar' style='width: 1% ' aria-valuenow='1' aria-valuemin='0' aria-valuemax='100'></div>";

                }
                else if (Progreso > 1 && Progreso < 25)
                {
                    ProgresoStr = "<div class='progress-bar Validation' role='progressbar' style='width:" + Progreso.ToString() + "% ' aria-valuenow='" + Progreso.ToString() + "' aria-valuemin='0' aria-valuemax='100'></div>";
                }
                else
                {
                    ProgresoStr = "<div class='progress-bar Done' role='progressbar' style='width:" + Progreso.ToString() + "% ' aria-valuenow='" + Progreso.ToString() + "' aria-valuemin='0' aria-valuemax='100'></div>";
                }

                return ProgresoStr;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public static string ConvierteTimeline(List<ActividadesModel> LstActividades)
        {
            try
            {

                string timeline = string.Empty;

                foreach (var v in LstActividades)
                {

                    timeline += " <li class='timeline-item'  onclick='clickalerta(" + v.IdActividad + ")'>" +
                                "<div class='timeline-badge " + v.Icono + "'><i class='glyphicon glyphicon-check'></i></div>" +
                                "<div class='timeline-panel'>" +
                                    "<div class='timeline-heading'>" +
                                     "<h5 class='timeline-title'>" + v.Descripcion + "</h4>" +
                                       "<p> Fecha compromiso:" + ((DateTime)v.FechaSolicitado).ToShortDateString() + "</p>" +
                                       " <p style = 'color:" + v.Termino + ";' >" + (v.FechaTermino == null ? "&nbsp" : "Fecha real:" + ((DateTime)v.FechaTermino).ToShortDateString()) + "</p>" +
                                        "</div> </div> </li>";
                }

                return timeline;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public static string ConvierteListaComentarios(List<ActividadComentarioModel> LstComentarios)
        {
            try
            {
                string Comentarios = string.Empty;
                var url = ConfigurationManager.AppSettings["UrlSistema"];

                foreach (var c in LstComentarios.OrderByDescending(o=> o.Fecha))
                {


                    var fecha = c.Fecha.ToString("yyyy/MM/dd HH:mm:ss");

                    var d =   c.Comentario.Replace("<script>", "").Replace("</script>", "");
                 
                    Comentarios += "<li class='media'> " +
                                        "<a class='pull-left' href='#'> " +
                                            "<img class='img-dt' src='" + url + "/Archivos/Fotos/" + c.CveUsuario + ".jpg' alt='" + c.IdUsuarioStr + "' style='width:35px; height:35px;' title='" + c.IdUsuarioStr + "'>" +
                                        "</a>" +
                                        "<div class='media-body'>" +
                                        "<h5 class='media-heading'>" + c.IdUsuarioStr + "</h5>" +
                                            "<p>" + d + "</p>" +
                                            "<p class='text-muted'>" + fecha + "</p>" +
                                        "</div>" +
                                    "</li>";

                }


                return Comentarios;


            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public static string ConvierteListaComentarios2(List<ActividadComentarioModel> LstComentarios)
        {
            try
            {
                string Comentarios = string.Empty;
                var url = ConfigurationManager.AppSettings["UrlSistema"];


                foreach (var c in LstComentarios)
                {


                    var fecha = c.Fecha.ToString("yyyy/MM/dd HH:mm:ss");

                    var d = c.Comentario.Replace("<script>", "").Replace("</script>", "");

                    Comentarios += "<div class='item item-visible'>" +
                                      "<div class='image'>" +
                                                "<img src='" + url + "Archivos/Fotos/" + c.CveUsuario + ".jpg'  alt='" + c.IdUsuarioStr + "' >" +
                                            "</div>" +
                                            "<div class='text'  onclick='clickalerta(" + c.IdActividad + ")'>" +
                                                "<div class='heading'>" +
                                                    "<a href = '#' >" + c.IdActividadStr + "</a><br/>" +
                                                     "<a href='#'>" + c.IdUsuarioStr + "|" + fecha + "</a>" +
                                                //<span class="date">08:27</span>
                                                "</div>" + d +
                                           "</div>" +
                                       "</div>";


                    //Comentarios += "<li class='media'> " +
                    //                    "<a class='pull-left' href='#'> " +
                    //                        "<img class='img-circle' src='" + url + "/Archivos/Fotos/" + c.CveUsuario + ".jpg' alt='" + c.IdUsuarioStr + "' style='width:60px; height:60px;'>" +
                    //                    "</a>" +
                    //                    "<div class='media-body'>" +
                    //                    "<h5 class='media-heading'>" + c.IdUsuarioStr + "</h5>" +
                    //                        "<p>" + c.Comentario + "</p>" +
                    //                        "<p class='text-muted'>" + fecha + "</p>" +
                    //                    "</div>" +
                    //                "</li>";

                }


                return Comentarios;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }


        public static string ConvierteListaComentarios3(List<ActividadComentarioModel> LstComentarios)
        {
            try
            {
                string Comentarios = string.Empty;
                var url = ConfigurationManager.AppSettings["UrlSistema"];



                if (LstComentarios.Count() > 0)
                {
                    foreach (var c in LstComentarios)
                    {


                        var fecha = c.Fecha.ToString("yyyy/MM/dd HH:mm:ss");

                        var d = c.Comentario.Replace("<script>", "").Replace("</script>", "");

                        Comentarios += "<div class='item item-visible'>" +
                                          "<div class='image'>" +
                                                    "<img src='" + url + "Archivos/Fotos/" + c.CveUsuario + ".jpg'  alt='" + c.IdUsuarioStr + "' >" +
                                                "</div>" +
                                                "<div class='text' >" +
                                                "<div class=''>" +
                                                   "<a href = '#'  class='pull-right' style='cursor:pointer;color:#337ab7'; onclick='DeleteNot(" + c.IdActividadComentario + ")'>Eliminar</a><br/>" +
                                                  "</div>" +
                                                  "<div  onclick='clickalerta(" + c.IdActividad + ");DeleteNot(" + c.IdActividadComentario + ");'>" +
                                                    "<div class='heading' >" +
                                                        "<a href = '#' >" + c.IdActividadStr + "</a><br/>" +
                                                         "<a href='#'>" + c.IdUsuarioStr + "|" + fecha + "</a>" +
                                                    //<span class="date">08:27</span>
                                                    "</div>" + d + "</div>" +
                                               "</div>" +
                                           "</div>";


                    }
                }
                else {

                    Comentarios = "<p> No hay notificaciones  🤖 </p>";
                }



                return Comentarios;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }


        //public static string ConvierteXmlGannt(List<GanntModel> LstGannt) {

        //    try
        //    {
        //        string Gannt = string.Empty;

        //        Gannt = "<project>";

        //        foreach (var g in LstGannt) {


        //            Gannt += "<task>" +
        //                     "<pID>" + g.pID.ToString() + "</pID>" +
        //                     "<pName>" + g.pName + "</pName>" +
        //                      "<pStart>" + g.pStart + "</pStart>" +
        //                      "<pEnd>" + g.pEnd + "</pEnd>" +
        //                      "<pPlanStart>" + g.pPlanStart + "</pPlanStart>" +
        //                      "<pPlanEnd>" + g.pPlanEnd + "</pPlanEnd>" +
        //                       "<pClass>" + g.pClass + "</pClass>" +
        //                      "<pLink>" + g.pLink + "</pLink>" +
        //                      "<pMile>" + g.pMile + "</pMile>" +
        //                      "<pRes>" + g.pRes + "</pREs>" +
        //                      "<pComp>" + g.pComp + "</pComp>" +
        //                      "<pGroup>" + g.pGroup + "</pGroup>" +
        //                      "<pParent>" + g.pParent.ToString() + "</pParent>" +
        //                      "<pOpen>" + g.pOpen.ToString() + "</pOpen>" +
        //                      "<pCost> 0 </pCost>" +
        //                      "<pDepend>" + g.pDepend + "</pDepend>" +
        //                      "<pLink>" + g.pLink + "</pLink>" +
        //                      "<pCaption>" + g.pCaption + "</pCaption>" +
        //                      "<Notes>" + g.pNotes + "</pNotes>" +
        //                      "</task>";
        //        }


        //        Gannt += "</project>";

        //        return Gannt;

        //    }
        //    catch (Exception ex)
        //    {

        //        throw ex;
        //    }

        //}

        public static DataTable CrearTabla<T>(T datos, string nombre, bool vacia = false)
        {
            DataTable tabla;
            if (datos is IList)
            {
                IList objList = datos as IList;

                tabla = new DataTable(nombre);
                DataRow fila;

                foreach (var item in objList[0].GetType().GetProperties())
                {
                    tabla.Columns.Add(item.Name, Nullable.GetUnderlyingType(item.PropertyType) ?? item.PropertyType);
                }

                if (!vacia)
                {
                    foreach (var prop in objList)
                    {
                        fila = tabla.NewRow();
                        foreach (var item in prop.GetType().GetProperties())
                        {
                            fila[item.Name] = prop.GetType().GetProperty(item.Name).GetValue(prop, null) ?? DBNull.Value;
                        }
                        tabla.Rows.Add(fila);
                    }
                }
            }
            else
            {
                tabla = new DataTable(nombre);
                DataRow fila;

                foreach (var item in datos.GetType().GetProperties())
                {
                    tabla.Columns.Add(item.Name, Nullable.GetUnderlyingType(item.PropertyType) ?? item.PropertyType);
                }

                if (!vacia)
                {
                    fila = tabla.NewRow();
                    foreach (var item in datos.GetType().GetProperties())
                    {
                        fila[item.Name] = datos.GetType().GetProperty(item.Name).GetValue(datos, null) ?? DBNull.Value;
                    }
                    tabla.Rows.Add(fila);
                }
            }

            return tabla;
        }

        public static string SplitWords(string texto, byte numPalabras = 10)
        {
            return string.Join("\r\n", texto.Split()
                    .Select((palabra, index) => new { palabra, index })
                    .GroupBy(p => p.index / numPalabras)
                    .Select(g => string.Join(" ", g.Select(p => p.palabra))));
        }

        public static List<EventsModel> ConvierteEventosCalendario(List<ActividadesModel> lstActividades)
        {
            try
            {
                var lstEvents = new List<EventsModel>();
                var statusColors = new Dictionary<string, (string backgroundColor, string borderColor, string textColor)>
                {
                    ["A"] = ("#3fbae4", "#3fbae4", "#FFFFFF"),
                    ["P"] = ("#ffcc00", "#ffcc00", "#FFF"),
                    ["R"] = ("#ff9900", "#ff9900", "#FFFFFF"),
                    //["V"] = ("#ff9900", "#ff9900", "#FFFFFF")
                    ["V"] = ("#0EB4A7", "#0EB4A7 ", "#FFF"),
                    ["X"] = ("#b64645", "#b64645", "#FFFFFF"),
                    ["L"] = ("#08C127", "#08C127", "#FFFFFF"),
                    ["M"] = ("#9933cc", "#9933cc", "#FFFFFF"),
                };

                var ls = lstActividades.OrderBy(o => o.Estatus).ToList();

                foreach (var actividad in ls)
                {
                    var evento = new EventsModel
                    {
                        id = actividad.IdActividad.ToString(),
                        title =  actividad.BR,
                        display = "auto"
                    };

                    if (statusColors.TryGetValue(actividad.Estatus, out var status))
                    {
                        evento.backgroundColor = status.backgroundColor;
                        evento.borderColor = status.borderColor;
                        evento.textColor = status.textColor;
                        
                    }
                    else if (actividad.ClaveTipoActividad == "BUG")
                    {
                        evento.backgroundColor = "#b64645";
                        evento.borderColor = "#b64645";
                        evento.textColor = "#FFFFFF";
                    }

                    if (DateTime.TryParse(actividad.FechaInicio.ToString(), out var startDate))
                    {
                        evento.start = startDate.ToString("yyyy-MM-dd");
                    }

                    if (DateTime.TryParse(actividad.FechaSolicitado.ToString(), out var endDate))
                    {
                        evento.end = endDate.AddDays(1).ToString("yyyy-MM-dd");
                    }

                    evento.Estatus = actividad.Estatus;
                    lstEvents.Add(evento);
                }

                return lstEvents.OrderBy(o=> o.Estatus).ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public static List<GanttModel> ConvierteGantt_Sprints(List<ProyectoIteracionModel> lstsprints)
        {
            try
            {
                var lstEvents = new List<GanttModel>();

                foreach (var s in lstsprints)
                {
                    var evento = new GanttModel
                    {
                        id = s.IdIteracion,
                        text = s.Nombre,
                        start_date = s.FechaInicio.ToString("dd-MM-yyyy"),
                        end_date = s.FechaFin.ToString("dd-MM-yyyy"),
                        avance = s.Avance.ToString("N2") + "%",
                        progress = s.Avance / 100
                    };


                    lstEvents.Add(evento);
                }

                return lstEvents;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public static List<GanttModel> ConvierteGantt_Fases(List<ActividadesModel> lstFases)
        {
            try
            {
                var lstEvents = new List<GanttModel>();

                foreach (var s in lstFases)
                {
                    var evento = new GanttModel
                    {
                        id = s.TipoActividadId,
                        text = s.TipoActividadStr,
                        start_date = DateTime.Parse(s.FechaInicio.ToString()).ToString("dd-MM-yyyy"),
                        end_date = DateTime.Parse(s.FechaFin.ToString()).ToString("dd-MM-yyyy"),
                        avance = decimal.Parse( s.Progreso.ToString()).ToString("N2") + "%",
                        progress = decimal.Parse(s.Progreso.ToString()) / 100
                    };


                    lstEvents.Add(evento);
                }

                return lstEvents;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static List<GanttModel> ConvierteGantt_Actividades(List<ActividadesModel> lstActividades)
        {
            try
            {
                var lstEvents = new List<GanttModel>();

                foreach (var s in lstActividades)
                {
                    var evento = new GanttModel
                    {
                        id = s.IdActividad,
                        text = s.BR,
                        start_date = DateTime.Parse(s.FechaInicio.ToString()).ToString("dd-MM-yyyy"),
                        end_date = DateTime.Parse(s.FechaSolicitado.ToString()).ToString("dd-MM-yyyy"),
                        avance = s.AsignadoPath,
                        progress = s.Estatus == "L" ? 1 : 0,
                        asignadostr = s.AsignadoStr
                    };


                    lstEvents.Add(evento);
                }

                return lstEvents;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public static List<GanttModel> ConvierteGantt_Backlog(List<ActividadesModel> lstActividades)
        {
            try
            {
                var lstEvents = new List<GanttModel>();

                foreach (var s in lstActividades)
                {
                    var evento = new GanttModel
                    {
                        id = s.IdActividad,
                        text = s.BR,
                        start_date = DateTime.Parse(s.FechaInicio.ToString()).ToString("dd-MM-yyyy"),
                        end_date = DateTime.Parse(s.FechaSolicitado.ToString()).ToString("dd-MM-yyyy"),
                        avance = s.TipoUrl,
                        progress = s.Estatus == "L" ? 1 : 0,
                        asignadostr = s.TipoNombre,
                        parent = s.IdActividadR1
                    };


                    lstEvents.Add(evento);
                }

                return lstEvents;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static List<GanttModel> ConvierteGantt_Proyecto(List<ProyectosModel> lstProys)
        {
            try
            {
                var lstEvents = new List<GanttModel>();

                foreach (var s in lstProys)
                {
                    var evento = new GanttModel
                    {
                        id = s.IdProyecto,
                        clave= s.Clave,
                        text = s.Clave + " " + s.Nombre,
                        start_date = DateTime.Parse(s.FechaInicioPlan.ToString()).ToString("dd-MM-yyyy"),
                        end_date = DateTime.Parse(s.FechaFinComprometida.ToString()).ToString("dd-MM-yyyy"),
                        avance = s.AvanceRealPorc.ToString("N2") + "%",
                        progress = s.AvanceRealPorc / 100,
                        open= true
                        //type="project"
                        //asignadostr = s.TipoNombre,
                        //parent = s.IdActividadR1
                    };


                    lstEvents.Add(evento);
                }

                return lstEvents;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public static List<GanttModel> ConvierteGantt_SprintsProyecto(List<ProyectoIteracionModel> lstsprints)
        {
            try
            {
                var lstEvents = new List<GanttModel>();

                foreach (var s in lstsprints)
                {
                    var evento = new GanttModel
                    {
                        id = s.IdIteracion,
                        text = s.Nombre,
                        start_date = s.FechaInicio.ToString("dd-MM-yyyy"),
                        end_date = s.FechaFin.ToString("dd-MM-yyyy"),
                        avance = s.Avance.ToString("N2") + "%",
                        progress = s.Avance / 100,
                        parent = s.IdProyecto,
                        type = "sprint",
                    };


                    lstEvents.Add(evento);
                }

                return lstEvents;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static List<GanttModel> ConvierteGantt_Milestones(List<ActividadesModel> Lst)
        {
            try
            {
                var lstEvents = new List<GanttModel>();

                foreach (var s in Lst)
                {
                    var evento = new GanttModel
                    {
                        id = s.IdActividad,
                        text = s.BR,
                        start_date = DateTime.Parse(s.FechaInicio.ToString()).ToString("dd-MM-yyyy"),
                        end_date = DateTime.Parse(s.FechaSolicitado.ToString()).ToString("dd-MM-yyyy"),
                        avance =   s.Estatus  == "L" ? "100" :  "0" ,
                        progress = s.Estatus == "L" ? 100 : 0,
                        open = true,
                        rollup = true,
                        //asignadostr = s.TipoNombre,
                        type = "milestone",
                        parent = s.IdProyecto
                    };


                    lstEvents.Add(evento);
                }

                return lstEvents;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }





        //        public static List<EventsModel> ConvierteEventosCalendario (List<ActividadesModel> LstActividades){
        //            try
        //            {
        //                List<EventsModel> LstEvents = new List<EventsModel>();

        //                EventsModel e;
        //                foreach (var i in LstActividades) {

        //                    e = new EventsModel();

        //                    e.id = i.IdActividad.ToString();
        //                    e.title = i.ClaveUsuario + " | " +  i.IdActividadStr;
        //                    e.start = DateTime.Parse(i.FechaInicio.ToString()).ToString("yyyy-MM-dd");
        //                    e.end = DateTime.Parse(i.FechaSolicitado.ToString()).AddDays(1).ToString("yyyy-MM-dd");




        //                    if (i.Estatus == "A")
        //                    {

        //                        e.backgroundColor = "#3fbae4";
        //                        e.borderColor = "#3fbae4";
        //                        e.textColor = "#FFFFFF";
        //                    }
        //                    else if (i.Estatus == "P") {

        //                        e.backgroundColor = "#ffcc00";
        //                        e.borderColor = "#ffcc00";
        //                        e.textColor = "#FFFFFF";
        //                    }

        //                    else if (i.Estatus == "R" || i.Estatus == "V")
        //                    {

        //                        e.backgroundColor = "#ff9900";
        //                        e.borderColor = "#ff9900";
        //                        e.textColor = "#FFFFFF";
        //                    }
        //                    else if (i.Estatus == "X")
        //                    {

        //                        e.backgroundColor = "#b64645";
        //                        e.borderColor = "#b64645";
        //                        e.textColor = "#FFFFFF";
        //                    }
        //                    else if (i.Estatus == "L")
        //                    {

        //                        e.backgroundColor = "#08C127";
        //                        e.borderColor = "#08C127";
        //                        e.textColor = "#FFFFFF";
        //                    }




        //                    if (i.ClaveTipoActividad == "BUG")
        //                    {

        //                        e.backgroundColor = "#b64645";
        //                        e.borderColor = "#b64645";
        //                        e.textColor = "#FFFFFF";
        //                    }


        //                    e.display = "auto";
        //                    LstEvents.Add(e);
        //                }



        //                return LstEvents;

        //            }
        //            catch (Exception ex)
        //            {

        //                throw ex;
        //            }

        //        }
        //    }
    }
}