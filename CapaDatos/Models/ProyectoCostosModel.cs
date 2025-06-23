using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class ProyectoCostosModel
    {

        public string Concepto { get; set; }
        public string Fase { get; set; }
        public string Fecha { get; set; }
        public decimal Costo { get; set; }

        public long IdProyecto { get; set; }

        public int Anio { get; set; }
        public int Mes { get; set; }

        public string ClaveProy { get; set; }
        public string NombreProy { get; set; }
        public string Lider { get; set; }
        public string Cliente { get; set; }
        public decimal Ene { get; set; }
        public decimal Feb { get; set; }
        public decimal Mar { get; set; }
        public decimal Abr { get; set; }
        public decimal May { get; set; }
        public decimal Jun { get; set; }
        public decimal Jul { get; set; }
        public decimal Ago { get; set; }
        public decimal Sep { get; set; }
        public decimal Oct { get; set; }
        public decimal Nov { get; set; }
        public decimal Dic { get; set; }
        public decimal Planeado { get; set; }
        public decimal Acumulado { get; set; }
        public decimal PorcUtilizado { get; set; }

        public decimal CostoHoraReal { get; set; }

        public decimal CostoHoraPlan { get; set; }
        public decimal CostoProyectado { get; set; }
        public string NombreMes { get; internal set; }
    }
}
