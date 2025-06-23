
using CapaDatos;
using CapaDatos.DataBaseModel;
using CapaDatos.Models;
//using MoreLinq;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace AxProductividad.Controllers
{
    public class BaseController : Controller
    {
        // Datos de usuario
        protected long idUsuario;
        protected UsuarioModel usuario;
        protected string conexionEF;
        protected string conexionSP;
        protected List<long> proyectos;

        // Capa de datos
        protected CD_CatalogoGeneral cd_CatGeneral;
        protected CD_Proyecto cd_Proyecto;
        private CD_Base cd_Base;

        protected override void Initialize(RequestContext requestContext)
        {

            try
            {
                base.Initialize(requestContext);

                usuario = ((Models.Sesion)Session["Usuario" + Session.SessionID])?.Usuario;

                cd_CatGeneral = new CD_CatalogoGeneral();
                cd_Proyecto = new CD_Proyecto();
                cd_Base = new CD_Base();
                if (usuario != null)
                {
                    conexionEF = Encripta.DesencriptaDatos(usuario.ConexionEF);
                    conexionSP = Encripta.DesencriptaDatos(usuario.ConexionSP);
                    idUsuario = usuario.IdUsuario;
                    proyectos = cd_CatGeneral.ObtenerProyectosPorUsuario(usuario, conexionEF).Select(x => x.IdCatalogo).ToList(); // El IdCatalogo es el IdProyecto
                }
            }
            catch (Exception ex)
            {

                throw ex;
            }
     
        }

        public JsonResult Usuario()
        {
            try
            {
                return Json(new { usuario = usuario?.Correo ?? "" });
            }
            catch (Exception ex)
            {

                throw ex;
            }
          
        }

        protected async Task<string> LeerComboCatalogoGeneral(int idCatalogo, bool? activo = true, bool multiple = false, bool descCorta = false)
        {
            var catalogo = await cd_CatGeneral.ObtenerCatalogoGeneralAsync(idCatalogo, conexionEF, activo);
            var combo = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(catalogo, multiple, descCorta);

            return combo;
        }

        protected async Task<string> LeerComboGeneral<TEntity>(string conexionEF,
            Expression<Func<TEntity, CatalogoGeneralModel>> seleccion) where TEntity : class
        {
            var catalogo = await LeerQueryGeneral(conexionEF, seleccion);
            var combo = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(catalogo);

            return combo;
        }

        protected async Task<string> LeerComboGeneral<TEntity>(string conexionEF,
            Expression<Func<TEntity, bool>> condicion,
            Expression<Func<TEntity, CatalogoGeneralModel>> seleccion) where TEntity : class
        {
            var catalogo = await LeerQueryGeneral(conexionEF, condicion, seleccion);
            var combo = FuncionesGenerales.ConvierteCatalogoGeneralHtmlCombox(catalogo);

            return combo;
        }

        protected async Task<List<TResult>> LeerQueryGeneral<TEntity, TResult>(string conexionEF,
            Expression<Func<TEntity, bool>> condicion,
            Expression<Func<TEntity, TResult>> seleccion) where TEntity : class
        {
            return await cd_Base.LeerQueryGeneral(conexionEF, condicion, seleccion);
        }

        protected async Task<List<TResult>> LeerQueryGeneral<TEntity, TResult>(string conexionEF,
            Expression<Func<TEntity, TResult>> seleccion) where TEntity : class
        {
            return await cd_Base.LeerQueryGeneral(conexionEF, seleccion);
        }
    }
}