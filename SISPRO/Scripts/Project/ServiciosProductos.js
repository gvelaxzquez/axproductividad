
var dsProductos = [];
var tablaProductos;
var tablaProductosRequisitos;


var dsRequisitos = [];
var columnasProdcuto = [
           {
               "data": "IdProServ",
               "visible": false
           },
            {
                "data": "Tipo",
                "class": "text-center",
                "render": function (data, type, row) {
                    return (data == 1) ? "Producto" : "Servicio";
                }
            },
           {
               "data": "Nombre",
               "class": "text-center"
           },
              {
                  "data": "Cuenta",
                  "class": "text-center"
              },

            {
                "data": "Activo",
                "class": "text-center",
                "render": function (data, type, row) {
                    return (data) ? "Si" : "No";
                }
            },
             {
                 "data": "Protegido",
                 "class": "text-center",
                 "render": function (data, type, row) {
                     return (data) ? "Si" : "No";
                 }
             },
            {
                "class": "text-center",
                "render": function (data, type, row) {
                    return '<button class="btn btn-default BtnEditarDatos"><span class="fa fa-pencil-square-o"></span></button>'


                }
            }
];
var columnasProdcutosRequisitos = [
           {
               "data": "IdProdServReq",
               "visible": false
           },

           {
               "data": "Requisito",
               "class": "text-center"
           },
              {
                  "data": "Caracteristicas",
                  "class": "text-center"
              },

            {
                "data": "Activo",
                "class": "text-center",
                "render": function (data, type, row) {
                    return (data) ? "Si" : "No";
                }
            },
            {
                "data": "Obligatorio",
                "class": "text-center",
                "render": function (data, type, row) {
                    return (data) ? "Si" : "No";
                }
            },

            {
                "class": "text-center",
                "render": function (data, type, row) {
                    return '<button class="btn btn-default BtnEditarDatosRequisitos"><span class="fa fa-pencil-square-o"></span></button>'
                }
            },
            {
                "class": "text-center",
                "render": function (data, type, row) {
                    return '<button class="btn btn-danger BtnEliminarDatosRequisitos"><span class="fa fa-trash-o"></span></button>'
                }
            }
];

$(document).ready(function () {
    CargaInicial();
});

function CargaInicial() {
    var url = $('#urlCargaInicial').val();
    $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: successCargaInicial,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
    return false;
}
function successCargaInicial(data) {
    if (data.Exito) {
        dsProductos = jQuery.parseJSON(data.LstProdServ);
        tablaProductos = inicializaTabla($('#TblProductosServicios'), dsProductos, columnasProdcuto, 1, "asc", true, true, true);
        $('#TblProductosServicios').removeClass('hide');
    }
    else if (data.Advertencia) {
        MensajeAdvertencia(data.Mensaje);
    }
    else {
        MensajeError(data.Mensaje);
    }
}

function LimpiarCampos() {
    $('#IdProServ').val(0);
    $('#IdProdServReq').val(0);

    dsRequisitos = [];

    tablaProductosRequisitos = inicializaTabla($('#TblRequisito'), dsRequisitos, columnasProdcutosRequisitos, 1, "asc", true, true, true);
    $('#tblRequisito').removeClass('hide');

    $('#TxtProductoServicio').val("");
    $('#TxtNombreComercial').val("");
    $('#TxtDescripcion').val("");
    $('#TxtCuenta').val("");
    $('#TxtRequisito').val("");
    $('#TxtCatacteristicas').val("");

    cambiaEstadoSwitch($('#ChkActivo'), true);
    cambiaEstadoSwitch($('#ChkProtegido'), false);

    cambiaEstadoSwitch($('#ChkReqActivo'), true);
    cambiaEstadoSwitch($('#ChkReqObligatorio'), true);


    $('#ChkTìpoServicio').click();

    $('#accTwoColThree').removeClass('panel-body-open');
    $('#accTwoColThree').css('display', 'none');
}

$(document).on('click', '#BtnNuevo', function (e) {
    LimpiarCampos();

    $('#ModalProductosServicios').modal('show');
})

$(document).on('click', '#BtnGuardar', function (e) {
    var Mensaje = ValidaCamposRequeridos(".ReqSerProd");


    if (Mensaje.length == 0) {

        var datosProductoServicio = {
            IdProServ: $('#IdProServ').val(),
            Nombre: $('#TxtProductoServicio').val(),
            Tipo: $('input:radio[name=TipoServProd]:checked').val(),
            Descripcion: $('#TxtDescripcion').val(),
            Cuenta: $('#TxtCuenta').val(),
            Activo: $('#ChkActivo').prop('checked'),
            Protegido: $('#ChkProtegido').prop('checked'),
            LstRequisitos: dsRequisitos
        }
        LlamadaGuardarDatosServicioProducto(datosProductoServicio);

    }

    else {

        MensajeAdvertencia(Mensaje);
    }

})

function LlamadaGuardarDatosServicioProducto(datosProductoServicio) {

    var url = $('#urlGuardarDatosPS').val();

    $.ajax({

        url: url,
        data: JSON.stringify(datosProductoServicio),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessLlamadaGuardarDatosServicioProducto,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
}
function SuccessLlamadaGuardarDatosServicioProducto(data) {
    if (data.Exito) {
        LimpiarCampos();

        MensajeExito(data.Mensaje);
        $('#ModalProductosServicios').modal('toggle');
        FinalizaLoading();

        CargaInicial();

    }
    else if (data.Advertencia) {

        MensajeAdvertencia(data.Mensaje);

    }
    else {

        MensajeError(data.Mensaje);
    }
}

$(document).on('click', '.BtnEditarDatos', function (e) {
    debugger;
    var filaPadre = $(this).closest('tr');
    var row = tablaProductos.api().row(filaPadre);
    var datosFila = row.data();

    LlamadaConsultarDatosProdServ(datosFila.IdProServ);

})
function LlamadaConsultarDatosProdServ(idProdServ) {

    var url = $('#urlConsultarDatosPS').val();

    $.ajax({

        url: url,
        data: JSON.stringify({ idProductoServicio: idProdServ }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessLlamadaConsultarDatosProdServ,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
}
function SuccessLlamadaConsultarDatosProdServ(data) {
    if (data.Exito) {
        LimpiarCampos();


        var datosProducto = jQuery.parseJSON(data.DatosProducto);

        $('#IdProServ').val(datosProducto.IdProServ);
        $('#IdProdServReq').val(0);

        dsRequisitos = datosProducto.LstRequisitos;
        refrescaTabla(tablaProductosRequisitos, dsRequisitos);

        $('#TxtProductoServicio').val(datosProducto.Nombre);
        $('#TxtDescripcion').val(datosProducto.Descripcion);
        $('#TxtCuenta').val(datosProducto.Cuenta);

        cambiaEstadoSwitch($('#ChkActivo'), datosProducto.Activo);
        cambiaEstadoSwitch($('#ChkProtegido'), datosProducto.Protegido);

        if (datosProducto.Tipo == 1) {
            $("#LblChkTipoProducto").click();
        }
        else {
            $("#LblChkTìpoServicio").click();
        }


        $('#ModalProductosServicios').modal('show');

    }
    else if (data.Advertencia) {

        MensajeAdvertencia(data.Mensaje);

    }
    else {

        MensajeError(data.Mensaje);
    }
}


$(document).on('click', '#BtnAgregarReq', function (e) {
    debugger;
    var Mensaje = ValidaCamposRequeridos(".ReqRequisitos");

    if (Mensaje.length == 0) {
        debugger;

        if ($('#IdProdServReq').val().trim() == 0) {
            // Comprobamos que el nombre no exista.
            var exiteRequisito = $.grep(dsRequisitos, function (a, b) {
                return a.Requisito == $('#TxtRequisito').val().trim()
            });
            if (exiteRequisito.length == 0) {
                //no existe requisito
                var nuevoRequisito = {
                    IdProdServReq: dsRequisitos.length + 99999,
                    IdProServ: $('#IdProServ').val().trim(),
                    Requisito: $('#TxtRequisito').val().trim(),
                    Caracteristicas: $('#TxtCatacteristicas').val().trim(),
                    Activo: $('#ChkReqActivo').prop('checked'),
                    Obligatorio: $('#ChkReqObligatorio').prop('checked'),
                }
                dsRequisitos.push(nuevoRequisito);
                refrescaTabla(tablaProductosRequisitos, dsRequisitos);
                LimpiarFormularoRequisito();


            }
            else {
                MensajeAdvertencia("Ya existe un requisito con el mismo nombre.");
            }
        }
        else {
            // Comprobamos que el nombre no exista.
            var exiteRequisito = $.grep(dsRequisitos, function (a, b) {
                return a.Requisito == $('#TxtRequisito').val().trim() && a.IdProdServReq != $('#IdProdServReq').val().trim()
            });
            if (exiteRequisito.length == 0) {
                //no existe requisito
                var nuevoRequisito = {
                    IdProdServReq: $('#IdProdServReq').val().trim(),
                    IdProServ: $('#IdProServ').val().trim(),
                    Requisito: $('#TxtRequisito').val().trim(),
                    Caracteristicas: $('#TxtCatacteristicas').val().trim(),
                    Activo: $('#ChkReqActivo').prop('checked'),
                    Obligatorio: $('#ChkReqObligatorio').prop('checked'),
                }

                var indexes = $.map(dsRequisitos, function (obj, index) {
                    if (obj.IdProdServReq == nuevoRequisito.IdProdServReq) {
                        return index;
                    }
                });
                dsRequisitos.splice(indexes[0], 1);

                dsRequisitos.push(nuevoRequisito);
                refrescaTabla(tablaProductosRequisitos, dsRequisitos);
                LimpiarFormularoRequisito();

            }
            else {
                MensajeAdvertencia("Ya existe un requisito con el mismo nombre.");
            }
        }
    }
    else {

        MensajeAdvertencia(Mensaje);
    }
    return false;
})


$(document).on('click', '.BtnEditarDatosRequisitos', function (e) {
    debugger;
    var filaPadre = $(this).closest('tr');
    var row = tablaProductosRequisitos.api().row(filaPadre);
    var datosFila = row.data();

    $('#IdProdServReq').val(datosFila.IdProdServReq);

    $('#TxtRequisito').val(datosFila.Requisito);
    $('#TxtCatacteristicas').val(datosFila.Caracteristicas);
    cambiaEstadoSwitch($('#ChkReqActivo'), datosFila.Activo);
    cambiaEstadoSwitch($('#ChkReqObligatorio'), datosFila.Activo);
    cambiaEstadoSwitch($('#ChkReqObligatorio'), datosFila.Obligatorio);

    return false;
})


$(document).on('click', '#BtnLimpiarFormularoReq', function (e) {
    LimpiarFormularoRequisito();
    return false;
})

function LimpiarFormularoRequisito() {
    $('#IdProdServReq').val(0);
    $('#TxtRequisito').val("");
    $('#TxtCatacteristicas').val("");
    cambiaEstadoSwitch($('#ChkReqActivo'), true);
    cambiaEstadoSwitch($('#ChkReqObligatorio'), true);

}

$(document).on('click', '#ChkTìpoServicio', function (e) {
    $('#LblSericioProducto').text("Servicio*");
})

$(document).on('click', '#ChkTipoProducto', function (e) {
    $('#LblSericioProducto').text("Producto*");

})

$(document).on('click', '.BtnEliminarDatosRequisitos', function (e) {
    debugger;
    var filaPadre = $(this).closest('tr');
    var row = tablaProductosRequisitos.api().row(filaPadre);
    var datosFila = row.data();

    var idProdServReq = datosFila.IdProdServReq;
    MensajeConfirmar("¿Desea eliminar el requisito?")

    $('#BtnConfirmar').attr('idConfirmar', idProdServReq);



    return false;
})

$(document).on('click', '#BtnConfirmar', function (e) {

    var idProdServReq = $('#BtnConfirmar').attr('idConfirmar');

    var indexes = $.map(dsRequisitos, function (obj, index) {
        if (obj.IdProdServReq == idProdServReq) {
            return index;
        }
    });
    dsRequisitos.splice(indexes[0], 1);
    refrescaTabla(tablaProductosRequisitos, dsRequisitos);



    return false;
});