using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class ActividadRepositorioModel
    {
        public long IdActividadRepositorio { get; set; }
        public long IdActividad { get; set; }
        public long IdProyectoRepositorio { get; set; }
        public byte IdTipoLink { get; set; }
        public string IdLink { get; set; }
        public string Url { get; set; }
        public string TipoLink {get { return IdTipoLink == 1 ? "Commit" : "Otro"; }}
        public string Descripcion { get; set; }
        public long IdUCreo { get; set; }
        public string Usuario { get; set; }
        public string NumEmpleado { get; set; }
        public DateTime FechaCreo { get; set; }
    }
}
