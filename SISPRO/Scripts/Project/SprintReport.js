
var tablasEncabezado = {};
var tablasDetalle = {};

var tablasEncabezado2 = {};
var tablasDetalle2 = {};
var dsActividadesSprint = [];
var dsDetalle;
var dsDetalle2;
var dsEncabezado = [];
var dsHus = [];
var dsClasificacion = [];
var dsAsignado = [];
var primeravez = true;
var tablaActividadesSprint;
var numV = 1;

var columnasActividades = [

    {
        "data": "TipoUrl",
        "class": "text-left",
        "render": function (data, type, row) {
            return ' <img src="/Content/Project/Imagenes/' + row.TipoUrl + '" class="img-dt" title="' + row.TipoNombre + '" style="width:18px; height:18px; margin-left:0px;" />' ;
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
        //"render": function (data, type, row) {

        //    //return '<button type="button" class="btn btn-default details-control" title="Ver detalle" ><i class="fa fa-angle-right"></i></button><a style="color: #337ab7" class="btn btn-link" onclick="clickalerta(' + row.IdActividad + ' )">' + data + '</a>';
        //    return ' <img src="/Content/Project/Imagenes/' + row.TipoUrl + '" class="img-dt" title="' + row.TipoNombre + '" style="width:24px; height:24px; margin-left:12px;" /><a style="color: #337ab7" class="btn btn-link" onclick="clickalerta(' + row.IdActividad + ' )">' + data + '</a>';

        //}
    },

    //{
    //    "data": "PrioridadStr",
    //    "class": "text-center",
    //},
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
        "data": "AsignadoPath",
        "class": "text-left",
        "width":"120px",
        "render": function (data, type, row) {
            if (data == "") {

                return "";
            }
            else {

                return `<img src="https://app.yitpro.com/Archivos/Fotos/${data}.jpg" class="img-dt" style="width: 35px; height: 35px" /><a class="btn btn-link"> ${row.AsignadoStr}</a>`
            }

        }
        /*    "render": data =>   `<img src="Archivos/Fotos/${data}" class="img-dt" style="width: 35px; height: 35px" />`*/
    },

    {
        "data": "ClaveTipoActividad",
        "class": "text-left",
        "render": function (data, type, row) {

            if (data == 'BUG') {

                return '<span  class="badge badge-danger" width:100%;">' + data + ' </span>';

            }
            else {
                return data;;

            }


        }
    },
  
    {
        "data": "HorasFacturables",
        "class": "text-right sum",
    },
    {
        "data": "HorasAsignadas",
        "class": "text-right sum",
    },
    {
        "data": "HorasFinales",
        "class": "text-right",
    },
    {
        "data": "FechaSolicitado",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? "" : moment(data).format("YYYY/MM/DD"))
        }
    },

    {
        "data": "FechaTermino",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? "" : moment(data).format("YYYY/MM/DD"))
        }
    },


];

var columnasEncActividades = [

    {
        "class": "text-center",
        "render": function (data, type, row) {
            return "<button type='button' class='btn btn-default details-control' title='Ver detalle' ><i class='fa fa-plus'></i></button>"
        }
    },

    {
        "data": "TipoActividadStr",
        "class": "text-left"
    },
    {
        "data": "HorasFacturables",
        "class": "text-right ",
        "render": function (data, type, row) {


            return $.number(data, '2', '.', ',');


        }
    },

    {
        "data": "HorasAsignadas",
        "class": "text-right ",
        "render": function (data, type, row) {


            return $.number(data, '2', '.', ',');


        }
    },

    {
        "data": "HorasFinales",
        "class": "text-right ",
        "render": function (data, type, row) {


            return $.number(data, '2', '.', ',') ;


        }
    },

    {
        "data": "Progreso",
        "class": "text-right ",
        "render": function (data, type, row) {


            return $.number(data, '2', '.', ',') + "%";
 

        }
         
    },
    {
        "data": "FechaInicio",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))
        }
    },

    {
        "data": "FechaFin",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))
        }
    }
];


var columnasEncActividadesUser = [

    {
        "class": "text-center",
        "render": function (data, type, row) {
            return "<button type='button' class='btn btn-default details-control' title='Ver detalle' ><i class='fa fa-plus'></i></button>"
        }
    },

    {
        "data": "TipoActividadStr",
        "class": "text-left"
    },
    {
        "data": "HorasFacturables",
        "class": "text-right ",
        "render": function (data, type, row) {


            return $.number(data, '2', '.', ',');


        }
    },

    {
        "data": "HorasAsignadas",
        "class": "text-right ",
        "render": function (data, type, row) {


            return $.number(data, '2', '.', ',');


        }
    },

    {
        "data": "HorasFinales",
        "class": "text-right ",
        "render": function (data, type, row) {


            return $.number(data, '2', '.', ',');


        }
    },

    {
        "data": "Progreso",
        "class": "text-right ",
        "render": function (data, type, row) {


            return $.number(data, '2', '.', ',') + "%";


        }

    },
    {
        "data": "FechaInicio",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))
        }
    },

    {
        "data": "FechaFin",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))
        }
    },

    {
        "data": "Objetivo",
        "class": "text-right ",
        "render": function (data, type, row) {


            return $.number(data, '2', '.', ',');


        }
    },

    {
        "data": "Performance",
        "class": "text-right ",
        "render": function (data, type, row) {


            return $.number(data, '2', '.', ',') + "%";


        }

    },
];

var columnasEncActividadesHu = [

    {
        "class": "text-center",
        "render": function (data, type, row) {
            return "<button type='button' class='btn btn-default details-control' title='Ver detalle' ><i class='fa fa-plus'></i></button>"
        }
    },

    {
        "data": "IdActividadStr",
        "class": "text-left",

        "render": function (data, type, row) {

            if (row.IdActividad != 0) {
                return '<a style="color: #337ab7" class="btn btn-link" onclick="clickalerta(' + row.IdActividad + ' )">' + data + '</a>';
            }
            else {

                return ''
            }
          

        }


    },

    {
        "data": "TipoActividadStr",
        "class": "text-left",

        "render": function (data, type, row) {

            if (row.Puntos !=0 ) {


                return data + " <span class='badge badge-info' title='Puntos historia' style='cursor:pointer;'>" + row.Puntos + "</span>";
             
            }
            else {

                return data;
              
            }


        }
    },
    {
        "data": "HorasFacturables",
        "class": "text-right ",
        "render": function (data, type, row) {


            return $.number(data, '2', '.', ',');


        }
    },

    {
        "data": "HorasAsignadas",
        "class": "text-right ",
        "render": function (data, type, row) {


            return $.number(data, '2', '.', ',');


        }
    },

    {
        "data": "HorasFinales",
        "class": "text-right ",
        "render": function (data, type, row) {


            return $.number(data, '2', '.', ',');


        }
    },

    {
        "data": "Progreso",
        "class": "text-right ",
        "render": function (data, type, row) {


            return $.number(data, '2', '.', ',') + "%";


        }

    },
    {
        "data": "FechaInicio",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))
        }
    },

    {
        "data": "FechaFin",
        "class": "text-center",
        "render": function (data, type, row) {
            return (data == null || data == "" ? "" : moment(data).format("DD/MM/YYYY"))
        }
    }
];




var htmlTablaDetalle = "<div class='row table-responsive'>" +
    "<table id='@tabla@Detalle' class='table table-striped table-detail tablaDetalle'>" +
    "<thead>" +
    "<tr>" +
    '<th></th>' +
    '<th>Id</th>' +
    '<th>Título</th>' +
    '<th>Estatus</th>' +
    '<th>Asignado</th>' +
    '<th>Fase</th>' +
    '<th>Estimado</th>' +
    '<th>Asignado</th>' +
    '<th>Real</th>' +
    '<th>Fecha objetivo</th>' +
    '<th>Fecha real</th>' +
    "</tr>" +
    "</thead>" +
    "</table>" +
    "</div>";



$(document).ready(function () {


    //$("#BtnActualizaProgresoSprint").hide();
    //$("#BtnActualizaAbiertoSprint").hide();
    //$("#BtnActualizaTerminarSprint").hide();
    //$("#BtnActualizaCancelarSprint").hide();
  /*  $("#BtnVerRetrospectiva").hide();*/


    $('#TxtFechaFinI,#TxtFechaInicioI').datetimepicker(
        {
            format: 'DD/MM/YYYY'
        });



  /*  $('#TxtRangoFechasSFA').val(moment().subtract(90, 'days').format('DD/MM/YYYY') + ' - ' + moment().endOf('month').format('DD/MM/YYYY'));*/
    $(".filter-settings-icon").on("click", function () {
        $(".filter-settings").toggleClass("active");
    });

    $('#Calendar').fullCalendar({
        locale: 'es',
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay,listMonth'
        },
        buttonIcons: true, // show the prev/next text
        navLinks: true, // can click day/week names to navigate views
        editable: false,
        eventClick: function (info) {
            clickalerta(info.id);
        }


    });


    CargarSprintIndicadores();
    CargarSprintActividades();
    ConsultaGraficasSprint();

});

function CargarSprintReport() {



    var url = $('#urlConsultaSprintReport').val();

    $.ajax({
        url: url,
        data: JSON.stringify({ IdIteracion: $('#IdIteracion').val(), Estatus: $('#SelEstatusASP').val() }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {
            var datos = jQuery.parseJSON(data.ProyectoIteracion);

            $("#IdProyectoIteracion").val(datos.IdProyecto);
            $("#lblNombreP").text(datos.Proyecto);
            $("#lblNombreSprint").text(datos.Nombre);


            $("#hTitle").text(datos.Nombre);

            $("#LblSprint").text(datos.Nombre);
            $("#lblObjetivo").text(datos.Objetivo);
            $("#lblFechaInicio").text(moment(datos.FechaInicio).format("DD/MM/YYYY"));
            $("#lblFechaFin").text(moment(datos.FechaFin).format("DD/MM/YYYY"));



            $("#TituloSprintModal").text(datos.Nombre);
            $('#TxtNombreI').val(datos.Nombre);
            $('#TxtObjetivoI').val(datos.Objetivo);
            $('#TxtFechaInicioI').val(moment(datos.FechaInicio).format("DD/MM/YYYY"));
            $('#TxtFechaFinI').val(moment(datos.FechaFin).format("DD/MM/YYYY"));


            $("#LblVelRequerida").text(datos.Velocidad);
            $("#LblVelActual").text(datos.VelocidadActual);

            $("#LblCantActividades").text(datos.CantActividades);
            $("#LblCantActividadesTerminadas").text(datos.CantActividadesTerminadas);
            $("#LblHorasTotales").text(datos.HorasTotales);
            $("#LblHorasTerminadas").text(datos.HorasTerminadas);
            $("#spEstatusCSP").removeClass("text-info text-progress text-warning text-success text-danger text-muted");


            if (datos.Estatus == "A") {
                $("#spEstatusCSP").addClass("text-info");
                $("#BtnEstatusSP").text("Abierto");
                $("#BtnActualizaProgresoSprint").show();
                $("#BtnActualizaAbiertoSprint").hide();
                $("#BtnActualizaTerminarSprint").hide();
           /*     $("#BtnVerRetrospectiva").hide();*/

            }
            if (datos.Estatus == "P") {
                $("#spEstatusCSP").addClass("text-progress");
                $("#BtnEstatusSP").text("En progreso");
                $("#BtnActualizaProgresoSprint").hide();
                $("#BtnActualizaAbiertoSprint").show();
                $("#BtnActualizaTerminarSprint").show();
             /*   $("#BtnVerRetrospectiva").hide();*/

            }
            if (datos.Estatus == "L") {
                $("#spEstatusCSP").addClass("text-success");
                $("#BtnEstatusSP").text("Terminado");
                $("#BtnActualizaProgresoSprint").hide();
                $("#BtnActualizaAbiertoSprint").show();
           /*     $("#BtnVerRetrospectiva").show();*/
                $("#BtnActualizaTerminarSprint").hide();
                $("#BtnActualizaCancelarSprint").hide();

            }
            if (datos.Estatus == "C") {
                $("#spEstatusCSP").addClass("text-muted");
                $("#BtnEstatusSP").text("Cancelado");


                $("#BtnActualizaProgresoSprint").show();
                $("#BtnActualizaAbiertoSprint").show();
                $("#BtnActualizaTerminarSprint").hide();
                $("#BtnActualizaCancelarSprint").hide();
               /* $("#BtnVerRetrospectiva").hide();*/

            }

            dsEncabezado = datos.LstFases;
            dsHus = datos.LstHus;
            dsActividadesSprint = datos.Actividades;
            tablaActividadesSprint = inicializaTabla($('#TblActividadesSprint'), dsActividadesSprint, columnasActividades, 1, "asc", false, true, true);

            if (primeravez) {
                inicializaTablaEnc('TblActividadesSprintA', dsEncabezado);
                inicializaTablaHu('TblActividadesSprintHu', dsHus);
            }
            else {
                refrescaTablaAct();
                refrescaTablaAct2();
            }
            primeravez = false;

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
            $("#tasks_ok").append(data.ActividadesLi);
            resizeTaskList();
            page_content_onresize();

            var element2 = document.querySelector('.cavanceactual');
            var avancer = new EasyPieChart(element2, {
                delay: 3000,
                barColor: '#000070',
                trackColor: '#FFFFFF',
                scaleColor: false,
                lineWidth: 10,
                trackWidth: 16,
                lineCap: 'butt',
                onStep: function (from, to, percent) {
                    this.el.children[0].innerHTML = datos.Avance;
                }
            });
            avancer.update(datos.Avance);
            avancer.disableAnimation();
            avancer.enableAnimation();

            var dsDatos = JSON.parse(data.GraficaBurndown);

            $.each(dsDatos, function (key, value) {


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

                var tema = "temagraficaburndown";


                if (tipo == "Pie") {
                    var grafica = "<div class='col-md-6'>"
                        + "     <div class='panel panel-default'>"
                        + "                           <div class='panel-heading'>"
                        + "                               <div class='panel-title-box'>"
                        + "                                  <h3>" + nombre + "</h3>"
                        + "                              </div>"
                        + "                               <ul class='panel-controls' style='margin-top: 2px;'>"
                        + '                                 <li><a href="#" onclick="AbrirGrafica(' + "'" + id + "'" + ')" class="panel-fullscreen"><span class="fa fa-expand"></span></a></li>'
                        + "                             </ul>"
                        + "                         </div>"
                        + "                         <div class='panel-body'>"
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
                        + '                   x: "center",'
                        + "                   y: 'bottom',"
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
                        + "                   name: 'Ordenes',"
                        + "                   type: 'pie', "
                        + "                   radius: ['35%', '55%'],"
                        + "                   itemStyle: { "
                        + "                       normal: { "
                        + "                           label: { "
                        + "                               show: true "
                        + "                           },"
                        + "                           labelLine: {"
                        + "                               show: true "
                        + "                           }"
                        + "                       },"
                        + "                       emphasis: {"
                        + "                           label: {"
                        + "                               show: true,"
                        + "                               position: 'center',"
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

                    $('#GraficaBurndown').append(grafica);
                    $('#scriptsBurndown').append(script);

                }
                else if (tipo == "bar") {
                    var grafica = "<div class='col-md-12'>"
                        + "     <div class='panel panel-default'>"
                        + "                           <div class='panel-heading'>"
                        + "                               <div class='panel-title-box'>"
                        + "                                  <h3>" + nombre + "</h3>"
                        + "                              </div>"
                        + "                               <ul class='panel-controls' style='margin-top: 2px;'>"
                        + '                                 <li><a href="#" onclick="AbrirGrafica(' + "'" + id + "'" + ')" class="panel-fullscreen"><span class="fa fa-expand"></span></a></li>'
                        + "                             </ul>"
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
                        + "title: {},"
                        + "tooltip: { trigger: 'axis'},"
                        + " legend: {"
                        + '  data: ' + series + ''
                        + " },"
                        + "  toolbox: {"
                        + "show: true,"
                        + " feature: { "
                        + "            mark: { show: true },"
                        + "            magicType: { show: true, type: ['line', 'bar','pie'] , title:''},"
                        + "    saveAsImage: {"
                        + "        show: true, "
                        + "        title: 'Descargar'"
                        + "    }"
                        + "}"
                        + "},"
                        + "calculable: true,"
                        + " xAxis: [{ "
                        + " type: 'category',"
                        + ' data:' + columnas + ''
                        + " }],"
                        + " yAxis: [{ "
                        + " type: 'value' "
                        + "}],"
                        + 'series: ' + valores + ''
                        + "});"
                        + "</script>"


                    $('#GraficaBurndown').append(grafica);
                    $('#scriptsBurndown').append(script);

                }
                else if (tipo == "line") {

                    var grafica = "<div class='col-md-12'>"
                        + "     <div class=''>"
                        + "                         <div class=''>"
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

                    $('#GraficaBurndown').append(grafica);
                    $('#scriptsBurndown').append(script);
                }




                //var table = '<div class="btn-group pull-right">'
                //    + '                               <button class="btn btn-danger dropdown-toggle" data-toggle="dropdown"><i class="fa fa-bars"></i> Exportar</button>'
                //    + '                               <ul class="dropdown-menu">'
                //    + ' <li><a href="#" onclick="$(' + "'#" + vartabla + "'" + ').tableExport({type:' + "'excel',escape:" + "'false'" + '});' + '"' + '><img src="./Content/Project/Imagenes/xls.png" width="24" /> XLS</a></li>'
                //    + '                            </ul>'
                //    + '                           </div> '
                //    + ' <div class="panel-body" style="height:600px;">'
                //    + '<div class="col-md-12">'
                //    + '<div class="table-responsive">'
                //    + '                               <table id="' + vartabla + '" class="table datatable text table-striped">'
                //    + '' + tabla
                //    + '                               </table>'
                //    + '                           </div> '
                //    + '                           </div> '
                //    + '                           </div> '

                //$('#TablaCostoHoraModal').append(table);



                numV = numV + 1;

            });

            var events = JSON.parse(data.Eventos);

            $('#Calendar').fullCalendar('removeEvents');
            $('#Calendar').fullCalendar('addEventSource', events);
            $('#Calendar').fullCalendar('rerenderEvents');

            var g = jQuery.parseJSON(data.Gantt);

            //if (sprintgantt) {

            //    gantt.destructor();
            //    gantt = null;

            //}

            //sprintgantt = true;


            /*  gantt.config.date_format = "%Y-%m-%d %H:%i:%s";*/

            gantt.config.min_column_width = 50;
            //gantt.plugins({
            //    export_api: true,
            //});

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


                        return `<img src="https://app.yitpro.com/Archivos/Fotos/${obj.avance}.jpg" title="${obj.asignadostr}" class="img-dt" style="width: 24px; height: 24px" />`;

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
            gantt.ext.zoom.setLevel("day");


            gantt.config.readonly = true;
            gantt.i18n.setLocale("es");

            gantt.init("roadmap");
            gantt.clearAll();
            gantt.parse({
                data: g

            });




        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error al realizar la consulta, intente de nuevo.");
        }
    });

}

function CargarSprintReport_Tabla() {



    var url = $('#urlConsultaSprintReport').val();

    $.ajax({
        url: url,
        data: JSON.stringify({ IdIteracion: $('#IdIteracion').val(), Estatus: $('#SelEstatusASP').val() }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {


            var datos = jQuery.parseJSON(data.ProyectoIteracion);


            dsEncabezado = datos.LstFases;
            dsHus = datos.LstHus;
            dsActividadesSprint = datos.Actividades;
            tablaActividadesSprint = inicializaTabla($('#TblActividadesSprint'), dsActividadesSprint, columnasActividades, 1, "asc", false, true, true);



            if (primeravez) {
                inicializaTablaEnc('TblActividadesSprintA', dsEncabezado);
                inicializaTablaHu('TblActividadesSprintHu', dsHus);
            }
            else {
                refrescaTablaAct();
                refrescaTablaAct2();
            }
            primeravez = false;





            var events = JSON.parse(data.Eventos);

            $('#Calendar').fullCalendar('removeEvents');
            $('#Calendar').fullCalendar('addEventSource', events);
            $('#Calendar').fullCalendar('rerenderEvents');



            var g = jQuery.parseJSON(data.Gantt);

            //if (sprintgantt) {

            //    gantt.destructor();
            //    gantt = null;

            //}

            //sprintgantt = true;


            /*  gantt.config.date_format = "%Y-%m-%d %H:%i:%s";*/

            gantt.config.min_column_width = 50;
            //gantt.plugins({
            //    export_api: true,
            //});

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


                        return `<img src="https://app.yitpro.com/Archivos/Fotos/${obj.avance}.jpg" title="${obj.asignadostr}" class="img-dt" style="width: 24px; height: 24px" />`;

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
            gantt.ext.zoom.setLevel("day");


            gantt.config.readonly = true;
            gantt.i18n.setLocale("es");

            gantt.init("roadmap");
            gantt.clearAll();
            gantt.parse({
                data: g

            });




        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error al realizar la consulta, intente de nuevo.");
        }
    });

}



async function CargarSprintIndicadores() {


    const data = await POST('/Proyectos/ConsultaSprintReportIndicadores', { IdIteracion: $('#IdIteracion').val() });

    if (data.Exito) {


        var datos = jQuery.parseJSON(data.ProyectoIteracion);


        $("#hTitle").text(datos.Nombre + ' - ' + datos.Proyecto);
        $("#TituloShareSR").text("Compartir: " + datos.Nombre + ' - ' + datos.Proyecto);

        $(document).prop('title', "YITPRO | " +  datos.Nombre + ' - ' + datos.Proyecto);

        $("#IdProyectoIteracion").val(datos.IdProyecto);
        $("#lblNombreP").text(datos.Proyecto);
        $("#lblNombreSprint").text(datos.Nombre);
        $("#LblSprint").text(datos.Nombre);
        $("#lblObjetivo").text(datos.Objetivo);
        $("#lblFechaInicio").text(moment(datos.FechaInicio).format("DD/MM/YYYY"));
        $("#lblFechaFin").text(moment(datos.FechaFin).format("DD/MM/YYYY"));
        $("#lblFechaProyectada").text(moment(datos.FechaProyectada).format("DD/MM/YYYY"));


        if (datos.FechaProyectada > datos.FechaFin) {
            $("#tlProyectada").removeClass("text-success").addClass("text-danger");


        }
        else {
            $("#tlProyectada").removeClass("text-danger").addClass("text-success");
        }

        $("#LblPuntosH").text(datos.Puntos);
        $("#LblPuntosC").text(datos.PuntosC);
        $("#LblPuntosP").text(datos.PuntosP);

        $("#TituloSprintModal").text(datos.Nombre);
        $('#TxtNombreI').val(datos.Nombre);
        $('#TxtObjetivoI').val(datos.Objetivo);
        $('#TxtFechaInicioI').val(moment(datos.FechaInicio).format("DD/MM/YYYY"));
        $('#TxtFechaFinI').val(moment(datos.FechaFin).format("DD/MM/YYYY"));
      


        $("#LblVelRequerida").text(datos.Velocidad);
        $("#LblVelActual").text(datos.VelocidadActual);

        $("#LblCantActividades").text(datos.CantActividades);
        $("#LblCantActividadesTerminadas").text(datos.CantActividadesTerminadas);
 
        $("#LblCantActividadesPendientes").text(datos.CantActividades - datos.CantActividadesTerminadas);
        $("#LblHorasTotales").text(datos.HorasTotales);
        $("#LblHorasTerminadas").text(datos.HorasTerminadas);
        $("#LblHorasPendientes").text(datos.HorasPendientes);

        $("#spEstatusCSP").removeClass("text-info text-progress text-warning text-success text-danger text-muted");


        if (datos.Estatus == "A") {
            $("#spEstatusCSP").addClass("text-info");
            $("#BtnEstatusSP").text("Abierto");
            $("#BtnActualizaProgresoSprint").show();
            $("#BtnActualizaAbiertoSprint").hide();
            $("#BtnActualizaTerminarSprint").hide();
            $("#plblFechaProyectada").text("Proyectado");
         /*   $("#BtnVerRetrospectiva").hide();*/

        }
        if (datos.Estatus == "P") {
            $("#spEstatusCSP").addClass("text-progress");
            $("#BtnEstatusSP").text("En progreso");
            $("#BtnActualizaProgresoSprint").hide();
            $("#BtnActualizaAbiertoSprint").show();
            $("#BtnActualizaTerminarSprint").show();
            $("#plblFechaProyectada").text("Proyectado");
      /*      $("#BtnVerRetrospectiva").hide();*/

        }
        if (datos.Estatus == "L") {
            $("#spEstatusCSP").addClass("text-success");
            $("#BtnEstatusSP").text("Terminado");
            $("#BtnActualizaProgresoSprint").hide();
            $("#BtnActualizaAbiertoSprint").show();
       /*     $("#BtnVerRetrospectiva").show();*/
            $("#BtnActualizaTerminarSprint").hide();
            $("#BtnActualizaCancelarSprint").hide();

            $("#plblFechaProyectada").text("Cierre");

        }
        if (datos.Estatus == "C") {
            $("#spEstatusCSP").addClass("text-muted");
            $("#BtnEstatusSP").text("Cancelado");


            $("#BtnActualizaProgresoSprint").show();
            $("#BtnActualizaAbiertoSprint").show();
            $("#BtnActualizaTerminarSprint").hide();
            $("#BtnActualizaCancelarSprint").hide();
            $("#plblFechaProyectada").text("Proyectado");
          /*  $("#BtnVerRetrospectiva").hide();*/
        }


        $("#LblPorcAvanceSprint").text(datos.Avance + "%");


        $('#SelUsuariosShareSR').empty();
        $('#SelUsuariosShareSR').append(data.LstUsuarios);
        $('#SelUsuariosShareSR').selectpicker('refresh');

        //var element2 = document.querySelector('.cavanceactual');
        //var avancer = new EasyPieChart(element2, {
        //    delay: 3000,
        //    barColor: '#000070',
        //    trackColor: '#FFFFFF',
        //    scaleColor: false,
        //    lineWidth: 10,
        //    trackWidth: 16,
        //    lineCap: 'butt',
        //    onStep: function (from, to, percent) {
        //        this.el.children[0].innerHTML = datos.Avance;
        //    }
        //});
        //avancer.update(datos.Avance);
        //avancer.disableAnimation();
        //avancer.enableAnimation();

        var dsDatos = JSON.parse(data.GraficaBurndown);
        $('#GraficaBurndown').empty();
        $('#scriptsBurndown').empty();
        $.each(dsDatos, function (key, value) {


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

            var tema = "temagraficaburndown";


            if (tipo == "Pie") {
                var grafica = "<div class='col-md-6'>"
                    + "     <div class='panel panel-default'>"
                    + "                           <div class='panel-heading'>"
                    + "                               <div class='panel-title-box'>"
                    + "                                  <h3>" + nombre + "</h3>"
                    + "                              </div>"
                    + "                               <ul class='panel-controls' style='margin-top: 2px;'>"
                    + '                                 <li><a href="#" onclick="AbrirGrafica(' + "'" + id + "'" + ')" class="panel-fullscreen"><span class="fa fa-expand"></span></a></li>'
                    + "                             </ul>"
                    + "                         </div>"
                    + "                         <div class='panel-body'>"
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
                    + '                   x: "center",'
                    + "                   y: 'bottom',"
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
                    + "                   name: 'Ordenes',"
                    + "                   type: 'pie', "
                    + "                   radius: ['35%', '55%'],"
                    + "                   itemStyle: { "
                    + "                       normal: { "
                    + "                           label: { "
                    + "                               show: true "
                    + "                           },"
                    + "                           labelLine: {"
                    + "                               show: true "
                    + "                           }"
                    + "                       },"
                    + "                       emphasis: {"
                    + "                           label: {"
                    + "                               show: true,"
                    + "                               position: 'center',"
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

                $('#GraficaBurndown').append(grafica);
                $('#scriptsBurndown').append(script);

            }
            else if (tipo == "bar") {
                var grafica = "<div class='col-md-12'>"
                    + "     <div class='panel panel-default'>"
                    + "                           <div class='panel-heading'>"
                    + "                               <div class='panel-title-box'>"
                    + "                                  <h3>" + nombre + "</h3>"
                    + "                              </div>"
                    + "                               <ul class='panel-controls' style='margin-top: 2px;'>"
                    + '                                 <li><a href="#" onclick="AbrirGrafica(' + "'" + id + "'" + ')" class="panel-fullscreen"><span class="fa fa-expand"></span></a></li>'
                    + "                             </ul>"
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
                    + "title: {},"
                    + "tooltip: { trigger: 'axis'},"
                    + " legend: {"
                    + '  data: ' + series + ''
                    + " },"
                    + "  toolbox: {"
                    + "show: true,"
                    + " feature: { "
                    + "            mark: { show: true },"
                    + "            magicType: { show: true, type: ['line', 'bar','pie'] , title:''},"
                    + "    saveAsImage: {"
                    + "        show: true, "
                    + "        title: 'Descargar'"
                    + "    }"
                    + "}"
                    + "},"
                    + "calculable: true,"
                    + " xAxis: [{ "
                    + " type: 'category',"
                    + ' data:' + columnas + ''
                    + " }],"
                    + " yAxis: [{ "
                    + " type: 'value' "
                    + "}],"
                    + 'series: ' + valores + ''
                    + "});"
                    + "</script>"


                $('#GraficaBurndown').append(grafica);
                $('#scriptsBurndown').append(script);

            }
            else if (tipo == "line") {

                var grafica = "<div class='col-md-12'>"
                    + "     <div class=''>"
                    + "                         <div class=''>"
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

                $('#GraficaBurndown').append(grafica);
                $('#scriptsBurndown').append(script);
            }




      



            numV = numV + 1;

        });


        if (datos.Plan == 1) {

            MensajeAdvertencia("Existen actividades planeadas fuera del rango del sprint.<br/> Esto representa un riesgo para el cumplimiento de la entrega.")
        }

        //$('#SelCatPlantilla').empty();
        //$('#SelCatPlantilla').append(data.LstCatalogo);
        //$('#SelCatPlantilla').selectpicker('refresh');


    }
    else {

        MensajeError(data.Mensaje);
    }

}


async function CargarSprintActividades() {


    const data = await POST('/Proyectos/ConsultaSprintReportActividades', { IdIteracion: $('#IdIteracion').val(), Estatus: $('#SelEstatusASP').val() });

    if (data.Exito) {


        var datos = jQuery.parseJSON(data.ProyectoIteracion);

        dsEncabezado = datos.LstFases;
        dsHus = datos.LstHus;
        dsClasificacion = datos.LstClasificacion;
        dsAsignado = datos.LstRecursos;
        dsActividadesSprint = datos.Actividades;
        tablaActividadesSprint = inicializaTabla($('#TblActividadesSprint'), dsActividadesSprint, columnasActividades, 1, "asc", false, true, true);



        if (primeravez) {
            inicializaTablaEnc('TblActividadesSprintA', dsEncabezado);
            inicializaTablaHu('TblActividadesSprintHu', dsHus);
            inicializaTablaAsig('TblActividadesAsignadoA', dsAsignado);
            inicializaTablaClas('TblActividadesClasificacionA', dsClasificacion);
        }
        else {
            refrescaTablaAct();
            refrescaTablaAct2();
        }
        primeravez = false;


        $('#SelUsuarioAsignadoSFA').empty();
        $('#SelUsuarioAsignadoSFA').append(data.LstUsuarios);
        $('#SelUsuarioAsignadoSFA').val("-1");
        $('#SelUsuarioAsignadoSFA').selectpicker('refresh');



        $('#SelHUSFA').empty();
        $('#SelHUSFA').append(data.LstHus);
        $('#SelHUSFA').val(-1);
        $('#SelHUSFA').selectpicker('refresh');


        $('#SelUsuarioAsignadoSFT').empty();
        $('#SelUsuarioAsignadoSFT').append(data.LstUsuarios);
        $('#SelUsuarioAsignadoSFT').val("-1");
        $('#SelUsuarioAsignadoSFT').selectpicker('refresh');



        $('#SelHUSFT').empty();
        $('#SelHUSFT').append(data.LstHus);
        $('#SelHUSFT').val(-1);
        $('#SelHUSFT').selectpicker('refresh');



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
        $("#tasks_ok").append(data.ActividadesLi);
        resizeTaskList();
        page_content_onresize();


        var events = JSON.parse(data.Eventos);

        $('#Calendar').fullCalendar('removeEvents');
        $('#Calendar').fullCalendar('addEventSource', events);
        $('#Calendar').fullCalendar('rerenderEvents');



        var g = jQuery.parseJSON(data.Gantt);

        //if (sprintgantt) {

        //    gantt.destructor();
        //    gantt = null;

        //}

        //sprintgantt = true;


        /*  gantt.config.date_format = "%Y-%m-%d %H:%i:%s";*/

        gantt.config.min_column_width = 50;
        //gantt.plugins({
        //    export_api: true,
        //});

        gantt.plugins({
            tooltip: true
        });
        gantt.attachEvent("onGanttReady", function () {
            var tooltips = gantt.ext.tooltips;
            tooltips.tooltip.setViewport(gantt.$task_data);
        });

        gantt.config.scale_height = 90;

        gantt.config.columns = [
            { name: "text", label: "Fase", tree: false, width: 170, resize: true, min_width: 10 },
            { name: "start_date", label: "Fecha inicio", align: "center", width: 120, resize: true },
            { name: "end_date", label: "Fecha fin", align: "center", width: 120, resize: true },
            { name: "avance", label: "Avance", align: "center", width: 120, resize: true }


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
        gantt.ext.zoom.setLevel("day");


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

async function CargarSprintActividades_FiltrarA() {

    var inicio, fin;
    if ($("#TxtRangoFechasSFA").val() != "") {
        inicio = ($("#TxtRangoFechasSFA").val()).split('-')[0];
        fin = ($("#TxtRangoFechasSFA").val()).split('-')[1];
    }



    const data = await POST('/Proyectos/ConsultaSprintReportActividades_Filtrar', { IdIteracion: $('#IdIteracion').val(), Estatus: $('#SelEstatusSFA').val(), FechaInicio: inicio, FechaFin: fin, TipoId: $('#SelTipoSFA').val(), IdUsuarioAsignado: $('#SelUsuarioAsignadoSFA').val(), IdHu: $('#SelHUSFA').val() });

    if (data.Exito) {


        var datos = jQuery.parseJSON(data.ProyectoIteracion);

        dsEncabezado = datos.LstFases;
        dsHus = datos.LstHus;
        dsClasificacion = datos.LstClasificacion;
        dsAsignado = datos.LstRecursos;
        dsActividadesSprint = datos.Actividades;
        tablaActividadesSprint = inicializaTabla($('#TblActividadesSprint'), dsActividadesSprint, columnasActividades, 1, "asc", false, true, true);



        if (primeravez) {
            inicializaTablaEnc('TblActividadesSprintA', dsEncabezado);
            inicializaTablaHu('TblActividadesSprintHu', dsHus);
            inicializaTablaAsig('TblActividadesAsignadoA', dsAsignado);
            inicializaTablaClas('TblActividadesClasificacionA', dsClasificacion);
        }
        else {
            refrescaTablaAct();
            refrescaTablaAct2();
        }
        primeravez = false;


        //$('#SelUsuarioAsignadoSFA').empty();
        //$('#SelUsuarioAsignadoSFA').append(data.LstUsuarios);
        //$('#SelUsuarioAsignadoSFA').selectpicker('refresh');



        //$('#SelHUSFA').empty();
        //$('#SelHUSFA').append(data.LstHus);
        //$('#SelHUSFA').selectpicker('refresh');


        //$("#LblAbierto").text("Abiertas (" + data.TotalAbiertas + ")");
        //$("#LblProgreso").text("Progreso (" + data.TotalProgreso + ")");
        //$("#LblValidacion").text("Validación (" + data.TotalValidacion + ")");
        //$("#LblTerminadas").text("Terminadas (" + data.TotalLiberadas + ")");
        //$("#LblRechazadas").text("Rechazadas (" + data.TotalRechazadas + ")");

        //$("#tasks_assigned").empty();
        //$("#tasks_progreess").empty();
        //$("#task_validate").empty();
        //$("#tasks_re").empty();
        //$("#tasks_ok").empty();

        //$("#tasks_assigned").append(data.ActividadesA);
        //$("#tasks_progreess").append(data.ActividadesP);
        //$("#task_validate").append(data.ActividadesR);
        //$("#tasks_re").append(data.ActividadesX);
        //$("#tasks_ok").append(data.ActividadesLi);
        //resizeTaskList();
        //page_content_onresize();





    }
    else {

        MensajeError(data.Mensaje);
    }

}


async function CargarSprintActividades_FiltrarT() {

    var inicio, fin;
    if ($("#TxtRangoFechasSFT").val() != "") {
        inicio = ($("#TxtRangoFechasSFT").val()).split('-')[0];
        fin = ($("#TxtRangoFechasSFT").val()).split('-')[1];
    }



    const data = await POST('/Proyectos/ConsultaSprintReportActividades_Filtrar', { IdIteracion: $('#IdIteracion').val(), Estatus: $('#SelEstatusSFT').val(), FechaInicio: inicio, FechaFin: fin, TipoId: $('#SelTipoSFT').val(), IdUsuarioAsignado: $('#SelUsuarioAsignadoSFT').val(), IdHu: $('#SelHUSFT').val() });

    if (data.Exito) {


        var datos = jQuery.parseJSON(data.ProyectoIteracion);

        //dsEncabezado = datos.LstFases;
        //dsHus = datos.LstHus;
        //dsClasificacion = datos.LstClasificacion;
        //dsAsignado = datos.LstRecursos;
        //dsActividadesSprint = datos.Actividades;
        //tablaActividadesSprint = inicializaTabla($('#TblActividadesSprint'), dsActividadesSprint, columnasActividades, 1, "asc", false, true, true);



        //if (primeravez) {
        //    inicializaTablaEnc('TblActividadesSprintA', dsEncabezado);
        //    inicializaTablaHu('TblActividadesSprintHu', dsHus);
        //    inicializaTablaAsig('TblActividadesAsignadoA', dsAsignado);
        //    inicializaTablaClas('TblActividadesClasificacionA', dsClasificacion);
        //}
        //else {
        //    refrescaTablaAct();
        //    refrescaTablaAct2();
        //}
        //primeravez = false;


        //$('#SelUsuarioAsignadoSFA').empty();
        //$('#SelUsuarioAsignadoSFA').append(data.LstUsuarios);
        //$('#SelUsuarioAsignadoSFA').selectpicker('refresh');



        //$('#SelHUSFA').empty();
        //$('#SelHUSFA').append(data.LstHus);
        //$('#SelHUSFA').selectpicker('refresh');


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
        $("#tasks_ok").append(data.ActividadesLi);
        resizeTaskList();
        page_content_onresize();





    }
    else {

        MensajeError(data.Mensaje);
    }

}





async function ConsultaGraficasSprint() {


    const data = await POST('/Proyectos/ConsultaGraficasSprint', { IdIteracion: $('#IdIteracion').val() });

    if (data.Exito) {

        var dsDatos = jQuery.parseJSON(data.LstGraficas);

        $('#GraficasSprints').empty();

        $('#scriptsSprints').empty();

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
                var grafica = "<div class='col-md-4 col-xs-12'>"
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


                $('#GraficasSprints').append(grafica);
                $('#scriptsSprints').append(script);

            }

            numV = numV + 1;

        });
    }
    else {

        MensajeError(data.Mensaje);
    }

}


$(document).on('click', '#BtnFiltrarSFA', function (e) {

    CargarSprintActividades_FiltrarA();
    $(".filter-settings").toggleClass("active");
    return false;

});

$(document).on('click', '#BtnFiltrarSFT', function (e) {

    CargarSprintActividades_FiltrarT();
    $(".filter-settings").toggleClass("active");
    return false;

});

function zoomIn() {
    gantt.ext.zoom.zoomIn();
}
function zoomOut() {
    gantt.ext.zoom.zoomOut()
}

function CambiarZoom(zoom) {
    gantt.ext.zoom.setLevel(zoom);
}



$(document).on('click', '#BtnOcultarInd', function (e) {


    $("#BtnOcultarInd").hide();
    $("#BtnMostrarInd").show();

    $("#divIndicadores").hide("slow");


});

$(document).on('click', '#BtnMostrarInd', function (e) {

    $("#BtnMostrarInd").hide();
    $("#BtnOcultarInd").show();

    $("#divIndicadores").show("slow");

});

$("#tasks_assigned,#tasks_progreess, #task_validate,#tasks_re, #tasks_ok").sortable({
    items: "> .task-item",
    connectWith: "#tasks_assigned, #tasks_progreess, #task_validate,#tasks_re,#tasks_ok",
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
            Bugs.Funciones.LeerBugs();
            /*  alert("Se paso a liberado");*/

            //var item = $(ui).attr('item')[0].id
            //AbrirModalRechazoActividad(item);



        }
        page_content_onresize();
    }
}).disableSelection();

function AbrirModalCapturaTiempo(IdActividad) {

    $("#IdActividadCT").val(IdActividad);
    $('#TituloRec').text("Capturar fecha fin de actividad #" + IdActividad);
    var date = new Date();
    $('#TxtFinActividad').datetimepicker(
        {
            format: 'DD/MM/YYYY',
            maxDate: date
        });

    $('#ModalCapturarTiempo').on('hidden.bs.modal', function () {

        CargarSprintActividades();
        $(this).off('hidden.bs.modal');

    });

    $('#ModalCapturarTiempo').modal({ keyboard: false });

    return false;

}

function ActualizaEstatus(IdActividad, Estatus) {

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
            //else {
            //    Bugs.Funciones.LeerBugs();
            //}

        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error al realizar la consulta, intente de nuevo.");
        }
    });


}

function AbrirModalRechazoActividad(IdActividad) {

    InicializaModalRechazar();
    $('#ActividadR').val(IdActividad);



    $('#TituloRec').text("Rechazar actividad #" + IdActividad);


    $('#ModalRechazarActividad').on('hidden.bs.modal', function () {
        Bugs.Funciones.LeerBugs();
        $(this).off('hidden.bs.modal');
    });

    $('#ModalRechazarActividad').modal({ keyboard: false });


    return false;

}

function ActualizaEstatusSprint(Estatus) {

    var url = $('#urlActualizaEstatusSprint').val();
 

    $.ajax({
        url: url,
        data: JSON.stringify({ IdIteracion: $('#IdIteracion').val(), Estatus: Estatus }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            if (data.Exito) {


                $("#spEstatusCSP").removeClass("text-info text-progress text-warning text-success text-danger text-muted");


                if (Estatus == "A") {
                    $("#spEstatusCSP").addClass("text-info");
                    $("#BtnEstatusSP").text("Abierto");
                    $("#BtnActualizaProgresoSprint").show();
                    $("#BtnActualizaAbiertoSprint").hide();
                    $("#BtnActualizaTerminarSprint").hide();
              /*      $("#BtnVerRetrospectiva").hide();*/

                }
                if (Estatus == "P") {
                    $("#spEstatusCSP").addClass("text-progress");
                    $("#BtnEstatusSP").text("En progreso");



                    $("#BtnActualizaProgresoSprint").hide();
                    $("#BtnActualizaAbiertoSprint").show();
                    $("#BtnActualizaTerminarSprint").show();
                  /*  $("#BtnVerRetrospectiva").hide();*/


                }
                if (Estatus == "L") {
                    $("#spEstatusCSP").addClass("text-success");
                    $("#BtnEstatusSP").text("Terminado");



                    $("#BtnActualizaProgresoSprint").hide();
                    $("#BtnActualizaAbiertoSprint").show();
                    $("#BtnActualizaTerminarSprint").hide();
                    $("#BtnActualizaCancelarSprint").hide();
                    /*$("#BtnVerRetrospectiva").show();*/
        

                }
                if (Estatus == "C") {
                    $("#spEstatusCSP").addClass("text-muted");
                    $("#BtnEstatusSP").text("Cancelado");


                    $("#BtnActualizaProgresoSprint").show();
                    $("#BtnActualizaAbiertoSprint").show();
                    $("#BtnActualizaTerminarSprint").hide();
                    $("#BtnActualizaCancelarSprint").hide();
           /*         $("#BtnVerRetrospectiva").hide();*/
                  

                }


            } else {
                MensajeError(data.Mensaje);

            }


        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError("Error al realizar la consulta, intente de nuevo.");
        }
    });


}

$(document).on('click', '#BtnModificarSprint', function (e) {

  


    $("#ModalIteraciones").modal('show');



});

$(document).on('click', '#BtnGuardarSprint', function (e) {


    GuardarSprint();
    return false;
});

function GuardarSprint() {
    var Mensaje = ValidaCamposRequeridos(".ReqIteracion");


    if (Mensaje.length == 0) {


        var Sprint = {
            IdIteracion: $('#IdIteracion').val(),
            Nombre: $('#TxtNombreI').val().trim(),
            Objetivo: $('#TxtObjetivoI').val().trim(),
            FechaInicio: ObtieneFecha($('#TxtFechaInicioI').val().trim()),
            FechaFin: ObtieneFecha($('#TxtFechaFinI').val().trim())
        }
        LlamadaGuardarDatosSprint(Sprint);
    }

    else {

        MensajeAdvertencia(Mensaje);
    }

}

function LlamadaGuardarDatosSprint(Sprint) {

    var url = $('#urlGuardarSprint').val();

    $.ajax({

        url: url,
        data: JSON.stringify(Sprint),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: SuccessLlamadaGuardarSprint,
        error: function (xmlHttpRequest, textStatus, errorThrown) {

            MensajeError(data.Mensaje);
        }
    });
}

function SuccessLlamadaGuardarSprint(data) {
    if (data.Exito) {


    /*    CargarSprintReport();*/
        $("#ModalIteraciones").modal('hide');


        setTimeout(function () {
            location.reload();
        }, 3000);
    }
    else if (data.Advertencia) {

        MensajeAdvertencia(data.Mensaje);

    }
    else {

        MensajeError(data.Mensaje);
    }
}

function BuscarActividadesSprint() {


    $("#tbuscar").text("Agregar actividades a " + $("#lblNombreSprint").text());

    $("#IdProyectoBWI").val($("#IdProyectoIteracion").val());
    $("#IdIteracionBWI").val($("#IdIteracion").val());


    $('#MdlBuscarActividades').modal({ keyboard: false });

    CargaCombosBuscarWorkItems();

    BuscarWorkItems();

    return false;
};


$(document).on('click', '#BtnAgrearBWI', function (e) {


    var validar = '';

    $.map(dsBacklogBuscar, function (obj, index) {
        if (obj.Seleccionado) {
            validar += obj.IdActividad + ',';
        }
    });

    if (validar == '') {
        MensajeAdvertencia('No ha seleccionado ninguna actividad.');
        return false;
    }

    var url = $('#urlAsignacionSprintMasiva').val();

    $.ajax({
        url: url,
        data: JSON.stringify({ Actividades: validar, IdIteracion: $('#IdIteracion').val()  }),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            if (data.Exito) {
            
                $('#MdlBuscarActividades').modal('hide');
                MensajeExito("Se agregaron los elementos al sprint");
               /* CargarSprintReport();*/
                CargarSprintIndicadores();
                CargarSprintActividades();


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

});


function inicializaTablaEnc(nombreTabla, datos) {
    tablasEncabezado[nombreTabla] = $("#" + nombreTabla).dataTable({
        language: lenguajeEs,
        responsive: true,
        searching: true,
        "bSort": true,
        search: {
            smart: false
        },
        "bAutoWidth": false,
        "bLengthChange": true,
        "bPaginate": false,
        destroy: true,
        data: datos,
        columns: columnasEncActividades,
        "order": [[1, 'asc']],

    });

    $('#' + nombreTabla + ' tbody').on('click', '.details-control', function () {
        filaPadre = $(this).closest('tr');

        var row = tablasEncabezado[nombreTabla].api().row(filaPadre); //table.row(tr);

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            filaPadre.removeClass('shown');
            $("i", this).removeClass("fa-minus");
            $("i", this).addClass("fa-plus");
        }
        else {
            $("i", this).removeClass("fa-plus");
            $("i", this).addClass("fa-minus");

            // Open this row
            row.child(format(row.data(), nombreTabla)).show();

            tablasDetalle[nombreTabla + row.data().ClaveTipoActividad] = $("." + nombreTabla + row.data().ClaveTipoActividad).dataTable({
                responsive: true,
                "bSort": false,
                "bPaginate": false,
                "searching": false,
                "autoWidth": true,
                "bLengthChange": true,
                destroy: true,
                data: dsDetalle,
                columns: columnasActividades,

            });



            filaPadre.addClass('shown');
        }
    });


}

function inicializaTablaHu(nombreTabla, datos) {
    tablasEncabezado2[nombreTabla] = $("#" + nombreTabla).dataTable({
        language: lenguajeEs,
        responsive: true,
        searching: true,
        "bSort": true,
        search: {
            smart: false
        },
        "bAutoWidth": false,
        "bLengthChange": true,
        "bPaginate": false,
        destroy: true,
        data: datos,
        columns: columnasEncActividadesHu,
        "order": [[1, 'asc']],

    });

    $('#' + nombreTabla + ' tbody').on('click', '.details-control', function () {
        filaPadre = $(this).closest('tr');

        var row = tablasEncabezado2[nombreTabla].api().row(filaPadre); //table.row(tr);

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            filaPadre.removeClass('shown');
            $("i", this).removeClass("fa-minus");
            $("i", this).addClass("fa-plus");
        }
        else {
            $("i", this).removeClass("fa-plus");
            $("i", this).addClass("fa-minus");

            // Open this row
            row.child(format2(row.data(), nombreTabla)).show();

            tablasDetalle2[nombreTabla + row.data().IdActividad] = $("." + nombreTabla + row.data().IdActividad).dataTable({
                responsive: true,
                "bSort": false,
                "bPaginate": false,
                "searching": false,
                "autoWidth": true,
                "bLengthChange": true,
                destroy: true,
                data: dsDetalle2,
                columns: columnasActividades,

            });



            filaPadre.addClass('shown');
        }
    });


}

function inicializaTablaClas(nombreTabla, datos) {
    tablasEncabezado[nombreTabla] = $("#" + nombreTabla).dataTable({
        language: lenguajeEs,
        responsive: true,
        searching: true,
        "bSort": true,
        search: {
            smart: false
        },
        "bAutoWidth": false,
        "bLengthChange": true,
        "bPaginate": false,
        destroy: true,
        data: datos,
        columns: columnasEncActividades,
        "order": [[1, 'asc']],

    });

    $('#' + nombreTabla + ' tbody').on('click', '.details-control', function () {
        filaPadre = $(this).closest('tr');

        var row = tablasEncabezado[nombreTabla].api().row(filaPadre); //table.row(tr);

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            filaPadre.removeClass('shown');
            $("i", this).removeClass("fa-minus");
            $("i", this).addClass("fa-plus");
        }
        else {
            $("i", this).removeClass("fa-plus");
            $("i", this).addClass("fa-minus");

            // Open this row
            row.child(formatclas(row.data(), nombreTabla)).show();

            tablasDetalle[nombreTabla + row.data().ClaveTipoActividad] = $("." + nombreTabla + row.data().ClaveTipoActividad).dataTable({
                responsive: true,
                "bSort": false,
                "bPaginate": false,
                "searching": false,
                "autoWidth": true,
                "bLengthChange": true,
                destroy: true,
                data: dsDetalle,
                columns: columnasActividades,

            });



            filaPadre.addClass('shown');
        }
    });


}

function inicializaTablaAsig(nombreTabla, datos) {
    tablasEncabezado[nombreTabla] = $("#" + nombreTabla).dataTable({
        language: lenguajeEs,
        responsive: true,
        searching: true,
        "bSort": true,
        search: {
            smart: false
        },
        "bAutoWidth": false,
        "bLengthChange": true,
        "bPaginate": false,
        destroy: true,
        data: datos,
        columns: columnasEncActividadesUser,
        "order": [[1, 'asc']],

    });

    $('#' + nombreTabla + ' tbody').on('click', '.details-control', function () {
        filaPadre = $(this).closest('tr');

        var row = tablasEncabezado[nombreTabla].api().row(filaPadre); //table.row(tr);

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            filaPadre.removeClass('shown');
            $("i", this).removeClass("fa-minus");
            $("i", this).addClass("fa-plus");
        }
        else {
            $("i", this).removeClass("fa-plus");
            $("i", this).addClass("fa-minus");

            // Open this row
            row.child(formatasig(row.data(), nombreTabla)).show();

            tablasDetalle[nombreTabla + row.data().ClaveTipoActividad] = $("." + nombreTabla + row.data().ClaveTipoActividad).dataTable({
                responsive: true,
                "bSort": false,
                "bPaginate": false,
                "searching": false,
                "autoWidth": true,
                "bLengthChange": true,
                destroy: true,
                data: dsDetalle,
                columns: columnasActividades,

            });



            filaPadre.addClass('shown');
        }
    });


}



function refrescaTablaAct() {
    tablasEncabezado['TblActividadesSprintA'].api().clear().rows.add(dsEncabezado).draw();
    tablasEncabezado['TblActividadesAsignadoA'].api().clear().rows.add(dsAsignado).draw();
    tablasEncabezado['TblActividadesClasificacionA'].api().clear().rows.add(dsClasificacion).draw();
}
function refrescaTablaAct2() {
    tablasEncabezado2['TblActividadesSprintHu'].api().clear().rows.add(dsHus).draw();
}

function format(d, nombreTabla) {
    var htmlDetalle = '';

    dsDetalle = $.grep(dsActividadesSprint, function (a, b) {
        return a.ClaveTipoActividad === d.ClaveTipoActividad;
    });
    htmlDetalle = htmlTablaDetalle.replace('@tabla', nombreTabla + d.ClaveTipoActividad);
    htmlDetalle = htmlDetalle.replace('tablaDetalle', nombreTabla + d.ClaveTipoActividad);

    return htmlDetalle;

}


function formatclas(d, nombreTabla) {
    var htmlDetalle = '';

    dsDetalle = $.grep(dsActividadesSprint, function (a, b) {
        return a.ClaveClasificacionActividad === d.ClaveTipoActividad;
    });
    htmlDetalle = htmlTablaDetalle.replace('@tabla', nombreTabla + d.ClaveTipoActividad);
    htmlDetalle = htmlDetalle.replace('tablaDetalle', nombreTabla + d.ClaveTipoActividad);

    return htmlDetalle;

}
function formatasig(d, nombreTabla) {
    var htmlDetalle = '';

    dsDetalle = $.grep(dsActividadesSprint, function (a, b) {
        return a.ClaveUsuario === d.ClaveTipoActividad;
    });
    htmlDetalle = htmlTablaDetalle.replace('@tabla', nombreTabla + d.ClaveTipoActividad);
    htmlDetalle = htmlDetalle.replace('tablaDetalle', nombreTabla + d.ClaveTipoActividad);

    return htmlDetalle;

}


function format2(d, nombreTabla) {
    var htmlDetalle = '';

    dsDetalle2 = $.grep(dsActividadesSprint, function (a, b) {
        return a.IdActividadR1 === d.IdActividad;
    });
    htmlDetalle = htmlTablaDetalle.replace('@tabla', nombreTabla + d.IdActividad);
    htmlDetalle = htmlDetalle.replace('tablaDetalle', nombreTabla + d.IdActividad);

    return htmlDetalle;

}

$(document).on('click', '#BtnVerTodo', function (e) {

    $("#BtnVerTodo").removeClass("btn-default");
    $("#BtnVerTodo").addClass("btn-info");

    $("#BtnVerFases").removeClass("btn-info");
    $("#BtnVerFases").addClass("btn-default");

    $("#BtnVerHUS").removeClass("btn-info");
    $("#BtnVerHUS").addClass("btn-default");


    $("#BtnVerClasificacion").removeClass("btn-info");
    $("#BtnVerClasificacion").addClass("btn-default");

    $("#BtnVerAsignado").removeClass("btn-info");
    $("#BtnVerAsignado").addClass("btn-default");


    $("#divtblTodo").show();
    $("#divtblFases").hide();
    $("#divtblHus").hide();
    $("#divtblClasificacion").hide();
    $("#divtblAsignado").hide();
    return false;
});



$(document).on('click', '#BtnVerFases', function (e) {

    $("#BtnVerFases").removeClass("btn-default");
    $("#BtnVerFases").addClass("btn-info");

    $("#BtnVerTodo").removeClass("btn-info");
    $("#BtnVerTodo").addClass("btn-default");

    $("#BtnVerHUS").removeClass("btn-info");
    $("#BtnVerHUS").addClass("btn-default");

    $("#BtnVerClasificacion").removeClass("btn-info");
    $("#BtnVerClasificacion").addClass("btn-default");

    $("#BtnVerAsignado").removeClass("btn-info");
    $("#BtnVerAsignado").addClass("btn-default");


    $("#divtblFases").show();
    $("#divtblTodo").hide();
    $("#divtblHus").hide();
    $("#divtblClasificacion").hide();
    $("#divtblAsignado").hide();
    return false;
});


$(document).on('click', '#BtnVerHUS', function (e) {

    $("#BtnVerFases").removeClass("btn-info");
    $("#BtnVerFases").addClass("btn-default");

    $("#BtnVerTodo").removeClass("btn-info");
    $("#BtnVerTodo").addClass("btn-default");

    $("#BtnVerHUS").removeClass("btn-default");
    $("#BtnVerHUS").addClass("btn-info");

    $("#BtnVerClasificacion").removeClass("btn-info");
    $("#BtnVerClasificacion").addClass("btn-default");

    $("#BtnVerAsignado").removeClass("btn-info");
    $("#BtnVerAsignado").addClass("btn-default");



    $("#divtblHus").show();
    $("#divtblFases").hide();
    $("#divtblTodo").hide();
    $("#divtblClasificacion").hide();
    $("#divtblAsignado").hide();


    return false;
});


$(document).on('click', '#BtnVerClasificacion', function (e) {

    $("#BtnVerClasificacion").addClass("btn-info");
    $("#BtnVerClasificacion").removeClass("btn-default");

    $("#BtnVerTodo").removeClass("btn-info");
    $("#BtnVerTodo").addClass("btn-default");

    $("#BtnVerHUS").removeClass("btn-info");
    $("#BtnVerHUS").addClass("btn-default");
 

    $("#BtnVerFases").removeClass("btn-info");
    $("#BtnVerFases").addClass("btn-default");

    $("#BtnVerAsignado").removeClass("btn-info");
    $("#BtnVerAsignado").addClass("btn-default");



    $("#divtblClasificacion").show();
    $("#divtblFases").hide();
    $("#divtblTodo").hide();
    $("#divtblAsignado").hide();
    $("#divtblHus").hide();


    return false;
});

$(document).on('click', '#BtnVerAsignado', function (e) {

    $("#BtnVerAsignado").addClass("btn-info");
    $("#BtnVerAsignado").removeClass("btn-default");

    $("#BtnVerTodo").removeClass("btn-info");
    $("#BtnVerTodo").addClass("btn-default");

    $("#BtnVerHUS").removeClass("btn-info");
    $("#BtnVerHUS").addClass("btn-default");


    $("#BtnVerFases").removeClass("btn-info");
    $("#BtnVerFases").addClass("btn-default");

    $("#BtnVerClasificacion").removeClass("btn-info");
    $("#BtnVerClasificacion").addClass("btn-default");



    $("#divtblAsignado").show();
    $("#divtblFases").hide();
    $("#divtblTodo").hide();
    $("#divtblClasificacion").hide();
    $("#divtblHus").hide();


    return false;
});



$(document).on('change', '#SelEstatusASP', function (e) {


    CargarSprintActividades();
    $(".headersprint").show();

    return false;

});


$("#BtnImportarAct").click(function () {

    $("#FlImportaActividades").parent().next().text("");
    $("#FlImportaActividades").val("");
    $('#BtnImportarActividad').addClass('hidden');
    $('#ModalImportarActividades').modal({ keyboard: false });

    return false;

});
$(document).on("change", "#FlImportaActividades", function (e) {
    $("#FlImportaActividades").parent().next().next().text("");



    if (e.target.files != undefined) {

        var reader = new FileReader();

        reader.onload = function (f) {

            $('#BtnImportarActividad').removeClass('hidden');
        };
        reader.readAsDataURL(e.target.files.item(0));
    }

});

$(document).on('click', '#BtnImportarActividad', function (e) {


    ImportaArchivo();

    return false;
});

function ImportaArchivo() {
    var url = $('#urlImportaActividades').val();

    var form_data = new FormData();
    form_data.append("Archivo", $("#FlImportaActividades").prop("files")[0]);
    form_data.append("Tipo", $('input:radio[name=TipoCarga]:checked').val());


    $.ajax({
        url: url,
        type: "POST",
        contentType: false,
        //dataType: "script",
        data: form_data,
        processData: false,
        async: false,
        success: function (Respuesta) {

            var Resultado = Respuesta.split('|');


            $('div.pg-loading-screen').remove();
            if (Resultado[0] == "E") {

                CargarSprintActividades();
                MensajeExito(Resultado[1]);
            }
            else {
                CargarSprintActividades();
                MensajeAdvertencia(Resultado[1]);
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            var err = eval("(" + xhr.responseText + ")");
            MensajeError(err.Message);
        }
    });
}



$(document).on('click', '#BtnCompartirSprint', function (e) {

    ConsultaSprintCompartir();
    $('#ModalShareSR').modal('show');

});


$(document).on('click', '#BtnGuardarCompartirSR', function (e) {

    GuardarCompartirSprint();
    return false;

});



async function ConsultaSprintCompartir() {


    const data = await POST('/Proyectos/ConsultaSprintCompartir', { IdIteracion: $("#IdIteracion").val() });

    if (data.Exito) {

        var dso = JSON.parse(data.LstCompartir);


        $('#SelUsuariosShareSR').val(dso);
        $('#SelUsuariosShareSR').selectpicker('refresh');

    }
    else {

        MensajeError(data.Mensaje);
    }

}


async function GuardarCompartirSprint() {


    const data = await POST('/Proyectos/GuardarSprintCompartir', { IdIteracion: $("#IdIteracion").val(), LstUsuarios: $('#SelUsuariosShareSR').val() });

    if (data.Exito) {

        $('#ModalShareSR').modal('hide');
        MensajeExito("Los datos se guardaron correctamente.");

    }
    else {

        MensajeError(data.Mensaje);
    }

}


//function CapturaTrabajo(IdActividad, PSP, Descripcion) {
//    if (PSP === 1) {
//        var url = $('#urlTracking').val() + "?Id=" + IdActividad;
//        window.open(url, '_blank');

//    } else {

//        $("#IdActividadCTra").val(IdActividad);
//        $("#LblActividadDesc").text(IdActividad + "-" + Descripcion);
//        var date = new Date();
//        $('#TxtFechaTrab').datetimepicker(
//            {
//                format: 'DD/MM/YYYY',
//                maxDate: date
//            });
//        $("#TxtTiempo").val("");
//        $("#TxtComentarioTrabajo").val("");
//        CargarTrabajos();

//        $('#ModalCapturarTrabajo').modal({ backdrop: 'static', keyboard: false });
//        var tm = false;
//        $('#ModalCapturarTrabajo').on('hidden.bs.modal', function () {

//            var a = tm;
//            if (tm) { tm = false; return; }
//            else { tm = true; CargaActividadesPanel(); }


//        });


//    }
//}
