using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public  class ActividadTipoCamposModel
    {

        public int IdActividadTipoC { get; set; }
        public byte IdActividadTipo { get; set; }
        public string NombreCampo { get; set; }
        public string NombreCampoHTML { get; set; }
        public bool Requerido { get; set; }
        public bool Ver { get; set; }
    }
}
