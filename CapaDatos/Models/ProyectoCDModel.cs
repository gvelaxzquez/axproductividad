using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class ProyectoCDModel
    {
        public long IdProyectoCD { get; set; }
        public long IdProyecto { get; set; }
        public long? IdRecurso { get; set; }
        public long? TipoActividadId { get; set; }
        public decimal CostoMensual { get; set; }
        public decimal CostoPeriodo { get; set; }
        public System.DateTime FechaInicio { get; set; }
        public System.DateTime FechaFin { get; set; }
        public int Dias { get; set; }
        public decimal PorcDedicado { get; set; }
        public bool Aplicado { get; set; }
        public long IdUCreo { get; set; }
        public System.DateTime FechaCreo { get; set; }
        public Nullable<long> IdUMod { get; set; }
        public Nullable<System.DateTime> FechaMod { get; set; }
        public decimal HorasInvertidas { get; set; }
        public string Nombre { get; set; }
        public string Fase { get; set; }
        public string CveRecurso { get; set; }
        public string CveTipoActividad { get; set; }
        public string Tipo { get; set; }
        public decimal CostoPlaneado { get; set; }
        public decimal CostoCD { get; set; }
        public decimal CostoCI { get; set; }
        public decimal CostoTotal { get; set; }
    }

    public class ProyectoCDNuevoModel
    {
        public long IdProyecto { get; set; }
        public long Id { get; set; }
        public long IdTipoActividad { get; set; }
        public string Nombre { get; set; }
        public decimal Costo { get; set; }
        public string Tipo { get; set; }
        public decimal Invertido { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
    }
}
