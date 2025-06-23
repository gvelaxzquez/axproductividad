using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class ActividadComentarioModel
    {
        public long IdActividadComentario { get; set; }
        public long IdActividad { get; set; }

        public string IdActividadStr { get; set; }
        public Nullable<long> IdActividadComentarioRel { get; set; }
        public string Comentario { get; set; }
        public string CveUsuario { get; set; }
        public string IdUsuarioStr { get; set; }
        public long IdUsuario { get; set; }
        public System.DateTime Fecha { get; set; }
        public int Tipo { get;  set; }
    }
}
