using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class ViewsModel
    {

        public long IdView { get; set; }
        public string Nombre { get; set; }
        public string Tipo { get; set; }
        public string Icono { get; set; }
        public bool Defecto { get; set; }

    }
}
