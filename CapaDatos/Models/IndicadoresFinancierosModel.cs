using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class IndicadoresFinancierosModel
    {
        public double Ingresos { get;  set; }
        public decimal Costos { get;  set; }
        public decimal Rentabilidad { get;  set; }
        public double IngresosAnual { get;  set; }
        public decimal CostosAnual { get;  set; }
        public decimal RentabilidadAnual { get;  set; }
    }
}
