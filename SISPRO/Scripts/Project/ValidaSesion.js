// @JMM: Válida que la sesión este activa si ya cáduco envia el usuario al login
 
$(window).focus(function () {

    var url = "Home/ValidaSesion";

    $.ajax({
        url: url,
        data: {},
        type: "post",
        dataType: "json",
        async: false,
        success: function (data) {
            if (!data.Exito) {
             MensajeAdvertenciaSesion(data.Mensaje);
            }
           
        },
        error: function (xhr, ajaxOptions, thrownError) {
            MensajeAdvertenciaSesion ("Se ha perdido la conexiòn con el servidor, por favor inicie sesión nuevamente.");
        }
    });


});


$(document).on('click', '#BtnAceptarSalir', function (e) {
 
      window.location.href = './Login';

    return false;
});