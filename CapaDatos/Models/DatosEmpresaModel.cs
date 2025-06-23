using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class DatosEmpresaModel
    {
        public int IdEmpresa { get; set; }
        public string NombreComercial { get; set; }
        public string RFC { get; set; }
        public string RazonSocial { get; set; }
        public string TelefonoEmpresa { get; set; }
        public string Direccion { get; set; }
        public string DireccionFiscal { get; set; }
        public string NombreComprado { get; set; }
        public string ExtensionComprador { get; set; }
        public string CorreoComprador { get; set; }
    }
}
