using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
  public  class TipoUsuarioModel
    {
        public int IdTipoUsuario { get; set; }
        public string Nombre { get; set; }
        public bool Protegido { get; set; }
        public bool Activo { get; set; }

        public long IdULogin { get; set; }
     
       
      

    }
}
