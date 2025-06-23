using CapaDatos.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;
using CapaDatos.DataBaseModel;
using Newtonsoft.Json;

namespace CapaDatos
{
    public class CD_Graficas
    {

        public List<CatalogoGeneralModel> ListadoGraficas(string Conexion)
        {
            try
            {
                List<CatalogoGeneralModel> lst = new List<CatalogoGeneralModel>();
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    var grf = contexto.Graficas.Where(i => i.Activo == true);

                    lst = (from g in grf
                           select (new CatalogoGeneralModel
                           {
                               IdCatalogo = g.IdGrafica,
                               DescLarga = g.Nombre
                           })).ToList();


                }

                return lst;

            }
            catch (Exception ex)
            {

                throw ex; 
            }
        }
        public int ConsultarGraficas(FiltrosModel filtros, string Conexion, ref List<GraficaConsultaModel> LstGraficas)
        {
            try
            {
                var Anios  = string.Join<string>(",", filtros.LstAnios.ConvertAll(s => s.ToString()));
                var Meses = string.Join<string>(",", filtros.LstMeses.ConvertAll(s => s.ToString()));
                var Recursos = string.Join<string>(",", filtros.LstRecursos.ConvertAll(s => s.ToString()));
                var Graficas = string.Join<string>(",", filtros.LstGraficas.ConvertAll(s => s.ToString()));

                //var con = new SqlConnection(Conexion);
                //con.Open();

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("SpGeneraGraficas_sp", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@Anios", Anios);
                sqlcmd.Parameters.AddWithValue("@Meses", Meses);
                sqlcmd.Parameters.AddWithValue("@Recursos", Recursos);
                sqlcmd.Parameters.AddWithValue("@Graficas", Graficas);
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

                    if (gr.Tipo == "Pie")
                    {

                        var Lst = (from row in dt.AsEnumerable() select (new GraficaModel { name = row["Indicador"].ToString() + " " + row["Resultado"].ToString(), value = double.Parse(row["Resultado"].ToString()) })).ToList();
                        gr.LstValores = JsonConvert.SerializeObject(Lst);
                        gr.Series = JsonConvert.SerializeObject(Lst.Select(s => s.name).ToList());
                    }
                    else if (gr.Tipo == "bar" || gr.Tipo =="line")
                    {

                        gr.Nombre = dt.Rows[0][0].ToString();
                        gr.Tipo = dt.Rows[0][1].ToString();


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

                            for (int j = 3; j < dt.Columns.Count; j++)
                            {
                                datos.Add(dt.Rows[i][j].ToString());
                            }

                            gbm.data = datos;

                            lstval.Add(gbm);
                        }

                        gr.LstValores = JsonConvert.SerializeObject(lstval);
                        gr.LstColumnas = JsonConvert.SerializeObject(columns);
                        gr.Series = JsonConvert.SerializeObject(lst);

                    }

                    gr.Tabla = ConvertirDatos.GenerarTablaHtml(dt);

                    LstGraficas.Add(gr);

                }



                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();
                sqlcon.Close();
                //con.Close();

                return 5;

            }
            catch (Exception ex)
            {
                
                throw ex;
            }


        }

        public GraficaConsultaModel ConsultarGraficaProductividadDiaria(string Conexion)
        {
            try
            {


              GraficaConsultaModel Grafica = new GraficaConsultaModel();

                //var con = new SqlConnection(Conexion);
                //con.Open();

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spObtienePromedioDiario", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@FechaIni", null);
                sqlcmd.Parameters.AddWithValue("@FechaFin", DateTime.Now);
    
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

                    if (gr.Tipo == "Pie")
                    {

                        var Lst = (from row in dt.AsEnumerable() select (new GraficaModel { name = row["Indicador"].ToString() + " " + row["Resultado"].ToString(), value = double.Parse(row["Resultado"].ToString()) })).ToList();
                        gr.LstValores = JsonConvert.SerializeObject(Lst);
                        gr.Series = JsonConvert.SerializeObject(Lst.Select(s => s.name).ToList());
                    }
                    else if (gr.Tipo == "bar" || gr.Tipo == "line")
                    {

                        gr.Nombre = dt.Rows[0][0].ToString();
                        gr.Tipo = dt.Rows[0][1].ToString();


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

                            for (int j = 3; j < dt.Columns.Count; j++)
                            {
                                datos.Add(dt.Rows[i][j].ToString());
                            }

                            gbm.data = datos;

                            lstval.Add(gbm);
                        }

                        gr.LstValores = JsonConvert.SerializeObject(lstval);
                        gr.LstColumnas = JsonConvert.SerializeObject(columns);
                        gr.Series = JsonConvert.SerializeObject(lst);

                    }

                    //gr.Tabla = ConvertirDatos.GenerarTablaHtml(dt);

                    Grafica = gr ;

                }
                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();
                sqlcon.Close();
                //con.Close();

                return Grafica;

            }
            catch (Exception ex)
            {

                throw ex;
            }


        }
        public GraficaConsultaModel ConsultarGraficaTiempoInvertido(string Conexion)
        {
            try
            {


                GraficaConsultaModel Grafica = new GraficaConsultaModel();

                //var con = new SqlConnection(Conexion);
                //con.Open();

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spObtieneTiempoPorActividad", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@FechaIni", null);
                sqlcmd.Parameters.AddWithValue("@FechaFin", DateTime.Now);

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

                    if (gr.Tipo == "Pie")
                    {

                        var Lst = (from row in dt.AsEnumerable() select (new GraficaModel { name = row["Indicador"].ToString() + " " + row["Resultado"].ToString(), value = double.Parse(row["Resultado"].ToString()) })).ToList();
                        gr.LstValores = JsonConvert.SerializeObject(Lst);
                        gr.Series = JsonConvert.SerializeObject(Lst.Select(s => s.name).ToList());
                    }
                    else if (gr.Tipo == "bar" || gr.Tipo == "line")
                    {

                        gr.Nombre = dt.Rows[0][0].ToString();
                        gr.Tipo = dt.Rows[0][1].ToString();


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

                            for (int j = 3; j < dt.Columns.Count; j++)
                            {
                                datos.Add(dt.Rows[i][j].ToString());
                            }

                            gbm.data = datos;

                            lstval.Add(gbm);
                        }

                        gr.LstValores = JsonConvert.SerializeObject(lstval);
                        gr.LstColumnas = JsonConvert.SerializeObject(columns);
                        gr.Series = JsonConvert.SerializeObject(lst);

                    }

                    //gr.Tabla = ConvertirDatos.GenerarTablaHtml(dt);

                    Grafica = gr;

                }

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();
                sqlcon.Close();
                //con.Close();

                return Grafica;

            }
            catch (Exception ex)
            {
                
                throw ex;
            }


        }


        public GraficaConsultaModel ConsultarGraficasTipo2(DateTime?  FechaInicio, DateTime? FechaFin, long? IdUsuario,string spname, string Conexion)
        {
            try
            {


                GraficaConsultaModel Grafica = new GraficaConsultaModel();

                //var con = new SqlConnection(Conexion);
                //con.Open();

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand(spname, sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@FechaIni", FechaInicio);
                sqlcmd.Parameters.AddWithValue("@FechaFin",   FechaFin == null ? DateTime.Now : FechaFin);
                sqlcmd.Parameters.AddWithValue("@IdUsuario", IdUsuario);

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

                    if (gr.Tipo == "Pie")
                    {

                        var Lst = (from row in dt.AsEnumerable() select (new GraficaModel { name = row["Indicador"].ToString() + " " + row["Resultado"].ToString(), value = double.Parse(row["Resultado"].ToString()) })).ToList();
                        gr.LstValores = JsonConvert.SerializeObject(Lst);
                        gr.Series = JsonConvert.SerializeObject(Lst.Select(s => s.name).ToList());
                    }
                    else if (gr.Tipo == "bar" || gr.Tipo == "line")
                    {

                        gr.Nombre = dt.Rows[0][0].ToString();
                        gr.Tipo = dt.Rows[0][1].ToString();


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

                            for (int j = 3; j < dt.Columns.Count; j++)
                            {
                                datos.Add(dt.Rows[i][j].ToString());
                            }

                            gbm.data = datos;

                            lstval.Add(gbm);
                        }

                        gr.LstValores = JsonConvert.SerializeObject(lstval);
                        gr.LstColumnas = JsonConvert.SerializeObject(columns);
                        gr.Series = JsonConvert.SerializeObject(lst);

                    }

                    //gr.Tabla = ConvertirDatos.GenerarTablaHtml(dt);

                    Grafica = gr;

                }
                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();
                sqlcon.Close();
                //con.Close();

                return Grafica;

            }
            catch (Exception ex)
            {
               
                throw ex;
            }


        }


        public GraficaConsultaModel ConsultarGraficasInicio(FiltrosModel Filtro, string spname, string Conexion)
        {
            try
            {


                GraficaConsultaModel Grafica = new GraficaConsultaModel();

                //var con = new SqlConnection(Conexion);
                //con.Open();

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand(spname, sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdMes", Filtro.Mes);
                sqlcmd.Parameters.AddWithValue("@IdAnio", Filtro.Anio);
                sqlcmd.Parameters.AddWithValue("@IdUsuarioConsulta", Filtro.IdUsuarioConsulta);
                sqlcmd.Parameters.AddWithValue("@IdUsuarioReporte", Filtro.IdUsuarioReporte);
                sqlcmd.Parameters.AddWithValue("@DepartamentoId", Filtro.DepartamentoId); ;

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

                    if (gr.Tipo == "Pie")
                    {

                        var Lst = (from row in dt.AsEnumerable() select (new GraficaModel { name = row["Indicador"].ToString() + " " + row["Resultado"].ToString(), value = double.Parse(row["Resultado"].ToString()) })).ToList();
                        gr.LstValores = JsonConvert.SerializeObject(Lst);
                        gr.Series = JsonConvert.SerializeObject(Lst.Select(s => s.name).ToList());
                    }
                    else if (gr.Tipo == "bar" || gr.Tipo == "line")
                    {

                        gr.Nombre = dt.Rows[0][0].ToString();
                        gr.Tipo = dt.Rows[0][1].ToString();


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

                            for (int j = 3; j < dt.Columns.Count; j++)
                            {
                                datos.Add(dt.Rows[i][j].ToString());
                            }

                            gbm.data = datos;

                            lstval.Add(gbm);
                        }

                        gr.LstValores = JsonConvert.SerializeObject(lstval);
                        gr.LstColumnas = JsonConvert.SerializeObject(columns);
                        gr.Series = JsonConvert.SerializeObject(lst);

                    }

                    //gr.Tabla = ConvertirDatos.GenerarTablaHtml(dt);

                    Grafica = gr;

                }

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();
                sqlcon.Close();
                //con.Close();

                return Grafica;

            }
            catch (Exception ex)
            {
               
                throw ex;
            }


        }

        public GraficaConsultaModel ConsultarGraficaAvanceProyecto(long IdProyecto,DateTime FechaCorte, string Conexion) {
            try
            {
                GraficaConsultaModel Grafica = new GraficaConsultaModel();

                //var con = new SqlConnection(Conexion);
                //con.Open();

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spGraficaAvanceProyecto", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdProyecto", IdProyecto);
                sqlcmd.Parameters.AddWithValue("@FechaCorte", FechaCorte);


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
                    gr.Nombre = "Avance de proyecto";
                    gr.Tipo = "line";


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

                            for (int j = 3; j < dt.Columns.Count; j++)
                            {
                                datos.Add(dt.Rows[i][j].ToString());
                            }

                            gbm.data = datos;

                            lstval.Add(gbm);
                        }

                        gr.LstValores = JsonConvert.SerializeObject(lstval);
                        gr.LstColumnas = JsonConvert.SerializeObject(columns);
                        gr.Series = JsonConvert.SerializeObject(lst);

                    

                    //gr.Tabla = ConvertirDatos.GenerarTablaHtml(dt);

                    Grafica = gr;

                }

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();
                sqlcon.Close();
                //con.Close();

                return Grafica;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public GraficaConsultaModel ConsultarGraficaCostoHoraProyecto(long IdProyecto, string Conexion)
        {
            try
            {
                GraficaConsultaModel Grafica = new GraficaConsultaModel();

                //var con = new SqlConnection(Conexion);
                //con.Open();

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spGraficaCostoMensualHoraProyecto", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdProyecto", IdProyecto);


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
                    gr.Nombre = "Costo por hora";
                    gr.Tipo = "line";


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

                        for (int j = 3; j < dt.Columns.Count; j++)
                        {
                            datos.Add(dt.Rows[i][j].ToString());
                        }

                        gbm.data = datos;

                        lstval.Add(gbm);
                    }

                    gr.LstValores = JsonConvert.SerializeObject(lstval);
                    gr.LstColumnas = JsonConvert.SerializeObject(columns);
                    gr.Series = JsonConvert.SerializeObject(lst);



                    gr.Tabla = ConvertirDatos.GenerarTablaHtml(dt);

                    Grafica = gr;

                }

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();
                sqlcon.Close();
                //con.Close();

                return Grafica;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }


        #region Workspace
        public List<PieChartModel> Grafica_SumByStatus(FiltrosModel Filtros, string Conexion)
        {
            try
            {


                List<PieChartModel> Lst = new List<PieChartModel>();

                var tipoactividad = string.Join<string>(",", Filtros.LstTipoActividad.ConvertAll(s => s.ToString()));
                var clasificacion = string.Join<string>(",", Filtros.LstClasificacion.ConvertAll(s => s.ToString()));
                var asignado = string.Join<string>(",", Filtros.LstAsignado.ConvertAll(s => s.ToString()));
                var responsable = string.Join<string>(",", Filtros.LstResponsable.ConvertAll(s => s.ToString()));
                var prioridad = string.Join<string>(",", Filtros.LstPrioridad.ConvertAll(s => s.ToString()));
                var sprint = string.Join<string>(",", Filtros.LstSprints.ConvertAll(s => s.ToString()));
                var estatus = string.Join<string>(",", Filtros.LstEstatusW.ConvertAll(s => s.ToString()));


                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("SpGraphics_ByStatus", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;

                sqlcmd.Parameters.AddWithValue("@IdProyecto", Filtros.IdProyecto);
                sqlcmd.Parameters.AddWithValue("@TipoId", Filtros.Tipo);
                sqlcmd.Parameters.AddWithValue("@FechaIni", Filtros.FechaSolIni);
                sqlcmd.Parameters.AddWithValue("@FechaFin", Filtros.FechaSolFin);
                sqlcmd.Parameters.AddWithValue("@Sprints", sprint);
                sqlcmd.Parameters.AddWithValue("@UsuarioAsignado", asignado);
                sqlcmd.Parameters.AddWithValue("@UsuarioResponsable", responsable);
                sqlcmd.Parameters.AddWithValue("@Fase", tipoactividad);
                sqlcmd.Parameters.AddWithValue("@Clasificacion", clasificacion);
                sqlcmd.Parameters.AddWithValue("@Prioridad", prioridad);
                sqlcmd.Parameters.AddWithValue("@WorkFlow", estatus);

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
                da.Fill(ds);
                da.Dispose();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();

                Lst = (from row in ds.Tables[0].AsEnumerable()
                       select (
                       new PieChartModel
                       {
                           name = row["name"].ToString(),
                           value = decimal.Parse(row["value"].ToString()),
                           color= row["color"].ToString()

                       })).ToList();


                return Lst;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }
        public List<PieChartModel> Grafica_SumByOwner(FiltrosModel Filtros, string Conexion)
        {
            try
            {


                List<PieChartModel> Lst = new List<PieChartModel>();

                var tipoactividad = string.Join<string>(",", Filtros.LstTipoActividad.ConvertAll(s => s.ToString()));
                var clasificacion = string.Join<string>(",", Filtros.LstClasificacion.ConvertAll(s => s.ToString()));
                var asignado = string.Join<string>(",", Filtros.LstAsignado.ConvertAll(s => s.ToString()));
                var responsable = string.Join<string>(",", Filtros.LstResponsable.ConvertAll(s => s.ToString()));
                var prioridad = string.Join<string>(",", Filtros.LstPrioridad.ConvertAll(s => s.ToString()));
                var sprint = string.Join<string>(",", Filtros.LstSprints.ConvertAll(s => s.ToString()));
                var estatus = string.Join<string>(",", Filtros.LstEstatusW.ConvertAll(s => s.ToString()));


                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("SpGraphics_ByOwner", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;

                sqlcmd.Parameters.AddWithValue("@IdProyecto", Filtros.IdProyecto);
                sqlcmd.Parameters.AddWithValue("@TipoId", Filtros.Tipo);
                sqlcmd.Parameters.AddWithValue("@FechaIni", Filtros.FechaSolIni);
                sqlcmd.Parameters.AddWithValue("@FechaFin", Filtros.FechaSolFin);
                sqlcmd.Parameters.AddWithValue("@Sprints", sprint);
                sqlcmd.Parameters.AddWithValue("@UsuarioAsignado", asignado);
                sqlcmd.Parameters.AddWithValue("@UsuarioResponsable", responsable);
                sqlcmd.Parameters.AddWithValue("@Fase", tipoactividad);
                sqlcmd.Parameters.AddWithValue("@Clasificacion", clasificacion);
                sqlcmd.Parameters.AddWithValue("@Prioridad", prioridad);
                sqlcmd.Parameters.AddWithValue("@WorkFlow", estatus);

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
                da.Fill(ds);
                da.Dispose();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();

                Lst = (from row in ds.Tables[0].AsEnumerable()
                       select (
                       new PieChartModel
                       {
                           name = row["name"].ToString(),
                           value = decimal.Parse(row["value"].ToString())

                       })).ToList();


                return Lst;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }
        public List<PieChartModel> Grafica_SumByAssigned(FiltrosModel Filtros, string Conexion)
        {
            try
            {


                List<PieChartModel> Lst = new List<PieChartModel>();

                var tipoactividad = string.Join<string>(",", Filtros.LstTipoActividad.ConvertAll(s => s.ToString()));
                var clasificacion = string.Join<string>(",", Filtros.LstClasificacion.ConvertAll(s => s.ToString()));
                var asignado = string.Join<string>(",", Filtros.LstAsignado.ConvertAll(s => s.ToString()));
                var responsable = string.Join<string>(",", Filtros.LstResponsable.ConvertAll(s => s.ToString()));
                var prioridad = string.Join<string>(",", Filtros.LstPrioridad.ConvertAll(s => s.ToString()));
                var sprint = string.Join<string>(",", Filtros.LstSprints.ConvertAll(s => s.ToString()));
                var estatus = string.Join<string>(",", Filtros.LstEstatusW.ConvertAll(s => s.ToString()));


                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("SpGraphics_ByAssigned", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;

                sqlcmd.Parameters.AddWithValue("@IdProyecto", Filtros.IdProyecto);
                sqlcmd.Parameters.AddWithValue("@TipoId", Filtros.Tipo);
                sqlcmd.Parameters.AddWithValue("@FechaIni", Filtros.FechaSolIni);
                sqlcmd.Parameters.AddWithValue("@FechaFin", Filtros.FechaSolFin);
                sqlcmd.Parameters.AddWithValue("@Sprints", sprint);
                sqlcmd.Parameters.AddWithValue("@UsuarioAsignado", asignado);
                sqlcmd.Parameters.AddWithValue("@UsuarioResponsable", responsable);
                sqlcmd.Parameters.AddWithValue("@Fase", tipoactividad);
                sqlcmd.Parameters.AddWithValue("@Clasificacion", clasificacion);
                sqlcmd.Parameters.AddWithValue("@Prioridad", prioridad);
                sqlcmd.Parameters.AddWithValue("@WorkFlow", estatus);


                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
                da.Fill(ds);
                da.Dispose();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();

                Lst = (from row in ds.Tables[0].AsEnumerable()
                       select (
                       new PieChartModel
                       {
                           name = row["name"].ToString(),
                           value = decimal.Parse(row["value"].ToString())

                       })).ToList();


                return Lst;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public decimal IndicadorSuma(FiltrosModel Filtros,string group, string Conexion) 
        {
            try
            {

         
            decimal Total = 0;

            var tipoactividad = string.Join<string>(",", Filtros.LstTipoActividad.ConvertAll(s => s.ToString()));
            var clasificacion = string.Join<string>(",", Filtros.LstClasificacion.ConvertAll(s => s.ToString()));
            var asignado = string.Join<string>(",", Filtros.LstAsignado.ConvertAll(s => s.ToString()));
            var responsable = string.Join<string>(",", Filtros.LstResponsable.ConvertAll(s => s.ToString()));
            var prioridad = string.Join<string>(",", Filtros.LstPrioridad.ConvertAll(s => s.ToString()));
            var sprint = string.Join<string>(",", Filtros.LstSprints.ConvertAll(s => s.ToString()));
            var estatus = string.Join<string>(",", Filtros.LstEstatusW.ConvertAll(s => s.ToString()));


            DataSet ds = new DataSet();

            SqlConnection sqlcon = new SqlConnection(Conexion);

            SqlCommand sqlcmd = null;
            if (group == "estimated")
            {
                sqlcmd = new SqlCommand("SpGraphics_BySumEstimated", sqlcon);
            }
            else if (group == "assigned") {
                sqlcmd = new SqlCommand("SpGraphics_BySumAssigned", sqlcon);
            }
            else if (group == "real")
            {
                sqlcmd = new SqlCommand("SpGraphics_BySumReal", sqlcon);
            }

            sqlcmd.CommandType = CommandType.StoredProcedure;

            sqlcmd.Parameters.AddWithValue("@IdProyecto", Filtros.IdProyecto);
            sqlcmd.Parameters.AddWithValue("@TipoId", Filtros.Tipo);
            sqlcmd.Parameters.AddWithValue("@FechaIni", Filtros.FechaSolIni);
            sqlcmd.Parameters.AddWithValue("@FechaFin", Filtros.FechaSolFin);
            sqlcmd.Parameters.AddWithValue("@Sprints", sprint);
            sqlcmd.Parameters.AddWithValue("@UsuarioAsignado", asignado);
            sqlcmd.Parameters.AddWithValue("@UsuarioResponsable", responsable);
            sqlcmd.Parameters.AddWithValue("@Fase", tipoactividad);
            sqlcmd.Parameters.AddWithValue("@Clasificacion", clasificacion);
            sqlcmd.Parameters.AddWithValue("@Prioridad", prioridad);
            sqlcmd.Parameters.AddWithValue("@WorkFlow", estatus);


            SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
            da.Fill(ds);
            da.Dispose();

            sqlcmd.Connection.Close();
            sqlcmd.Connection.Dispose();
            sqlcmd.Dispose();

            Total = decimal.Parse(ds.Tables[0].Rows[0][0].ToString());


            return Total;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public int IndicadorConteo(FiltrosModel Filtros,  string Conexion)
        {

            try
            {

            
            int Total = 0;

            var tipoactividad = string.Join<string>(",", Filtros.LstTipoActividad.ConvertAll(s => s.ToString()));
            var clasificacion = string.Join<string>(",", Filtros.LstClasificacion.ConvertAll(s => s.ToString()));
            var asignado = string.Join<string>(",", Filtros.LstAsignado.ConvertAll(s => s.ToString()));
            var responsable = string.Join<string>(",", Filtros.LstResponsable.ConvertAll(s => s.ToString()));
            var prioridad = string.Join<string>(",", Filtros.LstPrioridad.ConvertAll(s => s.ToString()));
            var sprint = string.Join<string>(",", Filtros.LstSprints.ConvertAll(s => s.ToString()));
            var estatus = string.Join<string>(",", Filtros.LstEstatusW.ConvertAll(s => s.ToString()));


            DataSet ds = new DataSet();

            SqlConnection sqlcon = new SqlConnection(Conexion);

            SqlCommand sqlcmd = new SqlCommand("SpGraphics_ByCount", sqlcon);
         

            sqlcmd.CommandType = CommandType.StoredProcedure;

            sqlcmd.Parameters.AddWithValue("@IdProyecto", Filtros.IdProyecto);
            sqlcmd.Parameters.AddWithValue("@TipoId", Filtros.Tipo);
            sqlcmd.Parameters.AddWithValue("@FechaIni", Filtros.FechaSolIni);
            sqlcmd.Parameters.AddWithValue("@FechaFin", Filtros.FechaSolFin);
            sqlcmd.Parameters.AddWithValue("@Sprints", sprint);
            sqlcmd.Parameters.AddWithValue("@UsuarioAsignado", asignado);
            sqlcmd.Parameters.AddWithValue("@UsuarioResponsable", responsable);
            sqlcmd.Parameters.AddWithValue("@Fase", tipoactividad);
            sqlcmd.Parameters.AddWithValue("@Clasificacion", clasificacion);
            sqlcmd.Parameters.AddWithValue("@Prioridad", prioridad);
            sqlcmd.Parameters.AddWithValue("@WorkFlow", estatus);


            SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
            da.Fill(ds);
            da.Dispose();

            sqlcmd.Connection.Close();
            sqlcmd.Connection.Dispose();
            sqlcmd.Dispose();

            var d = ds.Tables[0].Rows[0][0].ToString();

            Total = int.Parse(ds.Tables[0].Rows[0][0].ToString());


            return Total;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        #endregion

    }
}
