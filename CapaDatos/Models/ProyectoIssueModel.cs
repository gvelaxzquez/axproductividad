using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class ProyectoIssueModel
    {
        public ProyectoIssueModel()
        {
            ProyectoIssueComentario = new List<ProyectoIssueComentarioModel>();
        }

        public long IdIssue { get; set; }
        public int IdIssueProyecto { get; set; }
        public long IdActividadIssue { get; set; }
        public string NoIssue { get { return Proyecto.Clave  + " - " + IdIssueProyecto.ToString("D4") ; } }
        public long? IdProyecto { get; set; }
        public string Descripcion { get; set; }
        public DateTime FechaDeteccion { get; set; }
        public DateTime? FechaCompromiso { get; set; }
        public DateTime? FechaCierre { get; set; }
        public long? CatalogoPrioridadId { get; set; }
        public long? CatalogoEstatusId { get; set; }
        public bool Bloqueante { get; set; }
        public long? IdUResponsable { get; set; }
        public string ResponsableExterno { get; set; }
        public long IdUCreo { get; set; }
        public DateTime FechaCreo { get; set; }
        public long? IdUModifico { get; set; }
        public DateTime? FechaModifico { get; set; }

        public string EstatusIssue { get; set; }
        public string EstatusIssueColor { get; set; }
        public ProyectosModel Proyecto { get; set; }
        public CatalogoGeneralModel Estatus { get; set; }
        public CatalogoGeneralModel Prioridad { get; set; }
        public UsuarioModel Usuario { get; set; }
        public List<ProyectoIssueComentarioModel> ProyectoIssueComentario { get; set; }
    }
}
