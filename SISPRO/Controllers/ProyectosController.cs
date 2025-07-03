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
using System.IO;
using OfficeOpenXml;
using CapaDatos.Models.Constants;
using CapaDatos.DataBaseModel;
using System.Net.NetworkInformation;
using DocumentFormat.OpenXml.Spreadsheet;

namespace AxProductividad.Controllers
{
    public class ProyectosController : BaseController
    {
        // GET: Proyectos
        public ActionResult Index()
        {
            ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
            Session["Controlador" + Session.SessionID] = "Proyectos";
            if (!FuncionesGenerales.SesionActiva())
            {
                Session["URL" + Session.SessionID] = HttpContext.Request.Url.ToString().ToLower();
                return RedirectToAction("Index", "Login");
            }

            if (!FuncionesGenerales.ValidaPermisos(0))
            {

                return RedirectToAction("Unauthorized", "ERROR");



            }
            var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;


            CD_Proyecto cd_P = new CD_Proyecto();
            List<ProyectosModel> LstProyectos = cd_P.ConsultaPlantillas(Encripta.DesencriptaDatos(Usuario.ConexionEF));


            ViewBag.LstProyectos = LstProyectos;


            return View();
        }

        public ActionResult ConsultaInicialProyectos()
        {

            var Resultado = new JObject();
            try
            {
                CD_Proyecto cd_pro = new CD_Proyecto();
                CD_CatalogoGeneral cd_CatGenral = new CD_CatalogoGeneral();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                //List<ProyectosModel> LstPro = new List<ProyectosModel>();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                string ConexionSP = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);

                List<CatalogoGeneralModel> LstLideres = cd_CatGenral.ObtenerLideres(Usuario, Conexion);
                List<CatalogoGeneralModel> LstClientes = cd_CatGenral.ObtenerClientes(Conexion);
                List<CatalogoGeneralModel> LstTipoProyecto = cd_CatGenral.ObtenerCatalogoGeneral(4, Conexion);
                List<CatalogoGeneralModel> LstEstatus = cd_CatGenral.ObtenerCatalogoGeneral(12, Conexion);
                List<CatalogoGeneralModel> LstMetodologia = cd_CatGenral.ObtenerCatalogoGeneral(9, Conexion);
                List<CatalogoGeneralModel> LstWorkflow = cd_CatGenral.ObtenerWorkFlows(Conexion);


                //List<string> Estatus = new List<string>();
                //Estatus.Add("E");
                //Estatus.Add("P");
                //Estatus.Add("C");
                //LstPro2 = cd_pro.ConsultaProyectosV3(string.Empty, Estatus,Usuario, ConexionSP);


                //LstPro = cd_pro.ConsultaProyectosActivos(Usuario, Conexion);


                Resultado["Exito"] = true;
                //Resultado["LstProyectos"] = JsonConvert.SerializeObject(LstPro);
                //Resultado["LstProyectos2"] = JsonConvert.SerializeObject(LstPro2);
                //Resultado["TotalProyectos"] = JsonConvert.SerializeObject(LstPro2.Count);
                Resultado["LstLideres"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(LstLideres);
                Resultado["LstClientes"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(LstClientes);
                Resultado["LstTipoProyecto"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(LstTipoProyecto);
                Resultado["LstMetodologia"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(LstMetodologia);
                Resultado["LstEstatus"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(LstEstatus);
                Resultado["LstWorkflow"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(LstWorkflow);
                return Content(Resultado.ToString());


            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }

        }

        public ActionResult ConsultaProyectosCliente()
        {

            var Resultado = new JObject();
            try
            {
                CD_Proyecto cd_pro = new CD_Proyecto();
                CD_CatalogoGeneral cd_CatGenral = new CD_CatalogoGeneral();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                string ConexionSP = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);

                List<string> Estatus = new List<string>();
                Estatus.Add("E");
                Estatus.Add("P");
                Estatus.Add("C");

                List<ProyectosModel> LstPro2 = new List<ProyectosModel>();
                LstPro2 = cd_pro.ConsultaProyectosV3(string.Empty,Estatus, Usuario.IdUsuario, ConexionSP);



                Resultado["Exito"] = true;
                Resultado["LstProyectos"] = JsonConvert.SerializeObject(LstPro2);
                Resultado["TotalProyectos"] = JsonConvert.SerializeObject(LstPro2.Count);
                return Content(Resultado.ToString());


            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }

        }

        public ActionResult ConsultaProyectosV2(string Texto, List<string> Estatus)
        {

            var Resultado = new JObject();
            try
            {
                CD_Proyecto cd_pro = new CD_Proyecto();

                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                List<ProyectosModel> LstPro = new List<ProyectosModel>();
                string ConexionSP = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);




                LstPro = cd_pro.ConsultaProyectosV3(Texto, Estatus, Usuario.IdUsuario, ConexionSP);

                List<GanttModel> Gantt = FuncionesGenerales.ConvierteGantt_Proyecto(LstPro.Where(w=> w.FechaInicioPlan != null && w.FechaFinComprometida != null).ToList());


                Resultado["Exito"] = true;
                Resultado["LstProyectos"] = JsonConvert.SerializeObject(LstPro);
                Resultado["TotalProyectos"] = JsonConvert.SerializeObject(LstPro.Count);
                Resultado["Gantt"] = JsonConvert.SerializeObject(Gantt);
                return Content(Resultado.ToString());


            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }

        }
        public ActionResult GuardarProyecto(ProyectosModel Proyecto)
        {

            var Resultado = new JObject();
            try
            {
                #region validapermisos
                if (Proyecto.IdProyecto == 0)
                {
                    if (!FuncionesGenerales.ValidaPermisos(1))
                    {
                        Resultado["Exito"] = false;
                        Resultado["Mensaje"] = Mensajes.MensajePermisoGuardar();
                        return Content(Resultado.ToString());
                    }

                }
                else
                {
                    if (!FuncionesGenerales.ValidaPermisos(2))
                    {
                        Resultado["Exito"] = false;
                        Resultado["Mensaje"] = Mensajes.MensajePermisoEditar();
                        return Content(Resultado.ToString());
                    }

                }
                #endregion

                CD_Proyecto cd_pro = new CD_Proyecto();
                Proyecto.IdUCreo = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.IdUsuario;
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                int Respuesta = cd_pro.GuardarProyecto(Proyecto, Conexion);

                Resultado["Exito"] = Respuesta == 1 ? true : false;
                Resultado["Advertencia"] = Respuesta == 2 ? true : false;
                Resultado["CveProyecto"] = Proyecto.Clave;
                Resultado["Mensaje"] = Respuesta == 1 ? Mensajes.MensajeGuardadoExito() : "Ya existe un proyecto registrado con la misma clave.";

                return Content(Resultado.ToString());

            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }

        }
        public ActionResult GuardarRepositorio(ProyectoRepositorioModel proyecto)
        {
            try
            {
                proyecto.IdUCreo = idUsuario;
                var (estatus, mensaje) = new CD_Proyecto().GuardarRepositorio(proyecto, conexionEF);

                return Json(new { Exito = estatus, Mensaje = mensaje });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult EliminarRepositorio(ProyectoRepositorioModel proyecto)
        {
            try
            {
                if (!proyectos.Contains(proyecto.IdProyecto))
                    return Json(new { Exito = false, Mensaje = Mensaje.MensajeErrorDatos });

                var (estatus, mensaje) = new CD_Proyecto().EliminarRepositorio(proyecto, conexionEF);

                return Json(new { Exito = estatus, Mensaje = mensaje });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult LeerRepositorios(long idProyecto)
        {
            try
            {
                var repos = new CD_Proyecto().LeerRepositorios(idProyecto, conexionEF);

                return Json(new { Exito = true, Repos = repos });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult CambiaEstatusProyecto(long IdProyecto, string Estatus)
        {
            try
            {
                var sucess = new CD_Proyecto().CambiaEstatusProyecto(IdProyecto, Estatus,conexionEF);
                return Json(new { Exito = true});
            }
            catch (Exception e)
            {

                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }


        }

        [Route("Proyecto/{Id}")]
        public ActionResult Proyecto(string Id)
        {
            ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
            Session["Controlador" + Session.SessionID] = "Proyectos";
            ViewBag.Clave = Id;
            Session["Proyecto" + Session.SessionID] = Id;

            if (!FuncionesGenerales.SesionActiva())
            {
                Session["URL" + Session.SessionID] = HttpContext.Request.Url.ToString().ToLower();
                return RedirectToAction("Index", "Login");
            }

            if (!FuncionesGenerales.ValidaPermisos(0))
            {
                return RedirectToAction("Unauthorized", "ERROR");

            }

            var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
            string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
            CD_Configuracion cd_conf = new CD_Configuracion();
            bool conf = bool.Parse(cd_conf.ObtenerConfiguracionID(33, Conexion));


            ViewBag.IdTipoUsuario = Usuario.IdTipoUsuario;
            ViewBag.IndFinancieros = conf;

            return View();

        }

        [Route("MiProyecto/{Id}")]
        public ActionResult MiProyecto(string Id)
        {
            ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
            Session["Accion" + Session.SessionID] = "MiProyecto";
            ViewBag.Clave = Id;
            Session["Proyecto" + Session.SessionID] = Id;

            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }


            CD_Proyecto cd_pro = new CD_Proyecto();
            var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
            string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
            ProyectosModel Proy = new ProyectosModel();
            Proy = cd_pro.ConsultaProyecto(Id, Conexion);

            ViewBag.IdProyecto = Proy.IdProyecto;
            //if (!FuncionesGenerales.ValidaPermisos(0))
            //{
            //    return RedirectToAction("Unauthorized", "ERROR");

            //}

            //var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
            //ViewBag.IdTipoUsuario = Usuario.IdTipoUsuario;

            return View();

        }


        public ActionResult ConsultaProyecto()
        {

            var Resultado = new JObject();
            try
            {
                CD_Proyecto cd_pro = new CD_Proyecto();
                CD_CatalogoGeneral cd_CatGenral = new CD_CatalogoGeneral();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                ProyectosModel Proy = new ProyectosModel();
                List<CatalogoGeneralModel> LstLideres = cd_CatGenral.ObtenerLideres(Usuario, Conexion);
                List<CatalogoGeneralModel> LstClientes = cd_CatGenral.ObtenerClientes(Conexion);
                List<CatalogoGeneralModel> LstTipoProyecto = cd_CatGenral.ObtenerCatalogoGeneral(4, Conexion);
                List<CatalogoGeneralModel> LstMetodologia = cd_CatGenral.ObtenerCatalogoGeneral(9, Conexion);
                List<CatalogoGeneralModel> LstEstatus = cd_CatGenral.ObtenerCatalogoGeneral(12, Conexion);

                var Clave = (string)Session["Proyecto" + Session.SessionID].ToString();
                Proy = cd_pro.ConsultaProyecto(Clave, Conexion);
                Session["IdProyecto" + Session.SessionID] = Proy.IdProyecto;

                List<CatalogoGeneralModel> LstUsuarios = cd_pro.ConsultaUsuariosProyectoCombo(Proy.IdProyecto, Conexion);
                List<CatalogoGeneralModel> LstSprints = cd_pro.ComboSprintsProyecto(Proy.IdProyecto, Conexion);


                Resultado["Exito"] = true;
                Resultado["Proyecto"] = JsonConvert.SerializeObject(Proy);
                Resultado["LstLideres"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(LstLideres);
                Resultado["LstClientes"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(LstClientes);
                Resultado["LstTipoProyecto"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(LstTipoProyecto);
                Resultado["LstMetodologia"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(LstMetodologia);
                Resultado["LstEstatus"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(LstEstatus);
                Resultado["LstUsuarios"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlImagen(LstUsuarios, "");
                Resultado["LstSprints"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(LstSprints);
                return Content(Resultado.ToString());


            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }

        }
        public ActionResult CargaComboProyecto()
        {

            var resultado = new JObject();
            try
            {

                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                string Conexion = Encripta.DesencriptaDatos(Usuario.ConexionEF);
                CD_CatalogoGeneral cd_CatGenral = new CD_CatalogoGeneral();

                List<CatalogoGeneralModel> LstProyectos = cd_CatGenral.ObtenerProyectosPorUsuario(Usuario, Conexion);

                resultado["Exito"] = true;

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


        public ActionResult CargaListaProyectos()
        {

            var resultado = new JObject();
            try
            {

                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                string Conexion = Encripta.DesencriptaDatos(Usuario.ConexionEF);
                CD_CatalogoGeneral cd_CatGenral = new CD_CatalogoGeneral();

                List<CatalogoGeneralModel> LstProyectos = cd_CatGenral.ObtenerProyectosPorUsuario(Usuario, Conexion);

                resultado["Exito"] = true;

                resultado["LstProyectos"] = JsonConvert.SerializeObject(LstProyectos); 

                return Content(resultado.ToString());



            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
                return Content(resultado.ToString());
            }

        }


        #region Indicadores

        public ActionResult ConsultaIndicadores(long IdProyecto)
        {
            var Resultado = new JObject();
            try
            {
                CD_Proyecto cd_pro = new CD_Proyecto();
                CD_Graficas cd_gra = new CD_Graficas();
                CD_Reportes cd_rep = new CD_Reportes();
                ProyectosModel pro = new ProyectosModel();
                GraficaConsultaModel graf = new GraficaConsultaModel();
                List<GraficaConsultaModel> LstGraf = new List<GraficaConsultaModel>();
                List<ProyectoIteracionModel> LstSprints = new List<ProyectoIteracionModel>();

                ReporteFiltroModel filtro = new ReporteFiltroModel();
                filtro.FechaCorte = DateTime.Now;
                filtro.Abiertos = true;
                filtro.IdUsuario = 70;
                filtro.IdTipoUsuario = 17;
                filtro.IdProyecto = IdProyecto;

                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
                graf = cd_gra.ConsultarGraficaAvanceProyecto(IdProyecto, DateTime.Now, conexion);
                LstGraf.Add(graf);

                pro = cd_rep.ObtenerInformeProyectos(filtro, conexion).FirstOrDefault();
                LstSprints = cd_pro.ConsultaResumenSprints(IdProyecto, conexion).Where(w=> w.Estatus2== "A" || w.Estatus2 == "P").ToList();


                //string Timeline = FuncionesGenerales.ConvierteTimeline(pro.Actividades);
                //var resultadoConsultar = cd_gra.ConsultarGraficas(filtroGraficas, conexion, ref LstGraf);

                Resultado["Exito"] = true;
                Resultado["Indicadores"] = JsonConvert.SerializeObject(pro);
                Resultado["Sprints"] = JsonConvert.SerializeObject(LstSprints);
                Resultado["GraficaAvance"] = JsonConvert.SerializeObject(LstGraf);
                return Content(Resultado.ToString());


            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }

        }
        public ActionResult ConsultaIndicadoresCliente(string Clave)
        {
            var Resultado = new JObject();
            try
            {
                CD_Proyecto cd_pro = new CD_Proyecto();
                CD_Graficas cd_gra = new CD_Graficas();
                CD_Reportes cd_rep = new CD_Reportes();
                ProyectosModel pro = new ProyectosModel();
                GraficaConsultaModel graf = new GraficaConsultaModel();
                List<GraficaConsultaModel> LstGraf = new List<GraficaConsultaModel>();
                List<ProyectoIteracionModel> LstSprints = new List<ProyectoIteracionModel>();

                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
                string conexionef = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                //List<string> LstAnios = new List<string>();
                //LstAnios.Add((DateTime.Now.Year - 1).ToString());
                //LstAnios.Add((DateTime.Now.Year).ToString());

                //List<string> LstRecursos = new List<string>();
                //LstRecursos.Add("70");


                //List<string> LstRep = new List<string>();
                //LstRep.Add("1");
                //LstRep.Add("2");

                //List<string> LstMeses = new List<string>();


                //FiltrosModel filtroGraficas = new FiltrosModel();

                //filtroGraficas.LstAnios = LstAnios;
                //filtroGraficas.LstRecursos = LstRecursos;
                //filtroGraficas.LstGraficas = LstRep;
                //filtroGraficas.LstMeses = LstMeses;

                //ProyectosModel proy = new ProyectosModel();
                var p = cd_pro.ConsultaProyecto(Clave, conexionEF);

                ReporteFiltroModel filtro = new ReporteFiltroModel();
                filtro.FechaCorte = DateTime.Now;
                filtro.Abiertos = true;
                filtro.IdUsuario = 70;
                filtro.IdTipoUsuario = 17;
                filtro.IdProyecto = p.IdProyecto;


                //string conexion = ConfigurationManager.ConnectionStrings["BDProductividad"].ToString();

                //pro = cd_pro.ConsultaIndicadores(IdProyecto, conexion);
                graf = cd_gra.ConsultarGraficaAvanceProyecto(p.IdProyecto, DateTime.Now.AddDays(-1), conexion);
                LstGraf.Add(graf);
                pro = cd_rep.ObtenerInformeProyectosCliente(filtro, conexion).FirstOrDefault();
                LstSprints = cd_pro.ConsultaResumenSprints(p.IdProyecto, conexion);
                var LstEquipo = cd_pro.ConsultaUsuariosProyecto(p.IdProyecto, conexionef).Where(w => w.IdTipoUsuario != 19).ToList();

                //string Timeline = FuncionesGenerales.ConvierteTimeline(pro.Actividades);
                //var resultadoConsultar = cd_gra.ConsultarGraficas(filtroGraficas, conexion, ref LstGraf);

                Resultado["Exito"] = true;
                Resultado["Indicadores"] = JsonConvert.SerializeObject(pro);
                Resultado["Sprints"] = JsonConvert.SerializeObject(LstSprints);
                Resultado["Equipo"] = JsonConvert.SerializeObject(LstEquipo);
                Resultado["GraficaAvance"] = JsonConvert.SerializeObject(LstGraf);
                return Content(Resultado.ToString());


            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }

        }

        public ActionResult ConsultaConfigFechas(long IdProyecto) {
            var Resultado = new JObject();
            try
            {

                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                ProyectosModel Proy = new ProyectosModel();
                CD_Proyecto cd_p = new CD_Proyecto();

                Proy = cd_p.ConsultaConfigFechas(IdProyecto, Conexion);

                Resultado["Exito"] = true;
                Resultado["Proyecto"] = JsonConvert.SerializeObject(Proy);
                return Content(Resultado.ToString());
            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }
        }

        public ActionResult GuardarConfigFechas(ProyectosModel Proyecto)
        {
            var Resultado = new JObject();
            try
            {

                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                ProyectosModel Proy = new ProyectosModel();
                CD_Proyecto cd_p = new CD_Proyecto();

                bool exito = cd_p.GuardarConfigFechas(Proyecto, Conexion);

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


        public ActionResult ConsultaConfigHoras(long IdProyecto)
        {
            var Resultado = new JObject();
            try
            {

                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                ProyectosModel Proy = new ProyectosModel();
                CD_Proyecto cd_p = new CD_Proyecto();

                Proy = cd_p.ConsultaConfigHoras(IdProyecto, Conexion);

                Resultado["Exito"] = true;
                Resultado["Proyecto"] = JsonConvert.SerializeObject(Proy);
                return Content(Resultado.ToString());
            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }
        }

        public ActionResult GuardarConfigHoras(ProyectosModel Proyecto)
        {
            var Resultado = new JObject();
            try
            {

                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                ProyectosModel Proy = new ProyectosModel();
                CD_Proyecto cd_p = new CD_Proyecto();

                bool exito = cd_p.GuardarConfigHoras(Proyecto, Conexion);

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

        #endregion

        #region Equipo
        public ActionResult ConsultaUsuariosProyecto(long IdProyecto)
        {
            var Resultado = new JObject();
            try
            {
                CD_Proyecto cd_pro = new CD_Proyecto();
                List<UsuarioModel> LstUsuarios = new List<UsuarioModel>();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                LstUsuarios = cd_pro.ConsultaUsuariosProyecto(IdProyecto, Conexion);

                Resultado["Exito"] = true;
                Resultado["LstUsuarios"] = JsonConvert.SerializeObject(LstUsuarios);
                return Content(Resultado.ToString());
            }
            catch (Exception ex)
            {
                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;
                return Content(Resultado.ToString());
            }
        }
        public ActionResult ConsultaUsuariosProyectoV2(long IdProyecto)
        {
            var Resultado = new JObject();
            try
            {
                CD_Proyecto cd_pro = new CD_Proyecto();
                List<UsuarioModel> LstUsuarios = new List<UsuarioModel>();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                decimal? HorasPromedio = 0;
                decimal? Cobertura = 0;
                decimal? CoberturaPorc= 0;
                LstUsuarios = cd_pro.ConsultaUsuariosProyectoV2(ref HorasPromedio, ref Cobertura, ref CoberturaPorc, IdProyecto, Conexion);

                Resultado["Exito"] = true;
                Resultado["HorasPromedio"] = HorasPromedio;
                Resultado["Cobertura"] = Cobertura;
                Resultado["CoberturaPorc"] = CoberturaPorc;
                Resultado["LstUsuarios"] = JsonConvert.SerializeObject(LstUsuarios);
                return Content(Resultado.ToString());
            }
            catch (Exception ex)
            {
                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;
                return Content(Resultado.ToString());
            }
        }


        public ActionResult ConsultarEquipoProyecto(long idProyecto)
        {
            try
            {
                var equipo = cd_Proyecto.ConsultarEquipoProyecto(idProyecto, conexionEF);
                return Json(new { Exito = true, Equipo = equipo });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult ConsultaUsuariosAgregar(long IdProyecto)
        {


            var Resultado = new JObject();
            try
            {
                CD_Proyecto cd_pro = new CD_Proyecto();
                List<UsuarioModel> LstUsuarios = new List<UsuarioModel>();
                var DepartamentoId = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.DepartamentoId;
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                LstUsuarios = cd_pro.ConsultaUsuariosAgregar(IdProyecto, DepartamentoId, Conexion);

                Resultado["Exito"] = true;
                Resultado["LstUsuarios"] = JsonConvert.SerializeObject(LstUsuarios);
                return Content(Resultado.ToString());


            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }


        }

        public ActionResult GuardarUsuariosProyecto(ProyectoUsuarioModel Usuario)
        {


            var Resultado = new JObject();
            try
            {
                CD_Proyecto cd_pro = new CD_Proyecto();
                var IdUsuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.IdUsuario;
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                bool Exito = cd_pro.GuardarUsuarioProyecto(Usuario, IdUsuario, Conexion);

                Resultado["Exito"] = true;
                Resultado["Mensaje"] = "Se agregó el usuario correctamente";
                return Content(Resultado.ToString());


            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }


        }



        public ActionResult EliminarUsuarioProyecto(long IdProyectoUsuario)
        {


            var Resultado = new JObject();
            try
            {
                CD_Proyecto cd_pro = new CD_Proyecto();
                var IdUsuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.IdUsuario;
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                bool Exito = cd_pro.EliminarUsuarioProyecto(IdProyectoUsuario, IdUsuario, Conexion);

                Resultado["Exito"] = true;
                Resultado["Mensaje"] = "Se eliminó el usuario con éxito.";
                return Content(Resultado.ToString());


            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }


        }


        public ActionResult GuardaUsuarioParticipacion(ProyectoUsuarioModel ProyectoU)
        {
            var Resultado = new JObject();
            try
            {


                CD_Proyecto cd_pro = new CD_Proyecto();

                if (ProyectoU.Participacion > 100 || ProyectoU.Participacion < 0)
                {
                    Resultado["Exito"] = false;
                    Resultado["Mensaje"] = "La participación debe estar en un rango de 0 a 100.";

                    return Content(Resultado.ToString());

                }


                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                ProyectoU.IdUMod = Usuario.IdUMod;
                bool Respuesta = cd_pro.GuardarUsuarioParticipacion(ProyectoU, Encripta.DesencriptaDatos(Usuario.ConexionEF));

                Resultado["Exito"] = Respuesta;
                Resultado["Mensaje"] = Respuesta == true ? Mensajes.MensajeGuardadoExito() : "Error al actualizar la participación del usuario.";

                return Content(Resultado.ToString());

            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }

        }

        public ActionResult GuardarUsuarioAdministra(long IdProyectoUsuario, bool AdministraProy) {
            var Resultado = new JObject();
            try
            {


                CD_Proyecto cd_pro = new CD_Proyecto();


                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                bool Respuesta = cd_pro.GuardarUsuarioAdministra(IdProyectoUsuario, AdministraProy, Encripta.DesencriptaDatos(Usuario.ConexionEF));

                Resultado["Exito"] = Respuesta;
                Resultado["Mensaje"] = Respuesta == true ? Mensajes.MensajeGuardadoExito() : "Error al actualizar el usuario.";

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
        public ActionResult GuardarSprint(ProyectoIteracionModel Sprint)
        {
            var Resultado = new JObject();
            try
            {
                CD_Proyecto cd_pro = new CD_Proyecto();
                List<ProyectoIteracionModel> LstSprint = new List<ProyectoIteracionModel>();
                var IdUsuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.IdUsuario;
                Sprint.IdUCreo = IdUsuario;
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                int respuesta = cd_pro.GuardarSprint(Sprint, Conexion);

         


                Resultado["Exito"] = respuesta == 1 ? true : false;
                Resultado["Mensaje"] = respuesta == 1 ? "Se guardo el sprint de manera exitosa" : "Ya existe un sprint con el mismo nombre dentro del proyecto";
                //Resultado["Sprints"] = Sprints;
                return Content(Resultado.ToString());


            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }


        }

        public ActionResult ConsultarSprints(long IdProyecto)
        {
            var Resultado = new JObject();
            try
            {
                CD_Proyecto cd_pro = new CD_Proyecto();
                List<ProyectoIteracionModel> LstSprint = new List<ProyectoIteracionModel>();
                List<ActividadesModel> LstBacklog = new List<ActividadesModel>();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                LstSprint = cd_pro.ConsultaSprints(IdProyecto, Conexion);
                string Sprints = FuncionesGenerales.ConvierteSprints(LstSprint);
                LstBacklog = cd_pro.ConsultaBacklog(IdProyecto, Conexion);
                string Backlog = FuncionesGenerales.ConvierteBacklog(LstBacklog);



                Resultado["Exito"] = true;
                Resultado["Sprints"] = Sprints;
                Resultado["Backlog"] = Backlog;
                return Content(Resultado.ToString());

            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }
        }

        public ActionResult ConsultarSprintsV2(long IdProyecto, List<string> Estatus)
        {
            var Resultado = new JObject();
            try
            {
                CD_Proyecto cd_pro = new CD_Proyecto();
                List<ProyectoIteracionModel> LstSprint = new List<ProyectoIteracionModel>();
                List<ActividadesModel> LstBacklog = new List<ActividadesModel>();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                LstSprint = cd_pro.ConsultaSprintsV2(IdProyecto,Estatus, Conexion);
                string Sprints = FuncionesGenerales.ConvierteSprints(LstSprint);
                LstBacklog = cd_pro.ConsultaBacklog(IdProyecto, Conexion);
                string Backlog = FuncionesGenerales.ConvierteBacklog(LstBacklog);



                Resultado["Exito"] = true;
                Resultado["Sprints"] = Sprints;
                Resultado["Backlog"] = Backlog;
                return Content(Resultado.ToString());

            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }
        }

        public ActionResult ConsultarSprintsV3(long IdProyecto, List<string> Estatus)
        {
            var Resultado = new JObject();
            try
            {
                CD_Proyecto cd_pro = new CD_Proyecto();
                List<ProyectoIteracionModel> LstSprint = new List<ProyectoIteracionModel>();
                List<ActividadesModel> LstBacklog = new List<ActividadesModel>();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);

                LstSprint = cd_pro.ConsultaResumenSprints(IdProyecto, Conexion).Where(w=> Estatus.Contains(w.Estatus2)).ToList();
                List <GanttModel> Gantt = FuncionesGenerales.ConvierteGantt_Sprints(LstSprint);



                Resultado["Exito"] = true;
                Resultado["Sprints"] = JsonConvert.SerializeObject(LstSprint);
                Resultado["Gantt"] = JsonConvert.SerializeObject(Gantt);
                //Resultado["Backlog"] = Backlog;
                return Content(Resultado.ToString());

            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }
        }

        public ActionResult ConsultarSprintsUsuario(long IdUsuario)
        {
            var Resultado = new JObject();
            try
            {
                CD_Proyecto cd_pro = new CD_Proyecto();
                List<ProyectoIteracionModel> LstSprint = new List<ProyectoIteracionModel>();
                List<ActividadesModel> LstBacklog = new List<ActividadesModel>();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                string Conexion = Encripta.DesencriptaDatos(Usuario.ConexionSP);

                LstSprint = cd_pro.ConsultaResumenSprintsUsuario(IdUsuario == -1 ?Usuario.IdUsuario : IdUsuario, Conexion);
                List<GanttModel> Gantt = FuncionesGenerales.ConvierteGantt_Sprints(LstSprint);


                Resultado["Exito"] = true;
                Resultado["Sprints"] = JsonConvert.SerializeObject(LstSprint);
                Resultado["Gantt"] = JsonConvert.SerializeObject(Gantt);

                return Content(Resultado.ToString());

            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }
        }
        public ActionResult ConsultarSprintsCompartidos()
        {
            var Resultado = new JObject();
            try
            {
                CD_Proyecto cd_pro = new CD_Proyecto();
                List<ProyectoIteracionModel> LstSprint = new List<ProyectoIteracionModel>();
       
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;


                LstSprint = cd_pro.ConsultaResumenSprintsCompartidos(Usuario.IdUsuario, Encripta.DesencriptaDatos(Usuario.ConexionSP));


                Resultado["Exito"] = true;
                Resultado["Sprints"] = JsonConvert.SerializeObject(LstSprint);
  

                return Content(Resultado.ToString());

            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }
        }


        public ActionResult FiltrarBacklog(long IdProyecto, string Busqueda)
        {
            var Resultado = new JObject();
            try
            {
                CD_Proyecto cd_pro = new CD_Proyecto();
                List<ProyectoIteracionModel> LstSprint = new List<ProyectoIteracionModel>();
                List<ActividadesModel> LstBacklog = new List<ActividadesModel>();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                //LstSprint = cd_pro.ConsultaSprints(IdProyecto, Conexion);
                //string Sprints = FuncionesGenerales.ConvierteSprints(LstSprint);
                LstBacklog = cd_pro.ConsultaBacklogFiltro(IdProyecto, Busqueda, Conexion);
                string Backlog = FuncionesGenerales.ConvierteBacklog(LstBacklog);



                Resultado["Exito"] = true;
                Resultado["Backlog"] = Backlog;
                return Content(Resultado.ToString());

            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }
        }

        public ActionResult AsignaActividadSprint(long IdActividad, long IdIteracion)
        {
            var Resultado = new JObject();
            try
            {
                CD_Proyecto cd_pro = new CD_Proyecto();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                bool Exito = cd_pro.AsignaActividad(IdActividad, IdIteracion, Conexion);
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

        public ActionResult CargarComboSprints(List<long> LstProyectos)
        {

            var resultado = new JObject();
            try
            {
                CD_Proyecto cd_pro = new CD_Proyecto();
                List<CatalogoGeneralModel> LstSprints = new List<CatalogoGeneralModel>();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                LstSprints = cd_pro.ComboSprints(LstProyectos ?? new List<long>(), Conexion);

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


        public ActionResult ConsultarSprintsWS(long IdWorkSpaceTab,FiltrosModel Filtros)
        {
            var Resultado = new JObject();
            try
            {
                CD_Proyecto cd_pro = new CD_Proyecto();
                List<ProyectoIteracionModel> LstSprint = new List<ProyectoIteracionModel>();
                List<ActividadesModel> LstBacklog = new List<ActividadesModel>();
                CD_Workspace cd_ws = new CD_Workspace();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                string Conexion = Encripta.DesencriptaDatos(Usuario.ConexionSP);

                LstSprint = cd_pro.ConsultaResumenSprints(Filtros.IdProyecto, Conexion).Where(w => Filtros.LstEstatus.Contains(w.Estatus2)).ToList();
                //List<GanttModel> Gantt = FuncionesGenerales.ConvierteGantt_Sprints(LstSprint);
                string filters = JsonConvert.SerializeObject(Filtros);
                bool Exito = cd_ws.GuardaFiltrosTab(IdWorkSpaceTab, filters, Encripta.DesencriptaDatos(Usuario.ConexionEF));

                Resultado["Exito"] = true;
                Resultado["Sprints"] = JsonConvert.SerializeObject(LstSprint);
                //Resultado["Gantt"] = JsonConvert.SerializeObject(Gantt);
                //Resultado["Backlog"] = Backlog;
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

        #region Actividades

        public ActionResult CargaCombosFiltros(long IdProyecto)
        {

            var resultado = new JObject();
            try
            {

                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                CD_CatalogoGeneral cd_CatGenral = new CD_CatalogoGeneral();
                CD_Proyecto cd_pro = new CD_Proyecto();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                List<CatalogoGeneralModel> LstTipoAct = cd_CatGenral.ObtenerCatalogoGeneral(2, Conexion);
                List<CatalogoGeneralModel> LstUsuarios = cd_pro.ConsultaUsuariosProyectoCombo(IdProyecto, Conexion);
                List<CatalogoGeneralModel> LstLideres = cd_CatGenral.ObtenerLideres(Usuario, Conexion);
                List<CatalogoGeneralModel> LstClasificacion = cd_CatGenral.ObtenerCatalogoGeneral(5, Conexion);
                List<CatalogoGeneralModel> LstSprint = cd_pro.ComboSprintsProyecto(IdProyecto, Conexion);


                resultado["Exito"] = true;

                resultado["LstTipoAct"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlComboxMultiple(LstTipoAct);
                resultado["LstUsuarios"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlComboxMultiple(LstUsuarios);
                resultado["LstLideres"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlComboxMultiple(LstLideres);
                resultado["LstClasificacion"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlComboxMultiple(LstClasificacion);
                resultado["LstSprints"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlComboxMultiple(LstSprint);

                return Content(resultado.ToString());



            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
                return Content(resultado.ToString());
            }

        }

        public ActionResult ObtieneActividades(FiltrosModel Filtros)
        {

            var Resultado = new JObject();
            try
            {
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                Filtros.IdUsuario = Usuario.IdUsuario;

                //List<long> LstProyectos = new List<long>();
                //LstProyectos.Add(Filtros.IdProyecto);
                //Filtros.LstProyecto = LstProyectos;

                CD_Proyecto cd_pro = new CD_Proyecto();
                List<ActividadesModel> LstActividades = new List<ActividadesModel>();
                List<ActividadesModel> LstActividadesEnc = new List<ActividadesModel>();
                List<ActividadesModel> LstActividadesReq = new List<ActividadesModel>();
                List<ActividadesModel> LstActividadesSprint = new List<ActividadesModel>();
                List<ActividadesModel> LstActividadesRecurso = new List<ActividadesModel>();

                //string conexion = ConfigurationManager.ConnectionStrings["BDProductividad"].ToString();
                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);

                // LstActividadesEnc = cd_act.ObtieneEncActividades(Filtros.IdProyecto, conexion);
                cd_pro.ProyectoActividades(Filtros, ref LstActividades, ref LstActividadesEnc, ref LstActividadesReq, ref LstActividadesSprint, ref LstActividadesRecurso, conexion);


                string ActividadesA = FuncionesGenerales.ConvierteListaTareasV2(LstActividades, "A");
                string ActividadesP = FuncionesGenerales.ConvierteListaTareasV2(LstActividades, "P");
                string ActividadesR = FuncionesGenerales.ConvierteListaTareasV2(LstActividades, "V");
                ActividadesR += FuncionesGenerales.ConvierteListaTareasV2(LstActividades, "R");
                string ActividadesX = FuncionesGenerales.ConvierteListaTareasV2(LstActividades, "X");
                string ActividadesL = FuncionesGenerales.ConvierteListaTareasV2(LstActividades, "L");




                Resultado["Exito"] = true;
                Resultado["ActividadesEnc"] = JsonConvert.SerializeObject(LstActividadesEnc);
                Resultado["ActividadesReq"] = JsonConvert.SerializeObject(LstActividadesReq);
                Resultado["ActividadesSprint"] = JsonConvert.SerializeObject(LstActividadesSprint);
                Resultado["ActividadesRecurso"] = JsonConvert.SerializeObject(LstActividadesRecurso);
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




                return Content(Resultado.ToString());
            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }


        }

        public ActionResult ActualizaEstatusActividadCte(ActividadesModel Actividad)
        {
            var Resultado = new JObject();
            try
            {
                CD_Actividad cd_act = new CD_Actividad();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                bool Exito = cd_act.ActualizaEstatusCliente(Actividad, Conexion);

                Resultado["Exito"] = Exito;
                return Content(Resultado.ToString());

            }
            catch (Exception ex)
            {
                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }
        }

        public ActionResult ObtieneDependencias(FiltrosModel Filtros)
        {
            var Resultado = new JObject();
            try
            {
                Filtros.Tipo = 0;
                CD_Proyecto cd_pro = new CD_Proyecto();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);

                List<ActividadesModel> LstEnc = new List<ActividadesModel>();
                List<ActividadesModel> LstDet = new List<ActividadesModel>();

                cd_pro.ObtieneDependencias(Filtros, ref LstEnc, ref LstDet, Conexion);

                Resultado["Exito"] = true;
                Resultado["LstEnc"] = JsonConvert.SerializeObject(LstEnc);
                Resultado["LstDet"] = JsonConvert.SerializeObject(LstDet);
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

        #region Costos
        public ActionResult CargaInicialCosto(long IdProyecto)
        {
            var resultado = new JObject();
            try
            {
                CD_Proyecto cd_proy = new CD_Proyecto();
                CD_CatalogoGeneral cd_CatGenral = new CD_CatalogoGeneral();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                List<CatalogoGeneralModel> LstUsuarios = cd_proy.ConsultaUsuariosProyectoCombo(IdProyecto, Conexion);
                List<CatalogoGeneralModel> LstTipoAct = cd_CatGenral.ObtenerCatalogoGeneral(2, Conexion);


                resultado["Exito"] = true;
                resultado["LstUsuarios"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(LstUsuarios);
                resultado["LstFases"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(LstTipoAct);


                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

                return Content(resultado.ToString());
            }

        }
        //public ActionResult GuardarCosto(ProyectoCDModel Costo)
        //{

        //    var Resultado = new JObject();
        //    try
        //    {


        //        CD_Proyecto cd_pro = new CD_Proyecto();
        //        Costo.IdUCreo = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.IdUsuario;
        //        string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
        //        int Respuesta = cd_pro.GuardaCostoDirecto(Costo, Conexion);

        //        Resultado["Exito"] = Respuesta == 1 ? true : false;
        //        Resultado["Mensaje"] = Respuesta == 1 ? Mensajes.MensajeGuardadoExito() : "Ya existe un proyecto registrado con la misma clave.";

        //        return Content(Resultado.ToString());

        //    }
        //    catch (Exception ex)
        //    {

        //        Resultado["Exito"] = false;
        //        Resultado["Mensaje"] = ex.Message;

        //        return Content(Resultado.ToString());
        //    }

        //}

        public ActionResult ConsultaCostos(long IdProyecto)
        {
            var resultado = new JObject();
            try
            {
                CD_Proyecto cd_proy = new CD_Proyecto();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                List<ProyectoCDModel> LstCosto = cd_proy.ConsultaCostosDirectosProyecto(IdProyecto, Conexion);
                List<ProyectoCIModel> LstCostoInd = cd_proy.ConsultaCostosIndirectosProyecto(IdProyecto, Conexion);
                var costos = cd_proy.CargarCostoStats(IdProyecto, Conexion);


                resultado["Costos"] = JsonConvert.SerializeObject(costos);
                resultado["Exito"] = true;
                resultado["LstCostoDirecto"] = JsonConvert.SerializeObject(LstCosto.ToList());
                resultado["LstCostoIndirecto"] = JsonConvert.SerializeObject(LstCostoInd);
                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

                return Content(resultado.ToString());
            }

        }
        public ActionResult ConsultaCosto(long IdProyectoCD)
        {
            var resultado = new JObject();
            try
            {
                CD_Proyecto cd_proy = new CD_Proyecto();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                ProyectoCDModel Costo = cd_proy.ConsultaCostoDirectoProyecto(IdProyectoCD, Conexion);

                resultado["Exito"] = true;
                resultado["Costo"] = JsonConvert.SerializeObject(Costo);

                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

                return Content(resultado.ToString());
            }

        }

        public ActionResult ImportaCostoPlaneado(HttpPostedFileBase Archivo, long IdProyecto)
        {

            var resultado = "";
            try
            {
                var idUsuarioLogin = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.IdUsuario;
                string Mensaje = string.Empty;
                if (FuncionesGenerales.ValidaPermisos(1))
                {


                    // return Content(resultado.ToString());
                    List<ProyectoCDModel> LstCostos = new List<ProyectoCDModel>();

                    Mensaje = LeeArchivoCosto(Archivo, ref LstCostos);

                    if (Mensaje == string.Empty)
                    {
                        CD_Proyecto cd_pro = new CD_Proyecto();
                        string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                        Mensaje = cd_pro.GuardaImportacionCosto(LstCostos, idUsuarioLogin, IdProyecto, Conexion);
                    }
                }
                else
                {

                    Mensaje = Mensajes.MensajePermisoGuardar();
                }

                resultado = Mensaje;
                return Content(resultado.ToString());

            }
            catch (Exception)
            {

                resultado = "A|Error al leer el documento, por favor verifique que el documento es el correcto.";
                return Content(resultado.ToString());
            }

        }
        private string LeeArchivoCosto(HttpPostedFileBase ProcesaArchivo, ref List<ProyectoCDModel> LstCosto)
        {
            try
            {


                using (var package = new ExcelPackage(ProcesaArchivo.InputStream))
                {

                    ExcelWorksheet worksheet = package.Workbook.Worksheets[1];


                    ExcelCellAddress startCell = worksheet.Dimension.Start;
                    ExcelCellAddress endCell = worksheet.Dimension.End;


                    ProyectoCDModel c;
                    for (int row = startCell.Row + 1; row <= endCell.Row; row++)
                    {
                        c = new ProyectoCDModel();

                        object val = worksheet.Cells[row, 1].Value;
                        if (val != null)
                        {

                            c.CveTipoActividad = worksheet.Cells[row, 1].Value.ToString().Trim().ToUpper();
                            c.Nombre = worksheet.Cells[row, 2].Value.ToString().Trim().ToUpper();




                            decimal porcd = 0;

                            bool validaporcd = decimal.TryParse(worksheet.Cells[row, 3].Value.ToString(), out porcd);

                            if (!validaporcd)
                            {

                                return "A|El valor " + worksheet.Cells[row, 3].Value.ToString() + " de la columna %Dedicado no es un dato númerico válido (línea " + row.ToString() + ").";
                            }

                            if (porcd > 100 || porcd < 0)
                            {
                                return "A|El valor " + worksheet.Cells[row, 3].Value.ToString() + " de la columna %Dedicado no es un dato válido ya que no puede ser mayor a 100 ni menor a 0 (línea " + row.ToString() + ").";
                            }

                            c.PorcDedicado = porcd;


                            decimal costom = 0;

                            bool validacostom = decimal.TryParse(worksheet.Cells[row, 4].Value.ToString(), out costom);

                            if (!validacostom)
                            {

                                return "A|El valor " + worksheet.Cells[row, 4].Value.ToString() + " de la columna CostoMensual no es un dato númerico válido (línea " + row.ToString() + ").";
                            }

                            c.CostoMensual = costom;

                            int dias = 0;

                            bool validadias = int.TryParse(worksheet.Cells[row, 5].Value.ToString(), out dias);

                            if (!validadias)
                            {

                                return "A|El valor " + worksheet.Cells[row, 5].Value.ToString() + " de la columna Dias no es un dato númerico válido (línea " + row.ToString() + ").";
                            }

                            c.Dias = dias;


                            DateTime FechaInicio;
                            var valor = worksheet.Cells[row, 6].Value;

                            try
                            {
                                FechaInicio = DateTime.Parse((valor.ToString()));

                            }
                            catch (Exception)
                            {

                                return "A|El valor " + worksheet.Cells[row, 6].Value.ToString() + " de la columna fecha inicio no es una fecha válida (línea " + row.ToString() + ").";
                            }


                            c.FechaInicio = FechaInicio;

                            DateTime FechaFin;
                            var valors = worksheet.Cells[row, 7].Value;

                            try
                            {
                                FechaFin = DateTime.Parse((valors.ToString()));

                            }
                            catch (Exception)
                            {

                                return "A|El valor " + worksheet.Cells[row, 7].Value.ToString() + " de la columna fecha fin no es una fecha válida (línea " + row.ToString() + ").";
                            }

                            c.FechaFin = FechaFin;

                            LstCosto.Add(c);



                        }
                    }

                }


                return string.Empty;

            }
            catch (Exception)
            {
                return "A|Error al leer el documento, por favor verifique que el documento es el correcto.";


            }
        }

        public ActionResult GuardarCostoIndirecto(ProyectoCIModel Costo)
        {

            var Resultado = new JObject();
            try
            {


                CD_Proyecto cd_pro = new CD_Proyecto();
                Costo.IdUCreo = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.IdUsuario;
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                int Respuesta = cd_pro.GuardaCostoIndirecto(Costo, Conexion);

                Resultado["Exito"] = Respuesta == 1 ? true : false;
                Resultado["Mensaje"] = Respuesta == 1 ? Mensajes.MensajeGuardadoExito() : "Ya existe un proyecto registrado con la misma clave.";

                return Content(Resultado.ToString());

            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }

        }
        public ActionResult ConsultaCostoIndirecto(long IdProyectoCI)
        {
            var resultado = new JObject();
            try
            {
                CD_Proyecto cd_proy = new CD_Proyecto();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                ProyectoCIModel Costo = cd_proy.ConsultaCostoInDirectoProyecto(IdProyectoCI, Conexion);

                resultado["Exito"] = true;
                resultado["Costo"] = JsonConvert.SerializeObject(Costo);

                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

                return Content(resultado.ToString());
            }

        }

        public ActionResult ActualizaCosto(ProyectosModel Proyecto)
        {
            var Resultado = new JObject();
            try
            {


                CD_Proyecto cd_pro = new CD_Proyecto();

                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                int Respuesta = cd_pro.GuardarCosto(Proyecto, Conexion);

                Resultado["Exito"] = Respuesta == 1 ? true : false;
                Resultado["Mensaje"] = Respuesta == 1 ? Mensajes.MensajeGuardadoExito() : "Error al actualizar el costo del proyecto.";

                return Content(Resultado.ToString());

            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }

        }


        public ActionResult CalcularCostoRecurso(ProyectoCDCalculoModel datos)
        {
            try
            {
                var (trabajado, costo) = cd_Proyecto.CalcularCostoRecurso(datos, conexionEF);

                return Json(new { Exito = true, Trabajado = trabajado, Costo = costo });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult GuardarCostoPlaneado(long idProyecto, decimal costo)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Editar))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoGuardar() });

                var (estatus, mensaje) = cd_Proyecto.GuardarCostoPlaneado(idProyecto, costo, idUsuario, conexionEF);

                return Json(new { Exito = true, Mensaje = mensaje });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult GuardarCostoDirecto(List<ProyectoCDNuevoModel> costos)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Crear))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoGuardar() });

                var (estatus, mensaje) = cd_Proyecto.GuardarCostoDirecto(costos, idUsuario, conexionEF);

                return Json(new { Exito = true, Mensaje = mensaje });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult EditarCostoDirecto(ProyectoCDModel costo)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Editar))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoGuardar() });

                var (estatus, mensaje) = cd_Proyecto.EditarCostoDirecto(costo, idUsuario, conexionEF);

                return Json(new { Exito = true, Mensaje = mensaje });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult AplicarCostoMasivo(List<long> id)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Editar))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoGuardar() });

                if (id == null || id.Count == 0) return Json(new { Exito = true, Mensaje = "Debe elegir al menos un registro." });
                var (estatus, mensaje) = cd_Proyecto.AplicarCostoMasivo(id, idUsuario, conexionEF);

                return Json(new { Exito = true, Mensaje = mensaje });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult GuardarCostoDirectoDetalle(ProyectoCDModel costo)
        {
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(Permiso.Editar))
                    return Json(new { Exito = false, Mensaje = Mensajes.MensajePermisoGuardar() });

                var (estatus, mensaje) = cd_Proyecto.GuardarCostoDirectoDetalle(costo, idUsuario, conexionEF);

                return Json(new { Exito = true, Mensaje = mensaje });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult DescargarExcelCD(long idProyecto)
        {
            try
            {
                var _costos = cd_Proyecto.ConsultaCostosDirectosProyecto(idProyecto, conexionEF);
                var costos = ObtenerObjetoDescargaCD(_costos);
                var tabla = FuncionesGenerales.CrearTabla(costos, "Costos");
                var excel = Reportes.CrearExcel(tabla);

                return File(excel, MimeType.XLSX, "Costos.xlsx");
            }
            catch (Exception e)
            {
                Response.StatusCode = 400;
                Response.StatusDescription = e.Message;
                return Content(e.Message);
            }
        }

        private object ObtenerObjetoDescargaCD(List<ProyectoCDModel> costos)
        {
            return
                costos.Select(x => new
                {
                    x.Nombre,
                    x.Fase,
                    Aplicado = x.Aplicado ? "Sí" : "No",
                    x.FechaInicio,
                    x.FechaFin,
                    Dedicado = x.PorcDedicado > 0 ? (x.PorcDedicado + " %") : x.HorasInvertidas > 0 ? (x.HorasInvertidas + " horas") : "-",
                    x.CostoPeriodo
                }).OrderBy(x => x.Nombre).ThenBy(x => x.FechaInicio).ToList();
        }

        public ActionResult DescargarExcelCI(long idProyecto)
        {
            try
            {
                var _costos = cd_Proyecto.ConsultaCostosIndirectosProyecto(idProyecto, conexionEF);
                var costos = ObtenerObjetoDescargaCI(_costos);
                var tabla = FuncionesGenerales.CrearTabla(costos, "Costos");
                var excel = Reportes.CrearExcel(tabla);

                return File(excel, MimeType.XLSX, "Costos.xlsx");
            }
            catch (Exception e)
            {
                Response.StatusCode = 400;
                Response.StatusDescription = e.Message;
                return Content(e.Message);
            }
        }

        private object ObtenerObjetoDescargaCI(List<ProyectoCIModel> costos)
        {
            return
                costos.Select(x => new
                {
                    x.Concepto,
                    x.Fase,
                    x.Fecha,
                    x.Monto
                }).OrderBy(x => x.Concepto).ThenBy(x => x.Fecha).ToList();
        }

        public ActionResult InformeCostos()
        {
            Session["Controlador" + Session.SessionID] = "Proyectos";
            if (!FuncionesGenerales.SesionActiva())
                return RedirectToAction("Index", "Home");


            if (!FuncionesGenerales.ValidaPermisos(0))
            {
                return RedirectToAction("Unauthorized", "ERROR");

            }

            return View();
        }

        public ActionResult ObtenerReporteCostos(List<long> proyectos, DateTime inicio, DateTime fin)
        {
            try
            {
                var informe = cd_Proyecto.ObtenerReporteCostos(proyectos, inicio, fin, conexionEF);

                return Json(new { Exito = true, Informe = informe });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult ObtenerReporteCostosCD(long idProyecto, DateTime inicio, DateTime fin)
        {
            try
            {
                var informe = cd_Proyecto.ObtenerReporteCostosCD(idProyecto, inicio, fin, conexionEF);

                return Json(new { Exito = true, Reporte = informe });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult ObtenerReporteCostosCI(long idProyecto, DateTime inicio, DateTime fin)
        {
            try
            {
                var informe = cd_Proyecto.ObtenerReporteCostosCI(idProyecto, inicio, fin, conexionEF);

                return Json(new { Exito = true, Reporte = informe });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult DescargarExcelInformeCostoDetalle(long idProyecto, DateTime inicio, DateTime fin, string tipo)
        {
            try
            {
                var datos =
                    tipo == "d" ?
                    cd_Proyecto.ObtenerReporteCostosCD(idProyecto, inicio, fin, conexionEF) :
                    cd_Proyecto.ObtenerReporteCostosCI(idProyecto, inicio, fin, conexionEF);
                var tabla = FuncionesGenerales.CrearTabla(datos, "Detalle");
                var excel = Reportes.CrearExcel(tabla);

                return File(excel, MimeType.XLSX, "Detalle.xlsx");
            }
            catch (Exception e)
            {
                Response.StatusCode = 400;
                Response.StatusDescription = e.Message;
                return Content(e.Message);
            }
        }


        #endregion

        #region Gannt
        public ActionResult ConsultaGannt(long IdProyecto)
        {
            var resultado = new JObject();
            try
            {
                CD_Proyecto cd_pro = new CD_Proyecto();
                List<GanttModel> LstGannt = new List<GanttModel>();

                //string conexion = ConfigurationManager.ConnectionStrings["BDProductividad"].ToString();
                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
                //LstGannt = cd_pro.ConsultaGannt(IdProyecto, conexion);
                //string Gannt = FuncionesGenerales.ConvierteXmlGannt(LstGannt);

                resultado["Exito"] = true;
                resultado["Gannt"] = JsonConvert.SerializeObject(LstGannt);
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


        #region FlujoPagos

        //[Route("Proyectos/$")]
        public ActionResult FlujoPagos() {

            ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
            Session["Accion" + Session.SessionID] = "FlujoPagos";

            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }




            if (!FuncionesGenerales.ValidaPermisosAccion(0))
            {
                return RedirectToAction("Unauthorized", "ERROR");


            }


            CD_CatalogoGeneral cd_gen = new CD_CatalogoGeneral();
            var Conexion  = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

            
            List<CatalogoGeneralModel> LstAnios = cd_gen.ObtenerAnios(conexionEF);



            ViewBag.LstAnios = LstAnios;
            ViewBag.Anio = DateTime.Now.Year;

            //if (!FuncionesGenerales.ValidaPermisos(0))
            //{
            //    return RedirectToAction("Index", "Home");

            //}
            return View();
        }
        [Route("FlujoPago/{Id}")]
        public ActionResult DetallePagos(long Id)
        {

            ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
            Session["Accion" + Session.SessionID] = "FlujoPagos";

            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }

            if (!FuncionesGenerales.ValidaPermisosAccion(0))
            {
                return RedirectToAction("Unauthorized", "ERROR");

            }


            var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
            CD_CatalogoGeneral cd_CatGenral = new CD_CatalogoGeneral();
            string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);



            List<CatalogoGeneralModel> LstProyectos = cd_CatGenral.ObtenerProyectosPorUsuarioTODOS(Usuario, Conexion);

            ViewBag.IdFlujo = Id;
            ViewBag.LstProyectos = LstProyectos;

            return View();
        }

        public ActionResult ObtieneFlujoPagos(int Anio, int TipoFecha, bool Archivado) 
        {
            var Resultado = new JObject();
            try
            {

                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }


                CD_Proyecto cd_pro = new CD_Proyecto();
                var Usuario  = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                List<FlujoPagoModel> LstFlujo = new List<FlujoPagoModel>();
             


                LstFlujo = cd_pro.ObtieneFlujoPagos(Anio, TipoFecha,  Usuario.IdUsuario, Archivado, Usuario.IdTipoUsuario,  Encripta.DesencriptaDatos(Usuario.ConexionSP));
     

                Resultado["Exito"] = true;
                Resultado["LstFlujo"] = JsonConvert.SerializeObject(LstFlujo);
     
                return Content(Resultado.ToString());

            }
            catch (Exception ex)
            {
                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }

        }
        public ActionResult ObtieneFlujoPagosMes(int Anio,int Mes,int IdProyecto, int TipoFecha, bool Archivado)
        {
            var Resultado = new JObject();
            try
            {

                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }


                CD_Proyecto cd_pro = new CD_Proyecto();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                List<FlujoPagoDetModel> LstFlujo = new List<FlujoPagoDetModel>();



                LstFlujo = cd_pro.ObtienePagosMes(Anio,Mes, IdProyecto, TipoFecha,  Usuario.IdUsuario, Archivado, Usuario.IdTipoUsuario, Encripta.DesencriptaDatos(Usuario.ConexionSP));


                Resultado["Exito"] = true;
                Resultado["LstFlujoMes"] = JsonConvert.SerializeObject(LstFlujo);

                return Content(Resultado.ToString());

            }
            catch (Exception ex)
            {
                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }

        }
        public ActionResult ObtieneFlujoDetalle(int IdFlujo) {
            //TO-DO Migrar to react
            var Resultado = new JObject();
            try
            {

                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }


                CD_Proyecto cd_pro = new CD_Proyecto();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                FlujoPagoModel Flujo = new FlujoPagoModel();
                ProyectosModel pro = new ProyectosModel();



                Flujo = cd_pro.ConsultaFlujo(IdFlujo, Encripta.DesencriptaDatos(Usuario.ConexionEF));
                pro = cd_pro.ConsultaIndicadores(Flujo.IdProyecto, Encripta.DesencriptaDatos(Usuario.ConexionSP));


                Resultado["Exito"] = true;
                Resultado["Indicadores"] = JsonConvert.SerializeObject(pro);
                Resultado["Flujo"] = JsonConvert.SerializeObject(Flujo);

                return Content(Resultado.ToString());

            }
            catch (Exception ex)
            {
                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }



        }


        public ActionResult GuardaFlujoPago(FlujoPagoModel Flujo) {

            var Resultado = new JObject();
            try
            {

                Session["Accion" + Session.SessionID] = "FlujoPagos";

                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }


                if (!FuncionesGenerales.ValidaPermisosAccion(1))
                {
                    Resultado["Exito"] = false;
                    Resultado["Mensaje"] = "Los tiene permisos para guardar.";
                    return Content(Resultado.ToString());

                }


                CD_Proyecto cd_pro = new CD_Proyecto();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;


                long Respuesta = 0;

                Respuesta = cd_pro.GuardarFlujoPago(Flujo,  Usuario.IdUsuario, Encripta.DesencriptaDatos(Usuario.ConexionEF));

        

                Resultado["Exito"] = true;
                Resultado["Mensaje"] = "Los datos se guardaron correctemente";
                Resultado["Respuesta"] = Respuesta;


                return Content(Resultado.ToString());

            }
            catch (Exception ex)
            {
                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }


        }
        public ActionResult GuardaFlujoPagoDetalle(FlujoPagoDetModel Flujo)
        {

            var Resultado = new JObject();
            try
            {
             
                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }

                Session["Accion" + Session.SessionID] = "FlujoPagos";
                if (!FuncionesGenerales.ValidaPermisosAccion(1))
                {
                    Resultado["Exito"] = false;
                    Resultado["Mensaje"] = "Los tiene permisos para guardar.";
                    return Content(Resultado.ToString());

                }


                CD_Proyecto cd_pro = new CD_Proyecto();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;


                int Respuesta = 0;

                Respuesta = cd_pro.GuardarDetalleFlujo(Flujo, Usuario.IdUsuario, Encripta.DesencriptaDatos(Usuario.ConexionEF));



                Resultado["Exito"] = true;
                Resultado["Mensaje"] = "Los datos se guardaron correctamente";
                Resultado["Respuesta"] = Respuesta;


                return Content(Resultado.ToString());

            }
            catch (Exception ex)
            {
                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }


        }
        public ActionResult GuardaFlujoPagoDetalles(IEnumerable<FlujoPagoDetModel> Flujos)
        {

            var Resultado = new JObject();
            try
            {
             
                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }

                Session["Accion" + Session.SessionID] = "FlujoPagos";
                if (!FuncionesGenerales.ValidaPermisosAccion(1))
                {
                    Resultado["Exito"] = false;
                    Resultado["Mensaje"] = "Los tiene permisos para guardar.";
                    return Content(Resultado.ToString());

                }


                CD_Proyecto cd_pro = new CD_Proyecto();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;


                int Respuesta = 0;

                Respuesta = cd_pro.GuardarDetallesFlujo(Flujos, Usuario.IdUsuario, Encripta.DesencriptaDatos(Usuario.ConexionEF));



                Resultado["Exito"] = true;
                Resultado["Mensaje"] = "Los datos se guardaron correctamente";
                Resultado["Respuesta"] = Respuesta;


                return Content(Resultado.ToString());

            }
            catch (Exception ex)
            {
                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }


        }


        public ActionResult EliminarFlujoPagoDetalle(long IdFlujoPagoDet)
        {

            var Resultado = new JObject();
            try
            {
                Session["Accion" + Session.SessionID] = "FlujoPagos";
                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }


                if (!FuncionesGenerales.ValidaPermisosAccion(4))
                {
                    Resultado["Exito"] = false;
                    Resultado["Mensaje"] = "Los tiene permisos para eliminar.";
                    return Content(Resultado.ToString());

                }


                CD_Proyecto cd_pro = new CD_Proyecto();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;


               

                 bool   Exito= cd_pro.EliminarDetalleFlujo(IdFlujoPagoDet, Encripta.DesencriptaDatos(Usuario.ConexionEF));



                Resultado["Exito"] = Exito;
                Resultado["Mensaje"] = "Los datos se guardaron correctamente";
    


                return Content(Resultado.ToString());

            }
            catch (Exception ex)
            {
                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }


        }


        public ActionResult GuardaFlujoPagoFecha(FlujoPagoDetModel Flujo)
        {

            var Resultado = new JObject();
            try
            {

                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }


                //if (!FuncionesGenerales.ValidaPermisos(1))
                //{
                //    Resultado["False"] = true;
                //    Resultado["Mensaje"] = "No tiene permisos para guardar flujo de pagos";

                //}


                CD_Proyecto cd_pro = new CD_Proyecto();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;


                int Respuesta = 0;

                Respuesta = cd_pro.GuardarFlujoPagoFechas(Flujo, Usuario.IdUsuario, Encripta.DesencriptaDatos(Usuario.ConexionEF));



                Resultado["Exito"] = true;
                Resultado["Mensaje"] = "Los datos se guardaron correctamente";
                Resultado["Respuesta"] = Respuesta;


                return Content(Resultado.ToString());

            }
            catch (Exception ex)
            {
                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }


        }


        public ActionResult DescargarExcelFlujoPagos(int Anio, int TipoFecha, bool Archivado)
        {
            try
            {

                CD_Proyecto cd_pro = new CD_Proyecto();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                List<FlujoPagoModel> LstFlujo = new List<FlujoPagoModel>();



                LstFlujo = cd_pro.ObtieneFlujoPagos(Anio, TipoFecha, Usuario.IdUsuario, Archivado, Usuario.IdTipoUsuario, Encripta.DesencriptaDatos(Usuario.ConexionSP));
                var flujo = ObtenerObjetoDescargaFlujo(LstFlujo);
                var tabla = FuncionesGenerales.CrearTabla(flujo, "Flujo de pagos " + Anio.ToString());
                var excel = Reportes.CrearExcel(tabla);

                return File(excel, MimeType.XLSX, "FlujoPagos" + Anio.ToString() +  ".xlsx");
            }
            catch (Exception e)
            {
                Response.StatusCode = 400;
                Response.StatusDescription = e.Message;
                return Content(e.Message);
            }
        }

        private object ObtenerObjetoDescargaFlujo(List<FlujoPagoModel> flujo)
        {
            return
                flujo.Select(x => new
                {
                    x.ClaveProy,
                    x.NombreProy,
                    x.Cliente,
                    x.Lider,
                    x.TotalProyecto,
                    x.TotalFacturado,
                    x.TotalPagado,
                    x.Saldo,
                    x.Ene,
                    x.Feb,
                    x.Mar,
                    x.Abr,
                    x.May,
                    x.Jun,
                    x.Jul,
                    x.Ago,
                    x.Sep,
                    x.Oct,
                    x.Nov,
                    x.Dic,
                  
                   
                }).OrderByDescending(x => x.ClaveProy).ToList();
        }


        public ActionResult DescargarExcelFlujoPagosDetalle(int IdFlujo)
        {
            try
            {

                CD_Proyecto cd_pro = new CD_Proyecto();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
            

                FlujoPagoModel Flujo = new FlujoPagoModel();

                Flujo = cd_pro.ConsultaFlujo(IdFlujo, Encripta.DesencriptaDatos(Usuario.ConexionEF));

            
                var flujo = ObtenerObjetoDescargaFlujoDetalle(Flujo.FlujoDetalle);
                var tabla = FuncionesGenerales.CrearTabla(flujo, "Flujo de pagos " + Flujo.ClaveProy);
                var excel = Reportes.CrearExcel(tabla);

                return File(excel, MimeType.XLSX, "FlujoPagos " + Flujo.ClaveProy + ".xlsx");
            }
            catch (Exception e)
            {
                Response.StatusCode = 400;
                Response.StatusDescription = e.Message;
                return Content(e.Message);
            }
        }


        private object ObtenerObjetoDescargaFlujoDetalle(List<FlujoPagoDetModel> flujo)
        {
            return
                flujo.Select(x => new
                {
                    x.Secuencia,
                    x.Concepto,
                    x.Procentaje,
                    x.FechaDevOriginal,
                    x.FechaDev,
                    x.FechaFactura,
                    x.Factura,
                    x.FechaProgramadaPago,
                    x.FechaPagoReal,
                    x.Amortizadas,
                    x.Horas,
                    x.Monto,
                    x.IVA,
                    x.Total
                }).OrderBy(o=> o.Secuencia).ToList();
        }


        public ActionResult DescargaExcelFlujoPagosMes(int Anio, int Mes, int IdProyecto, int TipoFecha, bool Archivado)
        {
         
            try
            {

                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }


                CD_Proyecto cd_pro = new CD_Proyecto();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                List<FlujoPagoDetModel> LstFlujo = new List<FlujoPagoDetModel>();



                LstFlujo = cd_pro.ObtienePagosMes(Anio, Mes, IdProyecto, TipoFecha, Usuario.IdUsuario, Archivado, Usuario.IdTipoUsuario, Encripta.DesencriptaDatos(Usuario.ConexionSP));

                var flujo = ObtenerObjetoDescargaFlujoMes(LstFlujo);
                var tabla = FuncionesGenerales.CrearTabla(flujo, "Flujo de pagos " + Mes.ToString() + "-"  +  Anio.ToString());
                var excel = Reportes.CrearExcel(tabla);

                return File(excel, MimeType.XLSX, "FlujoPagos " + Mes.ToString() + "-" + Anio.ToString() + ".xlsx");

            }
            catch (Exception e)
            {
                Response.StatusCode = 400;
                Response.StatusDescription = e.Message;
                return Content(e.Message);
            }

        }
        private object ObtenerObjetoDescargaFlujoMes(List<FlujoPagoDetModel> flujo)
        {
            return
                flujo.Select(x => new
                {
                    x.Proyecto,
                    x.Secuencia,
                    x.Concepto,
                    x.Procentaje,
                    x.FechaDevOriginal,
                    x.FechaDev,
                    x.FechaFactura,
                    x.Factura,
                    x.FechaProgramadaPago,
                    x.FechaPagoReal,
                    x.Horas,
                    x.Monto,
                    x.IVA,
                    x.Total
                }).OrderByDescending(x => x.FechaDev).ToList();
        }


        #endregion

        #region Costos2

        //Seccion de proyecto

        public ActionResult ConsultaCostosV2(long IdProyecto)
        {
            var resultado = new JObject();
            try
            {
              
                //string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                //List<ProyectoCDModel> LstCosto = cd_proy.ConsultaCostosDirectosProyecto(IdProyecto, Conexion);
                //List<ProyectoCIModel> LstCostoInd = cd_proy.ConsultaCostosIndirectosProyecto(IdProyecto, Conexion);
          


                //resultado["Costos"] = JsonConvert.SerializeObject(costos);
                //resultado["Exito"] = true;
                //resultado["LstCostoDirecto"] = JsonConvert.SerializeObject(LstCosto.ToList());
                //resultado["LstCostoIndirecto"] = JsonConvert.SerializeObject(LstCostoInd);


                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }


                CD_Proyecto cd_pro = new CD_Proyecto();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                List<ProyectoCostosModel> LstCosto = new List<ProyectoCostosModel>();

                List<ProyectoCostosModel> LstCostoMeses = new List<ProyectoCostosModel>();
        


                (LstCosto, LstCostoMeses) = cd_pro.ObtieneCostosMensuales(0, Usuario.IdUsuario, Usuario.IdTipoUsuario, IdProyecto,false, Encripta.DesencriptaDatos(Usuario.ConexionSP));


                resultado["Planeado"] = LstCosto.FirstOrDefault().Planeado;
                resultado["Acumulado"] = LstCosto.FirstOrDefault().Acumulado;
                resultado["PorcUtilizado"] = LstCosto.FirstOrDefault().PorcUtilizado;
                resultado["Disponible"] = LstCosto.FirstOrDefault().Planeado - LstCosto.FirstOrDefault().Acumulado;
                resultado["Exito"] = true;
                resultado["LstCostosMeses"] = JsonConvert.SerializeObject(LstCostoMeses);




                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;

                return Content(resultado.ToString());
            }

        }


        public ActionResult ObtieneCostosMensualesProyecto(long IdProyecto)
        {
            var resultado = new JObject();
            try
            {



                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }


                CD_Proyecto cd_pro = new CD_Proyecto();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                List<ProyectoCostosModel> LstCosto = new List<ProyectoCostosModel>();

                List<ProyectoCostosModel> LstCostoMeses = new List<ProyectoCostosModel>();



                (LstCosto, LstCostoMeses) = cd_pro.ObtieneCostosMensuales(0, Usuario.IdUsuario, Usuario.IdTipoUsuario, IdProyecto,false, Encripta.DesencriptaDatos(Usuario.ConexionSP));


                var costos = ObtenerObjetoDescargaCostosMensualesProyecto(LstCostoMeses);
                var tabla = FuncionesGenerales.CrearTabla(costos, "Costos mensuales");
                var excel = Reportes.CrearExcel(tabla);

                return File(excel, MimeType.XLSX, "CostosMensuales" + ".xlsx");



            }
            catch (Exception e)
            {

                Response.StatusCode = 400;
                Response.StatusDescription = e.Message;
                return Content(e.Message);
            }

        }

        private object ObtenerObjetoDescargaCostosMensualesProyecto(List<ProyectoCostosModel> costos)
        {
            return
                costos.Select(x => new
                {
                   Periodo =   x.NombreMes +  "/" +  x.Anio.ToString() ,
                   Costo =  x.Costo


                }).ToList();
        }



        //termina
        public ActionResult Costos()
        {

            ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
            Session["Accion" + Session.SessionID] = "Costos";

            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }


            if (!FuncionesGenerales.ValidaPermisosAccion(0))
            {
                return RedirectToAction("Unauthorized", "ERROR");

            }


            CD_CatalogoGeneral cd_gen = new CD_CatalogoGeneral();
            var Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);


            List<CatalogoGeneralModel> LstAnios = cd_gen.ObtenerAnios(conexionEF);



            ViewBag.LstAnios = LstAnios;
            ViewBag.Anio = DateTime.Now.Year;

            return View();

        }
        public ActionResult ObtieneCostosMensuales(int Anio, bool Abierto)
        {
            var Resultado = new JObject();
            try
            {

                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }


                CD_Proyecto cd_pro = new CD_Proyecto();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                List<ProyectoCostosModel> LstCosto = new List<ProyectoCostosModel>();

                List<ProyectoCostosModel> LstCostoMeses = new List<ProyectoCostosModel>();



                (LstCosto,LstCostoMeses) = cd_pro.ObtieneCostosMensuales(Anio, Usuario.IdUsuario, Usuario.IdTipoUsuario,0, Abierto, Encripta.DesencriptaDatos(Usuario.ConexionSP));


                Resultado["Exito"] = true;
                Resultado["LstCostos"] = JsonConvert.SerializeObject(LstCosto);

                return Content(Resultado.ToString());

            }
            catch (Exception ex)
            {
                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }

        }

        public ActionResult DescargarExcelCostosMensuales(int Anio, bool Abierto)
        {
            try
            {

                CD_Proyecto cd_pro = new CD_Proyecto();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                List<ProyectoCostosModel> LstCosto = new List<ProyectoCostosModel>();
                List<ProyectoCostosModel> _LstCosto = new List<ProyectoCostosModel>();


                (LstCosto, _LstCosto) = cd_pro.ObtieneCostosMensuales(Anio, Usuario.IdUsuario, Usuario.IdTipoUsuario,0,Abierto, Encripta.DesencriptaDatos(Usuario.ConexionSP));
                var costos = ObtenerObjetoDescargaCostosMensuales(LstCosto);
                var tabla = FuncionesGenerales.CrearTabla(costos, "Costos mensuales " + Anio.ToString());
                var excel = Reportes.CrearExcel(tabla);

                return File(excel, MimeType.XLSX, "CostosMensuales" + Anio.ToString() + ".xlsx");
            }
            catch (Exception e)
            {
                Response.StatusCode = 400;
                Response.StatusDescription = e.Message;
                return Content(e.Message);
            }
        }

        private object ObtenerObjetoDescargaCostosMensuales(List<ProyectoCostosModel> costos)
        {
            return
                costos.Select(x => new
                {
                  Proyecto =   x.NombreProy,
                  Líder= x.Lider,
                  CostoPlaneado=  x.Planeado,
                  CostoHoraPlan=  x.CostoHoraPlan,
                  CostoHoraReal=   x.CostoHoraReal,
                    x.Ene,
                    x.Feb,
                    x.Mar,
                    x.Abr,
                    x.May,
                    x.Jun,
                    x.Jul,
                    x.Ago,
                    x.Sep,
                    x.Oct,
                    x.Nov,
                    x.Dic,
                    x.Acumulado,
                    x.CostoProyectado
                }).OrderByDescending(x => x.Proyecto).ToList();
        }


        public ActionResult ObtieneCostosMensualesDetalle(int Anio, int Mes, int IdProyecto)
        {
            var Resultado = new JObject();
            try
            {

                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }


                CD_Proyecto cd_pro = new CD_Proyecto();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                List<UsuarioCostoDistribucionModel> LstCosto = new List<UsuarioCostoDistribucionModel>();



                LstCosto = cd_pro.ObtieneCostosMensualesDetalle(Anio,Mes, IdProyecto, Usuario.IdUsuario, Usuario.IdTipoUsuario, Encripta.DesencriptaDatos(Usuario.ConexionSP));


                Resultado["Exito"] = true;
                Resultado["Proyecto"] = LstCosto.Select(s=> s.Proyecto).FirstOrDefault();
                Resultado["LstCostos"] = JsonConvert.SerializeObject(LstCosto);

                return Content(Resultado.ToString());

            }
            catch (Exception ex)
            {
                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }

        }


        public ActionResult ConsultaGraficaCostoHoraProyecto(int IdProyecto) {
            var Resultado = new JObject();
            try
            {

                GraficaConsultaModel graf = new GraficaConsultaModel();
                List<GraficaConsultaModel> LstGraf = new List<GraficaConsultaModel>();
                CD_Graficas cd_gra = new CD_Graficas();


                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
         
                graf = cd_gra.ConsultarGraficaCostoHoraProyecto(IdProyecto,conexion);
                LstGraf.Add(graf);

                Resultado["GraficaCostoHora"] = JsonConvert.SerializeObject(LstGraf);
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


        #region SprintReport

        public ActionResult SprintReport(int Id)
        {

            ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
            Session["Accion" + Session.SessionID] = "SprintReport";

            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }


            if (!FuncionesGenerales.ValidaPermisosAccion(0))
            {
                return RedirectToAction("Unauthorized", "ERROR");

            }


            //CD_CatalogoGeneral cd_gen = new CD_CatalogoGeneral();
            //var Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);


            //List<CatalogoGeneralModel> LstAnios = cd_gen.ObtenerAnios(conexionEF);



            //ViewBag.LstAnios = LstAnios;
            //ViewBag.Anio = DateTime.Now.Year;

            ViewBag.IdIteracion = Id;

            return View();

        }
        public ActionResult ConsultaSprintReport(int IdIteracion, List<string> Estatus)
        {
            var Resultado = new JObject();
            try
            {

                GraficaConsultaModel graf = new GraficaConsultaModel();
                List<GraficaConsultaModel> LstGraf = new List<GraficaConsultaModel>();
       
                CD_Graficas cd_gra = new CD_Graficas();


                CD_Proyecto cd_pro = new CD_Proyecto();
                ProyectoIteracionModel pro = new ProyectoIteracionModel();
                var estatus = string.Join<string>(",", Estatus.ConvertAll(s => s.ToString()));

                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);

                pro = cd_pro.SprintReport(IdIteracion, estatus, conexion);

                List<GanttModel>  Gantt = FuncionesGenerales.ConvierteGantt_Actividades(pro.Actividades.Where(w=> w.FechaInicio != null && w.FechaSolicitado != null).ToList());


                var LstEventos = FuncionesGenerales.ConvierteEventosCalendario(pro.Actividades.Where(w => w.FechaInicio != null && w.FechaSolicitado != null).ToList());

                string ActividadesA = FuncionesGenerales.ConvierteListaTareasV2(pro.Actividades.Where(w=> w.Estatus == "A" && w.FechaSolicitado != null).ToList(), "A");
                string ActividadesP = FuncionesGenerales.ConvierteListaTareasV2(pro.Actividades, "P");
                string ActividadesR = FuncionesGenerales.ConvierteListaTareasV2(pro.Actividades, "V");
                ActividadesR += FuncionesGenerales.ConvierteListaTareasV2(pro.Actividades, "R");
                string ActividadesX = FuncionesGenerales.ConvierteListaTareasV2(pro.Actividades, "X");
                string ActividadesL = FuncionesGenerales.ConvierteListaTareasV2(pro.Actividades, "L");



                LstGraf.Add(pro.Grafica);


                Resultado["ProyectoIteracion"] = JsonConvert.SerializeObject(pro);
                Resultado["LstActividades"] = JsonConvert.SerializeObject(pro.Actividades);
                Resultado["GraficaBurndown"] = JsonConvert.SerializeObject(LstGraf);


                Resultado["TotalAbiertas"] = pro.Actividades.Where(w => w.Estatus == "A").Count();
                Resultado["TotalProgreso"] = pro.Actividades.Where(w => w.Estatus == "P").Count();
                Resultado["TotalValidacion"] = pro.Actividades.Where(w => w.Estatus == "V" || w.Estatus == "R").Count();
                Resultado["TotalRechazadas"] = pro.Actividades.Where(w => w.Estatus == "X").Count();
                Resultado["TotalLiberadas"] = pro.Actividades.Where(w => w.Estatus == "L").Count();
                Resultado["ActividadesA"] = ActividadesA;
                Resultado["ActividadesP"] = ActividadesP;
                Resultado["ActividadesR"] = ActividadesR;
                Resultado["ActividadesX"] = ActividadesX;
                Resultado["ActividadesLi"] = ActividadesL;
                Resultado["Gantt"] = JsonConvert.SerializeObject(Gantt);
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


        public ActionResult ConsultaSprintReportIndicadores(int IdIteracion)
        {
            var Resultado = new JObject();
            try
            {

                GraficaConsultaModel graf = new GraficaConsultaModel();
                List<GraficaConsultaModel> LstGraf = new List<GraficaConsultaModel>();

                CD_Graficas cd_gra = new CD_Graficas();
                CD_CatalogoGeneral cd_CatGenral = new CD_CatalogoGeneral();
                CD_Proyecto cd_pro = new CD_Proyecto();
                ProyectoIteracionModel pro = new ProyectoIteracionModel();

                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                List<CatalogoGeneralModel> LstUsuarios = cd_CatGenral.ConsultaUsuariosProyectoIteracion(IdIteracion, Encripta.DesencriptaDatos(Usuario.ConexionEF));

                pro = cd_pro.SprintReport_Indicadores(IdIteracion, Encripta.DesencriptaDatos(Usuario.ConexionSP));

                LstGraf.Add(pro.Grafica);

                Resultado["Exito"] = true;
                Resultado["ProyectoIteracion"] = JsonConvert.SerializeObject(pro);
                Resultado["LstUsuarios"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlImagen(LstUsuarios, "http://app.yitpro.com/Archivos/Fotos/", true);
                Resultado["GraficaBurndown"] = JsonConvert.SerializeObject(LstGraf);

                return Content(Resultado.ToString());


            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }


        }
        public ActionResult ConsultaSprintReportActividades(int IdIteracion, List<string> Estatus)
        {
            var Resultado = new JObject();
            try
            {

                //GraficaConsultaModel graf = new GraficaConsultaModel();
                //List<GraficaConsultaModel> LstGraf = new List<GraficaConsultaModel>();

                //CD_Graficas cd_gra = new CD_Graficas();


                CD_Proyecto cd_pro = new CD_Proyecto();
                ProyectoIteracionModel pro = new ProyectoIteracionModel();
                var estatus = string.Join<string>(",", Estatus.ConvertAll(s => s.ToString()));

                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
                string conexionef = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                pro = cd_pro.SprintReport_Actividades(IdIteracion, estatus, conexion);

                List<GanttModel> Gantt = FuncionesGenerales.ConvierteGantt_Fases(pro.LstFases);


                var LstEventos = FuncionesGenerales.ConvierteEventosCalendario(pro.Actividades.Where(w => w.FechaInicio != null && w.FechaSolicitado != null).ToList());

                string ActividadesA = FuncionesGenerales.ConvierteListaTareasV2(pro.Actividades.Where(w => w.Estatus == "A" && w.FechaSolicitado != null).ToList(), "A");
                string ActividadesP = FuncionesGenerales.ConvierteListaTareasV2(pro.Actividades, "P");
                string ActividadesR = FuncionesGenerales.ConvierteListaTareasV2(pro.Actividades, "V");
                ActividadesR += FuncionesGenerales.ConvierteListaTareasV2(pro.Actividades, "R");
                string ActividadesX = FuncionesGenerales.ConvierteListaTareasV2(pro.Actividades, "X");
                string ActividadesL = FuncionesGenerales.ConvierteListaTareasV2(pro.Actividades, "L");

                List<CatalogoGeneralModel> LstUsuarios = cd_pro.ConsultaUsuariosProyectoCombo(pro.Actividades.FirstOrDefault() == null ? -1 : pro.Actividades.FirstOrDefault().IdProyecto, conexionef);



                //LstGraf.Add(pro.Grafica);

                Resultado["Exito"] = true;
                Resultado["ProyectoIteracion"] = JsonConvert.SerializeObject(pro);
                Resultado["LstActividades"] = JsonConvert.SerializeObject(pro.Actividades);
                //Resultado["GraficaBurndown"] = JsonConvert.SerializeObject(LstGraf);


                Resultado["TotalAbiertas"] = pro.Actividades.Where(w => w.Estatus == "A").Count();
                Resultado["TotalProgreso"] = pro.Actividades.Where(w => w.Estatus == "P").Count();
                Resultado["TotalValidacion"] = pro.Actividades.Where(w => w.Estatus == "V" || w.Estatus == "R").Count();
                Resultado["TotalRechazadas"] = pro.Actividades.Where(w => w.Estatus == "X").Count();
                Resultado["TotalLiberadas"] = pro.Actividades.Where(w => w.Estatus == "L").Count();
                Resultado["ActividadesA"] = ActividadesA;
                Resultado["ActividadesP"] = ActividadesP;
                Resultado["ActividadesR"] = ActividadesR;
                Resultado["ActividadesX"] = ActividadesX;
                Resultado["ActividadesLi"] = ActividadesL;
                Resultado["Gantt"] = JsonConvert.SerializeObject(Gantt);
                Resultado["Eventos"] = JsonConvert.SerializeObject(LstEventos);
                Resultado["LstUsuarios"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlImagen(LstUsuarios, "");
                Resultado["LstHus"] = FuncionesGenerales.ConvierteHtmlComboxHUS(pro.LstHus);



                return Content(Resultado.ToString());


            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }


        }

        public ActionResult ConsultaSprintReportActividades_Filtrar(int IdIteracion, List<string> Estatus, DateTime? FechaInicio, DateTime? FechaFin, int TipoId, long IdUsuarioAsignado, long IdHu)
        {
            var Resultado = new JObject();
            try
            {

                //GraficaConsultaModel graf = new GraficaConsultaModel();
                //List<GraficaConsultaModel> LstGraf = new List<GraficaConsultaModel>();

                //CD_Graficas cd_gra = new CD_Graficas();


                CD_Proyecto cd_pro = new CD_Proyecto();
                ProyectoIteracionModel pro = new ProyectoIteracionModel();
                var estatus = string.Join<string>(",", Estatus.ConvertAll(s => s.ToString()));

                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
                //string conexionef = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                pro = cd_pro.SprintReport_Actividades_Filtrar(IdIteracion, estatus,FechaInicio, FechaFin, TipoId, IdUsuarioAsignado, IdHu,   conexion);

                List<GanttModel> Gantt = FuncionesGenerales.ConvierteGantt_Fases(pro.LstFases);


                //var LstEventos = FuncionesGenerales.ConvierteEventosCalendario(pro.Actividades.Where(w => w.FechaInicio != null && w.FechaSolicitado != null).ToList());

                string ActividadesA = FuncionesGenerales.ConvierteListaTareasV2(pro.Actividades.Where(w => w.Estatus == "A" && w.FechaSolicitado != null).ToList(), "A");
                string ActividadesP = FuncionesGenerales.ConvierteListaTareasV2(pro.Actividades, "P");
                string ActividadesR = FuncionesGenerales.ConvierteListaTareasV2(pro.Actividades, "V");
                ActividadesR += FuncionesGenerales.ConvierteListaTareasV2(pro.Actividades, "R");
                string ActividadesX = FuncionesGenerales.ConvierteListaTareasV2(pro.Actividades, "X");
                string ActividadesL = FuncionesGenerales.ConvierteListaTareasV2(pro.Actividades, "L");

                //List<CatalogoGeneralModel> LstUsuarios = cd_pro.ConsultaUsuariosProyectoCombo(pro.Actividades.FirstOrDefault() == null ? -1 : pro.Actividades.FirstOrDefault().IdProyecto, conexionef);



                //LstGraf.Add(pro.Grafica);

                Resultado["Exito"] = true;
                Resultado["ProyectoIteracion"] = JsonConvert.SerializeObject(pro);
                Resultado["LstActividades"] = JsonConvert.SerializeObject(pro.Actividades);
                //Resultado["GraficaBurndown"] = JsonConvert.SerializeObject(LstGraf);


                Resultado["TotalAbiertas"] = pro.Actividades.Where(w => w.Estatus == "A").Count();
                Resultado["TotalProgreso"] = pro.Actividades.Where(w => w.Estatus == "P").Count();
                Resultado["TotalValidacion"] = pro.Actividades.Where(w => w.Estatus == "V" || w.Estatus == "R").Count();
                Resultado["TotalRechazadas"] = pro.Actividades.Where(w => w.Estatus == "X").Count();
                Resultado["TotalLiberadas"] = pro.Actividades.Where(w => w.Estatus == "L").Count();
                Resultado["ActividadesA"] = ActividadesA;
                Resultado["ActividadesP"] = ActividadesP;
                Resultado["ActividadesR"] = ActividadesR;
                Resultado["ActividadesX"] = ActividadesX;
                Resultado["ActividadesLi"] = ActividadesL;
                //Resultado["Gantt"] = JsonConvert.SerializeObject(Gantt);
                //Resultado["Eventos"] = JsonConvert.SerializeObject(LstEventos);
                //Resultado["LstUsuarios"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlImagen(LstUsuarios, "");
                //Resultado["LstHus"] = FuncionesGenerales.ConvierteHtmlComboxHUS(pro.LstHus);



                return Content(Resultado.ToString());


            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }


        }


        public ActionResult ConsultaSprintTrabajoCompletado(int IdIteracion)
        {
            var Resultado = new JObject();
            try
            {
                CD_Proyecto cd_pro = new CD_Proyecto();

                List<ActividadesModel> Lst = new List<ActividadesModel>();

                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);

                Lst = cd_pro.SprintReport_ConsultaTrabajoCompletado(IdIteracion, conexion);

                Resultado["Exito"] = true;
                Resultado["LstActividades"] = JsonConvert.SerializeObject(Lst);

                return Content(Resultado.ToString());
            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }


        }



        public ActionResult CambiaEstatusSprint(int IdIteracion, string Estatus)
        {
            var Resultado = new JObject();
            try
            {



                CD_Proyecto cd_pro = new CD_Proyecto();
            


                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);


                bool Exito = cd_pro.CambiaEstatusSprint(IdIteracion, Estatus, conexion);
   
                Resultado["Exito"] = Exito;
                Resultado["Mensaje"] = "";
  

                return Content(Resultado.ToString());


            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }


        }


        public ActionResult GuardarRetrospectiva(ProyectoIteracionModel PI, string Actividades)
        {
            var Resultado = new JObject();
            try
            {



                CD_Proyecto cd_pro = new CD_Proyecto();



                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                PI.IdUCreo = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.IdUsuario;


                bool Exito = cd_pro.GuardarSprintRetrospectiva(PI, Actividades,conexion);

                Resultado["Exito"] = Exito;
                Resultado["Mensaje"] = "Sprint terminado correctamente";


                return Content(Resultado.ToString());


            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }


        }


        public ActionResult ConsultaSprintRetrospectiva(int IdIteracion)
        {
            var Resultado = new JObject();
            try
            {



                CD_Proyecto cd_pro = new CD_Proyecto();

                ProyectoIteracionModel pi = new ProyectoIteracionModel();
                List<ActividadesModel> Lst = new List<ActividadesModel>();

                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                string conexionsp = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);

                Lst = cd_pro.SprintReport_ConsultaTrabajoCompletado(IdIteracion, conexionsp);


                pi = cd_pro.ConsultaSprintRetrospectiva(IdIteracion, conexion);

                Resultado["Exito"] = true;
                Resultado["Retrospectiva"] =  JsonConvert.SerializeObject(pi);
                Resultado["LstActividades"] = JsonConvert.SerializeObject(Lst);


                return Content(Resultado.ToString());


            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }


        }
        public ActionResult ConsultaGraficasSprint(long IdIteracion)
        {
            var resultado = new JObject();
            try
            {
                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }
                List<GraficaConsultaModel> LstGraficas = new List<GraficaConsultaModel>();
                CD_Actividad cd_act = new CD_Actividad();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                LstGraficas = cd_act.ConsultarGraficasSprint(IdIteracion, Encripta.DesencriptaDatos(Usuario.ConexionSP));

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


        public ActionResult GuardarSprintCompartir(long IdIteracion, List<long> LstUsuarios)
        {

            var Resultado = new JObject();
            try
            {

                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;


                CD_Proyecto cd_p = new CD_Proyecto();

                bool g = cd_p.GuardarSprintCompartir(Usuario.IdUsuario, IdIteracion, LstUsuarios, Encripta.DesencriptaDatos(Usuario.ConexionEF));

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

        public ActionResult ConsultaSprintCompartir(long IdIteracion)
        {

            var Resultado = new JObject();
            try
            {

                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                List<long> Lst = new List<long>();


                CD_Proyecto cd_p = new CD_Proyecto();

                Lst = cd_p.ConsultaCompartirSprint(IdIteracion, Encripta.DesencriptaDatos(Usuario.ConexionEF));

                Resultado["Exito"] = true;
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



        #endregion

        #region ProyectoDocumento
        public ActionResult GuardarDocumento(HttpPostedFileBase Archivo ,long IdProyecto,long TipoDocumentoId,long IdProDoc, string ClaveProy)
        {
            bool isSavedSuccessfully = true;
            string urlcompleta = "";

            try
            {
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                CD_Proyecto cd_p = new CD_Proyecto();

                //long IdProyecto = 1;
                //string ClaveProy = "ABC";

                    HttpPostedFileBase file = Archivo;
                    if (file != null && file.ContentLength > 0)
                    {
                        var originalDirectory = new DirectoryInfo(string.Format("{0}Archivos\\Documentos", Server.MapPath(@"~/")));

                        string pathString = System.IO.Path.Combine(originalDirectory.ToString(), ClaveProy);
                        var extencionArchivo = Path.GetFileName(file.FileName).Split('.').LastOrDefault();

                        bool isExists = System.IO.Directory.Exists(pathString);

                        if (!isExists)
                            System.IO.Directory.CreateDirectory(pathString);

                        var path = string.Format("{0}\\{1}", pathString, Path.GetFileName(file.FileName).Substring(0, file.FileName.LastIndexOf(".")) + "." + extencionArchivo);
                        urlcompleta = ConfigurationManager.AppSettings["UrlSistema"] + "Archivos/Documentos/" + ClaveProy + "/" + file.FileName;
                        file.SaveAs(path);


                    ProyectoDocumentosModel p = new ProyectoDocumentosModel();
                    p.IdProyecto = IdProyecto;
                    p.IdProDoc = IdProDoc;
                    p.Name = file.FileName;
                    p.TipoDocumentoId = TipoDocumentoId;
                    p.Extension = extencionArchivo;
                    p.Ubicacion = urlcompleta;
                    p.IdUCreo = Usuario.IdUsuario;


                     string Conexion = Encripta.DesencriptaDatos(Usuario.ConexionEF);
                      int exito = cd_p.GuardaArchivo(p, Conexion);
                    }


                return Json(new { Exito = true, Mensaje = "Éxito al guardar el documento." });
            }
            catch (Exception ex)
            {

                var msg = ex.Message;
                return Json(new { Exito = false, Mensaje = "Error al guardar el documento." });
             
            }



        }

        public ActionResult EliminarDocumento(long IdProDoc)
        {
            var resultado = new JObject();
            try
            {


                ProyectoDocumentosModel pd = new ProyectoDocumentosModel();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                CD_Proyecto cd_p = new CD_Proyecto();
                pd.IdProDoc = IdProDoc;
                pd.IdUElimino = Usuario.IdUsuario;

                bool Exito = cd_p.EliminarDocumento(pd, Encripta.DesencriptaDatos(Usuario.ConexionEF));

                resultado["Exito"] = Exito;
         
                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
            }
            return Content(resultado.ToString());
        }

        public ActionResult ObtenerDocumentos(long IdProyecto)
        {
            var Resultado = new JObject();
            try
            {
                List<ProyectoDocumentosModel> Lst = new List<ProyectoDocumentosModel>();

                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                CD_Proyecto cd_p = new CD_Proyecto();

                Lst = cd_p.ObtenerDocumentos(IdProyecto, Encripta.DesencriptaDatos(Usuario.ConexionEF));

                Resultado["Exito"] = true;
                Resultado["Documentos"] = JsonConvert.SerializeObject(Lst);
                return Content(Resultado.ToString());

            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }

        }

        public ActionResult DescargarDocumento(long IdProDoc)
        {
            var Resultado = new JObject();
            try
            {
                ProyectoDocumentosModel pd = new ProyectoDocumentosModel();
                //long IdProDoc = 1;
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                CD_Proyecto cd_p = new CD_Proyecto();

                pd = cd_p.ObtieneDocumento(IdProDoc, Encripta.DesencriptaDatos(Usuario.ConexionEF));

                Resultado["Exito"] = true;
                Resultado["Documento"] = pd.Ubicacion;
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