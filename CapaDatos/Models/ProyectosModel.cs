using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class ProyectosModel
    {
      

        public long IdProyecto { get; set; }
        public Nullable<long> IdCliente { get; set; }
        public string IdClienteStr { get; set; }
        public string Nombre { get; set; }
        public string Clave { get; set; }
        public Nullable<long> TipoProyectoId { get; set; }
        public string TipoProyectoStr { get; set; }
        public Nullable<long> IdULider { get; set; }
        public string IdULiderStr { get; set; }
        public Nullable<bool> Activo { get; set; }
        public Nullable<long> IdUCreo { get; set; }
        public Nullable<System.DateTime> FechaCreo { get; set; }
        public Nullable<long> IdUModifico { get; set; }
        public Nullable<System.DateTime> FechaModifico { get; set; }
        public string ClaveVal { get; set; }

        public string Descripcion { get; set; }
        public Nullable<long> SemaforoID { get; set; }
        public Nullable<decimal> Avance { get; set; }
        public Nullable<decimal> AvanceReal { get; set; }
        public string Semaforo { get; set; }

        public Nullable<decimal> HorasEstimadasInicial { get; set; }
        public Nullable<System.DateTime> FechaInicioPlan { get; set; }
        public Nullable<System.DateTime> FechaFinPlan { get; set; }
        public Nullable<decimal> IngresoPlan { get; set; }

        public Nullable<bool> FijarHoras { get; set; }
        public Nullable<bool> FijarFechas { get; set; }
        public Nullable<System.DateTime> FechaFinComprometida { get; set; }
        public Nullable<System.DateTime> FechaFinComprometidaAnt { get; set; }
        public Nullable<decimal> CostoPlan { get; set; }


        public decimal HorasFacturable { get; set; }
        public decimal HorasAsignadas { get; set; }
        public decimal HorasReales { get; set; }
        public decimal HorasCompromiso { get; set; }
        public decimal Desfase { get; set; }

        public decimal HorasPlan { get; set; }
        public decimal HorasProgreso { get; set; }
        public decimal HorasTerminadas { get; set; }
        public string Lider { get; set; }

        public decimal AvanceCompPorc { get; set; }
        public decimal AvanceRealPorc { get; set; }
        public decimal DesfaseProc { get; set; }

        public decimal CPI { get; set; }
        public decimal SPI { get; set; }
        public decimal FactorCalidad { get; set; }
       

        public Nullable<long> MetodologiaId { get; set; }
        public string MetodologiaIdStr { get; set; }

        public string EstatusIdStr { get; set; }
        public Nullable<long> EstatusId { get; set; }
        public bool Visible { get; set; }

        public List<ActividadesModel> Actividades { get; set; }
        public List<UsuarioModel> Usuarios { get; set; }

        public byte IdTipoRepositorio { get; set; }
        public string Organizacion { get; set; }
        public decimal CostoAplicado { get; set; }

        public string MesMilestone { get; set; }
        public string DiaMilestone { get; set; }
        public string Milestone { get; set; }

        public int Milestones { get; set; }
        public int MTerminados { get; set; }
        public int MATiempo { get; set; }
        public int MDesfasados { get; set; }
        public int MAtrasados { get; set; }


        public decimal CostoPlaneado { get; set; }
        public decimal CostoActual { get; set; }
        public decimal CostoProyectado { get; set; }
        public decimal CostoHora { get; set; }

        public decimal TotalIngreso { get; set; }
        public decimal Facturado { get; set; }
        public decimal Cobrado { get; set; }
        public decimal Atrasado { get; set; }
        public decimal Saldo { get; set; }
        public long IdFlujoPagos { get; set; }
        public decimal PrecioHora { get; set; }


        public decimal RentabilidadPlan { get; set; }
        public decimal RentabilidadActual { get; set; }
        public decimal RentabilidadFacturado { get; set; }
        public decimal RentabilidadProyectada { get; set; }


        public decimal RentabilidadPlanImporte { get; set; }
        public decimal RentabilidadActualImporte { get; set; }
        public decimal RentabilidadProyectadaImporte { get; set; }
        public decimal CostoDisponible { get; set; }
        public decimal CostoActualPorc { get; set; }
        public Nullable<System.DateTime> FechaProyectada { get;  set; }
        public string Estatus { get;  set; }

        public Nullable<bool> PSP { get; set; }
        public Nullable<decimal> HorasPromedio { get; set; }
        public string Tecnologias { get; set; }
        public long  IdPlantilla { get; set; }

        public decimal PorcIVA { get; set; }
        public int PuntosH { get;  set; }
        public int PTerminado { get;  set; }
        public int PPendiente { get;  set; }

        public long IdWorkFlow { get; set; }
    }
}
