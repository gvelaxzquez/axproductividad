var recarga = false;
var recarga2 = false;
var $table = $('#table');
var $tblMatriz = $('#tblMatriz');
var numV = 1;

var dsDetalle;
var dsBacklog2;

$(document).ready(function () {

    MostrarOcultarFiltrosM();


});



$(document).on('change', '#SelProyectoBL', function (e) {

    ConsultaBacklog();

    if ($("#liData").hasClass("active")) {
        ConsultaGraficasBacklog();
    }


    if ($("#liMatriz").hasClass("active")) {
        ConsultaMatriz();
    }

    if ($("#liMatriz2").hasClass("active")) {
        ConsultaMatriz2();
    }
    if ($("#liSprint").hasClass("active")) {
        CargarSprints();
    }



    $(".headerwi").show();
    return false;

});

$(document).on('change', '#SelTipoBL', function (e) {

    ConsultaBacklog();

    $('#SelTipoSaveF').val($('#SelTipoBL').val());
    $('#SelTipoSaveF').selectpicker('refresh');

    if ($("#liData").hasClass("active")) {
        ConsultaGraficasBacklog();

    }
    return false;

});

$(document).on('click', '#BtnRecargarBL', function (e) {

    ConsultaBacklog();

    return false;
});



async function ConsultaBacklog() {

    Filtros = {
        Tipo: $("#SelTipoBL").val(),
        IdProyecto: $("#SelProyectoBL").val()

    }
    const data = await POST('/BackLog/ConsultaBacklog', { Filtros: Filtros });

    if (data.Exito) {

        dsBacklog2 = jQuery.parseJSON(data.LstBacklog2);
        $("#LastWI").val(data.Last);
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
                        title: '<div class="btn-group"><button   class="btn btn-grid btn-condensed" onclick="ExpandCollappse(' + "'" + 'collapseAll' + "'" + ');"><i class="fa fa-minus"></i></button> <button  class="btn btn-grid btn-condensed"  onclick="ExpandCollappse(' + "'" + 'expandAll' + "'" +  ');"><i class="fa fa-plus"></i></button></div>',
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
                            else if (row.TipoId == 2 ) {

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
                                    return " <div class='btn-group'> <button class='btn btn-grid btn-condensed' style='padding:8px;'  title='Agregar epic' onclick='NewItemFromBLF(2," + value  + " );' style='cursor: pointer;'> <span class='fa fa-plus-circle'></span></button> " +
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

                            return '<a style="color: #337ab7" class="btn btn-link" onclick="showitemfrombl(' + row.IdActividad + ' )">' + value + '</a>' ;

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

            recarga = true;

        }
     

    
        var g = jQuery.parseJSON(data.Gantt);

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
            data: g

        });

    }
    else {

        MensajeError(data.Mensaje);
    }

}

function ExpandCollappse (tipo) {

    $('#table').treegrid(tipo);

}
function ExpandCollappse2(tipo) {

    $('#tblMatriz').treegrid(tipo);

}

async function ConsultaGraficasBacklog() {


    const data = await POST('/BackLog/ConsultaGraficasBacklog', { IdProyecto: $("#SelProyectoBL").val() });

    if (data.Exito) {

        var dsDatos = jQuery.parseJSON(data.LstGraficas);

        $('#Grafica').empty();

        $('#scripts').empty();

        $.each(dsDatos, function (key, value) {


            var id = value.id;
            var nombre = value.Nombre;
            var tipo = "Pie";
            var series = value.Series;
            /*     var columnas = value.LstColumnas;*/
            var valores = value.LstValores;
            /*   var tabla = value.Tabla;*/
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


                $('#Grafica').append(grafica);
                $('#scripts').append(script);

            }

            numV = numV + 1;

        });
    }
    else {

        MensajeError(data.Mensaje);
    }

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


$('#show-epic-div').click(() => {
    if ($('#epic-div').hasClass('hidden')) {
        $('#epic-div').removeClass('hidden');
        //var url = window.location.host + "/" + $("#urlSharedAct").val() + "/" + $('#IdActividad').val();
        $("#TxtNewEpic").val("");

        var idemoji = $("#TxtNewEpic").attr('data-id');
        $("div[data-id='" + idemoji + "'][data-type='input']").text('');

    }
    else
        $('#epic-div').addClass('hidden')
});

$('#hide-epic-div').click(() => {
    $('#epic-div').addClass('hidden')
});


function MoveItemBL(TipoId, TipoMov, IdActividad) {


    const data = POST('/BackLog/MoverOrdenBL', { IdActividad: IdActividad, IdProyecto: $("#SelProyectoBL").val(), TipoId: TipoId, TipoMov: TipoMov });



    ConsultaBacklog();
}



$(document).on('click', '#BtnSaveEpic', function (e) {

    if ($("#TxtNewEpic").val().trim() != "") {

        GuardarEpica();
    }
    else {

        MensajeAdvertencia("Ingrese el título.");
    }
   
    return false;
});



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
            HorasFacturables:0,
            HorasAsignadas:0,
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



async function ConsultaMatriz() {


    const data = await POST('/BackLog/ConsultaMatrizRastreo', { IdProyecto: $("#SelProyectoBL").val() });

    if (data.Exito) {

        var dsHUS = jQuery.parseJSON(data.LstHUS);
        dsDetalle = jQuery.parseJSON(data.LstDetalles);

        if (recarga2) {

            $tblMatriz.bootstrapTable('load', dsHUS);

        }
        else {

            $tblMatriz.bootstrapTable({
                data: dsHUS,
                idField: 'IdActividad',
                /*     toolbar: "#toolbar",*/
                search: true,
                idtable: "saveId",
                columns: [
                    {
                        field: 'BR',
                        title: '<div class="btn-group"><button   class="btn btn-grid btn-condensed" onclick="ExpandCollappse2(' + "'" + 'collapseAll' + "'" + ');"><i class="fa fa-minus"></i></button> <button  class="btn btn-grid btn-condensed"  onclick="ExpandCollappse2(' + "'" + 'expandAll' + "'" + ');"><i class="fa fa-plus"></i></button></div>',
                        width: "20%",
                        formatter: function (value, row, index) {

                            if (row.IdActividadR1 > 0) {

                                var d = $.grep(dsDetalle, function (a, b) {
                                    return a.IdActividadR1 === row.IdActividadR1 && a.TipoActividadStr == "AYD";
                                });
                                if (d.length > 0) {
                                    var li = '<div class="list-group list-group-contacts border-bottom push-down-10">';
                                    $.each(d, function (key, v) {
                                        li += '<a class="list-group-item" onclick="showitemfrombl(' + v.IdActividad + ' )"> <div class="list-group-status  ' + v.EstatusStr + '"></div > ' +
                                            '<img style="width:50px; height:50px;" src="https://app.yitpro.com/Archivos/Fotos/' + v.AsignadoStr + '.jpg" class="pull-left" alt = "' + v.AsignadoStr + '" title="' + v.AsignadoStr + '">' +
                                            '<span class="contacts-title"> ' + v.IdActividadStr + '</span> ' +
                                            '<p> ' + v.BR + '</p> ' +
                                            '</a> ';

                                    });
                                    li += '</div>';
                                    return li;
                                }
                                else {
                                    return value;
                                }
                            }
                            else {
                                return value;

                            }

                        }
                    
                    },
                    {
                        field: 'IdActividadR1',
                        title: 'Diseño',
                        width: "20%",
                        formatter: function (value, row, index) {

                            if (row.IdActividadR1 > 0) {

                                var d = $.grep(dsDetalle, function (a, b) {
                                    return a.IdActividadR1 === value && a.TipoActividadStr == "DIS";
                                });
                                if (d.length > 0) {
                                    var li = '<div class="list-group list-group-contacts border-bottom push-down-10">';
                                    $.each(d, function (key, v) {
                                        li += '<a class="list-group-item" onclick="showitemfrombl(' + v.IdActividad + ' )"> <div class="list-group-status  ' + v.EstatusStr + '"></div > ' +
                                            '<img style="width:50px; height:50px;" src="https://app.yitpro.com/Archivos/Fotos/' + v.AsignadoStr + '.jpg" class="pull-left" alt = "' + v.AsignadoStr + '" title="' + v.AsignadoStr + '">' +
                                            '<span class="contacts-title"> ' + v.IdActividadStr + '</span> ' +
                                            '<p> ' + v.BR + '</p> ' +
                                            '</a> ';

                                    });
                                    li += '</div>';
                                    return li;
                                }
                                else {
                                    return "";
                                }
                            }
                            else {
                                return "";

                            }

                        }
                    },
                    {
                        field: 'IdActividadR1',
                        title: 'Desarrollo',
                        width: "20%",
                        formatter: function (value, row, index) {

                            if (row.IdActividadR1 > 0) {

                                var d = $.grep(dsDetalle, function (a, b) {
                                    return a.IdActividadR1 === value && a.TipoActividadStr == "CON";
                                });
                                if (d.length > 0) {
                                    var li = '<div class="list-group list-group-contacts border-bottom push-down-10">';
                                    $.each(d, function (key, v) {
                                        li += '<a class="list-group-item" onclick="showitemfrombl(' + v.IdActividad + ' )"> <div class="list-group-status  ' + v.EstatusStr + '"></div > ' +
                                            '<img style="width:50px; height:50px;" src="https://app.yitpro.com/Archivos/Fotos/' + v.AsignadoStr + '.jpg" class="pull-left" alt = "' + v.AsignadoStr + '" title="' + v.AsignadoStr + '">' +
                                            '<span class="contacts-title"> ' + v.IdActividadStr + '</span> ' +
                                            '<p> ' + v.BR + '</p> ' +
                                            '</a> ';

                                    });
                                    li += '</div>';
                                    return li;
                                }
                                else {
                                    return "";
                                }
                            }
                            else {
                                return "";

                            }

                        }
                    },
                    {
                        field: 'IdActividadR1',
                        title: 'Calidad',
                        width: "20%",
                        formatter: function (value, row, index) {

                            if (row.IdActividadR1 > 0) {

                                var d = $.grep(dsDetalle, function (a, b) {
                                    return a.IdActividadR1 === value && a.TipoActividadStr == "QA";
                                });
                                if (d.length > 0) {
                                    var li = '<div class="list-group list-group-contacts border-bottom push-down-10">';
                                    $.each(d, function (key, v) {
                                        li += '<a class="list-group-item" onclick="showitemfrombl(' + v.IdActividad + ' )"> <div class="list-group-status  ' + v.EstatusStr + '"></div > ' +
                                          /*  '<img style="width:50px; height:50px;" src="https://app.yitpro.com/Archivos/Fotos/' + v.AsignadoStr + '.jpg" class="pull-left" alt = "' + v.AsignadoStr + '" title="' + v.AsignadoStr + '">' +*/
                                            '<span class="contacts-title"> ' + v.IdActividadStr + '</span> ' +
                                            '<p> ' + v.BR + '</p> ' +
                                            '</a> ';

                                    });
                                    li += '</div>';
                                    return li;
                                }
                                else {
                                    return "";
                                }
                            }
                            else {
                                return "";

                            }



                        }
                    },
            
                    {
                        field: 'IdActividadR1',
                        title: 'Bugs',
                        width: "20%",
                        formatter: function (value, row, index) {

                            if (row.IdActividadR1 > 0) {

                                var d = $.grep(dsDetalle, function (a, b) {
                                    return a.IdActividadR1 === value && a.TipoActividadStr == "BUG";
                                });
                                if (d.length > 0) {
                                    var li = '<div class="list-group list-group-contacts border-bottom push-down-10">';
                                    $.each(d, function (key, v) {
                                        li += '<a class="list-group-item" onclick="showitemfrombl(' + v.IdActividad + ' )"> <div class="list-group-status  ' + v.EstatusStr + '"></div > ' +
                                            '<img style="width:50px; height:50px;" src="https://app.yitpro.com/Archivos/Fotos/' + v.AsignadoStr + '.jpg" class="pull-left" alt = "' + v.AsignadoStr + '" title="' + v.AsignadoStr + '">' +
                                            '<span class="contacts-title"> ' + v.IdActividadStr + '</span> ' +
                                            '<p> ' + v.BR + '</p> ' +
                                            '</a> ';

                                    });
                                    li += '</div>';
                                    return li;
                                }
                                else {
                                    return "";
                                }
                            }
                            else {
                                return "";

                            }

                        }

                        
                    },

  
                    
                ],
                treeShowField: 'BR',
                parentIdField: 'IdActividadR1',
                onPostBody: function () {
                    var columns = $tblMatriz.bootstrapTable('getOptions').columns

                    if (columns && columns[0][1].visible) {
                        $tblMatriz.treegrid({
                            treeColumn: 0,
                            initialState: "expanded",
                            onChange: function () {
                                $tblMatriz.bootstrapTable('resetView')
                            }
                        })
                    }
                }
            });

            recarga2 = true;

        }

    }
    else {

        MensajeError(data.Mensaje);
    }

}

$(document).on('click', '#BtnImprmirWI', function (e) {




    if (dsBacklog2.length > 0) {

        var url = $('#urlExportWIAll').val() + "?Id=" + $("#SelProyectoBL").val() + "&Id2=" + $("#SelTipoBL").val();
        window.open(url, '_self');
    } else {

        MensajeAdvertencia("No existen registros para imprimir");

    }


    return false;

});




function CargarSprints() {

    ConsultasInicialSprints();

}

function ConsultasInicialSprints() {
    var url = $('#urlCargaSprints').val();

    $.ajax({

        url: url,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ IdProyecto: $('#SelProyectoBL').val(), Estatus: $('#SelEstatusSP').val() }),
        dataType: "json",
        async: true,
        success: successCargaSprints,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
    return false;
}

function successCargaSprints(data) {
    if (data.Exito) {


        $('#tblSprintDetalle').empty();


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




        var g = jQuery.parseJSON(data.Gantt);

        gantt.config.min_column_width = 80;
        gantt.plugins({
            export_api: true,
        });

        //gantt.config.scales = [
        //    { unit: "month", step: 1, format: "%M" },
        //    { unit: "year", step: 1, format: "%Y" },
        //    { unit: "day", format: "%d %M" }
        //];
        //gantt.config.scale_height = 3 * 28;

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
            data: g

        });




        page_content_onresize();


    }
    else {

        MensajeError(data.Mensaje);
    }

}

function VerSprint(IdIteracion) {


    var url = $('#urlSprintReport').val() + "/" + IdIteracion;
    window.open(url, '_blank');


}



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



var columnasMatriz = [
    {
        "data": "Requerimieto",
        "class": "text-center",
    },
    {
        "data": "Epica",
        "class": "text-center",
    },
    {
        "data": "Sprint",
        "class": "text-left",
    },
    {
        "data": "IdActividad",
        "class": "text-right",
        "render": function (data, type, row) {

            return '<a style="color: #337ab7" class="btn btn-link" onclick="clickalerta(' + row.IdActividad + ' )">' + row.IdActividad + '</a>' ;

        }
    },

    {
        "data": "HU",
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
        "data": "Fase",
        "class": "text-left",

    },
    {
        "data": "CveAsignado",
        "class": "text-left",
        "render": function (data, type, row) {

            return `<img src=" https://app.yitpro.com/Archivos/Fotos/${data}.jpg" class="img-dt" style="width: 35px; height: 35px"  title="${row.Asignado}" />`

        }
    },
];


var tableMatrizR;
var tableMatrizE;
var tablaE = false;
var tablaR = false;
async function ConsultaMatriz2() {



    var Filtros = {
        IdProyecto: $("#SelProyectoBL").val(), 
        LstEpicas: $('#SelEpicasMBL').val(),
        LstHUS: $('#SelHuMBL').val(),
        LstEstatus: $('#SelEstatusMBL').val(),
        LstSprints: $('#SelSprintsMBL').val()

    }


    const data = await POST('/BackLog/ConsultaMatrizRastreo2', { Filtros: Filtros });

    if (data.Exito) {

        var dsMatriz = jQuery.parseJSON(data.LstMatriz);

        if (data.Count == 0) {


            $("#tblRequerimiento").hide();
            $("#tblEpica").show();

           

            //if (tablaE) {
            //    $('#tblMatriz_Epica').api().clear().rows.add(dsMatriz).draw();
            //}
            //else {
                tableMatrizE = $('#tblMatriz_Epica').DataTable({
                    columns: columnasMatriz,
                    data: dsMatriz,
                    destroy: true,
                    "columnDefs": [
                        { "width": "40%", "targets": [4] }
                    ],
                    'rowsGroup': [0, 1],
                    lengthMenu: [
                        [50, 100, -1],
                        ['50 ', '100', 'Todo']
                    ],
                });

            //}
           
            tablaE = true;

        }
        else {
            $("#tblEpica").hide();
            $("#tblRequerimiento").show();


           

            tableMatrizR = $('#tblMatriz_Requerimiento').DataTable({
                columns: columnasMatriz,
                data: dsMatriz,
                destroy: true,
                "columnDefs": [
                    { "width": "40%", "targets": [4] }
                ],
                'rowsGroup': [0, 1],
                lengthMenu: [
                    [50, 100, -1],
                    ['50 ', '100', 'Todo']
                ],
            });

            tablaR = true;
        }


 


    }
    else {

        MensajeError(data.Mensaje);
    }

}

$(document).on('click', '#BtnFilterQ', function (e) {


    MostrarOcultarFiltrosM();


});

$(document).on('click', '#BtnFiltrarMBL', function (e) {

    ConsultaMatriz2();

    return false;

});


function MostrarOcultarFiltrosM() {


    if ($("#mdContBL").hasClass("col-md-10")) {
        //$("#mdFiltros").hide("slide", { direction: "left" }, 500);


        $("#mdFiltrosBL").hide("slow");
        $("#spFilters").removeClass("fa-dedent").addClass("fa-indent");
        setTimeout(function () {
            $("#mdCont").addClass("col-md-12");
            $("#mdCont").removeClass("col-md-10");
            $("#mdFiltrosBL").removeClass("col-md-2");

        }, 800);

    }
    else {
        $("#mdContBL").removeClass("col-md-12");

        $("#mdContBL").addClass("col-md-10");
        $("#mdFiltrosBL").addClass("col-md-2");
        $("#spFilters").removeClass("fa-indent").addClass("fa-dedent");
        $("#mdFiltrosBL").show("slow");

    }
}

function CargarFiltrosMBL() {


/*    var url = $('#urlCargaFiltrosMatriz').val();*/

    $.ajax({
        data: JSON.stringify({ IdProyecto: $("#SelProyectoBL").val() }),
        url: '/BackLog/CargaFiltrosMatriz',
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            if (data.Exito) {

                $('#SelEpicasMBL').empty();
                $('#SelEpicasMBL').append(data.LstEpicas);
                $('#SelEpicasMBL').selectpicker('refresh');

                $('#SelHuMBL').empty();
                $('#SelHuMBL').append(data.LstHUS);
                $('#SelHuMBL').selectpicker('refresh');

                $('#SelSprintsMBL').empty();
                $('#SelSprintsMBL').append(data.LstSprints);
                $('#SelSprintsMBL').selectpicker('refresh');


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



