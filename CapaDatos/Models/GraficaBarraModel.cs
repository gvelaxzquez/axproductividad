using CapaDatos.DataBaseModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
   public class GraficaBarraModel
    {
      
        public int yAxisIndex { get; set; }
        public string name { get; set; }
        public string type { get; set; }
        public string barWidth { get; set; }
        public GraficaLabelModel label { get; set; }
        public List<string> data { get; set; }

    

    }
}
