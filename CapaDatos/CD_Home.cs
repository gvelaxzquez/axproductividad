using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;
using CapaDatos.Models;
using CapaDatos.DataBaseModel;
using System.Data.SqlTypes;

namespace CapaDatos
{
    public class CD_Home
    {
        public IndicadoresModel ConsultaIndicadores(string Conexion, long IdUsuario)
        {
            try
            {
                IndicadoresModel indicadores = new IndicadoresModel();

                //var con = new SqlConnection(Conexion);
                //con.Open();

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("IndicadoresPrincipales_sp", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdUsuario", IdUsuario);
                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();


                var ind = ds.Tables[0];


                indicadores.Objetivo = double.Parse(ind.Rows[0][0].ToString());
                indicadores.Asignadas = double.Parse(ind.Rows[0][1].ToString());
                indicadores.Liberadas = double.Parse(ind.Rows[0][2].ToString());
                indicadores.Validacion = double.Parse(ind.Rows[0][3].ToString());
                indicadores.Rechazadas = double.Parse(ind.Rows[0][4].ToString());
                indicadores.Productividad = double.Parse(ind.Rows[0][5].ToString());



                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();
     
                sqlcon.Close();
                //con.Close();



                return indicadores;

            }
            catch (Exception ex)
            {
                
                throw ex;
            }
        }
        public IndicadoresModel ConsultaIndicadoresV2(FiltrosModel Filtro, string Conexion) {
            try
            {
                IndicadoresModel indicadores = new IndicadoresModel();
                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spIndicadoresPrincipales_spV4", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdMes", Filtro.Mes);
                sqlcmd.Parameters.AddWithValue("@IdAnio", Filtro.Anio);
                sqlcmd.Parameters.AddWithValue("@IdUsuarioConsulta", Filtro.IdUsuarioConsulta);
                sqlcmd.Parameters.AddWithValue("@IdUsuarioReporte", Filtro.IdUsuarioReporte);
                sqlcmd.Parameters.AddWithValue("@DepartamentoId", Filtro.DepartamentoId);
                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();
                var ind = ds.Tables[0];

                indicadores.HorasReportadas = ind.Rows[0][0].ToString()== string.Empty ? 0 :  double.Parse(ind.Rows[0][0].ToString());
                indicadores.HorasProductivas = ind.Rows[0][1].ToString() == string.Empty ? 0 : double.Parse(ind.Rows[0][1].ToString());
                indicadores.Asignadas = ind.Rows[0][2].ToString() == string.Empty ? 0 : double.Parse(ind.Rows[0][2].ToString());
                indicadores.Validacion = ind.Rows[0][3].ToString() == string.Empty ? 0 : double.Parse(ind.Rows[0][3].ToString());
                indicadores.Liberadas = ind.Rows[0][4].ToString() == string.Empty ? 0 : double.Parse(ind.Rows[0][4].ToString());
                indicadores.Rechazadas = ind.Rows[0][5].ToString() == string.Empty ? 0 : double.Parse(ind.Rows[0][5].ToString());
                indicadores.Retrabajo = ind.Rows[0][6].ToString() == string.Empty ? 0 : double.Parse(ind.Rows[0][6].ToString());
                indicadores.Objetivo = ind.Rows[0][7].ToString() == string.Empty ? 0 : double.Parse(ind.Rows[0][7].ToString());
                indicadores.ObjetivoActual = ind.Rows[0][8].ToString() == string.Empty ? 0 : double.Parse(ind.Rows[0][8].ToString());
                indicadores.Productividad = ind.Rows[0][9].ToString() == string.Empty ? 0 : double.Parse(ind.Rows[0][9].ToString());
                indicadores.ProductividadMes = ind.Rows[0][10].ToString() == string.Empty ? 0 : double.Parse(ind.Rows[0][10].ToString());
                indicadores.Proceso = ind.Rows[0][11].ToString() == string.Empty ? 0 : double.Parse(ind.Rows[0][11].ToString());
                indicadores.IRetrabajo = ind.Rows[0][12].ToString() == string.Empty ? 0 : double.Parse(ind.Rows[0][12].ToString());
                indicadores.DiasSinBugs = ind.Rows[0][13].ToString() == string.Empty ? 0 : int.Parse(ind.Rows[0][13].ToString());
                indicadores.RecordBugs = ind.Rows[0][14].ToString() == string.Empty ? 0 : int.Parse(ind.Rows[0][14].ToString());
                indicadores.DesfaseH = ind.Rows[0][15].ToString() == string.Empty ? 0 : double.Parse(ind.Rows[0][15].ToString());
                indicadores.DesfaseP = ind.Rows[0][16].ToString() == string.Empty ? 0 : double.Parse(ind.Rows[0][16].ToString());
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

        public string ConsultaTiemposTrabajo(FiltrosModel Filtro, string Conexion) {

            try
            {

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spObtieneTiemposTrabajo", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdMes", Filtro.Mes);
                sqlcmd.Parameters.AddWithValue("@IdAnio", Filtro.Anio);
                sqlcmd.Parameters.AddWithValue("@IdUsuarioConsulta", Filtro.IdUsuarioConsulta);
                sqlcmd.Parameters.AddWithValue("@IdTipo", Filtro.Tipo);
      
                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();
                var dt = ds.Tables[0];

                string Tabla = ConvertirDatos.GenerarTablaTiempos(dt);

                return Tabla;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }


        public DataTable ConsultaTiemposTrabajoDT(FiltrosModel Filtro, string Conexion)
        {

            try
            {

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spObtieneTiemposTrabajo", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdMes", Filtro.Mes);
                sqlcmd.Parameters.AddWithValue("@IdAnio", Filtro.Anio);
                sqlcmd.Parameters.AddWithValue("@IdUsuarioConsulta", Filtro.IdUsuarioConsulta);
                sqlcmd.Parameters.AddWithValue("@IdTipo", Filtro.Tipo);

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();
                var dt = ds.Tables[0];

          

                return dt;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public List<ActividadComentarioModel> ConsultaAlertas(string conexion, long IdUsuario)
        {
            try
            {
                List<ActividadComentarioModel> Lst = new List<ActividadComentarioModel>();
 
                DataSet ds = new DataSet();
                SqlConnection sqlcon = new SqlConnection(conexion);
                SqlCommand sqlcmd = new SqlCommand("Alertas_sp", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdUsuario", IdUsuario);
                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();

                var dtactividades = ds.Tables[0];

                Lst = (from row in dtactividades.AsEnumerable()
                                  select (
                                  new ActividadComentarioModel
                                  {

                                      IdActividad = long.Parse(row["IdActividad"].ToString()),
                                      IdActividadComentario = long.Parse(row["IdActividadComentario"].ToString()),
                                      IdActividadStr = row["IdActividadStr"].ToString(),
                                      Comentario = row["Comentario"].ToString(),
                                      CveUsuario = row["NumEmpleado"].ToString(),
                                      IdUsuario = long.Parse(row["IdUsuario"].ToString()),
                                      IdUsuarioStr = row["Nombre"].ToString(),
                                      Fecha = DateTime.Parse(row["Fecha"].ToString()),
                                      Tipo = int.Parse(row["Tipo"].ToString()),
                                  }

                                  )).ToList();


                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();
                sqlcon.Close();


                return Lst;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public bool ComentarioLeido(long IdActividadComentario, long IdUsuario, string Conexion) {
            try
            {

                using (var contexto = new BDProductividad_DEVEntities(Conexion)) {

                    UsuarioComentario uc = new UsuarioComentario();

                    uc.IdActividadComentario = IdActividadComentario;
                    uc.IdUsuario = IdUsuario;
                    uc.FechaRegistro = DateTime.Now;

                    contexto.UsuarioComentario.Add(uc);

                    contexto.SaveChanges();

                
                
                }

                return true;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        
        }

    }
}
