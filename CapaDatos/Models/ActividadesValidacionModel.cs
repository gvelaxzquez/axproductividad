using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class ActividadesValidacionModel
    {
        public long IdActividadVal { get; set; }
        public long IdActividad { get; set; }
        public long IdAutorizacion { get; set; }
        public string NombreAut { get; set; }
        public string Estatus { get; set; }
        public int Secuencia { get; set; }
        public Nullable<long> IdUAtendio { get; set; }
        public Nullable<System.DateTime> FechaAtendio { get; set; }
        public Nullable<long> MotivoRechazoId { get; set; }
        public string DescripcionRechazo { get; set; }
        public bool Valida { get; set; }
        public string NombreValido { get; set; }


    }
}
