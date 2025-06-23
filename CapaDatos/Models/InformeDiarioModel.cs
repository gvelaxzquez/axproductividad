using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class InformeDiarioModel
    {
        public long IdProyecto { get;  set; }
        public string Clave { get;  set; }
        public string Nombre { get;  set; }
        public decimal Planeado { get; internal set; }
        public decimal Asignado { get;  set; }
        public decimal DiferenciaPlanAsignado { get;  set; }
        public decimal Capacidad { get;  set; }
        public decimal CapacidadPlan { get;  set; }
        public decimal CapacidadAsignada { get;  set; }
        public decimal GanadoPlan { get;  set; }
        public decimal GanadoAsignado { get;  set; }
        public decimal EsfuerzoReal { get;  set; }
        public decimal EsfuerzoCapitalizado { get;  set; }
    }
}
