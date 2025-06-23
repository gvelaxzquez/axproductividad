using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class WorkSpaceTabsFileModel
    {

   

        public long IdWorkSpaceTabFile { get; set; }
        public long IdWorkSpaceTab { get; set; }
        public string BlobId { get; set; }
        public string URL { get; set; }
        public string Nombre { get; set; }
        public string Tipo { get; set; }

        public string Creo { get; set; }
        public Nullable<int> Tamano { get; set; }
        public long IdUCreo { get; set; }
        public System.DateTime FechaCreo { get; set; }


    }
}
