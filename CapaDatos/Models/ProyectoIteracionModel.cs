using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
   public class ProyectoIteracionModel
    {
        public long IdIteracion { get; set; }
        public long IdProyecto { get; set; }
        public string Proyecto { get; set; }
        public string Nombre { get; set; }
        public string Objetivo { get; set; }
        public System.DateTime FechaInicio { get; set; }
        public System.DateTime FechaFin { get; set; }
        public System.DateTime FechaProyectada { get; set; }
        public string Estatus { get; set; }
        public string EstatusStr { get; set; }
        public long IdUCreo { get; set; }
        public System.DateTime FechaCreo { get; set; }
        public Nullable<long> IdUMod { get; set; }
        public Nullable<System.DateTime> FechaMod { get; set; }
        public string Retrospectiva { get; set; }
        public List<ActividadesModel> Actividades { get; set; }
        public List<ActividadesModel> LstFases { get; set; }
        public List<ActividadesModel> LstHus { get; set; }

        public List<ActividadesModel> LstClasificacion { get; set; }
        public List<ActividadesModel> LstRecursos { get; set; }
        public GraficaConsultaModel Grafica { get; set; }
        public int CantActividades { get;  set; }
        public int CantActividadesTerminadas { get;  set; }
        public decimal HorasTotales { get;  set; }
        public decimal HorasTerminadas { get;  set; }
        public decimal HorasPendientes { get; set; }
        public decimal Avance { get;  set; }
        public string Estatus2 { get;  set; }
        public DateTime? FechaCierre { get;  set; }
        public decimal Velocidad { get;  set; }
        public decimal VelocidadActual { get;  set; }
        public int Puntos { get; set; }
        public int PuntosC { get; set; }
        public int PuntosP { get; set; }
        public int Plan { get;  set; }
        public int PTerminado { get;  set; }
        public int PPlaneado { get;  set; }
    }
}
