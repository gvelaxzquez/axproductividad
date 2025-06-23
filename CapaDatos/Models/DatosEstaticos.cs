using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class DatosEstaticos
    {

            public static string ConexionEF = "metadata=res://*/DataBaseModel.BdProductividad.csdl|res://*/DataBaseModel.BdProductividad.ssdl|res://*/DataBaseModel.BdProductividad.msl;provider=System.Data.SqlClient;provider connection string='data source={0};initial catalog={1};user id={2};password={3};MultipleActiveResultSets=True;App=EntityFramework';";
            public static string ConexionSP = "data source = {0}; initial catalog ={1}; user id={2};password={3}";
    }
}
