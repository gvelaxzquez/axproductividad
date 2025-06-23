using System;
using System.Web.Mvc;
using System.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using AxProductividad.Models;
using CapaDatos;
using CapaDatos.Models;
using System.Collections.Generic;
using System.Linq;
using System.Data;


namespace AxProductividad.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home
        public ActionResult Index()
        {
            ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];

            Session["Controlador" + Session.SessionID] = "Home";

            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }

            var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

            if (Usuario.IdTipoUsuario == 14) {

                return RedirectToAction("p", "Dashboard", new { Id = Usuario.NumEmpleado});
            }

            if (!FuncionesGenerales.ValidaPermisos(0))
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


       
           

            CD_Reportes cd_rep = new CD_Reportes();
            string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
            //string conexion = ConfigurationManager.ConnectionStrings["BDProductividad"].ToString();
            List<UsuarioModel> LstCumplimiento = new List<UsuarioModel>();

            LstCumplimiento = cd_rep.ObtieneCumplimientoCapturaLider(conexion, Usuario);

            ViewBag.TipoUsuario = Usuario.IdTipoUsuario;
            ViewBag.Cumplimiento = LstCumplimiento;
          

            return View();
        }

        public ActionResult Keepalive()
        {
            return Json("OK", JsonRequestBehavior.AllowGet);
        }

        //public ActionResult Indicadores()
        //{
        //    ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];

        //    if (!FuncionesGenerales.SesionActiva())
        //    {
        //        return RedirectToAction("Index", "Login");
        //    }


        //    return View();
        //}


        public ActionResult Inicializar()
        {
            var resultado = new JObject();
            try
            {

                CD_Configuracion cd_conf = new CD_Configuracion();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                var FechaContra = ((Models.Sesion)Session["Usuario" + Session.SessionID]).Usuario.FechaContrasena;
                var Vigencia = cd_conf.ObtenerConfiguracionID(8, Conexion);
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                CD_CatalogoGeneral cd_CatGenral = new CD_CatalogoGeneral();


                //bool ContraVencida = FechaContra.AddDays(int.Parse(Vigencia)) < DateTime.Now ? true : false;
                List<CatalogoGeneralModel> LstAnios = cd_CatGenral.ObtenerAnios(Encripta.DesencriptaDatos(Usuario.ConexionEF));
                List<CatalogoGeneralModel> LstUsuarios = cd_CatGenral.ObtenerUsuarios(Usuario.IdUsuario, Conexion);


                resultado["Exito"] = true;
                //resultado["ContrasenaVencida"] = ContraVencida;
                resultado["LstUsuarios"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox2(LstUsuarios);
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

        //public ActionResult ObtieneIndicadores()
        //{
        //    var resultado = new JObject();
        //    try
        //    {
        //        IndicadoresModel indicadores = new IndicadoresModel();
        //        CD_Home cdhome = new CD_Home();
        //        CD_Configuracion cdconf = new CD_Configuracion();
        //        string conexion = ConfigurationManager.ConnectionStrings["BDProductividad"].ToString();
        //        var Usuario = ((Sesion)Session["Usuario" + Session.SessionID]).Usuario;
        //        CD_Graficas cdgraf = new CD_Graficas();

        //        List<GraficaConsultaModel> LstGraficas = new List<GraficaConsultaModel>();


        //        indicadores = cdhome.ConsultaIndicadores(conexion,Usuario.IdUsuario);
        //        var grafica = cdgraf.ConsultarGraficasTipo2(null, null, Usuario.IdTipoUsuario == 14 ? Usuario.IdUsuario : (long?)null, "spObtienePromedioDiario", conexion);

        //        LstGraficas.Add(grafica);


        //        resultado["Exito"] = true;
        //        resultado["Objetivo"] = indicadores.Objetivo;
        //        resultado["Asignadas"] = indicadores.Asignadas;
        //        resultado["Liberadas"] = indicadores.Liberadas;
        //        resultado["Validacion"] = indicadores.Validacion;
        //        resultado["Rechazadas"] = indicadores.Rechazadas;
        //        resultado["Productividad"] = indicadores.Productividad;
        //        resultado["LblObjetivoTitulo"] = Usuario.IdTipoUsuario == 14 ? "Objetivo" : "Base instalada";
        //        resultado["LstGraficas"] = JsonConvert.SerializeObject(LstGraficas);
        //        resultado["Frase"] = cdconf.ObtenerConfiguracionID(16);
        //        resultado["FraseA"] = cdconf.ObtenerConfiguracionID(17);
        //        resultado["LstActividadesAtras"] = JsonConvert.SerializeObject(LstActividades.Where(w => w.Tipo == 2).ToList());
        //        resultado["LstActividadesSem"] = JsonConvert.SerializeObject(LstActividades.Where(w => w.Tipo == 1).ToList());


        //        return Content(resultado.ToString());


        //    }
        //    catch (Exception ex)
        //    {

        //        resultado["Exito"] = false;
        //        resultado["Mensaje"] = ex.Message;
        //        return Content(resultado.ToString());
        //    }
        //}
        public ActionResult ObtieneIndicadoresV2(FiltrosModel Filtro)
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
                //List<ActividadesModel> LstActividades = new List<ActividadesModel>();
                //List<ActividadesModel> LstBugs = new List<ActividadesModel>();
                //List<ActividadComentarioModel> LstComentarios = new List<ActividadComentarioModel>();

                //int r = cd_act.ConsultaActividadesInicio(ref LstActividades, ref LstBugs, ref LstComentarios, Usuario, Filtro.IdUsuarioReporte, conexion);


                Filtro.Tipo = 2;

                DataTable dtCapturaTiempo = cdhome.ConsultaTiemposTrabajoDT(Filtro, conexion);

                Filtro.Tipo = 1;

                DataTable dtAccesos = cdhome.ConsultaTiemposTrabajoDT(Filtro, conexion);

                Filtro.Tipo = 3;

                DataTable dtValorGanado = cdhome.ConsultaTiemposTrabajoDT(Filtro, conexion);

                var Prod = cd_rep.ConsultaProuctividadEqupo(Usuario.IdUsuario, Usuario.IdTipoUsuario, Filtro.IdUsuarioReporte, conexion);

                var url = ConfigurationManager.AppSettings["UrlSistema"];

                //string Bugs = FuncionesGenerales.ConvierteListaTareas2(LstBugs, url);

                //var LstEventos = FuncionesGenerales.ConvierteEventosCalendario(LstActividades);

                //string Comentarios = FuncionesGenerales.ConvierteListaComentarios2(LstComentarios);


                resultado["Exito"] = true;
                resultado["Indicadores"] = JsonConvert.SerializeObject(indicadores);
                //resultado["Eventos"] = JsonConvert.SerializeObject(LstEventos);
                //resultado["Bugs"] = Bugs;
                //resultado["Comentarios"] = Comentarios;
                //resultado["NumTareasA"] = LstActividades.Where(w => w.Tipo == 0).Count();
                //resultado["NumTareasH"] = LstActividades.Where(w => w.Tipo == 1).Count();
                //resultado["NumTareasS"] = LstActividades.Where(w => w.Tipo == 2).Count();
                //resultado["NumTareas"] = LstActividades.Count();
                //resultado["NumComentarios"] = LstComentarios.Count();
                //resultado["NumBugs"] = LstBugs.Count();
                resultado["LstEquipo"] = JsonConvert.SerializeObject(Prod);

                //resultado["LstGraficas"] = JsonConvert.SerializeObject(LstGraficas);
                //resultado["LstActividadesAtras"] = JsonConvert.SerializeObject(LstActividades.Where(w => w.Tipo == 2).ToList());
                //resultado["LstActividadesSem"] = JsonConvert.SerializeObject(LstActividades.Where(w => w.Tipo == 1).ToList());
                resultado["TipoUsuario"] = Usuario.IdTipoUsuario;
                resultado["dtCapturaTiempo"] = JsonConvert.SerializeObject(dtCapturaTiempo);
                resultado["dtValorGanado"] = JsonConvert.SerializeObject(dtValorGanado);
                resultado["dtAccesos"] = JsonConvert.SerializeObject(dtAccesos);

                return Content(resultado.ToString());
            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = "No se encontro información en el período seleccionado.";
                return Content(resultado.ToString());
            }
        }


        public ActionResult ActualizaAlerta()
        {
            var resultado = new JObject();
            try
            {

                if (FuncionesGenerales.SesionActiva())
                {
                    
               

                    var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                    //var sesion = (Models.Sesion)Session["Usuario" + Session.SessionID].;
                    //string conexion = ConfigurationManager.ConnectionStrings["BDProductividad"].ToString();

                    //var 
                    //string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
                    CD_Home cdhome = new CD_Home();

                    List<ActividadComentarioModel> Lst = new List<ActividadComentarioModel>();


                    Lst = cdhome.ConsultaAlertas(Encripta.DesencriptaDatos(Usuario.ConexionSP), Usuario.IdUsuario);


                    string ComentariosI = string.Empty;
                    string ComentariosE = string.Empty;
                    if (Usuario.IdTipoUsuario == 19)
                    {
                        ComentariosI = FuncionesGenerales.ConvierteListaComentarios3(Lst);

                    }
                    else {
                        ComentariosI = FuncionesGenerales.ConvierteListaComentarios3(Lst.Where(w => w.Tipo == 0).ToList());
                        ComentariosE = FuncionesGenerales.ConvierteListaComentarios3(Lst.Where(w => w.Tipo == 1).ToList());
                    }
                   

                    resultado["NoAlertas"] = Lst.Count();
                    resultado["NoAlertasI"] = Lst.Where(w => w.Tipo == 0).ToList().Count();
                    resultado["NoAlertasE"] = Lst.Where(w => w.Tipo == 1).ToList().Count();
                    resultado["TipoUser"] = Usuario.IdTipoUsuario;
                    resultado["ComentariosI"] = ComentariosI;
                    resultado["ComentariosE"] = ComentariosE;
                    resultado["Exito"] = true;
                }
                else
                {
                    resultado["Exito"] = false;
                }



            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
            }

            return Content(resultado.ToString());
        }

        public ActionResult DeleteNot(long Id)
        {
            var resultado = new JObject();
            try
            {
         
                var sesion = (Models.Sesion)Session["Usuario" + Session.SessionID];
                //string conexion = ConfigurationManager.ConnectionStrings["BDProductividad"].ToString();
                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                CD_Home cdhome = new CD_Home();


                bool Exito = cdhome.ComentarioLeido(Id, sesion.Usuario.IdUsuario, conexion);


  
                resultado["Exito"] = true;

            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
            }

            return Content(resultado.ToString());
        }


        [HttpPost]
        public ActionResult ValidaSesion()
        {
            var resultado = new JObject();
            bool activo = true;
            string Mensaje = "";
            if (!FuncionesGenerales.SesionActiva())
            {
                activo = false;
                Mensaje = "La sesión ha expirado, inicie sesión nuevamente.";
            }

            resultado["Exito"] = activo;
            resultado["Mensaje"] = Mensaje;

            return Content(resultado.ToString());
        }

        public ActionResult ConsultaOrganizaciones()
        {
            var resultado = new JObject();
            try
            {
                var Usuario = ((Sesion)Session["Usuario" + Session.SessionID]).Usuario;
                CD_Login cd_l = new CD_Login();

                List<UsuarioModel> Lst = cd_l.ConsultaOrganizaciones(Usuario.IdCuenta);

                resultado["Exito"] = true;
                resultado["Lst"] = JsonConvert.SerializeObject(Lst);


                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = "Error al cargar organizaciones";
                return Content(resultado.ToString());
            }
        }

  
    }
}