using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class ProyectoInformeCostoModel
    {
        public ProyectoInformeCostoModel()
        {
            GraficaPastelFases = new GraficaInformeModel();
            GraficaPastelRecursos = new GraficaInformeModel();
            GraficaPeriodo = new GraficaLineaModel();
        }
        public decimal Presupuesto { get; set; }
        public decimal Directo { get; set; }
        public decimal Indirecto { get; set; }
        public decimal Total { get { return Directo + Indirecto; } }
        public decimal Consumido { get { return Presupuesto == 0 ? 0 : (Total * 100 / Presupuesto); } }
        public string Proyecto { get; set; }
        public string Lider { get; set; }
        public GraficaInformeModel GraficaPastelFases { get; set; }
        public GraficaInformeModel GraficaPastelRecursos { get; set; }
        public GraficaLineaModel GraficaPeriodo { get; set; }
    }

    public class GraficaInformeModel
    {
        public GraficaInformeModel()
        {
            values = new List<GraficaPastelValuesModel>();
        }
        public List<GraficaPastelValuesModel> values { get; set; }
        public List<string> data { get { return values.Select(x => x.name).ToList(); } }
    }

    public class GraficaLineaModel
    {
        public GraficaLineaModel()
        {
            values = new List<GraficaLineaValuesModel>();
            data = new List<string>();
        }
        public List<GraficaLineaValuesModel> values { get; set; }
        public List<string> data { get; set; }
    }


    public class GraficaPastelValuesModel
    {
        public string name { get; set; }
        public decimal value { get; set; }
    }

    public class GraficaLineaValuesModel
    {
        public string name { get; set; }
        public string type { get { return "line"; } }
        public List<decimal> data { get; set; }
    }

    //public class ProyectoCostosModel
    //{
    //    public string Concepto { get; set; }
    //    public string Fase { get; set; }
    //    public string Fecha { get; set; }
    //    public decimal Costo { get; set; }
    //}
}
