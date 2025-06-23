using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class UsuarioAutorizacionModel
    {
        public long IdUA { get; set; }
        public long IdUsuario { get; set; }
        public long IdAutorizacion { get; set; }
        public long Tipo { get; set; }
        public string NombreAutorizacion { get; set; }

    }
}
