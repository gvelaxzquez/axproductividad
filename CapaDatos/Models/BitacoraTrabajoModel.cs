using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class BitacoraTrabajoModel
    {
        public long IdKey { get; set; }
        public long IdUsuario { get; set; } 
        public string Nombre { get; set; }  
        public DateTime Fecha { get; set; }
        public Decimal Horas { get; set; }
        public int Total { get; set; }  

        public List<ActividadTrabajoModel> LstActividades { get; set; }


    }
}
