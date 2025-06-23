var dsRequisicionesHistoricas = [];
var tablaHistoricos;
var dsAutorizacionesCancelarHistoricos = [];
var columnasHistoricos = [
           {
               "data": "IdRequisicion",
               "class": "text-center"
           },
            {
                "data": "FechaGenero",
                "class": "text-center",
                "render": function (data, type, row) {
                    return moment(data).format("DD/MM/YYYY");
                }
            },

            {
                "data": "OrdenCompraFecha",
                 "class": "text-center",
                 "render": function (data, type, row) {
                  return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))
                    }
            },
       {
                "data": "FechaCierre",
                 "class": "text-center",
                "render": function (data, type, row) {
                  return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))
                  }
        },
           {
               "data": "ProductoServicio",
               "class": "text-center",
               "render": function (data, type, row) {

                   return (data == 1 ? "Productos" : "Servicio");
               }
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
                            title = "Aprobación compras";
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

             {
                 "data": "DescripcionDepartamento",
                 "class": "text-center"
             },
              {
                  "data": "UsuarioCreo",
                  "class": "text-center"
              },

                {
                    "data": "Prioridad",
                    "class": "text-center",
                    "render": function (data, type, row) {
                        return (data == 1 ? "Urgente" : "No urgente");
                    }
                },



                  {
                      "data": "NombreProveedor",
                      "class": "text-center"
                  },


                    {
                        "data": "CostoTotal",
                        "class": "text-center",
                        "render": function (data, type, row) {
                            return '$' + $.number(data, 2, ".", ",");
                        }

                    },
                     {
                         "data": "OrdenCompra",
                         "class": "text-center"
                     },

            {
                "class": "text-center",
                "render": function (data, type, row) {
                 
                    return '<button class="btn btn-default btn-xs fa fa-pencil-square-o btnEditarReqHistorico"></button>'
                    //if (row.Estatus != "X" && row.Estatus != "C" && row.Estatus != "P")
                    //    return '<button class="btn btn-default btn-xs fa fa-pencil-square-o btnEditarReqHistorico"></button>'
                    //else
                    //    return "";
                }
            },


              {
                  "class": "text-center",
                  "render": function (data, type, row) {
                      return '<button class="btn btn-default btn-xs fa fa-copy btnCopiarReqHistorico"></button>'
                  }
              },
               {
                   "class": "text-center",
                   "render": function (data, type, row) {

                       if (row.Estatus == "P" && row.IdAutorizacion == 3) {
                           return '<button class="btn btn-default btn-xs fa fa-share btnReenviarCorreos"></button>'
                       }
                       else {
                           return '';
                       }
                   }
               },
                {
                    "class": "text-center",
                    "render": function (data, type, row) {

                        if (row.Estatus == "P") {

                            var indexes = $.map(dsAutorizacionesCancelarHistoricos, function (obj, index) {
                                if (obj.IdAutorizacion == 3) {
                                    return index;
                                }
                            });
                            if (indexes.length > 0)
                                return '<button class="btn btn-danger btn-xs  glyphicon glyphicon-remove-circle BtnCancelarReqHistoricas"></button>';
                            else
                                return "";

                        }
                        else {
                            return '';
                        }
                    }
                }
];

$(document).ready(function () {
    $('#accTwoColSeven').addClass('panel-body-open');
    $('#accTwoColSeven').css('display', 'block');

    $('#TxtFechaInicioH,#TxtFechaFinalH').datetimepicker(
        {

            format: 'DD/MM/YYYY'
        });
    CargaInicialHistoricos();
});

function CargaInicialHistoricos() {
    var url = $('#urlCargaInicialHistoricos').val();
    $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: successCargaInicialHistoricos,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
    return false;
}
function successCargaInicialHistoricos(data) {
    if (data.Exito) {

        dsAutorizacionesCancelarHistoricos = jQuery.parseJSON(data.LstAutorizaciones);

        dsRequisicionesHistoricas = jQuery.parseJSON(data.LstReqHistoricas);

        var indexes = $.map(dsAutorizacionesCancelarHistoricos, function (obj, index) {
            if (obj.IdAutorizacion == 3) {
                return index;
            }
        });
        if (indexes.length > 0)
            $('#ThCancelarHistoricos').show();
        else
            $('#ThCancelarHistoricos').hide();

        tablaHistoricos = inicializaTabla($('#TblHistoricoReq'), dsRequisicionesHistoricas, columnasHistoricos, 0, "asc", true, true, true);
        $('#TblHistoricoReq').removeClass('hide');


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



        $('#TblHistoricoExportar tbody').html('');

        for (var i in dsRequisicionesHistoricas) {
            var title = "";
            switch (dsRequisicionesHistoricas[i].Estatus) {
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
                       + "<td class='text-center'>" + dsRequisicionesHistoricas[i].IdRequisicion + "</td>"
                       + "<td class='text-center'>" + moment(dsRequisicionesHistoricas[i].FechaGenero).format("DD/MM/YYYY") + "</td>"
                       + "<td class='text-center'>" + moment(dsRequisicionesHistoricas[i].FechaCierre).format("DD/MM/YYYY") + "</td>"
                       + "<td class='text-center'>" + (dsRequisicionesHistoricas[i].ProductoServicio == 1 ? "Productos" : "Servicio") + "</td>"
                       + "<td class='text-center'>" + title + "</td>"
                       + "<td class='text-center'>" + dsRequisicionesHistoricas[i].DescripcionDepartamento + "</td>"
                       + "<td class='text-center'>" + dsRequisicionesHistoricas[i].UsuarioCreo + "</td>"
                        + "<td class='text-center'>" + (dsRequisicionesHistoricas[i].Prioridad == 1 ? "Alta" : "Baja") + "</td>"
                        + "<td class='text-center'>" + dsRequisicionesHistoricas[i].NombreProveedor + "</td>"
                       + "<td class='text-center'>" + '$' + $.number(dsRequisicionesHistoricas[i].CostoTotal, 2, ".", ",") + "</td>"
                        + "<td class='text-center'>" + dsRequisicionesHistoricas[i].OrdenCompra + "</td>"
                 + "</tr>";
            $("#TblHistoricoExportar tbody").append(rows);
        }

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
        async: true,
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
        async: true,
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
    debugger;
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


    $('#BtnAprobar').hide();
    $('#BtnGuardarAp').hide();

    $("a[href='#step-1']").click();

    $("a[href='#step-2']").hide();
    $("a[href='#step-3']").hide();

    $(".ColumnaAprobarDetReq").hide();
    $(".ColumnaRechazarDetReq").hide();

    $('#urlCotizacion1').val("")
    $('#urlCotizacion2').val("")
    $('#urlCotizacion3').val("")



    $('#RdoNacional').prop('disabled', false);
    $('#RdoExtranjera').prop('disabled', false);
    $('#SelProveedor').prop('disabled', false);
    $('#ArchivoCotizacion').prop('disabled', false);
    $('#TxtFechaVigencia').prop('disabled', false);
    $('#SelDepartamento').prop('disabled', false);
    $('#RdoProducto').prop('disabled', false);
    $('#RdoServicio').prop('disabled', false);
    $('#SelClasificacion').prop('disabled', false);
    $('#TxtNombreProyecto').prop('disabled', false);
    $('#TxtMetricoY').prop('disabled', false);
    $('#TxtMetricoX').prop('disabled', false);
    $('#SelMetodologia').prop('disabled', false);
    $('#ChkSeleccionarTodosRequisitos').prop('disabled', false);
    $('#TxtDescripcion').prop('disabled', false);
    $('#TxtCantidad').prop('disabled', false);
    $('#SelMedida').prop('disabled', false);
    $('#TxtCostoUnitario').prop('disabled', false);
    $('#TxtFechaRequerida').prop('disabled', false);
    $('#SelTipoCambio').prop('disabled', false);
    $('#TxtJustificacion').prop('disabled', false);
    $('#TxtArchivoCotizacion2').prop('disabled', false);
    $('#TxtArchivoCotizacion3').prop('disabled', false);
    $('#RdoAlta').prop('disabled', false);
    $('#RdoBaja').prop('disabled', false);
    $('#SelMotivoUrgencia').prop('disabled', false);
    $('#BtnAgregarDetalleRequisicion').show();

    $('#BtnGuardarDatosRequerimiento').show();

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

    LlamadaFiltrarDatosHistoricos(datosBuscar);

    return false;

})


function LlamadaFiltrarDatosHistoricos(datosBuscar) {
    var url = $('#urlGenerarDatosHistoricosReqHistorico').val();
    $.ajax({
        url: url,
        data: JSON.stringify(datosBuscar),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: SuccessLlamadaFiltrarDatosHistoricos,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error al realizar la consulta, intente de nuevo.");
        }
    });
}
function SuccessLlamadaFiltrarDatosHistoricos(data) {
    if (data.Exito) {
        dsRequisicionesHistoricas = jQuery.parseJSON(data.LstReqHistoricas);
        tablaHistoricos = inicializaTabla($('#TblHistoricoReq'), dsRequisicionesHistoricas, columnasHistoricos, 0, "asc", true, true, true);


        $('#TblHistoricoReq').removeClass('hide');

        $('#TblHistoricoExportar tbody').html('');

        for (var i in dsRequisicionesHistoricas) {
            var title = "";
            switch (dsRequisicionesHistoricas[i].Estatus) {
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
                       + "<td class='text-center'>" + dsRequisicionesHistoricas[i].IdRequisicion + "</td>"
                                              + "<td class='text-center'>" + moment(dsRequisicionesHistoricas[i].FechaGenero).format("DD/MM/YYYY") + "</td>"

                       + "<td class='text-center'>" + (dsRequisicionesHistoricas[i].ProductoServicio == 1 ? "Productos" : "Servicio") + "</td>"
                       + "<td class='text-center'>" + title + "</td>"
                       + "<td class='text-center'>" + dsRequisicionesHistoricas[i].DescripcionDepartamento + "</td>"
                       + "<td class='text-center'>" + dsRequisicionesHistoricas[i].UsuarioCreo + "</td>"
                        + "<td class='text-center'>" + (dsRequisicionesHistoricas[i].Prioridad == 1 ? "Alta" : "Baja") + "</td>"
                        + "<td class='text-center'>" + dsRequisicionesHistoricas[i].NombreProveedor + "</td>"
                       + "<td class='text-center'>" + '$' + $.number(dsRequisicionesHistoricas[i].CostoTotal, 2, ".", ",") + "</td>"
                        + "<td class='text-center'>" + dsRequisicionesHistoricas[i].OrdenCompra + "</td>"
                 + "</tr>";
            $("#TblHistoricoExportar tbody").append(rows);
        }


    }
    else if (data.Advertencia) {
        MensajeAdvertencia(data.Mensaje);
    }
    else {
        MensajeError(data.Mensaje);
    }
}


$(document).on('click', '.btnReenviarCorreos', function (e) {

    var filaPadre = $(this).closest('tr');
    var row = tablaHistoricos.api().row(filaPadre);
    var datosFila = row.data();
    var idRequisicion = datosFila.IdRequisicion;
    var estatusRequisicion = datosFila.Estatus;
    //$('#IdRequisicion').val(idRequisicion);
    if (estatusRequisicion == "P") {
        LlamadaReenviarCorreo(idRequisicion);

    }
    else {
        MensajeAdvertencia("Para reenviar los correos, la requisición debe estar procesada.")
    }
    return false;

})


function LlamadaReenviarCorreo(idRequisicion) {
    var url = $('#urlReenviaCorreos').val();
    $.ajax({
        url: url,
        data: JSON.stringify({ idRequisicion: idRequisicion }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: SuccessLlamadaReenviarCorreo,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error al realizar la consulta, intente de nuevo.");
        }
    });
}
function SuccessLlamadaReenviarCorreo(data) {
    if (data.Exito) {
        MensajeExito(data.Mensaje);
    }
    else if (data.Advertencia) {
        MensajeAdvertencia(data.Mensaje);
    }
    else {
        MensajeError(data.Mensaje);
    }
}


$(document).on('click', '.BtnCancelarReqHistoricas', function (e) {

    var filaPadre = $(this).closest('tr');
    var row = tablaHistoricos.api().row(filaPadre);
    var datosFila = row.data();
    var idRequisicion = datosFila.IdRequisicion;
    var estatusRequisicion = datosFila.Estatus;
    //$('#IdRequisicion').val(idRequisicion);
    if (estatusRequisicion == "P") {
        MensajeConfirmar("¿Desea cancelar la requisición  N°" + idRequisicion + "?.");
        $('#ReqCancelarhistoricos').val(idRequisicion);
    }
    else {
        MensajeAdvertencia("No se puede cancelar una requisición que no se ha procesado.")
    }
    return false;

})



$(document).on('click', '#BtnConfirmar', function (e) {
    var idRequisicion = $('#ReqCancelarhistoricos').val();

    LlamadaCancelarRequicionHistorica(idRequisicion);

    return false;
});

function LlamadaCancelarRequicionHistorica(idRequisicion) {
    var url = $('#urlCancelarRequsicionesHistoricas').val();
    $.ajax({
        url: url,
        data: JSON.stringify({ idRequisicion: idRequisicion }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: SuccessLlamadaCancelarRequicionHistorica,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("La sesión se ha terminado, por favor actualice la página.");
        }
    });
}
function SuccessLlamadaCancelarRequicionHistorica(data) {
    FinalizaLoading();
    if (data.Exito) {
        MensajeExito(data.Mensaje);
        $('#BtGenerarH').click();
    }
    else if (data.Advertencia) {
        MensajeAdvertencia(data.Mensaje);
    }
    else {
        MensajeError(data.Mensaje);
    }
}




