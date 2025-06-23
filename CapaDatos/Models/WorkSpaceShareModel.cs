using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class WorkSpaceShareModel
    {

        public long IdWorkSpaceShare { get; set; }

        public string Nombre { get; set; }
        public string NumEmpleado { get; set; }
        public long IdWorkSpace { get; set; }
        public long IdUsuario { get; set; }
        public long IdUCreo { get; set; }
        public System.DateTime FechaCreo { get; set; }
    }
}
