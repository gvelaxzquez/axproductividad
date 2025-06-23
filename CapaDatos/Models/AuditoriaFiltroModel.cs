using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class AuditoriaFiltroModel
    {
        public AuditoriaFiltroModel()
        {
            UsuariosAuditories = new List<long>();
            Proyectos = new List<long>();
            Estatus = new List<string>();
        }

        public DateTime? FechaInicio_1 { get; set; }
        public DateTime? FechaInicio_2 { get; set; }
        public DateTime? FechaFin_1 { get; set; }
        public DateTime? FechaFin_2 { get; set; }
        public List<long> UsuariosAuditories { get; set; }
        public List<long> Proyectos { get; set; }
        public List<string> Estatus { get; set; }
    }
}
