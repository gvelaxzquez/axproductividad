using DocumentFormat.OpenXml.Office2010.Excel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class PieChartModel
    {

        public string name { get; set; }
        public decimal value { get; set; }
        public string color { get; set; }
    }
}
