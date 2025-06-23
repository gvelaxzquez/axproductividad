
var $table = $('#tblBacklog');
var $tableDocs = $('#TblDocumentos');
var recarga = false;
var recargaDocs = false;
var ganttBL;
var ganttSprint;
var rangedateFormat = {
    "locale": {
        "format": "DD/MM/YYYY",
        "separator": " - ",
        "applyLabel": "Aplicar",
        "cancelLabel": "Cancelar",
        "fromLabel": "De",
        "toLabel": "A",
        "daysOfWeek": [
            "Do",
            "Lu",
            "Ma",
            "Mi",
            "Ju",
            "Vi",
            "Sa"
        ],
        "monthNames": [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Augosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre"
        ]
    }
};

var lacalesDTRP = {
    format: 'DD/MM/YYYY',
    applyLabel: 'Aplicar',
    cancelLabel: 'Cancelar',
    fromLabel: 'De:',
    toLabel: 'A:',
    customRangeLabel: 'Personalizar rango',
    daysOfWeek: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
};

$(document).ready(function () {

    $('#TxtFechaIniProy,#TxtFechaFinProy,#TxtFechaCompProy').datetimepicker(
        {
            format: 'DD/MM/YYYY'
        });




    CargaInicial();
    CargarIndicadores();
    ConsultaGraficasBacklog();
/*    InicializaActividades();*/

    page_content_onresize();
    $('#accTwoColSeven').addClass('panel-body-open');
    $('#accTwoColSeven').css('display', 'block');
    $('#accTwoColSeven2').addClass('panel-body-open');
    $('#accTwoColSeven2').css('display', 'block');


    $('.DateRangePicker').daterangepicker({
        locale: lacalesDTRP,
        ranges: {
            'Hoy': [moment(), moment()],
            'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Últimos 7 días ': [moment().subtract(6, 'days'), moment()],
            'Últimos 30 días': [moment().subtract(29, 'days'), moment()],
            'Este mes': [moment().startOf('month'), moment().endOf('month')],
            'Mes anterior': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            "Este año": [moment().startOf('year'), moment().endOf('year')],
            "Último año": [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],
        },
        startDate: moment().startOf('month'),
        endDate: moment().endOf('month')
    });

    $('#TxtRangoFechasP').val(moment().startOf('month').format('DD/MM/YYYY') + ' - ' + moment().endOf('month').format('DD/MM/YYYY'));


    LeerRepositorios();

    $('#smartwizard').smartWizard({
        selected: 0, // Initial selected step, 0 = first step
        theme: 'dots', // theme for the wizard, related css need to include for other than default theme
        justified: true, // Nav menu justification. true/false
        lang: { // Language variables for button
            next: 'Siguiente',
            previous: 'Anterior'
        },
        keyboardSettings: {
            keyNavigation: false, // Enable/Disable keyboard navigation(left and right keys are used if enabled)
        },
        toolbarSettings: {
            toolbarExtraButtons: [
                $('<button></button>').text('Guardar')
                    .addClass('btn btn-success')
                    .attr('id', 'btnFinalizarCD')
                    .on('click', function () {
                        FinalizarCostoDirecto();
                    }),
            ]
        },
    });


    $(".filter-settings-icon").on("click", function () {
        $(".filter-settingspanel").toggleClass("active");
    });
});

function CargaInicial() {

    var url = $('#urlCargaInicial').val();
    var Clave = $('#hdClave').val();

    $.ajax({

        url: url,
        type: "POST",
        //data: {Clave:Clave},
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: successCargaInicial,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(textStatus);
        }
    });
    return false;
}


function successCargaInicial(data) {
    if (data.Exito) {

        $('#SelClientePr').empty();
        $('#SelClientePr').append(data.LstClientes);

        $('#SelTipoProyectoP').empty();
        $('#SelTipoProyectoP').append(data.LstTipoProyecto);

        $('#SelLiderP').empty();
        $('#SelLiderP').append(data.LstLideres);

        $('#SelMetodologiaP').empty();
        $('#SelMetodologiaP').append(data.LstMetodologia);

        $('#SelEstatusP').empty();
        $('#SelEstatusP').append(data.LstEstatus);

        $('#SelSprintP').empty();
        $('#SelSprintP').append(data.LstSprints);
        $('#SelSprintP').selectpicker('refresh');

        $('#SelRecursoP').empty();
        $('#SelRecursoP').append(data.LstUsuarios);
        $('#SelRecursoP').selectpicker('refresh');

        Proyecto = jQuery.parseJSON(data.Proyecto);

        $('#IdProyecto').val(Proyecto.IdProyecto);
        $('#TxtClaveP').val(Proyecto.Clave);
        $('#TxtNombreP').val(Proyecto.Nombre);
        $('#TxtDescripcionP').val(Proyecto.Descripcion);
        $('#SelClientePr').val(Proyecto.IdCliente);
        $('#SelTipoProyectoP').val(Proyecto.TipoProyectoId);


        if (Proyecto.TipoProyectoId == 191) {

            $("#divFinancieros").hide();
            $("#divFinancieros").removeClass("show");

        }

           


        $('#SelLiderP').val(Proyecto.IdULider);
        $('#TxtHorasIniP').val(Proyecto.HorasEstimadasInicial);
        $('#TxtFechaInicioP').val(moment(Proyecto.FechaInicioPlan).format("DD/MM/YYYY"));
        $('#TxtFechaFinP').val(moment(Proyecto.FechaFinPlan).format("DD/MM/YYYY"));
        $('#TxtIngresoP').val(Proyecto.IngresoPlan);
        $('#TxtCostoP').val($.number(Proyecto.CostoPlan, '2', '.', ','));
        $('#lblCostoAplicado').text("$" + $.number(Proyecto.CostoAplicado, '2', '.', ','));
        //$('#TxtAvanceP').val(Proyecto.Avance);
        //$('#TxtAvancePReal').val(Proyecto.AvanceReal);
        $("#lblNombreP").text(Proyecto.Clave + " - " + Proyecto.Nombre);
        $('#SelMetodologiaP').val(Proyecto.MetodologiaId);
        $('#SelEstatusP').val(Proyecto.EstatusId);

        $("#spEstatusCP").removeClass("text-info text-progress text-warning text-success text-danger text-muted");

        if (Proyecto.Estatus == "P") {
            $("#spEstatusCP").addClass("text-info");
            $("#BtnEstatusP").text("Planeación");
        }
        else if (Proyecto.Estatus == "E") {
            $("#spEstatusCP").addClass("text-progress");
            $("#BtnEstatusP").text("Ejecución");
        }
        else if (Proyecto.Estatus == "L") {
            $("#spEstatusCP").addClass("text-success");
            $("#BtnEstatusP").text("Liberado");
        }
        else if (Proyecto.Estatus == "C") {
            $("#spEstatusCP").addClass("text-warning");
            $("#BtnEstatusP").text("Cierre");
        }
        else if (Proyecto.Estatus == "X") {
            $("#spEstatusCP").addClass("text-muted");
            $("#BtnEstatusP").text("Cancelado");
        }
        else if (Proyecto.Estatus == "D") {
            $("#spEstatusCP").addClass("text-danger");
            $("#BtnEstatusP").text("Detenido");
        }

        cambiaEstadoSwitch($('#ChkActivo'), Proyecto.Activo);

        //tablaProyectos = inicializaTabla($('#TblProyectos'), dsProyectos, columnasProyectos, 1, "asc", true, true, true);
        $('div.pg-loading-screen').remove();
    }
    else {

        MensajeError(data.Mensaje);
    }

}

$(document).on('click', '#BtnGuardarDG', function (e) {


    var Mensaje = ValidaCamposRequeridos(".ReqProyectoDG");


    if (Mensaje.length == 0) {


        var Proyecto = {
            IdProyecto: $('#IdProyecto').val(),
            Clave: $('#TxtClaveP').val().trim(),
            Nombre: $('#TxtNombreP').val().trim(),
            TipoProyectoId: $('#SelTipoProyectoP').val(),
            IdCliente: $('#SelClientePr').val(),
            IdULider: $('#SelLiderP').val(),
            Descripcion: $('#TxtDescripcionP').val(),
            Activo: $('#ChkActivo').prop('checked'),

            //  HorasEstimadasInicial: $('#TxtHorasIniP').val(),
            // FechaInicioPlan: $('#TxtFechaInicioP').val(),
            // FechaFinPlan: $('#TxtFechaFinP').val(),
            // IngresoPlan: $('#TxtIngresoP').val(),
            //CostoPlan: $('#TxtCostoP').val(),
            MetodologiaId: $('#SelMetodologiaP').val(),
            EstatusId: $('#SelEstatusP').val()

        }
        LlamadaGuardarDatosProyectoDG(Proyecto);
    }

    else {

        MensajeAdvertencia(Mensaje);
    }

    return false;

});

function LlamadaGuardarDatosProyectoDG(Proyecto) {

    var url = $('#urlGuardarProyectoDG').val();

    $.ajax({

        url: url,
        data: JSON.stringify(Proyecto),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessLlamadaGuardarDatosProyectoDG,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
}

function SuccessLlamadaGuardarDatosProyectoDG(data) {
    if (data.Exito) {

        MensajeExito(data.Mensaje);

    }
    else if (data.Advertencia) {

        MensajeAdvertencia(data.Mensaje);

    }
    else {

        MensajeError(data.Mensaje);
    }
};

$('#btnGuardarCostoPlaneado').click(async e => {
    e.preventDefault();

    const costo = $('#TxtCostoP').val().replace(/,/g, '');
    const data = await POST('/Proyectos/GuardarCostoPlaneado', {
        idProyecto: $('#IdProyecto').val(), costo: costo
    }, false);

    if (data.Exito) {
        CargarCostos();
        MensajeExito(data.Mensaje);
    } else {
        MensajeAdvertencia(data.Mensaje);
    }

    return false;
});

function ActualizaEstatusProyecto(Estatus) {

    var url = $('#urlActualizaEstatusProyecto').val();
    $.ajax({
        url: url,
        data: JSON.stringify({ IdProyecto: $('#IdProyecto').val(), Estatus: Estatus }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            if (data.Exito) {
                $("#spEstatusCP").removeClass("text-info text-progress text-warning text-success text-danger text-muted");
                if (Estatus == "P") {
                    $("#spEstatusCP").addClass("text-info");
                    $("#BtnEstatusP").text("Planeación");
                }
                else if (Estatus == "E") {
                    $("#spEstatusCP").addClass("text-progress");
                    $("#BtnEstatusP").text("Ejecución");
                }
                else if (Estatus == "L") {
                    $("#spEstatusCP").addClass("text-success");
                    $("#BtnEstatusP").text("Liberado");
                }
                else if (Estatus == "C") {
                    $("#spEstatusCP").addClass("text-warning");
                    $("#BtnEstatusP").text("Cierre");
                }
                else if (Estatus == "X") {
                    $("#spEstatusCP").addClass("text-muted");
                    $("#BtnEstatusP").text("Cancelado");
                }
                else if (Estatus == "D") {
                    $("#spEstatusCP").addClass("text-danger");
                    $("#BtnEstatusP").text("Detenido");
                }

            } else {
                MensajeError(data.Mensaje);

            }
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error al realizar la consulta, intente de nuevo.");
        }
    });


}

//#region Equipo
var dsEquipo = [];
var dsEquipoA = [];

var tablaEquipo;
var tablaEquipoA;
var Usuario;
var IdProyectoUsuario;

var columnasEquipo = [
    {
        "data": "IdProyectoUsuario",
        "visible": false
    },


    {
        "class": "text-center",
        "data": "NumEmpleado",
        "render": function (data, type, row) {
            return '<img class="img-dt" src="http://app.yitpro.com/Archivos/Fotos/' + data + '.jpg"  alt="' + data + '">'


        }
    },

    {
        "data": "NumEmpleado",
        "class": "text-left"
    },
    {
        "data": "NombreCompleto",
        "class": "text-left"
    },
    {
        "data": "DescripcionTipoUsuario",
        "class": "text-left"
    },

    {
        "data": "Objetivo",
        "class": "text-center",
        "render": function (data, type, row) {

            if (row.IdTipoUsuario == 19 || row.IdTipoUsuario == 15 || row.IdTipoUsuario == 17) {

                return ''
            }
            else {
                return $.number(data, '2', '.', ',');
            }
          
        }
    },
    {
        //"data": "Participacion",
        "class": "text-center",
        "render": function (data, type, row) {


            if (row.IdTipoUsuario == 19 || row.IdTipoUsuario == 15 || row.IdTipoUsuario == 17) {

                return ''
            }
            else {
                return '<a class="btn btn-info" onclick= "AbrirModalUsuarioParticipacion(' + row.IdProyectoUsuario + ',' + row.Participacion + ');">' + $.number(row.Participacion, '2', '.', ',') + '</a>'
            }


           
            //return $.number(data, '2', '.', ',');
        }
    },
    {
        "data": "AdministraProy",
        "class": "text-center",
        "render": function (data, type, row) {
            var checked = (data) ? "checked" : " "
            return '<label class="switch switch-small"><input type="checkbox"  class="chkAdministrador" ' + checked + '/><span></span></label>';
        }
    },
    {
        "data": "ActivoStr",
        "class": "text-left"
    },

    {
        "class": "text-center",
        "render": function (data, type, row) {
            return '<button class="btn btn-danger BtnEliminarUsuario" ><span class="fa fa-trash-o"></span></button>'


        }
    }

];

var columnasEquipoA = [
    {
        "data": "IdUsuario",
        "visible": false
    },


    {
        "class": "text-center",
        "data": "NumEmpleado",
        "render": function (data, type, row) {
            return '<img class="img-dt" src="http://app.yitpro.com/Archivos/Fotos/' + data + '.jpg"  alt="' + data + '">'


        }
    },

    {
        "data": "NumEmpleado",
        "class": "text-left"
    },
    {
        "data": "NombreCompleto",
        "class": "text-left"
    },

    {
        "class": "text-center",
        "render": function (data, type, row) {
            return '<button class="btn btn-info btnAgregarUsuario" ><span class="fa fa-plus-o"></span>Agregar</button>'


        }
    }

];

function CargarEquipo() {

    var url = $('#urlConsultaUsuariosProyecto').val();

    $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ IdProyecto: $('#IdProyecto').val() }),
        dataType: "json",
        async: false,
        success: successCargaEquipo,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
    return false;

}

function successCargaEquipo(data) {
    if (data.Exito) {

        $('#LblCapRequerida').text(data.HorasPromedio);
        $('#LblCapActual').text(data.Cobertura);
        $('#LblCapacidadCubierta').text($.number(data.CoberturaPorc, '2', '.', ','));


        if (data.CoberturaPorc < 80) {
            $("#wCobertura").addClass("tile-danger");
            $("#wCobertura").removeClass("tile-success");
            $("#wCobertura").removeClass("tile-warning");

        }
        else if (data.CoberturaPorc >= 95) {
            $("#wCobertura").removeClass("tile-danger");
            $("#wCobertura").addClass("tile-success");
            $("#wCobertura").removeClass("tile-warning");

        }
        else {

            $("#wCobertura").removeClass("tile-danger");
            $("#wCobertura").removeClass("tile-success");
            $("#wCobertura").addClass("tile-warning");

        }


        dsEquipo = jQuery.parseJSON(data.LstUsuarios);
        tablaEquipo = inicializaTabla($('#TblEquipo'), dsEquipo, columnasEquipo, 1, "asc", true, true, true);
        $('div.pg-loading-screen').remove();
        page_content_onresize();
    }
    else {

        MensajeError(data.Mensaje);
    }

}

$(document).on('click', '#BtAgregarUsuario', function (e) {


    $('#ModalAgregarUsuarios').modal('show');
    CargarUsuariosAgregar();

    return false;
});

function CargarUsuariosAgregar() {

    var url = $('#urlConsultaUsuariosAgregar').val();

    $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ IdProyecto: $('#IdProyecto').val() }),
        dataType: "json",
        async: false,
        success: successCargarUsuariosAgregar,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
    return false;

}

function successCargarUsuariosAgregar(data) {
    if (data.Exito) {


        dsEquipoA = jQuery.parseJSON(data.LstUsuarios);
        tablaEquipoA = inicializaTabla($('#TblAgreagarUsuarios'), dsEquipoA, columnasEquipoA, 1, "asc", true, true, true);
        $('div.pg-loading-screen').remove();
    }
    else {

        MensajeError(data.Mensaje);
    }

}

$(document).on('click', '.btnAgregarUsuario', function (e) {


    var filaPadre = $(this).closest('tr');
    var row = tablaEquipoA.api().row(filaPadre);
    var datosFila = row.data();

    Usuario = {
        IdUsuario: datosFila.IdUsuario,
        IdProyecto: $('#IdProyecto').val()
    }


    MensajeConfirmarAccion("¿Desea agregar al usuario " + datosFila.NombreCompleto + " al proyecto?", "BtnConfirmarUsuario")

    return false;
});

$(document).on('click', '#BtnConfirmarUsuario', function (e) {


    AgregaUsuarioProyecto();

    return false;
});

function AgregaUsuarioProyecto() {

    var url = $('#urlGuardarUsuariosProyecto').val();

    $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ Usuario: Usuario }),
        dataType: "json",
        async: true,
        success: successUsuariosAgregar,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
    return false;

}

function successUsuariosAgregar(data) {

    if (data.Exito) {

        MensajeExito(data.Mensaje);
        CargarUsuariosAgregar();
        $('div.pg-loading-screen').remove();
    }
    else {

        MensajeError(data.Mensaje);
    }

}

$(document).on('click', '#BtnCerrarAgregarUsuario', function (e) {


    CargarEquipo();

    return false;
});

$(document).on('click', '.BtnEliminarUsuario', function (e) {


    var filaPadre = $(this).closest('tr');
    var row = tablaEquipo.api().row(filaPadre);
    var datosFila = row.data();

    IdProyectoUsuario = datosFila.IdProyectoUsuario;


    MensajeConfirmarAccion("¿Desea eliminar al usuario " + datosFila.NombreCompleto + " del proyecto?", "BtnConfirmarEliminausuario")


    return false;
});

$(document).on('click', '#BtnConfirmarEliminausuario', function (e) {


    EliminaUsuarioProyecto();

    return false;
});

function EliminaUsuarioProyecto() {

    var url = $('#urlEliminarUsuarioProyecto').val();

    $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ IdProyectoUsuario: IdProyectoUsuario }),
        dataType: "json",
        async: true,
        success: successUsuariosEliminar,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
    return false;

}

function successUsuariosEliminar(data) {

    if (data.Exito) {

        MensajeExito(data.Mensaje);
        CargarEquipo();
        $('div.pg-loading-screen').remove();
    }
    else {

        MensajeError(data.Mensaje);
    }

}

function AbrirModalUsuarioParticipacion(IdProyectoUsuario, Participacion) {

    $('#IdProyectoUP').val(IdProyectoUsuario);
    $('#TxtParticipacionU').val(Participacion);
    $('#ModalUsuarioParticipacion').modal('show');


    return false;
}
$(document).on('click', '#BtnGuardarParticipacionU', function (e) {


    var Mensaje = ValidaCamposRequeridos(".ReqParticipacionU");

    var url = $('#urlActualizaParticipacionU').val();



    if (Mensaje.length == 0) {

        var ProyectoU = {
            IdProyectoUsuario: $('#IdProyectoUP').val(),
            Participacion: $('#TxtParticipacionU').val()
        }

        $.ajax({

            url: url,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ ProyectoU: ProyectoU }),
            dataType: "json",
            async: true,
            success: function (data) {

                if (data.Exito) {
                    MensajeExito(data.Mensaje);
                    CargarEquipo();
                    $('#ModalUsuarioParticipacion').modal('hide');
                    $('div.pg-loading-screen').remove();
                }
                else {
                    MensajeError(data.Mensaje);
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
    //var Participacion = parse


    return false;


});


$(document).on('click', '.chkAdministrador', function () {
    debugger;
    var fila = $(this).closest('tr');

    var obj = tablaEquipo.api().row(fila).data();

    var url = $('#urlGuardaUsuarioAdministra').val();


    $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ IdProyectoUsuario: obj.IdProyectoUsuario, AdministraProy: $(this).prop('checked') }),
        dataType: "json",
        async: true,
        success: function (data) {

            if (data.Exito) {
                MensajeExito(data.Mensaje);
                CargarEquipo();
                //$('#ModalUsuarioParticipacion').modal('hide');
                //$('div.pg-loading-screen').remove();
            }
            else {
                MensajeError(data.Mensaje);
            }
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });


    //indexes = $.map(dsPermisos, function (obj, index) {
    //    if (obj.IdMenu == objPermiso.IdMenu) {
    //        return index;
    //    }
    //})

    //switch (tipoPermiso) {
    //    case 'Ver':
    //        dsPermisos[indexes[0]].Ver = $(this).prop('checked');
    //        break;
    //    case 'Guardar':
    //        dsPermisos[indexes[0]].Guardar = $(this).prop('checked');
    //        break;
    //    case 'Modificar':
    //        dsPermisos[indexes[0]].Modificar = $(this).prop('checked');
    //        break;
    //    case 'Eliminar':
    //        dsPermisos[indexes[0]].Eliminar = $(this).prop('checked');
    //        break;
    //    case 'Imprimir':
    //        dsPermisos[indexes[0]].Imprimir = $(this).prop('checked');
    //        break;
    //    default:
    //}

});

//#endregion

//#region Sprints
$(document).on('click', '#BtnCerrarAct', function (e) {


    $("#colActividad").hide();
    $("#colSprints").removeClass('col-md-6');
    $("#colSprints").addClass('col-md-9');

    return false;
});

$(document).on('click', '#BtnAgregarPBI', function (e) {


    $("#colActividad").show();
    $("#colSprints").addClass('col-md-6');
    $("#colSprints").removeClass('col-md-9');
    //$("#colSprints").removeClass('col-md-8');
    //$("#colSprints").removeClass('col-md-12');

    return false;
});

$(document).on('click', '#BtnAgregarIteracion', function (e) {

    InicializaModalSprint();
    $('#ModalIteraciones').modal('show');

    return false;
});

function InicializaModalSprint() {

    $('#TxtFechaFinI,#TxtFechaInicioI').datetimepicker(
        {
            format: 'DD/MM/YYYY'
        });
    $('#TxtNombreI').val('');
    $('#IdIteracion').val('0');
    $('#TxtObjetivoI').val('');
    $('#TxtFechaFinI').val('');
    $('#TxtFechaInicioI').val('');

}

$(document).on('click', '#BtnGuardarSprint', function (e) {

    // InicializaModalSprint();
    //$('#ModalIteraciones').modal('show');

    GuardarSprint();
    return false;
});

function GuardarSprint() {
    var Mensaje = ValidaCamposRequeridos(".ReqIteracion");


    if (Mensaje.length == 0) {


        var Sprint = {
            IdProyecto: $('#IdProyecto').val(),
            Nombre: $('#TxtNombreI').val().trim(),
            Objetivo: $('#TxtObjetivoI').val().trim(),
            FechaInicio: ObtieneFecha($('#TxtFechaInicioI').val().trim()),
            FechaFin: ObtieneFecha($('#TxtFechaFinI').val().trim())
        }
        LlamadaGuardarDatosSprint(Sprint);
    }

    else {

        MensajeAdvertencia(Mensaje);
    }

}

function LlamadaGuardarDatosSprint(Sprint) {

    var url = $('#urlGuardarSprint').val();

    $.ajax({

        url: url,
        data: JSON.stringify(Sprint),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessLlamadaGuardarSprint,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
}

function SuccessLlamadaGuardarSprint(data) {
    if (data.Exito) {
        $('#divsprints').empty();
        $('#divsprints').append(data.Sprints);
        $('#ModalIteraciones').modal('hide');
        InicializaPlugins();
        $('div.pg-loading-screen').remove();
        MensajeExito(data.Mensaje);

    }
    else if (data.Advertencia) {

        MensajeAdvertencia(data.Mensaje);

    }
    else {

        MensajeError(data.Mensaje);
    }
}

function CargarSprints() {


    if ($('#TxtBusqBacklog').val() == "") {
        ConsultasInicialSprints();
    }
    else {

        FiltrarBacklog();
    }

}

function ConsultasInicialSprints()
{
    var url = $('#urlCargaSprints').val();

    $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ IdProyecto: $('#IdProyecto').val() }),
        dataType: "json",
        async: false,
        success: successCargaSprints,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
    return false;
}

function successCargaSprints(data) {
    if (data.Exito) {


        $('#divsprints').empty();

        var sprints = jQuery.parseJSON(data.Sprints);

        if (sprints.length > 0) {
            $.each(sprints, function (key, value) {


                var sp = '<tr>' +
                    '<td><a onclick= "VerSprint(' + value.IdIteracion + ')"><h4 class="no-margins font-extra-bold">' + value.Nombre +
                    "<span  class='btn btn-small btn-grid' style='text-align:left;color:#000;'><span>" + value.EstatusStr + "<span><span class='fa fa-fw fa-circle " + value.Estatus + "'></span> </span>" +
                    '</h4></a> <small>' + value.Objetivo + '</small>' +
                    '<div class="progress progress-small">' +
                    '<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width:' + value.Avance + '%;"></div>' +
                    '</div>' +
                    '</td>' +
                    '<td><div class="pull-right font-bold text-primary"> <h4 class="text-default">' + value.Avance + '%</h4></div> </td>' +
                    '</tr>'

                $('#tblSprintDetalle').append(sp);

            });


        }
        else {

            var sp = '<tr><td><h4 class="no-margins font-extra-bold"> No hay sprints </h4>  </td></tr>'

            $('#tblSprintDetalle').append(sp);
        }

        //$('#divsprints').append(data.Sprints);
        //$('#tasks_backlog').empty();
        //$('#tasks_backlog').append(data.Backlog);
        //InicializaPlugins();
        page_content_onresize();


    }
    else {

        MensajeError(data.Mensaje);
    }

}

$(document).on('click', '#BtnFiltrarBacklog', function (e) {

    // InicializaModalSprint();
    //$('#ModalIteraciones').modal('show');

    FiltrarBacklog();
    return false;
});

$("#TxtBusqBacklog").keypress(function (e) {
    if (e.keyCode == 13) {
        FiltrarBacklog();
        return false;
    }
    return true;
});

function FiltrarBacklog() {

    var url = $('#urlFiltrarBacklog').val();

    $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ IdProyecto: $('#IdProyecto').val(), Busqueda: $('#TxtBusqBacklog').val()}),
        dataType: "json",
        async: false,
        success: successfiltrarBacklog,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
    return false;

}

function successfiltrarBacklog(data) {
    if (data.Exito) {


        //$('#divsprints').empty();
        //$('#divsprints').append(data.Sprints);
        $('#tasks_backlog').empty();
        $('#tasks_backlog').append(data.Backlog);
        InicializaPlugins();
        page_content_onresize();


    }
    else {

        MensajeError(data.Mensaje);
    }

}




function InicializaPlugins() {
    $(".accordion .panel-title a").on("click", function () {

        var blockOpen = $(this).attr("href");
        var accordion = $(this).parents(".accordion");
        var noCollapse = accordion.hasClass("accordion-dc");


        if ($(blockOpen).length > 0) {

            if ($(blockOpen).hasClass("panel-body-open")) {
                $(blockOpen).slideUp(200, function () {
                    $(this).removeClass("panel-body-open");
                });
            } else {
                $(blockOpen).slideDown(200, function () {
                    $(this).addClass("panel-body-open");
                });
            }

            if (!noCollapse) {
                accordion.find(".panel-body-open").not(blockOpen).slideUp(200, function () {
                    $(this).removeClass("panel-body-open");
                });
            }

            return false;
        }

    });

    $("#tasks_backlog").sortable({
        items: "> .task-item",
        connectWith: ".sprint",
        handle: ".task-text",
        receive: function (event, ui) {
            event.preventDefault();

        }
    }).disableSelection();



    $(".sprint").sortable({
        items: "> .task-item",
        connectWith: "#tasks_backlog",
        handle: ".task-text",
        receive: function (event, ui) {


            var IdActividad = $(ui).attr('item')[0].id;
            var IdIteracion = this.id.replace('tasks_', '');

            AsignaActividadSprint(IdActividad, IdIteracion);

            page_content_onresize();
        }
    }).disableSelection();

}

function AsignaActividadSprint(IdActividad, IdIteracion) {

    var url = $('#urlAsignaActividadSprint').val();

    $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ IdActividad: IdActividad, IdIteracion: IdIteracion }),
        dataType: "json",
        async: false,
        success: successAsignaActividad,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
    return false;


}

function successAsignaActividad(data) {
    if (!data.Exito) {
        MensajeError(data.Mensaje);
    }
}


function VerTablero( IdIteracion) {

    //var ProyectoN = $("#TxtNombreP").val();
    //var SprintN = $(e).attr('sprint');
   /* var url = $('#urlTablero').val() + "?Sprint=" + IdIteracion + "&Proyecto=" + IdProyecto + "&SprintN=" + SprintN + "&ProyectoN=" + ProyectoN;*/

    var url = $('#urlTablero').val() + "/" + IdIteracion ;
    window.open(url, '_blank');


}
//#endregion

////#region Actividades

var TipoUsuarioPan;
var UsuarioPan;
var tablasEncabezado = {};
var tablasDetalle = {};
var dsEncabezado = [];
var tablaActividades;
var dsDetalle;
var listaDetalle = [];
var tablaini;
var dsActividadesV = [];
var tablaValidacion;
var dsActividadesL = [];
var tablaLiberacion;

var columnasEncabezado = [
    {
        "class": "text-center",
        "render": function (data, type, row) {
            if (valida) {
                return '<input type="checkbox" class="SeleccionarT">';
            }
            else {
                return '';
            }
        }
    },
    {
        "data": "AsignadoPath",
        "class": "text-center",
        "render": data => `<img src="${data}" class="img-dt" style="width: 35px; height: 35px" />`
    },
    {
        "data": "IdActividadStr",
        "class": "text-left",

        "render": function (data, type, row) {

            return '<a style="color: #337ab7" class="btn btn-link" onclick="clickalerta(' + row.IdActividad + ' )">' + data + '</a>';

        }


    },

    {
        "data": "Estatus",
        "class": "text-left",
        "render": function (data, type, row) {

            if (data == 'A') {

                return '<span  class="btn btn-small Open" style="text-align:left; width:100%;">' + row.EstatusStr + ' </span>';

            }
            else if (data == 'P') {
                return '<span class="btn btn-small Progress" style="text-align:left;width:100%;">' + row.EstatusStr + ' </span>';

            }
            else if (data == 'R' || data == 'V') {
                return '<span class="btn btn-small Validation" style="text-align:left;width:100%;;">' + row.EstatusStr + ' </span>';

            }
            else if (data == 'X') {
                return '<span class="btn btn-small Rejected" style="text-align:left;width:100%;">' + row.EstatusStr + ' </span>';

            }
            else if (data == 'L') {
                return '<span class="btn btn-small Done" style="text-align:left;width:100%;">' + row.EstatusStr + ' </span>';

            }
            else if (data == 'C') {
                return '<span class="btn btn-small Cancelled" style="text-align:left;width:100%;">' + row.EstatusStr + ' </span>';

            }

        }
    },
    {
        "data": "PrioridadStr",
        "class": "text-left",
    },
    {
        "data": "Descripcion",
        "class": "text-left",
    },
    {
        "data": "Sprint",
        "class": "text-left",
    },
    {
        "data": "TipoActividadStr",
        "class": "text-left",
    },
    {
        "data": "ClasificacionStr",
        "class": "text-left",
    },
    {
        "data": "HorasAsignadas",
        "class": "text-right sum",
    },
    {
        "data": "FechaSolicitado",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? "" : moment(data).format("YYYY/MM/DD"))
        }
    },
    {
        "data": "HorasFinales",
        "class": "text-right",
    },
    {
        "data": "FechaTermino",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? "" : moment(data).format("YYYY/MM/DD"))
        }
    },
    {
        "class": "text-center",
        "render": function (data, type, row) {


            return '<div class="btn-group pull-right" >'
                + '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">' +
                '<span class="caret"></span>' +
                '<span class="sr-only">Toggle Dropdown</span>'
                + '</button>' +
                '<ul class="dropdown-menu" role="menu">' +
                '<li><a href="#" onclick="CapturaTrabajo(' + row.IdActividad + "," + row.PSP + ",'" + row.ClasificacionStr + "'" + ' )"> <i class="fa fa-share pull-right"></i>Captura trabajo</a></li>' +
                '<li><a href="#" onclick="SolicitarRevision(' + row.IdActividad + ' )"> <i class="fa fa-share pull-right"></i>Solicitar revisión</a></li>' +
                '<li><a href="#" onclick="AbrirModalValidacion(' + row.IdActividad + ' )"> <i class="fa fa-check-circle-o pull-right"></i>Validaciones</a></li>' +
                '<li><a href="#" onclick="InicializaRetrabajoActividad(' + row.IdActividad + ",'" + row.Estatus + "'" + ' )"> <i class="fa fa-reply pull-right"></i>Solicitar retrabajo</a></li>' +
                //'<li><a href="#">Another action</a></li>'+
                //'<li><a href="#">Something else here</a></li>'+
                '<li class="divider"></li>' +
                '<li><a href="#" onclick="Cancelar(' + row.IdActividad + ' )"><i class="fa fa-minus-circle pull-right"></i>Cancelar</a></li>' +
                '</ul></div>';

        }
    },

    {
        "data": "MotivoRechazoId",
        "visible": false
    },
    {
        "data": "DescripcionRechazo",
        "visible": false
    }
];

var columnasEncabezadoV = [

    {
        "class": "text-center",
        "render": function (data, type, row) {
            if (valida) {
                return '<input type="checkbox" class="SeleccionarV">';
            }
            else {
                return '';
            }
        }
    },


    {
        "data": "AsignadoPath",
        "class": "text-center",
        "render": data => `<img src="${data}" class="img-dt" style="width: 35px; height: 35px" />`
    },
    //{
    //    "data": "IdActividadStr",
    //    "class": "text-left",
    //    "render": data => `<button style="color: #337ab7" class="btn btn-link BtnVerActividad">${data}</button>`
    //},

    {
        "data": "IdActividadStr",
        "class": "text-left",

        "render": function (data, type, row) {

            return '<a style="color: #337ab7" class="btn btn-link" onclick="clickalerta(' + row.IdActividad + ' )">' + data + '</a>';

        }


    },
    {
        "data": "Descripcion",
        "class": "text-left",
    },
    {
        "data": "Sprint",
        "class": "text-left",
    },
    {
        "data": "TipoActividadStr",
        "class": "text-left",
    },
    {
        "data": "ClasificacionStr",
        "class": "text-left",
    },
    {
        "data": "AsignadoStr",
        "class": "text-left",
    },
    {
        "data": "ResponsableStr",
        "class": "text-left",
    },
    {
        "data": "HorasAsignadas",
        "class": "text-right sum",
    },
    {
        "data": "FechaSolicitado",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? "" : moment(data).format("YYYY/MM/DD"))
        }
    },
    {
        "data": "HorasFinales",
        "class": "text-right",
    },
    {
        "data": "FechaTermino",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? "" : moment(data).format("YYYY/MM/DD"))
        }
    },
    {
        "class": "text-center",
        "render": function (data, type, row) {


            return '<div class="btn-group pull-right" >'
                + '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">' +
                '<span class="caret"></span>' +
                '<span class="sr-only">Toggle Dropdown</span>'
                + '</button>' +
                '<ul class="dropdown-menu" role="menu">' +
                '<li><a href="#" onclick="SolicitarRevision(' + row.IdActividad + ' )"> <i class="fa fa-share pull-right"></i>Solicitar revisión</a></li>' +
                '<li><a href="#" onclick="AbrirModalValidacion(' + row.IdActividad + ' )"> <i class="fa fa-check-circle-o pull-right"></i>Validaciones</a></li>' +
                '<li><a href="#" onclick="InicializaRetrabajoActividad(' + row.IdActividad + ",'" + row.Estatus + "'" + ' )"> <i class="fa fa-reply pull-right"></i>Solicitar retrabajo</a></li>' +
                //'<li><a href="#">Another action</a></li>'+
                //'<li><a href="#">Something else here</a></li>'+
                '<li class="divider"></li>' +
                '<li><a href="#" onclick="Cancelar(' + row.IdActividad + ' )"><i class="fa fa-minus-circle pull-right"></i>Cancelar</a></li>' +
                '</ul></div>';

        }
    }
];

var columnasEncabezadoL = [
    //{
    //    "class": "text-center",
    //    "render": function (data, type, row) {
    //        return "<button type='button' class='btn btn-success details-control' title='Ver timeline' ><i class='fa fa-plus'></i></button>"
    //    }
    //},
    {
        "class": "text-center",
        "render": function (data, type, row) {


            if (libera) {
                return '<input type="checkbox" class="SeleccionarL">';
            }
            else {
                return '';
            }
        }
    },

    {
        "data": "AsignadoPath",
        "class": "text-center",
        "render": data => `<img src="${data}" class="img-dt" style="width: 35px; height: 35px" />`
    },

    {
        "data": "IdActividadStr",
        "class": "text-left",

        "render": function (data, type, row) {

            return '<a style="color: #337ab7" class="btn btn-link" onclick="clickalerta(' + row.IdActividad + ' )">' + data + '</a>';

        }


    },
    //{
    //    "data": "IdActividadStr",
    //    "class": "text-left",
    //    "render": data => `<button style="color: #337ab7" class="btn btn-link BtnVerActividad">${data}</button>`
    //},

    //{
    //    "class": "text-center",
    //    "render": function (data, type, row) {
    //        return ' <button class="btn btn-default btn-small fa fa-list-alt BtnVerActividadL"></button>';
    //    }
    //},

    //{
    //    "data": "IdActividad",
    //    "class": "text-center",
    //},
    {
        "data": "Descripcion",
        "class": "text-left",
    },
    {
        "data": "Sprint",
        "class": "text-left",
    },
    {
        "data": "TipoActividadStr",
        "class": "text-left",
    },
    {
        "data": "ClasificacionStr",
        "class": "text-left",
    },
    {
        "data": "AsignadoStr",
        "class": "text-left",
    },
    {
        "data": "ResponsableStr",
        "class": "text-left",
    },
    {
        "data": "HorasAsignadas",
        "class": "text-right sum",
    },
    {
        "data": "FechaSolicitado",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? "" : moment(data).format("YYYY/MM/DD"))
        }
    },
    {
        "data": "HorasFinales",
        "class": "text-right",
    },
    {
        "data": "FechaTermino",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? "" : moment(data).format("YYYY/MM/DD"))
        }
    },
    {
        "class": "text-center",
        //"data": "IdActividad",
        "render": function (data, type, row) {


            return '<div class="btn-group pull-right" >'
                + '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">' +
                '<span class="caret"></span>' +
                '<span class="sr-only">Toggle Dropdown</span>'
                + '</button>' +
                '<ul class="dropdown-menu" role="menu">' +
                '<li><a href="#" onclick="SolicitarRevision(' + row.IdActividad + ' )"> <i class="fa fa-share pull-right"></i>Solicitar revisión</a></li>' +
                '<li><a href="#" onclick="AbrirModalValidacion(' + row.IdActividad + ' )"> <i class="fa fa-check-circle-o pull-right"></i>Validaciones</a></li>' +
                '<li><a href="#" onclick="InicializaRetrabajoActividad(' + row.IdActividad + ",'" + row.Estatus + "'" + ' )"> <i class="fa fa-reply pull-right"></i>Solicitar retrabajo</a></li>' +
                //'<li><a href="#">Another action</a></li>'+
                //'<li><a href="#">Something else here</a></li>'+
                '<li class="divider"></li>' +
                '<li><a href="#" onclick="Cancelar(' + row.IdActividad + ' )"><i class="fa fa-minus-circle pull-right"></i>Cancelar</a></li>' +
                '</ul></div>';

        }
    },
];

function InicializaActividades() {


    $('#TxtFechaAIF,#TxtFechaAFF,#TxtFechaSIF,#TxtFechaSFF,#TxtFechaCIF,#TxtFechaCFF').datetimepicker(
        {
            format: 'DD/MM/YYYY'
        });


 /*   InicializaPanelActividades();*/
 
    $("#BtnCancelacionM").hide();



    //$(".filter-settings-icon").on("click", function () {
    //    $(".filter-settings").toggleClass("active");
    //});

    $('#TxtFechaAIF,#TxtFechaAFF,#TxtFechaSIF,#TxtFechaSFF,#TxtFechaCIF,#TxtFechaCFF').datetimepicker(
        {
            format: 'DD/MM/YYYY'
        });

    CargaCombosFiltros();

    $('.DateRangePicker').daterangepicker({
        locale: lacalesDTRP,
        ranges: {
            'Hoy': [moment(), moment()],
            'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Últimos 7 días ': [moment().subtract(6, 'days'), moment()],
            'Últimos 30 días': [moment().subtract(29, 'days'), moment()],
            'Este mes': [moment().startOf('month'), moment().endOf('month')],
            'Mes anterior': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            "Este año": [moment().startOf('year'), moment().endOf('year')],
            "Último año": [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],
        },
        startDate: moment().subtract(1, 'year').startOf('year'),
        endDate: moment().endOf('month')
    });

    $('#TxtRangoFechas').val(moment().subtract(1, 'year').startOf('year').format('DD/MM/YYYY') + ' - ' + moment().endOf('month').format('DD/MM/YYYY'));

    CargaActividades();


}

function CargaCombosFiltros() {

    var url = $('#urlCargaInicialCombosF').val();

    $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            if (data.Exito) {

                $('#SelProyectoF').empty();
                $('#SelProyectoF').append(data.LstProyectos);

                $('#SelProyectoF').selectpicker('refresh');

                $('#SelActividadF').empty();
                $('#SelActividadF').append(data.LstTipoAct);
                $('#SelActividadF').selectpicker('refresh');

                $('#SelUsuarioAsignadoF').empty();
                $('#SelUsuarioAsignadoF').append(data.LstUsuarios);

                $('#SelUsuarioAsignadoF').selectpicker('refresh');

                $('#SelResponsableF').empty();
                $('#SelResponsableF').append(data.LstLideres);

                $('#SelClasificacionF').empty();
                $('#SelClasificacionF').append(data.LstClasificacion);

                $('.selectpicker').selectpicker('refresh');

                TipoUsuarioPan = data.TipoUsuario;
                UsuarioPan = data.Usuario;

            }
            else {

                MensajeAdvertencia(data.Mensaje);
            }

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Ha ocurrido un error inesperado, por favor vuelva a intentarlo.");
        }
    });
    return false;
}

$(document).on('click', '#BtnFiltrar', function (e) {

    CargaActividades();
    $(".filter-settings").toggleClass("active");
    return false;

});

function CargaActividades() {

    var url = $('#urlBuscarActividades').val();

    //var fechacreoini = ObtieneFecha($('#TxtFechaAIF').val().trim());
    //var fechacreofin = ObtieneFecha($('#TxtFechaAFF').val().trim());
    //var fechasolini = ObtieneFecha($('#TxtFechaSIF').val().trim());
    //var fechasolfin = ObtieneFecha($('#TxtFechaSFF').val().trim());
    //var fechacierreini = ObtieneFecha($('#TxtFechaCIF').val().trim());
    //var fechacierrefin = ObtieneFecha($('#TxtFechaCFF').val().trim());



    var incio, fin;
    if ($("#TxtRangoFechas").val() != "") {
        inicio = ($("#TxtRangoFechas").val()).split('-')[0];
        fin = ($("#TxtRangoFechas").val()).split('-')[1];
    }

    var datosBuscar = {
        FechaSolIni: inicio,
        FechaSolFin: fin,
        /*        TipoPeriodo: $('#SelPeriodoT').val(),*/
        LstAsignado: $('#SelUsuarioAsignadoF').val(),
        /*     LstSprints: $('#SelSprintT').val(),*/
        LstProyecto: $('#IdProyecto').val(),
        LstEstatus: $('#SelEstatusF').val(),
        LstTipoActividad: $('#SelActividadF').val()
       /* IdProyecto: $('#IdProyecto').val()*/

    }


    //var datosBuscar = {

    //    FechaCreoIni: fechacreoini,
    //    FechaCreoFin: fechacreofin,
    //    FechaSolIni: fechasolini,
    //    FechaSolFin: fechasolfin,
    //    FechaCierreIni: fechacierreini,
    //    FechaCierreFin: fechacierrefin,
    //    LstTipoActividad: $('#SelActividadF').val(),
    //    LstClasificacion: $('#SelClasificacionF').val(),
    //    LstAsignado: $('#SelUsuarioAsignadoF').val(),
    //    LstResponsable: $('#SelResponsableF').val(),
    //    LstProyecto: $('#SelProyectoF').val(),
    //    LstPrioridad: $('#SelPrioridadF').val(),
    //    LstEstatus: $('#SelEstatusF').val(),
    //    Actividades: $('#TxtActividadF').val()
    //}


    $.ajax({
        url: url,
        data: JSON.stringify(datosBuscar),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {

            if (data.Exito) {


                $("#LblAbierto").text("Abiertas (" + data.TotalAbiertas + ")");
                $("#LblProgreso").text("Progreso (" + data.TotalProgreso + ")");
                $("#LblValidacion").text("Validación (" + data.TotalValidacion + ")");
                $("#LblTerminadas").text("Terminadas (" + data.TotalLiberadas + ")");
                $("#LblRechazadas").text("Rechazadas (" + data.TotalRechazadas + ")");

                $("#tasks_assigned").empty();
                $("#tasks_progreess").empty();
                $("#task_validate").empty();
                $("#tasks_re").empty();
                $("#tasks_ok").empty();



                $("#tasks_assigned").append(data.ActividadesA);
                $("#tasks_progreess").append(data.ActividadesP);
                $("#task_validate").append(data.ActividadesR);
                $("#tasks_re").append(data.ActividadesX);
                $("#tasks_ok").append(data.ActividadesLi);
                resizeTaskList();


                dsEncabezadoReq = jQuery.parseJSON(data.ActividadesReq);
                dsEncabezadoSprint = jQuery.parseJSON(data.ActividadesSprint);
                dsEncabezadoRecurso = jQuery.parseJSON(data.ActividadesRecurso);
                dsEncabezado = jQuery.parseJSON(data.ActividadesEnc);
                listaDetalle = jQuery.parseJSON(data.Actividades);

                $("#BtnVerFases").removeClass("btn-default");
                $("#BtnVerFases").addClass("btn-info");

                $("#BtnVerRequerimientos").removeClass("btn-info");
                $("#BtnVerRequerimientos").addClass("btn-default");
                $("#BtnVerSprint").removeClass("btn-info");
                $("#BtnVerSprint").addClass("btn-default");
                $("#BtnVerRecursos").removeClass("btn-info");
                $("#BtnVerRecursos").addClass("btn-default");
                IdVisorAct = 1;
                //dsActividadesProyecto = jQuery.parseJSON(data.Actividades);
              /*  ActualizaTablaExportar(data.Actividades);*/
                if (primeravez) {
                    inicializaTablaEnc('TblActividadesP', dsEncabezado);
                }
                else {
                    refrescaTablaAct();
                }
                primeravez = false;

                /*    page_content_onresize();*/



             //   var primeravez = !(dsEncabezado.length > 0);

             //   var Actividades = eval('(' + data.Actividades + ')');
             //   var ActividadesLog = eval('(' + data.ActividadesLog + ')');
             //   var ActV = eval('(' + data.ActividadesV + ')');
             //   var ActL = eval('(' + data.ActividadesL + ')');

             //   dsEncabezado = Actividades;
             //   dsActividadesV = ActV;
             //   dsActividadesL = ActL;

             //   $("#Todo").text("Todo (" + data.Total + ")");
             //   $("#Autorizar").text("Pendiente autorizar (" + data.TotalV + ")");
             //   $("#Liberar").text("Pendiente liberar (" + data.TotalL + ")");

             //   valida = data.Valida;
             //   libera = data.Libera;

             //   if (!data.Valida) {
             //       $("#BtnValidacionM").hide();
             //       $("#ChkTodosV").hide();
             //   }


             //   if (!data.Libera) {
             //       $("#BtnLiberacionM").hide();
             //       $("#ChkTodosL").hide();
             //   }

             ///*   ActualizaTablaExportar(data.Actividades);*/
             //   tablaActividades = inicializaTabla($('#TblActividades'), dsEncabezado, columnasEncabezado, 1, "asc", true, false, true);
             //   tablaValidacion = inicializaTabla($('#TblActividadesV'), dsActividadesV, columnasEncabezadoV, 1, "asc", true, false, true);
             //   tablaLiberacion = inicializaTabla($('#TblActividadesL'), dsActividadesL, columnasEncabezadoL, 1, "asc", true, false, true);

             //   tablasEncabezado["TblActividadesV"] = tablaValidacion;
             //   tablasEncabezado["TblActividadesL"] = tablaLiberacion;



                $('div.pg-loading-screen').remove();



                page_content_onresize();

                $('#LblTotal').text('Total horas: 0');
                $('#LblTotalV').text('Total horas: 0');


                $('div.pg-loading-screen').remove();

            }
            else {

                MensajeAdvertencia(data.Mensaje);

            }

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error al realizar la consulta, intente de nuevo.");
        }
    });

}

$('#BtnExportarActividaesProy').click(e => {
    e.preventDefault();

    let formData = new FormData();

    var incio, fin;
    if ($("#TxtRangoFechas").val() != "") {
        inicio = ($("#TxtRangoFechas").val()).split('-')[0];
        fin = ($("#TxtRangoFechas").val()).split('-')[1];
    }


    formData.append("FechaSolIni", inicio);
    formData.append("FechaSolFin", fin);
    formData.append("LstProyecto", $('#IdProyecto').val());
    formData.append("LstEstatus", $('#SelEstatusF').val());
    formData.append("LstTipoActividad", $('#SelActividadF').val());
    formData.append("LstAsignado", $('#SelUsuarioAsignadoF').val());

    DOWNLOAD('/Actividades/DescargarExcelActividades', 'Actividades.xlsx', formData, true);
});


function resizeTaskList() {
    setTimeout(function () {
        $(".x_panel .tasks").css("height", "auto");
        $(".x_panel .tasks").css("min-height", "auto");

        var maximo = 0;
        $.each($(".x_panel .tasks"), function (e, v) {
            if ($(v).height() != null && maximo < $(v).height()) {
                maximo = $(v).height();
            }
        });

        $(".x_panel .tasks").css("height", maximo + "px");
        $(".x_panel .tasks").css("min-height", maximo + "px");

    }, 1);

}

$(document).on('click', '.BtnVerActividad', function (e) {

    var filaPadre = $(this).closest('tr');
    var row = tablasEncabezado['TblActividades'].api().row(filaPadre);
    var datosFila = row.data();
    var Actividad = datosFila.IdActividad;

    $('#TituloActividades').text("Actividad #" + Actividad);
    $('#IdActividad').val(Actividad);
    $("#ActPSP").val(Actividad.PSP)
    $('#ModalActividades').on('hidden.bs.modal', function () {
        CargaActividades();
    });

    $('#ModalActividades').modal({ keyboard: false });
    InicializaEdicionActividad();

    return false;

});

$(document).on('click', '.BtnVerActividadV', function (e) {

    var filaPadre = $(this).closest('tr');
    var row = tablasEncabezado['TblActividadesV'].api().row(filaPadre);
    var datosFila = row.data();
    var Actividad = datosFila.IdActividad;

    $('#TituloActividades').text("Actividad #" + Actividad);
    $('#IdActividad').val(Actividad);
    $('#ModalActividades').on('hidden.bs.modal', function () {
        CargaActividades();
        $(this).off('hidden.bs.modal');
    });

    $('#ModalActividades').modal({ keyboard: false });
    InicializaEdicionActividad();

    return false;

});

$(document).on('click', '.BtnVerActividadL', function (e) {

    var filaPadre = $(this).closest('tr');
    var row = tablasEncabezado['TblActividadesL'].api().row(filaPadre);
    var datosFila = row.data();
    var Actividad = datosFila.IdActividad;

    $('#TituloActividades').text("Actividad #" + Actividad);
    $('#IdActividad').val(Actividad);
    $('#ModalActividades').on('hidden.bs.modal', function () {
        CargaActividades();
        $(this).off('hidden.bs.modal');
    });

    $('#ModalActividades').modal({ keyboard: false });
    InicializaEdicionActividad();

    return false;

});

$(document).on('click', '#ChkTodosV', function () {

    var rows = tablaValidacion.api().rows().nodes();
    var datos = tablaValidacion.api().rows().data();
    $('input[type="checkbox"]', rows).prop('checked', this.checked);

    indexes = $.map(dsActividadesV, function (obj, index) {
        if (obj.IdActividad == datos[index].IdActividad) {
            return index;
        }
    })

    var check = $(this).prop('checked');
    $.each(indexes, function (key, value) {
        dsActividadesV[indexes[key]].Seleccionado = check;
    });

});

$(document).on('click', '#ChkTodosL', function () {

    var rows = tablaLiberacion.api().rows().nodes();
    var datos = tablaLiberacion.api().rows().data();
    $('input[type="checkbox"]', rows).prop('checked', this.checked);

    indexes = $.map(dsActividadesL, function (obj, index) {
        if (obj.IdActividad == datos[index].IdActividad) {
            return index;
        }
    })
        ;
    var check = $(this).prop('checked');
    $.each(indexes, function (key, value) {
        dsActividadesL[indexes[key]].Seleccionado = check;
    });
});

$(document).on('change', '.SeleccionarV', function (e) {
    var filaPadre = $(this).closest('tr');
    var row = tablaValidacion.api().row(filaPadre);
    var datosFila = row.data();
    var IdActividad = datosFila.IdActividad;

    var indexes = $.map(dsActividadesV, function (obj, index) {
        if (obj.IdActividad == IdActividad) {
            return index;
        }
    });
    dsActividadesV[indexes[0]].Seleccionado = $(this).prop('checked');

    return false;

});

$(document).on('change', '.SeleccionarL', function (e) {
    var filaPadre = $(this).closest('tr');
    var row = tablaLiberacion.api().row(filaPadre);
    var datosFila = row.data();
    var IdActividad = datosFila.IdActividad;

    var indexes = $.map(dsActividadesL, function (obj, index) {
        if (obj.IdActividad == IdActividad) {
            return index;
        }
    });
    dsActividadesL[indexes[0]].Seleccionado = $(this).prop('checked');

    return false;

});


$(document).on('click', '#ChkTodosT', function () {

    var rows = tablaActividades.api().rows().nodes();
    var datos = tablaActividades.api().rows().data();
    $('input[type="checkbox"]', rows).prop('checked', this.checked);

    indexes = $.map(dsEncabezado, function (obj, index) {
        if (obj.IdActividad == datos[index].IdActividad) {
            return index;
        }
    })
        ;
    var check = $(this).prop('checked');
    $.each(indexes, function (key, value) {
        dsEncabezado[indexes[key]].Seleccionado = check;
    });

    var validar = '';

    $.map(dsEncabezado, function (obj, index) {
        if (obj.Seleccionado) {
            validar += obj.IdActividad + ',';
        }
    });


    if (validar == '') {
        $("#BtnCancelacionM").hide();
    }
    else {

        $("#BtnCancelacionM").show();
    }

});
$(document).on('change', '.SeleccionarT', function (e) {
    var filaPadre = $(this).closest('tr');
    var row = tablaActividades.api().row(filaPadre);
    var datosFila = row.data();
    var IdActividad = datosFila.IdActividad;

    var indexes = $.map(dsEncabezado, function (obj, index) {
        if (obj.IdActividad == IdActividad) {
            return index;
        }
    });
    dsEncabezado[indexes[0]].Seleccionado = $(this).prop('checked');



    var validar = '';

    $.map(dsEncabezado, function (obj, index) {
        if (obj.Seleccionado) {
            validar += obj.IdActividad + ',';
        }
    });


    if (validar == '') {
        $("#BtnCancelacionM").hide();
    }
    else {

        $("#BtnCancelacionM").show();
    }



    return false;

});

$(document).on('click', '#BtnValidacionM', function (e) {

    var validar = '';

    $.map(dsActividadesV, function (obj, index) {
        if (obj.Seleccionado) {
            validar += obj.IdActividad + ',';
        }
    });

    if (validar == '') {
        MensajeAdvertencia('No ha seleccionado ninguna actividad.');
        return false;
    }

    var url = $('#urlValidacionMasiva').val();

    $.ajax({
        url: url,
        data: JSON.stringify({ Actividades: validar }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            if (data.Exito) {
                CargaActividades();
                MensajeExito(data.Mensaje);
            }
            else {

                MensajeAdvertencia(data.Mensaje);
            }

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Ha ocurrido un error inesperado, por favor vuelva a intentarlo.");
        }
    });


    return false;

});

$(document).on('click', '#BtnLiberacionM', function (e) {


    var validar = '';

    $.map(dsActividadesL, function (obj, index) {
        if (obj.Seleccionado) {
            validar += obj.IdActividad + ',';
        }
    });

    if (validar == '') {
        MensajeAdvertencia('No ha seleccionado ninguna actividad.');
        return false;
    }

    var url = $('#urlLiberacionMasiva').val();

    $.ajax({
        url: url,
        data: JSON.stringify({ Actividades: validar }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            if (data.Exito) {
                CargaActividades();
                MensajeExito(data.Mensaje);


            }
            else {

                MensajeAdvertencia(data.Mensaje);
            }

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Ha ocurrido un error inesperado, por favor vuelva a intentarlo.");
        }
    });


    return false;

});

$(document).on('click', '#BtnCancelacionM', function (e) {


    var validar = '';

    $.map(dsEncabezado, function (obj, index) {
        if (obj.Seleccionado) {
            validar += obj.IdActividad + ',';
        }
    });

    if (validar == '') {
        MensajeAdvertencia('No ha seleccionado ninguna actividad.');
        return false;
    }

    MensajeConfirmarAccion("¿Desea cancelar las actividades?", "BtnConfirmaCancelacionM");

    return false;

});

$(document).on('click', '#BtnConfirmaCancelacionM', function (e) {


    var validar = '';

    $.map(dsEncabezado, function (obj, index) {
        if (obj.Seleccionado) {
            validar += obj.IdActividad + ',';
        }
    });

    var url = $('#urlCancelacionMasiva').val();

    $.ajax({
        url: url,
        data: JSON.stringify({ Actividades: validar }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            if (data.Exito) {

                MensajeExito(data.Mensaje);
                CargaActividades();



            }
            else {

                MensajeAdvertencia(data.Mensaje);
            }

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Ha ocurrido un error inesperado, por favor vuelva a intentarlo.");
        }
    });


    return false;

});

//function CapturaTrabajo(IdActividad, PSP, Descripcion) {
//    if (PSP === 1) {
//        var url = $('#urlTracking').val() + "?Id=" + IdActividad;
//        window.open(url, '_blank');

//    } else {

//        $("#IdActividadCTra").val(IdActividad);
//        $("#LblActividadDesc").text(IdActividad + "-" + Descripcion);
//        var date = new Date();
//        $('#TxtFechaTrab').datetimepicker(
//            {
//                format: 'DD/MM/YYYY',
//                maxDate: date
//            });
//        $("#TxtTiempo").val("");
//        $("#TxtComentarioTrabajo").val("");
//        CargarTrabajos();
//        $('#ModalCapturarTrabajo').on('hidden.bs.modal', function () {
//            CargaActividades();
//            $(this).off('hidden.bs.modal');
//        });
//        $('#ModalCapturarTrabajo').modal({ backdrop: 'static', keyboard: false });
//    }
//}

$("#tasks_assigned,#tasks_progreess, #task_validate,#tasks_re, #tasks_ok").sortable({
    items: "> .task-item",
    connectWith: "#tasks_assigned, #tasks_progreess, #task_validate,#tasks_re,#tasks_ok",
    handle: ".task-text",
    receive: function (event, ui) {
        if (this.id == "task_validate") {

            var item = $(ui).attr('item')[0].id;

            ui.item.removeClass("task-info");
            ui.item.removeClass("task-danger");
            ui.item.removeClass("task-progreess");
            ui.item.addClass("task-validate");

            AbrirModalCapturaTiempo(item);

        if (this.id == "tasks_progreess") {
       
            var item = $(ui).attr('item')[0].id;
    
            ui.item.removeClass("task-info");
            ui.item.removeClass("task-validate");
            ui.item.removeClass("task-danger");
            ui.item.addClass("task-progreess");
            ActualizaEstatus(item, 'P');
        }
        if (this.id == "tasks_assigned") {

            var item = $(ui).attr('item')[0].id;

            ui.item.removeClass("task-validate");
            ui.item.removeClass("task-danger");
            ui.item.removeClass("task-progreess");
            ui.item.addClass("task-info");
            ActualizaEstatus(item, 'A');

        }

        if (this.id == "tasks_re") {

            var item = $(ui).attr('item')[0].id
            AbrirModalRechazoActividad(item);
        }

        if (this.id == "tasks_ok") {


            var item = $(ui).attr('item')[0].id
            Actividad = {
                IdActividad: item,
                IdAutorizacion: 0,
                IdActividadVal: 0,
                Valida: true
            };

            ValidaRechazaActividadKanban(Actividad);
            CargaActividades();


        }
        page_content_onresize();
    }
    }
}).disableSelection();



function AbrirModalCapturaTiempo(IdActividad) {

    $("#IdActividadCT").val(IdActividad);
    $('#TituloRec').text("Capturar fecha fin de actividad #" + IdActividad);
    var date = new Date();
    $('#TxtFinActividad').datetimepicker(
        {
            format: 'DD/MM/YYYY',
            maxDate: date
        });

    $('#ModalCapturarTiempo').on('hidden.bs.modal', function () {

        CargaActividades();
        $(this).off('hidden.bs.modal');

    });

    $('#ModalCapturarTiempo').modal({ keyboard: false });

    return false;

}

function ActualizaEstatus(IdActividad, Estatus) {

    var url = $('#urlActualizaEstatus').val();

    $.ajax({
        url: url,
        data: JSON.stringify({ IdActividad: IdActividad, Estatus: Estatus }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            if (!data.Exito) {

                MensajeAdvertencia(data.Mensaje);

            }
            else {
                CargaActividades();
            }

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error al realizar la consulta, intente de nuevo.");
        }
    });


}

function AbrirModalRechazoActividad(IdActividad) {

    InicializaModalRechazar();
    $('#ActividadR').val(IdActividad);



    $('#TituloRec').text("Rechazar actividad #" + IdActividad);


    $('#ModalRechazarActividad').on('hidden.bs.modal', function () {
        CargaActividades();
        $(this).off('hidden.bs.modal');
    });

    $('#ModalRechazarActividad').modal({ keyboard: false });


    return false;

}


$("#BtnImportarAct").click(function () {

    $("#FlImportaActividades").parent().next().text("");
    $("#FlImportaActividades").val("");
    $('#BtnImportarActividad').addClass('hidden');
    $('#ModalImportarActividades').modal({ keyboard: false });

    return false;

});
$(document).on("change", "#FlImportaActividades", function (e) {
    $("#FlImportaActividades").parent().next().next().text("");



    if (e.target.files != undefined) {

        var reader = new FileReader();

        reader.onload = function (f) {

            $('#BtnImportarActividad').removeClass('hidden');
        };
        reader.readAsDataURL(e.target.files.item(0));
    }

});

$(document).on('click', '#BtnImportarActividad', function (e) {


    ImportaArchivo();

    return false;
});

function ImportaArchivo() {
    var url = $('#urlImportaActividades').val();

    var form_data = new FormData();
    form_data.append("Archivo", $("#FlImportaActividades").prop("files")[0]);
    form_data.append("Tipo", $('input:radio[name=TipoCarga]:checked').val());

    $.ajax({
        url: url,
        type: "POST",
        contentType: false,
        //dataType: "script",
        data: form_data,
        processData: false,
        async: false,
        success: function (Respuesta) {

            var Resultado = Respuesta.split('|');


            $('div.pg-loading-screen').remove();
            if (Resultado[0] == "E") {

                CargaActividades();
                MensajeExito(Resultado[1]);
            }
            else {
                CargaActividades();
                MensajeAdvertencia(Resultado[1]);
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            var err = eval("(" + xhr.responseText + ")");
            MensajeError(err.Message);
        }
    });
}


$("#BtnNuevaActividadP").click(function () {


    $('#ModalActividades').on('hidden.bs.modal', function () {
        CargaActividades();
    });
    $('#ModalActividades').modal({ keyboard: false });
    $('#TituloActividades').text("Captura de Actividad");
    $('#IdProyectoAct').val($('#IdProyecto').val());
    InicializaAltaActividades();

    return false;

});


$("#BtnImportarPR").click(function () {

    $("#FlImportaActividadesPR").parent().next().text("");
    $("#FlImportaActividadesPR").val("");
    $('#BtnImportarActividadPR').addClass('hidden');
    $('#ModalImportarPeerReviews').modal({ keyboard: false });

    return false;

});


$(document).on("change", "#FlImportaActividadesPR", function (e) {
    $("#FlImportaActividadesPR").parent().next().next().text("");



    if (e.target.files != undefined) {

        var reader = new FileReader();

        reader.onload = function (f) {

            $('#BtnImportarActividadPR').removeClass('hidden');
        };
        reader.readAsDataURL(e.target.files.item(0));
    }

});


$(document).on('click', '#BtnImportarActividadPR', function (e) {


    ImportaArchivoPR();

    return false;
});

function ImportaArchivoPR() {
    var url = $('#urlImportaActividadesPR').val();

    var form_data = new FormData();
    form_data.append("Archivo", $("#FlImportaActividadesPR").prop("files")[0]);


    $.ajax({
        url: url,
        type: "POST",
        contentType: false,
        //dataType: "script",
        data: form_data,
        processData: false,
        async: false,
        success: function (Respuesta) {

            var Resultado = Respuesta.split('|');


            $('div.pg-loading-screen').remove();
            if (Resultado[0] == "E") {

               /* CargaActividades();*/
                MensajeExito(Resultado[1]);
            }
            else {
            /*    CargaActividades();*/
                MensajeAdvertencia(Resultado[1]);
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            var err = eval("(" + xhr.responseText + ")");
            MensajeError(err.Message);
        }
    });
}



var tablasEncabezado = {};
var tablasDetalle = {};
var dsEncabezado = [];
var dsEncabezadoReq = [];
var dsEncabezadoSprint = [];
var dsEncabezadoRecurso = [];
var dsDetalle;
var listaDetalle = [];
var dsActividadesProyecto = [];
var tablaActividadesProyecto;
var primeravez = true;
var IdVisorAct = 1;


var tablasEncabezadoDep = {};
var tablasDetalleDep = {};
var dsEncabezadoDep = [];
var dsDetalleDep;
var listaDetalleDep = [];
var dsActividadesProyectoDep = [];
var tablaActividadesProyectoDe;
var primeravezDep = true;



var htmlTablaDetalle = "<div class='row table-responsive'>" +
    "<table id='@tabla@Detalle' class='table table-striped table-detail tablaDetalle'>" +
    "<thead>" +
    "<tr>" +
  /*  '<th style="width:10px;">Ver</th> ' +*/
    '<th>No.</th>' +
    '<th>Estatus</th>' +
    '<th width="100px">Nombre</th>' +
    '<th>Sprint</th>' +
    '<th>Asignado</th>' +
    '<th>Estimado</th>' +
    '<th>Asignado</th>' +
    '<th>Real</th>' +
    '<th>Fecha Inicio </th>' +
    '<th>Fecha Fin </th>' +
    '<th>Fecha Real</th>' +
    "</tr>" +
    "</thead>" +
    "</table>" +
    "</div>";

var htmlTablaDetalleDep = "<div class='row table-responsive'>" +
    "<table id='@tabla@Detalle' class='table table-striped table-detail tablaDetalleDep'>" +
    "<thead>" +
    "<tr>" +
    '<th style="width:10px;">Ver</th> ' +
    '<th>No.</th>' +
    '<th>Estatus</th>' +
    '<th width="100px">Descripción</th>' +
    '<th>Asignado</th>' +
    '<th>Fase</th>' +
    '<th>Horas Fact</th>' +
    '<th>Horas Asign</th>' +
    '<th>Horas Real</th>' +
    '<th>Fecha Inicio Plan</th>' +
    '<th>Fecha Fin Plan</th>' +

    "</tr>" +
    "</thead>" +
    "</table>" +
    "</div>";

var columnasEncActividadesProyecto = [
    {
        "data": "TipoActividadId",
        "visible": false
    },
    {
        "data": "ClaveTipoActividad",
        "visible": false
    },
    {
        "class": "text-center",
        "render": function (data, type, row) {
            return "<button type='button' class='btn btn-default details-control' title='Ver detalle' ><i class='fa fa-plus'></i></button>"
        }
    },

    {
        "data": "TipoActividadStr",
        "class": "text-left",
    },

    {
        "data": "HorasFacturables",
        "class": "text-right",
    },
    {
        "data": "HorasAsignadas",
        "class": "text-right sum",
    },
    {

        "class": "text-right sum",
        "render": function (data, type, row) {

            if (row.HorasFinales > row.HorasAsignadas) {

                return ' <span class="btn btn-danger btn-small btnCapturaTrabajo"  style="width:100%;text-align:right;">' + $.number(row.HorasFinales, '2', '.', ',') + '</span>';

            }
            else {
                return ' <span class="btn btn-success btn-small btnCapturaTrabajo" style="width:100%;text-align:right;">' + $.number(row.HorasFinales, '2', '.', ',') + '</span>';

            }

        }

    },
    {
        "data": "FechaInicio",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))
        }
    },

    {
        "data": "FechaFin",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))
        }
    }
];
//var columnasEncActividadesDep = [

//    {
//        "class": "text-center",
//        "render": function (data, type, row) {
//            return "<button type='button' class='btn btn-success details-control' title='Ver timeline' ><i class='fa fa-plus'></i></button>"
//        }
//    },
//    {
//        "class": "text-center",
//        "render": function (data, type, row) {

//            return ' <a class="btn btn-default btn-small fa fa-list-alt " onclick="clickalerta(' + row.IdActividad + ' )"></a>';
//        }
//    },

//    {
//        "data": "IdActividad",
//        "class": "text-center",
//    },
//    {
//        "data": "Estatus",
//        "class": "text-left",
//        "render": function (data, type, row) {

//            if (data == 'A') {

//                return '<span  class="btn btn-small Open" style="text-align:left; width:100%;">Abierto </span>';

//            }
//            else if (data == 'P') {
//                return '<span class="btn btn-small Progress" style="text-align:left;width:100%;">Progreso </span>';

//            }
//            else if (data == 'R') {
//                return '<span class="btn btn-small Validation" style="text-align:left;width:100%;;">Revisión </span>';

//            }
//            else if (data == 'V') {
//                return '<span class="btn btn-small Validation" style="text-align:left;width:100%;;">Validación</span>';

//            }
//            else if (data == 'X') {
//                return '<span class="btn btn-small Rejected" style="text-align:left;width:100%;"> Rechazada </span>';

//            }
//            else if (data == 'C') {
//                return '<span class="btn btn-small Cancelled" style="text-align:left;width:100%;"> Cancelada </span>';

//            }
//            else if (data == 'L') {
//                return '<span class="btn btn-small Done" style="text-align:left;width:100%;">Liberada</span>';

//            }

//        }
//    },

//    {
//        "width": "40%",
//        "data": "Descripcion",
//        "class": "text-left",
//    },
//    {
//        "data": "ResponsableStr",
//        "class": "text-left",
//    },
//    {
//        "data": "ClaveTipoActividad",
//        "class": "text-left",
//    },
//    {
//        "data": "HorasFacturables",
//        "class": "text-right",
//    },
//    {
//        "data": "HorasAsignadas",
//        "class": "text-right sum",
//    },
//    {

//        "class": "text-right sum",
//        "render": function (data, type, row) {

//            if (row.HorasFinales > row.HorasAsignadas) {

//                return ' <a class="btn btn-danger btn-small " cta="' + row.ClaveTipoActividad + '"  style="width:100%;text-align:right;">' + $.number(row.HorasFinales, '2', '.', ',') + '</a>';

//            }
//            else {
//                return ' <a class="btn btn-info btn-small " cta="' + row.ClaveTipoActividad + '" style="width:100%;text-align:right;">' + $.number(row.HorasFinales, '2', '.', ',') + '</a>';

//            }

//        }

//    },
//    {
//        "data": "FechaInicio",
//        "class": "text-center",
//        "render": function (data, type, row) {
//            return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))
//        }
//    },

//    {
//        "data": "FechaSolicitado",
//        "class": "text-center",
//        "render": function (data, type, row) {
//            return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))

//        }
//    },

//    {
//        "width": "10%",
//        "render": function (data, type, row) {


//            if (row.AvanceDependencia == 100) {
//                return '<div class="progress"> ' +
//                    '<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="' + row.AvanceDependencia + ' " aria-valuemin="0" aria-valuemax="100" style="width: 100%"> ' +
//                    row.DependenciasT + "/" + row.DependenciasA +
//                    '</div>' +
//                    '</div>';
//            }
//            else if (row.AvanceDependencia == 0) {
//                return '<div class="progress"> ' +
//                    '<div class="progress-bar" style="color:black;" role="progressbar" aria-valuenow="' + row.AvanceDependencia + ' " aria-valuemin="0" aria-valuemax="100" > ' +
//                    row.DependenciasT + "/" + row.DependenciasA +
//                    '</div>' +
//                    '</div>';
//            }
//            else if (row.AvanceDependencia > 0 && row.AvanceDependencia < 70) {
//                return '<div class="progress"> ' +
//                    '<div class="progress-bar progress-bar-warning"  role="progressbar" aria-valuenow="' + row.AvanceDependencia + ' " aria-valuemin="0" aria-valuemax="100" style="width:' + row.AvanceDependencia + '%"> ' +
//                    row.DependenciasT + "/" + row.DependenciasA +
//                    '</div>' +
//                    '</div>';
//            }
//            else if (row.AvanceDependencia >= 70 && row.AvanceDependencia < 100) {
//                return '<div class="progress"> ' +
//                    '<div class="progress-bar progress-bar-info"  role="progressbar" aria-valuenow="' + row.AvanceDependencia + ' " aria-valuemin="0" aria-valuemax="100" style="width:' + row.AvanceDependencia + '%"> ' +
//                    row.DependenciasT + "/" + row.DependenciasA +
//                    '</div>' +
//                    '</div>';
//            }


//            //return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))
//        }
//    }
//];

//var columnasDetActividadesDep = [


//    {
//        "class": "text-center",
//        "render": function (data, type, row) {

//            return ' <a class="btn btn-default btn-small fa fa-list-alt " onclick="clickalerta(' + row.IdActividad + ' )"></a>';
//        }
//    },

//    {
//        "data": "IdActividad",
//        "class": "text-center",
//    },
//    {
//        "data": "Estatus",
//        "class": "text-left",
//        "render": function (data, type, row) {

//            if (data == 'A') {

//                return '<span  class="btn btn-small Open" style="text-align:left; width:100%;">Abierto </span>';

//            }
//            else if (data == 'P') {
//                return '<span class="btn btn-small Progress" style="text-align:left;width:100%;">Progreso </span>';

//            }
//            else if (data == 'R') {
//                return '<span class="btn btn-small Validation" style="text-align:left;width:100%;;">Revisión </span>';

//            }
//            else if (data == 'V') {
//                return '<span class="btn btn-small Validation" style="text-align:left;width:100%;;">Validación</span>';

//            }
//            else if (data == 'X') {
//                return '<span class="btn btn-small Rejected" style="text-align:left;width:100%;"> Rechazada </span>';

//            }
//            else if (data == 'C') {
//                return '<span class="btn btn-small Cancelled" style="text-align:left;width:100%;"> Cancelada </span>';

//            }
//            else if (data == 'L') {
//                return '<span class="btn btn-small Done" style="text-align:left;width:100%;">Liberada</span>';

//            }

//        }
//    },

//    {
//        "width": "40%",
//        "data": "Descripcion",
//        "class": "text-left",
//    },
//    {
//        "data": "ResponsablePath",
//        "class": "text-center",
//        "render": data => `<img src="${data}" class="img-dt" style="width: 35px; height: 35px" />`
//    },
//    {
//        "data": "ClaveTipoActividad",
//        "class": "text-left",
//    },
//    {
//        "data": "HorasFacturables",
//        "class": "text-right",
//    },
//    {
//        "data": "HorasAsignadas",
//        "class": "text-right sum",
//    },
//    {

//        "class": "text-right sum",
//        "render": function (data, type, row) {

//            if (row.HorasFinales > row.HorasAsignadas) {

//                return ' <a class="btn btn-danger btn-small btnCapturaTrabajo" cta="' + row.ClaveTipoActividad + '"  style="width:100%;text-align:right;">' + $.number(row.HorasFinales, '2', '.', ',') + '</a>';

//            }
//            else {
//                return ' <a class="btn btn-info btn-small btnCapturaTrabajo" cta="' + row.ClaveTipoActividad + '" style="width:100%;text-align:right;">' + $.number(row.HorasFinales, '2', '.', ',') + '</a>';

//            }

//        }

//    },
//    {
//        "data": "FechaInicio",
//        "class": "text-center",
//        "render": function (data, type, row) {
//            return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))
//        }
//    },

//    {
//        "data": "FechaSolicitado",
//        "class": "text-center",
//        "render": function (data, type, row) {
//            return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))


//        }
//    },

//];
var columnasActividadesProyecto = [


    //{
    //    "data": "TipoUrl",
    //    "class": "text-center",
    //    "render": (data, _, row) => `<img src="${data}" class="img-dt" style="width: 35px; height: 35px" />`
    //},
    /*
                  {
                    "class": "text-center",
                    "render": function (data, type, row) {
                        if(row.EstatusCte == "P") {
                        return ' <button class="btn btn-success btn-small fa fa-check BtnEntregarAct" cta="'+ row.ClaveTipoActividad + '"></button>';
                        }
                        else {
                         return ' <button class="btn btn-danger btn-small fa fa-close BtnCancelarEnt" cta="'+ row.ClaveTipoActividad + '"></button>';
                        }
                    }
                },
                  {
                    "class": "text-center",
                    "render": function (data, type, row) {
                     if (row.EstatusCte == "L")
                     {
                     return '<button class="btn btn-danger btn-small fa fa-close BtnCancelarLib" cta="'+ row.ClaveTipoActividad + '"></button>';
                     }
                     else {
                         return '<button class="btn btn-success btn-small fa fa-check BtnLiberarAct" cta="'+ row.ClaveTipoActividad + '"></button>';
                     
                     }
                    }
                },
    */
    //{
    //    "data": "IdActividad",
    //    "class": "text-center",
    //    "render": (data, _, row) => `<button style="color: #337ab7" cta="${row.ClaveTipoActividad}" class="btn btn-link BtnVerActividad">${data}</button>`
    //},
    {
        "data": "IdActividad",
        "class": "text-center",
        //"render": function (data, type, row) {

        //    return '<a class="btn btn-default btn-small fa fa-list-alt " onclick="clickalerta(' + row.IdActividad + ' )">' + row.IdActividad + '</a>';
        //}

          "render": function (data, type, row) {
            return '<a style="cursor:pointer" href="#" onclick="clickalerta(' + row.IdActividad + ' )" >' + data + '</a>'
        }
    },


    {
        "data": "Estatus",
        "class": "text-left",
        "render": function (data, type, row) {

            if (data == 'A') {

                return '<span  class="btn btn-small Open" style="text-align:left; width:100%;">Abierto </span>';

            }
            else if (data == 'P') {
                return '<span class="btn btn-small Progress" style="text-align:left;width:100%;">Progreso </span>';

            }
            else if (data == 'R') {
                return '<span class="btn btn-small Validation" style="text-align:left;width:100%;;">Revisión </span>';

            }
            else if (data == 'V') {
                return '<span class="btn btn-small Validation" style="text-align:left;width:100%;;">Validación</span>';

            }
            else if (data == 'X') {
                return '<span class="btn btn-small Rejected" style="text-align:left;width:100%;"> Rechazada </span>';

            }
            else if (data == 'C') {
                return '<span class="btn btn-small Cancelled" style="text-align:left;width:100%;"> Cancelada </span>';

            }
            else if (data == 'L') {
                return '<span class="btn btn-small Done" style="text-align:left;width:100%;">Liberada</span>';

            }

        }
    },

    //  {
    //     "data": "EstatusStr",
    //     "class": "text-center",
    // },
    //  {
    //    "data": "EstatusCteStr",
    //    "class": "text-center",
    // },
    //{
    //   "data": "PrioridadStr",
    //   "class": "text-left",
    //},
    {
        "width": "40%",
        "data": "BR",
        "class": "text-left",
    },

    //{
    //    "data": "ClaveTipoActividad",
    //    "class": "text-left",
    //},
    {
        "data": "Sprint",
        "class": "text-left",
    },
    {
        "data": "AsignadoPath",
        "class": "text-center",
        "render": data => `<img src="${data}" class="img-dt" style="width: 35px; height: 35px" />`
    },
    //{
    //    "data": "ClasificacionStr",
    //    "class": "text-left",
    //},
    //{
    //    "data": "ResponsableStr",
    //    "class": "text-left",
    //},
    {
        "data": "HorasFacturables",
        "class": "text-right",
    },
    {
        "data": "HorasAsignadas",
        "class": "text-right sum",
    },
    {

        "class": "text-right sum",
        "render": function (data, type, row) {

            if (row.HorasFinales > row.HorasAsignadas) {

                return ' <button class="btn btn-danger btn-small btnCapturaTrabajo" cta="' + row.ClaveTipoActividad + '"  style="width:100%;text-align:right;">' + $.number(row.HorasFinales, '2', '.', ',') + '</button>';

            }
            else {
                return ' <button class="btn btn-success btn-small btnCapturaTrabajo" cta="' + row.ClaveTipoActividad + '" style="width:100%;text-align:right;">' + $.number(row.HorasFinales, '2', '.', ',') + '</button>';

            }

        }

    },
    {
        "data": "FechaInicio",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))
        }
    },

    {
        "data": "FechaSolicitado",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))
        }
    },
    {
        "data": "FechaTermino",
        "class": "text-center",
        "render": function (data, type, row) {

            if (data == null || data == "") {
                return "";
            }
            else {
                if (moment(row.FechaTermino) > moment(row.FechaSolicitado)) {
                    return ' <span class="btn btn-danger btn-small" style="width:100%;text-align:right;">' + moment(data).format("DD/MM/YYYY") + '</span>';
                }
                else {
                    return moment(data).format("DD/MM/YYYY");
                }
            }
            //return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))
        }
    },
    {
        "data": "MotivoRechazoId",
        "visible": false
    },
    {
        "data": "DescripcionRechazo",
        "visible": false
    }
];
function inicializaTablaEnc(nombreTabla, datos) {
    tablasEncabezado[nombreTabla] = $("#" + nombreTabla).dataTable({
        language: lenguajeEs,
        responsive: true,
        searching: true,
        "bSort": true,
        search: {
            smart: false
        },
        "bAutoWidth": false,
        "bLengthChange": true,
        "bPaginate": false,
        destroy: true,
        data: datos,
        columns: columnasEncActividadesProyecto,
        "order": [[1, 'asc']],

    });

    $('#' + nombreTabla + ' tbody').on('click', '.details-control', function () {
        filaPadre = $(this).closest('tr');

        var row = tablasEncabezado[nombreTabla].api().row(filaPadre); //table.row(tr);

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            filaPadre.removeClass('shown');
            $("i", this).removeClass("fa-minus");
            $("i", this).addClass("fa-plus");
        }
        else {
            $("i", this).removeClass("fa-plus");
            $("i", this).addClass("fa-minus");

            // Open this row
            row.child(format(row.data(), nombreTabla)).show();

            tablasDetalle[nombreTabla + row.data().ClaveTipoActividad] = $("." + nombreTabla + row.data().ClaveTipoActividad).dataTable({
                responsive: true,
                "bSort": false,
                "bPaginate": false,
                "searching": false,
                "autoWidth": true,
                "bLengthChange": true,
                destroy: true,
                data: dsDetalle,
                columns: columnasActividadesProyecto,
                //"order": [[1, 'asc']],
                //createdRow: function (row, data, dataIndex) {
                //    $(row).find('td:eq(0)').attr('data-name', 'Descripcion');
                //    $(row).find('td:eq(1)').attr('data-name', 'FechaHora');
                //    $(row).find('td:eq(2)').attr('data-name', 'UsuarioStr');
                //    $(row).find('td:eq(3)').attr('data-name', 'IdActividad');
                //    $(row).find('td:eq(4)').attr('data-name', 'IdActividadLog');
                //},

            });



            filaPadre.addClass('shown');
        }
    });


}
function refrescaTablaAct() {
    tablasEncabezado['TblActividadesP'].api().clear().rows.add(dsEncabezado).draw();
}
function format(d, nombreTabla) {
    var htmlDetalle = '';


    if (IdVisorAct == 1) {
        dsDetalle = $.grep(listaDetalle, function (a, b) {
            return a.ClaveTipoActividad === d.ClaveTipoActividad;
        });

        htmlDetalle = htmlTablaDetalle.replace('@tabla', nombreTabla + d.ClaveTipoActividad);
        htmlDetalle = htmlDetalle.replace('tablaDetalle', nombreTabla + d.ClaveTipoActividad);
    }
    else if (IdVisorAct == 2) {
        dsDetalle = $.grep(listaDetalle, function (a, b) {
            return a.IdActividadD === d.IdActividadD;
        });

        htmlDetalle = htmlTablaDetalle.replace('@tabla', nombreTabla + d.IdActividadD);
        htmlDetalle = htmlDetalle.replace('tablaDetalle', nombreTabla + d.IdActividadD);

    }
    else if (IdVisorAct == 3) {
        dsDetalle = $.grep(listaDetalle, function (a, b) {
            return a.IdIteracion === d.IdIteracion;
        });

        htmlDetalle = htmlTablaDetalle.replace('@tabla', nombreTabla + d.IdIteracion);
        htmlDetalle = htmlDetalle.replace('tablaDetalle', nombreTabla + d.IdIteracion);

    }
    else if (IdVisorAct == 4) {
        dsDetalle = $.grep(listaDetalle, function (a, b) {
            return a.IdUsuarioAsignado === d.IdUsuarioAsignado;
        });

        htmlDetalle = htmlTablaDetalle.replace('@tabla', nombreTabla + d.IdUsuarioAsignado);
        htmlDetalle = htmlDetalle.replace('tablaDetalle', nombreTabla + d.IdUsuarioAsignado);

    }


    //auxOc = d.Oc;
    return htmlDetalle;

}
//function inicializaTablaEncDep(nombreTabla, datos) {
//    tablasEncabezadoDep[nombreTabla] = $("#" + nombreTabla).dataTable({
//        language: lenguajeEs,
//        responsive: true,
//        searching: true,
//        "bSort": true,
//        search: {
//            smart: false
//        },
//        "bAutoWidth": false,
//        "bLengthChange": true,
//        "bPaginate": false,
//        destroy: true,
//        data: datos,
//        columns: columnasEncActividadesDep,
//        "order": [[1, 'asc']],

//    });

//    $('#' + nombreTabla + ' tbody').on('click', '.details-control', function () {
//        filaPadre = $(this).closest('tr');

//        var row = tablasEncabezadoDep[nombreTabla].api().row(filaPadre); //table.row(tr);

//        if (row.child.isShown()) {
//            // This row is already open - close it
//            row.child.hide();
//            filaPadre.removeClass('shown');
//            $("i", this).removeClass("fa-minus");
//            $("i", this).addClass("fa-plus");
//        }
//        else {
//            $("i", this).removeClass("fa-plus");
//            $("i", this).addClass("fa-minus");

//            // Open this row
//            row.child(formatDep(row.data(), nombreTabla)).show();

//            tablasDetalleDep[nombreTabla + row.data().IdActividad] = $("." + nombreTabla + row.data().IdActividad).dataTable({
//                responsive: true,
//                "bSort": false,
//                "bPaginate": false,
//                "searching": false,
//                "autoWidth": true,
//                "bLengthChange": true,
//                destroy: true,
//                data: dsDetalleDep,
//                columns: columnasDetActividadesDep,


//            });



//            filaPadre.addClass('shown');
//        }
//    });


//}
//function formatDep(d, nombreTabla) {
//    var htmlDetalle = '';


//    dsDetalleDep = $.grep(listaDetalleDep, function (a, b) {
//        return a.IdActividad === d.IdActividad;
//    });

//    htmlDetalle = htmlTablaDetalleDep.replace('@tabla', nombreTabla + d.IdActividad);
//    htmlDetalle = htmlDetalle.replace('tablaDetalleDep', nombreTabla + d.IdActividad);

//    //auxOc = d.Oc;
//    return htmlDetalle;

//}
//function InicializaActividades() {


//    $('#TxtFechaAIF,#TxtFechaAFF,#TxtFechaSIF,#TxtFechaSFF,#TxtFechaCIF,#TxtFechaCFF').datetimepicker(
//        {
//            format: 'DD/MM/YYYY'
//        });

//  /*  CargaCombosFiltros();*/
///*    CargaActividadesProyecto();*/
//    $("#divDependencias").hide();


//}

//function CargaCombosFiltros() {

//    var url = $('#urlCargaInicialCombosF').val();

//    $.ajax({

//        url: url,
//        type: "POST",
//        data: JSON.stringify({ IdProyecto: $('#IdProyecto').val() }),
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        async: false,
//        success: function (data) {

//            if (data.Exito) {

//                //$('#SelProyectoF').empty();
//                //$('#SelProyectoF').append(data.LstProyectos);

//                $('#SelActividadF').empty();
//                $('#SelActividadF').append(data.LstTipoAct);

//                $('#SelUsuarioAsignadoF').empty();
//                $('#SelUsuarioAsignadoF').append(data.LstUsuarios);

//                $('#SelResponsableF').empty();
//                $('#SelResponsableF').append(data.LstLideres);

//                $('#SelClasificacionF').empty();
//                $('#SelClasificacionF').append(data.LstClasificacion);

//                $('#SelSprintF').empty();
//                $('#SelSprintF').append(data.LstSprints);

//                //TipoUsuarioPan = data.TipoUsuario;
//                //UsuarioPan = data.Usuario;

//            }
//            else {

//                MensajeAdvertencia(data.Mensaje);
//            }

//        },
//        error: function (xmlHttpRequest, textStatus, errorThrown) {

//            MensajeError("Ha ocurrido un error inesperado, por favor vuelva a intentarlo.");
//        }
//    });
//    return false;
//}

//$(document).on('click', '#BtnFiltrar', function (e) {

//    CargaActividadesProyecto();

//    return false;

//});



//function CargaActividadesProyecto() {
//    $("#divDependencias").hide();
//    var url = $('#urlCargaActividadesProyecto').val();

//    var fechacreoini = ObtieneFecha($('#TxtFechaAIF').val().trim());
//    var fechacreofin = ObtieneFecha($('#TxtFechaAFF').val().trim());
//    var fechasolini = ObtieneFecha($('#TxtFechaSIF').val().trim());
//    var fechasolfin = ObtieneFecha($('#TxtFechaSFF').val().trim());
//    var fechacierreini = ObtieneFecha($('#TxtFechaCIF').val().trim());
//    var fechacierrefin = ObtieneFecha($('#TxtFechaCFF').val().trim());

//    var datosBuscar = {

//        FechaCreoIni: fechacreoini,
//        FechaCreoFin: fechacreofin,
//        FechaSolIni: fechasolini,
//        FechaSolFin: fechasolfin,
//        FechaCierreIni: fechacierreini,
//        FechaCierreFin: fechacierrefin,
//        LstTipoActividad: $('#SelActividadF').val(),
//        LstClasificacion: $('#SelClasificacionF').val(),
//        LstAsignado: $('#SelUsuarioAsignadoF').val(),
//        LstResponsable: $('#SelResponsableF').val(),
//        LstSprints: $('#SelSprintF').val(),
//        LstPrioridad: $('#SelPrioridadF').val(),
//        LstEstatus: $('#SelEstatusF').val(),
//        Actividades: $('#TxtActividadF').val(),
//        IdProyecto: $('#IdProyecto').val()
//    }



//    $.ajax({

//        url: url,
//        type: "POST",
//        contentType: "application/json; charset=utf-8",
//        data: JSON.stringify(datosBuscar),
//        dataType: "json",
//        async: true,
//        success: successCargaActividadesProyecto,
//        error: function (xmlHttpRequest, textStatus, errorThrown) {

//            MensajeError(data.Mensaje);
//        }
//    });
//    return false;

//}


//function successCargaActividadesProyecto(data) {
//    if (data.Exito) {

//        dsEncabezadoReq = jQuery.parseJSON(data.ActividadesReq);
//        dsEncabezadoSprint = jQuery.parseJSON(data.ActividadesSprint);
//        dsEncabezadoRecurso = jQuery.parseJSON(data.ActividadesRecurso);
//        dsEncabezado = jQuery.parseJSON(data.ActividadesEnc);
//        listaDetalle = jQuery.parseJSON(data.Actividades);

//        $("#BtnVerFases").removeClass("btn-default");
//        $("#BtnVerFases").addClass("btn-info");

//        $("#BtnVerRequerimientos").removeClass("btn-info");
//        $("#BtnVerRequerimientos").addClass("btn-default");
//        $("#BtnVerSprint").removeClass("btn-info");
//        $("#BtnVerSprint").addClass("btn-default");
//        $("#BtnVerRecursos").removeClass("btn-info");
//        $("#BtnVerRecursos").addClass("btn-default");
//        IdVisorAct = 1;
//        //dsActividadesProyecto = jQuery.parseJSON(data.Actividades);
//        ActualizaTablaExportar(data.Actividades);
//        if (primeravez) {
//            inicializaTablaEnc('TblActividadesP', dsEncabezado);
//        }
//        else {
//            refrescaTablaAct();
//        }
//        primeravez = false;

//        $('div.pg-loading-screen').remove();
//        page_content_onresize();
//    }
//    else {

//        MensajeError(data.Mensaje);

//    }
//}

//function CargaActividadesDependencias() {

//    var url = $('#urlObtieneDependencias').val();



//    var datosBuscar = {
//        IdProyecto: $('#IdProyecto').val()
//    }



//    $.ajax({

//        url: url,
//        type: "POST",
//        contentType: "application/json; charset=utf-8",
//        //data: JSON.stringify({ IdProyecto: $('#IdProyecto').val() }),
//        data: JSON.stringify(datosBuscar),
//        dataType: "json",
//        async: true,
//        success: successCargaActividadesProyectoDep,
//        error: function (xmlHttpRequest, textStatus, errorThrown) {

//            MensajeError(data.Mensaje);
//        }
//    });
//    return false;

//}


//function successCargaActividadesProyectoDep(data) {
//    if (data.Exito) {

//        dsEncabezadoDep = jQuery.parseJSON(data.LstEnc);
//        listaDetalleDep = jQuery.parseJSON(data.LstDet);

//        //dsActividadesProyecto = jQuery.parseJSON(data.Actividades);
//        ActualizaTablaDepExportar();
//        if (primeravezDep) {
//            inicializaTablaEncDep('TblActividadesDependencias', dsEncabezadoDep);
//        }
//        else {
//            refrescaTablaActDep();
//        }
//        primeravezDep = false;

//        $('div.pg-loading-screen').remove();
//        page_content_onresize();
//    }
//    else {

//        MensajeError(data.Mensaje);

//    }
//}

//$(document).on('click', '.BtnVerActividad', function (e) {
//    e.preventDefault();

//    var CTA = $(this).attr('cta');
//    var filaPadre = $(this).closest('tr');
//    var row = tablasDetalle["TblActividadesP" + CTA].api().row(filaPadre);
//    //var row = tablaActividadesProyecto.api().row(filaPadre);
//    var datosFila = row.data();
//    var Actividad = datosFila.IdActividad;

//    $('#TituloActividades').text("Actividad #" + Actividad);
//    $('#IdActividad').val(Actividad);
//    $('#ModalActividades').on('hidden.bs.modal', function () {
//        CargaActividades();
//    });

//    $('#ModalActividades').modal({ keyboard: false });
//    InicializaEdicionActividad();

//    return false;

//});

//$("#BtnNuevaActividadP").click(function () {


//    $('#ModalActividades').on('hidden.bs.modal', function () {
//        CargaActividadesProyecto();
//    });
//    $('#ModalActividades').modal({ keyboard: false });
//    $('#TituloActividades').text("Captura de Actividad");
//    $('#IdProyectoAct').val($('#IdProyecto').val());
//    InicializaAltaActividades();

//    return false;

//});

//$(document).on('click', '.BtnEntregarAct', function (e) {

//    var CTA = $(this).attr('cta');
//    var filaPadre = $(this).closest('tr');
//    var row = tablasDetalle["TblActividadesP" + CTA].api().row(filaPadre);
//    var datosFila = row.data();


//    var IdActividad = datosFila.IdActividad;


//    ActualizarEstatusCte(IdActividad, "E");

//    row.cell(row[0], 5).data("Entregada").draw();
//    $(this).removeClass("btn-success");
//    $(this).removeClass("fa fa-check");
//    $(this).removeClass("BtnEntregarAct");
//    $(this).addClass("btn-danger");
//    $(this).addClass("fa fa-close");
//    $(this).addClass("BtnCancelarEnt");

//    return false;

//});

//$(document).on('click', '.BtnLiberarAct', function (e) {

//    var CTA = $(this).attr('cta');
//    var filaPadre = $(this).closest('tr');
//    var row = tablasDetalle["TblActividadesP" + CTA].api().row(filaPadre);
//    var datosFila = row.data();

//    var IdActividad = datosFila.IdActividad;

//    row.cell(row[0], 5).data("Liberada").draw();
//    $(this).removeClass("btn-success");
//    $(this).removeClass("fa fa-check");
//    $(this).removeClass("BtnLiberarAct");
//    $(this).addClass("btn-danger");
//    $(this).addClass("fa fa-close");
//    $(this).addClass("BtnCancelarLib");

//    ActualizarEstatusCte(IdActividad, "L");




//    return false;

//});

//$(document).on('click', '.BtnCancelarEnt', function (e) {

//    var CTA = $(this).attr('cta');
//    var filaPadre = $(this).closest('tr');
//    var row = tablasDetalle["TblActividadesP" + CTA].api().row(filaPadre);
//    var datosFila = row.data();

//    var IdActividad = datosFila.IdActividad;
//    row.cell(row[0], 5).data("Pendiente").draw();

//    ActualizarEstatusCte(IdActividad, "XE");



//    $(this).removeClass("btn-danger");
//    $(this).removeClass("fa fa-close");
//    $(this).removeClass("BtnCancelarEnt");
//    $(this).addClass("btn-success");
//    $(this).addClass("fa fa-check");
//    $(this).addClass("BtnEntregarAct");




//    return false;

//});

//$(document).on('click', '.BtnCancelarLib', function (e) {

//    var CTA = $(this).attr('cta');
//    var filaPadre = $(this).closest('tr');
//    var row = tablasDetalle["TblActividadesP" + CTA].api().row(filaPadre);
//    var datosFila = row.data();

//    var IdActividad = datosFila.IdActividad;
//    row.cell(row[0], 5).data("Entregada").draw();


//    ActualizarEstatusCte(IdActividad, "XL");


//    $(this).removeClass("btn-danger");
//    $(this).removeClass("fa fa-close");
//    $(this).removeClass("BtnCancelarLib");

//    $(this).addClass("btn-success");
//    $(this).addClass("fa fa-check");
//    $(this).addClass("BtnLiberarAct");

//    return false;

//});

//function ActualizarEstatusCte(IdActividad, Estatus) {

//    var url = $('#urlActualizaEstatusActividadCte').val();
//    var Actividad = {
//        IdActividad: IdActividad,
//        EstatusCte: Estatus
//    };


//    $.ajax({

//        url: url,
//        type: "POST",
//        contentType: "application/json; charset=utf-8",
//        data: JSON.stringify({ Actividad: Actividad }),
//        dataType: "json",
//        async: true,
//        success: successActualizarEstatusCte,
//        error: function (xmlHttpRequest, textStatus, errorThrown) {

//            MensajeError(data.Mensaje);
//        }
//    });
//    return false;

//}

//function successActualizarEstatusCte(data) {
//    if (!data.Exito) {
//        MensajeError(data.Mensaje);
//    }
//}

//$("#BtnImportarAct").click(function () {

//    $("#FlImportaActividades").parent().next().text("");
//    $("#FlImportaActividades").val("");
//    $('#BtnImportarActividad').addClass('hidden');
//    $('#ModalImportarActividades').modal({ keyboard: false });

//    return false;

//});
//$(document).on("change", "#FlImportaActividades", function (e) {
//    $("#FlImportaActividades").parent().next().next().text("");



//    if (e.target.files != undefined) {

//        var reader = new FileReader();

//        reader.onload = function (f) {

//            $('#BtnImportarActividad').removeClass('hidden');
//        };
//        reader.readAsDataURL(e.target.files.item(0));
//    }

//});

//$(document).on('click', '#BtnImportarActividad', function (e) {


//    ImportaArchivo();

//    return false;
//});

//function ImportaArchivo() {
//    var url = $('#urlImportaActividades').val();

//    var form_data = new FormData();
//    form_data.append("Archivo", $("#FlImportaActividades").prop("files")[0]);
//    form_data.append("Tipo", $('input:radio[name=TipoCarga]:checked').val());

//    $.ajax({
//        url: url,
//        type: "POST",
//        contentType: false,
//        //dataType: "script",
//        data: form_data,
//        processData: false,
//        async: false,
//        success: function (Respuesta) {

//            var Resultado = Respuesta.split('|');


//            $('div.pg-loading-screen').remove();
//            if (Resultado[0] == "E") {

//                CargaActividadesProyecto();
//                MensajeExito(Resultado[1]);
//            }
//            else {
//                CargaActividadesProyecto();
//                MensajeAdvertencia(Resultado[1]);
//            }

//        },
//        error: function (xhr, textStatus, errorThrown) {
//            var err = eval("(" + xhr.responseText + ")");
//            MensajeError(err.Message);
//        }
//    });
//}

//function ActualizaTablaDepExportar() {

//    /*
//        dsEncabezadoDep = jQuery.parseJSON(data.LstEnc);
//        listaDetalleDep = jQuery.parseJSON(data.LstDet);
//    */
//    $('#TblActividadesDependenciasExportar tbody').html('');

//    for (var i in dsEncabezadoDep) {


//        rows = "<tr>"
//            + "<td class='text-right'>" + dsEncabezadoDep[i].IdActividad + "</td>"
//            + "<td class='text-left'>" + dsEncabezadoDep[i].Estatus + "</td>"
//            + "<td class='text-left'>" + dsEncabezadoDep[i].Descripcion + "</td>"
//            + "<td class='text-left'>" + dsEncabezadoDep[i].ResponsableStr + "</td>"
//            + "<td class='text-left'>" + dsEncabezadoDep[i].ClaveTipoActividad + "</td>"
//            + "<td class='text-right'>" + dsEncabezadoDep[i].HorasFacturables + "</td>"
//            + "<td class='text-right'>" + dsEncabezadoDep[i].HorasAsignadas + "</td>"
//            + "<td class='text-right'>" + dsEncabezadoDep[i].HorasFinales + "</td>"
//            + "<td class='text-center'>" + moment(dsEncabezadoDep[i].FechaInicio).format("DD/MM/YYYY") + "</td>"
//            + "<td class='text-center'>" + moment(dsEncabezadoDep[i].FechaSolicitado).format("DD/MM/YYYY") + "</td>"
//            + "<td class='text-center'> '" + dsEncabezadoDep[i].DependenciasT + "/" + dsEncabezadoDep[i].DependenciasA + "</td>"
//            + "</tr>"
//            + "<tr>"
//            + "<td></td>"
//            + "<td><b>No.</b></td>"
//            + "<td>Estatus</td>"
//            + "<td>Descripción</td>"
//            + "<td>Asignado</td>"
//            + "<td>Fase</td>"
//            + "<td>Horas Estimadas</td>"
//            + "<td>Horas Asign</td>"
//            + "<td>Horas Real</td>"
//            + "<td>Fecha inicio plan</td>"
//            + "<td>Fecha fin plan</td>"
//            + "</tr>"
//            ;

//        $("#TblActividadesDependenciasExportar tbody").append(rows);

//        for (var j in listaDetalleDep) {


//            rowsdet = "<tr>"
//                + "<td></td>"
//                + "<td class='text-right'>" + listaDetalleDep[j].IdActividad + "</td>"
//                + "<td class='text-left'>" + listaDetalleDep[j].Estatus + "</td>"
//                + "<td class='text-left'>" + listaDetalleDep[j].Descripcion + "</td>"
//                + "<td class='text-left'>" + listaDetalleDep[j].ResponsableStr + "</td>"
//                + "<td class='text-left'>" + listaDetalleDep[j].ClaveTipoActividad + "</td>"
//                + "<td class='text-right'>" + listaDetalleDep[j].HorasFacturables + "</td>"
//                + "<td class='text-right'>" + listaDetalleDep[j].HorasAsignadas + "</td>"
//                + "<td class='text-right'>" + listaDetalleDep[j].HorasFinales + "</td>"
//                + "<td class='text-center'>" + moment(listaDetalleDep[j].FechaInicio).format("DD/MM/YYYY") + "</td>"
//                + "<td class='text-center'>" + moment(listaDetalleDep[j].FechaSolicitado).format("DD/MM/YYYY") + "</td>"
//                + "</tr>";


//            $("#TblActividadesDependenciasExportar tbody").append(rowsdet);
//        }




//    }


//}

//function ActualizaTablaExportar(data) {

//    var dsExportar = jQuery.parseJSON(data);


//    $('#TblActividadesExportar tbody').html('');

//    for (var i in dsExportar) {


//        rows = "<tr>"
//            + "<td class='text-right'>" + dsExportar[i].IdActividad + "</td>"
//            + "<td class='text-left'>" + dsExportar[i].BR + "</td>"
//            + "<td class='text-center'>" + dsExportar[i].ClaveUsuario + "</td>"
//            + "<td class='text-center'>" + dsExportar[i].ClaveTipoActividad + "</td>"
//            + "<td class='text-center'>" + dsExportar[i].ClaveClasificacionActividad + "</td>"
//            + "<td class='text-center'>" + dsExportar[i].Descripcion + "</td>"
//            + "<td class='text-center'>" + dsExportar[i].TipoNombre + "</td>"
//            + "<td class='text-center'>" + dsExportar[i].HorasFacturables + "</td>"
//            + "<td class='text-center'>" + dsExportar[i].HorasAsignadas + "</td>"
//            + "<td class='text-right'>" + moment(dsExportar[i].FechaInicio).format("DD/MM/YYYY") + "</td>"
//            + "<td class='text-center'>" + moment(dsExportar[i].FechaSolicitado).format("DD/MM/YYYY") + "</td>"
//            + "</tr>";
//        $("#TblActividadesExportar tbody").append(rows);
//    }


//}
//$(document).on('click', '#BtnVerActividades', function (e) {

//    $("#BtnVerActividades").removeClass("btn-default");
//    $("#BtnVerActividades").addClass("btn-info");

//    $("#BtnVerDependencias").removeClass("btn-info");
//    $("#BtnVerDependencias").addClass("btn-default");

//    $("#divActividades").show();
//    $("#divDependencias ").hide();



//    return false;
//});
//$(document).on('click', '#BtnVerDependencias', function (e) {

//    $("#BtnVerDependencias").removeClass("btn-default");
//    $("#BtnVerDependencias").addClass("btn-info");

//    $("#BtnVerActividades").removeClass("btn-info");
//    $("#BtnVerActividades").addClass("btn-default");

//    $("#divDependencias ").show();
//    $("#divActividades").hide();
//    CargaActividadesDependencias();


//    return false;
//});

$(document).on('click', '#BtnVerRequerimientos', function (e) {

    $("#BtnVerRequerimientos").removeClass("btn-default");
    $("#BtnVerRequerimientos").addClass("btn-info");

    $("#BtnVerFases").removeClass("btn-info");
    $("#BtnVerFases").addClass("btn-default");
    $("#BtnVerSprint").removeClass("btn-info");
    $("#BtnVerSprint").addClass("btn-default");
    $("#BtnVerRecursos").removeClass("btn-info");
    $("#BtnVerRecursos").addClass("btn-default");

    IdVisorAct = 2;
    tablasEncabezado['TblActividadesP'].api().clear().rows.add(dsEncabezadoReq).draw();

    return false;
});

$(document).on('click', '#BtnVerFases', function (e) {

    $("#BtnVerFases").removeClass("btn-default");
    $("#BtnVerFases").addClass("btn-info");

    $("#BtnVerRequerimientos").removeClass("btn-info");
    $("#BtnVerRequerimientos").addClass("btn-default");
    $("#BtnVerSprint").removeClass("btn-info");
    $("#BtnVerSprint").addClass("btn-default");
    $("#BtnVerRecursos").removeClass("btn-info");
    $("#BtnVerRecursos").addClass("btn-default");
    IdVisorAct = 1;

    tablasEncabezado['TblActividadesP'].api().clear().rows.add(dsEncabezado).draw();

    return false;
});

$(document).on('click', '#BtnVerSprint', function (e) {

    $("#BtnVerSprint").removeClass("btn-default");
    $("#BtnVerSprint").addClass("btn-info");

    $("#BtnVerRequerimientos").removeClass("btn-info");
    $("#BtnVerRequerimientos").addClass("btn-default");
    $("#BtnVerFases").removeClass("btn-info");
    $("#BtnVerFases").addClass("btn-default");
    $("#BtnVerRecursos").removeClass("btn-info");
    $("#BtnVerRecursos").addClass("btn-default");
    IdVisorAct = 3;
    tablasEncabezado['TblActividadesP'].api().clear().rows.add(dsEncabezadoSprint).draw();

    return false;
});
$(document).on('click', '#BtnVerRecursos', function (e) {

    $("#BtnVerRecursos").removeClass("btn-default");
    $("#BtnVerRecursos").addClass("btn-info");

    $("#BtnVerRequerimientos").removeClass("btn-info");
    $("#BtnVerRequerimientos").addClass("btn-default");
    $("#BtnVerFases").removeClass("btn-info");
    $("#BtnVerFases").addClass("btn-default");
    $("#BtnVerSprint").removeClass("btn-info");
    $("#BtnVerSprint").addClass("btn-default");
    IdVisorAct = 4;
    tablasEncabezado['TblActividadesP'].api().clear().rows.add(dsEncabezadoRecurso).draw();

    return false;
});



$(document).on('click', '.btnCapturaTrabajo', function (e) {

    var CTA = $(this).attr('cta');
    var filaPadre = $(this).closest('tr');
    var row = tablasDetalle["TblActividadesP" + CTA].api().row(filaPadre);
    var datosFila = row.data();


    CapturaTrabajo(datosFila.IdActividad, datosFila.Descripcion);


    return false;

});

function CapturaTrabajo(IdActividad, Descripcion) {

    $("#IdActividadCTra").val(IdActividad);
    $("#LblActividadDesc").text(IdActividad + "-" + Descripcion);
    var date = new Date();
    $('#TxtFechaTrab').datetimepicker(
        {
            format: 'DD/MM/YYYY',
            maxDate: date
        });
    $("#TxtTiempo").val("");
    $("#TxtComentarioTrabajo").val("");
    CargarTrabajos();
    $('#ModalCapturarTrabajo').on('hidden.bs.modal', function () {
        CargaActividadesProyecto();
        $(this).off('hidden.bs.modal');
    });
    $('#ModalCapturarTrabajo').modal({ backdrop: 'static', keyboard: false });

}
////#endregion

//#region Costos

//var dsCostoDirecto = [];
//var tablaCostoAplicado;
//var dsCostoPlaneado = [];
//var tablaCostoPlaneado;
//var dsCostoIndirecto = [];
//var tablaCostoIndirecto;
//var columnasCostoDirecto = [
//    {
//        "data": "IdProyectoCD",
//        "visible": false
//    },
//    {
//        "data": "Aplicado",
//        "class": "text-center",
//        "render": data => `<label class="switch switch-small"><input type="checkbox" class="chkAplicarCD" ${data ? "checked" : ""}/><span></span></label>`
//    },
//    //{
//    //    "class": "text-center",
//    //    "render": function (data, type, row) {

//    //        return ' <button class="btn btn-default btn-small fa fa-list-alt BtnVerCostoAplicado"></button>';
//    //    }
//    //},
//    {
//        "data": "TipoActividadId",
//        "class": "text-left",
//        "render": data => {
//            let html = `<select class="form-control selFaseCD">${fasesCD}</select>`;
//            const index = html.indexOf(`value='${data}'`);
//            if (index > 0) {
//                html = html.slice(0, index) + " selected " + html.slice(index);
//            }
//            return html;
//        }
//    },
//    {
//        "data": "Nombre",
//        "class": "text-left"
//    },
//    //{
//    //    "data": "Aplicado",
//    //    "class": "text-center",
//    //    "render": (data) => `<label style="width: 100%;" class="label label-${data ? 'success' : 'warning'}">${data ? 'Sí' : 'No'}</label>`
//    //},
//    {
//        "data": "FechaInicio",
//        "class": "text-center",
//        "render": function (data, type, row) {
//            return (row.FechaInicio == null || row.FechaInicio == "" ? "" : moment(row.FechaInicio).format("DD/MM/YYYY")) + " - " +
//                (row.FechaFin == null || row.FechaFin == "" ? "" : moment(row.FechaFin).format("DD/MM/YYYY"))
//        }
//    },
//    //{
//    //    "data": "Dias",
//    //    "class": "text-right"
//    //},
//    {
//        "data": "PorcDedicado",
//        "class": "text-right"
//    },
//    //{
//    //    "data": "HorasInvertidas",
//    //    "class": "text-right",
//    //    "render": function (data, type, row) {
//    //        return $.number(data, '2', '.', ',')
//    //    }
//    //},
//    {
//        "data": "CostoPeriodo",
//        "class": "text-right",
//        "render": function (data, type, row) {
//            return `<a class="BtnVerCostoAplicado">$  ${$.number(data, '2', '.', ',')}</a>`
//        }
//    }

//];
//var columnasCostoPlaneado = [
//    {
//        "data": "IdProyectoCD",
//        "visible": false
//    },
//    {
//        "class": "text-center",
//        "render": function (data, type, row) {

//            return ' <button class="btn btn-default btn-small fa fa-list-alt BtnVerCostoPlaneado"></button>';
//        }
//    },
//    {
//        "data": "TipoActividadId",
//        "class": "text-left",
//    },
//    {
//        "data": "Nombre",
//        "class": "text-left"
//    },

//    {
//        "data": "FechaInicio",
//        "class": "text-center",
//        "render": function (data, type, row) {
//            return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))
//        }
//    },
//    {
//        "data": "FechaFin",
//        "class": "text-center",
//        "render": function (data, type, row) {
//            return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))
//        }
//    },
//    {
//        "data": "Dias",
//        "class": "text-right"
//    },
//    {
//        "data": "PorcDedicado",
//        "class": "text-right"
//    },
//    {
//        "data": "HorasInvertidas",
//        "class": "text-right",
//        "render": function (data, type, row) {
//            return $.number(data, '2', '.', ',')
//        }
//    },
//    {
//        "data": "CostoPeriodo",
//        "class": "text-right",
//        "render": function (data, type, row) {
//            return $.number(data, '2', '.', ',')
//        }
//    }

//];

//var columnasCostoIndirecto = [
//    {
//        "data": "IdProyectoCI",
//        "visible": false
//    },
//    {
//        "class": "text-center",
//        "render": function (data, type, row) {

//            return ' <button class="btn btn-default btn-small fa fa-list-alt BtnVerCostoIndirecto"></button>';
//        }
//    },
//    {
//        "data": "Fase",
//        "class": "text-left"
//    },

//    {
//        "data": "Fecha",
//        "class": "text-center",
//        "render": function (data, type, row) {
//            return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))
//        }
//    },
//    {
//        "data": "Concepto",
//        "class": "text-left"
//    },
//    {
//        "data": "Monto",
//        "class": "text-right",
//        "render": function (data, type, row) {
//            return $.number(data, '2', '.', ',')
//        }
//    }

//];



$('#TxtParticipacionU').keypress(function (e) {
    if (e.which == 13) {
        $("#BtnGuardarParticipacionU").click();
        return false;
    }
    //else {

    //    e.preventDefault();
    //}

    //return false;
});

var dsCostoMes = [];
var tablaCosto;

var dsCostoDetalle = [];
var tablaCostoDetalle;


var columnasCostoMes = [
    {
        "data": "Mes",
        "class": "text-left",
        "render": function (data, type, row) {
           
            return '<a style="cursor:pointer" href="#" onclick="VerCostoMes(' + row.IdProyecto + "," + row.Mes + "," + row.Anio + "," + row.Costo + ')" >' + row.Anio + " / " + row.NombreMes + '</a>'
    
        }
    },
    {
        "data": "Costo",
        "class": "text-right",
        "render": function (data, type, row) {
            return $.number(data, '2', '.', ',')
        }
    }

];


var ColumnasCostoDetalle = [

    {
        "class": "text-center",
        "data": "Clave",
        "render": function (data, type, row) {
            return '<img class="img-dt" title="' + row.Lider + '" src="http://app.yitpro.com/Archivos/Fotos/' + data + '.jpg"  alt="' + data + '" style="width:60px; height:60px;cursor:pointer;">'
        }
    },
    {
        "data": "Recurso",
        "class": "text-left",
    },
    {
        "data": "Mes",
        "class": "text-left",
        "render": function (data, type, row) {
            return row.NombreMes + "/" + row.Anio;
        }
    },
    {
        "data": "Porcentaje",
        "class": "text-right",
        "render": data => $.number(data, '2', '.', ',')
    },
    {
        "data": "TotalMes",
        "class": "text-right",
        "render": data => $.number(data, '2', '.', ',')
    }
];

async function CargarCostos() {

    var url = $('#urlCargaCostosProyecto').val();
   /* await CargaFasesCD();*/

    $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ IdProyecto: $('#IdProyecto').val() }),
        dataType: "json",
        async: false,
        success: successCargaCostos,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
    return false;
}
function successCargaCostos(data) {
    if (data.Exito) {

        dsCostoMes = jQuery.parseJSON(data.LstCostosMeses);
        //dsCostoIndirecto = jQuery.parseJSON(data.LstCostoIndirecto);
        //const costos = JSON.parse(data.Costos);

        //tablaCostoAplicado =
        //    InicializaTabla({
        //        tabla: $('#TblCostoAplicado'),
        //        datos: dsCostoDirecto,
        //        columnas: columnasCostoDirecto,
        //        nonOrderableColumns: [1, 2],
        //        columnaOrdena: 4
        //    });


       
        tablaCosto = inicializaTabla($('#tblCostoMes'), dsCostoMes, columnasCostoMes, 1, "asc", false, false, true);

        $('#lblstatCostoPlaneado').text("$ " + formatMoney(data.Planeado, 2, '.', ','));
        $('#lblstatCostoAcumulado').text("$ " + formatMoney(data.Acumulado, 2, '.', ','));
        $('#lblCostoDisponible').text("$ " + formatMoney(data.Disponible, 2, '.', ','));
        $('#lblstatPorcUtilizado').text(formatMoney(data.PorcUtilizado, 2, '.', ',') + "%");
        var clase =
            data.PorcUtilizado >= 100 ? 'widget-danger'
                : data.PorcUtilizado >= 85 ? 'widget-warning'
                    : 'widget-success';

        $('#statPorcUtilizado').removeClass('.widget-danger');
        $('#statPorcUtilizado').removeClass('.widget-warning');
        $('#statPorcUtilizado').removeClass('.widget-success');

        $('#statPorcUtilizado').addClass(clase);

        $('div.pg-loading-screen').remove();
        page_content_onresize();
    }
    else {

        MensajeError(data.Mensaje);
    }

}

function VerCostoMes(IdProyecto, Mes, Anio, Total ) {


    //$("#ModalDetalleCostosMes").modal('show');

    var url = $('#urlObtieneCostosDetalle').val();

    $.ajax({
        url: url,
        data: JSON.stringify({ Anio: Anio ,Mes: Mes, IdProyecto: IdProyecto }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {

            dsCostoDetalle = jQuery.parseJSON(data.LstCostos);
            tablaCostoDetalle = inicializaTabla($('#TblCostoMes'), dsCostoDetalle, ColumnasCostoDetalle, 0, "desc", false, true, true);


            $("#LblTotalCostoMesDet").text("$ " + $.number(Total, '2', '.', ','));

            $("#TituloDCM").text("Proyecto: " + data.Proyecto);

            $("#ModalDetalleCostosMes").modal('show');

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error al realizar la consulta, intente de nuevo.");
        }
    });


}

$('#btnExportarCostos').click(e => {
    e.preventDefault();

    let formData = new FormData();
    formData.append("IdProyecto", $('#IdProyecto').val())

    DOWNLOAD('/Proyectos/ObtieneCostosMensualesProyecto', 'CostosMensuales.xlsx', formData, true);
});


//$(document).on('click', '#BtnAgregarCosto', function (e) {

//    $('#IdProyectoCosto').val($('#IdProyecto').val());
//    $('#IdProyectoCD').val('0');
//    CargaInicialCosto();
//    $('#ModalCapturarCosto').on('hidden.bs.modal', function () {
//        CargarCostos();
//    });
//    $('#ModalCapturarCosto').modal({ backdrop: 'static', keyboard: false });

//    return false;
//});

//$(document).on('click', '#BtnAgregarCostoInd', function (e) {
//    $('#IdProyectoCostoInd').val($('#IdProyecto').val());
//    $('#IdProyectoCI').val('0');

//    CargaInicialCostoIndirecto();
//    $('#ModalCapturarCostoIndirecto').on('hidden.bs.modal', function () {
//        CargarCostos();
//    });
//    $('#ModalCapturarCostoIndirecto').modal({ backdrop: 'static', keyboard: false });




//    return false;
//});


//$(document).on('click', '.BtnVerCostoAplicado', function (e) {


//    var filaPadre = $(this).closest('tr');
//    var row = tablaCostoAplicado.api().row(filaPadre);
//    var datosFila = row.data();
//    $('#IdProyectoCosto').val($('#IdProyecto').val());
//    $('#IdProyectoCD').val(datosFila.IdProyectoCD);
//    CargaInicialCosto();
//    CargaEdicionCosto();
//    $('#ModalCapturarCosto').on('hidden.bs.modal', function () {
//        CargarCostos();
//    });
//    $('#ModalCapturarCosto').modal({ backdrop: 'static', keyboard: false });




//    return false;

//});
//$(document).on('click', '.BtnVerCostoPlaneado', function (e) {


//    var filaPadre = $(this).closest('tr');
//    var row = tablaCostoPlaneado.api().row(filaPadre);
//    var datosFila = row.data();
//    $('#IdProyectoCosto').val($('#IdProyecto').val());
//    $('#IdProyectoCD').val(datosFila.IdProyectoCD);
//    CargaInicialCosto();
//    CargaEdicionCosto();
//    $('#ModalCapturarCosto').on('hidden.bs.modal', function () {
//        CargarCostos();
//    });
//    $('#ModalCapturarCosto').modal({ backdrop: 'static', keyboard: false });




//    return false;

//});

//$(document).on('click', '.BtnVerCostoIndirecto', function (e) {


//    var filaPadre = $(this).closest('tr');
//    var row = tablaCostoIndirecto.api().row(filaPadre);
//    var datosFila = row.data();
//    $('#IdProyectoCostoInd').val($('#IdProyecto').val());
//    $('#IdProyectoCI').val(datosFila.IdProyectoCI);
//    CargaInicialCostoIndirecto();
//    CargaEdicionCostoIndirecto();
//    $('#ModalCapturarCostoIndirecto').on('hidden.bs.modal', function () {
//        CargarCostos();
//    });
//    $('#ModalCapturarCostoIndirecto').modal({ backdrop: 'static', keyboard: false });




//    return false;

//});


//$("#BtnImpCosto").click(function () {

//    $("#FlImportaCostos").parent().next().text("");
//    $("#FlImportaCostos").val("");
//    $('#BtnImportarCostos').addClass('hidden');
//    $('#ModalImportarCostos').modal({ keyboard: false });

//    return false;

//});
//$(document).on("change", "#FlImportaCostos", function (e) {
//    $("#FlImportaCostos").parent().next().next().text("");



//    if (e.target.files != undefined) {

//        var reader = new FileReader();

//        reader.onload = function (f) {

//            $('#BtnImportarCostos').removeClass('hidden');
//        };
//        reader.readAsDataURL(e.target.files.item(0));
//    }

//});

//$(document).on('click', '#BtnImportarCostos', function (e) {


//    ImportaArchivoCosto();

//    return false;
//});

//function ImportaArchivoCosto() {
//    var url = $('#urlImportarCostos').val();

//    var form_data = new FormData();
//    form_data.append("Archivo", $("#FlImportaCostos").prop("files")[0]);
//    form_data.append("IdProyecto", $('#IdProyecto').val());

//    $.ajax({
//        url: url,
//        type: "POST",
//        contentType: false,
//        //dataType: "script",
//        data: form_data,
//        processData: false,
//        async: false,
//        success: function (Respuesta) {

//            var Resultado = Respuesta.split('|');


//            $('div.pg-loading-screen').remove();
//            if (Resultado[0] == "E") {

//                CargarCostos();
//                MensajeExito(Resultado[1]);
//            }
//            else {
//                CargarCostos();
//                MensajeAdvertencia(Resultado[1]);
//            }

//        },
//        error: function (xhr, textStatus, errorThrown) {
//            var err = eval("(" + xhr.responseText + ")");
//            MensajeError(err.Message);
//        }
//    });
//}
//#endregion



// #region Indicadores


var numV = 1;
function CargarIndicadores() {

    var url = $('#urlConsultaIndicadores').val();

    $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ IdProyecto: $('#IdProyecto').val() }),
        dataType: "json",
        async: false,
        success: successCargaIndicadores,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
    return false;

}

function successCargaIndicadores(data) {
    if (data.Exito) {

        var Indicadores = jQuery.parseJSON(data.Indicadores);

        // Rentabilidad
        if (Indicadores.RentabilidadActual >= 60) {
            $("#LblRentabilidadPorc").addClass("text-success");
        } else {
            $("#LblRentabilidadPorc").addClass("text-danger");
        }

        if (Indicadores.RentabilidadProyectada >= 60) {
            $("#LblRentProyectadaPorc").addClass("text-success")
        }
        else { $("#LblRentProyectadaPorc").addClass("text-danger"); }

        $("#LblRentabilidad").text("$ " + $.number(Indicadores.RentabilidadActualImporte, '2', '.', ','));
        $("#LblRentabilidadPorc").text($.number(Indicadores.RentabilidadActual, '2', '.', ',') + " %");

        $("#LblRentProyectada").text("$ " + $.number(Indicadores.RentabilidadProyectadaImporte, '2', '.', ','));
        $("#LblRentProyectadaPorc").text($.number(Indicadores.RentabilidadProyectada, '2', '.', ',') + " %");

        $("#LblRentPlaneada").text("$ " + $.number(Indicadores.RentabilidadPlanImporte, '2', '.', ','));
        $("#LblRentPlaneadaPorc").text($.number(Indicadores.RentabilidadPlan, '2', '.', ',') + " %");

        // Costos
        $("#LblCostoActual").text("$ " + $.number(Indicadores.CostoActual, '2', '.', ','));
        $("#LblCostoDisponible").text("$ " + $.number(Indicadores.CostoDisponible, '2', '.', ','));
        $("#LblCostoProyectado").text("$ " + $.number(Indicadores.CostoProyectado, '2', '.', ','));
        $("#LblCostoPlaneado").text("$ " + $.number(Indicadores.CostoPlaneado, '2', '.', ','));
        $("#LblCostoHora").text("$ " + $.number(Indicadores.CostoHora, '2', '.', ','));

        var element = document.querySelector('.ccostos');
        var ccostos = new EasyPieChart(element, {
            delay: 3000,
            barColor: function () {
                if (Indicadores.CostoActualPorc <= 90) {
                    return '#08C127';
                } else if (Indicadores.CostoActualPorc <= 100) {
                    return '#fea223'
                }
                else {
                    return '#D12106'
                }
            },
            trackColor: '#FFFFFF',
            scaleColor: false,
            lineWidth: 10,
            trackWidth: 16,
            lineCap: 'butt',
            onStep: function (from, to, percent) {
                this.el.children[0].innerHTML = $.number(Indicadores.CostoActualPorc, '2', '.', ',')
            }
        });
        ccostos.update(Indicadores.CostoActualPorc);
        ccostos.disableAnimation();
        ccostos.enableAnimation();

        //Flujo

        $("#LblTotalProyecto").text("$ " + $.number(Indicadores.TotalIngreso, '2', '.', ','));
        $("#LblTotalFacturado").text("$ " + $.number(Indicadores.Facturado, '2', '.', ','));
        $("#LblTotalPagado").text("$ " + $.number(Indicadores.Cobrado, '2', '.', ','));
        $("#LblTotalAtrasado").text("$ " + $.number(Indicadores.Atrasado, '2', '.', ','));
        $("#LblSaldo").text("$ " + $.number(Indicadores.Saldo, '2', '.', ','));
        $("#IdFlujoPago").val(Indicadores.IdFlujoPagos);
        $("#LblTarifa").text("$ " + $.number(Indicadores.PrecioHora, '2', '.', ','));



        //Fechas
        $("#LblFechaIniPlan").text(Indicadores.FechaInicioPlan == null || Indicadores.FechaInicioPlan == "" ? "Sin Fecha" : moment(Indicadores.FechaInicioPlan).format("DD/MM/YYYY"));
        $("#LblFechaFinPlan").text(Indicadores.FechaFinPlan == null || Indicadores.FechaFinPlan == "" ? "Sin Fecha" : moment(Indicadores.FechaFinPlan).format("DD/MM/YYYY"));
        $("#LblFechaFinProyectada").text(Indicadores.FechaProyectada == null || Indicadores.FechaProyectada == "" ? "Sin Fecha" : moment(Indicadores.FechaProyectada).format("DD/MM/YYYY"));
        $("#LblFechaFinCompromiso").text(Indicadores.FechaFinComprometida == null || Indicadores.FechaFinComprometida == "" ? "Sin Fecha" : moment(Indicadores.FechaFinComprometida).format("DD/MM/YYYY"));

        $("#LblFechaFinProyectada").addClass(Indicadores.FechaFinComprometida < Indicadores.FechaProyectada  ? "text-danger" : "text-success");


        //Avance
        var element2 = document.querySelector('.cavanceactual');
        var avancer = new EasyPieChart(element2, {
            delay: 3000,
            barColor: function () {
                if (Indicadores.DesfaseProc <= 5) { return '#08C127'
                }
                else if (Indicadores.DesfaseProc <= 15) {
                    return '#fea223'
                }
                else { return '#D12106'
                } },
            trackColor: '#FFFFFF',
            scaleColor: false,
            lineWidth: 10,
            trackWidth: 16,
            lineCap: 'butt',
            onStep: function (from, to, percent) {
                this.el.children[0].innerHTML = Indicadores.AvanceRealPorc;
            }
        });
        avancer.update(Indicadores.AvanceRealPorc);
        avancer.disableAnimation();
        avancer.enableAnimation();

        var element3 = document.querySelector('.cavanceesperado');
        var avancees = new EasyPieChart(element3, {
            delay: 3000,
            barColor: '#000070',
            trackColor: '#FFFFFF',
            scaleColor: false,
            lineWidth: 10,
            trackWidth: 16,
            lineCap: 'butt',
            onStep: function (from, to, percent) {
                this.el.children[0].innerHTML = Indicadores.AvanceCompPorc;
            }
        });
        avancees.update(Indicadores.AvanceCompPorc);
        avancees.disableAnimation();
        avancees.enableAnimation();




        $('#LblAvanceActualPorc').text(Indicadores.AvanceRealPorc);
        $('#LblAvanceEsperadoPorc').text(Indicadores.AvanceCompPorc);
        $('#LblDesfasePorc').text(Indicadores.DesfaseProc);


        if (Indicadores.DesfaseProc <= 3) {
            $("#WAvActual").removeClass("widget-danger");
            $("#WAvActual").addClass("widget-success");
            $("#WAvActual").removeClass("widget-warning");

        }
        else if (Indicadores.DesfaseProc >= 15) {
            $("#WAvActual").addClass("widget-danger");
            $("#WAvActual").removeClass("widget-success");
            $("#WAvActual").removeClass("widget-warning");

        }
        else {

            $("#WAvActual").removeClass("widget-danger");
            $("#WAvActual").removeClass("widget-success");
            $("#WAvActual").addClass("widget-warning");

        }


        $('#LblTotalHoras').text(Indicadores.HorasAsignadas);
        $('#LblComprometidas').text(Indicadores.HorasCompromiso);
        $('#LblRelizadas').text(Indicadores.AvanceReal);
        $('#LblDesfase').text(Indicadores.Desfase);



        $('#GraficaAvance').empty();

        $('#scriptsAvance').empty();
        var dsDatos = JSON.parse(data.GraficaAvance);
        $.each(dsDatos, function (key, value) {

            //dsGraficasP.push(value);
            var id = value.id;
            var nombre = value.Nombre;
            var tipo = value.Tipo;
            var series = value.Series;
            var columnas = value.LstColumnas;
            var valores = value.LstValores;

            var idgrafica = "grafica" + numV.toString();
            var vargrafica = "vargrafica" + numV.toString();
            var vartabla = "vartabla" + numV.toString();

            var tema = "temagraficasavanceproy";


            if (tipo == "Pie") {
                var grafica = "<div class='col-md-6'>"
                    + "     <div class='panel panel-default'>"
                    + "                           <div class='panel-heading'>"
                    + "                               <div class='panel-title-box'>"
                    + "                                  <h3>" + nombre + "</h3>"
                    + "                              </div>"
                    + "                               <ul class='panel-controls' style='margin-top: 2px;'>"
                    + '                                 <li><a href="#" onclick="AbrirGrafica(' + "'" + id + "'" + ')" class="panel-fullscreen"><span class="fa fa-expand"></span></a></li>'
                    + "                             </ul>"
                    + "                         </div>"
                    + "                         <div class='panel-body'>"
                    + "                               <div id='" + idgrafica + "' style='height:350px;' > "
                    + "                                </div>"
                    + "                         </div>"
                    + "                       </div>"
                    + "                 </div>"


                var script = "<script>"
                    + " var " + vargrafica + " = echarts.init(document.getElementById('" + idgrafica + "')," + tema + ");"
                    + "" + vargrafica + ".setOption({ "
                    + "              tooltip: {"
                    + "                   trigger: 'item',"
                    + "                   formatter: '{a} <br/>{b} : {c} ({d}%)'"
                    + "               },"
                    + "              calculable: true,"
                    + "               legend: { "
                    + '                   x: "center",'
                    + "                   y: 'bottom',"
                    + '                   data:' + series + ''
                    + "               },"
                    + "               toolbox: {"
                    + "show: true,"
                    + " feature: { "
                    + "            mark: { show: true },"
                    + "            magicType: { show: true, type: ['funnel', 'pie'] , title:''},"
                    + "    saveAsImage: {"
                    + "        show: true, "
                    + "        title: 'Descargar'"
                    + "    }"
                    + "}"
                    + "               }, "
                    + "               series: [{ "
                    + "                   name: 'Ordenes',"
                    + "                   type: 'pie', "
                    + "                   radius: ['35%', '55%'],"
                    + "                   itemStyle: { "
                    + "                       normal: { "
                    + "                           label: { "
                    + "                               show: true "
                    + "                           },"
                    + "                           labelLine: {"
                    + "                               show: true "
                    + "                           }"
                    + "                       },"
                    + "                       emphasis: {"
                    + "                           label: {"
                    + "                               show: true,"
                    + "                               position: 'center',"
                    + "                               textStyle: {"
                    + "                                   fontSize: '14',"
                    + "                                   fontWeight: 'normal' "
                    + "                               } "
                    + "                           }"
                    + "                       }"
                    + "                   },"
                    + '                   data: ' + valores + ''
                    + "               }]"
                    + "           });"
                    + "</script>"

                $('#GraficaAvance').append(grafica);
                $('#scriptsAvance').append(script);

            }
            else if (tipo == "bar") {
                var grafica = "<div class='col-md-12'>"
                    + "     <div class='panel panel-default'>"
                    + "                           <div class='panel-heading'>"
                    + "                               <div class='panel-title-box'>"
                    + "                                  <h3>" + nombre + "</h3>"
                    + "                              </div>"
                    + "                               <ul class='panel-controls' style='margin-top: 2px;'>"
                    + '                                 <li><a href="#" onclick="AbrirGrafica(' + "'" + id + "'" + ')" class="panel-fullscreen"><span class="fa fa-expand"></span></a></li>'
                    + "                             </ul>"
                    + "                         </div>"
                    + "                         <div class='panel-body'>"
                    + "                               <div id='" + idgrafica + "' style='height:450px;' > "
                    + "                                </div>"
                    + "                         </div>"
                    + "                       </div>"
                    + "                 </div>"

                var script = "<script>"
                    + " var " + vargrafica + " = echarts.init(document.getElementById('" + idgrafica + "')," + tema + ");"
                    + "" + vargrafica + ".setOption({ "
                    + "title: {},"
                    + "tooltip: { trigger: 'axis'},"
                    + " legend: {"
                    + '  data: ' + series + ''
                    + " },"
                    + "  toolbox: {"
                    + "show: true,"
                    + " feature: { "
                    + "            mark: { show: true },"
                    + "            magicType: { show: true, type: ['line', 'bar','pie'] , title:''},"
                    + "    saveAsImage: {"
                    + "        show: true, "
                    + "        title: 'Descargar'"
                    + "    }"
                    + "}"
                    + "},"
                    + "calculable: true,"
                    + " xAxis: [{ "
                    + " type: 'category',"
                    + ' data:' + columnas + ''
                    + " }],"
                    + " yAxis: [{ "
                    + " type: 'value' "
                    + "}],"
                    + 'series: ' + valores + ''
                    + "});"
                    + "</script>"


                $('#GraficaAvance').append(grafica);
                $('#scriptsAvance').append(script);

            }
            else if (tipo == "line") {

                var grafica = "<div class='col-md-12'>"
                    + "     <div class='panel panel-default'>"
                    + "                         <div class='panel-body'>"
                    + "                               <div id='" + idgrafica + "' style='height:350px;' > "
                    + "                                </div>"
                    + "                         </div>"
                    + "                       </div>"
                    + "                 </div>"


                var script = "<script>"
                    + " var " + vargrafica + " = echarts.init(document.getElementById('" + idgrafica + "')," + tema + ");"
                    + "" + vargrafica + ".setOption({ "
                    + "    title: { "
                    + "        text: '',"
                    + "        subtext: '' "
                    + "    },"
                    + "    tooltip: {"
                    + "        trigger: 'axis'"
                    + "    },"
                    + " legend: {"
                    + '  data: ' + series + ''
                    + " },"
                    + "    toolbox: {"
                    + "        show: true,"
                    + "        feature: {"
                    + "            mark: { show: true },"
                    //+ "            magicType: { show: true, type: ['line', 'bar','pie'] , title:''},"
                    //+ "            saveAsImage: { show: true, title: 'Descargar' }"
                    + "        } "
                    + "    },"
                    + "    calculable: true,"
                    + "    xAxis: ["
                    + "        {"
                    + " type: 'category', "
                    + "            boundaryGap: false, "
                    + '            data: ' + columnas + ''
                    + "        }"
                    + "    ],"
                    + "    yAxis: ["
                    + "        {"
                    + "            type: 'value',"
                    + "            axisLabel: {"
                    + "                formatter: '{value}'"
                    + "            }"
                    + "        }"
                    + "    ],"
                    + 'series: ' + valores + ''
                    + " });"
                    + "</script>"

                $('#GraficaAvance').append(grafica);
                $('#scriptsAvance').append(script);
            }


            //var tabla = '<div class="col-md-6">'
            //    + '       <div class="panel panel-default"> '
            //    + '                       <div class="panel-heading">'
            //    + '                           <div class="panel-title-box">'
            //    + '                               <h3>' + nombre + '</h3>'
            //    + '                           </div> '
            //    + '                           <ul class="panel-controls" style="margin-top: 2px;">'
            //    + '                                 <li><a href="#" onclick="AbrirGrafica(' + "'" + id + "'" + ')" class="panel-fullscreen"><span class="fa fa-expand"></span></a></li>'
            //    + '                           </ul>'
            //    + '                           <div class="btn-group pull-right">'
            //    + '                               <button class="btn btn-danger dropdown-toggle" data-toggle="dropdown"><i class="fa fa-bars"></i> Exportar</button>'
            //    + '                               <ul class="dropdown-menu">'
            //    + ' <li><a href="#" onclick="$(' + "'#" + vartabla + "'" + ').tableExport({type:' + "'excel',escape:" + "'false'" + '});' + '"' + '><img src="./Content/Project/Imagenes/xls.png" width="24" /> XLS</a></li>'
            //    + '                            </ul>'
            //    + '                           </div> '
            //    + '                       </div> '
            //    + '                       <div class="panel-body padding-0"> '
            //    + '                           <div class="panel-body" style="height:auto;">'
            //    + '                               <table id="' + vartabla + '" class="table table-striped">'
            //    + '' + tabla
            //    + '                               </table>'
            //    + '                                  </div> '
            //    + '                       </div> '
            //    + '                   </div>'
            //    + '               </div>'


            numV = numV + 1;

        });


        //Puntos

        $('#LblTotalPH').text(Indicadores.PuntosH);
        $('#LblTerminadosPH').text(Indicadores.PTerminado);
        $('#LblPendientesPH').text(Indicadores.PPendiente);

        ConsultaGraficasSprintData();


        //Sprints
        var sprints = jQuery.parseJSON(data.Sprints);

        if (sprints.length > 0) {
            $.each(sprints, function (key, value) {


                var sp = '<tr>' +
                    '<td><a onclick= "VerSprint(' + value.IdIteracion + ')"><h4 class="no-margins font-extra-bold">' + value.Nombre +
                 /*   ' <span id="" class="btn btn-small ' + value.Estatus + '" style="text-align:left;">' + value.EstatusStr + '</span>' +*/

                    "<span  class='btn btn-small btn-grid' style='text-align:left;color:#000;'><span>" + value.EstatusStr + "<span><span class='fa fa-fw fa-circle " + value.Estatus + "'></span> </span>" +


                    '</h4></a> <small>' + value.Objetivo + '</small>' +
                    '<div class="progress progress-small">' +
                    '<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width:' + value.Avance + '%;"></div>' +
                    '</div>' +
                    '</td>' +
                    '<td><div class="pull-right font-bold text-primary"> <h4 class="text-default">' + value.Avance + '%</h4></div> </td>' +
                    '</tr>'

                $('#tblSprintDetalle').append(sp);

            });


        }
        else {

            var sp ='<tr><td><h4 class="no-margins font-extra-bold"> No hay sprints </h4>  </td></tr>'

            $('#tblSprintDetalle').append(sp);
        }



        $('div.pg-loading-screen').remove();
        page_content_onresize();
    }
    else {

        MensajeError(data.Mensaje);
    }

}


async function ConsultaGraficasSprintData() {

    const data = await POST('/Dashboard/ConsultaGraficaVelocidad', { IdProyecto: $('#IdProyecto').val() });

    if (data.Exito) {
        var dsDatos = JSON.parse(data.Grafica);
        $('#GraficasPPH').empty();
        $('#scriptsPPH').empty();

        $.each(dsDatos, function (key, value) {
            var id = value.id;
            var nombre = value.Nombre;
            var tipo = value.Tipo;
            var series = value.Series;
            var columnas = value.LstColumnas;
            var valores = value.LstValores;
            var tabla = value.Tabla;
            var idgrafica = "grafica" + numV.toString();
            var vargrafica = "vargrafica" + numV.toString();
            var vartabla = "vartabla" + numV.toString();

            var tema = "temaEstatusCPS";
            var grafica = "<div >"
                + "     <div class=''>"
                + "                         <div class=''>"
                + "                               <div id='" + idgrafica + "' style='height:400px;' > "
                + "                                </div>"
                + "                         </div>"
                + "                       </div>"
                + "                 </div>"


            var script = "<script>"
                + " var " + vargrafica + " = echarts.init(document.getElementById('" + idgrafica + "')," + tema + ");"
                + "" + vargrafica + ".setOption({ "
                + "    title: { "
                + "        text: '',"
                + "        subtext: '' "
                + "    },"
                + "    tooltip: {"
                + "        trigger: 'axis'"
                + "    },"

                + " legend: {"
                + '  data: ' + series + ''
                + " },"
                + "    toolbox: {"
                + "        show: true,"
                + "        feature: {"
                + "            mark: { show: true },"
                + "            magicType: { show: true, type: ['line', 'bar','pie'] , title:''},"
                + "            saveAsImage: { show: true, title: 'Descargar' }"
                + "        } "
                + "    },"
                + "    calculable: true,"
                + "    xAxis: ["
                + "        {"
                + " type: 'category', "
                + "            boundaryGap: false, "
                + '            data: ' + columnas + ''
                + "        }"
                + "    ],"
                + "    yAxis: ["
                + "        {"
                + "            type: 'value',"
                + "            name: '',"
                + "            position: 'left',"
                + "            axisLabel: {"
                + "                formatter: '{value}'"
                + "            }"
                + "        },"
                + "    ],"
                + 'series: ' + valores + ''
                + " });"
                + "</script>"

            $('#GraficasPPH').append(grafica);
            $('#scriptsPPH').append(script);

            numV = numV + 1;

        });

    }
    else {

        MensajeError(data.Mensaje);
    }

}



function VerSprint(IdIteracion) {


    var url = $('#urlSprintReport').val() + "/" + IdIteracion;
    window.open(url, '_blank');


}

function AbrirModalFechas() {
  

    var url = $('#urlConsultaConfigFechas').val();

    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ IdProyecto: $('#IdProyecto').val()}),
        dataType: "json",
        async: false,
        success: function (data) {

            if (data.Exito) {
                var datos = jQuery.parseJSON(data.Proyecto);

                cambiaEstadoSwitch($('#ChkCalculaFechas'), datos.FijarFechas);


                if (datos.FechaInicioPlan != null) {
                    $('#TxtFechaIniProy').val(moment(datos.FechaInicioPlan).format("DD/MM/YYYY"));
                }

                if (datos.FechaFinPlan != null) {
                    $('#TxtFechaFinProy').val(moment(datos.FechaFinPlan).format("DD/MM/YYYY"));
                }

                if (datos.FechaFinComprometida != null) {
                    $('#TxtFechaCompProy').val(moment(datos.FechaFinComprometida).format("DD/MM/YYYY"));
                }

                if (!datos.FijarFechas) {

                    $("#divFechasManual").removeClass("hidden");
                }
                else {
                    $("#divFechasManual").addClass("hidden");
                }


            }
            else {

                MensajeError(data.Mensaje);
            }
           


        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });

    $('#ModalFechas').modal('show');
    return false;


}

function AbrirModalHoras(){
    var url = $('#urlConsultaConfigHoras').val();

    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ IdProyecto: $('#IdProyecto').val() }),
        dataType: "json",
        async: false,
        success: function (data) {

            if (data.Exito) {
                var datos = jQuery.parseJSON(data.Proyecto);

                cambiaEstadoSwitch($('#ChkCalculaHoras'), datos.FijarHoras);

                $('#TxtConfHorasProy').val(datos.HorasEstimadasInicial);



            }
            else {

                MensajeError(data.Mensaje);
            }



        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });

    $('#ModalHoras').modal('show');
    return false;
}

function CambiaModoFechas(e) {

   var activo =  $('#ChkCalculaFechas').prop('checked')
    if (!activo) {

        $("#divFechasManual").removeClass("hidden");
    }
    else {
        $("#divFechasManual").addClass("hidden");
    }

}

function GuardarConfigFechas() {

    var activo = $('#ChkCalculaFechas').prop('checked');

    var proy;

    if (activo) {

      
        proy = {
            IdProyecto: $('#IdProyecto').val(),
            FijarFechas : $('#ChkCalculaFechas').prop('checked')
        }


    }
    else {


        var Mensaje = ValidaCamposRequeridos(".ReqConFechas");

        if (Mensaje.length > 0) {

            MensajeAdvertencia(Mensaje);
            $('#ModalFechas').modal('toggle');
            return false;
        }


        proy = {
            IdProyecto: $('#IdProyecto').val(),
            FijarFechas : $('#ChkCalculaFechas').prop('checked'),
            FechaInicioPlan: $('#TxtFechaIniProy').val(),
            FechaFinPlan: $('#TxtFechaFinProy').val(),
            FechaFinComprometida: $('#TxtFechaCompProy').val()

        }
    }

    var url = $('#urlGuardarConfigFechas').val();

    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(proy),
        dataType: "json",
        async: false,
        success: function (data) {

            if (data.Exito) {
                MensajeExito("Los datos se guardaron correctamente.");
                location.reload();
            }
            else {
                MensajeError(data.Mensaje);
            }
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });

    return false;
}

function CambiaModoHoras(e) {

    var activo = $('#ChkCalculaHoras').prop('checked')
    if (!activo) {

        $("#divHorasManual").removeClass("hidden");
    }
    else {
        $("#divHorasManual").addClass("hidden");
    }

}

function GuardarConfigHoras() {

    var activo = $('#ChkCalculaHoras').prop('checked');

    var proy;

    if (activo) {


        proy = {
            IdProyecto: $('#IdProyecto').val(),
            FijarHoras: $('#ChkCalculaHoras').prop('checked')
        }


    }
    else {


        var Mensaje = ValidaCamposRequeridos(".ReqConHoras");

        if (Mensaje.length > 0) {

            MensajeAdvertencia(Mensaje);
            $('#ModalFechas').modal('toggle');
            return false;
        }


        proy = {
            IdProyecto: $('#IdProyecto').val(),
            FijarHoras: $('#ChkCalculaHoras').prop('checked'),
            HorasEstimadasInicial: $('#TxtConfHorasProy').val()

        }
    }

    var url = $('#urlGuardarConfigHoras').val();

    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(proy),
        dataType: "json",
        async: false,
        success: function (data) {

            if (data.Exito) {
                $('#ModalHoras').modal('hide');
                MensajeExito("Los datos se guardaron correctamente.");
              
                location.reload();
            }
            else {
                MensajeError(data.Mensaje);
            }
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });

    return false;
}



//#endregion


// #region Gannt


//function CargaGannt() {

//    var url = $('#urlConsultaGannt').val();

//    $.ajax({

//        url: url,
//        type: "POST",
//        contentType: "application/json; charset=utf-8",
//        data: JSON.stringify({ IdProyecto: $('#IdProyecto').val() }),
//        dataType: "json",
//        async: false,
//        success: successCargaGannt,
//        error: function (xmlHttpRequest, textStatus, errorThrown) {

//            MensajeError(data.Mensaje);
//        }
//    });
//    return false;

//}

//var gannt;

//function successCargaGannt(data) {
//    if (data.Exito) {



//        var tasks = jQuery.parseJSON(data.Gannt);
//        var type = "weeks";
//        gantt = $("#gantt").dxGantt({

//            tasks: {
//                dataSource: tasks
//            },
//            toolbar: {
//                items: [
//                    //"undo",
//                    //"redo",
//                    //"separator",
//                    "collapseAll",
//                    "expandAll",
//                    //"separator",
//                    //"addTask",
//                    //"deleteTask",
//                    //"separator",
//                    "zoomIn",
//                    "zoomOut"
//                ]
//            },
//            validation: {
//                autoUpdateParentTasks: true,
//                validateDependencies: true
//            },
//            //dependencies: {
//            //    dataSource: dependencies
//            //},
//            //resources: {
//            //    dataSource: resources
//            //},
//            //resourceAssignments: {
//            //    dataSource: resourceAssignments
//            //},
//            //editing: {
//            //    enabled: true
//            //},
//            columns: [{
//                dataField: "title",
//                caption: "Actividad",
//                width: 200
//            }, {
//                dataField: "hours",
//                caption: "Horas",
//                width: 70
//            },
//            {
//                dataField: "start",
//                caption: "Fecha inicio",
//                width: 70
//            }, {
//                dataField: "end",
//                caption: "Fecha fin",
//                width: 70
//            }, {
//                dataField: "resource",
//                caption: "Recurso",
//                width: 40
//            }],
//            //allowSelection: true,
//            //showResources: true,
//            scaleType: type,
//            taskListWidth: 500,
//            //onSelectionChanged: function (e) {

//            //        alert();
//            //}
//        }).dxGantt("instance");;

//        $("#titlePosition").dxSelectBox({
//            items: [
//                "inside",
//                "outside",
//                "none"
//            ],
//            value: "outside",
//            onValueChanged: function (e) {
//                gantt.option("taskTitlePosition", e.value);
//            }
//        });

//        $("#showResources").dxCheckBox({
//            text: "Show Resources",
//            value: true,
//            onValueChanged: function (e) {
//                gantt.option("showResources", e.value);
//            }
//        });
//        setTimeout(function () { $("#tab-millestones").removeClass('active') }, 2000);

//        //$("#tab-millestones").removeClass('active');
//        page_content_onresize();
//    }
//    else {

//        MensajeError(data.Mensaje);
//    }

//}


//$("#scaleType").dxSelectBox({
//    items: [
//        "auto",
//        "minutes",
//        "hours",
//        "days",
//        "weeks",
//        "months",
//        "quarters",
//        "years"
//    ],
//    value: "quarters",
//    onValueChanged: function (e) {
//        gantt.option("scaleType", e.value);
//    }
//});

//#endregion

// #region Tablero
//function CargaTablero() {

//    var url = $('#urlCargaTablero').val();

//    var incio, fin;
//    if ($("#TxtRangoFechasP").val() != "") {
//        inicio = ($("#TxtRangoFechasP").val()).split('-')[0];
//        fin = ($("#TxtRangoFechasP").val()).split('-')[1];
//    }

//    var datosBuscar = {
//        FechaSolIni: inicio,
//        FechaSolFin: fin,
//        TipoPeriodo: $('#SelPeriodoP').val(),
//        LstAsignado: $('#SelRecursoP').val(),
//        LstSprints: $('#SelSprintP').val(),
//        LstProyecto: $('#IdProyecto').val()

//    }


//    $.ajax({
//        url: url,
//        data: JSON.stringify(datosBuscar),
//        type: "POST",
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        async: true,
//        success: function (data) {

//            if (data.Exito) {

//                $("#LblAbierto").text("Abiertas (" + data.TotalAbiertas + ")");
//                $("#LblProgreso").text("Progreso (" + data.TotalProgreso + ")");
//                $("#LblValidacion").text("Validación (" + data.TotalValidacion + ")");
//                $("#LblTerminadas").text("Terminadas (" + data.TotalLiberadas + ")");
//                $("#LblRechazadas").text("Rechazadas (" + data.TotalRechazadas + ")");

//                $("#tasks_assigned").empty();
//                $("#tasks_progreess").empty();
//                $("#task_validate").empty();
//                $("#tasks_re").empty();
//                $("#tasks_ok").empty();



//                $("#tasks_assigned").append(data.ActividadesA);
//                $("#tasks_progreess").append(data.ActividadesP);
//                $("#task_validate").append(data.ActividadesR);
//                $("#tasks_re").append(data.ActividadesX);
//                $("#tasks_ok").append(data.ActividadesL);
//                resizeTaskList();
//                page_content_onresize();
//                $('div.pg-loading-screen').remove();
//            }
//            else {

//                MensajeAdvertencia(data.Mensaje);

//            }

//        },
//        error: function (xmlHttpRequest, textStatus, errorThrown) {

//            MensajeError("Error al realizar la consulta, intente de nuevo.");
//        }
//    });

//}

//$(document).on('click', '#BtnFiltrarTP', function (e) {

//    CargaTablero();

//    return false;

//});

//$("#tasks_assigned,#tasks_progreess, #task_validate").sortable({
//    items: "> .task-item",
//    connectWith: "#tasks_assigned, #tasks_progreess, #task_validate",
//    handle: ".task-text",
//    receive: function (event, ui) {
//        if (this.id == "task_validate") {
//            //  alert("Se paso a validación");
//            var item = $(ui).attr('item')[0].id;

//            ui.item.removeClass("task-info");
//            ui.item.removeClass("task-danger");
//            ui.item.removeClass("task-progreess");
//            ui.item.addClass("task-validate");

//            AbrirModalCapturaTiempo(item);
//            //ActualizaEstatus(item, 'V');
//            //ui.item.addClass("task-complete");
//            //.find(".task-footer > .pull-right").remove();
//        }
//        if (this.id == "tasks_progreess") {
//            //alert("Se paso a progreso");
//            var item = $(ui).attr('item')[0].id;
//            //var item2 = ui.id;
//            ui.item.removeClass("task-info");
//            ui.item.removeClass("task-validate");
//            ui.item.removeClass("task-danger");
//            ui.item.addClass("task-progreess");
//            ActualizaEstatus(item, 'P');

//            //ui.item.find(".task-footer").append('<div class="pull-right"><span class="fa fa-play"></span> 00:00</div>');
//        }
//        if (this.id == "tasks_assigned") {
//            //alert("Se paso a pendiente");
//            var item = $(ui).attr('item')[0].id;

//            ui.item.removeClass("task-validate");
//            ui.item.removeClass("task-danger");
//            ui.item.removeClass("task-progreess");
//            ui.item.addClass("task-info");
//            ActualizaEstatus(item, 'A');

//            //ui.item.find(".task-footer").append('<div class="pull-right"><span class="fa fa-play"></span> 00:00</div>');
//        }
//        page_content_onresize();
//    }
//}).disableSelection();

//$("#tasks_re").sortable({
//    items: "> .task-item",
//    connectWith: "#tasks_re,tasks_assigned, #tasks_progreess, #task_validate",
//    handle: ".task-text",
//    receive: function (event, ui) {
//        if (this.id == "task_validate") {
//            ui.item.addClass("task-complete").find(".task-footer > .pull-right").remove();
//        }
//        if (this.id == "tasks_progreess") {
//            alert("Se paso a progreso");
//            ui.item.find(".task-footer").append('<div class="pull-right"><span class="fa fa-play"></span> 00:00</div>');
//        }
//        page_content_onresize();
//    }
//}).disableSelection();

//function ActualizaEstatus(IdActividad, Estatus) {

//    var url = $('#urlActualizaEstatus').val();

//    $.ajax({
//        url: url,
//        data: JSON.stringify({ IdActividad: IdActividad, Estatus: Estatus }),
//        type: "POST",
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        async: false,
//        success: function (data) {

//            if (!data.Exito) {

//                MensajeAdvertencia(data.Mensaje);

//            }
//            else {
//                if (Sprint != 0 && Proyecto != 0) {
//                    CargaTableroSprint(Sprint, Proyecto);
//                }
//                else {
//                    CargaTablero();
//                }
//            }

//        },
//        error: function (xmlHttpRequest, textStatus, errorThrown) {

//            MensajeError("Error al realizar la consulta, intente de nuevo.");
//        }
//    });


//}

//function AbrirModalCapturaTiempo(IdActividad) {

//    $("#IdActividadCT").val(IdActividad);
//    $('#TituloRec').text("Capturar fecha fin de actividad #" + IdActividad);
//    var date = new Date();
//    $('#TxtFinActividad').datetimepicker(
//        {
//            format: 'DD/MM/YYYY',
//            maxDate: date
//        });

//    $('#ModalCapturarTiempo').on('hidden.bs.modal', function () {
//        if (Sprint != 0 && Proyecto != 0) {
//            CargaTableroSprint(Sprint, Proyecto);
//        }
//        else {
//            CargaTablero();
//        }
//    });

//    $('#ModalCapturarTiempo').modal({ keyboard: false });

//    return false;

//}



//$.urlParam = function (name) {
//    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);

//    if (results != null) {
//        return results[1] || 0;
//    }
//    else {

//        return 0;
//    }
//    //return results[1] || 0;
//}

//function CapturaTrabajo(IdActividad, PSP, Descripcion) {


//    if (PSP == 1) {
//        var url = $('#urlTracking').val() + "?Id=" + IdActividad;
//        window.open(url, '_blank');

//    }
//    else {
//        $("#IdActividadCTra").val(IdActividad);
//        $("#LblActividadDesc").text(IdActividad + "-" + Descripcion);
//        var date = new Date();
//        $('#TxtFechaTrab').datetimepicker(
//            {
//                format: 'DD/MM/YYYY',
//                maxDate: date
//            });
//        CargarTrabajos();
//        $('#ModalCapturarTrabajo').on('hidden.bs.modal', function () {

//            if (Sprint != 0 && Proyecto != 0) {
//                CargaTableroSprint(Sprint, Proyecto);
//            }
//            else {
//                CargaTablero();
//            }
//        });
//        $('#ModalCapturarTrabajo').modal({ backdrop: 'static', keyboard: false });
//    }
//}

//$(".btn-AltaActividadesTablero").click(function () {

//    $('#ModalActividades').modal({ keyboard: false });
//    $('#TituloActividades').text("Captura actividad");
//    $('#IdProyectoAct').val($('#SelProyectoT').val());
//    InicializaAltaActividades();


//    return false;

//});


//#endregion

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
        "<button type='button' id='" + accion + "' class='btn-Confirmar' data-dismiss='modal'>" +
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

var dtProyectoRepositorio;

var colProyectoRepo = [
    {
        "data": "Nombre",
        "class": "text-left"
    },
    {
        "data": "Tipo",
        "class": "text-left"
    },
    {
        "data": "Organizacion",
        "class": "text-left"
    },
    {
        "data": "Proyecto",
        "class": "text-left"
    },
    {
        "class": "text-center",
        "render": () => "<i class='fa fa-trash btnEliminarRepositorio' style='cursor: pointer;'></i>"
    },
];

$('#btnAgregarRepositorio').click(e => {
    e.preventDefault();

    $('#txtNombreRepositorio').val('');
    $('#selTipoRepositorio').val('-1');
    $('#txtOrganizacionRepositorio').val('');
    $('#txtProyectoRepositorio').val('');

    $('#mdlProyectoRepositorio').modal('show');
});

$('#btnGuardarRepositorio').click(async e => {
    e.preventDefault();

    const repo = {
        Nombre: $('#txtNombreRepositorio').val(),
        IdTipoRepositorio: $('#selTipoRepositorio').val(),
        Organizacion: $('#txtOrganizacionRepositorio').val(),
        Proyecto: $('#txtProyectoRepositorio').val(),
        IdProyecto: $('#IdProyecto').val()
    }

    try {
        const data = await POST("/proyectos/GuardarRepositorio", { proyecto: repo }, false);

        if (data.Exito) {
            MensajeExito(data.Mensaje);
            LeerRepositorios();
            $('#mdlProyectoRepositorio').modal('hide');
        } else {
            MensajeAdvertencia(data.Mensaje);
        }
    } catch (e) {
        MensajeError(e);
        console.log(e);
    }
});

var LeerRepositorios = async () => {
    try {
        const data = await POST("/proyectos/LeerRepositorios", { idProyecto: $('#IdProyecto').val() }, false);

        if (data.Exito) {
            dtProyectoRepositorio = InicializaTabla({
                tabla: $('#tblProyectoRepositorio'),
                datos: data.Repos,
                columnas: colProyectoRepo,
                nonOrderableColumns: [4],
                paginada: false,
                info: false,
                incluyeBusqueda: false
            })
        } else {
            MensajeAdvertencia(data.Mensaje);
        }
    } catch (e) {
        MensajeError(e);
        console.log(e);
    }
}

$(document).on('click', '.btnEliminarRepositorio', async e => {
    const id = ObtenerData(dtProyectoRepositorio, e).IdProyectoRepositorio;
    try {
        const data = await POST("/proyectos/EliminarRepositorio", { idProyecto: $('#IdProyecto').val(), IdProyectoRepositorio: id }, false);
        if (data.Exito) {
            MensajeExito(data.Mensaje);
            LeerRepositorios();
        } else {
            MensajeAdvertencia(data.Mensaje);
        }
    } catch (e) {
        MensajeError(e);
        console.log(e);
    }
});



function VerFlujo() {


    var Id = $("#IdFlujoPago").val();

    if (Id == 0) {

        MensajeAdvertencia("Este proyecto no cuenta con un flujo de pagos relacionado.")
    }
    else {
        var url = $('#urlFlujoDetalle').val() + "/" + Id;

        window.open(url, '_blank');
    }

}

async function ConsultaBacklog() {

    Filtros = {
        Tipo: $("#SelTipoBL").val(),
        IdProyecto: $("#IdProyecto").val()

    }
    const data = await POST('/BackLog/ConsultaBacklog', { Filtros: Filtros });

    if (data.Exito) {

        var dsBacklog2 = jQuery.parseJSON(data.LstBacklog2);
        ganttBL = jQuery.parseJSON(data.Gantt);

        if (recarga) {

            $table.bootstrapTable('load', dsBacklog2);
        }
        else {

            $table.bootstrapTable({

                data: dsBacklog2,
                idField: 'IdActividad',
                toolbar: "#toolbarBL",
                search: true,
                idtable: "saveId",

                columns: [

                    {
                        field: 'IdActividad',
                        align: 'left',
                        title: '<div class="btn-group"><button   class="btn btn-grid btn-condensed" onclick="ExpandCollappse(' + "'" + 'collapseAll' + "'" + ');"><i class="fa fa-minus"></i></button> <button  class="btn btn-grid btn-condensed"  onclick="ExpandCollappse(' + "'" + 'expandAll' + "'" + ');"><i class="fa fa-plus"></i></button></div>',
                        width: "100px",
                        formatter: function (value, row, index) {

                            if (row.TipoId == 4) {
                                //return '<div class="btn-group" >'
                                //    + '<button  class="btn btn-grid  dropdown-toggle" data-toggle="dropdown">' +
                                //    '<span class="fa fa-plus-circle"></span>' +
                                //    '<span class=""></span>'
                                //    + '</button>' +
                                //    '<ul class="dropdown-menu" role="menu" style="position: relative">' +
                                //    '<li><a href="#" onclick="newItemBL(1,' + value + ' );"> <img src="/Content/Project/Imagenes/task.png" style="height:24px; width:24px;margin-right:4px;" class="pull-left img-dt" alt="Task"> Task</a></li>' +
                                //    '<li><a href="#" onclick="newItemBL(7,' + value + ' );"> <img src="/Content/Project/Imagenes/bug.png" style="height:24px; width:24px;margin-right:4px;" class="pull-left img-dt" alt="Bug"> Bug</a></li>' +
                                //    '<li><a href="#" onclick="newItemBL(8,' + value + ' );"> <img src="/Content/Project/Imagenes/testcase.png" style="height:24px; width:24px;margin-right:4px;" class="pull-left img-dt" alt="Test Case"> Test Case</a></li>' +

                                //    '</ul></div>';


                                if (row.Prioridad == 1) {
                                    return " <div class='btn-group'> <button class='btn btn-grid btn-condensed' style='padding:8px;'  title='Agregar HU' onclick='NewItemFromBLF(1," + value + ");' style='cursor: pointer;'> <span class='fa fa-plus-circle'></span></button> " +
                                        /*   " <button class='btn btn-grid  btn-condensed btnBacklog'  style='padding:8px;'  title='Up' onclick='MoveItemBL(2,0," + value + ");' style='cursor: pointer;'> <span class='fa fa-angle-up'></span></button>" +*/
                                        " <button class='btn btn-grid btn-condensed btnBacklog'  style='padding:8px;'  title='Down' onclick='MoveItemBL(" + row.TipoId + ",1," + value + ");' style='cursor: pointer;'> <span class='fa fa-angle-down'></span></button>" +
                                        " </div>"
                                }
                                else if (data.Last == row.Prioridad) {
                                    return " <div class='btn-group'><button class='btn btn-grid btn-condensed' style='padding:8px;'  title='Agregar HU' onclick='NewItemFromBLF(1," + value + ");' style='cursor: pointer;'> <span class='fa fa-plus-circle'></span></button> " +
                                        " <button class='btn btn-grid  btn-condensed btnBacklog'  style='padding:8px;'  title='Up' onclick='MoveItemBL(" + row.TipoId + ",0," + value + ");' style='cursor: pointer;'> <span class='fa fa-angle-up'></span></button>" +
                                        /*    " <button class='btn btn-grid btn-condensed btnBacklog'  style='padding:8px;'  title='Down' onclick='MoveItemBL(2,1," + value + ");' style='cursor: pointer;'> <span class='fa fa-angle-down'></span></button>" +*/
                                        " </div>"

                                }

                                else {
                                    return " <div class='btn-group'><button class='btn btn-grid btn-condensed' style='padding:8px;'  title='Agregar HU' onclick='NewItemFromBLF(1," + value + ");' style='cursor: pointer;'> <span class='fa fa-plus-circle'></span></button> " +
                                        " <button class='btn btn-grid  btn-condensed btnBacklog'  style='padding:8px;'  title='Up' onclick='MoveItemBL(" + row.TipoId + ",0," + value + ");' style='cursor: pointer;'> <span class='fa fa-angle-up'></span></button>" +
                                        " <button class='btn btn-grid btn-condensed btnBacklog'  style='padding:8px;'  title='Down' onclick='MoveItemBL(" + row.TipoId + ",1," + value + ");' style='cursor: pointer;'> <span class='fa fa-angle-down'></span></button>" +
                                        " </div>"

                                }






                            }
                            else if (row.TipoId == 2) {

                                if (row.Prioridad == 1) {
                                    return " <div class='btn-group'> <button class='btn btn-grid btn-condensed' style='padding:8px;'  title='Agregar HU' onclick='NewItemFromBLF(4," + value + ");' style='cursor: pointer;'> <span class='fa fa-plus-circle'></span></button> " +
                                        /*   " <button class='btn btn-grid  btn-condensed btnBacklog'  style='padding:8px;'  title='Up' onclick='MoveItemBL(2,0," + value + ");' style='cursor: pointer;'> <span class='fa fa-angle-up'></span></button>" +*/
                                        " <button class='btn btn-grid btn-condensed btnBacklog'  style='padding:8px;'  title='Down' onclick='MoveItemBL(2,1," + value + ");' style='cursor: pointer;'> <span class='fa fa-angle-down'></span></button>" +
                                        " </div>"
                                }
                                else if (data.Last == row.Prioridad) {
                                    return " <div class='btn-group'><button class='btn btn-grid btn-condensed' style='padding:8px;'  title='Agregar HU' onclick='NewItemFromBLF(4," + value + ");' style='cursor: pointer;'> <span class='fa fa-plus-circle'></span></button> " +
                                        " <button class='btn btn-grid  btn-condensed btnBacklog'  style='padding:8px;'  title='Up' onclick='MoveItemBL(2,0," + value + ");' style='cursor: pointer;'> <span class='fa fa-angle-up'></span></button>" +
                                        /*    " <button class='btn btn-grid btn-condensed btnBacklog'  style='padding:8px;'  title='Down' onclick='MoveItemBL(2,1," + value + ");' style='cursor: pointer;'> <span class='fa fa-angle-down'></span></button>" +*/
                                        " </div>"

                                }

                                else {
                                    return " <div class='btn-group'><button class='btn btn-grid btn-condensed' style='padding:8px;'  title='Agregar HU' onclick='NewItemFromBLF(4," + value + ");' style='cursor: pointer;'> <span class='fa fa-plus-circle'></span></button> " +
                                        " <button class='btn btn-grid  btn-condensed btnBacklog'  style='padding:8px;'  title='Up' onclick='MoveItemBL(2,0," + value + ");' style='cursor: pointer;'> <span class='fa fa-angle-up'></span></button>" +
                                        " <button class='btn btn-grid btn-condensed btnBacklog'  style='padding:8px;'  title='Down' onclick='MoveItemBL(2,1," + value + ");' style='cursor: pointer;'> <span class='fa fa-angle-down'></span></button>" +
                                        " </div>"

                                }



                            }
                            else if (row.TipoId == 11) {

                                if (row.Prioridad == 1) {
                                    return " <div class='btn-group'> <button class='btn btn-grid btn-condensed' style='padding:8px;'  title='Agregar epic' onclick='NewItemFromBLF(2," + value + " );' style='cursor: pointer;'> <span class='fa fa-plus-circle'></span></button> " +
                                        /*   " <button class='btn btn-grid  btn-condensed btnBacklog'  style='padding:8px;'  title='Up' onclick='MoveItemBL(2,0," + value + ");' style='cursor: pointer;'> <span class='fa fa-angle-up'></span></button>" +*/
                                        " <button class='btn btn-grid btn-condensed btnBacklog'  style='padding:8px;'  title='Down' onclick='MoveItemBL(11,1," + value + ");' style='cursor: pointer;'> <span class='fa fa-angle-down'></span></button>" +
                                        " </div>"
                                }
                                else if (data.Last == row.Prioridad) {
                                    return " <div class='btn-group'><button class='btn btn-grid btn-condensed' style='padding:8px;'  title='Agregar epic' onclick='NewItemFromBLF(2," + value + ");' style='cursor: pointer;'> <span class='fa fa-plus-circle'></span></button> " +
                                        " <button class='btn btn-grid  btn-condensed btnBacklog'  style='padding:8px;'  title='Up' onclick='MoveItemBL(11,0," + value + ");' style='cursor: pointer;'> <span class='fa fa-angle-up'></span></button>" +
                                        /*    " <button class='btn btn-grid btn-condensed btnBacklog'  style='padding:8px;'  title='Down' onclick='MoveItemBL(2,1," + value + ");' style='cursor: pointer;'> <span class='fa fa-angle-down'></span></button>" +*/
                                        " </div>"

                                }

                                else {
                                    return " <div class='btn-group'><button class='btn btn-grid btn-condensed' style='padding:8px;'  title='Agregar epic' onclick='NewItemFromBLF(2," + value + ");' style='cursor: pointer;'> <span class='fa fa-plus-circle'></span></button> " +
                                        " <button class='btn btn-grid  btn-condensed btnBacklog'  style='padding:8px;'  title='Up' onclick='MoveItemBL(11,0," + value + ");' style='cursor: pointer;'> <span class='fa fa-angle-up'></span></button>" +
                                        " <button class='btn btn-grid btn-condensed btnBacklog'  style='padding:8px;'  title='Down' onclick='MoveItemBL(11,1," + value + ");' style='cursor: pointer;'> <span class='fa fa-angle-down'></span></button>" +
                                        " </div>"

                                }

                            }

                            else if (row.TipoId == 1) {

                                if (row.Prioridad == 0) {
                                    return " <div class='btn-group'> " +
                                        /*   " <button class='btn btn-grid  btn-condensed btnBacklog'  style='padding:8px;'  title='Up' onclick='MoveItemBL(2,0," + value + ");' style='cursor: pointer;'> <span class='fa fa-angle-up'></span></button>" +*/
                                        " <button class='btn btn-grid btn-condensed btnBacklog'  style='padding:8px;'  title='Down' onclick='MoveItemBL(1,1," + value + ");' style='cursor: pointer;'> <span class='fa fa-angle-down'></span></button>" +
                                        " </div>"
                                }
                                else {
                                    return " <div class='btn-group'> " +
                                        " <button class='btn btn-grid  btn-condensed btnBacklog'  style='padding:8px;'  title='Up' onclick='MoveItemBL(1,0," + value + ");' style='cursor: pointer;'> <span class='fa fa-angle-up'></span></button>" +
                                        " <button class='btn btn-grid btn-condensed btnBacklog'  style='padding:8px;'  title='Down' onclick='MoveItemBL(1,1," + value + ");' style='cursor: pointer;'> <span class='fa fa-angle-down'></span></button>" +
                                        " </div>"

                                }

                            }

                            else {

                                return "";
                            }

                        }
                    },
                    {
                        field: 'Prioridad',
                        title: 'Order',
                        width: "50px",
                        sortable: true,
                        align: 'center',
                        formatter: function (value, row, index) {
                            return value;
                            //if (row.TipoId == 2 || row.TipoId == 11) {

                            //    return value;
                            //}
                            //else {

                            //    return "";
                            //}
                        }
                    },

                    {
                        field: 'IdActividadStr',
                        title: 'Item',
                        width: "130px",
                        formatter: function (value, row, index) {

                            return '<a style="color: #337ab7" class="btn btn-link" onclick="showitemfrombl(' + row.IdActividad + ' )">' + value + '</a>';

                        }
                    },
                    {
                        field: 'TipoNombre',
                        title: 'Type',
                        width: "90px"
                    },
                    {
                        field: 'BR',
                        title: 'Title',
                        width: "650px",
                        formatter: function (value, row, index) {

                            //return '<img src="/Content/Project/Imagenes/' + row.TipoUrl + '" class="img-dt" title="' + row.TipoNombre + '" style="width:20px; height:20px;" /> <a style="color: #337ab7" class="btn btn-link" onclick="showitemfrombl(' + row.IdActividad + ' )">' + value + '</a>' + "<button class='btn btn-grid btn-condensed btnBacklog' style='padding:8px;' title='Copiar' onclick='CopyItemfrombl(" + row.IdActividad + ");' style='cursor: pointer;'> <span class='fa fa-copy'></span></button>";

                            if (row.Puntos != null) {
                                return '<img src="/Content/Project/Imagenes/' + row.TipoUrl + '" class="img-dt" title="' + row.TipoNombre + '" style="width:20px; height:20px;" />' + value + " <span class='badge badge-info' title='Puntos historia' style='cursor:pointer;'>" + row.Puntos + "</span> <button class='btn btn-grid btn-condensed btnBacklog' style='padding:8px;' title='Copiar' onclick='CopyItemfrombl(" + row.IdActividad + ");' style='cursor: pointer;'> <span class='fa fa-copy'></span></button> ";

                            }
                            else {

                                return '<img src="/Content/Project/Imagenes/' + row.TipoUrl + '" class="img-dt" title="' + row.TipoNombre + '" style="width:20px; height:20px;" />' + value + "<button class='btn btn-grid btn-condensed btnBacklog' style='padding:8px;' title='Copiar' onclick='CopyItemfrombl(" + row.IdActividad + ");' style='cursor: pointer;'> <span class='fa fa-copy'></span></button> ";

                            }


                        }
                    },
                    {
                        field: 'Estatus',
                        title: 'Status',
                        sortable: true,
                        align: 'left',
                        formatter: function (value, row, index) {

                            if (row.TipoId == 2) {

                                return "";
                            }
                            else {

                                if (value == 'A') {

                                    return '<span  class="fa fa-fw fa-circle text-info "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left; width:90px;"><span>' + row.EstatusStr + '<span>';

                                }
                                else if (value == 'P') {
                                    return '<span  class="fa fa-fw fa-circle text-progress "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left;width:90px;"><span>' + row.EstatusStr + '<span>';

                                }
                                else if (value == 'R' || value == 'V') {
                                    return '<span  class="fa fa-fw fa-circle text-warning "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left;width:90px;"><span>' + row.EstatusStr + '<span>';

                                }
                                else if (value == 'X') {
                                    return '<span  class="fa fa-fw fa-circle text-danger "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left; width:90px;"><span>' + row.EstatusStr + '<span>';

                                }
                                else if (value == 'L') {
                                    return '<span  class="fa fa-fw fa-circle text-success "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left; width:90px;"><span>' + row.EstatusStr + '<span>';

                                }
                                else if (value == 'C') {
                                    return '<span  class="fa fa-fw fa-circle text-muted "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left;width:90px;"><span>' + row.EstatusStr + '<span>';

                                }


                            }


                        }
                    },

                    {
                        field: 'PrioridadStr',
                        title: 'Prioridad',
                        sortable: true,
                        align: 'left',
                    },
                    {
                        field: 'ClaveUsuario',
                        sortable: true,
                        align: 'left',
                        title: 'Assigned',
                        formatter: function (value, row, index) {
                            if (value == "") {

                                return "";
                            }
                            else {

                                return `<img src=" https://app.yitpro.com/Archivos/Fotos/${value}.jpg" class="img-dt" style="width: 35px; height: 35px" /><a class="btn btn-link"> ${row.AsignadoStr}</a>`
                            }

                        }
                    },

                    {
                        field: 'Sprint',
                        title: 'Sprint',
                        sortable: true,
                        align: 'left',
                    }
                ],
                treeShowField: 'BR',
                parentIdField: 'IdActividadR1',
                onPostBody: function () {
                    var columns = $table.bootstrapTable('getOptions').columns

                    if (columns && columns[0][1].visible) {
                        $table.treegrid({
                            treeColumn: 4,
                            initialState: "collapsed",
                            onChange: function () {
                                $table.bootstrapTable('resetView')
                            }
                        })
                    }
                }
            })

            //$table.bootstrapTable({

            //    data: dsBacklog2,
            //    idField: 'IdActividad',
            //    toolbar: "#toolbar",
            //    search: true,
            //    idtable: "saveId",
            //    columns: [
            //        {
            //            field: 'IdActividad',
            //            title: '',
            //            width: "30",
            //            formatter: function (value, row, index) {

            //                if (row.TipoId == 4) {
            //                    return '<div class="btn-group pull-left" >'
            //                        + '<button  class="btn btn-grid  dropdown-toggle" data-toggle="dropdown">' +
            //                        '<span class="fa fa-plus-circle"></span>' +
            //                        '<span class=""></span>'
            //                        + '</button>' +
            //                        '<ul class="dropdown-menu" role="menu" style="position: relative">' +
            //                        '<li><a href="#" onclick="newItemBL(1,' + value + ' );"> <img src="/Content/Project/Imagenes/task.png" style="height:24px; width:24px;margin-right:4px;" class="pull-left img-dt" alt="Task"> Task</a></li>' +
            //                        '<li><a href="#" onclick="newItemBL(7,' + value + ' );"> <img src="/Content/Project/Imagenes/bug.png" style="height:24px; width:24px;margin-right:4px;" class="pull-left img-dt" alt="Bug"> Bug</a></li>' +
            //                        '<li><a href="#" onclick="newItemBL(8,' + value + ' );"> <img src="/Content/Project/Imagenes/testcase.png" style="height:24px; width:24px;margin-right:4px;" class="pull-left img-dt" alt="Test Case"> Test Case</a></li>' +

            //                        '</ul></div>';
            //                }
            //                else if (row.TipoId == 2) {
            //                    return "<button class='btn btn-grid' title='Agregar HU' onclick='newItemBL(4," + value + ");' style='cursor: pointer;'> <span class='fa fa-plus-circle'></span></button>"

            //                }
            //                else {

            //                    return "";
            //                }

            //            }
            //        },

            //        {
            //            field: 'IdActividadStr',
            //            title: '#',
            //            width: "130px"
            //        },
            //        {
            //            field: 'TipoNombre',
            //            title: 'Tipo',
            //            width: "90px"
            //        },
            //        {
            //            field: 'BR',
            //            title: 'Título',
            //            width: "450px",
            //            formatter: function (value, row, index) {

            //                return '<img src="/Content/Project/Imagenes/' + row.TipoUrl + '" class="img-dt" title="' + row.TipoNombre + '" style="width:24px; height:24px; margin-left:6px;" /> <a style="color: #337ab7" class="btn btn-link" onclick="showitemfrombl(' + row.IdActividad + ' )">' + value + '</a>';

            //            }
            //        },
            //        {
            //            field: 'Estatus',
            //            title: 'Estatus',
            //            sortable: true,
            //            align: 'left',
            //            formatter: function (value, row, index) {

            //                if (row.TipoId == 2) {

            //                    return "";
            //                }
            //                else {

            //                    if (value == 'A') {

            //                        return '<span  class="fa fa-fw fa-circle text-info "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left; width:90px;"><span>' + row.EstatusStr + '<span>';

            //                    }
            //                    else if (value == 'P') {
            //                        return '<span  class="fa fa-fw fa-circle text-progress "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left;width:90px;"><span>' + row.EstatusStr + '<span>';

            //                    }
            //                    else if (value == 'R' || data == 'V') {
            //                        return '<span  class="fa fa-fw fa-circle text-warning "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left;width:90px;"><span>' + row.EstatusStr + '<span>';

            //                    }
            //                    else if (value == 'X') {
            //                        return '<span  class="fa fa-fw fa-circle text-danger "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left; width:90px;"><span>' + row.EstatusStr + '<span>';

            //                    }
            //                    else if (value == 'L') {
            //                        return '<span  class="fa fa-fw fa-circle text-success "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left; width:90px;"><span>' + row.EstatusStr + '<span>';

            //                    }
            //                    else if (value == 'C') {
            //                        return '<span  class="fa fa-fw fa-circle text-muted "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left;width:90px;"><span>' + row.EstatusStr + '<span>';

            //                    }


            //                }


            //            }
            //        },
            //        {
            //            field: 'ClaveUsuario',
            //            sortable: true,
            //            align: 'left',
            //            title: 'Asignado',
            //            formatter: function (value, row, index) {
            //                if (value == "") {

            //                    return "";
            //                }
            //                else {

            //                    return `<img src=" https://axsis.yitpro.com/Archivos/Fotos/${value}.jpg" class="img-dt" style="width: 35px; height: 35px" /><a class="btn btn-link"> ${row.AsignadoStr}</a>`
            //                }

            //            }
            //        },
            //        {
            //            field: 'Prioridad',
            //            title: 'Prioridad',
            //            sortable: true,
            //            align: 'center',
            //        },
            //        {
            //            field: 'Sprint',
            //            title: 'Sprint',
            //            sortable: true,
            //            align: 'left',
            //        }
            //    ],
            //    treeShowField: 'BR',
            //    parentIdField: 'IdActividadR1',
            //    onPostBody: function () {
            //        var columns = $table.bootstrapTable('getOptions').columns

            //        if (columns && columns[0][1].visible) {
            //            $table.treegrid({
            //                treeColumn: 3,
            //                initialState: "collapsed",
            //                onChange: function () {
            //                    $table.bootstrapTable('resetView')
            //                }
            //            })
            //        }
            //    }
            //})

            recarga = true;

        }



    }
    else {

        MensajeError(data.Mensaje);
    }

}

function MoveItemBL(TipoId, TipoMov, IdActividad) {


    const data = POST('/BackLog/MoverOrdenBL', { IdActividad: IdActividad, IdProyecto: $("#SelProyectoBL").val(), TipoId: TipoId, TipoMov: TipoMov });



    ConsultaBacklog();
}


function GuardarEpica() {


    var url = $('#urlGuardarActividad').val();

    Actividad = {
        IdActividad: 0,
        IdUsuarioAsignado: -1,
        Descripcion: "",
        CriterioAceptacion: "",
        BR: $("#TxtNewEpic").val().trim(),
        //DocumentoRef: $("#FlArchivo").parent().next().text(),
        TiempoEjecucion: 0,
        HorasFacturables: 0,
        HorasAsignadas: 0,
        IdProyecto: $("#SelProyectoBL").val(),
        IdIteracion: -1,
        TipoActividadId: -1,
        ClasificacionId: -1,
        IdUsuarioResponsable: -1,
        Planificada: 1,
        Prioridad: parseInt($('#LastWI').val()) + 1,
        //FechaInicio: fechaIni,
        //FechaSolicitado: fechaSol,
        HorasFinales: 0,
        Retrabajo: false,
        Critico: false,
        /* FechaTermino: fechaC,*/
        /*   IdActividadRef: $("#SelActividadRef").val() !== '-1' && $("#SelActividadRef").val() != null ? $("#SelActividadRef").val() : $("#SelActividadRefPeer").val(),*/
        IdListaRevision: 0,
        TipoId: $('#SelTipoSaveF').val(),
        IdActividadR1: 0
    };

    $.ajax({
        url: url,
        data: JSON.stringify(Actividad),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {

            if (data.Exito) {
                $('#epic-div').addClass('hidden');

                var idemoji = $("#TxtNewEpic").attr('data-id');
                $("div[data-id='" + idemoji + "'][data-type='input']").text('');
                ConsultaBacklog();
            }
            else {

                MensajeAdvertencia(data.Mensaje);
            }
        },
        complete: FinalizaLoading,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Ocurrió un error inesperado, por favor vuelva a intentar.");
        }
    });



    return false;
};



var IdActividadRelBL;
function NewItemFromBLF(Tipo, IdActividadRel){
    IdActividadRelBL = IdActividadRel;

    var indexes = $.map(dsBacklog2, function (obj, index) {
        if (obj.IdActividad == IdActividadRel) {
            return index;
        }
    });


    var idemoji = $("#TxtNewTFM").attr('data-id');
    $("div[data-id='" + idemoji + "'][data-type='input']").text('');
    $("div[data-id='" + idemoji + "'][data-type='input']").focus();

    $('#SelTipoSaveFM').val(Tipo);
    $('#SelTipoSaveFM').selectpicker('refresh');
    $("#bc1").text(dsBacklog2[indexes[0]].BR);
    $("#bc2").text($("#SelTipoSaveFM option:selected").attr('item'));

    $('#MdlCrearBLItem').modal('show');
    $('#TxtNewTFM').val("");
    $('#TxtNewTFM').focus();
    return false;

}

$(document).on('change', '#SelTipoSaveFM', function (e) {

    $("#bc2").text($("#SelTipoSaveFM option:selected").attr('item'));


    return false;

});


$(document).on('click', '#BtnNewItemBLFM', function (e) {

    $('#MdlCrearBLItem').modal('hide');



    newItemBL($('#SelTipoSaveFM').val(), IdActividadRelBL);



    //var idemoji = $("#TxtBR").attr('data-id');
    //$("div[data-id='" + idemoji + "'][data-type='input']").text($("#TxtNewTFM").val());
   
    return false;
});


$(document).on('click', '#BtnSaveFM', function (e) {

    if ($("#TxtNewTFM").val().trim() != "") {

        GuardarWIBL();
    }
    else {

        MensajeAdvertencia("Ingrese el título.");
    }

    return false;
});



function GuardarWIBL() {


    var url = $('#urlGuardarActividad').val();

    Actividad = {
        IdActividad: 0,
        IdUsuarioAsignado: -1,
        Descripcion: "",
        CriterioAceptacion: "",
        BR: $("#TxtNewTFM").val().trim(),
        TiempoEjecucion: 0,
        HorasFacturables: 0,
        HorasAsignadas: 0,
        IdProyecto: $("#SelProyectoBL").val(),
        IdIteracion: -1,
        TipoActividadId: -1,
        ClasificacionId: -1,
        IdUsuarioResponsable: -1,
        Planificada: 1,
        Prioridad:  1,
        HorasFinales: 0,
        Retrabajo: false,
        Critico: false,
        IdListaRevision: 0,
        TipoId: $('#SelTipoSaveFM').val(),
        IdActividadR1: IdActividadRelBL
    };

    $.ajax({
        url: url,
        data: JSON.stringify(Actividad),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {

            if (data.Exito) {
                $('#MdlCrearBLItem').modal('hide');
                MensajeExito(data.Mensaje);
                ConsultaBacklog();
            }
            else {

                MensajeAdvertencia(data.Mensaje);
            }
        },
        complete: FinalizaLoading,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Ocurrió un error inesperado, por favor vuelva a intentar.");
        }
    });



    return false;
};





$(document).on('click', '#BtnSaveEpic', function (e) {

    if ($("#TxtNewEpic").val().trim() != "") {

        GuardarEpica();
    }
    else {

        MensajeAdvertencia("Ingrese el título.");
    }

    return false;
});


function ExpandCollappse(tipo) {

    $('#tblBacklog').treegrid(tipo);

    return false;
}


$(document).on('change', '#SelTipoBL', function (e) {

    ConsultaBacklog();
    return false;

});

$(document).on('change', '#SelEstatusSP', function (e) {


    CargarSprintsWI();
   

    return false;

});



async function CargarSprintsWI() {

    Filtros = {
        Tipo: $("#SelTipoBL").val(),
        IdProyecto: $("#SelProyectoBL").val()

    }
    const data = await POST('/Proyectos/ConsultarSprintsV3', { IdProyecto: $('#IdProyecto').val(), Estatus: $('#SelEstatusSP').val() });

    if (data.Exito) {

        $('#tblSprintWI').empty();


        var sprints = jQuery.parseJSON(data.Sprints);
        ganttSprint = jQuery.parseJSON(data.Gantt);

        if (sprints.length > 0) {
            $.each(sprints, function (key, value) {


                var sp = '<tr>' +
                    '<td><a onclick= "VerSprint(' + value.IdIteracion + ')"><h4 class="no-margins font-extra-bold">' + value.Nombre +
                    "<span  class='btn btn-small btn-grid' style='text-align:left;color:#000;'><span>" + value.EstatusStr + "<span><span class='fa fa-fw fa-circle " + value.Estatus + "'></span> </span>" +
                    '</h4></a> <small>' + value.Objetivo + '</small>' +
                    '<div class="progress progress-small">' +
                    '<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width:' + value.Avance + '%;"></div>' +
                    '</div>' +
                    '</td>' +
                    '<td><div class="pull-right font-bold text-primary"> <h4 class="text-default">' + value.Avance + '%</h4></div> </td>' +
                    '</tr>'

                $('#tblSprintWI').append(sp);

            });


        }
        else {

            var sp = '<tr><td><h4 class="no-margins font-extra-bold"> No hay sprints </h4>  </td></tr>'

            $('#tblSprintWI').append(sp);
        }

    }
    else {

        MensajeError(data.Mensaje);
    }

}


function VerBacklog() {

    $('#divBacklog').show();
    $('#divSprintsWI').hide();

    return false;

}

function VerSprints() {
    $('#divSprintsWI').show();
    $('#divBacklog').hide();
   
    return false;
}

function zoomIn() {
    gantt.ext.zoom.zoomIn();
}
function zoomOut() {
    gantt.ext.zoom.zoomOut()
}

function CambiarZoom(zoom) {
    gantt.ext.zoom.setLevel(zoom);
}


function RoadmapBacklog() {


    $("#MdlRoadMap").modal('show');


    gantt.config.min_column_width = 50;


    gantt.plugins({
        tooltip: true
    });
    gantt.attachEvent("onGanttReady", function () {
        var tooltips = gantt.ext.tooltips;
        tooltips.tooltip.setViewport(gantt.$task_data);
    });

    gantt.config.scale_height = 90;

    gantt.config.columns = [
        {
            name: "avance", label: "", align: "center", width: 70, template: function (obj) {


                return `<img src="/Content/Project/Imagenes/${obj.avance}" title="${obj.asignadostr}" class="img-dt" style="width: 24px; height: 24px" />`;

            }
        },
        { name: "text", label: "Actividad", tree: true, width: 250, resize: true, min_width: 10 },
        { name: "start_date", label: "Fecha inicio", align: "center", width: 120, resize: true },
        { name: "end_date", label: "Fecha fin", align: "center", width: 120, resize: true }


    ];

    var zoomConfig = {
        levels: [
            {
                name: "day",
                scale_height: 27,
                min_column_width: 80,
                scales: [
                    { unit: "day", step: 1, format: "%d %M" }
                ]
            },
            {
                name: "week",
                scale_height: 70,
                min_column_width: 50,
                scales: [
                    {
                        unit: "week", step: 1, format: function (date) {
                            var dateToStr = gantt.date.date_to_str("%d %M");
                            var endDate = gantt.date.add(date, -6, "day");
                            var weekNum = gantt.date.date_to_str("%W")(date);
                            return dateToStr(date) + " - " + dateToStr(endDate);
                        }
                    },
                    { unit: "day", step: 1, format: "%j" }
                ]
            },
            {
                name: "month",
                scale_height: 70,
                min_column_width: 80,
                scales: [

                    { unit: "month", step: 1, format: "%F %Y" },
                   /* { unit: "year", step: 1, format: "%Y" },*/
                    { unit: "day", format: "%j %M" }

                ]
            },
            {
                name: "quarter",
                height: 50,
                min_column_width: 90,
                scales: [
                    { unit: "month", step: 1, format: "%M" },
                    {
                        unit: "quarter", step: 1, format: function (date) {
                            var dateToStr = gantt.date.date_to_str("%M");
                            var endDate = gantt.date.add(gantt.date.add(date, 3, "month"), -1, "day");
                            return dateToStr(date) + " - " + dateToStr(endDate);
                        }
                    }
                ]
            },
            {
                name: "year",
                scale_height: 50,
                min_column_width: 30,
                scales: [
                    { unit: "year", step: 1, format: "%Y" },
                    { unit: "month", format: "%F" }
                ]
            }
        ]
    };


    gantt.templates.task_class = function (start, end, task) {


        if (task.progress >= 1) {
            return "bg-success"

        }

    };


    gantt.ext.zoom.init(zoomConfig);
    gantt.ext.zoom.setLevel("month");


    gantt.config.readonly = true;
    gantt.i18n.setLocale("es");

    gantt.init("roadmap");
    gantt.clearAll();
    gantt.parse({
        data: ganttBL

    });



    return false;
}


function RoadmapSprint() {


    $("#MdlRoadMap").modal('show');
    gantt.config.min_column_width = 50;
    gantt.plugins({
        export_api: true,
    });

    gantt.config.scale_height = 90;

    gantt.config.columns = [

        { name: "text", label: "Sprint", tree: true, width: 250, resize: true, min_width: 10 },
        { name: "start_date", label: "Fecha inicio", align: "center", width: 120, resize: true },
        { name: "end_date", label: "Fecha fin", align: "center", width: 120, resize: true },
        { name: "avance", label: "avance", align: "right", width: 120, resize: true }

    ];

    var zoomConfig = {
        levels: [
            {
                name: "day",
                scale_height: 27,
                min_column_width: 80,
                scales: [
                    { unit: "day", step: 1, format: "%d %M" }
                ]
            },
            {
                name: "week",
                scale_height: 70,
                min_column_width: 50,
                scales: [
                    {
                        unit: "week", step: 1, format: function (date) {
                            var dateToStr = gantt.date.date_to_str("%d %M");
                            var endDate = gantt.date.add(date, -6, "day");
                            var weekNum = gantt.date.date_to_str("%W")(date);
                            return dateToStr(date) + " - " + dateToStr(endDate);
                        }
                    },
                    { unit: "day", step: 1, format: "%j" }
                ]
            },
            {
                name: "month",
                scale_height: 70,
                min_column_width: 80,
                scales: [

                    { unit: "month", step: 1, format: "%F %Y" },
                    /* { unit: "year", step: 1, format: "%Y" },*/
                    { unit: "day", format: "%j %M" }

                ]
            },
            {
                name: "quarter",
                height: 50,
                min_column_width: 90,
                scales: [
                    { unit: "month", step: 1, format: "%M" },
                    {
                        unit: "quarter", step: 1, format: function (date) {
                            var dateToStr = gantt.date.date_to_str("%M");
                            var endDate = gantt.date.add(gantt.date.add(date, 3, "month"), -1, "day");
                            return dateToStr(date) + " - " + dateToStr(endDate);
                        }
                    }
                ]
            },
            {
                name: "year",
                scale_height: 50,
                min_column_width: 30,
                scales: [
                    { unit: "year", step: 1, format: "%Y" },
                    { unit: "month", format: "%F" }
                ]
            }
        ]
    };

    gantt.templates.task_class = function (start, end, task) {


        if (task.progress >= 1) {
            return "bg-success"

        }

    };


    gantt.ext.zoom.init(zoomConfig);
    gantt.ext.zoom.setLevel("month");


    gantt.config.readonly = true;
    gantt.i18n.setLocale("es");

    gantt.init("roadmap");
    gantt.clearAll();
    gantt.parse({
        data: ganttSprint

    });


}




async function ConsultaGraficasBacklog() {


    const data = await POST('/BackLog/ConsultaGraficasBacklog', { IdProyecto: $("#IdProyecto").val() });

    if (data.Exito) {

        var dsDatos = jQuery.parseJSON(data.LstGraficas);

        $('#GraficaActs').empty();

        $('#scriptsActs').empty();

        $.each(dsDatos, function (key, value) {


            var id = value.id;
            var nombre = value.Nombre;
            var tipo = "Pie";
            var series = value.Series;
         
            var valores = value.LstValores;
        
            var idgrafica = "grafica" + numV.toString();
            var vargrafica = "vargrafica" + numV.toString();
            var vartabla = "vartabla" + numV.toString();

            var tema = nombre == "Casos de prueba" ? "temagraficaestatusTC" : "temagraficaestatustask";


            if (tipo == "Pie") {
          

                var grafica = "<div class='col-md-6'>"
                    + "     <div class='panel panel-default projectcard'>"
                    + "                         <div class='panel-body profile'>"
                    + "                             <div class='row headerproyecto''>"
                    + "                                     <div class='col-md-12'>"
                    + "                                          <h4>" + nombre + " (" + value.Tipo + ")</h4>" 
                    + "                                     </div>"
                    + "                               <div id='" + idgrafica + "' style='height:350px;' > "
                    + "                                </div>"
                    + "                         </div>"
                    + "                       </div>"
                    + "                 </div>"





                var script = "<script>"
                    + " var " + vargrafica + " = echarts.init(document.getElementById('" + idgrafica + "')," + tema + ");"
                    + "" + vargrafica + ".setOption({ "
                    + "              tooltip: {"
                    + "                   trigger: 'item',"
                    + "                   formatter: '{a} <br/>{b} : {c} ({d}%)'"
                    + "               },"
                    + "              calculable: true,"
                    + "               legend: { "
                    + '                   orient: "vertical",'
                    + '                   x: "left",'
                    + "                   y: 'center',"
                    + '                   data:' + series + ''
                    + "               },"
                    + "               toolbox: {"
                    + "show: true,"
                    + " feature: { "
                    + "            mark: { show: true },"
                    + "            magicType: { show: true, type: ['funnel', 'pie'] , title:''},"
                    + "    saveAsImage: {"
                    + "        show: true, "
                    + "        title: 'Descargar'"
                    + "    }"
                    + "}"
                    + "               }, "
                    + "               series: [{ "
                    + "                   name: '',"
                    + "                   type: 'pie', "
                    + "                   radius: ['0%', '65%'],"
                    + "                   itemStyle: { "
                    + "                       normal: { "
                    + "                           label: { "
                    + "                               show: false "
                    + "                           },"
                    + "                           labelLine: {"
                    + "                               show: false "
                    + "                           }"
                    + "                       },"
                    + "                       emphasis: {"
                    + "                           label: {"
                    + "                               show: true,"
                    + "                               position: 'right',"
                    + "                               textStyle: {"
                    + "                                   fontSize: '10',"
                    + "                                   fontWeight: 'normal' "
                    + "                               } "
                    + "                           }"
                    + "                       }"
                    + "                   },"
                    + '                   data: ' + valores + ''
                    + "               }]"
                    + "           });"
                    + "</script>"


                $('#GraficaActs').append(grafica);
                $('#scriptsActs').append(script);

            }

            numV = numV + 1;

        });
    }
    else {

        MensajeError(data.Mensaje);
    }

}


$("#BtAgregaDocumento").click(function () {

    $("#FlImportaDoc").parent().next().text("");
    $("#FlImportaDoc").val("");
    $('#BtnGuardarDoc').addClass('hidden');
    ConsultaTiposDocumento();
    $("#IdProDoc").val(0);
    $('#MdlImportarDocProy').modal({ keyboard: false });

    return false;

});


function EditarDocumentoProy(IdProDoc, TipoDocumentoId) {

    $("#FlImportaDoc").parent().next().text("");
    $("#FlImportaDoc").val("");
    $('#BtnGuardarDoc').addClass('hidden');
    ConsultaTiposDocumento();
    $("#IdProDoc").val(IdProDoc);
    $('#SelTipoDocumentoP').val(TipoDocumentoId);
    $('#SelTipoDocumentoP').selectpicker('refresh');
    $('#MdlImportarDocProy').modal({ keyboard: false });

    return false;


};


$(document).on("change", "#FlImportaDoc", function (e) {
    $("#FlImportaDoc").parent().next().next().text("");

    if (e.target.files != undefined) {

        var reader = new FileReader();

        if (this.files[0].size > 11000000) {
            MensajeAdvertencia("El tamaño máximo es de 10mb");
            this.value = "";
 
        }
        else {
            reader.onload = function (f) {

                $('#BtnGuardarDoc').removeClass('hidden');
            };
            reader.readAsDataURL(e.target.files.item(0));

        }

    }

});


$(document).on('click', '#BtnGuardarDoc', function (e) {



    if ($("#SelTipoDocumentoP").val() == -1) {
        MensajeAdvertencia("Datos requeridos: <br>  -Tipo documento");
        return false;

    }

    var url = $('#urlGuardarDocumentoProy').val();

    var form_data = new FormData();
    form_data.append("Archivo", $("#FlImportaDoc").prop("files")[0]);
    form_data.append("IdProyecto", $("#IdProyecto").val());
    form_data.append("TipoDocumentoId", $("#SelTipoDocumentoP").val());
    form_data.append("IdProDoc", $("#IdProDoc").val());
    form_data.append("ClaveProy", $("#hdClave").val());

    $.ajax({
        url: url,
        type: "POST",
        contentType: false,
        data: form_data,
        processData: false,
        async: false,
        success: function (Respuesta) {

            $('div.pg-loading-screen').remove();
            if (Respuesta.Exito) {

                ConsultaDocumentos();
                MensajeExito(Respuesta.Mensaje);
            }
            else {
                MensajeAdvertencia(Respuesta.Mensaje);
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            var err = eval("(" + xhr.responseText + ")");
            MensajeError(err.Message);
        }
    });

    return false;
});


async function ConsultaDocumentos() {

 
    const data = await POST('/Proyectos/ObtenerDocumentos', { IdProyecto: $("#IdProyecto").val() });

    if (data.Exito) {

        var dsDocs = jQuery.parseJSON(data.Documentos);
     

        if (recargaDocs) {

            $tableDocs.bootstrapTable('load', dsDocs);
        }
        else {


            $tableDocs.bootstrapTable({

                data: dsDocs,
                idField: 'IdProDoc',
                idtable: "saveId2",
                columns: [

                    {
                        field: 'TipoDocumentoStr',
                        title: 'Tipo documento',
                    },                 
                    {
                        field: 'Name',
                        title: 'Documento',
                        formatter: function (value, row, index) {

                            if (value != null) {

                                if (row.Extension == "pdf") {
                                    return '<span class="fa fa-file-pdf-o" style="font-size:18px" > </span>' + '<a  class="" onclick = "DescargaDocumentoProy(' + row.IdProDoc + ');return false;" > ' + value + '</a >';
                                }
                                else if (row.Extension == "xls" || row.Extension == "xlsx") {
                                    return '<span class="fa  fa fa-file-excel-o" style="font-size:18px"  > </span>' + '<a  class="" onclick = "DescargaDocumentoProy(' + row.IdProDoc + ');return false;" > ' + value + '</a >';
                                }
                                else if (row.Extension == "doc" || row.Extension == "docx") {
                                    return '<span class="fa fa-file-word-o" style="font-size:18px"  > </span>' + '<a  class="" onclick = "DescargaDocumentoProy(' + row.IdProDoc + ');return false;" > ' + value + '</a >';

                                }
                                else if (row.Extension == "png" || row.Extension == "jpg" || row.Extension == "jpeg" || row.Extension == "gif") {
                                    return '<span class="fa fa-file-image-o" style="font-size:18px" > </span>' + '<a  class="" onclick = "DescargaDocumentoProy(' + row.IdProDoc + ');return false;" > ' + value + '</a >';

                                }
                                else {

                                    return '<span class="fa fa-file-o"  style="font-size:18px" > </span>' + '<a  class="" onclick = "DescargaDocumentoProy(' + row.IdProDoc + ');return false;" > ' + value + '</a >';
                                }
                            }
                            else {

                                return '<p class="text-danger">PENDIENTE</p>'
                            }

                        }
                    },
                    {
                        field: 'NombreCreo',
                        title: 'Creó',
                        formatter: function (value, row, index) {

                            if (row.Name != null) {

                              return value;
                            }
                            else {

                                return ''
                            }

                        }
                    },
                    {
                        field: 'FechaCreo',
                        title: 'Fecha actualización',
                        width: "120px",
                        align: 'center',
                        sortable: true,
                        formatter: function (value, row, index) {


                            if (row.Name != null) {

                                return (value == null || value == "" ? "" : moment(value).format("DD/MM/YYYY hh:mm:ss"))
                            }
                            else {

                                return ''
                            }

                           
                        }
                    },

                    {
                        field: 'IdProDoc',
                        title: '',
                        width: "150px",
                        formatter: function (value, row, index) {


                            if (row.Name != null) {

                                return '<div class="btn-group pull-left">' +
                                    '<button class="btn btn-default" title = "Cargar" onclick="EditarDocumentoProy(' + value + ', '+ row.TipoDocumentoId +');return false;"><span class="fa fa-upload"></span></button>' +
                                    '<button class="btn btn-default" title= "Descargar" onclick="DescargaDocumentoProy(' + value + ');return false;"><span class="fa fa-download"></span></button>' +
                                    '<button class="btn btn-default" title = "Eliminar" onclick="ConfirmarEliminarDocumento(' + value + ');return false;"><span class="fa fa-trash"></span></button>' +
                                    '</div>'
                            }
                            else {

                                return '<div class="btn-group pull-left">' +
                                    '<button class="btn btn-default" title = "Cargar" onclick="EditarDocumentoProy(' + value + ', ' + row.TipoDocumentoId + ');return false;"><span class="fa fa-upload"></span></button>' +
                                    '<button class="btn btn-default" title = "Eliminar" onclick="ConfirmarEliminarDocumento(' + value + ');return false;"><span class="fa fa-trash"></span></button>' +
                                    '</div>'
                            }


                  

                        }
                    },



                ],

            });


            recargaDocs = true;

        }



    }
    else {

        MensajeError(data.Mensaje);
    }

}
function ConsultaTiposDocumento() {

     $.ajax({
        url: '/CatalogoGeneral/ConsultaCatalogo/',
        data: JSON.stringify({ idTabla: 22}),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            if (data.Exito) {

                $('#SelTipoDocumentoP').empty();
                $('#SelTipoDocumentoP').append(data.LstCatalogo);
                $('#SelTipoDocumentoP').selectpicker('refresh');
            }
            else {
                MensajeAdvertencia(data.Mensaje);
            }
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Ha ocurrido un error inesperado, por favor vuelva a intentarlo.");
        }
    });
    return false;

}



function DescargaDocumentoProy(IdProDoc) {
    var url = $('#urlDescargarDocumento').val();

    $.ajax({
        url: url,
        data: JSON.stringify({ IdProDoc }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            if (data.Exito) {
                window.open( data.Documento,"_blank");


            }
            else {

                MensajeAdvertencia(data.Mensaje);
            }

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Ha ocurrido un error inesperado, por favor vuelva a intentarlo.");
        }
    });


    return false;
}

var IdProDocDel;
function ConfirmarEliminarDocumento(IdProDoc) {

    IdProDocDel = IdProDoc;
    MensajeConfirmarAccion("¿Esta seguro  de eliminar el documento?", "BtnEliminaDocumentoProy");

    return false;
}

$(document).on('click', '#BtnEliminaDocumentoProy', function (e) {
    var url = $('#urlEliminarDocumento').val();

    $.ajax({
        url: url,
        data: JSON.stringify({ IdProDoc: IdProDocDel }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            if (data.Exito) {

                ConsultaDocumentos();
            }
            else {

                MensajeAdvertencia(data.Mensaje);
            }

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Ha ocurrido un error inesperado, por favor vuelva a intentarlo.");
        }
    });


    return false;
});






