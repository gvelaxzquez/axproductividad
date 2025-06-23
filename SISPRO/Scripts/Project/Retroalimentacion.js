var dsPreguntas = [];
var tablaPreguntas;

var dsPreguntasRespuestas = [];
var tablaPreguntasRespuestas;



var columnasPreguntas = [
    {
        "data": "Pregunta",
        "class": "text-left",
    },
    {
        "data": "FechaIni",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? "" : moment(data).format("YYYY/MM/DD"))
        }
    },
    {
        "data": "FechaCierre",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? "" : moment(data).format("YYYY/MM/DD"))
        }
    },
    {
        "class": "text-center",
        "render": function (data, type, row) {
            return '<button type="button" class="btn btn-default BtnEditarPregunta"><span class="fa fa-pencil-square-o"></span></button>'


        }
    },
    {
        "class": "text-center",
        "render": function (data, type, row) {
            return '<button type="button" class="btn btn-default BtnVerRespuestas"><span class="glyphicon glyphicon-list-alt"></span></button>'


        }
    }


];

var columnasPreguntasRespuestas = [

    {
        "class": "text-center",
        "data": "NumEmpleado",
        "render": function (data, type, row) {
            return '<img class="img-dt" title="' + row.Lider + '" src="http://app.yitpro.com/Archivos/Fotos/' + data + '.jpg"  alt="' + data + '" style="width:60px; height:60px;cursor:pointer;">'


        }
    },
    {
        "data": "NombreUsuario",
        "class": "text-left",
        //"render": function (data, type, row) {
        //    return '<a style="cursor:pointer;" onclick="ConsultaPerfil(' + row.IdUsuario + ')"> <h4 style="margin-top:5px;"> ' + data + '</h4></a>'


        //}
    },

    {
        "data": "FechaRespuesta",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? "" : moment(data).format("YYYY/MM/DD"))
        }
    },
    {
        "data": "Respuesta",
        "class": "text-left",
    }

];

$(document).ready(function () {
    CargaPreguntas();

    $('#TxtFechaIniPreg,#TxtFechaFinPreg').datetimepicker(
        {
            format: 'DD/MM/YYYY'
        });
});


function CargaPreguntas() {
    var url = $('#urlCargaPreguntas').val();
    $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: successCargaPreguntas,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
    return false;
}

function successCargaPreguntas(data) {
    if (data.Exito) {

        dsPreguntas = jQuery.parseJSON(data.LstCatalogos);

        tablaPreguntas = inicializaTabla($('#TblPreguntas'), dsPreguntas, columnasPreguntas, 1, "asc", true, true, true);


    }
    else if (data.Advertencia) {
        MensajeAdvertencia(data.Mensaje);
    }
    else {
        MensajeError(data.Mensaje);
    }
}


function LimpiarFormularioPregunta() {

    $('#IdPregunta').val("0");
    $('#TxtFechaIniPreg').val('');
    $('#TxtFechaFinPreg').val('');
    $('#TxtPregunta').text('');


}

$(document).on('click', '#BtnNuevoPreg', function (e) {


    LimpiarFormularioPregunta()
    $('#ModalPreguntas').on('hidden.bs.modal', function () {
        CargaPreguntas();
        $(this).off('hidden.bs.modal');
    });
    $('#ModalPreguntas').modal('show');


});

$(document).on('click', '.BtnEditarPregunta', function (e) {

    var filaPadre = $(this).closest('tr');
    var row = tablaPreguntas.api().row(filaPadre);
    var datosFila = row.data();


    $('#IdPregunta').val(datosFila.IdPregunta);
    $('#TxtFechaIniPreg').val(moment(datosFila.FechaIni).format("DD/MM/YYYY"));
    $('#TxtFechaFinPreg').val(moment(datosFila.FechaCierre).format("DD/MM/YYYY"));
    $('#TxtPregunta').text(datosFila.Pregunta);


    $('#ModalPreguntas').on('hidden.bs.modal', function () {
        CargaPreguntas();
        $(this).off('hidden.bs.modal');
    });
    $('#ModalPreguntas').modal('show');

});

$(document).on('click', '#BtnGuardarPregunta', function (e) {

    var Mensaje = ValidaCamposRequeridos(".ReqPregunta");

    if (Mensaje.length == 0) {


        var url = $('#urlGuardarPregunta').val();

        Pregunta = {
            IdPregunta: $('#IdPregunta').val(),
            Pregunta: $('#TxtPregunta').val(),
            FechaIni: ObtieneFecha($('#TxtFechaIniPreg').val().trim()),
            FechaCierre: ObtieneFecha($('#TxtFechaFinPreg').val().trim())
            
        };


        $.ajax({

            url: url,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ Pregunta: Pregunta }),
            async: false,
            success: function (data) {

                if (data.Exito) {

                    MensajeExito(data.Mensaje);
                    $('#ModalPreguntas').modal('hide');
                    $('div.pg-loading-screen').remove();

                }
                else {

                    MensajeAdvertencia(data.Mensaje);

                }

            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {

                MensajeError("Error al guardar pregunta.");
            }
        });


    }
    else {

        MensajeAdvertencia(Mensaje);
    }

    return false;
});


$(document).on('click', '.BtnVerRespuestas', function (e) {

    var filaPadre = $(this).closest('tr');
    var row = tablaPreguntas.api().row(filaPadre);
    var datosFila = row.data();



    $('#LblPregunta').text(datosFila.Pregunta);

    CargaPreguntaRespuestas(datosFila.IdPregunta);

    $('#ModalPreguntaRespuesta').modal('show');

});



function CargaPreguntaRespuestas(IdPregunta) {
    var url = $('#urlCargaPreguntaRespuestas').val();
    $.ajax({

        url: url,
        data: JSON.stringify({ IdPregunta: IdPregunta }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: successCargaPreguntaRespuesta,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
    return false;
}

function successCargaPreguntaRespuesta(data) {
    if (data.Exito) {

        dsPreguntasRespuestas = jQuery.parseJSON(data.LstCatalogos);

        tablaPreguntasRespuestas = inicializaTabla($('#TblRespuestas'), dsPreguntasRespuestas, columnasPreguntasRespuestas, 1, "asc", true, true, true);


    }
    else if (data.Advertencia) {
        MensajeAdvertencia(data.Mensaje);
    }
    else {
        MensajeError(data.Mensaje);
    }
}