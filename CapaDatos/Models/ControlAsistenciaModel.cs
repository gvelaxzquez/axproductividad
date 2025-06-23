using System;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class ControlAsistenciaModel
    {
        public int IdMes { get; set; }
        public int IdAnio { get; set; }
        public int Recursos { get; set; }
        public int EnLinea { get; set; }
        public int Desconectado { get; set; }
        public int Ausente { get; set; }
        public int Retrasos { get; set; }
        public int Incidencias { get; set; }

        public DateTime Fecha { get; set; }

        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
        public long? IdUsuario { get; set; }

        public DataTable dtAsistenciaMes { get; set; }
        public DataTable dtAsistenciaMesHoras { get; set; }
        public List<UsuarioAsistenciaModel> LstAsistencia { get; set; }
        public string Anio { get; set; }
        public string Mes { get; set; }
        public string Recurso { get; set; }
        public string Responsable { get; set; }
        public string Clave { get; set; }
        public string Gerente { get; set; }
        public string ResponsableContrato { get; set; }
        public List<UsuarioAsistenciaModel> LstAsistenciaDetalle { get; set; }
    }
}
