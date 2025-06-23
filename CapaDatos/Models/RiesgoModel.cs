using Microsoft.SqlServer.Server;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Runtime.Remoting.Metadata.W3cXsd2001;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class RiesgoModel
    {
        public int IdRiesgo { get; set; }
        public string NoRiesgo { get { return IdRiesgo.ToString("D4"); } }
        [Range(typeof(DateTime), "2000-01-01", "2300-01-01")]
        public DateTime FechaIdentificacion { get; set; }
        [Range(1, long.MaxValue)]
        public long CatalogoCategoriaId { get; set; }
        [Range(1, long.MaxValue)]
        public long CatalogoFuenteId { get; set; }
        [Required(AllowEmptyStrings = false)]
        [MaxLength(1500)]
        public string DescripcionRiesgo { get; set; }
        [Required(AllowEmptyStrings = false)]
        [MaxLength(1500)]
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
        public bool Activo { get; set; }
        public long IdUCreo { get; set; }
        public DateTime FechaCreo { get; set; }
        public CatalogoGeneralModel Categoria { get; set; }
        public CatalogoGeneralModel Fuente { get; set; }
        public RiesgoImpactoModel Impacto { get; set; }
        public RiesgoProbabilidadModel Probabilidad { get; set; }
        public List<RiesgoEvaluacionModel> Evaluacion { get; set; }
    }

    public class RiesgoProbabilidadModel
    {
        public byte IdRiesoProbabilidad { get; set; }
        public byte Valor { get; set; }
        public string Cualitativo { get; set; }
        public string Cuantitativo { get; set; }
    }

    public class RiesgoImpactoModel
    {
        public byte IdRiesgoImpacto { get; set; }
        public byte Valor { get; set; }
        public string Cualitativo { get; set; }
        public string TerminoEconomico { get; set; }
        public string TerminoTiempo { get; set; }
    }

    public class RiesgoEvaluacionModel
    {
        public byte IdRiesgoEvaluacion { get; set; }
        public int Minimo { get; set; }
        public int Maximo { get; set; }
        public string Severidad { get; set; }
        public string Color { get; set; }
    }
}
