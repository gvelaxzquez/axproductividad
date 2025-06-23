using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class NivelesHorasModel
    {
        public long IdNivelHoras { get; set; }
        public long IdNivel { get; set; }
        public int IdAnio { get; set; }
        public Nullable<decimal> Enero { get; set; }
        public Nullable<decimal> Febrero { get; set; }
        public Nullable<decimal> Marzo { get; set; }
        public Nullable<decimal> Abril { get; set; }
        public Nullable<decimal> Mayo { get; set; }
        public Nullable<decimal> Junio { get; set; }
        public Nullable<decimal> Julio { get; set; }
        public Nullable<decimal> Agosto { get; set; }
        public Nullable<decimal> Septiembre { get; set; }
        public Nullable<decimal> Octubre { get; set; }
        public Nullable<decimal> Noviembre { get; set; }
        public Nullable<decimal> Diciembre { get; set; }
        public long IdUCreo { get; set; }
        public System.DateTime FechaCreo { get; set; }
        public long IdUMod { get; set; }
        public Nullable<System.DateTime> FechaMod { get; set; }
    }
}
