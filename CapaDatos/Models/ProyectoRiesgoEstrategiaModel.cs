using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class ProyectoRiesgoEstrategiaModel
    {
        public int IdProyectoRiesgoEstrategia { get; set; }
        public int IdProyectoRiesgo { get; set; }
        public long CatalogoEstrategiaId { get; set; }
        [Required(AllowEmptyStrings = false)]
        [MaxLength(1000)]
        public string PlanMitigacion { get; set; }
        [Range(1, long.MaxValue)]
        public long IdUResponsable { get; set; }
        [Required(AllowEmptyStrings = false)]
        [MaxLength(500)]
        public string DisparadorPlan { get; set; }
        public DateTime FechaIdentificacion { get; set; }
        public bool Realizada { get; set; }
        public string Responsable { get; set; }
        public string Estrategia { get; set; }
    }
}
