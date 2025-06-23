using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class ActividadesLogModel
    {
        public long IdActividadLog { get; set; }
        public Nullable<long> IdActividad { get; set; }
        public string Descripcion { get; set; }
        public System.DateTime FechaHora { get; set; }
        public long IdUCreo { get; set; }
        public string IdUsuarioStr { get; set; }
        public long IdUsuario { get; set; }
        public string CveUsuario { get; set; }


    }
}
