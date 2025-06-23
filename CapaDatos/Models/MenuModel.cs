using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class MenuModel
    {
       public int IdMenu { get; set; }
       public int? IdMenuPadre { get; set; }
       public string Descripcion { get; set; }
       public string Controlador { get; set; }
       public string Accion { get; set; }
       public bool Activo { get; set; }
       public long Orden { get; set; }
       public int Nivel { get; set; }
       public string Icono { get; set; }
       

    }
}
