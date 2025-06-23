using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class WorkSpaceTabsModel
    {

        public long IdWorkSpaceTab { get; set; }
        public long IdWorkSpace { get; set; }
        public long IdView { get; set; }
        public string Nombre { get; set; }
        public string Parametros { get; set; }
        public string Filtros { get; set; }
        public string Tipo { get; set; }
        public int Orden { get; set; }
        public bool Fijo { get; set; }
        public long IdUCreo { get; set; }
        public System.DateTime FechaCreo { get; set; }
        public string Agrupador { get;  set; }
        public string Columnas { get; set; }
        public string Widgets { get; set; }
        public string LayoutConfig { get; set; }
        public Nullable<int> NextId { get; set; }
        public Nullable<long> IdUMod { get; set; }
        public Nullable<System.DateTime> FechaMod { get; set; }
    }
}
