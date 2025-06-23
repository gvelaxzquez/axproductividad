using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class ProyectoListaControlDetalleModel
    {
        public long IdProyectoListaControlDetalle { get; set; }
        public long? IdListaControlDetalle { get; set; }
        public int IdProyectoListaControl { get; set; }
        public string Control { get; set; }
        public bool Activo { get; set; }
        public long IdUCreo { get; set; }
        public DateTime FechaCreo { get; set; }
        public long? IdUModifico { get; set; }
        public DateTime? FechaModifico { get; set; }
        public  ListaControlDetalleModel ListaControlDetalle { get; set; }
    }
}
