using System;
using System.Collections.Generic;
using System.Linq;
using CapaDatos.DataBaseModel;
using CapaDatos.Models;
using System.Data;
using System.Data.SqlClient;
using System.Security.Policy;
using Newtonsoft.Json;
using System.Collections;

namespace CapaDatos
{
    public class CD_Dashboard
    {

        public List<UsuarioModel> ObtieneCumplimientoCaptura(string Conexion) {
            try
            {


                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spObtieneCumplimientoCaptura", sqlcon);
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
                                       NumEmpleado = row["NumEmpleado"].ToString(),
                                       NombreCompleto = row["Nombre"].ToString(),
                                       FechaUltCaptura = DateTime.Parse(row["FechaUltCaptura"].ToString()),
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
                ;
                throw ex;
            }

        }
        public List<ProyectosModel> ObtieneEstatusProyectos(string Conexion) {

            try
            {
                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                //SqlCommand sqlcmd = new SqlCommand("spConsultaEstatusProyectos", sqlcon);
                //sqlcmd.CommandType = CommandType.StoredProcedure;

                SqlCommand sqlcmd = new SqlCommand("spResumenProyecto", sqlcon);
                sqlcmd.Parameters.AddWithValue("@FechaCorte", DateTime.Now);
                sqlcmd.Parameters.AddWithValue("@IdUlider", (long?)null);
                sqlcmd.Parameters.AddWithValue("@DepartamentoId", 9);
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

                                    Clave = row["Clave"].ToString(),
                                    Nombre = row["Nombre"].ToString(),
                                    Descripcion = row["Descripcion"].ToString(),
                                    Lider = row["Lider"].ToString(),
                                    Avance = decimal.Parse(row["AvanceComprometido"].ToString()),
                                    AvanceReal = decimal.Parse(row["AvanceRealPorc"].ToString()),
                                    Semaforo = row["Semaforo"].ToString()
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
        public void ObtieneRockStarTeam(ref List<UsuarioModel> LstMesActual, ref List<UsuarioModel> LstMesAnterior, ref List<UsuarioModel> LstHistorico, DateTime? FechaInicio, DateTime? FechaFin, string Conexion) {
            try
            {

                //var con = new SqlConnection(Conexion);
                //con.Open();

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spObtieneRockStarTeam", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@FechaInicio", FechaInicio);
                sqlcmd.Parameters.AddWithValue("@FechaActual", FechaFin == null ? DateTime.Now.Date : FechaFin);
                sqlcmd.Parameters.AddWithValue("@IdUsuario", null);


                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();




                var dtactual = new DataTable();
                var dtant = new DataTable();
                var dthist = new DataTable();

                dtactual = ds.Tables[0];
                dtant = ds.Tables[1];
                dthist = ds.Tables[2];

                LstMesActual = (from row in dtactual.AsEnumerable()
                                select (new UsuarioModel
                                {
                                    NumEmpleado = row["NumEmpleado"].ToString(),
                                    NombreCompleto = row["Nombre"].ToString(),
                                    Productividad = decimal.Parse(row["Productividad"].ToString())
                                })).ToList();

                LstMesAnterior = (from row in dtant.AsEnumerable()
                                  select (new UsuarioModel
                                  {
                                      NumEmpleado = row["NumEmpleado"].ToString(),
                                      NombreCompleto = row["Nombre"].ToString(),
                                      Productividad = decimal.Parse(row["Productividad"].ToString())
                                  })).ToList();

                LstHistorico = (from row in dthist.AsEnumerable()
                                select (new UsuarioModel
                                {
                                    NumEmpleado = row["NumEmpleado"].ToString(),
                                    NombreCompleto = row["Nombre"].ToString(),
                                    Productividad = decimal.Parse(row["Productividad"].ToString())
                                })).ToList();


                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();
                sqlcon.Close();
                //con.Close();

            }
            catch (Exception ex)
            {

                throw ex;
            }


        }
        public ControlAsistenciaModel ObtieneDashboardAsistencia ( ControlAsistenciaModel ca, string Conexion)
        {

            try
            {
                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spControlAsistencia", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@Fecha", ca.Fecha);
                sqlcmd.Parameters.AddWithValue("@IdUsuario",  ca.IdUsuario);
         

                sqlcmd.CommandType = CommandType.StoredProcedure;

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();

                ControlAsistenciaModel indicadores = new ControlAsistenciaModel();
    


                var dt = new DataTable();
                var dt2 = new DataTable();
                dt = ds.Tables[0];
                dt2 = ds.Tables[1];

                indicadores.Recursos = int.Parse(dt.Rows[0]["Recursos"].ToString());
                indicadores.EnLinea = int.Parse(dt.Rows[0]["EnLinea"].ToString());
                indicadores.Desconectado = int.Parse(dt.Rows[0]["Desconectado"].ToString());
                indicadores.Ausente = int.Parse(dt.Rows[0]["Ausente"].ToString());
                indicadores.Retrasos = int.Parse(dt.Rows[0]["Retrasos"].ToString());
                indicadores.Incidencias = int.Parse(dt.Rows[0]["Incidencias"].ToString());

                indicadores.LstAsistencia = (from row in dt2.AsEnumerable()
                                             select (new UsuarioAsistenciaModel
                                             {
                                                 IdUsuario = int.Parse(row["IdUsuario"].ToString()),

                                                 Clave = row["NumEmpleado"].ToString(),
                                                 Recurso = row["Recurso"].ToString(),
                                                 Estatus = row["Estatus"].ToString(),
                                                 Retraso = int.Parse(row["Retraso"].ToString()),
                                                 Incidencias = int.Parse(row["Incidencias"].ToString()),
                                                 IncidenciasStr = row["IncidenciasStr"].ToString(),
                                                 TiempoRetraso = int.Parse(row["TiempoRetraso"].ToString()),
                                                 ToleranciaComida = decimal.Parse(row["ToleranciaComida"].ToString()),
                                                 TiempoComida = decimal.Parse(row["TiempoComida"].ToString()),
                                                 //Fecha = row["HoraEntrada"].ToString() == "" ? (DateTime?)null  :  DateTime.Parse(row["Fecha"].ToString()),
                                                 HoraEntrada = row["HoraEntrada"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["HoraEntrada"].ToString()),
                                                 HoraSalidaComer = row["HoraSalidaComer"].ToString() == "" ? (DateTime?)null :  DateTime.Parse(row["HoraSalidaComer"].ToString()),
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

        public void ConsultaIndicadoresEficiencia(int Mes, int Anio, ref IndicadoresModel I, ref GraficaConsultaModel G, string Conexion) {
            try
            {
                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spIndicadoresPerformance", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@Anio", Anio);
                sqlcmd.Parameters.AddWithValue("@Mes", Mes);


                sqlcmd.CommandType = CommandType.StoredProcedure;

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();

                var dtI = ds.Tables[0];

                I.Objetivo = double.Parse(dtI.Rows[0]["BaseInstalada"].ToString());
                I.HorasProductivas = double.Parse(dtI.Rows[0]["ValorGanado"].ToString());
                I.HorasReportadas = double.Parse(dtI.Rows[0]["Trabajadas"].ToString());
                I.HorasDefectos = double.Parse(dtI.Rows[0]["HorasDefectos"].ToString());
                I.PorcCaptura = double.Parse(dtI.Rows[0]["Captura"].ToString());
                I.Bugs = int.Parse(dtI.Rows[0]["NumDefectos"].ToString());
                I.Productividad = double.Parse(dtI.Rows[0]["Rendimiento"].ToString());
                I.Calidad = decimal.Parse(dtI.Rows[0]["Calidad"].ToString());
                I.OEE = decimal.Parse(dtI.Rows[0]["EficienciaOperacion"].ToString());

                //var dtIA = ds.Tables[1];
                //I.ProductividadAnual = double.Parse(dtIA.Rows[0]["Rendimiento"].ToString());
                //I.CalidadAnual = decimal.Parse(dtIA.Rows[0]["Calidad"].ToString());
                //I.OEEAnual = decimal.Parse(dtIA.Rows[0]["EficienciaOperacion"].ToString());


                var dt = ds.Tables[2];

                G.id = Guid.NewGuid();
                G.Nombre = "Avance de proyecto";
                G.Tipo = "line";


                //gr.Nombre = 00
                //gr.Tipo = dt.Rows[0][1].ToString();


                //Valores de las series
                var lst = (from row in dt.AsEnumerable() select row[2].ToString()).ToList();

                //Valores de las columnas
                List<string> columns = new List<string>();
                for (int i = 3; i < dt.Columns.Count; i++)
                {
                    columns.Add(dt.Columns[i].ColumnName.ToString());
                }

                //Valores de data
                List<GraficaBarraModel> lstval = new List<GraficaBarraModel>();
                GraficaBarraModel gbm;
                List<string> datos;
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    gbm = new GraficaBarraModel();
                    datos = new List<string>();
                    gbm.name = dt.Rows[i][2].ToString();
                    gbm.type = dt.Rows[i][1].ToString();
                    gbm.yAxisIndex = int.Parse(dt.Rows[i][3].ToString());

                    for (int j = 3; j < dt.Columns.Count; j++)
                    {
                        datos.Add(dt.Rows[i][j].ToString());
                    }

                    gbm.data = datos;

                    lstval.Add(gbm);
                }

                G.LstValores = JsonConvert.SerializeObject(lstval);
                G.LstColumnas = JsonConvert.SerializeObject(columns);
                G.Series = JsonConvert.SerializeObject(lst);
                //G.Tabla = ConvertirDatos.GenerarTablaHtml(dt);

                //Grafica = gr;


            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        
        public void ConsultaIndicadoresFinancieros(int Mes, int Anio, ref IndicadoresFinancierosModel I, ref GraficaConsultaModel G, string Conexion)
        {
            try
            {
                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spIndicadoresFinancieros", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@Anio", Anio);
                sqlcmd.Parameters.AddWithValue("@Mes", Mes);


                sqlcmd.CommandType = CommandType.StoredProcedure;

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();

                var dtI = ds.Tables[0];

                I.Ingresos = double.Parse(dtI.Rows[0]["Ingreso"].ToString());
                I.Costos = decimal.Parse(dtI.Rows[0]["Costos"].ToString());
                I.Rentabilidad = decimal.Parse(dtI.Rows[0]["Rentabilidad"].ToString());

                var dtIA = ds.Tables[1];
                I.IngresosAnual = double.Parse(dtIA.Rows[0]["Ingreso"].ToString());
                I.CostosAnual = decimal.Parse(dtIA.Rows[0]["Costos"].ToString());
                I.RentabilidadAnual = decimal.Parse(dtIA.Rows[0]["Rentabilidad"].ToString());


                var dt = ds.Tables[2];

                G.id = Guid.NewGuid();
                G.Nombre = "Avance de proyecto";
                G.Tipo = "line";


                //gr.Nombre = 00
                //gr.Tipo = dt.Rows[0][1].ToString();


                //Valores de las series
                var lst = (from row in dt.AsEnumerable() select row[2].ToString()).ToList();

                //Valores de las columnas
                List<string> columns = new List<string>();
                for (int i = 4; i < dt.Columns.Count; i++)
                {
                    columns.Add(dt.Columns[i].ColumnName.ToString());
                }

                //Valores de data
                List<GraficaBarraModel> lstval = new List<GraficaBarraModel>();
                GraficaBarraModel gbm;
                List<string> datos;
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    gbm = new GraficaBarraModel();
                    datos = new List<string>();
                    gbm.name = dt.Rows[i][2].ToString();
                    gbm.type = dt.Rows[i][1].ToString();
                    gbm.yAxisIndex =int.Parse( dt.Rows[i][3].ToString());

                    for (int j = 4; j < dt.Columns.Count; j++)
                    {
                        datos.Add(dt.Rows[i][j].ToString());
                    }

                    gbm.data = datos;

                    lstval.Add(gbm);
                }

                G.LstValores = JsonConvert.SerializeObject(lstval);
                G.LstColumnas = JsonConvert.SerializeObject(columns);
                G.Series = JsonConvert.SerializeObject(lst);
                //G.Tabla = ConvertirDatos.GenerarTablaHtml(dt);

                //Grafica = gr;


            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public void ConsultaIndicadoresCalidad(int Mes, int Anio,int? IdProyecto,  ref IndicadoresModel I, ref GraficaConsultaModel G, string Conexion)
        {
            try
            {
                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spIndicadoresCalidad", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@Anio", Anio);
                sqlcmd.Parameters.AddWithValue("@Mes", Mes);
                sqlcmd.Parameters.AddWithValue("@IdProyecto", IdProyecto ==  -1  ? null : IdProyecto);

                sqlcmd.CommandType = CommandType.StoredProcedure;

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();

                var dtI = ds.Tables[0];

                I.Calidad = decimal.Parse(dtI.Rows[0]["Calidad"].ToString());
                I.Bugs = int.Parse(dtI.Rows[0]["Total"].ToString());
                I.Densidad = decimal.Parse(dtI.Rows[0]["Defectos"].ToString());

                var dtIA = ds.Tables[1];
                I.CalidadAnual = decimal.Parse(dtIA.Rows[0]["Calidad"].ToString());
                I.BugsAnual = int.Parse(dtIA.Rows[0]["Total"].ToString());
                I.DensidadAnual = decimal.Parse(dtIA.Rows[0]["Defectos"].ToString());


                var dt = ds.Tables[2];

                G.id = Guid.NewGuid();
                G.Nombre = "Avance de proyecto";
                G.Tipo = "line";


                //gr.Nombre = 00
                //gr.Tipo = dt.Rows[0][1].ToString();


                //Valores de las series
                var lst = (from row in dt.AsEnumerable() select row[2].ToString()).ToList();

                //Valores de las columnas
                List<string> columns = new List<string>();
                for (int i = 4; i < dt.Columns.Count; i++)
                {
                    columns.Add(dt.Columns[i].ColumnName.ToString());
                }

                //Valores de data
                List<GraficaBarraModel> lstval = new List<GraficaBarraModel>();
                GraficaBarraModel gbm;
                List<string> datos;
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    gbm = new GraficaBarraModel();
                    datos = new List<string>();
                    gbm.name = dt.Rows[i][2].ToString();
                    gbm.type = dt.Rows[i][1].ToString();
                    gbm.yAxisIndex = int.Parse(dt.Rows[i][3].ToString());

                    for (int j = 4; j < dt.Columns.Count; j++)
                    {
                        datos.Add(dt.Rows[i][j].ToString());
                    }

                    gbm.data = datos;

                    lstval.Add(gbm);
                }

                G.LstValores = JsonConvert.SerializeObject(lstval);
                G.LstColumnas = JsonConvert.SerializeObject(columns);
                G.Series = JsonConvert.SerializeObject(lst);
                G.Tabla = ConvertirDatos.GenerarTablaHtml(dt);

                //Grafica = gr;


            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public List<CicloPruebaModel> ConsultaCiclosPrueba(long? IdProyecto, long IdUsuario, long IdTipoUsuario,  string Conexion)
        {
            try
            {



                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spCiclosPruebaDashboard", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdProyecto", IdProyecto == -1 ? null : IdProyecto);
                sqlcmd.Parameters.AddWithValue("@IdUsuario", IdUsuario);
                sqlcmd.Parameters.AddWithValue("@IdTipoUsuario", IdTipoUsuario);

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

        public GraficaConsultaModel GraficaEstatusCP(long? IdProyecto, long IdUsuario, long IdTipoUsuario, string Conexion)
        {
            try
            {
                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spGraficaEstatusCP", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdUsuario", IdUsuario);
                sqlcmd.Parameters.AddWithValue("@IdTipoUsuario", IdTipoUsuario);
                sqlcmd.Parameters.AddWithValue("@IdProyecto", IdProyecto == -1 ? null : IdProyecto);

                sqlcmd.CommandType = CommandType.StoredProcedure;

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();


                GraficaConsultaModel G = new GraficaConsultaModel();

                var dt = ds.Tables[0];

                G.id = Guid.NewGuid();
                G.Nombre = "Estatus casos de prueba";
                G.Tipo = "line";


                //gr.Nombre = 00
                //gr.Tipo = dt.Rows[0][1].ToString();


                //Valores de las series
                var lst = (from row in dt.AsEnumerable() select row[2].ToString()).ToList();

                //Valores de las columnas
                List<string> columns = new List<string>();
                for (int i = 4; i < dt.Columns.Count; i++)
                {
                    columns.Add(dt.Columns[i].ColumnName.ToString());
                }

                //Valores de data
                List<GraficaBarraModel> lstval = new List<GraficaBarraModel>();
                GraficaBarraModel gbm;
                List<string> datos;
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    gbm = new GraficaBarraModel();
                    datos = new List<string>();
                    gbm.name = dt.Rows[i][2].ToString();
                    gbm.type = dt.Rows[i][1].ToString();
                    //gbm.yAxisIndex = int.Parse(dt.Rows[i][3].ToString());

                    for (int j = 4; j < dt.Columns.Count; j++)
                    {
                        datos.Add(dt.Rows[i][j].ToString());
                    }

                    gbm.data = datos;

                    lstval.Add(gbm);
                }

                G.LstValores = JsonConvert.SerializeObject(lstval);
                G.LstColumnas = JsonConvert.SerializeObject(columns);
                G.Series = JsonConvert.SerializeObject(lst);
                //G.Tabla = ConvertirDatos.GenerarTablaHtml(dt);

                return G;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public List<GraficaConsultaModel> ConsultarGraficasPastelQA(long? IdProyecto, long IdUsuario, long IdTipoUsuario, string Conexion)
        {
            try
            {


                List<GraficaConsultaModel> LstGraficas = new List<GraficaConsultaModel>();

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spGraficasQA", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdUsuario", IdUsuario);
                sqlcmd.Parameters.AddWithValue("@IdTipoUsuario", IdTipoUsuario);
                sqlcmd.Parameters.AddWithValue("@IdProyecto", IdProyecto == -1 ? null : IdProyecto);
                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);


                da.Fill(ds);
                da.Dispose();

                GraficaConsultaModel gr;
                var dt = new DataTable();
                foreach (DataTable d in ds.Tables)
                {
                    gr = new GraficaConsultaModel();

                    dt = d;

                    gr.id = Guid.NewGuid();
                    gr.Nombre = dt.Rows[0][0].ToString();
                    gr.Tipo = dt.Rows[0][1].ToString();

                    var Lst = (from row in dt.AsEnumerable() select (new GraficaModel { name = row["Indicador"].ToString() + " " + row["Resultado"].ToString(), value = double.Parse(row["Resultado"].ToString()) })).ToList();
                    gr.LstValores = JsonConvert.SerializeObject(Lst);
                    gr.Series = JsonConvert.SerializeObject(Lst.Select(s => s.name).ToList());

                    LstGraficas.Add(gr);

                }



                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();
                sqlcon.Close();
                //con.Close();

                return LstGraficas;

            }
            catch (Exception ex)
            {

                throw ex;
            }


        }
        public GraficaConsultaModel GraficaVelocidad(long IdProyecto,  string Conexion)
        {
            try
            {
                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spGraficaVelocidad", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdProyecto", IdProyecto);

                sqlcmd.CommandType = CommandType.StoredProcedure;

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();


                GraficaConsultaModel G = new GraficaConsultaModel();

                var dt = ds.Tables[0];

                G.id = Guid.NewGuid();
                G.Nombre = "Velocidad";
                G.Tipo = "bar";


                //Valores de las series
                var lst = (from row in dt.AsEnumerable() select row[2].ToString()).ToList();

                //Valores de las columnas
                List<string> columns = new List<string>();
                for (int i = 4; i < dt.Columns.Count; i++)
                {
                    columns.Add(dt.Columns[i].ColumnName.ToString());
                }

                //Valores de data
                List<GraficaBarraModel> lstval = new List<GraficaBarraModel>();
                GraficaBarraModel gbm;
                GraficaLabelModel glm;
                List<string> datos;
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    gbm = new GraficaBarraModel();
                    glm = new GraficaLabelModel();
                    datos = new List<string>();
                    gbm.name = dt.Rows[i][2].ToString();
                    gbm.type = dt.Rows[i][1].ToString();
                    glm.show = true;
                    glm.position = "top";


                    gbm.label = glm;
                    //gbm.yAxisIndex = int.Parse(dt.Rows[i][3].ToString());

                    for (int j = 4; j < dt.Columns.Count; j++)
                    {
                        datos.Add(dt.Rows[i][j].ToString());
                    }

                    gbm.data = datos;

                    lstval.Add(gbm);
                }

                G.LstValores = JsonConvert.SerializeObject(lstval);
                G.LstColumnas = JsonConvert.SerializeObject(columns);
                G.Series = JsonConvert.SerializeObject(lst);
                //G.Tabla = ConvertirDatos.GenerarTablaHtml(dt);

                return G;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public GraficaConsultaModel GraficaHorasSprint(long IdProyecto, string Conexion)
        {
            try
            {
                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spGraficaVelocidad_HorasSprint", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdProyecto", IdProyecto);

                sqlcmd.CommandType = CommandType.StoredProcedure;

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();


                GraficaConsultaModel G = new GraficaConsultaModel();

                var dt = ds.Tables[0];

                G.id = Guid.NewGuid();
                G.Nombre = "Horas por Sprint";
                G.Tipo = "bar";


                //Valores de las series
                var lst = (from row in dt.AsEnumerable() select row[2].ToString()).ToList();

                //Valores de las columnas
                List<string> columns = new List<string>();
                for (int i = 4; i < dt.Columns.Count; i++)
                {
                    columns.Add(dt.Columns[i].ColumnName.ToString());
                }

                //Valores de data
                List<GraficaBarraModel> lstval = new List<GraficaBarraModel>();
                GraficaBarraModel gbm;
                GraficaLabelModel glm;
                List<string> datos;
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    gbm = new GraficaBarraModel();
                    glm = new GraficaLabelModel();
                    glm.show= true;
                    glm.position = "top";

                    datos = new List<string>();
                    gbm.name = dt.Rows[i][2].ToString();
                    gbm.type = dt.Rows[i][1].ToString();
                    gbm.label = glm;
                    //gbm.yAxisIndex = int.Parse(dt.Rows[i][3].ToString());

                    for (int j = 4; j < dt.Columns.Count; j++)
                    {
                        datos.Add(dt.Rows[i][j].ToString());
                    }

                    gbm.data = datos;

                    lstval.Add(gbm);
                }

                G.LstValores = JsonConvert.SerializeObject(lstval);
                G.LstColumnas = JsonConvert.SerializeObject(columns);
                G.Series = JsonConvert.SerializeObject(lst);
                //G.Tabla = ConvertirDatos.GenerarTablaHtml(dt);

                return G;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }


        #region PerfilUsuario

        public IndicadoresModel ConsultaIndicadoresRecurso(string Clave, int IdAnio, int IdMes, string Conexion)
        {
            try
            {

                IndicadoresModel i = new IndicadoresModel();
                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spConsultaIndicadoresMesIndividual_v2", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;

                sqlcmd.Parameters.AddWithValue("@NumEmpleado", Clave);
                sqlcmd.Parameters.AddWithValue("@IdAnio", IdAnio);
                sqlcmd.Parameters.AddWithValue("@IdMes", IdMes);

                sqlcmd.CommandType = CommandType.StoredProcedure;

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();

                var dtI = ds.Tables[0];

                i.IdUsuario = long.Parse(dtI.Rows[0]["IdUsuario"].ToString());
                i.Recurso = dtI.Rows[0]["NombreCompleto"].ToString();
                i.Objetivo = double.Parse(dtI.Rows[0]["EstandarMes"].ToString());
                i.ObjetivoActual = double.Parse(dtI.Rows[0]["EstandarAlDia"].ToString());
                i.Carga = double.Parse(dtI.Rows[0]["CargaTrabajo"].ToString());
                i.CargaPorc = double.Parse(dtI.Rows[0]["CargTrabajoPorc"].ToString());
                i.HorasProductivas = double.Parse(dtI.Rows[0]["Avance"].ToString());
                i.Productividad = double.Parse(dtI.Rows[0]["ProductividadDia"].ToString());
                i.ProductividadMes = double.Parse(dtI.Rows[0]["ProductividadMes"].ToString());
                i.HorasReportadas = double.Parse(dtI.Rows[0]["Capturadas"].ToString());
                i.FechaActualizacion = DateTime.Parse(dtI.Rows[0]["UltActualizacion"].ToString());
                i.Capturas = int.Parse(dtI.Rows[0]["Capturas"].ToString());
                i.PorcCaptura = double.Parse(dtI.Rows[0]["PorcCaptura"].ToString());
                i.Bugs = int.Parse(dtI.Rows[0]["Defectos"].ToString());
                i.Liberadas = double.Parse(dtI.Rows[0]["Terminadas"].ToString());
                i.Estimadas= double.Parse(dtI.Rows[0]["PromedioDiario"].ToString());
                i.Proceso = double.Parse(dtI.Rows[0]["HorasPromedioDiario"].ToString());

                return i;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public List<ActividadComentarioModel> Notificaciones(long IdUsuario, string Conexion) {
            try
            {
                DataSet ds = new DataSet();
                List<ActividadComentarioModel> LstComentarios = new List<ActividadComentarioModel>();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spConsultaNotificacionesUsuario", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdUsuario", IdUsuario);
          
                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
                da.Fill(ds);
                da.Dispose();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();

                LstComentarios = (from row in ds.Tables[0].AsEnumerable()
                                  select (
                                  new ActividadComentarioModel
                                  {
                                      IdActividad = long.Parse(row["IdActividad"].ToString()),
                                      IdActividadStr = row["IdActividadStr"].ToString(),
                                      Comentario = row["Comentario"].ToString(),
                                      CveUsuario = row["NumEmpleado"].ToString(),
                                      IdUsuario = long.Parse(row["IdUsuario"].ToString()),
                                      IdUsuarioStr = row["Nombre"].ToString(),
                                      Fecha = DateTime.Parse(row["Fecha"].ToString())

                                  })).ToList();



                return LstComentarios;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public void ActividadesDashboard (long IdUsuario,   ref List<ActividadesModel> LstActividades, ref List<GraficaConsultaModel> LstGraficas, string Conexion) {

            try
            {

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spConsultaActividadesDashboard", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdUsuario", IdUsuario);



                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
                da.Fill(ds);
                da.Dispose();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();


                var LstAct = ds.Tables[2];
                var LstB = ds.Tables[1];
                var LstC = ds.Tables[0];

                LstActividades = (from row in LstAct.AsEnumerable()
                                  select (
                                  new ActividadesModel
                                  {
                                      IdActividad = long.Parse(row["IdActividad"].ToString()),
                                      IdActividadStr = row["IdActividadStr"].ToString(),
                                      Estatus = row["Estatus"].ToString(),
                                      BR = row["BR"].ToString(),
                                      FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
                                      FechaSolicitado = DateTime.Parse(row["FechaSolicitado"].ToString()),
                                  })).ToList();



                GraficaConsultaModel gr = new GraficaConsultaModel();


                gr.id = Guid.NewGuid();
                gr.Nombre = LstC.Rows[0][0].ToString();
                gr.Tipo = LstC.Rows[0][1].ToString();

                var Lst = (from row in LstC.AsEnumerable() select (new GraficaModel { name = row["Indicador"].ToString() + " " + row["Resultado"].ToString(), value = double.Parse(row["Resultado"].ToString()) })).ToList();
                gr.LstValores = JsonConvert.SerializeObject(Lst);
                gr.Series = JsonConvert.SerializeObject(Lst.Select(s => s.name).ToList());

                LstGraficas.Add(gr);


                GraficaConsultaModel gr2 = new GraficaConsultaModel();


                gr2.id = Guid.NewGuid();
                gr2.Nombre = LstB.Rows[0][0].ToString();
                gr2.Tipo = LstB.Rows[0][1].ToString();

                var Lst2 = (from row in LstB.AsEnumerable() select (new GraficaModel { name = row["Indicador"].ToString() + " " + row["Resultado"].ToString(), value = double.Parse(row["Resultado"].ToString()) })).ToList();
                gr2.LstValores = JsonConvert.SerializeObject(Lst2);
                gr2.Series = JsonConvert.SerializeObject(Lst2.Select(s => s.name).ToList());
                LstGraficas.Add(gr2);





            }
            catch (Exception ex)
            {

                throw;
            }
        
        }

        public List<ActividadesModel>  ActividadesDashboardLista(long IdUsuario,  string Conexion)
        {

            try
            {

                List<ActividadesModel> LstActividades = new List<ActividadesModel>();

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spObtieneActividadesInicioV3", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdUsuario", IdUsuario);



                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
                da.Fill(ds);
                da.Dispose();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();


                var LstAct = ds.Tables[0];


                LstActividades = (from row in LstAct.AsEnumerable()
                                  select (
                                  new ActividadesModel
                                  {
                                      IdActividad = long.Parse(row["IdActividad"].ToString()),
                                      IdActividadStr = row["IdActividadStr"].ToString(),
                                      Estatus = row["Estatus"].ToString(),
                                      EstatusStr = row["EstatusStr"].ToString(),
                                      BR = row["BR"].ToString(),
                                      FechaSolicitado = DateTime.Parse(row["FechaSolicitado"].ToString()),
                                      TipoId = byte.Parse(row["TipoId"].ToString()),
                                      TipoUrl = row["Url"].ToString(),
                                      Tipo = int.Parse(row["Tipo"].ToString())
                                  })).ToList();





                return LstActividades;



            }
            catch (Exception ex)
            {

                throw;
            }

        }

        public List<CalendarHeatMapModel> ConsultaHeatMap(long IdUsuario,int Tipo, string Conexion)
        {

            try
            {

                List<CalendarHeatMapModel> Lst = new List<CalendarHeatMapModel>();
                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spObtieneTiemposTrabajoV2", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
           
                sqlcmd.Parameters.AddWithValue("@IdAnio", DateTime.Now.Year);
                sqlcmd.Parameters.AddWithValue("@IdUsuario", IdUsuario);
                sqlcmd.Parameters.AddWithValue("@IdTipo", Tipo);

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();


                Lst = (from row in ds.Tables[0].AsEnumerable()
                                  select (
                                  new CalendarHeatMapModel
                                  {
                                      date = DateTime.Parse(row["Fecha"].ToString()).ToString("yyyy-M-d"),
                                      value = int.Parse(row["Cantidad"].ToString()),
                                  })).ToList();


                return Lst;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public List<CompensacionModel> ConsultaHistoricoBonos(long IdUsuario, string Conexion)
        {

            try
            {

                List<CompensacionModel> Lst = new List<CompensacionModel>();
                DataSet ds = new DataSet();


                using (var contexto = new BDProductividad_DEVEntities(Conexion)) { 
                
                
                Lst = contexto.HistoricoCompensacion.Where(w=> w.IdUsuario == IdUsuario).OrderByDescending(o=> o.FechaCorte).Take(10)
                       .Select(s=> new CompensacionModel { 
                       
                                    MesAnio =  s.IdAnio.ToString() + "/" + s.IdMes.ToString(),
                                     ProductividadTotal = s.Productividad,
                                    Bono = s.BonoCumplimiento + s.BonoHoras
                                }
                        ).ToList();
                
                }


                return Lst;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        #endregion

        #region Performance
        public GraficaConsultaModel ConsultaHistoricoPerformance(int Mes, int Anio,  string Conexion)
        {
            try
            {

                GraficaConsultaModel G = new  GraficaConsultaModel();
                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spIndicadorHistoricoPerformance", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@Anio", Anio);
                sqlcmd.Parameters.AddWithValue("@Mes", Mes);


                sqlcmd.CommandType = CommandType.StoredProcedure;

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();


                var dt = ds.Tables[0];

                G.id = Guid.NewGuid();
                G.Nombre = "Avance de proyecto";
                G.Tipo = "line";


                //gr.Nombre = 00
                //gr.Tipo = dt.Rows[0][1].ToString();


                //Valores de las series
                var lst = (from row in dt.AsEnumerable() select row[2].ToString()).ToList();

                //Valores de las columnas
                List<string> columns = new List<string>();
                for (int i = 4; i < dt.Columns.Count; i++)
                {
                    columns.Add(dt.Columns[i].ColumnName.ToString());
                }

                //Valores de data
                List<GraficaBarraModel> lstval = new List<GraficaBarraModel>();
                GraficaBarraModel gbm;
                List<string> datos;
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    gbm = new GraficaBarraModel();
                    datos = new List<string>();
                    gbm.name = dt.Rows[i][2].ToString();
                    gbm.type = dt.Rows[i][1].ToString();
                    gbm.yAxisIndex = int.Parse(dt.Rows[i][3].ToString());

                    for (int j = 4; j < dt.Columns.Count; j++)
                    {
                        datos.Add(dt.Rows[i][j].ToString());
                    }

                    gbm.data = datos;

                    lstval.Add(gbm);
                }

                G.LstValores = JsonConvert.SerializeObject(lstval);
                G.LstColumnas = JsonConvert.SerializeObject(columns);
                G.Series = JsonConvert.SerializeObject(lst);
                //G.Tabla = ConvertirDatos.GenerarTablaHtml(dt);

                //Grafica = gr;

                return G;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        #endregion
    }
}
