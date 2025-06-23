using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class AuditoriaControlHallazgoModel
    {
        public long IdAuditoriaControlHallazgo { get; set; }
        public long IdAuditoriaControl { get; set; }
        public int IdAuditoria { get; set; }
        public string Descripcion { get; set; }
        public byte Gravedad { get; set; }
        public bool Corregido { get; set; }
        public bool Activo { get; set; }
        public long IdUCreo { get; set; }
        public DateTime FechaCreo { get; set; }
        public long? IdUModifico { get; set; }
        public DateTime? FechaModifico { get; set; }

        public AuditoriaControlModel AuditoriaControl { get; set; }
    }
}
