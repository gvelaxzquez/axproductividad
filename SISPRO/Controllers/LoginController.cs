using System;
using System.Collections.Generic;
using System.Web.Mvc;
using System.Configuration;
using Newtonsoft.Json.Linq;
using System.Linq;
using CapaDatos;
using CapaDatos.Models;
using System.Web.Security;
using AxProductividad.Models;
using CapaDatos.Models.Constants;
using DocumentFormat.OpenXml.Bibliography;
using System.Security.Policy;

namespace AxProductividad.Controllers
{
    public class LoginController : Controller
    {
        // GET: Login
        //  [AllowAnonymous]
        public ActionResult Index()
        {

            try
            {
                ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
                Session["Usuario" + Session.SessionID] = null;
                return View();
            }
            catch (Exception ex)
            {

                throw ex;
            }
       
        }


        public ActionResult Index2()
        {

            try
            {
                ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
                Session["Usuario" + Session.SessionID] = null;
                return View();
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }


        [HttpPost]//, AllowAnonymous]
        public ActionResult Login(string Usuario, string Contrasena)
        {
            var resultado = new JObject();
            try
            {
                CD_Login cdlogin = new CD_Login();
                CD_Configuracion cdconf = new CD_Configuracion();
                UsuarioModel User = new UsuarioModel();


                //string s = Encripta.EncriptaDatos(Contrasena);
                ////User = cdlogin.Login(Usuario);   

                int Respuesta = cdlogin.LoginV2(Usuario, Contrasena, ref User);
                bool Exito = true;
                string Mensaje = "Login";
                switch (Respuesta)
                {
                    case -6:
                        Exito = false;
                        Mensaje = "El usuario no se encuentra registrado";
                        break;
                    case -5:
                        Exito = false;
                        Mensaje = "El usuario no se encuentra registrado.";
                        break;
                    case -4:
                        Exito = false;
                        Mensaje = "La contraseña ingresada es incorrecta.";
                        break;
                    case -2:
                        Exito = false;
                        Mensaje = "La organización se encuentra inactiva.";
                        break;
                    case -7:
                        Exito = false;
                        Mensaje = "No se pudo autenticar el usuario con AD.";
                        break;
                    case 5:
                        Exito = false;
                        Mensaje = "Su cuenta se encuentra bloqueada. <br/> Contacte a su administrador.";
                        break;
                    case 4:
                        Mensaje = "Su cuenta se encuentra inactiva. <br/> Contacte a su administrador.";
                        break;
                    case 6:
                        Mensaje = "Su cuenta no se encuentra dada de alta en la empresa. <br/> Contacte a su administrador.";
                        break;
                    default:
                        Mensaje = "";
                        break;
                }


                if (User != null && Respuesta == -1)
                {

                    // Usuario bloqueado
                    if (User.Bloqueado)
                    {
                        Exito = false;
                        Mensaje = "El usuario se encuentra bloqueado.";
                        //return Content(resultado.ToString());
                    }

                    // Usuario inactivo
                    if (!User.Activo)
                    {
                        Exito = false;
                        Mensaje = "El usuario se encuentra inactivo.";
                        //return Content(resultado.ToString());
                    }


                    //Obtengo el menú  y las alertas
                    CD_Usuario cd_user = new CD_Usuario();
                    CD_Actividad cd_act = new CD_Actividad();
                    CD_Workspace cd_w = new CD_Workspace();
                    List<MenuModel> LstMenu = new List<MenuModel>();
                    List<ActividadTipoModel> LstAcTipo = new List<ActividadTipoModel>();
                    List<ProyectosModel> LstProyectos = new List<ProyectosModel>();
                    List<QueryModel> LstQuerys = new List<QueryModel>();
                    List<WorkSpaceModel> LstWorkspaces = new List<WorkSpaceModel>();

                    string Conexion = Encripta.DesencriptaDatos(User.ConexionEF);

                    LstMenu = cd_user.ObtenerMenuUsuario(User.IdUsuario, Conexion);
                    LstAcTipo = cd_act.ConsultaTiposActividad(Conexion);
                    LstQuerys = cd_act.ConsultaQuerysAll(User.IdUsuario, Conexion);
                    LstQuerys = cd_act.ConsultaQuerysAll(User.IdUsuario, Conexion);
                    LstWorkspaces = cd_w.ConsultaWorkspaces(User.IdUsuario, Conexion);

                    Models.Sesion sesion = new Models.Sesion()
                    {
                        Usuario = User,
                        Menu = LstMenu,
                        Querys = LstQuerys,
                        WorkItems = LstAcTipo,
                        Workspaces = LstWorkspaces
                    };

                    CD_Configuracion cd_conf = new CD_Configuracion();
                    var Vigencia = cd_conf.ObtenerConfiguracionID(8, Conexion);

                    Session["Usuario" + Session.SessionID] = sesion;


                    Session["Asistencia" + Session.SessionID] = bool.Parse(cdconf.ObtenerConfiguracionID(27, Conexion));
                    Session["CapturaF" + Session.SessionID] = User.IdTipoUsuario == 19 ? 0 :  User.CapturaF;
                    Session["CV" + Session.SessionID] = User.FechaContrasena.AddDays(int.Parse(Vigencia)) < DateTime.Now ? 1 : 0;

                    cdlogin.ReseteoIntentoBloqueo(User.IdUsuario, Conexion);

                    resultado["Exito"] = Exito;
                    resultado["Mensaje"] = Mensaje;
                }


                var url = ConfigurationManager.AppSettings["UrlSistema"];



                resultado["Exito"] = Exito;
                resultado["Mensaje"] = Mensaje;

                var URL = (string)(Session["URL" + Session.SessionID]) == null ? "" : (string)(Session["URL" + Session.SessionID]);

                if (URL != "")
                {
                    if (User.IdTipoUsuario == 19)
                    {

                        resultado["URL"] = URL;
                        Session["Home" + Session.SessionID] = url + "Portafolio/Sponsor";

                    }
                    else if (User.IdTipoUsuario == 14)
                    {

                        resultado["URL"] = URL;
                        Session["Home" + Session.SessionID] = "/Dashboard/p/" + User.NumEmpleado;
                    }
                    else
                    {
                        resultado["URL"] = URL;
                        Session["Home" + Session.SessionID] = url + "Dashboard/Performance";
                    }
                    Session["URL" + Session.SessionID] = "";
                }
                else
                {
                    if (User.IdTipoUsuario == 19)
                    {

                        resultado["URL"] = "/Portafolio/Sponsor";
                        Session["Home" + Session.SessionID] = url + "Portafolio/Sponsor";

                    }
                    else if (User.IdTipoUsuario == 14)
                    {

                        resultado["URL"] = "/Dashboard/p/" + User.NumEmpleado;
                        Session["Home" + Session.SessionID] = "/Dashboard/p/" + User.NumEmpleado;
                    }
                    else
                    {
                        Random r = new Random();
                        var r2 = r.Next(1, 100);
                        var v = r2 % 2;
                        resultado["URL"] =  v== 0 ?  "/Dashboard/Performance" : "/Portafolio";
                        Session["Home" + Session.SessionID] = url + "Dashboard/Performance";
                    }

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


        public ActionResult CambiarOrganizacion(int Id) {
            var resultado = new JObject();
            try
            {

                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }

                CD_Login cdlogin = new CD_Login();
                CD_Configuracion cdconf = new CD_Configuracion();
        


                var Usuario = ((Sesion)Session["Usuario" + Session.SessionID]).Usuario;

                UsuarioModel User = new UsuarioModel();
                cdlogin.CambioOrganizacion(Id, Usuario.Correo, ref User);

                User.IdCuenta = Usuario.IdCuenta;
                User.CantOrg = Usuario.CantOrg;

                bool Exito = true;
                string Mensaje = "Login";

                if (User != null)
                {

                    // Usuario bloqueado
                    if (User.Bloqueado)
                    {
                        Exito = false;
                        Mensaje = "El usuario se encuentra bloqueado.";
                        //return Content(resultado.ToString());
                    }

                    // Usuario inactivo
                    if (!User.Activo)
                    {
                        Exito = false;
                        Mensaje = "El usuario se encuentra inactivo.";
                        //return Content(resultado.ToString());
                    }


                    //Obtengo el menú  y las alertas
                    CD_Usuario cd_user = new CD_Usuario();
                    CD_Actividad cd_act = new CD_Actividad();
                    CD_Workspace cd_w = new CD_Workspace();
                    List<MenuModel> LstMenu = new List<MenuModel>();
                    List<ActividadTipoModel> LstAcTipo = new List<ActividadTipoModel>();
                    List<ProyectosModel> LstProyectos = new List<ProyectosModel>();
                    List<QueryModel> LstQuerys = new List<QueryModel>();
                    List<WorkSpaceModel> LstWorkspaces = new List<WorkSpaceModel>();

                    string Conexion = Encripta.DesencriptaDatos(User.ConexionEF);

                    LstMenu = cd_user.ObtenerMenuUsuario(User.IdUsuario, Conexion);
                    LstAcTipo = cd_act.ConsultaTiposActividad(Conexion);
                    LstQuerys = cd_act.ConsultaQuerysAll(User.IdUsuario, Conexion);
                    LstWorkspaces = cd_w.ConsultaWorkspaces(User.IdUsuario, Conexion);

                    Models.Sesion sesion = new Models.Sesion()
                    {
                        Usuario = User,
                        Menu = LstMenu,
                        Querys = LstQuerys,
                        WorkItems = LstAcTipo,
                        Workspaces = LstWorkspaces
                    };

                    CD_Configuracion cd_conf = new CD_Configuracion();
                    var Vigencia = cd_conf.ObtenerConfiguracionID(8, Conexion);

                    Session["Usuario" + Session.SessionID] = sesion;


                    Session["Asistencia" + Session.SessionID] = bool.Parse(cdconf.ObtenerConfiguracionID(27, Conexion));
                    Session["CapturaF" + Session.SessionID] = User.IdTipoUsuario == 19 ? 0 : User.CapturaF;
                    Session["CV" + Session.SessionID] = User.FechaContrasena.AddDays(int.Parse(Vigencia)) < DateTime.Now ? 1 : 0;

                    cdlogin.ReseteoIntentoBloqueo(User.IdUsuario, Conexion);

                    resultado["Exito"] = Exito;
                    resultado["Mensaje"] = Mensaje;
                }



                resultado["Exito"] = true;



                resultado["Exito"] = Exito;
                resultado["Mensaje"] = Mensaje;


                var url = ConfigurationManager.AppSettings["UrlSistema"];

                var URL = (string)(Session["URL" + Session.SessionID]) == null ? "" : (string)(Session["URL" + Session.SessionID]);

                if (URL != "")
                {
                    if (User.IdTipoUsuario == 19)
                    {

                        resultado["URL"] = URL;
                        Session["Home" + Session.SessionID] = url + "Portafolio/Sponsor";

                    }
                    else if (User.IdTipoUsuario == 14)
                    {

                        resultado["URL"] = URL;
                        Session["Home" + Session.SessionID] = "/Dashboard/p/" + User.NumEmpleado;
                    }
                    else
                    {
                        resultado["URL"] = URL;
                        Session["Home" + Session.SessionID] = url + "Dashboard/Performance";
                    }
                    Session["URL" + Session.SessionID] = "";
                }
                else
                {
                    if (User.IdTipoUsuario == 19)
                    {

                        resultado["URL"] = "/Portafolio/Sponsor";
                        Session["Home" + Session.SessionID] = url + "Portafolio/Sponsor";

                    }
                    else if (User.IdTipoUsuario == 14)
                    {

                        resultado["URL"] = "/Dashboard/p/" + User.NumEmpleado;
                        Session["Home" + Session.SessionID] = "/Dashboard/p/" + User.NumEmpleado;
                    }
                    else
                    {
                        Random r = new Random();
                        var r2 = r.Next(1, 100);
                        var v = r2 % 2;
                        resultado["URL"] = v == 0 ? "/Dashboard/Performance" : "/Portafolio";
                        Session["Home" + Session.SessionID] = url + "Dashboard/Performance";
                    }

                }



                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = "No fue posible contactar con la organización, contacte al administrador";
                return Content(resultado.ToString());
            }
        
        }

        [HttpPost]
        public ActionResult RecuperarContrasena(string Usuario)
        {

            var resultado = new JObject();
            try
            {
                CD_Login cduser = new CD_Login();
                UsuarioModel User = new UsuarioModel();
                string Conexion = string.Empty;
                    
                int Respuesta =  cduser.ObtenerConexionUsuario(Usuario,ref Conexion);

                if (Respuesta == -5) {

                    resultado["Exito"] = false;
                    resultado["Mensaje"] = "El usuario no se encuentra registrado.";
                    return Content(resultado.ToString());
                }

                if (Respuesta == -2)
                {

                    resultado["Exito"] = false;
                    resultado["Mensaje"] = "La organización se encuentra inactiva.";
                    return Content(resultado.ToString());
                }

                if (Respuesta == -3)
                {

                    resultado["Exito"] = false;
                    resultado["Mensaje"] = "El usuario se encuentra inactivo.";
                    return Content(resultado.ToString());
                }

                User = cduser.Login(Usuario, Conexion);

                if (User != null)
                {
                    // Usuario inactivo
                    if (!User.Activo)
                    {
                        resultado["Exito"] = false;
                        resultado["Mensaje"] = "El usuario se encuentra inactivo.";
                        return Content(resultado.ToString());
                    }

                    string Contrasenase = Membership.GeneratePassword(5, 1);
                    string Contrasena = ClasesAuxiliares.EncriptaPass.EncriptaContrasena(Contrasenase);
                    User.Contrasena = Contrasena;

                    bool Exito = cduser.RecuperaContrasena(User.IdUsuario, Contrasena, Conexion);


                    Exito = FuncionesGenerales.EnviarCorreoContrasenaNuea(User, Conexion);


                    resultado["Exito"] = Exito;
                    resultado["Mensaje"] = Exito == true ? "La contraseña ha sido enviada a su dirección de correo." : "Error al recuperar la contraseña.";
                }
                else
                {

                    resultado["Exito"] = false;
                    resultado["Mensaje"] = "El usuario no se encuentra registrado.";
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
    }
}