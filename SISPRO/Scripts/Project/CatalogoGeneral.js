var dsCatalogos = [];
var tablaCatalogos;
var recarga = false;

var columnasCatalogos = [
           {
               "data": "IdCatalogo",
               "visible": false
           },
           {
               "data": "DescCorta",
               "class": "text-center"
           },
              {
                  "data": "DescLarga",
                  "class": "text-center"
              },
            {
                "data": "DatoEspecial",
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
        $('#SelCabecera').empty();
        $('#SelCabecera').append(data.CmbCabeceras);



      

        tablaCatalogos = inicializaTabla($('#TblCatalogo'), dsCatalogos, columnasCatalogos, 1, "asc", true, true, true);
        $('#TblCatalogo').removeClass('hide');

      

    }
    else if (data.Advertencia) {
        MensajeAdvertencia(data.Mensaje);
    }
    else {
        MensajeError(data.Mensaje);
    }
}

$(document).on('change', '#SelCabecera', function (e) {

    if ($('#SelCabecera').val() == -1) {
        dsCatalogos = [];
        refrescaTabla(tablaCatalogos, dsCatalogos);
    }
    else {
        var idTabla = $('#SelCabecera').val();
        LlamadaConsultarCatalogos(idTabla);
    }

})

function LlamadaConsultarCatalogos(idTabla) {
    
    var url = $('#urlConsultaCatalogos').val();

    $.ajax({

        url: url,
        data: JSON.stringify({ idTabla: idTabla }),
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


        var actual = 1;
        if (recarga) {
  
            actual = tablaCatalogos.api().page.info().page + 1 ;

        }


        dsCatalogos = jQuery.parseJSON(data.LstCatalogos);
        refrescaTabla(tablaCatalogos, dsCatalogos);


        if (recarga) {
            var nuevo = tablaCatalogos.api().page.info().pages;

            var salto = actual > nuevo ? nuevo  : actual ;

       /*     tablaCatalogos.api().page(salto).draw(false);*/

            //tablaCatalogos.api().page(salto).draw('page');


            var tbl = $('#TblCatalogo').DataTable().page(salto-1).draw(false);

           /* tablaCatalogos.api().ajax.reload();*/  
        }


        recarga = true;
    }
    else if (data.Advertencia) {
        MensajeAdvertencia(data.Mensaje);
    }
    else {
        MensajeError(data.Mensaje);
    }
}


function LimpiarFormularioCatalogo() {
    $('#IdCatalogo').val(0);
    $('#TxtDecCorta').val("");
    $('#TxtDecLarga').val("");
    $('#TxtDatoEspecial').val("");
    cambiaEstadoSwitch($('#ChkActivo'), true);
    cambiaEstadoSwitch($('#ChkProtegido'), false);
}

$(document).on('click', '#BtnNuevo', function (e) {
    LimpiarFormularioCatalogo();

    if ($('#SelCabecera').val() != -1) {
        $('#ModalEditarCatalogo').modal('show');

    }
    else {
        MensajeAdvertencia("Debe seleccionar un catálogo.");
    }
})

$(document).on('click', '#BtnGuardar', function (e) {
    var Mensaje = ValidaCamposRequeridos(".ReqCat");


    if (Mensaje.length == 0) {
        var datosCatalogo = {
            IdCatalogo: $('#IdCatalogo').val(),
            IdTabla: $('#SelCabecera').val(),
            DescCorta: $('#TxtDecCorta').val().trim(),
            DescLarga: $('#TxtDecLarga').val().trim(),
            DatoEspecial: $('#TxtDatoEspecial').val().trim(),
            Cabecera: false,
            Protegido: $('#ChkProtegido').prop('checked'),
            Activo: $('#ChkActivo').prop('checked')

        }
        LlamadaGuardarDatosCatalogo(datosCatalogo);

    }

    else {

        MensajeAdvertencia(Mensaje);
    }

});
function LlamadaGuardarDatosCatalogo(datosCatalogo) {

    var url = $('#urlGuardarDatosC').val();
    $.ajax({
        url: url,
        data: JSON.stringify(datosCatalogo),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessLlamadaGuardarDatosCatalogo,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
}
function SuccessLlamadaGuardarDatosCatalogo(data) {
    if (data.Exito) {
        LimpiarFormularioCatalogo();

        MensajeExito(data.Mensaje);
        $('#ModalEditarCatalogo').modal('toggle');
        FinalizaLoading();
        LlamadaConsultarCatalogos($('#SelCabecera').val());
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
    var row = tablaCatalogos.api().row(filaPadre);
    var datosFila = row.data();

    LlamadaConsultarDatosCatalogo(datosFila.IdCatalogo);

});

function LlamadaConsultarDatosCatalogo(idCatalogo) {

    var url = $('#urlConsultarDatosC').val();

    $.ajax({

        url: url,
        data: JSON.stringify({ idCatalogo: idCatalogo }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessLlamadaConsultarDatosCatalogo,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
}
function SuccessLlamadaConsultarDatosCatalogo(data) {
    if (data.Exito) {
        LimpiarFormularioCatalogo();

        var datosCatalogo = jQuery.parseJSON(data.DatosCatalogo);

        $('#IdCatalogo').val(datosCatalogo.IdCatalogo);
 
        $('#TxtDecCorta').val(datosCatalogo.DescCorta);
        $('#TxtDecLarga').val(datosCatalogo.DescLarga);
        $('#TxtDatoEspecial').val(datosCatalogo.DatoEspecial);
      
        cambiaEstadoSwitch($('#ChkActivo'), datosCatalogo.Activo);
        cambiaEstadoSwitch($('#ChkProtegido'), datosCatalogo.Protegido);
        
        $('#ModalEditarCatalogo').modal('show');

    }
    else if (data.Advertencia) {

        MensajeAdvertencia(data.Mensaje);

    }
    else {

        MensajeError(data.Mensaje);
    }
}