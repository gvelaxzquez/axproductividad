using CapaDatos.Constants;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class ActividadesModel
    {
        public long IdActividad { get; set; }
        public bool? Seleccionado { get; set; }
      
        public string IdActividadStr { get; set; }
        public long? IdUsuarioAsignado { get; set; }

        public string BRSE { get; set; }
        public string BR { get; set; }

        public Nullable<bool> Backlog { get; set; }
        public string Descripcion { get; set; }
        public string CriterioAceptacion { get; set; }
        public string DocumentoRef { get; set; }

        public Nullable<int> Planificada { get; set; }
        public long? IdIteracion { get; set; }
        public Nullable<decimal> HorasFacturables { get; set; }
        public string Estatus { get; set; }
        public int Prioridad { get; set; }
        public string ComentariosFinales { get; set; }
        public Nullable<decimal> HorasAsignadas { get; set; }

        public Nullable<decimal> TiempoEjecucion { get; set; }
        public decimal HorasFinales { get; set; }
        public long IdProyecto { get; set; }
        public long TipoActividadId { get; set; }
        public long? IdUsuarioResponsable { get; set; }
        public Nullable<long> ClasificacionId { get; set; }
        public long IdActividadRef { get; set; }
        public string IdActividadRefStr { get; set; }
        public Nullable<System.DateTime> FechaSolicitado { get; set; }
        public Nullable<System.DateTime> FechaInicio { get; set; }
        public Nullable<System.DateTime> FechaTermino { get; set; }
        public Nullable<System.DateTime> FechaRevision { get; set; }
        public Nullable<System.DateTime> FechaCierre { get; set; }
        public Nullable<System.DateTime> FechaFin { get; set; }
        public Nullable<long> MotivoRechazoId { get; set; }
        public string DescripcionRechazo { get; set; }
        public string EvidenciaRechazo { get; set; }
        public long IdUCreo { get; set; }
        public System.DateTime FechaCreo { get; set; }
        public Nullable<long> IdUMod { get; set; }
        public Nullable<System.DateTime> FechaMod { get; set; }
        public bool Retrabajo { get; set; }

        public string EstatusStr { get; set; }
        public string TipoActividadStr { get; set; }
        public string ClasificacionStr { get; set; }
        public string PrioridadStr { get; set; }
        public string AsignadoStr { get; set; }
        public string AsignadoPath { get; set; }
        public string ResponsableStr { get; set; }
        public string ResponsablePath { get; set; }
        public string ProyectoStr { get; set; }
        public string CorreoResponsable { get; set; }
        public string MotivoRechazoStr { get; set; }
        public string UsuarioRechazoStr { get; set; }
        public DateTime? FechaRechazo { get; set; }
        public string CorreoLider { get; set; }

        public string ClaveTipoActividad { get; set; }
        public string ClaveClasificacionActividad { get; set; }
        public string ClaveUsuario { get; set; }
        public string ClaveProyecto { get; set; }
        public string Sprint { get; set; }
        public string EstatusCte { get; set; }
        public string EstatusCteStr { get; set; }

        public byte? TipoId { get; set; }
        public string TipoNombre { get; set; }
        public string TipoUrl { get; set; }

        public string Comentario { get; set; }

        public long IdUsuario { get; set; }
        public List<ActividadTrackingModel> Tracking { get; set; }
        public List<ActividadComentarioModel> Comentarios { get; set; }
        public List<ActividadArchivoModel> Archivos { get; set; }
        public List<ActividadTrabajoModel> Trabajos { get; set; }

        public List<ActividadesModel> Dependencias { get; set; }
        public List<ActividadComentarioModel> ActividadLog { get; set; }

        public List<ActividadesValidacionModel> Validaciones { get; set; }
        public List<ProyectoIssueModel> Issues { get; set; }

        public decimal? Progreso { get; set; }
        public string ProgresoStr { get; set; }

        public int ComentariosTotal { get; set; }
        public int ArchivosTotal { get; set; }
        public int Tipo { get; set; }

        private int _PSP;
        public int PSP { get { return new List<long> { FasePSP.Bug, FasePSP.Construccion, FasePSP.Diseño }.Contains(TipoActividadId) /* && Estatus == "P"*/ ? _PSP : 0; } set { _PSP = value; } }


        //public int PSP { get; set; }
        public long IdActividadDependencia { get; set; }
        public long IdActividadD { get; set; }

        public int DependenciasA { get; set; }
        public int DependenciasT { get; set; }
        public decimal AvanceDependencia { get; set; }
        public DateTime FechaActual { get; set; }

        public int TotalComentarios { get; set; }
        public int TotalArchivos { get; set; }
        public int TotalDependencias { get; set; }
        public int TotalLog { get; set; }
        public int TotalTiempos { get; set; }
        public int TotalValidaciones { get; set; }
        public bool Critico { get; set; }

        private int? _IdListaRevision;
        public long? PrioridadId { get; set; }

        public int? IdListaRevision { get { return _IdListaRevision <= 0 ? null : _IdListaRevision; } set { _IdListaRevision = value; } }
        public bool EsPeerReview { get; set; }
        public List<ActividadRepositorioModel> ActividadRepositorioLinks { get; set; }
        public List<CatalogoGeneralModel> ProyectoRepositorio { get; set; }

        public string Icono { get; set; }
        public string Termino { get; set; }
        public int TotalIssues { get; internal set; }

        public DateTime FInicio { get; set; }
        public DateTime FFin { get; set; }
        public int Jerarquia { get;  set; }
        public long IdActividadR1 { get;  set; }
        public long IdActividadR2 { get;  set; }
        public string IdUModStr { get;  set; }
        public DateTime? FechaLiberacion { get;  set; }
        public string CorreoAsignado { get;  set; }
        public string AvanceUX { get;  set; }
        public string AvanceBugs { get;  set; }
        public string AvanceDev { get;  set; }
        public string AvanceCalidad { get;  set; }
        public string AvanceImp { get;  set; }
        public long IdCicloCaso { get;  set; }

        public decimal Objetivo { get; set; }
        public decimal Performance { get; set; }

        public Nullable<int> Puntos { get; set; }

        public long IdWorkFlow { get; set; }
        public string WorkFlow { get; set; }
        public string ColorW { get; set; }
        public string HU { get; set; }
        public string ColorTexto { get;  set; }
        public string ClaveResponsable { get; set; }
        public long? IdActividadRelacionada { get; set; }
        public int Orden { get; set; }
    }
}
