using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
   public  class FlujoPagoModel
    {

        public long IdFlujoPago { get; set; }
        public long IdProyecto { get; set; }
        public decimal PrecioHora { get; set; }
        public decimal HorasTotales { get; set; }
        public decimal HorasAmortizar { get; set; }
        public decimal PorcIVA { get; set; }
        public System.DateTime FechaCreo { get; set; }
        public long IdUCreo { get; set; }
        public Nullable<System.DateTime> FechaMod { get; set; }
        public Nullable<long> IdUMod { get; set; }
        public bool Activo { get; set; }

        public decimal Ene { get; set; }
        public decimal Feb { get; set; }
        public decimal Mar { get; set; }
        public decimal Abr { get; set; }
        public decimal May { get; set; }
        public decimal Jun { get; set; }
        public decimal Jul { get; set; }
        public decimal Ago { get; set; }
        public decimal Sep { get; set; }
        public decimal Oct { get; set; }
        public decimal Nov { get; set; }
        public decimal Dic { get; set; }


        public decimal? TotalFacturado { get; set; }
        public decimal? TotalPagado { get; set; }
        public decimal? Saldo { get; set; }


        public decimal? TotalFacturadoHoras { get; set; }
        public decimal? TotalPagadoHoras { get; set; }
        public decimal? SaldoHoras { get; set; }


        public string ClaveProy { get; set; }
        public string NombreProy { get; set; }
        public string Lider { get; set; }
        public string Cliente { get; set; }

       public List<FlujoPagoDetModel> FlujoDetalle { get; set; }
        public decimal? TotalProyecto { get;  set; }
        public decimal? TotalProyectoHoras { get; set; }
        public decimal? TotalAmortizadas { get;  set; }
        public decimal? TotalAmortizadoHoras { get;  set; }
        public decimal? SaldoAmortizarHoras { get;  set; }
        public decimal? SaldoAmortizar { get;  set; }
        public decimal PendienteAmortizar { get;  set; }
        public decimal Amortizadas { get;  set; }
        public decimal Facturado { get;  set; }
        public decimal PendienteFacturar { get;  set; }
        public decimal Avance { get;  set; }
    }
}
