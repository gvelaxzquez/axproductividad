using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class ListaControlModel
    {
        public ListaControlModel()
        {
            ListaControlDetalle = new List<ListaControlDetalleModel>();
        }

        public int IdListaControl { get; set; }
        public string Nombre { get; set; }
        public long CatalogoFaseId { get; set; }
        public long CatalogoClasificacionId { get; set; }
        public bool Activo { get; set; }
        public long IdUCreo { get; set; }
        public DateTime FechaCreo { get; set; }
        public long? IdUModifico { get; set; }
        public DateTime? FechaModifico { get; set; }
        public CatalogoGeneralModel Proceso { get; set; }
        public CatalogoGeneralModel Subproceso { get; set; }
        public List<ListaControlDetalleModel> ListaControlDetalle { get; set; }
    }
}
