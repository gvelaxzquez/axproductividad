using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class ClienteModel
    {
        public long IdCliente { get; set; }
        public string Nombre { get; set; }
        public Nullable<bool> Activo { get; set; }
    }
}
