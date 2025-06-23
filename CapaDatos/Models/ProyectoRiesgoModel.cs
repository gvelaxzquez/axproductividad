using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class ProyectoRiesgoModel
    {
        public string NoRiesgo { get { return Proyecto.Clave + " - " + ConsecutivoProyecto.ToString("D4"); } }
        public int IdProyectoRiesgo { get; set; }
        public int? IdRiesgo { get; set; }
        [Range(1, long.MaxValue)]
        public long IdProyecto { get; set; }
        public short ConsecutivoProyecto { get; set; }
        [Range(typeof(DateTime), "2000-01-01", "2300-01-01")]
        public DateTime FechaIdentificacion { get; set; }
        [Range(1, long.MaxValue)]
        public long CatalogoCategoriaId { get; set; }
        [Range(1, long.MaxValue)]
        public long CatalogoFuenteId { get; set; }
        [Required(AllowEmptyStrings = false)]
        [MaxLength(1500)]
        public string DescripcionRiesgo { get; set; }
        [MaxLength(1500)]
        [Required(AllowEmptyStrings = false)]
        public string DescripcionEfecto { get; set; }
        [Required(AllowEmptyStrings = false)]
        [MaxLength(600)]
        public string Causas { get; set; }
        [Required(AllowEmptyStrings = false)]
        [MaxLength(250)]
        public string EventoMaterializacion { get; set; }
        [Range(1, byte.MaxValue)]
        public byte IdRiesgoImpacto { get; set; }
        [Range(1, byte.MaxValue)]
        public byte IdRiesgoProbabilidad { get; set; }
        [Range(1, long.MaxValue)]
        public bool Activo { get; set; }
        public long IdUCreo { get; set; }
        public DateTime FechaCreo { get; set; }
        public CatalogoGeneralModel Categoria { get; set; }
        public CatalogoGeneralModel Fuente { get; set; }
        public ProyectosModel Proyecto { get; set; }
        public RiesgoModel Riesgo { get; set; }
        public RiesgoImpactoModel Impacto { get; set; }
        public RiesgoProbabilidadModel Probabilidad { get; set; }
        public List<RiesgoEvaluacionModel> Evaluacion { get; set; }
        public List<ProyectoRiesgoComentarioModel> Comentarios { get; set; }
        public List<ProyectoRiesgoEstrategiaModel> Estrategias { get; set; }

    }
}
