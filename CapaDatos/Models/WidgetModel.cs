using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class WidgetModel
    {
        public int IdWidget { get; set; }
        public string type { get; set; }
        public string defaultTitle { get; set; }
        public string group { get; set; }
        public string Descripcion { get; set; }
        public Nullable<bool> Activo { get; set; }
        public Nullable<long> IdUCreo { get; set; }
        public Nullable<System.DateTime> FechaCreo { get; set; }
    }
}
