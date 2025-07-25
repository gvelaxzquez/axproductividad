using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos.Models
{
    public class FiltrosModel
    {
        public FiltrosModel()
        {
            LstTipoActividad = new List<long>();
            LstClasificacion = new List<long>();
            LstAsignado = new List<long>();
            LstResponsable = new List<long>();
            LstProyecto = new List<long>();
            LstSprints = new List<long>();
            LstPrioridad = new List<long>();
            LstEstatusW = new List<long>();
            LstEstatus = new List<string>();
            LstAnios = new List<string>();
            LstMeses = new List<string>();
            LstRecursos = new List<string>();
            LstGraficas = new List<string>();
        }

        public DateTime? FechaIni { get; set; }
        public DateTime? FechaFinal { get; set; }
        public DateTime? FechaCreoIni { get; set; }
        public DateTime? FechaCreoFin { get; set; }
        public DateTime? FechaSolIni { get; set; }
        public DateTime? FechaSolFin { get; set; }
        public DateTime? FechaCierreIni { get; set; }
        public DateTime? FechaCierreFin { get; set; }
        public List<long> LstTipoActividad { get; set; }
        public string Contiene { get; set; }
        public List<long> LstTipo { get; set; }
        public string TipoActividad { get { return string.Join<string>(",", LstTipoActividad.ConvertAll(x => x.ToString())); } }
        public List<long> LstClasificacion { get; set; }
        public string Clasificacion { get { return string.Join<string>(",", LstClasificacion.ConvertAll(x => x.ToString())); } }
        public List<long> LstAsignado { get; set; }
        public string Asignado { get { return string.Join<string>(",", LstAsignado.ConvertAll(x => x.ToString())); } }
        public List<long> LstResponsable { get; set; }
        public string Responsable { get { return string.Join<string>(",", LstResponsable.ConvertAll(x => x.ToString())); } }
        public List<long> LstProyecto { get; set; }
        public string Proyecto { get { return string.Join<string>(",", LstProyecto.ConvertAll(x => x.ToString())); } }
        public List<long> LstSprints { get; set; }
        public string Sprints { get { return string.Join<string>(",", LstSprints.ConvertAll(x => x.ToString())); } }
        public List<long> LstPrioridad { get; set; }
        public string Prioridad { get { return string.Join<string>(",", LstPrioridad.ConvertAll(x => x.ToString())); } }
        public List<string> LstEstatus { get; set; }
        public string Estatus { get { return string.Join<string>(",", LstEstatus.ConvertAll(x => x.ToString())); } }

        public List<long> LstEstatusW { get; set; }
        public string EstatusW { get { return string.Join<string>(",", LstEstatusW.ConvertAll(x => x.ToString())); } }

        public string Actividades { get; set; }
        public long IdUsuario { get; set; }
        public List<string> LstAnios { get; set; }
        public List<string> LstMeses { get; set; }
        public List<string> LstRecursos { get; set; }
        public List<string> LstGraficas { get; set; }
        public int Mes { get; set; }
        public int Anio { get; set; }
        public int Dia { get; set; }
        public long IdUsuarioConsulta { get; set; }
        public long? IdUsuarioReporte { get; set; }
        public long? DepartamentoId { get; set; }
        public DateTime FechaCorte { get; set; }
        public bool Guardar { get; set; }
        public int TipoPeriodo { get; set; }
        public long IdProyecto { get; set; }

        public int Tipo { get; set; }
        public int IdIteracion { get;  set; }
        public int IdFase { get;  set; }
        public int IdIteracionB { get;  set; }

        public string PrioridadF { get; set; }
        public string  EstatusF { get; set; }
        public bool SinSprint { get;  set; }
        public long IdActividad { get;  set; }
        public long IdTipoUsuario { get;  set; }
        /// <summary>
        /// 1: Semanal, 2: Quincenal, 3: Mensual
        /// </summary>
        public byte Period { get; set; }


        public List<PeriodoRango> GetPeriodos()
        {
            var periodos = new List<PeriodoRango>();
            var diasEnMes = DateTime.DaysInMonth(Anio, Mes);
            var calendario = CultureInfo.CurrentCulture.Calendar;
            var reglaSemana = CalendarWeekRule.FirstDay;
            var diaInicioSemana = DayOfWeek.Monday;

            switch (Period)
            {
                case 1: // Semanal
                    var fechasPorSemana = new Dictionary<int, List<DateTime>>();

                    for (int dia = 1; dia <= diasEnMes; dia++)
                    {
                        var fecha = new DateTime(Anio, Mes, dia);
                        int semana = calendario.GetWeekOfYear(fecha, reglaSemana, diaInicioSemana);

                        if (!fechasPorSemana.ContainsKey(semana))
                            fechasPorSemana[semana] = new List<DateTime>();

                        fechasPorSemana[semana].Add(fecha);
                    }

                    foreach (var grupo in fechasPorSemana.OrderBy(k => k.Key))
                    {
                        var fechas = grupo.Value;
                        periodos.Add(new PeriodoRango(grupo.Key, fechas.First(), fechas.Last()));
                    }
                    break;

                case 2: // Quincenal
                    var inicioMes = new DateTime(Anio, Mes, 1);
                    var quincena1Fin = new DateTime(Anio, Mes, 15);
                    var quincena2Inicio = new DateTime(Anio, Mes, 16);
                    var finMes = new DateTime(Anio, Mes, diasEnMes);

                    int quincena1 = (Mes - 1) * 2 + 1;
                    int quincena2 = (Mes - 1) * 2 + 2;

                    periodos.Add(new PeriodoRango(quincena1, inicioMes, quincena1Fin));
                    periodos.Add(new PeriodoRango(quincena2, quincena2Inicio, finMes));
                    break;

                case 3: // Mensual
                    periodos.Add(new PeriodoRango(Mes, new DateTime(Anio, Mes, 1), new DateTime(Anio, Mes, diasEnMes)));
                    break;

                default:
                    throw new InvalidOperationException("Periodo inválido");
            }

            return periodos;
        }



    }
    public class PeriodoRango
    {
        public int Numero { get; set; } // Semana, Quincena o Mes
        public DateTime Inicio { get; set; }
        public DateTime Fin { get; set; }

        public PeriodoRango(int numero, DateTime inicio, DateTime fin)
        {
            Numero = numero;
            Inicio = inicio;
            Fin = fin;
        }
    }


}
