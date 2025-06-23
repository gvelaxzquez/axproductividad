
$(document).ready(function () {



    tinymce.init({
        selector: "#TxtEvidenciasECP",
        plugins: "powerpaste casechange searchreplace autolink directionality advcode visualblocks visualchars image link media mediaembed codesample table charmap pagebreak nonbreaking anchor tableofcontents insertdatetime advlist lists checklist wordcount tinymcespellchecker editimage help formatpainter permanentpen charmap tinycomments linkchecker emoticons advtable export print autosave",
        toolbar: "undo redo print spellcheckdialog formatpainter | blocks fontfamily fontsize | bold italic underline forecolor backcolor | link image addcomment showcomments  | alignleft aligncenter alignright alignjustify lineheight | checklist bullist numlist indent outdent | removeformat",
        height: '700px',
        toolbar_sticky: false,
        icons: 'thin',
        tinycomments_mode: 'embedded',
        tinycomments_author: 'john.doe',
        tinycomments_author_name: 'John Doe',
        media_live_embeds: true,
        content_style: `
                //body {
                //    background: #fff;
                //}

                @*@media (min-width: 840px) {
                    html {
                        background: #eceef4;
                        min-height: 100%;
                        padding: 0 .5rem
                    }*@

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




});

function InicializarEjeucionPrueba(IdCicloCaso, tipo) {


    $("#IdCicloCasoECP").val(IdCicloCaso);

    var url = $('#urlConsultaECP').val();

    $.ajax({

        url: url,
        data: JSON.stringify({ IdCicloCaso: IdCicloCaso }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            if (data.Exito) {

                //$('.note-view').hide();
                //$('.note-help').hide();
               

                $('#SelUsuarioAsignadoECP').empty();
                $('#SelUsuarioAsignadoECP').append(data.LstUsuarios);
                $('#SelUsuarioAsignadoECP').selectpicker('refresh');


                var datos = jQuery.parseJSON(data.DatosE);

                $("#IdActividadEjecucionECP").val(datos.IdActividadEjecucion);
                $("#IdProyectoECP").val(datos.IdProyecto);

                $('#titleECP').text("EJECUTAR CASO DE PRUEBA " + datos.Titulo);

                $('#LblDescripcionECP').empty();
                $('#LblDescripcionECP').append(datos.Descripcion);

              

                $('#LblClasificacionECP').text(datos.Clasificacion);
                $('#LblTiempoEjecucionECP').text(datos.TiempoEjecucion);
                

                $('#TxtHorasFinalesECP').val(datos.HorasFinales);


                $('#SelUsuarioAsignadoECP').val(datos.IdUsuarioAsignado);
                $('#SelUsuarioAsignadoECP').selectpicker('refresh');

                if (tipo == 0) {
                    //$('.note-editor').show();
                    //$('#TxtEvidenciasECP').code(datos.Evidencias);

                    if (datos.Evidencias != null) {
                        tinymce.get("TxtEvidenciasECP").setContent(datos.Evidencias);
                    }
                    else {

                        tinymce.get("TxtEvidenciasECP").setContent("");
                    }
                    

                    $('#SelResultadoECP').val(datos.EstatusP);
                    $('#SelResultadoECP').selectpicker('refresh');
                }

             


                ConsultaBugsRelacionados();

            }
            else {

                MensajeAdvertencia(data.Mensaje);
            }

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Ha ocurrido un error inesperado, por favor vuelva a intentarlo.");
        }
    });

}


$(document).on('click', '#BtnGuardarECP', function (e) {
    

    if ($('#SelResultadoECP').val() == "L") {

        $('#TxtEvidenciasECP').addClass("reqECP");

    }
    else {

        $('#TxtEvidenciasECP').removeClass("reqECP");
    }


   var Mensaje = ValidaCamposRequeridos(".reqECP");
    if (Mensaje.length == 0) {

        var CP = {
            IdCicloCaso: $('#IdCicloCasoECP').val(),
            IdUsuarioAsignado: $('#SelUsuarioAsignadoECP').val().trim(),
            EstatusP: $('#SelResultadoECP').val().trim(),
            Evidencias: tinymce.get("TxtEvidenciasECP").getContent()
        }

        var url = $('#urlGuardarECP').val();

         $.ajax({

             url: url,
             data: JSON.stringify(CP),
             type: "POST",
             contentType: "application/json; charset=utf-8",
             dataType: "json",
             async: false,
             success: function (data) {
                 if (data.Exito) {

                     $('#MdlEjecutarCasoPrueba').modal('hide');
                     $('div.pg-loading-screen').remove();
                     /*    MensajeExito(data.Mensaje);*/

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

});

function CapturarTrabajoActQA() {


    var IdActividad = $("#IdActividadEjecucionECP").val();



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
          
            InicializarEjeucionPrueba($("#IdCicloCasoECP").val(), 1);
            $(this).off('hidden.bs.modal');

        });
        $('#ModalCapturarTrabajo').modal({ backdrop: 'static', keyboard: false });

  


}






async function ConsultaBugsRelacionados() {
    const data = await POST('/actividades/ConsultaBugsRelacionados', { idActividad: $("#IdActividadEjecucionECP").val() });

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
                          <span  class='btn btn-small btn-grid' style='text-align:left;color:#000;'><span>  ${l.EstatusStr} <span><span class='fa fa-fw fa-circle ${l.Estatus}'></span> </span>
                    </div>
                </div>
                <div style="padding: 0px 10px">
                    <p>${l.BR.replaceAll('\n', '<br />') ?? ''}</p>
                </div>
                <button style="margin-bottom: -12px" class="btnTooltip abajo fa fa-trash btnEliminarActividadRelacion" data-id="${l.IdActividadRef}" ></button>
            </div>`
    ).join('');

    $('.divDefectosRel').empty().html(html);
}

function newBugECP(Tipo) {


    $('#ModalActividades').modal({ keyboard: false });

    $('#ModalActividades').on('hidden.bs.modal', function () {

        InicializarEjeucionPrueba($("#IdCicloCasoECP").val(), 1);
        $(this).off('hidden.bs.modal');
   /*     $('.note-editor').show();*/

    });

    if (Tipo == 7) {

        EsBug = true;

      
    }
    else {
        EsBug = false;
    }
    /*    $('#TituloActividades').text("Captura actividad");*/
    $('#IdTipoActividad').val(Tipo);
    $('#IdProyectoAct').val($("#IdProyectoECP").val());
    $('#IdActividadRel').val($("#IdActividadEjecucionECP").val());
    InicializaAltaActividades();

    $('#SelPrioridad').val(1);
    $('#SelPrioridad').selectpicker('refresh');

    $('#SelResponsable').val($("#SelUsuarioAsignadoECP").val());
    $('#SelResponsable').selectpicker('refresh');


   

    return false;
};
