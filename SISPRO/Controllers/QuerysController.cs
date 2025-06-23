using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using CapaDatos;
using CapaDatos.Models;
using System.Web.Routing;

namespace AxProductividad.Controllers
{
    public class QuerysController : Controller
    {     
        public ActionResult Index()
        {

            Session["Controlador" + Session.SessionID] = "Querys";
            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }
            if (!FuncionesGenerales.ValidaPermisos(0))
            {

                return RedirectToAction("Unauthorized", "ERROR");
            }


            return View();
        }

        [Route("q/{Id}")]
        public ActionResult q(string Id = "0")
        {

            Session["Controlador" + Session.SessionID] = "Querys";

            if (!FuncionesGenerales.SesionActiva())
            {
                Session["URL" + Session.SessionID] = HttpContext.Request.Url.ToString().ToLower();
                return RedirectToAction("Index", "Login");
            }


            Session["Accion" + Session.SessionID] = "q";
            if (!FuncionesGenerales.ValidaPermisosAccion(0))
            {

                return RedirectToAction("Unauthorized", "ERROR");
            }

            var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
            if (Id == "0")
            {
                ViewBag.IdQuery = Id;
                ViewBag.Title = "Nuevo query";
                ViewBag.Filtros = "";
                ViewBag.IdUnique = "";

            }
            else
            {

        
                CD_Actividad cd_a = new CD_Actividad();
                QueryModel q = cd_a.ConsultaQuery(Id, Encripta.DesencriptaDatos(Usuario.ConexionEF));

                if (!q.Activo)
                {
                    return RedirectToAction("Unauthorized", "ERROR");
                }
                ViewBag.IdQuery = q.IdQuery;
                ViewBag.IdUnique = q.IdUnique;
                ViewBag.Filtros = q.Filtros;
                ViewBag.Title = q.Nombre;
            }

            ViewBag.IdTU = Usuario.IdTipoUsuario;
            return View();
        }
        [Route("s/{Id}/{Id}")]
        public ActionResult s(long id, string id2)
        {

            CD_Actividad cd_a = new CD_Actividad();
            CD_Login cd_l = new CD_Login();

            string Conexion = cd_l.ObtenerConexionOrganizaion(id);
            QueryModel q = cd_a.ConsultaQuery(id2, Conexion);

                if (!q.Activo)
                {
                    return RedirectToAction("Unauthorized", "ERROR");


                }
            ViewBag.IdQuery = q.IdQuery;
            ViewBag.Title = q.Nombre;
            ViewBag.Org = id;

            return View();
        }

        public ActionResult CargaFiltros()
        {

            var resultado = new JObject();
            try
            {

                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }

                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                CD_CatalogoGeneral cd_CatGenral = new CD_CatalogoGeneral();

                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                List<CatalogoGeneralModel> LstProyectos = cd_CatGenral.ObtenerProyectosPorUsuario(Usuario, Conexion);
                List<CatalogoGeneralModel> LstFase = cd_CatGenral.ObtenerCatalogoGeneral(2, Conexion);
                List<CatalogoGeneralModel> LstClasificacion = cd_CatGenral.ObtenerCatalogoGeneral(5, Conexion);
                List<CatalogoGeneralModel> LstUsuarios = cd_CatGenral.ObtenerUsuarios(Usuario.IdUsuario, Conexion);

                List<CatalogoGeneralModel> LstPrioridad = cd_CatGenral.ObtenerCatalogoGeneral(20, Conexion);


                resultado["Exito"] = true;
                resultado["TipoUsuario"] = Usuario.IdTipoUsuario;
                resultado["Usuario"] = Usuario.IdUsuario;
                resultado["LstProyectos"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlComboxMultiple(LstProyectos);
                resultado["LstFase"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlComboxMultiple(LstFase);
                resultado["LstClasificacion"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlComboxMultiple(LstClasificacion);
                resultado["LstUsuarios"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlImagen(LstUsuarios, "http://app.yitpro.com/Archivos/Fotos/", true);
                resultado["LstPrioridad"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlComboxMultiple(LstPrioridad);


                return Content(resultado.ToString());
            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
                return Content(resultado.ToString());
            }
        }

        public ActionResult CargaFiltroSprint(List<long> LstProyectos)
        {

            var resultado = new JObject();
            try
            {
                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }

                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                CD_CatalogoGeneral cd_CatGenral = new CD_CatalogoGeneral();

                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);      
                List<CatalogoGeneralModel> LstSprints = cd_CatGenral.ObtenerSprints( LstProyectos, Conexion);

                resultado["Exito"] = true;
                resultado["LstSprints"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlComboxMultiple(LstSprints);

                return Content(resultado.ToString());
            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
                return Content(resultado.ToString());
            }
        }

        public ActionResult CargaFiltroSprintLista(List<long> LstProyectos)
        {

            var resultado = new JObject();
            try
            {
                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }

                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                CD_CatalogoGeneral cd_CatGenral = new CD_CatalogoGeneral();

                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                List<CatalogoGeneralModel> LstSprints = cd_CatGenral.ObtenerSprints(LstProyectos, Conexion);

                resultado["Exito"] = true;
                resultado["LstSprints"] = JsonConvert.SerializeObject(LstSprints); 

                return Content(resultado.ToString());
            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
                return Content(resultado.ToString());
            }
        }



        public ActionResult FiltrarQuery(FiltrosModel Filtros)
        {

            var Resultado = new JObject();
            try
            {


                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                Filtros.IdUsuario = Usuario.IdUsuario;
                Filtros.IdTipoUsuario = Usuario.IdTipoUsuario;


                CD_Actividad cd_act = new CD_Actividad();
                List<ActividadesModel> LstActividades = new List<ActividadesModel>();


                List<ActividadesModel> LstActividadesEnc = new List<ActividadesModel>();

                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);

                LstActividades = cd_act.ConsultaQueryActividades(Filtros, conexion);

                var LstEventos = FuncionesGenerales.ConvierteEventosCalendario(LstActividades);


                string ActividadesA = FuncionesGenerales.ConvierteListaTareasV2(LstActividades, "A");
                string ActividadesP = FuncionesGenerales.ConvierteListaTareasV2(LstActividades, "P");
                string ActividadesR = FuncionesGenerales.ConvierteListaTareasV2(LstActividades, "V");
                ActividadesR += FuncionesGenerales.ConvierteListaTareasV2(LstActividades, "R");
                string ActividadesX = FuncionesGenerales.ConvierteListaTareasV2(LstActividades, "X");
                string ActividadesL = FuncionesGenerales.ConvierteListaTareasV2(LstActividades, "L");



                Resultado["Exito"] = true;
                Resultado["Actividades"] = JsonConvert.SerializeObject(LstActividades);

                Resultado["Total"] = LstActividades.Count;


                Resultado["TotalAbiertas"] = LstActividades.Where(w => w.Estatus == "A").Count();
                Resultado["TotalProgreso"] = LstActividades.Where(w => w.Estatus == "P").Count();
                Resultado["TotalValidacion"] = LstActividades.Where(w => w.Estatus == "V" || w.Estatus == "R").Count();
                Resultado["TotalRechazadas"] = LstActividades.Where(w => w.Estatus == "X").Count();
                Resultado["TotalLiberadas"] = LstActividades.Where(w => w.Estatus == "L").Count();
                Resultado["ActividadesA"] = ActividadesA;
                Resultado["ActividadesP"] = ActividadesP;
                Resultado["ActividadesR"] = ActividadesR;
                Resultado["ActividadesX"] = ActividadesX;
                Resultado["ActividadesLi"] = ActividadesL;

                Resultado["Eventos"] = JsonConvert.SerializeObject(LstEventos);



                return Content(Resultado.ToString());
            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }
        }

        public ActionResult GuardarQuery(QueryModel Q, FiltrosModel Filtros)
        {

            var Resultado = new JObject();
            try
            {

                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                Q.IdUCreo = Usuario.IdUsuario;
          
                CD_Actividad cd_act = new CD_Actividad();

                string g = cd_act.GuardarQuery(Q, Filtros, Encripta.DesencriptaDatos(Usuario.ConexionEF));

                Resultado["Exito"] =  g== "N" ? false: true;
                Resultado["Mensaje"] = g == "N" ? "Sólo el propietario puede realizar una modificación" : "" ;
                Resultado["IdUnique"] = g;

                return Content(Resultado.ToString());
            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }
        }

        public ActionResult EjecutaQuery(long IdQuery)
        {

            var Resultado = new JObject();
            try
            {


                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
 

                CD_Actividad cd_act = new CD_Actividad();
                List<ActividadesModel> LstActividades = new List<ActividadesModel>();
                List<ActividadComentarioModel> LstComentarios = new List<ActividadComentarioModel>();


                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);

                LstActividades = cd_act.EjecutaQueryActividades(IdQuery,ref LstComentarios, conexion);

                LstComentarios = LstComentarios.Where(w=> w.IdUsuario  != Usuario.IdUsuario).ToList();

                string Comentarios = FuncionesGenerales.ConvierteListaComentarios2(LstComentarios);

                var LstEventos = FuncionesGenerales.ConvierteEventosCalendario(LstActividades);



                string ActividadesA = FuncionesGenerales.ConvierteListaTareasV2(LstActividades, "A");
                string ActividadesP = FuncionesGenerales.ConvierteListaTareasV2(LstActividades, "P");
                string ActividadesR = FuncionesGenerales.ConvierteListaTareasV2(LstActividades, "V");
                ActividadesR += FuncionesGenerales.ConvierteListaTareasV2(LstActividades, "R");
                string ActividadesX = FuncionesGenerales.ConvierteListaTareasV2(LstActividades, "X");
                string ActividadesL = FuncionesGenerales.ConvierteListaTareasV2(LstActividades, "L");



                Resultado["Exito"] = true;
                Resultado["Actividades"] = JsonConvert.SerializeObject(LstActividades);
                Resultado["TotalAbiertas"] = LstActividades.Where(w => w.Estatus == "A").Count();
                Resultado["TotalProgreso"] = LstActividades.Where(w => w.Estatus == "P").Count();
                Resultado["TotalValidacion"] = LstActividades.Where(w => w.Estatus == "V" || w.Estatus == "R").Count();
                Resultado["TotalRechazadas"] = LstActividades.Where(w => w.Estatus == "X").Count();
                Resultado["TotalLiberadas"] = LstActividades.Where(w => w.Estatus == "L").Count();
                Resultado["ActividadesA"] = ActividadesA;
                Resultado["ActividadesP"] = ActividadesP;
                Resultado["ActividadesR"] = ActividadesR;
                Resultado["ActividadesX"] = ActividadesX;
                Resultado["ActividadesLi"] = ActividadesL;
                Resultado["Comentarios"] = Comentarios;
                Resultado["TotalComentarios"] = LstComentarios.Count;
                Resultado["Eventos"] = JsonConvert.SerializeObject(LstEventos);



                return Content(Resultado.ToString());
            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }
        }

        public ActionResult EjecutaQueryExt(long IdQuery, long Org)
        {

            var Resultado = new JObject();
            try
            {
                CD_Login cd_l = new CD_Login();

                string Conexion = cd_l.ObtenerConexionOrganizaionSP(Org);

                CD_Actividad cd_act = new CD_Actividad();
                List<ActividadesModel> LstActividades = new List<ActividadesModel>();
                List<ActividadComentarioModel> LstComentarios = new List<ActividadComentarioModel>();

                LstActividades = cd_act.EjecutaQueryActividades(IdQuery, ref LstComentarios, Conexion);

                var LstEventos = FuncionesGenerales.ConvierteEventosCalendario(LstActividades);

                string ActividadesA = FuncionesGenerales.ConvierteListaTareasV2(LstActividades, "A");
                string ActividadesP = FuncionesGenerales.ConvierteListaTareasV2(LstActividades, "P");
                string ActividadesR = FuncionesGenerales.ConvierteListaTareasV2(LstActividades, "V");
                ActividadesR += FuncionesGenerales.ConvierteListaTareasV2(LstActividades, "R");
                string ActividadesX = FuncionesGenerales.ConvierteListaTareasV2(LstActividades, "X");
                string ActividadesL = FuncionesGenerales.ConvierteListaTareasV2(LstActividades, "L");

                Resultado["Exito"] = true;
                Resultado["Actividades"] = JsonConvert.SerializeObject(LstActividades);
                Resultado["TotalAbiertas"] = LstActividades.Where(w => w.Estatus == "A").Count();
                Resultado["TotalProgreso"] = LstActividades.Where(w => w.Estatus == "P").Count();
                Resultado["TotalValidacion"] = LstActividades.Where(w => w.Estatus == "V" || w.Estatus == "R").Count();
                Resultado["TotalRechazadas"] = LstActividades.Where(w => w.Estatus == "X").Count();
                Resultado["TotalLiberadas"] = LstActividades.Where(w => w.Estatus == "L").Count();
                Resultado["ActividadesA"] = ActividadesA;
                Resultado["ActividadesP"] = ActividadesP;
                Resultado["ActividadesR"] = ActividadesR;
                Resultado["ActividadesX"] = ActividadesX;
                Resultado["ActividadesLi"] = ActividadesL;

                Resultado["Eventos"] = JsonConvert.SerializeObject(LstEventos);



                return Content(Resultado.ToString());
            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }
        }


        public ActionResult ConsultaQuerys()
        {
            var Resultado = new JObject();
            try
            {
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                CD_Actividad cd_a = new CD_Actividad();
                List<QueryModel> LstPropios = new List<QueryModel>();
                List<QueryModel> LstCompartidos = new List<QueryModel>();

                cd_a.ConsultaQuerys(ref LstPropios, ref LstCompartidos,Usuario.IdUsuario, Encripta.DesencriptaDatos(Usuario.ConexionEF));


                Resultado["Exito"] = true;
                Resultado["LstQuerysP"] = JsonConvert.SerializeObject(LstPropios);
                Resultado["LstQuerysC"] = JsonConvert.SerializeObject(LstCompartidos);

                return Content(Resultado.ToString());

            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }


        }

        public ActionResult ConsultaQuerysUsuario(long IdUsuario)
        {
            var Resultado = new JObject();
            try
            {
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                CD_Actividad cd_a = new CD_Actividad();
                List<QueryModel> LstPropios = new List<QueryModel>();
                List<QueryModel> LstCompartidos = new List<QueryModel>();

                cd_a.ConsultaQuerys(ref LstPropios, ref LstCompartidos, IdUsuario, Encripta.DesencriptaDatos(Usuario.ConexionEF));


                LstPropios.AddRange(LstCompartidos);

                Resultado["Exito"] = true;
                Resultado["LstQuerys"] = JsonConvert.SerializeObject(LstPropios);
      

                return Content(Resultado.ToString());

            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }


        }

        public ActionResult GuardarQueryCompartir(long IdQuery, List<long> LstUsuarios)
        {

            var Resultado = new JObject();
            try
            {

                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
             

                CD_Actividad cd_act = new CD_Actividad();

                bool g = cd_act.GuardarQueryCompartir(Usuario.IdUsuario, IdQuery, LstUsuarios, Encripta.DesencriptaDatos(Usuario.ConexionEF));

                Resultado["Exito"] = true;

                return Content(Resultado.ToString());
            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }
        }

        public ActionResult ConsultaQueryCompartir(long IdQuery)
        {

            var Resultado = new JObject();
            try
            {

                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                List<long> Lst = new List<long>();


                CD_Actividad cd_act = new CD_Actividad();

                Lst = cd_act.ConsultaCompartirQuery(IdQuery, Encripta.DesencriptaDatos(Usuario.ConexionEF));

                Resultado["Exito"] = true;
                Resultado["Organizacion"] = Usuario.IdOrganizacion;
                Resultado["LstCompartir"] = JsonConvert.SerializeObject(Lst);

                return Content(Resultado.ToString());
            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }
        }

        public ActionResult EliminarQuery(long IdQuery)
        {

            var Resultado = new JObject();
            try
            {

                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;


                CD_Actividad cd_act = new CD_Actividad();

                bool g = cd_act.EliminarQuery( IdQuery, Usuario.IdUsuario, Encripta.DesencriptaDatos(Usuario.ConexionEF));

                Resultado["Exito"] = g;
                Resultado["Mensaje"] = g == false ? "Sólo el propietario puede realizar la eliminación" : "" ;
                return Content(Resultado.ToString());
            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }
        }

        public ActionResult Exportar(long IdQuery)
        {

            var Resultado = new JObject();
            try
            {

             
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                List<ActividadesModel> LstActividades = new List<ActividadesModel>();
                List<ActividadComentarioModel> LstComentarios = new List<ActividadComentarioModel>();

                CD_Actividad cd_act = new CD_Actividad();

                LstActividades = cd_act.EjecutaQueryActividades(IdQuery, ref LstComentarios, Encripta.DesencriptaDatos(Usuario.ConexionSP));


                var act = ObtenerObjetoDescargaActividades(LstActividades);
                var tabla = FuncionesGenerales.CrearTabla(act, "Actividades");
                var excel = Reportes.CrearExcel(tabla);

                return File(excel, MimeType.XLSX, "Actividades.xlsx");


            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }
        }


        private object ObtenerObjetoDescargaActividades(List<ActividadesModel> Act)
        {
            return
                Act.Select(x => new
                {
                    Tipo = x.TipoNombre,
                    No = x.IdActividadStr,
                    Título = x.BR,
                    Estatus = x.EstatusStr,
                    Prioridad  = x.PrioridadStr,
                    Asignado = x.AsignadoStr,
                    Responsable = x.ResponsableStr,
                    Sprint = x.Sprint,
                    FechaAlta = x.FechaCreo.ToShortDateString(),
                    FechaObjetivo =  x.FechaSolicitado == null ? "" : DateTime.Parse(x.FechaSolicitado.ToString()).ToShortDateString()

                }).OrderByDescending(x => x.FechaObjetivo).ToList();
        }



    }
}