using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class MatrizModel
    {
        public string Requerimieto { get; set; }
        public string Epica { get; set; }
        public string HU { get; set; }
        public string Sprint { get; set; }

        public string Estatus { get; set; }
        public string EstatusStr { get; set; }
        public string Fase { get; set; }
        public string CveAsignado { get; set; }
        public string Asignado { get; set; }
        public long IdActividad { get; set; }

        public long IdProyecto { get; set; }

        public List<long> LstEpicas { get; set; }
        public List<long> LstHUS { get; set; }

        public List<long> LstSprints { get; set; }

        public List<string> LstEstatus { get; set; }
    }
}
