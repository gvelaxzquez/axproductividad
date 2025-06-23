using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class PlantillaModel
    {
        public long IdPlantilla { get; set; }
        public long CategoriaId { get; set; }
        public long? IdPlantillaRel { get; set; }
        public string Titulo { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public string Contenido { get; set; }
        public long Activo { get; set; }
        public long IdUCreo { get; set; }
        public System.DateTime FechaCreo { get; set; }
        public long IdUMod { get; set; }
        public System.DateTime FechaMod { get; set; }
        public string UsuarioAct { get;  set; }
    }
}
