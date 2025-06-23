
$(document).ready(function () {
    CargarParametros();
});

async function CargaComboProyectos() {
    try {
        const data = await POST($('#urlLeerComboProyecto').val(), {}, false);

        if (data.Exito) {
            $('#selMejora').empty().append(data.CmbProyecto);
        } else {
            MensajeAdvertencia(data.Mensaje)
        }
    } catch (error) {
        MensajeError(error);
    }
}

async function CargarParametros() {
    await CargaComboProyectos();

    var url = $('#urlGetParametros').val();

    $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            var resultado = jQuery.parseJSON(data.Datos);
            if (data.Exito) {
                $("#TxtServidor").val(resultado.MailServidor);
                $("#TxtPuerto").val(resultado.MailPuerto);
                $("#TxtUsuario").val(resultado.MailUsuario);;
                $("#TxtContrasenia").val(resultado.MailContrasena);
                $("#TxtRemitente").val(resultado.MailRemitente);
                $("#chkSSL").prop("checked", resultado.MailSSL);

                $("#TxtIntentosBloqueo").val(resultado.Intentos);
                $("#TxtVigencia").val(resultado.Vigencia);
                $("#TxtCaracteresMinimos").val(resultado.Caracteresmin);
                $("#TxtLDAP").val(resultado.LDAP);

                $("#TxtBaseCumplimiento").val(resultado.CompensacionCumplimiento);
                $("#TxtBaseHoras").val(resultado.CompensacionHoras);
                $("#TxtVigenciaTareas").val(resultado.VigenciaTareas);
                $("#TxtDiasProceso").val(resultado.DiasProceso);

                $("#TxtNombreSistema").val(resultado.NombreSistema);

                $("#selMejora").val(resultado.ProyectoMejora);


                $("#ChkActivAsistencia").prop("checked", resultado.ActivaAsistencia);
                $("#TxtHoraEntrada").val(resultado.HoraEntrada);
                $("#TxtJornada").val(resultado.Jornada);
                $("#TxtToleranciaEntrada").val(resultado.Tolerancia);
                $("#TxtTiempoComida").val(resultado.TiempoComida);

                $("#ChkTipoMetas").prop("checked", resultado.TipoMeta);
                $("#ChkIndFinancieros").prop("checked", resultado.IndFinancieros);
                $("#ChkPregSeguimiento").prop("checked", resultado.PreguntaSeguimiento);


            }
            else {

                MensajeAdvertencia(data.Mensaje);

            }

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
    return false;

}

$("#BtnGuardarMail").click(function () {

    var Mensaje = ValidaCamposRequeridos(".ReqCorreo");


    if (Mensaje.length == 0) {

        var url = $('#urlGuardarCorreo').val();

        var parametros = {};
        parametros["MailServidor"] = $("#TxtServidor").val().trim();
        parametros["MailPuerto"] = $("#TxtPuerto").val().trim();
        parametros["MailUsuario"] = $("#TxtUsuario").val().trim();
        parametros["MailContrasena"] = $("#TxtContrasenia").val().trim();
        parametros["MailRemitente"] = $("#TxtRemitente").val().trim();
        parametros["MailSSL"] = $("#chkSSL").prop("checked");

        $.ajax({

            url: url,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(parametros),
            async: false,
            success: function (data) {
                if (data.Exito) {

                    MensajeExito(data.Mensaje);

                }
                else {

                    MensajeAdvertencia(data.Mensaje);

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


    return false;

});


$("#BtnGuardarAsistencia").click(function () {

    var Mensaje = ValidaCamposRequeridos(".ReqAsistencia");


    if (Mensaje.length == 0) {

        var url = $('#urlGuardarAsistencia').val();

        var parametros = {};
        parametros["TipoMeta"] = $("#ChkTipoMetas").prop("checked");
        parametros["IndFinancieros"] = $("#ChkIndFinancieros").prop("checked");
        parametros["PreguntaSeguimiento"] = $("#ChkPregSeguimiento").prop("checked");
        parametros["ActivaAsistencia"] = $("#ChkActivAsistencia").prop("checked");
        parametros["HoraEntrada"] = $("#TxtHoraEntrada").val().trim();
        parametros["Jornada"] = $("#TxtJornada").val().trim();
        parametros["Tolerancia"] = $("#TxtToleranciaEntrada").val().trim();
        parametros["TiempoComida"] = $("#TxtTiempoComida").val().trim();


        $.ajax({

            url: url,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(parametros),
            async: false,
            success: function (data) {
                if (data.Exito) {

                    MensajeExito(data.Mensaje);

                }
                else {

                    MensajeAdvertencia(data.Mensaje);

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


    return false;

});


$("#BtnGuardarCon").click(function () {


    var Mensaje = ValidaCamposRequeridos(".ReqCon");


    if (Mensaje.length == 0) {

        var url = $('#urlGuardarContrasenia').val();

        var parametros = {};
        parametros["Intentos"] = $("#TxtIntentosBloqueo").val();
        parametros["Vigencia"] = $("#TxtVigencia").val();
        parametros["CaracteresMin"] = $("#TxtCaracteresMinimos").val();
        parametros["LDAP"] = $("#TxtLDAP").val();
        $.ajax({

            url: url,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(parametros),
            async: false,
            success: function (data) {
                if (data.Exito) {

                    MensajeExito(data.Mensaje);

                }
                else {

                    MensajeAdvertencia(data.Mensaje);

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


    return false;

});

$("#BtnGuardarReq").click(function () {
    var Mensaje = ValidaCamposRequeridos(".ReqPro");


    if (Mensaje.length == 0) {

        var url = $('#urlGuardarCompensacion').val();

        var parametros = {};
        parametros["CompensacionCumplimiento"] = $("#TxtBaseCumplimiento").val().trim();
        parametros["CompensacionHoras"] = $("#TxtBaseHoras").val().trim();
        parametros["VigenciaTareas"] = $("#TxtVigenciaTareas").val().trim();
        parametros["DiasProceso"] = $("#TxtDiasProceso").val().trim();


        $.ajax({

            url: url,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(parametros),
            async: false,
            success: function (data) {
                if (data.Exito) {
                    MensajeExito(data.Mensaje);

                }
                else {
                    MensajeAdvertencia(data.Mensaje);

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


    return false;

});


$("#BtnGuardarSis").click(function () {
    var Mensaje = ValidaCamposRequeridos(".ReqSis");



    if (Mensaje.length == 0) {

        MensajeConfirmar("Al realizar esta operación generara que todos los usuarios (Incluso usted) salgan del sistema. <br> ¿Está seguro que desea realizar esta operación?");
    }
    else {
        MensajeAdvertencia(Mensaje);
    }

    return false;

});

$('#BtnGuardarProy').click(async e => {
    e.preventDefault();
    e.stopPropagation();

    var mensaje = ValidaCamposRequeridos('.ReqProy');

    if (mensaje.length === 0) {
        const data = await POST($('#urlGuardarProyecto').val(), { idProyecto: $('#selMejora').val() }, false);

        if (data.Exito) {
            MensajeExito(data.Mensaje);
        } else {
            MensajeAdvertencia(data.Mensaje);
        }
    } else {
        MensajeAdvertencia(mensaje);
    }
})


$(document).on('click touchstart', '.btn-Confirmar', function () {


    var url = $('#urlGuardarSistema').val();

    var form_data = new FormData();
    form_data.append("NombreSistema", $("#TxtNombreSistema").val().trim());
    form_data.append("LogoPrincipal", $("#LogoPrincipal").prop("files")[0]);
    form_data.append("LogoSecundario", $("#LogoSecundario").prop("files")[0]);


    CargaLoading();

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
                FinalizaLoading();
                var url = $('#urlInicio').val();
                window.location.href = url;


            }
            else if (Respuesta == "2") {
                FinalizaLoading();
                MensajeAdvertencia("No tiene permisos para guardar esta información.");

            }

            else {
                FinalizaLoading();
                MensajeAdvertencia(Respuesta);

            }

        },
        error: function (xhr, textStatus, errorThrown) {
            FinalizaLoading();
            var err = eval("(" + xhr.responseText + ")");
            MensajeError(err.Message);
        }
    });

    return false;
});

function readURLPrincipal(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#Principal').attr('src', e.target.result);
            var url = e.target.result;
        }

        reader.readAsDataURL(input.files[0]);
    }
}

$("#LogoPrincipal").change(function () {
    readURLPrincipal(this);
});

function readURLSecundario(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#Secundario').attr('src', e.target.result);
            var url = e.target.result;
        }

        reader.readAsDataURL(input.files[0]);
    }
}

$("#LogoSecundario").change(function () {
    readURLSecundario(this);
});