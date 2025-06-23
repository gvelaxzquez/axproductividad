
var dsActividades = [];
var tablaActividades;
var recarga = false;
var $tableActs = $('#TblActividades');

$('.table-responsive').on('show.bs.dropdown', function () {
    $('.table-responsive').css("overflow", "inherit");
});

$('.table-responsive').on('hide.bs.dropdown', function () {
    $('.table-responsive').css("overflow", "auto");
});

var lenguajeEs = {
    "lengthMenu": "Mostrando _MENU_ registros por página",
    "zeroRecords": "Sin resultados",
    "paginate": {
        "first": "Primero",
        "last": "Último",
        "next": "Siguiente",
        "previous": "Anterior"
    },
    "info": "Página _PAGE_ de _PAGES_",
    "infoEmpty": "No hay registros",
    "infoFiltered": "(filtrado de _MAX_ registros totales)",
    "search": ""
}


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


var columnasActividades = [
    {
        "class": "text-center",
        "render": function (data, type, row) {

            return '<img src="/Content/Project/Imagenes/' + row.TipoUrl + '" class="img-dt" title="' + row.TipoNombre + '" style="width:18px; height:18px;" />';
        }
    },
    {
        "data": "IdActividadStr",
        "class": "text-left",
        "render": function (data, type, row) {

            return '<a style="color: #337ab7" class="btn btn-link" onclick="clickalerta(' + row.IdActividad + ' )">' + data + '</a>';

        }
    },
    {
        "data": "BR",
        "class": "text-left",
    },
  
    {
        "data": "Estatus",
        "class": "text-left",
        "render": function (data, type, row) {

            if (data == 'A') {

                return '<button  class="btn btn-small btn-grid" style="text-align:left; width:100%;"><span>' + row.EstatusStr + '<span><span  class="fa fa-fw fa-circle text-info "></span> </button>';

            }
            else if (data == 'P') {
                return '<button  class="btn btn-small btn-grid" style="text-align:left; width:100%;"><span>' + row.EstatusStr + '<span><span  class="fa fa-fw fa-circle text-progress "></span> </button>';

            }
            else if (data == 'R' || data == 'V') {
                return '<button  class="btn btn-small btn-grid" style="text-align:left; width:100%;"><span>' + row.EstatusStr + '<span><span  class="fa fa-fw fa-circle text-warning "></span> </button>';

            }
            else if (data == 'X') {
                return '<button  class="btn btn-small btn-grid" style="text-align:left; width:100%;"><span>' + row.EstatusStr + '<span><span  class="fa fa-fw fa-circle text-danger "></span> </button>';

            }
            else if (data == 'L') {
                return '<button  class="btn btn-small btn-grid" style="text-align:left; width:100%;"><span>' + row.EstatusStr + '<span><span  class="fa fa-fw fa-circle text-success "></span> </button>';

            }
            else if (data == 'C') {
                return '<button  class="btn btn-small btn-grid" style="text-align:left; width:100%;"><span>' + row.EstatusStr + '<span><span  class="fa fa-fw fa-circle text-muted "></span> </button>';

            }
        }
    },
    {
        "data": "PrioridadStr",
        "class": "text-center",
    },

    {
        "data": "ClaveUsuario",
        "class": "text-left",
        "render": function (data, type, row) {
            if (data == "") {

                return "";
            }
            else {

                return `<img src="/Archivos/Fotos/${data}.jpg" title="${row.AsignadoStr}" class="img-dt" style="width: 35px; height: 35px" /> <a class="btn btn-link"> ` +  row.AsignadoStr + '</a>'
            }

        }
    },

    {
        "data": "Sprint",
        "class": "text-left",
    },

    {
        "data": "FechaCreo",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? "" : moment(data).format("YYYY/MM/DD"))
        }
    },

    {
        "data": "FechaSolicitado",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? "" : moment(data).format("YYYY/MM/DD"))
        }
    }
];


$(document).ready(function () {

        if ($(".page-sidebar .x-navigation").hasClass("x-navigation-minimized")) {
        $(".page-container").removeClass("page-navigation-toggled");
        x_navigation_minimize("open");
    } else {
        $(".page-container").addClass("page-navigation-toggled");
        x_navigation_minimize("close");
    }


    InicializaControlesQuery();
    CargarFiltrosQuery();
    $(".filter-settings-icon").on("click", function () {
        $(".filter-settings").toggleClass("active");
    });


    if ($("#IdQuery").val() == "0") {

        $("#BtnShareQ").hide();
        $("#BtnExportarQ").hide();
        $("#BtnDeleteQ").hide();

        $("#divNotificaciones").hide();

    }
    else {

        $("#mdFiltros").hide("slow");
        $("#spFilters").removeClass("fa-dedent").addClass("fa-indent");
        setTimeout(function () {
            $("#mdContQ").addClass("col-md-12");
            $("#mdContQ").removeClass("col-md-10");
            $("#mdFiltros").removeClass("col-md-2");

        }, 800);

        AsignaFiltros();
        EjecutarQuery();
    }

});

function InicializaControlesQuery() {

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

    $('#TxtRangoFechasQ').val(moment().startOf('month').format('DD/MM/YYYY') + ' - ' + moment().endOf('month').format('DD/MM/YYYY'));

    $('#TxtRangoFechasCreoQ').val(moment().startOf('month').format('DD/MM/YYYY') + ' - ' + moment().endOf('month').format('DD/MM/YYYY'));

    $('#TxtRangoFechasTerminoQ').val(moment().startOf('month').format('DD/MM/YYYY') + ' - ' + moment().endOf('month').format('DD/MM/YYYY'));


    $('#Calendar').fullCalendar({
        locale: 'es',
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay,listMonth'
        },
        buttonIcons: true, 
        navLinks: true, 
        editable: false,
        eventLimit: true,
        views: {
            month: {
                eventLimit: 50
            }
        },
        eventClick: function (info) {
            clickalerta(info.id);
        }

    });

}

 function CargarFiltrosQuery() {


     var url = $('#urlCargaFiltrosQuery').val();

     $.ajax({

         url: url,
         type: "POST",
         contentType: "application/json; charset=utf-8",
         dataType: "json",
         async: false,
         success: function (data) {

             if (data.Exito) {

                 $('#SelProyectoQ').empty();
                 $('#SelProyectoQ').append(data.LstProyectos);
                 $('#SelProyectoQ').selectpicker('refresh');

                 $('#SelFaseQ').empty();
                 $('#SelFaseQ').append(data.LstFase);
                 $('#SelFaseQ').selectpicker('refresh');

                 $('#SelClasificacionQ').empty();
                 $('#SelClasificacionQ').append(data.LstClasificacion);
                 $('#SelClasificacionQ').selectpicker('refresh');

                 $('#SelUsuarioAsignadoQ').empty();
                 $('#SelUsuarioAsignadoQ').append(data.LstUsuarios);
                 $('#SelUsuarioAsignadoQ').selectpicker('refresh');

                 $('#SelUsuarioResponsableQ').empty();
                 $('#SelUsuarioResponsableQ').append(data.LstUsuarios);
                 $('#SelUsuarioResponsableQ').selectpicker('refresh');


                 $('#SelUsuariosShareQ').empty();
                 $('#SelUsuariosShareQ').append(data.LstUsuarios);
                 $('#SelUsuariosShareQ').selectpicker('refresh');

                 $('#SelPrioridadQ').empty();
                 $('#SelPrioridadQ').append(data.LstPrioridad);
                 $('#SelPrioridadQ').selectpicker('refresh');

         
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

function AsignaFiltros() {

     var f = $('#hdFiltros').val();
     var dso = JSON.parse($('#hdFiltros').val());

    $('#SelTipoQ').val(dso.LstTipo);
    $('#SelTipoQ').selectpicker('refresh');

    $('#SelProyectoQ').val(dso.LstProyecto);
    $('#SelProyectoQ').selectpicker('refresh');


    //Cargo los sprints
    CargarFiltroSprints();



    $('#SelFaseQ').val(dso.LstTipoActividad);
    $('#SelFaseQ').selectpicker('refresh');

    $('#SelClasificacionQ').val(dso.LstClasificacion);
    $('#SelClasificacionQ').selectpicker('refresh');


    $('#SelPrioridadQ').val(dso.LstPrioridad);
    $('#SelPrioridadQ').selectpicker('refresh');

    $('#SelUsuarioAsignadoQ').val(dso.LstAsignado);
    $('#SelUsuarioAsignadoQ').selectpicker('refresh');

    $('#SelUsuarioResponsableQ').val(dso.LstResponsable);
    $('#SelUsuarioResponsableQ').selectpicker('refresh');

    $('#SelEstatusQ').val(dso.LstEstatus);
    $('#SelEstatusQ').selectpicker('refresh');



    if (dso.FechaSolIni != null && dso.FechaSolIni != "") {

        $('#TxtRangoFechasQ').val(dso.FechaSolIni.format('DD/MM/YYYY') + ' - ' + dso.FechaSolFin.format('DD/MM/YYYY'));
    }

    if (dso.FechaCreoIni != null && dso.FechaCreoIni != "") {

        $('#TxtRangoFechasCreoQ').val(dso.FechaCreoIni.format('DD/MM/YYYY') + ' - ' + dso.FechaCreoFin.format('DD/MM/YYYY'));
    }


    if (dso.FechaCierreIni != null && dso.FechaCierreIni != "") {

        $('#TxtRangoFechasTerminoQ').val(dso.FechaCierreIni.format('DD/MM/YYYY') + ' - ' + dso.FechaCierreFin.format('DD/MM/YYYY'));
    }



    $('#TxtContieneQ').val(dso.Contiene);

    $('#SelSprintsQ').val(dso.LstSprints);
    $('#SelSprintsQ').selectpicker('refresh');
  

}
$(document).on('change', '#SelProyectoQ', function (e) {

    CargarFiltroSprints();
    return false;

});


async function CargarFiltroSprints() {


    const data = await POST('/Querys/CargaFiltroSprint', { LstProyectos: $('#SelProyectoQ').val() });

    if (data.Exito) {

        $('#SelSprintsQ').empty();
        $('#SelSprintsQ').append(data.LstSprints);
        $('#SelSprintsQ').selectpicker('refresh');

    }
    else {

        MensajeError(data.Mensaje);
    }

}

var dsActividades 
async function FiltrarQuery() {


    var Filtros = {
        LstProyecto: $('#SelProyectoQ').val(),
        FechaSolIni: ($("#TxtRangoFechasQ").val()).split('-')[0],
        FechaSolFin: ($("#TxtRangoFechasQ").val()).split('-')[1],
        FechaCreoIni: ($("#TxtRangoFechasCreoQ").val()).split('-')[0],
        FechaCreoFin: ($("#TxtRangoFechasCreoQ").val()).split('-')[1],
        FechaCierreIni: ($("#TxtRangoFechasTerminoQ").val()).split('-')[0],
        FechaCierreFin: ($("#TxtRangoFechasTerminoQ").val()).split('-')[1],
        LstAsignado: $('#SelUsuarioAsignadoQ').val(),
        LstResponsable: $('#SelUsuarioResponsableQ').val(),
        LstEstatus: $('#SelEstatusQ').val(),
        LstTipoActividad: $('#SelFaseQ').val(),
        LstClasificacion: $('#SelClasificacionQ').val(),
        LstTipo: $('#SelTipoQ').val(),
        LstSprints: $('#SelSprintsQ').val(),
        LstPrioridad: $('#SelPrioridadQ').val(),
        Contiene: $('#TxtContieneQ').val(),

    }

    //var js = JSON.stringify(Filtros);
    //var dso = JSON.parse(js);

    const data = await POST('/Querys/FiltrarQuery', { Filtros: Filtros });

    if (data.Exito) {

        dsActividades = jQuery.parseJSON(data.Actividades);
        //tablaActividades = inicializaTabla($('#TblActividades'), dsActividades, columnasActividades, 3, "asc", true, false, true);


        if (recarga) {

            $tableActs.bootstrapTable('load', dsActividades);

        }
        else {

            $tableActs.bootstrapTable({

                data: dsActividades,
                idField: 'IdActividad',
                toolbar: "#toolbarBL",
                search: true,
                idtable: "saveId",

                columns: [

                    {
                        field: 'IdActividad',
                        align: 'left',
                        title: '',
                        formatter: function (value, row, index) {

                            return '<img src="/Content/Project/Imagenes/' + row.TipoUrl + '" class="img-dt" title="' + row.TipoNombre + '" style="width:18px; height:18px;" />';
                        }
                    },

                    {
                        field: 'IdActividadStr',
                        title: 'Id',
                        align: 'left',
                        sortable: true,
                        formatter: function (value, row, index) {

                            return '<a style="color: #337ab7" class="btn btn-link" onclick="clickalerta(' + row.IdActividad + ' )">' + value + '</a>';
                        }
                    },

                    {
                        field: 'BR',
                        align: 'left',
                        title: 'Titulo',
                        sortable: true,
                    },
                    {
                        field: 'Estatus',
                        title: 'Estatus',
                        sortable: true,
                        align: 'left',
                        formatter: function (value, row, index) {



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
                    },

                    {
                        field: 'PrioridadStr',
                        title: 'Prioridad',
                        align: 'left',
                        sortable: true,

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
                    },

                    {
                        field: 'FechaCreo',
                        title: 'Fecha alta',
                        sortable: true,
                     /*   width: "450px",*/
                        formatter: function (value, row, index) {

                            return (value == null || value == "" ? "" : moment(value).format("YYYY/MM/DD"))

                        }
                    },

                    {
                        field: 'FechaSolicitado',
                        title: 'Fecha objetivo',
                        sortable: true,
                      /*  width: "450px",*/
                        formatter: function (value, row, index) {

                            return (value == null || value == "" ? "" : moment(value).format("YYYY/MM/DD"))

                        }
                    },
                    {
                        field: 'FechaTermino',
                        title: 'Fecha terminó',
                        sortable: true,
                        /*  width: "450px",*/
                        formatter: function (value, row, index) {

                            return (value == null || value == "" ? "" : moment(value).format("YYYY/MM/DD"))

                        }
                    }
                ]
            })

            recarga = true;

        }


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



        $("#tasks_assigned").html(data.ActividadesA)
        $("#tasks_progreess").html(data.ActividadesP)
        $("#task_validate").append(data.ActividadesR);
        $("#tasks_re").append(data.ActividadesX);
        $("#tasks_ok").append(data.ActividadesLi);

        var events = JSON.parse(data.Eventos);

        $('#Calendar').fullCalendar('removeEvents');
        $('#Calendar').fullCalendar('addEventSource', events);
        $('#Calendar').fullCalendar('rerenderEvents');




        resizeTaskList();

    }
    else {

        MensajeError(data.Mensaje);
    }

}


async function EjecutarQuery() {


    const data = await POST('/Querys/EjecutaQuery', { IdQuery: $("#IdQuery").val() });

    if (data.Exito) {

        dsActividades = jQuery.parseJSON(data.Actividades);
      /*  tablaActividades = inicializaTabla($('#TblActividades'), dsActividades, columnasActividades, 3, "asc", true, false, true);*/


        if (recarga) {

            $tableActs.bootstrapTable('load', dsActividades);

        }
        else {

            $tableActs.bootstrapTable({

                data: dsActividades,
                idField: 'IdActividad',
                toolbar: "#toolbarBL",
                search: true,
                idtable: "saveId",

                columns: [

                    {
                        field: 'IdActividad',
                        align: 'left',
                        title: '',
                        formatter: function (value, row, index) {

                            return '<img src="/Content/Project/Imagenes/' + row.TipoUrl + '" class="img-dt" title="' + row.TipoNombre + '" style="width:18px; height:18px;" />';
                        }
                    },

                    {
                        field: 'IdActividadStr',
                        title: 'Id',
                        align: 'left',
                        sortable: true,
                        formatter: function (value, row, index) {

                            return '<a style="color: #337ab7" class="btn btn-link" onclick="clickalerta(' + row.IdActividad + ' )">' + value + '</a>';
                        }
                    },

                    {
                        field: 'BR',
                        align: 'left',
                        title: 'Titulo',
                        sortable: true,
                    },
                    {
                        field: 'Estatus',
                        title: 'Estatus',
                        sortable: true,
                        align: 'left',
                        formatter: function (value, row, index) {



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
                    },

                    {
                        field: 'PrioridadStr',
                        title: 'Prioridad',
                        align: 'left',
                        sortable: true,

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
                    },

                    {
                        field: 'FechaCreo',
                        title: 'Fecha alta',
                        sortable: true,
                        /*   width: "450px",*/
                        formatter: function (value, row, index) {

                            return (value == null || value == "" ? "" : moment(value).format("YYYY/MM/DD"))

                        }
                    },

                    {
                        field: 'FechaSolicitado',
                        title: 'Fecha objetivo',
                        sortable: true,
                        /*  width: "450px",*/
                        formatter: function (value, row, index) {

                            return (value == null || value == "" ? "" : moment(value).format("YYYY/MM/DD"))

                        }
                    },
                    {
                        field: 'FechaTermino',
                        title: 'Fecha fin',
                        sortable: true,
                        /*  width: "450px",*/
                        formatter: function (value, row, index) {

                            return (value == null || value == "" ? "" : moment(value).format("YYYY/MM/DD"))

                        }
                    }
                ]
            })

            recarga = true;

        }



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



        $("#tasks_assigned").html(data.ActividadesA)
        $("#tasks_progreess").html(data.ActividadesP)
        $("#task_validate").append(data.ActividadesR);
        $("#tasks_re").append(data.ActividadesX);
        $("#tasks_ok").append(data.ActividadesLi);

        var events = JSON.parse(data.Eventos);

        $('#Calendar').fullCalendar('removeEvents');
        $('#Calendar').fullCalendar('addEventSource', events);
        $('#Calendar').fullCalendar('rerenderEvents');

        $("#pComentarios").empty();
        $('#pComentarios').append(data.Comentarios);

        $("#lblcantnot").text(data.TotalComentarios);

        resizeTaskList();

    }
    else {

        MensajeError(data.Mensaje);
    }

}


$(document).on('click', '#BtnEjecutarQ', function (e) {

    FiltrarQuery();
  
    return false;

});

$(document).on('click', '#BtnSaveQ', function (e) {

    if ($("#IdQuery").val() == "0") {

        $('#ModalSaveQ').modal('show');

    }
    else {

        MensajeConfirmarAccion("¿Esta seguro de guardar la consulta?<br/> Lo anterior se sobreescribira", "BtnGuardarQ");


    }

    


    return false;

});


$(document).on('click', '#BtnGuardarQ', function (e) {


    GuardarQuery();

    return false;

});


$(document).on('click', '#BtnDeleteQ', function (e) {

    MensajeConfirmarAccion("¿Esta seguro de eliminar la consulta?<br/>  Si lo elimina ya no podrá visualizarlo ni volver a activarlo", "BtnEliminarQ");
    return false;

});
$(document).on('click', '#BtnEliminarQ', function (e) {


    EliminarQuery();

    return false;

});


$(document).on('click', '#BtnNuevoQ', function (e) {


    var url = "/Querys/q";
    window.open(url, '_self');
    return false;

});


$(document).on('click', '#BtnFilterQ', function (e) {


    if ($("#mdContQ").hasClass("col-md-10")) {
        //$("#mdFiltros").hide("slide", { direction: "left" }, 500);


        $("#mdFiltros").hide("slow");
        $("#spFilters").removeClass("fa-dedent").addClass("fa-indent");
        setTimeout(function () {
            $("#mdContQ").addClass("col-md-12");
            $("#mdContQ").removeClass("col-md-10");
            $("#mdFiltros").removeClass("col-md-2");
        
        }, 800);
       
    }
    else {
        $("#mdContQ").removeClass("col-md-12");
      
        $("#mdContQ").addClass("col-md-10");
        $("#mdFiltros").addClass("col-md-2");
        $("#spFilters").removeClass("fa-indent").addClass("fa-dedent");
        $("#mdFiltros").show("slow");

    }
    $("#mdFiltros").toogle();

});


$(document).on('click', '#BtnShareQ', function (e) {


 

    ConsultaQueryCompartir();
    $('#ModalShareQ').modal('show');

});


$(document).on('click', '#btnshareqe', function (e) {


    e.preventDefault();


    const textToCopy = $('#TxtUrlShareQE').text();
    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            console.log(`Copied "${textToCopy}" to clipboard`);
        })
        .catch((err) => {
            console.error('Could not copy text: ', err);
        });


    MensajeExito("Se ha copiado al portapapeles");

});


$(document).on('click', '#btnshareqi', function (e) {


    e.preventDefault();


    const textToCopy = $('#TxtUrlShareQI').text();
    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            console.log(`Copied "${textToCopy}" to clipboard`);
        })
        .catch((err) => {
            console.error('Could not copy text: ', err);
        });



    MensajeExito("Se ha copiado al portapapeles");


});


$(document).on('click', '#BtnGuardarCompartirQ', function (e) {


    GuardarCompartirQuery();

    return false;

});


$('#BtnExportarQ').click(e => {
    e.preventDefault();

    let formData = new FormData();


    formData.append("IdQuery", $("#IdQuery").val());

    DOWNLOAD('/Querys/Exportar', 'Actividades.xlsx', formData, true);

});



async function GuardarQuery() {


  
    if ($("#TxtNombreQ").val().trim() == "" && $("#IdQuery").val() == "0") {
        MensajeAdvertencia("Debe ingresar un nombre");
        return false;
    }
 
        var Filtros = {
            LstProyecto: $('#SelProyectoQ').val(),
            FechaSolIni: ($("#TxtRangoFechasQ").val()).split('-')[0],
            FechaSolFin: ($("#TxtRangoFechasQ").val()).split('-')[1],
            FechaCreoIni: ($("#TxtRangoFechasCreoQ").val()).split('-')[0],
            FechaCreoFin: ($("#TxtRangoFechasCreoQ").val()).split('-')[1],
            FechaCierreIni: ($("#TxtRangoFechasTerminoQ").val()).split('-')[0],
            FechaCierreFin: ($("#TxtRangoFechasTerminoQ").val()).split('-')[1],
            LstAsignado: $('#SelUsuarioAsignadoQ').val(),
            LstResponsable: $('#SelUsuarioResponsableQ').val(),
            LstEstatus: $('#SelEstatusQ').val(),
            LstTipoActividad: $('#SelFaseQ').val(),
            LstClasificacion: $('#SelClasificacionQ').val(),
            LstTipo: $('#SelTipoQ').val(),
            LstSprints: $('#SelSprintsQ').val(),
            LstPrioridad: $('#SelPrioridadQ').val(),
            Contiene: $('#TxtContieneQ').val(),

        }

        var Q = {
            IdQuery: $("#IdQuery").val(),
            Nombre: $("#TxtNombreQ").val().trim(),
            Filtros: JSON.stringify(Filtros)
        }


        const data = await POST('/Querys/GuardarQuery', { Q: Q, Filtros: Filtros });

        if (data.Exito) {


            if ($("#IdQuery").val() == "0") {

                var url = "/Querys/q/" + data.IdUnique;
                window.open(url, '_self');
                return false;

            }
            else {
                MensajeExito("Los datos se guardaron correctamente.");

            }
           


        }
        else {

            MensajeAdvertencia(data.Mensaje);
        }
    }
   

async function EliminarQuery() {

    const data = await POST('/Querys/EliminarQuery', { IdQuery: $("#IdQuery").val() });

    if (data.Exito) {

            var url = "/Querys/" ;
            window.open(url, '_self');
            return false;


    }
    else {

        MensajeAdvertencia(data.Mensaje);
    }
}


async function GuardarCompartirQuery() {


    const data = await POST('/Querys/GuardarQueryCompartir', { IdQuery: $("#IdQuery").val(), LstUsuarios: $('#SelUsuariosShareQ').val() });

    if (data.Exito) {

        $('#ModalShareQ').modal('hide');
        MensajeExito("Los datos se guardaron correctamente.");

    }
    else {

        MensajeError(data.Mensaje);
    }

}

async function ConsultaQueryCompartir() {


    const data = await POST('/Querys/ConsultaQueryCompartir', { IdQuery: $("#IdQuery").val() });

    if (data.Exito) {

        var dso = JSON.parse(data.LstCompartir);

        //var urli = window.location.host + $("#urlSharedQE").val() + "/" + $('#IdUnique').val();
        var urli = window.location.host + $("#urlSharedQI").val() + "/" + $('#IdUnique').val();


        $("#TxtUrlShareQE").text(urli.replace("/q/", "/s/" + data.Organizacion +  "/") );
        $("#TxtUrlShareQI").text(urli);


        $('#SelUsuariosShareQ').val(dso);
        $('#SelUsuariosShareQ').selectpicker('refresh');

    }
    else {

        MensajeError(data.Mensaje);
    }

}




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

            AbrirModalCapturaTiempoQ(item);

        }
        if (this.id == "tasks_progreess") {
            var item = $(ui).attr('item')[0].id;
            ui.item.removeClass("task-info");
            ui.item.removeClass("task-validate");
            ui.item.removeClass("task-danger");
            ui.item.addClass("task-progreess");
            ActualizaEstatusQ(item, 'P');

        }
        if (this.id == "tasks_assigned") {
            var item = $(ui).attr('item')[0].id;

            ui.item.removeClass("task-validate");
            ui.item.removeClass("task-danger");
            ui.item.removeClass("task-progreess");
            ui.item.addClass("task-info");
            ActualizaEstatusQ(item, 'A');


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
            FiltrarQuery();
        }
        page_content_onresize();
    }
}).disableSelection();

function ActualizaEstatusQ(IdActividad, Estatus) {

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
                FiltrarQuery();
            }

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error al realizar la consulta, intente de nuevo.");
        }
    });


}


function AbrirModalCapturaTiempoQ(IdActividad) {

    $("#IdActividadCT").val(IdActividad);
    $('#TituloRec').text("Capturar fecha fin de actividad #" + IdActividad);
    var date = new Date();
    $('#TxtFinActividad').datetimepicker(
        {
            format: 'DD/MM/YYYY',
            maxDate: date
        });

    $('#ModalCapturarTiempo').on('hidden.bs.modal', function () {

        FiltrarQuery();
        $(this).off('hidden.bs.modal');

    });

    $('#ModalCapturarTiempo').modal({ keyboard: false });

    return false;

}





