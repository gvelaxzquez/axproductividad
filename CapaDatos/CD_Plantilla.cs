using CapaDatos.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CapaDatos.DataBaseModel;

namespace CapaDatos
{
    public class CD_Plantilla
    {

        public List<PlantillaModel> ConsultaPlantillas(string Conexion)
        {

            try
            {

                List<PlantillaModel> Lst = new List<PlantillaModel>();



                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spConsultaListaPlantillas", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();

                var dt = new DataTable();
                dt = ds.Tables[0];

                Lst = (from row in dt.AsEnumerable()
                             select (new PlantillaModel
                             {
                                 IdPlantilla = long.Parse(row["IdPlantilla"].ToString()),
                                 IdPlantillaRel = row["IdCategoria"].ToString() == "" ? 0 : long.Parse(row["IdCategoria"].ToString()),
                                 Nombre = row["Nombre"].ToString(),
                             })).ToList();

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
        public List<PlantillaModel> ConsultaPlantillasActivo(string Conexion)
        {

            try
            {

                List<PlantillaModel> Lst = new List<PlantillaModel>();



                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spConsultaListaPlantillasActivo", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();

                var dt = new DataTable();
                dt = ds.Tables[0];

                Lst = (from row in dt.AsEnumerable()
                       select (new PlantillaModel
                       {
                           IdPlantilla = long.Parse(row["IdPlantilla"].ToString()),
                           IdPlantillaRel = row["IdCategoria"].ToString() == "" ? 0 : long.Parse(row["IdCategoria"].ToString()),
                           Nombre = row["Nombre"].ToString(),
                       })).ToList();

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


        public PlantillaModel ConsultaPlantilla(long IdPlantilla, string Conexion)
        {
            try
            {
                PlantillaModel p = new PlantillaModel();

                using(var contexto = new BDProductividad_DEVEntities(Conexion))
                {


                    p = contexto.Plantilla.Where(w => w.IdPlantilla == IdPlantilla)
                                .Select(s => new PlantillaModel
                                {
                                    IdPlantilla =s.IdPlantilla,
                                    Nombre = s.Nombre,
                                    Titulo = s.Titulo,
                                    CategoriaId = s.CategoriaId,
                                    Descripcion = s.Descripción,
                                    Contenido = s.Contenido,
                                    Activo= s.Activo,
                                    FechaMod = s.FechaMod,
                                    UsuarioAct = s.Usuario1.Nombre + " " + s.Usuario1.ApPaterno
                                
                                }).FirstOrDefault();

                }


                return p;

            }
            catch (Exception ex)
            {

                throw ex;
            }


        }

        public bool GuardarPlantilla(PlantillaModel p, string Conexion)
        {
            try
            {
                using(var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    if (p.IdPlantilla == 0)
                    {

                        Plantilla pl = new Plantilla();

                        pl.Nombre = p.Nombre;
                        pl.Titulo = p.Titulo;
                        pl.CategoriaId = p.CategoriaId;
                        pl.Descripción = p.Descripcion;
                        pl.Contenido = p.Contenido;
                        pl.Activo = p.Activo;
                        pl.IdUCreo = p.IdUCreo;
                        pl.FechaCreo = DateTime.Now;
                        pl.IdUMod = p.IdUCreo;
                        pl.FechaMod = DateTime.Now;

                        contexto.Plantilla.Add(pl);

                    }
                    else { 
                    

                        var pl = contexto.Plantilla.Where(w=> w.IdPlantilla== p.IdPlantilla).FirstOrDefault();
                        pl.Nombre = p.Nombre;
                        pl.Titulo = p.Titulo;
                        pl.CategoriaId = p.CategoriaId;
                        pl.Descripción = p.Descripcion;
                        pl.Contenido = p.Contenido;
                        pl.Activo = p.Activo;
                        pl.IdUMod = p.IdUCreo;
                        pl.FechaMod = DateTime.Now;

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

    }
}
