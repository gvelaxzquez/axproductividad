using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class ActividadTamanoModel
    {
        public long IdActividadTamano { get; set; }
        public long IdActividad { get; set; }
        public string IdActividadStr { get; set; }
        public long TipoParteId { get; set; }
        public string TipoParteIdStr { get; set; }
        public string Descripcion { get; set; }
        public int EBase { get; set; }
        public int EEliminadas { get; set; }
        public int EModificadas { get; set; }
        public int EAgregadas { get; set; }
        public int ABase { get; set; }
        public int AEliminadas { get; set; }
        public int AModificadas { get; set; }
        public int AAgregadas { get; set; }
        public long IdUMod { get; set; }
        public System.DateTime FechaMod { get; set; }
        public string DescripcionActividad { get; set; }
 
    }
}
