var dsEstatus = [];
var editarAutorizaciones = [];
var tablaAutorizaciones;
var columnasAutorizaciones = [

    {
        "data": "IdAutorizacion",
        "visible": false
    },
    {
        "class": "text-center",
        "render": function (data, type, row) {
            return '<button class="btn btn-default btn-sm btnReordenar" name="btnSubir" id="btnSubir' + row.IdAutorizacion + '"><span class="fa fa-chevron-up"></span></button><button class="btn btn-default btn-sm btnReordenar" name="btnBajar" id="btnBajar' + row.IdAutorizacion + '"><span class="fa fa-chevron-down"></span></button>'
        },
        'bSortable': false, 'aTargets': [1]

    },
    {
        "data": "Nombre",
        "class": "text-center EditarNombre",
        'bSortable': false, 'aTargets': [1]

    },
    {
        "data": "Secuencia",
        "visible": false
    },
    //{
    //    "data": "IdEstatusOrigen",
    //    "visible": false,
    //    'bSortable': false, 'aTargets': [1]

    //},
    //{
    //    "class": "text-center",
    //    "render": function (data, type, row) {
    //        return "<select class='form-control  ReqEdita' id='SelEstatusOrigen" + row.IdAutorizacion + "' item='Estatus origen' >" + $("#CmbEstatusOrigen").val() + "</select>";
    //    },
    //    'bSortable': false, 'aTargets': [1]

    //},
    //{
    //    "data": "IdEstatusDestino",
    //    "visible": false
    //},
    //{
    //    "class": "text-center",
    //    "render": function (data, type, row) {
    //        return "<select class='form-control ReqEdita ' id='SelEstatusDestino" + row.IdAutorizacion + "' item='Estatus destino'>" + $("#CmbEstatusDestino").val() + "</select>";
    //    },
    //    'bSortable': false, 'aTargets': [1]

    //},
    {
        "data": "TipoAutorizacion",
        "visible": false
    },

    //{
    //    "class": "text-center",
    //    "render": function (data, type, row) {
    //        return "<select class='form-control  SelTipoAut ReqEdita' id='SelTipoAutorizacion" + row.IdAutorizacion + "' item='Tipo Autorizacion'>" + $("#SelTipoAut").html() + "</select>";
    //    },
    // /*   "visible": false,*/
    //    'bSortable': false, 'aTargets': [1]

    //},

    {
        "class": "text-left",
        "render": function (data, type, row) {
            if (row.TipoAutorizacion == 1) {
                return "Asignación por perfil";
            }
            else if (row.TipoAutorizacion == 3) {
                return "Asignar a un usuario";
            }
            else {
                return "Asignar a jefe directo";
            }
        },

    },


    {
        "class": "text-left",
        "render": function (data, type, row) {
            if (row.TipoAutorizacion == 1) {
                return row.IdTUAutorizaStr;
            }
            else if (row.TipoAutorizacion == 3) {
                return row.IdUAutorizaStr;
            }
            else {
                return "";
            }
        },

    },
    //{
    //    "data": "IdUAutoriza",
    //    "visible": false
    //},
    //{
    //    "class": "text-center",
    //    "render": function (data, type, row) {
    //        return "<select class='form-control ReqEdita' id='SelAutoriza" + row.IdAutorizacion + "' item='Asignar autorizacion '>" + (row.TipoAutorizacion == 3 ? $("#cmbTUsuarios").val() : $('#cmbUsuarios').html()) + "</select>";
    //    },
    //    "visible": false,
    //    'bSortable': false, 'aTargets': [1]

    //},

    {
        "data": "MontoMin",
        "class": "text-center",
        "render": function (data, type, row) {
            return '$' + $.number(data, 2, ".", ",");
        }
    },
    {
        "data": "AprobarAutorizacion",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data) ? "Si" : "No";
        }
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
        'bSortable': false, 'aTargets': [1],
        "render": function (data, type, row) {
            return '<button class="btn btn-default BtnEditarAut"><span class="fa fa-pencil-square-o"></span></button>'
        }
    }
];

function LimpiarFormularioAutorizacion() {
    $('#TxtNombreA').val("");
    $('#TxtNombre').val("");
    $('#TxtSecuencia').text("");
    $('#Asignar').hide();
    $("#SelTipoAut").selectpicker("val", -1);
    $("#SelAsignar").selectpicker("val", -1);

    $("#IdAutorizacion").val(0);
    $('#txtMontoMin').val(0);
    cambiaEstadoSwitch($('#ChkAprobarAutorizacion'), false);
    cambiaEstadoSwitch($('#ChkActivo'), true);

}

function refrescarCombos() {
    var sec = "";
    $('#TblAutorizaciones>tbody>tr').each(function () {

        var row = tablaAutorizaciones.api().row(this);
        var datosFila = row.data();
        if (datosFila != undefined) {
            var IdAutorizacion = datosFila.IdAutorizacion;
            var IdEOrigen = datosFila.IdEstatusOrigen;
            var selectAutoriza = '#SelAutoriza' + IdAutorizacion;
            var Secuencia = datosFila.Secuencia;
            var btnSubir = $("#btnSubir" + IdAutorizacion);
            var btnBajar = $("#btnBajar" + IdAutorizacion);
            //$('#SelEstatusOrigen' + IdAutorizacion).html($('#CmbEstatusOrigen').html());
            //$('#SelEstatusOrigen' + IdAutorizacion).val(IdEOrigen != undefined ? IdEOrigen : -1);
            //var IdEDestino = datosFila.IdEstatusDestino;
            //$('#SelEstatusDestino' + IdAutorizacion).html($('#CmbEstatusDestino').html());
            //$('#SelEstatusDestino' + IdAutorizacion).val(IdEDestino != undefined ? IdEDestino : -1);
            var TipoAutorizacion = datosFila.TipoAutorizacion;

            $('#SelTipoAutorizacion' + IdAutorizacion).html($('#CmbTipoAut').html());
            $('#SelTipoAutorizacion' + IdAutorizacion).val(TipoAutorizacion != undefined ? TipoAutorizacion : -1);
            $(selectAutoriza).show();
            if (TipoAutorizacion == 1) {
                var IdTUsr = datosFila.IdTUAutoriza;
                var selTipos = $('#cmbTUsuarios').html();
                $(selectAutoriza).html(selTipos);
                $(selectAutoriza).val(IdTUsr != undefined ? IdTUsr : -1);
            }
            else if (TipoAutorizacion == 3) {
                var IdUsr = datosFila.IdUAutoriza;
                var selTipos = $('#cmbUsuarios').html();
                $(selectAutoriza).html(selTipos);
                $(selectAutoriza).val(IdUsr != undefined ? IdUsr : -1);
            }
            else if (TipoAutorizacion == 2) {
                $(selectAutoriza).removeClass('.ReqEdita');
                $(selectAutoriza).hide();
                $(selectAutoriza).html("");
                $(selectAutoriza).val(-1);
            }

            if (Secuencia == 1) {
                btnSubir.hide();
                if (Secuencia == dsAutorizaciones.length)
                    btnBajar.hide();
                $('#Secuencia').val(Secuencia);
            }
            else if (Secuencia == dsAutorizaciones.length) {
                btnBajar.hide();
                $('#Secuencia').val(Secuencia);

            }



            if (Secuencia == dsAutorizaciones.length - 1) {
                btnBajar.hide();
                $('#Secuencia').val(Secuencia);
            }



            var s1 = parseInt(Secuencia);
            var s2 = parseInt(dsAutorizaciones.length);
            if (s1 > s2) {

                btnBajar.hide();
                btnSubir.hide();
            }


        }
    });
    //$('.EstatusOrigen').each(function () {
    //    idEstatus = $(this).val();
    //    var existeEstatus = $.grep(dsAutorizaciones, function (a, b) {
    //        return a.IdEstatusOrigen == idEstatus
    //    });
    //    existeEstatus != 0 ? $(this).addClass('hidden') : $(this).removeClass('hidden');

    //})
    /*(".ReqEdita").first().attr("disabled", "disabled").attr("style", readonly);*/
    //$('.EstatusDestino').each(function () {
    //    idEstatus = $(this).val();
    //    var existeEstatus = $.grep(dsAutorizaciones, function (a, b) {
    //        return a.IdEstatusDestino == idEstatus
    //    });
    //    existeEstatus != 0 ? $(this).addClass('hidden') : $(this).removeClass('hidden');
    //})
}

$(document).ready(function () {
    CargaInicialAut();
});

function CargaInicialAut() {
    var url = $('#urlCargaInicial').val();
    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: successCargaInicialAut,
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            MensajeError(errorThrown);
        }
    });
    return false;
}

function successCargaInicialAut(data) {

    if (data.Exito) {
        $('#Secuencia').val(0);
        //$("#SelOficina").html(data.CmbOficinas);
        //$("#SelOficina").val(-1);
        //$("#TxtSecuencia").attr("style", readonly);
        //$('#SelProceso').html(data.CmbProcesos);
        //$("#SelProceso").val(-1);
        dsAutorizaciones = jQuery.parseJSON(data.LstAutorizaciones);;
        tablaAutorizaciones = inicializaTabla($('#TblAutorizaciones'), dsAutorizaciones, columnasAutorizaciones, 3, "asc", false, true, true, true);

        $('#cmbUsuarios').html(data.CmbUsuarios);
        $('#cmbTUsuarios').html(data.CmbTUsuarios);
        $("#CmbTipoAut").html(data.CmbTiposAutorizacion);
        $("#SelTipoAut").html(data.CmbTiposAutorizacion);
        refrescarCombos();
        /*     Inicializar();*/
        /*       $("#TipoConf").val() == 1 ? $("#ConfOficinas").hide() : $("#ConfOficinas").show();*/
        funcionAjustartamano();
    }
    else if (data.Advertencia) {
        MensajeAdvertencia(data.Mensaje);
    }
    else if (data.SesionDesactiva)
        CierraSesion();
    else {
        MensajeError(data.Mensaje);
    }
}
//<-- Autorizaciones-->
//$(document).on("change", ".ReqNuevaAut", function () {
//    if ($("#TipoConf").val() == 2) { //Por Oficinas
//        if ($("#SelOficina").val() != -1 && $("#SelProceso").val() != -1) {
//            ConsultarProceso($("#SelProceso"), $("#SelOficina").val());
//        }
//    }
//    else if ($("#TipoConf").val() == 1) { // General
//        ConsultarProceso($("#SelProceso"), $("#SelOficina").val());
//    }
//    return false;
//})
//<-- Autorizaciones-->

//function ConsultarProceso(Select, IdOficina) {

//    if (editarAutorizaciones.length == 0) {
//        $("#IdProceso").val(0);
//        $("#Secuencia").val(0);
//        if (Select.val() == -1) {
//            dsAutorizaciones = [];
//            refrescaTabla(tablaAutorizaciones, dsAutorizaciones);
//        }
//        else {
//            var idProceso = Select.val();
//            $("#IdProceso").val(idProceso);
//            LlamadaConsultarProceso(idProceso, IdOficina);
//        }
//    }
//    else {
//        var campos = "";
//        for (item in editarAutorizaciones) {
//            campos += " - " + editarAutorizaciones[item].Nombre + " <br> ";
//        }
//        campos = "Las siguientes autorizaciones no han sido guardadas: <br> " + campos;
//        SelectValContinuar = Select.val();
//        Select.val($("#IdProceso").val());

//        SelectContinuar = Select;
//        MensajeConfirmar(campos + "<br>¿Desea continuar sin guardar?", "Continuar(" + IdOficina + ")");

//        return false;
//    }
//}

//var SelectContinuar;
//var SelectValContinuar;
//function Continuar(Oficina) {
//    editarAutorizaciones = [];
//    SelectContinuar.val(SelectValContinuar);
//    ConsultarProceso(SelectContinuar, Oficina);
//}


//function LlamadaConsultarProceso(idProceso, idOficina) {

//    var url = $('#urlConsultaProceso').val();

//    $.ajax({

//        url: url,
//        data: JSON.stringify({
//            IdProceso: idProceso,
//            IdOficina: idOficina
//        }),
//        type: "POST",
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        async: false,
//        success: successLlamadaConsultarProceso,
//        error: function (xmlHttpRequest, textStatus, errorThrown) {

//            MensajeError(errorThrown);
//        }
//    });

//    return false;
//}

//function successLlamadaConsultarProceso(data) {

//    if (data.Exito) {

//        $("#SelEOr").val(-1);
//        dsEstatus = jQuery.parseJSON(data.LstEstatus);
//        dsAutorizaciones = jQuery.parseJSON(data.LstAutorizaciones);
//        refrescaTabla(tablaAutorizaciones, dsAutorizaciones);
//        $('#SelEOr').empty();

//        if (data.CmbEstatusOrigen != "<option value='-1'>--Seleccione--</option>") {
//            $('#SelEOr').append(data.CmbEstatusOrigen);
//            $('#CmbEstatusOrigen').html(data.CmbEstatusOrigen);
//        }
//        else
//            $('#SelEOr').append("<option selected='selected' value='-1'>--Agrege un estatus--</option>");
//        $('#SelEDe').empty();
//        if (data.CmbEstatusDestino != "<option value='-1'>--Seleccione--</option>") {
//            $('#SelEDe').append(data.CmbEstatusDestino);
//            $('#CmbEstatusDestino').html(data.CmbEstatusDestino);
//        }
//        else
//            $('#SelEDe').append("<option selected='selected' value='-1'>--Agrege un estatus--</option>");
//        refrescarCombos();
//        $('#SelEOr,#SelEDe').selectpicker("refresh");
//        $("#BtnGuardarCambios").addClass("hide");
//        funcionAjustartamano();
//    }
//    else if (data.Advertencia) {
//        MensajeAdvertencia(data.Mensaje);
//    }
//    else if (data.SesionDesactiva)
//        CierraSesion();
//    else {
//        MensajeError(data.Mensaje);
//    }
//}


//$(document).on('click', '#BtnNuevoEstatus', function (e) {
//    LimpiarFormularioAutorizacion();
//    if ($('#SelProceso').val() != -1)
//        $('#ModalEditarEstatus').modal('show');
//    else
//        MensajeAdvertencia("Seleccione un proceso");
//})

//$(document).on("click", '#BtnGuardarEstatus', function () {
//    var Mensaje = ValidaCamposRequeridos(".ReqEst");

//    if (Mensaje == 0) {
//        var datosEstatus = {
//            IdEstatusSol: 0,
//            Nombre: $("#TxtNombre").val(),
//            Inicial: false,
//            Final: false,
//            Tipo: $("#IdProceso").val()
//        }
//        LlamadaGuardarDatosEstatus(datosEstatus);
//    }
//    else {
//        MensajeAdvertencia(Mensaje);
//    }
//})

//function LlamadaGuardarDatosEstatus(datosEstatus) {
//    var url = $('#urlGuardarEstatus').val();
//    $.ajax({
//        url: url,
//        data: JSON.stringify(datosEstatus),
//        type: "POST",
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        async: false,
//        success: SuccessLlamadaGuardarDatosEstatus,
//        error: function (xmlHttpRequest, textStatus, errorThrown) {

//            MensajeError(errorThrown);
//        }
//    });
//}

//function SuccessLlamadaGuardarDatosEstatus(data) {
//    if (data.Exito) {
//        MensajeExito(data.Mensaje);
//        LimpiarFormularioAutorizacion();
//        var estatus = jQuery.parseJSON(data.Estatus);
//        $('.ReqEdita').each(function () {
//            var tipo = $(this).attr('item');
//            if (tipo == "Estatus origen" || tipo == "Estatus destino") {
//                var bool;
//                tipo == "Estatus origen" ? bool = true : bool = false;
//                if (bool) {
//                    var opcion = "<option value='" + estatus.IdEstatusSol + "' item='" + estatus.Inicial + "' name='" + estatus.Final + "' class='EstatusOrigen'>" + estatus.Nombre + "</option>";
//                    $(this).append(opcion);
//                    $("#SelEOr").append(opcion);
//                }
//                else {
//                    var opcion = "<option value='" + estatus.IdEstatusSol + "' item='" + estatus.Inicial + "' name='" + estatus.Final + "' class='EstatusDestino'>" + estatus.Nombre + "</option>";
//                    $(this).append(opcion);
//                    $("#SelEDe").append(opcion);
//                }

//            }
//        })
//        $("#CmbEstatusOrigen").append("<option value='" + estatus.IdEstatusSol + "' item='" + estatus.Inicial + "' name='" + estatus.Final + "' class='EstatusOrigen'>" + estatus.Nombre + "</option>");
//        $("#CmbEstatusDestino").append("<option value='" + estatus.IdEstatusSol + "' item='" + estatus.Inicial + "' name='" + estatus.Final + "' class='EstatusDestino'>" + estatus.Nombre + "</option>");
//        dsEstatus.push(estatus);
//        $('#ModalEditarEstatus').modal('toggle');
//        FinalizaLoading();
//        funcionAjustartamano();
//    }
//    else if (data.Advertencia) {

//        MensajeAdvertencia(data.Mensaje);

//    }
//    else if (data.SesionDesactiva)
//        CierraSesion();
//    else {

//        MensajeError(data.Mensaje);
//    }
//}
var secSig = 0;
$(document).on('click', '#BtnNuevaAutorizacion', function (e) {

    /*    if ($('#SelProceso').val() != -1) {*/
    LimpiarFormularioAutorizacion();
    $("#MostrarNuevo").show();
    $("#SelEOr,#SelEDe,#SelTipoAut").addClass("ReqAut").addClass("ReqSel");
    var SecuenciaActual = $('#Secuencia');
    secSig = SecuenciaActual["0"].valueAsNumber + 1;
    $("#TxtSecuencia").text(secSig);
    ////Asignar estatus origen inicial 
    //if (secSig == 1) {
    //    var estatusorigen = $('#SelEOr').text();
    //    if (estatusorigen != '--Agrege un estatus--') {
    //        var indexes = $.map(dsEstatus, function (obj, index) {
    //            if (obj.Inicial == true && obj.IdEstatusSol != 1) {
    //                return index;
    //            }
    //        });
    //        $('#SelEOr').selectpicker("val", dsEstatus[indexes[0]].IdEstatusSol);
    //    }
    //    else {
    //        $('#SelEOr').selectpicker("val", -1);
    //    }
    //}
    ////Asignar estatus origen siguiente
    //else {
    //    var indexes = $.map(dsAutorizaciones, function (obj, index) {
    //        if (obj.Secuencia == SecuenciaActual["0"].valueAsNumber) {
    //            return index;
    //        }
    //    });
    //    var indexesEst = $.map(dsEstatus, function (obj, index) {
    //        if (obj.IdEstatusSol == parseInt(dsAutorizaciones[indexes[0]].IdEstatusDestino)) {
    //            return index;
    //        }
    //    });

    //    if (dsEstatus[indexesEst[0]].Final != true)
    //        $("#SelEOr").selectpicker("val", parseInt(dsAutorizaciones[indexes[0]].IdEstatusDestino));
    //    else {
    //        MensajeAdvertencia("Por favor modifique el estatus destino de la úlltima autorización.");
    //        return false;
    //    }
    //}

    ///*    $("#SelEOr").closest(".bootstrap-select").children("button").attr('disabled', 'disabled').attr("style", readonly);*/
    $("#IdAutorizacion").val(0);
    $('#ModalEditarAutorizacion').modal('show');


});


$(document).on('click', '#BtnGuardarAutorizacion', function (e) {

    var Mensaje = ValidaCamposRequeridos(".ReqAut");
    if (Mensaje.length == 0) {

        var existeAutorizacion = $.grep(dsAutorizaciones, function (a, b) {
            return a.Nombre == $('#TxtNombreA').val()
        });


        var idTUAutoriza = null;
        var idUAutoriza = null;

        if ($("#SelTipoAut").val() == 1) {

            idTUAutoriza = $("#SelAsignar").val();
        }
        else if (($("#SelTipoAut").val() == 3)) {

            idUAutoriza = $("#SelAsignar").val();

        }


        if ($("#IdAutorizacion").val() != 0) {

            existeAutorizacion = 0;
        }


        if (existeAutorizacion == 0) {

            var datosAutorizacion = {
                IdAutorizacion: $("#IdAutorizacion").val(),
                Nombre: $("#TxtNombreA").val(),
                Secuencia: secSig,
                Proceso: 1,
                TipoAutorizacion: $("#SelTipoAut").val(),
                IdTUAutoriza: idTUAutoriza,
                IdUAutoriza: idUAutoriza,
                MontoMin: $("#txtMontoMin").val(),
                Activo: $('#ChkActivo').prop('checked'),
                AprobarAutorizacion: $('#ChkAprobarAutorizacion').prop('checked'),

            }

            var url = $('#urlGuardarAutorizacion').val();
            $.ajax({
                url: url,
                data: JSON.stringify(datosAutorizacion),
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: false,
                success: function (data) {

                    if (data.Exito) {
                        swal("Exito", "¡Los datos se guardaron con éxito!", "success");
                        LimpiarFormularioAutorizacion();
                        $('#ModalEditarAutorizacion').modal('hide');
                        /*   FinalizaLoading();*/
                        CargaInicialAut();
                    }
                    else if (data.SesionDesactiva)
                        CierraSesion();
                    else {
                        MensajeError(data.Mensaje);
                    }

                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    MensajeError(errorThrown);
                    refrescarCombos();
                }
            });


        }
        else {

            MensajeAdvertencia("Ya se encuentra una autorización con el mismo nombre");

        }

    }
    else {

        MensajeAdvertencia(Mensaje);
    }

});





$(document).on('click', '.BtnEditarAut', function () {

    var filaPadre = $(this).closest('tr');
    var row = tablaAutorizaciones.api().row(filaPadre);
    var datosFila = row.data();

    LimpiarFormularioAutorizacion();
    $("#IdAutorizacion").val(datosFila.IdAutorizacion);
    $('#TxtNombreA').val(datosFila.Nombre);
    $('#TxtSecuencia').text(datosFila.Secuencia);

    $('#SelTipoAut').selectpicker("val", datosFila.TipoAutorizacion);

    //$('#SelEOr').selectpicker("val", datosFila.IdEstatusOrigen);
    //$("#SelEOr").closest(".bootstrap-select").children("button").attr('disabled', 'disabled').attr("style", readonly);
    //$('#SelEDe').selectpicker("val",datosFila.IdEstatusDestino);
    //$('#SelTipoAut').selectpicker("val", datosFila.TipoAutorizacion);
    comboAsignar($('#SelTipoAut'));

    if (datosFila.TipoAutorizacion == 1) {

        $("#SelAsignar").selectpicker("val", datosFila.IdTUAutoriza)
        $("#Asignar").show();
    }
    else if (datosFila.TipoAutorizacion == 3) {
        $("#SelAsignar").selectpicker("val", datosFila.IdUAutoriza)
        $("#Asignar").show()
    }

    $('#txtMontoMin').val(datosFila.MontoMin);
    cambiaEstadoSwitch($('#ChkAprobarAutorizacion'), datosFila.AprobarAutorizacion);
    cambiaEstadoSwitch($('#ChkActivo'), datosFila.Activo);


    /* datosFila.TipoAutorizacion == 1 ? $("#SelAsignar").selectpicker("val", datosFila.IdTUAutoriza) : $("#SelAsignar").selectpicker("val", datosFila.IdUAutoriza);*/
    /*   $("#MostrarNuevo").hide();*/
    /* $("#SelEOr,#SelEDe,#SelTipoAut,#SelAsignar").removeClass("ReqAut").removeClass("ReqSel");*/


    $('#ModalEditarAutorizacion').modal('show');

});


$(document).on("click", "#BtnGuardarCambios", function () {


    if (editarAutorizaciones.length != 0) {

        LlamadaGuardarCambiosFlujo(editarAutorizaciones)

    }

})
function LlamadaGuardarCambiosFlujo(editarAutorizaciones) {

    var url = $('#urlGuardarCambiosFlujo').val();
    $.ajax({
        url: url,
        data: JSON.stringify(editarAutorizaciones),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessLlamadaGuardarCambiosFlujo,
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            MensajeError(errorThrown);
            refrescarCombos();
        }
    });
}
function SuccessLlamadaGuardarCambiosFlujo(data) {

    if (data.Exito) {

        swal("Exito", "¡Los datos se guardaron con éxito!", "success");
        CargaInicialAut();



    }
    else if (data.SesionDesactiva)
        CierraSesion();
    else {
        MensajeError(data.Mensaje);
    }
}

$(document).on("click", ".btnReordenar", function () {

    var filaPadre = $(this).closest('tr');
    var row = tablaAutorizaciones.api().row(filaPadre);
    var datosFila = row.data();
    var SecuenciaAnterior = datosFila.Secuencia;
    var IdEstatusOrigenAnterior = datosFila.IdEstatusOrigen;
    var IdEstatusDestinoAnterior = datosFila.IdEstatusDestino;
    var Secuencia = 0;
    var btnId = $(this);
    btnId.context.name == "btnSubir" ? Secuencia = SecuenciaAnterior - 1 : Secuencia = SecuenciaAnterior + 1;
    var indexes = $.map(dsAutorizaciones, function (obj, index) {
        if (obj.IdAutorizacion == datosFila.IdAutorizacion) {
            return index;
        }
    });
    var indexesCambiar = $.map(dsAutorizaciones, function (obj, index) {
        if (obj.Secuencia == Secuencia) {
            return index;
        }
    });
    if (indexesCambiar.length != 0) {
        dsAutorizaciones[indexes[0]].Secuencia = Secuencia;
        dsAutorizaciones[indexes[0]].IdEstatusOrigen = dsAutorizaciones[indexesCambiar[0]].IdEstatusOrigen;
        dsAutorizaciones[indexes[0]].IdEstatusDestino = dsAutorizaciones[indexesCambiar[0]].IdEstatusDestino;
        row = tablaAutorizaciones.api().row(indexesCambiar[0]);
        datosFila = row.data();
        dsAutorizaciones[indexesCambiar[0]].Secuencia = SecuenciaAnterior;
        dsAutorizaciones[indexesCambiar[0]].IdEstatusOrigen = IdEstatusOrigenAnterior;
        dsAutorizaciones[indexesCambiar[0]].IdEstatusDestino = IdEstatusDestinoAnterior;


        var indexesEditar = $.map(editarAutorizaciones, function (obj, index) {
            if (obj.IdAutorizacion == dsAutorizaciones[indexes[0]].IdAutorizacion) {
                return index;
            }
        });
        indexesEditar.length != 0 ? editarAutorizaciones[indexesEditar[0]] = dsAutorizaciones[indexes[0]] : editarAutorizaciones.push(dsAutorizaciones[indexes[0]]);
        indexesEditar = $.map(editarAutorizaciones, function (obj, index) {
            if (obj.IdAutorizacion == dsAutorizaciones[indexesCambiar[0]].IdAutorizacion) {
                return index;
            }
        });
        indexesEditar.length != 0 ? editarAutorizaciones[indexesEditar[0]] = dsAutorizaciones[indexesCambiar[0]] : editarAutorizaciones.push(dsAutorizaciones[indexesCambiar[0]]);
        refrescaTabla(tablaAutorizaciones, dsAutorizaciones);
        refrescarCombos();

        $('#BtnGuardarCambios').removeClass('hide');

    }

})

$('.SelTipoAut').off().on('change', function () {
    comboAsignar($(this));
})
function comboAsignar(select) {
    var btnId = select;
    var TipoAutorizacion = select.val();
    var selectAutoriza = "";
    var selectAsignar = "";
    var datosFila = [];
    if (btnId["0"].id == "SelTipoAut" || datosFila != undefined) {
        selectAutoriza = '#Asignar';
        selectAsignar = '#SelAsignar';
    }
    else {
        var filaPadre = $(select).closest('tr');
        var row = tablaAutorizaciones.api().row(filaPadre);
        datosFila = row.data();
        selectAutoriza = '#SelAutoriza' + datosFila.IdAutorizacion;
        selectAsignar = selectAutoriza;
    }
    if ($(select).val() != -1) {
        $(selectAutoriza).show();

        if (TipoAutorizacion == 1) {
            var selTipos = $('#cmbTUsuarios').html();
            $(selectAsignar).html(selTipos);
            $(selectAutoriza).show();
            btnId.context.id == "SelTipoAut" ? $(selectAsignar).addClass("ReqAut") : $(selectAutoriza).addClass("ReqEdita");
        }
        else if (TipoAutorizacion == 3) {
            $(selectAsignar).show();
            var selUsrs = $('#cmbUsuarios').html();
            $(selectAsignar).html(selUsrs);
            btnId.context.id == "SelTipoAut" ? $(selectAsignar).addClass("ReqAut") : $(selectAutoriza).addClass("ReqEdita");
        }
        else {
            /*  $(selectAutoriza).hide();*/
            $(selectAsignar).removeClass("ReqEdita");
            $(selectAsignar).removeClass("ReqAut");
            btnId.context.id == "SelTipoAut" ? $(selectAsignar).html("<option selected='selected' value='-1'>--Seleccione--</option>") : $(selectAutoriza).html("");
            btnId.context.id == "SelTipoAut" ? $(selectAsignar).selectpicker("val", -1) : $(selectAutoriza).val(-1);
        }
    }
    else
        $(selectAsignar).selectpicker("val", -1);
    $(selectAsignar).selectpicker("refresh");
}

$(document).on('change', '.ReqEdita', function (e) {

    var filaPadre = $(this).closest('tr');
    var row = tablaAutorizaciones.api().row(filaPadre);
    var datosFila = row.data();
    var TipoAutorizacion = $("#SelTipoAutorizacion" + datosFila.IdAutorizacion).val();
    var idTUAutoriza = "";
    var idUAutoriza = "";
    if ($(this).val() != -1) {
        if (TipoAutorizacion == 2) {
            idTUAutoriza = null;
            idUAutoriza = null;
        }
        else if (TipoAutorizacion == 1) {
            idTUAutoriza = $("#SelAutoriza" + datosFila.IdAutorizacion).val();
            idUAutoriza = null;
        }
        else if (TipoAutorizacion == 3) {
            idTUAutoriza = null;
            idUAutoriza = $("#SelAutoriza" + datosFila.IdAutorizacion).val();
        }

        //if (datosFila.Secuencia == 1) {

        //    var indexesEstInicial = $.map(dsEstatus, function (obj, index) {
        //        if (obj.IdEstatusSol == IdEstatusOrigen) {
        //            return index;
        //        }
        //    });     //Verificar si se asigno el estatus origen inicial
        //    if (dsEstatus[indexesEstInicial[0]].Inicial == false) {
        //        MensajeAdvertencia("");
        //        refrescarCombos();
        //        return false;
        //    }
        //}
        //else {

        //    var indexAnterior = $.map(dsAutorizaciones, function (obj, index) {
        //        if (obj.Secuencia == datosFila.Secuencia - 1) {
        //            return index;
        //        }
        //    });     //Verificar si hay un orden del estatus origen inicial con el estatus destino anterior
        //    if (dsAutorizaciones[indexAnterior[0]].IdEstatusDestino != IdEstatusOrigen) {
        //        var indexEstAnterior = $.map(dsAutorizaciones, function (obj, index) {
        //            if (obj.IdEstatusDestino == IdEstatusOrigen && obj.IdAutorizacion != datosFila.IdAutorizacion) {
        //                return index;
        //            }
        //        });
        //        if (indexEstAnterior.length != 0) {
        //            //var Estatus = $("#SelEstatusOrigen" + dsAutorizaciones[indexes[0]].IdAutorizacion).val();
        //            //if (Estatus == IdEstatusOrigen) {
        //            MensajeAdvertencia("Ya se encuentra una autorización configurada con el estatus origen ingresado.");
        //            refrescarCombos();
        //            return false;
        //            //}
        //        }
        //        else {
        //            dsAutorizaciones[indexAnterior[0]].IdEstatusDestino = IdEstatusOrigen;
        //            //MensajeAdvertencia("Seleccione como estatus de origen el estatus de destino de la autorizacion anterior");
        //            //refrescarCombos();
        //            //return false;
        //            var indexEditar = $.map(editarAutorizaciones, function (obj, index) {
        //                if (obj.IdAutorizacion == dsAutorizaciones[indexAnterior[0]].IdAutorizacion) {
        //                    return index;
        //                }
        //            });     //Actualizar cambio o agregar cambio
        //            indexEditar.length != 0 ? editarAutorizaciones[indexEditar[0]] = dsAutorizaciones[indexAnterior[0]] : editarAutorizaciones.push(dsAutorizaciones[indexAnterior[0]]);
        //        }
        //    }
        //}
        //var indexEst = $.map(dsAutorizaciones, function (obj, index) {
        //    if (obj.IdEstatusDestino == IdEstatusDestino && obj.IdAutorizacion != datosFila.IdAutorizacion) {
        //        return index;
        //    }
        //});
        //if (indexEst.length != 0) {
        //    Estatus = $("#SelEstatusDestino" + dsAutorizaciones[indexEst[0]].IdAutorizacion).val();
        //    if (Estatus == IdEstatusDestino) {
        //        MensajeAdvertencia("Ya se encuentra una autorización configurada con el estatus destino ingresado.");
        //        refrescarCombos();
        //        return false;
        //    }
        //}
        //if (IdEstatusOrigen == IdEstatusDestino) {
        //    MensajeAdvertencia("Los estatus no pueden ser los mismos.");
        //    refrescarCombos();
        //    return false;
        //}
        //var indexSiguiente = $.map(dsAutorizaciones, function (obj, index) {
        //    if (obj.Secuencia == datosFila.Secuencia + 1) {
        //        return index;
        //    }
        //});     //Verificar si hay un orden del estatus destino con el estatus origen siguiente

        //if (indexSiguiente.length != 0) {
        //    var EstatusFinal = $.map(dsEstatus, function (obj, index) {
        //        if (obj.IdEstatusSol == IdEstatusDestino) {
        //            return index;
        //        }
        //    });
        //    if (dsEstatus[EstatusFinal[0]].Final != true) {
        //        if (dsAutorizaciones[indexSiguiente[0]].IdEstatusOrigen != IdEstatusDestino) {
        //            dsAutorizaciones[indexSiguiente[0]].IdEstatusOrigen = IdEstatusDestino;
        //            var indexesEditar = $.map(editarAutorizaciones, function (obj, index) {
        //                if (obj.IdAutorizacion == dsAutorizaciones[indexSiguiente[0]].IdAutorizacion) {
        //                    return index;
        //                }
        //            });
        //            indexesEditar.length != 0 ? editarAutorizaciones[indexesEditar[0]] = dsAutorizaciones[indexSiguiente[0]] : editarAutorizaciones.push(dsAutorizaciones[indexSiguiente[0]]);
        //        }
        //    }
        //    else {
        //        MensajeAdvertencia("No se puede seleccionar el estatus destino configurado como final ");
        //        refrescarCombos();
        //        return false;
        //    }
        //}
        //datosFila.IdEstatusOrigen = IdEstatusOrigen;
        //datosFila.IdEstatusDestino = IdEstatusDestino;
        datosFila.TipoAutorizacion = TipoAutorizacion;
        datosFila.IdTUAutoriza = idTUAutoriza;
        datosFila.IdUAutoriza = idUAutoriza;

        var indexesEditar = $.map(editarAutorizaciones, function (obj, index) {
            if (obj.IdAutorizacion == datosFila.IdAutorizacion) {
                return index;
            }
        });

        indexesEditar.length != 0 ? editarAutorizaciones[indexesEditar[0]] = datosFila : editarAutorizaciones.push(datosFila);
        refrescarCombos();
        editarAutorizaciones.lenght != 0 ? $("#BtnGuardarCambios").removeClass("hide") : "";
    }
    else {
        refrescarCombos();
        editarAutorizaciones.lenght != 0 ? $("#BtnGuardarCambios").removeClass("hide") : $("#BtnGuardarCambios").addClass("hide");
    }

});
