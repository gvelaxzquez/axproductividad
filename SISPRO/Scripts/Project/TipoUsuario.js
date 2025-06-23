var dsTiposUsuario = [];
var dsPermisos = [];

var tablaTipoUsuario;
var tablaPermisos;
var columnasTipoUsuario = [
            { 
                "data": "IdTipoUsuario",
                "visible": false
            },
            {
                "data": "Nombre",
                "class": "text-center"
            },
            {
                "data": "Activo",
                "class": "text-center",
                "render": function (data, type, row) {
                    return (data) ? "Si" : "No";
                }
            },
          {
              "data": "Protegido",
              "class": "text-center",
              "render": function (data, type, row) {
                  return (data) ? "Si" : "No";
              }
          },
             {
                 "class": "text-center",
                 "render": function (data, type, row) {
                     return '<button class="btn btn-default BtnEditarPermisos " ><span class="fa fa-key"></span></button>'
                 }
             },
              {
                  "class": "text-center",
                  "render": function (data, type, row) {
                      return '<button class="btn btn-default BtnEditarDatos"><span class="fa fa-pencil-square-o"></span></button>'


                  }
              }
];
var columnasPermisos = [
         {
             "data": "IdPermisoTU",
             "visible": false,
             "class": "IdPermisoTU"
         },
        {
            "data": "IdMenu",
            "visible": false,
            "class": "IdMenu"
        },
         {
             "class": "text-left NombrePantalla",
             "render": function (data, type, row) {
                 if (row.Padre) {
                     return '<strong class="LblPadre" ><b>' + row.NombreMenu + '</b></strong>';

                 }
                 else {
                     return '&nbsp;&nbsp;&nbsp;&nbsp;<label>' + row.NombreMenu + '</label>';
                 }
             }
         },
          {
              "data": "Ver",
              "class": "text-center",
              "render": function (data, type, row) {
                  var checked = (data) ? "checked" : " "
                  return '<label class="switch switch-small"><input type="checkbox" tipoPermiso="Ver" class="chkPermiso ChkVer" ' + checked + '/><span></span></label>';

              }
          },
            {
                "data": "Guardar",
                "class": "text-center",
                "render": function (data, type, row) {
                    var checked = (data) ? "checked" : " "
                    return '<label class="switch switch-small"><input type="checkbox" tipoPermiso="Guardar" class="chkPermiso ChkGuardar" ' + checked + '/><span></span></label>';
                }
            },
            {
                "data": "Modificar",
                "class": "text-center",
                "render": function (data, type, row) {
                    var checked = (data) ? "checked" : " "
                    return '<label class="switch switch-small"><input type="checkbox" tipoPermiso="Modificar" class="chkPermiso ChkModificar" ' + checked + '/><span></span></label>';
                }
            },
               {
                   "data": "Imprimir",
                   "class": "text-center",
                   "render": function (data, type, row) {
                       var checked = (data) ? "checked" : " "
                       return '<label class="switch switch-small"><input type="checkbox" tipoPermiso="Imprimir" class="chkPermiso ChkImprimir" ' + checked + '/><span></span></label>';
                   }
               },
            {
                "data": "Eliminar",
                "class": "text-center",
                "render": function (data, type, row) {
                    var checked = (data) ? "checked" : " "
                    return '<label class="switch switch-small"><input type="checkbox" tipoPermiso="Eliminar" class="chkPermiso ChkEliminar" ' + checked + '/><span></span></label>';
                }
            }
];
$(document).ready(function () {

    CargaInicial();
});

function CargaInicial() {

    var url = $('#urlCargaInicial').val();

    $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: successCargaInicial,
        error: function (xmlHttpRequest, textStatus, errorThrown) {
         
            MensajeError(data.Mensaje);
        }
    });
    return false;
}
function successCargaInicial(data) {
    if (data.Exito) {
        dsTiposUsuario = jQuery.parseJSON(data.LstTiposUsuario);
        tablaTipoUsuario = inicializaTabla($('#TblTipoUsuario'), dsTiposUsuario, columnasTipoUsuario, 1, "asc", true, true, true);
        $('#TblTipoUsuario').removeClass('hide');
    
    }
    else if (data.Advertencia) {
    
        MensajeAdvertencia(data.Mensaje);

    }
    else {
  
        MensajeError(data.Mensaje);
    }

}
$(document).on('click', '.BtnEditarDatos', function (e) {
    debugger;
    var filaPadre = $(this).closest('tr');
    var row = tablaTipoUsuario.api().row(filaPadre);
    var datosFila = row.data();

    LlamadaConsultarDatosTipoUsuario(datosFila.IdTipoUsuario);

})

function LlamadaConsultarDatosTipoUsuario(idTipoUsuario) {
  
    var url = $('#urlConsultarDatosTU').val();

    $.ajax({

        url: url,
        data: JSON.stringify({ idTipoUsuario: idTipoUsuario }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessLlamadaConsultarDatosTipoUsuario,
        error: function (xmlHttpRequest, textStatus, errorThrown) {
     
            MensajeError(data.Mensaje);
        }
    });
}
function SuccessLlamadaConsultarDatosTipoUsuario(data) {
    if (data.Exito) {
        LimpiarFormulario();
        var datosTipoUsuario = jQuery.parseJSON(data.DatosTipoUsuario);

        $('#IdTipoUsuario').val(datosTipoUsuario.IdTipoUsuario);
        $('#TxtNombre').val(datosTipoUsuario.Nombre);
        cambiaEstadoSwitch($('#ChkActivo'), datosTipoUsuario.Activo);
        cambiaEstadoSwitch($('#ChkBloqueado'), datosTipoUsuario.Protegido);

        $('#ModalEditarTipoUsuario').modal('show');
   
    }
    else if (data.Advertencia) {
      
        MensajeAdvertencia(data.Mensaje);

    }
    else {
        
        MensajeError(data.Mensaje);
    }
}

function LimpiarFormulario() {
    $('#IdTipoUsuario').val("0");

    $('#TxtNombre').val("");
    cambiaEstadoSwitch($('#ChkActivo'), true);
    cambiaEstadoSwitch($('#ChkBloqueado'), false);
}
$(document).on('click', '#BtnNuevo', function (e) {
    LimpiarFormulario();
    $('#ModalEditarTipoUsuario').modal('show');
})

$(document).on('click', '#BtnGuardar', function (e) {

    
    var Mensaje = ValidaCamposRequeridos(".ReqTipoUsuario");


    if (Mensaje.length == 0) {

  
        var datosTipoUsuario = {
            IdTipoUsuario: $('#IdTipoUsuario').val().trim(),
            Nombre: $('#TxtNombre').val(),
            Protegido: $('#ChkBloqueado').prop('checked'),
            Activo: $('#ChkActivo').prop('checked')
        }
        LlamadaGuardarDatosTipoUsuario(datosTipoUsuario);
    }

    else {
  
        MensajeAdvertencia(Mensaje);
    }

})

function LlamadaGuardarDatosTipoUsuario(datosTipoUsuario) {

    var url = $('#urlGuardarDatosTU').val();

    $.ajax({

        url: url,
        data: JSON.stringify(datosTipoUsuario),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessLlamadaGuardarDatosTipoUsuario,
        error: function (xmlHttpRequest, textStatus, errorThrown) {
        
            MensajeError(data.Mensaje);
        }
    });
}
function SuccessLlamadaGuardarDatosTipoUsuario(data) {
    if (data.Exito) {
        LimpiarFormulario();

        MensajeExito(data.Mensaje);
        $('#ModalEditarTipoUsuario').modal('toggle');
      
        FinalizaLoading();

        CargaInicial();
    }
    else if (data.Advertencia) {
        
        MensajeAdvertencia(data.Mensaje);

    }
    else {
    
        MensajeError(data.Mensaje);
    }
}

$(document).on('click', '.BtnEditarPermisos', function (e) {
    debugger;
    var filaPadre = $(this).closest('tr');
    var row = tablaTipoUsuario.api().row(filaPadre);
    var datosFila = row.data();
    LlamadaConsultarPermisosPantalla(datosFila.IdTipoUsuario);

})

function LlamadaConsultarPermisosPantalla(idTipoUsuario) {


    var url = $('#urlConsultarPermisoTU').val();

    $.ajax({

        url: url,
        data: JSON.stringify({ idTipoUsuario: idTipoUsuario }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessLlamadaLlamadaConsultarPermisosPantalla,
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            Loading.hidePleaseWait();
            MensajeError(data.Mensaje);
        }
    });
}
function SuccessLlamadaLlamadaConsultarPermisosPantalla(data) {
    if (data.Exito) {

        cambiaEstadoSwitch($('#ChkDAcceder'), true);
        cambiaEstadoSwitch($('#ChkDGuardar'), true);
        cambiaEstadoSwitch($('#ChkDEditar'), true);
        cambiaEstadoSwitch($('#ChkDImprimir'), true);
        cambiaEstadoSwitch($('#ChkDEliminar'), true);


        dsPermisos = jQuery.parseJSON(data.LstPermisos);

        $('#TblPermisos').remove('td');
        //  tablaPermisos = inicializaTabla($("#tblPermisos"), dsPermisos, columnasGridPermisos, 4, 'asc', false, true, false);

        tablaPermisos = inicializaTabla($('#TblPermisos'), dsPermisos, columnasPermisos, 4, 'asc', false, true, false);

        $('#ModalPermisosTipoUsuario').modal('show');
        
    }
    else if (data.Advertencia) {
       
        MensajeAdvertencia(data.Mensaje);

    }
    else {
        
        MensajeError(data.Mensaje);
    }
}

$(document).on('click', '.chkPermiso', function () {
    debugger;
    var fila = $(this).closest('tr');

    var tipoPermiso = $(this).attr('tipoPermiso');

    var objPermiso = tablaPermisos.api().row(fila).data();

    indexes = $.map(dsPermisos, function (obj, index) {
        if (obj.IdMenu == objPermiso.IdMenu) {
            return index;
        }
    })

    switch (tipoPermiso) {
        case 'Ver':
            dsPermisos[indexes[0]].Ver = $(this).prop('checked');
            break;
        case 'Guardar':
            dsPermisos[indexes[0]].Guardar = $(this).prop('checked');
            break;
        case 'Modificar':
            dsPermisos[indexes[0]].Modificar = $(this).prop('checked');
            break;
        case 'Eliminar':
            dsPermisos[indexes[0]].Eliminar = $(this).prop('checked');
            break;
        case 'Imprimir':
            dsPermisos[indexes[0]].Imprimir = $(this).prop('checked');
            break;
        default:
    }

});

$(document).on('click', '#BtnGuardarPermisos', function (e) {


    var url = $('#urlGuardarPermisosTU').val();

    $.ajax({

        url: url,
        data: JSON.stringify({ lstPermisos: dsPermisos }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessLlamadaGuardarPermisos,
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            Loading.hidePleaseWait();
            MensajeError(data.Mensaje);
        }
    });

})

function SuccessLlamadaGuardarPermisos(data) {
    if (data.Exito) {


        MensajeExito(data.Mensaje);
        $('#ModalPermisosTipoUsuario').modal('toggle');

    }
    else if (data.Advertencia) {
   
        MensajeAdvertencia(data.Mensaje);

    }
    else {
 
        MensajeError(data.Mensaje);
    }
}

$(document).on('click', '#ChkDAcceder', function () {
    $('input.ChkVer').each(function () {
        cambiaEstadoSwitch($(this), $('#ChkDAcceder').prop('checked'));
    });
})
$(document).on('click', '#ChkDGuardar', function () {
    $('input.ChkGuardar').each(function () {
        cambiaEstadoSwitch($(this), $('#ChkDGuardar').prop('checked'));
    });
 })
$(document).on('click', '#ChkDEditar', function () {
    $('input.ChkModificar').each(function () {
        cambiaEstadoSwitch($(this), $('#ChkDEditar').prop('checked'));
    });
 })
$(document).on('click', '#ChkDImprimir', function () {
    $('input.ChkImprimir').each(function () {
        cambiaEstadoSwitch($(this), $('#ChkDImprimir').prop('checked'));
    });
 })
$(document).on('click', '#ChkDEliminar', function () {
    $('input.ChkEliminar').each(function () {
        cambiaEstadoSwitch($(this), $('#ChkDEliminar').prop('checked'));
    });
 })
