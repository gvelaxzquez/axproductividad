using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class UsuarioAsistenciaModel
    {
        public long IdUsuarioAsistencia { get; set; }
        public long IdUsuario { get; set; }
        public string Clave { get; set; }
        public string Recurso { get; set; }

        public string Responsable { get; set; }
        public string Estatus { get; set; }
        public int Retraso { get; set; }
        public int Incidencias { get; set; }
        public string IncidenciasStr { get; set; }
        public int TiempoRetraso { get; set; }
        public decimal TiempoTrabajo { get; set; }
        public decimal HorasRetraso { get; set; }


        public decimal TiempoComida { get; set; }
        public decimal Jornada { get; set; }
        public decimal ToleranciaComida { get; set; }
        public Nullable<System.DateTime> HoraEntrada { get; set; }
        public Nullable<System.DateTime> HoraSalidaComer { get; set; }
        public Nullable<System.DateTime> HoraEntradaComer { get; set; }
        public Nullable<System.DateTime> HoraSalida { get; set; }
        public System.DateTime Fecha { get; set; }

        public string TiempoComidaStr { get; set; }
        public string TiempoTrabajoStr { get; set; }
        public string Dia { get; set; }
    }
}
