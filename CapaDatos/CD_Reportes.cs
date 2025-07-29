using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;
using CapaDatos.DataBaseModel;
using CapaDatos.Models;
using System.Data.Entity.Infrastructure;
using System.Data.Entity;
using DocumentFormat.OpenXml.Spreadsheet;
using System.Runtime.CompilerServices;
using System.Net.NetworkInformation;

namespace CapaDatos
{
    public class CD_Reportes
    {

        public void CalculoCompensaciones(FiltrosModel Filtros, ref List<CompensacionModel> LstEncabezado, ref List<ActividadesModel> LstDetalle, string Conexion)
        {
            try
            {
                //var con = new SqlConnection(Conexion);
                //con.Open();

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("CalculoCompensaciones_SP", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@Mes", Filtros.Mes);
                sqlcmd.Parameters.AddWithValue("@Anio", Filtros.Anio);
                sqlcmd.Parameters.AddWithValue("@FechaCorte", Filtros.FechaCorte);
                sqlcmd.Parameters.AddWithValue("@IdUsuarioGenero", Filtros.IdUsuario);
                sqlcmd.Parameters.AddWithValue("@Guardar", Filtros.Guardar);


                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();

                var Encabezado = ds.Tables[0];
                var Detalle = ds.Tables[1];

                LstEncabezado = (from row in Encabezado.AsEnumerable()
                                 select (new CompensacionModel
                                 {
                                     IdUsuario = long.Parse(row["IdUsuario"].ToString()),
                                     Clave = row["Clave"].ToString(),
                                     Recurso = row["Recurso"].ToString(),
                                     Lider = row["Lider"].ToString(),
                                     Nivel = row["Nivel"].ToString(),
                                     EstandarMes = row["EstandarMes"].ToString(),
                                     HorasSolicitadas = row["HorasSolicitadas"].ToString(),
                                     HorasLiberadas = row["HorasLiberadas"].ToString(),
                                     BonoCumplimiento = Math.Round(decimal.Parse(row["BonoCumplimiento"].ToString()), 2).ToString(),
                                     HorasAdicionales = row["HorasAdicionales"].ToString(),
                                     BonoHoras = Math.Round(decimal.Parse(row["BonoHoras"].ToString()), 2).ToString(),
                                     Productividad = Math.Round(decimal.Parse(row["Productividad"].ToString()), 2).ToString() + "%",
                                     Total = Math.Round(decimal.Parse(row["Total"].ToString()), 2).ToString(),

                                 })).ToList();

                LstDetalle = (from row in Detalle.AsEnumerable()
                              select (new ActividadesModel
                              {
                                  IdActividad = long.Parse(row["IdActividad"].ToString()),
                                  IdActividadStr = row["IdActividadStr"].ToString(),
                                  IdUsuarioAsignado = long.Parse(row["IdUsuarioAsignado"].ToString()),
                                  ProyectoStr = row["Proyecto"].ToString(),
                                  Descripcion = row["Descripcion"].ToString(),
                                  HorasAsignadas = decimal.Parse(row["HorasAsignadas"].ToString()),
                                  HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),
                                  FechaTermino = DateTime.Parse(row["FechaTermino"].ToString()),
                                  TipoActividadStr = row["Fase"].ToString(),
                                  ClasificacionStr = row["Clasificacion"].ToString()
                              })).ToList();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();




            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public void ConsultaCompensaciones(FiltrosModel Filtros, ref List<CompensacionModel> LstEncabezado, ref List<ActividadesModel> LstDetalle, ref List<CompensacionModel> LstEncabezadoLider, ref List<CompensacionModel> LstDetalleLider, string Conexion)
        {
            try
            {

                var responsable = string.Join<string>(",", Filtros.LstResponsable.ConvertAll(s => s.ToString()));



                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("ConsultaCompensaciones_sp", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@Mes", Filtros.Mes);
                sqlcmd.Parameters.AddWithValue("@Anio", Filtros.Anio);
                sqlcmd.Parameters.AddWithValue("@Usuario", responsable);
                sqlcmd.Parameters.AddWithValue("@UsuarioGen", Filtros.IdUsuario);



                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);


                da.Fill(ds);
                da.Dispose();

                var Encabezado = ds.Tables[0];
                var Detalle = ds.Tables[1];

                LstEncabezado = (from row in Encabezado.AsEnumerable()
                                 select (new CompensacionModel
                                 {
                                     IdUsuario = long.Parse(row["IdUsuario"].ToString()),
                                     Recurso = row["Recurso"].ToString(),
                                     Nivel = row["Nivel"].ToString(),
                                     EstandarMes = row["EstandarMes"].ToString(),
                                     HorasSolicitadas = row["HorasSolicitadas"].ToString(),
                                     HorasLiberadas = row["HorasLiberadas"].ToString(),
                                     BonoCumplimiento = Math.Round(decimal.Parse(row["BonoCumplimiento"].ToString()), 2).ToString(),
                                     HorasAdicionales = row["HorasAdicionales"].ToString(),
                                     BonoHoras = Math.Round(decimal.Parse(row["BonoHoras"].ToString()), 2).ToString(),
                                     Productividad = Math.Round(decimal.Parse(row["Productividad"].ToString()), 2).ToString() + "%",
                                     Total = Math.Round(decimal.Parse(row["Total"].ToString()), 2).ToString(),

                                 })).ToList();

                LstDetalle = (from row in Detalle.AsEnumerable()
                              select (new ActividadesModel
                              {
                                  IdActividad = long.Parse(row["IdActividad"].ToString()),
                                  IdUsuarioAsignado = long.Parse(row["IdUsuarioAsignado"].ToString()),
                                  ProyectoStr = row["Proyecto"].ToString(),
                                  Descripcion = row["Descripcion"].ToString(),
                                  HorasAsignadas = decimal.Parse(row["HorasAsignadas"].ToString()),
                                  HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),
                                  FechaTermino = DateTime.Parse(row["FechaTermino"].ToString()),
                                  TipoActividadStr = row["Fase"].ToString(),
                                  ClasificacionStr = row["Clasificacion"].ToString()
                              })).ToList();


                LstEncabezadoLider = (from row in ds.Tables[2].AsEnumerable()
                                      select (new CompensacionModel
                                      {
                                          IdUsuario = long.Parse(row["IdUsuario"].ToString()),
                                          Recurso = row["Colaborador"].ToString(),
                                          Proyectos = int.Parse(row["Proyectos"].ToString()),
                                          BonoPotencial = Math.Round(decimal.Parse(row["BonoPotencial"].ToString()), 2).ToString(),
                                          Total = Math.Round(decimal.Parse(row["TotalBono"].ToString()), 2).ToString(),

                                      })).ToList();

                LstDetalleLider = (from row in ds.Tables[3].AsEnumerable()
                                   select (new CompensacionModel
                                   {
                                       IdUsuario = long.Parse(row["IdUsuario"].ToString()),
                                       Proyecto = row["Clave"].ToString() + " - " + row["NombreProy"].ToString(),
                                       CumpleCriterioAvance = int.Parse(row["CumpleCriterioAvance"].ToString()),
                                       CumpleCriterioCosto = int.Parse(row["CumpleCriterioCosto"].ToString()),
                                       CumpleCriterioRentabilidad = int.Parse(row["CumpleCriterioRentabilidad"].ToString()),
                                       CumpleCriterioCaptura = int.Parse(row["CumpleCriterioCaptura"].ToString()),
                                       ProductividadMes = Math.Round(decimal.Parse(row["PorcBono"].ToString()) * 100, 2).ToString(),
                                       Facturado = Math.Round(decimal.Parse(row["Facturado"].ToString()), 2).ToString(),
                                       BonoPotencial = Math.Round(decimal.Parse(row["BonoCompleto"].ToString()), 2).ToString(),
                                       Total = Math.Round(decimal.Parse(row["BonoAPagar"].ToString()), 2).ToString(),

                                   })).ToList();




                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public List<ProyectosModel> ConsultaReporteHoras(FiltrosModel Filtros, string Conexion)
        {

            try
            {

                DataSet ds = new DataSet();
                List<ProyectosModel> LstProyectos = new List<ProyectosModel>();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("ResumenProyectosLider", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@FechaInicio", Filtros.FechaIni);
                sqlcmd.Parameters.AddWithValue("@FechaFin", Filtros.FechaFinal);
                sqlcmd.Parameters.AddWithValue("@IdUsuario", Filtros.IdUsuario);


                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);


                da.Fill(ds);
                da.Dispose();

                var Encabezado = ds.Tables[0];

                LstProyectos = (from row in Encabezado.AsEnumerable()
                                select (new ProyectosModel
                                {
                                    Nombre = row["Nombre"].ToString(),
                                    Lider = row["Lider"].ToString(),
                                    HorasPlan = Math.Round(decimal.Parse(row["PlanFacturables"].ToString()), 2),
                                    HorasProgreso = Math.Round(decimal.Parse(row["ProgresoFacturables"].ToString()), 2),
                                    HorasTerminadas = Math.Round(decimal.Parse(row["TerminadoFacturables"].ToString()), 2),

                                })).ToList();


                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();

                return LstProyectos;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }


        public List<UsuarioModel> ObtieneCumplimientoCapturaLider(string Conexion, UsuarioModel usuario)
        {
            try
            {


                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spObtieneCumplimientoCapturaLider", sqlcon);
                sqlcmd.Parameters.AddWithValue("@IdULider", usuario.IdUsuario);
                sqlcmd.Parameters.AddWithValue("@DepartamentoId", usuario.DepartamentoId);
                sqlcmd.CommandType = CommandType.StoredProcedure;


                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();

                List<UsuarioModel> LstCumplimiento = new List<UsuarioModel>();


                var dt = new DataTable();
                dt = ds.Tables[0];

                LstCumplimiento = (from row in dt.AsEnumerable()
                                   select (new UsuarioModel
                                   {
                                       IdUsuario = long.Parse(row["IdUsuario"].ToString()),
                                       NumEmpleado = row["NumEmpleado"].ToString(),
                                       NombreCompleto = row["Nombre"].ToString(),
                                       FechaUltCapturaStr = DateTime.Parse(row["FechaUltCaptura"].ToString()).ToShortDateString(),
                                       Cumplimiento = int.Parse(row["Cumplimiento"].ToString())
                                   })).ToList();



                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();
                sqlcon.Close();


                return LstCumplimiento;

            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        public List<ProyectosModel> ReporteGeneralProyectos(DateTime FechaCorte, UsuarioModel user, string Conexion)
        {
            try
            {

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spResumenProyecto", sqlcon);
                sqlcmd.Parameters.AddWithValue("@FechaCorte", FechaCorte);
                sqlcmd.Parameters.AddWithValue("@IdUlider", user.IdTipoUsuario == 15 ? user.IdUsuario : (long?)null);
                sqlcmd.Parameters.AddWithValue("@DepartamentoId", user.DepartamentoId);
                sqlcmd.CommandType = CommandType.StoredProcedure;


                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();

                List<ProyectosModel> LstProyectos = new List<ProyectosModel>();


                var dt = new DataTable();
                dt = ds.Tables[0];

                LstProyectos = (from row in dt.AsEnumerable()
                                select (new ProyectosModel
                                {
                                    IdProyecto = long.Parse(row["IdProyecto"].ToString()),
                                    Clave = row["Clave"].ToString(),
                                    Nombre = row["Nombre"].ToString(),
                                    Lider = row["Lider"].ToString(),
                                    HorasAsignadas = decimal.Parse(row["HorasProyectadas"].ToString()),
                                    HorasCompromiso = decimal.Parse(row["Comprometido"].ToString()),
                                    AvanceReal = decimal.Parse(row["AvanceReal"].ToString()),
                                    Desfase = decimal.Parse(row["Desfase"].ToString()),
                                    AvanceCompPorc = decimal.Parse(row["AvanceComprometido"].ToString()),
                                    AvanceRealPorc = decimal.Parse(row["AvanceRealPorc"].ToString()),
                                    DesfaseProc = (decimal.Parse(row["AvanceComprometido"].ToString()) - decimal.Parse(row["AvanceRealPorc"].ToString())) < 0 ? 0 : decimal.Parse(row["AvanceComprometido"].ToString()) - decimal.Parse(row["AvanceRealporc"].ToString())
                                })).ToList();



                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();
                sqlcon.Close();


                return LstProyectos;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public List<ActividadTrackingModel> ReporteTracking(long IdProyecto, long TipoActividadId, string Conexion)
        {
            try
            {

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spObtieneAnalisisTracking", sqlcon);
                sqlcmd.Parameters.AddWithValue("@IdProyecto", IdProyecto);
                sqlcmd.Parameters.AddWithValue("@TipoActividadId", TipoActividadId);

                sqlcmd.CommandType = CommandType.StoredProcedure;


                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();

                List<ActividadTrackingModel> LstActividadT = new List<ActividadTrackingModel>();


                var dt = new DataTable();
                dt = ds.Tables[0];

                LstActividadT = (from row in dt.AsEnumerable()
                                 select (new ActividadTrackingModel
                                 {
                                     IdActividad = long.Parse(row["IdActividad"].ToString()),
                                     IdActividadStr = row["IdActividadStr"].ToString(),
                                     Recurso = row["Recurso"].ToString(),
                                     Nivel = row["Nivel"].ToString(),
                                     Descripcion = row["Descripcion"].ToString(),
                                     Nombre = row["Nombre"].ToString(),
                                     Trabajado = TimeSpan.Parse(row["Trabajado"].ToString()),
                                     TrabajadoHrs = decimal.Parse(row["TrabajadoHrs"].ToString()),
                                     DefectosInyectados = int.Parse(row["DefectosInyectados"].ToString()),
                                     DefectosRemovidos = int.Parse(row["DefectosRemovidos"].ToString()),
                                     TiempoDefectosInyectados = decimal.Parse(row["TiempoDefectosInyectados"].ToString()),
                                     TiempoDefectosRemovidos = decimal.Parse(row["TiempoDefectosRemovidos"].ToString())

                                     //IdProyecto = long.Parse(row["IdProyecto"].ToString()),
                                     //Clave = row["Clave"].ToString(),
                                     //Nombre = row["Nombre"].ToString(),
                                     //Lider = row["Lider"].ToString(),
                                     //HorasAsignadas = decimal.Parse(row["HorasProyectadas"].ToString()),
                                     //HorasCompromiso = decimal.Parse(row["Comprometido"].ToString()),
                                     //AvanceReal = decimal.Parse(row["AvanceReal"].ToString()),
                                     //Desfase = decimal.Parse(row["Desfase"].ToString()),
                                     //AvanceCompPorc = decimal.Parse(row["AvanceComprometido"].ToString()),
                                     //AvanceRealPorc = decimal.Parse(row["AvanceRealPorc"].ToString()),
                                     //DesfaseProc = (decimal.Parse(row["AvanceComprometido"].ToString()) - decimal.Parse(row["AvanceRealPorc"].ToString())) < 0 ? 0 : decimal.Parse(row["AvanceComprometido"].ToString()) - decimal.Parse(row["AvanceRealporc"].ToString())
                                 })).ToList();



                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();
                sqlcon.Close();


                return LstActividadT;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public List<ActividadTamanoModel> ReporteTamanoActividad(long IdProyecto, string Conexion)
        {
            try
            {

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spObtieneTamanosActividad", sqlcon);
                sqlcmd.Parameters.AddWithValue("@IdProyecto", IdProyecto);
                sqlcmd.CommandType = CommandType.StoredProcedure;


                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();

                List<ActividadTamanoModel> LstActividadTamano = new List<ActividadTamanoModel>();


                var dt = new DataTable();
                dt = ds.Tables[0];

                LstActividadTamano = (from row in dt.AsEnumerable()
                                      select (new ActividadTamanoModel
                                      {
                                          IdActividad = long.Parse(row["IdActividad"].ToString()),
                                          IdActividadStr = row["IdActividadStr"].ToString(),
                                          DescripcionActividad = row["Descripcion"].ToString(),
                                          Descripcion = row["Parte"].ToString(),
                                          TipoParteIdStr = row["TipoParteIdStr"].ToString(),
                                          EBase = int.Parse(row["EBase"].ToString()),
                                          EModificadas = int.Parse(row["EModificadas"].ToString()),
                                          EAgregadas = int.Parse(row["EAgregadas"].ToString()),
                                          EEliminadas = int.Parse(row["EEliminadas"].ToString()),
                                          ABase = int.Parse(row["ABase"].ToString()),
                                          AModificadas = int.Parse(row["AModificadas"].ToString()),
                                          AAgregadas = int.Parse(row["AAgregadas"].ToString()),
                                          AEliminadas = int.Parse(row["AEliminadas"].ToString())

                                      })).ToList();



                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();
                sqlcon.Close();


                return LstActividadTamano;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }


        public IndicadoresModel ConsultaInformeHoras(FiltrosModel Filtros, string Conexion)
        {
            try
            {


                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spAnalisisHoras", sqlcon);
                sqlcmd.Parameters.AddWithValue("@IdProyecto", Filtros.IdProyecto);
                sqlcmd.Parameters.AddWithValue("@FechaInicio", Filtros.FechaIni);
                sqlcmd.Parameters.AddWithValue("@FechaFin", Filtros.FechaFinal);
                sqlcmd.CommandType = CommandType.StoredProcedure;


                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();

                IndicadoresModel ind = new IndicadoresModel();


                var dt = new DataTable();
                var dt1 = new DataTable();
                var dt2 = new DataTable();
                var dt3 = new DataTable();
                //var dt4 = new DataTable();
                dt = ds.Tables[0];
                dt1 = ds.Tables[1];
                dt2 = ds.Tables[2];
                dt3 = ds.Tables[3];
                //dt4 = ds.Tables[4];

                ind.Estimadas = double.Parse(dt.Rows[0]["Estimadas"].ToString());
                ind.Asignadas = double.Parse(dt.Rows[0]["Asignadas"].ToString());
                ind.Real = double.Parse(dt.Rows[0]["Reales"].ToString());
                ind.GAPAsignadoVsEstimado = double.Parse(dt.Rows[0]["GAPEstimadovsAsignado"].ToString());
                ind.GAPRealVsEstimado = double.Parse(dt.Rows[0]["GAPREALVSEstimado"].ToString());
                ind.GAPRealVsAsignado = double.Parse(dt.Rows[0]["GAPREALVSAsignado"].ToString());


                ind.LstIndicadorFase = (from row in dt1.AsEnumerable()
                                        select (new IndicadoresModel
                                        {
                                            Fase = row["Fase"].ToString(),
                                            Estimadas = double.Parse(row["Estimadas"].ToString()),
                                            Asignadas = double.Parse(row["Asignadas"].ToString()),
                                            Real = double.Parse(row["Reales"].ToString()),
                                            GAPAsignadoVsEstimado = double.Parse(row["GAPEstimadovsAsignado"].ToString()),
                                            GAPRealVsEstimado = double.Parse(row["GAPREALVSEstimado"].ToString()),
                                            GAPRealVsAsignado = double.Parse(row["GAPREALVSAsignado"].ToString())

                                        })).ToList();

                ind.LstIndicadorRequerimiento = (from row in dt3.AsEnumerable()
                                                 select (new IndicadoresModel
                                                 {
                                                     BR = row["BR"].ToString(),
                                                     Estimadas = double.Parse(row["Estimadas"].ToString()),
                                                     Asignadas = double.Parse(row["Asignadas"].ToString()),
                                                     Real = double.Parse(row["Reales"].ToString()),
                                                     GAPAsignadoVsEstimado = double.Parse(row["GAPEstimadovsAsignado"].ToString()),
                                                     GAPRealVsEstimado = double.Parse(row["GAPREALVSEstimado"].ToString()),
                                                     GAPRealVsAsignado = double.Parse(row["GAPREALVSAsignado"].ToString())

                                                 })).ToList();

                ind.LstIndicadorRecurso = (from row in dt2.AsEnumerable()
                                           select (new IndicadoresModel
                                           {
                                               IdUsuario = long.Parse(row["IdUsuario"].ToString()),
                                               CveRecurso = row["NumEmpleado"].ToString(),
                                               Recurso = row["Recurso"].ToString(),
                                               Estimadas = double.Parse(row["Estimadas"].ToString()),
                                               Asignadas = double.Parse(row["Asignadas"].ToString()),
                                               Real = double.Parse(row["Reales"].ToString()),
                                               GAPAsignadoVsEstimado = double.Parse(row["GAPEstimadovsAsignado"].ToString()),
                                               GAPRealVsEstimado = double.Parse(row["GAPREALVSEstimado"].ToString()),
                                               GAPRealVsAsignado = double.Parse(row["GAPREALVSAsignado"].ToString())

                                           })).ToList();

                //ind.LstIndicadorSprint = (from row in dt3.AsEnumerable()
                //                          select (new IndicadoresModel
                //                          {
                //                              Sprint = row["Sprint"].ToString(),
                //                              Estimadas = double.Parse(row["Estimadas"].ToString()),
                //                              Asignadas = double.Parse(row["Asignadas"].ToString()),
                //                              Real = double.Parse(row["Reales"].ToString()),
                //                              GAPAsignadoVsEstimado = double.Parse(row["GAPEstimadovsAsignado"].ToString()),
                //                              GAPRealVsEstimado = double.Parse(row["GAPREALVSEstimado"].ToString()),
                //                              GAPRealVsAsignado = double.Parse(row["GAPREALVSAsignado"].ToString())

                //                          })).ToList();


                return ind;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public List<UsuarioModel> ConsultaCargaTrabajo(FiltrosModel Filtros, string Conexion)
        {
            try
            {


                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spCargaTrabajo", sqlcon);
                sqlcmd.Parameters.AddWithValue("@FechaInicio", Filtros.FechaIni);
                sqlcmd.Parameters.AddWithValue("@FechaFin", Filtros.FechaFinal);
                sqlcmd.Parameters.AddWithValue("@IdULider", Filtros.IdUsuarioConsulta);
                sqlcmd.Parameters.AddWithValue("@IdProyecto", null);
                sqlcmd.CommandType = CommandType.StoredProcedure;


                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();



                var dt = new DataTable();

                dt = ds.Tables[0];


                List<UsuarioModel> LstCargaT = new List<UsuarioModel>();
                LstCargaT = (from row in dt.AsEnumerable()
                             select (new UsuarioModel
                             {
                                 IdUsuario = long.Parse(row["IdUsuario"].ToString()),
                                 NumEmpleado = row["NumEmpleado"].ToString(),
                                 NombreCompleto = row["Nombre"].ToString(),
                                 Nivel = row["Nivel"].ToString(),
                                 EstandarDiario = decimal.Parse(row["EstandarDiario"].ToString()),
                                 HorasDisponibles = decimal.Parse(row["HorasDisponibles"].ToString()),
                                 HorasAsignadas = decimal.Parse(row["HorasAsignadas"].ToString()),
                                 CantActividades = int.Parse(row["CantActividades"].ToString()),
                                 PorcOcupacion = decimal.Parse(row["PorcOcupacion"].ToString())
                             })).ToList();



                return LstCargaT;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }


        public List<UsuarioModel> ConsultaProuctividadEqupo(long IdUsuario, long IdTipoUsuario, long? IdUsuarioReporte, string Conexion)
        {
            try
            {


                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("ObtieneProductividadEquipo", sqlcon);
                sqlcmd.Parameters.AddWithValue("@IdUsuarioConsulta", IdUsuario);
                sqlcmd.Parameters.AddWithValue("@IdTIpoUsuario", IdTipoUsuario);
                sqlcmd.Parameters.AddWithValue("@IdUsuarioReporte", IdUsuarioReporte == 0 ? (long?)null : IdUsuarioReporte);
                sqlcmd.CommandType = CommandType.StoredProcedure;


                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();



                var dt = new DataTable();

                dt = ds.Tables[0];


                List<UsuarioModel> LstProductividad = new List<UsuarioModel>();
                LstProductividad = (from row in dt.AsEnumerable()
                                    select (new UsuarioModel
                                    {
                                        IdUsuario = long.Parse(row["IdUsuario"].ToString()),
                                        NumEmpleado = row["NumEmpleado"].ToString(),
                                        NombreCompleto = row["Nombre"].ToString(),
                                        Lider = row["Lider"].ToString(),
                                        EstandarMes = decimal.Parse(row["EstandarMes"].ToString()),
                                        EstandarDiario = decimal.Parse(row["EstandarAlDia"].ToString()),
                                        ProductivdadAnterior = decimal.Parse(row["ProductividadMesAnterior"].ToString()),
                                        ProductividadActual = decimal.Parse(row["ProductividadActual"].ToString()),
                                        ProductividadMes = decimal.Parse(row["ProductividadMes"].ToString()),
                                        PorcOcupacion = decimal.Parse(row["PorcOcupacion"].ToString()),
                                        FechaUltCaptura = DateTime.Parse(row["UltimaActualizacion"].ToString()),
                                        Dias = int.Parse(row["Dias"].ToString()),
                                        RespuestaF = row["RespuestaF"].ToString(),
                                        RespuestaF2 = row["RespuestaF2"].ToString()

                                    })).ToList();



                return LstProductividad;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }



        #region Reporte Tamaño
        public List<ActividadTrabajoModel> LeerReporteTrabajoTiempo(ReporteFiltroModel filtros, List<long> actividades, List<long> proyectos, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var trabajo =
                    (from AT in contexto.ActividadTrabajo
                     join A in contexto.Actividad on AT.IdActividad equals A.IdActividad
                     join P in contexto.Proyecto on A.IdProyecto equals P.IdProyecto
                     join U in contexto.Usuario on A.IdUsuarioAsignado ?? 0 equals U.IdUsuario
                     join TA in contexto.CatalogoGeneral on A.TipoActividadId equals TA.IdCatalogo
                     join C in contexto.CatalogoGeneral on A.ClasificacionId equals C.IdCatalogo
                     where (filtros.Proyectos.Contains(P.IdProyecto) || filtros.Proyectos.Count == 0) &&
                     ((AT.Fecha >= filtros.FechaInicio && AT.Fecha <= filtros.FechaFin) || (filtros.FechaInicio == null && filtros.FechaFin == null)) &&
                      proyectos.Contains(P.IdProyecto)
                     select new ActividadTrabajoModel
                     {
                         IdActividadTrabajo = AT.IdActividadTrabajo,
                         Fecha = AT.Fecha,
                         Tiempo = AT.Tiempo,
                         Comentario = AT.Comentario,
                         Usuario = new UsuarioModel
                         {
                             NumEmpleado = U.NumEmpleado,
                             NombreCompleto = U.Nombre + " " + U.ApPaterno + " " + U.ApMaterno,
                         },
                         Proyecto = new ProyectosModel
                         {
                             IdProyecto = P.IdProyecto,
                             Nombre = P.Nombre,
                             Clave = P.Clave
                         },
                         Actividad = new ActividadesModel
                         {
                             IdActividad = A.IdActividad,
                             BR = A.BR,
                             Descripcion = A.Descripcion
                         },
                         Fase = new CatalogoGeneralModel
                         {
                             DescLarga = TA.DescLarga
                         },
                         Clasificacion = new CatalogoGeneralModel
                         {
                             DescLarga = C.DescLarga
                         }
                     }).ToList();

                return trabajo;
            }
        }
        #endregion

        public List<IndicadoresModel> LeerReporteHoras(ReporteFiltroModel filtros, List<long> listaUsuarios, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var horas =
                    (from A in contexto.Actividad
                     join U in contexto.Usuario on A.IdUsuarioAsignado equals U.IdUsuario
                     join AT in contexto.ActividadTrabajo on A.IdActividad equals AT.IdActividad
                     join P in contexto.Proyecto on A.IdProyecto equals P.IdProyecto
                     where A.IdProyecto == filtros.Proyecto
                     && A.FechaSolicitado >= filtros.FechaInicio
                     && A.FechaSolicitado <= filtros.FechaFin
                     && new[] { "P", "R", "V", "L" }.Contains(A.Estatus)
                     && (listaUsuarios.Contains(U.IdUsuario) || listaUsuarios.Count == 0)
                     group new { U, A, AT, P } by new { P.Clave, U.IdUsuario, U.NumEmpleado, NombreCompleto = U.Nombre + " " + U.ApPaterno } into G
                     select new IndicadoresModel
                     {
                         Proyecto = G.Key.Clave,
                         IdUsuario = G.Key.IdUsuario,
                         CveRecurso = G.Key.NumEmpleado,
                         Recurso = G.Key.NombreCompleto,
                         Asignadas = Convert.ToDouble(G.Sum(x => x.A.HorasAsignadas)),
                         HorasReportadas = Convert.ToDouble(G.Sum(x => x.AT.Tiempo)),
                         Real = Convert.ToDouble(G.Sum(x => x.A.HorasFinales)),
                         PorcentajeReportadas = G.Sum(x => x.AT.Tiempo) * 100 / G.Sum(x => x.A.HorasAsignadas ?? (decimal)0.1),
                         PorcentajeFinal = G.Sum(x => x.A.HorasFinales) * 100 / G.Sum(x => x.A.HorasAsignadas ?? (decimal)0.1)
                     }).ToList();

                return horas;
            }
        }


        public List<ProyectoInformeCostoModel> ObtenerReporteCostos(List<long> _proyectos, DateTime fechaInicio, DateTime fechaFin, string conexion)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexion))
            {
                var informe =
                    contexto.Proyecto
                    .Where(x => _proyectos.Contains(x.IdProyecto))
                    .AsEnumerable()
                    .Select(x =>
                    {
                        var usuario = contexto.Usuario.FirstOrDefault(y => y.IdUsuario == x.IdULider);
                        return new ProyectoInformeCostoModel
                        {
                            Proyecto = x.Clave,
                            Lider = usuario.Nombre + " " + usuario.ApPaterno + " " + usuario.ApMaterno,
                            Presupuesto = x.CostoPlan ?? 0,
                            Directo = contexto.ProyectoCD.Where(y => y.IdProyecto == x.IdProyecto && y.Aplicado).ToList().Sum(y => y.CostoPeriodo),
                            Indirecto = contexto.ProyectoCI.Where(y => y.IdProyecto == x.IdProyecto).ToList().Sum(y => y.Monto),
                        };
                    }).ToList();

                return informe;
            }
        }

        #region ReporteAsistencia

        public ControlAsistenciaModel ObtenerReporteAsistenciaDiario(ControlAsistenciaModel Filtros, String Conexion)
        {
            try
            {

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spControlAsistenciaRango", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@FechaInicio", Filtros.FechaInicio);
                sqlcmd.Parameters.AddWithValue("@FechaFin", Filtros.FechaFin);
                sqlcmd.Parameters.AddWithValue("@IdUsuario", Filtros.IdUsuario);


                sqlcmd.CommandType = CommandType.StoredProcedure;

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();

                ControlAsistenciaModel indicadores = new ControlAsistenciaModel();



                var dt = new DataTable();
                var dt2 = new DataTable();
                dt = ds.Tables[0];
                dt2 = ds.Tables[1];


                indicadores.Retrasos = int.Parse(dt.Rows[0]["Retrasos"].ToString());
                indicadores.Incidencias = int.Parse(dt.Rows[0]["Incidencias"].ToString());

                indicadores.LstAsistencia = (from row in dt2.AsEnumerable()
                                             select (new UsuarioAsistenciaModel
                                             {

                                                 Clave = row["NumEmpleado"].ToString(),
                                                 Recurso = row["Recurso"].ToString(),
                                                 Estatus = row["Estatus"].ToString(),
                                                 Retraso = int.Parse(row["Retraso"].ToString()),
                                                 Incidencias = int.Parse(row["Incidencias"].ToString()),
                                                 IncidenciasStr = row["IncidenciasStr"].ToString(),
                                                 TiempoTrabajo = decimal.Parse(row["TiempoTrabajo"].ToString()),
                                                 TiempoComida = decimal.Parse(row["TiempoComida"].ToString()),
                                                 Jornada = decimal.Parse(row["Jornada"].ToString()),
                                                 ToleranciaComida = decimal.Parse(row["ToleranciaComida"].ToString()),
                                                 TiempoRetraso = int.Parse(row["TiempoRetraso"].ToString()),
                                                 Fecha = DateTime.Parse(row["Fecha"].ToString()),
                                                 HoraEntrada = row["HoraEntrada"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["HoraEntrada"].ToString()),
                                                 HoraSalidaComer = row["HoraSalidaComer"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["HoraSalidaComer"].ToString()),
                                                 HoraEntradaComer = row["HoraEntradaComer"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["HoraEntradaComer"].ToString()),
                                                 HoraSalida = row["HoraSalida"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["HoraSalida"].ToString())


                                             })).ToList();



                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();
                sqlcon.Close();


                return indicadores;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public ControlAsistenciaModel ObtenerReporteAsistenciaMensual(ControlAsistenciaModel Filtros, String Conexion)
        {
            try
            {

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spControlAsistenciaMensual", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdMes", Filtros.IdMes);
                sqlcmd.Parameters.AddWithValue("@IdAnio", Filtros.IdAnio);
                sqlcmd.Parameters.AddWithValue("@IdUsuario", Filtros.IdUsuario == -1 ? null : Filtros.IdUsuario);


                sqlcmd.CommandType = CommandType.StoredProcedure;

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();

                ControlAsistenciaModel indicadores = new ControlAsistenciaModel();



                var dt = new DataTable();
                var dt2 = new DataTable();
                var dt3 = new DataTable();
                dt = ds.Tables[0];
                dt2 = ds.Tables[1];
                dt3 = ds.Tables[4];

                indicadores.Retrasos = int.Parse(dt.Rows[0]["Retrasos"].ToString());
                indicadores.Incidencias = int.Parse(dt.Rows[0]["Incidencias"].ToString());

                indicadores.LstAsistencia = (from row in dt2.AsEnumerable()
                                             select (new UsuarioAsistenciaModel
                                             {
                                                 IdUsuario = int.Parse(row["IdUsuario"].ToString()),

                                                 Clave = row["NumEmpleado"].ToString(),
                                                 Recurso = row["Recurso"].ToString(),
                                                 TiempoTrabajo = decimal.Parse(row["HorasTrabajadas"].ToString()),
                                                 Retraso = int.Parse(row["CantRetrasos"].ToString()),
                                                 HorasRetraso = decimal.Parse(row["HorasRetraso"].ToString()),
                                                 //Responsable = row["Responsable"].ToString()
                                             })).ToList();


                indicadores.LstAsistenciaDetalle = (from row in dt3.AsEnumerable()
                                                    select (new UsuarioAsistenciaModel
                                                    {
                                                        IdUsuario = int.Parse(row["IdUsuario"].ToString()),
                                                        Clave = row["NumEmpleado"].ToString(),
                                                        Recurso = row["Recurso"].ToString(),
                                                        Fecha = DateTime.Parse(row["Fecha"].ToString()),
                                                        HoraEntrada = row["HoraEntrada"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["HoraEntrada"].ToString()),
                                                        HoraSalidaComer = row["HoraSalidaComer"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["HoraSalidaComer"].ToString()),
                                                        HoraEntradaComer = row["HoraEntradaComer"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["HoraEntradaComer"].ToString()),
                                                        HoraSalida = row["HoraSalida"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["HoraSalida"].ToString()),
                                                        Dia = row["Dia"].ToString(),
                                                        TiempoComidaStr = row["TiempoComida"].ToString(),
                                                        TiempoTrabajoStr = row["TiempoTrabajo"].ToString()
                                                    })).ToList();




                indicadores.dtAsistenciaMesHoras = ds.Tables[2];

                indicadores.dtAsistenciaMes = ds.Tables[3];

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();
                sqlcon.Close();


                return indicadores;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        #endregion


        #region ReporteActividadesIFT


        public ReporteIFTModel ObtenerInformeActividades(ReporteFiltroModel Filtros, string Conexion)
        {
            try
            {

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spInformeActividades_IFT", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdMes", Filtros.IdMes);
                sqlcmd.Parameters.AddWithValue("@IdAnio", Filtros.IdAnio);
                sqlcmd.Parameters.AddWithValue("@IdUsuario", Filtros.IdUsuario);

                sqlcmd.CommandType = CommandType.StoredProcedure;

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();

                ReporteIFTModel Reporte = new ReporteIFTModel();

                var dt = new DataTable();
                var dt2 = new DataTable();

                dt = ds.Tables[0];
                dt2 = ds.Tables[1];



                Reporte.LstActividades = (from row in dt.AsEnumerable()
                                          select (new ActividadesModel
                                          {
                                              IdActividad = long.Parse(row["IdActividad"].ToString()),
                                              IdActividadStr = row["IdActividadStr"].ToString(),
                                              ResponsableStr = row["Responsable"].ToString(),
                                              ClaveUsuario = row["Clave"].ToString(),
                                              ProyectoStr = row["Proyecto"].ToString(),
                                              TipoActividadStr = row["Fase"].ToString(),
                                              ClasificacionStr = row["Actividad"].ToString(),
                                              BR = row["BR"].ToString(),
                                              Descripcion = row["Descripcion"].ToString(),
                                              FechaInicio = DateTime.Parse(row["Inicio"].ToString()),
                                              FechaTermino = DateTime.Parse(row["Fin"].ToString()),
                                              FInicio = DateTime.Parse(row["Inicio"].ToString()),
                                              FFin = DateTime.Parse(row["Fin"].ToString()),
                                              HorasAsignadas = decimal.Parse(row["HorasAsignadas"].ToString())
                                          })).ToList();


                Reporte.LstUsuarios = (from row in dt2.AsEnumerable()
                                       select (new UsuarioModel
                                       {

                                           Nombre = row["Firma"].ToString(),
                                           NumEmpleado = row["Clave"].ToString(),
                                           IdTipoUsuario = int.Parse(row["Tipo"].ToString())

                                       })).ToList();






                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();
                sqlcon.Close();


                return Reporte;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }


        #endregion


        #region InformeProyectos


        public List<ProyectosModel> ObtenerInformeProyectos(ReporteFiltroModel Filtros, string Conexion)
        {
            try
            {

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spResumenGeneralProyectos", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@FechaCorte", Filtros.FechaCorte);
                sqlcmd.Parameters.AddWithValue("@Abiertos", Filtros.Abiertos);
                sqlcmd.Parameters.AddWithValue("@IdUsuario", Filtros.IdUsuario);
                sqlcmd.Parameters.AddWithValue("@IdTipoUsuario", Filtros.IdTipoUsuario);
                sqlcmd.Parameters.AddWithValue("@IdProyecto", Filtros.IdProyecto);


                sqlcmd.CommandType = CommandType.StoredProcedure;
                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();

                List<ProyectosModel> LstProyectos = new List<ProyectosModel>();

                var dt = new DataTable();
                dt = ds.Tables[0];

                LstProyectos = (from row in dt.AsEnumerable()
                                select (new ProyectosModel
                                {
                                    IdProyecto = long.Parse(row["IdProyecto"].ToString()),
                                    Clave = row["Clave"].ToString(),
                                    Nombre = row["Clave"].ToString() + " - " + row["Nombre"].ToString(),
                                    Lider = row["Lider"].ToString(),


                                    FechaInicioPlan = row["FechaInicio"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaInicio"].ToString()),
                                    FechaFinPlan = row["FechaFin"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaFin"].ToString()),
                                    FechaFinComprometida = row["FechaFinComprometida"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaFinComprometida"].ToString()),
                                    FechaProyectada = row["FechaProyectada"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaProyectada"].ToString()),

                                    HorasAsignadas = decimal.Parse(row["HorasFacturablesProy"].ToString()),
                                    HorasCompromiso = decimal.Parse(row["Comprometido"].ToString()),
                                    AvanceReal = decimal.Parse(row["AvanceReal"].ToString()),
                                    Desfase = decimal.Parse(row["Desfase"].ToString()),
                                    AvanceCompPorc = decimal.Parse(row["AvanceComprometido"].ToString()),
                                    AvanceRealPorc = decimal.Parse(row["AvanceRealPorc"].ToString()),
                                    DesfaseProc = (decimal.Parse(row["AvanceComprometido"].ToString()) - decimal.Parse(row["AvanceRealPorc"].ToString())) < 0 ? 0 : decimal.Parse(row["AvanceComprometido"].ToString()) - decimal.Parse(row["AvanceRealporc"].ToString()),

                                    CostoPlaneado = decimal.Parse(row["CostoPlaneado"].ToString()),
                                    CostoProyectado = decimal.Parse(row["CostoProyectado"].ToString()),
                                    CostoActual = decimal.Parse(row["CostoActual"].ToString()),
                                    CostoHora = decimal.Parse(row["CostoHora"].ToString()),
                                    CostoDisponible = decimal.Parse(row["CostoDisponible"].ToString()),
                                    CostoActualPorc = decimal.Parse(row["CostoUtilizado"].ToString()),

                                    TotalIngreso = decimal.Parse(row["TotalIngreso"].ToString()),
                                    Facturado = decimal.Parse(row["Facturado"].ToString()),
                                    Cobrado = decimal.Parse(row["Cobrado"].ToString()),
                                    Atrasado = decimal.Parse(row["Atrasado"].ToString()),
                                    Saldo = decimal.Parse(row["Saldo"].ToString()),
                                    IdFlujoPagos = long.Parse(row["IdFlujoPago"].ToString()),
                                    PrecioHora = decimal.Parse(row["PrecioHora"].ToString()),

                                    RentabilidadPlan = decimal.Parse(row["RentabilidadPlan"].ToString()),
                                    RentabilidadPlanImporte = decimal.Parse(row["RentabilidadPlanImporte"].ToString()),
                                    RentabilidadActual = decimal.Parse(row["RentabilidadActual"].ToString()),
                                    RentabilidadActualImporte = decimal.Parse(row["RentabilidadImporte"].ToString()),

                                    RentabilidadFacturado = decimal.Parse(row["RentabilidadFacturado"].ToString()),
                                    RentabilidadProyectada = decimal.Parse(row["RentabilidadProyectada"].ToString()),
                                    RentabilidadProyectadaImporte = decimal.Parse(row["RentabilidadProyectadaImporte"].ToString()),

                                    PuntosH = int.Parse(row["PuntosH"].ToString()),
                                    PTerminado = int.Parse(row["PTerminado"].ToString()),
                                    PPendiente = int.Parse(row["PuntosH"].ToString()) - int.Parse(row["PTerminado"].ToString())


                                })).ToList();



                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();
                sqlcon.Close();


                return LstProyectos;


            }
            catch (Exception ex)
            {

                throw ex;
            }

        }
        public List<ProyectosModel> ObtenerInformeProyectosCliente(ReporteFiltroModel Filtros, string Conexion)
        {
            try
            {

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spResumenGeneralProyectosCliente", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@FechaCorte", Filtros.FechaCorte);
                sqlcmd.Parameters.AddWithValue("@Abiertos", Filtros.Abiertos);
                sqlcmd.Parameters.AddWithValue("@IdUsuario", Filtros.IdUsuario);
                sqlcmd.Parameters.AddWithValue("@IdTipoUsuario", Filtros.IdTipoUsuario);
                sqlcmd.Parameters.AddWithValue("@IdProyecto", Filtros.IdProyecto);


                sqlcmd.CommandType = CommandType.StoredProcedure;

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();

                List<ProyectosModel> LstProyectos = new List<ProyectosModel>();


                var dt = new DataTable();
                dt = ds.Tables[0];

                LstProyectos = (from row in dt.AsEnumerable()
                                select (new ProyectosModel
                                {
                                    IdProyecto = long.Parse(row["IdProyecto"].ToString()),
                                    Clave = row["Clave"].ToString(),
                                    Nombre = row["Clave"].ToString() + " - " + row["Nombre"].ToString(),
                                    Lider = row["Lider"].ToString(),


                                    FechaInicioPlan = row["FechaInicio"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaInicio"].ToString()),
                                    FechaFinPlan = row["FechaFin"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaFin"].ToString()),
                                    FechaFinComprometida = row["FechaFinComprometida"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaFinComprometida"].ToString()),
                                    FechaProyectada = row["FechaProyectada"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaProyectada"].ToString()),

                                    HorasAsignadas = decimal.Parse(row["HorasFacturablesProy"].ToString()),
                                    HorasCompromiso = decimal.Parse(row["Comprometido"].ToString()),
                                    AvanceReal = decimal.Parse(row["AvanceReal"].ToString()),
                                    Desfase = decimal.Parse(row["Desfase"].ToString()),
                                    AvanceCompPorc = decimal.Parse(row["AvanceComprometido"].ToString()),
                                    AvanceRealPorc = decimal.Parse(row["AvanceRealPorc"].ToString()),
                                    DesfaseProc = (decimal.Parse(row["AvanceComprometido"].ToString()) - decimal.Parse(row["AvanceRealPorc"].ToString())) < 0 ? 0 : decimal.Parse(row["AvanceComprometido"].ToString()) - decimal.Parse(row["AvanceRealporc"].ToString()),
                                })).ToList();



                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();
                sqlcon.Close();


                return LstProyectos;


            }
            catch (Exception ex)
            {

                throw ex;
            }

        }



        #endregion


        #region InformeDiario
        public List<InformeDiarioModel> ObtenerInformeDiario(ReporteFiltroModel Filtros, string Conexion)
        {
            try
            {

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spPlanMensual", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@Anio", Filtros.IdAnio);
                sqlcmd.Parameters.AddWithValue("@Mes", Filtros.IdMes);
                sqlcmd.Parameters.AddWithValue("@IdUsuario", Filtros.IdUsuario);
                sqlcmd.Parameters.AddWithValue("@IdTipoUsuario", Filtros.IdTipoUsuario);
                sqlcmd.Parameters.AddWithValue("@IdProyecto", Filtros.IdProyecto);

                sqlcmd.CommandType = CommandType.StoredProcedure;

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();

                List<InformeDiarioModel> LstProyectos = new List<InformeDiarioModel>();


                var dt = new DataTable();
                dt = ds.Tables[0];

                LstProyectos = (from row in dt.AsEnumerable()
                                select (new InformeDiarioModel
                                {
                                    IdProyecto = long.Parse(row["IdProyecto"].ToString()),
                                    Clave = row["Clave"].ToString(),
                                    Nombre = row["Clave"].ToString() + " - " + row["Nombre"].ToString(),
                                    //Lider = row["Lider"].ToString(),

                                    Planeado = decimal.Parse(row["Planeado"].ToString()),
                                    Asignado = decimal.Parse(row["Asignado"].ToString()),
                                    DiferenciaPlanAsignado = decimal.Parse(row["DiferenciaPlanAsignado"].ToString()),

                                    Capacidad = decimal.Parse(row["CapacidadProyecto"].ToString()),
                                    CapacidadPlan = decimal.Parse(row["CapacidadPlaneada"].ToString()),
                                    CapacidadAsignada = decimal.Parse(row["CapacidadAsignada"].ToString()),

                                    GanadoPlan = decimal.Parse(row["GanadoPlan"].ToString()),
                                    GanadoAsignado = decimal.Parse(row["GanadoAsignado"].ToString()),
                                    EsfuerzoReal = decimal.Parse(row["Real"].ToString()),
                                    EsfuerzoCapitalizado = decimal.Parse(row["EsfuerzoCapitalizado"].ToString())

                                })).ToList();



                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();
                sqlcon.Close();


                return LstProyectos;


            }
            catch (Exception ex)
            {

                throw ex;
            }

        }


        #endregion

        #region ReporteEspecial

        public List<FlujoPagoModel> ReporteEspecialProyectos(long IdCliente, string Conexion)
        {
            try
            {


                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spReporteEspecialProyectos", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdCliente", IdCliente);


                sqlcmd.CommandType = CommandType.StoredProcedure;

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();

                List<FlujoPagoModel> LstProyectos = new List<FlujoPagoModel>();


                var dt = new DataTable();
                dt = ds.Tables[0];

                LstProyectos = (from row in dt.AsEnumerable()
                                select (new FlujoPagoModel
                                {
                                    IdProyecto = long.Parse(row["IdProyecto"].ToString()),
                                    IdFlujoPago = long.Parse(row["IdFlujoPago"].ToString()),
                                    ClaveProy = row["Clave"].ToString(),
                                    NombreProy = row["Nombre"].ToString(),
                                    HorasTotales = decimal.Parse(row["HorasFacturables"].ToString()),
                                    HorasAmortizar = decimal.Parse(row["HorasAnticipo"].ToString()),
                                    Amortizadas = decimal.Parse(row["Amortizadas"].ToString()),
                                    PendienteAmortizar = decimal.Parse(row["PendienteAmortizar"].ToString()),
                                    Facturado = decimal.Parse(row["Facturado"].ToString()),
                                    PendienteFacturar = decimal.Parse(row["PendienteFacturar"].ToString()),
                                    Avance = decimal.Parse(row["Avance"].ToString()),
                                })).ToList();



                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();
                sqlcon.Close();


                return LstProyectos;



            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        #endregion

        #region BitacoraTrabajo


        public List<BitacoraTrabajoModel> ConsultaBitacoraTrabajo(FiltrosModel Filtros, string Conexion)
        {
            try
            {


                var asignado = string.Join<string>(",", Filtros.LstAsignado.ConvertAll(s => s.ToString()));
                var proyecto = string.Join<string>(",", Filtros.LstProyecto.ConvertAll(s => s.ToString()));
                var sprint = string.Join<string>(",", Filtros.LstSprints.ConvertAll(s => s.ToString()));


                DataSet ds = new DataSet();


                List<BitacoraTrabajoModel> LstBitacora = new List<BitacoraTrabajoModel>();


                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("ObtenerBitacoraTareas", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@Proyecto", proyecto);
                sqlcmd.Parameters.AddWithValue("@FechaIni", Filtros.FechaSolIni);
                sqlcmd.Parameters.AddWithValue("@FechaFin", Filtros.FechaSolFin);
                sqlcmd.Parameters.AddWithValue("@UsuarioAsignado", asignado);
                sqlcmd.Parameters.AddWithValue("@Sprints", sprint);
                sqlcmd.Parameters.AddWithValue("@IdUsuario", Filtros.IdUsuario);
                sqlcmd.Parameters.AddWithValue("@TipoUsuario", Filtros.IdTipoUsuario);


                sqlcmd.CommandType = CommandType.StoredProcedure;

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();

                var dt = new DataTable();
                dt = ds.Tables[0];


                var LstActividades = (from row in ds.Tables[1].AsEnumerable()
                                      select (new ActividadTrabajoModel
                                      {
                                          IdKey = long.Parse(row["IdKey"].ToString()),
                                          Fecha = DateTime.Parse(row["Fecha"].ToString()),
                                          IdActividad = long.Parse(row["IdActividad"].ToString()),
                                          IdActividadStr = row["IdActividadStr"].ToString(),
                                          Titulo = row["BR"].ToString(),
                                          Tiempo = decimal.Parse(row["Tiempo"].ToString()),
                                          Comentario = row["Comentario"].ToString(),

                                      })).ToList();


                LstBitacora = (from row in dt.AsEnumerable()
                               select (new BitacoraTrabajoModel
                               {
                                   IdKey = long.Parse(row["IdKey"].ToString()),
                                   IdUsuario = long.Parse(row["IdUsuarioAsignado"].ToString()),
                                   Nombre = row["Recurso"].ToString(),
                                   Fecha = DateTime.Parse(row["Fecha"].ToString()),
                                   Horas = decimal.Parse(row["Tiempo"].ToString()),
                                   Total = int.Parse(row["Tareas"].ToString()),
                                   LstActividades = LstActividades.Where(w => w.IdKey == long.Parse(row["IdKey"].ToString())).ToList()

                               })).ToList();



                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();
                sqlcon.Close();


                return LstBitacora;



            }
            catch (Exception ex)
            {

                throw ex;
            }

        }



        #endregion




        public void CalculoProductividadPeriodo_SP(
                FiltrosModel filtros,
                ref Dictionary<int, List<CompensacionModel>> dictEncabezadoPorSemana,
                ref Dictionary<int, List<ActividadesModel>> dictDetallePorSemana,
                ref Dictionary<int, List<ActividadesModel>> bugs,
                ref Dictionary<int, List<UsuarioIncidencia>> incidenciasPorSemana,
                string conexion)
        {
            try
            {


                dictEncabezadoPorSemana = new Dictionary<int, List<CompensacionModel>>();
                dictDetallePorSemana = new Dictionary<int, List<ActividadesModel>>();
                bugs = new Dictionary<int, List<ActividadesModel>>();
                incidenciasPorSemana = new Dictionary<int, List<UsuarioIncidencia>>();


                foreach (var periodo in filtros.GetPeriodos())
                {
                    DataSet ds = new DataSet();

                    SqlConnection sqlcon = new SqlConnection(conexion);
                    SqlCommand sqlcmd = new SqlCommand("CalculoProductividadPeriodo_SP", sqlcon);
                    sqlcmd.CommandType = CommandType.StoredProcedure;
                    sqlcmd.Parameters.AddWithValue("@Mes", filtros.Mes);
                    sqlcmd.Parameters.AddWithValue("@Anio", filtros.Anio);
                    sqlcmd.Parameters.AddWithValue("@IdUsuarioGenero", filtros.IdUsuario);
                    sqlcmd.Parameters.AddWithValue("@IdUsuario", filtros.IdUsuarioConsulta);

                    sqlcmd.Parameters.AddWithValue("@FechaInicio", periodo.Inicio);
                    sqlcmd.Parameters.AddWithValue("@FechaFin", periodo.Fin);




                    SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                    da.Fill(ds);
                    da.Dispose();

                    var Encabezado = ds.Tables[0];
                    var Detalle = ds.Tables[1];
                    var Bugs = ds.Tables[2];
                    var Incidencia = ds.Tables[3];

                    if (Encabezado.Rows.Count == 0 || Detalle.Rows.Count == 0)
                        continue;
                    var encabezados = (from row in Encabezado.AsEnumerable()
                                       select (new CompensacionModel
                                       {
                                           IdUsuario = long.Parse(row["IdUsuario"].ToString()),
                                           Clave = row["Clave"].ToString(),
                                           Recurso = row["Recurso"].ToString(),
                                           Nivel = row["Nivel"].ToString(),
                                           DiasLaborales = row["DiasLaborales"].ToString(),
                                           Incidencias = row["Incidencias"].ToString(),
                                           EstandarPeriodo = row["EstandarPeriodo"].ToString(),
                                           EstandarDiario = row["EstandarDiario"].ToString(),
                                           HorasSolicitadas = row["HorasSolicitadas"].ToString(),
                                           HorasLiberadas = row["HorasLiberadas"].ToString(),
                                           Productividad = Math.Round(decimal.Parse(row["Productividad"].ToString()), 2).ToString() + "%",
                                           HorasBugs = Math.Round(decimal.Parse(row["HorasBugs"].ToString()), 2),
                                           Lider = row["Lider"].ToString(),
                                       })).ToList();

                    var detalles = (from row in Detalle.AsEnumerable()
                                    select (new ActividadesModel
                                    {
                                        IdActividad = long.Parse(row["IdActividad"].ToString()),
                                        IdActividadStr = row["IdActividadStr"].ToString(),
                                        IdUsuarioAsignado = long.Parse(row["IdUsuarioAsignado"].ToString()),
                                        ProyectoStr = row["Proyecto"].ToString(),
                                        Descripcion = row["Descripcion"].ToString(),
                                        HorasAsignadas = decimal.Parse(row["HorasAsignadas"].ToString()),
                                        HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),
                                        FechaTermino = DateTime.Parse(row["FechaTermino"].ToString()),
                                        TipoActividadStr = row["Fase"].ToString(),
                                        ClasificacionStr = row["Clasificacion"].ToString()
                                    })).ToList();

                    var _bugs = (from row in Bugs.AsEnumerable()
                                    select (new ActividadesModel
                                    {
                                        IdActividad = long.Parse(row["IdActividad"].ToString()),
                                        IdActividadStr = row["IdActividadStr"].ToString(),
                                        IdUsuarioAsignado = long.Parse(row["IdUsuarioAsignado"].ToString()),
                                        ProyectoStr = row["Proyecto"].ToString(),
                                        Descripcion = row["Descripcion"].ToString(),
                                        HorasAsignadas = decimal.Parse(row["HorasAsignadas"].ToString()),
                                        HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),
                                        FechaTermino = DateTime.Parse(row["FechaTermino"].ToString()),
                                        TipoActividadStr = row["Fase"].ToString(),
                                        ClasificacionStr = row["Clasificacion"].ToString()
                                    })).ToList();

                    var incidencias = (from row in Incidencia.AsEnumerable()
                                       select (new UsuarioIncidencia
                                       {
                                           IdUsuario = int.Parse(row["IdUsuario"].ToString()),
                                           DiasInc = int.Parse(row["DiasInc"].ToString()),
                                           Incidencia = row["Incidencia"].ToString(),
                                           FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
                                           FechaFin = DateTime.Parse(row["FechaFin"].ToString())
                                       })).ToList();

                    dictEncabezadoPorSemana[periodo.Numero] = encabezados;
                    dictDetallePorSemana[periodo.Numero] = detalles;
                    bugs[periodo.Numero] = _bugs;
                    incidenciasPorSemana[periodo.Numero] = incidencias;


                    sqlcmd.Connection.Close();
                    sqlcmd.Connection.Dispose();
                    sqlcmd.Dispose();

                }




            }
            catch (Exception ex)
            {

                throw ex;
            }

        }





    }
}
