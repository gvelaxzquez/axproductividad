
using AxProductividad.ClasesAuxiliares;
using CapaDatos;
using CapaDatos.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Web.Mvc;
using System.Web.Security;
using System.IO;
using System.Web;
using System.Linq;

namespace AxProductividad.Controllers
{
    public class UsuariosController : BaseController
    {
        // GET: Usuarios
        public ActionResult Index()
        {
            ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }
            Session["Controlador" + Session.SessionID] = "Usuarios";

            if (!FuncionesGenerales.ValidaPermisos(0))
            {
                return RedirectToAction("Unauthorized", "ERROR");

            }


            return View();
        }

        [HttpPost]
        public ActionResult CargaInicial()
        {
            var resultado = new JObject();
            try
            {
                CD_Usuario cd_Usuario = new CD_Usuario();
                CD_CatalogoGeneral cd_CatGenral = new CD_CatalogoGeneral();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                // Obtenemos la lista de usuarios para mostrar en la tabla.
                List<UsuarioModel> lstUsuarios = cd_Usuario.ObtenerListaUsuarios(Conexion);
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                // Obtenermos la lista de elementos de los Combox correspondientes.

                List<CatalogoGeneralModel> cmbDepartamentos = cd_CatGenral.ObtenerCatalogoGeneral(3, Conexion);
                //cmbDepartamentos.AddRange(cd_CatGenral.ObtenerCatalogoGeneral(4));
                List<CatalogoGeneralModel> cmbGerentes = cd_CatGenral.ObtenerLideres(Usuario, Conexion);
                List<CatalogoGeneralModel> cmbTiposUsuario = cd_CatGenral.ObtenerTiposUsuario(Conexion);
                List<CatalogoGeneralModel> cmbAutorizacionesTipo1 = cd_CatGenral.ObtenerAutorizacionesRequisiciones(1, Conexion);
                List<CatalogoGeneralModel> cmbAutorizacionesTipo2 = cd_CatGenral.ObtenerAutorizacionesRequisiciones(2, Conexion);
                List<CatalogoGeneralModel> cmbNivel = cd_CatGenral.ObtenerNiveles(Conexion);
                int Licencias = 0;
                int Activos = 0;

                cd_Usuario.ObtenerLicencias(ref Licencias, ref Activos, Usuario.IdOrganizacion, Conexion);

                resultado["Exito"] = true;
                resultado["LstUsuarios"] = JsonConvert.SerializeObject(lstUsuarios);
                resultado["Licencias"] = Licencias;
                resultado["Activos"] = Activos;
                resultado["CmbDepartamentos"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(cmbDepartamentos);
                resultado["CmbGerentes"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(cmbGerentes);
                resultado["CmbTiposUsuario"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(cmbTiposUsuario);
                resultado["CmbAutorizacionesRequisiciones"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlComboxMultiple(cmbAutorizacionesTipo1);
                resultado["CmbAutorizacionesAvances"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlComboxMultiple(cmbAutorizacionesTipo2);
                resultado["CmbNivel"] = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(cmbNivel);

                return Content(resultado.ToString());
            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
                return Content(resultado.ToString());
            }
        }

        [HttpPost]
        public ActionResult ConsultarDatosUsuario(long idUsuario)
        {
            var resultado = new JObject();
            try
            {
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                if (!FuncionesGenerales.ValidaPermisos(2))
                {
                    resultado["Exito"] = false;
                    resultado["Advertencia"] = true;
                    resultado["Mensaje"] = Mensajes.MensajePermisoEditar();
                    return Content(resultado.ToString());
                }

                CD_Usuario cd_Usuario = new CD_Usuario();


                UsuarioModel datosUsuario = cd_Usuario.ConsultarUsuario(idUsuario, Conexion);
                var @directorio = @"~\Archivos\Fotos\";
                var @directorio2 = @"~..\..\Archivos\Fotos\";

                var foto = datosUsuario.NumEmpleado + ".jpg";

                bool existe = System.IO.File.Exists(Server.MapPath(directorio + foto));

                if (existe)
                {
                    datosUsuario.FotoUrl = @directorio2 + foto;
                }
                else
                {
                    datosUsuario.FotoUrl = @directorio2 + "default.jpg";
                }



                resultado["Exito"] = true;
                resultado["Advertencia"] = false;
                resultado["DatosUsuario"] = JsonConvert.SerializeObject(datosUsuario);

                return Content(resultado.ToString());


            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Aveertencia"] = false;
                resultado["Mensaje"] = ex.Message;
                return Content(resultado.ToString());
            }
        }

        public ActionResult LeerCostos(long idUsuario)
        {
            try
            {
                var usuario = new CD_Usuario().LeerCostos(idUsuario, conexionEF);

                return Json(new { Exito = true, Usuario = usuario });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult GuardarCostos(UsuarioModel costos)
        {
            try
            {
                costos.IdUCreo = idUsuario;
                var (estatus, mensaje) = new CD_Usuario().GuardarCostos(costos, conexionEF);

                return Json(new { Exito = estatus, Mensaje = mensaje });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult ConsultarPerfil(long IdUsuario)
        {

            var resultado = new JObject();
            try
            {

                CD_Usuario cd_Usuario = new CD_Usuario();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                UsuarioModel datosUsuario = cd_Usuario.ConsultarUsuario(IdUsuario, Conexion);
                //var directorio = "http://app.yitpro.com/Archivos/Fotos/";
                //var directorio2 ="http://app.yitpro.com/Archivos/Fotos/";

                //var foto = datosUsuario.NumEmpleado + ".jpg";



                //if (existe)
                //{
                datosUsuario.FotoUrl = "http://app.yitpro.com/Archivos/Fotos/" + datosUsuario.NumEmpleado + ".jpg";
                //}
                //else
                //{
                //    datosUsuario.FotoUrl = @directorio2 + "default.jpg";
                //}


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

                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                //string conexion = ConfigurationManager.ConnectionStrings["BDProductividad"].ToString();
                string conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionSP);
                string conexionef = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                var cd_Graf = new CD_Graficas();
                List<GraficaConsultaModel> LstGraficas = new List<GraficaConsultaModel>();
                var resultadoConsultar = cd_Graf.ConsultarGraficas(filtroGraficas, conexion, ref LstGraficas);


                CD_Actividad cd_act = new CD_Actividad();
                List<ActividadesModel> LstActividades = new List<ActividadesModel>();
                List<ActividadesModel> LstBugs = new List<ActividadesModel>();
                List<ActividadComentarioModel> LstComentarios = new List<ActividadComentarioModel>();

                List<UsuarioFeelsModel> LstFeels = cd_Usuario.ConsultaFeels(IdUsuario, conexionef);
                List<UsuarioFeelsModel> LstFeedback = cd_Usuario.ConsultaFeedback(IdUsuario, conexionef);
                int r = cd_act.ConsultaActividadesInicio(ref LstActividades, ref LstBugs, ref LstComentarios, Usuario, IdUsuario, conexion);


                var LstEventos = FuncionesGenerales.ConvierteEventosCalendario(LstActividades);

                var url = ConfigurationManager.AppSettings["UrlSistema"];

                string Bugs = FuncionesGenerales.ConvierteListaTareas2(LstBugs, url);

                string Comentarios = FuncionesGenerales.ConvierteListaComentarios2(LstComentarios);

                resultado["Exito"] = true;
                resultado["Advertencia"] = false;
                resultado["DatosUsuario"] = JsonConvert.SerializeObject(datosUsuario);
                resultado["Graficas"] = JsonConvert.SerializeObject(LstGraficas);
                resultado["Feels"] = JsonConvert.SerializeObject(LstFeels);
                resultado["Feedback"] = JsonConvert.SerializeObject(LstFeedback);

                resultado["Bugs"] = Bugs;
                resultado["Comentarios"] = Comentarios;
                resultado["NumTareasA"] = LstActividades.Where(w => w.Tipo == 0).Count();
                resultado["NumTareasH"] = LstActividades.Where(w => w.Tipo == 1).Count();
                resultado["NumTareasS"] = LstActividades.Where(w => w.Tipo == 2).Count();
                resultado["NumTareas"] = LstActividades.Count();
                resultado["NumComentarios"] = LstComentarios.Count();
                resultado["NumBugs"] = LstBugs.Count();
                resultado["Eventos"] = JsonConvert.SerializeObject(LstEventos);


                return Content(resultado.ToString());


            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Aveertencia"] = false;
                resultado["Mensaje"] = ex.Message;
                return Content(resultado.ToString());
            }
        }

        [HttpPost]
        public ActionResult GuardarDatosUsuario(UsuarioModel datosUsuario)
        {
            var resultado = new JObject();
            try
            {
                if (datosUsuario.IdTipoUsuario == 0)
                {
                    if (!FuncionesGenerales.ValidaPermisos(1))
                    {
                        resultado["Exito"] = false;
                        resultado["Advertencia"] = true;
                        resultado["Mensaje"] = Mensajes.MensajePermisoGuardar();
                        return Content(resultado.ToString());
                    }
                }
                else
                {
                    if (!FuncionesGenerales.ValidaPermisos(2))
                    {
                        resultado["Exito"] = false;
                        resultado["Advertencia"] = true;
                        resultado["Mensaje"] = Mensajes.MensajePermisoEditar();
                        return Content(resultado.ToString());
                    }
                }


                datosUsuario.Contrasena = EncriptaPass.EncriptaContrasena(Membership.GeneratePassword(5, 1));
                CD_Usuario cd_Usuario = new CD_Usuario();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                datosUsuario.IdOrganizacion = Usuario.IdOrganizacion;

                int respuesta = cd_Usuario.GuardarDatosUsuario(datosUsuario, Usuario.IdUsuario, Conexion);

                if (respuesta == 1)
                {
                    resultado["Exito"] = false;
                    resultado["Advertencia"] = true;
                    resultado["Mensaje"] = "Se encuentra repetido el mismo número de empleado.";
                }
                else if (respuesta == 2)
                {
                    resultado["Exito"] = false;
                    resultado["Advertencia"] = true;
                    resultado["Mensaje"] = "Se encuentra repetido el mismo correo electrónico.";
                }
                else if (respuesta == 3)
                {
                    resultado["Exito"] = false;
                    resultado["Advertencia"] = true;
                    resultado["Mensaje"] = "No cuenta con licencias disponibles.";
                }

                else if (respuesta == 99)
                {
                    resultado["Exito"] = true;
                    resultado["NomFoto"] = datosUsuario.NumEmpleado;
                    resultado["Mensaje"] = Mensajes.MensajeGuardadoExito();
                }

                else
                {
                    //enviar correo
                    if (datosUsuario.IdUsuario != 0)
                    {
                        resultado["Exito"] = true;
                        resultado["NomFoto"] = datosUsuario.NumEmpleado;
                        resultado["Mensaje"] = Mensajes.MensajeGuardadoExito();
                    }
                    else if (FuncionesGenerales.EnviarCorreoRegistro(datosUsuario, Conexion))
                    {
                        resultado["Exito"] = true;
                        resultado["NomFoto"] = datosUsuario.NumEmpleado;
                        resultado["Mensaje"] = Mensajes.MensajeGuardadoExito();
                    }
                    else
                    {
                        resultado["Exito"] = false;
                        resultado["Advertencia"] = true;
                        resultado["Mensaje"] = "No se realizó el envió de contraseña, verifique la configuración de servidor de correo.";
                    }
                }

                return Content(resultado.ToString());


            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Advertencia"] = false;
                resultado["Mensaje"] = ex.Message;
                return Content(resultado.ToString());
            }
        }
        [HttpPost]
        public ActionResult CambiarContrasena(UsuarioModel datosUsuario)
        {
            var resultado = new JObject();
            try
            {

                if (!FuncionesGenerales.ValidaPermisos(2))
                {
                    resultado["Exito"] = false;
                    resultado["Advertencia"] = true;
                    resultado["Mensaje"] = Mensajes.MensajePermisoEditar();
                    return Content(resultado.ToString());
                }


                datosUsuario.ContrasenaNueva = EncriptaPass.EncriptaContrasena(datosUsuario.ContrasenaNueva);

                CD_Usuario cd_Usuario = new CD_Usuario();
                var idULogin = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.IdUsuario;
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                string respuesta = cd_Usuario.CambiarContraseña(datosUsuario, idULogin, Conexion);

                if (respuesta != string.Empty)
                {
                    resultado["Exito"] = false;
                    resultado["Advertencia"] = true;
                    resultado["Mensaje"] = respuesta;

                }
                else
                {

                    var datosUsuarioCambio = cd_Usuario.ConsultarUsuario(datosUsuario.IdUsuario, Conexion);
                    //enviar correo
                    if (FuncionesGenerales.EnviarCorreoContrasenaNuea(datosUsuarioCambio, Conexion))
                    {
                        resultado["Exito"] = true;
                        resultado["Mensaje"] = Mensajes.MensajeGuardadoExito();
                    }
                    else
                    {
                        resultado["Exito"] = false;
                        resultado["Advertencia"] = true;
                        resultado["Mensaje"] = "No se realizó el envió de contraseña, verifique la configuración de servidor de correo.";
                    }
                }

                return Content(resultado.ToString());


            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Advertencia"] = false;
                resultado["Mensaje"] = ex.Message;
                return Content(resultado.ToString());
            }
        }

        [HttpPost]
        public ActionResult ConsultarPermisos(long idUsuario)
        {
            var resultado = new JObject();
            try
            {
                if (!FuncionesGenerales.ValidaPermisos(2))
                {
                    resultado["Exito"] = false;
                    resultado["Advertencia"] = true;
                    resultado["Mensaje"] = Mensajes.MensajePermisoEditar();
                    return Content(resultado.ToString());
                }

                CD_Usuario cd_Usuario = new CD_Usuario();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                List<UsuarioPermisosModel> lstPermisosU = cd_Usuario.ConsultarPermisos(idUsuario, Conexion);
                resultado["Exito"] = true;
                resultado["LstPermisos"] = JsonConvert.SerializeObject(lstPermisosU);

                return Content(resultado.ToString());


            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Aveertencia"] = false;
                resultado["Mensaje"] = ex.Message;
                return Content(resultado.ToString());
            }
        }

        [HttpPost]
        public ActionResult GuardarPermisos(List<UsuarioPermisosModel> lstPermisos)
        {
            var resultado = new JObject();

            try
            {
                if (!FuncionesGenerales.ValidaPermisos(2))
                {
                    resultado["Exito"] = false;
                    resultado["Advertencia"] = true;
                    resultado["Mensaje"] = Mensajes.MensajePermisoEditar();
                }
                else
                {
                    CD_Usuario cd_Usuario = new CD_Usuario();
                    string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                    cd_Usuario.GuardarPermisos(lstPermisos, Conexion);

                    resultado["Exito"] = true;
                    resultado["Mensaje"] = Mensajes.MensajeGuardadoExito();

                    var sesion = Session["usuario" + Session.SessionID] as Models.Sesion;
                    sesion.Menu = cd_Usuario.ObtenerMenuUsuario(sesion.Usuario.IdUsuario, Conexion);
                    Session["usuario" + Session.SessionID] = sesion;
                }
            }
            catch (Exception ex)
            {
                resultado["Exito"] = false;
                resultado["Aveertencia"] = false;
                resultado["Mensaje"] = ex.Message;
            }

            return Content(resultado.ToString());
        }

        [HttpPost]
        public ActionResult ActualizaContrasenia(string ContrasenaAnterior, string ContrasenaNueva)
        {
            var resultado = new JObject();
            try
            {

                var ContraseniaAnteriorEnc = EncriptaPass.EncriptaContrasena(ContrasenaAnterior);
                var Usuario = ((Models.Sesion)Session["Usuario" + Session.SessionID]).Usuario;
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                var ContraseniaNuevaEnc = EncriptaPass.EncriptaContrasena(ContrasenaNueva);

                if (ContraseniaAnteriorEnc != Usuario.Contrasena)
                {
                    resultado["Exito"] = false;
                    resultado["Mensaje"] = "La contraseña anterior es incorrecta.";
                    return Content(resultado.ToString());

                }


                if (ContraseniaNuevaEnc == Usuario.Contrasena)
                {
                    resultado["Exito"] = false;
                    resultado["Mensaje"] = "La nueva contraseña no puede ser igual a la anterior.";
                    return Content(resultado.ToString());

                }

                CD_Configuracion cd_conf = new CD_Configuracion();

                int Caracteres = int.Parse(cd_conf.ObtenerConfiguracionID(9, Conexion));

                if (ContrasenaNueva.Length < Caracteres)
                {
                    resultado["Exito"] = false;
                    resultado["Mensaje"] = "La contraseña debe contener al menos " + Caracteres.ToString() + " caracteres."; ;
                    return Content(resultado.ToString());
                }

                CD_Usuario cd_usuario = new CD_Usuario();

                bool Exito = cd_usuario.ActualizaContrasena(ContraseniaNuevaEnc, Usuario.IdUsuario, Conexion);

                Usuario.Contrasena = ContraseniaNuevaEnc;
                Usuario.FechaContrasena = DateTime.Now;

                Session["CV" + Session.SessionID] = 0;

                ((Models.Sesion)Session["Usuario" + Session.SessionID]).Usuario = Usuario;

                resultado["Exito"] = true;
                resultado["Mensaje"] = "La contraseña se actualizo correctamente.";
                return Content(resultado.ToString());

            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Mensaje"] = ex.Message;
                return Content(resultado.ToString()); ;
            }
        }

        public ActionResult GuardaFoto(HttpPostedFileBase Foto, string NomFoto)
        {

            var resultado = "";

            try
            {

                var path = Server.MapPath("~/Archivos/Fotos");
                if (Foto != null)
                {

                    string[] nombre = NomFoto.Split('\\');
                    var longitud = nombre.Count();
                    var archivo = nombre[longitud - 1] + ".jpg";
                    var url = Path.Combine(path, archivo);
                    Foto.SaveAs(url);
                }

                resultado = "1";

                return Content(resultado.ToString());


            }
            catch (Exception ex)
            {

                resultado = ex.Message;
                return Content(resultado.ToString());
            }
        }

        public ActionResult UsuarioCosto()
        {
            Session["Controlador" + Session.SessionID] = "Usuarios";
            if (!FuncionesGenerales.SesionActiva() || !FuncionesGenerales.ValidaPermisos(Permiso.Ver))
                return RedirectToAction("Index", "Home");

            return View();
        }




        public ActionResult LeerUsuarioCostoFaltante(long? idUsuario)
        {
            try
            {
                var usuarios = new CD_Usuario().LeerUsuarioCostoFaltante(idUsuario, conexionEF);
                var combo = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(
                    usuarios.Select(x => new CatalogoGeneralModel { IdCatalogo = x.IdUsuario, DescLarga = x.Nombre }).ToList());

                return Json(new { Exito = true, Combo = combo });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult LeerUsuarioCosto()
        {
            try
            {
                var usuarios = new CD_Usuario().LeerUsuarioCosto(conexionEF);

                return Json(new { Exito = true, Usuarios = usuarios });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult CrearUsuarioCosto(UsuarioCostoModel usuarioCosto)
        {
            try
            {
                var (estaus, mensaje) = new CD_Usuario().CrearUsuarioCosto(usuarioCosto, idUsuario, conexionEF);

                return Json(new { Exito = estaus, Mensaje = mensaje });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult EditarUsuarioCosto(UsuarioCostoModel usuarioCosto)
        {
            try
            {
                var (estatus, mensaje) = new CD_Usuario().EditarUsuarioCosto(usuarioCosto, idUsuario, conexionEF);

                return Json(new { Exito = estatus, Mensaje = mensaje });
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult ImportarUsuarioCosto(HttpPostedFileBase archivo, char tipo)
        {
            try
            {
                if (archivo == null) return Json(new { Exito = false, Mensaje = "El archivo es requerido" });
                if (archivo.ContentType != MimeType.XLSX) return Json(new { Exito = false, Mensaje = "La extensión del archivo debe ser .XSLX" });

                var (costos, estatusLectura, mensajeLectura) =
                    Importar.ImportarUsuarioCosto(archivo, tipo, idUsuario, conexionEF);

                if (estatusLectura)
                {
                    var (estatus, mensaje) = new CD_Usuario().ImportarUsuarioCosto(costos, tipo, conexionEF);
                    return Json(new { Exito = estatus, Mensaje = mensaje });
                }
                else
                {
                    return Json(new { Exito = estatusLectura, Mensaje = mensajeLectura });
                }
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult DescargarExcelUsuarioCosto()
        {
            try
            {
                var _costos = new CD_Usuario().LeerUsuarioCosto(conexionEF);
                var costos = ObtenerObjetoDescarga(_costos);
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

        private object ObtenerObjetoDescarga(List<UsuarioCostoModel> costos)
        {
            return
                costos.Select(x => new
                {
                    Id = x.IdUsuarioCosto,
                    ClaveUsuario = x.Clave,
                    Usuario = x.Nombre,
                    SueldoMensual = x.CostoMensual,
                    SueldoHora = x.CostoHora
                }).OrderBy(x => x.Id).ToList();
        }

        public ActionResult RegistrarAsistencia(int Tipo)
        {
            var resultado = new JObject();
            try
            {

                CD_Usuario cd_Usuario = new CD_Usuario();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                int Resultado = cd_Usuario.RegistraAsistencia(Usuario.IdUsuario, Tipo, Encripta.DesencriptaDatos(Usuario.ConexionEF));
                bool Exito = false;
                string Mensaje = string.Empty;

                switch (Resultado)
                {

                    case 1:
                        Exito = true;
                        Mensaje = "Se registro la entrada correctamente.</br> Buen día :)";
                        break;
                    case 2:
                        Exito = true;
                        Mensaje = "Se registro tú salida a comer correctamente. </br> Provecho :)";
                        break;
                    case 3:
                        Exito = true;
                        Mensaje = "Se registro la entrada correctamente, </br> Bienvenido de vuelta";
                        break;
                    case 4:
                        Exito = true;
                        Mensaje = "Se registro tú salida correctamente. </br> Hasta mañana :)";
                        break;
                    case -1:
                        Exito = false;
                        Mensaje = "No se puede registrar ya que aún no hay una entrada capturada.";
                        break;
                    case -2:
                        Exito = false;
                        Mensaje = "No se puede registrar ya que aún no hay una entrada capturada. ";
                        break;
                    case -3:
                        Exito = false;
                        Mensaje = "No se puede registrar ya que aún no hay una salida a comer capturada.";
                        break;
                    case -4:
                        Exito = false;
                        Mensaje = "No se puede registrar ya que aún no hay una ebtrada desoués de  comer capturada.";
                        break;


                }

                resultado["Exito"] = Exito;
                resultado["Mensaje"] = Mensaje;



            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Aveertencia"] = false;
                resultado["Mensaje"] = ex.Message;
            }

            return Content(resultado.ToString());
        }
        public ActionResult ConsultaAsistencia()
        {
            var resultado = new JObject();
            try
            {

                CD_Usuario cd_Usuario = new CD_Usuario();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                UsuarioAsistenciaModel UA = new UsuarioAsistenciaModel();

                UA = cd_Usuario.ConsultaAsistencia(Usuario.IdUsuario, DateTime.Now, Encripta.DesencriptaDatos(Usuario.ConexionEF));


                resultado["Exito"] = true;
                resultado["Asistencia"] = JsonConvert.SerializeObject(UA);



            }
            catch (Exception ex)
            {

                resultado["Exito"] = false;
                resultado["Aveertencia"] = false;
                resultado["Mensaje"] = ex.Message;
            }

            return Content(resultado.ToString());
        }

        public ActionResult ConsultaListaIncidencias()
        {

            var resultado = new JObject();
            try
            {

                CD_Usuario cd_user = new CD_Usuario();

                List<UsuarioIncidenciasModel> LstIncidencias = new List<UsuarioIncidenciasModel>();

                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                LstIncidencias = cd_user.ConsultaIncidenciasFecha(DateTime.Now, null, Conexion);




                resultado["Exito"] = true;
                resultado["LstIncidencias"] = JsonConvert.SerializeObject(LstIncidencias);



                return Content(resultado.ToString());

            }
            catch (Exception)
            {


                resultado["Exito"] = false;
                resultado["Mensaje"] = "Error al consultar las incidencias.";

                return Content(resultado.ToString());

            }

        }

        public ActionResult ConsultaListaIncidenciasRango(ControlAsistenciaModel Filtros)
        {

            var resultado = new JObject();
            try
            {

                CD_Usuario cd_user = new CD_Usuario();

                List<UsuarioIncidenciasModel> LstIncidencias = new List<UsuarioIncidenciasModel>();

                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                LstIncidencias = cd_user.ConsultaIncidenciasRango(Filtros, Conexion);




                resultado["Exito"] = true;
                resultado["LstIncidencias"] = JsonConvert.SerializeObject(LstIncidencias);



                return Content(resultado.ToString());

            }
            catch (Exception)
            {


                resultado["Exito"] = false;
                resultado["Mensaje"] = "Error al consultar las incidencias.";

                return Content(resultado.ToString());

            }

        }
        public ActionResult ConsultaListaIncidenciasMes(ControlAsistenciaModel Filtros)
        {

            var resultado = new JObject();
            try
            {

                CD_Usuario cd_user = new CD_Usuario();

                List<UsuarioIncidenciasModel> LstIncidencias = new List<UsuarioIncidenciasModel>();

                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);

                LstIncidencias = cd_user.ConsultaIncidenciasMes(Filtros, Conexion);


                resultado["Exito"] = true;
                resultado["LstIncidencias"] = JsonConvert.SerializeObject(LstIncidencias);



                return Content(resultado.ToString());

            }
            catch (Exception)
            {


                resultado["Exito"] = false;
                resultado["Mensaje"] = "Error al consultar las incidencias.";

                return Content(resultado.ToString());

            }

        }

        #region CostoMensual

        public ActionResult UsuarioCostoMensual()
        {
            Session["Accion" + Session.SessionID] = "UsuarioCostoMensual";



            if (!FuncionesGenerales.SesionActiva())
            {
                return RedirectToAction("Index", "Login");
            }


            if (!FuncionesGenerales.ValidaPermisosAccion(0))
            {
                return RedirectToAction("Unauthorized", "ERROR");
            }

            //if (!FuncionesGenerales.SesionActiva() || !FuncionesGenerales.ValidaPermisos(Permiso.Ver))
            //    return RedirectToAction("Index", "Home");

            CD_CatalogoGeneral cd_gen = new CD_CatalogoGeneral();
            var Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);


            List<CatalogoGeneralModel> LstAnios = cd_gen.ObtenerAnios(conexionEF);
            var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
            List<CatalogoGeneralModel> LstProyectos = cd_gen.ObtenerProyectosPorUsuarioTODOS(Usuario, Conexion);


            var Mes = DateTime.Now.Month - 1;

            ViewBag.LstAnios = LstAnios;
            ViewBag.Anio = Mes == -0 ? DateTime.Now.Year - 1 : DateTime.Now.Year;
            ViewBag.Mes = Mes == -0 ? 12 : Mes;
            ViewBag.LstProyectos = LstProyectos;


            return View();
        }


        public ActionResult ObtieneUsuarioCostoMensual(int Anio, int Mes)
        {
            var Resultado = new JObject();
            try
            {

                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }


                CD_Usuario cd_usu = new CD_Usuario();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                List<UsuarioCostoMensualModel> LstCostoMensualUsuario = new List<UsuarioCostoMensualModel>();

                LstCostoMensualUsuario = cd_usu.ObtieneCostosMensuales(Anio, Mes, Usuario.IdUsuario, Usuario.IdTipoUsuario, Encripta.DesencriptaDatos(Usuario.ConexionEF));
                var Total = LstCostoMensualUsuario.Sum(s => s.CostoMensual);

                return Json(new { Exito = true, LstCostosUsuario = LstCostoMensualUsuario, Total = Total });


            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }

        }
        public ActionResult ObtieneUsuarioCostoAnual(int Anio)
        {
            var Resultado = new JObject();
            try
            {

                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }


                CD_Usuario cd_usu = new CD_Usuario();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                List<CostoAnualModel> LstCostoMensualUsuario = new List<CostoAnualModel>();

                LstCostoMensualUsuario = cd_usu.ObtieneCostosAnuales(Anio, Usuario.IdUsuario, Usuario.IdTipoUsuario, Encripta.DesencriptaDatos(Usuario.ConexionEF));
                var Total = LstCostoMensualUsuario.Sum(s => s.TotalCosto);

                return Json(new { Exito = true, LstCostosUsuario = LstCostoMensualUsuario, Total });


            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }

        }
        public ActionResult ImportarUsuarioCostoMensual(HttpPostedFileBase archivo, int Anio, int Mes)
        {
            try
            {
                if (archivo == null) return Json(new { Exito = false, Mensaje = "El archivo es requerido" });
                if (archivo.ContentType != MimeType.XLSX) return Json(new { Exito = false, Mensaje = "La extensión del archivo debe ser .XLSX" });

                var (costos, estatusLectura, mensajeLectura) =
                    Importar.ImportarUsuarioCostoMensual(archivo, Anio, Mes, idUsuario, conexionEF);

                if (estatusLectura)
                {
                    var (estatus, mensaje) = new CD_Usuario().ImportarUsuarioCostoMensual(costos, Anio, Mes, conexionEF);



                    return Json(new { Exito = estatus, Mensaje = mensaje });
                }
                else
                {
                    return Json(new { Exito = estatusLectura, Mensaje = mensajeLectura });
                }
            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }
        }

        public ActionResult EliminaDistribucionCosto(long IdUsuario, int Anio, int Mes)
        {
            try
            {
                var (estatus, mensaje) = new CD_Usuario().EliminaDistribucionCosto(IdUsuario, Anio, Mes, conexionEF);
                return Json(new { Exito = estatus, Mensaje = mensaje });

            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }

        }


        public ActionResult DescargarExcelUsuarioCostoMensual(int Anio, int Mes)
        {
            try
            {
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                var _costos = new CD_Usuario().ObtieneCostosMensuales(Anio, Mes, Usuario.IdUsuario, Usuario.IdTipoUsuario, Encripta.DesencriptaDatos(Usuario.ConexionEF));
                var costos = ObtenerObjetoDescargaCostoMensual(_costos);
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

        private object ObtenerObjetoDescargaCostoMensual(List<UsuarioCostoMensualModel> costos)
        {
            return
                costos.Select(x => new
                {

                    Clave = x.Clave,
                    Nombre = x.Nombre,
                    Distribucion = string.Join<string>(", ", x.LstDistrbucion.ConvertAll(s => s.Proyecto + " - " + s.Porcentaje.ToString() + "%")),
                    Costo = x.CostoMensual
                }).OrderBy(x => x.Clave).ToList();
        }

        public ActionResult DescargarExcelEjemploUsuarioCostoMensual()
        {
            try
            {
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                var _costos = new CD_Usuario().ConsultaUsuariosCostoMensual(Encripta.DesencriptaDatos(Usuario.ConexionEF));
                var costos = ObtenerObjetoDescargaCostoPlantillaMensual(_costos);
                var tabla = FuncionesGenerales.CrearTabla(costos, "Costos");
                var excel = Reportes.CrearExcel(tabla);

                return File(excel, MimeType.XLSX, "CostosEjemplo.xlsx");
            }
            catch (Exception e)
            {
                Response.StatusCode = 400;
                Response.StatusDescription = e.Message;
                return Content(e.Message);
            }
        }


        private object ObtenerObjetoDescargaCostoPlantillaMensual(List<UsuarioCostoMensualModel> costos)
        {
            return
                costos.Select(x => new
                {

                    Clave = x.Clave,
                    Nombre = x.Nombre,
                    Costo = x.CostoMensual,
                }).OrderBy(x => x.Clave).ToList();
        }

        public ActionResult ObtieneDistribucionCosto(int Anio, int Mes, int IdUsuario)
        {
            var Resultado = new JObject();
            try
            {

                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }


                CD_Usuario cd_usu = new CD_Usuario();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;
                List<UsuarioCostoDistribucionModel> LstCosto = new List<UsuarioCostoDistribucionModel>();

                LstCosto = cd_usu.ObtieneDistribucionCosto(IdUsuario, Anio, Mes, Encripta.DesencriptaDatos(Usuario.ConexionSP));


                return Json(new { Exito = true, LstCosto = LstCosto });


            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }

        }


        public ActionResult GuardarDistribucionCosto(List<UsuarioCostoDistribucionModel> LstCosto, int Anio, int Mes, int IdUsuario)
        {
            var Resultado = new JObject();
            try
            {

                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }


                var Total = LstCosto.Sum(s => s.Porcentaje);

                if (Total != 100)
                {

                    return Json(new { Exito = false, Mensaje = "El porcentaje de la distribución debe de sumar 100% , VALOR ACTUAL: " + Total.ToString() });

                }

                CD_Usuario cd_usu = new CD_Usuario();
                var Usuario = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;

                bool Exito = cd_usu.GuardarDistribucionCosto(LstCosto, Anio, Mes, IdUsuario, Usuario.IdUsuario, Encripta.DesencriptaDatos(Usuario.ConexionEF));


                return Json(new { Exito = true });


            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }

        }

        #endregion

        #region UsuarioFeels
        public ActionResult GuardarFeels(UsuarioFeelsModel Usuario)
        {
            var Resultado = new JObject();
            try
            {

                if (!FuncionesGenerales.SesionActiva())
                {
                    return RedirectToAction("Index", "Login");
                }

                CD_Usuario cd_usu = new CD_Usuario();
                var user = ((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario;


                Usuario.IdUsuario = user.IdUsuario;
                Usuario.Fecha = DateTime.Now;

                bool Exito = cd_usu.GuardarFeels(Usuario, Encripta.DesencriptaDatos(user.ConexionEF));
                Session["CapturaF" + Session.SessionID] = 0;

                return Json(new { Exito = true });


            }
            catch (Exception e)
            {
                return Json(new { Exito = false, Mensaje = e.InnerException?.ToString() ?? e.Message });
            }

        }

        #endregion

    }
}