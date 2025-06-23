using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class WorkFlowModel
    {

        public long IdWorkFlow { get; set; }
        public long IdProyecto { get; set; }
        public string ClaveProyecto { get; set; }
        public byte IdActividadTipo { get; set; }
        public string TipoNombre { get; set; }
        public string Nombre { get; set; }
        public int Orden { get; set; }
        public string Color { get; set; }
        public string ColorTexto { get; set; }
        public string EstatusR { get; set; }
        public int WIP { get; set; }
        public Nullable<bool> Notifica { get; set; }
        public Nullable<int> TipoNotificacion { get; set; }
        public Nullable<bool> Editable { get; set; }
        public long IdUCreo { get; set; }
        public System.DateTime FechaCreo { get; set; }
        public Nullable<long> IduMod { get; set; }
        public Nullable<System.DateTime> FechaMod { get; set; }
    }
}
