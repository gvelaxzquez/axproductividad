using System;

using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class ActividadTrabajoModel
    {
        public long IdActividadTrabajo { get; set; }

        public long IdKey { get; set; }
        public long IdActividad { get; set; }

        public string IdActividadStr { get; set; }
        public System.DateTime Fecha { get; set; }
        public decimal Tiempo { get; set; }
        public string Titulo { get; set; }
        public string Comentario { get; set; }
        public long IdUsuarioRegistro { get; set; }
        public System.DateTime FechaRegistro { get; set; }
        public ActividadesModel Actividad { get; set; }
        public UsuarioModel Usuario { get; set; }
        public ProyectosModel Proyecto { get; set; }
        public CatalogoGeneralModel Fase { get; set; }
        public CatalogoGeneralModel Clasificacion { get; set; }

    }
}
