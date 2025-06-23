var EsBugF;
var EsMejoraF;
var ActividadCreadaF = {
    id: 0
};
var IdUsuarioLiderF;

moment.locale("es");
ActividadF = {};

var TipoUsuarioF;
var UsuarioF;


var dsValidacionesF = [];
var tablaValidacionF;
var dsValidacionesActF = [];
var tablaValidacionActF;
let dropxonF;

Dropzone.autoDiscover = false;

$(document).ready(function () {
    Dropzone.prototype.defaultOptions.dictRemoveFile = "Eliminar archivo";
    Dropzone.prototype.defaultOptions.dictCancelUpload = "Cancelar";

    dropxonF = new Dropzone("div#dZUploadF", {
        url: $('#urlGuardaArchivoF').val(),
        maxThumbnailFilesize: 1000,
        filesizeBase: 102400,
        maxFilesize: 102400,
        uploadMultiple: true,
        clickable: true,
        maxFiles: 1,
        //init: function () {
        //    var dropzone = this;
        //    clearDropzone = function () {
        //        dropzone.removeAllFiles(true);
        //    };
        //},
        success: function (file, response) {

        },
        error: function (file, response) {

            if (response == "You can not upload any more files.") {
                MensajeAdvertencia('Solo es posible cargar un archivo.');

            }
            else {
                MensajeAdvertencia('Ocurrio un error al cargar el archivo intente de nuevo.');

            }
            this.removeFile(file);
        }
    });

    dropxonF.on('sending', function (file, xhr, formData) {
        formData.append('IdActividad', $('#IdActividadF').val());
        //formData.append('idCampanaUb', $('#IdCampanaU').val());
        //formData.append('tipoArchivo', 1);
    });
    dropxonF.on("complete", function (file) {
        console.log('Se agregó');
        //dropxon.files.slice();
    });

    dropxonF.on("removedfile", function (file) {
        if (file.status !== "success")
            EliminarArchivo(file);
    });

    ;




});
var columnasValidacionF = [

    {
        "data": "Estatus",
        "class": "text-center",
        "render": function (data, type, row) {
            var estlo = "";
            var title = "";

            switch (data) {
                case 'P':
                    title = "Pendiente";
                    estlo = "Estatus-asignada";
                    break;
                case 'L':
                    title = "Aprobado";
                    estlo = "Estatus-liberada";
                    break;
                case 'X':
                    title = "Rechazado";
                    estlo = "Estatus-rechazada BtnVerRechazoD";
                    break;
            }

            return '<div class="' + estlo + '" data-toggle="tooltip" data-placement="right" title="' + title + '"></div>';
        }
    },
    {
        "data": "NombreAut",
        "class": "text-left"
    },
    {
        "data": "NombreValido",
        "class": "text-left"
    },

    {
        "data": "FechaAtendio",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))
        }
    },

    {
        "class": "text-center",
        "render": function (data, type, row) {
            if (row.Estatus == 'P' && row.Valida == true) {
                return '<div class="btn-group"><button class="btn btn-success glyphicon glyphicon-ok BtnAprobarActF"></button><button class="btn btn-danger  glyphicon glyphicon-remove BtnRechazarActF"></button></div>';
            }
            else {
                return ""
            }
        }
    },
    {
        "data": "MotivoRechazoId",
        "visible": false
    },
    {
        "data": "DescripcionRechazo",
        "visible": false
    },
    {
        "data": "IdActividadVal",
        "visible": false
    },
    {
        "data": "IdAutorizacion",
        "visible": false
    },
    {
        "data": "IdActividad",
        "visible": false
    }
];

var columnasValidacionActF = [

    {
        "data": "Estatus",
        "class": "text-center",
        "render": function (data, type, row) {
            var estlo = "";
            var title = "";

            switch (data) {
                case 'P':
                    title = "Pendiente";
                    estlo = "Estatus-asignada";
                    break;
                case 'L':
                    title = "Aprobado";
                    estlo = "Estatus-liberada";
                    break;
                case 'X':
                    title = "Rechazado";
                    estlo = "Estatus-rechazada BtnVerRechazoD";
                    break;
            }

            return '<div class="' + estlo + '" data-toggle="tooltip" data-placement="right" title="' + title + '"></div>';
        }
    },
    {
        "data": "NombreAut",
        "class": "text-left"
    },
    {
        "data": "NombreValido",
        "class": "text-left"
    },

    {
        "data": "FechaAtendio",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))
        }
    },

    {
        "class": "text-center",
        "render": function (data, type, row) {
            if (row.Estatus == 'P' && row.Valida == true) {
                return '<div class="btn-group"><button class="btn btn-success glyphicon glyphicon-ok BtnAprobarActdetF"></button><button class="btn btn-danger  glyphicon glyphicon-remove BtnRechazarActdetF"></button></div>';
            }
            else {
                return ""
            }
        }
    },
    {
        "data": "MotivoRechazoId",
        "visible": false
    },
    {
        "data": "DescripcionRechazo",
        "visible": false
    },
    {
        "data": "IdActividadVal",
        "visible": false
    },
    {
        "data": "IdAutorizacion",
        "visible": false
    },
    {
        "data": "IdActividad",
        "visible": false
    }
];


var dsTrabajosActF = [];
var tablaTrabajosActF;
var columnasTrabajosActF = [

    {
        "data": "Fecha",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))
        }
    },
    {
        "data": "Tiempo",
        "class": "text-right"
    },
    {
        "data": "Comentario",
        "class": "text-left"
    }
];

var dsDependenciasActF = [];
var tablaDependenciasActF;
var columnasDependenciasF = [

    {
        "data": "IdActividadStr",
        "class": "text-left",
        //"render": function (data, type, row) {
        //    return '<a style="cursor:pointer" href="#" onclick="clickalerta(' + row.IdActividad + ' )" >' + data + '</a>'
        //}
    },
    {
        "data": "Descripcion",
        "class": "text-left"
    },
    {
        "data": "ResponsableStr",
        "class": "text-center",
        "render": function (data, type, row) {
            return '<span  class="btn btn-small Open" style="text-align:left; width:100%;">' + data + '</span>';
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

    {
        "data": "FechaSolicitado",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))
        }
    },
    {
        "data": "EsPeerReview",
        "class": "text-center",
        "render": function (data, type, row) {
            return data ? '' : '<button class="btn btn-danger BtnEliminarDependenciaF"><span class="fa fa-trash-o"></span></button>'


        }
    }
];



var dsIssuesActF = [];
var tablaIssuesActF;
var columnasIssuesActF = [

    {
        "data": "NoIssue",
        "class": "text-left",

        "render": function (data, type, row) {
            return '<a class="btnEditarIssueActF" role="button">' + data + '</a>'
        }
      /*  "render": '<a class="btnEditarIssue" role="button">' + data  + '</a>'*/
        //"render": function (data, type, row) {
        //    return '<a style="cursor:pointer" href="#" onclick="clickalerta(' + row.IdActividad + ' )" >' + data + '</a>'
        //}
    },
    {
        "data": "FechaDeteccion",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))
        }
    },
    {
        "data": "Descripcion",
        "class": "text-left"
    },
    {
        "data": "Estatus",
        "class": "text-left",
        "render": function (data, type, row) {
            return '<label class="badge" style="width: 100%; color: white; background-color:'+ row.EstatusIssueColor + '">' + row.EstatusIssue + '</label>'
        }

       /* "render": '<label class="badge" style="width: 100%; color: white; background-color:"' + data.EstatusIssueColor +'">' + data.EstatusIssue +'</label>'*/
    },

    {
        "data": "IdActividadIssue",
        "class": "text-center",
        "render": function (data, type, row) {
            return '<button class="btn btn-danger BtnEliminarIssueActividad"><span class="fa fa-trash-o"></span></button>'


        }
    }
];

const colRepositorioF = [
    {
        "data": "TipoLink",
        "class": "text-left"
    },
    {
        "data": "IdLink",
        "class": "text-left",
        "render": (data, _, row) => '<a target="_blank" href=' + row.Url + '>' + data + '</a>'
    },
    {
        "class": "text-center",
        "render": () => "<i class='fa fa-trash btnEliminarActividadRepositorio' style='cursor: pointer;'></i>"
    },
]

async function InicializaAltaActividadesF() {
    ActividadPeerReview.Funciones.Init(0, 0);

    await CargaCombosAct();
    InicializaControles();

    $('#IdActividad').val(0);
    $('#ActPSP').val(0);
    $('#divHorasUtil').hide();
    $('#divFechaFin').hide();
    $('#divVerArchivo').hide();
  /*  $('#BtnList').addClass('hide');*/

    if (TipoUsuario == 14 && !EsBug) {
        $('#SelUsuarioAsignado').val(Usuario);
        //$('#SelUsuarioAsignado').prop('disabled', true);
        $('#SelUsuarioAsignado').selectpicker('refresh')
    }
    if (TipoUsuario == 15 || EsBug) {
        $('#SelResponsable').val(Usuario);
        //$('#SelResponsable').prop('disabled', true);
        $('#SelResponsable').selectpicker('refresh')
    }
    if (EsMejora && EsMejora !== undefined) {
        const data = await POST($('#LeerProyectoMejora').val(), {}, false);
        if (data.Exito) {
            const id = data.IdProyecto;
            $('#SelProyecto').val(id);
            $('#SelProyecto').selectpicker('refresh')
            $('#SelProyecto').trigger('change')
            $('#SelProyecto').prop('disabled', true);
        } else {
            MensajeAdvertencia(data.Mensaje);
            return;
        }
    }
    if (EsBug !== undefined && EsBug) {
        $('#SelActividad').val('195');
        $('#SelActividad').selectpicker('refresh')
        $('#SelActividad').trigger('change')
        $('#SelActividad').prop('disabled', true);
    }

    $("#spEstatus").addClass("Open");
    $("#spEstatus").text("Abierto");

    $("#rwdetails").hide();
}

function InicializaControles() {

    $('#TxtFechaPlan,#TxtFechaFin, #TxtFechaInicio').datetimepicker(
        {
            format: 'DD/MM/YYYY'
        });

    Actividad = {}

    $(".ReqActividad").removeAttr("disabled");
    $(".ReqCierre").removeAttr("disabled");
    $("#SelSprintA").removeAttr("disabled");
    $("#BtnGuardarActividad").removeClass("hide");
    $('#TxtDescripcion').code('');
    $('#TxtBR').val('');
    $('#TxtHorasFacturables').val('');
    $('#TxtHorasAsignadas').val('');
    $('#TxtFechaInicio').val('');
    $('#TxtFechaPlan').val('');
    $("#FlArchivo").parent().next().text("");

    // $('#TxtHorasFinal').val('');
    $('#TxtFechaFin').val('');

    if ($('#IdProyecto').val() === 0 || $('#IdProyecto').val() === undefined) {
        $('#SelProyecto').val('-1');
    }
    else {
        $('#SelProyecto').val($('#IdProyecto').val());
        $('#SelProyecto').selectpicker('refresh');
        CargaRecursosProyecto();
    }

    $('#SelActividad').val(-1);
    $('#SelActividad').selectpicker('refresh');
    $('#SelSprintA').val(-1);
    $('#SelSprintA').selectpicker('refresh');
    $('#SelActividadRef').empty().append('<option value="-1">--Seleccionar--</option>');
    $('#SelActividadRef').val('-1');
    $('#SelActividadRef').selectpicker('refresh');
    $('#TxtHorasFinal').text('0.00');

    $('#SelUsuarioAsignado').val(-1);
    $('#SelResponsable').val(-1);
    $('#SelClasificacion').val(-1);
    $('#SelUsuarioAsignado').prop('disabled', false);
    $('#SelResponsable').prop('disabled', false);
    $("#RdoAlta2").prop("checked", false);
    $("#RdoBaja2").prop("checked", false);
    $("#RdoPlaneada2").prop("checked", false);
    $("#RdoNoPlaneada2").prop("checked", false);
    $("#spEstatus").removeClass("Open Progress Validation Done Rejected Cancelled");
    $("#spEstatus").text("");
    $("#divProgreso").empty();
    cambiaEstadoSwitch($('#ChkRetrabajo'), false);
    cambiaEstadoSwitch($('#ChkCritico'), false);
    cambiaEstadoSwitch($('#chkPeerReview'), false);
    $('.divPeerReview').addClass('hidden');
    $('#tab-actividad-peer').addClass('hidden');
    $('#divcomentario').hide();
    $('#BtnAgregarComentario').show();
    $('#TxtComentarioAct').val("");
    $("#BtnActualizaAbierto").hide();
    $("#BtnActualizaProgreso").hide();
    $('#div-repositorio').addClass('hidden');
    $("#show-share-div").hide();


    $('.summernote').summernote({ airMode: true});

    $('.note-view').hide();
    $('.note-help').hide();
    $('.note-insert').hide();
}

async function CargaCombosAct() {

    var url = $('#urlCargaInicialAct').val();

    await $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            if (data.Exito) {

                $('#SelProyecto').empty();
                $('#SelProyecto').append(data.LstProyectos);
                $('#SelProyecto').selectpicker('refresh');

                $('#SelActividad').empty();
                $('#SelActividad').append(data.LstTipoAct);
                $('#SelActividad').selectpicker('refresh');

                $('#SelUsuarioAsignado').empty();
                $('#SelUsuarioAsignado').append(data.LstUsuarios);
                $('#SelUsuarioAsignado').selectpicker('refresh');

                $('#SelResponsable').empty();
                $('#SelResponsable').append(data.LstUsuarios);
                $('#SelResponsable').selectpicker('refresh');

                $('#SelTipoTask').empty();
                $('#SelTipoTask').append(data.LstTipo);
                $('#SelTipoTask').val('1');
                $('#SelTipoTask').selectpicker('refresh');

                $('#SelClasificacion').empty();
                $('#SelClasificacion').append(data.LstClasificacion);
                $('#SelClasificacion').selectpicker('refresh');

                $('#SelClasificacion2').empty();
                $('#SelClasificacion2').append(data.LstClasificacion);
                $('#SelClasificacion2').selectpicker('refresh');

                TipoUsuario = data.TipoUsuario;
                Usuario = data.Usuario;

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

async function InicializaEdicionActividad() {
    var Actividad = $("#IdActividad").val().trim();
    $('#divHorasUtil').show();
    $('#divFechaFin').show();
    await CargaCombosAct();
    InicializaControles();
    $("#rwdetails").show();
    dropxon.removeAllFiles(true);
    $('div .dz-preview').each(function () {
        $(this).remove();
    });

    ConsultaActividad(Actividad, false);
  /*  $('#BtnList').removeClass('hide');*/

}

var dtRepositorio;
async function ConsultaLinks() {
    const data = await POST('/actividades/LeerCommits', { idActividad: $("#IdActividad").val() });

    const html = data.Links.map((l, i) =>
        `<div style="position: relative;">
                <div class="autogenerado comentario-container-repo ${i === 0 ? "first" : ""}">
                    <div class="first">
                        <div class="center-cropper">
                            <div class="comentarios" style="height: 30px !important">
                                <img src="/Archivos/Fotos/${l.NumEmpleado}.jpg" alt="${l.NumEmpleado}">
                            </div>
                        </div>
                    </div>
                    <div class="second">
                        <label class="badge badge-info">${l.TipoLink}</label> <small>${moment(l.FechaCreo).format("DD-MM-YYYY")}</small>
                    </div>
                </div>
                <div style="padding: 0px 10px">
                    <a target="_blank" href="${l.Url}">${l.IdLink}</a>
                    <p>${l.Descripcion?.replaceAll('\n', '<br />') ?? ''}</p>
                </div>
                <button style="margin-bottom: -12px" class="btnTooltip abajo fa fa-trash btnEliminarActividadRepositorio" data-id="${l.IdActividadRepositorio}"></button>
            </div>`
    ).join('');

    $('.divMensajes.div-comentarios-repo').empty().html(html);
}

$('#show-repo-div').click(() => {
    if ($('#repo-div').hasClass('hidden')) {
        $('#repo-div').removeClass('hidden');
        $('#SelRepositorio').val('-1');
        $('#SelCommit').val('-1');
        $('#TxtIdLink').val('');
        $('#TxtCommitDescripcion').val('');
    }
    else
        $('#repo-div').addClass('hidden')
});

$('#hide-repo-div').click(() => {
    $('#repo-div').addClass('hidden')
});

$('#btnAgregarActividadRepositorio').click(async e => {
    e.preventDefault();

    const mensaje = ValidaCamposRequeridos('.ReqRepo');

    if (mensaje.length === 0) {
        const actividad = {
            IdActividad: $('#IdActividad').val(),
            IdProyectoRepositorio: $('#SelRepositorio').val(),
            IdTipoLink: $('#SelCommit').val(),
            IdLink: $('#TxtIdLink').val(),
            Descripcion: $('#TxtCommitDescripcion').val(),
        }

        const data = await POST('/actividades/GuardarCommit', { actividad }, false);

        if (data.Exito) {
            MensajeExito(data.Mensaje);
            ConsultaLinks();
            $('#repo-div').addClass('hidden')
        } else {
            MensajeAdvertencia(data.Mensaje);
        }
    } else {
        MensajeAdvertencia(mensaje);
    }
});

$(document).on('click', '.openFrame', e => {
    e.preventDefault();

    $('#ifrRepo').attr('src', e.target.href);
    $('#mdlRepo').modal('show');
});

$(document).on('click', '.btnEliminarActividadRepositorio', async e => {
    e.preventDefault();

    const actividad = {
        IdActividad: $('#IdActividad').val(),
        IdActividadRepositorio: $(e.target).data('id')
    }

    const data = await POST('/actividades/EliminarCommit', { actividad }, false);

    if (data.Exito) {
        MensajeExito(data.Mensaje);
        ConsultaLinks();
        $('#repo-div').addClass('hidden')
    } else {
        MensajeAdvertencia(data.Mensaje);
    }
});

function InicializaRetrabajoActividad(IdActividad, Estatus) {

    if (Estatus != "L") {

        MensajeAdvertencia("Sólo se puede solicitar retrabajo de actividades con estatus 'Liberado'.");
        return false;
    }

    $('#IdActividad').val(0);
    $("#IdActividadRef").val().trim(IdActividad);

    $('#ModalActividades').on('hidden.bs.modal', function () {
        CargaActividades();
    });

    $('#ModalActividades').modal({ keyboard: false });

    $('#divHorasUtil').hide();
    $('#divFechaFin').hide();
/*    $('#BtnList').addClass('hide');*/
    InicializaControles();
    ConsultaActividad(IdActividad, true);
    return false;

}


async function ConsultaActividad(Actividad, Retrabajo) {

    var url = $('#urlConsultaActividad').val();

    const data = await POST(url, { Actividad: Actividad });



    if (data.Exito) {

        $('#SelActividades').empty();
        $('#SelActividades').append(data.LstActividades);
        $('#SelActividades').selectpicker('refresh');

        var datosAct = jQuery.parseJSON(data.Actividad);

        if (datosAct.TipoActividadId === 195) {
            EsBug = true;
            $('#divActividadRef').removeClass('hidden');
            $('#SelActividadRef').addClass('ReqActividad');
        } else {
            $('#divActividadRef').addClass('hidden');
            $('#SelActividadRef').removeClass('ReqActividad');
        }

        $("#IdActividad").val(datosAct.IdActividad);
        $("#ActPSP").val(datosAct.PSP);


        $('#SelUsuarioAsignado').empty();
        $('#SelUsuarioAsignado').append(data.LstUsuarios);
        $('#SelUsuarioAsignado').selectpicker('refresh');

        $('#SelResponsable').empty();
        $('#SelResponsable').append(data.LstUsuarios);
        $('#SelResponsable').selectpicker('refresh');

        if (EsMejora && EsMejora !== undefined) {
            $('#SelProyecto').prop('disabled', true);
        }

        $('#SelProyecto').val(datosAct.IdProyecto);
        $('#SelProyecto').selectpicker('refresh');

        if (EsBug !== undefined && EsBug) {
            $('#SelActividad').prop('disabled', true);
            await CargaActividadesQA();
        }

        $('#SelActividad').val(datosAct.TipoActividadId);
        await CargaClasificaciones();
        if (EsBug !== undefined && EsBug) {
            $('#SelActividadRef').val(datosAct.IdActividadRef)
        }
        $('#SelClasificacion').val(datosAct.ClasificacionId);
        //if (Retrabajo) {
        //    $('#TxtDescripcion').val("RETRABAJO: " + datosAct.Descripcion);
        //}
        //else {
        //    $('#TxtDescripcion').val(datosAct.Descripcion);
        //}

        $('#TxtDescripcion').code(datosAct.Descripcion);

        $('#TxtBR').val(datosAct.BR);
        $('#TxtHorasFacturables').val(datosAct.HorasFacturables);
        $('#TxtHorasAsignadas').val(datosAct.HorasAsignadas);
        $('#TxtFechaInicio').val(moment(datosAct.FechaInicio).format("DD/MM/YYYY"));
        $('#TxtFechaPlan').val(moment(datosAct.FechaSolicitado).format("DD/MM/YYYY"));
        if (datosAct.Prioridad == 1) {
            $('#LblRdoAlta').click();
            $("#RdoAlta2").prop("checked", true);
        }
        else {
            $('#LblRdoBaja').click();
            $("#RdoBaja2").prop("checked", true);
        }
        if (datosAct.Planificada == 1) {
            $('#LblRdoSiPlaneada').click();
            $("#RdoPlaneada2").prop("checked", true);
        }
        else {
            $('#LblRdoNoPlaneada').click();
            $("#RdoNoPlaneada2").prop("checked", true);
        }
        $('#SelUsuarioAsignado').val(datosAct.IdUsuarioAsignado);
        $('#SelTipoTask').val(datosAct.TipoId);
        $('#SelResponsable').val(datosAct.IdUsuarioResponsable);

        $('#div-repositorio').removeClass('hidden')
        ConsultaLinks();
        ActividadPeerReview.Funciones.Init(datosAct.IdActividad, datosAct.IdListaRevision, datosAct.IdActividadRef);

        if (datosAct.DocumentoRef == "" || datosAct.DocumentoRef == null) {
            $('#divVerArchivo').hide();
        }
        $('#UrlArchivo').val(datosAct.DocumentoRef);

        $('#TxtHorasFinal').text(datosAct.HorasFinales);

        if (datosAct.FechaTermino != null) {
            $('#TxtFechaFin').val(moment(datosAct.FechaTermino).format("DD/MM/YYYY"));
        }



        if (datosAct.Estatus !== "A" && datosAct.Estatus !== "P" && datosAct.Estatus !== "X") {

            if (TipoUsuario != 17) {
                if (!EsBug)
                    $(".ReqActividad").attr("disabled", "true");
                $(".ReqCierre").attr("disabled", "true");
                $("#SelSprintA").attr("disabled", "true");
                $("#BtnGuardarActividad").addClass("hide");
            }
        }
        else {
            if (!EsBug)
                $(".ReqActividad").removeAttr("disabled");
            $(".ReqCierre").removeAttr("disabled");
            $("#SelSprintA").removeAttr("disabled");
            $("#BtnGuardarActividad").removeClass("hide");
        }
        $('#SelActividad').selectpicker('refresh');
        $('#SelTipoTask').selectpicker('refresh');
        $('#SelActividadRef').selectpicker('refresh');
        $('#SelClasificacion').selectpicker('refresh');
        $('#SelUsuarioAsignado').selectpicker('refresh');
        $('#SelResponsable').selectpicker('refresh');

        $('#SelSprintA').empty();
        $('#SelSprintA').append(data.LstSprints);
        $('#SelSprintA').val(datosAct.IdIteracion);
        $('#SelSprintA').selectpicker('refresh');

        cambiaEstadoSwitch($('#ChkRetrabajo'), datosAct.Retrabajo);
        cambiaEstadoSwitch($('#ChkCritico'), datosAct.Critico);
        $("#spEstatus").removeClass("Open Progress Validation Done Rejected Cancelled");


        if (datosAct.Estatus == "A") {
            $("#spEstatus").addClass("Open");
            $("#spEstatus").text("Abierto");
            $("#BtnActualizaAbierto").hide();
            $("#BtnActualizaProgreso").hide();
        }
        if (datosAct.Estatus == "P") {
            $("#spEstatus").addClass("Progress");
            $("#spEstatus").text("En progreso");

            $("#BtnActualizaAbierto").show();
            $("#BtnActualizaProgreso").hide();
        }
        if (datosAct.Estatus == "R") {
            $("#spEstatus").addClass("Validation");
            $("#spEstatus").text("Revisión");
            $("#BtnActualizaAbierto").show();
            $("#BtnActualizaProgreso").show()

        }
        if (datosAct.Estatus == "V") {
            $("#spEstatus").addClass("Validation");
            $("#spEstatus").text("Validación");
            $("#BtnActualizaAbierto").show();
            $("#BtnActualizaProgreso").show()

        }

        if (datosAct.Estatus == "L") {
            $("#spEstatus").addClass("Done");
            $("#spEstatus").text("Terminada");
            $("#BtnActualizaAbierto").show();
            $("#BtnActualizaProgreso").show()

        }
        if (datosAct.Estatus == "C") {
            $("#spEstatus").addClass("Cancelled");
            $("#spEstatus").text("Cancelada");
            $("#BtnActualizaAbierto").show();
            $("#BtnActualizaProgreso").show()

        }
        if (datosAct.Estatus == "X") {
            $("#spEstatus").addClass("Rejected");
            $("#spEstatus").text("Rechazada");
            $("#BtnActualizaAbierto").show();
            $("#BtnActualizaProgreso").show()

        }
        $("#ActPSP").val(datosAct.PSP);

        $("#lblActComentarios").text(datosAct.TotalComentarios);
        $("#lblActArchivos").text(datosAct.TotalArchivos);
        $("#lblActDependencias").text(datosAct.TotalDependencias);
        $("#lblActLog").text(datosAct.TotalTiempos);
        $("#lblLog").text(datosAct.TotalLog);
        $("#lblVal").text(datosAct.TotalValidaciones);
        $("#lblIssues").text(datosAct.TotalIssues);

        $("#divProgreso").append(datosAct.ProgresoStr);
        $("#UlComentarios").empty();
        $("#UlComentarios").append(data.LstComentarios);

        $("#UlLog").empty();
        $("#UlLog").append(data.LstLog);


        //PONGO LOS ARCHIVOS
        for (var i in datosAct.Archivos) {

            var url = data.Url + datosAct.Archivos[i].Nombre;
            var mockFile = { name: datosAct.Archivos[i].Nombre };
            dropxon.options.addedfile.call(dropxon, mockFile);
            dropxon.options.thumbnail.call(dropxon, mockFile, url);

        }

        //dsTrabajosAct = jQuery.parseJSON(datosAct.Trabajos);
        tablaTrabajosAct = inicializaTabla($('#TblLogTrabajo'), datosAct.Trabajos, columnasTrabajosAct, 0, "asc", false, false, false);

        dsDependenciasAct = datosAct.Dependencias;
        tablaDependenciasAct = inicializaTabla($('#TblActDependencias'), datosAct.Dependencias, columnasDependencias, 0, "asc", false, false, false);


        dsIssuesAct = datosAct.Issues;
        tablaIssuesAct = inicializaTabla($('#TblActIssues'), datosAct.Issues, columnasIssuesAct, 0, "asc", false, false, false);


        dsValidacionesAct = datosAct.Validaciones;
        tablaValidacionAct = inicializaTabla($('#TblValidacionesAct'), dsValidacionesAct, columnasValidacionAct, 0, "asc", false, false, false);
        $('div.pg-loading-screen').remove();

        $('#SelRepositorio').empty().append(data.LstRepositorios);


        $('#SelIssues').empty();
        $('#SelIssues').append(data.LstIssues);
        $('#SelIssues').selectpicker('refresh');

    }
    else {

        MensajeAdvertencia(data.Mensaje);

    }

}
function ActualizaEstatusAct(Estatus) {

    var url = $('#urlActualizaEstatus').val();

    $.ajax({
        url: url,
        data: JSON.stringify({ IdActividad: $("#IdActividad").val(), Estatus: Estatus }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            if (data.Exito) {

                ConsultaActividad($("#IdActividad").val(), false);

            }
            else {
                MensajeError(data.Mensaje);
            }

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error al realizar la consulta, intente de nuevo.");
        }
    });


}

$(document).on('click', '#BtnGuardarActividad', function (e) {

    var Mensaje = ValidaCamposRequeridos(".ReqActividad");
    var prioridad = $('input:radio[name=RdoPrioridad]:checked').val();
    var planificada = $('input:radio[name=RdoPlaneada]:checked').val();
    var nombredoc = $("#FlArchivo").parent().next().text();

    if (Mensaje.length == 0 && prioridad != null) {

        var url = $('#urlGuardarActividad').val();
        //var archivo = $("#FlArchivo").prop("files")[0];

        var fechaIni = ObtieneFecha($('#TxtFechaInicio').val().trim());
        var fechaSol = ObtieneFecha($('#TxtFechaPlan').val().trim());
        var fechaC = ObtieneFecha($('#TxtFechaFin').val().trim());



        Actividad = {
            IdActividad: $("#IdActividad").val().trim(),
            IdUsuarioAsignado: $("#SelUsuarioAsignado").val(),
            Descripcion: $("#TxtDescripcion").code(),
            BR: $("#TxtBR").val().trim(),
            //DocumentoRef: $("#FlArchivo").parent().next().text(),
            HorasFacturables: $("#TxtHorasFacturables").val(),
            HorasAsignadas: $("#TxtHorasAsignadas").val(),
            IdProyecto: $("#SelProyecto").val(),
            IdIteracion: $("#SelSprintA").val(),
            TipoActividadId: $("#SelActividad").val(),
            ClasificacionId: $("#SelClasificacion").val(),
            IdUsuarioResponsable: $("#SelResponsable").val(),
            Planificada: planificada,
            Prioridad: prioridad,
            FechaInicio: fechaIni,
            FechaSolicitado: fechaSol,
            HorasFinales: $("#TxtHorasFinal").text(),
            Retrabajo: $('#ChkRetrabajo').prop('checked'),
            Critico: $('#ChkCritico').prop('checked'),
            FechaTermino: fechaC,
            IdActividadRef: $("#SelActividadRef").val() !== '-1' && $("#SelActividadRef").val() != null ? $("#SelActividadRef").val() : $("#SelActividadRefPeer").val(),
            IdListaRevision: $('#selPeerReview').val(),
            TipoId: $('#SelTipoTask').val(),
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
                    //CargaArchivo(data);

                    $('div.pg-loading-screen').remove();
                    $('#ModalActividades').modal('hide');
                    MensajeExito(data.Mensaje);
                    ActividadCreada.id = data.IdActividad;
                    CargaActividades();
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

    }
    else {

        if (Mensaje.length == 0) {
            Mensaje = "Los siguientes campos son requeridos: <br> -Prioridad";
        }
        else {

            Mensaje += "-Prioridad";

        }
        MensajeAdvertencia(Mensaje);
    }
    return false;
});

function CargaArchivo(Datos) {
    var url = $('#urlGuardarArchivo').val();

    var form_data = new FormData();
    form_data.append("Documento", $("#FlArchivo").prop("files")[0]);
    form_data.append("NomDocumento", Datos.Documento);

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

                $('div.pg-loading-screen').remove();
                $('#ModalActividades').modal('hide');
                MensajeExito(Datos.Mensaje);
            }
            else {
                MensajeAdvertencia("Los datos se guardaron correctamente, pero ocurrió un error al cargar los documentos.");
            }
        },
        complete: FinalizaLoading,
        error: function (xhr, textStatus, errorThrown) {
            var err = eval("(" + xhr.responseText + ")");
            MensajeError(err.Message);
        }
    });
}

$(document).on("change", "#FlArchivo", function (e) {
    $("#FlArchivo").parent().next().next().text("");

    var imgVal = $('#FlArchivo').val();
    if (imgVal == '') {
    }
    else {

        if (e.target.files != undefined) {

            var reader = new FileReader();

            reader.onload = function (f) {
            };
            reader.readAsDataURL(e.target.files.item(0));
        }
    }
});

$(document).on('click', '#BtnDescargar', function (e) {

    window.location = $('#UrlArchivo').val();

    return false;

})

function ObtieneFecha(fechacapturada) {

    var fecha;

    if (fechacapturada.trim() != "") {

        var fechav = fechacapturada.split('/');
        var diav = parseInt(fechav[0]);
        var mesv = parseInt(fechav[1]) - 1;
        var aniov = parseInt(fechav[2]);
        fecha = new Date(aniov, mesv, diav, 0, 0, 0);
    }
    else {
        fecha = null;
    }

    return fecha;


}

function Cancelar(Actividad) {

    $('#ActCancela').val(Actividad);
    MensajeConfirmar("¿Desea cancelar la actividad #" + Actividad + " ?")


    return false;

}

$(document).on('click', '#BtnConfirmar', function (e) {

    var idActividad = $('#ActCancela').val();

    CancelarActividad(idActividad);

    return false;
});

function CancelarActividad(IdActividad) {

    var url = $('#urlCancelaActividad').val();

    $.ajax({
        url: url,
        data: JSON.stringify({ IdActividad: IdActividad }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {

            if (data.Exito) {

                CargaActividades();
                $('#ActCancela').val('');
                $('div.pg-loading-screen').remove();
                MensajeExito("El pedido se canceló con éxito");

            }
            else {

                MensajeAdvertencia(data.Mensaje);

            }

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error al cancelar la actividad, intente de nuevo.");
        }
    });
}

function SolicitaRevisionDet() {

    var IdActividad = $("#IdActividad").val();
    SolicitarRevision(IdActividad);
    return false;
}

function CancelarDet() {

    var IdActividad = $("#IdActividad").val();
    Cancelar(IdActividad);

    return false;
}

function VerValidacionDet() {

    var IdActividad = $("#IdActividad").val();
    AbrirModalValidacion(IdActividad);

    return false;
}
function SolicitarRevision(IdActividad) {

    //var url = $('#urlSolicitaRevision').val();

    $.ajax({
        url: "/Actividades/SolicitaRevision",
        data: JSON.stringify({ IdActividad: IdActividad }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {

            if (data.Exito) {
                FinalizaLoading();
                if (typeof CargaActividades !== "undefined")
                    CargaActividades();
                $('div.pg-loading-screen').remove();
                MensajeExito(data.Mensaje);

            }
            else {

                MensajeAdvertencia(data.Mensaje);

            }

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error al solicitar la revisión, intente de nuevo.");
        }
    });
}

function AbrirModalValidacion(IdActividad) {

    $('#IdActividadVal').val(IdActividad);
    $('#TituloVal').text("Validaciones de actividad #" + IdActividad);
    $('#ModalValidaciones').on('hidden.bs.modal', function () {
        CargaActividades();

        $('div.pg-loading-screen').remove();
    });

    //$('#ModalValidaciones').show();
    $('#ModalValidaciones').modal({ keyboard: false });
    InicializaValidaciones();

}

function InicializaValidaciones() {

    var url = $('#urlObtieneValidaciones').val();
    var IdActividad = $('#IdActividadVal').val();

    $.ajax({

        url: url,
        data: JSON.stringify({ IdActividad: IdActividad }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            if (data.Exito) {
                dsValidaciones = jQuery.parseJSON(data.Validaciones);
                tablaValidacion = inicializaTabla($('#TblValidaciones'), dsValidaciones, columnasValidacion, 0, "asc", false, false, false);
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

function InicializaValidacionesAct() {

    var url = $('#urlObtieneValidaciones').val();
    var IdActividad = $('#IdActividad').val();

    $.ajax({

        url: url,
        data: JSON.stringify({ IdActividad: IdActividad }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            if (data.Exito) {
                dsValidacionesAct = jQuery.parseJSON(data.Validaciones);
                tablaValidacionAct = inicializaTabla($('#TblValidacionesAct'), dsValidacionesAct, columnasValidacionAct, 0, "asc", false, false, false);
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

$(document).on('click', '.BtnAprobarAct', function (e) {

    var filaPadre = $(this).closest('tr');
    var row = tablaValidacion.api().row(filaPadre);
    var datosFila = row.data();
    var IdActividad = datosFila.IdActividad;


    Actividad = {
        IdActividad: datosFila.IdActividad,
        IdAutorizacion: datosFila.IdAutorizacion,
        IdActividadVal: datosFila.IdActividadVal,
        Valida: true
    };

    ValidaRechazaActividad(Actividad);

    return false;


});

$(document).on('click', '.BtnRechazarAct', function (e) {

    var filaPadre = $(this).closest('tr');
    var row = tablaValidacion.api().row(filaPadre);
    var datosFila = row.data();
    var IdActividad = datosFila.IdActividad;

    InicializaModalRechazar();

    $('#ActividadR').val(datosFila.IdActividad);
    $('#AutorizacionR').val(datosFila.IdAutorizacion);
    $('#AutorizacionValR').val(datosFila.IdActividadVal);

    $('#TituloRec').text("Rechazar actividad #" + datosFila.IdActividad);

    $('#ModalRechazarActividad').on('hidden.bs.modal', function () {
        InicializaValidaciones();
        $(this).off('hidden.bs.modal');
    });

    $('#ModalRechazarActividad').modal({ keyboard: false });


    return false;


});

$(document).on('click', '.BtnAprobarActdet', function (e) {

    var filaPadre = $(this).closest('tr');
    var row = tablaValidacionAct.api().row(filaPadre);
    var datosFila = row.data();
    var IdActividad = datosFila.IdActividad;


    Actividad = {
        IdActividad: datosFila.IdActividad,
        IdAutorizacion: datosFila.IdAutorizacion,
        IdActividadVal: datosFila.IdActividadVal,
        Valida: true
    };

    ValidaRechazaActividadAct(Actividad);

    return false;


});

$(document).on('click', '.BtnRechazarActdet', function (e) {

    var filaPadre = $(this).closest('tr');
    var row = tablaValidacionAct.api().row(filaPadre);
    var datosFila = row.data();
    var IdActividad = datosFila.IdActividad;

    InicializaModalRechazar();

    $('#ActividadR').val(datosFila.IdActividad);
    $('#AutorizacionR').val(datosFila.IdAutorizacion);
    $('#AutorizacionValR').val(datosFila.IdActividadVal);

    $('#TituloRec').text("Rechazar actividad #" + datosFila.IdActividad);

    $('#ModalRechazarActividad').on('hidden.bs.modal', function () {
        ConsultaActividad(idActividad, false);
        $(this).off('hidden.bs.modal');
    });

    $('#ModalRechazarActividad').modal({ keyboard: false });


    return false;


});

function ValidaRechazaActividad(Actividad) {

    var url = $('#urlValidaRechaza').val();

    $.ajax({
        url: url,
        data: JSON.stringify(Actividad),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {

            if (data.Exito) {
                InicializaValidaciones();

                $('div.pg-loading-screen').remove();
                MensajeExito(data.Mensaje);
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
}

function ValidaRechazaActividadAct(Actividad) {

    var url = $('#urlValidaRechaza').val();

    $.ajax({
        url: url,
        data: JSON.stringify(Actividad),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {

            if (data.Exito) {
                ConsultaActividad($('#IdActividad').val(), false);

                $('div.pg-loading-screen').remove();
                MensajeExito(data.Mensaje);
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
}


function ValidaRechazaActividadKanban(Actividad) {

    var url = $('#urlValidaRechaza').val();

    $.ajax({
        url: url,
        data: JSON.stringify(Actividad),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {

            if (data.Exito) {
                $('div.pg-loading-screen').remove();
                MensajeExito(data.Mensaje);
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
}

function InicializaModalRechazar() {

    $('#ActividadR').val("0");
    $('#AutorizacionR').val("0");
    $('#AutorizacionValR').val("0");
    $("#SelMotivoRechazo").val("-1");
    $("#TxtDescripcionRechazo").val("");
    $("#BtnGuardarRechazo").removeClass("hide");


    var url = $('#urlIniciaRechazo').val();

    $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            if (data.Exito) {

                $('#SelMotivoRechazo').empty();
                $('#SelMotivoRechazo').append(data.TipoRechazo);

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

$(document).on('click', '#BtnGuardarRechazo', function (e) {

    var Mensaje = ValidaCamposRequeridos(".ReqRechazo");

    if (Mensaje.length == 0) {

        Actividad = {
            IdActividad: $('#ActividadR').val(),
            IdAutorizacion: $('#AutorizacionR').val(),
            IdActividadVal: $('#AutorizacionValR').val(),
            Valida: false,
            MotivoRechazoId: $("#SelMotivoRechazo").val(),
            DescripcionRechazo: $("#TxtDescripcionRechazo").val().trim()
        };


        ValidaRechazaActividad(Actividad);
        $('#ModalRechazarActividad').modal('hide');

    }
    else {

        MensajeAdvertencia(Mensaje);
    }

    return false;
});

$(document).on('click', '.BtnVerRechazoP', function (e) {

    var filaPadre = $(this).closest('tr');
    var row = tablasEncabezado['TblActividades'].api().row(filaPadre);
    var datosFila = row.data();
    var Motivo = datosFila.MotivoRechazoId;
    var DescripcionRechazo = datosFila.DescripcionRechazo;

    $('#TituloRec').text("Ver motivo rechazo actividad #" + datosFila.IdActividad);
    VerRechazo(Motivo, DescripcionRechazo);

    return false;


});

$(document).on('click', '.BtnVerRechazoD', function (e) {

    var filaPadre = $(this).closest('tr');
    var row = tablaValidacion.api().row(filaPadre);
    var datosFila = row.data();
    var Motivo = datosFila.MotivoRechazoId;
    var DescripcionRechazo = datosFila.DescripcionRechazo;
    $('#TituloRec').text("Ver motivo rechazo actividad #" + datosFila.IdActividad);
    VerRechazo(Motivo, DescripcionRechazo);

    return false;


});

function VerRechazo(Motivo, Descripcion) {


    InicializaModalRechazar();
    $("#SelMotivoRechazo").val(Motivo);
    $("#TxtDescripcionRechazo").val(Descripcion);
    $("#BtnGuardarRechazo").addClass("hide");

    $('#ModalRechazarActividad').modal({ keyboard: false });



}

$(document).on('click', '#CerrarMotivoRechazo', function (e) {

    $("#ModalRechazarActividad").modal("hide");
    return false;
});

$(document).on('click', '#BtnCerrarValidaciones', function (e) {

    $("#ModalValidaciones").modal("hide");

    $('.modal.in').modal('hide');

    return false;
});

$(document).on('change', '#SelActividad', function (e) {

    CargaClasificacion();

    if ($('#SelActividad').val() === '195') {
        var date = new Date(), y = date.getFullYear(), m = date.getMonth(), d = date.getDate();
        var fecha = new Date(y, m, d);


        $('#divActividadRef').removeClass('hidden');
        $('#SelActividadRef').addClass('ReqActividad');
        $('#TxtHorasFacturables').val(0).prop('disabled', true);
        $('#TxtHorasAsignadas').val(0).prop('disabled', true);
        $('#TxtFechaInicio').val(moment(fecha).format("DD/MM/YYYY")).prop('disabled', true);
        $('#TxtFechaPlan').val(moment(fecha).format("DD/MM/YYYY")).prop('disabled', true);
        $('#ChkRetrabajo').prop('checked', true).prop('disabled', true);
        $('#RdoNoPlaneada2').prop('checked', true).prop('disabled', true);
        $('#RdoAlta2').prop('checked', true).prop('disabled', true);
    } else {
        $('#divActividadRef').addClass('hidden');
        $('#SelActividadRef').removeClass('ReqActividad');
        $('#TxtHorasFacturables').prop('disabled', false);
        $('#TxtHorasAsignadas').prop('disabled', false);
        $('#TxtFechaInicio').prop('disabled', false);
        $('#TxtFechaPlan').prop('disabled', false);
        $('#ChkRetrabajo').prop('disabled', false);
        $('#RdoNoPlaneada2').prop('disabled', false);
        $('#RdoAlta2').prop('disabled', false);
    }

    return false;

});

async function CargaClasificaciones() {
    await CargaClasificacion();

    if ($('#SelActividad').val() === '195') {
        var date = new Date(), y = date.getFullYear(), m = date.getMonth(), d = date.getDate();
        var fecha = new Date(y, m, d);


        $('#divActividadRef').removeClass('hidden');
        $('#SelActividadRef').addClass('ReqActividad');
        $('#TxtHorasFacturables').val(0).prop('disabled', true);
        $('#TxtHorasAsignadas').val(0).prop('disabled', true);
        $('#TxtFechaInicio').val(moment(fecha).format("DD/MM/YYYY")).prop('disabled', true);
        $('#TxtFechaPlan').val(moment(fecha).format("DD/MM/YYYY")).prop('disabled', true);
        $('#ChkRetrabajo').prop('checked', true).prop('disabled', true);
        $('#RdoNoPlaneada2').prop('checked', true).prop('disabled', true);
        $('#RdoAlta2').prop('checked', true).prop('disabled', true);
    } else {
        $('#divActividadRef').addClass('hidden');
        $('#SelActividadRef').removeClass('ReqActividad');
        $('#TxtHorasFacturables').prop('disabled', false);
        $('#TxtHorasAsignadas').prop('disabled', false);
        $('#TxtFechaInicio').prop('disabled', false);
        $('#TxtFechaPlan').prop('disabled', false);
        $('#ChkRetrabajo').prop('disabled', false);
        $('#RdoNoPlaneada2').prop('disabled', false);
        $('#RdoAlta2').prop('disabled', false);
    }

    return false;
}

$('#SelActividadRef').change(function () {
    if ($('#SelActividadRef').val() !== '-1') {
        $.ajax({
            url: $('#LeerRequerimientoActividad').val(),
            data: JSON.stringify({ IdActividad: $('#SelActividadRef').val() }),
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (data) {

                if (data.Exito) {
                    $('#TxtBR').val(data.BR);
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
    }
    else {
        $('#TxtBR').val('');
    }
});

async function CargaClasificacion() {


    var url = $('#urlCargarClasificacion').val();
    var IdTipoActividad = $("#SelActividad").val();

    return $.ajax({
        url: url,
        data: JSON.stringify({ IdTipoActividad: IdTipoActividad }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            if (data.Exito) {
                $('#SelClasificacion').empty();
                $('#SelClasificacion').append(data.LstClasificacion);
                $('#SelClasificacion').selectpicker('refresh');
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

}

$(document).on('change', '#SelProyecto, #SelActividad', function (e) {

    //if (TipoUsuario != 14) {

    CargaRecursosProyecto();
    //}

    if ($('#SelActividad').val() === '195') {
        EsBug = true;
    } else {
        false;
    }

    if (EsBug !== undefined && EsBug) {
        CargaActividadesQA();
    }


    return false;

});

async function CargaActividadesQA() {
    try {
        var idProyecto = $("#SelProyecto").val();
        const data = await POST($('#LeerActividadesQA').val(), { idProyecto: idProyecto }, false);

        if (data.Exito) {
            $('#SelActividadRef').empty();
            $('#SelActividadRef').append(data.CmbActividades);
            $('#SelActividadRef').selectpicker('refresh');
        } else {
            MensajeAdvertencia(data.Mensaje);
        }
    } catch (e) {
        console.log(e);
    }
}

function CargaRecursosProyecto() {


    var url = $('#urlCargarRecursosProyecto').val();
    var IdProyecto = $("#SelProyecto").val();

    $.ajax({
        url: url,
        data: JSON.stringify({ IdProyecto: IdProyecto }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            if (data.Exito) {
                $('#SelUsuarioAsignado').empty();
                $('#SelUsuarioAsignado').append(data.LstUsuarios);
                $('#SelUsuarioAsignado').selectpicker('refresh');

                $('#SelResponsable').empty();
                $('#SelResponsable').append(data.LstUsuarios);
                $('#SelResponsable').selectpicker('refresh');

                $('#SelSprintA').empty();
                $('#SelSprintA').append(data.LstSprints);
                $('#SelSprintA').selectpicker('refresh');

                IdUsuarioLider = data.IdUsuarioLider;
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
}

$('#SelTipoTask').change(e => {
    if ($(e.target).find('option:selected').text() === "Milestone") {
        $('#SelUsuarioAsignado').val(IdUsuarioLider);
        $('#SelUsuarioAsignado').selectpicker('refresh');
        $('#SelResponsable').val(IdUsuarioLider);
        $('#SelResponsable').selectpicker('refresh');
    }
});


function CapturarTrabajoAct() {


    var IdActividad = $("#IdActividad").val();

    if ($("#ActPSP").val() == 1 && !$('#chkPeerReview').prop('checked')) {
        var url = $('#urlTracking').val() + "?Id=" + IdActividad;
        window.open(url, '_blank');
    }
    else {

        $("#IdActividadCTra").val(IdActividad);
        $("#LblActividadDesc").text(IdActividad);
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
            var Actividad = $("#IdActividad").val().trim();
            ConsultaActividad(Actividad, false);
            $(this).off('hidden.bs.modal');

        });
        $('#ModalCapturarTrabajo').modal({ backdrop: 'static', keyboard: false });

    }


}

function CapturarTamano() {
    $('#ModalCapturarTamano').modal({ backdrop: 'static', keyboard: false });
    InicializarModalTamanos($("#IdActividad").val());
}

$(document).on('click', '#BtnAgregarComentario', function (e) {
    $('#TxtComentarioAct').val("");
    $('#TxtComentarioAct').focus();;
    $("#divcomentario").show();
    $("#BtnAgregarComentario").hide();

    return false;

});

$(document).on('click', '#BtnGuardarComentario', function (e) {

    var Mensaje = ValidaCamposRequeridos(".reqcomentario");

    if (Mensaje.length == 0) {

        Comentario = {
            IdActividad: $('#IdActividad').val(),
            Comentario: $('#TxtComentarioAct').val(),
        };

        var url = $('#urlGuardaComentario').val();

        $.ajax({
            url: url,
            data: JSON.stringify({ Comentario: Comentario }),
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            success: function (data) {

                if (data.Exito) {
                    $("#divcomentario").hide();
                    $("#BtnAgregarComentario").show();
                    $("#UlComentarios").empty();
                    $("#UlComentarios").append(data.LstComentarios);
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


    }
    else {

        MensajeAdvertencia(Mensaje);
    }

    return false;
});

//Para descargar el archivo
$(document).on('click', '.dz-preview', function (e) {

    var imagen = $(this).find('img');

    var url = imagen[0].src;

    window.open(url, '_blank');
    return false;


});

function EliminarArchivo(archivo) {

    Archivo = {
        IdActividad: $('#IdActividad').val(),
        Nombre: archivo.name,
    };

    var url = $('#urlEliminarArchivo').val();

    $.ajax({
        url: url,
        data: JSON.stringify({ Archivo: Archivo }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {

            if (data.Exito) {

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
}

$(document).on('click', '#BtnAgregarDependencia', function (e) {

    var Mensaje = ValidaCamposRequeridos(".ReqDependencia");

    if (Mensaje.length == 0) {

        Act = {
            IdActividad: $('#IdActividad').val(),
            IdActividadD: $('#SelActividades').val(),
        };

        var url = $('#urlInsertaRelacion').val();

        $.ajax({
            url: url,
            data: JSON.stringify({ Act: Act }),
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            success: function (data) {

                if (data.Exito) {

                    $('#SelActividades').val("-1");
                    $('#SelActividades').selectpicker('refresh');
                    dsDependenciasAct = jQuery.parseJSON(data.LstRelacionadas);
                    tablaDependenciasAct = inicializaTabla($('#TblActDependencias'), dsDependenciasAct, columnasDependencias, 1, "asc", false, false, false);

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


    }
    else {

        MensajeAdvertencia(Mensaje);
    }

    return false;
});


$(document).on('click', '.BtnEliminarDependencia', function (e) {

    var filaPadre = $(this).closest('tr');
    var row = tablaDependenciasAct.api().row(filaPadre);
    var datosFila = row.data();

    $("#IdActividadDependencia").val(datosFila.IdActividadDependencia);
    MensajeConfirmarAccion("¿Desea eliminar esta actividad?", "BtnEliminaDependencia");

    return false;

});


$(document).on('click', '#BtnAgregarIssueActividad', function (e) {

    var Mensaje = ValidaCamposRequeridos(".ReqIssuesAct");

    if (Mensaje.length == 0) {

        Act = {
            IdActividad: $('#IdActividad').val(),
            IdIssue: $('#SelIssues').val(),
        };

        var url = $('#urlInsertaActividadIssue').val();

        $.ajax({
            url: url,
            data: JSON.stringify({ Act: Act }),
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            success: function (data) {

                if (data.Exito) {

                    $('#SelIssues').val("-1");
                    $('#SelIssues').selectpicker('refresh');

                    dsIssuesAct = jQuery.parseJSON(data.LstRelacionadas);
                    tablaIssuesAct = inicializaTabla($('#TblActIssues'), dsIssuesAct, columnasIssuesAct, 1, "asc", false, false, false);

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


    }
    else {

        MensajeAdvertencia(Mensaje);
    }

    return false;
});


$(document).on('click', '.BtnEliminarIssueActividad', function (e) {

    var filaPadre = $(this).closest('tr');
    var row = tablaIssuesAct.api().row(filaPadre);
    var datosFila = row.data();

    $("#IdActividadIssue").val(datosFila.IdActividadIssue);
    MensajeConfirmarAccion("¿Desea eliminar la relación?", "BtnEliminaActividadIssue");

    return false;

});

$(document).on('click', '.btnEditarIssueAct', function (e) {

    var filaPadre = $(this).closest('tr');
    var row = tablaIssuesAct.api().row(filaPadre);
    var datosFila = row.data();

 /*   $("#IdActividadIssue").val(datosFila.IdActividadIssue);*/

    Issue.Funciones.EditarIssue(datosFila.IdIssue);

/*    MensajeConfirmarAccion("¿Desea eliminar la relación?", "BtnEliminaActividadIssue");*/

    return false;

});



$(document).on('click', '#BtnEliminaDependencia', function (e) {

    var IdActividadDependencia = $('#IdActividadDependencia').val();

    var url = $('#urlEliminaRelacion').val();

    $.ajax({
        url: url,
        data: JSON.stringify({ IdActividadDependencia: IdActividadDependencia }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            if (data.Exito) {

                dsDependenciasAct = jQuery.parseJSON(data.LstRelacionadas);
                tablaDependenciasAct = inicializaTabla($('#TblActDependencias'), dsDependenciasAct, columnasDependencias, 1, "asc", false, false, false);


            }
            else {

                MensajeAdvertencia(data.Mensaje);

            }

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error al cancelar la actividad, intente de nuevo.");
        }
    });

    return false;
});


$(document).on('click', '#BtnEliminaActividadIssue', function (e) {

    var IdActividadIssue = $('#IdActividadIssue').val();

    var url = $('#urlEliminaActividadIssue').val();

    $.ajax({
        url: url,
        data: JSON.stringify({ IdActividadIssue: IdActividadIssue }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            if (data.Exito) {

                dsIssuesAct = jQuery.parseJSON(data.LstRelacionadas);
                tablaIssuesAct = inicializaTabla($('#TblActIssues'), dsIssuesAct, columnasIssuesAct, 1, "asc", false, false, false);



            }
            else {

                MensajeAdvertencia(data.Mensaje);

            }

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error al cancelar la actividad, intente de nuevo.");
        }
    });

    return false;
});


//function CargaActividades() {
//    var a = "Dummy function";
//}

const ActividadPeerReview = {
    Controles: {
        dtControles: $('#tab-actividad-peer').find('.dtControles'),
        chkPeerReview: $('#chkPeerReview'),
        selPeerReview: $('#selPeerReview'),
        selActividadRefPeer: $('#SelActividadRefPeer'),
        divPeerReview: $('.divPeerReview'),
        documento: $(document),

        mdlHallazgos: $('.modulo-revision.mdlHallazgos'),
        cmbGravedadHallazgo: $('.modulo-revision.mdlHallazgos').find('.cmbGravedad'),
        txtDescripcionHallazgo: $('.modulo-revision.mdlHallazgos').find('.txtDescripcionHallazgo'),
        chkCorregidoHallazgo: $('.modulo-revision.mdlHallazgos').find('.chkCorregidoHallazgo'),
        btnGuardarHallazgo: $('.modulo-revision.mdlHallazgos').find('.btnGuardarHallazgo'),
        dtHallazgos: $('.modulo-revision.mdlHallazgos').find('.dtHallazgos'),
    },
    Constantes: {
        colControles: [
            {
                "data": "Control",
                "class": "text-left"
            },
            {
                "data": "Cumple",
                "class": "text-center position-relative",
                "render": (data, _, _row, x) => `<i style="font-size: 20px; color: ${data === null ? '' : data ? 'darkgreen' : 'darkred'};" class="${data === null ? 'fa fa-minus' : data ? 'fa fa-check' : 'fa fa-times'}"></i><button style="right:5px;" id=${x.row} class="btnTooltip fa fa-ellipsis-v" data-placement="left" data-toggle="tooltip" data-html="true" title='${ActividadPeerReview.Funciones.LeerTooltip()}'></button>`
            },
            {
                "render": (_data, _, row) =>
                    `<div style="display: flex; align-items: center;">
                        <div style="width: 50%; text-align: right; padding-right: 10px;">
                            <label style="margin-bottom: 0px !important">${row.TotalHallazgos}</label>
                        </div>
                        <a class="modulo-revision btnLeerHallazgos" href="#"><i style="font-size: 25px; color: #08C127; cursor: pointer;" class="fa fa-plus-circle"></i></a>
                    </div>
                    ${row.TotalHallazgos > 0 ?
                        `<div style="display: flex; justify-content: center;">
                            <span class="label label-success" style="font-size: 10px;">${row.HallazgosCorregidos}</span>
                            <span class="label label-danger" style="font-size: 10px;">${row.HallazgosNoCorregidos}</span>
                        </div>` :
                        ''}`
            }
        ],
        colHallazgos: [
            {
                "data": "Corregido",
                "class": "text-center",
                "render": data => `${data ? "✔" : "✖"}`
            },
            {
                "data": "Descripcion",
                "class": "text-left"
            },
            {
                "data": "Gravedad",
                "class": "text-left",
                "render": data => `${data === 1 ? "Bajo" : data === 2 ? "Medio" : data === 3 ? "Grave" : ""}`
            },
            {
                "class": "text-center",
                "render": () => '<button class="btn btn-primary-light btn-sm modulo-revision btnEditarHallazgo"><i class="fa fa-edit"></i></button>'
            },
            {
                "class": "text-center",
                "render": () => '<button class="btn btn-primary-light btn-sm modulo-revision btnEliminarHallazgo"><i class="fa fa-trash"></i></button>'
            }
        ],
        tooltip: `<a class="modulo-revision btnCumple" href="#"><i style="font-size: 20px; color: green;" class="fa fa-check-circle"></i></a>
                  <a class="modulo-revision btnNoCumple" href="#"><i style="font-size: 20px; color: red;" class="fa fa-times-circle"></i></a>`,
        urlLeerListasRevision: $('#LeerListaRevisionPorCategoria').val(),
        urlLeerControles: $('#LeerListaRevisionActividad').val(),
        urlRevisarControl: $('#EditarActividadRevision').val(),
        urlLeerHallazgos: $('#LeerActividadRevisionHallazgo').val(),
        urlGuardarHallazgos: $('#GuardarActividadRevisionHallazgo').val(),
        urlEliminarHallazgo: $('#EliminarActividadRevisionHallazgo').val(),
        urlLeerActividades: $('#LeerActividadesPorCategoria').val(),
    },
    Eventos: {
        InicializaEventos: () => {
            ActividadPeerReview.Controles.chkPeerReview.off('click').click(ActividadPeerReview.Funciones.EsPeerReview);
            ActividadPeerReview.Controles.selPeerReview.off('change').change(ActividadPeerReview.Funciones.ChangePeerReview);
            ActividadPeerReview.Controles.btnGuardarHallazgo.off('click').click(ActividadPeerReview.Funciones.GuardarHallazgo);
            ActividadPeerReview.Controles.mdlHallazgos.on('hidden.bs.modal', ActividadPeerReview.Funciones.CerrarModalHallazgos);
            ActividadPeerReview.Controles.documento.off('click', '.modulo-revision.btnEditarHallazgo').on('click', '.modulo-revision.btnEditarHallazgo', ActividadPeerReview.Funciones.EditarHallazgo);
            ActividadPeerReview.Controles.documento.off('click', '.modulo-revision.btnLeerHallazgos').on('click', '.modulo-revision.btnLeerHallazgos', ActividadPeerReview.Funciones.ModalHallazgos);
            ActividadPeerReview.Controles.documento.off('mouseenter', '.btnTooltip').on('mouseenter', '.btnTooltip', ActividadPeerReview.Funciones.Tooltip.MouseEnterTooltip);
            ActividadPeerReview.Controles.documento.off('mouseleave', '.btnTooltip').on('mouseleave', '.btnTooltip', ActividadPeerReview.Funciones.Tooltip.MouseLeaveTooltip);
            ActividadPeerReview.Controles.documento.off('click', '.btnTooltip').on('click', '.btnTooltip', ActividadPeerReview.Funciones.Tooltip.MouseEnterTooltip);
            ActividadPeerReview.Controles.documento.off('mouseenter', '.tooltip').on('mouseenter', '.tooltip', ActividadPeerReview.Funciones.Tooltip.MouseEnterTooltipClass);
            ActividadPeerReview.Controles.documento.off('mouseleave', '.tooltip').on('mouseleave', '.tooltip', ActividadPeerReview.Funciones.Tooltip.MouseLeaveTooltipClass);
            ActividadPeerReview.Controles.documento.off('click', '.modulo-revision.btnCumple').on('click', '.modulo-revision.btnCumple', ActividadPeerReview.Funciones.Cumple);
            ActividadPeerReview.Controles.documento.off('click', '.modulo-revision.btnNoCumple').on('click', '.modulo-revision.btnNoCumple', ActividadPeerReview.Funciones.NoCumple);
        }
    },
    Funciones: {
        EliminarHallazgo: async e => {
            e.preventDefault();

            const idActividadListaRevisionHallazgo = ObtenerData(ActividadPeerReview.Variables.dtHallazgos, e).IdActividadListaRevisionHallazgo;

            const data = await POST(
                Auditoria.Constantes.urlEliminarHallazgo,
                {
                    IdActividadListaRevisionHallazgo: idActividadListaRevisionHallazgo,
                    IdActividadListaRevision: ActividadPeerReview.Variables.idActividadListaRevision,
                    IdActividad: ActividadPeerReview.Variables.idActividad,
                },
                false
            );

            if (data.Exito) {
                MensajeExito(data.Mensaje);
                ActividadPeerReview.Funciones.LeerHallazgos();
                ActividadPeerReview.Funciones.LeerControles(ActividadPeerReview.Variables.idActividad, ActividadPeerReview.Variables.idListaRevision);
            } else {
                MensajeAdvertencia(data.Mensaje);
            }
        },
        EditarHallazgo: e => {
            e.preventDefault();

            const data = ActividadPeerReview.Variables.dtHallazgos.api().row($(e.target).closest('tr')).data();
            ActividadPeerReview.Variables.idActividadListaRevisionHallazgo = data.IdActividadListaRevisionHallazgo;
            ActividadPeerReview.Controles.cmbGravedadHallazgo.val(data.Gravedad);
            ActividadPeerReview.Controles.txtDescripcionHallazgo.val(data.Descripcion);
            ActividadPeerReview.Controles.chkCorregidoHallazgo.prop('checked', data.Corregido);
            ActividadPeerReview.Controles.btnGuardarHallazgo.html('Editar <span class="fa fa-floppy-o fa-right"></span>');
        },
        GuardarHallazgo: async e => {
            e.preventDefault();

            const mensaje = ValidaCamposRequeridos('.RequeridoHallazgo.modulo-revision');

            if (mensaje.length === 0) {
                const gravedad = ActividadPeerReview.Controles.cmbGravedadHallazgo.val();
                const descripcion = ActividadPeerReview.Controles.txtDescripcionHallazgo.val();
                const corregido = ActividadPeerReview.Controles.chkCorregidoHallazgo.prop('checked');

                data = await POST(
                    ActividadPeerReview.Constantes.urlGuardarHallazgos,
                    {
                        IdActividadListaRevisionHallazgo: ActividadPeerReview.Variables.idActividadListaRevisionHallazgo,
                        IdActividadListaRevision: ActividadPeerReview.Variables.idActividadListaRevision,
                        IdActividad: ActividadPeerReview.Variables.idActividad,
                        Gravedad: gravedad,
                        Descripcion: descripcion,
                        Corregido: corregido
                    },
                    false
                );

                if (data.Exito) {
                    MensajeExito(data.Mensaje);
                    ActividadPeerReview.Funciones.LeerHallazgos();
                    ActividadPeerReview.Funciones.LeerControles(ActividadPeerReview.Variables.idActividad, ActividadPeerReview.Variables.idListaRevision);

                    // eslint-disable-next-line
                    ActividadPeerReview.Variables.idActividadListaRevisionHallazgo = 0;
                    ActividadPeerReview.Controles.cmbGravedadHallazgo.val('-1');
                    ActividadPeerReview.Controles.txtDescripcionHallazgo.val('');
                    ActividadPeerReview.Controles.chkCorregidoHallazgo.prop('checked', false);
                    ActividadPeerReview.Controles.btnGuardarHallazgo.html('Guardar <span class="fa fa-floppy-o fa-right"></span>');
                } else {
                    MensajeAdvertencia(data.Mensaje);
                }
            } else {
                MensajeAdvertencia(mensaje);
            }
        },
        CerrarModalHallazgos: () => {
            $('#ModalActividades').modal('show');
            ActividadPeerReview.Controles.mdlHallazgos.modal('hide');
        },
        ModalHallazgos: async e => {
            e.preventDefault();

            ActividadPeerReview.Funciones.LimpiarModalHallazgos();
            ActividadPeerReview.Variables.idActividadListaRevision =
                ObtenerData(ActividadPeerReview.Variables.dtControles, e).IdActividadListaRevision;

            ActividadPeerReview.Funciones.LeerHallazgos();
        },
        LeerHallazgos: async () => {
            const data = await POST(
                ActividadPeerReview.Constantes.urlLeerHallazgos,
                {
                    IdActividad: ActividadPeerReview.Variables.idActividad,
                    IdActividadListaRevision: ActividadPeerReview.Variables.idActividadListaRevision
                }, false
            );

            if (data.Exito) {
                ActividadPeerReview.Funciones.InicializaTablaHallazgos(data.Hallazgos);

                ActividadPeerReview.Controles.mdlHallazgos.modal('show');
                $('#ModalActividades').modal('hide');
            } else {
                MensajeAdvertencia(data.Mensaje);
            }
        },
        LimpiarModalHallazgos: () => {
            ActividadPeerReview.Controles.cmbGravedadHallazgo.val('-1');
            ActividadPeerReview.Controles.txtDescripcionHallazgo.val('');
            ActividadPeerReview.Controles.chkCorregidoHallazgo.prop('checked', false);
            ActividadPeerReview.Funciones.InicializaTablaHallazgos();
            ActividadPeerReview.Variables.idActividadListaRevision = 0;
            ActividadPeerReview.Variables.idActividadListaRevisionHallazgo = 0;
        },
        InicializaTablaHallazgos: (datos = []) => {
            ActividadPeerReview.Variables.dtHallazgos =
                InicializaTabla({
                    tabla: ActividadPeerReview.Controles.dtHallazgos,
                    datos: datos,
                    columnas: ActividadPeerReview.Constantes.colHallazgos,
                    nonOrderableColumns: [0, 3, 4],
                    columnaOrdena: 1
                });
        },
        Cumple: e => {
            e.preventDefault();
            e.stopPropagation();

            ActividadPeerReview.Funciones.ActualizarControlCumple(e.currentTarget, true);
        },
        NoCumple: e => {
            e.preventDefault();
            e.stopPropagation();

            ActividadPeerReview.Funciones.ActualizarControlCumple(e.currentTarget, false);
        },
        ActualizarControlCumple: async (element, cumple) => {
            try {
                const id = $(element).parent().parent()[0].id;
                const rowElement = $(`[aria-describedby="${id}"]`);
                const datos = ActividadPeerReview.Variables.dtControles.api().row(rowElement.closest('tr')).data();

                if (datos === null || datos === undefined)
                    MensajeAdvertencia('Hubo un error al guardar los cambios.');
                else {
                    const data = await POST(
                        ActividadPeerReview.Constantes.urlRevisarControl,
                        {
                            IdActividadListaRevision: datos.IdActividadListaRevision,
                            IdActividad: datos.IdActividad,
                            Cumple: cumple,
                        },
                        false
                    );

                    if (data.Exito) {
                        MensajeExito(data.Mensaje);
                        ActividadPeerReview.Funciones.LeerControles(ActividadPeerReview.Variables.idActividad, ActividadPeerReview.Variables.idListaRevision);
                    } else {
                        MensajeAdvertencia(data.Mensaje);
                    }
                }
            } catch (e) {
                MensajeAdvertencia('Hubo un error al guardar los cambios.');
            }
        },
        Tooltip: {
            MouseEnterTooltip: e => {
                //e.preventDefault();
                e.target.focus();
                $('.btnTooltip').not(`button.btnTooltip#${e.target.id === "" ? "0" : e.target.id}`).trigger('blur');
                ActividadPeerReview.Variables.mostrarTooltip = true;
            },
            MouseLeaveTooltip: e => {
                ActividadPeerReview.Variables.mostrarTooltip = false;
                e.preventDefault();
                setTimeout(() => { if (!ActividadPeerReview.Variables.mostrarTooltip) { $(`.btnTooltip`).trigger('blur'); $('.tooltip').tooltip('hide'); } }, 600);
            },
            MouseEnterTooltipClass: e => {
                //e.preventDefault();
                ActividadPeerReview.Variables.mostrarTooltip = true;
            },
            MouseLeaveTooltipClass: e => {
                e.preventDefault();
                setTimeout(() => {
                    $(`.btnTooltip`).trigger('blur'); $('.tooltip').tooltip('hide');
                }, 350);
                ActividadPeerReview.Variables.mostrarTooltip = false;
            }
        },
        LeerTooltip: () => {
            return ActividadPeerReview.Constantes.tooltip;
        },
        EsPeerReview: async e => {
            if (e.target.checked) {
                if ($('#SelProyecto').val() === '-1' || $('#SelActividad').val() === '-1' || $('#SelClasificacion').val() === '-1') {
                    MensajeAdvertencia('Debe seleccionar Proyecto, Fase y Clasificación para habilitar esta opción');
                    ActividadPeerReview.Controles.chkPeerReview.prop('checked', false);
                    return;
                }

                ActividadPeerReview.Funciones.InicializaTabla();
                ActividadPeerReview.Controles.selPeerReview.val('-1');
                ActividadPeerReview.Controles.selPeerReview.selectpicker('refresh');
                ActividadPeerReview.Controles.selActividadRefPeer.val('-1');
                ActividadPeerReview.Controles.selActividadRefPeer.selectpicker('refresh');
                $('.tab-actividad-peer').removeClass('hidden');
                $('#tab-actividad-peer').removeClass('hidden');

                ActividadPeerReview.Funciones.LeerListaRevision($('#SelProyecto').val(), $('#SelActividad').val(), $('#SelClasificacion').val());
                ActividadPeerReview.Funciones.LeerActividades($('#SelProyecto').val(), $('#SelActividad').val(), $('#SelClasificacion').val());
            } else {
                ActividadPeerReview.Controles.divPeerReview.addClass('hidden');
                ActividadPeerReview.Controles.selPeerReview.removeClass('ReqActividad');
                ActividadPeerReview.Controles.selActividadRefPeer.removeClass('ReqActividad');
                $('.tab-actividad-peer').addClass('hidden');
                $('#tab-actividad-peer').addClass('hidden');
                ActividadPeerReview.Controles.selPeerReview.empty().append('<option value="-1">--Seleccionar--</option>');
                ActividadPeerReview.Controles.selActividadRefPeer.empty().append('<option value="-1">--Seleccionar--</option>');
            }
        },
        LeerActividades: async (idProyecto, idFase, idClasificacion) => {
            try {
                const data = await POST(ActividadPeerReview.Constantes.urlLeerActividades, {
                    IdProyecto: idProyecto,
                    CatalogoFaseId: idFase,
                    CatalogoClasificacionId: idClasificacion,
                }, false);

                if (data.Exito) {
                    ActividadPeerReview.Controles.divPeerReview.removeClass('hidden');
                    ActividadPeerReview.Controles.selActividadRefPeer.empty().append(data.CmbListas);
                    ActividadPeerReview.Controles.selActividadRefPeer.selectpicker('refresh');
                /*    ActividadPeerReview.Controles.selActividadRefPeer.addClass('ReqActividad');*/
                } else {
                    data.MensajeAdvertencia(data.Mensaje);
                }
            } catch (e) {
                MensajeError(e.textStatus);
            }
        },
        LeerListaRevision: async (idProyecto, idFase, idClasificacion) => {
            try {
                const data = await POST(ActividadPeerReview.Constantes.urlLeerListasRevision, {
                    IdProyecto: idProyecto,
                    CatalogoFaseId: idFase,
                    CatalogoClasificacionId: idClasificacion,
                }, false);

                if (data.Exito) {
                    ActividadPeerReview.Controles.divPeerReview.removeClass('hidden');
                    ActividadPeerReview.Controles.selPeerReview.empty().append(data.CmbListas);
                    ActividadPeerReview.Controles.selPeerReview.selectpicker('refresh');
                    ActividadPeerReview.Controles.selPeerReview.addClass('ReqActividad');
                } else {
                    data.MensajeAdvertencia(data.Mensaje);
                }
            } catch (e) {
                MensajeError(e.textStatus);
            }
        },
        InicializaTabla: (data = []) => {
            ActividadPeerReview.Variables.dtControles = InicializaTabla({
                tabla: ActividadPeerReview.Controles.dtControles,
                datos: data,
                columnas: ActividadPeerReview.Constantes.colControles,
                incluyeBusqueda: false,
                nonOrderableColumns: [1, 2],
                paginada: false,
            });
        },
        Init: async (idActividad, idListaRevision, idActividadRef) => {
            ActividadPeerReview.Variables.idActividad = idActividad;
            ActividadPeerReview.Variables.idListaRevision = idListaRevision;

            ActividadPeerReview.Eventos.InicializaEventos();
            if (idActividad > 0) {
                ActividadPeerReview.Funciones.InicializaTabla();
                if (idListaRevision > 0) {
                    ActividadPeerReview.Funciones.ConfiguracionInicial(idListaRevision, idActividadRef);
                    ActividadPeerReview.Funciones.LeerControles(idActividad, idListaRevision);
                }
            }
        },
        ChangePeerReview: e => {
            const id = parseInt(e.target.value);

            if (id === -1) {
                ActividadPeerReview.Controles.selPeerReview.val(id);
                ActividadPeerReview.Controles.selPeerReview.selectpicker('refresh');
                ActividadPeerReview.Funciones.InicializaTabla();
                return;
            }

            $('.divPeerReview').removeClass('hidden');

            ActividadPeerReview.Controles.selPeerReview.val(id);
            ActividadPeerReview.Controles.selPeerReview.selectpicker('refresh');

            ActividadPeerReview.Variables.idListaRevision = id;
            if (ActividadPeerReview.Variables.idActividad > 0)
                ActividadPeerReview.Funciones.LeerControles(ActividadPeerReview.Variables.idActividad, id);
        },
        LeerControles: async (idActividad, idListaRevision) => {
            try {
                const data = await POST(ActividadPeerReview.Constantes.urlLeerControles, { idActividad, idListaRevision });
                if (data.Exito) {
                    ActividadPeerReview.Funciones.InicializaTabla(data.Controles);
                } else {
                    MensajeAdvertencia(data.Mensaje);
                }
            } catch (e) {
                MensajeError(e.textStatus);
            }
        },
        ConfiguracionInicial: async (idListaRevision, idActividadRef) => {
            ActividadPeerReview.Controles.chkPeerReview.prop('checked', true);
            await ActividadPeerReview.Funciones.LeerListaRevision($('#SelProyecto').val(), $('#SelActividad').val(), $('#SelClasificacion').val());
            await ActividadPeerReview.Funciones.LeerActividades($('#SelProyecto').val(), $('#SelActividad').val(), $('#SelClasificacion').val());
            ActividadPeerReview.Controles.selPeerReview.val(idListaRevision);
            ActividadPeerReview.Controles.selPeerReview.selectpicker('refresh');
            ActividadPeerReview.Controles.selActividadRefPeer.val(idActividadRef);
            ActividadPeerReview.Controles.selActividadRefPeer.selectpicker('refresh');
            $('.tab-actividad-peer').removeClass('hidden');
            $('#tab-actividad-peer').removeClass('hidden');
            $('.divPeerReview').removeClass('hidden');
            $('.tab-actividad-peer').click();
        }
    },
    Variables: {
        dtControles: null,
        dtHallazgos: null,
        mostrarTooltip: false,
        idActividad: 0,
        idListaRevision: 0,
        idActividadListaRevision: 0,
        idActividadListaRevisionHallazgo: 0
    }
}

$('#SelProyecto, #SelActividad, #SelClasificacion').change(() => {
    ActividadPeerReview.Controles.chkPeerReview.prop('checked', false);
    ActividadPeerReview.Controles.divPeerReview.addClass('hidden');
    ActividadPeerReview.Controles.selPeerReview.empty().append('<option value="-1">--Seleccionar--</option>');
    $('.tab-actividad-peer').addClass('hidden');
    $('#tab-actividad-peer').addClass('hidden');
});