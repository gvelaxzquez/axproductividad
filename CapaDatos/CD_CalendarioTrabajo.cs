using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CapaDatos.DataBaseModel;
using CapaDatos.Models;

namespace CapaDatos
{
   public class CD_CalendarioTrabajo
    {

        public CalendarioTrabajoModel ObtieneCalendario( int Anio, int Mes,string Conexion) {
            try
            {


                CalendarioTrabajoModel calendario = new CalendarioTrabajoModel();

                using (var contexto = new BDProductividad_DEVEntities(Conexion)) {


                    var dl = contexto.CalendarioTrabajo.Where(i => i.IdAnio == Anio && i.IdMes == Mes ).FirstOrDefault();

                    if (dl != null) {
                        calendario.FechaInicio = dl.FechaInicio;
                        calendario.FechaFin = dl.FechaFin;
                        calendario.DiasLaborales = dl.DiasLaborales;
                        calendario.BaseCompensacionCump = dl.BaseCompensacionCump;
                        calendario.BaseCompensacionHoras = dl.BaseCompensacionHoras;
                    }

                }

                return calendario;

            }
            catch (Exception ex)
            {

                throw ex;
            }


        }
        public bool GuardaCalendario(CalendarioTrabajoModel calendario, string Conexion)
        {

            try
            {

                using (var contexto = new BDProductividad_DEVEntities(Conexion)) {


                    var dl = contexto.CalendarioTrabajo.Where(i => i.IdAnio == calendario.Anio && i.IdMes == calendario.Mes).FirstOrDefault();

                    if (dl != null)
                    {


                        dl.FechaInicio = calendario.FechaInicio;
                        dl.FechaFin = calendario.FechaFin;
                        dl.DiasLaborales = calendario.DiasLaborales;
                        dl.BaseCompensacionCump = calendario.BaseCompensacionCump;
                        dl.BaseCompensacionHoras = calendario.BaseCompensacionHoras;

                    }
                    else {
                        
                        CalendarioTrabajo dlnuevo = new CalendarioTrabajo();
                        dlnuevo.IdAnio = calendario.Anio;
                        dlnuevo.IdMes = calendario.Mes;
                        dlnuevo.DiasLaborales = calendario.DiasLaborales;
                        dlnuevo.FechaInicio = calendario.FechaInicio;
                        dlnuevo.FechaFin = calendario.FechaFin;
                        dlnuevo.BaseCompensacionCump = calendario.BaseCompensacionCump;
                        dlnuevo.BaseCompensacionHoras = calendario.BaseCompensacionHoras;

                        contexto.CalendarioTrabajo.Add(dlnuevo);


                    }

                    contexto.SaveChanges();

                }



                return true;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public List<DiasFestivosModel> ConsultarDiasFestivos(string Conexion) {
            try
            {
                List<DiasFestivosModel> LstDias = new List<DiasFestivosModel>();

                using (var contexto = new BDProductividad_DEVEntities(Conexion)) {

                    LstDias = contexto.DiasFestivos.Select(s => new DiasFestivosModel { IdDiaF = s.IdDiaF, Fecha = s.Fecha }).ToList();

                }

                return LstDias;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public int GuardarDiaFestivo(DateTime Fecha, string Conexion) {
            try
            {

                using (var contexto = new BDProductividad_DEVEntities(Conexion)) {

                    DiasFestivos d = new DiasFestivos();
                    d.Fecha = Fecha;

                    contexto.DiasFestivos.Add(d);

                    contexto.SaveChanges();

                }

                return 1;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public int EliminarDiaFestivo(long IdDiaF, string Conexion) {
            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    var d = contexto.DiasFestivos.Where(w => w.IdDiaF == IdDiaF).FirstOrDefault();

                    contexto.DiasFestivos.Remove(d);

                    contexto.SaveChanges();

                }

                return 1;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }
    }
}
