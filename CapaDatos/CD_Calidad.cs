using CapaDatos.DataBaseModel;
using CapaDatos.Models;
using CapaDatos.Models.Constants;
using DocumentFormat.OpenXml.Bibliography;
using DocumentFormat.OpenXml.Office2016.Drawing.Charts;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EntityFramework.Extensions;
using Newtonsoft.Json;
using CapaDatos.Constants;

namespace CapaDatos
{
    public class CD_Calidad
    {
        public int GuardarCicloPrueba(CicloPruebaModel CP, string Conexion)
        {
            try
            {

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    //Nuevo
                    if (CP.IdCicloP == 0)
                    {

                        // Valido que no exista otro ciclo con el mism nombre para el proyecto

                        var existe = contexto.ProyectoIteracion.Where(w => w.Nombre.ToUpper() == CP.Nombre.ToUpper() && w.IdProyecto == CP.IdProyecto).FirstOrDefault();

                        if (existe != null)
                        {

                            return 2;
                        }

                        CicloPrueba s = new CicloPrueba();

                        s.Nombre = CP.Nombre;
                        s.IdProyecto = CP.IdProyecto;
                        s.Ambiente = CP.Ambiente;
                        s.Descripcion = CP.Descripcion;
                        s.FechaInicio = CP.FechaInicio;
                        s.FechaFin = CP.FechaFin;
                        s.IdUCreo = CP.IdUCreo;
                        s.Estatus = "A";
                        s.FechaCreo = DateTime.Now.Date;

                        contexto.CicloPrueba.Add(s);

                    }
                    else
                    {
                        // Valido que no exista otro ciclo con el mism nombre para el proyecto y que no sea el que estoy editando
                        var existe = contexto.CicloPrueba.Where(w => w.Nombre.ToUpper() == CP.Nombre.ToUpper() && w.IdProyecto == CP.IdProyecto && w.IdCicloP != CP.IdCicloP).FirstOrDefault();

                        if (existe != null)
                        {

                            return 2;
                        }

                        var sp = contexto.CicloPrueba.Where(w => w.IdCicloP == CP.IdCicloP).FirstOrDefault();

                        sp.Nombre = CP.Nombre;
                        sp.Descripcion = CP.Descripcion;
                        sp.Ambiente = CP.Ambiente;
                        sp.FechaInicio = CP.FechaInicio;
                        sp.FechaFin = CP.FechaFin;
                        sp.IdUMod = CP.IdUCreo;
                        sp.FechaMod = DateTime.Now.Date;

                    }

                    contexto.SaveChanges();
                    return 1;

                }

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }
        public List<CicloPruebaModel> ConsultaCiclosPrueba(long IdProyecto, string Conexion)
        {
            try
            {



                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spCiclosPruebaResumen", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdProyecto", IdProyecto);


                sqlcmd.CommandType = CommandType.StoredProcedure;

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();

                List<CicloPruebaModel> LstCP = new List<CicloPruebaModel>();


                var dt = new DataTable();

                dt = ds.Tables[0];


                LstCP = (from row in dt.AsEnumerable()
                         select (new CicloPruebaModel
                         {
                             IdCicloP = long.Parse(row["IdCicloP"].ToString()),
                             IdProyecto = long.Parse(row["IdProyecto"].ToString()),
                             Nombre = row["Nombre"].ToString(),
                             Ambiente = row["Ambiente"].ToString(),
                             Descripcion = row["Descripcion"].ToString(),
                             Estatus = row["Estatus"].ToString(),
                             Estatus2 = row["Estatus2"].ToString(),
                             EstatusStr = row["EstatusStr"].ToString(),
                             FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
                             FechaFin = DateTime.Parse(row["FechaFin"].ToString()),
                             Avance = decimal.Parse(row["Avance"].ToString()),
                             Aprobado = decimal.Parse(row["Aprobado"].ToString())
                         })).ToList();



                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();
                sqlcon.Close();


                return LstCP;



            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public CicloPruebaModel CicloPruebaReport(long IdCicloP, string Estatus, string Conexion)
        {
            try
            {


                CicloPruebaModel CP = new CicloPruebaModel();


                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spReporteCicloPrueba", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdCicloP", IdCicloP);
                sqlcmd.Parameters.AddWithValue("@Estatus", Estatus);

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();
                var _lst = ds.Tables[0];
                var _lstAct = ds.Tables[1];



                CP = (from row in _lst.AsEnumerable()
                      select (
                      new CicloPruebaModel
                      {
                          IdCicloP = int.Parse(row["IdCicloP"].ToString()),
                          IdProyecto = int.Parse(row["IdProyecto"].ToString()),
                          Proyecto = row["Proyecto"].ToString(),
                          Nombre = row["Nombre"].ToString(),
                          Ambiente = row["Ambiente"].ToString(),
                          Descripcion = row["Descripcion"].ToString(),
                          Estatus = row["Estatus"].ToString(),
                          EstatusStr = row["EstatusStr"].ToString(),
                          FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
                          FechaFin = DateTime.Parse(row["FechaFin"].ToString()),
                          Avance = decimal.Parse(row["Avance"].ToString()),
                          Defectos = int.Parse(row["Defectos"].ToString()),
                          TiempoEjecucion = decimal.Parse(row["TiempoEjecucion"].ToString()),
                      })).FirstOrDefault();


                CP.CasosPrueba = (from row in _lstAct.AsEnumerable()
                                  select (
                                  new CasoPruebaModel
                                  {

                                      IdCicloP = long.Parse(row["IdCicloP"].ToString()),
                                      IdCicloCaso = long.Parse(row["IdCicloCaso"].ToString()),
                                      IdActividadCaso = long.Parse(row["IdActividadCaso"].ToString()),
                                      IdActividadEjecucion = row["IdActividadEjecucion"].ToString() == "" ? (long?)null : long.Parse(row["IdActividadEjecucion"].ToString()),
                                      IdActividadStr = row["Clave"].ToString() + "-" + row["IdActividadCaso"].ToString(),
                                      EstatusP = row["EstatusP"].ToString(),
                                      EstatusStr = row["EstatusStr"].ToString(),
                                      Titulo = row["Titulo"].ToString(),
                                      Descripcion = row["Descripcion"].ToString(),
                                      Clasificacion = row["Clasificacion"].ToString(),
                                      TiempoEjecucion = decimal.Parse(row["TiempoEjecucion"].ToString()),
                                      FechaInicio = row["FechaInicio"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaInicio"].ToString()),
                                      FechaSolicitado = row["FechaSolicitado"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaSolicitado"].ToString()),
                                      IdUsuarioAsignado = row["IdUsuarioAsignado"].ToString() == "" ? -1 : long.Parse(row["IdUsuarioAsignado"].ToString()),
                                      Asignado = row["Asignado"].ToString(),
                                      AsignadoPath = row["AsignadoPath"].ToString(),
                                      TipoNombre = row["TipoNombre"].ToString(),
                                      TipoUrl = row["TipoUrl"].ToString(),
                                  })).ToList();






                var dt = new DataTable();


                var gr = new GraficaConsultaModel();

                dt = ds.Tables[2];

                gr.id = Guid.NewGuid();
                gr.Nombre = "Estatus";
                gr.Tipo = "Pie";

                var Lst = (from row in dt.AsEnumerable() select (new GraficaModel { name = row["Indicador"].ToString() + " " + row["Resultado"].ToString(), value = double.Parse(row["Resultado"].ToString()) })).ToList();
                gr.LstValores = JsonConvert.SerializeObject(Lst);
                gr.Series = JsonConvert.SerializeObject(Lst.Select(s => s.name).ToList());



                var dt2 = new DataTable();


                var g2 = new GraficaConsultaModel();

                dt2 = ds.Tables[3];

                g2.id = Guid.NewGuid();
                g2.Nombre = "Estatusb";
                g2.Tipo = "Pie";

                var Lst2 = (from row in dt2.AsEnumerable() select (new GraficaModel { name = row["Indicador"].ToString() + " " + row["Resultado"].ToString(), value = double.Parse(row["Resultado"].ToString()) })).ToList();
                g2.LstValores = JsonConvert.SerializeObject(Lst2);
                g2.Series = JsonConvert.SerializeObject(Lst2.Select(s => s.name).ToList());

                ////gr.Nombre = 00
                ////gr.Tipo = dt.Rows[0][1].ToString();


                ////Valores de las series
                //var lst = (from row in dt.AsEnumerable() select row[2].ToString()).ToList();

                ////Valores de las columnas
                //List<string> columns = new List<string>();
                //for (int i = 3; i < dt.Columns.Count; i++)
                //{
                //    columns.Add(dt.Columns[i].ColumnName.ToString());
                //}

                ////Valores de data
                //List<GraficaBarraModel> lstval = new List<GraficaBarraModel>();
                //GraficaBarraModel gbm;
                //List<string> datos;
                //for (int i = 0; i < dt.Rows.Count; i++)
                //{
                //    gbm = new GraficaBarraModel();
                //    datos = new List<string>();
                //    gbm.name = dt.Rows[i][2].ToString();
                //    gbm.type = dt.Rows[i][1].ToString();

                //    for (int j = 3; j < dt.Columns.Count; j++)
                //    {
                //        datos.Add(dt.Rows[i][j].ToString());
                //    }

                //    gbm.data = datos;

                //    lstval.Add(gbm);
                //}

                //gr.LstValores = JsonConvert.SerializeObject(lstval);
                //gr.LstColumnas = JsonConvert.SerializeObject(columns);
                //gr.Series = JsonConvert.SerializeObject(lst);



                //gr.Tabla = ConvertirDatos.GenerarTablaHtml(dt);

                CP.grEstatus = gr;
                CP.grEstatusBugs = g2;

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();

                sqlcon.Close();


                return CP;



            }
            catch (Exception ex)
            {

                throw ex;
            }

        }


        public CicloPruebaModel CicloPruebaReport_Imprimir(long IdCicloP,  string Conexion)
        {
            try
            {


                CicloPruebaModel CP = new CicloPruebaModel();


                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spReporteCicloPrueba_Imprimir", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdCicloP", IdCicloP);
                //sqlcmd.Parameters.AddWithValue("@Estatus", Estatus);

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();
                var _lst = ds.Tables[0];
                var _lstAct = ds.Tables[1];



                CP = (from row in _lst.AsEnumerable()
                      select (
                      new CicloPruebaModel
                      {
                          IdCicloP = int.Parse(row["IdCicloP"].ToString()),
                          IdProyecto = int.Parse(row["IdProyecto"].ToString()),
                          ClaveProy = row["Clave"].ToString(),
                          Proyecto = row["Proyecto"].ToString(),
                          Nombre = row["Nombre"].ToString(),
                          Ambiente = row["Ambiente"].ToString(),
                          Descripcion = row["Descripcion"].ToString(),
                          Estatus = row["Estatus"].ToString(),
                          EstatusStr = row["EstatusStr"].ToString(),
                          FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
                          FechaFin = DateTime.Parse(row["FechaFin"].ToString())
                      })).FirstOrDefault();


                CP.CasosPrueba = (from row in _lstAct.AsEnumerable()
                                  select (
                                  new CasoPruebaModel
                                  {

                                      IdCicloP = long.Parse(row["IdCicloP"].ToString()),
                                      IdCicloCaso = long.Parse(row["IdCicloCaso"].ToString()),
                                      IdActividadCaso = long.Parse(row["IdActividadCaso"].ToString()),
                                      IdActividadEjecucion = row["IdActividadEjecucion"].ToString() == "" ? (long?)null : long.Parse(row["IdActividadEjecucion"].ToString()),
                                      IdActividadStr = row["Clave"].ToString() + "-" + row["IdActividadCaso"].ToString(),
                                      EstatusP = row["EstatusP"].ToString(),
                                      EstatusStr = row["EstatusStr"].ToString(),
                                      Titulo = row["Titulo"].ToString(),
                                      Descripcion = row["Descripcion"].ToString(),
                                      Evidencias = row["Evidencias"].ToString(),
                                      FechaEjecucion = row["FechaEjecucion"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaEjecucion"].ToString()),
                                      IdUsuarioAsignado = row["IdUsuarioAsignado"].ToString() == "" ? -1 : long.Parse(row["IdUsuarioAsignado"].ToString()),
                                      Asignado = row["Asignado"].ToString(),
                                      AsignadoPath = row["AsignadoPath"].ToString()
                                  })).ToList();

                 CP.LstEstatus = (from row in ds.Tables[2].AsEnumerable()
                                 select (
                                 new GraficaModel
                                 {

                                     name = row["Indicador"].ToString(),
                                     value =double.Parse( row["Resultado"].ToString())
                                 })).ToList();





                return CP;



            }
            catch (Exception ex)
            {

                throw ex;
            }

        }


        public bool AsignacionCasosPruebaMasiva(string Actividades, long IdCicloP, long IdUsuario, string Conexion)
        {
            SqlConnection sqlcon = new SqlConnection(Conexion);
            try
            {

                sqlcon.Open();
                SqlCommand sqlcmd = new SqlCommand("spAsignacionMasivaCasosPrueba", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@Actividades", Actividades);
                sqlcmd.Parameters.AddWithValue("@IdCicloP", IdCicloP);
                sqlcmd.Parameters.AddWithValue("@IdUsuario", IdUsuario);


                sqlcmd.ExecuteNonQuery();
                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();
                sqlcon.Close();

                return true;

            }
            catch (Exception ex)
            {
                sqlcon.Close();
                throw ex;
            }


        }


       
       
        public bool AsignaCasoPrueba(CasoPruebaModel CP, long IdUsuario, string Conexion)
        {

            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    if (CP.IdActividadEjecucion == 0) // cuando pasa esto creo una actividade para ejecutar el caso de prueba y el qa pueda reportar sus tiempos
                    {

                        // Obtengo la actividad del caso de prueba

                        var acp = contexto.Actividad.Where(w => w.IdActividad == CP.IdActividadCaso).FirstOrDefault();

                        Actividad act = new Actividad();

                        act.IdUsuarioAsignado = CP.IdUsuarioAsignado;
                        act.Descripcion = "Ejecutar caso de prueba " + acp.BR;
                        act.DocumentoRef = string.Empty;
                        act.Estatus = "A";
                        act.BR = "Ejecutar caso de prueba " + acp.BR;
                        act.TiempoEjecucion = acp.TiempoEjecucion;
                        act.HorasFacturables = acp.TiempoEjecucion;//Por el momento pondre 0
                        act.HorasAsignadas = acp.TiempoEjecucion;
                        act.IdProyecto = acp.IdProyecto;
                        act.TipoActividadId = contexto.CatalogoGeneral.Where(w => w.DescCorta == "QA").FirstOrDefault().IdCatalogo;
                        act.ClasificacionId = contexto.CatalogoGeneral.Where(w => w.DescCorta == "ECDP").FirstOrDefault().IdCatalogo;
                        act.IdUsuarioResponsable = acp.Proyecto.IdULider;
                        act.FechaInicio = CP.FechaInicio;
                        act.FechaSolicitado = CP.FechaSolicitado;
                        act.Planificada = acp.Planificada;
                        act.Prioridad = acp.Prioridad;
                        act.PrioridadId = acp.PrioridadId;
                        act.IdIteracion = acp.IdIteracion;
                        //act.IdActividadRef = ActividadModel.IdActividadRef;
                        act.EstatusCte = "P";
                        act.IdUCreo = IdUsuario;
                        act.FechaCreo = DateTime.Now;
                        act.Retrabajo = acp.Retrabajo;
                        act.Critico = acp.Critico;
                        act.TipoId = 1; // Lo voy a definir como una tareas
                        act.CriterioAceptacion = string.Empty;

                        act.IdWorkflow = contexto.WorkFlow.Where(w => w.IdProyecto == acp.IdProyecto && w.IdActividadTipo == 1 && w.EstatusR == "A").FirstOrDefault().IdWorkFlow;



                        List<ActividadesValidacionModel> Validaciones = contexto.Autorizacion.Where(i => i.Tipo == 1 && i.Activo == true)
                                           .Select(s => new ActividadesValidacionModel
                                           {
                                               IdActividad = act.IdActividad,
                                               IdAutorizacion = s.IdAutorizacion,
                                               NombreAut = s.Nombre,
                                               Estatus = "P",
                                               Secuencia = s.Secuencia
                                           }).ToList();



                        ActividadValidaciones a;
                        List<ActividadValidaciones> lstact = new List<ActividadValidaciones>();
                        foreach (var actval in Validaciones)
                        {

                            a = new ActividadValidaciones();
                            a.IdAutorizacion = actval.IdAutorizacion;
                            a.NombreAut = actval.NombreAut;
                            a.Estatus = actval.Estatus;
                            a.Secuencia = actval.Secuencia;

                            lstact.Add(a);

                        }


                        //Inserto las fases 
                        TimeSpan trabajado = TimeSpan.Parse("00:00:00.000");
                        List<ActividadTrackingModel> LstTrck = contexto.TipoActividadFase.Where(w => w.TipoActividadId == act.TipoActividadId).
                                                  Select(s => new ActividadTrackingModel
                                                  {
                                                      IdFase = s.IdFase,
                                                      Nombre = s.Nombre,
                                                      Porcentaje = s.Porcentaje,
                                                      Trabajado = trabajado,
                                                      Orden = s.Orden,
                                                      Finalizado = false

                                                  }).ToList();

                        ActividadTracking t;
                        List<ActividadTracking> lstt = new List<ActividadTracking>();
                        foreach (var acttra in LstTrck)
                        {

                            t = new ActividadTracking();

                            t.IdFase = acttra.IdFase;
                            t.Nombre = acttra.Nombre;
                            t.Porcentaje = acttra.Porcentaje;
                            t.Trabajado = TimeSpan.Parse("00:00:00.000");
                            t.Orden = acttra.Orden;
                            t.Finalizado = false;
                            lstt.Add(t);

                        }


                        act.ActividadValidaciones = lstact;
                        act.ActividadTracking = lstt;

                        contexto.Actividad.Add(act);
                        contexto.SaveChanges();




                        ActividadRelacion arel = new ActividadRelacion();

                        arel.IdActividad = act.IdActividad;
                        arel.IdActividadRelacionada = acp.IdActividad;

                        contexto.ActividadRelacion.Add(arel);



                        ActividadLog actlog = new ActividadLog();
                        actlog.IdActividad = act.IdActividad;
                        actlog.Descripcion = "Creó la ejecución del caso de prueba";
                        actlog.IdUCreo = IdUsuario;
                        actlog.FechaHora = DateTime.Now;

                        contexto.ActividadLog.Add(actlog);


                        var ccp = contexto.CicloPrueba_CasosPrueba.Where(w => w.IdCicloCaso == CP.IdCicloCaso).FirstOrDefault();
                        ccp.IdActividadEjecucion = act.IdActividad == 0 ? (long?)null : act.IdActividad;



                        contexto.SaveChanges();

                    }
                    else // Solo actualizo la actividad relacionada
                    {

                        var a = contexto.Actividad.Where(w => w.IdActividad == CP.IdActividadEjecucion).FirstOrDefault();

                        a.IdUsuarioAsignado = CP.IdUsuarioAsignado;
                        a.FechaInicio = CP.FechaInicio;
                        a.FechaSolicitado = CP.FechaSolicitado;


                        ActividadLog actlog = new ActividadLog();
                        actlog.IdActividad = a.IdActividad;
                        actlog.Descripcion = "Realizó cambios en al planeación de la tarea";
                        actlog.IdUCreo = IdUsuario;
                        actlog.FechaHora = DateTime.Now;


                        contexto.ActividadLog.Add(actlog);
                        contexto.SaveChanges();

                    }

                }


                return true;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public bool AsignaCasoPruebaMasivaUsuario(CasoPruebaModel CPE,  List<long> Lst, long IdUsuario, string Conexion)
        {

            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {



                    foreach (var item in Lst) 
                    {

                        var CP = contexto.CicloPrueba_CasosPrueba.Where(w => w.IdCicloCaso == item).FirstOrDefault();


                    if (CP.IdActividadEjecucion == 0 || CP.IdActividadEjecucion == null) // cuando pasa esto creo una actividade para ejecutar el caso de prueba y el qa pueda reportar sus tiempos
                        {

                        // Obtengo la actividad del caso de prueba

                        var acp = contexto.Actividad.Where(w => w.IdActividad == CP.IdActividadCaso).FirstOrDefault();

                        Actividad act = new Actividad();

                        act.IdUsuarioAsignado = CPE.IdUsuarioAsignado;
                        act.Descripcion = "Ejecutar caso de prueba " + acp.BR;
                        act.DocumentoRef = string.Empty;
                        act.Estatus = "A";
                        act.BR = "Ejecutar caso de prueba " + acp.BR;
                        act.TiempoEjecucion = acp.TiempoEjecucion;
                        act.HorasFacturables = acp.TiempoEjecucion;//Por el momento pondre 0
                        act.HorasAsignadas = acp.TiempoEjecucion;
                        act.IdProyecto = acp.IdProyecto;
                        act.TipoActividadId = contexto.CatalogoGeneral.Where(w => w.DescCorta == "QA").FirstOrDefault().IdCatalogo;
                        act.ClasificacionId = contexto.CatalogoGeneral.Where(w => w.DescCorta == "ECDP").FirstOrDefault().IdCatalogo;
                        act.IdUsuarioResponsable = acp.Proyecto.IdULider;
                        act.FechaInicio = CPE.FechaInicio;
                        act.FechaSolicitado = CPE.FechaSolicitado;
                        act.Planificada = acp.Planificada;
                        act.Prioridad = acp.Prioridad;
                        act.PrioridadId = acp.PrioridadId;
                        act.IdIteracion = acp.IdIteracion;
                        //act.IdActividadRef = ActividadModel.IdActividadRef;
                        act.EstatusCte = "P";
                        act.IdUCreo = IdUsuario;
                        act.FechaCreo = DateTime.Now;
                        act.Retrabajo = acp.Retrabajo;
                        act.Critico = acp.Critico;
                        act.TipoId = 1; // Lo voy a definir como una tareas
                        act.CriterioAceptacion = string.Empty;

                         act.IdWorkflow = contexto.WorkFlow.Where(w => w.IdProyecto == acp.IdProyecto && w.IdActividadTipo == 1 && w.EstatusR == "A").FirstOrDefault().IdWorkFlow;



                            List<ActividadesValidacionModel> Validaciones = contexto.Autorizacion.Where(i => i.Tipo == 1 && i.Activo == true)
                                           .Select(s => new ActividadesValidacionModel
                                           {
                                               IdActividad = act.IdActividad,
                                               IdAutorizacion = s.IdAutorizacion,
                                               NombreAut = s.Nombre,
                                               Estatus = "P",
                                               Secuencia = s.Secuencia
                                           }).ToList();



                        ActividadValidaciones a;
                        List<ActividadValidaciones> lstact = new List<ActividadValidaciones>();
                        foreach (var actval in Validaciones)
                        {

                            a = new ActividadValidaciones();
                            a.IdAutorizacion = actval.IdAutorizacion;
                            a.NombreAut = actval.NombreAut;
                            a.Estatus = actval.Estatus;
                            a.Secuencia = actval.Secuencia;

                            lstact.Add(a);

                        }


                        //Inserto las fases 
                        TimeSpan trabajado = TimeSpan.Parse("00:00:00.000");
                        List<ActividadTrackingModel> LstTrck = contexto.TipoActividadFase.Where(w => w.TipoActividadId == act.TipoActividadId).
                                                  Select(s => new ActividadTrackingModel
                                                  {
                                                      IdFase = s.IdFase,
                                                      Nombre = s.Nombre,
                                                      Porcentaje = s.Porcentaje,
                                                      Trabajado = trabajado,
                                                      Orden = s.Orden,
                                                      Finalizado = false

                                                  }).ToList();

                        ActividadTracking t;
                        List<ActividadTracking> lstt = new List<ActividadTracking>();
                        foreach (var acttra in LstTrck)
                        {

                            t = new ActividadTracking();

                            t.IdFase = acttra.IdFase;
                            t.Nombre = acttra.Nombre;
                            t.Porcentaje = acttra.Porcentaje;
                            t.Trabajado = TimeSpan.Parse("00:00:00.000");
                            t.Orden = acttra.Orden;
                            t.Finalizado = false;
                            lstt.Add(t);

                        }


                        act.ActividadValidaciones = lstact;
                        act.ActividadTracking = lstt;

                        contexto.Actividad.Add(act);
                        contexto.SaveChanges();




                        ActividadRelacion arel = new ActividadRelacion();

                        arel.IdActividad = act.IdActividad;
                        arel.IdActividadRelacionada = acp.IdActividad;

                        contexto.ActividadRelacion.Add(arel);



                        ActividadLog actlog = new ActividadLog();
                        actlog.IdActividad = act.IdActividad;
                        actlog.Descripcion = "Creó la ejecución del caso de prueba";
                        actlog.IdUCreo = IdUsuario;
                        actlog.FechaHora = DateTime.Now;

                        contexto.ActividadLog.Add(actlog);


                        var ccp = contexto.CicloPrueba_CasosPrueba.Where(w => w.IdCicloCaso == CP.IdCicloCaso).FirstOrDefault();
                        ccp.IdActividadEjecucion = act.IdActividad == 0 ? (long?)null : act.IdActividad;



                        contexto.SaveChanges();

                    }
                    else // Solo actualizo la actividad relacionada
                    {

                        var a = contexto.Actividad.Where(w => w.IdActividad == CP.IdActividadEjecucion).FirstOrDefault();

                        a.IdUsuarioAsignado = CPE.IdUsuarioAsignado;
                        a.FechaInicio = CPE.FechaInicio;
                        a.FechaSolicitado = CPE.FechaSolicitado;


                        ActividadLog actlog = new ActividadLog();
                        actlog.IdActividad = a.IdActividad;
                        actlog.Descripcion = "Realizó cambios en al planeación de la tarea";
                        actlog.IdUCreo = IdUsuario;
                        actlog.FechaHora = DateTime.Now;


                        contexto.ActividadLog.Add(actlog);
                        contexto.SaveChanges();

                    }


                    }
                }


                return true;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }


        public CasoPruebaModel ConsultaEjecucionCaso(long IdCicloCaso, string Conexion)
        {
            try
            {
                CasoPruebaModel CP = new CasoPruebaModel();
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {


                    CP = contexto.CicloPrueba_CasosPrueba.Where(w => w.IdCicloCaso == IdCicloCaso)
                        .Select(s => new CasoPruebaModel()
                        {
                            IdProyecto = s.CicloPrueba.IdProyecto,
                            IdActividadCaso = s.IdActividadCaso,
                            IdActividadEjecucion = s.IdActividadEjecucion,
                            Titulo = s.Actividad.BR,
                            Descripcion = s.Actividad.Descripcion,
                            Evidencias = s.Evidencias,
                            Clasificacion = contexto.CatalogoGeneral.Where(g => g.IdCatalogo == s.Actividad.ClasificacionId).FirstOrDefault().DescLarga,
                            TiempoEjecucion = s.Actividad.TiempoEjecucion,
                            IdUsuarioAsignado = s.Actividad1.IdUsuarioAsignado,
                            EstatusP = s.EstatusP,
                            HorasFinales = s.Actividad1.HorasFinales

                        })
                    .FirstOrDefault();


                }

                return CP;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public bool GuardarResultadoCasoCiclo(CasoPruebaModel CP, string Conexion)
        {

            using (var contexto = new BDProductividad_DEVEntities(Conexion))
            {
                CD_Actividad cd_a = new CD_Actividad();
                var c = contexto.CicloPrueba_CasosPrueba.Where(w => w.IdCicloCaso == CP.IdCicloCaso).FirstOrDefault();

                c.EstatusP = CP.EstatusP;
                c.Evidencias = CP.Evidencias;
                c.FechaEjecucion = DateTime.Now; 

                c.Actividad1.IdUsuarioAsignado = CP.IdUsuarioAsignado;


                //Buscar la actividad del caso de prueba
                var act = contexto.Actividad.Where(w=> w.IdActividad == c.IdActividadCaso).FirstOrDefault();

                //Si esta en estatus abierto la paso a revision y le creo un registro de trabajo si no existe
                if (act.Estatus == "A")
                {



                    act.Estatus = "P";
                    act.HorasFinales =    act.HorasAsignadas== null ? 0 : decimal.Parse(act.HorasAsignadas.ToString());
                    act.FechaTermino = DateTime.Now;


                    cd_a.CambiaEstatusActividad("R", "Envío a progreso", act.IdActividad, long.Parse(act.IdUsuarioAsignado.ToString()), Conexion);


                    //ActividadTrabajo at = new ActividadTrabajo();
                    //var ha = "0.1";
                    //at.IdActividad = act.IdActividad;
                    //at.Fecha = DateTime.Now;
                    //at.Tiempo = act.HorasAsignadas == null ? decimal.Parse(ha.ToString()) : decimal.Parse(act.HorasAsignadas.ToString());
                    //at.FechaRegistro = DateTime.Now;
                    //at.Comentario = "Tiempo creado por el envío automatico de actividad a revisión";
                    //at.IdUsuarioRegistro = long.Parse(act.IdUsuarioAsignado.ToString());

                    //contexto.ActividadTrabajo.Add(at);

                    ActividadLog actlog = new ActividadLog();
                    actlog.IdActividad = act.IdActividad;
                    actlog.Descripcion = "Envío actividad a progreso";
                    actlog.IdUCreo = long.Parse(act.IdUsuarioAsignado.ToString());
                    actlog.FechaHora = DateTime.Now;
                    contexto.ActividadLog.Add(actlog);


                }


                // Si el caso de prueba es exitoso paso la actividad de ejecución tambien a revisión
                if (CP.EstatusP == "L")
                {
                    var acte = contexto.Actividad.Where(w => w.IdActividad == c.IdActividadEjecucion).FirstOrDefault();


                    cd_a.CambiaEstatusActividad("R", "Envío a revisión", acte.IdActividad, long.Parse(acte.IdUsuarioAsignado.ToString()), Conexion);


                    acte.Estatus = "R";
                    acte.FechaTermino = DateTime.Now;


                    //Agrego las evidencias ala actividad de ejecucion
                    acte.Descripcion = "Ejecucíón de caso de prueba  <br/> <br/><b> EVIDENCIA: </b><br/> <br/>" + c.Evidencias;

                    ActividadLog actlog = new ActividadLog();
                    actlog.IdActividad = acte.IdActividad;
                    actlog.Descripcion = "Envío actividad a revisión";
                    actlog.IdUCreo = long.Parse(acte.IdUsuarioAsignado.ToString());
                    actlog.FechaHora = DateTime.Now;
                    contexto.ActividadLog.Add(actlog);

                }


                // Si el caso de prueba es exitoso paso la actividad de ejecución tambien a revisión
                if (CP.EstatusP == "O")
                {
                    var acte = contexto.Actividad.Where(w => w.IdActividad == c.IdActividadEjecucion).FirstOrDefault();


                    cd_a.CambiaEstatusActividad("R", "Envío a revisión", acte.IdActividad, long.Parse(acte.IdUsuarioAsignado.ToString()), Conexion);
                }




                    contexto.SaveChanges();


             }

            return true;
        }


        public bool CambiaEstatusCP(long IdCicloP, string Estatus, string Conexion)
        {
            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    var i = contexto.CicloPrueba.Where(w => w.IdCicloP == IdCicloP).FirstOrDefault();

                    i.Estatus = Estatus;


                    contexto.SaveChanges();


                }

                return true;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public int  EliminarCicloCaso(long IdCicloCaso , string Conexion)
        {

            try
            {
                using(var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    var cc = contexto.CicloPrueba_CasosPrueba.Where(w=> w.IdCicloCaso ==  IdCicloCaso).FirstOrDefault();

                    if(cc.EstatusP != "A")
                    {

                        return 2;
                    }

                    // Cancelo la actividad relacionada

                    if(cc.IdActividadEjecucion != null)
                    {
                        cc.Actividad1.Estatus = "C";
                        cc.Actividad1.IdWorkflow = contexto.WorkFlow.Where(w => w.IdProyecto == cc.Actividad1.IdProyecto && w.IdActividadTipo == cc.Actividad1.TipoId && w.EstatusR == "A").FirstOrDefault().IdWorkFlow;

                    }
                  


                    //Elimino el registro
                    contexto.CicloPrueba_CasosPrueba.Remove(cc);

                    contexto.SaveChanges();


                }




                return 1;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public void LeerBugsV2(ref List<ActividadesModel> LstActividades, ref List<GraficaConsultaModel> LstGraficas, FiltrosModel filtros, UsuarioModel usuario, string conexionSP)
        {
            DataSet dataSet = new DataSet();

            SqlConnection sqlcon = new SqlConnection(conexionSP);
            SqlCommand sqlcmd;

            sqlcmd = new SqlCommand("PanelBugs_spV2", sqlcon)
            {
                CommandType = CommandType.StoredProcedure
            };

           
            sqlcmd.Parameters.AddWithValue("@Proyecto", filtros.Proyecto);
            sqlcmd.Parameters.AddWithValue("@FechaIni", filtros.FechaSolIni);
            sqlcmd.Parameters.AddWithValue("@FechaFin", filtros.FechaSolFin);
            sqlcmd.Parameters.AddWithValue("@UsuarioAsignado", filtros.Asignado);
            sqlcmd.Parameters.AddWithValue("@UsuarioResponsable", filtros.Responsable);
            sqlcmd.Parameters.AddWithValue("@Estatus", filtros.Estatus);
            sqlcmd.Parameters.AddWithValue("@Clasificacion", filtros.Clasificacion);
            sqlcmd.Parameters.AddWithValue("@IdUsuario", usuario.IdUsuario);
            sqlcmd.Parameters.AddWithValue("@TipoUsuario", usuario.IdTipoUsuario);


      

            SqlDataAdapter adapter = new SqlDataAdapter(sqlcmd);
            adapter.Fill(dataSet);
            adapter.Dispose();

            sqlcmd.Connection.Close();
            sqlcmd.Connection.Dispose();
            sqlcmd.Dispose();

            var dtActividades = dataSet.Tables[0];

            LstActividades = (from row in dtActividades.AsEnumerable()
                 select (
                 new ActividadesModel
                 {
                     IdActividad = long.Parse(row["IdActividad"].ToString()),
                     IdActividadStr = row["IdActividadStr"].ToString(),
                     IdProyecto = long.Parse(row["IdProyecto"].ToString()),
                     Estatus = row["Estatus"].ToString(),
                     EstatusStr = row["EstatusStr"].ToString(),
                     BR = row["BR"].ToString(),
                     Descripcion = row["BR"].ToString(),
                     ClaveClasificacionActividad = row["ClaveClasificacionActividad"].ToString(),
                     ClasificacionStr = row["Clasificacion"].ToString(),
                     PrioridadStr = row["PrioridadStr"].ToString(),
                     AsignadoStr = row["Asignado"].ToString(),
                     AsignadoPath = "/Archivos/Fotos/" + row["CveAsignado"].ToString() + ".jpg",
                     ResponsableStr = row["Responsable"].ToString(),
                     //ResponsablePath = "/Archivos/Fotos/" + row["CveResponsable"].ToString() + ".jpg",
                     ProyectoStr = row["Proyecto"].ToString(),
                     FechaCreo = DateTime.Parse(row["FechaCreo"].ToString()),
                     FechaTermino = row["FechaTermino"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaTermino"].ToString()),
                     HorasFacturables = row["HorasFacturables"].ToString() == "" ? (decimal?)null : Convert.ToDecimal(row["HorasFacturables"].ToString()),
                     HorasAsignadas = row["HorasAsignadas"].ToString() == "" ? (decimal?)null : Convert.ToDecimal(row["HorasAsignadas"].ToString()),
                     HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),
                     MotivoRechazoId = row["MotivoRechazoId"].ToString() == "" ? (long?)null : long.Parse(row["MotivoRechazoId"].ToString()),
                     DescripcionRechazo = row["DescripcionRechazo"].ToString(),
                     PSP = int.Parse(row["PSP"].ToString()),
                     ClaveTipoActividad = row["ClaveTipoActividad"].ToString(),
                     TipoActividadStr = row["TipoActividad"].ToString(),
                     ClaveUsuario = row["CveAsignado"].ToString(),
                     ResponsablePath = row["CveResponsable"].ToString(),
                     FechaSolicitado = row["FechaSolicitado"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaSolicitado"].ToString()),

                     Sprint = row["Sprint"].ToString(),

                 })).OrderBy(o => o.Prioridad).ToList();


            var dt = new DataTable();


            var gr = new GraficaConsultaModel();

            dt = dataSet.Tables[1];

            gr.id = Guid.NewGuid();
            gr.Nombre = "EstatusBugs";
            gr.Tipo = "Pie";

            var Lst = (from row in dt.AsEnumerable() select (new GraficaModel { name = row["Indicador"].ToString() + " " + row["Resultado"].ToString(), value = double.Parse(row["Resultado"].ToString()) })).ToList();
            gr.LstValores = JsonConvert.SerializeObject(Lst);
            gr.Series = JsonConvert.SerializeObject(Lst.Select(s => s.name).ToList());

            LstGraficas.Add(gr);

            

          
        }


        public void LeerBugsCP(ref List<ActividadesModel> LstActividades, ref List<GraficaConsultaModel> LstGraficas, long IdProyecto,  string conexionSP)
        {
            DataSet dataSet = new DataSet();

            SqlConnection sqlcon = new SqlConnection(conexionSP);
            SqlCommand sqlcmd;

            sqlcmd = new SqlCommand("PanelBugs_CP", sqlcon)
            {
                CommandType = CommandType.StoredProcedure
            };


            sqlcmd.Parameters.AddWithValue("@IdProyecto", IdProyecto);



            SqlDataAdapter adapter = new SqlDataAdapter(sqlcmd);
            adapter.Fill(dataSet);
            adapter.Dispose();

            sqlcmd.Connection.Close();
            sqlcmd.Connection.Dispose();
            sqlcmd.Dispose();

            var dtActividades = dataSet.Tables[0];

            LstActividades = (from row in dtActividades.AsEnumerable()
                              select (
                              new ActividadesModel
                              {
                                  IdActividad = long.Parse(row["IdActividad"].ToString()),
                                  IdActividadStr = row["IdActividadStr"].ToString(),
                                  IdProyecto = long.Parse(row["IdProyecto"].ToString()),
                                  Estatus = row["Estatus"].ToString(),
                                  EstatusStr = row["EstatusStr"].ToString(),
                                  BR = row["BR"].ToString(),
                                  Descripcion = row["Descripcion"].ToString(),
                                  ClaveClasificacionActividad = row["ClaveClasificacionActividad"].ToString(),
                                  ClasificacionStr = row["Clasificacion"].ToString(),
                                  PrioridadStr = row["PrioridadStr"].ToString(),
                                  AsignadoStr = row["Asignado"].ToString(),
                                  AsignadoPath = "/Archivos/Fotos/" + row["CveAsignado"].ToString() + ".jpg",
                                  ResponsableStr = row["Responsable"].ToString(),
                                  ResponsablePath = "/Archivos/Fotos/" + row["CveResponsable"].ToString() + ".jpg",
                                  ProyectoStr = row["Proyecto"].ToString(),
                                  FechaCreo = DateTime.Parse(row["FechaCreo"].ToString()),
                                  FechaTermino = row["FechaTermino"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaTermino"].ToString()),
                                  HorasFacturables = row["HorasFacturables"].ToString() == "" ? (decimal?)null : Convert.ToDecimal(row["HorasFacturables"].ToString()),
                                  HorasAsignadas = row["HorasAsignadas"].ToString() == "" ? (decimal?)null : Convert.ToDecimal(row["HorasAsignadas"].ToString()),
                                  HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),
                                  MotivoRechazoId = row["MotivoRechazoId"].ToString() == "" ? (long?)null : long.Parse(row["MotivoRechazoId"].ToString()),
                                  DescripcionRechazo = row["DescripcionRechazo"].ToString(),
                                  PSP = int.Parse(row["PSP"].ToString()),
                                  TipoActividadId = long.Parse(row["TipoActividadId"].ToString())
                              })).OrderBy(o => o.Prioridad).ToList();


            var dt = new DataTable();


            var gr = new GraficaConsultaModel();

            dt = dataSet.Tables[1];

            gr.id = Guid.NewGuid();
            gr.Nombre = "EstatusBugs";
            gr.Tipo = "Pie";

            var Lst = (from row in dt.AsEnumerable() select (new GraficaModel { name = row["Indicador"].ToString() + " " + row["Resultado"].ToString(), value = double.Parse(row["Resultado"].ToString()) })).ToList();
            gr.LstValores = JsonConvert.SerializeObject(Lst);
            gr.Series = JsonConvert.SerializeObject(Lst.Select(s => s.name).ToList());

            LstGraficas.Add(gr);




        }


        public List<ActividadesModel> LeerBugsCicloReport(long IdCicloP, string Estatus, string conexionSP)
        {
            try
            {

         

            List<ActividadesModel> LstActividades = new List<ActividadesModel>();

            DataSet dataSet = new DataSet();

            SqlConnection sqlcon = new SqlConnection(conexionSP);
            SqlCommand sqlcmd;

            sqlcmd = new SqlCommand("spCicloPrueba_Bugs", sqlcon)
            {
                CommandType = CommandType.StoredProcedure
            };



            sqlcmd.Parameters.AddWithValue("@IdCicloP", IdCicloP);
            sqlcmd.Parameters.AddWithValue("@Estatus", Estatus);




            SqlDataAdapter adapter = new SqlDataAdapter(sqlcmd);
            adapter.Fill(dataSet);
            adapter.Dispose();

            sqlcmd.Connection.Close();
            sqlcmd.Connection.Dispose();
            sqlcmd.Dispose();

            var dtActividades = dataSet.Tables[0];

            LstActividades = (from row in dtActividades.AsEnumerable()
                              select (
                              new ActividadesModel
                              {
                                  IdActividad = long.Parse(row["IdActividad"].ToString()),
                                  IdActividadStr = row["IdActividadStr"].ToString(),
                                  Estatus = row["Estatus"].ToString(),
                                  EstatusStr = row["EstatusStr"].ToString(),
                                  BR = row["BR"].ToString(),
                                  Descripcion = row["Descripcion"].ToString(),
                                  ClaveClasificacionActividad = row["ClaveClasificacionActividad"].ToString(),
                                  ClasificacionStr = row["Clasificacion"].ToString(),
                                  AsignadoStr = row["Asignado"].ToString(),
                                  AsignadoPath = "/Archivos/Fotos/" + row["CveAsignado"].ToString() + ".jpg",
                              })).OrderBy(o => o.Prioridad).ToList();



            return LstActividades;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public List<CasoPruebaModel> ConsultaEjecucionesCP(long IdActividad, string Conexion)
        {
            try
            {



                List<CasoPruebaModel> Lst = new List<CasoPruebaModel>();
                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spConsultaEjecucionesCP", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdActividad", IdActividad);


                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
                da.Fill(ds);
                da.Dispose();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();

                Lst = (from row in ds.Tables[0].AsEnumerable()
                       select (
                       new CasoPruebaModel
                       {
                           IdCicloP = long.Parse(row["IdCicloP"].ToString()),
                           IdCicloCaso = long.Parse(row["IdCicloCaso"].ToString()),
                           NombreCP = row["Nombre"].ToString(),
                           FechaEjecucion = row["FechaEjecucion"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaEjecucion"].ToString()),
                           EstatusP = row["EstatusP"].ToString(),
                           EstatusStr = row["EstatusStr"].ToString(),
                           Asignado = row["Asignado"].ToString(),
                           AsignadoPath = row["NumEmpleado"].ToString(),

                       })).ToList();



                return Lst;

            }
            catch (Exception ex)
            {

                throw ex;
            }



        }


    }
}
