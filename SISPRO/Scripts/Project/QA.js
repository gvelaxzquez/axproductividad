
var recarga = false;

var $table = $('#table');

var numV = 1;

$(document).on('change', '#SelProyectoBL', function (e) {

    ConsultaTC();
    return false;

});


async function ConsultaTC() {

    Filtros = {
        IdProyecto: $("#SelProyectoBL").val()

    }
    const data = await POST('/QA/ConsultaBacklogQA', { Filtros: Filtros });

    if (data.Exito) {

        var dsBacklog2 = jQuery.parseJSON(data.LstTC);
        if (recarga) {

            $table.bootstrapTable('load', dsBacklog2);
        }
        else {

            $table.bootstrapTable({

                data: dsBacklog2,
                idField: 'IdActividad',
                toolbar: "#toolbar",
                search: true,
                idtable: "saveId",
                columns: [
                    {
                        field: 'IdActividad',
                        title: '',
                        width: "30",
                        formatter: function (value, row, index) {

                            if (row.TipoId == 4) {
                                return '<div class="btn-group pull-left" >'
                                    + '<button  class="btn btn-grid  dropdown-toggle" data-toggle="dropdown">' +
                                    '<span class="fa fa-plus-circle"></span>' +
                                    '<span class=""></span>'
                                    + '</button>' +
                                    '<ul class="dropdown-menu" role="menu" style="position: relative">' +
                                    //'<li><a href="#" onclick="newItemBL(1,' + value + ' );"> <img src="/Content/Project/Imagenes/task.png" style="height:24px; width:24px;margin-right:4px;" class="pull-left img-dt" alt="Task"> Task</a></li>' +
                                    //'<li><a href="#" onclick="newItemBL(7,' + value + ' );"> <img src="/Content/Project/Imagenes/bug.png" style="height:24px; width:24px;margin-right:4px;" class="pull-left img-dt" alt="Bug"> Bug</a></li>' +
                                    '<li><a href="#" onclick="newItemBL(8,' + value + ' );"> <img src="/Content/Project/Imagenes/testcase.png" style="height:24px; width:24px;margin-right:4px;" class="pull-left img-dt" alt="Test Case"> Test Case</a></li>' +

                                    '</ul></div>';
                            }
                            else if (row.TipoId == 2) {
                                return "<button class='btn btn-grid' title='Agregar HU' onclick='newItemBL(8," + value + ");' style='cursor: pointer;'> <span class='fa fa-plus-circle'></span></button>"

                            }
                            else {

                                return "";
                            }

                        }
                    },

                    {
                        field: 'IdActividadStr',
                        title: '#',
                        width: "130px",
                        formatter: function (value, row, index) {


                            return '<a style="color: #337ab7" class="btn btn-link" onclick="showitemfrombl(' + row.IdActividad + ' )">' + data + '</a>';


                            //return '<img src="/Content/Project/Imagenes/' + row.TipoUrl + '" class="img-dt" title="' + row.TipoNombre + '" style="width:20px; height:20px;" /> <a style="color: #337ab7" class="btn btn-link" onclick="showitemfrombl(' + row.IdActividad + ' )">' + value + '</a>';
                    }
                    },
                    //{
                    //    field: 'TipoNombre',
                    //    title: 'Tipo',
                    //    width: "90px"
                    //},
                    {
                        field: 'BR',
                        title: 'Título',
                        width: "350px"
                        //formatter: function (value, row, index) {
                        //    return ' <img src="/Content/Project/Imagenes/' + row.TipoUrl + '" class="img-dt" title="' + row.TipoNombre + '" style="width:18px; height:18px; margin-left:0px;" />' + data;
                        //    return '<img src="/Content/Project/Imagenes/' + row.TipoUrl + '" class="img-dt" title="' + row.TipoNombre + '" style="width:20px; height:20px;" /> <a style="color: #337ab7" class="btn btn-link" onclick="showitemfrombl(' + row.IdActividad + ' )">' + value + '</a>';

                        //}
                    },
                    //{
                    //    field: 'Estatus',
                    //    title: 'Estatus',
                    //    sortable: true,
                    //    align: 'left',
                    //    formatter: function (value, row, index) {

                    //        if (row.TipoId == 2) {

                    //            return "";
                    //        }
                    //        else {

                    //            if (value == 'A') {

                    //                return '<span  class="fa fa-fw fa-circle text-info "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left; width:90px;"><span>' + row.EstatusStr + '<span>';

                    //            }
                    //            else if (value == 'P') {
                    //                return '<span  class="fa fa-fw fa-circle text-progress "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left;width:90px;"><span>' + row.EstatusStr + '<span>';

                    //            }
                    //            else if (value == 'R' || data == 'V') {
                    //                return '<span  class="fa fa-fw fa-circle text-warning "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left;width:90px;"><span>' + row.EstatusStr + '<span>';

                    //            }
                    //            else if (value == 'X') {
                    //                return '<span  class="fa fa-fw fa-circle text-danger "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left; width:90px;"><span>' + row.EstatusStr + '<span>';

                    //            }
                    //            else if (value == 'L') {
                    //                return '<span  class="fa fa-fw fa-circle text-success "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left; width:90px;"><span>' + row.EstatusStr + '<span>';

                    //            }
                    //            else if (value == 'C') {
                    //                return '<span  class="fa fa-fw fa-circle text-muted "></span> </button><button  class="btn btn-small btn-grid" style="text-align:left;width:90px;"><span>' + row.EstatusStr + '<span>';

                    //            }


                    //        }


                    //    }
                    //},
                    //{
                    //    field: 'ClaveUsuario',
                    //    sortable: true,
                    //    align: 'left',
                    //    title: 'Asignado',
                    //    formatter: function (value, row, index) {
                    //        if (value == "") {

                    //            return "";
                    //        }
                    //        else {

                    //            return `<img src=" https://axsis.yitpro.com/Archivos/Fotos/${value}.jpg" class="img-dt" style="width: 35px; height: 35px" /><a class="btn btn-link"> ${row.AsignadoStr}</a>`
                    //        }

                    //    }
                    //},
                    //{
                    //    field: 'Prioridad',
                    //    title: 'Prioridad',
                    //    sortable: true,
                    //    align: 'center',
                    //},
                    //{
                    //    field: 'Sprint',
                    //    title: 'Sprint',
                    //    sortable: true,
                    //    align: 'left',
                    //}
                ],
                treeShowField: 'BR',
                parentIdField: 'IdActividadR1',
                onPostBody: function () {
                    var columns = $table.bootstrapTable('getOptions').columns

                    if (columns && columns[0][1].visible) {
                        $table.treegrid({
                            treeColumn: 1,
                            initialState: "collapsed",
                            onChange: function () {
                                $table.bootstrapTable('resetView')
                            }
                        })
                    }
                }
            })

            recarga = true;

        }


   




        //var g = jQuery.parseJSON(data.Gantt);

        //gantt.config.min_column_width = 50;


        //gantt.plugins({
        //    tooltip: true
        //});
        //gantt.attachEvent("onGanttReady", function () {
        //    var tooltips = gantt.ext.tooltips;
        //    tooltips.tooltip.setViewport(gantt.$task_data);
        //});

        //gantt.config.scale_height = 90;

        //gantt.config.columns = [
        //    {
        //        name: "avance", label: "", align: "center", width: 70, template: function (obj) {


        //            return `<img src="/Content/Project/Imagenes/${obj.avance}" title="${obj.asignadostr}" class="img-dt" style="width: 24px; height: 24px" />`;

        //        }
        //    },
        //    { name: "text", label: "Actividad", tree: true, width: 250, resize: true, min_width: 10 },
        //    { name: "start_date", label: "Fecha inicio", align: "center", width: 120, resize: true },
        //    { name: "end_date", label: "Fecha fin", align: "center", width: 120, resize: true }


        //];

        //var zoomConfig = {
        //    levels: [
        //        {
        //            name: "day",
        //            scale_height: 27,
        //            min_column_width: 80,
        //            scales: [
        //                { unit: "day", step: 1, format: "%d %M" }
        //            ]
        //        },
        //        {
        //            name: "week",
        //            scale_height: 50,
        //            min_column_width: 50,
        //            scales: [
        //                {
        //                    unit: "week", step: 1, format: function (date) {
        //                        var dateToStr = gantt.date.date_to_str("%d %M");
        //                        var endDate = gantt.date.add(date, -6, "day");
        //                        var weekNum = gantt.date.date_to_str("%W")(date);
        //                        return dateToStr(date) + " - " + dateToStr(endDate);
        //                    }
        //                },
        //                { unit: "day", step: 1, format: "%j" }
        //            ]
        //        },
        //        {
        //            name: "month",
        //            scale_height: 50,
        //            min_column_width: 80,
        //            scales: [

        //                { unit: "month", step: 1, format: "%F" },
        //                { unit: "year", step: 1, format: "%Y" },
        //                { unit: "day", format: "%j %M" }

        //            ]
        //        },
        //        {
        //            name: "quarter",
        //            height: 50,
        //            min_column_width: 90,
        //            scales: [
        //                { unit: "month", step: 1, format: "%M" },
        //                {
        //                    unit: "quarter", step: 1, format: function (date) {
        //                        var dateToStr = gantt.date.date_to_str("%M");
        //                        var endDate = gantt.date.add(gantt.date.add(date, 3, "month"), -1, "day");
        //                        return dateToStr(date) + " - " + dateToStr(endDate);
        //                    }
        //                }
        //            ]
        //        },
        //        {
        //            name: "year",
        //            scale_height: 50,
        //            min_column_width: 30,
        //            scales: [
        //                { unit: "year", step: 1, format: "%Y" },
        //                { unit: "month", format: "%F" }
        //            ]
        //        }
        //    ]
        //};


        //gantt.templates.task_class = function (start, end, task) {


        //    if (task.progress >= 1) {
        //        return "bg-success"

        //    }

        //};


        //gantt.ext.zoom.init(zoomConfig);
        //gantt.ext.zoom.setLevel("month");


        //gantt.config.readonly = true;
        //gantt.i18n.setLocale("es");

        //gantt.init("roadmap");
        //gantt.clearAll();
        //gantt.parse({
        //    data: g

        //});

    }
    else {

        MensajeError(data.Mensaje);
    }

}

function ExpandCollappse(tipo) {

    $('#table').treegrid(tipo);


    /*    $table.bootstrapTable(tipo);*/
}


//function zoomIn() {
//    gantt.ext.zoom.zoomIn();
//}
//function zoomOut() {
//    gantt.ext.zoom.zoomOut()
//}

//function CambiarZoom(zoom) {
//    gantt.ext.zoom.setLevel(zoom);
//}


