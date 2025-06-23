using CapaDatos.DataBaseModel;
using CapaDatos.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos
{
    public class CD_Estadisticas
    {



        public int BuscarDatosEstadisticos(HistoricosModel datosHistoricosBuscar, long idUsuarioLogin, ref List<RequisicionesModel> lstReqRegresar)
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
                                       let ciclo = DbFunctions.DiffDays(tblRequisiciones.FechaAprobacion, tblRequisiciones.FechaCierre) ?? 0
                                       let costoTotal = ((tblRequisiciones.RequisicionDetalle.Count == 0 ? 0 : tblRequisiciones.RequisicionDetalle.Sum(x => x.Cantidad * x.CostoUnitario)) * tblRequisiciones.Cambio)

                                       where (datosHistoricosBuscar.LstTipoCompra.Count != 0 ? datosHistoricosBuscar.LstTipoCompra.Contains(tblRequisiciones.TipoCompra) : tblRequisiciones.TipoCompra == tblRequisiciones.TipoCompra)
                                      && (datosAFER.Count > 0 ?
                                        (tblRequisiciones.IdRequisicion == tblRequisiciones.RequisicionDetalle.Where(det => det.AFE >= datosAFER.DefaultIfEmpty((long)0).FirstOrDefault() && det.AFE <= numMaxAfe).Select(det => det.IdRequisicion).FirstOrDefault())
                                          : datosAFEC.Count > 0 ? (tblRequisiciones.IdRequisicion == tblRequisiciones.RequisicionDetalle.Where(det => datosAFEC.Contains(det.AFE)).Select(det => det.IdRequisicion).FirstOrDefault()) : datosAFEN != -1 ? (tblRequisiciones.IdRequisicion == tblRequisiciones.RequisicionDetalle.Where(det => det.AFE == datosAFEN).Select(det => det.IdRequisicion).FirstOrDefault()) : (tblRequisiciones.IdRequisicion == tblRequisiciones.IdRequisicion))

                                       && (datosHistoricosBuscar.LstTipoRequisicion.Count != 0 ? datosHistoricosBuscar.LstTipoRequisicion.Contains(tblRequisiciones.ProductoServicio) : tblRequisiciones.ProductoServicio == tblRequisiciones.ProductoServicio)
                                      && (datosHistoricosBuscar.LstClasificacion.Count != 0 ? datosHistoricosBuscar.LstClasificacion.Contains(tblRequisiciones.IdProServ) : tblRequisiciones.IdProServ == tblRequisiciones.IdProServ)
                                      && (datosHistoricosBuscar.LstDepartamentos.Count != 0 ? datosHistoricosBuscar.LstDepartamentos.Contains(tblRequisiciones.DepartamentoId) : tblRequisiciones.DepartamentoId == tblRequisiciones.DepartamentoId)
                                      && (datosHistoricosBuscar.LstProveedor.Count != 0 ? datosHistoricosBuscar.LstProveedor.Contains(tblRequisiciones.IdProveedor) : tblRequisiciones.IdProveedor == tblRequisiciones.IdProveedor)
                                      && (datosHistoricosBuscar.LstGiro.Count != 0 ? datosHistoricosBuscar.LstGiro.Contains(tblRequisiciones.Proveedor.GiroId) : tblRequisiciones.Proveedor.GiroId == tblRequisiciones.Proveedor.GiroId)
                                      && (datosHistoricosBuscar.LstPrioridad.Count != 0 ? datosHistoricosBuscar.LstPrioridad.Contains(tblRequisiciones.Prioridad) : tblRequisiciones.Prioridad == tblRequisiciones.Prioridad)
                                      && (datosHistoricosBuscar.LstEstatus.Count != 0 ? datosHistoricosBuscar.LstEstatus.Contains(tblRequisiciones.Estatus) : tblRequisiciones.Estatus == tblRequisiciones.Estatus)
                                      // && (datosHistoricosBuscar.LstMetodologia.Count != 0 ? datosHistoricosBuscar.LstMetodologia.Contains(tblRequisiciones.MetodologiaId) : tblRequisiciones.MetodologiaId == tblRequisiciones.MetodologiaId)
                                      && (tblRequisiciones.IdUCreo == idUsuarioLogin
                                      || (permisoValidar == 1 ? tblRequisiciones.RequisicionAutorizaciones.Where(a => a.IdAutorizacion == 1 && a.IdUAtendio != null).Select(a => a.IdRequisicion).ToList().Contains(tblRequisiciones.IdRequisicion) : tblRequisiciones.IdUCreo == idUsuarioLogin)
                                       || (permisoAprobar == 1 ? tblRequisiciones.RequisicionAutorizaciones.Where(a => a.IdAutorizacion == 2 && a.IdUAtendio != null).Select(a => a.IdRequisicion).ToList().Contains(tblRequisiciones.IdRequisicion) : tblRequisiciones.IdUCreo == idUsuarioLogin)
                                       || (permisoCompras == 1 ? tblRequisiciones.RequisicionAutorizaciones.Where(a => a.IdAutorizacion == 3 && a.IdUAtendio != null).Select(a => a.IdRequisicion).ToList().Contains(tblRequisiciones.IdRequisicion) : tblRequisiciones.IdUCreo == idUsuarioLogin)
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


                                       select new RequisicionesModel
                                       {
                                           IdRequisicion = tblRequisiciones.IdRequisicion,
                                           NombreProveedor = tblRequisiciones.Proveedor.NombreComercial,
                                           IdProServDescripcion = tblRequisiciones.ProductoServicio1.Nombre,
                                           DescripcionDepartamento = tblRequisiciones.CatalogoGeneral3.DescCorta,
                                           MetodologiaDescripcion = tblRequisiciones.CatalogoGeneral1.DescCorta,
                                           NoLineas = tblRequisiciones.RequisicionDetalle.Count,
                                           Prioridad = tblRequisiciones.Prioridad,

                                           FechaAprobacion = tblRequisiciones.FechaAprobacion,

                                           VigenciaProceso = tblRequisiciones.VigenciaProceso,
                                           FechaLimite = DbFunctions.AddDays(tblRequisiciones.FechaGenero, tblRequisiciones.VigenciaProceso).Value,
                                           OrdenCompra = tblRequisiciones.OrdenCompra,

                                           FechaCierre = tblRequisiciones.FechaCierre,
                                           Ciclo = ciclo,
                                           EnTiempo = (ciclo <= tblRequisiciones.VigenciaProceso ? "Si" : "No"),
                                           CtaDepto = tblRequisiciones.CatalogoGeneral3.DatoEspecial,
                                           Cuenta = tblRequisiciones.ProductoServicio1.Cuenta.ToString(),
                                           Estatus = tblRequisiciones.Estatus,

                                           TipoCompra = tblRequisiciones.TipoCompra,
                                           UsuarioCreo = tblRequisiciones.Usuario1.Nombre + " " + tblRequisiciones.Usuario1.ApPaterno + " " + tblRequisiciones.Usuario1.ApMaterno,
                                           IdProveedor = tblRequisiciones.Proveedor.IdProveedor,
                                           CostoTotal = ((tblRequisiciones.RequisicionDetalle.Count == 0 ? 0 : tblRequisiciones.RequisicionDetalle.Sum(x => x.Cantidad * x.CostoUnitario)) * tblRequisiciones.Cambio),
                                           FechaGenero = tblRequisiciones.FechaCreo.Value,
                                           IdUCreo = tblRequisiciones.IdUCreo.Value,
                                           ProductoServicio = tblRequisiciones.ProductoServicio,
                                           IdProServ = tblRequisiciones.IdProServ,
                                           DepartamentoId = tblRequisiciones.DepartamentoId,
                                           MetodologiaId = tblRequisiciones.MetodologiaId,
                                           GiroProeedor = tblRequisiciones.Proveedor.GiroId,
                                           AFER = datosAFER.Count > 0 ?
                                        (tblRequisiciones.RequisicionDetalle.Where(det => det.AFE >= datosAFER.DefaultIfEmpty((long)0).FirstOrDefault() && det.AFE <= numMaxAfe).Select(det => det.AFE).FirstOrDefault())

                                          : datosAFEC.Count > 0 ?
                                                    (tblRequisiciones.RequisicionDetalle.Where(det => datosAFEC.Contains(det.AFE)).Select(det => det.IdRequisicion).FirstOrDefault())
                                                : (datosAFEN != -1 ? (tblRequisiciones.RequisicionDetalle.Where(det => det.AFE == datosAFEN).Select(det => det.AFE).FirstOrDefault()) : null)

                                       }).ToList();

                    var lstFinalFiltrada = lstRequisicones.GroupBy(x => x.IdRequisicion).Select(x => x.First()).ToList();



                    lstReqRegresar = lstFinalFiltrada;





                    lstReqRegresar = lstFinalFiltrada;
                    return 4;


                }
            }
            catch (Exception ex)
            {

                throw ex;
            }


        }
        public void ConsultarRequisiciones(ref long indicador1, ref long indicador2)
        {
            try
            {
                List<RequisicionesModel> lstRequisicones = new List<RequisicionesModel>();
                using (var contexto = new BDProductividad_DEVEntities())
                {
                    contexto.Configuration.LazyLoadingEnabled = false;


                    indicador1 = contexto.Requisicion.Where(req =>req.Estatus == "P").ToList().Count;
                    indicador2 = contexto.Requisicion.Where(req => req.Estatus == "G" || req.Estatus == "A" || req.Estatus == "V" || req.Estatus == "S").ToList().Count;

                }
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }
    }
}
