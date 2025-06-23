using CapaDatos.DataBaseModel;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos
{
    public class CD_Base
    {
        public async Task<List<TResult>> LeerQueryGeneral<TEntity, TResult>(string conexionEF,
            Expression<Func<TEntity, bool>> condicion,
            Expression<Func<TEntity, TResult>> seleccion) where TEntity : class
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var dbSet = contexto.Set<TEntity>();
                var respuesta = await dbSet.Where(condicion).Select(seleccion).ToListAsync();
                return respuesta;
            }
        }

        public async Task<List<TResult>> LeerQueryGeneral<TEntity, TResult>(string conexionEF,
            Expression<Func<TEntity, TResult>> seleccion) where TEntity : class
        {
            using (var contexto = new BDProductividad_DEVEntities(conexionEF))
            {
                contexto.Configuration.LazyLoadingEnabled = false;

                var dbSet = contexto.Set<TEntity>();
                var respuesta = await dbSet.Select(seleccion).ToListAsync();
                return respuesta;
            }
        }
    }
}
