using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class ReporteFiltroModel
    {
        public ReporteFiltroModel()
        {
            Proyectos = new List<long>();
        }

        public DateTime? FechaInicio { get; set; }
        public DateTime? FechaFin { get; set; }
        public List<long> Proyectos { get; set; }
        public long Proyecto { get; set; }

        public DateTime FechaCorte { get; set; }
        public long IdProyecto { get; set; }

        public bool Abiertos { get; set; }
       
        public int IdAnio { get; set; }
        public int IdMes { get; set; }
        public int IdUsuario { get; set; }
        public int IdTipoUsuario { get; set; }
    }
}
