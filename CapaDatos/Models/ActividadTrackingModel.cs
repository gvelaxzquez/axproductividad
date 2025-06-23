using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
   public class ActividadTrackingModel
    {
        public long IdActividadTracking { get; set; }
        public long IdActividad { get; set; }
        public string IdActividadStr { get; set; }

   

        public string Recurso { get; set; }
        public string Nivel { get; set; }
        public string Descripcion { get; set; }

        public long IdFase { get; set; }
        public string Nombre { get; set; }
        public decimal Porcentaje { get; set; }
        public System.TimeSpan Trabajado { get; set; }

        public decimal TrabajadoHrs { get; set; }
         public string TiempoAsignadoMin { get; set; }

        public decimal TiempoAsignadoHrs { get; set; }
        public Nullable<int> Orden { get; set; }
        public string strTrabajado { get; set; }
        public bool Finalizado { get; set; }

        public long IdUsuario { get; set; }

       public int DefectosInyectados { get; set; }
       public int DefectosRemovidos { get; set; }

        public decimal TiempoDefectosInyectados { get; set; }
        public decimal TiempoDefectosRemovidos { get; set; }

    }
}
