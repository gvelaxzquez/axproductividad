var Sprint;
var SprintN;
var Proyecto;
var ProyectoN;
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



    

     Sprint = $.urlParam('Sprint');
     SprintN = $.urlParam('SprintN');
     Proyecto = $.urlParam('Proyecto');
     ProyectoN = $.urlParam('ProyectoN');

    if (Sprint != 0 && Proyecto != 0) {

        $("#divFiltros").hide();
        $("#Subtitle").text("Proyecto: " + ProyectoN.replace("%20", " ").replace("%20", " ") + " | " + SprintN.replace("%20", " "));

        $("#IdProyecto").val(Proyecto);
        $("#IdSprint").val(Sprint);
        CargaTableroSprint(Sprint, Proyecto);
    }
    else {
        $("#divsubtitle").hide();
        CargaInicialTablero();
        //CargaTablero();
    }

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

            $('#TxtRangoFechas').val(moment().startOf('month').format('DD/MM/YYYY') + ' - ' + moment().endOf('month').format('DD/MM/YYYY'));

});

function CargaInicialTablero() {
  var url = $('#urlCargaInicialTablero').val();
    $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: SuccessCargaInicialTablero,
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            console.log('Error: ', xmlHttpRequest);
        }
    });
    return false;
}

function SuccessCargaInicialTablero(data){

                if(data.Exito){
        
                  $('#SelProyectoT').empty();
                  $('#SelProyectoT').append(data.LstProyectos);
                  $('#SelProyectoT').selectpicker('refresh');

                  $('#SelRecursoT').empty();
                  $('#SelRecursoT').append(data.LstUsuarios);
                  $('#SelRecursoT').selectpicker('refresh');
                 }
                 else{

                 MensajeAdvertencia(data.Mensaje);
                }
}

function CargaTablero() {

    var url = $('#urlCargaTablero').val();

    var incio,fin;
    if ($("#TxtRangoFechas").val() != "") {
        inicio = ($("#TxtRangoFechas").val()).split('-')[0];
        fin = ($("#TxtRangoFechas").val()).split('-')[1];
    }

    var datosBuscar = {
        FechaSolIni: inicio,
        FechaSolFin: fin,
        TipoPeriodo: $('#SelPeriodoT').val(),
        LstAsignado: $('#SelRecursoT').val(),
        LstSprints : $('#SelSprintT').val(),
        LstProyecto: $('#SelProyectoT').val()
      
    }


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
            $("#tasks_ok").append(data.ActividadesL);
            resizeTaskList();
            page_content_onresize();
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

function CargaTableroSprint(Sprint, Proyecto) {

    var url = $('#urlCargaTablero').val();

    var LstSprints = [];
    var LstProyecto = [];
    LstSprints.push(Sprint);
    LstProyecto.push(Proyecto);

    var datosBuscar = {
        TipoPeriodo: 3,
        LstSprints: LstSprints,
        LstProyecto: LstProyecto,
        LstAsignado: $('#SelRecursoT').val()

    }


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

                $("#tasks_assigned").append(data.ActividadesA);
                $("#tasks_progreess").append(data.ActividadesP);
                $("#task_validate").append(data.ActividadesR);
                $("#tasks_re").append(data.ActividadesX);
                $("#tasks_ok").append(data.ActividadesL);
                resizeTaskList();
                page_content_onresize();
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

$(document).on('click', '#BtnFiltrarT', function (e) {

    CargaTablero();

    return false;

});

$("#tasks_assigned,#tasks_progreess, #task_validate").sortable({
            items: "> .task-item",
            connectWith: "#tasks_assigned, #tasks_progreess, #task_validate ",
            handle: ".task-text",
            receive: function (event, ui) {
                if (this.id == "task_validate") {
                  //  alert("Se paso a validación");
                    var item = $(ui).attr('item')[0].id;

                    ui.item.removeClass("task-info");
                    ui.item.removeClass("task-danger");
                    ui.item.removeClass("task-progreess");
                    ui.item.addClass("task-validate");

                    AbrirModalCapturaTiempo(item);
                    //ActualizaEstatus(item, 'V');
                    //ui.item.addClass("task-complete");
                    //.find(".task-footer > .pull-right").remove();
                }
                if (this.id == "tasks_progreess") {
                    //alert("Se paso a progreso");
                    var item = $(ui).attr('item')[0].id;
                    //var item2 = ui.id;
                    ui.item.removeClass("task-info");
                    ui.item.removeClass("task-validate");
                    ui.item.removeClass("task-danger");
                    ui.item.addClass("task-progreess");
                    ActualizaEstatus(item, 'P');

                    //ui.item.find(".task-footer").append('<div class="pull-right"><span class="fa fa-play"></span> 00:00</div>');
                }
                if (this.id == "tasks_assigned") {
                    //alert("Se paso a pendiente");
                    var item = $(ui).attr('item')[0].id;

                    ui.item.removeClass("task-validate");
                    ui.item.removeClass("task-danger");
                    ui.item.removeClass("task-progreess");
                    ui.item.addClass("task-info");
                    ActualizaEstatus(item, 'A');

                    //ui.item.find(".task-footer").append('<div class="pull-right"><span class="fa fa-play"></span> 00:00</div>');
                }
                page_content_onresize();
            }
}).disableSelection();

$("#tasks_re, #task_validate").sortable({
            items: "> .task-item",
            connectWith: "#tasks_re,tasks_assigned, #tasks_progreess, #task_validate",
            handle: ".task-text",
            receive: function (event, ui) {
                if (this.id == "task_validate") {
                    ui.item.addClass("task-complete").find(".task-footer > .pull-right").remove();
                }
                if (this.id == "tasks_progreess") {
                    alert("Se paso a progreso");
                    ui.item.find(".task-footer").append('<div class="pull-right"><span class="fa fa-play"></span> 00:00</div>');
                
                
                }
                page_content_onresize();
            }
}).disableSelection();

$("#tasks_ok").sortable({
    items: "> .task-item",
    connectWith: "#tasks_ok,tasks_assigned, #tasks_progreess",
    handle: ".task-text",
    receive: function (event, ui) {
        if (this.id == "tasks_assigned") {
            ui.item.addClass("task-complete").find(".task-footer > .pull-right").remove();
            var item = $(ui).attr('item')[0].id;

            ui.item.removeClass("task-validate");
            ui.item.removeClass("task-danger");
            ui.item.removeClass("task-progreess");
            ui.item.addClass("task-info");
            ActualizaEstatus(item, 'A');
        }
        if (this.id == "tasks_progreess") {
            var item = $(ui).attr('item')[0].id;
            //var item2 = ui.id;
            ui.item.removeClass("task-info");
            ui.item.removeClass("task-validate");
            ui.item.removeClass("task-danger");
            ui.item.addClass("task-progreess");
            ActualizaEstatus(item, 'P');
        }
        page_content_onresize();
    }
}).disableSelection();


function ActualizaEstatus(IdActividad, Estatus) {

    var url = $('#urlActualizaEstatus').val();

    $.ajax({
        url: url,
        data: JSON.stringify({IdActividad: IdActividad, Estatus:Estatus}),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            if (!data.Exito) {

                 MensajeAdvertencia(data.Mensaje);

            }
            else {
                 if (Sprint != 0 && Proyecto != 0) {
                       CargaTableroSprint(Sprint, Proyecto);
                  }
               else {
                 CargaTablero();
                 }        
            }

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error al realizar la consulta, intente de nuevo.");
        }
    });


}

function AbrirModalCapturaTiempo(IdActividad) {

    $("#IdActividadCT").val(IdActividad);
    $('#TituloRec').text("Capturar fecha fin de actividad #" + IdActividad);
     var date =new Date();
    $('#TxtFinActividad').datetimepicker(
     {
        format: 'DD/MM/YYYY',
         maxDate:date
     });

    $('#ModalCapturarTiempo').on('hidden.bs.modal', function () {
        if (Sprint != 0 && Proyecto != 0) {
            CargaTableroSprint(Sprint, Proyecto);
        }
        else {
            CargaTablero();
        }

        $(this).off('hidden.bs.modal');
    });

    $('#ModalCapturarTiempo').modal({ keyboard: false });

    return false;

}

$(document).on('change', '#SelProyectoT', function (e) {

    CargarSprints();

return false;

});

function CargarSprints ()
{

 var url = $('#urlCargaSprints').val();
 var LstProyectos= $('#SelProyectoT').val();


    $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ LstProyectos: LstProyectos }),
        dataType: "json",
        async: true,
        success: SuccessCargaSprints,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            console.log('Error: ', xmlHttpRequest);
        }
    });
    return false;

}

function SuccessCargaSprints(data){


     if(data.Exito){
        
                  $('#SelSprintT').empty();
                  $('#SelSprintT').append(data.LstSprints);
                  $('#SelSprintT').selectpicker('refresh');

                 }
      else{

                 MensajeAdvertencia(data.Mensaje);
                }

}

$.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);

    if (results != null) {
        return results[1] || 0;
    }
    else {

        return 0;
    }
    //return results[1] || 0;
}

function CapturaTrabajo(IdActividad,PSP, Descripcion) {

    
    if(PSP == 1) {
     var url = $('#urlTracking').val() +  "?Id=" +  IdActividad;
    window.open(url, '_blank');

    }
    else  {
   $("#IdActividadCTra").val(IdActividad);
   $("#LblActividadDesc").text(IdActividad  +  "-"  + Descripcion);
     var date =new Date();
    $('#TxtFechaTrab').datetimepicker(
     {
        format: 'DD/MM/YYYY',
        maxDate:date
        });
        $("#TxtTiempo").val("");
        $("#TxtComentarioTrabajo").val("");
   CargarTrabajos();
   $('#ModalCapturarTrabajo').on('hidden.bs.modal', function () {
       
    if (Sprint != 0 && Proyecto != 0) {
        CargaTableroSprint(Sprint, Proyecto);
    }
    else {
        CargaTablero();
       }

       $(this).off('hidden.bs.modal');
    });
   $('#ModalCapturarTrabajo').modal({ backdrop: 'static', keyboard: false });
   }
}

$(".btn-AltaActividadesTablero").click(function () {

    $('#ModalActividades').modal({ keyboard: false });
    $('#TituloActividades').text("Captura actividad");
    $('#IdProyectoAct').val($('#SelProyectoT').val());
    InicializaAltaActividades();
 

    return false;

});

$(window).scroll(function () {
    if ($("#tableroTickets").length == 0) {
        return;
    }
    var isPositionFixed = $('.headTasks').hasClass('headFixed');
    if ($(this).scrollTop() > $("#tableroTickets").position().top && !isPositionFixed) {

        $(".headTasks").addClass("headFixed");

        $.each($("#tableroTickets .x_panel"), function (e, v) {

            $(".headTasks", $(v)).css("width", $(v).css("width"));

        });

    }
    if ($(this).scrollTop() < 260 && isPositionFixed) {
        $(".headTasks").removeClass("headFixed");
    }
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
