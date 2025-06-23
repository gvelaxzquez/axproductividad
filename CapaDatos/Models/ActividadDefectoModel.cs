using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
   public class ActividadDefectoModel
    {
        public long IdActividadDefecto { get; set; }
        public long IdActividad { get; set; }
        public long TipoDefectoId { get; set; }
        public long IdFaseInyeccion { get; set; }
        public long IdFaseRemocion { get; set; }
        public System.DateTime FechaDefecto { get; set; }
        public System.TimeSpan Tiempo { get; set; }
        public string Descripcion { get; set; }
        public string TiempoStr { get; set; }
        public long IdUCreo { get; set; }
        public System.DateTime FechaCreo { get; set; }
    }
}
