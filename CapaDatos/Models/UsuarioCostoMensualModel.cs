using System;
using System.Collections.Generic;

namespace CapaDatos.Models
{
    public class UsuarioCostoMensualModel
    {

        public long IdUsuarioCostoMensual { get; set; }
        public Nullable<long> IdUsuario { get; set; }
        public Nullable<int> Anio { get; set; }
        public Nullable<int> Mes { get; set; }
        public string NombreMes { get; set; }
        public Nullable<decimal> CostoMensual { get; set; }
        public long IdUCreo { get; set; }
        public long? IdULider { get; set; }
        public System.DateTime FechaCreo { get; set; }
        public Nullable<long> IdUModifico { get; set; }
        public Nullable<System.DateTime> FechaModifico { get; set; }

        public List<UsuarioCostoDistribucionModel> LstDistrbucion { get; set; }

        public string Nombre { get; set; }
        public string Clave { get; set; }
    }
    public class CostoAnualModel
    {
        public int Mes { get; set; }
        public string NombreMes { get; set; }
        public decimal TotalCosto { get; set; }
        public int TotalRecursos { get; set; }
    }
}
