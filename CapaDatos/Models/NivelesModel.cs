using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
   public  class NivelesModel
    {

        public long IdNivel { get; set; }
        public string Nombre { get; set; }
        public decimal FactorCumplimiento { get; set; }
        public decimal FactorHoras { get; set; }
        public decimal Estandar { get; set; }
        public Nullable<decimal> EstandarDiario { get; set; }
        public int SemanasEstabilizacion { get; set; }
        public bool Activo { get; set; }
        public long IdUCreo { get; set; }
        public System.DateTime FechaCreo { get; set; }
    }
}
