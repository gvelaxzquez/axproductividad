$(document).on('click touchstart', '#BtnLogin ', function () {


    if (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i) ){
    MensajeAdvertencia("Para ingresar al sistema debe actualizar su navegador, se recomienda utilizar Google Chrome.");
    return false;
    }
 
    var form = $("#frmLogin");

    form.validate({
        messages: {
            Usuario: {
                required: "Ingrese el usuario.",
                email: "Ingrese un correo válido."

            },
            Contrasena: {
                required: "Ingrese la contraseña."
            },

        }

    });


    if (form.valid()) {

        if ($('#TxtUsuario').val().trim() == "") {


    


            /*     MensajeAdvertencia('Ingrese el usuario.');*/

            return false;

        }

        if (!ValidaCorreo($('#TxtUsuario').val().trim())) {

            MensajeAdvertencia('Dirección de correo inválida.');
            return false;
        }


        if ($('#TxtContrasena').val().trim() == "") {

            MensajeAdvertencia('Ingrese la contraseña.');
            return false;

        }


        var url = $('#urlLogin').val();

        var parametros = {};
        parametros["Usuario"] = $("#TxtUsuario").val().trim();
        parametros["Contrasena"] = $("#TxtContrasena").val().trim();

        $.ajax({

            url: url,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(parametros),
            async: false,
            success: function (data) {
                if (data.Exito) {

                    if ($('#ChkRecordar').prop('checked')) {
                        setCookie("correo", $("#TxtUsuario").val().trim(), 365);
                        setCookie("contrasena", $("#TxtContrasena").val().trim(), 365);
                    }
                    else {
                        setCookie("correo", "", -1);
                        setCookie("contrasena", "", -1);
                    }
             
                    window.location.href = data.URL;
                }
                else {

                    Swal.fire({
                        title: 'Error!',
                        text: data.Mensaje,
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });


                 /*   MensajeAdvertencia(data.Mensaje);*/

                }

            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {

                Swal.fire({
                    title: 'Error!',
                    text: data.Mensaje,
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });

            }
        });
    }


        return false;
});
$(document).ready(function () {


    var username = getCookie("correo");
    var password = getCookie("contrasena");
    if (username != "" && password != "") {
        $("#TxtUsuario").val(username);
        $("#TxtContrasena").val(password);

        cambiaEstadoSwitch($('#ChkRecordar'), true);
    } else {
        cambiaEstadoSwitch($('#ChkRecordar'), false);
    }


    jQuery.validator.setDefaults({
        debug: true,
        success: "valid"
    });





});

$(document).on('click touchstart', '#BtnRecuperar ', function () {

    var form = $("#frmRecuperar");

    form.validate({
        messages: {
            UsuarioRecuperar: {
                required: "Ingrese el correo.",
                email: "Ingrese un correo válido."

            },

        }

    });



    //MensajeAdvertencia('Ingrese el correo. ' + form.valid() );


/*   $("#frmRecuperar").validate();*/

    if (form.valid()) {

        if ($('#TxtUsuarioRecuperar').val().trim() == "") {

            MensajeAdvertencia('Ingrese el correo.');

            return false;

        }

        if (!ValidaCorreo($('#TxtUsuarioRecuperar').val().trim())) {

            MensajeAdvertencia('Dirección de correo inválida.');
            return false;
        }



        var url = $('#urlRecuperarPass').val();

        var parametros = {};
        parametros["Usuario"] = $("#TxtUsuarioRecuperar").val().trim();

        $.ajax({

            url: url,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(parametros),
            async: false,
            success: function (data) {
                if (data.Exito) {


                    $("#mensajeconfirma").text("Enviamos la información al correo " + $("#TxtUsuarioRecuperar").val().trim());
                    $('#Recuperar').finish().delay(50).fadeOut('slow', function () {
                        $('#Confirmar').fadeIn('slow');
                    });

                    /* MensajeExito(data.Mensaje);*/
                }
                else {

                    Swal.fire({
                        title: 'Error!',
                        text: data.Mensaje,
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });

                }

            },
            error: function (xmlHttpRequest, textStatus, errorThrown) {

                Swal.fire({
                    title: 'Error!',
                    text: "Ocurrió un error al enviar la contraseña, por favor intente de nuevo.",
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });


            
            }
        });
    }


    return false;

});

$(".cajaTextoLogin").keypress(function (e) {
    if (e.keyCode == 13) {
        $("#BtnLogin").click();
        return false;
    }
    return true;
});

function IrRecuperar() {
    //$("#Login").fadeOut(1000);
    //$("#Recuperar").fadeIn(5000);

 
   $('#Login').finish().delay(50).fadeOut('slow', function () {
        $('#Recuperar').fadeIn('slow');
       
      
    });
};

function RegresaLogin() {
    //$("#Recuperar").fadeOut(1000);
    //$("#Login").fadeIn(5000);

    $('#Recuperar').finish().delay(50).fadeOut('slow', function () {
        $('#Login').fadeIn('slow');
    });

};

function RegresaLoginConf() {
    //$("#Recuperar").fadeOut(1000);
    //$("#Login").fadeIn(5000);

    $('#Confirmar').finish().delay(50).fadeOut('slow', function () {
        $('#Login').fadeIn('slow');
    });

};


function Confirmacion() {
    //$("#Recuperar").fadeOut(1000);
    //$("#Login").fadeIn(5000);

    $('#Recuperar').finish().delay(50).fadeOut('slow', function () {
        $('#Confirmar').fadeIn('slow');
    });

};



function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
