using CapaDatos.Constants;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class CasoPruebaModel
    {

        public long IdCicloCaso { get; set; }
        public long IdCicloP { get; set; }
        public long IdActividadCaso { get; set; }
        public Nullable<long> IdActividadEjecucion { get; set; }
        public string EstatusP { get; set; }
        public string EstatusStr { get; set; }

        public string Titulo { get; set; }
        public string Descripcion { get; set; }

        public string Clasificacion { get; set; }
        public Nullable<decimal> TiempoEjecucion { get; set; }

        public Nullable<decimal> HorasFinales { get; set; }
        public Nullable<System.DateTime> FechaEjecucion { get; set; }
        public string Comentarios { get; set; }
        public string Evidencias { get; set; }
  
        public long? IdUsuarioAsignado { get; set; }


        public Nullable<System.DateTime> FechaSolicitado { get; set; }
        public Nullable<System.DateTime> FechaInicio { get; set; }
        public Nullable<System.DateTime> FechaTermino { get; set; }


        public string Asignado { get; set; }

        public string AsignadoPath { get; set; }
        public string IdActividadStr { get;  set; }
        public string TipoNombre { get;  set; }
        public string TipoUrl { get;  set; }
        public long IdProyecto { get;  set; }
        public string NombreCP { get;  set; }
    }
}
