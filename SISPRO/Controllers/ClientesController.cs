using System;
using System.Collections.Generic;
using System.Web.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using CapaDatos;
using AxProductividad.ClasesAuxiliares;
using CapaDatos.Models;
using System.Configuration;

namespace AxProductividad.Controllers
{
    public class ClientesController : Controller
    {
        // GET: Clientes
        public ActionResult Index()
        {
            ViewBag.NombreSistema = ConfigurationManager.AppSettings["NombreSistema"];
            Session["Controlador" + Session.SessionID] = "Clientes";
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

        public ActionResult ConsultaClientes() {

            var Resultado = new JObject();
            try
            {
                CD_Clientes cd_cte = new CD_Clientes();
                List<ClienteModel> LstClientes = new List<ClienteModel>();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                LstClientes = cd_cte.ConsultarClientes(Conexion);

                Resultado["Exito"] = true;
                Resultado["LstClientes"] = JsonConvert.SerializeObject(LstClientes);

                return Content(Resultado.ToString());


            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }

        }

        public ActionResult GuardarCliente(ClienteModel Cliente) {

            var Resultado = new JObject();
            try
            {
                #region validapermisos
                if (Cliente.IdCliente == 0)
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


                CD_Clientes cd_cte = new CD_Clientes();
                string Conexion = Encripta.DesencriptaDatos(((Models.Sesion)(Session["Usuario" + Session.SessionID])).Usuario.ConexionEF);
                int Respuesta  = cd_cte.GuardarCliente(Cliente, Conexion);

                Resultado["Exito"] = Respuesta == 1 ? true: false;
                Resultado["Advertencia"] = Respuesta == 2 ? true : false;
                Resultado["Mensaje"] = Respuesta== 1 ? Mensajes.MensajeGuardadoExito() : "Ya existe un cliente registrado con el mismo nombre.";

                return Content(Resultado.ToString());

            }
            catch (Exception ex)
            {

                Resultado["Exito"] = false;
                Resultado["Mensaje"] = ex.Message;

                return Content(Resultado.ToString());
            }

        }


    }
}