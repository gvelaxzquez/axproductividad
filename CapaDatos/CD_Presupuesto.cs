using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CapaDatos.DataBaseModel;
using CapaDatos.Models;
using EntityFramework.Extensions;

namespace CapaDatos
{
    public class CD_Presupuesto
    {
        public bool GuardarPresupuesto(int Anio, int Mes, List<Presupuestos> LstPresupuesto)
        {
            try
            {
                bool Exito = false; 
                //Primero elimino todos aquellos que sean del mes y año seleccionados y despues guardo los nuevos
                using (var contexto = new BDProductividad_DEVEntities())
                {
                    contexto.Configuration.LazyLoadingEnabled = false;
                    contexto.Presupuestos.Where(i => i.Anio == Anio && i.Mes == Mes).Delete();
                    contexto.SaveChanges();

                    contexto.Presupuestos.AddRange(LstPresupuesto);

                    contexto.SaveChanges();


                    Exito = true;
                }

            return Exito;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public void ConsultaPresupuesto(long IdDepartamento, long IdProductoServicio, ref PresupuestoModel Presupuesto, ref List<RequisicionesModel> lstRequisicion)
        {
            try
            {

                using (var contexto = new BDProductividad_DEVEntities())
                {
                    int n = 0;
                    decimal des = 0;
                    contexto.Configuration.LazyLoadingEnabled = false;

                    int Cuenta = int.Parse(contexto.ProductoServicio.Where(i => i.IdProServ == IdProductoServicio).Select(s => s.Cuenta).FirstOrDefault().ToString());
                    var depto = contexto.CatalogoGeneral.Where(i => i.IdCatalogo == IdDepartamento).Select(s => s.DatoEspecial).FirstOrDefault();

                    int Departamento = int.TryParse(depto, out n) == true ? int.Parse(depto) : 0;
                    int Anio = DateTime.Now.Year;
                    int Mes = DateTime.Now.Month;

                    decimal PresupuestoAsignado = contexto.Presupuestos.Where(i => i.Anio == Anio && i.Mes == Mes && i.Cuenta == Cuenta && i.Departamento == Departamento).FirstOrDefault() != null ? contexto.Presupuestos.Where(i => i.Anio == Anio && i.Mes == Mes && i.Cuenta == Cuenta && i.Departamento == Departamento).Select(s => s.Presupuesto).FirstOrDefault() : 0;
                    var util = contexto.Requisicion
                                                   .Where(i => i.DepartamentoId == IdDepartamento
                                                                 && i.IdProServ == IdProductoServicio
                                                                 && i.FechaCierre.Value.Month == Mes
                                                                 && i.FechaCierre.Value.Year == Anio
                                                                 && i.Estatus == "P").ToList().Sum(k => k.OrdenCompraMonto * k.CambioFinal).ToString();

                    decimal PresupuestoUtilizado = decimal.TryParse(util, out des) == true ? decimal.Parse(util) : 0;

                    var res = (from requisiciones in contexto.Requisicion
                               where requisiciones.DepartamentoId == IdDepartamento &&
                                requisiciones.IdProServ == IdProductoServicio &&
                                requisiciones.Estatus == "A"
                               select new RequisicionesModel
                               {
                                   OrdenCompraMonto = contexto.RequisicionDetalle.Where(r => r.IdRequisicion == requisiciones.IdRequisicion && r.Estatus != "R" && r.Activo == true).Sum(k => (k.Cantidad * k.CostoUnitario)) * requisiciones.Cambio
                               }).Sum(k => k.OrdenCompraMonto).ToString();
              
                    decimal PresupuestoReservado = decimal.TryParse(res, out des) == true ? decimal.Parse(res) : 0;

                    decimal PresupuestoDisponible = PresupuestoAsignado - (PresupuestoUtilizado + PresupuestoReservado);

                    var lst = (from requisiciones in contexto.Requisicion
                               where requisiciones.DepartamentoId == IdDepartamento &&
                                     requisiciones.IdProServ == IdProductoServicio &&
                                     (requisiciones.Estatus == "V" || requisiciones.Estatus == "G")
                               select new RequisicionesModel {

                                   IdRequisicion = requisiciones.IdRequisicion,
                                   FechaGenero = requisiciones.FechaGenero,
                                   Estatus = requisiciones.Estatus == "V" ? "Válidada" : "Pendiente válidar",
                                   Prioridadstr = requisiciones.Prioridad == 0 ? "Baja" : "Alta",
                                   OrdenCompraMonto = contexto.RequisicionDetalle.Where(r => r.IdRequisicion == requisiciones.IdRequisicion && r.Estatus != "R" && r.Activo == true).Sum(k => k.Cantidad * k.CostoUnitario) * requisiciones.Cambio
                                }).OrderBy( k=> k.FechaGenero).ToList();


                    Presupuesto.Cuentastr = Departamento.ToString().PadLeft(3,'0') + " - " + Cuenta.ToString().PadLeft(4,'0');
                    Presupuesto.Presupuesto = PresupuestoAsignado;
                    Presupuesto.Utilizado = PresupuestoUtilizado;
                    Presupuesto.Reservado = PresupuestoReservado;
                    Presupuesto.Disponible = PresupuestoDisponible;
                    lstRequisicion = lst;


                    


                }



            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
    }
}
