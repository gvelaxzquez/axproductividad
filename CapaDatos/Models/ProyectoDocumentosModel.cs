using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class ProyectoDocumentosModel
    {

        public long IdProDoc { get; set; }
        public long IdProyecto { get; set; }
        public Nullable<long> TipoDocumentoId { get; set; }
        public string TipoDocumentoStr { get; set; }
        public string Name { get; set; }
        public string Extension { get; set; }
        public string Ubicacion { get; set; }
        public Nullable<System.DateTime> FechaCreo { get; set; }
        public Nullable<long> IdUCreo { get; set; }
        public Nullable<System.DateTime> FechaElimino { get; set; }
        public Nullable<long> IdUElimino { get; set; }
        public Nullable<bool> Activo { get; set; }
        public string NombreCreo { get;  set; }
    }
}
