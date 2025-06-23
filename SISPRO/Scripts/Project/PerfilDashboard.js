var numV = 1;
var numV = 1;
var $tableQuerys = $('#TbQuerys');
var $tableBonos = $('#TblBonos');
var recarga = false;
var recarga2 = false;
var recargatabs = false;

var $tableBugs = $('#tblBugs');
var $tableAtrasado = $('#tblAtrasado');
var $tableHoy = $('#tblHoy');
var $tableSemana = $('#tblSemana');

var columnasActividadesDia = [
    {
        "data": "IdActividadStr",
        "class": "text-left",
        "render": function (data, type, row) {
            return '<a style="cursor:pointer" href="#" onclick="showItemCalendarProfile(' + row.IdActividad + ' )" >' + data + '</a>'
        }
    },
    {
        "data": "Descripcion",
        "class": "text-left"
    },

    {
        "data": "HorasAsignadas",
        "class": "text-center",
        "render": function (data, type, row) {
            return $.number(data, '2', '.', ',');
        }
    },

    {
        "data": "HorasFinales",
        "class": "text-center",
        "render": function (data, type, row) {
            return $.number(data, '2', '.', ',');
        }
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
        "data": "Estatus",
        "class": "text-left",
        "render": function (data, type, row) {

            if (row.IdActividadRef > 0) {


                return '<div class="btn-group ">' +
                    '<button type="button" class="btn btn-default " id="" title="Ejecutar caso de prueba" onclick="EjecutarCasoPruebaProfile(' + row.IdActividadRef + ')"><span class="fa fa-play-circle  text-success"></span></button>' +
                    '<button type="button" class="btn btn-default" id="" title="Registrar tiempo" onclick="CapturarTrabajoActProfile(' + row.IdActividad + ')"><span class="fa fa-clock-o"></span></button>' +
                    '</div>'

            }
            else {
                return '<div class="btn-group">' +
                    '<button type="button" class="btn btn-default" id="" title="Registrar tiempo" onclick="CapturarTrabajoActProfile(' + row.IdActividad + ')"><span class="fa fa-clock-o"></span></button>' +
                    '</div>'

            }
 

        }
    }


];



$(document).ready(function () {

    $("#hTitle").hide();

    if ($(".page-sidebar .x-navigation").hasClass("x-navigation-minimized")) {
        $(".page-container").removeClass("page-navigation-toggled");
        x_navigation_minimize("open");
    } else {
        $(".page-container").addClass("page-navigation-toggled");
        x_navigation_minimize("close");
    }

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
        selectable: true,
        eventLimit: true,
        views: {
            month: {
                eventLimit: 6
            }
        },
        select: newItemCalendarProfile,
        eventLimitClick: showDetailDayCalendar,
        eventClick: function (info) {

            if (info.id != -1) {
                showItemCalendarProfile(info.id);
            }
           
        }
    });

    CargarNotificaciones();
    CargarActividadesDP();
    CargarPerformance();
/*    CargarQuerys();*/
    CargaHeatMap();
    CargarBonos();
    onresize();

});

var SelectDayCalendar;
async function showDetailDayCalendar(event) {

    SelectDayCalendar = event;

    var date2 = moment(event.date).format("DD/MM/YYYY");

    const data = await POST('/Actividades/ConsultaActividadesDia', { Fecha: event.date, IdUsuario: $('#IdUsuario').val() });

    if (data.Exito) {

   

        var dsDatos = jQuery.parseJSON(data.LstActividades);


        inicializaTabla($('#TblLstActividadesDia'), dsDatos, columnasActividadesDia, 4, "asc", true, true, true);

        $('#ModalActividadesDia').modal({ keyboard: false });
        $('#ModalActividadesDia').on('hidden.bs.modal', function () {
            CargarActividadesDP();
            $(this).off('hidden.bs.modal');
        });

    }
    else {

        MensajeError(data.Mensaje);
    }

}



async function CargarNotificaciones() {
    const data = await POST('/Dashboard/ConsultaNotificaciones', { IdUsuario: $('#IdUsuario').val() });

    if (data.Exito) {
        $("#pComentarios").empty();
        $('#pComentarios').append(data.Comentarios);

        $("#tNot").text($("#tNot").text() +  "Actividad" );
    }
    else {

        MensajeError(data.Mensaje);
    }

}

async function CargarActividadesDP() {
    const data = await POST('/Dashboard/ConsultaActividades', { IdUsuario: $('#IdUsuario').val() });

    if (data.Exito) {
        var events = JSON.parse(data.Eventos);

        $('#Calendar').fullCalendar('removeEvents');
        $('#Calendar').fullCalendar('addEventSource', events);
        $('#Calendar').fullCalendar('rerenderEvents');

        var dsDatos = jQuery.parseJSON(data.LstGraficas);

        $('#GraficaPDash').empty();

        $('#scriptsPDash').empty();

        $.each(dsDatos, function (key, value) {


            var id = value.id;
            var nombre = value.Nombre;
            var tipo = "Pie";
            var series = value.Series;
            var valores = value.LstValores;
            var idgrafica = "grafica" + numV.toString();
            var vargrafica = "vargrafica" + numV.toString();
            var vartabla = "vartabla" + numV.toString();

            var tema =  "temaEstatusPerformance";


            if (tipo == "Pie") {
                var grafica =
                    //"<div class='col-md-12'>"
                    //+ "     <div class='panel panel-default projectcard'>"
                    //+ "                         <div class='panel-body profile'>"
                    //+ "                             <div class='row headerproyecto''>"
             //       + "                                     <div class='col-md-12'>"
             ///*       + "                                          <h4>" + nombre + " (" + value.Tipo + ")</h4>"*/
             //       + "                                     </div>"
                     "                               <div id='" + idgrafica + "' style='height:300px;' > "
                    + "                                </div>"
                    //+ "                         </div>"
                    //+ "                       </div>"
                    //+ "                 </div>"





                var script = "<script>"
                    + " var " + vargrafica + " = echarts.init(document.getElementById('" + idgrafica + "')," + tema + ");"
                    + "" + vargrafica + ".setOption({ "
                    + "              tooltip: {"
                    + "                   trigger: 'item',"
                    + "                   formatter: '{a} <br/>{b} : {c} ({d}%)'"
                    + "               },"
                    + "              calculable: true,"
                    + "               legend: { "
                    + '                   orient: "horizontal",'
                    + '                   x: "center",'
                    + "                   y: 'top',"
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


                $('#GraficaPDash').append(grafica);
                $('#scriptsPDash').append(script);

            }

            numV = numV + 1;

        });



        var dsBugs = jQuery.parseJSON(data.LstBugs);
        var dsAtrasado = jQuery.parseJSON(data.LstAtrasadas);
        var dsHoy = jQuery.parseJSON(data.LstHoy);
        var dsSemana = jQuery.parseJSON(data.LstSemana);

        $("#lbltotbugs").text(data.BugsT);
        $("#lbltotatras").text(data.AtrasadasT);
        $("#lbltothoy").text(data.HoyT);
        $("#lbltotnext").text(data.SemanaT);



        if (recargatabs) {

            $tableBugs.bootstrapTable('load', dsBugs);
            $tableAtrasado.bootstrapTable('load', dsAtrasado);
            $tableHoy.bootstrapTable('load', dsHoy);
            $tableSemana.bootstrapTable('load', dsSemana);

        }
        else {

            $tableBugs.bootstrapTable({

                data: dsBugs,
                idField: 'IdActividad',
         /*       toolbar: "#toolbarBL",*/
          /*      search: true,*/
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
                        field: 'FechaSolicitado',
                        title: 'Fecha objetivo',
                        sortable: true,
                        /*  width: "450px",*/
                        formatter: function (value, row, index) {

                            return (value == null || value == "" ? "" : moment(value).format("YYYY/MM/DD"))

                        }
                    }
                ]
            })

            $tableAtrasado.bootstrapTable({

                data: dsAtrasado,
                idField: 'IdActividad',
                /*       toolbar: "#toolbarBL",*/
             /*   search: true,*/
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
                        field: 'FechaSolicitado',
                        title: 'Fecha objetivo',
                        sortable: true,
                        /*  width: "450px",*/
                        formatter: function (value, row, index) {

                            return (value == null || value == "" ? "" : moment(value).format("YYYY/MM/DD"))

                        }
                    }
                ]
            })

            $tableHoy.bootstrapTable({

                data: dsHoy,
                idField: 'IdActividad',
                /*       toolbar: "#toolbarBL",*/
            /*    search: true,*/
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
                        field: 'FechaSolicitado',
                        title: 'Fecha objetivo',
                        sortable: true,
                        /*  width: "450px",*/
                        formatter: function (value, row, index) {

                            return (value == null || value == "" ? "" : moment(value).format("YYYY/MM/DD"))

                        }
                    }
                ]
            })

            $tableSemana.bootstrapTable({

                data: dsSemana,
                idField: 'IdActividad',
                /*       toolbar: "#toolbarBL",*/
         /*       search: true,*/
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
                        field: 'FechaSolicitado',
                        title: 'Fecha objetivo',
                        sortable: true,
                        /*  width: "450px",*/
                        formatter: function (value, row, index) {

                            return (value == null || value == "" ? "" : moment(value).format("YYYY/MM/DD"))

                        }
                    }
                ]
            })



            recargatabs = true;

        }



    }
    else {

        MensajeError(data.Mensaje);
    }

}

async function CargarPerformance() {
    const data = await POST('/Dashboard/ConsultaRendimientoHistorico', { IdUsuario: $('#IdUsuario').val() });

    if (data.Exito) {
        var dsDatos = JSON.parse(data.Graficas);

        $('#GraficasPerformance').empty();
        $('#scriptsPerformance').empty();
        $.each(dsDatos, function (key, value) {

            //dsGraficasP.push(value);
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

            var tema = "temagraficas";


                var grafica = "<div class='col-md-6'>"
                    + "     <div class='panel panel-default'>"
                    + "                           <div class='panel-heading'>"
                    + "                               <div class='panel-title-box'>"
                    + "                                  <h3>" + nombre + "</h3>"
                    + "                              </div>"
   
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
                    + "            axisLabel: {"
                    + "                formatter: '{value}'"
                    + "            }"
                    + "        }"
                    + "    ],"
                    + 'series: ' + valores + ''
                    + " });"
                    + "</script>"

            $('#GraficasPerformance').append(grafica);
            $('#scriptsPerformance').append(script);
            



            numV = numV + 1;

        });

    }
    else {

        MensajeError(data.Mensaje);
    }

}
//async function CargarQuerys() {

//    const data = await POST('/Querys/ConsultaQuerysUsuario', { IdUsuario: $('#IdUsuario').val() });

//    if (data.Exito) {

//        dsQuerys = jQuery.parseJSON(data.LstQuerys);

//        if (recarga) {

//            $tableQuerys.bootstrapTable('load', dsQuerys);
//        }
//        else {

//            $tableQuerys.bootstrapTable({
//                data: dsQuerys,
//                idField: 'IdQuery',
//                idtable: "saveId",
//                columns: [
//                    {
//                        field: 'Nombre',
//                        title: 'Id',
//                        align: 'left',
//                        sortable: true,
//                        formatter: function (value, row, index) {
//                            return '<a style="color: #337ab7" class="btn btn-link" onclick="VerQuery(' + "'" + row.IdUnique + "'" + ' )">' + value + '</a>';
//                        }
//                    },
//                ]
//            });

//            recarga = true;
//        }
//    }
//    else {

//        MensajeError(data.Mensaje);
//    }

//}
async function CargarBonos() {

    const data = await POST('/Dashboard/ConsultaHistoricoBonos', { IdUsuario: $('#IdUsuario').val() });

    if (data.Exito) {

        var dsBonos = jQuery.parseJSON(data.Bonos);

        if (recarga2) {

            $tableBonos.bootstrapTable('load', dsBonos);
        }
        else {

            $tableBonos.bootstrapTable({
                data: dsBonos,
                idField: 'AnioMes',
                idtable: "saveId",
                columns: [
                    {
                        field: 'MesAnio',
                        title: 'Periodo',
                        align: 'center',
                        sortable: false,
                   
                    },
                    {
                        field: 'ProductividadTotal',
                        title: 'Productividad',
                        align: 'right',
                        sortable: false,
                        formatter: function (value, row, index) {
                            return  value +  "%"
                        }
                    }
                    //{
                    //    field: 'Bono',
                    //    title: 'Bono',
                    //    align: 'right',
                    //    sortable: false,
                    //    formatter: function (value, row, index) {
                    //        return "$ " + $.number(value, '2', '.', ',');
                    //    }
                    //},
                ]
            });

            recarga2 = true;
        }
    }
    else {

        MensajeError(data.Mensaje);
    }

}

//function VerQuery(IdUnique) {

//    var url = "/Querys/q/" + IdUnique;
//    window.open(url, '_blank');
//    return false;
//}

async function CargaHeatMap() {
    const data = await POST('/Dashboard/ConsultaHeatMap', { IdUsuario: $('#IdUsuario').val() });

    if (data.Exito) {

        var capturas = JSON.parse(data.Capturas);
        var valorganado = JSON.parse(data.ValorGanado);

        var trabajado = JSON.parse(data.Trabajado);

        var date = new Date(new Date().getFullYear(), 11, 31)


        $('#heatmaptrabajado').glanceyear(trabajado, {
            /*      eventClick: function (e) { MensajeExito('Fecha: ' + e.date + ', Capturas:' + e.count); },*/
            eventClick: function (e) { ConsultaTrabajadoDiaP(e.date) },
            months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            weeks: ['M', 'T', 'W', 'T', 'F'],
            targetQuantity: '.glanceyear-quantity',
            tagId: 'glanceyear-svgTag',
            showToday: true,
            today: date
        });


        $('#heatmapcaptura').glanceyear(capturas, {
      /*      eventClick: function (e) { MensajeExito('Fecha: ' + e.date + ', Capturas:' + e.count); },*/
            eventClick: function (e) { ConsultaTrabajoCapturadoDiaP(e.date)},
            months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            weeks: ['M', 'T', 'W', 'T', 'F'],
            targetQuantity: '.glanceyear-quantity',
            tagId: 'glanceyear-svgTag',
            showToday: true,
            today: date
        });
   
        $('#heatmapvg').glanceyear(valorganado, {
            eventClick: function (e) { ConsultaValorGanadDiaP(e.date) },
            months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            weeks: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
            targetQuantity: '.glanceyear-quantity',
            tagId: 'glanceyear-svgTag',
            showToday: true,
            today: date
        });

    }
    else {

        MensajeError(data.Mensaje);
    }
}



$(document).on('click', '#BtnVerTrabajado', function (e) {

    $("#BtnVerTrabajado").removeClass("btn-default");
    $("#BtnVerTrabajado").addClass("btn-info");


    $("#BtnVerValorGanado").removeClass("btn-info");
    $("#BtnVerValorGanado").addClass("btn-default");



    $("#BtnVerCapturas").removeClass("btn-info");
    $("#BtnVerCapturas").addClass("btn-default");


    $("#heatmaptrabajado").show();
    $("#heatmapcaptura").hide();

    $("#heatmapvg").hide();

    return false;
});


$(document).on('click', '#BtnVerCapturas', function (e) {

    $("#BtnVerCapturas").removeClass("btn-default");
    $("#BtnVerCapturas").addClass("btn-info");


    $("#BtnVerValorGanado").removeClass("btn-info");
    $("#BtnVerValorGanado").addClass("btn-default");


    $("#BtnVerTrabajado").removeClass("btn-info");
    $("#BtnVerTrabajado").addClass("btn-default");


    $("#heatmapcaptura").show();

    $("#heatmaptrabajado").hide();
    $("#heatmapvg").hide();

    return false;
});
$(document).on('click', '#BtnVerValorGanado', function (e) {

    $("#BtnVerValorGanado").removeClass("btn-default");
    $("#BtnVerValorGanado").addClass("btn-info");

    $("#BtnVerCapturas").removeClass("btn-info");
    $("#BtnVerCapturas").addClass("btn-default");

    $("#BtnVerTrabajado").removeClass("btn-info");
    $("#BtnVerTrabajado").addClass("btn-default");


    $("#heatmapvg").show();
    $("#heatmaptrabajado").hide();
    $("#heatmapcaptura").hide();


    return false;
});

function ConsultaTrabajadoDiaP(date) {

    var da = date.split("-");

    var url = $('#urlConsultaTiemposTrabajadoDia').val();

    var Filtro = {

        Anio: da[0],
        Mes: da[1],
        IdUsuarioReporte: $('#IdUsuario').val(),
        Dia: da[2]
    }

    $.ajax({

        url: url,
        data: JSON.stringify(Filtro),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            if (data.Exito) {


                $("#tDetalleTD").text("Horas trabajadas " + date);

                var dsDatos = jQuery.parseJSON(data.LstActividades);


                tablaConsultaTiemposCapturadosDia = inicializaTabla($('#TblTrabajoCapturadoDia'), dsDatos, columnasTiemposCapturadosDia, 1, "asc", true, true, true);


                $("#LblTotalDTDT").text(data.Total);
                $("#LblTotalDTDH").text(data.Horas);

                $('#ModalTrabajoCapturado').modal();

                /*   $('#table1').append(data.Tabla1);*/

                //CargaGrafica(data, dsDatos.Productividad);
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



function ConsultaTrabajoCapturadoDiaP(date) {

    var da = date.split("-");

    var url = $('#urlConsultaTiemposCapturadosDia').val();

    var Filtro = {

        Anio: da[0],
        Mes: da[1],
        IdUsuarioReporte: $('#IdUsuario').val(),
        Dia: da[2]
    }

    $.ajax({

        url: url,
        data: JSON.stringify(Filtro),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            if (data.Exito) {


                $("#tDetalleTD").text("Horas capturadas " + date);


                var dsDatos = jQuery.parseJSON(data.LstActividades);


                tablaConsultaTiemposCapturadosDia = inicializaTabla($('#TblTrabajoCapturadoDia'), dsDatos, columnasTiemposCapturadosDia, 1, "asc", true, true, true);


                $('#ModalTrabajoCapturado').modal();

                $("#LblTotalDTDT").text(data.Total);
                $("#LblTotalDTDH").text(data.Horas);

                /*   $('#table1').append(data.Tabla1);*/

                //CargaGrafica(data, dsDatos.Productividad);
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




function ConsultaValorGanadDiaP(date) {

    var da = date.split("-");
    var url = $('#urlConsultaActividadesTerminadasDia').val();

    var Filtro = {

        Anio: da[0],
        Mes: da[1],
        IdUsuarioReporte: $('#IdUsuario').val(),
        Dia: da[2]
    }

    $.ajax({

        url: url,
        data: JSON.stringify(Filtro),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            if (data.Exito) {

                $("#tDetalleTV").text("Valor ganado " + date);

                var dsDatos = jQuery.parseJSON(data.LstActividades);

                tablaActividadesTerminadasDia = inicializaTabla($('#TblLstActividades'), dsDatos, columnasActividadesTerminadasDia, 1, "asc", true, true, true);




                $('#ModalListaActividades').modal();
                $("#LblTotalDTDTV").text(data.Total);
                $("#LblTotalDTDHV").text(data.Horas);
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

function EjecutarCasoPruebaProfile(IdCicloCaso) {

    InicializarEjeucionPrueba(IdCicloCaso, 0);


    $('#MdlEjecutarCasoPrueba').modal({ keyboard: false });

    $('#MdlEjecutarCasoPrueba').on('hidden.bs.modal', function () {

        showDetailDayCalendar(SelectDayCalendar);
        $(this).off('hidden.bs.modal');
    });

    $('#ModalActividadesDia').modal('hide');


}


function CapturarTrabajoActProfile(IdActividad) {


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

        showDetailDayCalendar(SelectDayCalendar);
        $(this).off('hidden.bs.modal');

    });
    $('#ModalCapturarTrabajo').modal({ backdrop: 'static', keyboard: false });


}


function readURLProfile(input) {



    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            archivofoto = e.target.result;
            $('#FotoUsuario').attr('src', e.target.result);
            var url = e.target.result;
        }

        reader.readAsDataURL(input.files[0]);
    }
    else {
        archivofoto = "";
    }

}




$(document).on("change", "#FotoProfile", function (e) {
    var imgVal = $("#FotoProfile").val();
    if (imgVal == "") {
        nombreFoto = "";
        //$("#iImagenDefault").removeClass("hide");
        //$("#imgFoto").addClass("hide");
    }
    else {
        if (e.target.files != undefined) {

            var reader = new FileReader();

            reader.onload = function (f) {
                archivoFoto = f.target.result;
                $("#FotoUsuario").attr("src", archivoFoto);
                //$("#imgFoto").removeClass("hide");
                //$("#iImagenDefault").addClass("hide");
            };
            reader.readAsDataURL(e.target.files.item(0));

            ActualizaFoto();
         /*   nombreFoto = e.target.files.item(0).nam*/e;
        }
    }
});



 $(document).on("click", "#ImgProfile", function () {
     $("#FotoProfile").click();

     return false;
 });



function ActualizaFoto() {

  
    var url = $('#urlGuardarFoto').val();

    var form_data = new FormData();

    form_data.append("Foto", $("#FotoProfile").prop("files")[0]);
    form_data.append("NomFoto", $("#hdClaveUser").val());


    $.ajax({
        url: url,
        type: "POST",
        contentType: false,
        data: form_data,
        processData: false,
        async: false,
        success: function (Respuesta) {
            if (Respuesta == "1") {


              /*  LimpiarCamposUsuario();*/

                MensajeExito("Los actualizo su fotografia.");
                //$('#ModalEditarUsuario').modal('toggle');
                //$('div.pg-loading-screen').remove();

                setTimeout(function () {
                    location.reload();
                }, 1500);

                //CargaInicial();

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


function VerActListado() {

    $("#divCalendar").hide();
    $("#divTasks").show();


}

function VerActCalendario() {

    $("#divTasks").hide();
    $("#divCalendar").show();
   

}
