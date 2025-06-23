using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class ProyectoRepositorioModel
    {
        public long IdProyectoRepositorio { get; set; }
        public long IdProyecto { get; set; }
        public byte IdTipoRepositorio { get; set; }
        public string Tipo { get { return IdTipoRepositorio == 1 ? "Azure" : "Github"; } }
        public string Nombre { get; set; }
        public string Organizacion { get; set; }
        public string Proyecto { get; set; }
        public long IdUCreo { get; set; }
        public DateTime FechaCreo { get; set; }
        public ProyectosModel Proyecto1 { get; set; }
        public UsuarioModel Usuario { get; set; }
    }
}
