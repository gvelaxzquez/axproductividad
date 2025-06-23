using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace CapaDatos.Models
{
   public class ConfiguracionModel
    {
        public string MailServidor { get; set; }
        public string MailPuerto { get; set; }
        public string MailUsuario { get; set; }
        public string MailContrasena { get; set; }
        public string MailRemitente { get; set; }
        public bool MailSSL { get; set; }

        public int Intentos { get; set; }
        public int Vigencia { get; set; }
        public int Caracteresmin { get; set; }

        public decimal CompensacionCumplimiento { get; set; }
        public decimal CompensacionHoras { get; set; }
        public int VigenciaTareas { get; set; }
        public int DiasProceso { get; set; }

        public string NombreSistema { get; set; }

        public string ProyectoMejora { get; set; }

        public bool ActivaAsistencia { get; set; }
        public string HoraEntrada { get; set; }
        public decimal Jornada { get; set; }
        public int Tolerancia { get; set; }
        public int TiempoComida { get; set; }
        public string LDAP { get;  set; }
        public bool TipoMeta { get;  set; }
        public bool IndFinancieros { get;  set; }
        public bool PreguntaSeguimiento { get;  set; }
    }
}
