using CapaDatos.DataBaseModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class ActividadTipoModel
    {
        public byte ActividadTipoId { get; set; }
        public string Nombre { get; set; }

        public string Url { get; set; }
        public string Requeridos { get; set; }
        public string Ocultar { get; set; }
        public string NoRequeridos { get; set; }

        public byte? Jerarquia { get; set; }
        public string Ver { get; set; }
        public List<ActividadTipoCamposModel> ActividadCampos { get;  set; }
        public List<String> LstRequeridos { get; set; }
        public List<String> LstNoRequeridos { get; set; }
        public List<String> LstOcultar { get; set; }
        public List<String> LstVer { get; set; }

        public string Plantilla { get; set; }
    }
}
