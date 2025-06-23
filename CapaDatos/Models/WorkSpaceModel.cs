using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class WorkSpaceModel
    {


        public long IdWorkSpace { get; set; }
        public string IdUnique { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }

        public bool Propietario { get; set; }
        public long IdUCreo { get; set; }
        public System.DateTime FechaCreo { get; set; }
        public long IdUMod { get; set; }
        public System.DateTime FechaMod { get; set; }
        public bool Activo { get; set; }

        public List<WorkSpaceTabsModel> WorkSpaceTabs { get; set; }



    }
}
