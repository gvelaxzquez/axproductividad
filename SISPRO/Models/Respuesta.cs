using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AxProductividad.Models
{
    public class Respuesta
    {
        public bool Exito = false;
        public string Error { get; set; }
        public string Mensaje { get; set; }
        public object Content { get; set; }
    }
}