using CapaDatos.Constants;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class CicloPruebaModel
    {
        public long IdCicloP { get; set; }
        public long IdProyecto { get; set; }
        public string Nombre { get; set; }
        public string Ambiente { get; set; }
        public string Descripcion { get; set; }
        public System.DateTime FechaInicio { get; set; }
        public System.DateTime FechaFin { get; set; }
        public long IdUCreo { get; set; }
        public System.DateTime FechaCreo { get; set; }
        public Nullable<long> IdUMod { get; set; }
        public Nullable<System.DateTime> FechaMod { get; set; }
        public string Estatus { get; set; }
        public string EstatusStr { get; set; }
        public decimal Avance { get; set; }
        public string Estatus2 { get; set; }
        public string Proyecto { get;  set; }


        public List<CasoPruebaModel> CasosPrueba { get; set; }
        public List<GraficaModel> LstEstatus { get; set; }
        public GraficaConsultaModel grEstatus { get; set; }
        public GraficaConsultaModel grEstatusBugs { get; set; }
        public int Defectos { get;  set; }
        public decimal Aprobado { get;  set; }
        public string ClaveProy { get;  set; }
        public decimal TiempoEjecucion { get;  set; }
    }
}
