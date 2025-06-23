using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace CapaDatos.Models
{
    public class IndicadoresModel
    {


        public double Objetivo { get; set; }
        public double Estimadas { get; set; }
        public double Asignadas { get; set; }

        public double Real { get; set; }
        public double Liberadas { get; set; }
        public double Validacion { get; set; }
        public double Rechazadas { get; set; }

        public double IRetrabajo { get; set; }

        public double Proceso { get; set; }
        public double Productividad { get; set; }
        public double ProductividadMes { get; set; }


        public double HorasReportadas { get; set; }
        public double HorasProductivas { get; set; }
        public double Retrabajo { get; set; }
        public double ObjetivoActual { get; set; }

        public int DiasSinBugs { get; set; }
        public int RecordBugs { get; set; }

        public double DesfaseH { get; set; }
        public double DesfaseP { get; set; }

        public double GAPAsignadoVsEstimado { get; set; }
        public double GAPRealVsEstimado { get; set; }

        public double GAPRealVsAsignado { get; set; }

        public string Recurso { get; set; }
        public string CveRecurso { get; set; }

        public string Fase { get; set; }

        public string Sprint { get; set; }

        public string Proyecto { get; set; }
        public int TotalActividades { get; set; }

        public List<IndicadoresModel> LstIndicadorRecurso { get; set; }
        public List<IndicadoresModel> LstIndicadorFase { get; set; }
        public List<IndicadoresModel> LstIndicadorRequerimiento { get; set; }
        public List<IndicadoresModel> LstIndicadorSprint { get; set; }

        public long IdUsuario { get; set; }

        public string BR { get; set; }

        public decimal PorcentajeReportadas { get; set; }
        public decimal PorcentajeFinal { get; set; }

        public int Proyectos { get; set; }
        public int PATiempo { get;  set; }
        public int PAtrasados { get; internal set; }
        public int Milestones { get; internal set; }
        public int MAbiertos { get; internal set; }
        public int MCompletados { get; internal set; }
        public int MPendientes { get; internal set; }

        public int Sprints { get; set; }
        public int SAbiertos { get; set; }
        public int SProgreso { get; set; }
        public int STerminados { get; set; }

        public int Bugs { get; set; }
        public int BAbiertos { get; set; }
        public int BResueltos { get; set; }
        public int BRechazados { get; set; }
        public int Issues { get; internal set; }
        public int ICompletados { get; internal set; }
        public int IPendientes { get; internal set; }
        public List<ActividadesModel> LstMilestones { get; internal set; }
        public List<UsuarioModel> LstCargaT { get; internal set; }
        public decimal Calidad { get;  set; }
        public decimal OEE { get;  set; }
        public decimal OEEAnual { get; set; }
        public double ProductividadAnual { get;  set; }
        public decimal CalidadAnual { get;  set; }
        public decimal Densidad { get;  set; }
        public int BugsAnual { get;  set; }
        public decimal DensidadAnual { get;  set; }


        public double Carga { get; set; }
        public double CargaPorc { get; set; }
        public DateTime FechaActualizacion { get;  set; }
        public int Capturas { get;  set; }
        public double PorcCaptura { get;  set; }
        public double HorasDefectos { get;  set; }

        public List<ProyectosModel> LstProyectos = new List<ProyectosModel>();
    }
}
