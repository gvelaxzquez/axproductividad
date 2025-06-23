using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;

namespace CapaDatos.Models
{
    public class GraficaConsultaModel
    {
        public Guid id { get; set; }
        public string Nombre { get; set; }
        public string Tipo { get; set; }
        public string Series { get; set; }
        public string LstValores { get; set; }
        public string LstColumnas { get; set; }
        public string Tabla { get; set; }


    }
}
