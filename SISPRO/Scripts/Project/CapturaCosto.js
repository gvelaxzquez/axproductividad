function CargaInicialCosto() {
    $('#TxtFechaIniCosto,#TxtFechaFinCosto').datetimepicker(
        {
            format: 'DD/MM/YYYY'
        });
    $("#divrecurso").hide();
    $("#divcosto").show();
    InicializaCombosCosto();

}

function InicializaCombosCosto() {

    var url = $('#urlCargaInicialCapturaCosto').val();

    $.ajax({

        url: url,
        data: JSON.stringify({ IdProyecto: $("#IdProyectoCosto").val() }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessInicializaCombosCosto,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });

}

function SuccessInicializaCombosCosto(data) {

    if (data.Exito) {


        $('#SelActividadCosto').empty();
        $('#SelActividadCosto').append(data.LstFases);
        $('#SelActividadCosto').selectpicker('refresh');

        $('#SelRecursoCosto').empty();
        $('#SelRecursoCosto').append(data.LstUsuarios);
        $('#SelRecursoCosto').selectpicker('refresh');
    }
    else {

        MensajeError(data.Mensaje);

    }
}

$(document).on('click', '#BtnGuardarCosto', function (e) {

    GuardarCostoDirecto();
    return false;
});


async function GuardarCostoDirecto() {


    var Mensaje = ValidaCamposRequeridos(".ReqCosto");

    if ($('#ChkAplicado').is(":checked")) {
        Mensaje += ValidaCamposRequeridos2(".ReqCostoAplicado");
    }
    else {
        Mensaje += ValidaCamposRequeridos2(".ReqCostoplan");
    }

    if (Mensaje.length == 0) {


        var Costo = {
            IdProyectoCd: $('#IdProyectoCD').val(),
            IdProyecto: $('#IdProyectoCosto').val(),
            IdRecurso: $('#SelRecursoCosto').val(),
            FechaInicio: $('#TxtFechaIniCosto').val(),
            FechaFin: $('#TxtFechaFinCosto').val(),
            TipoActividadId: $('#SelActividadCosto').val(),
            CostoPeriodo: $('#TxtCostoMensual').val(),
            Nombre: $('#TxtNombreRecCosto').val(),
            Aplicado: $('#ChkAplicado').prop('checked')
        }

        const data = await POST('/Proyectos/EditarCostoDirecto', { costo: Costo });

        if (data.Exito) {
            MensajeExito(data.Mensaje);
            $('#ModalCapturarCosto').modal('hide');
        } else {
            MensajeAdvertencia(data.Mensaje);
        }

        //var url = $('#urlRegistraCosto').val();


        //$.ajax({
        //    url: url,
        //    type: "POST",
        //    data: JSON.stringify({ Costo: Costo }),
        //    contentType: "application/json; charset=utf-8",
        //    dataType: "json",
        //    async: false,
        //    success: function (data) {
        //        if (data.Exito) {

        //            MensajeExito(data.Mensaje);
        //            $('#ModalCapturarCosto').modal('hide');
        //        }
        //        else {

        //            MensajeError(data.Mensaje);

        //        }

        //    },
        //    error: function (xmlHttpRequest, textStatus, errorThrown) {

        //        MensajeError(data.Mensaje);
        //    }
        //});

    }
    else {

        MensajeAdvertencia(Mensaje);
    }
}


$('#ChkAplicado').change(function () {
    if ($(this).is(":checked")) {
        $("#divrecurso").show();
        $("#divcosto").hide();
    }
    else {
        $("#divrecurso").hide();
        $("#divcosto").show();
    }

});

var tipoCD = "";
function CargaEdicionCosto() {

    var url = $('#urlConsultaCosto').val();

    $.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify({ IdProyectoCD: $('#IdProyectoCD').val() }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            if (data.Exito) {
                var Costo = jQuery.parseJSON(data.Costo);

                if (Costo.IdRecurso == null) {
                    $('#divNombreRecurso').removeClass('hidden');
                    $('#divSelectRecurso').addClass('hidden').removeClass('ReqCostoAplicado');
                } else {
                    $('#divNombreRecurso').addClass('hidden');
                    $('#divSelectRecurso').removeClass('hidden').addClass('ReqCostoAplicado');
                }

                $('#SelRecursoCosto').val(Costo.IdRecurso);
                $('#TxtFechaIniCosto').val(moment(Costo.FechaInicio).format("DD/MM/YYYY"));
                $('#TxtFechaFinCosto').val(moment(Costo.FechaFin).format("DD/MM/YYYY"));
                $('#SelActividadCosto').val(Costo.TipoActividadId);
                $('#TxtCostoMensual').val(Costo.CostoPeriodo);
                $('#TxtNombreRecCosto').val(Costo.Nombre);
                cambiaEstadoSwitch($('#ChkAplicado'), Costo.Aplicado);
                $('#SelActividadCosto').selectpicker('refresh');
                $('#SelRecursoCosto').selectpicker('refresh')
                tipoCD = Costo.Tipo;
                if (Costo.PorcDedicado > 0) {
                    $('#divDedicadoCD').removeClass('hidden');
                    $('#lblDedicadoCD').val(Costo.PorcDedicado.toFixed(2) + " %");
                } else if (Costo.HorasInvertidas > 0) {
                    $('#divDedicadoCD').removeClass('hidden');
                    $('#lblDedicadoCD').val(Costo.HorasInvertidas.toFixed(2) + " horas");
                } else {
                    $('#divDedicadoCD').addClass('hidden');
                    $('#lblDedicadoCD').val('');
                }

                if (tipoCD === 'fijo') {
                    $('#divActualizacion').addClass('hidden');
                } else {
                    $('#divActualizacion').removeClass('hidden');
                }
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
