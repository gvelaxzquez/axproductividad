
toastr.options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": false,
  "progressBar": true,
   "positionClass": "toast-top-right toast-margin",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "3000",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}


function MensajeError(mensaje) {

toastr.error(mensaje,'Error!');
    
}

function MensajeExito(mensaje) {


   toastr.success(mensaje,'Éxito!');
}
 
function MensajeAdvertencia(mensaje) {

 toastr.warning(mensaje,'Advertencia!');


}


function MensajeAdvertenciaOK(mensaje) {

    var mensajeAdvertencia = "" +
     "<div class='modal fade bs-example-modal-sm' id='myModal' tabindex='-1' role='dialog' aria-labelledby='mySmallModalLabel'>" +
         "<div class='modal-dialog modal-sm ModalMensajes'  >" +
             "<div class='modal-content modalAdvertencia'>" +
                 "<div class='modal-header TituloMensajeAdvertencia'>" +
                     "<h2 class='modal-title modaltitle' id='myModalLabel'>" +
                         "Advertencia!" +
                     "</h2>" +
                 "</div>" +
                 "<div class='modal-body modalbody'>" +

                     "<div class='col-md-9'> " +
                            mensaje +
                     "</div>" +
                 "</div>" +
                 "<div class='modal-footer modalpie'>" +
                     "<button type='button' id='BtnAceptar' class='btn-Advertencia' data-dismiss='modal'>" +
                         "Aceptar" +
                     "</button>" +
                 "</div>" +
             "</div>" +
         "</div>" +
     "</div>";

    $('div.mensajes').html(mensajeAdvertencia);


    $("#myModal").modal("show");

}


function MensajeConfirmar(mensaje) {

    var mensajeConfirmar = "" +
    "<div class='modal fade bs-example-modal-sm' id='modalConfirmar' tabindex='-1' role='dialog' aria-labelledby='mySmallModalLabel'> <div class='modal-dialog modal-sm ModalMensajes'  > " +
        "<div class='modal-content modalConfirmar'>      " +
            "<div class='modal-header TituloMensajeConfirmar'>     " +
                "<h2 class='modal-title modaltitle' id='myModalLabel'>" +
                    "Confirmar!" +
                "</h2>    " +
                "</div>    " +
                "<div class='modal-body modalbody mensajeConfirmar'>" +
                     mensaje +
                "</div>" +
                "<div class='modal-footer modalpie'>" +
                    "<button type='button' id='BtnConfirmar' class='btn-Confirmar' data-dismiss='modal'>" +
                        "Aceptar" +
                    "</button>" +
                    "<button type='button' class='btn-Cancelar' data-dismiss='modal'>" +
                       "Cerrar" +
                    "</button>" +
                "</div>" +
            "</div>" +
        "</div>" +
    "</div>";

    $('div.mensajesConfirmacion').html(mensajeConfirmar);
    $('#modalConfirmar').on('hide.bs.modal', function (e) {
        //debugger;

        $('#ModalProveedores,#ModalRequisicones,#ModalProductosServicios,#ModalEditarUsuario,#ModalPermisosTipoUsuario').css('overflow-y', 'auto');
        $('#ModalProveedores,#ModalRequisicones,#ModalProductosServicios,#ModalEditarUsuario,#ModalPermisosTipoUsuario').css('overflow-x', 'hidden');


        $('body').addClass('modal-open');

    })

    $("#modalConfirmar").modal("show");

}
 

function MensajeConfirmarAccion(mensaje, accion) {

    var mensajeConfirmar = "" +
    "<div class='modal fade bs-example-modal-sm' id='modalConfirmar' tabindex='-1' role='dialog' aria-labelledby='mySmallModalLabel'> <div class='modal-dialog modal-sm ModalMensajes'  > " +
        "<div class='modal-content modalConfirmar'>      " +
            "<div class='modal-header TituloMensajeConfirmar'>     " +
                "<h2 class='modal-title modaltitle' id='myModalLabel'>" +
                    "Confirmar!" +
                "</h2>    " +
                "</div>    " +
                "<div class='modal-body modalbody mensajeConfirmar'>" +
                     mensaje +
                "</div>" +
                "<div class='modal-footer modalpie'>" +
                    "<button type='button' id='"+  accion  +"' class='btn-Confirmar' data-dismiss='modal'>" +
                        "Aceptar" +
                    "</button>" +
                    "<button type='button' class='btn-Cancelar' data-dismiss='modal'>" +
                       "Cerrar" +
                    "</button>" +
                "</div>" +
            "</div>" +
        "</div>" +
    "</div>";

    $('div.mensajesConfirmacion').html(mensajeConfirmar);
    $('#modalConfirmar').on('hide.bs.modal', function (e) {
        //debugger;

        $('#ModalProveedores,#ModalRequisicones,#ModalProductosServicios,#ModalEditarUsuario,#ModalPermisosTipoUsuario').css('overflow-y', 'auto');
        $('#ModalProveedores,#ModalRequisicones,#ModalProductosServicios,#ModalEditarUsuario,#ModalPermisosTipoUsuario').css('overflow-x', 'hidden');

        $('.modal').css('overflow-y', 'auto');
        $('.modal').css('overflow-x', 'hidden');


        $('body').addClass('modal-open');

    })

    $("#modalConfirmar").modal("show");

}

function MensajeConfirmarAccionV2(mensaje, accion,accion2) {

    var mensajeConfirmar = "" +
        "<div class='modal fade bs-example-modal-sm' id='modalConfirmar' tabindex='-1' role='dialog' aria-labelledby='mySmallModalLabel'> <div class='modal-dialog modal-sm ModalMensajes'  > " +
        "<div class='modal-content' style='height:150px;'>      " +
        "<div class='modal-header'>     " +
        "<h5>" +
        "Confirmar!" +
        "</h5>    " +
        "</div>    " +
        "<div class='modal-body  mensajeConfirmar'><div class='row pull-left' > " +
        mensaje  +

        "</div><br/><br/>"+

        "</div>" +

        "<div class='modal-footer  pull-right'>" +
        "<button type='button' class='btn btn-default' data-dismiss='modal'>" +
        "Cancelar" +
        "</button>" +

        "<button type='button' id='" + accion + "' class='btn btn-info' data-dismiss='modal'>" +
        "Descartar cambios" +
        "</button>" +
        "<button type='button' id='" + accion2 + "' class='btn btn-success' data-dismiss='modal'>" +
        "Guardar cambios" +
        "</button>" +

        "</div>" +
        "</div>" +
        "</div>" +
        "</div>";

    $('div.mensajesConfirmacion').html(mensajeConfirmar);
    $('#modalConfirmar').on('hide.bs.modal', function (e) {
        //debugger;

        $('#ModalProveedores,#ModalRequisicones,#ModalProductosServicios,#ModalEditarUsuario,#ModalPermisosTipoUsuario').css('overflow-y', 'auto');
        $('#ModalProveedores,#ModalRequisicones,#ModalProductosServicios,#ModalEditarUsuario,#ModalPermisosTipoUsuario').css('overflow-x', 'hidden');

        $('.modal').css('overflow-y', 'auto');
        $('.modal').css('overflow-x', 'hidden');


        $('body').addClass('modal-open');

    })

    $("#modalConfirmar").modal("show");

}




function MensajeConfirmarIncidencia(mensaje) {

    var mensajeConfirmar = "" +
    "<div class='modal fade bs-example-modal-sm' id='modalConfirmar' tabindex='-1' role='dialog' aria-labelledby='mySmallModalLabel'> <div class='modal-dialog modal-sm ModalMensajes'  > " +
        "<div class='modal-content modalConfirmar'>      " +
            "<div class='modal-header TituloMensajeConfirmar'>     " +
                "<h2 class='modal-title modaltitle' id='myModalLabel'>" +
                    "Confirmar!" +
                "</h2>    " +
                "</div>    " +
                "<div class='modal-body modalbody mensajeConfirmar'>" +
                     mensaje +
                "</div>" +
                "<div class='modal-footer modalpie'>" +
                    "<button type='button' id='BtnConfirmarInc' class='btn-Confirmar' data-dismiss='modal'>" +
                        "Aceptar" +
                    "</button>" +
                    "<button type='button' class='btn-Cancelar' data-dismiss='modal'>" +
                       "Cerrar" +
                    "</button>" +
                "</div>" +
            "</div>" +
        "</div>" +
    "</div>";

    $('div.mensajesConfirmacion').html(mensajeConfirmar);
    $('#modalConfirmar').on('hide.bs.modal', function (e) {
        //debugger;

        $('#ModalProveedores,#ModalRequisicones,#ModalProductosServicios,#ModalEditarUsuario,#ModalPermisosTipoUsuario').css('overflow-y', 'auto');
        $('#ModalProveedores,#ModalRequisicones,#ModalProductosServicios,#ModalEditarUsuario,#ModalPermisosTipoUsuario').css('overflow-x', 'hidden');


        $('body').addClass('modal-open');

    })

    $("#modalConfirmar").modal("show");

}


function MensajeConfirmarModalRequisiciones(mensaje) {

    var mensajeConfirmar = "" +
    "<div class='modal fade bs-example-modal-sm' id='modalConfirmarRequisiciones' tabindex='-1' role='dialog' aria-labelledby='mySmallModalLabel'> <div class='modal-dialog modal-sm ModalMensajes'  > " +
        "<div class='modal-content modalConfirmar'>      " +
            "<div class='modal-header TituloMensajeConfirmar'>     " +
                "<h2 class='modal-title modaltitle' id='myModalLabel'>" +
                    "Confirmar!" +
                "</h2>    " +
                "</div>    " +
                "<div class='modal-body modalbody mensajeConfirmar'>" +
                     mensaje +
                "</div>" +
                "<div class='modal-footer modalpie'>" +
                    "<button type='button' id='BtnConfirmarReq' class='btn-Confirmar' data-dismiss='modal'>" +
                        "Aceptar" +
                    "</button>" +
                    "<button type='button' class='btn-Cancelar' data-dismiss='modal'>" +
                       "Cerrar" +
                    "</button>" +
                "</div>" +
            "</div>" +
        "</div>" +
    "</div>";

    $('div.mensajesConfirmacion').html(mensajeConfirmar);
    $('#modalConfirmarRequisiciones').on('hide.bs.modal', function (e) {
        //debugger;

        $('#ModalProveedores,#ModalRequisicones,#ModalProductosServicios,#ModalEditarUsuario,#ModalPermisosTipoUsuario').css('overflow-y', 'auto');
        $('#ModalProveedores,#ModalRequisicones,#ModalProductosServicios,#ModalEditarUsuario,#ModalPermisosTipoUsuario').css('overflow-x', 'hidden');

        $('body').addClass('modal-open');

    })

    $("#modalConfirmarRequisiciones").modal("show");

}

function MensajeAdvertenciaSesion(mensaje) {

    var mensajeAdvertenciaSesion = "" +
     "<div class='modal fade bs-example-modal-sm' id='myModal' tabindex='-1' role='dialog' aria-labelledby='mySmallModalLabel'>" +
         "<div class='modal-dialog modal-sm ModalMensajes'  >" +
             "<div class='modal-content modalAdvertencia'>" +
                 "<div class='modal-header TituloMensajeAdvertencia'>" +
                     "<h2 class='modal-title modaltitle' id='myModalLabel'> Advertencia! </h2>" +
                 "</div>" +
                 "<div class='modal-body modalbody'>" +
                     "<div class='col-xs-3 col-sm-3 col-md-3 col-lg-3'>" +
                         "<img class='TamanoImagen' src='./Content/Project/Imagenes/Advertencia.png'/>" +
                     "</div>  " +
                     "<div class='col-xs-9 col-sm-9 col-md-9 col-lg-9'>" +
                              mensaje +
                              "</br>" + "</br>" + "</br>" +
                     "</div>  " +
                 "</div>" +
                 "<div class='modal-footer modalpie'>" +
                     "<button type='button' id='BtnAceptarSalir' class='btn-Advertencia btnAceptarSalir' data-dismiss='modal'>" +
                         "Aceptar" +
                     "</button>" +
                 "</div>" +
             "</div>" +
         "</div>" +
     "</div>";

    $('div.mensajes').html(mensajeAdvertenciaSesion);


    $('#myModal').on('shown.bs.modal', function () {
        $('#BtnAceptarSalir').focus();
    })

    $("#myModal").modal("show");

    $('#myModal').on('hide.bs.modal', function (e) {
        //debugger;
        $('#ModalProveedores,#ModalRequisicones,#ModalProductosServicios,#ModalEditarUsuario,#ModalPermisosTipoUsuario').css('overflow-y', 'auto');
        $('#ModalProveedores,#ModalRequisicones,#ModalProductosServicios,#ModalEditarUsuario,#ModalPermisosTipoUsuario').css('overflow-x', 'hidden');

        $('body').addClass('modal-open');

    })
}

const Bootbox = {
    Confirmacion: (titulo, mensaje, callback) => {
        bootbox.confirm({
            title: titulo,
            message: mensaje,
            buttons: {
                cancel: {
                    label: '<i class="fa fa-times"></i> Cancelar'
                },
                confirm: {
                    label: '<i class="fa fa-check"></i> Confirmar'
                }
            },
            callback: function (result) {
                if (result)
                    callback();
                else
                    return;
            }
        });
    }
}