using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class ActividadListaRevisionModel
    {
        public ActividadListaRevisionModel()
        {
            Hallazgos = new List<ActividadListaRevisionHallazgoModel>();
        }
        public long IdActividadListaRevision { get; set; }
        public long IdActividad { get; set; }
        public long IdListaRevisionDetalle { get; set; }
        public string Control { get; set; }
        public bool? Cumple { get; set; }
        public long IdUCreo { get; set; }
        public DateTime FechaCreo { get; set; }
        public long? IdUModifico { get; set; }
        public DateTime? FechaModifico { get; set; }
        public int TotalHallazgos { get { return Hallazgos.Count(); } }
        public int HallazgosCorregidos { get { return Hallazgos.Count(x => x.Corregido); } }
        public int HallazgosNoCorregidos { get { return Hallazgos.Count(x => !x.Corregido); } }
        public List<ActividadListaRevisionHallazgoModel> Hallazgos { get; set; }
    }
}
