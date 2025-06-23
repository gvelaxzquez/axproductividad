$(document).ready(function () {
    Inicializar();
});

function Inicializar() {

    var fechaactual = new Date();

    var mes = (fechaactual.getMonth() + 1).toString();
    var anio = fechaactual.getFullYear().toString();

    if (mes == '13'){
    mes = '1';
    }

    $("#SelAnio").val(anio);
    $("#SelMes").val(mes);
    //$(".file-input-name").val('');



    var fileInput = $('#Archivo');
    fileInput.replaceWith(fileInput.val('').clone(true));

    var spans = $('.file-input-name');
    spans.text('');

};

$("#BtnDescargarFormato").click(function () {

    window.location = "./Archivos/Formatos/FormatoPresupuestos.xlsx";

    return false;

});


$("#BtnGuardarPresupuesto").click(function () {

    var Mensaje = ValidaCamposRequeridos(".ReqPres");


    if (Mensaje.length == 0) {
        MensajeConfirmar("En caso de existir información para el mes/año seleccionado será reemplazada. <br> ¿Está seguro que desea realizar esta operación?");
    }
    else {

        MensajeAdvertencia(Mensaje);
    }

    return false;

});

$(document).on('click touchstart', '.btn-Confirmar', function () {

    var url = $('#urlGuardarPresupuesto').val();

    var form_data = new FormData();
    form_data.append("Anio", $("#SelAnio").val().trim());
    form_data.append("Mes", $("#SelMes").val().trim());
    form_data.append("Presupuesto", $("#Archivo").prop("files")[0]);

    $.ajax({

        url: url,
        type: "POST",
        contentType: false,
        dataType: "script",
        data: form_data,
        processData: false,
        async: false,
        success: function (Respuesta) {
            if (Respuesta == "1") {
                Inicializar();
                MensajeExito("Los datos se guardaron correctamente.");
            }
            else if(Respuesta == "3"){
                MensajeAdvertencia("No tiene permisos para guardar esta información.");
            
            }
            else  {
                MensajeAdvertencia("Hubo un error al procesar la información, por favor verifique que el archivo seleccionado sea el correcto.");
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            var err = eval("(" + xhr.responseText + ")");
            MensajeError(err.Message);
        }
    });


    return false;
});

