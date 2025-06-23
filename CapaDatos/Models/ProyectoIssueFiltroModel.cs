using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class ProyectoIssueFiltroModel
    {
        public ProyectoIssueFiltroModel()
        {
            Proyectos = new List<long>();
            Estatus = new List<long>();
        }
        public List<long> Proyectos { get; set; }
        public List<long> Estatus { get; set; }
        public long IdProyecto { get; set; }
    }
}
