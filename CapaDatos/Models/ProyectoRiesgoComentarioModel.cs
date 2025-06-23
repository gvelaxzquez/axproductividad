using CapaDatos.DataBaseModel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class ProyectoRiesgoComentarioModel
    {
        public long IdProyectoRiesgoComentario { get; set; }
        [Range(1, int.MaxValue)]
        public int IdProyectoRiesgo { get; set; }
        [MaxLength(1000)]
        [Required(AllowEmptyStrings = false)]
        public string Comentario { get; set; }
        public bool Autogenerado { get; set; }
        public bool Activo { get; set; }
        public long IdUCreo { get; set; }
        public DateTime FechaCreo { get; set; }
        public long? IdUElimino { get; set; }
        public DateTime? FechaElimino { get; set; }

        public ProyectoRiesgoModel ProyectoRiesgo { get; set; }
        public UsuarioModel Usuario { get; set; }
    }
}
