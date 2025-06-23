using System.Collections.Generic;
using CapaDatos.Models;

namespace AxProductividad.Models
{
    public class Sesion
    {
        public UsuarioModel Usuario;
        public List<MenuModel> Menu;
        public ConfiguracionModel Configuracion;
        public List<ActividadTipoModel> WorkItems;
        public List<QueryModel> Querys;
        public List<WorkSpaceModel> Workspaces;
        public int NoAlertas;
    }
}