using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class ProyectoUsuarioModel
    {
        public long IdProyectoUsuario { get; set; }
        public long IdProyecto { get; set; }
        public long IdUsuario { get; set; }

        public bool Activo { get; set; }
        public long IdUCreo { get; set; }
        public System.DateTime FechaCreo { get; set; }
        public Nullable<long> IdUMod { get; set; }
        public Nullable<System.DateTime> FechaMod { get; set; }

        public Nullable<decimal> Participacion { get; set; }


    }
}
