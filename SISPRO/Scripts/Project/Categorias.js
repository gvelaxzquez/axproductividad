var dsFase = [];
var tablaFases;

var dsCategorias = [];
var tablaCategorias;

var columnasFase = [
    {
        "data": "DescCorta",
        "class": "text-center"
    },
    {
        "data": "DescLarga",
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
        "class": "text-center",
        "render": function (data, type, row) {
            return '<button type="button" class="btn btn-default BtnEditarFase"><span class="fa fa-pencil-square-o"></span></button>'


        }
    }
];

var columnasClasificacion = [
    {
        "data": "DescCorta",
        "class": "text-center"
    },
    {
        "data": "DescLarga",
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
        "class": "text-center",
        "render": function (data, type, row) {
            return '<button type="button" class="btn btn-default BtnEditarClasificacion"><span class="fa fa-pencil-square-o"></span></button>'


        }
    }
];


$(document).ready(function () {
    CargaInicialCat();
});

function CargaInicialCat() {
    var url = $('#urlCargaInicialCategorias').val();
    $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: successCargaInicialCat,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
    return false;
}

function successCargaInicialCat(data) {
    if (data.Exito) {
        $('#SelFase').empty();
        $('#SelFase').append(data.CmbCabeceras);
        $('#SelFase').selectpicker('refresh');

        $('#SelFaseClasificacion').empty();
        $('#SelFaseClasificacion').append(data.CmbCabeceras);
        $('#SelFaseClasificacion').selectpicker('refresh');

        dsFase = jQuery.parseJSON(data.LstCatalogos);

        tablaFases = inicializaTabla($('#tblFase'), dsFase, columnasFase, 1, "asc", true, true, true);


    }
    else if (data.Advertencia) {
        MensajeAdvertencia(data.Mensaje);
    }
    else {
        MensajeError(data.Mensaje);
    }
}


$(document).on('change', '#SelFase', function (e) {


    var idTabla = $('#SelFase').val();
     LlamadaConsultarClasificaciones(idTabla);

});


function LlamadaConsultarClasificaciones(IdTipoActividad) {

    var url = $('#urlCargaClasificacion').val();

    $.ajax({

        url: url,
        data: JSON.stringify({ IdTipoActividad: IdTipoActividad }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: successLlamadaConsultarCatalogos,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });

    return false;
}
function successLlamadaConsultarCatalogos(data) {
    if (data.Exito) {
        dsCategorias = jQuery.parseJSON(data.LstClasificacion);
        tablaCategorias = inicializaTabla($('#tblClasificacion'), dsCategorias, columnasClasificacion, 1, "asc", true, true, true);
    }
    else if (data.Advertencia) {
        MensajeAdvertencia(data.Mensaje);
    }
    else {
        MensajeError(data.Mensaje);
    }
}


function LimpiarFormularioFase() {

    $('#IdFase').val("0");
    $('#TxtClaveFase').val("");
    $('#TxtNombreF').val("");

    cambiaEstadoSwitch($('#ChkActivoF'), true);

}

function LimpiarFormularioClasificacion() {

    $('#IdClasificacion').val("0");
    $('#TxtClaveClasificacion').val("");
    $('#TxtNombreClasificacion').val("");

    cambiaEstadoSwitch($('#ChkActivoClasificacion'), true);

}
    $(document).on('click', '#BtnModalFase', function (e) {
        LimpiarFormularioFase();

        $('#ModalFase').modal('show');

        return false;
    });
$(document).on('click', '#BtnModalClasificaciones', function (e) {
    LimpiarFormularioClasificacion();

    $('#ModalClasificacion').modal('show');

    return false;
});



$(document).on('click', '.BtnEditarFase', function (e) {
    debugger;
    var filaPadre = $(this).closest('tr');
    var row = tablaFases.api().row(filaPadre);
    var datosFila = row.data();

    $('#IdFase').val(datosFila.IdCatalogo);
    $('#TxtClaveFase').val(datosFila.DescCorta);
    $('#TxtNombreF').val(datosFila.DescLarga);

    cambiaEstadoSwitch($('#ChkActivoF'), datosFila.Activo);

    $('#ModalFase').modal('show');
   /* LlamadaConsultarDatosCatalogo(datosFila.IdCatalogo);*/

});

$(document).on('click', '.BtnEditarClasificacion', function (e) {
    debugger;
    var filaPadre = $(this).closest('tr');
    var row = tablaCategorias.api().row(filaPadre);
    var datosFila = row.data();

    $('#IdClasificacion').val(datosFila.IdCatalogo);
    $('#TxtClaveClasificacion').val(datosFila.DescCorta);
    $('#TxtNombreClasificacion').val(datosFila.DescLarga);

    cambiaEstadoSwitch($('#ChkActivoClasificacion'), datosFila.Activo);

    $('#SelFaseClasificacion').val(datosFila.DatoEspecial);
    $('#SelFaseClasificacion').selectpicker('refresh');

    $('#ModalClasificacion').modal('show');
    /* LlamadaConsultarDatosCatalogo(datosFila.IdCatalogo);*/

});


$(document).on('click', '#BtnGuardarFase', function (e) {
    var Mensaje = ValidaCamposRequeridos(".ReqFase");


    if (Mensaje.length == 0) {
        var datosCatalogo = {
            IdCatalogo: $('#IdFase').val(),
            IdTabla: 2,
            DescCorta: $('#TxtClaveFase').val().trim(),
            DescLarga: $('#TxtNombreF').val().trim(),
            Cabecera: false,
            Protegido: false,
            Activo: $('#ChkActivoF').prop('checked')

        }
        LlamadaGuardarDatosFase(datosCatalogo);

    }

    else {

        MensajeAdvertencia(Mensaje);
    }

});

function LlamadaGuardarDatosFase(datosCatalogo) {

    var url = $('#urlGuardarDatosFase').val();
    $.ajax({
        url: url,
        data: JSON.stringify(datosCatalogo),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessLlamadaGuardarDatosFase,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
}

function SuccessLlamadaGuardarDatosFase(data) {
    if (data.Exito) {
        LimpiarFormularioFase();

        MensajeExito(data.Mensaje);
        $('#ModalFase').modal('toggle');
        FinalizaLoading();
        CargaInicialCat();
    }
    else if (data.Advertencia) {

        MensajeAdvertencia(data.Mensaje);

    }
    else {

        MensajeError(data.Mensaje);
    }
}


$(document).on('click', '#BtnGuardarClasificacion', function (e) {
    var Mensaje = ValidaCamposRequeridos(".ReqClasificacion");


    if (Mensaje.length == 0) {
        var datosCatalogo = {
            IdCatalogo: $('#IdClasificacion').val(),
            IdTabla: 5,
            DescCorta: $('#TxtClaveClasificacion').val().trim(),
            DescLarga: $('#TxtNombreClasificacion').val().trim(),
            DatoEspecial: $('#SelFaseClasificacion').val(),
            Cabecera: false,
            Protegido: false, 
            Activo: $('#ChkActivoClasificacion').prop('checked')

        }
        LlamadaGuardarDatosClasificacion(datosCatalogo);

    }

    else {

        MensajeAdvertencia(Mensaje);
    }

});

function LlamadaGuardarDatosClasificacion(datosCatalogo) {

    var url = $('#urlGuardarDatosFase').val();
    $.ajax({
        url: url,
        data: JSON.stringify(datosCatalogo),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessLlamadaGuardarDatosClasificacion,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
}

function SuccessLlamadaGuardarDatosClasificacion(data) {
    if (data.Exito) {
        LimpiarFormularioClasificacion();

        MensajeExito(data.Mensaje);
        $('#ModalClasificacion').modal('toggle');
        FinalizaLoading();
        var idTabla = $('#SelFase').val();
        LlamadaConsultarClasificaciones(idTabla);
    }
    else if (data.Advertencia) {

        MensajeAdvertencia(data.Mensaje);

    }
    else {

        MensajeError(data.Mensaje);
    }
}






