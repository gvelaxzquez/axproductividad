
$(document).on('click', '#BtnGuardarCapturaT', function (e) {

 var Mensaje = ValidaCamposRequeridos(".ReqCapturaT");

 if(Mensaje.length == 0){

    var url = $('#urlActualizaCapturaT').val();

    $.ajax({
        url: url,
        data: JSON.stringify({IdActividad : $("#IdActividadCT").val(), FechaFin :$("#TxtFinActividad").val() } ),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            if (!data.Exito) {
                MensajeAdvertencia(data.Mensaje);

            }
            
         

              $('#ModalCapturarTiempo').modal('hide');

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error al guardar la información, intente de nuevo.");
        }
    });
    }
    else {
     MensajeAdvertencia(Mensaje);
    }       

    //CargaTablero();

    return false;

});
