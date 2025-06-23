


function MensajeError(mensaje) {

    var mensajeError = "" +
    "<div class='modal fade bs-example-modal-sm' id='myModal' tabindex='-1' role='dialog' aria-labelledby='mySmallModalLabel'> <div class='modal-dialog modal-sm ModalMensajes'  > " +
        "<div class='modal-content modalError'>      " +
            "<div class='modal-header TituloMensajeError'>     " +
                "<h2 class='modal-title modaltitle' id='myModalLabel'>" +
                   "Error!" +
                "</h2>    " +
                "</div>    " +
                "<div class='modal-body modalbody'>" +
                       "<div class='col-xs-3 col-sm-3 col-md-3 col-lg-3'>" +
                     " <i class='fa fa fa-question-circle' style='font-size:60px !important;color:#FF0000;'></i>" +
                     "</div>  " +
                    "<div class='col-xs-9 col-sm-9 col-md-9 col-lg-9'>" +
                        mensaje +
                        "</br>" + "</br>" + "</br>" +
                     "</div>  " +
                "</div>" +
                "<div class='modal-footer modalpie'>" +
                    "<button type='button' id='BtnAceptar' class='btn-Error' data-dismiss='modal'>" +
                       "Aceptar" +
                    "</button>" +
                "</div>" +
            "</div>" +
        "</div>" +
    "</div>";

    $('div.mensajes').html(mensajeError);



    $("#myModal").modal("show");

    $('#myModal').on('hide.bs.modal', function (e) {
        //debugger;

        $('#ModalProveedores,#ModalRequisicones,#ModalProductosServicios,#ModalEditarUsuario,#ModalPermisosTipoUsuario').css('overflow-y', 'auto');
        $('#ModalProveedores,#ModalRequisicones,#ModalProductosServicios,#ModalEditarUsuario,#ModalPermisosTipoUsuario').css('overflow-x', 'hidden');
        
        $('body').addClass('modal-open');

    })

}

function MensajeExito(mensaje) {


/   toastr.success(mensaje,'Éxito!');*/

    var mensajeExito = "" +
    "<div class='modal fade bs-example-modal-sm' id='myModal' tabindex='-1' role='dialog' aria-labelledby='mySmallModalLabel'>" +
        "<div class='modal-dialog modal-sm ModalMensajes' >" +
            "<div class='modal-content modalExito'>" +
                "<div class='modal-header TituloMensajeExito'>" +
                    "<h2 class='modal-title modaltitle' id='myModalLabel'>" +
                        "Exito!" +
                    "</h2>" +
                "</div>" +
                "<div class='modal-body modalbody'>" +
                       "<div class='col-xs-3 col-sm-3 col-md-3 col-lg-3'>" +
                    
                      " <i class='fa fa-check-circle-o' style='font-size:60px;color:#00B050;'></i>" +
                    "</div>  " +
                     "<div class='col-xs-9 col-sm-9 col-md-9 col-lg-9'>" +
                              mensaje +
                              "</br>" + "</br>" + "</br>" +
                     "</div>  " +
                "</div>" +
                "<div class='modal-footer modalpie'>" +
                    "<button type='button' id='BtnAceptar' class='btn-Exito' data-dismiss='modal'>" +
                        "Aceptar" +
                    "</button>" +
                "</div>" +
            "</div>" +
        "</div>" +
    "</div>";

    $('div.mensajes').html(mensajeExito);


    $("#myModal").modal("show");

      $('#myModal').on('hide.bs.modal', function (e) {
        //debugger;

        $('#ModalProveedores,#ModalRequisicones,#ModalProductosServicios,#ModalEditarUsuario,#ModalPermisosTipoUsuario').css('overflow-y', 'auto');
        $('#ModalProveedores,#ModalRequisicones,#ModalProductosServicios,#ModalEditarUsuario,#ModalPermisosTipoUsuario').css('overflow-x', 'hidden');
        
        $('body').addClass('modal-open');

    });
}
 
function MensajeAdvertencia(mensaje) {

 /*toastr.warning(mensaje,'Advertencia!');*/



    var mensajeAdvertencia = "" +
     "<div class='modal fade bs-example-modal-sm' id='myModal' tabindex='-1' role='dialog' aria-labelledby='mySmallModalLabel'>" +
         "<div class='modal-dialog modal-sm ModalMensajes'  >" +
             "<div class='modal-content modalAdvertencia'>" +
                 "<div class='modal-header TituloMensajeAdvertencia'>" +
                     "<h2 class='modal-title modaltitle' id='myModalLabel'> Advertencia! </h2>" +
                 "</div>" +
                 "<div class='modal-body modalbody'>" +
                        "<div class='col-xs-3 col-sm-3 col-md-3 col-lg-3'>" +
                     " <i class='fa fa-exclamation-circle' style='font-size:60px !important;color:#FFA500;'></i>" +
                     "</div>  " +
                     "<div class='col-xs-9 col-sm-9 col-md-9 col-lg-9'>" +
                              mensaje +
                              "</br>" + "</br>" + "</br>" +
                     "</div>  " +
                 "</div>" +
                 "<div class='modal-footer modalpie'>" +
                     "<button type='button' id='BtnAceptar' class='btn-Advertencia btnAceptarAdvertenciamo' data-dismiss='modal'>" +
                         "Aceptar" +
                     "</button>" +
                 "</div>" +
             "</div>" +
         "</div>" +
     "</div>";

    $('div.mensajes').html(mensajeAdvertencia);


    $('#myModal').on('shown.bs.modal', function () {
        $('#BtnAceptar').focus();
    })

    $("#myModal").modal("show");

    $('#myModal').on('hide.bs.modal', function (e) {
        //debugger;
        $('#ModalProveedores,#ModalRequisicones,#ModalProductosServicios,#ModalEditarUsuario,#ModalPermisosTipoUsuario').css('overflow-y', 'auto');
        $('#ModalProveedores,#ModalRequisicones,#ModalProductosServicios,#ModalEditarUsuario,#ModalPermisosTipoUsuario').css('overflow-x', 'hidden');

        $('body').addClass('modal-open');

    });

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
                     //"<div class='imagenMsj col-md-3'>" +
                     //    "<img class='TamanoImagen' src='./Content/Project/Imagenes/Advertencia.png'' />" +
                     //"</div>" +
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


