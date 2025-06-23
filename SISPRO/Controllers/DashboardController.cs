using System;
using System.Collections.Generic;
using System.Web.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using CapaDatos.Models;
using CapaDatos;
using System.Configuration;
using System.IO;
using AxProductividad.Models;
using System.Data;
using System.Linq;

namespace AxProductividad.Controllers
{
    public class DashboardController : Controller
    {
        // GET: Dashboard
        public ActionResult Index()
        {

            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }
            Session["Controlador" + Session.SessionID] = "Home";


            if (!FuncionesGenerales.ValidaPermisos(0))
            {
                return RedirectToAction("Unauthorized", "ERROR");

            }


            var url = Server.MapPath("~/Archivos/Banner");

            DirectoryInfo Dir = new DirectoryInfo(url);
            List<string> LstArchivos = new List<string>();

            foreach (var file in Dir.GetFiles("*", SearchOption.AllDirectories))
            {

                LstArchivos.Add(file.Name);

            }

            CD_Dashboard cddash = new CD_Dashboard();
            CD_Configuracion cdconf = new CD_Configuracion();
            CD_Home cdhome = new CD_Home();

            List<UsuarioModel> LstCumplimiento = new List<UsuarioModel>();


            List<UsuarioModel> LstMesActual = new List<UsuarioModel>();
            List<UsuarioModel> LstMesAnt = new List<UsuarioModel>();
            List<UsuarioModel> LstHist = new List<UsuarioModel>();
            List<ProyectosModel> LstProyectos = new List<ProyectosModel>();

            string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
            //string conexion = ConfigurationManager.ConnectionStrings["BDProductividad"].ToString();
            string Con = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

            LstCumplimiento = cddash.ObtieneCumplimientoCaptura(conexion);
            cddash.ObtieneRockStarTeam(ref LstMesActual, ref LstMesAnt, ref LstHist, null, null, conexion);
            LstProyectos = cddash.ObtieneEstatusProyectos(conexion);


            ViewBag.Cumplimiento = LstCumplimiento;
            ViewBag.MesActual = LstMesActual;
            ViewBag.MesAnt = LstMesAnt;
            ViewBag.Hist = LstHist;
            ViewBag.Frase = cdconf.ObtenerConfiguracionID(16, Con);
            ViewBag.FraseA = cdconf.ObtenerConfiguracionID(17, Con);
            ViewBag.Archivos = LstArchivos;
            ViewBag.Proyectos = LstProyectos;



            return View();
        }

        public ActionResult ControlAsistencia()
        {

            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }
            Session["Controlador" + Session.SessionID] = "Home";

            Session["Accion" + Session.SessionID] = "ControlAsistencia";
            if (!FuncionesGenerales.ValidaPermisosAccion(0))
            {
                return RedirectToAction("Unauthorized", "ERROR");

            }


            //if (!FuncionesGenerales.ValidaPermisos(0))
            //{
            //    return RedirectToAction("Index", "Home");

            //}


            //var url = Server.MapPath("~/Archivos/Banner");

            //DirectoryInfo Dir = new DirectoryInfo(url);
            //List<string> LstArchivos = new List<string>();

            //foreach (var file in Dir.GetFiles("*", SearchOption.AllDirectories))
            //{

            //    LstArchivos.Add(file.Name);

            //}

            //CD_Dashboard cddash = new CD_Dashboard();
            //CD_Configuracion cdconf = new CD_Configuracion();
            //CD_Home cdhome = new CD_Home();

            //List<UsuarioModel> LstCumplimiento = new List<UsuarioModel>();


            //List<UsuarioModel> LstMesActual = new List<UsuarioModel>();
            //List<UsuarioModel> LstMesAnt = new List<UsuarioModel>();
            //List<UsuarioModel> LstHist = new List<UsuarioModel>();
            //List<ProyectosModel> LstProyectos = new List<ProyectosModel>();

            //string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
            ////string conexion = ConfigurationManager.ConnectionStrings["BDProductividad"].ToString();
            //string Con = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

            //LstCumplimiento = cddash.ObtieneCumplimientoCaptura(conexion);
            //cddash.ObtieneRockStarTeam(ref LstMesActual, ref LstMesAnt, ref LstHist, null, null, conexion);
            //LstProyectos = cddash.ObtieneEstatusProyectos(conexion);


            //ViewBag.Cumplimiento = LstCumplimiento;
            //ViewBag.MesActual = LstMesActual;
            //ViewBag.MesAnt = LstMesAnt;
            //ViewBag.Hist = LstHist;
            //ViewBag.Frase = cdconf.ObtenerConfiguracionID(16, Con);
            //ViewBag.FraseA = cdconf.ObtenerConfiguracionID(17, Con);
            //ViewBag.Archivos = LstArchivos;
            //ViewBag.Proyectos = LstProyectos;






            return View();
        }



        public ActionResult CargaInicial() {
            var resultado = new JObject();
            try
            {
                CD_Graficas cdgraf = new CD_Graficas();
                CD_Home cdhome = new CD_Home();

                List<GraficaConsultaModel> LstGraficas = new List<GraficaConsultaModel>();
                List<GraficaConsultaModel> LstGraficasA = new List<GraficaConsultaModel>();

                FiltrosModel Filtro = new FiltrosModel();
                FiltrosModel FiltroA = new FiltrosModel();

                //string conexion = ConfigurationManager.ConnectionStrings["BDProductividad"].ToString();
                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
                IndicadoresModel indicadores = new IndicadoresModel();

                IndicadoresModel indicadoresMesA = new IndicadoresModel();


                Filtro.Anio = DateTime.Now.Year;
                Filtro.Mes = DateTime.Now.Month;
                Filtro.IdUsuarioConsulta = 70;
                Filtro.IdUsuarioReporte = (long?)null;
                Filtro.DepartamentoId = 9;

                var fechaant = DateTime.Now.AddMonths(-1);
                FiltroA.Anio = fechaant.Year;
                FiltroA.Mes = fechaant.Month;
                FiltroA.IdUsuarioConsulta = 70;
                FiltroA.IdUsuarioReporte = (long?)null;
                FiltroA.DepartamentoId = 9;


                indicadores = cdhome.ConsultaIndicadoresV2(Filtro, conexion);
                indicadoresMesA = cdhome.ConsultaIndicadoresV2(FiltroA, conexion);

                var graficavghoras = cdgraf.ConsultarGraficasInicio(Filtro, "spObtieneValorGanadoDiarioV2", conexion);
                var graficavgpor = cdgraf.ConsultarGraficasInicio(Filtro, "spObtienePromedioDiarioV2", conexion);


                var graficavghorasA = cdgraf.ConsultarGraficasInicio(FiltroA, "spObtieneValorGanadoDiarioV2", conexion);
                var graficavgporA = cdgraf.ConsultarGraficasInicio(FiltroA, "spObtienePromedioDiarioV2", conexion);


                LstGraficas.Add(graficavghoras);
                LstGraficas.Add(graficavgpor);

                LstGraficasA.Add(graficavghorasA);
                LstGraficasA.Add(graficavgporA);


                resultado["Exito"] = true;
                resultado["Indicadores"] = JsonConvert.SerializeObject(indicadores);
                resultado["IndicadoresA"] = JsonConvert.SerializeObject(indicadoresMesA);
                resultado["LstGraficas"] = JsonConvert.SerializeObject(LstGraficas);
                resultado["LstGraficasA"] = JsonConvert.SerializeObject(LstGraficasA);


            }
            catch (Exception ex)
            {

                resultado["Exito"] = true;
                resultado["Mensaje"] = ex.Message;
            }

            return Content(resultado.ToString());
        }

        public ActionResult ConsultaControlAsistencia()
        {
            var resultado = new JObject();
            try
            {

                ControlAsistenciaModel filtros = new ControlAsistenciaModel();
                filtros.Fecha = DateTime.Now;
                CD_Dashboard cd_d = new CD_Dashboard();
                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);

                ControlAsistenciaModel ca = cd_d.ObtieneDashboardAsistencia(filtros, conexion);

                resultado["Exito"] = true;
                resultado["Indicadores"] = JsonConvert.SerializeObject(ca);


            }
            catch (Exception ex)
            {

                resultado["Exito"] = true;
                resultado["Mensaje"] = ex.Message;
            }
            return Content(resultado.ToString());
        }



        #region KPIS
        public ActionResult KPIS()
        {
            if (!FuncionesGenerales.SesionActiva())
            {
                Session["URL" + Session.SessionID] = HttpContext.Request.Url.ToString().ToLower();
                return RedirectToAction("Index", "Login");
            }

            Session["Accion" + Session.SessionID] = "KPIS";
            if (!FuncionesGenerales.ValidaPermisosAccion(0))
            {
                return RedirectToAction("Unauthorized", "ERROR");

            }


            return View();
        }
        public ActionResult InicializarKPIS()
        {
            var resultado = new JObject();
            try
            {

                CD_Configuracion cd_conf = new CD_Configuracion();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                CD_CatalogoGeneral cd_CatGenral = new CD_CatalogoGeneral();

                List<CatalogoGeneralModel> LstAnios = cd_CatGenral.ObtenerAnios(Encripta.DesencriptaDatos(Usuario.ConexionEF));

                resultado["Exito"] = true;
                resultado["LstAnios"] = FuncionesGenerales.ConvierteAniosHtmlCombox(LstAnios);
                resultado["Anio"] = DateTime.Now.Year;
                resultado["Mes"] = DateTime.Now.Month;
                return Content(resultado.ToString());
                
            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
                return Content(resultado.ToString());
            }
        }
        public ActionResult ConsultaIndicadoresEficiencia(int IdAnio, int IdMes)
        {
            var Resultado = new JObject();
            try
            {

                CD_Dashboard cd_d = new CD_Dashboard();
                GraficaConsultaModel G = new GraficaConsultaModel();
                List<GraficaConsultaModel> LstGraf = new List<GraficaConsultaModel>();
                IndicadoresModel I = new IndicadoresModel();
                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);

                cd_d.ConsultaIndicadoresEficiencia(IdMes, IdAnio, ref I, ref G, conexion);


                LstGraf.Add(G);

                Resultado["Exito"] = true;
                Resultado["Indicadores"] = JsonConvert.SerializeObject(I);
                Resultado["Grafica"] = JsonConvert.SerializeObject(LstGraf);
                return Content(Resultado.ToString());


            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }

        }
        public ActionResult ConsultaIndicadoresFinancieros(int IdAnio, int IdMes)
        {
            var Resultado = new JObject();
            try
            {

                CD_Dashboard cd_d = new CD_Dashboard();
                GraficaConsultaModel G = new GraficaConsultaModel();
                List<GraficaConsultaModel> LstGraf = new List<GraficaConsultaModel>();
                IndicadoresFinancierosModel I = new IndicadoresFinancierosModel();
                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);

                cd_d.ConsultaIndicadoresFinancieros(IdMes, IdAnio, ref I, ref G, conexion);


                LstGraf.Add(G);

                Resultado["Exito"] = true;
                Resultado["Indicadores"] = JsonConvert.SerializeObject(I);
                Resultado["Grafica"] = JsonConvert.SerializeObject(LstGraf);
                return Content(Resultado.ToString());


            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }

        }
        #endregion


        #region QA
        public ActionResult QA()
        {
            if (!FuncionesGenerales.SesionActiva())
            {
                Session["URL" + Session.SessionID] = HttpContext.Request.Url.ToString().ToLower();
                return RedirectToAction("Index", "Login");
            }

            Session["Accion" + Session.SessionID] = "Performance";
            if (!FuncionesGenerales.ValidaPermisosAccion(0))
            {
                try
                {
                    var home = ((string)Session["Home" + Session.SessionID]);

                    return Redirect(home);
                }
                catch (Exception)
                {

                    return RedirectToAction("Index", "Login");
                }

            }

            return View();
        }
        public ActionResult InicializarQA()
        {
            var resultado = new JObject();
            try
            {

                CD_Configuracion cd_conf = new CD_Configuracion();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                CD_CatalogoGeneral cd_CatGenral = new CD_CatalogoGeneral();

                List<CatalogoGeneralModel> LstAnios = cd_CatGenral.ObtenerAnios(Encripta.DesencriptaDatos(Usuario.ConexionEF));
                List<CatalogoGeneralModel> LstProyectos = cd_CatGenral.ObtenerProyectosPorUsuario(Usuario, Encripta.DesencriptaDatos(Usuario.ConexionEF));


                resultado["Exito"] = true;
                resultado["LstAnios"] = FuncionesGenerales.ConvierteAniosHtmlCombox(LstAnios);
                resultado["Anio"] = DateTime.Now.Year;
                resultado["Mes"] = DateTime.Now.Month;
                resultado["LstProyectos"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(LstProyectos);
                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
                return Content(resultado.ToString());
            }
        }

        public ActionResult ConsultaIndicadoresCalidad(int IdAnio, int IdMes, int IdProyecto)
        {
            var Resultado = new JObject();
            try
            {

                CD_Dashboard cd_d = new CD_Dashboard();
                GraficaConsultaModel G = new GraficaConsultaModel();
                List<GraficaConsultaModel> LstGraf = new List<GraficaConsultaModel>();
                IndicadoresModel I = new IndicadoresModel();
                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);

                cd_d.ConsultaIndicadoresCalidad(IdMes, IdAnio,IdProyecto, ref I, ref G, conexion);


                LstGraf.Add(G);

                Resultado["Exito"] = true;
                Resultado["Indicadores"] = JsonConvert.SerializeObject(I);
                Resultado["Grafica"] = JsonConvert.SerializeObject(LstGraf);
                return Content(Resultado.ToString());


            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }

        }

        public ActionResult ConsultaSprintsCalidad(int IdProyecto)
        {
            var Resultado = new JObject();
            try
            {
                CD_Dashboard cd_d = new CD_Dashboard();
                List<CicloPruebaModel> LstCP = new List<CicloPruebaModel>();

                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);

                LstCP = cd_d.ConsultaCiclosPrueba(IdProyecto, Usuario.IdUsuario, Usuario.IdTipoUsuario, conexion);

                Resultado["Exito"] = true;
                Resultado["Ciclos"] = JsonConvert.SerializeObject(LstCP);
                return Content(Resultado.ToString());


            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }

        }

        public ActionResult ConsultaGraficaEstatusCP(int IdProyecto)
        {
            var Resultado = new JObject();
            try
            {

                CD_Dashboard cd_d = new CD_Dashboard();
                GraficaConsultaModel G = new GraficaConsultaModel();
                List<GraficaConsultaModel> LstGraf = new List<GraficaConsultaModel>();
                IndicadoresModel I = new IndicadoresModel();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);

               G = cd_d.GraficaEstatusCP( IdProyecto, Usuario.IdUsuario, Usuario.IdTipoUsuario, conexion);


                LstGraf.Add(G);

                Resultado["Exito"] = true;
                Resultado["Grafica"] = JsonConvert.SerializeObject(LstGraf);
                return Content(Resultado.ToString());


            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }

        }
        public ActionResult ConsultaGraficasQA(long IdProyecto)
        {
            var resultado = new JObject();
            try
            {
                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }
                List<GraficaConsultaModel> LstGraficas = new List<GraficaConsultaModel>();
                CD_Dashboard cd_d = new CD_Dashboard();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                LstGraficas = cd_d.ConsultarGraficasPastelQA(IdProyecto, Usuario.IdUsuario, Usuario.IdTipoUsuario, Encripta.DesencriptaDatos(Usuario.ConexionSP));

                resultado["Exito"] = true;
                resultado["LstGraficas"] = JsonConvert.SerializeObject(LstGraficas);
                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

                return Content(resultado.ToString());
            }
        }

        #endregion

        #region Usuario
        public ActionResult p(string Id)
        {


            if (!FuncionesGenerales.SesionActiva())
            {
                Session["URL" + Session.SessionID] = HttpContext.Request.Url.ToString().ToLower();
                return RedirectToAction("Index", "Login");
            }


            if (Id == null)
            {

                return RedirectToAction("Unauthorized", "ERROR");
            }

            var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

            if (Usuario.IdTipoUsuario == 19)
            {

                var home = ((string)Session["Home" + Session.SessionID]);

                return Redirect(home);

            }


       
   
            if (Usuario.IdTipoUsuario == 14 && Usuario.NumEmpleado != Id)
            {

                return RedirectToAction("Unauthorized", "ERROR");

            }


         


            CD_Usuario cd_u = new CD_Usuario(); 
            CD_Dashboard cd_d = new CD_Dashboard();

            var User = cd_u.ConsultarUsuarioClave(Id, Encripta.DesencriptaDatos(Usuario.ConexionEF));

            if (User == null)
            {

                return RedirectToAction("Unauthorized", "ERROR");
            }


            

            IndicadoresModel i = cd_d.ConsultaIndicadoresRecurso(Id, DateTime.Now.Year, DateTime.Now.Month, Encripta.DesencriptaDatos(Usuario.ConexionSP));

            int AnioAnterior = DateTime.Now.Month == 1 ? DateTime.Now.Year - 1 : DateTime.Now.Year;
            int MesAnterior = DateTime.Now.Month == 1 ? 12 : DateTime.Now.Month - 1;
            IndicadoresModel i2 = cd_d.ConsultaIndicadoresRecurso(Id, AnioAnterior, MesAnterior, Encripta.DesencriptaDatos(Usuario.ConexionSP));


            if (i == null) {

                return RedirectToAction("Unauthorized", "ERROR");
            }


            ViewBag.Clave = Id;
            ViewBag.Consulta = Usuario.NumEmpleado.ToUpper() != Id.ToUpper() ? true : false;
            ViewBag.MesAnterior = i2;
            return View(i);
        }

        public ActionResult ConsultaNotificaciones(long IdUsuario)
        {
            var resultado = new JObject();
            try
            {
                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }
                List<ActividadComentarioModel> LstComentarios = new List<ActividadComentarioModel>();
                CD_Dashboard cd_d = new CD_Dashboard();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                LstComentarios = cd_d.Notificaciones(IdUsuario, Encripta.DesencriptaDatos(Usuario.ConexionSP));

                string Comentarios = FuncionesGenerales.ConvierteListaComentarios2(LstComentarios);

                resultado["Exito"] = true;
                resultado["Comentarios"] = Comentarios;
                resultado["TotalComentarios"] = LstComentarios.Count;
            
                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

                return Content(resultado.ToString());
            }
        }

        public ActionResult ConsultaActividades(long IdUsuario)
        {
            var resultado = new JObject();
            try
            {
                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }
                List<ActividadComentarioModel> LstComentarios = new List<ActividadComentarioModel>();
                CD_Dashboard cd_d = new CD_Dashboard();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                List<ActividadesModel> LstActividades = new List<ActividadesModel>();
        
                List<GraficaConsultaModel> LstGraficas = new List<GraficaConsultaModel>();

                List<ActividadesModel> LstActividadesT = new List<ActividadesModel>();


                cd_d.ActividadesDashboard(IdUsuario,ref LstActividades, ref LstGraficas,   Encripta.DesencriptaDatos(Usuario.ConexionSP));

                LstActividadesT = cd_d.ActividadesDashboardLista(IdUsuario, Encripta.DesencriptaDatos(Usuario.ConexionSP));


                var LstEventos = FuncionesGenerales.ConvierteEventosCalendario(LstActividades);

                resultado["Exito"] = true;
                resultado["Eventos"] = JsonConvert.SerializeObject(LstEventos);
                resultado["LstGraficas"] = JsonConvert.SerializeObject(LstGraficas);
                resultado["LstBugs"] = JsonConvert.SerializeObject(LstActividadesT.Where(w=> w.Tipo== 1).ToList());
                resultado["LstAtrasadas"] = JsonConvert.SerializeObject(LstActividadesT.Where(w => w.Tipo == 2).ToList());
                resultado["LstHoy"] = JsonConvert.SerializeObject(LstActividadesT.Where(w => w.Tipo == 3).ToList());
                resultado["LstSemana"] = JsonConvert.SerializeObject(LstActividadesT.Where(w => w.Tipo == 4).ToList());
                resultado["BugsT"] = JsonConvert.SerializeObject(LstActividadesT.Where(w => w.Tipo == 1).Count());
                resultado["AtrasadasT"] = JsonConvert.SerializeObject(LstActividadesT.Where(w => w.Tipo == 2).Count());
                resultado["HoyT"] = JsonConvert.SerializeObject(LstActividadesT.Where(w => w.Tipo == 3).Count());
                resultado["SemanaT"] = JsonConvert.SerializeObject(LstActividadesT.Where(w => w.Tipo == 4).Count());




                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

                return Content(resultado.ToString());
            }
        }

        public ActionResult ConsultaRendimientoHistorico(long IdUsuario)
        {
            var resultado = new JObject();
            try
            {
                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }
      
                CD_Dashboard cd_d = new CD_Dashboard();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;


                List<string> LstAnios = new List<string>();
                LstAnios.Add((DateTime.Now.Year - 1).ToString());
                LstAnios.Add((DateTime.Now.Year).ToString());

                List<string> LstRecursos = new List<string>();
                LstRecursos.Add(IdUsuario.ToString());


                List<string> LstRep = new List<string>();
                LstRep.Add("1");
                LstRep.Add("2");

                List<string> LstMeses = new List<string>();


                FiltrosModel filtroGraficas = new FiltrosModel();

                filtroGraficas.LstAnios = LstAnios;
                filtroGraficas.LstRecursos = LstRecursos;
                filtroGraficas.LstGraficas = LstRep;
                filtroGraficas.LstMeses = LstMeses;


                var cd_Graf = new CD_Graficas();

                List<GraficaConsultaModel> LstGraficas = new List<GraficaConsultaModel>();
                var resultadoConsultar = cd_Graf.ConsultarGraficas(filtroGraficas, Encripta.DesencriptaDatos(Usuario.ConexionSP), ref LstGraficas);


                resultado["Exito"] = true;
                resultado["Graficas"] = JsonConvert.SerializeObject(LstGraficas);


                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

                return Content(resultado.ToString());
            }
        }

        public ActionResult ConsultaHeatMap(long IdUsuario)
        {
            var resultado = new JObject();
            try
            {
                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }
  
                CD_Dashboard cd_d = new CD_Dashboard();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;


                List<CalendarHeatMapModel> LstCapturas = new List<CalendarHeatMapModel>();
                List<CalendarHeatMapModel> LstValor = new List<CalendarHeatMapModel>();
                List<CalendarHeatMapModel> LstTrabajado = new List<CalendarHeatMapModel>();

                LstCapturas = cd_d.ConsultaHeatMap(IdUsuario, 2, Encripta.DesencriptaDatos(Usuario.ConexionSP));
                LstValor = cd_d.ConsultaHeatMap(IdUsuario, 3, Encripta.DesencriptaDatos(Usuario.ConexionSP));
                LstTrabajado = cd_d.ConsultaHeatMap(IdUsuario, 4, Encripta.DesencriptaDatos(Usuario.ConexionSP));

                resultado["Exito"] = true;
                resultado["Capturas"] = JsonConvert.SerializeObject(LstCapturas);
                resultado["ValorGanado"] = JsonConvert.SerializeObject(LstValor);
                resultado["Trabajado"] = JsonConvert.SerializeObject(LstTrabajado);

                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

                return Content(resultado.ToString());
            }
        }

        public ActionResult ConsultaHistoricoBonos(long IdUsuario)
        {
            var resultado = new JObject();
            try
            {
                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }

                CD_Dashboard cd_d = new CD_Dashboard();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;


                List<CompensacionModel> Lst = new List<CompensacionModel>();

                Lst = cd_d.ConsultaHistoricoBonos(IdUsuario, Encripta.DesencriptaDatos(Usuario.ConexionEF));


                resultado["Exito"] = true;
                resultado["Bonos"] = JsonConvert.SerializeObject(Lst);


                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

                return Content(resultado.ToString());
            }
        }

        #endregion

        #region Performance
        public ActionResult Performance()
        {
            ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];

            //Session["Controlador" + Session.SessionID] = "Home";

            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }

            var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

            if (Usuario.IdTipoUsuario == 14)
            {

                return RedirectToAction("p", "Dashboard", new { Id = Usuario.NumEmpleado });
            }


            Session["Accion" + Session.SessionID] = "Performance";
            if (!FuncionesGenerales.ValidaPermisosAccion(0))
            {
                try
                {
                    var home = ((string)Session["Home" + Session.SessionID]);

                    return Redirect(home);
                }
                catch (Exception)
                {

                    return RedirectToAction("Index", "Login");
                }

            }

            //if (!FuncionesGenerales.ValidaPermisos(0))
            //{
            //    try
            //    {
            //        var home = ((string)Session["Home" + Session.SessionID]);

            //        return Redirect(home);
            //    }
            //    catch (Exception)
            //    {

            //        return RedirectToAction("Index", "Login");
            //    }


            //}

            return View();
        }

        public ActionResult ObtieneIndicadoresPerformance(FiltrosModel Filtro)
        {
            var resultado = new JObject();
            try
            {
                IndicadoresModel indicadores = new IndicadoresModel();
                CD_Home cdhome = new CD_Home();
                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);

                var Usuario = ((Sesion)Session["Usuario" + Session.SessionID]).Usuario;

                CD_Actividad cd_act = new CD_Actividad();
                CD_Reportes cd_rep = new CD_Reportes();


                List<long> LstTiposU = new List<long>();
                LstTiposU.Add(14);
                LstTiposU.Add(15);
                LstTiposU.Add(17);
                Filtro.IdUsuarioConsulta = Usuario.IdUsuario;
                Filtro.IdUsuarioReporte = Filtro.IdUsuarioReporte == -1 ? (Usuario.IdTipoUsuario == 14 ? Usuario.IdUsuario : (long?)null) : Filtro.IdUsuarioReporte;
                Filtro.DepartamentoId = LstTiposU.Contains(Usuario.IdTipoUsuario) ? Usuario.DepartamentoId : (long?)null;


                indicadores = cdhome.ConsultaIndicadoresV2(Filtro, conexion);


                Filtro.Tipo = 2;

                DataTable dtCapturaTiempo = cdhome.ConsultaTiemposTrabajoDT(Filtro, conexion);

                Filtro.Tipo = 1;

                DataTable dtAccesos = cdhome.ConsultaTiemposTrabajoDT(Filtro, conexion);

                Filtro.Tipo = 3;

                DataTable dtValorGanado = cdhome.ConsultaTiemposTrabajoDT(Filtro, conexion);



                Filtro.Tipo = 4;

                DataTable dtTrabajado = cdhome.ConsultaTiemposTrabajoDT(Filtro, conexion);


                var url = ConfigurationManager.AppSettings["UrlSistema"];


                resultado["Exito"] = true;
                resultado["Indicadores"] = JsonConvert.SerializeObject(indicadores);
                resultado["Hoy"] = DateTime.Now.Day > 15 ? 14 : 0;
                resultado["dtCapturaTiempo"] = JsonConvert.SerializeObject(dtCapturaTiempo);
                resultado["dtValorGanado"] = JsonConvert.SerializeObject(dtValorGanado);
                resultado["dtAccesos"] = JsonConvert.SerializeObject(dtAccesos);
                resultado["dtTrabajado"] = JsonConvert.SerializeObject(dtTrabajado);

                return Content(resultado.ToString());
            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = "No se encontro información en el período seleccionado.";
                return Content(resultado.ToString());
            }
        }

        public ActionResult ConsultaHistoricoPerformance(int IdAnio, int IdMes)
        {
            var Resultado = new JObject();
            try
            {

                CD_Dashboard cd_d = new CD_Dashboard();
                GraficaConsultaModel G = new GraficaConsultaModel();
                List<GraficaConsultaModel> LstGraf = new List<GraficaConsultaModel>();
                IndicadoresModel I = new IndicadoresModel();
                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);

                G= cd_d.ConsultaHistoricoPerformance(IdMes, IdAnio,conexion);


                LstGraf.Add(G);

                Resultado["Exito"] = true;
                Resultado["Grafica"] = JsonConvert.SerializeObject(LstGraf);

                return Content(Resultado.ToString());


            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }

        }


        #endregion

        #region Sprints
        public ActionResult ConsultaGraficaVelocidad(int IdProyecto)
        {
            var Resultado = new JObject();
            try
            {

                CD_Dashboard cd_d = new CD_Dashboard();
                GraficaConsultaModel G = new GraficaConsultaModel();
                List<GraficaConsultaModel> LstGraf = new List<GraficaConsultaModel>();
                IndicadoresModel I = new IndicadoresModel();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);

                G = cd_d.GraficaVelocidad(IdProyecto ,conexion);


                LstGraf.Add(G);

                Resultado["Exito"] = true;
                Resultado["Grafica"] = JsonConvert.SerializeObject(LstGraf);
                return Content(Resultado.ToString());


            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }

        }

        public ActionResult ConsultaGraficaSprintHoras(int IdProyecto)
        {
            var Resultado = new JObject();
            try
            {

                CD_Dashboard cd_d = new CD_Dashboard();
                GraficaConsultaModel G = new GraficaConsultaModel();
                List<GraficaConsultaModel> LstGraf = new List<GraficaConsultaModel>();
                IndicadoresModel I = new IndicadoresModel();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);

                G = cd_d.GraficaHorasSprint(IdProyecto, conexion);


                LstGraf.Add(G);

                Resultado["Exito"] = true;
                Resultado["Grafica"] = JsonConvert.SerializeObject(LstGraf);
                return Content(Resultado.ToString());


            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }

        }

        #endregion
    }
}