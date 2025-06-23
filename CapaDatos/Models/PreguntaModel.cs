using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
   public  class PreguntaModel
    {
        public long IdPregunta { get; set; }
        public string Pregunta { get; set; }
        public System.DateTime FechaIni { get; set; }
        public System.DateTime FechaCierre { get; set; }
        public long IdUCreo { get; set; }
        public System.DateTime FechaCreo { get; set; }
        public Nullable<long> IdUMod { get; set; }
        public Nullable<System.DateTime> FechaMod { get; set; }
        public string Respuesta { get;  set; }
        public DateTime FechaRespuesta { get;  set; }
        public long IdUsuario { get;  set; }
        public string NombreUsuario { get;  set; }
        public string NumEmpleado { get;  set; }
    }
}
