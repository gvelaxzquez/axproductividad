using CapaDatos.DatabaseModel;
using CapaDatos.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos
{
    public class CD_Historicos
    {

        public List<RequisicionesModel> ObtenerRequisicionesUnMes(long idUsuarioLogin)
        {
            try
            {
                List<RequisicionesModel> lstRequisicones = new List<RequisicionesModel>();
                using (var contexto = new BDProductividad_DEVEntities())
                {
                    contexto.Configuration.LazyLoadingEnabled = false;
                    var lstAutorizaciones = contexto.UsuarioAutorizacion.Include("Autorizacion")
                                            .Where(au => au.IdUsuario == idUsuarioLogin && au.Autorizacion.Tipo == 1)
                                            .Select(au => new UsuarioAutorizacionModel
                                            {
                                                IdAutorizacion = au.IdAutorizacion,
                                                IdUA = au.IdUA,
                                                IdUsuario = au.IdUsuario,
                                                NombreAutorizacion = au.Autorizacion.Nombre
                                            }).ToList();
                    int permisoValidar = 0;
                    int permisoAprobar = 0;
                    int permisoCompras = 0;

                    foreach (var autorizacion in lstAutorizaciones)
                    {
                        switch (autorizacion.IdAutorizacion)
                        {
                            case 1:
                                permisoValidar = 1;
                                break;
                            case 2:
                                permisoAprobar = 1;
                                break;
                            case 3:
                                permisoCompras = 1;
                                break;
                        }
                    }


                    lstRequisicones = (from tblRequisiciones in contexto.Requisicion.Include("RequisicionDetalle").Include("CatalogoGeneral").Include("Usuario")
                                       where
                                       (tblRequisiciones.IdUCreo == idUsuarioLogin
                                       || (permisoValidar == 1 ? tblRequisiciones.RequisicionAutorizaciones.Where(a => a.IdAutorizacion == 1 && a.IdUAtendio != null).Select(a => a.IdRequisicion).ToList().Contains(tblRequisiciones.IdRequisicion) : tblRequisiciones.IdUCreo == idUsuarioLogin)
                                        || (permisoAprobar == 1 ? tblRequisiciones.RequisicionAutorizaciones.Where(a => a.IdAutorizacion == 2 && a.IdUAtendio != null).Select(a => a.IdRequisicion).ToList().Contains(tblRequisiciones.IdRequisicion) : tblRequisiciones.IdUCreo == idUsuarioLogin)
                                        || (permisoCompras == 1 ? tblRequisiciones.RequisicionAutorizaciones.Where(a => a.IdAutorizacion == 3 && a.IdUAtendio != null).Select(a => a.IdRequisicion).ToList().Contains(tblRequisiciones.IdRequisicion) : tblRequisiciones.IdUCreo == idUsuarioLogin)
                                       )
                                       select new RequisicionesModel

                                       {
                                           IdRequisicion = tblRequisiciones.IdRequisicion,
                                           TipoCompra = tblRequisiciones.TipoCompra,
                                           Estatus = tblRequisiciones.Estatus,
                                           DescripcionDepartamento = tblRequisiciones.CatalogoGeneral3.DescCorta,
                                           UsuarioCreo = tblRequisiciones.Usuario1.Nombre + " " + tblRequisiciones.Usuario1.ApPaterno + " " + tblRequisiciones.Usuario1.ApMaterno,
                                           Prioridad = tblRequisiciones.Prioridad,
                                           IdProveedor = tblRequisiciones.Proveedor.IdProveedor,
                                           NombreProveedor = tblRequisiciones.Proveedor.NombreComercial,
                                           CostoTotal = ((tblRequisiciones.RequisicionDetalle.Count == 0 ? 0 : tblRequisiciones.RequisicionDetalle.Sum(x => x.Cantidad * x.CostoUnitario)) * tblRequisiciones.Cambio),
                                           OrdenCompra = tblRequisiciones.OrdenCompra ?? 0,
                                           FechaGenero = tblRequisiciones.FechaCreo.Value,
                                           FechaCierre = tblRequisiciones.FechaCierre.Value,
                                           OrdenCompraFecha = tblRequisiciones.OrdenCompraFecha.Value,
                                           IdUCreo = tblRequisiciones.IdUCreo.Value
                                           ,
                                           ProductoServicio = tblRequisiciones.ProductoServicio,
                                       }).ToList();


                    var lstFinalFiltrada = lstRequisicones.GroupBy(x => x.IdRequisicion).Select(x => x.First()).ToList();

                    var fechaActual = DateTime.Now;
                    var fechaInicio = fechaActual.AddDays(-30);

                    var lstFinalFiltradaPorFecha = lstFinalFiltrada.Where(c => c.FechaGenero >= fechaInicio && c.FechaGenero <= fechaActual).ToList();

                    return lstFinalFiltradaPorFecha;

                }

            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        public int BuscarDatosHistoricos(HistoricosModel datosHistoricosBuscar, long idUsuarioLogin, ref List<RequisicionesModel> lstRequisicionesDevuelta)
        {
            try
            {
                List<RequisicionesModel> lstRequisicones = new List<RequisicionesModel>();
                using (var contexto = new BDProductividad_DEVEntities())
                {
                    contexto.Configuration.LazyLoadingEnabled = false;

                    var lstAutorizaciones = contexto.UsuarioAutorizacion.Include("Autorizacion")
                                               .Where(au => au.IdUsuario == idUsuarioLogin && au.Autorizacion.Tipo == 1)
                                               .Select(au => new UsuarioAutorizacionModel
                                               {
                                                   IdAutorizacion = au.IdAutorizacion,
                                                   IdUA = au.IdUA,
                                                   IdUsuario = au.IdUsuario,
                                                   NombreAutorizacion = au.Autorizacion.Nombre
                                               }).ToList();
                    int permisoValidar = 0;
                    int permisoAprobar = 0;
                    int permisoCompras = 0;
                    int Administrador = contexto.Usuario.Where(u => u.IdUsuario == idUsuarioLogin).Select(k => k.IdTipoUsuario).FirstOrDefault();
                    foreach (var autorizacion in lstAutorizaciones)
                    {
                        switch (autorizacion.IdAutorizacion)
                        {
                            case 1:
                                permisoValidar = 1;
                                break;
                            case 2:
                                permisoAprobar = 1;
                                break;
                            case 3:
                                permisoCompras = 1;
                                break;
                        }
                    }



                    List<long> datosOrdeCompraR = new List<long>();
                    List<long> datosOrdeCompraC = new List<long>();
                    long ordenCompraN = Convert.ToInt64(-1);

                    if (datosHistoricosBuscar.NoOrdenCompra != null)
                    {

                        try
                        {
                            if (datosHistoricosBuscar.NoOrdenCompra.Contains("-"))
                            {
                                datosOrdeCompraR.Clear();
                                var datosOC = datosHistoricosBuscar.NoOrdenCompra.Split('-');
                                foreach (var item in datosOC)
                                {
                                    datosOrdeCompraR.Add(Convert.ToInt64(item.Trim()));
                                }
                            }
                            else if (datosHistoricosBuscar.NoOrdenCompra.Contains(","))
                            {
                                datosOrdeCompraC.Clear();

                                var datosOC = datosHistoricosBuscar.NoOrdenCompra.Split(',');
                                foreach (var item in datosOC)
                                {
                                    datosOrdeCompraC.Add(Convert.ToInt64(item.Trim()));

                                }
                            }
                            else
                            {
                                ordenCompraN = Convert.ToInt64(datosHistoricosBuscar.NoOrdenCompra.Trim());
                            }
                        }
                        catch (Exception)
                        {
                            return 1;
                        }

                    }
                    List<long> datosNoRequisicionR = new List<long>();
                    List<long> datosNoRequisicionC = new List<long>();
                    long datosNoRequisicionN = -1;
                    if (datosHistoricosBuscar.NoRequisicion != null)
                    {
                        try
                        {

                            if (datosHistoricosBuscar.NoRequisicion.Contains("-"))
                            {
                                var dReq = datosHistoricosBuscar.NoRequisicion.Split('-');
                                foreach (var item in dReq)
                                {
                                    datosNoRequisicionR.Add(Convert.ToInt64(item.Trim()));
                                }


                            }
                            else if (datosHistoricosBuscar.NoRequisicion.Contains(","))
                            {
                                var dReq = datosHistoricosBuscar.NoRequisicion.Split(',');

                                foreach (var item in dReq)
                                {
                                    datosNoRequisicionC.Add(Convert.ToInt64(item.Trim()));
                                }


                            }
                            else
                            {
                                datosNoRequisicionN = (Convert.ToInt64(datosHistoricosBuscar.NoRequisicion.Trim()));

                            }
                        }
                        catch (Exception)
                        {

                            return 2;
                        }
                    }

                    List<decimal> datosCostoTotalR = new List<decimal>();
                    List<decimal> datosCostoTotalC = new List<decimal>();
                    decimal datosCostoTotalN = -1;

                    if (datosHistoricosBuscar.CostoTotal != null)
                    {
                        try
                        {

                            if (datosHistoricosBuscar.CostoTotal.Contains("-"))
                            {
                                var dCT = datosHistoricosBuscar.CostoTotal.Split('-');
                                foreach (var item in dCT)
                                {
                                    datosCostoTotalR.Add(Convert.ToDecimal(item.Trim()));
                                }


                            }
                            else if (datosHistoricosBuscar.CostoTotal.Contains(","))

                            {

                                var dCT = datosHistoricosBuscar.CostoTotal.Split(',');
                                foreach (var item in dCT)
                                {
                                    datosCostoTotalC.Add(Convert.ToDecimal(item.Trim()));
                                }

                            }
                            else
                            {
                                datosCostoTotalN = (Convert.ToDecimal(datosHistoricosBuscar.CostoTotal.Trim()));

                            }
                        }
                        catch (Exception)
                        {

                            return 3;
                        }
                    }


                    List<long> datosAFER = new List<long>();
                    List<long?> datosAFEC = new List<long?>();
                    long datosAFEN = -1;

                    if (datosHistoricosBuscar.AFE != null)
                    {
                        try
                        {

                            if (datosHistoricosBuscar.AFE.Contains("-"))
                            {
                                var dCT = datosHistoricosBuscar.AFE.Split('-');
                                foreach (var item in dCT)
                                {
                                    datosAFER.Add(Convert.ToInt64(item.Trim()));
                                }


                            }
                            else if (datosHistoricosBuscar.AFE.Contains(","))

                            {

                                var dCT = datosHistoricosBuscar.AFE.Split(',');
                                foreach (var item in dCT)
                                {
                                    datosAFEC.Add(Convert.ToInt64(item.Trim()));
                                }

                            }
                            else
                            {
                                datosAFEN = (Convert.ToInt64(datosHistoricosBuscar.AFE.Trim()));

                            }
                        }
                        catch (Exception)
                        {

                            return 3;
                        }
                    }


                    var numOrdenMax = datosOrdeCompraR.OrderByDescending(x => x).DefaultIfEmpty((long)0).FirstOrDefault();
                    var numCostoMax = datosCostoTotalR.OrderByDescending(x => x).DefaultIfEmpty((long)0).FirstOrDefault();
                    var numMaxReq = datosNoRequisicionR.OrderByDescending(x => x).DefaultIfEmpty((long)0).FirstOrDefault();
                    var numMaxAfe = datosAFER.OrderByDescending(x => x).DefaultIfEmpty((long)0).FirstOrDefault();

                    lstRequisicones = (from tblRequisiciones in contexto.Requisicion.Include("RequisicionDetalle").Include("CatalogoGeneral").Include("Usuario").Include("Proveedor").Include("RequisicionAutorizaciones")
                                       let costoTotal = ((tblRequisiciones.RequisicionDetalle.Count == 0 ? 0 : tblRequisiciones.RequisicionDetalle.Sum(x => x.Cantidad * x.CostoUnitario)) * tblRequisiciones.Cambio)

                                       where (datosHistoricosBuscar.LstTipoCompra.Count != 0 ? datosHistoricosBuscar.LstTipoCompra.Contains(tblRequisiciones.TipoCompra) : tblRequisiciones.TipoCompra == tblRequisiciones.TipoCompra)

                                       && (datosAFER.Count > 0 ?
                                       (tblRequisiciones.IdRequisicion == tblRequisiciones.RequisicionDetalle.Where(det => det.AFE >= datosAFER.DefaultIfEmpty((long)0).FirstOrDefault() && det.AFE <= numMaxAfe).Select(det => det.IdRequisicion).DefaultIfEmpty((long)0).FirstOrDefault())
                                       : datosAFEC.Count > 0 ? (tblRequisiciones.IdRequisicion == tblRequisiciones.RequisicionDetalle.Where(det => datosAFEC.Contains(det.AFE)).Select(det => det.IdRequisicion).DefaultIfEmpty((long)0).FirstOrDefault()) : datosAFEN != -1 ? (tblRequisiciones.IdRequisicion == tblRequisiciones.RequisicionDetalle.Where(det => det.AFE == datosAFEN).Select(det => det.IdRequisicion).DefaultIfEmpty((long)0).FirstOrDefault()) : (tblRequisiciones.IdRequisicion == tblRequisiciones.IdRequisicion))


                                       && (datosHistoricosBuscar.LstTipoRequisicion.Count != 0 ? datosHistoricosBuscar.LstTipoRequisicion.Contains(tblRequisiciones.ProductoServicio) : tblRequisiciones.ProductoServicio == tblRequisiciones.ProductoServicio)
                                       && (datosHistoricosBuscar.LstClasificacion.Count != 0 ? datosHistoricosBuscar.LstClasificacion.Contains(tblRequisiciones.IdProServ) : tblRequisiciones.IdProServ == tblRequisiciones.IdProServ)
                                       && (datosHistoricosBuscar.LstDepartamentos.Count != 0 ? datosHistoricosBuscar.LstDepartamentos.Contains(tblRequisiciones.DepartamentoId) : tblRequisiciones.DepartamentoId == tblRequisiciones.DepartamentoId)
                                       && (datosHistoricosBuscar.LstProveedor.Count != 0 ? datosHistoricosBuscar.LstProveedor.Contains(tblRequisiciones.IdProveedor) : tblRequisiciones.IdProveedor == tblRequisiciones.IdProveedor)
                                       && (datosHistoricosBuscar.LstGiro.Count != 0 ? datosHistoricosBuscar.LstGiro.Contains(tblRequisiciones.Proveedor.GiroId) : tblRequisiciones.Proveedor.GiroId == tblRequisiciones.Proveedor.GiroId)
                                       && (datosHistoricosBuscar.LstPrioridad.Count != 0 ? datosHistoricosBuscar.LstPrioridad.Contains(tblRequisiciones.Prioridad) : tblRequisiciones.Prioridad == tblRequisiciones.Prioridad)
                                       && (datosHistoricosBuscar.LstEstatus.Count != 0 ? datosHistoricosBuscar.LstEstatus.Contains(tblRequisiciones.Estatus) : tblRequisiciones.Estatus == tblRequisiciones.Estatus)
                                     //  && (datosHistoricosBuscar.LstMetodologia.Count != 0 ? datosHistoricosBuscar.LstMetodologia.Contains(tblRequisiciones.MetodologiaId) : tblRequisiciones.MetodologiaId == tblRequisiciones.MetodologiaId)
                                       && (tblRequisiciones.IdUCreo == idUsuarioLogin
                                       || (permisoValidar == 1 ? tblRequisiciones.RequisicionAutorizaciones.Where(a => a.IdAutorizacion == 1 && a.IdUAtendio != null).Select(a => a.IdRequisicion).ToList().Contains(tblRequisiciones.IdRequisicion) : tblRequisiciones.IdUCreo == idUsuarioLogin)
                                        || (permisoAprobar == 1 ? tblRequisiciones.RequisicionAutorizaciones.Where(a => a.IdAutorizacion == 2 && a.IdUAtendio != null).Select(a => a.IdRequisicion).ToList().Contains(tblRequisiciones.IdRequisicion) : tblRequisiciones.IdUCreo == idUsuarioLogin)
                                        || (permisoCompras == 1 ? tblRequisiciones.RequisicionAutorizaciones.Where(a => a.IdAutorizacion == 3 && a.IdUAtendio != null).Select(a => a.IdRequisicion).ToList().Contains(tblRequisiciones.IdRequisicion) : tblRequisiciones.IdUCreo == idUsuarioLogin)
                                        || (Administrador == 1 ? tblRequisiciones.RequisicionAutorizaciones.Select(a => a.IdRequisicion).ToList().Contains(tblRequisiciones.IdRequisicion) : tblRequisiciones.IdUCreo == idUsuarioLogin)
                                        )
                                       && (datosHistoricosBuscar.FechaInicio != null ? datosHistoricosBuscar.FechaFin != null ? tblRequisiciones.FechaCreo >= datosHistoricosBuscar.FechaInicio && tblRequisiciones.FechaGenero <= datosHistoricosBuscar.FechaFin : tblRequisiciones.FechaCreo >= datosHistoricosBuscar.FechaInicio : tblRequisiciones.FechaCreo == tblRequisiciones.FechaCreo)

                                       && (datosOrdeCompraR.Count > 0 ?
                                                    (tblRequisiciones.OrdenCompra >= datosOrdeCompraR.DefaultIfEmpty((long)0).FirstOrDefault()
                                                        && tblRequisiciones.OrdenCompra <= numOrdenMax)
                                           : datosOrdeCompraC.Count > 0 ? (datosOrdeCompraC.Contains(tblRequisiciones.OrdenCompra ?? 0)) : ordenCompraN != -1 ? tblRequisiciones.OrdenCompra == ordenCompraN : (tblRequisiciones.OrdenCompra == tblRequisiciones.OrdenCompra))

                                             && (datosCostoTotalR.Count > 0 ?
                                                    (costoTotal >= datosCostoTotalR.DefaultIfEmpty((long)0).FirstOrDefault()
                                                        && costoTotal <= numCostoMax)
                                           : datosCostoTotalC.Count > 0 ? (datosCostoTotalC.Contains(costoTotal)) : datosCostoTotalN != -1 ? costoTotal == datosCostoTotalN : (costoTotal == costoTotal))

                                              && (datosNoRequisicionR.Count > 0 ?
                                                    (tblRequisiciones.IdRequisicion >= datosNoRequisicionR.DefaultIfEmpty((long)0).FirstOrDefault()
                                                        && tblRequisiciones.IdRequisicion <= numMaxReq)
                                           : datosNoRequisicionC.Count > 0 ? (datosNoRequisicionC.Contains(tblRequisiciones.IdRequisicion)) : datosNoRequisicionN != -1 ? tblRequisiciones.IdRequisicion == datosNoRequisicionN : (tblRequisiciones.IdRequisicion == tblRequisiciones.IdRequisicion))

                                       //datosOrdeCompraC.Count != 0 ? datosOrdeCompraC.Contains(tblRequisiciones.OrdenCompra.Value) : ordenCompraN != -1 ? tblRequisiciones.OrdenCompra == ordenCompraN : tblRequisiciones.OrdenCompra == tblRequisiciones.OrdenCompra

                                       select new RequisicionesModel
                                       {
                                           IdRequisicion = tblRequisiciones.IdRequisicion,
                                           TipoCompra = tblRequisiciones.TipoCompra,
                                           Estatus = tblRequisiciones.Estatus,
                                           DescripcionDepartamento = tblRequisiciones.CatalogoGeneral3.DescCorta,
                                           UsuarioCreo = tblRequisiciones.Usuario1.Nombre + " " + tblRequisiciones.Usuario1.ApPaterno + " " + tblRequisiciones.Usuario1.ApMaterno,
                                           Prioridad = tblRequisiciones.Prioridad,
                                           IdProveedor = tblRequisiciones.Proveedor.IdProveedor,
                                           NombreProveedor = tblRequisiciones.Proveedor.NombreComercial,
                                           CostoTotal = ((tblRequisiciones.RequisicionDetalle.Count == 0 ? 0 : tblRequisiciones.RequisicionDetalle.Sum(x => x.Cantidad * x.CostoUnitario)) * tblRequisiciones.Cambio),
                                           OrdenCompra = tblRequisiciones.OrdenCompra,
                                           FechaGenero = tblRequisiciones.FechaCreo.Value,
                                           FechaCierre = tblRequisiciones.FechaCierre.Value,
                                           OrdenCompraFecha = tblRequisiciones.OrdenCompraFecha.Value,
                                           IdUCreo = tblRequisiciones.IdUCreo.Value,
                                           ProductoServicio = tblRequisiciones.ProductoServicio,
                                           IdProServ = tblRequisiciones.IdProServ,
                                           DepartamentoId = tblRequisiciones.DepartamentoId,
                                           MetodologiaId = tblRequisiciones.MetodologiaId,
                                           GiroProeedor = tblRequisiciones.Proveedor.GiroId
                                       }).ToList();



                    var lstFinalFiltrada = lstRequisicones.GroupBy(x => x.IdRequisicion).Select(x => x.First()).ToList();

                    var lstReq = (from tblRq in contexto.Requisicion.Include("RequisicionDetalle")
                                  where tblRq.RequisicionDetalle.Where(det => det.AFE == datosAFEN).Select(req => req.IdRequisicion).FirstOrDefault()==tblRq.IdRequisicion
                                  select
                                  tblRq
                                  ).ToList();

                    //&& (datosAFER.Count > 0 ?
                    //(tblRequisiciones.IdRequisicion == tblRequisiciones.RequisicionDetalle.Where(det => det.AFE >= datosAFER.DefaultIfEmpty((long)0).FirstOrDefault() && det.AFE <= numMaxAfe).Select(det => det.IdRequisicion).DefaultIfEmpty((long)0).FirstOrDefault())
                    //: datosAFEC.Count > 0 ? (tblRequisiciones.IdRequisicion == tblRequisiciones.RequisicionDetalle.Where(det => datosAFEC.Contains(det.AFE)).Select(det => det.IdRequisicion).DefaultIfEmpty((long)0).FirstOrDefault()) : datosNoRequisicionN != -1 ? (tblRequisiciones.IdRequisicion == tblRequisiciones.RequisicionDetalle.Where(det => det.AFE == datosAFEN).Select(det => det.IdRequisicion).DefaultIfEmpty((long)0).FirstOrDefault()) : (tblRequisiciones.IdRequisicion == tblRequisiciones.IdRequisicion))

                    lstRequisicionesDevuelta = lstFinalFiltrada;




                    return 4;


                }
            }
            catch (Exception ex)
            {

                throw ex;
            }


        }




    }
}
