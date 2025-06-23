using CapaDatos.DataBaseModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class AuditoriaModel
    {
        public AuditoriaModel()
        {
            AuditoriaControl = new List<AuditoriaControlModel>();
            AuditoriaControlHallazgo = new List<AuditoriaControlHallazgoModel>();
            Usuario = new UsuarioModel();
            ProyectoListaControl = new ProyectoListaControlModel();
        }

        public int IdAuditoria { get; set; }
        public string NoAuditoria { get; set; }
        public int? IdProyectoListaControl { get; set; }
        public string IdEstatus { get; set; }
        public string Estatus { get { return IdEstatus == "P" ? "En progreso" : IdEstatus == "X" ? "Revisado" : "Finalizado"; } }
        public DateTime FechaInicio { get; set; }
        public DateTime? FechaFin { get; set; }
        public string Comentarios { get; set; }
        public long IdUCreo { get; set; }
        public DateTime FechaCreo { get; set; }
        public long? IdUModifico { get; set; }
        public DateTime? FechaModifico { get; set; }
        public int CuentaControlTotal { get { return CuentaControlCumple + CuentaControlNoCumple + CuentaControlNull; } }
        public int CuentaControlRevisados { get { return CuentaControlCumple + CuentaControlNoCumple; } }
        public int CuentaControlCumple { get { return AuditoriaControl.Where(x => x.Cumple == true).Count(); } }
        public int CuentaControlNoCumple { get { return AuditoriaControl.Where(x => x.Cumple == false).Count(); } }
        public int CuentaControlNull { get { return AuditoriaControl.Where(x => x.Cumple == null).Count(); } }
        public int CuentaInconformidadBajo { get { return AuditoriaControlHallazgo.Where(x => x.Gravedad == 1 && x.Activo == true).Count(); } }
        public int CuentaInconformidadMedio { get { return AuditoriaControlHallazgo.Where(x => x.Gravedad == 2 && x.Activo == true).Count(); } }
        public int CuentaInconformidadGrave { get { return AuditoriaControlHallazgo.Where(x => x.Gravedad == 3 && x.Activo == true).Count(); } }
        public UsuarioModel Usuario { get; set; }
        public ProyectoListaControlModel ProyectoListaControl { get; set; }
        public List<AuditoriaControlModel> AuditoriaControl { get; set; }
        public List<AuditoriaControlHallazgoModel> AuditoriaControlHallazgo { get; set; }
        public List<UsuarioModel> UsuarioAuditor { get; set; }
    }
}
