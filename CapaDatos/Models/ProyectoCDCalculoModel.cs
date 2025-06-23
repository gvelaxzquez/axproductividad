using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class ProyectoCDCalculoModel
    {
        public long IdUsuario { get; set; }
        public long IdProyecto { get; set; }
        private string tipo;
        public string Tipo
        {
            get
            {
                return tipo;
            }
            set
            {
                tipo = value == "horas" ? "h" : value == "porcentaje" ? "p" : "a";
            }
        }
        public DateTime FechaInicio { get; set; }
        private DateTime fechaFin;
        public DateTime FechaFin
        {
            get
            {
                return fechaFin;
            }
            set
            {
                fechaFin = value;
            }
        }
    }
}
