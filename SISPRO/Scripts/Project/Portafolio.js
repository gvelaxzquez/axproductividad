

var dsProyectos = [];

var sprints;
var tablaProyectos;
var clave;
var recarga = false;
var $table = $('#tblProyectos');

var columnasProyectos = [
    {
        "class": "text-left",
        "render": function (data, type, row) {
            return '<a style="cursor:pointer" href="#" onclick="VerProyecto(' + "'" + row.Clave + "'" + ')" >' + row.Clave + '</a>'
        }
    },
    {
        "data": "Nombre",
        "class": "text-left"
    },
    {
        "data": "AvanceCompPorc",
        "class": "text-center",
        "render": function (data, type, row) {

       
            return ' <span class="btn btn-info btn-small"  style="width:100%;text-align:right;">' + $.number(row.AvanceCompPorc, '2', '.', ',') + '</span>';

   
        }
    },
    {

        "class": "text-center",
        "render": function (data, type, row) {

            if (row.Semaforo =="green") {

                return ' <span class="btn btn-success btn-small" title=" El proyecto esta a tiempo"  style="width:100%;text-align:right;">' + $.number(row.AvanceRealPorc, '2', '.', ',') + '%</span>';

            }
            else if (row.Semaforo == "Red") {

                return ' <span class="btn btn-danger btn-small" title=" El proyecto tiene un desfase del ' + row.DesfaseProc + '%" style="width:100%;text-align:right;">' + $.number(row.AvanceRealPorc, '2', '.', ',') + '%</span>';

            }
            else {
                return ' <span class="btn btn-warning btn-small " title=" El proyecto tiene un desfase del ' + row.DesfaseProc + '%"    style="width:100%;text-align:right;">' + $.number(row.AvanceRealPorc, '2', '.', ',') + '%</span>';

            }

        }
    },
    {
        "class": "text-center",
        "data": "IdULiderStr",
        "render": function (data, type, row) {
            return '<img class="img-dt" title="' + row.Lider + '" src="http://app.yitpro.com/Archivos/Fotos/' + data + '.jpg"  alt="' + data + '" style="width:40px; height:40px;cursor:pointer;">'


        }
    },

];
var dsCargaTrabajo = [];
var tablaCargaTrabajo;
var columnasCargaTrabajo = [
    {
        "class": "text-center",
        "data": "NumEmpleado",
        "render": function (data, type, row) {
            return '<img class="img-dt" title="' + row.CveRecurso + '" src="http://app.yitpro.com/Archivos/Fotos/' + data + '.jpg"  alt="' + data + '" style="width:40px; height:40px;cursor:pointer;">'


        }
    },
    {
        "data": "NombreCompleto",
        "class": "text-left",
        "render": function (data, type, row) {
            return '<a style="cursor:pointer;" onclick="ConsultaPerfil(' + row.IdUsuario + ')"> <h4 style="margin-top:5px;"> ' + data + '</h4></a>'


        }
    },
    //{
    //    "data": "Nivel",
    //    "class": "text-left"
    //},
    //{
    //    "data": "EstandarDiario",
    //    "class": "text-right"
    //},
    {
        "data": "CantActividades",
        "class": "text-center"
    },
    {
        "data": "HorasDisponibles",
        "class": "text-right"
    },
    {
        "data": "HorasAsignadas",
        "class": "text-right"
    },
    {

        "class": "text-right",
        "render": function (data, type, row) {

            if (row.PorcOcupacion < 50) {

                return '<button class="btn btn-danger btn-small "   style="width:100%;text-align:right;">' + $.number(row.PorcOcupacion, '2', '.', ',') + '%</button>';

            }
            else if (row.PorcOcupacion > 90 && row.PorcOcupacion <= 110) {

                return '<button class="btn btn-success btn-small "   style="width:100%;text-align:right;">' + $.number(row.PorcOcupacion, '2', '.', ',') + '%</button>';

            }
            else if (row.PorcOcupacion > 110) {

                return '<button class="btn btn-danger btn-small "   style="width:100%;text-align:right;">' + $.number(row.PorcOcupacion, '2', '.', ',') + '%</button>';

            }
            else {
                return '<button class="btn btn-warning btn-small " style="width:100%;text-align:right;">' + $.number(row.PorcOcupacion, '2', '.', ',') + '%</button>';

            }

        }

    }
];


var dsQuerys;
var dsQuerysC;
var recarga = false;
var $tableQuerys = $('#TbQuerysM');
var $tableQuerysC = $('#TbQuerysC');


$(document).ready(function () {

    $(".filter-settings-icon").on("click", function () {
        $(".filter-settings").toggleClass("active");
    });
    CargarPortafolio();
    CargarSprints();

});

async function CargarPortafolio() {

    var url = $('#urlCargarPortafolio').val();

     $.ajax({
        url: url,
        data: JSON.stringify({ IdUsuario: $('#SelResponsablePortafolio').val() }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {
            if (data.Exito) {


                if ($('#SelResponsablePortafolio').val() == -1) {
                    $("#hTitle").text("Portafolio" );
                }
                else {

                    $("#hTitle").text("Portafolio - " + $("#SelResponsablePortafolio option:selected").text());
                }


                var dsDatos = jQuery.parseJSON(data.Indicadores);
                $('#wProyectos').text(dsDatos.Proyectos);
                $('#PATiempo').text(dsDatos.PATiempo);
                $('#PAtrasados').text(dsDatos.PAtrasados);


                $('#wSprints').text(dsDatos.Sprints);
                $('#SAbiertos').text(dsDatos.SAbiertos);
                $('#SProgreso').text(dsDatos.SProgreso);
                $('#STerminados').text(dsDatos.STerminados);

                $('#wMilestones').text(dsDatos.Milestones);
                $('#MAbiertos').text(dsDatos.MAbiertos);
                $('#MTerminados').text(dsDatos.MCompletados);
         
                $('#wIssues').text(dsDatos.Issues);



                $('#wProductividad').text(dsDatos.Productividad);
                $('#ProductividadMes').text(dsDatos.ProductividadMes);


                var dsProyectos = jQuery.parseJSON(data.LstProyectos);
                if (recarga) {

                    $table.bootstrapTable('load', dsProyectos);
                }
                else {
                    $table.bootstrapTable({

                        data: dsProyectos,
                        idField: 'IdProyecto',
                        search: true,
                        columns: [
                            {
                                field: 'Nombre',
                                title: 'Proyecto',
                                sortable: true,
                                align: 'left',
                                width: "350px",
                                formatter: function (value, row, index) {
                                    return '<a style="color: #337ab7" class="btn btn-link" onclick="VerProyecto(' + "'" + row.Clave + "'" + ')">' + row.Clave + " " + value + '</a>' +
                                        '<span  class="fa fa-fw fa-circle text-progress" title= "' + row.EstatusIdStr + '"></span><br>';
                                //        `<img src=" https://app.yitpro.com/Archivos/Fotos/${row.IdULiderStr}.jpg" class="avatar" /><span> ${row.Lider}</span>`;
                                }
                              },

                            //{
                            //    field: 'IdClienteStr',
                            //    title: 'Cliente',
                            //    sortable: true,
                            //    align: 'left',
                            //    width: "200px"
                            //},
                            //{
                            //    field: 'Estatus',
                            //    title: 'Estatus',
                            //    sortable: true,
                            //    align: 'left',
                            //    /*     width: "300px",*/
                            //    formatter: function (value, row, index) {

                            //        if (value == 'P') {

                            //            return '<span  class="fa fa-fw fa-circle text-info "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left; width:70px;"><span>' + row.EstatusIdStr + '<span>';

                            //        }
                            //        else if (value == 'E') {
                            //            return '<span  class="fa fa-fw fa-circle text-progress "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left;width:70px;"><span>' + row.EstatusIdStr + '<span>';

                            //        }
                            //        else if (value == 'C') {
                            //            return '<span  class="fa fa-fw fa-circle text-warning "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left;width:70px;"><span>' + row.EstatusIdStr + '<span>';

                            //        }
                            //        else if (value == 'D') {
                            //            return '<span  class="fa fa-fw fa-circle text-danger "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left; width:70px;"><span>' + row.EstatusIdStr + '<span>';

                            //        }
                            //        else if (value == 'L') {
                            //            return '<span  class="fa fa-fw fa-circle text-success "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left; width:70px;"><span>' + row.EstatusIdStr + '<span>';

                            //        }
                            //        else if (value == 'X') {
                            //            return '<span  class="fa fa-fw fa-circle text-muted "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left;width:70px;"><span>' + row.EstatusIdStr + '<span>';
                            //        }
                            //    }

                            //},


                            {
                                field: 'AvanceCompPorc',
                                title: 'Avance',
                                sortable: true,
                                align: 'left',
                                width: "250px",
                                formatter: function (value, row, index) {

                                    return '<h5 class="no-margins font-extra-bold" id=""> ' + row.AvanceCompPorc + '% </h5>  <p>Plan</p>' +
                                           '<h5 class="no-margins font-extra-bold" id=""> ' + row.AvanceRealPorc + '% </h5>  <p>Actual</p>'

                                /*    return value + "%";*/
                                }

                            },
                            //{
                            //    field: 'AvanceRealPorc',
                            //    title: 'Actual',
                            //    sortable: true,
                            //    align: 'right',
                            //    formatter: function (value, row, index) {
                            //        return value + "%";
                            //    }

                            //},
                            //{
                            //    field: 'DesfaseProc',
                            //    title: 'Desfase',
                            //    sortable: true,
                            //    align: 'right',
                            //    formatter: function (value, row, index) {
                            //        return value + "%";
                            //    }

                            //},
                            {
                                field: 'FechaInicioPlan',
                                title: 'Fechas',
                                sortable: true,
                                align: 'left',
                                width: "250px",
                                formatter: function (value, row, index) {

                                    return '<h5 class="no-margins font-extra-bold" id=""> ' + (row.FechaFinComprometida == null || row.FechaFinComprometida == "" ? "<b>Sin fecha</b>" : moment(row.FechaFinComprometida).format("DD/MM/YYYY")) + ' </h5>  <p>Comprometido</p>' +
                                        '<h5 class="no-margins font-extra-bold" id=""> ' + (row.FechaProyectada == null || row.FechaProyectada == "" ? "<b>Sin fecha</b>" : moment(row.FechaProyectada).format("DD/MM/YYYY")) + ' </h5>  <p>Proyectado</p>'

                                  //return '<div class="mx-0 row">'+
                                  //      '<div class="border-all py-3 col-md-3">'+
                                  //    '<h4 class="fw-normal text-600" id="">' + (row.FechaInicioPlan == null || row.FechaInicioPlan == "" ? "<b>Sin fecha</b>" : moment(row.FechaInicioPlan).format("DD/MM/YYYY")) +'</h4>'+
                                  //          '<h5 class="text-500 mb-0">'+
                                  //              'Inicio'+
                                  //          '</h5>'+
                                  //      '</div>'+
                                  //      '<div class="border-all py-3 col-md-3">'+
                                  //    '<h4 class="fw-normal text-600" id="">' + (row.FechaFinPlan == null || row.FechaFinPlan == "" ? "<b>Sin fecha</b>" : moment(row.FechaFinPlan).format("DD/MM/YYYY")) +'</h4>'+
                                  //          '<h5 class="text-500 mb-0">Fin</h5>'+
                                  //      '</div>'+
                                  //      '<div class="border-all py-3 col-md-3">'+
                                  //    '<h4 class="fw-normal text-600" id="">' + (row.FechaFinComprometida == null || row.FechaFinComprometida == "" ? "<b>Sin fecha</b>" : moment(row.FechaFinComprometida).format("DD/MM/YYYY")) +'</h4>'+
                                  //          '<h5 class="text-500 mb-0">Compromiso</h5>'+
                                  //      '</div>'+
                                  //      '<div class="border-all py-3 col-md-3">'+
                                  //    '<h4 class="fw-normal text-600" id="">' + (row.FechaProyectada == null || row.FechaProyectada == "" ? "<b>Sin fecha</b>" : moment(row.FechaProyectada).format("DD/MM/YYYY")) +'</h4>'+
                                  //          '<h5 class="text-500 mb-0">Proyectada</h5>'+
                                  //      '</div>'+
                                  //  '</div>'




                                /*    return (value == null || value == "" ? "" : moment(value).format("DD/MM/YYYY"))*/
                                }


                            },

                            //{
                            //    field: 'FechaFinPlan',
                            //    title: 'Fin plan ',
                            //    sortable: true,
                            //    align: 'center',
                            //    formatter: function (value, row, index) {
                            //        return (value == null || value == "" ? "" : moment(value).format("DD/MM/YYYY"))
                            //    }

                            //},
                            //{
                            //    field: 'FechaFinComprometida',
                            //    title: 'Compromiso ',
                            //    sortable: true,
                            //    align: 'center',
                            //    formatter: function (value, row, index) {
                            //        return (value == null || value == "" ? "" : moment(value).format("DD/MM/YYYY"))
                            //    }

                            //},
                            //{
                            //    field: 'FechaProyectada',
                            //    title: 'Proyectada ',
                            //    sortable: true,
                            //    align: 'center',
                            //    formatter: function (value, row, index) {
                            //        return (value == null || value == "" ? "" : moment(value).format("DD/MM/YYYY"))
                            //    }

                            //},
                            {
                                field: 'Lider',
                                title: 'Lider',
                                sortable: true,
                                align: 'left',
                                formatter: function (value, row, index) {
                                    if (value == "") {

                                        return "";
                                    }
                                    else {

                                        return `<img src="../Archivos/Fotos/${row.IdULiderStr}.jpg" class="img-dt" style="width:50px;height: 50px" /><a class="btn btn-link"> ${value}</a>`
                                    }

                                }
                            }
                        ]
                    });
                    recarga = true;
                }

                var g = jQuery.parseJSON(data.Gantt);

                gantt.config.min_column_width = 70;
                gantt.plugins({
                    export_api: true,
                    tooltip: true
                });

            
                gantt.attachEvent("onGanttReady", function () {
                    var tooltips = gantt.ext.tooltips;
                    tooltips.tooltip.setViewport(gantt.$task_data);
                });
         
                gantt.config.scale_height = 90;

                gantt.config.columns = [

                    { name: "text", label: "Proyecto", tree: true, width: 300, resize: true, min_width: 10 },
                /*    { name: "start_date", label: "Fecha inicio", align: "center", width: 120, resize: true },*/
                 /*   { name: "end_date", label: "Fecha fin", align: "center", width: 120, resize: true },*/
              /*      { name: "avance", label: "avance", align: "right", width: 120, resize: true }*/

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
                            scale_height: 50,
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
                            scale_height: 50,
                            min_column_width: 80,
                            scales: [

                                { unit: "month", step: 1, format: "%F" },
                                { unit: "year", step: 1, format: "%Y" },
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
                            min_column_width: 90,
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


                gantt.templates.task_class = function (start, end, task) {
                    if (task.type == "milestone") {
                        return "milestone"
                    }
                    
                };


                gantt.attachEvent("onTaskDblClick", function (id, e) {



                    const task = gantt.getTask(id);
                    //const resourceGridElement = gantt.utils.dom.closest(e.target, ".gantt_row[data-resource-id]");
                    //if (resourceGridElement) {
                    //    const resourceId = resourceGridElement.dataset.resourceId;
                    //    const store = gantt.getDatastore("resource");
                    //    gantt.message(store.getItem(resourceId).text)
                    //}

                    if (task.type == "milestone") {
                        clickalerta(id);
                    }
                    else if (task.type == "sprint") {
                        VerSprint(id);
                    } else {

                        VerProyecto(task.clave);
                    }

                

                    return true;
                });

                gantt.ext.zoom.init(zoomConfig);
                gantt.ext.zoom.setLevel("year");
                gantt.config.readonly = true;
                gantt.i18n.setLocale("es");
                gantt.init("roadmap");
                gantt.clearAll();
                gantt.parse({
                    data: g
                });




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


async function CargarSprints() {


    const data = await POST('/Proyectos/ConsultarSprintsUsuario', { IdUsuario: $('#SelResponsablePortafolio').val() });

    if (data.Exito) {
        $('#tblSprintDetalle').empty();

         sprints = jQuery.parseJSON(data.Sprints);

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

        page_content_onresize();

    }
    else {

        MensajeError(data.Mensaje);
    }

}





$(document).on('click', '#BtnFiltrarPortafolio', function (e) {

    CargarPortafolio();
    CargarSprints();

    $(".filter-settings").toggleClass("active");

});


function VerSprint(IdIteracion) {


    var url = $('#urlSprintReport').val() + "/" + IdIteracion;
    window.open(url, '_blank');


}

function VerProyecto(clave) {



    var url = $('#urlVerProyecto').val() + "/" + clave;
    //var url = $('#urlVerProyecto').val();


    // var url2 = url.replace("Id", nombre);


    window.open(url, '_blank');
    //window.location.href = url;

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
function VerProyListado() {

    $("#DivProyectostabla").show();
    $("#DivProyectosGantt").hide();
    $("#DivProyectos").hide();

}

function VerProyGantt() {
    $("#DivProyectosGantt").show();
    $("#DivProyectostabla").hide();
    $("#DivProyectos").hide();

}

function VerProyMosaico() {
    $("#DivProyectos").show();
    $("#DivProyectostabla").hide();
    $("#DivProyectosGantt").hide();


}

$('#tblProyectos').on('click-cell.bs.table', function (field, value, row, $element) {
    var a = field;

    var dsFiltrado = $.grep(sprints, function (a, b) {

        return a.IdProyecto === $element.IdProyecto;

    });

    $('#tblSprintDetalle').empty();

    if (dsFiltrado.length > 0) {
      

        $.each(dsFiltrado, function (key, value) {


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
    $("#BtnShowAllSprints").show();
    page_content_onresize();


});

function VerTodosSprints() {

    $('#tblSprintDetalle').empty();

 

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

    $("#BtnShowAllSprints").hide();
    page_content_onresize();

}
