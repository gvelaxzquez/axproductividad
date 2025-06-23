using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class CatalogoGeneralModel
    {
        public long IdCatalogo { get; set; }
        public long? IdCatalogoN { get; set; }
        public int IdTabla { get; set; }
        public string DescCorta { get; set; }
        public string DescLarga { get; set; }
        public string DatoEspecial { get; set; }
        public bool Cabecera { get; set; }
        public bool Protegido { get; set; }
        public bool Activo { get; set; }
    }
}
