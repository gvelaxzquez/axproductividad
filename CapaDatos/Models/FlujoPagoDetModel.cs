using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
   public  class FlujoPagoDetModel
    {
        public long IdFlujoPagoDet { get; set; }
        public long IdFlujoPago { get; set; }
        public Nullable<int> Secuencia { get; set; }
        public string Concepto { get; set; }
        public Nullable<decimal> Horas { get; set; }
        public Nullable<decimal> Amortizadas { get; set; }
        public Nullable<decimal> Procentaje { get; set; }
        public Nullable<decimal> Monto { get; set; }
        public Nullable<decimal> Total { get; set; }
        public Nullable<decimal> IVA { get; set; }

        public Nullable<System.DateTime> FechaDevOriginal { get; set; }
        public Nullable<System.DateTime> FechaDev { get; set; }
        public Nullable<System.DateTime> FechaFactura { get; set; }
        public Nullable<System.DateTime> FechaProgramadaPago { get; set; }
        public Nullable<System.DateTime> FechaPagoReal { get; set; }
        public bool Facturable { get; set; }
        public bool Facturada { get; set; }
        public bool Pagada { get; set; }
        public bool Vencido { get; set; }

        public int TipoFecha { get; set; }
        public Nullable<System.DateTime> Fecha { get; set; }
        public string Comentarios { get; set; }
        public string Factura { get; set; }
        public string Proyecto { get; internal set; }
        public int IdProyecto { get; internal set; }
    }
}
