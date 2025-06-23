using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class QueryShareModel
    {
        public long IdQueryU { get; set; }
        public long IdQuery { get; set; }
        public long IdUsuario { get; set; }
        public long IdUCreo { get; set; }
        public DateTime FechaCreo { get; set; }

    }
}
