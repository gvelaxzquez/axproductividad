using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class UsuarioCostoModel
    {
        public long IdUsuarioCosto { get; set; }
        public long? IdUsuario { get; set; }
        public decimal? CostoMensual { get; set; }
        public decimal? CostoHora { get; set; }
        public string Nombre { get; set; }
        public string Clave { get; set; }
        public long IdUCreo { get; set; }
        public DateTime FechaCreo { get; set; }
    }
}
