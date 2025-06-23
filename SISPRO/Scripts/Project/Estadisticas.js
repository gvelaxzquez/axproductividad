



var dsRequisicionesEstadustica = [];
var tablaEstadistica;
var columnasEstadisticas = [
           {
               "data": "IdRequisicion",
               "class": "text-center"
           },
            {
                "data": "NombreProveedor",
                "class": "text-center"
            },
             {
                 "data": "IdProServDescripcion",
                 "class": "text-center"
             },
               {
                   "data": "UsuarioCreo",
                   "class": "text-center"
               },


              {
                  "data": "DescripcionDepartamento",
                  "class": "text-center"
              },
               //{
               //    "data": "AFER",
               //    "class": "text-center",
               //    "render": function (data, type, row) {
               //        return (data == null || data == "" ? "" : data);
               //    }
               //},

                {
                    "data": "NoLineas",
                    "class": "text-center"
                },

                  {
                      "data": "Prioridad",
                      "class": "text-center",
                      "render": function (data, type, row) {
                          return (data == 1 ? "Alta" : "Baja");
                      }
                  },

                  {
                      "data": "FechaAprobacion",
                      "class": "text-center",
                      "render": function (data, type, row) {
                          return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"));
                      }
                  },
                  {
                      "data": "VigenciaProceso",
                      "class": "text-center"
                  },

                 {
                     "data": "FechaLimite",
                     "class": "text-center",
                     "render": function (data, type, row) {
                         return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"));
                     }
                 },

                   {
                       "data": "OrdenCompra",
                       "class": "text-center"
                   },


                 {
                     "data": "FechaCierre",
                     "class": "text-center",
                     "render": function (data, type, row) {
                         return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"));
                     }
                 },

 {
     "data": "Ciclo",
     "class": "text-center"
 },
           {
               "data": "EnTiempo",
               "class": "text-center"
           },
          {
              "data": "CtaDepto",
              "class": "text-center"
          },
                      {
                          "data": "Cuenta",
                          "class": "text-center"
                      },


            {
                "data": "Estatus",
                "class": "text-center",
                "render": function (data, type, row) {
                    var title = "";

                    switch (data) {
                        case 'G':
                            title = "Generada";
                            break;
                        case 'R':
                            title = "Rechazada";
                            break;
                        case 'V':
                            title = "Validada";
                            break;
                        case 'A':
                            title = "Aprobada";
                            break
                        case 'S':
                            title = "Aprobacion compras";
                            break;
                        case 'P':
                            title = "Procesada";
                            break;
                        case 'C':
                            title = "Cancelada";
                            break;
                        case 'X':
                            title = "Vencida";
                            break;
                    }

                    return title;
                }
            },

];

$(document).ready(function () {

    // $("a[href='#accTwoColSeven']").click();

    $('#accTwoColSeven').addClass('panel-body-open');
    $('#accTwoColSeven').css('display', 'block');

    $('#TxtFechaInicioH,#TxtFechaFinalH').datetimepicker(
        {

            format: 'DD/MM/YYYY'
        });
    CargaInicialEstadistica();
    //ConsultaIndicadores();
    $('#LblInidicadorProcesada').text(0);
    $('#LblInidicadorDistintoProcesada').text(0);
});

function CargaInicialEstadistica() {
    var url = $('#urlCargaInicialHistoricos').val();
    $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: successCargaInicialEstadistica,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
    return false;
}
function successCargaInicialEstadistica(data) {
    if (data.Exito) {

        dsRequisicionesEstadustica = [];

        tablaEstadistica = inicializaTabla($('#TblEstadisticaReq'), dsRequisicionesEstadustica, columnasEstadisticas, 0, "asc", true, true, true);
        $('#TblEstadisticaReq').removeClass('hide');

        $('#SelGiroH').empty();
        $('#SelGiroH').append(data.CmbGiro);
        $('#SelGiroH').selectpicker('refresh');

        //$('#SelMetodologiaH').empty();
        //$('#SelMetodologiaH').append(data.CmbMetodologia);
        //$('#SelMetodologiaH').selectpicker('refresh');

        $('#SelClasificacionH').empty();
        $('#SelClasificacionH').append(data.CmbProductoServicio);
        $('#SelClasificacionH').selectpicker('refresh');

        $('#SelProveedorH').empty();
        $('#SelProveedorH').append(data.CmbProveedor);
        $('#SelProveedorH').selectpicker('refresh');

        $('#SelDepartamentoH').empty();
        $('#SelDepartamentoH').append(data.CmbDepartamentos);
        $('#SelDepartamentoH').selectpicker('refresh');
    }
    else if (data.Advertencia) {
        MensajeAdvertencia(data.Mensaje);
    }
    else {
        MensajeError(data.Mensaje);
    }

}

function ConsultaIndicadores() {
    var url = $('#urlConsultarIndicadoresEstadisticas').val();
    $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: successConsultaIndicadores,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
    return false;
}
function successConsultaIndicadores(data) {
    if (data.Exito) {

        $('#LblInidicadorProcesada').text(data.NumeroReqProcesadas);
        $('#LblInidicadorDistintoProcesada').text(data.NumeroReqDistintosAProcesadas);

    }
    else if (data.Advertencia) {
        MensajeAdvertencia(data.Mensaje);
    }
    else {
        MensajeError(data.Mensaje);
    }

}




$(document).on('change', '#SelTipoRequisicionH', function (e) {
    var tiposRequisicionBuscar = $(this).val();
    $('#SelClasificacionH').empty();
    $('#SelClasificacionH').selectpicker('refresh');

    for (var item in tiposRequisicionBuscar) {
        LlamadaAgregaRequisicionHistorial(tiposRequisicionBuscar[item]);
    }
    $('#SelClasificacionH').selectpicker('refresh');


})

function LlamadaAgregaRequisicionHistorial(idTipoRequisicon) {
    var url = $('#urlCargaClasificionReqHistoricos').val();
    $.ajax({
        url: url,
        data: JSON.stringify({ idTipoProducto: idTipoRequisicon }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessLlamadaAgregaRequisicionHistorial,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error al realizar la consulta, intente de nuevo.");
        }
    });
}
function SuccessLlamadaAgregaRequisicionHistorial(data) {
    if (data.Exito) {

        $('#SelClasificacionH').append(data.CmbProductoServicio);
        $('#SelClasificacionH').selectpicker('refresh');
    }
    else if (data.Advertencia) {
        MensajeAdvertencia(data.Mensaje);
    }
    else {
        MensajeError(data.Mensaje);
    }
}

$(document).on('change', '#SelTipoCompraH', function (e) {
    var tiposCompraBuscar = $(this).val();
    $('#SelDepartamentoH').empty();
    $('#SelDepartamentoH').selectpicker('refresh');

    $('#SelProveedorH').empty();
    $('#SelProveedorH').selectpicker('refresh');

    for (var item in tiposCompraBuscar) {
        LlamadaAgregaTiposCompraBuscarHistorial(tiposCompraBuscar[item]);
    }
    $('#SelProveedorH').selectpicker('refresh');
    $('#SelDepartamentoH').selectpicker('refresh');


})

function LlamadaAgregaTiposCompraBuscarHistorial(idTipoCompra) {
    var url = $('#urlCargaProveedoresDepReqHistorico').val();
    $.ajax({
        url: url,
        data: JSON.stringify({ idTipoProveedor: idTipoCompra }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessLlamadaAgregaTiposCompraBuscarHistorial,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error al realizar la consulta, intente de nuevo.");
        }
    });
}
function SuccessLlamadaAgregaTiposCompraBuscarHistorial(data) {
    if (data.Exito) {


        $('#SelProveedorH').append(data.CmbProveedor);
        $('#SelDepartamentoH').append(data.CmbDepartamentos);
        $('#SelProveedorH').selectpicker('refresh');
        $('#SelDepartamentoH').selectpicker('refresh');


    }
    else if (data.Advertencia) {
        MensajeAdvertencia(data.Mensaje);
    }
    else {
        MensajeError(data.Mensaje);
    }
}

$(document).on('click', '.btnEditarReqHistorico', function (e) {

    var filaPadre = $(this).closest('tr');
    var row = tablaHistoricos.api().row(filaPadre);
    var datosFila = row.data();
    var idRequisicion = datosFila.IdRequisicion;

    $('#IdRequisicion').val(idRequisicion);

    EditarRequisicion();

    return false;

})

$(document).on('click', '.btnCopiarReqHistorico', function (e) {

    var filaPadre = $(this).closest('tr');
    var row = tablaHistoricos.api().row(filaPadre);
    var datosFila = row.data();
    var idRequisicion = datosFila.IdRequisicion;

    $('#IdRequisicion').val(idRequisicion);

    EditarRequisicion();

    $('#IdRequisicion').val(0);
    archivoCotizacion1 = "";
    archivoCotizacion2 = "";
    archivoCotizacion3 = "";
    $('#EstatusRequisicion').val("G");
    $('#TxtFechaVigencia').val("");
    dsAutorizaciones = [{
        IdUA: 1,
        IdUsuario: 1,
        IdAutorizacion: 0,
        Tipo: 1,
        NombreAutorizacion: "CREO"
    }]
    debugger;
    $("#FlArchivoCotizacion").parent().next().text("");

    $("#TxtArchivoCotizacion2").parent().next().text("");

    $("#TxtArchivoCotizacion3").parent().next().text("");

    $("#TxtArchivoOrdenCompra").parent().next().text("");

    for (var item in dsDetalleRequisicion) {
        dsDetalleRequisicion[item].Estatus = "G";
        dsDetalleRequisicion[item].IdRequisicionDet = Math.random();

    }
    refrescaTabla(tablaDetalleRequisicion, dsDetalleRequisicion);

    $('#accTwoColOne').addClass('panel-body-open');
    $('#accTwoColOne').css('display', 'block');

    $('#accTwoColTwo').removeClass('panel-body-open');
    $('#accTwoColTwo').css('display', 'none');

    $('#accTwoColThree').removeClass('panel-body-open');
    $('#accTwoColThree').css('display', 'none');

    $('#accTwoColFour').removeClass('panel-body-open');
    $('#accTwoColFour').css('display', 'none');

    $('#BtnAgregarDetalleRequisicion').show();

    $('#BtnAprobar').hide();
    $('#BtnGuardarAp').hide();

    $("a[href='#step-1']").click();

    $("a[href='#step-2']").hide();
    $("a[href='#step-3']").hide();

    $(".ColumnaAprobarDetReq").hide();
    $(".ColumnaRechazarDetReq").hide();

    $('#urlCotizacion1').val()
    $('#urlCotizacion2').val()
    $('#urlCotizacion3').val()

    return false;

})

$(document).on('click', '#BtGenerarH', function (e) {
    var fechaInicioHN;
    if ($('#TxtFechaInicioH').val().trim() != "") {

        var fechaInicioH = $('#TxtFechaInicioH').val().split('/');
        var diaIniH = parseInt(fechaInicioH[0]);
        var mesIniH = parseInt(fechaInicioH[1]) - 1;
        var anioIniH = parseInt(fechaInicioH[2]);
        fechaInicioHN = new Date(anioIniH, mesIniH, diaIniH, 0, 0, 0);
    }
    else {
        fechaInicioHN = null;
    }

    var fechaFinHN;
    if ($('#TxtFechaFinalH').val().trim() != "") {

        var fechaFinH = $('#TxtFechaFinalH').val().split('/');
        var diaFinH = parseInt(fechaFinH[0]);
        var mesFinH = parseInt(fechaFinH[1]) - 1;
        var anioFinH = parseInt(fechaFinH[2]);
        fechaFinHN = new Date(anioFinH, mesFinH, diaFinH, 11, 59, 59);
    }
    else {
        fechaFinHN = null;
    }

    var datosBuscar = {

        FechaInicio: fechaInicioHN,
        FechaFin: fechaFinHN,
        LstTipoRequisicion: $('#SelTipoRequisicionH').val(),
        LstClasificacion: $('#SelClasificacionH').val(),
        LstGiro: $('#SelGiroH').val(),
        LstDepartamentos: $('#SelDepartamentoH').val(),
        LstTipoCompra: $('#SelTipoCompraH').val(),
        LstProveedor: $('#SelProveedorH').val(),
        LstPrioridad: $('#SelPioridadH').val(),
        LstEstatus: $('#SelEstatusH').val(),
        AFE: $('#TxtAFEBR').val(),
        NoOrdenCompra: $('#TxtNOrdeCompraH').val(),
        NoRequisicion: $('#TxtNRequisicionH').val(),
        CostoTotal: $('#TxtCostoTotal').val()
    }

    LlamadaGenerarDatosEstadisticas(datosBuscar);

    return false;

})
function LlamadaGenerarDatosEstadisticas(datosBuscar) {
    var url = $('#urlGenerarDatosEstadisticasReqHistorico').val();
    $.ajax({
        url: url,
        data: JSON.stringify(datosBuscar),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessLlamadaGenerarDatosEstadisticas,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error al realizar la consulta, intente de nuevo.");
        }
    });
}
function SuccessLlamadaGenerarDatosEstadisticas(data) {
    if (data.Exito) {
        dsRequisicionesEstadustica = jQuery.parseJSON(data.LstReqHistoricas);
        refrescaTabla(tablaEstadistica, dsRequisicionesEstadustica);

        $('#LblInidicadorProcesada').text(data.NumeroReqProcesadas);
        $('#LblInidicadorDistintoProcesada').text(data.NumeroReqDistintosAProcesadas);




        $('#TblEstadisticaReqExportar tbody').html('');

        for (var i in dsRequisicionesEstadustica) {
            var title = "";
            switch (dsRequisicionesEstadustica[i].Estatus) {
                case 'G':
                    title = "Generada";
                    break;
                case 'R':
                    title = "Rechazada";
                    break;
                case 'V':
                    title = "Validada";
                    break;
                case 'A':
                    title = "Aprobada";
                    break
                case 'S':
                    title = "Aprobacion compras";
                    break;
                case 'P':
                    title = "Procesada";
                    break;
                case 'C':
                    title = "Cancelar";
                    break;
                case 'X':
                    title = "Vencida";
                    break;
            }

            rows = "<tr>"
                       + "<td class='text-center'>" + dsRequisicionesEstadustica[i].IdRequisicion + "</td>"
                       + "<td class='text-center'>" + dsRequisicionesEstadustica[i].NombreProveedor + "</td>"
                       + "<td class='text-center'>" + dsRequisicionesEstadustica[i].IdProServDescripcion + "</td>"
                        + "<td class='text-center'>" + dsRequisicionesEstadustica[i].UsuarioCreo + "</td>"
                       + "<td class='text-center'>" + dsRequisicionesEstadustica[i].DescripcionDepartamento + "</td>"
                       //+ "<td class='text-center'>" + (dsRequisicionesEstadustica[i].AFER == null || dsRequisicionesEstadustica[i].AFER == "" ? "" : dsRequisicionesEstadustica[i].AFER) + "</td>"
                       + "<td class='text-center'>" + dsRequisicionesEstadustica[i].NoLineas + "</td>"
                       + "<td class='text-center'>" + (dsRequisicionesEstadustica[i].Prioridad == 1 ? "Alta" : "Baja") + "</td>"
                       + "<td class='text-center'>" + (dsRequisicionesEstadustica[i].FechaAprobacion == null || dsRequisicionesEstadustica[i].FechaAprobacion == "" ? "" : moment(dsRequisicionesEstadustica[i].FechaAprobacion).format("DD/MM/YYYY")) + "</td>"
                       + "<td class='text-center'>" + dsRequisicionesEstadustica[i].VigenciaProceso + "</td>"
                       + "<td class='text-center'>" + (dsRequisicionesEstadustica[i].FechaLimite == null || dsRequisicionesEstadustica[i].FechaLimite == "" ? "" : moment(dsRequisicionesEstadustica[i].FechaLimite).format("DD/MM/YYYY")) + "</td>"
                       + "<td class='text-center'>" + (dsRequisicionesEstadustica[i].OrdenCompra == null ? "" : dsRequisicionesEstadustica[i].OrdenCompra) + "</td>"
                       + "<td class='text-center'>" + (dsRequisicionesEstadustica[i].FechaCierre == null || dsRequisicionesEstadustica[i].FechaCierre == "" ? "" : moment(dsRequisicionesEstadustica[i].FechaCierre).format("DD/MM/YYYY")) + "</td>"
                       + "<td class='text-center'>" + dsRequisicionesEstadustica[i].Ciclo + "</td>"
                       + "<td class='text-center'>" + dsRequisicionesEstadustica[i].EnTiempo + "</td>"
                       + "<td class='text-center'>" + (dsRequisicionesEstadustica[i].CtaDepto == null ? "" : dsRequisicionesEstadustica[i].CtaDepto) + "</td>"
                       + "<td class='text-center'>" + dsRequisicionesEstadustica[i].Cuenta + "</td>"
                       + "<td class='text-center'>" + title + "</td>"


                 + "</tr>";
            $("#TblEstadisticaReqExportar tbody").append(rows);
        }

    }
    else if (data.Advertencia) {
        MensajeAdvertencia(data.Mensaje);
    }
    else {
        MensajeError(data.Mensaje);
    }
}
