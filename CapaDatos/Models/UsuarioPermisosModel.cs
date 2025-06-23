using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class UsuarioPermisosModel
    {
        public long IdPermisoU { get; set; }
        public int IdMenu { get; set; }
        public string NombreMenu { set; get; }
        public long IdUsuario { get; set; }
        public bool Ver { get; set; }
        public bool Guardar { get; set; }
        public bool Modificar { get; set; }
        public bool Imprimir { get; set; }
        public bool Eliminar { get; set; }

        public bool Padre { get; set; }
        public long Orden { get; set; }
         
    }
}
