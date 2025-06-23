using System;
using System.Collections.Generic;
using System.Linq;
using CapaDatos.DataBaseModel;
using CapaDatos.Models;
using System.Data;


namespace CapaDatos
{
    public class CD_Clientes
    {
        public List<ClienteModel> ConsultarClientes(string Conexion)
        {
            try
            {
                List<ClienteModel> Lst = new List<ClienteModel>();


                using (var contexto = new BDProductividad_DEVEntities(Conexion))
                {

                    contexto.Configuration.LazyLoadingEnabled = false;
                    Lst = (from c in contexto.Cliente
                           select new ClienteModel
                           {

                               IdCliente = c.IdCliente,
                               Nombre = c.Nombre,
                               Activo = c.Activo


                           }).ToList();
                }

                return Lst;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public int GuardarCliente(ClienteModel cliente, string Conexion) {

            try
            {

                Cliente cte = new Cliente();

                using (var contexto = new BDProductividad_DEVEntities(Conexion)) {
                    contexto.Configuration.LazyLoadingEnabled = false;

                    if (cliente.IdCliente == 0)
                    {

                        var valcte = contexto.Cliente.Where(i => i.Nombre.ToUpper() == cliente.Nombre.ToUpper()).FirstOrDefault();

                        if (valcte != null) {

                            return 2;
                        }
                        cte.Nombre = cliente.Nombre;
                        cte.Activo = cliente.Activo;

                        contexto.Cliente.Add(cte);


                    }
                    else {

                        var valcte = contexto.Cliente.Where(i => i.Nombre.ToUpper() == cliente.Nombre.ToUpper() && i.IdCliente != cte.IdCliente).FirstOrDefault();

                        if (valcte != null)
                        {

                            return 2;
                        }

                        cte = contexto.Cliente.Where(c => c.IdCliente == cliente.IdCliente).FirstOrDefault();

                       

                        cte.Nombre = cliente.Nombre;
                        cte.Activo = cliente.Activo;

                    }

                    contexto.SaveChanges();

                }

                return 1;

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }
    }
}
