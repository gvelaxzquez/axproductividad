using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
   public class CalendarioTrabajoModel
    {
        public int Mes { get; set; }
        public int Anio { get; set; }
        public System.DateTime FechaInicio { get; set; }
        public System.DateTime FechaFin { get; set; }
        public int DiasLaborales { get; set; }
        public decimal BaseCompensacionCump { get; set; }
        public decimal BaseCompensacionHoras { get; set; }
    }
}
