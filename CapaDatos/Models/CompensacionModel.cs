using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
   public class CompensacionModel
    {
        public long IdUsuario { get; set; }
        public string Clave { get; set; }
        public string Recurso { get; set; }
        public string Lider { get; set; }
        public string Nivel { get; set; }
        public string EstandarMes { get; set; }
        public string HorasSolicitadas { get; set; }
        public string HorasLiberadas { get; set; }
        public string BonoCumplimiento { get; set; }
        public string HorasAdicionales { get; set; }
        public string BonoHoras { get; set; }
        public string Productividad { get; set; }
        public string Total { get; set; }
        public int Proyectos { get;  set; }
        public string Proyecto { get;  set; }
        public int CumpleCriterioAvance { get;  set; }
        public int CumpleCriterioCosto { get;  set; }
        public int CumpleCriterioRentabilidad { get;  set; }
        public int CumpleCriterioCaptura { get;  set; }
        public string Facturado { get;  set; }
        public string BonoPotencial { get; internal set; }
        public string MesAnio { get;  set; }
        public decimal Bono { get;  set; }
        public string ProductividadMes { get; set; }

        public decimal ProductividadTotal { get; set; }
        public string Incidencias { get; set; }
        public string EstandarPeriodo { get; set; }
        public string EstandarDiario{ get; set; }
        public string DiasLaborales { get; set; }
    }
    public class UsuarioIncidencia
    {
        public int IdUsuario { get; set; }
        public int DiasInc { get; set; }
        public string Incidencia { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
    }

}
