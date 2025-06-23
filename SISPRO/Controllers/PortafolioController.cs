using System;
using System.Collections.Generic;
using System.Web.Mvc;
using System.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Linq;
using CapaDatos;
using AxProductividad.ClasesAuxiliares;
using CapaDatos.Models;
using System.Configuration;
using System.Net.NetworkInformation;
using CapaDatos.DataBaseModel;

namespace AxProductividad.Controllers
{
    public class PortafolioController : Controller
    {
        // GET: Portafolio
        public ActionResult Index()
        {
            ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];

            Session["Controlador" + Session.SessionID] = "Portafolio";
            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }

            if (!FuncionesGenerales.ValidaPermisos(0))
            {
                return RedirectToAction("Unauthorized", "ERROR");

            }

            CD_CatalogoGeneral cd_c = new CD_CatalogoGeneral();

            var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;


            ViewBag.LstLideres = cd_c.ObtenerLideres(Usuario, Encripta.DesencriptaDatos(Usuario.ConexionEF));
            return View();
        }

        public ActionResult CargaPortafolio(long IdUsuario)
        {

            var Resultado = new JObject();
            try
            {
                CD_Proyecto cd_pro = new CD_Proyecto();
                CD_Reportes cd_rep = new CD_Reportes();
                CD_Actividad cd_act = new CD_Actividad();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                List<ProyectosModel> LstPro2 = new List<ProyectosModel>();
      
                string ConexionSP = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);



                List<string> Estatus = new List<string>();
                Estatus.Add("E");
                Estatus.Add("P");
                Estatus.Add("C");

                //Usuario.IdUsuario = IdUsuario == -1 ? Usuario.IdUsuario : IdUsuario;

                LstPro2 = cd_pro.ConsultaProyectosV3("", Estatus, IdUsuario == -1 ? Usuario.IdUsuario : IdUsuario, ConexionSP);
                var LstSprint = cd_pro.ConsultaResumenSprintsUsuario(IdUsuario == -1 ? Usuario.IdUsuario : IdUsuario, ConexionSP);
                var LstMilestones = cd_act.ConsultaMilestones(LstPro2.Select(s => s.IdProyecto).ToList(), Conexion);


                List<GanttModel> Gantt = FuncionesGenerales.ConvierteGantt_Proyecto(LstPro2.Where(w => w.FechaInicioPlan != null && w.FechaFinComprometida != null).ToList());

                //Gantt.AddRange(FuncionesGenerales.ConvierteGantt_SprintsProyecto(LstSprint));
                Gantt.AddRange(FuncionesGenerales.ConvierteGantt_Milestones(LstMilestones));


                IndicadoresModel Indicadores = new IndicadoresModel();

                Indicadores = cd_pro.ObtienePortafolio(IdUsuario == -1 ? Usuario.IdUsuario : IdUsuario, ConexionSP);
                //var Prod = cd_rep.ConsultaProuctividadEqupo(Usuario.IdUsuario, Usuario.IdTipoUsuario, null, ConexionSP);

                //Indicadores.Productividad = 92;
                //Indicadores.ProductividadMes = 60;

                //string Timeline = FuncionesGenerales.ConvierteTimeline(Indicadores.LstMilestones);


                Resultado["Exito"] = true;
                Resultado["Indicadores"] = JsonConvert.SerializeObject(Indicadores);
                Resultado["LstProyectos"] = JsonConvert.SerializeObject(LstPro2);
                Resultado["TotalProyectos"] = JsonConvert.SerializeObject(LstPro2.Count);
                Resultado["Gantt"] = JsonConvert.SerializeObject(Gantt);
                //Resultado["Timeline"] = Timeline;

                return Content(Resultado.ToString());


            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }

        }
    
        public ActionResult Sponsor() {

            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }

            ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];


            var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;


            CD_Actividad cd_a = new CD_Actividad();
            List<QueryModel> LstPropios = new List<QueryModel>();
            List<QueryModel> LstCompartidos = new List<QueryModel>();

            cd_a.ConsultaQuerys(ref LstPropios, ref LstCompartidos, Usuario.IdUsuario, Encripta.DesencriptaDatos(Usuario.ConexionEF));


            ViewBag.LstQuerys = LstCompartidos;


            return View();
        }
    }
}