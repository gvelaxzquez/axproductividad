using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class UsuarioCostoDistribucionModel
    {

        public long IdUsuarioCostoD { get; set; }
        public int Anio { get; set; }
        public int Mes { get; set; }
        public long IdUsuario { get; set; }
        public long IdProyecto { get; set; }
        public string Proyecto { get; set; }
        public decimal Porcentaje { get; set; }
        public Nullable<long> IdUCreo { get; set; }
        public Nullable<System.DateTime> FechaCreo { get; set; }
        public string ClaveProy { get;  set; }
        public string NombreMes { get;  set; }
        public string Clave { get;  set; }

        public string Recurso { get;  set; }

        public decimal TotalMes { get; set; }
    }
}
