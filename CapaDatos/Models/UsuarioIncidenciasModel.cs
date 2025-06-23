using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
   public class UsuarioIncidenciasModel
    {
        public long IdIncidencia { get; set; }
        public long IdUsuario { get; set; }
        public long TipoIncidenciaId { get; set; }
        public System.DateTime FechaInicio { get; set; }
        public System.DateTime FechaFin { get; set; }
        public int DiasConsiderar { get; set; }
        public string Comentarios { get; set; }
        public long IdUCreo { get; set; }
        public System.DateTime FechaCreo { get; set; }

        public string TipoIncidenciaStr { get; set; }
        public string UsuarioStr { get; set; }
        public string Clave { get; set; }
    }
}
