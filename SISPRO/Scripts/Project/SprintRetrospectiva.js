
var tipor = 0;


var dsTablaSTC = [];

var tablaSTC;

var columnasSTC = [
 

    {
        "data": "IdActividadStr",
        "class": "text-left",


    },
    {
        "data": "BR",
        "class": "text-left",
        //"render": function (data, type, row) {

        //    //return '<button type="button" class="btn btn-default details-control" title="Ver detalle" ><i class="fa fa-angle-right"></i></button><a style="color: #337ab7" class="btn btn-link" onclick="clickalerta(' + row.IdActividad + ' )">' + data + '</a>';
        //    return ' <img src="/Content/Project/Imagenes/' + row.TipoUrl + '" class="img-dt" title="' + row.TipoNombre + '" style="width:24px; height:24px; margin-left:12px;" /><a style="color: #337ab7" class="btn btn-link" onclick="clickalerta(' + row.IdActividad + ' )">' + data + '</a>';

        //}
    },
    {
        "data": "Puntos",
        "class": "text-right",


    },
    {
        "class": "text-center",
        "data": "Seleccionado",
        "render": function (data, type, row) {



            if (data) {
                return tipor == 1 ? '<input type="checkbox" class="SeleccionarSTC" checked disabled>' :  '<input type="checkbox" class="SeleccionarSTC" checked>';
            }
            else {
                return tipor == 1 ? '<input type="checkbox" class="SeleccionarSTC" disabled>': '<input type="checkbox" class="SeleccionarSTC">';
            }

        

        }
    },

];

function AbrirModalSprintRetrospectiva(tipo, IdSprint) {

 

    /*   $('#TxtDescripcion').summernote('fontName', 'Arial');*/

  

    $('#IdSpRetrospectiva').val(IdSprint);
    $('.summernote').summernote({
        airMode: true,
        dialogsInBody: true,
        disableDragAndDrop: true
    });

    $('.note-view').hide();
    $('.note-help').hide();

    $('#TxtFechaCierreI').datetimepicker(
        {
            format: 'DD/MM/YYYY'
        });

    tipor = tipo;

    if (tipo == 0) {
        //$("#TxtSprintRetrospectiva").show();
        //$("#LblSprintRetrospectiva").empty();
        //$("#LblSprintRetrospectiva").hide();
      /*  $('.note-editor').show();*/
        $("#BtnGuardarSprintRetrospectiva").show();
       
    }
    else {


    
        //$("#LblSprintRetrospectiva").show();
        //$("#TxtSprintRetrospectiva").hide();
        //$('.note-editor').hide();
        $("#BtnGuardarSprintRetrospectiva").hide();
     

    }


    ConsultaSprintRetrospectiva(IdSprint);


    $('#ModalSprintRetrospectiva').modal('show');


}


function ConsultaSprintRetrospectiva(IdIteracion) {

    var url = $('#urlConsultaSprintRetrospectiva').val();



    $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ IdIteracion: IdIteracion }),
        async: false,
        success: function (data) {

            if (data.Exito) {

                var datos = jQuery.parseJSON(data.Retrospectiva);
                $("#LblSprint").text(datos.Nombre);
                $('#TxtSprintRetrospectiva').code(datos.Retrospectiva);
                $('#TxtFechaCierreI').val(datos.FechaCierre == null || datos.FechaCierre == "" ? "" : moment(datos.FechaCierre).format("DD/MM/YYYY"));


                dsTablaSTC = jQuery.parseJSON(data.LstActividades);
                tablaSTC = inicializaTabla($('#TblSprintTComplete'), dsTablaSTC, columnasSTC, 1, "asc", true, true, true);

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


$(document).on('click', '#BtnGuardarSprintRetrospectiva', function (e) {

    var Mensaje = ValidaCamposRequeridos(".ReqRetrospectiva");


    var Terminadas = '';

    $.map(dsTablaSTC, function (obj, index) {
        if (obj.Seleccionado) {
            Terminadas += obj.IdActividad + ',';
        }
    });

    var terminado = 0;
    var planeado = 0;

    $.each(dsTablaSTC, function (index, value) {
        var a = parseInt(value.Puntos);
        var b = parseInt(value.Puntos);

        planeado += b;

        if (value.Seleccionado) {

            terminado += a;

        }

    }
    );



    if (Mensaje.length == 0) {


        var url = $('#urlGuardarSprintRetrospectiva').val();

        PI = {
            IdIteracion: $('#IdSpRetrospectiva').val(),
            FechaCierre: $('#TxtFechaCierreI').val(),
            PPlaneado: planeado,
            PTerminado: terminado,
            Retrospectiva: $("#TxtSprintRetrospectiva").code()

        };


        $.ajax({

            url: url,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ PI: PI, Actividades: Terminadas }),
            async: false,
            success: function (data) {

                if (data.Exito) {

                    MensajeExito(data.Mensaje);
                    $('#ModalSprintRetrospectiva').modal('hide');
                    setTimeout(function () {
                        location.reload();
                    }, 3000);

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


$(document).on('change', '.SeleccionarSTC', function (e) {
    var filaPadre = $(this).closest('tr');
    var row = tablaSTC.api().row(filaPadre);
    var datosFila = row.data();
    var IdActividad = datosFila.IdActividad;

    var indexes = $.map(dsTablaSTC, function (obj, index) {
        if (obj.IdActividad == IdActividad) {
            return index;
        }
    });
    dsTablaSTC[indexes[0]].Seleccionado = $(this).prop('checked');

    return false;

});



