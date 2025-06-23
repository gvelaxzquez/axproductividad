using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class QueryModel
    {
        public long IdQuery { get; set; }
        public string IdUnique { get; set; }
        public string Nombre { get; set; }
        public string Parametros { get; set; }
        public bool Activo { get; set; }
        public string Filtros { get; set; }
        public long IdUCreo { get; set; }
        public System.DateTime FechaCreo { get; set; }
        public long IdUMod { get; set; }
        public long FechaMod { get; set; }
    }
}
