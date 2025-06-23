using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class AuditoriaControlModel
    {
        public AuditoriaControlModel()
        {
            AuditoriaControlHallazgo = new List<AuditoriaControlHallazgoModel>();
            ProyectoListaControlDetalle = new ProyectoListaControlDetalleModel();
            Usuario = new UsuarioModel();
        }

        public long IdAuditoriaControl { get; set; }
        public int IdAuditoria { get; set; }
        public long IdProyectoListaControlDetalle { get; set; }
        public int IdProyectoListaControl { get; set; }
        public long? IdUAuditor { get; set; }
        public bool? Cumple { get; set; }
        public long IdUCreo { get; set; }
        public DateTime FechaCreo { get; set; }
        public long? IdUModifico { get; set; }
        public DateTime? FechaModifico { get; set; }
        public AuditoriaModel Auditoria { get; set; }
        public int TotalHallazgos { get; set; }
        public int TotalHallazgosAutomatico { get { return AuditoriaControlHallazgo.Count(); } }
        public int TotalHallazgosCorregido { get { return AuditoriaControlHallazgo.Count(x => x.Corregido == true); } }
        public int TotalHallazgosNoCorregido { get { return AuditoriaControlHallazgo.Count(x => x.Corregido == false); } }
        public ProyectoListaControlDetalleModel ProyectoListaControlDetalle { get; set; }
        public List<AuditoriaControlHallazgoModel> AuditoriaControlHallazgo { get; set; }
        public UsuarioModel Usuario { get; set; }
    }
}
