function CargaInicialCostoIndirecto(){
    $('#TxtFechaCI').datetimepicker(
    {
        format: 'DD/MM/YYYY'
    });
  InicializaCombosCostoIndirecto();

  $('#TxtFechaCI').val('');
  $('#TxtConceptoCI').val('');
  $('#TxtMontoCI').val('');

}

function InicializaCombosCostoIndirecto(){

    var url = $('#urlCargaInicialCapturaCostoIndirecto').val();

    $.ajax({

        url: url,
        data: JSON.stringify( {IdProyecto: $("#IdProyectoCostoInd").val()}),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessInicializaCombosCostoIndirecto,
        error: function (xmlHttpRequest, textStatus, errorThrown) {
        
            MensajeError(data.Mensaje);
        }
    });

}

function SuccessInicializaCombosCostoIndirecto(data){

    if (data.Exito) {
      

                  $('#SelActividadCI').empty();
                  $('#SelActividadCI').append(data.LstFases);
                  $('#SelActividadCI').selectpicker('refresh');

    }
    else  {

     MensajeError(data.Mensaje);
    
    }
}

$(document).on('click', '#BtnGuardarCostoIndirecto', function (e) {

    GuardarCostoIndirecto();
    return false;
});

function GuardarCostoIndirecto() {


    var Mensaje = ValidaCamposRequeridos(".ReqCostoInd");


    if (Mensaje.length == 0) {


        var Costo = {
            IdProyectoCI: $('#IdProyectoCI').val(),
            IdProyecto: $('#IdProyectoCostoInd').val(),
            TipoActividadId: $('#SelActividadCI').val(),
    
            Fecha: $('#TxtFechaCI').val(),
            Concepto: $('#TxtConceptoCI').val(),
            Monto: $('#TxtMontoCI').val()

        }

        var url = $('#urlRegistraCostoInd').val();


        $.ajax({
            url: url,
            type: "POST",
            data: JSON.stringify({ Costo: Costo }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (data) {
                if (data.Exito) {

                    MensajeExito(data.Mensaje);
                    $('#ModalCapturarCostoIndirecto').modal('hide');
                }
                else {

                    MensajeError(data.Mensaje);

                }

            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {

                MensajeError(data.Mensaje);
            }
        });

    }
    else {

        MensajeAdvertencia(Mensaje);
    }
}

function CargaEdicionCostoIndirecto() {

    var url = $('#urlConsultaCostoIndirecto').val();

    $.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify({ IdProyectoCI: $('#IdProyectoCI').val() }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            if (data.Exito) {


                var Costo = jQuery.parseJSON(data.Costo);
               
               
                $('#SelActividadCI').val(Costo.TipoActividadId);
                $('#TxtFechaCI').val(moment(Costo.Fecha).format("DD/MM/YYYY"));
                $('#TxtConceptoCI').val(Costo.Concepto);
                $('#TxtMontoCI').val(Costo.Monto);

                $('#SelActividadCI').selectpicker('refresh');

            }
            else {

                MensajeError(data.Mensaje);

            }

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });

}


