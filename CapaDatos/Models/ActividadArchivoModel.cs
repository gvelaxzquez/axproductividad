using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class ActividadArchivoModel
    {
        public long IdActividadArchivo { get; set; }
        public long IdActividad { get; set; }
        public string Nombre { get; set; }
        public string Extension { get; set; }
        public string Url { get; set; }

        public string Tipo { get; set; }
        public long IdUCreo { get; set; }
        public System.DateTime FechaCreo { get; set; }
    }
}
