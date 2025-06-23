var dsCliente = [];

var tablaCliente;

var columnasCliente = [
            { 
                "data": "IdCliente",
                "visible": false
            },
            {
                "data": "Nombre",
                "class": "text-left"
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
        dsCliente = jQuery.parseJSON(data.LstClientes);
        tablaCliente = inicializaTabla($('#TblClientes'), dsCliente, columnasCliente, 1, "asc", true, true, true);
        $('div.pg-loading-screen').remove();
     }
    else {
  
        MensajeError(data.Mensaje);
    }

}
$(document).on('click', '.BtnEditarDatos', function (e) {
    debugger;
    var filaPadre = $(this).closest('tr');
    var row = tablaCliente.api().row(filaPadre);
    var datosFila = row.data();

    $('#IdCliente').val(datosFila.IdCliente);
    $('#TxtNombre').val(datosFila.Nombre);
    cambiaEstadoSwitch($('#ChkActivo'), datosFila.Activo);

    $('#ModalEditarCliente').modal('show');



});



function LimpiarFormulario() {
    $('#IdTipoUsuario').val("0");

    $('#TxtNombre').val("");
    cambiaEstadoSwitch($('#ChkActivo'), true);
    cambiaEstadoSwitch($('#ChkBloqueado'), false);
}
$(document).on('click', '#BtnNuevo', function (e) {

     $('#IdCliente').val("0");
    $('#TxtNombre').val("");
     cambiaEstadoSwitch($('#ChkActivo'), true);
    $('#ModalEditarCliente').modal('show');
})

$(document).on('click', '#BtnGuardar', function (e) {

    
    var Mensaje = ValidaCamposRequeridos(".ReqCliente");


    if (Mensaje.length == 0) {

  
        var Cliente = {
            IdCliente: $('#IdCliente').val(),
            Nombre: $('#TxtNombre').val().trim(),
            Activo: $('#ChkActivo').prop('checked')
        }
        LlamadaGuardarDatosCliente(Cliente);
    }

    else {
  
        MensajeAdvertencia(Mensaje);
    }

})

function LlamadaGuardarDatosCliente(Cliente) {

    var url = $('#urlGuardarCliente').val();

    $.ajax({

        url: url,
        data: JSON.stringify(Cliente),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessLlamadaGuardarDatosCliente,
        error: function (xmlHttpRequest, textStatus, errorThrown) {
        
            MensajeError(data.Mensaje);
        }
    });
}
function SuccessLlamadaGuardarDatosCliente(data) {
    if (data.Exito) {

        MensajeExito(data.Mensaje);
        $('#ModalEditarCliente').modal('toggle');
      
        CargaInicial();
    }
    else if (data.Advertencia) {

        MensajeAdvertencia(data.Mensaje);

    }
    else {

        MensajeError(data.Mensaje);
    }
}



