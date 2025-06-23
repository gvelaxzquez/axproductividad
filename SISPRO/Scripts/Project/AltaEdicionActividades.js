var EsBug;
var EsMejora;
var onEdit = 0;
var ActividadCreada = {
    id: 0
};
var IdUsuarioLider;
var editor;
moment.locale("es");
Actividad = {};

var TipoUsuario;
var Usuario;
var dsValidaciones = [];
var tablaValidacion;
var dsValidacionesAct = [];
var tablaValidacionAct;
/*let dropxon;*/

Dropzone.autoDiscover = false;


var columnasValidacion = [

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
                return '<div class="btn-group"><button class="btn btn-success glyphicon glyphicon-ok BtnAprobarAct"></button><button class="btn btn-danger  glyphicon glyphicon-remove BtnRechazarAct"></button></div>';
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
var columnasValidacionAct = [

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
                return '<div class="btn-group"><button class="btn btn-success glyphicon glyphicon-ok BtnAprobarActdet"></button><button class="btn btn-danger  glyphicon glyphicon-remove BtnRechazarActdet"></button></div>';
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
var dsTrabajosAct = [];
var tablaTrabajosAct;
var columnasTrabajosAct = [

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
//var dsDependenciasAct = [];
//var tablaDependenciasAct;
//var columnasDependencias = [

//    {
//        "data": "IdActividadStr",
//        "class": "text-left",
//        //"render": function (data, type, row) {
//        //    return '<a style="cursor:pointer" href="#" onclick="clickalerta(' + row.IdActividad + ' )" >' + data + '</a>'
//        //}
//    },
//    {
//        "data": "Descripcion",
//        "class": "text-left"
//    },
//    {
//        "data": "ResponsableStr",
//        "class": "text-center",
//        "render": function (data, type, row) {
//            return '<span  class="btn btn-small Open" style="text-align:left; width:100%;">' + data + '</span>';
//        }
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
//        "data": "FechaSolicitado",
//        "class": "text-center",
//        "render": function (data, type, row) {
//            return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))
//        }
//    },
//    {
//        "data": "EsPeerReview",
//        "class": "text-center",
//        "render": function (data, type, row) {
//            return data ? '' : '<button class="btn btn-danger BtnEliminarDependencia"><span class="fa fa-trash-o"></span></button>'


//        }
//    }
//];
var plantilla;
var dtRepositorio;
var dsIssuesAct = [];
var tablaIssuesAct;
var columnasIssuesAct = [

    {
        "data": "NoIssue",
        "class": "text-left",

        "render": function (data, type, row) {
            return '<a class="btnEditarIssueAct" role="button">' + data + '</a>'
        }

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

    },

    {
        "data": "IdActividadIssue",
        "class": "text-center",
        "render": function (data, type, row) {
            return '<button class="btn btn-danger BtnEliminarIssueActividad"><span class="fa fa-trash-o"></span></button>'


        }
    }
];

const colRepositorio = [
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

$(document).ready(function () {
    //Dropzone.prototype.defaultOptions.dictRemoveFile = "Eliminar archivo";
    //Dropzone.prototype.defaultOptions.dictCancelUpload = "Cancelar";

    //dropxon = new Dropzone("div#dZUpload", {
    //    url: $('#urlGuardaArchivo').val(),
    //    maxThumbnailFilesize: 1000,
    //    filesizeBase: 102400,
    //    maxFilesize: 102400,
    //    uploadMultiple: true,
    //    clickable: true,
    //    maxFiles: 1,
    //    success: function (file, response) {

    //    },
    //    error: function (file, response) {

    //        if (response == "You can not upload any more files.") {
    //            MensajeAdvertencia('Solo es posible cargar un archivo.');

    //        }
    //        else {
    //            MensajeAdvertencia('Ocurrio un error al cargar el archivo intente de nuevo.');

    //        }
    //        this.removeFile(file);
    //    }
    //});

    //dropxon.on('sending', function (file, xhr, formData) {
    //    formData.append('IdActividad', $('#IdActividad').val());

    //});
    //dropxon.on("complete", function (file) {
    //    console.log('Se agregó');

    //});

    //dropxon.on("removedfile", function (file) {
    //    if (file.status !== "success")
    //        EliminarArchivo(file);
    //});


    $('#TxtSendMails').tagsInput({ 'height': '50px' });

    tinymce.init({
        selector: "#TxtDescripcion",
        plugins: "powerpaste casechange searchreplace autolink directionality advcode visualblocks visualchars image link media mediaembed codesample table charmap pagebreak nonbreaking anchor tableofcontents insertdatetime advlist lists checklist wordcount tinymcespellchecker editimage help formatpainter permanentpen charmap tinycomments linkchecker emoticons advtable export print ",
        toolbar: "undo redo print spellcheckdialog formatpainter | blocks fontfamily fontsize | bold italic underline forecolor backcolor | link image addcomment showcomments  | alignleft aligncenter alignright alignjustify lineheight | checklist bullist numlist indent outdent | removeformat",
        height: '700px',
        toolbar_sticky: false,
        icons: 'thin',
        autosave_restore_when_empty: true,
        tinycomments_mode: 'embedded',
        tinycomments_author: 'john.doe',
        tinycomments_author_name: 'John Doe',
        content_style: `
                body {
                    background: #fff;
                }

                @media (min-width: 840px) {
                    html {
                        background: #eceef4;
                        min-height: 100%;
                        padding: 0 .5rem
                    }

                    body {
                        background-color: #fff;
                        box-shadow: 0 0 4px rgba(0, 0, 0, .15);
                        box-sizing: border-box;
                        margin: 1rem auto 0;
                        max-width: 820px;
                        min-height: calc(100vh - 1rem);
                        padding:4rem 6rem 6rem 6rem
                    }
                }
            `,
    });

    $(".tox-promotion").addClass("hide");


});
async function InicializaAltaActividades() {
    ActividadPeerReview.Funciones.Init(0, 0);
 
    await CargaCombosAct();
    InicializaControles();


    $('#IdActividad').val(0);
    $('#ActPSP').val(0);
    $('#divHorasUtil').hide();
    $('#divFechaFin').hide();
    $('#divVerArchivo').hide();

    $('#LblDescripcion').hide();
    $('#LblCriterioA').hide();
    $('#btnEditarActDesc').hide();
    $('#btnEditarCA').hide();
    $('.note-editor').show();
    $('#editor').removeClass("hide");
    tinymce.get("TxtDescripcion").mode.set('design');
    tinymce.get("TxtDescripcion").show();
    tinymce.get("TxtDescripcion").setContent("");
   
 

    if (TipoUsuario == 14 && !EsBug) {
        $('#SelUsuarioAsignado').val(Usuario);
        $('#SelUsuarioAsignado').selectpicker('refresh')
    }
    if (TipoUsuario == 15 || EsBug) {
        $('#SelResponsable').val(Usuario);
        $('#SelResponsable').selectpicker('refresh');
        $('#ChkCritico').prop('checked', true);
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

    $("#spEstatusC").addClass("text-info");
    $("#BtnEstatus").text("Abierto");

    $(".rwdetails").hide();

    if ($('#IdActividadRel').val() != 0) {

        ConsultaActividadRelacionar();
    }
   
    onEdit = 1;
}

function InicializaControles() {

    $('#TxtFechaPlan,#TxtFechaFin, #TxtFechaInicio,#TxtFechaInicioAR, #TxtFechaPlanAR').datetimepicker(
        {
            format: 'DD/MM/YYYY'
        });

    cambiaEstadoSwitch($('#ChkCritico'), false);





    if ($('#IdProyectoAct').val() === 0 || $('#IdProyectoAct').val() === undefined) {
        $('#SelProyecto').val('-1');
    }
    else {
        $('#SelProyecto').val($('#IdProyectoAct').val());
        $('#SelProyecto').selectpicker('refresh');
        CargaRecursosProyecto();
    }

    Actividad = {}

    $(".ReqActividad").removeAttr("disabled");
    $(".ReqCierre").removeAttr("disabled");
    $("#SelSprintA").removeAttr("disabled");
    $("#BtnGuardarActividad").removeClass("hide");
    /*   $('#TxtDescripcion').code('');*/

    $("#BtnEjecutarTCActivity").hide();

    tinymce.get("TxtDescripcion").setContent("");
    $('#TxtCriterioA').code('');
    $('#TxtBR').val('');

    var idemoji = $("#TxtBR").attr('data-id');
    $("div[data-id='" + idemoji + "'][data-type='input']").text('');

    $('#TxtTiempoEjecucion').val('');
    $('#TxtPuntosHistoria').val('');
    $('#TxtHorasFacturables').val('');
    $('#TxtHorasAsignadas').val('');
    $('#TxtFechaInicio').val('');
    $('#TxtFechaPlan').val('');
    $("#FlArchivo").parent().next().text("");
    $('#TxtFechaFin').val('');


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
    $("#spEstatusC").removeClass("text-info text-progress text-warning text-success text-danger text-muted");
    $("#BtnEstatus").text("");
    $("#divProgreso").empty();
    cambiaEstadoSwitch($('#ChkRetrabajo'), false);
 
    cambiaEstadoSwitch($('#chkPeerReview'), false);
    $('.divPeerReview').addClass('hidden');
    $('#tab-actividad-peer').addClass('hidden');
    $('#divcomentario').hide();
    $('#BtnAgregarComentario').show();
    $('#TxtComentarioAct').val("");
    $('#div-repositorio').addClass('hidden');


    $("#BtnAgregarComentario").hide();
    $("#UlComentarios").empty();

    $('.summernote').summernote({
        airMode: true,
        dialogsInBody: true,
        disableDragAndDrop: true
    });
  
    $("#show-share-div").hide();
    $('.note-view').hide();
    $('.note-help').hide();



    $('#parents-div').addClass('hidden');
    $('.divMensajes.div-parents-repo').empty();
    $('.divMensajes.div-attachments-repo').empty();
    $('.divMensajes.div-comentarios-repo').empty();
    $('#show-parents-div').hide();
    $('#add-attachments').hide();
    $('#show-repo-div').hide();
    $('#show-issues-div').hide();
    $('#issues-div').addClass('hidden');
    $('.divMensajes.div-issues-repo').empty();


    $(".rwdetails").removeClass("active");
    $(".tabpaneactivity").removeClass("active");
    $("#rwPrincipal").addClass("active");
    $("#tab-details").addClass("active");


 

}

async function CargaCombosAct() {

    var url = $('#urlCargaInicialAct').val();

    await $.ajax({

        url: url,
        data: JSON.stringify({ Tipo: $('#IdTipoActividad').val() }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            if (data.Exito) {


                var wi = jQuery.parseJSON(data.WorkItem);


                if ($('#IdTipoActividad').val() != 0) {
                    $('#TituloActividadWI').text(wi.Nombre);
                    $('#TituloActividades').text("Nuevo");
                    $('#ImgActividad').attr('src', "/Content/Project/Imagenes/" + wi.Url);
                    $(wi.NoRequeridos).removeClass("ReqActividad");
                    $(wi.Ver).show();
                    $(wi.Requeridos).addClass("ReqActividad");
                    $(wi.Ocultar).hide();
                    plantilla = wi.Plantilla;

                }
                else {
                    $('#TituloActividades').text("");
                    $('#ImgActividad').attr('src', "" );

                }

               

                $('#SelProyecto').empty();
                $('#SelProyecto').append(data.LstProyectos);
                $('#SelProyecto').selectpicker('refresh');

                $('#SelPrioridad').empty();
                $('#SelPrioridad').append(data.LstPrioridades);
                $('#SelPrioridad').selectpicker('refresh');


                $('#SelPrioridadAR').empty();
                $('#SelPrioridadAR').append(data.LstPrioridades);
                $('#SelPrioridadAR').selectpicker('refresh');

                $('#SelActividad').empty();
                $('#SelActividad').append(data.LstTipoAct);
                $('#SelActividad').selectpicker('refresh');

                $('#SelUsuarioAsignado').empty();
                $('#SelUsuarioAsignado').append(data.LstUsuarios);
                $('#SelUsuarioAsignado').selectpicker('refresh');

                $('#SelUsuarioAsignadoAR').empty();
                $('#SelUsuarioAsignadoAR').append(data.LstUsuarios);
                $('#SelUsuarioAsignadoAR').selectpicker('refresh');


                $('#SelResponsable').empty();
                $('#SelResponsable').append(data.LstUsuarios);
                $('#SelResponsable').selectpicker('refresh');

                $('#SelResponsableAR').empty();
                $('#SelResponsableAR').append(data.LstUsuarios);
                $('#SelResponsableAR').selectpicker('refresh');

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


                $('#SelActividadAR').empty();
                $('#SelActividadAR').append(data.LstTipoAct);
                $('#SelActividadAR').selectpicker('refresh');

                $('#SelClasificacionAR').empty();
                $('#SelClasificacionAR').append(data.LstClasificacion);
                $('#SelClasificacionAR').selectpicker('refresh');


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

async function InicializaEdicionActividad(Copy = false) {
    var Actividad = $("#IdActividad").val().trim();
    $('#divHorasUtil').show();
    $('#divFechaFin').show();
    await CargaCombosAct();
    InicializaControles();



    if (TipoUsuario == 19) {

        $(".rwclient").hide();

        $(".rwclients").attr("disabled", "true");

        //$("#mdCont").addClass("col-md-9");
        //$("#mdCont").removeClass("col-md-7");

    }
    else {

        $(".rwdetails").show();
    }


    ConsultaActividad(Actividad, false, Copy);






    $("#BtnAgregarComentario").show();
  
/*    dropxon.removeAllFiles(true);*/
    $('div .dz-preview').each(function () {
        $(this).remove();
    });




}

async function ConsultaLinks() {
    const data = await POST('/actividades/LeerCommits', { idActividad: $("#IdActividad").val() });

    const html = data.Links.map((l, i) =>
        `<div style="position: relative;">
                <div class="autogenerado comentario-container-repo ${i === 0 ? "first" : ""}">
                    <div class="first">
                        <div class="center-cropper">
                            <div class="comentarios" style="height: 24px !important">

                                <img  style="height:18px; width:18px;"   src="/Content/Project/Imagenes/commit.png" alt="Commit">
                            </div>
                        </div>
                    </div>
                    <div class="second">
                        <label class="btn btn-default">${l.TipoLink}</label> <small>${moment(l.FechaCreo).format("DD-MM-YYYY")}</small>
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
async function ConsultaActividadRelaciones() {
    const data = await POST('/actividades/ConsultaActividadRelaciones', { idActividad: $("#IdActividad").val() });

    const html = data.Activitys.map((l, i) =>
        `<div style="position: relative;">
                <div class="autogenerado comentario-container-repo ${i === 0 ? "first" : ""}">
                    <div class="first">
                        <div class="center-cropper">
                            <div class="comentarios" style="height: 24px !important" title="${l.TipoNombre}"">

                                <img  style="height:18px; width:18px;"   src="/Content/Project/Imagenes/${l.TipoUrl}" alt="${l.TipoNombre}">
                            </div>
                        </div>
                    </div>
                    <div class="second">
                         <a target="_blank" href="/Share/s/${l.IdActividad}">${l.IdActividadStr}</a>
                    </div>
                </div>
                <div style="padding: 0px 10px">
                    <p>${l.BR.replaceAll('\n', '<br />') ?? ''}</p>
                </div>
                <button style="margin-bottom: -12px" class="btnTooltip abajo fa fa-trash btnEliminarActividadRelacion" data-id="${l.IdActividadRef}" ></button>
            </div>`
    ).join('');

    $('.divMensajes.div-parents-repo').empty().html(html);
}


async function ConsultaActividadAttachments() {
    const data = await POST('/actividades/ConsultaActividadArchivos', { idActividad: $("#IdActividad").val() });

    const html = data.files.map((l, i) =>
        `<div style="position: relative;">
                <div class="autogenerado comentario-container-repo ${i === 0 ? "first" : ""}">
                    <div class="first">
                        <div class="center-cropper">
                            <div class="comentarios" style="height: 24px !important" >

                                <img  style="height:18px; width:18px;"   src="${l.Tipo}" >
                            </div>
                        </div>
                    </div>
                    <div class="second" style:"padding-bottom:10px;">
                         <a  src="${l.Url}" target="_blank"    href="${l.Url}">${l.Nombre}</a>  
                    </div>
                </div>
          
               <button style="padding-top:10px" class="btnTooltip abajo fa fa-trash btnEliminarActividadAttachment" data-id="${l.IdActividadArchivo}" ></button>
            </div>`
    ).join('');

    $('.divMensajes.div-attachments-repo').empty().html(html);
}

async function ConsultaActividadRelacionar() {
    const data = await POST('/actividades/ConsultaActividadRelacionar', { idActividad: $("#IdActividadRel").val() });

    const html = data.Activitys.map((l, i) =>
        `<div style="position: relative;">
                <div class="autogenerado comentario-container-repo ${i === 0 ? "first" : ""}">
                    <div class="first">
                        <div class="center-cropper">
                            <div class="comentarios" style="height: 24px !important" title="${l.TipoNombre}"">

                                <img  style="height:18px; width:18px;"   src="/Content/Project/Imagenes/${l.TipoUrl}" alt="${l.TipoNombre}">
                            </div>
                        </div>
                    </div>
                    <div class="second">
                         <a target="_blank" href="/Share/s/${l.IdActividad}">${l.IdActividadStr}</a>
                    </div>
                </div>
                <div style="padding: 0px 10px">
                    <p>${l.BR.replaceAll('\n', '<br />') ?? ''}</p>
                </div>
                <button style="margin-bottom: -12px" class="btnTooltip abajo" data-id="${l.IdActividadRef}" ></button>
            </div>`
    ).join('');

    $('.divMensajes.div-parents-repo').empty().html(html);
}
async function ConsultaActividadIssues() {
    const data = await POST('/actividades/ConsultaActividadIssues', { idActividad: $("#IdActividad").val() });

    const html = data.Issues.map((l, i) =>
        `<div style="position: relative;">
                <div class="autogenerado comentario-container-repo ${i === 0 ? "first" : ""}">
                    <div class="first">
                        <div class="center-cropper">
                            <div class="comentarios" style="height: 24px !important" title="Issue">

                                <img  style="height:18px; width:18px;"   src="/Content/Project/Imagenes/issue.png" alt="issue">
                            </div>
                        </div>
                    </div>
                    <div class="second">
                         <a target="_blank" onclick="Issue.Funciones.EditarIssue(${l.IdIssue});"  >${l.NoIssue}</a>
                    </div>
                </div>
                <div style="padding: 0px 10px">
                    <p>${l.Descripcion.replaceAll('\n', '<br />') ?? ''}</p>
                </div>
                <button style="margin-bottom: -12px" class="btnTooltip abajo fa fa-trash BtnEliminarIssueActividad" data-id="${l.IdActividadIssue}" ></button>
            </div>`
    ).join('');

    $('.divMensajes.div-issues-repo').empty().html(html);
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

$('#show-share-div').click(() => {
    if ($('#share-div').hasClass('hidden')) {
        $('#share-div').removeClass('hidden');
        var url = "https://" + window.location.host  + $("#urlSharedAct").val() + "/" + $('#IdActividad').val();
        $("#TxtUrlCompartir").text(url);

    }
    else
        $('#share-div').addClass('hidden')
});

$('#hide-share-div').click(() => {
    $('#share-div').addClass('hidden')
});

$('#show-parents-div').click(() => {
    if ($('#parents-div').hasClass('hidden')) {
        $('#parents-div').removeClass('hidden');
        $('#SelActividadSA').focus();

        $("#SelActividadSA").select2({
            ajax: {
                url: $('#urlBuscarActividadesOpcion2').val(),
                dataType: 'json',
                delay: 950,
                async: false,
                data: function (params) {
                    return {
                        Texto: params.term,
                        IdProyecto: $("#SelProyecto").val(),
                        IdActividad: $("#IdActividad").val()
                    };
                },
                processResults: function (data, params) {

                    var lst = JSON.parse(data.LstActividades);

                    return {
                        results: JSON.parse(data.LstActividades),
    
                    };
                },
                cache: true
            },
            formatLoadMore: "Cargando...",
            placeholder: 'Ingrese la actividad...',
            minimumInputLength: 2,
            templateResult: formatRepo2,
        });
    }
    else
        $('#parents-div').addClass('hidden')
});
function formatRepo2(repo) {
    if (repo.loading) {
        return repo.text;
    }

    var $container = "";

    $container = $("<div class='task-item task-progreess' style='cursor:pointer;'  id='" + repo.IdActividad + "'>    " +
        "<div class='task-text' >" +
        "<span><img class='img-dt' src='" + repo.AsignadoPath + "' alt='" + repo.TipoActividadStr + "' title='" + repo.TipoActividadStr + "' style='width:24px; height:24px;'></span>" +
        " <b> " + repo.IdActividadStr + "</b>" +
        "<p>" + repo.Descripcion + "</p>" +
        "<button style='' id='' class='btn btn-default pull-right'onclick='RelacionarActividad(" + repo.IdActividad + ")'>Agregar</button>" +
        "</div> </div>");


    return $container;
}

$('#hide-parents-div').click(() => {
    $('#parents-div').addClass('hidden');
});

$('#show-issues-div').click(() => {
    if ($('#issues-div').hasClass('hidden')) {
        $('#issues-div').removeClass('hidden');
    }
    else
        $('#issues-div').addClass('hidden')
});

$('#hide-issues-div').click(() => {
    $('#issues-div').addClass('hidden');
});


$('#btnshare').click(() => {

    var clipboard = new Clipboard('.btnshare');

    MensajeExito("Se ha copiado al portapapeles");
     /*   $('#share-div').addClass('hidden');*/
   
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


async function RelacionarActividad(IdActividadR) {


    const data = await POST('/Actividades/GuardarRelacionActividad', { IdActividad: $("#IdActividad").val(), IdActividadR: IdActividadR  }, false);

      if (data.Exito) {
          $('#SelActividadSA').val(null).empty().select2('destroy');
  
          $('#parents-div').addClass('hidden');
          ConsultaActividadRelaciones();
        } else {
            MensajeAdvertencia(data.Mensaje);
        }

}



async function EliminarRelacionarActividad(IdActividadR) {


    const data = await POST('/Actividades/EliminaRelacionActividad', {  IdActividadR: IdActividadR }, false);

    if (data.Exito) {
        ConsultaActividadRelaciones();
    } else {
        MensajeAdvertencia(data.Mensaje);
    }


    return false;
}




$(document).on('click', '.openFrame', e => {
    e.preventDefault();

    $('#ifrRepo').attr('src', e.target.href);
    $('#mdlRepo').modal('show');
});

//$(document).on('click', '.btnEliminarActividadRepositorio',  async e => {
 

//    $("#IdActividadDependencia").val($(e.target).data('id'));
//    MensajeConfirmarAccion("¿Desea eliminar esté commit?", "#btnEliminarRepositorio");
//    return false;
//});


$(document).on('click', '.btnEliminarActividadRepositorio', function (e) {

    $("#IdActividadDependencia").val($(e.target).data('id'));
    MensajeConfirmarAccion("¿Desea eliminar el commit?", "btnEliminarRepositorio");

    return false;

});


$(document).on('click', '#btnEliminarRepositorio',async  e => {
    e.preventDefault();


    const actividad = {
        IdActividad: $('#IdActividad').val(),
        IdActividadRepositorio: $("#IdActividadDependencia").val()
    }

    const data = await POST('/actividades/EliminarCommit', { actividad }, false);

    if (data.Exito) {
        MensajeExito(data.Mensaje);
        ConsultaLinks();
        $('#repo-div').addClass('hidden')
    } else {
        MensajeAdvertencia(data.Mensaje);
    }

    return false;
});


$(document).on('click', '.btnEliminarActividadRelacion', async e => {
    e.preventDefault();

    $("#IdActividadDependencia").val($(e.target).data('id'));
    MensajeConfirmarAccion("¿Desea eliminar esta actividad?", "btnEliminarActividadRelacion");

    return false;

});

$(document).on('click', '.btnEliminarActividadAttachment', async e => {
    e.preventDefault();

    $("#IdActividadAttachment").val($(e.target).data('id'));
    MensajeConfirmarAccion("¿Desea eliminar este adjunto?", "btnEliminarActividadAttachment");

    return false;

});


$(document).on('click', '#btnEliminarActividadRelacion', async e => {
    e.preventDefault();


    var IdActividadR = $("#IdActividadDependencia").val();


    const data = await POST('/actividades/EliminaRelacionActividad', { IdActividadR: IdActividadR }, false);

    if (data.Exito) {
        MensajeExito("Se eliminó la relación");
        ConsultaActividadRelaciones();

    } else {
        MensajeAdvertencia(data.Mensaje);
    }
});






$(document).on('click', '#btnEliminarActividadAttachment', async e => {
    e.preventDefault();


    var Id = $("#IdActividadAttachment").val();


    const data = await POST('/actividades/EliminarAttachmentActividad', { Id: Id }, false);

    if (data.Exito) {
        MensajeExito("Se eliminó el adjunto");
        ConsultaActividadAttachments();

    } else {
        MensajeAdvertencia(data.Mensaje);
    }
});



$(document).on("click", "#add-attachments", function () {
    $("#ActividadAttachment").click();

    return false;
});



$(document).on("change", "#ActividadAttachment", function (e) {
    var file = $("#ActividadAttachment").val();
    if (file == "") {

        console.log("not file found");
        //$("#iImagenDefault").removeClass("hide");
        //$("#imgFoto").addClass("hide");
    }
    else {
        if (e.target.files != undefined) {

            var reader = new FileReader();

            reader.onload = function (f) {
                //archivoFoto = f.target.result;
                //$("#FotoUsuario").attr("src", archivoFoto);
                //$("#imgFoto").removeClass("hide");
                //$("#iImagenDefault").addClass("hide");
            };
            reader.readAsDataURL(e.target.files.item(0));

            AddAttachment();
         /*   nombreFoto = e.target.files.item(0).nam*/e;
        }
    }
});


function AddAttachment() {

    var url = $('#urlGuardaArchivoV2').val();

    var form_data = new FormData();

    form_data.append("IdActividad", $("#IdActividad").val());
    form_data.append("file", $("#ActividadAttachment").prop("files")[0]);



    $.ajax({
        url: url,
        type: "POST",
        contentType: false,
        data: form_data,
        processData: false,
        async: false,
        success: function (Respuesta) {
            if (Respuesta == "1") {

                ConsultaActividadAttachments();
                /*  LimpiarCamposUsuario();*/

           /*     MensajeExito("Los actualizo su fotografia.");*/
                //$('#ModalEditarUsuario').modal('toggle');
                //$('div.pg-loading-screen').remove();

                //setTimeout(function () {
                //    location.reload();
                //}, 1500);

                //CargaInicial();

            }
            else if (Respuesta == "00") {
                MensajeError("Tipo de archivo no permitido");

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



function InicializaRetrabajoActividad(IdActividad, Estatus) {

    if (Estatus != "L") {

        MensajeAdvertencia("Sólo se puede solicitar retrabajo de actividades con estatus 'Liberado'.");
        return false;
    }

    $('#IdActividad').val(0);
    $("#IdActividadRef").val().trim(IdActividad);

    //$('#ModalActividades').on('hidden.bs.modal', function () {
    //    CargaActividades();
    //});

    $('#ModalActividades').modal({ keyboard: false });

    $('#divHorasUtil').hide();
    $('#divFechaFin').hide();
/*    $('#BtnList').addClass('hide');*/
    InicializaControles();
    ConsultaActividad(IdActividad, true);
    return false;

}


async function ConsultaActividad(Actividad, Retrabajo, Copy= false) {

    var url = $('#urlConsultaActividad').val();

    const data = await POST(url, { Actividad: Actividad });



    if (data.Exito) {

        var wi = jQuery.parseJSON(data.WorkItem);

        var datosAct = jQuery.parseJSON(data.Actividad);
        $('#TituloActividadWI').text(wi.Nombre );
        $('#TituloActividades').text(datosAct.IdActividadStr);
        $('#ImgActividad').attr('src', "/Content/Project/Imagenes/" + wi.Url);
        $('#IdTipoActividad').val(wi.ActividadTipoId)

        $(wi.NoRequeridos).removeClass("ReqActividad");
        $(wi.Ver).show();
        $(wi.Requeridos).addClass("ReqActividad");
        $(wi.Ocultar).hide();

        if (TipoUsuario == 19) {

            $(".rwclient").hide();

            $(".rwclients").attr("disabled", "true");

            //$("#mdCont").addClass("col-md-9");
            //$("#mdCont").removeClass("col-md-7");

        }
        else {

            $(".rwdetails").show();
        }




       
        $('#SelActividades').empty();
        $('#SelActividades').append(data.LstActividades);
        $('#SelActividades').selectpicker('refresh');

   

        if (datosAct.TipoActividadId === 195) {
            EsBug = true;
         /*   $('#divActividadRef').removeClass('hidden');*/
      /*      $('#SelActividadRef').addClass('ReqActividad');*/
        } else {
            EsBug = false;
           /* $('#divActividadRef').addClass('hidden');*/
         /*   $('#SelActividadRef').removeClass('ReqActividad');*/
        }


        $("#lblIdUMod").text(datosAct.IdUModStr);
        $('#lblFechaMod').text(moment(datosAct.FechaMod).format("DD/MM/YYYY"));

        $("#IdActividad").val(datosAct.IdActividad);
        $("#IdOAct").val(data.Org);
        $("#ActPSP").val(datosAct.PSP);


        $('#SelUsuarioAsignado').empty();
        $('#SelUsuarioAsignado').append(data.LstUsuarios);
        $('#SelUsuarioAsignado').selectpicker('refresh');


        $('#SelUsuarioAsignadoAR').empty();
        $('#SelUsuarioAsignadoAR').append(data.LstUsuarios);
        $('#SelUsuarioAsignadoAR').selectpicker('refresh');

        $('#SelResponsable').empty();
        $('#SelResponsable').append(data.LstUsuarios);
        $('#SelResponsable').selectpicker('refresh');


        $('#SelResponsableAR').empty();
        $('#SelResponsableAR').append(data.LstUsuarios);
        $('#SelResponsableAR').selectpicker('refresh');

        if (EsMejora && EsMejora !== undefined) {
            $('#SelProyecto').prop('disabled', true);
        }

        $('#SelProyecto').val(datosAct.IdProyecto);
        $('#SelProyecto').selectpicker('refresh');


        $('#SelPrioridad').val(datosAct.PrioridadId);
        $('#SelPrioridad').selectpicker('refresh');


        if (EsBug !== undefined && EsBug) {
            $('#SelActividad').prop('disabled', true);
            /*await CargaActividadesQA();*/
        }

        $('#SelActividad').val(datosAct.TipoActividadId);
        $('#SelActividad').selectpicker('refresh');
        await CargaClasificaciones();
        //if (EsBug !== undefined && EsBug) {
        //    $('#SelActividadRef').val(datosAct.IdActividadRef)
        //}
        $('#SelClasificacion').val(datosAct.ClasificacionId);
        //if (Retrabajo) {
        //    $('#TxtDescripcion').val("RETRABAJO: " + datosAct.Descripcion);
        //}
        //else {
        //    $('#TxtDescripcion').val(datosAct.Descripcion);
        //}


     /*   $('#TxtDescripcion').code(datosAct.Descripcion);*/
        $('#LblDescripcion').empty();
     /*   $('#LblDescripcion').append(datosAct.Descripcion);*/
   //     edit.startContent(datosAct.Descripcion);
   ///*     $('#editor').append(datosAct.Descripcion);*/

      



        $('#TxtCriterioA').code(datosAct.CriterioAceptacion);
        $('#LblCriterioA').empty();
        $('#LblCriterioA').append(datosAct.CriterioAceptacion);


        if (TipoUsuario != 19) {

            $('#btnEditarActDesc').show();
            $("#show-share-div").show();

        }
    

     /*   $('#btnEditarActDesc').show();*/
        $('.note-editor').hide();

        //$('.note-editor').hide();
        $('#LblDescripcion').show();
        $('#TxtDescripcion').addClass("hide");

      

        $('#btnEditarCA').show();
        $('#LblCriterioA').show();


        $('#TxtBR').val(datosAct.BR);
        var idemoji = $(TxtBR).attr('data-id'); 
        $("div[data-id='" + idemoji + "'][data-type='input']").text(datosAct.BR);

        $('#TxtTiempoEjecucion').val(datosAct.TiempoEjecucion);
        $('#TxtPuntosHistoria').val(datosAct.Puntos);
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

        
        ActividadPeerReview.Funciones.Init(datosAct.IdActividad, datosAct.IdListaRevision, datosAct.IdActividadRef);

        if (datosAct.DocumentoRef == "" || datosAct.DocumentoRef == null) {
            $('#divVerArchivo').hide();
        }
        $('#UrlArchivo').val(datosAct.DocumentoRef);

        $('#TxtHorasFinal').text(datosAct.HorasFinales);

        if (datosAct.FechaTermino != null) {
            $('#TxtFechaFin').val(moment(datosAct.FechaTermino).format("DD/MM/YYYY"));
        }



        if (datosAct.Estatus !== "A" && datosAct.Estatus !== "P" && datosAct.Estatus !== "X" && datosAct.Estatus !== "R" && datosAct.Estatus !== "V")  {

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
       
        $('#SelTipoTask').selectpicker('refresh');
        /*$('#SelActividadRef').selectpicker('refresh');*/
        $('#SelClasificacion').selectpicker('refresh');
        $('#SelUsuarioAsignado').selectpicker('refresh');
        $('#SelResponsable').selectpicker('refresh');

        $('#SelSprintA').empty();
        $('#SelSprintA').append(data.LstSprints);
        $('#SelSprintA').val(datosAct.IdIteracion);
        $('#SelSprintA').selectpicker('refresh');


        $('#SelSprintAR').empty();
        $('#SelSprintAR').append(data.LstSprints);
        $('#SelSprintAR').selectpicker('refresh');

        cambiaEstadoSwitch($('#ChkRetrabajo'), datosAct.Retrabajo);
        cambiaEstadoSwitch($('#ChkCritico'), datosAct.Critico);
        $("#spEstatusC").removeClass("text-info text-progress text-warning text-success text-danger text-muted");


        if (datosAct.Estatus == "A") {
            $("#spEstatusC").addClass("text-info");
            $("#BtnEstatus").text("Abierto");
            //$("#BtnActualizaAbierto").hide();
            //$("#BtnActualizaProgreso").hide();
        }
        if (datosAct.Estatus == "P") {
            $("#spEstatusC").addClass("text-progress");
            $("#BtnEstatus").text("En progreso");

            //$("#BtnActualizaAbierto").show();
            //$("#BtnActualizaProgreso").hide();
        }
        if (datosAct.Estatus == "R") {
            $("#spEstatusC").addClass("text-warning");
            $("#BtnEstatus").text("Revisión");
            //$("#BtnActualizaAbierto").show();
            //$("#BtnActualizaProgreso").show()

        }
        if (datosAct.Estatus == "V") {
            $("#spEstatusC").addClass("text-warning");
            $("#BtnEstatus").text("Validación");
            //$("#BtnActualizaAbierto").show();
            //$("#BtnActualizaProgreso").show()

        }

        if (datosAct.Estatus == "L") {
            $("#spEstatusC").addClass("text-success");
            $("#BtnEstatus").text("Liberada");
            //$("#BtnActualizaAbierto").show();
            //$("#BtnActualizaProgreso").show()

        }
        if (datosAct.Estatus == "C") {
            $("#spEstatusC").addClass("text-muted");
            $("#BtnEstatus").text("Cancelada");
            //$("#BtnActualizaAbierto").show();
            //$("#BtnActualizaProgreso").show()

        }
        if (datosAct.Estatus == "X") {
            $("#spEstatusC").addClass("text-danger");
            $("#BtnEstatus").text("Rechazada");
            //$("#BtnActualizaAbierto").show();
            //$("#BtnActualizaProgreso").show()

        }
        $("#ActPSP").val(datosAct.PSP);

        $('#div-repositorio').removeClass('hidden');
        $('#show-parents-div').show();
        $('#add-attachments').show();
        $('#show-repo-div').show();
        $('#show-issues-div').show();
        ConsultaActividadRelaciones();
        ConsultaActividadIssues();
        ConsultaLinks();
        ConsultaActividadAttachments();
       


        //$("#lblActComentarios").text(datosAct.TotalComentarios);
        $("#lblActArchivos").text(datosAct.TotalArchivos);
        $("#lblActDependencias").text(datosAct.TotalDependencias);
        $("#lblActLog").text(datosAct.TotalTiempos);
        $("#lblLog").text(datosAct.TotalLog);
        $("#lblVal").text(datosAct.TotalValidaciones);
        $("#lblIssues").text(datosAct.TotalIssues);

        $("#UlComentarios").empty();
        $("#UlComentarios").append(data.LstComentarios);

        $("#UlLog").empty();
        $("#UlLog").append(data.LstLog);


        //PONGO LOS ARCHIVOS
        //for (var i in datosAct.Archivos) {

        //    var url = datosAct.Archivos[i].Url;
        //    var mockFile = { name: datosAct.Archivos[i].Nombre };
        //    dropxon.options.addedfile.call(dropxon, mockFile);
        //    dropxon.options.thumbnail.call(dropxon, mockFile, url);

        //}

        tablaTrabajosAct = inicializaTabla($('#TblLogTrabajo'), datosAct.Trabajos, columnasTrabajosAct, 0, "asc", false, false, false);

        //dsDependenciasAct = datosAct.Dependencias;
        //tablaDependenciasAct = inicializaTabla($('#TblActDependencias'), datosAct.Dependencias, columnasDependencias, 0, "asc", false, false, false);


        //dsValidacionesAct = datosAct.Validaciones;
        //tablaValidacionAct = inicializaTabla($('#TblValidacionesAct'), dsValidacionesAct, columnasValidacionAct, 0, "asc", false, false, false);
        $('div.pg-loading-screen').remove();

        $('#SelRepositorio').empty().append(data.LstRepositorios);


        $('#SelIssues').empty();
        $('#SelIssues').append(data.LstIssues);
        $('#SelIssues').selectpicker('refresh');

        onEdit = 0;
        /*   tinymce.get("TxtDescripcion").show();*/
    
        tinymce.get("TxtDescripcion").setContent(datosAct.Descripcion);
        tinymce.get("TxtDescripcion").mode.set('readonly');
        //tinymce.activeEditor.mode.setContent(datosAct.Descripcion);
        //tinymce.activeEditor.mode.set("readonly");
   /*     tinymce.get("TxtDescripcion").hide();*/



        if (datosAct.IdCicloCaso > 0) {

            $("#BtnEjecutarTCActivity").show();
        }
        else {
            $("#BtnEjecutarTCActivity").hide();
        }

        $("#IdCicloCasoActivity").val(datosAct.IdCicloCaso);

        if (Copy) {

            InicializaCopiaActividad();
        }


    }
    else {

        MensajeAdvertencia(data.Mensaje);

    }

}


function ConfirmaLiberaActividad() {

    MensajeConfirmarAccion("¿Esta seguro que desea realizar la aprobación? <br/> <b>Al autorizar se contempla que : </b><br/> <br/>" +
        "<li> La definición es la correcta</li>" +
        "<li> Cubre todos los casos dentro de su proceso</li>" +
        "<li> El diseño (si aplica) es el aprobado </li> <br/>" +
        "<b>Autorizó que la información compartida es correcta y se autoriza el desarrollo de este componente</b>"
        , "BtnConfirmaCambioEstatus");

}

$(document).on('click', '#BtnConfirmaCambioEstatus', function (e) {
    ActualizaEstatusAct("L");
});


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
                MensajeExito("Se actualizó el estatus correctamente");

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

$(document).on('click', '#btnEditarActDesc', function (e) {
    onEdit = 1;
    $('.note-editor').show();
    $('#LblDescripcion').hide();
    $('#LblCriterioA').hide();
    //$('#TxtDescripcion').removeClass("hide");


    tinymce.get("TxtDescripcion").mode.set('design');
  /*  var txt = $('#LblDescripcion').text();*/
  
   /* tinymce.get("TxtDescripcion").show();*/
/*    tinymce.get("TxtDescripcion").setContent(txt);*/

    $('#btnEditarActDesc').hide();
});


//$(document).on('click', '#btnEditarCA', function (e) {
//    onEdit = 1;
//    $('TxtCriterioA .note-editor').show();
//    $('#LblCriterioA').hide();
//    $('#btnEditarCA').hide();
//});


$(document).on('click', '#btnCerrarAct', function (e) {

    if (onEdit == 1) {
        MensajeConfirmarAccionV2("Se han realizado cambios. ¿Qué desea hacer?", "BtnCerrarActConfirma", "BtnGuardarActividad");

    }
    else {

        $('#ModalActividades').modal('hide');
    }
   
    return false;
});
$(document).on('click', '#BtnCerrarActConfirma', function (e) {


    $('#ModalActividades').modal('hide');

    return false;
});


$(document).on('click', '#BtnGuardarActividad', function (e) {

    var Mensaje = ValidaCamposRequeridos(".ReqActividad");
    //var prioridad = $('input:radio[name=RdoPrioridad]:checked').val();
    //var planificada = $('input:radio[name=RdoPlaneada]:checked').val();
    var nombredoc = $("#FlArchivo").parent().next().text();

    if (Mensaje.length == 0 ) {

        var url = $('#urlGuardarActividad').val();
        //var archivo = $("#FlArchivo").prop("files")[0];

        var fechaIni = ObtieneFecha($('#TxtFechaInicio').val().trim());
        var fechaSol = ObtieneFecha($('#TxtFechaPlan').val().trim());
        var fechaC = ObtieneFecha($('#TxtFechaFin').val().trim());



        Actividad = {
            IdActividad: $("#IdActividad").val().trim(),
            IdUsuarioAsignado: $("#SelUsuarioAsignado").val(),
      /*      Descripcion: $("#TxtDescripcion").code(),*/
            Descripcion: tinymce.get("TxtDescripcion").getContent(),
            CriterioAceptacion: $("#TxtCriterioA").code(),
            BR: $("#TxtBR").val().trim(),
            //DocumentoRef: $("#FlArchivo").parent().next().text(),
            TiempoEjecucion: $("#TxtTiempoEjecucion").val(),
            Puntos: $("#TxtPuntosHistoria").val(),
            HorasFacturables: $("#TxtHorasFacturables").val(),
            HorasAsignadas: $("#TxtHorasAsignadas").val(),
            IdProyecto: $("#SelProyecto").val(),
            IdIteracion: $("#SelSprintA").val(),
            TipoActividadId: $("#SelActividad").val(),
            ClasificacionId: $("#SelClasificacion").val(),
            IdUsuarioResponsable: $("#SelResponsable").val(),
            Planificada: 1,
            PrioridadId: $('#SelPrioridad').val(),
            FechaInicio: fechaIni,
            FechaSolicitado: fechaSol,
            HorasFinales: $("#TxtHorasFinal").text(),
            Retrabajo: $('#ChkRetrabajo').prop('checked'),
            Critico: $('#ChkCritico').prop('checked'),
            FechaTermino: fechaC,
         /*   IdActividadRef: $("#SelActividadRef").val() !== '-1' && $("#SelActividadRef").val() != null ? $("#SelActividadRef").val() : $("#SelActividadRefPeer").val(),*/
            IdListaRevision: $('#selPeerReview').val(),
            TipoId: $('#IdTipoActividad').val(),
            IdActividadR1: $('#IdActividadRel').val(),
         
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
               /*     $('#ModalActividades').modal('hide');*/
                    MensajeExito(data.Mensaje);
                    ActividadCreada.id = data.IdActividad;


                    $('#IdActividad').val(data.IdActividad);
                    InicializaControles();
                    ConsultaActividad(data.IdActividad, false);
                    $(".rwdetails").show();
                    $("#BtnAgregarComentario").show();
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
                MensajeExito("La actividad se canceló con éxito");

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
    ConsultaActividad(IdActividad, false);
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
        $(this).off('hidden.bs.modal');
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



function RechazoActividadDet() {

    InicializaModalRechazar();
    var IdActividad = $("#IdActividad").val();
    $('#ActividadR').val($("#IdActividad").val());



    $('#TituloRec').text("Rechazar actividad #" + IdActividad);


    $('#ModalRechazarActividad').on('hidden.bs.modal', function () {
        ConsultaActividad(IdActividad, false);
        $(this).off('hidden.bs.modal');
    });

    $('#ModalRechazarActividad').modal({ keyboard: false });


    return false;

}



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


    /*    $('#divActividadRef').removeClass('hidden');*/
     /*   $('#SelActividadRef').addClass('ReqActividad');*/
        $('#TxtHorasFacturables').val(0).prop('disabled', true);
        $('#TxtHorasAsignadas').val(0).prop('disabled', true);
        $('#TxtFechaInicio').val(moment(fecha).format("DD/MM/YYYY"));
        $('#TxtFechaPlan').val(moment(fecha).format("DD/MM/YYYY"));
        $('#ChkRetrabajo').prop('checked', true).prop('disabled', true);
        $('#RdoNoPlaneada2').prop('checked', true).prop('disabled', true);
        $('#RdoAlta2').prop('checked', true).prop('disabled', true);
    } else {
       /* $('#divActividadRef').addClass('hidden');*/
      /*  $('#SelActividadRef').removeClass('ReqActividad');*/
        $('#TxtHorasFacturables').prop('disabled', false);
        $('#TxtHorasAsignadas').prop('disabled', false);
        //$('#TxtFechaInicio').prop('disabled', false);
        //$('#TxtFechaPlan').prop('disabled', false);
        $('#ChkRetrabajo').prop('disabled', false);
        $('#RdoNoPlaneada2').prop('disabled', false);
        $('#RdoAlta2').prop('disabled', false);
    }

    return false;

});

$(document).on('change', '#SelActividadAR', function (e) {

    CargaClasificacionAR();

    return false;

});




async function CargaClasificaciones() {
    await CargaClasificacion();

    if ($('#SelActividad').val() === '195') {
        var date = new Date(), y = date.getFullYear(), m = date.getMonth(), d = date.getDate();
        var fecha = new Date(y, m, d);


        $('#TxtHorasFacturables').val(0).prop('disabled', true);
        $('#TxtHorasAsignadas').val(0).prop('disabled', true);
        $('#TxtFechaInicio').val(moment(fecha).format("DD/MM/YYYY"));
        $('#TxtFechaPlan').val(moment(fecha).format("DD/MM/YYYY"));
        $('#ChkRetrabajo').prop('checked', true).prop('disabled', true);
        $('#RdoNoPlaneada2').prop('checked', true).prop('disabled', true);
        $('#RdoAlta2').prop('checked', true).prop('disabled', true);
    } else {

        $('#TxtHorasFacturables').prop('disabled', false);
        $('#TxtHorasAsignadas').prop('disabled', false);
        //$('#TxtFechaInicio').prop('disabled', false);
        //$('#TxtFechaPlan').prop('disabled', false);
        $('#ChkRetrabajo').prop('disabled', false);
        $('#RdoNoPlaneada2').prop('disabled', false);
        $('#RdoAlta2').prop('disabled', false);
    }

    return false;
}

async function CargaClasificacion() {


    //var url = $('#urlCargarClasificacion').val();
    var IdTipoActividad = $("#SelActividad").val();

    const data = await POST('/Actividades/CargarClasificacionActividadCombo', { IdTipoActividad: IdTipoActividad });


    if (data.Exito) {
        $('#SelClasificacion').empty();
        $('#SelClasificacion').append(data.LstClasificacion);
        $('#SelClasificacion').selectpicker('refresh');
    }
    else {

        MensajeAdvertencia(data.Mensaje);
    }


    //return $.ajax({
    //    url: url,
    //    data: JSON.stringify({ IdTipoActividad: IdTipoActividad }),
    //    type: "POST",
    //    contentType: "application/json; charset=utf-8",
    //    dataType: "json",
    //    async: true,
    //    success: function (data) {

    //        if (data.Exito) {
    //            $('#SelClasificacion').empty();
    //            $('#SelClasificacion').append(data.LstClasificacion);
    //            $('#SelClasificacion').selectpicker('refresh');
    //        }
    //        else {

    //            MensajeAdvertencia(data.Mensaje);
    //        }
    //    },
    //    complete: FinalizaLoading,
    //    error: function (xmlHttpRequest, textStatus, errorThrown) {

    //        MensajeError("Ocurrió un error inesperado, por favor vuelva a intentar.");
    //    }
    //});

}

async function CargaClasificacionAR() {


    //var url = $('#urlCargarClasificacion').val();
    var IdTipoActividad = $("#SelActividadAR").val();

    const data = await POST('/Actividades/CargarClasificacionActividadCombo', { IdTipoActividad: IdTipoActividad });


    if (data.Exito) {
        $('#SelClasificacionAR').empty();
        $('#SelClasificacionAR').append(data.LstClasificacion);
        $('#SelClasificacionAR').selectpicker('refresh');
    }
    else {

        MensajeAdvertencia(data.Mensaje);
    }


    //return $.ajax({
    //    url: url,
    //    data: JSON.stringify({ IdTipoActividad: IdTipoActividad }),
    //    type: "POST",
    //    contentType: "application/json; charset=utf-8",
    //    dataType: "json",
    //    async: true,
    //    success: function (data) {

    //        if (data.Exito) {
    //            $('#SelClasificacion').empty();
    //            $('#SelClasificacion').append(data.LstClasificacion);
    //            $('#SelClasificacion').selectpicker('refresh');
    //        }
    //        else {

    //            MensajeAdvertencia(data.Mensaje);
    //        }
    //    },
    //    complete: FinalizaLoading,
    //    error: function (xmlHttpRequest, textStatus, errorThrown) {

    //        MensajeError("Ocurrió un error inesperado, por favor vuelva a intentar.");
    //    }
    //});

}

$(document).on('change', '#SelProyecto', function (e) {

    CargaRecursosProyecto();


    if ($('#SelActividad').val() === '195') {
        EsBug = true;
    } else {
        EsBug = false;
    }



    return false;

});


$(document).on('change', '#SelActividad', function (e) {



    if ($('#SelActividad').val() === '195') {
        EsBug = true;
    } else {
        EsBug = false;
    }



    return false;

});

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


                $('#SelUsuarioAsignadoAR').empty();
                $('#SelUsuarioAsignadoAR').append(data.LstUsuarios);
                $('#SelUsuarioAsignadoAR').selectpicker('refresh');


                $('#SelResponsable').empty();
                $('#SelResponsable').append(data.LstUsuarios);
                $('#SelResponsable').selectpicker('refresh');


                $('#SelResponsableAR').empty();
                $('#SelResponsableAR').append(data.LstUsuarios);
                $('#SelResponsableAR').selectpicker('refresh');

                $('#SelSprintA').empty();
                $('#SelSprintA').append(data.LstSprints);
                $('#SelSprintA').selectpicker('refresh');


                $('#SelSprintAR').empty();
                $('#SelSprintAR').append(data.LstSprints);
                $('#SelSprintAR').selectpicker('refresh');

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

//$('#SelTipoTask').change(e => {
//    if ($(e.target).find('option:selected').text() === "Milestone") {
//        $('#SelUsuarioAsignado').val(IdUsuarioLider);
//        $('#SelUsuarioAsignado').selectpicker('refresh');
//        $('#SelResponsable').val(IdUsuarioLider);
//        $('#SelResponsable').selectpicker('refresh');
//    }
//});


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

                    ConsultaActividadIssues();
                    $('#issues-div').addClass('hidden');

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

    $("#IdActividadIssue").val($(e.target).data('id'));
    MensajeConfirmarAccion("¿Desea eliminar el issue?", "BtnEliminaActividadIssue");

    return false;

});


$(document).on('click', '.btnEditarIssueAct', function (e) {

    var filaPadre = $(this).closest('tr');
    var row = tablaIssuesAct.api().row(filaPadre);
    var datosFila = row.data();

    Issue.Funciones.EditarIssue(datosFila.IdIssue);
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
                ConsultaActividadIssues();
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


const ActividadPeerReview = {
    Controles: {
        dtControles: $('#TblPeerReview'),
        chkPeerReview: $('#chkPeerReview'),
        selPeerReview: $('#selPeerReview'),
 /*       selActividadRefPeer: $('#SelActividadRefPeer'),*/
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
                "render": function (data, type, row) {
                   
                    if (data) {
                        return 'Ok'
                      

                    }
                    else {
                        return `<button class="btn btn-grid " onclick="ActividadPeerReview.Funciones.ElementoRevisadoLR(${row.IdActividadListaRevision} )";   > <i style="font-size: 20px; color: 'gray'" class= "fa fa-check"><i/> </button>`
                      
                    }
                }


                    //(data, _, _row, x) => `<i style="font-size: 20px; color: ${data === null ? '' : data ? 'darkgreen' : 'darkred'};" class="${data === null ? 'fa fa-minus' : data ? 'fa fa-check' : 'fa fa-times'}"></i><button style="right:5px;" id=${x.row} class="btnTooltip fa fa-ellipsis-v" data-placement="left" data-toggle="tooltip" data-html="true" title='${ActividadPeerReview.Funciones.LeerTooltip()}'></button>`
            },
            //{
            //    "render": (_data, _, row) =>
            //        `<div style="display: flex; align-items: center;">
            //            <div style="width: 50%; text-align: right; padding-right: 10px;">
            //                <label style="margin-bottom: 0px !important">${row.TotalHallazgos}</label>
            //            </div>
            //            <a class="modulo-revision btnLeerHallazgos" href="#"><i style="font-size: 25px; color: #08C127; cursor: pointer;" class="fa fa-plus-circle"></i></a>
            //        </div>
            //        ${row.TotalHallazgos > 0 ?
            //            `<div style="display: flex; justify-content: center;">
            //                <span class="label label-success" style="font-size: 10px;">${row.HallazgosCorregidos}</span>
            //                <span class="label label-danger" style="font-size: 10px;">${row.HallazgosNoCorregidos}</span>
            //            </div>` :
            //            ''}`
            //}
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
        urlLeerListasRevision: $('#LeerListaRevisionPorProyecto').val(),
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
        ElementoRevisadoLR: (IdActividadListaRevision) => {
         

            try {
                const data =  POST("/ListaRevision/ActualizarListaRevisionActividad/", {
                    idListaRevision: IdActividadListaRevision,
                }, false);

              /*  if (data.Exito) {*/
                    ActividadPeerReview.Funciones.LeerControles(ActividadPeerReview.Variables.idActividad, ActividadPeerReview.Variables.idListaRevision);
                //} else {
                //    MensajeAdvertencia(data.Mensaje);
                /*}*/
            } catch (e) {
                MensajeError(e.textStatus);
            }

            //$('#ModalActividades').modal('show');
            //ActividadPeerReview.Controles.mdlHallazgos.modal('hide');
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
                if ($('#SelProyecto').val() === '-1' ) {
                    MensajeAdvertencia('Debe seleccionar el proyecto para habilitar esta opción.');
                    ActividadPeerReview.Controles.chkPeerReview.prop('checked', false);
                    return;
                }

                ActividadPeerReview.Funciones.InicializaTabla();
                ActividadPeerReview.Controles.selPeerReview.val('-1');
                ActividadPeerReview.Controles.selPeerReview.selectpicker('refresh');
                //ActividadPeerReview.Controles.selActividadRefPeer.val('-1');
                //ActividadPeerReview.Controles.selActividadRefPeer.selectpicker('refresh');
                $('.tab-actividad-peer').removeClass('hidden');
                $('#tab-actividad-peer').removeClass('hidden');
                $('#divTxtDescripcion').hide();

                ActividadPeerReview.Funciones.LeerListaRevision($('#SelProyecto').val(), $('#SelActividad').val(), $('#SelClasificacion').val());
              /*  ActividadPeerReview.Funciones.LeerActividades($('#SelProyecto').val(), $('#SelActividad').val(), $('#SelClasificacion').val());*/
            } else {
                ActividadPeerReview.Controles.divPeerReview.addClass('hidden');
                ActividadPeerReview.Controles.selPeerReview.removeClass('ReqActividad');
/*                ActividadPeerReview.Controles.selActividadRefPeer.removeClass('ReqActividad');*/
                $('.tab-actividad-peer').addClass('hidden');
                $('#tab-actividad-peer').addClass('hidden');
                $('#divTxtDescripcion').show();
               
           
                ActividadPeerReview.Controles.selPeerReview.empty().append('<option value="-1">--Seleccionar--</option>');
                /*ActividadPeerReview.Controles.selActividadRefPeer.empty().append('<option value="-1">--Seleccionar--</option>');*/
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
                    //ActividadPeerReview.Controles.selActividadRefPeer.empty().append(data.CmbListas);
                    //ActividadPeerReview.Controles.selActividadRefPeer.selectpicker('refresh');
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
                    //CatalogoFaseId: idFase,
                    //CatalogoClasificacionId: idClasificacion,
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
                "ordering": false,
                columnas: ActividadPeerReview.Constantes.colControles,
                incluyeBusqueda: false,
                nonOrderableColumns: [0],
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
                    ActividadPeerReview.Funciones.LeerControles(ActividadPeerReview.Variables.idActividad,idListaRevision);
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
            $('#divTxtDescripcion').hide();
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

                    $("#TblPeerReview_info").hide();
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
        /*    await ActividadPeerReview.Funciones.LeerActividades($('#SelProyecto').val(), $('#SelActividad').val(), $('#SelClasificacion').val());*/
            ActividadPeerReview.Controles.selPeerReview.val(idListaRevision);
            ActividadPeerReview.Controles.selPeerReview.selectpicker('refresh');
            //ActividadPeerReview.Controles.selActividadRefPeer.val(idActividadRef);
            //ActividadPeerReview.Controles.selActividadRefPeer.selectpicker('refresh');
            $('.tab-actividad-peer').removeClass('hidden');
            $('#tab-actividad-peer').removeClass('hidden');
            $('#divTxtDescripcion').hide();
            $('.divPeerReview').removeClass('hidden');
            
 
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

$('#SelProyecto').change(() => {
    ActividadPeerReview.Controles.chkPeerReview.prop('checked', false);
    ActividadPeerReview.Controles.divPeerReview.addClass('hidden');
    ActividadPeerReview.Controles.selPeerReview.empty().append('<option value="-1">--Seleccionar--</option>');
    $('.tab-actividad-peer').addClass('hidden');
    $('#tab-actividad-peer').addClass('hidden');
});



$(document).on('click', '#BtnSendPDFWI', function (e) {


    var url = $('#urlExportWI').val()  +"/" + $("#IdActividad").val();
    window.open(url, '_blank');



    return false;

});

$(document).on('click', '#BtnCopiarAct', function (e) {


    InicializaCopiaActividad();


    return false;

});



function InicializaCopiaActividad() {

    $('#IdActividad').val(0);
    //$('#SelUsuarioAsignado').val(-1);
    //$('#SelResponsable').val(-1);
    //$('#SelUsuarioAsignado').selectpicker('refresh');
    //$('#SelResponsable').selectpicker('refresh');
    $('#TxtTiempoEjecucion').val('');
    $('#TxtPuntosHistoria').val('');
    //$('#TxtHorasFacturables').val(0);
    //$('#TxtHorasAsignadas').val(0);
    $('#TxtHorasFinal').text(0);
    //$('#TxtFechaInicio').val('');
    //$('#TxtFechaPlan').val('');
    $("#FlArchivo").parent().next().text("");
    $('#TxtFechaFin').val('');
    $("#spEstatusC").removeClass("text-info text-progress text-warning text-success text-danger text-muted");
    $("#spEstatusC").addClass("text-info");
    $("#BtnEstatus").text("Abierto");

    if ($("#IdTipoActividad").val() == 7) {
        var date = new Date(), y = date.getFullYear(), m = date.getMonth(), d = date.getDate();
        var fecha = new Date(y, m, d);
        $('#TxtFechaInicio').val(moment(fecha).format("DD/MM/YYYY"));
        $('#TxtFechaPlan').val(moment(fecha).format("DD/MM/YYYY"));
    }

    $("#TituloActividades").text("Copia de " + $("#TituloActividades").text() );

    $(".rwdetails").hide();
    $('#tab-actividad-peer').addClass('hidden');
    $('#divcomentario').hide();
    $('#BtnAgregarComentario').show();
    $('#TxtComentarioAct').val("");
    $('#div-repositorio').addClass('hidden');


    $("#BtnAgregarComentario").hide();
    $("#UlComentarios").empty();


    $("#show-share-div").hide();
    $('.note-view').hide();
    $('.note-help').hide();

    $('#parents-div').addClass('hidden');
    $('.divMensajes.div-parents-repo').empty();
    $('.divMensajes.div-attachments-repo').empty();
    $('.divMensajes.div-comentarios-repo').empty();
    $('#show-parents-div').hide();
    $('#add-attachments').hide();
    $('#show-repo-div').hide();
    $('#show-issues-div').hide();
    $('#issues-div').addClass('hidden');
    $('.divMensajes.div-issues-repo').empty();

     


    $(".rwdetails").removeClass("active");
    $(".tabpaneactivity").removeClass("active");
    $("#rwPrincipal").addClass("active");
    $("#tab-details").addClass("active");

}

$(document).on('click', '#BtnPlantilla', function (e) {

    tinymce.init({
        selector: "#TxtMuestraPlantilla",

        // Tip! To make TinyMCE leaner, only include the plugins you actually need
        plugins: "powerpaste casechange searchreplace autolink directionality advcode visualblocks visualchars image link media mediaembed codesample table charmap pagebreak nonbreaking anchor tableofcontents insertdatetime advlist lists checklist wordcount tinymcespellchecker editimage help formatpainter permanentpen charmap linkchecker emoticons advtable export print autosave",

        // This option allows you to specify the buttons and the order that they
        // will appear on TinyMCE’s toolbar.
        // https://www.tiny.cloud/docs/tinymce/6/toolbar-configuration-options/#basic-toolbar-options
        toolbar: "undo redo print spellcheckdialog formatpainter | blocks fontfamily fontsize | bold italic underline forecolor backcolor | link image addcomment showcomments  | alignleft aligncenter alignright alignjustify lineheight | checklist bullist numlist indent outdent | removeformat",

        // Tip! The height option accepts any valid CSS for height
        // If your editor is expected to get larger than the viewport
        // the sticky toolbar is useful for keeping the controls
        // always visible
        // https://www.tiny.cloud/docs/tinymce/6/editor-size-options/
        // https://www.tiny.cloud/docs/tinymce/6/menus-configuration-options/#toolbar_sticky
        height: '800px',
        toolbar_sticky: false,

        // You can customize the look and feel of the ui using skins and icons,
        // In this demo we are using an alternative icon pack
        // https://www.tiny.cloud/docs/tinymce/6/editor-icons/
        icons: 'thin',

        // The autosave plugin helps prevent data loss if the end-user accidentally
        // closes the browser by storing the content in the browser's local storage
        // There are many configuration options to control things like save interval
        // and retention. The below option loads any unsaved content from local
        // storage into TinyMCE
        // https://www.tiny.cloud/docs/tinymce/6/autosave/#autosave_restore_when_empty
        /*   autosave_restore_when_empty: true,*/

        // The Tiny Comments plugin enables you to quickly get collaboration up and
        // running. There are a lot of customizability but here are the most basic
        // options to get you started
        // https://www.tiny.cloud/docs/tinymce/6/introduction-to-tiny-comments/
        //tinycomments_mode: 'embedded',
        //tinycomments_author: 'john.doe',
        //tinycomments_author_name: 'John Doe',

        // The following css will be injected into the editor, extending
        // the default styles.
        // In a real world scenario, with much more custom styles for headings
        // links, tables, images etc, it's recommended to use the content_css
        // option to load a separate CSS file. Makes editing easier too.
        // https://www.tiny.cloud/docs/tinymce/6/add-css-options/
        content_style: `
                body {
                    background: #fff;
                }

                @media (min-width: 840px) {
                    html {
                        background: #eceef4;
                        min-height: 100%;
                        padding: 0 .5rem
                    }

                    body {
                        background-color: #fff;
                        box-shadow: 0 0 4px rgba(0, 0, 0, .15);
                        box-sizing: border-box;
                        margin: 1rem auto 0;
                        max-width: 820px;
                        min-height: calc(100vh - 1rem);
                        padding:4rem 6rem 6rem 6rem
                    }
                }
            `,
    });



    $("#divPlantillaAct").hide();
    $('#ModalPlantillas').modal('show');




    CargarListaPlantillasActividad();

    return false;

});

$(document).on('click', '#BtnAddPlantilla', function (e) {



    MensajeConfirmarAccion("¿Esta seguro de utilizar esta plantilla?<br/> Si tiene contenido creado en el título y en la descripción se sobreescribira", "btnConfirmaPlantilla");


    return false;

});

$(document).on('click', '#btnConfirmaPlantilla', function (e) {


    if ($("#lblTituloPlantilla").text() != "") {
        var idemoji = $(TxtBR).attr('data-id');
        $("div[data-id='" + idemoji + "'][data-type='input']").text($("#lblTituloPlantilla").text());
    }
  

    $("#")
    tinymce.get("TxtDescripcion").setContent(tinymce.get("TxtMuestraPlantilla").getContent());

    $('#ModalPlantillas').modal('hide');

    return false;

});





var recargaplantillas = false;
var $tableplantillas = $('#tblPlantillas');



var dsPlantillasAct;
async function CargarListaPlantillasActividad() {


    const data = await POST('/Templates/ConsultaPlantillasActivo', {});

    if (data.Exito) {

        dsPlantillasAct = jQuery.parseJSON(data.LstPlantillas);

        if (recargaplantillas) {

            $tableplantillas.bootstrapTable('load', dsPlantillasAct);

        }
        else {

            $tableplantillas.bootstrapTable({

                data: dsPlantillasAct,
                idField: 'IdPlantilla',
                search: true,
                idtable: "savePlantilla",
                rowStyle: function (row, index) {

                    return {
                        classes: "node"
                    }

                },
                onClickCell: function (value, row, index, e) {
                    if (index.IdPlantillaRel != 0) {


                        ConsultaPlantillaActividades(index.IdPlantilla);
                        $(".node").parent().removeClass("active");
                        e.addClass("active");


                    }


                },

                columns: [


                    {
                        field: 'Nombre',
                        searchable: true,
                        /*  title: 'Nombre',*/
                        /* width: "450px",*/
                        formatter: function (value, row, index) {
                            if (row.IdPlantillaRel == 0) {


                                return value;

                            }
                            else {

                                return '<span style="cursor:pointer;" class="node"> ' + value + '</span>';
                                /*   return '<a style="color: #337ab7" class="btn btn-link" onclick="ConsultaPlantilla(' + row.IdPlantilla + ' )">' + value + '</a>';*/

                            }


                        }
                    },

                ],
                treeShowField: 'Nombre',
                parentIdField: 'IdPlantillaRel',
                onPostBody: function () {
                    var columns = $tableplantillas.bootstrapTable('getOptions').columns

                    if (columns && columns[0][0].visible) {
                        $tableplantillas.treegrid({
                            treeColumn: 0,
                            initialState: "collapsed",
                            onChange: function () {
                                $tableplantillas.bootstrapTable('resetView')
                            }
                        })
                    }
                }
            })

            recargaplantillas = true;

        }




    }
    else {

        MensajeError(data.Mensaje);
    }

}

async function ConsultaPlantillaActividades(IdPlantilla) {

    const data = await POST('/Templates/ConsultaPlantilla', { IdPlantilla: IdPlantilla });

    if (data.Exito) {
        var datos = jQuery.parseJSON(data.Plantilla);
      
        //$('#SelCatPlantilla').empty();
        $("#lblNombrePlantilla").text(datos.Nombre);
        $("#lblTituloPlantilla").text(datos.Titulo);
        $("#lblDescripcionPlantilla").text(datos.Descripcion);

        $("#lblIdUModPlantillaAct").text(datos.UsuarioAct);
        $('#lblFechaModPlantillaAct').text(moment(datos.FechaMod).format("DD/MM/YYYY HH:mm:ss"));

        $("#IdTemplate").val(datos.IdPlantilla);
        tinymce.get("TxtMuestraPlantilla").setContent(datos.Contenido);
        $("#spActualizacionPlantilla").show();

        $("#divPlantillaAct").show();
    }
    else {

        MensajeError(data.Mensaje);
    }

}



$(document).on('click', '#BtnNuevaActRel', function (e) {


    tinymce.init({
        selector: "#TxtDescripcionR",

        // Tip! To make TinyMCE leaner, only include the plugins you actually need
        plugins: "powerpaste casechange searchreplace autolink directionality advcode visualblocks visualchars image link media mediaembed codesample table charmap pagebreak nonbreaking anchor tableofcontents insertdatetime advlist lists checklist wordcount tinymcespellchecker editimage help formatpainter permanentpen charmap linkchecker emoticons advtable export print",

        // This option allows you to specify the buttons and the order that they
        // will appear on TinyMCE’s toolbar.
        // https://www.tiny.cloud/docs/tinymce/6/toolbar-configuration-options/#basic-toolbar-options
        toolbar: "undo redo print spellcheckdialog formatpainter | blocks fontfamily fontsize | bold italic underline forecolor backcolor | link image addcomment showcomments  | alignleft aligncenter alignright alignjustify lineheight | checklist bullist numlist indent outdent | removeformat",

        // Tip! The height option accepts any valid CSS for height
        // If your editor is expected to get larger than the viewport
        // the sticky toolbar is useful for keeping the controls
        // always visible
        // https://www.tiny.cloud/docs/tinymce/6/editor-size-options/
        // https://www.tiny.cloud/docs/tinymce/6/menus-configuration-options/#toolbar_sticky
        height: '800px',
        toolbar_sticky: false,

        // You can customize the look and feel of the ui using skins and icons,
        // In this demo we are using an alternative icon pack
        // https://www.tiny.cloud/docs/tinymce/6/editor-icons/
        icons: 'thin',

        // The autosave plugin helps prevent data loss if the end-user accidentally
        // closes the browser by storing the content in the browser's local storage
        // There are many configuration options to control things like save interval
        // and retention. The below option loads any unsaved content from local
        // storage into TinyMCE
        // https://www.tiny.cloud/docs/tinymce/6/autosave/#autosave_restore_when_empty
        /*   autosave_restore_when_empty: true,*/

        // The Tiny Comments plugin enables you to quickly get collaboration up and
        // running. There are a lot of customizability but here are the most basic
        // options to get you started
        // https://www.tiny.cloud/docs/tinymce/6/introduction-to-tiny-comments/
        //tinycomments_mode: 'embedded',
        //tinycomments_author: 'john.doe',
        //tinycomments_author_name: 'John Doe',

        // The following css will be injected into the editor, extending
        // the default styles.
        // In a real world scenario, with much more custom styles for headings
        // links, tables, images etc, it's recommended to use the content_css
        // option to load a separate CSS file. Makes editing easier too.
        // https://www.tiny.cloud/docs/tinymce/6/add-css-options/
        content_style: `
                body {
                    background: #fff;
                }

                @media (min-width: 840px) {
                    html {
                        background: #eceef4;
                        min-height: 100%;
                        padding: 0 .5rem
                    }

                    body {
                        background-color: #fff;
                        box-shadow: 0 0 4px rgba(0, 0, 0, .15);
                        box-sizing: border-box;
                        margin: 1rem auto 0;
                        max-width: 820px;
                        min-height: calc(100vh - 1rem);
                        padding:4rem 6rem 6rem 6rem
                    }
                }
            `,
    });

    var idemoji = $("#TxtBRAR").attr('data-id');
    $("div[data-id='" + idemoji + "'][data-type='input']").text('');
    tinymce.get("TxtDescripcionR").setContent("");

    $('#ModalActividadR').modal('show');


    $('#SelActividadAR').val('195');
    $('#SelActividadAR').selectpicker('refresh')
    $('#SelActividadAR').trigger('change')
/*    $('#SelActividadAR').prop('disabled', true);*/


    return false;

});


$(document).on('click', '#BtnNuevaActCompartida', function (e) {


    tinymce.init({
        selector: "#TxtDescripcionR",

        // Tip! To make TinyMCE leaner, only include the plugins you actually need
        plugins: "powerpaste casechange searchreplace autolink directionality advcode visualblocks visualchars image link media mediaembed codesample table charmap pagebreak nonbreaking anchor tableofcontents insertdatetime advlist lists checklist wordcount tinymcespellchecker editimage help formatpainter permanentpen charmap linkchecker emoticons advtable export print",

        // This option allows you to specify the buttons and the order that they
        // will appear on TinyMCE’s toolbar.
        // https://www.tiny.cloud/docs/tinymce/6/toolbar-configuration-options/#basic-toolbar-options
        toolbar: "undo redo print spellcheckdialog formatpainter | blocks fontfamily fontsize | bold italic underline forecolor backcolor | link image addcomment showcomments  | alignleft aligncenter alignright alignjustify lineheight | checklist bullist numlist indent outdent | removeformat",

        // Tip! The height option accepts any valid CSS for height
        // If your editor is expected to get larger than the viewport
        // the sticky toolbar is useful for keeping the controls
        // always visible
        // https://www.tiny.cloud/docs/tinymce/6/editor-size-options/
        // https://www.tiny.cloud/docs/tinymce/6/menus-configuration-options/#toolbar_sticky
        height: '800px',
        toolbar_sticky: false,

        // You can customize the look and feel of the ui using skins and icons,
        // In this demo we are using an alternative icon pack
        // https://www.tiny.cloud/docs/tinymce/6/editor-icons/
        icons: 'thin',

        // The autosave plugin helps prevent data loss if the end-user accidentally
        // closes the browser by storing the content in the browser's local storage
        // There are many configuration options to control things like save interval
        // and retention. The below option loads any unsaved content from local
        // storage into TinyMCE
        // https://www.tiny.cloud/docs/tinymce/6/autosave/#autosave_restore_when_empty
        /*   autosave_restore_when_empty: true,*/

        // The Tiny Comments plugin enables you to quickly get collaboration up and
        // running. There are a lot of customizability but here are the most basic
        // options to get you started
        // https://www.tiny.cloud/docs/tinymce/6/introduction-to-tiny-comments/
        //tinycomments_mode: 'embedded',
        //tinycomments_author: 'john.doe',
        //tinycomments_author_name: 'John Doe',

        // The following css will be injected into the editor, extending
        // the default styles.
        // In a real world scenario, with much more custom styles for headings
        // links, tables, images etc, it's recommended to use the content_css
        // option to load a separate CSS file. Makes editing easier too.
        // https://www.tiny.cloud/docs/tinymce/6/add-css-options/
        content_style: `
                body {
                    background: #fff;
                }

                @media (min-width: 840px) {
                    html {
                        background: #eceef4;
                        min-height: 100%;
                        padding: 0 .5rem
                    }

                    body {
                        background-color: #fff;
                        box-shadow: 0 0 4px rgba(0, 0, 0, .15);
                        box-sizing: border-box;
                        margin: 1rem auto 0;
                        max-width: 820px;
                        min-height: calc(100vh - 1rem);
                        padding:4rem 6rem 6rem 6rem
                    }
                }
            `,
    });

    var idemoji = $("#TxtBRAR").attr('data-id');

    var idemojiBR = $("#TxtBR").attr('data-id');
    $("div[data-id='" + idemoji + "'][data-type='input']").text($("div[data-id='" + idemojiBR + "'][data-type='input']").text());
    tinymce.get("TxtDescripcionR").setContent("");

    $('#ModalActividadR').modal('show');

    $("#IdTipoActividadAR").val(1);



    $('#SelActividadAR').val($('#SelActividadAR').val());
    $('#SelActividadAR').selectpicker('refresh')
    $('#SelActividadAR').trigger('change')


    $('#SelClasificacionAR').val($('#SelClasificacion').val());
    $('#SelClasificacionAR').selectpicker('refresh')
    $('#SelClasificacionAR').trigger('change')


    $('#SelSprintAR').val($('#SelSprintA').val());
    $('#SelSprintAR').selectpicker('refresh');
    $('#SelSprintAR').trigger('change');


    $('#SelResponsableAR').val($('#SelResponsable').val());
    $('#SelResponsableAR').selectpicker('refresh');
    $('#SelResponsableAR').trigger('change');


    $('#SelPrioridadAR').val($('#SelPrioridad').val());
    $('#SelPrioridadAR').selectpicker('refresh');
    $('#SelPrioridadAR').trigger('change');

    $('#SelPrioridadAR').val($('#SelPrioridad').val());
    $('#SelPrioridadAR').selectpicker('refresh');
    $('#SelPrioridadAR').trigger('change');


    $('#TxtHorasFacturablesAR').val($('#TxtHorasFacturables').val());
    $('#TxtHorasAsignadasAR').val($('#TxtHorasAsignadas').val());

    $('#TxtFechaInicioAR').val($('#TxtFechaInicio').val());
    $('#TxtFechaPlanAR').val($('#TxtFechaPlan').val());


    /*    $('#SelActividadAR').prop('disabled', true);*/


    return false;

});


$(document).on('click', '#BtnAddActRelacionada', function (e) {

    var Mensaje = ValidaCamposRequeridos(".ReqActividadAR");

    var Lst = $("#SelUsuarioAsignadoAR").val();
    Mensaje += Lst != null ? "" : " - Usuario asignado <br>" ;

    var idemoji = $("#TxtBRAR").attr('data-id');

    Mensaje += $("div[data-id='" + idemoji + "'][data-type='input']").text() != "" ? "" : " - Título";


    if (Mensaje.length == 0) {

        var url = $('#urlGuardarActividadAR').val();


        var fechaIni = ObtieneFecha($('#TxtFechaInicioAR').val().trim());
        var fechaSol = ObtieneFecha($('#TxtFechaPlanAR').val().trim());

        var Lst = $("#SelUsuarioAsignadoAR").val();

        Actividad = {
            IdActividad: 0,
            Descripcion: tinymce.get("TxtDescripcionR").getContent(),
            BR: $("div[data-id='" + idemoji + "'][data-type='input']").text(),
            HorasFacturables: $("#TxtHorasFacturablesAR").val(),
            HorasAsignadas: $("#TxtHorasAsignadasAR").val(),
            TipoActividadId: $("#SelActividadAR").val(),
            ClasificacionId: $("#SelClasificacionAR").val(),
            IdUsuarioResponsable: $("#SelResponsableAR").val(),
            FechaInicio: fechaIni,
            FechaSolicitado: fechaSol,
            IdIteracion: $("#SelSprintAR").val(),
            Planificada: 0,
            PrioridadId: $('#SelPrioridadAR').val(),
            TipoId: $("#SelActividadAR").val() == 195 ? 7 : 1,
            IdActividadR1: $('#IdActividad').val()
        };





        $.ajax({
            url: url,
            data: JSON.stringify({ Actividad: Actividad, LstAsignados: Lst }),
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            success: function (data) {

                if (data.Exito) {
                    ConsultaActividadRelaciones();
                    $('#ModalActividadR').modal('hide');

                    

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


$(document).on('click', '#BtnSendAct', function (e) {


    $('span[class="tag"]').each(function (index, value) { value.remove(); });
    $('#TxtComentarioSendMails').code('');
    $('.note-editor').show();
    $("#TitleSendAct").text("Enviar " + $("#TituloActividades").text());
    $('#MdlSend').modal('show');


    return false;

});


$(document).on('click', '#BtnEnviarAct', function (e) {


    EnviarActividad();


    return false;

});

function EnviarActividad() {


    var test = $('#TxtSendMails').val().split(",");
    emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

    var Mensaje = "";

    Mensaje = ValidaCamposRequeridos(".ReqSendAct");

    if (Mensaje.length > 0) {

        MensajeAdvertencia(Mensaje);
        $('#MdlSend').modal('show');
        return false;
    }
    $.each(test, function (index, value) {
        if (!emailRegex.test(value)) {

            Mensaje = "Dirección de correo inválida: " + value;
        }
    });

    if (Mensaje.length > 0) {
   
        MensajeAdvertencia(Mensaje);
        $('#MdlSend').modal('show');
        return false;
    }

    var url = '/Actividades/Enviar'; 

    $.ajax({

        url: url,
        data: JSON.stringify({ Tipo: $('input:radio[name=TipoEnvio]:checked').val(), IdActividad: $('#IdActividad').val(), Correos: $('#TxtSendMails').val(), Comentario: $('#TxtComentarioSendMails').code() }),

   /*     data: { },*/
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            if (data.Exito) {

                $('.note-editor').hide();
                MensajeExito("Se envío la información correctamente.");
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

$(document).on('click', '#BtnShareAct', function (e) {

    $("#TituloShareAct").text("Compartir " + $("#TituloActividades").text());

    var url ="https://" + window.location.host + $("#urlSharedAct").val() + "/" + $('#IdActividad').val();
    var url2 = "https://" + window.location.host + $("#urlSharedActP").val() + "/" + $('#IdOAct').val() + "/" + $('#IdActividad').val();
    $("#TxtUrlCompartir").text(url);
    $("#TxtUrlCompartirP").text(url2);

    $('#MdlShareAct').modal('show');


    return false;

});


$(document).on('click', '#btnshareact', function (e) {


    e.preventDefault();


    const textToCopy = $('#TxtUrlCompartir').text();
    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            console.log(`Copied "${textToCopy}" to clipboard`);
        })
        .catch((err) => {
            console.error('Could not copy text: ', err);
        });



    MensajeExito("Se ha copiado al portapapeles");


});

$(document).on('click', '#btnshareactp', function (e) {


    e.preventDefault();


    const textToCopy = $('#TxtUrlCompartirP').text();
    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            console.log(`Copied "${textToCopy}" to clipboard`);
        })
        .catch((err) => {
            console.error('Could not copy text: ', err);
        });



    MensajeExito("Se ha copiado al portapapeles");


});


$(document).on('click', '#BtnCopyId', function (e) {


    e.preventDefault();


    const textToCopy = $('#TituloActividades').text();
    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            console.log(`Copied "${textToCopy}" to clipboard`);
        })
        .catch((err) => {
            console.error('Could not copy text: ', err);
        });



    MensajeExito("Se ha copiado al portapapeles");


});

$(document).on('click', '#BtnHideD', function (e) {


    if ($("#mdCont").hasClass("col-md-7")) {
        //$("#mdFiltros").hide("slide", { direction: "left" }, 500);


        //$("#mdClas").hide("slow");
        //$("#mdRels").hide("slow");
        $("#mdClas").hide();
        $("#mdRels").hide();
        $("#spHideD").removeClass("fa-indent").addClass("fa-dedent");
        setTimeout(function () {
            $("#mdCont").removeClass("col-md-7");
            $("#mdClas").removeClass("col-md-3");
            $("#mdRels").removeClass("col-md-2");
            $("#mdCont").addClass("col-md-12");
         
        }, 100);

    }
    else {
        $("#mdCont").removeClass("col-md-12");

        $("#mdCont").addClass("col-md-7");
        $("#mdClas").addClass("col-md-3");
        $("#mdRels").addClass("col-md-2");

        $("#spHideD").removeClass("fa-dedent").addClass("fa-indent");
        $("#mdClas").show();
        $("#mdRels").show();
        //$("#mdClas").show("slow");
        //$("#mdRels").show("slow");
    }
 /*   $("#mdFiltros").toogle();*/

});


$(document).on('click', '#BtnEjecutarTCActivity', function (e) {



    InicializarEjeucionPrueba($("#IdCicloCasoActivity").val(), 0);


    $('#MdlEjecutarCasoPrueba').modal({ keyboard: false });


    $('#ModalActividades').modal('hide');

    return false;

});


