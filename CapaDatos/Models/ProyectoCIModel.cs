using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
   public class ProyectoCIModel
    {
        public long IdProyectoCI { get; set; }
        public long IdProyecto { get; set; }
        public System.DateTime Fecha { get; set; }
        public string Concepto { get; set; }
        public decimal Monto { get; set; }
        public long TipoActividadId { get; set; }
        public Nullable<bool> Activo { get; set; }
        public long IdUCreo { get; set; }
        public System.DateTime FechaCreo { get; set; }
        public Nullable<long> IdUMod { get; set; }
        public Nullable<System.DateTime> FechaMod { get; set; }

        public string Fase { get; set; }
    }
}
