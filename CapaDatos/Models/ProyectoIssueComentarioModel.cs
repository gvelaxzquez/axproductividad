using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class ProyectoIssueComentarioModel
    {
        public long IdIssueComentario { get; set; }
        public long IdIssue { get; set; }
        public string Comentario { get; set; }
        public bool Autogenerado { get; set; }
        public bool Activo { get; set; }
        public long IdUCreo { get; set; }
        public DateTime FechaCreo { get; set; }
        public long? IdUElimino { get; set; }
        public DateTime? FechaElimino { get; set; }

        public UsuarioModel Usuario { get; set; }
    }
}
