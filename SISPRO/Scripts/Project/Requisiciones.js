


var dsPARG = [];
var dsRequisiconesGeneral = [];
var dsRequisicionesMultiples = [];
var tablaRequisiconesGeneral;

var archivoSubir = "";
var control1 = $('#FlDocumentoProcesarMultiple');

var columnasRequisicionesGeneral = [
           {
               //  "data": "Nacionalidad",
               "class": "text-center",
               "render": function (data, type, row) {
                   var indexes = $.map(dsPARG, function (obj, index) {
                       if (obj.NombreAutorizacion == "Compras") {
                           return index;
                       }
                   });
                   if (indexes.length > 0) {

                       if (row.Estatus == "S")
                       {
                       if(row.ProductoServicio==1)
                       {
                            return '<label class="check"><input type="checkbox" class="chkProcesar" /></label>';


                        }
                        else
                        {
                            return "";
                        }
                             }
                       else
                           return "";
                   }

                   else
                       return "";
               }
           },
              {
                  "data": "IdRequisicion",
                  "class": "text-center"
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
                      var estlo = "";
                      var title = "";

                      switch (data) {
                          case 'G':
                              estlo = "Estatus-proceso";
                              title = "Generada";
                              break;
                          case 'R':
                              estlo = "Estatus-rechazada";
                              title = "Rechazada";
                              break;
                          case 'V':
                              estlo = "Estatus-proceso";
                              title = "Validada";
                              break;
                          case 'A':
                              estlo = "Estatus-proceso";
                              title = "Aprobada";
                              break
                          case 'S':
                              estlo = "Estatus-aprobada";
                              title = "Aprobación compras";
                              break;
                          case 'P':
                              estlo = "Estatus-aprobada";
                              title = "Aprobación compras";
                              break;
                      }

                      return '<div class="' + estlo + '" data-toggle="tooltip" data-placement="right" title="' + title + '"></div>';
                  }
              },
            {
                "data": "DescripcionDepartamento",
                "class": "text-center"
            },
             {
                 "data": "UsuarioCreo",
                 "class": "text-center",

             },

            {
                "data": "Prioridad",
                "class": "text-center",
                "render": function (data, type, row) {

                    return (data == 1 ? "Alta" : "Baja");
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
                    return "$ " + $.number(data, '2', '.', ',');
                }
            },

            {
                "data": "OrdenCompra",
                "class": "text-center",

            },
             {
                 "data": "CotizacionVigencia",
                 "class": "text-center",
                 "render": function (data, type, row) {
                     return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))
                 }
             },
            {
                "data": "FechaLimite",
                "class": "text-center",
                "render": function (data, type, row) {
                    return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))
                }
            },
            {
                "data": "FechaGenero",
                "class": "text-center",
                "render": function (data, type, row) {
                    return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))
                }

            },
            {
                "data": "FechaValidacion",
                "class": "text-center",
                "render": function (data, type, row) {
                    return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))
                }
            },
             {
                 "data": "FechaAprobacion",
                 "class": "text-center",
                 "render": function (data, type, row) {
                     return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))
                 }
             },
            {
                "class": "text-center",
                "render": function (data, type, row) {
                    return ' <button class="btn btn-default btn-small fa fa-list-alt BtnEditarDatosRequisicion"></button>';                  
                }
            },
            {
                    "class": "text-center",
                    "render": function (data, type, row) {
                      return ' <button class="btn btn-default btn-small fa fa-share BtnReenviar"></button>';
                            }
                        },
            {
                "class": "text-center",
                "render": function (data, type, row) {
                    return '<button class="btn btn-danger btn-small  glyphicon glyphicon-remove-circle BtnCancelarDatosRequisicion"></button>';

                }
            }
];

$(document).ready(function () {
    $('#TxtFechaProcMult').datetimepicker(
  {
      format: 'DD/MM/YYYY'
  });
    CargaInicial();
});

function CargaInicial() {
    var url = $('#urlCargaInicial').val();
    $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: successCargaInicialRq,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("La sesión se ha terminado, por favor actualice la página.");
        }
    });
    return false;
}
function successCargaInicialRq(data) {
    $('div.pg-loading-screen').remove();
    if (data.Exito) {
        debugger;

        dsPARG = jQuery.parseJSON(data.LstAutorizaciones);

        dsRequisiconesGeneral = jQuery.parseJSON(data.LstRequisicones);

        tablaRequisiconesGeneral = inicializaTabla($('#TblRequisicionesGeneral'), dsRequisiconesGeneral, columnasRequisicionesGeneral, 1, "asc", true, true, true);
        $('#TblRequisicionesGeneral').removeClass('hide');

        var indexes = $.map(dsPARG, function (obj, index) {
            if (obj.NombreAutorizacion == "Compras") {
                return index;
            }
        });
        if (indexes.length > 0)
            $('#BtnProcesarMultiples').show();
        else
            $('#BtnProcesarMultiples').hide();

        $('#SelTipoCambioFinalProcMult').empty();
        $('#SelTipoCambioFinalProcMult').append(data.CmbTipoCambio);

    }
    else if (data.Advertencia) {
        MensajeAdvertencia(data.Mensaje);
    }
    else {
        MensajeError(data.Mensaje);
    }

    $('div.pg-loading-screen').remove();

}


function LimpiarFormularioRequisicionesMultiples() {
    $('#TxtTerCondProcMult').code("");
    $('#TxtOrdenCompraProcMult').val("");
    $('#TxtMontoFinalCompraProcdMult').val("");
    $('#SelTipoCambioFinalProcMult').val(-1);
    $('#TxtFechaProcMult').val("");
    $('#TxtCambioProcMult').val("");
    $('#TxtCuerpoCorreoProcMult').code("");
    $('#LblCostoTotalFinalMult').text("");
    control1.replaceWith(control1 = control1.clone(true));
}


$(document).on('click', '#BtnNuevo', function (e) {
    NuevaRequisicon();
})

$(document).on('click', '.BtnEditarDatosRequisicion', function (e) {

    var filaPadre = $(this).closest('tr');
    var row = tablaRequisiconesGeneral.api().row(filaPadre);
    var datosFila = row.data();
    var idRequisicion = datosFila.IdRequisicion;

    $('#IdRequisicion').val(idRequisicion);
  
  
    EditarRequisicion();

    return false;

})

$(document).on('click', '.BtnReenviar', function (e) {

    var filaPadre = $(this).closest('tr');
    var row = tablaRequisiconesGeneral.api().row(filaPadre);
    var datosFila = row.data();
    var idRequisicion = datosFila.IdRequisicion;

    var url = $('#urlReenviar').val();

    $.ajax({
        url: url,
        data: JSON.stringify({ idRequisicion: idRequisicion }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data){
        
            if (data.Exito) {

                    MensajeExito(data.Mensaje);

                }
                else {

                    MensajeAdvertencia(data.Mensaje);

                }
        
        
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("La sesión se ha terminado, por favor actualice la página.");
        }
    })

    return false;

})

$(document).on('click', '#BtnProcesarMultiples', function (e) {

    var indexes = $.map(dsRequisiconesGeneral, function (obj, index) {
        if (obj.ProcesarMultiple == true) {
            return obj;
        }
    });
    if (indexes.length > 0) {

        dsRequisicionesMultiples = indexes;
        LlamadaProcesarMultipleComprobar(indexes);
    }
    else {
        MensajeAdvertencia("Seleccione requisiciones para aprobar.");
    }
})

function LlamadaProcesarMultipleComprobar(dsRequisiconesGeneral) {
    var url = $('#urlProcesarMultipleComprobar').val();
    $.ajax({
        url: url,
        data: JSON.stringify(dsRequisiconesGeneral),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: SuccessLlamadaProcesarMultipleComprobar,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("La sesión se ha terminado, por favor actualice la página.");
        }
    });
}
function SuccessLlamadaProcesarMultipleComprobar(data) {
    if (data.Exito) {
        LimpiarFormularioRequisicionesMultiples();
        var dsDatosRequiciones = jQuery.parseJSON(data.DatosRequisitos);
        debugger;
        $('#TxtTerCondProcMult').code(dsDatosRequiciones.TerminosCondiciones);
        $('#ModalComprasProcesar').modal('toggle');


    }
    else if (data.Advertencia) {
        MensajeAdvertencia(data.Mensaje);
    }
    else {
        MensajeError(data.Mensaje);
    }
}

$(document).on('change', '.chkProcesar', function (e) {
    var filaPadre = $(this).closest('tr');
    var row = tablaRequisiconesGeneral.api().row(filaPadre);
    var datosFila = row.data();
    var idRequisicion = datosFila.IdRequisicion;

    var indexes = $.map(dsRequisiconesGeneral, function (obj, index) {
        if (obj.IdRequisicion == idRequisicion) {
            return index;
        }
    });
    dsRequisiconesGeneral[indexes[0]].ProcesarMultiple = $(this).prop('checked');
    debugger;

    return false;

})

$('.chkProcesar').on('ifClicked', function (event) {
    debugger;

    var filaPadre = $(this).closest('tr');
    var row = tablaRequisiconesGeneral.api().row(filaPadre);
    var datosFila = row.data();
    var idRequisicion = datosFila.IdRequisicion;

    var indexes = $.map(dsRequisiconesGeneral, function (obj, index) {
        if (obj.IdRequisicion == idRequisicion) {
            return index;
        }
    });

    dsRequisiconesGeneral[indexes[0]].ProcesarMultiple = $(this).prop('checked');

    debugger;

    return false;

})

$(document).on("change", "#FlDocumentoProcesarMultiple", function (e) {

    $("#FlDocumentoProcesarMultiple").parent().next().next().text("");

    var imgVal = $('#FlDocumentoProcesarMultiple').val();
    if (imgVal == '') {
        archivoSubir = "";
        //  alert("empty input file");

    }
    else {
        if (e.target.files != undefined) {

            var reader = new FileReader();

            reader.onload = function (f) {
                archivoSubir = f.target.result;
                //$('#VerArchivoCotizacion').attr('src', archivoDocumentoCompras);
            };
            reader.readAsDataURL(e.target.files.item(0));
            //nombreFoto = e.target.files.item(0).name;
        }
    }
});

//$(document).on('click', '#BtnGuardarDatosProcMult', function (e) {
//    var Mensaje = ValidaCamposRequeridos(".ReqProcMult");
//    debugger;
//    var aprobacionCompras = $.grep(dsPARG, function (a, b) {
//        return a.Nombre == "Compras"
//    });
//    if (archivoSubir != "") {
//        if (Mensaje.length == 0) {
//            var fechaRede = $('#TxtFechaProcMult').val().split('/');
//            var diaRD = parseInt(fechaRede[0]);
//            var mesRD = parseInt(fechaRede[1]) - 1;
//            var anioRD = parseInt(fechaRede[2]);
//            //    debugger;
//            var fechard = new Date(anioRD, mesRD, diaRD, 0, 0, 0);
//            var guardarComprasReq = {
//                IdRequisicion: $("#IdRequisicion").val().trim(),
//                TerminosCondiciones: $("#TxtTerCondProcMult").code(),
//                OrdenCompra: $("#TxtOrdenCompraProcMult").val().trim(),
//                OrdenCompraMonto: $("#TxtMontoFinalCompraProcdMult").val().trim(),
//                OrdenCompraFecha: fechard,
//                ArchivoOrdenCompraPath: archivoSubir,
//                CuerpoCorreo: $("#TxtCuerpoCorreoProcMult").code(),
//                TipoCambioFinalId: $("#SelTipoCambioFinalProcMult").val(),
//                CambioFinal: $("#TxtCambioProcMult").val()
//            };
//            LlamadaComprasRequisicionProcMult(guardarComprasReq);
//        }
//        else {
//            MensajeAdvertencia(Mensaje);
//        }
//    }
//    else {
//        MensajeAdvertencia("Selecciona un archivo de orden de compra.");
//    }
//    return false;
//})
//function LlamadaComprasRequisicionProcMult(guardarComprasReq) {
//    var url = $('#urlGuardarComprasRequisiconesProcMult').val();
//    $.ajax({
//        url: url,
//        data: JSON.stringify({ datosCompra: guardarComprasReq, lstRequiciones: dsRequisiconesGeneral }),
//        type: "POST",
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        async: false,
//        success: SuccessLlamadaComprasRequisicionProcMult,
//        error: function (xmlHttpRequest, textStatus, errorThrown) {
//            MensajeError(data.Mensaje);
//        }
//    });
//}
//function SuccessLlamadaComprasRequisicionProcMult(data) {
//     if (data.Exito) {
//        MensajeExito(data.Mensaje);
//        //LimpiarFormularioRequisicon();
//         $('#ModalComprasProcesar').modal('toggle');
//        CargaInicial();
//    }
//    else if (data.Advertencia) {
//        MensajeAdvertencia(data.Mensaje);
//    }
//    else {
//        MensajeError(data.Mensaje);
//    }
//}

$(document).on('click', '#BtbProcesarDatosMult', function (e) {
    var Mensaje = ValidaCamposRequeridos(".ReqProcMult");
    debugger;
    var aprobacionCompras = $.grep(dsPARG, function (a, b) {
        return a.Nombre == "Compras"
    });

    if (archivoSubir != "") {
        if (Mensaje.length == 0) {

            var fechaRede = $('#TxtFechaProcMult').val().split('/');



            var diaRD = parseInt(fechaRede[0]);
            var mesRD = parseInt(fechaRede[1]) - 1;
            var anioRD = parseInt(fechaRede[2]);
            //    debugger;
            var fechard = new Date(anioRD, mesRD, diaRD, 0, 0, 0);


            var guardarComprasReq = {
                IdRequisicion: $("#IdRequisicion").val().trim(),
                TerminosCondiciones: $("#TxtTerCondProcMult").code(),
                OrdenCompra: $("#TxtOrdenCompraProcMult").val().trim(),
                OrdenCompraMonto: $("#TxtMontoFinalCompraProcdMult").val().trim(),
                OrdenCompraFecha: fechard,
                ArchivoOrdenCompraPath: archivoSubir,
                CuerpoCorreo: $("#TxtCuerpoCorreoProcMult").code(),
                TipoCambioFinalId: $("#SelTipoCambioFinalProcMult").val(),
                CambioFinal: $("#TxtCambioProcMult").val()
            };
            LlamandaProcesarMultiple(guardarComprasReq);

        }
        else {
            MensajeAdvertencia(Mensaje);
        }
    }
    else {
        MensajeAdvertencia("Selecciona un archivo de orden de compra.");
    }

    return false;

});
function LlamandaProcesarMultiple(datos) {
    var url = $('#urlProcesarMultiple').val();
    $.ajax({
        url: url,
        data: JSON.stringify({ datosCompra: datos, lstRequiciones: dsRequisicionesMultiples }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: SuccessLlamadaProcesarMultiple,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("La sesión se ha terminado, por favor actualice la página.");
        }
    });
}

function SuccessLlamadaProcesarMultiple(data) {
    FinalizaLoading();
    if (data.Exito) {
        MensajeExito(data.Mensaje);

        control1.replaceWith(control1 = control1.clone(true));
        $('.file-input-name').text("");

        $('#ModalComprasProcesar').modal('toggle');
        CargaInicial();


    }
    else if (data.Advertencia) {
        MensajeAdvertencia(data.Mensaje);
    }
    else {
        MensajeError(data.Mensaje);
    }
}

 

$(document).on("change", "#SelTipoCambioFinalProcMult", function (e) {
    if ($(this).val() == -1) {
        $('#TxtCambioProcMult').val("1");
    }
    else {
        var tipoCambio = $('#SelTipoCambioFinalProcMult').val();
        LlamadaBuscarTipoCambioReqGral(tipoCambio);
        RealizaMultiplicacionTipoCambioProcMult();
    }
});
function LlamadaBuscarTipoCambioReqGral(idTipoCambio) {

    var url = $('#urlConsultarTipoCambio').val();
    $.ajax({
        url: url,
        data: JSON.stringify({ idTipoCambio: idTipoCambio }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessLlamadaBuscarTipoCambioReqGral,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("La sesión se ha terminado, por favor actualice la página.");
        }
    });
}
function SuccessLlamadaBuscarTipoCambioReqGral(data) {
    if (data.Exito) {
        $('#TxtCambioProcMult').val(data.TipoCambio);
    }
    else if (data.Advertencia) {
        MensajeAdvertencia(data.Mensaje);
    }
    else {
        MensajeError(data.Mensaje);
    }
}

$('#TxtMontoFinalCompraProcdMult').focusout(function () {

    RealizaMultiplicacionTipoCambioProcMult();
})

 
function RealizaMultiplicacionTipoCambioProcMult() {
debugger;
    var tipoCambio = $('#TxtCambioProcMult').val();
    if (tipoCambio == 0 || tipoCambio == "") {
        tipoCambio = 1;
    }
    var costoTotalFinalmult = $('#TxtMontoFinalCompraProcdMult').val().trim();

    var precioNuevoFinalmult = costoTotalFinalmult * tipoCambio;
    $('#LblCostoTotalFinalMult').text("$" + $.number(precioNuevoFinalmult, 2, ".", ","));
}

$(document).on('click', '.BtnCancelarDatosRequisicion', function (e) {

    var filaPadre = $(this).closest('tr');
    var row = tablaRequisiconesGeneral.api().row(filaPadre);
    var datosFila = row.data();
    var idRequisicion = datosFila.IdRequisicion;
    debugger;
    if (datosFila.Estatus == "R" || datosFila.Estatus == "G" ) {
        $('#IdRequisicion').val(idRequisicion);
        MensajeConfirmar("¿Desea cancelar la requisición?")
    }
    else {
        MensajeAdvertencia("La requisición no puede ser cancelada.");
    }
    return false;
});

$(document).on('click', '#BtnConfirmar', function (e) {
    var idRequisicion = $('#IdRequisicion').val();

    LlamadaCancelarRequicion(idRequisicion);

    return false;
});

function LlamadaCancelarRequicion(idRequisicion) {
    var url = $('#urlCancelarRequsiciones').val();
    $.ajax({
        url: url,
        data: JSON.stringify({ idRequisicion: idRequisicion }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: SuccessLlamadaCancelarRequicion,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("La sesión se ha terminado, por favor actualice la página.");
        }
    });
}
function SuccessLlamadaCancelarRequicion(data) {
    FinalizaLoading();
    if (data.Exito) {
        MensajeExito(data.Mensaje);
        CargaInicial();
    }
    else if (data.Advertencia) {
        MensajeAdvertencia(data.Mensaje);
    }
    else {
        MensajeError(data.Mensaje);
    }
}


$(document).on('hide.bs.modal', '.modal-fullscreen', function (e) {
    CargaInicial();
})


