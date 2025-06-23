
var CPSAsignar = [];
$(document).ready(function () {
    $('#TxtFechaPlanACP,#TxtFechaInicioACP').datetimepicker(
        {
            format: 'DD/MM/YYYY'
        });


   
});

$(document).on('click', '.BtnAsignarCP', function (e) {
    debugger;
    var filaPadre = $(this).closest('tr');
    var row = tablaCasosPrueba.api().row(filaPadre);
    var datosFila = row.data();


    CargaUsuariosACP();

    $('#IdCicloCasoACP').val(datosFila.IdCicloCaso);
    $('#IdActividadCasoACP').val(datosFila.IdActividadCaso);
    $('#IdActividadEjecucionACP').val(datosFila.IdActividadEjecucion);

    $('#LblTiempoEjecucion').text(datosFila.TiempoEjecucion);
    $('#SelUsuarioAsignadoACP').val(datosFila.IdUsuarioAsignado);
    $('#SelUsuarioAsignadoACP').selectpicker('refresh');

    $('#TxtFechaInicioACP').val('');
    $('#TxtFechaPlanACP').val('');
    if (datosFila.FechaInicio != null) {
        $('#TxtFechaInicioACP').val(moment(datosFila.FechaInicio).format("DD/MM/YYYY"));
    }

    if (datosFila.FechaSolicitado != null) {
        $('#TxtFechaPlanACP').val(moment(datosFila.FechaSolicitado).format("DD/MM/YYYY"));
    }


     $('#MdlAsignarCP').modal({ keyboard: false });

  /*  LlamadaConsultarDatosUsuario(datosFila.IdUsuario);*/

})

async function CargaUsuariosACP() {

    var url = $('#urlCargaInicialACP').val();

    await $.ajax({

        url: url,
        data: JSON.stringify({ IdProyecto: $('#IdProyectoCP').val() }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            if (data.Exito) {

                $('#SelUsuarioAsignadoACP').empty();
                $('#SelUsuarioAsignadoACP').append(data.LstUsuarios);
                $('#SelUsuarioAsignadoACP').selectpicker('refresh');

            }
            else {

                MensajeAdvertencia(data.Mensaje);
            }

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Ha ocurrido un error inesperado, por favor vuelva a intentarlo.");
        }
    });

}



$(document).on('click', '#BtnGuardarACP', function (e) {
    var Mensaje = ValidaCamposRequeridos(".reqACP");


    if (Mensaje.length == 0) {

        var CP = {
            IdCicloCaso: $('#IdCicloCasoACP').val(),
            IdActividadCaso: $('#IdActividadCasoACP').val(),
            IdActividadEjecucion: $('#IdActividadEjecucionACP').val(),
            IdUsuarioAsignado: $('#SelUsuarioAsignadoACP').val().trim(),
            FechaInicio: ObtieneFecha($('#TxtFechaInicioACP').val().trim()),
            FechaSolicitado: ObtieneFecha($('#TxtFechaPlanACP').val().trim())
        }
        LlamadaGuardarAsignacionACP(CP);
    }

    else {

        MensajeAdvertencia(Mensaje);
    }

});

function LlamadaGuardarAsignacionACP(CP) {

    var url = $('#urlGuardarMACP').val();

    $.ajax({

        url: url,
        data: JSON.stringify({ CP: CP, Lst: CPSAsignar }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessLlamadaGuardarACP,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
}
function SuccessLlamadaGuardarACP(data) {
    if (data.Exito) {

        $('#MdlAsignarCP').modal('hide');
        $('div.pg-loading-screen').remove();
        MensajeExito(data.Mensaje);
        CargarCicloReport();

    }
    else if (data.Advertencia) {

        MensajeAdvertencia(data.Mensaje);

    }
    else {

        MensajeError(data.Mensaje);
    }
}