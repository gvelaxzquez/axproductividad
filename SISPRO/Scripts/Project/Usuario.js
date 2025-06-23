

var dsUsuario = [];
var dsPermisos = [];
var archivofoto = "";
var control1 = $("#Foto");

var tablaUsuario;
var tablaPermisos;
var columnasUsuario = [
    {
        "data": "IdUsuario",
        "visible": false
    },

    {
        "class": "text-center",
        "data": "NumEmpleado",
        "render": function (data, type, row) {
            return '<img class="img-dt" title="' + row.NombreCompleto + '" src="http://app.yitpro.com/Archivos/Fotos/' + data + '.jpg"  alt="' + data + '" style="width:60px; height:60px;cursor:pointer;">'


        }
    },
    {
        "data": "NumEmpleado",
        "class": "text-center",

    },
    {
        "data": "NombreCompleto",
        "class": "text-left",
        "render": function (data, type, row) {
            return '<a style="cursor:pointer;" onclick="ConsultaPerfil(' + "'" +  row.NumEmpleado + "'"+ ')"> <h4 style="margin-top:5px;"> ' + data + '</h4></a>'


        }
    },
    {
        "data": "Correo",
        "class": "text-center"
    },

    {
        "data": "DescripcionTipoUsuario",
        "class": "text-left"
    },
    {
        "data": "DescripcionDepartamento",
        "class": "text-left"
    },
    {
        "data": "Activo",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data) ? "Si" : "No";
        }
    },

    {
        "class": "text-center",
        "render": function (data, type, row) {
            return '<button class="btn btn-default BtnEditarDatos"><span class="fa fa-pencil-square-o"></span></button>'


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
            return '<button class="btn btn-default BtnEditarContrasena " ><span class="fa fa-lock"></span></button>'
        }
    },
];
var columnasPermisos = [
    {
        "data": "IdPermisoU",
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

        dsUsuario = jQuery.parseJSON(data.LstUsuarios);
        tablaUsuario = inicializaTabla($('#TblUsuarios'), dsUsuario, columnasUsuario, 1, "asc", true, true, true);
        $('#TblUsuarios').removeClass('hide');


        $('#LblLicenciasA').text(data.Licencias);
        $('#LblLicenciasU').text(data.Activos);

        $('#SelTipoUsuario').empty();
        $('#SelTipoUsuario').append(data.CmbTiposUsuario);

        $('#SelGerenteArea').empty();
        $('#SelGerenteArea').append(data.CmbGerentes);

        $('#SelDepartamento').empty();
        $('#SelDepartamento').append(data.CmbDepartamentos);


        $('#SelAutorizacionesReq').empty();
        $('#SelAutorizacionesReq').append(data.CmbAutorizacionesRequisiciones);
        $('#SelAutorizacionesReq').selectpicker('refresh');

        $('#SelAutorizacionesAvances').empty();
        $('#SelAutorizacionesAvances').append(data.CmbAutorizacionesAvances);
        $('#SelAutorizacionesAvances').selectpicker('refresh');

        $('#SelNivel').empty();
        $('#SelNivel').append(data.CmbNivel);


    }
    else if (data.Advertencia) {

        MensajeAdvertencia(data.Mensaje);

    }
    else {

        MensajeError(data.Mensaje);
    }

}

function LimpiarCamposUsuario() {
    $('#IdUsuario').val(0);
    $('#TxtNumEmpleado').val("");
    $('#TxtNombre').val("");
    $('#TxtApellidoP').val("");
    $('#TxtApellidoM').val("");
    $('#TxtCorreo').val("");
    $('#SelTipoUsuario').val(-1);
    $('#SelGerenteArea').val(-1);
    $('#SelDepartamento').val(-1);
    $('#SelNivel').val(-1);
    $("#SelAutorizacionesReq").val('').change();
    $("#SelAutorizacionesAvances").val('').change();
    $('#TxtFechaIngreso,#TxtFechaCambioNivel').datetimepicker(
        {
            format: 'DD/MM/YYYY'
        });
    cambiaEstadoSwitch($('#ChkActivo'), true);
    cambiaEstadoSwitch($('#ChkBloqueo'), false);
    cambiaEstadoSwitch($('#ChkCaptura'), false);
    $('#TxtNumEmpleado').prop("disabled", false);

    $("#Foto").val("");

    control1.replaceWith(control1 = control1.clone(true));

}


$(document).on('click', '#BtnNuevo', function (e) {
    LimpiarCamposUsuario();
    $('#ModalEditarUsuario').modal('show');
})

$(document).on('click', '#BtnGuardarUsuario', function (e) {
    var Mensaje = ValidaCamposRequeridos(".ReqUsuario");
    if (!ValidarEmail($('#TxtCorreo').val().trim()))
        Mensaje = "Correo no válido.";

    if (Mensaje.length == 0) {
        debugger;
        //sacamos las aurotrizaciones
        var autorizados = [];
        var lstAurotizacion = $('#SelAutorizacionesReq').val();
        for (item in lstAurotizacion) {
            autorizados.push({ 'IdAutorizacion': lstAurotizacion[item] });
        }

        var lstAurotizacion = $('#SelAutorizacionesAvances').val();
        for (item in lstAurotizacion) {
            autorizados.push({ 'IdAutorizacion': lstAurotizacion[item] });
        }


        var datosUsuario = {
            IdUsuario: $('#IdUsuario').val(),
            NumEmpleado: $('#TxtNumEmpleado').val().trim(),
            Nombre: $('#TxtNombre').val().trim(),
            ApPaterno: $('#TxtApellidoP').val().trim(),
            ApMaterno: $('#TxtApellidoM').val().trim(),
            Correo: $('#TxtCorreo').val().trim(),
            FechaIngreso: $('#TxtFechaIngreso').val(),
            IdTipoUsuario: $('#SelTipoUsuario').val(),
            IdUGerente: $('#SelGerenteArea').val(),
            IdNivel: $('#SelNivel').val(),
            FechaCambioNivel: $('#TxtFechaCambioNivel').val(),
            DepartamentoId: $('#SelDepartamento').val(),
            Activo: $('#ChkActivo').prop('checked'),
            Bloqueado: $('#ChkBloqueo').prop('checked'),
            Captura: $('#ChkCaptura').prop('checked'),
            LstAurotizaciones: autorizados
        }
        LlamadaGuardarDatosUsuario(datosUsuario);
    }

    else {

        MensajeAdvertencia(Mensaje);
    }

})

function LlamadaGuardarDatosUsuario(datosUsuario) {

    var url = $('#urlGuardarDatosU').val();

    $.ajax({

        url: url,
        data: JSON.stringify(datosUsuario),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessLlamadaGuardarDatosUsuario,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
}
function SuccessLlamadaGuardarDatosUsuario(data) {
    if (data.Exito) {

        CargaArchivos(data);
        /*
        LimpiarCamposUsuario();

        MensajeExito(data.Mensaje);
        $('#ModalEditarUsuario').modal('toggle');
        FinalizaLoading();

        CargaInicial();
        */

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
    var row = tablaUsuario.api().row(filaPadre);
    var datosFila = row.data();

    LlamadaConsultarDatosUsuario(datosFila.IdUsuario);

})

function LlamadaConsultarDatosUsuario(idUsuario) {

    var url = $('#urlConsultarDatosU').val();

    $.ajax({

        url: url,
        data: JSON.stringify({ idUsuario: idUsuario }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessLlamadaConsultarDatosUsuario,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
}
function SuccessLlamadaConsultarDatosUsuario(data) {
    if (data.Exito) {
        LimpiarCamposUsuario();
        var datosUsuario = jQuery.parseJSON(data.DatosUsuario);

        var autReq = $.grep(datosUsuario.LstAurotizaciones, function (a, b) {
            return a.Tipo == 1
        });

        var autAvance = $.grep(datosUsuario.LstAurotizaciones, function (a, b) {
            return a.Tipo == 2
        });
        $('#IdUsuario').val(datosUsuario.IdUsuario);
        $('#TxtNumEmpleado').val(datosUsuario.NumEmpleado);
        $('#TxtNombre').val(datosUsuario.Nombre);
        $('#TxtApellidoP').val(datosUsuario.ApPaterno);
        $('#TxtApellidoM').val(datosUsuario.ApMaterno);
        $('#TxtCorreo').val(datosUsuario.Correo);
        $('#SelTipoUsuario').val(datosUsuario.IdTipoUsuario);
        $('#SelGerenteArea').val(datosUsuario.IdUGerente);
        $('#SelDepartamento').val(datosUsuario.DepartamentoId);
        $('#SelNivel').val(datosUsuario.IdNivel);

        $('#TxtNumEmpleado').prop("disabled", true);

        if (datosUsuario.FechaIngreso != "") {
            $('#TxtFechaIngreso').val(moment(datosUsuario.FechaIngreso).format("DD/MM/YYYY"));
        }

        if (datosUsuario.FechaCambioNivel != "") {
            $('#TxtFechaCambioNivel').val(moment(datosUsuario.FechaCambioNivel).format("DD/MM/YYYY"));
        }

        $('#FotoUsuario').attr('src', datosUsuario.FotoUrl);

        cambiaEstadoSwitch($('#ChkActivo'), datosUsuario.Activo);
        cambiaEstadoSwitch($('#ChkBloqueo'), datosUsuario.Bloqueado);
        cambiaEstadoSwitch($('#ChkCaptura'), datosUsuario.Captura);

        var autorizacionReq = [];
        for (item in autReq) {
            autorizacionReq.push(autReq[item].IdAutorizacion);
        }
        $("#SelAutorizacionesReq").val(autorizacionReq);
        $('#SelAutorizacionesReq').selectpicker('refresh')

        var autorizacionAvance = [];
        for (item in autAvance) {
            autorizacionAvance.push(autAvance[item].IdAutorizacion);
        }
        $("#SelAutorizacionesAvances").val(autorizacionAvance);
        $('#SelAutorizacionesAvances').selectpicker('refresh');

        $('#ModalEditarUsuario').modal('show');

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
    var row = tablaUsuario.api().row(filaPadre);
    var datosFila = row.data();
    LlamadaConsultarPermisosPantalla(datosFila.IdUsuario);

})

function LlamadaConsultarPermisosPantalla(idUsuario) {


    var url = $('#urlConsultarPermisoU').val();

    $.ajax({

        url: url,
        data: JSON.stringify({ idUsuario: idUsuario }),
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

    var url = $('#urlGuardarPermisosU').val();

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

$(document).on('click', '.BtnEditarContrasena', function (e) {
    LimpiarCamposContrasena();
    var filaPadre = $(this).closest('tr');
    var row = tablaUsuario.api().row(filaPadre);
    var datosFila = row.data();
    $('#IdUsuario').val(datosFila.IdUsuario);
    $('.tituloModalContrasena').text("Contraseña de " + datosFila.NombreCompleto);

    $('#ModalCambiarContrasena').modal('show');

});

function LimpiarCamposContrasena() {
    $('#TxtContasena').val("");
    $('#TxtRepiteContasena').val("");
}


$(document).on('click', '#BtnGuardarContrasena', function (e) {
    var Mensaje = ValidaCamposRequeridos(".reqContrasna");

    if (Mensaje.length == 0) {
        if ($('#TxtContasena').val().trim() == $('#TxtRepiteContasena').val().trim()) {

            var datosUsuario = {
                IdUsuario: $('#IdUsuario').val(),
                Contrasena: $('#TxtContasena').val().trim(),
                ContrasenaNueva: $('#TxtRepiteContasena').val().trim()
            }
            LlamadaGuardarDatosContrasena(datosUsuario);

        }
        else {
            MensajeAdvertencia("Las contraseñas no coinciden.");

        }

    }

    else {

        MensajeAdvertencia(Mensaje);
    }

})

function LlamadaGuardarDatosContrasena(datosUsuario) {

    var url = $('#urlGuardarDatosContrasenaU').val();

    $.ajax({

        url: url,
        data: JSON.stringify(datosUsuario),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessLlamadaGuardarDatosContrasena,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
}
function SuccessLlamadaGuardarDatosContrasena(data) {
    if (data.Exito) {
        LimpiarCamposContrasena();

        MensajeExito(data.Mensaje);
        $('#ModalCambiarContrasena').modal('toggle');
        FinalizaLoading();
    }
    else if (data.Advertencia) {

        MensajeAdvertencia(data.Mensaje);

    }
    else {

        MensajeError(data.Mensaje);
    }
}

function CargaArchivos(Datos) {

    debugger;
    var url = $('#urlGuardarFoto').val();

    var form_data = new FormData();

    form_data.append("Foto", $("#Foto").prop("files")[0]);
    form_data.append("NomFoto", Datos.NomFoto);


    $.ajax({
        url: url,
        type: "POST",
        contentType: false,
        data: form_data,
        processData: false,
        async: false,
        success: function (Respuesta) {
            if (Respuesta == "1") {


                LimpiarCamposUsuario();

                MensajeExito("Los datos se guardaron correctamente.");
                $('#ModalEditarUsuario').modal('toggle');
                $('div.pg-loading-screen').remove();

                CargaInicial();

            }
            else {
                MensajeError(Respuesta);

            }

        },
        error: function (xhr, textStatus, errorThrown) {
            var err = eval("(" + xhr.responseText + ")");
            MensajeError(err.Message);
        }
    });

    return false;


}

function readURL(input) {



    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            archivofoto = e.target.result;
            $('#FotoUsuario').attr('src', e.target.result);
            var url = e.target.result;
        }

        reader.readAsDataURL(input.files[0]);
    }
    else {
        archivofoto = "";
    }
}

$(document).on('click', '.BtnEditarCostos', async e => {
    e.preventDefault();
    const id = ObtenerData(tablaUsuario, e).IdUsuario;
    $('#IdUsuario').val(id);

    const data = await POST("Usuarios/LeerCostos", { idUsuario: id });
    if (data.Exito) {
        const usuario = data.Usuario;
        $('#TxtCostoMensual').val(usuario.CostoMensual);
        $('#TxtCostoHora').val(usuario.CostoHora);

        $('#ModalUsuarioCostos').modal('show');
    } else {
        MensajeAdvertencia(data.Mensaje);
    }
});

$('#BtnGuardarCostos').click(async e => {
    e.preventDefault();

    const mensaje = ValidaCamposRequeridos('.ReqUsuarioCosto');
    if (mensaje.length === 0) {
        const costos = {
            IdUsuario: $('#IdUsuario').val(),
            CostoMensual: $('#TxtCostoMensual').val(),
            CostoHora: $('#TxtCostoHora').val(),
        }

        const data = await POST('/Usuarios/GuardarCostos', { costos });
        if (data.Exito) {
            MensajeExito(data.Mensaje);
            $('#ModalUsuarioCostos').modal('hide');
        } else {
            MensajeAdvertencia(data.Mensaje);
        }
    } else {
        MensajeAdvertencia(mensaje);
    }
});