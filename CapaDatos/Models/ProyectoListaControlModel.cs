using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class ProyectoListaControlModel
    {
        public ProyectoListaControlModel()
        {
            ProyectoListaControlDetalle = new List<ProyectoListaControlDetalleModel>();
            ListaControl = new ListaControlModel();
            Proyecto = new ProyectosModel();
        }

        public int IdProyectoListaControl { get; set; }
        public int IdListaControl { get; set; }
        public long IdProyecto { get; set; }
        public bool Activo { get; set; }
        public long IdUCreo { get; set; }
        public DateTime FechaCreo { get; set; }
        public long? IdUModifico { get; set; }
        public DateTime? FechaModifico { get; set; }

        public ListaControlModel ListaControl { get; set; }
        public ProyectosModel Proyecto { get; set; }
        public List<ProyectoListaControlDetalleModel> ProyectoListaControlDetalle { get; set; }
    }
}
