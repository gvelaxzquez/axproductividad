using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace CapaDatos.Models
{
    public class RequisicionesModel
    {
        public bool? ProcesarMultiple { get; set; }
        public long IdRequisicion { get; set; }
        public string Estatus { get; set; }
        public int TipoCompra { get; set; }
        public long IdProveedor { get; set; }
        public string NombreProveedor { get; set; }
        public decimal CostoTotal { get; set; }
        public string CotizacionPath { get; set; }
        public DateTime CotizacionVigencia { get; set; }
        public DateTime FechaLimite { get; set; }
        public long DepartamentoId { get; set; }
        public long? AreaId { get; set; }
        public string DescripcionDepartamento { get; set; }
        public string UsuarioCreo { get; set; }
        public int ProductoServicio { get; set; }
        public long IdProServ { get; set; }
        public string IdProServDescripcion { get; set; }

        public string NombreProyecto { get; set; }
        public string MetricoYMejora { get; set; }
        public string FactorXMejora { get; set; }
        public long MetodologiaId { get; set; }
        public string MetodologiaDescripcion { get; set; }


        public long TipoCambioId { get; set; }
        public decimal Cambio { get; set; }

        public string Justificacion { get; set; }
        public string CotizacionPath2 { get; set; }
        public string CotizacionPath3 { get; set; }


        public int Prioridad { get; set; }
        public string Prioridadstr { get; set; }
        public long? MotivoUrgenciaId { get; set; }


        public decimal? PrespupuestoMensual { get; set; }
        public decimal? PresupuestoDisponible { get; set; }


        public string TerminosCondiciones { get; set; }
        public long? OrdenCompra { get; set; }
        public decimal? OrdenCompraMonto { get; set; }
        public DateTime? OrdenCompraFecha { get; set; }
        public string OrdenCompraPath { get; set; }
        public string ArchivoOrdenCompraPath { get; set; }

        public string CuerpoCorreo { get; set; }
        public DateTime FechaGenero { get; set; }
        public DateTime? FechaValidacion { get; set; }
        public DateTime? FechaAprobacion { get; set; }
        public DateTime? FechaCierre { get; set; }
        public int VigenciaProceso { get; set; }
        public long IdUValidacion { get; set; }
        public long? IdRequisicionBase { get; set; }
        public long? IdAvanceObra { get; set; }

        public string ArchivoCotizacion { get; set; }
        public string ArchivoCotizacion2 { get; set; }
        public string ArchivoCotizacion3 { get; set; }

        public long IdUCreo { get; set; }
        public long? TipoCambioFinalId { get; set; }
        public decimal? CambioFinal { get; set; }

         public long? AFER { get; set; }

  
        public int Ciclo { get; set; }
        public string EnTiempo { get; set; }
        public string CtaDepto { get; set; }
        public string Cuenta { get; set; }
        public long GiroProeedor { set; get; }
        public long NoLineas { get; set; }
        //public List<RequisicionesDetalleModel> LstDetalles { get; set; }
        //public List<RequisicionesDetalleModel> LstDetallesEliminar { get; set; }
        //public List<ServiciosProductosRequisitosModel> LstRequisitos { get; set; }
        //public List<RequisicionesAutorizacionesModel> LstAutorizaciones { get; set; }

    }
}
