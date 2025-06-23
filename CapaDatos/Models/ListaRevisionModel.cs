using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class ListaRevisionModel
    {
        public ListaRevisionModel()
        {
            ListaRevisionDetalle = new List<ListaRevisionDetalleModel>();
        }

        public int IdListaRevision { get; set; }
        public long IdProyecto { get; set; }
        public string Nombre { get; set; }
        public long CatalogoFaseId { get; set; }
        public long CatalogoClasificacionId { get; set; }
        public bool Activo { get; set; }
        public long IdUCreo { get; set; }
        public DateTime FechaCreo { get; set; }
        public long? IdUModifico { get; set; }
        public DateTime? FechaModifico { get; set; }
        public CatalogoGeneralModel Fase { get; set; }
        public CatalogoGeneralModel Clasificacion { get; set; }
        public List<ListaRevisionDetalleModel> ListaRevisionDetalle { get; set; }
    }
}
