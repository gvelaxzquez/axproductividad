using CapaDatos;
using CapaDatos.DataBaseModel;
using CapaDatos.Models;
using CapaDatos.Models.Constants;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Web;

namespace AxProductividad
{
    public static class Correos
    {
        static readonly CD_Configuracion cd_Configuracion;
        static readonly CD_Auditoria cd_Auditoria;

        static Correos()
        {
            cd_Configuracion = new CD_Configuracion();
            cd_Auditoria = new CD_Auditoria();
        }

        public static (bool Estatus, string Mensaje) CorreoFinalizarAuditoria(string conexionEF, byte[] file, int idAuditoria, UsuarioModel usuario, List<string> correos = null)
        {
            try
            {
                var mensaje = "";

                var configuracion = cd_Configuracion.ObtenerConfiguracion(conexionEF);
                var sistema = ConfigurationManager.AppSettings["NombreSistema"];

                var auditoria = cd_Auditoria.LeerAuditoria(idAuditoria, conexionEF);

                var usuarios = new List<UsuarioModel>();
                usuarios.Add(usuario);
                using (var contexto = new BDProductividad_DEVEntities(conexionEF))
                {
                    var _usuario = contexto.Usuario.Where(x => x.IdUsuario == auditoria.ProyectoListaControl.Proyecto.IdULider).Select(x => new UsuarioModel
                    {
                        Correo = x.Correo,
                        NombreCompleto = x.Nombre + " " + x.ApPaterno + " " + x.ApMaterno
                    }).FirstOrDefault();
                    usuarios.Add(_usuario);
                }

                mensaje +=
                    (correos != null ? $"Auditoría: {auditoria.NoAuditoria.Trim()}.<br />" : $"Se finalizó la Auditoría: {auditoria.NoAuditoria.Trim()}.<br />") +
                    $"Proyecto: {auditoria.ProyectoListaControl.Proyecto.Nombre}.<br />" +
                    $"Checklist: {auditoria.ProyectoListaControl.ListaControl.Nombre}.<br />" +
                    $"Fase: {auditoria.ProyectoListaControl.ListaControl.Proceso.DescLarga}.<br />" +
                    $"Clasificación: {auditoria.ProyectoListaControl.ListaControl.Subproceso.DescLarga}.<br /><br />" +
                    $"Detalle completo en Excel Adjunto.";

                var mail = new MailMessage();

                if (correos == null)
                {
                    foreach (var u in usuarios)
                    {
                        mail.To.Add(new MailAddress(u.Correo, u.NombreCompleto));
                    }
                }
                if (correos != null)
                {
                    foreach (var correo in correos)
                    {
                        mail.To.Add(new MailAddress(correo));
                    }
                }

                mail.From = new MailAddress(configuracion.MailUsuario, configuracion.MailRemitente);
                mail.Subject = sistema + $" - Auditoria Finalizada. [{auditoria.NoAuditoria.Trim()}]";
                mail.IsBodyHtml = true;
                mail.Body = mensaje;
                mail.IsBodyHtml = true;

                Stream stream = new MemoryStream(file);
                Attachment _file = new Attachment(stream, "Auditoria.xlsx", MimeType.XLSX);
                mail.Attachments.Add(_file);

                var client = new SmtpClient(configuracion.MailServidor, Convert.ToInt32(configuracion.MailPuerto));

                using (client)
                {
                    client.Credentials = new NetworkCredential(configuracion.MailUsuario, configuracion.MailContrasena);
                    client.EnableSsl = configuracion.MailSSL;
                    client.Send(mail);
                }
                return (true, "Envio de correo exitoso");
            }
            catch (Exception)
            {
                return (false, "Error al enviar el correo.");
            }
        }
    }
}