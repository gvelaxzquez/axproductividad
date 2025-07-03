using CapaDatos.DataBaseModel;
using CapaDatos.Models;
using CapaDatos.Models.Constants;
using EntityFramework.BulkInsert.Extensions;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Linq;

namespace CapaDatos
{
    public class CD_Proyecto
    {
        public List<ProyectosModel> ConsultaProyectos(UsuarioModel User, string Conexion)
        {

            try
            {
                List<ProyectosModel> LstProy = new List<ProyectosModel>();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    contexto.Configuration.LazyLoadingEnabled = false;

                    if (User.IdTipoUsuario == 15) //TEAM LEADER
                    {

                        LstProy = (from p in contexto.Proyecto
                                   join u in contexto.Usuario on p.IdULider equals u.IdUsuario
                                   join c in contexto.CatalogoGeneral on p.TipoProyectoId equals c.IdCatalogo
                                   join c1 in contexto.CatalogoGeneral on p.MetodologiaId equals c1.IdCatalogo
                                   join cte in contexto.Cliente on p.IdCliente equals cte.IdCliente
                                   join c2 in contexto.CatalogoGeneral on p.EstatusId equals c2.IdCatalogo
                                   where p.IdULider == User.IdUsuario && p.EstatusId == 253
                                   select new ProyectosModel
                                   {
                                       IdProyecto = p.IdProyecto,
                                       Nombre = p.Nombre,
                                       Clave = p.Clave,
                                       IdCliente = p.IdCliente,
                                       IdClienteStr = cte.Nombre,
                                       TipoProyectoId = p.TipoProyectoId,
                                       TipoProyectoStr = c.DescLarga,
                                       IdULider = p.IdULider,
                                       IdULiderStr = u.Nombre + " " + u.ApPaterno + " " + u.ApMaterno,
                                       Activo = p.Activo,
                                       Descripcion = p.Descripcion,
                                       SemaforoID = p.SemaforoID,
                                       Avance = p.Avance,
                                       AvanceReal = p.AvanceReal,
                                       MetodologiaId = p.MetodologiaId,
                                       MetodologiaIdStr = c1.DescLarga,
                                       EstatusId = c2.IdCatalogo,
                                       EstatusIdStr = c2.DescLarga,

                                   }).ToList();


                        var LstProyH = (from p in contexto.Proyecto
                                        join u in contexto.Usuario on p.IdULider equals u.IdUsuario
                                        join pu in contexto.ProyectoUsuario on p.IdProyecto equals pu.IdProyecto
                                        join c in contexto.CatalogoGeneral on p.TipoProyectoId equals c.IdCatalogo
                                        join c1 in contexto.CatalogoGeneral on p.MetodologiaId equals c1.IdCatalogo
                                        join cte in contexto.Cliente on p.IdCliente equals cte.IdCliente
                                        join c2 in contexto.CatalogoGeneral on p.EstatusId equals c2.IdCatalogo
                                        where pu.IdUsuario == User.IdUsuario && p.EstatusId == 253
                                        select new ProyectosModel
                                        {
                                            IdProyecto = p.IdProyecto,
                                            Nombre = p.Nombre,
                                            Clave = p.Clave,
                                            IdCliente = p.IdCliente,
                                            IdClienteStr = cte.Nombre,
                                            TipoProyectoId = p.TipoProyectoId,
                                            TipoProyectoStr = c.DescLarga,
                                            IdULider = p.IdULider,
                                            IdULiderStr = u.Nombre + " " + u.ApPaterno + " " + u.ApMaterno,
                                            Activo = p.Activo,
                                            Descripcion = p.Descripcion,
                                            SemaforoID = p.SemaforoID,
                                            Avance = p.Avance,
                                            AvanceReal = p.AvanceReal,
                                            MetodologiaId = p.MetodologiaId,
                                            MetodologiaIdStr = c1.DescLarga,
                                            EstatusId = c2.IdCatalogo,
                                            EstatusIdStr = c2.DescLarga,

                                        }).ToList();
                        LstProy.AddRange(LstProyH);

                        LstProy = LstProy.GroupBy(g => g.IdProyecto).Select(s => s.First()).ToList();

                    }
                    else if (User.IdTipoUsuario == 14)
                    {//EQUIPO
                        LstProy = (from p in contexto.Proyecto
                                   join pu in contexto.ProyectoUsuario on p.IdProyecto equals pu.IdProyecto
                                   join u in contexto.Usuario on pu.IdUsuario equals u.IdUsuario
                                   join c in contexto.CatalogoGeneral on p.TipoProyectoId equals c.IdCatalogo
                                   join c1 in contexto.CatalogoGeneral on p.MetodologiaId equals c1.IdCatalogo
                                   join cte in contexto.Cliente on p.IdCliente equals cte.IdCliente
                                   join c2 in contexto.CatalogoGeneral on p.EstatusId equals c2.IdCatalogo
                                   where pu.IdUsuario == User.IdUsuario && p.EstatusId == 253
                                   select new ProyectosModel
                                   {
                                       IdProyecto = p.IdProyecto,
                                       Nombre = p.Nombre,
                                       Clave = p.Clave,
                                       IdCliente = p.IdCliente,
                                       IdClienteStr = cte.Nombre,
                                       TipoProyectoId = p.TipoProyectoId,
                                       TipoProyectoStr = c.DescLarga,
                                       IdULider = p.IdULider,
                                       IdULiderStr = u.Nombre + " " + u.ApPaterno + " " + u.ApMaterno,
                                       Activo = p.Activo,
                                       Descripcion = p.Descripcion,
                                       SemaforoID = p.SemaforoID,
                                       Avance = p.Avance,
                                       AvanceReal = p.AvanceReal,
                                       MetodologiaId = p.MetodologiaId,
                                       MetodologiaIdStr = c1.DescLarga,
                                       EstatusId = c2.IdCatalogo,
                                       EstatusIdStr = c2.DescLarga,

                                   }).ToList();
                    }
                    else
                    {
                        LstProy = (from p in contexto.Proyecto
                                   join u in contexto.Usuario on p.IdULider equals u.IdUsuario
                                   join c in contexto.CatalogoGeneral on p.TipoProyectoId equals c.IdCatalogo
                                   join c1 in contexto.CatalogoGeneral on p.MetodologiaId equals c1.IdCatalogo
                                   join cte in contexto.Cliente on p.IdCliente equals cte.IdCliente
                                   join c2 in contexto.CatalogoGeneral on p.EstatusId equals c2.IdCatalogo
                                   where u.DepartamentoId == User.DepartamentoId && p.EstatusId == 253
                                   select new ProyectosModel
                                   {
                                       IdProyecto = p.IdProyecto,
                                       Nombre = p.Nombre,
                                       Clave = p.Clave,
                                       IdCliente = p.IdCliente,
                                       IdClienteStr = cte.Nombre,
                                       TipoProyectoId = p.TipoProyectoId,
                                       TipoProyectoStr = c.DescLarga,
                                       IdULider = p.IdULider,
                                       IdULiderStr = u.Nombre + " " + u.ApPaterno + " " + u.ApMaterno,
                                       Activo = p.Activo,
                                       Descripcion = p.Descripcion,
                                       SemaforoID = p.SemaforoID,
                                       Avance = p.Avance,
                                       AvanceReal = p.AvanceReal,
                                       MetodologiaId = p.MetodologiaId,
                                       MetodologiaIdStr = c1.DescLarga,
                                       EstatusId = c2.IdCatalogo,
                                       EstatusIdStr = c2.DescLarga,

                                   }).ToList();

                    }
                }

                return LstProy;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }
        public List<ProyectosModel> ConsultaProyectosActivos(UsuarioModel User, string Conexion)
        {

            try
            {
                List<ProyectosModel> LstProy = new List<ProyectosModel>();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    contexto.Configuration.LazyLoadingEnabled = false;

                    if (User.IdTipoUsuario == 15) //TEAM LEADER
                    {

                        LstProy = (from p in contexto.Proyecto
                                   join u in contexto.Usuario on p.IdULider equals u.IdUsuario
                                   join c in contexto.CatalogoGeneral on p.TipoProyectoId equals c.IdCatalogo
                                   join c1 in contexto.CatalogoGeneral on p.MetodologiaId equals c1.IdCatalogo
                                   join cte in contexto.Cliente on p.IdCliente equals cte.IdCliente
                                   join c2 in contexto.CatalogoGeneral on p.EstatusId equals c2.IdCatalogo
                                   where p.IdULider == User.IdUsuario && p.Activo == true
                                   select new ProyectosModel
                                   {
                                       IdProyecto = p.IdProyecto,
                                       Nombre = p.Nombre,
                                       Clave = p.Clave,
                                       IdCliente = p.IdCliente,
                                       IdClienteStr = cte.Nombre,
                                       TipoProyectoId = p.TipoProyectoId,
                                       TipoProyectoStr = c.DescLarga,
                                       IdULider = p.IdULider,
                                       IdULiderStr = u.Nombre + " " + u.ApPaterno + " " + u.ApMaterno,
                                       Activo = p.Activo,
                                       Descripcion = p.Descripcion,
                                       SemaforoID = p.SemaforoID,
                                       Avance = p.Avance,
                                       AvanceReal = p.AvanceReal,
                                       MetodologiaId = p.MetodologiaId,
                                       MetodologiaIdStr = c1.DescLarga,
                                       EstatusId = c2.IdCatalogo,
                                       EstatusIdStr = c2.DescLarga,

                                   }).ToList();


                        var LstProyH = (from p in contexto.Proyecto
                                        join u in contexto.Usuario on p.IdULider equals u.IdUsuario
                                        join pu in contexto.ProyectoUsuario on p.IdProyecto equals pu.IdProyecto
                                        join c in contexto.CatalogoGeneral on p.TipoProyectoId equals c.IdCatalogo
                                        join c1 in contexto.CatalogoGeneral on p.MetodologiaId equals c1.IdCatalogo
                                        join cte in contexto.Cliente on p.IdCliente equals cte.IdCliente
                                        join c2 in contexto.CatalogoGeneral on p.EstatusId equals c2.IdCatalogo
                                        where pu.IdUsuario == User.IdUsuario && p.Activo == true
                                        select new ProyectosModel
                                        {
                                            IdProyecto = p.IdProyecto,
                                            Nombre = p.Nombre,
                                            Clave = p.Clave,
                                            IdCliente = p.IdCliente,
                                            IdClienteStr = cte.Nombre,
                                            TipoProyectoId = p.TipoProyectoId,
                                            TipoProyectoStr = c.DescLarga,
                                            IdULider = p.IdULider,
                                            IdULiderStr = u.Nombre + " " + u.ApPaterno + " " + u.ApMaterno,
                                            Activo = p.Activo,
                                            Descripcion = p.Descripcion,
                                            SemaforoID = p.SemaforoID,
                                            Avance = p.Avance,
                                            AvanceReal = p.AvanceReal,
                                            MetodologiaId = p.MetodologiaId,
                                            MetodologiaIdStr = c1.DescLarga,
                                            EstatusId = c2.IdCatalogo,
                                            EstatusIdStr = c2.DescLarga,

                                        }).ToList();
                        LstProy.AddRange(LstProyH);

                        LstProy = LstProy.GroupBy(g => g.IdProyecto).Select(s => s.First()).ToList();

                    }
                    else if (User.IdTipoUsuario == 14)
                    {//EQUIPO
                        LstProy = (from p in contexto.Proyecto
                                   join pu in contexto.ProyectoUsuario on p.IdProyecto equals pu.IdProyecto
                                   join u in contexto.Usuario on pu.IdUsuario equals u.IdUsuario
                                   join c in contexto.CatalogoGeneral on p.TipoProyectoId equals c.IdCatalogo
                                   join c1 in contexto.CatalogoGeneral on p.MetodologiaId equals c1.IdCatalogo
                                   join cte in contexto.Cliente on p.IdCliente equals cte.IdCliente
                                   join c2 in contexto.CatalogoGeneral on p.EstatusId equals c2.IdCatalogo
                                   where pu.IdUsuario == User.IdUsuario && p.Activo == true
                                   select new ProyectosModel
                                   {
                                       IdProyecto = p.IdProyecto,
                                       Nombre = p.Nombre,
                                       Clave = p.Clave,
                                       IdCliente = p.IdCliente,
                                       IdClienteStr = cte.Nombre,
                                       TipoProyectoId = p.TipoProyectoId,
                                       TipoProyectoStr = c.DescLarga,
                                       IdULider = p.IdULider,
                                       IdULiderStr = u.Nombre + " " + u.ApPaterno + " " + u.ApMaterno,
                                       Activo = p.Activo,
                                       Descripcion = p.Descripcion,
                                       SemaforoID = p.SemaforoID,
                                       Avance = p.Avance,
                                       AvanceReal = p.AvanceReal,
                                       MetodologiaId = p.MetodologiaId,
                                       MetodologiaIdStr = c1.DescLarga,
                                       EstatusId = c2.IdCatalogo,
                                       EstatusIdStr = c2.DescLarga,

                                   }).ToList();
                    }
                    else
                    {
                        LstProy = (from p in contexto.Proyecto
                                   join u in contexto.Usuario on p.IdULider equals u.IdUsuario
                                   join c in contexto.CatalogoGeneral on p.TipoProyectoId equals c.IdCatalogo
                                   join c1 in contexto.CatalogoGeneral on p.MetodologiaId equals c1.IdCatalogo
                                   join cte in contexto.Cliente on p.IdCliente equals cte.IdCliente
                                   join c2 in contexto.CatalogoGeneral on p.EstatusId equals c2.IdCatalogo
                                   where u.DepartamentoId == User.DepartamentoId && p.Activo == true
                                   select new ProyectosModel
                                   {
                                       IdProyecto = p.IdProyecto,
                                       Nombre = p.Nombre,
                                       Clave = p.Clave,
                                       IdCliente = p.IdCliente,
                                       IdClienteStr = cte.Nombre,
                                       TipoProyectoId = p.TipoProyectoId,
                                       TipoProyectoStr = c.DescLarga,
                                       IdULider = p.IdULider,
                                       IdULiderStr = u.Nombre + " " + u.ApPaterno + " " + u.ApMaterno,
                                       Activo = p.Activo,
                                       Descripcion = p.Descripcion,
                                       SemaforoID = p.SemaforoID,
                                       Avance = p.Avance,
                                       AvanceReal = p.AvanceReal,
                                       MetodologiaId = p.MetodologiaId,
                                       MetodologiaIdStr = c1.DescLarga,
                                       EstatusId = c2.IdCatalogo,
                                       EstatusIdStr = c2.DescLarga,

                                   }).ToList();

                    }
                }

                return LstProy;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public List<ProyectosModel> ConsultaProyectosUsuario(long IdUsuario, string Conexion)
        {

            try
            {

                List<ProyectosModel> LstProy = new List<ProyectosModel>();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    LstProy = (from p in contexto.Proyecto
                               join up in contexto.ProyectoUsuario on p.IdProyecto equals up.IdProyecto
                               where up.IdUsuario == IdUsuario && p.EstatusId == 253
                               select new ProyectosModel
                               {
                                   IdProyecto = p.IdProyecto,
                                   Nombre = p.Nombre,
                                   Clave = p.Clave
                               }).ToList();

                }



                return LstProy;

            }
            catch (Exception)
            {

                throw;
            }
        }

        public List<ProyectosModel> ConsultaProyectosV2(string Texto, UsuarioModel User, string Conexion)
        {

            try
            {
                List<ProyectosModel> LstProy = new List<ProyectosModel>();

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spObtieneProyectos", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@Texto", Texto);
                sqlcmd.Parameters.AddWithValue("@IdUsuario", User.IdUsuario);
                sqlcmd.Parameters.AddWithValue("@IdTipoUsuario", User.IdTipoUsuario);

                //               @Texto nvarchar(1000)= ''  ,
                //@EstatusId bigint = null,
                //@Visible bit = 1,
                //@IdUsuario bigint = 70,
                //@IdTipoUsuario bigint = 70



                //               @Texto nvarchar(1000)= ''  ,
                //@EstatusId bigint = null,
                //@Visible bit = 1,
                //@IdTipoUsuario bigint = 70



                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
                da.Fill(ds);
                da.Dispose();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();

                ProyectosModel Indicadores = new ProyectosModel();

                //System.Globalization.CultureInfo culture = new System.Globalization.CultureInfo("es-MX");

                var LstPry = ds.Tables[0];

                LstProy = (from row in LstPry.AsEnumerable()
                           select (
                           new ProyectosModel
                           {
                               IdProyecto = long.Parse(row["IdProyecto"].ToString()),
                               Clave = row["Clave"].ToString(),
                               Nombre = row["Nombre"].ToString(),
                               IdClienteStr = row["Cliente"].ToString(),
                               Lider = row["Lider"].ToString(),
                               AvanceRealPorc = decimal.Parse(row["AvRealPorc"].ToString()),
                               AvanceCompPorc = decimal.Parse(row["AvComprometido"].ToString()),
                               DesfaseProc = decimal.Parse(row["DesfasePorc"].ToString()),
                               Estatus = row["Estatus"].ToString(),
                               EstatusIdStr = row["EstatusStr"].ToString(),
                               //DiaMilestone = row["DiaMilestone"].ToString(),
                               //MesMilestone = row["MesMilestone"].ToString(),
                               //Milestone = row["Milestone"].ToString(),

                           })).ToList();





                return LstProy;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }


        public List<ProyectosModel> ConsultaProyectosV3(string Texto, List<string> Estatus, long IdUsuario, string Conexion)
        {

            try
            {
                List<ProyectosModel> LstProy = new List<ProyectosModel>();
                var estatus = string.Join<string>(",", Estatus.ConvertAll(s => s.ToString()));
                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spObtieneProyectosv3", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@Texto", Texto);
                sqlcmd.Parameters.AddWithValue("@Estatus", estatus);
                sqlcmd.Parameters.AddWithValue("@IdUsuario", IdUsuario);
                //sqlcmd.Parameters.AddWithValue("@IdTipoUsuario", User.IdTipoUsuario);



                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
                da.Fill(ds);
                da.Dispose();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();

                ProyectosModel Indicadores = new ProyectosModel();


                var LstPry = ds.Tables[0];

                LstProy = (from row in LstPry.AsEnumerable()
                           select (
                           new ProyectosModel
                           {
                               IdProyecto = long.Parse(row["IdProyecto"].ToString()),
                               Clave = row["Clave"].ToString(),
                               Nombre = row["Nombre"].ToString(),
                               IdClienteStr = row["Cliente"].ToString(),
                               IdULiderStr = row["CveLider"].ToString(),
                               Lider = row["Lider"].ToString(),
                               AvanceRealPorc = decimal.Parse(row["AvRealPorc"].ToString()),
                               AvanceCompPorc = decimal.Parse(row["AvComprometido"].ToString()),
                               DesfaseProc = decimal.Parse(row["DesfasePorc"].ToString()),
                               Estatus = row["Estatus"].ToString(),
                               EstatusIdStr = row["EstatusStr"].ToString(),
                               FechaInicioPlan = row["FechaInicio"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaInicio"].ToString()),
                               FechaFinPlan = row["FechaFin"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaFin"].ToString()),
                               FechaFinComprometida = row["FechaFinComprometida"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaFinComprometida"].ToString()),
                               FechaProyectada = row["FechaProyectada"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaProyectada"].ToString())

                           })).ToList();

                return LstProy;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }



        public List<ProyectosModel> ConsultaPlantillas(string Conexion)
        {

            try
            {

                List<ProyectosModel> LstProy = new List<ProyectosModel>();


                using (var Contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    LstProy = Contexto.Proyecto.Where(w => w.CatalogoGeneral.DescCorta == "P")
                             .Select(s => new ProyectosModel
                             {
                                 IdProyecto = s.IdProyecto,
                                 Nombre = s.Nombre,
                                 Descripcion = s.Descripcion

                             }).ToList();

                }

                return LstProy;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public (bool Estatus, string Mensaje) GuardarRepositorio(ProyectoRepositorioModel _proyecto, string conexion)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexion))
            {
                var proyecto = contexto.Proyecto.AsNoTracking().FirstOrDefault(x => x.IdProyecto == _proyecto.IdProyecto);
                if (proyecto == null)
                    return (false, "Proyecto invalido");

                var repo = new ProyectoRepositorio
                {
                    IdProyecto = _proyecto.IdProyecto,
                    IdTipoRepositorio = _proyecto.IdTipoRepositorio,
                    Nombre = _proyecto.Nombre,
                    Organizacion = _proyecto.Organizacion,
                    Proyecto = _proyecto.Proyecto,
                    IdUCreo = _proyecto.IdUCreo,
                    FechaCreo = DateTime.Now,
                };

                contexto.ProyectoRepositorio.Add(repo);
                contexto.SaveChanges();

                return (true, Mensaje.MensajeGuardadoExito);
            }
        }

        public (bool Estatus, string Mensaje) EliminarRepositorio(ProyectoRepositorioModel _proyecto, string conexion)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexion))
            {
                var proyecto = contexto.ProyectoRepositorio
                    .FirstOrDefault(x => x.IdProyecto == _proyecto.IdProyecto && x.IdProyectoRepositorio == _proyecto.IdProyectoRepositorio);
                if (proyecto == null)
                    return (false, "Proyecto invalido");

                contexto.ProyectoRepositorio.Remove(proyecto);
                contexto.SaveChanges();

                return (true, Mensaje.MensajeEliminadoExito);
            }
        }

        public List<ProyectoRepositorioModel> LeerRepositorios(long idProyecto, string conexion)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexion))
            {
                var repos =
                    contexto.ProyectoRepositorio
                    .Where(x => x.IdProyecto == idProyecto)
                    .Select(x => new ProyectoRepositorioModel
                    {
                        IdProyectoRepositorio = x.IdProyectoRepositorio,
                        IdProyecto = x.IdProyecto,
                        IdTipoRepositorio = x.IdTipoRepositorio,
                        Nombre = x.Nombre,
                        Organizacion = x.Organizacion,
                        Proyecto = x.Proyecto
                    }).ToList();

                return repos;
            }
        }

        public List<ProyectosModel> ConsultaProyectosMenu(UsuarioModel User, string Conexion)
        {

            try
            {
                List<ProyectosModel> LstProy = new List<ProyectosModel>();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    contexto.Configuration.LazyLoadingEnabled = false;

                    if (User.IdTipoUsuario == 15) //TEAM LEADER
                    {

                        LstProy = (from p in contexto.Proyecto
                                   join u in contexto.Usuario on p.IdULider equals u.IdUsuario
                                   join c in contexto.CatalogoGeneral on p.TipoProyectoId equals c.IdCatalogo
                                   join cte in contexto.Cliente on p.IdCliente equals cte.IdCliente
                                   where p.IdULider == User.IdUsuario && p.Activo == true
                                   select new ProyectosModel
                                   {
                                       IdProyecto = p.IdProyecto,
                                       Nombre = p.Nombre,
                                       Clave = p.Clave,
                                       IdCliente = p.IdCliente,
                                       IdClienteStr = cte.Nombre,
                                       TipoProyectoId = p.TipoProyectoId,
                                       TipoProyectoStr = c.DescLarga,
                                       IdULider = p.IdULider,
                                       IdULiderStr = u.Nombre + " " + u.ApPaterno + " " + u.ApMaterno,
                                       Activo = p.Activo,
                                       Descripcion = p.Descripcion,
                                       SemaforoID = p.SemaforoID,
                                       Avance = p.Avance,
                                       AvanceReal = p.AvanceReal

                                   }).ToList();
                    }
                    else if (User.IdTipoUsuario == 14)
                    {//EQUIPO
                        LstProy = (from p in contexto.Proyecto
                                   join u in contexto.Usuario on p.IdULider equals u.IdUsuario
                                   join c in contexto.CatalogoGeneral on p.TipoProyectoId equals c.IdCatalogo
                                   join cte in contexto.Cliente on p.IdCliente equals cte.IdCliente
                                   where p.Activo == true
                                   select new ProyectosModel
                                   {
                                       IdProyecto = p.IdProyecto,
                                       Nombre = p.Nombre,
                                       Clave = p.Clave,
                                       IdCliente = p.IdCliente,
                                       IdClienteStr = cte.Nombre,
                                       TipoProyectoId = p.TipoProyectoId,
                                       TipoProyectoStr = c.DescLarga,
                                       IdULider = p.IdULider,
                                       IdULiderStr = u.Nombre + " " + u.ApPaterno + " " + u.ApMaterno,
                                       Activo = p.Activo,
                                       Descripcion = p.Descripcion,
                                       SemaforoID = p.SemaforoID,
                                       Avance = p.Avance,
                                       AvanceReal = p.AvanceReal

                                   }).ToList();
                    }
                    else
                    {
                        LstProy = (from p in contexto.Proyecto
                                   join u in contexto.Usuario on p.IdULider equals u.IdUsuario
                                   join c in contexto.CatalogoGeneral on p.TipoProyectoId equals c.IdCatalogo
                                   join cte in contexto.Cliente on p.IdCliente equals cte.IdCliente
                                   where p.Activo == true && u.DepartamentoId == User.DepartamentoId
                                   select new ProyectosModel
                                   {
                                       IdProyecto = p.IdProyecto,
                                       Nombre = p.Nombre,
                                       Clave = p.Clave,
                                       IdCliente = p.IdCliente,
                                       IdClienteStr = cte.Nombre,
                                       TipoProyectoId = p.TipoProyectoId,
                                       TipoProyectoStr = c.DescLarga,
                                       IdULider = p.IdULider,
                                       IdULiderStr = u.Nombre + " " + u.ApPaterno + " " + u.ApMaterno,
                                       Activo = p.Activo,
                                       Descripcion = p.Descripcion,
                                       SemaforoID = p.SemaforoID,
                                       Avance = p.Avance,
                                       AvanceReal = p.AvanceReal

                                   }).ToList();

                    }
                }

                return LstProy;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }
        public ProyectosModel ConsultaProyecto(string Clave, string Conexion)
        {

            try
            {
                ProyectosModel Proy = new ProyectosModel();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    contexto.Configuration.LazyLoadingEnabled = false;

                    Proy = (from p in contexto.Proyecto
                            join u in contexto.Usuario on p.IdULider equals u.IdUsuario
                            join c in contexto.CatalogoGeneral on p.TipoProyectoId equals c.IdCatalogo
                            join c1 in contexto.CatalogoGeneral on p.MetodologiaId equals c1.IdCatalogo
                            join cte in contexto.Cliente on p.IdCliente equals cte.IdCliente
                            join c2 in contexto.CatalogoGeneral on p.EstatusId equals c2.IdCatalogo
                            where p.Clave == Clave
                            select new ProyectosModel
                            {
                                IdProyecto = p.IdProyecto,
                                Nombre = p.Nombre,
                                Clave = p.Clave,
                                IdCliente = p.IdCliente,
                                IdClienteStr = cte.Nombre,
                                TipoProyectoId = p.TipoProyectoId,
                                TipoProyectoStr = c.DescLarga,
                                IdULider = p.IdULider,
                                IdULiderStr = u.Nombre + " " + u.ApPaterno + " " + u.ApMaterno,
                                Activo = p.Activo,
                                Descripcion = p.Descripcion,
                                SemaforoID = p.SemaforoID,
                                Avance = p.Avance,
                                AvanceReal = p.AvanceReal,
                                HorasEstimadasInicial = p.HorasEstimadasInicial,
                                FechaInicioPlan = p.FechaInicioPlan,
                                FechaFinPlan = p.FechaFinPlan,
                                IngresoPlan = p.IngresoPlan,
                                CostoPlan = p.CostoPlan,
                                MetodologiaId = p.MetodologiaId,
                                MetodologiaIdStr = c1.DescLarga,
                                EstatusId = c2.IdCatalogo,
                                Estatus = c2.DescCorta,
                                EstatusIdStr = c2.DescLarga
                            }).FirstOrDefault();

                    //var cd = contexto.ProyectoCI.Where(x => x.IdProyecto == Proy.IdProyecto).ToList().Sum(x => x.Monto);
                    //var ci = contexto.ProyectoCD
                    //    .Where(x => x.IdProyecto == Proy.IdProyecto && x.Aplicado)
                    //    .ToList()
                    //    .Sum(x => x.CostoPeriodo);
                    //Proy.CostoAplicado = cd + ci;
                }

                return Proy;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public int GuardarProyecto(ProyectosModel Proyecto, string Conexion)
        {

            try
            {
                Proyecto proy = new Proyecto();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;

                    if (Proyecto.IdProyecto == 0)
                    {

                        var valpro = contexto.Proyecto.Where(i => i.Nombre.ToUpper() == Proyecto.Nombre.ToUpper() || i.Clave.ToUpper() == Proyecto.Clave.ToUpper()).FirstOrDefault();

                        if (valpro != null)
                        {

                            return 2;
                        }

                        proy.IdCliente = Proyecto.IdCliente;
                        proy.Nombre = Proyecto.Nombre;
                        proy.Clave = Proyecto.Clave;
                        proy.TipoProyectoId = Proyecto.TipoProyectoId;
                        proy.IdULider = Proyecto.IdULider;
                        proy.Activo = Proyecto.Activo;
                        proy.IdUCreo = Proyecto.IdUCreo;
                        proy.FechaCreo = DateTime.Now;
                        proy.Descripcion = Proyecto.Descripcion;
                        proy.SemaforoID = Proyecto.SemaforoID;
                        proy.Avance = Proyecto.Avance;
                        proy.AvanceReal = Proyecto.AvanceReal;
                        proy.MetodologiaId = Proyecto.MetodologiaId;
                        proy.EstatusId = contexto.CatalogoGeneral.Where(w => w.IdTabla == 12 && w.DescCorta == "P").FirstOrDefault().IdCatalogo;
                        proy.Tecnologias = Proyecto.Tecnologias;
                        proy.PSP = Proyecto.PSP;
                        proy.FijarHoras = Proyecto.FijarHoras;
                        proy.HorasEstimadasInicial = Proyecto.HorasEstimadasInicial;
                        proy.HorasPromedio = Proyecto.HorasPromedio;
                        proy.FijarFechas = Proyecto.FijarFechas;
                        proy.FechaFinComprometidaAnt = Proyecto.FechaFinComprometida != proy.FechaFinComprometida ? Proyecto.FechaFinComprometida : proy.FechaFinComprometidaAnt;
                        proy.FechaInicioPlan = Proyecto.FechaInicioPlan;
                        proy.FechaFinPlan = Proyecto.FechaFinPlan;
                        proy.FechaFinComprometida = Proyecto.FechaFinComprometida;
                        proy.CostoPlan = Proyecto.CostoPlan;
                        proy.ProyectoDocumentos = contexto.CatalogoGeneral.Where(w => w.IdTabla == 22 && w.DatoEspecial == "R").ToList()
                                                                      .Select(s => new ProyectoDocumentos
                                                                      {
                                                                          TipoDocumentoId = s.IdCatalogo,
                                                                          FechaCreo = DateTime.Now,
                                                                          IdUCreo = proy.IdUCreo,
                                                                          Activo = true

                                                                      }).ToList();


                        contexto.Proyecto.Add(proy);



                        //Agrego el usuario

                        ProyectoUsuario pu = new ProyectoUsuario();
                        pu.IdProyecto = proy.IdProyecto;
                        pu.IdUsuario = long.Parse(Proyecto.IdULider.ToString());
                        pu.Activo = true;
                        pu.IdUCreo = long.Parse(Proyecto.IdULider.ToString());
                        pu.FechaCreo = DateTime.Now;
                        pu.Participacion = 100;
                        pu.AdministraProy = true;

                        contexto.ProyectoUsuario.Add(pu);


                        //Agrego registro inicial del flujo
                        FlujoPago fp = new FlujoPago();
                        fp.IdProyecto = proy.IdProyecto;
                        fp.PrecioHora = Proyecto.PrecioHora;
                        fp.HorasTotales = decimal.Parse(proy.HorasEstimadasInicial.ToString());
                        fp.PorcIVA = Proyecto.PorcIVA;
                        fp.FechaCreo = DateTime.Now;
                        fp.IdUCreo = long.Parse(Proyecto.IdULider.ToString());
                        fp.Activo = true;
                        fp.HorasAmortizar = 0;

                        contexto.FlujoPago.Add(fp);
                        //contexto.SaveChanges();

                        var fpd = new FlujoPagoDetalle();

                        fpd.IdFlujoPago = fp.IdFlujoPago;
                        fpd.Secuencia = 1;
                        fpd.Concepto = "Registro inicial en flujo de pagos";
                        fpd.Horas = decimal.Parse(proy.HorasEstimadasInicial.ToString());
                        fpd.Amortizadas = 0;
                        fpd.Procentaje = 100;
                        fpd.Monto = Proyecto.IngresoPlan;
                        fpd.Facturable = false;
                        fpd.Facturada = false;
                        fpd.Pagada = false;
                        fpd.Comentarios = "Registro generado automaticamente al crear el proyecto";

                        contexto.FlujoPagoDetalle.Add(fpd);

                        //contexto.SaveChanges();


                        //Si se usa una plantilla le heredo las actividades
                        if (Proyecto.IdPlantilla != 0)
                        {
                            var LstAct = contexto.Actividad.Where(w => w.IdProyecto == Proyecto.IdPlantilla)
                                           .Select(s => new ActividadesModel
                                           {
                                               Critico = s.Critico,
                                               BR = s.BR,
                                               Backlog = s.Backlog,
                                               Descripcion = s.Descripcion,
                                               Prioridad = s.Prioridad,
                                               Planificada = s.Planificada,
                                               HorasAsignadas = s.HorasAsignadas,
                                               HorasFacturables = s.HorasFacturables,
                                               HorasFinales = 0,
                                               TiempoEjecucion = s.TiempoEjecucion,
                                               IdProyecto = proy.IdProyecto,
                                               TipoActividadId = s.TipoActividadId,
                                               ClasificacionId = s.ClasificacionId,
                                               IdUsuarioResponsable = Proyecto.IdULider,

                                               IdListaRevision = s.IdListaRevision,
                                               Retrabajo = s.Retrabajo,
                                               TipoId = s.TipoId,
                                               CriterioAceptacion = s.CriterioAceptacion
                                           }).ToList();

                            var Lst = LstAct.Select(s => new Actividad
                            {
                                Critico = s.Critico,
                                BR = s.BR,
                                IdUsuarioAsignado = Proyecto.IdULider,
                                Backlog = s.Backlog,
                                Descripcion = s.Descripcion,
                                Estatus = "A",
                                EstatusCte = "A",
                                Prioridad = s.Prioridad,
                                Planificada = s.Planificada,
                                HorasAsignadas = s.HorasAsignadas,
                                HorasFacturables = s.HorasFacturables,
                                HorasFinales = 0,
                                TiempoEjecucion = s.TiempoEjecucion,
                                IdProyecto = proy.IdProyecto,
                                TipoActividadId = s.TipoActividadId,
                                ClasificacionId = s.ClasificacionId,
                                IdUsuarioResponsable = Proyecto.IdULider,
                                FechaSolicitado = DateTime.Now.AddDays(5),
                                FechaInicio = DateTime.Now,
                                IdUCreo = long.Parse(Proyecto.IdULider.ToString()),
                                FechaCreo = DateTime.Now,
                                IdUMod = Proyecto.IdULider,
                                FechaMod = DateTime.Now,
                                IdListaRevision = s.IdListaRevision,
                                Retrabajo = s.Retrabajo,
                                TipoId = s.TipoId,
                                CriterioAceptacion = s.CriterioAceptacion
                            }).ToList();

                            contexto.Actividad.AddRange(Lst);
                            contexto.SaveChanges();
                        }


                        //Agrego los documentos que van por defecto siempre
                        //List<ProyectoDocumentos> proyectoDocumentos = contexto.CatalogoGeneral.Where(w => w.IdTabla == 22 && w.DatoEspecial == "R")
                        //                                              .Select(s => new ProyectoDocumentos
                        //                                              {
                        //                                                  TipoDocumentoId = s.IdCatalogo,
                        //                                                  IdProyecto = proy.IdProyecto,
                        //                                                  FechaCreo = DateTime.Now,
                        //                                                  IdUCreo = proy.IdUCreo,
                        //                                                  Activo = true

                        //                                              }).ToList();

                        //contexto.ProyectoDocumentos.AddRange(proyectoDocumentos);
                        ////contexto.SaveChanges();
                        ///

                        // AGREGO EL FLUJO  DE TRABAJO


                        var lst = (from wfd in contexto.WorkFlowConfigDetail
                                   from at in contexto.ActividadTipo
                                   where wfd.IdWorkFlowC == 1 && at.Activo == true && wfd.IdWorkFlowC == Proyecto.IdWorkFlow
                                   select new
                                   {
                                       IdProyecto = proy.IdProyecto,
                                       IdActividadTipo = at.ActividadTipoId,
                                       Nombre = wfd.Nombre,
                                       Orden = wfd.Orden,
                                       Color = wfd.Color,
                                       ColorTexto = wfd.ColorTexto,
                                       EstatusR = wfd.EstatusR,
                                       WIP = wfd.WIP,
                                       Notifica = wfd.Notifica,
                                       TipoNotificacion = wfd.TipoNotificacion,
                                       Editable = wfd.Editable
                                   }).ToList();

                        List<WorkFlow> LstWorkFlow = lst.
                                                    Select(s => new WorkFlow
                                                    {
                                                        IdProyecto = s.IdProyecto,
                                                        IdActividadTipo = s.IdActividadTipo,
                                                        Nombre = s.Nombre,
                                                        Orden = s.Orden,
                                                        Color = s.Color,
                                                        ColorTexto = s.ColorTexto,
                                                        EstatusR = s.EstatusR,
                                                        WIP = s.WIP,
                                                        Notifica = s.Notifica,
                                                        TipoNotificacion = s.TipoNotificacion,
                                                        Editable = s.Editable,
                                                        IdUCreo = long.Parse(Proyecto.IdULider.ToString()),
                                                        FechaCreo = DateTime.Now

                                                    }).ToList();

                        contexto.WorkFlow.AddRange(LstWorkFlow);


                        contexto.SaveChanges();

                    }
                    else
                    {


                        var valpro = contexto.Proyecto.Where(i => i.IdProyecto != Proyecto.IdProyecto && i.Clave.ToUpper() == Proyecto.Clave.ToUpper()).FirstOrDefault();

                        if (valpro != null)
                        {

                            return 2;
                        }


                        proy = contexto.Proyecto.Where(i => i.IdProyecto == Proyecto.IdProyecto).FirstOrDefault();

                        proy.IdCliente = Proyecto.IdCliente;
                        proy.Nombre = Proyecto.Nombre;
                        proy.Clave = Proyecto.Clave;
                        proy.TipoProyectoId = Proyecto.TipoProyectoId;
                        proy.IdULider = Proyecto.IdULider;
                        proy.Activo = Proyecto.Activo;
                        proy.IdUModifico = Proyecto.IdUCreo;
                        proy.FechaModifico = DateTime.Now;

                        proy.Descripcion = Proyecto.Descripcion;
                        proy.SemaforoID = Proyecto.SemaforoID;


                        proy.HorasEstimadasInicial = Proyecto.HorasEstimadasInicial;
                        proy.FechaInicioPlan = Proyecto.FechaInicioPlan;
                        proy.FechaFinPlan = Proyecto.FechaFinPlan;
                        proy.IngresoPlan = Proyecto.IngresoPlan;
                        proy.CostoPlan = Proyecto.CostoPlan;
                        proy.EstatusId = Proyecto.EstatusId;
                        proy.MetodologiaId = Proyecto.MetodologiaId;

                        contexto.SaveChanges();

                    }

                    return 1;


                }

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public bool CambiaEstatusProyecto(long IdProyecto, string Estatus, string Conexion)
        {
            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    long idEstatus = contexto.CatalogoGeneral.Where(w => w.IdTabla == 12 && w.DescCorta == Estatus).FirstOrDefault().IdCatalogo;

                    var p = contexto.Proyecto.Where(w => w.IdProyecto == IdProyecto).FirstOrDefault();

                    p.EstatusId = idEstatus;
                    contexto.SaveChanges();


                }

                return true;
            }
            catch (Exception ex)
            {

                throw ex;
            }


        }

        #region UsuariosProyecto
        public List<UsuarioModel> ConsultaUsuariosProyecto(long IdProyecto, string Conexion)
        {
            try
            {
                List<UsuarioModel> LstUsuario = new List<UsuarioModel>();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {




                    var DiasMes = contexto.CalendarioTrabajo.Where(w => w.IdAnio == DateTime.Now.Year && w.IdMes == DateTime.Now.Month).FirstOrDefault()?.DiasLaborales ?? 0;
                    LstUsuario = contexto.ProyectoUsuario.Where(w => w.IdProyecto == IdProyecto && w.Activo == true).Select(s =>

                       new UsuarioModel
                       {
                           IdProyectoUsuario = s.IdProyectoUsuario,
                           IdUsuario = s.Usuario.IdUsuario,
                           IdTipoUsuario = s.Usuario.IdTipoUsuario,
                           NumEmpleado = s.Usuario.NumEmpleado,
                           DescripcionTipoUsuario = s.Usuario.TipoUsuario.Nombre,
                           NombreCompleto = s.Usuario.Nombre + " " + s.Usuario.ApPaterno + " " + s.Usuario.ApMaterno,
                           Participacion = s.Participacion == null ? 0 : s.Participacion,
                           Objetivo = (s.Usuario.Niveles.EstandarDiario * DiasMes) * (s.Participacion == null ? 0 : s.Participacion / 100),
                           AdministraProy = s.AdministraProy,
                           ActivoStr = s.Usuario.Activo == true ? "Si" : "No"

                       }
                        ).ToList();
                }

                return LstUsuario;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public List<UsuarioModel> ConsultaUsuariosProyectoV2(ref decimal? HorasPromedio, ref decimal? Cobertura, ref decimal? CoberturaPorc, long IdProyecto, string Conexion)
        {
            try
            {
                List<UsuarioModel> LstUsuario = new List<UsuarioModel>();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {




                    HorasPromedio = contexto.Proyecto.Where(w => w.IdProyecto == IdProyecto).FirstOrDefault().HorasPromedio == null ? 0 : decimal.Parse(contexto.Proyecto.Where(w => w.IdProyecto == IdProyecto).FirstOrDefault().HorasPromedio.ToString());

                    var DiasMes = contexto.CalendarioTrabajo.Where(w => w.IdAnio == DateTime.Now.Year && w.IdMes == DateTime.Now.Month).FirstOrDefault()?.DiasLaborales ?? 0;
                    LstUsuario = contexto.ProyectoUsuario.Where(w => w.IdProyecto == IdProyecto && w.Activo == true).Select(s =>

                       new UsuarioModel
                       {
                           IdProyectoUsuario = s.IdProyectoUsuario,
                           IdUsuario = s.Usuario.IdUsuario,
                           IdTipoUsuario = s.Usuario.IdTipoUsuario,
                           NumEmpleado = s.Usuario.NumEmpleado,
                           DescripcionTipoUsuario = s.Usuario.TipoUsuario.Nombre,
                           NombreCompleto = s.Usuario.Nombre + " " + s.Usuario.ApPaterno + " " + s.Usuario.ApMaterno,
                           Participacion = s.Participacion == null ? 0 : s.Participacion,
                           Objetivo = (s.Usuario.Niveles.EstandarDiario * DiasMes) * (s.Participacion == null ? 0 : s.Participacion / 100),
                           AdministraProy = s.AdministraProy,
                           ActivoStr = s.Usuario.Activo == true ? "Si" : "No"

                       }
                        ).ToList();

                    Cobertura = LstUsuario.Sum(s => s.Objetivo);
                    CoberturaPorc = HorasPromedio == 0 ? 0 : (Cobertura / HorasPromedio) * 100;

                }

                return LstUsuario;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }


        public List<UsuarioModel> ConsultarEquipoProyecto(long idProyecto, string conexionEF)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var usuarios = contexto.Usuario.Where(x => contexto.ProyectoUsuario.Where(y => y.IdProyecto == idProyecto && y.Activo).Select(y => y.IdUsuario).ToList().Contains(x.IdUsuario)).Select(
                    x => new UsuarioModel
                    {
                        IdUsuario = x.IdUsuario,
                        NombreCompleto = x.Nombre + " " + x.ApPaterno + " " + x.ApMaterno,
                        NumEmpleado = x.NumEmpleado,
                        IdTipoUsuario = x.IdTipoUsuario,

                    });

                var lider = contexto.Usuario.Select(x => new UsuarioModel
                {
                    IdUsuario = x.IdUsuario,
                    NombreCompleto = x.Nombre + " " + x.ApPaterno + " " + x.ApMaterno,
                    NumEmpleado = x.NumEmpleado,
                    IdTipoUsuario = x.IdTipoUsuario
                }).Where(u => u.IdUsuario == contexto.Proyecto.FirstOrDefault(x => x.IdProyecto == idProyecto).IdULider);

                var equipo = usuarios.Union(lider).Distinct();

                return equipo.ToList();
            }
        }

        public List<CatalogoGeneralModel> ConsultaUsuariosProyectoCombo(long IdProyecto, string Conexion)
        {
            try
            {
                List<CatalogoGeneralModel> LstUsuario = new List<CatalogoGeneralModel>();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {


                    LstUsuario = contexto.ProyectoUsuario.Where(w => w.IdProyecto == IdProyecto && w.Activo == true).Select(s =>

                       new CatalogoGeneralModel
                       {
                           IdCatalogo = s.Usuario.IdUsuario,
                           DescCorta = s.Usuario.NumEmpleado,
                           DescLarga = s.Usuario.Nombre + " " + s.Usuario.ApPaterno


                       }
                        ).ToList();
                }

                return LstUsuario;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }




        public List<UsuarioModel> ConsultaUsuariosAgregar(long IdProyecto, long DepartamentoId, string Conexion)
        {

            try
            {


                List<UsuarioModel> LstUsuario = new List<UsuarioModel>();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    var usuariosp = contexto.ProyectoUsuario.Where(w => w.IdProyecto == IdProyecto && w.Activo == true && w.Usuario.Activo == true && w.Usuario.IdTipoUsuario == 14).Select(s => s.IdUsuario).ToList();

                    LstUsuario = contexto.Usuario.Where(w => !usuariosp.Contains(w.IdUsuario) && w.Activo == true && (w.IdTipoUsuario == 14 || w.IdTipoUsuario == 15 || w.IdTipoUsuario == 20 || w.IdTipoUsuario == 17 || w.IdTipoUsuario == 19) && (w.DepartamentoId == DepartamentoId || w.DepartamentoId == 214)).Select(s =>
                   new UsuarioModel
                   {
                       IdUsuario = s.IdUsuario,
                       NumEmpleado = s.NumEmpleado,
                       NombreCompleto = s.Nombre + " " + s.ApPaterno + " " + s.ApMaterno


                   }
                        ).OrderBy(o => o.NombreCompleto).ToList();
                }

                return LstUsuario;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public bool GuardarUsuarioProyecto(ProyectoUsuarioModel Usuario, long IdUsuario, string Conexion)
        {
            try
            {

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    //JMM: Si exite lo activo, si no lo agrego
                    var existe = contexto.ProyectoUsuario.Where(w => w.IdProyecto == Usuario.IdProyecto && w.IdUsuario == Usuario.IdUsuario).FirstOrDefault();


                    if (existe == null)
                    {
                        ProyectoUsuario pu = new ProyectoUsuario();
                        pu.IdProyecto = Usuario.IdProyecto;
                        pu.IdUsuario = Usuario.IdUsuario;
                        pu.Activo = true;
                        pu.IdUCreo = IdUsuario;
                        pu.FechaCreo = DateTime.Now;
                        pu.Participacion = 100;
                        pu.AdministraProy = false;

                        contexto.ProyectoUsuario.Add(pu);

                    }
                    else
                    {

                        existe.Activo = true;
                        existe.IdUMod = IdUsuario;
                        existe.FechaMod = DateTime.Now;
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


        public bool EliminarUsuarioProyecto(long IdProyectoUsuario, long IdUsuario, string Conexion)
        {
            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    var user = contexto.ProyectoUsuario.Where(w => w.IdProyectoUsuario == IdProyectoUsuario).FirstOrDefault();

                    user.Activo = false;
                    user.IdUMod = IdUsuario;
                    user.FechaMod = DateTime.Now;

                    contexto.SaveChanges();

                }

                return true;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public bool GuardarUsuarioParticipacion(ProyectoUsuarioModel ProyectoU, string Conexion)
        {
            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    var p = contexto.ProyectoUsuario.Where(w => w.IdProyectoUsuario == ProyectoU.IdProyectoUsuario).FirstOrDefault();

                    p.Participacion = ProyectoU.Participacion;
                    p.IdUMod = ProyectoU.IdUMod;
                    p.FechaMod = DateTime.Now;

                    contexto.SaveChanges();
                }

                return true;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public bool GuardarUsuarioAdministra(long IdProyectoUsuario, bool AdministraProy, string Conexion)
        {
            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    var pu = contexto.ProyectoUsuario.Where(w => w.IdProyectoUsuario == IdProyectoUsuario).FirstOrDefault();

                    pu.AdministraProy = AdministraProy;

                    contexto.SaveChanges();
                }

                return true;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        #endregion
        public int GuardarSprint(ProyectoIteracionModel Sprint, string Conexion)
        {
            try
            {

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    //Nuevo
                    if (Sprint.IdIteracion == 0)
                    {

                        // Valido que no exista otro sprint con el mism nombre para el proyecto

                        var existe = contexto.ProyectoIteracion.Where(w => w.Nombre.ToUpper() == Sprint.Nombre.ToUpper() && w.IdProyecto == Sprint.IdProyecto).FirstOrDefault();

                        if (existe != null)
                        {

                            return 2;
                        }

                        ProyectoIteracion s = new ProyectoIteracion();

                        s.Nombre = Sprint.Nombre;
                        s.IdProyecto = Sprint.IdProyecto;
                        s.Objetivo = Sprint.Objetivo;
                        s.FechaInicio = Sprint.FechaInicio;
                        s.FechaFin = Sprint.FechaFin;
                        s.IdUCreo = Sprint.IdUCreo;
                        s.Estatus = "A";
                        s.FechaCreo = DateTime.Now.Date;

                        contexto.ProyectoIteracion.Add(s);

                    }
                    else
                    {
                        // Valido que no exista otro sprint con el mism nombre para el proyecto y que no sea el que estoy editando
                        var existe = contexto.ProyectoIteracion.Where(w => w.Nombre.ToUpper() == Sprint.Nombre.ToUpper() && w.IdProyecto == Sprint.IdProyecto && w.IdIteracion != Sprint.IdIteracion).FirstOrDefault();

                        if (existe != null)
                        {

                            return 2;
                        }

                        var sp = contexto.ProyectoIteracion.Where(w => w.IdIteracion == Sprint.IdIteracion).FirstOrDefault();

                        sp.Nombre = Sprint.Nombre;
                        sp.Objetivo = Sprint.Objetivo;
                        sp.FechaInicio = Sprint.FechaInicio;
                        sp.FechaFin = Sprint.FechaFin;
                        sp.IdUMod = Sprint.IdUCreo;
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

        public List<ProyectoIteracionModel> ConsultaSprints(long IdProyecto, string Conexion)
        {
            try
            {

                List<ProyectoIteracionModel> LstSprints = new List<ProyectoIteracionModel>();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    LstSprints = contexto.ProyectoIteracion.Where(w => w.IdProyecto == IdProyecto)
                                 .Select(s =>
                                new ProyectoIteracionModel
                                {
                                    IdIteracion = s.IdIteracion,
                                    IdProyecto = s.IdProyecto,
                                    Nombre = s.Nombre,
                                    Objetivo = s.Objetivo,
                                    FechaInicio = s.FechaInicio,
                                    FechaFin = s.FechaFin,
                                    Estatus = s.Estatus,
                                    Actividades = s.Actividad.Select(
                                                  sa => new ActividadesModel
                                                  {
                                                      IdActividad = sa.IdActividad,
                                                      IdActividadStr = s.Proyecto.Clave + "- " + sa.IdActividad.ToString(),
                                                      IdUsuarioAsignado = sa.IdUsuarioAsignado,
                                                      ClaveTipoActividad = contexto.CatalogoGeneral.Where(c => c.IdCatalogo == sa.TipoActividadId).Select(i => i.DescCorta).FirstOrDefault(),
                                                      ProyectoStr = contexto.Proyecto.Where(c => c.IdProyecto == sa.IdProyecto).Select(i => i.Nombre).FirstOrDefault(),
                                                      ClaveUsuario = contexto.Usuario.Where(c => c.IdUsuario == sa.IdUsuarioAsignado).Select(i => i.NumEmpleado).FirstOrDefault(),
                                                      Descripcion = sa.Descripcion,
                                                      DocumentoRef = sa.DocumentoRef,
                                                      Estatus = sa.Estatus,
                                                      Prioridad = sa.Prioridad,
                                                      Planificada = sa.Planificada,
                                                      ComentariosFinales = sa.ComentariosFinales,
                                                      BR = sa.BR,
                                                      HorasFacturables = sa.HorasFacturables,
                                                      HorasAsignadas = sa.HorasAsignadas,
                                                      HorasFinales = sa.HorasFinales,
                                                      IdProyecto = sa.IdProyecto,
                                                      TipoActividadId = sa.TipoActividadId,
                                                      ClasificacionId = sa.ClasificacionId,
                                                      //IdActividadRef = s.IdActividadRef,
                                                      FechaSolicitado = sa.FechaSolicitado,
                                                      FechaInicio = sa.FechaInicio,
                                                      FechaTermino = sa.FechaTermino,
                                                      FechaRevision = sa.FechaRevision,
                                                      FechaCierre = sa.FechaCierre,
                                                      IdUsuarioResponsable = sa.IdUsuarioResponsable,
                                                      DescripcionRechazo = sa.DescripcionRechazo,
                                                      EvidenciaRechazo = sa.EvidenciaRechazo,

                                                  }).ToList()

                                }


                        ).ToList();

                }

                return LstSprints;


            }
            catch (Exception ex)
            {

                throw ex;
            }

        }


        public List<ActividadesModel> ConsultaBacklog(long IdProyecto, string Conexion)
        {
            try
            {
                List<ActividadesModel> LstBacklog = new List<ActividadesModel>();
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {




                    LstBacklog = contexto.Actividad.Where(w => w.IdProyecto == IdProyecto && w.IdIteracion == null && w.Estatus == "A")
                                 .Select(sa => new ActividadesModel
                                 {
                                     IdActividad = sa.IdActividad,
                                     IdActividadStr = sa.Proyecto.Clave + "-" + sa.IdActividad.ToString(),
                                     IdUsuarioAsignado = sa.IdUsuarioAsignado,
                                     ClaveTipoActividad = contexto.CatalogoGeneral.Where(c => c.IdCatalogo == sa.TipoActividadId).Select(i => i.DescCorta).FirstOrDefault(),
                                     ProyectoStr = sa.Proyecto.Nombre,
                                     ClaveUsuario = contexto.Usuario.Where(c => c.IdUsuario == sa.IdUsuarioAsignado).Select(i => i.NumEmpleado).FirstOrDefault(),
                                     Descripcion = sa.Descripcion,
                                     DocumentoRef = sa.DocumentoRef,
                                     Estatus = sa.Estatus,
                                     Prioridad = sa.Prioridad,
                                     Planificada = sa.Planificada,
                                     ComentariosFinales = sa.ComentariosFinales,
                                     BR = sa.BR,
                                     HorasFacturables = sa.HorasFacturables,
                                     HorasAsignadas = sa.HorasAsignadas,
                                     HorasFinales = sa.HorasFinales,
                                     IdProyecto = sa.IdProyecto,
                                     TipoActividadId = sa.TipoActividadId,
                                     ClasificacionId = sa.ClasificacionId,
                                     //IdActividadRef = s.IdActividadRef,
                                     FechaSolicitado = sa.FechaSolicitado,
                                     FechaInicio = sa.FechaInicio,
                                     FechaTermino = sa.FechaTermino,
                                     FechaRevision = sa.FechaRevision,
                                     FechaCierre = sa.FechaCierre,
                                     IdUsuarioResponsable = sa.IdUsuarioResponsable,
                                     DescripcionRechazo = sa.DescripcionRechazo,
                                     EvidenciaRechazo = sa.EvidenciaRechazo,

                                 }).OrderBy(o => o.FechaSolicitado).ToList();


                }

                return LstBacklog;


            }
            catch (Exception ex)
            {

                throw ex;
            }

        }


        public List<ActividadesModel> ConsultaBacklogV2(long IdProyecto, string Conexion)
        {
            try
            {
                List<ActividadesModel> LstBacklog = new List<ActividadesModel>();
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {




                    LstBacklog = contexto.Actividad.Where(w => w.IdProyecto == IdProyecto && w.IdIteracion == null && w.Estatus == "A")
                                 .Select(sa => new ActividadesModel
                                 {
                                     IdActividad = sa.IdActividad,
                                     IdActividadStr = sa.Proyecto.Clave + "-" + sa.IdActividad.ToString(),
                                     IdUsuarioAsignado = sa.IdUsuarioAsignado,
                                     ClaveTipoActividad = contexto.CatalogoGeneral.Where(c => c.IdCatalogo == sa.TipoActividadId).Select(i => i.DescCorta).FirstOrDefault(),
                                     ProyectoStr = sa.Proyecto.Nombre,
                                     ClaveUsuario = contexto.Usuario.Where(c => c.IdUsuario == sa.IdUsuarioAsignado).Select(i => i.NumEmpleado).FirstOrDefault(),
                                     Descripcion = sa.Descripcion,
                                     DocumentoRef = sa.DocumentoRef,
                                     Estatus = sa.Estatus,
                                     Prioridad = sa.Prioridad,
                                     Planificada = sa.Planificada,
                                     ComentariosFinales = sa.ComentariosFinales,
                                     BR = sa.BR,
                                     HorasFacturables = sa.HorasFacturables,
                                     HorasAsignadas = sa.HorasAsignadas,
                                     HorasFinales = sa.HorasFinales,
                                     IdProyecto = sa.IdProyecto,
                                     TipoActividadId = sa.TipoActividadId,
                                     ClasificacionId = sa.ClasificacionId,
                                     //IdActividadRef = s.IdActividadRef,
                                     FechaSolicitado = sa.FechaSolicitado,
                                     FechaInicio = sa.FechaInicio,
                                     FechaTermino = sa.FechaTermino,
                                     FechaRevision = sa.FechaRevision,
                                     FechaCierre = sa.FechaCierre,
                                     IdUsuarioResponsable = sa.IdUsuarioResponsable,
                                     DescripcionRechazo = sa.DescripcionRechazo,
                                     EvidenciaRechazo = sa.EvidenciaRechazo,

                                 }).OrderBy(o => o.FechaSolicitado).ToList();


                }

                return LstBacklog;


            }
            catch (Exception ex)
            {

                throw ex;
            }

        }


        public List<ActividadesModel> ConsultaBacklogFiltro(long IdProyecto, string Busqueda, string Conexion)
        {
            try
            {
                List<ActividadesModel> LstBacklog = new List<ActividadesModel>();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {




                    var lst = contexto.Actividad.Where(w => w.IdProyecto == IdProyecto && w.IdIteracion == null && w.Estatus == "A")
                                 .Select(sa => new ActividadesModel
                                 {
                                     IdActividad = sa.IdActividad,
                                     IdActividadStr = sa.IdActividad.ToString(),
                                     IdUsuarioAsignado = sa.IdUsuarioAsignado,
                                     ClaveTipoActividad = contexto.CatalogoGeneral.Where(c => c.IdCatalogo == sa.TipoActividadId).Select(i => i.DescCorta).FirstOrDefault(),
                                     ProyectoStr = contexto.Proyecto.Where(c => c.IdProyecto == sa.IdProyecto).Select(i => i.Nombre).FirstOrDefault(),
                                     ClaveUsuario = contexto.Usuario.Where(c => c.IdUsuario == sa.IdUsuarioAsignado).Select(i => i.NumEmpleado).FirstOrDefault(),
                                     AsignadoStr = contexto.Usuario.Where(c => c.IdUsuario == sa.IdUsuarioAsignado).Select(i => i.Nombre + " " + i.ApPaterno + " " + i.ApMaterno).FirstOrDefault(),
                                     //sa.Usuario.Nombre + " "  +  sa.Usuario.ApPaterno  +  " " +  sa.Usuario.ApMaterno,
                                     ResponsableStr = contexto.Usuario.Where(c => c.IdUsuario == sa.IdUsuarioResponsable).Select(i => i.Nombre + " " + i.ApPaterno + " " + i.ApMaterno).FirstOrDefault(),
                                     Descripcion = sa.BR,
                                     DocumentoRef = sa.DocumentoRef,
                                     Estatus = sa.Estatus,
                                     Prioridad = sa.Prioridad,
                                     Planificada = sa.Planificada,
                                     ComentariosFinales = sa.ComentariosFinales,
                                     BR = sa.BR,
                                     HorasFacturables = sa.HorasFacturables,
                                     HorasAsignadas = sa.HorasAsignadas,
                                     HorasFinales = sa.HorasFinales,
                                     IdProyecto = sa.IdProyecto,
                                     TipoActividadId = sa.TipoActividadId,
                                     ClasificacionId = sa.ClasificacionId,
                                     //IdActividadRef = s.IdActividadRef,
                                     FechaSolicitado = sa.FechaSolicitado,
                                     FechaInicio = sa.FechaInicio,
                                     FechaTermino = sa.FechaTermino,
                                     FechaRevision = sa.FechaRevision,
                                     FechaCierre = sa.FechaCierre,
                                     IdUsuarioResponsable = sa.IdUsuarioResponsable,
                                     DescripcionRechazo = sa.DescripcionRechazo,
                                     EvidenciaRechazo = sa.EvidenciaRechazo,

                                 }).OrderBy(o => o.FechaSolicitado).ToList();


                    LstBacklog = lst.Where(w => w.IdActividadStr.Contains(Busqueda) || w.BR.Contains(Busqueda) || w.ResponsableStr.Contains(Busqueda) || w.AsignadoStr.Contains(Busqueda)).ToList();


                }

                return LstBacklog;


            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public bool AsignaActividad(long IdActividad, long IdIteracion, string Conexion)
        {
            try
            {

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;

                    var actividad = contexto.Actividad.Where(w => w.IdActividad == IdActividad).FirstOrDefault();

                    actividad.IdIteracion = IdIteracion;
                    contexto.SaveChanges();

                }

                return true;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public List<CatalogoGeneralModel> ComboSprints(List<long> LstProyectos, string Conexion)
        {
            try
            {

                List<CatalogoGeneralModel> LstSprints = new List<CatalogoGeneralModel>();
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    LstSprints = contexto.ProyectoIteracion.Where(w => LstProyectos.Contains(w.IdProyecto))
                                  .Select(s => new CatalogoGeneralModel
                                  {
                                      IdCatalogo = s.IdIteracion,
                                      DescCorta = s.Nombre,
                                      DescLarga = s.Nombre

                                  }).ToList();
                }

                return LstSprints;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public List<CatalogoGeneralModel> ComboSprintsProyecto(long IdProyecto, string Conexion)
        {
            try
            {

                List<CatalogoGeneralModel> LstSprints = new List<CatalogoGeneralModel>();
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    LstSprints = contexto.ProyectoIteracion.Where(w => w.IdProyecto == IdProyecto && w.Estatus != "C")
                                  .Select(s => new CatalogoGeneralModel
                                  {
                                      IdCatalogo = s.IdIteracion,
                                      DescCorta = s.Nombre,
                                      DescLarga = s.Nombre

                                  }).ToList();
                }

                return LstSprints;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }





        public void ProyectoActividades(FiltrosModel Filtros, ref List<ActividadesModel> LstActividades, ref List<ActividadesModel> LstActividadesEnc,
                                       ref List<ActividadesModel> LstActividadesReq, ref List<ActividadesModel> LstActividadesSprint, ref List<ActividadesModel> LstActividadesRecurso,
                                       string Conexion)
        {
            try
            {

                var tipoactividad = string.Join<string>(",", Filtros.LstTipoActividad.ConvertAll(s => s.ToString()));
                var clasificacion = string.Join<string>(",", Filtros.LstClasificacion.ConvertAll(s => s.ToString()));
                var asignado = string.Join<string>(",", Filtros.LstAsignado.ConvertAll(s => s.ToString()));
                var responsable = string.Join<string>(",", Filtros.LstResponsable.ConvertAll(s => s.ToString()));
                var proyecto = string.Join<string>(",", Filtros.LstProyecto.ConvertAll(s => s.ToString()));
                var prioridad = string.Join<string>(",", Filtros.LstPrioridad.ConvertAll(s => s.ToString()));
                var estatus = string.Join<string>(",", Filtros.LstEstatus.ConvertAll(s => s.ToString()));
                var sprint = string.Join<string>(",", Filtros.LstSprints.ConvertAll(s => s.ToString()));

                //var con = new SqlConnection(Conexion);
                //con.Open();

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("ProyectoActividades_sp", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@FechaCreoIni", Filtros.FechaCreoIni);
                sqlcmd.Parameters.AddWithValue("@FechaCreoFin", Filtros.FechaCreoFin);
                sqlcmd.Parameters.AddWithValue("@FechaSolIni", Filtros.FechaSolIni);
                sqlcmd.Parameters.AddWithValue("@FechaSolFin", Filtros.FechaSolFin);
                sqlcmd.Parameters.AddWithValue("@FechaCierreIni", Filtros.FechaCierreIni);
                sqlcmd.Parameters.AddWithValue("@FechaCierreFin", Filtros.FechaCierreFin);
                sqlcmd.Parameters.AddWithValue("@TipoActividad", tipoactividad);
                sqlcmd.Parameters.AddWithValue("@Clasificacion", clasificacion);
                sqlcmd.Parameters.AddWithValue("@UsuarioAsignado", asignado);
                sqlcmd.Parameters.AddWithValue("@UsuarioResponsable", responsable);
                sqlcmd.Parameters.AddWithValue("@Proyecto", proyecto);
                sqlcmd.Parameters.AddWithValue("@Estatus", estatus);
                sqlcmd.Parameters.AddWithValue("@Prioridad", prioridad);
                sqlcmd.Parameters.AddWithValue("@Actividad", Filtros.Actividades == null ? "" : Filtros.Actividades);
                sqlcmd.Parameters.AddWithValue("@IdUsuario", Filtros.IdUsuario);
                sqlcmd.Parameters.AddWithValue("@Sprint", sprint);

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
                da.Fill(ds);
                da.Dispose();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();


                var LstAct = ds.Tables[0];
                //var Log = ds.Tables[1];

                LstActividades = (from row in LstAct.AsEnumerable()
                                  select (
                                  new ActividadesModel
                                  {
                                      IdActividad = long.Parse(row["IdActividad"].ToString()),
                                      IdProyecto = long.Parse(row["IdProyecto"].ToString()),
                                      Estatus = row["Estatus"].ToString(),
                                      EstatusStr = row["EstatusStr"].ToString(),
                                      Descripcion = row["Descripcion"].ToString(),
                                      TipoActividadStr = row["TipoActividad"].ToString(),
                                      ClasificacionStr = row["Clasificacion"].ToString(),
                                      PrioridadStr = row["PrioridadStr"].ToString(),
                                      AsignadoStr = row["Asignado"].ToString(),
                                      ResponsableStr = row["Responsable"].ToString(),
                                      AsignadoPath = "/Archivos/Fotos/" + row["AsignadoNumEmpleado"].ToString() + ".jpg",
                                      ResponsablePath = "/Archivos/Fotos/" + row["ResponsableNumEmpleado"].ToString() + ".jpg",
                                      ProyectoStr = row["Proyecto"].ToString(),
                                      FechaCreo = DateTime.Parse(row["FechaCreo"].ToString()),
                                      FechaSolicitado = DateTime.Parse(row["FechaSolicitado"].ToString()),
                                      HorasFacturables = decimal.Parse(row["HorasFacturables"].ToString()),
                                      HorasAsignadas = decimal.Parse(row["HorasAsignadas"].ToString()),
                                      HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),
                                      FechaTermino = row["FechaTermino"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaTermino"].ToString()),
                                      MotivoRechazoId = row["MotivoRechazoId"].ToString() == "" ? (long?)null : long.Parse(row["MotivoRechazoId"].ToString()),
                                      DescripcionRechazo = row["DescripcionRechazo"].ToString(),
                                      ClaveTipoActividad = row["ClaveTipoActividad"].ToString(),
                                      ClaveUsuario = row["ClaveUsuario"].ToString(),
                                      Sprint = row["Sprint"].ToString(),
                                      FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
                                      EstatusCte = row["EstatusCte"].ToString(),
                                      EstatusCteStr = row["EstatusCteStr"].ToString(),
                                      ClaveClasificacionActividad = row["ClaveClasificacionActividad"].ToString(),
                                      ComentariosTotal = int.Parse(row["Comentarios"].ToString()),
                                      ArchivosTotal = int.Parse(row["Archivos"].ToString()),
                                      PSP = int.Parse(row["PSP"].ToString()),
                                      TipoActividadId = long.Parse(row["TipoActividadId"].ToString()),
                                      //BRSE = row["BRSE"].ToString(),
                                      BR = row["BR"].ToString(),
                                      DependenciasA = int.Parse(row["Dependencias"].ToString()),
                                      DependenciasT = int.Parse(row["DependenciasT"].ToString()),
                                      IdIteracion = long.Parse(row["IdIteracion"].ToString()),
                                      IdUsuarioAsignado = long.Parse(row["IdUsuarioAsignado"].ToString()),
                                      TipoNombre = row["TipoNombre"].ToString(),
                                      TipoUrl = row["TipoUrl"].ToString(),
                                      IdActividadD = long.Parse(row["IdActividadHu"].ToString()),
                                  })).OrderBy(o => o.IdActividad).ToList();


                var LstActEnc = ds.Tables[1];


                LstActividadesEnc = (from row in LstActEnc.AsEnumerable()
                                     select (
                                     new ActividadesModel
                                     {
                                         TipoActividadId = long.Parse(row["TipoActividadId"].ToString()),
                                         ClaveTipoActividad = row["ClaveTipoActividad"].ToString(),
                                         TipoActividadStr = row["TipoActividad"].ToString(),
                                         HorasFacturables = decimal.Parse(row["HorasFacturables"].ToString()),
                                         HorasAsignadas = decimal.Parse(row["HorasAsignadas"].ToString()),
                                         HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),
                                         FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
                                         FechaFin = DateTime.Parse(row["FechaFin"].ToString()),
                                     })).OrderBy(o => o.IdActividad).ToList();

                LstActividadesReq = (from row in ds.Tables[2].AsEnumerable()
                                     select (
                                     new ActividadesModel
                                     {
                                         IdActividadD = long.Parse(row["IdActividadHu"].ToString()),
                                         BR = row["BR"].ToString(),
                                         ClaveTipoActividad = row["BRSE"].ToString(),
                                         TipoActividadStr = row["BR"].ToString(),
                                         HorasFacturables = decimal.Parse(row["HorasFacturables"].ToString()),
                                         HorasAsignadas = decimal.Parse(row["HorasAsignadas"].ToString()),
                                         HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),
                                         FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
                                         FechaFin = DateTime.Parse(row["FechaFin"].ToString())
                                     })).OrderBy(o => o.IdActividad).ToList();

                LstActividadesSprint = (from row in ds.Tables[3].AsEnumerable()
                                        select (
                                        new ActividadesModel
                                        {
                                            IdIteracion = long.Parse(row["IdIteracion"].ToString()),
                                            Sprint = row["Sprint"].ToString(),
                                            ClaveTipoActividad = row["IdIteracion"].ToString(),
                                            TipoActividadStr = row["Sprint"].ToString(),
                                            HorasFacturables = decimal.Parse(row["HorasFacturables"].ToString()),
                                            HorasAsignadas = decimal.Parse(row["HorasAsignadas"].ToString()),
                                            HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),
                                            FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
                                            FechaFin = DateTime.Parse(row["FechaFin"].ToString())
                                        })).OrderBy(o => o.IdActividad).ToList();

                LstActividadesRecurso = (from row in ds.Tables[4].AsEnumerable()
                                         select (
                                         new ActividadesModel
                                         {
                                             IdUsuarioAsignado = long.Parse(row["IdUsuarioAsignado"].ToString()),
                                             AsignadoStr = row["Asignado"].ToString(),
                                             ClaveTipoActividad = row["IdUsuarioAsignado"].ToString(),
                                             TipoActividadStr = row["Asignado"].ToString(),
                                             HorasFacturables = decimal.Parse(row["HorasFacturables"].ToString()),
                                             HorasAsignadas = decimal.Parse(row["HorasAsignadas"].ToString()),
                                             HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),
                                             FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
                                             FechaFin = DateTime.Parse(row["FechaFin"].ToString())
                                         })).OrderBy(o => o.IdActividad).ToList();

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        #region Costos
        public List<ProyectoCDModel> ConsultaCostosDirectosProyecto(long IdProyecto, string Conexion)
        {
            try
            {
                List<ProyectoCDModel> LstCosto = new List<ProyectoCDModel>();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;

                    LstCosto = (from cd in contexto.ProyectoCD
                                join U in contexto.Usuario on cd.IdRecurso equals U.IdUsuario into udf
                                from U in udf.DefaultIfEmpty()
                                join g in contexto.CatalogoGeneral on cd.TipoActividadId equals g.IdCatalogo into gdf
                                from g in gdf.DefaultIfEmpty()
                                where cd.IdProyecto == IdProyecto
                                select new ProyectoCDModel
                                {
                                    IdProyectoCD = cd.IdProyectoCD,
                                    IdRecurso = cd.IdRecurso,
                                    Fase = g.DescCorta ?? "-",
                                    Nombre = cd.IdRecurso != null ? U.Nombre + " " + U.ApPaterno : cd.Nombre,
                                    FechaInicio = cd.FechaInicio,
                                    FechaFin = cd.FechaFin,
                                    Dias = cd.Dias,
                                    PorcDedicado = cd.PorcDedicado,
                                    HorasInvertidas = cd.HorasInvertidas,
                                    CostoPeriodo = cd.CostoPeriodo,
                                    Aplicado = cd.Aplicado,
                                    TipoActividadId = cd.TipoActividadId
                                }

                        ).ToList();
                }

                return LstCosto;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public int GuardaCostoDirecto(ProyectoCDModel CostoDirecto, string Conexion)
        {
            try
            {

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    if (CostoDirecto.IdProyectoCD == 0)
                    {

                        // Nuevo

                        decimal costomensual = 0;
                        if (CostoDirecto.IdRecurso == -1)
                        {
                            costomensual = CostoDirecto.CostoMensual;

                        }
                        else
                        {
                            costomensual = decimal.Parse(contexto.UsuarioCosto.Where(w => w.IdUsuario == CostoDirecto.IdRecurso).FirstOrDefault().CostoMensual.ToString());

                        }
                        var horasdia = decimal.Parse(contexto.Configuracion.Where(w => w.IdConf == 19).FirstOrDefault().Valor);
                        var diasmes = decimal.Parse(contexto.Configuracion.Where(w => w.IdConf == 20).FirstOrDefault().Valor);
                        var horasmes = horasdia * diasmes;
                        var horasinvertidas = (CostoDirecto.Dias * horasdia) * (CostoDirecto.PorcDedicado / 100);
                        var costoperiodo = Math.Round((costomensual / horasmes) * horasinvertidas, 2);

                        ProyectoCD c = new ProyectoCD();
                        c.IdProyecto = CostoDirecto.IdProyecto;
                        c.IdRecurso = CostoDirecto.IdRecurso == -1 ? (long?)null : CostoDirecto.IdRecurso;
                        c.TipoActividadId = CostoDirecto.TipoActividadId;
                        c.CostoMensual = costomensual;
                        c.Nombre = CostoDirecto.Nombre;
                        c.FechaInicio = CostoDirecto.FechaInicio;
                        c.FechaFin = CostoDirecto.FechaFin;
                        c.Dias = CostoDirecto.Dias;
                        c.PorcDedicado = CostoDirecto.PorcDedicado;
                        c.HorasInvertidas = horasinvertidas;
                        c.CostoPeriodo = costoperiodo;
                        c.Aplicado = CostoDirecto.Aplicado;
                        c.IdUCreo = CostoDirecto.IdUCreo;
                        c.FechaCreo = DateTime.Now;

                        contexto.ProyectoCD.Add(c);
                        contexto.SaveChanges();

                    }
                    else
                    {


                        var c = contexto.ProyectoCD.Where(w => w.IdProyectoCD == CostoDirecto.IdProyectoCD).FirstOrDefault();
                        decimal costomensual = 0;
                        if (CostoDirecto.IdRecurso == -1)
                        {
                            costomensual = CostoDirecto.CostoMensual;

                        }
                        else
                        {
                            costomensual = decimal.Parse(contexto.UsuarioCosto.Where(w => w.IdUsuario == CostoDirecto.IdRecurso).FirstOrDefault().CostoMensual.ToString());

                        }
                        var horasdia = decimal.Parse(contexto.Configuracion.Where(w => w.IdConf == 19).FirstOrDefault().Valor);
                        var diasmes = decimal.Parse(contexto.Configuracion.Where(w => w.IdConf == 20).FirstOrDefault().Valor);
                        var horasmes = horasdia * diasmes;
                        var horasinvertidas = (CostoDirecto.Dias * horasdia) * (CostoDirecto.PorcDedicado / 100);
                        var costoperiodo = Math.Round((costomensual / horasmes) * horasinvertidas, 2);

                        c.IdProyecto = CostoDirecto.IdProyecto;
                        c.IdRecurso = CostoDirecto.IdRecurso == -1 ? (long?)null : CostoDirecto.IdRecurso;
                        c.TipoActividadId = CostoDirecto.TipoActividadId;
                        c.CostoMensual = costomensual;
                        c.Nombre = CostoDirecto.Nombre;
                        c.FechaInicio = CostoDirecto.FechaInicio;
                        c.FechaFin = CostoDirecto.FechaFin;
                        c.Dias = CostoDirecto.Dias;
                        c.PorcDedicado = CostoDirecto.PorcDedicado;
                        c.HorasInvertidas = horasinvertidas;
                        c.CostoPeriodo = costoperiodo;
                        c.Aplicado = CostoDirecto.Aplicado;
                        c.IdUCreo = CostoDirecto.IdUCreo;
                        c.FechaCreo = DateTime.Now;

                        contexto.SaveChanges();

                    }




                }

                return 1;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }
        public ProyectoCDModel ConsultaCostoDirectoProyecto(long IdProyectoCD, string Conexion)
        {
            try
            {
                ProyectoCDModel Costo = new ProyectoCDModel();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;

                    var c = contexto.ProyectoCD.Where(w => w.IdProyectoCD == IdProyectoCD).FirstOrDefault();

                    Costo = (from cd in contexto.ProyectoCD
                             join U in contexto.Usuario on cd.IdRecurso equals U.IdUsuario into udf
                             from U in udf.DefaultIfEmpty()
                             join g in contexto.CatalogoGeneral on cd.TipoActividadId equals g.IdCatalogo into gdf
                             from g in gdf.DefaultIfEmpty()
                             where cd.IdProyectoCD == IdProyectoCD
                             select new ProyectoCDModel
                             {
                                 IdProyectoCD = cd.IdProyectoCD,
                                 IdRecurso = cd.IdRecurso,
                                 TipoActividadId = cd.TipoActividadId ?? -1,
                                 Fase = g.DescCorta ?? "-",
                                 Nombre = cd.IdRecurso != null ? U.Nombre + " " + U.ApPaterno : cd.Nombre,
                                 FechaInicio = cd.FechaInicio,
                                 FechaFin = cd.FechaFin,
                                 Dias = cd.Dias,
                                 PorcDedicado = cd.PorcDedicado,
                                 HorasInvertidas = cd.HorasInvertidas,
                                 CostoPeriodo = cd.CostoPeriodo,
                                 Aplicado = cd.Aplicado,
                                 Tipo = cd.HorasInvertidas != 0 ? "horas" : cd.PorcDedicado != 0 ? "porcentaje" : "fijo",
                             }
                        ).FirstOrDefault();
                }

                return Costo;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public string GuardaImportacionCosto(List<ProyectoCDModel> LstCosto, long IdUsuario, long IdProyecto, string Conexion)
        {
            try
            {
                string Mensaje = string.Empty;

                List<string> RecursoImp = LstCosto.Select(s => s.CveRecurso).Distinct().ToList();
                List<string> TipoActividadImp = LstCosto.Select(s => s.CveTipoActividad).Distinct().ToList();


                List<CatalogoGeneralModel> Recurso = new List<CatalogoGeneralModel>();
                List<CatalogoGeneralModel> TipoActividad = new List<CatalogoGeneralModel>();


                List<String> StrRecurso = new List<String>();
                List<String> StrTipoActividad = new List<String>();


                decimal horasdia = 0;
                decimal diasmes = 0;

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    contexto.Configuration.LazyLoadingEnabled = false;

                    Recurso = contexto.Usuario.Where(c => c.Activo == true).Select(s => new CatalogoGeneralModel { IdCatalogo = s.IdUsuario, DescCorta = s.NumEmpleado }).ToList();
                    TipoActividad = contexto.CatalogoGeneral.Where(c => c.Activo == true && c.IdTabla == 2 && c.Cabecera == false).Select(s => new CatalogoGeneralModel { IdCatalogo = s.IdCatalogo, DescCorta = s.DescCorta }).ToList();
                    horasdia = decimal.Parse(contexto.Configuracion.Where(w => w.IdConf == 19).FirstOrDefault().Valor);
                    diasmes = decimal.Parse(contexto.Configuracion.Where(w => w.IdConf == 20).FirstOrDefault().Valor);
                }



                StrRecurso = Recurso.Select(s => s.DescCorta).ToList();
                StrTipoActividad = TipoActividad.Select(s => s.DescCorta).ToList();




                var ValTipoActividad = (from p in TipoActividadImp
                                        where !StrTipoActividad.Contains(p)
                                        select p).ToList();


                if (ValTipoActividad.Count > 0)
                {
                    return "A|La fase " + ValTipoActividad.FirstOrDefault() + " no existe o se encuentra inactiva.";
                }



                var horasmes = horasdia * diasmes;
                // var horasinvertidas = (CostoDirecto.Dias * horasdia) * (CostoDirecto.PorcDedicado / 100);
                //var costoperiodo = Math.Round((costomensual / horasmes) * horasinvertidas, 2);

                //c.IdProyecto = CostoDirecto.IdProyecto;
                //c.IdRecurso = CostoDirecto.IdRecurso == -1 ? (long?)null : CostoDirecto.IdRecurso;
                //c.TipoActividadId = CostoDirecto.TipoActividadId;
                //c.CostoMensual = costomensual;
                //c.Nombre = CostoDirecto.Nombre;
                //c.FechaInicio = CostoDirecto.FechaInicio;
                //c.FechaFin = CostoDirecto.FechaFin;
                //c.Dias = CostoDirecto.Dias;
                //c.PorcDedicado = CostoDirecto.PorcDedicado;
                //c.HorasInvertidas = horasinvertidas;
                //c.CostoPeriodo = costoperiodo;
                //c.Aplicado = CostoDirecto.Aplicado;
                //c.IdUCreo = CostoDirecto.IdUCreo;
                //c.FechaCreo = DateTime.Now;




                var ListaFinal = LstCosto
                                .Select(s => new ProyectoCD
                                {

                                    IdProyecto = IdProyecto,
                                    IdRecurso = -1,
                                    TipoActividadId = TipoActividad.Where(w => w.DescCorta == s.CveTipoActividad).Select(k => k.IdCatalogo).FirstOrDefault(),
                                    CostoMensual = s.CostoMensual,
                                    Nombre = s.Nombre,
                                    FechaInicio = s.FechaInicio,
                                    FechaFin = s.FechaFin,
                                    Dias = s.Dias,
                                    PorcDedicado = s.PorcDedicado,
                                    HorasInvertidas = (s.Dias * horasdia) * (s.PorcDedicado / 100),
                                    CostoPeriodo = Math.Round((s.CostoMensual / horasmes) * ((s.Dias * horasdia) * (s.PorcDedicado / 100)), 2),
                                    Aplicado = false,
                                    IdUCreo = IdUsuario,
                                    FechaCreo = DateTime.Now

                                }).ToList();



                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    contexto.BulkInsert(ListaFinal);
                    contexto.SaveChanges();

                    Mensaje = "E|Los datos se guardaron correctamente";


                }


                return Mensaje;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public List<ProyectoCIModel> ConsultaCostosIndirectosProyecto(long IdProyecto, string Conexion)
        {
            try
            {
                List<ProyectoCIModel> LstCostoIndirecto = new List<ProyectoCIModel>();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    LstCostoIndirecto = contexto.ProyectoCI.Where(w => w.IdProyecto == IdProyecto && w.Activo == true).Select(s =>

                       new ProyectoCIModel
                       {
                           IdProyectoCI = s.IdProyectoCI,
                           Fase = contexto.CatalogoGeneral.Where(e => e.IdCatalogo == s.TipoActividadId).FirstOrDefault().DescCorta,
                           Fecha = s.Fecha,
                           Concepto = s.Concepto,
                           Monto = s.Monto,
                           TipoActividadId = s.TipoActividadId ?? -1
                       }
                        ).ToList();
                }

                return LstCostoIndirecto;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public int GuardaCostoIndirecto(ProyectoCIModel CostoIndirecto, string Conexion)
        {
            try
            {

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    if (CostoIndirecto.IdProyectoCI == 0)
                    {
                        ProyectoCI c = new ProyectoCI();
                        c.IdProyecto = CostoIndirecto.IdProyecto;
                        c.TipoActividadId = CostoIndirecto.TipoActividadId == -1 ? (long?)null : CostoIndirecto.TipoActividadId;
                        c.Concepto = CostoIndirecto.Concepto;
                        c.Fecha = CostoIndirecto.Fecha;
                        c.Monto = CostoIndirecto.Monto;
                        c.Activo = true;
                        c.IdUCreo = CostoIndirecto.IdUCreo;
                        c.FechaCreo = DateTime.Now;

                        contexto.ProyectoCI.Add(c);
                        contexto.SaveChanges();

                    }
                    else
                    {
                        var c = contexto.ProyectoCI.Where(w => w.IdProyectoCI == CostoIndirecto.IdProyectoCI).FirstOrDefault();
                        c.IdProyecto = CostoIndirecto.IdProyecto;
                        c.TipoActividadId = CostoIndirecto.TipoActividadId == -1 ? (long?)null : CostoIndirecto.TipoActividadId;
                        c.Concepto = CostoIndirecto.Concepto;
                        c.Fecha = CostoIndirecto.Fecha;
                        c.Monto = CostoIndirecto.Monto;
                        c.IdUMod = CostoIndirecto.IdUCreo;
                        c.FechaMod = DateTime.Now;

                        contexto.SaveChanges();

                    }

                }

                return 1;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }
        public ProyectoCIModel ConsultaCostoInDirectoProyecto(long IdProyectoCI, string Conexion)
        {
            try
            {
                ProyectoCIModel Costo = new ProyectoCIModel();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    contexto.Configuration.LazyLoadingEnabled = false;


                    Costo = (from cd in contexto.ProyectoCI
                             where cd.IdProyectoCI == IdProyectoCI
                             select new ProyectoCIModel()
                             {
                                 IdProyectoCI = cd.IdProyectoCI,
                                 Fecha = cd.Fecha,
                                 Concepto = cd.Concepto,
                                 Monto = cd.Monto,
                                 TipoActividadId = cd.TipoActividadId ?? -1
                             }

                        ).FirstOrDefault();



                }

                return Costo;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public int GuardarCosto(ProyectosModel proyecto, string Conexion)
        {
            try
            {

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    var p = contexto.Proyecto.Where(w => w.IdProyecto == proyecto.IdProyecto).FirstOrDefault();
                    p.CostoPlan = proyecto.CostoPlan;

                    contexto.SaveChanges();

                }

                return 1;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }


        public ProyectosModel ConsultaConfigFechas(long IdProyecto, string Conexion)
        {
            try
            {

                ProyectosModel p = new ProyectosModel();
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    var pr = contexto.Proyecto.Where(w => w.IdProyecto == IdProyecto).FirstOrDefault();

                    p.FijarFechas = pr.FijarFechas;
                    p.FechaInicioPlan = pr.FechaInicioPlan;
                    p.FechaFinPlan = pr.FechaFinPlan;
                    p.FechaFinComprometida = pr.FechaFinComprometida;
                }

                return p;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }


        public bool GuardarConfigFechas(ProyectosModel pr, string Conexion)
        {
            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    var p = contexto.Proyecto.Where(w => w.IdProyecto == pr.IdProyecto).FirstOrDefault();
                    p.FijarFechas = pr.FijarFechas;

                    if (pr.FijarFechas == false)
                    {
                        p.FechaFinComprometidaAnt = pr.FechaFinComprometida != p.FechaFinComprometida ? p.FechaFinComprometida : p.FechaFinComprometidaAnt;
                        p.FechaInicioPlan = pr.FechaInicioPlan;
                        p.FechaFinPlan = pr.FechaFinPlan;
                        p.FechaFinComprometida = pr.FechaFinComprometida;
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
        public ProyectosModel ConsultaConfigHoras(long IdProyecto, string Conexion)
        {
            try
            {

                ProyectosModel p = new ProyectosModel();
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    var pr = contexto.Proyecto.Where(w => w.IdProyecto == IdProyecto).FirstOrDefault();

                    p.FijarHoras = pr.FijarHoras;
                    p.HorasEstimadasInicial = pr.HorasEstimadasInicial;

                }

                return p;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }
        public bool GuardarConfigHoras(ProyectosModel pr, string Conexion)
        {
            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    var p = contexto.Proyecto.Where(w => w.IdProyecto == pr.IdProyecto).FirstOrDefault();
                    p.FijarHoras = pr.FijarHoras;

                    if (pr.FijarHoras == false)
                    {
                        p.HorasEstimadasInicial = pr.HorasEstimadasInicial;
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


        #endregion

        public ProyectosModel ConsultaIndicadores(long IdProyecto, string Conexion)
        {
            try
            {

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spResumenProyecto", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@FechaCorte", DateTime.Now);
                sqlcmd.Parameters.AddWithValue("@IdProyecto", IdProyecto);



                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
                da.Fill(ds);
                da.Dispose();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();

                ProyectosModel Indicadores = new ProyectosModel();


                var LstInd = ds.Tables[0];
                var LstAct = ds.Tables[1];
                //var Log = ds.Tables[1];

                Indicadores = (from row in LstInd.AsEnumerable()
                               select (
                               new ProyectosModel
                               {
                                   HorasAsignadas = decimal.Parse(row["HorasFacturablesProy"].ToString()),
                                   HorasCompromiso = decimal.Parse(row["Comprometido"].ToString()),
                                   AvanceReal = decimal.Parse(row["AvanceReal"].ToString()),
                                   Desfase = decimal.Parse(row["Desfase"].ToString()),
                                   AvanceCompPorc = decimal.Parse(row["AvanceComprometido"].ToString()),
                                   AvanceRealPorc = decimal.Parse(row["AvanceRealPorc"].ToString()),
                                   DesfaseProc = decimal.Parse(row["DesfasePorc"].ToString()),
                                   CPI = decimal.Parse(row["CPI"].ToString()),
                                   SPI = decimal.Parse(row["SPI"].ToString()),
                                   FactorCalidad = decimal.Parse(row["FactorCalidad"].ToString()),
                                   Milestones = int.Parse(row["Milestones"].ToString()),
                                   MTerminados = int.Parse(row["MTerminados"].ToString()),
                                   MATiempo = int.Parse(row["MATiempo"].ToString()),
                                   MDesfasados = int.Parse(row["MDesfasados"].ToString()),
                                   MAtrasados = int.Parse(row["MAtrasados"].ToString()),
                                   IdProyecto = long.Parse(row["IdProyecto"].ToString()),
                                   Clave = row["Clave"].ToString(),
                                   Nombre = row["Nombre"].ToString()

                               })).FirstOrDefault();

                Indicadores.Actividades = (from row in LstAct.AsEnumerable()
                                           select (
                                           new ActividadesModel
                                           {

                                               IdActividad = long.Parse(row["IdActividad"].ToString()),
                                               Descripcion = row["Descripcion"].ToString(),
                                               FechaSolicitado = row["FechaSolicitado"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaSolicitado"].ToString()),
                                               FechaTermino = row["FechaTermino"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaTermino"].ToString()),
                                               Icono = row["Icono"].ToString(),
                                               Termino = row["Termino"].ToString()
                                           })).ToList();

                return Indicadores;


            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        //public List<GanttModel> ConsultaGannt(long IdProyecto, string Conexion)
        //{
        //    try
        //    {
        //        DataSet ds = new DataSet();

        //        SqlConnection sqlcon = new SqlConnection(Conexion);
        //        SqlCommand sqlcmd = new SqlCommand("spObtieneGannt", sqlcon);
        //        sqlcmd.CommandType = CommandType.StoredProcedure;
        //        sqlcmd.Parameters.AddWithValue("@IdProyecto", IdProyecto);



        //        SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
        //        da.Fill(ds);
        //        da.Dispose();

        //        sqlcmd.Connection.Close();
        //        sqlcmd.Connection.Dispose();
        //        sqlcmd.Dispose();

        //        List<GanttModel> gannt = new List<GanttModel>();


        //        gannt = (from row in ds.Tables[0].AsEnumerable()
        //                 select (
        //                 new GanttModel
        //                 {
        //                     id = long.Parse(row["Id"].ToString()),
        //                     parentId = long.Parse(row["IdPadre"].ToString()),
        //                     title = row["Descripcion"].ToString(),
        //                     start = row["FechaInicio"].ToString() == "" ? DateTime.Now : DateTime.Parse(row["FechaInicio"].ToString()),
        //                     end = row["FechaFin"].ToString() == "" ? DateTime.Now : DateTime.Parse(row["FechaFin"].ToString()),
        //                     hours = decimal.Parse(row["Horas"].ToString()),
        //                     resource = row["Asignado"].ToString(),

        //                 })).ToList();

        //        return gannt;

        //    }
        //    catch (Exception ex)
        //    {

        //        throw ex;
        //    }
        //}

        public void ObtieneDependencias(FiltrosModel Filtros, ref List<ActividadesModel> LstEnc, ref List<ActividadesModel> LstDet, string Conexion)
        {
            try
            {


                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spObtieneDependencias", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdProyecto", Filtros.IdProyecto);
                sqlcmd.Parameters.AddWithValue("@Todo", Filtros.Tipo == 1 ? true : false);



                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
                da.Fill(ds);
                da.Dispose();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();


                var LstActEnc = ds.Tables[0];
                var LstActDet = ds.Tables[1];


                LstEnc = (from row in LstActEnc.AsEnumerable()
                          select (
                          new ActividadesModel
                          {
                              IdActividad = long.Parse(row["IdActividad"].ToString()),
                              ClaveTipoActividad = row["TipoActividadStr"].ToString(),
                              Estatus = row["Estatus"].ToString(),
                              Descripcion = row["Descripcion"].ToString(),
                              ResponsableStr = row["Responsable"].ToString(),
                              ResponsablePath = "/Archivos/Fotos/" + row["Responsable"].ToString() + ".jpg",
                              HorasFacturables = decimal.Parse(row["HorasFacturables"].ToString()),
                              HorasAsignadas = decimal.Parse(row["HorasAsignadas"].ToString()),
                              HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),
                              FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
                              FechaSolicitado = DateTime.Parse(row["FechaSolicitado"].ToString()),
                              DependenciasA = int.Parse(row["Dependencias"].ToString()),
                              DependenciasT = int.Parse(row["DependenciasT"].ToString()),
                              AvanceDependencia = decimal.Parse(row["AvanceDependencia"].ToString()),
                              FechaActual = DateTime.Now
                          })).OrderBy(o => o.FechaSolicitado).ToList();

                LstDet = (from row in LstActDet.AsEnumerable()
                          select (
                          new ActividadesModel
                          {
                              IdActividadD = long.Parse(row["IdActividadD"].ToString()),
                              IdActividad = long.Parse(row["IdActividad"].ToString()),
                              ClaveTipoActividad = row["TipoActividadStr"].ToString(),
                              Estatus = row["Estatus"].ToString(),
                              Descripcion = row["Descripcion"].ToString(),
                              ResponsableStr = row["Responsable"].ToString(),
                              ResponsablePath = "/Archivos/Fotos/" + row["Responsable"].ToString() + ".jpg",
                              HorasFacturables = decimal.Parse(row["HorasFacturables"].ToString()),
                              HorasAsignadas = decimal.Parse(row["HorasAsignadas"].ToString()),
                              HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),
                              FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
                              FechaSolicitado = DateTime.Parse(row["FechaSolicitado"].ToString()),
                              //DependenciasA = int.Parse(row["Dependencias"].ToString()),
                              //DependenciasT = int.Parse(row["DependenciasT"].ToString()),
                              //AvanceDependencia = decimal.Parse(row["AvanceDependencia"].ToString()),
                              FechaActual = DateTime.Now
                          })).OrderBy(o => o.FechaSolicitado).ToList();

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public (decimal horas, decimal costo) CalcularCostoRecurso(ProyectoCDCalculoModel datos, string conexion)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexion))
            {
                decimal costoTotal = 0;
                decimal trabajadoTotal = 0;


                ////Reviso si el usuario es el lider del proyecto 
                //var tipousuarioId = contexto.Proyecto.Where(w=> w.IdULider =>)
                var fechafin = datos.FechaFin.AddDays(1);
                if (datos.Tipo == "h")
                {
                    var sueldoHora = contexto.UsuarioCosto
                        .FirstOrDefault(x => x.IdUsuario == datos.IdUsuario)?
                        .CostoHora ?? 0;


                    var res =
                        (from p in contexto.Proyecto
                         join a in contexto.Actividad on p.IdProyecto equals a.IdProyecto
                         join u in contexto.Usuario on a.IdUsuarioAsignado equals u.IdUsuario
                         where
                         p.IdProyecto == datos.IdProyecto
                         && a.IdUsuarioAsignado == datos.IdUsuario
                         && a.FechaTermino >= datos.FechaInicio
                         && a.FechaTermino <= fechafin
                         select a.HorasAsignadas);

                    trabajadoTotal = res.Sum() ?? 0;
                    costoTotal = trabajadoTotal * sueldoHora;
                }
                else if (datos.Tipo == "p")
                {
                    if (datos.FechaInicio.Month != datos.FechaFin.Month || datos.FechaInicio.Year != datos.FechaInicio.Year)
                        throw new Exception("El calculo de costos basado en porcentaje debe ser dentro del mismo mes");

                    var diasLaborales = contexto.CalendarioTrabajo
                        .FirstOrDefault(x => x.IdMes == datos.FechaInicio.Month && x.IdAnio == datos.FechaInicio.Year)?.DiasLaborales ?? 0;
                    if (diasLaborales == 0)
                        throw new Exception("Debe configurar el numero de dias laborales para el mes y año seleccionados");

                    //var promedioDias = ObtenerPromedioDias(datos.FechaInicio, datos.FechaFin);
                    var diasLaboralesTotal = (int)datos.FechaFin.Subtract(datos.FechaInicio).TotalDays + 1;
                    var diasFestivos = contexto.DiasFestivos
                        .Where(x => x.Fecha.Month == datos.FechaInicio.Month && x.Fecha.Year == datos.FechaInicio.Year)
                        .Select(x => x.Fecha)
                        .ToList();
                    var diasLaboralesTrabajados =
                        Enumerable
                        .Range(0, diasLaboralesTotal)
                        .Select(x => datos.FechaInicio.AddDays(x))
                        .Count();
                    //.Count(x => x.DayOfWeek != DayOfWeek.Saturday
                    //&& x.DayOfWeek != DayOfWeek.Sunday
                    //&& !diasFestivos.Contains(x));

                    //

                    var respry =
                    (from p in contexto.Proyecto
                     join a in contexto.Actividad on p.IdProyecto equals a.IdProyecto
                     join u in contexto.Usuario on a.IdUsuarioAsignado equals u.IdUsuario
                     where
                     p.IdProyecto == datos.IdProyecto
                     && a.IdUsuarioAsignado == datos.IdUsuario
                     && a.FechaTermino >= datos.FechaInicio
                     && a.FechaTermino <= fechafin
                     select a.HorasFinales).Sum();


                    var res =
                 (from p in contexto.Proyecto
                  join a in contexto.Actividad on p.IdProyecto equals a.IdProyecto
                  join u in contexto.Usuario on a.IdUsuarioAsignado equals u.IdUsuario
                  where
                  //p.IdProyecto == datos.IdProyecto
                  a.IdUsuarioAsignado == datos.IdUsuario
                  && a.FechaTermino >= datos.FechaInicio
                  && a.FechaTermino <= fechafin
                  select a.HorasFinales).Sum();

                    if (respry == 0)
                        throw new Exception("El recurso ha dedicado tiempo al proyecto en el periodo seleccionado");

                    var porcentaje = respry / res;


                    //var porcentaje = contexto.ProyectoUsuario
                    //    .FirstOrDefault(x => x.IdProyecto == datos.IdProyecto && x.IdUsuario == datos.IdUsuario)
                    //    ?.Participacion ?? 0;
                    var sueldoMensual = contexto.UsuarioCosto
                        .FirstOrDefault(x => x.IdUsuario == datos.IdUsuario)?
                        .CostoMensual ?? 0;
                    var sueldoDiaPorcentaje = sueldoMensual / diasLaborales;

                    var totalDias = (datos.FechaFin - datos.FechaInicio).Days + 1;

                    trabajadoTotal = porcentaje * 100;
                    costoTotal = (sueldoDiaPorcentaje * totalDias) * (porcentaje);
                }
                else if (datos.Tipo == "a")
                {
                    if (datos.FechaInicio.Month != datos.FechaFin.Month || datos.FechaInicio.Year != datos.FechaInicio.Year)
                        throw new Exception("El calculo de costos basado en porcentaje debe ser dentro del mismo mes");

                    var diasLaborales = contexto.CalendarioTrabajo
                        .FirstOrDefault(x => x.IdMes == datos.FechaInicio.Month && x.IdAnio == datos.FechaInicio.Year)?.DiasLaborales ?? 0;
                    if (diasLaborales == 0)
                        throw new Exception("Debe configurar el numero de dias laborales para el mes y año seleccionados");

                    //var promedioDias = ObtenerPromedioDias(datos.FechaInicio, datos.FechaFin);
                    var diasLaboralesTotal = (int)datos.FechaFin.Subtract(datos.FechaInicio).TotalDays + 1;
                    var diasFestivos = contexto.DiasFestivos
                        .Where(x => x.Fecha.Month == datos.FechaInicio.Month && x.Fecha.Year == datos.FechaInicio.Year)
                        .Select(x => x.Fecha)
                        .ToList();
                    var diasLaboralesTrabajados =
                        Enumerable
                        .Range(0, diasLaboralesTotal)
                        .Select(x => datos.FechaInicio.AddDays(x))
                        .Count();
                    //.Count(x => x.DayOfWeek != DayOfWeek.Saturday
                    //&& x.DayOfWeek != DayOfWeek.Sunday
                    //&& !diasFestivos.Contains(x));

                    var porcentaje = contexto.ProyectoUsuario
                        .FirstOrDefault(x => x.IdProyecto == datos.IdProyecto && x.IdUsuario == datos.IdUsuario)
                        ?.Participacion ?? 0;
                    var sueldoMensual = contexto.UsuarioCosto
                        .FirstOrDefault(x => x.IdUsuario == datos.IdUsuario)?
                        .CostoMensual ?? 0;
                    var sueldoDiaPorcentaje = sueldoMensual / diasLaborales;

                    var totalDias = (datos.FechaFin - datos.FechaInicio).Days + 1;

                    trabajadoTotal = porcentaje;
                    costoTotal = (sueldoDiaPorcentaje * totalDias) * (trabajadoTotal / 100);
                }




                return (trabajadoTotal, costoTotal);
            }
        }

        public (bool estatus, string mensaje) GuardarCostoPlaneado(long idProyecto, decimal costo, long idUsuario, string conexion)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexion))
            {
                var proyecto = contexto.Proyecto.FirstOrDefault(x => x.IdProyecto == idProyecto);
                if (proyecto == null)
                    return (false, "No se encontro el proyecto");

                proyecto.CostoPlan = costo;
                proyecto.IdUModifico = idUsuario;
                proyecto.FechaModifico = DateTime.Now;

                contexto.SaveChanges();

                return (true, Mensaje.MensajeGuardadoExito);
            }
        }

        public (bool estatus, string mensaje) GuardarCostoDirecto(List<ProyectoCDNuevoModel> costos, long idUsuario, string conexion)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexion))
            {
                var cd = new List<ProyectoCD>();

                costos.ForEach(x =>
                {
                    var costoMensual = contexto.UsuarioCosto
                    .FirstOrDefault(y => y.IdUsuario == x.Id)?.CostoMensual ?? 0;
                    var dias = (x.FechaFin.AddDays(1) - x.FechaInicio).Days;

                    cd.Add(new ProyectoCD
                    {
                        IdProyecto = x.IdProyecto,
                        IdRecurso = x.Id == 0 ? (long?)null : x.Id,
                        CostoMensual = costoMensual,
                        Nombre = x.Nombre,
                        FechaInicio = x.FechaInicio,
                        FechaFin = x.FechaFin,
                        Dias = dias,
                        PorcDedicado = x.Tipo == "porcentaje" ? x.Invertido : 0,
                        HorasInvertidas = x.Tipo == "horas" ? x.Invertido : 0,
                        CostoPeriodo = x.Costo,
                        Aplicado = true,
                        IdUCreo = idUsuario,
                        FechaCreo = DateTime.Now
                    });
                });

                contexto.ProyectoCD.AddRange(cd);
                contexto.SaveChanges();

                return (true, Mensaje.MensajeGuardadoExito);
            }
        }

        public (bool estatus, string mensaje) EditarCostoDirecto(ProyectoCDModel _costo, long idUsuario, string conexion)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexion))
            {
                var cd = new List<ProyectoCD>();

                var costo = contexto.ProyectoCD.FirstOrDefault(x => x.IdProyectoCD == _costo.IdProyectoCD);

                var costoMensual = contexto.UsuarioCosto
                .FirstOrDefault(x => x.IdUsuario == _costo.IdRecurso)?.CostoMensual ?? 0;
                var dias = (_costo.FechaFin.AddDays(1) - _costo.FechaInicio).Days;

                costo.CostoMensual = costoMensual;
                costo.Nombre = _costo.Nombre;
                costo.FechaInicio = _costo.FechaInicio;
                costo.FechaFin = _costo.FechaFin;
                costo.Dias = dias;
                costo.CostoPeriodo = _costo.CostoPeriodo;
                costo.TipoActividadId = _costo.TipoActividadId == -1 ? null : _costo.TipoActividadId;
                costo.Aplicado = _costo.Aplicado;
                costo.IdUMod = idUsuario;
                costo.FechaMod = DateTime.Now;

                contexto.ProyectoCD.AddRange(cd);
                contexto.SaveChanges();

                return (true, Mensaje.MensajeGuardadoExito);
            }
        }

        public (bool estatus, string mensaje) AplicarCostoMasivo(List<long> id, long idUsuario, string conexion)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexion))
            {
                var cd = new List<ProyectoCD>();
                var costos = contexto.ProyectoCD.Where(x => id.Contains(x.IdProyectoCD));

                foreach (var costo in costos)
                {
                    costo.Aplicado = true;
                    costo.IdUMod = idUsuario;
                    costo.FechaMod = DateTime.Now;
                }

                contexto.SaveChanges();

                return (true, Mensaje.MensajeGuardadoExito);
            }
        }

        public (bool estatus, string mensaje) GuardarCostoDirectoDetalle(ProyectoCDModel _costo, long idUsuario, string conexion)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexion))
            {
                var costo = contexto.ProyectoCD.FirstOrDefault(x => x.IdProyectoCD == _costo.IdProyectoCD);

                if (costo == null)
                    return (false, "No se encontro el registro");

                costo.Aplicado = _costo.Aplicado;
                costo.TipoActividadId = _costo.TipoActividadId == -1 ? null : (_costo.TipoActividadId ?? costo.TipoActividadId);
                costo.IdUMod = idUsuario;
                costo.FechaMod = DateTime.Now;

                contexto.SaveChanges();

                return (true, Mensaje.MensajeGuardadoExito);
            }
        }

        public ProyectoCDModel CargarCostoStats(long idProyecto, string conexion)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexion))
            {
                var planeado = contexto.Proyecto.FirstOrDefault(x => x.IdProyecto == idProyecto).CostoPlan ?? 0m;
                var cd = contexto.ProyectoCD.Where(x => x.IdProyecto == idProyecto && x.Aplicado).ToList().Sum(x => x.CostoPeriodo);
                var ci = contexto.ProyectoCI.Where(x => x.IdProyecto == idProyecto).ToList().Sum(x => x.Monto);
                var total = cd + ci;

                var costos = new ProyectoCDModel
                {
                    CostoPlaneado = planeado,
                    CostoTotal = total,
                    CostoCD = cd,
                    CostoCI = ci
                };

                return costos;
            }
        }

        public ProyectoInformeCostoModel ObtenerReporteCostos(List<long> _proyectos, DateTime fechaInicio, DateTime fechaFin, string conexion)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexion))
            {
                var informe = new ProyectoInformeCostoModel();
                var costo = contexto.Proyecto.Where(x => _proyectos.Contains(x.IdProyecto)).Sum(x => x.CostoPlan) ?? 0;
                var costosCD = contexto.ProyectoCD
                    .Where(x => _proyectos.Contains(x.IdProyecto) && fechaInicio <= x.FechaFin && fechaFin >= x.FechaFin && x.Aplicado)
                    .ToList()
                    .Sum(x => x.CostoPeriodo);
                var costosCI = contexto.ProyectoCI
                    .Where(x => _proyectos.Contains(x.IdProyecto) && fechaInicio <= x.Fecha && fechaFin >= x.Fecha)
                    .ToList()
                    .Sum(x => x.Monto);
                informe.Presupuesto = costo;
                informe.Directo = costosCD;
                informe.Indirecto = costosCI;

                var fases = InformePorFase(_proyectos, fechaInicio, fechaFin, conexion);
                informe.GraficaPastelFases.values = fases;

                var recursos = contexto.ProyectoCD
                    .Where(x => _proyectos.Contains(x.IdProyecto) && fechaInicio <= x.FechaFin && fechaFin >= x.FechaFin && x.Aplicado)
                    .GroupBy(x => x.Nombre)
                    .Select(x => new GraficaPastelValuesModel
                    {
                        name = x.Key.ToString(),
                        value = x.Sum(y => y.CostoPeriodo)
                    }).ToList();
                informe.GraficaPastelRecursos.values = recursos;

                var periodoCD = contexto.ProyectoCD
                    .Where(x => _proyectos.Contains(x.IdProyecto) && fechaInicio <= x.FechaFin && fechaFin >= x.FechaFin && x.Aplicado)
                    .GroupBy(x => new { x.FechaFin.Month, x.FechaFin.Year })
                    .OrderBy(x => x.Key.Year).ThenBy(x => x.Key.Month)
                    .Select(x => new
                    {
                        Fecha = x.Key.Year + "/" + x.Key.Month,
                        Costo = x.Sum(y => y.CostoPeriodo)
                    }).ToList();

                var periodoCI = contexto.ProyectoCI
                    .Where(x => _proyectos.Contains(x.IdProyecto) && fechaInicio <= x.Fecha && fechaFin >= x.Fecha)
                    .GroupBy(x => new { x.Fecha.Month, x.Fecha.Year })
                    .OrderBy(x => x.Key.Year).ThenBy(x => x.Key.Month)
                    .Select(x => new
                    {
                        Fecha = x.Key.Year + "/" + x.Key.Month,
                        Costo = x.Sum(y => y.Monto)
                    }).ToList();

                var costoCDPeriodo = new GraficaLineaValuesModel
                {
                    name = "Directo",
                    data = periodoCD.Select(x => x.Costo).ToList()
                };
                var costoCIPeriodo = new GraficaLineaValuesModel
                {
                    name = "Indirecto",
                    data = periodoCI.Select(x => x.Costo).ToList()
                };

                periodoCD.AddRange(periodoCI);
                var periodo =
                    periodoCD
                    .GroupBy(x => x.Fecha)
                    .Select(x => new
                    {
                        Fecha = x.Key.ToString(),
                        Costo = x.Sum(y => y.Costo)
                    })
                    .ToList();
                var periodos = periodo.Select(x => x.Fecha).ToList();
                var costoTotalPeriodo = new GraficaLineaValuesModel
                {
                    name = "Total",
                    data = periodo.Select(x => x.Costo).ToList()
                };
                informe.GraficaPeriodo.data = periodos;
                informe.GraficaPeriodo.values.Add(costoTotalPeriodo);

                return informe;
            }
        }

        private List<GraficaPastelValuesModel> InformePorFase(List<long> _proyectos, DateTime fechaInicio, DateTime fechaFin, string conexion)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexion))
            {
                var fasesDir = contexto.ProyectoCD
                    .Include(x => x.CatalogoGeneral)
                    .Where(x => _proyectos.Contains(x.IdProyecto) && fechaInicio <= x.FechaFin && fechaFin >= x.FechaFin && x.Aplicado)
                    .GroupBy(x => x.CatalogoGeneral.DescCorta)
                    .Select(x => new GraficaPastelValuesModel
                    {
                        name = x.Key.ToString() == "" ? "Sin definir" : x.Key.ToString(),
                        value = x.Sum(y => y.CostoPeriodo)
                    }).ToList();

                var fasesInd = contexto.ProyectoCI
                    .Include(x => x.CatalogoGeneral)
                    .Where(x => _proyectos.Contains(x.IdProyecto) && fechaInicio <= x.Fecha && fechaFin >= x.Fecha)
                    .GroupBy(x => x.CatalogoGeneral.DescCorta)
                    .Select(x => new GraficaPastelValuesModel
                    {
                        name = x.Key.ToString() == "" ? "Sin definir" : x.Key.ToString(),
                        value = x.Sum(y => y.Monto)
                    }).ToList();

                fasesDir.AddRange(fasesInd);
                var fases =
                    fasesDir
                    .GroupBy(x => x.name)
                    .Select(x => new GraficaPastelValuesModel
                    {
                        name = x.Key.ToString(),
                        value = x.Sum(y => y.value)
                    }).ToList();

                return fases;
            }
        }

        public List<ProyectoCostosModel> ObtenerReporteCostosCD(long idProyecto, DateTime fechaInicio, DateTime fechaFin, string conexion)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexion))
            {
                var reporteCD =
                    contexto.ProyectoCD
                    .Include(x => x.CatalogoGeneral)
                    .Where(x => x.IdProyecto == idProyecto && fechaInicio <= x.FechaFin && fechaFin >= x.FechaFin && x.Aplicado)
                    .AsEnumerable()
                    .Select(x => new ProyectoCostosModel
                    {
                        Concepto = x.Nombre,
                        Fase = x.CatalogoGeneral?.DescCorta ?? "Sin definir",
                        Fecha = x.FechaInicio.ToString("dd/MM/yyyy") + " - " + x.FechaFin.ToString("dd/MM/yyyy"),
                        Costo = x.CostoPeriodo
                    }).ToList();

                return reporteCD;
            }
        }

        public List<ProyectoCostosModel> ObtenerReporteCostosCI(long idProyecto, DateTime fechaInicio, DateTime fechaFin, string conexion)
        {
            using (var contexto = new BDProductividad_DEVEntities(conexion))
            {
                var reporteCI =
                    contexto.ProyectoCI
                    .Include(x => x.CatalogoGeneral)
                    .Where(x => x.IdProyecto == idProyecto && fechaInicio <= x.Fecha && fechaFin >= x.Fecha)
                    .AsEnumerable()
                    .Select(x => new ProyectoCostosModel
                    {
                        Concepto = x.Concepto,
                        Fase = x.CatalogoGeneral?.DescCorta ?? "Sin definir",
                        Fecha = x.Fecha.ToString("dd/MM/yyyy"),
                        Costo = x.Monto
                    }).ToList();

                return reporteCI;
            }
        }

        private decimal ObtenerPromedioDias(DateTime fechaInicio, DateTime fechaFin)
        {
            fechaFin = fechaFin.AddDays(-1);
            var totalDays =
                (new DateTime(fechaFin.Year, fechaFin.Month, DateTime.DaysInMonth(fechaFin.Year, fechaFin.Month))
                - new DateTime(fechaInicio.Year, fechaInicio.Month, 1)).TotalDays + 1;

            var totalMonths = ((fechaFin.Year - fechaInicio.Year) * 12) + fechaFin.Month - fechaInicio.Month + 1;

            var promedio = (decimal)totalDays / (decimal)totalMonths;

            return promedio;
        }


        //Portafolio

        public IndicadoresModel ObtienePortafolio(long IdUsuario, string conexion)
        {
            try
            {
                IndicadoresModel indicadores = new IndicadoresModel();
                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(conexion);
                SqlCommand sqlcmd = new SqlCommand("spPortafolio", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdUsuario", IdUsuario);
                //sqlcmd.Parameters.AddWithValue("@TipoUsuario", user.IdTipoUsuario);

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();
                var ind = ds.Tables[0];
                //var LstMilestones = ds.Tables[1];
                //var LstProys = ds.Tables[2];
                //var LstCarga = ds.Tables[3];

                indicadores.Proyectos = ind.Rows[0]["Proyectos"].ToString() == string.Empty ? 0 : int.Parse(ind.Rows[0]["Proyectos"].ToString());
                indicadores.PATiempo = ind.Rows[0]["PATiempo"].ToString() == string.Empty ? 0 : int.Parse(ind.Rows[0]["PATiempo"].ToString());
                indicadores.PAtrasados = ind.Rows[0]["PAtrasados"].ToString() == string.Empty ? 0 : int.Parse(ind.Rows[0]["PAtrasados"].ToString());
                indicadores.Milestones = ind.Rows[0]["Milestones"].ToString() == string.Empty ? 0 : int.Parse(ind.Rows[0]["Milestones"].ToString());
                indicadores.MAbiertos = ind.Rows[0]["MAbiertos"].ToString() == string.Empty ? 0 : int.Parse(ind.Rows[0]["MAbiertos"].ToString());
                indicadores.MCompletados = ind.Rows[0]["MCompletados"].ToString() == string.Empty ? 0 : int.Parse(ind.Rows[0]["MCompletados"].ToString());
                indicadores.MPendientes = ind.Rows[0]["MPendientes"].ToString() == string.Empty ? 0 : int.Parse(ind.Rows[0]["MPendientes"].ToString());


                indicadores.Sprints = ind.Rows[0]["Sprints"].ToString() == string.Empty ? 0 : int.Parse(ind.Rows[0]["Sprints"].ToString());
                indicadores.SAbiertos = ind.Rows[0]["SAbiertos"].ToString() == string.Empty ? 0 : int.Parse(ind.Rows[0]["SAbiertos"].ToString());
                indicadores.SProgreso = ind.Rows[0]["SProgreso"].ToString() == string.Empty ? 0 : int.Parse(ind.Rows[0]["SProgreso"].ToString());
                indicadores.STerminados = ind.Rows[0]["STerminados"].ToString() == string.Empty ? 0 : int.Parse(ind.Rows[0]["STerminados"].ToString());


                indicadores.Bugs = ind.Rows[0]["Bugs"].ToString() == string.Empty ? 0 : int.Parse(ind.Rows[0]["Bugs"].ToString());
                indicadores.BAbiertos = ind.Rows[0]["BAbiertos"].ToString() == string.Empty ? 0 : int.Parse(ind.Rows[0]["BAbiertos"].ToString());
                indicadores.BResueltos = ind.Rows[0]["BResueltos"].ToString() == string.Empty ? 0 : int.Parse(ind.Rows[0]["BResueltos"].ToString());
                indicadores.BRechazados = ind.Rows[0]["BRechazados"].ToString() == string.Empty ? 0 : int.Parse(ind.Rows[0]["BRechazados"].ToString());


                indicadores.Issues = ind.Rows[0]["Issues"].ToString() == string.Empty ? 0 : int.Parse(ind.Rows[0]["Issues"].ToString());
                //indicadores.ICompletados = ind.Rows[0]["ICompletados"].ToString() == string.Empty ? 0 : int.Parse(ind.Rows[0]["ICompletados"].ToString());
                //indicadores.IPendientes = ind.Rows[0]["IPendientes"].ToString() == string.Empty ? 0 : int.Parse(ind.Rows[0]["IPendientes"].ToString());
                indicadores.Productividad = ind.Rows[0]["ProductividadActual"].ToString() == string.Empty ? 0 : double.Parse(ind.Rows[0]["ProductividadActual"].ToString());
                indicadores.ProductividadMes = ind.Rows[0]["ProductividadMes"].ToString() == string.Empty ? 0 : double.Parse(ind.Rows[0]["ProductividadMes"].ToString());
                indicadores.Objetivo = ind.Rows[0]["Objetivo"].ToString() == string.Empty ? 0 : double.Parse(ind.Rows[0]["Objetivo"].ToString());
                indicadores.ObjetivoActual = ind.Rows[0]["ObjetivoAlDia"].ToString() == string.Empty ? 0 : double.Parse(ind.Rows[0]["ObjetivoAlDia"].ToString());
                //indicadores.LstProyectos = (from row in LstProys.AsEnumerable()
                //           select (
                //           new ProyectosModel
                //           {

                //               Clave = row["CveProyecto"].ToString(),
                //               Nombre = row["Nombre"].ToString(),
                //               AvanceCompPorc = decimal.Parse(row["AvComp"].ToString()),
                //               AvanceRealPorc = decimal.Parse(row["AvRealPorc"].ToString()),
                //               DesfaseProc = decimal.Parse(row["DesfPorc"].ToString()),
                //               Lider = row["Lider"].ToString(),
                //               IdULiderStr = row["CveLider"].ToString(),
                //               Semaforo = row["Semaforo"].ToString()
                //           })).ToList();

                //indicadores.LstMilestones = (from row in LstMilestones.AsEnumerable()
                //                           select (
                //                           new ActividadesModel
                //                           {

                //                               IdActividad = long.Parse(row["IdActividad"].ToString()),
                //                               Descripcion = row["Descripcion"].ToString(),
                //                               FechaSolicitado = DateTime.Parse(row["FechaSolicitado"].ToString()),
                //                               FechaTermino = row["FechaTermino"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaTermino"].ToString()),
                //                               Icono = row["Icono"].ToString(),
                //                               Termino = row["Termino"].ToString()
                //                           })).ToList();

                //List<UsuarioModel> LstCargaT = new List<UsuarioModel>();
                //indicadores.LstCargaT = (from row in LstCarga.AsEnumerable()
                //             select (new UsuarioModel
                //             {
                //                 IdUsuario = long.Parse(row["IdUsuario"].ToString()),
                //                 NumEmpleado = row["NumEmpleado"].ToString(),
                //                 NombreCompleto = row["Nombre"].ToString(),
                //                 Nivel = row["Nivel"].ToString(),
                //                 EstandarDiario = decimal.Parse(row["EstandarDiario"].ToString()),
                //                 HorasDisponibles = decimal.Parse(row["HorasDisponibles"].ToString()),
                //                 HorasAsignadas = decimal.Parse(row["HorasAsignadas"].ToString()),
                //                 CantActividades = int.Parse(row["CantActividades"].ToString()),
                //                 PorcOcupacion = decimal.Parse(row["PorcOcupacion"].ToString())
                //             })).ToList();

                //indicadores.HorasProductivas = ind.Rows[0][1].ToString() == string.Empty ? 0 : double.Parse(ind.Rows[0][1].ToString());
                //indicadores.Asignadas = ind.Rows[0][2].ToString() == string.Empty ? 0 : double.Parse(ind.Rows[0][2].ToString());
                //indicadores.Validacion = ind.Rows[0][3].ToString() == string.Empty ? 0 : double.Parse(ind.Rows[0][3].ToString());
                //indicadores.Liberadas = ind.Rows[0][4].ToString() == string.Empty ? 0 : double.Parse(ind.Rows[0][4].ToString());
                //indicadores.Rechazadas = ind.Rows[0][5].ToString() == string.Empty ? 0 : double.Parse(ind.Rows[0][5].ToString());
                //indicadores.Retrabajo = ind.Rows[0][6].ToString() == string.Empty ? 0 : double.Parse(ind.Rows[0][6].ToString());
                //indicadores.Objetivo = ind.Rows[0][7].ToString() == string.Empty ? 0 : double.Parse(ind.Rows[0][7].ToString());
                //indicadores.ObjetivoActual = ind.Rows[0][8].ToString() == string.Empty ? 0 : double.Parse(ind.Rows[0][8].ToString());
                //indicadores.Productividad = ind.Rows[0][9].ToString() == string.Empty ? 0 : double.Parse(ind.Rows[0][9].ToString());
                //indicadores.ProductividadMes = ind.Rows[0][10].ToString() == string.Empty ? 0 : double.Parse(ind.Rows[0][10].ToString());
                //indicadores.Proceso = ind.Rows[0][11].ToString() == string.Empty ? 0 : double.Parse(ind.Rows[0][11].ToString());
                //indicadores.IRetrabajo = ind.Rows[0][12].ToString() == string.Empty ? 0 : double.Parse(ind.Rows[0][12].ToString());
                //indicadores.DiasSinBugs = ind.Rows[0][13].ToString() == string.Empty ? 0 : int.Parse(ind.Rows[0][13].ToString());
                //indicadores.RecordBugs = ind.Rows[0][14].ToString() == string.Empty ? 0 : int.Parse(ind.Rows[0][14].ToString());
                //indicadores.DesfaseH = ind.Rows[0][15].ToString() == string.Empty ? 0 : double.Parse(ind.Rows[0][15].ToString());
                //indicadores.DesfaseP = ind.Rows[0][16].ToString() == string.Empty ? 0 : double.Parse(ind.Rows[0][16].ToString());
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

        public List<CatalogoGeneralModel> ConsultaIssuesCombo(long IdProyecto, long IdActividad, string Conexion)
        {

            List<CatalogoGeneralModel> Lst = new List<CatalogoGeneralModel>();
            using (var contexto = new BDProductividad_DEVEntities(Conexion))
            {

                List<long> LstActRel = contexto.ActividadIssue.Where(w => w.IdActividad == IdActividad).Select(s => s.IdIssue).ToList();
                //LstActRel.Add(IdActividad);

                Lst = (from a in contexto.ProyectoIssue
                       where a.IdProyecto == IdProyecto && a.CatalogoEstatusId == 264 && !LstActRel.Contains(a.IdIssue)
                       select new CatalogoGeneralModel
                       {
                           IdCatalogo = a.IdIssue,
                           DescCorta = a.Proyecto.Clave + " - " + a.IdIssueProyecto.ToString() + " " + a.Descripcion,
                           DescLarga = a.Proyecto.Clave + " - " + a.IdIssueProyecto.ToString() + " " + a.Descripcion,
                       }
                      ).ToList();

            }

            return Lst;


        }


        #region Flujo

        public List<FlujoPagoModel> ObtieneFlujoPagos(int Anio, int Tipo, long IdUsuario, bool Archivado, long IdTipoUsuario, string Conexion)
        {

            try
            {

                List<FlujoPagoModel> LstFlujoPago = new List<FlujoPagoModel>();

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("ObtieneFlujoPagos", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@Year", Anio);
                sqlcmd.Parameters.AddWithValue("@TipoFecha", Tipo);
                sqlcmd.Parameters.AddWithValue("@IdUsuario", IdUsuario);
                sqlcmd.Parameters.AddWithValue("@IdTipoUsuario", IdTipoUsuario);
                sqlcmd.Parameters.AddWithValue("@Activo", Archivado == true ? false : true);

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();
                var LstFlujos = ds.Tables[0];



                LstFlujoPago = (from row in LstFlujos.AsEnumerable()
                                select (
                                new FlujoPagoModel
                                {
                                    IdFlujoPago = int.Parse(row["IdFlujoPago"].ToString()),
                                    ClaveProy = row["Clave"].ToString(),
                                    NombreProy = row["NombreProy"].ToString(),
                                    Cliente = row["Cliente"].ToString(),
                                    Lider = row["Lider"].ToString(),
                                    IdProyecto = int.Parse(row["IdProyecto"].ToString()),
                                    Ene = decimal.Parse(row["Ene"].ToString()),
                                    Feb = decimal.Parse(row["Feb"].ToString()),
                                    Mar = decimal.Parse(row["Mar"].ToString()),
                                    Abr = decimal.Parse(row["Abr"].ToString()),
                                    May = decimal.Parse(row["May"].ToString()),
                                    Jun = decimal.Parse(row["Jun"].ToString()),
                                    Jul = decimal.Parse(row["Jul"].ToString()),
                                    Ago = decimal.Parse(row["Ago"].ToString()),
                                    Sep = decimal.Parse(row["Sep"].ToString()),
                                    Oct = decimal.Parse(row["Oct"].ToString()),
                                    Nov = decimal.Parse(row["Nov"].ToString()),
                                    Dic = decimal.Parse(row["Dic"].ToString()),
                                    TotalProyecto = decimal.Parse(row["Monto"].ToString()),
                                    TotalFacturado = decimal.Parse(row["Facturado"].ToString()),
                                    TotalPagado = decimal.Parse(row["Pagado"].ToString()),
                                    Saldo = decimal.Parse(row["Saldo"].ToString()),
                                })).ToList();


                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();

                sqlcon.Close();


                return LstFlujoPago;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public List<FlujoPagoDetModel> ObtienePagosMes(int Anio, int Mes, int IdProyecto, int Tipo, long IdUsuario, bool Archivado, long IdTipoUsuario, string Conexion)
        {

            try
            {

                List<FlujoPagoDetModel> LstFlujoPago = new List<FlujoPagoDetModel>();

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("ObtieneFlujoPorMes", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@Year", Anio);
                sqlcmd.Parameters.AddWithValue("@Mes", Mes);
                sqlcmd.Parameters.AddWithValue("@IdProyecto", IdProyecto);
                sqlcmd.Parameters.AddWithValue("@TipoFecha", Tipo);
                sqlcmd.Parameters.AddWithValue("@IdUsuario", IdUsuario);
                sqlcmd.Parameters.AddWithValue("@IdTipoUsuario", IdTipoUsuario);
                sqlcmd.Parameters.AddWithValue("@Activo", Archivado == true ? false : true);


                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();
                var LstFlujos = ds.Tables[0];



                LstFlujoPago = (from row in LstFlujos.AsEnumerable()
                                select (
                                new FlujoPagoDetModel
                                {

                                    IdFlujoPago = int.Parse(row["IdFlujoPago"].ToString()),
                                    IdFlujoPagoDet = int.Parse(row["IdFlujoPagoDet"].ToString()),
                                    IdProyecto = int.Parse(row["IdProyecto"].ToString()),
                                    Proyecto = row["Proyecto"].ToString(),
                                    Secuencia = int.Parse(row["Secuencia"].ToString()),
                                    Concepto = row["Concepto"].ToString(),
                                    Procentaje = decimal.Parse(row["Procentaje"].ToString()),
                                    Horas = decimal.Parse(row["Horas"].ToString()),
                                    Monto = decimal.Parse(row["Monto"].ToString()),
                                    IVA = decimal.Parse(row["IVA"].ToString()),
                                    Total = decimal.Parse(row["Total"].ToString()),
                                    FechaDevOriginal = row["FechaDevOriginal"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaDevOriginal"].ToString()),
                                    FechaDev = row["FechaDev"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaDev"].ToString()),
                                    FechaFactura = row["FechaFactura"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaFactura"].ToString()),
                                    FechaProgramadaPago = row["FechaProgramadaPago"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaProgramadaPago"].ToString()),
                                    FechaPagoReal = row["FechaPagoReal"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaPagoReal"].ToString())
                                })).ToList();


                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();

                sqlcon.Close();


                return LstFlujoPago;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }



        public FlujoPagoModel ConsultaFlujo(int IdFlujoPago, string Conexion)
        {
            try
            {

                FlujoPagoModel flujo = new FlujoPagoModel();
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {


                    Nullable<System.DateTime> fecha = DateTime.Now;

                    flujo = contexto.FlujoPago.Where(w => w.IdFlujoPago == IdFlujoPago)
                        .Select(s => new FlujoPagoModel()
                        {
                            IdFlujoPago = s.IdFlujoPago,
                            IdProyecto = s.IdProyecto,
                            NombreProy = s.Proyecto.Clave + "-" + s.Proyecto.Nombre,
                            PrecioHora = s.PrecioHora,
                            HorasTotales = s.HorasTotales,
                            HorasAmortizar = s.HorasAmortizar,
                            PorcIVA = s.PorcIVA,
                            Activo = s.Activo == true ? false : true,
                            FlujoDetalle = s.FlujoPagoDetalle.Select(d => new FlujoPagoDetModel()
                            {
                                IdFlujoPago = d.IdFlujoPago,
                                IdFlujoPagoDet = d.IdFlujoPagoDet,
                                Secuencia = d.Secuencia,
                                Concepto = d.Concepto,
                                Horas = d.Horas,
                                Amortizadas = d.Amortizadas,
                                Procentaje = d.Procentaje,
                                Monto = d.Monto,
                                FechaDevOriginal = d.FechaDevOriginal,
                                FechaDev = d.FechaDev,
                                FechaFactura = d.FechaFactura,
                                FechaProgramadaPago = d.FechaProgramadaPago,
                                FechaPagoReal = d.FechaPagoReal,
                                Facturable = d.Facturable,
                                Facturada = d.Facturada,
                                Pagada = d.Pagada,
                                Factura = d.Factura,
                                IVA = d.Monto * (s.PorcIVA / 100),
                                Total = d.Monto + (d.Monto * (s.PorcIVA / 100)),
                                Vencido = d.FechaDev == null ? false : (d.FechaDev <= fecha ? true : false)
                            }).ToList()
                        }).FirstOrDefault();



                    flujo.TotalProyecto = flujo.FlujoDetalle.Sum(s => s.Monto);
                    flujo.TotalAmortizadoHoras = flujo.FlujoDetalle.Sum(s => s.Amortizadas);
                    flujo.TotalFacturado = flujo.FlujoDetalle.Where(w => w.FechaFactura != null).Sum(s => s.Monto);
                    flujo.TotalPagado = flujo.FlujoDetalle.Where(w => w.FechaPagoReal != null).Sum(s => s.Monto);

                    flujo.Saldo = flujo.FlujoDetalle.Sum(s => s.Monto) - flujo.TotalPagado;


                    flujo.TotalProyectoHoras = flujo.TotalProyecto / flujo.PrecioHora;
                    flujo.TotalFacturadoHoras = flujo.TotalFacturado / flujo.PrecioHora;
                    flujo.TotalAmortizadas = flujo.TotalAmortizadoHoras * flujo.PrecioHora;
                    flujo.TotalPagadoHoras = flujo.TotalPagado / flujo.PrecioHora;
                    flujo.SaldoAmortizarHoras = flujo.HorasAmortizar - flujo.TotalAmortizadoHoras;
                    flujo.SaldoAmortizar = flujo.SaldoAmortizarHoras * flujo.PrecioHora;
                    flujo.SaldoHoras = flujo.Saldo / flujo.PrecioHora;


                }

                return flujo;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public long GuardarFlujoPago(FlujoPagoModel flujo, long IdUsuario, string Conexion)
        {
            try
            {
                long Respuesta = 0;
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    if (flujo.IdFlujoPago == 0) // NUEVO

                    {

                        FlujoPago fp = new FlujoPago();
                        fp.IdProyecto = flujo.IdProyecto;
                        fp.PrecioHora = flujo.PrecioHora;
                        fp.HorasTotales = flujo.HorasTotales;
                        fp.HorasAmortizar = flujo.HorasAmortizar;
                        fp.PorcIVA = flujo.PorcIVA;
                        fp.Activo = flujo.Activo == true ? false : true;
                        fp.FechaCreo = DateTime.Now;
                        fp.IdUCreo = IdUsuario;


                        contexto.FlujoPago.Add(fp);

                        contexto.SaveChanges();
                        Respuesta = fp.IdFlujoPago;


                    }
                    else // EDITAR
                    {
                        var fp = contexto.FlujoPago.Where(w => w.IdFlujoPago == flujo.IdFlujoPago).FirstOrDefault();
                        fp.IdProyecto = flujo.IdProyecto;
                        fp.PrecioHora = flujo.PrecioHora;
                        fp.HorasTotales = flujo.HorasTotales;
                        fp.HorasAmortizar = flujo.HorasAmortizar;
                        fp.PorcIVA = flujo.PorcIVA;
                        fp.Activo = flujo.Activo == true ? false : true;
                        fp.FechaMod = DateTime.Now;
                        fp.IdUMod = IdUsuario;
                        contexto.SaveChanges();


                        Respuesta = flujo.IdFlujoPago;

                    }



                    return Respuesta;


                }
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public int GuardarDetalleFlujo(FlujoPagoDetModel flujo, long IdUsuario, string Conexion)
        {
            try
            {

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    if (flujo.IdFlujoPagoDet == 0) // NUEVO

                    {

                        FlujoPagoDetalle fp = new FlujoPagoDetalle();

                        fp.IdFlujoPago = flujo.IdFlujoPago;
                        fp.Secuencia = flujo.Secuencia;
                        fp.Concepto = flujo.Concepto;
                        fp.Horas = flujo.Horas;
                        fp.Procentaje = flujo.Procentaje;
                        fp.Monto = flujo.Monto;
                        fp.Amortizadas = flujo.Amortizadas;
                        //fp.FechaDev = flujo.FechaDev;
                        //fp.FechaFactura = flujo.FechaFactura;
                        //fp.FechaProgramadaPago = flujo.FechaProgramadaPago;
                        //fp.FechaPagoReal = flujo.FechaPagoReal;
                        //fp.Facturable = flujo.Facturable;
                        //fp.Facturada = flujo.Facturada;
                        //fp.Pagada = flujo.Pagada;
                        //fp.Comentarios = flujo.Comentarios;

                        contexto.FlujoPagoDetalle.Add(fp);

                        contexto.SaveChanges();



                    }
                    else // EDITAR
                    {
                        var fp = contexto.FlujoPagoDetalle.Where(w => w.IdFlujoPagoDet == flujo.IdFlujoPagoDet).FirstOrDefault();
                        fp.IdFlujoPago = flujo.IdFlujoPago;

                        fp.Concepto = flujo.Concepto;
                        fp.Horas = flujo.Horas;
                        fp.Procentaje = flujo.Procentaje;
                        fp.Monto = flujo.Monto;
                        fp.Amortizadas = flujo.Amortizadas;
                        //fp.FechaDev = flujo.FechaDev;
                        //fp.FechaFactura = flujo.FechaFactura;
                        //fp.FechaProgramadaPago = flujo.FechaProgramadaPago;
                        //fp.FechaPagoReal = flujo.FechaPagoReal;
                        //fp.Facturable = flujo.Facturable;
                        //fp.Facturada = flujo.Facturada;
                        //fp.Pagada = flujo.Pagada;
                        //fp.Comentarios = flujo.Comentarios;

                        contexto.SaveChanges();


                    }


                    return 1;

                }
            }
            catch (Exception ex)
            {

                throw ex;
            }


        }

        public int GuardarDetallesFlujo(IEnumerable<FlujoPagoDetModel> flujos, long IdUsuario, string Conexion)
        {
            if (flujos == null || !flujos.Any())
                return 0;

            var idFlujoPago = flujos.First().IdFlujoPago;

            using (var contexto = new BDProductividad_DEVEntities(Conexion))
            using (var transaction = contexto.Database.BeginTransaction())
            {
                try
                {
                    // Eliminar existentes
                    var existentes = contexto.FlujoPagoDetalle
                        .Where(x => x.IdFlujoPago == idFlujoPago)
                        .ToList();

                    if (existentes.Any())
                        contexto.FlujoPagoDetalle.RemoveRange(existentes);

                    // Insertar nuevos
                    var nuevos = flujos.Select(f => new FlujoPagoDetalle
                    {
                        IdFlujoPago = f.IdFlujoPago,
                        Secuencia = f.Secuencia,
                        Concepto = f.Concepto,
                        Horas = f.Horas,
                        Procentaje = f.Procentaje,
                        Monto = f.Monto,
                        Amortizadas = f.Amortizadas
                    });

                    contexto.FlujoPagoDetalle.AddRange(nuevos);

                    contexto.SaveChanges();
                    transaction.Commit();

                    return 1;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    // log(ex); // opcional: loggear excepción
                    throw;
                }
            }
        }


        public int GuardarFlujoPagoFechas(FlujoPagoDetModel flujo, long IdUsuario, string Conexion)
        {
            try
            {

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    var fp = contexto.FlujoPagoDetalle.Where(w => w.IdFlujoPagoDet == flujo.IdFlujoPagoDet).FirstOrDefault();


                    if (flujo.TipoFecha == 1)// FechaDev
                    {

                        if (fp.FechaDevOriginal == null)
                        {

                            fp.FechaDevOriginal = flujo.Fecha;
                        }

                        fp.FechaDev = flujo.Fecha;

                    }
                    else if (flujo.TipoFecha == 2) // FechaFactura 
                    {
                        fp.Factura = flujo.Factura;
                        fp.FechaFactura = flujo.Fecha;
                    }
                    else if (flujo.TipoFecha == 3) // FechaProgramadaPago
                    {

                        fp.FechaProgramadaPago = flujo.Fecha;
                    }
                    else if (flujo.TipoFecha == 4)// Fechapago

                    {
                        fp.FechaPagoReal = flujo.Fecha;
                    }


                    contexto.SaveChanges();

                }




                return 1;

            }
            catch (Exception ex)
            {

                throw ex;
            }


        }


        public bool EliminarDetalleFlujo(long IdFlujoPagoDet, string Conexion)
        {

            try
            {

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {


                    var fd = contexto.FlujoPagoDetalle.Where(w => w.IdFlujoPagoDet == IdFlujoPagoDet).FirstOrDefault();


                    var lst = contexto.FlujoPagoDetalle.Where(w => w.IdFlujoPago == fd.IdFlujoPago && w.Secuencia > fd.Secuencia);


                    foreach (var i in lst)
                    {


                        i.Secuencia = i.Secuencia - 1;
                    }

                    contexto.FlujoPagoDetalle.Remove(fd);

                    contexto.SaveChanges();


                }

                return true;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        #endregion

        #region Costos2
        public (List<ProyectoCostosModel> LstCosto, List<ProyectoCostosModel> LstCostoMeses) ObtieneCostosMensuales(int Anio, long IdUsuario, long IdTipoUsuario, long IdProyecto, bool Abiertos, string Conexion)
        {

            try
            {

                List<ProyectoCostosModel> _LstCosto = new List<ProyectoCostosModel>();
                List<ProyectoCostosModel> _LstCostoMeses = new List<ProyectoCostosModel>();


                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("ObtieneCostosMensuales", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@Anio", Anio);
                sqlcmd.Parameters.AddWithValue("@IdUsuario", IdUsuario);
                sqlcmd.Parameters.AddWithValue("@IdTipoUsuario", IdTipoUsuario);
                sqlcmd.Parameters.AddWithValue("@IdProyecto", IdProyecto);
                sqlcmd.Parameters.AddWithValue("@Abiertos", Abiertos);


                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();
                var _lst = ds.Tables[0];
                var _lst2 = ds.Tables[1];



                _LstCosto = (from row in _lst.AsEnumerable()
                             select (
                             new ProyectoCostosModel
                             {
                                 IdProyecto = int.Parse(row["IdProyecto"].ToString()),
                                 ClaveProy = row["Clave"].ToString(),
                                 NombreProy = row["Clave"].ToString() + "-" + row["Proyecto"].ToString(),
                                 Lider = row["Lider"].ToString(),
                                 PorcUtilizado = decimal.Parse(row["PorcUtilizado"].ToString()),
                                 Ene = decimal.Parse(row["Ene"].ToString()),
                                 Feb = decimal.Parse(row["Feb"].ToString()),
                                 Mar = decimal.Parse(row["Mar"].ToString()),
                                 Abr = decimal.Parse(row["Abr"].ToString()),
                                 May = decimal.Parse(row["May"].ToString()),
                                 Jun = decimal.Parse(row["Jun"].ToString()),
                                 Jul = decimal.Parse(row["Jul"].ToString()),
                                 Ago = decimal.Parse(row["Ago"].ToString()),
                                 Sep = decimal.Parse(row["Sep"].ToString()),
                                 Oct = decimal.Parse(row["Oct"].ToString()),
                                 Nov = decimal.Parse(row["Nov"].ToString()),
                                 Dic = decimal.Parse(row["Dic"].ToString()),
                                 Acumulado = decimal.Parse(row["Acumulado"].ToString()),
                                 Planeado = decimal.Parse(row["CostoPlan"].ToString()),
                                 CostoHoraReal = decimal.Parse(row["CostoHoraReal"].ToString()),
                                 CostoHoraPlan = decimal.Parse(row["CostoHoraPlan"].ToString()),
                                 CostoProyectado = decimal.Parse(row["CostoProyectado"].ToString()),
                             })).ToList();



                _LstCostoMeses = (from row in _lst2.AsEnumerable()
                                  select (
                                  new ProyectoCostosModel
                                  {
                                      IdProyecto = int.Parse(row["IdProyecto"].ToString()),
                                      Anio = int.Parse(row["Anio"].ToString()),
                                      Mes = int.Parse(row["Mes"].ToString()),
                                      NombreMes = row["NombreMes"].ToString(),
                                      Costo = decimal.Parse(row["TotalMes"].ToString())
                                  })).ToList();


                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();

                sqlcon.Close();


                return (_LstCosto, _LstCostoMeses);

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public List<UsuarioCostoDistribucionModel> ObtieneCostosMensualesDetalle(int Anio, int Mes, int IdProyecto, long IdUsuario, long IdTipoUsuario, string Conexion)
        {

            try
            {

                List<UsuarioCostoDistribucionModel> LstCosto = new List<UsuarioCostoDistribucionModel>();

                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("ObtieneCostosMensualesDetalle", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@Anio", Anio);
                sqlcmd.Parameters.AddWithValue("@Mes", Mes);
                sqlcmd.Parameters.AddWithValue("@IdProyecto", IdProyecto);
                sqlcmd.Parameters.AddWithValue("@IdUsuario", IdUsuario);
                sqlcmd.Parameters.AddWithValue("@IdTipoUsuario", IdTipoUsuario);


                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();
                var _lst = ds.Tables[0];



                LstCosto = (from row in _lst.AsEnumerable()
                            select (
                            new UsuarioCostoDistribucionModel
                            {
                                IdProyecto = int.Parse(row["IdProyecto"].ToString()),
                                ClaveProy = row["Clave"].ToString(),
                                Proyecto = row["Proyecto"].ToString(),
                                Anio = int.Parse(row["Anio"].ToString()),
                                Mes = int.Parse(row["Mes"].ToString()),
                                NombreMes = row["NombreMes"].ToString(),
                                Clave = row["NumEmpleado"].ToString(),
                                Recurso = row["Recurso"].ToString(),
                                Porcentaje = decimal.Parse(row["Porcentaje"].ToString()),
                                TotalMes = decimal.Parse(row["TotalMensual"].ToString()),

                            })).ToList();


                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();

                sqlcon.Close();


                return LstCosto;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }


        #endregion

        #region Sprint


        public ProyectoIteracionModel SprintReport(long IdIteracion, string Estatus, string Conexion)
        {
            try
            {


                ProyectoIteracionModel sprint = new ProyectoIteracionModel();


                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spReporteSprint", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdIteracion", IdIteracion);
                sqlcmd.Parameters.AddWithValue("@Estatus", Estatus);


                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();
                var _lst = ds.Tables[0];
                var _lstAct = ds.Tables[1];
                var _lstEnc = ds.Tables[3];



                sprint = (from row in _lst.AsEnumerable()
                          select (
                          new ProyectoIteracionModel
                          {
                              IdIteracion = int.Parse(row["IdIteracion"].ToString()),
                              IdProyecto = int.Parse(row["IdProyecto"].ToString()),
                              Proyecto = row["Proyecto"].ToString(),
                              Nombre = row["Nombre"].ToString(),
                              Objetivo = row["Objetivo"].ToString(),
                              Estatus = row["Estatus"].ToString(),
                              EstatusStr = row["EstatusStr"].ToString(),
                              FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
                              FechaFin = DateTime.Parse(row["FechaFin"].ToString()),
                              CantActividades = int.Parse(row["CantActividades"].ToString()),
                              CantActividadesTerminadas = int.Parse(row["CantActividadesTerminadas"].ToString()),
                              HorasTotales = decimal.Parse(row["HorasTotales"].ToString()),
                              HorasTerminadas = decimal.Parse(row["HorasTerminadas"].ToString()),
                              Avance = decimal.Parse(row["Avance"].ToString()),
                              Velocidad = decimal.Parse(row["Velocidad"].ToString()),
                              VelocidadActual = decimal.Parse(row["VelocidadActual"].ToString())
                          })).FirstOrDefault();


                sprint.Actividades = (from row in _lstAct.AsEnumerable()
                                      select (
                                      new ActividadesModel
                                      {
                                          IdActividad = long.Parse(row["IdActividad"].ToString()),
                                          IdActividadStr = row["ClaveProyecto"].ToString() + "-" + row["IdActividad"].ToString(),
                                          IdActividadR1 = long.Parse(row["IdActividadHu"].ToString()),
                                          Estatus = row["Estatus"].ToString(),
                                          EstatusStr = row["EstatusStr"].ToString(),
                                          BR = row["BR"].ToString(),
                                          Descripcion = row["Descripcion"].ToString(),
                                          PrioridadStr = row["PrioridadStr"].ToString(),
                                          ClaveUsuario = row["ClaveUsuario"].ToString(),
                                          AsignadoStr = row["Asignado"].ToString(),
                                          AsignadoPath = row["ClaveUsuario"].ToString(),
                                          FechaInicio = row["FechaInicio"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaInicio"].ToString()),
                                          FechaSolicitado = row["FechaSolicitado"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaSolicitado"].ToString()),
                                          FechaTermino = row["FechaTermino"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaTermino"].ToString()),
                                          TipoNombre = row["TipoNombre"].ToString(),
                                          TipoUrl = row["TipoUrl"].ToString(),
                                          ClaveTipoActividad = row["ClaveFase"].ToString(),
                                          ClaveClasificacionActividad = row["ClaveClasificacionActividad"].ToString(),
                                          TipoActividadStr = row["Fase"].ToString(),
                                          ClasificacionStr = row["Clasificacion"].ToString(),
                                          HorasFacturables = row["HorasFacturables"].ToString() == "" ? (decimal?)null : Convert.ToDecimal(row["HorasFacturables"].ToString()),
                                          HorasAsignadas = row["HorasAsignadas"].ToString() == "" ? (decimal?)null : Convert.ToDecimal(row["HorasAsignadas"].ToString()),
                                          HorasFinales = decimal.Parse(row["HorasFinales"].ToString())
                                      })).ToList();


                var dt = new DataTable();


                var gr = new GraficaConsultaModel();

                dt = ds.Tables[2];

                gr.id = Guid.NewGuid();
                gr.Nombre = "Burndown";
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

                sprint.Grafica = gr;



                sprint.LstFases = (from row in _lstEnc.AsEnumerable()
                                   select (
                                   new ActividadesModel
                                   {
                                       //TipoActividadId = long.Parse(row["TipoActividadId"].ToString()),
                                       ClaveTipoActividad = row["ClaveFase"].ToString(),
                                       TipoActividadStr = row["Fase"].ToString(),
                                       HorasAsignadas = decimal.Parse(row["HorasAsignadas"].ToString()),
                                       HorasFinales = decimal.Parse(row["HorasTerminadas"].ToString()),
                                       Progreso = decimal.Parse(row["Avance"].ToString()),
                                       FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
                                       FechaFin = DateTime.Parse(row["FechaFin"].ToString()),
                                   })).OrderBy(o => o.IdActividad).ToList();

                sprint.LstHus = (from row in ds.Tables[4].AsEnumerable()
                                 select (
                                 new ActividadesModel
                                 {
                                     //TipoActividadId = long.Parse(row["TipoActividadId"].ToString()),
                                     IdActividad = long.Parse(row["IdActividadHu"].ToString()),
                                     ClaveTipoActividad = row["IdActividadHu"].ToString(),
                                     TipoActividadStr = row["BRHu"].ToString(),
                                     HorasAsignadas = decimal.Parse(row["HorasAsignadas"].ToString()),
                                     HorasFinales = decimal.Parse(row["HorasTerminadas"].ToString()),
                                     Progreso = decimal.Parse(row["Avance"].ToString()),
                                     FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
                                     FechaFin = DateTime.Parse(row["FechaFin"].ToString()),
                                 })).OrderBy(o => o.IdActividad).ToList();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();

                sqlcon.Close();





                return sprint;



            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public ProyectoIteracionModel SprintReport_Indicadores(long IdIteracion, string Conexion)
        {
            try
            {


                ProyectoIteracionModel sprint = new ProyectoIteracionModel();


                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spReporteSprint_Indicadores", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdIteracion", IdIteracion);

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();
                var _lst = ds.Tables[0];
                //var _lstAct = ds.Tables[1];
                //var _lstEnc = ds.Tables[3];



                sprint = (from row in _lst.AsEnumerable()
                          select (
                          new ProyectoIteracionModel
                          {
                              IdIteracion = int.Parse(row["IdIteracion"].ToString()),
                              IdProyecto = int.Parse(row["IdProyecto"].ToString()),
                              Proyecto = row["Proyecto"].ToString(),
                              Nombre = row["Nombre"].ToString(),
                              Objetivo = row["Objetivo"].ToString(),
                              Estatus = row["Estatus"].ToString(),
                              EstatusStr = row["EstatusStr"].ToString(),
                              FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
                              FechaFin = DateTime.Parse(row["FechaFin"].ToString()),
                              FechaProyectada = DateTime.Parse(row["FechaProyectada"].ToString()),
                              CantActividades = int.Parse(row["CantActividades"].ToString()),
                              CantActividadesTerminadas = int.Parse(row["CantActividadesTerminadas"].ToString()),
                              HorasTotales = decimal.Parse(row["HorasTotales"].ToString()),
                              HorasTerminadas = decimal.Parse(row["HorasTerminadas"].ToString()),
                              HorasPendientes = decimal.Parse(row["Pendientes"].ToString()),
                              Avance = decimal.Parse(row["Avance"].ToString()),
                              Velocidad = row["Velocidad"].ToString() == "" ? 0 : decimal.Parse(row["Velocidad"].ToString()),
                              VelocidadActual = row["VelocidadActual"].ToString() == "" ? 0 : decimal.Parse(row["VelocidadActual"].ToString()),
                              Puntos = int.Parse(row["Puntos"].ToString()),
                              PuntosC = int.Parse(row["PCompletado"].ToString()),
                              PuntosP = int.Parse(row["PPendiente"].ToString()),
                              Plan = int.Parse(row["Planeacion"].ToString())
                          })).FirstOrDefault();


                //sprint.Actividades = (from row in _lstAct.AsEnumerable()
                //                      select (
                //                      new ActividadesModel
                //                      {
                //                          IdActividad = long.Parse(row["IdActividad"].ToString()),
                //                          IdActividadStr = row["ClaveProyecto"].ToString() + "-" + row["IdActividad"].ToString(),
                //                          IdActividadR1 = long.Parse(row["IdActividadHu"].ToString()),
                //                          Estatus = row["Estatus"].ToString(),
                //                          EstatusStr = row["EstatusStr"].ToString(),
                //                          BR = row["BR"].ToString(),
                //                          Descripcion = row["Descripcion"].ToString(),
                //                          PrioridadStr = row["PrioridadStr"].ToString(),
                //                          ClaveUsuario = row["ClaveUsuario"].ToString(),
                //                          AsignadoStr = row["Asignado"].ToString(),
                //                          AsignadoPath = row["ClaveUsuario"].ToString(),
                //                          FechaInicio = row["FechaInicio"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaInicio"].ToString()),
                //                          FechaSolicitado = row["FechaSolicitado"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaSolicitado"].ToString()),
                //                          FechaTermino = row["FechaTermino"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaTermino"].ToString()),
                //                          TipoNombre = row["TipoNombre"].ToString(),
                //                          TipoUrl = row["TipoUrl"].ToString(),
                //                          ClaveTipoActividad = row["ClaveFase"].ToString(),
                //                          ClaveClasificacionActividad = row["ClaveClasificacionActividad"].ToString(),
                //                          TipoActividadStr = row["Fase"].ToString(),
                //                          ClasificacionStr = row["Clasificacion"].ToString(),
                //                          HorasFacturables = row["HorasFacturables"].ToString() == "" ? (decimal?)null : Convert.ToDecimal(row["HorasFacturables"].ToString()),
                //                          HorasAsignadas = row["HorasAsignadas"].ToString() == "" ? (decimal?)null : Convert.ToDecimal(row["HorasAsignadas"].ToString()),
                //                          HorasFinales = decimal.Parse(row["HorasFinales"].ToString())
                //                      })).ToList();


                var dt = new DataTable();


                var gr = new GraficaConsultaModel();

                dt = ds.Tables[1];

                gr.id = Guid.NewGuid();
                gr.Nombre = "Burndown";
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
                    gbm.barWidth = "1px";

                    lstval.Add(gbm);
                }

                gr.LstValores = JsonConvert.SerializeObject(lstval);
                gr.LstColumnas = JsonConvert.SerializeObject(columns);
                gr.Series = JsonConvert.SerializeObject(lst);



                gr.Tabla = ConvertirDatos.GenerarTablaHtml(dt);

                sprint.Grafica = gr;



                //sprint.LstFases = (from row in _lstEnc.AsEnumerable()
                //                   select (
                //                   new ActividadesModel
                //                   {
                //                       //TipoActividadId = long.Parse(row["TipoActividadId"].ToString()),
                //                       ClaveTipoActividad = row["ClaveFase"].ToString(),
                //                       TipoActividadStr = row["Fase"].ToString(),
                //                       HorasAsignadas = decimal.Parse(row["HorasAsignadas"].ToString()),
                //                       HorasFinales = decimal.Parse(row["HorasTerminadas"].ToString()),
                //                       Progreso = decimal.Parse(row["Avance"].ToString()),
                //                       FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
                //                       FechaFin = DateTime.Parse(row["FechaFin"].ToString()),
                //                   })).OrderBy(o => o.IdActividad).ToList();

                //sprint.LstHus = (from row in ds.Tables[4].AsEnumerable()
                //                 select (
                //                 new ActividadesModel
                //                 {
                //                     //TipoActividadId = long.Parse(row["TipoActividadId"].ToString()),
                //                     IdActividad = long.Parse(row["IdActividadHu"].ToString()),
                //                     ClaveTipoActividad = row["IdActividadHu"].ToString(),
                //                     TipoActividadStr = row["BRHu"].ToString(),
                //                     HorasAsignadas = decimal.Parse(row["HorasAsignadas"].ToString()),
                //                     HorasFinales = decimal.Parse(row["HorasTerminadas"].ToString()),
                //                     Progreso = decimal.Parse(row["Avance"].ToString()),
                //                     FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
                //                     FechaFin = DateTime.Parse(row["FechaFin"].ToString()),
                //                 })).OrderBy(o => o.IdActividad).ToList();

                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();

                sqlcon.Close();





                return sprint;



            }
            catch (Exception ex)
            {

                throw ex;
            }

        }
        public ProyectoIteracionModel SprintReport_Actividades(long IdIteracion, string Estatus, string Conexion)
        {
            try
            {


                ProyectoIteracionModel sprint = new ProyectoIteracionModel();


                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spReporteSprint_Actividades", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdIteracion", IdIteracion);
                sqlcmd.Parameters.AddWithValue("@Estatus", Estatus);


                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();

                var _lstAct = ds.Tables[0];

                sprint.Actividades = (from row in _lstAct.AsEnumerable()
                                      select (
                                      new ActividadesModel
                                      {
                                          IdActividad = long.Parse(row["IdActividad"].ToString()),
                                          IdActividadStr = row["IdActividadStr"].ToString(),
                                          IdActividadR1 = long.Parse(row["IdActividadHu"].ToString()),
                                          Estatus = row["Estatus"].ToString(),
                                          EstatusStr = row["EstatusStr"].ToString(),
                                          BR = row["BR"].ToString(),
                                          Descripcion = row["Descripcion"].ToString(),
                                          PrioridadStr = row["PrioridadStr"].ToString(),
                                          ClaveUsuario = row["ClaveUsuario"].ToString(),
                                          AsignadoStr = row["Asignado"].ToString(),
                                          AsignadoPath = row["ClaveUsuario"].ToString(),
                                          FechaInicio = row["FechaInicio"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaInicio"].ToString()),
                                          FechaSolicitado = row["FechaSolicitado"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaSolicitado"].ToString()),
                                          FechaTermino = row["FechaTermino"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaTermino"].ToString()),
                                          TipoNombre = row["TipoNombre"].ToString(),
                                          TipoUrl = row["TipoUrl"].ToString(),
                                          ClaveTipoActividad = row["ClaveFase"].ToString(),
                                          ClaveClasificacionActividad = row["ClaveClasificacionActividad"].ToString(),
                                          TipoActividadStr = row["Fase"].ToString(),
                                          ClasificacionStr = row["Clasificacion"].ToString(),
                                          HorasFacturables = row["HorasFacturables"].ToString() == "" ? (decimal?)null : Convert.ToDecimal(row["HorasFacturables"].ToString()),
                                          HorasAsignadas = row["HorasAsignadas"].ToString() == "" ? (decimal?)null : Convert.ToDecimal(row["HorasAsignadas"].ToString()),
                                          HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),
                                          IdProyecto = long.Parse(row["IdProyecto"].ToString())
                                      })).ToList();





                sprint.LstFases = (from row in ds.Tables[1].AsEnumerable()
                                   select (
                                   new ActividadesModel
                                   {
                                       TipoActividadId = long.Parse(row["TipoActividadId"].ToString()),
                                       ClaveTipoActividad = row["ClaveFase"].ToString(),
                                       TipoActividadStr = row["Fase"].ToString(),
                                       HorasFacturables = decimal.Parse(row["HorasFacturables"].ToString()),
                                       HorasAsignadas = decimal.Parse(row["HorasTerminadas"].ToString()),
                                       HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),
                                       Progreso = decimal.Parse(row["Avance"].ToString()),
                                       FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
                                       FechaFin = DateTime.Parse(row["FechaFin"].ToString()),
                                   })).OrderBy(o => o.IdActividad).ToList();

                sprint.LstHus = (from row in ds.Tables[2].AsEnumerable()
                                 select (
                                 new ActividadesModel
                                 {
                                     //TipoActividadId = long.Parse(row["TipoActividadId"].ToString()),
                                     IdActividad = long.Parse(row["IdActividadHu"].ToString()),
                                     IdActividadStr = row["IdActividadStr"].ToString(),
                                     ClaveTipoActividad = row["IdActividadHu"].ToString(),
                                     TipoActividadStr = row["BRHu"].ToString(),
                                     HorasFacturables = decimal.Parse(row["HorasFacturables"].ToString()),
                                     HorasAsignadas = decimal.Parse(row["HorasTerminadas"].ToString()),
                                     HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),
                                     Progreso = decimal.Parse(row["Avance"].ToString()),
                                     FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
                                     FechaFin = DateTime.Parse(row["FechaFin"].ToString()),
                                     Puntos = int.Parse(row["Puntos"].ToString()),
                                 })).OrderBy(o => o.IdActividad).ToList();

                sprint.LstClasificacion = (from row in ds.Tables[3].AsEnumerable()
                                           select (
                                           new ActividadesModel
                                           {
                                               //TipoActividadId = long.Parse(row["TipoActividadId"].ToString()),
                                               //IdActividad = long.Parse(row["IdActividadHu"].ToString()),
                                               ClaveTipoActividad = row["ClaveClasif"].ToString(),
                                               TipoActividadStr = row["Clasificacion"].ToString(),
                                               HorasFacturables = decimal.Parse(row["HorasFacturables"].ToString()),
                                               HorasAsignadas = decimal.Parse(row["HorasTerminadas"].ToString()),
                                               HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),
                                               Progreso = decimal.Parse(row["Avance"].ToString()),
                                               FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
                                               FechaFin = DateTime.Parse(row["FechaFin"].ToString()),
                                           })).OrderBy(o => o.IdActividad).ToList();

                sprint.LstRecursos = (from row in ds.Tables[4].AsEnumerable()
                                      select (
                                      new ActividadesModel
                                      {
                                          //TipoActividadId = long.Parse(row["TipoActividadId"].ToString()),
                                          //IdActividad = long.Parse(row["IdActividadHu"].ToString()),
                                          ClaveTipoActividad = row["ClaveClasif"].ToString(),
                                          TipoActividadStr = row["Clasificacion"].ToString(),
                                          HorasFacturables = decimal.Parse(row["HorasFacturables"].ToString()),
                                          HorasAsignadas = decimal.Parse(row["HorasTerminadas"].ToString()),
                                          HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),
                                          Progreso = decimal.Parse(row["Avance"].ToString()),
                                          FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
                                          FechaFin = DateTime.Parse(row["FechaFin"].ToString()),
                                          Objetivo = decimal.Parse(row["Objetivo"].ToString()),
                                          Performance = decimal.Parse(row["Performance"].ToString()),
                                      })).OrderBy(o => o.IdActividad).ToList();


                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();

                sqlcon.Close();





                return sprint;



            }
            catch (Exception ex)
            {

                throw ex;
            }

        }




        public ProyectoIteracionModel SprintReport_Actividades_Filtrar(long IdIteracion, string Estatus, DateTime? FechaIni, DateTime? FechaFin, int TipoId, long IdUsuarioAsignado, long IdHu, string Conexion)
        {
            try
            {


                ProyectoIteracionModel sprint = new ProyectoIteracionModel();


                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spReporteSprint_Actividades_Filtrar", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdIteracion", IdIteracion);
                sqlcmd.Parameters.AddWithValue("@Estatus", Estatus);
                sqlcmd.Parameters.AddWithValue("@FechaIni", FechaIni);
                sqlcmd.Parameters.AddWithValue("@FechaFin", FechaFin);
                sqlcmd.Parameters.AddWithValue("@TipoId", TipoId);
                sqlcmd.Parameters.AddWithValue("@IdUsuarioAsignado", IdUsuarioAsignado);
                sqlcmd.Parameters.AddWithValue("@IdHu", IdHu);




                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();

                var _lstAct = ds.Tables[0];

                sprint.Actividades = (from row in _lstAct.AsEnumerable()
                                      select (
                                      new ActividadesModel
                                      {
                                          IdActividad = long.Parse(row["IdActividad"].ToString()),
                                          IdActividadStr = row["IdActividadStr"].ToString(),
                                          IdActividadR1 = long.Parse(row["IdActividadHu"].ToString()),
                                          Estatus = row["Estatus"].ToString(),
                                          EstatusStr = row["EstatusStr"].ToString(),
                                          BR = row["BR"].ToString(),
                                          Descripcion = row["Descripcion"].ToString(),
                                          PrioridadStr = row["PrioridadStr"].ToString(),
                                          ClaveUsuario = row["ClaveUsuario"].ToString(),
                                          AsignadoStr = row["Asignado"].ToString(),
                                          AsignadoPath = row["ClaveUsuario"].ToString(),
                                          FechaInicio = row["FechaInicio"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaInicio"].ToString()),
                                          FechaSolicitado = row["FechaSolicitado"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaSolicitado"].ToString()),
                                          FechaTermino = row["FechaTermino"].ToString() == "" ? (DateTime?)null : DateTime.Parse(row["FechaTermino"].ToString()),
                                          TipoNombre = row["TipoNombre"].ToString(),
                                          TipoUrl = row["TipoUrl"].ToString(),
                                          ClaveTipoActividad = row["ClaveFase"].ToString(),
                                          ClaveClasificacionActividad = row["ClaveClasificacionActividad"].ToString(),
                                          TipoActividadStr = row["Fase"].ToString(),
                                          ClasificacionStr = row["Clasificacion"].ToString(),
                                          HorasFacturables = row["HorasFacturables"].ToString() == "" ? (decimal?)null : Convert.ToDecimal(row["HorasFacturables"].ToString()),
                                          HorasAsignadas = row["HorasAsignadas"].ToString() == "" ? (decimal?)null : Convert.ToDecimal(row["HorasAsignadas"].ToString()),
                                          HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),
                                          IdProyecto = long.Parse(row["IdProyecto"].ToString())
                                      })).ToList();





                sprint.LstFases = (from row in ds.Tables[1].AsEnumerable()
                                   select (
                                   new ActividadesModel
                                   {
                                       TipoActividadId = long.Parse(row["TipoActividadId"].ToString()),
                                       ClaveTipoActividad = row["ClaveFase"].ToString(),
                                       TipoActividadStr = row["Fase"].ToString(),
                                       HorasFacturables = decimal.Parse(row["HorasFacturables"].ToString()),
                                       HorasAsignadas = decimal.Parse(row["HorasTerminadas"].ToString()),
                                       HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),
                                       Progreso = decimal.Parse(row["Avance"].ToString()),
                                       FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
                                       FechaFin = DateTime.Parse(row["FechaFin"].ToString()),
                                   })).OrderBy(o => o.IdActividad).ToList();

                sprint.LstHus = (from row in ds.Tables[2].AsEnumerable()
                                 select (
                                 new ActividadesModel
                                 {
                                     //TipoActividadId = long.Parse(row["TipoActividadId"].ToString()),
                                     IdActividad = long.Parse(row["IdActividadHu"].ToString()),
                                     IdActividadStr = row["IdActividadStr"].ToString(),
                                     ClaveTipoActividad = row["IdActividadHu"].ToString(),
                                     TipoActividadStr = row["BRHu"].ToString(),
                                     HorasFacturables = decimal.Parse(row["HorasFacturables"].ToString()),
                                     HorasAsignadas = decimal.Parse(row["HorasTerminadas"].ToString()),
                                     HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),
                                     Progreso = decimal.Parse(row["Avance"].ToString()),
                                     FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
                                     FechaFin = DateTime.Parse(row["FechaFin"].ToString()),
                                     Puntos = int.Parse(row["Puntos"].ToString()),
                                 })).OrderBy(o => o.IdActividad).ToList();

                sprint.LstClasificacion = (from row in ds.Tables[3].AsEnumerable()
                                           select (
                                           new ActividadesModel
                                           {
                                               //TipoActividadId = long.Parse(row["TipoActividadId"].ToString()),
                                               //IdActividad = long.Parse(row["IdActividadHu"].ToString()),
                                               ClaveTipoActividad = row["ClaveClasif"].ToString(),
                                               TipoActividadStr = row["Clasificacion"].ToString(),
                                               HorasFacturables = decimal.Parse(row["HorasFacturables"].ToString()),
                                               HorasAsignadas = decimal.Parse(row["HorasTerminadas"].ToString()),
                                               HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),
                                               Progreso = decimal.Parse(row["Avance"].ToString()),
                                               FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
                                               FechaFin = DateTime.Parse(row["FechaFin"].ToString()),
                                           })).OrderBy(o => o.IdActividad).ToList();

                sprint.LstRecursos = (from row in ds.Tables[4].AsEnumerable()
                                      select (
                                      new ActividadesModel
                                      {
                                          //TipoActividadId = long.Parse(row["TipoActividadId"].ToString()),
                                          //IdActividad = long.Parse(row["IdActividadHu"].ToString()),
                                          ClaveTipoActividad = row["ClaveClasif"].ToString(),
                                          TipoActividadStr = row["Clasificacion"].ToString(),
                                          HorasFacturables = decimal.Parse(row["HorasFacturables"].ToString()),
                                          HorasAsignadas = decimal.Parse(row["HorasTerminadas"].ToString()),
                                          HorasFinales = decimal.Parse(row["HorasFinales"].ToString()),
                                          Progreso = decimal.Parse(row["Avance"].ToString()),
                                          FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
                                          FechaFin = DateTime.Parse(row["FechaFin"].ToString()),
                                          Objetivo = decimal.Parse(row["Objetivo"].ToString()),
                                          Performance = decimal.Parse(row["Performance"].ToString()),
                                      })).OrderBy(o => o.IdActividad).ToList();


                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();

                sqlcon.Close();





                return sprint;



            }
            catch (Exception ex)
            {

                throw ex;
            }

        }


        public List<ActividadesModel> SprintReport_ConsultaTrabajoCompletado(long IdIteracion, string Conexion)
        {
            try
            {
                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("ObtieneHusSprint", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdIteracion", IdIteracion);
                List<ActividadesModel> Lst = new List<ActividadesModel>();

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();

                var _lstAct = ds.Tables[0];

                Lst = (from row in _lstAct.AsEnumerable()
                       select (
                       new ActividadesModel
                       {
                           IdActividad = long.Parse(row["IdActividad"].ToString()),
                           IdActividadStr = row["IdActividadStr"].ToString(),
                           BR = row["BR"].ToString(),
                           Puntos = int.Parse(row["Puntos"].ToString()),
                           Seleccionado = row["Completado"].ToString() == "0" ? false : true
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


        public bool CambiaEstatusSprint(long IdIteracion, string Estatus, string Conexion)
        {
            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    var i = contexto.ProyectoIteracion.Where(w => w.IdIteracion == IdIteracion).FirstOrDefault();

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


        public bool GuardarSprintRetrospectiva(ProyectoIteracionModel pi, string Actividades, string Conexion)
        {
            try
            {

                var Lst = Actividades.Split(',');

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    var i = contexto.ProyectoIteracion.Where(w => w.IdIteracion == pi.IdIteracion).FirstOrDefault();

                    i.Estatus = "L";
                    i.FechaCierre = pi.FechaCierre;
                    i.Retrospectiva = pi.Retrospectiva;
                    i.PPlaneado = pi.PPlaneado;
                    i.PTerminado = pi.PTerminado;

                    List<ProyectoIteracionComplete> pic = contexto.ProyectoIteracionComplete.Where(w => w.IdIteracion == pi.IdIteracion).ToList();

                    contexto.ProyectoIteracionComplete.RemoveRange(pic);

                    List<ProyectoIteracionComplete> picn = Lst.Where(w => w != "").Select(s =>

                        new ProyectoIteracionComplete
                        {
                            IdIteracion = pi.IdIteracion,
                            IdActividad = int.Parse(s),
                            IdUCreo = pi.IdUCreo,
                            FechaCreo = DateTime.Now
                        }
                        ).ToList();

                    contexto.ProyectoIteracionComplete.AddRange(picn);


                    contexto.SaveChanges();


                }

                return true;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }


        public ProyectoIteracionModel ConsultaSprintRetrospectiva(long IdIteracion, string Conexion)
        {
            try
            {

                ProyectoIteracionModel pi = new ProyectoIteracionModel();
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    pi = contexto.ProyectoIteracion.Where(w => w.IdIteracion == IdIteracion).Select(s => new ProyectoIteracionModel
                    {

                        Nombre = s.Nombre,
                        FechaCierre = s.FechaCierre,
                        Retrospectiva = s.Retrospectiva

                    }).FirstOrDefault();

                }

                return pi;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }


        public List<ProyectoIteracionModel> ConsultaResumenSprints(long IdProyecto, string Conexion)
        {
            try
            {



                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spProyectoSprintsResumen", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdProyecto", IdProyecto);


                sqlcmd.CommandType = CommandType.StoredProcedure;

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();

                List<ProyectoIteracionModel> LstSprints = new List<ProyectoIteracionModel>();


                var dt = new DataTable();
                var dt2 = new DataTable();
                dt = ds.Tables[0];


                LstSprints = (from row in dt.AsEnumerable()
                              select (new ProyectoIteracionModel
                              {
                                  IdIteracion = long.Parse(row["IdIteracion"].ToString()),
                                  IdProyecto = long.Parse(row["IdProyecto"].ToString()),
                                  Nombre = row["Nombre"].ToString(),
                                  Objetivo = row["Objetivo"].ToString(),
                                  Estatus = row["Estatus"].ToString(),
                                  Estatus2 = row["Estatus2"].ToString(),
                                  EstatusStr = row["EstatusStr"].ToString(),
                                  FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
                                  FechaFin = DateTime.Parse(row["FechaFin"].ToString()),
                                  Avance = decimal.Parse(row["Avance"].ToString())
                              })).ToList();



                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();
                sqlcon.Close();


                return LstSprints;



            }
            catch (Exception ex)
            {

                throw ex;
            }

        }


        public List<ProyectoIteracionModel> ConsultaSprintsV2(long IdProyecto, List<string> Estatus, string Conexion)
        {
            try
            {

                List<ProyectoIteracionModel> LstSprints = new List<ProyectoIteracionModel>();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    LstSprints = contexto.ProyectoIteracion.Where(w => w.IdProyecto == IdProyecto && Estatus.Contains(w.Estatus))
                                 .Select(s =>
                                new ProyectoIteracionModel
                                {
                                    IdIteracion = s.IdIteracion,
                                    IdProyecto = s.IdProyecto,
                                    Nombre = s.Nombre,
                                    Objetivo = s.Objetivo,
                                    FechaInicio = s.FechaInicio,
                                    FechaFin = s.FechaFin,
                                    Estatus = s.Estatus,

                                    Actividades = s.Actividad.Select(
                                                  sa => new ActividadesModel
                                                  {
                                                      IdActividad = sa.IdActividad,
                                                      IdActividadStr = s.Proyecto.Clave + "- " + sa.IdActividad.ToString(),
                                                      IdUsuarioAsignado = sa.IdUsuarioAsignado,
                                                      ClaveTipoActividad = contexto.CatalogoGeneral.Where(c => c.IdCatalogo == sa.TipoActividadId).Select(i => i.DescCorta).FirstOrDefault(),
                                                      ProyectoStr = contexto.Proyecto.Where(c => c.IdProyecto == sa.IdProyecto).Select(i => i.Nombre).FirstOrDefault(),
                                                      ClaveUsuario = contexto.Usuario.Where(c => c.IdUsuario == sa.IdUsuarioAsignado).Select(i => i.NumEmpleado).FirstOrDefault(),
                                                      Descripcion = sa.Descripcion,
                                                      DocumentoRef = sa.DocumentoRef,
                                                      Estatus = sa.Estatus,
                                                      Prioridad = sa.Prioridad,
                                                      Planificada = sa.Planificada,
                                                      ComentariosFinales = sa.ComentariosFinales,
                                                      BR = sa.BR,
                                                      HorasFacturables = sa.HorasFacturables,
                                                      HorasAsignadas = sa.HorasAsignadas,
                                                      HorasFinales = sa.HorasFinales,
                                                      IdProyecto = sa.IdProyecto,
                                                      TipoActividadId = sa.TipoActividadId,
                                                      ClasificacionId = sa.ClasificacionId,
                                                      //IdActividadRef = s.IdActividadRef,
                                                      FechaSolicitado = sa.FechaSolicitado,
                                                      FechaInicio = sa.FechaInicio,
                                                      FechaTermino = sa.FechaTermino,
                                                      FechaRevision = sa.FechaRevision,
                                                      FechaCierre = sa.FechaCierre,
                                                      IdUsuarioResponsable = sa.IdUsuarioResponsable,
                                                      DescripcionRechazo = sa.DescripcionRechazo,
                                                      EvidenciaRechazo = sa.EvidenciaRechazo,

                                                  }).ToList()

                                }


                        ).ToList();

                }

                return LstSprints;


            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public List<ProyectoIteracionModel> ConsultaResumenSprintsUsuario(long IdUsuario, string Conexion)
        {
            try
            {



                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spSprintsResumen", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdUsuario", IdUsuario);

                sqlcmd.CommandType = CommandType.StoredProcedure;

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();

                List<ProyectoIteracionModel> LstSprints = new List<ProyectoIteracionModel>();


                var dt = new DataTable();
                var dt2 = new DataTable();
                dt = ds.Tables[0];


                LstSprints = (from row in dt.AsEnumerable()
                              select (new ProyectoIteracionModel
                              {
                                  IdIteracion = long.Parse(row["IdIteracion"].ToString()),
                                  IdProyecto = long.Parse(row["IdProyecto"].ToString()),
                                  Nombre = row["Nombre"].ToString(),
                                  Objetivo = row["Objetivo"].ToString(),
                                  Estatus = row["Estatus"].ToString(),
                                  Estatus2 = row["Estatus2"].ToString(),
                                  EstatusStr = row["EstatusStr"].ToString(),
                                  FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
                                  FechaFin = DateTime.Parse(row["FechaFin"].ToString()),
                                  Avance = decimal.Parse(row["Avance"].ToString())
                              })).ToList();



                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();
                sqlcon.Close();


                return LstSprints;



            }
            catch (Exception ex)
            {

                throw ex;
            }

        }



        public List<ProyectoIteracionModel> ConsultaResumenSprintsCompartidos(long IdUsuario, string Conexion)
        {
            try
            {



                DataSet ds = new DataSet();

                SqlConnection sqlcon = new SqlConnection(Conexion);
                SqlCommand sqlcmd = new SqlCommand("spSprintsResumen_Compartidos", sqlcon);
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@IdUsuario", IdUsuario);

                sqlcmd.CommandType = CommandType.StoredProcedure;

                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);

                da.Fill(ds);
                da.Dispose();

                List<ProyectoIteracionModel> LstSprints = new List<ProyectoIteracionModel>();


                var dt = new DataTable();
                var dt2 = new DataTable();
                dt = ds.Tables[0];


                LstSprints = (from row in dt.AsEnumerable()
                              select (new ProyectoIteracionModel
                              {
                                  IdIteracion = long.Parse(row["IdIteracion"].ToString()),
                                  IdProyecto = long.Parse(row["IdProyecto"].ToString()),
                                  Nombre = row["Nombre"].ToString(),
                                  Objetivo = row["Objetivo"].ToString(),
                                  Estatus = row["Estatus"].ToString(),
                                  Estatus2 = row["Estatus2"].ToString(),
                                  EstatusStr = row["EstatusStr"].ToString(),
                                  FechaInicio = DateTime.Parse(row["FechaInicio"].ToString()),
                                  FechaFin = DateTime.Parse(row["FechaFin"].ToString()),
                                  Avance = decimal.Parse(row["Avance"].ToString())
                              })).ToList();



                sqlcmd.Connection.Close();
                sqlcmd.Connection.Dispose();
                sqlcmd.Dispose();
                sqlcon.Close();


                return LstSprints;



            }
            catch (Exception ex)
            {

                throw ex;
            }

        }





        public bool GuardarSprintCompartir(long IdUsuario, long IdIteracion, List<long> LstUsuarios, string Conexion)
        {
            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    List<ProyectoIteracionShare> Lst = new List<ProyectoIteracionShare>();
                    //List<long> LstFinal = new List<long>();


                    var l = contexto.ProyectoIteracionShare.Where(w => w.IdIteracion == IdIteracion).ToList();

                    contexto.ProyectoIteracionShare.RemoveRange(l);

                    //foreach( var u in LstUsuarios)
                    //{
                    //    var s = contexto.QueryShare.Where(w => w.IdQuery == IdQuery && w.IdUsuario == u).FirstOrDefault();

                    //    if(s == null)
                    //    {
                    //        LstFinal.Add(u);
                    //    }

                    //}

                    Lst = LstUsuarios.Select(s => new ProyectoIteracionShare()
                    {

                        IdIteracion = IdIteracion,
                        IdUsuario = s,
                        IdUCreo = IdUsuario,
                        FechaCreo = DateTime.Now

                    }).ToList();

                    contexto.ProyectoIteracionShare.AddRange(Lst);
                    contexto.SaveChanges();
                }
                return false;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public List<long> ConsultaCompartirSprint(long IdIteracion, string Conexion)
        {
            try
            {
                List<long> Lst = new List<long>();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    Lst = contexto.ProyectoIteracionShare.Where(w => w.IdIteracion == IdIteracion).
                          Select(s => s.IdUsuario).ToList();

                }

                return Lst;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        #endregion

        #region ProyectoDocumentos

        public int GuardaArchivo(ProyectoDocumentosModel archivo, string Conexion)
        {
            try
            {

                if (archivo.IdProDoc == 0)
                {
                    ProyectoDocumentos p = new ProyectoDocumentos();

                    p.IdProyecto = archivo.IdProyecto;
                    p.TipoDocumentoId = archivo.TipoDocumentoId;
                    p.Name = archivo.Name;
                    p.Extension = archivo.Extension;
                    p.Ubicacion = archivo.Ubicacion;
                    p.Activo = true;
                    p.FechaCreo = DateTime.Now;
                    p.IdUCreo = archivo.IdUCreo;


                    using (var contexto = new BDProductividad_DEVEntities(Conexion))
                    {

                        var existe = contexto.ProyectoDocumentos.Where(w => w.IdProyecto == p.IdProyecto && w.Name == p.Name).FirstOrDefault();

                        if (existe == null)
                        {
                            contexto.ProyectoDocumentos.Add(p);
                            contexto.SaveChanges();
                        }
                    }


                }
                else
                {

                    using (var contexto = new BDProductividad_DEVEntities(Conexion))
                    {

                        var p = contexto.ProyectoDocumentos.Where(w => w.IdProDoc == archivo.IdProDoc).FirstOrDefault();

                        p.TipoDocumentoId = archivo.TipoDocumentoId;
                        p.Name = archivo.Name;
                        p.Extension = archivo.Extension;
                        p.Ubicacion = archivo.Ubicacion;
                        p.Activo = true;
                        p.FechaCreo = DateTime.Now;
                        p.IdUCreo = archivo.IdUCreo;

                        contexto.SaveChanges();

                    }


                }


                return 1;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public bool EliminarDocumento(ProyectoDocumentosModel archivo, string Conexion)
        {
            try
            {
                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {
                    var existe = contexto.ProyectoDocumentos.Where(w => w.IdProDoc == archivo.IdProDoc).FirstOrDefault();
                    existe.Activo = false;
                    existe.IdUElimino = archivo.IdUElimino;
                    existe.FechaElimino = DateTime.Now;
                    contexto.SaveChanges();

                }
                return true;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public List<ProyectoDocumentosModel> ObtenerDocumentos(long IdProyecto, string Conexion)
        {

            try
            {
                List<ProyectoDocumentosModel> Lst = new List<ProyectoDocumentosModel>();

                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    Lst = contexto.ProyectoDocumentos.Where(w => w.IdProyecto == IdProyecto && w.Activo == true).
                                                       Select(s => new ProyectoDocumentosModel()
                                                       {

                                                           IdProDoc = s.IdProDoc,
                                                           IdProyecto = s.IdProyecto,
                                                           TipoDocumentoId = s.TipoDocumentoId,
                                                           TipoDocumentoStr = contexto.CatalogoGeneral.Where(w => w.IdCatalogo == s.TipoDocumentoId).FirstOrDefault().DescLarga,
                                                           Name = s.Name,
                                                           Extension = s.Extension,
                                                           Ubicacion = s.Ubicacion,
                                                           FechaCreo = s.FechaCreo,
                                                           NombreCreo = s.Usuario.Nombre + " " + s.Usuario.ApPaterno

                                                       }).ToList();
                }


                return Lst;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public ProyectoDocumentosModel ObtieneDocumento(long IdProDoc, string Conexion)
        {

            try
            {
                ProyectoDocumentosModel pd = new ProyectoDocumentosModel();

                using (var cxt = new BDProductividad_DEVEntities(Conexion))
                {

                    pd = cxt.ProyectoDocumentos.Where(w => w.IdProDoc == IdProDoc).Select(s => new ProyectoDocumentosModel { Ubicacion = s.Ubicacion }).FirstOrDefault();
                }


                return pd;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        #endregion


    }
}
