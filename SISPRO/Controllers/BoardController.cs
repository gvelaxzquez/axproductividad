using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using CapaDatos;
using CapaDatos.Models;
using Newtonsoft.Json.Linq;
using System.Configuration;
using Newtonsoft.Json;



namespace AxProductividad.Controllers
{
    public class BoardController : Controller
    {
        // GET: Tablero
        public ActionResult Index()
        {



            if (!FuncionesGenerales.SesionActiva())
            {
                Session["URL" + Session.SessionID] = HttpContext.Request.Url.ToString().ToLower();
                return RedirectToAction("Index", "Login");
            }
            ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];


            Session["Controlador" + Session.SessionID] = "Board";
            if (!FuncionesGenerales.ValidaPermisos(0))
            {
                return RedirectToAction("Index", "Home");

            }
            return View();
           
        }

        public ActionResult ObtieneTablero(FiltrosModel Filtros)
        {
            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }
            var Resultado = new JObject();
            try
            {

                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                Filtros.IdUsuario = Usuario.IdUsuario;

                List<string> LstEstatus = new List<string>();
                List<long> LstTipoActividad = new List<long>();
                List<long> LstClasificacion = new List<long>();
                List<long> LstResponsable = new List<long>();
                List<long> LstPrioridad = new List<long>();

                if (Filtros.TipoPeriodo == 1)
                {

                    int delta = DayOfWeek.Monday - DateTime.Now.DayOfWeek;
                    if (delta > 0) delta -= 7;
                    DateTime Monday = DateTime.Now.AddDays(delta);
                    DateTime Sunday = Monday.AddDays(7);

                    Filtros.FechaSolIni = DateTime.Now.AddDays(delta);
                    Filtros.FechaSolFin = Monday.AddDays(7);

                }
                else if(Filtros.TipoPeriodo == 2) {

                   var fechatemp = DateTime.Today;
                    Filtros.FechaSolIni = new DateTime(fechatemp.Year, fechatemp.Month, 1);
                    Filtros.FechaSolFin = new DateTime(fechatemp.Year, fechatemp.Month + 1, 1);


                }

                LstEstatus.Add("A");
                LstEstatus.Add("P");
                LstEstatus.Add("R");
                LstEstatus.Add("V");
                LstEstatus.Add("X");
                LstEstatus.Add("L");

                Filtros.LstEstatus = LstEstatus;
                Filtros.LstTipoActividad = LstTipoActividad;
                Filtros.LstClasificacion = LstClasificacion;
                Filtros.LstResponsable = LstResponsable;
                Filtros.LstPrioridad = LstPrioridad;




                CD_Actividad cd_act = new CD_Actividad();
                List<ActividadesModel> LstActividades = new List<ActividadesModel>();
                List<ActividadesLogModel> LstActividadesLog = new List<ActividadesLogModel>();
              
                //string conexion = ConfigurationManager.ConnectionStrings["BDProductividad"].ToString();
                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
                List<ActividadesModel> LstActividadesEnc = new List<ActividadesModel>();

                cd_act.ObtieneActividades(Filtros, ref LstActividades, ref LstActividadesLog, ref LstActividadesEnc, conexion);

                string ActividadesA = FuncionesGenerales.ConvierteListaTareas(LstActividades, "A");
                string ActividadesP = FuncionesGenerales.ConvierteListaTareas(LstActividades, "P");
                string ActividadesR = FuncionesGenerales.ConvierteListaTareas(LstActividades, "V");
                ActividadesR += FuncionesGenerales.ConvierteListaTareas(LstActividades, "R");
                string ActividadesX = FuncionesGenerales.ConvierteListaTareas(LstActividades, "X");
                string ActividadesL = FuncionesGenerales.ConvierteListaTareas(LstActividades, "L");


                Resultado["Exito"] = true;
                Resultado["TotalAbiertas"] = LstActividades.Where(w => w.Estatus == "A").Count();
                Resultado["TotalProgreso"] = LstActividades.Where(w => w.Estatus == "P").Count();
                Resultado["TotalValidacion"] = LstActividades.Where(w => w.Estatus == "V" || w.Estatus == "R").Count();
                Resultado["TotalRechazadas"] = LstActividades.Where(w => w.Estatus == "X" ).Count();
                Resultado["TotalLiberadas"] = LstActividades.Where(w => w.Estatus == "L").Count();
                Resultado["ActividadesA"] = ActividadesA;
                Resultado["ActividadesP"] = ActividadesP;
                Resultado["ActividadesR"] = ActividadesR;
                Resultado["ActividadesX"] = ActividadesX;
                Resultado["ActividadesL"] = ActividadesL;

                return Content(Resultado.ToString());
            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }


        }

        public ActionResult ConsultaWorkFlow(FiltrosModel Filtros)
        {
            var resultado = new JObject();
            try
            {

                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }
                List<WorkFlowModel> Lst = new List<WorkFlowModel>();
                CD_Workflow cd_wf = new CD_Workflow();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                Lst = cd_wf.ConsultaFlujo(Filtros, Encripta.DesencriptaDatos(Usuario.ConexionEF));




                resultado["Exito"] = true;
                resultado["Workflow"] = JsonConvert.SerializeObject(Lst);
                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;


                return Content(resultado.ToString());
            }
    



        }

        public ActionResult ConsultaActividadesTablero(FiltrosModel Filtros)
        {
            var resultado = new JObject();
            try
            {

                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }
                List<ActividadesModel> Lst = new List<ActividadesModel>();
                CD_Actividad cd_act = new CD_Actividad();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                Lst = cd_act.ObtieneActividadesTablero(Filtros, Encripta.DesencriptaDatos(Usuario.ConexionSP));


                resultado["Exito"] = true;
                resultado["Actividades"] = JsonConvert.SerializeObject(Lst);
                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;


                return Content(resultado.ToString());
            }




        }


        public ActionResult ActualizaEstatusWF(ActividadesModel A) {
            var resultado = new JObject();
            try
            {

                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }
                CD_Actividad cd_act = new CD_Actividad();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                ActividadesModel Act = new ActividadesModel();

                int Respuesta = cd_act.ActualizaEstatusWF(A, Encripta.DesencriptaDatos(Usuario.ConexionEF),Usuario.IdUsuario, ref Act);


                if (Respuesta == 1 && Act.TipoId != 0) {

                    //Envio la notificacion

                    bool Envio = FuncionesGenerales.EnviarCorreoCambioEnFlujo(Act, Usuario.IdUsuario,Usuario.Nombre, Encripta.DesencriptaDatos(Usuario.ConexionEF));

                }

                resultado["Exito"] = Respuesta == 1 ? true: false;
         
                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;


                return Content(resultado.ToString());
            }
        
        }

        public  ActionResult CargarRecursos(long IdProyecto)
        {

            var resultado = new JObject();
            try
            {

                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }
                CD_Proyecto cd_proy = new CD_Proyecto();


                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                List<CatalogoGeneralModel> LstUsuarios = cd_proy.ConsultaUsuariosProyectoCombo(IdProyecto, Conexion);

                resultado["Exito"] = true;
                resultado["LstUsuarios"] = JsonConvert.SerializeObject(LstUsuarios);

                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
                return Content(resultado.ToString());
            }
        }

        public ActionResult ActualizaAsignado(ActividadesModel A)
        {
            var resultado = new JObject();
            try
            {

                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }
                CD_Actividad cd_act = new CD_Actividad();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                bool Respuesta = cd_act.ActualizaUsuarioAsignad(A,Usuario.IdUsuario, Encripta.DesencriptaDatos(Usuario.ConexionEF));

                resultado["Exito"] = Respuesta;

                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;


                return Content(resultado.ToString());
            }

        }
        public ActionResult ActualizaFecha(ActividadesModel A)
        {
            var resultado = new JObject();
            try
            {

                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }
                CD_Actividad cd_act = new CD_Actividad();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                bool Respuesta = cd_act.ActualizaFechas(A, Usuario.IdUsuario, Encripta.DesencriptaDatos(Usuario.ConexionEF));

                resultado["Exito"] = Respuesta;

                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;


                return Content(resultado.ToString());
            }

        }




        public ActionResult CargaFiltros(long IdProyecto)
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
                CD_Proyecto cd_proy = new CD_Proyecto();

                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

  
                List<CatalogoGeneralModel> LstFase = cd_CatGenral.ObtenerCatalogoGeneral(2, Conexion);
                List<CatalogoGeneralModel> LstClasificacion = cd_CatGenral.ObtenerCatalogoGeneral(5, Conexion);
                List<CatalogoGeneralModel> LstPrioridad = cd_CatGenral.ObtenerCatalogoGeneral(20, Conexion);
                List<CatalogoGeneralModel> LstSprint  = cd_CatGenral.ObtenerSprintsProyecto(IdProyecto, Conexion);
                List<CatalogoGeneralModel> LstUsuarios = cd_proy.ConsultaUsuariosProyectoCombo(IdProyecto, Conexion);


                resultado["Exito"] = true;

                resultado["LstFase"] = JsonConvert.SerializeObject(LstFase);
                resultado["LstClasificacion"] = JsonConvert.SerializeObject(LstClasificacion);
                resultado["LstPrioridad"] = JsonConvert.SerializeObject(LstPrioridad);
                resultado["LstSprint"] = JsonConvert.SerializeObject(LstSprint);
                resultado["LstUsuarios"] = JsonConvert.SerializeObject(LstUsuarios);


                return Content(resultado.ToString());
            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
                return Content(resultado.ToString());
            }
        }

        public ActionResult GuardarWorkflow(long IdProyecto, byte IdTipo, List<WorkFlowModel> Lst) {
            var resultado = new JObject();
            try
            {

                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }

                Session["Controlador" + Session.SessionID] = "Board";
                if (!FuncionesGenerales.ValidaPermisos(2))
                {

                    resultado["Exito"] = false;
                    resultado["Mensaje"] ="No tiene permisos para modificar el flujo.";


                }
                else {
                    CD_Workflow cd_w = new CD_Workflow();
                    var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                    bool Respuesta = cd_w.GuardarWorkFlow(IdProyecto, IdTipo, Lst, Usuario.IdUsuario, Encripta.DesencriptaDatos(Usuario.ConexionEF));
                    resultado["Exito"] = Respuesta;
                }

             

              

                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;


                return Content(resultado.ToString());
            }
        
        }

        public ActionResult EliminarWorkFlow(long IdWorkFlow)
        {
            var resultado = new JObject();
            try
            {

                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }
                CD_Workflow cd_w = new CD_Workflow();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                bool Respuesta = cd_w.EliminarWorflow(IdWorkFlow, Encripta.DesencriptaDatos(Usuario.ConexionEF));

                resultado["Exito"] = Respuesta;

                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;


                return Content(resultado.ToString());
            }

        }

        public ActionResult ActualizaDatoActividad(long IdActividad, string campo, object Dato1)
        {
            var resultado = new JObject();
            try
            {

                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }
                CD_Actividad cd_w = new CD_Actividad();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                bool Respuesta = cd_w.ActualizarCampoActividad(IdActividad, campo, Dato1, Usuario.IdUsuario,  Encripta.DesencriptaDatos(Usuario.ConexionEF));

                resultado["Exito"] = Respuesta;

                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;


                return Content(resultado.ToString());
            }


        }

        public ActionResult ActualizacionMasiva(List<int> Actividades, int Tipo, long IdNuevo)
        {
            var resultado = new JObject();
            try
            {

                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }
                CD_Actividad cd_w = new CD_Actividad();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                bool Respuesta = cd_w.ActualizacionMasivaActividades(Actividades, Tipo, IdNuevo, Usuario.IdUsuario, Encripta.DesencriptaDatos(Usuario.ConexionSP));

                resultado["Exito"] = Respuesta;

                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;


                return Content(resultado.ToString());
            }


        }

        public ActionResult ActualizacionMasivaFechas(List<int> Actividades, DateTime? FechaInicio, DateTime? FechaSolicitado)
        {
            var resultado = new JObject();
            try
            {

                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }
                CD_Actividad cd_w = new CD_Actividad();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                bool Respuesta = cd_w.ActualizacionMasivaFechas(Actividades, FechaInicio, FechaSolicitado, Usuario.IdUsuario, Encripta.DesencriptaDatos(Usuario.ConexionSP));

                resultado["Exito"] = Respuesta;

                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;


                return Content(resultado.ToString());
            }


        }

        public ActionResult GuardarActividadList(ActividadesModel A) {

                var resultado = new JObject();
                try
                {

                    if (!FuncionesGenerales.SesionActiva())
                    {
                        return RedirectToAction("Index", "Login");
                    }
                    CD_Actividad cd_w = new CD_Actividad();
                    var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                    long Respuesta = cd_w.GuardarActividadLista(A, Usuario.IdUsuario,Encripta.DesencriptaDatos(Usuario.ConexionEF));
                     ActividadesModel Actividad = cd_w.ConsultaActividad(Respuesta, Usuario.IdUsuario, Encripta.DesencriptaDatos(Usuario.ConexionSP));
                     Actividad.Prioridad = -99;

                    resultado["Exito"] = true;
                    resultado["Actividad"] = JsonConvert.SerializeObject(Actividad);

                return Content(resultado.ToString());

                }
                catch (Exception ex)
                {

                    resultado["Exito"] = false;
                    resultado["Mensaje"] = ex.Message;


                    return Content(resultado.ToString());
                }
 
        
        }



    }
}