using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class ActividadListaRevisionHallazgoModel
    {
        public long IdActividadListaRevisionHallazgo { get; set; }
        public long IdActividadListaRevision { get; set; }
        public int IdActividad { get; set; }
        public string Descripcion { get; set; }
        public byte Gravedad { get; set; }
        public bool Corregido { get; set; }
        public bool Activo { get; set; }
        public long IdUCreo { get; set; }
        public DateTime FechaCreo { get; set; }
        public long? IdUModifico { get; set; }
        public DateTime? FechaModifico { get; set; }
        public ActividadListaRevisionModel ActividadListaRevision { get; set; }
    }
}
