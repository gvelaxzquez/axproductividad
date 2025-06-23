using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class ReporteIFTModel
    {

        public List<ActividadesModel> LstActividades { get; set; }
        public List<UsuarioModel> LstUsuarios { get; set; }

        public decimal? Total { get; set; }
        public string Anio { get; set; }
        public string Mes { get; set; }
        public string Recurso { get; set; }
        public string Clave { get; set; }
        public string Gerente { get; set; }
        public string ResponsableContrato { get; set; }

    }
}
